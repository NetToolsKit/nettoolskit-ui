<template>
  <section
    class="ntk-cta-section"
    :class="sectionClasses"
    :style="sectionStyle"
  >
    <div
      class="cta-container"
      :style="containerStyle"
    >
      <!-- Content -->
      <div class="cta-content">
        <h2 class="cta-title">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>
        <p
          v-if="subtitle"
          class="cta-subtitle"
        >
          <slot name="subtitle">
            {{ subtitle }}
          </slot>
        </p>
      </div>
      
      <!-- Actions -->
      <div class="cta-actions">
        <slot name="actions">
          <a 
            :href="primaryCTA.link" 
            class="cta-btn cta-btn--primary"
            :style="primaryBtnStyle"
          >
            {{ primaryCTA.text }}
          </a>
          <a 
            v-if="secondaryCTA" 
            :href="secondaryCTA.link" 
            class="cta-btn cta-btn--secondary"
          >
            {{ secondaryCTA.text }}
          </a>
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk CTASection module.
 */

import { computed } from 'vue';

/**
 * NtkCTASection - Seção de Call-to-Action
 * 
 * Usado em landing pages para destacar ações importantes como:
 * - Começar agora
 * - Criar conta
 * - Baixar app
 * - Agendar demo
 */

interface CTAButton {
  text: string;
  link: string;
}

interface Props {
  /** Main title */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Botão CTA primário */
  primaryCTA: CTAButton;
  /** Botão CTA secundário (opcional) */
  secondaryCTA?: CTAButton;
  /** Variante visual */
  variant?: 'default' | 'gradient' | 'dark' | 'light';
  /** Tamanho da seção */
  size?: 'sm' | 'md' | 'lg';
  /** Layout */
  layout?: 'centered' | 'split';
  /** Maximum container width */
  maxWidth?: number;
  /** Cor de fundo customizada */
  bgColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gradient',
  size: 'md',
  layout: 'centered',
  maxWidth: 900,
});

const sectionClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
  `layout-${props.layout}`,
]);

const BACKGROUND_TOKEN_ALIASES: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  brand: 'var(--ntk-primary)',
  surface: 'var(--ntk-bg-primary)',
  'surface-muted': 'var(--ntk-bg-secondary)',
  dark: 'var(--ntk-bg-dark)',
  light: 'var(--ntk-bg-primary)',
  neutral: 'var(--ntk-bg-secondary)',
  success: 'var(--ntk-success, var(--semantic-success-primary))',
  warning: 'var(--ntk-warning, var(--semantic-warning-primary))',
  error: 'var(--ntk-error, var(--semantic-error-primary))',
  danger: 'var(--ntk-error, var(--semantic-error-primary))',
  info: 'var(--ntk-info, var(--semantic-info-primary))',
};

