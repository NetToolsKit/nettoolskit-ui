<template>
  <CatalogScreenFrame
    anchor="industrial"
    :badge="t.indBadge"
    :title="t.indTitle"
    :desc="t.indDesc"
    :t="t"
  >
    <template #default="{ isFull }">
      <!-- Native SCADA-like engineering workspace built from the industrial Ds*
           set (DsAppShell · DsQuickAccessToolbar · DsRibbon · DsDockLayout ·
           DsTreeExplorer · DsDockPanel · DsWorkspaceCanvas · DsStatusBar).
           The embedded shell INHERITS the catalog `data-theme` (Light→light,
           Dark→proper dark, HC→hc) so it stays coherent with the rest of the
           catalog; brand accents (logo "N", ribbon active, status) follow the
           live brand hue via the `--ntk-*` tokens. No forced `machine` scope. -->
      <div
        class="ind-stage"
        :class="{ 'ind-stage--full': isFull }"
      >
        <DsAppShell class="ind-shell">
          <template #header="{ }">
            <header class="ind-titlebar">
              <span class="ind-titlebar__brand">
                <span class="ind-titlebar__logo">N</span>
                {{ t.indAppTitle }} — {{ activeDoc?.label ?? '—' }}
              </span>
              <DsQuickAccessToolbar
                :items="quickActions"
                variant="default"
                size="sm"
                aria-label="Quick access"
              />
            </header>
          </template>

          <div class="ind-body">
            <DsRibbon
              v-model:active-tab="activeTab"
              :tabs="ribbonTabs"
              aria-label="Ribbon"
              size="sm"
              density="compact"
            />

            <DsDockLayout
              class="ind-dock"
              aria-label="Engineering workspace"
              :left-size="232"
              :right-size="232"
              :bottom-size="148"
            >
              <template #left>
                <DsTreeExplorer
                  v-model:selected="selectedId"
                  :nodes="projectNodes"
                  :aria-label="t.indProject"
                  size="sm"
                  @update:selected="openDoc"
                  @toggle="onToggle"
                />
              </template>

              <!-- center: tabs + per-kind editing surface -->
              <div class="ind-host">
                <div
                  class="ind-tabs"
                  role="tablist"
                  :aria-label="t.indOpenDocs"
                >
                  <button
                    v-for="id in openDocs"
                    :key="id"
                    type="button"
                    role="tab"
                    class="ind-tab"
                    :class="{ 'is-active': id === activeId }"
                    @click="activeId = id; selectedId = id"
                  >
                    {{ docs[id].label }}
                    <span
                      class="ind-tab__x"
                      :aria-label="t.indClose"
                      @click.stop="closeDoc(id)"
                    >×</span>
                  </button>
                  <span
                    v-if="openDocs.length === 0"
                    class="ind-tabs__hint"
                  >{{ t.indPickFile }}</span>
                </div>

                <div class="ind-docbody">
                  <DsWorkspaceCanvas
                    v-if="activeDoc?.kind === 'screen'"
                    surface="dots"
                    :aria-label="activeDoc.label"
                  >
                    <template #header>
                      <span class="ind-canvashdr">{{ activeDoc.label }}</span>
                      <span class="ind-canvashint">{{ t.indCanvasHint }}</span>
                    </template>
                    <!-- Interactive SCADA canvas: device cards are draggable and
                         the connection lines recompute live (shared drag + bezier
                         model with the Fluxo/BPM editor). -->
                    <div
                      ref="canvasStage"
                      class="ind-canvas"
                      :style="{ width: DEV_W + 'px', height: DEV_H + 'px' }"
                    >
                      <svg
                        class="ind-canvas__edges"
                        :viewBox="`0 0 ${DEV_W} ${DEV_H}`"
                        :width="DEV_W"
                        :height="DEV_H"
                        aria-hidden="true"
                      >
                        <defs>
                          <marker
                            id="ind-arrow"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto-start-reverse"
                          >
                            <path
                              d="M0 0L10 5L0 10z"
                              fill="var(--ntk-border-strong)"
                            />
                          </marker>
                        </defs>
                        <path
                          v-for="edge in deviceEdgePaths"
                          :key="edge.key"
                          :d="edge.d"
                          class="ind-canvas__edge"
                          fill="none"
                          marker-end="url(#ind-arrow)"
                        />
                      </svg>

                      <div
                        v-for="w in devices"
                        :key="w.id"
                        class="ind-widget"
                        :class="{ 'ind-widget--dragging': devDragId === w.id }"
                        :style="{ transform: `translate(${w.x}px, ${w.y}px)`, borderTopColor: `var(--ntk-${w.tone})` }"
                        role="button"
                        tabindex="0"
                        @pointerdown="onDevicePointerDown(w.id, $event)"
                      >
                        <span class="ind-widget__lbl">{{ w.label }}</span>
                        <span
                          class="ind-widget__val"
                          :style="{ color: `var(--ntk-${w.tone})` }"
                        >{{ w.value }}</span>
                      </div>
                    </div>
                  </DsWorkspaceCanvas>

                  <div
                    v-else-if="activeDoc?.kind === 'code'"
                    class="ind-code"
                  >
                    <textarea
                      v-model="code"
                      spellcheck="false"
                      :aria-label="t.indCodeEditor"
                    />
                  </div>

                  <form
                    v-else-if="activeDoc?.kind === 'tag'"
                    class="ind-tagform"
                    @submit.prevent
                  >
                    <h3>{{ t.indEditTag }} — {{ activeDoc.label }}</h3>
                    <label>{{ t.indTagName }}<input :value="activeDoc.label"></label>
                    <label>{{ t.indTagType }}<input value="REAL"></label>
                    <label>{{ t.indTagAddr }}<input value="%MD120"></label>
                    <label>{{ t.indTagScale }}<input value="0 – 150 °C"></label>
                    <div class="ind-tagform__actions">
                      <DsButton
                        size="sm"
                        tone="primary"
                      >
                        {{ t.indApply }}
                      </DsButton>
                      <DsButton
                        size="sm"
                        tone="neutral"
                        variant="outline"
                      >
                        {{ t.indRevert }}
                      </DsButton>
                    </div>
                  </form>

                  <div
                    v-else
                    class="ind-empty"
                  >
                    {{ t.indNoDoc }}
                  </div>
                </div>
              </div>

              <template #right>
                <DsDockPanel
                  :title="t.indProperties"
                  variant="bordered"
                  size="sm"
                >
                  <dl class="ind-props">
                    <div
                      v-for="p in properties"
                      :key="p.k"
                      class="ind-props__row"
                    >
                      <dt>{{ p.k }}</dt>
                      <dd>{{ p.v }}</dd>
                    </div>
                  </dl>
                </DsDockPanel>
              </template>

              <template #bottom>
                <div class="ind-panels">
                  <button
                    v-for="p in bottomTabs"
                    :key="p.key"
                    type="button"
                    class="ind-panels__tab"
                    :class="{ 'is-active': bottomTab === p.key }"
                    @click="bottomTab = p.key"
                  >
                    {{ t[p.labelKey] }}
                    <span
                      v-if="p.count"
                      class="ind-panels__count"
                    >{{ p.count }}</span>
                  </button>
                  <div class="ind-panels__body">
                    <pre v-if="bottomTab === 'output'">{{ outputLog }}</pre>
                    <table
                      v-else-if="bottomTab === 'watch'"
                      class="ind-watch"
                    >
                      <tbody>
                        <tr
                          v-for="row in watchRows"
                          :key="row.tag"
                        >
                          <td>{{ row.tag }}</td>
                          <td>{{ row.type }}</td>
                          <td class="ind-watch__val">
                            {{ row.value }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <ul
                      v-else
                      class="ind-problems"
                    >
                      <li
                        v-for="(pr, i) in problems"
                        :key="i"
                      >
                        <span
                          class="ind-problems__sev"
                          :style="{ color: `var(--ntk-${pr.tone})` }"
                        >{{ pr.sev }}</span>
                        {{ pr.msg }}
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </DsDockLayout>
          </div>

          <template #footer>
            <DsStatusBar
              :segments="statusSegments"
              variant="bordered"
              size="sm"
              aria-label="Status"
            />
          </template>
        </DsAppShell>
      </div>
    </template>
  </CatalogScreenFrame>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import CatalogScreenFrame from './CatalogScreenFrame.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  DsAppShell,
  DsButton,
  DsDockLayout,
  DsDockPanel,
  DsQuickAccessToolbar,
  DsRibbon,
  DsStatusBar,
  DsTreeExplorer,
  DsWorkspaceCanvas,
  type NtkQuickAccessItem,
  type NtkRibbonTab,
  type NtkStatusBarSegment,
  type NtkTreeNode,
} from '../../index'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

