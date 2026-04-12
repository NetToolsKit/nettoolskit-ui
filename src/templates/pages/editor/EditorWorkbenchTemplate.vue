<template>
  <div
    class="ntk-template-editor-workbench"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <header class="ntk-template-editor-workbench__topbar">
      <slot name="topbar-document">
        <div class="ntk-template-editor-workbench__document">
          <h1>{{ documentTitle }}</h1>
          <p>{{ documentSubtitle }}</p>
        </div>
      </slot>

      <slot name="topbar-actions">
        <div class="ntk-template-editor-workbench__topbar-actions">
          <button
            v-for="action in resolvedTopbarActions"
            :key="action.id"
            type="button"
            class="ntk-template-editor-workbench__toolbar-action"
            :aria-label="action.ariaLabel || action.label || action.id"
            :disabled="action.disable"
            @click="emit('toolbar-action-click', action.id)"
          >
            <q-icon
              v-if="action.icon"
              :name="action.icon"
              size="16px"
            />
            <span v-if="action.label">{{ action.label }}</span>
          </button>
        </div>
      </slot>
    </header>

    <section class="ntk-template-editor-workbench__commandbar">
      <slot name="commandbar">
        <div class="ntk-template-editor-workbench__command-groups">
          <button
            v-for="action in resolvedQuickActions"
            :key="action.id"
            type="button"
            class="ntk-template-editor-workbench__toolbar-action ntk-template-editor-workbench__toolbar-action--compact"
            :aria-label="action.ariaLabel || action.label || action.id"
            :disabled="action.disable"
            @click="emit('toolbar-action-click', action.id)"
          >
            <q-icon
              v-if="action.icon"
              :name="action.icon"
              size="16px"
            />
            <span v-if="action.label">{{ action.label }}</span>
          </button>
        </div>

        <div class="ntk-template-editor-workbench__command-menus">
          <button
            type="button"
            class="ntk-template-editor-workbench__menu-pill"
            @click="emit('toolbar-action-click', 'menu-align')"
          >
            <q-icon
              name="format_align_left"
              size="14px"
            />
            <span>{{ alignMenuLabel }}</span>
          </button>

          <button
            type="button"
            class="ntk-template-editor-workbench__menu-pill"
            @click="emit('toolbar-action-click', 'menu-layout')"
          >
            <q-icon
              name="space_dashboard"
              size="14px"
            />
            <span>{{ layoutMenuLabel }}</span>
          </button>
        </div>

        <div class="ntk-template-editor-workbench__zoom">
          <button
            type="button"
            class="ntk-template-editor-workbench__zoom-step"
            :aria-label="zoomOutAriaLabel"
            @click="decreaseZoom"
          >
            <q-icon
              name="remove"
              size="14px"
            />
          </button>

          <select
            class="ntk-template-editor-workbench__zoom-select"
            :value="resolvedZoomValue"
            name="editor-workbench-zoom"
            :aria-label="zoomSelectAriaLabel"
            @change="onZoomChange"
          >
            <option
              v-for="zoom in resolvedZoomOptions"
              :key="zoom"
              :value="zoom"
            >
              {{ zoom }}%
            </option>
          </select>

          <button
            type="button"
            class="ntk-template-editor-workbench__zoom-step"
            :aria-label="zoomInAriaLabel"
            @click="increaseZoom"
          >
            <q-icon
              name="add"
              size="14px"
            />
          </button>
        </div>

        <div class="ntk-template-editor-workbench__preview">
          <q-btn
            no-caps
            unelevated
            color="primary"
            icon="visibility"
            :label="previewLabel"
            :aria-label="previewAriaLabel"
            @click="emit('toolbar-action-click', 'preview')"
          />
        </div>
      </slot>
    </section>

    <div class="ntk-template-editor-workbench__workspace">
      <aside
        class="ntk-template-editor-workbench__widgets-panel"
        :aria-label="widgetPanelAriaLabel"
      >
        <slot name="widgets-panel">
          <div class="ntk-template-editor-workbench__widget-search">
            <q-icon
              name="search"
              size="14px"
            />
            <input
              v-model="widgetSearchModel"
              class="ntk-template-editor-workbench__widget-search-input"
              type="text"
              name="editor-workbench-widget-search"
              :placeholder="widgetSearchPlaceholder"
              :aria-label="widgetSearchAriaLabel"
            >
          </div>

          <section
            v-for="section in filteredWidgetSections"
            :key="section.id"
            class="ntk-template-editor-workbench__widget-section"
          >
            <header class="ntk-template-editor-workbench__widget-section-header">
              <strong>{{ section.title }}</strong>
            </header>

            <div class="ntk-template-editor-workbench__widget-grid">
              <button
                v-for="item in section.items"
                :key="item.id"
                type="button"
                class="ntk-template-editor-workbench__widget-item"
                :class="{ 'ntk-template-editor-workbench__widget-item--active': selectedWidgetId === item.id }"
                :disabled="item.disabled"
                :aria-label="item.label"
                @click="selectWidget(item.id)"
              >
                <q-icon
                  :name="item.icon || 'widgets'"
                  size="18px"
                />
                <span>{{ item.label }}</span>
              </button>
            </div>
          </section>
        </slot>
      </aside>

      <main class="ntk-template-editor-workbench__canvas-shell">
        <div class="ntk-template-editor-workbench__ruler-top">
          <slot name="ruler-top">
            <span
              v-for="mark in horizontalRulerMarks"
              :key="`ruler-top-${mark}`"
              class="ntk-template-editor-workbench__ruler-mark"
            >
              {{ mark }}
            </span>
          </slot>
        </div>

        <div class="ntk-template-editor-workbench__canvas-body">
          <div class="ntk-template-editor-workbench__ruler-left">
            <slot name="ruler-left">
              <span
                v-for="mark in verticalRulerMarks"
                :key="`ruler-left-${mark}`"
                class="ntk-template-editor-workbench__ruler-mark ntk-template-editor-workbench__ruler-mark--vertical"
              >
                {{ mark }}
              </span>
            </slot>
          </div>

          <section
            class="ntk-template-editor-workbench__canvas-stage"
            :class="{
              'ntk-template-editor-workbench__canvas-stage--grid': showGrid && activeDocumentTabId !== 'preview',
              'ntk-template-editor-workbench__canvas-stage--preview': activeDocumentTabId === 'preview',
            }"
            :aria-label="canvasAriaLabel"
          >
            <slot name="canvas-stage">
              <template v-if="activeDocumentTabId === 'data'">
                <div class="ntk-template-editor-workbench__tab-placeholder ntk-template-editor-workbench__tab-placeholder--data">
                  <q-icon
                    name="table_chart"
                    size="28px"
                    class="ntk-template-editor-workbench__tab-placeholder-icon"
                  />
                  <p class="ntk-template-editor-workbench__tab-placeholder-label">Data Bindings</p>
                  <table class="ntk-template-editor-workbench__data-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Source</th>
                        <th>Format</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>report_id</td>
                        <td>reports.id</td>
                        <td>Text</td>
                      </tr>
                      <tr>
                        <td>period</td>
                        <td>reports.period</td>
                        <td>Date range</td>
                      </tr>
                      <tr>
                        <td>total_value</td>
                        <td>metrics.total</td>
                        <td>Currency</td>
                      </tr>
                      <tr>
                        <td>assigned_to</td>
                        <td>users.display_name</td>
                        <td>Text</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>

              <template v-else-if="activeDocumentTabId === 'preview'">
                <div
                  v-if="showDocumentRegions"
                  class="ntk-template-editor-workbench__document-regions ntk-template-editor-workbench__document-regions--preview"
                  aria-hidden="true"
                >
                  <div class="ntk-template-editor-workbench__document-region ntk-template-editor-workbench__document-region--header">
                    <span class="ntk-template-editor-workbench__document-region-label">Header</span>
                  </div>
                  <div class="ntk-template-editor-workbench__document-region ntk-template-editor-workbench__document-region--body">
                    <span class="ntk-template-editor-workbench__document-region-label">Body</span>
                  </div>
                  <div class="ntk-template-editor-workbench__document-region ntk-template-editor-workbench__document-region--footer">
                    <span class="ntk-template-editor-workbench__document-region-label">Footer</span>
                  </div>
                </div>

                <div
                  v-for="(item, index) in resolvedCanvasObjects"
                  :key="item.id"
                  class="ntk-template-editor-workbench__canvas-object ntk-template-editor-workbench__canvas-object--readonly"
                  :class="`ntk-template-editor-workbench__canvas-object--${item.tone || 'neutral'}`"
                  :style="resolveCanvasObjectStyle(item, index)"
                  :aria-label="item.label"
                >
                  <div class="ntk-template-editor-workbench__canvas-object-title">
                    <span>{{ item.label }}</span>
                  </div>
                  <small v-if="item.subtitle">{{ item.subtitle }}</small>
                </div>
              </template>

              <template v-else>
                <div
                  v-if="showDocumentRegions"
                  class="ntk-template-editor-workbench__document-regions"
                  aria-hidden="true"
                >
                  <div class="ntk-template-editor-workbench__document-region ntk-template-editor-workbench__document-region--header">
                    <span class="ntk-template-editor-workbench__document-region-label">Header</span>
                  </div>
                  <div class="ntk-template-editor-workbench__document-region ntk-template-editor-workbench__document-region--body">
                    <span class="ntk-template-editor-workbench__document-region-label">Body</span>
                  </div>
                  <div class="ntk-template-editor-workbench__document-region ntk-template-editor-workbench__document-region--footer">
                    <span class="ntk-template-editor-workbench__document-region-label">Footer</span>
                  </div>
                </div>

                <div class="ntk-template-editor-workbench__canvas-header">
                  <span
                    v-for="column in resolvedCanvasColumns"
                    :key="column"
                    class="ntk-template-editor-workbench__canvas-header-cell"
                  >
                    {{ column }}
                  </span>
                </div>

                <button
                  v-for="(item, index) in resolvedCanvasObjects"
                  :key="item.id"
                  type="button"
                  class="ntk-template-editor-workbench__canvas-object"
                  :class="`ntk-template-editor-workbench__canvas-object--${item.tone || 'neutral'}`"
                  :style="resolveCanvasObjectStyle(item, index)"
                  :aria-label="item.label"
                  @click="emit('canvas-object-click', item.id)"
                >
                  <div class="ntk-template-editor-workbench__canvas-object-title">
                    <span>{{ item.label }}</span>
                    <q-icon
                      v-if="item.locked"
                      name="lock"
                      size="13px"
                    />
                  </div>
                  <small v-if="item.subtitle">{{ item.subtitle }}</small>
                </button>
              </template>
            </slot>
          </section>
        </div>
      </main>

      <aside
        class="ntk-template-editor-workbench__right-rail"
        :aria-label="rightRailAriaLabel"
      >
        <slot name="right-rail">
          <button
            v-for="action in resolvedRailActions"
            :key="action.id"
            type="button"
            class="ntk-template-editor-workbench__rail-action"
            :aria-label="action.ariaLabel || action.label || action.id"
            :disabled="action.disable"
            @click="emit('rail-action-click', action.id)"
          >
            <q-icon
              :name="action.icon"
              size="16px"
            />
          </button>
        </slot>
      </aside>
    </div>

    <footer
      class="ntk-template-editor-workbench__statusbar"
      :aria-label="statusBarAriaLabel"
    >
      <div class="ntk-template-editor-workbench__status-group">
        <slot name="statusbar-left">
          <button
            v-for="segment in resolvedLeftStatusSegments"
            :key="segment.id"
            type="button"
            class="ntk-template-editor-workbench__status-segment"
            :class="`ntk-template-editor-workbench__status-segment--${segment.tone || 'neutral'}`"
            @click="emit('status-click', segment.id)"
          >
            <span>{{ segment.label }}</span>
            <strong v-if="segment.value !== undefined">{{ segment.value }}</strong>
          </button>
        </slot>
      </div>

      <div class="ntk-template-editor-workbench__status-group">
        <slot name="statusbar-right">
          <button
            v-for="segment in resolvedRightStatusSegments"
            :key="segment.id"
            type="button"
            class="ntk-template-editor-workbench__status-segment"
            :class="`ntk-template-editor-workbench__status-segment--${segment.tone || 'neutral'}`"
            @click="emit('status-click', segment.id)"
          >
            <span>{{ segment.label }}</span>
            <strong v-if="segment.value !== undefined">{{ segment.value }}</strong>
          </button>
        </slot>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type {
  TemplateEditorCanvasObject,
  TemplateEditorRailAction,
  TemplateEditorStatusSegment,
  TemplateEditorToolbarAction,
  TemplateEditorWidgetSection,
} from '../page-template.types'

