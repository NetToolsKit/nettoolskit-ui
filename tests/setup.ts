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
  'class',
  'style',
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
  'useChips',
  'options',
  'useInput',
  'optionValue',
  'optionLabel',
  'hideSelected',
  'behavior',
  'filterFn',
  'noOptionsText',
  'maxValues',
  'emitValue',
  'mapOptions',
  'clearable',
  'maxlength',
  'counter',
  'mask',
  'autofocus',
  'hint',
  'rows',
  'autogrow',
  'error',
  'errorMessage',
  'bottomSlots',
  'stackLabel',
  'withSeconds',
  'format24h',
  'width',
  'mini',
  'miniWidth',
  'breakpoint',
  'floating',
  'textColor',
  'exact',
  'side',
  'caption'
] as const

const createQuasarProps = () =>
  Object.fromEntries(QUASAR_PROP_NAMES.map((propName) => [propName, { type: null as any, required: false }]))

const createQuasarStub = (name: string, tag = 'div', fixedAttrs: Record<string, unknown> = {}) =>
  defineComponent({
    name,
    props: createQuasarProps(),
    setup(props, { slots, attrs }) {
      return () => {
        const renderedSlots = Object.values(slots).flatMap((slotFn) => {
          if (!slotFn) return []
          const content = slotFn({})
          return Array.isArray(content) ? content : [content]
        })

        const domProps: Record<string, unknown> = { 'data-stub': name, ...fixedAttrs, ...attrs }
        Object.entries(props).forEach(([key, value]) => {
          if (value !== undefined) {
            domProps[key] = value
          }
        })

        const mergedClass = [fixedAttrs.class, attrs.class, props.class].filter(Boolean)
        if (mergedClass.length > 0) {
          domProps.class = mergedClass
        }

        const labelText = props.label !== undefined && props.label !== null ? [String(props.label)] : []
        return h(tag, domProps, [...renderedSlots, ...labelText])
      }
    }
  })

const QBtn = createQuasarStub('QBtn', 'button')
const QCard = createQuasarStub('QCard')
const QCardSection = createQuasarStub('QCardSection')
const QIcon = defineComponent({
  name: 'QIcon',
  props: createQuasarProps(),
  setup(props, { slots, attrs }) {
    return () => {
      const renderedSlots = Object.values(slots).flatMap((slotFn) => {
        if (!slotFn) return []
        const content = slotFn({})
        return Array.isArray(content) ? content : [content]
      })

      const iconAttrs: Record<string, unknown> = { ...attrs, 'data-stub': 'QIcon' }
      Object.entries(props).forEach(([key, value]) => {
        if (value !== undefined) {
          iconAttrs[key] = value
        }
      })

      const attrClass = iconAttrs.class
      delete iconAttrs.class

      return h('i', { ...iconAttrs, class: ['q-icon', attrClass] }, renderedSlots)
    }
  }
})
const QInput = createQuasarStub('QInput')
const QSelect = createQuasarStub('QSelect')
const QTextarea = createQuasarStub('QTextarea')
const QDate = createQuasarStub('QDate')
const QTime = createQuasarStub('QTime')
const QPopupProxy = createQuasarStub('QPopupProxy')
const QMenu = createQuasarStub('QMenu')
const QHeader = createQuasarStub('QHeader', 'header')
const QFooter = createQuasarStub('QFooter', 'footer')
const QDrawer = createQuasarStub('QDrawer')
const QList = createQuasarStub('QList')
const QItem = createQuasarStub('QItem', 'div', { class: 'q-item' })
const QItemSection = createQuasarStub('QItemSection')
const QItemLabel = createQuasarStub('QItemLabel')
const QToolbar = createQuasarStub('QToolbar', 'div', { role: 'toolbar' })
const QToolbarTitle = createQuasarStub('QToolbarTitle')
const QSeparator = createQuasarStub('QSeparator')
const QSpace = createQuasarStub('QSpace')
const QBadge = createQuasarStub('QBadge')
const QAvatar = createQuasarStub('QAvatar', 'div', { class: 'q-avatar' })
const QTooltip = createQuasarStub('QTooltip')
const QScrollArea = createQuasarStub('QScrollArea')

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
    QItemLabel,
    QToolbar,
    QToolbarTitle,
    QSeparator,
    QSpace,
    QBadge,
    QAvatar,
    QTooltip,
    QScrollArea
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
  QItemLabel,
  QToolbar,
  QToolbarTitle,
  QSeparator,
  QSpace,
  QBadge,
  QAvatar,
  QTooltip,
  QScrollArea
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