interface Doc { id: string; label: string; kind: 'screen' | 'code' | 'tag' }
const docs: Record<string, Doc> = {
  screen1: { id: 'screen1', label: 'Linha_01.scr', kind: 'screen' },
  screen2: { id: 'screen2', label: 'Forno.scr', kind: 'screen' },
  main: { id: 'main', label: 'Main.st', kind: 'code' },
  motor: { id: 'motor', label: 'Motor_Run', kind: 'tag' },
  sensor: { id: 'sensor', label: 'Sensor_T', kind: 'tag' },
  setpoint: { id: 'setpoint', label: 'Setpoint', kind: 'tag' },
}

const openDocs = ref<string[]>(['screen1'])
const activeId = ref('screen1')
const selectedId = ref('screen1')
const activeDoc = computed<Doc | undefined>(() => docs[activeId.value])

const expanded = reactive<Record<string, boolean>>({ proj: true, screens: true, logic: true, tags: false })

function openDoc(id: string): void {
  selectedId.value = id
  if (!docs[id]) return
  if (!openDocs.value.includes(id)) openDocs.value.push(id)
  activeId.value = id
}
function closeDoc(id: string): void {
  openDocs.value = openDocs.value.filter((d) => d !== id)
  if (activeId.value === id) activeId.value = openDocs.value[openDocs.value.length - 1] ?? ''
}
function onToggle(id: string): void {
  expanded[id] = !expanded[id]
}

