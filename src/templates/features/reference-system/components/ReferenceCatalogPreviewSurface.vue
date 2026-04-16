<template>
  <section
    class="ntk-reference-catalog-preview"
    :style="whitelabelStyleVars"
  >
    <header class="ntk-reference-catalog-preview__header">
      <div>
        <p class="ntk-reference-catalog-preview__eyebrow">
          Live sample preview
        </p>
        <h2>{{ surface?.title ?? 'Select a surface' }}</h2>
        <p class="ntk-reference-catalog-preview__subtitle">
          {{ surface?.description ?? 'Choose a reusable surface to inspect the approved layout direction.' }}
        </p>
      </div>

      <div
        v-if="surface"
        class="ntk-reference-catalog-preview__badges"
      >
        <span class="ntk-reference-catalog-preview__badge">
          {{ surface.tag }}
        </span>
        <span class="ntk-reference-catalog-preview__badge ntk-reference-catalog-preview__badge--muted">
          {{ surface.template }}
        </span>
      </div>
    </header>

    <div class="ntk-reference-catalog-preview__surface">
      <div
        v-if="!surface"
        class="ntk-reference-catalog-preview__empty"
      >
        <q-icon
          name="view_quilt"
          size="34px"
        />
        <span>Pick one sample to render the approved template live.</span>
      </div>

      <DashboardTemplate
        v-else-if="surface.template === 'dashboard'"
        title="Reference sample dashboard"
        subtitle="Approved overview shell for KPIs, ranking and activity."
        greeting-icon="NTK"
        :chips="referenceDashboardChips"
        :metrics="referenceDashboardMetrics"
        :activities="referenceDashboardActivities"
        :top-items="referenceDashboardTopItems"
      />

      <DashboardWorkspaceTemplate
        v-else-if="surface.template === 'workspace'"
        title="Reference workspace"
        subtitle="Reusable lane-driven operations shell for sample systems."
        :chips="referenceDashboardChips"
        :actions="referenceWorkspaceActions"
        :filters="referenceWorkspaceFilters"
        :views="referenceWorkspaceViews"
        :metrics="referenceWorkspaceMetrics"
        :panels="referenceWorkspacePanels"
        :lanes="referenceWorkspaceLanes"
        :search-value="workspaceSearchValue"
        :active-filter-id="activeWorkspaceFilterId"
        :active-view-id="activeWorkspaceViewId"
        @update:search-value="workspaceSearchValue = $event"
        @update:active-filter-id="activeWorkspaceFilterId = $event"
        @update:active-view-id="activeWorkspaceViewId = $event"
      />

      <CrudListTemplate
        v-else-if="surface.template === 'cruds'"
        title="Reference sample registry"
        subtitle="List and batch-action template for shared backoffice modules."
        :columns="referenceCrudColumns"
        :records="referenceCrudRecords"
        :filters="referenceCrudFilters"
        :metrics="referenceCrudMetrics"
        :actions="referenceWorkspaceActions"
        :row-actions="referenceCrudRowActions"
        :bulk-actions="referenceCrudBulkActions"
        :search-value="crudSearchValue"
        :active-filter-id="activeCrudFilterId"
        :view-mode="crudViewMode"
        :selected-ids="selectedCrudIds"
        @update:search-value="crudSearchValue = $event"
        @update:active-filter-id="activeCrudFilterId = $event"
        @update:view-mode="crudViewMode = $event"
        @update:selected-ids="selectedCrudIds = $event"
      />

      <ProfileTemplate
        v-else-if="surface.template === 'profile'"
        :profile="referenceProfile"
        :groups="referenceProfileGroups"
      />

      <EditorWorkbenchTemplate
        v-else-if="surface.template === 'editor'"
        document-title="Reference workspace canvas"
        document-subtitle="Editor surface driven by reusable widget, canvas and status contracts."
        :topbar-actions="referenceEditorTopbarActions"
        :quick-actions="referenceEditorQuickActions"
        :widget-sections="referenceEditorWidgetSections"
        :widget-search-value="editorWidgetSearchValue"
        :selected-widget-id="selectedWidgetId"
        :canvas-columns="referenceEditorCanvasColumns"
        :canvas-objects="referenceEditorCanvasObjects"
        :rail-actions="referenceEditorRailActions"
        :left-status-segments="referenceEditorLeftStatusSegments"
        :right-status-segments="referenceEditorRightStatusSegments"
        :zoom-value="editorZoomValue"
        :zoom-options="editorZoomOptions"
        show-document-regions
        @update:widget-search-value="editorWidgetSearchValue = $event"
        @update:selected-widget-id="selectedWidgetId = $event"
        @update:zoom-value="editorZoomValue = $event"
      />

      <EnterpriseCommandCenterTemplate
        v-else-if="surface.template === 'command-center'"
        title="Reference command center"
        subtitle="Enterprise monitoring surface for alerts, activity and service health."
        :actions="referenceEnterpriseActions"
        :filters="referenceEnterpriseFilters"
        :kpis="referenceEnterpriseKpis"
        :alerts="referenceEnterpriseAlerts"
        :activities="referenceEnterpriseActivities"
        :services="referenceEnterpriseServices"
        :search-value="enterpriseSearchValue"
        :active-filter-id="enterpriseFilterId"
        @update:search-value="enterpriseSearchValue = $event"
        @update:active-filter-id="enterpriseFilterId = $event"
      />

      <LoginTemplate
        v-else-if="surface.template === 'login'"
        :email="loginEmail"
        :password="loginPassword"
        :brand-title="selectedPreset.brand.name"
        :brand-subtitle="selectedPreset.brand.description"
        :features="referenceLoginFeatures"
        form-title="Enter the reference runtime"
        form-subtitle="Whitelabel and template contracts stay reusable across every approved system."
        submit-label="Preview runtime"
        show-version
        version-label="reference catalog preview"
        @update:email="loginEmail = $event"
        @update:password="loginPassword = $event"
      />

      <WikiTemplate
        v-else-if="surface.template === 'wiki'"
        title="Reference knowledge hub"
        subtitle="Knowledge surface for docs, tagged assets and AI-assisted exploration."
        :categories="referenceWikiCategories"
        :documents="referenceWikiDocuments"
        :stat-chips="referenceWikiStatChips"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CSSProperties } from 'vue'

