<template>
  <CatalogScreenFrame
    anchor="viewer3d"
    :badge="t.tdBadge"
    :title="t.tdTitle"
    :desc="t.tdDesc"
    :t="t"
  >
    <template #default="{ isFull }">
      <div
        class="vw-shell"
        :class="{ 'vw-shell--full': isFull }"
      >
        <!-- file chip -->
        <span class="vw-chip">{{ clipName }} · 60 fps · 240 frames</span>

        <!-- viewport (drag to rotate) + drop zone overlay -->
        <div
          ref="viewport"
          class="vw-viewport"
          @dragover.prevent="dragHover = true"
          @dragleave="dragHover = false"
          @drop.prevent="onDrop"
        >
          <div
            v-if="!ready"
            class="vw-fallback"
          >
            {{ t.tdLoading }}
          </div>
          <div
            class="vw-drop"
            :class="{ 'vw-drop--active': dragHover }"
            aria-hidden="true"
          >
            <span>{{ t.tdDrop }}</span>
          </div>
        </div>

        <!-- transport controls -->
        <div class="vw-controls">
          <button
            type="button"
            class="vw-play"
            :aria-label="playing ? t.tdPause : t.tdPlay"
            @click="togglePlay"
          >
            <svg
              v-if="!playing"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            ><path d="M7 4l13 8-13 8z" /></svg>
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            ><rect
              x="6"
              y="5"
              width="4"
              height="14"
              rx="1"
            /><rect
              x="14"
              y="5"
              width="4"
              height="14"
              rx="1"
            /></svg>
            {{ playing ? t.tdPause : t.tdPlay }}
          </button>

          <input
            v-model.number="frame"
            class="vw-scrub"
            type="range"
            min="0"
            max="240"
            step="1"
            :aria-label="t.tdTimeline"
            @input="onScrub"
          >
          <span class="vw-frame">{{ Math.round(frame) }} / 240</span>
        </div>
      </div>
    </template>
  </CatalogScreenFrame>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CatalogScreenFrame from './CatalogScreenFrame.vue'
import type { CatalogStrings } from './catalogI18n'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const viewport = ref<HTMLElement | null>(null)
const ready = ref(false)
const playing = ref(true)
const frame = ref(0)
const dragHover = ref(false)
const clipName = ref('walk_cycle.fbx')

// Minimal structural typings for the bits of three we touch (lazy-imported).
type ThreeModule = typeof import('three')
type Obj3D = { rotation: { x: number; y: number }; position: { y: number }; add: (...o: unknown[]) => void }
type Mesh = { rotation: { x: number; z: number }; position: { x: number; y: number; z: number } }
type MaterialWithColor = { color: { set: (c: string | number) => void } }

let THREE: ThreeModule | null = null
let renderer: { setSize: (w: number, h: number) => void; setPixelRatio: (r: number) => void; render: (s: unknown, c: unknown) => void; dispose: () => void; domElement: HTMLCanvasElement } | null = null
let scene: { add: (o: unknown) => void } | null = null
let camera: { aspect: number; updateProjectionMatrix: () => void } | null = null
let rig: Obj3D | null = null
const limbs: Record<string, Mesh> = {}
const brandMaterials: MaterialWithColor[] = []
let raf = 0
let resizeObs: ResizeObserver | null = null
let themeObs: MutationObserver | null = null

// Drag-to-rotate state.
let rotX = 0.05
let rotY = 0.5
let dragging = false
let lastX = 0
let lastY = 0

function brandColor(): string {
  if (typeof getComputedStyle === 'undefined' || typeof document === 'undefined') return '#4f26db'
  const v = getComputedStyle(document.documentElement).getPropertyValue('--ntk-primary').trim()
  return v || '#4f26db'
}

function applyBrand(): void {
  const c = brandColor()
  for (const m of brandMaterials) m.color.set(c)
}

onMounted(async () => {
  // LAZY-import three so it never bloats the initial bundle and the rest of the
  // catalog keeps working even if three is absent.
  try {
    THREE = await import('three')
  } catch {
    ready.value = false
    return
  }
  if (!viewport.value) return
  buildScene()
  ready.value = true
  attachDrag()
  observe()
  loop()
})

