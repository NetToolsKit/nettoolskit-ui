import { createTemplateCatalogEntry, type TemplateCatalogEntry } from '../contracts'

export const pageTemplateCatalog: TemplateCatalogEntry[] = [
  createTemplateCatalogEntry({
    id: 'page-dashboard',
    area: 'page',
    title: 'Dashboard Template',
    description: 'Dashboard page archetype with cards, charts and responsive sections.',
    targetPath: 'src/templates/pages/DashboardTemplate.vue',
    status: 'planned',
    customizableScopes: ['theme', 'content', 'data', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/pages/PipelinePage.vue',
  }),
  createTemplateCatalogEntry({
    id: 'page-profile',
    area: 'page',
    title: 'Profile Template',
    description: 'Profile page archetype with account and preferences surfaces.',
    targetPath: 'src/templates/pages/ProfileTemplate.vue',
    status: 'planned',
    customizableScopes: ['theme', 'content', 'data', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/pages/ProfilePage.vue',
  }),
  createTemplateCatalogEntry({
    id: 'page-placeholder',
    area: 'page',
    title: 'Placeholder Template',
    description: 'Placeholder page archetype for pending modules with status messaging.',
    targetPath: 'src/templates/pages/PlaceholderTemplate.vue',
    status: 'planned',
    customizableScopes: ['theme', 'content', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/pages/PlaceholderPage.vue',
  }),
  createTemplateCatalogEntry({
    id: 'page-not-found',
    area: 'page',
    title: 'Error Not Found Template',
    description: 'Not found page archetype with safe navigation recovery actions.',
    targetPath: 'src/templates/pages/ErrorNotFoundTemplate.vue',
    status: 'planned',
    customizableScopes: ['theme', 'content', 'navigation', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/pages/ErrorNotFound.vue',
  }),
]