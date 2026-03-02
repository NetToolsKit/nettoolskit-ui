/**
 * Landing page/main original module.
 */

import { createApp } from 'vue'
import { Quasar, Dark } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

// NetToolsKit style tokens
import '../src/styles/tokens.scss'
import '../src/styles/global.scss'

import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
  plugins: {}
})

// Tema dark por padrão (NetToolsKit style)
Dark.set(true)

app.mount('#app')