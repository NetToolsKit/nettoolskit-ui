<template>
  <article class="ntk-reference-detail-card">
    <div class="ntk-reference-detail-card__header">
      <div>
        <p class="ntk-reference-detail-card__label">
          {{ sectionLabel }}
        </p>
        <h2>{{ report?.fileName ?? fallbackEmptyTitle }}</h2>
      </div>

      <ReferenceReportStatusBadge
        v-if="report"
        :status="report.status"
      />
    </div>

    <p class="ntk-reference-detail-card__description">
      {{ report?.description ?? fallbackEmptyDescription }}
    </p>

    <dl
      v-if="report"
      class="ntk-reference-detail-card__meta"
    >
      <div>
        <dt>Owner</dt>
        <dd>{{ report.owner }}</dd>
      </div>
      <div>
        <dt>Category</dt>
        <dd>{{ report.category }}</dd>
      </div>
      <div>
        <dt>Updated</dt>
        <dd>{{ report.updatedAt }}</dd>
      </div>
    </dl>

    <div
      v-if="report?.tags?.length"
      class="ntk-reference-detail-card__tags"
    >
      <span
        v-for="tag in report.tags"
        :key="tag"
        class="ntk-reference-detail-card__tag"
      >
        {{ tag }}
      </span>
    </div>

    <div
      v-if="quickActions.length > 0"
      class="ntk-reference-detail-card__actions"
    >
      <button
        v-for="action in quickActions"
        :key="action.id"
        type="button"
        class="ntk-reference-detail-card__action"
        @click="emit('action-click', action.id)"
      >
        <div class="ntk-reference-detail-card__action-main">
          <q-icon
            v-if="action.icon"
            :name="action.icon"
            size="18px"
          />
          <strong>{{ action.label }}</strong>
        </div>
        <span>{{ action.description }}</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import ReferenceReportStatusBadge from './ReferenceReportStatusBadge.vue'
import type {
  ReferenceReportItem,
  ReferenceSurfaceAction,
} from '../reference-system.types'

withDefaults(defineProps<{
  report?: ReferenceReportItem | null
  quickActions?: ReferenceSurfaceAction[]
  sectionLabel?: string
  fallbackEmptyTitle?: string
  fallbackEmptyDescription?: string
}>(), {
  report: null,
  quickActions: () => [],
  sectionLabel: 'Selected report',
  fallbackEmptyTitle: 'Select one approved report',
  fallbackEmptyDescription: 'Choose a report from the catalog to inspect metadata and continue to the designer.',
})

const emit = defineEmits<{
  'action-click': [value: string]
}>()
</script>

<style scoped lang="scss">
.ntk-reference-detail-card {
  --ntk-reference-detail-card-tag-bg: var(--ntk-reference-badge-bg, color-mix(in srgb, var(--ntk-reference-accent, var(--ntk-primary, var(--ntk-accent))) 12%, var(--ntk-reference-panel-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-primary)))));
  --ntk-reference-detail-card-tag-text: var(--ntk-reference-badge-text, var(--ntk-reference-accent, var(--ntk-primary, var(--ntk-accent))));
  --ntk-reference-detail-card-tag-border: var(--ntk-reference-badge-border, color-mix(in srgb, var(--ntk-reference-detail-card-tag-text) 14%, transparent));

  border: 1px solid var(--ntk-reference-border, var(--ntk-template-page-border, var(--ntk-border-color)));
  border-radius: 20px;
  background: var(--ntk-reference-panel-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-primary)));
  padding: 20px;
  box-shadow: 0 18px 40px color-mix(in srgb, var(--ntk-text-primary, var(--ntk-text-body)) 5%, transparent);
}

.ntk-reference-detail-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ntk-reference-detail-card__label {
  margin: 0;
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary, var(--ntk-template-page-subtitle, var(--ntk-text-body)));
}

.ntk-reference-detail-card__header h2 {
  margin: 8px 0 0;
  color: var(--ntk-text-primary, var(--ntk-template-page-title, var(--ntk-text-body)));
}

.ntk-reference-detail-card__description {
  color: var(--ntk-text-secondary, var(--ntk-template-page-subtitle, var(--ntk-text-body)));
}

.ntk-reference-detail-card__meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0;
}

.ntk-reference-detail-card__meta dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: color-mix(in srgb, var(--ntk-text-secondary, var(--ntk-template-page-subtitle, var(--ntk-text-body))) 76%, transparent);
}

.ntk-reference-detail-card__meta dd {
  margin: 6px 0 0;
  color: var(--ntk-text-primary, var(--ntk-template-page-title, var(--ntk-text-body)));
  font-weight: 600;
}

.ntk-reference-detail-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.ntk-reference-detail-card__tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--ntk-reference-detail-card-tag-bg);
  color: var(--ntk-reference-detail-card-tag-text);
  border: 1px solid var(--ntk-reference-detail-card-tag-border);
  font-size: 12px;
  font-weight: 700;
}

.ntk-reference-detail-card__actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.ntk-reference-detail-card__action {
  border: 1px solid var(--ntk-reference-border, var(--ntk-template-page-border, var(--ntk-border-color)));
  border-radius: 16px;
  background: var(--ntk-reference-panel-muted-bg, color-mix(in srgb, var(--ntk-reference-panel-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-primary))) 92%, var(--ntk-reference-page-bg, var(--ntk-template-page-bg, var(--ntk-bg-secondary)))));
  padding: 16px;
  text-align: left;
  cursor: pointer;
}

.ntk-reference-detail-card__action-main {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ntk-text-primary, var(--ntk-template-page-title, var(--ntk-text-body)));
}

.ntk-reference-detail-card__action span {
  display: block;
  margin-top: 8px;
  color: var(--ntk-text-secondary, var(--ntk-template-page-subtitle, var(--ntk-text-body)));
  font-size: 13px;
}

@media (max-width: 980px) {
  .ntk-reference-detail-card__meta {
    grid-template-columns: 1fr;
  }
}

:global(.body--dark) .ntk-reference-detail-card {
  --ntk-reference-detail-card-tag-bg: color-mix(in srgb, var(--ntk-reference-accent, var(--ntk-primary, var(--ntk-accent))) 24%, var(--ntk-reference-panel-muted-bg, var(--ntk-bg-secondary)));
  --ntk-reference-detail-card-tag-text: var(--ntk-text-primary, var(--ntk-template-page-title, var(--ntk-text-body)));
  --ntk-reference-detail-card-tag-border: color-mix(in srgb, var(--ntk-reference-accent, var(--ntk-primary, var(--ntk-accent))) 36%, var(--ntk-reference-border, var(--ntk-border-color)));
}
</style>
