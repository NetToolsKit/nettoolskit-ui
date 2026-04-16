<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="cms-settings">
    <CmsWorkspaceTabs
      :model-value="cmsSettingsWorkspaceTabValue"
      :ariaLabel="tr('Settings workspace tabs', 'Abas do workspace de configurações')"
      :tabs="cmsWorkspaceTabOptions"
      @update:model-value="emit('update:cmsSettingsWorkspaceTabValue', String($event ?? ''))"
    />
    <CmsAuthoringWorkbench
      v-show="cmsSettingsWorkspaceView === 'editor' && !cmsDesignerPreviewMode"
      class="cms-designer-card--settings"
      :page-aria-label="tr('Settings workbench', 'Workbench de configurações')"
      :canvas-aria-label="tr('Settings authoring workspace', 'Workspace de autoria de configurações')"
      :status-bar-aria-label="tr('Settings status bar', 'Barra de status de configurações')"
    >
      <template #header>
        <CmsAuthoringToolbar :info-items="cmsSettingsToolbarInfoItems">
          <template #actions>
            <q-btn flat dense no-caps icon="folder_open" class="cms-designer-card__toolbar-action" :label="tr('Open', 'Abrir')" :aria-label="tr('Open settings workspace', 'Abrir workspace de configurações')" @click="scrollCmsDesignerSurface('.cms-designer-card--settings .cms-designer-card__workbench')" />
            <q-btn flat dense no-caps icon="note_add" class="cms-designer-card__toolbar-action" :label="tr('New', 'Novo')" :aria-label="cmsUiText.tenantCreateAriaLabel" @click="createTenantProfileFromPrompt()" />
            <q-btn flat dense no-caps icon="save" class="cms-designer-card__toolbar-action" :label="cmsUiText.saveLabel" :aria-label="cmsUiText.saveAriaLabel" @click="saveNow()" />
            <q-btn flat dense no-caps icon="undo" class="cms-designer-card__toolbar-action" :label="tr('Undo', 'Desfazer')" :disable="!canUndoCmsAuthoringHistory" :aria-label="tr('Undo', 'Desfazer')" @click="undoCmsAuthoringChange()" />
            <q-btn flat dense no-caps icon="redo" class="cms-designer-card__toolbar-action" :label="tr('Redo', 'Refazer')" :disable="!canRedoCmsAuthoringHistory" :aria-label="tr('Redo', 'Refazer')" @click="redoCmsAuthoringChange()" />
            <q-btn flat dense no-caps icon="download" class="cms-designer-card__toolbar-action" :label="cmsUiText.exportLabel" :aria-label="cmsUiText.exportAriaLabel" @click="exportActiveTenantProfile()" />
            <q-btn flat dense no-caps icon="upload_file" class="cms-designer-card__toolbar-action" :label="cmsUiText.importLabel" :aria-label="cmsUiText.importAriaLabel" @click="openTenantImportDialog()" />
          </template>
          <template #trailing>
            <q-btn no-caps unelevated icon="visibility" :label="tr('Preview', 'Preview')" :style="primaryActionStyle" @click="showCmsDesignerPreview('settings')" />
          </template>
        </CmsAuthoringToolbar>
      </template>
      <template #ruler>
        <CmsAuthoringRulerBar
          :marks="cmsDesignerRulerMarks"
          :focus-aria-label="tr('Focus workbench', 'Focar workbench')"
          :mode-label="showCmsDesignerStageGrid ? tr('Grid', 'Grade') : tr('Plain', 'Livre')"
          @focus="scrollCmsDesignerSurface('.cms-designer-card--settings .cms-designer-card__workbench')"
          @toggle-mode="toggleCmsDesignerStageGrid()"
        />
      </template>
      <template #workbench>
        <div class="cms-designer-card__workbench cms-designer-card__workbench--settings">
          <aside class="cms-designer-card__sidebar cms-settings__sidebar">
            <CmsAuthoringPanelHeader
              :title="tr('Workbench', 'Workbench')"
              :description="tr('White-label surfaces and CMS authoring contracts in one editing shell.', 'Superfícies white-label e contratos de autoria CMS em um único shell de edição.')"
            />
            <div class="cms-designer-card__nav-list">
              <button
                v-for="tab in cmsSettingsWorkbenchTabs"
                :key="`settings-nav-${tab.id}`"
                type="button"
                class="cms-designer-card__nav-button"
                :class="{ 'cms-designer-card__nav-button--active': activeSettingsTab === tab.id }"
                @click="emit('update:activeSettingsTab', tab.id)"
              >
                <q-icon :name="tab.icon" class="cms-icon cms-icon--sm" />
                <span>{{ tab.label }}</span>
              </button>
            </div>
          </aside>
          <div class="cms-designer-card__stage cms-settings__stage" :class="{ 'cms-designer-card__stage--plain': !showCmsDesignerStageGrid }">
            <!-- ── Admin Card ───────────────────────────────────────── -->
            <div class="cms-settings__admin">
              <!-- ── Tenant Card ──────────────────────────────────────── -->
              <div class="cms-toolbar-card">
                <div class="cms-toolbar-card__header">
                  <q-icon name="business" size="18px" class="cms-toolbar-card__icon" />
                  <span class="cms-toolbar-card__title">{{ cmsUiText.tenantProfileTitle }}</span>
                </div>
                <div class="cms-toolbar-card__body">
                  <q-select
                    :model-value="activeTenantProfileId"
                    outlined
                    dense
                    emit-value
                    map-options
                    popup-content-class="cms-settings-module-surface__popup"
                    :options="tenantProfileOptions"
                    :label="cmsUiText.tenantProfileFieldLabel"
                    :aria-label="cmsUiText.tenantProfileSelectorAriaLabel"
                    class="cms-toolbar-card__select"
                    @update:model-value="onTenantProfileChange($event)"
                  />
                  <div class="cms-toolbar-card__actions">
                    <q-btn flat dense no-caps icon="add" :label="cmsUiText.tenantCreateLabel" :aria-label="cmsUiText.tenantCreateAriaLabel" @click="createTenantProfileFromPrompt()" />
                    <q-btn
                      flat
                      dense
                      no-caps
                      icon="delete"
                      :label="cmsUiText.tenantDeleteLabel"
                      :aria-label="cmsUiText.tenantDeleteAriaLabel"
                      :disable="tenantProfilesState.profiles.length <= 1"
                      :style="dangerActionStyle"
                      @click="removeActiveTenantProfile()"
                    />
                  </div>
                </div>
              </div>

              <!-- ── Actions Card ─────────────────────────────────────── -->
              <div class="cms-toolbar-card">
                <div class="cms-toolbar-card__header">
                  <q-icon name="tune" size="18px" class="cms-toolbar-card__icon" />
                  <span class="cms-toolbar-card__title">{{ cmsUiText.actionsTitle }}</span>
                  <span class="cms-toolbar-card__saved-at" role="status" aria-live="polite" aria-atomic="true">{{ savedAtLabel }}</span>
                </div>
                <div class="cms-toolbar-card__body">
                  <div class="cms-toolbar-card__actions">
                    <q-btn flat no-caps icon="restart_alt" :label="cmsUiText.resetLabel" :aria-label="cmsUiText.resetAriaLabel" :style="dangerActionStyle" @click="resetToDefaults()" />
                  </div>
                  <div class="cms-toolbar-card__domain-transfer">
                    <q-select
                      :model-value="selectedDomainTransfer"
                      outlined
                      dense
                      emit-value
                      map-options
                      popup-content-class="cms-settings-module-surface__popup"
                      :options="cmsDomainTransferOptions"
                      :label="tr('Domain package', 'Pacote de dominio')"
                      :aria-label="tr('Domain package selector', 'Seletor de pacote de dominio')"
                      class="cms-toolbar-card__domain-select"
                      @update:model-value="emit('update:selectedDomainTransfer', String($event ?? ''))"
                    />
                    <div class="cms-toolbar-card__actions">
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="file_download"
                        :label="tr('Export package', 'Exportar pacote')"
                        :aria-label="tr('Export selected domain package', 'Exportar pacote do dominio selecionado')"
                        @click="exportSelectedDomainSnapshot()"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="file_upload"
                        :label="tr('Import package', 'Importar pacote')"
                        :aria-label="tr('Import selected domain package', 'Importar pacote do dominio selecionado')"
                        @click="openDomainImportDialog()"
                      />
                    </div>
                  </div>
                  <div class="cms-toolbar-card__autosave">
                    <q-chip dense square :style="cmsAutosaveStatusStyle">
                      {{ cmsAutosaveStatusLabel }}
                    </q-chip>
                    <span v-if="latestDraftRecoverySavedAt" class="cms-toolbar-card__autosave-meta">
                      {{ cmsUiText.autoSaveLatestLabel }}: {{ latestDraftRecoverySavedAt }}
                    </span>
                    <span v-if="recoveryCandidateSavedAt" class="cms-toolbar-card__autosave-meta">
                      {{ cmsUiText.autoSaveCandidateLabel }}: {{ recoveryCandidateSavedAt }}
                    </span>
                    <div class="cms-toolbar-card__actions">
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="restore"
                        :label="cmsUiText.autoSaveRestoreLabel"
                        :disable="!canRestoreDraftRecovery"
                        @click="restoreCmsDraftRecovery()"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="delete_sweep"
                        :label="cmsUiText.autoSaveDiscardLabel"
                        :disable="!hasDraftRecoveryEntry"
                        @click="discardCmsDraftRecovery()"
                      />
                    </div>
                  </div>
                  <p class="cms-config-caption cms-toolbar-card__hint">
                    {{
                      tr(
                        'Primary actions stay in the top editor bar so the workspace keeps one clear command row.',
                        'As ações primárias ficam na barra superior para o workspace manter uma linha clara de comando.'
                      )
                    }}
                  </p>
                </div>
              </div>
              <input
                ref="tenantImportInputRef"
                type="file"
                accept="application/json,.json"
                :aria-label="cmsUiText.importInputAriaLabel"
                class="cms-file-input"
                @change="onTenantFileChange"
              >
              <input
                ref="domainImportInputRef"
                type="file"
                accept="application/json,.json"
                :aria-label="tr('Import domain JSON file', 'Importar arquivo JSON do dominio')"
                class="cms-file-input"
                @change="onDomainFileChange"
              >
              <input
                ref="schemaImportInputRef"
                type="file"
                accept="application/json,.json"
                :aria-label="tr('Import schema JSON file', 'Importar arquivo JSON do schema')"
                class="cms-file-input"
                @change="onSchemaFileChange"
              >
            </div>

            <!-- ── Editor Card ──────────────────────────────────────── -->
            <div class="cms-settings__editor">
              <q-tabs v-model="activeSettingsTabModel" dense inline-label class="cms-settings__tabs" :aria-label="cmsUiText.settingsTabsAriaLabel">
                <q-tab name="branding" icon="branding_watermark" :label="settings.content.tabBrandingLabel" :aria-label="settings.content.tabBrandingLabel" />
                <q-tab name="typography" icon="text_fields" :label="settings.content.tabTypographyLabel" :aria-label="settings.content.tabTypographyLabel" />
                <q-tab name="layout" icon="dashboard_customize" :label="settings.content.tabLayoutLabel" :aria-label="settings.content.tabLayoutLabel" />
                <q-tab name="colors" icon="palette" :label="settings.content.tabColorsLabel" :aria-label="settings.content.tabColorsLabel" />
                <q-tab name="menu" icon="menu" :label="settings.content.tabMenuLabel" :aria-label="settings.content.tabMenuLabel" />
                <q-tab name="topbar" icon="web_asset" :label="settings.content.tabTopbarLabel" :aria-label="settings.content.tabTopbarLabel" />
                <q-tab name="content" icon="edit_note" :label="settings.content.tabContentLabel" :aria-label="settings.content.tabContentLabel" />
              </q-tabs>
              <div class="cms-settings__advanced-toggle">
                <q-toggle :model-value="showAdvancedThemeFields" dense :label="cmsUiText.showAdvancedOverridesLabel" @update:model-value="emit('update:showAdvancedThemeFields', Boolean($event))" />
              </div>

              <q-tab-panels :model-value="activeSettingsTab" animated class="cms-settings__panels">
                <q-tab-panel name="branding">
                  <div class="cms-config-section">
                    <div class="cms-config-section__form">
                      <div class="cms-form-grid">
                        <q-input v-model="settings.branding.appName" outlined dense :label="tr('Product name', 'Nome do produto')" />
                        <q-input v-model="settings.branding.appSubtitle" outlined dense :label="tr('Product subtitle', 'Subtítulo do produto')" />
                        <q-input v-model="settings.branding.brandLogo" outlined dense :label="tr('Logo URL', 'URL do logo')" />
                        <q-input v-model="settings.branding.brandLogoAlt" outlined dense :label="tr('Logo alt text', 'Texto alternativo do logo')" />
                        <q-input v-model="settings.branding.faviconUrl" outlined dense :label="tr('Favicon URL', 'URL do favicon')" />
                        <q-input v-model="settings.branding.userAvatar" outlined dense :label="tr('User avatar URL', 'URL do avatar do usuario')" />
                        <q-input v-model="settings.branding.userTooltip" outlined dense :label="tr('User tooltip', 'Tooltip do usuario')" />
                        <q-input v-model="settings.branding.notificationsTooltip" outlined dense :label="tr('Notifications tooltip', 'Tooltip de notificações')" />
                        <q-input v-model.number="settings.branding.notificationCount" outlined dense type="number" min="0" :label="tr('Notification count', 'Quantidade de notificações')" />
                      </div>

                      <q-banner rounded class="cms-banner" :style="bannerStyle">
                        {{ settings.content.brandingBannerText }}
                      </q-banner>
                    </div>

                    <div class="cms-config-section__example">
                      <div class="cms-example-section cms-example-section--inline">
                        <div class="cms-example-section__header">
                          <strong>{{ tr('Branding example', 'Exemplo de branding') }}</strong>
                          <small>{{ tr('Live preview of logo, product identity and account information.', 'Preview em tempo real do logo, identidade do produto e conta.') }}</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--branding">
                          <div class="cms-preview-brand">
                            <img :src="settings.branding.brandLogo" :alt="settings.branding.brandLogoAlt" class="cms-preview-brand__logo">
                            <div class="cms-preview-brand__copy">
                              <strong>{{ settings.branding.appName }}</strong>
                              <small>{{ settings.branding.appSubtitle }}</small>
                            </div>
                          </div>
                          <div class="cms-preview-brand__meta">
                            <div class="cms-preview-brand__meta-row">
                              <span>{{ tr('Favicon', 'Favicon') }}</span>
                              <code>{{ settings.branding.faviconUrl || settings.branding.brandLogo }}</code>
                            </div>
                            <div class="cms-preview-brand__meta-row">
                              <span>{{ tr('User', 'Usuario') }}</span>
                              <div class="cms-preview-user">
                                <img v-if="settings.branding.userAvatar" :src="settings.branding.userAvatar" alt="User avatar">
                                <q-icon v-else name="account_circle" class="cms-icon cms-icon--avatar" />
                                <small>{{ settings.branding.userTooltip }}</small>
                              </div>
                            </div>
                            <q-chip dense square icon="notifications" :style="statusChipStyle" :aria-label="settings.branding.notificationsTooltip">
                              <q-tooltip v-if="settings.branding.notificationsTooltip" class="cms-settings-module-surface__tooltip">{{ settings.branding.notificationsTooltip }}</q-tooltip>
                              {{ settings.branding.notificationCount }}
                            </q-chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </q-tab-panel>

                <q-tab-panel name="typography">
                  <div class="cms-color-groups">
                    <div v-for="group in typographyFieldGroups" :key="group.id" class="cms-color-group cms-config-section">
                      <div class="cms-config-section__form">
                        <div class="cms-section-header cms-section-header--stacked">
                          <strong>{{ group.label }}</strong>
                          <small>{{ group.description }}</small>
                        </div>
                        <div class="cms-color-grid">
                          <div v-for="field in group.fields" :key="field.key" class="cms-color-field">
                            <label>{{ field.label }}</label>
                            <div class="cms-color-field__controls">
                              <input
                                v-if="field.isColor"
                                :value="getThemeFieldPickerValue(field)"
                                type="color"
                                :aria-label="`${field.label} picker`"
                                class="cms-color-field__picker"
                                @input="onThemeColorInput(field, $event)"
                              >
                              <q-input
                                :model-value="getThemeFieldValue(field)"
                                outlined
                                dense
                                :placeholder="field.placeholder"
                                @update:model-value="onThemeFieldInput(field, $event)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="cms-config-section__example">
                        <div class="cms-example-section cms-example-section--inline">
                          <div class="cms-example-section__header">
                            <strong>{{ tr('Typography example', 'Exemplo de tipografia') }}</strong>
                            <small>{{ tr('Families, weights, styles and shell text scales.', 'Familias, pesos, estilos e escalas de texto do shell.') }}</small>
                          </div>
                          <div class="cms-preview-card cms-preview-card--typography">
                            <div class="cms-preview-typography__headline">{{ settings.branding.appName }}</div>
                            <div class="cms-preview-typography__title">{{ tr('Shell heading and context text', 'Título do shell e texto de contexto') }}</div>
                            <p class="cms-preview-typography__body">
                              This paragraph uses base family/style. Adjust fonts and sizes to match each tenant brand.
                            </p>
                            <div class="cms-preview-typography__menu">
                              <div class="cms-preview-typography__menu-label">{{ tr('Menu label', 'Label do menu') }}</div>
                              <div class="cms-preview-typography__menu-caption">{{ tr('Caption for module context', 'Legenda para contexto do modulo') }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="layout">
                  <div class="cms-color-groups">
                    <div v-for="group in layoutFieldGroups" :key="group.id" class="cms-color-group cms-config-section">
                      <div class="cms-config-section__form">
                        <div class="cms-section-header cms-section-header--stacked">
                          <strong>{{ group.label }}</strong>
                          <small>{{ group.description }}</small>
                        </div>
                        <div class="cms-color-grid">
                          <div v-for="field in group.fields" :key="field.key" class="cms-color-field">
                            <label>{{ field.label }}</label>
                            <div class="cms-color-field__controls">
                              <input
                                v-if="field.isColor"
                                :value="getThemeFieldPickerValue(field)"
                                type="color"
                                :aria-label="`${field.label} picker`"
                                class="cms-color-field__picker"
                                @input="onThemeColorInput(field, $event)"
                              >
                              <q-input
                                :model-value="getThemeFieldValue(field)"
                                outlined
                                dense
                                :placeholder="field.placeholder"
                                @update:model-value="onThemeFieldInput(field, $event)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="cms-config-section__example">
                        <div class="cms-example-section cms-example-section--inline">
                          <div class="cms-example-section__header">
                            <strong>{{ tr('Layout and motion example', 'Exemplo de layout e movimento') }}</strong>
                            <small>{{ tr('Spacing, radius and transition tokens on shell widgets.', 'Tokens de espaço, borda e transição em widgets do shell.') }}</small>
                          </div>
                          <div class="cms-preview-card cms-preview-card--layout">
                            <div class="cms-preview-layout__row">
                              <div class="cms-preview-layout__panel">{{ tr('Panel A', 'Painel A') }}</div>
                              <div class="cms-preview-layout__panel cms-preview-layout__panel--accent">{{ tr('Panel B', 'Painel B') }}</div>
                            </div>
                            <div class="cms-preview-layout__nav-item">
                              <q-icon name="tune" class="cms-icon cms-icon--sm" />
                              <span>{{ tr('Hover-ready item spacing', 'Espacamento de item para hover') }}</span>
                            </div>
                            <small class="cms-preview-layout__hint">{{ tr('Move mouse over cards/items to validate transition token.', 'Passe o mouse sobre os cards/itens para validar o token de transição.') }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="colors">
                  <div class="cms-theme-presets cms-config-section">
                    <div class="cms-config-section__form">
                      <div class="cms-section-header cms-section-header--stacked">
                        <strong>{{ cmsUiText.themeValuesPresetTitle }}</strong>
                        <small>{{ cmsUiText.themeValuesPresetDescription }}</small>
                      </div>

                      <div class="cms-theme-presets__controls">
                        <q-select
                          :model-value="selectedThemePreset"
                          outlined
                          dense
                          emit-value
                          map-options
                          popup-content-class="cms-settings-module-surface__popup"
                          :options="themePresetOptions"
                          :label="cmsUiText.themePresetFieldLabel"
                          @update:model-value="onThemePresetChange($event)"
                        />
                        <q-btn flat dense no-caps icon="sync" :label="cmsUiText.detectFromCurrentValuesLabel" @click="detectThemePresetFromCurrent()" />
                      </div>
                    </div>

                    <div class="cms-config-section__example">
                      <div class="cms-example-section cms-example-section--inline">
                        <div class="cms-example-section__header">
                          <strong>{{ activeThemePresetLabel }}</strong>
                          <small>{{ activeThemePresetDescription }}</small>
                        </div>

                        <div class="cms-preview-card cms-preview-card--theme-preset">
                          <div class="cms-theme-token">
                            <span class="cms-theme-token__dot" :style="{ background: accentColor }" />
                            <span>{{ tr('Accent', 'Acento') }}: <code>{{ settings.theme.itemActiveColor || defaultTheme.itemActiveColor }}</code></span>
                          </div>
                          <div class="cms-theme-token">
                            <span class="cms-theme-token__dot" :style="{ background: settings.theme.headerBackground || defaultTheme.headerBackground }" />
                            <span>{{ tr('Header', 'Cabecalho') }}: <code>{{ settings.theme.headerBackground || defaultTheme.headerBackground }}</code></span>
                          </div>
                          <div class="cms-theme-token">
                            <span class="cms-theme-token__dot" :style="{ background: settings.theme.drawerBackground || defaultTheme.drawerBackground }" />
                            <span>{{ tr('Surface', 'Superficie') }}: <code>{{ settings.theme.drawerBackground || defaultTheme.drawerBackground }}</code></span>
                          </div>
                          <div class="cms-theme-token">
                            <span class="cms-theme-token__dot" :style="{ background: settings.theme.pageBackground || defaultTheme.pageBackground }" />
                            <span>{{ tr('Page', 'Página') }}: <code>{{ settings.theme.pageBackground || defaultTheme.pageBackground }}</code></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="cms-color-groups">
                    <div v-for="group in colorFieldGroups" :key="group.id" class="cms-color-group cms-config-section">
                      <div class="cms-config-section__form">
                        <div class="cms-section-header cms-section-header--stacked">
                          <strong>{{ group.label }}</strong>
                          <small>{{ group.description }}</small>
                        </div>
                        <div class="cms-color-grid-sections">
                          <div v-for="section in group.sections" :key="section.id" class="cms-color-grid-section">
                            <div v-if="group.id === 'landing'" class="cms-color-grid-section__header">
                              <strong>{{ section.label }}</strong>
                              <small>{{ section.description }}</small>
                            </div>
                            <div class="cms-color-grid">
                              <div v-for="field in section.fields" :key="field.key" class="cms-color-field">
                                <label>{{ field.label }}</label>
                                <div class="cms-color-field__controls">
                                  <input
                                    v-if="field.isColor"
                                    :value="getThemeFieldPickerValue(field)"
                                    type="color"
                                    :aria-label="`${field.label} picker`"
                                    class="cms-color-field__picker"
                                    @input="onThemeColorInput(field, $event)"
                                  >
                                  <q-input
                                    :model-value="getThemeFieldValue(field)"
                                    outlined
                                    dense
                                    :placeholder="field.placeholder"
                                    @update:model-value="onThemeFieldInput(field, $event)"
                                  />
                                </div>
                              </div>
                            </div>

                            <div class="cms-config-section__example">
                              <div class="cms-example-section cms-example-section--inline">
                                <template v-if="group.id === 'foundation'">
                                  <div class="cms-example-section__header">
                                    <strong>{{ tr('Foundation example', 'Exemplo de fundamentos') }}</strong>
                                    <small>{{ tr('Surface, text and border tokens applied together.', 'Tokens de superficie, texto e borda aplicados em conjunto.') }}</small>
                                  </div>
                                  <div class="cms-preview-card cms-preview-card--foundation">
                                    <strong>{{ tr('Editable shell foundation', 'Base editavel do shell') }}</strong>
                                    <p>{{ tr('This card uses the same base tokens as the shell page and CMS cards.', 'Este card usa os mesmos tokens base da página shell e dos cards CMS.') }}</p>
                                    <q-chip dense square class="cms-preview-chip">{{ settings.content.statusChipLabel }}</q-chip>
                                  </div>
                                </template>

                                <template v-else-if="group.id === 'navigation'">
                                  <div class="cms-example-section__header">
                                    <strong>{{ tr('Navigation example', 'Exemplo de navegação') }}</strong>
                                    <small>{{ tr('Sidebar text, icon, caption and active states.', 'Texto, ícone, legenda e estados ativos da barra lateral.') }}</small>
                                  </div>
                                  <div class="cms-preview-card cms-preview-card--navigation">
                                    <div class="cms-preview-nav-caption">{{ tr('Core', 'Core') }}</div>
                                    <div class="cms-preview-nav-item">
                                      <q-icon name="dashboard" class="cms-icon cms-icon--sm cms-preview-nav-item__icon" />
                                      <span>{{ tr('Overview', 'Visao geral') }}</span>
                                    </div>
                                    <div class="cms-preview-nav-item cms-preview-nav-item--hover">
                                      <q-icon name="query_stats" class="cms-icon cms-icon--sm cms-preview-nav-item__icon" />
                                      <span>{{ tr('Analytics', 'Analises') }}</span>
                                    </div>
                                    <div class="cms-preview-nav-item cms-preview-nav-item--active">
                                      <q-icon name="settings" class="cms-icon cms-icon--sm cms-preview-nav-item__icon" />
                                      <span>{{ tr('Settings', 'Configurações') }}</span>
                                    </div>
                                    <div class="cms-preview-nav-mini-caption">CO</div>
                                  </div>
                                </template>

                                <template v-else-if="group.id === 'header'">
                                  <div class="cms-example-section__header">
                                    <strong>{{ tr('Header and search example', 'Exemplo de cabeçalho e busca') }}</strong>
                                    <small>{{ tr('Topbar title, search, icon colors and notification badge.', 'Título da topbar, busca, cores de ícones e badge de notificação.') }}</small>
                                  </div>
                                  <div class="cms-preview-card cms-preview-card--header">
                                    <div class="cms-preview-header">
                                      <div class="cms-preview-header__left">
                                        <q-icon :name="settings.layout.menuIcon" class="cms-icon cms-icon--md cms-preview-header__menu-icon" />
                                        <strong class="cms-preview-header__title-app">{{ settings.branding.appName }}</strong>
                                        <q-icon name="chevron_right" class="cms-icon cms-icon--sm cms-preview-header__separator" />
                                        <span class="cms-preview-header__title-text">{{ tr('Settings', 'Configurações') }}</span>
                                      </div>
                                      <div class="cms-preview-header__search">
                                        <q-icon name="search" class="cms-icon cms-icon--sm cms-preview-header__search-icon" />
                                        <span>{{ settings.layout.searchPlaceholder }}</span>
                                      </div>
                                      <div class="cms-preview-header__actions">
                                        <button v-if="settings.layout.showNotifications" type="button" class="cms-preview-header__action" :aria-label="tr('Notifications action preview', 'Preview da ação de notificações')">
                                          <q-icon name="notifications" class="cms-icon cms-icon--sm" />
                                          <span class="cms-preview-header__badge">{{ settings.branding.notificationCount || 2 }}</span>
                                        </button>
                                        <button v-if="settings.layout.showUserAvatar" type="button" class="cms-preview-header__action" :aria-label="tr('Account action preview', 'Preview da ação de conta')">
                                          <q-icon name="account_circle" class="cms-icon cms-icon--sm" />
                                        </button>
                                        <button type="button" class="cms-preview-header__action" :aria-label="tr('Home action preview', 'Preview da ação home')">
                                          <q-icon name="home" class="cms-icon cms-icon--sm" />
                                        </button>
                                      </div>
                                    </div>
                                    <div class="cms-preview-drawer">
                                      <div class="cms-preview-drawer__item">
                                        <q-icon name="dashboard" class="cms-icon cms-icon--sm" />
                                        <span>{{ tr('Drawer item', 'Item do menu lateral') }}</span>
                                      </div>
                                      <div class="cms-preview-drawer__footer">
                                        <q-icon name="keyboard_double_arrow_left" class="cms-icon cms-icon--xs" />
                                        <span>{{ settings.layout.collapseLabel }}</span>
                                      </div>
                                    </div>
                                  </div>
                                </template>

                                <template v-else-if="group.id === 'notifications'">
                                  <div class="cms-example-section__header">
                                    <strong>{{ tr('Notifications example', 'Exemplo de notificações') }}</strong>
                                    <small>{{ tr('Success, warning, error and info chips in real time.', 'Chips de sucesso, aviso, erro e info em tempo real.') }}</small>
                                  </div>
                                  <div class="cms-notification-preview">
                                    <q-chip dense square :style="notificationChipStyles.success">{{ settings.content.previewSuccessLabel }}</q-chip>
                                    <q-chip dense square :style="notificationChipStyles.warning">{{ settings.content.previewWarningLabel }}</q-chip>
                                    <q-chip dense square :style="notificationChipStyles.error">{{ settings.content.previewErrorLabel }}</q-chip>
                                    <q-chip dense square :style="notificationChipStyles.info">{{ settings.content.previewInfoLabel }}</q-chip>
                                  </div>
                                  <div class="cms-notification-bell-preview">
                                    <q-icon name="notifications" class="cms-icon cms-icon--md" :style="notificationBellPreviewStyle" />
                                    <q-chip dense square :style="notificationCounterPreviewStyle">2</q-chip>
                                  </div>
                                  <div class="cms-notification-actions-preview">
                                    <button type="button" class="cms-notification-actions-preview__action" :aria-label="tr('Account hover preview', 'Preview de hover da conta')">
                                      <q-icon name="account_circle" class="cms-icon cms-icon--sm" />
                                      <span>{{ tr('Account', 'Conta') }}</span>
                                    </button>
                                    <button type="button" class="cms-notification-actions-preview__action" :aria-label="tr('Landing hover preview', 'Preview de hover da landing')">
                                      <q-icon name="home" class="cms-icon cms-icon--sm" />
                                      <span>{{ tr('Landing', 'Landing') }}</span>
                                    </button>
                                    <button type="button" class="cms-notification-actions-preview__action cms-notification-actions-preview__action--forced-hover">
                                      <q-icon name="visibility" class="cms-icon cms-icon--sm" />
                                      <span>{{ tr('Hover sample', 'Exemplo de hover') }}</span>
                                    </button>
                                  </div>
                                </template>

                                <template v-else-if="group.id === 'landing'">
                                  <div class="cms-example-section__header">
                                    <strong>{{ tr('Landing palette example', 'Exemplo da paleta da landing') }}</strong>
                                    <small>{{ tr('Primary/secondary sections, dark shell and syntax colors used on public landing.', 'Seções primária/secundária, shell escuro e cores de sintaxe usadas na landing pública.') }}</small>
                                  </div>
                                  <div class="cms-preview-card cms-preview-card--landing">
                                    <div class="cms-preview-landing__swatches">
                                      <span
                                        class="cms-preview-landing__swatch"
                                        :style="{ background: resolveThemeTokenValue('landingSectionBgPrimary') }"
                                      >
                                        {{ tr('Section primary', 'Seção primária') }}
                                      </span>
                                      <span
                                        class="cms-preview-landing__swatch"
                                        :style="{ background: resolveThemeTokenValue('landingSectionBgSecondary') }"
                                      >
                                        {{ tr('Section secondary', 'Seção secundária') }}
                                      </span>
                                      <span
                                        class="cms-preview-landing__swatch cms-preview-landing__swatch--dark"
                                        :style="{ background: resolveThemeTokenValue('landingSectionBgDark'), color: resolveThemeTokenValue('landingSharedDarkText') }"
                                      >
                                        {{ tr('Section dark', 'Seção escura') }}
                                      </span>
                                    </div>
                                    <div
                                      class="cms-preview-landing__hero-title"
                                      :style="{
                                        background: `linear-gradient(110deg, ${resolveThemeTokenValue('landingHeroHighlight1')} 0%, ${resolveThemeTokenValue('landingHeroHighlight2')} 24%, ${resolveThemeTokenValue('landingHeroHighlight3')} 52%, ${resolveThemeTokenValue('landingHeroHighlight4')} 78%, ${resolveThemeTokenValue('landingHeroHighlight5')} 100%)`,
                                      }"
                                    >
                                      NetToolsKit
                                    </div>
                                    <div
                                      class="cms-preview-landing__theme-band"
                                      :style="{ background: `linear-gradient(135deg, ${resolveThemeTokenValue('landingThemeGradientStart')} 0%, ${resolveThemeTokenValue('landingThemeGradientEnd')} 100%)` }"
                                    />
                                    <div class="cms-preview-landing__code">
                                      <span :style="{ color: resolveThemeTokenValue('landingCodeKeyword') }">import</span>
                                      <span :style="{ color: resolveThemeTokenValue('landingCodeComponent') }">{ BaseInput }</span>
                                      <span :style="{ color: resolveThemeTokenValue('landingCodeComment') }">// demo</span>
                                    </div>
                                  </div>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <q-banner rounded class="cms-banner" :style="bannerStyle">
                    {{ settings.content.colorsBannerText }}
                  </q-banner>
                </q-tab-panel>

                <q-tab-panel name="menu">
                  <div class="cms-config-section">
                    <div class="cms-config-section__form">
                      <div class="cms-section-header">
                        <strong>{{ tr('Groups', 'Grupos') }}</strong>
                        <q-btn flat dense no-caps icon="add" :label="tr('Add group', 'Adicionar grupo')" @click="addGroup()" />
                      </div>
                      <div class="cms-list">
                        <div v-for="(group, index) in settings.navGroups" :key="group.id" class="cms-list-item">
                          <q-input v-model="group.id" outlined dense :label="tr('Group ID', 'ID do grupo')" @blur="normalizeGroupId(index)" />
                          <q-input v-model="group.label" outlined dense :label="tr('Group label', 'Label do grupo')" />
                          <q-btn flat round dense icon="delete" :style="dangerActionStyle" @click="removeGroup(index)" />
                        </div>
                      </div>

                      <q-separator class="q-my-md" />

                      <div class="cms-section-header">
                        <strong>{{ tr('Menu items', 'Itens do menu') }}</strong>
                        <q-btn flat dense no-caps icon="add" :label="tr('Add item', 'Adicionar item')" @click="addMenuItem()" />
                      </div>
                      <div class="cms-list">
                        <div v-for="(item, index) in settings.items" :key="item.id" class="cms-list-item cms-list-item--menu">
                          <q-input v-model="item.id" outlined dense :label="tr('Item ID', 'ID do item')" />
                          <q-input v-model="item.label" outlined dense :label="tr('Label', 'Label')" />
                          <q-input v-model="item.icon" outlined dense :label="tr('Icon', 'Ícone')" />
                          <q-select
                            v-model="item.group"
                            outlined
                            dense
                            emit-value
                            map-options
                            popup-content-class="cms-settings-module-surface__popup"
                            :options="groupOptions"
                            :label="tr('Group', 'Grupo')"
                          />
                          <q-input v-model="item.caption" outlined dense :label="tr('Caption', 'Legenda')" />
                          <q-input v-model="item.description" outlined dense :label="tr('Description', 'Descrição')" />
                          <q-input v-model="item.badge" outlined dense :label="tr('Badge', 'Badge')" />
                          <q-input v-model="item.badgeColor" outlined dense :label="tr('Badge color', 'Cor do badge')" />
                          <q-input v-model="item.badgeTextColor" outlined dense :label="tr('Badge text color', 'Cor do texto do badge')" />
                          <q-btn flat round dense icon="delete" :style="dangerActionStyle" @click="removeMenuItem(index)" />
                        </div>
                      </div>
                    </div>

                    <div class="cms-config-section__example">
                      <div class="cms-example-section cms-example-section--inline">
                        <div class="cms-example-section__header">
                          <strong>{{ tr('Sidebar menu example', 'Exemplo do menu lateral') }}</strong>
                          <small>{{ tr('Groups and items structure preview with active state.', 'Preview da estrutura de grupos e itens com estado ativo.') }}</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--menu">
                          <div v-for="group in menuPreviewGroups" :key="group.id" class="cms-preview-menu-group">
                            <small>{{ group.label }}</small>
                            <div class="cms-preview-menu-items">
                              <button
                                v-for="item in group.items"
                                :key="item.id"
                                type="button"
                                class="cms-preview-menu-item"
                                :class="{ 'cms-preview-menu-item--active': item.id === previewActiveItemId }"
                              >
                                <q-icon :name="item.icon || 'radio_button_unchecked'" class="cms-icon cms-icon--sm" />
                                <span>{{ item.label }}</span>
                                <q-badge
                                  v-if="item.badge !== undefined && item.badge !== ''"
                                  :style="{
                                    background: String(item.badgeColor || notificationBadgeColor),
                                    color: String(item.badgeTextColor || notificationBadgeTextColor),
                                  }"
                                >
                                  {{ item.badge }}
                                </q-badge>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="topbar">
                  <div class="cms-config-section">
                    <div class="cms-config-section__form">
                      <div class="cms-form-grid">
                        <q-input v-model="settings.layout.menuIcon" outlined dense :label="tr('Menu icon', 'Ícone do menu')" />
                        <q-input v-model="settings.layout.menuAriaLabel" outlined dense :label="tr('Menu aria-label', 'Aria-label do menu')" />
                        <q-input v-model="settings.layout.searchPlaceholder" outlined dense :label="tr('Search placeholder', 'Placeholder da busca')" />
                        <q-input v-model="settings.layout.collapseLabel" outlined dense :label="tr('Collapse label', 'Label de comprimir')" />
                        <q-input v-model="settings.layout.expandLabel" outlined dense :label="tr('Expand label', 'Label de expandir')" />
                        <q-input v-model.number="settings.layout.headerHeight" outlined dense type="number" min="48" :label="tr('Header height', 'Altura do cabecalho')" />
                        <q-input v-model.number="settings.layout.drawerWidth" outlined dense type="number" min="180" :label="tr('Drawer width', 'Largura do menu lateral')" />
                        <q-input v-model.number="settings.layout.miniWidth" outlined dense type="number" min="56" :label="tr('Mini width', 'Largura mini')" />
                        <q-input v-model.number="settings.layout.breakpoint" outlined dense type="number" min="480" :label="tr('Breakpoint', 'Breakpoint')" />
                      </div>

                      <div class="cms-toggle-row">
                        <q-toggle v-model="settings.layout.showSearch" :label="tr('Show search', 'Mostrar busca')" />
                        <q-toggle v-model="settings.layout.showNotifications" :label="tr('Show notifications', 'Mostrar notificações')" />
                        <q-toggle v-model="settings.layout.showUserAvatar" :label="tr('Show account action', 'Mostrar ação de conta')" />
                        <q-toggle v-model="settings.layout.showGroupCaptions" :label="tr('Show group captions', 'Mostrar legendas de grupo')" />
                        <q-toggle v-model="settings.layout.collapsible" :label="tr('Allow sidebar collapse', 'Permitir comprimir menu lateral')" />
                        <q-toggle v-model="settings.layout.defaultDrawerOpen" :label="tr('Drawer open by default', 'Menu lateral aberto por padrão')" />
                        <q-toggle v-model="settings.layout.defaultMini" :label="tr('Mini mode by default', 'Modo mini por padrão')" />
                      </div>

                      <q-separator class="q-my-md" />

                      <div class="cms-section-header">
                        <strong>{{ tr('Topbar actions', 'Ações da topbar') }}</strong>
                        <q-btn flat dense no-caps icon="add" :label="tr('Add action', 'Adicionar ação')" @click="addToolbarAction()" />
                      </div>
                      <div class="cms-list">
                        <div v-for="(action, index) in settings.toolbarActions" :key="action.id" class="cms-list-item cms-list-item--toolbar">
                          <q-input v-model="action.id" outlined dense :label="tr('Action ID', 'ID da ação')" />
                          <q-input v-model="action.icon" outlined dense :label="tr('Icon', 'Ícone')" />
                          <q-input v-model="action.label" outlined dense :label="tr('Label', 'Label')" />
                          <q-input v-model="action.tooltip" outlined dense :label="tr('Tooltip', 'Tooltip')" />
                          <q-input v-model="action.href" outlined dense :label="tr('Href', 'Href')" />
                          <q-input v-model="action.color" outlined dense :label="tr('Color', 'Cor')" />
                          <q-input v-model="action.textColor" outlined dense :label="tr('Text color', 'Cor do texto')" />
                          <q-input v-model="action.badge" outlined dense :label="tr('Badge', 'Badge')" />
                          <q-input v-model="action.badgeColor" outlined dense :label="tr('Badge color (or semantic)', 'Cor do badge (ou semantica)')" />
                          <q-input v-model="action.badgeTextColor" outlined dense :label="tr('Badge text color', 'Cor do texto do badge')" />
                          <q-input v-model="action.className" outlined dense :label="tr('Class name', 'Nome da classe')" />
                          <q-toggle v-model="action.showLabel" :label="tr('Show label', 'Mostrar label')" />
                          <q-toggle v-model="action.external" :label="tr('Open external', 'Abrir externo')" />
                          <q-toggle v-model="action.flat" :label="tr('Flat', 'Flat')" />
                          <q-toggle v-model="action.dense" :label="tr('Dense', 'Dense')" />
                          <q-toggle v-model="action.round" :label="tr('Round', 'Round')" />
                          <q-toggle v-model="action.unelevated" :label="tr('Unelevated', 'Sem elevação')" />
                          <q-toggle v-model="action.outline" :label="tr('Outline', 'Contorno')" />
                          <q-toggle v-model="action.noCaps" :label="tr('No caps', 'Sem maiusculas')" />
                          <q-btn flat round dense icon="delete" :style="dangerActionStyle" @click="removeToolbarAction(index)" />
                        </div>
                      </div>
                    </div>

                    <div class="cms-config-section__example">
                      <div class="cms-example-section cms-example-section--inline">
                        <div class="cms-example-section__header">
                          <strong>{{ tr('Topbar example', 'Exemplo de topbar') }}</strong>
                          <small>{{ tr('Header height, search visibility and actions rendered together.', 'Altura do cabeçalho, visibilidade da busca e ações renderizadas em conjunto.') }}</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--topbar">
                          <div class="cms-preview-topbar">
                            <div class="cms-preview-topbar__left">
                              <q-icon :name="settings.layout.menuIcon" class="cms-icon cms-icon--md" />
                              <strong>{{ settings.branding.appName }}</strong>
                            </div>
                            <div v-if="settings.layout.showSearch" class="cms-preview-topbar__search">
                              <q-icon name="search" class="cms-icon cms-icon--sm" />
                              <span>{{ settings.layout.searchPlaceholder }}</span>
                            </div>
                            <div class="cms-preview-topbar__actions">
                              <button
                                v-for="action in toolbarPreviewActions"
                                :key="action.id"
                                type="button"
                                class="cms-preview-topbar__action"
                              >
                                <q-icon :name="action.icon || 'bolt'" class="cms-icon cms-icon--sm" />
                                <span v-if="action.showLabel">{{ action.label }}</span>
                                <q-badge
                                  v-if="action.badge !== undefined && action.badge !== ''"
                                  :style="{
                                    background: String(action.badgeColor || notificationBadgeColor),
                                    color: String(action.badgeTextColor || notificationBadgeTextColor),
                                  }"
                                >
                                  {{ action.badge }}
                                </q-badge>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="content">
                  <div class="cms-config-section">
                    <div class="cms-config-section__form">
                      <div class="cms-form-grid">
                        <q-select
                          v-model="settings.content.locale"
                          outlined
                          dense
                          emit-value
                          map-options
                          popup-content-class="cms-settings-module-surface__popup"
                          :options="cmsLocaleOptions"
                          :label="tr('Language', 'Idioma')"
                          @update:model-value="onCmsLocaleChange($event)"
                        />
                        <q-btn
                          flat
                          no-caps
                          icon="translate"
                          :label="tr('Apply locale preset', 'Aplicar preset de idioma')"
                          @click="onCmsLocaleChange(settings.content.locale)"
                        />
                        <q-input v-model="settings.content.moduleFallbackDescription" outlined dense type="textarea" autogrow :label="tr('Module fallback description', 'Descrição fallback do módulo')" />
                        <q-input v-model="settings.content.brandingBannerText" outlined dense type="textarea" autogrow :label="tr('Branding banner text', 'Texto do banner de branding')" />
                        <q-input v-model="settings.content.colorsBannerText" outlined dense type="textarea" autogrow :label="tr('Colors banner text', 'Texto do banner de cores')" />
                        <q-input v-model="settings.content.statusTitle" outlined dense :label="tr('Status card title', 'Título do card de status')" />
                        <q-input v-model="settings.content.statusChipLabel" outlined dense :label="tr('Status chip label', 'Label do chip de status')" />
                        <q-input v-model="settings.content.statusThemeText" outlined dense :label="tr('Status: theme line', 'Status: linha de tema')" />
                        <q-input v-model="settings.content.statusBrandingText" outlined dense :label="tr('Status: branding line', 'Status: linha de branding')" />
                        <q-input v-model="settings.content.statusMenuText" outlined dense :label="tr('Status: menu line', 'Status: linha de menu')" />
                        <q-input v-model="settings.content.statusTopbarText" outlined dense :label="tr('Status: topbar line', 'Status: linha de topbar')" />
                        <q-input v-model="settings.content.howToTitle" outlined dense :label="tr('How-to title', 'Título de como usar')" />
                        <q-input v-model="settings.content.howToBody" outlined dense type="textarea" autogrow :label="tr('How-to body', 'Texto de como usar')" />
                        <q-input v-model="settings.content.howToNextStep" outlined dense type="textarea" autogrow :label="tr('How-to next step', 'Próximo passo de como usar')" />
                        <q-input v-model="settings.content.previewSuccessLabel" outlined dense :label="tr('Preview success label', 'Label de preview de sucesso')" />
                        <q-input v-model="settings.content.previewWarningLabel" outlined dense :label="tr('Preview warning label', 'Label de preview de aviso')" />
                        <q-input v-model="settings.content.previewErrorLabel" outlined dense :label="tr('Preview error label', 'Label de preview de erro')" />
                        <q-input v-model="settings.content.previewInfoLabel" outlined dense :label="tr('Preview info label', 'Label de preview de info')" />
                        <q-input v-model="settings.content.tabBrandingLabel" outlined dense :label="tr('Tab: branding label', 'Aba: label de branding')" />
                        <q-input v-model="settings.content.tabTypographyLabel" outlined dense :label="tr('Tab: typography label', 'Aba: label de tipografia')" />
                        <q-input v-model="settings.content.tabLayoutLabel" outlined dense :label="tr('Tab: layout label', 'Aba: label de layout')" />
                        <q-input v-model="settings.content.tabColorsLabel" outlined dense :label="tr('Tab: colors label', 'Aba: label de cores')" />
                        <q-input v-model="settings.content.tabMenuLabel" outlined dense :label="tr('Tab: menu label', 'Aba: label de menu')" />
                        <q-input v-model="settings.content.tabTopbarLabel" outlined dense :label="tr('Tab: topbar label', 'Aba: label de topbar')" />
                        <q-input v-model="settings.content.tabContentLabel" outlined dense :label="tr('Tab: content label', 'Aba: label de conteúdo')" />
                      </div>
                    </div>

                    <div class="cms-config-section__example">
                      <div class="cms-example-section cms-example-section--inline">
                        <div class="cms-example-section__header">
                          <strong>{{ tr('Content copy example', 'Exemplo de copy de conteudo') }}</strong>
                          <small>{{ tr('Preview of tab labels, banners and instructional text.', 'Preview de labels de abas, banners e texto instrucional.') }}</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--content">
                          <div class="cms-preview-content-tabs">
                            <q-chip dense square>{{ settings.content.tabBrandingLabel }}</q-chip>
                            <q-chip dense square>{{ settings.content.tabTypographyLabel }}</q-chip>
                            <q-chip dense square>{{ settings.content.tabLayoutLabel }}</q-chip>
                            <q-chip dense square>{{ settings.content.tabColorsLabel }}</q-chip>
                            <q-chip dense square>{{ settings.content.tabMenuLabel }}</q-chip>
                            <q-chip dense square>{{ settings.content.tabTopbarLabel }}</q-chip>
                            <q-chip dense square>{{ settings.content.tabContentLabel }}</q-chip>
                          </div>
                          <p class="cms-preview-content-text">{{ settings.content.moduleFallbackDescription }}</p>
                          <q-banner rounded class="cms-banner" :style="bannerStyle">
                            {{ settings.content.brandingBannerText }}
                          </q-banner>
                          <div class="cms-preview-content-status">
                            <span>{{ settings.content.statusThemeText }}</span>
                            <span>{{ settings.content.statusBrandingText }}</span>
                            <span>{{ settings.content.statusMenuText }}</span>
                            <span>{{ settings.content.statusTopbarText }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="cms-config-section">
                    <div class="cms-config-section__form">
                      <div class="cms-form-grid">
                        <q-select
                          v-model="selectedAuthoredContentModelIdModel"
                          outlined
                          dense
                          emit-value
                          map-options
                          popup-content-class="cms-settings-module-surface__popup"
                          :options="cmsAuthoredContentModelOptions"
                          :label="tr('Content model library', 'Biblioteca de modelos de conteúdo')"
                        />
                        <q-btn
                          flat
                          no-caps
                          icon="add_box"
                          :label="tr('New content model', 'Novo modelo de conteúdo')"
                          @click="createNewAuthoredContentModelDraft()"
                        />
                        <q-btn
                          flat
                          no-caps
                          icon="file_download"
                          :label="tr('Export schema package', 'Exportar pacote de schema')"
                          @click="exportCmsSchemaPackage()"
                        />
                        <q-btn
                          flat
                          no-caps
                          icon="file_upload"
                          :label="tr('Import schema package', 'Importar pacote de schema')"
                          @click="openSchemaImportDialog()"
                        />
                        <q-input
                          :model-value="authoredContentModelNameDraft"
                          outlined
                          dense
                          :label="tr('Content model name', 'Nome do modelo de conteúdo')"
                          @update:model-value="emit('update:authoredContentModelNameDraft', String($event ?? ''))"
                        />
                        <q-input
                          :model-value="authoredContentModelDescriptionDraft"
                          outlined
                          dense
                          type="textarea"
                          autogrow
                          :label="tr('Content model description', 'Descrição do modelo de conteúdo')"
                          @update:model-value="emit('update:authoredContentModelDescriptionDraft', String($event ?? ''))"
                        />
                        <q-input
                          :model-value="authoredContentModelDefaultPageTitleDraft"
                          outlined
                          dense
                          :label="tr('Default page title', 'Título padrão da página')"
                          @update:model-value="emit('update:authoredContentModelDefaultPageTitleDraft', String($event ?? ''))"
                        />
                        <q-input
                          :model-value="authoredContentModelDefaultPageDescriptionDraft"
                          outlined
                          dense
                          type="textarea"
                          autogrow
                          :label="tr('Default page description', 'Descrição padrão da página')"
                          @update:model-value="emit('update:authoredContentModelDefaultPageDescriptionDraft', String($event ?? ''))"
                        />
                        <q-input
                          :model-value="authoredContentModelDefaultPagePathPrefixDraft"
                          outlined
                          dense
                          :label="tr('Default page path prefix', 'Prefixo padrão do caminho da página')"
                          :hint="tr('Example: /campaign', 'Exemplo: /campanha')"
                          @update:model-value="emit('update:authoredContentModelDefaultPagePathPrefixDraft', String($event ?? ''))"
                        />
                        <q-input
                          :model-value="authoredContentModelMigrationNotesDraft"
                          outlined
                          dense
                          type="textarea"
                          autogrow
                          :label="tr('Migration notes', 'Notas de migração')"
                          :hint="tr('Explain what changed when the schema version advances.', 'Explique o que mudou quando a versão do schema avança.')"
                          @update:model-value="emit('update:authoredContentModelMigrationNotesDraft', String($event ?? ''))"
                        />
                        <div class="cms-form-grid__full cms-content-model-fields">
                          <div class="cms-content-model-fields__header">
                            <strong>{{ tr('Schema fields', 'Campos do schema') }}</strong>
                            <div class="cms-content-model-fields__header-actions">
                              <q-select
                                :model-value="selectedAuthoredContentModelFieldPresetId"
                                outlined
                                dense
                                emit-value
                                map-options
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="cmsAuthoredContentModelFieldPresetOptions"
                                :label="tr('Field preset library', 'Biblioteca de presets de campo')"
                                class="cms-content-model-fields__preset-select"
                                @update:model-value="emit('update:selectedAuthoredContentModelFieldPresetId', String($event ?? ''))"
                              />
                              <q-btn
                                flat
                                dense
                                no-caps
                                icon="file_download"
                                :label="tr('Insert preset', 'Inserir preset')"
                                :disable="!selectedAuthoredContentModelFieldPresetSettings"
                                @click="insertSelectedAuthoredContentModelFieldPreset()"
                              />
                              <q-btn
                                flat
                                dense
                                no-caps
                                icon="playlist_add"
                                :label="tr('Add field', 'Adicionar campo')"
                                @click="addAuthoredContentModelFieldDraft()"
                              />
                            </div>
                          </div>
                          <p class="cms-content-model-fields__description">
                            {{
                              tr(
                                'Define page-level structured fields rendered in the Pages builder.',
                                'Defina campos estruturados em nível de página que serão renderizados no builder de Pages.'
                              )
                            }}
                          </p>
                          <div
                            v-if="authoredContentModelFieldDrafts.length === 0"
                            class="cms-content-model-fields__empty"
                          >
                            {{ tr('No schema fields yet.', 'Ainda não há campos de schema.') }}
                          </div>
                          <div
                            v-for="(field, fieldIndex) in authoredContentModelFieldDrafts"
                            :key="`content-model-field-${fieldIndex}`"
                            class="cms-content-model-fields__item"
                          >
                            <div class="cms-content-model-fields__row">
                              <q-input
                                v-model="field.id"
                                outlined
                                dense
                                :label="tr('Field ID', 'ID do campo')"
                              />
                              <q-select
                                v-model="field.type"
                                outlined
                                dense
                                emit-value
                                map-options
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="cmsContentModelFieldTypeOptions"
                                :label="tr('Field type', 'Tipo do campo')"
                              />
                              <q-input
                                v-model="field.label"
                                outlined
                                dense
                                :label="tr('Field label', 'Label do campo')"
                              />
                              <q-btn
                                flat
                                dense
                                no-caps
                                icon="bookmark_add"
                                :label="tr('Save as preset', 'Salvar como preset')"
                                @click="saveAuthoredContentModelFieldDraftAsPreset(fieldIndex)"
                              />
                              <q-btn
                                flat
                                dense
                                no-caps
                                icon="delete"
                                :label="tr('Remove field', 'Remover campo')"
                                :style="dangerActionStyle"
                                @click="removeAuthoredContentModelFieldDraft(fieldIndex)"
                              />
                            </div>
                            <div class="cms-content-model-fields__row">
                              <q-input
                                v-model="field.group"
                                outlined
                                dense
                                :label="tr('Field group', 'Grupo do campo')"
                                :hint="tr('Leave blank to place the field in General.', 'Deixe em branco para colocar o campo em Geral.')"
                              />
                              <q-input
                                v-model="field.orderValue"
                                outlined
                                dense
                                type="number"
                                min="1"
                                :label="tr('Field order', 'Ordem do campo')"
                              />
                              <q-input
                                v-model="field.description"
                                outlined
                                dense
                                :label="tr('Field description', 'Descrição do campo')"
                              />
                              <q-input
                                v-model="field.placeholder"
                                outlined
                                dense
                                :disable="field.type === 'toggle' || field.type === 'select' || field.type === 'date' || field.type === 'media-asset' || field.type === 'reference' || field.type === 'object' || field.type === 'group'"
                                :label="tr('Placeholder', 'Placeholder')"
                              />
                              <q-input
                                v-if="field.type === 'object' || field.type === 'group'"
                                v-model="field.defaultValue"
                                outlined
                                dense
                                type="textarea"
                                autogrow
                                :label="tr('Default JSON value', 'Valor JSON padrão')"
                                :hint="field.type === 'group'
                                  ? tr('Use a JSON array of objects for repeatable groups.', 'Use um array JSON de objetos para grupos repetiveis.')
                                  : tr('Use a JSON object for nested values.', 'Use um objeto JSON para valores aninhados.')"
                              />
                              <q-input
                                v-else-if="field.type !== 'media-asset' && field.type !== 'reference'"
                                v-model="field.defaultValue"
                                outlined
                                dense
                                :type="field.repeatable
                                  ? 'textarea'
                                  : getCmsContentModelFieldHtmlInputType(field.type)"
                                :autogrow="field.repeatable"
                                :disable="field.type === 'toggle' && !field.repeatable"
                                :label="field.repeatable ? tr('Default values (one per line)', 'Valores padrão (um por linha)') : tr('Default value', 'Valor padrão')"
                              />
                              <CmsMediaAssetPicker
                                v-else-if="field.type === 'media-asset'"
                                :model-value="field.repeatable ? parseCmsRepeatableFieldValue(field.defaultValue) : field.defaultValue"
                                :multiple="field.repeatable"
                                :options="getCmsContentModelFieldDraftMediaOptions(field)"
                                :label="field.repeatable ? tr('Default assets', 'Assets padrão') : tr('Default asset', 'Asset padrão')"
                                :allowed-kind-labels="getCmsMediaAllowedKindLabels(field.mediaKinds)"
                                :any-kind-label="cmsMediaPickerUiText.anyKindLabel"
                                :selected-preview-label="field.repeatable ? cmsMediaPickerUiText.selectedAssetsLabel : cmsMediaPickerUiText.selectedAssetLabel"
                                :no-selection-label="cmsMediaPickerUiText.noSelectionLabel"
                                :no-option-label="cmsMediaPickerUiText.noOptionLabel"
                                :incompatible-label="cmsMediaPickerUiText.incompatibleLabel"
                                @update:model-value="field.defaultValue = Array.isArray($event) ? $event.join('\n') : String($event ?? '')"
                              />
                              <q-select
                                v-else
                                :model-value="field.repeatable ? parseCmsRepeatableFieldValue(field.defaultValue) : field.defaultValue"
                                outlined
                                dense
                                :multiple="field.repeatable"
                                emit-value
                                map-options
                                use-chips
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="getCmsContentModelFieldDraftReferenceOptions(field)"
                                :label="field.repeatable ? tr('Default references', 'Referências padrão') : tr('Default reference', 'Referência padrão')"
                                @update:model-value="field.defaultValue = Array.isArray($event) ? $event.join('\n') : String($event ?? '')"
                              />
                              <q-toggle
                                v-model="field.required"
                                :label="tr('Required', 'Obrigatorio')"
                              />
                            </div>
                            <div class="cms-content-model-fields__row">
                              <q-input
                                v-model="field.labelPtBr"
                                outlined
                                dense
                                :label="tr('PT-BR label', 'Label PT-BR')"
                                :hint="tr('Leave blank to inherit the EN/base label.', 'Deixe em branco para herdar o label EN/base.')"
                              />
                              <q-input
                                v-model="field.groupPtBr"
                                outlined
                                dense
                                :label="tr('PT-BR group', 'Grupo PT-BR')"
                                :hint="tr('Leave blank to inherit the EN/base group.', 'Deixe em branco para herdar o grupo EN/base.')"
                              />
                              <q-input
                                v-model="field.descriptionPtBr"
                                outlined
                                dense
                                :label="tr('PT-BR description', 'Descrição PT-BR')"
                                :hint="tr('Leave blank to inherit the EN/base description.', 'Deixe em branco para herdar a descrição EN/base.')"
                              />
                              <q-input
                                v-model="field.placeholderPtBr"
                                outlined
                                dense
                                :disable="field.type === 'toggle' || field.type === 'select' || field.type === 'date' || field.type === 'media-asset' || field.type === 'reference' || field.type === 'object' || field.type === 'group'"
                                :label="tr('PT-BR placeholder', 'Placeholder PT-BR')"
                                :hint="tr('Leave blank to inherit the EN/base placeholder.', 'Deixe em branco para herdar o placeholder EN/base.')"
                              />
                            </div>
                            <div class="cms-content-model-fields__row">
                              <q-toggle
                                v-model="field.repeatable"
                                :disable="field.type === 'object' || field.type === 'group'"
                                :label="tr('Repeatable', 'Multiplo')"
                              />
                              <q-input
                                v-model="field.minValue"
                                outlined
                                dense
                                type="number"
                                :disable="field.type !== 'group' && !field.repeatable && !doesCmsContentModelFieldSupportScalarConstraints(field)"
                                :label="getCmsContentModelFieldMinConstraintLabel(field)"
                              />
                              <q-input
                                v-model="field.maxValue"
                                outlined
                                dense
                                type="number"
                                :disable="field.type !== 'group' && !field.repeatable && !doesCmsContentModelFieldSupportScalarConstraints(field)"
                                :label="getCmsContentModelFieldMaxConstraintLabel(field)"
                              />
                            </div>
                            <div
                              v-if="field.type === 'object' || field.type === 'group'"
                              class="cms-content-model-fields__row"
                            >
                              <q-input
                                v-model="field.nestedFieldsJson"
                                outlined
                                dense
                                type="textarea"
                                autogrow
                                class="cms-content-model-fields__json-input"
                                :label="tr('Nested fields JSON', 'JSON dos campos aninhados')"
                                :hint="tr('Provide an array of field setting objects using the same CMS schema contract.', 'Informe um array de objetos de campo usando o mesmo contrato de schema do CMS.')"
                              />
                            </div>
                            <div class="cms-content-model-fields__row">
                              <q-select
                                v-if="field.type === 'media-asset'"
                                v-model="field.mediaKinds"
                                outlined
                                dense
                                multiple
                                emit-value
                                map-options
                                use-chips
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="cmsMediaKindOptions"
                                :label="tr('Allowed media kinds', 'Tipos de midia permitidos')"
                              />
                              <q-select
                                v-if="field.type === 'reference'"
                                v-model="field.referenceKinds"
                                outlined
                                dense
                                multiple
                                emit-value
                                map-options
                                use-chips
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="cmsReferenceKindOptions"
                                :label="tr('Allowed reference kinds', 'Tipos de referência permitidos')"
                              />
                              <q-toggle
                                v-model="field.visibilityEnabled"
                                :label="tr('Conditional visibility', 'Visibilidade condicional')"
                                @update:model-value="normalizeCmsContentModelFieldVisibilityDraft(fieldIndex)"
                              />
                              <q-select
                                v-if="field.visibilityEnabled"
                                v-model="field.visibilitySource"
                                outlined
                                dense
                                emit-value
                                map-options
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="cmsContentModelFieldVisibilitySourceOptions"
                                :label="tr('Visibility source', 'Origem da visibilidade')"
                                @update:model-value="normalizeCmsContentModelFieldVisibilityDraft(fieldIndex)"
                              />
                              <q-select
                                v-if="field.visibilityEnabled && field.visibilitySource === 'field'"
                                v-model="field.visibilityFieldId"
                                outlined
                                dense
                                emit-value
                                map-options
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="getCmsContentModelFieldVisibilityTargetOptions(fieldIndex)"
                                :label="tr('Depends on field', 'Depende do campo')"
                                @update:model-value="normalizeCmsContentModelFieldVisibilityDraft(fieldIndex)"
                              />
                              <q-select
                                v-if="field.visibilityEnabled"
                                v-model="field.visibilityOperator"
                                outlined
                                dense
                                emit-value
                                map-options
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="getCmsContentModelFieldVisibilityOperatorOptions(field.visibilitySource)"
                                :label="tr('Condition', 'Condição')"
                                @update:model-value="normalizeCmsContentModelFieldVisibilityDraft(fieldIndex)"
                              />
                              <q-select
                                v-if="field.visibilityEnabled && field.visibilitySource === 'page-status' && doesCmsContentModelFieldVisibilityOperatorRequireValue(field.visibilityOperator)"
                                v-model="field.visibilityValue"
                                outlined
                                dense
                                emit-value
                                map-options
                                popup-content-class="cms-settings-module-surface__popup"
                                :options="pageStatusOptions"
                                :label="tr('Expected status', 'Status esperado')"
                              />
                              <q-input
                                v-else-if="field.visibilityEnabled && doesCmsContentModelFieldVisibilityOperatorRequireValue(field.visibilityOperator)"
                                v-model="field.visibilityValue"
                                outlined
                                dense
                                :label="tr('Expected value', 'Valor esperado')"
                              />
                            </div>
                            <div class="cms-content-model-fields__row">
                              <q-input
                                v-if="field.type === 'toggle' && !field.repeatable"
                                v-model="field.defaultValue"
                                outlined
                                dense
                                readonly
                                :label="tr('Default toggle value', 'Valor padrão do toggle')"
                              />
                              <q-toggle
                                v-if="field.type === 'toggle' && !field.repeatable"
                                :model-value="field.defaultValue === 'true'"
                                :label="tr('Enabled by default', 'Habilitado por padrão')"
                                @update:model-value="field.defaultValue = $event ? 'true' : 'false'"
                              />
                              <q-input
                                v-if="field.type === 'select'"
                                v-model="field.optionsDraft"
                                outlined
                                dense
                                type="textarea"
                                autogrow
                                class="cms-content-model-fields__options"
                                :label="tr('Options (one per line)', 'Opções (uma por linha)')"
                              />
                            </div>
                          </div>
                          <div class="cms-blocks-library">
                            <div class="cms-blocks-library__header">
                              <strong>{{ tr('Field preset library', 'Biblioteca de presets de campo') }}</strong>
                              <div class="cms-blocks-library__header-actions">
                                <q-toggle
                                  :model-value="showArchivedFieldPresets"
                                  dense
                                  :label="tr('Show archived', 'Mostrar arquivados')"
                                  @update:model-value="emit('update:showArchivedFieldPresets', Boolean($event))"
                                />
                                <q-chip dense square :style="statusChipStyle">{{ cmsAuthoredContentModelFieldPresetLibrary.length }}/{{ settings.authoredContentModelFieldPresets.length }}</q-chip>
                              </div>
                            </div>

                            <div v-if="cmsAuthoredContentModelFieldPresetLibrary.length === 0" class="cms-block-item__empty">
                              <strong>{{ tr('No field presets saved yet.', 'Nenhum preset de campo salvo ainda.') }}</strong>
                              <small>
                                {{
                                  tr(
                                    'Save one schema field as a preset to reuse the same contract across content models.',
                                    'Salve um campo do schema como preset para reutilizar o mesmo contrato em outros modelos de conteúdo.'
                                  )
                                }}
                              </small>
                            </div>

                            <div
                              v-for="preset in cmsAuthoredContentModelFieldPresetLibrary"
                              :key="preset.id"
                              class="cms-reusable-block-row"
                              :class="{ 'cms-reusable-block-row--active': preset.id === selectedAuthoredContentModelFieldPresetId }"
                            >
                              <div class="cms-reusable-block-row__meta">
                                <strong>{{ getCmsAuthoredContentModelFieldPresetNameValue(preset) }}</strong>
                                <small>{{ preset.field.type }} · {{ preset.category || tr('General', 'Geral') }}</small>
                                <small>
                                  {{
                                    `${preset.field.id} · ${preset.field.repeatable ? tr('Repeatable', 'Múltiplo') : tr('Single value', 'Valor único')}`
                                  }}
                                </small>
                                <small v-if="isCmsArchivedEntity(preset)">{{ tr('Archived', 'Arquivado') }}</small>
                                <small v-if="isCmsDeprecatedEntity(preset)">
                                  {{
                                    getCmsReplacementLabel(
                                      preset.replacementEntityId,
                                      settings.authoredContentModelFieldPresets,
                                      getCmsAuthoredContentModelFieldPresetNameValue
                                    )
                                      ? `${tr('Deprecated -> replacement', 'Descontinuado -> substituto')}: ${getCmsReplacementLabel(
                                        preset.replacementEntityId,
                                        settings.authoredContentModelFieldPresets,
                                        getCmsAuthoredContentModelFieldPresetNameValue
                                      )}`
                                      : tr('Deprecated for new schema authoring', 'Descontinuado para novas autorias de schema')
                                  }}
                                </small>
                                <small v-if="isCmsDeprecatedEntity(preset) && preset.deprecationNote">{{ preset.deprecationNote }}</small>
                                <small v-if="getCmsAuthoredContentModelFieldPresetDescriptionValue(preset)">
                                  {{ getCmsAuthoredContentModelFieldPresetDescriptionValue(preset) }}
                                </small>
                                <q-select
                                  v-if="isCmsDeprecatedEntity(preset)"
                                  :model-value="preset.replacementEntityId ?? null"
                                  outlined
                                  dense
                                  clearable
                                  emit-value
                                  map-options
                                  popup-content-class="cms-settings-module-surface__popup"
                                  :options="getCmsFieldPresetReplacementOptions(preset)"
                                  :label="tr('Replacement preset', 'Preset substituto')"
                                  @update:model-value="updateCmsAuthoredContentModelFieldPresetReplacement(preset.id, $event)"
                                />
                                <q-input
                                  v-if="isCmsDeprecatedEntity(preset)"
                                  :model-value="preset.deprecationNote ?? ''"
                                  outlined
                                  dense
                                  :label="tr('Deprecation note', 'Nota de descontinuação')"
                                  @update:model-value="updateCmsAuthoredContentModelFieldPresetDeprecationNote(preset.id, $event)"
                                />
                              </div>
                              <div class="cms-reusable-block-row__actions">
                                <q-btn
                                  flat
                                  dense
                                  no-caps
                                  icon="ads_click"
                                  :label="tr('Use', 'Usar')"
                                  :disable="isCmsArchivedEntity(preset) || isCmsDeprecatedEntity(preset)"
                                  @click="emit('update:selectedAuthoredContentModelFieldPresetId', preset.id)"
                                />
                                <q-btn
                                  v-if="isCmsDeprecatedEntity(preset) && preset.replacementEntityId"
                                  flat
                                  dense
                                  no-caps
                                  icon="swap_horiz"
                                  :label="tr('Use replacement', 'Usar substituto')"
                                  @click="selectCmsReplacementFieldPreset(preset.replacementEntityId)"
                                />
                                <q-btn
                                  flat
                                  dense
                                  no-caps
                                  :icon="isCmsDeprecatedEntity(preset) ? 'restore_from_trash' : 'history_toggle_off'"
                                  :label="isCmsDeprecatedEntity(preset) ? tr('Reinstate', 'Reativar') : tr('Deprecate', 'Descontinuar')"
                                  :style="isCmsDeprecatedEntity(preset) ? undefined : warningActionStyle"
                                  @click="isCmsDeprecatedEntity(preset) ? undeprecateCmsAuthoredContentModelFieldPreset(preset.id) : deprecateCmsAuthoredContentModelFieldPreset(preset.id)"
                                />
                                <q-btn
                                  flat
                                  dense
                                  no-caps
                                  :icon="isCmsArchivedEntity(preset) ? 'unarchive' : 'archive'"
                                  :label="isCmsArchivedEntity(preset) ? tr('Restore', 'Restaurar') : tr('Archive', 'Arquivar')"
                                  :style="isCmsArchivedEntity(preset) ? undefined : warningActionStyle"
                                  @click="isCmsArchivedEntity(preset) ? unarchiveCmsAuthoredContentModelFieldPreset(preset.id) : archiveCmsAuthoredContentModelFieldPreset(preset.id)"
                                />
                              </div>
                            </div>
                          </div>
                          <q-select
                            :model-value="authoredContentModelAllowedSectionSelections"
                            outlined
                            dense
                            emit-value
                            map-options
                            multiple
                            use-chips
                            popup-content-class="cms-settings-module-surface__popup"
                            :options="cmsContentModelPresetOptions"
                            :label="tr('Allowed section presets', 'Presets de seção permitidos')"
                            @update:model-value="emit('update:authoredContentModelAllowedSectionSelections', $event)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
          <aside class="cms-designer-card__rail cms-settings__rail">
            <div class="cms-designer-card__rail-card">
              <CmsAuthoringPanelHeader
                :title="tr('Designer rail', 'Rail do designer')"
                :description="tr('Context and recovery stay pinned while you edit without duplicating the top action bar.', 'Contexto e recovery ficam fixos durante a edição sem duplicar a barra superior.')"
              />
              <CmsAuthoringMetricsList :items="cmsSettingsRailMetrics" />
            </div>
            <div class="cms-designer-card__rail-actions">
              <q-btn round flat icon="tune" :aria-label="cmsUiText.showAdvancedOverridesLabel" @click="emit('update:showAdvancedThemeFields', !showAdvancedThemeFields)">
                <q-tooltip class="cms-settings-module-surface__tooltip">{{ cmsUiText.showAdvancedOverridesLabel }}</q-tooltip>
              </q-btn>
            </div>
          </aside>
        </div>
      </template>
      <template #status>
        <CmsAuthoringStatusBar
          class-name="cms-settings__statusbar"
          :items="cmsSettingsStatusItems"
        />
      </template>
    </CmsAuthoringWorkbench>
    <CmsShellCard
      v-if="cmsSettingsWorkspaceView === 'preview' || cmsDesignerPreviewMode"
      :title="tr('Settings preview', 'Preview de configurações')"
      body-class="cms-settings__preview"
    >
      <template #header-actions>
        <div class="cms-preview-toolbar__chips">
          <q-chip dense square :style="statusChipStyle">{{ activeTenantProfileName || tr('Default tenant', 'Tenant padrão') }}</q-chip>
          <q-chip dense square :style="statusChipStyle">{{ activeSettingsWorkbenchTabLabel }}</q-chip>
          <q-chip dense square :style="cmsAutosaveStatusStyle">{{ cmsAutosaveStatusLabel }}</q-chip>
        </div>
      </template>
      <div class="cms-settings__preview-grid">
        <section class="cms-example-section">
          <div class="cms-example-section__header">
            <strong>{{ tr('Branding example', 'Exemplo de branding') }}</strong>
            <small>{{ tr('Live preview of logo, product identity and account information.', 'Preview em tempo real do logo, identidade do produto e conta.') }}</small>
          </div>
          <div class="cms-preview-card cms-preview-card--branding">
            <div class="cms-preview-brand">
              <img :src="settings.branding.brandLogo" :alt="settings.branding.brandLogoAlt" class="cms-preview-brand__logo">
              <div class="cms-preview-brand__copy">
                <strong>{{ settings.branding.appName }}</strong>
                <small>{{ settings.branding.appSubtitle }}</small>
              </div>
            </div>
            <div class="cms-preview-brand__meta">
              <div class="cms-preview-brand__meta-row">
                <span>{{ tr('Favicon', 'Favicon') }}</span>
                <code>{{ settings.branding.faviconUrl || settings.branding.brandLogo }}</code>
              </div>
              <div class="cms-preview-brand__meta-row">
                <span>{{ tr('User', 'Usuario') }}</span>
                <div class="cms-preview-user">
                  <img v-if="settings.branding.userAvatar" :src="settings.branding.userAvatar" alt="User avatar">
                  <q-icon v-else name="account_circle" class="cms-icon cms-icon--avatar" />
                  <small>{{ settings.branding.userTooltip }}</small>
                </div>
              </div>
              <q-chip dense square icon="notifications" :style="statusChipStyle" :aria-label="settings.branding.notificationsTooltip">
                <q-tooltip v-if="settings.branding.notificationsTooltip" class="cms-settings-module-surface__tooltip">{{ settings.branding.notificationsTooltip }}</q-tooltip>
                {{ settings.branding.notificationCount }}
              </q-chip>
            </div>
          </div>
        </section>

        <section class="cms-example-section">
          <div class="cms-example-section__header">
            <strong>{{ tr('Sidebar menu example', 'Exemplo do menu lateral') }}</strong>
            <small>{{ tr('Groups and items structure preview with active state.', 'Preview da estrutura de grupos e itens com estado ativo.') }}</small>
          </div>
          <div class="cms-preview-card cms-preview-card--menu">
            <div v-for="group in menuPreviewGroups" :key="group.id" class="cms-preview-menu-group">
              <small>{{ group.label }}</small>
              <div class="cms-preview-menu-items">
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  type="button"
                  class="cms-preview-menu-item"
                  :class="{ 'cms-preview-menu-item--active': item.id === previewActiveItemId }"
                >
                  <q-icon :name="item.icon || 'radio_button_unchecked'" class="cms-icon cms-icon--sm" />
                  <span>{{ item.label }}</span>
                  <q-badge
                    v-if="item.badge !== undefined && item.badge !== ''"
                    :style="{
                      background: String(item.badgeColor || notificationBadgeColor),
                      color: String(item.badgeTextColor || notificationBadgeTextColor),
                    }"
                  >
                    {{ item.badge }}
                  </q-badge>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="cms-example-section">
          <div class="cms-example-section__header">
            <strong>{{ tr('Topbar example', 'Exemplo de topbar') }}</strong>
            <small>{{ tr('Header height, search visibility and actions rendered together.', 'Altura do cabeçalho, visibilidade da busca e ações renderizadas em conjunto.') }}</small>
          </div>
          <div class="cms-preview-card cms-preview-card--topbar">
            <div class="cms-preview-topbar">
              <div class="cms-preview-topbar__left">
                <q-icon :name="settings.layout.menuIcon" class="cms-icon cms-icon--md" />
                <strong>{{ settings.branding.appName }}</strong>
              </div>
              <div v-if="settings.layout.showSearch" class="cms-preview-topbar__search">
                <q-icon name="search" class="cms-icon cms-icon--sm" />
                <span>{{ settings.layout.searchPlaceholder }}</span>
              </div>
              <div class="cms-preview-topbar__actions">
                <button
                  v-for="action in toolbarPreviewActions"
                  :key="action.id"
                  type="button"
                  class="cms-preview-topbar__action"
                >
                  <q-icon :name="action.icon || 'bolt'" class="cms-icon cms-icon--sm" />
                  <span v-if="action.showLabel">{{ action.label }}</span>
                  <q-badge
                    v-if="action.badge !== undefined && action.badge !== ''"
                    :style="{
                      background: String(action.badgeColor || notificationBadgeColor),
                      color: String(action.badgeTextColor || notificationBadgeTextColor),
                    }"
                  >
                    {{ action.badge }}
                  </q-badge>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="cms-example-section">
          <div class="cms-example-section__header">
            <strong>{{ tr('Content copy example', 'Exemplo de copy de conteúdo') }}</strong>
            <small>{{ tr('Preview of tab labels, banners and instructional text.', 'Preview de labels de abas, banners e texto instrucional.') }}</small>
          </div>
          <div class="cms-preview-card cms-preview-card--content">
            <div class="cms-preview-content-tabs">
              <q-chip dense square>{{ settings.content.tabBrandingLabel }}</q-chip>
              <q-chip dense square>{{ settings.content.tabTypographyLabel }}</q-chip>
              <q-chip dense square>{{ settings.content.tabLayoutLabel }}</q-chip>
              <q-chip dense square>{{ settings.content.tabColorsLabel }}</q-chip>
              <q-chip dense square>{{ settings.content.tabMenuLabel }}</q-chip>
              <q-chip dense square>{{ settings.content.tabTopbarLabel }}</q-chip>
              <q-chip dense square>{{ settings.content.tabContentLabel }}</q-chip>
            </div>
            <p class="cms-preview-content-text">{{ settings.content.moduleFallbackDescription }}</p>
            <q-banner rounded class="cms-banner" :style="bannerStyle">
              {{ settings.content.brandingBannerText }}
            </q-banner>
            <div class="cms-preview-content-status">
              <span>{{ settings.content.statusThemeText }}</span>
              <span>{{ settings.content.statusBrandingText }}</span>
              <span>{{ settings.content.statusMenuText }}</span>
              <span>{{ settings.content.statusTopbarText }}</span>
            </div>
          </div>
        </section>
      </div>
    </CmsShellCard>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { CmsWhiteLabelSettings } from '../../../../../modules/cms/white-label/types'
