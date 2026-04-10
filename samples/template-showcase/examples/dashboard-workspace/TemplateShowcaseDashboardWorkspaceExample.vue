<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="dashboard-workspace"
  >
    <h2>Dashboard Workspace Template</h2>
    <DashboardWorkspaceTemplate
      :actions="templateShowcaseWorkspaceSample.actions"
      :filters="templateShowcaseWorkspaceSample.filters"
      :views="templateShowcaseWorkspaceSample.views"
      :metrics="templateShowcaseWorkspaceSample.metrics"
      :panels="templateShowcaseWorkspaceSample.panels"
      :lanes="templateShowcaseWorkspaceSample.lanes"
      :search-value="searchValue"
      :active-filter-id="activeFilterId"
      :active-view-id="activeViewId"
      @update:search-value="searchValue = $event"
      @update:active-filter-id="activeFilterId = $event"
      @update:active-view-id="activeViewId = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import DashboardWorkspaceTemplate from '../../../../src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue'
import { templateShowcaseWorkspaceSample } from '../../template-showcase.sample-data'

const searchValue = ref(templateShowcaseWorkspaceSample.initialSearchValue)
const activeFilterId = ref(templateShowcaseWorkspaceSample.initialFilterId)
const activeViewId = ref(templateShowcaseWorkspaceSample.initialViewId)
</script>
