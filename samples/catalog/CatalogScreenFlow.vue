<template>
  <CatalogScreenFrame
    anchor="fluxo"
    :badge="t.flowBadge"
    :title="t.navFlow"
    :desc="t.flowDesc"
    :t="t"
  >
    <template #default="{ isFull }">
      <!-- N8N-style flow editor: left palette + dotted SVG canvas. -->
      <div
        class="fl-shell"
        :class="{ 'fl-shell--full': isFull }"
      >
        <!-- Componentes palette -->
        <aside class="fl-palette">
          <span class="fl-palette__title">{{ t.bpmPalette }}</span>
          <div
            v-for="item in flowPalette"
            :key="item.kind"
            class="fl-palette__item"
            draggable="true"
            @dragstart="onPaletteDragStart(item.kind, $event)"
          >
            <span
              class="fl-palette__dot"
              :style="{ background: `var(--ds-color-${flowKindTone[item.kind]})` }"
            />
            {{ t[item.labelKey] }}
          </div>
        </aside>

        <!-- Canvas (scrolls); the inner stage is a fixed pixel coordinate space
             shared by the SVG edges and the absolutely-positioned nodes. -->
        <div
          class="fl-canvas"
          @dragover.prevent
          @drop="onCanvasDrop"
        >
          <div
            ref="stageEl"
            class="fl-stage"
            :style="{ width: CANVAS_W + 'px', height: CANVAS_H + 'px' }"
          >
            <svg
              class="fl-edges"
              :viewBox="`0 0 ${CANVAS_W} ${CANVAS_H}`"
              :width="CANVAS_W"
              :height="CANVAS_H"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="fl-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M0 0L10 5L0 10z"
                    fill="var(--ds-color-border-strong)"
                  />
                </marker>
              </defs>
              <path
                v-for="edge in edgePaths"
                :key="edge.key"
                :d="edge.d"
                class="fl-edge"
                fill="none"
                marker-end="url(#fl-arrow)"
              />
            </svg>

            <div
              v-for="node in nodes"
              :key="node.id"
              class="fl-node"
              :class="{ 'fl-node--dragging': dragId === node.id }"
              :style="nodeStyle(node)"
              role="button"
              tabindex="0"
              @pointerdown="onNodePointerDown(node.id, $event)"
            >
              <span
                class="fl-node__kind"
                :style="{ color: `var(--ds-color-${flowKindTone[node.kind]})` }"
              >{{ t[kindLabelKey[node.kind]] }}</span>
              <span class="fl-node__title">{{ t[node.titleKey] }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CatalogScreenFrame>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, type CSSProperties } from 'vue'
import CatalogScreenFrame from './CatalogScreenFrame.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  flowEdges,
  flowKindTone,
  flowNodes,
  flowPalette,
  type FlowKind,
} from './catalogScreensData'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const CANVAS_W = 1120
const CANVAS_H = 300
const NODE_W = 150
const NODE_H = 58

const kindLabelKey: Record<FlowKind, string> = {
  start: 'bpmStartK',
  task: 'bpmTaskK',
  gateway: 'bpmGatewayK',
  end: 'bpmEndK',
  event: 'bpmEventK',
}

interface FlowNode {
  id: string
  kind: FlowKind
  titleKey: string
  x: number
  y: number
}

let seq = 0
const nodes = reactive<FlowNode[]>(flowNodes.map((n) => ({ ...n })))
const stageEl = ref<HTMLElement | null>(null)

function nodeStyle(node: FlowNode): CSSProperties {
  return {
    transform: `translate(${node.x}px, ${node.y}px)`,
    borderLeftColor: `var(--ds-color-${flowKindTone[node.kind]})`,
  }
}

/* ---- bezier edge geometry (recomputes from reactive node positions) ---- */
const nodeById = computed<Record<string, FlowNode>>(() => {
  const map: Record<string, FlowNode> = {}
  for (const n of nodes) map[n.id] = n
  return map
})

