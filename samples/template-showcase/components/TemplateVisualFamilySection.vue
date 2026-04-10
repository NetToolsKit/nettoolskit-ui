<template>
  <section
    class="ntk-template-family"
    :class="`ntk-template-family--${family.layout}`"
    :style="family.styleVars"
    :data-template-family="family.id"
  >
    <header class="ntk-template-family__header">
      <div class="ntk-template-family__intro">
        <p class="ntk-template-family__kicker">
          {{ family.kicker }}
        </p>

        <div class="ntk-template-family__badge-row">
          <span class="ntk-template-family__badge">
            {{ family.preset.label }}
          </span>
          <span class="ntk-template-family__badge ntk-template-family__badge--muted">
            {{ family.examples.length }} sample{{ family.examples.length > 1 ? 's' : '' }}
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

    <div class="ntk-template-family__examples">
      <article
        v-for="example in visibleExamples"
        :key="example.id"
        class="ntk-template-family__example"
      >
        <div class="ntk-template-family__example-meta">
          <div>
            <p class="ntk-template-family__example-tag">
              {{ example.surfaceTag }}
            </p>
            <h3 class="ntk-template-family__example-title">
              {{ example.label }}
            </h3>
          </div>

          <span class="ntk-template-family__example-area">
            {{ example.templateAreas.join(' / ') }}
          </span>
        </div>

        <p class="ntk-template-family__example-summary">
          {{ example.summary }}
        </p>

        <component :is="example.component" />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { TemplateVisualFamilyDefinition } from '../families/template-visual-families.types'

const props = defineProps<{
  family: TemplateVisualFamilyDefinition
  focusedExampleId?: string | null
}>()

const visibleExamples = computed(() => {
  if (!props.focusedExampleId) {
    return props.family.examples
  }

  return props.family.examples.filter(example => example.id === props.focusedExampleId)
})
</script>
