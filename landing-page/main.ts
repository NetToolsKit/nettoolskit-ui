import { createApp, defineAsyncComponent } from 'vue'
import { Quasar } from 'quasar'
import * as QuasarExports from 'quasar'
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

const quasarComponents = Object.fromEntries(
  Object.entries(QuasarExports).filter(([name]) => name.startsWith('Q'))
)

app.use(Quasar, {
  plugins: {},
  components: quasarComponents as never
})

app.mount('#app')