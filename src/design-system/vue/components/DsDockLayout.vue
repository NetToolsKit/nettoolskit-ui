<template>
  <div :id="id" :class="classes" :data-testid="testId" :aria-label="ariaLabel" role="group">
    <div v-if="$slots.top" class="ntk-dock-layout__region ntk-dock-layout__region--top" :style="topStyle">
      <slot name="top" />
    </div>
    <div
      v-if="$slots.top"
      class="ntk-dock-layout__splitter ntk-dock-layout__splitter--horizontal"
      role="separator"
      tabindex="0"
      aria-orientation="horizontal"
      aria-label="Resize top region"
      :aria-valuenow="Math.round(sizes.top)"
      :aria-valuemin="minSize"
      :aria-valuemax="maxSize"
      @keydown="onSplitterKeydown($event, 'top')"
    />

    <div class="ntk-dock-layout__middle">
      <div v-if="$slots.left" class="ntk-dock-layout__region ntk-dock-layout__region--left" :style="leftStyle">
        <slot name="left" />
      </div>
      <div
        v-if="$slots.left"
        class="ntk-dock-layout__splitter ntk-dock-layout__splitter--vertical"
        role="separator"
        tabindex="0"
        aria-orientation="vertical"
        aria-label="Resize left region"
        :aria-valuenow="Math.round(sizes.left)"
        :aria-valuemin="minSize"
        :aria-valuemax="maxSize"
        @keydown="onSplitterKeydown($event, 'left')"
      />

      <div class="ntk-dock-layout__center">
        <slot />
      </div>

      <div
        v-if="$slots.right"
        class="ntk-dock-layout__splitter ntk-dock-layout__splitter--vertical"
        role="separator"
        tabindex="0"
        aria-orientation="vertical"
        aria-label="Resize right region"
        :aria-valuenow="Math.round(sizes.right)"
        :aria-valuemin="minSize"
        :aria-valuemax="maxSize"
        @keydown="onSplitterKeydown($event, 'right')"
      />
      <div v-if="$slots.right" class="ntk-dock-layout__region ntk-dock-layout__region--right" :style="rightStyle">
        <slot name="right" />
      </div>
    </div>

    <div
      v-if="$slots.bottom"
      class="ntk-dock-layout__splitter ntk-dock-layout__splitter--horizontal"
      role="separator"
      tabindex="0"
      aria-orientation="horizontal"
      aria-label="Resize bottom region"
      :aria-valuenow="Math.round(sizes.bottom)"
      :aria-valuemin="minSize"
      :aria-valuemax="maxSize"
      @keydown="onSplitterKeydown($event, 'bottom')"
    />
    <div v-if="$slots.bottom" class="ntk-dock-layout__region ntk-dock-layout__region--bottom" :style="bottomStyle">
      <slot name="bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, type CSSProperties } from 'vue'
import {
  clampNtkDockSize,
  getNtkDockNextSize,
  ntkDockLayoutDefaults,
  resolveNtkDockLayoutRecipe,
  type NtkDockLayoutContract,
  type NtkDockRegion,
} from '../../core'

defineOptions({
  name: 'DsDockLayout',
})

const props = withDefaults(defineProps<NtkDockLayoutContract>(), {
  ariaLabel: 'Workspace layout',
  variant: ntkDockLayoutDefaults.variant,
  size: ntkDockLayoutDefaults.size,
  intent: ntkDockLayoutDefaults.intent,
  leftSize: ntkDockLayoutDefaults.leftSize,
  rightSize: ntkDockLayoutDefaults.rightSize,
  topSize: ntkDockLayoutDefaults.topSize,
  bottomSize: ntkDockLayoutDefaults.bottomSize,
  minSize: ntkDockLayoutDefaults.minSize,
  maxSize: ntkDockLayoutDefaults.maxSize,
  step: ntkDockLayoutDefaults.step,
})

const emit = defineEmits<{
  'resize-region': [region: NtkDockRegion, size: number]
}>()

const classes = computed(() => resolveNtkDockLayoutRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

const sizes = reactive<Record<NtkDockRegion, number>>({
  left: clampNtkDockSize(props.leftSize, props.minSize, props.maxSize),
  right: clampNtkDockSize(props.rightSize, props.minSize, props.maxSize),
  top: clampNtkDockSize(props.topSize, props.minSize, props.maxSize),
  bottom: clampNtkDockSize(props.bottomSize, props.minSize, props.maxSize),
})

const leftStyle = computed<CSSProperties>(() => ({ inlineSize: `${sizes.left}px` }))
const rightStyle = computed<CSSProperties>(() => ({ inlineSize: `${sizes.right}px` }))
const topStyle = computed<CSSProperties>(() => ({ blockSize: `${sizes.top}px` }))
const bottomStyle = computed<CSSProperties>(() => ({ blockSize: `${sizes.bottom}px` }))

const RESIZE_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'] as const
type ResizeKey = (typeof RESIZE_KEYS)[number]

function isResizeKey(key: string): key is ResizeKey {
  return (RESIZE_KEYS as readonly string[]).includes(key)
}

function onSplitterKeydown(event: KeyboardEvent, region: NtkDockRegion): void {
  if (!isResizeKey(event.key)) {
    return
  }
  const next = getNtkDockNextSize(region, sizes[region], event.key, {
    min: props.minSize,
    max: props.maxSize,
    step: props.step,
  })
  if (next === undefined || next === sizes[region]) {
    return
  }
  event.preventDefault()
  sizes[region] = next
  emit('resize-region', region, next)
}
</script>

<style scoped>
.ntk-dock-layout {
  display: flex;
  flex-direction: column;
  min-block-size: 0;
  inline-size: 100%;
  block-size: 100%;
  background: var(--ntk-bg-secondary);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-dock-layout--variant-bordered {
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  overflow: hidden;
}

.ntk-dock-layout__middle {
  display: flex;
  flex: 1 1 auto;
  min-block-size: 0;
}

.ntk-dock-layout__region {
  min-block-size: 0;
  min-inline-size: 0;
  overflow: auto;
  background: var(--ntk-bg-card);
}

.ntk-dock-layout__region--left,
.ntk-dock-layout__region--right {
  flex: 0 0 auto;
  block-size: 100%;
}

.ntk-dock-layout__region--top,
.ntk-dock-layout__region--bottom {
  flex: 0 0 auto;
  inline-size: 100%;
}

.ntk-dock-layout__center {
  flex: 1 1 auto;
  min-inline-size: 0;
  min-block-size: 0;
  overflow: auto;
}

.ntk-dock-layout__splitter {
  flex: 0 0 auto;
  border: 0;
  background: var(--ntk-border-color);
  transition: background var(--ntk-transition-fast);
}

.ntk-dock-layout__splitter--vertical {
  inline-size: 4px;
  block-size: 100%;
  cursor: col-resize;
}

.ntk-dock-layout__splitter--horizontal {
  inline-size: 100%;
  block-size: 4px;
  cursor: row-resize;
}

.ntk-dock-layout__splitter:hover {
  background: var(--ntk-primary);
}

.ntk-dock-layout__splitter:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -1px;
  background: var(--ntk-primary);
}
</style>