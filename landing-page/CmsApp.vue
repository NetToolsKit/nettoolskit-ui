<template>
  <NtkAppShell
    v-bind="shellSnapshot.shellConfig"
    v-model:active-item="activeMenuId"
    v-model:search-value="searchQuery"
    :items="shellSnapshot.filteredItems"
    @toolbar-action="onToolbarAction"
  >
    <template #default="{ activeItem }">
      <div class="cms-shell-page" :style="cmsStyleVars">
        <div class="cms-shell-page__workspace">
        <div class="cms-shell-page__hero">
          <h1>{{ activeItem.label }}</h1>
          <p>{{ activeItem.description || settings.content.moduleFallbackDescription }}</p>
        </div>

        <div v-if="isSettingsModule" class="cms-settings">
          <!-- ── Admin Card ───────────────────────────────────────── -->
          <div class="cms-settings__admin">
          <!-- ── Tenant Card ──────────────────────────────────────── -->
          <div class="cms-toolbar-card">
            <div class="cms-toolbar-card__header">
              <q-icon name="business" size="18px" class="cms-toolbar-card__icon" />
              <span class="cms-toolbar-card__title">Tenant Profile</span>
            </div>
            <div class="cms-toolbar-card__body">
              <q-select
                :model-value="activeTenantProfileId"
                outlined
                dense
                emit-value
                map-options
                :options="tenantProfileOptions"
                label="Tenant profile"
                aria-label="Tenant profile selector"
                class="cms-toolbar-card__select"
                @update:model-value="onTenantProfileChange"
              />
              <div class="cms-toolbar-card__actions">
                <q-btn flat dense no-caps icon="add" label="New" aria-label="Create tenant profile" @click="createTenantProfileFromPrompt" />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="delete"
                  label="Delete"
                  aria-label="Delete active tenant profile"
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
              <span class="cms-toolbar-card__title">Actions</span>
              <span class="cms-toolbar-card__saved-at" role="status" aria-live="polite" aria-atomic="true">{{ savedAtLabel }}</span>
            </div>
            <div class="cms-toolbar-card__body">
              <div class="cms-toolbar-card__actions">
                <q-btn no-caps unelevated icon="save" label="Save" aria-label="Save tenant settings" :style="primaryActionStyle" @click="saveNow" />
                <q-btn flat no-caps icon="restart_alt" label="Reset" aria-label="Reset tenant settings to defaults" :style="dangerActionStyle" @click="resetToDefaults" />
              </div>
              <q-separator vertical inset class="cms-toolbar-card__separator" />
              <div class="cms-toolbar-card__actions">
                <q-btn flat dense no-caps icon="download" label="Export" aria-label="Export active tenant as JSON" @click="exportActiveTenantProfile" />
                <q-btn flat dense no-caps icon="upload_file" label="Import" aria-label="Import tenant settings from JSON" @click="openTenantImportDialog" />
              </div>
            </div>
          </div>
          <input
            ref="tenantImportInputRef"
            type="file"
            accept="application/json,.json"
            aria-label="Import tenant JSON file"
            class="cms-file-input"
            @change="onTenantImportFileChange"
          >
          </div>

          <!-- ── Editor Card ──────────────────────────────────────── -->
          <div class="cms-settings__editor">
          <q-tabs v-model="activeSettingsTab" dense inline-label class="cms-settings__tabs" aria-label="CMS settings sections">
            <q-tab name="branding" icon="branding_watermark" :label="settings.content.tabBrandingLabel" :aria-label="settings.content.tabBrandingLabel" />
            <q-tab name="typography" icon="text_fields" :label="settings.content.tabTypographyLabel" :aria-label="settings.content.tabTypographyLabel" />
            <q-tab name="layout" icon="dashboard_customize" :label="settings.content.tabLayoutLabel" :aria-label="settings.content.tabLayoutLabel" />
            <q-tab name="colors" icon="palette" :label="settings.content.tabColorsLabel" :aria-label="settings.content.tabColorsLabel" />
            <q-tab name="menu" icon="menu" :label="settings.content.tabMenuLabel" :aria-label="settings.content.tabMenuLabel" />
            <q-tab name="topbar" icon="web_asset" :label="settings.content.tabTopbarLabel" :aria-label="settings.content.tabTopbarLabel" />
            <q-tab name="content" icon="edit_note" :label="settings.content.tabContentLabel" :aria-label="settings.content.tabContentLabel" />
          </q-tabs>

          <q-tab-panels v-model="activeSettingsTab" animated class="cms-settings__panels">
            <q-tab-panel name="branding">
              <div class="cms-config-section">
                <div class="cms-config-section__form">
                  <div class="cms-form-grid">
                    <q-input v-model="settings.branding.appName" outlined dense label="Product name" />
                    <q-input v-model="settings.branding.appSubtitle" outlined dense label="Product subtitle" />
                    <q-input v-model="settings.branding.brandLogo" outlined dense label="Logo URL" />
                    <q-input v-model="settings.branding.brandLogoAlt" outlined dense label="Logo alt text" />
                    <q-input v-model="settings.branding.faviconUrl" outlined dense label="Favicon URL" />
                    <q-input v-model="settings.branding.userAvatar" outlined dense label="User avatar URL" />
                    <q-input v-model="settings.branding.userTooltip" outlined dense label="User tooltip" />
                    <q-input v-model="settings.branding.notificationsTooltip" outlined dense label="Notifications tooltip" />
                    <q-input v-model.number="settings.branding.notificationCount" outlined dense type="number" min="0" label="Notification count" />
                  </div>

                  <q-banner rounded class="cms-banner" :style="bannerStyle">
                    {{ settings.content.brandingBannerText }}
                  </q-banner>
                </div>

                <div class="cms-config-section__example">
                  <div class="cms-example-section cms-example-section--inline">
                    <div class="cms-example-section__header">
                      <strong>Branding example</strong>
                      <small>Live preview of logo, product identity and account information.</small>
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
                          <span>Favicon</span>
                          <code>{{ settings.branding.faviconUrl || settings.branding.brandLogo }}</code>
                        </div>
                        <div class="cms-preview-brand__meta-row">
                          <span>User</span>
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
                        <strong>Typography example</strong>
                        <small>Families, weights, styles and shell text scales.</small>
                      </div>
                      <div class="cms-preview-card cms-preview-card--typography">
                        <div class="cms-preview-typography__headline">{{ settings.branding.appName }}</div>
                        <div class="cms-preview-typography__title">Shell heading and context text</div>
                        <p class="cms-preview-typography__body">
                          This paragraph uses base family/style. Adjust fonts and sizes to match each tenant brand.
                        </p>
                        <div class="cms-preview-typography__menu">
                          <div class="cms-preview-typography__menu-label">Menu label</div>
                          <div class="cms-preview-typography__menu-caption">Caption for module context</div>
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
                        <strong>Layout and motion example</strong>
                        <small>Spacing, radius and transition tokens on shell widgets.</small>
                      </div>
                      <div class="cms-preview-card cms-preview-card--layout">
                        <div class="cms-preview-layout__row">
                          <div class="cms-preview-layout__panel">Panel A</div>
                          <div class="cms-preview-layout__panel cms-preview-layout__panel--accent">Panel B</div>
                        </div>
                        <div class="cms-preview-layout__nav-item">
                          <q-icon name="tune" class="cms-icon cms-icon--sm" />
                          <span>Hover-ready item spacing</span>
                        </div>
                        <small class="cms-preview-layout__hint">Move mouse over cards/items to validate transition token.</small>
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
                    <strong>Theme values preset</strong>
                    <small>Apply a complete set of theme values before fine tuning token fields.</small>
                  </div>

                  <div class="cms-theme-presets__controls">
                    <q-select
                      :model-value="selectedThemePreset"
                      outlined
                      dense
                      emit-value
                      map-options
                      :options="themePresetOptions"
                      label="Theme preset"
                      @update:model-value="onThemePresetChange"
                    />
                    <q-btn flat dense no-caps icon="sync" label="Detect from current values" @click="detectThemePresetFromCurrent" />
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
                        <span>Accent: <code>{{ settings.theme.itemActiveColor || defaultTheme.itemActiveColor }}</code></span>
                      </div>
                      <div class="cms-theme-token">
                        <span class="cms-theme-token__dot" :style="{ background: settings.theme.headerBackground || defaultTheme.headerBackground }" />
                        <span>Header: <code>{{ settings.theme.headerBackground || defaultTheme.headerBackground }}</code></span>
                      </div>
                      <div class="cms-theme-token">
                        <span class="cms-theme-token__dot" :style="{ background: settings.theme.drawerBackground || defaultTheme.drawerBackground }" />
                        <span>Surface: <code>{{ settings.theme.drawerBackground || defaultTheme.drawerBackground }}</code></span>
                      </div>
                      <div class="cms-theme-token">
                        <span class="cms-theme-token__dot" :style="{ background: settings.theme.pageBackground || defaultTheme.pageBackground }" />
                        <span>Page: <code>{{ settings.theme.pageBackground || defaultTheme.pageBackground }}</code></span>
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
                      <template v-if="group.id === 'foundation'">
                        <div class="cms-example-section__header">
                          <strong>Foundation example</strong>
                          <small>Surface, text and border tokens applied together.</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--foundation">
                          <strong>Editable shell foundation</strong>
                          <p>This card uses the same base tokens as the shell page and CMS cards.</p>
                          <q-chip dense square class="cms-preview-chip">{{ settings.content.statusChipLabel }}</q-chip>
                        </div>
                      </template>

                      <template v-else-if="group.id === 'navigation'">
                        <div class="cms-example-section__header">
                          <strong>Navigation example</strong>
                          <small>Sidebar text, icon, caption and active states.</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--navigation">
                          <div class="cms-preview-nav-caption">Core</div>
                          <div class="cms-preview-nav-item">
                            <q-icon name="dashboard" class="cms-icon cms-icon--sm cms-preview-nav-item__icon" />
                            <span>Overview</span>
                          </div>
                          <div class="cms-preview-nav-item cms-preview-nav-item--hover">
                            <q-icon name="query_stats" class="cms-icon cms-icon--sm cms-preview-nav-item__icon" />
                            <span>Analytics</span>
                          </div>
                          <div class="cms-preview-nav-item cms-preview-nav-item--active">
                            <q-icon name="settings" class="cms-icon cms-icon--sm cms-preview-nav-item__icon" />
                            <span>Settings</span>
                          </div>
                          <div class="cms-preview-nav-mini-caption">CO</div>
                        </div>
                      </template>

                      <template v-else-if="group.id === 'header'">
                        <div class="cms-example-section__header">
                          <strong>Header and search example</strong>
                          <small>Topbar title, search, icon colors and notification badge.</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--header">
                          <div class="cms-preview-header">
                            <div class="cms-preview-header__left">
                              <q-icon :name="settings.layout.menuIcon" class="cms-icon cms-icon--md cms-preview-header__menu-icon" />
                              <strong class="cms-preview-header__title-app">{{ settings.branding.appName }}</strong>
                              <q-icon name="chevron_right" class="cms-icon cms-icon--sm cms-preview-header__separator" />
                              <span class="cms-preview-header__title-text">Settings</span>
                            </div>
                            <div class="cms-preview-header__search">
                              <q-icon name="search" class="cms-icon cms-icon--sm cms-preview-header__search-icon" />
                              <span>{{ settings.layout.searchPlaceholder }}</span>
                            </div>
                            <div class="cms-preview-header__actions">
                              <button v-if="settings.layout.showNotifications" type="button" class="cms-preview-header__action" aria-label="Notifications action preview">
                                <q-icon name="notifications" class="cms-icon cms-icon--sm" />
                                <span class="cms-preview-header__badge">{{ settings.branding.notificationCount || 2 }}</span>
                              </button>
                              <button v-if="settings.layout.showUserAvatar" type="button" class="cms-preview-header__action" aria-label="Account action preview">
                                <q-icon name="account_circle" class="cms-icon cms-icon--sm" />
                              </button>
                              <button type="button" class="cms-preview-header__action" aria-label="Home action preview">
                                <q-icon name="home" class="cms-icon cms-icon--sm" />
                              </button>
                            </div>
                          </div>
                          <div class="cms-preview-drawer">
                            <div class="cms-preview-drawer__item">
                              <q-icon name="dashboard" class="cms-icon cms-icon--sm" />
                              <span>Drawer item</span>
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
                          <strong>Notifications example</strong>
                          <small>Success, warning, error and info chips in real time.</small>
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
                          <button type="button" class="cms-notification-actions-preview__action" aria-label="Account hover preview">
                            <q-icon name="account_circle" class="cms-icon cms-icon--sm" />
                            <span>Account</span>
                          </button>
                          <button type="button" class="cms-notification-actions-preview__action" aria-label="Landing hover preview">
                            <q-icon name="home" class="cms-icon cms-icon--sm" />
                            <span>Landing</span>
                          </button>
                          <button type="button" class="cms-notification-actions-preview__action cms-notification-actions-preview__action--forced-hover">
                            <q-icon name="visibility" class="cms-icon cms-icon--sm" />
                            <span>Hover sample</span>
                          </button>
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
                    <strong>Groups</strong>
                    <q-btn flat dense no-caps icon="add" label="Add group" @click="addGroup" />
                  </div>
                  <div class="cms-list">
                    <div v-for="(group, index) in settings.navGroups" :key="group.id" class="cms-list-item">
                      <q-input v-model="group.id" outlined dense label="Group ID" @blur="normalizeGroupId(index)" />
                      <q-input v-model="group.label" outlined dense label="Group label" />
                      <q-btn flat round dense icon="delete" :style="dangerActionStyle" @click="removeGroup(index)" />
                    </div>
                  </div>

                  <q-separator class="q-my-md" />

                  <div class="cms-section-header">
                    <strong>Menu items</strong>
                    <q-btn flat dense no-caps icon="add" label="Add item" @click="addMenuItem" />
                  </div>
                  <div class="cms-list">
                    <div v-for="(item, index) in settings.items" :key="item.id" class="cms-list-item cms-list-item--menu">
                      <q-input v-model="item.id" outlined dense label="Item ID" />
                      <q-input v-model="item.label" outlined dense label="Label" />
                      <q-input v-model="item.icon" outlined dense label="Icon" />
                      <q-select
                        v-model="item.group"
                        outlined
                        dense
                        emit-value
                        map-options
                        :options="groupOptions"
                        label="Group"
                      />
                      <q-input v-model="item.caption" outlined dense label="Caption" />
                      <q-input v-model="item.description" outlined dense label="Description" />
                      <q-input v-model="item.badge" outlined dense label="Badge" />
                      <q-input v-model="item.badgeColor" outlined dense label="Badge color" />
                      <q-input v-model="item.badgeTextColor" outlined dense label="Badge text color" />
                      <q-btn flat round dense icon="delete" :style="dangerActionStyle" @click="removeMenuItem(index)" />
                    </div>
                  </div>
                </div>

                <div class="cms-config-section__example">
                  <div class="cms-example-section cms-example-section--inline">
                    <div class="cms-example-section__header">
                      <strong>Sidebar menu example</strong>
                      <small>Groups and items structure preview with active state.</small>
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
                    <q-input v-model="settings.layout.menuIcon" outlined dense label="Menu icon" />
                    <q-input v-model="settings.layout.menuAriaLabel" outlined dense label="Menu aria-label" />
                    <q-input v-model="settings.layout.searchPlaceholder" outlined dense label="Search placeholder" />
                    <q-input v-model="settings.layout.collapseLabel" outlined dense label="Collapse label" />
                    <q-input v-model="settings.layout.expandLabel" outlined dense label="Expand label" />
                    <q-input v-model.number="settings.layout.headerHeight" outlined dense type="number" min="48" label="Header height" />
                    <q-input v-model.number="settings.layout.drawerWidth" outlined dense type="number" min="180" label="Drawer width" />
                    <q-input v-model.number="settings.layout.miniWidth" outlined dense type="number" min="56" label="Mini width" />
                    <q-input v-model.number="settings.layout.breakpoint" outlined dense type="number" min="480" label="Breakpoint" />
                  </div>

                  <div class="cms-toggle-row">
                    <q-toggle v-model="settings.layout.showSearch" label="Show search" />
                    <q-toggle v-model="settings.layout.showNotifications" label="Show notifications" />
                    <q-toggle v-model="settings.layout.showUserAvatar" label="Show account action" />
                    <q-toggle v-model="settings.layout.showGroupCaptions" label="Show group captions" />
                    <q-toggle v-model="settings.layout.collapsible" label="Allow sidebar collapse" />
                    <q-toggle v-model="settings.layout.defaultDrawerOpen" label="Drawer open by default" />
                    <q-toggle v-model="settings.layout.defaultMini" label="Mini mode by default" />
                  </div>

                  <q-separator class="q-my-md" />

                  <div class="cms-section-header">
                    <strong>Topbar actions</strong>
                    <q-btn flat dense no-caps icon="add" label="Add action" @click="addToolbarAction" />
                  </div>
                  <div class="cms-list">
                    <div v-for="(action, index) in settings.toolbarActions" :key="action.id" class="cms-list-item cms-list-item--toolbar">
                      <q-input v-model="action.id" outlined dense label="Action ID" />
                      <q-input v-model="action.icon" outlined dense label="Icon" />
                      <q-input v-model="action.label" outlined dense label="Label" />
                      <q-input v-model="action.tooltip" outlined dense label="Tooltip" />
                      <q-input v-model="action.href" outlined dense label="Href" />
                      <q-input v-model="action.color" outlined dense label="Color" />
                      <q-input v-model="action.textColor" outlined dense label="Text color" />
                      <q-input v-model="action.badge" outlined dense label="Badge" />
                      <q-input v-model="action.badgeColor" outlined dense label="Badge color (or semantic)" />
                      <q-input v-model="action.badgeTextColor" outlined dense label="Badge text color" />
                      <q-input v-model="action.className" outlined dense label="Class name" />
                      <q-toggle v-model="action.showLabel" label="Show label" />
                      <q-toggle v-model="action.external" label="Open external" />
                      <q-toggle v-model="action.flat" label="Flat" />
                      <q-toggle v-model="action.dense" label="Dense" />
                      <q-toggle v-model="action.round" label="Round" />
                      <q-toggle v-model="action.unelevated" label="Unelevated" />
                      <q-toggle v-model="action.outline" label="Outline" />
                      <q-toggle v-model="action.noCaps" label="No caps" />
                      <q-btn flat round dense icon="delete" :style="dangerActionStyle" @click="removeToolbarAction(index)" />
                    </div>
                  </div>
                </div>

                <div class="cms-config-section__example">
                  <div class="cms-example-section cms-example-section--inline">
                    <div class="cms-example-section__header">
                      <strong>Topbar example</strong>
                      <small>Header height, search visibility and actions rendered together.</small>
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
                    <q-input v-model="settings.content.moduleFallbackDescription" outlined dense type="textarea" autogrow label="Module fallback description" />
                    <q-input v-model="settings.content.brandingBannerText" outlined dense type="textarea" autogrow label="Branding banner text" />
                    <q-input v-model="settings.content.colorsBannerText" outlined dense type="textarea" autogrow label="Colors banner text" />
                    <q-input v-model="settings.content.statusTitle" outlined dense label="Status card title" />
                    <q-input v-model="settings.content.statusChipLabel" outlined dense label="Status chip label" />
                    <q-input v-model="settings.content.statusThemeText" outlined dense label="Status: theme line" />
                    <q-input v-model="settings.content.statusBrandingText" outlined dense label="Status: branding line" />
                    <q-input v-model="settings.content.statusMenuText" outlined dense label="Status: menu line" />
                    <q-input v-model="settings.content.statusTopbarText" outlined dense label="Status: topbar line" />
                    <q-input v-model="settings.content.howToTitle" outlined dense label="How-to title" />
                    <q-input v-model="settings.content.howToBody" outlined dense type="textarea" autogrow label="How-to body" />
                    <q-input v-model="settings.content.howToNextStep" outlined dense type="textarea" autogrow label="How-to next step" />
                    <q-input v-model="settings.content.previewSuccessLabel" outlined dense label="Preview success label" />
                    <q-input v-model="settings.content.previewWarningLabel" outlined dense label="Preview warning label" />
                    <q-input v-model="settings.content.previewErrorLabel" outlined dense label="Preview error label" />
                    <q-input v-model="settings.content.previewInfoLabel" outlined dense label="Preview info label" />
                    <q-input v-model="settings.content.tabBrandingLabel" outlined dense label="Tab: branding label" />
                    <q-input v-model="settings.content.tabTypographyLabel" outlined dense label="Tab: typography label" />
                    <q-input v-model="settings.content.tabLayoutLabel" outlined dense label="Tab: layout label" />
                    <q-input v-model="settings.content.tabColorsLabel" outlined dense label="Tab: colors label" />
                    <q-input v-model="settings.content.tabMenuLabel" outlined dense label="Tab: menu label" />
                    <q-input v-model="settings.content.tabTopbarLabel" outlined dense label="Tab: topbar label" />
                    <q-input v-model="settings.content.tabContentLabel" outlined dense label="Tab: content label" />
                  </div>
                </div>

                <div class="cms-config-section__example">
                  <div class="cms-example-section cms-example-section--inline">
                    <div class="cms-example-section__header">
                      <strong>Content copy example</strong>
                      <small>Preview of tab labels, banners and instructional text.</small>
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
            </q-tab-panel>
          </q-tab-panels>
          </div>
        </div>

        <div v-else-if="isPagesModule" class="cms-pages">
          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Pages builder</strong>
              <q-btn flat dense no-caps icon="add" label="Add page" @click="addCmsPage" />
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-pages__editor">
              <div
                v-for="(page, pageIndex) in settings.pages"
                :key="page.id"
                class="cms-page-item"
              >
                <div class="cms-page-item__grid">
                  <q-input v-model="page.id" outlined dense label="Page ID" @blur="normalizeCmsPageId(pageIndex)" />
                  <q-input v-model="page.title" outlined dense label="Title" />
                  <q-input v-model="page.path" outlined dense label="Path" @blur="normalizeCmsPagePath(pageIndex)" />
                  <q-select
                    v-model="page.status"
                    outlined
                    dense
                    emit-value
                    map-options
                    :options="pageStatusOptions"
                    label="Status"
                  />
                  <q-input
                    v-model="page.description"
                    outlined
                    dense
                    type="textarea"
                    autogrow
                    label="Description"
                    class="cms-page-item__description"
                  />
                </div>

                <div class="cms-page-item__sections">
                  <div class="cms-page-item__sections-header">
                    <strong>Sections</strong>
                    <q-btn flat dense no-caps icon="add" label="Add section" @click="addCmsPageSection(pageIndex)" />
                  </div>
                  <div
                    v-for="(section, sectionIndex) in page.sections"
                    :key="`${page.id}-${section.id}-${sectionIndex}`"
                    class="cms-page-section-row"
                  >
                    <q-input v-model="section.id" outlined dense label="Section ID" />
                    <q-input v-model="section.label" outlined dense label="Section label" />
                    <q-toggle v-model="section.enabled" label="Enabled" />
                    <q-btn
                      flat
                      dense
                      no-caps
                      icon="widgets"
                      label="Open blocks"
                      @click="openPageInBlocksEditor(page.id, section.id)"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="delete"
                      :style="dangerActionStyle"
                      @click="removeCmsPageSection(pageIndex, sectionIndex)"
                    />
                  </div>
                </div>

                <div class="cms-page-item__actions">
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="widgets"
                    label="Open blocks"
                    @click="openPageInBlocksEditor(page.id)"
                  />
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="delete"
                    label="Delete page"
                    :style="dangerActionStyle"
                    :disable="settings.pages.length <= 1"
                    @click="removeCmsPage(pageIndex)"
                  />
                </div>
              </div>
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Pages preview</strong>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-pages__preview">
              <article
                v-for="page in settings.pages"
                :key="`preview-${page.id}`"
                class="cms-page-preview"
              >
                <div class="cms-page-preview__header">
                  <strong>{{ page.title }}</strong>
                  <q-chip dense square :style="getCmsPageStatusStyle(page.status)">
                    {{ page.status }}
                  </q-chip>
                </div>
                <small class="cms-page-preview__path">{{ page.path }}</small>
                <p>{{ page.description || 'No description provided.' }}</p>
                <div class="cms-page-preview__sections">
                  <q-chip
                    v-for="section in page.sections"
                    :key="`${page.id}-${section.id}`"
                    dense
                    square
                    :style="getCmsPageSectionStyle(section.enabled)"
                  >
                    {{ section.label }}
                  </q-chip>
                </div>
              </article>
            </div>
          </q-card>
        </div>

        <div v-else-if="isBlocksModule" class="cms-shell-page__grid">
          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Blocks manager</strong>
              <q-chip dense square :style="statusChipStyle">{{ cmsSectionBlocks.length }} blocks</q-chip>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-blocks__editor">
              <div class="cms-form-grid cms-blocks-toolbar">
                <q-select
                  v-model="activeBlocksPageId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="blocksPageOptions"
                  label="Target page"
                />
                <q-select
                  v-model="activeBlocksSectionId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="blocksSectionOptions"
                  label="Target section"
                />
                <q-select
                  v-model="activeBlocksBlockId"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="activeBlocksBlockOptions"
                  label="Target block"
                />
                <q-select
                  v-model="selectedPaletteBlockType"
                  outlined
                  dense
                  emit-value
                  map-options
                  :options="cmsBlockPaletteOptions"
                  label="Palette block"
                />
                <q-btn
                  no-caps
                  unelevated
                  icon="add"
                  label="Add block"
                  :style="primaryActionStyle"
                  :disable="!activeBlocksSectionId || !selectedPaletteBlockType"
                  @click="addCmsBuilderBlockFromPalette"
                />
              </div>

              <div class="cms-blocks-list">
                <div
                  v-for="section in activeBlocksSections"
                  :key="section.id"
                  class="cms-block-item"
                >
                  <div class="cms-block-item__meta">
                    <strong>{{ section.label }}</strong>
                    <small>{{ section.blocks.length }} blocks</small>
                  </div>

                  <div v-if="section.blocks.length === 0" class="cms-block-item__empty">
                    No blocks in this section yet.
                  </div>

                  <div
                    v-for="block in section.blocks"
                    :key="`${section.id}-${block.id}`"
                    class="cms-block-row"
                    :class="{ 'cms-block-row--active': block.id === activeBlocksBlockId }"
                  >
                    <div class="cms-block-row__meta">
                      <q-chip dense square :style="getCmsPageSectionStyle(block.enabled)">
                        {{ resolveCmsBlockDisplayName(block.type) }}
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
                        label="Select"
                        @click="setActiveBlocksSelection(block.sectionId, block.id)"
                      />
                      <q-toggle
                        :model-value="block.enabled"
                        label="Enabled"
                        @update:model-value="updateCmsBuilderBlockEnabled(block, $event)"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="arrow_upward"
                        :disable="block.blockIndex === 0"
                        @click="moveCmsBuilderBlockByRecord(block, 'up')"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="arrow_downward"
                        :disable="block.blockIndex >= section.blocks.length - 1"
                        @click="moveCmsBuilderBlockByRecord(block, 'down')"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="delete"
                        :style="dangerActionStyle"
                        @click="removeCmsBuilderBlockByRecord(block)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Blocks preview</strong>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-blocks__preview">
              <div class="cms-blocks-summary-grid">
                <div class="cms-blocks-summary-card">
                  <span>Total pages</span>
                  <strong>{{ settings.pages.length }}</strong>
                </div>
                <div class="cms-blocks-summary-card">
                  <span>Published pages</span>
                  <strong>{{ cmsPublishedPagesCount }}</strong>
                </div>
                <div class="cms-blocks-summary-card">
                  <span>Enabled blocks</span>
                  <strong>{{ cmsEnabledSectionsCount }}</strong>
                </div>
              </div>

              <div class="cms-blocks-props">
                <div class="cms-blocks-props__header">
                  <strong>Selected block props</strong>
                  <small v-if="activeBlocksSelectedBlockRecord">
                    {{ resolveCmsBlockDisplayName(activeBlocksSelectedBlockRecord.type) }} · {{ activeBlocksSelectedBlockRecord.id }}
                  </small>
                  <small v-else>No block selected</small>
                </div>
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
                        @update:model-value="updateActiveBlocksJsonFieldDraft(field, $event)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="save"
                        label="Apply field JSON"
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
                  label="Block props JSON"
                  :disable="!activeBlocksSelectedBlock"
                />
                <div class="cms-blocks-props__actions">
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="format_align_left"
                    label="Format JSON"
                    :disable="!activeBlocksSelectedBlock"
                    @click="formatSelectedBlockPropsDraft"
                  />
                  <q-btn
                    no-caps
                    unelevated
                    icon="save"
                    label="Apply props"
                    :style="primaryActionStyle"
                    :disable="!activeBlocksSelectedBlock"
                    @click="applySelectedBlockPropsDraft"
                  />
                </div>
              </div>

              <div class="cms-preview-card cms-preview-card--content">
                <CmsRenderer
                  v-if="activeBlocksSchema"
                  :page="activeBlocksSchema"
                  :registry="landingRegistry"
                />
                <p v-else>No page selected for preview.</p>
              </div>
            </div>
          </q-card>
        </div>

        <div v-else-if="isMediaModule" class="cms-shell-page__grid">
          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Media settings</strong>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-media__editor">
              <div class="cms-form-grid">
                <q-input v-model="settings.branding.brandLogo" outlined dense label="Brand logo URL" />
                <q-input v-model="settings.branding.faviconUrl" outlined dense label="Favicon URL" />
                <q-input v-model="settings.branding.userAvatar" outlined dense label="User avatar URL" />
                <q-input v-model="settings.branding.brandLogoAlt" outlined dense label="Brand logo alt text" />
              </div>
              <q-banner rounded class="cms-banner" :style="bannerStyle">
                Media values are tenant-scoped and update shell branding immediately.
              </q-banner>
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Media preview</strong>
            </div>
            <q-separator />
            <div class="cms-shell-card__body cms-media__preview">
              <article
                v-for="asset in cmsMediaAssets"
                :key="asset.id"
                class="cms-media-preview-item"
              >
                <div class="cms-media-preview-item__meta">
                  <strong>{{ asset.label }}</strong>
                  <small>{{ asset.description }}</small>
                </div>
                <div class="cms-media-preview-item__visual">
                  <img
                    v-if="isPreviewImageAsset(asset.url)"
                    :src="asset.url"
                    :alt="asset.label"
                  >
                  <q-icon v-else name="image_not_supported" class="cms-icon cms-icon--lg" />
                </div>
                <code class="cms-media-preview-item__url">{{ asset.url || 'No URL configured' }}</code>
              </article>
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
</template>

