<template>
  <component
    :is="href ? 'a' : 'span'"
    :id="id"
    :class="classes"
    :data-testid="testId"
    :href="href || undefined"
    :aria-label="resolvedAriaLabel"
  >
    <span v-if="mark" class="ntk-logo__mark" aria-hidden="true">{{ mark }}</span>
    <span v-if="showText" class="ntk-logo__content">
      <span class="ntk-logo__text">{{ text }}</span>
      <span v-if="showTagline && tagline" class="ntk-logo__tagline">{{ tagline }}</span>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkLogoDefaults,
  resolveNtkLogoRecipe,
  type NtkLogoContract,
} from '../../core'

defineOptions({
  name: 'DsLogo',
})

const props = withDefaults(defineProps<NtkLogoContract>(), {
  variant: ntkLogoDefaults.variant,
  size: ntkLogoDefaults.size,
  intent: ntkLogoDefaults.intent,
  showText: true,
  showTagline: false,
})

const classes = computed(() => resolveNtkLogoRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  clickable: Boolean(props.href),
  class: props.class,
}).classes)

// When the wordmark is hidden the visible mark is decorative, so the accessible
// name must come from an explicit label (falling back to the brand text).
const resolvedAriaLabel = computed(() => (
  props.showText ? props.ariaLabel : (props.ariaLabel ?? props.text)
))
</script>

<style scoped>
.ntk-logo {
  --ntk-logo-color: var(--ntk-primary);
  --ntk-logo-color-2: var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)));
  --ntk-logo-mark: 36px;
  --ntk-logo-text: var(--ntk-font-size-xl);
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  color: var(--ntk-text-primary);
  text-decoration: none;
  font-family: var(--ntk-font-family-display);
}

.ntk-logo--is-clickable {
  cursor: pointer;
}

.ntk-logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--ntk-logo-mark);
  block-size: var(--ntk-logo-mark);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-logo-color);
  color: var(--ntk-text-inverse);
  font-size: calc(var(--ntk-logo-mark) * 0.5);
  font-weight: var(--ntk-font-weight-bold);
  line-height: 1;
  box-shadow: var(--ntk-shadow-sm);
}

.ntk-logo--variant-gradient .ntk-logo__mark {
  background: linear-gradient(135deg, var(--ntk-logo-color) 0%, var(--ntk-logo-color-2) 100%);
}

.ntk-logo--variant-outline .ntk-logo__mark {
  background: transparent;
  border: 1px solid var(--ntk-logo-color);
  color: var(--ntk-logo-color);
  box-shadow: none;
}

.ntk-logo__content {
  display: inline-flex;
  flex-direction: column;
}

.ntk-logo__text {
  font-size: var(--ntk-logo-text);
  font-weight: var(--ntk-font-weight-bold);
  line-height: 1.1;
}

.ntk-logo__tagline {
  color: var(--ntk-text-muted);
  font-size: 0.65em;
  font-weight: var(--ntk-font-weight-normal);
}

.ntk-logo--intent-neutral {
  --ntk-logo-color: var(--ntk-text-secondary);
  --ntk-logo-color-2: var(--ntk-text-muted);
}

.ntk-logo--intent-success {
  --ntk-logo-color: var(--ntk-success, var(--ntk-primary));
  --ntk-logo-color-2: var(--ntk-success, var(--ntk-primary));
}

.ntk-logo--intent-warning {
  --ntk-logo-color: var(--ntk-warning, var(--ntk-primary));
  --ntk-logo-color-2: var(--ntk-warning, var(--ntk-primary));
}

.ntk-logo--intent-danger {
  --ntk-logo-color: var(--ntk-error, var(--ntk-primary));
  --ntk-logo-color-2: var(--ntk-error, var(--ntk-primary));
}

.ntk-logo--intent-info {
  --ntk-logo-color: var(--ntk-info, var(--ntk-primary));
  --ntk-logo-color-2: var(--ntk-info, var(--ntk-primary));
}

.ntk-logo--size-xs {
  --ntk-logo-mark: 24px;
  --ntk-logo-text: var(--ntk-font-size-sm);
  gap: var(--ntk-spacing-xs);
}

.ntk-logo--size-sm {
  --ntk-logo-mark: 28px;
  --ntk-logo-text: var(--ntk-font-size-md);
}

.ntk-logo--size-lg {
  --ntk-logo-mark: 48px;
  --ntk-logo-text: var(--ntk-font-size-2xl);
}

.ntk-logo--size-xl {
  --ntk-logo-mark: 64px;
  --ntk-logo-text: var(--ntk-font-size-3xl);
}
</style>