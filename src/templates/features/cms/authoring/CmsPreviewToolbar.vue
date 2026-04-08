<template>
  <div
    class="cms-preview-toolbar"
    :data-cms-preview-source="source"
    :data-cms-preview-viewport="viewport"
  >
    <q-select
      :model-value="source"
      outlined
      dense
      emit-value
      map-options
      :options="sourceOptions"
      :label="tr('Preview source', 'Origem do preview')"
      @update:model-value="$emit('update:source', $event)"
    />
    <q-select
      :model-value="locale"
      outlined
      dense
      emit-value
      map-options
      :options="localeOptions"
      :label="tr('Preview locale', 'Locale do preview')"
      @update:model-value="$emit('update:locale', $event)"
    />
    <q-select
      :model-value="viewport"
      outlined
      dense
      emit-value
      map-options
      :options="viewportOptions"
      :label="tr('Preview viewport', 'Viewport do preview')"
      @update:model-value="$emit('update:viewport', $event)"
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

defineEmits<{
  (e: 'update:source', value: string): void
  (e: 'update:locale', value: string): void
  (e: 'update:viewport', value: string): void
}>()

function tr(en: string, ptBr: string): string {
  return props.isPtBr ? ptBr : en
}
</script>