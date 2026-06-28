<template>
  <!-- App shell host: top header (DsHeader) + left sidebar menu (DsSidebar)
       navigating between the component catalog (default) and the three mocked
       demo apps. This is the standard pattern: menu superior + menu lateral.
       The catalog stays default so the e2e anchors (Clientes / Editar perfil)
       render on load. A single DsToastHost serves the whole host. -->
  <DsAppShell class="demo" :class="{ 'demo--collapsed': collapsed }">
    <template #header>
      <DsHeader class="demo__header">
        <template #brand>
          <div class="demo__brand">
            <button
              type="button"
              class="demo__hamburger"
              :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'"
              :aria-pressed="collapsed"
              @click="toggleSidebar"
            >
              <DsCommandIcon name="menu" />
            </button>
            <DsLogo mark="N" text="NetToolsKit UI" size="sm" />
          </div>
        </template>
        <span class="demo__view-name">{{ activeNav.label }}</span>
        <template #actions>
          <div class="demo__user">
            <DsAvatar name="Ana Souza" size="sm" status="online" />
            <span class="demo__user-name">Ana Souza</span>
          </div>
        </template>
      </DsHeader>
    </template>

    <template #sidebar>
      <DsSidebar
        class="demo__sidebar"
        aria-label="Navegação principal"
        :collapsed="collapsed"
      >
        <nav class="demo-nav" aria-label="Aplicações">
          <p class="demo-nav__section" aria-hidden="true">Aplicações</p>
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            class="demo-nav__item"
            :class="{ 'demo-nav__item--active': view === item.id }"
            :aria-current="view === item.id ? 'page' : undefined"
            :title="collapsed ? item.label : undefined"
            @click="view = item.id"
          >
            <DsCommandIcon class="demo-nav__icon" :name="item.icon" />
            <span class="demo-nav__label">{{ item.label }}</span>
          </button>
        </nav>
      </DsSidebar>
    </template>

    <div class="demo-main">
      <IndustrialStudioApp v-if="view === 'industrial'" />
      <UserManagementApp v-else-if="view === 'users'" />
      <EcommerceApp v-else-if="view === 'ecommerce'" />

      <!-- Catalog wrapper is a div: page-level recipes (DsCrudPage/DsFormPage)
           provide their own <main> landmarks. -->
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
            :metrics="[{ id: 'tokens', label: 'Tokens', value: '122', delta: 'synced', deltaDirection: 'up' }]"
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
    </div>

    <DsToastHost />
  </DsAppShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DsAppShell,
  DsAvatar,
  DsButton,
  DsCard,
  DsChip,
  DsCommandIcon,
  DsHeader,
  DsInput,
  DsLogo,
  DsMetricGrid,
  DsSelect,
  DsSidebar,
  DsToastHost,
  ntkComponentDensities,
  setColorScheme,
  useColorScheme,
  type ColorSchemeMode,
  type NtkComponentDensity,
} from '../src/index'
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

// Sidebar navigation: catalog (default) + the three fully-mocked demo apps.
// Default MUST be 'catalog' so the existing e2e anchors render on load.
type NavId = 'catalog' | 'industrial' | 'users' | 'ecommerce'
type NavIcon = 'dashboard' | 'factory' | 'users' | 'store'
const view = ref<NavId>('catalog')
const navItems: ReadonlyArray<{ id: NavId; label: string; icon: NavIcon }> = [
  { id: 'catalog', label: 'Catálogo', icon: 'dashboard' },
  { id: 'industrial', label: 'Industrial', icon: 'factory' },
  { id: 'users', label: 'Usuários', icon: 'users' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'store' },
]
const activeNav = computed(() => navItems.find((item) => item.id === view.value) ?? navItems[0])

// Collapsible sidebar (PlaTEA "mini mode"). Default EXPANDED so labels are
// visible on load — the e2e navigates by the button's accessible name (the
// label text), which must stay rendered. Collapsing only shrinks the rail and
// shifts the label under the icon (still in the DOM as the accessible name).
const collapsed = ref(false)
const toggleSidebar = (): void => {
  collapsed.value = !collapsed.value
}

// Concise composition snippets shown next to each live recipe.
const dashboardSnippet = `<DsMetricGrid
  :metrics="[
    { id: 'revenue', label: 'Receita', value: 'R$ 128k', delta: '+12%', deltaDirection: 'up' },
    { id: 'active', label: 'Clientes ativos', value: '1.204', delta: '+3%', deltaDirection: 'up' },
  ]"
  :columns="3"
  aria-label="Indicadores"
/>`

