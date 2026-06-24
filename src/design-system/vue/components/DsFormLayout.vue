<template>
  <div
    :id="id"
    :class="classes"
    :data-testid="testId"
    :role="$slots.default ? undefined : 'group'"
    :aria-label="ariaLabel"
  >
    <div v-if="$slots.header || legend" class="ntk-form-layout__header">
      <slot name="header">
        <p v-if="legend" class="ntk-form-layout__legend">{{ legend }}</p>
      </slot>
    </div>
    <div class="ntk-form-layout__fields">
      <slot />
    </div>
    <div v-if="$slots.actions" class="ntk-form-layout__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkFormLayoutDefaults,
  resolveNtkFormLayoutRecipe,
  type NtkFormLayoutContract,
} from '../../core'

interface Props extends NtkFormLayoutContract {
  readonly legend?: string
}

defineOptions({
  name: 'DsFormLayout',
})

const props = withDefaults(defineProps<Props>(), {
  variant: ntkFormLayoutDefaults.variant,
  size: ntkFormLayoutDefaults.size,
  intent: ntkFormLayoutDefaults.intent,
  density: ntkFormLayoutDefaults.density,
  columns: ntkFormLayoutDefaults.columns,
})

const classes = computed(() => resolveNtkFormLayoutRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  columns: props.columns,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-form-layout {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
  font-family: var(--ntk-font-family);
  color: var(--ntk-text-primary);
}

.ntk-form-layout__legend {
  margin: 0;
  font-size: var(--ntk-font-size-base);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.ntk-form-layout__fields {
  display: grid;
  gap: var(--ntk-spacing-md);
  grid-template-columns: 1fr;
}

.ntk-form-layout--density-compact .ntk-form-layout__fields {
  gap: var(--ntk-spacing-sm);
}

.ntk-form-layout--density-spacious .ntk-form-layout__fields {
  gap: var(--ntk-spacing-lg);
}

.ntk-form-layout--variant-inline .ntk-form-layout__fields {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}

/* Column counts apply to grid variants on wider viewports. */
@media (min-width: 640px) {
  .ntk-form-layout--cols-2 .ntk-form-layout__fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ntk-form-layout--cols-3 .ntk-form-layout__fields {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ntk-form-layout--cols-4 .ntk-form-layout__fields {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.ntk-form-layout__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-sm);
  justify-content: flex-end;
  padding-block-start: var(--ntk-spacing-sm);
  border-block-start: 1px solid var(--ntk-border-light);
}
</style>