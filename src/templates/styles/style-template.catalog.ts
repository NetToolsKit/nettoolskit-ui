import { createTemplateCatalogEntry, type TemplateCatalogEntry } from '../contracts'

export const styleTemplateCatalog: TemplateCatalogEntry[] = [
  createTemplateCatalogEntry({
    id: 'style-reference-bridge',
    area: 'style',
    title: 'Reference Style Bridge',
    description: 'Tokenized style bridge to align template surfaces with validated reference direction.',
    targetPath: 'src/templates/styles/reference-app-bridge.scss',
    status: 'in_progress',
    customizableScopes: ['theme', 'content', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/css/app.scss',
  }),
]