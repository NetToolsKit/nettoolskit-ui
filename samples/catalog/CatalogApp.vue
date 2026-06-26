<template>
  <div class="cat-app">
    <CatalogTopBar :t="t" />

    <div class="cat-body">
      <aside class="cat-body__toc">
        <CatalogToc :t="t" />
      </aside>

      <main class="cat-body__main">
        <CatalogHero :t="t" />
        <CatalogSection
          v-for="meta in sections"
          :key="meta.anchor"
          :meta="meta"
          :t="t"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import CatalogHero from './CatalogHero.vue'
import CatalogSection from './CatalogSection.vue'
import CatalogToc from './CatalogToc.vue'
import CatalogTopBar from './CatalogTopBar.vue'
import { getCatalogStrings } from './catalogI18n'
import { catalogSections, initCatalogShell, useCatalogShell } from './useCatalogShell'

const { state } = useCatalogShell()
const sections = catalogSections
const t = computed(() => getCatalogStrings(state.locale))

onMounted(() => {
  // The catalog OWNS the theme axes: force the reference light/purple/comfortable
  // palette, overriding any legacy bootstrap that set data-theme='revolut'.
  initCatalogShell()
})
</script>

<style scoped>
.cat-app {
  min-height: 100vh;
  background: var(--ntk-shell-bg);
  color: var(--ntk-text-body);
  font-family: var(--ntk-font-sans);
}

.cat-body {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px clamp(20px, 4vw, 48px) 80px;
  align-items: start;
}

.cat-body__toc {
  min-width: 0;
}

.cat-body__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

@media (max-width: 980px) {
  .cat-body {
    grid-template-columns: 1fr;
  }
  .cat-body__toc {
    display: none;
  }
}
</style>