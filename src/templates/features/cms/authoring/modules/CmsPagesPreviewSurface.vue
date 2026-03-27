<template>
  <CmsShellCard
    :title="t('Pages preview', 'Preview de paginas')"
    body-class="cms-pages__preview"
  >
    <template #header-actions>
      <q-btn
        flat
        dense
        no-caps
        icon="open_in_new"
        :label="t('Open in new window', 'Abrir em nova janela')"
        @click="emit('openInWindow')"
      />
    </template>

    <CmsPreviewToolbar
      :source="source"
      :locale="locale"
      :viewport="viewport"
      :source-options="sourceOptions"
      :locale-options="localeOptions"
      :viewport-options="viewportOptions"
      :published-release-label="publishedReleaseLabel"
      :status-chip-style="statusChipStyle"
      :is-pt-br="isPtBr"
      @update:source="emit('update:source', normalizePreviewSource($event))"
      @update:locale="emit('update:locale', normalizeLocale($event))"
      @update:viewport="emit('update:viewport', normalizePreviewViewport($event))"
    />

    <q-banner
      v-if="emptyMessage"
      rounded
      class="cms-banner"
      :style="bannerStyle"
    >
      {{ emptyMessage }}
    </q-banner>

    <template v-else>
      <div
        v-if="draftPublishedDiff"
        class="cms-review-summary"
      >
        <CmsSectionHeaderSummary
          :title="t('Draft vs published review', 'Revisao rascunho vs publicado')"
          container-class="cms-review-summary__header"
          summary-class="cms-page-preview__chips"
        >
          <template #summary>
            <q-chip
              dense
              square
              :style="statusChipStyle"
            >
              {{ draftPublishedDiff.releaseName }} · {{ draftPublishedDiff.releaseEnvironment }}
            </q-chip>
            <q-chip
              dense
              square
              :style="draftPublishedDiff.hasChanges ? getPreviewDiffStatusStyle('changed') : getPreviewDiffStatusStyle('unchanged')"
            >
              {{
                draftPublishedDiff.hasChanges
                  ? t('Changes detected', 'Mudancas detectadas')
                  : t('No changes against published', 'Sem mudancas contra o publicado')
              }}
            </q-chip>
          </template>
        </CmsSectionHeaderSummary>

        <div class="cms-blocks-summary-grid">
          <div class="cms-blocks-summary-card">
            <span>{{ t('Pages changed', 'Paginas alteradas') }}</span>
            <strong>{{ getPreviewDiffChangeCount(draftPublishedDiff.pageSummary) }}</strong>
          </div>
          <div class="cms-blocks-summary-card">
            <span>{{ t('Sections changed', 'Secoes alteradas') }}</span>
            <strong>{{ getPreviewDiffChangeCount(draftPublishedDiff.sectionSummary) }}</strong>
          </div>
          <div class="cms-blocks-summary-card">
            <span>{{ t('Blocks changed', 'Blocos alterados') }}</span>
            <strong>{{ getPreviewDiffChangeCount(draftPublishedDiff.blockSummary) }}</strong>
          </div>
        </div>

        <div
          v-if="changedPageDiffs.length > 0"
          class="cms-review-summary__list"
        >
          <article
            v-for="pageDiff in changedPageDiffs.slice(0, 6)"
            :key="`page-review-${pageDiff.pageId}`"
            class="cms-review-summary__item"
          >
            <q-chip
              dense
              square
              :style="getPreviewDiffStatusStyle(pageDiff.status)"
            >
              {{ getPreviewDiffStatusLabel(pageDiff.status) }}
            </q-chip>

            <div class="cms-review-summary__body">
              <strong>{{ getPreviewDiffPageLabel(pageDiff) }}</strong>
              <small v-if="getPreviewDiffPagePath(pageDiff)">{{ getPreviewDiffPagePath(pageDiff) }}</small>
              <small>
                {{
                  t(
                    `${pageDiff.sectionSummary.added} sections added · ${pageDiff.sectionSummary.removed} removed · ${pageDiff.sectionSummary.changed} changed · ${pageDiff.blockSummary.changed + pageDiff.blockSummary.added + pageDiff.blockSummary.removed} block changes`,
                    `${pageDiff.sectionSummary.added} secoes adicionadas · ${pageDiff.sectionSummary.removed} removidas · ${pageDiff.sectionSummary.changed} alteradas · ${pageDiff.blockSummary.changed + pageDiff.blockSummary.added + pageDiff.blockSummary.removed} mudancas em blocos`
                  )
                }}
              </small>
            </div>
          </article>
        </div>
      </div>

      <CmsLocaleCoverageMatrix
        :matrix="localeCoverageMatrix"
        :active-locale="locale"
        :active-locale-coverage="activeLocaleCoverage"
        :categories="localeCoverageCategories"
        :status-chip-style="statusChipStyle"
        :get-status-style="getLocaleCoverageStatusStyle"
        :get-summary-label="getLocaleCoverageSummaryLabel"
        :get-status-label="getLocaleCoverageStatusLabel"
        :get-category-label="getLocaleCoverageCategoryLabel"
        :get-locale-label="getLocaleCoverageLocaleLabel"
        :is-pt-br="isPtBr"
      />

      <article
        v-for="(page, pageIndex) in pagesForRender"
        :key="`preview-${source}-${page.id}`"
        class="cms-page-preview"
      >
        <div class="cms-page-preview__header">
          <strong>{{ getPageTitleValue(page) }}</strong>
          <div class="cms-page-preview__chips">
            <q-chip
              dense
              square
              :style="statusChipStyle"
            >
              {{ getContentModelLabel(locale, page.contentModelId, previewAuthoredContentModels) }}
            </q-chip>
            <q-chip
              dense
              square
              :style="statusChipStyle"
            >
              {{ `schema v${page.contentModelVersion ?? '?'} / v${getPageCurrentSchemaVersion(page, previewAuthoredContentModels)}` }}
            </q-chip>
            <q-chip
              dense
              square
              :style="getPageStatusStyle(page.status)"
            >
              {{ page.status }}
            </q-chip>
            <q-chip
              v-if="previewPageDiffMap.get(page.id)"
              dense
              square
              :style="getPreviewDiffStatusStyle(previewPageDiffMap.get(page.id)?.status ?? 'unchanged')"
            >
              {{ getPreviewDiffStatusLabel(previewPageDiffMap.get(page.id)?.status ?? 'unchanged') }}
            </q-chip>
          </div>
        </div>

        <small class="cms-page-preview__path">{{ page.path }}</small>
        <p>{{ getPageDescriptionValue(page) || t('No description provided.', 'Nenhuma descricao informada.') }}</p>

        <div class="cms-runtime-preview">
          <div
            class="cms-runtime-preview__frame"
            :data-preview-viewport="viewport"
          >
            <CmsRenderer
              :page="toPreviewPageSchema(page)"
              :registry="registry"
              :render-context="previewRenderContext"
            />
          </div>
        </div>

        <CmsDiagnosticsListSection
          :title="t('Content diagnostics', 'Diagnosticos de conteudo')"
          :items="toDiagnosticsListItems(getPreviewPageDiagnostics(page.id, pageIndex))"
          :count-style="statusChipStyle"
        />

        <div class="cms-page-preview__sections">
          <q-chip
            v-for="section in page.sections"
            :key="`${page.id}-${section.id}`"
            dense
            square
            :style="getPageSectionStyle(section.enabled)"
          >
            {{ getSectionLabelValue(section) }}
          </q-chip>
        </div>
      </article>
    </template>
  </CmsShellCard>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { CmsBlockRegistry, CmsPageSchema, CmsRecord } from '../../../../../modules/cms/core'
