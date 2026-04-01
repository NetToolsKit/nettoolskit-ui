
<template>
  <q-page
    class="ntk-template-wiki"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-wiki__hero">
      <div class="ntk-template-wiki__hero-main">
        <div class="ntk-template-wiki__hero-icon">
          <q-icon
            :name="heroIcon"
            size="20px"
          />
        </div>
        <div>
          <h1 class="ntk-template-wiki__hero-title">
            {{ title }}
          </h1>
          <p
            v-if="subtitle"
            class="ntk-template-wiki__hero-subtitle"
          >
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div
        v-if="resolvedStatChips.length > 0"
        class="ntk-template-wiki__hero-stats"
      >
        <div
          v-for="chip in resolvedStatChips"
          :key="chip.id"
          class="ntk-template-wiki__chip"
          :class="`ntk-template-wiki__chip--${chip.tone || 'neutral'}`"
        >
          <q-icon
            :name="chip.icon || 'insights'"
            size="14px"
          />
          <span>{{ chip.value }} {{ chip.label }}</span>
        </div>
      </div>

      <slot name="hero-actions">
        <q-btn
          v-if="showExportAction"
          flat
          dense
          no-caps
          icon="download"
          :label="exportLabel"
          class="ntk-template-wiki__hero-action"
          @click="emit('export-click')"
        />
      </slot>
    </section>

    <div class="ntk-template-wiki__main">
      <aside class="ntk-template-wiki__sidebar">
        <div class="ntk-template-wiki__sidebar-header">
          <span class="ntk-template-wiki__sidebar-title">{{ categoriesLabel }}</span>
          <div class="ntk-template-wiki__sidebar-search">
            <q-icon
              name="search"
              size="16px"
            />
            <input
              v-model="sidebarSearch"
              type="text"
              :placeholder="categorySearchPlaceholder"
              :aria-label="categorySearchAriaLabel"
              class="ntk-template-wiki__search-input"
            >
          </div>
        </div>

        <div class="ntk-template-wiki__tree">
          <template
            v-for="category in filteredCategories"
            :key="category.id"
          >
            <button
              type="button"
              class="ntk-template-wiki__tree-item"
              :class="{ 'ntk-template-wiki__tree-item--active': isCategoryActive(category.id) }"
              @click="toggleCategory(category)"
            >
              <q-icon
                name="chevron_right"
                size="16px"
                class="ntk-template-wiki__tree-expand"
                :class="{ 'ntk-template-wiki__tree-expand--open': isExpanded(category.id) }"
              />
              <q-icon
                name="folder"
                size="16px"
                class="ntk-template-wiki__tree-folder"
              />
              <span class="ntk-template-wiki__tree-label">{{ category.name }}</span>
              <span
                v-if="category.count !== undefined"
                class="ntk-template-wiki__tree-badge"
              >
                {{ category.count }}
              </span>
            </button>

            <transition name="ntk-template-wiki__tree-slide">
              <div
                v-if="isExpanded(category.id) && (category.children?.length ?? 0) > 0"
                class="ntk-template-wiki__tree-children"
              >
                <button
                  v-for="child in category.children"
                  :key="child.id"
                  type="button"
                  class="ntk-template-wiki__tree-item ntk-template-wiki__tree-item--child"
                  :class="{ 'ntk-template-wiki__tree-item--active': isSubCategoryActive(category.id, child.id) }"
                  @click="selectSubCategory(category, child)"
                >
                  <q-icon
                    name="folder"
                    size="14px"
                    class="ntk-template-wiki__tree-folder"
                  />
                  <span class="ntk-template-wiki__tree-label">{{ child.name }}</span>
                  <span
                    v-if="child.count !== undefined"
                    class="ntk-template-wiki__tree-badge ntk-template-wiki__tree-badge--sm"
                  >
                    {{ child.count }}
                  </span>
                </button>
              </div>
            </transition>
          </template>
        </div>
      </aside>
      <section class="ntk-template-wiki__content">
        <div class="ntk-template-wiki__toolbar">
          <div class="ntk-template-wiki__search">
            <q-icon
              name="search"
              size="18px"
            />
            <input
              v-model="documentSearch"
              type="text"
              :placeholder="documentSearchPlaceholder"
              :aria-label="documentSearchAriaLabel"
              class="ntk-template-wiki__search-input"
            >
          </div>

          <div class="ntk-template-wiki__filters">
            <button
              v-for="filter in resolvedFilterOptions"
              :key="filter.value"
              type="button"
              class="ntk-template-wiki__filter"
              :class="{ 'ntk-template-wiki__filter--active': activeFilter === filter.value }"
              @click="setFilter(filter.value)"
            >
              {{ filter.label }}
            </button>
          </div>

          <div class="ntk-template-wiki__views">
            <button
              type="button"
              class="ntk-template-wiki__view"
              :class="{ 'ntk-template-wiki__view--active': viewMode === 'list' }"
              :aria-label="listViewAriaLabel"
              @click="setViewMode('list')"
            >
              <q-icon
                name="view_list"
                size="16px"
              />
            </button>
            <button
              type="button"
              class="ntk-template-wiki__view"
              :class="{ 'ntk-template-wiki__view--active': viewMode === 'grid' }"
              :aria-label="gridViewAriaLabel"
              @click="setViewMode('grid')"
            >
              <q-icon
                name="grid_view"
                size="16px"
              />
            </button>
          </div>
        </div>

        <div class="ntk-template-wiki__surface">
          <div class="ntk-template-wiki__surface-header">
            <div class="ntk-template-wiki__crumbs">
              <button
                type="button"
                class="ntk-template-wiki__crumb"
                @click="clearSelection"
              >
                {{ rootCrumbLabel }}
              </button>
              <span
                v-if="selectedCategoryName"
                class="ntk-template-wiki__crumb-separator"
              >/</span>
              <button
                v-if="selectedCategoryName"
                type="button"
                class="ntk-template-wiki__crumb"
                :class="{ 'ntk-template-wiki__crumb--current': !selectedSubCategoryName }"
                @click="clearSubCategory"
              >
                {{ selectedCategoryName }}
              </button>
              <span
                v-if="selectedSubCategoryName"
                class="ntk-template-wiki__crumb-separator"
              >/</span>
              <span
                v-if="selectedSubCategoryName"
                class="ntk-template-wiki__crumb ntk-template-wiki__crumb--current"
              >
                {{ selectedSubCategoryName }}
              </span>
            </div>

            <span class="ntk-template-wiki__meta">
              {{ filteredDocuments.length }} {{ itemsLabel }}
            </span>
          </div>

          <div class="ntk-template-wiki__body">
            <table
              v-if="viewMode === 'list'"
              class="ntk-template-wiki__table"
            >
              <thead>
                <tr>
                  <th class="ntk-template-wiki__column-check">
                    <q-checkbox
                      v-model="selectAll"
                      dense
                    />
                  </th>
                  <th>{{ tableDocumentLabel }}</th>
                  <th>{{ tableCategoryLabel }}</th>
                  <th>{{ tableTagsLabel }}</th>
                  <th>{{ tableStatusLabel }}</th>
                  <th>{{ tableUploadDateLabel }}</th>
                  <th>{{ tableActionsLabel }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="doc in filteredDocuments"
                  :key="doc.id"
                >
                  <td class="ntk-template-wiki__column-check">
                    <q-checkbox
                      :model-value="selectedIds.has(doc.id)"
                      dense
                      @update:model-value="toggleSelection(doc.id, $event)"
                    />
                  </td>
                  <td>
                    <div class="ntk-template-wiki__file">
                      <div class="ntk-template-wiki__file-icon">
                        <q-icon
                          :name="resolveFileIcon(doc.fileType)"
                          size="16px"
                        />
                      </div>
                      <div>
                        <span class="ntk-template-wiki__file-name">{{ doc.name }}</span>
                        <span class="ntk-template-wiki__file-size">{{ doc.size || emptyValueLabel }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ doc.category || emptyValueLabel }}</td>
                  <td>
                    <div class="ntk-template-wiki__tags">
                      <span
                        v-for="tag in (doc.tags || []).slice(0, 3)"
                        :key="tag"
                        class="ntk-template-wiki__tag"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="ntk-template-wiki__status">
                      {{ resolveStatusLabel(doc.status || 'processed') }}
                    </span>
                  </td>
                  <td>{{ doc.uploadDate || emptyValueLabel }}</td>
                  <td>
                    <div class="ntk-template-wiki__actions">
                      <button
                        type="button"
                        class="ntk-template-wiki__action"
                        :aria-label="viewActionAriaLabel"
                        @click="emit('view-document', doc)"
                      >
                        <q-icon
                          name="visibility"
                          size="16px"
                        />
                      </button>
                      <button
                        type="button"
                        class="ntk-template-wiki__action"
                        :aria-label="downloadActionAriaLabel"
                        @click="emit('download-document', doc)"
                      >
                        <q-icon
                          name="download"
                          size="16px"
                        />
                      </button>
                      <button
                        type="button"
                        class="ntk-template-wiki__action"
                        :aria-label="askActionAriaLabel"
                        @click="emit('ask-document', doc)"
                      >
                        <q-icon
                          name="smart_toy"
                          size="16px"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              v-else
              class="ntk-template-wiki__cards"
            >
              <article
                v-for="doc in filteredDocuments"
                :key="doc.id"
                class="ntk-template-wiki__card"
              >
                <div class="ntk-template-wiki__file-icon ntk-template-wiki__file-icon--large">
                  <q-icon
                    :name="resolveFileIcon(doc.fileType)"
                    size="20px"
                  />
                </div>
                <span class="ntk-template-wiki__card-name">{{ doc.name }}</span>
                <span class="ntk-template-wiki__card-meta">{{ doc.category || emptyValueLabel }}</span>
                <div class="ntk-template-wiki__tags">
                  <span
                    v-for="tag in (doc.tags || []).slice(0, 2)"
                    :key="tag"
                    class="ntk-template-wiki__tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </article>
            </div>
          </div>

          <div class="ntk-template-wiki__summary">
            <div
              v-for="chip in summaryChips"
              :key="chip.id"
              class="ntk-template-wiki__summary-item"
            >
              <strong>{{ chip.value }}</strong>
              <span>{{ chip.label }}</span>
            </div>

            <q-btn
              v-if="showBulkDownloadAction"
              flat
              dense
              no-caps
              icon="download"
              :label="selectedDownloadLabel"
              class="ntk-template-wiki__summary-action"
              :disable="selectedIds.size === 0"
              @click="emitBulkDownload"
            />
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type {
  TemplateWikiCategoryNode,
  TemplateWikiDocument,
  TemplateWikiDocumentStatus,
  TemplateWikiFilterOption,
  TemplateWikiStatChip,
  TemplateWikiViewMode,
} from './wiki-template.types'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  heroIcon?: string
  categoriesLabel?: string
  rootCrumbLabel?: string
  itemsLabel?: string
  exportLabel?: string
  selectedDownloadLabel?: string
  tableDocumentLabel?: string
  tableCategoryLabel?: string
  tableTagsLabel?: string
  tableStatusLabel?: string
  tableUploadDateLabel?: string
  tableActionsLabel?: string
  emptyValueLabel?: string
  categorySearchPlaceholder?: string
  documentSearchPlaceholder?: string
  categorySearchAriaLabel?: string
  documentSearchAriaLabel?: string
  listViewAriaLabel?: string
  gridViewAriaLabel?: string
  viewActionAriaLabel?: string
  downloadActionAriaLabel?: string
  askActionAriaLabel?: string
  pageAriaLabel?: string
  initialViewMode?: TemplateWikiViewMode
  showExportAction?: boolean
  showBulkDownloadAction?: boolean
  categories?: TemplateWikiCategoryNode[]
  documents?: TemplateWikiDocument[]
  filterOptions?: TemplateWikiFilterOption[]
  statChips?: TemplateWikiStatChip[]
  statusLabels?: Partial<Record<TemplateWikiDocumentStatus, string>>
}>(), {
  title: 'Knowledge hub',
  subtitle: 'Reusable content workspace for dashboards, CRUD modules and documentation flows.',
  heroIcon: 'auto_stories',
  categoriesLabel: 'Categories',
  rootCrumbLabel: 'Workspace',
  itemsLabel: 'items',
  exportLabel: 'Export',
  selectedDownloadLabel: 'Download selected',
  tableDocumentLabel: 'Document',
  tableCategoryLabel: 'Category',
  tableTagsLabel: 'Tags',
  tableStatusLabel: 'Status',
  tableUploadDateLabel: 'Updated at',
  tableActionsLabel: 'Actions',
  emptyValueLabel: '—',
  categorySearchPlaceholder: 'Search categories...',
  documentSearchPlaceholder: 'Search items...',
  categorySearchAriaLabel: 'Search categories',
  documentSearchAriaLabel: 'Search items',
  listViewAriaLabel: 'List view',
  gridViewAriaLabel: 'Grid view',
  viewActionAriaLabel: 'View item',
  downloadActionAriaLabel: 'Download item',
  askActionAriaLabel: 'Open AI contextual action',
  pageAriaLabel: 'Knowledge workspace page',
  initialViewMode: 'list',
  showExportAction: true,
  showBulkDownloadAction: true,
  categories: () => [],
  documents: () => [],
  filterOptions: () => [],
  statChips: () => [],
  statusLabels: () => ({}),
})

