<template>
  <q-page
    class="ntk-template-audit-timeline"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-audit-timeline__hero">
      <div>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <div class="ntk-template-audit-timeline__hero-actions">
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

    <section class="ntk-template-audit-timeline__toolbar">
      <div class="ntk-template-audit-timeline__search">
        <q-icon
          name="search"
          size="16px"
        />
        <input
          v-model="searchModel"
          type="text"
          name="audit-timeline-search"
          :placeholder="searchPlaceholder"
          :aria-label="searchAriaLabel"
        >
      </div>

      <div class="ntk-template-audit-timeline__filters">
        <button
          v-for="filter in resolvedFilters"
          :key="filter.id"
          type="button"
          class="ntk-template-audit-timeline__filter"
          :class="{ 'ntk-template-audit-timeline__filter--active': effectiveFilterId === filter.id }"
          @click="setFilter(filter.id)"
        >
          <span>{{ filter.label }}</span>
          <small v-if="filter.count !== undefined">{{ filter.count }}</small>
        </button>
      </div>
    </section>

    <section class="ntk-template-audit-timeline__timeline">
      <article
        v-for="event in filteredEvents"
        :key="event.id"
        class="ntk-template-audit-timeline__event"
        :class="`ntk-template-audit-timeline__event--${event.tone || 'neutral'}`"
        role="button"
        tabindex="0"
        @click="emit('event-click', event.id)"
        @keyup.enter.prevent="emit('event-click', event.id)"
        @keyup.space.prevent="emit('event-click', event.id)"
      >
        <div class="ntk-template-audit-timeline__event-rail" />

        <div class="ntk-template-audit-timeline__event-main">
          <header>
            <strong>{{ event.title }}</strong>
            <small>{{ event.timestamp }}</small>
          </header>

          <p>{{ event.description || emptyValueLabel }}</p>

          <div class="ntk-template-audit-timeline__event-meta">
            <span>{{ actorLabel }}: {{ event.actor || emptyValueLabel }}</span>
            <span>{{ targetLabel }}: {{ event.target || emptyValueLabel }}</span>
            <span>{{ typeLabel }}: {{ event.eventType || emptyValueLabel }}</span>
          </div>
        </div>
      </article>

      <div
        v-if="filteredEvents.length === 0"
        class="ntk-template-audit-timeline__empty"
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
  TemplateAuditTimelineEvent,
  TemplateEnterpriseAction,
  TemplateEnterpriseFilterOption,
} from './enterprise-template.types'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  actions?: TemplateEnterpriseAction[]
  events?: TemplateAuditTimelineEvent[]
  filters?: TemplateEnterpriseFilterOption[]
  searchValue?: string
  activeFilterId?: string
  pageAriaLabel?: string
  searchPlaceholder?: string
  searchAriaLabel?: string
  actorLabel?: string
  targetLabel?: string
  typeLabel?: string
  emptyValueLabel?: string
  emptyTitle?: string
  emptySubtitle?: string
  emptyIcon?: string
}>(), {
  title: 'Audit timeline',
  subtitle: 'Template-first audit trail for enterprise governance and compliance workflows.',
  actions: () => [],
  events: () => [],
  filters: () => [],
  searchValue: '',
  activeFilterId: 'all',
  pageAriaLabel: 'Audit timeline',
  searchPlaceholder: 'Search events, actor or target...',
  searchAriaLabel: 'Search audit events',
  actorLabel: 'Actor',
  targetLabel: 'Target',
  typeLabel: 'Type',
  emptyValueLabel: '—',
  emptyTitle: 'No audit events found',
  emptySubtitle: 'Try changing filters or refining your query.',
  emptyIcon: 'history',
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeFilterId': [value: string]
  'action-click': [actionId: string]
  'event-click': [eventId: string]
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

  const byType = new Map<string, number>()
  props.events.forEach(event => {
    const type = event.eventType || 'general'
    byType.set(type, (byType.get(type) || 0) + 1)
  })

  return [
    { id: 'all', label: 'All', count: props.events.length },
    ...[...byType.entries()].map(([id, count]) => ({ id, label: id, count })),
  ]
})