const code = ref(`PROGRAM Main
VAR
  Motor_Run : BOOL;
  Sensor_T  : REAL;
  Setpoint  : REAL := 80.0;
END_VAR

IF Sensor_T > Setpoint THEN
  Motor_Run := FALSE;   // sobreaquecimento
ELSE
  Motor_Run := TRUE;
END_IF`)

const quickActions: NtkQuickAccessItem[] = [
  { id: 'new', label: 'Novo', icon: 'new' },
  { id: 'open', label: 'Abrir', icon: 'open' },
  { id: 'save', label: 'Salvar', icon: 'save' },
  { id: 'run', label: 'Executar', icon: 'run', intent: 'success' },
  { id: 'stop', label: 'Parar', icon: 'stop', intent: 'danger' },
]

const activeTab = ref('home')
const ribbonTabs = computed<NtkRibbonTab[]>(() => [
  {
    id: 'home',
    label: props.t.indTabHome,
    groups: [
      { id: 'file', label: props.t.indGrpFile, commands: [
        { id: 'open', label: props.t.indCmdOpen, icon: 'open' },
        { id: 'save', label: props.t.indCmdSave, icon: 'save' },
      ] },
      { id: 'clip', label: props.t.indGrpClipboard, commands: [
        { id: 'cut', label: props.t.indCmdCut, icon: 'cut' },
        { id: 'copy', label: props.t.indCmdCopy, icon: 'copy' },
        { id: 'paste', label: props.t.indCmdPaste, icon: 'paste' },
      ] },
      { id: 'run', label: props.t.indGrpBuild, commands: [
        { id: 'run', label: props.t.indCmdRun, icon: 'run', intent: 'success' },
        { id: 'rebuild', label: props.t.indCmdRebuild, icon: 'redo' },
      ] },
    ],
  },
  {
    id: 'edit',
    label: props.t.indTabEdit,
    groups: [
      { id: 'history', label: props.t.indGrpHistory, commands: [
        { id: 'undo', label: props.t.indCmdUndo, icon: 'undo' },
        { id: 'redo', label: props.t.indCmdRedo, icon: 'redo' },
      ] },
      { id: 'find', label: props.t.indGrpFind, commands: [
        { id: 'search', label: props.t.indCmdSearch, icon: 'search' },
      ] },
    ],
  },
  {
    id: 'view',
    label: props.t.indTabView,
    groups: [
      { id: 'zoom', label: props.t.indGrpZoom, commands: [
        { id: 'zin', label: props.t.indCmdZoomIn, icon: 'zoom-in' },
        { id: 'zout', label: props.t.indCmdZoomOut, icon: 'zoom-out' },
        { id: 'grid', label: props.t.indCmdGrid, icon: 'grid' },
      ] },
    ],
  },
  {
    id: 'tools',
    label: props.t.indTabTools,
    groups: [
      { id: 'settings', label: props.t.indGrpSettings, commands: [
        { id: 'settings', label: props.t.indCmdSettings, icon: 'settings' },
      ] },
    ],
  },
  {
    id: 'debug',
    label: props.t.indTabDebug,
    groups: [
      { id: 'control', label: props.t.indGrpControl, commands: [
        { id: 'run', label: props.t.indCmdStart, icon: 'run', intent: 'success' },
        { id: 'pause', label: props.t.indCmdPause, icon: 'pause', intent: 'warning' },
        { id: 'stop', label: props.t.indCmdStop, icon: 'stop', intent: 'danger' },
      ] },
    ],
  },
  {
    id: 'help',
    label: props.t.indTabHelp,
    groups: [
      { id: 'help', label: props.t.indGrpHelp, commands: [
        { id: 'help', label: props.t.indCmdHelp, icon: 'help' },
      ] },
    ],
  },
])

