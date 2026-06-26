<template>
  <section
    id="modais"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="08"
      :title="t.modaisTitle"
      :desc="t.modaisDesc"
    />
    <div class="cg-modalbtns">
      <button
        v-for="size in modalSizes"
        :key="size.key"
        type="button"
        class="cg-modalbtn"
        :class="{ 'cg-modalbtn--primary': size.key === 'full' }"
        @click="open(size.key)"
      >
        {{ t.modalOpen }} · {{ size.label }}
      </button>
    </div>

    <DsDialog
      id="cg-modal"
      v-model="isOpen"
      class="cg-dialog"
      :class="{ 'cg-dialog--full': activeSize === 'full' }"
      :style="dialogStyle"
      :title="t.modalTitle"
      close-label="Fechar"
    >
      {{ t.modalBody }}
      <template #actions>
        <div class="cg-dialog__footer" />
      </template>
    </DsDialog>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import { DsDialog } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

type ModalSizeKey = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const modalSizes: readonly { key: ModalSizeKey; label: string }[] = [
  { key: 'sm', label: 'SM' },
  { key: 'md', label: 'MD' },
  { key: 'lg', label: 'LG' },
  { key: 'xl', label: 'XL' },
  { key: 'full', label: 'Full' },
]

const sizeWidth: Record<ModalSizeKey, string> = {
  sm: '400px',
  md: '560px',
  lg: '760px',
  xl: '960px',
  full: '96vw',
}

const isOpen = ref(false)
const activeSize = ref<ModalSizeKey>('md')

function open(size: ModalSizeKey): void {
  activeSize.value = size
  isOpen.value = true
}

const dialogStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    width: sizeWidth[activeSize.value],
    maxWidth: '96vw',
  }
  // Only the full-size modal gets an explicit height; the others must stay
  // content-sized. Setting `height:auto` on a centered native <dialog> (UA
  // default is `height:fit-content`) makes it stretch to the inset box, so we
  // leave height unset for sm/md/lg/xl.
  if (activeSize.value === 'full') {
    style.height = '92vh'
  }
  return style
})
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 92px;
}

.cg-modalbtns {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}

.cg-modalbtn {
  height: var(--ds-control-height);
  padding: 0 16px;
  border-radius: var(--ds-radius-md);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-family: var(--ds-font-sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}

.cg-modalbtn:hover {
  background: var(--ds-color-surface-muted);
}

.cg-modalbtn--primary {
  border-color: var(--ds-color-primary);
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
}

.cg-modalbtn--primary:hover {
  background: var(--ds-color-primary-hover);
}

/* Re-skin DsDialog to the exact reference modal (primary-soft header bar,
   scrollable body, slim reserved footer). */
.cg-dialog {
  max-width: 96vw;
  max-height: 86vh;
  padding: 0;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow);
  overflow: hidden;
}

.cg-dialog :deep(.ntk-dialog__surface) {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  min-height: 0;
}

.cg-dialog :deep(.ntk-dialog__header) {
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-primary-soft);
  flex: 0 0 auto;
}

.cg-dialog :deep(.ntk-dialog__title) {
  margin: 0;
  flex: 1;
  font-family: var(--ds-font-sans);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ds-color-primary);
}

.cg-dialog :deep(.ntk-dialog__close) {
  width: 30px;
  height: 30px;
  color: var(--ds-color-primary);
  border-radius: var(--ds-radius-sm);
}

.cg-dialog :deep(.ntk-dialog__close:hover) {
  background: rgba(0, 0, 0, 0.06);
}

.cg-dialog :deep(.ntk-dialog__body) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ds-color-text);
}

/* Full-size modal: the body fills the tall surface and scrolls. */
.cg-dialog--full :deep(.ntk-dialog__body) {
  flex: 1 1 auto;
}

.cg-dialog :deep(.ntk-dialog__actions) {
  padding: 0;
}

.cg-dialog__footer {
  width: 100%;
  height: 14px;
  border-top: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface-muted);
}
</style>