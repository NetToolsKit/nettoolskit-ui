<template>
  <main class="sample-shell">
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
      />
    </section>

    <section class="sample-grid" aria-label="Library component examples">
      <DsCard title="Design System" subtitle="DTCG tokens and Ds* wrappers">
        <div class="sample-stack">
          <DsButton label="DsButton" intent="primary" />
          <DsInput
            name="sample-input"
            label="DsInput"
            placeholder="Tokenized field"
          />
        </div>
      </DsCard>

      <DsCard title="Primitives" subtitle="Composable Ds* building blocks">
        <div class="sample-stack">
          <DsInput name="reusable-input" label="DsInput" placeholder="Reusable field" />
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
  </main>
</template>

<script setup lang="ts">
import {
  DsButton,
  DsCard,
  DsChip,
  DsInput,
  DsMetricGrid,
} from '../index'
import CrudRecipe from './recipes/CrudRecipe.vue'
import DashboardRecipe from './recipes/DashboardRecipe.vue'
import DialogRecipe from './recipes/DialogRecipe.vue'
import FormRecipe from './recipes/FormRecipe.vue'
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