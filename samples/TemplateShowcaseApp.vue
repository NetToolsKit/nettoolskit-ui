<template>
  <ReferenceWorkspaceShell
    :whitelabel-style-vars="whitelabelStyleVars"
    :selected-preset="selectedPreset"
    :selected-preset-id="selectedPresetId"
    :preset-options="presetOptions"
    :menu-items="menuItems"
    :active-item-id="activeMenuId"
    :search-value="searchValue"
    user-name="Pack Review"
    user-initials="PR"
    storage-key-prefix="ntk-samples-showcase-layout"
    account-label="Abrir workspace"
    sign-out-label="Abrir baseline"
    @update:search-value="searchValue = $event"
    @update:selected-preset-id="selectedPresetId = String($event ?? 'reference-light')"
    @menu-item-click="onMenuItemClick"
    @help-click="navigateTo('/')"
    @profile-click="navigateTo('/?samples=1')"
    @back-home-click="navigateTo('/?original=1')"
  >
    <q-page class="ntk-template-showcase">
      <header
        class="ntk-template-showcase__hero"
        data-template-surface="catalog"
      >
        <div>
          <p class="ntk-template-showcase__kicker">
            Config-driven families
          </p>
          <h1 class="ntk-template-showcase__title">
            Baseline aprovado mais cinco packs derivados do VoltAgent
          </h1>
          <p class="ntk-template-showcase__subtitle">
            {{ showcaseSubtitle }}
          </p>
        </div>

        <div class="ntk-template-showcase__stats">
          <article class="ntk-template-showcase__stat">
            <span>Pacotes</span>
            <strong>{{ visibleFamilies.length }}</strong>
          </article>
          <article class="ntk-template-showcase__stat">
            <span>Variantes</span>
            <strong>{{ previewVariantCount }}</strong>
          </article>
          <article class="ntk-template-showcase__stat">
            <span>Exemplos</span>
            <strong>{{ visibleExampleCount }}</strong>
          </article>
        </div>
      </header>

      <section class="ntk-template-showcase__hero-actions">
        <q-btn
          no-caps
          unelevated
          color="primary"
          label="Voltar ao inicio"
          @click="navigateTo('/')"
        />
        <q-btn
          no-caps
          flat
          color="primary"
          label="Abrir workspace"
          @click="navigateTo('/?samples=1')"
        />
        <q-btn
          v-if="hasActiveFilter"
          no-caps
          outline
          color="primary"
          label="Limpar filtro"
          @click="navigateTo('/?templates=1')"
        />
      </section>

      <TemplateSampleSelector
        :families="templateVisualFamilies"
        :selected-family-id="focusedFamilyId"
        :show-all-action="hasActiveFilter"
    @select-family="navigateTo(`/?templates=1&family=${$event}`)"
        @show-all="navigateTo('/?templates=1')"
      />

      <section class="ntk-template-showcase__catalog-grid">
        <article
          v-for="item in templatesByArea"
          :key="item.area"
          class="ntk-template-showcase__catalog-card"
        >
          <strong>{{ item.area }}</strong>
          <span>{{ item.count }} entries</span>
        </article>
      </section>

      <section class="ntk-template-showcase__family-list">
        <div
          v-if="visibleFamilies.length === 0"
          class="ntk-template-showcase__empty"
        >
          Nenhuma familia visual corresponde ao filtro atual.
        </div>
        <TemplateVisualFamilySection
          v-for="family in visibleFamilies"
          :key="family.id"
          :family="family"
        />
      </section>
    </q-page>
  </ReferenceWorkspaceShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { TEMPLATE_AREAS, getTemplateCatalogByArea } from '../src/templates'
import { ReferenceWorkspaceShell } from '../src/templates/features/reference-system'
import type { TemplateMenuChildItem, TemplateMenuItem } from '../src/templates/navigation/menu-template.types'
import { useSamplesShellState } from './shared/useSamplesShellState'
import TemplateVisualFamilySection from './template-showcase/components/TemplateVisualFamilySection.vue'
import TemplateSampleSelector from './template-showcase/components/TemplateSampleSelector.vue'
import { templateVisualFamilies } from './template-showcase/families/template-visual-families'
import { templateShowcaseExampleRegistry } from './template-showcase/template-showcase.examples'
import './template-showcase/template-showcase.css'

const searchParams = typeof window === 'undefined'
  ? new URLSearchParams()
  : new URLSearchParams(window.location.search)

const focusedFamilyId = searchParams.get('family')
const focusedExampleId = searchParams.get('example')

const {
  activeMenuId,
  menuItems,
  presetOptions,
  searchValue,
  selectedPreset,
  selectedPresetId,
  whitelabelStyleVars,
} = useSamplesShellState('templates')

const templatesByArea = computed(() => {
  return TEMPLATE_AREAS.map(area => ({
    area,
    count: getTemplateCatalogByArea(area).length,
  }))
})

const visibleExampleCount = computed(() => {
  return new Set(visibleFamilies.value.map(family => family.example.id)).size
})

function matchesSearch(family: (typeof templateVisualFamilies)[number]): boolean {
  const normalized = searchValue.value.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  return [
    family.label,
    family.kicker,
    family.description,
    family.example.label,
    family.example.summary,
    ...family.notes.map(note => note.value),
    ...family.metrics.map(metric => metric.value),
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalized)
}

const visibleFamilies = computed(() => {
  return templateVisualFamilies.filter(family => {
    const matchesFamily = !focusedFamilyId || family.id === focusedFamilyId
    const matchesExample = !focusedExampleId || family.example.id === focusedExampleId
    return matchesFamily && matchesExample && matchesSearch(family)
  })
})

const previewVariantCount = computed(() => {
  return visibleFamilies.value.reduce((count, family) => count + family.variants.length, 0)
})

const hasActiveFilter = computed(() => {
  return Boolean(focusedFamilyId || focusedExampleId)
})

const showcaseSubtitle = computed(() => {
  if (focusedFamilyId) {
    const family = templateVisualFamilies.find(item => item.id === focusedFamilyId)
    return family
      ? `Foco em ${family.label}. O preview usa o mesmo template compartilhado com duas variantes de tema e tokens inspirados em uma fonte real do VoltAgent.`
      : 'Filtro de familia ativo.'
  }

  if (focusedExampleId) {
    const example = templateShowcaseExampleRegistry.find(item => item.id === focusedExampleId)
    return example
      ? `Foco no exemplo ${example.label}. Aqui voce compara apenas os packs que usam essa mesma superficie compartilhada.`
      : 'Filtro de exemplo ativo.'
  }

  if (searchValue.value) {
    return `Busca ativa para "${searchValue.value}". O resultado continua preso ao baseline aprovado e aos cinco packs derivados do awesome-design-md.`
  }

  return 'O original replica o shell aprovado em `.temp/reference` com naming neutro. As outras cinco familias reutilizam a mesma arquitetura, mas adotam dialetos visuais inspirados em IBM, Stripe, Uber, Notion e Airbnb.'
})

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}

function onMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
  activeMenuId.value = item.id ?? 'templates'

  if (item.id === 'home') {
    navigateTo('/')
    return
  }

  if (item.id === 'workspace') {
    navigateTo('/?samples=1')
    return
  }

  if (item.id === 'presets') {
    navigateTo('/?templates=1&family=approved-reference')
    return
  }

  navigateTo('/?templates=1')
}
</script>
