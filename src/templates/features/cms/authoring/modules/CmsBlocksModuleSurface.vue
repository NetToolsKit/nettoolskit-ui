<template>
  <div class="cms-shell-page__grid cms-blocks-shell">
    <CmsWorkspaceTabs
      :model-value="cmsBlocksWorkspaceTabValue"
      :ariaLabel="tr('Blocks workspace tabs', 'Abas do workspace de blocos')"
      :tabs="cmsWorkspaceTabOptions"
      @update:model-value="emit('update:cmsBlocksWorkspaceTabValue', String($event ?? ''))"
    />
    <CmsAuthoringWorkbench
      v-show="cmsBlocksWorkspaceView === 'editor' && !cmsDesignerPreviewMode"
      class="cms-designer-card--blocks"
      :page-aria-label="tr('Blocks workbench', 'Workbench de blocos')"
      :canvas-aria-label="tr('Blocks authoring workspace', 'Workspace de autoria de blocos')"
      :status-bar-aria-label="tr('Blocks status bar', 'Barra de status de blocos')"
    >
      <template #header>
        <CmsAuthoringToolbar :info-items="cmsBlocksToolbarInfoItems">
          <template #actions>
            <NtkButton flat dense no-caps icon="folder_open" class="cms-designer-card__toolbar-action" :label="tr('Open', 'Abrir')" :aria-label="tr('Open blocks workspace', 'Abrir workspace de blocos')" @click="focusWorkbench()" />
            <NtkButton flat dense no-caps icon="note_add" class="cms-designer-card__toolbar-action" :label="tr('New', 'Novo')" :disable="!canAddPaletteBlockToActiveSection" :aria-label="tr('Add block', 'Adicionar bloco')" @click="addCmsBuilderBlockFromPalette()" />
            <NtkButton flat dense no-caps icon="save" class="cms-designer-card__toolbar-action" :label="cmsUiText.saveLabel" :aria-label="cmsUiText.saveAriaLabel" @click="saveNow()" />
            <NtkButton flat dense no-caps icon="undo" class="cms-designer-card__toolbar-action" :label="tr('Undo', 'Desfazer')" :disable="!canUndoCmsAuthoringHistory" :aria-label="tr('Undo', 'Desfazer')" @click="undoCmsAuthoringChange()" />
            <NtkButton flat dense no-caps icon="redo" class="cms-designer-card__toolbar-action" :label="tr('Redo', 'Refazer')" :disable="!canRedoCmsAuthoringHistory" :aria-label="tr('Redo', 'Refazer')" @click="redoCmsAuthoringChange()" />
          </template>
          <template #trailing>
            <q-btn no-caps unelevated icon="visibility" :label="tr('Preview', 'Preview')" :style="primaryActionStyle" @click="showBlocksPreview()" />
          </template>
        </CmsAuthoringToolbar>
      </template>
      <template #ruler>
        <CmsAuthoringRulerBar
          :marks="cmsDesignerRulerMarks"
          :focus-aria-label="tr('Focus block workbench', 'Focar workbench de blocos')"
          :mode-label="showCmsDesignerStageGrid ? tr('Grid', 'Grade') : tr('Plain', 'Livre')"
          @focus="focusWorkbench()"
          @toggle-mode="toggleCmsDesignerStageGrid()"
        >
          <template #meta-prefix>
            <q-chip dense square :style="statusChipStyle">{{ cmsSectionBlocks.length }} {{ tr('blocks', 'blocos') }}</q-chip>
          </template>
        </CmsAuthoringRulerBar>
      </template>
      <template #workbench>
        <div class="cms-designer-card__workbench cms-designer-card__workbench--blocks">
          <aside class="cms-designer-card__sidebar cms-blocks__sidebar">
            <CmsAuthoringPanelHeader
              :title="tr('Block designer', 'Designer de blocos')"
              :description="tr('Keep focus on page, section and block context while authoring reusable pieces.', 'Mantenha foco em página, seção e bloco enquanto você cria peças reutilizáveis.')"
            />
            <CmsAuthoringMetricsList :items="cmsBlocksSidebarMetrics" />
          </aside>
          <div class="cms-designer-card__stage cms-blocks__stage" :class="{ 'cms-designer-card__stage--plain': !showCmsDesignerStageGrid }">
            <div v-if="cmsBuilderCommandOptions.length > 0" class="cms-form-grid cms-blocks__stage-command-bar">
              <q-select
                :model-value="selectedBuilderCommandId"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="cmsBuilderCommandOptions"
                option-label="label"
                option-value="value"
                :label="tr('Quick command', 'Comando rapido')"
                class="cms-builder-command-select"
                @update:model-value="emit('update:selectedBuilderCommandId', String($event ?? ''))"
              />
              <div class="cms-form-grid__inline-actions">
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
            <p v-if="selectedCmsBuilderCommandOption" class="cms-config-caption cms-pages__toolbar-hint">
              {{ selectedCmsBuilderCommandOption.description }}
            </p>
            <div class="cms-form-grid cms-blocks-toolbar">
              <q-select
                :model-value="activeBlocksPageId"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="blocksPageOptions"
                :label="tr('Target page', 'Página alvo')"
                @update:model-value="emit('update:activeBlocksPageId', String($event ?? ''))"
              />
              <q-select
                :model-value="activeBlocksSectionId"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="blocksSectionOptions"
                :label="tr('Target section', 'Seção alvo')"
                @update:model-value="emit('update:activeBlocksSectionId', String($event ?? ''))"
              />
              <q-select
                :model-value="activeBlocksBlockId"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="activeBlocksBlockOptions"
                :label="tr('Target block', 'Bloco alvo')"
                @update:model-value="emit('update:activeBlocksBlockId', String($event ?? ''))"
              />
              <q-select
                :model-value="selectedPaletteBlockType"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="cmsBlockPaletteOptions"
                :label="tr('Palette block', 'Bloco da paleta')"
                @update:model-value="emit('update:selectedPaletteBlockType', String($event ?? ''))"
              />
              <q-select
                :model-value="selectedPaletteBlockPresetId"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="cmsBlockPresetOptions"
                option-label="label"
                option-value="value"
                :label="tr('Block preset', 'Preset de bloco')"
                @update:model-value="emit('update:selectedPaletteBlockPresetId', String($event ?? '') as CmsBlockPresetId)"
              />
              <q-btn
                no-caps
                unelevated
                icon="add"
                :label="tr('Add block', 'Adicionar bloco')"
                :style="primaryActionStyle"
                :disable="!canAddPaletteBlockToActiveSection"
                @click="addCmsBuilderBlockFromPalette()"
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
                <strong>{{ tr('Section schema fields', 'Campos de schema da seção') }}</strong>
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
                        popup-content-class="cms-blocks-module-surface__popup"
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
                        popup-content-class="cms-blocks-module-surface__popup"
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
                        popup-content-class="cms-blocks-module-surface__popup"
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
                        popup-content-class="cms-blocks-module-surface__popup"
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
                @click="removeDisabledBlocksFromActiveSection()"
              />
            </div>

            <div class="cms-form-grid cms-blocks-reusable-toolbar">
              <q-input
                :model-value="reusableBlockNameDraft"
                outlined
                dense
                :label="tr('Reusable block name', 'Nome do bloco reutilizável')"
                :placeholder="activeBlocksSelectedBlockRecord ? resolveCmsBlockDisplayName(activeBlocksSelectedBlockRecord.type) : tr('Select a block first', 'Selecione um bloco primeiro')"
                @update:model-value="emit('update:reusableBlockNameDraft', String($event ?? ''))"
              />
              <q-input
                :model-value="reusableBlockDescriptionDraft"
                outlined
                dense
                :label="tr('Reusable description', 'Descrição reutilizável')"
                :placeholder="tr('Optional description for your library item', 'Descrição opcional para o item da biblioteca')"
                @update:model-value="emit('update:reusableBlockDescriptionDraft', String($event ?? ''))"
              />
              <q-select
                :model-value="selectedReusableBlockId"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="cmsReusableBlockOptions"
                :label="tr('Reusable library', 'Biblioteca reutilizável')"
                @update:model-value="emit('update:selectedReusableBlockId', String($event ?? ''))"
              />
              <q-btn
                flat
                dense
                no-caps
                icon="library_add"
                :label="tr('Save selection', 'Salvar seleção')"
                :disable="!activeBlocksSelectedBlockRecord"
                @click="saveSelectedBlockAsReusable()"
              />
              <q-btn
                no-caps
                unelevated
                icon="content_paste"
                :label="tr('Insert detached', 'Inserir desvinculado')"
                :style="primaryActionStyle"
                :disable="!selectedReusableBlockId || !activeBlocksSectionId || activeBlocksSectionIsLinked"
                @click="insertSelectedReusableBlock()"
              />
              <q-btn
                flat
                dense
                no-caps
                icon="link"
                :label="tr('Insert linked', 'Inserir vinculado')"
                :disable="!selectedReusableBlockId || !activeBlocksSectionId || activeBlocksSectionIsLinked"
                @click="insertSelectedLinkedReusableBlock()"
              />
            </div>

            <div class="cms-form-grid cms-blocks-reusable-toolbar">
              <q-input
                :model-value="authoredBlockPresetNameDraft"
                outlined
                dense
                :label="tr('Preset name', 'Nome do preset')"
                :placeholder="tr('Use the selected block or reusable item as source', 'Use o bloco selecionado ou item reutilizável como origem')"
                @update:model-value="emit('update:authoredBlockPresetNameDraft', String($event ?? ''))"
              />
              <q-input
                :model-value="authoredBlockPresetDescriptionDraft"
                outlined
                dense
                :label="tr('Preset description', 'Descrição do preset')"
                :placeholder="tr('Optional preset description', 'Descrição opcional do preset')"
                @update:model-value="emit('update:authoredBlockPresetDescriptionDraft', String($event ?? ''))"
              />
              <q-select
                :model-value="selectedAuthoredBlockPresetId"
                outlined
                dense
                emit-value
                map-options
                popup-content-class="cms-blocks-module-surface__popup"
                :options="cmsAuthoredBlockPresetOptions"
                :label="tr('Preset library', 'Biblioteca de presets')"
                @update:model-value="emit('update:selectedAuthoredBlockPresetId', String($event ?? '') as CmsBlockPresetId)"
              />
              <q-select
                :model-value="authoredPresetStarterSectionSelections"
                outlined
                dense
                emit-value
                map-options
                multiple
                use-chips
                popup-content-class="cms-blocks-module-surface__popup"
                :options="cmsPresetStarterSectionOptions"
                :label="tr('Starter sections', 'Seções iniciais')"
                @update:model-value="emit('update:authoredPresetStarterSectionSelections', $event as CmsSectionPresetId[])"
              />
              <q-btn
                flat
                dense
                no-caps
                icon="style"
                :label="tr('Save as preset', 'Salvar como preset')"
                :disable="!activeBlocksSelectedBlockRecord && !selectedReusableBlockId"
                @click="saveCmsPresetFromCurrentSelection()"
              />
              <q-btn
                flat
                dense
                no-caps
                icon="save"
                :label="tr('Update preset', 'Atualizar preset')"
                :disable="selectedAuthoredBlockPresetId === 'custom'"
                @click="updateSelectedCmsPreset()"
              />
              <q-btn
                no-caps
                unelevated
                icon="auto_fix_high"
                :label="tr('Apply preset', 'Aplicar preset')"
                :style="primaryActionStyle"
                :disable="selectedAuthoredBlockPresetId === 'custom' || !activeBlocksSelectedBlockRecord || activeBlocksSelectionReadOnly"
                @click="applySelectedCmsPresetToBlock()"
              />
            </div>

            <div class="cms-blocks-library">
              <div class="cms-blocks-library__header">
                <strong>{{ tr('Reusable block library', 'Biblioteca de blocos reutilizáveis') }}</strong>
                <div class="cms-blocks-library__header-actions">
                  <q-toggle
                    :model-value="showArchivedReusableBlocks"
                    dense
                    :label="tr('Show archived', 'Mostrar arquivados')"
                    @update:model-value="emit('update:showArchivedReusableBlocks', Boolean($event))"
                  />
                  <q-chip dense square :style="statusChipStyle">
                    {{ filteredCmsReusableBlockLibrary.length }}/{{ settings.reusableBlocks.length }}
                  </q-chip>
                </div>
              </div>

              <div v-if="filteredCmsReusableBlockLibrary.length === 0" class="cms-block-item__empty">
                <strong>{{ tr('No reusable blocks saved yet.', 'Nenhum bloco reutilizável salvo ainda.') }}</strong>
                <small>
                  {{
                    hasCmsBuilderSearch
                      ? tr('No reusable block matched the current search.', 'Nenhum bloco reutilizável corresponde à busca atual.')
                      : tr(
                        'Select one authored block and use "Save selection" to build your first reusable library item.',
                        'Selecione um bloco authored e use "Salvar seleção" para criar o primeiro item reutilizável da biblioteca.'
                      )
                  }}
                </small>
              </div>

              <div
                v-for="reusableBlock in pagedCmsReusableBlockLibrary"
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
                        (block: any) => block.name
                      )
                        ? `${tr('Deprecated -> replacement', 'Descontinuado -> substituto')}: ${getCmsReplacementLabel(
                          reusableBlock.replacementEntityId,
                          settings.reusableBlocks,
                          (block: any) => block.name
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
                    popup-content-class="cms-blocks-module-surface__popup"
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
                    @click="emit('update:selectedReusableBlockId', reusableBlock.id)"
                  />
                  <q-btn
                    v-if="isCmsDeprecatedEntity(reusableBlock) && reusableBlock.replacementEntityId"
                    flat
                    dense
                    no-caps
                    icon="swap_horiz"
                    :label="tr('Use replacement', 'Usar substituto')"
                    @click="emit('update:selectedReusableBlockId', String(reusableBlock.replacementEntityId ?? ''))"
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
                    :aria-label="tr('Inspect reusable block usage', 'Inspecionar uso do bloco reutilizável')"
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

              <div class="cms-blocks-library">
                <div class="cms-blocks-library__header">
                  <strong>{{ tr('Authored preset library', 'Biblioteca de presets authored') }}</strong>
                  <div class="cms-blocks-library__header-actions">
                    <q-toggle
                      :model-value="showArchivedAuthoredBlockPresets"
                      dense
                      :label="tr('Show archived', 'Mostrar arquivados')"
                      @update:model-value="emit('update:showArchivedAuthoredBlockPresets', Boolean($event))"
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
                          'Começe por um bloco selecionado ou item reutilizável e depois salve como preset para autoria repetível.'
                        )
                    }}
                  </small>
                </div>

                <div
                  v-for="preset in pagedCmsAuthoredBlockPresetLibrary"
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
                          (authoredPreset: any) => getCmsAuthoredBlockPresetNameValue(authoredPreset)
                        )
                          ? `${tr('Deprecated -> replacement', 'Descontinuado -> substituto')}: ${getCmsReplacementLabel(
                            preset.replacementEntityId,
                            settings.authoredBlockPresets,
                            (authoredPreset: any) => getCmsAuthoredBlockPresetNameValue(authoredPreset)
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
                      popup-content-class="cms-blocks-module-surface__popup"
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
                <strong>{{ tr('This page does not have sections yet.', 'Esta página ainda não possui seções.') }}</strong>
                <small>
                  {{
                    tr(
                      'Open Pages and apply the content-model scaffold or add your first section before editing blocks.',
                      'Abra Páginas e aplique o scaffold do modelo de conteúdo ou adicione a primeira seção antes de editar blocos.'
                    )
                  }}
                </small>
                <div class="cms-empty-state__actions">
                  <q-btn flat dense no-caps icon="web_asset" :label="tr('Open pages', 'Abrir páginas')" @click="openPagesModule()" />
                </div>
              </div>
              <div v-else-if="hasCmsBuilderSearch && filteredActiveBlocksSections.length === 0" class="cms-block-item__empty cms-block-item__empty--card">
                <strong>{{ tr('No sections matched the current search.', 'Nenhuma seção corresponde à busca atual.') }}</strong>
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
                      {{ tr('Linked section - detach in Pages to edit blocks.', 'Seção vinculada - desvincule em Páginas para editar blocos.') }}
                    </small>
                  </div>

                  <div v-if="section.blocks.length === 0" class="cms-block-item__empty">
                    <strong>{{ tr('No blocks in this section yet.', 'Ainda não existem blocos nesta seção.') }}</strong>
                    <small>
                      {{
                        tr(
                          'Focus this section, choose a compatible palette block and add it, or insert one reusable block.',
                          'Foque esta seção, escolha um bloco compatível da paleta e adicione-o, ou insira um bloco reutilizável.'
                        )
                      }}
                    </small>
                    <div class="cms-empty-state__actions">
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="ads_click"
                        :label="tr('Focus section', 'Focar seção')"
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
                        @click="addCmsBuilderBlockFromPalette()"
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
                    @dragend="onCmsBuilderBlockDragEnd()"
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
                <CmsAuthoringPanelHeader
                  :title="tr('Selection rail', 'Rail da seleção')"
                  :description="tr('Bulk operations stay attached to the current section contract without repeating top-bar actions.', 'Operações em lote ficam anexadas ao contrato da seção atual sem repetir as ações da barra superior.')"
                />
                <CmsAuthoringMetricsList :items="cmsBlocksRailMetrics" />
              </div>
              <div class="cms-designer-card__rail-actions">
                <q-btn round flat icon="done_all" :disable="!canToggleActiveSectionBlocks" :aria-label="tr('Enable all blocks', 'Ativar todos os blocos')" @click="setCmsBuilderSectionBlocksEnabled(true)">
                  <q-tooltip class="cms-blocks-module-surface__tooltip">{{ tr('Enable all blocks', 'Ativar todos os blocos') }}</q-tooltip>
                </q-btn>
                <q-btn round flat icon="remove_done" :disable="!canToggleActiveSectionBlocks" :aria-label="tr('Disable all blocks', 'Desativar todos os blocos')" @click="setCmsBuilderSectionBlocksEnabled(false)">
                  <q-tooltip class="cms-blocks-module-surface__tooltip">{{ tr('Disable all blocks', 'Desativar todos os blocos') }}</q-tooltip>
                </q-btn>
                <q-btn round flat icon="auto_fix_off" :disable="!canRemoveDisabledBlocksFromActiveSection" :aria-label="tr('Remove disabled blocks', 'Remover blocos desativados')" @click="removeDisabledBlocksFromActiveSection()">
                  <q-tooltip class="cms-blocks-module-surface__tooltip">{{ tr('Remove disabled blocks', 'Remover blocos desativados') }}</q-tooltip>
                </q-btn>
              </div>
            </aside>
          </div>
        </div>
      </template>
      <template #status>
        <CmsAuthoringStatusBar
          class-name="cms-blocks__statusbar"
          :items="cmsBlocksStatusItems"
        />
      </template>
    </CmsAuthoringWorkbench>

    <CmsShellCard
      v-if="cmsBlocksWorkspaceView === 'preview' || cmsDesignerPreviewMode"
      :title="tr('Blocks preview', 'Preview de blocos')"
      body-class="cms-blocks__preview"
    >
      <template #header-actions>
        <q-btn
          flat
          dense
          no-caps
          icon="open_in_new"
          :label="tr('Open in new window', 'Abrir em nova janela')"
          @click="openBlocksPreviewInWindow()"
        />
      </template>
      <CmsPreviewToolbar
        v-model:source="cmsPreviewSourceModel"
        v-model:locale="cmsPreviewLocaleModel"
        v-model:viewport="cmsPreviewViewportModel"
        :source-options="cmsPreviewSourceOptions"
        :locale-options="cmsLocaleOptions"
        :viewport-options="cmsPreviewViewportOptions"
        :published-release-label="cmsPreviewPublishedReleaseLabel"
        :status-chip-style="statusChipStyle"
        :is-pt-br="isPtBrLocale"
      />

      <div class="cms-blocks-summary-grid">
        <div class="cms-blocks-summary-card">
          <span>{{ tr('Total pages', 'Total de páginas') }}</span>
          <strong>{{ cmsPreviewPages.length }}</strong>
        </div>
        <div class="cms-blocks-summary-card">
          <span>{{ tr('Published pages', 'Páginas publicadas') }}</span>
          <strong>{{ cmsPreviewPublishedPagesCount }}</strong>
        </div>
        <div class="cms-blocks-summary-card">
          <span>{{ tr('Enabled sections', 'Seções ativadas') }}</span>
          <strong>{{ cmsPreviewEnabledSectionsCount }}</strong>
        </div>
        <div class="cms-blocks-summary-card">
          <span>{{ tr('Enabled blocks', 'Blocos ativados') }}</span>
          <strong>{{ cmsPreviewEnabledBlocksCount }}</strong>
        </div>
      </div>

      <div v-if="cmsPreviewDraftPublishedDiff" class="cms-review-summary">
        <CmsSectionHeaderSummary
          :title="tr('Draft vs published review', 'Revisão rascunho vs publicado')"
          container-class="cms-review-summary__header"
          summary-class="cms-page-preview__chips"
        >
          <template #summary>
            <q-chip
              dense
              square
              :style="cmsPreviewDraftPublishedDiff.hasChanges ? getCmsPreviewDiffStatusStyle('changed') : getCmsPreviewDiffStatusStyle('unchanged')"
            >
              {{
                cmsPreviewDraftPublishedDiff.hasChanges
                  ? tr('Changes detected', 'Mudanças detectadas')
                  : tr('No changes against published', 'Sem mudanças contra o publicado')
              }}
            </q-chip>
          </template>
        </CmsSectionHeaderSummary>
        <div class="cms-blocks-summary-grid">
          <div class="cms-blocks-summary-card">
            <span>{{ tr('Page changes', 'Mudanças na página') }}</span>
            <strong>{{ activeBlocksPageDiff ? getCmsPreviewDiffChangeCount(activeBlocksPageDiff.sectionSummary) + getCmsPreviewDiffChangeCount(activeBlocksPageDiff.blockSummary) + (activeBlocksPageDiff.status === 'changed' || activeBlocksPageDiff.status === 'added' || activeBlocksPageDiff.status === 'removed' ? 1 : 0) : 0 }}</strong>
          </div>
          <div class="cms-blocks-summary-card">
            <span>{{ tr('Section changes', 'Mudanças na seção') }}</span>
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
                    `${activeBlocksPageDiff.sectionSummary.added} seções adicionadas · ${activeBlocksPageDiff.sectionSummary.removed} removidas · ${activeBlocksPageDiff.sectionSummary.changed} alteradas`
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

      <CmsLocaleCoverageMatrix
        :matrix="cmsPreviewLocaleCoverageMatrix"
        :active-locale="cmsPreviewLocale"
        :active-locale-coverage="cmsPreviewActiveLocaleCoverage"
        :categories="cmsLocaleCoverageCategories"
        :status-chip-style="statusChipStyle"
        :get-status-style="getCmsLocaleCoverageStatusStyle"
        :get-summary-label="getCmsLocaleCoverageSummaryLabel"
        :get-status-label="getCmsLocaleCoverageStatusLabel"
        :get-category-label="getCmsLocaleCoverageCategoryLabel"
        :get-locale-label="getCmsLocaleCoverageLocaleLabel"
        :is-pt-br="isPtBrLocale"
      />

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

      <CmsDiagnosticsListSection
        :title="tr('Content diagnostics', 'Diagnósticos de conteúdo')"
        :items="toCmsDiagnosticsListItems(activeBlocksContentDiagnostics)"
        :count-style="statusChipStyle"
      />

      <CmsDiagnosticsListSection
        :title="tr('Media diagnostics', 'Diagnosticos de midia')"
        :items="toCmsDiagnosticsListItems(activeBlocksMediaDiagnostics)"
        :count-style="statusChipStyle"
      />

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
              ? tr('This section is linked to the reusable library. Detach the section in Pages before editing its blocks.', 'Esta seção está vinculada à biblioteca reutilizável. Desvincule a seção em Páginas antes de editar seus blocos.')
              : tr('This block is linked to the reusable library. Detach it before editing props.', 'Este bloco está vinculado à biblioteca reutilizável. Desvincule-o antes de editar props.')
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
              popup-content-class="cms-blocks-module-surface__popup"
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
          :model-value="activeBlocksPropsDraft"
          outlined
          dense
          type="textarea"
          autogrow
          :label="tr('Block props JSON', 'JSON de props do bloco')"
          :disable="!activeBlocksSelectedBlock || activeBlocksSelectionReadOnly"
          @update:model-value="emit('update:activeBlocksPropsDraft', String($event ?? ''))"
        />
        <div class="cms-blocks-props__actions">
          <q-btn
            flat
            dense
            no-caps
            icon="format_align_left"
            :label="tr('Format JSON', 'Formatar JSON')"
            :disable="!activeBlocksSelectedBlock || activeBlocksSelectionReadOnly"
            @click="formatSelectedBlockPropsDraft()"
          />
          <q-btn
            no-caps
            unelevated
            icon="save"
            :label="tr('Apply props', 'Aplicar props')"
            :style="primaryActionStyle"
            :disable="!activeBlocksSelectedBlock || activeBlocksSelectionReadOnly"
            @click="applySelectedBlockPropsDraft()"
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
        <p v-else>{{ tr('No page selected for preview.', 'Nenhuma página selecionada para preview.') }}</p>
      </div>
    </CmsShellCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
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
  CmsPreviewSectionDiffSummary,
  CmsPreviewBlockDiffSummary,
} from '../../../../../modules/cms/white-label/preview-diff'
import type { CmsBlockPresetOption } from '../../../../../modules/cms/white-label/block-presets'
import type { CmsSectionPresetOption } from '../../../../../modules/cms/white-label/content-models'
import type { CmsBlockFieldDefinition } from '../../../../../modules/cms/presets/landing'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsBlockPresetId,
  CmsLocale,
  CmsPageBlockSettings,
  CmsPageSectionSettings,
  CmsPreviewSource,
  CmsPreviewViewport,
  CmsReusableBlockSettings,
  CmsReusableReferenceMode,
  CmsSectionPresetId,
  CmsWhiteLabelSettings,
} from '../../../../../modules/cms/white-label/types'
import CmsAuthoringMetricsList, { type CmsAuthoringMetricItem } from '../CmsAuthoringMetricsList.vue'
import CmsAuthoringPanelHeader from '../CmsAuthoringPanelHeader.vue'
import CmsAuthoringRulerBar from '../CmsAuthoringRulerBar.vue'
import CmsAuthoringStatusBar, { type CmsAuthoringStatusItem } from '../CmsAuthoringStatusBar.vue'
import CmsAuthoringToolbar, { type CmsAuthoringToolbarInfoItem } from '../CmsAuthoringToolbar.vue'
import CmsAuthoringWorkbench from '../CmsAuthoringWorkbench.vue'
import CmsDiagnosticsListSection, { type CmsDiagnosticsListItem } from '../CmsDiagnosticsListSection.vue'
import CmsLocaleCoverageMatrix from '../CmsLocaleCoverageMatrix.vue'
import CmsMediaAssetPicker from '../CmsMediaAssetPicker.vue'
import CmsPreviewToolbar from '../CmsPreviewToolbar.vue'
import CmsSectionHeaderSummary from '../CmsSectionHeaderSummary.vue'
import CmsShellCard from '../CmsShellCard.vue'
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

