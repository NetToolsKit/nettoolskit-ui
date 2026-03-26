import { createTemplateCatalogEntry, type TemplateCatalogEntry } from '../contracts'

export const scaffoldTemplateCatalog: TemplateCatalogEntry[] = [
  createTemplateCatalogEntry({
    id: 'scaffold-router',
    area: 'scaffolding',
    title: 'Router Scaffold Template',
    description: 'Template-aware route registration scaffold for layout/page templates.',
    targetPath: 'src/templates/scaffolding/router-template.ts',
    status: 'planned',
    customizableScopes: ['navigation', 'behavior', 'testing'],
    sourceReferencePath: '.temp/reference/src/router/routes.ts',
  }),
  createTemplateCatalogEntry({
    id: 'scaffold-menu',
    area: 'scaffolding',
    title: 'Menu Constants Scaffold Template',
    description: 'Template-ready menu contract scaffold for horizontal and vertical navigation.',
    targetPath: 'src/templates/scaffolding/menu.constants.template.ts',
    status: 'planned',
    customizableScopes: ['navigation', 'content', 'testing'],
    sourceReferencePath: '.temp/reference/src/shared/constants/menu.constants.ts',
  }),
  createTemplateCatalogEntry({
    id: 'scaffold-layout-store',
    area: 'scaffolding',
    title: 'Layout State Scaffold Template',
    description: 'Template state scaffold for drawer/header/menu mode behavior.',
    targetPath: 'src/templates/scaffolding/layout-store.template.ts',
    status: 'planned',
    customizableScopes: ['behavior', 'data', 'testing'],
    sourceReferencePath: '.temp/reference/src/stores/layout-store.ts',
  }),
  createTemplateCatalogEntry({
    id: 'scaffold-notification',
    area: 'scaffolding',
    title: 'Notification Scaffold Template',
    description: 'Template-safe notification bridge scaffold for reusable page/feature templates.',
    targetPath: 'src/templates/scaffolding/notification.template.ts',
    status: 'planned',
    customizableScopes: ['behavior', 'content', 'testing'],
    sourceReferencePath: '.temp/reference/src/shared/utils/notification.ts',
  }),
]