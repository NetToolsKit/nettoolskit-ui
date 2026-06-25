<template>
  <li
    class="ntk-tree-explorer__item"
    role="treeitem"
    :aria-level="entry.level"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-expanded="ariaExpanded"
    :aria-disabled="entry.node.disabled ? 'true' : undefined"
  >
    <div
      ref="rowRef"
      class="ntk-tree-explorer__row"
      :class="{
        'ntk-tree-explorer__row--is-selected': isSelected,
        'ntk-tree-explorer__row--is-disabled': entry.node.disabled,
      }"
      :style="rowStyle"
      :tabindex="isFocusTarget ? 0 : -1"
      @click="onRowClick"
      @keydown="onKeydown"
    >
      <button
        v-if="entry.hasChildren"
        type="button"
        class="ntk-tree-explorer__twisty"
        tabindex="-1"
        :aria-label="entry.expanded ? 'Collapse' : 'Expand'"
        @click.stop="onToggle"
      >
        <DsCommandIcon
          class="ntk-tree-explorer__chevron"
          :class="{ 'ntk-tree-explorer__chevron--is-expanded': entry.expanded }"
          name="chevron-down"
          size="sm"
        />
      </button>
      <span v-else class="ntk-tree-explorer__twisty ntk-tree-explorer__twisty--leaf" aria-hidden="true" />

      <DsCommandIcon
        v-if="entry.node.icon"
        class="ntk-tree-explorer__icon"
        :name="entry.node.icon"
        size="sm"
      />

      <span class="ntk-tree-explorer__label" :title="entry.node.label">{{ entry.node.label }}</span>
    </div>

    <ul v-if="entry.expanded && childEntries.length > 0" class="ntk-tree-explorer__group" role="group">
      <DsTreeExplorerNode
        v-for="child in childEntries"
        :key="child.node.id"
        :entry="child"
        :selected-id="selectedId"
        :focus-id="focusId"
        @select="(id) => emit('select', id)"
        @toggle="(id) => emit('toggle', id)"
        @keydown="(event, id) => emit('keydown', event, id)"
        @register="(id, el) => emit('register', id, el)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import DsCommandIcon from './DsCommandIcon.vue'
import { getNtkTreeVisibleNodes, type NtkTreeVisibleNode } from '../../core'

defineOptions({
  name: 'DsTreeExplorerNode',
})

const props = defineProps<{
  entry: NtkTreeVisibleNode
  selectedId: string | undefined
  focusId: string | undefined
}>()

const emit = defineEmits<{
  select: [id: string]
  toggle: [id: string]
  keydown: [event: KeyboardEvent, id: string]
  register: [id: string, element: HTMLElement | undefined]
}>()

const rowRef = ref<HTMLElement>()

const isSelected = computed(() => props.entry.node.id === props.selectedId)
const isFocusTarget = computed(() => props.entry.node.id === props.focusId)

// Only expose aria-expanded on parent rows; leaves omit the attribute.
const ariaExpanded = computed<'true' | 'false' | undefined>(() => {
  if (!props.entry.hasChildren) {
    return undefined
  }
  return props.entry.expanded ? 'true' : 'false'
})

// Indent by level so nesting reads visually; offset for the root's own twisty.
const rowStyle = computed<CSSProperties>(() => ({
  paddingInlineStart: `calc(var(--ntk-spacing-sm) * ${props.entry.level})`,
}))

// Direct children, projected as visible entries one level deeper.
const childEntries = computed<NtkTreeVisibleNode[]>(() => {
  if (!props.entry.expanded) {
    return []
  }
  return getNtkTreeVisibleNodes(props.entry.node.children ?? []).filter((child) => child.level === 1)
    .map((child) => ({ ...child, level: props.entry.level + 1, parentId: props.entry.node.id }))
})

function onRowClick(): void {
  if (props.entry.node.disabled) {
    return
  }
  emit('select', props.entry.node.id)
}

function onToggle(): void {
  if (props.entry.node.disabled) {
    return
  }
  emit('toggle', props.entry.node.id)
}

function onKeydown(event: KeyboardEvent): void {
  if (props.entry.node.disabled) {
    return
  }
  emit('keydown', event, props.entry.node.id)
}

watch(rowRef, (element) => {
  emit('register', props.entry.node.id, element ?? undefined)
}, { immediate: true })

onBeforeUnmount(() => {
  emit('register', props.entry.node.id, undefined)
})
</script>

<style scoped>
.ntk-tree-explorer__item {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ntk-tree-explorer__group {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ntk-tree-explorer__row {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  min-inline-size: 0;
  padding-block: var(--ntk-spacing-xs);
  padding-inline-end: var(--ntk-spacing-sm);
  border-radius: var(--ntk-radius-sm);
  color: var(--ntk-text-primary);
  cursor: pointer;
  transition: background var(--ntk-transition-fast);
}

.ntk-tree-explorer__row:hover {
  background: var(--ntk-bg-hover);
}

.ntk-tree-explorer__row:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.ntk-tree-explorer__row--is-selected {
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
  font-weight: var(--ntk-font-weight-medium);
}

.ntk-tree-explorer__row--is-disabled {
  color: var(--ntk-text-muted);
  cursor: not-allowed;
}

.ntk-tree-explorer__twisty {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-secondary);
  cursor: pointer;
}

.ntk-tree-explorer__twisty--leaf {
  cursor: default;
}

.ntk-tree-explorer__twisty:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
}

.ntk-tree-explorer__chevron {
  transform: rotate(-90deg);
  transition: transform var(--ntk-transition-fast);
}

.ntk-tree-explorer__chevron--is-expanded {
  transform: rotate(0deg);
}

.ntk-tree-explorer__icon {
  flex-shrink: 0;
  color: var(--ntk-text-secondary);
}

.ntk-tree-explorer__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>