const projectNodes = computed<NtkTreeNode[]>(() => [
  {
    id: 'proj',
    label: props.t.indProjectName,
    icon: 'open',
    expanded: expanded.proj,
    children: [
      {
        id: 'screens',
        label: props.t.indFolderScreens,
        icon: 'open',
        expanded: expanded.screens,
        children: [
          { id: 'screen1', label: docs.screen1.label, icon: 'grid', selected: selectedId.value === 'screen1' },
          { id: 'screen2', label: docs.screen2.label, icon: 'grid', selected: selectedId.value === 'screen2' },
        ],
      },
      {
        id: 'logic',
        label: props.t.indFolderLogic,
        icon: 'open',
        expanded: expanded.logic,
        children: [
          { id: 'main', label: docs.main.label, icon: 'new', selected: selectedId.value === 'main' },
        ],
      },
      {
        id: 'tags',
        label: props.t.indFolderTags,
        icon: 'open',
        expanded: expanded.tags,
        children: [
          { id: 'motor', label: docs.motor.label, icon: 'settings', selected: selectedId.value === 'motor' },
          { id: 'sensor', label: docs.sensor.label, icon: 'settings', selected: selectedId.value === 'sensor' },
          { id: 'setpoint', label: docs.setpoint.label, icon: 'settings', selected: selectedId.value === 'setpoint' },
        ],
      },
    ],
  },
])

