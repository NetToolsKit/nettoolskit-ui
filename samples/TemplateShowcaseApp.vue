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
              Five reusable families built on top of the same `src/**` templates, parameterized by whitelabel-style configuration instead of duplicated implementations.
            </p>
          </div>

          <div class="ntk-template-showcase__stats">
            <article class="ntk-template-showcase__stat">
              <span>Visual families</span>
              <strong>{{ templateVisualFamilies.length }}</strong>
            </article>
            <article class="ntk-template-showcase__stat">
              <span>Unique examples</span>
              <strong>{{ templateShowcaseExampleRegistry.length }}</strong>
            </article>
            <article class="ntk-template-showcase__stat">
              <span>Ready templates</span>
              <strong>{{ readyTemplateCount }}</strong>
            </article>
          </div>
        </header>

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
          <TemplateVisualFamilySection
            v-for="family in templateVisualFamilies"
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

const templatesByArea = computed(() => {
  return TEMPLATE_AREAS.map(area => ({
    area,
    count: getTemplateCatalogByArea(area).length,
  }))
})

const readyTemplateCount = computed(() => {
  return templateCatalogRegistry.filter(entry => entry.status === 'ready').length
})
</script>
