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
        <div class="cms-shell-page__hero">
          <h1>{{ activeItem.label }}</h1>
          <p>{{ activeItem.description || settings.content.moduleFallbackDescription }}</p>
        </div>

        <div v-if="isSettingsModule" class="cms-settings">
          <div class="cms-settings__toolbar">
            <q-btn no-caps unelevated icon="save" label="Save settings" :style="primaryActionStyle" @click="saveNow" />
            <q-btn flat no-caps icon="restart_alt" label="Reset defaults" :style="dangerActionStyle" @click="resetToDefaults" />
            <span class="cms-settings__saved-at">{{ savedAtLabel }}</span>
          </div>

          <q-tabs v-model="activeSettingsTab" dense inline-label class="cms-settings__tabs">
            <q-tab name="branding" icon="branding_watermark" :label="settings.content.tabBrandingLabel" />
            <q-tab name="colors" icon="palette" :label="settings.content.tabColorsLabel" />
            <q-tab name="menu" icon="menu" :label="settings.content.tabMenuLabel" />
            <q-tab name="topbar" icon="toolbar" :label="settings.content.tabTopbarLabel" />
            <q-tab name="content" icon="edit_note" :label="settings.content.tabContentLabel" />
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
                            <q-icon v-else name="account_circle" size="22px" />
                            <small>{{ settings.branding.userTooltip }}</small>
                          </div>
                        </div>
                        <q-chip dense square icon="notifications" :style="statusChipStyle">
                          {{ settings.branding.notificationCount }}
                        </q-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="colors">
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
                          <small>Sidebar states: default, hover and active item.</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--navigation">
                          <div class="cms-preview-nav-item">Overview</div>
                          <div class="cms-preview-nav-item cms-preview-nav-item--hover">Analytics</div>
                          <div class="cms-preview-nav-item cms-preview-nav-item--active">Settings</div>
                        </div>
                      </template>

                      <template v-else-if="group.id === 'header'">
                        <div class="cms-example-section__header">
                          <strong>Header and search example</strong>
                          <small>Topbar colors, search background and border fields.</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--header">
                          <div class="cms-preview-header">
                            <div class="cms-preview-header__left">
                              <q-icon :name="settings.layout.menuIcon" size="18px" />
                              <strong>{{ settings.branding.appName }}</strong>
                            </div>
                            <div class="cms-preview-header__search">
                              <q-icon name="search" size="16px" />
                              <span>{{ settings.layout.searchPlaceholder }}</span>
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
                      </template>

                      <template v-else>
                        <div class="cms-example-section__header">
                          <strong>Advanced tokens example</strong>
                          <small>Typography and transition values from advanced fields.</small>
                        </div>
                        <div class="cms-preview-card cms-preview-card--advanced">
                          <strong>Theme internals preview</strong>
                          <p>Font family and transition are reflected immediately in this block.</p>
                          <code>transition: {{ settings.theme.transitionFast }}</code>
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
                            <q-icon :name="item.icon || 'radio_button_unchecked'" size="16px" />
                            <span>{{ item.label }}</span>
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
                  </div>

                  <div class="cms-toggle-row">
                    <q-toggle v-model="settings.layout.showSearch" label="Show search" />
                    <q-toggle v-model="settings.layout.showGroupCaptions" label="Show group captions" />
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
                      <q-input v-model="action.badge" outlined dense label="Badge" />
                      <q-toggle v-model="action.showLabel" label="Show label" />
                      <q-toggle v-model="action.external" label="Open external" />
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
                          <q-icon :name="settings.layout.menuIcon" size="18px" />
                          <strong>{{ settings.branding.appName }}</strong>
                        </div>
                        <div v-if="settings.layout.showSearch" class="cms-preview-topbar__search">
                          <q-icon name="search" size="16px" />
                          <span>{{ settings.layout.searchPlaceholder }}</span>
                        </div>
                        <div class="cms-preview-topbar__actions">
                          <button
                            v-for="action in toolbarPreviewActions"
                            :key="action.id"
                            type="button"
                            class="cms-preview-topbar__action"
                          >
                            <q-icon :name="action.icon || 'bolt'" size="16px" />
                            <span v-if="action.showLabel">{{ action.label }}</span>
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
    </template>
  </NtkAppShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AppShellAction } from '../src/components/layout/app-shell.types'
