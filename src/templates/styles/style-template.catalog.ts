import { createTemplateCatalogEntry, type TemplateCatalogEntry } from '../contracts'

export const styleTemplateCatalog: TemplateCatalogEntry[] = [
  createTemplateCatalogEntry({
    id: 'style-reference-bridge',
    area: 'style',
    title: 'Reference Style Bridge',
    description: 'Tokenized style bridge to align template surfaces with validated reference direction.',
    targetPath: 'src/templates/styles/reference-app-bridge.scss',
    status: 'ready',
    customizableScopes: ['theme', 'content', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/css/app.scss',
  }),
  createTemplateCatalogEntry({
    id: 'style-cms-authoring-reference',
    area: 'style',
    title: 'CMS Authoring Reference Shell',
    description: 'Shared CMS authoring shell CSS for workbench chrome, review surfaces, builders, and editor rails.',
    targetPath: 'src/templates/styles/cms-authoring-reference.css',
    status: 'ready',
    customizableScopes: ['theme', 'content', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: 'landing-page/CmsApp.vue + .temp/reference/src/css/app.scss',
  }),
]