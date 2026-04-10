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
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 20px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  padding: 20px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

.ntk-reference-detail-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ntk-reference-detail-card__label {
  margin: 0;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-reference-detail-card__header h2 {
  margin: 8px 0 0;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-reference-detail-card__description {
  color: var(--ntk-text-secondary, #475569);
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
  color: color-mix(in srgb, var(--ntk-text-secondary, #64748b) 76%, transparent);
}

.ntk-reference-detail-card__meta dd {
  margin: 6px 0 0;
  color: var(--ntk-text-primary, #0f172a);
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
  background: var(--ntk-reference-badge-bg, #eff6ff);
  color: var(--ntk-reference-badge-text, #1d4ed8);
  font-size: 12px;
  font-weight: 700;
}

.ntk-reference-detail-card__actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.ntk-reference-detail-card__action {
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 16px;
  background: var(--ntk-reference-panel-muted-bg, #f8fbff);
  padding: 16px;
  text-align: left;
  cursor: pointer;
}

.ntk-reference-detail-card__action-main {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-reference-detail-card__action span {
  display: block;
  margin-top: 8px;
  color: var(--ntk-text-secondary, #64748b);
  font-size: 13px;
}

@media (max-width: 980px) {
  .ntk-reference-detail-card__meta {
    grid-template-columns: 1fr;
  }
}
</style>
