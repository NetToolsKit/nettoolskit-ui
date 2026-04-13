/**
 * Samples runtime/main module.
 */

import { defineAsyncComponent } from 'vue'
import { createTemplateRuntimeRouter, bootRuntimeAuth } from '../src/templates/runtime'
import { mountSamplesHost } from './shared/mountSamplesHost'

// Route-mode async loading keeps the public original sample, legacy landing, and template runtime split.
const LandingApp = defineAsyncComponent(() => import('../landing-page/LandingPublicApp'))
const OriginalReferenceApp = defineAsyncComponent(() => import('./original-reference/OriginalReferenceApp.vue'))
const TemplateRuntimeApp = defineAsyncComponent(() => import('../src/templates/runtime/TemplateRuntimeApp.vue'))

const searchParams = new URLSearchParams(window.location.search)
const isLandingMode = searchParams.get('landing') === '1'
const isTemplateRuntimeMode = searchParams.get('template-runtime') === '1'

const RootComponent = isTemplateRuntimeMode
  ? TemplateRuntimeApp
  : isLandingMode
    ? LandingApp
    : OriginalReferenceApp

const templateRuntimeRouter = isTemplateRuntimeMode
  ? createTemplateRuntimeRouter()
  : null

mountSamplesHost(RootComponent, app => {
  if (templateRuntimeRouter) {
    bootRuntimeAuth()
    app.use(templateRuntimeRouter)
  }
})
