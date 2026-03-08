/**
 * Landing page lightweight i18n provider (default: English, optional: pt-BR).
 * It centralizes copy strings, locale persistence and URL query synchronization.
 */
import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export const LANDING_I18N_STORAGE_KEY = 'ntk.landing.locale'
const LANDING_I18N_QUERY_PARAM = 'lang'
const FALLBACK_LOCALE = 'en'

export const SUPPORTED_LANDING_LOCALES = ['en', 'pt-BR'] as const
export type LandingLocale = (typeof SUPPORTED_LANDING_LOCALES)[number]

interface LandingDictionary {
  [key: string]: string | LandingDictionary
}

type LandingMessages = Record<LandingLocale, LandingDictionary>

const messages: LandingMessages = {
  en: {
    app: {
      testCms: 'Test CMS',
    },
    header: {
      brandName: 'NetToolsKit UI',
      openMenuAria: 'Open menu',
      nav: {
        features: 'Features',
        components: 'Components',
        themes: 'Themes',
        installation: 'Installation',
      },
      themeToggleTitle: 'Toggle dark mode',
      localeToggleTitle: 'Switch language',
      localeSwitchLabel: 'PT-BR',
      github: 'GitHub',
      collapse: 'Collapse',
    },
    hero: {
      badge: 'Vue 3 + Quasar',
      titlePrefix: 'Build Consistent UIs with',
      titleHighlight: 'NetToolsKit',
      description: 'A comprehensive component library with theme system, composables, and design tokens for building enterprise Vue applications.',
      primaryCta: 'Get Started',
      secondaryCta: 'View on GitHub',
      stats: {
        components: 'Components',
        composables: 'Composables',
        themes: 'Themes',
      },
      visualAlt: 'Vue Component Library - Floating UI Cards',
    },
    features: {
      title: 'Why NetToolsKit UI?',
      subtitle: 'Built for developers who need consistent, accessible, and themeable components.',
      themeSystemTitle: 'Theme System',
      themeSystemBody: 'Runtime theme switching with CSS variables. Includes Dark, Light, and Monochrome themes out of the box.',
      formTitle: 'Form Components',
      formBody: 'Complete form toolkit with BaseInput, BaseSelect, BaseMultiSelect, BaseTextarea, and date/time pickers.',
      layoutTitle: 'Layout Components',
      layoutBody: 'Flexible layouts with BaseHeader, BaseSidebar, BaseHero, BaseSection, and BaseFooter components.',
      composablesTitle: 'Composables',
      composablesBody: 'Reusable logic with useTheme, useNotification, useDialog, useFormRules, useDebounce, and more.',
      accessibilityTitle: 'Accessibility',
      accessibilityBody: 'WCAG compliant components with keyboard navigation, ARIA labels, and focus management.',
      tokensTitle: 'Design Tokens',
      tokensBody: 'Consistent spacing, shadows, and transitions defined as CSS variables and SCSS mixins.',
    },
    showcase: {
      title: 'Component Library',
      subtitle: '22+ production-ready components organized by category.',
      tabs: {
        form: 'Form',
        layout: 'Layout',
        ui: 'UI',
        composables: 'Composables',
      },
      items: {
        baseInput: 'Text input with validation',
        baseSelect: 'Single select dropdown',
        baseMultiSelect: 'Multi-select with chips',
        baseTextarea: 'Multiline text input',
        baseDatePicker: 'Date selection',
        baseTimePicker: 'Time selection',
        baseHeader: 'Application header',
        baseSidebar: 'Navigation sidebar',
        baseFooter: 'Application footer',
        baseHero: 'Landing page hero section',
        baseSection: 'Content section wrapper',
        baseCard: 'Content container',
        baseButton: 'Action button',
        baseChip: 'Tag/label chip',
        baseLogo: 'Brand logo display',
        metricCard: 'Dashboard metrics',
        infoCard: 'Information display',
        baseFeatureCard: 'Feature showcase',
        basePricingCard: 'Pricing plans',
        baseCreditCard: 'Payment card display',
        baseSteps: 'Step indicator',
        sectionHeader: 'Section title',
        useTheme: 'Theme management',
        useNotification: 'Toast notifications',
        useDialog: 'Modal state management',
        useFormRules: 'Form validation rules',
        useResponsive: 'Breakpoint detection',
        useDebounce: 'Debounced values',
        useAsync: 'Async operation handling',
        useFilters: 'Data filtering',
        useTableColumns: 'Table column config',
        useBaseField: 'Form field base',
        useDialogActions: 'Dialog action handlers',
      },
    },
    developer: {
      title: 'Simple to Use',
      subtitle: 'Import components and composables with a single entry point. Full TypeScript support included.',
      bullet1: 'Single entry point export for all components',
      bullet2: 'Full TypeScript definitions included',
      bullet3: 'Quasar-first CSS with design tokens',
      bullet4: 'Runtime theme switching',
      formToolkitTitle: 'Complete Form Toolkit',
      formToolkitSubtitle: 'Everything you need to build complex forms with validation, accessibility, and consistent styling.',
      formFeature1: 'Built-in validation with useFormRules',
      formFeature2: 'Date and time pickers with localization',
      formFeature3: 'Multi-select with chip display',
      formFeature4: 'Consistent error states and messages',
      composablesTitle: 'Powerful Composables',
      composablesSubtitle: 'Reusable Vue 3 composition functions that encapsulate common logic and state management.',
      useTheme: 'Runtime theme switching',
      useNotification: 'Toast notifications',
      useDialog: 'Confirmation dialogs',
      useFormRules: 'Validation rules',
      useDebounce: 'Debounced values',
      useAsync: 'Async state handling',
      formVisualAlt: 'Form Components',
      composablesVisualAlt: 'Composables Architecture',
    },
    dashboard: {
      title: 'Dashboard Preview',
      subtitle: 'See how NetToolsKit components look in a real dashboard application.',
      totalUsers: 'Total Users',
      revenue: 'Revenue',
      orders: 'Orders',
      conversion: 'Conversion',
      monthlyRevenue: 'Monthly Revenue',
      lastTwelveMonths: 'Last 12 months',
    },
    themes: {
      title: 'Built-in Themes',
      subtitle: 'Three production-ready themes with runtime switching support.',
      previewAlt: 'Theme Preview - Dark, Light, Monochrome',
      darkAlt: 'Dark Theme',
      lightAlt: 'Light Theme',
      monochromeAlt: 'Monochrome Theme',
      darkTitle: 'Dark',
      darkBody: 'Modern dark theme with deep backgrounds and vibrant accents',
      lightTitle: 'Light',
      lightBody: 'Bright default theme with accessible contrast ratios',
      monochromeTitle: 'Monochrome',
      monochromeBody: 'Clean grayscale theme for minimal interfaces',
    },
    installation: {
      title: 'Get Started',
      subtitle: 'Add NetToolsKit UI to your project in minutes.',
      step1Title: 'Add as Submodule',
      step2Title: 'Import Styles',
      step3Title: 'Use Components',
    },
    footer: {
      brandName: 'NetToolsKit UI Vue',
      description: 'A comprehensive Vue 3 + Quasar component library with theme system, composables, and design tokens for building consistent enterprise applications.',
      resources: 'Resources',
      related: 'Related',
      documentation: 'Documentation',
      demoPage: 'Demo Page',
      components: 'Components',
      composables: 'Composables',
      copilotInstructions: 'Copilot Instructions',
      ntkCli: 'NTK CLI (Rust)',
      builtWith: 'Built with Vue 3 + Quasar.',
      createdBy: 'Created by',
    },
  },
  'pt-BR': {
    app: {
      testCms: 'Testar CMS',
    },
    header: {
      brandName: 'NetToolsKit UI',
      openMenuAria: 'Abrir menu',
      nav: {
        features: 'Recursos',
        components: 'Componentes',
        themes: 'Temas',
        installation: 'Instalacao',
      },
      themeToggleTitle: 'Alternar modo escuro',
      localeToggleTitle: 'Trocar idioma',
      localeSwitchLabel: 'EN',
      github: 'GitHub',
      collapse: 'Comprimir',
    },
    hero: {
      badge: 'Vue 3 + Quasar',
      titlePrefix: 'Crie UIs consistentes com',
      titleHighlight: 'NetToolsKit',
      description: 'Uma biblioteca completa de componentes com sistema de temas, composables e design tokens para aplicacoes Vue enterprise.',
      primaryCta: 'Comecar',
      secondaryCta: 'Ver no GitHub',
      stats: {
        components: 'Componentes',
        composables: 'Composables',
        themes: 'Temas',
      },
      visualAlt: 'Biblioteca de componentes Vue - Cards flutuantes',
    },
    features: {
      title: 'Por que NetToolsKit UI?',
      subtitle: 'Feito para times que precisam de componentes consistentes, acessiveis e tematizaveis.',
      themeSystemTitle: 'Sistema de Temas',
      themeSystemBody: 'Troca de tema em runtime com variaveis CSS. Inclui temas Dark, Light e Monochrome por padrao.',
      formTitle: 'Componentes de Formulario',
      formBody: 'Kit completo com BaseInput, BaseSelect, BaseMultiSelect, BaseTextarea e seletores de data/hora.',
      layoutTitle: 'Componentes de Layout',
      layoutBody: 'Layouts flexiveis com BaseHeader, BaseSidebar, BaseHero, BaseSection e BaseFooter.',
      composablesTitle: 'Composables',
      composablesBody: 'Logica reutilizavel com useTheme, useNotification, useDialog, useFormRules, useDebounce e mais.',
      accessibilityTitle: 'Acessibilidade',
      accessibilityBody: 'Componentes aderentes a WCAG com navegacao por teclado, ARIA labels e foco controlado.',
      tokensTitle: 'Design Tokens',
      tokensBody: 'Espacamentos, sombras e transicoes consistentes definidos em variaveis CSS e mixins SCSS.',
    },
    showcase: {
      title: 'Biblioteca de Componentes',
      subtitle: '22+ componentes prontos para producao organizados por categoria.',
      tabs: {
        form: 'Formulario',
        layout: 'Layout',
        ui: 'UI',
        composables: 'Composables',
      },
      items: {
        baseInput: 'Campo de texto com validacao',
        baseSelect: 'Selecao simples',
        baseMultiSelect: 'Selecao multipla com chips',
        baseTextarea: 'Campo de texto multilinha',
        baseDatePicker: 'Selecao de data',
        baseTimePicker: 'Selecao de horario',
        baseHeader: 'Cabecalho da aplicacao',
        baseSidebar: 'Barra lateral de navegacao',
        baseFooter: 'Rodape da aplicacao',
        baseHero: 'Secao hero da landing page',
        baseSection: 'Container de secao',
        baseCard: 'Container de conteudo',
        baseButton: 'Botao de acao',
        baseChip: 'Chip de tag/label',
        baseLogo: 'Exibicao de logo',
        metricCard: 'Metricas de dashboard',
        infoCard: 'Exibicao de informacoes',
        baseFeatureCard: 'Card de destaque',
        basePricingCard: 'Planos de preco',
        baseCreditCard: 'Exibicao de cartao',
        baseSteps: 'Indicador de etapas',
        sectionHeader: 'Titulo de secao',
        useTheme: 'Gestao de tema',
        useNotification: 'Notificacoes toast',
        useDialog: 'Gestao de modais',
        useFormRules: 'Regras de validacao',
        useResponsive: 'Deteccao de breakpoints',
        useDebounce: 'Valores com debounce',
        useAsync: 'Fluxos assincronos',
        useFilters: 'Filtragem de dados',
        useTableColumns: 'Configuracao de colunas',
        useBaseField: 'Base de campos de formulario',
        useDialogActions: 'Acoes de dialogo',
      },
    },
    developer: {
      title: 'Simples de usar',
      subtitle: 'Importe componentes e composables por um ponto unico. Suporte completo a TypeScript.',
      bullet1: 'Export unico para todos os componentes',
      bullet2: 'Definicoes TypeScript completas',
      bullet3: 'CSS orientado a Quasar com design tokens',
      bullet4: 'Troca de tema em runtime',
      formToolkitTitle: 'Kit completo de formularios',
      formToolkitSubtitle: 'Tudo para criar formularios complexos com validacao, acessibilidade e estilo consistente.',
      formFeature1: 'Validacao nativa com useFormRules',
      formFeature2: 'Seletores de data e hora com localizacao',
      formFeature3: 'Selecao multipla com chips',
      formFeature4: 'Estados e mensagens de erro consistentes',
      composablesTitle: 'Composables poderosos',
      composablesSubtitle: 'Funcoes de composicao Vue 3 reutilizaveis para encapsular logica e estado.',
      useTheme: 'Troca de tema em runtime',
      useNotification: 'Notificacoes toast',
      useDialog: 'Dialogos de confirmacao',
      useFormRules: 'Regras de validacao',
      useDebounce: 'Valores com debounce',
      useAsync: 'Controle de estado assincrono',
      formVisualAlt: 'Componentes de formulario',
      composablesVisualAlt: 'Arquitetura de composables',
    },
    dashboard: {
      title: 'Preview de Dashboard',
      subtitle: 'Veja como os componentes do NetToolsKit ficam em um dashboard real.',
      totalUsers: 'Usuarios totais',
      revenue: 'Receita',
      orders: 'Pedidos',
      conversion: 'Conversao',
      monthlyRevenue: 'Receita mensal',
      lastTwelveMonths: 'Ultimos 12 meses',
    },
    themes: {
      title: 'Temas nativos',
      subtitle: 'Tres temas prontos para producao com troca em runtime.',
      previewAlt: 'Preview de temas - Dark, Light, Monochrome',
      darkAlt: 'Tema escuro',
      lightAlt: 'Tema claro',
      monochromeAlt: 'Tema monocromatico',
      darkTitle: 'Dark',
      darkBody: 'Tema escuro moderno com fundos profundos e acentos vibrantes',
      lightTitle: 'Light',
      lightBody: 'Tema claro padrao com contraste acessivel',
      monochromeTitle: 'Monochrome',
      monochromeBody: 'Tema em escala de cinza para interfaces minimalistas',
    },
    installation: {
      title: 'Comece agora',
      subtitle: 'Adicione NetToolsKit UI no seu projeto em minutos.',
      step1Title: 'Adicionar como submodulo',
      step2Title: 'Importar estilos',
      step3Title: 'Usar componentes',
    },
    footer: {
      brandName: 'NetToolsKit UI Vue',
      description: 'Uma biblioteca Vue 3 + Quasar com sistema de temas, composables e design tokens para aplicacoes enterprise consistentes.',
      resources: 'Recursos',
      related: 'Relacionados',
      documentation: 'Documentacao',
      demoPage: 'Pagina Demo',
      components: 'Componentes',
      composables: 'Composables',
      copilotInstructions: 'Copilot Instructions',
      ntkCli: 'NTK CLI (Rust)',
      builtWith: 'Feito com Vue 3 + Quasar.',
      createdBy: 'Criado por',
    },
  },
}