import type { ReferenceSampleSurface, ReferenceWhitelabelPreset } from '../../../../whitelabel'
import {
  CrudListTemplate,
  DashboardTemplate,
  DashboardWorkspaceTemplate,
  EditorWorkbenchTemplate,
  ProfileTemplate,
} from '../../../pages'
import LoginTemplate from '../../auth/LoginTemplate.vue'
import EnterpriseCommandCenterTemplate from '../../enterprise/EnterpriseCommandCenterTemplate.vue'
import WikiTemplate from '../../wiki/WikiTemplate.vue'
import {
  referenceCrudBulkActions,
  referenceCrudColumns,
  referenceCrudFilters,
  referenceCrudMetrics,
  referenceCrudRecords,
  referenceCrudRowActions,
  referenceDashboardActivities,
  referenceDashboardChips,
  referenceDashboardMetrics,
  referenceDashboardTopItems,
  referenceEditorCanvasColumns,
  referenceEditorCanvasObjects,
  referenceEditorLeftStatusSegments,
  referenceEditorQuickActions,
  referenceEditorRailActions,
  referenceEditorRightStatusSegments,
  referenceEditorTopbarActions,
  referenceEditorWidgetSections,
  referenceEnterpriseActions,
  referenceEnterpriseActivities,
  referenceEnterpriseAlerts,
  referenceEnterpriseFilters,
  referenceEnterpriseKpis,
  referenceEnterpriseServices,
  referenceLoginFeatures,
  referenceProfile,
  referenceProfileGroups,
  referenceWikiCategories,
  referenceWikiDocuments,
  referenceWikiStatChips,
  referenceWorkspaceActions,
  referenceWorkspaceFilters,
  referenceWorkspaceLanes,
  referenceWorkspaceMetrics,
  referenceWorkspacePanels,
  referenceWorkspaceViews,
} from '../reference-catalog.sample-data'

withDefaults(defineProps<{
  surface?: ReferenceSampleSurface | null
  selectedPreset: ReferenceWhitelabelPreset
  whitelabelStyleVars?: CSSProperties
}>(), {
  surface: null,
  whitelabelStyleVars: () => ({}),
})

const workspaceSearchValue = ref('')
const activeWorkspaceFilterId = ref('all')
const activeWorkspaceViewId = ref('overview')

