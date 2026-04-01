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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

const route = useRoute()
const router = useRouter()

const resolvedItems = computed<TemplateBreadcrumbItem[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items
  }
  const fromMeta = (route.meta?.breadcrumb ?? []) as TemplateBreadcrumbItem[]
  return fromMeta
})

function capitalize(text: string): string {
  if (!text) {
    return ''
  }
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function navigateTo(routeName?: string, path?: string): void {
  if (routeName) {
    if (String(route.name ?? '') === routeName) {
      return
    }
    void router.push({ name: routeName })
    return
  }
  if (path) {
    if (route.path === path) {
      return
    }
    void router.push(path)
  }
}
</script>

<style scoped lang="scss">
.ntk-template-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  background: var(--ntk-template-breadcrumb-bg, #f1f5f9);
}

.ntk-template-breadcrumb__link {
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--ntk-template-breadcrumb-link-color, #64748b);
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: var(--ntk-template-breadcrumb-link-hover-color, var(--q-primary));
  }
}

.ntk-template-breadcrumb__home {
  opacity: 0.75;
}

.ntk-template-breadcrumb__current {
  color: var(--ntk-template-breadcrumb-current-color, #0f172a);
  font-weight: 600;
}

.ntk-template-breadcrumb__sep {
  color: var(--ntk-template-breadcrumb-sep-color, #cbd5e1);
  font-weight: 300;
}
</style>