const emit = defineEmits<{
  'export-click': []
  'ask-document': [document: TemplateWikiDocument]
  'view-document': [document: TemplateWikiDocument]
  'download-document': [document: TemplateWikiDocument]
  'bulk-download': [documents: TemplateWikiDocument[]]
  'view-mode-change': [mode: TemplateWikiViewMode]
  'category-change': [payload: { categoryId: string | null; subCategoryId: string | null }]
  'selection-change': [ids: string[]]
}>()

const sidebarSearch = ref('')
const documentSearch = ref('')
const activeFilter = ref('all')
const viewMode = ref<TemplateWikiViewMode>(props.initialViewMode)
const expandedIds = ref<Set<string>>(new Set())
const selectedCategoryId = ref<string | null>(null)
const selectedSubCategoryId = ref<string | null>(null)
const selectedIds = ref<Set<string>>(new Set())

watch(
  () => props.categories,
  categories => {
    const next = new Set<string>()
    categories.forEach(category => {
      if (category.expanded) {
        next.add(category.id)
      }
    })
    expandedIds.value = next
  },
  { immediate: true }
)

const resolvedFilterOptions = computed<TemplateWikiFilterOption[]>(() => {
  if (props.filterOptions.length > 0) {
    return props.filterOptions
  }

  return [
    { value: 'all', label: 'All' },
    { value: 'processed', label: 'Processed', statuses: ['processed'] },
    { value: 'pending', label: 'Pending', statuses: ['pending'] },
    { value: 'error', label: 'Error', statuses: ['error'] },
  ]
})

