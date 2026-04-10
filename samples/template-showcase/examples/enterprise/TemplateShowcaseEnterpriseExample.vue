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
      @action-click="enterpriseMessage = `Command center action executed: ${$event}.`"
      @alert-click="enterpriseMessage = `Alert opened: ${$event}.`"
      @activity-click="enterpriseMessage = `Activity opened: ${$event}.`"
      @service-click="enterpriseMessage = `Service health row selected: ${$event}.`"
    />

    <div class="ntk-template-showcase__two-column">
      <ApprovalQueueTemplate
        :items="approvalItems"
        :selected-ids="approvalSelectedIds"
        :search-value="approvalSearchValue"
        :active-filter-id="approvalActiveFilterId"
        @update:selected-ids="approvalSelectedIds = $event"
        @update:search-value="approvalSearchValue = $event"
        @update:active-filter-id="approvalActiveFilterId = $event"
        @open-item="enterpriseMessage = `Approval request opened: ${$event}.`"
        @decision-click="handleApprovalDecision"
        @bulk-decision-click="handleBulkDecision"
      />
      <AuditTimelineTemplate
        :events="templateShowcaseAuditSample.events"
        :search-value="auditSearchValue"
        :active-filter-id="auditActiveFilterId"
        @update:search-value="auditSearchValue = $event"
        @update:active-filter-id="auditActiveFilterId = $event"
        @event-click="enterpriseMessage = `Audit event opened: ${$event}.`"
      />
    </div>
    <SampleActionStatus
      title="Enterprise action"
      :message="enterpriseMessage"
      tone="warning"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { ApprovalQueueTemplate, AuditTimelineTemplate, EnterpriseCommandCenterTemplate } from '../../../../src/templates/features/enterprise'
import type { TemplateApprovalDecision, TemplateApprovalQueueItem } from '../../../../src/templates/features/enterprise/enterprise-template.types'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
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
const approvalItems = ref<TemplateApprovalQueueItem[]>(templateShowcaseApprovalQueueSample.items.map(item => ({
  ...item,
  tags: item.tags ? [...item.tags] : undefined,
  filterKeys: item.filterKeys ? [...item.filterKeys] : undefined,
})))

const auditSearchValue = ref(templateShowcaseAuditSample.initialSearchValue)
const auditActiveFilterId = ref(templateShowcaseAuditSample.initialFilterId)
const enterpriseMessage = ref('Select alerts, approvals, or audit events to inspect the enterprise flows.')

function applyDecision(itemIds: string[], decision: TemplateApprovalDecision): void {
  const nextStatus = decision === 'approve'
    ? { statusLabel: 'Approved', tone: 'success' as const, filterKeys: ['approved'] }
    : decision === 'request_changes'
      ? { statusLabel: 'Changes requested', tone: 'warning' as const, filterKeys: ['review'] }
      : { statusLabel: 'Rejected', tone: 'danger' as const, filterKeys: ['rejected'] }

  approvalItems.value = approvalItems.value.map(item => {
    if (!itemIds.includes(item.id)) {
      return item
    }

    return {
      ...item,
      statusLabel: nextStatus.statusLabel,
      tone: nextStatus.tone,
      filterKeys: nextStatus.filterKeys,
    }
  })
}

function handleApprovalDecision(payload: { itemId: string; decision: TemplateApprovalDecision }): void {
  applyDecision([payload.itemId], payload.decision)
  enterpriseMessage.value = `Approval decision ${payload.decision} applied to ${payload.itemId}.`
}

function handleBulkDecision(payload: { itemIds: string[]; decision: TemplateApprovalDecision }): void {
  applyDecision(payload.itemIds, payload.decision)
  approvalSelectedIds.value = []
  enterpriseMessage.value = `Bulk decision ${payload.decision} applied to ${payload.itemIds.length} request(s).`
}
</script>
