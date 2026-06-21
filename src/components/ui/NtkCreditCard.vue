<template>
  <div 
    class="credit-card" 
    :class="[
      `variant-${variant}`,
      { 'hoverable': hoverable }
    ]"
  >
    <div
      class="credit-icon"
      :style="iconStyle"
    >
      <slot name="icon">
        <span>{{ icon }}</span>
      </slot>
    </div>
    
    <div class="credit-info">
      <h4 class="credit-name">
        {{ name }}
      </h4>
      <p
        v-if="description"
        class="credit-description"
      >
        {{ description }}
      </p>
    </div>
    
    <div
      class="credit-amount"
      :style="amountStyle"
    >
      <span class="amount">{{ formattedCredits }}</span>
      <span class="label">{{ creditLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Src/components/ui/Ntk Credit Card module.
 */

import { computed } from 'vue';

interface Props {
  /** Icon as emoji or text */
  icon: string;
  /** Action name */
  name: string;
  /** Action description */
  description?: string;
  /** Credit amount */
  credits: number;
  /** Credit label */
  creditLabel?: string;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'detailed';
  /** Hover effect flag */
  hoverable?: boolean;
  /** Icon color */
  iconColor?: string;
  /** Amount color */
  amountColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  creditLabel: 'credits',
  variant: 'default',
  hoverable: true,
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

const iconStyle = computed(() => {
  const iconColor = resolveTokenColor(props.iconColor);
  return iconColor ? { backgroundColor: iconColor } : {};
});

const amountStyle = computed(() => ({
  color: resolveTokenColor(props.amountColor) || 'var(--ntk-primary)',
}));

const formattedCredits = computed(() => {
  return props.credits.toLocaleString('en-US');
});
</script>

<style scoped lang="scss">
.credit-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--ntk-card-bg);
  border: 1px solid var(--ntk-card-border);
  border-radius: var(--ntk-radius-lg);
  transition: all 0.2s ease;
  
  &.hoverable:hover {
    border-color: var(--ntk-primary);
    box-shadow: var(--ntk-shadow-md);
  }
}

.credit-icon {
  background: var(--ntk-credit-card-icon-bg, var(--ntk-bg-active, var(--ntk-accent-soft)));
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ntk-radius-lg);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.credit-info {
  flex: 1;
  min-width: 0;
}

.credit-name {
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-dark);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.credit-description {
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.credit-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  
  .amount {
    font-size: 1.5rem;
    font-weight: var(--ntk-font-weight-bold);
    line-height: 1;
  }
  
  .label {
    font-size: var(--ntk-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
  }
}

// Variants
.variant-compact {
  padding: 0.75rem 1rem;
  
  .credit-icon {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
    border-radius: var(--ntk-radius-md);
  }
  
  .credit-name {
    font-size: var(--ntk-font-size-xs);
  }
  
  .credit-description {
    display: none;
  }
  
  .credit-amount {
    .amount {
      font-size: var(--ntk-font-size-xl);
    }
    
    .label {
      font-size: 0.65rem;
    }
  }
}

.variant-detailed {
  flex-direction: column;
  text-align: center;
  padding: 1.5rem;
  
  .credit-icon {
    width: 64px;
    height: 64px;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .credit-info {
    margin-bottom: 0.5rem;
  }
  
  .credit-name {
    white-space: normal;
  }
  
  .credit-description {
    white-space: normal;
  }
  
  .credit-amount {
    align-items: center;
    
    .amount {
      font-size: 2rem;
    }
  }
}
</style>
