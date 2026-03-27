<template>
  <div class="cms-designer-card__sidebar-header">
    <strong>{{ title }}</strong>
    <small v-if="description">{{ description }}</small>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: '',
})
</script>