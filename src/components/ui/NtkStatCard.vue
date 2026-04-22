<template>
  <div
    class="ntk-stat-card"
    :class="cardClasses"
  >
    <!-- Icon -->
    <div
      v-if="icon || $slots.icon"
      class="stat-icon"
      :style="iconStyle"
    >
      <slot name="icon">
        <span>{{ icon }}</span>
      </slot>
    </div>
    
    <!-- Value -->
    <div class="stat-value">
      <span
        v-if="prefix"
        class="stat-prefix"
      >{{ prefix }}</span>
      <span
        class="stat-number"
        :style="valueStyle"
      >{{ formattedValue }}</span>
      <span
        v-if="suffix"
        class="stat-suffix"
      >{{ suffix }}</span>
    </div>
    
    <!-- Label -->
    <div class="stat-label">
      {{ label }}
    </div>
    
    <!-- Trend -->
    <div
      v-if="trend"
      class="stat-trend"
      :class="trendClass"
    >
      <span class="trend-icon">{{ trend.direction === 'up' ? '↑' : '↓' }}</span>
      <span class="trend-value">{{ Math.abs(trend.value) }}%</span>
    </div>
    
    <!-- Extra content -->
    <div
      v-if="$slots.default"
      class="stat-extra"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Src/components/ui/Ntk Stat Card module.
 */

import { computed } from 'vue';

/**
 * NtkStatCard - Card de estatísticas/métricas
 * 
 * Usado em landing pages para exibir números importantes como:
 * - Usuários ativos
 * - Downloads
 * - Avaliações
 * - Métricas de negócio
 */

interface TrendData {
  value: number;
  direction: 'up' | 'down';
}

interface Props {
  /** Primary value as number or string */
  value: string | number;
  /** Descriptive label */
  label: string;
  /** Icon as emoji or text */
  icon?: string;
  /** Prefix before the value, for example R$ or $ */
  prefix?: string;
  /** Suffix after the value, for example +, %, or K */
  suffix?: string;
  /** Trend data */
  trend?: TrendData;
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'gradient' | 'minimal';
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Value color override */
  valueColor?: string;
  /** Icon color override */
  iconColor?: string;
  /** Animação de contagem */
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  animated: false,
});

const cardClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
]);

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    // Formata números grandes (1000 -> 1K, 1000000 -> 1M)
    if (props.value >= 1000000) {
      return (props.value / 1000000).toFixed(1) + 'M';
    }
    if (props.value >= 1000) {
      return (props.value / 1000).toFixed(1) + 'K';
    }
    return props.value.toLocaleString('pt-BR');
  }
  return props.value;
});

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

const valueStyle = computed(() => {
  const valueColor = resolveTokenColor(props.valueColor);
  if (valueColor) {
    return { color: valueColor };
  }
  if (props.variant === 'gradient') {
    return {
      background: 'var(--ntk-primary-gradient)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };
  }
  return {};
});

const iconStyle = computed(() => {
  const iconColor = resolveTokenColor(props.iconColor);
  if (iconColor) {
    return { color: iconColor };
  }
  return { color: 'var(--ntk-primary)' };
});

const trendClass = computed(() => ({
  'trend-up': props.trend?.direction === 'up',
  'trend-down': props.trend?.direction === 'down',
}));
</script>

<style scoped lang="scss">
.ntk-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--ntk-spacing-lg);
  border-radius: var(--ntk-radius-lg);
  transition: all var(--ntk-transition-fast);
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

// Variants
.variant-default {
  background: var(--ntk-bg-primary);
  border: var(--border-width-sm) solid var(--ntk-border-color);
  
  &:hover {
    box-shadow: var(--ntk-shadow-medium);
  }
}

.variant-outlined {
  background: transparent;
  border: var(--border-width-md) solid var(--ntk-border-color);
  
  &:hover {
    border-color: var(--ntk-border-dark);
  }
}

.variant-gradient {
  background: var(--ntk-gradient-subtle);
  border: var(--border-width-sm) solid var(--ntk-border-color);
  
  &:hover {
    box-shadow: var(--ntk-shadow-medium);
  }
}

.variant-minimal {
  background: transparent;
  border: none;
  padding: var(--ntk-spacing-md);
}

// Icon
.stat-icon {
  font-size: var(--ntk-text-2xl);
  margin-bottom: var(--ntk-spacing-md);
}

// Value
.stat-value {
  display: flex;
  align-items: baseline;
  gap: var(--ntk-spacing-xxs);
  margin-bottom: var(--ntk-spacing-sm);
}

.stat-prefix,
.stat-suffix {
  font-size: var(--ntk-text-xl);
  font-weight: 600;
  color: var(--ntk-text-secondary);
}

.stat-number {
  font-size: var(--ntk-text-3xl);
  font-weight: 800;
  color: var(--ntk-text-primary);
  line-height: 1;
  font-family: var(--ntk-font-display);
}

// Label
.stat-label {
  font-size: var(--ntk-text-sm);
  color: var(--ntk-text-secondary);
  font-weight: 500;
}

// Trend
.stat-trend {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-xxs);
  margin-top: var(--ntk-spacing-sm);
  font-size: var(--ntk-text-xs);
  font-weight: 600;
  padding: var(--ntk-spacing-xxs) var(--ntk-spacing-sm);
  border-radius: var(--ntk-radius-lg);
  
  &.trend-up {
    background: var(--semantic-success-light);
    color: var(--semantic-success);
  }
  
  &.trend-down {
    background: var(--semantic-error-light);
    color: var(--semantic-error);
  }
}

.stat-extra {
  margin-top: var(--ntk-spacing-md);
}

// Sizes
.size-sm {
  padding: var(--ntk-spacing-md);
  
  .stat-icon {
    font-size: var(--ntk-text-lg);
    margin-bottom: var(--ntk-spacing-sm);
  }
  
  .stat-number {
    font-size: var(--ntk-text-xl);
  }
  
  .stat-prefix,
  .stat-suffix {
    font-size: var(--ntk-text-base);
  }
  
  .stat-label {
    font-size: var(--ntk-text-xs);
  }
}

.size-lg {
  padding: var(--ntk-spacing-2xl);
  
  .stat-icon {
    font-size: var(--ntk-text-3xl);
    margin-bottom: var(--ntk-spacing-lg);
  }
  
  .stat-number {
    font-size: var(--ntk-text-4xl);
  }
  
  .stat-prefix,
  .stat-suffix {
    font-size: var(--ntk-text-2xl);
  }
  
  .stat-label {
    font-size: var(--ntk-text-base);
  }
}
</style>
