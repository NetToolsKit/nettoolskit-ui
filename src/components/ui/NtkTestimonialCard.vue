<template>
  <div
    class="ntk-testimonial-card"
    :class="cardClasses"
  >
    <!-- Quote Icon -->
    <div
      v-if="showQuoteIcon"
      class="testimonial-quote-icon"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
      </svg>
    </div>
    
    <!-- Quote Text -->
    <blockquote class="testimonial-quote">
      <slot name="quote">
        {{ quote }}
      </slot>
    </blockquote>
    
    <!-- Rating -->
    <div
      v-if="rating"
      class="testimonial-rating"
    >
      <span 
        v-for="star in 5" 
        :key="star" 
        class="rating-star"
        :class="{ 'filled': star <= rating }"
      >
        ★
      </span>
    </div>
    
    <!-- Author -->
    <div class="testimonial-author">
      <div
        v-if="avatar || $slots.avatar"
        class="author-avatar"
      >
        <slot name="avatar">
          <img
            :src="avatar"
            :alt="author"
          >
        </slot>
      </div>
      <div class="author-info">
        <div class="author-name">
          {{ author }}
        </div>
        <div
          v-if="role || company"
          class="author-role"
        >
          {{ role }}<span v-if="role && company">, </span>{{ company }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * NtkTestimonialCard - Card de depoimento/testemunho
 * 
 * Usado em landing pages para exibir avaliações de clientes:
 * - Depoimentos
 * - Reviews
 * - Casos de sucesso
 */

interface Props {
  /** Texto do depoimento */
  quote: string;
  /** Nome do autor */
  author: string;
  /** Cargo/função do autor */
  role?: string;
  /** Empresa do autor */
  company?: string;
  /** URL do avatar */
  avatar?: string;
  /** Avaliação (1-5 estrelas) */
  rating?: number;
  /** Variante visual */
  variant?: 'default' | 'featured' | 'minimal' | 'bordered';
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar ícone de aspas */
  showQuoteIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  showQuoteIcon: true,
});

const cardClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
]);
</script>

<style scoped lang="scss">
.ntk-testimonial-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

// Variantes
.variant-default {
  background: var(--ntk-bg-card);
  border: 1px solid var(--ntk-border-color);
  
  &:hover {
    box-shadow: var(--ntk-shadow-md);
  }
}

.variant-featured {
  background: linear-gradient(
    135deg,
    var(--ntk-bg-secondary) 0%,
    var(--ntk-bg-card) 100%
  );
  border: 2px solid var(--ntk-border-color);
  box-shadow: var(--ntk-shadow-md);
  
  &:hover {
    box-shadow: var(--ntk-shadow-lg);
    transform: translateY(-4px);
  }
}

.variant-minimal {
  background: transparent;
  border: none;
  padding: 1rem;
}

.variant-bordered {
  background: var(--ntk-bg-card);
  border-left: 4px solid var(--ntk-primary);
  border-radius: 0 12px 12px 0;
  box-shadow: var(--ntk-shadow-sm);
}

// Quote Icon
.testimonial-quote-icon {
  color: var(--ntk-border-color);
  margin-bottom: 0.75rem;
  
  .variant-featured & {
    color: var(--ntk-primary);
    opacity: 0.3;
  }
}

// Quote
.testimonial-quote {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--ntk-text-secondary);
  margin: 0 0 1rem 0;
  font-style: italic;
  flex: 1;
}

// Rating
.testimonial-rating {
  display: flex;
  gap: 2px;
  margin-bottom: 1rem;
}

.rating-star {
  font-size: 1rem;
  color: var(--ntk-border-color);
  
  &.filled {
    color: var(--ntk-warning);
  }
}

// Author
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ntk-text-primary);
}

.author-role {
  font-size: 0.8125rem;
  color: var(--ntk-text-muted);
}

// Tamanhos
.size-sm {
  padding: 1rem;
  
  .testimonial-quote-icon svg {
    width: 24px;
    height: 24px;
  }
  
  .testimonial-quote {
    font-size: 0.875rem;
  }
  
  .author-avatar {
    width: 36px;
    height: 36px;
  }
  
  .author-name {
    font-size: 0.8125rem;
  }
  
  .author-role {
    font-size: 0.75rem;
  }
}

.size-lg {
  padding: 2rem;
  
  .testimonial-quote-icon svg {
    width: 40px;
    height: 40px;
  }
  
  .testimonial-quote {
    font-size: 1.125rem;
  }
  
  .author-avatar {
    width: 56px;
    height: 56px;
  }
  
  .author-name {
    font-size: 1rem;
  }
  
  .author-role {
    font-size: 0.875rem;
  }
}
</style>
