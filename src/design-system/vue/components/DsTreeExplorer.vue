<template>
  <ul
    :id="id"
    ref="treeRef"
    :class="classes"
    :data-testid="testId"
    role="tree"
    :aria-label="ariaLabel"
  >
    <DsTreeExplorerNode
      v-for="entry in rootEntries"
      :key="entry.node.id"
      :entry="entry"
      :selected-id="selectedId"
      :focus-id="resolvedFocusId"
      @select="onSelect"
      @toggle="onToggle"
      @keydown="onKeydown"
      @register="registerItem"
    />
  </ul>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import DsTreeExplorerNode from './DsTreeExplorerNode.vue'
import {
  getNtkTreeNextFocus,
  getNtkTreeVisibleNodes,
  ntkTreeExplorerDefaults,
  resolveNtkTreeExplorerRecipe,
  type NtkTreeExplorerContract,
  type NtkTreeNavigationKey,
  type NtkTreeNode,
} from '../../core'

defineOptions({
  name: 'DsTreeExplorer',
})

const props = withDefaults(defineProps<NtkTreeExplorerContract>(), {
  nodes: () => [],
  ariaLabel: 'Tree',
  variant: ntkTreeExplorerDefaults.variant,
  size: ntkTreeExplorerDefaults.size,
  intent: ntkTreeExplorerDefaults.intent,
  density: ntkTreeExplorerDefaults.density,
})

const emit = defineEmits<{
  'update:selected': [id: string]
  toggle: [id: string]
}>()

const classes = computed(() => resolveNtkTreeExplorerRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  class: props.class,
}).classes)

const visible = computed(() => getNtkTreeVisibleNodes(props.nodes))
const rootEntries = computed(() => visible.value.filter((entry) => entry.level === 1))

const selectedId = computed<string | undefined>(() => {
  const fromVisible = visible.value.find((entry) => entry.node.selected)
  return fromVisible?.node.id
})

// Roving tabindex: a single tree item owns tabindex=0. It defaults to the
// selected node, else the first focusable visible node.
const rovingId = ref<string | undefined>(undefined)

const resolvedFocusId = computed<string | undefined>(() => {
  const ids = visible.value.filter((entry) => !entry.node.disabled).map((entry) => entry.node.id)
  if (rovingId.value && ids.includes(rovingId.value)) {
    return rovingId.value
  }
  if (selectedId.value && ids.includes(selectedId.value)) {
    return selectedId.value
  }
  return ids[0]
})

const itemRefs = new Map<string, HTMLElement>()
function registerItem(nodeId: string, element: HTMLElement | undefined): void {
  if (element) {
    itemRefs.set(nodeId, element)
  } else {
    itemRefs.delete(nodeId)
  }
}

function focusItem(nodeId: string): void {
  void nextTick(() => {
    itemRefs.get(nodeId)?.focus()
  })
}

function onSelect(nodeId: string): void {
  rovingId.value = nodeId
  emit('update:selected', nodeId)
}

function onToggle(nodeId: string): void {
  rovingId.value = nodeId
  emit('toggle', nodeId)
}

function isNavigationKey(key: string): key is NtkTreeNavigationKey {
  return (
    key === 'ArrowUp'
    || key === 'ArrowDown'
    || key === 'ArrowLeft'
    || key === 'ArrowRight'
    || key === 'Home'
    || key === 'End'
  )
}

function findNode(nodeId: string): NtkTreeNode | undefined {
  return visible.value.find((entry) => entry.node.id === nodeId)?.node
}

function onKeydown(event: KeyboardEvent, nodeId: string): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onSelect(nodeId)
    return
  }

  if (!isNavigationKey(event.key)) {
    return
  }

  const result = getNtkTreeNextFocus(visible.value, nodeId, event.key)
  if (!result) {
    return
  }
  event.preventDefault()

  if (result.expand || result.collapse) {
    const node = findNode(result.focusId)
    // Only emit a toggle when it actually changes expansion state.
    if (node && (result.expand ? node.expanded !== true : node.expanded === true)) {
      onToggle(result.focusId)
    }
    rovingId.value = result.focusId
    focusItem(result.focusId)
    return
  }

  rovingId.value = result.focusId
  focusItem(result.focusId)
}

const treeRef = ref<HTMLUListElement>()
defineExpose({ treeRef })
</script>

<style scoped>
.ntk-tree-explorer {
  margin: 0;
  padding: var(--ntk-spacing-xs);
  list-style: none;
  inline-size: 100%;
  block-size: 100%;
  overflow: auto;
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
}

.ntk-tree-explorer--variant-bordered {
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
}

.ntk-tree-explorer--size-sm {
  font-size: var(--ntk-font-size-xs);
}

.ntk-tree-explorer--size-lg {
  font-size: var(--ntk-font-size-base);
}
</style>