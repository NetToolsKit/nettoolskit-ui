<template>
  <!-- Catalog wrapper is a div: the page-level recipes (DsCrudPage/DsFormPage)
       provide their own <main> landmarks, so nesting another main would be
       invalid. -->
  <div class="sample-shell">
    <section class="sample-hero">
      <div>
        <p class="sample-kicker">NetToolsKit UI</p>
        <h1>Vue 3 + Quasar library surface</h1>
        <p>
          Reusable components, composables, tokens and design-system contracts
          without product runtime code.
        </p>
      </div>

      <DsButton
        label="Primary action"
        variant="solid"
        intent="primary"
        :density="density"
      />
    </section>

    <section class="sample-controls" aria-label="Catalog appearance controls">
      <DsSelect
        id="catalog-scheme"
        class="sample-controls__field"
        label="Color scheme"
        :model-value="scheme"
        :options="schemeOptions"
        @update:model-value="onSchemeChange"
      />
      <DsSelect
        id="catalog-theme"
        class="sample-controls__field"
        label="Theme"
        :model-value="theme"
        :options="themeSelectOptions"
        @update:model-value="onThemeChange"
      />
      <DsSelect
        id="catalog-density"
        class="sample-controls__field"
        label="Density"
        :model-value="density"
        :options="densityOptions"
        @update:model-value="onDensityChange"
      />
    </section>

    <section class="sample-grid" aria-label="Library component examples">
      <DsCard title="Design System" subtitle="DTCG tokens and Ds* wrappers">
        <div class="sample-stack">
          <DsButton label="DsButton" intent="primary" :density="density" />
          <DsInput
            name="sample-input"
            label="DsInput"
            placeholder="Tokenized field"
            :density="density"
          />
        </div>
      </DsCard>

      <DsCard title="Primitives" subtitle="Composable Ds* building blocks">
        <div class="sample-stack">
          <DsInput name="reusable-input" label="DsInput" placeholder="Reusable field" :density="density" />
          <DsChip label="Stable API" intent="primary" />
        </div>
      </DsCard>

      <DsMetricGrid
        :metrics="[{ id: 'tokens', label: 'Tokens', value: '119', delta: 'synced', deltaDirection: 'up' }]"
        :columns="1"
        aria-label="Token metric"
      />
    </section>

    <section class="sample-recipes" aria-label="Front creation recipes">
      <header class="sample-recipes__intro">
        <p class="sample-kicker">Front creation system</p>
        <h2>Telas a partir de schema</h2>
        <p>
          As receitas abaixo usam apenas componentes da biblioteca. Descreva os
          dados; o sistema renderiza layout, validação e estados.
        </p>
      </header>

      <DashboardRecipe />
      <CrudRecipe />
      <FormRecipe />
      <DialogRecipe />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DsButton,
  DsCard,
  DsChip,
  DsInput,
  DsMetricGrid,
  DsSelect,
  ntkComponentDensities,
  setColorScheme,
  useColorScheme,
  type ColorSchemeMode,
  type NtkComponentDensity,
} from '../index'
import { useThemeSwitcher, type ThemeId } from '../src/composables/useThemeSwitcher'
import CrudRecipe from './recipes/CrudRecipe.vue'
import DashboardRecipe from './recipes/DashboardRecipe.vue'
import DialogRecipe from './recipes/DialogRecipe.vue'
import FormRecipe from './recipes/FormRecipe.vue'

// Color scheme (light/dark/system) — token-only swap via useColorScheme.
const { mode } = useColorScheme()
const scheme = computed<ColorSchemeMode>(() => mode.value)
const schemeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]
const onSchemeChange = (next: string): void => {
  setColorScheme(next as ColorSchemeMode)
}

// Named brand theme — applied through the shared theme switcher.
const { activeTheme, themeOptions, setTheme } = useThemeSwitcher()
const theme = computed<ThemeId>(() => activeTheme.value)
const themeSelectOptions = themeOptions.map((option) => ({
  label: option.label,
  value: option.id,
}))
const onThemeChange = (next: string): void => {
  setTheme(next as ThemeId)
}

// Density — bound to the demonstrated Ds* components so dark mode + density
// can be inspected together.
const density = ref<NtkComponentDensity>('comfortable')
const densityOptions = ntkComponentDensities.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}))
const onDensityChange = (next: string): void => {
  density.value = next as NtkComponentDensity
}
</script>

<style scoped>
.sample-shell {
  min-height: 100vh;
  padding: clamp(24px, 4vw, 56px);
  background: var(--ntk-bg-primary);
  color: var(--ntk-text-primary);
}

.sample-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: end;
  max-width: 1120px;
  margin: 0 auto 32px;
}

.sample-kicker {
  margin: 0 0 8px;
  color: var(--ntk-primary);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.sample-hero h1 {
  margin: 0 0 12px;
  max-width: 720px;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
}

.sample-hero p {
  max-width: 640px;
  margin: 0;
  color: var(--ntk-text-secondary);
}

.sample-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-md);
  max-width: 1120px;
  margin: 0 auto var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
}

.sample-controls__field {
  min-width: 180px;
}

.sample-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  max-width: 1120px;
  margin: 0 auto;
}

.sample-stack {
  display: grid;
  gap: 12px;
}

.sample-recipes {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1120px;
  margin: 48px auto 0;
}

.sample-recipes__intro h2 {
  margin: 0 0 8px;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.sample-recipes__intro p {
  max-width: 640px;
  margin: 0;
  color: var(--ntk-text-secondary);
}

@media (max-width: 900px) {
  .sample-hero,
  .sample-grid {
    grid-template-columns: 1fr;
  }
}
</style>