interface CmsMediaPickerUiText {
  anyKindLabel: string
  selectedAssetLabel: string
  selectedAssetsLabel: string
  noSelectionLabel: string
  noOptionLabel: string
  incompatibleLabel: string
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
  blockIndex: number
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

interface CmsDraggedBlock {
  pageId: string
  sectionId: string
  blockId: string
}

const props = defineProps<{
  settings: CmsWhiteLabelSettings
  cmsUiText: { saveLabel: string; saveAriaLabel: string }
  cmsBlocksWorkspaceTabValue: string
  cmsWorkspaceTabOptions: CmsWorkspaceTabOption[]
  cmsBlocksWorkspaceView: 'editor' | 'preview'
  cmsDesignerPreviewMode: boolean
  cmsBlocksToolbarInfoItems: CmsAuthoringToolbarInfoItem[]
  canUndoCmsAuthoringHistory: boolean
  canRedoCmsAuthoringHistory: boolean
  cmsDesignerRulerMarks: number[]
  showCmsDesignerStageGrid: boolean
  cmsSectionBlocks: CmsSectionBlockRecord[]
  cmsBlocksSidebarMetrics: CmsAuthoringMetricItem[]
  cmsBlocksRailMetrics: CmsAuthoringMetricItem[]
  cmsBlocksStatusItems: CmsAuthoringStatusItem[]
  selectedBuilderCommandId: string
  cmsBuilderCommandOptions: CmsBuilderCommandOption[]
  selectedCmsBuilderCommandOption: CmsBuilderCommandOption | null
  activeBlocksPageId: string
  blocksPageOptions: CmsSelectOption[]
  activeBlocksSectionId: string
  blocksSectionOptions: CmsSelectOption[]
  activeBlocksBlockId: string
  activeBlocksBlockOptions: CmsSelectOption[]
  selectedPaletteBlockType: string
  cmsBlockPaletteOptions: CmsSelectOption[]
  selectedPaletteBlockPresetId: CmsBlockPresetId
  cmsBlockPresetOptions: CmsBlockPresetOption[]
  canAddPaletteBlockToActiveSection: boolean
  activeBlocksSectionContractSummary: string
  activeBlocksSection: CmsPageSectionSettings | null
  activeBlocksSectionIsLinked: boolean
  activeBlocksSections: CmsBlocksSectionRow[]
  filteredActiveBlocksSections: CmsBlocksSectionRow[]
  canToggleActiveSectionBlocks: boolean
  canRemoveDisabledBlocksFromActiveSection: boolean
  blockDropTargetKey: string
  draggedBlock: CmsDraggedBlock | null
  reusableBlockNameDraft: string
  reusableBlockDescriptionDraft: string
  selectedReusableBlockId: string
  cmsReusableBlockOptions: CmsSelectOption[]
  filteredCmsReusableBlockLibrary: CmsReusableBlockSettings[]
  pagedCmsReusableBlockLibrary: CmsReusableBlockSettings[]
  hasCmsBuilderSearch: boolean
  authoredBlockPresetNameDraft: string
  authoredBlockPresetDescriptionDraft: string
  selectedAuthoredBlockPresetId: CmsBlockPresetId
  cmsAuthoredBlockPresetOptions: CmsSelectOption[]
  authoredPresetStarterSectionSelections: CmsSectionPresetId[]
  cmsPresetStarterSectionOptions: CmsSectionPresetOption[]
  showArchivedReusableBlocks: boolean
  showArchivedAuthoredBlockPresets: boolean
  filteredCmsAuthoredBlockPresetLibrary: CmsAuthoredBlockPresetSettings[]
  pagedCmsAuthoredBlockPresetLibrary: CmsAuthoredBlockPresetSettings[]
  activeBlocksPropsDraft: string
  activeBlocksSelectedBlock: CmsPageBlockSettings | null
  activeBlocksSelectedBlockRecord: CmsSectionBlockRecord | null
  activeBlocksSelectionReadOnly: boolean
  activeBlocksFieldDefinitions: CmsBlockFieldDefinition[]
  activeBlocksSchema: CmsPageSchema | null
  activeBlocksPreviewMissingFromPublished: boolean
  activeBlocksPageDiff: CmsPreviewPageDiffSummary | null
  activeBlocksSectionDiff: CmsPreviewSectionDiffSummary | null
  activeBlocksBlockDiff: CmsPreviewBlockDiffSummary | null
  activeBlocksContentDiagnostics: CmsContentValidationIssue[]
  activeBlocksMediaDiagnostics: any[]
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
  cmsPreviewLocaleCoverageMatrix: CmsLocaleCoverageSummary[]
  cmsPreviewActiveLocaleCoverage: CmsLocaleCoverageSummary | null
  cmsLocaleCoverageCategories: CmsLocaleCoverageCategory[]
  cmsPreviewPages: unknown[]
  cmsPreviewPublishedPagesCount: number
  cmsPreviewEnabledSectionsCount: number
  cmsPreviewEnabledBlocksCount: number
  landingRegistry: CmsBlockRegistry
  cmsPreviewRenderContext: CmsRecord
  statusChipStyle: Record<string, string>
  primaryActionStyle: Record<string, string>
  warningActionStyle: Record<string, string>
  dangerActionStyle: Record<string, string>
  bannerStyle: Record<string, string>
  tr: (en: string, pt: string) => string
  cmsMediaPickerUiText: CmsMediaPickerUiText
  focusWorkbench: Function
  saveNow: Function
  undoCmsAuthoringChange: Function
  redoCmsAuthoringChange: Function
  showBlocksPreview: Function
  toggleCmsDesignerStageGrid: Function
  executeSelectedBuilderCommand: Function
  addCmsBuilderBlockFromPalette: Function
  setCmsBuilderSectionBlocksEnabled: Function
  removeDisabledBlocksFromActiveSection: Function
  saveSelectedBlockAsReusable: Function
  insertSelectedReusableBlock: Function
  insertSelectedLinkedReusableBlock: Function
  saveCmsPresetFromCurrentSelection: Function
  updateSelectedCmsPreset: Function
  applySelectedCmsPresetToBlock: Function
  selectCmsAuthoredPreset: Function
  selectCmsReplacementAuthoredPreset: Function
  openPagesModule: Function
  setActiveBlocksSelection: Function
  onCmsBuilderBlockDragStart: Function
  onCmsBuilderBlockDragEnd: Function
  onCmsBuilderBlockDragOver: Function
  onCmsBuilderSectionDrop: Function
  onCmsBuilderBlockDrop: Function
  updateCmsBuilderBlockEnabled: Function
  detachCmsBuilderBlockByRecord: Function
  branchCmsBuilderBlockToVariant: Function
  duplicateCmsBuilderBlockByRecord: Function
  moveCmsBuilderBlockByRecord: Function
  removeCmsBuilderBlockByRecord: Function
  formatSelectedBlockPropsDraft: Function
  applySelectedBlockPropsDraft: Function
  getActiveBlocksFieldModelValue: Function
  updateActiveBlocksFieldValue: Function
  getActiveBlocksMediaFieldOptions: Function
  updateActiveBlocksJsonFieldDraft: Function
  applyActiveBlocksJsonFieldValue: Function
  getActiveBlocksNumberFieldModelValue: Function
  getActiveCmsAuthoringLocale: Function
  getCmsBlockPresetLabel: Function
  resolveCmsBlockDisplayName: Function
  getCmsReusableBlockUsageCount: Function
  getCmsReusableBlockUsageSummaryLabel: Function
  isCmsArchivedEntity: Function
  isCmsDeprecatedEntity: Function
  isCmsReusableBlockVariant: Function
  getCmsReusableBlockVariantLabel: Function
  getCmsReplacementLabel: Function
  getCmsReplacementAssistantSummaryLabel: Function
  getCmsReplacementAssistantSummary: Function
  getCmsReusableBlockReplacementOptions: Function
  updateReusableBlockReplacement: Function
  updateReusableBlockDeprecationNote: Function
  createReusableBlockVariant: Function
  applyCmsDeprecatedReplacement: Function
  openCmsUsageDrawer: Function
  undeprecateReusableBlock: Function
  deprecateReusableBlock: Function
  unarchiveReusableBlock: Function
  archiveReusableBlock: Function
  getCmsAuthoredBlockPresetNameValue: Function
  getCmsAuthoredBlockPresetDescriptionValue: Function
  getCmsAuthoredBlockPresetUsageCount: Function
  getCmsAuthoredBlockPresetUsageSummaryLabel: Function
  getCmsAuthoredPresetStarterSectionsLabel: Function
  getCmsAuthoredBlockPresetReplacementOptions: Function
  updateCmsAuthoredPresetReplacement: Function
  updateCmsAuthoredPresetDeprecationNote: Function
  undeprecateCmsAuthoredPreset: Function
  deprecateCmsAuthoredPreset: Function
  unarchiveCmsAuthoredPreset: Function
  archiveCmsAuthoredPreset: Function
  getCmsSectionFieldDefinitions: Function
  getCmsSectionFieldGroups: Function
  getCmsSectionCustomFieldValue: Function
  formatCmsJsonFieldValue: Function
  normalizeCmsMediaPickerModelValue: Function
  getCmsPageCustomFieldMediaOptions: Function
  getCmsMediaAllowedKindLabels: Function
  getCmsPageCustomFieldReferenceOptions: Function
  formatCmsRepeatableFieldValue: Function
  getCmsContentModelFieldHint: Function
  getCmsContentModelFieldHtmlInputType: Function
  updateCmsSectionCustomFieldValue: Function
  getCmsReusableSourceLabel: Function
  getCmsPageSectionStyle: (enabled: boolean) => CSSProperties
  openBlocksPreviewInWindow: Function
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
  toCmsDiagnosticsListItems: (issues: CmsContentValidationIssue[]) => CmsDiagnosticsListItem[]
}>()

const emit = defineEmits<{
  'update:cmsBlocksWorkspaceTabValue': [value: string]
  'update:selectedBuilderCommandId': [value: string]
  'update:activeBlocksPageId': [value: string]
  'update:activeBlocksSectionId': [value: string]
  'update:activeBlocksBlockId': [value: string]
  'update:selectedPaletteBlockType': [value: string]
  'update:selectedPaletteBlockPresetId': [value: CmsBlockPresetId]
  'update:reusableBlockNameDraft': [value: string]
  'update:reusableBlockDescriptionDraft': [value: string]
  'update:selectedReusableBlockId': [value: string]
  'update:showArchivedReusableBlocks': [value: boolean]
  'update:authoredBlockPresetNameDraft': [value: string]
  'update:authoredBlockPresetDescriptionDraft': [value: string]
  'update:selectedAuthoredBlockPresetId': [value: CmsBlockPresetId]
  'update:authoredPresetStarterSectionSelections': [value: CmsSectionPresetId[]]
  'update:showArchivedAuthoredBlockPresets': [value: boolean]
  'update:activeBlocksPropsDraft': [value: string]
  'update:cmsPreviewSource': [value: CmsPreviewSource]
  'update:cmsPreviewLocale': [value: CmsLocale]
  'update:cmsPreviewViewport': [value: CmsPreviewViewport]
}>()

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
</script>