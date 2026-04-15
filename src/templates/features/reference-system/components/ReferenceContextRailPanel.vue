<template>
  <div class="ntk-reference-context-rail">
    <template v-if="selectedObject">
      <div class="ntk-reference-context-rail__header">
        <q-icon
          name="widgets"
          size="16px"
          class="ntk-reference-context-rail__header-icon"
        />
        <span class="ntk-reference-context-rail__header-title">Properties</span>
      </div>

      <div class="ntk-reference-context-rail__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="ntk-reference-context-rail__tab"
          :class="{ 'ntk-reference-context-rail__tab--active': activeTabId === tab.id }"
          @click="activeTabId = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="ntk-reference-context-rail__body">
        <template v-if="activeTabId === 'properties'">
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Label</label>
            <div class="ntk-reference-context-rail__field-value">{{ selectedObject.label }}</div>
          </div>
          <div
            v-if="selectedObject.subtitle"
            class="ntk-reference-context-rail__field-group"
          >
            <label class="ntk-reference-context-rail__field-label">Subtitle</label>
            <div class="ntk-reference-context-rail__field-value">{{ selectedObject.subtitle }}</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Position X</label>
            <div class="ntk-reference-context-rail__field-value">{{ selectedObject.x ?? 0 }} px</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Position Y</label>
            <div class="ntk-reference-context-rail__field-value">{{ selectedObject.y ?? 0 }} px</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Width</label>
            <div class="ntk-reference-context-rail__field-value">{{ selectedObject.width ?? 'auto' }}</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Height</label>
            <div class="ntk-reference-context-rail__field-value">{{ selectedObject.height ?? 'auto' }}</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Locked</label>
            <div class="ntk-reference-context-rail__field-value">
              <q-icon
                :name="selectedObject.locked ? 'lock' : 'lock_open'"
                size="14px"
              />
              {{ selectedObject.locked ? 'Yes' : 'No' }}
            </div>
          </div>
        </template>

        <template v-else-if="activeTabId === 'style'">
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Tone</label>
            <div class="ntk-reference-context-rail__field-value ntk-reference-context-rail__field-value--tone">
              <span
                class="ntk-reference-context-rail__tone-dot"
                :class="`ntk-reference-context-rail__tone-dot--${selectedObject.tone ?? 'neutral'}`"
              />
              {{ selectedObject.tone ?? 'neutral' }}
            </div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Border radius</label>
            <div class="ntk-reference-context-rail__field-value">var(--radius-md)</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Opacity</label>
            <div class="ntk-reference-context-rail__field-value">100%</div>
          </div>
        </template>

        <template v-else>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Data source</label>
            <div class="ntk-reference-context-rail__field-value ntk-reference-context-rail__field-value--muted">Not bound</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Expression</label>
            <div class="ntk-reference-context-rail__field-value ntk-reference-context-rail__field-value--muted">—</div>
          </div>
          <div class="ntk-reference-context-rail__field-group">
            <label class="ntk-reference-context-rail__field-label">Format</label>
            <div class="ntk-reference-context-rail__field-value ntk-reference-context-rail__field-value--muted">Default</div>
          </div>
        </template>
      </div>
    </template>

    <div
      v-else
      class="ntk-reference-context-rail__empty"
    >
      <q-icon
        name="touch_app"
        size="28px"
        class="ntk-reference-context-rail__empty-icon"
      />
      <p class="ntk-reference-context-rail__empty-label">Select an element on the canvas</p>
      <p class="ntk-reference-context-rail__empty-desc">Properties will appear here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { TemplateEditorCanvasObject } from '../../../pages'

const props = withDefaults(defineProps<{
  selectedObjectId?: string | null
  canvasObjects?: TemplateEditorCanvasObject[]
}>(), {
  selectedObjectId: null,
  canvasObjects: () => [],
})

const tabs = [
  { id: 'properties', label: 'Properties' },
  { id: 'style', label: 'Style' },
  { id: 'data', label: 'Data' },
]

const activeTabId = ref('properties')

const selectedObject = computed<TemplateEditorCanvasObject | null>(() => {
  if (!props.selectedObjectId) return null
  return props.canvasObjects.find(o => o.id === props.selectedObjectId) ?? null
})
</script>

<style scoped lang="scss">
.ntk-reference-context-rail {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--ntk-template-editor-panel-bg, #f3f4f6);
  border-left: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  min-width: 200px;
  max-width: 240px;
}

.ntk-reference-context-rail__header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px 8px;
  border-bottom: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
}

.ntk-reference-context-rail__header-icon {
  color: var(--ntk-template-editor-canvas-text, #6b7280);
}

.ntk-reference-context-rail__header-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--ntk-template-editor-canvas-text, #374151);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.ntk-reference-context-rail__tabs {
  display: flex;
  border-bottom: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
}

.ntk-reference-context-rail__tab {
  flex: 1;
  padding: 6px 4px;
  font-size: 11px;
  font-weight: 500;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: var(--ntk-template-editor-canvas-text, #6b7280);
  transition: color 0.15s, border-color 0.15s;

  &--active {
    color: var(--ntk-primary, #2563eb);
    border-bottom-color: var(--ntk-primary, #2563eb);
    font-weight: 600;
  }
}

.ntk-reference-context-rail__body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ntk-reference-context-rail__field-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ntk-reference-context-rail__field-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ntk-template-editor-canvas-text, #9ca3af);
}

.ntk-reference-context-rail__field-value {
  font-size: 12px;
  color: var(--ntk-template-editor-canvas-text, #374151);
  display: flex;
  align-items: center;
  gap: 4px;

  &--muted {
    color: var(--ntk-template-editor-canvas-text, #9ca3af);
    font-style: italic;
  }

  &--tone {
    text-transform: capitalize;
  }
}

.ntk-reference-context-rail__tone-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;

  &--positive { background: var(--semantic-success-primary, var(--semantic-success)); }
  &--warning { background: var(--semantic-warning-primary, var(--semantic-warning)); }
  &--negative { background: var(--semantic-error-primary, var(--semantic-error)); }
  &--info { background: var(--semantic-info-primary, var(--semantic-info)); }
  &--neutral { background: var(--semantic-neutral, var(--ntk-template-editor-canvas-text)); }
}

.ntk-reference-context-rail__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  gap: 8px;
  text-align: center;
}

.ntk-reference-context-rail__empty-icon {
  color: var(--ntk-template-editor-canvas-text, #9ca3af);
  opacity: 0.5;
}

.ntk-reference-context-rail__empty-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ntk-template-editor-canvas-text, #374151);
  margin: 0;
}

.ntk-reference-context-rail__empty-desc {
  font-size: 12px;
  color: var(--ntk-template-editor-canvas-text, #9ca3af);
  margin: 0;
}
</style>
