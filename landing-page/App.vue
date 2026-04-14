<template>
  <div class="landing-new-app">
    <LandingNewTopNav
      :is-scrolled="isScrolled"
      :is-hero-section="activeSection === 'top'"
      :hero-scroll-progress="heroScrollProgress"
      @toggle-panel="togglePanel"
      @open-search="openSearch"
    />

    <LandingNewSidePanel
      :is-open="isPanelOpen"
      :active-section="activeSection"
      :items="navigationItems"
      @toggle-panel="togglePanel"
      @close-panel="closePanel"
    />

    <div
      v-if="isSearchOpen"
      class="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Pesquisar seções"
      @click.self="closeSearch"
    >
      <div class="search-modal">
        <div class="search-header">
          <h3>Pesquisar seções</h3>
          <button
            class="search-close"
            aria-label="Fechar pesquisa"
            @click="closeSearch"
          >
            x
          </button>
        </div>

        <input
          ref="searchInputRef"
          v-model="searchTerm"
          class="search-input"
          type="text"
          placeholder="Digite um termo (ex: composables, arquitetura, contato)"
          @keydown.esc="closeSearch"
        >

        <ul class="search-results">
          <li
            v-for="result in filteredSearchEntries"
            :key="`search-${result.id}`"
          >
            <button
              class="search-result-item"
              @click="goToSection(result.id)"
            >
              <span class="search-result-title">{{ result.title }}</span>
              <span class="search-result-id">#{{ result.id }}</span>
            </button>
          </li>
        </ul>

        <p
          v-if="filteredSearchEntries.length === 0"
          class="search-empty"
        >
          Nenhum resultado encontrado para "{{ searchTerm }}".
        </p>
      </div>
    </div>

    <LandingNewHeroSection />

    <nav
      class="section-progress"
      aria-label="Marcador de seções"
    >
      <a
        v-for="item in navigationItems"
        :key="`progress-${item.id}`"
        :href="`#${item.id}`"
        :class="['section-progress-item', { active: activeSection === item.id }]"
        :aria-label="item.label"
      >
        <span class="section-progress-dot" />
      </a>
    </nav>

    <LandingNewVideoSection
      id="servicos"
      eyebrow="Biblioteca de componentes"
      title="Componentes Vue 3 + Quasar prontos para produção"
      body="O NetToolsKit UI Vue entrega componentes reutilizáveis para formulários, layouts e interfaces complexas com padrão visual consistente. Tudo com foco em acessibilidade, manutenção e velocidade de entrega."
      cta-text="Ver componentes"
      cta-href="#processo"
      :images="[
        './assets/composables-visual.png',
        './assets/theme-preview.png',
        './assets/hero-visual.png',
      ]"
      :image-alts="[
        'Composables reutilizáveis',
        'Preview de temas',
        'Arquitetura visual do sistema',
      ]"
    />

    <LandingNewGrandSection
      id="expo"
      eyebrow="Composables e branding"
      title="Logica reutilizavel e sistema de identidade centralizado"
      body="Com os composables do NetToolsKit, você padroniza estados, regras e comportamento entre telas. O branding centralizado permite white-label e personalização por cliente sem duplicar código."
      cta-text="Abrir no NPM"
      cta-href="https://www.npmjs.com/package/@nettoolskit/ui-vue"
      :images="[]"
      :image-alts="[]"
    />

    <template
      v-for="section in splitSections"
      :key="section.id"
    >
      <div class="divider" />
      <LandingNewSplitSection
        :id="section.id"
        :reverse="section.reverse"
        :soft-edges="section.softEdges"
        :eyebrow="section.eyebrow"
        :title="section.title"
        :body="section.body"
        :images="section.images"
        :image-alts="section.imageAlts"
        :links="section.links"
      />
    </template>

    <LandingNewFooterSection v-model:reduce-motion="reduceMotion" />

    <div class="runtime-mode-shortcuts">
      <a
        href="/"
        class="samples-mode-btn"
        aria-label="Abrir samples"
      >
        Abrir Sample
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

import LandingNewFooterSection from './components/LandingNewFooterSection.vue'
import LandingNewGrandSection from './components/LandingNewGrandSection.vue'
import LandingNewHeroSection from './components/LandingNewHeroSection.vue'
import LandingNewSidePanel from './components/LandingNewSidePanel.vue'
import LandingNewSplitSection from './components/LandingNewSplitSection.vue'
import LandingNewTopNav from './components/LandingNewTopNav.vue'
import LandingNewVideoSection from './components/LandingNewVideoSection.vue'
import { useLandingNewEffects } from './composables/useLandingNewEffects'

interface NavigationItem {
  id: string
  number: string
  label: string
}

interface SectionLink {
  text: string
  href: string
  external?: boolean
}

interface SplitSection {
  id: string
  reverse: boolean
  softEdges?: boolean
  eyebrow: string
  title: string
  body: string
  images: string[]
  imageAlts: string[]
  links: SectionLink[]
}

interface SearchEntry {
  id: string
  title: string
  keywords: string[]
}