import NtkAppShell from '../src/components/layout/NtkAppShell.vue'
import {
  createDefaultWhiteLabelSettings,
  createNewMenuItem,
  mapWhiteLabelToShellSnapshot,
} from './cms/white-label.config'
import {
  applyCmsFavicon,
  loadCmsWhiteLabelSettings,
  resetCmsWhiteLabelSettings,
  saveCmsWhiteLabelSettings,
} from './cms/white-label.storage'
import { applySemanticColors, semanticColors } from '../src/config/colors/semantic.config'

type ThemeFieldKey = keyof ReturnType<typeof createDefaultWhiteLabelSettings>['theme']
type ThemeFieldGroup = 'foundation' | 'navigation' | 'header' | 'notifications' | 'advanced'

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

const defaultSettings = createDefaultWhiteLabelSettings()
const defaultTheme = defaultSettings.theme
const defaultMenuId = defaultSettings.items[0]?.id ?? ''
const defaultSettingsModuleId = defaultSettings.items.find(item => item.icon === 'settings')?.id ?? ''

function themePlaceholder(key: ThemeFieldKey): string {
  const value = defaultTheme[key]
  return value ? String(value) : ''
}

const settings = ref(loadCmsWhiteLabelSettings())

const activeMenuId = ref(settings.value.items[0]?.id ?? defaultMenuId)
const searchQuery = ref('')
const activeSettingsTab = ref<'branding' | 'colors' | 'menu' | 'topbar' | 'content'>('branding')
const savedAtLabel = ref('Auto-save enabled')

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
    id: 'advanced',
    label: 'Advanced Theme Tokens',
    description: 'Fine-grained overrides for shell internals and typography.',
  },
]

