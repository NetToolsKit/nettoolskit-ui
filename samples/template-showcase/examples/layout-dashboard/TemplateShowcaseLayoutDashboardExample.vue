<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="layout-dashboard"
  >
    <h2>Layout and Dashboard Templates</h2>
    <MainLayoutTemplate
      :menu-items="[]"
      app-name="Template Preview"
      user-name="Template Admin"
      user-initials="TA"
      :show-drawer="false"
      :show-breadcrumb="false"
      :persist-mode="false"
    >
      <DashboardTemplate
        title="Template operations dashboard"
        subtitle="Reusable dashboard shell with chips, metrics and ranked highlights."
        :chips="templateShowcaseDashboardSample.chips"
        :metrics="templateShowcaseDashboardSample.metrics"
        :activities="templateShowcaseDashboardSample.activities"
        :top-items="templateShowcaseDashboardSample.topItems"
      />
    </MainLayoutTemplate>
  </section>
</template>

<script setup lang="ts">
import MainLayoutTemplate from '../../../../src/templates/layouts/MainLayoutTemplate.vue'
import DashboardTemplate from '../../../../src/templates/pages/dashboard/DashboardTemplate.vue'
import { templateShowcaseDashboardSample } from '../../template-showcase.sample-data'
</script>