const UNSAFE_CSS_VALUE_PATTERN = /[;{}<>]|url\s*\(|expression\s*\(|javascript:/i;
const HEX_COLOR_PATTERN = /#[\da-f]{3,8}\b/i;
const RAW_COLOR_FUNCTION_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(\s*(?!var\(--)/i;
const NAMED_COLOR_PATTERN = /\b(?:white|black|red|green|blue|hotpink|purple|violet|yellow|orange|pink|gray|grey|cyan|magenta|lime|navy|teal|maroon|olive|silver|gold|brown|coral|tomato|salmon|beige|ivory|snow|azure|lavender|plum|orchid|indigo)\b/i;

const stripCssVariables = (value: string): string => value.replace(/var\([^)]*\)/gi, '');

const resolveTokenBackground = (value?: string): string => {
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

  return BACKGROUND_TOKEN_ALIASES[normalized.toLowerCase().replace(/_/g, '-')] ?? '';
};

const sectionStyle = computed(() => {
  const styles: Record<string, string> = {};
  const background = resolveTokenBackground(props.bgColor);
  
  if (background) {
    styles.background = background;
  } else if (props.variant === 'gradient') {
    styles.background = 'var(--ntk-primary-gradient)';
  }
  
  return styles;
});

const containerStyle = computed(() => ({
  maxWidth: `${props.maxWidth}px`,
}));

const primaryBtnStyle = computed(() => {
  if (props.variant === 'gradient' || props.variant === 'dark') {
    return {
      background: 'var(--ntk-bg-primary)',
      color: 'var(--ntk-primary)',
    };
  }
  return {
    background: 'var(--ntk-primary-gradient)',
    color: 'var(--ntk-text-on-accent)',
  };
});
</script>

<style scoped lang="scss">
.ntk-cta-section {
  width: 100%;
}

.cta-container {
  margin: 0 auto;
  padding: 0 20px;
}

// Variants
.variant-default {
  background: var(--ntk-bg-secondary);
  
  .cta-title,
  .cta-subtitle {
    color: var(--ntk-text-primary);
  }
  
  .cta-btn--secondary {
    color: var(--ntk-text-secondary);
    border-color: var(--ntk-border-color);
    
    &:hover {
      text-decoration: none;
      background: var(--ntk-bg-hover);
    }
  }
}

.variant-gradient {
  .cta-title,
  .cta-subtitle {
    color: var(--ntk-text-inverse);
  }
  
  .cta-btn--secondary {
    color: var(--ntk-text-inverse);
    border-color: var(--ntk-border-light);
    
    &:hover {
      text-decoration: none;
      background: var(--ntk-bg-overlay);
    }
  }
}

.variant-dark {
  background: var(--ntk-bg-dark);
  
  .cta-title,
  .cta-subtitle {
    color: var(--ntk-text-inverse);
  }
  
  .cta-btn--secondary {
    color: var(--ntk-text-inverse);
    border-color: var(--ntk-border-light);
    
    &:hover {
      text-decoration: none;
      background: var(--ntk-bg-overlay);
    }
  }
}

.variant-light {
  background: var(--ntk-bg-primary);
  border-top: 1px solid var(--ntk-border-color);
  border-bottom: 1px solid var(--ntk-border-color);
  
  .cta-title,
  .cta-subtitle {
    color: var(--ntk-text-primary);
  }
  
  .cta-btn--secondary {
    color: var(--ntk-text-secondary);
    border-color: var(--ntk-border-color);
    
    &:hover {
      text-decoration: none;
      background: var(--ntk-bg-hover);
    }
  }
}

// Sizes
.size-sm {
  padding: var(--ntk-spacing-xl) 0;
  
  .cta-title {
    font-size: var(--ntk-text-xl);
  }
  
  .cta-subtitle {
    font-size: var(--ntk-text-base);
  }
}

.size-md {
  padding: var(--ntk-spacing-2xl) 0;
  
  .cta-title {
    font-size: var(--ntk-text-2xl);
  }
  
  .cta-subtitle {
    font-size: var(--ntk-text-lg);
  }
}

.size-lg {
  padding: var(--ntk-spacing-3xl) 0;
  
  .cta-title {
    font-size: var(--ntk-text-3xl);
  }
  
  .cta-subtitle {
    font-size: var(--ntk-text-xl);
  }
}

// Layouts
.layout-centered {
  .cta-container {
    text-align: center;
  }
  
  .cta-content {
    margin-bottom: var(--ntk-spacing-lg);
  }
  
  .cta-actions {
    justify-content: center;
  }
}

.layout-split {
  .cta-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ntk-spacing-xl);
    
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .cta-content {
    flex: 1;
  }
  
  .cta-actions {
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }
}

// Content
.cta-title {
  font-family: var(--ntk-font-family-display);
  font-weight: var(--ntk-font-weight-bold);
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.cta-subtitle {
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

// Botões
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--ntk-spacing-sm) var(--ntk-spacing-lg);
  font-size: var(--ntk-text-base);
  font-weight: var(--ntk-font-weight-semibold);
  text-decoration: none;
  border-radius: var(--ntk-radius-md);
  transition: all var(--ntk-transition-fast);
  
  &--primary {
    box-shadow: var(--ntk-shadow-medium);
    
    &:hover {
      text-decoration: none;
      transform: translateY(-2px);
      box-shadow: var(--ntk-shadow-large);
    }
  }
  
  &--secondary {
    background: transparent;
    border: 2px solid;
    
    &:hover {
      text-decoration: none;
      transform: translateY(-2px);
    }
  }
}
</style>
