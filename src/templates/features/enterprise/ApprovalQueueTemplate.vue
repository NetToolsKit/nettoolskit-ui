<template>
  <q-page
    class="ntk-template-approval-queue"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-approval-queue__hero">
      <div>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <div class="ntk-template-approval-queue__hero-actions">
        <q-btn
          v-for="action in actions"
          :key="action.id"
          no-caps
          :label="action.label"
          :icon="action.icon"
          :color="action.color || 'primary'"
          :disable="action.disable"
          :flat="action.flat ?? false"
          :outline="action.outline ?? false"
          :unelevated="action.unelevated ?? true"
          :aria-label="action.ariaLabel || action.label"
          @click="emit('action-click', action.id)"
        />
      </div>
    </section>

    <section class="ntk-template-approval-queue__toolbar">
      <div class="ntk-template-approval-queue__search">
        <q-icon
          name="search"
          size="16px"
        />
        <input
          v-model="searchModel"
          type="text"
          :placeholder="searchPlaceholder"
          :aria-label="searchAriaLabel"
        >
      </div>

      <div class="ntk-template-approval-queue__filters">
        <button
          v-for="filter in resolvedFilters"
          :key="filter.id"
          type="button"
          class="ntk-template-approval-queue__filter"
          :class="{ 'ntk-template-approval-queue__filter--active': effectiveFilterId === filter.id }"
          @click="setFilter(filter.id)"
        >
          <span>{{ filter.label }}</span>
          <small v-if="filter.count !== undefined">{{ filter.count }}</small>
        </button>
      </div>
    </section>

    <section
      v-if="selectedIds.length > 0"
      class="ntk-template-approval-queue__bulk"
      :aria-label="bulkAriaLabel"
    >
      <strong>{{ selectedSummaryLabel }}</strong>
      <div class="ntk-template-approval-queue__bulk-actions">
        <q-btn
          flat
          dense
          no-caps
          icon="task_alt"
          :label="approveSelectedLabel"
          @click="emitBulkDecision('approve')"
        />
        <q-btn
          flat
          dense
          no-caps
          icon="rate_review"
          :label="requestChangesSelectedLabel"
          @click="emitBulkDecision('request_changes')"
        />
        <q-btn
          flat
          dense
          no-caps
          icon="cancel"
          :label="rejectSelectedLabel"
          @click="emitBulkDecision('reject')"
        />
      </div>
    </section>

    <section class="ntk-template-approval-queue__list">
      <article
        v-for="item in filteredItems"
        :key="item.id"
        class="ntk-template-approval-queue__item"
      >
        <header class="ntk-template-approval-queue__item-header">
          <label class="ntk-template-approval-queue__selection">
            <input
              type="checkbox"
              :checked="selectedSet.has(item.id)"
              @change="handleCheckboxChange(item.id, $event)"
            >
            <span>{{ item.title }}</span>
          </label>

          <span
            class="ntk-template-approval-queue__status"
            :class="`ntk-template-approval-queue__status--${item.tone || 'neutral'}`"
          >
            {{ item.statusLabel || emptyValueLabel }}
          </span>
        </header>

        <p class="ntk-template-approval-queue__summary">
          {{ item.summary || emptyValueLabel }}
        </p>

        <div class="ntk-template-approval-queue__meta">
          <span>{{ requesterLabel }}: {{ item.requester || emptyValueLabel }}</span>
          <span>{{ submittedAtLabel }}: {{ item.submittedAt || emptyValueLabel }}</span>
          <span>{{ amountLabel }}: {{ item.amount || emptyValueLabel }}</span>
        </div>

        <div
          v-if="item.tags && item.tags.length > 0"
          class="ntk-template-approval-queue__tags"
        >
          <span
            v-for="tag in item.tags.slice(0, 3)"
            :key="`${item.id}-${tag}`"
            class="ntk-template-approval-queue__tag"
          >
            {{ tag }}
          </span>
        </div>

        <div class="ntk-template-approval-queue__actions">
          <q-btn
            dense
            no-caps
            icon="visibility"
            :label="openLabel"
            @click="emit('open-item', item.id)"
          />
          <q-btn
            dense
            no-caps
            icon="task_alt"
            :label="approveLabel"
            color="positive"
            @click="emitDecision(item.id, 'approve')"
          />
          <q-btn
            dense
            no-caps
            icon="rate_review"
            :label="requestChangesLabel"
            color="warning"
            @click="emitDecision(item.id, 'request_changes')"
          />
          <q-btn
            dense
            no-caps
            icon="cancel"
            :label="rejectLabel"
            color="negative"
            @click="emitDecision(item.id, 'reject')"
          />
        </div>
      </article>

      <div
        v-if="filteredItems.length === 0"
        class="ntk-template-approval-queue__empty"
      >
        <q-icon
          :name="emptyIcon"
          size="36px"
        />
        <h2>{{ emptyTitle }}</h2>
        <p>{{ emptySubtitle }}</p>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type {
  TemplateApprovalDecision,
  TemplateApprovalQueueItem,
  TemplateEnterpriseAction,
  TemplateEnterpriseFilterOption,
} from './enterprise-template.types'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  actions?: TemplateEnterpriseAction[]
  items?: TemplateApprovalQueueItem[]
  filters?: TemplateEnterpriseFilterOption[]
  searchValue?: string
  activeFilterId?: string
  selectedIds?: string[]
  pageAriaLabel?: string
  bulkAriaLabel?: string
  searchPlaceholder?: string
  searchAriaLabel?: string
  selectedCountLabel?: string
  requesterLabel?: string
  submittedAtLabel?: string
  amountLabel?: string
  openLabel?: string
  approveLabel?: string
  requestChangesLabel?: string
  rejectLabel?: string
  approveSelectedLabel?: string
  requestChangesSelectedLabel?: string
  rejectSelectedLabel?: string
  emptyValueLabel?: string
  emptyTitle?: string
  emptySubtitle?: string
  emptyIcon?: string
}>(), {
  title: 'Approval queue',
  subtitle: 'Generic enterprise approval workflow template for operational and governance flows.',
  actions: () => [],
  items: () => [],
  filters: () => [],
  searchValue: '',
  activeFilterId: 'all',
  selectedIds: () => [],
  pageAriaLabel: 'Approval queue',
  bulkAriaLabel: 'Bulk approval actions',
  searchPlaceholder: 'Search requests, requester or tags...',
  searchAriaLabel: 'Search approval queue',
  selectedCountLabel: '{count} selected',
  requesterLabel: 'Requester',
  submittedAtLabel: 'Submitted',
  amountLabel: 'Amount',
  openLabel: 'Open',
  approveLabel: 'Approve',
  requestChangesLabel: 'Request changes',
  rejectLabel: 'Reject',
  approveSelectedLabel: 'Approve selected',
  requestChangesSelectedLabel: 'Request changes',
  rejectSelectedLabel: 'Reject selected',
  emptyValueLabel: '—',
  emptyTitle: 'No approvals found',
  emptySubtitle: 'Try changing filters or search terms.',
  emptyIcon: 'inbox',
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeFilterId': [value: string]
  'update:selectedIds': [ids: string[]]
  'action-click': [actionId: string]
  'open-item': [itemId: string]
  'decision-click': [payload: { itemId: string; decision: TemplateApprovalDecision }]
  'bulk-decision-click': [payload: { itemIds: string[]; decision: TemplateApprovalDecision }]
}>()

