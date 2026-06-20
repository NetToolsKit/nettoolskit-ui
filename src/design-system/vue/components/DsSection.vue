<template>
  <section
    :id="id"
    :class="classes"
    :data-testid="testId"
    :aria-labelledby="labelledBy"
    :aria-label="labelledBy ? undefined : ariaLabel"
  >
    <header v-if="$slots.header || $slots.actions || eyebrow || title || subtitle" class="ntk-section__header">
      <slot name="header">
        <p v-if="eyebrow" class="ntk-section__eyebrow">{{ eyebrow }}</p>
        <component
          :is="headingTag"
          v-if="title"
          :id="titleId"
          class="ntk-section__title"
        >
          {{ title }}
        </component>
        <p v-if="subtitle" class="ntk-section__subtitle">{{ subtitle }}</p>
      </slot>
      <div v-if="$slots.actions" class="ntk-section__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="ntk-section__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ntk-section__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  ntkSectionDefaults,
  resolveNtkSectionRecipe,
  type NtkSectionContract,
} from '../../core'

defineOptions({
  name: 'DsSection',
})

const props = withDefaults(defineProps<NtkSectionContract>(), {
  variant: ntkSectionDefaults.variant,
  size: ntkSectionDefaults.size,
  intent: ntkSectionDefaults.intent,
  headingLevel: ntkSectionDefaults.headingLevel,
})

const slots = useSlots()
const titleId = computed(() => props.id ? `${props.id}__title` : undefined)
const labelledBy = computed(() => props.title && titleId.value && !slots.header ? titleId.value : undefined)
const headingTag = computed(() => `h${props.headingLevel}`)
const classes = computed(() => resolveNtkSectionRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>