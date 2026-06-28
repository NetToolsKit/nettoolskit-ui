<template>
  <!-- Recipe: a domain-neutral "Engineering Studio" workspace. Composes the
       industrial command surfaces (DsQuickAccessToolbar + DsRibbon) under a
       DsHeader frame using only static fixtures and library components. Layout
       is token-only; no product names, no raw colors. -->
  <div class="workspace">
    <DsHeader title="Engineering Studio">
      <template #actions>
        <DsQuickAccessToolbar
          :items="quickActions"
          aria-label="Quick access toolbar"
          @command="onCommand"
        />
      </template>
    </DsHeader>

    <div class="workspace__body">
      <DsRibbon
        v-model:active-tab="activeTab"
        :tabs="ribbonTabs"
        aria-label="Studio commands"
        @command="onCommand"
      />

      <section class="workspace__canvas" aria-label="Workspace surface">
        <p class="workspace__hint">
          Last command:
          <span class="workspace__command">{{ lastCommand || 'none yet' }}</span>
        </p>
        <p class="workspace__note">
          The quick access toolbar and ribbon are keyboard-navigable: focus the
          toolbar and use Arrow/Home/End to move between commands; focus a ribbon
          tab and use Left/Right to switch command sets.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DsHeader,
  DsQuickAccessToolbar,
  DsRibbon,
  type NtkQuickAccessItem,
  type NtkRibbonTab,
} from '../../src/index'

const quickActions: NtkQuickAccessItem[] = [
  { id: 'new', label: 'New', icon: 'new' },
  { id: 'open', label: 'Open', icon: 'open' },
  { id: 'save', label: 'Save', icon: 'save', selected: true },
  { id: 'undo', label: 'Undo', icon: 'undo' },
  { id: 'redo', label: 'Redo', icon: 'redo' },
  { id: 'run', label: 'Run', icon: 'run', intent: 'success' },
  { id: 'stop', label: 'Stop', icon: 'stop', disabled: true },
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
          { id: 'delete', label: 'Delete', icon: 'delete', intent: 'danger' },
          { id: 'search', label: 'Find', icon: 'search' },
        ],
      },
    ],
  },
  {
    id: 'view',
    label: 'View',
    groups: [
      {
        id: 'zoom',
        label: 'Zoom',
        commands: [
          { id: 'zoom-in', label: 'Zoom in', icon: 'zoom-in' },
          { id: 'zoom-out', label: 'Zoom out', icon: 'zoom-out' },
          { id: 'grid', label: 'Grid', icon: 'grid', selected: true },
        ],
      },
    ],
  },
  {
    id: 'run',
    label: 'Run',
    groups: [
      {
        id: 'execution',
        label: 'Execution',
        commands: [
          { id: 'run-all', label: 'Run', icon: 'run', intent: 'success' },
          { id: 'pause', label: 'Pause', icon: 'pause' },
          { id: 'stop-all', label: 'Stop', icon: 'stop', intent: 'danger' },
        ],
      },
      {
        id: 'tools',
        label: 'Tools',
        commands: [
          { id: 'settings', label: 'Settings', icon: 'settings' },
          { id: 'help', label: 'Help', icon: 'help' },
        ],
      },
    ],
  },
]

const activeTab = ref('home')
const lastCommand = ref('')

const onCommand = (id: string): void => {
  lastCommand.value = id
}
</script>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  overflow: hidden;
}

.workspace__body {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
  padding: var(--ntk-spacing-md);
  background: var(--ntk-bg-secondary);
}

.workspace__canvas {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
  min-block-size: 8rem;
  padding: var(--ntk-spacing-lg);
  border: 1px solid var(--ntk-border-light);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
}

.workspace__hint {
  margin: 0;
  color: var(--ntk-text-primary);
  font-size: var(--ntk-font-size-sm);
}

.workspace__command {
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-primary-dark);
}

.workspace__note {
  margin: 0;
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-sm);
}
</style>