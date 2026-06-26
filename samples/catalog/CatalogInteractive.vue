<template>
  <section
    id="interativos"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="11"
      :title="t.interTitle"
      :desc="t.interDesc"
    />

    <!-- Kanban -->
    <div class="cg-block">
      <span class="cg-eyebrow">{{ t.kanbanTitle }}</span>
      <span class="cg-blockdesc">{{ t.kanbanDesc }}</span>
      <div class="cg-kanban">
        <div
          v-for="col in kanbanColumns"
          :key="col.key"
          class="cg-kbcol"
          @dragover.prevent
          @drop="dropCard(col.key)"
        >
          <div class="cg-kbcol__hd">
            <span>{{ t[col.labelKey] }}</span>
            <span class="cg-mono cg-kbcol__count">{{ kanban[col.key].length }}</span>
          </div>
          <div
            v-for="id in kanban[col.key]"
            :key="id"
            class="cg-kbcard"
            :style="{ borderLeftColor: `var(--ds-color-${kanbanCards[id].tone})` }"
            draggable="true"
            @dragstart="dragCard = id"
          >
            {{ kanbanCards[id].title }}
          </div>
        </div>
      </div>
    </div>

    <!-- Agenda -->
    <div class="cg-block">
      <span class="cg-eyebrow">{{ t.agendaTitle }}</span>
      <span class="cg-blockdesc">{{ t.agendaDesc }}</span>
      <div class="cg-agenda">
        <div
          v-for="(label, i) in dayLabels"
          :key="i"
          class="cg-agday"
          @dragover.prevent
          @drop="dropEvent(i)"
        >
          <span class="cg-agday__label">{{ label }}</span>
          <div
            v-for="id in agenda[i]"
            :key="id"
            class="cg-agev"
            :style="eventStyle(agendaEvents[id].tone)"
            draggable="true"
            @dragstart="dragEvent = id"
          >
            <span class="cg-agev__time cg-mono">{{ agendaEvents[id].time }}</span> {{ agendaEvents[id].title }}
          </div>
        </div>
      </div>
    </div>

    <!-- Drawing board -->
    <div class="cg-block">
      <span class="cg-eyebrow">{{ t.drawTitle }}</span>
      <span class="cg-blockdesc">{{ t.drawDesc }}</span>
      <div class="cg-drawbar">
        <div class="cg-drawbar__colors">
          <button
            v-for="c in drawSwatches"
            :key="c"
            type="button"
            class="cg-drawswatch"
            :class="{ 'is-active': drawColor === c }"
            :style="{ background: c }"
            aria-label="cor"
            @click="drawColor = c"
          />
        </div>
        <div class="cg-drawbar__widths">
          <button
            v-for="w in drawWidths"
            :key="w"
            type="button"
            class="cg-drawseg"
            :class="{ 'is-active': drawWidth === w }"
            @click="drawWidth = w"
          >
            {{ w }}px
          </button>
        </div>
        <button
          type="button"
          class="cg-drawclear"
          @click="clearDraw"
        >
          {{ t.drawClear }}
        </button>
      </div>
      <div class="cg-canvaswrap">
        <canvas
          ref="canvasEl"
          class="cg-canvas"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, type CSSProperties } from 'vue'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  agendaDays,
  agendaDaysEn,
  agendaEvents,
  drawSwatches,
  drawWidths,
  initialAgenda,
  initialKanban,
  kanbanCards,
  kanbanColumns,
  type GalleryTone,
  type KanbanColumnKey,
} from './catalogGalleryData'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

/* ---- Kanban drag & drop ---- */
const kanban = reactive<Record<KanbanColumnKey, string[]>>({
  todo: [...initialKanban.todo],
  doing: [...initialKanban.doing],
  done: [...initialKanban.done],
})
const dragCard = ref<string | null>(null)

function dropCard(target: KanbanColumnKey): void {
  const id = dragCard.value
  if (!id) return
  for (const key of Object.keys(kanban) as KanbanColumnKey[]) {
    const idx = kanban[key].indexOf(id)
    if (idx >= 0) kanban[key].splice(idx, 1)
  }
  kanban[target].push(id)
  dragCard.value = null
}

/* ---- Agenda drag & drop ---- */
const dayLabels = computed(() => (props.locale === 'en' ? agendaDaysEn : agendaDays))
const agenda = reactive<Record<number, string[]>>({
  0: [...initialAgenda[0]],
  1: [...initialAgenda[1]],
  2: [...initialAgenda[2]],
  3: [...initialAgenda[3]],
  4: [...initialAgenda[4]],
})
const dragEvent = ref<string | null>(null)

