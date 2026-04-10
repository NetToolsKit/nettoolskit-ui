/**
 * Landing page/main module.
 */

import { createApp, defineAsyncComponent } from 'vue'
import {
  ClosePopup,
  QAvatar,
  QBadge,
  QBanner,
  QBtn,
  QCard,
  QCardActions,
  QCardSection,
  QCheckbox,
  QChip,
  QDate,
  QDrawer,
  QExpansionItem,
  QForm,
  QHeader,
  QIcon,
  QInput,
  QItem,
  QItemLabel,
  QItemSection,
  QLayout,
  QList,
  QMenu,
  QPage,
  QPageContainer,
  QPopupProxy,
  QScrollArea,
  QSelect,
  QSeparator,
  QSpace,
  QTab,
  QTabPanel,
  QTabPanels,
  QTabs,
  QTime,
  QToggle,
  QToolbar,
  QToolbarTitle,
  QTooltip,
  Quasar,
  Ripple,
} from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import { createTemplateRuntimeRouter } from '../src/templates/runtime'

// NetToolsKit style tokens
import '../src/styles/tokens.scss'
import '../src/styles/global.scss'

// Route-mode async loading keeps catalog, landing, CMS, samples, and template bundles split at runtime.
const LandingApp = defineAsyncComponent(() => import('./LandingPublicApp'))
const ReferenceCatalogApp = defineAsyncComponent(() => import('./ReferenceCatalogApp.vue'))
const ReferenceSamplesApp = defineAsyncComponent(() => import('./ReferenceSamplesApp.vue'))
const CmsApp = defineAsyncComponent(() => import('./CmsApp.vue'))
const TemplateShowcaseApp = defineAsyncComponent(() => import('./TemplateShowcaseApp.vue'))
const TemplateRuntimeApp = defineAsyncComponent(() => import('../src/templates/runtime/TemplateRuntimeApp.vue'))

const searchParams = new URLSearchParams(window.location.search)
const isLandingMode = searchParams.get('landing') === '1'
const isCmsMode = searchParams.get('cms') === '1'
const isSamplesMode = searchParams.get('samples') === '1'
const isTemplateMode = searchParams.get('templates') === '1'
const isTemplateRuntimeMode = searchParams.get('template-runtime') === '1'

const RootComponent = isCmsMode
  ? CmsApp
  : isTemplateRuntimeMode
    ? TemplateRuntimeApp
    : isSamplesMode
      ? ReferenceSamplesApp
      : isTemplateMode
      ? TemplateShowcaseApp
      : isLandingMode
        ? LandingApp
        : ReferenceCatalogApp

const app = createApp(RootComponent)
const templateRuntimeRouter = isTemplateRuntimeMode
  ? createTemplateRuntimeRouter()
  : null

app.use(Quasar, {
  plugins: {},
  components: {
    QAvatar,
    QBadge,
    QBanner,
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QCheckbox,
    QChip,
    QDate,
    QDrawer,
    QExpansionItem,
    QForm,
    QHeader,
    QIcon,
    QInput,
    QItem,
    QItemLabel,
    QItemSection,
    QLayout,
    QList,
    QMenu,
    QPage,
    QPageContainer,
    QPopupProxy,
    QScrollArea,
    QSelect,
    QSeparator,
    QSpace,
    QTab,
    QTabPanel,
    QTabPanels,
    QTabs,
    QTime,
    QToggle,
    QToolbar,
    QToolbarTitle,
    QTooltip,
  },
  directives: {
    Ripple,
    ClosePopup,
  },
})

if (templateRuntimeRouter) {
  app.use(templateRuntimeRouter)
}

app.mount('#app')
