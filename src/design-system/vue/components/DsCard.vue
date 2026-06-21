<template>
  <article
    :id="id"
    :class="classes"
    :data-testid="testId"
    :tabindex="clickable ? 0 : undefined"
    :role="clickable ? 'button' : undefined"
    @click="onPointerActivate"
    @keydown.enter.prevent="onKeyboardActivate"
    @keydown.space.prevent="onKeyboardActivate"
  >
    <header v-if="$slots.header || title || subtitle" class="ntk-card__header">
      <slot name="header">
        <h3 v-if="title" class="ntk-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="ntk-card__subtitle">{{ subtitle }}</p>
      </slot>
    </header>
    <div v-if="$slots.default" class="ntk-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ntk-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkCardDefaults,
  resolveNtkCardRecipe,
  type NtkCardContract,
} from '../../core'

defineOptions({
  name: 'DsCard',
})

const props = withDefaults(defineProps<NtkCardContract>(), {
  variant: ntkCardDefaults.variant,
  size: ntkCardDefaults.size,
  intent: ntkCardDefaults.intent,
  clickable: false,
  selected: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const classes = computed(() => resolveNtkCardRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  clickable: props.clickable,
  selected: props.selected,
  class: props.class,
}).classes)

function onPointerActivate(event: MouseEvent): void {
  if (props.clickable) {
    emit('click', event)
  }
}

function onKeyboardActivate(event: KeyboardEvent): void {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>