<template>
  <main
    :id="id"
    :class="classes"
    :data-testid="testId"
    :aria-labelledby="labelledBy"
    :aria-label="labelledBy ? undefined : ariaLabel"
  >
    <header v-if="$slots.header || $slots.actions || title || subtitle" class="ntk-page__header">
      <slot name="header">
        <h1 v-if="title" :id="titleId" class="ntk-page__title">{{ title }}</h1>
        <p v-if="subtitle" class="ntk-page__subtitle">{{ subtitle }}</p>
      </slot>
      <div v-if="$slots.actions" class="ntk-page__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="ntk-page__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ntk-page__footer">
      <slot name="footer" />
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  ntkPageDefaults,
  resolveNtkPageRecipe,
  type NtkPageContract,
} from '../../core'

defineOptions({
  name: 'DsPage',
})

const props = withDefaults(defineProps<NtkPageContract>(), {
  variant: ntkPageDefaults.variant,
  size: ntkPageDefaults.size,
  intent: ntkPageDefaults.intent,
})

const slots = useSlots()
const titleId = computed(() => props.id ? `${props.id}__title` : undefined)
const labelledBy = computed(() => props.title && titleId.value && !slots.header ? titleId.value : undefined)
const classes = computed(() => resolveNtkPageRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>