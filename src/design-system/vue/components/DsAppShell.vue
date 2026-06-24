<template>
  <div :id="id" :class="classes" :data-testid="testId">
    <slot name="header" :toggle-drawer="toggleDrawer" />
    <div class="ntk-app-shell__body">
      <slot name="sidebar" />
      <main class="ntk-app-shell__main">
        <slot />
      </main>
    </div>
    <slot name="footer" />
    <slot
      name="drawer"
      :open="drawerOpen"
      :set-open="setDrawerOpen"
      :toggle-drawer="toggleDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkAppShellDefaults,
  resolveNtkAppShellRecipe,
  type NtkAppShellContract,
} from '../../core'

defineOptions({
  name: 'DsAppShell',
})

const props = withDefaults(defineProps<NtkAppShellContract>(), {
  drawerOpen: false,
  variant: ntkAppShellDefaults.variant,
  size: ntkAppShellDefaults.size,
  intent: ntkAppShellDefaults.intent,
})

const emit = defineEmits<{
  'update:drawerOpen': [value: boolean]
}>()

const classes = computed(() => resolveNtkAppShellRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

function setDrawerOpen(value: boolean): void {
  emit('update:drawerOpen', value)
}

function toggleDrawer(): void {
  emit('update:drawerOpen', !props.drawerOpen)
}
</script>

<style scoped>
.ntk-app-shell {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
  inline-size: 100%;
  background: var(--ntk-bg-secondary);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-app-shell__body {
  display: flex;
  flex: 1 1 auto;
  min-block-size: 0;
}

.ntk-app-shell__main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-inline-size: 0;
  padding: var(--ntk-spacing-lg);
  overflow: auto;
}

.ntk-app-shell--size-sm .ntk-app-shell__main {
  padding: var(--ntk-spacing-md);
}

.ntk-app-shell--size-lg .ntk-app-shell__main {
  padding: var(--ntk-spacing-xl);
}
</style>