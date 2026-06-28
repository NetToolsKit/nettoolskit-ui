<template>
  <button
    :id="id"
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :data-testid="testId"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="ntk-button__spinner" aria-hidden="true"></span>
    <span v-if="icon" class="ntk-button__icon ntk-button__icon--left" aria-hidden="true">{{ icon }}</span>
    <span v-if="$slots.default || label" class="ntk-button__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="iconRight" class="ntk-button__icon ntk-button__icon--right" aria-hidden="true">{{ iconRight }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getNtkDensityClass,
  ntkButtonDefaults,
  ntkButtonRecipeClassMap,
  resolveNtkButtonRecipe,
  type NtkButtonContract,
} from '../../core'

defineOptions({
  name: 'DsButton',
})

const props = withDefaults(defineProps<NtkButtonContract>(), {
  variant: ntkButtonDefaults.variant,
  size: ntkButtonDefaults.size,
  intent: ntkButtonDefaults.intent,
  density: ntkButtonDefaults.density,
  type: 'button',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  ...resolveNtkButtonRecipe({
    variant: props.variant,
    size: props.size,
    intent: props.intent,
    disabled: props.disabled,
    loading: props.loading,
    class: props.class,
  }).classes,
  getNtkDensityClass(ntkButtonRecipeClassMap.root, props.density),
])
</script>

<style scoped>
.ntk-button {
  --ntk-c: var(--ntk-primary);
  --ntk-c-dark: var(--ntk-primary-dark);
  --ntk-c-light: var(--ntk-primary-light);
  /* Accessible text shade for transparent variants: blend the intent color
     toward the primary text color so ghost/outline labels clear WCAG AA on the
     page surface in both light and dark schemes (the raw intent hue alone is
     too light for small text). */
  --ntk-c-text: color-mix(in srgb, var(--ntk-c) 55%, var(--ntk-text-primary));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ntk-spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-md);
  background: transparent;
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  line-height: var(--ntk-line-height-tight);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ntk-transition-fast),
    border-color var(--ntk-transition-fast),
    color var(--ntk-transition-fast),
    box-shadow var(--ntk-transition-fast);
}

.ntk-button:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* Intents map to a single local color channel consumed by the variants. */
.ntk-button--intent-neutral {
  --ntk-c: var(--ntk-text-secondary);
  --ntk-c-dark: var(--ntk-text-primary);
  --ntk-c-light: var(--ntk-bg-secondary);
}

.ntk-button--intent-primary {
  --ntk-c: var(--ntk-primary);
  --ntk-c-dark: var(--ntk-primary-dark);
  --ntk-c-light: var(--ntk-primary-light);
}

.ntk-button--intent-success {
  --ntk-c: var(--ntk-success);
  --ntk-c-dark: var(--ntk-success-dark);
  --ntk-c-light: var(--ntk-success-light);
}

.ntk-button--intent-warning {
  --ntk-c: var(--ntk-warning);
  --ntk-c-dark: var(--ntk-warning-dark);
  --ntk-c-light: var(--ntk-warning-light);
}

.ntk-button--intent-danger {
  --ntk-c: var(--ntk-error);
  --ntk-c-dark: var(--ntk-error-dark);
  --ntk-c-light: var(--ntk-error-light);
}

.ntk-button--intent-info {
  --ntk-c: var(--ntk-info);
  --ntk-c-dark: var(--ntk-info-dark);
  --ntk-c-light: var(--ntk-info-light);
}

/* Density. Comfortable mirrors the size defaults; compact/spacious nudge the
   block/inline padding so a row of controls can be tightened or relaxed. */
.ntk-button--density-compact {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  gap: var(--ntk-spacing-xs);
}

.ntk-button--density-spacious {
  padding-block: var(--ntk-spacing-md);
  padding-inline: var(--ntk-spacing-lg);
  gap: var(--ntk-spacing-md);
}

/* Sizes. */
.ntk-button--size-sm {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  font-size: var(--ntk-font-size-xs);
}

.ntk-button--size-md {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  font-size: var(--ntk-font-size-sm);
}

.ntk-button--size-lg {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-lg);
  font-size: var(--ntk-font-size-base);
}

