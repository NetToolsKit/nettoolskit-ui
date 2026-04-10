<template>
  <section class="ntk-samples-hub">
    <header class="ntk-samples-hub__header">
      <div>
        <p class="ntk-samples-hub__eyebrow">
          Initial navigation
        </p>
        <h2 class="ntk-samples-hub__title">
          Choose a runtime, a visual family, or a specific template
        </h2>
        <p class="ntk-samples-hub__description">
          This is the starting point for browsing reusable systems. Every action below opens a live route backed by the same shared `src/**` components.
        </p>
      </div>

      <div class="ntk-samples-hub__search">
        <q-icon
          name="search"
          size="18px"
        />
        <input
          id="samples-navigation-filter"
          v-model="searchValue"
          name="samples-navigation-filter"
          type="text"
          placeholder="Filter runtimes, families or templates..."
          class="ntk-samples-hub__search-input"
        >
      </div>
    </header>

    <section class="ntk-samples-hub__section">
      <div class="ntk-samples-hub__section-head">
        <div>
          <p class="ntk-samples-hub__section-label">
            Runtime modes
          </p>
          <h3>Open the live samples</h3>
        </div>
      </div>

      <div class="ntk-samples-hub__runtime-grid">
        <article
          v-for="runtime in filteredRuntimeLinks"
          :key="runtime.id"
          class="ntk-samples-hub__runtime-card"
        >
          <div class="ntk-samples-hub__runtime-icon">
            <q-icon
              :name="runtime.icon"
              size="18px"
            />
          </div>
          <strong>{{ runtime.title }}</strong>
          <p>{{ runtime.description }}</p>
          <q-btn
            no-caps
            unelevated
            color="primary"
            :label="runtime.id === 'catalog-home' ? 'Open home' : 'Open runtime'"
            @click="navigateTo(runtime.href)"
          />
        </article>
      </div>
    </section>

    <section class="ntk-samples-hub__section">
      <div class="ntk-samples-hub__section-head">
        <div>
          <p class="ntk-samples-hub__section-label">
            Visual families
          </p>
          <h3>Select a pack and inspect its live composition</h3>
        </div>
      </div>

      <div class="ntk-samples-hub__family-grid">
        <article
          v-for="family in filteredFamilies"
          :key="family.id"
          class="ntk-samples-hub__family-card"
          :style="family.styleVars"
        >
          <p class="ntk-samples-hub__family-kicker">
            {{ family.kicker }}
          </p>
          <strong>{{ family.label }}</strong>
          <span class="ntk-samples-hub__family-meta">
            {{ family.examples.length }} sample{{ family.examples.length > 1 ? 's' : '' }} · {{ family.preset.label }}
          </span>
          <p>{{ family.description }}</p>
          <q-btn
            no-caps
            outline
            color="primary"
            label="Open family"
            @click="navigateTo(`/?templates=1&family=${family.id}`)"
          />
        </article>
      </div>
    </section>

    <section class="ntk-samples-hub__section">
      <div class="ntk-samples-hub__section-head">
        <div>
          <p class="ntk-samples-hub__section-label">
            Template selection
          </p>
          <h3>Jump straight to a specific reusable example</h3>
        </div>
      </div>

      <div class="ntk-samples-hub__example-grid">
        <article
          v-for="example in filteredExamples"
          :key="example.id"
          class="ntk-samples-hub__example-card"
        >
          <div class="ntk-samples-hub__example-top">
            <span class="ntk-samples-hub__example-tag">
              {{ example.surfaceTag }}
            </span>
            <span class="ntk-samples-hub__example-area">
              {{ example.templateAreas.join(' / ') }}
            </span>
          </div>
          <strong>{{ example.label }}</strong>
          <p>{{ example.summary }}</p>
          <q-btn
            no-caps
            flat
            color="primary"
            label="Open example"
            @click="navigateTo(`/?templates=1&example=${example.id}`)"
          />
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { referenceRuntimeLinks } from '../../src/templates/features/reference-system/reference-catalog.sample-data'
import { templateVisualFamilies } from '../template-showcase/families/template-visual-families'
import { templateShowcaseExampleRegistry } from '../template-showcase/template-showcase.examples'

