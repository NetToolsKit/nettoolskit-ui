<template>
  <q-page
    class="ntk-template-not-found"
    role="alert"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-not-found__container">
      <div class="ntk-template-not-found__code">
        {{ code }}
      </div>

      <h1 class="ntk-template-not-found__title">
        {{ title }}
      </h1>

      <p class="ntk-template-not-found__description">
        {{ description }}
      </p>

      <div class="ntk-template-not-found__actions">
        <q-btn
          v-if="showSecondaryAction"
          no-caps
          :label="secondaryAction.label"
          :icon="secondaryAction.icon"
          :to="secondaryAction.to"
          :disable="secondaryAction.disable"
          :flat="secondaryAction.flat ?? false"
          :outline="secondaryAction.outline ?? true"
          :unelevated="secondaryAction.unelevated ?? false"
          :aria-label="secondaryAction.ariaLabel || secondaryAction.label"
          :class="resolveActionClass(secondaryAction, 'neutral')"
          @click="handleSecondaryActionClick"
        />

        <q-btn
          no-caps
          :label="primaryAction.label"
          :icon="primaryAction.icon"
          :to="primaryAction.to"
          :disable="primaryAction.disable"
          :flat="primaryAction.flat ?? false"
          :outline="primaryAction.outline ?? false"
          :unelevated="primaryAction.unelevated ?? true"
          :aria-label="primaryAction.ariaLabel || primaryAction.label"
          :class="resolveActionClass(primaryAction, 'primary')"
          @click="handlePrimaryActionClick"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import type {
  TemplatePageAction,
  TemplatePageTone,
} from '../page-template.types'

const props = withDefaults(defineProps<{
  code?: string
  title?: string
  description?: string
  primaryAction?: TemplatePageAction
  secondaryAction?: TemplatePageAction
  showSecondaryAction?: boolean
  pageAriaLabel?: string
}>(), {
  code: '404',
  title: 'Page not found',
  description: 'The page you are looking for does not exist or was moved.',
  primaryAction: () => ({
    id: 'go-home',
    label: 'Go to home',
    icon: 'home',
    to: '/',
  }),
  secondaryAction: () => ({
    id: 'go-back',
    label: 'Go back',
    icon: 'arrow_back',
  }),
  showSecondaryAction: true,
  pageAriaLabel: 'Not found page',
})

const emit = defineEmits<{
  'action-click': [actionId: string]
}>()

const router = useRouter()

function handlePrimaryActionClick(): void {
  emit('action-click', props.primaryAction.id)
}

function handleSecondaryActionClick(): void {
  emit('action-click', props.secondaryAction.id)

  if (!props.secondaryAction.to) {
    router.back()
  }
}

function resolveActionClass(
  action: TemplatePageAction,
  fallbackTone: TemplatePageTone,
): string[] {
  const variant = action.flat ? 'flat' : action.outline ? 'outline' : 'solid'

  return [
    'ntk-template-tone-action',
    `ntk-template-tone-action--tone-${resolveActionTone(action.color, fallbackTone)}`,
    `ntk-template-tone-action--variant-${variant}`,
  ]
}

function resolveActionTone(
  color: string | undefined,
  fallback: TemplatePageTone,
): TemplatePageTone {
  const value = color?.trim().toLowerCase() ?? ''

  if (!value) {
    return fallback
  }

  if (['primary', 'accent', 'brand', 'blue', 'indigo', 'violet'].includes(value)) {
    return 'primary'
  }

  if (['info', 'cyan', 'teal'].includes(value)) {
    return 'info'
  }

  if (['positive', 'success', 'green'].includes(value)) {
    return 'success'
  }

  if (['warning', 'amber', 'orange', 'yellow'].includes(value)) {
    return 'warning'
  }

  if (['negative', 'danger', 'error', 'red'].includes(value)) {
    return 'danger'
  }

  if (
    value.startsWith('grey')
    || value.startsWith('gray')
    || ['neutral', 'slate', 'dark', 'secondary'].includes(value)
  ) {
    return 'neutral'
  }

  return fallback
}
</script>

<style scoped lang="scss">
.ntk-template-not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 18px;
  background: var(
    --ntk-template-not-found-bg,
    radial-gradient(circle at top, var(--ntk-primary-gradient-start, var(--ntk-accent)) 0%, var(--ntk-primary-gradient-end, var(--ntk-accent-hover, var(--ntk-accent))) 100%)
  );
  color: var(--ntk-template-not-found-text, var(--ntk-text-on-accent, var(--ntk-text-primary)));
}

.ntk-template-not-found__container {
  width: min(620px, 100%);
  text-align: center;
  padding: 28px 24px;
  border-radius: 18px;
  background: var(--ntk-template-not-found-card-bg, color-mix(in srgb, var(--ntk-text-primary) 60%, transparent));
  border: 1px solid var(--ntk-template-not-found-border, color-mix(in srgb, var(--ntk-border-color) 35%, transparent));
  backdrop-filter: blur(4px);
}

.ntk-template-not-found__code {
  font-size: clamp(72px, 16vw, 160px);
  line-height: 0.85;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--ntk-template-not-found-code-color, var(--semantic-info-primary, var(--ntk-info)));
  text-shadow: 0 6px 16px var(--ntk-template-not-found-code-shadow, color-mix(in srgb, var(--ntk-text-primary) 35%, transparent));
}

.ntk-template-not-found__title {
  margin: 12px 0 0;
  font-size: 30px;
  line-height: 1.15;
}

.ntk-template-not-found__description {
  margin: 10px auto 0;
  max-width: 500px;
  font-size: 15px;
  color: var(--ntk-template-not-found-subtitle, color-mix(in srgb, var(--ntk-template-not-found-text) 82%, transparent));
}

.ntk-template-not-found__actions {
  margin-top: 22px;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

@media (max-width: 768px) {
  .ntk-template-not-found__container {
    padding: 22px 16px;
  }

  .ntk-template-not-found__title {
    font-size: 24px;
  }
}
</style>