/* Variants. */
.ntk-button--variant-solid {
  /* Solid fills use the intent's AA-700 dark shade so white label text clears
     WCAG AA (the raw 500 base hue fails ~2.5-3.7:1). */
  border-color: var(--ntk-c-dark);
  background: var(--ntk-c-dark);
  color: var(--ntk-text-inverse);
}

.ntk-button--variant-solid:hover:not(:disabled) {
  /* Deepen the fill on hover while staying darker than the AA-700 base. */
  border-color: color-mix(in srgb, var(--ntk-c-dark) 85%, black);
  background: color-mix(in srgb, var(--ntk-c-dark) 85%, black);
}

/* Soft: a tinted fill with an AA-safe foreground. The label uses the same
   text-darkened intent channel as ghost/outline (intent blended toward the
   near-black primary text), so small label text clears WCAG AA on the light
   tint across themes/brands (the raw intent-dark shade alone can fail ~3.4:1
   on its own light tint). */
.ntk-button--variant-soft {
  border-color: transparent;
  background: var(--ntk-c-light);
  /* Blend the intent strongly toward the near-black primary text so the label
     clears WCAG AA (>=4.5:1) on the light soft tint even for the most saturated
     brand hues (the 55/45 text channel alone lands ~4.2:1 on vivid brands). */
  color: color-mix(in srgb, var(--ntk-c) 38%, var(--ntk-text-primary));
}

.ntk-button--variant-soft:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ntk-c-light) 88%, var(--ntk-c-dark));
}

/* Neutral soft has no semantic light tint, so it falls back to the page hover
   surface with the secondary text shade. */
.ntk-button--variant-soft.ntk-button--intent-neutral {
  background: var(--ntk-bg-secondary);
  color: var(--ntk-text-primary);
}

.ntk-button--variant-soft.ntk-button--intent-neutral:hover:not(:disabled) {
  background: var(--ntk-bg-hover);
}

.ntk-button--variant-outline {
  border-color: var(--ntk-c);
  background: transparent;
  color: var(--ntk-c-text);
}

.ntk-button--variant-outline:hover:not(:disabled) {
  background: var(--ntk-c-light);
}

.ntk-button--variant-ghost {
  border-color: transparent;
  background: transparent;
  color: var(--ntk-c-text);
}

.ntk-button--variant-ghost:hover:not(:disabled) {
  background: var(--ntk-bg-hover);
}

.ntk-button--variant-link {
  padding-inline: 0;
  border-color: transparent;
  background: transparent;
  color: var(--ntk-text-link);
}

.ntk-button--variant-link:hover:not(:disabled) {
  color: var(--ntk-text-link-hover);
  text-decoration: underline;
}

/* Plain: no chrome at all (transparent bg + border) with the intent text color.
   Unlike ghost, plain keeps its label color flat on hover (no surface fill),
   matching the reference low-emphasis action. Neutral plain uses primary text. */
.ntk-button--variant-plain {
  border-color: transparent;
  background: transparent;
  color: var(--ntk-c-text);
}

.ntk-button--variant-plain.ntk-button--intent-neutral {
  color: var(--ntk-text-primary);
}

.ntk-button--variant-plain:hover:not(:disabled) {
  color: var(--ntk-c-dark);
}

/* States. */
.ntk-button:disabled,
.ntk-button--is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ntk-button--is-loading,
.ntk-button[aria-busy='true'] {
  opacity: 0.75;
  cursor: progress;
}

.ntk-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.ntk-button__label {
  display: inline-flex;
  align-items: center;
}

/* Token-driven loading spinner. Inherits the button text color via
   currentColor, so it stays legible across every variant and theme. */
.ntk-button__spinner {
  inline-size: 1em;
  block-size: 1em;
  flex-shrink: 0;
  border: 2px solid currentColor;
  border-block-start-color: transparent;
  border-radius: var(--ntk-radius-full);
  opacity: 0.85;
  animation: ntk-button-spin var(--ntk-transition-slow) linear infinite;
}

@keyframes ntk-button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ntk-button__spinner {
    animation-duration: 0ms;
  }
}
</style>