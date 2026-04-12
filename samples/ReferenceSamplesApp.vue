<template>
  <ReferenceWorkspaceShell
    :whitelabel-style-vars="whitelabelStyleVars"
    :selected-preset="selectedPreset"
    :selected-preset-id="selectedPresetId"
    :preset-options="presetOptions"
    :menu-items="referenceSampleMenuItems"
    :active-item-id="activeMenuId"
    :search-value="searchValue"
    :notification-count="referenceSampleNotifications.length"
    :notifications="referenceSampleNotifications"
    @update:search-value="searchValue = $event"
    @menu-item-click="onMenuItemClick"
    @update:selected-preset-id="onPresetChange"
    @help-click="onHelpClick"
    @back-home-click="onBackHomeClick"
  >
    <ReferenceWorkspaceComposer
      v-if="activeMenuId === 'catalog' || activeMenuId === 'designer'"
      :mode="activeMenuId === 'catalog' ? 'catalog' : 'designer'"
      :report-groups="referenceSampleReportGroups"
      :selected-preset="selectedPreset"
      :search-value="searchValue"
      :active-report-id="activeReportId"
      :manager-stats="referenceSampleManagerConfig.stats"
      :manager-quick-actions="referenceSampleManagerConfig.quickActions"
      :document-tabs="referenceSampleDocumentTabs"
      :active-document-tab-id="activeDocumentTabId"
      :designer-topbar-actions="referenceSampleDesignerConfig.topbarActions"
      :designer-quick-actions="referenceSampleDesignerConfig.quickActions"
      :widget-sections="referenceSampleDesignerConfig.widgetSections"
      :canvas-columns="referenceSampleDesignerConfig.canvasColumns"
      :canvas-objects="referenceSampleDesignerConfig.canvasObjects"
      :rail-actions="referenceSampleDesignerConfig.railActions"
      :left-status-segments="referenceSampleDesignerConfig.leftStatusSegments"
      :right-status-segments="referenceSampleDesignerConfig.rightStatusSegments"
      :zoom-options="referenceSampleDesignerConfig.zoomOptions"
      :zoom-value="zoomValue"
      @update:search-value="searchValue = $event"
      @update:active-report-id="activeReportId = $event"
      @report-select="handleReportSelect"
      @manager-action-click="handleManagerActionClick"
      @update:active-document-tab-id="activeDocumentTabId = $event"
      @toolbar-action-click="handleWorkspaceAction"
      @widget-click="handleWorkspaceAction"
      @canvas-object-click="handleWorkspaceAction"
      @rail-action-click="handleWorkspaceAction"
      @status-click="handleWorkspaceAction"
      @update:zoom-value="zoomValue = $event"
    />
    <PlaceholderTemplate
      v-else
      :title="activePlaceholder.title"
      :subtitle="activePlaceholder.subtitle"
      :description="activePlaceholder.description"
      :status-label="activePlaceholder.statusLabel"
      :hints="activePlaceholder.hints"
      :primary-action="activePlaceholder.primaryAction"
      :secondary-action="activePlaceholder.secondaryAction"
      @action-click="handlePlaceholderAction"
    />

    <div class="ntk-reference-samples-feedback">
      <SampleActionStatus
        title="Workspace action"
        :message="workspaceActionMessage"
        tone="success"
      />
    </div>
  </ReferenceWorkspaceShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  ReferenceWorkspaceComposer,
  ReferenceWorkspaceShell,
  referenceSampleDesignerConfig,
  referenceSampleDocumentTabs,
  referenceSampleManagerConfig,
  referenceSampleMenuItems,
  referenceSampleNotifications,
  referenceSampleReportGroups,
  useReferenceWorkspaceHost,
} from '../src/templates/features/reference-system'
import PlaceholderTemplate from '../src/templates/pages/system/PlaceholderTemplate.vue'
import type { TemplatePageAction, TemplatePageHint } from '../src/templates/pages/page-template.types'
import SampleActionStatus from './shared/SampleActionStatus.vue'

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}

const workspaceActionMessage = ref('The reference workspace is ready for interaction.')

function onHelpClick(): void {
  navigateTo('/?templates=1&family=approved-reference')
}

function onBackHomeClick(): void {
  navigateTo('/')
}

const {
  activeDocumentTabId,
  activeMenuId,
  activeReportId,
  onManagerActionClick,
  onMenuItemClick,
  onPresetChange,
  presetOptions,
  searchValue,
  selectedPreset,
  selectedPresetId,
  whitelabelStyleVars,
  zoomValue,
} = useReferenceWorkspaceHost({
  initialMenuId: 'catalog',
  initialReportId: referenceSampleReportGroups[0]?.items[0]?.id ?? '',
  initialDocumentTabId: referenceSampleDocumentTabs[0]?.id ?? 'layout',
  initialZoomValue: referenceSampleDesignerConfig.zoomOptions[2] ?? 100,
  onBackHome: onBackHomeClick,
  onHelp: onHelpClick,
})

const activeSection = computed(() =>
  referenceSampleMenuItems.find(item => item.id === activeMenuId.value) ?? null
)

interface PlaceholderState {
  title: string
  subtitle: string
  description: string
  statusLabel: string
  hints: TemplatePageHint[]
  primaryAction: TemplatePageAction
  secondaryAction: TemplatePageAction
}

