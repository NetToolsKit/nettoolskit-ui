<template>
  <component
    :is="linkTo ? 'a' : 'div'"
    :href="linkTo"
    class="ntk-logo"
    :class="[`size-${size}`, { 'with-text': showText, 'clickable': linkTo }]"
  >
    <div
      class="logo-icon"
      :style="iconStyle"
    >
      {{ letter }}
    </div>
    <div
      v-if="showText"
      class="logo-content"
    >
      <span
        class="logo-text"
        :style="textStyle"
      >{{ text }}</span>
      <span
        v-if="tagline && showTagline"
        class="logo-tagline"
      >{{ tagline }}</span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBranding } from '../../composables/ui/useBranding';

/**
 * NtkLogo - Componente de logo reutilizável
 *
 * Tamanhos padronizados:
 * - xs: icon 24px, text 14px (para uso em espaços compactos)
 * - sm: icon 28px, text 16px (para headers secundários)
 * - md: icon 36px, text 20px (PADRÃO - para headers principais)
 * - lg: icon 48px, text 28px (para hero sections)
 * - xl: icon 64px, text 36px (para páginas de destaque)
 */

interface Props {
  /** Letra do logo (sobrescreve tema) */
  letter?: string;
  /** Texto do logo (sobrescreve tema) */
  text?: string;
  /** Tagline do logo (sobrescreve tema) */
  tagline?: string;
  /** Mostrar texto ao lado do ícone */
  showText?: boolean;
  /** Mostrar tagline abaixo do texto */
  showTagline?: boolean;
  /** Tamanho do logo: xs, sm, md (padrão), lg, xl */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Cor do ícone (sobrescreve tema) */
  iconColor?: string;
  /** Cor do texto (sobrescreve tema) */
  textColor?: string;
  /** Link para navegação */
  linkTo?: string;
  /** Usar gradiente no ícone */
  gradient?: boolean;
  /** Font weight do texto: normal, medium, semibold, bold */
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const props = withDefaults(defineProps<Props>(), {
  showText: true,
  showTagline: false,
  size: 'md',
  gradient: true,
  fontWeight: 'bold',
});

const { logo: themeLogo, appName, tagline: themeTagline, primaryColor, secondaryColor } = useBranding();

// Valores do tema ou props
const letter = computed(() => props.letter || themeLogo.value.value);
const text = computed(() => props.text || appName.value);
const tagline = computed(() => props.tagline || themeTagline.value);

// Estilos dinâmicos
const iconStyle = computed(() => {
  const color = props.iconColor || primaryColor.value;
  // Para o gradient, vamos usar a cor secundária como fallback
  const colorDark = secondaryColor.value;

  return {
    background: props.gradient
      ? `linear-gradient(135deg, ${color} 0%, ${colorDark} 100%)`
      : color,
  };
});

const fontWeightMap = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const textStyle = computed(() => ({
  color: props.textColor || primaryColor.value,
  fontWeight: fontWeightMap[props.fontWeight],
}));
</script>

<style scoped lang="scss">
.ntk-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &.clickable {
    cursor: pointer;

    &:hover {
      text-decoration: none;
      
      .logo-icon {
        transform: scale(1.05);
      }
    }
  }
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ntk-text-inverse);
  font-weight: 700;
  border-radius: 8px;
  transition: transform 0.2s ease;
  box-shadow: var(--ntk-shadow-sm);
}

.logo-content {
  display: flex;
  flex-direction: column;
}

.logo-text {
  line-height: 1.2;
  font-family: var(--ntk-font-family-display);
}

.logo-tagline {
  font-size: 0.65em;
  color: var(--ntk-text-muted);
  font-weight: 400;
}

// Tamanhos padronizados
.size-xs {
  gap: 0.375rem;

  .logo-icon {
    width: 24px;
    height: 24px;
    font-size: 12px;
    border-radius: 5px;
  }
  .logo-text {
    font-size: 14px;
  }
}

.size-sm {
  gap: 0.5rem;

  .logo-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
    border-radius: 6px;
  }
  .logo-text {
    font-size: 16px;
  }
}

.size-md {
  gap: 0.625rem;

  .logo-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
    border-radius: 8px;
  }
  .logo-text {
    font-size: 20px;
  }
}

.size-lg {
  gap: 0.75rem;

  .logo-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
    border-radius: 10px;
  }
  .logo-text {
    font-size: 28px;
  }
}

.size-xl {
  gap: 1rem;

  .logo-icon {
    width: 64px;
    height: 64px;
    font-size: 32px;
    border-radius: 12px;
  }
  .logo-text {
    font-size: 36px;
  }
}
</style>