const props = withDefaults(defineProps<{
  documentTitle?: string
  documentSubtitle?: string
  topbarActions?: TemplateEditorToolbarAction[]
  quickActions?: TemplateEditorToolbarAction[]
  alignMenuLabel?: string
  layoutMenuLabel?: string
  previewLabel?: string
  previewAriaLabel?: string
  zoomOptions?: number[]
  zoomValue?: number
  zoomSelectAriaLabel?: string
  zoomInAriaLabel?: string
  zoomOutAriaLabel?: string
  widgetSections?: TemplateEditorWidgetSection[]
  widgetSearchValue?: string
  widgetSearchPlaceholder?: string
  widgetPanelAriaLabel?: string
  widgetSearchAriaLabel?: string
  selectedWidgetId?: string | null
  activeDocumentTabId?: string
  canvasObjects?: TemplateEditorCanvasObject[]
  canvasColumns?: string[]
  showGrid?: boolean
  showDocumentRegions?: boolean
  railActions?: TemplateEditorRailAction[]
  leftStatusSegments?: TemplateEditorStatusSegment[]
  rightStatusSegments?: TemplateEditorStatusSegment[]
  pageAriaLabel?: string
  canvasAriaLabel?: string
  rightRailAriaLabel?: string
  statusBarAriaLabel?: string
}>(), {
  documentTitle: 'Untitled designer',
  documentSubtitle: 'Template-first editing workbench with toolbar and canvas controls.',
  topbarActions: () => [],
  quickActions: () => [],
  alignMenuLabel: 'Align',
  layoutMenuLabel: 'Layout',
  previewLabel: 'Preview',
  previewAriaLabel: 'Open preview',
  zoomOptions: () => [50, 75, 90, 100, 125, 150, 200],
  zoomValue: 100,
  zoomSelectAriaLabel: 'Zoom level',
  zoomInAriaLabel: 'Increase zoom',
  zoomOutAriaLabel: 'Decrease zoom',
  widgetSections: () => [],
  widgetSearchValue: '',
  widgetSearchPlaceholder: 'Search widgets',
  widgetPanelAriaLabel: 'Widget toolbox panel',
  widgetSearchAriaLabel: 'Search widgets',
  selectedWidgetId: null,
  activeDocumentTabId: 'layout',
  canvasObjects: () => [],
  canvasColumns: () => [],
  showGrid: true,
  showDocumentRegions: false,
  railActions: () => [],
  leftStatusSegments: () => [],
  rightStatusSegments: () => [],
  pageAriaLabel: 'Editor workbench page',
  canvasAriaLabel: 'Editor canvas area',
  rightRailAriaLabel: 'Editor right rail',
  statusBarAriaLabel: 'Editor status bar',
})

