<template>
  <div class="cms-shell-page__grid">
    <CmsShellCard
      :title="mediaSettingsTitle"
      body-class="cms-media__editor"
    >
      <template #header-actions>
        <q-chip
          dense
          square
          :style="statusChipStyle"
        >
          {{ assetCount }}
        </q-chip>
      </template>

      <div class="cms-form-grid">
        <q-select
          :model-value="selectedMediaAssetId"
          outlined
          dense
          emit-value
          map-options
          :options="mediaAssetOptions"
          :label="t('Media library asset', 'Asset da biblioteca de mídia')"
          :hint="t('Select an asset to edit it or start a blank draft.', 'Selecione um asset para editar ou inicie um rascunho em branco.')"
          popup-content-class="cms-media-module-surface__popup"
          @update:model-value="emit('update:selectedMediaAssetId', String($event ?? ''))"
        />
        <q-select
          :model-value="mediaAssetDraft.kind"
          outlined
          dense
          emit-value
          map-options
          :options="mediaAssetKindOptions"
          :label="t('Asset kind', 'Tipo do asset')"
          popup-content-class="cms-media-module-surface__popup"
          @update:model-value="updateDraft({ kind: normalizeKind($event) })"
        />
        <q-input
          :model-value="mediaAssetDraft.name"
          outlined
          dense
          :label="t('Asset name', 'Nome do asset')"
          @update:model-value="updateDraft({ name: String($event ?? '') })"
        />
        <q-input
          :model-value="mediaAssetDraft.alt"
          outlined
          dense
          :label="t('Asset alt text', 'Texto alternativo do asset')"
          @update:model-value="updateDraft({ alt: String($event ?? '') })"
        />
        <q-input
          :model-value="mediaAssetDraft.url"
          outlined
          dense
          :label="t('Asset URL', 'URL do asset')"
          @update:model-value="updateDraft({ url: String($event ?? '') })"
        />
        <q-input
          :model-value="mediaAssetDraft.focalPointX"
          outlined
          dense
          type="number"
          min="0"
          max="100"
          :label="t('Focal point X (0-100)', 'Ponto focal X (0-100)')"
          @update:model-value="updateDraft({ focalPointX: String($event ?? '') })"
        />
        <q-input
          :model-value="mediaAssetDraft.focalPointY"
          outlined
          dense
          type="number"
          min="0"
          max="100"
          :label="t('Focal point Y (0-100)', 'Ponto focal Y (0-100)')"
          @update:model-value="updateDraft({ focalPointY: String($event ?? '') })"
        />
        <q-input
          :model-value="mediaAssetDraft.tags"
          outlined
          dense
          :label="t('Tags (comma separated)', 'Tags (separadas por virgula)')"
          @update:model-value="updateDraft({ tags: String($event ?? '') })"
        />
        <q-input
          :model-value="mediaAssetDraft.usage"
          outlined
          dense
          :label="t('Usage tags (comma separated)', 'Tags de uso (separadas por virgula)')"
          @update:model-value="updateDraft({ usage: String($event ?? '') })"
        />
        <q-select
          :model-value="mediaAssetDraft.replaceTargetAssetId"
          outlined
          dense
          emit-value
          map-options
          clearable
          :options="mediaReplacementOptions"
          :label="t('Replace target asset', 'Asset alvo da substituição')"
          :hint="t('Optional. Use with Replace references to swap runtime bindings safely.', 'Opcional. Use com Substituir referências para trocar vínculos de runtime com segurança.')"
          popup-content-class="cms-media-module-surface__popup"
          @update:model-value="updateDraft({ replaceTargetAssetId: String($event ?? '') })"
        />
        <q-input
          :model-value="mediaAssetDraft.description"
          outlined
          dense
          type="textarea"
          autogrow
          :label="t('Asset description', 'Descrição do asset')"
          @update:model-value="updateDraft({ description: String($event ?? '') })"
        />
      </div>

      <div class="cms-media__actions">
        <DsButton
          variant="ghost"
          intent="neutral"
          icon="add_photo_alternate"
          class="cms-media__action"
          :label="t('New asset', 'Novo asset')"
          @click="emit('create-new-asset')"
        />
        <DsButton
          variant="solid"
          intent="primary"
          icon="save"
          class="cms-media__action"
          :label="t('Save asset', 'Salvar asset')"
          @click="emit('save-asset')"
        />
        <DsButton
          variant="ghost"
          intent="danger"
          icon="delete"
          class="cms-media__action"
          :label="t('Delete asset', 'Excluir asset')"
          :disabled="!selectedMediaAssetId"
          @click="emit('remove-selected-asset')"
        />
        <DsButton
          variant="ghost"
          intent="neutral"
          icon="swap_horiz"
          class="cms-media__action"
          :label="t('Replace references', 'Substituir referências')"
          :disabled="!selectedMediaAssetId || !mediaAssetDraft.replaceTargetAssetId"
          @click="emit('replace-selected-asset-references')"
        />
      </div>

      <div class="cms-media__actions cms-media__actions--secondary">
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="branding_watermark"
          class="cms-media__action"
          :label="t('Apply as brand logo', 'Aplicar como logo da marca')"
          :disabled="!selectedMediaAssetId"
          @click="emit('apply-selected-asset-to-branding', 'brandLogo')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="web"
          class="cms-media__action"
          :label="t('Apply as favicon', 'Aplicar como favicon')"
          :disabled="!selectedMediaAssetId"
          @click="emit('apply-selected-asset-to-branding', 'faviconUrl')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="account_circle"
          class="cms-media__action"
          :label="t('Apply as user avatar', 'Aplicar como avatar do usuario')"
          :disabled="!selectedMediaAssetId"
          @click="emit('apply-selected-asset-to-branding', 'userAvatar')"
        />
      </div>
      <q-banner
        rounded
        class="cms-banner"
        :style="bannerStyle"
      >
        {{ t('Media references are tenant-scoped and remain backend-agnostic. Apply any saved asset to branding slots immediately.', 'Referências de mídia são por tenant e continuam desacopladas de backend. Aplique qualquer asset salvo nos slots de branding imediatamente.') }}
      </q-banner>
    </CmsShellCard>

    <CmsShellCard
      :title="t('Media preview', 'Preview de mídia')"
      body-class="cms-media__preview"
    >
      <template #header-actions>
        <q-chip
          v-if="mediaDiagnostics.length > 0"
          dense
          square
          :style="getCmsDiagnosticStyle('warning')"
        >
          {{ mediaDiagnostics.length }} {{ t('diagnostics', 'diagnosticos') }}
        </q-chip>
      </template>

      <CmsDiagnosticsListSection
        :title="t('Library diagnostics', 'Diagnosticos da biblioteca')"
        :items="toDiagnosticsListItems(mediaDiagnostics)"
        :show-count="false"
      />
      <CmsDiagnosticsListSection
        :title="t('Selected asset diagnostics', 'Diagnosticos do asset selecionado')"
        :items="toDiagnosticsListItems(selectedMediaAssetDiagnostics)"
        :show-count="false"
      />

      <article
        v-for="binding in brandingMediaBindings"
        :key="binding.id"
        class="cms-media-preview-item cms-media-preview-item--binding"
      >
        <div class="cms-media-preview-item__meta">
          <strong>{{ binding.label }}</strong>
          <small>{{ binding.description }}</small>
        </div>
        <div class="cms-media-preview-item__tags">
          <q-chip
            dense
            square
            :style="statusChipStyle"
          >
            {{ binding.assetName }}
          </q-chip>
          <q-chip
            v-if="binding.assetId"
            dense
            square
            :style="previewChipStyle"
          >
            {{ binding.assetId }}
          </q-chip>
        </div>
        <code class="cms-media-preview-item__url">{{ binding.url || t('No URL configured', 'Nenhuma URL configurada') }}</code>
      </article>

      <article
        v-for="asset in mediaAssets"
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
          <q-icon
            v-else
            name="image_not_supported"
            class="cms-icon cms-icon--lg"
          />
        </div>
        <div class="cms-media-preview-item__tags">
          <q-chip
            dense
            square
            :style="statusChipStyle"
          >
            {{ getCmsMediaKindLabel(asset.kind) }}
          </q-chip>
          <q-chip
            dense
            square
            :style="previewChipStyle"
          >
            {{ getCmsMediaUsageCount(asset.id) }} {{ t('refs', 'refs') }}
          </q-chip>
          <q-chip
            dense
            square
            :style="previewChipStyle"
          >
            {{ getCmsMediaUsageSummaryLabel(asset.id) }}
          </q-chip>
          <q-chip
            v-if="asset.focalPoint"
            dense
            square
            :style="previewChipStyle"
          >
            FP {{ asset.focalPoint.x }}, {{ asset.focalPoint.y }}
          </q-chip>
          <q-chip
            v-if="asset.replaceTargetAssetId"
            dense
            square
            :style="previewChipStyle"
          >
            {{ t('replaces to', 'substitui para') }} {{ asset.replaceTargetAssetId }}
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
        <code class="cms-media-preview-item__url">{{ asset.url || t('No URL configured', 'Nenhuma URL configurada') }}</code>
      </article>
    </CmsShellCard>
  </div>
