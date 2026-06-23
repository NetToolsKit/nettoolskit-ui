<template>
  <DsPage class="ntk-form-page">
    <DsPageHeader :title="title" :description="description">
      <template v-if="$slots.headerActions" #actions>
        <slot name="headerActions" />
      </template>
    </DsPageHeader>

    <DsForm
      :id-prefix="idPrefix"
      :schema="schema"
      :model-value="modelValue"
      :legend="legend"
      :columns="columns"
      :loading="loading"
      :disabled="disabled"
      :submit-label="submitLabel"
      :reset-label="resetLabel"
      :show-actions="showActions"
      :show-reset="showReset"
      @update:model-value="emit('update:modelValue', $event)"
      @submit="emit('submit', $event)"
      @reset="emit('reset')"
    />
  </DsPage>
</template>

<script setup lang="ts">
import type {
  NtkFormColumnCount,
  NtkFormSchema,
  NtkNormalizedFormSchema,
} from '../../core'
import DsForm from './DsForm.vue'
import DsPage from './DsPage.vue'
import DsPageHeader from './DsPageHeader.vue'

defineOptions({
  name: 'DsFormPage',
})

withDefaults(defineProps<{
  readonly title: string
  readonly description?: string
  readonly schema: NtkFormSchema | NtkNormalizedFormSchema
  readonly modelValue?: Record<string, unknown>
  readonly legend?: string
  readonly columns?: NtkFormColumnCount
  readonly loading?: boolean
  readonly disabled?: boolean
  readonly submitLabel?: string
  readonly resetLabel?: string
  readonly showActions?: boolean
  readonly showReset?: boolean
  readonly idPrefix?: string
}>(), {
  loading: false,
  disabled: false,
  showActions: true,
  showReset: true,
  idPrefix: 'ds-form-page',
})

const emit = defineEmits<{
  'update:modelValue': [values: Record<string, unknown>]
  submit: [values: Record<string, unknown>]
  reset: []
}>()
</script>