/* ---- interactive SCADA canvas (draggable devices + live connections) ----
 * Shares the BPM editor's drag + bezier model: each device card is movable and
 * every connection line recomputes from the reactive positions in real time
 * (NTK-FE-STD-001.1 §5.2). Domain-neutral device labels. */
const DEV_W = 640
const DEV_H = 300
const DEVICE_W = 160
const DEVICE_H = 64

interface Device { id: string; label: string; value: string; tone: string; x: number; y: number }

const devices = reactive<Device[]>([
  { id: 'd-motor', label: 'Motor M-01', value: 'RUN', tone: 'success', x: 24, y: 28 },
  { id: 'd-temp', label: 'Temp °C', value: '76.4', tone: 'info', x: 248, y: 28 },
  { id: 'd-setpoint', label: 'Setpoint', value: '80.0', tone: 'primary', x: 456, y: 28 },
  { id: 'd-pressure', label: 'Pressão bar', value: '2.1', tone: 'warning', x: 24, y: 176 },
  { id: 'd-alarm', label: 'Alarme', value: 'OK', tone: 'success', x: 248, y: 176 },
  { id: 'd-flow', label: 'Vazão L/min', value: '142', tone: 'info', x: 456, y: 176 },
])

const deviceLinks: ReadonlyArray<{ from: string; to: string }> = [
  { from: 'd-motor', to: 'd-temp' },
  { from: 'd-temp', to: 'd-setpoint' },
  { from: 'd-pressure', to: 'd-alarm' },
  { from: 'd-alarm', to: 'd-flow' },
  { from: 'd-temp', to: 'd-alarm' },
]

const deviceById = computed<Record<string, Device>>(() => {
  const map: Record<string, Device> = {}
  for (const d of devices) map[d.id] = d
  return map
})

const deviceEdgePaths = computed(() =>
  deviceLinks
    .map((link, i) => {
      const a = deviceById.value[link.from]
      const b = deviceById.value[link.to]
      if (!a || !b) return null
      // anchor on the nearest horizontal edges so lines stay tidy while dragging
      const aRight = a.x + DEVICE_W
      const fromRight = b.x >= a.x
      const x1 = fromRight ? aRight : a.x
      const y1 = a.y + DEVICE_H / 2
      const x2 = fromRight ? b.x : b.x + DEVICE_W
      const y2 = b.y + DEVICE_H / 2
      const dx = Math.max(36, Math.abs(x2 - x1) * 0.5)
      const c1 = fromRight ? x1 + dx : x1 - dx
      const c2 = fromRight ? x2 - dx : x2 + dx
      return { key: `de${i}`, d: `M${x1},${y1} C${c1},${y1} ${c2},${y2} ${x2},${y2}` }
    })
    .filter((e): e is { key: string; d: string } => e !== null),
)

const canvasStage = ref<HTMLElement | null>(null)
const devDragId = ref<string | null>(null)
let devOffsetX = 0
let devOffsetY = 0

function clampDev(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

function onDevicePointerDown(id: string, e: PointerEvent): void {
  const d = deviceById.value[id]
  if (!d || !canvasStage.value) return
  devDragId.value = id
  const rect = canvasStage.value.getBoundingClientRect()
  devOffsetX = e.clientX - rect.left - d.x
  devOffsetY = e.clientY - rect.top - d.y
  window.addEventListener('pointermove', onDevicePointerMove)
  window.addEventListener('pointerup', onDevicePointerUp)
}

function onDevicePointerMove(e: PointerEvent): void {
  const d = devDragId.value ? deviceById.value[devDragId.value] : null
  if (!d || !canvasStage.value) return
  const rect = canvasStage.value.getBoundingClientRect()
  d.x = clampDev(e.clientX - rect.left - devOffsetX, 0, DEV_W - DEVICE_W)
  d.y = clampDev(e.clientY - rect.top - devOffsetY, 0, DEV_H - DEVICE_H)
}

function onDevicePointerUp(): void {
  devDragId.value = null
  window.removeEventListener('pointermove', onDevicePointerMove)
  window.removeEventListener('pointerup', onDevicePointerUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onDevicePointerMove)
  window.removeEventListener('pointerup', onDevicePointerUp)
})

