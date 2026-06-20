<template>
  <div class="cms-pages">
    <CmsWorkspaceTabs
      :model-value="cmsPagesWorkspaceTabValue"
      v-bind="{ ariaLabel: tr('Pages workspace tabs', 'Abas do workspace de páginas') }"
      :tabs="cmsWorkspaceTabOptions"
      @update:model-value="emit('update:cmsPagesWorkspaceTabValue', normalizeString($event))"
    />
    <CmsAuthoringWorkbench
      v-show="cmsPagesWorkspaceView === 'editor' && !cmsDesignerPreviewMode"
      class="cms-designer-card--pages"
      :page-aria-label="tr('Pages workbench', 'Workbench de páginas')"
      :canvas-aria-label="tr('Pages authoring workspace', 'Workspace de autoria de páginas')"
      :status-bar-aria-label="tr('Pages status bar', 'Barra de status de páginas')"
    >
      <template #header>
        <CmsAuthoringToolbar :info-items="cmsPagesToolbarInfoItems">
          <template #actions>
            <NtkButton
              flat
              dense
              no-caps
              icon="folder_open"
              class="cms-designer-card__toolbar-action"
              :label="tr('Open', 'Abrir')"
              :aria-label="tr('Open pages workspace', 'Abrir workspace de páginas')"
              @click="focusWorkbench()"
            />
            <NtkButton
              flat
              dense
              no-caps
              icon="note_add"
              class="cms-designer-card__toolbar-action"
              :label="tr('New', 'Novo')"
              :aria-label="cmsUiText.addPageLabel"
              @click="addCmsPage()"
            />
            <NtkButton
              flat
              dense
              no-caps
              icon="save"
              class="cms-designer-card__toolbar-action"
              :label="cmsUiText.saveLabel"
              :aria-label="cmsUiText.saveAriaLabel"
              @click="saveNow()"
            />
            <NtkButton
              flat
              dense
              no-caps
              icon="undo"
              class="cms-designer-card__toolbar-action"
              :label="tr('Undo', 'Desfazer')"
              :disable="!canUndoCmsAuthoringHistory"
              :aria-label="tr('Undo', 'Desfazer')"
              @click="undoCmsAuthoringChange()"
            />
            <NtkButton
              flat
              dense
              no-caps
              icon="redo"
              class="cms-designer-card__toolbar-action"
              :label="tr('Redo', 'Refazer')"
              :disable="!canRedoCmsAuthoringHistory"
              :aria-label="tr('Redo', 'Refazer')"
              @click="redoCmsAuthoringChange()"
            />
          </template>
          <template #trailing>
            <q-btn
              no-caps
              unelevated
              icon="visibility"
              :label="tr('Preview', 'Preview')"
              :style="primaryActionStyle"
              @click="showPagesPreview()"
            />
          </template>
        </CmsAuthoringToolbar>
      </template>
      <template #ruler>
        <CmsAuthoringRulerBar
          :marks="cmsDesignerRulerMarks"
          :focus-aria-label="tr('Focus page workbench', 'Focar workbench de páginas')"
          :mode-label="showCmsDesignerStageGrid ? tr('Grid', 'Grade') : tr('Plain', 'Livre')"
          @focus="focusWorkbench()"
          @toggle-mode="toggleCmsDesignerStageGrid()"
        >
          <template #meta-prefix>
            <q-chip
              dense
              square
              :style="statusChipStyle"
            >
              {{ selectedPageTemplateId }}
            </q-chip>
          </template>
        </CmsAuthoringRulerBar>
      </template>
      <template #workbench>
        <div class="cms-designer-card__workbench cms-designer-card__workbench--pages">
          <aside class="cms-designer-card__sidebar cms-pages__sidebar">
            <CmsAuthoringPanelHeader
              :title="tr('Page setup', 'Setup da página')"
              :description="tr('Template, quick actions and starter flows stay together on the left while the center stays focused on editing.', 'Template, ações rápidas e fluxos iniciais ficam juntos na esquerda enquanto o centro fica focado na edição.')"
            />
            <CmsAuthoringMetricsList :items="cmsPagesSidebarMetrics" />
            <div class="cms-pages__sidebar-section">
              <strong>{{ tr('Workspace actions', 'Ações do workspace') }}</strong>
              <div class="cms-form-grid cms-pages__stage-toolbar">
                <q-select
                  v-model="selectedPageTemplateIdModel"
                  outlined
                  dense
                  emit-value
                  map-options
                  popup-content-class="cms-pages-module-surface__popup"
                  :options="cmsPageTemplateOptions"
                  :label="tr('Page template', 'Template de página')"
                  class="cms-pages__template-select"
                />
                <q-select
                  v-if="cmsBuilderCommandOptions.length > 0"
                  v-model="selectedBuilderCommandIdModel"
                  outlined
                  dense
                  emit-value
                  map-options
                  popup-content-class="cms-pages-module-surface__popup"
                  :options="cmsBuilderCommandOptions"
                  option-label="label"
                  option-value="value"
                  :label="tr('Quick command', 'Comando rapido')"
                  class="cms-builder-command-select"
                />
                <div
                  v-if="cmsBuilderCommandOptions.length > 0"
                  class="cms-form-grid__inline-actions cms-pages__sidebar-action-bar"
                >
                  <q-btn
                    flat
                    dense
                    no-caps
                    icon="play_arrow"
                    :label="tr('Run', 'Executar')"
                    @click="executeSelectedBuilderCommand()"
                  />
                </div>
              </div>
              <p
                v-if="selectedCmsBuilderCommandOption"
                class="cms-config-caption cms-pages__toolbar-hint"
              >
                {{ selectedCmsBuilderCommandOption.description }}
              </p>
            </div>
          </aside>
          <div
            class="cms-designer-card__stage cms-pages__stage"
            :class="{ 'cms-designer-card__stage--plain': !showCmsDesignerStageGrid }"
          >
            <div
              v-if="cmsSchemaMigrationBatchReport.summary.upgradeRequiredCount > 0 || cmsSchemaMigrationBatchReport.summary.versionMissingCount > 0 || cmsSchemaMigrationBatchReport.summary.aheadCount > 0 || cmsSchemaMigrationBatchReport.summary.invalidModelCount > 0"
              class="cms-page-migration-summary"
            >
              <CmsSectionHeaderSummary
                :title="tr('Schema migration review', 'Revisão de migração de schema')"
                container-class="cms-review-summary__header"
                summary-class="cms-page-migration-summary__chips"
              >
                <template #summary>
                  <q-chip
                    dense
                    square
                    :style="warningActionStyle"
                  >
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
                  <q-chip
                    dense
                    square
                    :style="statusChipStyle"
                  >
                    {{ getCmsSchemaMigrationBatchSummaryLabel() }}
                  </q-chip>
                </template>
              </CmsSectionHeaderSummary>
            </div>
            <div
              v-for="{ page, pageIndex } in filteredCmsPageRows"
              :key="page.id"
              class="cms-page-item"
            >
              <div class="cms-page-item__grid">
                <q-input
                  v-model="page.id"
                  outlined
                  dense
                  :label="tr('Page ID', 'ID da página')"
                  @blur="normalizeCmsPageId(pageIndex)"
                />
                <q-select
                  :model-value="page.contentModelId"
                  outlined
                  dense
                  emit-value
                  map-options
                  popup-content-class="cms-pages-module-surface__popup"
                  :options="cmsContentModelOptions"
                  :label="tr('Content model', 'Modelo de conteúdo')"
                  @update:model-value="updateCmsPageContentModel(pageIndex, $event)"
                />
                <q-input
                  :model-value="getCmsPageTitleValue(page)"
                  outlined
                  dense
                  :label="tr('Title', 'Título')"
                  @update:model-value="updateCmsPageTitleValue(page, $event)"
                />
                <q-input
                  v-model="page.path"
                  outlined
                  dense
                  :label="tr('Path', 'Caminho')"
                  @blur="normalizeCmsPagePath(pageIndex)"
                />
                <q-select
                  v-model="page.status"
                  outlined
                  dense
                  emit-value
                  map-options
                  popup-content-class="cms-pages-module-surface__popup"
                  :options="pageStatusOptions"
                  :label="tr('Status', 'Status')"
                />
                <q-input
                  :model-value="getCmsPageDescriptionValue(page)"
                  outlined
                  dense
                  type="textarea"
                  autogrow
                  :label="tr('Description', 'Descrição')"
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
                        'Valores em nível de página guiados pelo modelo de conteúdo selecionado.'
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
                          popup-content-class="cms-pages-module-surface__popup"
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
                          popup-content-class="cms-pages-module-surface__popup"
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
                          :selected-preview-label="cmsMediaPickerUiText.selectedAssetsLabel"
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
                          popup-content-class="cms-pages-module-surface__popup"
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
                          popup-content-class="cms-pages-module-surface__popup"
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
                  <strong>{{ tr('Sections', 'Seções') }}</strong>
                  <div class="cms-page-item__sections-actions">
                    <q-select
                      :model-value="getSelectedSectionPresetForPage(pageIndex)"
                      outlined
                      dense
                      emit-value
                      map-options
                      popup-content-class="cms-pages-module-surface__popup"
                      :options="getCmsSectionPresetOptions(page)"
                      :label="tr('Section preset', 'Preset de seção')"
                      class="cms-page-item__section-preset-select"
                      @update:model-value="setSelectedSectionPresetForPage(pageIndex, $event)"
                    />
                    <q-select
                      :model-value="getSelectedSectionStarterPresetForPage(pageIndex)"
                      outlined
                      dense
                      emit-value
                      map-options
                      popup-content-class="cms-pages-module-surface__popup"
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
                      :label="tr('Add section', 'Adicionar seção')"
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
                      :label="tr('Sync schema version', 'Sincronizar versão do schema')"
                      :disable="!getCmsPageSchemaMigrationReport(page.id)?.canApply"
                      @click="syncCmsPageContentModelVersion(pageIndex)"
                    />
                    <q-select
                      :model-value="getSelectedReusableSectionForPage(pageIndex)"
                      outlined
                      dense
                      emit-value
                      map-options
                      popup-content-class="cms-pages-module-surface__popup"
                      :options="getCmsReusableSectionOptions(page)"
                      :label="tr('Reusable section', 'Seção reutilizável')"
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
                  <CmsSectionHeaderSummary
                    :title="tr('Schema upgrade report', 'Relatorio de upgrade do schema')"
                    container-class="cms-review-summary__header"
                    summary-class="cms-page-item__schema-migration-chips"
                  >
                    <template #summary>
                      <q-chip
                        dense
                        square
                        :style="getCmsSchemaMigrationStatusStyle(getCmsPageSchemaMigrationReport(page.id)?.status ?? 'current')"
                      >
                        {{ getCmsSchemaMigrationStatusLabel(getCmsPageSchemaMigrationReport(page.id)?.status ?? 'current') }}
                      </q-chip>
                      <q-chip
                        dense
                        square
                        :style="statusChipStyle"
                      >
                        {{
                          `v${getCmsPageSchemaMigrationReport(page.id)?.appliedVersion ?? '?'} -> v${getCmsPageSchemaMigrationReport(page.id)?.targetVersion ?? '?'}`
                        }}
                      </q-chip>
                    </template>
                  </CmsSectionHeaderSummary>
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
                  @dragend="onCmsPageSectionDragEnd()"
                  @dragover="onCmsPageSectionDragOver(page.id, section.id, $event)"
                  @drop="onCmsPageSectionDrop(pageIndex, section.id, sectionIndex, $event)"
                >
                  <q-input
                    v-model="section.id"
                    outlined
                    dense
                    :disable="isCmsPageSectionLinked(section)"
                    :label="tr('Section ID', 'ID da seção')"
                  />
                  <q-input
                    :model-value="getCmsSectionPresetLabel(resolveCmsPageSectionForAuthoring(section).presetId)"
                    outlined
                    dense
                    readonly
                    :label="tr('Preset', 'Preset')"
                  />
                  <q-input
                    :model-value="getCmsSectionLabelValue(resolveCmsPageSectionForAuthoring(section))"
                    outlined
                    dense
                    :disable="isCmsPageSectionLinked(section)"
                    :label="tr('Section label', 'Label da seção')"
                    @update:model-value="updateCmsSectionLabelValue(section, $event)"
                  />
                  <q-toggle
                    v-model="section.enabled"
                    :label="tr('Enabled', 'Ativado')"
                  />
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
                      :label="tr('Save reusable', 'Salvar reutilizável')"
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
                  :label="tr('Delete page', 'Excluir página')"
                  :style="dangerActionStyle"
                  :disable="settings.pages.length <= 1"
                  @click="removeCmsPage(pageIndex)"
                />
              </div>
            </div>

            <div
              v-if="hasCmsBuilderSearch && filteredCmsPageRows.length === 0"
              class="cms-block-item__empty cms-block-item__empty--card"
            >
              <strong>{{ tr('No pages matched the current search.', 'Nenhuma página corresponde à busca atual.') }}</strong>
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
              <CmsAuthoringPanelHeader
                :title="tr('Reusable content rail', 'Rail de conteúdo reutilizável')"
                :description="tr('Keep reusable sections and launch flows on the right so the center stays focused on live page editing.', 'Mantenha seções reutilizáveis e fluxos de lançamento na direita para o centro ficar focado na edição real da página.')"
              />
              <CmsAuthoringMetricsList :items="cmsPagesRailMetrics" />
            </div>
            <div class="cms-pages__reusable-library">
              <CmsSectionHeaderSummary
                :title="tr('Reusable sections library', 'Biblioteca de seções reutilizáveis')"
                container-class="cms-shell-card__header"
                summary-class="cms-blocks-library__header-actions"
              >
                <template #summary>
                  <q-toggle
                    v-model="showArchivedReusableSectionsModel"
                    dense
                    :label="tr('Show archived', 'Mostrar arquivados')"
                  />
                  <q-chip
                    dense
                    square
                    :style="statusChipStyle"
                  >
                    {{ filteredCmsReusableSectionLibrary.length }}/{{ settings.reusableSections.length }}
                  </q-chip>
                </template>
              </CmsSectionHeaderSummary>
              <hr class="cms-native-separator" aria-hidden="true">
              <div class="cms-pages__reusable-list">
                <div
                  v-if="filteredCmsReusableSectionLibrary.length === 0"
                  class="cms-block-item__empty"
                >
                  {{
                    hasCmsBuilderSearch
                      ? tr('No reusable section matched the current search.', 'Nenhuma seção reutilizável corresponde à busca atual.')
                      : tr('No reusable sections saved yet.', 'Nenhuma seção reutilizável salva ainda.')
                  }}
                </div>
                <article
                  v-for="reusableSection in pagedCmsReusableSectionLibrary"
                  :key="reusableSection.id"
                  class="cms-reusable-block-row"
                >
                  <div class="cms-reusable-block-row__meta">
                    <div class="cms-blocks-library__header">
                      <strong>{{ reusableSection.name }}</strong>
                      <q-chip
                        dense
                        square
                        :style="statusChipStyle"
                      >
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
                          getCmsReusableSectionName
                        )
                          ? `${tr('Deprecated -> replacement', 'Descontinuado -> substituto')}: ${getCmsReplacementLabel(
                            reusableSection.replacementEntityId,
                            settings.reusableSections,
                            getCmsReusableSectionName
                          )}`
                          : tr('Deprecated for new page composition', 'Descontinuado para nova composição de páginas')
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
                      popup-content-class="cms-pages-module-surface__popup"
                      :options="getCmsReusableSectionReplacementOptions(reusableSection)"
                      :label="tr('Replacement section', 'Seção substituta')"
                      @update:model-value="updateReusableSectionReplacement(reusableSection.id, $event)"
                    />
                    <q-input
                      v-if="isCmsDeprecatedEntity(reusableSection)"
                      :model-value="reusableSection.deprecationNote ?? ''"
                      outlined
                      dense
                      :label="tr('Deprecation note', 'Nota de descontinuação')"
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
                      :aria-label="tr('Inspect reusable section usage', 'Inspecionar uso da seção reutilizável')"
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
                        'Semeie uma landing junto com seções reutilizáveis, blocos e presets de schema para um caso de uso comum.'
                      )
                    }}
                  </small>
                </div>
                <q-chip
                  dense
                  square
                  :style="statusChipStyle"
                >
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
                    <q-chip
                      dense
                      square
                      :style="statusChipStyle"
                    >
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
                      {{ tr('Content model', 'Modelo de conteúdo') }}:
                      <strong>{{ starterKit.contentModelLabel }}</strong>
                    </span>
                    <span>
                      {{ tr('Reusable sections', 'Seções reutilizáveis') }}:
                      <strong>{{ starterKit.reusableSectionCount }}</strong>
                    </span>
                    <span>
                      {{ tr('Reusable blocks', 'Blocos reutilizáveis') }}:
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
              <div
                v-if="hasCmsBuilderSearch && filteredCmsStarterKitOptions.length === 0"
                class="cms-block-item__empty cms-pages__sidebar-empty"
              >
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
                        'Crie uma página pronta para edição em um clique e, se quiser, abra Blocos em seguida.'
                      )
                    }}
                  </small>
                </div>
                <q-chip
                  dense
                  square
                  :style="statusChipStyle"
                >
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
                    <q-chip
                      dense
                      square
                      :style="statusChipStyle"
                    >
                      {{ quickStart.sectionCount }}
                    </q-chip>
                  </div>
                  <small class="cms-page-quick-start-card__description">{{ quickStart.description }}</small>
                  <div class="cms-page-quick-start-card__meta">
                    <span>
                      {{ tr('Content model', 'Modelo de conteúdo') }}:
                      <strong>{{ quickStart.contentModelLabel }}</strong>
                    </span>
                    <span>
                      {{ tr('Sections', 'Seções') }}:
                      <strong>{{ quickStart.sectionLabels.join(', ') }}</strong>
                    </span>
                  </div>
                  <div class="cms-page-quick-start-card__actions">
                    <q-btn
                      no-caps
                      unelevated
                      icon="note_add"
                      :label="tr('Create page', 'Criar página')"
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
              <div
                v-if="hasCmsBuilderSearch && filteredCmsPageQuickStartOptions.length === 0"
                class="cms-block-item__empty cms-pages__sidebar-empty"
              >
                <strong>{{ tr('No quick-start matched the current search.', 'Nenhum quick-start corresponde a busca atual.') }}</strong>
              </div>
            </div>
          </aside>
        </div>
      </template>
      <template #status>
        <CmsAuthoringStatusBar
          class-name="cms-pages__statusbar"
          :items="cmsPagesStatusItems"
        />
      </template>
    </CmsAuthoringWorkbench>

    <CmsPagesPreviewSurface
      v-if="cmsPagesWorkspaceView === 'preview' || cmsDesignerPreviewMode"
      :source="cmsPreviewSource"
      :locale="cmsPreviewLocale"
      :viewport="cmsPreviewViewport"
      :source-options="cmsPreviewSourceOptions"
      :locale-options="cmsLocaleOptions"
      :viewport-options="cmsPreviewViewportOptions"
      :published-release-label="cmsPreviewPublishedReleaseLabel"
      :status-chip-style="statusChipStyle"
      :banner-style="bannerStyle"
      :is-pt-br="isPtBrLocale"
      :empty-message="cmsPreviewEmptyMessage"
      :draft-published-diff="cmsPreviewDraftPublishedDiff"
      :changed-page-diffs="cmsPreviewChangedPageDiffs"
      :locale-coverage-matrix="cmsPreviewLocaleCoverageMatrix"
      :active-locale-coverage="cmsPreviewActiveLocaleCoverage"
      :locale-coverage-categories="cmsLocaleCoverageCategories"
      :pages-for-render="cmsPreviewPagesForRender"
      :preview-page-diff-map="cmsPreviewPageDiffMap"
      :preview-authored-content-models="cmsPreviewAuthoredContentModels"
      :registry="landingRegistry"
      :preview-render-context="cmsPreviewRenderContext"
      :t="tr"
      :get-preview-diff-status-style="getCmsPreviewDiffStatusStyle"
      :get-preview-diff-status-label="getCmsPreviewDiffStatusLabel"
      :get-preview-diff-change-count="getCmsPreviewDiffChangeCount"
      :get-preview-diff-page-label="getCmsPreviewDiffPageLabel"
      :get-preview-diff-page-path="getCmsPreviewDiffPagePath"
      :get-locale-coverage-status-style="getCmsLocaleCoverageStatusStyle"
      :get-locale-coverage-summary-label="getCmsLocaleCoverageSummaryLabel"
      :get-locale-coverage-status-label="getCmsLocaleCoverageStatusLabel"
      :get-locale-coverage-category-label="getCmsLocaleCoverageCategoryLabel"
      :get-locale-coverage-locale-label="getCmsLocaleCoverageLocaleLabel"
      :get-page-title-value="getCmsPageTitleValue"
      :get-page-description-value="getCmsPageDescriptionValue"
      :get-content-model-label="getCmsContentModelLabel"
      :get-page-current-schema-version="getCmsPageCurrentSchemaVersion"
      :get-page-status-style="getCmsPageStatusStyle"
      :to-preview-page-schema="toCmsPreviewPageSchema"
      :get-preview-page-diagnostics="getCmsPreviewPageDiagnostics"
      :to-diagnostics-list-items="toCmsDiagnosticsListItems"
      :get-page-section-style="getCmsPageSectionStyle"
      :get-section-label-value="getCmsSectionLabelValue"
      @open-in-window="openPagesPreviewInWindow()"
      @update:source="cmsPreviewSourceModel = $event"
      @update:locale="cmsPreviewLocaleModel = $event"
      @update:viewport="cmsPreviewViewportModel = $event"
    />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import NtkButton from '../../../../../components/ui/NtkButton.vue'
