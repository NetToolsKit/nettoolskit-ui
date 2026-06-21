<template>
  <button
    :id="id"
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :data-testid="testId"
    @click="emit('click', $event)"
  >
    <span v-if="icon" class="ntk-button__icon ntk-button__icon--left" aria-hidden="true">{{ icon }}</span>
    <span v-if="$slots.default || label" class="ntk-button__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="iconRight" class="ntk-button__icon ntk-button__icon--right" aria-hidden="true">{{ iconRight }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkButtonDefaults,
  resolveNtkButtonRecipe,
  type NtkButtonContract,
} from '../../core'

defineOptions({
  name: 'DsButton',
})

const props = withDefaults(defineProps<NtkButtonContract>(), {
  variant: ntkButtonDefaults.variant,
  size: ntkButtonDefaults.size,
  intent: ntkButtonDefaults.intent,
  type: 'button',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => resolveNtkButtonRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  disabled: props.disabled,
  loading: props.loading,
  class: props.class,
}).classes)
</script>