function buildScene(): void {
  if (!THREE || !viewport.value) return
  const el = viewport.value
  const w = el.clientWidth || 600
  const h = el.clientHeight || 320

  scene = new THREE.Scene()
  const sky = new THREE.Color('#eef0f5')
  ;(scene as unknown as { background: unknown }).background = sky

  camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100)
  ;(camera as unknown as { position: { set: (x: number, y: number, z: number) => void } }).position.set(0, 1.9, 7.6)
  ;(camera as unknown as { lookAt: (x: number, y: number, z: number) => void }).lookAt(0, 1.6, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true }) as unknown as typeof renderer
  renderer!.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer!.setSize(w, h)
  el.appendChild(renderer!.domElement)

  // lights
  const amb = new THREE.AmbientLight(0xffffff, 0.75)
  const dir = new THREE.DirectionalLight(0xffffff, 0.9)
  ;(dir as unknown as { position: { set: (x: number, y: number, z: number) => void } }).position.set(3, 6, 4)
  scene!.add(amb)
  scene!.add(dir)

  // ground grid
  const grid = new THREE.GridHelper(16, 16, 0xc7ccd6, 0xdde1e8)
  scene!.add(grid)

  // brand material (follows --ntk-primary) + a darker accent for limbs
  const matBrand = new THREE.MeshStandardMaterial({ color: brandColor(), roughness: 0.55, metalness: 0.05 })
  const matDark = new THREE.MeshStandardMaterial({ color: brandColor(), roughness: 0.6, metalness: 0.05 })
  const matHead = new THREE.MeshStandardMaterial({ color: '#1f2430', roughness: 0.5, metalness: 0.1 })
  brandMaterials.push(matBrand as unknown as MaterialWithColor, matDark as unknown as MaterialWithColor)

  rig = new THREE.Group() as unknown as Obj3D

  const box = (x: number, y: number, z: number, mat: unknown): Mesh => {
    const m = new THREE!.Mesh(new THREE!.BoxGeometry(x, y, z), mat) as unknown as Mesh
    return m
  }
  const place = (m: Mesh, px: number, py: number, pz: number): Mesh => {
    m.position.x = px
    m.position.y = py
    m.position.z = pz
    ;(rig as unknown as { add: (o: unknown) => void }).add(m)
    return m
  }

  // torso + head
  place(box(0.9, 1.0, 0.5, matBrand), 0, 2.0, 0)
  place(box(0.55, 0.55, 0.55, matHead), 0, 2.85, 0)
  // arms
  limbs.armL = place(box(0.22, 0.95, 0.22, matDark), -0.62, 2.05, 0)
  limbs.armR = place(box(0.22, 0.95, 0.22, matDark), 0.62, 2.05, 0)
  // legs
  limbs.legL = place(box(0.28, 1.0, 0.28, matBrand), -0.24, 1.0, 0)
  limbs.legR = place(box(0.28, 1.0, 0.28, matBrand), 0.24, 1.0, 0)

  scene!.add(rig)
}

function poseFromFrame(f: number): void {
  if (!rig) return
  const t = (f / 240) * Math.PI * 2
  const swing = Math.sin(t) * 0.55
  if (limbs.legL) limbs.legL.rotation.x = swing
  if (limbs.legR) limbs.legR.rotation.x = -swing
  if (limbs.armL) limbs.armL.rotation.x = -swing
  if (limbs.armR) limbs.armR.rotation.x = swing
  // subtle vertical bob
  rig.position.y = Math.abs(Math.sin(t)) * 0.08
  rig.rotation.x = rotX
  rig.rotation.y = rotY
}

function loop(): void {
  raf = requestAnimationFrame(loop)
  if (playing.value) {
    frame.value = (frame.value + 1.4) % 240
  }
  poseFromFrame(frame.value)
  if (renderer && scene && camera) renderer.render(scene, camera)
}

function togglePlay(): void {
  playing.value = !playing.value
}

function onScrub(): void {
  poseFromFrame(frame.value)
}

function attachDrag(): void {
  const el = viewport.value
  if (!el) return
  el.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

function onDown(e: PointerEvent): void {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
}
function onMove(e: PointerEvent): void {
  if (!dragging) return
  rotY += (e.clientX - lastX) * 0.01
  rotX += (e.clientY - lastY) * 0.01
  rotX = Math.max(-0.6, Math.min(0.6, rotX))
  lastX = e.clientX
  lastY = e.clientY
}
function onUp(): void {
  dragging = false
}

function onDrop(e: DragEvent): void {
  dragHover.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) clipName.value = file.name
}

function observe(): void {
  const el = viewport.value
  if (el && typeof ResizeObserver !== 'undefined') {
    resizeObs = new ResizeObserver(() => {
      if (!renderer || !camera || !el) return
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    resizeObs.observe(el)
  }
  // re-resolve brand color on theme / brand / inline-style changes to <html>
  if (typeof MutationObserver !== 'undefined') {
    themeObs = new MutationObserver(() => applyBrand())
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-brand', 'style'],
    })
  }
}

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  resizeObs?.disconnect()
  themeObs?.disconnect()
  const el = viewport.value
  el?.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
  }
  renderer = null
  scene = null
  camera = null
  rig = null
})
</script>

<style scoped>
.vw-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow);
  overflow: hidden;
}

.vw-chip {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  border-radius: var(--ds-radius-pill);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  font-size: 11.5px;
  font-weight: 600;
}

.vw-viewport {
  position: relative;
  height: 360px;
  cursor: grab;
  touch-action: none;
  background: #eef0f5;
}

.vw-shell--full .vw-viewport {
  height: calc(100vh - 150px);
}

.vw-viewport:active {
  cursor: grabbing;
}

.vw-viewport :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.vw-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-color-text-muted);
  font-size: 13px;
}

.vw-drop {
  position: absolute;
  inset: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 16px;
  border: 2px dashed transparent;
  border-radius: var(--ds-radius-lg);
  pointer-events: none;
  transition: border-color 0.15s, background 0.15s;
}

.vw-drop span {
  font-size: 12px;
  color: var(--ds-color-text-muted);
  opacity: 0;
  transition: opacity 0.15s;
}

.vw-drop--active {
  border-color: var(--ds-color-primary);
  background: color-mix(in srgb, var(--ds-color-primary) 8%, transparent);
}

.vw-drop--active span {
  opacity: 1;
  color: var(--ds-color-primary);
  font-weight: 600;
}

.vw-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-top: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
}

.vw-play {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 16px;
  border-radius: var(--ds-radius-md);
  border: none;
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
  font-family: var(--ds-font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.vw-play:hover {
  filter: brightness(0.95);
}

.vw-scrub {
  flex: 1;
  accent-color: var(--ds-color-primary);
  cursor: pointer;
}

.vw-frame {
  font-family: var(--ds-font-mono);
  font-size: 12px;
  color: var(--ds-color-text-muted);
  min-width: 62px;
  text-align: right;
}
</style>