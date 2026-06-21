import { createApp, type App, type Component } from 'vue'
import {
  ClosePopup,
  Dark,
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
  QDialog,
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
  QSkeleton,
  QSpinner,
  QSpinnerDots,
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

import '../../src/styles/tokens.scss'
import '../../src/styles/themes.css'
import '../../src/styles/global.scss'

/**
 * Mounts one samples runtime entry with the shared Quasar registry and style tokens.
 */
export function mountSamplesHost(
  rootComponent: Component,
  configureApp?: (app: App) => void
): App {
  const app = createApp(rootComponent)

  app.use(Quasar, {
    plugins: {
      Dark,
    },
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
      QDialog,
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
      QSkeleton,
      QSpinner,
      QSpinnerDots,
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

  configureApp?.(app)
  app.mount('#app')

  return app
}
