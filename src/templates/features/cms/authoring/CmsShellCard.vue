<template>
  <section class="cms-shell-card">
    <div class="cms-shell-card__header" :class="headerClass">
      <slot name="title">
        <strong v-if="title">{{ title }}</strong>
      </slot>

      <div
        v-if="$slots['header-actions']"
        class="cms-shell-card__header-actions"
      >
        <slot name="header-actions" />
      </div>
    </div>

    <q-separator v-if="showSeparator" />

    <div class="cms-shell-card__body" :class="bodyClass">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  headerClass?: string
  bodyClass?: string
  showSeparator?: boolean
}>(), {
  title: '',
  headerClass: '',
  bodyClass: '',
  showSeparator: true,
})
</script>

<style scoped>
.cms-shell-card__header-actions {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-cms-space-sm);
  margin-inline-start: auto;
}
</style>