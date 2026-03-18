<template>
  <NtkAppShell
    v-bind="shellSnapshot.shellConfig"
    v-model:active-item="activeMenuId"
    v-model:search-value="searchQuery"
    :items="shellSnapshot.filteredItems"
    @toolbar-action="onToolbarAction"
  >
    <template #default="{ activeItem }">
      <div class="cms-shell-page" :class="cmsViewportClasses" :style="cmsStyleVars">
        <div class="cms-shell-page__workspace">
        <div class="cms-shell-page__hero">
          <h1>{{ activeItem.label }}</h1>
          <p>{{ activeItem.description || settings.content.moduleFallbackDescription }}</p>
        </div>

        <div v-if="isSettingsModule" class="cms-settings">
          <div class="cms-workspace-tabs" role="tablist" :aria-label="tr('Settings workspace tabs', 'Abas do workspace de configuracoes')">
            <button
              type="button"
              role="tab"
              class="cms-workspace-tab"
              :class="{ 'cms-workspace-tab--active': cmsSettingsWorkspaceView === 'editor' && !cmsDesignerPreviewMode }"
              :aria-selected="cmsSettingsWorkspaceView === 'editor' && !cmsDesignerPreviewMode ? 'true' : 'false'"
              @click="cmsDesignerPreviewMode = false; cmsSettingsWorkspaceView = 'editor'"
            >
              {{ tr('Editor', 'Editor') }}
            </button>
            <button
              type="button"
              role="tab"
              class="cms-workspace-tab"
              :class="{ 'cms-workspace-tab--active': cmsSettingsWorkspaceView === 'preview' || cmsDesignerPreviewMode }"
              :aria-selected="cmsSettingsWorkspaceView === 'preview' || cmsDesignerPreviewMode ? 'true' : 'false'"
              @click="cmsDesignerPreviewMode = false; showCmsDesignerPreview('settings')"
            >
              {{ tr('Preview', 'Preview') }}
            </button>
          </div>
          <q-card v-show="cmsSettingsWorkspaceView === 'editor' && !cmsDesignerPreviewMode" flat bordered class="cms-shell-card cms-designer-card cms-designer-card--settings">
            <div class="cms-shell-card__header cms-designer-card__toolbar-header">
              <div class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--actions">
                <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--icons">
                  <q-btn flat dense no-caps icon="folder_open" class="cms-designer-card__toolbar-action" :label="tr('Open', 'Abrir')" :aria-label="tr('Open settings workspace', 'Abrir workspace de configuracoes')" @click="scrollCmsDesignerSurface('.cms-designer-card--settings .cms-designer-card__workbench')" />
                  <q-btn flat dense no-caps icon="note_add" class="cms-designer-card__toolbar-action" :label="tr('New', 'Novo')" :aria-label="cmsUiText.tenantCreateAriaLabel" @click="createTenantProfileFromPrompt" />
                  <q-btn flat dense no-caps icon="save" class="cms-designer-card__toolbar-action" :label="cmsUiText.saveLabel" :aria-label="cmsUiText.saveAriaLabel" @click="saveNow" />
                  <q-btn flat dense no-caps icon="undo" class="cms-designer-card__toolbar-action" :label="tr('Undo', 'Desfazer')" :disable="!canUndoCmsAuthoringHistory" :aria-label="tr('Undo', 'Desfazer')" @click="undoCmsAuthoringChange" />
                  <q-btn flat dense no-caps icon="redo" class="cms-designer-card__toolbar-action" :label="tr('Redo', 'Refazer')" :disable="!canRedoCmsAuthoringHistory" :aria-label="tr('Redo', 'Refazer')" @click="redoCmsAuthoringChange" />
                </div>
                <div class="cms-designer-card__toolbar-spacer" />
                <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--preview">
                  <q-btn no-caps unelevated icon="visibility" :label="tr('Preview', 'Preview')" :style="primaryActionStyle" @click="showCmsDesignerPreview('settings')" />
                </div>
              </div>
              <div class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--info">
                <div class="cms-designer-card__info-strip">
                  <span class="cms-designer-card__info-item">
                    <strong>{{ activeTenantProfileName || tr('Default tenant', 'Tenant padrao') }}</strong>
                  </span>
                  <span class="cms-designer-card__info-item">
                    {{ cmsAutosaveStatusLabel }}
                  </span>
                  <span class="cms-designer-card__info-item">
                    {{ activeSettingsWorkbenchTab?.label }}
                  </span>
                </div>
              </div>
            </div>
            <div class="cms-shell-card__body cms-designer-card__body">
              <div class="cms-designer-card__ruler-shell cms-designer-card__ruler-shell--settings">
                <div class="cms-designer-card__ruler-gutter">
                  <q-btn flat dense round icon="chevron_left" :aria-label="tr('Focus workbench', 'Focar workbench')" @click="scrollCmsDesignerSurface('.cms-designer-card--settings .cms-designer-card__workbench')" />
                </div>
                <div class="cms-designer-card__ruler">
                  <span v-for="mark in cmsDesignerRulerMarks" :key="`settings-ruler-${mark}`" class="cms-designer-card__ruler-mark">
                    {{ mark }}
                  </span>
                </div>
                <div class="cms-designer-card__ruler-meta">
                  <span class="cms-designer-card__ruler-zoom">100%</span>
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="grid_4x4"
                    class="cms-designer-card__ruler-mode"
                    :label="showCmsDesignerStageGrid ? tr('Grid', 'Grade') : tr('Plain', 'Livre')"
                    @click="toggleCmsDesignerStageGrid"
                  />
                </div>
              </div>
              <div class="cms-designer-card__workbench cms-designer-card__workbench--settings">
                <aside class="cms-designer-card__sidebar cms-settings__sidebar">
                  <div class="cms-designer-card__sidebar-header">
                    <strong>{{ tr('Workbench', 'Workbench') }}</strong>
                    <small>{{ tr('White-label surfaces and CMS authoring contracts in one editing shell.', 'Superficies white-label e contratos de autoria CMS em um unico shell de edicao.') }}</small>
                  </div>
                  <div class="cms-designer-card__nav-list">
                    <button
                      v-for="tab in cmsSettingsWorkbenchTabs"
                      :key="`settings-nav-${tab.id}`"
                      type="button"
                      class="cms-designer-card__nav-button"
                      :class="{ 'cms-designer-card__nav-button--active': activeSettingsTab === tab.id }"
                      @click="activeSettingsTab = tab.id"
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
                :options="tenantProfileOptions"
                :label="cmsUiText.tenantProfileFieldLabel"
                :aria-label="cmsUiText.tenantProfileSelectorAriaLabel"
                class="cms-toolbar-card__select"
                @update:model-value="onTenantProfileChange"
              />
              <div class="cms-toolbar-card__actions">
                <q-btn flat dense no-caps icon="add" :label="cmsUiText.tenantCreateLabel" :aria-label="cmsUiText.tenantCreateAriaLabel" @click="createTenantProfileFromPrompt" />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="delete"
                  :label="cmsUiText.tenantDeleteLabel"
                  :aria-label="cmsUiText.tenantDeleteAriaLabel"
                  :disable="tenantProfilesState.profiles.length <= 1"
                  :style="dangerActionStyle"
                  @click="removeActiveTenantProfile"
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
                <q-btn flat no-caps icon="restart_alt" :label="cmsUiText.resetLabel" :aria-label="cmsUiText.resetAriaLabel" :style="dangerActionStyle" @click="resetToDefaults" />
              </div>
              <q-separator vertical inset class="cms-toolbar-card__separator" />
              <div class="cms-toolbar-card__actions">
                <q-btn flat dense no-caps icon="download" :label="cmsUiText.exportLabel" :aria-label="cmsUiText.exportAriaLabel" @click="exportActiveTenantProfile" />
                <q-btn flat dense no-caps icon="upload_file" :label="cmsUiText.importLabel" :aria-label="cmsUiText.importAriaLabel" @click="openTenantImportDialog" />
              </div>
              <q-separator vertical inset class="cms-toolbar-card__separator" />
              <div class="cms-toolbar-card__domain-transfer">
                <q-select
                  v-model="selectedDomainTransfer"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsDomainTransferOptions"
                  :label="tr('Domain package', 'Pacote de dominio')"
                  :aria-label="tr('Domain package selector', 'Seletor de pacote de dominio')"
                  class="cms-toolbar-card__domain-select"
                />
                <div class="cms-toolbar-card__actions">
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="file_download"
                    :label="tr('Export package', 'Exportar pacote')"
                    :aria-label="tr('Export selected domain package', 'Exportar pacote do dominio selecionado')"
                    @click="exportSelectedDomainSnapshot"
                  />
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="file_upload"
                    :label="tr('Import package', 'Importar pacote')"
                    :aria-label="tr('Import selected domain package', 'Importar pacote do dominio selecionado')"
                    @click="openDomainImportDialog"
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
                    @click="restoreCmsDraftRecovery"
                  />
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="delete_sweep"
                    :label="cmsUiText.autoSaveDiscardLabel"
                    :disable="!hasDraftRecoveryEntry"
                    @click="discardCmsDraftRecovery"
                  />
                </div>
              </div>
              <p class="cms-config-caption cms-toolbar-card__hint">
                {{
                  tr(
                    'Primary actions stay in the top editor bar so the workspace keeps one clear command row.',
                    'As acoes primarias ficam na barra superior para o workspace manter uma linha clara de comando.'
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
            @change="onTenantImportFileChange"
          >
          <input
            ref="domainImportInputRef"
            type="file"
            accept="application/json,.json"
            :aria-label="tr('Import domain JSON file', 'Importar arquivo JSON do dominio')"
            class="cms-file-input"
            @change="onDomainImportFileChange"
          >
          <input
            ref="schemaImportInputRef"
            type="file"
            accept="application/json,.json"
            :aria-label="tr('Import schema JSON file', 'Importar arquivo JSON do schema')"
            class="cms-file-input"
            @change="onSchemaImportFileChange"
          >
          </div>

          <!-- ── Editor Card ──────────────────────────────────────── -->
          <div class="cms-settings__editor">
          <q-tabs v-model="activeSettingsTab" dense inline-label class="cms-settings__tabs" :aria-label="cmsUiText.settingsTabsAriaLabel">
            <q-tab name="branding" icon="branding_watermark" :label="settings.content.tabBrandingLabel" :aria-label="settings.content.tabBrandingLabel" />
            <q-tab name="typography" icon="text_fields" :label="settings.content.tabTypographyLabel" :aria-label="settings.content.tabTypographyLabel" />
            <q-tab name="layout" icon="dashboard_customize" :label="settings.content.tabLayoutLabel" :aria-label="settings.content.tabLayoutLabel" />
            <q-tab name="colors" icon="palette" :label="settings.content.tabColorsLabel" :aria-label="settings.content.tabColorsLabel" />
            <q-tab name="menu" icon="menu" :label="settings.content.tabMenuLabel" :aria-label="settings.content.tabMenuLabel" />
            <q-tab name="topbar" icon="web_asset" :label="settings.content.tabTopbarLabel" :aria-label="settings.content.tabTopbarLabel" />
            <q-tab name="content" icon="edit_note" :label="settings.content.tabContentLabel" :aria-label="settings.content.tabContentLabel" />
          </q-tabs>
          <div class="cms-settings__advanced-toggle">
            <q-toggle v-model="showAdvancedThemeFields" dense :label="cmsUiText.showAdvancedOverridesLabel" />
          </div>

          <q-tab-panels v-model="activeSettingsTab" animated class="cms-settings__panels">
            <q-tab-panel name="branding">
              <div class="cms-config-section">
                <div class="cms-config-section__form">
                  <div class="cms-form-grid">
                    <q-input v-model="settings.branding.appName" outlined dense :label="tr('Product name', 'Nome do produto')" />
                    <q-input v-model="settings.branding.appSubtitle" outlined dense :label="tr('Product subtitle', 'Subtitulo do produto')" />
                    <q-input v-model="settings.branding.brandLogo" outlined dense :label="tr('Logo URL', 'URL do logo')" />
                    <q-input v-model="settings.branding.brandLogoAlt" outlined dense :label="tr('Logo alt text', 'Texto alternativo do logo')" />
                    <q-input v-model="settings.branding.faviconUrl" outlined dense :label="tr('Favicon URL', 'URL do favicon')" />
                    <q-input v-model="settings.branding.userAvatar" outlined dense :label="tr('User avatar URL', 'URL do avatar do usuario')" />
                    <q-input v-model="settings.branding.userTooltip" outlined dense :label="tr('User tooltip', 'Tooltip do usuario')" />
                    <q-input v-model="settings.branding.notificationsTooltip" outlined dense :label="tr('Notifications tooltip', 'Tooltip de notificacoes')" />
                    <q-input v-model.number="settings.branding.notificationCount" outlined dense type="number" min="0" :label="tr('Notification count', 'Quantidade de notificacoes')" />
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
                          <q-tooltip v-if="settings.branding.notificationsTooltip">{{ settings.branding.notificationsTooltip }}</q-tooltip>
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
                        <div class="cms-preview-typography__title">{{ tr('Shell heading and context text', 'Titulo do shell e texto de contexto') }}</div>
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
                        <small>{{ tr('Spacing, radius and transition tokens on shell widgets.', 'Tokens de espaco, borda e transicao em widgets do shell.') }}</small>
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
                        <small class="cms-preview-layout__hint">{{ tr('Move mouse over cards/items to validate transition token.', 'Passe o mouse sobre os cards/itens para validar o token de transicao.') }}</small>
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
                      :options="themePresetOptions"
                      :label="cmsUiText.themePresetFieldLabel"
                      @update:model-value="onThemePresetChange"
                    />
                    <q-btn flat dense no-caps icon="sync" :label="cmsUiText.detectFromCurrentValuesLabel" @click="detectThemePresetFromCurrent" />
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
                        <span>{{ tr('Page', 'Pagina') }}: <code>{{ settings.theme.pageBackground || defaultTheme.pageBackground }}</code></span>
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
                          <p>{{ tr('This card uses the same base tokens as the shell page and CMS cards.', 'Este card usa os mesmos tokens base da pagina shell e dos cards CMS.') }}</p>
                          <q-chip dense square class="cms-preview-chip">{{ settings.content.statusChipLabel }}</q-chip>
                        </div>
                      </template>

                      <template v-else-if="group.id === 'navigation'">
                        <div class="cms-example-section__header">
                          <strong>{{ tr('Navigation example', 'Exemplo de navegacao') }}</strong>
                          <small>{{ tr('Sidebar text, icon, caption and active states.', 'Texto, icone, legenda e estados ativos da barra lateral.') }}</small>
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
                            <span>{{ tr('Settings', 'Configuracoes') }}</span>
                          </div>
                          <div class="cms-preview-nav-mini-caption">CO</div>
                        </div>
                      </template>

                      <template v-else-if="group.id === 'header'">
                        <div class="cms-example-section__header">
                          <strong>{{ tr('Header and search example', 'Exemplo de cabecalho e busca') }}</strong>
                          <small>{{ tr('Topbar title, search, icon colors and notification badge.', 'Titulo da topbar, busca, cores de icones e badge de notificacao.') }}</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--header">
                          <div class="cms-preview-header">
                            <div class="cms-preview-header__left">
                              <q-icon :name="settings.layout.menuIcon" class="cms-icon cms-icon--md cms-preview-header__menu-icon" />
                              <strong class="cms-preview-header__title-app">{{ settings.branding.appName }}</strong>
                              <q-icon name="chevron_right" class="cms-icon cms-icon--sm cms-preview-header__separator" />
                              <span class="cms-preview-header__title-text">{{ tr('Settings', 'Configuracoes') }}</span>
                            </div>
                            <div class="cms-preview-header__search">
                              <q-icon name="search" class="cms-icon cms-icon--sm cms-preview-header__search-icon" />
                              <span>{{ settings.layout.searchPlaceholder }}</span>
                            </div>
                            <div class="cms-preview-header__actions">
                              <button v-if="settings.layout.showNotifications" type="button" class="cms-preview-header__action" :aria-label="tr('Notifications action preview', 'Preview da acao de notificacoes')">
                                <q-icon name="notifications" class="cms-icon cms-icon--sm" />
                                <span class="cms-preview-header__badge">{{ settings.branding.notificationCount || 2 }}</span>
                              </button>
                              <button v-if="settings.layout.showUserAvatar" type="button" class="cms-preview-header__action" :aria-label="tr('Account action preview', 'Preview da acao de conta')">
                                <q-icon name="account_circle" class="cms-icon cms-icon--sm" />
                              </button>
                              <button type="button" class="cms-preview-header__action" :aria-label="tr('Home action preview', 'Preview da acao home')">
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
                          <strong>{{ tr('Notifications example', 'Exemplo de notificacoes') }}</strong>
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
                          <small>{{ tr('Primary/secondary sections, dark shell and syntax colors used on public landing.', 'Secoes primaria/secundaria, shell escuro e cores de sintaxe usadas na landing publica.') }}</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--landing">
                          <div class="cms-preview-landing__swatches">
                            <span
                              class="cms-preview-landing__swatch"
                              :style="{ background: resolveThemeTokenValue('landingSectionBgPrimary') }"
                            >
                              {{ tr('Section primary', 'Secao primaria') }}
                            </span>
                            <span
                              class="cms-preview-landing__swatch"
                              :style="{ background: resolveThemeTokenValue('landingSectionBgSecondary') }"
                            >
                              {{ tr('Section secondary', 'Secao secundaria') }}
                            </span>
                            <span
                              class="cms-preview-landing__swatch cms-preview-landing__swatch--dark"
                              :style="{ background: resolveThemeTokenValue('landingSectionBgDark'), color: resolveThemeTokenValue('landingSharedDarkText') }"
                            >
                              {{ tr('Section dark', 'Secao escura') }}
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

              <q-banner rounded class="cms-banner" :style="bannerStyle">
                {{ settings.content.colorsBannerText }}
              </q-banner>
            </q-tab-panel>

            <q-tab-panel name="menu">
              <div class="cms-config-section">
                <div class="cms-config-section__form">
                  <div class="cms-section-header">
                    <strong>{{ tr('Groups', 'Grupos') }}</strong>
                    <q-btn flat dense no-caps icon="add" :label="tr('Add group', 'Adicionar grupo')" @click="addGroup" />
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
                    <q-btn flat dense no-caps icon="add" :label="tr('Add item', 'Adicionar item')" @click="addMenuItem" />
                  </div>
                  <div class="cms-list">
                    <div v-for="(item, index) in settings.items" :key="item.id" class="cms-list-item cms-list-item--menu">
                      <q-input v-model="item.id" outlined dense :label="tr('Item ID', 'ID do item')" />
                      <q-input v-model="item.label" outlined dense :label="tr('Label', 'Label')" />
                      <q-input v-model="item.icon" outlined dense :label="tr('Icon', 'Icone')" />
                      <q-select
                        v-model="item.group"
                        outlined
                        dense
                        emit-value
                        map-options
                        :options="groupOptions"
                        :label="tr('Group', 'Grupo')"
                      />
                      <q-input v-model="item.caption" outlined dense :label="tr('Caption', 'Legenda')" />
                      <q-input v-model="item.description" outlined dense :label="tr('Description', 'Descricao')" />
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
                    <q-input v-model="settings.layout.menuIcon" outlined dense :label="tr('Menu icon', 'Icone do menu')" />
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
                    <q-toggle v-model="settings.layout.showNotifications" :label="tr('Show notifications', 'Mostrar notificacoes')" />
                    <q-toggle v-model="settings.layout.showUserAvatar" :label="tr('Show account action', 'Mostrar acao de conta')" />
                    <q-toggle v-model="settings.layout.showGroupCaptions" :label="tr('Show group captions', 'Mostrar legendas de grupo')" />
                    <q-toggle v-model="settings.layout.collapsible" :label="tr('Allow sidebar collapse', 'Permitir comprimir menu lateral')" />
                    <q-toggle v-model="settings.layout.defaultDrawerOpen" :label="tr('Drawer open by default', 'Menu lateral aberto por padrao')" />
                    <q-toggle v-model="settings.layout.defaultMini" :label="tr('Mini mode by default', 'Modo mini por padrao')" />
                  </div>

                  <q-separator class="q-my-md" />

                  <div class="cms-section-header">
                    <strong>{{ tr('Topbar actions', 'Acoes da topbar') }}</strong>
                    <q-btn flat dense no-caps icon="add" :label="tr('Add action', 'Adicionar acao')" @click="addToolbarAction" />
                  </div>
                  <div class="cms-list">
                    <div v-for="(action, index) in settings.toolbarActions" :key="action.id" class="cms-list-item cms-list-item--toolbar">
                      <q-input v-model="action.id" outlined dense :label="tr('Action ID', 'ID da acao')" />
                      <q-input v-model="action.icon" outlined dense :label="tr('Icon', 'Icone')" />
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
                      <q-toggle v-model="action.unelevated" :label="tr('Unelevated', 'Sem elevacao')" />
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
                      <small>{{ tr('Header height, search visibility and actions rendered together.', 'Altura do cabecalho, visibilidade da busca e acoes renderizadas em conjunto.') }}</small>
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
                      :options="cmsLocaleOptions"
                      :label="tr('Language', 'Idioma')"
                      @update:model-value="onCmsLocaleChange"
                    />
                    <q-btn
                      flat
                      no-caps
                      icon="translate"
                      :label="tr('Apply locale preset', 'Aplicar preset de idioma')"
                      @click="onCmsLocaleChange(settings.content.locale)"
                    />
                    <q-input v-model="settings.content.moduleFallbackDescription" outlined dense type="textarea" autogrow :label="tr('Module fallback description', 'Descricao fallback do modulo')" />
                    <q-input v-model="settings.content.brandingBannerText" outlined dense type="textarea" autogrow :label="tr('Branding banner text', 'Texto do banner de branding')" />
                    <q-input v-model="settings.content.colorsBannerText" outlined dense type="textarea" autogrow :label="tr('Colors banner text', 'Texto do banner de cores')" />
                    <q-input v-model="settings.content.statusTitle" outlined dense :label="tr('Status card title', 'Titulo do card de status')" />
                    <q-input v-model="settings.content.statusChipLabel" outlined dense :label="tr('Status chip label', 'Label do chip de status')" />
                    <q-input v-model="settings.content.statusThemeText" outlined dense :label="tr('Status: theme line', 'Status: linha de tema')" />
                    <q-input v-model="settings.content.statusBrandingText" outlined dense :label="tr('Status: branding line', 'Status: linha de branding')" />
                    <q-input v-model="settings.content.statusMenuText" outlined dense :label="tr('Status: menu line', 'Status: linha de menu')" />
                    <q-input v-model="settings.content.statusTopbarText" outlined dense :label="tr('Status: topbar line', 'Status: linha de topbar')" />
                    <q-input v-model="settings.content.howToTitle" outlined dense :label="tr('How-to title', 'Titulo de como usar')" />
                    <q-input v-model="settings.content.howToBody" outlined dense type="textarea" autogrow :label="tr('How-to body', 'Texto de como usar')" />
                    <q-input v-model="settings.content.howToNextStep" outlined dense type="textarea" autogrow :label="tr('How-to next step', 'Proximo passo de como usar')" />
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
                    <q-input v-model="settings.content.tabContentLabel" outlined dense :label="tr('Tab: content label', 'Aba: label de conteudo')" />
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
                      v-model="selectedAuthoredContentModelId"
                      outlined
                      dense
                      emit-value
                      map-options
                      :options="cmsAuthoredContentModelOptions"
                      :label="tr('Content model library', 'Biblioteca de modelos de conteudo')"
                    />
                    <q-btn
                      flat
                      no-caps
                      icon="add_box"
                      :label="tr('New content model', 'Novo modelo de conteudo')"
                      @click="createNewAuthoredContentModelDraft"
                    />
                    <q-btn
                      flat
                      no-caps
                      icon="file_download"
                      :label="tr('Export schema package', 'Exportar pacote de schema')"
                      @click="exportCmsSchemaPackage"
                    />
                    <q-btn
                      flat
                      no-caps
                      icon="file_upload"
                      :label="tr('Import schema package', 'Importar pacote de schema')"
                      @click="openSchemaImportDialog"
                    />
                    <q-input
                      v-model="authoredContentModelNameDraft"
                      outlined
                      dense
                      :label="tr('Content model name', 'Nome do modelo de conteudo')"
                    />
                    <q-input
                      v-model="authoredContentModelDescriptionDraft"
                      outlined
                      dense
                      type="textarea"
                      autogrow
                      :label="tr('Content model description', 'Descricao do modelo de conteudo')"
                    />
                    <q-input
                      v-model="authoredContentModelDefaultPageTitleDraft"
                      outlined
                      dense
                      :label="tr('Default page title', 'Titulo padrao da pagina')"
                    />
                    <q-input
                      v-model="authoredContentModelDefaultPageDescriptionDraft"
                      outlined
                      dense
                      type="textarea"
                      autogrow
                      :label="tr('Default page description', 'Descricao padrao da pagina')"
                    />
                    <q-input
                      v-model="authoredContentModelDefaultPagePathPrefixDraft"
                      outlined
                      dense
                      :label="tr('Default page path prefix', 'Prefixo padrao do caminho da pagina')"
                      :hint="tr('Example: /campaign', 'Exemplo: /campanha')"
                    />
                    <q-input
                      v-model="authoredContentModelMigrationNotesDraft"
                      outlined
                      dense
                      type="textarea"
                      autogrow
                      :label="tr('Migration notes', 'Notas de migracao')"
                      :hint="tr('Explain what changed when the schema version advances.', 'Explique o que mudou quando a versao do schema avanca.')"
                    />
                    <div class="cms-form-grid__full cms-content-model-fields">
                      <div class="cms-content-model-fields__header">
                        <strong>{{ tr('Schema fields', 'Campos do schema') }}</strong>
                        <div class="cms-content-model-fields__header-actions">
                          <q-select
                            v-model="selectedAuthoredContentModelFieldPresetId"
                            outlined
                            dense
                            emit-value
                            map-options
                            :options="cmsAuthoredContentModelFieldPresetOptions"
                            :label="tr('Field preset library', 'Biblioteca de presets de campo')"
                            class="cms-content-model-fields__preset-select"
                          />
                          <q-btn
                            flat
                            dense
                            no-caps
                            icon="file_download"
                            :label="tr('Insert preset', 'Inserir preset')"
                            :disable="!selectedAuthoredContentModelFieldPresetSettings"
                            @click="insertSelectedAuthoredContentModelFieldPreset"
                          />
                          <q-btn
                            flat
                            dense
                            no-caps
                            icon="playlist_add"
                            :label="tr('Add field', 'Adicionar campo')"
                            @click="addAuthoredContentModelFieldDraft"
                          />
                        </div>
                      </div>
                      <p class="cms-content-model-fields__description">
                        {{
                          tr(
                            'Define page-level structured fields rendered in the Pages builder.',
                            'Defina campos estruturados em nivel de pagina que serao renderizados no builder de Pages.'
                          )
                        }}
                      </p>
                      <div
                        v-if="authoredContentModelFieldDrafts.length === 0"
                        class="cms-content-model-fields__empty"
                      >
                        {{ tr('No schema fields yet.', 'Ainda nao ha campos de schema.') }}
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
                            :label="tr('Field description', 'Descricao do campo')"
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
                            :label="tr('Default JSON value', 'Valor JSON padrao')"
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
                            :label="field.repeatable ? tr('Default values (one per line)', 'Valores padrao (um por linha)') : tr('Default value', 'Valor padrao')"
                          />
                          <CmsMediaAssetPicker
                            v-else-if="field.type === 'media-asset'"
                            :model-value="field.repeatable ? parseCmsRepeatableFieldValue(field.defaultValue) : field.defaultValue"
                            :multiple="field.repeatable"
                            :options="getCmsContentModelFieldDraftMediaOptions(field)"
                            :label="field.repeatable ? tr('Default assets', 'Assets padrao') : tr('Default asset', 'Asset padrao')"
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
                            :options="getCmsContentModelFieldDraftReferenceOptions(field)"
                            :label="field.repeatable ? tr('Default references', 'Referencias padrao') : tr('Default reference', 'Referencia padrao')"
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
                            :label="tr('PT-BR description', 'Descricao PT-BR')"
                            :hint="tr('Leave blank to inherit the EN/base description.', 'Deixe em branco para herdar a descricao EN/base.')"
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
                            :options="cmsReferenceKindOptions"
                            :label="tr('Allowed reference kinds', 'Tipos de referencia permitidos')"
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
                            :options="getCmsContentModelFieldVisibilityOperatorOptions(field.visibilitySource)"
                            :label="tr('Condition', 'Condicao')"
                            @update:model-value="normalizeCmsContentModelFieldVisibilityDraft(fieldIndex)"
                          />
                          <q-select
                            v-if="field.visibilityEnabled && field.visibilitySource === 'page-status' && doesCmsContentModelFieldVisibilityOperatorRequireValue(field.visibilityOperator)"
                            v-model="field.visibilityValue"
                            outlined
                            dense
                            emit-value
                            map-options
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
                            :label="tr('Default toggle value', 'Valor padrao do toggle')"
                          />
                          <q-toggle
                            v-if="field.type === 'toggle' && !field.repeatable"
                            :model-value="field.defaultValue === 'true'"
                            :label="tr('Enabled by default', 'Habilitado por padrao')"
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
                            :label="tr('Options (one per line)', 'Opcoes (uma por linha)')"
                          />
                        </div>
                      </div>
                      <div class="cms-blocks-library">
                        <div class="cms-blocks-library__header">
                          <strong>{{ tr('Field preset library', 'Biblioteca de presets de campo') }}</strong>
                          <div class="cms-blocks-library__header-actions">
                            <q-toggle
                              v-model="showArchivedFieldPresets"
                              dense
                              :label="tr('Show archived', 'Mostrar arquivados')"
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
                                'Salve um campo do schema como preset para reutilizar o mesmo contrato em outros modelos de conteudo.'
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
                                `${preset.field.id} · ${preset.field.repeatable ? tr('Repeatable', 'Multiplo') : tr('Single value', 'Valor unico')}`
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
                              :options="getCmsFieldPresetReplacementOptions(preset)"
                              :label="tr('Replacement preset', 'Preset substituto')"
                              @update:model-value="updateCmsAuthoredContentModelFieldPresetReplacement(preset.id, $event)"
                            />
                            <q-input
                              v-if="isCmsDeprecatedEntity(preset)"
                              :model-value="preset.deprecationNote ?? ''"
                              outlined
                              dense
                              :label="tr('Deprecation note', 'Nota de descontinuacao')"
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
                              @click="selectedAuthoredContentModelFieldPresetId = preset.id"
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
                    </div>
                    <q-select
                      v-model="authoredContentModelAllowedSectionSelections"
                      outlined
                      dense
                      emit-value
                      map-options
                      multiple
                      use-chips
                      :options="cmsContentModelPresetOptions"
                      :label="tr('Allowed section presets', 'Presets de secao permitidos')"
                    />
                    <div class="cms-form-grid__inline-actions">
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="clear_all"
                        :label="tr('Clear allowed presets', 'Limpar presets permitidos')"
                        @click="clearAuthoredContentModelAllowedPresets"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="select_all"
                        :label="tr('Select all presets', 'Selecionar todos os presets')"
                        @click="selectAllAuthoredContentModelAllowedPresets"
                      />
                    </div>
                    <div class="cms-preset-toggle-grid">
                      <q-btn
                        v-for="option in cmsContentModelPresetOptions"
                        :key="option.value"
                        dense
                        no-caps
                        :flat="!isAuthoredContentModelAllowedPresetSelected(option.value)"
                        :unelevated="isAuthoredContentModelAllowedPresetSelected(option.value)"
                        :label="option.label"
                        :style="isAuthoredContentModelAllowedPresetSelected(option.value) ? primaryActionStyle : undefined"
                        class="cms-preset-toggle-grid__button"
                        @click="toggleAuthoredContentModelAllowedPreset(option.value)"
                      />
                    </div>
                    <q-select
                      v-model="authoredContentModelRequiredSectionSelections"
                      outlined
                      dense
                      emit-value
                      map-options
                      multiple
                      use-chips
                      :options="cmsContentModelRequiredPresetOptions"
                      :label="tr('Required presets', 'Presets obrigatorios')"
                    />
                    <q-select
                      v-model="authoredContentModelStarterSectionSelections"
                      outlined
                      dense
                      emit-value
                      map-options
                      multiple
                      use-chips
                      :options="cmsContentModelStarterPresetOptions"
                      :label="tr('Starter page scaffold', 'Scaffold inicial da pagina')"
                    />
                    <q-select
                      v-model="authoredContentModelRecommendedSectionSelections"
                      outlined
                      dense
                      emit-value
                      map-options
                      multiple
                      use-chips
                      :options="cmsContentModelRecommendedPresetOptions"
                      :label="tr('Recommended presets', 'Presets recomendados')"
                    />
                    <q-input
                      v-model="authoredContentModelMaxSectionsDraft"
                      outlined
                      dense
                      type="number"
                      min="1"
                      :label="tr('Maximum enabled sections', 'Maximo de secoes habilitadas')"
                      :hint="tr('Leave blank for unlimited sections.', 'Deixe em branco para permitir secoes ilimitadas.')"
                    />
                    <div class="cms-preset-limit-grid">
                      <q-input
                        v-for="option in cmsContentModelPresetLimitOptions"
                        :key="`content-model-limit-${option.value}`"
                        :model-value="getAuthoredContentModelPresetLimitDraft(option.value)"
                        outlined
                        dense
                        type="number"
                        min="1"
                        :label="`${option.label} ${tr('max instances', 'maximo de instancias')}`"
                        :hint="tr('Leave blank for unlimited repetitions.', 'Deixe em branco para repeticoes ilimitadas.')"
                        @update:model-value="updateAuthoredContentModelPresetLimitDraft(option.value, $event)"
                      />
                    </div>
                    <q-btn
                      no-caps
                      unelevated
                      icon="save"
                      :label="tr('Save content model', 'Salvar modelo de conteudo')"
                      :style="primaryActionStyle"
                      @click="saveCmsAuthoredContentModelDraft"
                    />
                    <q-btn
                      flat
                      no-caps
                      icon="travel_explore"
                      :label="tr('Inspect usage', 'Inspecionar uso')"
                      :disable="!selectedAuthoredContentModel"
                      @click="selectedAuthoredContentModel && openCmsUsageDrawer(
                        'content-model',
                        selectedAuthoredContentModel.id,
                        authoredContentModelNameDraft || selectedAuthoredContentModel.name,
                        authoredContentModelDescriptionDraft || selectedAuthoredContentModel.description
                      )"
                    />
                    <q-btn
                      flat
                      no-caps
                      icon="delete"
                      :label="tr('Delete content model', 'Excluir modelo de conteudo')"
                      :style="dangerActionStyle"
                      :disable="!selectedAuthoredContentModel || getCmsAuthoredContentModelUsageCount(selectedAuthoredContentModel.id) > 0"
                      @click="removeSelectedCmsAuthoredContentModel"
                    />
                  </div>
                </div>

                <div class="cms-config-section__example">
                  <div class="cms-example-section cms-example-section--inline">
                    <div class="cms-example-section__header">
                      <strong>{{ tr('Content model example', 'Exemplo de modelo de conteudo') }}</strong>
                      <small>{{ tr('Preview of authored metadata plus allowed, required and recommended section presets.', 'Preview dos metadados authored com presets de secao permitidos, obrigatorios e recomendados.') }}</small>
                    </div>
                    <div class="cms-preview-card cms-preview-card--content">
                      <div class="cms-blocks-library__header">
                        <strong>{{ authoredContentModelNameDraft || tr('Untitled content model', 'Modelo de conteudo sem titulo') }}</strong>
                        <q-chip dense square :style="statusChipStyle">
                          {{ selectedAuthoredContentModel ? getCmsAuthoredContentModelUsageCount(selectedAuthoredContentModel.id) : 0 }}
                          {{ tr('uses', 'usos') }}
                        </q-chip>
                      </div>
                      <p class="cms-preview-content-text">
                        {{
                          authoredContentModelDescriptionDraft
                          || tr('Use authored content models to constrain page composition and simplify authoring.', 'Use modelos de conteudo authored para restringir a composicao das paginas e simplificar a autoria.')
                        }}
                      </p>
                      <small class="cms-preview-content-text">
                        {{
                          selectedAuthoredContentModel
                            ? getCmsAuthoredContentModelUsageSummaryLabel(selectedAuthoredContentModel.id)
                            : tr('No engine usage detected', 'Nenhum uso no engine detectado')
                        }}
                      </small>
                      <div class="cms-preview-content-tabs">
                        <q-chip
                          v-for="presetId in authoredContentModelAllowedSectionSelections"
                          :key="`content-model-allowed-${presetId}`"
                          dense
                          square
                          :style="statusChipStyle"
                        >
                          {{ getCmsSectionPresetLabel(presetId) }}
                        </q-chip>
                      </div>
                      <div class="cms-preview-content-tabs">
                        <q-chip
                          v-for="field in authoredContentModelFieldDrafts"
                          :key="`content-model-field-preview-${field.id || field.label || 'draft'}`"
                          dense
                          square
                        >
                          {{
                            `${getCmsContentModelFieldDraftPreviewLabel(field) || tr('Untitled field', 'Campo sem titulo')} · ${getCmsContentModelFieldDraftPreviewGroup(field) || tr('General', 'Geral')} · #${field.orderValue || '1'} · ${field.type}${field.repeatable ? '[]' : ''}`
                          }}
                        </q-chip>
                      </div>
                      <div class="cms-preview-content-status">
                        <span>
                          {{ tr('Starter scaffold', 'Scaffold inicial') }}:
                          {{
                            authoredContentModelStarterSectionSelections.length > 0
                              ? authoredContentModelStarterSectionSelections.map(getCmsSectionPresetLabel).join(', ')
                              : tr('None selected', 'Nenhum selecionado')
                          }}
                        </span>
                        <span>
                          {{ tr('Required presets', 'Presets obrigatorios') }}:
                          {{
                            authoredContentModelRequiredSectionSelections.length > 0
                              ? authoredContentModelRequiredSectionSelections.map(getCmsSectionPresetLabel).join(', ')
                              : tr('None selected', 'Nenhum selecionado')
                          }}
                        </span>
                        <span>
                          {{ tr('Recommended presets', 'Presets recomendados') }}:
                          {{
                            authoredContentModelRecommendedSectionSelections.length > 0
                              ? authoredContentModelRecommendedSectionSelections.map(getCmsSectionPresetLabel).join(', ')
                              : tr('None selected', 'Nenhum selecionado')
                          }}
                        </span>
                        <span>
                          {{ tr('Maximum enabled sections', 'Maximo de secoes habilitadas') }}:
                          {{ authoredContentModelMaxSectionsDraft.trim().length > 0 ? authoredContentModelMaxSectionsDraft : tr('Unlimited', 'Ilimitado') }}
                        </span>
                        <span>
                          {{ tr('Preset limits', 'Limites por preset') }}:
                          {{ getAuthoredContentModelPresetLimitSummary() }}
                        </span>
                        <span>
                          {{ tr('Default page title', 'Titulo padrao da pagina') }}:
                          {{ authoredContentModelDefaultPageTitleDraft.trim().length > 0 ? authoredContentModelDefaultPageTitleDraft : tr('Uses model name', 'Usa o nome do modelo') }}
                        </span>
                        <span>
                          {{ tr('Default page description', 'Descricao padrao da pagina') }}:
                          {{ authoredContentModelDefaultPageDescriptionDraft.trim().length > 0 ? authoredContentModelDefaultPageDescriptionDraft : tr('Empty', 'Vazia') }}
                        </span>
                        <span>
                          {{ tr('Default page path prefix', 'Prefixo padrao do caminho da pagina') }}:
                          {{ authoredContentModelDefaultPagePathPrefixDraft.trim().length > 0 ? authoredContentModelDefaultPagePathPrefixDraft : tr('Auto', 'Automatico') }}
                        </span>
                        <span>
                          {{ tr('Schema version', 'Versao do schema') }}:
                          {{ selectedAuthoredContentModel ? (selectedAuthoredContentModel.schemaVersion ?? 1) : 1 }}
                        </span>
                        <span>
                          {{ tr('Last schema change', 'Ultima mudanca de schema') }}:
                          {{
                            selectedAuthoredContentModel
                              && getCmsContentModelLastSchemaChangeAt(selectedAuthoredContentModel.id, settings.authoredContentModels)
                              ? new Date(getCmsContentModelLastSchemaChangeAt(selectedAuthoredContentModel.id, settings.authoredContentModels) ?? '').toLocaleString()
                              : tr('Not versioned yet', 'Ainda nao versionado')
                          }}
                        </span>
                        <span>
                          {{ tr('Migration notes', 'Notas de migracao') }}:
                          {{ authoredContentModelMigrationNotesDraft.trim().length > 0 ? authoredContentModelMigrationNotesDraft : tr('None', 'Nenhuma') }}
                        </span>
                        <span>
                          {{ tr('Allowed presets', 'Presets permitidos') }}:
                          {{ authoredContentModelAllowedSectionSelections.length }}
                        </span>
                        <span>
                          {{ tr('Schema fields', 'Campos do schema') }}:
                          {{ authoredContentModelFieldDrafts.length }}
                        </span>
                        <span>
                          {{ tr('Schema fields', 'Campos do schema') }}:
                          {{ authoredContentModelFieldDrafts.length }}
                        </span>
                        <span>
                          {{ tr('Library size', 'Tamanho da biblioteca') }}:
                          {{ cmsAuthoredContentModelLibrary.length }}
                        </span>
                        <span>
                          {{ tr('Source', 'Origem') }}:
                          {{ selectedAuthoredContentModel ? tr('Authored model', 'Modelo authored') : tr('New draft', 'Novo rascunho') }}
                        </span>
                      </div>
                      <q-banner rounded class="cms-banner" :style="bannerStyle">
                        {{
                          selectedAuthoredContentModel
                            ? (
                              getCmsContentModelMigrationNotes(settings.content.locale, selectedAuthoredContentModel.id, settings.authoredContentModels)
                              || getCmsContentModelDescription(settings.content.locale, selectedAuthoredContentModel.id, settings.authoredContentModels)
                            )
                            : tr('Save the draft to make it available in the Pages builder content model selector.', 'Salve o rascunho para disponibiliza-lo no seletor de modelos de conteudo do builder de paginas.')
                        }}
                      </q-banner>
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
                    <strong>{{ tr('Designer rail', 'Rail do designer') }}</strong>
                    <small>{{ tr('Context and recovery stay pinned while you edit without duplicating the top action bar.', 'Contexto e recovery ficam fixos durante a edicao sem duplicar a barra superior.') }}</small>
                    <div class="cms-designer-card__metrics">
                      <span>{{ tr('Locale', 'Locale') }}: <strong>{{ settings.content.locale }}</strong></span>
                      <span>{{ tr('Advanced fields', 'Campos avancados') }}: <strong>{{ showAdvancedThemeFields ? tr('Visible', 'Visiveis') : tr('Hidden', 'Ocultos') }}</strong></span>
                    </div>
                  </div>
                  <div class="cms-designer-card__rail-actions">
                    <q-btn round flat icon="restore" :disable="!canRestoreDraftRecovery" :aria-label="cmsUiText.autoSaveRestoreLabel" @click="restoreCmsDraftRecovery">
                      <q-tooltip>{{ cmsUiText.autoSaveRestoreLabel }}</q-tooltip>
                    </q-btn>
                    <q-btn round flat icon="delete_sweep" :disable="!hasDraftRecoveryEntry" :aria-label="cmsUiText.autoSaveDiscardLabel" @click="discardCmsDraftRecovery">
                      <q-tooltip>{{ cmsUiText.autoSaveDiscardLabel }}</q-tooltip>
                    </q-btn>
                    <q-btn round flat icon="tune" :aria-label="cmsUiText.showAdvancedOverridesLabel" @click="showAdvancedThemeFields = !showAdvancedThemeFields">
                      <q-tooltip>{{ cmsUiText.showAdvancedOverridesLabel }}</q-tooltip>
                    </q-btn>
                  </div>
                </aside>
              </div>
              <div class="cms-designer-card__statusbar cms-settings__statusbar">
                <span class="cms-designer-card__status-text">
                  <strong>{{ activeTenantProfileName || tr('Default tenant', 'Tenant padrao') }}</strong>
                </span>
                <span class="cms-designer-card__status-text">
                  {{ activeSettingsWorkbenchTab?.label }}
                </span>
                <span class="cms-designer-card__status-text">{{ savedAtLabel }}</span>
              </div>
            </div>
          </q-card>
          <q-card v-show="cmsSettingsWorkspaceView === 'preview' || cmsDesignerPreviewMode" flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ tr('Settings preview', 'Preview de configuracoes') }}</strong>
              <div class="cms-preview-toolbar__chips">
                <q-chip dense square :style="statusChipStyle">{{ activeTenantProfileName || tr('Default tenant', 'Tenant padrao') }}</q-chip>
                <q-chip dense square :style="statusChipStyle">{{ activeSettingsWorkbenchTab?.label }}</q-chip>
                <q-chip dense square :style="cmsAutosaveStatusStyle">{{ cmsAutosaveStatusLabel }}</q-chip>
              </div>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-settings__preview">
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
                        <q-tooltip v-if="settings.branding.notificationsTooltip">{{ settings.branding.notificationsTooltip }}</q-tooltip>
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
                    <small>{{ tr('Header height, search visibility and actions rendered together.', 'Altura do cabecalho, visibilidade da busca e acoes renderizadas em conjunto.') }}</small>
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
                </section>
              </div>
            </div>
          </q-card>
        </div>

        <div v-else-if="isPagesModule" class="cms-pages">
          <div class="cms-workspace-tabs" role="tablist" :aria-label="tr('Pages workspace tabs', 'Abas do workspace de paginas')">
            <button
              type="button"
              role="tab"
              class="cms-workspace-tab"
              :class="{ 'cms-workspace-tab--active': cmsPagesWorkspaceView === 'editor' && !cmsDesignerPreviewMode }"
              :aria-selected="cmsPagesWorkspaceView === 'editor' && !cmsDesignerPreviewMode ? 'true' : 'false'"
              @click="cmsDesignerPreviewMode = false; cmsPagesWorkspaceView = 'editor'"
            >
              {{ tr('Editor', 'Editor') }}
            </button>
            <button
              type="button"
              role="tab"
              class="cms-workspace-tab"
              :class="{ 'cms-workspace-tab--active': cmsPagesWorkspaceView === 'preview' || cmsDesignerPreviewMode }"
              :aria-selected="cmsPagesWorkspaceView === 'preview' || cmsDesignerPreviewMode ? 'true' : 'false'"
              @click="cmsDesignerPreviewMode = false; showCmsDesignerPreview('pages')"
            >
              {{ tr('Preview', 'Preview') }}
            </button>
          </div>
          <q-card v-show="cmsPagesWorkspaceView === 'editor' && !cmsDesignerPreviewMode" flat bordered class="cms-shell-card cms-designer-card cms-designer-card--pages">
            <div class="cms-shell-card__header cms-designer-card__toolbar-header">
              <div class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--actions">
                <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--icons">
                  <q-btn flat dense no-caps icon="folder_open" class="cms-designer-card__toolbar-action" :label="tr('Open', 'Abrir')" :aria-label="tr('Open pages workspace', 'Abrir workspace de paginas')" @click="scrollCmsDesignerSurface('.cms-designer-card--pages .cms-designer-card__workbench')" />
                  <q-btn flat dense no-caps icon="note_add" class="cms-designer-card__toolbar-action" :label="tr('New', 'Novo')" :aria-label="cmsUiText.addPageLabel" @click="addCmsPage" />
                  <q-btn flat dense no-caps icon="save" class="cms-designer-card__toolbar-action" :label="cmsUiText.saveLabel" :aria-label="cmsUiText.saveAriaLabel" @click="saveNow" />
                  <q-btn flat dense no-caps icon="undo" class="cms-designer-card__toolbar-action" :label="tr('Undo', 'Desfazer')" :disable="!canUndoCmsAuthoringHistory" :aria-label="tr('Undo', 'Desfazer')" @click="undoCmsAuthoringChange" />
                  <q-btn flat dense no-caps icon="redo" class="cms-designer-card__toolbar-action" :label="tr('Redo', 'Refazer')" :disable="!canRedoCmsAuthoringHistory" :aria-label="tr('Redo', 'Refazer')" @click="redoCmsAuthoringChange" />
                </div>
                <div class="cms-designer-card__toolbar-spacer" />
                <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--preview">
                  <q-btn no-caps unelevated icon="visibility" :label="tr('Preview', 'Preview')" :style="primaryActionStyle" @click="showCmsDesignerPreview('pages')" />
                </div>
              </div>
              <div class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--info">
                <div class="cms-designer-card__info-strip">
                  <span class="cms-designer-card__info-item">
                    <strong>{{ activeTenantProfileName || tr('Default tenant', 'Tenant padrao') }}</strong>
                  </span>
                  <span class="cms-designer-card__info-item">{{ cmsAutosaveStatusLabel }}</span>
                  <span class="cms-designer-card__info-item">{{ activeItem.label }}</span>
                </div>
              </div>
            </div>
            <div class="cms-shell-card__body cms-pages__editor">
              <div class="cms-designer-card__ruler-shell cms-designer-card__ruler-shell--pages">
                <div class="cms-designer-card__ruler-gutter">
                  <q-btn flat dense round icon="chevron_left" :aria-label="tr('Focus page workbench', 'Focar workbench de paginas')" @click="scrollCmsDesignerSurface('.cms-designer-card--pages .cms-designer-card__workbench')" />
                </div>
                <div class="cms-designer-card__ruler">
                  <span v-for="mark in cmsDesignerRulerMarks" :key="`pages-ruler-${mark}`" class="cms-designer-card__ruler-mark">
                    {{ mark }}
                  </span>
                </div>
                <div class="cms-designer-card__ruler-meta">
                  <q-chip dense square :style="statusChipStyle">{{ selectedPageTemplateId }}</q-chip>
                  <span class="cms-designer-card__ruler-zoom">100%</span>
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="grid_4x4"
                    class="cms-designer-card__ruler-mode"
                    :label="showCmsDesignerStageGrid ? tr('Grid', 'Grade') : tr('Plain', 'Livre')"
                    @click="toggleCmsDesignerStageGrid"
                  />
                </div>
              </div>
              <div class="cms-designer-card__workbench cms-designer-card__workbench--pages">
                <aside class="cms-designer-card__sidebar cms-pages__sidebar">
                  <div class="cms-designer-card__sidebar-header">
                    <strong>{{ tr('Page setup', 'Setup da pagina') }}</strong>
                    <small>{{ tr('Template, quick actions and starter flows stay together on the left while the center stays focused on editing.', 'Template, acoes rapidas e fluxos iniciais ficam juntos na esquerda enquanto o centro fica focado na edicao.') }}</small>
                  </div>
                  <div class="cms-designer-card__metrics">
                    <span>{{ tr('Template', 'Template') }}: <strong>{{ cmsPageTemplateOptions.find(option => option.value === selectedPageTemplateId)?.label || selectedPageTemplateId }}</strong></span>
                    <span>{{ tr('Pages in tenant', 'Paginas no tenant') }}: <strong>{{ settings.pages.length }}</strong></span>
                    <span>{{ tr('Reusable sections', 'Secoes reutilizaveis') }}: <strong>{{ settings.reusableSections.length }}</strong></span>
                    <span>{{ tr('Quick command', 'Comando rapido') }}: <strong>{{ selectedCmsBuilderCommandOption?.label || tr('None selected', 'Nenhum selecionado') }}</strong></span>
                  </div>
                  <div class="cms-pages__sidebar-section">
                    <strong>{{ tr('Workspace actions', 'Acoes do workspace') }}</strong>
                    <div class="cms-form-grid cms-pages__stage-toolbar">
                      <q-select
                        v-model="selectedPageTemplateId"
                        outlined
                        dense
                        emit-value
                        map-options
                        :options="cmsPageTemplateOptions"
                        :label="tr('Page template', 'Template de pagina')"
                        class="cms-pages__template-select"
                      />
                      <q-select
                        v-if="cmsBuilderCommandOptions.length > 0"
                        v-model="selectedBuilderCommandId"
                        outlined
                        dense
                        emit-value
                        map-options
                        :options="cmsBuilderCommandOptions"
                        option-label="label"
                        option-value="value"
                        :label="tr('Quick command', 'Comando rapido')"
                        class="cms-builder-command-select"
                      />
                      <div v-if="cmsBuilderCommandOptions.length > 0" class="cms-form-grid__inline-actions cms-pages__sidebar-action-bar">
                        <q-btn
                          flat
                          dense
                          no-caps
                          icon="play_arrow"
                          :label="tr('Run', 'Executar')"
                          @click="executeSelectedBuilderCommand"
                        />
                      </div>
                    </div>
                    <p v-if="selectedCmsBuilderCommandOption" class="cms-config-caption cms-pages__toolbar-hint">
                      {{ selectedCmsBuilderCommandOption.description }}
                    </p>
                  </div>
                </aside>
                <div class="cms-designer-card__stage cms-pages__stage" :class="{ 'cms-designer-card__stage--plain': !showCmsDesignerStageGrid }">
              <div
                v-if="cmsSchemaMigrationBatchReport.summary.upgradeRequiredCount > 0 || cmsSchemaMigrationBatchReport.summary.versionMissingCount > 0 || cmsSchemaMigrationBatchReport.summary.aheadCount > 0 || cmsSchemaMigrationBatchReport.summary.invalidModelCount > 0"
                class="cms-page-migration-summary"
              >
                <div class="cms-review-summary__header">
                  <strong>{{ tr('Schema migration review', 'Revisao de migracao de schema') }}</strong>
                  <div class="cms-page-migration-summary__chips">
                    <q-chip dense square :style="warningActionStyle">
                      {{ tr('Pending', 'Pendentes') }}: {{ cmsSchemaMigrationBatchReport.summary.upgradeRequiredCount + cmsSchemaMigrationBatchReport.summary.versionMissingCount }}
                    </q-chip>
                    <q-chip
                      v-if="cmsSchemaMigrationBatchReport.summary.invalidModelCount > 0"
                      dense
                      square
                      :style="dangerActionStyle"
                    >
                      {{ tr('Invalid', 'Invalidos') }}: {{ cmsSchemaMigrationBatchReport.summary.invalidModelCount }}
                    </q-chip>
                    <q-chip
                      v-if="cmsSchemaMigrationBatchReport.summary.aheadCount > 0"
                      dense
                      square
                      :style="dangerActionStyle"
                    >
                      {{ tr('Ahead', 'A frente') }}: {{ cmsSchemaMigrationBatchReport.summary.aheadCount }}
                    </q-chip>
                    <q-chip dense square :style="statusChipStyle">
                      {{ getCmsSchemaMigrationBatchSummaryLabel() }}
                    </q-chip>
                  </div>
                </div>
              </div>
              <div
                v-for="{ page, pageIndex } in filteredCmsPageRows"
                :key="page.id"
                class="cms-page-item"
              >
                <div class="cms-page-item__grid">
                  <q-input v-model="page.id" outlined dense :label="tr('Page ID', 'ID da pagina')" @blur="normalizeCmsPageId(pageIndex)" />
                  <q-select
                    :model-value="page.contentModelId"
                    outlined
                    dense
                    emit-value
                    map-options
                    :options="cmsContentModelOptions"
                    :label="tr('Content model', 'Modelo de conteudo')"
                    @update:model-value="updateCmsPageContentModel(pageIndex, $event)"
                  />
                  <q-input
                    :model-value="getCmsPageTitleValue(page)"
                    outlined
                    dense
                    :label="tr('Title', 'Titulo')"
                    @update:model-value="updateCmsPageTitleValue(page, $event)"
                  />
                  <q-input v-model="page.path" outlined dense :label="tr('Path', 'Caminho')" @blur="normalizeCmsPagePath(pageIndex)" />
                  <q-select
                    v-model="page.status"
                    outlined
                    dense
                    emit-value
                    map-options
                    :options="pageStatusOptions"
                    :label="tr('Status', 'Status')"
                  />
                  <q-input
                    :model-value="getCmsPageDescriptionValue(page)"
                    outlined
                    dense
                    type="textarea"
                    autogrow
                    :label="tr('Description', 'Descricao')"
                    class="cms-page-item__description"
                    @update:model-value="updateCmsPageDescriptionValue(page, $event)"
                  />
                </div>

                <div
                  v-if="getCmsPageContentModelFields(page).length > 0"
                  class="cms-page-item__custom-fields"
                >
                  <div class="cms-page-item__custom-fields-header">
                    <strong>{{ tr('Schema fields', 'Campos do schema') }}</strong>
                    <small>
                      {{
                        tr(
                          'Page-level values driven by the selected content model.',
                          'Valores em nivel de pagina guiados pelo modelo de conteudo selecionado.'
                        )
                      }}
                    </small>
                  </div>
                  <div class="cms-page-item__custom-fields-groups">
                    <div
                      v-for="group in getCmsPageContentModelFieldGroups(page)"
                      :key="`page-field-group-${page.id}-${group.id}`"
                      class="cms-page-item__custom-fields-group"
                    >
                      <div class="cms-page-item__custom-fields-group-header">
                        <strong>{{ group.label }}</strong>
                        <small>
                          {{
                            group.fields.length === 1
                              ? tr('1 field', '1 campo')
                              : tr(`${group.fields.length} fields`, `${group.fields.length} campos`)
                          }}
                        </small>
                      </div>
                      <div class="cms-page-item__custom-fields-grid">
                        <template
                          v-for="field in group.fields"
                          :key="`page-field-${page.id}-${field.id}`"
                        >
                          <q-input
                            v-if="field.type === 'object' || field.type === 'group'"
                            :model-value="formatCmsJsonFieldValue(getCmsPageCustomFieldValue(page, field), field.type === 'group' ? [] : {})"
                            outlined
                            dense
                            type="textarea"
                            autogrow
                            class="cms-page-item__custom-fields-json"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-select
                            v-else-if="field.repeatable && field.type === 'select'"
                            :model-value="normalizeCmsMediaPickerModelValue(getCmsPageCustomFieldValue(page, field), true)"
                            outlined
                            dense
                            multiple
                            use-chips
                            emit-value
                            map-options
                            :options="field.options"
                            option-label="label"
                            option-value="value"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <CmsMediaAssetPicker
                            v-else-if="field.repeatable && field.type === 'media-asset'"
                            :model-value="normalizeCmsMediaPickerModelValue(getCmsPageCustomFieldValue(page, field), true)"
                            multiple
                            :options="getCmsPageCustomFieldMediaOptions(field)"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            :allowed-kind-labels="getCmsMediaAllowedKindLabels(field.mediaKinds)"
                            :any-kind-label="cmsMediaPickerUiText.anyKindLabel"
                            :selected-preview-label="cmsMediaPickerUiText.selectedAssetsLabel"
                            :no-selection-label="cmsMediaPickerUiText.noSelectionLabel"
                            :no-option-label="cmsMediaPickerUiText.noOptionLabel"
                            :incompatible-label="cmsMediaPickerUiText.incompatibleLabel"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-select
                            v-else-if="field.repeatable && field.type === 'reference'"
                            :model-value="Array.isArray(getCmsPageCustomFieldValue(page, field)) ? getCmsPageCustomFieldValue(page, field) : []"
                            outlined
                            dense
                            multiple
                            use-chips
                            emit-value
                            map-options
                            :options="getCmsPageCustomFieldReferenceOptions(field)"
                            option-label="label"
                            option-value="value"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-input
                            v-else-if="field.repeatable"
                            :model-value="formatCmsRepeatableFieldValue(getCmsPageCustomFieldValue(page, field))"
                            outlined
                            dense
                            type="textarea"
                            autogrow
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-input
                            v-else-if="field.type === 'text'"
                            :model-value="String(getCmsPageCustomFieldValue(page, field) ?? '')"
                            outlined
                            dense
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-input
                            v-else-if="field.type === 'textarea'"
                            :model-value="String(getCmsPageCustomFieldValue(page, field) ?? '')"
                            outlined
                            dense
                            type="textarea"
                            autogrow
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-input
                          v-else-if="field.type === 'url'"
                            :model-value="String(getCmsPageCustomFieldValue(page, field) ?? '')"
                            outlined
                            dense
                            :type="getCmsContentModelFieldHtmlInputType(field.type)"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-input
                            v-else-if="field.type === 'date'"
                            :model-value="String(getCmsPageCustomFieldValue(page, field) ?? '')"
                            outlined
                            dense
                            type="date"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-input
                            v-else-if="field.type === 'number'"
                            :model-value="getCmsPageCustomFieldValue(page, field) == null ? '' : String(getCmsPageCustomFieldValue(page, field))"
                            outlined
                            dense
                            type="number"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-toggle
                            v-else-if="field.type === 'toggle'"
                            :model-value="Boolean(getCmsPageCustomFieldValue(page, field))"
                            :label="field.label"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <CmsMediaAssetPicker
                            v-else-if="field.type === 'media-asset'"
                            :model-value="String(getCmsPageCustomFieldValue(page, field) ?? '')"
                            :options="getCmsPageCustomFieldMediaOptions(field)"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            clearable
                            :allowed-kind-labels="getCmsMediaAllowedKindLabels(field.mediaKinds)"
                            :any-kind-label="cmsMediaPickerUiText.anyKindLabel"
                            :selected-preview-label="cmsMediaPickerUiText.selectedAssetLabel"
                            :no-selection-label="cmsMediaPickerUiText.noSelectionLabel"
                            :no-option-label="cmsMediaPickerUiText.noOptionLabel"
                            :incompatible-label="cmsMediaPickerUiText.incompatibleLabel"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-select
                            v-else-if="field.type === 'reference'"
                            :model-value="String(getCmsPageCustomFieldValue(page, field) ?? '')"
                            outlined
                            dense
                            emit-value
                            map-options
                            :options="getCmsPageCustomFieldReferenceOptions(field)"
                            option-label="label"
                            option-value="value"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                          <q-select
                            v-else
                            :model-value="String(getCmsPageCustomFieldValue(page, field) ?? '')"
                            outlined
                            dense
                            emit-value
                            map-options
                            :options="field.options"
                            option-label="label"
                            option-value="value"
                            :label="field.label"
                            :hint="getCmsContentModelFieldHint(field)"
                            @update:model-value="updateCmsPageCustomFieldValue(page, field, $event)"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="cms-page-item__sections">
                  <div class="cms-page-item__sections-header">
                    <strong>{{ tr('Sections', 'Secoes') }}</strong>
                    <div class="cms-page-item__sections-actions">
                      <q-select
                        :model-value="getSelectedSectionPresetForPage(pageIndex)"
                        outlined
                        dense
                        emit-value
                        map-options
                        :options="getCmsSectionPresetOptions(page)"
                        :label="tr('Section preset', 'Preset de secao')"
                        class="cms-page-item__section-preset-select"
                        @update:model-value="setSelectedSectionPresetForPage(pageIndex, $event)"
                      />
                      <q-select
                        :model-value="getSelectedSectionStarterPresetForPage(pageIndex)"
                        outlined
                        dense
                        emit-value
                        map-options
                        :options="getCmsSectionStarterPresetOptions(pageIndex)"
                        :label="tr('Starter preset', 'Preset inicial')"
                        class="cms-page-item__section-preset-select"
                        @update:model-value="setSelectedSectionStarterPresetForPage(pageIndex, $event)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="add"
                        :label="tr('Add section', 'Adicionar secao')"
                        :disable="isCmsPageSectionAddBlocked(pageIndex)"
                        @click="addCmsPageSection(pageIndex)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="view_stream"
                        :label="tr('Apply model scaffold', 'Aplicar scaffold do modelo')"
                        @click="applyCmsPageContentModelStarterSections(pageIndex)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="drive_file_rename_outline"
                        :label="tr('Apply model defaults', 'Aplicar defaults do modelo')"
                        @click="applyCmsPageContentModelDefaults(pageIndex)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="sync"
                        :label="tr('Sync schema version', 'Sincronizar versao do schema')"
                        :disable="!getCmsPageSchemaMigrationReport(page.id)?.canApply"
                        @click="syncCmsPageContentModelVersion(pageIndex)"
                      />
                      <q-select
                        :model-value="getSelectedReusableSectionForPage(pageIndex)"
                        outlined
                        dense
                        emit-value
                        map-options
                        :options="getCmsReusableSectionOptions(page)"
                        :label="tr('Reusable section', 'Secao reutilizavel')"
                        class="cms-page-item__section-preset-select"
                        @update:model-value="setSelectedReusableSectionForPage(pageIndex, $event)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="library_add"
                        :label="tr('Insert detached', 'Inserir desvinculado')"
                        :disable="getCmsReusableSectionOptions(page).length === 0"
                        @click="insertSelectedReusableSection(pageIndex)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="link"
                        :label="tr('Insert linked', 'Inserir vinculado')"
                        :disable="getCmsReusableSectionOptions(page).length === 0"
                        @click="insertSelectedLinkedReusableSection(pageIndex)"
                      />
                    </div>
                  </div>
                  <div
                    v-if="getCmsPageSchemaMigrationReport(page.id) && (getCmsPageSchemaMigrationReport(page.id)?.hasChanges || getCmsPageSchemaMigrationReport(page.id)?.status === 'ahead' || getCmsPageSchemaMigrationReport(page.id)?.status === 'invalid-model')"
                    class="cms-page-item__schema-migration"
                  >
                    <div class="cms-review-summary__header">
                      <strong>{{ tr('Schema upgrade report', 'Relatorio de upgrade do schema') }}</strong>
                      <div class="cms-page-item__schema-migration-chips">
                        <q-chip
                          dense
                          square
                          :style="getCmsSchemaMigrationStatusStyle(getCmsPageSchemaMigrationReport(page.id)?.status ?? 'current')"
                        >
                          {{ getCmsSchemaMigrationStatusLabel(getCmsPageSchemaMigrationReport(page.id)?.status ?? 'current') }}
                        </q-chip>
                        <q-chip dense square :style="statusChipStyle">
                          {{
                            `v${getCmsPageSchemaMigrationReport(page.id)?.appliedVersion ?? '?'} -> v${getCmsPageSchemaMigrationReport(page.id)?.targetVersion ?? '?'}`
                          }}
                        </q-chip>
                      </div>
                    </div>
                    <small v-if="getCmsPageSchemaMigrationReport(page.id)?.migrationNotes">
                      {{ getCmsPageSchemaMigrationReport(page.id)?.migrationNotes }}
                    </small>
                    <small v-if="getCmsPageSchemaMigrationReport(page.id)?.lastSchemaChangeAt">
                      {{
                        `${tr('Schema updated at', 'Schema atualizado em')} ${getCmsPageSchemaMigrationReport(page.id)?.lastSchemaChangeAt}`
                      }}
                    </small>
                    <small>{{ getCmsSchemaMigrationSummaryLabel(getCmsPageSchemaMigrationReport(page.id)) }}</small>
                    <div
                      v-if="(getCmsPageSchemaMigrationReport(page.id)?.changes.length ?? 0) > 0"
                      class="cms-review-summary__list"
                    >
                      <article
                        v-for="change in getCmsPageSchemaMigrationReport(page.id)?.changes.slice(0, 4)"
                        :key="change?.id"
                        class="cms-review-summary__item"
                      >
                        <q-chip
                          dense
                          square
                          :style="getCmsSchemaMigrationChangeStyle(change?.kind ?? 'update')"
                        >
                          {{ getCmsSchemaMigrationChangeKindLabel(change?.kind ?? 'update') }}
                        </q-chip>
                        <div class="cms-review-summary__body">
                          <strong>{{ change?.label }}</strong>
                          <small>{{ change?.path }}</small>
                          <small>{{ getCmsSchemaMigrationChangeValueLabel(change) }}</small>
                        </div>
                      </article>
                    </div>
                  </div>
                  <div
                    v-if="getCmsSectionStarterPresetVariants(pageIndex).length > 0"
                    class="cms-page-item__starter-variants"
                  >
                    <button
                      v-for="variant in getCmsSectionStarterPresetVariants(pageIndex)"
                      :key="`${page.id}-${variant.value}`"
                      type="button"
                      class="cms-page-item__starter-card"
                      :class="{ 'cms-page-item__starter-card--active': isCmsSectionStarterPresetSelected(pageIndex, variant.value) }"
                      :aria-label="`${variant.label}: ${variant.description}`"
                      @click="setSelectedSectionStarterPresetForPage(pageIndex, variant.value)"
                    >
                      <div class="cms-page-item__starter-card-header">
                        <strong>{{ variant.label }}</strong>
                        <q-chip
                          dense
                          square
                          :style="isCmsSectionStarterPresetSelected(pageIndex, variant.value) ? primaryActionStyle : statusChipStyle"
                        >
                          {{ getCmsStarterPresetSourceLabel(variant) }}
                        </q-chip>
                      </div>
                      <small>{{ variant.description }}</small>
                    </button>
                  </div>
                  <div
                    v-for="(section, sectionIndex) in page.sections"
                    :key="`${page.id}-${section.id}-${sectionIndex}`"
                    class="cms-page-section-row"
                    :class="{
                      'cms-page-section-row--dragging': draggedPageSection?.pageId === page.id && draggedPageSection?.sectionId === section.id,
                      'cms-page-section-row--drop-target': pageSectionDropTargetKey === section.id,
                    }"
                    draggable="true"
                    @dragstart="onCmsPageSectionDragStart(page.id, section.id, $event)"
                    @dragend="onCmsPageSectionDragEnd"
                    @dragover="onCmsPageSectionDragOver(page.id, section.id, $event)"
                    @drop="onCmsPageSectionDrop(pageIndex, section.id, sectionIndex, $event)"
                  >
                    <q-input v-model="section.id" outlined dense :disable="isCmsPageSectionLinked(section)" :label="tr('Section ID', 'ID da secao')" />
                    <q-input :model-value="getCmsSectionPresetLabel(resolveCmsPageSectionForAuthoring(section).presetId)" outlined dense readonly :label="tr('Preset', 'Preset')" />
                    <q-input
                      :model-value="getCmsSectionLabelValue(resolveCmsPageSectionForAuthoring(section))"
                      outlined
                      dense
                      :disable="isCmsPageSectionLinked(section)"
                      :label="tr('Section label', 'Label da secao')"
                      @update:model-value="updateCmsSectionLabelValue(section, $event)"
                    />
                    <q-toggle v-model="section.enabled" :label="tr('Enabled', 'Ativado')" />
                    <q-chip
                      v-if="section.reusableMode"
                      dense
                      square
                      :style="statusChipStyle"
                    >
                      {{
                        section.reusableMode === 'linked'
                          ? `${tr('Linked', 'Vinculado')} · ${getCmsReusableSourceLabel(section.reusableSourceId, 'section')}`
                          : `${tr('Detached', 'Desvinculado')} · ${getCmsReusableSourceLabel(section.reusableSourceId, 'section')}`
                      }}
                    </q-chip>
                    <div class="cms-page-section-row__actions">
                      <q-btn
                        :key="`${section.id}-duplicate`"
                        flat
                        dense
                        no-caps
                        icon="content_copy"
                        :label="tr('Duplicate', 'Duplicar')"
                        @click.stop="duplicateCmsPageSection(pageIndex, sectionIndex)"
                      />
                      <q-btn
                        :key="`${section.id}-save-reusable`"
                        flat
                        dense
                        no-caps
                        icon="bookmark_add"
                        :label="tr('Save reusable', 'Salvar reutilizavel')"
                        @click.stop="saveCmsPageSectionAsReusable(pageIndex, sectionIndex)"
                      />
                      <q-btn
                        v-if="section.reusableSourceId"
                        :key="`${section.id}-branch-variant`"
                        flat
                        dense
                        no-caps
                        icon="fork_right"
                        :label="tr('Branch variant', 'Ramificar variante')"
                        @click.stop="branchCmsPageSectionToVariant(pageIndex, sectionIndex)"
                      />
                      <q-btn
                        v-if="isCmsPageSectionLinked(section)"
                        :key="`${section.id}-detach`"
                        flat
                        dense
                        no-caps
                        icon="link_off"
                        :label="tr('Detach', 'Desvincular')"
                        @click.stop="detachCmsPageSection(pageIndex, sectionIndex)"
                      />
                      <q-btn
                        :key="`${section.id}-open-blocks`"
                        flat
                        dense
                        no-caps
                        icon="widgets"
                        :label="tr('Open blocks', 'Abrir blocos')"
                        @click.stop="openPageInBlocksEditor(page.id, section.id)"
                      />
                      <q-btn
                        :key="`${section.id}-delete`"
                        flat
                        round
                        dense
                        icon="delete"
                        :style="dangerActionStyle"
                        @click.stop="removeCmsPageSection(pageIndex, sectionIndex)"
                      />
                    </div>
                  </div>
                </div>

                <div class="cms-page-item__actions">
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="widgets"
                    :label="tr('Open blocks', 'Abrir blocos')"
                    @click="openPageInBlocksEditor(page.id)"
                  />
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="delete"
                    :label="tr('Delete page', 'Excluir pagina')"
                    :style="dangerActionStyle"
                    :disable="settings.pages.length <= 1"
                    @click="removeCmsPage(pageIndex)"
                  />
                </div>
              </div>

              <div v-if="hasCmsBuilderSearch && filteredCmsPageRows.length === 0" class="cms-block-item__empty cms-block-item__empty--card">
                <strong>{{ tr('No pages matched the current search.', 'Nenhuma pagina corresponde a busca atual.') }}</strong>
                <small>
                  {{
                    tr(
                      'Try another search term or run one quick command from the current template.',
                      'Tente outro termo de busca ou execute um comando rapido a partir do template atual.'
                    )
                  }}
                </small>
              </div>

                </div>
                <aside class="cms-designer-card__rail cms-pages__rail">
                  <div class="cms-designer-card__rail-card">
                    <strong>{{ tr('Reusable content rail', 'Rail de conteudo reutilizavel') }}</strong>
                    <small>{{ tr('Keep reusable sections and launch flows on the right so the center stays focused on live page editing.', 'Mantenha secoes reutilizaveis e fluxos de lancamento na direita para o centro ficar focado na edicao real da pagina.') }}</small>
                    <div class="cms-designer-card__metrics">
                      <span>{{ tr('Visible sections', 'Secoes visiveis') }}: <strong>{{ filteredCmsReusableSectionLibrary.length }}</strong></span>
                      <span>{{ tr('Total library', 'Biblioteca total') }}: <strong>{{ settings.reusableSections.length }}</strong></span>
                      <span>{{ tr('Archived hidden', 'Arquivadas ocultas') }}: <strong>{{ showArchivedReusableSections ? tr('No', 'Nao') : tr('Yes', 'Sim') }}</strong></span>
                    </div>
                  </div>
                  <div class="cms-pages__reusable-library">
                    <div class="cms-shell-card__header">
                      <strong>{{ tr('Reusable sections library', 'Biblioteca de secoes reutilizaveis') }}</strong>
                      <div class="cms-blocks-library__header-actions">
                        <q-toggle
                          v-model="showArchivedReusableSections"
                          dense
                          :label="tr('Show archived', 'Mostrar arquivados')"
                        />
                        <q-chip dense square :style="statusChipStyle">
                          {{ filteredCmsReusableSectionLibrary.length }}/{{ settings.reusableSections.length }}
                        </q-chip>
                      </div>
                    </div>
                    <q-separator />
                    <div class="cms-pages__reusable-list">
                      <div v-if="filteredCmsReusableSectionLibrary.length === 0" class="cms-block-item__empty">
                        {{
                          hasCmsBuilderSearch
                            ? tr('No reusable section matched the current search.', 'Nenhuma secao reutilizavel corresponde a busca atual.')
                            : tr('No reusable sections saved yet.', 'Nenhuma secao reutilizavel salva ainda.')
                        }}
                      </div>
                      <article
                        v-for="reusableSection in filteredCmsReusableSectionLibrary"
                        :key="reusableSection.id"
                        class="cms-reusable-block-row"
                      >
                        <div class="cms-reusable-block-row__meta">
                          <div class="cms-blocks-library__header">
                            <strong>{{ reusableSection.name }}</strong>
                            <q-chip dense square :style="statusChipStyle">
                              {{ getCmsReusableSectionUsageCount(reusableSection.id) }} {{ tr('uses', 'usos') }}
                            </q-chip>
                          </div>
                          <small>{{ getCmsContentModelLabel(settings.content.locale, reusableSection.contentModelId, settings.authoredContentModels) }} · {{ getCmsSectionPresetLabel(reusableSection.presetId) }}</small>
                          <small>{{ getCmsReusableSectionLabelValue(reusableSection) }} · {{ reusableSection.blocks.length }} {{ tr('blocks', 'blocos') }}</small>
                          <small v-if="isCmsArchivedEntity(reusableSection)">{{ tr('Archived', 'Arquivada') }}</small>
                          <small v-if="isCmsDeprecatedEntity(reusableSection)">
                            {{
                              getCmsReplacementLabel(
                                reusableSection.replacementEntityId,
                                settings.reusableSections,
                                section => section.name
                              )
                                ? `${tr('Deprecated -> replacement', 'Descontinuado -> substituto')}: ${getCmsReplacementLabel(
                                  reusableSection.replacementEntityId,
                                  settings.reusableSections,
                                  section => section.name
                                )}`
                                : tr('Deprecated for new page composition', 'Descontinuado para nova composicao de paginas')
                            }}
                          </small>
                          <small v-if="isCmsDeprecatedEntity(reusableSection) && reusableSection.deprecationNote">{{ reusableSection.deprecationNote }}</small>
                          <small
                            v-if="isCmsDeprecatedEntity(reusableSection) && getCmsReplacementAssistantSummaryLabel('reusable-section', reusableSection.id)"
                          >
                            {{ getCmsReplacementAssistantSummaryLabel('reusable-section', reusableSection.id) }}
                          </small>
                          <small v-if="isCmsReusableSectionVariant(reusableSection)">
                            {{ getCmsReusableSectionVariantLabel(reusableSection) }}
                          </small>
                          <small>{{ getCmsReusableSectionUsageSummaryLabel(reusableSection.id) }}</small>
                          <small v-if="reusableSection.description">{{ reusableSection.description }}</small>
                          <q-select
                            v-if="isCmsDeprecatedEntity(reusableSection)"
                            :model-value="reusableSection.replacementEntityId ?? null"
                            outlined
                            dense
                            clearable
                            emit-value
                            map-options
                            :options="getCmsReusableSectionReplacementOptions(reusableSection)"
                            :label="tr('Replacement section', 'Secao substituta')"
                            @update:model-value="updateReusableSectionReplacement(reusableSection.id, $event)"
                          />
                          <q-input
                            v-if="isCmsDeprecatedEntity(reusableSection)"
                            :model-value="reusableSection.deprecationNote ?? ''"
                            outlined
                            dense
                            :label="tr('Deprecation note', 'Nota de descontinuacao')"
                            @update:model-value="updateReusableSectionDeprecationNote(reusableSection.id, $event)"
                          />
                        </div>
                        <div class="cms-reusable-block-row__actions">
                          <q-btn
                            flat
                            dense
                            no-caps
                            icon="fork_right"
                            :label="tr('Create variant', 'Criar variante')"
                            :disable="isCmsArchivedEntity(reusableSection)"
                            @click="createReusableSectionVariant(reusableSection.id)"
                          />
                          <q-btn
                            v-if="isCmsDeprecatedEntity(reusableSection) && reusableSection.replacementEntityId"
                            flat
                            dense
                            no-caps
                            icon="published_with_changes"
                            :label="tr('Apply replacement', 'Aplicar substituto')"
                            :disable="!getCmsReplacementAssistantSummary('reusable-section', reusableSection.id)?.canApply"
                            @click="applyCmsDeprecatedReplacement('reusable-section', reusableSection.id)"
                          />
                          <q-btn
                            flat
                            round
                            dense
                            icon="travel_explore"
                            :aria-label="tr('Inspect reusable section usage', 'Inspecionar uso da secao reutilizavel')"
                            @click="openCmsUsageDrawer('reusable-section', reusableSection.id, reusableSection.name, reusableSection.description ?? '')"
                          />
                          <q-btn
                            flat
                            dense
                            no-caps
                            :icon="isCmsDeprecatedEntity(reusableSection) ? 'restore_from_trash' : 'history_toggle_off'"
                            :label="isCmsDeprecatedEntity(reusableSection) ? tr('Reinstate', 'Reativar') : tr('Deprecate', 'Descontinuar')"
                            :style="isCmsDeprecatedEntity(reusableSection) ? undefined : warningActionStyle"
                            @click="isCmsDeprecatedEntity(reusableSection) ? undeprecateReusableSection(reusableSection.id) : deprecateReusableSection(reusableSection.id)"
                          />
                          <q-btn
                            flat
                            dense
                            no-caps
                            :icon="isCmsArchivedEntity(reusableSection) ? 'unarchive' : 'archive'"
                            :label="isCmsArchivedEntity(reusableSection) ? tr('Restore', 'Restaurar') : tr('Archive', 'Arquivar')"
                            :style="isCmsArchivedEntity(reusableSection) ? undefined : warningActionStyle"
                            @click="isCmsArchivedEntity(reusableSection) ? unarchiveReusableSection(reusableSection.id) : archiveReusableSection(reusableSection.id)"
                          />
                        </div>
                      </article>
                    </div>
                  </div>
                  <div class="cms-pages__sidebar-section cms-pages__starter-kits">
                    <div class="cms-pages__quick-starts-header">
                      <div>
                        <strong>{{ tr('Starter-kit bundles', 'Bundles de starter kit') }}</strong>
                        <small>
                          {{
                            tr(
                              'Seed a landing page together with reusable sections, blocks and schema presets for one common use case.',
                              'Semeie uma landing junto com secoes reutilizaveis, blocos e presets de schema para um caso de uso comum.'
                            )
                          }}
                        </small>
                      </div>
                      <q-chip dense square :style="statusChipStyle">
                        {{ hasCmsBuilderSearch ? `${filteredCmsStarterKitOptions.length}/${cmsStarterKitOptions.length}` : cmsStarterKitOptions.length }}
                      </q-chip>
                    </div>
                    <div class="cms-pages__quick-start-grid">
                      <article
                        v-for="starterKit in filteredCmsStarterKitOptions"
                        :key="`starter-kit-${starterKit.value}`"
                        class="cms-page-quick-start-card cms-page-quick-start-card--starter-kit"
                      >
                        <div class="cms-page-quick-start-card__header">
                          <strong>{{ starterKit.label }}</strong>
                          <q-chip dense square :style="statusChipStyle">
                            {{ starterKit.sectionCount }}
                          </q-chip>
                        </div>
                        <small class="cms-page-quick-start-card__description">{{ starterKit.description }}</small>
                        <div class="cms-page-quick-start-card__meta">
                          <span>
                            {{ tr('Template', 'Template') }}:
                            <strong>{{ starterKit.templateLabel }}</strong>
                          </span>
                          <span>
                            {{ tr('Content model', 'Modelo de conteudo') }}:
                            <strong>{{ starterKit.contentModelLabel }}</strong>
                          </span>
                          <span>
                            {{ tr('Reusable sections', 'Secoes reutilizaveis') }}:
                            <strong>{{ starterKit.reusableSectionCount }}</strong>
                          </span>
                          <span>
                            {{ tr('Reusable blocks', 'Blocos reutilizaveis') }}:
                            <strong>{{ starterKit.reusableBlockCount }}</strong>
                          </span>
                          <span>
                            {{ tr('Block presets', 'Presets de bloco') }}:
                            <strong>{{ starterKit.blockPresetCount }}</strong>
                          </span>
                          <span>
                            {{ tr('Field presets', 'Presets de campo') }}:
                            <strong>{{ starterKit.fieldPresetCount }}</strong>
                          </span>
                        </div>
                        <div class="cms-page-quick-start-card__actions">
                          <q-btn
                            no-caps
                            unelevated
                            icon="inventory_2"
                            :label="tr('Install kit', 'Instalar kit')"
                            :style="primaryActionStyle"
                            @click="runCmsStarterKit(starterKit.value)"
                          />
                          <q-btn
                            flat
                            dense
                            no-caps
                            icon="widgets"
                            :label="tr('Install + open blocks', 'Instalar + abrir blocos')"
                            @click="runCmsStarterKit(starterKit.value, true)"
                          />
                        </div>
                      </article>
                    </div>
                    <div v-if="hasCmsBuilderSearch && filteredCmsStarterKitOptions.length === 0" class="cms-block-item__empty cms-pages__sidebar-empty">
                      <strong>{{ tr('No starter kit matched the current search.', 'Nenhum starter kit corresponde a busca atual.') }}</strong>
                    </div>
                  </div>
                  <div class="cms-pages__sidebar-section">
                    <div class="cms-pages__quick-starts-header">
                      <div>
                        <strong>{{ tr('Quick-start workflows', 'Fluxos de quick-start') }}</strong>
                        <small>
                          {{
                            tr(
                              'Create a ready-to-edit page in one click, then optionally jump straight into Blocks.',
                              'Crie uma pagina pronta para edicao em um clique e, se quiser, abra Blocos em seguida.'
                            )
                          }}
                        </small>
                      </div>
                      <q-chip dense square :style="statusChipStyle">
                        {{ hasCmsBuilderSearch ? `${filteredCmsPageQuickStartOptions.length}/${cmsPageQuickStartOptions.length}` : cmsPageQuickStartOptions.length }}
                      </q-chip>
                    </div>
                    <div class="cms-pages__quick-start-grid">
                      <article
                        v-for="quickStart in filteredCmsPageQuickStartOptions"
                        :key="`quick-start-${quickStart.value}`"
                        class="cms-page-quick-start-card"
                      >
                        <div class="cms-page-quick-start-card__header">
                          <strong>{{ quickStart.label }}</strong>
                          <q-chip dense square :style="statusChipStyle">
                            {{ quickStart.sectionCount }}
                          </q-chip>
                        </div>
                        <small class="cms-page-quick-start-card__description">{{ quickStart.description }}</small>
                        <div class="cms-page-quick-start-card__meta">
                          <span>
                            {{ tr('Content model', 'Modelo de conteudo') }}:
                            <strong>{{ quickStart.contentModelLabel }}</strong>
                          </span>
                          <span>
                            {{ tr('Sections', 'Secoes') }}:
                            <strong>{{ quickStart.sectionLabels.join(', ') }}</strong>
                          </span>
                        </div>
                        <div class="cms-page-quick-start-card__actions">
                          <q-btn
                            no-caps
                            unelevated
                            icon="note_add"
                            :label="tr('Create page', 'Criar pagina')"
                            :style="primaryActionStyle"
                            @click="runCmsPageQuickStart(quickStart.value)"
                          />
                          <q-btn
                            flat
                            dense
                            no-caps
                            icon="widgets"
                            :label="tr('Create + open blocks', 'Criar + abrir blocos')"
                            @click="runCmsPageQuickStart(quickStart.value, true)"
                          />
                        </div>
                      </article>
                    </div>
                    <div v-if="hasCmsBuilderSearch && filteredCmsPageQuickStartOptions.length === 0" class="cms-block-item__empty cms-pages__sidebar-empty">
                      <strong>{{ tr('No quick-start matched the current search.', 'Nenhum quick-start corresponde a busca atual.') }}</strong>
                    </div>
                  </div>
                </aside>
              </div>
              <div class="cms-designer-card__statusbar cms-pages__statusbar">
                <q-chip dense square :style="statusChipStyle">{{ tr('Pages', 'Paginas') }}: {{ settings.pages.length }}</q-chip>
                <q-chip dense square :style="statusChipStyle">{{ tr('Visible', 'Visiveis') }}: {{ filteredCmsPageRows.length }}</q-chip>
                <q-chip dense square :style="statusChipStyle">{{ tr('Reusable', 'Reutilizaveis') }}: {{ filteredCmsReusableSectionLibrary.length }}</q-chip>
                <span class="cms-designer-card__status-text">{{ savedAtLabel }}</span>
              </div>
            </div>
          </q-card>

          <q-card v-show="cmsPagesWorkspaceView === 'preview' || cmsDesignerPreviewMode" flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ tr('Pages preview', 'Preview de paginas') }}</strong>
              <q-btn
                flat
                dense
                no-caps
                icon="open_in_new"
                :label="tr('Open in new window', 'Abrir em nova janela')"
                @click="openCmsDesignerPreviewInWindow('pages')"
              />
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-pages__preview">
              <div
                class="cms-preview-toolbar"
                :data-cms-preview-source="cmsPreviewSource"
                :data-cms-preview-viewport="cmsPreviewViewport"
              >
                <q-select
                  v-model="cmsPreviewSource"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsPreviewSourceOptions"
                  :label="tr('Preview source', 'Origem do preview')"
                />
                <q-select
                  v-model="cmsPreviewLocale"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsLocaleOptions"
                  :label="tr('Preview locale', 'Locale do preview')"
                />
                <q-select
                  v-model="cmsPreviewViewport"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsPreviewViewportOptions"
                  :label="tr('Preview viewport', 'Viewport do preview')"
                />
                <div class="cms-preview-toolbar__chips">
                  <q-chip dense square :style="statusChipStyle">{{ cmsPreviewSource }}</q-chip>
                  <q-chip dense square :style="statusChipStyle">{{ cmsPreviewViewport }}</q-chip>
                  <q-chip dense square :style="statusChipStyle">{{ cmsPreviewLocale }}</q-chip>
                  <q-chip v-if="cmsPreviewPublishedReleaseLabel" dense square :style="statusChipStyle">
                    {{ cmsPreviewPublishedReleaseLabel }}
                  </q-chip>
                </div>
              </div>

              <q-banner v-if="cmsPreviewEmptyMessage" rounded class="cms-banner" :style="bannerStyle">
                {{ cmsPreviewEmptyMessage }}
              </q-banner>

              <template v-else>
                <div v-if="cmsPreviewDraftPublishedDiff" class="cms-review-summary">
                  <div class="cms-review-summary__header">
                    <strong>{{ tr('Draft vs published review', 'Revisao rascunho vs publicado') }}</strong>
                    <div class="cms-page-preview__chips">
                      <q-chip dense square :style="statusChipStyle">
                        {{ cmsPreviewDraftPublishedDiff.releaseName }} · {{ cmsPreviewDraftPublishedDiff.releaseEnvironment }}
                      </q-chip>
                      <q-chip
                        dense
                        square
                        :style="cmsPreviewDraftPublishedDiff.hasChanges ? getCmsPreviewDiffStatusStyle('changed') : getCmsPreviewDiffStatusStyle('unchanged')"
                      >
                        {{
                          cmsPreviewDraftPublishedDiff.hasChanges
                            ? tr('Changes detected', 'Mudancas detectadas')
                            : tr('No changes against published', 'Sem mudancas contra o publicado')
                        }}
                      </q-chip>
                    </div>
                  </div>
                  <div class="cms-blocks-summary-grid">
                    <div class="cms-blocks-summary-card">
                      <span>{{ tr('Pages changed', 'Paginas alteradas') }}</span>
                      <strong>{{ getCmsPreviewDiffChangeCount(cmsPreviewDraftPublishedDiff.pageSummary) }}</strong>
                    </div>
                    <div class="cms-blocks-summary-card">
                      <span>{{ tr('Sections changed', 'Secoes alteradas') }}</span>
                      <strong>{{ getCmsPreviewDiffChangeCount(cmsPreviewDraftPublishedDiff.sectionSummary) }}</strong>
                    </div>
                    <div class="cms-blocks-summary-card">
                      <span>{{ tr('Blocks changed', 'Blocos alterados') }}</span>
                      <strong>{{ getCmsPreviewDiffChangeCount(cmsPreviewDraftPublishedDiff.blockSummary) }}</strong>
                    </div>
                  </div>
                  <div v-if="cmsPreviewChangedPageDiffs.length > 0" class="cms-review-summary__list">
                    <article
                      v-for="pageDiff in cmsPreviewChangedPageDiffs.slice(0, 6)"
                      :key="`page-review-${pageDiff.pageId}`"
                      class="cms-review-summary__item"
                    >
                      <q-chip dense square :style="getCmsPreviewDiffStatusStyle(pageDiff.status)">
                        {{ getCmsPreviewDiffStatusLabel(pageDiff.status) }}
                      </q-chip>
                      <div class="cms-review-summary__body">
                        <strong>{{ getCmsPreviewDiffPageLabel(pageDiff) }}</strong>
                        <small v-if="getCmsPreviewDiffPagePath(pageDiff)">{{ getCmsPreviewDiffPagePath(pageDiff) }}</small>
                        <small>
                          {{
                            tr(
                              `${pageDiff.sectionSummary.added} sections added · ${pageDiff.sectionSummary.removed} removed · ${pageDiff.sectionSummary.changed} changed · ${pageDiff.blockSummary.changed + pageDiff.blockSummary.added + pageDiff.blockSummary.removed} block changes`,
                              `${pageDiff.sectionSummary.added} secoes adicionadas · ${pageDiff.sectionSummary.removed} removidas · ${pageDiff.sectionSummary.changed} alteradas · ${pageDiff.blockSummary.changed + pageDiff.blockSummary.added + pageDiff.blockSummary.removed} mudancas em blocos`
                            )
                          }}
                        </small>
                      </div>
                    </article>
                  </div>
                </div>

                <div v-if="cmsPreviewLocaleCoverageMatrix.length > 0" class="cms-review-summary cms-review-summary--locale">
                  <div class="cms-review-summary__header">
                    <strong>{{ tr('Locale coverage matrix', 'Matriz de cobertura por locale') }}</strong>
                    <div class="cms-page-preview__chips">
                      <q-chip dense square :style="statusChipStyle">
                        {{ tr('Active preview', 'Preview ativo') }} · {{ getCmsLocaleCoverageLocaleLabel(cmsPreviewLocale) }}
                      </q-chip>
                      <q-chip
                        v-if="cmsPreviewActiveLocaleCoverage"
                        dense
                        square
                        :style="getCmsLocaleCoverageStatusStyle(cmsPreviewActiveLocaleCoverage.status)"
                      >
                        {{ getCmsLocaleCoverageSummaryLabel(cmsPreviewActiveLocaleCoverage) }}
                      </q-chip>
                    </div>
                  </div>
                  <div class="cms-locale-coverage-grid">
                    <article
                      v-for="summary in cmsPreviewLocaleCoverageMatrix"
                      :key="`pages-locale-coverage-${summary.locale}`"
                      class="cms-locale-coverage-card"
                    >
                      <div class="cms-locale-coverage-card__header">
                        <q-chip dense square :style="statusChipStyle">{{ getCmsLocaleCoverageLocaleLabel(summary.locale) }}</q-chip>
                        <q-chip dense square :style="getCmsLocaleCoverageStatusStyle(summary.status)">
                          {{ getCmsLocaleCoverageStatusLabel(summary.status) }}
                        </q-chip>
                      </div>
                      <small>{{ getCmsLocaleCoverageSummaryLabel(summary) }}</small>
                      <div class="cms-blocks-summary-grid">
                        <div
                          v-for="category in cmsLocaleCoverageCategories"
                          :key="`pages-locale-category-${summary.locale}-${category}`"
                          class="cms-blocks-summary-card"
                        >
                          <span>{{ getCmsLocaleCoverageCategoryLabel(category) }}</span>
                          <strong>{{ summary.categories[category].covered }} / {{ summary.categories[category].total }}</strong>
                          <small>{{ summary.categories[category].percentage }}%</small>
                        </div>
                      </div>
                      <div v-if="summary.missingEntries.length > 0" class="cms-review-summary__list">
                        <article
                          v-for="entry in summary.missingEntries.slice(0, 4)"
                          :key="entry.id"
                          class="cms-review-summary__item"
                        >
                          <q-chip dense square :style="getCmsLocaleCoverageStatusStyle('empty')">
                            {{ getCmsLocaleCoverageCategoryLabel(entry.category) }}
                          </q-chip>
                          <div class="cms-review-summary__body">
                            <strong>{{ entry.label }}</strong>
                            <small>{{ entry.fieldLabel }}</small>
                          </div>
                        </article>
                      </div>
                    </article>
                  </div>
                </div>

                <article
                  v-for="(page, pageIndex) in cmsPreviewPagesForRender"
                  :key="`preview-${cmsPreviewSource}-${page.id}`"
                  class="cms-page-preview"
                >
                  <div class="cms-page-preview__header">
                    <strong>{{ getCmsPageTitleValue(page) }}</strong>
                    <div class="cms-page-preview__chips">
                      <q-chip dense square :style="statusChipStyle">
                        {{ getCmsContentModelLabel(cmsPreviewLocale, page.contentModelId, cmsPreviewAuthoredContentModels) }}
                      </q-chip>
                      <q-chip dense square :style="statusChipStyle">
                        {{
                          `schema v${page.contentModelVersion ?? '?'} / v${getCmsPageCurrentSchemaVersion(page, cmsPreviewAuthoredContentModels)}`
                        }}
                      </q-chip>
                      <q-chip dense square :style="getCmsPageStatusStyle(page.status)">
                        {{ page.status }}
                      </q-chip>
                      <q-chip
                        v-if="cmsPreviewPageDiffMap.get(page.id)"
                        dense
                        square
                        :style="getCmsPreviewDiffStatusStyle(cmsPreviewPageDiffMap.get(page.id)?.status ?? 'unchanged')"
                      >
                        {{ getCmsPreviewDiffStatusLabel(cmsPreviewPageDiffMap.get(page.id)?.status ?? 'unchanged') }}
                      </q-chip>
                    </div>
                  </div>
                  <small class="cms-page-preview__path">{{ page.path }}</small>
                  <p>{{ getCmsPageDescriptionValue(page) || tr('No description provided.', 'Nenhuma descricao informada.') }}</p>

                  <div class="cms-runtime-preview">
                    <div class="cms-runtime-preview__frame" :data-preview-viewport="cmsPreviewViewport">
                      <CmsRenderer
                        :page="toCmsPreviewPageSchema(page)"
                        :registry="landingRegistry"
                        :render-context="cmsPreviewRenderContext"
                      />
                    </div>
                  </div>

                  <div v-if="getCmsPreviewPageDiagnostics(page.id, pageIndex).length > 0" class="cms-diagnostics-list">
                    <div class="cms-diagnostics-list__header">
                      <strong>{{ tr('Content diagnostics', 'Diagnosticos de conteudo') }}</strong>
                      <q-chip dense square :style="statusChipStyle">{{ getCmsPreviewPageDiagnostics(page.id, pageIndex).length }}</q-chip>
                    </div>
                    <article
                      v-for="diagnostic in getCmsPreviewPageDiagnostics(page.id, pageIndex)"
                      :key="diagnostic.id"
                      class="cms-diagnostics-item"
                    >
                      <q-chip dense square :style="getCmsDiagnosticStyle(diagnostic.severity)">
                        {{ diagnostic.severity }}
                      </q-chip>
                      <div class="cms-diagnostics-item__body">
                        <strong>{{ diagnostic.code }}</strong>
                        <small>{{ diagnostic.message }}</small>
                      </div>
                    </article>
                  </div>
                  <div class="cms-page-preview__sections">
                    <q-chip
                      v-for="section in page.sections"
                      :key="`${page.id}-${section.id}`"
                      dense
                      square
                      :style="getCmsPageSectionStyle(section.enabled)"
                    >
                      {{ getCmsSectionLabelValue(section) }}
                    </q-chip>
                  </div>
                </article>
              </template>
            </div>
          </q-card>
        </div>

        <div v-else-if="isBlocksModule" class="cms-shell-page__grid cms-blocks-shell">
          <div class="cms-workspace-tabs" role="tablist" :aria-label="tr('Blocks workspace tabs', 'Abas do workspace de blocos')">
            <button
              type="button"
              role="tab"
              class="cms-workspace-tab"
              :class="{ 'cms-workspace-tab--active': cmsBlocksWorkspaceView === 'editor' && !cmsDesignerPreviewMode }"
              :aria-selected="cmsBlocksWorkspaceView === 'editor' && !cmsDesignerPreviewMode ? 'true' : 'false'"
              @click="cmsDesignerPreviewMode = false; cmsBlocksWorkspaceView = 'editor'"
            >
              {{ tr('Editor', 'Editor') }}
            </button>
            <button
              type="button"
              role="tab"
              class="cms-workspace-tab"
              :class="{ 'cms-workspace-tab--active': cmsBlocksWorkspaceView === 'preview' || cmsDesignerPreviewMode }"
              :aria-selected="cmsBlocksWorkspaceView === 'preview' || cmsDesignerPreviewMode ? 'true' : 'false'"
              @click="cmsDesignerPreviewMode = false; showCmsDesignerPreview('blocks')"
            >
              {{ tr('Preview', 'Preview') }}
            </button>
          </div>
          <q-card v-show="cmsBlocksWorkspaceView === 'editor' && !cmsDesignerPreviewMode" flat bordered class="cms-shell-card cms-designer-card cms-designer-card--blocks">
            <div class="cms-shell-card__header cms-designer-card__toolbar-header">
              <div class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--actions">
                <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--icons">
                  <q-btn flat dense no-caps icon="folder_open" class="cms-designer-card__toolbar-action" :label="tr('Open', 'Abrir')" :aria-label="tr('Open blocks workspace', 'Abrir workspace de blocos')" @click="scrollCmsDesignerSurface('.cms-designer-card--blocks .cms-designer-card__workbench')" />
                  <q-btn flat dense no-caps icon="note_add" class="cms-designer-card__toolbar-action" :label="tr('New', 'Novo')" :disable="!canAddPaletteBlockToActiveSection" :aria-label="tr('Add block', 'Adicionar bloco')" @click="addCmsBuilderBlockFromPalette" />
                  <q-btn flat dense no-caps icon="save" class="cms-designer-card__toolbar-action" :label="cmsUiText.saveLabel" :aria-label="cmsUiText.saveAriaLabel" @click="saveNow" />
                  <q-btn flat dense no-caps icon="undo" class="cms-designer-card__toolbar-action" :label="tr('Undo', 'Desfazer')" :disable="!canUndoCmsAuthoringHistory" :aria-label="tr('Undo', 'Desfazer')" @click="undoCmsAuthoringChange" />
                  <q-btn flat dense no-caps icon="redo" class="cms-designer-card__toolbar-action" :label="tr('Redo', 'Refazer')" :disable="!canRedoCmsAuthoringHistory" :aria-label="tr('Redo', 'Refazer')" @click="redoCmsAuthoringChange" />
                </div>
                <div class="cms-designer-card__toolbar-spacer" />
                <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--preview">
                  <q-btn no-caps unelevated icon="visibility" :label="tr('Preview', 'Preview')" :style="primaryActionStyle" @click="showCmsDesignerPreview('blocks')" />
                </div>
              </div>
              <div class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--info">
                <div class="cms-designer-card__info-strip">
                  <span class="cms-designer-card__info-item">
                    <strong>{{ activeTenantProfileName || tr('Default tenant', 'Tenant padrao') }}</strong>
                  </span>
                  <span class="cms-designer-card__info-item">{{ cmsAutosaveStatusLabel }}</span>
                  <span class="cms-designer-card__info-item">{{ activeItem.label }}</span>
                </div>
              </div>
            </div>
            <div class="cms-shell-card__body cms-blocks__editor">
              <div class="cms-designer-card__ruler-shell cms-designer-card__ruler-shell--blocks">
                <div class="cms-designer-card__ruler-gutter">
                  <q-btn flat dense round icon="chevron_left" :aria-label="tr('Focus block workbench', 'Focar workbench de blocos')" @click="scrollCmsDesignerSurface('.cms-designer-card--blocks .cms-designer-card__workbench')" />
                </div>
                <div class="cms-designer-card__ruler">
                  <span v-for="mark in cmsDesignerRulerMarks" :key="`blocks-ruler-${mark}`" class="cms-designer-card__ruler-mark">
                    {{ mark }}
                  </span>
                </div>
                <div class="cms-designer-card__ruler-meta">
                  <q-chip dense square :style="statusChipStyle">{{ cmsSectionBlocks.length }} {{ tr('blocks', 'blocos') }}</q-chip>
                  <span class="cms-designer-card__ruler-zoom">100%</span>
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="grid_4x4"
                    class="cms-designer-card__ruler-mode"
                    :label="showCmsDesignerStageGrid ? tr('Grid', 'Grade') : tr('Plain', 'Livre')"
                    @click="toggleCmsDesignerStageGrid"
                  />
                </div>
              </div>
              <div class="cms-designer-card__workbench cms-designer-card__workbench--blocks">
                <aside class="cms-designer-card__sidebar cms-blocks__sidebar">
                  <div class="cms-designer-card__sidebar-header">
                    <strong>{{ tr('Block designer', 'Designer de blocos') }}</strong>
                    <small>{{ tr('Keep focus on page, section and block context while authoring reusable pieces.', 'Mantenha foco em pagina, secao e bloco enquanto voce cria pecas reutilizaveis.') }}</small>
                  </div>
                  <div class="cms-designer-card__metrics">
                    <span>{{ tr('Page', 'Pagina') }}: <strong>{{ activeBlocksPage?.title || tr('None selected', 'Nenhuma selecionada') }}</strong></span>
                    <span>{{ tr('Section', 'Secao') }}: <strong>{{ activeBlocksSection?.label || tr('None selected', 'Nenhuma selecionada') }}</strong></span>
                    <span>{{ tr('Block', 'Bloco') }}: <strong>{{ activeBlocksSelectedBlockRecord?.id || tr('None selected', 'Nenhum selecionado') }}</strong></span>
                    <span>{{ tr('Visible sections', 'Secoes visiveis') }}: <strong>{{ filteredActiveBlocksSections.length }}</strong></span>
                  </div>
                </aside>
                <div class="cms-designer-card__stage cms-blocks__stage" :class="{ 'cms-designer-card__stage--plain': !showCmsDesignerStageGrid }">
              <div v-if="cmsBuilderCommandOptions.length > 0" class="cms-form-grid cms-blocks__stage-command-bar">
                <q-select
                  v-model="selectedBuilderCommandId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsBuilderCommandOptions"
                  option-label="label"
                  option-value="value"
                  :label="tr('Quick command', 'Comando rapido')"
                  class="cms-builder-command-select"
                />
                <div class="cms-form-grid__inline-actions">
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="play_arrow"
                    :label="tr('Run', 'Executar')"
                    @click="executeSelectedBuilderCommand"
                  />
                </div>
              </div>
              <p v-if="selectedCmsBuilderCommandOption" class="cms-config-caption cms-pages__toolbar-hint">
                {{ selectedCmsBuilderCommandOption.description }}
              </p>
              <div class="cms-form-grid cms-blocks-toolbar">
                <q-select
                  v-model="activeBlocksPageId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="blocksPageOptions"
                  :label="tr('Target page', 'Pagina alvo')"
                />
                <q-select
                  v-model="activeBlocksSectionId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="blocksSectionOptions"
                  :label="tr('Target section', 'Secao alvo')"
                />
                <q-select
                  v-model="activeBlocksBlockId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="activeBlocksBlockOptions"
                  :label="tr('Target block', 'Bloco alvo')"
                />
                <q-select
                  v-model="selectedPaletteBlockType"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsBlockPaletteOptions"
                  :label="tr('Palette block', 'Bloco da paleta')"
                />
                <q-select
                  v-model="selectedPaletteBlockPresetId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsBlockPresetOptions"
                  option-label="label"
                  option-value="value"
                  :label="tr('Block preset', 'Preset de bloco')"
                />
                <q-btn
                  no-caps
                  unelevated
                  icon="add"
                  :label="tr('Add block', 'Adicionar bloco')"
                  :style="primaryActionStyle"
                  :disable="!canAddPaletteBlockToActiveSection"
                  @click="addCmsBuilderBlockFromPalette"
                />
              </div>
              <p v-if="activeBlocksSectionContractSummary" class="cms-config-caption cms-blocks-toolbar__hint">
                {{ activeBlocksSectionContractSummary }}
              </p>
              <div
                v-if="activeBlocksSection && getCmsSectionFieldDefinitions(activeBlocksSection).length > 0"
                class="cms-page-item__custom-fields cms-blocks-section-fields"
              >
                <div class="cms-page-item__custom-fields-header">
                  <strong>{{ tr('Section schema fields', 'Campos de schema da secao') }}</strong>
                  <small>
                    {{
                      activeBlocksSectionIsLinked
                        ? tr(
                          'This linked section resolves reusable-field values in read-only mode.',
                          'Esta secao vinculada resolve os valores reutilizaveis em modo somente leitura.'
                        )
                        : tr(
                          'Section-level values driven by the active section preset.',
                          'Valores em nivel de secao guiados pelo preset da secao ativa.'
                        )
                    }}
                  </small>
                </div>
                <div class="cms-page-item__custom-fields-groups">
                  <div
                    v-for="group in getCmsSectionFieldGroups(activeBlocksSection)"
                    :key="`section-field-group-${activeBlocksSection.id}-${group.id}`"
                    class="cms-page-item__custom-fields-group"
                  >
                    <div class="cms-page-item__custom-fields-group-header">
                      <strong>{{ group.label }}</strong>
                      <small>
                        {{
                          group.fields.length === 1
                            ? tr('1 field', '1 campo')
                            : tr(`${group.fields.length} fields`, `${group.fields.length} campos`)
                        }}
                      </small>
                    </div>
                    <div class="cms-page-item__custom-fields-grid">
                      <template
                        v-for="field in group.fields"
                        :key="`section-field-${activeBlocksSection.id}-${field.id}`"
                      >
                        <q-input
                          v-if="field.type === 'object' || field.type === 'group'"
                          :model-value="formatCmsJsonFieldValue(getCmsSectionCustomFieldValue(activeBlocksSection, field), field.type === 'group' ? [] : {})"
                          outlined
                          dense
                          type="textarea"
                          autogrow
                          class="cms-page-item__custom-fields-json"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-select
                          v-else-if="field.repeatable && field.type === 'select'"
                          :model-value="normalizeCmsMediaPickerModelValue(getCmsSectionCustomFieldValue(activeBlocksSection, field), true)"
                          outlined
                          dense
                          multiple
                          use-chips
                          emit-value
                          map-options
                          :options="field.options"
                          option-label="label"
                          option-value="value"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <CmsMediaAssetPicker
                          v-else-if="field.repeatable && field.type === 'media-asset'"
                          :model-value="normalizeCmsMediaPickerModelValue(getCmsSectionCustomFieldValue(activeBlocksSection, field), true)"
                          multiple
                          :options="getCmsPageCustomFieldMediaOptions(field)"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          :allowed-kind-labels="getCmsMediaAllowedKindLabels(field.mediaKinds)"
                          :any-kind-label="cmsMediaPickerUiText.anyKindLabel"
                          :selected-preview-label="cmsMediaPickerUiText.selectedAssetsLabel"
                          :no-selection-label="cmsMediaPickerUiText.noSelectionLabel"
                          :no-option-label="cmsMediaPickerUiText.noOptionLabel"
                          :incompatible-label="cmsMediaPickerUiText.incompatibleLabel"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-select
                          v-else-if="field.repeatable && field.type === 'reference'"
                          :model-value="Array.isArray(getCmsSectionCustomFieldValue(activeBlocksSection, field)) ? getCmsSectionCustomFieldValue(activeBlocksSection, field) : []"
                          outlined
                          dense
                          multiple
                          use-chips
                          emit-value
                          map-options
                          :options="getCmsPageCustomFieldReferenceOptions(field)"
                          option-label="label"
                          option-value="value"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-input
                          v-else-if="field.repeatable"
                          :model-value="formatCmsRepeatableFieldValue(getCmsSectionCustomFieldValue(activeBlocksSection, field))"
                          outlined
                          dense
                          type="textarea"
                          autogrow
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-input
                          v-else-if="field.type === 'text'"
                          :model-value="String(getCmsSectionCustomFieldValue(activeBlocksSection, field) ?? '')"
                          outlined
                          dense
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-input
                          v-else-if="field.type === 'textarea'"
                          :model-value="String(getCmsSectionCustomFieldValue(activeBlocksSection, field) ?? '')"
                          outlined
                          dense
                          type="textarea"
                          autogrow
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-input
                          v-else-if="field.type === 'url'"
                          :model-value="String(getCmsSectionCustomFieldValue(activeBlocksSection, field) ?? '')"
                          outlined
                          dense
                          :type="getCmsContentModelFieldHtmlInputType(field.type)"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-input
                          v-else-if="field.type === 'date'"
                          :model-value="String(getCmsSectionCustomFieldValue(activeBlocksSection, field) ?? '')"
                          outlined
                          dense
                          type="date"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-input
                          v-else-if="field.type === 'number'"
                          :model-value="getCmsSectionCustomFieldValue(activeBlocksSection, field) == null ? '' : String(getCmsSectionCustomFieldValue(activeBlocksSection, field))"
                          outlined
                          dense
                          type="number"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-toggle
                          v-else-if="field.type === 'toggle'"
                          :model-value="Boolean(getCmsSectionCustomFieldValue(activeBlocksSection, field))"
                          :label="field.label"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <CmsMediaAssetPicker
                          v-else-if="field.type === 'media-asset'"
                          :model-value="String(getCmsSectionCustomFieldValue(activeBlocksSection, field) ?? '')"
                          :options="getCmsPageCustomFieldMediaOptions(field)"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          clearable
                          :allowed-kind-labels="getCmsMediaAllowedKindLabels(field.mediaKinds)"
                          :any-kind-label="cmsMediaPickerUiText.anyKindLabel"
                          :selected-preview-label="cmsMediaPickerUiText.selectedAssetLabel"
                          :no-selection-label="cmsMediaPickerUiText.noSelectionLabel"
                          :no-option-label="cmsMediaPickerUiText.noOptionLabel"
                          :incompatible-label="cmsMediaPickerUiText.incompatibleLabel"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-select
                          v-else-if="field.type === 'reference'"
                          :model-value="String(getCmsSectionCustomFieldValue(activeBlocksSection, field) ?? '')"
                          outlined
                          dense
                          emit-value
                          map-options
                          :options="getCmsPageCustomFieldReferenceOptions(field)"
                          option-label="label"
                          option-value="value"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                        <q-select
                          v-else
                          :model-value="String(getCmsSectionCustomFieldValue(activeBlocksSection, field) ?? '')"
                          outlined
                          dense
                          emit-value
                          map-options
                          :options="field.options"
                          option-label="label"
                          option-value="value"
                          :label="field.label"
                          :hint="getCmsContentModelFieldHint(field)"
                          :disable="activeBlocksSectionIsLinked"
                          @update:model-value="updateCmsSectionCustomFieldValue(activeBlocksSection, field, $event)"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cms-blocks-toolbar__bulk">
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="done_all"
                  :label="tr('Enable all blocks', 'Ativar todos os blocos')"
                  :disable="!canToggleActiveSectionBlocks"
                  @click="setCmsBuilderSectionBlocksEnabled(true)"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="remove_done"
                  :label="tr('Disable all blocks', 'Desativar todos os blocos')"
                  :disable="!canToggleActiveSectionBlocks"
                  @click="setCmsBuilderSectionBlocksEnabled(false)"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="auto_fix_off"
                  :label="tr('Remove disabled blocks', 'Remover blocos desativados')"
                  :disable="!canRemoveDisabledBlocksFromActiveSection"
                  @click="removeDisabledBlocksFromActiveSection"
                />
              </div>

              <div class="cms-form-grid cms-blocks-reusable-toolbar">
                <q-input
                  v-model="reusableBlockNameDraft"
                  outlined
                  dense
                  :label="tr('Reusable block name', 'Nome do bloco reutilizavel')"
                  :placeholder="activeBlocksSelectedBlockRecord ? resolveCmsBlockDisplayName(activeBlocksSelectedBlockRecord.type) : tr('Select a block first', 'Selecione um bloco primeiro')"
                />
                <q-input
                  v-model="reusableBlockDescriptionDraft"
                  outlined
                  dense
                  :label="tr('Reusable description', 'Descricao reutilizavel')"
                  :placeholder="tr('Optional description for your library item', 'Descricao opcional para o item da biblioteca')"
                />
                <q-select
                  v-model="selectedReusableBlockId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsReusableBlockOptions"
                  :label="tr('Reusable library', 'Biblioteca reutilizavel')"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="library_add"
                  :label="tr('Save selection', 'Salvar selecao')"
                  :disable="!activeBlocksSelectedBlockRecord"
                  @click="saveSelectedBlockAsReusable"
                />
                <q-btn
                  no-caps
                  unelevated
                  icon="content_paste"
                  :label="tr('Insert detached', 'Inserir desvinculado')"
                  :style="primaryActionStyle"
                  :disable="!selectedReusableBlockId || !activeBlocksSectionId || activeBlocksSectionIsLinked"
                  @click="insertSelectedReusableBlock"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="link"
                  :label="tr('Insert linked', 'Inserir vinculado')"
                  :disable="!selectedReusableBlockId || !activeBlocksSectionId || activeBlocksSectionIsLinked"
                  @click="insertSelectedLinkedReusableBlock"
                />
              </div>

              <div class="cms-form-grid cms-blocks-reusable-toolbar">
                <q-input
                  v-model="authoredBlockPresetNameDraft"
                  outlined
                  dense
                  :label="tr('Preset name', 'Nome do preset')"
                  :placeholder="tr('Use the selected block or reusable item as source', 'Use o bloco selecionado ou item reutilizavel como origem')"
                />
                <q-input
                  v-model="authoredBlockPresetDescriptionDraft"
                  outlined
                  dense
                  :label="tr('Preset description', 'Descricao do preset')"
                  :placeholder="tr('Optional preset description', 'Descricao opcional do preset')"
                />
                <q-select
                  v-model="selectedAuthoredBlockPresetId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsAuthoredBlockPresetOptions"
                  :label="tr('Preset library', 'Biblioteca de presets')"
                />
                <q-select
                  v-model="authoredPresetStarterSectionSelections"
                  outlined
                  dense
                  emit-value
                  map-options
                  multiple
                  use-chips
                  :options="cmsPresetStarterSectionOptions"
                  :label="tr('Starter sections', 'Secoes iniciais')"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="style"
                  :label="tr('Save as preset', 'Salvar como preset')"
                  :disable="!activeBlocksSelectedBlockRecord && !selectedReusableBlockId"
                  @click="saveCmsPresetFromCurrentSelection"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="save"
                  :label="tr('Update preset', 'Atualizar preset')"
                  :disable="selectedAuthoredBlockPresetId === 'custom'"
                  @click="updateSelectedCmsPreset"
                />
                <q-btn
                  no-caps
                  unelevated
                  icon="auto_fix_high"
                  :label="tr('Apply preset', 'Aplicar preset')"
                  :style="primaryActionStyle"
                  :disable="selectedAuthoredBlockPresetId === 'custom' || !activeBlocksSelectedBlockRecord || activeBlocksSelectionReadOnly"
                  @click="applySelectedCmsPresetToBlock"
                />
              </div>

              <div class="cms-blocks-library">
                <div class="cms-blocks-library__header">
                  <strong>{{ tr('Reusable block library', 'Biblioteca de blocos reutilizaveis') }}</strong>
                  <div class="cms-blocks-library__header-actions">
                    <q-toggle
                      v-model="showArchivedReusableBlocks"
                      dense
                      :label="tr('Show archived', 'Mostrar arquivados')"
                    />
                    <q-chip dense square :style="statusChipStyle">
                      {{ filteredCmsReusableBlockLibrary.length }}/{{ settings.reusableBlocks.length }}
                    </q-chip>
                  </div>
                </div>

                <div v-if="filteredCmsReusableBlockLibrary.length === 0" class="cms-block-item__empty">
                  <strong>{{ tr('No reusable blocks saved yet.', 'Nenhum bloco reutilizavel salvo ainda.') }}</strong>
                  <small>
                    {{
                      hasCmsBuilderSearch
                        ? tr('No reusable block matched the current search.', 'Nenhum bloco reutilizavel corresponde a busca atual.')
                        : tr(
                          'Select one authored block and use "Save selection" to build your first reusable library item.',
                          'Selecione um bloco authored e use "Salvar selecao" para criar o primeiro item reutilizavel da biblioteca.'
                        )
                    }}
                  </small>
                </div>

                <div
                  v-for="reusableBlock in filteredCmsReusableBlockLibrary"
                  :key="reusableBlock.id"
                  class="cms-reusable-block-row"
                  :class="{ 'cms-reusable-block-row--active': reusableBlock.id === selectedReusableBlockId }"
                >
                  <div class="cms-reusable-block-row__meta">
                    <div class="cms-blocks-library__header">
                      <strong>{{ reusableBlock.name }}</strong>
                      <q-chip dense square :style="statusChipStyle">
                        {{ getCmsReusableBlockUsageCount(reusableBlock.id) }} {{ tr('uses', 'usos') }}
                      </q-chip>
                      </div>
                      <small>{{ resolveCmsBlockDisplayName(reusableBlock.type) }} · {{ reusableBlock.category }}</small>
                      <small v-if="isCmsArchivedEntity(reusableBlock)">{{ tr('Archived', 'Arquivado') }}</small>
                      <small v-if="isCmsDeprecatedEntity(reusableBlock)">
                        {{
                          getCmsReplacementLabel(
                            reusableBlock.replacementEntityId,
                            settings.reusableBlocks,
                            block => block.name
                          )
                            ? `${tr('Deprecated -> replacement', 'Descontinuado -> substituto')}: ${getCmsReplacementLabel(
                              reusableBlock.replacementEntityId,
                              settings.reusableBlocks,
                              block => block.name
                            )}`
                            : tr('Deprecated for new block insertion', 'Descontinuado para nova insercao de blocos')
                        }}
                      </small>
                      <small v-if="isCmsDeprecatedEntity(reusableBlock) && reusableBlock.deprecationNote">{{ reusableBlock.deprecationNote }}</small>
                      <small
                        v-if="isCmsDeprecatedEntity(reusableBlock) && getCmsReplacementAssistantSummaryLabel('reusable-block', reusableBlock.id)"
                      >
                        {{ getCmsReplacementAssistantSummaryLabel('reusable-block', reusableBlock.id) }}
                      </small>
                      <small v-if="isCmsReusableBlockVariant(reusableBlock)">
                        {{ getCmsReusableBlockVariantLabel(reusableBlock) }}
                      </small>
                      <small>{{ getCmsReusableBlockUsageSummaryLabel(reusableBlock.id) }}</small>
                      <small v-if="reusableBlock.description">{{ reusableBlock.description }}</small>
                      <q-select
                        v-if="isCmsDeprecatedEntity(reusableBlock)"
                        :model-value="reusableBlock.replacementEntityId ?? null"
                        outlined
                        dense
                        clearable
                        emit-value
                        map-options
                        :options="getCmsReusableBlockReplacementOptions(reusableBlock)"
                        :label="tr('Replacement block', 'Bloco substituto')"
                        @update:model-value="updateReusableBlockReplacement(reusableBlock.id, $event)"
                      />
                      <q-input
                        v-if="isCmsDeprecatedEntity(reusableBlock)"
                        :model-value="reusableBlock.deprecationNote ?? ''"
                        outlined
                        dense
                        :label="tr('Deprecation note', 'Nota de descontinuacao')"
                        @update:model-value="updateReusableBlockDeprecationNote(reusableBlock.id, $event)"
                      />
                    </div>
                    <div class="cms-reusable-block-row__actions">
                    <q-btn
                      flat
                      dense
                      no-caps
                      icon="fork_right"
                      :label="tr('Create variant', 'Criar variante')"
                      :disable="isCmsArchivedEntity(reusableBlock)"
                      @click="createReusableBlockVariant(reusableBlock.id)"
                    />
                    <q-btn
                      flat
                      dense
                      no-caps
                      icon="ads_click"
                      :label="tr('Use', 'Usar')"
                      :disable="isCmsArchivedEntity(reusableBlock) || isCmsDeprecatedEntity(reusableBlock)"
                      @click="selectedReusableBlockId = reusableBlock.id"
                    />
                    <q-btn
                      v-if="isCmsDeprecatedEntity(reusableBlock) && reusableBlock.replacementEntityId"
                      flat
                      dense
                      no-caps
                      icon="swap_horiz"
                      :label="tr('Use replacement', 'Usar substituto')"
                      @click="selectedReusableBlockId = String(reusableBlock.replacementEntityId ?? '')"
                    />
                    <q-btn
                      v-if="isCmsDeprecatedEntity(reusableBlock) && reusableBlock.replacementEntityId"
                      flat
                      dense
                      no-caps
                      icon="published_with_changes"
                      :label="tr('Apply replacement', 'Aplicar substituto')"
                      :disable="!getCmsReplacementAssistantSummary('reusable-block', reusableBlock.id)?.canApply"
                      @click="applyCmsDeprecatedReplacement('reusable-block', reusableBlock.id)"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="travel_explore"
                      :aria-label="tr('Inspect reusable block usage', 'Inspecionar uso do bloco reutilizavel')"
                      @click="openCmsUsageDrawer('reusable-block', reusableBlock.id, reusableBlock.name, reusableBlock.description ?? '')"
                    />
                      <q-btn
                        flat
                        dense
                        no-caps
                        :icon="isCmsDeprecatedEntity(reusableBlock) ? 'restore_from_trash' : 'history_toggle_off'"
                        :label="isCmsDeprecatedEntity(reusableBlock) ? tr('Reinstate', 'Reativar') : tr('Deprecate', 'Descontinuar')"
                        :style="isCmsDeprecatedEntity(reusableBlock) ? undefined : warningActionStyle"
                        @click="isCmsDeprecatedEntity(reusableBlock) ? undeprecateReusableBlock(reusableBlock.id) : deprecateReusableBlock(reusableBlock.id)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        :icon="isCmsArchivedEntity(reusableBlock) ? 'unarchive' : 'archive'"
                        :label="isCmsArchivedEntity(reusableBlock) ? tr('Restore', 'Restaurar') : tr('Archive', 'Arquivar')"
                        :style="isCmsArchivedEntity(reusableBlock) ? undefined : warningActionStyle"
                        @click="isCmsArchivedEntity(reusableBlock) ? unarchiveReusableBlock(reusableBlock.id) : archiveReusableBlock(reusableBlock.id)"
                      />
                    </div>
                  </div>
                </div>

              <div class="cms-blocks-library">
                <div class="cms-blocks-library__header">
                  <strong>{{ tr('Authored preset library', 'Biblioteca de presets authored') }}</strong>
                  <div class="cms-blocks-library__header-actions">
                    <q-toggle
                      v-model="showArchivedAuthoredBlockPresets"
                      dense
                      :label="tr('Show archived', 'Mostrar arquivados')"
                    />
                    <q-chip dense square :style="statusChipStyle">
                      {{ filteredCmsAuthoredBlockPresetLibrary.length }}/{{ settings.authoredBlockPresets.length }}
                    </q-chip>
                  </div>
                </div>

                <div v-if="filteredCmsAuthoredBlockPresetLibrary.length === 0" class="cms-block-item__empty">
                  <strong>{{ tr('No authored presets saved yet.', 'Nenhum preset authored salvo ainda.') }}</strong>
                  <small>
                    {{
                      hasCmsBuilderSearch
                        ? tr('No preset matched the current search.', 'Nenhum preset corresponde a busca atual.')
                        : tr(
                          'Start from a selected block or reusable item, then save it as a preset for repeatable authoring.',
                          'Comece por um bloco selecionado ou item reutilizavel e depois salve como preset para autoria repetivel.'
                        )
                    }}
                  </small>
                </div>

                <div
                  v-for="preset in filteredCmsAuthoredBlockPresetLibrary"
                  :key="preset.id"
                  class="cms-reusable-block-row"
                  :class="{ 'cms-reusable-block-row--active': preset.id === selectedAuthoredBlockPresetId }"
                >
                  <div class="cms-reusable-block-row__meta">
                    <div class="cms-blocks-library__header">
                      <strong>{{ getCmsAuthoredBlockPresetNameValue(preset) }}</strong>
                      <q-chip dense square :style="statusChipStyle">
                        {{ getCmsAuthoredBlockPresetUsageCount(preset.id) }} {{ tr('uses', 'usos') }}
                      </q-chip>
                    </div>
                    <small>{{ resolveCmsBlockDisplayName(preset.type) }} · {{ preset.category }}</small>
                    <small>{{ getCmsAuthoredPresetStarterSectionsLabel(preset) }}</small>
                    <small v-if="isCmsArchivedEntity(preset)">{{ tr('Archived', 'Arquivado') }}</small>
                    <small v-if="isCmsDeprecatedEntity(preset)">
                      {{
                        getCmsReplacementLabel(
                          preset.replacementEntityId,
                          settings.authoredBlockPresets,
                          authoredPreset => getCmsAuthoredBlockPresetNameValue(authoredPreset)
                        )
                          ? `${tr('Deprecated -> replacement', 'Descontinuado -> substituto')}: ${getCmsReplacementLabel(
                            preset.replacementEntityId,
                            settings.authoredBlockPresets,
                            authoredPreset => getCmsAuthoredBlockPresetNameValue(authoredPreset)
                          )}`
                          : tr('Deprecated for new preset application', 'Descontinuado para nova aplicacao de preset')
                      }}
                    </small>
                    <small v-if="isCmsDeprecatedEntity(preset) && preset.deprecationNote">{{ preset.deprecationNote }}</small>
                    <small
                      v-if="isCmsDeprecatedEntity(preset) && getCmsReplacementAssistantSummaryLabel('authored-block-preset', preset.id)"
                    >
                      {{ getCmsReplacementAssistantSummaryLabel('authored-block-preset', preset.id) }}
                    </small>
                    <small>{{ getCmsAuthoredBlockPresetUsageSummaryLabel(preset.id) }}</small>
                    <small v-if="getCmsAuthoredBlockPresetDescriptionValue(preset)">{{ getCmsAuthoredBlockPresetDescriptionValue(preset) }}</small>
                    <q-select
                      v-if="isCmsDeprecatedEntity(preset)"
                      :model-value="preset.replacementEntityId ?? null"
                      outlined
                      dense
                      clearable
                      emit-value
                      map-options
                      :options="getCmsAuthoredBlockPresetReplacementOptions(preset)"
                      :label="tr('Replacement preset', 'Preset substituto')"
                      @update:model-value="updateCmsAuthoredPresetReplacement(preset.id, $event)"
                    />
                    <q-input
                      v-if="isCmsDeprecatedEntity(preset)"
                      :model-value="preset.deprecationNote ?? ''"
                      outlined
                      dense
                      :label="tr('Deprecation note', 'Nota de descontinuacao')"
                      @update:model-value="updateCmsAuthoredPresetDeprecationNote(preset.id, $event)"
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
                      @click="selectCmsAuthoredPreset(preset.id)"
                    />
                    <q-btn
                      v-if="isCmsDeprecatedEntity(preset) && preset.replacementEntityId"
                      flat
                      dense
                      no-caps
                      icon="swap_horiz"
                      :label="tr('Use replacement', 'Usar substituto')"
                      @click="selectCmsReplacementAuthoredPreset(preset.replacementEntityId)"
                    />
                    <q-btn
                      v-if="isCmsDeprecatedEntity(preset) && preset.replacementEntityId"
                      flat
                      dense
                      no-caps
                      icon="published_with_changes"
                      :label="tr('Apply replacement', 'Aplicar substituto')"
                      :disable="!getCmsReplacementAssistantSummary('authored-block-preset', preset.id)?.canApply"
                      @click="applyCmsDeprecatedReplacement('authored-block-preset', preset.id)"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="travel_explore"
                      :aria-label="tr('Inspect authored preset usage', 'Inspecionar uso do preset authored')"
                      @click="openCmsUsageDrawer(
                        'authored-block-preset',
                        preset.id,
                        getCmsAuthoredBlockPresetNameValue(preset),
                        getCmsAuthoredBlockPresetDescriptionValue(preset)
                      )"
                    />
                    <q-btn
                      flat
                      dense
                      no-caps
                      :icon="isCmsDeprecatedEntity(preset) ? 'restore_from_trash' : 'history_toggle_off'"
                      :label="isCmsDeprecatedEntity(preset) ? tr('Reinstate', 'Reativar') : tr('Deprecate', 'Descontinuar')"
                      :style="isCmsDeprecatedEntity(preset) ? undefined : warningActionStyle"
                      @click="isCmsDeprecatedEntity(preset) ? undeprecateCmsAuthoredPreset(preset.id) : deprecateCmsAuthoredPreset(preset.id)"
                    />
                    <q-btn
                      flat
                      dense
                      no-caps
                      :icon="isCmsArchivedEntity(preset) ? 'unarchive' : 'archive'"
                      :label="isCmsArchivedEntity(preset) ? tr('Restore', 'Restaurar') : tr('Archive', 'Arquivar')"
                      :style="isCmsArchivedEntity(preset) ? undefined : warningActionStyle"
                      @click="isCmsArchivedEntity(preset) ? unarchiveCmsAuthoredPreset(preset.id) : archiveCmsAuthoredPreset(preset.id)"
                    />
                  </div>
                </div>
              </div>

              <div v-if="activeBlocksSections.length === 0" class="cms-block-item__empty cms-block-item__empty--card">
                <strong>{{ tr('This page does not have sections yet.', 'Esta pagina ainda nao possui secoes.') }}</strong>
                <small>
                  {{
                    tr(
                      'Open Pages and apply the content-model scaffold or add your first section before editing blocks.',
                      'Abra Paginas e aplique o scaffold do modelo de conteudo ou adicione a primeira secao antes de editar blocos.'
                    )
                  }}
                </small>
                <div class="cms-empty-state__actions">
                  <q-btn flat dense no-caps icon="web_asset" :label="tr('Open pages', 'Abrir paginas')" @click="openPagesModule" />
                </div>
              </div>
              <div v-else-if="hasCmsBuilderSearch && filteredActiveBlocksSections.length === 0" class="cms-block-item__empty cms-block-item__empty--card">
                <strong>{{ tr('No sections matched the current search.', 'Nenhuma secao corresponde a busca atual.') }}</strong>
                <small>
                  {{
                    tr(
                      'Try another search term or use one quick command to focus a section or block.',
                      'Tente outro termo de busca ou use um comando rapido para focar uma secao ou bloco.'
                    )
                  }}
                </small>
              </div>

              <div v-else class="cms-blocks-list">
                <div
                  v-for="section in filteredActiveBlocksSections"
                  :key="section.id"
                  class="cms-block-item"
                  :class="{ 'cms-block-item--drop-target': blockDropTargetKey === section.id }"
                  @dragover="onCmsBuilderBlockDragOver(section.id, $event)"
                  @drop="onCmsBuilderSectionDrop(section.id, section.blocks.length, $event)"
                >
                  <div class="cms-block-item__meta">
                    <strong>{{ section.label }}</strong>
                    <small>{{ tr(`${section.blocks.length} blocks`, `${section.blocks.length} blocos`) }}</small>
                    <small v-if="section.reusableMode === 'linked'">
                      {{ tr('Linked section - detach in Pages to edit blocks.', 'Secao vinculada - desvincule em Paginas para editar blocos.') }}
                    </small>
                  </div>

                  <div v-if="section.blocks.length === 0" class="cms-block-item__empty">
                    <strong>{{ tr('No blocks in this section yet.', 'Ainda nao existem blocos nesta secao.') }}</strong>
                    <small>
                      {{
                        tr(
                          'Focus this section, choose a compatible palette block and add it, or insert one reusable block.',
                          'Foque esta secao, escolha um bloco compativel da paleta e adicione-o, ou insira um bloco reutilizavel.'
                        )
                      }}
                    </small>
                    <div class="cms-empty-state__actions">
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="ads_click"
                        :label="tr('Focus section', 'Focar secao')"
                        @click="setActiveBlocksSelection(section.id)"
                      />
                      <q-btn
                        v-if="activeBlocksSectionId === section.id"
                        flat
                        dense
                        no-caps
                        icon="add"
                        :label="tr('Add first block', 'Adicionar primeiro bloco')"
                        :disable="!canAddPaletteBlockToActiveSection"
                        @click="addCmsBuilderBlockFromPalette"
                      />
                    </div>
                  </div>

                  <div
                    v-for="block in section.blocks"
                    :key="`${section.id}-${block.id}`"
                    class="cms-block-row"
                    :class="{
                      'cms-block-row--active': block.id === activeBlocksBlockId,
                      'cms-block-row--dragging': draggedBlock?.pageId === block.pageId && draggedBlock?.sectionId === block.sectionId && draggedBlock?.blockId === block.id,
                    }"
                    draggable="true"
                    @dragstart="onCmsBuilderBlockDragStart(block, $event)"
                    @dragend="onCmsBuilderBlockDragEnd"
                    @dragover.stop="onCmsBuilderBlockDragOver(block.sectionId, $event)"
                    @drop.stop="onCmsBuilderBlockDrop(block, $event)"
                  >
                    <div class="cms-block-row__meta">
                      <q-chip dense square :style="getCmsPageSectionStyle(block.enabled)">
                        {{ resolveCmsBlockDisplayName(block.type) }}
                      </q-chip>
                      <q-chip
                        v-if="block.reusableMode"
                        dense
                        square
                        :style="statusChipStyle"
                      >
                        {{
                          block.reusableMode === 'linked'
                            ? `${tr('Linked', 'Vinculado')} · ${getCmsReusableSourceLabel(block.reusableSourceId, 'block')}`
                            : `${tr('Detached', 'Desvinculado')} · ${getCmsReusableSourceLabel(block.reusableSourceId, 'block')}`
                        }}
                      </q-chip>
                      <small>{{ block.id }}</small>
                      <small>{{ block.type }}</small>
                    </div>
                    <div class="cms-block-row__actions">
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="ads_click"
                        :label="tr('Select', 'Selecionar')"
                        @click="setActiveBlocksSelection(block.sectionId, block.id)"
                      />
                      <q-toggle
                        :model-value="block.enabled"
                        :label="tr('Enabled', 'Ativado')"
                        :disable="activeBlocksSectionIsLinked"
                        @update:model-value="updateCmsBuilderBlockEnabled(block, $event)"
                      />
                      <q-btn
                        v-if="block.reusableMode === 'linked' && !activeBlocksSectionIsLinked"
                        flat
                        dense
                        no-caps
                        icon="link_off"
                        :label="tr('Detach', 'Desvincular')"
                        @click="detachCmsBuilderBlockByRecord(block)"
                      />
                      <q-btn
                        v-if="block.reusableSourceId && !activeBlocksSectionIsLinked"
                        flat
                        dense
                        no-caps
                        icon="fork_right"
                        :label="tr('Branch variant', 'Ramificar variante')"
                        @click="branchCmsBuilderBlockToVariant(block)"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="content_copy"
                        :aria-label="tr('Duplicate block', 'Duplicar bloco')"
                        :disable="activeBlocksSectionIsLinked || block.reusableMode === 'linked'"
                        @click="duplicateCmsBuilderBlockByRecord(block)"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="arrow_upward"
                        :disable="activeBlocksSectionIsLinked || block.blockIndex === 0"
                        @click="moveCmsBuilderBlockByRecord(block, 'up')"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="arrow_downward"
                        :disable="activeBlocksSectionIsLinked || block.blockIndex >= section.blocks.length - 1"
                        @click="moveCmsBuilderBlockByRecord(block, 'down')"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="delete"
                        :style="dangerActionStyle"
                        :disable="activeBlocksSectionIsLinked"
                        @click="removeCmsBuilderBlockByRecord(block)"
                      />
                    </div>
                  </div>
                </div>
              </div>
                </div>
                <aside class="cms-designer-card__rail cms-blocks__rail">
                  <div class="cms-designer-card__rail-card">
                    <strong>{{ tr('Selection rail', 'Rail da selecao') }}</strong>
                    <small>{{ tr('Bulk operations stay attached to the current section contract without repeating top-bar actions.', 'Operacoes em lote ficam anexadas ao contrato da secao atual sem repetir as acoes da barra superior.') }}</small>
                    <div class="cms-designer-card__metrics">
                      <span>{{ tr('Blocks in focus section', 'Blocos na secao em foco') }}: <strong>{{ cmsSectionBlocks.length }}</strong></span>
                      <span>{{ tr('Limit reached', 'Limite atingido') }}: <strong>{{ activeBlocksSectionLimitReached ? tr('Yes', 'Sim') : tr('No', 'Nao') }}</strong></span>
                      <span>{{ tr('Linked section', 'Secao vinculada') }}: <strong>{{ activeBlocksSectionIsLinked ? tr('Yes', 'Sim') : tr('No', 'Nao') }}</strong></span>
                    </div>
                  </div>
                  <div class="cms-designer-card__rail-actions">
                    <q-btn round flat icon="done_all" :disable="!canToggleActiveSectionBlocks" :aria-label="tr('Enable all blocks', 'Ativar todos os blocos')" @click="setCmsBuilderSectionBlocksEnabled(true)">
                      <q-tooltip>{{ tr('Enable all blocks', 'Ativar todos os blocos') }}</q-tooltip>
                    </q-btn>
                    <q-btn round flat icon="remove_done" :disable="!canToggleActiveSectionBlocks" :aria-label="tr('Disable all blocks', 'Desativar todos os blocos')" @click="setCmsBuilderSectionBlocksEnabled(false)">
                      <q-tooltip>{{ tr('Disable all blocks', 'Desativar todos os blocos') }}</q-tooltip>
                    </q-btn>
                    <q-btn round flat icon="auto_fix_off" :disable="!canRemoveDisabledBlocksFromActiveSection" :aria-label="tr('Remove disabled blocks', 'Remover blocos desativados')" @click="removeDisabledBlocksFromActiveSection">
                      <q-tooltip>{{ tr('Remove disabled blocks', 'Remover blocos desativados') }}</q-tooltip>
                    </q-btn>
                  </div>
                </aside>
              </div>
              <div class="cms-designer-card__statusbar cms-blocks__statusbar">
                <q-chip dense square :style="statusChipStyle">{{ tr('Sections', 'Secoes') }}: {{ filteredActiveBlocksSections.length }}</q-chip>
                <q-chip dense square :style="statusChipStyle">{{ tr('Blocks', 'Blocos') }}: {{ cmsSectionBlocks.length }}</q-chip>
                <q-chip dense square :style="statusChipStyle">{{ tr('Reusable', 'Reutilizaveis') }}: {{ filteredCmsReusableBlockLibrary.length }}</q-chip>
                <span class="cms-designer-card__status-text">{{ savedAtLabel }}</span>
              </div>
            </div>
          </q-card>

          <q-card v-show="cmsBlocksWorkspaceView === 'preview' || cmsDesignerPreviewMode" flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ tr('Blocks preview', 'Preview de blocos') }}</strong>
              <q-btn
                flat
                dense
                no-caps
                icon="open_in_new"
                :label="tr('Open in new window', 'Abrir em nova janela')"
                @click="openCmsDesignerPreviewInWindow('blocks')"
              />
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-blocks__preview">
              <div
                class="cms-preview-toolbar"
                :data-cms-preview-source="cmsPreviewSource"
                :data-cms-preview-viewport="cmsPreviewViewport"
              >
                <q-select
                  v-model="cmsPreviewSource"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsPreviewSourceOptions"
                  :label="tr('Preview source', 'Origem do preview')"
                />
                <q-select
                  v-model="cmsPreviewLocale"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsLocaleOptions"
                  :label="tr('Preview locale', 'Locale do preview')"
                />
                <q-select
                  v-model="cmsPreviewViewport"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsPreviewViewportOptions"
                  :label="tr('Preview viewport', 'Viewport do preview')"
                />
                <div class="cms-preview-toolbar__chips">
                  <q-chip dense square :style="statusChipStyle">{{ cmsPreviewSource }}</q-chip>
                  <q-chip dense square :style="statusChipStyle">{{ cmsPreviewViewport }}</q-chip>
                  <q-chip dense square :style="statusChipStyle">{{ cmsPreviewLocale }}</q-chip>
                  <q-chip v-if="cmsPreviewPublishedReleaseLabel" dense square :style="statusChipStyle">
                    {{ cmsPreviewPublishedReleaseLabel }}
                  </q-chip>
                </div>
              </div>

              <div class="cms-blocks-summary-grid">
                <div class="cms-blocks-summary-card">
                  <span>{{ tr('Total pages', 'Total de paginas') }}</span>
                  <strong>{{ cmsPreviewPages.length }}</strong>
                </div>
                <div class="cms-blocks-summary-card">
                  <span>{{ tr('Published pages', 'Paginas publicadas') }}</span>
                  <strong>{{ cmsPreviewPublishedPagesCount }}</strong>
                </div>
                <div class="cms-blocks-summary-card">
                  <span>{{ tr('Enabled sections', 'Secoes ativadas') }}</span>
                  <strong>{{ cmsPreviewEnabledSectionsCount }}</strong>
                </div>
                <div class="cms-blocks-summary-card">
                  <span>{{ tr('Enabled blocks', 'Blocos ativados') }}</span>
                  <strong>{{ cmsPreviewEnabledBlocksCount }}</strong>
                </div>
              </div>

              <div v-if="cmsPreviewDraftPublishedDiff" class="cms-review-summary">
                <div class="cms-review-summary__header">
                  <strong>{{ tr('Draft vs published review', 'Revisao rascunho vs publicado') }}</strong>
                  <div class="cms-page-preview__chips">
                    <q-chip
                      dense
                      square
                      :style="cmsPreviewDraftPublishedDiff.hasChanges ? getCmsPreviewDiffStatusStyle('changed') : getCmsPreviewDiffStatusStyle('unchanged')"
                    >
                      {{
                        cmsPreviewDraftPublishedDiff.hasChanges
                          ? tr('Changes detected', 'Mudancas detectadas')
                          : tr('No changes against published', 'Sem mudancas contra o publicado')
                      }}
                    </q-chip>
                  </div>
                </div>
                <div class="cms-blocks-summary-grid">
                  <div class="cms-blocks-summary-card">
                    <span>{{ tr('Page changes', 'Mudancas na pagina') }}</span>
                    <strong>{{ activeBlocksPageDiff ? getCmsPreviewDiffChangeCount(activeBlocksPageDiff.sectionSummary) + getCmsPreviewDiffChangeCount(activeBlocksPageDiff.blockSummary) + (activeBlocksPageDiff.status === 'changed' || activeBlocksPageDiff.status === 'added' || activeBlocksPageDiff.status === 'removed' ? 1 : 0) : 0 }}</strong>
                  </div>
                  <div class="cms-blocks-summary-card">
                    <span>{{ tr('Section changes', 'Mudancas na secao') }}</span>
                    <strong>{{ activeBlocksSectionDiff ? getCmsPreviewDiffChangeCount(activeBlocksSectionDiff.blockSummary) + (activeBlocksSectionDiff.status === 'changed' || activeBlocksSectionDiff.status === 'added' || activeBlocksSectionDiff.status === 'removed' ? 1 : 0) : 0 }}</strong>
                  </div>
                  <div class="cms-blocks-summary-card">
                    <span>{{ tr('Selected block', 'Bloco selecionado') }}</span>
                    <strong>{{ activeBlocksBlockDiff ? getCmsPreviewDiffStatusLabel(activeBlocksBlockDiff.status) : tr('No block', 'Sem bloco') }}</strong>
                  </div>
                </div>
                <div class="cms-review-summary__list">
                  <article v-if="activeBlocksPageDiff" class="cms-review-summary__item">
                    <q-chip dense square :style="getCmsPreviewDiffStatusStyle(activeBlocksPageDiff.status)">
                      {{ getCmsPreviewDiffStatusLabel(activeBlocksPageDiff.status) }}
                    </q-chip>
                    <div class="cms-review-summary__body">
                      <strong>{{ getCmsPreviewDiffPageLabel(activeBlocksPageDiff) }}</strong>
                      <small v-if="getCmsPreviewDiffPagePath(activeBlocksPageDiff)">{{ getCmsPreviewDiffPagePath(activeBlocksPageDiff) }}</small>
                      <small>
                        {{
                          tr(
                            `${activeBlocksPageDiff.sectionSummary.added} sections added · ${activeBlocksPageDiff.sectionSummary.removed} removed · ${activeBlocksPageDiff.sectionSummary.changed} changed`,
                            `${activeBlocksPageDiff.sectionSummary.added} secoes adicionadas · ${activeBlocksPageDiff.sectionSummary.removed} removidas · ${activeBlocksPageDiff.sectionSummary.changed} alteradas`
                          )
                        }}
                      </small>
                    </div>
                  </article>
                  <article v-if="activeBlocksSectionDiff" class="cms-review-summary__item">
                    <q-chip dense square :style="getCmsPreviewDiffStatusStyle(activeBlocksSectionDiff.status)">
                      {{ getCmsPreviewDiffStatusLabel(activeBlocksSectionDiff.status) }}
                    </q-chip>
                    <div class="cms-review-summary__body">
                      <strong>{{ activeBlocksSectionDiff.draftLabel || activeBlocksSectionDiff.publishedLabel || activeBlocksSectionDiff.sectionId }}</strong>
                      <small>
                        {{
                          tr(
                            `${activeBlocksSectionDiff.blockSummary.added} blocks added · ${activeBlocksSectionDiff.blockSummary.removed} removed · ${activeBlocksSectionDiff.blockSummary.changed} changed`,
                            `${activeBlocksSectionDiff.blockSummary.added} blocos adicionados · ${activeBlocksSectionDiff.blockSummary.removed} removidos · ${activeBlocksSectionDiff.blockSummary.changed} alterados`
                          )
                        }}
                      </small>
                    </div>
                  </article>
                  <article v-if="activeBlocksBlockDiff" class="cms-review-summary__item">
                    <q-chip dense square :style="getCmsPreviewDiffStatusStyle(activeBlocksBlockDiff.status)">
                      {{ getCmsPreviewDiffStatusLabel(activeBlocksBlockDiff.status) }}
                    </q-chip>
                    <div class="cms-review-summary__body">
                      <strong>{{ activeBlocksBlockDiff.draftType || activeBlocksBlockDiff.publishedType || activeBlocksBlockDiff.blockId }}</strong>
                      <small>{{ activeBlocksBlockDiff.blockId }}</small>
                    </div>
                  </article>
                </div>
              </div>

              <div v-if="cmsPreviewLocaleCoverageMatrix.length > 0" class="cms-review-summary cms-review-summary--locale">
                <div class="cms-review-summary__header">
                  <strong>{{ tr('Locale coverage matrix', 'Matriz de cobertura por locale') }}</strong>
                  <div class="cms-page-preview__chips">
                    <q-chip dense square :style="statusChipStyle">
                      {{ tr('Active preview', 'Preview ativo') }} · {{ getCmsLocaleCoverageLocaleLabel(cmsPreviewLocale) }}
                    </q-chip>
                    <q-chip
                      v-if="cmsPreviewActiveLocaleCoverage"
                      dense
                      square
                      :style="getCmsLocaleCoverageStatusStyle(cmsPreviewActiveLocaleCoverage.status)"
                    >
                      {{ getCmsLocaleCoverageSummaryLabel(cmsPreviewActiveLocaleCoverage) }}
                    </q-chip>
                  </div>
                </div>
                <div class="cms-locale-coverage-grid">
                  <article
                    v-for="summary in cmsPreviewLocaleCoverageMatrix"
                    :key="`blocks-locale-coverage-${summary.locale}`"
                    class="cms-locale-coverage-card"
                  >
                    <div class="cms-locale-coverage-card__header">
                      <q-chip dense square :style="statusChipStyle">{{ getCmsLocaleCoverageLocaleLabel(summary.locale) }}</q-chip>
                      <q-chip dense square :style="getCmsLocaleCoverageStatusStyle(summary.status)">
                        {{ getCmsLocaleCoverageStatusLabel(summary.status) }}
                      </q-chip>
                    </div>
                    <small>{{ getCmsLocaleCoverageSummaryLabel(summary) }}</small>
                    <div class="cms-blocks-summary-grid">
                      <div
                        v-for="category in cmsLocaleCoverageCategories"
                        :key="`blocks-locale-category-${summary.locale}-${category}`"
                        class="cms-blocks-summary-card"
                      >
                        <span>{{ getCmsLocaleCoverageCategoryLabel(category) }}</span>
                        <strong>{{ summary.categories[category].covered }} / {{ summary.categories[category].total }}</strong>
                        <small>{{ summary.categories[category].percentage }}%</small>
                      </div>
                    </div>
                    <div v-if="summary.missingEntries.length > 0" class="cms-review-summary__list">
                      <article
                        v-for="entry in summary.missingEntries.slice(0, 4)"
                        :key="entry.id"
                        class="cms-review-summary__item"
                      >
                        <q-chip dense square :style="getCmsLocaleCoverageStatusStyle('empty')">
                          {{ getCmsLocaleCoverageCategoryLabel(entry.category) }}
                        </q-chip>
                        <div class="cms-review-summary__body">
                          <strong>{{ entry.label }}</strong>
                          <small>{{ entry.fieldLabel }}</small>
                        </div>
                      </article>
                    </div>
                  </article>
                </div>
              </div>

              <q-banner v-if="cmsPreviewEmptyMessage" rounded class="cms-banner" :style="bannerStyle">
                {{ cmsPreviewEmptyMessage }}
              </q-banner>
              <q-banner
                v-else-if="activeBlocksPreviewMissingFromPublished"
                rounded
                class="cms-banner"
                :style="bannerStyle"
              >
                {{
                  tr(
                    'The selected draft page does not exist in the published snapshot.',
                    'A pagina selecionada no rascunho nao existe no snapshot publicado.'
                  )
                }}
              </q-banner>

              <div v-if="activeBlocksContentDiagnostics.length > 0" class="cms-diagnostics-list">
                <div class="cms-diagnostics-list__header">
                  <strong>{{ tr('Content diagnostics', 'Diagnosticos de conteudo') }}</strong>
                  <q-chip dense square :style="statusChipStyle">{{ activeBlocksContentDiagnostics.length }}</q-chip>
                </div>
                <article
                  v-for="diagnostic in activeBlocksContentDiagnostics"
                  :key="diagnostic.id"
                  class="cms-diagnostics-item"
                >
                  <q-chip dense square :style="getCmsDiagnosticStyle(diagnostic.severity)">
                    {{ diagnostic.severity }}
                  </q-chip>
                  <div class="cms-diagnostics-item__body">
                    <strong>{{ diagnostic.code }}</strong>
                    <small>{{ diagnostic.message }}</small>
                  </div>
                </article>
              </div>

              <div v-if="activeBlocksMediaDiagnostics.length > 0" class="cms-diagnostics-list">
                <div class="cms-diagnostics-list__header">
                  <strong>{{ tr('Media diagnostics', 'Diagnosticos de midia') }}</strong>
                  <q-chip dense square :style="statusChipStyle">{{ activeBlocksMediaDiagnostics.length }}</q-chip>
                </div>
                <article
                  v-for="diagnostic in activeBlocksMediaDiagnostics"
                  :key="diagnostic.id"
                  class="cms-diagnostics-item"
                >
                  <q-chip dense square :style="getCmsDiagnosticStyle(diagnostic.severity)">
                    {{ diagnostic.severity }}
                  </q-chip>
                  <div class="cms-diagnostics-item__body">
                    <strong>{{ diagnostic.code }}</strong>
                    <small>{{ diagnostic.message }}</small>
                  </div>
                </article>
              </div>

              <div class="cms-blocks-props">
                <div class="cms-blocks-props__header">
                  <strong>{{ tr('Selected block props', 'Props do bloco selecionado') }}</strong>
                  <small v-if="activeBlocksSelectedBlockRecord">
                    {{ resolveCmsBlockDisplayName(activeBlocksSelectedBlockRecord.type) }} · {{ getCmsBlockPresetLabel(settings.content.locale, activeBlocksSelectedBlockRecord.presetId, settings.authoredBlockPresets) }} · {{ activeBlocksSelectedBlockRecord.id }} · {{ getActiveCmsAuthoringLocale() }}
                  </small>
                  <small v-else>{{ tr('No block selected', 'Nenhum bloco selecionado') }}</small>
                </div>
                <q-banner
                  v-if="activeBlocksSelectionReadOnly"
                  rounded
                  class="cms-banner"
                  :style="bannerStyle"
                >
                  {{
                    activeBlocksSectionIsLinked
                      ? tr('This section is linked to the reusable library. Detach the section in Pages before editing its blocks.', 'Esta secao esta vinculada a biblioteca reutilizavel. Desvincule a secao em Paginas antes de editar seus blocos.')
                      : tr('This block is linked to the reusable library. Detach it before editing props.', 'Este bloco esta vinculado a biblioteca reutilizavel. Desvincule-o antes de editar props.')
                  }}
                </q-banner>
                <div
                  v-if="activeBlocksSelectedBlock && activeBlocksFieldDefinitions.length > 0"
                  class="cms-blocks-fields"
                >
                  <div
                    v-for="field in activeBlocksFieldDefinitions"
                    :key="field.path"
                    class="cms-blocks-field"
                  >
                    <q-toggle
                      v-if="field.type === 'toggle'"
                      :model-value="Boolean(getActiveBlocksFieldModelValue(field))"
                      :label="field.label"
                      :disable="activeBlocksSelectionReadOnly"
                      @update:model-value="updateActiveBlocksFieldValue(field, $event)"
                    />
                    <CmsMediaAssetPicker
                      v-else-if="field.type === 'media-asset'"
                      :model-value="String(getActiveBlocksFieldModelValue(field) ?? '') || null"
                      clearable
                      :label="field.label"
                      :disable="activeBlocksSelectionReadOnly"
                      :options="getActiveBlocksMediaFieldOptions(field)"
                      :hint="field.help"
                      :allowed-kind-labels="getCmsMediaAllowedKindLabels(field.mediaKinds)"
                      :any-kind-label="cmsMediaPickerUiText.anyKindLabel"
                      :selected-preview-label="cmsMediaPickerUiText.selectedAssetLabel"
                      :no-selection-label="cmsMediaPickerUiText.noSelectionLabel"
                      :no-option-label="cmsMediaPickerUiText.noOptionLabel"
                      :incompatible-label="cmsMediaPickerUiText.incompatibleLabel"
                      @update:model-value="updateActiveBlocksFieldValue(field, $event)"
                    />
                    <q-select
                      v-else-if="field.type === 'select'"
                      :model-value="String(getActiveBlocksFieldModelValue(field) ?? '')"
                      outlined
                      dense
                      emit-value
                      map-options
                      :label="field.label"
                      :disable="activeBlocksSelectionReadOnly"
                      :options="field.options ?? []"
                      @update:model-value="updateActiveBlocksFieldValue(field, $event)"
                    />
                    <q-input
                      v-else-if="field.type === 'textarea'"
                      :model-value="String(getActiveBlocksFieldModelValue(field) ?? '')"
                      outlined
                      dense
                      type="textarea"
                      autogrow
                      :rows="field.rows ?? 3"
                      :label="field.label"
                      :placeholder="field.placeholder"
                      :disable="activeBlocksSelectionReadOnly"
                      @update:model-value="updateActiveBlocksFieldValue(field, $event)"
                    />
                    <q-input
                      v-else-if="field.type === 'number'"
                      :model-value="getActiveBlocksNumberFieldModelValue(field)"
                      outlined
                      dense
                      type="number"
                      :label="field.label"
                      :placeholder="field.placeholder"
                      :disable="activeBlocksSelectionReadOnly"
                      @update:model-value="updateActiveBlocksFieldValue(field, $event)"
                    />
                    <div v-else-if="field.type === 'json'" class="cms-blocks-field__json">
                      <q-input
                        :model-value="String(getActiveBlocksFieldModelValue(field) ?? '')"
                        outlined
                        dense
                        type="textarea"
                        autogrow
                        :rows="field.rows ?? 6"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :disable="activeBlocksSelectionReadOnly"
                        @update:model-value="updateActiveBlocksJsonFieldDraft(field, $event)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="save"
                        :label="tr('Apply field JSON', 'Aplicar JSON do campo')"
                        :disable="activeBlocksSelectionReadOnly"
                        @click="applyActiveBlocksJsonFieldValue(field)"
                      />
                    </div>
                    <q-input
                      v-else
                      :model-value="String(getActiveBlocksFieldModelValue(field) ?? '')"
                      outlined
                      dense
                      :label="field.label"
                      :placeholder="field.placeholder"
                      :disable="activeBlocksSelectionReadOnly"
                      @update:model-value="updateActiveBlocksFieldValue(field, $event)"
                    />
                    <small v-if="field.help">{{ field.help }}</small>
                  </div>
                </div>
                <q-input
                  v-model="activeBlocksPropsDraft"
                  outlined
                  dense
                  type="textarea"
                  autogrow
                  :label="tr('Block props JSON', 'JSON de props do bloco')"
                  :disable="!activeBlocksSelectedBlock || activeBlocksSelectionReadOnly"
                />
                <div class="cms-blocks-props__actions">
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="format_align_left"
                    :label="tr('Format JSON', 'Formatar JSON')"
                    :disable="!activeBlocksSelectedBlock || activeBlocksSelectionReadOnly"
                    @click="formatSelectedBlockPropsDraft"
                  />
                  <q-btn
                    no-caps
                    unelevated
                    icon="save"
                    :label="tr('Apply props', 'Aplicar props')"
                    :style="primaryActionStyle"
                    :disable="!activeBlocksSelectedBlock || activeBlocksSelectionReadOnly"
                    @click="applySelectedBlockPropsDraft"
                  />
                </div>
              </div>

              <div class="cms-preview-card cms-preview-card--content">
                <div
                  v-if="activeBlocksSchema && !cmsPreviewEmptyMessage && !activeBlocksPreviewMissingFromPublished"
                  class="cms-runtime-preview"
                >
                  <div class="cms-runtime-preview__frame" :data-preview-viewport="cmsPreviewViewport">
                    <CmsRenderer
                      :page="activeBlocksSchema"
                      :registry="landingRegistry"
                      :render-context="cmsPreviewRenderContext"
                    />
                  </div>
                </div>
                <p v-else>{{ tr('No page selected for preview.', 'Nenhuma pagina selecionada para preview.') }}</p>
              </div>
            </div>
          </q-card>
        </div>

        <div v-else-if="isMediaModule" class="cms-shell-page__grid">
          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ cmsUiText.mediaSettingsTitle }}</strong>
              <q-chip dense square :style="statusChipStyle">{{ settings.mediaAssets.length }}</q-chip>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-media__editor">
              <div class="cms-form-grid">
                <q-select
                  v-model="selectedMediaAssetId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsMediaAssetOptions"
                  :label="tr('Media library asset', 'Asset da biblioteca de midia')"
                  :hint="tr('Select an asset to edit it or start a blank draft.', 'Selecione um asset para editar ou inicie um rascunho em branco.')"
                />
                <q-select
                  v-model="mediaAssetDraft.kind"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsMediaAssetKindOptions"
                  :label="tr('Asset kind', 'Tipo do asset')"
                />
                <q-input v-model="mediaAssetDraft.name" outlined dense :label="tr('Asset name', 'Nome do asset')" />
                <q-input v-model="mediaAssetDraft.alt" outlined dense :label="tr('Asset alt text', 'Texto alternativo do asset')" />
                <q-input v-model="mediaAssetDraft.url" outlined dense :label="tr('Asset URL', 'URL do asset')" />
                <q-input v-model="mediaAssetDraft.focalPointX" outlined dense type="number" min="0" max="100" :label="tr('Focal point X (0-100)', 'Ponto focal X (0-100)')" />
                <q-input v-model="mediaAssetDraft.focalPointY" outlined dense type="number" min="0" max="100" :label="tr('Focal point Y (0-100)', 'Ponto focal Y (0-100)')" />
                <q-input v-model="mediaAssetDraft.tags" outlined dense :label="tr('Tags (comma separated)', 'Tags (separadas por virgula)')" />
                <q-input v-model="mediaAssetDraft.usage" outlined dense :label="tr('Usage tags (comma separated)', 'Tags de uso (separadas por virgula)')" />
                <q-select
                  v-model="mediaAssetDraft.replaceTargetAssetId"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  :options="cmsMediaReplacementOptions"
                  :label="tr('Replace target asset', 'Asset alvo da substituicao')"
                  :hint="tr('Optional. Use with Replace references to swap runtime bindings safely.', 'Opcional. Use com Substituir referencias para trocar vinculos de runtime com seguranca.')"
                />
                <q-input v-model="mediaAssetDraft.description" outlined dense type="textarea" autogrow :label="tr('Asset description', 'Descricao do asset')" />
              </div>

              <div class="cms-media__actions">
                <q-btn flat no-caps icon="add_photo_alternate" :label="tr('New asset', 'Novo asset')" @click="createNewMediaAssetDraft" />
                <q-btn no-caps unelevated icon="save" :label="tr('Save asset', 'Salvar asset')" :style="primaryActionStyle" @click="saveMediaAssetDraft" />
                <q-btn flat no-caps icon="delete" :label="tr('Delete asset', 'Excluir asset')" :disable="!selectedMediaAssetId" :style="dangerActionStyle" @click="removeSelectedMediaAsset" />
                <q-btn
                  flat
                  no-caps
                  icon="swap_horiz"
                  :label="tr('Replace references', 'Substituir referencias')"
                  :disable="!selectedMediaAssetId || !mediaAssetDraft.replaceTargetAssetId"
                  @click="replaceSelectedMediaAssetReferences"
                />
              </div>

              <div class="cms-media__actions cms-media__actions--secondary">
                <q-btn flat dense no-caps icon="branding_watermark" :label="tr('Apply as brand logo', 'Aplicar como logo da marca')" :disable="!selectedMediaAssetId" @click="applySelectedMediaAssetToBranding('brandLogo')" />
                <q-btn flat dense no-caps icon="web" :label="tr('Apply as favicon', 'Aplicar como favicon')" :disable="!selectedMediaAssetId" @click="applySelectedMediaAssetToBranding('faviconUrl')" />
                <q-btn flat dense no-caps icon="account_circle" :label="tr('Apply as user avatar', 'Aplicar como avatar do usuario')" :disable="!selectedMediaAssetId" @click="applySelectedMediaAssetToBranding('userAvatar')" />
              </div>
              <q-banner rounded class="cms-banner" :style="bannerStyle">
                {{ tr('Media references are tenant-scoped and remain backend-agnostic. Apply any saved asset to branding slots immediately.', 'Referencias de midia sao por tenant e continuam desacopladas de backend. Aplique qualquer asset salvo nos slots de branding imediatamente.') }}
              </q-banner>
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ tr('Media preview', 'Preview de midia') }}</strong>
              <q-chip v-if="cmsMediaDiagnostics.length > 0" dense square :style="getCmsDiagnosticStyle('warning')">
                {{ cmsMediaDiagnostics.length }} {{ tr('diagnostics', 'diagnosticos') }}
              </q-chip>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-media__preview">
              <div v-if="cmsMediaDiagnostics.length > 0" class="cms-diagnostics-list">
                <div class="cms-diagnostics-list__header">
                  <strong>{{ tr('Library diagnostics', 'Diagnosticos da biblioteca') }}</strong>
                </div>
                <article
                  v-for="diagnostic in cmsMediaDiagnostics"
                  :key="diagnostic.id"
                  class="cms-diagnostics-item"
                >
                  <q-chip dense square :style="getCmsDiagnosticStyle(diagnostic.severity)">
                    {{ diagnostic.severity }}
                  </q-chip>
                  <div class="cms-diagnostics-item__body">
                    <strong>{{ diagnostic.code }}</strong>
                    <small>{{ diagnostic.message }}</small>
                  </div>
                </article>
              </div>
              <div v-if="selectedMediaAssetDiagnostics.length > 0" class="cms-diagnostics-list">
                <div class="cms-diagnostics-list__header">
                  <strong>{{ tr('Selected asset diagnostics', 'Diagnosticos do asset selecionado') }}</strong>
                </div>
                <article
                  v-for="diagnostic in selectedMediaAssetDiagnostics"
                  :key="diagnostic.id"
                  class="cms-diagnostics-item"
                >
                  <q-chip dense square :style="getCmsDiagnosticStyle(diagnostic.severity)">
                    {{ diagnostic.severity }}
                  </q-chip>
                  <div class="cms-diagnostics-item__body">
                    <strong>{{ diagnostic.code }}</strong>
                    <small>{{ diagnostic.message }}</small>
                  </div>
                </article>
              </div>
              <article
                v-for="binding in cmsBrandingMediaBindings"
                :key="binding.id"
                class="cms-media-preview-item cms-media-preview-item--binding"
              >
                <div class="cms-media-preview-item__meta">
                  <strong>{{ binding.label }}</strong>
                  <small>{{ binding.description }}</small>
                </div>
                <div class="cms-media-preview-item__tags">
                  <q-chip dense square :style="statusChipStyle">{{ binding.assetName }}</q-chip>
                  <q-chip v-if="binding.assetId" dense square :style="previewChipStyle">{{ binding.assetId }}</q-chip>
                </div>
                <code class="cms-media-preview-item__url">{{ binding.url || tr('No URL configured', 'Nenhuma URL configurada') }}</code>
              </article>
              <article
                v-for="asset in cmsMediaAssets"
                :key="asset.id"
                class="cms-media-preview-item"
                :class="{ 'cms-media-preview-item--active': asset.id === selectedMediaAssetId }"
              >
                <div class="cms-media-preview-item__meta">
                  <strong>{{ asset.name }}</strong>
                  <small>{{ asset.description || getCmsMediaKindLabel(asset.kind) }}</small>
                </div>
                <div class="cms-media-preview-item__visual">
                  <img
                    v-if="isPreviewImageAsset(asset.url)"
                    :src="asset.url"
                    :alt="asset.alt || asset.name"
                  >
                  <q-icon v-else name="image_not_supported" class="cms-icon cms-icon--lg" />
                </div>
                <div class="cms-media-preview-item__tags">
                  <q-chip dense square :style="statusChipStyle">{{ getCmsMediaKindLabel(asset.kind) }}</q-chip>
                  <q-chip dense square :style="previewChipStyle">
                    {{ getCmsMediaUsageCount(asset.id) }} {{ tr('refs', 'refs') }}
                  </q-chip>
                  <q-chip dense square :style="previewChipStyle">
                    {{ getCmsMediaUsageSummaryLabel(asset.id) }}
                  </q-chip>
                  <q-chip v-if="asset.focalPoint" dense square :style="previewChipStyle">
                    FP {{ asset.focalPoint.x }}, {{ asset.focalPoint.y }}
                  </q-chip>
                  <q-chip v-if="asset.replaceTargetAssetId" dense square :style="previewChipStyle">
                    {{ tr('replaces to', 'substitui para') }} {{ asset.replaceTargetAssetId }}
                  </q-chip>
                  <q-chip
                    v-for="tag in asset.tags"
                    :key="`${asset.id}-${tag}`"
                    dense
                    square
                    :style="previewChipStyle"
                  >
                    {{ tag }}
                  </q-chip>
                  <q-chip
                    v-for="diagnostic in getCmsMediaDiagnosticsForAsset(asset.id)"
                    :key="diagnostic.id"
                    dense
                    square
                    :style="getCmsDiagnosticStyle(diagnostic.severity)"
                  >
                    {{ diagnostic.code }}
                  </q-chip>
                </div>
                <code class="cms-media-preview-item__url">{{ asset.url || tr('No URL configured', 'Nenhuma URL configurada') }}</code>
              </article>
            </div>
          </q-card>
        </div>

        <div v-else-if="isReleasesModule" class="cms-shell-page__grid">
          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ cmsUiText.releaseOrchestrationTitle }}</strong>
              <q-chip dense square :style="statusChipStyle">{{ releaseCountLabel }}</q-chip>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-releases__editor">
              <div class="cms-form-grid">
                <q-select
                  v-model="activeReleaseEnvironment"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="releaseEnvironmentOptions"
                  :label="tr('Environment', 'Ambiente')"
                />
                <q-select
                  v-model="selectedReleaseId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="releaseOptions"
                  :label="tr('Active release', 'Release ativo')"
                />
                <q-input
                  v-model="releaseScheduleAt"
                  outlined
                  dense
                  type="datetime-local"
                  :label="tr('Schedule publish at', 'Agendar publicacao para')"
                />
                <q-select
                  v-model="releaseRollbackTargetId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="rollbackTargetOptions"
                  :label="tr('Rollback target', 'Alvo do rollback')"
                />
                <q-select
                  v-model="releasePromotionTargetEnvironment"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="promotionTargetEnvironmentOptions"
                  :label="tr('Promote to environment', 'Promover para ambiente')"
                />
              </div>

              <div class="cms-releases__actions">
                <q-btn
                  no-caps
                  unelevated
                  icon="add"
                  :label="tr('New draft', 'Novo rascunho')"
                  :style="primaryActionStyle"
                  @click="createReleaseDraftFromCurrentSettings"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="fact_check"
                  :label="tr('Validate', 'Validar')"
                  :disable="!selectedReleaseId"
                  @click="validateSelectedReleaseEntry"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="schedule"
                  :label="tr('Schedule', 'Agendar')"
                  :disable="!selectedReleaseId || !releaseScheduleAt"
                  @click="scheduleSelectedReleaseEntry"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="publish"
                  :label="tr('Publish now', 'Publicar agora')"
                  :disable="!selectedReleaseId"
                  @click="publishSelectedReleaseEntry"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="event_available"
                  :label="tr('Run scheduled', 'Executar agendados')"
                  :disable="!releaseEntriesAll.some(item => item.status === 'scheduled')"
                  @click="processDueScheduledReleaseEntries"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="north_east"
                  :label="tr('Promote', 'Promover')"
                  :disable="!selectedReleaseId || !releasePromotionTargetEnvironment || releasePromotionTargetEnvironment === activeReleaseEnvironment"
                  @click="promoteSelectedReleaseEntry"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="restore"
                  :label="tr('Rollback', 'Rollback')"
                  :style="dangerActionStyle"
                  :disable="!selectedReleaseId || !releaseRollbackTargetId"
                  @click="rollbackSelectedReleaseEntry"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="download"
                  :label="tr('Export review package', 'Exportar pacote de revisao')"
                  :disable="!cmsPreviewDraftPublishedDiff"
                  @click="exportCmsDraftComparisonPackage"
                />
              </div>

              <q-banner rounded class="cms-banner" :style="bannerStyle">
                <template v-if="selectedRelease">
                  {{ selectedRelease.name }} · {{ tr('status', 'status') }} {{ selectedRelease.status }} · {{ selectedRelease.validation.errorCount }} {{ tr('errors', 'erros') }} · {{ selectedRelease.validation.warningCount }} {{ tr('warnings', 'avisos') }} · {{ selectedRelease.environment }}
                </template>
                <template v-else>
                  {{ tr('Create a draft release to validate, schedule and publish tenant snapshots.', 'Crie um rascunho de release para validar, agendar e publicar snapshots do tenant.') }}
                </template>
              </q-banner>

              <div
                v-if="selectedReleaseReviewHub"
                class="cms-release-review-hub"
                data-cms-release-review-hub
              >
                <div class="cms-release-review-hub__header">
                  <div class="cms-release-review-hub__copy">
                    <strong>{{ tr('Unified release review', 'Revisao unificada da release') }}</strong>
                    <small>{{ tr('Review changes, locale readiness and publish checklist in one place.', 'Revise mudancas, cobertura de locale e checklist de publicacao em um unico lugar.') }}</small>
                  </div>
                  <div class="cms-release-review-hub__summary">
                    <q-chip dense square :style="getReleaseChecklistStatusStyle(selectedReleaseReviewHub.status)">
                      {{ getReleaseChecklistStatusLabel(selectedReleaseReviewHub.status) }}
                    </q-chip>
                    <q-chip dense square :style="getReleaseChecklistStatusStyle(selectedReleaseReviewHub.diff.status)">
                      {{ selectedReleaseReviewHub.diff.changedPages + selectedReleaseReviewHub.diff.changedSections + selectedReleaseReviewHub.diff.changedBlocks }}
                      {{ tr('change signals', 'sinais de mudanca') }}
                    </q-chip>
                    <q-chip dense square :style="getReleaseChecklistStatusStyle(selectedReleaseReviewHub.locales.status)">
                      {{ selectedReleaseReviewHub.locales.missingEntries }}
                      {{ tr('locale gaps', 'lacunas de locale') }}
                    </q-chip>
                  </div>
                </div>

                <div class="cms-release-review-hub__cards">
                  <article
                    v-for="card in selectedReleaseReviewHub.cards"
                    :key="card.id"
                    class="cms-release-review-hub__card"
                    :data-cms-review-card="card.id"
                    :data-cms-review-status="card.status"
                  >
                    <div class="cms-release-review-hub__card-header">
                      <div class="cms-release-review-hub__card-copy">
                        <strong>{{ getReleaseReviewHubCardLabel(card.id) }}</strong>
                        <small>{{ getReleaseReviewHubCardDescription(card) }}</small>
                      </div>
                      <q-chip dense square :style="getReleaseChecklistStatusStyle(card.status)">
                        {{ getReleaseChecklistStatusLabel(card.status) }}
                      </q-chip>
                    </div>

                    <div class="cms-release-review-hub__metrics">
                      <span
                        v-for="metric in card.metrics"
                        :key="`${card.id}-${metric.id}`"
                        class="cms-release-review-hub__metric"
                      >
                        <strong>{{ metric.value }}</strong>
                        <small>{{ getReleaseReviewHubMetricLabel(card.id, metric.id) }}</small>
                      </span>
                    </div>
                  </article>
                </div>
              </div>

              <div
                v-if="releaseReviewPackageHistoryEntries.length > 0"
                class="cms-release-history"
                data-cms-release-history
              >
                <div class="cms-release-history__header">
                  <div class="cms-release-history__copy">
                    <strong>{{ tr('Review package history', 'Historico de pacotes de revisao') }}</strong>
                    <small>{{ tr('Recent review exports for this environment, with quick recall metadata.', 'Exportacoes recentes de revisao deste ambiente, com metadados para consulta rapida.') }}</small>
                  </div>
                  <q-chip dense square :style="bannerStyle">
                    {{ releaseReviewPackageHistoryEntries.length }}
                    {{ tr('recent exports', 'exports recentes') }}
                  </q-chip>
                </div>

                <div class="cms-release-history__items">
                  <article
                    v-for="entry in releaseReviewPackageHistoryEntries"
                    :key="entry.id"
                    class="cms-release-history__item"
                    :data-cms-review-history-item="entry.id"
                  >
                    <div class="cms-release-history__item-header">
                      <div class="cms-release-history__item-copy">
                        <strong>{{ entry.fileName }}</strong>
                        <small>{{ getReviewPackageHistoryDescription(entry) }}</small>
                      </div>
                      <div class="cms-release-history__item-summary">
                        <q-chip dense square :style="getReleaseChecklistStatusStyle(getReviewPackageHistoryStatus(entry))">
                          {{ getReleaseChecklistStatusLabel(getReviewPackageHistoryStatus(entry)) }}
                        </q-chip>
                        <q-chip
                          v-if="selectedRelease && entry.releaseId === selectedRelease.id"
                          dense
                          square
                          :style="primaryActionStyle"
                        >
                          {{ tr('Current release', 'Release atual') }}
                        </q-chip>
                      </div>
                    </div>

                    <div class="cms-release-history__metrics">
                      <span class="cms-release-history__metric">
                        <strong>{{ entry.changedPages }}</strong>
                        <small>{{ tr('Pages', 'Paginas') }}</small>
                      </span>
                      <span class="cms-release-history__metric">
                        <strong>{{ entry.changedSections }}</strong>
                        <small>{{ tr('Sections', 'Secoes') }}</small>
                      </span>
                      <span class="cms-release-history__metric">
                        <strong>{{ entry.changedBlocks }}</strong>
                        <small>{{ tr('Blocks', 'Blocos') }}</small>
                      </span>
                      <span class="cms-release-history__metric">
                        <strong>{{ entry.localeCoverage.reduce((sum, locale) => sum + locale.missing, 0) }}</strong>
                        <small>{{ tr('Locale gaps', 'Lacunas de locale') }}</small>
                      </span>
                    </div>
                  </article>
                </div>
              </div>

              <div
                class="cms-governance-hub"
                data-cms-governance-hub
              >
                <div class="cms-governance-hub__header">
                  <div class="cms-governance-hub__copy">
                    <strong>{{ tr('Governance workflow and audit', 'Workflow de governanca e auditoria') }}</strong>
                    <small>{{ tr('Track workflow state, revision cadence, audit activity and role-policy readiness for this tenant.', 'Acompanhe estado do workflow, cadencia de revisoes, auditoria e prontidao das politicas de papel deste tenant.') }}</small>
                  </div>
                  <div class="cms-governance-hub__summary">
                    <q-chip dense square :style="getReleaseChecklistStatusStyle(cmsGovernanceHubSummary.status)">
                      {{ getReleaseChecklistStatusLabel(cmsGovernanceHubSummary.status) }}
                    </q-chip>
                    <q-chip dense square :style="bannerStyle">
                      v{{ cmsGovernanceHubSummary.workflow.version }}
                      {{ tr('draft version', 'versao draft') }}
                    </q-chip>
                    <q-chip dense square :style="bannerStyle">
                      {{ cmsGovernanceHubSummary.audit.count }}
                      {{ tr('audit entries', 'entradas de auditoria') }}
                    </q-chip>
                  </div>
                </div>

                <div class="cms-governance-hub__cards">
                  <article
                    v-for="card in cmsGovernanceHubSummary.cards"
                    :key="card.id"
                    class="cms-governance-hub__card"
                    :data-cms-governance-card="card.id"
                    :data-cms-governance-status="card.status"
                  >
                    <div class="cms-governance-hub__card-header">
                      <div class="cms-governance-hub__card-copy">
                        <strong>{{ getGovernanceHubCardLabel(card.id) }}</strong>
                        <small>{{ getGovernanceHubCardDescription(card) }}</small>
                      </div>
                      <q-chip dense square :style="getReleaseChecklistStatusStyle(card.status)">
                        {{ getReleaseChecklistStatusLabel(card.status) }}
                      </q-chip>
                    </div>

                    <div class="cms-governance-hub__metrics">
                      <span
                        v-for="metric in card.metrics"
                        :key="`${card.id}-${metric.id}`"
                        class="cms-governance-hub__metric"
                      >
                        <strong>{{ metric.value }}</strong>
                        <small>{{ getGovernanceHubMetricLabel(card.id, metric.id) }}</small>
                      </span>
                    </div>
                  </article>
                </div>

                <div class="cms-governance-hub__lists">
                  <section class="cms-governance-hub__list">
                    <div class="cms-governance-hub__list-header">
                      <strong>{{ tr('Recent revisions', 'Revisoes recentes') }}</strong>
                      <q-chip dense square :style="bannerStyle">
                        {{ cmsGovernanceHubSummary.revisions.count }}
                        {{ tr('total', 'total') }}
                      </q-chip>
                    </div>
                    <div class="cms-governance-hub__items">
                      <article
                        v-for="revision in cmsGovernanceHubSummary.revisions.recent"
                        :key="`${revision.version}-${revision.at}`"
                        class="cms-governance-hub__item"
                        data-cms-governance-revision
                      >
                        <div class="cms-governance-hub__item-header">
                          <strong>v{{ revision.version }} · {{ getGovernanceWorkflowStatusLabel(revision.status) }}</strong>
                          <small>{{ formatReleaseTimestamp(revision.at) }}</small>
                        </div>
                        <small>{{ getGovernanceActionLabel(revision.action) }} · {{ revision.by }} · {{ getGovernanceRoleLabel(revision.byRole) }}</small>
                        <small>{{ revision.summary }}</small>
                      </article>
                    </div>
                  </section>

                  <section class="cms-governance-hub__list">
                    <div class="cms-governance-hub__list-header">
                      <strong>{{ tr('Recent audit entries', 'Entradas recentes de auditoria') }}</strong>
                      <q-chip dense square :style="bannerStyle">
                        {{ cmsGovernanceHubSummary.audit.topActions.length }}
                        {{ tr('top actions', 'acoes principais') }}
                      </q-chip>
                    </div>
                    <div class="cms-governance-hub__items">
                      <article
                        v-for="entry in cmsGovernanceHubSummary.audit.recent"
                        :key="entry.id"
                        class="cms-governance-hub__item"
                        data-cms-governance-audit
                      >
                        <div class="cms-governance-hub__item-header">
                          <strong>{{ getGovernanceActionLabel(entry.action) }}</strong>
                          <small>{{ formatReleaseTimestamp(entry.at) }}</small>
                        </div>
                        <small>{{ entry.actorId }} · {{ getGovernanceRoleLabel(entry.actorRole) }} · v{{ entry.fromVersion }} → v{{ entry.toVersion }}</small>
                        <small>{{ entry.summary }}</small>
                      </article>
                    </div>
                  </section>

                  <section class="cms-governance-hub__list">
                    <div class="cms-governance-hub__list-header">
                      <strong>{{ tr('Role policies', 'Politicas de papel') }}</strong>
                      <q-chip dense square :style="bannerStyle">
                        {{ cmsGovernanceHubSummary.roles.count }}
                        {{ tr('roles', 'papeis') }}
                      </q-chip>
                    </div>
                    <div class="cms-governance-hub__items">
                      <article
                        v-for="policy in cmsGovernanceHubSummary.roles.policies"
                        :key="policy.role"
                        class="cms-governance-hub__item"
                        data-cms-governance-role
                      >
                        <div class="cms-governance-hub__item-header">
                          <strong>{{ policy.label }}</strong>
                          <small>{{ policy.groupsCount }} {{ tr('groups', 'grupos') }}</small>
                        </div>
                        <small>{{ policy.allowCount }} {{ tr('allow', 'allow') }} · {{ policy.denyCount }} {{ tr('deny', 'deny') }}</small>
                      </article>
                    </div>
                  </section>
                </div>
              </div>

              <div
                v-if="selectedRelease"
                class="cms-release-acknowledgements"
                data-cms-release-acks
              >
                <div class="cms-release-acknowledgements__header">
                  <div class="cms-release-acknowledgements__copy">
                    <strong>{{ tr('Review acknowledgements', 'Reconhecimentos de revisao') }}</strong>
                    <small>{{ tr('Capture lightweight sign-off notes for the current release candidate without requiring backend workflow execution.', 'Capture notas leves de aprovacao para o candidato atual sem exigir execucao de workflow no backend.') }}</small>
                  </div>
                  <div class="cms-release-acknowledgements__summary">
                    <q-chip dense square :style="getReleaseAcknowledgementDecisionStyle('approved')">
                      {{ selectedReleaseAcknowledgementSummary.approvedCount }} {{ tr('approved', 'aprovados') }}
                    </q-chip>
                    <q-chip dense square :style="getReleaseAcknowledgementDecisionStyle('noted')">
                      {{ selectedReleaseAcknowledgementSummary.notedCount }} {{ tr('noted', 'registrados') }}
                    </q-chip>
                    <q-chip dense square :style="getReleaseAcknowledgementDecisionStyle('changes_requested')">
                      {{ selectedReleaseAcknowledgementSummary.changesRequestedCount }} {{ tr('changes requested', 'mudancas solicitadas') }}
                    </q-chip>
                  </div>
                </div>

                <div class="cms-release-acknowledgements__form">
                  <q-select
                    v-model="releaseAcknowledgementDecision"
                    outlined
                    dense
                    emit-value
                    map-options
                    :options="releaseAcknowledgementDecisionOptions"
                    :label="tr('Decision', 'Decisao')"
                    :aria-label="tr('Review acknowledgement decision', 'Decisao do reconhecimento de revisao')"
                  />
                  <q-input
                    v-model="releaseAcknowledgementNote"
                    outlined
                    dense
                    autogrow
                    type="textarea"
                    :label="tr('Acknowledgement note', 'Nota do reconhecimento')"
                    :aria-label="tr('Review acknowledgement note', 'Nota do reconhecimento de revisao')"
                    :placeholder="tr('Optional context for the review decision.', 'Contexto opcional para a decisao de revisao.')"
                  />
                  <q-btn
                    no-caps
                    unelevated
                    icon="fact_check"
                    :label="tr('Add acknowledgement', 'Adicionar reconhecimento')"
                    :style="primaryActionStyle"
                    @click="addSelectedReleaseAcknowledgement"
                  />
                </div>

                <div v-if="selectedReleaseAcknowledgements.length > 0" class="cms-release-acknowledgements__items">
                  <article
                    v-for="entry in selectedReleaseAcknowledgements"
                    :key="entry.id"
                    class="cms-release-acknowledgements__item"
                    :data-cms-release-ack-item="entry.id"
                    :data-cms-release-ack-decision="entry.decision"
                  >
                    <div class="cms-release-acknowledgements__item-header">
                      <div class="cms-release-acknowledgements__item-copy">
                        <strong>{{ getReleaseAcknowledgementDecisionLabel(entry.decision) }}</strong>
                        <small>{{ getReleaseAcknowledgementDescription(entry) }}</small>
                      </div>
                      <q-chip dense square :style="getReleaseAcknowledgementDecisionStyle(entry.decision)">
                        {{ getReleaseAcknowledgementDecisionLabel(entry.decision) }}
                      </q-chip>
                    </div>
                    <p v-if="entry.note" class="cms-release-acknowledgements__note">
                      {{ entry.note }}
                    </p>
                  </article>
                </div>

                <q-banner v-else rounded class="cms-banner" :style="bannerStyle">
                  {{ tr('No acknowledgements recorded yet for this release and environment.', 'Nenhum reconhecimento foi registrado ainda para este release e ambiente.') }}
                </q-banner>
              </div>

              <div v-if="selectedReleaseCandidateChecklist" class="cms-release-checklist">
                <div class="cms-release-checklist__header">
                  <div class="cms-release-checklist__copy">
                    <strong>{{ tr('Release candidate checklist', 'Checklist do candidato a release') }}</strong>
                    <small>{{ tr('Review publish readiness before scheduling or publishing this snapshot.', 'Revise a prontidao para publicar antes de agendar ou publicar este snapshot.') }}</small>
                  </div>
                  <div class="cms-release-checklist__summary">
                    <q-chip dense square :style="getReleaseChecklistStatusStyle('ready')">
                      {{ selectedReleaseCandidateChecklist.summary.readyCount }} {{ tr('ready', 'prontos') }}
                    </q-chip>
                    <q-chip dense square :style="getReleaseChecklistStatusStyle('warning')">
                      {{ selectedReleaseCandidateChecklist.summary.warningCount }} {{ tr('review', 'revisar') }}
                    </q-chip>
                    <q-chip dense square :style="getReleaseChecklistStatusStyle('blocking')">
                      {{ selectedReleaseCandidateChecklist.summary.blockingCount }} {{ tr('blocking', 'bloqueando') }}
                    </q-chip>
                  </div>
                </div>

                <div class="cms-release-checklist__items">
                  <article
                    v-for="item in selectedReleaseCandidateChecklist.items"
                    :key="item.id"
                    class="cms-release-checklist__item"
                    :data-cms-checklist-item="item.id"
                    :data-cms-checklist-status="item.status"
                  >
                    <div class="cms-release-checklist__item-header">
                      <div class="cms-release-checklist__item-copy">
                        <strong>{{ getReleaseChecklistItemLabel(item.id) }}</strong>
                        <small>{{ getReleaseChecklistItemDescription(item) }}</small>
                      </div>
                      <q-chip dense square :style="getReleaseChecklistStatusStyle(item.status)">
                        {{ getReleaseChecklistStatusLabel(item.status) }}
                      </q-chip>
                    </div>

                    <ul v-if="item.issues.length > 0" class="cms-release-checklist__issues">
                      <li v-for="issue in item.issues" :key="`${item.id}-${issue.code}-${issue.path}`">
                        <strong>[{{ issue.severity }}]</strong> {{ issue.message }}
                      </li>
                    </ul>

                    <div
                      v-if="getReleaseChecklistDrilldownActions(item).length > 0 || hasReleaseChecklistValidationShortcut(item)"
                      class="cms-release-checklist__actions"
                    >
                      <q-btn
                        v-if="hasReleaseChecklistValidationShortcut(item)"
                        flat
                        dense
                        no-caps
                        icon="fact_check"
                        :label="tr('Run Validate', 'Executar validar')"
                        @click="runReleaseChecklistValidationShortcut(item)"
                      />
                      <q-btn
                        v-for="action in getReleaseChecklistDrilldownActions(item)"
                        :key="action.id"
                        flat
                        dense
                        no-caps
                        icon="open_in_new"
                        :label="getReleaseChecklistDrilldownLabel(action)"
                        :aria-label="getReleaseChecklistDrilldownLabel(action)"
                        :data-cms-checklist-action="action.target"
                        @click="runReleaseChecklistDrilldown(action)"
                      />
                    </div>
                  </article>
                </div>
              </div>

              <ul v-if="selectedReleaseGateIssues.length > 0" class="cms-release-diagnostics">
                <li v-for="issue in selectedReleaseGateIssues" :key="`${issue.code}-${issue.path}`">
                  <strong>[{{ issue.severity }}]</strong> {{ issue.message }}
                </li>
              </ul>
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ cmsUiText.releaseTimelineTitle }}</strong>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-releases__timeline">
              <article
                v-for="release in releaseTimelineEntries"
                :key="release.id"
                class="cms-release-item"
                :class="{ 'cms-release-item--active': release.id === selectedReleaseId }"
              >
                <div class="cms-release-item__header">
                  <strong>{{ release.name }}</strong>
                  <q-chip dense square :style="getReleaseStatusStyle(release.status)">
                    {{ release.status }}
                  </q-chip>
                </div>
                <small class="cms-release-item__meta">
                  {{ release.id }} · {{ tr('workflow', 'workflow') }} v{{ release.sourceVersion }} · {{ release.environment }}
                </small>
                <p class="cms-release-item__summary">{{ release.summary || tr('No summary provided.', 'Nenhum resumo informado.') }}</p>
                <div class="cms-release-item__metrics">
                  <q-chip dense square :style="release.validation.errorCount > 0 ? getReleaseStatusStyle('rolled_back') : getReleaseStatusStyle('validated')">
                    {{ tr('Errors', 'Erros') }}: {{ release.validation.errorCount }}
                  </q-chip>
                  <q-chip dense square :style="getReleaseStatusStyle('draft')">
                    {{ tr('Warnings', 'Avisos') }}: {{ release.validation.warningCount }}
                  </q-chip>
                </div>
                <div class="cms-release-item__dates">
                  <span>{{ tr('Created', 'Criado') }}: {{ formatReleaseTimestamp(release.createdAt) }}</span>
                  <span>{{ tr('Scheduled', 'Agendado') }}: {{ formatReleaseTimestamp(release.scheduledAt) }}</span>
                  <span>{{ tr('Published', 'Publicado') }}: {{ formatReleaseTimestamp(release.publishedAt) }}</span>
                  <span>{{ tr('Rolled back', 'Revertido') }}: {{ formatReleaseTimestamp(release.rolledBackAt) }}</span>
                </div>
              </article>

              <p v-if="releaseTimelineEntries.length === 0" class="cms-release-item__empty">
                {{ cmsUiText.noReleasesYetMessage }}
              </p>
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ cmsUiText.releaseCalendarTitle }}</strong>
              <q-chip dense square :style="statusChipStyle">{{ tr(`${scheduledReleaseCalendarEntries.length} scheduled`, `${scheduledReleaseCalendarEntries.length} agendados`) }}</q-chip>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-releases__calendar">
              <article
                v-for="entry in scheduledReleaseCalendarEntries"
                :key="entry.id"
                class="cms-release-calendar-item"
              >
                <strong>{{ entry.name }}</strong>
                <small>{{ formatReleaseTimestamp(entry.scheduledAt) }} · {{ entry.environment }}</small>
              </article>
              <p v-if="scheduledReleaseCalendarEntries.length === 0" class="cms-release-item__empty">
                {{ cmsUiText.noScheduledReleasesMessage }}
              </p>

              <q-separator spaced />

              <article
                v-for="conflict in releaseCalendarConflicts"
                :key="conflict.id"
                class="cms-release-calendar-conflict"
              >
                <q-chip
                  dense
                  square
                  :style="conflict.severity === 'error' ? getReleaseStatusStyle('rolled_back') : getReleaseStatusStyle('draft')"
                >
                  {{ conflict.type }}
                </q-chip>
                <p>{{ conflict.message }}</p>
              </article>
              <p v-if="releaseCalendarConflicts.length === 0" class="cms-release-item__empty">
                {{ cmsUiText.noCalendarConflictsMessage }}
              </p>
            </div>
          </q-card>
        </div>

        <div v-else class="cms-shell-page__grid">
          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ settings.content.statusTitle }}</strong>
              <q-chip dense square icon="check_circle" :style="statusChipStyle">{{ settings.content.statusChipLabel }}</q-chip>
            </div>
            <q-separator />
            <div class="cms-shell-card__body">
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
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>{{ settings.content.howToTitle }}</strong>
            </div>
            <q-separator />
            <div class="cms-shell-card__body">
              <p class="q-mb-md">
                {{ settings.content.howToBody }}
              </p>
              <q-banner rounded class="cms-banner" :style="bannerStyle">
                {{ settings.content.howToNextStep }}
              </q-banner>
            </div>
          </q-card>
        </div>
        </div>
      </div>
    </template>
  </NtkAppShell>
  <q-dialog
    v-model="isCmsUsageDrawerOpen"
    position="right"
  >
    <q-card class="cms-usage-drawer">
      <div class="cms-usage-drawer__header">
        <div>
          <strong>{{ tr('Impact analysis', 'Analise de impacto') }}</strong>
          <small>{{ cmsUsageDrawerTarget?.title || tr('Usage details', 'Detalhes de uso') }}</small>
        </div>
        <q-btn flat round dense icon="close" class="cms-usage-drawer__close" @click="isCmsUsageDrawerOpen = false" />
      </div>
      <q-separator />
      <div class="cms-usage-drawer__body">
        <p v-if="cmsUsageDrawerTarget?.subtitle" class="cms-preview-content-text">
          {{ cmsUsageDrawerTarget.subtitle }}
        </p>
        <div class="cms-usage-drawer__summary">
          <q-chip dense square :style="statusChipStyle">
            {{ cmsUsageDrawerSummary?.totalReferences ?? 0 }} {{ tr('refs', 'refs') }}
          </q-chip>
          <small>
            {{
              cmsUsageDrawerTarget
                ? getCmsEntityUsageSummaryLabel(
                  cmsUsageDrawerTarget.entityId,
                  cmsUsageDrawerTarget.kind === 'content-model'
                    ? cmsEntityUsageIndex.contentModels
                    : cmsUsageDrawerTarget.kind === 'authored-block-preset'
                      ? cmsEntityUsageIndex.authoredBlockPresets
                      : cmsUsageDrawerTarget.kind === 'reusable-block'
                        ? cmsEntityUsageIndex.reusableBlocks
                        : cmsEntityUsageIndex.reusableSections
                )
                : tr('No engine usage detected', 'Nenhum uso no engine detectado')
            }}
          </small>
        </div>
        <div v-if="cmsUsageDrawerReferences.length === 0" class="cms-block-item__empty">
          <strong>{{ tr('No usage references found.', 'Nenhuma referencia de uso encontrada.') }}</strong>
          <small>{{ tr('This entity can be changed or deleted safely.', 'Esta entidade pode ser alterada ou removida com seguranca.') }}</small>
        </div>
        <div v-else class="cms-usage-drawer__references">
          <article
            v-for="(reference, referenceIndex) in cmsUsageDrawerReferences"
            :key="`usage-reference-${reference.source}-${reference.pageId || 'none'}-${reference.sectionId || 'none'}-${reference.blockId || 'none'}-${referenceIndex}`"
            class="cms-usage-drawer__reference"
          >
            <div class="cms-usage-drawer__reference-header">
              <strong>{{ reference.label }}</strong>
              <q-chip dense square :style="statusChipStyle">
                {{ getCmsUsageReferenceSourceLabel(reference) }}
              </q-chip>
            </div>
            <small>{{ reference.description }}</small>
            <small v-if="reference.pageId || reference.sectionId || reference.blockId">
              {{
                [
                  reference.pageId ? `page:${reference.pageId}` : null,
                  reference.sectionId ? `section:${reference.sectionId}` : null,
                  reference.blockId ? `block:${reference.blockId}` : null,
                ].filter(Boolean).join(' · ')
              }}
            </small>
          </article>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
/**
 * Landing page/Cms App module.
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'
import { useQuasar } from 'quasar'
import type { AppShellAction } from '../src/components/layout/app-shell.types'
import NtkAppShell from '../src/components/layout/NtkAppShell.vue'
import { CmsRenderer } from '../src/modules/cms/renderer'
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
  loadCmsWhiteLabelSettings,
  normalizeCmsWhiteLabelSettings,
  resetCmsWhiteLabelSettings,
  saveCmsWhiteLabelSettings,
} from '../src/modules/cms/white-label/storage'
import {
  createTenantProfileId,
  loadCmsTenantProfilesState,
  removeCmsTenantProfile,
  saveCmsTenantProfilesState,
  upsertCmsTenantProfile,
} from '../src/modules/cms/white-label/tenant-profiles.storage'
import {
  createCmsTenantExportPayload,
  parseCmsTenantImportPayload,
} from '../src/modules/cms/white-label/tenant-payload'
import {
  createCmsDomainExportPayload,
  parseCmsDomainImportPayload,
  type CmsDomainPayloadDomain,
} from '../src/modules/cms/white-label/domain-payload'
import {
  applyCmsSchemaPackageSnapshot,
  createCmsSchemaExportPayload,
  createCmsSchemaPackageSnapshot,
  parseCmsSchemaImportPayload,
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
  detectCmsThemePresetId,
  isCmsThemeBasePresetId,
  isCmsThemePresetId,
  type CmsThemeBasePresetId,
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
import { createLandingRegistry } from './cms/landing.registry'
import CmsMediaAssetPicker from './cms/CmsMediaAssetPicker.vue'
import {
  getLandingBlockFieldDefinitions,
  getLandingBlockMediaBindingDefinitions,
  type CmsBlockFieldDefinition,
} from './cms/landing.block-fields'
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

type ThemeFieldKey = keyof ReturnType<typeof createDefaultWhiteLabelSettings>['theme']
type ThemeFieldGroup = 'foundation' | 'typography' | 'layout' | 'navigation' | 'header' | 'notifications' | 'landing'
type ThemeFieldSectionId =
  | 'default'
  | 'core'
  | 'landingTypography'
  | 'layoutSpacing'
  | 'layoutDimensions'
  | 'radius'
  | 'shadows'
  | 'motion'
  | 'grayscale'
  | 'sections'
  | 'githubDark'
  | 'sharedDark'
  | 'syntax'
  | 'effects'

interface ThemeField {
  key: ThemeFieldKey
  group: ThemeFieldGroup
  label: string
  isColor?: boolean
  placeholder?: string
  aliases?: ThemeFieldKey[]
  advanced?: boolean
}

interface ThemeFieldGroupDefinition {
  id: ThemeFieldGroup
  label: string
  description: string
}

interface ThemeFieldSectionDefinition {
  id: ThemeFieldSectionId
  label: string
  description: string
}

interface ThemeFieldSection {
  id: ThemeFieldSectionId
  label: string
  description: string
  fields: ThemeField[]
}

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

interface CmsUiText {
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
 * Parses breakpoint values (e.g. "1024" or "1024px") into pixels.
 */
function parseBreakpointToken(value: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''))
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }
  return fallback
}

/**
 * Resolves viewport width with deterministic fallback for tests/SSR.
 */
function resolveViewportWidth(fallback: number): number {
  if (typeof $q.screen.width === 'number' && Number.isFinite($q.screen.width)) {
    return $q.screen.width
  }
  if (typeof window !== 'undefined' && typeof window.innerWidth === 'number' && Number.isFinite(window.innerWidth)) {
    return window.innerWidth
  }
  return fallback
}

/**
 * Handles theme placeholder.
 */
function themePlaceholder(key: ThemeFieldKey): string {
  const value = defaultTheme[key]
  return value ? String(value) : ''
}

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
 * Handles clone white label settings.
 */
function cloneWhiteLabelSettings(value: CmsWhiteLabelSettings): CmsWhiteLabelSettings {
  const rawValue = toRaw(value) as CmsWhiteLabelSettings
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(rawValue)
    } catch {
      return JSON.parse(JSON.stringify(rawValue)) as CmsWhiteLabelSettings
    }
  }
  return JSON.parse(JSON.stringify(rawValue)) as CmsWhiteLabelSettings
}

/**
 * Creates a defensive clone for plain serializable records used by builder drafts.
 */
function cloneSerializableValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      return JSON.parse(JSON.stringify(value)) as T
    }
  }
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Compares two settings snapshots with stable serialization for authoring history.
 */
function areCmsSettingsSnapshotsEqual(
  left: CmsWhiteLabelSettings,
  right: CmsWhiteLabelSettings
): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
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
 * Splits comma-separated media metadata into normalized string arrays.
 */
function parseMediaDraftList(value: string): string[] {
  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
}

/**
 * Parses focal-point authoring inputs into persisted metadata.
 */
function parseMediaDraftFocalPoint(assetDraft: CmsMediaAssetDraft): CmsMediaAssetFocalPointSettings | null {
  const normalizedX = assetDraft.focalPointX.trim()
  const normalizedY = assetDraft.focalPointY.trim()
  if (!normalizedX && !normalizedY) {
    return null
  }

  const x = Number(normalizedX)
  const y = Number(normalizedY)
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
  }

  return {
    x,
    y,
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
const tenantImportInputRef = ref<HTMLInputElement | null>(null)
const domainImportInputRef = ref<HTMLInputElement | null>(null)
const schemaImportInputRef = ref<HTMLInputElement | null>(null)
const selectedDomainTransfer = ref<CmsDomainPayloadDomain>('content')

/**
 * Handles get active tenant profile snapshot.
 */
function getActiveTenantProfileSnapshot(): CmsTenantProfile {
  const activeProfile = tenantProfilesState.value.profiles.find(profile => profile.id === activeTenantProfileId.value)
  if (activeProfile) {
    return activeProfile
  }

  const firstProfile = tenantProfilesState.value.profiles[0]
  if (firstProfile) {
    activeTenantProfileId.value = firstProfile.id
    return firstProfile
  }

  const fallbackSettings = normalizeCmsWhiteLabelSettings(loadCmsWhiteLabelSettings())
  const fallbackProfile: CmsTenantProfile = {
    id: 'default',
    name: 'Default Tenant',
    settings: fallbackSettings,
    updatedAt: new Date().toISOString(),
  }
  tenantProfilesState.value = {
    activeProfileId: fallbackProfile.id,
    profiles: [fallbackProfile],
  }
  activeTenantProfileId.value = fallbackProfile.id
  return fallbackProfile
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

const cmsUiText = computed<CmsUiText>(() => {
  if (resolveCmsLocale(settings.value.content.locale) === 'pt-BR') {
    return {
      autoSaveEnabled: 'Auto-save ativado',
      autoSaveSaving: 'Auto-save salvando',
      autoSaveSaved: 'Auto-save salvo',
      autoSaveRecoveryAvailable: 'Recuperacao disponivel',
      autoSaveError: 'Erro no auto-save',
      autoSaveRestoreLabel: 'Restaurar auto-save',
      autoSaveDiscardLabel: 'Descartar auto-save',
      autoSaveDiscardedLabel: 'Auto-save descartado',
      autoSaveRestoredLabel: 'Auto-save restaurado',
      autoSaveLatestLabel: 'Ultimo auto-save',
      autoSaveCandidateLabel: 'Snapshot para restauracao',
      savedAtPrefix: 'Salvo as',
      tenantProfileTitle: 'Perfil do tenant',
      tenantProfileFieldLabel: 'Perfil do tenant',
      tenantProfileSelectorAriaLabel: 'Seletor de perfil do tenant',
      tenantCreateLabel: 'Novo',
      tenantCreateAriaLabel: 'Criar perfil do tenant',
      tenantDeleteLabel: 'Excluir',
      tenantDeleteAriaLabel: 'Excluir perfil ativo do tenant',
      actionsTitle: 'Acoes',
      saveLabel: 'Salvar',
      saveAriaLabel: 'Salvar configuracoes do tenant',
      resetLabel: 'Resetar',
      resetAriaLabel: 'Resetar configuracoes do tenant para o padrao',
      exportLabel: 'Exportar',
      exportAriaLabel: 'Exportar tenant ativo em JSON',
      importLabel: 'Importar',
      importAriaLabel: 'Importar configuracoes do tenant de JSON',
      importInputAriaLabel: 'Importar arquivo JSON do tenant',
      settingsTabsAriaLabel: 'Secoes de configuracao do CMS',
      showAdvancedOverridesLabel: 'Mostrar overrides avancados',
      themeValuesPresetTitle: 'Preset de valores de tema',
      themeValuesPresetDescription: 'Aplique um conjunto completo de tema antes de ajustar tokens finos.',
      themePresetFieldLabel: 'Preset de tema',
      detectFromCurrentValuesLabel: 'Detectar a partir dos valores atuais',
      pagesBuilderTitle: 'Construtor de paginas',
      addPageLabel: 'Adicionar pagina',
      blocksManagerTitle: 'Gerenciador de blocos',
      mediaSettingsTitle: 'Configuracoes de midia',
      releaseOrchestrationTitle: 'Orquestracao de releases',
      releaseTimelineTitle: 'Timeline de releases',
      releaseCalendarTitle: 'Calendario de releases',
      noReleasesYetMessage: 'Nenhum release ainda. Crie o primeiro rascunho a partir do snapshot atual do tenant.',
      noScheduledReleasesMessage: 'Nenhum release agendado para este ambiente.',
      noCalendarConflictsMessage: 'Nenhum conflito de calendario detectado.',
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
      environmentStagingLabel: 'Homologacao',
      environmentProductionLabel: 'Producao',
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
      selectPromotionTargetEnvironmentLabel: 'Selecione o ambiente alvo para promocao',
      noScheduledReleasesPublishedLabel: 'Nenhum release agendado publicado',
      scheduledReleasesPublishedLabel: (count: number) => `${count} release(s) agendado(s) publicado(s)`,
      releaseNotSetLabel: 'Nao definido',
      releaseInvalidDateLabel: 'Data invalida',
      invalidJsonForFieldLabel: (fieldLabel: string) => `JSON invalido para o campo: ${fieldLabel}`,
      blockPropsMustBeObjectLabel: 'As propriedades do bloco devem ser um objeto JSON',
      invalidBlockPropsJsonLabel: 'JSON invalido para propriedades do bloco selecionado',
      blockPropsUpdatedAtLabel: 'Propriedades do bloco atualizadas as',
      importFailedInvalidJsonLabel: 'Falha na importacao: payload JSON invalido',
      defaultsRestoredLabel: 'Padroes restaurados',
      settingsSavedManuallySummary: 'Configuracoes salvas manualmente',
      defaultsRestoredSummary: 'Padroes restaurados',
    }
  }

  return {
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
})

function buildSavedAtLabel(): string {
  return `${cmsUiText.value.savedAtPrefix} ${new Date().toLocaleTimeString()}`
}

const isPtBrLocale = computed(() => resolveCmsLocale(settings.value.content.locale) === 'pt-BR')

function tr(en: string, ptBr: string): string {
  return isPtBrLocale.value ? ptBr : en
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
const normalizedCmsBuilderSearch = computed(() => normalizeCmsBuilderSearchValue(searchQuery.value))
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
  isCmsThemePresetId(settings.value.themePresetId)
    ? settings.value.themePresetId
    : detectCmsThemePresetId(settings.value.theme, initialThemePresets, defaultTheme)
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

const cmsViewportWidthPx = computed(() => resolveViewportWidth(cmsLayoutBreakpointLgPx.value + 1))

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

const typographyFieldGroupsDefinition: ThemeFieldGroupDefinition[] = [
  {
    id: 'typography',
    label: 'Typography',
    description: 'Font family, weights, sizes and base style.',
  },
]

const layoutFieldGroupsDefinition: ThemeFieldGroupDefinition[] = [
  {
    id: 'layout',
    label: 'Layout and Motion',
    description: 'Radii, spacing and motion tokens for shell structure.',
  },
]

const colorFieldGroupsDefinition: ThemeFieldGroupDefinition[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Base colors reused by page, cards and default text.',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Sidebar states, active item and menu emphasis.',
  },
  {
    id: 'header',
    label: 'Header and Search',
    description: 'Topbar tone, search borders and shell shadows.',
  },
  {
    id: 'notifications',
    label: 'Notifications and Actions',
    description: 'Badges and action highlights.',
  },
  {
    id: 'landing',
    label: 'Landing Colors',
    description: 'Public landing palette, GitHub-like dark tones and code syntax colors.',
  },
]

const landingColorSectionsDefinition: ThemeFieldSectionDefinition[] = [
  {
    id: 'core',
    label: 'Brand Core',
    description: 'Primary/secondary brand anchors and absolute neutral values.',
  },
  {
    id: 'landingTypography',
    label: 'Landing Typography Scale',
    description: 'Public landing text scale used by hero, sections, cards and footer.',
  },
  {
    id: 'layoutSpacing',
    label: 'Layout Spacing',
    description: 'Base spacing scale reused by sections, cards and component blocks.',
  },
  {
    id: 'layoutDimensions',
    label: 'Layout Dimensions',
    description: 'Sizing, clamps and positional offsets used by hero, cards, drawer and CTA button.',
  },
  {
    id: 'radius',
    label: 'Radius Scale',
    description: 'Rounded corner controls for cards, chips and section surfaces.',
  },
  {
    id: 'shadows',
    label: 'Shadows',
    description: 'Primary elevation values used by header, cards and code frame.',
  },
  {
    id: 'motion',
    label: 'Motion and Interaction',
    description: 'Durations, easing and hover/reveal behavior for landing animations.',
  },
  {
    id: 'grayscale',
    label: 'Neutral Scale',
    description: 'Gray ramp consumed by borders, muted text and overlays.',
  },
  {
    id: 'sections',
    label: 'Section Backgrounds',
    description: 'Main light/dark section surfaces used across the landing flow.',
  },
  {
    id: 'githubDark',
    label: 'GitHub Dark Palette',
    description: 'GitHub-style dark tokens used in dark-mode and CTA/footer surfaces.',
  },
  {
    id: 'sharedDark',
    label: 'Shared Dark Surfaces',
    description: 'Unified dark card background, border and text tokens.',
  },
  {
    id: 'syntax',
    label: 'Code Syntax Colors',
    description: 'Code snippet highlighting palette for the landing developer section.',
  },
  {
    id: 'effects',
    label: 'Gradients and Highlights',
    description: 'Theme cards gradient and metallic hero highlight stops.',
  },
]

const colorFields: ThemeField[] = [
  {
    key: 'fontFamily',
    group: 'typography',
    label: 'Font family',
    placeholder: themePlaceholder('fontFamily'),
  },
  {
    key: 'fontFamilyDisplay',
    group: 'typography',
    label: 'Display font family',
    placeholder: themePlaceholder('fontFamilyDisplay'),
  },
  {
    key: 'fontStyleBase',
    group: 'typography',
    label: 'Base font style (normal/italic)',
    placeholder: themePlaceholder('fontStyleBase'),
  },
  {
    key: 'fontWeightRegular',
    group: 'typography',
    label: 'Weight regular',
    placeholder: themePlaceholder('fontWeightRegular'),
  },
  {
    key: 'fontWeightMedium',
    group: 'typography',
    label: 'Weight medium',
    placeholder: themePlaceholder('fontWeightMedium'),
  },
  {
    key: 'fontWeightSemibold',
    group: 'typography',
    label: 'Weight semibold',
    placeholder: themePlaceholder('fontWeightSemibold'),
  },
  {
    key: 'fontWeightBold',
    group: 'typography',
    label: 'Weight bold',
    placeholder: themePlaceholder('fontWeightBold'),
  },
  {
    key: 'fontSizeBase',
    group: 'typography',
    label: 'Base font size',
    placeholder: themePlaceholder('fontSizeBase'),
  },
  {
    key: 'fontSizeTitle',
    group: 'typography',
    label: 'Title font size',
    placeholder: themePlaceholder('fontSizeTitle'),
  },
  {
    key: 'fontSizeTitleApp',
    group: 'typography',
    label: 'App title size',
    placeholder: themePlaceholder('fontSizeTitleApp'),
  },
  {
    key: 'fontSizeBrandTitle',
    group: 'typography',
    label: 'Brand title size',
    placeholder: themePlaceholder('fontSizeBrandTitle'),
  },
  {
    key: 'fontSizeBrandSubtitle',
    group: 'typography',
    label: 'Brand subtitle size',
    placeholder: themePlaceholder('fontSizeBrandSubtitle'),
  },
  {
    key: 'fontSizeItemLabel',
    group: 'typography',
    label: 'Menu label size',
    placeholder: themePlaceholder('fontSizeItemLabel'),
  },
  {
    key: 'fontSizeItemCaption',
    group: 'typography',
    label: 'Menu caption size',
    placeholder: themePlaceholder('fontSizeItemCaption'),
  },
  {
    key: 'fontSizeGroupCaption',
    group: 'typography',
    label: 'Group caption size',
    placeholder: themePlaceholder('fontSizeGroupCaption'),
  },
  {
    key: 'fontSizeGroupCaptionMini',
    group: 'typography',
    label: 'Group mini caption size',
    placeholder: themePlaceholder('fontSizeGroupCaptionMini'),
  },
  {
    key: 'letterSpacingGroupCaption',
    group: 'typography',
    label: 'Group caption letter spacing',
    placeholder: themePlaceholder('letterSpacingGroupCaption'),
  },
  {
    key: 'letterSpacingGroupCaptionMini',
    group: 'typography',
    label: 'Group mini letter spacing',
    placeholder: themePlaceholder('letterSpacingGroupCaptionMini'),
  },
  {
    key: 'lineHeightBrandText',
    group: 'typography',
    label: 'Brand block line height',
    placeholder: themePlaceholder('lineHeightBrandText'),
  },
  {
    key: 'lineHeightItemLabel',
    group: 'typography',
    label: 'Item label line height',
    placeholder: themePlaceholder('lineHeightItemLabel'),
  },
  {
    key: 'lineHeightItemCaption',
    group: 'typography',
    label: 'Item caption line height',
    placeholder: themePlaceholder('lineHeightItemCaption'),
  },
  {
    key: 'borderWidth',
    group: 'layout',
    label: 'Border width',
    placeholder: themePlaceholder('borderWidth'),
  },
  {
    key: 'radiusSm',
    group: 'layout',
    label: 'Radius small',
    placeholder: themePlaceholder('radiusSm'),
  },
  {
    key: 'radiusMd',
    group: 'layout',
    label: 'Radius medium',
    placeholder: themePlaceholder('radiusMd'),
  },
  {
    key: 'radiusLg',
    group: 'layout',
    label: 'Radius large',
    placeholder: themePlaceholder('radiusLg'),
  },
  {
    key: 'radiusItem',
    group: 'layout',
    label: 'Menu item radius',
    placeholder: themePlaceholder('radiusItem'),
  },
  {
    key: 'spacingXs',
    group: 'layout',
    label: 'Spacing XS',
    placeholder: themePlaceholder('spacingXs'),
  },
  {
    key: 'spacingSm',
    group: 'layout',
    label: 'Spacing SM',
    placeholder: themePlaceholder('spacingSm'),
  },
  {
    key: 'spacingMd',
    group: 'layout',
    label: 'Spacing MD',
    placeholder: themePlaceholder('spacingMd'),
  },
  {
    key: 'spacingLg',
    group: 'layout',
    label: 'Spacing LG',
    placeholder: themePlaceholder('spacingLg'),
  },
  {
    key: 'transitionFast',
    group: 'layout',
    label: 'Transition',
    placeholder: themePlaceholder('transitionFast'),
  },
  {
    key: 'itemCaptionOffset',
    group: 'layout',
    label: 'Item caption offset',
    placeholder: themePlaceholder('itemCaptionOffset'),
    advanced: true,
  },
  {
    key: 'menuSlotWidth',
    group: 'layout',
    label: 'Menu slot width',
    placeholder: themePlaceholder('menuSlotWidth'),
    advanced: true,
  },
  {
    key: 'searchWidth',
    group: 'layout',
    label: 'Search width',
    placeholder: themePlaceholder('searchWidth'),
    advanced: true,
  },
  {
    key: 'searchControlHeight',
    group: 'layout',
    label: 'Search control height',
    placeholder: themePlaceholder('searchControlHeight'),
    advanced: true,
  },
  {
    key: 'searchPrependPaddingRight',
    group: 'layout',
    label: 'Search icon right padding',
    placeholder: themePlaceholder('searchPrependPaddingRight'),
    advanced: true,
  },
  {
    key: 'drawerHeaderMinHeight',
    group: 'layout',
    label: 'Drawer header min height',
    placeholder: themePlaceholder('drawerHeaderMinHeight'),
    advanced: true,
  },
  {
    key: 'brandLogoSize',
    group: 'layout',
    label: 'Brand logo size',
    placeholder: themePlaceholder('brandLogoSize'),
    advanced: true,
  },
  {
    key: 'groupCaptionMinHeight',
    group: 'layout',
    label: 'Group caption min height',
    placeholder: themePlaceholder('groupCaptionMinHeight'),
    advanced: true,
  },
  {
    key: 'groupCaptionPadding',
    group: 'layout',
    label: 'Group caption padding',
    placeholder: themePlaceholder('groupCaptionPadding'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniPadding',
    group: 'layout',
    label: 'Group mini padding',
    placeholder: themePlaceholder('groupCaptionMiniPadding'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniMinWidth',
    group: 'layout',
    label: 'Group mini min width',
    placeholder: themePlaceholder('groupCaptionMiniMinWidth'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniHeight',
    group: 'layout',
    label: 'Group mini height',
    placeholder: themePlaceholder('groupCaptionMiniHeight'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniHorizontalPadding',
    group: 'layout',
    label: 'Group mini horizontal padding',
    placeholder: themePlaceholder('groupCaptionMiniHorizontalPadding'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniRadius',
    group: 'layout',
    label: 'Group mini radius',
    placeholder: themePlaceholder('groupCaptionMiniRadius'),
    advanced: true,
  },
  {
    key: 'itemMinHeight',
    group: 'layout',
    label: 'Item min height',
    placeholder: themePlaceholder('itemMinHeight'),
    advanced: true,
  },
  {
    key: 'itemIconSize',
    group: 'layout',
    label: 'Item icon size',
    placeholder: themePlaceholder('itemIconSize'),
    advanced: true,
  },
  {
    key: 'itemHoverTranslateX',
    group: 'layout',
    label: 'Item hover translate X',
    placeholder: themePlaceholder('itemHoverTranslateX'),
    advanced: true,
  },
  {
    key: 'itemActiveBorderWidth',
    group: 'layout',
    label: 'Item active border width',
    placeholder: themePlaceholder('itemActiveBorderWidth'),
    advanced: true,
  },
  {
    key: 'drawerScrollPaddingBottom',
    group: 'layout',
    label: 'Drawer scroll padding bottom',
    placeholder: themePlaceholder('drawerScrollPaddingBottom'),
    advanced: true,
  },
  {
    key: 'workspaceMaxWidth',
    group: 'layout',
    label: 'Workspace max width',
    placeholder: themePlaceholder('workspaceMaxWidth'),
  },
  {
    key: 'viewportHeight',
    group: 'layout',
    label: 'Viewport height',
    placeholder: themePlaceholder('viewportHeight'),
  },
  {
    key: 'compactBreakpoint',
    group: 'layout',
    label: 'Compact breakpoint',
    placeholder: themePlaceholder('compactBreakpoint'),
  },
  {
    key: 'compactPagePadding',
    group: 'layout',
    label: 'Compact page padding',
    placeholder: themePlaceholder('compactPagePadding'),
    advanced: true,
  },
  {
    key: 'compactWorkspaceCardPadding',
    group: 'layout',
    label: 'Compact workspace card padding',
    placeholder: themePlaceholder('compactWorkspaceCardPadding'),
    advanced: true,
  },
  {
    key: 'cmsLayoutBreakpointLg',
    group: 'layout',
    label: 'CMS layout breakpoint LG',
    placeholder: themePlaceholder('cmsLayoutBreakpointLg'),
    advanced: true,
  },
  {
    key: 'cmsLayoutBreakpointMd',
    group: 'layout',
    label: 'CMS layout breakpoint MD',
    placeholder: themePlaceholder('cmsLayoutBreakpointMd'),
    advanced: true,
  },
  {
    key: 'miniItemMarginRight',
    group: 'layout',
    label: 'Mini item margin right',
    placeholder: themePlaceholder('miniItemMarginRight'),
    advanced: true,
  },
  {
    key: 'miniItemAvatarMinWidth',
    group: 'layout',
    label: 'Mini item avatar min width',
    placeholder: themePlaceholder('miniItemAvatarMinWidth'),
    advanced: true,
  },
  {
    key: 'shellBackground',
    group: 'foundation',
    label: 'Shell background',
    isColor: true,
    placeholder: themePlaceholder('shellBackground'),
  },
  {
    key: 'pageBackground',
    group: 'foundation',
    label: 'Page background (outside card)',
    isColor: true,
    placeholder: themePlaceholder('pageBackground'),
  },
  {
    key: 'pageTextColor',
    group: 'foundation',
    label: 'Page text color',
    isColor: true,
    placeholder: themePlaceholder('pageTextColor'),
    aliases: ['searchTextColor'],
  },
  {
    key: 'drawerBackground',
    group: 'foundation',
    label: 'Sidebar background (and cards)',
    isColor: true,
    placeholder: themePlaceholder('drawerBackground'),
    aliases: ['drawerFooterBackground'],
  },
  {
    key: 'drawerFooterBackground',
    group: 'foundation',
    label: 'Surface footer background (override)',
    isColor: true,
    placeholder: themePlaceholder('drawerFooterBackground'),
    advanced: true,
  },
  {
    key: 'drawerTextColor',
    group: 'foundation',
    label: 'Sidebar text color',
    isColor: true,
    placeholder: themePlaceholder('drawerTextColor'),
    aliases: ['itemTextColor', 'itemIconColor', 'brandSubtitleColor', 'groupCaptionColor'],
  },
  {
    key: 'dividerColor',
    group: 'foundation',
    label: 'Divider color',
    isColor: true,
    placeholder: themePlaceholder('dividerColor'),
    aliases: ['titleSeparatorColor'],
  },
  {
    key: 'itemActiveColor',
    group: 'navigation',
    label: 'Primary accent',
    isColor: true,
    placeholder: themePlaceholder('itemActiveColor'),
    aliases: ['itemHoverColor', 'itemIconHoverColor', 'focusColor', 'titleAppColor', 'brandTitleColor'],
  },
  {
    key: 'itemTextColor',
    group: 'navigation',
    label: 'Item text color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemTextColor'),
    advanced: true,
  },
  {
    key: 'itemIconColor',
    group: 'navigation',
    label: 'Item icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemIconColor'),
    advanced: true,
  },
  {
    key: 'itemHoverBackground',
    group: 'navigation',
    label: 'Sidebar item hover background',
    isColor: true,
    placeholder: themePlaceholder('itemHoverBackground'),
  },
  {
    key: 'itemHoverColor',
    group: 'navigation',
    label: 'Item hover text color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemHoverColor'),
    advanced: true,
  },
  {
    key: 'itemIconHoverColor',
    group: 'navigation',
    label: 'Item hover icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemIconHoverColor'),
    advanced: true,
  },
  {
    key: 'itemActiveBackground',
    group: 'navigation',
    label: 'Active background',
    isColor: true,
    placeholder: themePlaceholder('itemActiveBackground'),
  },
  {
    key: 'focusColor',
    group: 'navigation',
    label: 'Focus ring color (override)',
    isColor: true,
    placeholder: themePlaceholder('focusColor'),
    advanced: true,
  },
  {
    key: 'brandTitleColor',
    group: 'navigation',
    label: 'Brand title color (override)',
    isColor: true,
    placeholder: themePlaceholder('brandTitleColor'),
    advanced: true,
  },
  {
    key: 'brandSubtitleColor',
    group: 'navigation',
    label: 'Brand subtitle color (override)',
    isColor: true,
    placeholder: themePlaceholder('brandSubtitleColor'),
    advanced: true,
  },
  {
    key: 'groupCaptionColor',
    group: 'navigation',
    label: 'Group caption color (override)',
    isColor: true,
    placeholder: themePlaceholder('groupCaptionColor'),
    advanced: true,
  },
  {
    key: 'groupSeparatorOpacity',
    group: 'navigation',
    label: 'Group separator opacity',
    placeholder: themePlaceholder('groupSeparatorOpacity'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniBackground',
    group: 'navigation',
    label: 'Group mini background',
    isColor: true,
    placeholder: themePlaceholder('groupCaptionMiniBackground'),
  },
  {
    key: 'headerBackground',
    group: 'header',
    label: 'Header background',
    isColor: true,
    placeholder: themePlaceholder('headerBackground'),
  },
  {
    key: 'headerTextColor',
    group: 'header',
    label: 'Header text color',
    isColor: true,
    placeholder: themePlaceholder('headerTextColor'),
    aliases: ['toolbarButtonColor', 'titleTextColor', 'searchIconColor'],
  },
  {
    key: 'toolbarButtonColor',
    group: 'header',
    label: 'Toolbar icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('toolbarButtonColor'),
    advanced: true,
  },
  {
    key: 'titleAppColor',
    group: 'header',
    label: 'App title color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleAppColor'),
    advanced: true,
  },
  {
    key: 'titleTextColor',
    group: 'header',
    label: 'Module title color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleTextColor'),
    advanced: true,
  },
  {
    key: 'titleSeparatorColor',
    group: 'header',
    label: 'Title separator color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleSeparatorColor'),
    advanced: true,
  },
  {
    key: 'titleSeparatorSize',
    group: 'header',
    label: 'Title separator size',
    placeholder: themePlaceholder('titleSeparatorSize'),
  },
  {
    key: 'searchBackground',
    group: 'header',
    label: 'Search background',
    isColor: true,
    placeholder: themePlaceholder('searchBackground'),
  },
  {
    key: 'searchTextColor',
    group: 'header',
    label: 'Search text color (override)',
    isColor: true,
    placeholder: themePlaceholder('searchTextColor'),
    advanced: true,
  },
  {
    key: 'searchIconColor',
    group: 'header',
    label: 'Search icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('searchIconColor'),
    advanced: true,
  },
  {
    key: 'searchBorder',
    group: 'header',
    label: 'Search border',
    isColor: true,
    placeholder: themePlaceholder('searchBorder'),
  },
  {
    key: 'searchBorderHover',
    group: 'header',
    label: 'Search border hover',
    isColor: true,
    placeholder: themePlaceholder('searchBorderHover'),
  },
  {
    key: 'headerShadow',
    group: 'header',
    label: 'Header shadow',
    placeholder: themePlaceholder('headerShadow'),
  },
  {
    key: 'headerZIndex',
    group: 'header',
    label: 'Header z-index',
    placeholder: themePlaceholder('headerZIndex'),
    advanced: true,
  },
  {
    key: 'headerBlur',
    group: 'header',
    label: 'Header blur',
    placeholder: themePlaceholder('headerBlur'),
  },
  {
    key: 'drawerShadow',
    group: 'header',
    label: 'Drawer shadow',
    placeholder: themePlaceholder('drawerShadow'),
  },
  {
    key: 'drawerZIndex',
    group: 'header',
    label: 'Drawer z-index',
    placeholder: themePlaceholder('drawerZIndex'),
    advanced: true,
  },
  {
    key: 'drawerFooterShadow',
    group: 'header',
    label: 'Drawer footer shadow',
    placeholder: themePlaceholder('drawerFooterShadow'),
  },
  {
    key: 'actionBackground',
    group: 'header',
    label: 'Header actions background',
    isColor: true,
    placeholder: themePlaceholder('actionBackground'),
  },
  {
    key: 'actionHoverBackground',
    group: 'header',
    label: 'Header actions hover background (hover only)',
    isColor: true,
    placeholder: themePlaceholder('actionHoverBackground'),
  },
  {
    key: 'actionHoverTranslateY',
    group: 'header',
    label: 'Header actions hover translate Y',
    placeholder: themePlaceholder('actionHoverTranslateY'),
  },
  {
    key: 'userAvatarSize',
    group: 'header',
    label: 'User avatar size',
    placeholder: themePlaceholder('userAvatarSize'),
  },
  {
    key: 'notificationSuccessColor',
    group: 'notifications',
    label: 'Success color',
    isColor: true,
    placeholder: themePlaceholder('notificationSuccessColor'),
  },
  {
    key: 'notificationSuccessTextColor',
    group: 'notifications',
    label: 'Success text color',
    isColor: true,
    placeholder: themePlaceholder('notificationSuccessTextColor'),
  },
  {
    key: 'notificationWarningColor',
    group: 'notifications',
    label: 'Warning color',
    isColor: true,
    placeholder: themePlaceholder('notificationWarningColor'),
  },
  {
    key: 'notificationWarningTextColor',
    group: 'notifications',
    label: 'Warning text color',
    isColor: true,
    placeholder: themePlaceholder('notificationWarningTextColor'),
  },
  {
    key: 'notificationErrorColor',
    group: 'notifications',
    label: 'Error color',
    isColor: true,
    placeholder: themePlaceholder('notificationErrorColor'),
  },
  {
    key: 'notificationErrorTextColor',
    group: 'notifications',
    label: 'Error text color',
    isColor: true,
    placeholder: themePlaceholder('notificationErrorTextColor'),
  },
  {
    key: 'notificationInfoColor',
    group: 'notifications',
    label: 'Info color',
    isColor: true,
    placeholder: themePlaceholder('notificationInfoColor'),
  },
  {
    key: 'notificationInfoTextColor',
    group: 'notifications',
    label: 'Info text color',
    isColor: true,
    placeholder: themePlaceholder('notificationInfoTextColor'),
  },
  {
    key: 'notificationBadgeColor',
    group: 'notifications',
    label: 'Notification badge color',
    isColor: true,
    placeholder: themePlaceholder('notificationBadgeColor'),
  },
  {
    key: 'notificationBadgeTextColor',
    group: 'notifications',
    label: 'Notification badge text color',
    isColor: true,
    placeholder: themePlaceholder('notificationBadgeTextColor'),
  },
  {
    key: 'notificationIconColor',
    group: 'notifications',
    label: 'Notification bell icon color',
    isColor: true,
    placeholder: themePlaceholder('notificationIconColor'),
  },
  {
    key: 'badgePulseScale',
    group: 'notifications',
    label: 'Badge pulse scale',
    placeholder: themePlaceholder('badgePulseScale'),
    advanced: true,
  },
  {
    key: 'landingFontSize2xs',
    group: 'landing',
    label: 'Font size 2xs',
    placeholder: themePlaceholder('landingFontSize2xs'),
  },
  {
    key: 'landingFontSizeXsTight',
    group: 'landing',
    label: 'Font size xs tight',
    placeholder: themePlaceholder('landingFontSizeXsTight'),
  },
  {
    key: 'landingFontSizeSmTight',
    group: 'landing',
    label: 'Font size sm tight',
    placeholder: themePlaceholder('landingFontSizeSmTight'),
  },
  {
    key: 'landingFontSizeSmPlus',
    group: 'landing',
    label: 'Font size sm plus',
    placeholder: themePlaceholder('landingFontSizeSmPlus'),
  },
  {
    key: 'landingFontSizeMdPlus',
    group: 'landing',
    label: 'Font size md plus',
    placeholder: themePlaceholder('landingFontSizeMdPlus'),
  },
  {
    key: 'landingFontSizeLgPlus',
    group: 'landing',
    label: 'Font size lg plus',
    placeholder: themePlaceholder('landingFontSizeLgPlus'),
  },
  {
    key: 'landingFontSizeXlPlus',
    group: 'landing',
    label: 'Font size xl plus',
    placeholder: themePlaceholder('landingFontSizeXlPlus'),
  },
  {
    key: 'landingFontSizeDisplaySm',
    group: 'landing',
    label: 'Display font size sm',
    placeholder: themePlaceholder('landingFontSizeDisplaySm'),
  },
  {
    key: 'landingFontSizeDisplayMd',
    group: 'landing',
    label: 'Display font size md',
    placeholder: themePlaceholder('landingFontSizeDisplayMd'),
  },
  {
    key: 'landingFontSizeDisplayLg',
    group: 'landing',
    label: 'Display font size lg',
    placeholder: themePlaceholder('landingFontSizeDisplayLg'),
  },
  {
    key: 'landingFontSizeDisplayXl',
    group: 'landing',
    label: 'Display font size xl',
    placeholder: themePlaceholder('landingFontSizeDisplayXl'),
  },
  {
    key: 'landingFontSizeDisplay2xl',
    group: 'landing',
    label: 'Display font size 2xl',
    placeholder: themePlaceholder('landingFontSizeDisplay2xl'),
  },
  {
    key: 'landingFontSizeDisplay3xl',
    group: 'landing',
    label: 'Display font size 3xl',
    placeholder: themePlaceholder('landingFontSizeDisplay3xl'),
  },
  {
    key: 'landingSpaceXs',
    group: 'landing',
    label: 'Spacing xs',
    placeholder: themePlaceholder('landingSpaceXs'),
  },
  {
    key: 'landingSpaceSm',
    group: 'landing',
    label: 'Spacing sm',
    placeholder: themePlaceholder('landingSpaceSm'),
  },
  {
    key: 'landingSpaceMd',
    group: 'landing',
    label: 'Spacing md',
    placeholder: themePlaceholder('landingSpaceMd'),
  },
  {
    key: 'landingSpaceLg',
    group: 'landing',
    label: 'Spacing lg',
    placeholder: themePlaceholder('landingSpaceLg'),
  },
  {
    key: 'landingSpaceXl',
    group: 'landing',
    label: 'Spacing xl',
    placeholder: themePlaceholder('landingSpaceXl'),
  },
  {
    key: 'landingSpace2xl',
    group: 'landing',
    label: 'Spacing 2xl',
    placeholder: themePlaceholder('landingSpace2xl'),
  },
  {
    key: 'landingSpace3xl',
    group: 'landing',
    label: 'Spacing 3xl',
    placeholder: themePlaceholder('landingSpace3xl'),
  },
  {
    key: 'landingRadiusXs',
    group: 'landing',
    label: 'Radius xs',
    placeholder: themePlaceholder('landingRadiusXs'),
  },
  {
    key: 'landingRadiusSm',
    group: 'landing',
    label: 'Radius sm',
    placeholder: themePlaceholder('landingRadiusSm'),
  },
  {
    key: 'landingRadiusMd',
    group: 'landing',
    label: 'Radius md',
    placeholder: themePlaceholder('landingRadiusMd'),
  },
  {
    key: 'landingRadiusLg',
    group: 'landing',
    label: 'Radius lg',
    placeholder: themePlaceholder('landingRadiusLg'),
  },
  {
    key: 'landingRadiusXl',
    group: 'landing',
    label: 'Radius xl',
    placeholder: themePlaceholder('landingRadiusXl'),
    advanced: true,
  },
  {
    key: 'landingRadiusRound',
    group: 'landing',
    label: 'Radius round',
    placeholder: themePlaceholder('landingRadiusRound'),
    advanced: true,
  },
  {
    key: 'landingRadiusPill',
    group: 'landing',
    label: 'Radius pill',
    placeholder: themePlaceholder('landingRadiusPill'),
  },
  {
    key: 'landingShadowHeader',
    group: 'landing',
    label: 'Shadow header',
    placeholder: themePlaceholder('landingShadowHeader'),
  },
  {
    key: 'landingShadowEmphasis',
    group: 'landing',
    label: 'Shadow emphasis',
    placeholder: themePlaceholder('landingShadowEmphasis'),
  },
  {
    key: 'landingShadowTopbarScrolled',
    group: 'landing',
    label: 'Shadow topbar scrolled',
    placeholder: themePlaceholder('landingShadowTopbarScrolled'),
  },
  {
    key: 'landingShadowCodeFrame',
    group: 'landing',
    label: 'Shadow code frame',
    placeholder: themePlaceholder('landingShadowCodeFrame'),
  },
  {
    key: 'landingShadowCodeFrameHover',
    group: 'landing',
    label: 'Shadow code frame hover',
    placeholder: themePlaceholder('landingShadowCodeFrameHover'),
  },
  {
    key: 'landingEasingStandard',
    group: 'landing',
    label: 'Easing standard',
    placeholder: themePlaceholder('landingEasingStandard'),
  },
  {
    key: 'landingTransitionFast',
    group: 'landing',
    label: 'Transition fast',
    placeholder: themePlaceholder('landingTransitionFast'),
  },
  {
    key: 'landingTransitionNormal',
    group: 'landing',
    label: 'Transition normal',
    placeholder: themePlaceholder('landingTransitionNormal'),
  },
  {
    key: 'landingTransitionSlow',
    group: 'landing',
    label: 'Transition slow',
    placeholder: themePlaceholder('landingTransitionSlow'),
  },
  {
    key: 'landingRevealDistance',
    group: 'landing',
    label: 'Reveal distance',
    placeholder: themePlaceholder('landingRevealDistance'),
  },
  {
    key: 'landingRevealDuration',
    group: 'landing',
    label: 'Reveal duration',
    placeholder: themePlaceholder('landingRevealDuration'),
  },
  {
    key: 'landingRevealThreshold',
    group: 'landing',
    label: 'Reveal threshold',
    placeholder: themePlaceholder('landingRevealThreshold'),
    advanced: true,
  },
  {
    key: 'landingRevealRootMargin',
    group: 'landing',
    label: 'Reveal root margin',
    placeholder: themePlaceholder('landingRevealRootMargin'),
    advanced: true,
  },
  {
    key: 'landingImageHoverZoomScale',
    group: 'landing',
    label: 'Image hover zoom scale',
    placeholder: themePlaceholder('landingImageHoverZoomScale'),
  },
  {
    key: 'landingImageHoverZoomDuration',
    group: 'landing',
    label: 'Image hover zoom duration',
    placeholder: themePlaceholder('landingImageHoverZoomDuration'),
  },
  {
    key: 'landingImageHoverZoomEasing',
    group: 'landing',
    label: 'Image hover zoom easing',
    placeholder: themePlaceholder('landingImageHoverZoomEasing'),
    advanced: true,
  },
  {
    key: 'landingComponentCardHoverScale',
    group: 'landing',
    label: 'Card hover scale',
    placeholder: themePlaceholder('landingComponentCardHoverScale'),
  },
  {
    key: 'landingComponentCardHoverLift',
    group: 'landing',
    label: 'Card hover lift',
    placeholder: themePlaceholder('landingComponentCardHoverLift'),
  },
  {
    key: 'landingComponentCardAccentWidth',
    group: 'landing',
    label: 'Card accent width',
    placeholder: themePlaceholder('landingComponentCardAccentWidth'),
  },
  {
    key: 'landingComponentCardAccentOpacity',
    group: 'landing',
    label: 'Card accent opacity',
    placeholder: themePlaceholder('landingComponentCardAccentOpacity'),
  },
  {
    key: 'landingComponentCardAccentEasing',
    group: 'landing',
    label: 'Card accent easing',
    placeholder: themePlaceholder('landingComponentCardAccentEasing'),
    advanced: true,
  },
  {
    key: 'landingCodeBlockHoverScale',
    group: 'landing',
    label: 'Code block hover scale',
    placeholder: themePlaceholder('landingCodeBlockHoverScale'),
  },
  {
    key: 'landingTopbarEnterDuration',
    group: 'landing',
    label: 'Topbar enter duration',
    placeholder: themePlaceholder('landingTopbarEnterDuration'),
  },
  {
    key: 'landingTopbarEnterOffset',
    group: 'landing',
    label: 'Topbar enter offset',
    placeholder: themePlaceholder('landingTopbarEnterOffset'),
  },
  {
    key: 'landingPulseDotDuration',
    group: 'landing',
    label: 'Pulse dot duration',
    placeholder: themePlaceholder('landingPulseDotDuration'),
  },
  {
    key: 'landingPulseDotEasing',
    group: 'landing',
    label: 'Pulse dot easing',
    placeholder: themePlaceholder('landingPulseDotEasing'),
    advanced: true,
  },
  {
    key: 'landingFloatDuration',
    group: 'landing',
    label: 'Float duration',
    placeholder: themePlaceholder('landingFloatDuration'),
  },
  {
    key: 'landingFloatEasing',
    group: 'landing',
    label: 'Float easing',
    placeholder: themePlaceholder('landingFloatEasing'),
    advanced: true,
  },
  {
    key: 'landingFloatDelaySm',
    group: 'landing',
    label: 'Float delay sm',
    placeholder: themePlaceholder('landingFloatDelaySm'),
  },
  {
    key: 'landingFloatDelayMd',
    group: 'landing',
    label: 'Float delay md',
    placeholder: themePlaceholder('landingFloatDelayMd'),
  },
  {
    key: 'landingFloatDelayLg',
    group: 'landing',
    label: 'Float delay lg',
    placeholder: themePlaceholder('landingFloatDelayLg'),
  },
  {
    key: 'landingFloatDelayXl',
    group: 'landing',
    label: 'Float delay xl',
    placeholder: themePlaceholder('landingFloatDelayXl'),
  },
  {
    key: 'landingLayoutContainIntrinsicSize',
    group: 'landing',
    label: 'Contain intrinsic size',
    placeholder: themePlaceholder('landingLayoutContainIntrinsicSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutContainerMaxWidth',
    group: 'landing',
    label: 'Container max width',
    placeholder: themePlaceholder('landingLayoutContainerMaxWidth'),
  },
  {
    key: 'landingLayoutTopbarBackdropBlur',
    group: 'landing',
    label: 'Topbar backdrop blur',
    placeholder: themePlaceholder('landingLayoutTopbarBackdropBlur'),
  },
  {
    key: 'landingLayoutTopbarActionSize',
    group: 'landing',
    label: 'Topbar action size',
    placeholder: themePlaceholder('landingLayoutTopbarActionSize'),
  },
  {
    key: 'landingLayoutTopbarIndicatorOffset',
    group: 'landing',
    label: 'Topbar indicator offset',
    placeholder: themePlaceholder('landingLayoutTopbarIndicatorOffset'),
    advanced: true,
  },
  {
    key: 'landingLayoutTopbarIndicatorHeight',
    group: 'landing',
    label: 'Topbar indicator height',
    placeholder: themePlaceholder('landingLayoutTopbarIndicatorHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutButtonGap',
    group: 'landing',
    label: 'Button gap',
    placeholder: themePlaceholder('landingLayoutButtonGap'),
  },
  {
    key: 'landingLayoutButtonPadding',
    group: 'landing',
    label: 'Button padding',
    placeholder: themePlaceholder('landingLayoutButtonPadding'),
  },
  {
    key: 'landingLayoutButtonHoverLift',
    group: 'landing',
    label: 'Button hover lift',
    placeholder: themePlaceholder('landingLayoutButtonHoverLift'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroPaddingTop',
    group: 'landing',
    label: 'Hero padding top',
    placeholder: themePlaceholder('landingLayoutHeroPaddingTop'),
  },
  {
    key: 'landingLayoutHeroPaddingBottom',
    group: 'landing',
    label: 'Hero padding bottom',
    placeholder: themePlaceholder('landingLayoutHeroPaddingBottom'),
  },
  {
    key: 'landingLayoutHeroPaddingTopMobile',
    group: 'landing',
    label: 'Hero padding top mobile',
    placeholder: themePlaceholder('landingLayoutHeroPaddingTopMobile'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroPaddingBottomMobile',
    group: 'landing',
    label: 'Hero padding bottom mobile',
    placeholder: themePlaceholder('landingLayoutHeroPaddingBottomMobile'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroOrbSize',
    group: 'landing',
    label: 'Hero orb size',
    placeholder: themePlaceholder('landingLayoutHeroOrbSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroTitleClamp',
    group: 'landing',
    label: 'Hero title clamp',
    placeholder: themePlaceholder('landingLayoutHeroTitleClamp'),
    advanced: true,
  },
  {
    key: 'landingLayoutSectionTitleClamp',
    group: 'landing',
    label: 'Section title clamp',
    placeholder: themePlaceholder('landingLayoutSectionTitleClamp'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroTextMaxWidth',
    group: 'landing',
    label: 'Hero text max width',
    placeholder: themePlaceholder('landingLayoutHeroTextMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroVisualMaxWidth',
    group: 'landing',
    label: 'Hero visual max width',
    placeholder: themePlaceholder('landingLayoutHeroVisualMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutSectionHeaderMaxWidth',
    group: 'landing',
    label: 'Section header max width',
    placeholder: themePlaceholder('landingLayoutSectionHeaderMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutMediaMaxWidth',
    group: 'landing',
    label: 'Media max width',
    placeholder: themePlaceholder('landingLayoutMediaMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutComposablesVisualPaddingTop',
    group: 'landing',
    label: 'Composables visual top padding',
    placeholder: themePlaceholder('landingLayoutComposablesVisualPaddingTop'),
    advanced: true,
  },
  {
    key: 'landingLayoutChartHeight',
    group: 'landing',
    label: 'Chart height',
    placeholder: themePlaceholder('landingLayoutChartHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutChartLabelOffset',
    group: 'landing',
    label: 'Chart label offset',
    placeholder: themePlaceholder('landingLayoutChartLabelOffset'),
    advanced: true,
  },
  {
    key: 'landingLayoutDrawerWidth',
    group: 'landing',
    label: 'Drawer width',
    placeholder: themePlaceholder('landingLayoutDrawerWidth'),
  },
  {
    key: 'landingLayoutFooterDescriptionMaxWidth',
    group: 'landing',
    label: 'Footer description max width',
    placeholder: themePlaceholder('landingLayoutFooterDescriptionMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroVisualTabletMaxWidth',
    group: 'landing',
    label: 'Hero visual tablet max width',
    placeholder: themePlaceholder('landingLayoutHeroVisualTabletMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutCompactGridMaxWidth',
    group: 'landing',
    label: 'Compact grid max width',
    placeholder: themePlaceholder('landingLayoutCompactGridMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutStatMinWidthMobile',
    group: 'landing',
    label: 'Stat min width mobile',
    placeholder: themePlaceholder('landingLayoutStatMinWidthMobile'),
    advanced: true,
  },
  {
    key: 'landingLayoutMobileMenuButtonPadding',
    group: 'landing',
    label: 'Mobile menu button padding',
    placeholder: themePlaceholder('landingLayoutMobileMenuButtonPadding'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonRight',
    group: 'landing',
    label: 'Floating button right',
    placeholder: themePlaceholder('landingLayoutFloatingButtonRight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonBottom',
    group: 'landing',
    label: 'Floating button bottom',
    placeholder: themePlaceholder('landingLayoutFloatingButtonBottom'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonPaddingY',
    group: 'landing',
    label: 'Floating button padding Y',
    placeholder: themePlaceholder('landingLayoutFloatingButtonPaddingY'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonPaddingX',
    group: 'landing',
    label: 'Floating button padding X',
    placeholder: themePlaceholder('landingLayoutFloatingButtonPaddingX'),
    advanced: true,
  },
  {
    key: 'landingLayoutPulseDotSize',
    group: 'landing',
    label: 'Pulse dot size',
    placeholder: themePlaceholder('landingLayoutPulseDotSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutCodeDotSize',
    group: 'landing',
    label: 'Code dot size',
    placeholder: themePlaceholder('landingLayoutCodeDotSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutMetricIconSize',
    group: 'landing',
    label: 'Metric icon size',
    placeholder: themePlaceholder('landingLayoutMetricIconSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutMiniIconSize',
    group: 'landing',
    label: 'Mini icon size',
    placeholder: themePlaceholder('landingLayoutMiniIconSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutThemeBadgeSize',
    group: 'landing',
    label: 'Theme badge size',
    placeholder: themePlaceholder('landingLayoutThemeBadgeSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatAmplitude',
    group: 'landing',
    label: 'Float amplitude',
    placeholder: themePlaceholder('landingLayoutFloatAmplitude'),
    advanced: true,
  },
  {
    key: 'landingLayoutBodyLineHeight',
    group: 'landing',
    label: 'Body line height',
    placeholder: themePlaceholder('landingLayoutBodyLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutBorderThin',
    group: 'landing',
    label: 'Thin border width',
    placeholder: themePlaceholder('landingLayoutBorderThin'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeaderZIndex',
    group: 'landing',
    label: 'Header z-index',
    placeholder: themePlaceholder('landingLayoutHeaderZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutDrawerZIndex',
    group: 'landing',
    label: 'Drawer z-index',
    placeholder: themePlaceholder('landingLayoutDrawerZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutOverlayZIndex',
    group: 'landing',
    label: 'Drawer overlay z-index',
    placeholder: themePlaceholder('landingLayoutOverlayZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonZIndex',
    group: 'landing',
    label: 'Floating button z-index',
    placeholder: themePlaceholder('landingLayoutFloatingButtonZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroOrbTop',
    group: 'landing',
    label: 'Hero orb top offset',
    placeholder: themePlaceholder('landingLayoutHeroOrbTop'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroOrbRight',
    group: 'landing',
    label: 'Hero orb right offset',
    placeholder: themePlaceholder('landingLayoutHeroOrbRight'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroBadgeLetterSpacing',
    group: 'landing',
    label: 'Hero badge letter spacing',
    placeholder: themePlaceholder('landingLayoutHeroBadgeLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutSectionBadgeLetterSpacing',
    group: 'landing',
    label: 'Section badge letter spacing',
    placeholder: themePlaceholder('landingLayoutSectionBadgeLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutNavLineHeight',
    group: 'landing',
    label: 'Navigation line height',
    placeholder: themePlaceholder('landingLayoutNavLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroTitleLineHeight',
    group: 'landing',
    label: 'Hero title line height',
    placeholder: themePlaceholder('landingLayoutHeroTitleLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFeatureTextLineHeight',
    group: 'landing',
    label: 'Feature text line height',
    placeholder: themePlaceholder('landingLayoutFeatureTextLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutCtaSubtitleLineHeight',
    group: 'landing',
    label: 'CTA subtitle line height',
    placeholder: themePlaceholder('landingLayoutCtaSubtitleLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutCodeLineHeight',
    group: 'landing',
    label: 'Code block line height',
    placeholder: themePlaceholder('landingLayoutCodeLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterDescriptionLineHeight',
    group: 'landing',
    label: 'Footer description line height',
    placeholder: themePlaceholder('landingLayoutFooterDescriptionLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterHeadingLineHeight',
    group: 'landing',
    label: 'Footer heading line height',
    placeholder: themePlaceholder('landingLayoutFooterHeadingLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterLinkLineHeight',
    group: 'landing',
    label: 'Footer link line height',
    placeholder: themePlaceholder('landingLayoutFooterLinkLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterLinkTitleLetterSpacing',
    group: 'landing',
    label: 'Footer link title letter spacing',
    placeholder: themePlaceholder('landingLayoutFooterLinkTitleLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonLetterSpacing',
    group: 'landing',
    label: 'Floating button letter spacing',
    placeholder: themePlaceholder('landingLayoutFloatingButtonLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutThemeBadgeHoverScale',
    group: 'landing',
    label: 'Theme badge hover scale',
    placeholder: themePlaceholder('landingLayoutThemeBadgeHoverScale'),
    advanced: true,
  },
  {
    key: 'landingLayoutChartBarHoverOpacity',
    group: 'landing',
    label: 'Chart bar hover opacity',
    placeholder: themePlaceholder('landingLayoutChartBarHoverOpacity'),
    advanced: true,
  },
  {
    key: 'landingLayoutDrawerShadow',
    group: 'landing',
    label: 'Drawer shadow',
    placeholder: themePlaceholder('landingLayoutDrawerShadow'),
    advanced: true,
  },
  {
    key: 'landingBreakpointLg',
    group: 'landing',
    label: 'Breakpoint large (px)',
    placeholder: themePlaceholder('landingBreakpointLg'),
    advanced: true,
  },
  {
    key: 'landingBreakpointMd',
    group: 'landing',
    label: 'Breakpoint medium (px)',
    placeholder: themePlaceholder('landingBreakpointMd'),
    advanced: true,
  },
  {
    key: 'landingBreakpointSm',
    group: 'landing',
    label: 'Breakpoint small (px)',
    placeholder: themePlaceholder('landingBreakpointSm'),
    advanced: true,
  },
  {
    key: 'landingBrandPrimary',
    group: 'landing',
    label: 'Landing brand primary',
    isColor: true,
    placeholder: themePlaceholder('landingBrandPrimary'),
  },
  {
    key: 'landingBrandPrimaryDark',
    group: 'landing',
    label: 'Landing brand primary dark',
    isColor: true,
    placeholder: themePlaceholder('landingBrandPrimaryDark'),
  },
  {
    key: 'landingBrandPrimaryLight',
    group: 'landing',
    label: 'Landing brand primary light',
    isColor: true,
    placeholder: themePlaceholder('landingBrandPrimaryLight'),
  },
  {
    key: 'landingBrandSecondary',
    group: 'landing',
    label: 'Landing brand secondary',
    isColor: true,
    placeholder: themePlaceholder('landingBrandSecondary'),
  },
  {
    key: 'landingGray900',
    group: 'landing',
    label: 'Landing gray 900',
    isColor: true,
    placeholder: themePlaceholder('landingGray900'),
  },
  {
    key: 'landingGray800',
    group: 'landing',
    label: 'Landing gray 800',
    isColor: true,
    placeholder: themePlaceholder('landingGray800'),
  },
  {
    key: 'landingGray700',
    group: 'landing',
    label: 'Landing gray 700',
    isColor: true,
    placeholder: themePlaceholder('landingGray700'),
  },
  {
    key: 'landingGray600',
    group: 'landing',
    label: 'Landing gray 600',
    isColor: true,
    placeholder: themePlaceholder('landingGray600'),
  },
  {
    key: 'landingGray500',
    group: 'landing',
    label: 'Landing gray 500',
    isColor: true,
    placeholder: themePlaceholder('landingGray500'),
  },
  {
    key: 'landingGray400',
    group: 'landing',
    label: 'Landing gray 400',
    isColor: true,
    placeholder: themePlaceholder('landingGray400'),
  },
  {
    key: 'landingGray300',
    group: 'landing',
    label: 'Landing gray 300',
    isColor: true,
    placeholder: themePlaceholder('landingGray300'),
  },
  {
    key: 'landingGray200',
    group: 'landing',
    label: 'Landing gray 200',
    isColor: true,
    placeholder: themePlaceholder('landingGray200'),
  },
  {
    key: 'landingGray100',
    group: 'landing',
    label: 'Landing gray 100',
    isColor: true,
    placeholder: themePlaceholder('landingGray100'),
  },
  {
    key: 'landingGray50',
    group: 'landing',
    label: 'Landing gray 50',
    isColor: true,
    placeholder: themePlaceholder('landingGray50'),
  },
  {
    key: 'landingWhite',
    group: 'landing',
    label: 'Landing white',
    isColor: true,
    placeholder: themePlaceholder('landingWhite'),
  },
  {
    key: 'landingAbsoluteWhite',
    group: 'landing',
    label: 'Landing absolute white',
    isColor: true,
    placeholder: themePlaceholder('landingAbsoluteWhite'),
    advanced: true,
  },
  {
    key: 'landingBlack',
    group: 'landing',
    label: 'Landing black',
    isColor: true,
    placeholder: themePlaceholder('landingBlack'),
    advanced: true,
  },
  {
    key: 'landingSectionBgPrimary',
    group: 'landing',
    label: 'Section background primary',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgPrimary'),
  },
  {
    key: 'landingSectionBgSecondary',
    group: 'landing',
    label: 'Section background secondary',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgSecondary'),
  },
  {
    key: 'landingSectionBgDark',
    group: 'landing',
    label: 'Section background dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgDark'),
  },
  {
    key: 'landingSectionBgPrimaryDark',
    group: 'landing',
    label: 'Section background primary dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgPrimaryDark'),
    advanced: true,
  },
  {
    key: 'landingSectionBgSecondaryDark',
    group: 'landing',
    label: 'Section background secondary dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgSecondaryDark'),
    advanced: true,
  },
  {
    key: 'landingSectionBgDarkDark',
    group: 'landing',
    label: 'Section background deep dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgDarkDark'),
    advanced: true,
  },
  {
    key: 'landingGhBgCanvas',
    group: 'landing',
    label: 'GitHub canvas background',
    isColor: true,
    placeholder: themePlaceholder('landingGhBgCanvas'),
  },
  {
    key: 'landingGhBgSubtle',
    group: 'landing',
    label: 'GitHub subtle background',
    isColor: true,
    placeholder: themePlaceholder('landingGhBgSubtle'),
  },
  {
    key: 'landingGhBgMuted',
    group: 'landing',
    label: 'GitHub muted background',
    isColor: true,
    placeholder: themePlaceholder('landingGhBgMuted'),
  },
  {
    key: 'landingGhBorderDefault',
    group: 'landing',
    label: 'GitHub default border',
    isColor: true,
    placeholder: themePlaceholder('landingGhBorderDefault'),
  },
  {
    key: 'landingGhFgDefault',
    group: 'landing',
    label: 'GitHub default text',
    isColor: true,
    placeholder: themePlaceholder('landingGhFgDefault'),
  },
  {
    key: 'landingGhFgMuted',
    group: 'landing',
    label: 'GitHub muted text',
    isColor: true,
    placeholder: themePlaceholder('landingGhFgMuted'),
  },
  {
    key: 'landingGhFgSubtle',
    group: 'landing',
    label: 'GitHub subtle text',
    isColor: true,
    placeholder: themePlaceholder('landingGhFgSubtle'),
    advanced: true,
  },
  {
    key: 'landingGhAccent',
    group: 'landing',
    label: 'GitHub accent',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccent'),
  },
  {
    key: 'landingGhAccentEmphasis',
    group: 'landing',
    label: 'GitHub accent emphasis',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccentEmphasis'),
  },
  {
    key: 'landingGhAccentHover',
    group: 'landing',
    label: 'GitHub accent hover',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccentHover'),
    advanced: true,
  },
  {
    key: 'landingGhAccentSubtle',
    group: 'landing',
    label: 'GitHub accent subtle',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccentSubtle'),
    advanced: true,
  },
  {
    key: 'landingSharedDarkBg',
    group: 'landing',
    label: 'Shared dark background',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkBg'),
  },
  {
    key: 'landingSharedDarkSurface',
    group: 'landing',
    label: 'Shared dark surface',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkSurface'),
  },
  {
    key: 'landingSharedDarkSurfaceMuted',
    group: 'landing',
    label: 'Shared dark surface muted',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkSurfaceMuted'),
    advanced: true,
  },
  {
    key: 'landingSharedDarkBorder',
    group: 'landing',
    label: 'Shared dark border',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkBorder'),
  },
  {
    key: 'landingSharedDarkText',
    group: 'landing',
    label: 'Shared dark text',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkText'),
  },
  {
    key: 'landingSharedDarkTextMuted',
    group: 'landing',
    label: 'Shared dark text muted',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkTextMuted'),
  },
  {
    key: 'landingSharedDarkAccent',
    group: 'landing',
    label: 'Shared dark accent',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkAccent'),
    advanced: true,
  },
  {
    key: 'landingCodeKeyword',
    group: 'landing',
    label: 'Code keyword color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeKeyword'),
  },
  {
    key: 'landingCodeString',
    group: 'landing',
    label: 'Code string color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeString'),
  },
  {
    key: 'landingCodeComponent',
    group: 'landing',
    label: 'Code component color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeComponent'),
  },
  {
    key: 'landingCodeProp',
    group: 'landing',
    label: 'Code property color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeProp'),
  },
  {
    key: 'landingCodeComment',
    group: 'landing',
    label: 'Code comment color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeComment'),
  },
  {
    key: 'landingThemeGradientStart',
    group: 'landing',
    label: 'Theme card gradient start',
    isColor: true,
    placeholder: themePlaceholder('landingThemeGradientStart'),
  },
  {
    key: 'landingThemeGradientEnd',
    group: 'landing',
    label: 'Theme card gradient end',
    isColor: true,
    placeholder: themePlaceholder('landingThemeGradientEnd'),
  },
  {
    key: 'landingHeroHighlight1',
    group: 'landing',
    label: 'Hero metallic highlight 1',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight1'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight2',
    group: 'landing',
    label: 'Hero metallic highlight 2',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight2'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight3',
    group: 'landing',
    label: 'Hero metallic highlight 3',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight3'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight4',
    group: 'landing',
    label: 'Hero metallic highlight 4',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight4'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight5',
    group: 'landing',
    label: 'Hero metallic highlight 5',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight5'),
    advanced: true,
  },
]

/**
 * Lists theme fields for one group, honoring advanced toggle state.
 */
function getGroupThemeFields(groupId: ThemeFieldGroup): ThemeField[] {
  return colorFields.filter(field => field.group === groupId && (showAdvancedThemeFields.value || !field.advanced))
}

const landingColorSectionById = new Map<ThemeFieldSectionId, ThemeFieldSectionDefinition>(
  landingColorSectionsDefinition.map(section => [section.id, section])
)

/**
 * Resolves landing section buckets from key naming conventions.
 */
function resolveLandingColorSectionId(key: ThemeFieldKey): ThemeFieldSectionId {
  if (key.startsWith('landingFontSize')) {
    return 'landingTypography'
  }

  if (key.startsWith('landingLayout')) {
    return 'layoutDimensions'
  }

  if (key.startsWith('landingSpace')) {
    return 'layoutSpacing'
  }

  if (key.startsWith('landingRadius')) {
    return 'radius'
  }

  if (key.startsWith('landingShadow')) {
    return 'shadows'
  }

  if (
    key.startsWith('landingEasing')
    || key.startsWith('landingTransition')
    || key.startsWith('landingReveal')
    || key.startsWith('landingImageHover')
    || key.startsWith('landingComponentCard')
    || key.startsWith('landingCodeBlock')
    || key.startsWith('landingTopbar')
    || key.startsWith('landingPulse')
    || key.startsWith('landingFloat')
  ) {
    return 'motion'
  }

  if (key.startsWith('landingGray')) {
    return 'grayscale'
  }

  if (key.startsWith('landingSectionBg')) {
    return 'sections'
  }

  if (key.startsWith('landingGh')) {
    return 'githubDark'
  }

  if (key.startsWith('landingSharedDark')) {
    return 'sharedDark'
  }

  if (key.startsWith('landingCode')) {
    return 'syntax'
  }

  if (key.startsWith('landingThemeGradient') || key.startsWith('landingHeroHighlight')) {
    return 'effects'
  }

  return 'core'
}

/**
 * Splits group fields into section buckets to keep parameter editing organized.
 */
function getGroupThemeFieldSections(groupId: ThemeFieldGroup): ThemeFieldSection[] {
  const fields = getGroupThemeFields(groupId)

  if (groupId !== 'landing') {
    return [
      {
        id: 'default',
        label: '',
        description: '',
        fields,
      },
    ]
  }

  const grouped = new Map<ThemeFieldSectionId, ThemeField[]>()
  for (const field of fields) {
    const sectionId = resolveLandingColorSectionId(field.key)
    const bucket = grouped.get(sectionId) ?? []
    bucket.push(field)
    grouped.set(sectionId, bucket)
  }

  return landingColorSectionsDefinition
    .map(section => ({
      ...landingColorSectionById.get(section.id)!,
      fields: grouped.get(section.id) ?? [],
    }))
    .filter(section => section.fields.length > 0)
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

const cmsAuthoringShellThemeOverrides = computed(() => ({
  shellBackground: '#eef3f9',
  pageBackground: '#f5f8fc',
  pageTextColor: '#16202b',
  drawerBackground: '#ffffff',
  drawerFooterBackground: '#f8fbff',
  drawerTextColor: '#5f6c7b',
  dividerColor: '#d7e1ec',
  itemActiveColor: '#2563eb',
  itemTextColor: '#4b5a6a',
  itemIconColor: '#5f6c7b',
  itemHoverBackground: '#eaf2ff',
  itemHoverColor: '#16202b',
  itemIconHoverColor: '#2563eb',
  itemActiveBackground: '#e1ecff',
  focusColor: '#2563eb',
  brandTitleColor: '#16202b',
  brandSubtitleColor: '#6b7a8c',
  groupCaptionColor: '#6b7a8c',
  groupCaptionMiniBackground: '#edf3fb',
  headerBackground: '#ffffff',
  headerTextColor: '#16202b',
  toolbarButtonColor: '#4b5a6a',
  titleAppColor: '#16202b',
  titleTextColor: '#5f6c7b',
  titleSeparatorColor: '#d7e1ec',
  searchBackground: '#ffffff',
  searchTextColor: '#16202b',
  searchIconColor: '#6b7a8c',
  searchBorder: '#d7e1ec',
  searchBorderHover: '#b8c8dc',
  headerShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  headerBlur: 'blur(0px)',
  drawerShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
  drawerFooterShadow: 'inset 0 1px 0 rgba(215, 225, 236, 0.8)',
  actionBackground: '#ffffff',
  actionHoverBackground: '#eef4ff',
}))

const cmsResolvedAuthoringTheme = computed(() => ({
  ...settings.value.theme,
  ...cmsAuthoringShellThemeOverrides.value,
  workspaceMaxWidth: 'none',
}))

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

const cmsStyleVars = computed<Record<string, string>>(() => {
  const authoringTheme = cmsResolvedAuthoringTheme.value

  return {
  '--ntk-cms-font-family': authoringTheme.fontFamily || defaultTheme.fontFamily || '',
  '--ntk-cms-font-display': authoringTheme.fontFamilyDisplay || authoringTheme.fontFamily || defaultTheme.fontFamilyDisplay || defaultTheme.fontFamily || '',
  '--ntk-cms-font-style-base': authoringTheme.fontStyleBase || defaultTheme.fontStyleBase || 'normal',
  '--ntk-cms-font-weight-regular': authoringTheme.fontWeightRegular || defaultTheme.fontWeightRegular || '400',
  '--ntk-cms-font-weight-medium': authoringTheme.fontWeightMedium || defaultTheme.fontWeightMedium || authoringTheme.fontWeightRegular || defaultTheme.fontWeightRegular || '500',
  '--ntk-cms-font-weight-semibold': authoringTheme.fontWeightSemibold || defaultTheme.fontWeightSemibold || authoringTheme.fontWeightMedium || defaultTheme.fontWeightMedium || '600',
  '--ntk-cms-font-weight-bold': authoringTheme.fontWeightBold || defaultTheme.fontWeightBold || authoringTheme.fontWeightSemibold || defaultTheme.fontWeightSemibold || '700',
  '--ntk-cms-font-size-base': authoringTheme.fontSizeBase || defaultTheme.fontSizeBase || '0.925rem',
  '--ntk-cms-font-size-title': authoringTheme.fontSizeTitle || defaultTheme.fontSizeTitle || authoringTheme.fontSizeBase || defaultTheme.fontSizeBase || '0.925rem',
  '--ntk-cms-font-size-title-app': authoringTheme.fontSizeTitleApp || defaultTheme.fontSizeTitleApp || authoringTheme.fontSizeTitle || defaultTheme.fontSizeTitle || '1.05rem',
  '--ntk-cms-font-size-brand-title': authoringTheme.fontSizeBrandTitle || defaultTheme.fontSizeBrandTitle || authoringTheme.fontSizeBase || defaultTheme.fontSizeBase || '0.9rem',
  '--ntk-cms-font-size-brand-subtitle': authoringTheme.fontSizeBrandSubtitle || defaultTheme.fontSizeBrandSubtitle || '0.72rem',
  '--ntk-cms-font-size-item-label': authoringTheme.fontSizeItemLabel || defaultTheme.fontSizeItemLabel || '13px',
  '--ntk-cms-font-size-item-caption': authoringTheme.fontSizeItemCaption || defaultTheme.fontSizeItemCaption || '11px',
  '--ntk-cms-font-size-group-caption': authoringTheme.fontSizeGroupCaption || defaultTheme.fontSizeGroupCaption || '0.68rem',
  '--ntk-cms-font-size-group-caption-mini': authoringTheme.fontSizeGroupCaptionMini || defaultTheme.fontSizeGroupCaptionMini || '0.62rem',
  '--ntk-cms-letter-spacing-group-caption': authoringTheme.letterSpacingGroupCaption || defaultTheme.letterSpacingGroupCaption || '0.08em',
  '--ntk-cms-letter-spacing-group-caption-mini': authoringTheme.letterSpacingGroupCaptionMini || defaultTheme.letterSpacingGroupCaptionMini || '0.06em',
  '--ntk-cms-line-height-item-label': authoringTheme.lineHeightItemLabel || defaultTheme.lineHeightItemLabel || '1.25',
  '--ntk-cms-line-height-item-caption': authoringTheme.lineHeightItemCaption || defaultTheme.lineHeightItemCaption || '1.2',
  '--ntk-cms-item-caption-offset': authoringTheme.itemCaptionOffset || defaultTheme.itemCaptionOffset || 'calc(var(--ntk-cms-space-xs) * 0.6)',
  '--ntk-cms-radius-sm': authoringTheme.radiusSm || defaultTheme.radiusSm || '6px',
  '--ntk-cms-radius-md': authoringTheme.radiusMd || defaultTheme.radiusMd || '8px',
  '--ntk-cms-radius-lg': authoringTheme.radiusLg || defaultTheme.radiusLg || '10px',
  '--ntk-cms-radius-item': authoringTheme.radiusItem || defaultTheme.radiusItem || '0 28px 28px 0',
  '--ntk-cms-group-caption-mini-radius': authoringTheme.groupCaptionMiniRadius || defaultTheme.groupCaptionMiniRadius || '999px',
  '--ntk-cms-space-xs': authoringTheme.spacingXs || defaultTheme.spacingXs || '0.25rem',
  '--ntk-cms-space-sm': authoringTheme.spacingSm || defaultTheme.spacingSm || '0.5rem',
  '--ntk-cms-space-md': authoringTheme.spacingMd || defaultTheme.spacingMd || '0.75rem',
  '--ntk-cms-space-lg': authoringTheme.spacingLg || defaultTheme.spacingLg || '1rem',
  '--ntk-cms-border-width': authoringTheme.borderWidth || defaultTheme.borderWidth || '1px',
  '--ntk-cms-text-primary': authoringTheme.pageTextColor || defaultTheme.pageTextColor || '',
  '--ntk-cms-text-secondary': authoringTheme.drawerTextColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-border-color': authoringTheme.dividerColor || defaultTheme.dividerColor || '',
  '--ntk-cms-bg-card': authoringTheme.drawerBackground || defaultTheme.drawerBackground || '',
  '--ntk-cms-tab-active': authoringTheme.itemActiveColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-accent': authoringTheme.itemActiveColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-accent-soft': authoringTheme.itemHoverBackground || defaultTheme.itemHoverBackground || '',
  '--ntk-cms-accent-text': authoringTheme.itemHoverColor || authoringTheme.itemActiveColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-active-bg': authoringTheme.itemActiveBackground || defaultTheme.itemActiveBackground || '',
  '--ntk-cms-header-bg': authoringTheme.headerBackground || defaultTheme.headerBackground || '',
  '--ntk-cms-header-text': authoringTheme.headerTextColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-header-shadow': authoringTheme.headerShadow || defaultTheme.headerShadow || '',
  '--ntk-cms-header-blur': authoringTheme.headerBlur || defaultTheme.headerBlur || 'blur(calc(var(--ntk-cms-space-sm) * 2))',
  '--ntk-cms-drawer-shadow': authoringTheme.drawerShadow || defaultTheme.drawerShadow || '',
  '--ntk-cms-drawer-footer-bg': authoringTheme.drawerFooterBackground || authoringTheme.drawerBackground || defaultTheme.drawerFooterBackground || defaultTheme.drawerBackground || '',
  '--ntk-cms-drawer-footer-shadow': authoringTheme.drawerFooterShadow || defaultTheme.drawerFooterShadow || '',
  '--ntk-cms-search-bg': authoringTheme.searchBackground || defaultTheme.searchBackground || '',
  '--ntk-cms-search-text': authoringTheme.searchTextColor || defaultTheme.searchTextColor || '',
  '--ntk-cms-search-icon': authoringTheme.searchIconColor || authoringTheme.headerTextColor || defaultTheme.searchIconColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-search-border': authoringTheme.searchBorder || defaultTheme.searchBorder || '',
  '--ntk-cms-search-border-hover': authoringTheme.searchBorderHover || defaultTheme.searchBorderHover || '',
  '--ntk-cms-transition': authoringTheme.transitionFast || defaultTheme.transitionFast || '',
  '--ntk-cms-focus-color': authoringTheme.focusColor || authoringTheme.itemActiveColor || defaultTheme.focusColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-action-bg': authoringTheme.actionBackground || defaultTheme.actionBackground || 'transparent',
  '--ntk-cms-action-hover': authoringTheme.actionHoverBackground || defaultTheme.actionHoverBackground || '',
  '--ntk-cms-shell-bg': authoringTheme.shellBackground || defaultTheme.shellBackground || '',
  '--ntk-cms-title-app': authoringTheme.titleAppColor || authoringTheme.itemActiveColor || defaultTheme.titleAppColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-title-text': authoringTheme.titleTextColor || authoringTheme.headerTextColor || defaultTheme.titleTextColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-title-separator': authoringTheme.titleSeparatorColor || authoringTheme.dividerColor || defaultTheme.titleSeparatorColor || defaultTheme.dividerColor || '',
  '--ntk-cms-title-separator-size': authoringTheme.titleSeparatorSize || defaultTheme.titleSeparatorSize || 'calc(var(--ntk-cms-font-size-title-app) + var(--ntk-cms-space-xs))',
  '--ntk-cms-toolbar-icon': authoringTheme.toolbarButtonColor || authoringTheme.headerTextColor || defaultTheme.toolbarButtonColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-brand-title': authoringTheme.brandTitleColor || authoringTheme.itemActiveColor || defaultTheme.brandTitleColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-brand-subtitle': authoringTheme.brandSubtitleColor || authoringTheme.drawerTextColor || defaultTheme.brandSubtitleColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-group-caption': authoringTheme.groupCaptionColor || authoringTheme.drawerTextColor || defaultTheme.groupCaptionColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-group-caption-mini-bg': authoringTheme.groupCaptionMiniBackground || authoringTheme.itemHoverBackground || defaultTheme.groupCaptionMiniBackground || defaultTheme.itemHoverBackground || '',
  '--ntk-cms-item-text': authoringTheme.itemTextColor || authoringTheme.drawerTextColor || defaultTheme.itemTextColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-item-icon': authoringTheme.itemIconColor || authoringTheme.drawerTextColor || defaultTheme.itemIconColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-item-hover-color': authoringTheme.itemHoverColor || authoringTheme.itemActiveColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-item-icon-hover': authoringTheme.itemIconHoverColor || authoringTheme.itemHoverColor || authoringTheme.itemActiveColor || defaultTheme.itemIconHoverColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-preview-search-width': authoringTheme.searchWidth || defaultTheme.searchWidth || '220px',
  '--ntk-cms-preview-search-height': authoringTheme.searchControlHeight || defaultTheme.searchControlHeight || '36px',
  '--ntk-cms-preview-user-avatar-size': authoringTheme.userAvatarSize || defaultTheme.userAvatarSize || 'calc(var(--ntk-cms-preview-search-height) - (var(--ntk-cms-space-xs) * 2))',
  '--ntk-cms-preview-action-hover-translate-y': authoringTheme.actionHoverTranslateY || defaultTheme.actionHoverTranslateY || 'calc(var(--ntk-cms-space-xs) * -0.5)',
  '--ntk-cms-preview-action-min-width': authoringTheme.menuSlotWidth || defaultTheme.menuSlotWidth || '30px',
  '--ntk-cms-preview-action-min-height': authoringTheme.searchControlHeight || defaultTheme.searchControlHeight || '28px',
  '--ntk-cms-preview-brand-logo-size': authoringTheme.brandLogoSize || defaultTheme.brandLogoSize || '40px',
  '--ntk-cms-layout-breakpoint-lg': `${cmsLayoutBreakpointLgPx.value}px`,
  '--ntk-cms-layout-breakpoint-md': `${cmsLayoutBreakpointMdPx.value}px`,
  '--ntk-cms-layout-side-min-width': 'calc(var(--ntk-cms-preview-search-width) + (var(--ntk-cms-space-lg) * 5))',
  '--ntk-cms-layout-config-example-min-width': 'calc(var(--ntk-cms-preview-search-width) + (var(--ntk-cms-space-lg) * 3.5))',
  '--ntk-cms-editor-min-height': 'calc(100vh - (var(--ntk-shell-header-height) + (var(--ntk-cms-space-lg) * 8)))',
  '--ntk-cms-editor-max-height': 'calc(100vh - (var(--ntk-shell-header-height) + (var(--ntk-cms-space-lg) * 8)))',
  '--ntk-cms-preview-icon-size-lg': authoringTheme.itemIconSize || defaultTheme.itemIconSize || '22px',
  '--ntk-cms-preview-icon-size-md': 'calc(var(--ntk-cms-preview-icon-size-lg) - var(--ntk-cms-space-xs))',
  '--ntk-cms-preview-icon-size-sm': 'calc(var(--ntk-cms-preview-icon-size-md) - var(--ntk-cms-space-xs))',
  '--ntk-cms-preview-icon-size-xs': 'calc(var(--ntk-cms-preview-icon-size-sm) - (var(--ntk-cms-space-xs) / 2))',
  '--ntk-cms-preview-avatar-icon-size': 'var(--ntk-cms-preview-action-min-height)',
  '--ntk-cms-preview-mini-caption-min-width': authoringTheme.groupCaptionMiniMinWidth || defaultTheme.groupCaptionMiniMinWidth || '34px',
  '--ntk-cms-preview-mini-caption-height': authoringTheme.groupCaptionMiniHeight || defaultTheme.groupCaptionMiniHeight || '18px',
  '--ntk-cms-preview-badge-min-size': authoringTheme.groupCaptionMiniHeight || defaultTheme.groupCaptionMiniHeight || '16px',
  '--ntk-cms-preview-badge-font-size': authoringTheme.fontSizeGroupCaptionMini || defaultTheme.fontSizeGroupCaptionMini || '0.62rem',
  '--ntk-cms-preview-badge-letter-spacing': authoringTheme.letterSpacingGroupCaptionMini || defaultTheme.letterSpacingGroupCaptionMini || '0.06em',
  '--ntk-cms-notification-success': notificationSuccessColor.value,
  '--ntk-cms-notification-warning': notificationWarningColor.value,
  '--ntk-cms-notification-error': notificationErrorColor.value,
  '--ntk-cms-notification-info': notificationInfoColor.value,
  '--ntk-cms-notification-badge-bg': notificationBadgeColor.value,
  '--ntk-cms-notification-badge-text': notificationBadgeTextColor.value,
  '--ntk-cms-notification-icon': notificationIconColor.value,
  }
})

const bannerStyle = computed(() => ({
  background: accentSoftBackground.value,
  color: accentTextColor.value,
  border: `${resolvedBorderWidth.value} solid ${accentColor.value}`,
}))

const statusChipStyle = computed(() => ({
  background: accentSoftBackground.value,
  color: accentTextColor.value,
  border: `${resolvedBorderWidth.value} solid ${accentColor.value}`,
}))

const previewChipStyle = computed(() => ({
  background: accentSoftBackground.value,
  color: accentTextColor.value,
  border: `${resolvedBorderWidth.value} solid ${accentColor.value}`,
}))

const primaryActionStyle = computed(() => ({
  background: accentColor.value,
  color: notificationBadgeTextColor.value,
}))

const warningActionStyle = computed(() => ({
  color: notificationWarningColor.value,
}))

const dangerActionStyle = computed(() => ({
  color: notificationErrorColor.value,
}))

const notificationChipStyles = computed(() => ({
  success: {
    background: notificationSuccessColor.value,
    color: notificationSuccessTextColor.value,
  },
  warning: {
    background: notificationWarningColor.value,
    color: notificationWarningTextColor.value,
  },
  error: {
    background: notificationErrorColor.value,
    color: notificationErrorTextColor.value,
  },
  info: {
    background: notificationInfoColor.value,
    color: notificationInfoTextColor.value,
  },
}))

const notificationBellPreviewStyle = computed(() => ({
  color: notificationIconColor.value,
}))

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
  const activeProfile = getActiveTenantProfileSnapshot()
  tenantProfilesState.value = upsertCmsTenantProfile(tenantProfilesState.value, {
    id: activeProfile.id,
    name: activeProfile.name,
    settings: cloneWhiteLabelSettings(nextSettings),
    updatedAt: new Date().toISOString(),
  })
  tenantProfilesState.value.activeProfileId = activeProfile.id
  activeTenantProfileId.value = activeProfile.id
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
    if (isApplyingCmsAuthoringHistory.value) {
      return
    }

    cmsAuthoringHistory.value = recordCmsSnapshot(
      cmsAuthoringHistory.value,
      cloneWhiteLabelSettings(value),
      {
        equals: areCmsSettingsSnapshotsEqual,
      }
    )
  },
  { deep: true }
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
  () => {
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
 * Normalizes hex color.
 */
function normalizeHexColor(value: string): string | null {
  const normalized = value.trim().toLowerCase()
  const shortHex = normalized.match(/^#([0-9a-f]{3})$/i)
  if (shortHex) {
    const [r, g, b] = shortHex[1].split('')
    return `#${r}${r}${g}${g}${b}${b}`
  }

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return normalized
  }

  return null
}

/**
 * Handles rgb string to hex.
 */
function rgbStringToHex(value: string): string | null {
  const match = value
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:[\s,/]+[\d.]+)?\s*\)$/i)

  if (!match) {
    return null
  }

  const clamp = (channel: string): number => Math.max(0, Math.min(255, Number.parseInt(channel, 10)))
  const channels = [clamp(match[1]), clamp(match[2]), clamp(match[3])]
  return `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Resolves color value to hex.
 */
function resolveColorValueToHex(value: string): string | null {
  const directHex = normalizeHexColor(value)
  if (directHex) {
    return directHex
  }

  const rgbHex = rgbStringToHex(value)
  if (rgbHex) {
    return rgbHex
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const probe = document.createElement('span')
  probe.style.color = ''
  probe.style.color = value

  if (!probe.style.color) {
    return null
  }

  probe.style.display = 'none'
  document.body.appendChild(probe)
  const computedColor = window.getComputedStyle(probe).color
  probe.remove()

  return rgbStringToHex(computedColor) ?? normalizeHexColor(computedColor)
}

/**
 * Handles get theme field picker value.
 */
function getThemeFieldPickerValue(field: ThemeField): string {
  const explicitValue = getThemeFieldValue(field)
  const explicitColor = resolveColorValueToHex(explicitValue)
  if (explicitColor) {
    return explicitColor
  }

  const placeholderColor = resolveColorValueToHex(field.placeholder ?? '')
  if (placeholderColor) {
    return placeholderColor
  }

  return resolveColorValueToHex(semanticColors.infoPrimary) ?? semanticColors.infoPrimary
}

/**
 * Handles on theme field input.
 */
function onThemeFieldInput(field: ThemeField, value: string | number | null): void {
  const normalized = String(value ?? '')
  settings.value.theme[field.key] = normalized

  for (const alias of field.aliases ?? []) {
    settings.value.theme[alias] = normalized
  }

  settings.value.themePresetId = selectedThemePreset.value
  if (!isCmsThemeBasePresetId(selectedThemePreset.value)) {
    return
  }

  const presetId: CmsThemeBasePresetId = selectedThemePreset.value
  const presetOverrides: Partial<Record<ThemeFieldKey, string>> = {
    ...(settings.value.themePresetOverrides[presetId] as Partial<Record<ThemeFieldKey, string>> | undefined),
  }

  presetOverrides[field.key] = normalized
  for (const alias of field.aliases ?? []) {
    presetOverrides[alias] = normalized
  }

  settings.value.themePresetOverrides = {
    ...settings.value.themePresetOverrides,
    [presetId]: presetOverrides,
  }
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
  const preset = themePresets.value.find(item => item.id === presetId)
  if (!preset) {
    return
  }

  settings.value.theme = {
    ...settings.value.theme,
    ...preset.theme,
  }
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
  const detectedPreset = detectCmsThemePresetId(settings.value.theme, themePresets.value, defaultTheme)
  selectedThemePreset.value = detectedPreset
  settings.value.themePresetId = detectedPreset
}

/**
 * Applies selected theme preset from settings.
 */
function applySelectedThemePresetFromSettings(): void {
  selectedThemePreset.value = isCmsThemePresetId(settings.value.themePresetId)
    ? settings.value.themePresetId
    : detectCmsThemePresetId(settings.value.theme, themePresets.value, defaultTheme)
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
  const profile = tenantProfilesState.value.profiles.find(item => item.id === profileId)
  if (!profile) {
    return
  }

  activeTenantProfileId.value = profile.id
  tenantProfilesState.value.activeProfileId = profile.id
  saveCmsTenantProfilesState(tenantProfilesState.value)

  settings.value = cloneWhiteLabelSettings(normalizeCmsWhiteLabelSettings(profile.settings))
  settings.value.content.locale = resolveCmsLocale(settings.value.content.locale)
  applySelectedThemePresetFromSettings()
  activeMenuId.value = settings.value.items[0]?.id ?? defaultMenuId
  searchQuery.value = ''
  resetCmsAuthoringHistory()
  savedAtLabel.value = `${profile.name} ${cmsUiText.value.tenantLoadedSuffix}`
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

  const profileId = createTenantProfileId(profileName, tenantProfilesState.value.profiles.map(profile => profile.id))
  tenantProfilesState.value = upsertCmsTenantProfile(tenantProfilesState.value, {
    id: profileId,
    name: profileName,
    settings: cloneWhiteLabelSettings(settings.value),
  })
  tenantProfilesState.value.activeProfileId = profileId
  saveCmsTenantProfilesState(tenantProfilesState.value)
  onTenantProfileChange(profileId)
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

  tenantProfilesState.value = removeCmsTenantProfile(tenantProfilesState.value, activeProfile.id)
  activeTenantProfileId.value = tenantProfilesState.value.activeProfileId
  saveCmsTenantProfilesState(tenantProfilesState.value)
  onTenantProfileChange(activeTenantProfileId.value)
  savedAtLabel.value = `${activeProfile.name} ${cmsUiText.value.tenantRemovedSuffix}`
}

/**
 * Handles to json file name.
 */
function toJsonFileName(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
  return normalized || 'tenant-profile'
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

function downloadJsonPayload(fileName: string, payload: unknown): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  ;(window as Window & {
    __NTK_CMS_LAST_DOWNLOAD__?: {
      fileName: string
      payload: string
    }
  }).__NTK_CMS_LAST_DOWNLOAD__ = {
    fileName,
    payload: JSON.stringify(payload, null, 2),
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => {
    window.URL.revokeObjectURL(url)
  }, 0)
}

/**
 * Handles export active tenant profile.
 */
function exportActiveTenantProfile(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const profile = getActiveTenantProfileSnapshot()
  const payload = createCmsTenantExportPayload(profile)

  const fileName = `ntk-cms-tenant-${toJsonFileName(profile.id)}.json`
  downloadJsonPayload(fileName, payload)
  savedAtLabel.value = `${profile.name} ${cmsUiText.value.tenantExportedSuffix}`
}

/**
 * Handles export the selected repository domain snapshot.
 */
function exportSelectedDomainSnapshot(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const activeProfile = getActiveTenantProfileSnapshot()
  const domain = selectedDomainTransfer.value
  const payload = createCmsDomainExportPayload({
    domain,
    snapshot: createSelectedDomainSnapshot(domain) as never,
    profile: {
      id: activeProfile.id,
      name: activeProfile.name,
    },
  })

  const fileName = `ntk-cms-${domain}-${toJsonFileName(activeProfile.id)}.json`
  downloadJsonPayload(fileName, payload)
  savedAtLabel.value = getCmsDomainTransferExportedLabel(domain)
}

/**
 * Exports authored schemas and presets without touching page/media/release domains.
 */
function exportCmsSchemaPackage(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const activeProfile = getActiveTenantProfileSnapshot()
  const payload = createCmsSchemaExportPayload({
    snapshot: createCmsSchemaPackageSnapshot(settings.value),
    profile: {
      id: activeProfile.id,
      name: activeProfile.name,
    },
  })

  const fileName = `ntk-cms-schema-${toJsonFileName(activeProfile.id)}.json`
  downloadJsonPayload(fileName, payload)
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

  const fileName = `ntk-cms-review-${toJsonFileName(activeProfile.id)}.json`
  downloadJsonPayload(fileName, payload)
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

/**
 * Handles open tenant import dialog.
 */
function openTenantImportDialog(): void {
  if (!tenantImportInputRef.value) {
    nextTick(() => tenantImportInputRef.value?.click())
    return
  }

  tenantImportInputRef.value.value = ''
  tenantImportInputRef.value.click()
}

/**
 * Handles open domain import dialog.
 */
function openDomainImportDialog(): void {
  if (!domainImportInputRef.value) {
    nextTick(() => domainImportInputRef.value?.click())
    return
  }

  domainImportInputRef.value.value = ''
  domainImportInputRef.value.click()
}

/**
 * Handles open schema import dialog.
 */
function openSchemaImportDialog(): void {
  if (!schemaImportInputRef.value) {
    nextTick(() => schemaImportInputRef.value?.click())
    return
  }

  schemaImportInputRef.value.value = ''
  schemaImportInputRef.value.click()
}

async function onTenantImportFileChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) {
    return
  }

  try {
    checkpointCmsDraftRecovery()
    const fileContent = await file.text()
    const parsed = JSON.parse(fileContent) as unknown
    const imported = parseCmsTenantImportPayload(parsed, file.name)
    if (!imported) {
      savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
      return
    }

    const normalizedSettings = normalizeCmsWhiteLabelSettings(imported.settings)
    const existingIds = tenantProfilesState.value.profiles.map(profile => profile.id)
    const requestedId = toJsonFileName(imported.id || imported.name)
    const hasRequestedId = existingIds.includes(requestedId)
    const shouldReplace = hasRequestedId
      && typeof window !== 'undefined'
      && window.confirm(cmsUiText.value.tenantReplaceConfirmLabel(requestedId))
    const profileId = shouldReplace
      ? requestedId
      : createTenantProfileId(requestedId, existingIds)

    tenantProfilesState.value = upsertCmsTenantProfile(tenantProfilesState.value, {
      id: profileId,
      name: imported.name.trim() || profileId,
      settings: normalizedSettings,
    })
    tenantProfilesState.value.activeProfileId = profileId
    saveCmsTenantProfilesState(tenantProfilesState.value)
    onTenantProfileChange(profileId)
    applyGovernanceAction('import_settings', {
      summary: `${imported.name.trim() || profileId} ${tr('imported', 'importado')}`,
      metadata: {
        sourceVersion: String(imported.sourceVersion),
        profileId,
      },
    })
    savedAtLabel.value = cmsUiText.value.tenantImportedWithVersionLabel(imported.name.trim() || profileId, imported.sourceVersion)
  } catch {
    savedAtLabel.value = cmsUiText.value.importFailedInvalidJsonLabel
  }
}

async function onDomainImportFileChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) {
    return
  }

  try {
    checkpointCmsDraftRecovery()
    const fileContent = await file.text()
    const parsed = JSON.parse(fileContent) as unknown
    const imported = parseCmsDomainImportPayload(parsed, file.name, selectedDomainTransfer.value)
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

async function onSchemaImportFileChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) {
    return
  }

  try {
    checkpointCmsDraftRecovery()
    const fileContent = await file.text()
    const parsed = JSON.parse(fileContent) as unknown
    const imported = parseCmsSchemaImportPayload(parsed, file.name)
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
  selectedThemePreset.value = isCmsThemePresetId(settings.value.themePresetId)
    ? settings.value.themePresetId
    : detectCmsThemePresetId(settings.value.theme, resolvedThemePresets, defaultTheme)
  settings.value.themePresetId = selectedThemePreset.value
  activeMenuId.value = settings.value.items[0]?.id ?? defaultMenuId
  searchQuery.value = ''
  activeSettingsTab.value = 'branding'
  applyCmsFavicon(settings.value.branding.faviconUrl)
  savedAtLabel.value = cmsUiText.value.defaultsRestoredLabel
}
</script>

<style scoped>
.cms-shell-page {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  font-family: var(--ntk-cms-font-family);
  font-style: var(--ntk-cms-font-style-base);
  color: var(--ntk-cms-text-primary);
  min-width: 0;
  min-height: 100%;
  width: 100%;
  background: #f5f8fc;
}

.cms-shell-page :deep(.ntk-app-shell__workspace-card) {
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.cms-shell-page :deep(.q-field__native),
.cms-shell-page :deep(.q-field__input),
.cms-shell-page :deep(.q-item__label),
.cms-shell-page :deep(.q-tab__label),
.cms-shell-page :deep(.q-btn__content),
.cms-shell-page :deep(.q-chip) {
  font-family: var(--ntk-cms-font-family);
  font-style: var(--ntk-cms-font-style-base);
}

.cms-shell-page :deep(.q-field__native),
.cms-shell-page :deep(.q-field__input),
.cms-shell-page :deep(.q-field__append),
.cms-shell-page :deep(.q-field__prepend),
.cms-shell-page :deep(.q-field__suffix),
.cms-shell-page :deep(.q-field__prefix),
.cms-shell-page :deep(.q-select__dropdown-icon) {
  color: var(--ntk-cms-text-primary) !important;
  -webkit-text-fill-color: var(--ntk-cms-text-primary);
}

.cms-shell-page :deep(.q-field__native::placeholder),
.cms-shell-page :deep(.q-field__input::placeholder) {
  color: var(--ntk-cms-text-secondary) !important;
  -webkit-text-fill-color: var(--ntk-cms-text-secondary);
}

.cms-shell-page :deep(.q-field),
.cms-shell-page :deep(.q-item),
.cms-shell-page :deep(.q-toggle),
.cms-shell-page :deep(.q-toggle__label) {
  color: var(--ntk-cms-text-primary);
}

.cms-shell-page :deep(.q-field__label),
.cms-shell-page :deep(.q-field__marginal) {
  color: var(--ntk-cms-text-secondary) !important;
}

.cms-shell-page :deep(.q-field--outlined .q-field__control) {
  background: var(--ntk-cms-shell-bg) !important;
  color: var(--ntk-cms-text-primary) !important;
}

.cms-shell-page :deep(.q-field--outlined .q-field__control:before) {
  border-color: var(--ntk-cms-border-color) !important;
}

.cms-shell-page :deep(.q-field--outlined.q-field--focused .q-field__control:after) {
  border-color: var(--ntk-cms-focus-color) !important;
}

.cms-shell-page__workspace {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  min-width: 0;
  min-height: calc(100vh - (var(--ntk-shell-header-height) + (var(--ntk-cms-space-lg) * 2)));
  flex: 1 1 auto;
  height: 100%;
  width: 100%;
  background: transparent;
  border-radius: 0;
  align-items: stretch;
  justify-content: stretch;
}

.cms-shell-page__hero {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) * 0.5);
}

.cms-icon {
  line-height: 1;
}

.cms-icon--lg {
  font-size: var(--ntk-cms-preview-icon-size-lg);
}

.cms-icon--md {
  font-size: var(--ntk-cms-preview-icon-size-md);
}

.cms-icon--sm {
  font-size: var(--ntk-cms-preview-icon-size-sm);
}

.cms-icon--xs {
  font-size: var(--ntk-cms-preview-icon-size-xs);
}

.cms-icon--avatar {
  font-size: var(--ntk-cms-preview-avatar-icon-size);
}

.cms-shell-page__hero h1 {
  margin: 0;
  font-size: calc(var(--ntk-cms-font-size-title-app) + var(--ntk-cms-space-xs));
  color: var(--ntk-cms-text-primary);
}

.cms-shell-page__hero p {
  margin: var(--ntk-cms-space-xs) 0 0;
  color: var(--ntk-cms-text-secondary);
}

.cms-shell-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-lg);
}

.cms-workspace-tabs {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--ntk-cms-space-xs) * 0.75);
  flex-wrap: wrap;
}

.cms-workspace-tab {
  min-height: 2rem;
  padding: 0 var(--ntk-cms-space-md);
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 80%, white);
  border-radius: 999px;
  background: #ffffff;
  color: var(--ntk-cms-text-secondary);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.cms-workspace-tab--active {
  border-color: color-mix(in srgb, var(--ntk-cms-accent) 55%, white);
  background: color-mix(in srgb, var(--ntk-cms-accent) 12%, #ffffff);
  color: var(--ntk-cms-text-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-cms-accent) 20%, transparent);
}

.cms-pages {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  align-items: stretch;
  min-width: 0;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}

.cms-blocks-shell {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}

.cms-pages__header-actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
}

.cms-builder-command-select {
  min-width: 18rem;
  flex: 1 1 18rem;
}

.cms-pages__toolbar-hint {
  margin: 0;
}

.cms-pages__template-select {
  min-width: 15.5rem;
}

.cms-pages__editor {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  overflow: hidden;
  padding-right: 0;
  flex: 1 1 auto;
}

.cms-pages__quick-starts {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-pages__sidebar {
  gap: var(--ntk-cms-space-sm);
}

.cms-pages__rail {
  gap: var(--ntk-cms-space-sm);
}

.cms-pages__sidebar-section {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
  padding-top: var(--ntk-cms-space-sm);
  border-top: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 72%, white);
}

.cms-pages__reusable-library {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 82%, white);
  border-radius: var(--ntk-cms-radius-lg);
  background: #ffffff;
  overflow: hidden;
}

.cms-pages__reusable-list {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-sm);
  overflow: auto;
}

.cms-pages__sidebar .cms-pages__quick-start-grid,
.cms-pages__sidebar .cms-form-grid {
  grid-template-columns: minmax(0, 1fr);
}

.cms-pages__sidebar .cms-form-grid {
  margin-bottom: 0;
}

.cms-pages__sidebar-action-bar {
  margin-top: 0;
}

.cms-pages__sidebar-empty {
  padding: 0;
}

.cms-pages__stage-toolbar,
.cms-blocks__stage-command-bar {
  margin: 0;
  padding: var(--ntk-cms-space-sm);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.cms-pages__quick-starts-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-pages__quick-starts-header small {
  display: block;
  margin-top: calc(var(--ntk-cms-space-xs) / 2);
  color: var(--ntk-cms-text-secondary);
}

.cms-pages__quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: var(--ntk-cms-space-sm);
}

.cms-page-quick-start-card {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-md);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
}

.cms-page-quick-start-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-quick-start-card__description {
  color: var(--ntk-cms-text-secondary);
}

.cms-page-quick-start-card__meta {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
  font-size: 0.85rem;
  color: var(--ntk-cms-text-secondary);
}

.cms-page-quick-start-card__meta strong {
  color: var(--ntk-cms-text-primary);
}

.cms-page-quick-start-card__actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-usage-drawer {
  width: min(30rem, 92vw);
  max-width: 92vw;
  max-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.cms-usage-drawer__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-md);
}

.cms-usage-drawer__header small {
  display: block;
  margin-top: calc(var(--ntk-cms-space-xs) / 2);
  color: var(--ntk-cms-text-secondary);
}

.cms-usage-drawer__body {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  padding: var(--ntk-cms-space-md);
  overflow: auto;
}

.cms-usage-drawer__summary {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
}

.cms-usage-drawer__references {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-usage-drawer__reference {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
  padding: var(--ntk-cms-space-md);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
}

.cms-usage-drawer__reference-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-pages__preview {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-blocks__editor {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  overflow: hidden;
  padding-right: 0;
  flex: 1 1 auto;
}

.cms-blocks__header-actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
}

.cms-blocks-toolbar {
  align-items: end;
}

.cms-blocks-toolbar__hint {
  margin-top: calc(var(--ntk-cms-space-xs) * -1);
}

.cms-blocks-toolbar__bulk {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-blocks-reusable-toolbar {
  align-items: end;
}

.cms-blocks-library {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-blocks-library__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-blocks-library__header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ntk-cms-space-sm);
}

.cms-blocks-list {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-block-item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-block-item--drop-target {
  border-color: var(--ntk-cms-accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-cms-accent) 30%, transparent);
}

.cms-block-item__meta {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-block-item__meta small {
  color: var(--ntk-cms-text-secondary);
}

.cms-block-item__empty {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-label);
}

.cms-block-item__empty strong {
  color: var(--ntk-cms-text-primary);
  font-size: var(--ntk-cms-font-size-item-label);
}

.cms-block-item__empty small {
  color: var(--ntk-cms-text-secondary);
  line-height: 1.5;
}

.cms-block-item__empty--card {
  border: var(--ntk-cms-border-width) dashed var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
}

.cms-empty-state__actions {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-block-row {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
  cursor: grab;
}

.cms-block-row--dragging {
  opacity: 0.56;
}

.cms-block-row--active {
  border-color: var(--ntk-cms-accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-cms-accent) 35%, transparent);
}

.cms-block-row__meta {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-block-row__meta small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-block-row__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
}

.cms-reusable-block-row {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-reusable-block-row--active {
  border-color: var(--ntk-cms-accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-cms-accent) 35%, transparent);
}

.cms-reusable-block-row__meta {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-reusable-block-row__meta small {
  color: var(--ntk-cms-text-secondary);
}

.cms-reusable-block-row__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
}

.cms-blocks__summary {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-blocks__preview {
  display: grid;
  gap: var(--ntk-cms-space-md);
}

.cms-blocks-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-cms-space-sm);
}

.cms-blocks-summary-card {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  color: var(--ntk-cms-text-secondary);
}

.cms-blocks-summary-card strong {
  color: var(--ntk-cms-text-primary);
}

.cms-review-summary {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-review-summary__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-review-summary__list {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-review-summary__item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--ntk-cms-space-sm);
}

.cms-review-summary__body {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-review-summary__body small {
  color: var(--ntk-cms-text-secondary);
}

.cms-review-summary--locale {
  gap: var(--ntk-cms-space-md);
}

.cms-locale-coverage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--ntk-cms-space-md);
}

.cms-locale-coverage-card {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-locale-coverage-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-locale-coverage-card > small {
  color: var(--ntk-cms-text-secondary);
}

.cms-diagnostics-list {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-diagnostics-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-diagnostics-item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--ntk-cms-space-sm);
}

.cms-diagnostics-item__body {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-diagnostics-item__body small {
  color: var(--ntk-cms-text-secondary);
}

.cms-blocks-props {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-blocks-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
}

.cms-blocks-field {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
}

.cms-blocks-field small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-blocks-field__json {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
}

.cms-blocks-props__header {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-blocks-props__header small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-blocks-props__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ntk-cms-space-sm);
}

.cms-media__editor {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-media__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
}

.cms-media__actions--secondary {
  padding-top: calc(var(--ntk-cms-space-xs) / 2);
  border-top: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
}

.cms-media__preview {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-media-preview-item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ntk-cms-space-sm);
  align-items: center;
}

.cms-media-preview-item--binding {
  background: var(--ntk-cms-bg-card);
}

.cms-media-preview-item--active {
  border-color: var(--ntk-cms-accent);
  box-shadow: var(--ntk-cms-shadow-sm);
}

.cms-media-preview-item__meta {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-media-preview-item__meta small {
  color: var(--ntk-cms-text-secondary);
}

.cms-media-preview-item__visual {
  width: calc(var(--ntk-cms-space-lg) * 3.6);
  height: calc(var(--ntk-cms-space-lg) * 3.6);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cms-media-preview-item__visual img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cms-media-preview-item__tags {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-media-preview-item__url {
  grid-column: 1 / -1;
  font-size: var(--ntk-cms-font-size-item-caption);
  color: var(--ntk-cms-text-secondary);
  word-break: break-all;
}

.cms-releases__editor {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-releases__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
}

.cms-releases__timeline {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  max-height: var(--ntk-cms-editor-max-height);
  overflow: auto;
  padding-right: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-releases__calendar {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-diagnostics {
  margin: 0;
  padding-left: var(--ntk-cms-space-lg);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
  font-size: var(--ntk-cms-font-size-item-caption);
  color: var(--ntk-cms-text-secondary);
}

.cms-release-checklist {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-md);
}

.cms-release-checklist__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-release-checklist__copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-checklist__copy small {
  color: var(--ntk-cms-text-secondary);
}

.cms-release-review-hub {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-md);
}

.cms-release-review-hub__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-md);
}

.cms-release-review-hub__copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-review-hub__copy small {
  color: var(--ntk-cms-text-secondary);
}

.cms-release-review-hub__summary {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
}

.cms-release-review-hub__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-cms-space-sm);
}

.cms-release-review-hub__card {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-review-hub__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-review-hub__card-copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-review-hub__card-copy small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-release-review-hub__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-cms-space-xs);
}

.cms-release-review-hub__metric {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-sm);
  padding: calc(var(--ntk-cms-space-xs) * 0.9);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 3);
  background: var(--ntk-cms-bg-card);
}

.cms-release-review-hub__metric strong {
  font-size: var(--ntk-cms-font-size-subtitle);
}

.cms-release-review-hub__metric small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-governance-hub {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-md);
}

.cms-governance-hub__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-md);
}

.cms-governance-hub__copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-governance-hub__copy small {
  color: var(--ntk-cms-text-secondary);
}

.cms-governance-hub__summary {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
}

.cms-governance-hub__cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ntk-cms-space-sm);
}

.cms-governance-hub__card {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-governance-hub__card-header,
.cms-governance-hub__item-header,
.cms-governance-hub__list-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-governance-hub__card-copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-governance-hub__card-copy small,
.cms-governance-hub__item small,
.cms-governance-hub__list-header small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-governance-hub__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-cms-space-xs);
}

.cms-governance-hub__metric {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-sm);
  padding: calc(var(--ntk-cms-space-xs) * 0.9);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 3);
  background: var(--ntk-cms-bg-card);
}

.cms-governance-hub__metric strong {
  font-size: var(--ntk-cms-font-size-subtitle);
}

.cms-governance-hub__metric small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-governance-hub__lists {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-cms-space-sm);
}

.cms-governance-hub__list {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-governance-hub__items {
  display: grid;
  gap: var(--ntk-cms-space-xs);
}

.cms-governance-hub__item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-sm);
  background: var(--ntk-cms-bg-card);
  padding: calc(var(--ntk-cms-space-xs) * 0.9);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-history {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-md);
}

.cms-release-history__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-md);
}

.cms-release-history__copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-history__copy small {
  color: var(--ntk-cms-text-secondary);
}

.cms-release-history__items {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-history__item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-history__item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-history__item-copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-history__item-copy small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-release-history__item-summary {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
}

.cms-release-history__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ntk-cms-space-xs);
}

.cms-release-history__metric {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-sm);
  padding: calc(var(--ntk-cms-space-xs) * 0.9);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 3);
  background: var(--ntk-cms-bg-card);
}

.cms-release-history__metric strong {
  font-size: var(--ntk-cms-font-size-subtitle);
}

.cms-release-history__metric small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-release-acknowledgements {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-md);
}

.cms-release-acknowledgements__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-md);
}

.cms-release-acknowledgements__copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-acknowledgements__copy small {
  color: var(--ntk-cms-text-secondary);
}

.cms-release-acknowledgements__summary {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
}

.cms-release-acknowledgements__form {
  display: grid;
  grid-template-columns: minmax(0, 220px) minmax(0, 1fr) auto;
  gap: var(--ntk-cms-space-sm);
  align-items: flex-start;
}

.cms-release-acknowledgements__items {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-acknowledgements__item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) * 1.1);
}

.cms-release-acknowledgements__item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-acknowledgements__item-copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-acknowledgements__item-copy small,
.cms-release-acknowledgements__note {
  color: var(--ntk-cms-text-secondary);
}

.cms-release-acknowledgements__note {
  margin: 0;
}

.cms-release-checklist__summary {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
}

.cms-release-checklist__items {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-checklist__item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-checklist__item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-checklist__item-copy {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-release-checklist__item-copy small {
  color: var(--ntk-cms-text-secondary);
}

.cms-release-checklist__issues {
  margin: 0;
  padding-left: var(--ntk-cms-space-lg);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
  font-size: var(--ntk-cms-font-size-item-caption);
  color: var(--ntk-cms-text-secondary);
}

.cms-release-checklist__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-release-item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-item--active {
  border-color: var(--ntk-cms-accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-cms-accent) 35%, transparent);
}

.cms-release-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-release-item__meta {
  color: var(--ntk-cms-text-secondary);
}

.cms-release-item__summary {
  margin: 0;
}

.cms-release-item__metrics {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-release-item__dates {
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-release-item__empty {
  margin: 0;
  color: var(--ntk-cms-text-secondary);
}

@media (max-width: 1100px) {
  .cms-release-review-hub__cards,
  .cms-governance-hub__cards,
  .cms-governance-hub__lists {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .cms-release-review-hub__header,
  .cms-governance-hub__header,
  .cms-governance-hub__card-header,
  .cms-governance-hub__item-header,
  .cms-governance-hub__list-header,
  .cms-release-acknowledgements__header,
  .cms-release-history__header,
  .cms-release-history__item-header,
  .cms-release-acknowledgements__item-header {
    flex-direction: column;
  }

  .cms-release-acknowledgements__form,
  .cms-release-history__metrics,
  .cms-release-review-hub__cards,
  .cms-release-review-hub__metrics,
  .cms-governance-hub__cards,
  .cms-governance-hub__metrics,
  .cms-governance-hub__lists {
    grid-template-columns: minmax(0, 1fr);
  }
}

.cms-release-calendar-item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  color: var(--ntk-cms-text-secondary);
  background: var(--ntk-cms-shell-bg);
}

.cms-release-calendar-item strong {
  color: var(--ntk-cms-text-primary);
}

.cms-release-calendar-conflict {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: calc(var(--ntk-cms-space-xs) / 1.5);
  background: var(--ntk-cms-bg-card);
}

.cms-release-calendar-conflict p {
  margin: 0;
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-page-item {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  padding: var(--ntk-cms-space-md);
  background: var(--ntk-cms-bg-card);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-page-item__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ntk-cms-space-md);
}

.cms-page-item__description {
  grid-column: 1 / -1;
}

.cms-page-item__custom-fields {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-item__custom-fields-header {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) * 0.4);
}

.cms-page-item__custom-fields-header strong {
  color: var(--ntk-cms-text-primary);
}

.cms-page-item__custom-fields-header small {
  color: var(--ntk-cms-text-secondary);
}

.cms-page-item__custom-fields-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-md);
}

.cms-page-item__custom-fields-groups {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-page-item__custom-fields-group {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-sm);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: color-mix(in srgb, var(--ntk-cms-bg-card) 72%, transparent);
}

.cms-page-item__custom-fields-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-page-item__custom-fields-group-header strong {
  color: var(--ntk-cms-text-primary);
}

.cms-page-item__custom-fields-group-header small {
  color: var(--ntk-cms-text-secondary);
}

.cms-page-item__sections {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-migration-summary,
.cms-page-item__schema-migration {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  gap: var(--ntk-cms-space-xs);
}

.cms-page-migration-summary__chips,
.cms-page-item__schema-migration-chips {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
}

.cms-page-item__sections-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-item__sections-actions {
  display: flex;
  align-items: flex-end;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-page-item__section-preset-select {
  min-width: 14rem;
}

.cms-page-item__starter-variants {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--ntk-cms-space-sm);
}

.cms-page-item__starter-card {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-card-bg);
  color: var(--ntk-cms-text-primary);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-xs);
  text-align: left;
  transition: border-color var(--ntk-cms-transition-base), transform var(--ntk-cms-transition-base), box-shadow var(--ntk-cms-transition-base);
}

.cms-page-item__starter-card:hover {
  border-color: var(--ntk-cms-accent);
  transform: translateY(-1px);
  box-shadow: var(--ntk-cms-shadow-sm);
}

.cms-page-item__starter-card--active {
  border-color: var(--ntk-cms-accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-cms-accent) 28%, transparent);
}

.cms-page-item__starter-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-item__starter-card small {
  color: var(--ntk-cms-text-secondary);
}

.cms-page-section-row {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto auto minmax(20rem, auto);
  gap: var(--ntk-cms-space-sm);
  align-items: center;
  cursor: grab;
}

.cms-page-section-row--dragging {
  opacity: 0.56;
}

.cms-page-section-row--drop-target {
  border-color: var(--ntk-cms-accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-cms-accent) 30%, transparent);
}

.cms-page-item__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-section-row__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
  min-width: 20rem;
}

.cms-pages__reusable-library {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-shell-bg);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-pages__reusable-list {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
  padding: 0 var(--ntk-cms-space-md) var(--ntk-cms-space-md);
}

.cms-page-preview {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  padding: var(--ntk-cms-space-md);
  background: var(--ntk-cms-bg-card);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-preview__chips {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--ntk-cms-space-xs) * 0.8);
  flex-wrap: wrap;
}

.cms-page-preview__path {
  color: var(--ntk-cms-text-secondary);
  word-break: break-word;
}

.cms-page-preview > p {
  margin: 0;
  color: var(--ntk-cms-text-secondary);
}

.cms-page-preview__sections {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-toolbar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, auto);
  gap: var(--ntk-cms-space-sm);
  align-items: start;
}

.cms-preview-toolbar__chips {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-runtime-preview {
  display: flex;
  justify-content: center;
}

.cms-runtime-preview__frame {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  border-radius: var(--ntk-cms-radius-lg);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
}

.cms-runtime-preview__frame[data-preview-viewport='tablet'] {
  max-width: 54rem;
}

.cms-runtime-preview__frame[data-preview-viewport='mobile'] {
  max-width: 27rem;
}

.cms-shell-card {
  border-radius: var(--ntk-cms-radius-lg);
  border-color: var(--ntk-cms-border-color);
  background: var(--ntk-cms-bg-card);
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
}

.cms-designer-card {
  --ntk-cms-bg-card: #ffffff;
  --ntk-cms-shell-bg: #f4f7fb;
  --ntk-cms-border-color: #d7e1ec;
  --ntk-cms-text-primary: #16202b;
  --ntk-cms-text-secondary: #5f6c7b;
  --ntk-cms-tab-active: #2563eb;
  --ntk-cms-accent: #2563eb;
  overflow: visible;
  color: var(--ntk-cms-text-primary);
  background: transparent;
  box-shadow: none;
  border: 0 !important;
  min-height: calc(100vh - (var(--ntk-shell-header-height) + 11rem));
  flex: 1 1 auto;
}

.cms-shell-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-md);
  padding: var(--ntk-cms-space-lg);
}

.cms-designer-card__toolbar-header {
  min-height: 3.3rem;
  padding: var(--ntk-cms-space-md) var(--ntk-cms-space-lg);
  background: #ffffff;
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 75%, white);
  border-radius: var(--ntk-cms-radius-lg);
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: calc(var(--ntk-cms-space-xs) * 0.75);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.cms-designer-card__toolbar-row {
  display: flex;
  align-items: center;
  gap: calc(var(--ntk-cms-space-xs) * 0.75);
  min-width: 0;
  flex-wrap: wrap;
}

.cms-designer-card__toolbar-row--info {
  min-height: 2rem;
  padding-top: calc(var(--ntk-cms-space-xs) * 0.5);
  border-top: 1px solid color-mix(in srgb, var(--ntk-cms-border-color) 68%, white);
  justify-content: space-between;
}

.cms-designer-card__toolbar-group {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--ntk-cms-space-xs) * 0.75);
  min-width: 0;
}

.cms-designer-card__toolbar-group--icons {
  flex-wrap: wrap;
}

.cms-designer-card__toolbar-group--fields {
  flex-wrap: wrap;
}

.cms-designer-card__toolbar-divider {
  width: 1px;
  align-self: stretch;
  background: color-mix(in srgb, var(--ntk-cms-border-color) 85%, white);
}

.cms-designer-card__toolbar-spacer {
  flex: 1 1 auto;
}

.cms-designer-card__toolbar-group--preview {
  margin-inline-start: auto;
}

.cms-designer-card__info-strip {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-md);
  min-width: 0;
  flex-wrap: wrap;
}

.cms-designer-card__info-item {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-label);
  line-height: 1.25;
}

.cms-designer-card__info-item strong {
  color: var(--ntk-cms-text-primary);
  font-weight: 700;
}

.cms-shell-card__body {
  padding: var(--ntk-cms-space-lg);
}

.cms-designer-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  padding: 0;
  background: transparent;
  flex: 1 1 auto;
  min-height: 0;
}

.cms-designer-card__header-chips {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-designer-card__toolbar-actions {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--ntk-cms-space-xs) * 0.75);
  margin-inline-start: auto;
}

.cms-designer-card__toolbar-group :deep(.q-btn),
.cms-designer-card__toolbar-group :deep(.q-field__control),
.cms-designer-card__toolbar-group :deep(.q-btn-dropdown__arrow-container) {
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 80%, white);
  border-radius: calc(var(--ntk-cms-radius-md) - 0.125rem);
  background: #ffffff;
  color: var(--ntk-cms-text-primary);
}

.cms-designer-card__toolbar-group :deep(.q-btn) {
  min-height: 2.25rem;
}

.cms-designer-card__toolbar-action {
  padding-inline: var(--ntk-cms-space-sm);
  font-weight: 600;
}

.cms-designer-card__toolbar-group :deep(.q-btn-dropdown) {
  background: transparent;
}

.cms-designer-card__toolbar-group :deep(.q-field) {
  min-width: 11rem;
}

.cms-designer-card__toolbar-group :deep(.q-field__control) {
  min-height: 2rem;
  padding-inline: calc(var(--ntk-cms-space-xs) * 1.25);
}

.cms-designer-card__workbench {
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr) 18rem;
  gap: var(--ntk-cms-space-md);
  min-height: 0;
  max-height: none;
  align-items: stretch;
  flex: 1 1 auto;
  background: transparent;
}

.cms-designer-card__workbench--pages {
  grid-template-columns: 20rem minmax(0, 1fr) 22rem;
}

.cms-designer-card__workbench--blocks {
  grid-template-columns: 18rem minmax(0, 1fr) 18rem;
}

.cms-designer-card__sidebar,
.cms-designer-card__stage,
.cms-designer-card__rail {
  min-width: 0;
  min-height: 0;
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.cms-designer-card__sidebar,
.cms-designer-card__rail {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  padding: var(--ntk-cms-space-md);
  overflow: auto;
  background: #f7f9fc;
}

.cms-pages__rail .cms-preview-toolbar,
.cms-blocks__rail .cms-preview-toolbar {
  grid-template-columns: 1fr;
}

.cms-pages__preview,
.cms-blocks__preview {
  margin-top: 0;
}

.cms-designer-card__stage {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  padding: var(--ntk-cms-space-lg);
  overflow: auto;
  background:
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  background-size: 24px 24px, 24px 24px, auto;
  flex: 1 1 auto;
}

.cms-designer-card__stage--plain {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.cms-designer-card__ruler-shell {
  display: grid;
  grid-template-columns: minmax(220px, 0.24fr) minmax(0, 1fr) minmax(220px, 0.24fr);
  gap: 0;
  align-items: center;
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-lg);
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 72%, white);
  border-radius: var(--ntk-cms-radius-lg);
  background: #f8fbff;
}

.cms-designer-card__ruler-shell--pages,
.cms-designer-card__ruler-shell--blocks {
  grid-template-columns: minmax(220px, 0.24fr) minmax(0, 1fr) minmax(220px, 0.24fr);
}

.cms-designer-card__ruler-gutter,
.cms-designer-card__ruler-meta {
  min-width: 0;
  display: flex;
  align-items: center;
}

.cms-designer-card__ruler-gutter {
  justify-content: flex-end;
}

.cms-designer-card__ruler-meta {
  justify-content: flex-start;
  gap: calc(var(--ntk-cms-space-xs) * 0.75);
  flex-wrap: wrap;
}

.cms-designer-card__ruler-zoom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.1rem;
  min-height: 2rem;
  padding: 0 calc(var(--ntk-cms-space-xs) * 1.25);
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 82%, white);
  border-radius: calc(var(--ntk-cms-radius-md) - 0.125rem);
  background: #ffffff;
  color: var(--ntk-cms-text-primary);
  font-size: var(--ntk-cms-font-size-item-label);
  font-weight: 700;
}

.cms-designer-card__ruler-mode {
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 82%, white);
  border-radius: calc(var(--ntk-cms-radius-md) - 0.125rem);
  background: #ffffff;
}

.cms-designer-card__ruler {
  min-height: 2rem;
  display: grid;
  grid-template-columns: repeat(17, minmax(0, 1fr));
  align-items: end;
  gap: 0;
  padding: calc(var(--ntk-cms-space-xs) * 0.75) var(--ntk-cms-space-sm) calc(var(--ntk-cms-space-xs) * 0.6);
  border: var(--ntk-cms-border-width) solid color-mix(in srgb, var(--ntk-cms-border-color) 82%, white);
  border-radius: var(--ntk-cms-radius-md);
  background:
    repeating-linear-gradient(to right, rgba(148, 163, 184, 0.14) 0, rgba(148, 163, 184, 0.14) 1px, transparent 1px, transparent calc(100% / 17)),
    linear-gradient(180deg, #ffffff 0%, #f3f6fb 100%);
  overflow: hidden;
}

.cms-designer-card__ruler-mark {
  position: relative;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-end;
  min-width: 0;
  padding-inline-start: calc(var(--ntk-cms-space-xs) * 0.75);
  color: var(--ntk-cms-text-secondary);
  font-size: 0.62rem;
  letter-spacing: 0.03em;
}

.cms-designer-card__ruler-mark::before {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  width: 1px;
  height: 0.85rem;
  background: color-mix(in srgb, var(--ntk-cms-border-color) 80%, #cbd5e1);
}

.cms-designer-card__sidebar-header,
.cms-designer-card__rail-card {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) * 0.75);
}

.cms-designer-card__sidebar-header small,
.cms-designer-card__rail-card small,
.cms-designer-card__status-text {
  color: var(--ntk-cms-text-secondary);
}

.cms-designer-card__nav-list,
.cms-designer-card__metrics {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-xs);
}

.cms-designer-card__metrics span {
  font-size: var(--ntk-cms-font-size-item-label);
  color: var(--ntk-cms-text-secondary);
}

.cms-designer-card__metrics strong {
  color: var(--ntk-cms-text-primary);
}

.cms-designer-card__nav-button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  border: var(--ntk-cms-border-width) solid transparent;
  border-radius: var(--ntk-cms-radius-md);
  background: rgba(255, 255, 255, 0.62);
  color: var(--ntk-cms-text-secondary);
  padding: calc(var(--ntk-cms-space-xs) * 1.5) var(--ntk-cms-space-sm);
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--ntk-cms-transition-duration) var(--ntk-cms-transition-ease),
    background var(--ntk-cms-transition-duration) var(--ntk-cms-transition-ease),
    color var(--ntk-cms-transition-duration) var(--ntk-cms-transition-ease);
}

.cms-designer-card__nav-button:hover,
.cms-designer-card__nav-button--active {
  border-color: color-mix(in srgb, var(--ntk-cms-accent) 40%, var(--ntk-cms-border-color));
  background: color-mix(in srgb, var(--ntk-cms-accent) 9%, var(--ntk-cms-bg-card));
  color: var(--ntk-cms-text-primary);
}

.cms-designer-card__rail-actions {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-xs);
}

.cms-designer-card__rail-actions :deep(.q-btn) {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: rgba(255, 255, 255, 0.92);
}

.cms-designer-card__statusbar {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.cms-settings {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  flex: 1 1 auto;
  min-height: 0;
}

.cms-settings__preview {
  background: linear-gradient(180deg, #eef3f9 0%, #e7edf5 100%);
}

.cms-settings__preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-lg);
}

/* ── Admin Card (Tenant + Actions) ─────────────────── */
.cms-settings__admin {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

/* ── Editor Card (Tabs + Panels) ───────────────────── */
.cms-settings__editor {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

/* ── Toolbar Cards (Tenant + Actions) ───────────────── */
.cms-toolbar-card {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  overflow: hidden;
}

.cms-toolbar-card__header {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  border-bottom: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  background: color-mix(in srgb, var(--ntk-cms-border-color) 15%, transparent);
}

.cms-toolbar-card__icon {
  color: var(--ntk-cms-text-secondary);
}

.cms-toolbar-card__title {
  font-size: var(--ntk-cms-font-size-group-caption);
  font-weight: var(--ntk-cms-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--ntk-cms-letter-spacing-group-caption-mini);
  color: var(--ntk-cms-text-secondary);
  user-select: none;
}

.cms-toolbar-card__saved-at {
  margin-left: auto;
  font-size: var(--ntk-cms-font-size-item-label);
  color: var(--ntk-cms-text-secondary);
  white-space: nowrap;
  user-select: none;
}

.cms-toolbar-card__body {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-md);
  padding: var(--ntk-cms-space-md);
  flex-wrap: wrap;
}

.cms-toolbar-card__select {
  min-width: var(--ntk-cms-preview-search-width);
  flex: 1 1 auto;
}

.cms-toolbar-card__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
}

.cms-toolbar-card__domain-transfer {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
  flex: 1 1 340px;
}

.cms-toolbar-card__domain-select {
  min-width: 220px;
  flex: 1 1 220px;
}

.cms-toolbar-card__autosave {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
  width: 100%;
}

.cms-toolbar-card__autosave-meta {
  font-size: var(--ntk-cms-font-size-item-label);
  color: var(--ntk-cms-text-secondary);
}

.cms-toolbar-card__separator {
  align-self: stretch;
  opacity: 0.35;
}

.cms-file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.cms-settings__tabs {
  display: none;
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  padding: 0 calc(var(--ntk-cms-space-xs) + (var(--ntk-cms-space-xs) / 4));
}

.cms-settings__panels {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
}

.cms-settings__panels :deep(.q-panel),
.cms-settings__panels :deep(.q-tab-panel),
.cms-settings__panels :deep(.q-tab-panels) {
  background: var(--ntk-cms-bg-card);
  color: var(--ntk-cms-text-primary);
}

.cms-config-section {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(var(--ntk-cms-layout-config-example-min-width), 0.95fr);
  gap: var(--ntk-cms-space-lg);
  align-items: start;
}

.cms-config-section__form,
.cms-config-section__example {
  min-width: 0;
}

.cms-settings__tabs :deep(.q-tab) {
  color: var(--ntk-cms-text-secondary);
}

.cms-settings__tabs :deep(.q-tab--active) {
  color: var(--ntk-cms-tab-active);
}

.cms-settings__tabs :deep(.q-tab__indicator) {
  background: var(--ntk-cms-tab-active);
}

.cms-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-md);
  margin-bottom: var(--ntk-cms-space-lg);
}

.cms-form-grid__full {
  grid-column: 1 / -1;
}

.cms-form-grid__inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
  align-items: center;
  grid-column: 1 / -1;
}

.cms-content-model-fields {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-md);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: color-mix(in srgb, var(--ntk-cms-bg-card) 92%, transparent);
}

.cms-content-model-fields__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-content-model-fields__header-actions {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-content-model-fields__preset-select {
  min-width: 260px;
}

.cms-content-model-fields__description,
.cms-content-model-fields__empty {
  margin: 0;
  color: var(--ntk-cms-text-secondary);
}

.cms-content-model-fields__item {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
  padding-top: var(--ntk-cms-space-sm);
  border-top: var(--ntk-cms-border-width) dashed var(--ntk-cms-border-color);
}

.cms-content-model-fields__row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ntk-cms-space-md);
  align-items: center;
}

.cms-content-model-fields__options {
  grid-column: 1 / -1;
}

.cms-preset-toggle-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
  grid-column: 1 / -1;
}

.cms-preset-toggle-grid__button {
  min-width: unset;
}

.cms-preset-limit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-md);
  grid-column: 1 / -1;
}

.cms-color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-md);
}

.cms-color-grid-sections {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-color-grid-section {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-color-grid-section + .cms-color-grid-section {
  border-top: var(--ntk-cms-border-width) dashed var(--ntk-cms-border-color);
  padding-top: var(--ntk-cms-space-sm);
}

.cms-color-grid-section__header {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) * 0.4);
}

.cms-color-grid-section__header strong {
  color: var(--ntk-cms-text-primary);
  font-size: var(--ntk-cms-font-size-item-label);
}

.cms-color-grid-section__header small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-color-groups {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  margin-bottom: var(--ntk-cms-space-lg);
}

.cms-theme-presets {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  padding: var(--ntk-cms-space-md);
  margin-bottom: var(--ntk-cms-space-lg);
}

.cms-theme-presets__controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ntk-cms-space-sm);
  align-items: end;
}

.cms-color-group {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  padding: var(--ntk-cms-space-md);
}

.cms-color-field {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-xs);
}

.cms-color-field label {
  font-size: var(--ntk-cms-font-size-item-label);
  color: var(--ntk-cms-text-secondary);
}

.cms-color-field__controls {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
}

.cms-color-field__picker {
  width: calc(var(--ntk-cms-preview-icon-size-lg) * 2);
  height: var(--ntk-cms-preview-search-height);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: transparent;
  padding: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ntk-cms-space-sm);
}

.cms-section-header--stacked {
  align-items: flex-start;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) * 0.6);
}

.cms-section-header--stacked small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-list {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-list-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--ntk-cms-space-sm);
  align-items: center;
  padding: var(--ntk-cms-space-sm);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
}

.cms-list-item--menu {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.cms-list-item--toolbar {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.cms-toggle-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-xs) var(--ntk-cms-space-lg);
}

.cms-banner {
  border-radius: var(--ntk-cms-radius-lg);
}

.cms-notification-preview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-sm);
  margin-top: var(--ntk-cms-space-md);
}

.cms-notification-bell-preview {
  margin-top: var(--ntk-cms-space-md);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
}

.cms-notification-actions-preview {
  margin-top: var(--ntk-cms-space-md);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
}

.cms-notification-actions-preview__action {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-search-border);
  border-radius: var(--ntk-cms-radius-sm);
  background: var(--ntk-cms-action-bg);
  color: var(--ntk-cms-toolbar-icon);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  padding: var(--ntk-cms-space-xs) var(--ntk-cms-space-sm);
  font-size: var(--ntk-cms-font-size-item-caption);
  line-height: var(--ntk-cms-line-height-item-caption);
  transition: all var(--ntk-cms-transition);
}

.cms-notification-actions-preview__action:hover {
  background: var(--ntk-cms-action-hover);
  color: var(--ntk-cms-item-hover-color);
}

.cms-notification-actions-preview__action--forced-hover {
  background: var(--ntk-cms-action-hover);
  color: var(--ntk-cms-item-hover-color);
}

.cms-example-section {
  margin-top: var(--ntk-cms-space-lg);
  padding-top: var(--ntk-cms-space-lg);
  border-top: var(--ntk-cms-border-width) dashed var(--ntk-cms-border-color);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-example-section--inline {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.cms-example-section__header {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) * 0.4);
}

.cms-example-section__header strong {
  color: var(--ntk-cms-text-primary);
}

.cms-example-section__header small {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-preview-card {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  padding: var(--ntk-cms-space-md);
  background: var(--ntk-cms-bg-card);
  color: var(--ntk-cms-text-primary);
  font-family: var(--ntk-cms-font-family);
  font-style: var(--ntk-cms-font-style-base);
}

.cms-preview-card p {
  margin: var(--ntk-cms-space-xs) 0;
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-chip {
  margin-top: var(--ntk-cms-space-xs);
  background: var(--ntk-cms-accent-soft);
  color: var(--ntk-cms-accent-text);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-accent);
}

.cms-preview-card--foundation {
  border-color: var(--ntk-cms-border-color);
  background: var(--ntk-cms-bg-card);
  color: var(--ntk-cms-text-primary);
}

.cms-preview-card--typography {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-typography__headline {
  font-family: var(--ntk-cms-font-display);
  font-size: var(--ntk-cms-font-size-title-app);
  font-weight: var(--ntk-cms-font-weight-bold);
  color: var(--ntk-cms-title-app);
}

.cms-preview-typography__title {
  font-size: var(--ntk-cms-font-size-title);
  font-weight: var(--ntk-cms-font-weight-medium);
  color: var(--ntk-cms-title-text);
}

.cms-preview-typography__body {
  margin: 0;
  font-size: var(--ntk-cms-font-size-base);
  font-weight: var(--ntk-cms-font-weight-regular);
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-typography__menu {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  background: var(--ntk-cms-shell-bg);
}

.cms-preview-typography__menu-label {
  font-size: var(--ntk-cms-font-size-item-label);
  font-weight: var(--ntk-cms-font-weight-semibold);
  color: var(--ntk-cms-item-text);
}

.cms-preview-typography__menu-caption {
  margin-top: var(--ntk-cms-item-caption-offset);
  font-size: var(--ntk-cms-font-size-item-caption);
  font-weight: var(--ntk-cms-font-weight-regular);
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-card--layout {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-layout__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-layout__panel {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  padding: var(--ntk-cms-space-md);
  background: var(--ntk-cms-bg-card);
  transition: all var(--ntk-cms-transition);
}

.cms-preview-layout__panel:hover {
  transform: translateY(calc(var(--ntk-cms-space-xs) * -1));
}

.cms-preview-layout__panel--accent {
  background: var(--ntk-cms-accent-soft);
  color: var(--ntk-cms-accent-text);
}

.cms-preview-layout__nav-item {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  width: 100%;
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-item);
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  transition: all var(--ntk-cms-transition);
}

.cms-preview-layout__nav-item:hover {
  background: var(--ntk-cms-accent-soft);
  color: var(--ntk-cms-item-hover-color);
  transform: translateX(var(--ntk-cms-space-xs));
}

.cms-preview-layout__hint {
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-brand-subtitle);
}

.cms-preview-card--navigation {
  background: var(--ntk-cms-shell-bg);
}

.cms-preview-card--landing {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-landing__swatches {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-landing__swatch {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-sm);
  padding: var(--ntk-cms-space-sm);
  font-size: var(--ntk-cms-font-size-item-caption);
  color: var(--ntk-cms-text-primary);
}

.cms-preview-landing__swatch--dark {
  border-color: color-mix(in srgb, var(--ntk-cms-border-color) 70%, transparent);
}

.cms-preview-landing__hero-title {
  font-family: var(--ntk-cms-font-display);
  font-size: var(--ntk-cms-font-size-title-app);
  font-weight: var(--ntk-cms-font-weight-bold);
  letter-spacing: calc(var(--ntk-cms-letter-spacing-group-caption-mini) * 1.4);
  text-transform: uppercase;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cms-preview-landing__theme-band {
  height: calc(var(--ntk-cms-space-lg) * 1.8);
  border-radius: var(--ntk-cms-radius-sm);
}

.cms-preview-landing__code {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-sm);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  flex-wrap: wrap;
  font-family: var(--ntk-cms-font-display);
  font-size: var(--ntk-cms-font-size-item-caption);
}

.cms-preview-card--theme-preset {
  display: grid;
  gap: var(--ntk-cms-space-xs);
}

.cms-theme-token {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  min-width: 0;
}

.cms-theme-token span {
  min-width: 0;
  font-size: var(--ntk-cms-font-size-item-label);
  line-height: var(--ntk-cms-line-height-item-label);
}

.cms-theme-token code {
  font-size: var(--ntk-cms-font-size-brand-subtitle);
  word-break: break-all;
}

.cms-theme-token__dot {
  width: var(--ntk-cms-space-md);
  height: var(--ntk-cms-space-md);
  border-radius: 50%;
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  flex-shrink: 0;
}

.cms-preview-nav-caption {
  margin-bottom: var(--ntk-cms-space-xs);
  font-size: var(--ntk-cms-font-size-group-caption);
  text-transform: uppercase;
  letter-spacing: var(--ntk-cms-letter-spacing-group-caption);
  color: var(--ntk-cms-group-caption);
}

.cms-preview-nav-item {
  width: 100%;
  border: var(--ntk-cms-border-width) solid transparent;
  border-radius: var(--ntk-cms-radius-md);
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  color: var(--ntk-cms-item-text);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  font-size: var(--ntk-cms-font-size-item-label);
  font-weight: var(--ntk-cms-font-weight-semibold);
  line-height: var(--ntk-cms-line-height-item-label);
  background: transparent;
  transition: all var(--ntk-cms-transition);
}

.cms-preview-nav-item__icon {
  color: var(--ntk-cms-item-icon);
  transition: color var(--ntk-cms-transition);
}

.cms-preview-nav-item + .cms-preview-nav-item {
  margin-top: var(--ntk-cms-space-xs);
}

.cms-preview-nav-item--hover {
  background: var(--ntk-cms-accent-soft);
  color: var(--ntk-cms-item-hover-color);
}

.cms-preview-nav-item--hover .cms-preview-nav-item__icon {
  color: var(--ntk-cms-item-icon-hover);
}

.cms-preview-nav-item--active {
  background: var(--ntk-cms-active-bg);
  color: var(--ntk-cms-accent);
  border-color: var(--ntk-cms-accent-soft);
  font-weight: var(--ntk-cms-font-weight-semibold);
}

.cms-preview-nav-item--active .cms-preview-nav-item__icon {
  color: var(--ntk-cms-accent);
}

.cms-preview-nav-mini-caption {
  margin-top: var(--ntk-cms-space-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--ntk-cms-preview-mini-caption-min-width);
  height: var(--ntk-cms-preview-mini-caption-height);
  padding: 0 var(--ntk-cms-space-xs);
  border-radius: var(--ntk-cms-group-caption-mini-radius);
  font-size: var(--ntk-cms-font-size-group-caption-mini);
  font-weight: var(--ntk-cms-font-weight-bold);
  letter-spacing: var(--ntk-cms-letter-spacing-group-caption-mini);
  background: var(--ntk-cms-group-caption-mini-bg);
  color: var(--ntk-cms-group-caption);
}

.cms-preview-card--header {
  background: var(--ntk-cms-header-bg);
  color: var(--ntk-cms-header-text);
  box-shadow: var(--ntk-cms-header-shadow);
  backdrop-filter: var(--ntk-cms-header-blur);
}

.cms-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-md);
}

.cms-preview-header__left {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  color: var(--ntk-cms-title-text);
}

.cms-preview-header__menu-icon {
  color: var(--ntk-cms-toolbar-icon);
}

.cms-preview-header__title-app {
  font-family: var(--ntk-cms-font-display);
  font-size: var(--ntk-cms-font-size-title-app);
  font-weight: var(--ntk-cms-font-weight-bold);
  color: var(--ntk-cms-title-app);
}

.cms-preview-header__separator {
  color: var(--ntk-cms-title-separator);
  font-size: var(--ntk-cms-title-separator-size);
}

.cms-preview-header__title-text {
  color: var(--ntk-cms-title-text);
  font-size: var(--ntk-cms-font-size-title);
  font-weight: var(--ntk-cms-font-weight-medium);
}

.cms-preview-header__search {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  min-width: var(--ntk-cms-preview-search-width);
  min-height: var(--ntk-cms-preview-search-height);
  padding: var(--ntk-cms-space-xs) var(--ntk-cms-space-md);
  border-radius: var(--ntk-cms-radius-md);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-search-border);
  background: var(--ntk-cms-search-bg);
  color: var(--ntk-cms-search-text);
  font-size: var(--ntk-cms-font-size-item-label);
  line-height: var(--ntk-cms-line-height-item-label);
  transition: border-color var(--ntk-cms-transition);
}

.cms-preview-header__search-icon {
  color: var(--ntk-cms-search-icon);
}

.cms-preview-header__search:hover {
  border-color: var(--ntk-cms-search-border-hover);
}

.cms-preview-header__actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-header__action {
  position: relative;
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-search-border);
  border-radius: var(--ntk-cms-radius-sm);
  padding: var(--ntk-cms-space-xs) var(--ntk-cms-space-sm);
  min-width: var(--ntk-cms-preview-action-min-width);
  min-height: var(--ntk-cms-preview-action-min-height);
  background: var(--ntk-cms-action-bg);
  color: var(--ntk-cms-toolbar-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ntk-cms-transition);
}

.cms-preview-header__action:hover {
  background: var(--ntk-cms-action-hover);
  color: var(--ntk-cms-item-hover-color);
  transform: translateY(var(--ntk-cms-preview-action-hover-translate-y));
}

.cms-preview-header__badge {
  position: absolute;
  top: calc(var(--ntk-cms-space-xs) * -1);
  right: calc(var(--ntk-cms-space-xs) * -1);
  min-width: var(--ntk-cms-preview-badge-min-size);
  height: var(--ntk-cms-preview-badge-min-size);
  border-radius: var(--ntk-cms-group-caption-mini-radius);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--ntk-cms-space-xs);
  font-size: var(--ntk-cms-preview-badge-font-size);
  font-weight: var(--ntk-cms-font-weight-bold);
  letter-spacing: var(--ntk-cms-preview-badge-letter-spacing);
  background: var(--ntk-cms-notification-badge-bg);
  color: var(--ntk-cms-notification-badge-text);
}

.cms-preview-drawer {
  margin-top: var(--ntk-cms-space-sm);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  box-shadow: var(--ntk-cms-drawer-shadow);
  overflow: hidden;
}

.cms-preview-drawer__item {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  width: 100%;
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  color: var(--ntk-cms-item-text);
}

.cms-preview-drawer__item :deep(.q-icon) {
  color: var(--ntk-cms-item-icon);
}

.cms-preview-drawer__footer {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  width: 100%;
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  border-top: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
  background: var(--ntk-cms-drawer-footer-bg);
  color: var(--ntk-cms-item-text);
  box-shadow: var(--ntk-cms-drawer-footer-shadow);
}

.cms-preview-drawer__footer :deep(.q-icon) {
  color: var(--ntk-cms-item-icon);
}

.cms-preview-card--branding {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-preview-brand {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-brand__logo {
  width: var(--ntk-cms-preview-brand-logo-size);
  height: var(--ntk-cms-preview-brand-logo-size);
  border-radius: var(--ntk-cms-radius-lg);
  object-fit: cover;
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-border-color);
}

.cms-preview-brand__copy {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-preview-brand__copy strong {
  font-family: var(--ntk-cms-font-display);
  font-size: var(--ntk-cms-font-size-brand-title);
  font-weight: var(--ntk-cms-font-weight-semibold);
  color: var(--ntk-cms-brand-title);
}

.cms-preview-brand__copy small {
  font-size: var(--ntk-cms-font-size-brand-subtitle);
  font-weight: var(--ntk-cms-font-weight-regular);
  color: var(--ntk-cms-brand-subtitle);
}

.cms-preview-brand__meta {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--ntk-cms-space-sm);
  align-items: center;
}

.cms-preview-brand__meta-row {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-brand__meta-row span {
  font-size: var(--ntk-cms-font-size-brand-subtitle);
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-brand__meta-row code {
  font-size: var(--ntk-cms-font-size-item-caption);
  word-break: break-all;
}

.cms-preview-user {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-user img {
  width: var(--ntk-cms-preview-user-avatar-size);
  height: var(--ntk-cms-preview-user-avatar-size);
  border-radius: 50%;
  object-fit: cover;
}

.cms-preview-user small {
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-card--menu {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-menu-group {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-menu-group > small {
  color: var(--ntk-cms-group-caption);
  font-size: var(--ntk-cms-font-size-group-caption);
  text-transform: uppercase;
  letter-spacing: var(--ntk-cms-letter-spacing-group-caption);
}

.cms-preview-menu-items {
  display: grid;
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-menu-item {
  border: var(--ntk-cms-border-width) solid transparent;
  border-radius: var(--ntk-cms-radius-md);
  background: transparent;
  color: var(--ntk-cms-item-text);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  font-size: var(--ntk-cms-font-size-item-label);
  font-weight: var(--ntk-cms-font-weight-semibold);
  line-height: var(--ntk-cms-line-height-item-label);
  text-align: left;
  transition: all var(--ntk-cms-transition);
}

.cms-preview-menu-item :deep(.q-icon) {
  color: var(--ntk-cms-item-icon);
}

.cms-preview-menu-item--active {
  background: var(--ntk-cms-active-bg);
  color: var(--ntk-cms-accent);
  border-color: var(--ntk-cms-accent-soft);
  font-weight: var(--ntk-cms-font-weight-semibold);
}

.cms-preview-menu-item--active :deep(.q-icon) {
  color: var(--ntk-cms-accent);
}

.cms-preview-card--topbar {
  background: var(--ntk-cms-header-bg);
  color: var(--ntk-cms-header-text);
  box-shadow: var(--ntk-cms-header-shadow);
  backdrop-filter: var(--ntk-cms-header-blur);
}

.cms-preview-topbar {
  min-height: var(--ntk-cms-preview-search-height);
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-md);
}

.cms-preview-topbar__left {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  color: var(--ntk-cms-title-text);
  font-size: var(--ntk-cms-font-size-title);
  font-weight: var(--ntk-cms-font-weight-medium);
}

.cms-preview-topbar__left :deep(.q-icon) {
  color: var(--ntk-cms-toolbar-icon);
}

.cms-preview-topbar__search {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-search-border);
  border-radius: var(--ntk-cms-radius-md);
  padding: var(--ntk-cms-space-xs) var(--ntk-cms-space-sm);
  background: var(--ntk-cms-search-bg);
  color: var(--ntk-cms-search-text);
  font-size: var(--ntk-cms-font-size-item-label);
  line-height: var(--ntk-cms-line-height-item-label);
  transition: border-color var(--ntk-cms-transition);
}

.cms-preview-topbar__search :deep(.q-icon) {
  color: var(--ntk-cms-search-icon);
}

.cms-preview-topbar__search:hover {
  border-color: var(--ntk-cms-search-border-hover);
}

.cms-preview-topbar__actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-topbar__action {
  border: var(--ntk-cms-border-width) solid var(--ntk-cms-search-border);
  border-radius: var(--ntk-cms-radius-sm);
  padding: var(--ntk-cms-space-xs) var(--ntk-cms-space-sm);
  min-width: var(--ntk-cms-preview-action-min-width);
  min-height: var(--ntk-cms-preview-action-min-height);
  background: var(--ntk-cms-action-bg);
  color: var(--ntk-cms-toolbar-icon);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-xs);
  font-size: var(--ntk-cms-font-size-item-caption);
  line-height: var(--ntk-cms-line-height-item-caption);
  transition: all var(--ntk-cms-transition);
}

.cms-preview-topbar__action:hover {
  background: var(--ntk-cms-action-hover);
  color: var(--ntk-cms-item-hover-color);
  transform: translateY(var(--ntk-cms-preview-action-hover-translate-y));
}

.cms-preview-card--content {
  display: grid;
  gap: var(--ntk-cms-space-sm);
}

.cms-preview-content-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-cms-space-xs);
}

.cms-preview-content-text {
  margin: 0;
}

.cms-preview-content-status {
  display: grid;
  gap: var(--ntk-cms-space-xs);
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-base);
}

.cms-banner :deep(code) {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-cms-font-size-item-label);
}

.cms-shell-page--lg-compact .cms-pages,
.cms-shell-page--lg-compact .cms-page-item__grid,
.cms-shell-page--lg-compact .cms-blocks-summary-grid,
.cms-shell-page--lg-compact .cms-blocks-fields {
  grid-template-columns: 1fr;
}

.cms-shell-page--lg-compact .cms-page-section-row {
  grid-template-columns: 1fr;
}

.cms-shell-page--lg-compact .cms-page-section-row__actions {
  min-width: 0;
  width: 100%;
  justify-content: flex-start;
}

.cms-shell-page--lg-compact .cms-list-item--menu {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.cms-shell-page--lg-compact .cms-list-item--toolbar {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.cms-shell-page--md-compact .cms-shell-page__grid,
.cms-shell-page--md-compact .cms-config-section,
.cms-shell-page--md-compact .cms-form-grid,
.cms-shell-page--md-compact .cms-color-grid,
.cms-shell-page--md-compact .cms-toggle-row,
.cms-shell-page--md-compact .cms-theme-presets__controls,
.cms-shell-page--md-compact .cms-media-preview-item,
.cms-shell-page--md-compact .cms-preview-toolbar {
  grid-template-columns: 1fr;
}

.cms-shell-page--md-compact .cms-preview-toolbar__chips {
  justify-content: flex-start;
}

.cms-shell-page--md-compact .cms-releases__actions {
  justify-content: flex-start;
}

.cms-shell-page--md-compact .cms-shell-page__workspace {
  padding: var(--ntk-cms-space-md);
}

.cms-shell-page--md-compact .cms-toolbar-card__body {
  flex-direction: column;
  align-items: stretch;
}

.cms-shell-page--md-compact .cms-pages__header-actions {
  width: 100%;
  justify-content: flex-start;
}

.cms-shell-page--md-compact .cms-blocks__header-actions {
  width: 100%;
  justify-content: flex-start;
}

.cms-shell-page--md-compact .cms-pages__template-select {
  min-width: 0;
  width: 100%;
}

.cms-shell-page--md-compact .cms-builder-command-select {
  min-width: 0;
  width: 100%;
}

.cms-shell-page--md-compact .cms-pages__quick-starts-header {
  flex-direction: column;
}

.cms-shell-page--md-compact .cms-designer-card__workbench,
.cms-shell-page--md-compact .cms-designer-card__workbench--pages,
.cms-shell-page--md-compact .cms-designer-card__workbench--blocks {
  grid-template-columns: 1fr;
  min-height: auto;
  max-height: none;
}

.cms-shell-page--md-compact .cms-designer-card__ruler-shell,
.cms-shell-page--md-compact .cms-designer-card__ruler-shell--pages,
.cms-shell-page--md-compact .cms-designer-card__ruler-shell--blocks {
  grid-template-columns: 1fr;
}

.cms-shell-page--md-compact .cms-designer-card__toolbar-divider,
.cms-shell-page--md-compact .cms-designer-card__ruler-gutter,
.cms-shell-page--md-compact .cms-designer-card__ruler-meta {
  display: none;
}

.cms-shell-page--md-compact .cms-designer-card__rail-actions {
  flex-direction: row;
  flex-wrap: wrap;
}

.cms-shell-page--md-compact .cms-settings__tabs {
  display: block;
}

.cms-shell-page--md-compact .cms-toolbar-card__separator {
  display: none;
}

.cms-shell-page--md-compact .cms-settings__preview-grid {
  grid-template-columns: minmax(0, 1fr);
}

.cms-shell-page--md-compact .cms-toolbar-card__saved-at {
  width: 100%;
  margin-left: 0;
  text-align: center;
}

.cms-shell-page--md-compact .cms-preview-brand__meta {
  grid-template-columns: 1fr;
}

.cms-shell-page--md-compact .cms-preview-header {
  flex-direction: column;
  align-items: flex-start;
}

.cms-shell-page--md-compact .cms-preview-header__search {
  min-width: 0;
  width: 100%;
}

.cms-shell-page--md-compact .cms-preview-header__actions {
  margin-left: 0;
  width: 100%;
  justify-content: flex-start;
}

.cms-shell-page--md-compact .cms-preview-topbar {
  flex-wrap: wrap;
}

.cms-shell-page--md-compact .cms-preview-topbar__search {
  order: 3;
  width: 100%;
}

.cms-shell-page--md-compact .cms-preview-topbar__actions {
  margin-left: 0;
  width: 100%;
  justify-content: flex-start;
}

.cms-shell-page--md-compact .cms-list-item,
.cms-shell-page--md-compact .cms-list-item--menu,
.cms-shell-page--md-compact .cms-list-item--toolbar {
  grid-template-columns: 1fr;
}
</style>