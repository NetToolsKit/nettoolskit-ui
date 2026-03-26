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
            color="primary"
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
            :color="secondaryAction.color || 'grey-8'"
            :disable="secondaryAction.disable"
            :flat="secondaryAction.flat ?? false"
            :outline="secondaryAction.outline ?? true"
            :unelevated="secondaryAction.unelevated ?? false"
            :aria-label="secondaryAction.ariaLabel || secondaryAction.label"
            @click="emitActionClick(secondaryAction)"
          />

          <q-btn
            v-if="primaryAction"
            no-caps
            :label="primaryAction.label"
            :icon="primaryAction.icon"
            :to="primaryAction.to"
            :color="primaryAction.color || 'primary'"
            :disable="primaryAction.disable"
            :flat="primaryAction.flat ?? false"
            :outline="primaryAction.outline ?? false"
            :unelevated="primaryAction.unelevated ?? true"
            :aria-label="primaryAction.ariaLabel || primaryAction.label"
            @click="emitActionClick(primaryAction)"
          />
        </q-card-actions>
      </q-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { TemplatePageAction, TemplatePageHint } from '../page-template.types'

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
</script>

<style scoped lang="scss">
.ntk-template-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(
    --ntk-template-placeholder-bg,
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)
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
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.14), rgba(59, 130, 246, 0));
  pointer-events: none;
}

.ntk-template-placeholder__card {
  position: relative;
  border-radius: 14px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  overflow: hidden;
  box-shadow: 0 10px 30px var(--ntk-template-placeholder-shadow, rgba(15, 23, 42, 0.08));
  background: var(--ntk-template-page-card-bg, #ffffff);
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
  color: var(--ntk-template-placeholder-icon-color, #2563eb);
  background: var(--ntk-template-placeholder-icon-bg, rgba(37, 99, 235, 0.12));
}

.ntk-template-placeholder__status {
  letter-spacing: 0.3px;
}

.ntk-template-placeholder__title {
  margin: 0;
  font-size: 28px;
  line-height: 1.15;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-placeholder__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--ntk-template-page-text, #334155);
}

.ntk-template-placeholder__description {
  margin: 0;
  font-size: 13px;
  color: var(--ntk-template-page-subtitle, #64748b);
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
  color: var(--ntk-template-page-text, #334155);
  background: var(--ntk-template-page-row-bg, #f8fafc);
}

.ntk-template-placeholder__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px 18px 20px;
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