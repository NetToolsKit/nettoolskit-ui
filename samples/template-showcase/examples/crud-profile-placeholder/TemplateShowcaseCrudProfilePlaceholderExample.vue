<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="crud-profile-placeholder"
  >
    <h2>CRUD, Profile and Placeholder Templates</h2>
    <CrudListTemplate
      :title="templateShowcaseCrudSample.title"
      :subtitle="templateShowcaseCrudSample.subtitle"
      :columns="templateShowcaseCrudSample.columns"
      :records="templateShowcaseCrudSample.records"
      :filters="templateShowcaseCrudSample.filters"
      :metrics="templateShowcaseCrudSample.metrics"
      :row-actions="templateShowcaseCrudSample.rowActions"
      :bulk-actions="templateShowcaseCrudSample.bulkActions"
      :selected-ids="selectedIds"
      :search-value="searchValue"
      :active-filter-id="activeFilterId"
      :view-mode="viewMode"
      @update:selected-ids="selectedIds = $event"
      @update:search-value="searchValue = $event"
      @update:active-filter-id="activeFilterId = $event"
      @update:view-mode="viewMode = $event"
    />

    <div class="ntk-template-showcase__two-column">
      <ProfileTemplate
        :profile="templateShowcaseProfileSample.profile"
        :groups="templateShowcaseProfileSample.groups"
        :show-logout-action="true"
      />
      <PlaceholderTemplate
        :title="templateShowcasePlaceholderSample.title"
        :subtitle="templateShowcasePlaceholderSample.subtitle"
        :description="templateShowcasePlaceholderSample.description"
        :status-label="templateShowcasePlaceholderSample.statusLabel"
        :hints="templateShowcasePlaceholderSample.hints"
        :primary-action="templateShowcasePlaceholderSample.primaryAction"
        :secondary-action="templateShowcasePlaceholderSample.secondaryAction"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import CrudListTemplate from '../../../../src/templates/pages/crud/CrudListTemplate.vue'
import ProfileTemplate from '../../../../src/templates/pages/account/ProfileTemplate.vue'
import PlaceholderTemplate from '../../../../src/templates/pages/system/PlaceholderTemplate.vue'
import {
  templateShowcaseCrudSample,
  templateShowcasePlaceholderSample,
  templateShowcaseProfileSample,
} from '../../template-showcase.sample-data'

const searchValue = ref(templateShowcaseCrudSample.initialSearchValue)
const activeFilterId = ref(templateShowcaseCrudSample.initialFilterId)
const viewMode = ref<'table' | 'cards'>(templateShowcaseCrudSample.initialViewMode)
const selectedIds = ref<string[]>([...templateShowcaseCrudSample.initialSelectedIds])
</script>
