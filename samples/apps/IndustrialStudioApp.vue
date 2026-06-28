<template>
  <!-- Mocked, front-only SCADA/engineering authoring shell. Domain-neutral:
       no product names. Everything is a library Ds* component; the only local
       CSS is token-only layout glue. All data is static fixtures and clicking
       commands pushes a toast so the wiring is observable. -->
  <div class="studio">
    <!-- Top bar: quick access (left) + centered title + a style/theme select. -->
    <div class="studio__topbar">
      <DsQuickAccessToolbar
        :items="quickActions"
        aria-label="Quick access toolbar"
        @command="onCommand"
      />
      <p class="studio__title">Engineering Studio &mdash; Screen1</p>
      <DsSelect
        id="studio-style"
        class="studio__style"
        label="Style"
        :model-value="style"
        :options="styleOptions"
        @update:model-value="onStyleChange"
      />
    </div>

    <!-- Ribbon: tabbed command surface (Home/View/Insert/Project/Draw/Help). -->
    <DsRibbon
      v-model:active-tab="activeTab"
      :tabs="ribbonTabs"
      aria-label="Studio commands"
      @command="onCommand"
    />

    <!-- Dock layout: left explorer, center canvas, bottom watch + output. -->
    <div class="studio__dock">
      <DsDockLayout
        aria-label="Studio workspace layout"
        :left-size="240"
        :bottom-size="160"
      >
        <template #left>
          <DsTreeExplorer
            :nodes="projectNodes"
            aria-label="Project Explorer"
            @update:selected="onSelectNode"
            @toggle="onToggleNode"
          />
        </template>

        <DsWorkspaceCanvas surface="dots" aria-label="Screen design surface">
          <template #header>
            <div class="studio__doctabs" role="tablist" aria-label="Open documents">
              <button
                v-for="doc in documents"
                :key="doc.id"
                type="button"
                role="tab"
                class="studio__doctab"
                :class="{ 'studio__doctab--is-active': doc.id === activeDoc }"
                :aria-selected="doc.id === activeDoc ? 'true' : 'false'"
                @click="activeDoc = doc.id"
              >
                {{ doc.label }}
              </button>
            </div>
          </template>

          <div class="studio__widgets">
            <div
              v-for="widget in placedWidgets"
              :key="widget.id"
              class="studio__widget"
            >
              <span class="studio__widget-label">{{ widget.label }}</span>
              <span class="studio__widget-meta">{{ widget.meta }}</span>
            </div>
          </div>
        </DsWorkspaceCanvas>

        <template #bottom>
          <div class="studio__panels">
            <DsDockPanel title="Watch" class="studio__panel">
              <DsTable
                :columns="watchColumns"
                :rows="watchRows"
                density="compact"
                variant="striped"
                aria-label="Watched tags"
              />
            </DsDockPanel>

            <DsDockPanel title="Output" class="studio__panel">
              <ul class="studio__log">
                <li
                  v-for="(line, index) in outputLog"
                  :key="index"
                  class="studio__log-line"
                >
                  {{ line }}
                </li>
              </ul>
            </DsDockPanel>
          </div>
        </template>
      </DsDockLayout>
    </div>

    <!-- Footer status bar. -->
    <DsStatusBar :segments="statusSegments" aria-label="Studio status" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  DsDockLayout,
  DsDockPanel,
  DsQuickAccessToolbar,
  DsRibbon,
  DsSelect,
  DsStatusBar,
  DsTable,
  DsTreeExplorer,
  DsWorkspaceCanvas,
  pushToast,
  type NtkQuickAccessItem,
  type NtkRibbonTab,
  type NtkStatusBarSegment,
  type NtkTableColumn,
  type NtkTableRow,
  type NtkTreeNode,
} from '../../src/index'