const colorFields: ThemeField[] = [
  {
    key: 'fontFamily',
    group: 'foundation',
    label: 'Font family',
    placeholder: themePlaceholder('fontFamily'),
  },
  {
    key: 'transitionFast',
    group: 'foundation',
    label: 'Transition',
    placeholder: themePlaceholder('transitionFast'),
  },
  {
    key: 'shellBackground',
    group: 'foundation',
    label: 'Shell background',
    placeholder: themePlaceholder('shellBackground'),
  },
  {
    key: 'pageBackground',
    group: 'foundation',
    label: 'Page background',
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
    label: 'Surface background',
    isColor: true,
    placeholder: themePlaceholder('drawerBackground'),
    aliases: ['drawerFooterBackground', 'searchBackground'],
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
    key: 'itemHoverBackground',
    group: 'navigation',
    label: 'Hover background',
    placeholder: themePlaceholder('itemHoverBackground'),
    aliases: ['actionHoverBackground'],
  },
  {
    key: 'itemActiveBackground',
    group: 'navigation',
    label: 'Active background',
    placeholder: themePlaceholder('itemActiveBackground'),
  },
  {
    key: 'groupCaptionMiniBackground',
    group: 'navigation',
    label: 'Group mini background',
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
    key: 'searchBorder',
    group: 'header',
    label: 'Search border',
    placeholder: themePlaceholder('searchBorder'),
  },
  {
    key: 'searchBorderHover',
    group: 'header',
    label: 'Search border hover',
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
    key: 'toolbarButtonColor',
    group: 'advanced',
    label: 'Toolbar button color',
    isColor: true,
    placeholder: themePlaceholder('toolbarButtonColor'),
  },
  {
    key: 'titleAppColor',
    group: 'advanced',
    label: 'Title app color',
    isColor: true,
    placeholder: themePlaceholder('titleAppColor'),
  },
  {
    key: 'titleTextColor',
    group: 'advanced',
    label: 'Title text color',
    isColor: true,
    placeholder: themePlaceholder('titleTextColor'),
  },
  {
    key: 'titleSeparatorColor',
    group: 'advanced',
    label: 'Title separator color',
    isColor: true,
    placeholder: themePlaceholder('titleSeparatorColor'),
  },
  {
    key: 'drawerFooterBackground',
    group: 'advanced',
    label: 'Drawer footer background',
    isColor: true,
    placeholder: themePlaceholder('drawerFooterBackground'),
  },
  {
    key: 'searchBackground',
    group: 'advanced',
    label: 'Search background',
    isColor: true,
    placeholder: themePlaceholder('searchBackground'),
  },
  {
    key: 'searchTextColor',
    group: 'advanced',
    label: 'Search text color',
    isColor: true,
    placeholder: themePlaceholder('searchTextColor'),
  },
  {
    key: 'searchIconColor',
    group: 'advanced',
    label: 'Search icon color',
    isColor: true,
    placeholder: themePlaceholder('searchIconColor'),
  },
  {
    key: 'focusColor',
    group: 'advanced',
    label: 'Focus color',
    isColor: true,
    placeholder: themePlaceholder('focusColor'),
  },
  {
    key: 'actionHoverBackground',
    group: 'advanced',
    label: 'Action hover background',
    placeholder: themePlaceholder('actionHoverBackground'),
  },
  {
    key: 'brandTitleColor',
    group: 'advanced',
    label: 'Brand title color',
    isColor: true,
    placeholder: themePlaceholder('brandTitleColor'),
  },
  {
    key: 'brandSubtitleColor',
    group: 'advanced',
    label: 'Brand subtitle color',
    isColor: true,
    placeholder: themePlaceholder('brandSubtitleColor'),
  },
  {
    key: 'groupCaptionColor',
    group: 'advanced',
    label: 'Group caption color',
    isColor: true,
    placeholder: themePlaceholder('groupCaptionColor'),
  },
  {
    key: 'itemTextColor',
    group: 'advanced',
    label: 'Item text color',
    isColor: true,
    placeholder: themePlaceholder('itemTextColor'),
  },
  {
    key: 'itemHoverColor',
    group: 'advanced',
    label: 'Item hover color',
    isColor: true,
    placeholder: themePlaceholder('itemHoverColor'),
  },
  {
    key: 'itemIconColor',
    group: 'advanced',
    label: 'Item icon color',
    isColor: true,
    placeholder: themePlaceholder('itemIconColor'),
  },
  {
    key: 'itemIconHoverColor',
    group: 'advanced',
    label: 'Item icon hover color',
    isColor: true,
    placeholder: themePlaceholder('itemIconHoverColor'),
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
    key: 'notificationBadgeTextColor',
    group: 'notifications',
    label: 'Default badge text color',
    isColor: true,
    placeholder: themePlaceholder('notificationBadgeTextColor'),
  },
]