const navigationItems: NavigationItem[] = [
  { id: 'top', number: '01', label: 'Inicio' },
  { id: 'servicos', number: '02', label: 'Componentes' },
  { id: 'expo', number: '03', label: 'Composables' },
  { id: 'independencia', number: '04', label: 'White-label' },
  { id: 'inovação', number: '05', label: 'Arquitetura' },
  { id: 'processo', number: '06', label: 'Integração' },
  { id: 'contato', number: '07', label: 'Contato' },
]

const splitSections: SplitSection[] = [
  {
    id: 'independencia',
    reverse: false,
    eyebrow: 'White-label',
    title: 'Personalização por cliente sem perder consistência',
    body: 'A biblioteca foi desenhada para ambientes multi-tenant e white-label. Você define identidade, temas e configurações por marca enquanto preserva governança, padrão de UX e produtividade do time.',
    images: [
      './assets/theme-preview.png',
      './assets/form-components.png',
    ],
    imageAlts: ['Sistema de temas', 'Componentes reutilizáveis'],
    links: [
      {
        text: 'Guia de customização',
        href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/blob/main/docs/CUSTOMIZATION.md',
        external: true,
      },
    ],
  },
  {
    id: 'inovação',
    reverse: true,
    softEdges: true,
    eyebrow: 'Arquitetura limpa',
    title: 'Separação por módulos, escalabilidade e manutenção simplificada',
    body: 'O NetToolsKit UI Vue adota padrões de Clean Architecture e organização modular. Isso reduz acoplamento, melhora testes e permite evolução contínua sem reescrever os mesmos blocos de UI em cada projeto.',
    images: [
      './assets/hero-visual.png',
      './assets/composables-visual.png',
    ],
    imageAlts: ['Arquitetura de componentes', 'Camada de composables'],
    links: [
      { text: 'Ver repositório', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', external: true },
      { text: 'Explorar composables', href: '#expo' },
    ],
  },
  {
    id: 'processo',
    reverse: false,
    softEdges: true,
    eyebrow: 'Integração',
    title: 'Como aplicar no seu produto em poucos passos',
    body: 'Instale pelo NPM, configure Quasar e tema global, e comece a consumir componentes e composables no mesmo dia. O pacote entrega tipagem completa, build CJS/ESM e estilos preparados para projetos enterprise.',
    images: [
      './assets/form-components.png',
      './assets/theme-preview.png',
    ],
    imageAlts: ['Formularios prontos', 'Preview de temas'],
    links: [
      {
        text: 'Quick start',
        href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue#quick-start',
        external: true,
      },
    ],
  },
  {
    id: 'contato',
    reverse: true,
    softEdges: true,
    eyebrow: 'Contato e comunidade',
    title: 'Vamos construir uma base de UI consistente para os seus produtos',
    body: 'Use o repositório para acompanhar evoluções, abrir issues e contribuir com novos componentes. O foco do NetToolsKit é acelerar entrega sem comprometer padrão visual, acessibilidade e qualidade técnica.',
    images: [
      './assets/composables-visual.png',
      './assets/hero-visual.png',
    ],
    imageAlts: ['Documentação e suporte', 'Ecossistema de distribuição'],
    links: [
      {
        text: 'Abrir repositório no GitHub',
        href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
        external: true,
      },
    ],
  },
]

const searchEntries: SearchEntry[] = [
  {
    id: 'top',
    title: 'Inicio',
    keywords: ['home', 'topo', 'nettoolskit'],
  },
  {
    id: 'servicos',
    title: 'Componentes',
    keywords: ['componentes', 'quasar', 'vue', 'biblioteca'],
  },
  {
    id: 'expo',
    title: 'Composables',
    keywords: ['composables', 'branding', 'estado', 'logica'],
  },
  {
    id: 'independencia',
    title: 'White-label',
    keywords: ['white-label', 'tema', 'tenant', 'customização'],
  },
  {
    id: 'inovação',
    title: 'Arquitetura',
    keywords: ['arquitetura', 'clean architecture', 'modulos'],
  },
  {
    id: 'processo',
    title: 'Integração',
    keywords: ['integração', 'quick start', 'npm'],
  },
  {
    id: 'contato',
    title: 'Contato',
    keywords: ['contato', 'github', 'comunidade'],
  },
]

const isSearchOpen = ref(false)
const searchTerm = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

const filteredSearchEntries = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) {
    return searchEntries
  }

  return searchEntries.filter(entry => {
    if (entry.title.toLowerCase().includes(term)) {
      return true
    }

    return entry.keywords.some(keyword => keyword.toLowerCase().includes(term))
  })
})

const openSearch = () => {
  closePanel()
  isSearchOpen.value = true

  void nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const closeSearch = () => {
  isSearchOpen.value = false
  searchTerm.value = ''
}

const goToSection = (sectionId: string) => {
  const target = document.getElementById(sectionId)
  if (!target) {
    return
  }

  closeSearch()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const {
  activeSection,
  closePanel,
  heroScrollProgress,
  isPanelOpen,
  isScrolled,
  reduceMotion,
  togglePanel,
} = useLandingNewEffects(navigationItems.map(item => item.id))
</script>
