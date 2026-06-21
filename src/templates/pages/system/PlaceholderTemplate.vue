<template>
  <q-page
    class="ntk-template-placeholder"
    role="status"
    :aria-label="pageAriaLabel"
    :aria-live="stateAriaLive"
  >
    <section class="ntk-template-placeholder__shell">
      <div
        class="ntk-template-placeholder__decor"
        aria-hidden="true"
      />

      <q-card class="ntk-template-placeholder__card">
        <q-card-section class="ntk-template-placeholder__hero">
          <div class="ntk-template-placeholder__icon-wrap">
            <q-icon
              :name="icon"
              size="46px"
            />
          </div>

          <q-badge
            v-if="statusLabel"
            class="ntk-template-placeholder__status"
          >
            {{ statusLabel }}
          </q-badge>

          <h1 class="ntk-template-placeholder__title">
            {{ title }}
          </h1>

          <p class="ntk-template-placeholder__subtitle">
            {{ subtitle }}
          </p>

          <p
            v-if="description"
            class="ntk-template-placeholder__description"
          >
            {{ description }}
          </p>
        </q-card-section>

        <q-separator v-if="hints.length > 0 || hasActions" />

        <q-card-section
          v-if="hints.length > 0"
          class="ntk-template-placeholder__hints"
        >
          <div
            v-for="hint in hints"
            :key="hint.id"
            class="ntk-template-placeholder__hint"
          >
            <q-icon
              :name="hint.icon || 'check_circle'"
              size="16px"
            />
            <span>{{ hint.text }}</span>
          </div>
        </q-card-section>

        <q-card-actions
          v-if="hasActions"
          align="center"
          class="ntk-template-placeholder__actions"
          :aria-label="actionsAriaLabel"
        >
          <q-btn
            v-if="secondaryAction"
            no-caps
            :label="secondaryAction.label"
            :icon="secondaryAction.icon"
            :to="secondaryAction.to"
            :disable="secondaryAction.disable"
            :flat="secondaryAction.flat ?? false"
            :outline="secondaryAction.outline ?? true"
            :unelevated="secondaryAction.unelevated ?? false"
            :aria-label="secondaryAction.ariaLabel || secondaryAction.label"
            :class="resolveActionClass(secondaryAction, 'secondary')"
            @click="emitActionClick(secondaryAction)"
          />

          <q-btn
            v-if="primaryAction"
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
            @click="emitActionClick(primaryAction)"
          />
        </q-card-actions>
      </q-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type {
  TemplatePageAction,
  TemplatePageHint,
  TemplatePageTone,
} from '../page-template.types'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  description?: string
  icon?: string
  statusLabel?: string
  hints?: TemplatePageHint[]
  primaryAction?: TemplatePageAction | null
  secondaryAction?: TemplatePageAction | null
  pageAriaLabel?: string
  stateAriaLive?: 'off' | 'polite' | 'assertive'
  actionsAriaLabel?: string
}>(), {
  title: 'Module in progress',
  subtitle: 'This feature is currently under construction.',
  description: 'Use this template as a reusable placeholder until the final module is ready.',
  icon: 'construction',
  statusLabel: 'Planned',
  hints: () => [],
  primaryAction: null,
  secondaryAction: null,
  pageAriaLabel: 'Placeholder page',
  stateAriaLive: 'polite',
  actionsAriaLabel: 'Placeholder actions',
})

const emit = defineEmits<{
  'action-click': [actionId: string]
}>()

const hints = computed<TemplatePageHint[]>(() => props.hints)
const hasActions = computed<boolean>(() => Boolean(props.primaryAction || props.secondaryAction))

function emitActionClick(action: TemplatePageAction): void {
  emit('action-click', action.id)
}

