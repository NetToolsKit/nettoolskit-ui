/**
 * Menu scaffold helpers.
 * Produces template-ready menu constants from typed definitions or route nodes.
 */

import type {
  TemplateMenuChildItem,
  TemplateMenuItem,
} from '../navigation/menu-template.types'
import type {
  TemplateScaffoldRouteNode,
  TemplateScaffoldRouteMenuOptions,
} from './router-template'

export interface TemplateScaffoldMenuDefinition {
  id: string
  text: string
  icon?: string
  to?: string
  routeName?: string
  disabled?: boolean
  badge?: string | number
  stickyBottom?: boolean
  order?: number
  children?: TemplateScaffoldMenuDefinition[]
}

export interface TemplateScaffoldMenuBuildOptions {
  defaultIcon?: string
}

/**
 * Converts scaffold menu definitions into `TemplateMenuItem[]`.
 */
export function createTemplateMenuConstants(
  definitions: TemplateScaffoldMenuDefinition[]
): TemplateMenuItem[] {
  return [...definitions]
    .sort(sortByOrder)
    .map(definition => mapDefinitionToMenuItem(definition))
}

/**
 * Derives menu constants from scaffold route nodes.
 */
export function createTemplateMenuFromScaffoldRoutes(
  routes: TemplateScaffoldRouteNode[],
  options: TemplateScaffoldMenuBuildOptions = {}
): TemplateMenuItem[] {
  const defaultIcon = options.defaultIcon ?? 'radio_button_unchecked'
  const items: Array<{ order: number; item: TemplateMenuItem }> = []

  routes.forEach(route => {
    const mapped = mapRouteNodeToMenuItem(route, '', defaultIcon)
    if (mapped) {
      items.push(mapped)
    }
  })

  return items
    .sort((left, right) => left.order - right.order)
    .map(entry => entry.item)
}

function mapDefinitionToMenuItem(definition: TemplateScaffoldMenuDefinition): TemplateMenuItem {
  return {
    id: definition.id,
    text: definition.text,
    icon: definition.icon || 'radio_button_unchecked',
    to: definition.to,
    routeName: definition.routeName,
    disabled: definition.disabled,
    badge: definition.badge,
    stickyBottom: definition.stickyBottom,
    children: mapMenuDefinitionChildren(definition.children),
  }
}

function mapMenuDefinitionChildren(
  children: TemplateScaffoldMenuDefinition[] | undefined
): TemplateMenuChildItem[] | null {
  if (!children || children.length === 0) {
    return null
  }

  return [...children]
    .sort(sortByOrder)
    .map(child => ({
      id: child.id,
      text: child.text,
      icon: child.icon,
      to: child.to,
      routeName: child.routeName,
      disabled: child.disabled,
    }))
}

function mapRouteNodeToMenuItem(
  route: TemplateScaffoldRouteNode,
  parentPath: string,
  defaultIcon: string
): { order: number; item: TemplateMenuItem } | null {
  const menu = route.menu
  if (menu === false) {
    return null
  }

  const meta = normalizeRouteMenuOptions(menu)
  const id = meta.id || route.id
  const text = meta.text || route.name
  const icon = meta.icon || defaultIcon
  const to = resolveRoutePath(parentPath, route.path)
  const children = mapRouteChildren(route.children, to)

  return {
    order: meta.order ?? Number.MAX_SAFE_INTEGER,
    item: {
      id,
      text,
      icon,
      to,
      routeName: route.name,
      disabled: meta.disabled,
      badge: meta.badge,
      stickyBottom: meta.stickyBottom,
      children,
    },
  }
}

function mapRouteChildren(
  children: TemplateScaffoldRouteNode[] | undefined,
  parentPath: string
): TemplateMenuChildItem[] | null {
  if (!children || children.length === 0) {
    return null
  }

  const mapped = children
    .filter(child => child.menu !== false)
    .sort((left, right) => {
      const leftOrder = normalizeRouteMenuOptions(left.menu).order ?? Number.MAX_SAFE_INTEGER
      const rightOrder = normalizeRouteMenuOptions(right.menu).order ?? Number.MAX_SAFE_INTEGER
      return leftOrder - rightOrder
    })
    .map(child => {
      const menu = normalizeRouteMenuOptions(child.menu)
      return {
        id: menu.id || child.id,
        text: menu.text || child.name,
        icon: menu.icon,
        to: resolveRoutePath(parentPath, child.path),
        routeName: child.name,
        disabled: menu.disabled,
      } satisfies TemplateMenuChildItem
    })

  return mapped.length > 0 ? mapped : null
}

function normalizeRouteMenuOptions(
  menu: TemplateScaffoldRouteMenuOptions | false | undefined
): TemplateScaffoldRouteMenuOptions {
  if (!menu) {
    return {}
  }

  return menu
}

function resolveRoutePath(parentPath: string, childPath: string): string {
  if (childPath.startsWith('/')) {
    return childPath
  }

  if (!parentPath || parentPath === '/') {
    return `/${childPath}`.replace(/\/+/g, '/')
  }

  return `${parentPath}/${childPath}`.replace(/\/+/g, '/')
}

function sortByOrder(
  left: TemplateScaffoldMenuDefinition,
  right: TemplateScaffoldMenuDefinition
): number {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER
  return leftOrder - rightOrder
}