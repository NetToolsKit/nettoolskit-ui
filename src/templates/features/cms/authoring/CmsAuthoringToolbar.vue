<template>
  <div class="cms-shell-card__header cms-designer-card__toolbar-header">
    <div class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--actions">
      <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--icons">
        <slot name="actions" />
      </div>
      <div class="cms-designer-card__toolbar-spacer" />
      <div class="cms-designer-card__toolbar-group cms-designer-card__toolbar-group--preview">
        <slot name="trailing" />
      </div>
    </div>

    <div
      v-if="infoItems.length > 0"
      class="cms-designer-card__toolbar-row cms-designer-card__toolbar-row--info"
    >
      <div class="cms-designer-card__info-strip">
        <span
          v-for="item in infoItems"
          :key="item.id"
          class="cms-designer-card__info-item"
        >
          <strong v-if="item.emphasis">{{ item.label }}</strong>
          <template v-else>{{ item.label }}</template>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CmsAuthoringToolbarInfoItem {
  id: string
  label: string
  emphasis?: boolean
}

withDefaults(defineProps<{
  infoItems?: CmsAuthoringToolbarInfoItem[]
}>(), {
  infoItems: () => [],
})
</script>