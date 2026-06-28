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
      :style="dialogStyle"
      :title="t.modalTitle"
      :close-label="t.close"
    >
      {{ t.modalBody }}
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

/* The governed DsDialog now provides the reference modal natively (header bar,
   scrollable body, slim reserved footer). Only the per-size sizing is set here
   via inline :style; the catalog aligns the dialog font to the sans stack. */
.cg-dialog {
  max-width: 96vw;
  max-height: 86vh;
}
</style>