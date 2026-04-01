<template>
  <header
    class="ntk-reference-tabs-bar"
    :aria-label="barAriaLabel"
  >
    <div class="ntk-reference-tabs-bar__list">
      <button
        v-for="tab in documentTabs"
        :key="tab.id"
        type="button"
        class="ntk-reference-tabs-bar__tab"
        :class="{ 'ntk-reference-tabs-bar__tab--active': tab.id === activeDocumentTabId }"
        :aria-pressed="tab.id === activeDocumentTabId"
        @click="emit('update:activeDocumentTabId', tab.id)"
      >
        <span>{{ tab.label }}</span>
        <small v-if="tab.caption">{{ tab.caption }}</small>
      </button>
    </div>

    <div class="ntk-reference-tabs-bar__meta">
      <span class="ntk-reference-tabs-bar__preset-badge">{{ selectedPreset.label }}</span>
      <span>{{ selectedPreset.brand.kicker }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ReferenceWhitelabelPreset } from '../../../../whitelabel'
import type { ReferenceDocumentTab } from '../reference-system.types'

withDefaults(defineProps<{
  documentTabs?: ReferenceDocumentTab[]
  activeDocumentTabId?: string
  selectedPreset: ReferenceWhitelabelPreset
  barAriaLabel?: string
}>(), {
  documentTabs: () => [],
  activeDocumentTabId: 'layout',
  barAriaLabel: 'Reference document tabs',
})

const emit = defineEmits<{
  'update:activeDocumentTabId': [value: string]
}>()
</script>

<style scoped lang="scss">
.ntk-reference-tabs-bar {
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 18px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ntk-reference-tabs-bar__list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.ntk-reference-tabs-bar__tab {
  min-width: 140px;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 14px;
  background: var(--ntk-reference-panel-muted-bg, #f8fbff);
  text-align: left;
  padding: 10px 12px;
  cursor: pointer;
}

.ntk-reference-tabs-bar__tab span {
  display: block;
  color: #0f172a;
  font-weight: 700;
}

.ntk-reference-tabs-bar__tab small {
  display: block;
  margin-top: 4px;
  color: #64748b;
}

.ntk-reference-tabs-bar__tab--active {
  border-color: var(--ntk-reference-accent, #2563eb);
  background: var(--ntk-reference-accent-soft, rgba(37, 99, 235, 0.12));
}

.ntk-reference-tabs-bar__meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 13px;
}

.ntk-reference-tabs-bar__preset-badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--ntk-reference-badge-bg, #eff6ff);
  color: var(--ntk-reference-badge-text, #1d4ed8);
  font-weight: 700;
}

@media (max-width: 880px) {
  .ntk-reference-tabs-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .ntk-reference-tabs-bar__meta {
    align-items: flex-start;
  }
}
</style>