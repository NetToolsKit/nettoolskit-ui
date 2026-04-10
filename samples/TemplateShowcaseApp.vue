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
              Template-first enterprise baseline
            </p>
            <h1 class="ntk-template-showcase__title">
              NetToolsKit Template Catalog Showcase
            </h1>
            <p class="ntk-template-showcase__subtitle">
              Visual regression preview for reusable layouts, pages, features and integration scaffolds.
            </p>
          </div>

          <div class="ntk-template-showcase__stats">
            <article class="ntk-template-showcase__stat">
              <span>Total templates</span>
              <strong>{{ templateCatalogRegistry.length }}</strong>
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

        <TemplateShowcaseLayoutDashboardExample />
        <TemplateShowcaseAuthLoginExample />
        <TemplateShowcaseDashboardWorkspaceExample />
        <TemplateShowcaseCrudProfilePlaceholderExample />
        <TemplateShowcaseEditorWorkbenchExample />
        <TemplateShowcaseEnterpriseExample />
        <TemplateShowcaseKnowledgeExample />
        <TemplateShowcaseReferenceSystemExample />
        <TemplateShowcaseCmsAuthoringExample />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { TEMPLATE_AREAS, getTemplateCatalogByArea, templateCatalogRegistry } from '../src/templates'
import TemplateShowcaseAuthLoginExample from './template-showcase/examples/auth-login/TemplateShowcaseAuthLoginExample.vue'
import TemplateShowcaseCmsAuthoringExample from './template-showcase/examples/cms-authoring/TemplateShowcaseCmsAuthoringExample.vue'
import TemplateShowcaseCrudProfilePlaceholderExample from './template-showcase/examples/crud-profile-placeholder/TemplateShowcaseCrudProfilePlaceholderExample.vue'
import TemplateShowcaseDashboardWorkspaceExample from './template-showcase/examples/dashboard-workspace/TemplateShowcaseDashboardWorkspaceExample.vue'
import TemplateShowcaseEditorWorkbenchExample from './template-showcase/examples/editor-workbench/TemplateShowcaseEditorWorkbenchExample.vue'
import TemplateShowcaseEnterpriseExample from './template-showcase/examples/enterprise/TemplateShowcaseEnterpriseExample.vue'
import TemplateShowcaseKnowledgeExample from './template-showcase/examples/knowledge/TemplateShowcaseKnowledgeExample.vue'
import TemplateShowcaseLayoutDashboardExample from './template-showcase/examples/layout-dashboard/TemplateShowcaseLayoutDashboardExample.vue'
import TemplateShowcaseReferenceSystemExample from './template-showcase/examples/reference-system/TemplateShowcaseReferenceSystemExample.vue'
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