const properties = computed(() => [
  { k: props.t.indPropId, v: activeDoc.value?.id ?? '—' },
  { k: props.t.indPropKind, v: activeDoc.value?.kind ?? '—' },
  { k: props.t.indPropScan, v: '20 ms' },
  { k: props.t.indPropPlc, v: 'PLC-01' },
])

const bottomTab = ref<'output' | 'watch' | 'problems'>('output')
const bottomTabs = computed(() => [
  { key: 'output' as const, labelKey: 'indPanelOutput', count: 0 },
  { key: 'watch' as const, labelKey: 'indPanelWatch', count: 0 },
  { key: 'problems' as const, labelKey: 'indPanelProblems', count: 2 },
])

const outputLog = `> Build iniciado: PCDemo.APP
> Compilando Main.st ... ok
> Vinculando tags (3) ... ok
> Build concluído em 0.84 s — 0 erros, 1 aviso`

const watchRows = [
  { tag: 'Motor_Run', type: 'BOOL', value: 'TRUE' },
  { tag: 'Sensor_T', type: 'REAL', value: '76.4' },
  { tag: 'Setpoint', type: 'REAL', value: '80.0' },
]

const problems = computed(() => [
  { sev: props.t.indSevWarn, msg: props.t.indProblem1, tone: 'warning' },
  { sev: props.t.indSevInfo, msg: props.t.indProblem2, tone: 'info' },
])

const statusSegments = computed<NtkStatusBarSegment[]>(() => [
  { id: 'ready', label: props.t.indReady },
  { id: 'pos', value: 'Ln 42, Col 8' },
  { id: 'zoom', value: 'Zoom 100%' },
  { id: 'conn', label: 'PLC-01', value: props.t.indConnected, intent: 'success' },
  { id: 'enc', value: 'UTF-8' },
])
</script>

<style scoped>
.ind-stage {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  overflow: hidden;
  box-shadow: var(--ds-shadow);
  height: 560px;
  background: var(--ntk-shell-bg);
}

.ind-stage--full {
  height: calc(100vh - 48px);
}

.ind-shell {
  min-block-size: 0 !important;
  height: 100%;
}

/* DsAppShell exposes its body as a flex column; force it to fill the stage. */
.ind-shell :deep(.ntk-app-shell__body) {
  min-height: 0;
}

.ind-shell :deep(.ntk-app-shell__main) {
  padding: 0;
  overflow: hidden;
}

.ind-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 44px;
  padding: 0 12px;
  background: var(--ntk-header-bg);
  border-bottom: 1px solid var(--ntk-border);
}

.ind-titlebar__brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 700;
  color: var(--ntk-text-heading);
}

.ind-titlebar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--ntk-primary);
  color: var(--ntk-text-on-accent);
  font-size: 13px;
  font-weight: 800;
}

.ind-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.ind-dock {
  flex: 1 1 auto;
  min-height: 0;
}

/* center document host */
.ind-host {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.ind-tabs {
  display: flex;
  align-items: stretch;
  min-height: 30px;
  overflow-x: auto;
  background: var(--ntk-row-bg);
  border-bottom: 1px solid var(--ntk-border);
}

.ind-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 11px;
  border: none;
  border-right: 1px solid var(--ntk-border);
  border-top: 2px solid transparent;
  background: transparent;
  color: var(--ntk-text-muted);
  font-family: var(--ntk-font-sans);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.ind-tab.is-active {
  border-top-color: var(--ntk-primary);
  background: var(--ntk-card-bg);
  color: var(--ntk-text-heading);
}

.ind-tab__x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  font-size: 14px;
}

