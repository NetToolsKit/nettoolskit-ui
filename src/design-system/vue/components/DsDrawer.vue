<template>
  <dialog
    :id="id"
    ref="dialogRef"
    :class="classes"
    :data-testid="testId"
    :aria-labelledby="title ? titleId : undefined"
    :aria-label="title ? undefined : ariaLabel"
    @cancel.prevent="onCancel"
    @click="onBackdropClick"
  >
    <div class="ntk-drawer__surface" @click.stop>
      <header v-if="title || $slots.header || !hideClose" class="ntk-drawer__header">
        <slot name="header">
          <h2 v-if="title" :id="titleId" class="ntk-drawer__title">{{ title }}</h2>
        </slot>
        <button
          v-if="!hideClose"
          type="button"
          class="ntk-drawer__close"
          :aria-label="closeLabel"
          @click="requestClose('button')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <nav class="ntk-drawer__nav" :aria-label="navLabel">
        <slot :close="() => requestClose('action')" />
      </nav>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ntkDrawerDefaults,
  ntkDrawerSideClassMap,
  resolveNtkDrawerRecipe,
  type NtkDrawerContract,
} from '../../core'

type CloseReason = 'button' | 'action' | 'escape' | 'backdrop'

defineOptions({
  name: 'DsDrawer',
})

const props = withDefaults(defineProps<NtkDrawerContract>(), {
  modelValue: false,
  side: 'left',
  variant: ntkDrawerDefaults.variant,
  size: ntkDrawerDefaults.size,
  intent: ntkDrawerDefaults.intent,
  persistent: false,
  hideClose: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const titleId = computed(() => (props.id ? `${props.id}__title` : 'ntk-drawer-title'))
const classes = computed(() => resolveNtkDrawerRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: [props.class, ntkDrawerSideClassMap[props.side]],
}).classes)

function openDrawer(): void {
  const el = dialogRef.value
  if (!el) {
    return
  }
  previouslyFocused = (document.activeElement as HTMLElement | null) ?? null
  // Native modal gives focus trap + inert background; fall back gracefully
  // for environments (e.g. jsdom) that do not implement showModal().
  try {
    if (typeof el.showModal === 'function' && !el.open) {
      el.showModal()
    } else {
      el.setAttribute('open', '')
    }
  } catch {
    el.setAttribute('open', '')
  }
  emit('open')
  void nextTick(() => focusInitial())
}

function closeDrawer(): void {
  const el = dialogRef.value
  if (!el) {
    return
  }
  try {
    if (typeof el.close === 'function' && el.open) {
      el.close()
    } else {
      el.removeAttribute('open')
    }
  } catch {
    el.removeAttribute('open')
  }
  emit('close')
  if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
    previouslyFocused.focus()
  }
  previouslyFocused = null
}

function focusInitial(): void {
  const el = dialogRef.value
  if (!el) {
    return
  }
  const focusable = el.querySelector<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  ;(focusable ?? el).focus?.()
}

function requestClose(reason: CloseReason): void {
  if (props.persistent && (reason === 'escape' || reason === 'backdrop')) {
    return
  }
  if (props.modelValue) {
    emit('update:modelValue', false)
  }
}

function onCancel(): void {
  requestClose('escape')
}

function onBackdropClick(event: MouseEvent): void {
  // The inner surface stops propagation, so a click reaching the dialog itself
  // is a backdrop click.
  if (event.target === dialogRef.value) {
    requestClose('backdrop')
  }
}

watch(
  () => props.modelValue,
  (open, wasOpen) => {
    if (open) {
      openDrawer()
    } else if (wasOpen) {
      closeDrawer()
    }
  },
  { flush: 'post' },
)

onMounted(() => {
  if (props.modelValue) {
    openDrawer()
  }
})

onBeforeUnmount(() => {
  const el = dialogRef.value
  if (el?.open && typeof el.close === 'function') {
    try {
      el.close()
    } catch {
      el.removeAttribute('open')
    }
  }
})

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const ariaLabel = computed(() => props.ariaLabel ?? ntkI18n.t('a11y.navigationDrawer'))
const navLabel = computed(() => props.navLabel ?? ntkI18n.t('a11y.drawerNav'))
const closeLabel = computed(() => props.closeLabel ?? ntkI18n.t('dialog.close'))
</script>

<style scoped>
.ntk-drawer {
  position: fixed;
  inset-block: 0;
  margin: 0;
  inline-size: min(86vw, 20rem);
  max-inline-size: 100vw;
  block-size: 100vh;
  max-block-size: 100vh;
  padding: 0;
  border: 0;
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  box-shadow: var(--ntk-shadow-xl);
  font-family: var(--ntk-font-family);
}

.ntk-drawer--side-left {
  inset-inline-start: 0;
  border-inline-end: 1px solid var(--ntk-border-color);
}

.ntk-drawer--side-right {
  inset-inline-end: 0;
  border-inline-start: 1px solid var(--ntk-border-color);
}

.ntk-drawer--size-sm {
  inline-size: min(80vw, 16rem);
}

.ntk-drawer--size-lg {
  inline-size: min(92vw, 26rem);
}

.ntk-drawer::backdrop {
  background: var(--ntk-bg-overlay);
}

.ntk-drawer__surface {
  display: flex;
  flex-direction: column;
  block-size: 100%;
}

.ntk-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-md);
  border-block-end: 1px solid var(--ntk-border-color);
}

.ntk-drawer__title {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.ntk-drawer__nav {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-sm);
  overflow-y: auto;
}

.ntk-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-muted);
  font-size: var(--ntk-font-size-xl);
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.ntk-drawer__close:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.ntk-drawer__close:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}
</style>