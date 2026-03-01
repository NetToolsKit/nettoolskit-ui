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

// NetToolsKit Design System
import '../src/styles/tokens.scss'
import '../src/styles/design-system.scss'
import '../src/styles/global.scss'

// Route-mode async loading keeps landing and CMS bundles split at runtime.
const LandingApp = defineAsyncComponent(() => import('./App.vue'))
const CmsApp = defineAsyncComponent(() => import('./CmsApp.vue'))

const searchParams = new URLSearchParams(window.location.search)
const isCmsMode = searchParams.get('cms') === '1'

const RootComponent = isCmsMode
  ? CmsApp
  : LandingApp

const app = createApp(RootComponent)

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

app.mount('#app')