import { CmsRenderer } from '../../../../../modules/cms/renderer'
import type { CmsContentValidationIssue } from '../../../../../modules/cms/white-label/content-validation'
import type {
  CmsLocaleCoverageCategory,
  CmsLocaleCoverageStatus,
  CmsLocaleCoverageSummary,
} from '../../../../../modules/cms/white-label/locale-coverage'
import type {
  CmsPreviewDiffCounterSummary,
  CmsPreviewDiffStatus,
  CmsPreviewDraftPublishedDiff,
  CmsPreviewPageDiffSummary,
} from '../../../../../modules/cms/white-label/preview-diff'
import type {
  CmsAuthoredContentModelSettings,
  CmsLocale,
  CmsPageSettings,
  CmsPreviewSource,
  CmsPreviewViewport,
} from '../../../../../modules/cms/white-label/types'
import CmsDiagnosticsListSection, { type CmsDiagnosticsListItem } from '../CmsDiagnosticsListSection.vue'
import CmsLocaleCoverageMatrix from '../CmsLocaleCoverageMatrix.vue'
import CmsPreviewToolbar from '../CmsPreviewToolbar.vue'
import CmsSectionHeaderSummary from '../CmsSectionHeaderSummary.vue'
import CmsShellCard from '../CmsShellCard.vue'

