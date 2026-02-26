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
import { computed } from 'vue';
import { useTheme } from '../../composables/ui/useTheme';

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
  /** Valor principal (número ou string) */
  value: string | number;
  /** Label descritivo */
  label: string;
  /** Ícone (emoji ou texto) */
  icon?: string;
  /** Prefixo antes do valor (ex: R$, $) */
  prefix?: string;
  /** Sufixo após o valor (ex: +, %, K) */
  suffix?: string;
  /** Dados de tendência */
  trend?: TrendData;
  /** Variante visual */
  variant?: 'default' | 'outlined' | 'gradient' | 'minimal';
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Cor do valor (sobrescreve tema) */
  valueColor?: string;
  /** Cor do ícone (sobrescreve tema) */
  iconColor?: string;
  /** Animação de contagem */
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  animated: false,
});

const { theme } = useTheme();

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

const valueStyle = computed(() => {
  if (props.valueColor) {
    return { color: props.valueColor };
  }
  if (props.variant === 'gradient') {
    return {
      background: theme.value.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };
  }
  return {};
});

const iconStyle = computed(() => {
  if (props.iconColor) {
    return { color: props.iconColor };
  }
  return { color: theme.value.colors.primary };
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
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

// Variantes
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

// Ícone
.stat-icon {
  font-size: var(--ntk-text-2xl);
  margin-bottom: var(--ntk-spacing-md);
}

// Valor
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
  border-radius: var(--border-radius-lg);
  
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

// Tamanhos
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