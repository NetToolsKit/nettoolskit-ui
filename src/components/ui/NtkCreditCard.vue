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
  /** Ícone (emoji ou texto) */
  icon: string;
  /** Nome da ação */
  name: string;
  /** Descrição da ação */
  description?: string;
  /** Quantidade de créditos */
  credits: number;
  /** Label dos créditos */
  creditLabel?: string;
  /** Variante visual */
  variant?: 'default' | 'compact' | 'detailed';
  /** Efeito hover */
  hoverable?: boolean;
  /** Cor do ícone */
  iconColor?: string;
  /** Cor do valor */
  amountColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  creditLabel: 'créditos',
  variant: 'default',
  hoverable: true,
});

const iconStyle = computed(() => {
  if (props.iconColor) {
    return { backgroundColor: props.iconColor };
  }
  return {
    backgroundColor: `rgba(var(--ntk-primary-rgb), 0.15)`,
  };
});

const amountStyle = computed(() => ({
  color: props.amountColor || 'var(--ntk-primary)',
}));

const formattedCredits = computed(() => {
  return props.credits.toLocaleString('pt-BR');
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

// Variantes
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
