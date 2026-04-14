import { computed, type ComputedRef, type Ref } from 'vue'
import { resolveCmsLocale } from '../i18n'

export interface CmsUiText {
  autoSaveEnabled: string
  autoSaveSaving: string
  autoSaveSaved: string
  autoSaveRecoveryAvailable: string
  autoSaveError: string
  autoSaveRestoreLabel: string
  autoSaveDiscardLabel: string
  autoSaveDiscardedLabel: string
  autoSaveRestoredLabel: string
  autoSaveLatestLabel: string
  autoSaveCandidateLabel: string
  savedAtPrefix: string
  tenantProfileTitle: string
  tenantProfileFieldLabel: string
  tenantProfileSelectorAriaLabel: string
  tenantCreateLabel: string
  tenantCreateAriaLabel: string
  tenantDeleteLabel: string
  tenantDeleteAriaLabel: string
  actionsTitle: string
  saveLabel: string
  saveAriaLabel: string
  resetLabel: string
  resetAriaLabel: string
  exportLabel: string
  exportAriaLabel: string
  importLabel: string
  importAriaLabel: string
  importInputAriaLabel: string
  settingsTabsAriaLabel: string
  showAdvancedOverridesLabel: string
  themeValuesPresetTitle: string
  themeValuesPresetDescription: string
  themePresetFieldLabel: string
  detectFromCurrentValuesLabel: string
  pagesBuilderTitle: string
  addPageLabel: string
  blocksManagerTitle: string
  mediaSettingsTitle: string
  releaseOrchestrationTitle: string
  releaseTimelineTitle: string
  releaseCalendarTitle: string
  noReleasesYetMessage: string
  noScheduledReleasesMessage: string
  noCalendarConflictsMessage: string
  pageStatusDraftLabel: string
  pageStatusPublishedLabel: string
  themePresetAppliedSuffix: string
  localePresetAppliedLabel: string
  tenantLoadedSuffix: string
  tenantCreatedSuffix: string
  tenantRemovedSuffix: string
  tenantExportedSuffix: string
  tenantImportedWithVersionLabel: (name: string, version: string | number) => string
  tenantDeleteConfirmLabel: (name: string) => string
  tenantReplaceConfirmLabel: (id: string) => string
  environmentDevelopmentLabel: string
  environmentStagingLabel: string
  environmentProductionLabel: string
  releaseCountLabel: (count: number) => string
  releaseCommandFailedLabel: string
  releaseDraftSummaryPrefix: string
  releaseDraftCreatedLabel: string
  releaseValidatedLabel: string
  releaseScheduledLabel: string
  releasePublishedLabel: string
  releaseRolledBackLabel: string
  releasePromotedLabel: string
  selectReleaseFirstLabel: string
  defineScheduleBeforeSchedulingLabel: string
  selectSourceReleaseFirstLabel: string
  selectRollbackTargetReleaseLabel: string
  selectPromotionTargetEnvironmentLabel: string
  noScheduledReleasesPublishedLabel: string
  scheduledReleasesPublishedLabel: (count: number) => string
  releaseNotSetLabel: string
  releaseInvalidDateLabel: string
  invalidJsonForFieldLabel: (fieldLabel: string) => string
  blockPropsMustBeObjectLabel: string
  invalidBlockPropsJsonLabel: string
  blockPropsUpdatedAtLabel: string
  importFailedInvalidJsonLabel: string
  defaultsRestoredLabel: string
  settingsSavedManuallySummary: string
  defaultsRestoredSummary: string
}