const emit = defineEmits<{
  'toolbar-action-click': [actionId: string]
  'widget-click': [widgetId: string]
  'canvas-object-click': [objectId: string]
  'rail-action-click': [actionId: string]
  'status-click': [segmentId: string]
  'update:widgetSearchValue': [value: string]
  'update:selectedWidgetId': [value: string | null]
  'update:zoomValue': [value: number]
}>()

const resolvedTopbarActions = computed<TemplateEditorToolbarAction[]>(() => {
  if (props.topbarActions.length > 0) {
    return props.topbarActions
  }

  return [
    { id: 'new', icon: 'note_add', ariaLabel: 'New file' },
    { id: 'open', icon: 'folder_open', ariaLabel: 'Open file' },
    { id: 'save', icon: 'save', ariaLabel: 'Save file' },
    { id: 'cut', icon: 'content_cut', ariaLabel: 'Cut' },
    { id: 'copy', icon: 'content_copy', ariaLabel: 'Copy' },
    { id: 'delete', icon: 'delete', ariaLabel: 'Delete selection' },
  ]
})

const resolvedQuickActions = computed<TemplateEditorToolbarAction[]>(() => {
  if (props.quickActions.length > 0) {
    return props.quickActions
  }

  return [
    { id: 'undo', icon: 'undo', ariaLabel: 'Undo' },
    { id: 'redo', icon: 'redo', ariaLabel: 'Redo' },
    { id: 'duplicate', icon: 'content_copy', ariaLabel: 'Duplicate object' },
  ]
})

