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
import { computed } from 'vue';
import { useTheme } from '../../composables/ui/useTheme';

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
  /** Título principal */
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
  /** Largura máxima do container */
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

const { theme } = useTheme();

const sectionClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
  `layout-${props.layout}`,
]);

const sectionStyle = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.bgColor) {
    styles.background = props.bgColor;
  } else if (props.variant === 'gradient') {
    styles.background = theme.value.gradients.primary;
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
      color: theme.value.colors.primary,
    };
  }
  return {
    background: theme.value.gradients.primary,
    color: 'var(--ntk-text-inverse)',
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

// Variantes
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

// Tamanhos
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

// Conteúdo
.cta-title {
  font-family: var(--ntk-font-family-display);
  font-weight: 700;
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
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  
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