const CMS_UI_TEXT_PT_BR: CmsUiText = {
  autoSaveEnabled: 'Auto-save ativado',
  autoSaveSaving: 'Auto-save salvando',
  autoSaveSaved: 'Auto-save salvo',
  autoSaveRecoveryAvailable: 'Recuperação disponível',
  autoSaveError: 'Erro no auto-save',
  autoSaveRestoreLabel: 'Restaurar auto-save',
  autoSaveDiscardLabel: 'Descartar auto-save',
  autoSaveDiscardedLabel: 'Auto-save descartado',
  autoSaveRestoredLabel: 'Auto-save restaurado',
  autoSaveLatestLabel: 'Último auto-save',
  autoSaveCandidateLabel: 'Snapshot para restauração',
  savedAtPrefix: 'Salvo às',
  tenantProfileTitle: 'Perfil do tenant',
  tenantProfileFieldLabel: 'Perfil do tenant',
  tenantProfileSelectorAriaLabel: 'Seletor de perfil do tenant',
  tenantCreateLabel: 'Novo',
  tenantCreateAriaLabel: 'Criar perfil do tenant',
  tenantDeleteLabel: 'Excluir',
  tenantDeleteAriaLabel: 'Excluir perfil ativo do tenant',
  actionsTitle: 'Ações',
  saveLabel: 'Salvar',
  saveAriaLabel: 'Salvar configurações do tenant',
  resetLabel: 'Resetar',
  resetAriaLabel: 'Resetar configurações do tenant para o padrão',
  exportLabel: 'Exportar',
  exportAriaLabel: 'Exportar tenant ativo em JSON',
  importLabel: 'Importar',
  importAriaLabel: 'Importar configurações do tenant de JSON',
  importInputAriaLabel: 'Importar arquivo JSON do tenant',
  settingsTabsAriaLabel: 'Seções de configuração do CMS',
  showAdvancedOverridesLabel: 'Mostrar overrides avançados',
  themeValuesPresetTitle: 'Preset de valores de tema',
  themeValuesPresetDescription: 'Aplique um conjunto completo de tema antes de ajustar tokens finos.',
  themePresetFieldLabel: 'Preset de tema',
  detectFromCurrentValuesLabel: 'Detectar a partir dos valores atuais',
  pagesBuilderTitle: 'Construtor de páginas',
  addPageLabel: 'Adicionar página',
  blocksManagerTitle: 'Gerenciador de blocos',
  mediaSettingsTitle: 'Configurações de mídia',
  releaseOrchestrationTitle: 'Orquestração de releases',
  releaseTimelineTitle: 'Timeline de releases',
  releaseCalendarTitle: 'Calendário de releases',
  noReleasesYetMessage: 'Nenhum release ainda. Crie o primeiro rascunho a partir do snapshot atual do tenant.',
  noScheduledReleasesMessage: 'Nenhum release agendado para este ambiente.',
  noCalendarConflictsMessage: 'Nenhum conflito de calendário detectado.',
  pageStatusDraftLabel: 'Rascunho',
  pageStatusPublishedLabel: 'Publicado',
  themePresetAppliedSuffix: 'preset aplicado',
  localePresetAppliedLabel: 'Preset de idioma aplicado',
  tenantLoadedSuffix: 'carregado',
  tenantCreatedSuffix: 'criado',
  tenantRemovedSuffix: 'removido',
  tenantExportedSuffix: 'exportado',
  tenantImportedWithVersionLabel: (name: string, version: string | number) => `${name} importado (v${version})`,
  tenantDeleteConfirmLabel: (name: string) => `Excluir perfil do tenant "${name}"?`,
  tenantReplaceConfirmLabel: (id: string) => `Substituir tenant existente "${id}"?`,
  environmentDevelopmentLabel: 'Desenvolvimento',
  environmentStagingLabel: 'Homologação',
  environmentProductionLabel: 'Produção',
  releaseCountLabel: (count: number) => `${count} releases`,
  releaseCommandFailedLabel: 'Falha no comando de release',
  releaseDraftSummaryPrefix: 'Snapshot de',
  releaseDraftCreatedLabel: 'Rascunho de release criado',
  releaseValidatedLabel: 'Release validado',
  releaseScheduledLabel: 'Release agendado',
  releasePublishedLabel: 'Release publicado',
  releaseRolledBackLabel: 'Release revertido',
  releasePromotedLabel: 'Release promovido',
  selectReleaseFirstLabel: 'Selecione um release primeiro',
  defineScheduleBeforeSchedulingLabel: 'Defina uma data de agendamento antes de agendar',
  selectSourceReleaseFirstLabel: 'Selecione primeiro o release de origem',
  selectRollbackTargetReleaseLabel: 'Selecione o release alvo para rollback',
  selectPromotionTargetEnvironmentLabel: 'Selecione o ambiente alvo para promoção',
  noScheduledReleasesPublishedLabel: 'Nenhum release agendado publicado',
  scheduledReleasesPublishedLabel: (count: number) => `${count} release(s) agendado(s) publicado(s)`,
  releaseNotSetLabel: 'Não definido',
  releaseInvalidDateLabel: 'Data inválida',
  invalidJsonForFieldLabel: (fieldLabel: string) => `JSON inválido para o campo: ${fieldLabel}`,
  blockPropsMustBeObjectLabel: 'As propriedades do bloco devem ser um objeto JSON',
  invalidBlockPropsJsonLabel: 'JSON inválido para propriedades do bloco selecionado',
  blockPropsUpdatedAtLabel: 'Propriedades do bloco atualizadas às',
  importFailedInvalidJsonLabel: 'Falha na importação: payload JSON inválido',
  defaultsRestoredLabel: 'Padrões restaurados',
  settingsSavedManuallySummary: 'Configurações salvas manualmente',
  defaultsRestoredSummary: 'Padrões restaurados',
}