const actions = computed<TemplateEnterpriseAction[]>(() => props.actions)

const searchModel = computed<string>({
  get: () => props.searchValue,
  set: value => emit('update:searchValue', value),
})

const resolvedFilters = computed<TemplateEnterpriseFilterOption[]>(() => {
  if (props.filters.length > 0) {
    return props.filters
  }

  return [
    { id: 'all', label: 'All', count: props.items.length },
    { id: 'pending', label: 'Pending', count: props.items.filter(item => (item.filterKeys || []).includes('pending')).length },
    { id: 'urgent', label: 'Urgent', count: props.items.filter(item => (item.filterKeys || []).includes('urgent')).length },
  ]
})

const effectiveFilterId = computed<string>(() => {
  if (resolvedFilters.value.some(filter => filter.id === props.activeFilterId)) {
    return props.activeFilterId
  }
  return resolvedFilters.value[0]?.id || 'all'
})

const filteredItems = computed<TemplateApprovalQueueItem[]>(() => {
  const activeFilter = effectiveFilterId.value
  const search = searchModel.value.trim().toLowerCase()

  return props.items.filter(item => {
    if (activeFilter !== 'all' && !(item.filterKeys || []).includes(activeFilter)) {
      return false
    }

    if (!search) {
      return true
    }

    const text = [
      item.title,
      item.summary,
      item.requester,
      item.statusLabel,
      ...(item.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return text.includes(search)
  })
})

const selectedSet = computed<Set<string>>(() => new Set(props.selectedIds))
const selectedIds = computed<string[]>(() => props.selectedIds)

const selectedSummaryLabel = computed<string>(() => {
  return props.selectedCountLabel.replace('{count}', String(props.selectedIds.length))
})

function setFilter(filterId: string): void {
  emit('update:activeFilterId', filterId)
}

function toggleSelection(itemId: string, value: boolean): void {
  const next = new Set(props.selectedIds)
  if (value) {
    next.add(itemId)
  } else {
    next.delete(itemId)
  }

  emit('update:selectedIds', [...next])
}

function handleCheckboxChange(itemId: string, event: Event): void {
  const target = event.target as HTMLInputElement | null
  toggleSelection(itemId, Boolean(target?.checked))
}

function emitDecision(itemId: string, decision: TemplateApprovalDecision): void {
  emit('decision-click', { itemId, decision })
}

function emitBulkDecision(decision: TemplateApprovalDecision): void {
  emit('bulk-decision-click', { itemIds: [...props.selectedIds], decision })
}
</script>

<style scoped lang="scss">
.ntk-template-approval-queue {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--ntk-template-page-bg, #f8fafc);
}

.ntk-template-approval-queue__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 14px 16px;
}

.ntk-template-approval-queue__hero h1 {
  margin: 0;
  font-size: 20px;
}

.ntk-template-approval-queue__hero p {
  margin: 4px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-approval-queue__hero-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ntk-template-approval-queue__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 8px;
}

.ntk-template-approval-queue__search {
  width: min(320px, 100%);
  min-height: 42px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-approval-queue__search input {
  border: 0;
  background: transparent;
  outline: 0;
  width: 100%;
}

.ntk-template-approval-queue__filters {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 8px;
}

.ntk-template-approval-queue__filter {
  border: 0;
  background: transparent;
  border-radius: 6px;
  min-height: 32px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ntk-template-page-subtitle, #64748b);
  cursor: pointer;
}

.ntk-template-approval-queue__filter--active {
  background: var(--ntk-primary, #512bd4);
  color: var(--ntk-text-on-primary, #ffffff);
}

.ntk-template-approval-queue__bulk {
  border: 1px solid color-mix(in srgb, var(--semantic-info-primary, #3b82f6) 44%, var(--ntk-template-page-border, #e2e8f0));
  background: color-mix(in srgb, var(--semantic-info-primary, #3b82f6) 10%, white);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-template-approval-queue__bulk-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ntk-template-approval-queue__list {
  display: grid;
  gap: 10px;
}

.ntk-template-approval-queue__item {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 12px;
}

.ntk-template-approval-queue__item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.ntk-template-approval-queue__selection {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-approval-queue__status {
  min-height: 24px;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  background: var(--ntk-template-page-row-bg, #f1f5f9);
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-approval-queue__status--success {
  background: color-mix(in srgb, var(--semantic-success-primary, #22c55e) 14%, white);
  color: var(--semantic-success-primary, #22c55e);
}

.ntk-template-approval-queue__status--warning {
  background: color-mix(in srgb, var(--semantic-warning-primary, #f59e0b) 14%, white);
  color: var(--semantic-warning-primary, #f59e0b);
}

.ntk-template-approval-queue__status--danger {
  background: color-mix(in srgb, var(--semantic-error-primary, #ef4444) 14%, white);
  color: var(--semantic-error-primary, #ef4444);
}

.ntk-template-approval-queue__summary {
  margin: 8px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-approval-queue__meta {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-approval-queue__tags {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ntk-template-approval-queue__tag {
  min-height: 22px;
  border-radius: 999px;
  padding: 2px 8px;
  background: var(--ntk-template-page-row-bg, #f1f5f9);
  color: var(--ntk-template-page-subtitle, #64748b);
  font-size: 11px;
}

.ntk-template-approval-queue__actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ntk-template-approval-queue__empty {
  min-height: 220px;
  border: 1px dashed var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-approval-queue__empty h2 {
  margin: 0;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-approval-queue__empty p {
  margin: 0;
}

@media (max-width: 1024px) {
  .ntk-template-approval-queue__hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .ntk-template-approval-queue__bulk {
    flex-direction: column;
    align-items: flex-start;
  }

  .ntk-template-approval-queue__bulk-actions {
    margin-left: 0;
  }
}
</style>