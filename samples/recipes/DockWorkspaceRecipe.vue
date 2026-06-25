<template>
  <!-- Recipe: a domain-neutral docked engineering workspace. Composes the
       industrial layout primitives (DsDockLayout + DsTreeExplorer +
       DsWorkspaceCanvas + DsDockPanel + DsStatusBar) with static fixtures and
       library components only. Token-only layout; no product names, no raw
       colors. -->
  <div class="dock-workspace">
    <DsDockLayout aria-label="Engineering workspace layout" :left-size="220" :bottom-size="120">
      <template #left>
        <DsTreeExplorer
          :nodes="projectNodes"
          aria-label="Project explorer"
          @update:selected="onSelect"
          @toggle="onToggle"
        />
      </template>

      <DsWorkspaceCanvas surface="grid" aria-label="Design surface">
        <template #header>
          <span class="dock-workspace__doc">{{ selectedLabel || 'No selection' }}</span>
        </template>
        <p class="dock-workspace__hint">
          The explorer is an ARIA tree: focus a row and use Up/Down to move,
          Right/Left to expand/collapse, Enter to select. Drag-free splitters
          between the regions resize with Arrow keys when focused.
        </p>
      </DsWorkspaceCanvas>

      <template #bottom>
        <DsDockPanel
          title="Output"
          collapsible
          :collapsed="outputCollapsed"
          @toggle-collapse="outputCollapsed = !outputCollapsed"
        >
          <p class="dock-workspace__output">Last action: {{ lastAction || 'none yet' }}</p>
        </DsDockPanel>
      </template>
    </DsDockLayout>

    <DsStatusBar :segments="statusSegments" aria-label="Workspace status" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  DsDockLayout,
  DsDockPanel,
  DsStatusBar,
  DsTreeExplorer,
  DsWorkspaceCanvas,
  type NtkStatusBarSegment,
  type NtkTreeNode,
} from '../../index'

// Controlled tree state: the explorer is stateless, so the recipe owns
// expansion/selection and feeds it back through props.
const expanded = reactive<Record<string, boolean>>({ src: true, components: false })
const selectedId = ref<string>('app')

const projectNodes = computed<NtkTreeNode[]>(() => [
  {
    id: 'src',
    label: 'src',
    icon: 'open',
    expanded: expanded.src,
    children: [
      { id: 'app', label: 'app.ts', icon: 'new', selected: selectedId.value === 'app' },
      {
        id: 'components',
        label: 'components',
        icon: 'open',
        expanded: expanded.components,
        children: [
          { id: 'header', label: 'Header.vue', icon: 'new', selected: selectedId.value === 'header' },
          { id: 'footer', label: 'Footer.vue', icon: 'new', selected: selectedId.value === 'footer' },
        ],
      },
    ],
  },
  { id: 'readme', label: 'README.md', icon: 'new', selected: selectedId.value === 'readme' },
])

const labels: Record<string, string> = {
  app: 'app.ts',
  header: 'Header.vue',
  footer: 'Footer.vue',
  readme: 'README.md',
  src: 'src',
  components: 'components',
}

const selectedLabel = computed(() => labels[selectedId.value] ?? '')
const lastAction = ref('')
const outputCollapsed = ref(false)

const statusSegments = computed<NtkStatusBarSegment[]>(() => [
  { id: 'mode', icon: 'grid', label: 'Mode', value: 'Design' },
  { id: 'sel', label: 'Selected', value: selectedLabel.value || '-' },
  { id: 'state', label: 'Output', value: outputCollapsed.value ? 'Collapsed' : 'Open', intent: 'primary' },
])

function onSelect(id: string): void {
  selectedId.value = id
  lastAction.value = `select ${id}`
}

function onToggle(id: string): void {
  if (id in expanded) {
    expanded[id] = !expanded[id]
  } else {
    expanded[id] = true
  }
  lastAction.value = `toggle ${id}`
}
</script>

<style scoped>
.dock-workspace {
  display: flex;
  flex-direction: column;
  block-size: 22rem;
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  overflow: hidden;
}

.dock-workspace__doc {
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.dock-workspace__hint {
  margin: 0;
  max-inline-size: 36rem;
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-sm);
}

.dock-workspace__output {
  margin: 0;
  color: var(--ntk-text-primary);
  font-size: var(--ntk-font-size-sm);
}
</style>