<script setup lang="ts">
/**
 * Landing page/Cms App module.
 */

import { computed, nextTick, ref, toRaw, watch } from 'vue'
import type { AppShellAction } from '../src/components/layout/app-shell.types'
import NtkAppShell from '../src/components/layout/NtkAppShell.vue'
import { CmsRenderer } from '../src/modules/cms/renderer'
import {
  createDefaultWhiteLabelSettings,
  createNewMenuItem,
  mapWhiteLabelToShellSnapshot,
} from '../src/modules/cms/white-label/config'
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
  removeCmsBuilderBlock,
  selectCmsBuilderNode,
  type CmsBuilderSelection,
  type CmsBuilderState,
} from '../src/modules/cms/white-label/builder.state'
import { CMS_SCHEMA_VERSION, type CmsPageSchema } from '../src/modules/cms'
import { createLandingRegistry } from './cms/landing.registry'
import {
  getLandingBlockFieldDefinitions,
  type CmsBlockFieldDefinition,
} from './cms/landing.block-fields'
import type {
  CmsPageBlockSettings,
  CmsPageSettings,
  CmsTenantProfile,
  CmsTenantProfilesState,
  CmsWhiteLabelActor,
  CmsWhiteLabelWorkflowAction,
  CmsWhiteLabelSettings,
} from '../src/modules/cms/white-label/types'

