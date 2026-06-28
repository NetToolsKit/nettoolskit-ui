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
      <!-- success toast — governed accent variant (neutral surface + left rail) -->
      <DsToast
        v-if="showSuccess"
        class="cg-feed"
        intent="success"
        variant="accent"
        icon="✓"
        :title="t.fbSavedT"
        :message="t.fbSavedB"
        :dismiss-label="t.close"
        @dismiss="showSuccess = false"
      />

      <!-- error toast — governed accent variant -->
      <DsToast
        v-if="showError"
        class="cg-feed"
        intent="danger"
        variant="accent"
        icon="!"
        :title="t.fbErrT"
        :message="t.fbErrB"
        :dismiss-label="t.close"
        @dismiss="showError = false"
      />

      <!-- warning banner (with action) — governed accent variant -->
      <DsBanner
        v-if="showWarning"
        class="cg-feed"
        intent="warning"
        variant="accent"
        icon="⚠"
        :title="t.fbWarnT"
        :message="t.fbWarnB"
        dismissible
        :dismiss-label="t.close"
        @dismiss="showWarning = false"
      >
        <template #actions>
          <DsButton
            variant="solid"
            intent="warning"
            size="sm"
            :label="t.fbRenew"
            @click="showWarning = false"
          />
        </template>
      </DsBanner>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DsBanner, DsButton, DsToast } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const showSuccess = ref(true)
const showError = ref(true)
const showWarning = ref(true)
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

/* Stretch the governed toast/banner to the feedback column width and align the
   font to the catalog sans stack; the accent surface + rail come from the
   governed variant. */
.cg-feed {
  inline-size: 100%;
  font-family: var(--ds-font-sans);
}
</style>