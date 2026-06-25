<template>
  <!-- Host root: a top-level DsTabs switcher between the component catalog and
       the three fully-mocked demo apps. The catalog stays the default tab so
       the existing e2e (Clientes heading + Editar perfil dialog) still finds
       its anchors on load. A single DsToastHost is mounted here for the whole
       host (the toast queue is a module singleton). -->
  <div class="sample-host">
    <div class="sample-host__switcher">
      <DsTabs
        v-model="view"
        :tabs="viewTabs"
        variant="pill"
        aria-label="Demonstrações"
      />
    </div>

    <IndustrialStudioApp v-if="view === 'industrial'" class="sample-host__app" />
    <UserManagementApp v-else-if="view === 'users'" class="sample-host__app" />
    <EcommerceApp v-else-if="view === 'ecommerce'" class="sample-host__app" />

    <!-- Catalog wrapper is a div: the page-level recipes (DsCrudPage/DsFormPage)
         provide their own <main> landmarks, so nesting another main would be
         invalid. -->
    <div v-show="view === 'catalog'" class="sample-shell">
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
          dados; o sistema renderiza layout, validação e estados. Cada receita
          traz um trecho de composição copiável.
        </p>
      </header>

      <RecipeShowcase
        title="Dashboard"
        description="Visão geral com indicadores em DsMetricGrid."
        :code="dashboardSnippet"
      >
        <DashboardRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="CRUD a partir de schema"
        description="Lista, filtros, formulário e estados a partir de defineResource."
        :code="crudSnippet"
      >
        <CrudRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="Formulário de página"
        description="Formulário de duas colunas gerado por defineForm."
        :code="formSnippet"
      >
        <FormRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="Diálogo de ação"
        description="Formulário em modal acessível com DsDialog."
        :code="dialogSnippet"
      >
        <DialogRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="Tabela com ordenação e paginação"
        description="DsTable autônomo com sort/paginação server-style sobre uma fixture e variação de densidade."
        :code="tableSnippet"
      >
        <TableRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="Estados: vazio, carregando e erro"
        description="DsEmptyState com ações e DsStateBlock em loading e erro."
        :code="emptyStateSnippet"
      >
        <EmptyStateRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="Galeria de primitivos"
        description="DsBadge, DsChip, DsAvatar, DsTabs, DsTooltip, DsSkeleton, DsBreadcrumbs, DsSteps, DsBanner e DsToast."
        :code="gallerySnippet"
      >
        <ComponentsGalleryRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="Workspace industrial"
        description="Estudio de engenharia neutro: DsQuickAccessToolbar + DsRibbon com ícones inline e navegação por teclado."
        :code="workspaceSnippet"
      >
        <WorkspaceRecipe />
      </RecipeShowcase>

      <RecipeShowcase
        title="Workspace docado"
        description="DsDockLayout com DsTreeExplorer (ARIA tree), DsWorkspaceCanvas, DsDockPanel e DsStatusBar; splitters redimensionáveis por teclado."
        :code="dockWorkspaceSnippet"
      >
        <DockWorkspaceRecipe />
      </RecipeShowcase>
    </section>

    </div>

    <!-- Single shared toast host for the whole host (catalog + demo apps); the
         gallery's toast button and the demo apps all push onto this queue. -->
    <DsToastHost />
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
  DsTabs,
  DsToastHost,
  ntkComponentDensities,
  setColorScheme,
  useColorScheme,
  type ColorSchemeMode,
  type NtkComponentDensity,
  type NtkTabItem,
} from '../index'
import { useThemeSwitcher, type ThemeId } from '../src/composables/useThemeSwitcher'
import EcommerceApp from './apps/EcommerceApp.vue'
import IndustrialStudioApp from './apps/IndustrialStudioApp.vue'
import UserManagementApp from './apps/UserManagementApp.vue'
import ComponentsGalleryRecipe from './recipes/ComponentsGalleryRecipe.vue'
import CrudRecipe from './recipes/CrudRecipe.vue'
import DashboardRecipe from './recipes/DashboardRecipe.vue'
import DialogRecipe from './recipes/DialogRecipe.vue'
import DockWorkspaceRecipe from './recipes/DockWorkspaceRecipe.vue'
import EmptyStateRecipe from './recipes/EmptyStateRecipe.vue'
import FormRecipe from './recipes/FormRecipe.vue'
import RecipeShowcase from './recipes/RecipeShowcase.vue'
import TableRecipe from './recipes/TableRecipe.vue'
import WorkspaceRecipe from './recipes/WorkspaceRecipe.vue'

// Top-level view switcher: catalog (default) + the three fully-mocked demo
// apps. Default MUST be 'catalog' so the existing e2e anchors render on load.
const view = ref<string>('catalog')
const viewTabs: NtkTabItem[] = [
  { id: 'catalog', label: 'Catálogo' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'users', label: 'Usuários' },
  { id: 'ecommerce', label: 'E-commerce' },
]

