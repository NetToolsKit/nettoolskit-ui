<template>
  <q-drawer
    v-model="isOpen"
    :side="side"
    :width="width"
    :overlay="true"
    :behavior="'mobile'"
    class="ntk-mobile-drawer"
  >
    <div class="drawer-content">
      <!-- Header com botão comprimir -->
      <div class="drawer-header">
        <button 
          class="drawer-compress-btn"
          :aria-label="compressLabel"
          @click="close"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
          <span>{{ compressLabel }}</span>
        </button>
      </div>

      <!-- Navegação -->
      <nav class="drawer-nav">
        <a
          v-for="(item, index) in navItems"
          :key="index"
          :href="item.href"
          class="drawer-nav-item"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          @click="handleNavClick(item)"
        >
          <q-icon
            v-if="item.icon"
            :name="item.icon"
            size="20px"
          />
          {{ item.label }}
        </a>
      </nav>

      <!-- CTA Button -->
      <div
        v-if="ctaText"
        class="drawer-cta-container"
      >
        <a 
          :href="ctaLink" 
          class="drawer-cta-btn"
          :style="ctaStyle"
          @click="handleCtaClick"
        >
          {{ ctaText }}
        </a>
      </div>

      <!-- Slot para conteúdo adicional -->
      <div
        v-if="$slots.default"
        class="drawer-extra"
      >
        <slot />
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk Mobile Drawer module.
 */

import { computed } from 'vue';
import { QDrawer, QIcon } from 'quasar';
import type { NavLink } from '../../config/brand/navigation.config';

interface Props {
  /** Controla abertura do drawer */
  modelValue: boolean;
  /** Lado do drawer */
  side?: 'left' | 'right';
  /** Largura do drawer */
  width?: number;
  /** Itens de navegação */
  navItems?: NavLink[];
  /** Texto do botão CTA */
  ctaText?: string;
  /** Link do botão CTA */
  ctaLink?: string;
  /** Texto do botão comprimir */
  compressLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  side: 'right',
  width: 280,
  navItems: () => [],
  ctaText: '',
  ctaLink: '#',
  compressLabel: 'Comprimir',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'nav-click', item: NavLink): void;
  (e: 'cta-click'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const ctaStyle = computed(() => ({
  background: 'var(--ntk-primary-gradient)',
}));

/**
 * Handles close.
 */
function close() {
  isOpen.value = false;
}

/**
 * Handles handle nav click.
 */
function handleNavClick(item: NavLink) {
  emit('nav-click', item);
  // Fecha o drawer após clicar em um link interno
  if (!item.external) {
    close();
  }
}

/**
 * Handles handle cta click.
 */
function handleCtaClick() {
  emit('cta-click');
  close();
}
</script>

<style scoped lang="scss">
.ntk-mobile-drawer {
  :deep(.q-drawer__content) {
    background: var(--ntk-bg-card) !important;
  }
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.drawer-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--ntk-border-color);
}

.drawer-compress-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--ntk-text-muted);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  border-radius: var(--ntk-radius-sm);
  transition: all var(--ntk-transition-fast);
  text-decoration: none;
  
  &:hover {
    background: var(--ntk-bg-secondary);
    color: var(--ntk-text-secondary);
    text-decoration: none;
  }
  
  svg {
    color: currentColor;
  }
}

.drawer-nav {
  flex: 1;
  padding: 16px 0;
}

.drawer-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--ntk-text-secondary);
  text-decoration: none;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  transition: all var(--ntk-transition-fast);
  
  &:hover {
    background: var(--ntk-bg-secondary);
    color: var(--ntk-text-primary);
    text-decoration: none;
  }
  
  :deep(.q-icon) {
    color: var(--ntk-text-muted);
  }
}

.drawer-cta-container {
  padding: 16px 20px;
  border-top: 1px solid var(--ntk-border-color);
}

.drawer-cta-btn {
  display: block;
  width: 100%;
  padding: 12px 20px;
  text-align: center;
  color: var(--ntk-text-on-accent);
  text-decoration: none;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  border-radius: var(--ntk-radius-md);
  transition: all var(--ntk-transition-fast);
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    text-decoration: none;
  }
}

.drawer-extra {
  padding: 16px 20px;
  border-top: 1px solid var(--ntk-border-color);
}
</style>
