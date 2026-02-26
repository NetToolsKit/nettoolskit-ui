<template>
  <q-btn
    v-bind="$attrs"
    :label="label"
    :color="color"
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
    :class="customClass"
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

defineProps<Props>()

defineEmits<{
  click: [event: Event]
}>()
</script>

<style scoped>
.ntk-button__loading-fallback {
  display: none;
}
</style>