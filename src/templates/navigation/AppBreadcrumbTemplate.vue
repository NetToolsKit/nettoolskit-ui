<template>
  <nav
    v-if="resolvedItems.length > 0"
    class="ntk-template-breadcrumb"
    aria-label="Breadcrumb"
  >
    <button
      type="button"
      class="ntk-template-breadcrumb__link"
      @click="navigateTo(homeRouteName, homePath)"
    >
      <q-icon
        name="home"
        size="16px"
        class="ntk-template-breadcrumb__home"
      />
    </button>

    <span class="ntk-template-breadcrumb__sep">/</span>

    <template
      v-for="(item, index) in resolvedItems"
      :key="`${item.name}-${index}`"
    >
      <button
        v-if="item.routeName || item.path"
        type="button"
        class="ntk-template-breadcrumb__link"
        @click="navigateTo(item.routeName, item.path)"
      >
        {{ capitalize(item.name) }}
      </button>
      <span
        v-else
        class="ntk-template-breadcrumb__current"
      >
        {{ capitalize(item.name) }}
      </span>

      <span
        v-if="index < resolvedItems.length - 1"
        class="ntk-template-breadcrumb__sep"
      >/</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'

import type { TemplateBreadcrumbItem } from './menu-template.types'

const props = withDefaults(defineProps<{
  items?: TemplateBreadcrumbItem[]
  homeRouteName?: string
  homePath?: string
}>(), {
  items: undefined,
  homeRouteName: 'home',
  homePath: '/',
})

const route = inject(routeLocationKey, null)
const router = inject(routerKey, null)

const resolvedItems = computed<TemplateBreadcrumbItem[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items
  }
  const fromMeta = (route?.meta?.breadcrumb ?? []) as TemplateBreadcrumbItem[]
  return fromMeta
})

function capitalize(text: string): string {
  if (!text) {
    return ''
  }
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function navigateTo(routeName?: string, path?: string): void {
  if (!router) {
    if (path && typeof window !== 'undefined') {
      window.location.href = path
    }
    return
  }

  if (routeName) {
    if (String(route?.name ?? '') === routeName) {
      return
    }
    void router.push({ name: routeName })
    return
  }
  if (path) {
    if (route?.path === path) {
      return
    }
    void router.push(path)
  }
}
</script>

<style scoped lang="scss">
.ntk-template-breadcrumb {
  --ntk-template-breadcrumb-surface: var(--ntk-template-layout-header-breadcrumb-bg, var(--ntk-template-breadcrumb-bg, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 8%, transparent)));
  --ntk-template-breadcrumb-border-color: var(--ntk-template-layout-header-breadcrumb-border, var(--ntk-template-breadcrumb-border, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 14%, transparent)));
  --ntk-template-breadcrumb-link-text: var(--ntk-template-layout-header-breadcrumb-link, var(--ntk-template-breadcrumb-link-color, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 82%, transparent)));
  --ntk-template-breadcrumb-link-hover-text: var(--ntk-template-layout-header-breadcrumb-link-hover, var(--ntk-template-breadcrumb-link-hover-color, var(--ntk-template-layout-header-text, var(--ntk-text-primary))));
  --ntk-template-breadcrumb-current-text: var(--ntk-template-layout-header-breadcrumb-current, var(--ntk-template-breadcrumb-current-color, var(--ntk-template-layout-header-text, var(--ntk-text-primary))));
  --ntk-template-breadcrumb-separator-text: var(--ntk-template-layout-header-breadcrumb-sep, var(--ntk-template-breadcrumb-sep-color, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 44%, transparent)));
  --ntk-template-breadcrumb-link-hover-bg: var(--ntk-template-layout-header-breadcrumb-hover-bg, color-mix(in srgb, var(--ntk-template-breadcrumb-current-text) 8%, transparent));
  --ntk-template-breadcrumb-focus-ring: var(--ntk-template-layout-header-breadcrumb-focus-ring, var(--ntk-border-focus, var(--ntk-accent)));
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  border: 1px solid var(--ntk-template-breadcrumb-border-color);
  background: var(--ntk-template-breadcrumb-surface);
}

.ntk-template-breadcrumb__link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--ntk-template-breadcrumb-link-text);
  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--ntk-template-breadcrumb-link-hover-text);
    background: var(--ntk-template-breadcrumb-link-hover-bg);
  }

  &:focus-visible {
    outline: 2px solid var(--ntk-template-breadcrumb-focus-ring);
    outline-offset: 2px;
  }
}

.ntk-template-breadcrumb__home {
  color: currentColor;
  opacity: 0.92;
}

.ntk-template-breadcrumb__current {
  padding: 2px 4px;
  color: var(--ntk-template-breadcrumb-current-text);
  font-weight: 600;
}

.ntk-template-breadcrumb__sep {
  color: var(--ntk-template-breadcrumb-separator-text);
  font-weight: 400;
}
</style>
