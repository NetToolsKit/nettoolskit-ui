<template>
  <aside
    class="ntk-reference-catalog-panel"
    :aria-label="panelAriaLabel"
  >
    <header class="ntk-reference-catalog-panel__header">
      <div>
        <p class="ntk-reference-catalog-panel__eyebrow">
          {{ eyebrow }}
        </p>
        <h2>{{ title }}</h2>
      </div>
      <span class="ntk-reference-catalog-panel__count">{{ filteredCount }} files</span>
    </header>

    <label class="ntk-reference-catalog-panel__search">
      <q-icon
        name="search"
        size="16px"
      />
      <input
        :value="searchValue"
        type="text"
        :placeholder="searchPlaceholder"
        :aria-label="searchAriaLabel"
        @input="onSearchInput"
      >
    </label>

    <div class="ntk-reference-catalog-panel__groups">
      <section
        v-for="group in filteredGroups"
        :key="group.id"
        class="ntk-reference-catalog-panel__group"
      >
        <header class="ntk-reference-catalog-panel__group-header">
          <strong>{{ group.title }}</strong>
          <span>{{ group.items.length }}</span>
        </header>

        <button
          v-for="report in group.items"
          :key="report.id"
          type="button"
          class="ntk-reference-catalog-panel__item"
          :class="{ 'ntk-reference-catalog-panel__item--active': report.id === activeReportId }"
          :aria-pressed="report.id === activeReportId"
          @click="selectReport(report.id)"
        >
          <div class="ntk-reference-catalog-panel__item-main">
            <div class="ntk-reference-catalog-panel__item-title">
              <span>{{ report.fileName }}</span>
              <q-icon
                v-if="report.favorite"
                name="star"
                size="14px"
              />
            </div>
            <small>{{ report.title }}</small>
          </div>
          <ReferenceReportStatusBadge :status="report.status" />
        </button>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ReferenceReportStatusBadge from './ReferenceReportStatusBadge.vue'
import type { ReferenceReportGroup } from '../reference-system.types'

const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  searchValue?: string
  searchPlaceholder?: string
  panelAriaLabel?: string
  searchAriaLabel?: string
  activeReportId?: string | null
  reportGroups: ReferenceReportGroup[]
}>(), {
  title: 'Reports',
  eyebrow: 'Catalog',
  searchValue: '',
  searchPlaceholder: 'Search reports',
  panelAriaLabel: 'Report catalog panel',
  searchAriaLabel: 'Search reports',
  activeReportId: null,
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeReportId': [value: string]
  'report-select': [value: string]
}>()

const filteredGroups = computed<ReferenceReportGroup[]>(() => {
  const search = props.searchValue.trim().toLowerCase()
  if (!search) {
    return props.reportGroups
  }

  return props.reportGroups
    .map(group => ({
      ...group,
      items: group.items.filter(report => {
        const text = [
          report.fileName,
          report.title,
          report.description,
          report.category,
          report.owner,
          ...(report.tags ?? []),
        ]
          .join(' ')
          .toLowerCase()
        return text.includes(search)
      }),
    }))
    .filter(group => group.items.length > 0)
})

const filteredCount = computed<number>(() => {
  return filteredGroups.value.reduce((total, group) => total + group.items.length, 0)
})

function onSearchInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:searchValue', target.value)
}

function selectReport(reportId: string): void {
  emit('update:activeReportId', reportId)
  emit('report-select', reportId)
}
</script>

<style scoped lang="scss">
.ntk-reference-catalog-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 18px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.ntk-reference-catalog-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 12px;
  border-bottom: 1px solid var(--ntk-reference-border, #dbe4f0);
}

.ntk-reference-catalog-panel__header h2 {
  margin: 4px 0 0;
  font-size: 18px;
  color: #0f172a;
}

.ntk-reference-catalog-panel__eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
}

.ntk-reference-catalog-panel__count {
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--ntk-reference-badge-bg, #eff6ff);
  color: var(--ntk-reference-badge-text, #1d4ed8);
  font-size: 12px;
  font-weight: 700;
}

.ntk-reference-catalog-panel__search {
  margin: 16px 18px 0;
  min-height: 44px;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 12px;
  background: var(--ntk-reference-panel-muted-bg, #f8fbff);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: #64748b;
}

.ntk-reference-catalog-panel__search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 13px;
  color: #0f172a;
}

.ntk-reference-catalog-panel__groups {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ntk-reference-catalog-panel__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ntk-reference-catalog-panel__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #475569;
  font-size: 12px;
}

.ntk-reference-catalog-panel__item {
  width: 100%;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 14px;
  background: #ffffff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.ntk-reference-catalog-panel__item:hover,
.ntk-reference-catalog-panel__item--active {
  border-color: var(--ntk-reference-accent, #2563eb);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

.ntk-reference-catalog-panel__item-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.ntk-reference-catalog-panel__item-main small {
  display: block;
  margin-top: 3px;
  color: #64748b;
  font-size: 12px;
}

.ntk-reference-catalog-panel :deep(.ntk-reference-status-badge) {
  flex-shrink: 0;
  padding: 4px 8px;
  font-size: 11px;
}
</style>