import type { CmsAuthoringToolbarInfoItem } from '../CmsAuthoringToolbar.vue'
import type { CmsAuthoringMetricItem } from '../CmsAuthoringMetricsList.vue'
import type { CmsAuthoringStatusItem } from '../CmsAuthoringStatusBar.vue'
import type { CmsWorkspaceTabOption } from '../CmsWorkspaceTabs.vue'
import CmsAuthoringMetricsList from '../CmsAuthoringMetricsList.vue'
import CmsAuthoringPanelHeader from '../CmsAuthoringPanelHeader.vue'
import CmsAuthoringRulerBar from '../CmsAuthoringRulerBar.vue'
import CmsAuthoringStatusBar from '../CmsAuthoringStatusBar.vue'
import CmsAuthoringToolbar from '../CmsAuthoringToolbar.vue'
import CmsAuthoringWorkbench from '../CmsAuthoringWorkbench.vue'
import CmsMediaAssetPicker from '../CmsMediaAssetPicker.vue'
import CmsShellCard from '../CmsShellCard.vue'
import CmsWorkspaceTabs from '../CmsWorkspaceTabs.vue'

const props = defineProps<{
  settings: CmsWhiteLabelSettings
  cmsUiText: {
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
    exportLabel: string
    exportAriaLabel: string
    importLabel: string
    importAriaLabel: string
    importInputAriaLabel: string
    resetLabel: string
    resetAriaLabel: string
    autoSaveLatestLabel: string
    autoSaveCandidateLabel: string
    autoSaveRestoreLabel: string
    autoSaveDiscardLabel: string
    autoSaveStatusLabel?: string
    showAdvancedOverridesLabel: string
    settingsTabsAriaLabel: string
    themeValuesPresetTitle: string
    themeValuesPresetDescription: string
    themePresetFieldLabel: string
    detectFromCurrentValuesLabel: string
  }
  tr: (en: string, pt: string) => string
  cmsSettingsWorkspaceTabValue: string
  cmsWorkspaceTabOptions: CmsWorkspaceTabOption[]
  cmsSettingsWorkspaceView: 'editor' | 'preview'
  cmsDesignerPreviewMode: boolean
  cmsSettingsToolbarInfoItems: CmsAuthoringToolbarInfoItem[]
  canUndoCmsAuthoringHistory: boolean
  canRedoCmsAuthoringHistory: boolean
  cmsDesignerRulerMarks: number[]
  showCmsDesignerStageGrid: boolean
  cmsSettingsWorkbenchTabs: Array<{ id: string; icon: string; label: string; description: string }>
  activeSettingsTab: string
  activeTenantProfileId: string
  tenantProfileOptions: Array<{ label: string; value: string }>
  tenantProfilesState: { profiles: any[] }
  savedAtLabel: string
  selectedDomainTransfer: string
  cmsDomainTransferOptions: Array<{ label: string; value: string }>
  cmsAutosaveStatusStyle: Record<string, string>
  cmsAutosaveStatusLabel: string
  latestDraftRecoverySavedAt: string | null
  recoveryCandidateSavedAt: string | null
  canRestoreDraftRecovery: boolean
  hasDraftRecoveryEntry: boolean
  showAdvancedThemeFields: boolean
  typographyFieldGroups: readonly any[]
  layoutFieldGroups: readonly any[]
  colorFieldGroups: readonly any[]
  selectedThemePreset: string
  themePresetOptions: readonly any[]
  activeThemePresetLabel: string
  activeThemePresetDescription: string
  accentColor: string
  defaultTheme: any
  notificationChipStyles: { success: any; warning: any; error: any; info: any }
  notificationBellPreviewStyle: Record<string, string>
  notificationCounterPreviewStyle: Record<string, string>
  notificationBadgeColor: string
  notificationBadgeTextColor: string
  menuPreviewGroups: readonly any[]
  previewActiveItemId: string
  groupOptions: readonly any[]
  toolbarPreviewActions: readonly any[]
  cmsLocaleOptions: readonly any[]
  selectedAuthoredContentModelId: string
  cmsAuthoredContentModelOptions: readonly any[]
  authoredContentModelNameDraft: string
  authoredContentModelDescriptionDraft: string
  authoredContentModelDefaultPageTitleDraft: string
  authoredContentModelDefaultPageDescriptionDraft: string
  authoredContentModelDefaultPagePathPrefixDraft: string
  authoredContentModelMigrationNotesDraft: string
  authoredContentModelFieldDrafts: any[]
  selectedAuthoredContentModelFieldPresetId: string
  cmsAuthoredContentModelFieldPresetOptions: readonly any[]
  cmsContentModelFieldTypeOptions: readonly any[]
  cmsMediaKindOptions: readonly any[]
  cmsReferenceKindOptions: readonly any[]
  cmsContentModelFieldVisibilitySourceOptions: readonly any[]
  doesCmsContentModelFieldVisibilityOperatorRequireValue: Function
  pageStatusOptions: readonly any[]
  selectedAuthoredContentModelFieldPresetSettings: any
  showArchivedFieldPresets: boolean
  cmsAuthoredContentModelFieldPresetLibrary: any[]
  authoredContentModelAllowedSectionSelections: any[]
  cmsContentModelPresetOptions: any[]
  primaryActionStyle: Record<string, string>
  dangerActionStyle: Record<string, string>
  warningActionStyle: Record<string, string>
  bannerStyle: Record<string, string>
  statusChipStyle: Record<string, string>
  cmsMediaPickerUiText: {
    anyKindLabel: string
    selectedAssetsLabel: string
    selectedAssetLabel: string
    noSelectionLabel: string
    noOptionLabel: string
    incompatibleLabel: string
  }
  cmsSettingsRailMetrics: CmsAuthoringMetricItem[]
  cmsSettingsStatusItems: CmsAuthoringStatusItem[]
  activeTenantProfileName: string
  activeSettingsWorkbenchTabLabel: string
  scrollCmsDesignerSurface: Function
  createTenantProfileFromPrompt: Function
  saveNow: Function
  undoCmsAuthoringChange: Function
  redoCmsAuthoringChange: Function
  exportActiveTenantProfile: Function
  showCmsDesignerPreview: Function
  removeActiveTenantProfile: Function
  onTenantProfileChange: Function
  resetToDefaults: Function
  exportSelectedDomainSnapshot: Function
  restoreCmsDraftRecovery: Function
  discardCmsDraftRecovery: Function
  toggleCmsDesignerStageGrid: Function
  getThemeFieldPickerValue: Function
  onThemeColorInput: Function
  getThemeFieldValue: Function
  onThemeFieldInput: Function
  onThemePresetChange: Function
  detectThemePresetFromCurrent: Function
  resolveThemeTokenValue: Function
  addGroup: Function
  removeGroup: Function
  normalizeGroupId: Function
  addMenuItem: Function
  removeMenuItem: Function
  addToolbarAction: Function
  removeToolbarAction: Function
  onCmsLocaleChange: Function
  createNewAuthoredContentModelDraft: Function
  exportCmsSchemaPackage: Function
  insertSelectedAuthoredContentModelFieldPreset: Function
  addAuthoredContentModelFieldDraft: Function
  removeAuthoredContentModelFieldDraft: Function
  saveAuthoredContentModelFieldDraftAsPreset: Function
  normalizeCmsContentModelFieldVisibilityDraft: Function
  getCmsContentModelFieldVisibilityTargetOptions: Function
  getCmsContentModelFieldVisibilityOperatorOptions: Function
  getCmsContentModelFieldHtmlInputType: Function
  parseCmsRepeatableFieldValue: Function
  getCmsContentModelFieldDraftMediaOptions: Function
  getCmsMediaAllowedKindLabels: Function
  getCmsContentModelFieldDraftReferenceOptions: Function
  getCmsContentModelFieldMinConstraintLabel: Function
  getCmsContentModelFieldMaxConstraintLabel: Function
  doesCmsContentModelFieldSupportScalarConstraints: Function
  getCmsAuthoredContentModelFieldPresetNameValue: Function
  getCmsAuthoredContentModelFieldPresetDescriptionValue: Function
  getCmsReplacementLabel: Function
  isCmsArchivedEntity: Function
  isCmsDeprecatedEntity: Function
  getCmsFieldPresetReplacementOptions: Function
  updateCmsAuthoredContentModelFieldPresetReplacement: Function
  updateCmsAuthoredContentModelFieldPresetDeprecationNote: Function
  undeprecateCmsAuthoredContentModelFieldPreset: Function
  deprecateCmsAuthoredContentModelFieldPreset: Function
  unarchiveCmsAuthoredContentModelFieldPreset: Function
  archiveCmsAuthoredContentModelFieldPreset: Function
  selectCmsReplacementFieldPreset: Function
}>()

