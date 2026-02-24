import { createApp } from 'vue'
import { Quasar, Dark } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

// NetToolsKit Design System
import '../src/styles/tokens.scss'
import '../src/styles/design-system.scss'
import '../src/styles/global.scss'

import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
  plugins: {}
})

// Tema dark por padrão (NetToolsKit style)
Dark.set(true)

app.mount('#app')
