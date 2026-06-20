<template>
  <div
    class="cms-preview-toolbar"
    :data-cms-preview-source="source"
    :data-cms-preview-locale="locale"
    :data-cms-preview-viewport="viewport"
  >
    <NtkSelect
      :model-value="source"
      variant="outlined"
      size="sm"
      emit-value
      map-options
      :options="sourceSelectOptions"
      :label="tr('Preview source', 'Origem do preview')"
      popup-content-class="cms-preview-toolbar__popup"
      @update:model-value="emitSourceUpdate"
    />
    <NtkSelect
      :model-value="locale"
      variant="outlined"
      size="sm"
      emit-value
      map-options
      :options="localeSelectOptions"
      :label="tr('Preview locale', 'Locale do preview')"
      popup-content-class="cms-preview-toolbar__popup"
      @update:model-value="emitLocaleUpdate"
    />
    <NtkSelect
      :model-value="viewport"
      variant="outlined"
      size="sm"
      emit-value
      map-options
      :options="viewportSelectOptions"
      :label="tr('Preview viewport', 'Viewport do preview')"
      popup-content-class="cms-preview-toolbar__popup"
      @update:model-value="emitViewportUpdate"
    />
    <div class="cms-preview-toolbar__chips">
      <q-chip dense square :style="statusChipStyle">{{ source }}</q-chip>
      <q-chip dense square :style="statusChipStyle">{{ viewport }}</q-chip>
      <q-chip dense square :style="statusChipStyle">{{ locale }}</q-chip>
      <q-chip v-if="publishedReleaseLabel" dense square :style="statusChipStyle">
        {{ publishedReleaseLabel }}
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NtkSelect from '../../../../components/form/NtkSelect.vue'

interface SelectOption {
  label: string
  value: string
}

const props = defineProps<{
  source: string
  locale: string
  viewport: string
  sourceOptions: readonly SelectOption[]
  localeOptions: readonly SelectOption[]
  viewportOptions: readonly SelectOption[]
  publishedReleaseLabel?: string | null
  statusChipStyle: Record<string, string>
  isPtBr: boolean
}>()

const emit = defineEmits<{
  (e: 'update:source', value: string): void
  (e: 'update:locale', value: string): void
  (e: 'update:viewport', value: string): void
}>()

const sourceSelectOptions = computed(() => [...props.sourceOptions])
const localeSelectOptions = computed(() => [...props.localeOptions])
const viewportSelectOptions = computed(() => [...props.viewportOptions])

function normalizeSelectValue(value: unknown): string {
  return String(value ?? '')
}

function emitSourceUpdate(value: unknown): void {
  emit('update:source', normalizeSelectValue(value))
}

function emitLocaleUpdate(value: unknown): void {
  emit('update:locale', normalizeSelectValue(value))
}

function emitViewportUpdate(value: unknown): void {
  emit('update:viewport', normalizeSelectValue(value))
}

function tr(en: string, ptBr: string): string {
  return props.isPtBr ? ptBr : en
}
</script>