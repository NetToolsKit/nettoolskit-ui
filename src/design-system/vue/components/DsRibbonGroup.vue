<template>
  <div
    :id="id"
    :class="classes"
    :data-testid="testId"
    role="group"
    :aria-label="label"
  >
    <p
      v-if="labelPosition === 'above'"
      class="ntk-ribbon-group__label ntk-ribbon-group__label--above"
    >
      {{ label }}
    </p>
    <div class="ntk-ribbon-group__commands">
      <slot>
        <DsRibbonCommand
          v-for="command in commands"
          :key="command.id"
          :label="command.label"
          :icon="command.icon"
          :intent="command.intent"
          :selected="command.selected"
          :disabled="command.disabled"
          :size="size"
          @click="onCommand(command.id, command.disabled)"
        />
      </slot>
    </div>
    <p
      v-if="labelPosition === 'below'"
      class="ntk-ribbon-group__label ntk-ribbon-group__label--below"
    >
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DsRibbonCommand from './DsRibbonCommand.vue'
import {
  ntkRibbonGroupDefaults,
  resolveNtkRibbonGroupRecipe,
  type NtkRibbonCommandItem,
  type NtkRibbonGroupContract,
} from '../../core'

defineOptions({
  name: 'DsRibbonGroup',
})

const props = withDefaults(defineProps<NtkRibbonGroupContract & {
  commands?: readonly NtkRibbonCommandItem[]
}>(), {
  commands: () => [],
  variant: ntkRibbonGroupDefaults.variant,
  size: ntkRibbonGroupDefaults.size,
  intent: ntkRibbonGroupDefaults.intent,
  density: ntkRibbonGroupDefaults.density,
  labelPosition: ntkRibbonGroupDefaults.labelPosition,
  separator: false,
})

const emit = defineEmits<{
  command: [id: string]
}>()

const classes = computed(() => resolveNtkRibbonGroupRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  labelPosition: props.labelPosition,
  separator: props.separator,
  class: props.class,
}).classes)

function onCommand(id: string, disabled?: boolean): void {
  if (disabled) {
    return
  }
  emit('command', id)
}
</script>

<style scoped>
.ntk-ribbon-group {
  display: inline-flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  font-family: var(--ntk-font-family);
}

.ntk-ribbon-group--has-separator {
  border-inline-end: 1px solid var(--ntk-border-light);
  margin-inline-end: var(--ntk-spacing-sm);
  padding-inline-end: var(--ntk-spacing-md);
}

.ntk-ribbon-group--density-compact {
  gap: 2px;
  padding-inline: var(--ntk-spacing-xs);
}

.ntk-ribbon-group--density-spacious {
  gap: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
}

.ntk-ribbon-group__commands {
  display: flex;
  align-items: stretch;
  gap: var(--ntk-spacing-xs);
}

.ntk-ribbon-group__label {
  margin: 0;
  text-align: center;
  color: var(--ntk-text-muted);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>