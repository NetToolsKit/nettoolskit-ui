/**
 * Vitest Setup File
 *
 * Global configuration and mocks for all tests
 */

import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const $qMock = {
  screen: {
    gt: { xs: true, sm: true, md: true },
    lt: { sm: false, md: false, lg: false }
  },
  platform: {
    is: {
      mobile: false,
      desktop: true,
      touch: false,
      cordova: false,
      capacitor: false,
      electron: false,
      chrome: true,
      safari: false,
      firefox: false,
      edge: false,
      ie: false,
      opera: false,
      ios: false,
      android: false,
      mac: false,
      linux: false,
      win: true
    }
  }
}

const QUASAR_PROP_NAMES = [
  'modelValue',
  'label',
  'placeholder',
  'outlined',
  'filled',
  'dense',
  'readonly',
  'disable',
  'loading',
  'rules',
  'lazyRules',
  'name',
  'size',
  'color',
  'icon',
  'iconRight',
  'round',
  'flat',
  'outline',
  'unelevated',
  'padding',
  'noCaps',
  'noWrap',
  'align',
  'to',
  'href',
  'target',
  'stretch',
  'ripple',
  'stack',
  'type',
  'minimal',
  'todayBtn',
  'locale',
  'cover',
  'transitionShow',
  'transitionHide',
  'multiple',
  'options',
  'emitValue',
  'mapOptions',
  'clearable'
] as const

const createQuasarProps = () =>
  Object.fromEntries(QUASAR_PROP_NAMES.map((propName) => [propName, { type: null as any, required: false }]))

const createQuasarStub = (name: string) =>
  defineComponent({
    name,
    props: createQuasarProps(),
    setup(_props, { slots, attrs }) {
      return () => h('div', { 'data-stub': name, ...attrs }, slots.default?.())
    }
  })

const QBtn = createQuasarStub('QBtn')
const QCard = createQuasarStub('QCard')
const QCardSection = createQuasarStub('QCardSection')
const QIcon = defineComponent({
  name: 'QIcon',
  props: createQuasarProps(),
  setup(_props, { slots, attrs }) {
    return () => h('i', { class: 'q-icon', 'data-stub': 'QIcon', ...attrs }, slots.default?.())
  }
})
const QInput = createQuasarStub('QInput')
const QSelect = createQuasarStub('QSelect')
const QTextarea = createQuasarStub('QTextarea')
const QDate = createQuasarStub('QDate')
const QTime = createQuasarStub('QTime')
const QPopupProxy = createQuasarStub('QPopupProxy')
const QMenu = createQuasarStub('QMenu')
const QHeader = createQuasarStub('QHeader')
const QFooter = createQuasarStub('QFooter')
const QDrawer = createQuasarStub('QDrawer')
const QList = createQuasarStub('QList')
const QItem = createQuasarStub('QItem')
const QItemSection = createQuasarStub('QItemSection')
const QToolbar = createQuasarStub('QToolbar')
const QToolbarTitle = createQuasarStub('QToolbarTitle')
const QSeparator = createQuasarStub('QSeparator')
const QSpace = createQuasarStub('QSpace')

// Mock the `quasar` module to avoid installing the real plugin (which requires SSR/runtime globals)
// and to keep component mounting stable.
vi.mock('quasar', () => {
  const Quasar = {
    install(app: any) {
      app.config.globalProperties.$q = $qMock
    }
  }

  const useQuasar = () => $qMock

  return {
    Quasar,
    useQuasar,
    QBtn,
    QCard,
    QCardSection,
    QIcon,
    QInput,
    QSelect,
    QTextarea,
    QDate,
    QTime,
    QPopupProxy,
    QMenu,
    QHeader,
    QFooter,
    QDrawer,
    QList,
    QItem,
    QItemSection,
    QToolbar,
    QToolbarTitle,
    QSeparator,
    QSpace
  }
})

// Mock Quasar
config.global.mocks = {
  $q: $qMock
}

// Register Quasar components as lightweight stubs globally
config.global.components = {
  QBtn,
  QCard,
  QCardSection,
  QIcon,
  QInput,
  QSelect,
  QTextarea,
  QDate,
  QTime,
  QPopupProxy,
  QMenu,
  QHeader,
  QFooter,
  QDrawer,
  QList,
  QItem,
  QItemSection,
  QToolbar,
  QToolbarTitle,
  QSeparator,
  QSpace
}

// Mock useBranding composable
vi.mock('@/composables/ui/useBranding', () => ({
  useBranding: () => ({
    logo: {
      value: {
        type: 'letter',
        value: 'S',
        alt: 'Mock Logo'
      }
    },

    appName: { value: 'MockApp' },
    tagline: { value: 'Mock Tagline' },
    appUrl: { value: 'https://example.com' },

    primaryColor: { value: '#1976D2' },
    secondaryColor: { value: '#42A5F5' },
    accentColor: { value: '#FFC107' },

    contact: { value: {} },
    social: { value: {} }
  })
}))

// Note: Vue reactivity mock removed - was interfering with component tests
// ref and computed should use actual Vue implementation for proper rendering
