<template>
  <div class="cms-workspace-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="cms-workspace-tab"
      :class="{ 'cms-workspace-tab--active': tab.id === modelValue }"
      :aria-selected="tab.id === modelValue ? 'true' : 'false'"
      @click="$emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface CmsWorkspaceTabOption {
  id: string
  label: string
}

defineProps<{
  modelValue: string
  ariaLabel: string
  tabs: CmsWorkspaceTabOption[]
}>()

defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
</script>