const resolvedStatChips = computed<TemplateWikiStatChip[]>(() => {
  if (props.statChips.length > 0) {
    return props.statChips
  }

  const processed = props.documents.filter(documentItem => documentItem.status === 'processed').length
  const pending = props.documents.filter(documentItem => documentItem.status === 'pending').length
  const error = props.documents.filter(documentItem => documentItem.status === 'error').length

  return [
    { id: 'total', label: 'items', value: props.documents.length, icon: 'description', tone: 'info' },
    { id: 'processed', label: 'processed', value: processed, icon: 'check_circle', tone: 'success' },
    { id: 'pending', label: 'pending', value: pending, icon: 'schedule', tone: 'warning' },
    { id: 'error', label: 'error', value: error, icon: 'cancel', tone: 'danger' },
  ]
})

const summaryChips = computed<TemplateWikiStatChip[]>(() => {
  return resolvedStatChips.value.filter(chip => chip.id !== 'total')
})
const filteredCategories = computed<TemplateWikiCategoryNode[]>(() => {
  const search = sidebarSearch.value.toLowerCase().trim()
  if (!search) {
    return props.categories
  }

  return props.categories.filter(category => {
    const nameMatch = category.name.toLowerCase().includes(search)
    const childMatch = (category.children || []).some(child => child.name.toLowerCase().includes(search))
    return nameMatch || childMatch
  })
})

