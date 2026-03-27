<template>
  <div :class="containerClass">
    <div v-if="copyClass" :class="copyClass">
      <strong>{{ title }}</strong>
      <small v-if="description">{{ description }}</small>
    </div>

    <template v-else>
      <strong>{{ title }}</strong>
      <small v-if="description">{{ description }}</small>
    </template>

    <div
      v-if="$slots.summary"
      :class="summaryClass"
    >
      <slot name="summary" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  containerClass?: string
  copyClass?: string
  summaryClass?: string
}>(), {
  description: '',
  containerClass: '',
  copyClass: '',
  summaryClass: '',
})
</script>