export interface LandingI18nContext {
  locale: Ref<LandingLocale>
  isPtBr: ComputedRef<boolean>
  t: (key: string) => string
  setLocale: (locale: LandingLocale | string | null | undefined) => void
}

const landingI18nKey: InjectionKey<LandingI18nContext> = Symbol('landing-i18n')

/**
 * Resolves raw locale values to the two supported locales.
 */
export function resolveLandingLocale(value: string | null | undefined): LandingLocale {
  const normalized = String(value ?? '').trim()
  if ((SUPPORTED_LANDING_LOCALES as readonly string[]).includes(normalized)) {
    return normalized as LandingLocale
  }
  if (normalized.toLowerCase().startsWith('pt')) {
    return 'pt-BR'
  }
  return FALLBACK_LOCALE
}

/**
 * Creates and returns the landing i18n context for the current app runtime.
 */
export function createLandingI18n(initialLocale?: string | null): LandingI18nContext {
  const readStoredLocale = (): string | null => {
    if (typeof window === 'undefined') {
      return null
    }
    const localStorageApi = window.localStorage as Storage | undefined
    if (!localStorageApi || typeof localStorageApi.getItem !== 'function') {
      return null
    }
    try {
      return localStorageApi.getItem(LANDING_I18N_STORAGE_KEY)
    } catch {
      return null
    }
  }

  const savedLocale = readStoredLocale()

  const locale = ref<LandingLocale>(resolveLandingLocale(initialLocale ?? savedLocale))

  const syncHtmlLang = (nextLocale: LandingLocale): void => {
    if (typeof document === 'undefined') {
      return
    }
    document.documentElement.lang = nextLocale
  }

  const setLocale = (nextLocaleInput: LandingLocale | string | null | undefined): void => {
    const nextLocale = resolveLandingLocale(nextLocaleInput)
    locale.value = nextLocale

    if (typeof window !== 'undefined') {
      const localStorageApi = window.localStorage as Storage | undefined
      if (localStorageApi && typeof localStorageApi.setItem === 'function') {
        try {
          localStorageApi.setItem(LANDING_I18N_STORAGE_KEY, nextLocale)
        } catch {
          // Ignore storage write errors (private mode or disabled storage).
        }
      }

      const url = new URL(window.location.href)
      url.searchParams.set(LANDING_I18N_QUERY_PARAM, nextLocale)
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }

    syncHtmlLang(nextLocale)
  }

  const t = (key: string): string => {
    const readValue = (dictionary: LandingDictionary): string | undefined => {
      const segments = key.split('.')
      let current: string | LandingDictionary | undefined = dictionary
      for (const segment of segments) {
        if (!current || typeof current === 'string') {
          return undefined
        }
        current = current[segment]
      }
      return typeof current === 'string' ? current : undefined
    }

    const localized = readValue(messages[locale.value])
    if (localized) {
      return localized
    }
    const fallback = readValue(messages[FALLBACK_LOCALE])
    return fallback ?? key
  }

  syncHtmlLang(locale.value)

  return {
    locale,
    isPtBr: computed(() => locale.value === 'pt-BR'),
    t,
    setLocale,
  }
}

/**
 * Provides landing i18n context for nested components.
 */
export function provideLandingI18n(context: LandingI18nContext): void {
  provide(landingI18nKey, context)
}

/**
 * Reads landing i18n context from component tree.
 */
export function useLandingI18n(): LandingI18nContext {
  const context = inject(landingI18nKey)
  if (!context) {
    throw new Error('Landing i18n context not found. Ensure provideLandingI18n is called in App.vue.')
  }
  return context
}