const selectedCategoryName = computed<string | null>(() => {
  if (!selectedCategoryId.value) {
    return null
  }

  return props.categories.find(category => category.id === selectedCategoryId.value)?.name || null
})

const selectedSubCategoryName = computed<string | null>(() => {
  if (!selectedCategoryId.value || !selectedSubCategoryId.value) {
    return null
  }

  const category = props.categories.find(item => item.id === selectedCategoryId.value)
  return category?.children?.find(child => child.id === selectedSubCategoryId.value)?.name || null
})

const filteredDocuments = computed<TemplateWikiDocument[]>(() => {
  let documents = [...props.documents]

  if (selectedSubCategoryId.value) {
    documents = documents.filter(documentItem => {
      return (
        documentItem.subCategoryId === selectedSubCategoryId.value ||
        documentItem.subCategory === selectedSubCategoryName.value
      )
    })
  } else if (selectedCategoryId.value) {
    documents = documents.filter(documentItem => {
      return (
        documentItem.categoryId === selectedCategoryId.value ||
        documentItem.category === selectedCategoryName.value
      )
    })
  }

  const filter = resolvedFilterOptions.value.find(option => option.value === activeFilter.value)
  if (filter && filter.value !== 'all') {
    const statuses = filter.statuses ?? [filter.value as TemplateWikiDocumentStatus]
    documents = documents.filter(documentItem => statuses.includes(documentItem.status || 'processed'))
  }

  const search = documentSearch.value.toLowerCase().trim()
  if (search) {
    documents = documents.filter(documentItem => {
      const rawText = [
        documentItem.name,
        documentItem.category,
        documentItem.subCategory,
        ...(documentItem.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return rawText.includes(search)
    })
  }

  return documents
})

const selectAll = computed<boolean>({
  get: () => {
    if (filteredDocuments.value.length === 0) {
      return false
    }
    return filteredDocuments.value.every(doc => selectedIds.value.has(doc.id))
  },
  set: value => {
    const next = new Set(selectedIds.value)
    filteredDocuments.value.forEach(doc => {
      if (value) {
        next.add(doc.id)
      } else {
        next.delete(doc.id)
      }
    })
    selectedIds.value = next
    emit('selection-change', [...next])
  },
})

function isExpanded(categoryId: string): boolean {
  return expandedIds.value.has(categoryId)
}

function isCategoryActive(categoryId: string): boolean {
  return selectedCategoryId.value === categoryId && !selectedSubCategoryId.value
}

function isSubCategoryActive(categoryId: string, subCategoryId: string): boolean {
  return selectedCategoryId.value === categoryId && selectedSubCategoryId.value === subCategoryId
}

function toggleCategory(category: TemplateWikiCategoryNode): void {
  const next = new Set(expandedIds.value)
  if (next.has(category.id)) {
    next.delete(category.id)
  } else {
    next.add(category.id)
  }
  expandedIds.value = next

  selectedCategoryId.value = category.id
  selectedSubCategoryId.value = null
  emit('category-change', { categoryId: category.id, subCategoryId: null })
}

function selectSubCategory(category: TemplateWikiCategoryNode, child: TemplateWikiCategoryNode): void {
  selectedCategoryId.value = category.id
  selectedSubCategoryId.value = child.id
  emit('category-change', { categoryId: category.id, subCategoryId: child.id })
}

function clearSelection(): void {
  selectedCategoryId.value = null
  selectedSubCategoryId.value = null
  emit('category-change', { categoryId: null, subCategoryId: null })
}

function clearSubCategory(): void {
  selectedSubCategoryId.value = null
  emit('category-change', { categoryId: selectedCategoryId.value, subCategoryId: null })
}

function setFilter(value: string): void {
  activeFilter.value = value
}

function setViewMode(mode: TemplateWikiViewMode): void {
  viewMode.value = mode
  emit('view-mode-change', mode)
}

function toggleSelection(documentId: string, value: boolean): void {
  const next = new Set(selectedIds.value)
  if (value) {
    next.add(documentId)
  } else {
    next.delete(documentId)
  }
  selectedIds.value = next
  emit('selection-change', [...next])
}

function emitBulkDownload(): void {
  const selectedDocuments = props.documents.filter(documentItem => selectedIds.value.has(documentItem.id))
  emit('bulk-download', selectedDocuments)
}

function resolveFileIcon(fileType?: string): string {
  const iconMap: Record<string, string> = {
    pdf: 'picture_as_pdf',
    doc: 'description',
    xls: 'table_chart',
    img: 'image',
    txt: 'article',
    md: 'notes',
    ppt: 'slideshow',
    other: 'insert_drive_file',
  }

  return iconMap[fileType || 'other'] || iconMap.other
}

function resolveStatusLabel(status: TemplateWikiDocumentStatus): string {
  return props.statusLabels[status] || status
}
</script>
<style scoped lang="scss">
.ntk-template-wiki {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--ntk-template-wiki-bg, #f8fafc);
}

.ntk-template-wiki__hero {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-template-wiki__hero-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-template-wiki__hero-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-template-wiki-icon-bg, #0f766e);
  color: var(--ntk-template-wiki-icon-text, #ffffff);
}

.ntk-template-wiki__hero-title {
  margin: 0;
  font-size: 17px;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-wiki__hero-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-wiki__hero-stats {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ntk-template-wiki__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 14px;
  padding: 4px 10px;
  font-size: 11px;
  color: #475569;
  background: #f1f5f9;
}

.ntk-template-wiki__chip--info {
  color: #1d4ed8;
  background: rgba(59, 130, 246, 0.12);
}

.ntk-template-wiki__chip--success {
  color: #166534;
  background: rgba(34, 197, 94, 0.12);
}

.ntk-template-wiki__chip--warning {
  color: #92400e;
  background: rgba(245, 158, 11, 0.14);
}

.ntk-template-wiki__chip--danger {
  color: #991b1b;
  background: rgba(239, 68, 68, 0.14);
}

.ntk-template-wiki__hero-action {
  margin-left: auto;
  border-radius: 8px;
}

.ntk-template-wiki__main {
  display: flex;
  gap: 10px;
  min-height: 0;
  flex: 1;
}

.ntk-template-wiki__sidebar {
  width: 300px;
  border-radius: 12px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ntk-template-wiki__sidebar-header {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.ntk-template-wiki__sidebar-title {
  display: block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #64748b;
}

.ntk-template-wiki__sidebar-search,
.ntk-template-wiki__search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 10px;
  height: 34px;
  color: #64748b;
  background: #ffffff;
}

.ntk-template-wiki__search-input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  color: #334155;
  font-size: 12px;
}

.ntk-template-wiki__tree {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 0;
}

.ntk-template-wiki__tree-item {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  cursor: pointer;
  color: #475569;
  text-align: left;
}

.ntk-template-wiki__tree-item:hover {
  background: #f8fafc;
}

.ntk-template-wiki__tree-item--active {
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
}

.ntk-template-wiki__tree-item--child {
  padding-left: 34px;
}

.ntk-template-wiki__tree-expand {
  transition: transform 0.2s ease;
}

.ntk-template-wiki__tree-expand--open {
  transform: rotate(90deg);
}

.ntk-template-wiki__tree-folder {
  color: #f59e0b;
}

.ntk-template-wiki__tree-label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
}

.ntk-template-wiki__tree-badge {
  padding: 1px 7px;
  border-radius: 9px;
  font-size: 10px;
  color: #475569;
  background: #f1f5f9;
}

.ntk-template-wiki__tree-badge--sm {
  font-size: 9px;
}

.ntk-template-wiki__tree-slide-enter-active,
.ntk-template-wiki__tree-slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.ntk-template-wiki__tree-slide-enter-from,
.ntk-template-wiki__tree-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.ntk-template-wiki__tree-slide-enter-to,
.ntk-template-wiki__tree-slide-leave-from {
  opacity: 1;
  max-height: 260px;
}

.ntk-template-wiki__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ntk-template-wiki__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-template-wiki__search {
  width: 280px;
}

.ntk-template-wiki__filters {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.ntk-template-wiki__filter {
  border: none;
  background: transparent;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
}

.ntk-template-wiki__filter--active {
  background: #1e293b;
  color: #ffffff;
}

.ntk-template-wiki__views {
  margin-left: auto;
  display: inline-flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.ntk-template-wiki__view {
  width: 34px;
  height: 34px;
  border: none;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
}

.ntk-template-wiki__view--active {
  background: #1e293b;
  color: #ffffff;
}
.ntk-template-wiki__surface {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
}

.ntk-template-wiki__surface-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.ntk-template-wiki__crumbs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ntk-template-wiki__crumb {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.ntk-template-wiki__crumb--current {
  color: #334155;
  font-weight: 600;
  cursor: default;
}

.ntk-template-wiki__crumb-separator {
  color: #cbd5e1;
  font-size: 12px;
}

.ntk-template-wiki__meta {
  margin-left: auto;
  color: #64748b;
  font-size: 12px;
}

.ntk-template-wiki__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px;
}

.ntk-template-wiki__table {
  width: 100%;
  border-collapse: collapse;
}

.ntk-template-wiki__table th {
  text-align: left;
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  padding: 8px 10px;
}

.ntk-template-wiki__table td {
  padding: 10px;
  font-size: 13px;
  color: #334155;
  border-top: 1px solid #f1f5f9;
}

.ntk-template-wiki__column-check {
  width: 40px;
}

.ntk-template-wiki__file {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ntk-template-wiki__file-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  color: #4f46e5;
}

.ntk-template-wiki__file-icon--large {
  width: 42px;
  height: 42px;
  border-radius: 10px;
}

.ntk-template-wiki__file-name {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.ntk-template-wiki__file-size {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.ntk-template-wiki__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ntk-template-wiki__tag {
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10px;
  color: #4f46e5;
  background: #eef2ff;
}

.ntk-template-wiki__status {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  color: #1e293b;
  background: #f1f5f9;
}

.ntk-template-wiki__actions {
  display: inline-flex;
  gap: 4px;
}

.ntk-template-wiki__action {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.ntk-template-wiki__action:hover {
  background: #e2e8f0;
  color: #334155;
}

.ntk-template-wiki__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.ntk-template-wiki__card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ntk-template-wiki__card-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.ntk-template-wiki__card-meta {
  font-size: 11px;
  color: #64748b;
}

.ntk-template-wiki__summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-top: 1px solid #f1f5f9;
}

.ntk-template-wiki__summary-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
}

.ntk-template-wiki__summary-action {
  margin-left: auto;
}

@media (max-width: 1024px) {
  .ntk-template-wiki__main {
    flex-direction: column;
  }

  .ntk-template-wiki__sidebar {
    width: 100%;
    max-height: 280px;
  }
}

@media (max-width: 768px) {
  .ntk-template-wiki__toolbar {
    flex-wrap: wrap;
  }

  .ntk-template-wiki__search {
    width: 100%;
  }
}
</style>