const activePlaceholder = computed<PlaceholderState>(() => {
  const sectionText = activeSection.value?.text ?? 'Section'
  const sectionId = activeMenuId.value

  const bySection: Record<string, PlaceholderState> = {
    scheduled: {
      title: 'Scheduled reports',
      subtitle: 'Delivery and automation surfaces stay part of the same whitelabel workspace.',
      description: 'Use the live template showcase while the dedicated scheduled-report view is being expanded.',
      statusLabel: 'Connected',
      hints: [
        { id: 'scheduled-hint-1', text: 'The navigation state is already live.', icon: 'check_circle' },
        { id: 'scheduled-hint-2', text: 'Open the workspace board to inspect list and approval patterns.', icon: 'view_kanban' },
      ],
      primaryAction: { id: 'open-workspace-template', label: 'Open workspace template', icon: 'open_in_new' },
      secondaryAction: { id: 'open-home', label: 'Back to samples home', icon: 'home', outline: true, unelevated: false },
    },
    templates: {
      title: 'Reusable report templates',
      subtitle: 'Template packs are available from the visual families showcase.',
      description: 'Jump straight to the template catalog filtered for the family that best matches report-builder scenarios.',
      statusLabel: 'Ready',
      hints: [
        { id: 'templates-hint-1', text: 'Visual families are config-driven, not duplicated implementations.', icon: 'dashboard_customize' },
        { id: 'templates-hint-2', text: 'Deep links open the exact family or example you need.', icon: 'link' },
      ],
      primaryAction: { id: 'open-template-families', label: 'Open template families', icon: 'widgets' },
      secondaryAction: { id: 'open-home', label: 'Back to samples home', icon: 'home', outline: true, unelevated: false },
    },
    assets: {
      title: 'Shared assets',
      subtitle: 'Fonts, images and reusable chrome stay aligned to the builder family.',
      description: 'Use the builder-oriented pack to inspect the denser asset and editor composition.',
      statusLabel: 'Ready',
      hints: [
        { id: 'assets-hint-1', text: 'Urban Mono showcases the denser builder language.', icon: 'science' },
        { id: 'assets-hint-2', text: 'The same tokens feed editor, workspace and shell surfaces.', icon: 'palette' },
      ],
      primaryAction: { id: 'open-assets-family', label: 'Open builder family', icon: 'science' },
      secondaryAction: { id: 'open-home', label: 'Back to samples home', icon: 'home', outline: true, unelevated: false },
    },
    presets: {
      title: 'Whitelabel presets',
      subtitle: 'Parameterization is already live in the catalog and the family showcase.',
      description: 'Return to the initial page to compare packs and jump into the runtime that demonstrates the selected preset.',
      statusLabel: 'Active',
      hints: [
        { id: 'presets-hint-1', text: 'Same components, different tokens.', icon: 'tune' },
        { id: 'presets-hint-2', text: 'Presets affect shell, typography, radius and surfaces.', icon: 'palette' },
      ],
      primaryAction: { id: 'open-home', label: 'Open samples home', icon: 'home' },
      secondaryAction: { id: 'open-template-families', label: 'Open template families', icon: 'widgets', outline: true, unelevated: false },
    },
    permissions: {
      title: 'Permissions and access',
      subtitle: 'Access-control screens will reuse the admin-oriented family and profile/CRUD templates.',
      description: 'Open the executive pack to inspect the same shared surfaces with a higher-contrast control language.',
      statusLabel: 'Connected',
      hints: [
        { id: 'permissions-hint-1', text: 'CRUD and profile surfaces are already available in the showcase.', icon: 'badge' },
        { id: 'permissions-hint-2', text: 'Admin interactions should remain deterministic in the demos.', icon: 'verified_user' },
      ],
      primaryAction: { id: 'open-permissions-family', label: 'Open registry family', icon: 'admin_panel_settings' },
      secondaryAction: { id: 'open-home', label: 'Back to samples home', icon: 'home', outline: true, unelevated: false },
    },
  }

  return bySection[sectionId] ?? {
    title: sectionText,
    subtitle: 'This section is connected to the sample runtime.',
    description: 'Use the primary action to jump into the most relevant live example.',
    statusLabel: 'Ready',
    hints: [
      { id: 'generic-hint-1', text: 'Navigation is active and routed through the sample host.', icon: 'check_circle' },
    ],
    primaryAction: { id: 'open-home', label: 'Back to samples home', icon: 'home' },
    secondaryAction: { id: 'open-template-families', label: 'Open template families', icon: 'widgets', outline: true, unelevated: false },
  }
})

function handleWorkspaceAction(actionId: string): void {
  workspaceActionMessage.value = `Triggered workspace action: ${actionId}.`
}

function handleManagerActionClick(actionId: string): void {
  onManagerActionClick(actionId)
  workspaceActionMessage.value = `Manager action executed: ${actionId}.`
}

function handleReportSelect(reportId: string): void {
  activeReportId.value = reportId
  workspaceActionMessage.value = `Selected report: ${reportId}.`
}

function handlePlaceholderAction(actionId: string): void {
  workspaceActionMessage.value = `Section action executed: ${actionId}.`

  if (actionId === 'open-home') {
    navigateTo('/')
    return
  }

  if (actionId === 'open-template-families') {
    navigateTo('/?templates=1')
    return
  }

  if (actionId === 'open-workspace-template') {
    navigateTo('/?templates=1&example=dashboard-workspace')
    return
  }

  if (actionId === 'open-assets-family') {
    navigateTo('/?templates=1&family=builder-studio')
    return
  }

  if (actionId === 'open-permissions-family') {
    navigateTo('/?templates=1&family=registry-control')
  }
}
</script>

<style scoped lang="scss">
.ntk-reference-samples-feedback {
  padding: 0 24px 24px;
}
</style>
