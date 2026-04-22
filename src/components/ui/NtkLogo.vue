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
/**
 * Src/components/ui/Ntk Logo module.
 */

import { computed } from 'vue';
import { useBranding } from '../../composables/ui/useBranding';

/**
 * NtkLogo - Reusable logo component.
 *
 * Standard sizes:
 * - xs: icon 24px, text 14px for compact spaces
 * - sm: icon 28px, text 16px for secondary headers
 * - md: icon 36px, text 20px as the default for primary headers
 * - lg: icon 48px, text 28px for hero sections
 * - xl: icon 64px, text 36px for showcase pages
 */

interface Props {
  /** Logo letter override */
  letter?: string;
  /** Logo text override */
  text?: string;
  /** Logo tagline override */
  tagline?: string;
  /** Whether to show text beside the icon */
  showText?: boolean;
  /** Whether to show the tagline below the text */
  showTagline?: boolean;
  /** Logo size: xs, sm, md (default), lg, xl */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Icon color override */
  iconColor?: string;
  /** Text color override */
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

const COLOR_TOKEN_ALIASES: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  brand: 'var(--ntk-primary)',
  success: 'var(--ntk-success, var(--semantic-success-primary))',
  positive: 'var(--ntk-success, var(--semantic-success-primary))',
  warning: 'var(--ntk-warning, var(--semantic-warning-primary))',
  error: 'var(--ntk-error, var(--semantic-error-primary))',
  danger: 'var(--ntk-error, var(--semantic-error-primary))',
  negative: 'var(--ntk-error, var(--semantic-error-primary))',
  info: 'var(--ntk-info, var(--semantic-info-primary))',
  neutral: 'var(--ntk-text-secondary)',
  muted: 'var(--ntk-text-muted)',
  text: 'var(--ntk-text-primary)',
  inverse: 'var(--ntk-text-inverse)',
};

const QUASAR_NEUTRAL_ALIAS_PATTERN = /^(grey|gray|blue-grey)-\d+$/i;
const UNSAFE_CSS_VALUE_PATTERN = /[;{}<>]|url\s*\(|expression\s*\(|javascript:/i;
const HEX_COLOR_PATTERN = /#[\da-f]{3,8}\b/i;
const RAW_COLOR_FUNCTION_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(\s*(?!var\(--)/i;
const NAMED_COLOR_PATTERN = /\b(?:white|black|red|green|blue|hotpink|purple|violet|yellow|orange|pink|gray|grey|cyan|magenta|lime|navy|teal|maroon|olive|silver|gold|brown|coral|tomato|salmon|beige|ivory|snow|azure|lavender|plum|orchid|indigo)\b/i;

const stripCssVariables = (value: string): string => value.replace(/var\([^)]*\)/gi, '');

const resolveTokenColor = (value?: string): string => {
  const normalized = value?.trim();
  if (!normalized) {
    return '';
  }

  const hasSafeTokenExpression = normalized.includes('var(--')
    && !UNSAFE_CSS_VALUE_PATTERN.test(normalized)
    && !HEX_COLOR_PATTERN.test(normalized)
    && !RAW_COLOR_FUNCTION_PATTERN.test(normalized)
    && !NAMED_COLOR_PATTERN.test(stripCssVariables(normalized));

  if (hasSafeTokenExpression) {
    return normalized;
  }

  const alias = normalized.toLowerCase().replace(/_/g, '-');
  return COLOR_TOKEN_ALIASES[alias] ?? (QUASAR_NEUTRAL_ALIAS_PATTERN.test(alias) ? COLOR_TOKEN_ALIASES.neutral : '');
};

// Valores do tema ou props
const letter = computed(() => props.letter || themeLogo.value.value);
const text = computed(() => props.text || appName.value);
const tagline = computed(() => props.tagline || themeTagline.value);

// Estilos dinâmicos
const iconStyle = computed(() => {
  const color = resolveTokenColor(props.iconColor) || primaryColor.value;
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
  color: resolveTokenColor(props.textColor) || primaryColor.value,
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

// Standard sizes
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