import type { CmsBlockRegistry, CmsRecord, CmsPageSchema } from '../../../../../modules/cms/core'
import type { CmsContentValidationIssue } from '../../../../../modules/cms/white-label/content-validation'
import type {
  CmsLocaleCoverageCategory,
  CmsLocaleCoverageStatus,
  CmsLocaleCoverageSummary,
} from '../../../../../modules/cms/white-label/locale-coverage'
import type {
  CmsPreviewDiffCounterSummary,
  CmsPreviewDiffStatus,
  CmsPreviewDraftPublishedDiff,
  CmsPreviewPageDiffSummary,
} from '../../../../../modules/cms/white-label/preview-diff'
import type { CmsPageTemplateId } from '../../../../../modules/cms/white-label/page-templates'
import type { CmsSchemaMigrationBatchReport } from '../../../../../modules/cms/white-label/schema-migration'
import type {
  CmsAuthoredContentModelSettings,
  CmsContentModelFieldDefinition,
  CmsLocale,
  CmsPageSettings,
  CmsPreviewSource,
  CmsPreviewViewport,
  CmsReusableSectionSettings,
  CmsWhiteLabelSettings,
} from '../../../../../modules/cms/white-label/types'
import CmsAuthoringMetricsList, { type CmsAuthoringMetricItem } from '../CmsAuthoringMetricsList.vue'
import CmsAuthoringPanelHeader from '../CmsAuthoringPanelHeader.vue'
import CmsAuthoringRulerBar from '../CmsAuthoringRulerBar.vue'
import CmsAuthoringStatusBar, { type CmsAuthoringStatusItem } from '../CmsAuthoringStatusBar.vue'
import CmsAuthoringToolbar, { type CmsAuthoringToolbarInfoItem } from '../CmsAuthoringToolbar.vue'
import CmsAuthoringWorkbench from '../CmsAuthoringWorkbench.vue'
import type { CmsDiagnosticsListItem } from '../CmsDiagnosticsListSection.vue'
import CmsMediaAssetPicker from '../CmsMediaAssetPicker.vue'
import CmsPagesPreviewSurface from './CmsPagesPreviewSurface.vue'
import CmsSectionHeaderSummary from '../CmsSectionHeaderSummary.vue'
import CmsWorkspaceTabs, { type CmsWorkspaceTabOption } from '../CmsWorkspaceTabs.vue'

