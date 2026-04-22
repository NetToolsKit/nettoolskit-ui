<template>
  <q-btn
    v-bind="$attrs"
    :label="label"
    :disable="disable"
    :loading="loading"
    :icon="icon"
    :icon-right="iconRight"
    :round="round"
    :flat="flat"
    :outline="outline"
    :unelevated="unelevated"
    :size="size"
    :dense="dense"
    :padding="padding"
    :no-caps="noCaps"
    :no-wrap="noWrap"
    :align="align"
    :to="to"
    :href="href"
    :target="target"
    :stretch="stretch"
    :ripple="ripple"
    :stack="stack"
    :type="type"
    :class="buttonClasses"
    :style="buttonStyle"
    @click="$emit('click', $event)"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
    <template
      v-if="$slots.loading"
      #loading
    >
      <slot name="loading" />
    </template>
  </q-btn>
  <span
    v-if="loading && $slots.loading"
    class="ntk-button__loading-fallback"
  >
    <slot name="loading" />
  </span>
</template>

<script setup lang="ts">
/**
 * Src/components/ui/Ntk Button module.
 */

import { computed } from 'vue'

interface Props {
  label?: string
  color?: string
  disable?: boolean
  loading?: boolean
  icon?: string
  iconRight?: string
  round?: boolean
  flat?: boolean
  outline?: boolean
  unelevated?: boolean
  size?: string
  dense?: boolean
  padding?: string
  noCaps?: boolean
  noWrap?: boolean
  align?: 'left' | 'right' | 'center' | 'around' | 'between' | 'evenly'
  to?: string
  href?: string
  target?: string
  stretch?: boolean
  ripple?: boolean
  stack?: boolean
  type?: 'button' | 'submit' | 'reset'
  customClass?: string
}

const props = defineProps<Props>()

defineEmits<{
  click: [event: Event]
}>()

const COLOR_TOKEN_ALIASES: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  brand: 'var(--ntk-primary)',
  success: 'var(--ntk-success, var(--semantic-success-primary))',
  positive: 'var(--ntk-success, var(--semantic-success-primary))',
  warning: 'var(--ntk-warning, var(--semantic-warning-primary))',
  error: 'var(--ntk-error, var(--semantic-error-primary))',
  danger: 'var(--ntk-error, var(--semantic-error-primary))',
  negative: 'var(--ntk-error, var(--semantic-error-primary))',
  info: 'var(--ntk-info, var(--semantic-info-primary))',
  neutral: 'var(--ntk-text-secondary)',
  muted: 'var(--ntk-text-muted)',
  text: 'var(--ntk-text-primary)',
  inverse: 'var(--ntk-text-inverse)',
  surface: 'var(--ntk-bg-primary)',
  'surface-muted': 'var(--ntk-bg-secondary)',
  border: 'var(--ntk-border-color)',
}

const QUASAR_NEUTRAL_ALIAS_PATTERN = /^(grey|gray|blue-grey)-\d+$/i
const UNSAFE_CSS_VALUE_PATTERN = /[;{}<>]|url\s*\(|expression\s*\(|javascript:/i
const HEX_COLOR_PATTERN = /#[\da-f]{3,8}\b/i
const RAW_COLOR_FUNCTION_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(\s*(?!var\(--)/i
const NAMED_COLOR_PATTERN = /\b(?:white|black|red|green|blue|hotpink|purple|violet|yellow|orange|pink|gray|grey|cyan|magenta|lime|navy|teal|maroon|olive|silver|gold|brown|coral|tomato|salmon|beige|ivory|snow|azure|lavender|plum|orchid|indigo)\b/i

const stripCssVariables = (value: string): string => value.replace(/var\([^)]*\)/gi, '')

const isSafeCssTokenExpression = (value: string): boolean => {
  const normalized = value.trim()
  return normalized.includes('var(--')
    && !UNSAFE_CSS_VALUE_PATTERN.test(normalized)
    && !HEX_COLOR_PATTERN.test(normalized)
    && !RAW_COLOR_FUNCTION_PATTERN.test(normalized)
    && !NAMED_COLOR_PATTERN.test(stripCssVariables(normalized))
}

const resolveTokenColor = (value?: string): string => {
  const normalized = value?.trim()
  if (!normalized) {
    return ''
  }

  if (isSafeCssTokenExpression(normalized)) {
    return normalized
  }

  const alias = normalized.toLowerCase().replace(/_/g, '-')
  return COLOR_TOKEN_ALIASES[alias] ?? (QUASAR_NEUTRAL_ALIAS_PATTERN.test(alias) ? COLOR_TOKEN_ALIASES.neutral : '')
}

const resolvedButtonColor = computed(() => resolveTokenColor(props.color))

const buttonClasses = computed(() => [
  'ntk-button',
  { 'ntk-button--token-color': Boolean(resolvedButtonColor.value) },
  props.customClass,
])

const buttonStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (!resolvedButtonColor.value) {
    return style
  }

  style['--ntk-button-color'] = resolvedButtonColor.value
  return style
})
</script>

<style scoped>
.ntk-button--token-color {
  color: var(--ntk-button-color) !important;
}

.ntk-button--token-color:not(.q-btn--flat, .q-btn--outline) {
  background: var(--ntk-button-color) !important;
  color: var(--ntk-button-text, var(--ntk-text-on-primary, var(--ntk-text-inverse))) !important;
}

.ntk-button__loading-fallback {
  display: none;
}
</style>