const effectiveFilterId = computed<string>(() => {
  if (resolvedFilters.value.some(filter => filter.id === props.activeFilterId)) {
    return props.activeFilterId
  }

  return resolvedFilters.value[0]?.id || 'all'
})

const filteredEvents = computed<TemplateAuditTimelineEvent[]>(() => {
  const activeFilter = effectiveFilterId.value
  const search = searchModel.value.trim().toLowerCase()

  return props.events.filter(event => {
    const inFilter = activeFilter === 'all'
      || event.eventType === activeFilter
      || (event.filterKeys || []).includes(activeFilter)

    if (!inFilter) {
      return false
    }

    if (!search) {
      return true
    }

    const text = [
      event.title,
      event.description,
      event.actor,
      event.target,
      event.eventType,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return text.includes(search)
  })
})

function setFilter(filterId: string): void {
  emit('update:activeFilterId', filterId)
}
</script>

<style scoped lang="scss">
.ntk-template-audit-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--ntk-template-page-bg, #f8fafc);
}

.ntk-template-audit-timeline__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 14px 16px;
}

.ntk-template-audit-timeline__hero h1 {
  margin: 0;
  font-size: 20px;
}

.ntk-template-audit-timeline__hero p {
  margin: 4px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-audit-timeline__hero-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ntk-template-audit-timeline__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 8px;
}

.ntk-template-audit-timeline__search {
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

.ntk-template-audit-timeline__search input {
  border: 0;
  background: transparent;
  outline: 0;
  width: 100%;
}

.ntk-template-audit-timeline__filters {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 8px;
}

.ntk-template-audit-timeline__filter {
  border: 0;
  background: transparent;
  border-radius: 6px;
  min-height: 32px;
  padding: 4px 10px;
  color: var(--ntk-template-page-subtitle, #64748b);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.ntk-template-audit-timeline__filter--active {
  background: var(--ntk-primary, #512bd4);
  color: var(--ntk-text-on-primary, #ffffff);
}

.ntk-template-audit-timeline__timeline {
  display: grid;
  gap: 8px;
}

.ntk-template-audit-timeline__event {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 10px;
  display: grid;
  grid-template-columns: 4px minmax(0, 1fr);
  gap: 10px;
  cursor: pointer;
}

.ntk-template-audit-timeline__event:hover {
  box-shadow: var(--ntk-template-surface-shadow-hover, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

.ntk-template-audit-timeline__event:focus-visible {
  outline: 2px solid var(--ntk-border-focus, #512bd4);
  outline-offset: 2px;
}

.ntk-template-audit-timeline__event-rail {
  border-radius: 999px;
  background: var(--ntk-template-page-border, #e2e8f0);
}

.ntk-template-audit-timeline__event--info .ntk-template-audit-timeline__event-rail,
.ntk-template-audit-timeline__event--primary .ntk-template-audit-timeline__event-rail {
  background: var(--semantic-info-primary, #3b82f6);
}

.ntk-template-audit-timeline__event--success .ntk-template-audit-timeline__event-rail {
  background: var(--semantic-success-primary, #22c55e);
}

.ntk-template-audit-timeline__event--warning .ntk-template-audit-timeline__event-rail {
  background: var(--semantic-warning-primary, #f59e0b);
}

.ntk-template-audit-timeline__event--danger .ntk-template-audit-timeline__event-rail {
  background: var(--semantic-error-primary, #ef4444);
}

.ntk-template-audit-timeline__event-main header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.ntk-template-audit-timeline__event-main strong {
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-audit-timeline__event-main small {
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-audit-timeline__event-main p {
  margin: 6px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-audit-timeline__event-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-audit-timeline__empty {
  min-height: 220px;
  border: 1px dashed var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-audit-timeline__empty h2 {
  margin: 0;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-audit-timeline__empty p {
  margin: 0;
}

@media (max-width: 1024px) {
  .ntk-template-audit-timeline__hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
