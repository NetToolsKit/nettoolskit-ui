<template>
  <div 
    class="ntk-steps" 
    :class="[
      `layout-${layout}`,
      `variant-${variant}`,
      { 'show-arrows': showArrows }
    ]"
  >
    <template
      v-for="(step, index) in steps"
      :key="step.number || index"
    >
      <div
        class="step"
        :class="{ 'active': activeStep === index }"
      >
        <div
          class="step-number"
          :style="numberStyle"
        >
          <slot
            name="number"
            :step="step"
            :index="index"
          >
            {{ step.number || index + 1 }}
          </slot>
        </div>
        <div class="step-content">
          <h3 class="step-title">
            {{ step.title }}
          </h3>
          <p
            v-if="step.description"
            class="step-description"
          >
            {{ step.description }}
          </p>
          <slot
            :name="`step-${index}`"
            :step="step"
          />
        </div>
      </div>
      
      <div 
        v-if="showArrows && index < steps.length - 1" 
        class="step-connector"
        :class="connectorClass"
      >
        <span class="connector-icon">{{ connectorIcon }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Src/components/ui/Ntk Steps module.
 */

import { computed } from 'vue';

export interface Step {
  number?: number | string;
  title: string;
  description?: string;
  icon?: string;
}

interface Props {
  /** Step list */
  steps: Step[];
  /** Step layout */
  layout?: 'horizontal' | 'vertical';
  /** Visual variant */
  variant?: 'default' | 'numbered' | 'timeline' | 'minimal';
  /** Whether to show connectors between steps */
  showArrows?: boolean;
  /** Connector icon */
  connectorIcon?: string;
  /** Active step for highlighting */
  activeStep?: number;
  /** Number color override */
  numberColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  variant: 'default',
  showArrows: true,
  connectorIcon: '→',
  activeStep: -1,
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

const numberStyle = computed(() => {
  const numberColor = resolveTokenColor(props.numberColor);
  if (!numberColor) {
    return {
      background: 'var(--ntk-primary-gradient)',
    };
  }

  return {
    background: `linear-gradient(135deg, ${numberColor} 0%, var(--ntk-primary-dark, var(--ntk-primary)) 100%)`,
  };
});

const connectorClass = computed(() => ({
  'horizontal': props.layout === 'horizontal',
  'vertical': props.layout === 'vertical',
}));
</script>

<style scoped lang="scss">
.ntk-steps {
  display: flex;
  gap: 1rem;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

// Layouts
.layout-horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  
  .step {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    text-align: center;
  }
  
  .step-number {
    margin: 0 auto 1rem;
  }
  
  .step-connector {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    margin-top: 1.5rem;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
}

.layout-vertical {
  flex-direction: column;
  
  .step {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .step-number {
    flex-shrink: 0;
  }
  
  .step-connector {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0;
    margin-left: 1.25rem;
    
    .connector-icon {
      transform: rotate(90deg);
    }
  }
}

// Step
.step {
  position: relative;
}

.step-number {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--ntk-text-inverse);
  font-size: var(--ntk-font-size-xl);
  font-weight: var(--ntk-font-weight-bold);
  box-shadow: var(--ntk-shadow-md);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-dark);
  margin: 0 0 0.5rem 0;
  font-family: var(--ntk-font-family-display);
}

.step-description {
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-light);
  margin: 0;
  line-height: 1.6;
}

// Connector
.step-connector {
  .connector-icon {
    font-size: 1.5rem;
    color: var(--ntk-text-muted);
  }
}

// Variants
.variant-timeline {
  .layout-vertical & {
    .step {
      position: relative;
      padding-left: 2rem;
      
      &::before {
        content: '';
        position: absolute;
        left: 1.5rem;
        top: 3rem;
        bottom: -1rem;
        width: 2px;
        background: var(--ntk-border-color);
      }
      
      &:last-child::before {
        display: none;
      }
    }
    
    .step-number {
      position: absolute;
      left: 0;
      z-index: 1;
    }
  }
}

.variant-minimal {
  .step-number {
    width: 32px;
    height: 32px;
    font-size: var(--ntk-font-size-sm);
  }
  
  .step-title {
    font-size: var(--ntk-font-size-base);
  }
  
  .step-description {
    font-size: var(--ntk-font-size-xs);
  }
}

// Active state
.step.active {
  .step-number {
    transform: scale(1.1);
    box-shadow: var(--ntk-shadow-lg);
  }
  
  .step-title {
    color: var(--ntk-primary);
  }
}
</style>
