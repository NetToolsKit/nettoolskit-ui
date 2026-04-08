<template>
  <MainLayoutTemplate
    :app-name="settings.branding.appName || 'NetToolsKit'"
    :logo-src="settings.branding.brandLogo || ''"
    :logo-alt="settings.branding.brandLogoAlt || settings.branding.appName || 'NetToolsKit'"
    :user-name="cmsShellUserName"
    :user-initials="cmsShellUserInitials"
    :menu-items="cmsTemplateMenuItems"
    :show-breadcrumb="false"
    :side-menu-variant="'reference'"
    :active-item-id="activeMenuId"
    storage-key-prefix="ntk-cms-template-layout"
    page-container-class="cms-shell-page-container"
    @menu-item-click="onCmsTemplateMenuItemClick"
    @account-click="onCmsHeaderAccountClick"
    @logout-click="onCmsHeaderLogoutClick"
  >
    <template #brand>
      <div class="ntk-template-main-layout__brand">
        <img
          v-if="settings.branding.brandLogo"
          :src="settings.branding.brandLogo"
          :alt="settings.branding.brandLogoAlt || settings.branding.appName || 'NetToolsKit'"
          class="ntk-template-main-layout__logo"
        >
        <div class="cms-template-header-brand">
          <span class="ntk-template-main-layout__title">{{ settings.branding.appName || 'NetToolsKit' }}</span>
          <small class="cms-template-header-brand__subtitle">{{ settings.branding.appSubtitle || 'NTK CMS' }}</small>
        </div>
      </div>
    </template>

    <template #breadcrumb>
      <div class="cms-template-header-trail">
        <span class="cms-template-header-trail__section">{{ settings.branding.appName || 'NetToolsKit' }}</span>
        <q-icon name="chevron_right" size="16px" />
        <span class="cms-template-header-trail__current">{{ activeShellItem.label }}</span>
      </div>
    </template>

    <template #header-actions="slotProps">
      <div class="cms-template-header-actions">
        <q-input
          v-if="settings.layout.showSearch"
          v-model="searchQuery"
          dense
          outlined
          standout="bg-white text-dark"
          :placeholder="shellSnapshot.shellConfig.searchPlaceholder || tr('Search module', 'Buscar modulo')"
          :aria-label="shellSnapshot.shellConfig.searchPlaceholder || tr('Search module', 'Buscar modulo')"
          class="cms-template-header-actions__search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          v-for="action in cmsShellHeaderActions"
          :key="`cms-shell-header-${action.id}`"
          :icon="action.icon"
          :label="action.showLabel ? action.label : undefined"
          :flat="action.flat ?? true"
          :dense="action.dense ?? true"
          :round="action.round ?? !action.showLabel"
          :unelevated="action.unelevated"
          :outline="action.outline"
          :no-caps="action.noCaps ?? true"
          :href="action.href"
          :target="action.external ? '_blank' : undefined"
          :rel="action.external ? 'noreferrer' : undefined"
          :aria-label="action.tooltip || action.label || action.id"
          class="cms-template-header-actions__button"
          @click="handleCmsShellHeaderAction(action)"
        >
          <q-badge
            v-if="action.badge !== undefined && action.badge !== null && action.badge !== ''"
            floating
            rounded
            :color="action.badgeColor || 'negative'"
            :text-color="action.badgeTextColor || 'white'"
          >
            {{ action.badge }}
          </q-badge>
          <q-tooltip v-if="action.tooltip">{{ action.tooltip }}</q-tooltip>
        </q-btn>

        <UserMenuTemplate
          :model-value="slotProps.layoutControls.horizontalMode"
          :show-labels-in-mini="slotProps.layoutControls.showLabelsInMini"
          :side-menu-variant="slotProps.layoutControls.sideMenuVariant"
          :app-name="settings.branding.appName || 'NetToolsKit'"
          :profile-name="cmsShellUserName"
          :profile-initials="cmsShellUserInitials"
          :sign-out-label="tr('Sign out', 'Sair')"
          :account-label="tr('View account', 'Ver conta')"
          :preferences-label="tr('Preferences', 'Preferencias')"
          :horizontal-menu-label="tr('Horizontal menu', 'Menu horizontal')"
          :horizontal-menu-caption="tr('Toggle between side and top navigation', 'Alterna entre navegacao lateral e superior')"
          :mini-labels-label="tr('Labels in mini menu', 'Labels no mini menu')"
          :mini-labels-caption="tr('Show labels below icons in compact mode', 'Exibe texto abaixo dos icones no modo compacto')"
          :show-side-menu-style-toggle="false"
          @update:model-value="slotProps.layoutControls.setHorizontalMode"
          @update:show-labels-in-mini="slotProps.layoutControls.setShowLabelsInMini"
          @account-click="onCmsHeaderAccountClick"
          @logout-click="onCmsHeaderLogoutClick"
        />
      </div>
    </template>

    <div class="cms-shell-page" :class="cmsViewportClasses" :style="cmsStyleVars">
      <div class="cms-shell-page__workspace">
        <div class="cms-shell-page__hero">
          <h1>{{ activeShellItem.label }}</h1>
          <p>{{ activeShellItem.description || settings.content.moduleFallbackDescription }}</p>
        </div>

        <CmsSettingsModuleTemplate
          v-if="isSettingsModule"
          v-bind="cmsSettingsModuleTemplateProps"
          @update:cms-settings-workspace-tab-value="onSettingsWorkspaceTabChange"
          @update:active-settings-tab="activeSettingsTab = $event as CmsSettingsWorkbenchTabId"
          @update:selected-domain-transfer="selectedDomainTransfer = $event as CmsDomainPayloadDomain"
          @update:show-advanced-theme-fields="showAdvancedThemeFields = $event"
          @update:selected-authored-content-model-id="selectedAuthoredContentModelId = $event as CmsContentModelId | ''"
          @update:authored-content-model-name-draft="authoredContentModelNameDraft = $event"
          @update:authored-content-model-description-draft="authoredContentModelDescriptionDraft = $event"
          @update:authored-content-model-default-page-title-draft="authoredContentModelDefaultPageTitleDraft = $event"
          @update:authored-content-model-default-page-description-draft="authoredContentModelDefaultPageDescriptionDraft = $event"
          @update:authored-content-model-default-page-path-prefix-draft="authoredContentModelDefaultPagePathPrefixDraft = $event"
          @update:authored-content-model-migration-notes-draft="authoredContentModelMigrationNotesDraft = $event"
          @update:selected-authored-content-model-field-preset-id="selectedAuthoredContentModelFieldPresetId = $event as CmsAuthoredContentModelFieldPresetId | ''"
          @update:show-archived-field-presets="showArchivedFieldPresets = $event"
          @update:authored-content-model-allowed-section-selections="authoredContentModelAllowedSectionSelections = $event"
          @tenant-import-file-change="onTenantImportFileChange"
          @domain-import-file-change="onDomainImportFileChange"
          @schema-import-file-change="onSchemaImportFileChange"
        />
        <CmsPagesModuleTemplate
          v-else-if="isPagesModule"
          v-bind="cmsPagesModuleTemplateProps"
          @update:cms-pages-workspace-tab-value="onPagesWorkspaceTabChange"
          @update:selected-page-template-id="selectedPageTemplateId = $event"
          @update:selected-builder-command-id="selectedBuilderCommandId = $event"
          @update:show-archived-reusable-sections="showArchivedReusableSections = $event"
          @update:cms-preview-source="cmsPreviewSource = $event"
          @update:cms-preview-locale="cmsPreviewLocale = $event"
          @update:cms-preview-viewport="cmsPreviewViewport = $event"
        />
        <CmsBlocksModuleTemplate
          v-else-if="isBlocksModule"
          v-bind="cmsBlocksModuleTemplateProps"
          @update:cms-blocks-workspace-tab-value="onBlocksWorkspaceTabChange"
          @update:selected-builder-command-id="selectedBuilderCommandId = $event"
          @update:active-blocks-page-id="activeBlocksPageId = $event"
          @update:active-blocks-section-id="activeBlocksSectionId = $event"
          @update:active-blocks-block-id="activeBlocksBlockId = $event"
          @update:selected-palette-block-type="selectedPaletteBlockType = $event"
          @update:selected-palette-block-preset-id="selectedPaletteBlockPresetId = $event as CmsBlockPresetId"
          @update:reusable-block-name-draft="reusableBlockNameDraft = $event"
          @update:reusable-block-description-draft="reusableBlockDescriptionDraft = $event"
          @update:selected-reusable-block-id="selectedReusableBlockId = $event"
          @update:show-archived-reusable-blocks="showArchivedReusableBlocks = $event"
          @update:authored-block-preset-name-draft="authoredBlockPresetNameDraft = $event"
          @update:authored-block-preset-description-draft="authoredBlockPresetDescriptionDraft = $event"
          @update:selected-authored-block-preset-id="selectedAuthoredBlockPresetId = $event as CmsBlockPresetId"
          @update:authored-preset-starter-section-selections="authoredPresetStarterSectionSelections = $event"
          @update:show-archived-authored-block-presets="showArchivedAuthoredBlockPresets = $event"
          @update:active-blocks-props-draft="activeBlocksPropsDraft = $event"
          @update:cms-preview-source="cmsPreviewSource = $event"
          @update:cms-preview-locale="cmsPreviewLocale = $event"
          @update:cms-preview-viewport="cmsPreviewViewport = $event"
        />
        <CmsMediaModuleSurface
          v-else-if="isMediaModule"
          :media-settings-title="cmsUiText.mediaSettingsTitle"
          :asset-count="settings.mediaAssets.length"
          :selected-media-asset-id="selectedMediaAssetId"
          :media-asset-draft="mediaAssetDraft"
          :media-asset-options="cmsMediaAssetOptions"
          :media-asset-kind-options="cmsMediaAssetKindOptions"
          :media-replacement-options="cmsMediaReplacementOptions"
          :media-diagnostics="cmsMediaDiagnostics"
          :selected-media-asset-diagnostics="selectedMediaAssetDiagnostics"
          :branding-media-bindings="cmsBrandingMediaBindings"
          :media-assets="cmsMediaAssets"
          :status-chip-style="statusChipStyle"
          :preview-chip-style="previewChipStyle"
          :banner-style="bannerStyle"
          :primary-action-style="primaryActionStyle"
          :danger-action-style="dangerActionStyle"
          :t="tr"
          :to-diagnostics-list-items="toCmsDiagnosticsListItems"
          :get-cms-diagnostic-style="getCmsDiagnosticStyle"
          :get-cms-media-kind-label="getCmsMediaKindLabel"
          :is-preview-image-asset="isPreviewImageAsset"
          :get-cms-media-usage-count="getCmsMediaUsageCount"
          :get-cms-media-usage-summary-label="getCmsMediaUsageSummaryLabel"
          :get-cms-media-diagnostics-for-asset="getCmsMediaDiagnosticsForAsset"
          @update:selected-media-asset-id="selectedMediaAssetId = $event"
          @update:media-asset-draft="mediaAssetDraft = $event"
          @create-new-asset="createNewMediaAssetDraft"
          @save-asset="saveMediaAssetDraft"
          @remove-selected-asset="removeSelectedMediaAsset"
          @replace-selected-asset-references="replaceSelectedMediaAssetReferences"
          @apply-selected-asset-to-branding="applySelectedMediaAssetToBranding"
        />

        <CmsReleasesModuleSurface
          v-else-if="isReleasesModule"
          :release-orchestration-title="cmsUiText.releaseOrchestrationTitle"
          :release-timeline-title="cmsUiText.releaseTimelineTitle"
          :release-calendar-title="cmsUiText.releaseCalendarTitle"
          :no-releases-yet-message="cmsUiText.noReleasesYetMessage"
          :no-scheduled-releases-message="cmsUiText.noScheduledReleasesMessage"
          :no-calendar-conflicts-message="cmsUiText.noCalendarConflictsMessage"
          :release-count-label="releaseCountLabel"
          :active-release-environment="activeReleaseEnvironment"
          :release-environment-options="releaseEnvironmentOptions"
          :selected-release-id="selectedReleaseId"
          :release-options="releaseOptions"
          :release-schedule-at="releaseScheduleAt"
          :release-rollback-target-id="releaseRollbackTargetId"
          :rollback-target-options="rollbackTargetOptions"
          :release-promotion-target-environment="releasePromotionTargetEnvironment"
          :promotion-target-environment-options="promotionTargetEnvironmentOptions"
          :has-scheduled-releases="releaseEntriesAll.some(item => item.status === 'scheduled')"
          :can-export-review-package="Boolean(cmsPreviewDraftPublishedDiff)"
          :selected-release="selectedRelease"
          :selected-release-review-hub="selectedReleaseReviewHub"
          :selected-release-review-hub-card-items="selectedReleaseReviewHubCardItems"
          :release-review-package-history-entries="releaseReviewPackageHistoryEntries"
          :cms-governance-hub-summary="cmsGovernanceHubSummary"
          :cms-governance-hub-card-items="cmsGovernanceHubCardItems"
          :cms-governance-revision-panel-items="cmsGovernanceRevisionPanelItems"
          :cms-governance-audit-panel-items="cmsGovernanceAuditPanelItems"
          :cms-governance-role-policy-panel-items="cmsGovernanceRolePolicyPanelItems"
          :selected-release-acknowledgement-summary="selectedReleaseAcknowledgementSummary"
          :release-acknowledgement-decision="releaseAcknowledgementDecision"
          :release-acknowledgement-decision-options="releaseAcknowledgementDecisionOptions"
          :release-acknowledgement-note="releaseAcknowledgementNote"
          :selected-release-acknowledgements="selectedReleaseAcknowledgements"
          :selected-release-candidate-checklist="selectedReleaseCandidateChecklist"
          :selected-release-gate-issues="selectedReleaseGateIssues"
          :release-timeline-entries="releaseTimelineEntries"
          :scheduled-release-calendar-entries="scheduledReleaseCalendarEntries"
          :release-calendar-conflicts="releaseCalendarConflicts"
          :status-chip-style="statusChipStyle"
          :banner-style="bannerStyle"
          :primary-action-style="primaryActionStyle"
          :danger-action-style="dangerActionStyle"
          :t="tr"
          :get-release-checklist-status-style="getReleaseChecklistStatusStyle"
          :get-release-checklist-status-label="getReleaseChecklistStatusLabel"
          :get-review-package-history-description="getReviewPackageHistoryDescription"
          :get-review-package-history-status="getReviewPackageHistoryStatus"
          :get-release-acknowledgement-decision-style="getReleaseAcknowledgementDecisionStyle"
          :get-release-acknowledgement-decision-label="getReleaseAcknowledgementDecisionLabel"
          :get-release-acknowledgement-description="getReleaseAcknowledgementDescription"
          :get-release-checklist-item-label="getReleaseChecklistItemLabel"
          :get-release-checklist-item-description="getReleaseChecklistItemDescription"
          :get-release-checklist-drilldown-actions="getReleaseChecklistDrilldownActions"
          :has-release-checklist-validation-shortcut="hasReleaseChecklistValidationShortcut"
          :get-release-checklist-drilldown-label="getReleaseChecklistDrilldownLabel"
          :get-release-status-style="getReleaseStatusStyle"
          :format-release-timestamp="formatReleaseTimestamp"
          @update:active-release-environment="activeReleaseEnvironment = $event"
          @update:selected-release-id="selectedReleaseId = $event"
          @update:release-schedule-at="releaseScheduleAt = $event"
          @update:release-rollback-target-id="releaseRollbackTargetId = $event"
          @update:release-promotion-target-environment="releasePromotionTargetEnvironment = $event"
          @create-draft="createReleaseDraftFromCurrentSettings"
          @validate-selected="validateSelectedReleaseEntry"
          @schedule-selected="scheduleSelectedReleaseEntry"
          @publish-selected="publishSelectedReleaseEntry"
          @run-scheduled="processDueScheduledReleaseEntries"
          @promote-selected="promoteSelectedReleaseEntry"
          @rollback-selected="rollbackSelectedReleaseEntry"
          @export-review-package="exportCmsDraftComparisonPackage"
          @update:release-acknowledgement-decision="releaseAcknowledgementDecision = $event"
          @update:release-acknowledgement-note="releaseAcknowledgementNote = $event"
          @add-acknowledgement="addSelectedReleaseAcknowledgement"
          @run-checklist-validation-shortcut="runReleaseChecklistValidationShortcut"
          @run-checklist-drilldown="runReleaseChecklistDrilldown"
        />

        <div v-else class="cms-shell-page__grid">
          <CmsShellCard
            :title="settings.content.statusTitle"
          >
            <template #header-actions>
              <q-chip dense square icon="check_circle" :style="statusChipStyle">{{ settings.content.statusChipLabel }}</q-chip>
            </template>
              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="palette" :style="{ color: accentColor }" /></q-item-section>
                  <q-item-section>{{ settings.content.statusThemeText }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="image" :style="{ color: accentColor }" /></q-item-section>
                  <q-item-section>{{ settings.content.statusBrandingText }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="menu" :style="{ color: accentColor }" /></q-item-section>
                  <q-item-section>{{ settings.content.statusMenuText }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="toolbar" :style="{ color: accentColor }" /></q-item-section>
                  <q-item-section>{{ settings.content.statusTopbarText }}</q-item-section>
                </q-item>
              </q-list>
          </CmsShellCard>

          <CmsShellCard
            :title="settings.content.howToTitle"
          >
              <p class="q-mb-md">
                {{ settings.content.howToBody }}
              </p>
              <q-banner rounded class="cms-banner" :style="bannerStyle">
                {{ settings.content.howToNextStep }}
              </q-banner>
          </CmsShellCard>
        </div>
      </div>
    </div>
  </MainLayoutTemplate>
  <CmsEntityUsageDrawer
    v-model="isCmsUsageDrawerOpen"
    :header-label="tr('Impact analysis', 'Analise de impacto')"
    :details-label="tr('Usage details', 'Detalhes de uso')"
    :title="cmsUsageDrawerTarget?.title || ''"
    :subtitle="cmsUsageDrawerTarget?.subtitle || ''"
    :reference-count="cmsUsageDrawerSummary?.totalReferences ?? 0"
    :refs-label="tr('refs', 'refs')"
    :summary-label="cmsUsageDrawerSummaryLabel"
    :references="cmsUsageDrawerReferenceItems"
    :empty-title="tr('No usage references found.', 'Nenhuma referencia de uso encontrada.')"
    :empty-description="tr('This entity can be changed or deleted safely.', 'Esta entidade pode ser alterada ou removida com seguranca.')"
    :status-chip-style="statusChipStyle"
  />
</template>

<script setup lang="ts">
/**
 * Landing page/Cms App module.
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import { useQuasar } from 'quasar'
import type { AppShellAction } from '../src/components/layout/app-shell.types'
import { CmsRenderer } from '../src/modules/cms/renderer'
import MainLayoutTemplate from '../src/templates/layouts/MainLayoutTemplate.vue'
import UserMenuTemplate from '../src/templates/navigation/UserMenuTemplate.vue'
import type { TemplateMenuChildItem, TemplateMenuItem } from '../src/templates/navigation/menu-template.types'
import {
  createDefaultWhiteLabelSettings,
  createNewMenuItem,
  mapWhiteLabelToShellSnapshot,
} from '../src/modules/cms/white-label/config'
import {
  applyCmsLocalePreset,
  CMS_LOCALE_OPTIONS,
  getCmsTenantProfilePromptLabel,
  resolveCmsLocale,
} from '../src/modules/cms/white-label/i18n'
import {
  applyCmsFavicon,
  normalizeCmsWhiteLabelSettings,
  resetCmsWhiteLabelSettings,
  saveCmsWhiteLabelSettings,
} from '../src/modules/cms/white-label/storage'
import {
  loadCmsTenantProfilesState,
  saveCmsTenantProfilesState,
} from '../src/modules/cms/white-label/tenant-profiles.storage'
import {
  type CmsDomainPayloadDomain,
} from '../src/modules/cms/white-label/domain-payload'
import {
  applyCmsSchemaPackageSnapshot,
  createCmsSchemaPackageSnapshot,
} from '../src/modules/cms/white-label/schema-payload'
import {
  clearCmsDraftRecoveryEntry,
  getCmsDraftRecoveryEntry,
  loadCmsDraftRecoveryState,
  resolveCmsDraftRecoveryCandidate,
  saveCmsDraftRecoverySnapshot,
  type CmsDraftRecoveryReason,
  type CmsDraftRecoveryState,
} from '../src/modules/cms/white-label/draft-recovery'
import {
  applyWhiteLabelWorkflowAction,
  canApplyWhiteLabelWorkflowAction,
} from '../src/modules/cms/white-label/workflow'
import { applySemanticColors, semanticColors } from '../src/config/colors/semantic.config'
import {
  buildCmsThemePresets,
  type CmsThemePreset,
  type CmsThemePresetId,
} from '../src/modules/cms/white-label/theme-presets'
import {
  createCmsBuilderState,
  insertCmsBuilderBlock,
  listCmsBuilderPalette,
  moveCmsBuilderBlock,
  moveCmsBuilderBlockToIndex,
  moveCmsBuilderSectionToIndex,
  removeCmsBuilderBlock,
  selectCmsBuilderNode,
  type CmsBuilderSelection,
  type CmsBuilderState,
} from '../src/modules/cms/white-label/builder.state'
import {
  createCmsAuthoredContentModel,
  createCmsPageCustomFieldsFromContentModel,
  createCmsPageSectionsFromContentModel,
  createCmsPageSectionFromPreset,
  coerceCmsContentModelFieldValue,
  filterCmsVisibleContentModelFields,
  getCmsContentModelDefaultPageDescription,
  getCmsContentModelDefaultPagePathPrefix,
  getCmsContentModelDefaultPageTitle,
  getCmsContentModelDescription,
  getCmsContentModelFieldDefinitions,
  normalizeCmsContentModelFieldSettingsList,
  getCmsContentModelLastSchemaChangeAt,
  getCmsContentModelLabel,
  getCmsContentModelMaxSections,
  getCmsContentModelMigrationNotes,
  getCmsContentModelSectionPresetLimitMap,
  getCmsContentModelSchemaVersion,
  getCmsSectionPresetAllowedBlockTypes,
  getCmsSectionPresetBlockLimits,
  getCmsSectionPresetDefinition,
  getCmsSectionPresetFieldDefinitions,
  getDefaultCmsSectionPresetId,
  isCmsBlockPresetAllowedForSectionPreset,
  isCmsBlockTypeAllowedForSectionPreset,
  isCmsSectionPresetAllowedForContentModel,
  listAllCmsSectionPresetOptions,
  listCmsContentModelOptions,
  listCmsSectionPresetOptions,
  listCmsSectionStarterPresetOptions,
  normalizeCmsPageCustomFieldsForContentModel,
  normalizeCmsSectionCustomFieldsForPreset,
  updateCmsAuthoredContentModel,
  resolveCmsContentModelId,
  resolveDefaultCmsBlockTypeForSection,
  resolveCmsSectionPresetId,
  type CmsSectionPresetOption,
  type CmsSectionStarterPresetOption,
} from '../src/modules/cms/white-label/content-models'
import {
  createCmsAuthoredBlockPresetFromBlock,
  createCmsPageBlockFromPreset,
  getCmsBlockPresetLabel,
  getDefaultCmsBlockPresetIdForSectionPreset,
  getCmsBlockPresetDescription,
  isCmsBlockPresetAllowedForType,
  listCmsBlockPresetOptions,
  resolveCmsBlockPresetId,
  updateCmsAuthoredBlockPreset,
  type CmsBlockPresetOption,
} from '../src/modules/cms/white-label/block-presets'
import {
  createCmsAuthoredContentModelFieldPreset,
  getCmsContentModelFieldPresetDefinition,
  listCmsContentModelFieldPresetOptions,
  type CmsContentModelFieldPresetOption,
  type CmsResolvedContentModelFieldPresetDefinition,
} from '../src/modules/cms/white-label/schema-field-presets'
import { listCmsSchemaReferenceOptions } from '../src/modules/cms/white-label/reference-library'
import {
  applyCmsLocalizedPropsUpdate,
  applyCmsLocalizedTextUpdate,
  resolveCmsLocalizedProps,
  resolveCmsLocalizedText,
} from '../src/modules/cms/white-label/localized-content'
import {
  validateCmsContentPages,
  type CmsContentValidationIssue,
} from '../src/modules/cms/white-label/content-validation'
import {
  cloneCmsReusableBlockIntoPageBlock,
  createCmsReusableBlockFromBlock,
  createCmsReusableBlockVariantFromReusable,
  detachCmsPageBlockFromReusable,
  resolveCmsReusableBlockReference,
} from '../src/modules/cms/white-label/reusable-blocks'
import {
  cloneCmsReusableSectionIntoPageSection,
  createCmsReusableSectionFromSection,
  createCmsReusableSectionVariantFromReusable,
  detachCmsPageSectionFromReusable,
  resolveCmsReusableSectionReference,
} from '../src/modules/cms/white-label/reusable-sections'
import {
  collectCmsBrandingMediaBindingReferences,
  collectCmsMediaBindingReferences,
  collectCmsMediaDiagnostics,
  collectCmsMediaUsageSummary,
  createCmsMediaAsset,
  replaceCmsMediaAssetReferences,
  type CmsMediaDiagnostic,
} from '../src/modules/cms/white-label/media-library'
import {
  createCmsMediaPickerOptions,
  type CmsMediaPickerOption,
} from '../src/modules/cms/white-label/media-picker'
import {
  applyCmsAssetRepositorySnapshot,
  applyCmsContentRepositorySnapshot,
  applyCmsReleaseRepositorySnapshot,
  createCmsAssetRepositorySnapshot,
  createCmsContentRepositorySnapshot,
  createCmsReleaseRepositorySnapshot,
  type CmsAssetRepositorySnapshot,
  type CmsContentRepositorySnapshot,
  type CmsReleaseRepositorySnapshot,
} from '../src/modules/cms/white-label/providers'
import {
  collectCmsEntityUsageIndex,
  getCmsEntityUsageSummary,
  type CmsEntityUsageReference,
  type CmsEntityUsageTargetKind,
} from '../src/modules/cms/white-label/usage-explorer'
import {
  archiveCmsEntity,
  isCmsArchivedEntity,
  unarchiveCmsEntity,
} from '../src/modules/cms/white-label/archive-state'
import {
  deprecateCmsEntity,
  isCmsDeprecatedEntity,
  undeprecateCmsEntity,
  updateCmsDeprecatedEntityNote,
  updateCmsDeprecatedEntityReplacement,
} from '../src/modules/cms/white-label/deprecation-state'
import {
  applyCmsDeprecatedEntityReplacement,
  previewCmsDeprecatedEntityReplacement,
  type CmsReplacementAssistantSummary,
  type CmsReplacementAssistantTargetKind,
} from '../src/modules/cms/white-label/replacement-assistant'
import {
  createCmsPageFromTemplate,
  listCmsPageQuickStartOptions,
  listCmsPageTemplateOptions,
  resolveCmsPageTemplateId,
  type CmsPageTemplateId,
} from '../src/modules/cms/white-label/page-templates'
import {
  createCmsStarterKitBundle,
  listCmsStarterKitOptions,
  type CmsStarterKitId,
} from '../src/modules/cms/white-label/starter-kits'
import { resolveCmsPreviewSnapshot } from '../src/modules/cms/white-label/preview'
import {
  resolveCmsPreviewDraftPublishedDiff,
  type CmsPreviewBlockDiffSummary,
  type CmsPreviewDiffStatus,
  type CmsPreviewPageDiffSummary,
  type CmsPreviewSectionDiffSummary,
} from '../src/modules/cms/white-label/preview-diff'
import {
  applyCmsPageSchemaMigration,
  createCmsPageSchemaMigrationReport,
  createCmsSchemaMigrationBatchReport,
  type CmsPageSchemaMigrationChange,
  type CmsPageSchemaMigrationReport,
  type CmsSchemaMigrationStatus,
} from '../src/modules/cms/white-label/schema-migration'
import {
  resolveCmsLocaleCoverageMatrix,
  type CmsLocaleCoverageCategory,
  type CmsLocaleCoverageCategorySummary,
  type CmsLocaleCoverageStatus,
  type CmsLocaleCoverageSummary,
} from '../src/modules/cms/white-label/locale-coverage'
import {
  resolveCmsReleaseChecklistDrilldownActions,
  type CmsReleaseChecklistDrilldownAction,
} from '../src/modules/cms/white-label/release-drilldown'
import {
  createCmsReleaseReviewHubSummary,
  type CmsReleaseReviewHubCard,
} from '../src/modules/cms/white-label/review-hub'
import {
  createCmsGovernanceHubSummary,
  type CmsGovernanceHubCard,
} from '../src/modules/cms/white-label/governance-hub'
import { createCmsDraftComparisonExportPayload } from '../src/modules/cms/white-label/review-package'
import {
  appendCmsReviewPackageHistory,
  createCmsReviewPackageHistoryEntry,
} from '../src/modules/cms/white-label/review-package-history'
import {
  appendCmsReleaseReviewAcknowledgement,
  createCmsReleaseReviewAcknowledgementEntry,
  listCmsReleaseReviewAcknowledgements,
  summarizeCmsReleaseReviewAcknowledgements,
  type CmsReleaseReviewAcknowledgementSummary,
} from '../src/modules/cms/white-label/review-acknowledgements'
import {
  createCmsSnapshotHistoryState,
  recordCmsSnapshot,
  redoCmsSnapshot,
  resetCmsSnapshotHistoryState,
  undoCmsSnapshot,
} from '../src/modules/cms/white-label/snapshot-history'
import { CMS_SCHEMA_VERSION, type CmsPageSchema } from '../src/modules/cms'
import {
  applyCmsReleaseSnapshot,
  buildCmsReleaseCandidateChecklist,
  detectCmsReleaseCalendarConflicts,
  createCmsReleaseDraft,
  createCmsReleaseSnapshot,
  processDueScheduledCmsReleases,
  promoteCmsReleaseEnvironment,
  publishCmsRelease,
  rollbackCmsRelease,
  scheduleCmsRelease,
  validateCmsReleasePrePublishGate,
  validateCmsRelease,
  type CmsReleaseCandidateChecklistItem,
  type CmsReleaseCandidateChecklistItemId,
  type CmsReleaseCandidateChecklistStatus,
} from '../src/modules/cms/releases/orchestration'
import {
  createLandingRegistry,
  getLandingBlockFieldDefinitions,
  getLandingBlockMediaBindingDefinitions,
} from '../src/modules/cms/presets/landing'
import {
  useCmsUiText,
  applyCmsThemeFieldValue,
  applyCmsThemePreset,
  areCmsSettingsSnapshotsEqual,
  cloneSerializableValue,
  cloneWhiteLabelSettings,
  createCmsAccentSurfaceStyle,
  createCmsAuthoringShellTheme,
  createCmsAuthoringStyleVars,
  createCmsDomainSnapshotDownload,
  createCmsNotificationChipStyles,
  createCmsPrimaryActionStyle,
  createCmsSchemaPackageDownload,
  createCmsTenantProfileDownload,
  createCmsTenantProfileFromName,
  createCmsTextActionStyle,
  downloadCmsJsonPayload,
  getCmsThemeFieldPickerValue,
  importCmsDomainFile,
  importCmsSchemaFile,
  importCmsTenantProfileFile,
  parseBreakpointToken,
  parseMediaDraftFocalPoint,
  parseMediaDraftList,
  removeActiveCmsTenantProfileEntry,
  resolveActiveCmsTenantProfile,
  resolveCmsImportedFile,
  resolveCmsSelectedThemePresetId,
  resolveViewportWidth,
  selectCmsTenantProfile,
  syncCmsTenantProfileSettings,
  toCmsJsonFileName,
  createThemeFields,
  getThemeFieldSections,
  getThemeFieldsByGroup,
  layoutFieldGroupsDefinition,
  type ThemeField,
  type ThemeFieldGroup,
  type ThemeFieldKey,
  type ThemeFieldSection,
  typographyFieldGroupsDefinition,
  colorFieldGroupsDefinition,
} from '../src/modules/cms/white-label/authoring'
import {
  CmsEntityUsageDrawer,
  CmsBlocksModuleTemplate,
  CmsMediaModuleSurface,
  CmsPagesModuleTemplate,
  CmsReleasesModuleSurface,
  CmsSettingsModuleTemplate,
  type CmsEntityUsageDrawerReferenceView,
  type CmsAuthoringMetricItem,
  type CmsAuthoringStatusItem,
  type CmsAuthoringToolbarInfoItem,
  type CmsDiagnosticsListItem,
  type CmsStatusMetricCardItem,
  type CmsPanelListSectionItem,
  CmsShellCard,
  type CmsWorkspaceTabOption,
} from '../src/templates/features/cms'
import {
  type CmsBlockFieldDefinition,
} from '../src/modules/cms/presets/landing'
import type {
  CmsAuthoredContentModelFieldPresetId,
  CmsAuthoredContentModelFieldPresetSettings,
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsBlockPresetId,
  CmsContentModelId,
  CmsContentModelFieldDefinition,
  CmsContentModelFieldLocalizationSettings,
  CmsContentModelFieldSettings,
  CmsContentModelFieldType,
  CmsContentModelFieldVisibilityOperator,
  CmsContentModelFieldVisibilitySource,
  CmsSchemaReferenceKind,
  CmsReleaseEnvironment,
  CmsReleaseReviewAcknowledgementDecision,
  CmsReleaseReviewAcknowledgementEntry,
  CmsReleaseValidationIssue,
  CmsMediaAssetKind,
  CmsMediaAssetFocalPointSettings,
  CmsMediaAssetSettings,
  CmsPageBlockSettings,
  CmsPageSectionSettings,
  CmsPageSettings,
  CmsPreviewSource,
  CmsPreviewViewport,
  CmsReviewPackageHistoryEntry,
  CmsReleaseSettings,
  CmsReleaseStatus,
  CmsLocale,
  CmsLocalizedTextRecord,
  CmsReusableBlockSettings,
  CmsReusableReferenceMode,
  CmsReusableSectionSettings,
  CmsSectionPresetId,
  CmsTenantProfile,
  CmsTenantProfilesState,
  CmsWhiteLabelActor,
  CmsWhiteLabelWorkflowAction,
  CmsWhiteLabelSettings,
} from '../src/modules/cms/white-label/types'

interface QuasarBrandOverrides {
  primary: string
  secondary: string
  accent: string
  positive: string
  warning: string
  negative: string
  info: string
}

interface CmsSectionBlockRecord {
  id: string
  type: string
  presetId?: CmsBlockPresetId
  enabled: boolean
  reusableMode?: CmsReusableReferenceMode
  reusableSourceId?: string
  sectionId: string
  sectionLabel: string
  pageId: string
  pageTitle: string
  pagePath: string
  pageStatus: CmsPageSettings['status']
  pageIndex: number
  sectionIndex: number
  blockIndex: number
}

interface CmsContentModelFieldDraft {
  id: string
  type: CmsContentModelFieldType
  label: string
  labelPtBr: string
  description: string
  descriptionPtBr: string
  placeholder: string
  placeholderPtBr: string
  group: string
  groupPtBr: string
  orderValue: string
  required: boolean
  repeatable: boolean
  minValue: string
  maxValue: string
  defaultValue: string
  nestedFieldsJson: string
  optionsDraft: string
  mediaKinds: CmsMediaAssetKind[]
  referenceKinds: CmsSchemaReferenceKind[]
  visibilityEnabled: boolean
  visibilitySource: CmsContentModelFieldVisibilitySource
  visibilityFieldId: string
  visibilityOperator: CmsContentModelFieldVisibilityOperator
  visibilityValue: string
}

interface CmsPageContentFieldGroup {
  id: string
  label: string
  fields: CmsContentModelFieldDefinition[]
}

interface CmsMediaAssetDraft {
  name: string
  description: string
  kind: CmsMediaAssetKind
  url: string
  alt: string
  focalPointX: string
  focalPointY: string
  replaceTargetAssetId: string
  tags: string
  usage: string
}

interface CmsBrandingMediaBindingPreview {
  id: string
  label: string
  description: string
  url: string
  assetName: string
  assetId?: string
}

interface CmsBlocksSectionRow {
  id: string
  label: string
  enabled: boolean
  reusableMode?: CmsReusableReferenceMode
  reusableSourceId?: string
  sectionIndex: number
  blocks: CmsSectionBlockRecord[]
}

interface CmsFilteredPageRow {
  page: CmsPageSettings
  pageIndex: number
}

interface CmsBuilderCommandOption {
  label: string
  value: string
  description: string
}

interface CmsDraggedPageSection {
  pageId: string
  sectionId: string
}

interface CmsDraggedBlock {
  pageId: string
  sectionId: string
  blockId: string
}

const defaultSettings = createDefaultWhiteLabelSettings()
const defaultTheme = defaultSettings.theme
const defaultMenuId = defaultSettings.items[0]?.id ?? ''
const defaultSettingsModuleId = defaultSettings.items.find(item => item.icon === 'settings')?.id ?? ''
const defaultPagesModuleId = defaultSettings.items.find(item => item.id === 'pages')?.id ?? 'pages'
const defaultBlocksModuleId = defaultSettings.items.find(item => item.id === 'blocks')?.id ?? 'blocks'
const defaultMediaModuleId = defaultSettings.items.find(item => item.id === 'media')?.id ?? 'media'
const defaultReleasesModuleId = defaultSettings.items.find(item => item.id === 'releases')?.id ?? 'releases'
const baseThemePresets: CmsThemePreset[] = buildCmsThemePresets(defaultTheme)
const $q = useQuasar()

/**
 * Resolves one theme token using tenant value first and default fallback next.
 */
function resolveThemeTokenValue(key: ThemeFieldKey): string {
  const explicitValue = String(settings.value.theme[key] ?? '').trim()
  if (explicitValue.length > 0) {
    return explicitValue
  }

  return String(defaultTheme[key] ?? '')
}

/**
 * Resets the media asset draft to a new or existing asset payload.
 */
function setMediaAssetDraft(asset: CmsMediaAssetSettings | null = null): void {
  mediaAssetDraft.value = asset
    ? {
      name: asset.name,
      description: asset.description,
      kind: asset.kind,
      url: asset.url,
      alt: asset.alt,
      focalPointX: asset.focalPoint ? String(asset.focalPoint.x) : '',
      focalPointY: asset.focalPoint ? String(asset.focalPoint.y) : '',
      replaceTargetAssetId: asset.replaceTargetAssetId ?? '',
      tags: asset.tags.join(', '),
      usage: asset.usage.join(', '),
    }
    : {
      name: '',
      description: '',
      kind: 'image',
      url: '',
      alt: '',
      focalPointX: '',
      focalPointY: '',
      replaceTargetAssetId: '',
      tags: '',
      usage: '',
    }
}

/**
 * Resolves media kind labels for previews.
 */
function getCmsMediaKindLabel(kind: CmsMediaAssetKind): string {
  switch (kind) {
    case 'image':
      return tr('Image', 'Imagem')
    case 'video':
      return tr('Video', 'Video')
    case 'icon':
      return tr('Icon', 'Icone')
    case 'document':
      return tr('Document', 'Documento')
    default:
      return tr('Other', 'Outro')
  }
}

/**
 * Resolves allowed media-kind captions for picker summaries.
 */
function getCmsMediaAllowedKindLabels(
  allowedKinds: CmsMediaAssetKind[] | undefined
): string[] {
  return Array.isArray(allowedKinds)
    ? allowedKinds.map(kind => getCmsMediaKindLabel(kind))
    : []
}

/**
 * Builds one consistent CMS media picker option set with compatibility feedback.
 */
function getCmsMediaPickerOptions(
  allowedKinds: CmsMediaAssetKind[] | undefined
): CmsMediaPickerOption[] {
  return createCmsMediaPickerOptions(
    settings.value.mediaAssets,
    allowedKinds,
    getCmsMediaKindLabel,
    {
      incompatibleLabel: tr('Not allowed for this field', 'Nao permitido para este campo'),
    }
  )
}

const cmsMediaPickerUiText = computed(() => ({
  anyKindLabel: tr('Any media kind', 'Qualquer tipo de midia'),
  selectedAssetLabel: tr('Selected asset', 'Asset selecionado'),
  selectedAssetsLabel: tr('Selected assets', 'Assets selecionados'),
  noSelectionLabel: tr('No asset selected yet.', 'Nenhum asset selecionado ainda.'),
  noOptionLabel: tr('No media assets available.', 'Nenhum asset de midia disponivel.'),
  incompatibleLabel: tr('Not allowed for this field', 'Nao permitido para este campo'),
}))

const tenantProfilesState = ref<CmsTenantProfilesState>(loadCmsTenantProfilesState())
const activeTenantProfileId = ref(tenantProfilesState.value.activeProfileId)
const selectedDomainTransfer = ref<CmsDomainPayloadDomain>('content')

/**
 * Handles get active tenant profile snapshot.
 */
function getActiveTenantProfileSnapshot(): CmsTenantProfile {
  const resolved = resolveActiveCmsTenantProfile({
    tenantProfilesState: tenantProfilesState.value,
    activeProfileId: activeTenantProfileId.value,
  })

  tenantProfilesState.value = resolved.tenantProfilesState
  activeTenantProfileId.value = resolved.activeProfileId
  return resolved.profile
}

const settings = ref<CmsWhiteLabelSettings>(
  cloneWhiteLabelSettings(getActiveTenantProfileSnapshot().settings)
)
const cmsDraftRecoveryState = ref<CmsDraftRecoveryState>(loadCmsDraftRecoveryState())
const cmsAutosaveStatus = ref<'idle' | 'saving' | 'saved' | 'recovery' | 'error'>('idle')
const cmsAutosaveErrorMessage = ref('')
const cmsAutosaveTimerId = ref<number | null>(null)
const cmsAutosaveDelayMs = 600
const cmsAuthoringHistoryLimit = 40
const isApplyingCmsAuthoringHistory = ref(false)
const cmsAuthoringHistory = ref(
  createCmsSnapshotHistoryState(
    cloneWhiteLabelSettings(settings.value),
    cmsAuthoringHistoryLimit
  )
)
const canUndoCmsAuthoringHistory = computed(() => cmsAuthoringHistory.value.past.length > 0)
const canRedoCmsAuthoringHistory = computed(() => cmsAuthoringHistory.value.future.length > 0)

const { cmsUiText, isPtBrLocale, tr } = useCmsUiText(computed(() => settings.value.content.locale))

function buildSavedAtLabel(): string {
  return `${cmsUiText.value.savedAtPrefix} ${new Date().toLocaleTimeString()}`
}

const activeDraftRecoveryEntry = computed(() => {
  return getCmsDraftRecoveryEntry(cmsDraftRecoveryState.value, activeTenantProfileId.value)
})

const activeDraftRecoveryCandidate = computed(() => {
  return resolveCmsDraftRecoveryCandidate(
    activeDraftRecoveryEntry.value,
    settings.value
  )
})

const latestDraftRecoverySavedAt = computed(() => {
  const latest = activeDraftRecoveryEntry.value?.latest
  if (!latest?.savedAt) {
    return ''
  }

  return new Date(latest.savedAt).toLocaleTimeString()
})

const recoveryCandidateSavedAt = computed(() => {
  const candidate = activeDraftRecoveryCandidate.value
  if (!candidate?.savedAt) {
    return ''
  }

  return new Date(candidate.savedAt).toLocaleTimeString()
})

const canRestoreDraftRecovery = computed(() => Boolean(activeDraftRecoveryCandidate.value))
const hasDraftRecoveryEntry = computed(() => Boolean(activeDraftRecoveryEntry.value?.latest))

const cmsAutosaveStatusLabel = computed(() => {
  switch (cmsAutosaveStatus.value) {
    case 'saving':
      return cmsUiText.value.autoSaveSaving
    case 'saved':
      return latestDraftRecoverySavedAt.value
        ? `${cmsUiText.value.autoSaveSaved} ${cmsUiText.value.savedAtPrefix.toLowerCase()} ${latestDraftRecoverySavedAt.value}`
        : cmsUiText.value.autoSaveSaved
    case 'recovery':
      return recoveryCandidateSavedAt.value
        ? `${cmsUiText.value.autoSaveRecoveryAvailable} ${cmsUiText.value.savedAtPrefix.toLowerCase()} ${recoveryCandidateSavedAt.value}`
        : cmsUiText.value.autoSaveRecoveryAvailable
    case 'error':
      return cmsAutosaveErrorMessage.value || cmsUiText.value.autoSaveError
    default:
      return cmsUiText.value.autoSaveEnabled
  }
})

const cmsAutosaveStatusStyle = computed(() => {
  switch (cmsAutosaveStatus.value) {
    case 'saving':
      return {
        background: accentSoftBackground.value,
        color: accentTextColor.value,
      }
    case 'saved':
      return {
        background: notificationSuccessColor.value,
        color: notificationSuccessTextColor.value,
      }
    case 'recovery':
      return {
        background: notificationWarningColor.value,
        color: notificationWarningTextColor.value,
      }
    case 'error':
      return {
        background: notificationErrorColor.value,
        color: notificationErrorTextColor.value,
      }
    default:
      return {
        background: accentSoftBackground.value,
        color: accentTextColor.value,
      }
  }
})

function getCmsDomainTransferLabel(domain: CmsDomainPayloadDomain): string {
  switch (domain) {
    case 'content':
      return tr('Content', 'Conteudo')
    case 'assets':
      return tr('Assets', 'Assets')
    case 'releases':
      return tr('Releases', 'Releases')
  }
}

function getCmsDomainTransferImportedLabel(
  domain: CmsDomainPayloadDomain,
  profileName: string,
  version: string | number
): string {
  const domainLabel = getCmsDomainTransferLabel(domain)
  return tr(
    `${domainLabel} imported from ${profileName} (v${version})`,
    `${domainLabel} importado de ${profileName} (v${version})`
  )
}

function getCmsDomainTransferExportedLabel(domain: CmsDomainPayloadDomain): string {
  return tr(
    `${getCmsDomainTransferLabel(domain)} package exported`,
    `Pacote de ${getCmsDomainTransferLabel(domain)} exportado`
  )
}

function getCmsSchemaPackageImportedLabel(profileName: string, version: string | number): string {
  return tr(
    `Schema package imported from ${profileName} (v${version})`,
    `Pacote de schema importado de ${profileName} (v${version})`
  )
}

function getCmsSchemaPackageExportedLabel(): string {
  return tr(
    'Schema package exported',
    'Pacote de schema exportado'
  )
}

function getCmsDraftComparisonPackageExportedLabel(): string {
  return tr(
    'Review package exported',
    'Pacote de revisao exportado'
  )
}

const cmsDomainTransferOptions = computed(() => ([
  {
    label: getCmsDomainTransferLabel('content'),
    value: 'content' as CmsDomainPayloadDomain,
  },
  {
    label: getCmsDomainTransferLabel('assets'),
    value: 'assets' as CmsDomainPayloadDomain,
  },
  {
    label: getCmsDomainTransferLabel('releases'),
    value: 'releases' as CmsDomainPayloadDomain,
  },
]))

/**
 * Resolves theme presets with overrides.
 */
function resolveThemePresetsWithOverrides(currentSettings: typeof settings.value): CmsThemePreset[] {
  return baseThemePresets.map(preset => ({
    ...preset,
    theme: {
      ...preset.theme,
      ...(currentSettings.themePresetOverrides[preset.id] ?? {}),
    },
  }))
}

/**
 * Handles get current theme presets.
 */
function getCurrentThemePresets(): CmsThemePreset[] {
  return resolveThemePresetsWithOverrides(settings.value)
}

const activeMenuId = ref(settings.value.items[0]?.id ?? defaultMenuId)
const searchQuery = ref('')
const debouncedCmsBuilderSearch = ref('')
let _cmsSearchDebounceTimer: ReturnType<typeof setTimeout> | undefined
watch(
  searchQuery,
  (value) => {
    clearTimeout(_cmsSearchDebounceTimer)
    _cmsSearchDebounceTimer = setTimeout(() => {
      debouncedCmsBuilderSearch.value = normalizeCmsBuilderSearchValue(value)
    }, 200)
  },
  { immediate: true }
)
const selectedBuilderCommandId = ref('')
const activeSettingsTab = ref<'branding' | 'typography' | 'layout' | 'colors' | 'menu' | 'topbar' | 'content'>('branding')
type CmsSettingsWorkbenchTabId = typeof activeSettingsTab.value
const showCmsDesignerStageGrid = ref(true)
const showAdvancedThemeFields = ref(false)
const savedAtLabel = ref(cmsUiText.value.autoSaveEnabled)
const cmsDesignerRulerMarks = Array.from({ length: 17 }, (_, index) => index * 100)
const cmsSettingsWorkbenchTabs = computed<Array<{ id: CmsSettingsWorkbenchTabId, icon: string, label: string, description: string }>>(() => ([
  {
    id: 'branding',
    icon: 'branding_watermark',
    label: settings.value.content.tabBrandingLabel,
    description: tr('Brand and tenant identity', 'Identidade da marca e do tenant'),
  },
  {
    id: 'typography',
    icon: 'text_fields',
    label: settings.value.content.tabTypographyLabel,
    description: tr('Fonts, sizing and rhythm', 'Fontes, tamanhos e ritmo visual'),
  },
  {
    id: 'layout',
    icon: 'dashboard_customize',
    label: settings.value.content.tabLayoutLabel,
    description: tr('Workspace structure and spacing', 'Estrutura do workspace e espacamentos'),
  },
  {
    id: 'colors',
    icon: 'palette',
    label: settings.value.content.tabColorsLabel,
    description: tr('Theme palette and surfaces', 'Paleta do tema e superficies'),
  },
  {
    id: 'menu',
    icon: 'menu',
    label: settings.value.content.tabMenuLabel,
    description: tr('Sidebar navigation behavior', 'Comportamento da navegacao lateral'),
  },
  {
    id: 'topbar',
    icon: 'web_asset',
    label: settings.value.content.tabTopbarLabel,
    description: tr('Top toolbar actions and labels', 'Acoes e labels da barra superior'),
  },
  {
    id: 'content',
    icon: 'edit_note',
    label: settings.value.content.tabContentLabel,
    description: tr('CMS authoring contracts and defaults', 'Contratos e defaults da autoria CMS'),
  },
]))
const activeSettingsWorkbenchTab = computed(() => {
  return cmsSettingsWorkbenchTabs.value.find(tab => tab.id === activeSettingsTab.value)
    ?? cmsSettingsWorkbenchTabs.value[0]
})
type MaybeRefValue<T> = T extends { value: infer V } ? V : T

function unwrapSurfaceProps<T extends Record<string, unknown>>(props: T): { [K in keyof T]: MaybeRefValue<T[K]> } {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [key, unref(value)])
  ) as { [K in keyof T]: MaybeRefValue<T[K]> }
}

const activeSettingsWorkbenchTabLabel = computed(() => activeSettingsWorkbenchTab.value?.label || '')
const pageStatusOptions = computed(() => ([
  { label: cmsUiText.value.pageStatusDraftLabel, value: 'draft' },
  { label: cmsUiText.value.pageStatusPublishedLabel, value: 'published' },
]))
const selectedPageTemplateId = ref<CmsPageTemplateId>('landing-default')
const pageSectionPresetSelections = ref<Record<number, CmsSectionPresetId>>({})
const pageSectionStarterPresetSelections = ref<Record<number, CmsBlockPresetId>>({})
const pageReusableSectionSelections = ref<Record<number, string>>({})
const selectedAuthoredContentModelId = ref<CmsContentModelId | ''>('')
const authoredContentModelNameDraft = ref('')
const authoredContentModelDescriptionDraft = ref('')
const authoredContentModelDefaultPageTitleDraft = ref('')
const authoredContentModelDefaultPageDescriptionDraft = ref('')
const authoredContentModelDefaultPagePathPrefixDraft = ref('')
const authoredContentModelMigrationNotesDraft = ref('')
const authoredContentModelAllowedSectionSelections = ref<CmsSectionPresetId[]>([])
const authoredContentModelRequiredSectionSelections = ref<CmsSectionPresetId[]>([])
const authoredContentModelStarterSectionSelections = ref<CmsSectionPresetId[]>([])
const authoredContentModelRecommendedSectionSelections = ref<CmsSectionPresetId[]>([])
const authoredContentModelMaxSectionsDraft = ref('')
const authoredContentModelPresetLimitDrafts = ref<Partial<Record<CmsSectionPresetId, string>>>({})
const authoredContentModelFieldDrafts = ref<CmsContentModelFieldDraft[]>([])
const selectedAuthoredContentModelFieldPresetId = ref<CmsAuthoredContentModelFieldPresetId | ''>('')
const showArchivedFieldPresets = ref(false)
const draggedPageSection = ref<CmsDraggedPageSection | null>(null)
const pageSectionDropTargetKey = ref('')
const reusableBlockNameDraft = ref('')
const reusableBlockDescriptionDraft = ref('')
const selectedReusableBlockId = ref('')
const showArchivedReusableBlocks = ref(false)
const authoredBlockPresetNameDraft = ref('')
const authoredBlockPresetDescriptionDraft = ref('')
const selectedAuthoredBlockPresetId = ref<CmsBlockPresetId>('custom')
const showArchivedAuthoredBlockPresets = ref(false)
const authoredPresetStarterSectionSelections = ref<CmsSectionPresetId[]>([])
const showArchivedReusableSections = ref(false)
const selectedMediaAssetId = ref('')
interface CmsUsageDrawerTarget {
  kind: CmsEntityUsageTargetKind
  entityId: string
  title: string
  subtitle: string
}
const isCmsUsageDrawerOpen = ref(false)
const cmsUsageDrawerTarget = ref<CmsUsageDrawerTarget | null>(null)
const draggedBlock = ref<CmsDraggedBlock | null>(null)
const blockDropTargetKey = ref('')
const mediaAssetDraft = ref<CmsMediaAssetDraft>({
  name: '',
  description: '',
  kind: 'image',
  url: '',
  alt: '',
  focalPointX: '',
  focalPointY: '',
  replaceTargetAssetId: '',
  tags: '',
  usage: '',
})
const cmsPageTemplateOptions = computed(() => {
  return listCmsPageTemplateOptions(settings.value.content.locale).map(option => ({
    label: option.label,
    value: option.value,
    description: option.description,
  }))
})
const cmsPageQuickStartOptions = computed(() => {
  return listCmsPageQuickStartOptions(
    settings.value.content.locale,
    settings.value.authoredContentModels
  )
})
const cmsStarterKitOptions = computed(() => {
  return listCmsStarterKitOptions(
    settings.value.content.locale,
    settings.value.authoredContentModels
  )
})
const normalizedCmsBuilderSearch = computed(() => debouncedCmsBuilderSearch.value)
const hasCmsBuilderSearch = computed(() => normalizedCmsBuilderSearch.value.length > 0)
const filteredCmsStarterKitOptions = computed(() => {
  if (!hasCmsBuilderSearch.value) {
    return cmsStarterKitOptions.value
  }

  return cmsStarterKitOptions.value.filter(option => matchesCmsBuilderSearch(
    normalizedCmsBuilderSearch.value,
    option.label,
    option.description,
    option.templateLabel,
    option.contentModelLabel,
  ))
})
const filteredCmsPageQuickStartOptions = computed(() => {
  if (!hasCmsBuilderSearch.value) {
    return cmsPageQuickStartOptions.value
  }

  return cmsPageQuickStartOptions.value.filter(option => matchesCmsBuilderSearch(
    normalizedCmsBuilderSearch.value,
    option.label,
    option.description,
    option.contentModelLabel,
    option.sectionLabels.join(' '),
  ))
})
const filteredCmsPageRows = computed<CmsFilteredPageRow[]>(() => {
  const rows = settings.value.pages.map((page, pageIndex) => ({
    page,
    pageIndex,
  }))

  if (!hasCmsBuilderSearch.value) {
    return rows
  }

  return rows.filter(({ page }) => matchesCmsBuilderSearch(
    normalizedCmsBuilderSearch.value,
    page.id,
    getCmsPageTitleValue(page),
    getCmsPageDescriptionValue(page),
    page.path,
    page.status,
    getCmsContentModelLabel(settings.value.content.locale, page.contentModelId, settings.value.authoredContentModels),
    page.sections.map(section => getCmsSectionLabelValue(section)).join(' '),
    page.sections.map(section => section.presetId).join(' '),
  ))
})
const cmsContentModelOptions = computed(() => {
  return listCmsContentModelOptions(
    settings.value.content.locale,
    settings.value.authoredContentModels
  ).map(option => ({
    label: option.label,
    value: option.value,
    description: option.description,
  }))
})
const cmsContentModelFieldTypeOptions = computed(() => ([
  { label: tr('Text', 'Texto'), value: 'text' as const },
  { label: tr('Textarea', 'Textarea'), value: 'textarea' as const },
  { label: tr('Number', 'Numero'), value: 'number' as const },
  { label: tr('Toggle', 'Alternancia'), value: 'toggle' as const },
  { label: tr('Select', 'Selecao'), value: 'select' as const },
  { label: tr('URL', 'URL'), value: 'url' as const },
  { label: tr('Date', 'Data'), value: 'date' as const },
  { label: tr('Media asset', 'Asset de midia'), value: 'media-asset' as const },
  { label: tr('Reference', 'Referencia'), value: 'reference' as const },
  { label: tr('Object', 'Objeto'), value: 'object' as const },
  { label: tr('Repeatable group', 'Grupo repetivel'), value: 'group' as const },
]))
const cmsMediaKindOptions = computed(() => ([
  { label: getCmsMediaKindLabel('image'), value: 'image' as const },
  { label: getCmsMediaKindLabel('video'), value: 'video' as const },
  { label: getCmsMediaKindLabel('icon'), value: 'icon' as const },
  { label: getCmsMediaKindLabel('document'), value: 'document' as const },
  { label: getCmsMediaKindLabel('other'), value: 'other' as const },
]))
const cmsReferenceKindOptions = computed(() => ([
  { label: tr('Content model', 'Modelo de conteudo'), value: 'content-model' as const },
  { label: tr('Block preset', 'Preset de bloco'), value: 'block-preset' as const },
  { label: tr('Reusable block', 'Bloco reutilizavel'), value: 'reusable-block' as const },
  { label: tr('Reusable section', 'Secao reutilizavel'), value: 'reusable-section' as const },
]))
const cmsContentModelFieldVisibilitySourceOptions = computed(() => ([
  { label: tr('Another field', 'Outro campo'), value: 'field' as const },
  { label: tr('Page status', 'Status da pagina'), value: 'page-status' as const },
]))
const cmsContentModelFieldVisibilityOperatorOptions = computed(() => ([
  { label: tr('Equals', 'Igual a'), value: 'equals' as const },
  { label: tr('Not equals', 'Diferente de'), value: 'not-equals' as const },
  { label: tr('Contains', 'Contem'), value: 'contains' as const },
  { label: tr('Is empty', 'Esta vazio'), value: 'is-empty' as const },
  { label: tr('Is not empty', 'Nao esta vazio'), value: 'is-not-empty' as const },
  { label: tr('Is true', 'E verdadeiro'), value: 'is-true' as const },
  { label: tr('Is false', 'E falso'), value: 'is-false' as const },
]))
const cmsAuthoredContentModelLibrary = computed<CmsAuthoredContentModelSettings[]>(() => {
  return settings.value.authoredContentModels
})
const cmsAuthoredContentModelOptions = computed(() => {
  return settings.value.authoredContentModels.map(model => ({
    label: getCmsAuthoredContentModelNameValue(model),
    value: model.id,
    description: getCmsAuthoredContentModelDescriptionValue(model),
  }))
})
const cmsAuthoredContentModelFieldPresetLibrary = computed<CmsAuthoredContentModelFieldPresetSettings[]>(() => {
  return settings.value.authoredContentModelFieldPresets
    .filter(preset => showArchivedFieldPresets.value || !isCmsArchivedEntity(preset))
})

/**
 * Normalizes free-text builder search input.
 */
function normalizeCmsBuilderSearchValue(value: unknown): string {
  return String(value ?? '').trim().toLowerCase()
}

/**
 * Evaluates whether any provided tokens match the current builder search query.
 */
function matchesCmsBuilderSearch(searchValue: string, ...tokens: unknown[]): boolean {
  if (!searchValue) {
    return true
  }

  return tokens.some(token => normalizeCmsBuilderSearchValue(token).includes(searchValue))
}
const cmsAuthoredContentModelFieldPresetOptions = computed<CmsContentModelFieldPresetOption[]>(() => {
  return listCmsContentModelFieldPresetOptions(
    settings.value.content.locale,
    settings.value.authoredContentModelFieldPresets.filter(preset => !isCmsArchivedEntity(preset) && !isCmsDeprecatedEntity(preset))
  )
})
const cmsContentModelPresetOptions = computed<CmsSectionPresetOption[]>(() => {
  return listAllCmsSectionPresetOptions(settings.value.content.locale)
})
const cmsContentModelRecommendedPresetOptions = computed<CmsSectionPresetOption[]>(() => {
  const allowedPresetIds = new Set(authoredContentModelAllowedSectionSelections.value)
  return cmsContentModelPresetOptions.value.filter(option => allowedPresetIds.has(option.value))
})
const cmsContentModelRequiredPresetOptions = computed<CmsSectionPresetOption[]>(() => {
  const allowedPresetIds = new Set(authoredContentModelAllowedSectionSelections.value)
  return cmsContentModelPresetOptions.value.filter(option => allowedPresetIds.has(option.value))
})
const cmsContentModelStarterPresetOptions = computed<CmsSectionPresetOption[]>(() => {
  const allowedPresetIds = new Set(authoredContentModelAllowedSectionSelections.value)
  return cmsContentModelPresetOptions.value.filter(option => allowedPresetIds.has(option.value))
})
const cmsContentModelPresetLimitOptions = computed<CmsSectionPresetOption[]>(() => {
  const allowedPresetIds = new Set(authoredContentModelAllowedSectionSelections.value)
  return cmsContentModelPresetOptions.value.filter(option => allowedPresetIds.has(option.value))
})
const cmsLocaleOptions = CMS_LOCALE_OPTIONS
const cmsPreviewSource = ref<CmsPreviewSource>('draft')
const cmsPreviewViewport = ref<CmsPreviewViewport>('desktop')
const cmsPreviewLocale = ref<CmsLocale>(resolveCmsLocale(settings.value.content.locale))
const cmsDesignerPreviewMode = ref(false)
const cmsSettingsWorkspaceView = ref<CmsDesignerWorkspaceView>('editor')
const cmsPagesWorkspaceView = ref<CmsDesignerWorkspaceView>('editor')
const cmsBlocksWorkspaceView = ref<CmsDesignerWorkspaceView>('editor')
const cmsWorkspaceTabOptions = computed<CmsWorkspaceTabOption[]>(() => ([
  { id: 'editor', label: tr('Editor', 'Editor') },
  { id: 'preview', label: tr('Preview', 'Preview') },
]))
const cmsSettingsToolbarInfoItems = computed<CmsAuthoringToolbarInfoItem[]>(() => ([
  {
    id: 'tenant',
    label: activeTenantProfileName.value || tr('Default tenant', 'Tenant padrao'),
    emphasis: true,
  },
  {
    id: 'autosave',
    label: cmsAutosaveStatusLabel.value,
  },
  {
    id: 'tab',
    label: activeSettingsWorkbenchTab.value?.label || '',
  },
]))
const cmsPagesToolbarInfoItems = computed<CmsAuthoringToolbarInfoItem[]>(() => ([
  {
    id: 'tenant',
    label: activeTenantProfileName.value || tr('Default tenant', 'Tenant padrao'),
    emphasis: true,
  },
  {
    id: 'autosave',
    label: cmsAutosaveStatusLabel.value,
  },
  {
    id: 'module',
    label: activeShellItem.value.label,
  },
]))
const cmsBlocksToolbarInfoItems = computed<CmsAuthoringToolbarInfoItem[]>(() => ([
  {
    id: 'tenant',
    label: activeTenantProfileName.value || tr('Default tenant', 'Tenant padrao'),
    emphasis: true,
  },
  {
    id: 'autosave',
    label: cmsAutosaveStatusLabel.value,
  },
  {
    id: 'module',
    label: activeShellItem.value.label,
  },
]))
const cmsSettingsRailMetrics = computed<CmsAuthoringMetricItem[]>(() => ([
  {
    id: 'locale',
    label: tr('Locale', 'Locale'),
    value: settings.value.content.locale,
  },
  {
    id: 'advanced-fields',
    label: tr('Advanced fields', 'Campos avancados'),
    value: showAdvancedThemeFields.value ? tr('Visible', 'Visiveis') : tr('Hidden', 'Ocultos'),
  },
  {
    id: 'recovery',
    label: tr('Recovery', 'Recovery'),
    value: canRestoreDraftRecovery.value ? tr('Available', 'Disponivel') : tr('Idle', 'Inativo'),
  },
]))
const cmsPagesSidebarMetrics = computed<CmsAuthoringMetricItem[]>(() => ([
  {
    id: 'template',
    label: tr('Template', 'Template'),
    value: cmsPageTemplateOptions.value.find(option => option.value === selectedPageTemplateId.value)?.label || selectedPageTemplateId.value,
  },
  {
    id: 'tenant-pages',
    label: tr('Pages in tenant', 'Paginas no tenant'),
    value: settings.value.pages.length,
  },
  {
    id: 'reusable-sections',
    label: tr('Reusable sections', 'Secoes reutilizaveis'),
    value: settings.value.reusableSections.length,
  },
  {
    id: 'quick-command',
    label: tr('Quick command', 'Comando rapido'),
    value: selectedCmsBuilderCommandOption.value?.label || tr('None selected', 'Nenhum selecionado'),
  },
]))
const cmsPagesRailMetrics = computed<CmsAuthoringMetricItem[]>(() => ([
  {
    id: 'visible-sections',
    label: tr('Visible sections', 'Secoes visiveis'),
    value: filteredCmsReusableSectionLibrary.value.length,
  },
  {
    id: 'total-library',
    label: tr('Total library', 'Biblioteca total'),
    value: settings.value.reusableSections.length,
  },
  {
    id: 'archived-hidden',
    label: tr('Archived hidden', 'Arquivadas ocultas'),
    value: showArchivedReusableSections.value ? tr('No', 'Nao') : tr('Yes', 'Sim'),
  },
]))
const cmsBlocksSidebarMetrics = computed<CmsAuthoringMetricItem[]>(() => ([
  {
    id: 'page',
    label: tr('Page', 'Pagina'),
    value: activeBlocksPage.value?.title || tr('None selected', 'Nenhuma selecionada'),
  },
  {
    id: 'section',
    label: tr('Section', 'Secao'),
    value: activeBlocksSection.value?.label || tr('None selected', 'Nenhuma selecionada'),
  },
  {
    id: 'block',
    label: tr('Block', 'Bloco'),
    value: activeBlocksSelectedBlockRecord.value?.id || tr('None selected', 'Nenhum selecionado'),
  },
  {
    id: 'visible-sections',
    label: tr('Visible sections', 'Secoes visiveis'),
    value: filteredActiveBlocksSections.value.length,
  },
]))
const cmsBlocksRailMetrics = computed<CmsAuthoringMetricItem[]>(() => ([
  {
    id: 'blocks-in-focus-section',
    label: tr('Blocks in focus section', 'Blocos na secao em foco'),
    value: cmsSectionBlocks.value.length,
  },
  {
    id: 'limit-reached',
    label: tr('Limit reached', 'Limite atingido'),
    value: activeBlocksSectionLimitReached.value ? tr('Yes', 'Sim') : tr('No', 'Nao'),
  },
  {
    id: 'linked-section',
    label: tr('Linked section', 'Secao vinculada'),
    value: activeBlocksSectionIsLinked.value ? tr('Yes', 'Sim') : tr('No', 'Nao'),
  },
]))
const cmsSettingsStatusItems = computed<CmsAuthoringStatusItem[]>(() => ([
  {
    id: 'tenant',
    label: activeTenantProfileName.value || tr('Default tenant', 'Tenant padrao'),
    emphasis: true,
  },
  {
    id: 'tab',
    label: activeSettingsWorkbenchTab.value?.label || '',
  },
  {
    id: 'saved-at',
    label: savedAtLabel.value,
  },
]))
const cmsPagesStatusItems = computed<CmsAuthoringStatusItem[]>(() => ([
  {
    id: 'pages',
    kind: 'chip',
    label: `${tr('Pages', 'Paginas')}: ${settings.value.pages.length}`,
    style: statusChipStyle.value,
  },
  {
    id: 'visible',
    kind: 'chip',
    label: `${tr('Visible', 'Visiveis')}: ${filteredCmsPageRows.value.length}`,
    style: statusChipStyle.value,
  },
  {
    id: 'reusable',
    kind: 'chip',
    label: `${tr('Reusable', 'Reutilizaveis')}: ${filteredCmsReusableSectionLibrary.value.length}`,
    style: statusChipStyle.value,
  },
  {
    id: 'saved-at',
    label: savedAtLabel.value,
  },
]))
const cmsBlocksStatusItems = computed<CmsAuthoringStatusItem[]>(() => ([
  {
    id: 'sections',
    kind: 'chip',
    label: `${tr('Sections', 'Secoes')}: ${filteredActiveBlocksSections.value.length}`,
    style: statusChipStyle.value,
  },
  {
    id: 'blocks',
    kind: 'chip',
    label: `${tr('Blocks', 'Blocos')}: ${cmsSectionBlocks.value.length}`,
    style: statusChipStyle.value,
  },
  {
    id: 'reusable',
    kind: 'chip',
    label: `${tr('Reusable', 'Reutilizaveis')}: ${filteredCmsReusableBlockLibrary.value.length}`,
    style: statusChipStyle.value,
  },
  {
    id: 'saved-at',
    label: savedAtLabel.value,
  },
]))
function toCmsDiagnosticsListItems(
  diagnostics: ReadonlyArray<{
    id: string
    code: string
    message: string
    severity:
      | CmsMediaDiagnostic['severity']
      | CmsReleaseValidationIssue['severity']
      | CmsContentValidationIssue['severity']
  }>
): CmsDiagnosticsListItem[] {
  return diagnostics.map(diagnostic => ({
    id: diagnostic.id,
    code: diagnostic.code,
    message: diagnostic.message,
    severity: diagnostic.severity,
    severityStyle: getCmsDiagnosticStyle(diagnostic.severity),
  }))
}
const cmsSettingsWorkspaceTabValue = computed(() => (
  cmsDesignerPreviewMode.value || cmsSettingsWorkspaceView.value === 'preview' ? 'preview' : 'editor'
))
const cmsPagesWorkspaceTabValue = computed(() => (
  cmsDesignerPreviewMode.value || cmsPagesWorkspaceView.value === 'preview' ? 'preview' : 'editor'
))
const cmsBlocksWorkspaceTabValue = computed(() => (
  cmsDesignerPreviewMode.value || cmsBlocksWorkspaceView.value === 'preview' ? 'preview' : 'editor'
))
const cmsSettingsModuleTemplateProps = computed(() => ({
  shell: unwrapSurfaceProps({
    settings,
    cmsUiText,
    tr,
    cmsSettingsWorkspaceTabValue,
    cmsWorkspaceTabOptions,
    cmsSettingsWorkspaceView,
    cmsDesignerPreviewMode,
    cmsSettingsToolbarInfoItems,
    canUndoCmsAuthoringHistory,
    canRedoCmsAuthoringHistory,
    cmsDesignerRulerMarks,
    showCmsDesignerStageGrid,
    cmsSettingsWorkbenchTabs,
    primaryActionStyle,
    dangerActionStyle,
    warningActionStyle,
    bannerStyle,
    statusChipStyle,
    cmsMediaPickerUiText,
    cmsSettingsRailMetrics,
    cmsSettingsStatusItems,
    activeTenantProfileName,
    activeSettingsWorkbenchTabLabel,
  }),
  tenant: unwrapSurfaceProps({
    activeSettingsTab,
    activeTenantProfileId,
    tenantProfileOptions,
    tenantProfilesState,
    savedAtLabel,
    selectedDomainTransfer,
    cmsDomainTransferOptions,
    cmsAutosaveStatusStyle,
    cmsAutosaveStatusLabel,
    latestDraftRecoverySavedAt,
    recoveryCandidateSavedAt,
    canRestoreDraftRecovery,
    hasDraftRecoveryEntry,
  }),
  theme: unwrapSurfaceProps({
    showAdvancedThemeFields,
    typographyFieldGroups,
    layoutFieldGroups,
    colorFieldGroups,
    selectedThemePreset,
    themePresetOptions,
    activeThemePresetLabel,
    activeThemePresetDescription,
    accentColor,
    defaultTheme,
    notificationChipStyles,
    notificationBellPreviewStyle,
    notificationCounterPreviewStyle,
    notificationBadgeColor,
    notificationBadgeTextColor,
    menuPreviewGroups,
    previewActiveItemId,
    groupOptions,
    toolbarPreviewActions,
    cmsLocaleOptions,
  }),
  contentModel: unwrapSurfaceProps({
    selectedAuthoredContentModelId,
    cmsAuthoredContentModelOptions,
    authoredContentModelNameDraft,
    authoredContentModelDescriptionDraft,
    authoredContentModelDefaultPageTitleDraft,
    authoredContentModelDefaultPageDescriptionDraft,
    authoredContentModelDefaultPagePathPrefixDraft,
    authoredContentModelMigrationNotesDraft,
    authoredContentModelFieldDrafts,
    selectedAuthoredContentModelFieldPresetId,
    cmsAuthoredContentModelFieldPresetOptions,
    cmsContentModelFieldTypeOptions,
    cmsMediaKindOptions,
    cmsReferenceKindOptions,
    cmsContentModelFieldVisibilitySourceOptions,
    doesCmsContentModelFieldVisibilityOperatorRequireValue,
    pageStatusOptions,
    selectedAuthoredContentModelFieldPresetSettings,
    showArchivedFieldPresets,
    cmsAuthoredContentModelFieldPresetLibrary,
    authoredContentModelAllowedSectionSelections,
    cmsContentModelPresetOptions,
  }),
  actions: unwrapSurfaceProps({
    scrollCmsDesignerSurface,
    createTenantProfileFromPrompt,
    saveNow,
    undoCmsAuthoringChange,
    redoCmsAuthoringChange,
    exportActiveTenantProfile,
    showCmsDesignerPreview,
    removeActiveTenantProfile,
    onTenantProfileChange,
    resetToDefaults,
    exportSelectedDomainSnapshot,
    restoreCmsDraftRecovery,
    discardCmsDraftRecovery,
    toggleCmsDesignerStageGrid,
    getThemeFieldPickerValue,
    onThemeColorInput,
    getThemeFieldValue,
    onThemeFieldInput,
    onThemePresetChange,
    detectThemePresetFromCurrent,
    resolveThemeTokenValue,
    addGroup,
    removeGroup,
    normalizeGroupId,
    addMenuItem,
    removeMenuItem,
    addToolbarAction,
    removeToolbarAction,
    onCmsLocaleChange,
    createNewAuthoredContentModelDraft,
    exportCmsSchemaPackage,
    insertSelectedAuthoredContentModelFieldPreset,
    addAuthoredContentModelFieldDraft,
    removeAuthoredContentModelFieldDraft,
    saveAuthoredContentModelFieldDraftAsPreset,
    normalizeCmsContentModelFieldVisibilityDraft,
    getCmsContentModelFieldVisibilityTargetOptions,
    getCmsContentModelFieldVisibilityOperatorOptions,
    getCmsContentModelFieldHtmlInputType,
    parseCmsRepeatableFieldValue,
    getCmsContentModelFieldDraftMediaOptions,
    getCmsMediaAllowedKindLabels,
    getCmsContentModelFieldDraftReferenceOptions,
    getCmsContentModelFieldMinConstraintLabel,
    getCmsContentModelFieldMaxConstraintLabel,
    doesCmsContentModelFieldSupportScalarConstraints,
    getCmsAuthoredContentModelFieldPresetNameValue,
    getCmsAuthoredContentModelFieldPresetDescriptionValue,
    getCmsReplacementLabel,
    isCmsArchivedEntity,
    isCmsDeprecatedEntity,
    getCmsFieldPresetReplacementOptions,
    updateCmsAuthoredContentModelFieldPresetReplacement,
    updateCmsAuthoredContentModelFieldPresetDeprecationNote,
    undeprecateCmsAuthoredContentModelFieldPreset,
    deprecateCmsAuthoredContentModelFieldPreset,
    unarchiveCmsAuthoredContentModelFieldPreset,
    archiveCmsAuthoredContentModelFieldPreset,
    selectCmsReplacementFieldPreset,
  }),
}))

const cmsPagesModuleTemplateProps = computed(() => ({
  shell: unwrapSurfaceProps({
    settings,
    cmsUiText,
    cmsPagesWorkspaceTabValue,
    cmsWorkspaceTabOptions,
    cmsPagesWorkspaceView,
    cmsDesignerPreviewMode,
    cmsPagesToolbarInfoItems,
    canUndoCmsAuthoringHistory,
    canRedoCmsAuthoringHistory,
    cmsDesignerRulerMarks,
    showCmsDesignerStageGrid,
    cmsPagesSidebarMetrics,
    cmsPagesRailMetrics,
    cmsPagesStatusItems,
    statusChipStyle,
    primaryActionStyle,
    warningActionStyle,
    dangerActionStyle,
    bannerStyle,
    tr,
  }),
  builder: unwrapSurfaceProps({
    selectedPageTemplateId,
    cmsPageTemplateOptions,
    selectedBuilderCommandId,
    cmsBuilderCommandOptions,
    selectedCmsBuilderCommandOption,
    cmsSchemaMigrationBatchReport,
    filteredCmsPageRows,
    cmsContentModelOptions,
    pageStatusOptions,
    cmsMediaPickerUiText,
    draggedPageSection,
    pageSectionDropTargetKey,
  }),
  library: unwrapSurfaceProps({
    showArchivedReusableSections,
    filteredCmsReusableSectionLibrary,
    pagedCmsReusableSectionLibrary,
    hasCmsBuilderSearch,
    cmsStarterKitOptions,
    filteredCmsStarterKitOptions,
    cmsPageQuickStartOptions,
    filteredCmsPageQuickStartOptions,
  }),
  preview: unwrapSurfaceProps({
    cmsPreviewSource,
    cmsPreviewLocale,
    cmsPreviewViewport,
    cmsPreviewSourceOptions,
    cmsLocaleOptions,
    cmsPreviewViewportOptions,
    cmsPreviewPublishedReleaseLabel,
    isPtBrLocale,
    cmsPreviewEmptyMessage,
    cmsPreviewDraftPublishedDiff,
    cmsPreviewChangedPageDiffs,
    cmsPreviewLocaleCoverageMatrix,
    cmsPreviewActiveLocaleCoverage,
    cmsLocaleCoverageCategories,
    cmsPreviewPagesForRender,
    cmsPreviewPageDiffMap,
    cmsPreviewAuthoredContentModels,
    landingRegistry,
    cmsPreviewRenderContext,
  }),
  actions: unwrapSurfaceProps({
    focusWorkbench: () => scrollCmsDesignerSurface('.cms-designer-card--pages .cms-designer-card__workbench'),
    addCmsPage,
    saveNow,
    undoCmsAuthoringChange,
    redoCmsAuthoringChange,
    showPagesPreview: () => showCmsDesignerPreview('pages'),
    toggleCmsDesignerStageGrid,
    executeSelectedBuilderCommand,
    normalizeCmsPageId,
    updateCmsPageContentModel,
    updateCmsPageTitleValue,
    normalizeCmsPagePath,
    updateCmsPageDescriptionValue,
    getCmsPageContentModelFields,
    getCmsPageContentModelFieldGroups,
    formatCmsJsonFieldValue,
    getCmsPageCustomFieldValue,
    getCmsContentModelFieldHint,
    updateCmsPageCustomFieldValue,
    normalizeCmsMediaPickerModelValue,
    getCmsPageCustomFieldMediaOptions,
    getCmsMediaAllowedKindLabels,
    getCmsPageCustomFieldReferenceOptions,
    formatCmsRepeatableFieldValue,
    getCmsContentModelFieldHtmlInputType,
    getSelectedSectionPresetForPage,
    getCmsSectionPresetOptions,
    setSelectedSectionPresetForPage,
    getSelectedSectionStarterPresetForPage,
    getCmsSectionStarterPresetOptions,
    setSelectedSectionStarterPresetForPage,
    addCmsPageSection,
    isCmsPageSectionAddBlocked,
    applyCmsPageContentModelStarterSections,
    applyCmsPageContentModelDefaults,
    syncCmsPageContentModelVersion,
    getSelectedReusableSectionForPage,
    getCmsReusableSectionOptions,
    setSelectedReusableSectionForPage,
    insertSelectedReusableSection,
    insertSelectedLinkedReusableSection,
    getCmsPageSchemaMigrationReport,
    getCmsSchemaMigrationBatchSummaryLabel,
    getCmsSchemaMigrationSummaryLabel,
    getCmsSchemaMigrationStatusStyle,
    getCmsSchemaMigrationStatusLabel,
    getCmsSchemaMigrationChangeStyle,
    getCmsSchemaMigrationChangeKindLabel,
    getCmsSchemaMigrationChangeValueLabel,
    getCmsSectionStarterPresetVariants,
    isCmsSectionStarterPresetSelected,
    getCmsStarterPresetSourceLabel,
    onCmsPageSectionDragStart,
    onCmsPageSectionDragEnd,
    onCmsPageSectionDragOver,
    onCmsPageSectionDrop,
    isCmsPageSectionLinked,
    resolveCmsPageSectionForAuthoring,
    getCmsSectionPresetLabel,
    getCmsSectionLabelValue,
    updateCmsSectionLabelValue,
    getCmsReusableSourceLabel,
    duplicateCmsPageSection,
    saveCmsPageSectionAsReusable,
    branchCmsPageSectionToVariant,
    detachCmsPageSection,
    openPageInBlocksEditor,
    removeCmsPageSection,
    removeCmsPage,
    getCmsReplacementLabel,
    isCmsArchivedEntity,
    isCmsDeprecatedEntity,
    isCmsReusableSectionVariant,
    getCmsReplacementAssistantSummaryLabel,
    getCmsReusableSectionVariantLabel,
    getCmsReusableSectionUsageSummaryLabel,
    getCmsReusableSectionUsageCount,
    getCmsReusableSectionLabelValue,
    getCmsReusableSectionReplacementOptions,
    updateReusableSectionReplacement,
    updateReusableSectionDeprecationNote,
    createReusableSectionVariant,
    getCmsReplacementAssistantSummary,
    applyCmsDeprecatedReplacement,
    openCmsUsageDrawer,
    undeprecateReusableSection,
    deprecateReusableSection,
    unarchiveReusableSection,
    archiveReusableSection,
    runCmsStarterKit,
    runCmsPageQuickStart,
    openPagesPreviewInWindow: () => openCmsDesignerPreviewInWindow('pages'),
    getCmsPreviewDiffStatusStyle,
    getCmsPreviewDiffStatusLabel,
    getCmsPreviewDiffChangeCount,
    getCmsPreviewDiffPageLabel,
    getCmsPreviewDiffPagePath,
    getCmsLocaleCoverageStatusStyle,
    getCmsLocaleCoverageSummaryLabel,
    getCmsLocaleCoverageStatusLabel,
    getCmsLocaleCoverageCategoryLabel,
    getCmsLocaleCoverageLocaleLabel,
    getCmsPageTitleValue,
    getCmsPageDescriptionValue,
    getCmsContentModelLabel,
    getCmsPageCurrentSchemaVersion,
    getCmsPageStatusStyle,
    toCmsPreviewPageSchema,
    getCmsPreviewPageDiagnostics,
    toCmsDiagnosticsListItems,
    getCmsPageSectionStyle,
  }),
}))

const cmsBlocksModuleTemplateProps = computed(() => ({
  shell: unwrapSurfaceProps({
    settings,
    cmsUiText,
    cmsBlocksWorkspaceTabValue,
    cmsWorkspaceTabOptions,
    cmsBlocksWorkspaceView,
    cmsDesignerPreviewMode,
    cmsBlocksToolbarInfoItems,
    canUndoCmsAuthoringHistory,
    canRedoCmsAuthoringHistory,
    cmsDesignerRulerMarks,
    showCmsDesignerStageGrid,
    cmsSectionBlocks,
    cmsBlocksSidebarMetrics,
    cmsBlocksRailMetrics,
    cmsBlocksStatusItems,
    statusChipStyle,
    primaryActionStyle,
    warningActionStyle,
    dangerActionStyle,
    bannerStyle,
    tr,
    cmsMediaPickerUiText,
  }),
  builder: unwrapSurfaceProps({
    selectedBuilderCommandId,
    cmsBuilderCommandOptions,
    selectedCmsBuilderCommandOption,
    activeBlocksPageId,
    blocksPageOptions,
    activeBlocksSectionId,
    blocksSectionOptions,
    activeBlocksBlockId,
    activeBlocksBlockOptions,
    selectedPaletteBlockType,
    cmsBlockPaletteOptions,
    selectedPaletteBlockPresetId,
    cmsBlockPresetOptions,
    canAddPaletteBlockToActiveSection,
    activeBlocksSectionContractSummary,
    activeBlocksSection,
    activeBlocksSectionIsLinked,
    activeBlocksSections,
    filteredActiveBlocksSections,
    canToggleActiveSectionBlocks,
    canRemoveDisabledBlocksFromActiveSection,
    blockDropTargetKey,
    draggedBlock,
    activeBlocksPropsDraft,
    activeBlocksSelectedBlock,
    activeBlocksSelectedBlockRecord,
    activeBlocksSelectionReadOnly,
    activeBlocksFieldDefinitions,
    activeBlocksSchema,
    activeBlocksPreviewMissingFromPublished,
    activeBlocksPageDiff,
    activeBlocksSectionDiff,
    activeBlocksBlockDiff,
    activeBlocksContentDiagnostics,
    activeBlocksMediaDiagnostics,
  }),
  library: unwrapSurfaceProps({
    reusableBlockNameDraft,
    reusableBlockDescriptionDraft,
    selectedReusableBlockId,
    cmsReusableBlockOptions,
    filteredCmsReusableBlockLibrary,
    pagedCmsReusableBlockLibrary,
    hasCmsBuilderSearch,
    authoredBlockPresetNameDraft,
    authoredBlockPresetDescriptionDraft,
    selectedAuthoredBlockPresetId,
    cmsAuthoredBlockPresetOptions,
    authoredPresetStarterSectionSelections,
    cmsPresetStarterSectionOptions,
    showArchivedReusableBlocks,
    showArchivedAuthoredBlockPresets,
    filteredCmsAuthoredBlockPresetLibrary,
    pagedCmsAuthoredBlockPresetLibrary,
  }),
  preview: unwrapSurfaceProps({
    cmsPreviewSource,
    cmsPreviewLocale,
    cmsPreviewViewport,
    cmsPreviewSourceOptions,
    cmsLocaleOptions,
    cmsPreviewViewportOptions,
    cmsPreviewPublishedReleaseLabel,
    isPtBrLocale,
    cmsPreviewEmptyMessage,
    cmsPreviewDraftPublishedDiff,
    cmsPreviewLocaleCoverageMatrix,
    cmsPreviewActiveLocaleCoverage,
    cmsLocaleCoverageCategories,
    cmsPreviewPages,
    cmsPreviewPublishedPagesCount,
    cmsPreviewEnabledSectionsCount,
    cmsPreviewEnabledBlocksCount,
    landingRegistry,
    cmsPreviewRenderContext,
  }),
  actions: unwrapSurfaceProps({
    focusWorkbench: () => scrollCmsDesignerSurface('.cms-designer-card--blocks .cms-designer-card__workbench'),
    saveNow,
    undoCmsAuthoringChange,
    redoCmsAuthoringChange,
    showBlocksPreview: () => showCmsDesignerPreview('blocks'),
    toggleCmsDesignerStageGrid,
    executeSelectedBuilderCommand,
    addCmsBuilderBlockFromPalette,
    setCmsBuilderSectionBlocksEnabled,
    removeDisabledBlocksFromActiveSection,
    saveSelectedBlockAsReusable,
    insertSelectedReusableBlock,
    insertSelectedLinkedReusableBlock,
    saveCmsPresetFromCurrentSelection,
    updateSelectedCmsPreset,
    applySelectedCmsPresetToBlock,
    selectCmsAuthoredPreset,
    selectCmsReplacementAuthoredPreset,
    openPagesModule,
    setActiveBlocksSelection,
    onCmsBuilderBlockDragStart,
    onCmsBuilderBlockDragEnd,
    onCmsBuilderBlockDragOver,
    onCmsBuilderSectionDrop,
    onCmsBuilderBlockDrop,
    updateCmsBuilderBlockEnabled,
    detachCmsBuilderBlockByRecord,
    branchCmsBuilderBlockToVariant,
    duplicateCmsBuilderBlockByRecord,
    moveCmsBuilderBlockByRecord,
    removeCmsBuilderBlockByRecord,
    formatSelectedBlockPropsDraft,
    applySelectedBlockPropsDraft,
    getActiveBlocksFieldModelValue,
    updateActiveBlocksFieldValue,
    getActiveBlocksMediaFieldOptions,
    updateActiveBlocksJsonFieldDraft,
    applyActiveBlocksJsonFieldValue,
    getActiveBlocksNumberFieldModelValue,
    getActiveCmsAuthoringLocale,
    getCmsBlockPresetLabel,
    resolveCmsBlockDisplayName,
    getCmsReusableBlockUsageCount,
    getCmsReusableBlockUsageSummaryLabel,
    isCmsArchivedEntity,
    isCmsDeprecatedEntity,
    isCmsReusableBlockVariant,
    getCmsReusableBlockVariantLabel,
    getCmsReplacementLabel,
    getCmsReplacementAssistantSummaryLabel,
    getCmsReplacementAssistantSummary,
    getCmsReusableBlockReplacementOptions,
    updateReusableBlockReplacement,
    updateReusableBlockDeprecationNote,
    createReusableBlockVariant,
    applyCmsDeprecatedReplacement,
    openCmsUsageDrawer,
    undeprecateReusableBlock,
    deprecateReusableBlock,
    unarchiveReusableBlock,
    archiveReusableBlock,
    getCmsAuthoredBlockPresetNameValue,
    getCmsAuthoredBlockPresetDescriptionValue,
    getCmsAuthoredBlockPresetUsageCount,
    getCmsAuthoredBlockPresetUsageSummaryLabel,
    getCmsAuthoredPresetStarterSectionsLabel,
    getCmsAuthoredBlockPresetReplacementOptions,
    updateCmsAuthoredPresetReplacement,
    updateCmsAuthoredPresetDeprecationNote,
    undeprecateCmsAuthoredPreset,
    deprecateCmsAuthoredPreset,
    unarchiveCmsAuthoredPreset,
    archiveCmsAuthoredPreset,
    getCmsSectionFieldDefinitions,
    getCmsSectionFieldGroups,
    getCmsSectionCustomFieldValue,
    formatCmsJsonFieldValue,
    normalizeCmsMediaPickerModelValue,
    getCmsPageCustomFieldMediaOptions,
    getCmsMediaAllowedKindLabels,
    getCmsPageCustomFieldReferenceOptions,
    formatCmsRepeatableFieldValue,
    getCmsContentModelFieldHint,
    getCmsContentModelFieldHtmlInputType,
    updateCmsSectionCustomFieldValue,
    getCmsReusableSourceLabel,
    getCmsPageSectionStyle,
    getCmsPreviewDiffStatusStyle,
    getCmsPreviewDiffStatusLabel,
    getCmsPreviewDiffChangeCount,
    getCmsPreviewDiffPageLabel,
    getCmsPreviewDiffPagePath,
    getCmsLocaleCoverageStatusStyle,
    getCmsLocaleCoverageSummaryLabel,
    getCmsLocaleCoverageStatusLabel,
    getCmsLocaleCoverageCategoryLabel,
    getCmsLocaleCoverageLocaleLabel,
    toCmsDiagnosticsListItems,
    openBlocksPreviewInWindow: () => openCmsDesignerPreviewInWindow('blocks'),
  }),
}))
const cmsPreviewSourceOptions = computed(() => ([
  { label: tr('Draft', 'Rascunho'), value: 'draft' },
  { label: tr('Published', 'Publicado'), value: 'published' },
]))
const cmsPreviewViewportOptions = computed(() => ([
  { label: tr('Desktop', 'Desktop'), value: 'desktop' },
  { label: tr('Tablet', 'Tablet'), value: 'tablet' },
  { label: tr('Mobile', 'Mobile'), value: 'mobile' },
]))
const cmsLocaleCoverageCategories: CmsLocaleCoverageCategory[] = ['pages', 'fields', 'reusable-content']
const cmsMediaAssetKindOptions = computed(() => ([
  { label: tr('Image', 'Imagem'), value: 'image' },
  { label: tr('Video', 'Video'), value: 'video' },
  { label: tr('Icon', 'Icone'), value: 'icon' },
  { label: tr('Document', 'Documento'), value: 'document' },
  { label: tr('Other', 'Outro'), value: 'other' },
]))
const initialThemePresets = getCurrentThemePresets()
const selectedThemePreset = ref<CmsThemePresetId>(
  resolveCmsSelectedThemePresetId(settings.value, initialThemePresets, defaultTheme)
)
settings.value.themePresetId = selectedThemePreset.value
const defaultCmsLayoutBreakpointLgPx = parseBreakpointToken(defaultTheme.cmsLayoutBreakpointLg, 1280)
const defaultCmsLayoutBreakpointMdPx = parseBreakpointToken(defaultTheme.cmsLayoutBreakpointMd, 1024)

const cmsLayoutBreakpointLgPx = computed(() => {
  return parseBreakpointToken(
    settings.value.theme.cmsLayoutBreakpointLg || defaultTheme.cmsLayoutBreakpointLg,
    defaultCmsLayoutBreakpointLgPx
  )
})

const cmsLayoutBreakpointMdPx = computed(() => {
  return parseBreakpointToken(
    settings.value.theme.cmsLayoutBreakpointMd || defaultTheme.cmsLayoutBreakpointMd,
    defaultCmsLayoutBreakpointMdPx
  )
})

const cmsViewportWidthPx = computed(() => resolveViewportWidth($q.screen.width, cmsLayoutBreakpointLgPx.value + 1))

const cmsViewportClasses = computed(() => ({
  'cms-shell-page--lg-compact': cmsViewportWidthPx.value <= cmsLayoutBreakpointLgPx.value,
  'cms-shell-page--md-compact': cmsViewportWidthPx.value <= cmsLayoutBreakpointMdPx.value,
}))

const tenantProfileOptions = computed(() => {
  return tenantProfilesState.value.profiles.map(profile => ({
    label: profile.name,
    value: profile.id,
  }))
})
const activeTenantProfileName = computed(() => {
  return tenantProfilesState.value.profiles.find(profile => profile.id === activeTenantProfileId.value)?.name
    ?? (resolveCmsLocale(settings.value.content.locale) === 'pt-BR' ? 'Tenant atual' : 'Current Tenant')
})

const themeFields = createThemeFields(defaultTheme)

function getGroupThemeFields(groupId: ThemeFieldGroup): ThemeField[] {
  return getThemeFieldsByGroup(themeFields, groupId, showAdvancedThemeFields.value)
}

function getGroupThemeFieldSections(groupId: ThemeFieldGroup): ThemeFieldSection[] {
  return getThemeFieldSections(groupId, getGroupThemeFields(groupId))
}

const typographyFieldGroups = computed(() => {
  return typographyFieldGroupsDefinition.map(group => ({
    ...group,
    fields: getGroupThemeFields(group.id),
  }))
})

const layoutFieldGroups = computed(() => {
  return layoutFieldGroupsDefinition.map(group => ({
    ...group,
    fields: getGroupThemeFields(group.id),
  }))
})

const colorFieldGroups = computed(() => {
  return colorFieldGroupsDefinition.map(group => ({
    ...group,
    fields: getGroupThemeFields(group.id),
    sections: getGroupThemeFieldSections(group.id),
  }))
})

const themePresets = computed(() => getCurrentThemePresets())

const themePresetOptions = computed(() => {
  const baseOptions = themePresets.value.map(preset => ({ label: preset.label, value: preset.id }))
  if (selectedThemePreset.value === 'custom') {
    return [...baseOptions, { label: 'Custom', value: 'custom' as CmsThemePresetId }]
  }
  return baseOptions
})

const activeThemePreset = computed(() => {
  return themePresets.value.find(preset => preset.id === selectedThemePreset.value)
})

const activeThemePresetLabel = computed(() => {
  return activeThemePreset.value?.label ?? 'Custom theme'
})

const activeThemePresetDescription = computed(() => {
  return activeThemePreset.value?.description ?? 'Custom values from manual token editing.'
})

const cmsResolvedAuthoringTheme = computed(() => createCmsAuthoringShellTheme(settings.value.theme, defaultTheme))

const shellSnapshot = computed(() => {
  return mapWhiteLabelToShellSnapshot({
    ...settings.value,
    theme: cmsResolvedAuthoringTheme.value,
  }, {
    activeItem: activeMenuId.value,
    searchValue: isPagesModule.value || isBlocksModule.value
      ? ''
      : searchQuery.value,
  })
})

const cmsTemplateMenuItems = computed<TemplateMenuItem[]>(() => {
  const groupLabels = new Map(settings.value.navGroups.map(group => [group.id, group.label]))

  return shellSnapshot.value.filteredItems.map(item => ({
    id: item.id,
    text: item.label,
    caption: item.caption,
    icon: item.icon,
    groupId: item.group,
    groupLabel: settings.value.layout.showGroupCaptions ? groupLabels.get(item.group) || '' : '',
    badge: item.badge,
  }))
})

const activeShellItem = computed(() => {
  return shellSnapshot.value.filteredItems.find(item => item.id === activeMenuId.value)
    ?? settings.value.items.find(item => item.id === activeMenuId.value)
    ?? shellSnapshot.value.filteredItems[0]
    ?? settings.value.items[0]
    ?? {
      id: defaultMenuId,
      group: '',
      label: tr('Settings', 'Configuracoes'),
      icon: 'settings',
      caption: '',
      description: settings.value.content.moduleFallbackDescription,
    }
})

const cmsShellHeaderActions = computed<AppShellAction[]>(() => {
  return shellSnapshot.value.shellConfig.toolbarActions.filter(action => {
    const normalizedId = String(action.id ?? '').trim().toLowerCase()
    return normalizedId !== 'account'
  })
})

const cmsShellUserName = computed(() => governanceActor.name || 'CMS Admin')
const cmsShellUserInitials = computed(() => {
  return (governanceActor.name || 'CMS Admin')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'CA'
})

const accentColor = computed(() => settings.value.theme.itemActiveColor || defaultTheme.itemActiveColor || '')
const accentSoftBackground = computed(() => {
  return settings.value.theme.itemHoverBackground || defaultTheme.itemHoverBackground || ''
})
const accentTextColor = computed(() => {
  return settings.value.theme.itemHoverColor || settings.value.theme.itemActiveColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || ''
})

const notificationSuccessColor = computed(() => {
  return settings.value.theme.notificationSuccessColor || defaultTheme.notificationSuccessColor || semanticColors.successPrimary
})

const notificationWarningColor = computed(() => {
  return settings.value.theme.notificationWarningColor || defaultTheme.notificationWarningColor || semanticColors.warningPrimary
})

const notificationErrorColor = computed(() => {
  return settings.value.theme.notificationErrorColor || defaultTheme.notificationErrorColor || semanticColors.errorPrimary
})

const notificationInfoColor = computed(() => {
  return settings.value.theme.notificationInfoColor || defaultTheme.notificationInfoColor || semanticColors.infoPrimary
})

const notificationBadgeColor = computed(() => {
  return (
    settings.value.theme.notificationBadgeColor ||
    defaultTheme.notificationBadgeColor ||
    notificationErrorColor.value
  )
})

const notificationBadgeTextColor = computed(() => {
  return settings.value.theme.notificationBadgeTextColor || defaultTheme.notificationBadgeTextColor || 'var(--ntk-text-inverse)'
})

const notificationIconColor = computed(() => {
  return (
    settings.value.theme.notificationIconColor ||
    defaultTheme.notificationIconColor ||
    settings.value.theme.toolbarButtonColor ||
    defaultTheme.toolbarButtonColor ||
    'var(--ntk-text-secondary)'
  )
})

const notificationSuccessTextColor = computed(() => {
  return (
    settings.value.theme.notificationSuccessTextColor ||
    notificationBadgeTextColor.value ||
    defaultTheme.notificationSuccessTextColor ||
    notificationBadgeTextColor.value ||
    'var(--ntk-text-inverse)'
  )
})

const notificationWarningTextColor = computed(() => {
  return (
    settings.value.theme.notificationWarningTextColor ||
    notificationBadgeTextColor.value ||
    defaultTheme.notificationWarningTextColor ||
    notificationBadgeTextColor.value ||
    'var(--ntk-text-primary)'
  )
})

const notificationErrorTextColor = computed(() => {
  return (
    settings.value.theme.notificationErrorTextColor ||
    notificationBadgeTextColor.value ||
    defaultTheme.notificationErrorTextColor ||
    notificationBadgeTextColor.value ||
    'var(--ntk-text-inverse)'
  )
})

const notificationInfoTextColor = computed(() => {
  return (
    settings.value.theme.notificationInfoTextColor ||
    notificationBadgeTextColor.value ||
    defaultTheme.notificationInfoTextColor ||
    notificationBadgeTextColor.value ||
    'var(--ntk-text-inverse)'
  )
})

const resolvedBorderWidth = computed(() => {
  return settings.value.theme.borderWidth || defaultTheme.borderWidth || '1px'
})

const cmsStyleVars = computed<Record<string, string>>(() => createCmsAuthoringStyleVars({
  authoringTheme: cmsResolvedAuthoringTheme.value,
  defaultTheme,
  headerHeight: shellSnapshot.value.shellConfig.headerHeight ?? 60,
  layoutBreakpointLgPx: cmsLayoutBreakpointLgPx.value,
  layoutBreakpointMdPx: cmsLayoutBreakpointMdPx.value,
  notificationSuccessColor: notificationSuccessColor.value,
  notificationWarningColor: notificationWarningColor.value,
  notificationErrorColor: notificationErrorColor.value,
  notificationInfoColor: notificationInfoColor.value,
  notificationBadgeColor: notificationBadgeColor.value,
  notificationBadgeTextColor: notificationBadgeTextColor.value,
  notificationIconColor: notificationIconColor.value,
  notificationSuccessTextColor: notificationSuccessTextColor.value,
  notificationWarningTextColor: notificationWarningTextColor.value,
  notificationErrorTextColor: notificationErrorTextColor.value,
  notificationInfoTextColor: notificationInfoTextColor.value,
}))

const bannerStyle = computed(() => createCmsAccentSurfaceStyle({
  accentColor: accentColor.value,
  accentSoftBackground: accentSoftBackground.value,
  accentTextColor: accentTextColor.value,
  borderWidth: resolvedBorderWidth.value,
}))

const statusChipStyle = computed(() => createCmsAccentSurfaceStyle({
  accentColor: accentColor.value,
  accentSoftBackground: accentSoftBackground.value,
  accentTextColor: accentTextColor.value,
  borderWidth: resolvedBorderWidth.value,
}))

const previewChipStyle = computed(() => createCmsAccentSurfaceStyle({
  accentColor: accentColor.value,
  accentSoftBackground: accentSoftBackground.value,
  accentTextColor: accentTextColor.value,
  borderWidth: resolvedBorderWidth.value,
}))

const primaryActionStyle = computed(() => createCmsPrimaryActionStyle({
  accentColor: accentColor.value,
  textColor: notificationBadgeTextColor.value,
}))

const warningActionStyle = computed(() => createCmsTextActionStyle(notificationWarningColor.value))

const dangerActionStyle = computed(() => createCmsTextActionStyle(notificationErrorColor.value))

const notificationChipStyles = computed(() => createCmsNotificationChipStyles({
  notificationSuccessColor: notificationSuccessColor.value,
  notificationWarningColor: notificationWarningColor.value,
  notificationErrorColor: notificationErrorColor.value,
  notificationInfoColor: notificationInfoColor.value,
  notificationBadgeColor: notificationBadgeColor.value,
  notificationBadgeTextColor: notificationBadgeTextColor.value,
  notificationIconColor: notificationIconColor.value,
  notificationSuccessTextColor: notificationSuccessTextColor.value,
  notificationWarningTextColor: notificationWarningTextColor.value,
  notificationErrorTextColor: notificationErrorTextColor.value,
  notificationInfoTextColor: notificationInfoTextColor.value,
}))

const notificationBellPreviewStyle = computed(() => createCmsTextActionStyle(notificationIconColor.value))

/**
 * Resolves inline chip styles for diagnostics based on severity.
 */
function getCmsDiagnosticStyle(
  severity:
    | CmsMediaDiagnostic['severity']
    | CmsReleaseValidationIssue['severity']
    | CmsContentValidationIssue['severity']
): Record<string, string> {
  if (severity === 'error') {
    return {
      background: notificationErrorColor.value,
      color: notificationErrorTextColor.value,
    }
  }

  return {
    background: notificationWarningColor.value,
    color: notificationWarningTextColor.value,
  }
}

/**
 * Resolves inline chip styles for draft/published review statuses.
 */
function getCmsPreviewDiffStatusStyle(status: CmsPreviewDiffStatus): Record<string, string> {
  if (status === 'added') {
    return {
      background: notificationSuccessColor.value,
      color: notificationSuccessTextColor.value,
    }
  }

  if (status === 'removed') {
    return {
      background: notificationErrorColor.value,
      color: notificationErrorTextColor.value,
    }
  }

  if (status === 'changed') {
    return {
      background: notificationWarningColor.value,
      color: notificationWarningTextColor.value,
    }
  }

  return {
    background: accentSoftBackground.value,
    color: accentTextColor.value,
    border: `${resolvedBorderWidth.value} solid ${notificationInfoColor.value}`,
  }
}

/**
 * Returns a localized label for one draft/published review status.
 */
function getCmsPreviewDiffStatusLabel(status: CmsPreviewDiffStatus): string {
  if (status === 'added') {
    return tr('Added', 'Adicionada')
  }

  if (status === 'removed') {
    return tr('Removed', 'Removida')
  }

  if (status === 'changed') {
    return tr('Changed', 'Alterada')
  }

  return tr('Unchanged', 'Sem mudanca')
}

/**
 * Returns the number of effective changes inside one diff summary.
 */
function getCmsPreviewDiffChangeCount(summary: {
  added: number
  removed: number
  changed: number
}): number {
  return summary.added + summary.removed + summary.changed
}

/**
 * Returns the best available page title for one diff entry.
 */
function getCmsPreviewDiffPageLabel(page: CmsPreviewPageDiffSummary): string {
  return page.draftTitle || page.publishedTitle || page.pageId
}

/**
 * Returns the best available page path for one diff entry.
 */
function getCmsPreviewDiffPagePath(page: CmsPreviewPageDiffSummary): string {
  return page.draftPath || page.publishedPath || ''
}

function getCmsLocaleCoverageStatusStyle(status: CmsLocaleCoverageStatus): Record<string, string> {
  if (status === 'complete') {
    return {
      background: notificationSuccessColor.value,
      color: notificationSuccessTextColor.value,
    }
  }

  if (status === 'partial') {
    return {
      background: notificationWarningColor.value,
      color: notificationWarningTextColor.value,
    }
  }

  if (status === 'empty') {
    return {
      background: notificationErrorColor.value,
      color: notificationErrorTextColor.value,
    }
  }

  return {
    background: accentSoftBackground.value,
    color: accentTextColor.value,
    border: `${resolvedBorderWidth.value} solid ${notificationInfoColor.value}`,
  }
}

function getCmsLocaleCoverageStatusLabel(status: CmsLocaleCoverageStatus): string {
  if (status === 'complete') {
    return tr('Complete', 'Completo')
  }

  if (status === 'partial') {
    return tr('Partial', 'Parcial')
  }

  if (status === 'empty') {
    return tr('Missing', 'Faltando')
  }

  return tr('N/A', 'N/A')
}

function getCmsLocaleCoverageCategoryLabel(category: CmsLocaleCoverageCategory): string {
  if (category === 'pages') {
    return tr('Pages', 'Paginas')
  }

  if (category === 'fields') {
    return tr('Fields', 'Campos')
  }

  return tr('Reusable content', 'Conteudo reutilizavel')
}

function getCmsLocaleCoverageLocaleLabel(locale: CmsLocale): string {
  return locale === 'pt-BR' ? 'PT-BR' : 'EN'
}

function getCmsLocaleCoverageSummaryLabel(summary: CmsLocaleCoverageSummary | null): string {
  if (!summary) {
    return tr('No locale coverage available.', 'Nenhuma cobertura de locale disponivel.')
  }

  return tr(
    `${summary.covered} of ${summary.total} items covered`,
    `${summary.covered} de ${summary.total} itens cobertos`
  )
}

const notificationCounterPreviewStyle = computed(() => ({
  background: notificationBadgeColor.value,
  color: notificationBadgeTextColor.value,
}))

const semanticNotificationOverrides = computed(() => ({
  successPrimary: notificationSuccessColor.value,
  successBorder: notificationSuccessColor.value,
  warningPrimary: notificationWarningColor.value,
  warningBorder: notificationWarningColor.value,
  errorPrimary: notificationErrorColor.value,
  errorBorder: notificationErrorColor.value,
  infoPrimary: notificationInfoColor.value,
  infoBorder: notificationInfoColor.value,
  successText: notificationSuccessTextColor.value,
  warningText: notificationWarningTextColor.value,
  errorText: notificationErrorTextColor.value,
  infoText: notificationInfoTextColor.value,
  positive: notificationSuccessColor.value,
  negative: notificationErrorColor.value,
}))

const quasarBrandOverrides = computed<QuasarBrandOverrides>(() => ({
  primary: accentColor.value || defaultTheme.itemActiveColor || 'var(--ntk-primary)',
  secondary: accentTextColor.value || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || 'var(--ntk-secondary)',
  accent: accentColor.value || defaultTheme.itemActiveColor || 'var(--ntk-primary)',
  positive: notificationSuccessColor.value,
  warning: notificationWarningColor.value,
  negative: notificationErrorColor.value,
  info: notificationInfoColor.value,
}))

/**
 * Applies quasar brand overrides.
 */
function applyQuasarBrandOverrides(brand: QuasarBrandOverrides): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.style.setProperty('--q-primary', brand.primary)
  root.style.setProperty('--q-secondary', brand.secondary)
  root.style.setProperty('--q-accent', brand.accent)
  root.style.setProperty('--q-positive', brand.positive)
  root.style.setProperty('--q-warning', brand.warning)
  root.style.setProperty('--q-negative', brand.negative)
  root.style.setProperty('--q-info', brand.info)
}

const groupOptions = computed(() => {
  return settings.value.navGroups.map(group => ({
    label: group.label,
    value: group.id,
  }))
})

const previewActiveItemId = computed(() => {
  return settings.value.items.find(item => item.id === activeMenuId.value)?.id
    ?? settings.value.items[0]?.id
    ?? ''
})

const menuPreviewGroups = computed(() => {
  return settings.value.navGroups
    .map(group => ({
      ...group,
      items: settings.value.items
        .filter(item => item.group === group.id)
        .slice(0, 4),
    }))
    .filter(group => group.items.length > 0)
})

const toolbarPreviewActions = computed(() => {
  const actions = settings.value.toolbarActions
    .filter(action => {
      const normalizedId = String(action.id ?? '').trim().toLowerCase()
      const normalizedIcon = String(action.icon ?? '').trim().toLowerCase()
      const isNotificationAction = normalizedId === 'notifications' || normalizedIcon === 'notifications'
      const isAccountAction = normalizedId === 'account' || normalizedIcon === 'account_circle'

      if (!settings.value.layout.showNotifications && isNotificationAction) {
        return false
      }

      if (!settings.value.layout.showUserAvatar && isAccountAction) {
        return false
      }

      return true
    })
    .slice(0, 4)
  if (actions.length > 0) {
    return actions
  }
  return [
    {
      id: 'preview-action',
      icon: 'bolt',
      label: tr('Action', 'Acao'),
      showLabel: true,
    },
  ]
})

const settingsModuleId = computed(() => {
  return settings.value.items.find(item => item.id === defaultSettingsModuleId)?.id
    ?? settings.value.items.find(item => item.icon === 'settings')?.id
    ?? defaultSettingsModuleId
})

const isSettingsModule = computed(() => activeMenuId.value === settingsModuleId.value)
const pagesModuleId = computed(() => {
  return settings.value.items.find(item => item.id === 'pages')?.id
    ?? settings.value.items.find(item => item.icon === 'description')?.id
    ?? defaultPagesModuleId
})
const isPagesModule = computed(() => activeMenuId.value === pagesModuleId.value)
const blocksModuleId = computed(() => {
  return settings.value.items.find(item => item.id === 'blocks')?.id
    ?? settings.value.items.find(item => item.icon === 'widgets')?.id
    ?? defaultBlocksModuleId
})
const mediaModuleId = computed(() => {
  return settings.value.items.find(item => item.id === 'media')?.id
    ?? settings.value.items.find(item => item.icon === 'photo_library')?.id
    ?? defaultMediaModuleId
})
const releasesModuleId = computed(() => {
  return settings.value.items.find(item => item.id === 'releases')?.id
    ?? settings.value.items.find(item => item.icon === 'rocket_launch')?.id
    ?? defaultReleasesModuleId
})
const isBlocksModule = computed(() => activeMenuId.value === blocksModuleId.value)
const isMediaModule = computed(() => activeMenuId.value === mediaModuleId.value)
const isReleasesModule = computed(() => activeMenuId.value === releasesModuleId.value)

const governanceActor: CmsWhiteLabelActor = {
  id: 'cms-admin',
  role: 'admin',
  name: 'CMS Admin',
}

const releaseScheduleAt = ref('')
const releaseRollbackTargetId = ref('')
const releasePromotionTargetEnvironment = ref<CmsReleaseEnvironment | ''>('')
const releaseAcknowledgementDecision = ref<CmsReleaseReviewAcknowledgementDecision>('noted')
const releaseAcknowledgementNote = ref('')
const releaseDisplayLimit = 20

const activeReleaseEnvironment = computed<CmsReleaseEnvironment>({
  get: () => settings.value.releases.activeEnvironment ?? 'dev',
  set: value => {
    settings.value.releases.activeEnvironment = value
    const firstEntryInEnvironment = settings.value.releases.items.find(item => item.environment === value)
    if (firstEntryInEnvironment) {
      settings.value.releases.activeReleaseId = firstEntryInEnvironment.id
    }
  },
})

const releaseEnvironmentOptions = computed(() => ([
  { label: cmsUiText.value.environmentDevelopmentLabel, value: 'dev' },
  { label: cmsUiText.value.environmentStagingLabel, value: 'staging' },
  { label: cmsUiText.value.environmentProductionLabel, value: 'production' },
]))

const selectedReleaseId = computed<string>({
  get: () => {
    const activeReleaseId = settings.value.releases.activeReleaseId
    const currentEnvironment = activeReleaseEnvironment.value
    const activeRelease = settings.value.releases.items.find(item => item.id === activeReleaseId)
    if (activeRelease && activeRelease.environment === currentEnvironment) {
      return activeRelease.id
    }
    return settings.value.releases.items.find(item => item.environment === currentEnvironment)?.id ?? ''
  },
  set: value => {
    const nextId = String(value ?? '').trim()
    if (!nextId || !settings.value.releases.items.some(item => item.id === nextId && item.environment === activeReleaseEnvironment.value)) {
      settings.value.releases.activeReleaseId = settings.value.releases.items.find(item => item.environment === activeReleaseEnvironment.value)?.id ?? null
      return
    }
    settings.value.releases.activeReleaseId = nextId
  },
})

const releaseEntries = computed(() => settings.value.releases.items
  .filter(item => item.environment === activeReleaseEnvironment.value))
const releaseEntriesAll = computed(() => settings.value.releases.items)
const selectedRelease = computed(() => {
  return releaseEntries.value.find(item => item.id === selectedReleaseId.value) ?? null
})
const selectedReleaseAcknowledgements = computed<CmsReleaseReviewAcknowledgementEntry[]>(() => {
  const release = selectedRelease.value
  if (!release) {
    return []
  }

  return listCmsReleaseReviewAcknowledgements(
    settings.value.releases.reviewAcknowledgements,
    {
      releaseId: release.id,
      environment: activeReleaseEnvironment.value,
    }
  )
})
const selectedReleaseAcknowledgementSummary = computed<CmsReleaseReviewAcknowledgementSummary>(() => {
  const release = selectedRelease.value
  if (!release) {
    return {
      total: 0,
      approvedCount: 0,
      notedCount: 0,
      changesRequestedCount: 0,
      latestAcknowledgedAt: null,
    }
  }

  return summarizeCmsReleaseReviewAcknowledgements(settings.value.releases.reviewAcknowledgements, {
    releaseId: release.id,
    environment: activeReleaseEnvironment.value,
  })
})
const releaseCountLabel = computed(() => cmsUiText.value.releaseCountLabel(releaseEntries.value.length))
const releaseOptions = computed(() => releaseEntries.value.map(item => ({
  label: `${item.name} (${item.status})`,
  value: item.id,
})))
const rollbackTargetOptions = computed(() => releaseEntries.value
  .filter(item => item.id !== selectedReleaseId.value)
  .map(item => ({
    label: `${item.name} (${item.status})`,
    value: item.id,
  })))
const promotionTargetEnvironmentOptions = computed(() => releaseEnvironmentOptions.value
  .filter(option => option.value !== activeReleaseEnvironment.value))
const releaseTimelineEntries = computed(() => releaseEntries.value.slice(0, releaseDisplayLimit))
const scheduledReleaseCalendarEntries = computed(() => releaseEntries.value
  .filter(item => item.status === 'scheduled' && Boolean(item.scheduledAt))
  .sort((left, right) => new Date(left.scheduledAt ?? '').getTime() - new Date(right.scheduledAt ?? '').getTime()))
const releaseCalendarConflicts = computed(() => detectCmsReleaseCalendarConflicts(settings.value.releases)
  .filter(conflict => conflict.environment === activeReleaseEnvironment.value))
const releaseAcknowledgementDecisionOptions = computed(() => ([
  { label: tr('Noted', 'Registrado'), value: 'noted' },
  { label: tr('Approved', 'Aprovado'), value: 'approved' },
  { label: tr('Changes requested', 'Mudancas solicitadas'), value: 'changes_requested' },
]))

const selectedReleaseGateIssues = computed<CmsReleaseValidationIssue[]>(() => {
  const release = selectedRelease.value
  if (!release) {
    return []
  }

  const gate = validateCmsReleasePrePublishGate(settings.value.releases, release.id, {
    actorId: governanceActor.id,
    actorRole: governanceActor.role,
  })
  return gate.issues
})

const selectedReleaseCandidateChecklist = computed(() => {
  const release = selectedRelease.value
  if (!release) {
    return null
  }

  return buildCmsReleaseCandidateChecklist(settings.value.releases, release.id, {
    actorId: governanceActor.id,
    actorRole: governanceActor.role,
  })
})

/**
 * Resolves localized labels for release review checklist rows.
 */
function getReleaseChecklistItemLabel(itemId: CmsReleaseCandidateChecklistItemId): string {
  switch (itemId) {
    case 'candidate_state':
      return tr('Candidate state', 'Estado do candidato')
    case 'validation':
      return tr('Validation report', 'Relatorio de validacao')
    case 'workflow':
      return tr('Workflow readiness', 'Prontidao do workflow')
    case 'permissions':
      return tr('Publish permissions', 'Permissoes de publicacao')
    case 'content_integrity':
      return tr('Content integrity', 'Integridade do conteudo')
    case 'content_qa':
      return tr('Accessibility and content QA', 'Acessibilidade e QA de conteudo')
    case 'brand_assets':
      return tr('Brand assets', 'Assets da marca')
    default:
      return itemId
  }
}

/**
 * Builds localized helper copy for one release checklist row.
 */
function getReleaseChecklistItemDescription(item: CmsReleaseCandidateChecklistItem): string {
  switch (item.id) {
    case 'candidate_state':
      if (item.releaseStatus === 'published') {
        return tr(
          'This release is already published. Review remains available for comparison only.',
          'Este release ja esta publicado. A revisao permanece apenas para comparacao.'
        )
      }
      if (item.releaseStatus === 'scheduled') {
        return tr(
          'Scheduled releases stay reviewable but cannot publish before the configured schedule.',
          'Releases agendados continuam revisaveis, mas nao podem publicar antes do horario configurado.'
        )
      }
      if (item.releaseStatus === 'rolled_back' || item.releaseStatus === 'canceled') {
        return tr(
          'Create a new draft before attempting another publish.',
          'Crie um novo rascunho antes de tentar outra publicacao.'
        )
      }
      return tr(
        'The selected release can continue through validation, scheduling and publish checks.',
        'O release selecionado pode seguir pelas etapas de validacao, agendamento e publicacao.'
      )
    case 'validation':
      if (item.status === 'blocking' && item.issueCount === 1 && item.issues[0]?.code === 'release.validation.required') {
        return tr(
          'Run Validate to generate a current report before publishing.',
          'Execute Validar para gerar um relatorio atual antes de publicar.'
        )
      }
      if (item.status === 'warning') {
        return tr(
          'The latest validation passed with warnings that should be reviewed.',
          'A ultima validacao passou com avisos que devem ser revisados.'
        )
      }
      return tr(
        'Snapshot validation tracks schema, content and media consistency for this release.',
        'A validacao do snapshot acompanha consistencia de schema, conteudo e midia deste release.'
      )
    case 'workflow':
      return tr(
        'Workflow status should be approved, scheduled or published before production publish.',
        'O status do workflow deve estar aprovado, agendado ou publicado antes da publicacao em producao.'
      )
    case 'permissions':
      return tr(
        'Environment policies and runtime roles are checked against the acting author before publish.',
        'Politicas do ambiente e papeis de runtime sao verificados contra o autor em acao antes da publicacao.'
      )
    case 'content_integrity':
      return tr(
        'Aggregates page, section, block, schema and reference diagnostics from the release snapshot.',
        'Agrupa diagnosticos de paginas, secoes, blocos, schema e referencias do snapshot do release.'
      )
    case 'content_qa':
      return tr(
        'Highlights editorial and accessibility gaps such as missing page summaries and image alt text.',
        'Destaca lacunas editoriais e de acessibilidade, como resumos de pagina ausentes e texto alternativo de imagem.'
      )
    case 'brand_assets':
      return item.environment === 'production'
        ? tr(
          'Production releases require brand logo and favicon bindings to be present.',
          'Releases de producao exigem logo e favicon da marca configurados.'
        )
        : tr(
          'Brand assets are enforced only for production releases.',
          'Assets da marca sao obrigatorios apenas para releases de producao.'
        )
    default:
      return ''
  }
}

/**
 * Resolves visual treatment for release checklist status chips.
 */
function getReleaseChecklistStatusStyle(status: CmsReleaseCandidateChecklistStatus): Record<string, string> {
  switch (status) {
    case 'ready':
      return {
        background: notificationSuccessColor.value,
        color: notificationSuccessTextColor.value,
      }
    case 'warning':
      return {
        background: notificationWarningColor.value,
        color: notificationWarningTextColor.value,
      }
    case 'blocking':
    default:
      return {
        background: notificationErrorColor.value,
        color: notificationErrorTextColor.value,
      }
  }
}

/**
 * Resolves localized labels for checklist semantic states.
 */
function getReleaseChecklistStatusLabel(status: CmsReleaseCandidateChecklistStatus): string {
  switch (status) {
    case 'ready':
      return tr('Ready', 'Pronto')
    case 'warning':
      return tr('Review', 'Revisar')
    case 'blocking':
    default:
      return tr('Blocking', 'Bloqueando')
  }
}

/**
 * Resolves drill-down navigation actions for one checklist row.
 */
function getReleaseChecklistDrilldownActions(
  item: Pick<CmsReleaseCandidateChecklistItem, 'id' | 'issues'>
): CmsReleaseChecklistDrilldownAction[] {
  return resolveCmsReleaseChecklistDrilldownActions(item)
}

/**
 * Indicates whether a checklist row should expose the validate shortcut.
 */
function hasReleaseChecklistValidationShortcut(item: Pick<CmsReleaseCandidateChecklistItem, 'id' | 'issues'>): boolean {
  return item.id === 'validation'
    && item.issues.some(issue => issue.code === 'release.validation.required')
}

/**
 * Builds localized button labels for release checklist drill-down actions.
 */
function getReleaseChecklistDrilldownLabel(action: CmsReleaseChecklistDrilldownAction): string {
  if (action.target === 'branding') {
    return tr('Open Branding', 'Abrir branding')
  }

  if (action.target === 'content') {
    return tr('Open Content', 'Abrir conteudo')
  }

  if (action.target === 'media') {
    return tr('Open Media', 'Abrir midia')
  }

  if (action.target === 'releases') {
    return tr('Open Releases', 'Abrir releases')
  }

  const page = action.pageId
    ? settings.value.pages.find(entry => entry.id === action.pageId)
    : null
  const section = action.sectionId && page
    ? page.sections.find(entry => entry.id === action.sectionId)
    : null

  if (action.target === 'blocks') {
    if (page && section) {
      return tr(
        `Open Blocks: ${page.title} -> ${section.label}`,
        `Abrir blocos: ${page.title} -> ${section.label}`
      )
    }

    if (page) {
      return tr(`Open Blocks: ${page.title}`, `Abrir blocos: ${page.title}`)
    }

    return tr('Open Blocks', 'Abrir blocos')
  }

  if (page) {
    return tr(`Open Pages: ${page.title}`, `Abrir paginas: ${page.title}`)
  }

  return tr('Open Pages', 'Abrir paginas')
}

/**
 * Executes the validate shortcut from the release checklist.
 */
function runReleaseChecklistValidationShortcut(item: Pick<CmsReleaseCandidateChecklistItem, 'id' | 'issues'>): void {
  if (!hasReleaseChecklistValidationShortcut(item)) {
    return
  }

  validateSelectedReleaseEntry()
}

/**
 * Resolves localized labels for review-hub cards in Releases.
 */
function getReleaseReviewHubCardLabel(cardId: CmsReleaseReviewHubCard['id']): string {
  switch (cardId) {
    case 'changes':
      return tr('Changes', 'Mudancas')
    case 'locales':
      return tr('Locale coverage', 'Cobertura de locales')
    case 'checklist':
    default:
      return tr('Checklist', 'Checklist')
  }
}

/**
 * Resolves concise helper copy for one Releases review-hub card.
 */
function getReleaseReviewHubCardDescription(card: CmsReleaseReviewHubCard): string {
  if (!selectedReleaseReviewHub.value) {
    return ''
  }

  if (card.id === 'changes') {
    if (!selectedReleaseReviewHub.value.diff.hasPublishedBaseline) {
      return tr(
        'No published baseline exists yet for this environment.',
        'Ainda nao existe baseline publicada para este ambiente.'
      )
    }

    if (!selectedReleaseReviewHub.value.diff.hasChanges) {
      return tr(
        'Draft matches the selected published baseline.',
        'O draft esta igual a baseline publicada selecionada.'
      )
    }

    return selectedReleaseReviewHub.value.diff.topChangedPageTitles.join(' · ')
  }

  if (card.id === 'locales') {
    if (selectedReleaseReviewHub.value.locales.missingEntries === 0) {
      return tr(
        'All reviewed locales have explicit authored coverage.',
        'Todos os locales revisados possuem cobertura autorada explicita.'
      )
    }

    return selectedReleaseReviewHub.value.locales.topMissingEntries
      .map(entry => `${getCmsLocaleCoverageLocaleLabel(entry.locale)} · ${entry.label} · ${entry.fieldLabel}`)
      .join(' · ')
  }

  if (selectedReleaseReviewHub.value.checklist.topIssueMessages.length === 0) {
    return tr(
      'No blocking checklist issues remain for this candidate.',
      'Nao restam problemas bloqueantes no checklist deste candidato.'
    )
  }

  return selectedReleaseReviewHub.value.checklist.topIssueMessages.join(' · ')
}

/**
 * Resolves metric labels for Releases review-hub cards.
 */
function getReleaseReviewHubMetricLabel(
  cardId: CmsReleaseReviewHubCard['id'],
  metricId: string
): string {
  if (cardId === 'changes') {
    if (metricId === 'pages') {
      return tr('Pages', 'Paginas')
    }

    if (metricId === 'sections') {
      return tr('Sections', 'Secoes')
    }

    return tr('Blocks', 'Blocos')
  }

  if (cardId === 'locales') {
    if (metricId === 'locales') {
      return tr('Locales', 'Locales')
    }

    if (metricId === 'complete') {
      return tr('Complete', 'Completos')
    }

    return tr('Missing', 'Faltando')
  }

  if (metricId === 'ready') {
    return tr('Ready', 'Prontos')
  }

  if (metricId === 'warning') {
    return tr('Review', 'Revisar')
  }

  return tr('Blocking', 'Bloqueando')
}

/**
 * Resolves localized labels for governance-hub cards in Releases.
 */
function getGovernanceHubCardLabel(cardId: CmsGovernanceHubCard['id']): string {
  switch (cardId) {
    case 'workflow':
      return tr('Workflow', 'Workflow')
    case 'revisions':
      return tr('Revisions', 'Revisoes')
    case 'audit':
      return tr('Audit trail', 'Trilha de auditoria')
    case 'roles':
    default:
      return tr('Role policies', 'Politicas de papel')
  }
}

/**
 * Resolves localized labels for governance workflow states.
 */
function getGovernanceWorkflowStatusLabel(status: CmsWhiteLabelSettings['governance']['workflow']['status']): string {
  switch (status) {
    case 'draft':
      return tr('Draft', 'Rascunho')
    case 'in_review':
      return tr('In review', 'Em revisao')
    case 'approved':
      return tr('Approved', 'Aprovado')
    case 'scheduled':
      return tr('Scheduled', 'Agendado')
    case 'published':
      return tr('Published', 'Publicado')
    default:
      return status
  }
}

/**
 * Resolves localized labels for governance workflow actions.
 */
function getGovernanceActionLabel(action: CmsWhiteLabelWorkflowAction): string {
  switch (action) {
    case 'save_draft':
      return tr('Save draft', 'Salvar rascunho')
    case 'submit_review':
      return tr('Submit review', 'Enviar para revisao')
    case 'approve':
      return tr('Approve', 'Aprovar')
    case 'request_changes':
      return tr('Request changes', 'Solicitar mudancas')
    case 'schedule_publish':
      return tr('Schedule publish', 'Agendar publicacao')
    case 'publish':
      return tr('Publish', 'Publicar')
    case 'rollback':
      return tr('Rollback', 'Rollback')
    case 'reset_defaults':
      return tr('Reset defaults', 'Restaurar padroes')
    case 'import_settings':
    default:
      return tr('Import settings', 'Importar configuracoes')
  }
}

/**
 * Resolves localized labels for governance actor roles.
 */
function getGovernanceRoleLabel(role: CmsWhiteLabelSettings['governance']['workflow']['lastActionRole']): string {
  switch (role) {
    case 'owner':
      return tr('Owner', 'Owner')
    case 'admin':
      return tr('Admin', 'Admin')
    case 'editor':
      return tr('Editor', 'Editor')
    case 'reviewer':
      return tr('Reviewer', 'Revisor')
    case 'publisher':
      return tr('Publisher', 'Publicador')
    case 'viewer':
      return tr('Viewer', 'Leitor')
    case 'system':
    default:
      return tr('System', 'Sistema')
  }
}

/**
 * Builds concise helper copy for one Releases governance-hub card.
 */
function getGovernanceHubCardDescription(card: CmsGovernanceHubCard): string {
  if (card.id === 'workflow') {
    const workflow = cmsGovernanceHubSummary.value.workflow
    return `${getGovernanceWorkflowStatusLabel(workflow.workflowStatus)} · v${workflow.version} · ${workflow.lastActionBy} · ${getGovernanceRoleLabel(workflow.lastActionRole)}`
  }

  if (card.id === 'revisions') {
    const latestRevision = cmsGovernanceHubSummary.value.revisions.recent[0]
    if (!latestRevision) {
      return tr(
        'No revisions recorded beyond the seed snapshot.',
        'Nenhuma revisao registrada alem do snapshot inicial.'
      )
    }

    return `${getGovernanceActionLabel(latestRevision.action)} · v${latestRevision.version} · ${latestRevision.by}`
  }

  if (card.id === 'audit') {
    const latestAudit = cmsGovernanceHubSummary.value.audit.recent[0]
    if (!latestAudit) {
      return tr(
        'No audit entries recorded yet for this tenant.',
        'Ainda nao existem entradas de auditoria registradas para este tenant.'
      )
    }

    return `${getGovernanceActionLabel(latestAudit.action)} · ${latestAudit.actorId} · ${getGovernanceRoleLabel(latestAudit.actorRole)}`
  }

  const policies = cmsGovernanceHubSummary.value.roles
  return `${policies.publishCapableCount} ${tr('publish-capable', 'com publicacao')} · ${policies.reviewCapableCount} ${tr('review-capable', 'com revisao')}`
}

/**
 * Resolves metric labels for Releases governance-hub cards.
 */
function getGovernanceHubMetricLabel(cardId: CmsGovernanceHubCard['id'], metricId: string): string {
  if (cardId === 'workflow') {
    if (metricId === 'version') {
      return tr('Version', 'Versao')
    }

    if (metricId === 'publishedVersion') {
      return tr('Published', 'Publicada')
    }

    return tr('Live', 'Ao vivo')
  }

  if (cardId === 'revisions') {
    if (metricId === 'count') {
      return tr('Total', 'Total')
    }

    if (metricId === 'published') {
      return tr('Published', 'Publicadas')
    }

    return tr('Recent', 'Recentes')
  }

  if (cardId === 'audit') {
    if (metricId === 'count') {
      return tr('Entries', 'Entradas')
    }

    if (metricId === 'actions') {
      return tr('Actions', 'Acoes')
    }

    return tr('Recent', 'Recentes')
  }

  if (metricId === 'count') {
    return tr('Policies', 'Politicas')
  }

  if (metricId === 'publish') {
    return tr('Publish', 'Publicar')
  }

  return tr('Review', 'Revisao')
}

/**
 * Resolves semantic status for one exported review package metadata row.
 */
function getReviewPackageHistoryStatus(entry: CmsReviewPackageHistoryEntry): CmsReleaseCandidateChecklistStatus {
  if (entry.checklistBlockingCount > 0) {
    return 'blocking'
  }

  if (entry.checklistWarningCount > 0) {
    return 'warning'
  }

  return 'ready'
}

/**
 * Builds concise release/package context text for one exported review package row.
 */
function getReviewPackageHistoryDescription(entry: CmsReviewPackageHistoryEntry): string {
  const exportTime = new Date(entry.exportedAt).toLocaleString()
  const baselineText = entry.publishedAt
    ? tr('published baseline available', 'baseline publicada disponivel')
    : tr('no published baseline yet', 'ainda sem baseline publicada')

  return `${entry.releaseName} · ${exportTime} · ${baselineText}`
}

/**
 * Resolves localized decision labels for one review acknowledgement row.
 */
function getReleaseAcknowledgementDecisionLabel(
  decision: CmsReleaseReviewAcknowledgementDecision
): string {
  switch (decision) {
    case 'approved':
      return tr('Approved', 'Aprovado')
    case 'changes_requested':
      return tr('Changes requested', 'Mudancas solicitadas')
    case 'noted':
    default:
      return tr('Noted', 'Registrado')
  }
}

/**
 * Resolves semantic styles for review acknowledgement decisions.
 */
function getReleaseAcknowledgementDecisionStyle(
  decision: CmsReleaseReviewAcknowledgementDecision
): Record<string, string> {
  if (decision === 'approved') {
    return {
      background: notificationSuccessColor.value,
      color: notificationSuccessTextColor.value,
    }
  }

  if (decision === 'changes_requested') {
    return {
      background: notificationErrorColor.value,
      color: notificationErrorTextColor.value,
    }
  }

  return {
    background: notificationInfoColor.value,
    color: notificationInfoTextColor.value,
  }
}

/**
 * Builds concise actor/timestamp helper copy for one acknowledgement row.
 */
function getReleaseAcknowledgementDescription(
  entry: CmsReleaseReviewAcknowledgementEntry
): string {
  const actorLabel = entry.actorName || entry.actorId
  const acknowledgedAt = formatReleaseTimestamp(entry.acknowledgedAt)

  return `${actorLabel} · ${entry.actorRole} · ${acknowledgedAt}`
}

/**
 * Formats ISO dates into datetime-local input values.
 */
function toDateTimeLocalValue(value: string | null): string {
  if (!value) {
    return ''
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }
  const pad = (item: number) => String(item).padStart(2, '0')
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`
}

/**
 * Formats release timestamps for timeline cards.
 */
function formatReleaseTimestamp(value: string | null): string {
  if (!value) {
    return cmsUiText.value.releaseNotSetLabel
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return cmsUiText.value.releaseInvalidDateLabel
  }
  return parsed.toLocaleString()
}

/**
 * Resolves semantic styles for release status chips.
 */
function getReleaseStatusStyle(status: CmsReleaseStatus): Record<string, string> {
  switch (status) {
    case 'published':
      return {
        background: notificationSuccessColor.value,
        color: notificationSuccessTextColor.value,
      }
    case 'validated':
      return {
        background: notificationInfoColor.value,
        color: notificationInfoTextColor.value,
      }
    case 'scheduled':
      return {
        background: accentSoftBackground.value,
        color: accentTextColor.value,
        border: `${resolvedBorderWidth.value} solid ${accentColor.value}`,
      }
    case 'rolled_back':
      return {
        background: notificationWarningColor.value,
        color: notificationWarningTextColor.value,
      }
    case 'canceled':
      return {
        background: settings.value.theme.pageBackground || defaultTheme.pageBackground || '',
        color: settings.value.theme.pageTextColor || defaultTheme.pageTextColor || '',
      }
    case 'draft':
    default:
      return {
        background: settings.value.theme.drawerBackground || defaultTheme.drawerBackground || '',
        color: settings.value.theme.drawerTextColor || defaultTheme.drawerTextColor || '',
      }
  }
}

/**
 * Applies release settings and keeps selected release id consistent.
 */
function applyReleaseSettings(nextReleases: CmsReleaseSettings): void {
  settings.value.releases = nextReleases
  if (!settings.value.releases.activeEnvironment) {
    settings.value.releases.activeEnvironment = 'dev'
  }

  const hasActiveRelease = Boolean(
    settings.value.releases.activeReleaseId
    && nextReleases.items.some(item => item.id === settings.value.releases.activeReleaseId)
  )

  if (!hasActiveRelease) {
    const firstInEnvironment = nextReleases.items.find(item => item.environment === settings.value.releases.activeEnvironment)
    const fallbackRelease = firstInEnvironment ?? nextReleases.items[0] ?? null
    settings.value.releases.activeReleaseId = fallbackRelease?.id ?? null
    if (fallbackRelease) {
      settings.value.releases.activeEnvironment = fallbackRelease.environment
    }
  }
}

/**
 * Commits release command result into settings and optional snapshot apply.
 */
function commitReleaseResult(
  result: ReturnType<typeof createCmsReleaseDraft>,
  successLabel: string,
  applySnapshot = false
): boolean {
  applyReleaseSettings(result.settings)
  if (!result.ok) {
    savedAtLabel.value = result.error ?? cmsUiText.value.releaseCommandFailedLabel
    return false
  }

  if (applySnapshot) {
    const latestPublishedReleaseId = result.publishedReleaseIds?.[result.publishedReleaseIds.length - 1] ?? null
    const snapshotToApply = result.snapshot
      ?? (result.releaseId ? result.settings.items.find(item => item.id === result.releaseId)?.snapshot : null)
      ?? (latestPublishedReleaseId
        ? result.settings.items.find(item => item.id === latestPublishedReleaseId)?.snapshot
        : null)

    if (snapshotToApply) {
      const withReleaseSnapshot = applyCmsReleaseSnapshot(settings.value, snapshotToApply)
      withReleaseSnapshot.releases = result.settings
      settings.value = normalizeCmsWhiteLabelSettings(withReleaseSnapshot)
      applySelectedThemePresetFromSettings()
      applyCmsFavicon(settings.value.branding.faviconUrl)
      if (!settings.value.items.some(item => item.id === activeMenuId.value)) {
        activeMenuId.value = settingsModuleId.value
      }
    }
  }

  if (result.releaseId) {
    settings.value.releases.activeReleaseId = result.releaseId
  }
  savedAtLabel.value = successLabel
  return true
}

/**
 * Creates a release draft from current tenant settings.
 */
function createReleaseDraftFromCurrentSettings(): void {
  const result = createCmsReleaseDraft(
    settings.value.releases,
    {
      snapshot: createCmsReleaseSnapshot(settings.value),
      workflowVersion: settings.value.governance.workflow.version,
      workflowStatus: settings.value.governance.workflow.status,
    },
    {
      actorId: governanceActor.id,
      actorRole: governanceActor.role,
      summary: `${cmsUiText.value.releaseDraftSummaryPrefix} ${activeTenantProfileName.value}`,
      environment: activeReleaseEnvironment.value,
    }
  )
  commitReleaseResult(result, cmsUiText.value.releaseDraftCreatedLabel)
}

/**
 * Validates selected release entry.
 */
function validateSelectedReleaseEntry(): void {
  if (!selectedReleaseId.value) {
    savedAtLabel.value = cmsUiText.value.selectReleaseFirstLabel
    return
  }

  const result = validateCmsRelease(
    settings.value.releases,
    selectedReleaseId.value,
    governanceActor.id,
    undefined,
    governanceActor.role
  )
  commitReleaseResult(result, cmsUiText.value.releaseValidatedLabel)
}

/**
 * Schedules selected release for future publication.
 */
function scheduleSelectedReleaseEntry(): void {
  if (!selectedReleaseId.value) {
    savedAtLabel.value = cmsUiText.value.selectReleaseFirstLabel
    return
  }
  if (!releaseScheduleAt.value) {
    savedAtLabel.value = cmsUiText.value.defineScheduleBeforeSchedulingLabel
    return
  }

  const result = scheduleCmsRelease(
    settings.value.releases,
    selectedReleaseId.value,
    releaseScheduleAt.value,
    governanceActor.id,
    undefined,
    governanceActor.role
  )
  commitReleaseResult(result, cmsUiText.value.releaseScheduledLabel)
}

/**
 * Publishes selected release immediately.
 */
function publishSelectedReleaseEntry(): void {
  if (!selectedReleaseId.value) {
    savedAtLabel.value = cmsUiText.value.selectReleaseFirstLabel
    return
  }

  const result = publishCmsRelease(
    settings.value.releases,
    selectedReleaseId.value,
    governanceActor.id,
    undefined,
    governanceActor.role
  )
  commitReleaseResult(result, cmsUiText.value.releasePublishedLabel, true)
}

/**
 * Processes due scheduled releases and publishes them automatically.
 */
function processDueScheduledReleaseEntries(): void {
  const result = processDueScheduledCmsReleases(
    settings.value.releases,
    governanceActor.id,
    undefined,
    governanceActor.role
  )
  const publishedCount = result.publishedReleaseIds?.length ?? 0
  commitReleaseResult(
    result,
    publishedCount > 0
      ? cmsUiText.value.scheduledReleasesPublishedLabel(publishedCount)
      : cmsUiText.value.noScheduledReleasesPublishedLabel,
    true
  )
}

/**
 * Rolls back current selected release to chosen historical release snapshot.
 */
function rollbackSelectedReleaseEntry(): void {
  if (!selectedReleaseId.value) {
    savedAtLabel.value = cmsUiText.value.selectSourceReleaseFirstLabel
    return
  }
  if (!releaseRollbackTargetId.value) {
    savedAtLabel.value = cmsUiText.value.selectRollbackTargetReleaseLabel
    return
  }

  const result = rollbackCmsRelease(
    settings.value.releases,
    selectedReleaseId.value,
    releaseRollbackTargetId.value,
    governanceActor.id,
    undefined,
    governanceActor.role
  )
  commitReleaseResult(result, cmsUiText.value.releaseRolledBackLabel, true)
}

/**
 * Promotes selected release into another environment.
 */
function promoteSelectedReleaseEntry(): void {
  if (!selectedReleaseId.value) {
    savedAtLabel.value = cmsUiText.value.selectReleaseFirstLabel
    return
  }
  if (!releasePromotionTargetEnvironment.value) {
    savedAtLabel.value = cmsUiText.value.selectPromotionTargetEnvironmentLabel
    return
  }

  const result = promoteCmsReleaseEnvironment(
    settings.value.releases,
    selectedReleaseId.value,
    releasePromotionTargetEnvironment.value,
    governanceActor.id,
    undefined,
    governanceActor.role
  )
  commitReleaseResult(result, cmsUiText.value.releasePromotedLabel)
}

watch(
  activeReleaseEnvironment,
  value => {
    const hasReleaseInEnvironment = releaseEntries.value.some(item => item.environment === value)
    if (!hasReleaseInEnvironment) {
      settings.value.releases.activeReleaseId = releaseEntriesAll.value.find(item => item.environment === value)?.id ?? null
    }
    if (releaseRollbackTargetId.value && !releaseEntries.value.some(item => item.id === releaseRollbackTargetId.value)) {
      releaseRollbackTargetId.value = ''
    }
    if (releasePromotionTargetEnvironment.value === value) {
      releasePromotionTargetEnvironment.value = ''
    }
  },
  { immediate: true }
)

watch(
  selectedRelease,
  value => {
    if (value && settings.value.releases.activeEnvironment !== value.environment) {
      settings.value.releases.activeEnvironment = value.environment
    }
    releaseScheduleAt.value = toDateTimeLocalValue(value?.scheduledAt ?? null)
    if (releaseRollbackTargetId.value && !releaseEntries.value.some(item => item.id === releaseRollbackTargetId.value)) {
      releaseRollbackTargetId.value = ''
    }
    if (releasePromotionTargetEnvironment.value === activeReleaseEnvironment.value) {
      releasePromotionTargetEnvironment.value = ''
    }
  },
  { immediate: true }
)

const landingRegistry = createLandingRegistry()
const cmsBlockPalette = listCmsBuilderPalette(landingRegistry)
const cmsBlockPaletteByType = new Map(cmsBlockPalette.map(item => [item.type, item]))
const activeBlocksPageId = ref(settings.value.pages[0]?.id ?? '')
const activeBlocksSectionId = ref('')
const activeBlocksBlockId = ref('')
const selectedPaletteBlockType = ref(cmsBlockPalette[0]?.type ?? '')
const selectedPaletteBlockPresetId = ref<CmsBlockPresetId>('custom')
const activeBlocksPropsDraft = ref('{}')
const activeBlocksFieldJsonDrafts = ref<Record<string, string>>({})

/**
 * Creates collision-safe block ids while keeping section-local naming.
 */
function createUniquePageBlockId(
  occupiedIds: Set<string>,
  sectionId: string,
  preferredId: string | undefined,
  index = 1
): string {
  const normalizedPreferredId = normalizeIdSegment(preferredId)
  if (normalizedPreferredId && !occupiedIds.has(normalizedPreferredId)) {
    occupiedIds.add(normalizedPreferredId)
    return normalizedPreferredId
  }

  let nextIndex = Math.max(1, index)
  let candidate = `${sectionId}-block-${nextIndex}`
  while (occupiedIds.has(candidate)) {
    nextIndex += 1
    candidate = `${sectionId}-block-${nextIndex}`
  }

  occupiedIds.add(candidate)
  return candidate
}

/**
 * Creates a default block scaffold for a page section.
 */
function createDefaultSectionBlock(
  sectionId: string,
  occupiedIds: Set<string>,
  index = 1,
  enabled = true,
  presetId?: CmsSectionPresetId,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = settings.value.authoredBlockPresets
): CmsPageBlockSettings {
  const blockId = createUniquePageBlockId(occupiedIds, sectionId, undefined, index)
  const blockPresetId = getDefaultCmsBlockPresetIdForSectionPreset(presetId ?? 'custom')
  if (blockPresetId !== 'custom') {
    return createCmsPageBlockFromPreset({
      presetId: blockPresetId,
      blockId,
      enabled,
      authoredPresets,
    })
  }

  return {
    id: blockId,
    type: resolveDefaultCmsBlockTypeForSection(sectionId, presetId),
    presetId: 'custom',
    enabled,
    props: {},
  }
}

/**
 * Ensures page sections always contain at least one editable block.
 */
function ensurePageSectionBlocks(page: CmsPageSettings): CmsPageSettings {
  return ensurePageSectionBlocksWithContext(page, {
    authoredContentModels: settings.value.authoredContentModels,
    authoredBlockPresets: settings.value.authoredBlockPresets,
    reusableSections: settings.value.reusableSections,
    reusableBlocks: settings.value.reusableBlocks,
  })
}

/**
 * Ensures page sections always contain blocks while resolving authored presets/models from the supplied source.
 */
function ensurePageSectionBlocksWithContext(
  page: CmsPageSettings,
  context: {
    authoredContentModels: CmsAuthoredContentModelSettings[]
    authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
    reusableSections: CmsReusableSectionSettings[]
    reusableBlocks: CmsReusableBlockSettings[]
  }
): CmsPageSettings {
  const occupiedBlockIds = new Set<string>()
  const normalizedSections = page.sections.map(section => {
    const resolvedSection = resolveCmsReusableSectionReference({
      section,
      reusableSections: context.reusableSections,
      reusableBlocks: context.reusableBlocks,
    })
    const presetId = resolvedSection.presetId ?? 'custom'
    const normalizedBlocks = Array.isArray(resolvedSection.blocks) && resolvedSection.blocks.length > 0
      ? resolvedSection.blocks.map((block, index) => ({
        id: createUniquePageBlockId(occupiedBlockIds, section.id, String(block.id ?? '').trim(), index + 1),
        type: String(block.type ?? '').trim() || resolveDefaultCmsBlockTypeForSection(section.id, presetId),
        presetId: resolveCmsBlockPresetId(block.presetId),
        enabled: typeof block.enabled === 'boolean' ? block.enabled : section.enabled,
        reusableMode: block.reusableMode,
        reusableSourceId: block.reusableSourceId,
        props: block.props && typeof block.props === 'object'
          ? cloneSerializableValue(block.props)
          : {},
        localization: block.localization ? cloneSerializableValue(block.localization) : undefined,
      }))
      : null

    return {
      section: {
        ...section,
        label: resolvedSection.label,
        presetId,
        localization: resolvedSection.localization,
        blocks: resolvedSection.blocks,
      },
      presetId,
      normalizedBlocks,
    }
  })

  return {
    ...page,
    contentModelId: resolveCmsContentModelId(
      page.contentModelId,
      context.authoredContentModels
    ),
    sections: normalizedSections.map(({ section, presetId, normalizedBlocks }) => {
      return {
        ...section,
        presetId,
        blocks: normalizedBlocks ?? [createDefaultSectionBlock(section.id, occupiedBlockIds, 1, section.enabled, presetId, context.authoredBlockPresets)],
      }
    }),
  }
}

/**
 * Converts editable page settings into schema format consumed by CMS builder helpers.
 */
function toCmsPageSchema(
  page: CmsPageSettings,
  context: {
    authoredContentModels: CmsAuthoredContentModelSettings[]
    authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
    reusableSections: CmsReusableSectionSettings[]
    reusableBlocks: CmsReusableBlockSettings[]
  } = {
    authoredContentModels: settings.value.authoredContentModels,
    authoredBlockPresets: settings.value.authoredBlockPresets,
    reusableSections: settings.value.reusableSections,
    reusableBlocks: settings.value.reusableBlocks,
  }
): CmsPageSchema {
  const normalizedPage = ensurePageSectionBlocksWithContext(page, context)
  return {
    version: CMS_SCHEMA_VERSION,
    id: normalizedPage.id,
    slug: normalizedPage.path,
    title: normalizedPage.title,
    status: normalizedPage.status,
    sections: normalizedPage.sections.map(section => ({
      id: section.id,
      layout: 'single',
      settings: {
        label: section.label,
        enabled: section.enabled,
        presetId: section.presetId,
        reusableMode: section.reusableMode,
        reusableSourceId: section.reusableSourceId,
      },
      blocks: section.blocks.map(block => ({
        id: block.id,
        type: block.type,
        props: cloneSerializableValue(block.props),
        settings: {
          enabled: block.enabled,
          presetId: resolveCmsBlockPresetId(block.presetId),
          reusableMode: block.reusableMode,
          reusableSourceId: block.reusableSourceId,
        },
        localization: block.localization?.props
          ? { props: cloneSerializableValue(block.localization.props) }
          : undefined,
      })),
    })),
  }
}

/**
 * Converts builder schema output back to persisted white-label page settings.
 */
function fromCmsPageSchema(schema: CmsPageSchema, originalPage: CmsPageSettings): CmsPageSettings {
  const previousSectionsById = new Map(originalPage.sections.map(section => [section.id, section]))
  const occupiedBlockIds = new Set<string>()
  const normalizedSections = schema.sections.map((section, sectionIndex) => {
    const normalizedSectionId = String(section.id ?? '').trim() || `${originalPage.id}-section-${sectionIndex + 1}`
    const previousSection = previousSectionsById.get(normalizedSectionId) ?? previousSectionsById.get(section.id)
    const previousBlocksById = new Map((previousSection?.blocks ?? []).map(block => [block.id, block]))
    const settingsLabel = section.settings && typeof section.settings.label === 'string'
      ? section.settings.label.trim()
      : ''
    const settingsEnabled = section.settings && typeof section.settings.enabled === 'boolean'
      ? section.settings.enabled
      : undefined
    const settingsPresetId = section.settings && typeof section.settings.presetId === 'string'
      ? section.settings.presetId
      : undefined
    const sectionSettings = section.settings && typeof section.settings === 'object'
      ? section.settings as Record<string, unknown>
      : undefined
    const presetId = resolveCmsSectionPresetId(
      String(settingsPresetId ?? previousSection?.presetId ?? '').trim() || 'custom'
    )
    const normalizedBlocks = section.blocks.length > 0
      ? section.blocks.map((block, blockIndex) => {
        const previousBlock = previousBlocksById.get(block.id)
        const normalizedBlockId = createUniquePageBlockId(
          occupiedBlockIds,
          normalizedSectionId,
          String(block.id ?? '').trim(),
          blockIndex + 1
        )
        const blockSettings = block.settings && typeof block.settings === 'object'
          ? block.settings as Record<string, unknown>
          : undefined
        return {
          id: normalizedBlockId,
          type: String(block.type ?? '').trim() || resolveDefaultCmsBlockTypeForSection(normalizedSectionId, presetId),
          presetId: resolveCmsBlockPresetId(blockSettings?.presetId ?? previousBlock?.presetId),
          enabled: typeof blockSettings?.enabled === 'boolean'
            ? blockSettings.enabled
            : previousBlock?.enabled ?? previousSection?.enabled ?? true,
          reusableMode: typeof blockSettings?.reusableMode === 'string'
            ? blockSettings.reusableMode as CmsReusableReferenceMode
            : previousBlock?.reusableMode,
          reusableSourceId: String(blockSettings?.reusableSourceId ?? previousBlock?.reusableSourceId ?? '').trim() || undefined,
          props: block.props && typeof block.props === 'object'
            ? cloneSerializableValue(block.props)
            : {},
          localization: block.localization?.props
            ? { props: cloneSerializableValue(block.localization.props) }
            : previousBlock?.localization,
        }
      })
      : null

    return {
      normalizedSectionId,
      previousSection,
      sectionSettings,
      settingsLabel,
      settingsEnabled,
      presetId,
      normalizedBlocks,
    }
  })

  return {
    ...originalPage,
    id: String(schema.id ?? '').trim() || originalPage.id,
    path: String(schema.slug ?? '').trim() || originalPage.path,
    title: String(schema.title ?? '').trim() || originalPage.title,
    status: schema.status === 'published' ? 'published' : 'draft',
    sections: normalizedSections.map((section, sectionIndex) => {
      return {
        id: section.normalizedSectionId,
        presetId: section.presetId,
        label: section.settingsLabel || section.previousSection?.label || `Section ${sectionIndex + 1}`,
        enabled: typeof section.settingsEnabled === 'boolean'
          ? section.settingsEnabled
          : section.previousSection?.enabled ?? true,
        reusableMode: typeof section.sectionSettings?.reusableMode === 'string'
          ? section.sectionSettings.reusableMode as CmsReusableReferenceMode
          : section.previousSection?.reusableMode,
        reusableSourceId: String(section.sectionSettings?.reusableSourceId ?? section.previousSection?.reusableSourceId ?? '').trim() || undefined,
        customFields: normalizeCmsSectionCustomFieldsForPreset(
          section.previousSection?.customFields,
          section.presetId,
          settings.value.content.locale
        ),
        localization: section.previousSection?.localization,
        blocks: section.normalizedBlocks ?? [
          createDefaultSectionBlock(
            section.normalizedSectionId,
            occupiedBlockIds,
            1,
            section.previousSection?.enabled ?? true,
            section.presetId
          ),
        ],
      }
    }),
  }
}

const blocksPageOptions = computed(() => {
  return settings.value.pages.map(page => ({
    label: `${getCmsPageTitleValue(page)} (${page.path})`,
    value: page.id,
  }))
})

const activeBlocksPageIndex = computed(() => {
  return settings.value.pages.findIndex(page => page.id === activeBlocksPageId.value)
})

const activeBlocksPage = computed(() => {
  if (activeBlocksPageIndex.value < 0) {
    return null
  }
  return ensurePageSectionBlocks(settings.value.pages[activeBlocksPageIndex.value] as CmsPageSettings)
})

const activeBlocksSection = computed<CmsPageSectionSettings | null>(() => {
  const page = activeBlocksPage.value
  if (!page) {
    return null
  }

  return page.sections.find(section => section.id === activeBlocksSectionId.value) ?? null
})

const activeBlocksSectionIsLinked = computed(() => {
  return isCmsPageSectionLinked(activeBlocksSection.value)
})

const activeBlocksSections = computed<CmsBlocksSectionRow[]>(() => {
  const page = activeBlocksPage.value
  if (!page) {
    return []
  }

  return page.sections.map((section, sectionIndex) => ({
    id: section.id,
    label: section.label,
    enabled: section.enabled,
    reusableMode: section.reusableMode,
    reusableSourceId: section.reusableSourceId,
    sectionIndex,
    blocks: section.blocks.map((block, blockIndex) => ({
      id: block.id,
      type: block.type,
      presetId: block.presetId,
      enabled: block.enabled,
      reusableMode: block.reusableMode,
      reusableSourceId: block.reusableSourceId,
      sectionId: section.id,
      sectionLabel: getCmsSectionLabelValue(section),
      pageId: page.id,
      pageTitle: getCmsPageTitleValue(page),
      pagePath: page.path,
      pageStatus: page.status,
      pageIndex: activeBlocksPageIndex.value,
      sectionIndex,
      blockIndex,
    })),
  }))
})

const filteredActiveBlocksSections = computed<CmsBlocksSectionRow[]>(() => {
  if (!hasCmsBuilderSearch.value) {
    return activeBlocksSections.value
  }

  return activeBlocksSections.value.filter(section => matchesCmsBuilderSearch(
    normalizedCmsBuilderSearch.value,
    section.id,
    section.label,
    section.blocks.map(block => block.id).join(' '),
    section.blocks.map(block => resolveCmsBlockDisplayName(block.type)).join(' '),
    section.blocks.map(block => block.presetId).join(' '),
  ))
})

const blocksSectionOptions = computed(() => {
  return activeBlocksSections.value.map(section => ({
    label: `${section.label} (${section.blocks.length})`,
    value: section.id,
  }))
})

const activeBlocksBlockOptions = computed(() => {
  const section = activeBlocksSections.value.find(entry => entry.id === activeBlocksSectionId.value)
  if (!section) {
    return []
  }

  return section.blocks.map(block => ({
    label: `${resolveCmsBlockDisplayName(block.type)} (${block.id})`,
    value: block.id,
    description: getCmsBlockPresetLabel(
      settings.value.content.locale,
      block.presetId,
      settings.value.authoredBlockPresets
    ),
  }))
})

const cmsBlockPaletteOptions = computed(() => {
  const activeSection = activeBlocksSection.value
  const allowedTypes = activeSection
    ? new Set(getCmsSectionPresetAllowedBlockTypes(activeSection.presetId))
    : null

  return cmsBlockPalette
    .filter(item => !allowedTypes || allowedTypes.has(item.type))
    .map(item => ({
    label: `${item.displayName} (${item.category})`,
    value: item.type,
  }))
})

const cmsBlockPresetOptions = computed<CmsBlockPresetOption[]>(() => {
  const activeSection = activeBlocksSection.value

  return listCmsBlockPresetOptions(
    settings.value.content.locale,
    selectedPaletteBlockType.value,
    settings.value.authoredBlockPresets
  ).filter(option => {
    if (!activeSection) {
      return true
    }

    return isCmsBlockPresetAllowedForSectionPreset(
      activeSection.presetId,
      option.value,
      settings.value.authoredBlockPresets
    )
  })
})

const activeBlocksSectionContract = computed(() => {
  const activeSection = activeBlocksSection.value
  if (!activeSection) {
    return null
  }

  return getCmsSectionPresetDefinition(settings.value.content.locale, activeSection.presetId)
})

const activeBlocksSectionEnabledBlockCount = computed(() => {
  const activeSection = activeBlocksSection.value
  if (!activeSection) {
    return 0
  }

  return activeSection.blocks.filter(block => block.enabled).length
})

const activeBlocksSectionLimitReached = computed(() => {
  const limits = activeBlocksSection.value
    ? getCmsSectionPresetBlockLimits(activeBlocksSection.value.presetId)
    : null
  if (!limits || limits.maxBlocks == null) {
    return false
  }

  return activeBlocksSectionEnabledBlockCount.value >= limits.maxBlocks
})

const activeBlocksSectionDisabledBlockCount = computed(() => {
  const activeSection = activeBlocksSection.value
  if (!activeSection) {
    return 0
  }

  return activeSection.blocks.filter(block => !block.enabled).length
})

const canToggleActiveSectionBlocks = computed(() => {
  return Boolean(activeBlocksSection.value) && !activeBlocksSectionIsLinked.value
})

const canRemoveDisabledBlocksFromActiveSection = computed(() => {
  return canToggleActiveSectionBlocks.value && activeBlocksSectionDisabledBlockCount.value > 0
})

const canAddPaletteBlockToActiveSection = computed(() => {
  const activeSection = activeBlocksSection.value
  if (!activeSection || !selectedPaletteBlockType.value) {
    return false
  }

  if (activeBlocksSectionIsLinked.value) {
    return false
  }

  if (activeBlocksSectionLimitReached.value) {
    return false
  }

  return isCmsBlockTypeAllowedForSectionPreset(
    activeSection.presetId,
    selectedPaletteBlockType.value
  )
})

const activeBlocksSectionContractSummary = computed(() => {
  const contract = activeBlocksSectionContract.value
  if (!contract) {
    return ''
  }

  const blockLabels = contract.allowedBlockTypes
    .map(type => resolveCmsBlockDisplayName(type))
    .join(', ')
  const limitLabel = contract.maxBlocks == null
    ? tr('Unlimited blocks', 'Blocos ilimitados')
    : tr('Max blocks', 'Maximo de blocos')
      + `: ${contract.maxBlocks}`

  return `${contract.slots[0]?.label ?? tr('Main slot', 'Slot principal')} · ${blockLabels} · ${limitLabel}`
})

const cmsReusableBlockOptions = computed(() => {
  return settings.value.reusableBlocks
    .filter(reusableBlock => !isCmsArchivedEntity(reusableBlock) && !isCmsDeprecatedEntity(reusableBlock))
    .map(reusableBlock => ({
    label: `${reusableBlock.name} (${reusableBlock.category})`,
    value: reusableBlock.id,
    description: reusableBlock.description,
  }))
})

const cmsReusableSectionLibrary = computed<CmsReusableSectionSettings[]>(() => {
  return settings.value.reusableSections
    .filter(section => showArchivedReusableSections.value || !isCmsArchivedEntity(section))
})

const filteredCmsReusableSectionLibrary = computed<CmsReusableSectionSettings[]>(() => {
  if (!hasCmsBuilderSearch.value) {
    return cmsReusableSectionLibrary.value
  }

  return cmsReusableSectionLibrary.value.filter(section => matchesCmsBuilderSearch(
    normalizedCmsBuilderSearch.value,
    section.id,
    section.name,
    section.description,
    getCmsReusableSectionLabelValue(section),
    getCmsContentModelLabel(settings.value.content.locale, section.contentModelId, settings.value.authoredContentModels),
    getCmsSectionPresetLabel(section.presetId),
  ))
})

const pagedCmsReusableSectionLibrary = computed<CmsReusableSectionSettings[]>(() => {
  if (hasCmsBuilderSearch.value) {
    return filteredCmsReusableSectionLibrary.value
  }
  return filteredCmsReusableSectionLibrary.value.slice(0, 50)
})

const cmsEntityUsageIndex = computed(() => collectCmsEntityUsageIndex({
  pages: settings.value.pages,
  authoredContentModels: settings.value.authoredContentModels,
  authoredBlockPresets: settings.value.authoredBlockPresets,
  reusableBlocks: settings.value.reusableBlocks,
  reusableSections: settings.value.reusableSections,
}))

const cmsUsageDrawerSummary = computed(() => {
  const target = cmsUsageDrawerTarget.value
  if (!target) {
    return null
  }

  return getCmsEntityUsageSummary(cmsEntityUsageIndex.value, target.kind, target.entityId)
})

const cmsUsageDrawerReferences = computed(() => cmsUsageDrawerSummary.value?.references ?? [])
const cmsUsageDrawerSummaryLabel = computed(() => {
  const target = cmsUsageDrawerTarget.value
  if (!target) {
    return tr('No engine usage detected', 'Nenhum uso no engine detectado')
  }

  return getCmsEntityUsageSummaryLabel(
    target.entityId,
    target.kind === 'content-model'
      ? cmsEntityUsageIndex.value.contentModels
      : target.kind === 'authored-block-preset'
        ? cmsEntityUsageIndex.value.authoredBlockPresets
        : target.kind === 'reusable-block'
          ? cmsEntityUsageIndex.value.reusableBlocks
          : cmsEntityUsageIndex.value.reusableSections
  )
})
const cmsUsageDrawerReferenceItems = computed<CmsEntityUsageDrawerReferenceView[]>(() => {
  return cmsUsageDrawerReferences.value.map((reference, referenceIndex) => ({
    key: `usage-reference-${reference.source}-${reference.pageId || 'none'}-${reference.sectionId || 'none'}-${reference.blockId || 'none'}-${referenceIndex}`,
    label: reference.label,
    sourceLabel: getCmsUsageReferenceSourceLabel(reference),
    description: reference.description,
    locationLabel: [
      reference.pageId ? `page:${reference.pageId}` : null,
      reference.sectionId ? `section:${reference.sectionId}` : null,
      reference.blockId ? `block:${reference.blockId}` : null,
    ].filter(Boolean).join(' · '),
  }))
})

const cmsReusableSectionReplacementAssistantById = computed(() => {
  const summaries = new Map<string, CmsReplacementAssistantSummary>()
  for (const reusableSection of settings.value.reusableSections) {
    summaries.set(reusableSection.id, previewCmsDeprecatedEntityReplacement({
      targetKind: 'reusable-section',
      entityId: reusableSection.id,
      replacementEntityId: reusableSection.replacementEntityId,
      pages: settings.value.pages,
      authoredContentModels: settings.value.authoredContentModels,
      authoredBlockPresets: settings.value.authoredBlockPresets,
      reusableBlocks: settings.value.reusableBlocks,
      reusableSections: settings.value.reusableSections,
    }))
  }
  return summaries
})

const cmsReusableBlockReplacementAssistantById = computed(() => {
  const summaries = new Map<string, CmsReplacementAssistantSummary>()
  for (const reusableBlock of settings.value.reusableBlocks) {
    summaries.set(reusableBlock.id, previewCmsDeprecatedEntityReplacement({
      targetKind: 'reusable-block',
      entityId: reusableBlock.id,
      replacementEntityId: reusableBlock.replacementEntityId,
      pages: settings.value.pages,
      authoredContentModels: settings.value.authoredContentModels,
      authoredBlockPresets: settings.value.authoredBlockPresets,
      reusableBlocks: settings.value.reusableBlocks,
      reusableSections: settings.value.reusableSections,
    }))
  }
  return summaries
})

const cmsAuthoredBlockPresetReplacementAssistantById = computed(() => {
  const summaries = new Map<string, CmsReplacementAssistantSummary>()
  for (const preset of settings.value.authoredBlockPresets) {
    summaries.set(preset.id, previewCmsDeprecatedEntityReplacement({
      targetKind: 'authored-block-preset',
      entityId: preset.id,
      replacementEntityId: preset.replacementEntityId,
      pages: settings.value.pages,
      authoredContentModels: settings.value.authoredContentModels,
      authoredBlockPresets: settings.value.authoredBlockPresets,
      reusableBlocks: settings.value.reusableBlocks,
      reusableSections: settings.value.reusableSections,
    }))
  }
  return summaries
})

const cmsAuthoredContentModelUsageCountById = computed(() => {
  const counts = new Map<string, number>()
  for (const [contentModelId, summary] of cmsEntityUsageIndex.value.contentModels.entries()) {
    counts.set(contentModelId, summary.totalReferences)
  }
  return counts
})

const cmsAuthoredBlockPresetUsageCountById = computed(() => {
  const counts = new Map<string, number>()
  for (const [presetId, summary] of cmsEntityUsageIndex.value.authoredBlockPresets.entries()) {
    counts.set(presetId, summary.totalReferences)
  }
  return counts
})

const cmsReusableBlockUsageCountById = computed(() => {
  const counts = new Map<string, number>()
  for (const [reusableBlockId, summary] of cmsEntityUsageIndex.value.reusableBlocks.entries()) {
    counts.set(reusableBlockId, summary.totalReferences)
  }
  return counts
})

const cmsReusableSectionUsageCountById = computed(() => {
  const counts = new Map<string, number>()
  for (const [reusableSectionId, summary] of cmsEntityUsageIndex.value.reusableSections.entries()) {
    counts.set(reusableSectionId, summary.totalReferences)
  }
  return counts
})

const selectedAuthoredContentModel = computed<CmsAuthoredContentModelSettings | null>(() => {
  return settings.value.authoredContentModels.find(model => model.id === selectedAuthoredContentModelId.value) ?? null
})

const selectedAuthoredContentModelFieldPresetSettings = computed<CmsAuthoredContentModelFieldPresetSettings | null>(() => {
  if (!selectedAuthoredContentModelFieldPresetId.value) {
    return null
  }

  return settings.value.authoredContentModelFieldPresets
    .find(preset => preset.id === selectedAuthoredContentModelFieldPresetId.value) ?? null
})

const selectedAuthoredContentModelFieldPreset = computed<CmsResolvedContentModelFieldPresetDefinition | null>(() => {
  const preset = selectedAuthoredContentModelFieldPresetSettings.value
  if (!preset) {
    return null
  }

  return getCmsContentModelFieldPresetDefinition(
    settings.value.content.locale,
    preset.id,
    settings.value.authoredContentModelFieldPresets
  )
})

const cmsAuthoredBlockPresetLibrary = computed<CmsAuthoredBlockPresetSettings[]>(() => {
  return settings.value.authoredBlockPresets
    .filter(preset => showArchivedAuthoredBlockPresets.value || !isCmsArchivedEntity(preset))
})

const cmsReusableBlockLibrary = computed<CmsReusableBlockSettings[]>(() => {
  return settings.value.reusableBlocks
    .filter(block => showArchivedReusableBlocks.value || !isCmsArchivedEntity(block))
})

const filteredCmsReusableBlockLibrary = computed<CmsReusableBlockSettings[]>(() => {
  if (!hasCmsBuilderSearch.value) {
    return cmsReusableBlockLibrary.value
  }

  return cmsReusableBlockLibrary.value.filter(block => matchesCmsBuilderSearch(
    normalizedCmsBuilderSearch.value,
    block.id,
    block.name,
    block.description,
    block.category,
    resolveCmsBlockDisplayName(block.type),
  ))
})

const pagedCmsReusableBlockLibrary = computed<CmsReusableBlockSettings[]>(() => {
  if (hasCmsBuilderSearch.value) {
    return filteredCmsReusableBlockLibrary.value
  }
  return filteredCmsReusableBlockLibrary.value.slice(0, 50)
})

const filteredCmsAuthoredBlockPresetLibrary = computed<CmsAuthoredBlockPresetSettings[]>(() => {
  if (!hasCmsBuilderSearch.value) {
    return cmsAuthoredBlockPresetLibrary.value
  }

  return cmsAuthoredBlockPresetLibrary.value.filter(preset => matchesCmsBuilderSearch(
    normalizedCmsBuilderSearch.value,
    preset.id,
    getCmsAuthoredBlockPresetNameValue(preset),
    getCmsAuthoredBlockPresetDescriptionValue(preset),
    preset.category,
    resolveCmsBlockDisplayName(preset.type),
    getCmsAuthoredPresetStarterSectionsLabel(preset),
  ))
})

const pagedCmsAuthoredBlockPresetLibrary = computed<CmsAuthoredBlockPresetSettings[]>(() => {
  if (hasCmsBuilderSearch.value) {
    return filteredCmsAuthoredBlockPresetLibrary.value
  }
  return filteredCmsAuthoredBlockPresetLibrary.value.slice(0, 50)
})

const cmsAuthoredBlockPresetOptions = computed(() => {
  return settings.value.authoredBlockPresets
    .filter(preset => !isCmsArchivedEntity(preset) && !isCmsDeprecatedEntity(preset))
    .map(preset => ({
    label: `${getCmsAuthoredBlockPresetNameValue(preset)} (${resolveCmsBlockDisplayName(preset.type)})`,
    value: preset.id,
    description: getCmsAuthoredBlockPresetDescriptionValue(preset),
  }))
})

const cmsPresetStarterSectionOptions = computed<CmsSectionPresetOption[]>(() => {
  return listCmsSectionPresetOptions(settings.value.content.locale, 'blank-page')
})

const cmsBuilderCommandOptions = computed<CmsBuilderCommandOption[]>(() => {
  const options: CmsBuilderCommandOption[] = []

  if (isPagesModule.value) {
    const selectedTemplate = cmsPageTemplateOptions.value.find(option => option.value === selectedPageTemplateId.value)
    options.push(
      {
        label: tr('Create page from selected template', 'Criar pagina a partir do template selecionado'),
        value: `pages:create:${selectedPageTemplateId.value}`,
        description: selectedTemplate?.label ?? selectedPageTemplateId.value,
      },
      {
        label: tr('Create and open blocks', 'Criar e abrir blocos'),
        value: `pages:create-open:${selectedPageTemplateId.value}`,
        description: selectedTemplate?.label ?? selectedPageTemplateId.value,
      },
    )

    for (const quickStart of filteredCmsPageQuickStartOptions.value.slice(0, 4)) {
      options.push({
        label: `${tr('Quick-start', 'Quick-start')}: ${quickStart.label}`,
        value: `pages:quick-start:${quickStart.value}`,
        description: quickStart.description,
      })
    }

    for (const starterKit of filteredCmsStarterKitOptions.value.slice(0, 4)) {
      options.push(
        {
          label: `${tr('Starter kit', 'Starter kit')}: ${starterKit.label}`,
          value: `pages:starter-kit:${starterKit.value}`,
          description: starterKit.description,
        },
        {
          label: `${tr('Starter kit + open blocks', 'Starter kit + abrir blocos')}: ${starterKit.label}`,
          value: `pages:starter-kit-open:${starterKit.value}`,
          description: starterKit.description,
        },
      )
    }

    for (const { page } of filteredCmsPageRows.value.slice(0, 4)) {
      const schemaMigrationReport = cmsPageSchemaMigrationReportMap.value.get(page.id)
      options.push(
        {
          label: `${tr('Open in Blocks', 'Abrir em Blocos')}: ${getCmsPageTitleValue(page)}`,
          value: `pages:open:${page.id}`,
          description: page.path,
        },
        {
          label: `${tr('Apply model scaffold', 'Aplicar scaffold do modelo')}: ${getCmsPageTitleValue(page)}`,
          value: `pages:scaffold:${page.id}`,
          description: getCmsContentModelLabel(settings.value.content.locale, page.contentModelId, settings.value.authoredContentModels),
        },
        {
          label: `${tr('Apply model defaults', 'Aplicar defaults do modelo')}: ${getCmsPageTitleValue(page)}`,
          value: `pages:defaults:${page.id}`,
          description: page.path,
        },
        {
          label: `${tr('Sync schema version', 'Sincronizar versao do schema')}: ${getCmsPageTitleValue(page)}`,
          value: `pages:sync:${page.id}`,
          description: schemaMigrationReport
            ? getCmsSchemaMigrationSummaryLabel(schemaMigrationReport)
            : `v${page.contentModelVersion ?? '?'}`,
        },
      )
    }
  }

  if (isBlocksModule.value) {
    options.push({
      label: tr('Open Pages module', 'Abrir modulo de Paginas'),
      value: 'blocks:open-pages',
      description: tr('Switch back to page authoring.', 'Voltar para a autoria de paginas.'),
    })

    for (const section of filteredActiveBlocksSections.value.slice(0, 6)) {
      options.push({
        label: `${tr('Focus section', 'Focar secao')}: ${section.label}`,
        value: `blocks:section:${section.id}`,
        description: tr(`${section.blocks.length} blocks`, `${section.blocks.length} blocos`),
      })
    }

    for (const block of filteredActiveBlocksSections.value.flatMap(section => section.blocks).slice(0, 8)) {
      options.push({
        label: `${tr('Select block', 'Selecionar bloco')}: ${resolveCmsBlockDisplayName(block.type)}`,
        value: `blocks:block:${block.sectionId}:${block.id}`,
        description: `${block.sectionLabel} · ${block.id}`,
      })
    }

    for (const reusableBlock of filteredCmsReusableBlockLibrary.value.slice(0, 4)) {
      options.push({
        label: `${tr('Use reusable block', 'Usar bloco reutilizavel')}: ${reusableBlock.name}`,
        value: `blocks:reusable:${reusableBlock.id}`,
        description: reusableBlock.description || reusableBlock.category,
      })
    }

    for (const preset of filteredCmsAuthoredBlockPresetLibrary.value.slice(0, 4)) {
      options.push({
        label: `${tr('Select preset', 'Selecionar preset')}: ${getCmsAuthoredBlockPresetNameValue(preset)}`,
        value: `blocks:preset:${preset.id}`,
        description: getCmsAuthoredBlockPresetDescriptionValue(preset) || preset.category,
      })
    }
  }

  return options
})

const selectedCmsBuilderCommandOption = computed(() => {
  return cmsBuilderCommandOptions.value.find(option => option.value === selectedBuilderCommandId.value) ?? null
})

const cmsPreviewSnapshot = computed(() => resolveCmsPreviewSnapshot(settings.value, {
  source: cmsPreviewSource.value,
  localeInput: cmsPreviewLocale.value,
  selectedReleaseId: selectedReleaseId.value || null,
  activeEnvironment: activeReleaseEnvironment.value,
}))

const cmsPreviewDraftPublishedDiff = computed(() => resolveCmsPreviewDraftPublishedDiff(settings.value, {
  selectedReleaseId: selectedReleaseId.value || null,
  activeEnvironment: activeReleaseEnvironment.value,
}))

const cmsPreviewLocaleCoverageMatrix = computed<CmsLocaleCoverageSummary[]>(() => {
  return resolveCmsLocaleCoverageMatrix(cmsPreviewSnapshot.value)
})

const cmsPreviewActiveLocaleCoverage = computed<CmsLocaleCoverageSummary | null>(() => {
  return cmsPreviewLocaleCoverageMatrix.value.find(entry => entry.locale === cmsPreviewLocale.value) ?? null
})

const selectedReleaseReviewHub = computed(() => {
  if (!selectedRelease.value) {
    return null
  }

  return createCmsReleaseReviewHubSummary({
    diff: cmsPreviewDraftPublishedDiff.value,
    localeCoverage: cmsPreviewLocaleCoverageMatrix.value,
    checklist: selectedReleaseCandidateChecklist.value,
  })
})

const cmsGovernanceHubSummary = computed(() => createCmsGovernanceHubSummary(settings.value.governance))

const releaseReviewPackageHistoryEntries = computed<CmsReviewPackageHistoryEntry[]>(() => {
  const currentEnvironment = activeReleaseEnvironment.value
  const selectedId = selectedRelease.value?.id ?? ''
  return [...(settings.value.releases.reviewPackages ?? [])]
    .filter(entry => entry.environment === currentEnvironment)
    .sort((left, right) => {
      const leftSelectedScore = left.releaseId === selectedId ? 1 : 0
      const rightSelectedScore = right.releaseId === selectedId ? 1 : 0
      if (leftSelectedScore !== rightSelectedScore) {
        return rightSelectedScore - leftSelectedScore
      }

      return new Date(right.exportedAt).getTime() - new Date(left.exportedAt).getTime()
    })
    .slice(0, 8)
})
const selectedReleaseReviewHubCardItems = computed<CmsStatusMetricCardItem[]>(() => {
  const hub = selectedReleaseReviewHub.value
  if (!hub) {
    return []
  }

  return hub.cards.map(card => ({
    id: card.id,
    title: getReleaseReviewHubCardLabel(card.id),
    description: getReleaseReviewHubCardDescription(card),
    statusLabel: getReleaseChecklistStatusLabel(card.status),
    statusStyle: getReleaseChecklistStatusStyle(card.status),
    statusValue: card.status,
    metrics: card.metrics.map(metric => ({
      id: metric.id,
      label: getReleaseReviewHubMetricLabel(card.id, metric.id),
      value: metric.value,
    })),
  }))
})
const cmsGovernanceHubCardItems = computed<CmsStatusMetricCardItem[]>(() => (
  cmsGovernanceHubSummary.value.cards.map(card => ({
    id: card.id,
    title: getGovernanceHubCardLabel(card.id),
    description: getGovernanceHubCardDescription(card),
    statusLabel: getReleaseChecklistStatusLabel(card.status),
    statusStyle: getReleaseChecklistStatusStyle(card.status),
    statusValue: card.status,
    metrics: card.metrics.map(metric => ({
      id: metric.id,
      label: getGovernanceHubMetricLabel(card.id, metric.id),
      value: metric.value,
    })),
  }))
))
const cmsGovernanceRevisionPanelItems = computed<CmsPanelListSectionItem[]>(() => (
  cmsGovernanceHubSummary.value.revisions.recent.map(revision => ({
    id: `${revision.version}-${revision.at}`,
    title: `v${revision.version} · ${getGovernanceWorkflowStatusLabel(revision.status)}`,
    meta: formatReleaseTimestamp(revision.at),
    lines: [
      `${getGovernanceActionLabel(revision.action)} · ${revision.by} · ${getGovernanceRoleLabel(revision.byRole)}`,
      revision.summary,
    ],
  }))
))
const cmsGovernanceAuditPanelItems = computed<CmsPanelListSectionItem[]>(() => (
  cmsGovernanceHubSummary.value.audit.recent.map(entry => ({
    id: entry.id,
    title: getGovernanceActionLabel(entry.action),
    meta: formatReleaseTimestamp(entry.at),
    lines: [
      `${entry.actorId} · ${getGovernanceRoleLabel(entry.actorRole)} · v${entry.fromVersion} → v${entry.toVersion}`,
      entry.summary,
    ],
  }))
))
const cmsGovernanceRolePolicyPanelItems = computed<CmsPanelListSectionItem[]>(() => (
  cmsGovernanceHubSummary.value.roles.policies.map(policy => ({
    id: policy.role,
    title: policy.label,
    meta: `${policy.groupsCount} ${tr('groups', 'grupos')}`,
    lines: [
      `${policy.allowCount} ${tr('allow', 'allow')} · ${policy.denyCount} ${tr('deny', 'deny')}`,
    ],
  }))
))

const cmsPreviewChangedPageDiffs = computed(() => {
  return (cmsPreviewDraftPublishedDiff.value?.pages ?? []).filter(page => page.status !== 'unchanged')
})

const cmsSchemaMigrationBatchReport = computed(() => createCmsSchemaMigrationBatchReport({
  pages: settings.value.pages,
  localeInput: settings.value.content.locale,
  authoredContentModels: settings.value.authoredContentModels,
}))

const cmsPageSchemaMigrationReportMap = computed(() => {
  const map = new Map<string, CmsPageSchemaMigrationReport>()
  for (const report of cmsSchemaMigrationBatchReport.value.pages) {
    map.set(report.pageId, report)
  }
  return map
})

const cmsPreviewPageDiffMap = computed(() => {
  const map = new Map<string, CmsPreviewPageDiffSummary>()
  for (const page of cmsPreviewDraftPublishedDiff.value?.pages ?? []) {
    map.set(page.pageId, page)
  }
  return map
})

const activeBlocksPageDiff = computed(() => {
  return cmsPreviewPageDiffMap.value.get(activeBlocksPageId.value) ?? null
})

const activeBlocksSectionDiff = computed<CmsPreviewSectionDiffSummary | null>(() => {
  return activeBlocksPageDiff.value?.sections.find(section => section.sectionId === activeBlocksSectionId.value) ?? null
})

const activeBlocksBlockDiff = computed<CmsPreviewBlockDiffSummary | null>(() => {
  return activeBlocksSectionDiff.value?.blocks.find(block => block.blockId === activeBlocksBlockId.value) ?? null
})

const cmsPreviewPages = computed<CmsPageSettings[]>(() => {
  return cmsPreviewSnapshot.value?.pages ?? []
})

const cmsPreviewAuthoredContentModels = computed<CmsAuthoredContentModelSettings[]>(() => {
  return cmsPreviewSnapshot.value?.authoredContentModels ?? settings.value.authoredContentModels
})

const cmsPreviewAuthoredBlockPresets = computed<CmsAuthoredBlockPresetSettings[]>(() => {
  return cmsPreviewSnapshot.value?.authoredBlockPresets ?? settings.value.authoredBlockPresets
})

const cmsPreviewMediaAssets = computed<CmsMediaAssetSettings[]>(() => {
  return cmsPreviewSnapshot.value?.mediaAssets ?? settings.value.mediaAssets
})

const cmsPreviewPagesForRender = computed<CmsPageSettings[]>(() => {
  return cmsPreviewPages.value.map(page => ensurePageSectionBlocksWithContext(page, {
    authoredContentModels: cmsPreviewAuthoredContentModels.value,
    authoredBlockPresets: cmsPreviewAuthoredBlockPresets.value,
    reusableSections: cmsPreviewSnapshot.value?.reusableSections ?? settings.value.reusableSections,
    reusableBlocks: cmsPreviewSnapshot.value?.reusableBlocks ?? settings.value.reusableBlocks,
  }))
})

const cmsPreviewPublishedReleaseLabel = computed(() => {
  if (cmsPreviewSource.value !== 'published' || !cmsPreviewSnapshot.value?.releaseName) {
    return ''
  }

  const environment = cmsPreviewSnapshot.value.releaseEnvironment
  return environment
    ? `${cmsPreviewSnapshot.value.releaseName} · ${environment}`
    : cmsPreviewSnapshot.value.releaseName
})

const cmsPreviewEmptyMessage = computed(() => {
  if (cmsPreviewSource.value !== 'published') {
    return ''
  }

  if (!cmsPreviewSnapshot.value) {
    return tr(
      'No published release snapshot is available for preview yet.',
      'Nenhum snapshot publicado esta disponivel para preview ainda.'
    )
  }

  return ''
})

const activeBlocksSchema = computed<CmsPageSchema | null>(() => {
  const page = cmsPreviewPages.value.find(entry => entry.id === activeBlocksPageId.value)
  if (!page) {
    return null
  }

  return toCmsPageSchema(page, {
    authoredContentModels: cmsPreviewAuthoredContentModels.value,
    authoredBlockPresets: cmsPreviewAuthoredBlockPresets.value,
    reusableSections: cmsPreviewSnapshot.value?.reusableSections ?? settings.value.reusableSections,
    reusableBlocks: cmsPreviewSnapshot.value?.reusableBlocks ?? settings.value.reusableBlocks,
  })
})

const cmsSectionBlocks = computed<CmsSectionBlockRecord[]>(() => {
  return settings.value.pages.flatMap((page, pageIndex) => {
    const normalizedPage = ensurePageSectionBlocks(page)
    return normalizedPage.sections.flatMap((section, sectionIndex) => {
      return section.blocks.map((block, blockIndex) => ({
        id: block.id,
        type: block.type,
        presetId: block.presetId,
        enabled: block.enabled,
        sectionId: section.id,
        sectionLabel: getCmsSectionLabelValue(section),
        pageId: normalizedPage.id,
        pageTitle: getCmsPageTitleValue(normalizedPage),
        pagePath: normalizedPage.path,
        pageStatus: normalizedPage.status,
        pageIndex,
        sectionIndex,
        blockIndex,
      }))
    })
  })
})

const cmsPreviewContentValidation = computed(() => validateCmsContentPages({
  pages: cmsPreviewPages.value,
  registry: landingRegistry,
  authoredContentModels: cmsPreviewAuthoredContentModels.value,
  authoredBlockPresets: cmsPreviewAuthoredBlockPresets.value,
  mediaAssets: cmsPreviewMediaAssets.value,
  reusableSections: cmsPreviewSnapshot.value?.reusableSections ?? settings.value.reusableSections,
  reusableBlocks: cmsPreviewSnapshot.value?.reusableBlocks ?? settings.value.reusableBlocks,
}))

const cmsPreviewContentDiagnostics = computed<CmsContentValidationIssue[]>(() => {
  return cmsPreviewContentValidation.value.issues
})

const cmsPreviewPublishedPagesCount = computed(() => {
  return cmsPreviewContentValidation.value.summary.publishedPagesCount
})

const cmsPreviewEnabledSectionsCount = computed(() => {
  return cmsPreviewContentValidation.value.summary.enabledSectionsCount
})

const cmsPreviewEnabledBlocksCount = computed(() => {
  return cmsPreviewContentValidation.value.summary.enabledBlocksCount
})

const activeBlocksSelectedBlockRecord = computed(() => {
  const section = activeBlocksSections.value.find(entry => entry.id === activeBlocksSectionId.value)
  if (!section) {
    return null
  }
  return section.blocks.find(block => block.id === activeBlocksBlockId.value) ?? null
})

const activeBlocksSelectedBlock = computed<CmsPageBlockSettings | null>(() => {
  const block = activeBlocksSelectedBlockRecord.value
  if (!block) {
    return null
  }

  const page = settings.value.pages[block.pageIndex]
  const section = page?.sections[block.sectionIndex]
  return section?.blocks[block.blockIndex] ?? null
})

const activeBlocksSelectionReadOnly = computed(() => {
  return activeBlocksSectionIsLinked.value || isCmsPageBlockLinked(activeBlocksSelectedBlock.value)
})

const activeBlocksFieldDefinitions = computed<CmsBlockFieldDefinition[]>(() => {
  const blockType = activeBlocksSelectedBlockRecord.value?.type ?? ''
  return getLandingBlockFieldDefinitions(blockType)
})

const cmsPreviewRenderContext = computed(() => ({
  mediaAssets: cmsPreviewMediaAssets.value,
  locale: cmsPreviewSnapshot.value?.locale ?? cmsPreviewLocale.value,
}))

const cmsResolvedDraftPages = computed<CmsPageSettings[]>(() => {
  return settings.value.pages.map(page => ensurePageSectionBlocks(page))
})

const cmsMediaReferences = computed(() => collectCmsMediaBindingReferences({
  pages: cmsResolvedDraftPages.value,
  resolveBindings: getLandingBlockMediaBindingDefinitions,
}))

const cmsBrandingMediaReferences = computed(() => collectCmsBrandingMediaBindingReferences({
  branding: settings.value.branding,
  mediaAssets: settings.value.mediaAssets,
}))

const cmsMediaDiagnostics = computed<CmsMediaDiagnostic[]>(() => collectCmsMediaDiagnostics({
  pages: cmsResolvedDraftPages.value,
  branding: settings.value.branding,
  mediaAssets: settings.value.mediaAssets,
  resolveBindings: getLandingBlockMediaBindingDefinitions,
}))

const cmsPreviewMediaDiagnostics = computed<CmsMediaDiagnostic[]>(() => collectCmsMediaDiagnostics({
  pages: cmsPreviewPagesForRender.value,
  branding: cmsPreviewSnapshot.value?.branding ?? settings.value.branding,
  mediaAssets: cmsPreviewMediaAssets.value,
  resolveBindings: getLandingBlockMediaBindingDefinitions,
}))

const cmsMediaUsageSummaryByAssetId = computed(() => collectCmsMediaUsageSummary({
  pages: cmsResolvedDraftPages.value,
  branding: settings.value.branding,
  mediaAssets: settings.value.mediaAssets,
  resolveBindings: getLandingBlockMediaBindingDefinitions,
}))

const cmsMediaUsageCountByAssetId = computed(() => {
  const counts = new Map<string, number>()
  for (const [assetId, summary] of cmsMediaUsageSummaryByAssetId.value.entries()) {
    counts.set(assetId, summary.totalReferences)
  }
  return counts
})

/**
 * Filters content diagnostics for one page preview card from an explicit issues collection.
 */
function getCmsPageDiagnosticsFromIssues(
  pageId: string,
  pageIndex: number,
  issues: CmsContentValidationIssue[]
): CmsContentValidationIssue[] {
  return issues.filter(issue => {
    if (issue.pageId && issue.pageId === pageId) {
      return true
    }

    return issue.path.startsWith(`pages[${pageIndex}]`)
      || issue.path.startsWith(`pages.${pageId || 'unknown'}`)
  })
}

/**
 * Filters preview diagnostics for one page preview card.
 */
function getCmsPreviewPageDiagnostics(pageId: string, pageIndex: number): CmsContentValidationIssue[] {
  return getCmsPageDiagnosticsFromIssues(pageId, pageIndex, cmsPreviewContentDiagnostics.value)
}

/**
 * Converts one preview page into schema format using the resolved preview snapshot contracts.
 */
function toCmsPreviewPageSchema(page: CmsPageSettings): CmsPageSchema {
  return toCmsPageSchema(page, {
    authoredContentModels: cmsPreviewAuthoredContentModels.value,
    authoredBlockPresets: cmsPreviewAuthoredBlockPresets.value,
    reusableSections: cmsPreviewSnapshot.value?.reusableSections ?? settings.value.reusableSections,
    reusableBlocks: cmsPreviewSnapshot.value?.reusableBlocks ?? settings.value.reusableBlocks,
  })
}

const activeBlocksContentDiagnostics = computed(() => {
  const pageId = activeBlocksPageId.value
  const pageIndex = cmsPreviewPages.value.findIndex(page => page.id === pageId)
  if (pageIndex < 0) {
    return []
  }

  return getCmsPageDiagnosticsFromIssues(pageId, pageIndex, cmsPreviewContentDiagnostics.value).filter(issue => {
    if (activeBlocksSectionId.value && issue.sectionId && issue.sectionId !== activeBlocksSectionId.value) {
      return false
    }

    if (activeBlocksBlockId.value && issue.blockId && issue.blockId !== activeBlocksBlockId.value) {
      return false
    }

    return true
  })
})

const activeBlocksMediaDiagnostics = computed(() => {
  const pageId = activeBlocksPageId.value
  return cmsPreviewMediaDiagnostics.value.filter(diagnostic => {
    if (diagnostic.pageId !== pageId) {
      return false
    }

    if (activeBlocksSectionId.value && diagnostic.sectionId !== activeBlocksSectionId.value) {
      return false
    }

    if (activeBlocksBlockId.value && diagnostic.blockId && diagnostic.blockId !== activeBlocksBlockId.value) {
      return false
    }

    return true
  })
})

const activeBlocksPreviewMissingFromPublished = computed(() => {
  return cmsPreviewSource.value === 'published'
    && cmsPreviewSnapshot.value != null
    && activeBlocksPageId.value.length > 0
    && !cmsPreviewPages.value.some(page => page.id === activeBlocksPageId.value)
})

const selectedMediaAssetDiagnostics = computed(() => {
  const assetId = selectedMediaAssetId.value
  if (!assetId) {
    return []
  }

  return cmsMediaDiagnostics.value.filter(diagnostic => diagnostic.assetId === assetId)
})

/**
 * Returns the number of runtime references for one media asset id.
 */
function getCmsMediaUsageCount(assetId: string): number {
  return cmsMediaUsageCountByAssetId.value.get(assetId) ?? 0
}

/**
 * Returns aggregated usage details for one media asset id.
 */
function getCmsMediaUsageSummaryLabel(assetId: string): string {
  const summary = cmsMediaUsageSummaryByAssetId.value.get(assetId)
  if (!summary) {
    return tr('No runtime usage detected', 'Nenhum uso em runtime detectado')
  }

  return tr(
    `${summary.blockReferences} block refs · ${summary.brandingReferences} branding refs · ${summary.usageTags} usage tags`,
    `${summary.blockReferences} refs em blocos · ${summary.brandingReferences} refs em branding · ${summary.usageTags} tags de uso`
  )
}

/**
 * Filters diagnostics by media asset id for preview cards.
 */
function getCmsMediaDiagnosticsForAsset(assetId: string): CmsMediaDiagnostic[] {
  return cmsMediaDiagnostics.value.filter(diagnostic => diagnostic.assetId === assetId)
}

/**
 * Returns the number of references using one authored content model.
 */
function getCmsAuthoredContentModelUsageCount(contentModelId: string): number {
  return cmsAuthoredContentModelUsageCountById.value.get(contentModelId) ?? 0
}

/**
 * Builds a concise label for one generic entity-usage summary.
 */
function getCmsEntityUsageSummaryLabel(entityId: string, entityMap: Map<string, {
  pageReferences: number
  reusableSectionReferences: number
  reusableBlockReferences: number
  authoredPresetReferences: number
  totalReferences: number
}>): string {
  const summary = entityMap.get(entityId)
  if (!summary || summary.totalReferences === 0) {
    return tr('No engine usage detected', 'Nenhum uso no engine detectado')
  }

  const parts: string[] = []
  if (summary.pageReferences > 0) {
    parts.push(tr(`${summary.pageReferences} page refs`, `${summary.pageReferences} refs em paginas`))
  }
  if (summary.reusableSectionReferences > 0) {
    parts.push(tr(`${summary.reusableSectionReferences} reusable section refs`, `${summary.reusableSectionReferences} refs em secoes reutilizaveis`))
  }
  if (summary.reusableBlockReferences > 0) {
    parts.push(tr(`${summary.reusableBlockReferences} reusable block refs`, `${summary.reusableBlockReferences} refs em blocos reutilizaveis`))
  }
  if (summary.authoredPresetReferences > 0) {
    parts.push(tr(`${summary.authoredPresetReferences} preset refs`, `${summary.authoredPresetReferences} refs em presets`))
  }

  return parts.join(' · ')
}

/**
 * Returns a readable usage label for one authored content model.
 */
function getCmsAuthoredContentModelUsageSummaryLabel(contentModelId: string): string {
  return getCmsEntityUsageSummaryLabel(contentModelId, cmsEntityUsageIndex.value.contentModels)
}

/**
 * Returns the number of references using one authored block preset.
 */
function getCmsAuthoredBlockPresetUsageCount(presetId: string): number {
  return cmsAuthoredBlockPresetUsageCountById.value.get(presetId) ?? 0
}

/**
 * Returns a readable usage label for one authored block preset.
 */
function getCmsAuthoredBlockPresetUsageSummaryLabel(presetId: string): string {
  return getCmsEntityUsageSummaryLabel(presetId, cmsEntityUsageIndex.value.authoredBlockPresets)
}

/**
 * Returns the number of references using one reusable block.
 */
function getCmsReusableBlockUsageCount(reusableBlockId: string): number {
  return cmsReusableBlockUsageCountById.value.get(reusableBlockId) ?? 0
}

/**
 * Returns a readable usage label for one reusable block.
 */
function getCmsReusableBlockUsageSummaryLabel(reusableBlockId: string): string {
  return getCmsEntityUsageSummaryLabel(reusableBlockId, cmsEntityUsageIndex.value.reusableBlocks)
}

/**
 * Returns the number of references using one reusable section.
 */
function getCmsReusableSectionUsageCount(reusableSectionId: string): number {
  return cmsReusableSectionUsageCountById.value.get(reusableSectionId) ?? 0
}

/**
 * Returns a readable usage label for one reusable section.
 */
function getCmsReusableSectionUsageSummaryLabel(reusableSectionId: string): string {
  return getCmsEntityUsageSummaryLabel(reusableSectionId, cmsEntityUsageIndex.value.reusableSections)
}

/**
 * Opens the shared usage drawer for one reusable/content-model entity.
 */
function openCmsUsageDrawer(kind: CmsEntityUsageTargetKind, entityId: string, title: string, subtitle = ''): void {
  cmsUsageDrawerTarget.value = {
    kind,
    entityId,
    title: title.trim(),
    subtitle: subtitle.trim(),
  }
  isCmsUsageDrawerOpen.value = true
}

/**
 * Returns a readable localized label for one usage reference source.
 */
function getCmsUsageReferenceSourceLabel(reference: CmsEntityUsageReference): string {
  switch (reference.source) {
    case 'page':
      return tr('Page', 'Pagina')
    case 'reusable-section':
      return tr('Reusable section', 'Secao reutilizavel')
    case 'reusable-block':
      return tr('Reusable block', 'Bloco reutilizavel')
    case 'authored-block-preset':
      return tr('Authored preset', 'Preset authored')
    default:
      return tr('Unknown source', 'Origem desconhecida')
  }
}

const selectedReusableBlock = computed<CmsReusableBlockSettings | null>(() => {
  return settings.value.reusableBlocks.find(reusableBlock => reusableBlock.id === selectedReusableBlockId.value) ?? null
})

const selectedAuthoredBlockPreset = computed<CmsAuthoredBlockPresetSettings | null>(() => {
  return settings.value.authoredBlockPresets.find(preset => preset.id === selectedAuthoredBlockPresetId.value) ?? null
})

/**
 * Resolves one replacement label from the current entity collection.
 */
function getCmsReplacementLabel<T extends { id: string }>(
  replacementEntityId: string | null | undefined,
  entries: T[],
  getLabel: (entry: T) => string
): string {
  const replacementId = String(replacementEntityId ?? '').trim()
  if (!replacementId) {
    return ''
  }

  const entry = entries.find(candidate => candidate.id === replacementId)
  return entry ? getLabel(entry) : ''
}

/**
 * Resolves the replacement-assistant impact preview for one deprecated entity.
 */
function getCmsReplacementAssistantSummary(
  targetKind: CmsReplacementAssistantTargetKind,
  entityId: string
): CmsReplacementAssistantSummary | null {
  switch (targetKind) {
    case 'reusable-section':
      return cmsReusableSectionReplacementAssistantById.value.get(entityId) ?? null
    case 'reusable-block':
      return cmsReusableBlockReplacementAssistantById.value.get(entityId) ?? null
    case 'authored-block-preset':
      return cmsAuthoredBlockPresetReplacementAssistantById.value.get(entityId) ?? null
    default:
      return null
  }
}

/**
 * Formats one concise replacement-impact label for authoring surfaces.
 */
function getCmsReplacementAssistantSummaryLabel(
  targetKind: CmsReplacementAssistantTargetKind,
  entityId: string
): string {
  const summary = getCmsReplacementAssistantSummary(targetKind, entityId)
  if (!summary?.replacementEntityId) {
    return ''
  }

  if (!summary.canApply || summary.totalReferences === 0) {
    return tr('No active references will be updated', 'Nenhuma referencia ativa sera atualizada')
  }

  const parts: string[] = []
  if (summary.pageReferences > 0) {
    parts.push(tr(`${summary.pageReferences} page refs`, `${summary.pageReferences} refs em paginas`))
  }
  if (summary.reusableSectionReferences > 0) {
    parts.push(tr(`${summary.reusableSectionReferences} reusable section refs`, `${summary.reusableSectionReferences} refs em secoes reutilizaveis`))
  }
  if (summary.reusableBlockReferences > 0) {
    parts.push(tr(`${summary.reusableBlockReferences} reusable block refs`, `${summary.reusableBlockReferences} refs em blocos reutilizaveis`))
  }
  if (summary.authoredPresetReferences > 0) {
    parts.push(tr(`${summary.authoredPresetReferences} preset refs`, `${summary.authoredPresetReferences} refs em presets`))
  }

  return `${tr('Will update', 'Vai atualizar')} ${parts.join(' · ')}`
}

/**
 * Applies one deprecated-entity replacement across current CMS draft references.
 */
function applyCmsDeprecatedReplacement(
  targetKind: CmsReplacementAssistantTargetKind,
  entityId: string
): void {
  const preview = getCmsReplacementAssistantSummary(targetKind, entityId)
  if (!preview?.replacementEntityId) {
    savedAtLabel.value = tr(
      'Select a replacement entity before applying the rewrite.',
      'Selecione uma entidade substituta antes de aplicar a reescrita.'
    )
    return
  }

  if (!preview.canApply || preview.totalReferences === 0) {
    savedAtLabel.value = tr(
      'No active references require replacement.',
      'Nenhuma referencia ativa precisa de substituicao.'
    )
    return
  }

  const result = applyCmsDeprecatedEntityReplacement({
    targetKind,
    entityId,
    replacementEntityId: preview.replacementEntityId,
    pages: settings.value.pages,
    authoredContentModels: settings.value.authoredContentModels,
    authoredBlockPresets: settings.value.authoredBlockPresets,
    reusableBlocks: settings.value.reusableBlocks,
    reusableSections: settings.value.reusableSections,
  })

  settings.value.pages = result.pages
  settings.value.reusableSections = result.reusableSections
  settings.value.reusableBlocks = result.reusableBlocks
  settings.value.authoredBlockPresets = result.authoredBlockPresets

  if (targetKind === 'reusable-block' && selectedReusableBlockId.value === entityId) {
    selectedReusableBlockId.value = preview.replacementEntityId
  }
  if (targetKind === 'authored-block-preset' && selectedAuthoredBlockPresetId.value === entityId) {
    selectedAuthoredBlockPresetId.value = preview.replacementEntityId as CmsBlockPresetId
  }

  savedAtLabel.value = `${tr('Replacement applied at', 'Substituicao aplicada as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Returns authored schema-field preset replacements compatible with one preset.
 */
function getCmsFieldPresetReplacementOptions(
  preset: CmsAuthoredContentModelFieldPresetSettings
): Array<{ label: string; value: string }> {
  return settings.value.authoredContentModelFieldPresets
    .filter(candidate => candidate.id !== preset.id)
    .filter(candidate => !isCmsArchivedEntity(candidate))
    .filter(candidate => candidate.field.type === preset.field.type)
    .map(candidate => ({
      label: getCmsAuthoredContentModelFieldPresetNameValue(candidate),
      value: candidate.id,
    }))
}

/**
 * Returns reusable-section replacements compatible with one section template.
 */
function getCmsReusableSectionReplacementOptions(
  reusableSection: CmsReusableSectionSettings
): Array<{ label: string; value: string }> {
  return settings.value.reusableSections
    .filter(candidate => candidate.id !== reusableSection.id)
    .filter(candidate => !isCmsArchivedEntity(candidate))
    .filter(candidate => candidate.contentModelId === reusableSection.contentModelId)
    .filter(candidate => candidate.presetId === reusableSection.presetId)
    .map(candidate => ({
      label: candidate.name,
      value: candidate.id,
    }))
}

/**
 * Returns reusable-block replacements compatible with one reusable block.
 */
function getCmsReusableBlockReplacementOptions(
  reusableBlock: CmsReusableBlockSettings
): Array<{ label: string; value: string }> {
  return settings.value.reusableBlocks
    .filter(candidate => candidate.id !== reusableBlock.id)
    .filter(candidate => !isCmsArchivedEntity(candidate))
    .filter(candidate => candidate.type === reusableBlock.type)
    .map(candidate => ({
      label: candidate.name,
      value: candidate.id,
    }))
}

/**
 * Returns authored-preset replacements compatible with one authored block preset.
 */
function getCmsAuthoredBlockPresetReplacementOptions(
  preset: CmsAuthoredBlockPresetSettings
): Array<{ label: string; value: string }> {
  return settings.value.authoredBlockPresets
    .filter(candidate => candidate.id !== preset.id)
    .filter(candidate => !isCmsArchivedEntity(candidate))
    .filter(candidate => candidate.type === preset.type)
    .map(candidate => ({
      label: getCmsAuthoredBlockPresetNameValue(candidate),
      value: candidate.id,
    }))
}

/**
 * Checks whether a value is a plain object record.
 */
function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Resolves the locale currently being authored in CMS content modules.
 */
function getActiveCmsAuthoringLocale(): CmsLocale {
  return resolveCmsLocale(settings.value.content.locale)
}

/**
 * Resolves one page title for the active authoring locale.
 */
function getCmsPageTitleValue(page: CmsPageSettings): string {
  return resolveCmsLocalizedText({
    baseValue: page.title,
    localized: page.localization?.title,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one page description for the active authoring locale.
 */
function getCmsPageDescriptionValue(page: CmsPageSettings): string {
  return resolveCmsLocalizedText({
    baseValue: page.description,
    localized: page.localization?.description,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Returns one empty field draft scaffold for authored content-model editing.
 */
function createEmptyCmsContentModelFieldDraft(): CmsContentModelFieldDraft {
  return {
    id: '',
    type: 'text',
    label: '',
    labelPtBr: '',
    description: '',
    descriptionPtBr: '',
    placeholder: '',
    placeholderPtBr: '',
    group: '',
    groupPtBr: '',
    orderValue: '',
    required: false,
    repeatable: false,
    minValue: '',
    maxValue: '',
    defaultValue: '',
    nestedFieldsJson: '',
    optionsDraft: '',
    mediaKinds: [],
    referenceKinds: [],
    visibilityEnabled: false,
    visibilitySource: 'field',
    visibilityFieldId: '',
    visibilityOperator: 'equals',
    visibilityValue: '',
  }
}

function getCmsFieldPtBrLocalizationValue(
  localized: CmsLocalizedTextRecord | undefined
): string {
  return localized?.['pt-BR'] ?? ''
}

function createCmsContentModelFieldDraftLocalization(
  value: string
): CmsLocalizedTextRecord | undefined {
  const normalized = String(value ?? '').trim()
  if (normalized.length === 0) {
    return undefined
  }

  return {
    'pt-BR': normalized,
  }
}

function createCmsContentModelFieldDraftLocalizations(
  field: CmsContentModelFieldDraft
): CmsContentModelFieldLocalizationSettings | undefined {
  const label = createCmsContentModelFieldDraftLocalization(field.labelPtBr)
  const description = createCmsContentModelFieldDraftLocalization(field.descriptionPtBr)
  const placeholder = createCmsContentModelFieldDraftLocalization(field.placeholderPtBr)
  const group = createCmsContentModelFieldDraftLocalization(field.groupPtBr)

  if (!label && !description && !placeholder && !group) {
    return undefined
  }

  return {
    ...(label ? { label } : {}),
    ...(description ? { description } : {}),
    ...(placeholder ? { placeholder } : {}),
    ...(group ? { group } : {}),
  }
}

function resolveCmsContentModelFieldDraftText(input: {
  baseValue: string
  ptBrValue: string
  localeInput?: unknown
}): string {
  if (resolveCmsLocale(input.localeInput) === 'pt-BR' && input.ptBrValue.trim().length > 0) {
    return input.ptBrValue
  }

  return input.baseValue
}

/**
 * Builds one editable field draft from a persisted schema-field preset payload.
 */
function createCmsContentModelFieldDraftFromSettings(
  field: CmsContentModelFieldSettings
): CmsContentModelFieldDraft {
  return {
    id: field.id,
    type: field.type,
    label: field.label,
    labelPtBr: getCmsFieldPtBrLocalizationValue(field.localization?.label),
    description: field.description,
    descriptionPtBr: getCmsFieldPtBrLocalizationValue(field.localization?.description),
    placeholder: field.placeholder,
    placeholderPtBr: getCmsFieldPtBrLocalizationValue(field.localization?.placeholder),
    group: field.group,
    groupPtBr: getCmsFieldPtBrLocalizationValue(field.localization?.group),
    orderValue: field.order == null ? '1' : String(field.order),
    required: field.required,
    repeatable: Boolean(field.repeatable),
    minValue: field.min == null ? '' : String(field.min),
    maxValue: field.max == null ? '' : String(field.max),
    defaultValue: field.type === 'object' || field.type === 'group'
      ? formatCmsJsonFieldValue(field.defaultValue, field.type === 'group' ? [] : {})
      : (Array.isArray(field.defaultValue)
          ? formatCmsRepeatableFieldValue(field.defaultValue)
          : (field.defaultValue == null ? '' : String(field.defaultValue))),
    nestedFieldsJson: formatCmsJsonFieldValue(field.fields ?? [], []),
    optionsDraft: (field.options ?? []).map(option => option.value).join('\n'),
    mediaKinds: [...(field.mediaKinds ?? [])],
    referenceKinds: [...(field.referenceKinds ?? [])],
    visibilityEnabled: Boolean(field.visibility),
    visibilitySource: field.visibility?.source ?? 'field',
    visibilityFieldId: field.visibility?.fieldId ?? '',
    visibilityOperator: field.visibility?.operator ?? 'equals',
    visibilityValue: field.visibility?.value == null ? '' : String(field.visibility.value),
  }
}

/**
 * Converts one editable field draft into the persisted content-model field payload.
 */
function createCmsContentModelFieldSettingsFromDraft(
  field: CmsContentModelFieldDraft
): CmsContentModelFieldSettings {
  const order = Number(field.orderValue)
  const min = field.minValue.trim().length > 0 ? Number(field.minValue) : null
  const max = field.maxValue.trim().length > 0 ? Number(field.maxValue) : null
  const optionValues = parseCmsContentModelFieldOptionsDraft(field.optionsDraft)

  const nestedFields = field.type === 'object' || field.type === 'group'
    ? normalizeCmsContentModelFieldSettingsList(
        parseCmsJsonFieldValue(
          field.nestedFieldsJson,
          [],
          `${field.label || field.id || 'field'} nested fields`
        ),
        getActiveCmsAuthoringLocale()
      )
    : []

  return {
    id: field.id,
    type: field.type,
    label: field.label,
    description: field.description,
    placeholder: field.placeholder,
    group: field.group,
    order: Number.isFinite(order) ? Math.max(1, Math.floor(order)) : 1,
    required: field.required,
    repeatable: field.type === 'object' || field.type === 'group' ? false : field.repeatable,
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
    defaultValue: field.type === 'object' || field.type === 'group'
      ? parseCmsJsonFieldValue(
          field.defaultValue,
          field.type === 'group' ? [] : {},
          `${field.label || field.id || 'field'} default value`
        )
      : (field.repeatable ? parseCmsRepeatableFieldValue(field.defaultValue) : field.defaultValue),
    mediaKinds: field.type === 'media-asset' ? [...field.mediaKinds] : undefined,
    referenceKinds: field.type === 'reference' ? [...field.referenceKinds] : undefined,
    fields: nestedFields.length > 0 ? nestedFields : undefined,
    localization: createCmsContentModelFieldDraftLocalizations(field),
    visibility: field.visibilityEnabled
      ? {
          source: field.visibilitySource,
          ...(field.visibilitySource === 'field'
            ? { fieldId: field.visibilityFieldId }
            : {}),
          operator: field.visibilityOperator,
          ...(field.visibilityOperator === 'equals'
            || field.visibilityOperator === 'not-equals'
            || field.visibilityOperator === 'contains'
            ? {
                value: field.visibilitySource === 'page-status'
                  ? (field.visibilityValue === 'published' ? 'published' : 'draft')
                  : field.visibilityValue,
              }
            : {}),
        }
      : undefined,
    options: optionValues.map(optionValue => ({
      value: optionValue,
      label: optionValue,
    })),
  }
}

/**
 * Creates a collision-safe field id when inserting presets into the current draft.
 */
function createUniqueCmsContentModelFieldDraftId(baseId: string): string {
  const occupiedIds = new Set(
    authoredContentModelFieldDrafts.value
      .map(field => String(field.id ?? '').trim())
      .filter(Boolean)
  )
  const normalizedBaseId = String(baseId ?? '').trim() || 'field'
  if (!occupiedIds.has(normalizedBaseId)) {
    return normalizedBaseId
  }

  let suffix = 2
  let candidate = `${normalizedBaseId}-${suffix}`
  while (occupiedIds.has(candidate)) {
    suffix += 1
    candidate = `${normalizedBaseId}-${suffix}`
  }

  return candidate
}

/**
 * Parses textarea-based option drafts into stable select option arrays.
 */
function parseCmsContentModelFieldOptionsDraft(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map(entry => entry.trim())
    .filter((entry, index, entries) => entry.length > 0 && entries.indexOf(entry) === index)
}

/**
 * Resolves one field preview label according to the active authoring locale.
 */
function getCmsContentModelFieldDraftPreviewLabel(field: CmsContentModelFieldDraft): string {
  return resolveCmsContentModelFieldDraftText({
    baseValue: field.label,
    ptBrValue: field.labelPtBr,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one field preview group according to the active authoring locale.
 */
function getCmsContentModelFieldDraftPreviewGroup(field: CmsContentModelFieldDraft): string {
  return resolveCmsContentModelFieldDraftText({
    baseValue: field.group,
    ptBrValue: field.groupPtBr,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Formats repeatable field values as one-entry-per-line strings for the Pages builder.
 */
function formatCmsRepeatableFieldValue(value: unknown): string {
  if (!Array.isArray(value)) {
    return ''
  }

  return value.map(entry => String(entry ?? '')).join('\n')
}

/**
 * Formats object/group schema values as stable JSON strings for CMS authoring.
 */
function formatCmsJsonFieldValue(value: unknown, fallback: unknown): string {
  const normalizedValue = value == null ? fallback : value
  return JSON.stringify(normalizedValue, null, 2)
}

/**
 * Formats one schema migration payload value for compact report rows.
 */
function formatCmsSchemaMigrationValue(value: unknown): string {
  if (value == null) {
    return tr('empty', 'vazio')
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    return normalized.length > 0 ? normalized : tr('empty', 'vazio')
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return formatCmsJsonFieldValue(value, value)
}

/**
 * Parses repeatable field values from one-entry-per-line strings.
 */
function parseCmsRepeatableFieldValue(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0)
}

/**
 * Parses one JSON-backed schema field draft and throws when the payload is invalid.
 */
function parseCmsJsonFieldValue<T>(
  value: string,
  fallback: T,
  fieldLabel: string
): T {
  const normalizedValue = String(value ?? '').trim()
  if (!normalizedValue) {
    return cloneSerializableValue(fallback)
  }

  try {
    return JSON.parse(normalizedValue) as T
  } catch {
    throw new Error(cmsUiText.value.invalidJsonForFieldLabel(fieldLabel))
  }
}

/**
 * Normalizes unknown schema values into picker-friendly media asset ids.
 */
function normalizeCmsMediaPickerModelValue(
  value: unknown,
  multiple: boolean
): string | string[] | null {
  if (multiple) {
    return Array.isArray(value)
      ? value
        .map(entry => String(entry ?? '').trim())
        .filter(entry => entry.length > 0)
      : []
  }

  const normalized = String(value ?? '').trim()
  return normalized.length > 0 ? normalized : null
}

/**
 * Builds a compact field hint with optional validation constraints.
 */
function getCmsContentModelFieldHint(field: CmsContentModelFieldDefinition): string {
  const detailParts = [field.description || field.placeholder].filter(Boolean)

  if (field.type === 'group') {
    if (field.min != null || field.max != null) {
      detailParts.push(tr(
        `Items: ${field.min ?? 0}-${field.max ?? '∞'}`,
        `Itens: ${field.min ?? 0}-${field.max ?? '∞'}`
      ))
    }

    if (field.fields.length > 0) {
      detailParts.push(tr(
        `${field.fields.length} nested fields`,
        `${field.fields.length} campos aninhados`
      ))
    }

    return detailParts.join(' · ')
  }

  if (field.type === 'object' && field.fields.length > 0) {
    detailParts.push(tr(
      `${field.fields.length} nested fields`,
      `${field.fields.length} campos aninhados`
    ))
    return detailParts.join(' · ')
  }

  if (field.repeatable) {
    if (field.min != null || field.max != null) {
      detailParts.push(tr(
        `Items: ${field.min ?? 0}-${field.max ?? '∞'}`,
        `Itens: ${field.min ?? 0}-${field.max ?? '∞'}`
      ))
    }
    return detailParts.join(' · ')
  }

  if (field.type === 'media-asset' && field.mediaKinds.length > 0) {
    detailParts.push(tr(
      `Allowed: ${field.mediaKinds.map(getCmsMediaKindLabel).join(', ')}`,
      `Permitidos: ${field.mediaKinds.map(getCmsMediaKindLabel).join(', ')}`
    ))
  }

  if (field.type === 'reference' && field.referenceKinds.length > 0) {
    detailParts.push(tr(
      `References: ${field.referenceKinds.map(getCmsReferenceKindLabel).join(', ')}`,
      `Referencias: ${field.referenceKinds.map(getCmsReferenceKindLabel).join(', ')}`
    ))
  }

  if ((field.type === 'text' || field.type === 'textarea' || field.type === 'url') && (field.min != null || field.max != null)) {
    detailParts.push(tr(
      `Length: ${field.min ?? 0}-${field.max ?? '∞'}`,
      `Comprimento: ${field.min ?? 0}-${field.max ?? '∞'}`
    ))
  }

  if (field.type === 'number' && (field.min != null || field.max != null)) {
    detailParts.push(tr(
      `Range: ${field.min ?? '−∞'}-${field.max ?? '∞'}`,
      `Faixa: ${field.min ?? '−∞'}-${field.max ?? '∞'}`
    ))
  }

  return detailParts.join(' · ')
}

/**
 * Returns whether one draft field supports scalar min/max constraints.
 */
function doesCmsContentModelFieldSupportScalarConstraints(field: CmsContentModelFieldDraft): boolean {
  return field.type === 'text'
    || field.type === 'textarea'
    || field.type === 'number'
    || field.type === 'url'
}

/**
 * Resolves the HTML input type used by authored schema-field controls.
 *
 * URL fields intentionally use `text` instead of native `url` inputs because
 * the CMS contract accepts relative paths such as `/demo`, which browsers
 * reject/sanitize on `type="url"` controls.
 */
function getCmsContentModelFieldHtmlInputType(type: CmsContentModelFieldType): 'text' | 'number' | 'date' {
  if (type === 'number') {
    return 'number'
  }

  if (type === 'date') {
    return 'date'
  }

  return 'text'
}

/**
 * Resolves the minimum constraint label for one content-model draft row.
 */
function getCmsContentModelFieldMinConstraintLabel(field: CmsContentModelFieldDraft): string {
  if (field.type === 'group') {
    return tr('Minimum items', 'Minimo de itens')
  }

  if (field.repeatable) {
    return tr('Minimum items', 'Minimo de itens')
  }

  if (field.type === 'number') {
    return tr('Minimum value', 'Valor minimo')
  }

  if (doesCmsContentModelFieldSupportScalarConstraints(field)) {
    return tr('Minimum length', 'Comprimento minimo')
  }

  return tr('Minimum constraint (unused)', 'Restricao minima (nao usada)')
}

/**
 * Resolves the maximum constraint label for one content-model draft row.
 */
function getCmsContentModelFieldMaxConstraintLabel(field: CmsContentModelFieldDraft): string {
  if (field.type === 'group') {
    return tr('Maximum items', 'Maximo de itens')
  }

  if (field.repeatable) {
    return tr('Maximum items', 'Maximo de itens')
  }

  if (field.type === 'number') {
    return tr('Maximum value', 'Valor maximo')
  }

  if (doesCmsContentModelFieldSupportScalarConstraints(field)) {
    return tr('Maximum length', 'Comprimento maximo')
  }

  return tr('Maximum constraint (unused)', 'Restricao maxima (nao usada)')
}

/**
 * Returns select-ready media options for one authored content-model draft field.
 */
function getCmsContentModelFieldDraftMediaOptions(
  field: CmsContentModelFieldDraft
): CmsMediaPickerOption[] {
  if (field.type !== 'media-asset') {
    return []
  }

  return getCmsMediaPickerOptions(field.mediaKinds)
}

/**
 * Resolves one human-friendly label for a reference catalog kind.
 */
function getCmsReferenceKindLabel(kind: CmsSchemaReferenceKind): string {
  switch (kind) {
    case 'content-model':
      return tr('Content model', 'Modelo de conteudo')
    case 'block-preset':
      return tr('Block preset', 'Preset de bloco')
    case 'reusable-block':
      return tr('Reusable block', 'Bloco reutilizavel')
    case 'reusable-section':
      return tr('Reusable section', 'Secao reutilizavel')
    default:
      return kind
  }
}

/**
 * Returns select-ready internal reference options for one authored field draft.
 */
function getCmsContentModelFieldDraftReferenceOptions(
  field: CmsContentModelFieldDraft
): Array<{ label: string; value: string; description: string }> {
  if (field.type !== 'reference') {
    return []
  }

  return listCmsSchemaReferenceOptions(field.referenceKinds, {
    localeInput: settings.value.content.locale,
    authoredContentModels: settings.value.authoredContentModels,
    authoredBlockPresets: settings.value.authoredBlockPresets,
    reusableBlocks: settings.value.reusableBlocks,
    reusableSections: settings.value.reusableSections,
  }).map(option => ({
    label: `${option.label} (${getCmsReferenceKindLabel(option.kind)})`,
    value: option.value,
    description: option.description,
  }))
}

/**
 * Returns select-ready internal reference options for one page-level field.
 */
function getCmsPageCustomFieldReferenceOptions(
  field: CmsContentModelFieldDefinition
): Array<{ label: string; value: string; description: string }> {
  if (field.type !== 'reference') {
    return []
  }

  return listCmsSchemaReferenceOptions(field.referenceKinds, {
    localeInput: settings.value.content.locale,
    authoredContentModels: settings.value.authoredContentModels,
    authoredBlockPresets: settings.value.authoredBlockPresets,
    reusableBlocks: settings.value.reusableBlocks,
    reusableSections: settings.value.reusableSections,
  }).map(option => ({
    label: `${option.label} (${getCmsReferenceKindLabel(option.kind)})`,
    value: option.value,
    description: option.description,
  }))
}

/**
 * Returns select-ready media options for one page-level media field.
 */
function getCmsPageCustomFieldMediaOptions(
  field: CmsContentModelFieldDefinition
): CmsMediaPickerOption[] {
  if (field.type !== 'media-asset') {
    return []
  }

  return getCmsMediaPickerOptions(field.mediaKinds)
}

/**
 * Returns the visibility operators allowed for one draft row source.
 */
function getCmsContentModelFieldVisibilityOperatorOptions(
  source: CmsContentModelFieldVisibilitySource
): Array<{ label: string; value: CmsContentModelFieldVisibilityOperator }> {
  return source === 'page-status'
    ? cmsContentModelFieldVisibilityOperatorOptions.value
      .filter(option => option.value === 'equals' || option.value === 'not-equals')
    : cmsContentModelFieldVisibilityOperatorOptions.value
}

/**
 * Returns whether the selected visibility operator requires an explicit comparison value.
 */
function doesCmsContentModelFieldVisibilityOperatorRequireValue(
  operator: CmsContentModelFieldVisibilityOperator
): boolean {
  return operator === 'equals'
    || operator === 'not-equals'
    || operator === 'contains'
}

/**
 * Returns available field targets for one schema-field draft row, excluding itself.
 */
function getCmsContentModelFieldVisibilityTargetOptions(
  fieldIndex: number
): Array<{ label: string; value: string }> {
  return authoredContentModelFieldDrafts.value
    .map((field, index) => ({
      field,
      index,
    }))
    .filter(entry => entry.index !== fieldIndex)
    .map(entry => ({
      label: entry.field.label || entry.field.id || tr('Untitled field', 'Campo sem titulo'),
      value: entry.field.id,
    }))
    .filter(entry => String(entry.value ?? '').trim().length > 0)
}

/**
 * Normalizes one draft row when its visibility source changes.
 */
function normalizeCmsContentModelFieldVisibilityDraft(fieldIndex: number): void {
  const fieldDraft = authoredContentModelFieldDrafts.value[fieldIndex]
  if (!fieldDraft) {
    return
  }

  if (!fieldDraft.visibilityEnabled) {
    fieldDraft.visibilitySource = 'field'
    fieldDraft.visibilityFieldId = ''
    fieldDraft.visibilityOperator = 'equals'
    fieldDraft.visibilityValue = ''
    return
  }

  if (fieldDraft.visibilitySource === 'page-status') {
    fieldDraft.visibilityFieldId = ''
    if (fieldDraft.visibilityOperator !== 'equals' && fieldDraft.visibilityOperator !== 'not-equals') {
      fieldDraft.visibilityOperator = 'equals'
    }
    fieldDraft.visibilityValue = fieldDraft.visibilityValue === 'published' ? 'published' : 'draft'
    return
  }

  const allowedOperators = new Set(
    getCmsContentModelFieldVisibilityOperatorOptions('field').map(option => option.value)
  )
  if (!allowedOperators.has(fieldDraft.visibilityOperator)) {
    fieldDraft.visibilityOperator = 'equals'
  }

  const targetOptions = getCmsContentModelFieldVisibilityTargetOptions(fieldIndex)
  if (!targetOptions.some(option => option.value === fieldDraft.visibilityFieldId)) {
    fieldDraft.visibilityFieldId = targetOptions[0]?.value ?? ''
  }
}

/**
 * Resolves the visible group label for one content-model field.
 */
function getCmsContentModelFieldGroupLabel(field: Pick<CmsContentModelFieldDefinition, 'group'>): string {
  return String(field.group ?? '').trim() || tr('General', 'Geral')
}

/**
 * Resolves the field schema attached to one page content model.
 */
function getCmsPageContentModelFields(page: CmsPageSettings): CmsContentModelFieldDefinition[] {
  const fields = getCmsContentModelFieldDefinitions(
    settings.value.content.locale,
    page.contentModelId,
    settings.value.authoredContentModels
  )

  return filterCmsVisibleContentModelFields(fields, {
    pageStatus: page.status,
    customFields: getCmsPageCustomFieldsValue(page),
  })
}

/**
 * Groups resolved page custom fields by their visible group label while preserving field order.
 */
function getCmsPageContentModelFieldGroups(page: CmsPageSettings): CmsPageContentFieldGroup[] {
  const groups = new Map<string, CmsPageContentFieldGroup>()

  for (const field of getCmsPageContentModelFields(page)) {
    const label = getCmsContentModelFieldGroupLabel(field)
    const id = label.trim().toLowerCase() || 'general'
    const existingGroup = groups.get(id)
    if (existingGroup) {
      existingGroup.fields.push(field)
      continue
    }

    groups.set(id, {
      id,
      label,
      fields: [field],
    })
  }

  return [...groups.values()]
}

/**
 * Groups resolved section custom fields by their visible group label while preserving field order.
 */
function getCmsSectionFieldGroups(section: CmsPageSectionSettings): CmsPageContentFieldGroup[] {
  const groups = new Map<string, CmsPageContentFieldGroup>()

  for (const field of getCmsSectionFieldDefinitions(section)) {
    const label = getCmsContentModelFieldGroupLabel(field)
    const id = label.trim().toLowerCase() || 'general'
    const existingGroup = groups.get(id)
    if (existingGroup) {
      existingGroup.fields.push(field)
      continue
    }

    groups.set(id, {
      id,
      label,
      fields: [field],
    })
  }

  return [...groups.values()]
}

/**
 * Resolves one page custom-fields payload for the active locale.
 */
function getCmsPageCustomFieldsValue(page: CmsPageSettings): Record<string, unknown> {
  return resolveCmsLocalizedProps({
    baseProps: isObjectRecord(page.customFields) ? page.customFields : {},
    localized: page.localization?.fields,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one visible page custom-field value for the active locale.
 */
function getCmsPageCustomFieldValue(
  page: CmsPageSettings,
  field: CmsContentModelFieldDefinition
): unknown {
  const visibleFields = getCmsPageCustomFieldsValue(page)
  return visibleFields[field.id] ?? field.defaultValue
}

/**
 * Applies one localized page custom-field edit while preserving english base values.
 */
function updateCmsPageCustomFieldValue(
  page: CmsPageSettings,
  field: CmsContentModelFieldDefinition,
  value: unknown
): void {
  let normalizedInput = field.repeatable && typeof value === 'string'
    ? parseCmsRepeatableFieldValue(value)
    : value

  if ((field.type === 'object' || field.type === 'group') && typeof value === 'string') {
    try {
      normalizedInput = parseCmsJsonFieldValue(
        value,
        field.type === 'group' ? [] : {},
        field.label
      )
    } catch (error) {
      savedAtLabel.value = error instanceof Error
        ? error.message
        : cmsUiText.value.invalidJsonForFieldLabel(field.label)
      return
    }
  }
  const visibleFields = getCmsPageCustomFieldsValue(page)
  const nextVisibleFields = {
    ...visibleFields,
    [field.id]: coerceCmsContentModelFieldValue(field, normalizedInput),
  }
  const nextValue = applyCmsLocalizedPropsUpdate({
    baseProps: isObjectRecord(page.customFields) ? page.customFields : {},
    localized: page.localization?.fields,
    localeInput: getActiveCmsAuthoringLocale(),
    nextValue: nextVisibleFields,
  })

  page.customFields = nextValue.baseProps
  page.localization = {
    ...(page.localization ?? {}),
    fields: nextValue.localized,
  }
}

/**
 * Resolves the field schema attached to one section preset.
 */
function getCmsSectionFieldDefinitions(section: CmsPageSectionSettings): CmsContentModelFieldDefinition[] {
  const resolvedSection = resolveCmsPageSectionForAuthoring(section)
  const fields = getCmsSectionPresetFieldDefinitions(
    settings.value.content.locale,
    resolvedSection.presetId
  )

  return filterCmsVisibleContentModelFields(fields, {
    pageStatus: activeBlocksPage.value?.status ?? 'draft',
    customFields: getCmsSectionCustomFieldsValue(section),
  })
}

/**
 * Resolves one section custom-fields payload for the active locale.
 * Linked sections read from their reusable source while detached sections read local state.
 */
function getCmsSectionCustomFieldsValue(section: CmsPageSectionSettings): Record<string, unknown> {
  const resolvedSection = resolveCmsPageSectionForAuthoring(section)

  return resolveCmsLocalizedProps({
    baseProps: isObjectRecord(resolvedSection.customFields) ? resolvedSection.customFields : {},
    localized: resolvedSection.localization?.fields,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one visible section custom-field value for the active locale.
 */
function getCmsSectionCustomFieldValue(
  section: CmsPageSectionSettings,
  field: CmsContentModelFieldDefinition
): unknown {
  const visibleFields = getCmsSectionCustomFieldsValue(section)
  return visibleFields[field.id] ?? field.defaultValue
}

/**
 * Applies one localized section custom-field edit while preserving english base values.
 */
function updateCmsSectionCustomFieldValue(
  section: CmsPageSectionSettings,
  field: CmsContentModelFieldDefinition,
  value: unknown
): void {
  const sourcePage = settings.value.pages[activeBlocksPageIndex.value]
  const sourceSection = sourcePage?.sections.find(entry => entry.id === section.id) ?? section
  let normalizedInput = field.repeatable && typeof value === 'string'
    ? parseCmsRepeatableFieldValue(value)
    : value

  if ((field.type === 'object' || field.type === 'group') && typeof value === 'string') {
    try {
      normalizedInput = parseCmsJsonFieldValue(
        value,
        field.type === 'group' ? [] : {},
        field.label
      )
    } catch (error) {
      savedAtLabel.value = error instanceof Error
        ? error.message
        : cmsUiText.value.invalidJsonForFieldLabel(field.label)
      return
    }
  }
  const visibleFields = getCmsSectionCustomFieldsValue(section)
  const nextVisibleFields = {
    ...visibleFields,
    [field.id]: coerceCmsContentModelFieldValue(field, normalizedInput),
  }
  const nextValue = applyCmsLocalizedPropsUpdate({
    baseProps: isObjectRecord(sourceSection.customFields) ? sourceSection.customFields : {},
    localized: sourceSection.localization?.fields,
    localeInput: getActiveCmsAuthoringLocale(),
    nextValue: nextVisibleFields,
  })

  sourceSection.customFields = normalizeCmsSectionCustomFieldsForPreset(
    nextValue.baseProps,
    sourceSection.presetId,
    settings.value.content.locale
  )
  sourceSection.localization = {
    ...(sourceSection.localization ?? {}),
    fields: nextValue.localized,
  }
}

/**
 * Resolves one section label for the active authoring locale.
 */
function getCmsSectionLabelValue(section: CmsPageSettings['sections'][number]): string {
  return resolveCmsLocalizedText({
    baseValue: section.label,
    localized: section.localization?.label,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one section with linked reusable references for authoring previews and labels.
 */
function resolveCmsPageSectionForAuthoring(section: CmsPageSectionSettings): CmsPageSectionSettings {
  return resolveCmsReusableSectionReference({
    section,
    reusableSections: settings.value.reusableSections,
    reusableBlocks: settings.value.reusableBlocks,
  })
}

/**
 * Returns whether one page section is still linked to the reusable section library.
 */
function isCmsPageSectionLinked(section: CmsPageSectionSettings | null | undefined): boolean {
  return Boolean(section && section.reusableMode === 'linked' && String(section.reusableSourceId ?? '').trim().length > 0)
}

/**
 * Returns whether one page block is still linked to the reusable block library.
 */
function isCmsPageBlockLinked(block: CmsPageBlockSettings | null | undefined): boolean {
  return Boolean(block && block.reusableMode === 'linked' && String(block.reusableSourceId ?? '').trim().length > 0)
}

/**
 * Resolves a concise reusable-source label for section and block chips.
 */
function getCmsReusableSourceLabel(sourceId: string | null | undefined, kind: 'section' | 'block'): string {
  const normalizedId = String(sourceId ?? '').trim()
  if (!normalizedId) {
    return tr('Unknown source', 'Origem desconhecida')
  }

  if (kind === 'section') {
    const reusableSection = settings.value.reusableSections.find(entry => entry.id === normalizedId)
    return reusableSection?.name || normalizedId
  }

  const reusableBlock = settings.value.reusableBlocks.find(entry => entry.id === normalizedId)
  return reusableBlock?.name || normalizedId
}

/**
 * Returns whether one reusable section is a branched variant of another section.
 */
function isCmsReusableSectionVariant(section: CmsReusableSectionSettings | null | undefined): boolean {
  return Boolean(String(section?.branchSourceId ?? '').trim())
}

/**
 * Returns whether one reusable block is a branched variant of another block.
 */
function isCmsReusableBlockVariant(block: CmsReusableBlockSettings | null | undefined): boolean {
  return Boolean(String(block?.branchSourceId ?? '').trim())
}

/**
 * Builds a readable branch label for reusable section variants.
 */
function getCmsReusableSectionVariantLabel(section: CmsReusableSectionSettings): string {
  if (!isCmsReusableSectionVariant(section)) {
    return ''
  }

  return tr(
    `Variant of ${getCmsReusableSourceLabel(section.branchSourceId, 'section')}`,
    `Variante de ${getCmsReusableSourceLabel(section.branchSourceId, 'section')}`
  )
}

/**
 * Builds a readable branch label for reusable block variants.
 */
function getCmsReusableBlockVariantLabel(block: CmsReusableBlockSettings): string {
  if (!isCmsReusableBlockVariant(block)) {
    return ''
  }

  return tr(
    `Variant of ${getCmsReusableSourceLabel(block.branchSourceId, 'block')}`,
    `Variante de ${getCmsReusableSourceLabel(block.branchSourceId, 'block')}`
  )
}

/**
 * Resolves one reusable-section label for the active authoring locale.
 */
function getCmsReusableSectionLabelValue(section: CmsReusableSectionSettings): string {
  return resolveCmsLocalizedText({
    baseValue: section.label,
    localized: section.localization?.label,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored content model name for the active authoring locale.
 */
function getCmsAuthoredContentModelNameValue(model: CmsAuthoredContentModelSettings): string {
  return resolveCmsLocalizedText({
    baseValue: model.name,
    localized: model.localization?.name,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored content model description for the active authoring locale.
 */
function getCmsAuthoredContentModelDescriptionValue(model: CmsAuthoredContentModelSettings): string {
  return resolveCmsLocalizedText({
    baseValue: model.description,
    localized: model.localization?.description,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored schema-field preset name for the active authoring locale.
 */
function getCmsAuthoredContentModelFieldPresetNameValue(
  preset: CmsAuthoredContentModelFieldPresetSettings
): string {
  return resolveCmsLocalizedText({
    baseValue: preset.name,
    localized: preset.localization?.name,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored schema-field preset description for the active authoring locale.
 */
function getCmsAuthoredContentModelFieldPresetDescriptionValue(
  preset: CmsAuthoredContentModelFieldPresetSettings
): string {
  return resolveCmsLocalizedText({
    baseValue: preset.description,
    localized: preset.localization?.description,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored content-model default page title for the active authoring locale.
 */
function getCmsAuthoredContentModelDefaultPageTitleValue(model: CmsAuthoredContentModelSettings): string {
  return resolveCmsLocalizedText({
    baseValue: model.defaultPageTitle,
    localized: model.localization?.pageTitle,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored content-model default page description for the active authoring locale.
 */
function getCmsAuthoredContentModelDefaultPageDescriptionValue(model: CmsAuthoredContentModelSettings): string {
  return resolveCmsLocalizedText({
    baseValue: model.defaultPageDescription,
    localized: model.localization?.pageDescription,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves authored content-model migration notes for the active authoring locale.
 */
function getCmsAuthoredContentModelMigrationNotesValue(model: CmsAuthoredContentModelSettings): string {
  return resolveCmsLocalizedText({
    baseValue: String(model.migrationNotes ?? ''),
    localized: model.localization?.migrationNotes,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored block preset name for the active authoring locale.
 */
function getCmsAuthoredBlockPresetNameValue(preset: CmsAuthoredBlockPresetSettings): string {
  return resolveCmsLocalizedText({
    baseValue: preset.name,
    localized: preset.localization?.name,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Resolves one authored block preset description for the active authoring locale.
 */
function getCmsAuthoredBlockPresetDescriptionValue(preset: CmsAuthoredBlockPresetSettings): string {
  return resolveCmsLocalizedText({
    baseValue: preset.description,
    localized: preset.localization?.description,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Applies a localized page title edit to the page payload.
 */
function updateCmsPageTitleValue(page: CmsPageSettings, value: unknown): void {
  const nextValue = applyCmsLocalizedTextUpdate({
    baseValue: page.title,
    localized: page.localization?.title,
    localeInput: getActiveCmsAuthoringLocale(),
    nextValue: value,
  })
  page.title = nextValue.baseValue
  page.localization = {
    ...(page.localization ?? {}),
    title: nextValue.localized,
  }
}

/**
 * Applies a localized page description edit to the page payload.
 */
function updateCmsPageDescriptionValue(page: CmsPageSettings, value: unknown): void {
  const nextValue = applyCmsLocalizedTextUpdate({
    baseValue: page.description,
    localized: page.localization?.description,
    localeInput: getActiveCmsAuthoringLocale(),
    nextValue: value,
  })
  page.description = nextValue.baseValue
  page.localization = {
    ...(page.localization ?? {}),
    description: nextValue.localized,
  }
}

/**
 * Applies a localized section label edit to the section payload.
 */
function updateCmsSectionLabelValue(section: CmsPageSettings['sections'][number], value: unknown): void {
  const nextValue = applyCmsLocalizedTextUpdate({
    baseValue: section.label,
    localized: section.localization?.label,
    localeInput: getActiveCmsAuthoringLocale(),
    nextValue: value,
  })
  section.label = nextValue.baseValue
  section.localization = {
    ...(section.localization ?? {}),
    label: nextValue.localized,
  }
}

/**
 * Resolves effective block props for the currently selected authoring locale.
 */
function getActiveBlocksResolvedProps(target: CmsPageBlockSettings | null): Record<string, unknown> {
  if (!target) {
    return {}
  }

  const resolvedTarget = resolveCmsReusableBlockReference({
    block: target,
    reusableBlocks: settings.value.reusableBlocks,
  })

  return resolveCmsLocalizedProps({
    baseProps: resolvedTarget.props,
    localized: resolvedTarget.localization?.props,
    localeInput: getActiveCmsAuthoringLocale(),
  })
}

/**
 * Applies a full localized props update to the selected block payload.
 */
function applyLocalizedPropsToBlock(target: CmsPageBlockSettings, nextProps: Record<string, unknown>): void {
  const nextLocalizationValue = applyCmsLocalizedPropsUpdate({
    baseProps: target.props,
    localized: target.localization?.props,
    localeInput: getActiveCmsAuthoringLocale(),
    nextValue: nextProps,
  })

  target.props = nextLocalizationValue.baseProps
  target.localization = {
    ...(target.localization ?? {}),
    props: nextLocalizationValue.localized,
  }
}

/**
 * Resolves a nested property value from a path expression.
 */
function getNestedPropByPath(source: Record<string, unknown>, path: string): unknown {
  const segments = path.split('.').map(part => part.trim()).filter(Boolean)
  let current: unknown = source
  for (const segment of segments) {
    if (!isObjectRecord(current)) {
      return undefined
    }
    current = current[segment]
  }
  return current
}

/**
 * Sets or clears a nested property value from a path expression.
 */
function setNestedPropByPath(source: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split('.').map(part => part.trim()).filter(Boolean)
  if (segments.length === 0) {
    return
  }

  let current: Record<string, unknown> = source
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]
    if (!segment) {
      continue
    }
    const currentValue = current[segment]
    if (!isObjectRecord(currentValue)) {
      current[segment] = {}
    }
    current = current[segment] as Record<string, unknown>
  }

  const leaf = segments[segments.length - 1]
  if (!leaf) {
    return
  }

  if (value === undefined) {
    delete current[leaf]
    return
  }
  current[leaf] = value
}

/**
 * Synchronizes full block props JSON draft from selected block state.
 */
function syncSelectedBlockPropsDraft(): void {
  activeBlocksPropsDraft.value = JSON.stringify(getActiveBlocksResolvedProps(activeBlocksSelectedBlock.value), null, 2)
}

/**
 * Synchronizes JSON field drafts for advanced field definitions.
 */
function syncSelectedBlockFieldJsonDrafts(): void {
  const target = activeBlocksSelectedBlock.value
  const resolvedProps = getActiveBlocksResolvedProps(target)
  const nextDrafts: Record<string, string> = {}

  for (const field of activeBlocksFieldDefinitions.value) {
    if (field.type !== 'json') {
      continue
    }

    const rawValue = getNestedPropByPath(resolvedProps, field.path)
    if (rawValue === undefined) {
      nextDrafts[field.path] = field.help?.toLowerCase().includes('array') ? '[]' : '{}'
      continue
    }

    nextDrafts[field.path] = JSON.stringify(rawValue, null, 2)
  }

  activeBlocksFieldJsonDrafts.value = nextDrafts
}

/**
 * Returns current model value for a dynamic block field.
 */
function getActiveBlocksFieldModelValue(field: CmsBlockFieldDefinition): string | number | boolean {
  const target = activeBlocksSelectedBlock.value
  const rawValue = getNestedPropByPath(getActiveBlocksResolvedProps(target), field.path)

  if (field.type === 'toggle') {
    return Boolean(rawValue)
  }

  if (field.type === 'number') {
    if (typeof rawValue === 'number') {
      return rawValue
    }
    if (typeof rawValue === 'string' && rawValue.trim().length > 0) {
      const parsed = Number(rawValue)
      return Number.isFinite(parsed) ? parsed : ''
    }
    return ''
  }

  if (field.type === 'json') {
    return activeBlocksFieldJsonDrafts.value[field.path] ?? '{}'
  }

  return rawValue == null ? '' : String(rawValue)
}

/**
 * Returns a safe model value for number inputs.
 */
function getActiveBlocksNumberFieldModelValue(field: CmsBlockFieldDefinition): string | number {
  const value = getActiveBlocksFieldModelValue(field)
  if (typeof value === 'number' || typeof value === 'string') {
    return value
  }
  return ''
}

/**
 * Returns filtered media asset options for block fields bound to the media library.
 */
function getActiveBlocksMediaFieldOptions(field: CmsBlockFieldDefinition): Array<{
  label: string
  value: string
  description: string
  kind: CmsMediaAssetKind
  kindLabel: string
  url: string
  alt: string
  disable: boolean
  incompatible: boolean
}> {
  if (field.type !== 'media-asset') {
    return []
  }

  return getCmsMediaPickerOptions(field.mediaKinds)
}

/**
 * Updates selected block value for primitive/select/toggle fields.
 */
function updateActiveBlocksFieldValue(field: CmsBlockFieldDefinition, value: unknown): void {
  const target = activeBlocksSelectedBlock.value
  if (!target || field.type === 'json' || activeBlocksSelectionReadOnly.value) {
    return
  }

  const nextProps = getActiveBlocksResolvedProps(target)

  if (field.type === 'toggle') {
    setNestedPropByPath(nextProps, field.path, Boolean(value))
    applyLocalizedPropsToBlock(target, nextProps)
    syncSelectedBlockPropsDraft()
    return
  }

  if (field.type === 'number') {
    const raw = String(value ?? '').trim()
    if (raw.length === 0) {
      setNestedPropByPath(nextProps, field.path, undefined)
      applyLocalizedPropsToBlock(target, nextProps)
      syncSelectedBlockPropsDraft()
      return
    }
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) {
      setNestedPropByPath(nextProps, field.path, parsed)
      applyLocalizedPropsToBlock(target, nextProps)
      syncSelectedBlockPropsDraft()
    }
    return
  }

  if (field.type === 'media-asset') {
    const assetId = String(value ?? '').trim()
    const selectedAsset = settings.value.mediaAssets.find(asset => asset.id === assetId)

    setNestedPropByPath(nextProps, field.path, assetId || undefined)

    if (selectedAsset && field.mediaTargetPath) {
      setNestedPropByPath(nextProps, field.mediaTargetPath, selectedAsset.url || undefined)
    }

    if (selectedAsset && field.mediaAltTargetPath && selectedAsset.alt.trim().length > 0) {
      setNestedPropByPath(nextProps, field.mediaAltTargetPath, selectedAsset.alt)
    }

    applyLocalizedPropsToBlock(target, nextProps)
    syncSelectedBlockPropsDraft()
    return
  }

  const normalized = String(value ?? '')
  setNestedPropByPath(nextProps, field.path, normalized)
  applyLocalizedPropsToBlock(target, nextProps)
  syncSelectedBlockPropsDraft()
}

/**
 * Updates JSON field draft without applying immediately.
 */
function updateActiveBlocksJsonFieldDraft(field: CmsBlockFieldDefinition, value: unknown): void {
  activeBlocksFieldJsonDrafts.value = {
    ...activeBlocksFieldJsonDrafts.value,
    [field.path]: String(value ?? ''),
  }
}

/**
 * Applies JSON field draft into selected block props.
 */
function applyActiveBlocksJsonFieldValue(field: CmsBlockFieldDefinition): void {
  const target = activeBlocksSelectedBlock.value
  if (!target || field.type !== 'json' || activeBlocksSelectionReadOnly.value) {
    return
  }

  const draft = String(activeBlocksFieldJsonDrafts.value[field.path] ?? '').trim()
  const nextProps = getActiveBlocksResolvedProps(target)
  if (!draft) {
    setNestedPropByPath(nextProps, field.path, undefined)
    applyLocalizedPropsToBlock(target, nextProps)
    syncSelectedBlockPropsDraft()
    return
  }

  try {
    const parsed = JSON.parse(draft) as unknown
    setNestedPropByPath(nextProps, field.path, parsed)
    applyLocalizedPropsToBlock(target, nextProps)
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
  } catch {
    savedAtLabel.value = cmsUiText.value.invalidJsonForFieldLabel(field.label)
  }
}

const cmsMediaAssetOptions = computed(() => {
  return settings.value.mediaAssets.map(asset => ({
    label: `${asset.name} (${getCmsMediaKindLabel(asset.kind)})`,
    value: asset.id,
    description: asset.description,
  }))
})

const cmsMediaReplacementOptions = computed(() => {
  return settings.value.mediaAssets
    .filter(asset => asset.id !== selectedMediaAssetId.value)
    .map(asset => ({
      label: `${asset.name} (${getCmsMediaKindLabel(asset.kind)})`,
      value: asset.id,
      description: asset.description,
    }))
})

const selectedMediaAsset = computed<CmsMediaAssetSettings | null>(() => {
  return settings.value.mediaAssets.find(asset => asset.id === selectedMediaAssetId.value) ?? null
})

const cmsMediaAssets = computed<CmsMediaAssetSettings[]>(() => {
  return settings.value.mediaAssets
})

const cmsBrandingMediaBindings = computed<CmsBrandingMediaBindingPreview[]>(() => {
  const brandingReferences = cmsBrandingMediaReferences.value
  const resolveAssetRecord = (url: string): CmsMediaAssetSettings | null => {
    return settings.value.mediaAssets.find(asset => asset.url === url) ?? null
  }

  const faviconUrl = settings.value.branding.faviconUrl || settings.value.branding.brandLogo

  return [
    {
      id: 'brand-logo',
      label: tr('Brand logo binding', 'Vinculo do logo da marca'),
      description: tr('Shell and landing identity asset.', 'Asset de identidade do shell e da landing page.'),
      url: settings.value.branding.brandLogo,
      assetName: resolveAssetRecord(settings.value.branding.brandLogo)?.name ?? tr('Custom URL', 'URL customizada'),
      assetId: brandingReferences.find(reference => reference.slot === 'brandLogo')?.assetId,
    },
    {
      id: 'favicon',
      label: tr('Favicon binding', 'Vinculo do favicon'),
      description: tr('Browser tab and bookmark icon asset.', 'Asset do icone da aba do navegador e favoritos.'),
      url: faviconUrl,
      assetName: resolveAssetRecord(faviconUrl)?.name ?? tr('Custom URL', 'URL customizada'),
      assetId: brandingReferences.find(reference => reference.slot === 'faviconUrl')?.assetId,
    },
    {
      id: 'user-avatar',
      label: tr('User avatar binding', 'Vinculo do avatar do usuario'),
      description: tr('Topbar account avatar asset.', 'Asset do avatar de conta na topbar.'),
      url: settings.value.branding.userAvatar,
      assetName: resolveAssetRecord(settings.value.branding.userAvatar)?.name ?? tr('Custom URL', 'URL customizada'),
      assetId: brandingReferences.find(reference => reference.slot === 'userAvatar')?.assetId,
    },
  ]
})

/**
 * Resolves display label from block palette metadata.
 */
function resolveCmsBlockDisplayName(type: string): string {
  return cmsBlockPaletteByType.get(type)?.displayName ?? type
}

/**
 * Creates a builder state from active page and current section/block selection.
 */
function buildActivePageBuilderState(): CmsBuilderState | null {
  const page = activeBlocksPage.value
  if (!page) {
    return null
  }

  let state = createCmsBuilderState(toCmsPageSchema(page))
  const desiredSelection: CmsBuilderSelection | null = activeBlocksSectionId.value
    ? {
      sectionId: activeBlocksSectionId.value,
      blockId: activeBlocksBlockId.value || undefined,
    }
    : null

  if (desiredSelection) {
    try {
      state = selectCmsBuilderNode(state, desiredSelection)
    } catch {
      // Ignore stale selection and keep builder fallback selection.
    }
  }

  return state
}

/**
 * Persists builder schema output back into one page settings entry.
 */
function applyBuilderStateToPage(pageIndex: number, state: CmsBuilderState): void {
  const currentPage = settings.value.pages[pageIndex]
  if (!currentPage) {
    return
  }

  settings.value.pages[pageIndex] = fromCmsPageSchema(state.page, currentPage)
  if (pageIndex === activeBlocksPageIndex.value) {
    activeBlocksSectionId.value = state.selection?.sectionId ?? ''
    activeBlocksBlockId.value = state.selection?.blockId ?? ''
  }
}

/**
 * Persists builder schema output back into active page settings.
 */
function applyBuilderStateToActivePage(state: CmsBuilderState): void {
  const pageIndex = activeBlocksPageIndex.value
  if (pageIndex < 0) {
    return
  }

  applyBuilderStateToPage(pageIndex, state)
}

/**
 * Sets the active section/block selection for blocks manager controls.
 */
function setActiveBlocksSelection(sectionId: string, blockId = ''): void {
  activeBlocksSectionId.value = sectionId
  activeBlocksBlockId.value = blockId
}

/**
 * Switches the shell back to the Pages module.
 */
function openPagesModule(): void {
  activeMenuId.value = pagesModuleId.value
}

/**
 * Switches the shell to the Media module.
 */
function openMediaModule(): void {
  activeMenuId.value = mediaModuleId.value
}

/**
 * Switches to Settings and focuses a specific authoring tab.
 */
function openSettingsTabById(
  tabId: 'branding' | 'typography' | 'layout' | 'colors' | 'menu' | 'topbar' | 'content'
): void {
  activeMenuId.value = settingsModuleId.value
  activeSettingsTab.value = tabId
}

/**
 * Toggles the designer canvas grid overlay for the current workbench shell.
 */
function toggleCmsDesignerStageGrid(): void {
  showCmsDesignerStageGrid.value = !showCmsDesignerStageGrid.value
}

/**
 * Scrolls one designer surface into view inside the current CMS page.
 */
function scrollCmsDesignerSurface(selector: string): void {
  if (typeof document === 'undefined') {
    return
  }

  const target = document.querySelector<HTMLElement>(selector)
  target?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
}

type CmsDesignerPreviewModule = 'settings' | 'pages' | 'blocks'
type CmsDesignerWorkspaceView = 'editor' | 'preview'

/**
 * Resolves the preview anchor selector used by one CMS designer module.
 */
function getCmsDesignerPreviewSelector(module: CmsDesignerPreviewModule): string {
  switch (module) {
    case 'settings':
      return '.cms-settings .cms-preview-card, .cms-settings .cms-config-section__example'
    case 'pages':
      return '.cms-pages__preview'
    default:
      return '.cms-blocks__preview'
  }
}

/**
 * Builds the explicit preview-launch URL so Preview always opens in a new tab.
 */
function buildCmsDesignerPreviewUrl(module: CmsDesignerPreviewModule): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const url = new URL(window.location.href)
  url.searchParams.set('cms', '1')
  url.searchParams.set('cmsModule', module)
  url.searchParams.set('cmsPreview', '1')

  if (module === 'pages' || module === 'blocks') {
    url.searchParams.set('cmsPreviewSource', cmsPreviewSource.value)
    url.searchParams.set('cmsPreviewLocale', cmsPreviewLocale.value)
    url.searchParams.set('cmsPreviewViewport', cmsPreviewViewport.value)
  } else {
    url.searchParams.delete('cmsPreviewSource')
    url.searchParams.delete('cmsPreviewLocale')
    url.searchParams.delete('cmsPreviewViewport')
  }

  return url.toString()
}

/**
 * Opens the most relevant preview surface for the current designer module in a dedicated tab.
 */
function showCmsDesignerPreview(module: CmsDesignerPreviewModule): void {
  if (module === 'settings') {
    cmsSettingsWorkspaceView.value = 'preview'
  } else if (module === 'pages') {
    cmsPagesWorkspaceView.value = 'preview'
  } else if (module === 'blocks') {
    cmsBlocksWorkspaceView.value = 'preview'
  }

  nextTick(() => {
    scrollCmsDesignerSurface(getCmsDesignerPreviewSelector(module))
  })
}

function setCmsWorkspaceTab(module: CmsDesignerPreviewModule, value: string): void {
  if (value !== 'editor' && value !== 'preview') {
    return
  }

  cmsDesignerPreviewMode.value = false

  if (value === 'preview') {
    showCmsDesignerPreview(module)
    return
  }

  if (module === 'settings') {
    cmsSettingsWorkspaceView.value = 'editor'
  } else if (module === 'pages') {
    cmsPagesWorkspaceView.value = 'editor'
  } else {
    cmsBlocksWorkspaceView.value = 'editor'
  }
}

function onSettingsWorkspaceTabChange(value: string): void {
  setCmsWorkspaceTab('settings', value)
}

function onPagesWorkspaceTabChange(value: string): void {
  setCmsWorkspaceTab('pages', value)
}

function onBlocksWorkspaceTabChange(value: string): void {
  setCmsWorkspaceTab('blocks', value)
}

function openCmsDesignerPreviewInWindow(module: CmsDesignerPreviewModule): void {
  if (typeof window === 'undefined') {
    return
  }

  const previewUrl = buildCmsDesignerPreviewUrl(module)
  if (!previewUrl) {
    return
  }

  window.open(previewUrl, '_blank', 'noopener,noreferrer')
}

/**
 * Switches the shell back to the Releases module.
 */
function openReleasesModule(): void {
  activeMenuId.value = releasesModuleId.value
}

/**
 * Opens the blocks module focused on a specific page/section.
 */
function openPageInBlocksEditor(pageId: string, sectionId?: string): void {
  const page = settings.value.pages.find(entry => entry.id === pageId)
  if (!page) {
    return
  }

  const resolvedSection = sectionId
    ? page.sections.find(entry => entry.id === sectionId)
    : page.sections[0]
  const resolvedBlockId = resolvedSection?.blocks?.[0]?.id ?? ''

  activeBlocksPageId.value = page.id
  setActiveBlocksSelection(resolvedSection?.id ?? '', resolvedBlockId)
  activeMenuId.value = blocksModuleId.value
}

/**
 * Runs one checklist drill-down action from the Releases module.
 */
function runReleaseChecklistDrilldown(action: CmsReleaseChecklistDrilldownAction): void {
  switch (action.target) {
    case 'branding':
      openSettingsTabById('branding')
      return
    case 'content':
      openSettingsTabById('content')
      return
    case 'pages':
      openPagesModule()
      return
    case 'blocks':
      if (action.pageId) {
        openPageInBlocksEditor(action.pageId, action.sectionId ?? undefined)
        return
      }
      openPagesModule()
      return
    case 'media':
      openMediaModule()
      return
    case 'releases':
    default:
      openReleasesModule()
  }
}

/**
 * Resolves page index from persistent page id.
 */
function findCmsPageIndexById(pageId: string): number {
  return settings.value.pages.findIndex(page => page.id === pageId)
}

/**
 * Runs the currently selected builder command for Pages or Blocks.
 */
function executeSelectedBuilderCommand(): void {
  const commandValue = String(selectedBuilderCommandId.value ?? '').trim()
  if (!commandValue) {
    return
  }

  const [scope, action, ...payloadParts] = commandValue.split(':')
  const payload = payloadParts.join(':')

  if (scope === 'pages') {
    if (action === 'create') {
      createCmsPageFromSelectedTemplate(resolveCmsPageTemplateId(payload))
      return
    }
    if (action === 'create-open') {
      createCmsPageFromSelectedTemplate(resolveCmsPageTemplateId(payload), { openBlocksAfterCreate: true })
      return
    }
    if (action === 'quick-start') {
      runCmsPageQuickStart(resolveCmsPageTemplateId(payload))
      return
    }
    if (action === 'starter-kit') {
      runCmsStarterKit(payload as CmsStarterKitId)
      return
    }
    if (action === 'starter-kit-open') {
      runCmsStarterKit(payload as CmsStarterKitId, true)
      return
    }

    const pageIndex = findCmsPageIndexById(payload)
    if (pageIndex < 0) {
      return
    }

    if (action === 'open') {
      openPageInBlocksEditor(payload)
      return
    }
    if (action === 'scaffold') {
      applyCmsPageContentModelStarterSections(pageIndex)
      return
    }
    if (action === 'defaults') {
      applyCmsPageContentModelDefaults(pageIndex)
      return
    }
    if (action === 'sync') {
      syncCmsPageContentModelVersion(pageIndex)
      return
    }
    return
  }

  if (scope === 'blocks') {
    if (action === 'open-pages') {
      openPagesModule()
      return
    }
    if (action === 'section') {
      const section = activeBlocksSections.value.find(entry => entry.id === payload)
      if (!section) {
        return
      }
      setActiveBlocksSelection(section.id, section.blocks[0]?.id ?? '')
      savedAtLabel.value = `${tr('Section focused at', 'Secao focada as')} ${new Date().toLocaleTimeString()}`
      return
    }
    if (action === 'block') {
      const [sectionId, blockId] = payloadParts
      if (!sectionId || !blockId) {
        return
      }
      setActiveBlocksSelection(sectionId, blockId)
      savedAtLabel.value = `${tr('Block selected at', 'Bloco selecionado as')} ${new Date().toLocaleTimeString()}`
      return
    }
    if (action === 'reusable') {
      if (!settings.value.reusableBlocks.some(block => block.id === payload)) {
        return
      }
      selectedReusableBlockId.value = payload
      savedAtLabel.value = `${tr('Reusable block selected at', 'Bloco reutilizavel selecionado as')} ${new Date().toLocaleTimeString()}`
      return
    }
    if (action === 'preset') {
      const presetId = resolveCmsBlockPresetId(payload)
      if (!settings.value.authoredBlockPresets.some(preset => preset.id === presetId)) {
        return
      }
      selectCmsAuthoredPreset(presetId)
      savedAtLabel.value = `${tr('Preset selected at', 'Preset selecionado as')} ${new Date().toLocaleTimeString()}`
    }
  }
}

/**
 * Saves the currently selected block as a reusable library entry.
 */
function saveSelectedBlockAsReusable(): void {
  const rawBlock = activeBlocksSelectedBlock.value
  const blockRecord = activeBlocksSelectedBlockRecord.value
  if (!rawBlock || !blockRecord) {
    savedAtLabel.value = tr('Select a block before saving it as reusable.', 'Selecione um bloco antes de salva-lo como reutilizavel.')
    return
  }

  const block = resolveCmsReusableBlockReference({
    block: rawBlock,
    reusableBlocks: settings.value.reusableBlocks,
  })
  const paletteEntry = cmsBlockPaletteByType.get(block.type)
  const reusableBlock = createCmsReusableBlockFromBlock({
    block,
    existingBlocks: settings.value.reusableBlocks,
    displayName: resolveCmsBlockDisplayName(block.type),
    name: reusableBlockNameDraft.value,
    description: reusableBlockDescriptionDraft.value,
    category: paletteEntry?.category ?? 'custom',
  })

  settings.value.reusableBlocks = [reusableBlock, ...settings.value.reusableBlocks]
  selectedReusableBlockId.value = reusableBlock.id
  reusableBlockNameDraft.value = ''
  reusableBlockDescriptionDraft.value = ''
  savedAtLabel.value = `${tr('Reusable block saved at', 'Bloco reutilizavel salvo as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Creates one reusable block variant from an existing reusable source.
 */
function createReusableBlockVariant(reusableBlockId: string): CmsReusableBlockSettings | null {
  const sourceReusableBlock = settings.value.reusableBlocks.find(reusableBlock => reusableBlock.id === reusableBlockId)
  if (!sourceReusableBlock) {
    return null
  }

  const variant = createCmsReusableBlockVariantFromReusable({
    reusableBlock: sourceReusableBlock,
    existingBlocks: settings.value.reusableBlocks,
  })

  settings.value.reusableBlocks = [variant, ...settings.value.reusableBlocks]
  selectedReusableBlockId.value = variant.id
  savedAtLabel.value = `${tr('Reusable block variant created at', 'Variante de bloco reutilizavel criada as')} ${new Date().toLocaleTimeString()}`
  return variant
}

/**
 * Branches the selected block into a new reusable variant and relinks the page block to it.
 */
function branchCmsBuilderBlockToVariant(blockRecord: CmsSectionBlockRecord): void {
  const page = settings.value.pages[blockRecord.pageIndex]
  const section = page?.sections[blockRecord.sectionIndex]
  const rawBlock = section?.blocks[blockRecord.blockIndex]
  if (!page || !section || !rawBlock) {
    return
  }

  const sourceReusableBlock = rawBlock.reusableSourceId
    ? settings.value.reusableBlocks.find(reusableBlock => reusableBlock.id === rawBlock.reusableSourceId) ?? null
    : null
  const resolvedBlock = resolveCmsReusableBlockReference({
    block: rawBlock,
    reusableBlocks: settings.value.reusableBlocks,
  })

  const variant = createCmsReusableBlockFromBlock({
    block: resolvedBlock,
    existingBlocks: settings.value.reusableBlocks,
    displayName: resolveCmsBlockDisplayName(resolvedBlock.type),
    name: sourceReusableBlock
      ? undefined
      : `${resolveCmsBlockDisplayName(resolvedBlock.type)} ${tr('Variant', 'Variante')}`,
    description: sourceReusableBlock?.description ?? '',
    category: sourceReusableBlock?.category ?? 'custom',
    sourceReusableBlock,
  })

  settings.value.reusableBlocks = [variant, ...settings.value.reusableBlocks]
  selectedReusableBlockId.value = variant.id
  section.blocks.splice(blockRecord.blockIndex, 1, {
    ...cloneCmsReusableBlockIntoPageBlock({
      reusableBlock: variant,
      blockId: rawBlock.id,
      mode: 'linked',
    }),
    id: rawBlock.id,
    enabled: rawBlock.enabled,
  })
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
  savedAtLabel.value = `${tr('Reusable block branched at', 'Bloco reutilizavel ramificado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Inserts the selected reusable block into the current section and restores its authored props.
 */
function insertSelectedReusableBlock(): void {
  const reusableBlock = selectedReusableBlock.value
  const state = buildActivePageBuilderState()
  if (!reusableBlock || !state) {
    return
  }

  const sectionId = activeBlocksSectionId.value || state.selection?.sectionId || state.page.sections[0]?.id
  if (!sectionId) {
    savedAtLabel.value = tr('Select a section before inserting a reusable block.', 'Selecione uma secao antes de inserir um bloco reutilizavel.')
    return
  }

  const nextState = insertCmsBuilderBlock(state, landingRegistry, {
    sectionId,
    type: reusableBlock.type,
  })
  applyBuilderStateToActivePage(nextState)

  const pageIndex = activeBlocksPageIndex.value
  const insertedBlockId = nextState.selection?.blockId
  const insertedSectionId = nextState.selection?.sectionId
  const page = pageIndex >= 0 ? settings.value.pages[pageIndex] : null
  const section = page?.sections.find(entry => entry.id === insertedSectionId)
  const insertedBlock = section?.blocks.find(entry => entry.id === insertedBlockId)
  if (!insertedBlock) {
    return
  }

  const clonedBlock = cloneCmsReusableBlockIntoPageBlock({
    reusableBlock,
    blockId: insertedBlock.id,
    mode: 'detached',
  })
  insertedBlock.type = clonedBlock.type
  insertedBlock.presetId = clonedBlock.presetId
  insertedBlock.props = cloneSerializableValue(clonedBlock.props)
  insertedBlock.enabled = clonedBlock.enabled
  insertedBlock.localization = clonedBlock.localization
    ? cloneSerializableValue(clonedBlock.localization)
    : undefined
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
  savedAtLabel.value = `${tr('Reusable block inserted at', 'Bloco reutilizavel inserido as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Inserts the selected reusable block as a linked reference.
 */
function insertSelectedLinkedReusableBlock(): void {
  const reusableBlock = selectedReusableBlock.value
  const state = buildActivePageBuilderState()
  if (!reusableBlock || !state) {
    return
  }

  const sectionId = activeBlocksSectionId.value || state.selection?.sectionId || state.page.sections[0]?.id
  if (!sectionId) {
    savedAtLabel.value = tr('Select a section before inserting a reusable block.', 'Selecione uma secao antes de inserir um bloco reutilizavel.')
    return
  }

  const nextState = insertCmsBuilderBlock(state, landingRegistry, {
    sectionId,
    type: reusableBlock.type,
  })
  applyBuilderStateToActivePage(nextState)

  const pageIndex = activeBlocksPageIndex.value
  const insertedBlockId = nextState.selection?.blockId
  const insertedSectionId = nextState.selection?.sectionId
  const page = pageIndex >= 0 ? settings.value.pages[pageIndex] : null
  const section = page?.sections.find(entry => entry.id === insertedSectionId)
  const insertedBlock = section?.blocks.find(entry => entry.id === insertedBlockId)
  if (!insertedBlock) {
    return
  }

  const linkedBlock = cloneCmsReusableBlockIntoPageBlock({
    reusableBlock,
    blockId: insertedBlock.id,
    mode: 'linked',
  })
  insertedBlock.type = linkedBlock.type
  insertedBlock.presetId = linkedBlock.presetId
  insertedBlock.props = cloneSerializableValue(linkedBlock.props)
  insertedBlock.enabled = linkedBlock.enabled
  insertedBlock.reusableMode = linkedBlock.reusableMode
  insertedBlock.reusableSourceId = linkedBlock.reusableSourceId
  insertedBlock.localization = linkedBlock.localization
    ? cloneSerializableValue(linkedBlock.localization)
    : undefined
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
  savedAtLabel.value = `${tr('Linked reusable block inserted at', 'Bloco reutilizavel vinculado inserido as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Detaches a linked block from its reusable source while preserving the resolved content snapshot.
 */
function detachCmsBuilderBlockByRecord(blockRecord: CmsSectionBlockRecord): void {
  const page = settings.value.pages[blockRecord.pageIndex]
  const section = page?.sections[blockRecord.sectionIndex]
  const block = section?.blocks[blockRecord.blockIndex]
  if (!page || !section || !block || !isCmsPageBlockLinked(block)) {
    return
  }

  const detachedBlock = detachCmsPageBlockFromReusable({
    block,
    reusableBlocks: settings.value.reusableBlocks,
  })
  section.blocks.splice(blockRecord.blockIndex, 1, detachedBlock)
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
  savedAtLabel.value = `${tr('Reusable block detached at', 'Bloco reutilizavel desvinculado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Archives one reusable block template while preserving existing references.
 */
function archiveReusableBlock(reusableBlockId: string): void {
  settings.value.reusableBlocks = settings.value.reusableBlocks.map(reusableBlock => (
    reusableBlock.id === reusableBlockId
      ? archiveCmsEntity(reusableBlock)
      : reusableBlock
  ))
  savedAtLabel.value = `${tr('Reusable block archived at', 'Bloco reutilizavel arquivado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Restores one archived reusable block template to the visible authoring library.
 */
function unarchiveReusableBlock(reusableBlockId: string): void {
  settings.value.reusableBlocks = settings.value.reusableBlocks.map(reusableBlock => (
    reusableBlock.id === reusableBlockId
      ? unarchiveCmsEntity(reusableBlock)
      : reusableBlock
  ))
  selectedReusableBlockId.value = reusableBlockId
  savedAtLabel.value = `${tr('Reusable block restored at', 'Bloco reutilizavel restaurado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Marks one reusable block as deprecated for new authoring flows.
 */
function deprecateReusableBlock(reusableBlockId: string): void {
  settings.value.reusableBlocks = settings.value.reusableBlocks.map(reusableBlock => (
    reusableBlock.id === reusableBlockId
      ? deprecateCmsEntity(reusableBlock)
      : reusableBlock
  ))
  savedAtLabel.value = `${tr('Reusable block deprecated at', 'Bloco reutilizavel descontinuado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Clears deprecation metadata from one reusable block.
 */
function undeprecateReusableBlock(reusableBlockId: string): void {
  settings.value.reusableBlocks = settings.value.reusableBlocks.map(reusableBlock => (
    reusableBlock.id === reusableBlockId
      ? undeprecateCmsEntity(reusableBlock)
      : reusableBlock
  ))
  selectedReusableBlockId.value = reusableBlockId
  savedAtLabel.value = `${tr('Reusable block reinstated at', 'Bloco reutilizavel reativado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Updates one reusable block replacement target.
 */
function updateReusableBlockReplacement(reusableBlockId: string, replacementEntityId: unknown): void {
  settings.value.reusableBlocks = settings.value.reusableBlocks.map(reusableBlock => (
    reusableBlock.id === reusableBlockId
      ? updateCmsDeprecatedEntityReplacement(reusableBlock, String(replacementEntityId ?? ''))
      : reusableBlock
  ))
}

/**
 * Updates one reusable block deprecation note.
 */
function updateReusableBlockDeprecationNote(reusableBlockId: string, deprecationNote: unknown): void {
  settings.value.reusableBlocks = settings.value.reusableBlocks.map(reusableBlock => (
    reusableBlock.id === reusableBlockId
      ? updateCmsDeprecatedEntityNote(reusableBlock, String(deprecationNote ?? ''))
      : reusableBlock
  ))
}

/**
 * Clears authored content-model selection and starts a new draft.
 */
function createNewAuthoredContentModelDraft(): void {
  selectedAuthoredContentModelId.value = ''
  authoredContentModelNameDraft.value = ''
  authoredContentModelDescriptionDraft.value = ''
  authoredContentModelDefaultPageTitleDraft.value = ''
  authoredContentModelDefaultPageDescriptionDraft.value = ''
  authoredContentModelDefaultPagePathPrefixDraft.value = ''
  authoredContentModelMigrationNotesDraft.value = ''
  authoredContentModelAllowedSectionSelections.value = [...cmsContentModelPresetOptions.value.map(option => option.value)]
  authoredContentModelRequiredSectionSelections.value = []
  authoredContentModelStarterSectionSelections.value = ['hero']
  authoredContentModelRecommendedSectionSelections.value = ['hero']
  authoredContentModelMaxSectionsDraft.value = ''
  authoredContentModelPresetLimitDrafts.value = {}
  authoredContentModelFieldDrafts.value = []
}

/**
 * Adds one empty field row to the authored content-model draft.
 */
function addAuthoredContentModelFieldDraft(): void {
  authoredContentModelFieldDrafts.value = [
    ...authoredContentModelFieldDrafts.value,
    createEmptyCmsContentModelFieldDraft(),
  ]
}

/**
 * Removes one field row from the authored content-model draft.
 */
function removeAuthoredContentModelFieldDraft(fieldIndex: number): void {
  authoredContentModelFieldDrafts.value = authoredContentModelFieldDrafts.value
    .filter((_, index) => index !== fieldIndex)
}

/**
 * Saves one authored schema-field preset from the current content-model draft row.
 */
function saveAuthoredContentModelFieldDraftAsPreset(fieldIndex: number): void {
  const fieldDraft = authoredContentModelFieldDrafts.value[fieldIndex]
  if (!fieldDraft) {
    return
  }

  const locale = getActiveCmsAuthoringLocale()
  let presetField: CmsContentModelFieldSettings

  try {
    presetField = createCmsContentModelFieldSettingsFromDraft(fieldDraft)
  } catch (error) {
    savedAtLabel.value = error instanceof Error
      ? error.message
      : cmsUiText.value.invalidJsonForFieldLabel(fieldDraft.label || fieldDraft.id || 'field')
    return
  }

  const preset = createCmsAuthoredContentModelFieldPreset({
    field: presetField,
    existingPresets: settings.value.authoredContentModelFieldPresets,
    localeInput: locale,
    name: fieldDraft.label || fieldDraft.id,
    description: fieldDraft.description,
    category: fieldDraft.group || fieldDraft.type,
  })

  settings.value.authoredContentModelFieldPresets = [
    preset,
    ...settings.value.authoredContentModelFieldPresets,
  ]
  selectedAuthoredContentModelFieldPresetId.value = preset.id
  savedAtLabel.value = `${tr('Field preset saved at', 'Preset de campo salvo as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Inserts the selected authored schema-field preset into the current content-model draft.
 */
function insertSelectedAuthoredContentModelFieldPreset(): void {
  const preset = selectedAuthoredContentModelFieldPresetSettings.value
  if (!preset) {
    return
  }

  const nextDraft = createCmsContentModelFieldDraftFromSettings(preset.field)
  nextDraft.id = createUniqueCmsContentModelFieldDraftId(nextDraft.id)
  authoredContentModelFieldDrafts.value = [
    ...authoredContentModelFieldDrafts.value,
    nextDraft,
  ]
  savedAtLabel.value = `${tr('Field preset applied at', 'Preset de campo aplicado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Archives one authored schema-field preset while preserving existing authored schemas.
 */
function archiveCmsAuthoredContentModelFieldPreset(
  presetId: CmsAuthoredContentModelFieldPresetId
): void {
  settings.value.authoredContentModelFieldPresets = settings.value.authoredContentModelFieldPresets
    .map(preset => (preset.id === presetId ? archiveCmsEntity(preset) : preset))
  savedAtLabel.value = `${tr('Field preset archived at', 'Preset de campo arquivado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Restores one archived authored schema-field preset to the active preset library.
 */
function unarchiveCmsAuthoredContentModelFieldPreset(
  presetId: CmsAuthoredContentModelFieldPresetId
): void {
  settings.value.authoredContentModelFieldPresets = settings.value.authoredContentModelFieldPresets
    .map(preset => (preset.id === presetId ? unarchiveCmsEntity(preset) : preset))
  selectedAuthoredContentModelFieldPresetId.value = presetId
  savedAtLabel.value = `${tr('Field preset restored at', 'Preset de campo restaurado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Marks one authored schema-field preset as deprecated for new schema authoring flows.
 */
function deprecateCmsAuthoredContentModelFieldPreset(
  presetId: CmsAuthoredContentModelFieldPresetId
): void {
  settings.value.authoredContentModelFieldPresets = settings.value.authoredContentModelFieldPresets
    .map(preset => (preset.id === presetId ? deprecateCmsEntity(preset) : preset))
  savedAtLabel.value = `${tr('Field preset deprecated at', 'Preset de campo descontinuado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Clears deprecation metadata from one authored schema-field preset.
 */
function undeprecateCmsAuthoredContentModelFieldPreset(
  presetId: CmsAuthoredContentModelFieldPresetId
): void {
  settings.value.authoredContentModelFieldPresets = settings.value.authoredContentModelFieldPresets
    .map(preset => (preset.id === presetId ? undeprecateCmsEntity(preset) : preset))
  selectedAuthoredContentModelFieldPresetId.value = presetId
  savedAtLabel.value = `${tr('Field preset reinstated at', 'Preset de campo reativado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Updates one authored schema-field preset replacement target.
 */
function updateCmsAuthoredContentModelFieldPresetReplacement(
  presetId: CmsAuthoredContentModelFieldPresetId,
  replacementEntityId: unknown
): void {
  settings.value.authoredContentModelFieldPresets = settings.value.authoredContentModelFieldPresets
    .map(preset => (
      preset.id === presetId
        ? updateCmsDeprecatedEntityReplacement(preset, String(replacementEntityId ?? ''))
        : preset
    ))
}

/**
 * Updates one authored schema-field preset deprecation note.
 */
function updateCmsAuthoredContentModelFieldPresetDeprecationNote(
  presetId: CmsAuthoredContentModelFieldPresetId,
  deprecationNote: unknown
): void {
  settings.value.authoredContentModelFieldPresets = settings.value.authoredContentModelFieldPresets
    .map(preset => (
      preset.id === presetId
        ? updateCmsDeprecatedEntityNote(preset, String(deprecationNote ?? ''))
        : preset
    ))
}

/**
 * Selects one replacement schema-field preset when the replacement id matches the authored preset contract.
 */
function selectCmsReplacementFieldPreset(replacementEntityId: string | null | undefined): void {
  const resolvedReplacementId = String(replacementEntityId ?? '').trim()
  selectedAuthoredContentModelFieldPresetId.value = resolvedReplacementId.startsWith('field-preset:')
    ? resolvedReplacementId as CmsAuthoredContentModelFieldPresetId
    : ''
}

/**
 * Clears allowed section-preset selections for the authored content-model draft.
 */
function clearAuthoredContentModelAllowedPresets(): void {
  authoredContentModelAllowedSectionSelections.value = []
  authoredContentModelRequiredSectionSelections.value = []
  authoredContentModelStarterSectionSelections.value = []
  authoredContentModelRecommendedSectionSelections.value = []
  authoredContentModelPresetLimitDrafts.value = {}
}

/**
 * Selects the full preset library for the authored content-model draft.
 */
function selectAllAuthoredContentModelAllowedPresets(): void {
  authoredContentModelAllowedSectionSelections.value = [...cmsContentModelPresetOptions.value.map(option => option.value)]
}

/**
 * Checks whether an authored content-model draft already allows a section preset.
 */
function isAuthoredContentModelAllowedPresetSelected(presetId: CmsSectionPresetId): boolean {
  return authoredContentModelAllowedSectionSelections.value.includes(presetId)
}

/**
 * Toggles one allowed section preset inside the authored content-model draft.
 */
function toggleAuthoredContentModelAllowedPreset(presetId: CmsSectionPresetId): void {
  if (isAuthoredContentModelAllowedPresetSelected(presetId)) {
    authoredContentModelAllowedSectionSelections.value = authoredContentModelAllowedSectionSelections.value
      .filter(value => value !== presetId)
    return
  }

  authoredContentModelAllowedSectionSelections.value = [
    ...authoredContentModelAllowedSectionSelections.value,
    presetId,
  ]
}

/**
 * Returns the authored draft repetition limit for one allowed section preset.
 */
function getAuthoredContentModelPresetLimitDraft(presetId: CmsSectionPresetId): string {
  return authoredContentModelPresetLimitDrafts.value[presetId] ?? ''
}

/**
 * Updates the authored draft repetition limit for one allowed section preset.
 */
function updateAuthoredContentModelPresetLimitDraft(presetId: CmsSectionPresetId, value: unknown): void {
  const normalizedValue = String(value ?? '').trim()
  const nextDrafts = {
    ...authoredContentModelPresetLimitDrafts.value,
  }

  if (!normalizedValue) {
    delete nextDrafts[presetId]
  } else {
    nextDrafts[presetId] = normalizedValue
  }

  authoredContentModelPresetLimitDrafts.value = nextDrafts
}

/**
 * Builds a concise preview string for authored preset repetition limits.
 */
function getAuthoredContentModelPresetLimitSummary(): string {
  const limitEntries = cmsContentModelPresetLimitOptions.value
    .map(option => {
      const limit = getAuthoredContentModelPresetLimitDraft(option.value)
      if (!limit) {
        return ''
      }

      return `${option.label} x${limit}`
    })
    .filter(Boolean)

  return limitEntries.length > 0
    ? limitEntries.join(', ')
    : tr('Unlimited', 'Ilimitado')
}

/**
 * Synchronizes authored content-model drafts with the selected library entry.
 */
function syncSelectedAuthoredContentModelDrafts(): void {
  const model = selectedAuthoredContentModel.value
  if (!model) {
    createNewAuthoredContentModelDraft()
    return
  }

  authoredContentModelNameDraft.value = getCmsAuthoredContentModelNameValue(model)
  authoredContentModelDescriptionDraft.value = getCmsAuthoredContentModelDescriptionValue(model)
  authoredContentModelDefaultPageTitleDraft.value = getCmsAuthoredContentModelDefaultPageTitleValue(model)
  authoredContentModelDefaultPageDescriptionDraft.value = getCmsAuthoredContentModelDefaultPageDescriptionValue(model)
  authoredContentModelDefaultPagePathPrefixDraft.value = model.defaultPagePathPrefix
  authoredContentModelMigrationNotesDraft.value = getCmsAuthoredContentModelMigrationNotesValue(model)
  authoredContentModelAllowedSectionSelections.value = [...model.allowedPresets]
  authoredContentModelRequiredSectionSelections.value = [...model.requiredPresets]
  authoredContentModelStarterSectionSelections.value = [...model.starterPresets]
  authoredContentModelRecommendedSectionSelections.value = [...model.recommendedPresets]
  authoredContentModelMaxSectionsDraft.value = model.maxSections == null ? '' : String(model.maxSections)
  authoredContentModelPresetLimitDrafts.value = Object.fromEntries(
    Object.entries(model.sectionPresetLimits).map(([presetId, limit]) => [presetId, String(limit)])
  ) as Partial<Record<CmsSectionPresetId, string>>
  authoredContentModelFieldDrafts.value = (model.fields ?? []).map(createCmsContentModelFieldDraftFromSettings)
}

/**
 * Creates or updates an authored content model from the current draft values.
 */
function saveCmsAuthoredContentModelDraft(): void {
  const locale = getActiveCmsAuthoringLocale()
  const selectedModel = selectedAuthoredContentModel.value
  let fieldSettings: CmsContentModelFieldSettings[]

  try {
    fieldSettings = authoredContentModelFieldDrafts.value.map(createCmsContentModelFieldSettingsFromDraft)
  } catch (error) {
    savedAtLabel.value = error instanceof Error
      ? error.message
      : cmsUiText.value.invalidJsonForFieldLabel('field')
    return
  }

  if (!selectedModel) {
    const nextModel = createCmsAuthoredContentModel({
      existingModels: settings.value.authoredContentModels,
      localeInput: locale,
      name: authoredContentModelNameDraft.value,
      description: authoredContentModelDescriptionDraft.value,
      defaultPageTitle: authoredContentModelDefaultPageTitleDraft.value,
      defaultPageDescription: authoredContentModelDefaultPageDescriptionDraft.value,
      defaultPagePathPrefix: authoredContentModelDefaultPagePathPrefixDraft.value,
      migrationNotes: authoredContentModelMigrationNotesDraft.value,
      allowedPresets: authoredContentModelAllowedSectionSelections.value,
      requiredPresets: authoredContentModelRequiredSectionSelections.value,
      starterPresets: authoredContentModelStarterSectionSelections.value,
      recommendedPresets: authoredContentModelRecommendedSectionSelections.value,
      maxSections: authoredContentModelMaxSectionsDraft.value,
      sectionPresetLimits: authoredContentModelPresetLimitDrafts.value,
      fields: fieldSettings,
    })

    settings.value.authoredContentModels = [nextModel, ...settings.value.authoredContentModels]
    selectedAuthoredContentModelId.value = nextModel.id
    savedAtLabel.value = `${tr('Content model saved at', 'Modelo de conteudo salvo as')} ${new Date().toLocaleTimeString()}`
    return
  }

  const updatedModel = updateCmsAuthoredContentModel({
    model: selectedModel,
    localeInput: locale,
    name: authoredContentModelNameDraft.value,
    description: authoredContentModelDescriptionDraft.value,
    defaultPageTitle: authoredContentModelDefaultPageTitleDraft.value,
    defaultPageDescription: authoredContentModelDefaultPageDescriptionDraft.value,
    defaultPagePathPrefix: authoredContentModelDefaultPagePathPrefixDraft.value,
    migrationNotes: authoredContentModelMigrationNotesDraft.value,
    allowedPresets: authoredContentModelAllowedSectionSelections.value,
    requiredPresets: authoredContentModelRequiredSectionSelections.value,
    starterPresets: authoredContentModelStarterSectionSelections.value,
    recommendedPresets: authoredContentModelRecommendedSectionSelections.value,
    maxSections: authoredContentModelMaxSectionsDraft.value,
    sectionPresetLimits: authoredContentModelPresetLimitDrafts.value,
    fields: fieldSettings,
  })

  settings.value.authoredContentModels = settings.value.authoredContentModels.map(entry => (
    entry.id === selectedModel.id
      ? updatedModel
      : entry
  ))
  selectedAuthoredContentModelId.value = updatedModel.id
  savedAtLabel.value = `${tr('Content model updated at', 'Modelo de conteudo atualizado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Removes the selected authored content model when it is not referenced by pages or reusable sections.
 */
function removeSelectedCmsAuthoredContentModel(): void {
  const model = selectedAuthoredContentModel.value
  if (!model) {
    createNewAuthoredContentModelDraft()
    return
  }

  if (getCmsAuthoredContentModelUsageCount(model.id) > 0) {
    savedAtLabel.value = tr(
      'This content model is still referenced by pages or reusable sections.',
      'Este modelo de conteudo ainda esta sendo usado por paginas ou secoes reutilizaveis.'
    )
    return
  }

  settings.value.authoredContentModels = settings.value.authoredContentModels
    .filter(entry => entry.id !== model.id)
  selectedAuthoredContentModelId.value = settings.value.authoredContentModels[0]?.id ?? ''
  syncSelectedAuthoredContentModelDrafts()
  savedAtLabel.value = `${tr('Content model removed at', 'Modelo de conteudo removido as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Builds one preset-authoring source from the selected block or reusable library item.
 */
function getCmsPresetAuthoringSource(): {
  block: CmsPageBlockSettings
  displayName: string
  category: string
  sourceReusableBlockId?: string
} | null {
  const selectedBlock = activeBlocksSelectedBlock.value
  const selectedBlockRecord = activeBlocksSelectedBlockRecord.value
  if (selectedBlock && selectedBlockRecord) {
    const resolvedBlock = resolveCmsReusableBlockReference({
      block: selectedBlock,
      reusableBlocks: settings.value.reusableBlocks,
    })
    const paletteEntry = cmsBlockPaletteByType.get(resolvedBlock.type)
    return {
      block: resolvedBlock,
      displayName: resolveCmsBlockDisplayName(resolvedBlock.type),
      category: paletteEntry?.category ?? 'custom',
      sourceReusableBlockId: selectedBlock.reusableSourceId,
    }
  }

  const reusableBlock = selectedReusableBlock.value
  if (!reusableBlock) {
    return null
  }

  return {
    block: {
      id: reusableBlock.id,
      type: reusableBlock.type,
      presetId: reusableBlock.presetId,
      enabled: true,
      props: cloneSerializableValue(reusableBlock.props),
      localization: reusableBlock.localization
        ? cloneSerializableValue(reusableBlock.localization)
        : undefined,
    },
    displayName: reusableBlock.name || resolveCmsBlockDisplayName(reusableBlock.type),
    category: reusableBlock.category,
    sourceReusableBlockId: reusableBlock.id,
  }
}

/**
 * Resolves a readable starter-sections label for one authored preset.
 */
function getCmsAuthoredPresetStarterSectionsLabel(preset: CmsAuthoredBlockPresetSettings): string {
  if (preset.starterSectionPresets.length === 0) {
    return tr('Starter sections: none', 'Secoes iniciais: nenhuma')
  }

  return `${tr('Starter sections', 'Secoes iniciais')}: ${preset.starterSectionPresets.map(getCmsSectionPresetLabel).join(', ')}`
}

/**
 * Applies one authored preset selection to both the preset library and block palette.
 */
function selectCmsAuthoredPreset(presetId: CmsBlockPresetId): void {
  const preset = settings.value.authoredBlockPresets.find(entry => entry.id === presetId)
  selectedAuthoredBlockPresetId.value = preset?.id ?? 'custom'
  if (!preset) {
    return
  }

  selectedPaletteBlockType.value = preset.type
  selectedPaletteBlockPresetId.value = preset.id
}

/**
 * Synchronizes authored preset drafts with the currently selected library entry.
 */
function syncSelectedAuthoredPresetDrafts(): void {
  const preset = selectedAuthoredBlockPreset.value
  if (!preset) {
    authoredBlockPresetNameDraft.value = ''
    authoredBlockPresetDescriptionDraft.value = ''
    authoredPresetStarterSectionSelections.value = []
    return
  }

  authoredBlockPresetNameDraft.value = getCmsAuthoredBlockPresetNameValue(preset)
  authoredBlockPresetDescriptionDraft.value = getCmsAuthoredBlockPresetDescriptionValue(preset)
  authoredPresetStarterSectionSelections.value = [...preset.starterSectionPresets]
}

/**
 * Saves the selected block/reusable item as an authored preset entry.
 */
function saveCmsPresetFromCurrentSelection(): void {
  const source = getCmsPresetAuthoringSource()
  if (!source) {
    savedAtLabel.value = tr(
      'Select a block or reusable item before saving a preset.',
      'Selecione um bloco ou item reutilizavel antes de salvar um preset.'
    )
    return
  }

  const authoredPreset = createCmsAuthoredBlockPresetFromBlock({
    block: source.block,
    existingPresets: settings.value.authoredBlockPresets,
    localeInput: getActiveCmsAuthoringLocale(),
    displayName: source.displayName,
    name: authoredBlockPresetNameDraft.value,
    description: authoredBlockPresetDescriptionDraft.value,
    category: source.category,
    starterSectionPresets: authoredPresetStarterSectionSelections.value,
    sourceReusableBlockId: source.sourceReusableBlockId,
  })

  settings.value.authoredBlockPresets = [authoredPreset, ...settings.value.authoredBlockPresets]
  selectCmsAuthoredPreset(authoredPreset.id)
  savedAtLabel.value = `${tr('Preset saved at', 'Preset salvo as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Updates the selected authored preset using current locale metadata and optional block props.
 */
function updateSelectedCmsPreset(): void {
  const preset = selectedAuthoredBlockPreset.value
  if (!preset) {
    savedAtLabel.value = tr('Select a preset before updating it.', 'Selecione um preset antes de atualiza-lo.')
    return
  }

  const source = getCmsPresetAuthoringSource()
  const updatedPreset = updateCmsAuthoredBlockPreset({
    preset,
    block: source?.block ?? null,
    localeInput: getActiveCmsAuthoringLocale(),
    name: authoredBlockPresetNameDraft.value,
    description: authoredBlockPresetDescriptionDraft.value,
    starterSectionPresets: authoredPresetStarterSectionSelections.value,
  })

  settings.value.authoredBlockPresets = settings.value.authoredBlockPresets.map(entry => (
    entry.id === preset.id
      ? updatedPreset
      : entry
  ))
  selectCmsAuthoredPreset(updatedPreset.id)
  savedAtLabel.value = `${tr('Preset updated at', 'Preset atualizado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Applies the selected authored preset to the active block in the builder.
 */
function applySelectedCmsPresetToBlock(): void {
  const preset = selectedAuthoredBlockPreset.value
  const target = activeBlocksSelectedBlock.value
  if (!preset || !target || activeBlocksSelectionReadOnly.value) {
    return
  }

  const presetBlock = createCmsPageBlockFromPreset({
    presetId: preset.id,
    blockId: target.id,
    enabled: target.enabled,
    authoredPresets: settings.value.authoredBlockPresets,
  })

  target.type = presetBlock.type
  target.presetId = presetBlock.presetId
  target.props = cloneSerializableValue(presetBlock.props)
  target.localization = presetBlock.localization
    ? cloneSerializableValue(presetBlock.localization)
    : undefined
  selectedPaletteBlockType.value = preset.type
  selectedPaletteBlockPresetId.value = preset.id
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
  savedAtLabel.value = `${tr('Preset applied at', 'Preset aplicado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Archives one authored preset while preserving all current block references.
 */
function archiveCmsAuthoredPreset(presetId: CmsBlockPresetId): void {
  settings.value.authoredBlockPresets = settings.value.authoredBlockPresets
    .map(entry => (entry.id === presetId ? archiveCmsEntity(entry) : entry))
  savedAtLabel.value = `${tr('Authored preset archived at', 'Preset authored arquivado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Restores one archived authored preset back into authoring flows.
 */
function unarchiveCmsAuthoredPreset(presetId: CmsBlockPresetId): void {
  settings.value.authoredBlockPresets = settings.value.authoredBlockPresets
    .map(entry => (entry.id === presetId ? unarchiveCmsEntity(entry) : entry))
  selectedAuthoredBlockPresetId.value = presetId
  savedAtLabel.value = `${tr('Authored preset restored at', 'Preset authored restaurado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Marks one authored preset as deprecated for new block authoring flows.
 */
function deprecateCmsAuthoredPreset(presetId: CmsBlockPresetId): void {
  settings.value.authoredBlockPresets = settings.value.authoredBlockPresets
    .map(entry => (entry.id === presetId ? deprecateCmsEntity(entry) : entry))
  savedAtLabel.value = `${tr('Authored preset deprecated at', 'Preset authored descontinuado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Clears deprecation metadata from one authored preset.
 */
function undeprecateCmsAuthoredPreset(presetId: CmsBlockPresetId): void {
  settings.value.authoredBlockPresets = settings.value.authoredBlockPresets
    .map(entry => (entry.id === presetId ? undeprecateCmsEntity(entry) : entry))
  selectedAuthoredBlockPresetId.value = presetId
  savedAtLabel.value = `${tr('Authored preset reinstated at', 'Preset authored reativado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Updates one authored preset replacement target.
 */
function updateCmsAuthoredPresetReplacement(presetId: CmsBlockPresetId, replacementEntityId: unknown): void {
  settings.value.authoredBlockPresets = settings.value.authoredBlockPresets
    .map(entry => (
      entry.id === presetId
        ? updateCmsDeprecatedEntityReplacement(entry, String(replacementEntityId ?? ''))
        : entry
    ))
}

/**
 * Updates one authored preset deprecation note.
 */
function updateCmsAuthoredPresetDeprecationNote(presetId: CmsBlockPresetId, deprecationNote: unknown): void {
  settings.value.authoredBlockPresets = settings.value.authoredBlockPresets
    .map(entry => (
      entry.id === presetId
        ? updateCmsDeprecatedEntityNote(entry, String(deprecationNote ?? ''))
        : entry
    ))
}

/**
 * Selects one replacement authored block preset when the replacement id matches the block-preset contract.
 */
function selectCmsReplacementAuthoredPreset(replacementEntityId: string | null | undefined): void {
  const resolvedReplacementId = String(replacementEntityId ?? '').trim()
  if (!resolvedReplacementId) {
    return
  }

  selectCmsAuthoredPreset(resolvedReplacementId as CmsBlockPresetId)
}

/**
 * Clears the selected media asset and opens a blank draft for new entries.
 */
function createNewMediaAssetDraft(): void {
  selectedMediaAssetId.value = ''
  setMediaAssetDraft(null)
}

/**
 * Persists the current media draft as a new or existing asset entry.
 */
function saveMediaAssetDraft(): void {
  const assetDraft = mediaAssetDraft.value
  const normalizedName = assetDraft.name.trim()
  if (normalizedName.length === 0) {
    savedAtLabel.value = tr('Provide an asset name before saving.', 'Informe um nome do asset antes de salvar.')
    return
  }

  const normalizedAsset = createCmsMediaAsset({
    existingAssets: settings.value.mediaAssets.filter(asset => asset.id !== selectedMediaAssetId.value),
    name: normalizedName,
    description: assetDraft.description,
    kind: assetDraft.kind,
    url: assetDraft.url,
    alt: assetDraft.alt,
    focalPoint: parseMediaDraftFocalPoint(assetDraft),
    replaceTargetAssetId: assetDraft.replaceTargetAssetId,
    tags: parseMediaDraftList(assetDraft.tags),
    usage: parseMediaDraftList(assetDraft.usage),
  })

  if (selectedMediaAssetId.value) {
    settings.value.mediaAssets = settings.value.mediaAssets.map(asset => (
      asset.id === selectedMediaAssetId.value
        ? {
          ...normalizedAsset,
          id: asset.id,
        }
        : asset
    ))
    selectedMediaAssetId.value = selectedMediaAssetId.value
    savedAtLabel.value = `${tr('Media asset updated at', 'Asset de midia atualizado as')} ${new Date().toLocaleTimeString()}`
    return
  }

  settings.value.mediaAssets = [normalizedAsset, ...settings.value.mediaAssets]
  selectedMediaAssetId.value = normalizedAsset.id
  savedAtLabel.value = `${tr('Media asset saved at', 'Asset de midia salvo as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Replaces all page and branding references from the selected asset to the chosen replacement asset.
 */
function replaceSelectedMediaAssetReferences(): void {
  const sourceAsset = selectedMediaAsset.value
  const replacementAssetId = mediaAssetDraft.value.replaceTargetAssetId.trim()
  if (!sourceAsset || !replacementAssetId) {
    savedAtLabel.value = tr(
      'Select an existing asset and a replacement target before replacing references.',
      'Selecione um asset existente e um alvo de substituicao antes de substituir referencias.'
    )
    return
  }

  const replacementAsset = settings.value.mediaAssets.find(asset => asset.id === replacementAssetId) ?? null
  if (!replacementAsset || replacementAsset.id === sourceAsset.id) {
    savedAtLabel.value = tr(
      'Choose a valid replacement asset different from the selected asset.',
      'Escolha um asset de substituicao valido e diferente do asset selecionado.'
    )
    return
  }

  const replacement = replaceCmsMediaAssetReferences({
    pages: settings.value.pages,
    branding: settings.value.branding,
    mediaAssets: settings.value.mediaAssets,
    sourceAssetId: sourceAsset.id,
    replacementAssetId: replacementAsset.id,
    resolveBindings: getLandingBlockMediaBindingDefinitions,
  })

  settings.value.pages = replacement.pages
  settings.value.branding = replacement.branding
  settings.value.mediaAssets = settings.value.mediaAssets.filter(asset => asset.id !== sourceAsset.id)
  selectedMediaAssetId.value = replacementAsset.id
  setMediaAssetDraft(replacementAsset)
  savedAtLabel.value = tr(
    `Replaced ${replacement.replacedBlockReferences} block refs and ${replacement.replacedBrandingReferences} branding refs at ${new Date().toLocaleTimeString()}`,
    `Substituiu ${replacement.replacedBlockReferences} refs em blocos e ${replacement.replacedBrandingReferences} refs em branding as ${new Date().toLocaleTimeString()}`
  )
}

/**
 * Removes the selected media asset from the tenant-scoped media library.
 */
function removeSelectedMediaAsset(): void {
  if (!selectedMediaAssetId.value) {
    return
  }

  settings.value.mediaAssets = settings.value.mediaAssets.filter(asset => asset.id !== selectedMediaAssetId.value)
  createNewMediaAssetDraft()
}

/**
 * Applies the selected media asset URL to one branding slot.
 */
function applySelectedMediaAssetToBranding(slot: 'brandLogo' | 'faviconUrl' | 'userAvatar'): void {
  const asset = selectedMediaAsset.value
  if (!asset) {
    savedAtLabel.value = tr('Select a media asset before applying it to branding.', 'Selecione um asset de midia antes de aplica-lo ao branding.')
    return
  }

  settings.value.branding[slot] = asset.url
  if (slot === 'brandLogo' && asset.alt.trim().length > 0) {
    settings.value.branding.brandLogoAlt = asset.alt
  }
  savedAtLabel.value = `${tr('Branding binding updated at', 'Vinculo de branding atualizado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Adds a new block from selected palette type into the selected section.
 */
function addCmsBuilderBlockFromPalette(): void {
  const state = buildActivePageBuilderState()
  if (!state) {
    return
  }

  const sectionId = activeBlocksSectionId.value || state.selection?.sectionId || state.page.sections[0]?.id
  const type = selectedPaletteBlockType.value || cmsBlockPalette[0]?.type
  if (!sectionId || !type) {
    return
  }

  const pageIndex = activeBlocksPageIndex.value
  const targetPage = pageIndex >= 0 ? settings.value.pages[pageIndex] : null
  const targetSection = targetPage?.sections.find(entry => entry.id === sectionId)
  if (!targetSection) {
    return
  }

  if (!isCmsBlockTypeAllowedForSectionPreset(targetSection.presetId, type)) {
    return
  }

  const sectionBlockLimits = getCmsSectionPresetBlockLimits(targetSection.presetId)
  const enabledBlocksCount = targetSection.blocks.filter(block => block.enabled).length
  if (
    sectionBlockLimits.maxBlocks != null
    && enabledBlocksCount >= sectionBlockLimits.maxBlocks
  ) {
    return
  }

  const presetId = resolveCmsBlockPresetId(selectedPaletteBlockPresetId.value)
  const resolvedPresetId = isCmsBlockPresetAllowedForType(
    type,
    presetId,
    settings.value.authoredBlockPresets
  )
    && isCmsBlockPresetAllowedForSectionPreset(
      targetSection.presetId,
      presetId,
      settings.value.authoredBlockPresets
    )
    ? presetId
    : 'custom'

  const nextState = insertCmsBuilderBlock(state, landingRegistry, {
    sectionId,
    type,
  })
  applyBuilderStateToActivePage(nextState)

  const insertedSectionId = nextState.selection?.sectionId
  const insertedBlockId = nextState.selection?.blockId
  const page = pageIndex >= 0 ? settings.value.pages[pageIndex] : null
  const section = page?.sections.find(entry => entry.id === insertedSectionId)
  const insertedBlock = section?.blocks.find(entry => entry.id === insertedBlockId)
  if (!insertedBlock) {
    return
  }

  if (resolvedPresetId === 'custom') {
    insertedBlock.presetId = 'custom'
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
    return
  }

  const presetBlock = createCmsPageBlockFromPreset({
    presetId: resolvedPresetId,
    blockId: insertedBlock.id,
    enabled: insertedBlock.enabled,
    authoredPresets: settings.value.authoredBlockPresets,
  })

  insertedBlock.type = presetBlock.type
  insertedBlock.presetId = presetBlock.presetId
  insertedBlock.props = cloneSerializableValue(presetBlock.props)
  insertedBlock.localization = presetBlock.localization
    ? cloneSerializableValue(presetBlock.localization)
    : undefined
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
}

/**
 * Duplicates one editable block inside the current active section.
 */
function duplicateCmsBuilderBlockByRecord(block: CmsSectionBlockRecord): void {
  const page = settings.value.pages[block.pageIndex]
  const section = page?.sections[block.sectionIndex]
  const sourceBlock = section?.blocks[block.blockIndex]
  if (!page || !section || !sourceBlock || isCmsPageBlockLinked(sourceBlock) || activeBlocksSectionIsLinked.value) {
    return
  }

  const sectionBlockLimits = getCmsSectionPresetBlockLimits(section.presetId)
  const enabledBlocksCount = section.blocks.filter(entry => entry.enabled).length
  if (
    sourceBlock.enabled
    && sectionBlockLimits.maxBlocks != null
    && enabledBlocksCount >= sectionBlockLimits.maxBlocks
  ) {
    return
  }

  const occupiedBlockIds = new Set(
    page.sections.flatMap(entry => entry.blocks.map(sectionBlock => sectionBlock.id))
  )
  const duplicateId = createUniquePageBlockId(
    occupiedBlockIds,
    section.id,
    `${sourceBlock.id}-copy`,
    section.blocks.length + 1
  )
  const duplicatedBlock: CmsPageBlockSettings = {
    id: duplicateId,
    type: sourceBlock.type,
    presetId: sourceBlock.presetId,
    enabled: sourceBlock.enabled,
    reusableMode: sourceBlock.reusableMode,
    reusableSourceId: sourceBlock.reusableSourceId,
    props: cloneSerializableValue(sourceBlock.props ?? {}),
    localization: sourceBlock.localization
      ? cloneSerializableValue(sourceBlock.localization)
      : undefined,
  }

  const nextBlocks = [...section.blocks]
  nextBlocks.splice(block.blockIndex + 1, 0, duplicatedBlock)
  const nextSections = [...page.sections]
  nextSections[block.sectionIndex] = {
    ...section,
    enabled: section.enabled || duplicatedBlock.enabled,
    blocks: nextBlocks,
  }
  settings.value.pages[block.pageIndex] = {
    ...page,
    sections: nextSections,
  }
  setActiveBlocksSelection(section.id, duplicatedBlock.id)
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
  savedAtLabel.value = `${tr('Block duplicated at', 'Bloco duplicado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Enables or disables every block in the active section while respecting section limits.
 */
function setCmsBuilderSectionBlocksEnabled(enabled: boolean): void {
  const pageIndex = activeBlocksPageIndex.value
  const page = pageIndex >= 0 ? settings.value.pages[pageIndex] : null
  const section = page?.sections.find(entry => entry.id === activeBlocksSectionId.value)
  if (!page || !section || activeBlocksSectionIsLinked.value) {
    return
  }

  const sectionBlockLimits = getCmsSectionPresetBlockLimits(section.presetId)
  const maxEnabledBlocks = enabled && sectionBlockLimits.maxBlocks != null
    ? sectionBlockLimits.maxBlocks
    : Number.POSITIVE_INFINITY

  section.blocks.forEach((block, index) => {
    block.enabled = enabled ? index < maxEnabledBlocks : false
  })
  section.enabled = section.blocks.some(block => block.enabled)

  const actionLabel = enabled
    ? tr('All section blocks enabled.', 'Todos os blocos da secao foram ativados.')
    : tr('All section blocks disabled.', 'Todos os blocos da secao foram desativados.')
  savedAtLabel.value = actionLabel
}

/**
 * Removes disabled blocks from the active section and keeps one editable placeholder when needed.
 */
function removeDisabledBlocksFromActiveSection(): void {
  const pageIndex = activeBlocksPageIndex.value
  const page = pageIndex >= 0 ? settings.value.pages[pageIndex] : null
  const section = page?.sections.find(entry => entry.id === activeBlocksSectionId.value)
  if (!page || !section || activeBlocksSectionIsLinked.value) {
    return
  }

  const removedBlocksCount = section.blocks.filter(block => !block.enabled).length
  if (removedBlocksCount === 0) {
    return
  }

  section.blocks = section.blocks.filter(block => block.enabled)

  if (section.blocks.length === 0) {
    const occupiedBlockIds = new Set(
      page.sections.flatMap(entry => entry.blocks.map(sectionBlock => sectionBlock.id))
    )
    section.blocks = [createDefaultSectionBlock(section.id, occupiedBlockIds, 1, true, section.presetId)]
  }

  section.enabled = section.blocks.some(block => block.enabled)
  activeBlocksBlockId.value = section.blocks[0]?.id ?? ''
  syncSelectedBlockPropsDraft()
  syncSelectedBlockFieldJsonDrafts()
  savedAtLabel.value = tr(
    `Removed ${removedBlocksCount} disabled block(s).`,
    `Removeu ${removedBlocksCount} bloco(s) desativado(s).`
  )
}

/**
 * Pretty-formats selected block props JSON editor value.
 */
function formatSelectedBlockPropsDraft(): void {
  if (!activeBlocksSelectedBlock.value || activeBlocksSelectionReadOnly.value) {
    return
  }

  try {
    const parsed = JSON.parse(activeBlocksPropsDraft.value) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      savedAtLabel.value = cmsUiText.value.blockPropsMustBeObjectLabel
      return
    }
    activeBlocksPropsDraft.value = JSON.stringify(parsed, null, 2)
  } catch {
    savedAtLabel.value = cmsUiText.value.invalidBlockPropsJsonLabel
  }
}

/**
 * Applies JSON props draft to the currently selected block.
 */
function applySelectedBlockPropsDraft(): void {
  const target = activeBlocksSelectedBlock.value
  if (!target || activeBlocksSelectionReadOnly.value) {
    return
  }

  try {
    const parsed = JSON.parse(activeBlocksPropsDraft.value) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      savedAtLabel.value = cmsUiText.value.blockPropsMustBeObjectLabel
      return
    }

    applyLocalizedPropsToBlock(target, parsed as Record<string, unknown>)
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
    savedAtLabel.value = `${cmsUiText.value.blockPropsUpdatedAtLabel} ${new Date().toLocaleTimeString()}`
  } catch {
    savedAtLabel.value = cmsUiText.value.invalidBlockPropsJsonLabel
  }
}

/**
 * Removes a block from the active page schema.
 */
function removeCmsBuilderBlockByRecord(block: CmsSectionBlockRecord): void {
  const state = buildActivePageBuilderState()
  if (!state) {
    return
  }

  const nextState = removeCmsBuilderBlock(state, {
    sectionId: block.sectionId,
    blockId: block.id,
  })
  applyBuilderStateToActivePage(nextState)
}

/**
 * Moves a block inside its section in active page schema.
 */
function moveCmsBuilderBlockByRecord(
  block: CmsSectionBlockRecord,
  direction: 'up' | 'down'
): void {
  const state = buildActivePageBuilderState()
  if (!state) {
    return
  }

  const nextState = moveCmsBuilderBlock(state, {
    sectionId: block.sectionId,
    blockId: block.id,
    direction,
  })
  applyBuilderStateToActivePage(nextState)
}

/**
 * Starts dragging one block row in the blocks manager.
 */
function onCmsBuilderBlockDragStart(block: CmsSectionBlockRecord, event: DragEvent): void {
  draggedBlock.value = {
    pageId: block.pageId,
    sectionId: block.sectionId,
    blockId: block.id,
  }
  blockDropTargetKey.value = block.sectionId
  setActiveBlocksSelection(block.sectionId, block.id)

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', `${block.pageId}:${block.sectionId}:${block.id}`)
  }
}

/**
 * Clears temporary block drag state.
 */
function onCmsBuilderBlockDragEnd(): void {
  draggedBlock.value = null
  blockDropTargetKey.value = ''
}

/**
 * Tracks the current section drop target while dragging blocks.
 */
function onCmsBuilderBlockDragOver(sectionId: string, event: DragEvent): void {
  if (!draggedBlock.value || draggedBlock.value.pageId !== activeBlocksPageId.value) {
    return
  }

  event.preventDefault()
  blockDropTargetKey.value = sectionId
}

/**
 * Repositions a dragged block relative to one block row.
 */
function onCmsBuilderBlockDrop(block: CmsSectionBlockRecord, event: DragEvent): void {
  if (!draggedBlock.value || draggedBlock.value.pageId !== activeBlocksPageId.value) {
    return
  }

  event.preventDefault()

  const state = buildActivePageBuilderState()
  if (!state) {
    onCmsBuilderBlockDragEnd()
    return
  }

  const nextState = moveCmsBuilderBlockToIndex(state, {
    sourceSectionId: draggedBlock.value.sectionId,
    blockId: draggedBlock.value.blockId,
    targetSectionId: block.sectionId,
    targetIndex: resolveVerticalDropIndex(event, block.blockIndex),
  })
  applyBuilderStateToActivePage(nextState)
  onCmsBuilderBlockDragEnd()
}

/**
 * Appends a dragged block into a section container, including empty sections.
 */
function onCmsBuilderSectionDrop(sectionId: string, targetIndex: number, event: DragEvent): void {
  if (!draggedBlock.value || draggedBlock.value.pageId !== activeBlocksPageId.value) {
    return
  }

  event.preventDefault()

  const state = buildActivePageBuilderState()
  if (!state) {
    onCmsBuilderBlockDragEnd()
    return
  }

  const nextState = moveCmsBuilderBlockToIndex(state, {
    sourceSectionId: draggedBlock.value.sectionId,
    blockId: draggedBlock.value.blockId,
    targetSectionId: sectionId,
    targetIndex,
  })
  applyBuilderStateToActivePage(nextState)
  onCmsBuilderBlockDragEnd()
}

/**
 * Toggles block enabled flag in active page settings.
 */
function updateCmsBuilderBlockEnabled(block: CmsSectionBlockRecord, enabled: boolean): void {
  const page = settings.value.pages[block.pageIndex]
  const section = page?.sections[block.sectionIndex]
  const target = section?.blocks[block.blockIndex]
  if (!target) {
    return
  }
  target.enabled = enabled
  section.enabled = section.blocks.some(entry => entry.enabled)
}

/**
 * Applies workflow governance transitions in a safe way without breaking editing flow.
 */
function applyGovernanceAction(
  action: CmsWhiteLabelWorkflowAction,
  options?: {
    summary?: string
    metadata?: Record<string, string>
  }
): void {
  const currentGovernance = settings.value.governance
  if (!canApplyWhiteLabelWorkflowAction(currentGovernance, action, governanceActor.role)) {
    return
  }

  settings.value.governance = applyWhiteLabelWorkflowAction(currentGovernance, action, governanceActor, {
    summary: options?.summary,
    metadata: options?.metadata,
  })
}

/**
 * Handles sync active tenant profile settings.
 */
function syncActiveTenantProfileSettings(nextSettings: CmsWhiteLabelSettings): void {
  const resolved = syncCmsTenantProfileSettings({
    tenantProfilesState: tenantProfilesState.value,
    activeProfileId: activeTenantProfileId.value,
    nextSettings,
  })

  tenantProfilesState.value = resolved.tenantProfilesState
  activeTenantProfileId.value = resolved.activeProfileId
  saveCmsTenantProfilesState(tenantProfilesState.value)
}

/**
 * Clears the pending autosave timer when present.
 */
function clearCmsAutosaveTimer(): void {
  if (cmsAutosaveTimerId.value === null || typeof window === 'undefined') {
    return
  }

  window.clearTimeout(cmsAutosaveTimerId.value)
  cmsAutosaveTimerId.value = null
}

/**
 * Persists one draft-recovery snapshot immediately.
 */
function persistCmsDraftRecoverySnapshot(reason: CmsDraftRecoveryReason): void {
  const activeProfile = getActiveTenantProfileSnapshot()
  const result = saveCmsDraftRecoverySnapshot(
    activeProfile.id,
    cloneWhiteLabelSettings(settings.value),
    reason
  )

  cmsDraftRecoveryState.value = result.state
  if (!result.ok) {
    cmsAutosaveStatus.value = 'error'
    cmsAutosaveErrorMessage.value = result.error ?? cmsUiText.value.autoSaveError
    return
  }

  cmsAutosaveErrorMessage.value = ''
  cmsAutosaveStatus.value = canRestoreDraftRecovery.value ? 'recovery' : 'saved'
}

/**
 * Schedules one debounced autosave checkpoint for the active tenant.
 */
function scheduleCmsDraftAutosave(): void {
  if (typeof window === 'undefined') {
    return
  }

  clearCmsAutosaveTimer()
  cmsAutosaveStatus.value = 'saving'
  cmsAutosaveErrorMessage.value = ''
  cmsAutosaveTimerId.value = window.setTimeout(() => {
    cmsAutosaveTimerId.value = null
    persistCmsDraftRecoverySnapshot('autosave')
  }, cmsAutosaveDelayMs)
}

/**
 * Stores a recovery checkpoint before destructive flows such as reset/import.
 */
function checkpointCmsDraftRecovery(): void {
  clearCmsAutosaveTimer()
  persistCmsDraftRecoverySnapshot('checkpoint')
}

/**
 * Restores the best recovery candidate for the active tenant profile.
 */
function restoreCmsDraftRecovery(): void {
  const candidate = activeDraftRecoveryCandidate.value
  if (!candidate) {
    return
  }

  applyCmsSettingsSnapshot(candidate.settings)
  cmsAutosaveErrorMessage.value = ''
  cmsAutosaveStatus.value = 'saved'
  savedAtLabel.value = `${cmsUiText.value.autoSaveRestoredLabel} ${cmsUiText.value.savedAtPrefix.toLowerCase()} ${new Date().toLocaleTimeString()}`
}

/**
 * Discards stored draft-recovery snapshots for the active tenant profile.
 */
function discardCmsDraftRecovery(): void {
  clearCmsAutosaveTimer()
  cmsDraftRecoveryState.value = clearCmsDraftRecoveryEntry(activeTenantProfileId.value)
  cmsAutosaveErrorMessage.value = ''
  cmsAutosaveStatus.value = 'idle'
  savedAtLabel.value = `${cmsUiText.value.autoSaveDiscardedLabel} ${cmsUiText.value.savedAtPrefix.toLowerCase()} ${new Date().toLocaleTimeString()}`
}

/**
 * Resets authoring undo/redo stacks around the current tenant snapshot.
 */
function resetCmsAuthoringHistory(): void {
  cmsAuthoringHistory.value = resetCmsSnapshotHistoryState(
    cloneWhiteLabelSettings(settings.value),
    cmsAuthoringHistoryLimit
  )
}

/**
 * Applies one settings snapshot back into the editor and refreshes dependent drafts.
 */
function applyCmsSettingsSnapshot(snapshot: CmsWhiteLabelSettings): void {
  settings.value = cloneWhiteLabelSettings(normalizeCmsWhiteLabelSettings(snapshot))
  settings.value.content.locale = resolveCmsLocale(settings.value.content.locale)
  applySelectedThemePresetFromSettings()
  if (!settings.value.items.some(item => item.id === activeMenuId.value)) {
    activeMenuId.value = settings.value.items[0]?.id ?? defaultMenuId
  }
  applyCmsFavicon(settings.value.branding.faviconUrl)
  savedAtLabel.value = buildSavedAtLabel()
}

/**
 * Restores the previous authoring snapshot when available.
 */
function undoCmsAuthoringChange(): void {
  const transition = undoCmsSnapshot(cmsAuthoringHistory.value)
  if (!transition) {
    return
  }

  isApplyingCmsAuthoringHistory.value = true
  cmsAuthoringHistory.value = transition.history
  applyCmsSettingsSnapshot(transition.snapshot)
  savedAtLabel.value = tr('Undo applied.', 'Desfazer aplicado.')
  nextTick(() => {
    isApplyingCmsAuthoringHistory.value = false
  })
}

/**
 * Restores the next redo snapshot when available.
 */
function redoCmsAuthoringChange(): void {
  const transition = redoCmsSnapshot(cmsAuthoringHistory.value)
  if (!transition) {
    return
  }

  isApplyingCmsAuthoringHistory.value = true
  cmsAuthoringHistory.value = transition.history
  applyCmsSettingsSnapshot(transition.snapshot)
  savedAtLabel.value = tr('Redo applied.', 'Refazer aplicado.')
  nextTick(() => {
    isApplyingCmsAuthoringHistory.value = false
  })
}

watch(
  () => settings.value.pages.map(page => `${page.id}:${page.contentModelId}`),
  pageEntries => {
    if (pageEntries.length === 0) {
      activeBlocksPageId.value = ''
      pageSectionPresetSelections.value = {}
      pageSectionStarterPresetSelections.value = {}
      pageReusableSectionSelections.value = {}
      return
    }

    const nextSelections: Record<number, CmsSectionPresetId> = {}
    const nextStarterSelections: Record<number, CmsBlockPresetId> = {}
    const nextReusableSelections: Record<number, string> = {}
    settings.value.pages.forEach((page, pageIndex) => {
      nextSelections[pageIndex] = getSelectedSectionPresetForPage(pageIndex)
      nextStarterSelections[pageIndex] = getSelectedSectionStarterPresetForPage(pageIndex)
      nextReusableSelections[pageIndex] = getSelectedReusableSectionForPage(pageIndex)
    })
    pageSectionPresetSelections.value = nextSelections
    pageSectionStarterPresetSelections.value = nextStarterSelections
    pageReusableSectionSelections.value = nextReusableSelections

    const pageIds = settings.value.pages.map(page => page.id)
    if (!pageIds.includes(activeBlocksPageId.value)) {
      activeBlocksPageId.value = pageIds[0] ?? ''
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => settings.value.reusableSections.map(reusableSection => `${reusableSection.id}:${reusableSection.presetId}:${reusableSection.contentModelId}`),
  () => {
    const nextSelections: Record<number, string> = {}
    settings.value.pages.forEach((_, pageIndex) => {
      nextSelections[pageIndex] = getSelectedReusableSectionForPage(pageIndex)
    })
    pageReusableSectionSelections.value = nextSelections
  },
  { immediate: true, deep: true }
)

watch(
  blocksSectionOptions,
  options => {
    if (options.length === 0) {
      activeBlocksSectionId.value = ''
      activeBlocksBlockId.value = ''
      return
    }

    const hasSection = options.some(option => option.value === activeBlocksSectionId.value)
    if (!hasSection) {
      activeBlocksSectionId.value = String(options[0]?.value ?? '')
      activeBlocksBlockId.value = ''
    }
  },
  { immediate: true, deep: true }
)

watch(
  activeBlocksBlockOptions,
  options => {
    if (options.length === 0) {
      activeBlocksBlockId.value = ''
      return
    }

    const hasBlock = options.some(option => option.value === activeBlocksBlockId.value)
    if (!hasBlock) {
      activeBlocksBlockId.value = String(options[0]?.value ?? '')
    }
  },
  { immediate: true, deep: true }
)

watch(
  cmsBlockPaletteOptions,
  options => {
    if (options.length === 0) {
      selectedPaletteBlockType.value = ''
      return
    }

    const hasType = options.some(option => option.value === selectedPaletteBlockType.value)
    if (!hasType) {
      selectedPaletteBlockType.value = String(options[0]?.value ?? '')
    }
  },
  { immediate: true, deep: true }
)

watch(
  cmsBlockPresetOptions,
  options => {
    if (options.length === 0) {
      selectedPaletteBlockPresetId.value = 'custom'
      return
    }

    const hasPreset = options.some(option => option.value === selectedPaletteBlockPresetId.value)
    if (!hasPreset) {
      selectedPaletteBlockPresetId.value = options[0]?.value ?? 'custom'
    }
  },
  { immediate: true, deep: true }
)

watch(
  cmsReusableBlockOptions,
  options => {
    if (options.length === 0) {
      selectedReusableBlockId.value = ''
      return
    }

    const hasReusableBlock = options.some(option => option.value === selectedReusableBlockId.value)
    if (!hasReusableBlock) {
      selectedReusableBlockId.value = String(options[0]?.value ?? '')
    }
  },
  { immediate: true, deep: true }
)

watch(
  cmsAuthoredBlockPresetOptions,
  options => {
    if (options.length === 0) {
      selectedAuthoredBlockPresetId.value = 'custom'
      syncSelectedAuthoredPresetDrafts()
      return
    }

    const hasPreset = options.some(option => option.value === selectedAuthoredBlockPresetId.value)
    if (!hasPreset) {
      selectedAuthoredBlockPresetId.value = options[0]?.value ?? 'custom'
      return
    }

    syncSelectedAuthoredPresetDrafts()
  },
  { immediate: true, deep: true }
)

watch(
  cmsBuilderCommandOptions,
  options => {
    if (options.length === 0) {
      selectedBuilderCommandId.value = ''
      return
    }

    const hasCommand = options.some(option => option.value === selectedBuilderCommandId.value)
    if (!hasCommand) {
      selectedBuilderCommandId.value = String(options[0]?.value ?? '')
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => [selectedAuthoredBlockPresetId.value, settings.value.content.locale],
  () => {
    syncSelectedAuthoredPresetDrafts()
  },
  { immediate: true, deep: true }
)

watch(
  cmsAuthoredContentModelOptions,
  options => {
    if (options.length === 0) {
      createNewAuthoredContentModelDraft()
      return
    }

    const hasContentModel = options.some(option => option.value === selectedAuthoredContentModelId.value)
    if (!hasContentModel) {
      selectedAuthoredContentModelId.value = (options[0]?.value ?? '') as CmsContentModelId | ''
      return
    }

    syncSelectedAuthoredContentModelDrafts()
  },
  { immediate: true, deep: true }
)

watch(
  () => [selectedAuthoredContentModelId.value, settings.value.content.locale],
  () => {
    syncSelectedAuthoredContentModelDrafts()
  },
  { immediate: true, deep: true }
)

watch(
  cmsAuthoredContentModelFieldPresetOptions,
  options => {
    if (options.length === 0) {
      selectedAuthoredContentModelFieldPresetId.value = ''
      return
    }

    const hasPreset = options.some(option => option.value === selectedAuthoredContentModelFieldPresetId.value)
    if (!hasPreset) {
      selectedAuthoredContentModelFieldPresetId.value = options[0]?.value ?? ''
    }
  },
  { immediate: true, deep: true }
)

watch(
  authoredContentModelAllowedSectionSelections,
  value => {
    const allowedPresetIds = new Set(value)
    const filteredRequiredPresets = authoredContentModelRequiredSectionSelections.value
      .filter(presetId => allowedPresetIds.has(presetId))
    let nextStarterPresets = authoredContentModelStarterSectionSelections.value
      .filter(presetId => allowedPresetIds.has(presetId))
    let nextRecommendedPresets = authoredContentModelRecommendedSectionSelections.value
      .filter(presetId => allowedPresetIds.has(presetId))
    const nextPresetLimitDrafts = Object.fromEntries(
      Object.entries(authoredContentModelPresetLimitDrafts.value)
        .filter(([presetId]) => allowedPresetIds.has(presetId as CmsSectionPresetId))
    ) as Partial<Record<CmsSectionPresetId, string>>

    if (filteredRequiredPresets.length !== authoredContentModelRequiredSectionSelections.value.length) {
      authoredContentModelRequiredSectionSelections.value = filteredRequiredPresets
    }

    if (nextRecommendedPresets.length === 0 && value.length > 0) {
      nextRecommendedPresets = [value[0] as CmsSectionPresetId]
    }

    if (nextRecommendedPresets.length !== authoredContentModelRecommendedSectionSelections.value.length) {
      authoredContentModelRecommendedSectionSelections.value = nextRecommendedPresets
    }

    if (nextStarterPresets.length === 0 && nextRecommendedPresets.length > 0) {
      nextStarterPresets = [...nextRecommendedPresets]
    }

    if (nextStarterPresets.length !== authoredContentModelStarterSectionSelections.value.length) {
      authoredContentModelStarterSectionSelections.value = nextStarterPresets
    }

    if (Object.keys(nextPresetLimitDrafts).length !== Object.keys(authoredContentModelPresetLimitDrafts.value).length) {
      authoredContentModelPresetLimitDrafts.value = nextPresetLimitDrafts
    }
  },
  { deep: true }
)

watch(
  cmsMediaAssetOptions,
  options => {
    if (options.length === 0) {
      createNewMediaAssetDraft()
      return
    }

    const hasSelectedAsset = options.some(option => option.value === selectedMediaAssetId.value)
    if (!hasSelectedAsset && selectedMediaAssetId.value) {
      selectedMediaAssetId.value = ''
    }

    if (!selectedMediaAssetId.value) {
      const firstAssetId = String(options[0]?.value ?? '')
      selectedMediaAssetId.value = firstAssetId
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => selectedMediaAssetId.value,
  value => {
    if (!value) {
      setMediaAssetDraft(null)
      return
    }

    const asset = settings.value.mediaAssets.find(entry => entry.id === value) ?? null
    setMediaAssetDraft(asset)
  },
  { immediate: true }
)

watch(
  () => selectedPageTemplateId.value,
  value => {
    selectedPageTemplateId.value = resolveCmsPageTemplateId(value)
  },
  { immediate: true }
)

watch(
  () => `${activeBlocksPageId.value}|${activeBlocksSectionId.value}|${activeBlocksBlockId.value}`,
  () => {
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
  },
  { immediate: true }
)

watch(
  () => settings.value.content.locale,
  () => {
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
  }
)

watch(
  () => shellSnapshot.value.shellConfig.activeItem,
  value => {
    if (value && value !== activeMenuId.value) {
      activeMenuId.value = value
    }
  },
  { immediate: true }
)

watch(
  settings,
  value => {
    syncActiveTenantProfileSettings(value)
    saveCmsWhiteLabelSettings(value)
    savedAtLabel.value = buildSavedAtLabel()
  },
  { deep: true, immediate: true }
)

watch(
  settings,
  value => {
    if (!isApplyingCmsAuthoringHistory.value) {
      cmsAuthoringHistory.value = recordCmsSnapshot(
        cmsAuthoringHistory.value,
        cloneWhiteLabelSettings(value),
        {
          equals: areCmsSettingsSnapshotsEqual,
        }
      )
    }
    scheduleCmsDraftAutosave()
  },
  { deep: true }
)

watch(
  () => [activeTenantProfileId.value, activeDraftRecoveryEntry.value?.latest?.savedAt, activeDraftRecoveryCandidate.value?.savedAt],
  () => {
    if (cmsAutosaveStatus.value === 'saving' || cmsAutosaveStatus.value === 'error') {
      return
    }

    if (canRestoreDraftRecovery.value) {
      cmsAutosaveStatus.value = 'recovery'
      return
    }

    cmsAutosaveStatus.value = hasDraftRecoveryEntry.value ? 'saved' : 'idle'
  },
  { immediate: true, deep: true }
)

watch(
  () => settings.value.branding.faviconUrl,
  value => {
    applyCmsFavicon(value)
  },
  { immediate: true }
)

watch(
  semanticNotificationOverrides,
  value => {
    applySemanticColors(value)
  },
  { immediate: true, deep: true }
)

watch(
  quasarBrandOverrides,
  value => {
    applyQuasarBrandOverrides(value)
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  if (typeof window === 'undefined') {
    return
  }

  const searchParams = new URLSearchParams(window.location.search)
  const requestedModule = searchParams.get('cmsModule')
  const requestedPreview = searchParams.get('cmsPreview') === '1'
  const requestedPreviewSource = searchParams.get('cmsPreviewSource')
  const requestedPreviewLocale = searchParams.get('cmsPreviewLocale')
  const requestedPreviewViewport = searchParams.get('cmsPreviewViewport')

  cmsDesignerPreviewMode.value = requestedPreview

  switch (requestedModule) {
    case 'pages':
      activeMenuId.value = pagesModuleId.value
      break
    case 'blocks':
      activeMenuId.value = blocksModuleId.value
      break
    case 'settings':
      activeMenuId.value = settingsModuleId.value
      break
    default:
      break
  }

  if (requestedPreviewSource === 'draft' || requestedPreviewSource === 'published') {
    cmsPreviewSource.value = requestedPreviewSource
  }
  if (requestedPreviewLocale === 'en' || requestedPreviewLocale === 'pt-BR') {
    cmsPreviewLocale.value = requestedPreviewLocale
  }
  if (requestedPreviewViewport === 'desktop' || requestedPreviewViewport === 'tablet' || requestedPreviewViewport === 'mobile') {
    cmsPreviewViewport.value = requestedPreviewViewport
  }

  if (!requestedPreview) {
    return
  }

  if (requestedModule === 'settings') {
    cmsSettingsWorkspaceView.value = 'preview'
  }
  if (requestedModule === 'pages') {
    cmsPagesWorkspaceView.value = 'preview'
  }
  if (requestedModule === 'blocks') {
    cmsBlocksWorkspaceView.value = 'preview'
  }

  await nextTick()
  scrollCmsDesignerSurface(getCmsDesignerPreviewSelector(
    requestedModule === 'pages' || requestedModule === 'blocks' || requestedModule === 'settings'
      ? requestedModule
      : 'settings'
  ))
})

onBeforeUnmount(() => {
  clearCmsAutosaveTimer()
  clearTimeout(_cmsSearchDebounceTimer)
})

/**
 * Handles get theme field value.
 */
function getThemeFieldValue(field: ThemeField): string {
  const directValue = String(settings.value.theme[field.key] ?? '')

  if (!field.aliases || field.aliases.length === 0) {
    return directValue
  }

  const directTrimmed = directValue.trim()
  const defaultDirectTrimmed = String(defaultTheme[field.key] ?? '').trim()
  const directIsDefault = directTrimmed.length === 0 || directTrimmed === defaultDirectTrimmed

  if (!directIsDefault) {
    return directValue
  }

  for (const alias of field.aliases) {
    const aliasValue = String(settings.value.theme[alias] ?? '')
    const aliasTrimmed = aliasValue.trim()
    const defaultAliasTrimmed = String(defaultTheme[alias] ?? '').trim()

    if (aliasTrimmed.length > 0 && aliasTrimmed !== defaultAliasTrimmed) {
      return aliasValue
    }
  }

  return directValue
}

/**
 * Handles get theme field picker value.
 */
function getThemeFieldPickerValue(field: ThemeField): string {
  return getCmsThemeFieldPickerValue(field, settings.value.theme, semanticColors.infoPrimary)
}

/**
 * Handles on theme field input.
 */
function onThemeFieldInput(field: ThemeField, value: string | number | null): void {
  applyCmsThemeFieldValue(settings.value, field, value, selectedThemePreset.value)
}

/**
 * Handles on theme color input.
 */
function onThemeColorInput(field: ThemeField, event: Event): void {
  const target = event.target as HTMLInputElement | null
  onThemeFieldInput(field, target?.value ?? '')
}

/**
 * Applies theme preset by id.
 */
function applyThemePresetById(presetId: Exclude<CmsThemePresetId, 'custom'>): void {
  applyCmsThemePreset(settings.value, themePresets.value, presetId)
}

/**
 * Handles on theme preset change.
 */
function onThemePresetChange(value: CmsThemePresetId | null): void {
  const presetId = (value ?? 'custom') as CmsThemePresetId
  selectedThemePreset.value = presetId
  settings.value.themePresetId = presetId

  if (presetId === 'custom') {
    return
  }

  applyThemePresetById(presetId)
  savedAtLabel.value = `${activeThemePresetLabel.value} ${cmsUiText.value.themePresetAppliedSuffix}`
}

/**
 * Detects theme preset from current.
 */
function detectThemePresetFromCurrent(): void {
  const detectedPreset = resolveCmsSelectedThemePresetId(settings.value, themePresets.value, defaultTheme)
  selectedThemePreset.value = detectedPreset
  settings.value.themePresetId = detectedPreset
}

/**
 * Applies selected theme preset from settings.
 */
function applySelectedThemePresetFromSettings(): void {
  selectedThemePreset.value = resolveCmsSelectedThemePresetId(settings.value, themePresets.value, defaultTheme)
  settings.value.themePresetId = selectedThemePreset.value
}

/**
 * Applies locale preset to CMS copy/shell labels.
 */
function onCmsLocaleChange(value: CmsLocale | string | null): void {
  const locale = applyCmsLocalePreset(settings.value, value)
  settings.value.content.locale = locale
  savedAtLabel.value = cmsUiText.value.localePresetAppliedLabel
}

/**
 * Handles on tenant profile change.
 */
function onTenantProfileChange(value: string | null): void {
  const profileId = String(value ?? '').trim()
  const selection = selectCmsTenantProfile({
    tenantProfilesState: tenantProfilesState.value,
    profileId,
  })
  if (!selection) {
    return
  }

  tenantProfilesState.value = selection.tenantProfilesState
  activeTenantProfileId.value = selection.activeProfileId
  saveCmsTenantProfilesState(tenantProfilesState.value)

  settings.value = cloneWhiteLabelSettings(selection.settings)
  settings.value.content.locale = resolveCmsLocale(settings.value.content.locale)
  applySelectedThemePresetFromSettings()
  activeMenuId.value = settings.value.items[0]?.id ?? defaultMenuId
  searchQuery.value = ''
  resetCmsAuthoringHistory()
  savedAtLabel.value = `${selection.profile.name} ${cmsUiText.value.tenantLoadedSuffix}`
}

/**
 * Creates tenant profile from prompt.
 */
function createTenantProfileFromPrompt(): void {
  if (typeof window === 'undefined') {
    return
  }

  const suggestedName = `Tenant ${tenantProfilesState.value.profiles.length + 1}`
  const tenantPromptLabel = getCmsTenantProfilePromptLabel(settings.value.content.locale)
  const inputName = window.prompt(tenantPromptLabel, suggestedName)
  if (!inputName) {
    return
  }

  const profileName = inputName.trim()
  if (!profileName) {
    return
  }

  const created = createCmsTenantProfileFromName({
    tenantProfilesState: tenantProfilesState.value,
    currentSettings: settings.value,
    profileName,
  })

  tenantProfilesState.value = created.tenantProfilesState
  activeTenantProfileId.value = created.activeProfileId
  saveCmsTenantProfilesState(tenantProfilesState.value)
  onTenantProfileChange(created.activeProfileId)
  savedAtLabel.value = `${profileName} ${cmsUiText.value.tenantCreatedSuffix}`
}

/**
 * Handles remove active tenant profile.
 */
function removeActiveTenantProfile(): void {
  if (tenantProfilesState.value.profiles.length <= 1 || typeof window === 'undefined') {
    return
  }

  const activeProfile = getActiveTenantProfileSnapshot()
  const confirmed = window.confirm(cmsUiText.value.tenantDeleteConfirmLabel(activeProfile.name))
  if (!confirmed) {
    return
  }

  const removed = removeActiveCmsTenantProfileEntry({
    tenantProfilesState: tenantProfilesState.value,
    activeProfileId: activeTenantProfileId.value,
  })

  tenantProfilesState.value = removed.tenantProfilesState
  activeTenantProfileId.value = removed.activeProfileId
  saveCmsTenantProfilesState(tenantProfilesState.value)
  onTenantProfileChange(activeTenantProfileId.value)
  savedAtLabel.value = `${activeProfile.name} ${cmsUiText.value.tenantRemovedSuffix}`
}

/**
 * Normalizes id segment.
 */
function normalizeIdSegment(value: string | undefined | null): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function createSelectedDomainSnapshot(
  domain: CmsDomainPayloadDomain
): CmsContentRepositorySnapshot | CmsAssetRepositorySnapshot | CmsReleaseRepositorySnapshot {
  const snapshotSource = cloneWhiteLabelSettings(settings.value)

  switch (domain) {
    case 'content':
      return createCmsContentRepositorySnapshot(snapshotSource)
    case 'assets':
      return createCmsAssetRepositorySnapshot(snapshotSource)
    case 'releases':
      return createCmsReleaseRepositorySnapshot(snapshotSource)
  }
}

function applySelectedDomainSnapshot(
  currentSettings: CmsWhiteLabelSettings,
  domain: CmsDomainPayloadDomain,
  snapshot: CmsContentRepositorySnapshot | CmsAssetRepositorySnapshot | CmsReleaseRepositorySnapshot
): CmsWhiteLabelSettings {
  switch (domain) {
    case 'content':
      return applyCmsContentRepositorySnapshot(currentSettings, snapshot as CmsContentRepositorySnapshot)
    case 'assets':
      return applyCmsAssetRepositorySnapshot(currentSettings, snapshot as CmsAssetRepositorySnapshot)
    case 'releases':
      return applyCmsReleaseRepositorySnapshot(currentSettings, snapshot as CmsReleaseRepositorySnapshot)
  }
}

function exportActiveTenantProfile(): void {
  const profile = getActiveTenantProfileSnapshot()
  downloadCmsJsonPayload(createCmsTenantProfileDownload(profile))
  savedAtLabel.value = `${profile.name} ${cmsUiText.value.tenantExportedSuffix}`
}

/**
 * Handles export the selected repository domain snapshot.
 */
function exportSelectedDomainSnapshot(): void {
  const activeProfile = getActiveTenantProfileSnapshot()
  const domain = selectedDomainTransfer.value
  downloadCmsJsonPayload(createCmsDomainSnapshotDownload({
    domain,
    snapshot: createSelectedDomainSnapshot(domain) as never,
    profile: activeProfile,
  }))
  savedAtLabel.value = getCmsDomainTransferExportedLabel(domain)
}

/**
 * Exports authored schemas and presets without touching page/media/release domains.
 */
function exportCmsSchemaPackage(): void {
  const activeProfile = getActiveTenantProfileSnapshot()
  downloadCmsJsonPayload(createCmsSchemaPackageDownload({
    snapshot: createCmsSchemaPackageSnapshot(settings.value),
    profile: activeProfile,
  }))
  savedAtLabel.value = getCmsSchemaPackageExportedLabel()
}

/**
 * Exports the current draft-vs-published review package for offline review.
 */
function exportCmsDraftComparisonPackage(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  if (!cmsPreviewDraftPublishedDiff.value) {
    return
  }

  const activeProfile = getActiveTenantProfileSnapshot()
  const payload = createCmsDraftComparisonExportPayload({
    profile: {
      id: activeProfile.id,
      name: activeProfile.name,
    },
    diff: cmsPreviewDraftPublishedDiff.value,
    localeCoverage: cmsPreviewLocaleCoverageMatrix.value,
    checklist: selectedReleaseCandidateChecklist.value ?? null,
  })

  const fileName = `ntk-cms-review-${toCmsJsonFileName(activeProfile.id)}.json`
  downloadCmsJsonPayload({
    fileName,
    payload,
    serializedPayload: JSON.stringify(payload, null, 2),
  })
  settings.value.releases.reviewPackages = appendCmsReviewPackageHistory(
    settings.value.releases.reviewPackages,
    createCmsReviewPackageHistoryEntry({
      fileName,
      payload,
    })
  )
  savedAtLabel.value = getCmsDraftComparisonPackageExportedLabel()
}

/**
 * Records one lightweight review acknowledgement for the selected release.
 */
function addSelectedReleaseAcknowledgement(): void {
  const release = selectedRelease.value
  if (!release) {
    savedAtLabel.value = cmsUiText.value.selectReleaseFirstLabel
    return
  }

  const entry = createCmsReleaseReviewAcknowledgementEntry({
    releaseId: release.id,
    releaseName: release.name,
    environment: activeReleaseEnvironment.value,
    decision: releaseAcknowledgementDecision.value,
    note: releaseAcknowledgementNote.value,
    actorId: governanceActor.id,
    actorRole: governanceActor.role,
    actorName: governanceActor.name,
  })

  settings.value.releases.reviewAcknowledgements = appendCmsReleaseReviewAcknowledgement(
    settings.value.releases.reviewAcknowledgements,
    entry
  )
  releaseAcknowledgementDecision.value = 'noted'
  releaseAcknowledgementNote.value = ''
  savedAtLabel.value = tr('Review acknowledgement recorded', 'Reconhecimento de revisao registrado')
}

async function onTenantImportFileChange(input: Event | File): Promise<void> {
  const file = resolveCmsImportedFile(input)
  if (!file) {
    return
  }

  try {
    checkpointCmsDraftRecovery()
    const imported = await importCmsTenantProfileFile({
      file,
      tenantProfilesState: tenantProfilesState.value,
      confirmReplace: profileId => typeof window !== 'undefined'
        && window.confirm(cmsUiText.value.tenantReplaceConfirmLabel(profileId)),
    })
    if (!imported) {
      savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
      return
    }

    tenantProfilesState.value = imported.tenantProfilesState
    activeTenantProfileId.value = imported.activeProfileId
    saveCmsTenantProfilesState(tenantProfilesState.value)
    onTenantProfileChange(imported.activeProfileId)
    applyGovernanceAction('import_settings', {
      summary: `${imported.profileName} ${tr('imported', 'importado')}`,
      metadata: {
        sourceVersion: String(imported.sourceVersion),
        profileId: imported.profileId,
      },
    })
    savedAtLabel.value = cmsUiText.value.tenantImportedWithVersionLabel(imported.profileName, imported.sourceVersion)
  } catch {
    savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
  }
}

async function onDomainImportFileChange(input: Event | File): Promise<void> {
  const file = resolveCmsImportedFile(input)
  if (!file) {
    return
  }

  try {
    checkpointCmsDraftRecovery()
    const imported = await importCmsDomainFile(file, selectedDomainTransfer.value)
    if (!imported) {
      savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
      return
    }

    selectedDomainTransfer.value = imported.domain
    const nextSettings = applySelectedDomainSnapshot(
      settings.value,
      imported.domain,
      imported.snapshot
    )

    applyCmsSettingsSnapshot(nextSettings)
    savedAtLabel.value = getCmsDomainTransferImportedLabel(
      imported.domain,
      imported.profileName.trim() || imported.profileId,
      imported.sourceVersion
    )
    applyGovernanceAction('import_settings', {
      summary: `${getCmsDomainTransferLabel(imported.domain)} ${tr('imported', 'importado')}`,
      metadata: {
        domain: imported.domain,
        sourceProfileId: imported.profileId,
        sourceVersion: String(imported.sourceVersion),
      },
    })
  } catch {
    savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
  }
}

async function onSchemaImportFileChange(input: Event | File): Promise<void> {
  const file = resolveCmsImportedFile(input)
  if (!file) {
    return
  }

  try {
    checkpointCmsDraftRecovery()
    const imported = await importCmsSchemaFile(file)
    if (!imported) {
      savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
      return
    }

    const nextSettings = applyCmsSchemaPackageSnapshot(settings.value, imported.snapshot)
    applyCmsSettingsSnapshot(nextSettings)
    savedAtLabel.value = getCmsSchemaPackageImportedLabel(
      imported.profileName.trim() || imported.profileId,
      imported.sourceVersion
    )
    applyGovernanceAction('import_settings', {
      summary: tr('Schema package imported', 'Pacote de schema importado'),
      metadata: {
        domain: 'schema',
        sourceProfileId: imported.profileId,
        sourceVersion: String(imported.sourceVersion),
      },
    })
  } catch {
    savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
  }
}

/**
 * Normalizes cms page id.
 */
function normalizeCmsPageId(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const normalizedId = normalizeIdSegment(page.id)
  page.id = normalizedId || `page-${pageIndex + 1}`
}

/**
 * Normalizes cms page path.
 */
function normalizeCmsPagePath(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const normalizedPath = `/${String(page.path ?? '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .toLowerCase()}`

  page.path = normalizedPath === '/' ? `/${page.id}` : normalizedPath
}

/**
 * Returns localized section preset options for a page content model.
 */
function getCmsSectionPresetOptions(page: CmsPageSettings): CmsSectionPresetOption[] {
  return listCmsSectionPresetOptions(
    settings.value.content.locale,
    page.contentModelId,
    settings.value.authoredContentModels
  )
}

/**
 * Returns localized starter block preset options for the currently selected section preset.
 */
function getCmsSectionStarterPresetOptions(pageIndex: number): CmsSectionStarterPresetOption[] {
  return listCmsSectionStarterPresetOptions(
    settings.value.content.locale,
    getSelectedSectionPresetForPage(pageIndex),
    settings.value.authoredBlockPresets
  )
}

/**
 * Returns visible starter preset variants for the page builder.
 * Custom/manual mode stays in the select control to keep the quick-pick UI focused.
 */
function getCmsSectionStarterPresetVariants(pageIndex: number): CmsSectionStarterPresetOption[] {
  return getCmsSectionStarterPresetOptions(pageIndex)
    .filter(option => option.value !== 'custom')
}

/**
 * Checks whether one starter preset variant is currently selected for the page.
 */
function isCmsSectionStarterPresetSelected(pageIndex: number, presetId: CmsBlockPresetId): boolean {
  return getSelectedSectionStarterPresetForPage(pageIndex) === presetId
}

/**
 * Returns a concise source label for starter preset quick-pick cards.
 */
function getCmsStarterPresetSourceLabel(option: CmsSectionStarterPresetOption): string {
  if (option.isDefault) {
    return tr('Default', 'Padrao')
  }

  return option.source === 'authored'
    ? tr('Authored', 'Authored')
    : tr('Built-in', 'Nativo')
}

/**
 * Returns reusable section options compatible with a given page content model.
 */
function getCmsReusableSectionOptions(page: CmsPageSettings): Array<{
  label: string
  value: string
  description: string
}> {
  return cmsReusableSectionLibrary.value
    .filter(reusableSection => !isCmsArchivedEntity(reusableSection) && !isCmsDeprecatedEntity(reusableSection))
    .filter(reusableSection => isCmsSectionPresetAllowedForContentModel(
      page.contentModelId,
      reusableSection.presetId,
      settings.value.authoredContentModels
    ))
    .map(reusableSection => ({
      label: `${reusableSection.name} (${getCmsSectionPresetLabel(reusableSection.presetId)})`,
      value: reusableSection.id,
      description: reusableSection.description || `${getCmsContentModelLabel(settings.value.content.locale, reusableSection.contentModelId, settings.value.authoredContentModels)} · ${getCmsReusableSectionLabelValue(reusableSection)}`,
    }))
}

/**
 * Counts enabled sections currently rendered in one page.
 */
function getCmsEnabledSectionCount(page: CmsPageSettings): number {
  return page.sections.filter(section => section.enabled).length
}

/**
 * Counts enabled sections using a given preset inside one page.
 */
function getCmsEnabledSectionPresetUsageCount(
  page: CmsPageSettings,
  presetId: CmsSectionPresetId
): number {
  return page.sections.filter(section => (
    section.enabled
    && resolveCmsSectionPresetId(section.presetId) === presetId
  )).length
}

/**
 * Checks whether the selected preset can still be inserted into one page according to its content model rules.
 */
function isCmsPageSectionAddBlocked(pageIndex: number): boolean {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return true
  }

  const maxSections = getCmsContentModelMaxSections(page.contentModelId, settings.value.authoredContentModels)
  if (maxSections != null && getCmsEnabledSectionCount(page) >= maxSections) {
    return true
  }

  const selectedPresetId = getSelectedSectionPresetForPage(pageIndex)
  const presetLimits = getCmsContentModelSectionPresetLimitMap(page.contentModelId, settings.value.authoredContentModels)
  const selectedPresetLimit = presetLimits[selectedPresetId]

  return typeof selectedPresetLimit === 'number'
    && getCmsEnabledSectionPresetUsageCount(page, selectedPresetId) >= selectedPresetLimit
}

/**
 * Resolves the currently selected section preset for a page editor card.
 */
function getSelectedSectionPresetForPage(pageIndex: number): CmsSectionPresetId {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return 'hero'
  }

  const storedPresetId = pageSectionPresetSelections.value[pageIndex]
  const allowedPresetIds = new Set(getCmsSectionPresetOptions(page).map(option => option.value))
  if (storedPresetId && allowedPresetIds.has(storedPresetId)) {
    return storedPresetId
  }

  const resolvedFallbackPresetId = getDefaultCmsSectionPresetId(
    page.contentModelId,
    settings.value.authoredContentModels
  )
  return allowedPresetIds.has(resolvedFallbackPresetId)
    ? resolvedFallbackPresetId
    : (getCmsSectionPresetOptions(page)[0]?.value ?? 'hero')
}

/**
 * Updates the temporary section preset selection used by the page editor.
 */
function setSelectedSectionPresetForPage(pageIndex: number, value: unknown): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const nextPresetId = resolveCmsSectionPresetId(value)
  const allowedPresetIds = new Set(getCmsSectionPresetOptions(page).map(option => option.value))
  pageSectionPresetSelections.value = {
    ...pageSectionPresetSelections.value,
    [pageIndex]: allowedPresetIds.has(nextPresetId)
      ? nextPresetId
      : getSelectedSectionPresetForPage(pageIndex),
  }
  setSelectedSectionStarterPresetForPage(
    pageIndex,
    getDefaultCmsBlockPresetIdForSectionPreset(pageSectionPresetSelections.value[pageIndex])
  )
}

/**
 * Resolves the selected starter block preset for one page card.
 */
function getSelectedSectionStarterPresetForPage(pageIndex: number): CmsBlockPresetId {
  const options = getCmsSectionStarterPresetOptions(pageIndex)
  const storedPresetId = pageSectionStarterPresetSelections.value[pageIndex]
  if (storedPresetId && options.some(option => option.value === storedPresetId)) {
    return storedPresetId
  }

  const fallbackPresetId = resolveCmsBlockPresetId(
    getDefaultCmsBlockPresetIdForSectionPreset(getSelectedSectionPresetForPage(pageIndex))
  )
  return options.some(option => option.value === fallbackPresetId)
    ? fallbackPresetId
    : (options[0]?.value ?? 'custom')
}

/**
 * Updates the starter block preset used when inserting a new section.
 */
function setSelectedSectionStarterPresetForPage(pageIndex: number, value: unknown): void {
  const options = getCmsSectionStarterPresetOptions(pageIndex)
  const nextPresetId = resolveCmsBlockPresetId(value)
  pageSectionStarterPresetSelections.value = {
    ...pageSectionStarterPresetSelections.value,
    [pageIndex]: options.some(option => option.value === nextPresetId)
      ? nextPresetId
      : getSelectedSectionStarterPresetForPage(pageIndex),
  }
}

/**
 * Resolves the selected reusable section template for a page card.
 */
function getSelectedReusableSectionForPage(pageIndex: number): string {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return ''
  }

  const storedReusableSectionId = pageReusableSectionSelections.value[pageIndex]
  const options = getCmsReusableSectionOptions(page)
  if (storedReusableSectionId && options.some(option => option.value === storedReusableSectionId)) {
    return storedReusableSectionId
  }

  return String(options[0]?.value ?? '')
}

/**
 * Updates the temporary reusable-section selection used by one page editor card.
 */
function setSelectedReusableSectionForPage(pageIndex: number, value: unknown): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const normalizedId = String(value ?? '').trim()
  const options = getCmsReusableSectionOptions(page)
  pageReusableSectionSelections.value = {
    ...pageReusableSectionSelections.value,
    [pageIndex]: options.some(option => option.value === normalizedId)
      ? normalizedId
      : getSelectedReusableSectionForPage(pageIndex),
  }
}

/**
 * Resolves a localized preset label for section rows and preview chips.
 */
function getCmsSectionPresetLabel(presetId: CmsSectionPresetId): string {
  const option = listCmsSectionPresetOptions(
    settings.value.content.locale,
    'blank-page',
    settings.value.authoredContentModels
  )
    .find(entry => entry.value === presetId)
  return option?.label ?? presetId
}

/**
 * Creates a collision-safe page path from a content-model default prefix.
 */
function createUniqueCmsPagePathFromPrefix(pathPrefix: string, pageIndex: number): string {
  const normalizedBaseSegment = String(pathPrefix ?? '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .toLowerCase()
  const fallbackSegment = normalizeIdSegment(settings.value.pages[pageIndex]?.id) || `page-${pageIndex + 1}`
  const baseSegment = normalizedBaseSegment || fallbackSegment
  const occupiedSegments = new Set(
    settings.value.pages
      .filter((_, index) => index !== pageIndex)
      .map(page => String(page.path ?? '').trim().replace(/^\/+/, '').toLowerCase())
      .filter(Boolean)
  )

  if (!occupiedSegments.has(baseSegment)) {
    return `/${baseSegment}`
  }

  let suffix = 2
  let candidate = `${baseSegment}-${suffix}`
  while (occupiedSegments.has(candidate)) {
    suffix += 1
    candidate = `${baseSegment}-${suffix}`
  }

  return `/${candidate}`
}

/**
 * Resolves the current schema version for one page content model.
 */
function getCmsPageCurrentSchemaVersion(
  page: CmsPageSettings,
  authoredContentModels: CmsAuthoredContentModelSettings[] = settings.value.authoredContentModels
): number {
  return getCmsContentModelSchemaVersion(
    page.contentModelId,
    authoredContentModels
  )
}

/**
 * Resolves one page-level schema migration report by page id.
 */
function getCmsPageSchemaMigrationReport(pageId: string): CmsPageSchemaMigrationReport | null {
  return cmsPageSchemaMigrationReportMap.value.get(pageId) ?? null
}

/**
 * Formats one compact change summary for schema migration preview surfaces.
 */
function getCmsSchemaMigrationSummaryLabel(report: CmsPageSchemaMigrationReport | null | undefined): string {
  if (!report) {
    return tr('No schema migration data.', 'Nenhum dado de migracao de schema.')
  }

  const parts: string[] = []
  if (report.summary.addCount > 0) {
    parts.push(tr(`${report.summary.addCount} add`, `${report.summary.addCount} adicao(oes)`))
  }
  if (report.summary.updateCount > 0) {
    parts.push(tr(`${report.summary.updateCount} update`, `${report.summary.updateCount} atualizacao(oes)`))
  }
  if (report.summary.removeCount > 0) {
    parts.push(tr(`${report.summary.removeCount} remove`, `${report.summary.removeCount} remocao(oes)`))
  }

  if (parts.length === 0) {
    if (report.status === 'invalid-model') {
      return tr(
        'This page references an invalid content model and requires manual review.',
        'Esta pagina referencia um modelo de conteudo invalido e exige revisao manual.'
      )
    }

    if (report.status === 'ahead') {
      return tr(
        'This page is ahead of the current content-model schema and requires manual review.',
        'Esta pagina esta a frente do schema atual do modelo e exige revisao manual.'
      )
    }

    if (report.status === 'version-missing') {
      return tr(
        'The applied schema version is missing and can be aligned safely.',
        'A versao aplicada do schema esta ausente e pode ser alinhada com seguranca.'
      )
    }

    return tr('Schema already matches the current content-model contract.', 'O schema ja corresponde ao contrato atual do modelo.')
  }

  return parts.join(' · ')
}

/**
 * Formats the aggregated migration summary for the Pages toolbar.
 */
function getCmsSchemaMigrationBatchSummaryLabel(): string {
  const summary = cmsSchemaMigrationBatchReport.value.summary
  return tr(
    `${summary.changedPageCount} page(s) with reviewable schema changes`,
    `${summary.changedPageCount} pagina(s) com mudancas de schema revisaveis`
  )
}

/**
 * Resolves a status label for one schema migration report.
 */
function getCmsSchemaMigrationStatusLabel(status: CmsSchemaMigrationStatus): string {
  switch (status) {
    case 'upgrade-required':
      return tr('Upgrade required', 'Upgrade necessario')
    case 'version-missing':
      return tr('Version missing', 'Versao ausente')
    case 'invalid-model':
      return tr('Invalid model', 'Modelo invalido')
    case 'ahead':
      return tr('Ahead of model', 'A frente do modelo')
    case 'current':
    default:
      return tr('Current', 'Atual')
  }
}

/**
 * Resolves chip styling for one schema migration status.
 */
function getCmsSchemaMigrationStatusStyle(status: CmsSchemaMigrationStatus): Record<string, string> {
  switch (status) {
    case 'upgrade-required':
    case 'version-missing':
      return warningActionStyle.value
    case 'invalid-model':
    case 'ahead':
      return dangerActionStyle.value
    case 'current':
    default:
      return statusChipStyle.value
  }
}

/**
 * Resolves a translated label for one migration change kind.
 */
function getCmsSchemaMigrationChangeKindLabel(kind: CmsPageSchemaMigrationChange['kind']): string {
  switch (kind) {
    case 'add':
      return tr('Add', 'Adicionar')
    case 'remove':
      return tr('Remove', 'Remover')
    case 'update':
    default:
      return tr('Update', 'Atualizar')
  }
}

/**
 * Resolves chip styling for one migration change kind.
 */
function getCmsSchemaMigrationChangeStyle(kind: CmsPageSchemaMigrationChange['kind']): Record<string, string> {
  switch (kind) {
    case 'add':
      return primaryActionStyle.value
    case 'remove':
      return dangerActionStyle.value
    case 'update':
    default:
      return warningActionStyle.value
  }
}

/**
 * Formats before/after values for one migration report row.
 */
function getCmsSchemaMigrationChangeValueLabel(change: CmsPageSchemaMigrationChange | null | undefined): string {
  if (!change) {
    return ''
  }

  if (change.kind === 'remove') {
    return `${tr('Previous', 'Anterior')}: ${formatCmsSchemaMigrationValue(change.previousValue)}`
  }

  if (change.kind === 'add') {
    return `${tr('Next', 'Proximo')}: ${formatCmsSchemaMigrationValue(change.nextValue)}`
  }

  return `${formatCmsSchemaMigrationValue(change.previousValue)} -> ${formatCmsSchemaMigrationValue(change.nextValue)}`
}

/**
 * Updates one page to the current schema version while normalizing page-level custom fields.
 */
function syncCmsPageContentModelVersion(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const report = createCmsPageSchemaMigrationReport({
    page,
    localeInput: settings.value.content.locale,
    authoredContentModels: settings.value.authoredContentModels,
  })

  if (!report.canApply) {
    savedAtLabel.value = report.status === 'ahead'
      ? tr(
          'Schema upgrade blocked because the page is ahead of the current content model.',
          'Upgrade de schema bloqueado porque a pagina esta a frente do modelo atual.'
        )
      : report.status === 'invalid-model'
        ? tr(
            'Schema upgrade blocked because the page references an invalid content model.',
            'Upgrade de schema bloqueado porque a pagina referencia um modelo de conteudo invalido.'
          )
        : tr('Schema already matches the current content model.', 'O schema ja corresponde ao modelo atual.')
    return
  }

  settings.value.pages.splice(pageIndex, 1, applyCmsPageSchemaMigration({
    page,
    localeInput: settings.value.content.locale,
    authoredContentModels: settings.value.authoredContentModels,
  }))
  savedAtLabel.value = `${tr('Schema upgrade applied at', 'Upgrade do schema aplicado as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Applies one content-model default title/description/path scaffold to a page.
 */
function applyCmsPageContentModelDefaults(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const locale = settings.value.content.locale
  updateCmsPageTitleValue(
    page,
    getCmsContentModelDefaultPageTitle(locale, page.contentModelId, settings.value.authoredContentModels)
  )
  updateCmsPageDescriptionValue(
    page,
    getCmsContentModelDefaultPageDescription(locale, page.contentModelId, settings.value.authoredContentModels)
  )
  page.path = createUniqueCmsPagePathFromPrefix(
    getCmsContentModelDefaultPagePathPrefix(page.contentModelId, settings.value.authoredContentModels),
    pageIndex
  )
  page.customFields = createCmsPageCustomFieldsFromContentModel(
    page.contentModelId,
    settings.value.content.locale,
    settings.value.authoredContentModels
  )
  page.contentModelVersion = getCmsPageCurrentSchemaVersion(page)
  savedAtLabel.value = `${tr('Content-model defaults applied at', 'Defaults do modelo aplicados as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Updates the page content model without rewriting authored content.
 */
function updateCmsPageContentModel(pageIndex: number, value: CmsContentModelId | string | null): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  page.contentModelId = resolveCmsContentModelId(value, settings.value.authoredContentModels)
  page.contentModelVersion = getCmsPageCurrentSchemaVersion(page)
  setSelectedSectionPresetForPage(
    pageIndex,
    getDefaultCmsSectionPresetId(page.contentModelId, settings.value.authoredContentModels)
  )
  setSelectedSectionStarterPresetForPage(
    pageIndex,
    getDefaultCmsBlockPresetIdForSectionPreset(getSelectedSectionPresetForPage(pageIndex))
  )

  page.customFields = normalizeCmsPageCustomFieldsForContentModel(
    page.customFields,
    page.contentModelId,
    settings.value.content.locale,
    settings.value.authoredContentModels
  )

  if (page.sections.length === 0) {
    applyCmsPageContentModelStarterSections(pageIndex)
  }
}

/**
 * Replaces one page section list with the scaffold defined by its content model.
 */
function applyCmsPageContentModelStarterSections(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  page.sections = createCmsPageSectionsFromContentModel({
    contentModelId: page.contentModelId,
    localeInput: settings.value.content.locale,
    authoredModels: settings.value.authoredContentModels,
    authoredPresets: settings.value.authoredBlockPresets,
  })
  page.contentModelVersion = getCmsPageCurrentSchemaVersion(page)
}

/**
 * Creates one page from the selected template and initializes builder selections.
 */
function createCmsPageFromSelectedTemplate(
  templateId: CmsPageTemplateId,
  options: { openBlocksAfterCreate?: boolean } = {}
): void {
  const page = createCmsPageFromTemplate({
    templateId,
    existingPages: settings.value.pages,
    localeInput: settings.value.content.locale,
  })

  page.customFields = normalizeCmsPageCustomFieldsForContentModel(
    page.customFields,
    page.contentModelId,
    settings.value.content.locale,
    settings.value.authoredContentModels
  )

  settings.value.pages.push(page)
  const pageIndex = settings.value.pages.length - 1
  const defaultPresetId = getDefaultCmsSectionPresetId(
    page.contentModelId,
    settings.value.authoredContentModels
  )
  setSelectedSectionPresetForPage(pageIndex, defaultPresetId)
  setSelectedSectionStarterPresetForPage(
    pageIndex,
    getDefaultCmsBlockPresetIdForSectionPreset(defaultPresetId)
  )
  selectedPageTemplateId.value = templateId

  savedAtLabel.value = `${tr('Page created at', 'Pagina criada as')} ${new Date().toLocaleTimeString()}`

  if (!options.openBlocksAfterCreate) {
    return
  }

  const firstSection = page.sections.find(section => section.enabled) ?? page.sections[0]
  if (!firstSection) {
    return
  }

  openPageInBlocksEditor(page.id, firstSection.id)
  savedAtLabel.value = `${tr('Quick start opened in Blocks at', 'Quick start aberto em Blocos as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Handles add cms page.
 */
function addCmsPage(): void {
  createCmsPageFromSelectedTemplate(selectedPageTemplateId.value)
}

/**
 * Runs one guided quick-start workflow from the page templates catalog.
 */
function runCmsPageQuickStart(templateId: CmsPageTemplateId, openBlocksAfterCreate = false): void {
  createCmsPageFromSelectedTemplate(templateId, { openBlocksAfterCreate })
}

/**
 * Installs one higher-level starter kit by composing page templates and reusable libraries.
 */
function runCmsStarterKit(starterKitId: CmsStarterKitId, openBlocksAfterCreate = false): void {
  const bundle = createCmsStarterKitBundle({
    kitId: starterKitId,
    settings: {
      pages: settings.value.pages,
      reusableSections: settings.value.reusableSections,
      reusableBlocks: settings.value.reusableBlocks,
      authoredBlockPresets: settings.value.authoredBlockPresets,
      authoredContentModelFieldPresets: settings.value.authoredContentModelFieldPresets,
      authoredContentModels: settings.value.authoredContentModels,
    },
    localeInput: settings.value.content.locale,
  })

  settings.value.pages.push(bundle.page)
  settings.value.reusableSections = [...bundle.reusableSections, ...settings.value.reusableSections]
  settings.value.reusableBlocks = [...bundle.reusableBlocks, ...settings.value.reusableBlocks]
  settings.value.authoredBlockPresets = [...bundle.authoredBlockPresets, ...settings.value.authoredBlockPresets]
  settings.value.authoredContentModelFieldPresets = [
    ...bundle.authoredContentModelFieldPresets,
    ...settings.value.authoredContentModelFieldPresets,
  ]

  const pageIndex = settings.value.pages.length - 1
  const defaultPresetId = getDefaultCmsSectionPresetId(
    bundle.page.contentModelId,
    settings.value.authoredContentModels
  )
  setSelectedSectionPresetForPage(pageIndex, defaultPresetId)
  setSelectedSectionStarterPresetForPage(
    pageIndex,
    getDefaultCmsBlockPresetIdForSectionPreset(defaultPresetId)
  )
  selectedPageTemplateId.value = bundle.templateId

  savedAtLabel.value = `${tr('Starter kit installed at', 'Starter kit instalado as')} ${new Date().toLocaleTimeString()}`

  if (!openBlocksAfterCreate) {
    return
  }

  const firstSection = bundle.page.sections.find(section => section.enabled) ?? bundle.page.sections[0]
  if (!firstSection) {
    return
  }

  openPageInBlocksEditor(bundle.page.id, firstSection.id)
  savedAtLabel.value = `${tr('Starter kit opened in Blocks at', 'Starter kit aberto em Blocos as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Handles remove cms page.
 */
function removeCmsPage(pageIndex: number): void {
  if (settings.value.pages.length <= 1) {
    return
  }
  settings.value.pages.splice(pageIndex, 1)
}

/**
 * Handles add cms page section.
 */
function addCmsPageSection(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page || isCmsPageSectionAddBlocked(pageIndex)) {
    return
  }

  const presetId = getSelectedSectionPresetForPage(pageIndex)
  page.sections.push(createCmsPageSectionFromPreset({
    presetId,
    existingSections: page.sections,
    localeInput: settings.value.content.locale,
    starterPresetId: getSelectedSectionStarterPresetForPage(pageIndex),
    authoredPresets: settings.value.authoredBlockPresets,
  }))
}

/**
 * Saves an authored section into the reusable library.
 */
function saveCmsPageSectionAsReusable(pageIndex: number, sectionIndex: number): void {
  const page = settings.value.pages[pageIndex]
  const rawSection = page?.sections[sectionIndex]
  if (!page || !rawSection) {
    return
  }

  const section = resolveCmsReusableSectionReference({
    section: rawSection,
    reusableSections: settings.value.reusableSections,
    reusableBlocks: settings.value.reusableBlocks,
  })
  const reusableSection = createCmsReusableSectionFromSection({
    page,
    section,
    existingSections: settings.value.reusableSections,
  })

  settings.value.reusableSections = [reusableSection, ...settings.value.reusableSections]
  pageReusableSectionSelections.value = {
    ...pageReusableSectionSelections.value,
    [pageIndex]: reusableSection.id,
  }
  savedAtLabel.value = `${tr('Reusable section saved at', 'Secao reutilizavel salva as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Creates one reusable section variant from an existing reusable source.
 */
function createReusableSectionVariant(reusableSectionId: string, pageIndex?: number): CmsReusableSectionSettings | null {
  const sourceReusableSection = settings.value.reusableSections.find(reusableSection => reusableSection.id === reusableSectionId)
  if (!sourceReusableSection) {
    return null
  }

  const variant = createCmsReusableSectionVariantFromReusable({
    reusableSection: sourceReusableSection,
    existingSections: settings.value.reusableSections,
  })

  settings.value.reusableSections = [variant, ...settings.value.reusableSections]
  if (typeof pageIndex === 'number') {
    pageReusableSectionSelections.value = {
      ...pageReusableSectionSelections.value,
      [pageIndex]: variant.id,
    }
  }
  savedAtLabel.value = `${tr('Reusable section variant created at', 'Variante de secao reutilizavel criada as')} ${new Date().toLocaleTimeString()}`
  return variant
}

/**
 * Branches one page section into a new reusable variant and relinks the page section to it.
 */
function branchCmsPageSectionToVariant(pageIndex: number, sectionIndex: number): void {
  const page = settings.value.pages[pageIndex]
  const rawSection = page?.sections[sectionIndex]
  if (!page || !rawSection) {
    return
  }

  const sourceReusableSection = rawSection.reusableSourceId
    ? settings.value.reusableSections.find(reusableSection => reusableSection.id === rawSection.reusableSourceId) ?? null
    : null
  const resolvedSection = resolveCmsReusableSectionReference({
    section: rawSection,
    reusableSections: settings.value.reusableSections,
    reusableBlocks: settings.value.reusableBlocks,
  })

  const variant = createCmsReusableSectionFromSection({
    page,
    section: resolvedSection,
    existingSections: settings.value.reusableSections,
    name: sourceReusableSection
      ? undefined
      : `${getCmsSectionLabelValue(resolvedSection) || resolvedSection.id} ${tr('Variant', 'Variante')}`,
    description: sourceReusableSection?.description ?? '',
    category: sourceReusableSection?.category ?? resolvedSection.presetId,
    sourceReusableSection,
  })

  settings.value.reusableSections = [variant, ...settings.value.reusableSections]
  pageReusableSectionSelections.value = {
    ...pageReusableSectionSelections.value,
    [pageIndex]: variant.id,
  }
  const relinkedSection = cloneCmsReusableSectionIntoPageSection({
    reusableSection: variant,
    existingSections: page.sections,
    mode: 'linked',
  })
  page.sections.splice(sectionIndex, 1, {
    ...relinkedSection,
    id: rawSection.id,
    enabled: rawSection.enabled,
    blocks: relinkedSection.blocks.map((block, blockIndex) => ({
      ...block,
      id: rawSection.blocks[blockIndex]?.id ?? block.id,
      enabled: typeof rawSection.blocks[blockIndex]?.enabled === 'boolean'
        ? rawSection.blocks[blockIndex].enabled
        : block.enabled,
    })),
  })
  savedAtLabel.value = `${tr('Reusable section branched at', 'Secao reutilizavel ramificada as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Inserts the selected reusable section into the target page.
 */
function insertSelectedReusableSection(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const reusableSectionId = getSelectedReusableSectionForPage(pageIndex)
  const reusableSection = settings.value.reusableSections.find(entry => entry.id === reusableSectionId)
  if (!reusableSection) {
    savedAtLabel.value = tr('Select a reusable section before inserting it.', 'Selecione uma secao reutilizavel antes de inseri-la.')
    return
  }

  page.sections.push(cloneCmsReusableSectionIntoPageSection({
    reusableSection,
    existingSections: page.sections,
    mode: 'detached',
  }))
  savedAtLabel.value = `${tr('Reusable section inserted at', 'Secao reutilizavel inserida as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Inserts the selected reusable section into the target page as a linked reference.
 */
function insertSelectedLinkedReusableSection(pageIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }

  const reusableSectionId = getSelectedReusableSectionForPage(pageIndex)
  const reusableSection = settings.value.reusableSections.find(entry => entry.id === reusableSectionId)
  if (!reusableSection) {
    savedAtLabel.value = tr('Select a reusable section before inserting it.', 'Selecione uma secao reutilizavel antes de inseri-la.')
    return
  }

  page.sections.push(cloneCmsReusableSectionIntoPageSection({
    reusableSection,
    existingSections: page.sections,
    mode: 'linked',
  }))
  savedAtLabel.value = `${tr('Linked reusable section inserted at', 'Secao reutilizavel vinculada inserida as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Creates a local duplicate of a page section without saving it to the reusable library.
 */
function duplicateCmsPageSection(pageIndex: number, sectionIndex: number): void {
  const page = settings.value.pages[pageIndex]
  const section = page?.sections[sectionIndex]
  if (!page || !section) {
    return
  }

  const reusableSection = createCmsReusableSectionFromSection({
    page,
    section,
    existingSections: [],
    name: `${getCmsSectionLabelValue(section) || section.id} Copy`,
  })

  const duplicatedSection = cloneCmsReusableSectionIntoPageSection({
    reusableSection,
    existingSections: page.sections,
  })
  duplicatedSection.reusableMode = section.reusableMode
  duplicatedSection.reusableSourceId = section.reusableSourceId
  duplicatedSection.blocks = duplicatedSection.blocks.map((block, blockIndex) => ({
    ...block,
    reusableMode: section.blocks[blockIndex]?.reusableMode,
    reusableSourceId: section.blocks[blockIndex]?.reusableSourceId,
  }))
  page.sections.splice(sectionIndex + 1, 0, duplicatedSection)
}

/**
 * Handles remove cms page section.
 */
function removeCmsPageSection(pageIndex: number, sectionIndex: number): void {
  const page = settings.value.pages[pageIndex]
  if (!page) {
    return
  }
  page.sections.splice(sectionIndex, 1)
}

/**
 * Archives one reusable section template while keeping linked references resolvable.
 */
function archiveReusableSection(reusableSectionId: string): void {
  settings.value.reusableSections = settings.value.reusableSections.map(reusableSection => (
    reusableSection.id === reusableSectionId
      ? archiveCmsEntity(reusableSection)
      : reusableSection
  ))
  savedAtLabel.value = `${tr('Reusable section archived at', 'Secao reutilizavel arquivada as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Restores one archived reusable section template to the visible section library.
 */
function unarchiveReusableSection(reusableSectionId: string): void {
  settings.value.reusableSections = settings.value.reusableSections.map(reusableSection => (
    reusableSection.id === reusableSectionId
      ? unarchiveCmsEntity(reusableSection)
      : reusableSection
  ))
  savedAtLabel.value = `${tr('Reusable section restored at', 'Secao reutilizavel restaurada as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Marks one reusable section as deprecated for new page authoring flows.
 */
function deprecateReusableSection(reusableSectionId: string): void {
  settings.value.reusableSections = settings.value.reusableSections.map(reusableSection => (
    reusableSection.id === reusableSectionId
      ? deprecateCmsEntity(reusableSection)
      : reusableSection
  ))
  savedAtLabel.value = `${tr('Reusable section deprecated at', 'Secao reutilizavel descontinuada as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Clears deprecation metadata from one reusable section.
 */
function undeprecateReusableSection(reusableSectionId: string): void {
  settings.value.reusableSections = settings.value.reusableSections.map(reusableSection => (
    reusableSection.id === reusableSectionId
      ? undeprecateCmsEntity(reusableSection)
      : reusableSection
  ))
  savedAtLabel.value = `${tr('Reusable section reinstated at', 'Secao reutilizavel reativada as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Updates one reusable section replacement target.
 */
function updateReusableSectionReplacement(reusableSectionId: string, replacementEntityId: unknown): void {
  settings.value.reusableSections = settings.value.reusableSections.map(reusableSection => (
    reusableSection.id === reusableSectionId
      ? updateCmsDeprecatedEntityReplacement(reusableSection, String(replacementEntityId ?? ''))
      : reusableSection
  ))
}

/**
 * Updates one reusable section deprecation note.
 */
function updateReusableSectionDeprecationNote(reusableSectionId: string, deprecationNote: unknown): void {
  settings.value.reusableSections = settings.value.reusableSections.map(reusableSection => (
    reusableSection.id === reusableSectionId
      ? updateCmsDeprecatedEntityNote(reusableSection, String(deprecationNote ?? ''))
      : reusableSection
  ))
}

/**
 * Detaches a linked page section from its reusable source while preserving the resolved snapshot.
 */
function detachCmsPageSection(pageIndex: number, sectionIndex: number): void {
  const page = settings.value.pages[pageIndex]
  const section = page?.sections[sectionIndex]
  if (!page || !section || !isCmsPageSectionLinked(section)) {
    return
  }

  page.sections.splice(sectionIndex, 1, detachCmsPageSectionFromReusable({
    section,
    reusableSections: settings.value.reusableSections,
    reusableBlocks: settings.value.reusableBlocks,
  }))
  savedAtLabel.value = `${tr('Reusable section detached at', 'Secao reutilizavel desvinculada as')} ${new Date().toLocaleTimeString()}`
}

/**
 * Resolves drag-and-drop target index using the hovered row midpoint.
 */
function resolveVerticalDropIndex(event: DragEvent, rowIndex: number): number {
  const currentTarget = event.currentTarget as HTMLElement | null
  if (!currentTarget) {
    return rowIndex
  }

  const { top, height } = currentTarget.getBoundingClientRect()
  return event.clientY >= top + (height / 2)
    ? rowIndex + 1
    : rowIndex
}

/**
 * Starts dragging one page section inside the pages builder.
 */
function onCmsPageSectionDragStart(pageId: string, sectionId: string, event: DragEvent): void {
  draggedPageSection.value = { pageId, sectionId }
  pageSectionDropTargetKey.value = sectionId

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', `${pageId}:${sectionId}`)
  }
}

/**
 * Clears temporary page-section drag state.
 */
function onCmsPageSectionDragEnd(): void {
  draggedPageSection.value = null
  pageSectionDropTargetKey.value = ''
}

/**
 * Tracks the current section drop target while dragging.
 */
function onCmsPageSectionDragOver(pageId: string, sectionId: string, event: DragEvent): void {
  if (!draggedPageSection.value || draggedPageSection.value.pageId !== pageId) {
    return
  }

  event.preventDefault()
  pageSectionDropTargetKey.value = sectionId
}

/**
 * Reorders sections inside a page editor card using builder-state helpers.
 */
function onCmsPageSectionDrop(pageIndex: number, sectionId: string, sectionIndex: number, event: DragEvent): void {
  if (!draggedPageSection.value) {
    return
  }

  event.preventDefault()

  const page = settings.value.pages[pageIndex]
  if (!page || draggedPageSection.value.pageId !== page.id) {
    onCmsPageSectionDragEnd()
    return
  }

  const state = createCmsBuilderState(toCmsPageSchema(page))
  const nextState = moveCmsBuilderSectionToIndex(state, {
    sectionId: draggedPageSection.value.sectionId,
    targetIndex: resolveVerticalDropIndex(event, sectionIndex),
  })
  applyBuilderStateToPage(pageIndex, nextState)
  onCmsPageSectionDragEnd()
}

/**
 * Checks whether an URL should be rendered as image preview.
 */
function isPreviewImageAsset(url: string): boolean {
  const value = String(url ?? '').trim().toLowerCase()
  if (!value) {
    return false
  }
  if (value.startsWith('data:image/')) {
    return true
  }
  return /\.(png|jpe?g|gif|webp|svg|ico)(\?.*)?$/.test(value)
}

/**
 * Handles get cms page status style.
 */
function getCmsPageStatusStyle(status: CmsPageSettings['status']): Record<string, string> {
  if (status === 'published') {
    return {
      background: notificationSuccessColor.value,
      color: notificationSuccessTextColor.value,
    }
  }

  return {
    background: notificationWarningColor.value,
    color: notificationWarningTextColor.value,
  }
}

/**
 * Handles get cms page section style.
 */
function getCmsPageSectionStyle(enabled: boolean): Record<string, string> {
  if (enabled) {
    return {
      background: accentSoftBackground.value,
      color: accentTextColor.value,
      border: `${resolvedBorderWidth.value} solid ${accentColor.value}`,
    }
  }

  return {
    background: settings.value.theme.drawerBackground || defaultTheme.drawerBackground || '',
    color: settings.value.theme.drawerTextColor || defaultTheme.drawerTextColor || '',
    border: `${resolvedBorderWidth.value} solid ${settings.value.theme.dividerColor || defaultTheme.dividerColor || ''}`,
  }
}

/**
 * Handles add group.
 */
function addGroup(): void {
  const id = `group-${Math.random().toString(36).slice(2, 7)}`
  settings.value.navGroups.push({
    id,
    label: 'New Group',
  })
}

/**
 * Normalizes group id.
 */
function normalizeGroupId(index: number): void {
  const current = settings.value.navGroups[index]
  if (!current) {
    return
  }

  const nextId = normalizeIdSegment(current.id)

  if (!nextId) {
    current.id = `group-${index + 1}`
    return
  }

  current.id = nextId
}

/**
 * Handles remove group.
 */
function removeGroup(index: number): void {
  if (settings.value.navGroups.length <= 1) {
    return
  }

  const [removed] = settings.value.navGroups.splice(index, 1)
  if (!removed) {
    return
  }

  const fallbackGroup = settings.value.navGroups[0]?.id
  if (!fallbackGroup) {
    return
  }

  for (const item of settings.value.items) {
    if (item.group === removed.id) {
      item.group = fallbackGroup
    }
  }
}

/**
 * Handles add menu item.
 */
function addMenuItem(): void {
  const groupId = settings.value.navGroups[0]?.id ?? 'core'
  settings.value.items.push(createNewMenuItem(groupId))
}

/**
 * Handles remove menu item.
 */
function removeMenuItem(index: number): void {
  if (settings.value.items.length <= 1) {
    return
  }
  settings.value.items.splice(index, 1)
}

/**
 * Handles add toolbar action.
 */
function addToolbarAction(): void {
  settings.value.toolbarActions.push({
    id: `action-${Math.random().toString(36).slice(2, 7)}`,
    icon: 'bolt',
    label: tr('Action', 'Acao'),
    tooltip: tr('Custom action', 'Acao customizada'),
    flat: true,
    dense: true,
    round: false,
    showLabel: true,
  })
}

/**
 * Handles remove toolbar action.
 */
function removeToolbarAction(index: number): void {
  settings.value.toolbarActions.splice(index, 1)
}

/**
 * Handles on toolbar action.
 */
function onToolbarAction(action: AppShellAction): void {
  if (!action.id) {
    return
  }

  if (action.id === 'notifications' || action.id === 'account') {
    return
  }
}

function handleCmsShellHeaderAction(action: AppShellAction): void {
  if (!action.id) {
    return
  }

  if (action.href) {
    return
  }

  onToolbarAction(action)
}

function onCmsTemplateMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
  if (!item.id) {
    return
  }

  activeMenuId.value = item.id
}

function onCmsHeaderAccountClick(): void {
  // CMS runtime keeps the account menu visual contract but does not yet route
  // to a dedicated profile surface.
}

function onCmsHeaderLogoutClick(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

/**
 * Saves now.
 */
function saveNow(): void {
  clearCmsAutosaveTimer()
  persistCmsDraftRecoverySnapshot('autosave')
  applyGovernanceAction('save_draft', {
    summary: cmsUiText.value.settingsSavedManuallySummary,
    metadata: {
      source: 'toolbar',
    },
  })
  saveCmsWhiteLabelSettings(settings.value)
  savedAtLabel.value = buildSavedAtLabel()
}

/**
 * Resets to defaults.
 */
function resetToDefaults(): void {
  checkpointCmsDraftRecovery()
  const previousGovernance = settings.value.governance
  const nextGovernance = canApplyWhiteLabelWorkflowAction(previousGovernance, 'reset_defaults', governanceActor.role)
    ? applyWhiteLabelWorkflowAction(previousGovernance, 'reset_defaults', governanceActor, {
      summary: cmsUiText.value.defaultsRestoredSummary,
      metadata: {
        source: 'toolbar',
      },
    })
    : previousGovernance

  settings.value = resetCmsWhiteLabelSettings()
  settings.value.governance = nextGovernance
  const resolvedThemePresets = getCurrentThemePresets()
  selectedThemePreset.value = resolveCmsSelectedThemePresetId(settings.value, resolvedThemePresets, defaultTheme)
  settings.value.themePresetId = selectedThemePreset.value
  activeMenuId.value = settings.value.items[0]?.id ?? defaultMenuId
  searchQuery.value = ''
  activeSettingsTab.value = 'branding'
  applyCmsFavicon(settings.value.branding.faviconUrl)
  savedAtLabel.value = cmsUiText.value.defaultsRestoredLabel
}
</script>

<style src="../src/templates/styles/cms-authoring-reference.css"></style>