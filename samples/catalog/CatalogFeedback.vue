<template>
  <section
    id="feedback"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="10"
      :title="t.feedbackTitle"
      :desc="t.feedbackDesc"
    />
    <div class="cg-feedstack">
      <!-- success toast -->
      <DsToast
        v-if="showSuccess"
        class="cg-toast cg-toast--success"
        intent="success"
        variant="outline"
        :style="toastStyle('success')"
        :title="t.fbSavedT"
        :message="t.fbSavedB"
        dismiss-label="Fechar"
        @dismiss="showSuccess = false"
      />

      <!-- error toast -->
      <DsToast
        v-if="showError"
        class="cg-toast cg-toast--error"
        intent="danger"
        variant="outline"
        :style="toastStyle('danger')"
        :title="t.fbErrT"
        :message="t.fbErrB"
        dismiss-label="Fechar"
        @dismiss="showError = false"
      />

      <!-- warning banner (with action) -->
      <div
        v-if="showWarning"
        class="cg-banner cg-banner--warning"
        role="alert"
      >
        <span class="cg-banner__icon">⚠</span>
        <div class="cg-banner__content">
          <span class="cg-banner__title">{{ t.fbWarnT }}</span>
          <span class="cg-banner__message">{{ t.fbWarnB }}</span>
        </div>
        <button
          type="button"
          class="cg-renew"
          @click="showWarning = false"
        >
          {{ t.fbRenew }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DsToast } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const showSuccess = ref(true)
const showError = ref(true)
const showWarning = ref(true)

/**
 * Reference toasts are surface-bg with a gray box border and a single 3px
 * colored LEFT accent. Inline style wins over DsToast's variant recipe so the
 * border resolves to the neutral box + tone accent exactly.
 */
function toastStyle(tone: 'success' | 'danger'): Record<string, string> {
  return {
    background: 'var(--ds-color-surface)',
    border: 'var(--ds-border-width) solid var(--ds-color-border)',
    borderLeft: `3px solid var(--ds-color-${tone})`,
    boxShadow: 'var(--ds-shadow-sm)',
  }
}
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 92px;
}

.cg-feedstack {
  display: flex;
  flex-direction: column;
  gap: 11px;
  max-width: 520px;
}

/* Re-skin DsToast / DsBanner to the exact reference notification look. */
.cg-toast {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 15px;
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  border: var(--ds-border-width) solid var(--ds-color-border);
  box-shadow: var(--ds-shadow-sm);
  font-family: var(--ds-font-sans);
}

.cg-toast--success {
  border-left: 3px solid var(--ds-color-success);
}

.cg-toast--error {
  border-left: 3px solid var(--ds-color-danger);
}

.cg-toast :deep(.ntk-toast__content) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.cg-toast :deep(.ntk-toast__title) {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ds-color-text);
}

.cg-toast :deep(.ntk-toast__message) {
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
}

.cg-toast :deep(.ntk-toast__dismiss) {
  color: var(--ds-color-text-muted);
  font-size: 15px;
}

/* Circular leading status icon injected before the content. */
.cg-toast::before {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex: 0 0 auto;
}

.cg-toast--success::before {
  content: '✓';
  background: var(--ds-color-success);
  color: var(--ds-color-success-contrast);
}

.cg-toast--error::before {
  content: '!';
  background: var(--ds-color-danger);
  color: var(--ds-color-danger-contrast);
}

/* DsToast already renders an empty icon span we hid via #icon; keep its built-in
   icon node out of the flow for the error toast (no #icon override there). */
.cg-toast :deep(.ntk-toast__icon) {
  display: none;
}

/* Warning banner */
.cg-banner {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 15px;
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-warning-soft);
  border: var(--ds-border-width) solid transparent;
  font-family: var(--ds-font-sans);
}

.cg-banner__icon {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--ds-color-warning);
  color: var(--ds-color-warning-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex: 0 0 auto;
}

.cg-banner__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.cg-banner__title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ds-color-warning-soft-fg);
}

.cg-banner__message {
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
}

.cg-renew {
  height: 30px;
  padding: 0 12px;
  border-radius: var(--ds-radius-sm);
  border: none;
  background: var(--ds-color-warning);
  color: var(--ds-color-warning-contrast);
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  cursor: pointer;
  flex: 0 0 auto;
}
</style>