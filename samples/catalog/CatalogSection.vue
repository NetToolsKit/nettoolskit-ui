<template>
  <section
    :id="meta.anchor"
    class="cat-section"
  >
    <div class="cat-section__head">
      <div class="cat-section__heading">
        <DsBadge
          v-if="meta.badgeKey"
          :label="t[meta.badgeKey]"
          intent="primary"
          variant="solid"
        />
        <span
          v-else-if="meta.number"
          class="cat-section__num"
        >{{ meta.number }}</span>
        <h2 class="cat-section__title">
          {{ t[meta.titleKey] }}
        </h2>
      </div>
      <button
        v-if="meta.group === 'screens'"
        type="button"
        class="cat-section__fs"
      >
        <span aria-hidden="true">⛶</span> {{ t.fullscreen }}
      </button>
    </div>
    <p class="cat-section__desc">
      {{ t[meta.descKey] }}
    </p>
    <div class="cat-section__stub">
      {{ t.sectionStub }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { DsBadge } from '../../src/index'
import type { CatalogStrings } from './catalogI18n'
import type { CatalogSectionMeta } from './useCatalogShell'

defineProps<{ meta: CatalogSectionMeta; t: CatalogStrings }>()
</script>

<style scoped>
.cat-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-margin-top: 92px;
  padding-top: 8px;
  border-top: 1px solid var(--ntk-border);
}

.cat-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cat-section__heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-section__num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--ntk-primary);
}

.cat-section__title {
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ntk-text-heading);
}

.cat-section__fs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--ntk-border);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-card-bg);
  color: var(--ntk-text-body);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 7px 12px;
  cursor: pointer;
}

.cat-section__fs:hover {
  border-color: var(--ntk-border-strong);
}

.cat-section__desc {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--ntk-text-muted);
  max-width: 66ch;
}

.cat-section__stub {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  border-radius: var(--ntk-radius-lg);
  border: 1px dashed var(--ntk-border);
  background: var(--ntk-row-bg);
  color: var(--ntk-text-muted);
  font-size: 13px;
}
</style>