const CMS_UI_TEXT_EN: CmsUiText = {
  autoSaveEnabled: 'Auto-save enabled',
  autoSaveSaving: 'Auto-save saving',
  autoSaveSaved: 'Auto-save saved',
  autoSaveRecoveryAvailable: 'Recovery available',
  autoSaveError: 'Auto-save error',
  autoSaveRestoreLabel: 'Restore auto-save',
  autoSaveDiscardLabel: 'Discard auto-save',
  autoSaveDiscardedLabel: 'Auto-save discarded',
  autoSaveRestoredLabel: 'Auto-save restored',
  autoSaveLatestLabel: 'Latest auto-save',
  autoSaveCandidateLabel: 'Recovery snapshot',
  savedAtPrefix: 'Saved at',
  tenantProfileTitle: 'Tenant Profile',
  tenantProfileFieldLabel: 'Tenant profile',
  tenantProfileSelectorAriaLabel: 'Tenant profile selector',
  tenantCreateLabel: 'New',
  tenantCreateAriaLabel: 'Create tenant profile',
  tenantDeleteLabel: 'Delete',
  tenantDeleteAriaLabel: 'Delete active tenant profile',
  actionsTitle: 'Actions',
  saveLabel: 'Save',
  saveAriaLabel: 'Save tenant settings',
  resetLabel: 'Reset',
  resetAriaLabel: 'Reset tenant settings to defaults',
  exportLabel: 'Export',
  exportAriaLabel: 'Export active tenant as JSON',
  importLabel: 'Import',
  importAriaLabel: 'Import tenant settings from JSON',
  importInputAriaLabel: 'Import tenant JSON file',
  settingsTabsAriaLabel: 'CMS settings sections',
  showAdvancedOverridesLabel: 'Show advanced overrides',
  themeValuesPresetTitle: 'Theme values preset',
  themeValuesPresetDescription: 'Apply a complete set of theme values before fine tuning token fields.',
  themePresetFieldLabel: 'Theme preset',
  detectFromCurrentValuesLabel: 'Detect from current values',
  pagesBuilderTitle: 'Pages builder',
  addPageLabel: 'Add page',
  blocksManagerTitle: 'Blocks manager',
  mediaSettingsTitle: 'Media settings',
  releaseOrchestrationTitle: 'Release orchestration',
  releaseTimelineTitle: 'Release timeline',
  releaseCalendarTitle: 'Release calendar',
  noReleasesYetMessage: 'No releases yet. Create your first draft from the current tenant snapshot.',
  noScheduledReleasesMessage: 'No scheduled releases for this environment.',
  noCalendarConflictsMessage: 'No calendar conflicts detected.',
  pageStatusDraftLabel: 'Draft',
  pageStatusPublishedLabel: 'Published',
  themePresetAppliedSuffix: 'preset applied',
  localePresetAppliedLabel: 'Locale preset applied',
  tenantLoadedSuffix: 'loaded',
  tenantCreatedSuffix: 'created',
  tenantRemovedSuffix: 'removed',
  tenantExportedSuffix: 'exported',
  tenantImportedWithVersionLabel: (name: string, version: string | number) => `${name} imported (v${version})`,
  tenantDeleteConfirmLabel: (name: string) => `Delete tenant profile "${name}"?`,
  tenantReplaceConfirmLabel: (id: string) => `Replace existing tenant "${id}"?`,
  environmentDevelopmentLabel: 'Development',
  environmentStagingLabel: 'Staging',
  environmentProductionLabel: 'Production',
  releaseCountLabel: (count: number) => `${count} releases`,
  releaseCommandFailedLabel: 'Release command failed',
  releaseDraftSummaryPrefix: 'Snapshot from',
  releaseDraftCreatedLabel: 'Release draft created',
  releaseValidatedLabel: 'Release validated',
  releaseScheduledLabel: 'Release scheduled',
  releasePublishedLabel: 'Release published',
  releaseRolledBackLabel: 'Release rolled back',
  releasePromotedLabel: 'Release promoted',
  selectReleaseFirstLabel: 'Select a release first',
  defineScheduleBeforeSchedulingLabel: 'Define a schedule date before scheduling',
  selectSourceReleaseFirstLabel: 'Select the source release first',
  selectRollbackTargetReleaseLabel: 'Select rollback target release',
  selectPromotionTargetEnvironmentLabel: 'Select promotion target environment',
  noScheduledReleasesPublishedLabel: 'No scheduled releases published',
  scheduledReleasesPublishedLabel: (count: number) => `${count} scheduled release(s) published`,
  releaseNotSetLabel: 'Not set',
  releaseInvalidDateLabel: 'Invalid date',
  invalidJsonForFieldLabel: (fieldLabel: string) => `Invalid JSON for field: ${fieldLabel}`,
  blockPropsMustBeObjectLabel: 'Block props must be a JSON object',
  invalidBlockPropsJsonLabel: 'Invalid JSON for selected block props',
  blockPropsUpdatedAtLabel: 'Block props updated at',
  importFailedInvalidJsonLabel: 'Import failed: invalid JSON payload',
  defaultsRestoredLabel: 'Defaults restored',
  settingsSavedManuallySummary: 'Settings saved manually',
  defaultsRestoredSummary: 'Defaults restored',
}

export function useCmsUiText(locale: Ref<string> | ComputedRef<string>) {
  const isPtBrLocale = computed(() => resolveCmsLocale(locale.value) === 'pt-BR')
  const cmsUiText = computed<CmsUiText>(() => (isPtBrLocale.value ? CMS_UI_TEXT_PT_BR : CMS_UI_TEXT_EN))
  const tr = (en: string, ptBr: string): string => (isPtBrLocale.value ? ptBr : en)

  return {
    cmsUiText,
    isPtBrLocale,
    tr,
  }
}