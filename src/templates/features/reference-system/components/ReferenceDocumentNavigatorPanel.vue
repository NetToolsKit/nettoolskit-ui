<template>
  <div class="ntk-reference-doc-nav">
    <div class="ntk-reference-doc-nav__header">
      <q-icon
        name="account_tree"
        size="15px"
        class="ntk-reference-doc-nav__header-icon"
      />
      <span class="ntk-reference-doc-nav__header-title">Document structure</span>
    </div>

    <div
      v-if="resolvedDocumentTitle"
      class="ntk-reference-doc-nav__doc-label"
    >
      <q-icon
        name="description"
        size="13px"
      />
      <span>{{ resolvedDocumentTitle }}</span>
    </div>

    <div class="ntk-reference-doc-nav__tree">
      <div
        v-for="group in documentGroups"
        :key="group.id"
        class="ntk-reference-doc-nav__group"
      >
        <div class="ntk-reference-doc-nav__group-header">
          <q-icon
            :name="group.icon"
            size="13px"
            class="ntk-reference-doc-nav__group-icon"
          />
          <span class="ntk-reference-doc-nav__group-label">{{ group.label }}</span>
          <span class="ntk-reference-doc-nav__group-count">{{ group.objects.length }}</span>
        </div>

        <div
          v-if="group.objects.length > 0"
          class="ntk-reference-doc-nav__items"
        >
          <button
            v-for="obj in group.objects"
            :key="obj.id"
            type="button"
            class="ntk-reference-doc-nav__item"
            :class="{
              'ntk-reference-doc-nav__item--active': selectedObjectId === obj.id,
              [`ntk-reference-doc-nav__item--${obj.tone || 'neutral'}`]: true,
            }"
            :aria-label="`Select ${obj.label}`"
            :aria-pressed="selectedObjectId === obj.id"
            @click="emit('object-select', obj.id)"
          >
            <span class="ntk-reference-doc-nav__item-dot" />
            <span class="ntk-reference-doc-nav__item-label">{{ obj.label }}</span>
            <q-icon
              v-if="obj.locked"
              name="lock"
              size="11px"
              class="ntk-reference-doc-nav__item-lock"
            />
          </button>
        </div>

        <div
          v-else
          class="ntk-reference-doc-nav__empty-group"
        >
          No elements
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { TemplateEditorCanvasObject } from '../../../pages'

const props = withDefaults(defineProps<{
  canvasObjects?: TemplateEditorCanvasObject[]
  selectedObjectId?: string | null
  documentTitle?: string
}>(), {
  canvasObjects: () => [],
  selectedObjectId: null,
  documentTitle: '',
})

const emit = defineEmits<{
  'object-select': [objectId: string]
}>()

const resolvedDocumentTitle = computed(() => props.documentTitle || '')

interface DocumentGroup {
  id: string
  label: string
  icon: string
  objects: TemplateEditorCanvasObject[]
}

const HEADER_Y_MAX = 175
const FOOTER_Y_MIN = 340

const documentGroups = computed<DocumentGroup[]>(() => {
  const header: TemplateEditorCanvasObject[] = []
  const body: TemplateEditorCanvasObject[] = []
  const footer: TemplateEditorCanvasObject[] = []

  for (const obj of props.canvasObjects) {
    const y = obj.y ?? 0
    if (y < HEADER_Y_MAX) {
      header.push(obj)
    }
    else if (y >= FOOTER_Y_MIN) {
      footer.push(obj)
    }
    else {
      body.push(obj)
    }
  }

  return [
    { id: 'header', label: 'Header', icon: 'view_compact_alt', objects: header },
    { id: 'body', label: 'Body', icon: 'view_agenda', objects: body },
    { id: 'footer', label: 'Footer', icon: 'view_compact', objects: footer },
  ]
})
</script>

