<template>
  <header
    class="ntk-landing-header"
    :class="headerClasses"
    :style="headerStyle"
  >
    <div
      class="header-container"
      :style="containerStyle"
    >
      <!-- Logo -->
      <div class="header-logo">
        <NtkLogo
          :letter="logoLetter"
          :text="logoText"
          :link-to="logoLink"
          :size="logoSize"
          :icon-color="logoIconColor"
          :text-color="logoTextColor"
          :gradient="logoGradient"
        />
      </div>

      <!-- Desktop Navigation -->
      <nav
        v-if="navItems.length > 0"
        class="header-nav"
      >
        <a
          v-for="(item, index) in navItems"
          :key="index"
          :href="item.href"
          class="header-nav-item"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
        >
          {{ item.label }}
        </a>
      </nav>

      <!-- Desktop CTA -->
      <div class="header-actions">
        <slot name="actions">
          <a
            v-if="ctaText"
            :href="ctaLink"
            class="header-cta-btn"
            :class="`cta-${ctaVariant}`"
            :style="ctaVariant === 'primary' ? ctaPrimaryStyle : {}"
          >
            <slot name="cta-icon" />
            {{ ctaText }}
          </a>
        </slot>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="header-mobile-btn"
        aria-label="Abrir menu"
        @click="toggleMobileMenu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
          />
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <NtkMobileDrawer
      v-model="mobileMenuOpen"
      :side="mobileDrawerSide"
      :width="mobileDrawerWidth"
      :nav-items="navItems"
      :cta-text="ctaText"
      :cta-link="ctaLink"
      :compress-label="compressLabel"
      @nav-click="handleNavClick"
      @cta-click="handleCtaClick"
    >
      <slot name="mobile-extra" />
    </NtkMobileDrawer>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import NtkLogo from '../ui/NtkLogo.vue';
import NtkMobileDrawer from './NtkMobileDrawer.vue';
import { useBranding } from '../../composables/ui/useBranding';
import type { NavLink } from '../../config/brand/navigation.config';

/**
 * NtkLandingHeader - Header padronizado para landing pages
 *
 * Funcionalidades:
 * - Logo configurável (usa NtkLogo internamente)
 * - Menu de navegação responsivo
 * - Botão CTA com variantes
 * - Menu hambúrguer no mobile
 * - Drawer lateral com botão "Comprimir"
 * - Sombra e altura padronizadas
 */

interface Props {
  // Logo
  /** Letra do logo */
  logoLetter?: string;
  /** Texto do logo */
  logoText?: string;
  /** Link do logo */
  logoLink?: string;
  /** Tamanho do logo */
  logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Cor do ícone do logo */
  logoIconColor?: string;
  /** Cor do texto do logo */
  logoTextColor?: string;
  /** Usar gradiente no logo */
  logoGradient?: boolean;

  // Navegação
  /** Itens de navegação */
  navItems?: NavLink[];

  // CTA
  /** Texto do botão CTA */
  ctaText?: string;
  /** Link do botão CTA */
  ctaLink?: string;
  /** Variante do botão CTA */
  ctaVariant?: 'primary' | 'secondary' | 'outline';

  // Layout
  /** Altura do header em pixels */
  height?: number;
  /** Header fixo no topo */
  sticky?: boolean;
  /** Sombra do header */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Cor de fundo */
  background?: string;
  /** Largura máxima do container */
  maxWidth?: number;
  /** Padding horizontal */
  paddingX?: string;

  // Mobile
  /** Breakpoint para mobile */
  mobileBreakpoint?: number;
  /** Lado do drawer mobile */
  mobileDrawerSide?: 'left' | 'right';
  /** Largura do drawer mobile */
  mobileDrawerWidth?: number;
  /** Texto do botão comprimir */
  compressLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  logoLink: '/',
  logoSize: 'md',
  logoGradient: true,
  navItems: () => [],
  ctaText: '',
  ctaLink: '#',
  ctaVariant: 'primary',
  height: 64,
  sticky: false,
  shadow: 'sm',
  background: 'var(--ntk-bg-card)',
  maxWidth: 1200,
  paddingX: '20px',
  mobileBreakpoint: 768,
  mobileDrawerSide: 'right',
  mobileDrawerWidth: 280,
  compressLabel: 'Comprimir',
});

const emit = defineEmits<{
  (e: 'nav-click', item: NavLink): void;
  (e: 'cta-click'): void;
  (e: 'mobile-toggle', open: boolean): void;
}>();

const { logo, appUrl, primaryColor } = useBranding();

const mobileMenuOpen = ref(false);

// Valores computados com fallback para tema
const logoLetter = computed(() => props.logoLetter || (logo.value.type === 'letter' ? logo.value.value : ''));
const logoText = computed(() => props.logoText || logo.value.alt);
const logoLink = computed(() => props.logoLink || appUrl.value || '/');

// Computed styles
const shadowMap = {
  none: 'none',
  sm: 'var(--ntk-shadow-sm)',
  md: 'var(--ntk-shadow-md)',
  lg: 'var(--ntk-shadow-lg)',
};

const headerClasses = computed(() => ({
  'header-sticky': props.sticky,
}));

const headerStyle = computed(() => ({
  '--header-height': `${props.height}px`,
  '--header-shadow': shadowMap[props.shadow],
  '--header-bg': props.background,
  '--mobile-breakpoint': `${props.mobileBreakpoint}px`,
}));

const containerStyle = computed(() => ({
  maxWidth: `${props.maxWidth}px`,
  paddingLeft: props.paddingX,
  paddingRight: props.paddingX,
}));

const ctaPrimaryStyle = computed(() => ({
  background: `linear-gradient(135deg, ${primaryColor.value} 0%, ${primaryColor.value} 100%)`,
}));

// Methods
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  emit('mobile-toggle', mobileMenuOpen.value);
}

function handleNavClick(item: NavLink) {
  emit('nav-click', item);
}

function handleCtaClick() {
  emit('cta-click');
}
</script>

<style scoped lang="scss">
.ntk-landing-header {
  width: 100%;
  height: var(--header-height);
  background: var(--header-bg);
  box-shadow: var(--header-shadow);
  border-bottom: 1px solid var(--ntk-border-color);
  z-index: 100;

  &.header-sticky {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin: 0 auto;
}

.header-logo {
  flex-shrink: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
}

.header-nav-item {
  color: var(--ntk-text-secondary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--ntk-text-primary);
    text-decoration: none;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
}

.header-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;

  &.cta-primary {
    color: var(--ntk-text-inverse);

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      text-decoration: none;
    }
  }

  &.cta-secondary {
    background: var(--ntk-bg-secondary);
    color: var(--ntk-text-secondary);

    &:hover {
      background: var(--ntk-border-color);
      text-decoration: none;
    }
  }

  &.cta-outline {
    background: transparent;
    color: var(--ntk-text-secondary);
    border: 1px solid var(--ntk-border-color);

    &:hover {
      background: var(--ntk-bg-secondary);
      border-color: var(--ntk-border-dark);
      text-decoration: none;
    }
  }
}

.header-mobile-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ntk-text-secondary);
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: var(--ntk-bg-secondary);
    text-decoration: none;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}
</style>