function dropEvent(target: number): void {
  const id = dragEvent.value
  if (!id) return
  for (let i = 0; i < 5; i++) {
    const idx = agenda[i].indexOf(id)
    if (idx >= 0) agenda[i].splice(idx, 1)
  }
  agenda[target].push(id)
  dragEvent.value = null
}

function eventStyle(tone: GalleryTone): CSSProperties {
  return {
    background: `var(--ds-color-${tone}-soft)`,
    color: `var(--ds-color-${tone})`,
    borderLeftColor: `var(--ds-color-${tone})`,
  }
}

/* ---- Drawing board ---- */
const canvasEl = ref<HTMLCanvasElement | null>(null)
const drawColor = ref<string>('#4f26db')
const drawWidth = ref<number>(3)
let drawing = false
let ctx: CanvasRenderingContext2D | null = null
let last: { x: number; y: number } | null = null

function resizeCanvas(): void {
  const el = canvasEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  el.width = Math.max(1, Math.round(rect.width * dpr))
  el.height = Math.max(1, Math.round(rect.height * dpr))
  ctx = el.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }
}

function pointAt(e: PointerEvent): { x: number; y: number } {
  const el = canvasEl.value as HTMLCanvasElement
  const rect = el.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onPointerDown(e: PointerEvent): void {
  if (!ctx) return
  drawing = true
  last = pointAt(e)
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent): void {
  if (!drawing || !ctx || !last) return
  const p = pointAt(e)
  ctx.strokeStyle = drawColor.value
  ctx.lineWidth = drawWidth.value
  ctx.beginPath()
  ctx.moveTo(last.x, last.y)
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
  last = p
}

function onPointerUp(): void {
  drawing = false
  last = null
}

function clearDraw(): void {
  const el = canvasEl.value
  if (!el || !ctx) return
  ctx.clearRect(0, 0, el.width, el.height)
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-margin-top: 92px;
}

.cg-block {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.cg-eyebrow {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.cg-blockdesc {
  font-size: 12px;
  color: var(--ds-color-text-muted);
}

.cg-mono {
  font-family: var(--ds-font-mono);
}

/* Kanban */
.cg-kanban {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.cg-kbcol {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface-muted);
  padding: 11px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 170px;
}

.cg-kbcol__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ds-color-text-muted);
}

.cg-kbcol__count {
  background: var(--ds-color-surface);
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: 999px;
  padding: 0 7px;
}

.cg-kbcard {
  padding: 9px 11px;
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-left: 3px solid var(--ds-color-primary);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ds-color-text);
  cursor: grab;
  box-shadow: var(--ds-shadow-sm);
  user-select: none;
}

/* Agenda */
.cg-agenda {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.cg-agday {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 150px;
}

.cg-agday__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ds-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cg-agev {
  padding: 6px 8px;
  border-radius: var(--ds-radius-sm);
  border-left: 3px solid var(--ds-color-primary);
  font-size: 11.5px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
}

.cg-agev__time {
  opacity: 0.7;
}

/* Drawing board */
.cg-drawbar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 8px 11px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
}

.cg-drawbar__colors {
  display: flex;
  gap: 7px;
  align-items: center;
}

.cg-drawswatch {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  cursor: pointer;
  border: 2px solid var(--ds-color-surface);
  box-shadow: 0 0 0 1px var(--ds-color-border);
  padding: 0;
}

.cg-drawswatch.is-active {
  box-shadow: 0 0 0 2px var(--ds-color-text);
}

.cg-drawbar__widths {
  display: flex;
  gap: 3px;
  padding: 3px;
  background: var(--ds-color-surface-muted);
  border-radius: var(--ds-radius-pill);
}

.cg-drawseg {
  appearance: none;
  border: none;
  border-radius: var(--ds-radius-pill);
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  cursor: pointer;
  line-height: 1;
  white-space: nowrap;
  background: transparent;
  color: var(--ds-color-text-muted);
}

.cg-drawseg.is-active {
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
}

.cg-drawclear {
  margin-left: auto;
  height: 32px;
  padding: 0 14px;
  border-radius: var(--ds-radius-md);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-family: var(--ds-font-sans);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.cg-drawclear:hover {
  background: var(--ds-color-surface-muted);
}

.cg-canvaswrap {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  height: 320px;
  background: var(--ds-color-surface);
  background-image: radial-gradient(var(--ds-color-border) 1px, transparent 1px);
  background-size: 18px 18px;
}

.cg-canvas {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  cursor: crosshair;
}
</style>