// Command icons come from the built-in closed registry (no icon font). The
// authoring commands below map each logical action to the nearest registry
// glyph so the surface stays typed and a11y-safe.
const quickActions: NtkQuickAccessItem[] = [
  { id: 'new', label: 'New screen', icon: 'new' },
  { id: 'open', label: 'Open', icon: 'open' },
  { id: 'save', label: 'Save', icon: 'save', selected: true },
  { id: 'run', label: 'Run', icon: 'run', intent: 'success' },
  { id: 'stop', label: 'Stop', icon: 'stop', intent: 'danger' },
  { id: 'undo', label: 'Undo', icon: 'undo' },
  { id: 'redo', label: 'Redo', icon: 'redo' },
]

const ribbonTabs: NtkRibbonTab[] = [
  {
    id: 'home',
    label: 'Home',
    groups: [
      {
        id: 'clipboard',
        label: 'Clipboard',
        commands: [
          { id: 'cut', label: 'Cut', icon: 'cut' },
          { id: 'copy', label: 'Copy', icon: 'copy' },
          { id: 'paste', label: 'Paste', icon: 'paste' },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        commands: [
          { id: 'selection', label: 'Selection', icon: 'search' },
          { id: 'properties', label: 'Properties', icon: 'settings' },
        ],
      },
    ],
  },
  {
    id: 'view',
    label: 'View',
    groups: [
      {
        id: 'show-hide',
        label: 'Show / Hide',
        commands: [
          { id: 'explorer', label: 'Explorer', icon: 'open', selected: true },
          { id: 'watch', label: 'Watch', icon: 'search' },
          { id: 'output', label: 'Output', icon: 'menu' },
          { id: 'grid', label: 'Grid', icon: 'grid', selected: true },
          { id: 'status', label: 'Status bar', icon: 'menu' },
        ],
      },
      {
        id: 'zoom',
        label: 'Zoom',
        commands: [
          { id: 'zoom-in', label: 'Zoom in', icon: 'zoom-in' },
          { id: 'zoom-out', label: 'Zoom out', icon: 'zoom-out' },
          { id: 'fit', label: 'Fit', icon: 'grid' },
        ],
      },
    ],
  },
  {
    id: 'insert',
    label: 'Insert',
    groups: [
      {
        id: 'graphics',
        label: 'Graphics',
        commands: [
          { id: 'screen', label: 'Screen', icon: 'new' },
          { id: 'symbol', label: 'Symbol', icon: 'copy' },
          { id: 'group', label: 'Group', icon: 'grid' },
        ],
      },
      {
        id: 'tasks',
        label: 'Tasks',
        commands: [
          { id: 'alarm', label: 'Alarm', icon: 'stop', intent: 'danger' },
          { id: 'trend', label: 'Trend', icon: 'zoom-in' },
          { id: 'recipe', label: 'Recipe', icon: 'new' },
          { id: 'report', label: 'Report', icon: 'save' },
          { id: 'script', label: 'Script', icon: 'settings' },
        ],
      },
      {
        id: 'comms',
        label: 'Comms',
        commands: [
          { id: 'driver', label: 'Driver', icon: 'open' },
          { id: 'opc', label: 'OPC client', icon: 'menu' },
        ],
      },
    ],
  },
  {
    id: 'project',
    label: 'Project',
    groups: [
      {
        id: 'settings',
        label: 'Settings',
        commands: [
          { id: 'system', label: 'System', icon: 'settings' },
          { id: 'options', label: 'Options', icon: 'settings' },
          { id: 'project-comms', label: 'Comms', icon: 'menu' },
        ],
      },
      {
        id: 'security',
        label: 'Security',
        commands: [
          { id: 'security-config', label: 'Config', icon: 'settings' },
          { id: 'access-level', label: 'Access level', icon: 'search' },
        ],
      },
      {
        id: 'web',
        label: 'Web',
        commands: [
          { id: 'thin-client', label: 'Thin client', icon: 'open' },
        ],
      },
    ],
  },
  {
    id: 'draw',
    label: 'Draw',
    groups: [
      {
        id: 'shapes',
        label: 'Shapes',
        commands: [
          { id: 'line', label: 'Line', icon: 'menu' },
          { id: 'rectangle', label: 'Rectangle', icon: 'stop' },
          { id: 'ellipse', label: 'Ellipse', icon: 'grid' },
          { id: 'polygon', label: 'Polygon', icon: 'grid' },
        ],
      },
      {
        id: 'active-objects',
        label: 'Active Objects',
        commands: [
          { id: 'text', label: 'Text', icon: 'new' },
          { id: 'button', label: 'Button', icon: 'stop' },
          { id: 'checkbox', label: 'Checkbox', icon: 'grid' },
          { id: 'combo', label: 'Combo', icon: 'chevron-down' },
        ],
      },
      {
        id: 'data-objects',
        label: 'Data Objects',
        commands: [
          { id: 'data-alarm', label: 'Alarm', icon: 'stop', intent: 'danger' },
          { id: 'data-trend', label: 'Trend', icon: 'zoom-in' },
          { id: 'data-grid', label: 'Grid', icon: 'grid' },
        ],
      },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    groups: [
      {
        id: 'docs',
        label: 'Docs',
        commands: [
          { id: 'help', label: 'Help', icon: 'help' },
          { id: 'drivers', label: 'Drivers', icon: 'open' },
        ],
      },
      {
        id: 'info',
        label: 'Info',
        commands: [
          { id: 'about', label: 'About', icon: 'help' },
          { id: 'release-notes', label: 'Release notes', icon: 'new' },
          { id: 'support', label: 'Support', icon: 'help' },
        ],
      },
    ],
  },
]

const activeTab = ref('home')

// Style / theme select (top-right control), mocked.
const style = ref('classic')
const styleOptions = [
  { label: 'Classic', value: 'classic' },
  { label: 'Flat', value: 'flat' },
  { label: 'High contrast', value: 'contrast' },
]
const onStyleChange = (next: string): void => {
  style.value = next
  pushToast({ message: `Style set to "${next}"`, intent: 'info' })
}

// Project explorer tree (controlled): expansion + selection owned here.
const expanded = reactive<Record<string, boolean>>({
  screens: true,
  tags: true,
  alarms: false,
  symbols: false,
})
const selectedNode = ref('screen1')

const projectNodes = computed<NtkTreeNode[]>(() => [
  {
    id: 'screens',
    label: 'Screens',
    icon: 'open',
    expanded: expanded.screens,
    children: [
      { id: 'screen1', label: 'Screen1', icon: 'new', selected: selectedNode.value === 'screen1' },
      { id: 'screen2', label: 'Screen2', icon: 'new', selected: selectedNode.value === 'screen2' },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    icon: 'grid',
    expanded: expanded.tags,
    children: [
      { id: 'analog', label: 'Analog', icon: 'zoom-in', selected: selectedNode.value === 'analog' },
      { id: 'digital', label: 'Digital', icon: 'stop', selected: selectedNode.value === 'digital' },
    ],
  },
  {
    id: 'alarms',
    label: 'Alarms',
    icon: 'stop',
    expanded: expanded.alarms,
    children: [
      { id: 'alarm-groups', label: 'Groups', icon: 'menu', selected: selectedNode.value === 'alarm-groups' },
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    icon: 'copy',
    expanded: expanded.symbols,
    children: [
      { id: 'library-symbols', label: 'Library', icon: 'open', selected: selectedNode.value === 'library-symbols' },
    ],
  },
  { id: 'layout', label: 'Layout', icon: 'grid', selected: selectedNode.value === 'layout' },
])

function onSelectNode(id: string): void {
  selectedNode.value = id
  pushToast({ message: `Selected "${id}"`, intent: 'info', timeout: 2500 })
}

function onToggleNode(id: string): void {
  if (id in expanded) {
    expanded[id] = !expanded[id]
  } else {
    expanded[id] = true
  }
}

// Document tabs in the canvas header (mocked).
const documents = [
  { id: 'screen1', label: 'Screen1' },
  { id: 'screen2', label: 'Screen2' },
]
const activeDoc = ref('screen1')

// Mocked "placed" widgets shown on the canvas (tokenized boxes/labels).
const placedWidgets = [
  { id: 'gauge', label: 'Pump Pressure', meta: 'Analog · 4.2 bar' },
  { id: 'switch', label: 'Conveyor Motor', meta: 'Digital · Running' },
  { id: 'trend', label: 'Tank Level Trend', meta: 'Trend · 60 min' },
  { id: 'alarms', label: 'Active Alarms', meta: 'Grid · 3 active' },
]

// Bottom "Watch" panel: a small DsTable of tag/value/quality rows (mocked).
const watchColumns: NtkTableColumn[] = [
  { id: 'tag', label: 'Tag' },
  { id: 'value', label: 'Value', align: 'right' },
  { id: 'quality', label: 'Quality' },
]
const watchRows: NtkTableRow[] = [
  { id: 'w1', cells: { tag: 'Pump01.Pressure', value: '4.20', quality: 'Good' } },
  { id: 'w2', cells: { tag: 'Tank01.Level', value: '78%', quality: 'Good' } },
  { id: 'w3', cells: { tag: 'Motor01.Speed', value: '1480', quality: 'Uncertain' } },
  { id: 'w4', cells: { tag: 'Valve03.State', value: 'Open', quality: 'Good' } },
]

// Bottom "Output" panel: a monospace-ish log list (mocked).
const outputLog = ref<string[]>([
  '[10:02:11] Project loaded: 3 screens, 128 tags.',
  '[10:02:12] Driver "Generic OPC" connected.',
  '[10:02:14] Screen1 compiled successfully.',
  '[10:02:15] Watch list initialized (4 tags).',
])

const statusSegments = computed<NtkStatusBarSegment[]>(() => [
  { id: 'mode', icon: 'grid', label: 'Mode', value: 'Edit' },
  { id: 'tags', label: 'Tags', value: '128' },
  { id: 'coords', label: 'X/Y', value: '320, 180' },
  { id: 'zoom', icon: 'zoom-in', label: 'Zoom', value: '100%' },
  { id: 'online', label: 'Status', value: 'Online', intent: 'success' },
])

// Any toolbar/ribbon command pushes a toast so the wiring is observable.
function onCommand(id: string): void {
  outputLog.value = [
    ...outputLog.value,
    `[now] command: ${id}`,
  ].slice(-12)
  pushToast({ message: `Command "${id}" fired`, intent: 'info', timeout: 2500 })
}
</script>

<style scoped>
.studio {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-secondary);
  padding: var(--ntk-spacing-sm);
}

.studio__topbar {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  flex-wrap: wrap;
  padding: var(--ntk-spacing-sm);
  border: 1px solid var(--ntk-border-light);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
}

.studio__title {
  flex: 1 1 auto;
  margin: 0;
  text-align: center;
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.studio__style {
  flex: 0 0 auto;
  min-inline-size: 12rem;
}

.studio__dock {
  block-size: 26rem;
}

.studio__doctabs {
  display: flex;
  gap: var(--ntk-spacing-xs);
}

.studio__doctab {
  margin: 0;
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-block-end: 0;
  border-radius: var(--ntk-radius-sm) var(--ntk-radius-sm) 0 0;
  background: var(--ntk-bg-secondary);
  color: var(--ntk-text-secondary);
  font: inherit;
  font-size: var(--ntk-font-size-sm);
  cursor: pointer;
}

.studio__doctab--is-active {
  background: var(--ntk-bg-card);
  color: var(--ntk-primary);
  font-weight: var(--ntk-font-weight-semibold);
}

.studio__doctab:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.studio__widgets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: var(--ntk-spacing-md);
}

.studio__widget {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  min-block-size: 5rem;
  padding: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
}

.studio__widget-label {
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.studio__widget-meta {
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.studio__panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--ntk-spacing-sm);
  block-size: 100%;
  padding: var(--ntk-spacing-sm);
}

.studio__panel {
  min-block-size: 0;
}

.studio__log {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.studio__log-line {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-secondary);
}
</style>