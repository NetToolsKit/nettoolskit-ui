<template>
  <section :class="sectionClass">
    <CmsSectionHeaderSummary
      :title="title"
      :container-class="headerClass"
      :summary-class="summaryClass"
    >
      <template #summary>
        <q-chip
          dense
          square
          :style="chipStyle"
        >
          {{ summaryLabel }}
        </q-chip>
      </template>
    </CmsSectionHeaderSummary>

    <div :class="itemsClass">
      <article
        v-for="item in items"
        :key="item.id"
        :class="itemClass"
        v-bind="resolveItemAttrs(item)"
      >
        <div :class="itemHeaderClass">
          <strong>{{ item.title }}</strong>
          <small v-if="item.meta">{{ item.meta }}</small>
        </div>

        <small
          v-for="line in item.lines"
          :key="`${item.id}-${line}`"
        >
          {{ line }}
        </small>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import CmsSectionHeaderSummary from './CmsSectionHeaderSummary.vue'

export interface CmsPanelListSectionItem {
  id: string
  title: string
  meta?: string
  lines?: string[]
}

const props = withDefaults(defineProps<{
  title: string
  summaryLabel: string
  items?: CmsPanelListSectionItem[]
  chipStyle?: CSSProperties
  sectionClass?: string
  headerClass?: string
  summaryClass?: string
  itemsClass?: string
  itemClass?: string
  itemHeaderClass?: string
  itemDataAttrName?: string
}>(), {
  items: () => [],
  chipStyle: undefined,
  sectionClass: '',
  headerClass: '',
  summaryClass: '',
  itemsClass: '',
  itemClass: '',
  itemHeaderClass: '',
  itemDataAttrName: '',
})

function resolveItemAttrs(item: CmsPanelListSectionItem): Record<string, string> {
  return props.itemDataAttrName
    ? { [props.itemDataAttrName]: item.id }
    : {}
}
</script>