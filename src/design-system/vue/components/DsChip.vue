<template>
  <span :id="id" :class="classes" :data-testid="testId">
    <button
      v-if="clickable"
      type="button"
      class="ntk-chip__action"
      :disabled="disabled"
      :aria-pressed="selected ? 'true' : 'false'"
      @click="onClick"
    >
      <span v-if="icon" class="ntk-chip__icon" aria-hidden="true">{{ icon }}</span>
      <span class="ntk-chip__label"><slot>{{ label }}</slot></span>
    </button>
    <template v-else>
      <span v-if="icon" class="ntk-chip__icon" aria-hidden="true">{{ icon }}</span>
      <span class="ntk-chip__label"><slot>{{ label }}</slot></span>
    </template>
    <button
      v-if="removable"
      type="button"
      class="ntk-chip__remove"
      :aria-label="removeLabel"
      :disabled="disabled"
      @click.stop="onRemove"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkChipDefaults,
  resolveNtkChipRecipe,
  type NtkChipContract,
} from '../../core'

defineOptions({
  name: 'DsChip',
})

const props = withDefaults(defineProps<NtkChipContract>(), {
  variant: ntkChipDefaults.variant,
  size: ntkChipDefaults.size,
  intent: ntkChipDefaults.intent,
  clickable: false,
  selected: false,
  disabled: false,
  removable: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  remove: []
}>()

const classes = computed(() => resolveNtkChipRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  clickable: props.clickable,
  selected: props.selected,
  disabled: props.disabled,
  class: props.class,
}).classes)

function onClick(event: MouseEvent): void {
  if (props.disabled) {
    return
  }
  emit('click', event)
}

function onRemove(): void {
  if (props.disabled) {
    return
  }
  emit('remove')
}

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const removeLabel = computed(() => props.removeLabel ?? ntkI18n.t('a11y.remove'))
</script>

<style scoped>
.ntk-chip {
  /* Per-intent color channel consumed by the variants below. Defaults to the
     neutral treatment; intent modifiers re-point the channel. The -dark shades
     are AA-700 values, safe for white-on (solid) and dark-on-light (soft text). */
  --ntk-c: var(--ntk-text-secondary);
  --ntk-c-dark: var(--ntk-text-primary);
  --ntk-c-light: var(--ntk-bg-secondary);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-2xl);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  line-height: 1;
}

.ntk-chip--size-sm {
  font-size: var(--ntk-font-size-xs);
  padding-inline: var(--ntk-spacing-xs);
}

.ntk-chip--size-lg {
  font-size: var(--ntk-font-size-base);
  padding-inline: var(--ntk-spacing-md);
}

/* Intents map to the single local color channel. */
.ntk-chip--intent-primary {
  --ntk-c: var(--ntk-primary);
  --ntk-c-dark: var(--ntk-primary-dark);
  --ntk-c-light: var(--ntk-primary-light);
}

.ntk-chip--intent-success {
  --ntk-c: var(--ntk-success);
  --ntk-c-dark: var(--ntk-success-dark);
  --ntk-c-light: var(--ntk-success-light);
}

.ntk-chip--intent-warning {
  --ntk-c: var(--ntk-warning);
  --ntk-c-dark: var(--ntk-warning-dark);
  --ntk-c-light: var(--ntk-warning-light);
}

.ntk-chip--intent-danger {
  --ntk-c: var(--ntk-error);
  --ntk-c-dark: var(--ntk-error-dark);
  --ntk-c-light: var(--ntk-error-light);
}

.ntk-chip--intent-info {
  --ntk-c: var(--ntk-info);
  --ntk-c-dark: var(--ntk-info-dark);
  --ntk-c-light: var(--ntk-info-light);
}

/* Variants. Solid fills with the AA-700 dark shade + inverse text; soft puts
   dark text on the pastel; outline uses the dark shade for text + border. */
.ntk-chip--variant-solid {
  border-color: var(--ntk-c-dark);
  background: var(--ntk-c-dark);
  color: var(--ntk-text-inverse);
}

.ntk-chip--variant-soft {
  border-color: transparent;
  background: var(--ntk-c-light);
  color: var(--ntk-c-dark);
}

.ntk-chip--variant-soft.ntk-chip--intent-neutral {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

/* primary-light is a vivid tint (not a pale pastel), so the soft primary chip
   uses the soft accent surface instead to keep the label AA over the fill. */
.ntk-chip--variant-soft.ntk-chip--intent-primary {
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
}

.ntk-chip--variant-outline {
  border-color: var(--ntk-c);
  background: transparent;
  color: var(--ntk-c-dark);
}

.ntk-chip--variant-outline.ntk-chip--intent-neutral {
  border-color: var(--ntk-border-color);
  color: var(--ntk-text-primary);
}

/* Selected reads as an active accent surface regardless of the base variant:
   a soft primary background with the AA-safe primary-dark text + border, so the
   label keeps >=4.5:1 even over a solid chip's dark fill. */
.ntk-chip--is-selected {
  border-color: var(--ntk-primary);
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
}

.ntk-chip--is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.ntk-chip__action {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.ntk-chip__action:focus-visible,
.ntk-chip__remove:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-chip__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.1rem;
  block-size: 1.1rem;
  border: 0;
  border-radius: var(--ntk-radius-full);
  background: transparent;
  color: inherit;
  font-size: var(--ntk-font-size-base);
  line-height: 1;
  cursor: pointer;
}

.ntk-chip__remove:hover {
  background: var(--ntk-bg-hover);
}
</style>