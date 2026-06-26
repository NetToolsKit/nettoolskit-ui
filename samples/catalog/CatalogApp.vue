<template>
  <div class="cat-app">
    <CatalogTopBar :t="t" />

    <div class="cat-body">
      <aside class="cat-body__toc">
        <CatalogToc :t="t" />
      </aside>

      <main class="cat-body__main">
        <CatalogHero :t="t" />

        <!-- Screen example sections (still titled stubs in this phase). -->
        <CatalogSection
          v-for="meta in screenSections"
          :key="meta.anchor"
          :meta="meta"
          :t="t"
        />

        <!-- Fundamentos (01–03) -->
        <CatalogFoundations
          :t="t"
          :locale="state.locale"
        />

        <!-- Componentes (04–11) -->
        <CatalogButtons
          :t="t"
          :locale="state.locale"
        />
        <CatalogInputs
          :t="t"
          :locale="state.locale"
        />
        <CatalogCards
          :t="t"
          :locale="state.locale"
        />
        <CatalogBadges
          :t="t"
          :locale="state.locale"
        />
        <CatalogModals
          :t="t"
          :locale="state.locale"
        />
        <CatalogTable
          :t="t"
          :locale="state.locale"
        />
        <CatalogInteractive
          :t="t"
          :locale="state.locale"
        />
        <CatalogFeedback
          :t="t"
          :locale="state.locale"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import CatalogBadges from './CatalogBadges.vue'
import CatalogButtons from './CatalogButtons.vue'
import CatalogCards from './CatalogCards.vue'
import CatalogFeedback from './CatalogFeedback.vue'
import CatalogFoundations from './CatalogFoundations.vue'
import CatalogHero from './CatalogHero.vue'
import CatalogInputs from './CatalogInputs.vue'
import CatalogInteractive from './CatalogInteractive.vue'
import CatalogModals from './CatalogModals.vue'
import CatalogSection from './CatalogSection.vue'
import CatalogTable from './CatalogTable.vue'
import CatalogToc from './CatalogToc.vue'
import CatalogTopBar from './CatalogTopBar.vue'
import { getCatalogStrings } from './catalogI18n'
import { catalogSections, initCatalogShell, useCatalogShell } from './useCatalogShell'

const { state } = useCatalogShell()
const screenSections = catalogSections.filter((s) => s.group === 'screens')
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

/* Matches the reference shell grid exactly (208px rail · 38px gutter ·
   1280px max · 32px page padding) so the content column resolves to ~970px and
   the swatch/tone/card grids land on the same column counts as the reference. */
.cat-body {
  display: grid;
  grid-template-columns: 208px minmax(0, 1fr);
  gap: 38px;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--ds-page-padding, 32px) var(--ds-page-padding, 32px) 80px;
  align-items: start;
}

.cat-body__toc {
  min-width: 0;
}

.cat-body__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ds-section-gap, 30px);
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