const edgePaths = computed(() =>
  flowEdges
    .map((edge, i) => {
      const a = nodeById.value[edge.from]
      const b = nodeById.value[edge.to]
      if (!a || !b) return null
      const x1 = a.x + NODE_W
      const y1 = a.y + NODE_H / 2
      const x2 = b.x
      const y2 = b.y + NODE_H / 2
      const dx = Math.max(40, Math.abs(x2 - x1) * 0.5)
      return { key: `e${i}`, d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}` }
    })
    .filter((e): e is { key: string; d: string } => e !== null),
)

/* ---- node dragging ---- */
const dragId = ref<string | null>(null)
let offsetX = 0
let offsetY = 0

function onNodePointerDown(id: string, e: PointerEvent): void {
  const node = nodeById.value[id]
  if (!node || !stageEl.value) return
  dragId.value = id
  const rect = stageEl.value.getBoundingClientRect()
  offsetX = e.clientX - rect.left - node.x
  offsetY = e.clientY - rect.top - node.y
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent): void {
  const node = dragId.value ? nodeById.value[dragId.value] : null
  if (!node || !stageEl.value) return
  const rect = stageEl.value.getBoundingClientRect()
  node.x = clamp(e.clientX - rect.left - offsetX, 0, CANVAS_W - NODE_W)
  node.y = clamp(e.clientY - rect.top - offsetY, 0, CANVAS_H - NODE_H)
}

function onPointerUp(): void {
  dragId.value = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

/* ---- drop new node from palette ---- */
function onPaletteDragStart(kind: FlowKind, e: DragEvent): void {
  e.dataTransfer?.setData('text/ntk-flow-kind', kind)
}

const dropTitleKey: Record<FlowKind, string> = {
  start: 'bpmStart',
  task: 'bpmTask',
  gateway: 'bpmGateway',
  end: 'bpmEnd',
  event: 'bpmEvent',
}

function onCanvasDrop(e: DragEvent): void {
  const kind = e.dataTransfer?.getData('text/ntk-flow-kind') as FlowKind | ''
  if (!kind || !stageEl.value) return
  const rect = stageEl.value.getBoundingClientRect()
  seq += 1
  nodes.push({
    id: `n-new-${seq}`,
    kind,
    titleKey: dropTitleKey[kind],
    x: clamp(e.clientX - rect.left - NODE_W / 2, 0, CANVAS_W - NODE_W),
    y: clamp(e.clientY - rect.top - NODE_H / 2, 0, CANVAS_H - NODE_H),
  })
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<style scoped>
.fl-shell {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 0;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow);
  overflow: hidden;
  height: 300px;
}

.fl-shell--full {
  height: calc(100vh - 48px);
}

/* palette */
.fl-palette {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 14px;
  border-right: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
}

.fl-palette__title {
  font-family: var(--ds-font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ds-color-text-muted);
  margin-bottom: 2px;
}

.fl-palette__item {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 0 12px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 13px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
}

.fl-palette__item:hover {
  background: var(--ds-color-surface-muted);
  border-color: var(--ds-color-border-strong);
}

.fl-palette__item:active {
  cursor: grabbing;
}

.fl-palette__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  flex: 0 0 auto;
}

/* canvas (scroll viewport + dotted grid) */
.fl-canvas {
  position: relative;
  overflow: auto;
  background-color: var(--ds-color-bg);
  background-image: radial-gradient(circle, var(--ds-color-border) 1px, transparent 1.5px);
  background-size: 22px 22px;
  background-position: 11px 11px;
}

/* fixed pixel coordinate space shared by edges + nodes */
.fl-stage {
  position: relative;
}

.fl-edges {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.fl-edge {
  stroke: var(--ds-color-border-strong);
  stroke-width: 2;
}

.fl-node {
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  min-height: 58px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 9px 12px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-left: 3px solid var(--ds-color-primary);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.fl-node--dragging {
  cursor: grabbing;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 5;
}

.fl-node__kind {
  font-family: var(--ds-font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.fl-node__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ds-color-text);
  letter-spacing: -0.01em;
}
</style>