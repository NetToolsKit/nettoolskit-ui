<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="enterprise"
  >
    <h2>Enterprise Feature Templates</h2>
    <EnterpriseCommandCenterTemplate
      :actions="templateShowcaseEnterpriseSample.actions"
      :filters="templateShowcaseEnterpriseSample.filters"
      :kpis="templateShowcaseEnterpriseSample.kpis"
      :alerts="templateShowcaseEnterpriseSample.alerts"
      :activities="templateShowcaseEnterpriseSample.activities"
      :services="templateShowcaseEnterpriseSample.services"
      :search-value="enterpriseSearchValue"
      :active-filter-id="enterpriseActiveFilterId"
      @update:search-value="enterpriseSearchValue = $event"
      @update:active-filter-id="enterpriseActiveFilterId = $event"
    />

    <div class="ntk-template-showcase__two-column">
      <ApprovalQueueTemplate
        :items="templateShowcaseApprovalQueueSample.items"
        :selected-ids="approvalSelectedIds"
        :search-value="approvalSearchValue"
        :active-filter-id="approvalActiveFilterId"
        @update:selected-ids="approvalSelectedIds = $event"
        @update:search-value="approvalSearchValue = $event"
        @update:active-filter-id="approvalActiveFilterId = $event"
      />
      <AuditTimelineTemplate
        :events="templateShowcaseAuditSample.events"
        :search-value="auditSearchValue"
        :active-filter-id="auditActiveFilterId"
        @update:search-value="auditSearchValue = $event"
        @update:active-filter-id="auditActiveFilterId = $event"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { ApprovalQueueTemplate, AuditTimelineTemplate, EnterpriseCommandCenterTemplate } from '../../../../src/templates/features/enterprise'
import {
  templateShowcaseApprovalQueueSample,
  templateShowcaseAuditSample,
  templateShowcaseEnterpriseSample,
} from '../../template-showcase.sample-data'

const enterpriseSearchValue = ref(templateShowcaseEnterpriseSample.initialSearchValue)
const enterpriseActiveFilterId = ref(templateShowcaseEnterpriseSample.initialFilterId)

const approvalSearchValue = ref(templateShowcaseApprovalQueueSample.initialSearchValue)
const approvalActiveFilterId = ref(templateShowcaseApprovalQueueSample.initialFilterId)
const approvalSelectedIds = ref<string[]>([...templateShowcaseApprovalQueueSample.initialSelectedIds])

const auditSearchValue = ref(templateShowcaseAuditSample.initialSearchValue)
const auditActiveFilterId = ref(templateShowcaseAuditSample.initialFilterId)
</script>
