<template>
  <dialog
    :id="id"
    ref="dialogRef"
    :class="classes"
    :data-testid="testId"
    :aria-labelledby="title ? titleId : undefined"
    :aria-label="title ? undefined : ariaLabel"
    :aria-describedby="description ? descriptionId : undefined"
    @cancel.prevent="onCancel"
    @click="onBackdropClick"
  >
    <div class="ntk-dialog__surface" @click.stop>
      <header v-if="title || $slots.header || !hideClose" class="ntk-dialog__header">
        <slot name="header">
          <h2 v-if="title" :id="titleId" class="ntk-dialog__title">{{ title }}</h2>
        </slot>
        <button
          v-if="!hideClose"
          type="button"
          class="ntk-dialog__close"
          :aria-label="closeLabel"
          @click="requestClose('button')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <p v-if="description" :id="descriptionId" class="ntk-dialog__description">{{ description }}</p>
      <div class="ntk-dialog__body">
        <slot />
      </div>
      <footer v-if="$slots.actions" class="ntk-dialog__actions">
        <slot name="actions" :close="() => requestClose('action')" />
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ntkDialogDefaults,
  resolveNtkDialogRecipe,
  type NtkDialogContract,
} from '../../core'

type CloseReason = 'button' | 'action' | 'escape' | 'backdrop'

defineOptions({
  name: 'DsDialog',
})

const props = withDefaults(defineProps<NtkDialogContract>(), {
  modelValue: false,
  variant: ntkDialogDefaults.variant,
  size: ntkDialogDefaults.size,
  intent: ntkDialogDefaults.intent,
  persistent: false,
  closeLabel: 'Close',
  hideClose: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const titleId = computed(() => (props.id ? `${props.id}__title` : 'ntk-dialog-title'))
const descriptionId = computed(() => (props.id ? `${props.id}__description` : 'ntk-dialog-description'))
const classes = computed(() => resolveNtkDialogRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

function openDialog(): void {
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

function closeDialog(): void {
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
      openDialog()
    } else if (wasOpen) {
      closeDialog()
    }
  },
  { flush: 'post' },
)

onMounted(() => {
  if (props.modelValue) {
    openDialog()
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
</script>

<style scoped>
.ntk-dialog {
  margin: auto;
  inline-size: min(92vw, 32rem);
  max-block-size: min(86vh, 48rem);
  padding: 0;
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  box-shadow: var(--ntk-shadow-xl);
  font-family: var(--ntk-font-family);
}

.ntk-dialog--size-sm {
  inline-size: min(92vw, 24rem);
}

.ntk-dialog--size-lg {
  inline-size: min(94vw, 48rem);
}

.ntk-dialog--variant-sheet {
  margin-block: auto 0;
  inline-size: 100vw;
  border-radius: var(--ntk-radius-lg) var(--ntk-radius-lg) 0 0;
}

.ntk-dialog--variant-fullscreen {
  inline-size: 100vw;
  max-inline-size: 100vw;
  block-size: 100vh;
  max-block-size: 100vh;
  border-radius: 0;
}

.ntk-dialog::backdrop {
  background: var(--ntk-bg-overlay);
}

.ntk-dialog__surface {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-lg);
}

.ntk-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
}

.ntk-dialog__title {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-xl);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.ntk-dialog__description {
  margin: 0;
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.ntk-dialog__body {
  overflow: auto;
  color: var(--ntk-text-primary);
}

.ntk-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--ntk-spacing-sm);
  padding-block-start: var(--ntk-spacing-sm);
}

.ntk-dialog__close {
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

.ntk-dialog__close:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.ntk-dialog__close:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}
</style>