const crudSnippet = `import { DsCrudPage, defineResource } from '@nettoolskit/ui'

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

const formSnippet = `import { DsFormPage, defineForm } from '@nettoolskit/ui'

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

const gallerySnippet = `import { useToast } from '@nettoolskit/ui'

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
.demo {
  min-height: 100vh;
}

/* --- Dark chrome (PlaTEA look) -------------------------------------------
   Samples are not scanned by CSS governance, so the host may use :deep() to
   recolor the shared .ntk-header / .ntk-sidebar surfaces. The content area
   stays light (DsAppShell body keeps its default light background). Idle nav
   text uses a light slate (#cbd5e1) and active/hover use white — both clear
   WCAG AA on the deep-slate (--ntk-dark) surface. Local literal colors here
   are intentionally outside the token set so the dark shell reads the same in
   every brand theme without leaking a vivid primary tint. */
.demo :deep(.ntk-header) {
  border-block-end: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, #18233b 0%, var(--ntk-dark) 100%);
  color: var(--ntk-text-inverse);
}

.demo :deep(.ntk-header__title),
.demo :deep(.ntk-sidebar) {
  color: var(--ntk-text-inverse);
}

/* The DsLogo wordmark inherits --ntk-text-primary (dark); recolor it to the
   inverse so it reads on the dark header. The teal mark tile is unchanged. */
.demo :deep(.demo__brand .ntk-logo),
.demo :deep(.demo__brand .ntk-logo__text) {
  color: var(--ntk-text-inverse);
}

.demo :deep(.ntk-sidebar) {
  border-inline-end: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, #18233b 0%, var(--ntk-dark) 100%);
  transition: inline-size var(--ntk-transition-base);
}

/* Mini rail: a touch wider than the default collapsed width so a stacked
   icon + tiny label fit comfortably (~88px, matching PlaTEA's mini drawer). */
.demo--collapsed :deep(.ntk-sidebar.ntk-sidebar--is-collapsed) {
  inline-size: 5.5rem;
}

.demo__brand {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.demo__hamburger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 0;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-inverse);
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast);
}

.demo__hamburger:hover {
  background: rgba(255, 255, 255, 0.12);
}

.demo__hamburger:focus-visible {
  outline: 2px solid var(--ntk-text-inverse);
  outline-offset: 2px;
}

.demo__view-name {
  color: #cbd5e1;
  font-weight: var(--ntk-font-weight-medium);
}

.demo__user {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  color: var(--ntk-text-inverse);
}

.demo__user-name {
  font-weight: var(--ntk-font-weight-medium);
  font-size: var(--ntk-font-size-sm);
}

.demo-nav {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-sm);
}

.demo-nav__section {
  margin: var(--ntk-spacing-sm) var(--ntk-spacing-md) var(--ntk-spacing-xs);
  color: #cbd5e1;
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.demo-nav__item {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-sm) var(--ntk-spacing-md);
  border: 0;
  border-radius: var(--ntk-radius-md);
  background: transparent;
  color: #cbd5e1;
  font: inherit;
  font-weight: var(--ntk-font-weight-medium);
  text-align: start;
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.demo-nav__icon {
  flex-shrink: 0;
}

.demo-nav__item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--ntk-text-inverse);
}

.demo-nav__item--active {
  /* Subtle light-tinted surface on the dark rail + a primary left accent.
     White text on this near-black surface clears WCAG AA comfortably. */
  background: rgba(255, 255, 255, 0.14);
  color: var(--ntk-text-inverse);
  font-weight: var(--ntk-font-weight-semibold);
  box-shadow: inset 3px 0 0 var(--ntk-primary-light);
}

.demo-nav__item:focus-visible {
  outline: 2px solid var(--ntk-text-inverse);
  outline-offset: 2px;
}

/* --- Collapsed (mini) mode ----------------------------------------------
   Stack the icon over a tiny centered label and hide the section heading.
   The label text stays in the DOM (it is the button's accessible name, used
   by the e2e nav-by-name and getByRole queries). */
.demo--collapsed .demo-nav {
  padding-inline: var(--ntk-spacing-xs);
}

.demo--collapsed .demo-nav__section {
  display: none;
}

.demo--collapsed .demo-nav__item {
  flex-direction: column;
  gap: 2px;
  padding: var(--ntk-spacing-sm) var(--ntk-spacing-xs);
  text-align: center;
}

.demo--collapsed .demo-nav__label {
  font-size: 0.6875rem;
  line-height: 1.1;
}

.demo-main {
  min-inline-size: 0;
}

.sample-shell {
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