const colorFieldGroups = computed(() => {
  return colorFieldGroupsDefinition.map(group => ({
    ...group,
    fields: colorFields.filter(field => field.group === group.id),
  }))
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

const notificationSuccessTextColor = computed(() => {
  return (
    settings.value.theme.notificationSuccessTextColor ||
    settings.value.theme.notificationBadgeTextColor ||
    defaultTheme.notificationSuccessTextColor ||
    defaultTheme.notificationBadgeTextColor ||
    'var(--ntk-text-inverse)'
  )
})

const notificationWarningTextColor = computed(() => {
  return (
    settings.value.theme.notificationWarningTextColor ||
    settings.value.theme.notificationBadgeTextColor ||
    defaultTheme.notificationWarningTextColor ||
    defaultTheme.notificationBadgeTextColor ||
    'var(--ntk-text-primary)'
  )
})

const notificationErrorTextColor = computed(() => {
  return (
    settings.value.theme.notificationErrorTextColor ||
    settings.value.theme.notificationBadgeTextColor ||
    defaultTheme.notificationErrorTextColor ||
    defaultTheme.notificationBadgeTextColor ||
    'var(--ntk-text-inverse)'
  )
})

const notificationInfoTextColor = computed(() => {
  return (
    settings.value.theme.notificationInfoTextColor ||
    settings.value.theme.notificationBadgeTextColor ||
    defaultTheme.notificationInfoTextColor ||
    defaultTheme.notificationBadgeTextColor ||
    'var(--ntk-text-inverse)'
  )
})

const cmsStyleVars = computed<Record<string, string>>(() => ({
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
  '--ntk-cms-search-bg': settings.value.theme.searchBackground || defaultTheme.searchBackground || '',
  '--ntk-cms-search-text': settings.value.theme.searchTextColor || defaultTheme.searchTextColor || '',
  '--ntk-cms-search-border': settings.value.theme.searchBorder || defaultTheme.searchBorder || '',
  '--ntk-cms-font-family': settings.value.theme.fontFamily || defaultTheme.fontFamily || '',
  '--ntk-cms-transition': settings.value.theme.transitionFast || defaultTheme.transitionFast || '',
  '--ntk-cms-shell-bg': settings.value.theme.shellBackground || defaultTheme.shellBackground || '',
  '--ntk-cms-page-bg': settings.value.theme.pageBackground || defaultTheme.pageBackground || '',
  '--ntk-cms-mini-group-bg': settings.value.theme.groupCaptionMiniBackground || defaultTheme.groupCaptionMiniBackground || '',
  '--ntk-cms-notification-success': notificationSuccessColor.value,
  '--ntk-cms-notification-warning': notificationWarningColor.value,
  '--ntk-cms-notification-error': notificationErrorColor.value,
  '--ntk-cms-notification-info': notificationInfoColor.value,
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
  color: settings.value.theme.notificationBadgeTextColor || defaultTheme.notificationBadgeTextColor || '',
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
  const actions = settings.value.toolbarActions.slice(0, 4)
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

function getThemeFieldValue(field: ThemeField): string {
  return String(settings.value.theme[field.key] ?? '')
}

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

function rgbStringToHex(value: string): string | null {
  const match = value
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:[\s,\/]+[\d.]+)?\s*\)$/i)

  if (!match) {
    return null
  }

  const clamp = (channel: string): number => Math.max(0, Math.min(255, Number.parseInt(channel, 10)))
  const channels = [clamp(match[1]), clamp(match[2]), clamp(match[3])]
  return `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`
}

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

function onThemeFieldInput(field: ThemeField, value: string | number | null): void {
  const normalized = String(value ?? '')
  settings.value.theme[field.key] = normalized

  for (const alias of field.aliases ?? []) {
    settings.value.theme[alias] = normalized
  }
}

function onThemeColorInput(field: ThemeField, event: Event): void {
  const target = event.target as HTMLInputElement | null
  onThemeFieldInput(field, target?.value ?? '')
}

function addGroup(): void {
  const id = `group-${Math.random().toString(36).slice(2, 7)}`
  settings.value.navGroups.push({
    id,
    label: 'New Group',
  })
}

function normalizeGroupId(index: number): void {
  const current = settings.value.navGroups[index]
  if (!current) {
    return
  }

  const nextId = current.id
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

  if (!nextId) {
    current.id = `group-${index + 1}`
    return
  }

  current.id = nextId
}

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

function addMenuItem(): void {
  const groupId = settings.value.navGroups[0]?.id ?? 'core'
  settings.value.items.push(createNewMenuItem(groupId))
}

function removeMenuItem(index: number): void {
  if (settings.value.items.length <= 1) {
    return
  }
  settings.value.items.splice(index, 1)
}

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

function removeToolbarAction(index: number): void {
  settings.value.toolbarActions.splice(index, 1)
}

function onToolbarAction(action: AppShellAction): void {
  if (!action.id) {
    return
  }

  if (action.id === 'notifications' || action.id === 'account') {
    return
  }
}

function saveNow(): void {
  saveCmsWhiteLabelSettings(settings.value)
  savedAtLabel.value = `Saved at ${new Date().toLocaleTimeString()}`
}

function resetToDefaults(): void {
  settings.value = resetCmsWhiteLabelSettings()
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
  gap: 1rem;
}

.cms-shell-page__hero h1 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--ntk-cms-text-primary);
}