const resolvedZoomOptions = computed<number[]>(() => {
  if (props.zoomOptions.length > 0) {
    return props.zoomOptions
  }
  return [100]
})

const resolvedZoomValue = computed<number>(() => {
  return resolvedZoomOptions.value.includes(props.zoomValue)
    ? props.zoomValue
    : resolvedZoomOptions.value[0] || 100
})

const widgetSearchModel = computed<string>({
  get: () => props.widgetSearchValue,
  set: value => emit('update:widgetSearchValue', value),
})

const resolvedWidgetSections = computed<TemplateEditorWidgetSection[]>(() => {
  if (props.widgetSections.length > 0) {
    return props.widgetSections
  }

  return [
    {
      id: 'basic',
      title: 'Basic items',
      items: [
        { id: 'widget-text', label: 'Text', icon: 'text_fields' },
        { id: 'widget-image', label: 'Image', icon: 'image' },
        { id: 'widget-line', label: 'Line', icon: 'show_chart' },
        { id: 'widget-rectangle', label: 'Rectangle', icon: 'crop_16_9' },
      ],
    },
    {
      id: 'comparison',
      title: 'Comparison',
      items: [
        { id: 'widget-column', label: 'Column', icon: 'bar_chart' },
        { id: 'widget-bar', label: 'Bar', icon: 'stacked_bar_chart' },
        { id: 'widget-area', label: 'Area', icon: 'area_chart' },
        { id: 'widget-range', label: 'Range', icon: 'equalizer' },
      ],
    },
    {
      id: 'data',
      title: 'Data regions',
      items: [
        { id: 'widget-table', label: 'Table', icon: 'table_chart' },
        { id: 'widget-list', label: 'List', icon: 'view_list' },
        { id: 'widget-matrix', label: 'Matrix', icon: 'grid_view' },
        { id: 'widget-map', label: 'Map', icon: 'public' },
      ],
    },
  ]
})