const emit = defineEmits<{
  'update:cmsSettingsWorkspaceTabValue': [value: string]
  'update:activeSettingsTab': [value: string]
  'update:selectedDomainTransfer': [value: string]
  'update:showAdvancedThemeFields': [value: boolean]
  'update:selectedAuthoredContentModelId': [value: string]
  'update:authoredContentModelNameDraft': [value: string]
  'update:authoredContentModelDescriptionDraft': [value: string]
  'update:authoredContentModelDefaultPageTitleDraft': [value: string]
  'update:authoredContentModelDefaultPageDescriptionDraft': [value: string]
  'update:authoredContentModelDefaultPagePathPrefixDraft': [value: string]
  'update:authoredContentModelMigrationNotesDraft': [value: string]
  'update:selectedAuthoredContentModelFieldPresetId': [value: string]
  'update:showArchivedFieldPresets': [value: boolean]
  'update:authoredContentModelAllowedSectionSelections': [value: any[]]
  'tenant-import-file-change': [file: File]
  'domain-import-file-change': [file: File]
  'schema-import-file-change': [file: File]
}>()

const tenantImportInputRef = ref<HTMLInputElement | null>(null)
const domainImportInputRef = ref<HTMLInputElement | null>(null)
const schemaImportInputRef = ref<HTMLInputElement | null>(null)

