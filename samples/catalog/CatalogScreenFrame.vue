<template>
  <section
    :id="anchor"
    class="cs-section"
  >
    <!-- Header: badge + title + "Tela cheia" (reference markup) -->
    <div class="cs-head">
      <div class="cs-head__row">
        <span class="cs-badge">{{ badge }}</span>
        <h2 class="cs-title">
          {{ title }}
        </h2>
        <button
          type="button"
          class="cs-fs"
          @click="open"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          {{ t.fullscreen }}
        </button>
      </div>
      <p class="cs-desc">
        {{ desc }}
      </p>
    </div>

    <!-- Screen body; teleported into a fixed overlay when fullscreen. -->
    <Teleport
      to="body"
      :disabled="!isFull"
    >
      <div
        class="cs-stage"
        :class="{ 'cs-stage--full': isFull }"
      >
        <button
          v-if="isFull"
          type="button"
          class="cs-exit"
          @click="close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M9 9L4 4M4 9V4h5M15 9l5-5M20 9V4h-5M9 15l-5 5M4 15v5h5M15 15l5 5M20 15v5h-5" />
          </svg>
          {{ t.fullscreenExit }}
        </button>
        <slot :is-full="isFull" />
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { CatalogStrings } from './catalogI18n'

defineProps<{ anchor: string; badge: string; title: string; desc: string; t: CatalogStrings }>()

const isFull = ref(false)

function open(): void {
  isFull.value = true
}
function close(): void {
  isFull.value = false
}

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') close()
}

watch(isFull, (full) => {
  if (typeof document === 'undefined') return
  if (full) {
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.cs-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 92px;
}

.cs-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
  padding-bottom: 14px;
}

.cs-head__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.cs-badge {
  font-family: var(--ds-font-mono);
  font-size: 11px;
  color: var(--ds-color-primary-contrast);
  background: var(--ds-color-primary);
  font-weight: 600;
  padding: 3px 9px;
  border-radius: var(--ds-radius-pill);
  letter-spacing: 0.04em;
}

.cs-title {
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ds-color-text);
}

.cs-fs {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 13px;
  border-radius: var(--ds-radius-md);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-family: var(--ds-font-sans);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.cs-fs:hover {
  background: var(--ds-color-surface-muted);
}

.cs-desc {
  margin: 0;
  font-size: 14.5px;
  color: var(--ds-color-text-muted);
  max-width: 70ch;
  line-height: 1.55;
}

.cs-stage {
  position: relative;
}

/* Fullscreen overlay: fixed, scrollable, brand-tinted backdrop. */
.cs-stage--full {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  overflow: auto;
  background: var(--ds-color-bg);
  padding: 24px;
  font-family: var(--ds-font-sans);
  color: var(--ds-color-text);
}

.cs-exit {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 14px;
  border-radius: var(--ds-radius-md);
  border: none;
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
  font-family: var(--ds-font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--ds-shadow);
}
</style>