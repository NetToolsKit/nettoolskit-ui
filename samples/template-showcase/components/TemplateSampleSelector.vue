<template>
  <section class="ntk-template-selector">
    <div class="ntk-template-selector__header">
      <div>
        <p class="ntk-template-selector__kicker">
          Sample selector
        </p>
        <h2 class="ntk-template-selector__title">
          Original reference plus five whitelabel variations
        </h2>
      </div>

      <button
        v-if="showAllAction"
        type="button"
        class="ntk-template-selector__all-action"
        @click="$emit('show-all')"
      >
        Show all samples
      </button>
    </div>

    <div
      v-if="originalFamily"
      class="ntk-template-selector__group"
    >
      <p class="ntk-template-selector__group-label">
        Original
      </p>

      <button
        type="button"
        class="ntk-template-selector__card ntk-template-selector__card--original"
        :class="{ 'ntk-template-selector__card--active': selectedFamilyId === originalFamily.id }"
        :style="originalFamily.sectionStyleVars"
        @click="$emit('select-family', originalFamily.id)"
      >
        <span class="ntk-template-selector__card-kind">
          {{ originalFamily.kind }}
        </span>
        <strong>{{ originalFamily.label }}</strong>
        <span>{{ originalFamily.example.label }}</span>
      </button>
    </div>

    <div class="ntk-template-selector__group">
      <p class="ntk-template-selector__group-label">
        Variations
      </p>

      <div class="ntk-template-selector__grid">
        <button
          v-for="family in variationFamilies"
          :key="family.id"
          type="button"
          class="ntk-template-selector__card"
          :class="{ 'ntk-template-selector__card--active': selectedFamilyId === family.id }"
          :style="family.sectionStyleVars"
          @click="$emit('select-family', family.id)"
        >
          <span class="ntk-template-selector__card-kind">
            {{ family.kind }}
          </span>
          <strong>{{ family.label }}</strong>
          <span>{{ family.example.label }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { TemplateVisualFamilyDefinition } from '../families/template-visual-families.types'

const props = defineProps<{
  families: TemplateVisualFamilyDefinition[]
  selectedFamilyId?: string | null
  showAllAction?: boolean
}>()

defineEmits<{
  'select-family': [familyId: string]
  'show-all': []
}>()

const originalFamily = computed(() => {
  return props.families.find(family => family.kind === 'original') ?? null
})

const variationFamilies = computed(() => {
  return props.families.filter(family => family.kind === 'variation')
})
</script>

<style scoped lang="scss">
.ntk-template-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.06);
}

.ntk-template-selector__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.ntk-template-selector__kicker,
.ntk-template-selector__group-label {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0f766e;
}

.ntk-template-selector__title {
  margin: 6px 0 0;
  font-size: clamp(22px, 3vw, 30px);
  line-height: 1.1;
  color: #0f172a;
}

.ntk-template-selector__all-action,
.ntk-template-selector__card {
  appearance: none;
  border: 0;
  cursor: pointer;
}

.ntk-template-selector__all-action {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
}

.ntk-template-selector__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ntk-template-selector__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.ntk-template-selector__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-height: 124px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid color-mix(in srgb, var(--ntk-border-color, #cbd5e1) 82%, transparent);
  background: color-mix(in srgb, var(--ntk-bg-card, #ffffff) 88%, transparent);
  color: var(--ntk-text-primary, #0f172a);
  text-align: left;
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
  box-shadow: var(--ntk-shadow-soft, 0 10px 24px rgba(15, 23, 42, 0.08));
}

.ntk-template-selector__card:hover,
.ntk-template-selector__card--active {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--ntk-accent, #10b981) 72%, transparent);
  box-shadow: var(--ntk-shadow-md, 0 18px 42px rgba(15, 23, 42, 0.12));
}

.ntk-template-selector__card--original {
  min-height: 142px;
}

.ntk-template-selector__card-kind {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ntk-accent, #10b981) 14%, transparent);
  color: var(--ntk-text-secondary, #475569);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ntk-template-selector__card strong {
  font-size: 18px;
  line-height: 1.15;
}

.ntk-template-selector__card span:last-child {
  color: var(--ntk-text-secondary, #64748b);
  line-height: 1.5;
}

@media (max-width: 980px) {
  .ntk-template-selector__header {
    flex-direction: column;
  }

  .ntk-template-selector__all-action {
    width: 100%;
  }
}
</style>