</template>

<script setup lang="ts">
import type { CmsDiagnosticsListItem } from '../CmsDiagnosticsListSection.vue'
import CmsDiagnosticsListSection from '../CmsDiagnosticsListSection.vue'
import CmsShellCard from '../CmsShellCard.vue'
import { DsButton } from '../../../../../design-system/vue'
import type { CmsMediaDiagnostic } from '../../../../../modules/cms/white-label/media-library'
import type { CmsMediaAssetKind, CmsMediaAssetSettings } from '../../../../../modules/cms/white-label/types'

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

interface CmsMediaSelectOption {
  label: string
  value: string
}

interface CmsBrandingMediaBindingPreview {
  id: string
  label: string
  description: string
  url: string
  assetName: string
  assetId?: string
}

const props = defineProps<{
  mediaSettingsTitle: string
  assetCount: number
  selectedMediaAssetId: string
  mediaAssetDraft: CmsMediaAssetDraft
  mediaAssetOptions: CmsMediaSelectOption[]
  mediaAssetKindOptions: Array<{ label: string, value: string }>
  mediaReplacementOptions: CmsMediaSelectOption[]
  mediaDiagnostics: CmsMediaDiagnostic[]
  selectedMediaAssetDiagnostics: CmsMediaDiagnostic[]
  brandingMediaBindings: CmsBrandingMediaBindingPreview[]
  mediaAssets: CmsMediaAssetSettings[]
  statusChipStyle: Record<string, string>
  previewChipStyle: Record<string, string>
  bannerStyle: Record<string, string>
  primaryActionStyle: Record<string, string>
  dangerActionStyle: Record<string, string>
  t: (en: string, pt: string) => string
  toDiagnosticsListItems: (diagnostics: CmsMediaDiagnostic[]) => CmsDiagnosticsListItem[]
  getCmsDiagnosticStyle: (severity: CmsMediaDiagnostic['severity']) => Record<string, string>
  getCmsMediaKindLabel: (kind: CmsMediaAssetKind) => string
  isPreviewImageAsset: (url: string) => boolean
  getCmsMediaUsageCount: (assetId: string) => number
  getCmsMediaUsageSummaryLabel: (assetId: string) => string
  getCmsMediaDiagnosticsForAsset: (assetId: string) => CmsMediaDiagnostic[]
}>()

const emit = defineEmits<{
  'update:selectedMediaAssetId': [value: string]
  'update:mediaAssetDraft': [value: CmsMediaAssetDraft]
  'create-new-asset': []
  'save-asset': []
  'remove-selected-asset': []
  'replace-selected-asset-references': []
  'apply-selected-asset-to-branding': [slot: 'brandLogo' | 'faviconUrl' | 'userAvatar']
}>()

function normalizeKind(value: unknown): CmsMediaAssetKind {
  return String(value ?? 'image') as CmsMediaAssetKind
}

function updateDraft(patch: Partial<CmsMediaAssetDraft>): void {
  emit('update:mediaAssetDraft', {
    ...props.mediaAssetDraft,
    ...patch,
  })
}
</script>