.ind-tab__x:hover {
  background: var(--ntk-border);
  color: var(--ntk-text-heading);
}

.ind-tabs__hint {
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 12px;
  font-style: italic;
  color: var(--ntk-text-muted);
}

.ind-docbody {
  flex: 1;
  min-height: 0;
  display: flex;
}

/* screen canvas with HMI widgets */
.ind-canvashdr {
  font-size: 12px;
  font-weight: 600;
  color: var(--ntk-text-heading);
}

.ind-canvashint {
  margin-left: 10px;
  font-size: 11px;
  font-style: italic;
  color: var(--ntk-text-muted);
}

.ind-canvas {
  position: relative;
}

.ind-canvas__edges {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.ind-canvas__edge {
  stroke: var(--ntk-border-strong);
  stroke-width: 2;
}

.ind-widget {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 160px;
  min-height: 64px;
  padding: 11px 13px;
  border: 1px solid var(--ntk-border);
  border-top: 3px solid var(--ntk-primary);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-card-bg);
  box-shadow: var(--ntk-shadow-card);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.ind-widget--dragging {
  cursor: grabbing;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 5;
}

.ind-widget__lbl {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ntk-text-muted);
}

.ind-widget__val {
  font-family: var(--ntk-font-mono, var(--ntk-font-family));
  font-size: 20px;
  font-weight: 700;
}

/* code editor */
.ind-code {
  flex: 1;
  display: flex;
  background: var(--ntk-card-bg);
}

.ind-code textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  padding: 12px 16px;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ntk-text-body);
  background: var(--ntk-card-bg);
}

/* tag form */
.ind-tagform {
  flex: 1;
  overflow: auto;
  padding: 18px 22px;
  background: var(--ntk-card-bg);
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 480px;
}

.ind-tagform h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--ntk-text-heading);
}

.ind-tagform label {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  align-items: center;
  font-size: 12.5px;
  color: var(--ntk-text-muted);
}

.ind-tagform input {
  height: 30px;
  padding: 0 11px;
  border: 1px solid var(--ntk-border);
  border-radius: 6px;
  background: var(--ntk-card-bg);
  color: var(--ntk-text-body);
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 13px;
  outline: none;
}

.ind-tagform input:focus {
  border-color: var(--ntk-primary);
  box-shadow: 0 0 0 3px var(--ntk-accent-soft);
}

.ind-tagform__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.ind-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ntk-text-muted);
  font-size: 13px;
}

/* right properties panel */
.ind-props {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ind-props__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 7px 2px;
  border-bottom: 1px solid var(--ntk-border);
  font-size: 12px;
}

.ind-props__row dt {
  color: var(--ntk-text-muted);
}

.ind-props__row dd {
  margin: 0;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  color: var(--ntk-text-body);
}

/* bottom panels (Output / Watch / Problems) */
.ind-panels {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  background: var(--ntk-card-bg);
}

.ind-panels__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 13px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--ntk-text-muted);
  font-family: var(--ntk-font-sans);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.ind-panels__tab.is-active {
  color: var(--ntk-text-heading);
  border-bottom-color: var(--ntk-primary);
}

.ind-panels__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--ntk-error);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.ind-panels__body {
  flex: 1 1 100%;
  min-height: 0;
  overflow: auto;
  border-top: 1px solid var(--ntk-border);
  padding: 8px 12px;
}

.ind-panels__body pre {
  margin: 0;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.55;
  color: var(--ntk-text-body);
  white-space: pre-wrap;
}

.ind-watch {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.ind-watch td {
  padding: 4px 8px;
  border-bottom: 1px solid var(--ntk-border);
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  color: var(--ntk-text-body);
}

.ind-watch__val {
  color: var(--ntk-primary-dark);
  font-weight: 700;
}

.ind-problems {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ind-problems li {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--ntk-text-body);
}

.ind-problems__sev {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 11px;
}
</style>