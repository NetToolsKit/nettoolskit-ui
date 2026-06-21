/**
 * Samples runtime/main module.
 */

import { defineAsyncComponent } from 'vue'
import { bootstrapThemeSwitcher } from '../src/composables/useThemeSwitcher'
import { createTemplateRuntimeRouter, bootRuntimeAuth } from '../src/templates/runtime'
import { mountSamplesHost } from './shared/mountSamplesHost'

// Route-mode async loading keeps the public original sample and template runtime split.
const OriginalReferenceApp = defineAsyncComponent(() => import('./original-reference/OriginalReferenceApp.vue'))
const TemplateRuntimeApp = defineAsyncComponent(() => import('../src/templates/runtime/TemplateRuntimeApp.vue'))

const searchParams = new URLSearchParams(window.location.search)
const isTemplateRuntimeMode = searchParams.get('template-runtime') === '1'

const RootComponent = isTemplateRuntimeMode
  ? TemplateRuntimeApp
  : OriginalReferenceApp

const templateRuntimeRouter = isTemplateRuntimeMode
  ? createTemplateRuntimeRouter()
  : null

mountSamplesHost(RootComponent, app => {
  bootstrapThemeSwitcher()

  if (templateRuntimeRouter) {
    bootRuntimeAuth()
    app.use(templateRuntimeRouter)
  }
})