function resolveActionClass(
  action: TemplatePageAction,
  variant: 'primary' | 'secondary',
): string[] {
  const fallbackTone: TemplatePageTone = variant === 'primary' ? 'primary' : 'neutral'

  return [
    'ntk-template-placeholder__action',
    `ntk-template-placeholder__action--${variant}`,
    `ntk-template-placeholder__action--tone-${resolveActionTone(action.color, fallbackTone)}`,
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
.ntk-template-placeholder {
  --ntk-template-placeholder-icon-bg: var(
    --ntk-placeholder-icon-bg,
    var(--ntk-template-semantic-info-soft-bg)
  );
  --ntk-template-placeholder-status-color: var(
    --ntk-placeholder-status-color,
    var(--ntk-template-semantic-accent-soft-text)
  );
  --ntk-template-placeholder-status-border: var(
    --ntk-placeholder-status-border,
    var(--ntk-template-semantic-accent-emphasis-border)
  );
  --ntk-template-placeholder-status-bg: var(
    --ntk-placeholder-status-bg,
    var(--ntk-template-semantic-accent-soft-bg)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(
    --ntk-template-placeholder-bg,
    linear-gradient(180deg, var(--ntk-bg-secondary) 0%, color-mix(in srgb, var(--semantic-info-primary, var(--ntk-info)) 8%, var(--ntk-bg-secondary)) 100%)
  );
}

.ntk-template-placeholder__shell {
  width: min(760px, 100%);
  position: relative;
}

.ntk-template-placeholder__decor {
  position: absolute;
  inset: auto -10% -20% auto;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  background: var(
    --ntk-template-placeholder-decor-bg,
    radial-gradient(circle at center, color-mix(in srgb, var(--semantic-info-primary, var(--ntk-info)) 14%, transparent), transparent)
  );
  pointer-events: none;
}

.ntk-template-placeholder__card {
  position: relative;
  border-radius: 14px;
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  overflow: hidden;
  box-shadow: 0 10px 30px var(--ntk-template-placeholder-shadow, color-mix(in srgb, var(--ntk-text-primary) 8%, transparent));
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
}

.ntk-template-placeholder__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 26px 24px 20px;
}

.ntk-template-placeholder__icon-wrap {
  width: 84px;
  height: 84px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ntk-template-placeholder-icon-color, var(--semantic-info-primary, var(--ntk-info)));
  background: var(--ntk-template-placeholder-icon-bg);
}

.ntk-template-placeholder__status {
  border: 1px solid var(--ntk-template-placeholder-status-border);
  color: var(--ntk-template-placeholder-status-color);
  background: var(--ntk-template-placeholder-status-bg);
  letter-spacing: 0.3px;
  font-weight: 600;
}

.ntk-template-placeholder__title {
  margin: 0;
  font-size: 28px;
  line-height: 1.15;
  color: var(--ntk-template-page-title, var(--ntk-text-primary));
}

.ntk-template-placeholder__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
}

.ntk-template-placeholder__description {
  margin: 0;
  font-size: 13px;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  max-width: 580px;
}

.ntk-template-placeholder__hints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
  padding: 16px 18px;
}

.ntk-template-placeholder__hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
  background: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));
}

.ntk-template-placeholder__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px 18px 20px;
}

