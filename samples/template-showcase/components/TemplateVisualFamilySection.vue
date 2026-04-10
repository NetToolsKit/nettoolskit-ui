<template>
  <section
    class="ntk-template-family"
    :class="`ntk-template-family--${family.layout}`"
    :style="family.sectionStyleVars"
    :data-template-family="family.id"
  >
    <header class="ntk-template-family__header">
      <div class="ntk-template-family__intro">
        <p class="ntk-template-family__kicker">
          {{ family.kicker }}
        </p>

        <div class="ntk-template-family__badge-row">
          <span class="ntk-template-family__badge">
            {{ family.example.surfaceTag }}
          </span>
          <span class="ntk-template-family__badge ntk-template-family__badge--muted">
            {{ family.variants.length }} theme variants
          </span>
        </div>

        <h2 class="ntk-template-family__title">
          {{ family.label }}
        </h2>

        <p class="ntk-template-family__description">
          {{ family.description }}
        </p>

        <div class="ntk-template-family__notes">
          <article
            v-for="note in family.notes"
            :key="note.id"
            class="ntk-template-family__note"
          >
            <span>{{ note.label }}</span>
            <strong>{{ note.value }}</strong>
          </article>
        </div>
      </div>

      <div class="ntk-template-family__metrics">
        <article
          v-for="metric in family.metrics"
          :key="metric.id"
          class="ntk-template-family__metric"
        >
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </article>
      </div>
    </header>

    <div class="ntk-template-family__example-meta">
      <div>
        <p class="ntk-template-family__example-tag">
          {{ family.example.surfaceTag }}
        </p>
        <h3 class="ntk-template-family__example-title">
          {{ family.example.label }}
        </h3>
      </div>

      <span class="ntk-template-family__example-area">
        {{ family.example.templateAreas.join(' / ') }}
      </span>
    </div>

    <p class="ntk-template-family__example-summary">
      {{ family.example.summary }}
    </p>

    <div class="ntk-template-family__variants">
      <TemplateVisualVariantCard
        v-for="variant in family.variants"
        :key="variant.id"
        :example="family.example"
        :variant="variant"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import TemplateVisualVariantCard from './TemplateVisualVariantCard.vue'
import type { TemplateVisualFamilyDefinition } from '../families/template-visual-families.types'

defineProps<{
  family: TemplateVisualFamilyDefinition
}>()
</script>
