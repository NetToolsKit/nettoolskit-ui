<template>
  <div v-if="matrix.length > 0" class="cms-review-summary cms-review-summary--locale">
    <div class="cms-review-summary__header">
      <strong>{{ tr('Locale coverage matrix', 'Matriz de cobertura por locale') }}</strong>
      <div class="cms-page-preview__chips">
        <q-chip dense square :style="statusChipStyle">
          {{ tr('Active preview', 'Preview ativo') }} · {{ getLocaleLabel(activeLocale) }}
        </q-chip>
        <q-chip
          v-if="activeLocaleCoverage"
          dense
          square
          :style="getStatusStyle(activeLocaleCoverage.status)"
        >
          {{ getSummaryLabel(activeLocaleCoverage) }}
        </q-chip>
      </div>
    </div>
    <div class="cms-locale-coverage-grid">
      <article
        v-for="summary in matrix"
        :key="`locale-coverage-${summary.locale}`"
        class="cms-locale-coverage-card"
      >
        <div class="cms-locale-coverage-card__header">
          <q-chip dense square :style="statusChipStyle">{{ getLocaleLabel(summary.locale) }}</q-chip>
          <q-chip dense square :style="getStatusStyle(summary.status)">
            {{ getStatusLabel(summary.status) }}
          </q-chip>
        </div>
        <small>{{ getSummaryLabel(summary) }}</small>
        <div class="cms-blocks-summary-grid">
          <div
            v-for="category in categories"
            :key="`locale-category-${summary.locale}-${category}`"
            class="cms-blocks-summary-card"
          >
            <span>{{ getCategoryLabel(category) }}</span>
            <strong>{{ summary.categories[category].covered }} / {{ summary.categories[category].total }}</strong>
            <small>{{ summary.categories[category].percentage }}%</small>
          </div>
        </div>
        <div v-if="summary.missingEntries.length > 0" class="cms-review-summary__list">
          <article
            v-for="entry in summary.missingEntries.slice(0, 4)"
            :key="entry.id"
            class="cms-review-summary__item"
          >
            <q-chip dense square :style="getStatusStyle('empty')">
              {{ getCategoryLabel(entry.category) }}
            </q-chip>
            <div class="cms-review-summary__body">
              <strong>{{ entry.label }}</strong>
              <small>{{ entry.fieldLabel }}</small>
            </div>
          </article>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type {
  CmsLocaleCoverageCategory,
  CmsLocaleCoverageStatus,
  CmsLocaleCoverageSummary,
} from '../../../../modules/cms/white-label/locale-coverage'
import type { CmsLocale } from '../../../../modules/cms/white-label/types'

const props = defineProps({
  matrix: {
    type: Array as PropType<CmsLocaleCoverageSummary[]>,
    required: true as const,
  },
  activeLocale: {
    type: String as PropType<CmsLocale>,
    required: true as const,
  },
  activeLocaleCoverage: {
    type: Object as PropType<CmsLocaleCoverageSummary | null>,
    default: null,
  },
  categories: {
    type: Array as PropType<CmsLocaleCoverageCategory[]>,
    required: true as const,
  },
  statusChipStyle: {
    type: Object as PropType<Record<string, string>>,
    required: true as const,
  },
  getStatusStyle: {
    type: Function as PropType<(status: CmsLocaleCoverageStatus) => Record<string, string>>,
    required: true as const,
  },
  getSummaryLabel: {
    type: Function as PropType<(summary: CmsLocaleCoverageSummary | null) => string>,
    required: true as const,
  },
  getStatusLabel: {
    type: Function as PropType<(status: CmsLocaleCoverageStatus) => string>,
    required: true as const,
  },
  getCategoryLabel: {
    type: Function as PropType<(category: CmsLocaleCoverageCategory) => string>,
    required: true as const,
  },
  getLocaleLabel: {
    type: Function as PropType<(locale: CmsLocale) => string>,
    required: true as const,
  },
  isPtBr: {
    type: Boolean,
    required: true as const,
  },
})

function tr(en: string, ptBr: string): string {
  return props.isPtBr ? ptBr : en
}
</script>