<style scoped lang="scss">
.ntk-reference-doc-nav {
  --ntk-reference-doc-nav-panel-bg: var(--ntk-template-editor-panel-bg, var(--ntk-bg-secondary));
  --ntk-reference-doc-nav-toolbar-bg: var(--ntk-template-editor-toolbar-bg, var(--ntk-bg-tertiary));
  --ntk-reference-doc-nav-commandbar-bg: var(--ntk-template-editor-commandbar-bg, var(--ntk-bg-card));
  --ntk-reference-doc-nav-border: var(--ntk-template-editor-border, var(--ntk-border-color));
  --ntk-reference-doc-nav-border-soft: var(--ntk-template-editor-border-soft, var(--ntk-reference-doc-nav-border));
  --ntk-reference-doc-nav-text: var(--ntk-template-editor-text, var(--ntk-text-primary));
  --ntk-reference-doc-nav-muted: var(--ntk-template-editor-muted-text, var(--ntk-text-secondary));
  --ntk-reference-doc-nav-muted-strong: var(--ntk-template-editor-canvas-text, var(--ntk-reference-doc-nav-text));
  --ntk-reference-doc-nav-hover-bg: var(--ntk-template-editor-button-hover-bg, var(--ntk-bg-hover));
  --ntk-reference-doc-nav-accent-bg: var(--ntk-template-editor-accent-bg, color-mix(in srgb, var(--ntk-primary) 12%, var(--ntk-reference-doc-nav-commandbar-bg)));
  --ntk-reference-doc-nav-accent: var(--ntk-template-editor-accent, var(--ntk-primary));
  --ntk-reference-doc-nav-info: var(--ntk-template-editor-info, var(--semantic-info-primary, var(--ntk-info)));
  --ntk-reference-doc-nav-warning: var(--ntk-template-editor-warning, var(--semantic-warning-primary, var(--ntk-warning)));

  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  overflow-y: auto;
  background: var(--ntk-reference-doc-nav-panel-bg);
}

.ntk-reference-doc-nav__header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px 8px;
  border-bottom: 1px solid var(--ntk-reference-doc-nav-border);
  background: var(--ntk-reference-doc-nav-toolbar-bg);
  position: sticky;
  top: 0;
  z-index: 1;
}

.ntk-reference-doc-nav__header-icon {
  color: var(--ntk-reference-doc-nav-muted);
}

.ntk-reference-doc-nav__header-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ntk-reference-doc-nav-text);
}

.ntk-reference-doc-nav__doc-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--ntk-reference-doc-nav-border);
  font-size: 12px;
  color: var(--ntk-reference-doc-nav-muted);
  background: var(--ntk-reference-doc-nav-commandbar-bg);
}

.ntk-reference-doc-nav__tree {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 0;
}

.ntk-reference-doc-nav__group {
  display: flex;
  flex-direction: column;
}

.ntk-reference-doc-nav__group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 4px;
}

.ntk-reference-doc-nav__group-icon {
  color: var(--ntk-reference-doc-nav-muted);
}

.ntk-reference-doc-nav__group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--ntk-reference-doc-nav-muted);
  flex: 1;
}

.ntk-reference-doc-nav__group-count {
  font-size: 10px;
  font-weight: 600;
  color: var(--ntk-reference-doc-nav-muted);
  background: var(--ntk-reference-doc-nav-border-soft);
  border-radius: 10px;
  padding: 1px 6px;
}

.ntk-reference-doc-nav__items {
  display: flex;
  flex-direction: column;
  padding: 2px 0 6px;
}

.ntk-reference-doc-nav__item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px 5px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-size: 12px;
  color: var(--ntk-reference-doc-nav-text);
  border-radius: 0;
  transition: background 0.1s;

  &:hover {
    background: var(--ntk-reference-doc-nav-hover-bg);
  }
}

.ntk-reference-doc-nav__item--active {
  background: var(--ntk-reference-doc-nav-accent-bg) !important;
  color: var(--ntk-reference-doc-nav-accent);
  font-weight: 600;
}

.ntk-reference-doc-nav__item-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--ntk-reference-doc-nav-muted);

  .ntk-reference-doc-nav__item--primary & {
    background: var(--ntk-reference-doc-nav-accent);
  }

  .ntk-reference-doc-nav__item--info & {
    background: var(--ntk-reference-doc-nav-info);
  }

  .ntk-reference-doc-nav__item--warning & {
    background: var(--ntk-reference-doc-nav-warning);
  }

  .ntk-reference-doc-nav__item--active & {
    background: var(--ntk-reference-doc-nav-accent);
  }
}

.ntk-reference-doc-nav__item-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ntk-reference-doc-nav__item-lock {
  color: var(--ntk-reference-doc-nav-muted);
  flex-shrink: 0;
}

.ntk-reference-doc-nav__empty-group {
  padding: 4px 24px 8px;
  font-size: 11px;
  color: var(--ntk-reference-doc-nav-muted);
  font-style: italic;
}
</style>
