<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="cms-authoring"
  >
    <h2>CMS Authoring Workspace Templates</h2>
    <p class="ntk-template-showcase__surface-note">
      Module surfaces (Settings, Blocks, Media, Pages, Releases) are orchestrated by CmsApp.vue.
      The workbench shell below is the reusable template that composes them.
    </p>
    <CmsAuthoringWorkbench>
      <template #header>
        <div class="ntk-template-showcase__cms-header">
          <span
            v-for="surface in templateShowcaseCmsSample.surfaces"
            :key="surface.id"
            class="ntk-template-showcase__cms-module-badge"
          >
            {{ surface.title.replace('Cms', '').replace('ModuleSurface', '').replace('PreviewSurface', ' Preview') }}
          </span>
        </div>
      </template>
      <template #workbench>
        <div class="ntk-template-showcase__cms-canvas">
          <p>CMS module surfaces mount here. Each surface is an independently reusable template extracted from the authoring monolith.</p>
          <div class="ntk-template-showcase__cms-surface-grid">
            <div
              v-for="surface in templateShowcaseCmsSample.surfaces"
              :key="surface.id"
              class="ntk-template-showcase__cms-surface-card"
            >
              <strong>{{ surface.title }}</strong>
              <span>{{ surface.path }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #status>
        <span class="ntk-template-showcase__cms-status">{{ templateShowcaseCmsSample.surfaces.length }} module surfaces · ready</span>
      </template>
    </CmsAuthoringWorkbench>
  </section>
</template>

<script setup lang="ts">
import CmsAuthoringWorkbench from '../../../../src/templates/features/cms/authoring/CmsAuthoringWorkbench.vue'
import { templateShowcaseCmsSample } from '../../template-showcase.sample-data'
</script>
