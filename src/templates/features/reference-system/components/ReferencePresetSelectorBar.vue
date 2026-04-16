<template>
  <div class="ntk-reference-preset-selector-bar">
    <q-select
      :model-value="modelValue"
      dense
      outlined
      emit-value
      map-options
      name="reference-preset-selector"
      :options="options"
      :label="label"
      popup-content-class="ntk-reference-preset-selector-bar__popup"
      class="ntk-reference-preset-selector-bar__select"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <q-btn
      v-if="showPrimaryAction"
      no-caps
      unelevated
      :icon="primaryActionIcon"
      :label="primaryActionLabel"
      class="ntk-reference-preset-selector-bar__action"
      @click="emit('primary-action-click')"
    />
  </div>
</template>

<script setup lang="ts">
interface ReferencePresetSelectorOption {
  label: string
  value: string
}

withDefaults(defineProps<{
  modelValue: string
  options?: ReferencePresetSelectorOption[]
  label?: string
  primaryActionLabel?: string
  primaryActionIcon?: string
  showPrimaryAction?: boolean
}>(), {
  options: () => [],
  label: 'Whitelabel preset',
  primaryActionLabel: 'Open designer',
  primaryActionIcon: 'design_services',
  showPrimaryAction: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'primary-action-click': []
}>()
</script>

<style scoped lang="scss">
.ntk-reference-preset-selector-bar {
  --ntk-reference-preset-selector-bar-surface: var(--ntk-reference-panel-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  --ntk-reference-preset-selector-bar-border: var(--ntk-reference-border, var(--ntk-template-page-border, var(--ntk-border-color)));
  --ntk-reference-preset-selector-bar-text: var(--ntk-reference-title, var(--ntk-template-page-title, var(--ntk-text-primary)));
  --ntk-reference-preset-selector-bar-subtitle: var(--ntk-reference-muted, var(--ntk-template-page-subtitle, var(--ntk-text-secondary)));
  --ntk-reference-preset-selector-bar-accent: var(--ntk-primary, var(--ntk-accent));
  --ntk-reference-preset-selector-bar-accent-contrast: var(--ntk-text-on-accent, var(--ntk-text-primary));
  --ntk-reference-preset-selector-bar-focus: var(--ntk-border-focus, var(--ntk-reference-preset-selector-bar-accent));
  --ntk-reference-preset-selector-bar-popup-shadow: var(--ntk-reference-shell-glow, 0 12px 28px color-mix(in srgb, var(--ntk-reference-preset-selector-bar-text) 10%, transparent));

  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-reference-preset-selector-bar__select {
  min-width: 220px;
}

.ntk-reference-preset-selector-bar__select:deep(.q-field__control) {
  border-radius: 10px;
  background: var(--ntk-reference-preset-selector-bar-surface);
  color: var(--ntk-reference-preset-selector-bar-text);
}

.ntk-reference-preset-selector-bar__select:deep(.q-field__native),
.ntk-reference-preset-selector-bar__select:deep(.q-field__input),
.ntk-reference-preset-selector-bar__select:deep(.q-field__label),
.ntk-reference-preset-selector-bar__select:deep(.q-field__marginal) {
  color: var(--ntk-reference-preset-selector-bar-subtitle);
}

.ntk-reference-preset-selector-bar__select:deep(.q-field__native span),
.ntk-reference-preset-selector-bar__select:deep(.q-field__input span) {
  color: var(--ntk-reference-preset-selector-bar-text);
}

.ntk-reference-preset-selector-bar__select:deep(.q-field--outlined .q-field__control::before) {
  border-color: var(--ntk-reference-preset-selector-bar-border);
}

.ntk-reference-preset-selector-bar__select:deep(.q-field--outlined.q-field--focused .q-field__control::before),
.ntk-reference-preset-selector-bar__select:deep(.q-field--outlined.q-field--focused .q-field__control::after) {
  border-color: var(--ntk-reference-preset-selector-bar-focus);
}

.ntk-reference-preset-selector-bar__action {
  border-radius: 10px;
  background: var(--ntk-reference-preset-selector-bar-accent);
  color: var(--ntk-reference-preset-selector-bar-accent-contrast);
  font-weight: 600;
}

.ntk-reference-preset-selector-bar__action:focus-visible {
  outline: 2px solid var(--ntk-reference-preset-selector-bar-focus);
  outline-offset: 2px;
}

:deep(.ntk-reference-preset-selector-bar__popup) {
  border: 1px solid var(--ntk-reference-preset-selector-bar-border);
  border-radius: 12px;
  background: var(--ntk-reference-preset-selector-bar-surface);
  color: var(--ntk-reference-preset-selector-bar-text);
  box-shadow: var(--ntk-reference-preset-selector-bar-popup-shadow);
}

:deep(.ntk-reference-preset-selector-bar__popup .q-item) {
  color: var(--ntk-reference-preset-selector-bar-text);
}

:deep(.ntk-reference-preset-selector-bar__popup .q-item__label--caption),
:deep(.ntk-reference-preset-selector-bar__popup .q-item__section--side) {
  color: var(--ntk-reference-preset-selector-bar-subtitle) !important;
}

:deep(.ntk-reference-preset-selector-bar__popup .q-item.q-manual-focusable--focused),
:deep(.ntk-reference-preset-selector-bar__popup .q-item:hover) {
  background: color-mix(in srgb, var(--ntk-reference-preset-selector-bar-accent) 10%, var(--ntk-reference-preset-selector-bar-surface));
}

@media (max-width: 880px) {
  .ntk-reference-preset-selector-bar {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .ntk-reference-preset-selector-bar__select {
    min-width: 0;
    width: 100%;
  }
}
</style>
