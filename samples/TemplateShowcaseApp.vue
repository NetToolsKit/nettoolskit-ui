<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="ntk-template-showcase">
        <header
          class="ntk-template-showcase__hero"
          data-template-surface="catalog"
        >
          <div>
            <p class="ntk-template-showcase__kicker">
              Config-driven visual families
            </p>
            <h1 class="ntk-template-showcase__title">
              NetToolsKit Samples Visual Families
            </h1>
            <p class="ntk-template-showcase__subtitle">
              {{ showcaseSubtitle }}
            </p>
          </div>

          <div class="ntk-template-showcase__stats">
            <article class="ntk-template-showcase__stat">
              <span>Curated examples</span>
              <strong>{{ visibleFamilies.length }}</strong>
            </article>
            <article class="ntk-template-showcase__stat">
              <span>Live previews</span>
              <strong>{{ previewVariantCount }}</strong>
            </article>
            <article class="ntk-template-showcase__stat">
              <span>Ready templates</span>
              <strong>{{ readyTemplateCount }}</strong>
            </article>
          </div>
        </header>

        <section class="ntk-template-showcase__hero-actions">
          <q-btn
            no-caps
            unelevated
            color="primary"
            label="Back to home"
            @click="navigateTo('/')"
          />
          <q-btn
            no-caps
            flat
            color="primary"
            label="Open report workspace"
            @click="navigateTo('/?samples=1')"
          />
          <q-btn
            v-if="hasActiveFilter"
            no-caps
            outline
            color="primary"
            label="Clear selection"
            @click="navigateTo('/?templates=1')"
          />
        </section>

        <section class="ntk-template-showcase__catalog-grid">
          <article
            v-for="item in templatesByArea"
            :key="item.area"
            class="ntk-template-showcase__catalog-card"
          >
            <strong>{{ item.area }}</strong>
            <span>{{ item.count }} entries</span>
          </article>
        </section>

        <section class="ntk-template-showcase__family-list">
          <div
            v-if="visibleFamilies.length === 0"
            class="ntk-template-showcase__empty"
          >
            No visual families matched the current selection.
          </div>
          <TemplateVisualFamilySection
            v-for="family in visibleFamilies"
            :key="family.id"
            :family="family"
          />
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { TEMPLATE_AREAS, getTemplateCatalogByArea, templateCatalogRegistry } from '../src/templates'
import TemplateVisualFamilySection from './template-showcase/components/TemplateVisualFamilySection.vue'
import { templateVisualFamilies } from './template-showcase/families/template-visual-families'
import { templateShowcaseExampleRegistry } from './template-showcase/template-showcase.examples'
import './template-showcase/template-showcase.css'

const searchParams = typeof window === 'undefined'
  ? new URLSearchParams()
  : new URLSearchParams(window.location.search)

const focusedFamilyId = searchParams.get('family')
const focusedExampleId = searchParams.get('example')

const templatesByArea = computed(() => {
  return TEMPLATE_AREAS.map(area => ({
    area,
    count: getTemplateCatalogByArea(area).length,
  }))
})

const readyTemplateCount = computed(() => {
  return templateCatalogRegistry.filter(entry => entry.status === 'ready').length
})

const previewVariantCount = computed(() => {
  return visibleFamilies.value.reduce((count, family) => count + family.variants.length, 0)
})

const visibleFamilies = computed(() => {
  return templateVisualFamilies.filter(family => {
    const matchesFamily = !focusedFamilyId || family.id === focusedFamilyId
    const matchesExample = !focusedExampleId || family.example.id === focusedExampleId
    return matchesFamily && matchesExample
  })
})

const hasActiveFilter = computed(() => {
  return Boolean(focusedFamilyId || focusedExampleId)
})

const showcaseSubtitle = computed(() => {
  if (focusedFamilyId) {
    const family = templateVisualFamilies.find(item => item.id === focusedFamilyId)
    return family
      ? `Focused on the ${family.label} example pack. The same shared template is being rendered in both light and dark whitelabel variants.`
      : 'Family filter active. The showcase is focused on the selected example pack.'
  }

  if (focusedExampleId) {
    const example = templateShowcaseExampleRegistry.find(item => item.id === focusedExampleId)
    return example
      ? `Focused on the ${example.label} example. You are seeing its curated light and dark whitelabel variants only.`
      : 'Example filter active. The showcase is focused on the selected reusable template.'
  }

  return 'Five curated reusable examples, each rendered twice through the same `src/**` templates with paired light and dark whitelabel configurations.'
})

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}
</script>
