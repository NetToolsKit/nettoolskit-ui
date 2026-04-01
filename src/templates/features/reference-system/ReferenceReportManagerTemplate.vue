<template>
  <section
    class="ntk-reference-manager"
    :aria-label="pageAriaLabel"
  >
    <header class="ntk-reference-manager__hero">
      <div>
        <p class="ntk-reference-manager__eyebrow">
          {{ eyebrow }}
        </p>
        <h1>{{ title }}</h1>
        <p class="ntk-reference-manager__subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div class="ntk-reference-manager__brand-card">
        <span class="ntk-reference-manager__brand-mark">{{ selectedPreset.brand.logoText }}</span>
        <div>
          <strong>{{ selectedPreset.brand.name }}</strong>
          <p>{{ selectedPreset.brand.subtitle }}</p>
        </div>
      </div>
    </header>

    <div class="ntk-reference-manager__stats">
      <article
        v-for="stat in stats"
        :key="stat.id"
        class="ntk-reference-manager__stat"
      >
        <span>{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
      </article>
    </div>

    <div class="ntk-reference-manager__grid">
      <ReferenceReportCatalogPanel
        :search-value="searchValue"
        :active-report-id="selectedReport?.id ?? null"
        :report-groups="reportGroups"
        title="Reference Files"
        eyebrow="Approved Catalog"
        @update:search-value="emit('update:searchValue', $event)"
        @update:active-report-id="emit('update:activeReportId', $event)"
        @report-select="emit('report-select', $event)"
      />

      <ReferenceReportDetailCard
        :report="selectedReport"
        :quick-actions="quickActions"
        :fallback-empty-title="fallbackEmptyTitle"
        :fallback-empty-description="fallbackEmptyDescription"
        @action-click="emit('action-click', $event)"
      />

      <ReferenceWhitelabelPresetCard :preset="selectedPreset" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ReferenceWhitelabelPreset } from '../../../whitelabel'
import type { TemplateDashboardMetric } from '../../pages'
import ReferenceReportCatalogPanel from './components/ReferenceReportCatalogPanel.vue'
import ReferenceReportDetailCard from './components/ReferenceReportDetailCard.vue'
import ReferenceWhitelabelPresetCard from './components/ReferenceWhitelabelPresetCard.vue'
import { findReferenceReportById } from './reference-report.sample-data'
import type {
  ReferenceReportGroup,
  ReferenceSurfaceAction,
} from './reference-system.types'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  searchValue?: string
  activeReportId?: string | null
  reportGroups: ReferenceReportGroup[]
  stats?: TemplateDashboardMetric[]
  quickActions?: ReferenceSurfaceAction[]
  selectedPreset: ReferenceWhitelabelPreset
  pageAriaLabel?: string
  fallbackEmptyTitle?: string
  fallbackEmptyDescription?: string
}>(), {
  eyebrow: 'Reference System',
  title: 'Approved report catalog',
  subtitle: 'Reusable catalog and whitelabel workspace built from the approved reference layout.',
  searchValue: '',
  activeReportId: null,
  stats: () => [],
  quickActions: () => [],
  pageAriaLabel: 'Reference report catalog page',
  fallbackEmptyTitle: 'Select one approved report',
  fallbackEmptyDescription: 'Choose a report from the catalog to inspect metadata and continue to the designer.',
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeReportId': [value: string]
  'report-select': [value: string]
  'action-click': [value: string]
}>()

const selectedReport = computed(() => {
  return findReferenceReportById(props.reportGroups, props.activeReportId)
})
</script>

<style scoped lang="scss">
.ntk-reference-manager {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  min-height: 100%;
  background: var(--ntk-reference-page-bg, #eef4ff);
}

.ntk-reference-manager__hero {
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 24px;
  background: var(--ntk-reference-hero-bg, linear-gradient(135deg, #ffffff 0%, #eef2ff 100%));
  padding: 24px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.ntk-reference-manager__eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #64748b;
}

.ntk-reference-manager__hero h1 {
  margin: 8px 0 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.05;
  color: #0f172a;
}

.ntk-reference-manager__subtitle {
  margin: 12px 0 0;
  max-width: 720px;
  color: #475569;
}

.ntk-reference-manager__brand-card {
  min-width: 260px;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.ntk-reference-manager__brand-mark {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: var(--ntk-reference-accent, #2563eb);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.ntk-reference-manager__brand-card strong {
  display: block;
  color: #0f172a;
}

.ntk-reference-manager__brand-card p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.ntk-reference-manager__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.ntk-reference-manager__stat {
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 18px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  padding: 18px;
}

.ntk-reference-manager__stat span {
  color: #64748b;
  font-size: 12px;
}

.ntk-reference-manager__stat strong {
  display: block;
  margin-top: 10px;
  font-size: 28px;
  color: #0f172a;
}

.ntk-reference-manager__grid {
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr) 280px;
  gap: 18px;
  min-height: 0;
}

@media (max-width: 1280px) {
  .ntk-reference-manager__grid {
    grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  }

  .ntk-reference-manager :deep(.ntk-reference-preset-card) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 980px) {
  .ntk-reference-manager {
    padding: 16px;
  }

  .ntk-reference-manager__hero {
    flex-direction: column;
  }

  .ntk-reference-manager__stats,
  .ntk-reference-manager__grid {
    grid-template-columns: 1fr;
  }
}
</style>