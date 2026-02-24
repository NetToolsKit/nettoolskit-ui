import { createApp } from 'vue'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

// NetToolsKit Design System
import '../src/styles/tokens.scss'
import '../src/styles/design-system.scss'
import '../src/styles/global.scss'

import AppDev from './App-Dev.vue'

const app = createApp(AppDev)

app.use(Quasar, {
  plugins: {}
})

app.mount('#app')
