<template>
  <div class="cms-media-asset-picker">
    <q-select
      :model-value="modelValue"
      outlined
      dense
      use-input
      input-debounce="0"
      emit-value
      map-options
      use-chips
      :multiple="multiple"
      :clearable="clearable"
      :disable="disable"
      :label="label"
      :hint="hint"
      :options="options"
      option-label="label"
      option-value="value"
      class="cms-media-asset-picker__select"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #option="scope">
        <q-item v-bind="scope.itemProps" :disable="Boolean(scope.opt.disable)" class="cms-media-asset-picker__option">
          <q-item-section avatar>
            <div class="cms-media-asset-picker__option-visual">
              <img
                v-if="showsImagePreview(scope.opt)"
                :src="scope.opt.url"
                :alt="scope.opt.alt || scope.opt.label"
              >
              <q-icon v-else :name="getKindIcon(scope.opt.kind)" size="18px" />
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
            <q-item-label caption>{{ scope.opt.description || noSelectionLabel }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="cms-media-asset-picker__option-badges">
              <q-chip dense square>
                {{ scope.opt.kindLabel }}
              </q-chip>
              <q-chip v-if="scope.opt.incompatible" dense square color="negative" text-color="white">
                {{ incompatibleLabel }}
              </q-chip>
            </div>
          </q-item-section>
        </q-item>
      </template>

      <template #no-option>
        <q-item>
          <q-item-section class="text-grey-7">
            {{ noOptionLabel }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <div class="cms-media-asset-picker__meta">
      <span>{{ allowedKindsCaption }}</span>
    </div>

    <div v-if="selectedOptions.length > 0" class="cms-media-asset-picker__selections">
      <strong>{{ selectedPreviewLabel }}</strong>
      <div class="cms-media-asset-picker__selection-grid">
        <article
          v-for="option in selectedOptions"
          :key="option.value"
          class="cms-media-asset-picker__selection"
        >
          <div class="cms-media-asset-picker__selection-visual">
            <img
              v-if="showsImagePreview(option)"
              :src="option.url"
              :alt="option.alt || option.label"
            >
            <q-icon v-else :name="getKindIcon(option.kind)" size="22px" />
          </div>
          <div class="cms-media-asset-picker__selection-body">
            <strong>{{ option.label }}</strong>
            <small>{{ option.description || noSelectionLabel }}</small>
            <div class="cms-media-asset-picker__option-badges">
              <q-chip dense square>{{ option.kindLabel }}</q-chip>
            </div>
            <code class="cms-media-asset-picker__selection-url">{{ option.url || noSelectionLabel }}</code>
          </div>
        </article>
      </div>
    </div>
    <div v-else class="cms-media-asset-picker__empty">
      {{ noSelectionLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Reusable CMS media asset picker with previews and compatibility feedback.
 */
import { computed, type PropType } from 'vue'
import type { CmsMediaAssetKind } from '../../src/modules/cms/white-label/types'
import {
  resolveCmsMediaPickerSelectedOptions,
  type CmsMediaPickerOption,
} from '../../src/modules/cms/white-label/media-picker'

const props = defineProps({
  modelValue: {
    type: [String, Array] as PropType<string | string[] | null>,
    default: null,
  },
  options: {
    type: Array as PropType<CmsMediaPickerOption[]>,
    default: () => [],
  },
  label: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  allowedKindLabels: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  anyKindLabel: {
    type: String,
    default: 'Any media kind',
  },
  selectedPreviewLabel: {
    type: String,
    default: 'Selected assets',
  },
  noSelectionLabel: {
    type: String,
    default: 'No asset selected yet.',
  },
  incompatibleLabel: {
    type: String,
    default: 'Not allowed for this field',
  },
  noOptionLabel: {
    type: String,
    default: 'No media assets available.',
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
}>()

const selectedOptions = computed(() => resolveCmsMediaPickerSelectedOptions(props.options, props.modelValue))

const allowedKindsCaption = computed(() =>
  props.allowedKindLabels.length > 0
    ? props.allowedKindLabels.join(', ')
    : props.anyKindLabel
)

function showsImagePreview(option: CmsMediaPickerOption): boolean {
  return (option.kind === 'image' || option.kind === 'icon') && option.url.trim().length > 0
}

function getKindIcon(kind: CmsMediaAssetKind): string {
  switch (kind) {
    case 'image':
      return 'image'
    case 'video':
      return 'movie'
    case 'icon':
      return 'apps'
    case 'document':
      return 'description'
    default:
      return 'attach_file'
  }
}
</script>

<style scoped>
.cms-media-asset-picker {
  display: grid;
  gap: 0.75rem;
}

.cms-media-asset-picker__meta,
.cms-media-asset-picker__empty {
  color: #6b7280;
  font-size: 0.82rem;
}

.cms-media-asset-picker__option {
  align-items: flex-start;
}

.cms-media-asset-picker__option-visual,
.cms-media-asset-picker__selection-visual {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cms-media-asset-picker__option-visual img,
.cms-media-asset-picker__selection-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cms-media-asset-picker__option-badges {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.cms-media-asset-picker__selections {
  display: grid;
  gap: 0.5rem;
}

.cms-media-asset-picker__selection-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.cms-media-asset-picker__selection {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.03);
}

.cms-media-asset-picker__selection-body {
  min-width: 0;
  display: grid;
  gap: 0.35rem;
}

.cms-media-asset-picker__selection-body small {
  color: #6b7280;
}

.cms-media-asset-picker__selection-url {
  display: block;
  overflow-wrap: anywhere;
  padding: 0.35rem 0.5rem;
  border-radius: 0.65rem;
  background: rgba(15, 23, 42, 0.06);
  font-size: 0.74rem;
}
</style>