interface SelectOption {
  label: string
  value: string
}

defineProps<{
  source: CmsPreviewSource
  locale: CmsLocale
  viewport: CmsPreviewViewport
  sourceOptions: readonly SelectOption[]
  localeOptions: readonly SelectOption[]
  viewportOptions: readonly SelectOption[]
  publishedReleaseLabel?: string | null
  statusChipStyle: Record<string, string>
  bannerStyle: CSSProperties
  isPtBr: boolean
  emptyMessage: string
  draftPublishedDiff: CmsPreviewDraftPublishedDiff | null
  changedPageDiffs: CmsPreviewPageDiffSummary[]
  localeCoverageMatrix: CmsLocaleCoverageSummary[]
  activeLocaleCoverage: CmsLocaleCoverageSummary | null
  localeCoverageCategories: CmsLocaleCoverageCategory[]
  pagesForRender: CmsPageSettings[]
  previewPageDiffMap: Map<string, CmsPreviewPageDiffSummary>
  previewAuthoredContentModels: CmsAuthoredContentModelSettings[]
  registry: CmsBlockRegistry
  previewRenderContext: CmsRecord
  t: (en: string, pt: string) => string
  getPreviewDiffStatusStyle: (status: CmsPreviewDiffStatus) => CSSProperties
  getPreviewDiffStatusLabel: (status: CmsPreviewDiffStatus) => string
  getPreviewDiffChangeCount: (summary: CmsPreviewDiffCounterSummary) => number
  getPreviewDiffPageLabel: (page: CmsPreviewPageDiffSummary) => string
  getPreviewDiffPagePath: (page: CmsPreviewPageDiffSummary) => string
  getLocaleCoverageStatusStyle: (status: CmsLocaleCoverageStatus) => Record<string, string>
  getLocaleCoverageSummaryLabel: (summary: CmsLocaleCoverageSummary | null) => string
  getLocaleCoverageStatusLabel: (status: CmsLocaleCoverageStatus) => string
  getLocaleCoverageCategoryLabel: (category: CmsLocaleCoverageCategory) => string
  getLocaleCoverageLocaleLabel: (locale: CmsLocale) => string
  getPageTitleValue: (page: CmsPageSettings) => string
  getPageDescriptionValue: (page: CmsPageSettings) => string
  getContentModelLabel: (
    locale: CmsLocale,
    contentModelId: CmsPageSettings['contentModelId'],
    authoredContentModels: CmsAuthoredContentModelSettings[],
  ) => string
  getPageCurrentSchemaVersion: (
    page: CmsPageSettings,
    authoredContentModels: CmsAuthoredContentModelSettings[],
  ) => number
  getPageStatusStyle: (status: CmsPageSettings['status']) => CSSProperties
  toPreviewPageSchema: (page: CmsPageSettings) => CmsPageSchema
  getPreviewPageDiagnostics: (pageId: string, pageIndex: number) => CmsContentValidationIssue[]
  toDiagnosticsListItems: (issues: CmsContentValidationIssue[]) => CmsDiagnosticsListItem[]
  getPageSectionStyle: (enabled: boolean) => CSSProperties
  getSectionLabelValue: (section: CmsPageSettings['sections'][number]) => string
}>()

const emit = defineEmits<{
  openInWindow: []
  'update:source': [value: CmsPreviewSource]
  'update:locale': [value: CmsLocale]
  'update:viewport': [value: CmsPreviewViewport]
}>()

function normalizePreviewSource(value: string): CmsPreviewSource {
  return value === 'published'
    ? 'published'
    : 'draft'
}

function normalizeLocale(value: string): CmsLocale {
  return value === 'pt-BR'
    ? 'pt-BR'
    : 'en'
}

function normalizePreviewViewport(value: string): CmsPreviewViewport {
  if (value === 'tablet' || value === 'mobile') {
    return value
  }

  return 'desktop'
}
</script>