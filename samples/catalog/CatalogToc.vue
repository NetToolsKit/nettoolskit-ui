<template>
  <nav
    class="cat-toc"
    :aria-label="t.idxTitle"
  >
    <div class="cat-toc__head">
      <span class="cat-toc__title">{{ t.idxTitle }}</span>
      <div class="cat-toc__levels">
        <button
          type="button"
          class="cat-toc__lvlbtn"
          :title="t.tocCollapseAll"
          :aria-label="t.tocCollapseAll"
          @click="collapseAll"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M6 11l6-6 6 6" /><path d="M6 18l6-6 6 6" /></svg>
        </button>
        <button
          type="button"
          class="cat-toc__lvlbtn"
          :title="t.tocCollapseOne"
          :aria-label="t.tocCollapseOne"
          @click="collapseAll"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M6 15l6-6 6 6" /></svg>
        </button>
        <button
          type="button"
          class="cat-toc__lvlbtn"
          :title="t.tocExpandOne"
          :aria-label="t.tocExpandOne"
          @click="expandAll"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <button
          type="button"
          class="cat-toc__lvlbtn"
          :title="t.tocExpandAll"
          :aria-label="t.tocExpandAll"
          @click="expandAll"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M6 13l6 6 6-6" /><path d="M6 6l6 6 6-6" /></svg>
        </button>
      </div>
    </div>

    <div
      v-for="group in toc"
      :key="group.id"
      class="cat-toc__group"
    >
      <button
        type="button"
        class="cat-toc__grouphdr"
        :aria-expanded="open[group.id]"
        @click="toggle(group.id)"
      >
        <span
          class="cat-toc__chevron"
          :class="{ 'is-open': open[group.id] }"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M9 6l6 6-6 6" /></svg>
        </span>
        <span class="cat-toc__grouplabel">{{ t[group.labelKey] }}</span>
      </button>

      <ul
        v-show="open[group.id]"
        class="cat-toc__items"
      >
        <li
          v-for="item in group.items"
          :key="item.id"
        >
          <a
            :href="`#${item.anchor}`"
            class="cat-toc__link"
            :class="{ 'is-active': active === item.anchor }"
            @click.prevent="goTo(item.anchor)"
          >
            <span
              v-if="group.id === 'screens'"
              class="cat-toc__bullet"
              aria-hidden="true"
            />
            {{ t[item.labelKey] }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { CatalogStrings } from './catalogI18n'
import { catalogToc } from './useCatalogShell'

defineProps<{ t: CatalogStrings }>()

const toc = catalogToc

const open = reactive<Record<string, boolean>>(
  Object.fromEntries(toc.map((g) => [g.id, true]))
)

const active = ref<string>('topo')

function toggle(id: string): void {
  open[id] = !open[id]
}

function expandAll(): void {
  for (const g of toc) open[g.id] = true
}

function collapseAll(): void {
  for (const g of toc) open[g.id] = false
}

function goTo(anchor: string): void {
  const el = document.getElementById(anchor)
  if (!el) return
  active.value = anchor
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Scroll-spy: mark the section whose top is nearest above the fold as active.
let ticking = false
function onScroll(): void {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const anchors = toc.flatMap((g) => g.items.map((i) => i.anchor))
    let current = anchors[0]
    for (const a of anchors) {
      const el = document.getElementById(a)
      if (el && el.getBoundingClientRect().top <= 120) {
        current = a
      }
    }
    active.value = current
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* FIXED side menu: pinned to the viewport so the index never scrolls away with
   the content. Sits exactly over the 208px grid column the content reserves
   (the left edge tracks the centered 1280px shell + page padding). Full height
   below the sticky top bar, with its own scroll for long indexes. */
.cat-toc {
  position: fixed;
  top: 92px;
  bottom: 0;
  left: max(var(--ds-page-padding, 32px), calc((100vw - 1280px) / 2 + var(--ds-page-padding, 32px)));
  width: 208px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13.5px;
  overflow-y: auto;
  padding-bottom: 24px;
}

.cat-toc__head {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 4px 8px 6px;
  margin-bottom: 2px;
  border-bottom: 1px solid var(--ntk-border);
}

.cat-toc__title {
  flex: 1;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
}

.cat-toc__levels {
  display: inline-flex;
  gap: 1px;
}

.cat-toc__lvlbtn {
  inline-size: 26px;
  block-size: 24px;
  border: none;
  background: transparent;
  color: var(--ntk-text-muted);
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cat-toc__lvlbtn:hover {
  background: var(--ntk-row-hover-bg);
  color: var(--ntk-text-heading);
}

.cat-toc__group {
  display: flex;
  flex-direction: column;
}

.cat-toc__grouphdr {
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px 6px 6px;
  width: 100%;
  text-align: left;
}

.cat-toc__chevron {
  display: inline-flex;
  color: var(--ntk-text-muted);
  transition: transform 0.15s;
}

.cat-toc__chevron.is-open {
  transform: rotate(90deg);
}

.cat-toc__grouplabel {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
}

.cat-toc__items {
  list-style: none;
  margin: 0;
  padding: 0 0 4px;
  margin-left: 12px;
  border-left: 1px solid var(--ntk-border);
}

.cat-toc__link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  margin-left: 2px;
  border-radius: var(--ntk-radius-md);
  color: var(--ntk-text-muted);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.cat-toc__link:hover {
  background: var(--ntk-row-hover-bg);
  color: var(--ntk-text-heading);
}

.cat-toc__link.is-active {
  background: var(--ntk-nav-active-bg);
  color: var(--ntk-primary);
  font-weight: 600;
}

.cat-toc__bullet {
  inline-size: 6px;
  block-size: 6px;
  border-radius: 999px;
  background: var(--ntk-primary);
  flex: 0 0 auto;
}
</style>