.cms-shell-page__hero p {
  margin: 0.35rem 0 0;
  color: var(--ntk-cms-text-secondary);
}

.cms-shell-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.cms-shell-card {
  border-radius: 14px;
  border-color: var(--ntk-cms-border-color);
  background: var(--ntk-cms-bg-card);
}

.cms-shell-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
}

.cms-shell-card__body {
  padding: 0.9rem 1rem 1rem;
}

.cms-settings {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: 14px;
  background: var(--ntk-cms-bg-card);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cms-settings__toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cms-settings__saved-at {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--ntk-cms-text-secondary);
}

.cms-settings__tabs {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: 10px;
  padding: 0 0.3rem;
}

.cms-settings__panels {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: 10px;
}

.cms-config-section {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.95fr);
  gap: 1rem;
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
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.cms-color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.cms-color-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.cms-color-group {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: 10px;
  padding: 0.75rem;
}

.cms-color-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.cms-color-field label {
  font-size: 0.8rem;
  color: var(--ntk-cms-text-secondary);
}

.cms-color-field__controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cms-color-field__picker {
  width: 44px;
  height: 36px;
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: 8px;
  background: transparent;
  padding: 2px;
}

.cms-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.cms-section-header--stacked {
  align-items: flex-start;
  flex-direction: column;
  gap: 0.15rem;
}

.cms-section-header--stacked small {
  color: var(--ntk-cms-text-secondary);
  font-size: 0.76rem;
}

.cms-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cms-list-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: 10px;
}

.cms-list-item--menu {
  grid-template-columns: repeat(6, minmax(0, 1fr)) auto;
}

.cms-list-item--toolbar {
  grid-template-columns: repeat(7, minmax(0, 1fr)) auto auto auto;
}

.cms-toggle-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem 1rem;
}

.cms-banner {
  border-radius: 10px;
}

.cms-notification-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.75rem;
}

