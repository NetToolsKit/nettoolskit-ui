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
      @account-click="layoutActionMessage = 'Opened the account menu from the layout shell.'"
      @logout-click="layoutActionMessage = 'Triggered the layout sign-out action.'"
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
    <SampleActionStatus
      title="Layout action"
      :message="layoutActionMessage"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import MainLayoutTemplate from '../../../../src/templates/layouts/MainLayoutTemplate.vue'
import DashboardTemplate from '../../../../src/templates/pages/dashboard/DashboardTemplate.vue'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import { templateShowcaseDashboardSample } from '../../template-showcase.sample-data'

const layoutActionMessage = ref('Use the user menu controls in the layout shell to inspect live interactions.')
</script>