const activeSettingsTabModel = computed({
  get: () => props.activeSettingsTab,
  set: value => emit('update:activeSettingsTab', String(value ?? '')),
})

const selectedAuthoredContentModelIdModel = computed({
  get: () => props.selectedAuthoredContentModelId,
  set: value => emit('update:selectedAuthoredContentModelId', String(value ?? '')),
})

function openTenantImportDialog(): void {
  if (!tenantImportInputRef.value) {
    nextTick(() => tenantImportInputRef.value?.click())
    return
  }

  tenantImportInputRef.value.value = ''
  tenantImportInputRef.value.click()
}

function openDomainImportDialog(): void {
  if (!domainImportInputRef.value) {
    nextTick(() => domainImportInputRef.value?.click())
    return
  }

  domainImportInputRef.value.value = ''
  domainImportInputRef.value.click()
}

function openSchemaImportDialog(): void {
  if (!schemaImportInputRef.value) {
    nextTick(() => schemaImportInputRef.value?.click())
    return
  }

  schemaImportInputRef.value.value = ''
  schemaImportInputRef.value.click()
}

function onTenantFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement | null)?.files?.[0]
  if (file) {
    emit('tenant-import-file-change', file)
  }
}

function onDomainFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement | null)?.files?.[0]
  if (file) {
    emit('domain-import-file-change', file)
  }
}

function onSchemaFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement | null)?.files?.[0]
  if (file) {
    emit('schema-import-file-change', file)
  }
}

defineExpose({ openTenantImportDialog, openDomainImportDialog, openSchemaImportDialog })
</script>