:deep(.ntk-template-placeholder__action.q-btn) {
  border-radius: 10px;
  min-height: 40px;
  padding-inline: 14px;
  font-weight: 600;
  box-shadow: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

:deep(.ntk-template-placeholder__action.q-btn:hover) {
  transform: translateY(-1px);
}

:deep(.ntk-template-placeholder__action.q-btn:before) {
  box-shadow: none;
}

:deep(.ntk-template-placeholder__action--primary.q-btn) {
  border: 1px solid var(--ntk-template-placeholder-action-accent);
  color: var(--ntk-template-placeholder-action-primary-text, var(--ntk-text-on-accent, var(--ntk-text-primary)));
  background: var(--ntk-template-placeholder-action-accent);
}

:deep(.ntk-template-placeholder__action--primary.q-btn:hover) {
  border-color: var(--ntk-template-placeholder-action-accent-hover, var(--ntk-template-placeholder-action-accent));
  background: var(--ntk-template-placeholder-action-accent-hover, var(--ntk-template-placeholder-action-accent));
}

:deep(.ntk-template-placeholder__action--secondary.q-btn) {
  border: 1px solid var(--ntk-template-placeholder-action-border, var(--ntk-template-placeholder-action-accent));
  color: var(--ntk-template-placeholder-action-secondary-text, var(--ntk-template-placeholder-action-accent));
  background: var(--ntk-template-placeholder-action-secondary-bg, var(--ntk-template-semantic-accent-soft-bg));
}

:deep(.ntk-template-placeholder__action--secondary.q-btn:hover) {
  border-color: var(--ntk-template-placeholder-action-accent-hover, var(--ntk-template-placeholder-action-accent));
  color: var(--ntk-template-placeholder-action-accent-hover, var(--ntk-template-placeholder-action-accent));
  background: var(--ntk-template-placeholder-action-secondary-hover-bg, var(--ntk-template-semantic-accent-emphasis-bg));
}

.ntk-template-placeholder__action--tone-neutral {
  --ntk-template-placeholder-action-accent: var(--ntk-template-semantic-neutral-emphasis-text);
  --ntk-template-placeholder-action-accent-hover: var(--ntk-text-primary);
  --ntk-template-placeholder-action-border: var(--ntk-template-semantic-neutral-emphasis-border);
  --ntk-template-placeholder-action-secondary-text: var(--ntk-template-semantic-neutral-soft-text);
  --ntk-template-placeholder-action-secondary-bg: var(--ntk-template-semantic-neutral-soft-bg);
  --ntk-template-placeholder-action-secondary-hover-bg: var(--ntk-template-semantic-neutral-emphasis-bg);
}

.ntk-template-placeholder__action--tone-primary {
  --ntk-template-placeholder-action-accent: var(--ntk-primary);
  --ntk-template-placeholder-action-accent-hover: var(--ntk-primary-hover, var(--ntk-primary));
  --ntk-template-placeholder-action-border: var(--ntk-template-semantic-accent-emphasis-border);
  --ntk-template-placeholder-action-secondary-text: var(--ntk-template-semantic-accent-soft-text);
  --ntk-template-placeholder-action-secondary-bg: var(--ntk-template-semantic-accent-soft-bg);
  --ntk-template-placeholder-action-secondary-hover-bg: var(--ntk-template-semantic-accent-emphasis-bg);
}

.ntk-template-placeholder__action--tone-info {
  --ntk-template-placeholder-action-accent: var(--semantic-info-primary, var(--ntk-info));
  --ntk-template-placeholder-action-accent-hover: var(--semantic-info-secondary, var(--semantic-info-primary, var(--ntk-info)));
  --ntk-template-placeholder-action-border: var(--ntk-template-semantic-info-emphasis-border);
  --ntk-template-placeholder-action-secondary-text: var(--ntk-template-semantic-info-soft-text);
  --ntk-template-placeholder-action-secondary-bg: var(--ntk-template-semantic-info-soft-bg);
  --ntk-template-placeholder-action-secondary-hover-bg: var(--ntk-template-semantic-info-emphasis-bg);
}

.ntk-template-placeholder__action--tone-success {
  --ntk-template-placeholder-action-accent: var(--semantic-success-primary, var(--ntk-success));
  --ntk-template-placeholder-action-accent-hover: var(--semantic-success-secondary, var(--semantic-success-primary, var(--ntk-success)));
  --ntk-template-placeholder-action-border: var(--ntk-template-semantic-success-emphasis-border);
  --ntk-template-placeholder-action-secondary-text: var(--ntk-template-semantic-success-soft-text);
  --ntk-template-placeholder-action-secondary-bg: var(--ntk-template-semantic-success-soft-bg);
  --ntk-template-placeholder-action-secondary-hover-bg: var(--ntk-template-semantic-success-emphasis-bg);
}

.ntk-template-placeholder__action--tone-warning {
  --ntk-template-placeholder-action-accent: var(--semantic-warning-primary, var(--ntk-warning));
  --ntk-template-placeholder-action-accent-hover: var(--semantic-warning-secondary, var(--semantic-warning-primary, var(--ntk-warning)));
  --ntk-template-placeholder-action-border: var(--ntk-template-semantic-warning-emphasis-border);
  --ntk-template-placeholder-action-secondary-text: var(--ntk-template-semantic-warning-soft-text);
  --ntk-template-placeholder-action-secondary-bg: var(--ntk-template-semantic-warning-soft-bg);
  --ntk-template-placeholder-action-secondary-hover-bg: var(--ntk-template-semantic-warning-emphasis-bg);
}

.ntk-template-placeholder__action--tone-danger {
  --ntk-template-placeholder-action-accent: var(--semantic-error-primary, var(--ntk-error));
  --ntk-template-placeholder-action-accent-hover: var(--semantic-error-secondary, var(--semantic-error-primary, var(--ntk-error)));
  --ntk-template-placeholder-action-border: var(--ntk-template-semantic-danger-emphasis-border);
  --ntk-template-placeholder-action-secondary-text: var(--ntk-template-semantic-danger-soft-text);
  --ntk-template-placeholder-action-secondary-bg: var(--ntk-template-semantic-danger-soft-bg);
  --ntk-template-placeholder-action-secondary-hover-bg: var(--ntk-template-semantic-danger-emphasis-bg);
}

@media (max-width: 768px) {
  .ntk-template-placeholder__hero {
    padding: 22px 14px 16px;
  }

  .ntk-template-placeholder__title {
    font-size: 22px;
  }

  .ntk-template-placeholder__hints {
    grid-template-columns: 1fr;
    padding: 14px;
  }
}
</style>
