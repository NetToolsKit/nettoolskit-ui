<template>
  <div
    class="ntk-template-theme-dots"
    role="group"
    aria-label="Theme presets"
  >
    <button
      v-for="theme in themeOptions"
      :key="theme.id"
      type="button"
      class="ntk-template-theme-dots__dot"
      :class="{ 'ntk-template-theme-dots__dot--active': activeTheme === theme.id }"
      :style="{ background: theme.color }"
      :aria-label="`Switch to ${theme.label} theme`"
      :aria-pressed="activeTheme === theme.id"
      :title="theme.label"
      @click="setTheme(theme.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useThemeSwitcher } from '../../composables/useThemeSwitcher'

const { activeTheme, themeOptions, setTheme } = useThemeSwitcher()
</script>

<style scoped lang="scss">
.ntk-template-theme-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 6px;
}

.ntk-template-theme-dots__dot {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid transparent;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  padding: 0;
  outline: none;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ntk-template-page-border, #e2e8f0) 92%, transparent);
}

.ntk-template-theme-dots__dot:hover {
  transform: scale(1.12);
}

.ntk-template-theme-dots__dot--active {
  border-color: var(--ntk-text-heading, #0f172a);
  transform: scale(1.08);
}

.ntk-template-theme-dots__dot:focus-visible {
  outline: 2px solid var(--ntk-accent, #0f766e);
  outline-offset: 2px;
}
</style>
