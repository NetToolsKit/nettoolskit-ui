<template>
  <nav
    id="navWrapper"
    :class="['nav-wrapper', { scrolled: isScrolled, 'hero-mode': isHeroSection }]"
    :style="navStyle"
  >
    <div class="nav-bar">
      <div class="nav-left">
        <button
          class="nav-action"
          aria-label="Menu"
          @click="$emit('toggle-panel')"
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24"><line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
            /><line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
            /><line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
            /></svg>
          </span>
          <span class="nav-action-label">Menu</span>
        </button>
      </div>
      <a
        href="#top"
        class="logo"
      >
        <img
          class="logo-mark"
          src="../assets/ntk-logo-white.png"
          alt="NTK"
        >
        <span class="logo-main">NetToolsKit</span>
        <span class="logo-sub">UI Vue Design System</span>
      </a>
      <div class="nav-right">
        <a
          href="#contato"
          class="nav-text-link nav-action-link"
        >GitHub</a>
        <button
          class="nav-action"
          aria-label="Busca"
          @click="$emit('open-search')"
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24"><circle
              cx="11"
              cy="11"
              r="7"
            /><line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
            /></svg>
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isScrolled: boolean
  isHeroSection: boolean
  heroScrollProgress: number
}>()

const navStyle = computed(() => {
  const progress = Math.max(0, Math.min(1, props.heroScrollProgress ?? 0))
  const blend = (max: number, min: number) => max - ((max - min) * progress)

  return {
    '--nav-hero-height': `${blend(102, 80)}px`,
    '--logo-main-size': `${blend(2.08, 1.85)}rem`,
    '--logo-sub-size': `${blend(0.7, 0.62)}rem`,
    '--logo-mark-width': `${blend(108, 92)}px`,
    '--nav-icon-size': `${blend(58, 50)}px`,
    '--nav-icon-glyph-size': `${blend(27, 24)}px`,
    '--nav-action-label-size': `${blend(0.86, 0.72)}rem`,
    '--nav-github-size': `${blend(0.9, 0.78)}rem`,
  }
})

defineEmits<{
  'toggle-panel': []
  'open-search': []
}>()
</script>