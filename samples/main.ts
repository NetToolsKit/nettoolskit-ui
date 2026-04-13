/**
 * Samples runtime/main module.
 */

import { defineAsyncComponent } from 'vue'
import { createTemplateRuntimeRouter } from '../src/templates/runtime'
import { mountSamplesHost } from './shared/mountSamplesHost'

// Route-mode async loading keeps the public samples host, legacy landing, and template runtime split at runtime.
const LandingApp = defineAsyncComponent(() => import('../landing-page/LandingPublicApp'))
const ReferenceCatalogApp = defineAsyncComponent(() => import('./ReferenceCatalogApp.vue'))
const OriginalReferenceApp = defineAsyncComponent(() => import('./original-reference/OriginalReferenceApp.vue'))
const ReferenceSamplesApp = defineAsyncComponent(() => import('./ReferenceSamplesApp.vue'))
const TemplateShowcaseApp = defineAsyncComponent(() => import('./TemplateShowcaseApp.vue'))
const TemplateRuntimeApp = defineAsyncComponent(() => import('../src/templates/runtime/TemplateRuntimeApp.vue'))

const searchParams = new URLSearchParams(window.location.search)
const isLandingMode = searchParams.get('landing') === '1'
const isOriginalMode = searchParams.get('original') === '1'
const isSamplesMode = searchParams.get('samples') === '1'
const isTemplateMode = searchParams.get('templates') === '1'
const isTemplateRuntimeMode = searchParams.get('template-runtime') === '1'

const RootComponent = isTemplateRuntimeMode
  ? TemplateRuntimeApp
  : isOriginalMode
    ? OriginalReferenceApp
  : isSamplesMode
    ? ReferenceSamplesApp
    : isTemplateMode
      ? TemplateShowcaseApp
      : isLandingMode
        ? LandingApp
        : ReferenceCatalogApp

const templateRuntimeRouter = isTemplateRuntimeMode
  ? createTemplateRuntimeRouter()
  : null

mountSamplesHost(RootComponent, app => {
  if (templateRuntimeRouter) {
    app.use(templateRuntimeRouter)
  }
})