const crudSearchValue = ref('')
const activeCrudFilterId = ref('all')
const crudViewMode = ref<'table' | 'cards'>('table')
const selectedCrudIds = ref<string[]>([])

const editorWidgetSearchValue = ref('')
const selectedWidgetId = ref<string | null>(referenceEditorWidgetSections[0]?.items[0]?.id ?? null)
const editorZoomOptions = [50, 75, 100, 125, 150]
const editorZoomValue = ref(100)

const enterpriseSearchValue = ref('')
const enterpriseFilterId = ref('all')

const loginEmail = ref('reference@nettoolskit.dev')
const loginPassword = ref('demo-password')
</script>

<style scoped lang="scss">
.ntk-reference-catalog-preview {
  --ntk-reference-catalog-preview-shell-border: var(--ntk-reference-shell-chrome-border, var(--ntk-border-color));
  --ntk-reference-catalog-preview-shell-bg: var(--ntk-reference-shell-chrome-bg, color-mix(in srgb, var(--ntk-bg-card) 90%, transparent));
  --ntk-reference-catalog-preview-shell-shadow: var(--ntk-reference-shell-glow, 0 18px 48px color-mix(in srgb, var(--ntk-text-primary) 8%, transparent));
  --ntk-reference-catalog-preview-text: var(--ntk-text-primary, var(--ntk-template-page-title, var(--ntk-text-primary)));
  --ntk-reference-catalog-preview-muted: var(--ntk-text-secondary, var(--ntk-template-page-subtitle, var(--ntk-text-secondary)));
  --ntk-reference-catalog-preview-badge-bg: var(--ntk-reference-badge-bg, color-mix(in srgb, var(--ntk-reference-accent, var(--ntk-primary)) 12%, transparent));
  --ntk-reference-catalog-preview-badge-text: var(--ntk-reference-badge-text, var(--ntk-reference-accent, var(--ntk-primary)));
  --ntk-reference-catalog-preview-muted-badge-bg: var(--ntk-reference-panel-muted-bg, var(--ntk-bg-secondary));
  --ntk-reference-catalog-preview-surface-border: var(--ntk-reference-border, var(--ntk-border-color));
  --ntk-reference-catalog-preview-surface-bg: var(--ntk-reference-panel-bg, var(--ntk-bg-card));
  --ntk-reference-catalog-preview-surface-shadow: var(--ntk-shadow-md, 0 24px 48px color-mix(in srgb, var(--ntk-text-primary) 12%, transparent));

  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
  border: 1px solid var(--ntk-reference-catalog-preview-shell-border);
  border-radius: 28px;
  background: var(--ntk-reference-catalog-preview-shell-bg);
  box-shadow: var(--ntk-reference-catalog-preview-shell-shadow);
}

.ntk-reference-catalog-preview__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.ntk-reference-catalog-preview__eyebrow {
  margin: 0 0 8px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-reference-catalog-preview-muted);
}

.ntk-reference-catalog-preview__header h2 {
  margin: 0;
  color: var(--ntk-reference-catalog-preview-text);
}

.ntk-reference-catalog-preview__subtitle {
  margin: 8px 0 0;
  color: var(--ntk-reference-catalog-preview-muted);
  line-height: 1.6;
}

.ntk-reference-catalog-preview__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ntk-reference-catalog-preview__badge {
  min-height: 28px;
  border-radius: 999px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  background: var(--ntk-reference-catalog-preview-badge-bg);
  color: var(--ntk-reference-catalog-preview-badge-text);
  font-size: 12px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.ntk-reference-catalog-preview__badge--muted {
  background: var(--ntk-reference-catalog-preview-muted-badge-bg);
  color: var(--ntk-reference-catalog-preview-muted);
}

.ntk-reference-catalog-preview__surface {
  min-height: 560px;
  border: 1px solid var(--ntk-reference-catalog-preview-surface-border);
  border-radius: 24px;
  overflow: auto;
  background: var(--ntk-reference-catalog-preview-surface-bg);
  box-shadow: var(--ntk-reference-catalog-preview-surface-shadow);
}

.ntk-reference-catalog-preview__empty {
  min-height: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--ntk-reference-catalog-preview-muted);
}

@media (max-width: 980px) {
  .ntk-reference-catalog-preview__header {
    flex-direction: column;
  }
}
</style>