type ThemeFieldKey = keyof ReturnType<typeof createDefaultWhiteLabelSettings>['theme']
type ThemeFieldGroup = 'foundation' | 'typography' | 'layout' | 'navigation' | 'header' | 'notifications'

interface ThemeField {
  key: ThemeFieldKey
  group: ThemeFieldGroup
  label: string
  isColor?: boolean
  placeholder?: string
  aliases?: ThemeFieldKey[]
}

interface ThemeFieldGroupDefinition {
  id: ThemeFieldGroup
  label: string
  description: string
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
  enabled: boolean
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

interface CmsMediaAssetPreview {
  id: string
  label: string
  description: string
  url: string
}

interface CmsBlocksSectionRow {
  id: string
  label: string
  enabled: boolean
  sectionIndex: number
  blocks: CmsSectionBlockRecord[]
}

const defaultSettings = createDefaultWhiteLabelSettings()
const defaultTheme = defaultSettings.theme
const defaultMenuId = defaultSettings.items[0]?.id ?? ''
const defaultSettingsModuleId = defaultSettings.items.find(item => item.icon === 'settings')?.id ?? ''
const defaultPagesModuleId = defaultSettings.items.find(item => item.id === 'pages')?.id ?? 'pages'
const defaultBlocksModuleId = defaultSettings.items.find(item => item.id === 'blocks')?.id ?? 'blocks'
const defaultMediaModuleId = defaultSettings.items.find(item => item.id === 'media')?.id ?? 'media'
const baseThemePresets: CmsThemePreset[] = buildCmsThemePresets(defaultTheme)

/**
 * Handles theme placeholder.
 */
function themePlaceholder(key: ThemeFieldKey): string {
  const value = defaultTheme[key]
  return value ? String(value) : ''
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

const tenantProfilesState = ref<CmsTenantProfilesState>(loadCmsTenantProfilesState())
const activeTenantProfileId = ref(tenantProfilesState.value.activeProfileId)
const tenantImportInputRef = ref<HTMLInputElement | null>(null)

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
const activeSettingsTab = ref<'branding' | 'typography' | 'layout' | 'colors' | 'menu' | 'topbar' | 'content'>('branding')
const savedAtLabel = ref('Auto-save enabled')
const pageStatusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const
const initialThemePresets = getCurrentThemePresets()
const selectedThemePreset = ref<CmsThemePresetId>(
  isCmsThemePresetId(settings.value.themePresetId)
    ? settings.value.themePresetId
    : detectCmsThemePresetId(settings.value.theme, initialThemePresets, defaultTheme)
)
settings.value.themePresetId = selectedThemePreset.value

const tenantProfileOptions = computed(() => {
  return tenantProfilesState.value.profiles.map(profile => ({
    label: profile.name,
    value: profile.id,
  }))
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
    label: 'Base font style',
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
    key: 'menuSlotWidth',
    group: 'layout',
    label: 'Menu slot width',
    placeholder: themePlaceholder('menuSlotWidth'),
  },
  {
    key: 'searchWidth',
    group: 'layout',
    label: 'Search width',
    placeholder: themePlaceholder('searchWidth'),
  },
  {
    key: 'searchControlHeight',
    group: 'layout',
    label: 'Search control height',
    placeholder: themePlaceholder('searchControlHeight'),
  },
  {
    key: 'searchPrependPaddingRight',
    group: 'layout',
    label: 'Search icon right padding',
    placeholder: themePlaceholder('searchPrependPaddingRight'),
  },
  {
    key: 'drawerHeaderMinHeight',
    group: 'layout',
    label: 'Drawer header min height',
    placeholder: themePlaceholder('drawerHeaderMinHeight'),
  },
  {
    key: 'brandLogoSize',
    group: 'layout',
    label: 'Brand logo size',
    placeholder: themePlaceholder('brandLogoSize'),
  },
  {
    key: 'groupCaptionMinHeight',
    group: 'layout',
    label: 'Group caption min height',
    placeholder: themePlaceholder('groupCaptionMinHeight'),
  },
  {
    key: 'groupCaptionPadding',
    group: 'layout',
    label: 'Group caption padding',
    placeholder: themePlaceholder('groupCaptionPadding'),
  },
  {
    key: 'groupCaptionMiniPadding',
    group: 'layout',
    label: 'Group mini padding',
    placeholder: themePlaceholder('groupCaptionMiniPadding'),
  },
  {
    key: 'groupCaptionMiniMinWidth',
    group: 'layout',
    label: 'Group mini min width',
    placeholder: themePlaceholder('groupCaptionMiniMinWidth'),
  },
  {
    key: 'groupCaptionMiniHeight',
    group: 'layout',
    label: 'Group mini height',
    placeholder: themePlaceholder('groupCaptionMiniHeight'),
  },
  {
    key: 'groupCaptionMiniHorizontalPadding',
    group: 'layout',
    label: 'Group mini horizontal padding',
    placeholder: themePlaceholder('groupCaptionMiniHorizontalPadding'),
  },
  {
    key: 'itemMinHeight',
    group: 'layout',
    label: 'Item min height',
    placeholder: themePlaceholder('itemMinHeight'),
  },
  {
    key: 'itemIconSize',
    group: 'layout',
    label: 'Item icon size',
    placeholder: themePlaceholder('itemIconSize'),
  },
  {
    key: 'itemHoverTranslateX',
    group: 'layout',
    label: 'Item hover translate X',
    placeholder: themePlaceholder('itemHoverTranslateX'),
  },
  {
    key: 'itemActiveBorderWidth',
    group: 'layout',
    label: 'Item active border width',
    placeholder: themePlaceholder('itemActiveBorderWidth'),
  },
  {
    key: 'drawerScrollPaddingBottom',
    group: 'layout',
    label: 'Drawer scroll padding bottom',
    placeholder: themePlaceholder('drawerScrollPaddingBottom'),
  },
  {
    key: 'workspaceMaxWidth',
    group: 'layout',
    label: 'Workspace max width',
    placeholder: themePlaceholder('workspaceMaxWidth'),
  },
  {
    key: 'miniItemMarginRight',
    group: 'layout',
    label: 'Mini item margin right',
    placeholder: themePlaceholder('miniItemMarginRight'),
  },
  {
    key: 'miniItemAvatarMinWidth',
    group: 'layout',
    label: 'Mini item avatar min width',
    placeholder: themePlaceholder('miniItemAvatarMinWidth'),
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
    label: 'Surface background (card)',
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
  },
  {
    key: 'drawerTextColor',
    group: 'foundation',
    label: 'Surface text color',
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
  },
  {
    key: 'itemIconColor',
    group: 'navigation',
    label: 'Item icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemIconColor'),
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
  },
  {
    key: 'itemIconHoverColor',
    group: 'navigation',
    label: 'Item hover icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemIconHoverColor'),
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
  },
  {
    key: 'brandTitleColor',
    group: 'navigation',
    label: 'Brand title color (override)',
    isColor: true,
    placeholder: themePlaceholder('brandTitleColor'),
  },
  {
    key: 'brandSubtitleColor',
    group: 'navigation',
    label: 'Brand subtitle color (override)',
    isColor: true,
    placeholder: themePlaceholder('brandSubtitleColor'),
  },
  {
    key: 'groupCaptionColor',
    group: 'navigation',
    label: 'Group caption color (override)',
    isColor: true,
    placeholder: themePlaceholder('groupCaptionColor'),
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
  },
  {
    key: 'titleAppColor',
    group: 'header',
    label: 'App title color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleAppColor'),
  },
  {
    key: 'titleTextColor',
    group: 'header',
    label: 'Module title color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleTextColor'),
  },
  {
    key: 'titleSeparatorColor',
    group: 'header',
    label: 'Title separator color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleSeparatorColor'),
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
  },
  {
    key: 'searchIconColor',
    group: 'header',
    label: 'Search icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('searchIconColor'),
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
    key: 'drawerShadow',
    group: 'header',
    label: 'Drawer shadow',
    placeholder: themePlaceholder('drawerShadow'),
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
]