.cms-example-section {
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px dashed var(--ntk-cms-border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cms-example-section--inline {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.cms-example-section__header {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.cms-example-section__header strong {
  color: var(--ntk-cms-text-primary);
}

.cms-example-section__header small {
  color: var(--ntk-cms-text-secondary);
  font-size: 0.76rem;
}

.cms-preview-card {
  border: 1px solid var(--ntk-cms-border-color);
  border-radius: 10px;
  padding: 0.75rem;
  background: var(--ntk-cms-bg-card);
  color: var(--ntk-cms-text-primary);
}

.cms-preview-card p {
  margin: 0.35rem 0;
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-chip {
  margin-top: 0.35rem;
  background: var(--ntk-cms-accent-soft);
  color: var(--ntk-cms-accent-text);
  border: 1px solid var(--ntk-cms-accent);
}

.cms-preview-card--foundation {
  border-color: var(--ntk-cms-border-color);
  background: var(--ntk-cms-bg-card);
  color: var(--ntk-cms-text-primary);
}

.cms-preview-card--navigation {
  background: var(--ntk-cms-shell-bg);
}

.cms-preview-nav-item {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.5rem 0.6rem;
  color: var(--ntk-cms-text-secondary);
  background: transparent;
  transition: all var(--ntk-cms-transition);
}

.cms-preview-nav-item + .cms-preview-nav-item {
  margin-top: 0.35rem;
}

.cms-preview-nav-item--hover {
  background: var(--ntk-cms-accent-soft);
  color: var(--ntk-cms-accent-text);
}

.cms-preview-nav-item--active {
  background: var(--ntk-cms-active-bg);
  color: var(--ntk-cms-accent);
  border-color: var(--ntk-cms-accent-soft);
  font-weight: 600;
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
  gap: 0.75rem;
}

.cms-preview-header__left {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cms-preview-header__search {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 220px;
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  border: 1px solid var(--ntk-cms-search-border);
  background: var(--ntk-cms-search-bg);
  color: var(--ntk-cms-search-text);
  font-size: 0.78rem;
}

.cms-preview-card--advanced {
  font-family: var(--ntk-cms-font-family);
  transition: all var(--ntk-cms-transition);
  background: var(--ntk-cms-page-bg);
}

.cms-preview-card--advanced code {
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.78rem;
}

.cms-preview-card--branding {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cms-preview-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.cms-preview-brand__logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--ntk-cms-border-color);
}

.cms-preview-brand__copy {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.cms-preview-brand__copy small {
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-brand__meta {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.cms-preview-brand__meta-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cms-preview-brand__meta-row span {
  font-size: 0.72rem;
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-brand__meta-row code {
  font-size: 0.74rem;
  word-break: break-all;
}

.cms-preview-user {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.cms-preview-user img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.cms-preview-user small {
  color: var(--ntk-cms-text-secondary);
}

.cms-preview-card--menu {
  display: grid;
  gap: 0.6rem;
}

.cms-preview-menu-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.cms-preview-menu-group > small {
  color: var(--ntk-cms-text-secondary);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cms-preview-menu-items {
  display: grid;
  gap: 0.25rem;
}

.cms-preview-menu-item {
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--ntk-cms-text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.55rem;
  font-size: 0.82rem;
  text-align: left;
  transition: all var(--ntk-cms-transition);
}

.cms-preview-menu-item--active {
  background: var(--ntk-cms-active-bg);
  color: var(--ntk-cms-accent);
  border-color: var(--ntk-cms-accent-soft);
  font-weight: 600;
}

.cms-preview-card--topbar {
  background: var(--ntk-cms-header-bg);
  color: var(--ntk-cms-header-text);
  box-shadow: var(--ntk-cms-header-shadow);
}

.cms-preview-topbar {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cms-preview-topbar__left {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.cms-preview-topbar__search {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--ntk-cms-search-border);
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  background: var(--ntk-cms-search-bg);
  color: var(--ntk-cms-search-text);
  font-size: 0.78rem;
}

.cms-preview-topbar__actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.cms-preview-topbar__action {
  border: 1px solid var(--ntk-cms-search-border);
  border-radius: 7px;
  padding: 0.3rem 0.45rem;
  background: transparent;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.74rem;
}

.cms-preview-card--content {
  display: grid;
  gap: 0.6rem;
}

.cms-preview-content-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.cms-preview-content-text {
  margin: 0;
}

.cms-preview-content-status {
  display: grid;
  gap: 0.2rem;
  color: var(--ntk-cms-text-secondary);
  font-size: 0.8rem;
}

.cms-banner :deep(code) {
  font-family: var(--ntk-font-family-mono);
  font-size: 0.78rem;
}

@media (max-width: 1280px) {
  .cms-list-item--menu {
    grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
  }

  .cms-list-item--toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr)) auto auto auto;
  }
}

@media (max-width: 1024px) {
  .cms-shell-page__grid,
  .cms-config-section,
  .cms-form-grid,
  .cms-color-grid,
  .cms-toggle-row {
    grid-template-columns: 1fr;
  }

  .cms-settings__toolbar {
    flex-wrap: wrap;
  }

  .cms-settings__saved-at {
    margin-left: 0;
    width: 100%;
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