const searchValue = ref('')

const runtimeLinks = [
  {
    id: 'catalog-home',
    title: 'Samples home',
    description: 'Return to the main navigation and selection page for runtimes, families and templates.',
    href: '/',
    icon: 'home',
  },
  ...referenceRuntimeLinks,
]

const normalizedSearch = computed(() => searchValue.value.trim().toLowerCase())

function includesSearch(chunks: Array<string | undefined>): boolean {
  const search = normalizedSearch.value
  if (!search) {
    return true
  }

  return chunks
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(search)
}

const filteredRuntimeLinks = computed(() => {
  return runtimeLinks.filter(runtime =>
    includesSearch([runtime.title, runtime.description])
  )
})

const filteredFamilies = computed(() => {
  return templateVisualFamilies.filter(family =>
    includesSearch([family.label, family.kicker, family.description, family.preset.label])
  )
})

const filteredExamples = computed(() => {
  return templateShowcaseExampleRegistry.filter(example =>
    includesSearch([example.label, example.summary, example.surfaceTag, example.templateAreas.join(' ')])
  )
})

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}
</script>

<style scoped lang="scss">
.ntk-samples-hub {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 0 24px 32px;
}

.ntk-samples-hub__header,
.ntk-samples-hub__section {
  border: 1px solid var(--ntk-reference-shell-chrome-border, rgba(148, 163, 184, 0.16));
  border-radius: 28px;
  background: var(--ntk-reference-shell-chrome-bg, #ffffff);
  box-shadow: var(--ntk-reference-shell-glow, 0 18px 36px rgba(15, 23, 42, 0.08));
}

.ntk-samples-hub__header {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
  gap: 18px;
  padding: 24px;
}

.ntk-samples-hub__eyebrow,
.ntk-samples-hub__section-label {
  margin: 0 0 8px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-samples-hub__title,
.ntk-samples-hub__section-head h3 {
  margin: 0;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-samples-hub__description {
  margin: 12px 0 0;
  max-width: 720px;
  color: var(--ntk-text-secondary, #64748b);
  line-height: 1.7;
}

.ntk-samples-hub__search {
  min-height: 52px;
  align-self: center;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 18px;
  background: color-mix(in srgb, var(--ntk-reference-panel-muted-bg, #f8fbff) 84%, transparent);
}

.ntk-samples-hub__search-input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-samples-hub__section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ntk-samples-hub__runtime-grid,
.ntk-samples-hub__family-grid,
.ntk-samples-hub__example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.ntk-samples-hub__runtime-card,
.ntk-samples-hub__family-card,
.ntk-samples-hub__example-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100%;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  background: color-mix(in srgb, var(--ntk-reference-panel-bg, #ffffff) 88%, transparent);
}

.ntk-samples-hub__runtime-card strong,
.ntk-samples-hub__family-card strong,
.ntk-samples-hub__example-card strong {
  color: var(--ntk-text-primary, #0f172a);
  font-size: 18px;
}

.ntk-samples-hub__runtime-card p,
.ntk-samples-hub__family-card p,
.ntk-samples-hub__example-card p {
  margin: 0;
  color: var(--ntk-text-secondary, #64748b);
  line-height: 1.6;
}

.ntk-samples-hub__runtime-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--ntk-accent, #10b981) 16%, transparent);
  color: var(--ntk-accent, #10b981);
}

.ntk-samples-hub__family-kicker,
.ntk-samples-hub__example-tag {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-primary-light, #5eead4);
}

.ntk-samples-hub__family-meta,
.ntk-samples-hub__example-area {
  font-size: 12px;
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-samples-hub__example-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

@media (max-width: 1100px) {
  .ntk-samples-hub__header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ntk-samples-hub {
    padding: 0 16px 24px;
  }

  .ntk-samples-hub__section,
  .ntk-samples-hub__header {
    padding: 18px;
  }

  .ntk-samples-hub__example-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