const typographyFieldGroups = computed(() => {
  return typographyFieldGroupsDefinition.map(group => ({
    ...group,
    fields: colorFields.filter(field => field.group === group.id),
  }))
})

const layoutFieldGroups = computed(() => {
  return layoutFieldGroupsDefinition.map(group => ({
    ...group,
    fields: colorFields.filter(field => field.group === group.id),
  }))
})

const colorFieldGroups = computed(() => {
  return colorFieldGroupsDefinition.map(group => ({
    ...group,
    fields: colorFields.filter(field => field.group === group.id),
  }))
})

const themePresets = computed(() => getCurrentThemePresets())

const themePresetOptions = computed(() => [
  ...themePresets.value.map(preset => ({ label: preset.label, value: preset.id })),
  { label: 'Custom', value: 'custom' as CmsThemePresetId },
])

const activeThemePreset = computed(() => {
  return themePresets.value.find(preset => preset.id === selectedThemePreset.value)
})

const activeThemePresetLabel = computed(() => {
  return activeThemePreset.value?.label ?? 'Custom theme'
})

const activeThemePresetDescription = computed(() => {
  return activeThemePreset.value?.description ?? 'Custom values from manual token editing.'
})

const shellSnapshot = computed(() => {
  return mapWhiteLabelToShellSnapshot(settings.value, {
    activeItem: activeMenuId.value,
    searchValue: searchQuery.value,
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

const cmsStyleVars = computed<Record<string, string>>(() => ({
  '--ntk-cms-font-family': settings.value.theme.fontFamily || defaultTheme.fontFamily || '',
  '--ntk-cms-font-display': settings.value.theme.fontFamilyDisplay || settings.value.theme.fontFamily || defaultTheme.fontFamilyDisplay || defaultTheme.fontFamily || '',
  '--ntk-cms-font-style-base': settings.value.theme.fontStyleBase || defaultTheme.fontStyleBase || 'normal',
  '--ntk-cms-font-weight-regular': settings.value.theme.fontWeightRegular || defaultTheme.fontWeightRegular || '400',
  '--ntk-cms-font-weight-medium': settings.value.theme.fontWeightMedium || defaultTheme.fontWeightMedium || settings.value.theme.fontWeightRegular || defaultTheme.fontWeightRegular || '500',
  '--ntk-cms-font-weight-semibold': settings.value.theme.fontWeightSemibold || defaultTheme.fontWeightSemibold || settings.value.theme.fontWeightMedium || defaultTheme.fontWeightMedium || '600',
  '--ntk-cms-font-weight-bold': settings.value.theme.fontWeightBold || defaultTheme.fontWeightBold || settings.value.theme.fontWeightSemibold || defaultTheme.fontWeightSemibold || '700',
  '--ntk-cms-font-size-base': settings.value.theme.fontSizeBase || defaultTheme.fontSizeBase || '0.925rem',
  '--ntk-cms-font-size-title': settings.value.theme.fontSizeTitle || defaultTheme.fontSizeTitle || settings.value.theme.fontSizeBase || defaultTheme.fontSizeBase || '0.925rem',
  '--ntk-cms-font-size-title-app': settings.value.theme.fontSizeTitleApp || defaultTheme.fontSizeTitleApp || settings.value.theme.fontSizeTitle || defaultTheme.fontSizeTitle || '1.05rem',
  '--ntk-cms-font-size-brand-title': settings.value.theme.fontSizeBrandTitle || defaultTheme.fontSizeBrandTitle || settings.value.theme.fontSizeBase || defaultTheme.fontSizeBase || '0.9rem',
  '--ntk-cms-font-size-brand-subtitle': settings.value.theme.fontSizeBrandSubtitle || defaultTheme.fontSizeBrandSubtitle || '0.72rem',
  '--ntk-cms-font-size-item-label': settings.value.theme.fontSizeItemLabel || defaultTheme.fontSizeItemLabel || '13px',
  '--ntk-cms-font-size-item-caption': settings.value.theme.fontSizeItemCaption || defaultTheme.fontSizeItemCaption || '11px',
  '--ntk-cms-font-size-group-caption': settings.value.theme.fontSizeGroupCaption || defaultTheme.fontSizeGroupCaption || '0.68rem',
  '--ntk-cms-font-size-group-caption-mini': settings.value.theme.fontSizeGroupCaptionMini || defaultTheme.fontSizeGroupCaptionMini || '0.62rem',
  '--ntk-cms-letter-spacing-group-caption': settings.value.theme.letterSpacingGroupCaption || defaultTheme.letterSpacingGroupCaption || '0.08em',
  '--ntk-cms-letter-spacing-group-caption-mini': settings.value.theme.letterSpacingGroupCaptionMini || defaultTheme.letterSpacingGroupCaptionMini || '0.06em',
  '--ntk-cms-line-height-item-label': settings.value.theme.lineHeightItemLabel || defaultTheme.lineHeightItemLabel || '1.25',
  '--ntk-cms-line-height-item-caption': settings.value.theme.lineHeightItemCaption || defaultTheme.lineHeightItemCaption || '1.2',
  '--ntk-cms-radius-sm': settings.value.theme.radiusSm || defaultTheme.radiusSm || '6px',
  '--ntk-cms-radius-md': settings.value.theme.radiusMd || defaultTheme.radiusMd || '8px',
  '--ntk-cms-radius-lg': settings.value.theme.radiusLg || defaultTheme.radiusLg || '10px',
  '--ntk-cms-radius-item': settings.value.theme.radiusItem || defaultTheme.radiusItem || '0 28px 28px 0',
  '--ntk-cms-space-xs': settings.value.theme.spacingXs || defaultTheme.spacingXs || '0.25rem',
  '--ntk-cms-space-sm': settings.value.theme.spacingSm || defaultTheme.spacingSm || '0.5rem',
  '--ntk-cms-space-md': settings.value.theme.spacingMd || defaultTheme.spacingMd || '0.75rem',
  '--ntk-cms-space-lg': settings.value.theme.spacingLg || defaultTheme.spacingLg || '1rem',
  '--ntk-cms-text-primary': settings.value.theme.pageTextColor || defaultTheme.pageTextColor || '',
  '--ntk-cms-text-secondary': settings.value.theme.drawerTextColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-border-color': settings.value.theme.dividerColor || defaultTheme.dividerColor || '',
  '--ntk-cms-bg-card': settings.value.theme.drawerBackground || defaultTheme.drawerBackground || '',
  '--ntk-cms-tab-active': settings.value.theme.itemActiveColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-accent': settings.value.theme.itemActiveColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-accent-soft': settings.value.theme.itemHoverBackground || defaultTheme.itemHoverBackground || '',
  '--ntk-cms-accent-text': settings.value.theme.itemHoverColor || settings.value.theme.itemActiveColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-active-bg': settings.value.theme.itemActiveBackground || defaultTheme.itemActiveBackground || '',
  '--ntk-cms-header-bg': settings.value.theme.headerBackground || defaultTheme.headerBackground || '',
  '--ntk-cms-header-text': settings.value.theme.headerTextColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-header-shadow': settings.value.theme.headerShadow || defaultTheme.headerShadow || '',
  '--ntk-cms-drawer-shadow': settings.value.theme.drawerShadow || defaultTheme.drawerShadow || '',
  '--ntk-cms-drawer-footer-bg': settings.value.theme.drawerFooterBackground || settings.value.theme.drawerBackground || defaultTheme.drawerFooterBackground || defaultTheme.drawerBackground || '',
  '--ntk-cms-drawer-footer-shadow': settings.value.theme.drawerFooterShadow || defaultTheme.drawerFooterShadow || '',
  '--ntk-cms-search-bg': settings.value.theme.searchBackground || defaultTheme.searchBackground || '',
  '--ntk-cms-search-text': settings.value.theme.searchTextColor || defaultTheme.searchTextColor || '',
  '--ntk-cms-search-icon': settings.value.theme.searchIconColor || settings.value.theme.headerTextColor || defaultTheme.searchIconColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-search-border': settings.value.theme.searchBorder || defaultTheme.searchBorder || '',
  '--ntk-cms-search-border-hover': settings.value.theme.searchBorderHover || defaultTheme.searchBorderHover || '',
  '--ntk-cms-transition': settings.value.theme.transitionFast || defaultTheme.transitionFast || '',
  '--ntk-cms-focus-color': settings.value.theme.focusColor || settings.value.theme.itemActiveColor || defaultTheme.focusColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-action-bg': settings.value.theme.actionBackground || defaultTheme.actionBackground || 'transparent',
  '--ntk-cms-action-hover': settings.value.theme.actionHoverBackground || defaultTheme.actionHoverBackground || '',
  '--ntk-cms-shell-bg': settings.value.theme.shellBackground || defaultTheme.shellBackground || '',
  '--ntk-cms-title-app': settings.value.theme.titleAppColor || settings.value.theme.itemActiveColor || defaultTheme.titleAppColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-title-text': settings.value.theme.titleTextColor || settings.value.theme.headerTextColor || defaultTheme.titleTextColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-title-separator': settings.value.theme.titleSeparatorColor || settings.value.theme.dividerColor || defaultTheme.titleSeparatorColor || defaultTheme.dividerColor || '',
  '--ntk-cms-toolbar-icon': settings.value.theme.toolbarButtonColor || settings.value.theme.headerTextColor || defaultTheme.toolbarButtonColor || defaultTheme.headerTextColor || '',
  '--ntk-cms-brand-title': settings.value.theme.brandTitleColor || settings.value.theme.itemActiveColor || defaultTheme.brandTitleColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-brand-subtitle': settings.value.theme.brandSubtitleColor || settings.value.theme.drawerTextColor || defaultTheme.brandSubtitleColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-group-caption': settings.value.theme.groupCaptionColor || settings.value.theme.drawerTextColor || defaultTheme.groupCaptionColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-group-caption-mini-bg': settings.value.theme.groupCaptionMiniBackground || settings.value.theme.itemHoverBackground || defaultTheme.groupCaptionMiniBackground || defaultTheme.itemHoverBackground || '',
  '--ntk-cms-item-text': settings.value.theme.itemTextColor || settings.value.theme.drawerTextColor || defaultTheme.itemTextColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-item-icon': settings.value.theme.itemIconColor || settings.value.theme.drawerTextColor || defaultTheme.itemIconColor || defaultTheme.drawerTextColor || '',
  '--ntk-cms-item-hover-color': settings.value.theme.itemHoverColor || settings.value.theme.itemActiveColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-item-icon-hover': settings.value.theme.itemIconHoverColor || settings.value.theme.itemHoverColor || settings.value.theme.itemActiveColor || defaultTheme.itemIconHoverColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
  '--ntk-cms-preview-search-width': settings.value.theme.searchWidth || defaultTheme.searchWidth || '220px',
  '--ntk-cms-preview-search-height': settings.value.theme.searchControlHeight || defaultTheme.searchControlHeight || '36px',
  '--ntk-cms-preview-action-min-width': settings.value.theme.menuSlotWidth || defaultTheme.menuSlotWidth || '30px',
  '--ntk-cms-preview-action-min-height': settings.value.theme.searchControlHeight || defaultTheme.searchControlHeight || '28px',
  '--ntk-cms-preview-brand-logo-size': settings.value.theme.brandLogoSize || defaultTheme.brandLogoSize || '40px',
  '--ntk-cms-layout-side-min-width': 'calc(var(--ntk-cms-preview-search-width) + (var(--ntk-cms-space-lg) * 5))',
  '--ntk-cms-layout-config-example-min-width': 'calc(var(--ntk-cms-preview-search-width) + (var(--ntk-cms-space-lg) * 3.5))',
  '--ntk-cms-editor-max-height': 'calc(100vh - (var(--ntk-shell-header-height) + (var(--ntk-cms-space-lg) * 13)))',
  '--ntk-cms-preview-icon-size-lg': settings.value.theme.itemIconSize || defaultTheme.itemIconSize || '22px',
  '--ntk-cms-preview-icon-size-md': 'calc(var(--ntk-cms-preview-icon-size-lg) - var(--ntk-cms-space-xs))',
  '--ntk-cms-preview-icon-size-sm': 'calc(var(--ntk-cms-preview-icon-size-md) - var(--ntk-cms-space-xs))',
  '--ntk-cms-preview-icon-size-xs': 'calc(var(--ntk-cms-preview-icon-size-sm) - (var(--ntk-cms-space-xs) / 2))',
  '--ntk-cms-preview-avatar-icon-size': 'var(--ntk-cms-preview-action-min-height)',
  '--ntk-cms-preview-mini-caption-min-width': settings.value.theme.groupCaptionMiniMinWidth || defaultTheme.groupCaptionMiniMinWidth || '34px',
  '--ntk-cms-preview-mini-caption-height': settings.value.theme.groupCaptionMiniHeight || defaultTheme.groupCaptionMiniHeight || '18px',
  '--ntk-cms-preview-badge-min-size': settings.value.theme.groupCaptionMiniHeight || defaultTheme.groupCaptionMiniHeight || '16px',
  '--ntk-cms-preview-badge-font-size': settings.value.theme.fontSizeGroupCaptionMini || defaultTheme.fontSizeGroupCaptionMini || '0.62rem',
  '--ntk-cms-preview-badge-letter-spacing': settings.value.theme.letterSpacingGroupCaptionMini || defaultTheme.letterSpacingGroupCaptionMini || '0.06em',
  '--ntk-cms-notification-success': notificationSuccessColor.value,
  '--ntk-cms-notification-warning': notificationWarningColor.value,
  '--ntk-cms-notification-error': notificationErrorColor.value,
  '--ntk-cms-notification-info': notificationInfoColor.value,
  '--ntk-cms-notification-badge-bg': notificationBadgeColor.value,
  '--ntk-cms-notification-badge-text': notificationBadgeTextColor.value,
  '--ntk-cms-notification-icon': notificationIconColor.value,
}))

const bannerStyle = computed(() => ({
  background: accentSoftBackground.value,
  color: accentTextColor.value,
  border: `1px solid ${accentColor.value}`,
}))

const statusChipStyle = computed(() => ({
  background: accentSoftBackground.value,
  color: accentTextColor.value,
  border: `1px solid ${accentColor.value}`,
}))

const primaryActionStyle = computed(() => ({
  background: accentColor.value,
  color: notificationBadgeTextColor.value,
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
      label: 'Action',
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
const isBlocksModule = computed(() => activeMenuId.value === blocksModuleId.value)
const isMediaModule = computed(() => activeMenuId.value === mediaModuleId.value)

const landingRegistry = createLandingRegistry()
const cmsBlockPalette = listCmsBuilderPalette(landingRegistry)
const cmsBlockPaletteByType = new Map(cmsBlockPalette.map(item => [item.type, item]))
const activeBlocksPageId = ref(settings.value.pages[0]?.id ?? '')
const activeBlocksSectionId = ref('')
const activeBlocksBlockId = ref('')
const selectedPaletteBlockType = ref(cmsBlockPalette[0]?.type ?? '')
const activeBlocksPropsDraft = ref('{}')
const activeBlocksFieldJsonDrafts = ref<Record<string, string>>({})

/**
 * Resolves default landing block type from section identifiers.
 */
function resolveDefaultLandingBlockType(sectionId: string): string {
  const normalized = sectionId.trim().toLowerCase()
  switch (normalized) {
    case 'header':
      return 'landing.header'
    case 'hero':
      return 'landing.hero'
    case 'stats':
    case 'metrics':
      return 'landing.stats'
    case 'features':
      return 'landing.features'
    case 'installation':
    case 'cta':
      return 'landing.cta'
    case 'footer':
      return 'landing.footer'
    default:
      return 'landing.hero'
  }
}

/**
 * Creates a default block scaffold for a page section.
 */
function createDefaultSectionBlock(sectionId: string, index = 1, enabled = true): CmsPageBlockSettings {
  return {
    id: `${sectionId}-block-${index}`,
    type: resolveDefaultLandingBlockType(sectionId),
    enabled,
    props: {},
  }
}

/**
 * Ensures page sections always contain at least one editable block.
 */
function ensurePageSectionBlocks(page: CmsPageSettings): CmsPageSettings {
  return {
    ...page,
    sections: page.sections.map(section => {
      const normalizedBlocks = Array.isArray(section.blocks) && section.blocks.length > 0
        ? section.blocks.map((block, index) => ({
          id: String(block.id ?? '').trim() || `${section.id}-block-${index + 1}`,
          type: String(block.type ?? '').trim() || resolveDefaultLandingBlockType(section.id),
          enabled: typeof block.enabled === 'boolean' ? block.enabled : section.enabled,
          props: block.props && typeof block.props === 'object' ? { ...block.props } : {},
        }))
        : [createDefaultSectionBlock(section.id, 1, section.enabled)]

      return {
        ...section,
        blocks: normalizedBlocks,
      }
    }),
  }
}

/**
 * Converts editable page settings into schema format consumed by CMS builder helpers.
 */
function toCmsPageSchema(page: CmsPageSettings): CmsPageSchema {
  const normalizedPage = ensurePageSectionBlocks(page)
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
      },
      blocks: section.blocks.map(block => ({
        id: block.id,
        type: block.type,
        props: { ...block.props },
      })),
    })),
  }
}

/**
 * Converts builder schema output back to persisted white-label page settings.
 */
function fromCmsPageSchema(schema: CmsPageSchema, originalPage: CmsPageSettings): CmsPageSettings {
  const previousSectionsById = new Map(originalPage.sections.map(section => [section.id, section]))

  return {
    ...originalPage,
    id: String(schema.id ?? '').trim() || originalPage.id,
    path: String(schema.slug ?? '').trim() || originalPage.path,
    title: String(schema.title ?? '').trim() || originalPage.title,
    status: schema.status === 'published' ? 'published' : 'draft',
    sections: schema.sections.map((section, sectionIndex) => {
      const previousSection = previousSectionsById.get(section.id)
      const previousBlocksById = new Map((previousSection?.blocks ?? []).map(block => [block.id, block]))
      const normalizedSectionId = String(section.id ?? '').trim() || `${originalPage.id}-section-${sectionIndex + 1}`
      const settingsLabel = section.settings && typeof section.settings.label === 'string'
        ? section.settings.label.trim()
        : ''
      const settingsEnabled = section.settings && typeof section.settings.enabled === 'boolean'
        ? section.settings.enabled
        : undefined

      const normalizedBlocks = section.blocks.length > 0
        ? section.blocks.map((block, blockIndex) => {
          const previousBlock = previousBlocksById.get(block.id)
          return {
            id: String(block.id ?? '').trim() || `${normalizedSectionId}-block-${blockIndex + 1}`,
            type: String(block.type ?? '').trim() || resolveDefaultLandingBlockType(normalizedSectionId),
            enabled: previousBlock?.enabled ?? previousSection?.enabled ?? true,
            props: block.props && typeof block.props === 'object'
              ? { ...block.props }
              : {},
          }
        })
        : [createDefaultSectionBlock(normalizedSectionId, 1, previousSection?.enabled ?? true)]

      return {
        id: normalizedSectionId,
        label: settingsLabel || previousSection?.label || `Section ${sectionIndex + 1}`,
        enabled: typeof settingsEnabled === 'boolean'
          ? settingsEnabled
          : previousSection?.enabled ?? true,
        blocks: normalizedBlocks,
      }
    }),
  }
}

const blocksPageOptions = computed(() => {
  return settings.value.pages.map(page => ({
    label: `${page.title} (${page.path})`,
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

const activeBlocksSections = computed<CmsBlocksSectionRow[]>(() => {
  const page = activeBlocksPage.value
  if (!page) {
    return []
  }

  return page.sections.map((section, sectionIndex) => ({
    id: section.id,
    label: section.label,
    enabled: section.enabled,
    sectionIndex,
    blocks: section.blocks.map((block, blockIndex) => ({
      id: block.id,
      type: block.type,
      enabled: block.enabled,
      sectionId: section.id,
      sectionLabel: section.label,
      pageId: page.id,
      pageTitle: page.title,
      pagePath: page.path,
      pageStatus: page.status,
      pageIndex: activeBlocksPageIndex.value,
      sectionIndex,
      blockIndex,
    })),
  }))
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
  }))
})

const cmsBlockPaletteOptions = computed(() => {
  return cmsBlockPalette.map(item => ({
    label: `${item.displayName} (${item.category})`,
    value: item.type,
  }))
})

const activeBlocksSchema = computed<CmsPageSchema | null>(() => {
  const page = activeBlocksPage.value
  return page ? toCmsPageSchema(page) : null
})

const cmsSectionBlocks = computed<CmsSectionBlockRecord[]>(() => {
  return settings.value.pages.flatMap((page, pageIndex) => {
    const normalizedPage = ensurePageSectionBlocks(page)
    return normalizedPage.sections.flatMap((section, sectionIndex) => {
      return section.blocks.map((block, blockIndex) => ({
        id: block.id,
        type: block.type,
        enabled: block.enabled,
        sectionId: section.id,
        sectionLabel: section.label,
        pageId: normalizedPage.id,
        pageTitle: normalizedPage.title,
        pagePath: normalizedPage.path,
        pageStatus: normalizedPage.status,
        pageIndex,
        sectionIndex,
        blockIndex,
      }))
    })
  })
})

const cmsPublishedPagesCount = computed(() => {
  return settings.value.pages.filter(page => page.status === 'published').length
})

const cmsEnabledSectionsCount = computed(() => {
  return cmsSectionBlocks.value.filter(section => section.enabled).length
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

const activeBlocksFieldDefinitions = computed<CmsBlockFieldDefinition[]>(() => {
  const blockType = activeBlocksSelectedBlockRecord.value?.type ?? ''
  return getLandingBlockFieldDefinitions(blockType)
})

/**
 * Checks whether a value is a plain object record.
 */
function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
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
  activeBlocksPropsDraft.value = JSON.stringify(activeBlocksSelectedBlock.value?.props ?? {}, null, 2)
}

/**
 * Synchronizes JSON field drafts for advanced field definitions.
 */
function syncSelectedBlockFieldJsonDrafts(): void {
  const target = activeBlocksSelectedBlock.value
  const nextDrafts: Record<string, string> = {}

  for (const field of activeBlocksFieldDefinitions.value) {
    if (field.type !== 'json') {
      continue
    }

    const rawValue = target ? getNestedPropByPath(target.props, field.path) : undefined
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
  const rawValue = target ? getNestedPropByPath(target.props, field.path) : undefined

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
 * Updates selected block value for primitive/select/toggle fields.
 */
function updateActiveBlocksFieldValue(field: CmsBlockFieldDefinition, value: unknown): void {
  const target = activeBlocksSelectedBlock.value
  if (!target || field.type === 'json') {
    return
  }

  if (field.type === 'toggle') {
    setNestedPropByPath(target.props, field.path, Boolean(value))
    syncSelectedBlockPropsDraft()
    return
  }

  if (field.type === 'number') {
    const raw = String(value ?? '').trim()
    if (raw.length === 0) {
      setNestedPropByPath(target.props, field.path, undefined)
      syncSelectedBlockPropsDraft()
      return
    }
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) {
      setNestedPropByPath(target.props, field.path, parsed)
      syncSelectedBlockPropsDraft()
    }
    return
  }

  const normalized = String(value ?? '')
  setNestedPropByPath(target.props, field.path, normalized)
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
  if (!target || field.type !== 'json') {
    return
  }

  const draft = String(activeBlocksFieldJsonDrafts.value[field.path] ?? '').trim()
  if (!draft) {
    setNestedPropByPath(target.props, field.path, undefined)
    syncSelectedBlockPropsDraft()
    return
  }

  try {
    const parsed = JSON.parse(draft) as unknown
    setNestedPropByPath(target.props, field.path, parsed)
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
  } catch {
    savedAtLabel.value = `Invalid JSON for field: ${field.label}`
  }
}

const cmsMediaAssets = computed<CmsMediaAssetPreview[]>(() => {
  return [
    {
      id: 'brand-logo',
      label: 'Brand logo',
      description: 'Top-left product identity used by shell and previews.',
      url: settings.value.branding.brandLogo,
    },
    {
      id: 'favicon',
      label: 'Favicon',
      description: 'Browser tab icon and bookmark image.',
      url: settings.value.branding.faviconUrl || settings.value.branding.brandLogo,
    },
    {
      id: 'user-avatar',
      label: 'User avatar',
      description: 'Topbar account icon/avatar source.',
      url: settings.value.branding.userAvatar,
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
 * Persists builder schema output back into active page settings.
 */
function applyBuilderStateToActivePage(state: CmsBuilderState): void {
  const pageIndex = activeBlocksPageIndex.value
  if (pageIndex < 0) {
    return
  }

  const currentPage = settings.value.pages[pageIndex]
  if (!currentPage) {
    return
  }

  settings.value.pages[pageIndex] = fromCmsPageSchema(state.page, currentPage)
  activeBlocksSectionId.value = state.selection?.sectionId ?? ''
  activeBlocksBlockId.value = state.selection?.blockId ?? ''
}

/**
 * Sets the active section/block selection for blocks manager controls.
 */
function setActiveBlocksSelection(sectionId: string, blockId = ''): void {
  activeBlocksSectionId.value = sectionId
  activeBlocksBlockId.value = blockId
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

  const nextState = insertCmsBuilderBlock(state, landingRegistry, {
    sectionId,
    type,
  })
  applyBuilderStateToActivePage(nextState)
}

/**
 * Pretty-formats selected block props JSON editor value.
 */
function formatSelectedBlockPropsDraft(): void {
  if (!activeBlocksSelectedBlock.value) {
    return
  }

  try {
    const parsed = JSON.parse(activeBlocksPropsDraft.value) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      savedAtLabel.value = 'Block props must be a JSON object'
      return
    }
    activeBlocksPropsDraft.value = JSON.stringify(parsed, null, 2)
  } catch {
    savedAtLabel.value = 'Invalid JSON for selected block props'
  }
}

/**
 * Applies JSON props draft to the currently selected block.
 */
function applySelectedBlockPropsDraft(): void {
  const target = activeBlocksSelectedBlock.value
  if (!target) {
    return
  }

  try {
    const parsed = JSON.parse(activeBlocksPropsDraft.value) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      savedAtLabel.value = 'Block props must be a JSON object'
      return
    }

    target.props = parsed as Record<string, unknown>
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
    savedAtLabel.value = `Block props updated at ${new Date().toLocaleTimeString()}`
  } catch {
    savedAtLabel.value = 'Invalid JSON for selected block props'
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

const governanceActor: CmsWhiteLabelActor = {
  id: 'cms-admin',
  role: 'admin',
  name: 'CMS Admin',
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

watch(
  () => settings.value.pages.map(page => page.id),
  pageIds => {
    if (pageIds.length === 0) {
      activeBlocksPageId.value = ''
      return
    }

    if (!pageIds.includes(activeBlocksPageId.value)) {
      activeBlocksPageId.value = pageIds[0] ?? ''
    }
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
  () => `${activeBlocksPageId.value}|${activeBlocksSectionId.value}|${activeBlocksBlockId.value}`,
  () => {
    syncSelectedBlockPropsDraft()
    syncSelectedBlockFieldJsonDrafts()
  },
  { immediate: true }
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
    savedAtLabel.value = `Saved at ${new Date().toLocaleTimeString()}`
  },
  { deep: true, immediate: true }
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
  savedAtLabel.value = `${activeThemePresetLabel.value} preset applied`
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
  applySelectedThemePresetFromSettings()
  activeMenuId.value = settings.value.items[0]?.id ?? defaultMenuId
  searchQuery.value = ''
  savedAtLabel.value = `${profile.name} loaded`
}

/**
 * Creates tenant profile from prompt.
 */
function createTenantProfileFromPrompt(): void {
  if (typeof window === 'undefined') {
    return
  }

  const suggestedName = `Tenant ${tenantProfilesState.value.profiles.length + 1}`
  const inputName = window.prompt('Tenant profile name', suggestedName)
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
  savedAtLabel.value = `${profileName} created`
}

/**
 * Handles remove active tenant profile.
 */
function removeActiveTenantProfile(): void {
  if (tenantProfilesState.value.profiles.length <= 1 || typeof window === 'undefined') {
    return
  }

  const activeProfile = getActiveTenantProfileSnapshot()
  const confirmed = window.confirm(`Delete tenant profile "${activeProfile.name}"?`)
  if (!confirmed) {
    return
  }

  tenantProfilesState.value = removeCmsTenantProfile(tenantProfilesState.value, activeProfile.id)
  activeTenantProfileId.value = tenantProfilesState.value.activeProfileId
  saveCmsTenantProfilesState(tenantProfilesState.value)
  onTenantProfileChange(activeTenantProfileId.value)
  savedAtLabel.value = `${activeProfile.name} removed`
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
function normalizeIdSegment(value: string): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const fileName = `ntk-cms-tenant-${toJsonFileName(profile.id)}.json`
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  window.URL.revokeObjectURL(url)
  savedAtLabel.value = `${profile.name} exported`
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

async function onTenantImportFileChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) {
    return
  }

  try {
    const fileContent = await file.text()
    const parsed = JSON.parse(fileContent) as unknown
    const imported = parseCmsTenantImportPayload(parsed, file.name)
    if (!imported) {
      savedAtLabel.value = 'Import failed: invalid JSON payload'
      return
    }

    const normalizedSettings = normalizeCmsWhiteLabelSettings(imported.settings)
    const existingIds = tenantProfilesState.value.profiles.map(profile => profile.id)
    const requestedId = toJsonFileName(imported.id || imported.name)
    const hasRequestedId = existingIds.includes(requestedId)
    const shouldReplace = hasRequestedId
      && typeof window !== 'undefined'
      && window.confirm(`Replace existing tenant "${requestedId}"?`)
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
      summary: `${imported.name.trim() || profileId} imported`,
      metadata: {
        sourceVersion: String(imported.sourceVersion),
        profileId,
      },
    })
    savedAtLabel.value = `${imported.name.trim() || profileId} imported (v${imported.sourceVersion})`
  } catch {
    savedAtLabel.value = 'Import failed: invalid JSON payload'
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
 * Handles add cms page.
 */
function addCmsPage(): void {
  const index = settings.value.pages.length + 1
  const pageId = `page-${index}`
  settings.value.pages.push({
    id: pageId,
    title: `Page ${index}`,
    path: `/${pageId}`,
    status: 'draft',
    description: 'Describe purpose and expected audience.',
    sections: [
      {
        id: 'header',
        label: 'Header',
        enabled: true,
        blocks: [createDefaultSectionBlock('header', 1, true)],
      },
      {
        id: 'hero',
        label: 'Hero',
        enabled: true,
        blocks: [createDefaultSectionBlock('hero', 1, true)],
      },
      {
        id: 'footer',
        label: 'Footer',
        enabled: true,
        blocks: [createDefaultSectionBlock('footer', 1, true)],
      },
    ],
  })
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
  if (!page) {
    return
  }

  const sectionIndex = page.sections.length + 1
  const sectionId = `section-${sectionIndex}`
  page.sections.push({
    id: sectionId,
    label: `Section ${sectionIndex}`,
    enabled: true,
    blocks: [createDefaultSectionBlock(sectionId, 1, true)],
  })
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
      border: `1px solid ${accentColor.value}`,
    }
  }

  return {
    background: settings.value.theme.drawerBackground || defaultTheme.drawerBackground || '',
    color: settings.value.theme.drawerTextColor || defaultTheme.drawerTextColor || '',
    border: `1px solid ${settings.value.theme.dividerColor || defaultTheme.dividerColor || ''}`,
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
    label: 'Action',
    tooltip: 'Custom action',
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
  applyGovernanceAction('save_draft', {
    summary: 'Settings saved manually',
    metadata: {
      source: 'toolbar',
    },
  })
  saveCmsWhiteLabelSettings(settings.value)
  savedAtLabel.value = `Saved at ${new Date().toLocaleTimeString()}`
}

/**
 * Resets to defaults.
 */
function resetToDefaults(): void {
  const previousGovernance = settings.value.governance
  const nextGovernance = canApplyWhiteLabelWorkflowAction(previousGovernance, 'reset_defaults', governanceActor.role)
    ? applyWhiteLabelWorkflowAction(previousGovernance, 'reset_defaults', governanceActor, {
      summary: 'Defaults restored',
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
  savedAtLabel.value = 'Defaults restored'
}
</script>

<style scoped>
.cms-shell-page {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  font-family: var(--ntk-cms-font-family);
  font-style: var(--ntk-cms-font-style-base);
  min-width: 0;
}

.cms-shell-page__workspace {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  min-width: 0;
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

.cms-pages {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(var(--ntk-cms-layout-side-min-width), 1fr);
  gap: var(--ntk-cms-space-lg);
  align-items: start;
}

.cms-pages__editor {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
  max-height: var(--ntk-cms-editor-max-height);
  overflow: auto;
  padding-right: calc(var(--ntk-cms-space-xs) / 2);
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
  max-height: var(--ntk-cms-editor-max-height);
  overflow: auto;
  padding-right: calc(var(--ntk-cms-space-xs) / 2);
}

.cms-blocks-toolbar {
  align-items: end;
}

.cms-blocks-list {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-block-item {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
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
  color: var(--ntk-cms-text-secondary);
  font-size: var(--ntk-cms-font-size-item-label);
}

.cms-block-row {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
  flex-wrap: wrap;
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
  border: 1px solid var(--ntk-cms-border-color);
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

.cms-blocks-props {
  border: 1px solid var(--ntk-cms-border-color);
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

.cms-media__preview {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

.cms-media-preview-item {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-md);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ntk-cms-space-sm);
  align-items: center;
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
  border: 1px solid var(--ntk-cms-border-color);
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

.cms-media-preview-item__url {
  grid-column: 1 / -1;
  font-size: var(--ntk-cms-font-size-item-caption);
  color: var(--ntk-cms-text-secondary);
  word-break: break-all;
}

.cms-page-item {
  border: 1px solid var(--ntk-cms-border-color);
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

.cms-page-item__sections {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-item__sections-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-section-row {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-shell-bg);
  padding: var(--ntk-cms-space-sm);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto auto;
  gap: var(--ntk-cms-space-sm);
  align-items: center;
}

.cms-page-item__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--ntk-cms-space-sm);
}

.cms-page-preview {
  border: 1px solid var(--ntk-cms-border-color);
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

.cms-shell-card {
  border-radius: var(--ntk-cms-radius-lg);
  border-color: var(--ntk-cms-border-color);
  background: var(--ntk-cms-bg-card);
}

.cms-shell-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-cms-space-md);
  padding: var(--ntk-cms-space-lg);
}

.cms-shell-card__body {
  padding: var(--ntk-cms-space-lg);
}

.cms-settings {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
}

/* ── Admin Card (Tenant + Actions) ─────────────────── */
.cms-settings__admin {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

/* ── Editor Card (Tabs + Panels) ───────────────────── */
.cms-settings__editor {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  background: var(--ntk-cms-bg-card);
  padding: var(--ntk-cms-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-md);
}

/* ── Toolbar Cards (Tenant + Actions) ───────────────── */
.cms-toolbar-card {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-md);
  background: var(--ntk-cms-bg-card);
  overflow: hidden;
}

.cms-toolbar-card__header {
  display: flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  padding: var(--ntk-cms-space-sm) var(--ntk-cms-space-md);
  border-bottom: 1px solid var(--ntk-cms-border-color);
  background: color-mix(in srgb, var(--ntk-cms-border-color) 15%, transparent);
}

.cms-toolbar-card__icon {
  color: var(--ntk-cms-text-secondary);
}

.cms-toolbar-card__title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
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
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
  padding: 0 calc(var(--ntk-cms-space-xs) + (var(--ntk-cms-space-xs) / 4));
}

.cms-settings__panels {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: var(--ntk-cms-radius-lg);
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

.cms-color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-cms-space-md);
}

.cms-color-groups {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-cms-space-lg);
  margin-bottom: var(--ntk-cms-space-lg);
}

.cms-theme-presets {
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-search-border);
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
  border-top: 1px dashed var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-accent);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  margin-top: calc(var(--ntk-cms-space-xs) * 0.6);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid transparent;
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
  font-weight: 600;
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
  border-radius: 999px;
  font-size: var(--ntk-cms-font-size-group-caption-mini);
  font-weight: 700;
  letter-spacing: var(--ntk-cms-letter-spacing-group-caption-mini);
  background: var(--ntk-cms-group-caption-mini-bg);
  color: var(--ntk-cms-group-caption);
}

.cms-preview-card--header {
  background: var(--ntk-cms-header-bg);
  color: var(--ntk-cms-header-text);
  box-shadow: var(--ntk-cms-header-shadow);
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
  border: 1px solid var(--ntk-cms-search-border);
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
  border: 1px solid var(--ntk-cms-search-border);
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
}

.cms-preview-header__badge {
  position: absolute;
  top: calc(var(--ntk-cms-space-xs) * -1);
  right: calc(var(--ntk-cms-space-xs) * -1);
  min-width: var(--ntk-cms-preview-badge-min-size);
  height: var(--ntk-cms-preview-badge-min-size);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--ntk-cms-space-xs);
  font-size: var(--ntk-cms-preview-badge-font-size);
  font-weight: 700;
  letter-spacing: var(--ntk-cms-preview-badge-letter-spacing);
  background: var(--ntk-cms-notification-badge-bg);
  color: var(--ntk-cms-notification-badge-text);
}

.cms-preview-drawer {
  margin-top: var(--ntk-cms-space-sm);
  border: 1px solid var(--ntk-cms-border-color);
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
  border-top: 1px solid var(--ntk-cms-border-color);
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
  border: 1px solid var(--ntk-cms-border-color);
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
  width: var(--ntk-cms-preview-action-min-height);
  height: var(--ntk-cms-preview-action-min-height);
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
  border: 1px solid transparent;
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
  font-weight: 600;
}

.cms-preview-menu-item--active :deep(.q-icon) {
  color: var(--ntk-cms-accent);
}

.cms-preview-card--topbar {
  background: var(--ntk-cms-header-bg);
  color: var(--ntk-cms-header-text);
  box-shadow: var(--ntk-cms-header-shadow);
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
  border: 1px solid var(--ntk-cms-search-border);
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
  border: 1px solid var(--ntk-cms-search-border);
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
}

.cms-preview-topbar__action:hover {
  background: var(--ntk-cms-action-hover);
  color: var(--ntk-cms-item-hover-color);
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

@media (max-width: 1280px) {
  .cms-pages,
  .cms-page-item__grid,
  .cms-blocks-summary-grid,
  .cms-blocks-fields {
    grid-template-columns: 1fr;
  }

  .cms-page-section-row {
    grid-template-columns: 1fr;
  }

  .cms-list-item--menu {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cms-list-item--toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .cms-shell-page__grid,
  .cms-config-section,
  .cms-form-grid,
  .cms-color-grid,
  .cms-toggle-row,
  .cms-theme-presets__controls,
  .cms-media-preview-item {
    grid-template-columns: 1fr;
  }

  .cms-shell-page__workspace {
    padding: var(--ntk-cms-space-md);
  }

  .cms-toolbar-card__body {
    flex-direction: column;
    align-items: stretch;
  }

  .cms-toolbar-card__separator {
    display: none;
  }

  .cms-toolbar-card__saved-at {
    width: 100%;
    margin-left: 0;
    text-align: center;
  }

  .cms-preview-brand__meta {
    grid-template-columns: 1fr;
  }

  .cms-preview-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cms-preview-header__search {
    min-width: 0;
    width: 100%;
  }

  .cms-preview-header__actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-start;
  }

  .cms-preview-topbar {
    flex-wrap: wrap;
  }

  .cms-preview-topbar__search {
    order: 3;
    width: 100%;
  }

  .cms-preview-topbar__actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-start;
  }

  .cms-list-item,
  .cms-list-item--menu,
  .cms-list-item--toolbar {
    grid-template-columns: 1fr;
  }
}
</style>