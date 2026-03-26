import type { TemplateCatalogEntry } from './contracts'
import { featureTemplateCatalog } from './features'
import { layoutTemplateCatalog } from './layouts'
import { navigationTemplateCatalog } from './navigation'
import { pageTemplateCatalog } from './pages'
import { scaffoldTemplateCatalog } from './scaffolding'
import { styleTemplateCatalog } from './styles'

export const templateCatalogRegistry: TemplateCatalogEntry[] = [
  ...layoutTemplateCatalog,
  ...navigationTemplateCatalog,
  ...pageTemplateCatalog,
  ...featureTemplateCatalog,
  ...styleTemplateCatalog,
  ...scaffoldTemplateCatalog,
]

export function getTemplateCatalogByArea(area: TemplateCatalogEntry['area']): TemplateCatalogEntry[] {
  return templateCatalogRegistry.filter(entry => entry.area === area)
}

export function getTemplateCatalogByStatus(
  status: TemplateCatalogEntry['status']
): TemplateCatalogEntry[] {
  return templateCatalogRegistry.filter(entry => entry.status === status)
}