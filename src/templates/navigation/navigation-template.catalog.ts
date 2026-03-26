import { createTemplateCatalogEntry, type TemplateCatalogEntry } from '../contracts'

export const navigationTemplateCatalog: TemplateCatalogEntry[] = [
  createTemplateCatalogEntry({
    id: 'nav-menu-link',
    area: 'navigation',
    title: 'Menu Link Template',
    description: 'Sidebar navigation item template with active state and submenu behavior.',
    targetPath: 'src/templates/navigation/MenuLinkTemplate.vue',
    status: 'ready',
    customizableScopes: ['theme', 'navigation', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/components/MenuLink.vue',
  }),
  createTemplateCatalogEntry({
    id: 'nav-horizontal-link',
    area: 'navigation',
    title: 'Horizontal Menu Link Template',
    description: 'Top navigation menu item template for horizontal mode.',
    targetPath: 'src/templates/navigation/HorizontalMenuLinkTemplate.vue',
    status: 'ready',
    customizableScopes: ['theme', 'navigation', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/components/HorizontalMenuLink.vue',
  }),
  createTemplateCatalogEntry({
    id: 'nav-user-menu',
    area: 'navigation',
    title: 'User Menu Template',
    description: 'User profile menu template with layout toggles and account actions.',
    targetPath: 'src/templates/navigation/UserMenuTemplate.vue',
    status: 'ready',
    customizableScopes: ['theme', 'content', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/components/UserMenu.vue',
  }),
  createTemplateCatalogEntry({
    id: 'nav-breadcrumb',
    area: 'navigation',
    title: 'Breadcrumb Template',
    description: 'Breadcrumb template with route mapping contract and reusable rendering.',
    targetPath: 'src/templates/navigation/AppBreadcrumbTemplate.vue',
    status: 'ready',
    customizableScopes: ['theme', 'content', 'navigation', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/shared/components/common/AppBreadcrumb.vue',
  }),
]