const filteredWidgetSections = computed<TemplateEditorWidgetSection[]>(() => {
  const search = widgetSearchModel.value.trim().toLowerCase()
  if (!search) {
    return resolvedWidgetSections.value
  }

  return resolvedWidgetSections.value
    .map(section => {
      const items = section.items.filter(item => {
        const text = [item.label, item.description, ...(item.filterKeys || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return text.includes(search)
      })
      return {
        ...section,
        items,
      }
    })
    .filter(section => section.items.length > 0)
})

const resolvedCanvasColumns = computed<string[]>(() => {
  if (props.canvasColumns.length > 0) {
    return props.canvasColumns
  }

  return [
    'DATE',
    'ORDER #',
    'CLIENT',
    'OPERATOR',
    'STATUS',
    'PRODUCT',
    'QUANTITY',
  ]
})

const resolvedCanvasObjects = computed<TemplateEditorCanvasObject[]>(() => {
  if (props.canvasObjects.length > 0) {
    return props.canvasObjects
  }

  return [
    { id: 'obj-title', label: 'Header title', subtitle: 'Report heading', x: 640, y: 64, width: 300, height: 72, tone: 'info' },
    { id: 'obj-logo', label: 'Brand logo', subtitle: 'Image block', x: 52, y: 64, width: 220, height: 110, tone: 'neutral', locked: true },
    { id: 'obj-table', label: 'Data table', subtitle: 'Bound table region', x: 52, y: 188, width: 1180, height: 150, tone: 'primary' },
    { id: 'obj-footer', label: 'Footer strip', subtitle: 'Legal + KPI row', x: 52, y: 362, width: 1180, height: 76, tone: 'warning' },
  ]
})

const resolvedRailActions = computed<TemplateEditorRailAction[]>(() => {
  if (props.railActions.length > 0) {
    return props.railActions
  }

  return [
    { id: 'properties', icon: 'tune', ariaLabel: 'Open properties' },
    { id: 'layers', icon: 'layers', ariaLabel: 'Open layers' },
    { id: 'filters', icon: 'filter_list', ariaLabel: 'Open filters' },
    { id: 'data', icon: 'dataset', ariaLabel: 'Open data sources' },
    { id: 'settings', icon: 'settings', ariaLabel: 'Open settings' },
  ]
})

const resolvedLeftStatusSegments = computed<TemplateEditorStatusSegment[]>(() => {
  if (props.leftStatusSegments.length > 0) {
    return props.leftStatusSegments
  }

  return [
    { id: 'row-groups', label: 'Row groups', value: '3', tone: 'neutral' },
    { id: 'warnings', label: 'Warnings', value: '2', tone: 'warning' },
  ]
})

const resolvedRightStatusSegments = computed<TemplateEditorStatusSegment[]>(() => {
  if (props.rightStatusSegments.length > 0) {
    return props.rightStatusSegments
  }

  return [
    { id: 'column-groups', label: 'Column groups', value: '4', tone: 'info' },
    { id: 'snap', label: 'Snap grid', value: 'On', tone: 'success' },
  ]
})

const horizontalRulerMarks = computed<number[]>(() => {
  return Array.from({ length: 33 }, (_, index) => index * 50)
})

const verticalRulerMarks = computed<number[]>(() => {
  return Array.from({ length: 20 }, (_, index) => index * 50)
})

function selectWidget(widgetId: string): void {
  emit('update:selectedWidgetId', widgetId)
  emit('widget-click', widgetId)
}

function onZoomChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  const value = Number(target.value)
  if (!Number.isFinite(value)) {
    return
  }
  emit('update:zoomValue', value)
}

function decreaseZoom(): void {
  const currentIndex = resolvedZoomOptions.value.indexOf(resolvedZoomValue.value)
  const nextIndex = Math.max(currentIndex - 1, 0)
  emit('update:zoomValue', resolvedZoomOptions.value[nextIndex] || resolvedZoomValue.value)
}

function increaseZoom(): void {
  const currentIndex = resolvedZoomOptions.value.indexOf(resolvedZoomValue.value)
  const nextIndex = Math.min(currentIndex + 1, resolvedZoomOptions.value.length - 1)
  emit('update:zoomValue', resolvedZoomOptions.value[nextIndex] || resolvedZoomValue.value)
}

function resolveCanvasObjectStyle(item: TemplateEditorCanvasObject, index: number): Record<string, string> {
  const fallbackX = 48 + (index % 3) * 280
  const fallbackY = 88 + Math.floor(index / 3) * 96

  return {
    left: `${item.x ?? fallbackX}px`,
    top: `${item.y ?? fallbackY}px`,
    width: `${item.width ?? 240}px`,
    height: `${item.height ?? 68}px`,
  }
}
</script>

<style scoped lang="scss">
.ntk-template-editor-workbench {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--ntk-template-editor-bg, #eef0f4);
  color: var(--ntk-template-editor-text, #1f2937);
  border: 1px solid var(--ntk-template-editor-border, #d1d5db);
  border-radius: var(--ntk-template-editor-radius, 8px);
  box-shadow: var(--ntk-template-editor-shadow, 0 4px 20px rgba(15, 23, 42, 0.08));
  overflow: hidden;
}

.ntk-template-editor-workbench__topbar {
  min-height: 56px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--ntk-template-editor-border, #d1d5db);
  background: var(--ntk-template-editor-toolbar-bg, #f8f9fb);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ntk-template-editor-workbench__document h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.ntk-template-editor-workbench__document p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--ntk-template-editor-muted-text, #6b7280);
}

.ntk-template-editor-workbench__topbar-actions,
.ntk-template-editor-workbench__command-groups {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ntk-template-editor-workbench__commandbar {
  min-height: 46px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--ntk-template-editor-border, #d1d5db);
  background: var(--ntk-template-editor-commandbar-bg, #ffffff);
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-template-editor-workbench__command-menus {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ntk-template-editor-workbench__toolbar-action {
  min-height: 30px;
  min-width: 30px;
  border: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  border-radius: var(--ntk-template-editor-control-radius, 6px);
  background: var(--ntk-template-editor-button-bg, #ffffff);
  color: var(--ntk-template-editor-button-text, #374151);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  cursor: pointer;
}

.ntk-template-editor-workbench__toolbar-action--compact {
  min-width: 28px;
  padding: 0 6px;
}

.ntk-template-editor-workbench__toolbar-action:hover:not(:disabled),
.ntk-template-editor-workbench__menu-pill:hover,
.ntk-template-editor-workbench__zoom-step:hover {
  background: var(--ntk-template-editor-button-hover-bg, #f3f4f6);
}

.ntk-template-editor-workbench__toolbar-action:disabled,
.ntk-template-editor-workbench__rail-action:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.ntk-template-editor-workbench__menu-pill {
  min-height: 30px;
  border: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  border-radius: var(--ntk-template-editor-control-radius, 6px);
  background: var(--ntk-template-editor-button-bg, #ffffff);
  color: var(--ntk-template-editor-button-text, #374151);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  cursor: pointer;
}

.ntk-template-editor-workbench__zoom {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  border-radius: var(--ntk-template-editor-control-radius, 6px);
  overflow: hidden;
  background: var(--ntk-template-editor-button-bg, #ffffff);
}

.ntk-template-editor-workbench__zoom-step {
  height: 30px;
  width: 30px;
  border: 0;
  background: var(--ntk-template-editor-button-bg, #ffffff);
  color: var(--ntk-template-editor-button-text, #374151);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ntk-template-editor-workbench__zoom-select {
  height: 30px;
  border: 0;
  border-left: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  border-right: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  background: var(--ntk-template-editor-button-bg, #ffffff);
  color: var(--ntk-template-editor-button-text, #374151);
  font-size: 12px;
  padding: 0 6px;
  outline: none;
}

.ntk-template-editor-workbench__preview {
  margin-left: 4px;
}

.ntk-template-editor-workbench__workspace {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 188px minmax(0, 1fr) 46px;
  gap: 0;
}

.ntk-template-editor-workbench__widgets-panel {
  border-right: 1px solid var(--ntk-template-editor-border, #d1d5db);
  background: var(--ntk-template-editor-panel-bg, #f3f4f6);
  padding: 8px;
  overflow: auto;
}

.ntk-template-editor-workbench__widget-search {
  border: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  border-radius: var(--ntk-template-editor-control-radius, 6px);
  background: var(--ntk-template-editor-surface, #ffffff);
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 0 8px;
}

.ntk-template-editor-workbench__widget-search-input {
  border: 0;
  outline: 0;
  background: transparent;
  width: 100%;
  font-size: 12px;
  color: var(--ntk-template-editor-text, #1f2937);
}

.ntk-template-editor-workbench__widget-section {
  margin-top: 10px;
  border: 1px solid var(--ntk-template-editor-border, #d1d5db);
  border-radius: var(--ntk-template-editor-radius, 8px);
  background: var(--ntk-template-editor-surface, #ffffff);
}

.ntk-template-editor-workbench__widget-section-header {
  padding: 6px 8px;
  font-size: 12px;
  border-bottom: 1px solid var(--ntk-template-editor-border-soft, #e5e7eb);
}

.ntk-template-editor-workbench__widget-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ntk-template-editor-workbench__widget-item {
  min-height: 62px;
  border: 0;
  border-right: 1px solid var(--ntk-template-editor-border-soft, #e5e7eb);
  border-bottom: 1px solid var(--ntk-template-editor-border-soft, #e5e7eb);
  background: var(--ntk-template-editor-surface, #ffffff);
  color: var(--ntk-template-editor-button-text, #374151);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  cursor: pointer;
}

.ntk-template-editor-workbench__widget-item:nth-child(2n) {
  border-right: 0;
}

.ntk-template-editor-workbench__widget-item--active {
  background: var(--ntk-template-editor-accent-soft, #dbeafe);
  color: var(--ntk-template-editor-accent, #1e3a8a);
}

.ntk-template-editor-workbench__canvas-shell {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--ntk-template-editor-shell-bg, #e5e7eb);
}

.ntk-template-editor-workbench__ruler-top {
  min-height: 24px;
  border-bottom: 1px solid var(--ntk-template-editor-border, #cbd5e1);
  background: var(--ntk-template-editor-ruler-bg, #f8fafc);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.ntk-template-editor-workbench__ruler-mark {
  width: 50px;
  flex: 0 0 50px;
  border-right: 1px solid var(--ntk-template-editor-border-soft, #e2e8f0);
  padding-left: 4px;
  font-size: 10px;
  color: var(--ntk-template-editor-muted-text, #64748b);
}

.ntk-template-editor-workbench__canvas-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
}

.ntk-template-editor-workbench__ruler-left {
  border-right: 1px solid var(--ntk-template-editor-border, #cbd5e1);
  background: var(--ntk-template-editor-ruler-bg, #f8fafc);
  display: flex;
  flex-direction: column;
}

.ntk-template-editor-workbench__ruler-mark--vertical {
  width: auto;
  min-height: 50px;
  border-bottom: 1px solid var(--ntk-template-editor-border-soft, #e2e8f0);
  border-right: 0;
  transform: rotate(-90deg);
  transform-origin: left top;
  margin-left: 3px;
  padding-left: 0;
}

.ntk-template-editor-workbench__canvas-stage {
  position: relative;
  min-height: 560px;
  overflow: auto;
  background: var(--ntk-template-editor-stage-bg, #f9fafb);
}

.ntk-template-editor-workbench__canvas-stage--grid {
  background-image:
    linear-gradient(var(--ntk-template-editor-stage-grid, rgba(148, 163, 184, 0.2)) 1px, transparent 1px),
    linear-gradient(90deg, var(--ntk-template-editor-stage-grid, rgba(148, 163, 184, 0.2)) 1px, transparent 1px);
  background-size: 20px 20px, 20px 20px;
}

.ntk-template-editor-workbench__canvas-header {
  position: sticky;
  top: 0;
  z-index: 3;
  min-height: 38px;
  background: var(--ntk-template-editor-ruler-overlay-bg, rgba(248, 250, 252, 0.9));
  border-bottom: 1px solid var(--ntk-template-editor-border, #cbd5e1);
  display: grid;
  grid-template-columns: repeat(7, minmax(120px, 1fr));
}

.ntk-template-editor-workbench__canvas-header-cell {
  border-right: 1px solid var(--ntk-template-editor-border, #d1d5db);
  font-size: 11px;
  font-weight: 700;
  color: var(--ntk-template-editor-button-text, #374151);
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
}

.ntk-template-editor-workbench__canvas-object {
  position: absolute;
  border: 1px solid var(--ntk-template-editor-canvas-object-border, #9ca3af);
  background: var(--ntk-template-editor-canvas-object-bg, rgba(255, 255, 255, 0.92));
  color: var(--ntk-template-editor-text, #111827);
  border-radius: calc(var(--ntk-template-editor-control-radius, 6px) - 2px);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--ntk-template-editor-canvas-object-shadow, 0 1px 2px rgba(15, 23, 42, 0.06));
}

.ntk-template-editor-workbench__canvas-object--primary {
  border-color: var(--ntk-template-editor-accent, #2563eb);
}

.ntk-template-editor-workbench__canvas-object--info {
  border-color: var(--ntk-template-editor-info, #0284c7);
}

.ntk-template-editor-workbench__canvas-object--warning {
  border-color: var(--ntk-template-editor-warning, #d97706);
}

.ntk-template-editor-workbench__canvas-object-title {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
}

.ntk-template-editor-workbench__canvas-object small {
  font-size: 11px;
  color: var(--ntk-template-editor-muted-text, #6b7280);
}

.ntk-template-editor-workbench__right-rail {
  border-left: 1px solid var(--ntk-template-editor-border, #d1d5db);
  background: var(--ntk-template-editor-panel-bg, #f3f4f6);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px;
  gap: 6px;
}

.ntk-template-editor-workbench__rail-action {
  height: 30px;
  width: 30px;
  border: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  border-radius: var(--ntk-template-editor-control-radius, 6px);
  background: var(--ntk-template-editor-button-bg, #ffffff);
  color: var(--ntk-template-editor-button-text, #374151);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ntk-template-editor-workbench__statusbar {
  min-height: 34px;
  border-top: 1px solid var(--ntk-template-editor-border, #d1d5db);
  background: var(--ntk-template-editor-statusbar-bg, #f8fafc);
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ntk-template-editor-workbench__status-group {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ntk-template-editor-workbench__status-segment {
  min-height: 24px;
  border: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  border-radius: var(--ntk-template-editor-control-radius, 6px);
  background: var(--ntk-template-editor-button-bg, #ffffff);
  color: var(--ntk-template-editor-button-text, #374151);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  font-size: 11px;
  cursor: pointer;
}

.ntk-template-editor-workbench__status-segment strong {
  font-size: 11px;
}

.ntk-template-editor-workbench__status-segment--warning {
  border-color: var(--ntk-template-editor-warning, #f59e0b);
  color: var(--ntk-template-editor-warning-text, #92400e);
}

.ntk-template-editor-workbench__status-segment--info {
  border-color: var(--ntk-template-editor-info, #0ea5e9);
  color: var(--ntk-template-editor-info-text, #0c4a6e);
}

.ntk-template-editor-workbench__status-segment--success {
  border-color: var(--ntk-template-editor-success, #22c55e);
  color: var(--ntk-template-editor-success-text, #14532d);
}

@media (max-width: 1260px) {
  .ntk-template-editor-workbench__workspace {
    grid-template-columns: 164px minmax(0, 1fr) 42px;
  }

  .ntk-template-editor-workbench__canvas-header {
    grid-template-columns: repeat(7, minmax(90px, 1fr));
  }
}

@media (max-width: 980px) {
  .ntk-template-editor-workbench__commandbar {
    flex-wrap: wrap;
  }

  .ntk-template-editor-workbench__zoom {
    margin-left: 0;
  }

  .ntk-template-editor-workbench__workspace {
    grid-template-columns: 1fr;
  }

  .ntk-template-editor-workbench__widgets-panel {
    border-right: 0;
    border-bottom: 1px solid #d1d5db;
  }

  .ntk-template-editor-workbench__right-rail {
    border-left: 0;
    border-top: 1px solid #d1d5db;
    flex-direction: row;
    justify-content: center;
  }
}

.ntk-template-editor-workbench__tab-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 300px;
  padding: 40px 24px;
  gap: 12px;
  color: var(--ntk-template-editor-canvas-text, #374151);
}

.ntk-template-editor-workbench__tab-placeholder-icon {
  color: var(--ntk-template-editor-canvas-text, #94a3b8);
  opacity: 0.5;
}

.ntk-template-editor-workbench__tab-placeholder-label {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--ntk-template-editor-canvas-text, #374151);
}

.ntk-template-editor-workbench__tab-placeholder-desc {
  font-size: 13px;
  color: var(--ntk-template-editor-canvas-text, #94a3b8);
  margin: 0;
  text-align: center;
  max-width: 320px;
}

.ntk-template-editor-workbench__data-table {
  width: 100%;
  max-width: 560px;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 8px 12px;
    text-align: left;
    border: 1px solid var(--ntk-template-editor-button-border, #d1d5db);
  }

  th {
    background: var(--ntk-template-editor-panel-bg, #f3f4f6);
    font-weight: 600;
    font-size: 12px;
    color: var(--ntk-template-editor-canvas-text, #374151);
  }

  td {
    background: var(--ntk-template-editor-canvas-bg, #ffffff);
    color: var(--ntk-template-editor-canvas-text, #374151);
  }

  tr:nth-child(even) td {
    background: var(--ntk-template-editor-panel-bg, #f9fafb);
  }
}

/* ── Document region bands ─────────────────────────────────────────────── */

.ntk-template-editor-workbench__document-regions {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  z-index: 0;
}

.ntk-template-editor-workbench__document-region {
  display: flex;
  align-items: flex-start;
  padding: 6px 10px;
  border-bottom: 1px dashed var(--ntk-template-editor-stage-grid, rgba(148, 163, 184, 0.35));
}

.ntk-template-editor-workbench__document-region--header {
  height: 180px;
  flex-shrink: 0;
  background: rgba(224, 242, 254, 0.18);
}

.ntk-template-editor-workbench__document-region--body {
  flex: 1;
  background: rgba(240, 253, 244, 0.18);
}

.ntk-template-editor-workbench__document-region--footer {
  height: 100px;
  flex-shrink: 0;
  background: rgba(254, 249, 195, 0.18);
  border-bottom: none;
}

.ntk-template-editor-workbench__document-region-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ntk-template-editor-muted-text, #94a3b8);
  opacity: 0.7;
}

/* ── Preview mode ──────────────────────────────────────────────────────── */

.ntk-template-editor-workbench__canvas-stage--preview {
  background: #ffffff;
}

.ntk-template-editor-workbench__canvas-stage--preview
  .ntk-template-editor-workbench__ruler-top,
.ntk-template-editor-workbench__canvas-stage--preview
  .ntk-template-editor-workbench__ruler-left {
  opacity: 0.25;
}

.ntk-template-editor-workbench__canvas-object--readonly {
  cursor: default;
  pointer-events: none;
  user-select: none;
}

.ntk-template-editor-workbench__canvas-stage--preview
  .ntk-template-editor-workbench__document-regions {
  opacity: 0.6;
}
</style>
