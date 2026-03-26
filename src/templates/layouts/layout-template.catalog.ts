import { createTemplateCatalogEntry, type TemplateCatalogEntry } from '../contracts'

export const layoutTemplateCatalog: TemplateCatalogEntry[] = [
  createTemplateCatalogEntry({
    id: 'layout-main',
    area: 'layout',
    title: 'Main Layout Template',
    description: 'Application shell with header, drawer, horizontal/vertical navigation support.',
    targetPath: 'src/templates/layouts/MainLayoutTemplate.vue',
    status: 'ready',
    customizableScopes: ['theme', 'navigation', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/layouts/MainLayoutHorizontal.vue',
  }),
  createTemplateCatalogEntry({
    id: 'layout-auth',
    area: 'layout',
    title: 'Auth Layout Template',
    description: 'Authentication-focused layout wrapper for login/recovery flows.',
    targetPath: 'src/templates/layouts/AuthLayoutTemplate.vue',
    status: 'ready',
    customizableScopes: ['theme', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/layouts/AuthLayout.vue',
  }),
]