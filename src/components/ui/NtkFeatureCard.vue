<template>
  <div 
    class="feature-card" 
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { 'hoverable': hoverable, 'clickable': clickable }
    ]"
    @click="handleClick"
  >
    <div
      class="feature-icon"
      :class="[`icon-${iconStyle}`]"
      :style="iconCustomStyle"
    >
      <slot name="icon">
        <span v-if="icon">{{ icon }}</span>
      </slot>
    </div>
    
    <div class="feature-content">
      <h3 class="feature-title">
        {{ title }}
      </h3>
      <p
        v-if="description"
        class="feature-description"
      >
        {{ description }}
      </p>
      <slot />
    </div>
    
    <div
      v-if="$slots.footer"
      class="feature-footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Src/components/ui/Ntk Feature Card module.
 */

import { computed } from 'vue';

interface Props {
  /** Ícone (emoji ou texto) */
  icon?: string;
  /** Título do card */
  title: string;
  /** Descrição do card */
  description?: string;
  /** Variante visual */
  variant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top';
  /** Tamanho do card */
  size?: 'sm' | 'md' | 'lg';
  /** Estilo do ícone */
  iconStyle?: 'default' | 'circle' | 'square' | 'gradient';
  /** Cor do ícone (sobrescreve tema) */
  iconColor?: string;
  /** Efeito hover */
  hoverable?: boolean;
  /** Card clicável */
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  iconStyle: 'default',
  hoverable: true,
  clickable: false,
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const iconCustomStyle = computed(() => {
  if (props.iconColor) {
    return { color: props.iconColor };
  }
  if (props.iconStyle === 'gradient') {
    return {
      background: 'var(--ntk-primary-gradient)',
      color: 'var(--ntk-text-on-accent)',
    };
  }
  return {};
});

const handleClick = () => {
  if (props.clickable) {
    emit('click');
  }
};
</script>

<style scoped lang="scss">
.feature-card {
  display: flex;
  flex-direction: column;
  padding: var(--ntk-spacing-lg);
  background: var(--ntk-card-bg);
  border-radius: var(--ntk-radius-lg);
  transition: all var(--ntk-transition-base);
  
  &.hoverable:hover {
    transform: translateY(calc(var(--ntk-spacing-xs) * -1));
    box-shadow: var(--ntk-shadow-lg);
  }
  
  &.clickable {
    cursor: pointer;
  }
}

// Variantes
.variant-default {
  border: var(--border-width-sm) solid var(--ntk-card-border);
}

.variant-outlined {
  border: var(--border-width-md) solid var(--ntk-card-border);
  background: transparent;
}

.variant-elevated {
  box-shadow: var(--ntk-shadow-md);
  border: none;
}

.variant-accent-left {
  border-left: 4px solid var(--ntk-primary);
  border-radius: 0 var(--ntk-radius-lg) var(--ntk-radius-lg) 0;
  box-shadow: var(--ntk-shadow-sm);
}

.variant-accent-top {
  border-top: 4px solid var(--ntk-primary);
  box-shadow: var(--ntk-shadow-sm);
}

// Ícone
.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  
  &.icon-circle {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ntk-bg-tertiary);
    border-radius: 50%;
  }
  
  &.icon-square {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ntk-bg-tertiary);
    border-radius: var(--ntk-radius-lg);
  }
  
  &.icon-gradient {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--ntk-radius-lg);
    font-size: 1.5rem;
  }
}

// Conteúdo
.feature-content {
  flex: 1;
}

.feature-title {
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-dark);
  margin: 0 0 0.5rem 0;
  font-family: var(--ntk-font-family-display);
}

.feature-description {
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-light);
  margin: 0;
  line-height: 1.6;
}

.feature-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ntk-card-border);
}

// Tamanhos
.size-sm {
  padding: 1rem;
  
  .feature-icon {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    
    &.icon-circle,
    &.icon-square,
    &.icon-gradient {
      width: 40px;
      height: 40px;
      font-size: 1.25rem;
    }
  }
  
  .feature-title {
    font-size: var(--ntk-font-size-base);
  }
  
  .feature-description {
    font-size: var(--ntk-font-size-xs);
  }
}

.size-lg {
  padding: 2rem;
  
  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1.25rem;
    
    &.icon-circle,
    &.icon-square,
    &.icon-gradient {
      width: 72px;
      height: 72px;
      font-size: 2rem;
    }
  }
  
  .feature-title {
    font-size: var(--ntk-font-size-xl);
  }
  
  .feature-description {
    font-size: var(--ntk-font-size-base);
  }
}
</style>
