<template>
  <div class="ntk-reference-preset-selector-bar">
    <q-select
      :model-value="modelValue"
      dense
      outlined
      emit-value
      map-options
      :options="options"
      :label="label"
      class="ntk-reference-preset-selector-bar__select"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <q-btn
      v-if="showPrimaryAction"
      no-caps
      unelevated
      color="primary"
      :icon="primaryActionIcon"
      :label="primaryActionLabel"
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
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-reference-preset-selector-bar__select {
  min-width: 220px;
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