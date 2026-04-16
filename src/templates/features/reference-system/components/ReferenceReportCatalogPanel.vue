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
        name="reference-report-catalog-search"
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
  --ntk-reference-catalog-panel-surface: var(--ntk-reference-panel-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-primary)));
  --ntk-reference-catalog-panel-surface-muted: var(--ntk-reference-panel-muted-bg, color-mix(in srgb, var(--ntk-reference-catalog-panel-surface) 92%, transparent));
  --ntk-reference-catalog-panel-border: var(--ntk-reference-border, color-mix(in srgb, var(--ntk-text-primary) 12%, transparent));
  --ntk-reference-catalog-panel-text: var(--ntk-text-primary);
  --ntk-reference-catalog-panel-text-muted: var(--ntk-text-secondary);
  --ntk-reference-catalog-panel-accent: var(--ntk-reference-accent, var(--ntk-primary, var(--ntk-accent)));
  --ntk-reference-catalog-panel-accent-soft-bg: color-mix(in srgb, var(--ntk-reference-catalog-panel-accent) 12%, var(--ntk-reference-catalog-panel-surface));
  --ntk-reference-catalog-panel-accent-strong-bg: color-mix(in srgb, var(--ntk-reference-catalog-panel-accent) 24%, transparent);
  --ntk-reference-catalog-panel-accent-strong-border: color-mix(in srgb, var(--ntk-reference-catalog-panel-accent) 28%, transparent);
  --ntk-reference-catalog-panel-shadow: 0 18px 40px color-mix(in srgb, var(--ntk-text-primary) 6%, transparent);
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid var(--ntk-reference-catalog-panel-border);
  border-radius: 18px;
  background: var(--ntk-reference-catalog-panel-surface);
  box-shadow: var(--ntk-reference-catalog-panel-shadow);
  overflow: hidden;
}

.ntk-reference-catalog-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 12px;
  border-bottom: 1px solid var(--ntk-reference-catalog-panel-border);
}

.ntk-reference-catalog-panel__header h2 {
  margin: 4px 0 0;
  font-size: 18px;
  color: var(--ntk-reference-catalog-panel-text);
}

.ntk-reference-catalog-panel__eyebrow {
  margin: 0;
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-reference-catalog-panel-text-muted);
}

.ntk-reference-catalog-panel__count {
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--ntk-reference-catalog-panel-accent-soft-bg);
  color: var(--ntk-reference-catalog-panel-accent);
  font-size: 12px;
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  font-weight: 500;
}

.ntk-reference-catalog-panel__search {
  margin: 16px 18px 0;
  min-height: 44px;
  border: 1px solid var(--ntk-reference-catalog-panel-border);
  border-radius: 12px;
  background: var(--ntk-reference-catalog-panel-surface-muted);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: var(--ntk-reference-catalog-panel-text-muted);
}

.ntk-reference-catalog-panel__search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 13px;
  color: var(--ntk-reference-catalog-panel-text);
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
  color: var(--ntk-reference-catalog-panel-text-muted);
  font-size: 12px;
}

.ntk-reference-catalog-panel__item {
  width: 100%;
  border: 1px solid var(--ntk-reference-catalog-panel-border);
  border-radius: 14px;
  background: var(--ntk-reference-catalog-panel-surface);
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
  border-color: var(--ntk-reference-catalog-panel-accent);
  box-shadow: var(--ntk-reference-shell-glow, 0 12px 24px color-mix(in srgb, var(--ntk-reference-catalog-panel-accent) 10%, transparent));
  transform: translateY(-1px);
}

.ntk-reference-catalog-panel__item-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--ntk-reference-catalog-panel-text);
}

.ntk-reference-catalog-panel__item-main small {
  display: block;
  margin-top: 3px;
  color: var(--ntk-reference-catalog-panel-text-muted);
  font-size: 12px;
}

.ntk-reference-catalog-panel :deep(.ntk-reference-status-badge) {
  flex-shrink: 0;
  padding: 4px 8px;
  font-size: 11px;
}
</style>
