<template>
  <article
    class="ntk-template-family__variant"
    :class="`ntk-template-family__variant--${variant.tone}`"
    :style="variant.styleVars"
    :data-template-variant="variant.id"
  >
    <div class="ntk-template-family__variant-meta">
      <div>
        <p class="ntk-template-family__variant-kicker">
          {{ variant.label }}
        </p>
        <strong class="ntk-template-family__variant-title">
          {{ variant.preset.label }}
        </strong>
      </div>

      <span class="ntk-template-family__variant-tone">
        {{ variant.tone }}
      </span>
    </div>

    <p class="ntk-template-family__variant-caption">
      {{ variant.caption }}
    </p>

    <component :is="example.component" />
  </article>
</template>

<script setup lang="ts">
import { provideTemplateVisualThemeContext } from '../families/template-visual-family.context'
import type {
  TemplateVisualFamilyVariantDefinition,
} from '../families/template-visual-families.types'
import type { TemplateShowcaseExampleDefinition } from '../template-showcase.examples'

const props = defineProps<{
  example: TemplateShowcaseExampleDefinition
  variant: TemplateVisualFamilyVariantDefinition
}>()

provideTemplateVisualThemeContext(props.variant)
</script>
