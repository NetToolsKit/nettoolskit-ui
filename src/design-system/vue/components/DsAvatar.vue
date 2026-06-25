<template>
  <span :id="id" :class="classes" :data-testid="testId">
    <img
      v-if="src"
      class="ntk-avatar__image"
      :src="src"
      :alt="imageAlt"
    >
    <span
      v-else-if="initials"
      class="ntk-avatar__initials"
      role="img"
      :aria-label="name"
    >{{ initials }}</span>
    <span
      v-else
      class="ntk-avatar__icon"
      role="img"
      :aria-label="name || 'Avatar'"
    >{{ icon || '?' }}</span>
    <span
      v-if="status"
      class="ntk-avatar__status"
      :class="statusClass"
      :aria-label="status"
      role="status"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getNtkAvatarInitials,
  ntkAvatarDefaults,
  ntkAvatarStatusClassMap,
  resolveNtkAvatarRecipe,
  type NtkAvatarContract,
} from '../../core'

defineOptions({
  name: 'DsAvatar',
})

const props = withDefaults(defineProps<NtkAvatarContract>(), {
  variant: ntkAvatarDefaults.variant,
  size: ntkAvatarDefaults.size,
  intent: ntkAvatarDefaults.intent,
  shape: ntkAvatarDefaults.shape,
})

const initials = computed(() => getNtkAvatarInitials(props.name))
const imageAlt = computed(() => props.name ?? '')
const statusClass = computed(() => (props.status ? ntkAvatarStatusClassMap[props.status] : undefined))

const classes = computed(() => resolveNtkAvatarRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  shape: props.shape,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex-shrink: 0;
  overflow: visible;
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-secondary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  line-height: 1;
  user-select: none;
}

.ntk-avatar--size-sm {
  inline-size: 1.75rem;
  block-size: 1.75rem;
  font-size: var(--ntk-font-size-xs);
}

.ntk-avatar--size-lg {
  inline-size: 3.5rem;
  block-size: 3.5rem;
  font-size: var(--ntk-font-size-lg);
}

.ntk-avatar--size-xl {
  inline-size: 4.5rem;
  block-size: 4.5rem;
  font-size: var(--ntk-font-size-xl);
}

.ntk-avatar--shape-circle {
  border-radius: var(--ntk-radius-full);
}

.ntk-avatar--shape-square {
  border-radius: var(--ntk-radius-md);
}

.ntk-avatar--variant-solid.ntk-avatar--intent-primary {
  background: var(--ntk-primary);
  color: var(--ntk-text-on-primary);
}

.ntk-avatar--variant-solid.ntk-avatar--intent-success {
  background: var(--ntk-success);
  color: var(--ntk-text-inverse);
}

.ntk-avatar--variant-solid.ntk-avatar--intent-info {
  background: var(--ntk-info);
  color: var(--ntk-text-inverse);
}

.ntk-avatar--variant-soft.ntk-avatar--intent-primary {
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
}

.ntk-avatar--variant-outline {
  background: transparent;
  border: 1px solid var(--ntk-border-color);
  color: var(--ntk-text-primary);
}

.ntk-avatar__image {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.ntk-avatar__initials,
.ntk-avatar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ntk-avatar__status {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  inline-size: 0.75rem;
  block-size: 0.75rem;
  border: 2px solid var(--ntk-bg-card);
  border-radius: var(--ntk-radius-full);
  background: var(--ntk-text-muted);
}

.ntk-avatar__status--online {
  background: var(--ntk-success);
}

.ntk-avatar__status--offline {
  background: var(--ntk-text-muted);
}

.ntk-avatar__status--busy {
  background: var(--ntk-error);
}
</style>