// Concise composition snippets shown next to each live recipe. These mirror the
// recipe source so a developer can copy the shape and adjust domain fields.
const dashboardSnippet = `<DsMetricGrid
  :metrics="[
    { id: 'revenue', label: 'Receita', value: 'R$ 128k', delta: '+12%', deltaDirection: 'up' },
    { id: 'active', label: 'Clientes ativos', value: '1.204', delta: '+3%', deltaDirection: 'up' },
  ]"
  :columns="3"
  aria-label="Indicadores"
/>`

const crudSnippet = `import { DsCrudPage, defineResource } from 'nettoolskit'

const resource = defineResource({
  title: 'Clientes',
  rowKey: 'id',
  columns: [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'E-mail' },
  ],
  form: [
    { field: 'name', type: 'text', label: 'Nome', required: true },
    { field: 'email', type: 'email', label: 'E-mail', required: true },
  ],
  async fetch() { /* ... */ return rows },
  async create(row) { /* ... */ },
  async update(row) { /* ... */ },
  async remove(row) { /* ... */ },
})
// <DsCrudPage :resource="resource" />`

const formSnippet = `import { DsFormPage, defineForm } from 'nettoolskit'

const schema = defineForm({
  columns: 2,
  fields: [
    { field: 'firstName', type: 'text', label: 'Nome', required: true },
    { field: 'email', type: 'email', label: 'E-mail', required: true },
    { field: 'newsletter', type: 'switch', label: 'Receber novidades' },
  ],
})
// <DsFormPage :schema="schema" v-model="values" @submit="onSubmit" />`

const dialogSnippet = `<DsButton label="Editar perfil" intent="primary" @click="open = true" />
<DsDialog v-model="open" title="Editar perfil">
  <DsForm :schema="schema" v-model="values" submit-label="Salvar" @submit="onSubmit" />
</DsDialog>`

const tableSnippet = `<DsTable
  :columns="columns"
  :rows="pageRows"
  :sort="sort"
  :pagination="{ page, pageSize: 4, total: rows.length }"
  :density="density"
  variant="striped"
  @update:sort="onSort"
  @update:page="onPage"
/>`

const emptyStateSnippet = `<DsEmptyState title="Nenhum cliente encontrado" variant="bordered">
  <template #actions>
    <DsButton label="Novo cliente" intent="primary" />
  </template>
</DsEmptyState>

<DsStateBlock state="loading" title="Carregando clientes" />
<DsStateBlock state="error" title="Falha ao carregar" />`

const gallerySnippet = `import { useToast } from 'nettoolskit'

const { pushToast } = useToast()
// <DsBadge label="Novo" intent="primary" />
// <DsChip label="Removível" removable />
// <DsAvatar name="Ana Souza" status="online" />
// <DsTabs v-model="tab" :tabs="tabs" />
// <DsTooltip text="Dica"><DsButton label="?" /></DsTooltip>
// <DsBanner intent="info" title="Aviso" message="..." />
// <DsButton label="Toast" @click="pushToast({ message: 'Salvo!', intent: 'success' })" />
// Monte <DsToastHost /> uma vez na raiz.`

const workspaceSnippet = `<DsHeader title="Engineering Studio">
  <template #actions>
    <DsQuickAccessToolbar :items="quickActions" @command="onCommand" />
  </template>
</DsHeader>

<DsRibbon v-model:active-tab="activeTab" :tabs="ribbonTabs" @command="onCommand" />

// quickActions: { id, label, icon, disabled?, selected?, intent? }[]
// ribbonTabs:  { id, label, groups: { id, label, commands: [...] }[] }[]
// icon names come from the built-in command-icon registry (no icon font).`

const dockWorkspaceSnippet = `<DsDockLayout :left-size="220" :bottom-size="120">
  <template #left>
    <DsTreeExplorer
      :nodes="projectNodes"
      aria-label="Project explorer"
      @update:selected="onSelect"
      @toggle="onToggle"
    />
  </template>

  <DsWorkspaceCanvas surface="grid" aria-label="Design surface">
    <template #header>{{ selectedLabel }}</template>
    <!-- canvas content -->
  </DsWorkspaceCanvas>

  <template #bottom>
    <DsDockPanel title="Output" collapsible :collapsed="collapsed" @toggle-collapse="..." />
  </template>
</DsDockLayout>

<DsStatusBar :segments="statusSegments" />

// projectNodes: { id, label, icon?, children?, expanded?, selected?, disabled? }[]
// statusSegments: { id, icon?, label?, value?, intent?, tooltip? }[]`

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
.sample-host {
  min-height: 100vh;
  background: var(--ntk-bg-primary);
  color: var(--ntk-text-primary);
}

.sample-host__switcher {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: var(--ntk-spacing-md) clamp(24px, 4vw, 56px);
  border-block-end: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
}

.sample-host__app {
  padding: clamp(24px, 4vw, 56px);
}

.sample-shell {
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