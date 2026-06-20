<template>
  <q-dialog
    :model-value="modelValue"
    position="right"
    class="cms-usage-drawer-dialog"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <section class="cms-usage-drawer">
      <div class="cms-usage-drawer__header">
        <div>
          <strong>{{ headerLabel }}</strong>
          <small>{{ title || detailsLabel }}</small>
        </div>
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="close"
          class="cms-usage-drawer__close"
          :aria-label="closeLabel"
          @click="$emit('update:modelValue', false)"
        />
      </div>
      <hr class="cms-native-separator" aria-hidden="true">
      <div class="cms-usage-drawer__body">
        <p v-if="subtitle" class="cms-preview-content-text">
          {{ subtitle }}
        </p>
        <div class="cms-usage-drawer__summary">
          <q-chip dense square :style="statusChipStyle">
            {{ referenceCount }} {{ refsLabel }}
          </q-chip>
          <small>{{ summaryLabel }}</small>
        </div>
        <div v-if="references.length === 0" class="cms-block-item__empty">
          <strong>{{ emptyTitle }}</strong>
          <small>{{ emptyDescription }}</small>
        </div>
        <div v-else class="cms-usage-drawer__references">
          <article
            v-for="reference in references"
            :key="reference.key"
            class="cms-usage-drawer__reference"
          >
            <div class="cms-usage-drawer__reference-header">
              <strong>{{ reference.label }}</strong>
              <q-chip dense square :style="statusChipStyle">
                {{ reference.sourceLabel }}
              </q-chip>
            </div>
            <small>{{ reference.description }}</small>
            <small v-if="reference.locationLabel">
              {{ reference.locationLabel }}
            </small>
          </article>
        </div>
      </div>
    </section>
  </q-dialog>
</template>

<script setup lang="ts">
import { DsButton } from '../../../../design-system/vue'

export interface CmsEntityUsageDrawerReferenceView {
  key: string
  label: string
  sourceLabel: string
  description: string
  locationLabel?: string
}

withDefaults(defineProps<{
  modelValue: boolean
  headerLabel: string
  detailsLabel: string
  title?: string
  subtitle?: string
  referenceCount: number
  refsLabel: string
  summaryLabel: string
  references: CmsEntityUsageDrawerReferenceView[]
  emptyTitle: string
  emptyDescription: string
  closeLabel?: string
  statusChipStyle?: Record<string, string>
}>(), {
  title: '',
  subtitle: '',
  closeLabel: 'Close usage drawer',
  statusChipStyle: () => ({}),
})

defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
</script>