interface CmsSelectOption<TValue extends string = string> {
  label: string
  value: TValue
}

interface CmsBuilderCommandOption {
  label: string
  value: string
  description: string
}

interface CmsFilteredPageRow {
  page: CmsPageSettings
  pageIndex: number
}

interface CmsPageContentFieldGroup {
  id: string
  label: string
  fields: CmsContentModelFieldDefinition[]
}

interface CmsDraggedPageSection {
  pageId: string
  sectionId: string
}

interface CmsMediaPickerUiText {
  anyKindLabel: string
  selectedAssetsLabel: string
  noSelectionLabel: string
  noOptionLabel: string
  incompatibleLabel: string
}

interface CmsStarterKitOption {
  value: string
  label: string
  description: string
  sectionCount: number
  templateLabel: string
  contentModelLabel: string
  reusableSectionCount: number
  reusableBlockCount: number
  blockPresetCount: number
  fieldPresetCount: number
}

interface CmsPageQuickStartOption {
  value: string
  label: string
  description: string
  sectionCount: number
  contentModelLabel: string
  sectionLabels: string[]
}

const props = defineProps<{
  settings: CmsWhiteLabelSettings
  cmsUiText: { addPageLabel: string; saveLabel: string; saveAriaLabel: string }
  cmsPagesWorkspaceTabValue: string
  cmsWorkspaceTabOptions: CmsWorkspaceTabOption[]
  cmsPagesWorkspaceView: 'editor' | 'preview'
  cmsDesignerPreviewMode: boolean
  cmsPagesToolbarInfoItems: CmsAuthoringToolbarInfoItem[]
  canUndoCmsAuthoringHistory: boolean
  canRedoCmsAuthoringHistory: boolean
  cmsDesignerRulerMarks: number[]
  showCmsDesignerStageGrid: boolean
  selectedPageTemplateId: CmsPageTemplateId
  cmsPagesSidebarMetrics: CmsAuthoringMetricItem[]
  cmsPageTemplateOptions: CmsSelectOption<CmsPageTemplateId>[]
  selectedBuilderCommandId: string
  cmsBuilderCommandOptions: CmsBuilderCommandOption[]
  selectedCmsBuilderCommandOption: CmsBuilderCommandOption | null
  cmsSchemaMigrationBatchReport: CmsSchemaMigrationBatchReport
  filteredCmsPageRows: CmsFilteredPageRow[]
  cmsContentModelOptions: CmsSelectOption[]
  pageStatusOptions: CmsSelectOption[]
  cmsMediaPickerUiText: CmsMediaPickerUiText
  draggedPageSection: CmsDraggedPageSection | null
  pageSectionDropTargetKey: string | null
  cmsPagesRailMetrics: CmsAuthoringMetricItem[]
  showArchivedReusableSections: boolean
  filteredCmsReusableSectionLibrary: CmsReusableSectionSettings[]
  pagedCmsReusableSectionLibrary: CmsReusableSectionSettings[]
  hasCmsBuilderSearch: boolean
  cmsStarterKitOptions: CmsStarterKitOption[]
  filteredCmsStarterKitOptions: CmsStarterKitOption[]
  cmsPageQuickStartOptions: CmsPageQuickStartOption[]
  filteredCmsPageQuickStartOptions: CmsPageQuickStartOption[]
  cmsPagesStatusItems: CmsAuthoringStatusItem[]
  cmsPreviewSource: CmsPreviewSource
  cmsPreviewLocale: CmsLocale
  cmsPreviewViewport: CmsPreviewViewport
  cmsPreviewSourceOptions: readonly CmsSelectOption[]
  cmsLocaleOptions: readonly CmsSelectOption[]
  cmsPreviewViewportOptions: readonly CmsSelectOption[]
  cmsPreviewPublishedReleaseLabel: string | null
  isPtBrLocale: boolean
  cmsPreviewEmptyMessage: string
  cmsPreviewDraftPublishedDiff: CmsPreviewDraftPublishedDiff | null
  cmsPreviewChangedPageDiffs: CmsPreviewPageDiffSummary[]
  cmsPreviewLocaleCoverageMatrix: CmsLocaleCoverageSummary[]
  cmsPreviewActiveLocaleCoverage: CmsLocaleCoverageSummary | null
  cmsLocaleCoverageCategories: CmsLocaleCoverageCategory[]
  cmsPreviewPagesForRender: CmsPageSettings[]
  cmsPreviewPageDiffMap: Map<string, CmsPreviewPageDiffSummary>
  cmsPreviewAuthoredContentModels: CmsAuthoredContentModelSettings[]
  landingRegistry: CmsBlockRegistry
  cmsPreviewRenderContext: CmsRecord
  statusChipStyle: Record<string, string>
  primaryActionStyle: Record<string, string>
  warningActionStyle: Record<string, string>
  dangerActionStyle: Record<string, string>
  bannerStyle: Record<string, string>
  tr: (en: string, pt: string) => string
  focusWorkbench: Function
  addCmsPage: Function
  saveNow: Function
  undoCmsAuthoringChange: Function
  redoCmsAuthoringChange: Function
  showPagesPreview: Function
  toggleCmsDesignerStageGrid: Function
  executeSelectedBuilderCommand: Function
  normalizeCmsPageId: Function
  updateCmsPageContentModel: Function
  updateCmsPageTitleValue: Function
  normalizeCmsPagePath: Function
  updateCmsPageDescriptionValue: Function
  getCmsPageContentModelFields: (page: CmsPageSettings) => CmsContentModelFieldDefinition[]
  getCmsPageContentModelFieldGroups: (page: CmsPageSettings) => CmsPageContentFieldGroup[]
  formatCmsJsonFieldValue: Function
  getCmsPageCustomFieldValue: Function
  getCmsContentModelFieldHint: Function
  updateCmsPageCustomFieldValue: Function
  normalizeCmsMediaPickerModelValue: Function
  getCmsPageCustomFieldMediaOptions: Function
  getCmsMediaAllowedKindLabels: Function
  getCmsPageCustomFieldReferenceOptions: Function
  formatCmsRepeatableFieldValue: Function
  getCmsContentModelFieldHtmlInputType: Function
  getSelectedSectionPresetForPage: Function
  getCmsSectionPresetOptions: Function
  setSelectedSectionPresetForPage: Function
  getSelectedSectionStarterPresetForPage: Function
  getCmsSectionStarterPresetOptions: Function
  setSelectedSectionStarterPresetForPage: Function
  addCmsPageSection: Function
  isCmsPageSectionAddBlocked: Function
  applyCmsPageContentModelStarterSections: Function
  applyCmsPageContentModelDefaults: Function
  syncCmsPageContentModelVersion: Function
  getSelectedReusableSectionForPage: Function
  getCmsReusableSectionOptions: Function
  setSelectedReusableSectionForPage: Function
  insertSelectedReusableSection: Function
  insertSelectedLinkedReusableSection: Function
  getCmsPageSchemaMigrationReport: Function
  getCmsSchemaMigrationBatchSummaryLabel: Function
  getCmsSchemaMigrationSummaryLabel: Function
  getCmsSchemaMigrationStatusStyle: Function
  getCmsSchemaMigrationStatusLabel: Function
  getCmsSchemaMigrationChangeStyle: Function
  getCmsSchemaMigrationChangeKindLabel: Function
  getCmsSchemaMigrationChangeValueLabel: Function
  getCmsSectionStarterPresetVariants: Function
  isCmsSectionStarterPresetSelected: Function
  getCmsStarterPresetSourceLabel: Function
  onCmsPageSectionDragStart: Function
  onCmsPageSectionDragEnd: Function
  onCmsPageSectionDragOver: Function
  onCmsPageSectionDrop: Function
  isCmsPageSectionLinked: Function
  resolveCmsPageSectionForAuthoring: Function
  getCmsSectionPresetLabel: Function
  getCmsSectionLabelValue: (section: CmsPageSettings['sections'][number]) => string
  updateCmsSectionLabelValue: Function
  getCmsReusableSourceLabel: Function
  duplicateCmsPageSection: Function
  saveCmsPageSectionAsReusable: Function
  branchCmsPageSectionToVariant: Function
  detachCmsPageSection: Function
  openPageInBlocksEditor: Function
  removeCmsPageSection: Function
  removeCmsPage: Function
  getCmsReplacementLabel: Function
  isCmsArchivedEntity: Function
  isCmsDeprecatedEntity: Function
  isCmsReusableSectionVariant: Function
  getCmsReplacementAssistantSummaryLabel: Function
  getCmsReusableSectionVariantLabel: Function
  getCmsReusableSectionUsageSummaryLabel: Function
  getCmsReusableSectionUsageCount: Function
  getCmsReusableSectionLabelValue: Function
  getCmsReusableSectionReplacementOptions: Function
  updateReusableSectionReplacement: Function
  updateReusableSectionDeprecationNote: Function
  createReusableSectionVariant: Function
  getCmsReplacementAssistantSummary: Function
  applyCmsDeprecatedReplacement: Function
  openCmsUsageDrawer: Function
  undeprecateReusableSection: Function
  deprecateReusableSection: Function
  unarchiveReusableSection: Function
  archiveReusableSection: Function
  runCmsStarterKit: Function
  runCmsPageQuickStart: Function
  openPagesPreviewInWindow: Function
  getCmsPreviewDiffStatusStyle: (status: CmsPreviewDiffStatus) => Record<string, string>
  getCmsPreviewDiffStatusLabel: (status: CmsPreviewDiffStatus) => string
  getCmsPreviewDiffChangeCount: (summary: CmsPreviewDiffCounterSummary) => number
  getCmsPreviewDiffPageLabel: (page: CmsPreviewPageDiffSummary) => string
  getCmsPreviewDiffPagePath: (page: CmsPreviewPageDiffSummary) => string
  getCmsLocaleCoverageStatusStyle: (status: CmsLocaleCoverageStatus) => Record<string, string>
  getCmsLocaleCoverageSummaryLabel: (summary: CmsLocaleCoverageSummary | null) => string
  getCmsLocaleCoverageStatusLabel: (status: CmsLocaleCoverageStatus) => string
  getCmsLocaleCoverageCategoryLabel: (category: CmsLocaleCoverageCategory) => string
  getCmsLocaleCoverageLocaleLabel: (locale: CmsLocale) => string
  getCmsPageTitleValue: (page: CmsPageSettings) => string
  getCmsPageDescriptionValue: (page: CmsPageSettings) => string
  getCmsContentModelLabel: (
    locale: CmsLocale,
    contentModelId: CmsPageSettings['contentModelId'],
    authoredContentModels: CmsAuthoredContentModelSettings[],
  ) => string
  getCmsPageCurrentSchemaVersion: (
    page: CmsPageSettings,
    authoredContentModels?: CmsAuthoredContentModelSettings[],
  ) => number
  getCmsPageStatusStyle: (status: CmsPageSettings['status']) => CSSProperties
  toCmsPreviewPageSchema: (page: CmsPageSettings) => CmsPageSchema
  getCmsPreviewPageDiagnostics: (pageId: string, pageIndex: number) => CmsContentValidationIssue[]
  toCmsDiagnosticsListItems: (issues: CmsContentValidationIssue[]) => CmsDiagnosticsListItem[]
  getCmsPageSectionStyle: (enabled: boolean) => CSSProperties
}>()

