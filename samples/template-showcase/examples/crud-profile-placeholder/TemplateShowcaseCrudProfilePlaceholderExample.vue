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
      :records="records"
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
      @row-click="handleRowClick"
      @row-action-click="handleRowAction"
      @bulk-action-click="handleBulkAction"
    />

    <div class="ntk-template-showcase__two-column">
      <ProfileTemplate
        :profile="templateShowcaseProfileSample.profile"
        :groups="templateShowcaseProfileSample.groups"
        :show-logout-action="true"
        @logout-click="crudMessage = 'Profile logout action triggered from the reusable account surface.'"
      />
      <PlaceholderTemplate
        :title="templateShowcasePlaceholderSample.title"
        :subtitle="templateShowcasePlaceholderSample.subtitle"
        :description="templateShowcasePlaceholderSample.description"
        :status-label="templateShowcasePlaceholderSample.statusLabel"
        :hints="templateShowcasePlaceholderSample.hints"
        :primary-action="templateShowcasePlaceholderSample.primaryAction"
        :secondary-action="templateShowcasePlaceholderSample.secondaryAction"
        @action-click="crudMessage = `Placeholder action executed: ${$event}.`"
      />
    </div>
    <SampleActionStatus
      title="CRUD action"
      :message="crudMessage"
      tone="success"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import CrudListTemplate from '../../../../src/templates/pages/crud/CrudListTemplate.vue'
import ProfileTemplate from '../../../../src/templates/pages/account/ProfileTemplate.vue'
import PlaceholderTemplate from '../../../../src/templates/pages/system/PlaceholderTemplate.vue'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import {
  templateShowcaseCrudSample,
  templateShowcasePlaceholderSample,
  templateShowcaseProfileSample,
} from '../../template-showcase.sample-data'

const searchValue = ref(templateShowcaseCrudSample.initialSearchValue)
const activeFilterId = ref(templateShowcaseCrudSample.initialFilterId)
const viewMode = ref<'table' | 'cards'>(templateShowcaseCrudSample.initialViewMode)
const selectedIds = ref<string[]>([...templateShowcaseCrudSample.initialSelectedIds])
const records = ref(templateShowcaseCrudSample.records.map(record => ({
  ...record,
  values: { ...record.values },
  status: record.status ? { ...record.status } : undefined,
  tags: record.tags ? [...record.tags] : undefined,
  filterKeys: record.filterKeys ? [...record.filterKeys] : undefined,
})))
const crudMessage = ref('Select a row, trigger an action, or archive records to test the CRUD surface.')

function handleRowClick(recordId: string): void {
  crudMessage.value = `Opened record ${recordId}.`
}

function handleRowAction(payload: { actionId: string; recordId: string }): void {
  crudMessage.value = `Executed ${payload.actionId} for ${payload.recordId}.`
}

function handleBulkAction(payload: { actionId: string; selectedIds: string[] }): void {
  if (payload.actionId === 'archive') {
    records.value = records.value.filter(record => !payload.selectedIds.includes(record.id))
    selectedIds.value = []
    crudMessage.value = `Archived ${payload.selectedIds.length} selected record(s).`
    return
  }

  crudMessage.value = `Bulk action ${payload.actionId} executed for ${payload.selectedIds.length} record(s).`
}
</script>
