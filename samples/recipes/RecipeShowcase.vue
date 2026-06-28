<template>
  <!-- Presentational wrapper used by the catalog: a titled card around a live
       recipe plus a copyable composition snippet. Library-only: structure comes
       from DsCard/DsButton; layout uses sample-local classes built on --ntk-*
       tokens (no raw colors, no Quasar). -->
  <DsCard class="recipe-showcase" :title="title" :subtitle="description">
    <div class="recipe-showcase__preview">
      <slot />
    </div>

    <div class="recipe-showcase__code">
      <div class="recipe-showcase__code-bar">
        <span class="recipe-showcase__code-label">{{ snippetLabel }}</span>
        <DsButton
          class="recipe-showcase__copy"
          variant="outline"
          intent="primary"
          size="sm"
          :label="copied ? copiedLabel : copyLabel"
          :aria-label="copyAriaLabel"
          @click="onCopy"
        />
      </div>
      <pre
        class="recipe-showcase__pre"
        tabindex="0"
        :aria-label="`${title} composition snippet`"
      ><code class="recipe-showcase__snippet">{{ snippet }}</code></pre>
    </div>
  </DsCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DsButton, DsCard } from '../../src/index'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  /** Snippet text. The `#code` slot is preferred; this is the simple fallback. */
  code?: string
  snippetLabel?: string
  copyLabel?: string
  copiedLabel?: string
}>(), {
  description: undefined,
  code: '',
  snippetLabel: 'Composition',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
})

const slots = defineSlots<{
  default?: () => unknown
  code?: () => unknown
}>()

// Prefer slotted code text; fall back to the `code` prop. The slot can carry a
// plain text child, which we stringify defensively.
const snippet = computed<string>(() => {
  const slotNodes = slots.code?.()
  if (Array.isArray(slotNodes) && slotNodes.length > 0) {
    const text = slotNodes
      .map((node) => (typeof node.children === 'string' ? node.children : ''))
      .join('')
      .trim()
    if (text) {
      return text
    }
  }
  return props.code.trim()
})

const copyAriaLabel = computed(() => `Copy the ${props.title} code snippet`)

const copied = ref(false)
let resetHandle: ReturnType<typeof setTimeout> | undefined

const onCopy = async (): Promise<void> => {
  // Guard navigator.clipboard: it is undefined in insecure/SSR contexts.
  const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined
  if (!clipboard?.writeText) {
    return
  }
  try {
    await clipboard.writeText(snippet.value)
    copied.value = true
    if (resetHandle) {
      clearTimeout(resetHandle)
    }
    resetHandle = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard can reject (denied permission); leave the label unchanged.
  }
}
</script>

<style scoped>
.recipe-showcase {
  display: block;
}

.recipe-showcase__preview {
  display: block;
}

.recipe-showcase__code {
  margin-block-start: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  overflow: hidden;
  background: var(--ntk-bg-secondary);
}

.recipe-showcase__code-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-md);
  border-block-end: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
}

.recipe-showcase__code-label {
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.recipe-showcase__pre {
  margin: 0;
  padding: var(--ntk-spacing-md);
  overflow-x: auto;
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family-mono, ui-monospace, monospace);
  font-size: var(--ntk-font-size-sm);
  line-height: var(--ntk-line-height-normal);
}

.recipe-showcase__pre:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.recipe-showcase__snippet {
  white-space: pre;
}
</style>