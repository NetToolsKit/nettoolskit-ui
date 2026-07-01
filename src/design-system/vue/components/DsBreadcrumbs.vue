<template>
  <nav :id="id" :class="classes" :data-testid="testId" :aria-label="ariaLabel">
    <ol class="ntk-breadcrumbs__list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="ntk-breadcrumbs__item"
      >
        <a
          v-if="item.href && index < items.length - 1"
          class="ntk-breadcrumbs__link"
          :href="item.href"
        >{{ item.label }}</a>
        <span
          v-else
          class="ntk-breadcrumbs__current"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >{{ item.label }}</span>
        <span
          v-if="index < items.length - 1"
          class="ntk-breadcrumbs__separator"
          aria-hidden="true"
        >{{ separator }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkBreadcrumbsDefaults,
  resolveNtkBreadcrumbsRecipe,
  type NtkBreadcrumbsContract,
} from '../../core'

defineOptions({
  name: 'DsBreadcrumbs',
})

const props = withDefaults(defineProps<NtkBreadcrumbsContract>(), {
  items: () => [],
  variant: ntkBreadcrumbsDefaults.variant,
  size: ntkBreadcrumbsDefaults.size,
  intent: ntkBreadcrumbsDefaults.intent,
  separator: '/',
})

const classes = computed(() => resolveNtkBreadcrumbsRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const ariaLabel = computed(() => props.ariaLabel ?? ntkI18n.t('a11y.breadcrumb'))
</script>

<style scoped>
.ntk-breadcrumbs {
  font-family: var(--ntk-font-family);
}

.ntk-breadcrumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ntk-breadcrumbs__item {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
}

.ntk-breadcrumbs__link {
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-sm);
  text-decoration: none;
  border-radius: var(--ntk-radius-sm);
  transition: color var(--ntk-transition-fast);
}

.ntk-breadcrumbs--size-sm .ntk-breadcrumbs__link,
.ntk-breadcrumbs--size-sm .ntk-breadcrumbs__current,
.ntk-breadcrumbs--size-sm .ntk-breadcrumbs__separator {
  font-size: var(--ntk-font-size-xs);
}

.ntk-breadcrumbs--size-lg .ntk-breadcrumbs__link,
.ntk-breadcrumbs--size-lg .ntk-breadcrumbs__current,
.ntk-breadcrumbs--size-lg .ntk-breadcrumbs__separator {
  font-size: var(--ntk-font-size-base);
}

.ntk-breadcrumbs__link:hover {
  color: var(--ntk-text-link-hover);
  text-decoration: underline;
}

.ntk-breadcrumbs__link:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-breadcrumbs__current {
  color: var(--ntk-text-primary);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-breadcrumbs--variant-subtle .ntk-breadcrumbs__current {
  font-weight: var(--ntk-font-weight-medium);
  color: var(--ntk-text-secondary);
}

.ntk-breadcrumbs__separator {
  color: var(--ntk-text-muted);
  font-size: var(--ntk-font-size-sm);
}
</style>