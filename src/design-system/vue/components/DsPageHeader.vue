<template>
  <header
    :id="id"
    :class="classes"
    :data-testid="testId"
    :aria-labelledby="labelledBy"
    :aria-label="labelledBy ? undefined : ariaLabel"
  >
    <div class="ntk-page-header__main">
      <p v-if="eyebrow" class="ntk-page-header__eyebrow">{{ eyebrow }}</p>
      <nav v-if="$slots.breadcrumb" class="ntk-page-header__breadcrumb" aria-label="Breadcrumb">
        <slot name="breadcrumb" />
      </nav>
      <component
        :is="headingTag"
        v-if="title"
        :id="titleId"
        class="ntk-page-header__title"
      >
        {{ title }}
      </component>
      <p v-if="description" class="ntk-page-header__description">{{ description }}</p>
      <div v-if="$slots.default" class="ntk-page-header__meta">
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="ntk-page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkPageHeaderDefaults,
  resolveNtkPageHeaderRecipe,
  type NtkPageHeaderContract,
} from '../../core'

defineOptions({
  name: 'DsPageHeader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<NtkPageHeaderContract>(), {
  variant: ntkPageHeaderDefaults.variant,
  size: ntkPageHeaderDefaults.size,
  intent: ntkPageHeaderDefaults.intent,
  headingLevel: ntkPageHeaderDefaults.headingLevel,
})

const titleId = computed(() => (props.id ? `${props.id}__title` : undefined))
const labelledBy = computed(() => (props.title && titleId.value ? titleId.value : undefined))
const headingTag = computed(() => `h${props.headingLevel}`)
const classes = computed(() => resolveNtkPageHeaderRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
  padding-block: var(--ntk-spacing-lg);
  border-block-end: 1px solid var(--ntk-border-color);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-page-header--variant-compact {
  padding-block: var(--ntk-spacing-sm);
}

.ntk-page-header--variant-hero {
  padding-block: var(--ntk-spacing-xl);
  border-block-end: 0;
}

.ntk-page-header__main {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  min-width: 0;
}

.ntk-page-header__eyebrow {
  margin: 0;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
}

.ntk-page-header__breadcrumb {
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.ntk-page-header__title {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-2xl);
  font-weight: var(--ntk-font-weight-bold);
  line-height: var(--ntk-line-height-tight);
  color: var(--ntk-text-primary);
}

.ntk-page-header--variant-hero .ntk-page-header__title {
  font-size: var(--ntk-font-size-3xl);
}

.ntk-page-header--size-sm .ntk-page-header__title {
  font-size: var(--ntk-font-size-xl);
}

.ntk-page-header--size-lg .ntk-page-header__title {
  font-size: var(--ntk-font-size-3xl);
}

.ntk-page-header__description {
  margin: 0;
  max-width: 70ch;
  font-size: var(--ntk-font-size-base);
  color: var(--ntk-text-secondary);
}

.ntk-page-header__meta {
  margin-block-start: var(--ntk-spacing-xs);
}

.ntk-page-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}
</style>