const emit = defineEmits<{
  'update:cmsPagesWorkspaceTabValue': [value: string]
  'update:selectedPageTemplateId': [value: CmsPageTemplateId]
  'update:selectedBuilderCommandId': [value: string]
  'update:showArchivedReusableSections': [value: boolean]
  'update:cmsPreviewSource': [value: CmsPreviewSource]
  'update:cmsPreviewLocale': [value: CmsLocale]
  'update:cmsPreviewViewport': [value: CmsPreviewViewport]
}>()

const selectedPageTemplateIdModel = computed({
  get: () => props.selectedPageTemplateId,
  set: value => emit('update:selectedPageTemplateId', normalizePageTemplateId(value)),
})

const selectedBuilderCommandIdModel = computed({
  get: () => props.selectedBuilderCommandId,
  set: value => emit('update:selectedBuilderCommandId', normalizeString(value)),
})

const showArchivedReusableSectionsModel = computed({
  get: () => props.showArchivedReusableSections,
  set: value => emit('update:showArchivedReusableSections', Boolean(value)),
})

const cmsPreviewSourceModel = computed({
  get: () => props.cmsPreviewSource,
  set: value => emit('update:cmsPreviewSource', normalizePreviewSource(value)),
})

const cmsPreviewLocaleModel = computed({
  get: () => props.cmsPreviewLocale,
  set: value => emit('update:cmsPreviewLocale', normalizeLocale(value)),
})

const cmsPreviewViewportModel = computed({
  get: () => props.cmsPreviewViewport,
  set: value => emit('update:cmsPreviewViewport', normalizePreviewViewport(value)),
})

function normalizeString(value: unknown): string {
  return String(value ?? '')
}

function normalizePageTemplateId(value: unknown): CmsPageTemplateId {
  if (value === 'marketing' || value === 'blank') {
    return value
  }

  return 'landing-default'
}

function normalizePreviewSource(value: unknown): CmsPreviewSource {
  return value === 'published' ? 'published' : 'draft'
}

function normalizeLocale(value: unknown): CmsLocale {
  return value === 'pt-BR' ? 'pt-BR' : 'en'
}

function normalizePreviewViewport(value: unknown): CmsPreviewViewport {
  if (value === 'tablet' || value === 'mobile') {
    return value
  }

  return 'desktop'
}

function getCmsReusableSectionName(section: CmsReusableSectionSettings): string {
  return section.name
}
</script>