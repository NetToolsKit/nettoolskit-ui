/**
 * Router scaffold helpers.
 * Provides typed, template-aware route composition for fast app bootstrap.
 */

import type { RouteRecordRaw } from 'vue-router'

export type TemplateScaffoldLayoutId = 'main' | 'auth' | 'blank' | string
type TemplateScaffoldRouteComponent = NonNullable<RouteRecordRaw['component']>

export interface TemplateScaffoldRouteMenuOptions {
  id?: string
  text?: string
  icon?: string
  badge?: string | number
  stickyBottom?: boolean
  disabled?: boolean
  order?: number
}

export interface TemplateScaffoldRouteNode {
  id: string
  path: string
  name: string
  component: TemplateScaffoldRouteComponent
  layoutId?: TemplateScaffoldLayoutId
  props?: RouteRecordRaw['props']
  redirect?: RouteRecordRaw['redirect']
  alias?: RouteRecordRaw['alias']
  menu?: TemplateScaffoldRouteMenuOptions | false
  meta?: Record<string, unknown>
  children?: TemplateScaffoldRouteNode[]
}

export interface TemplateScaffoldLayoutShell {
  id: TemplateScaffoldLayoutId
  path: string
  name: string
  component: TemplateScaffoldRouteComponent
  meta?: Record<string, unknown>
}

export interface TemplateRouteScaffoldOptions {
  layouts: TemplateScaffoldLayoutShell[]
  routes: TemplateScaffoldRouteNode[]
  defaultLayoutId?: TemplateScaffoldLayoutId
  appendCatchAll?: boolean
  catchAllRedirectName?: string
}

/**
 * Creates one route list grouped by layout shells.
 */
export function createTemplateRouteScaffold(options: TemplateRouteScaffoldOptions): RouteRecordRaw[] {
  const layouts = [...options.layouts]
  if (layouts.length === 0) {
    return []
  }

  const defaultLayoutId = options.defaultLayoutId ?? layouts[0]?.id
  const byLayout = new Map<TemplateScaffoldLayoutId, RouteRecordRaw[]>()
  layouts.forEach(layout => byLayout.set(layout.id, []))

  options.routes.forEach(route => {
    const layoutId = route.layoutId ?? defaultLayoutId
    const fallbackLayoutId = byLayout.has(layoutId) ? layoutId : defaultLayoutId
    const collection = byLayout.get(fallbackLayoutId) ?? byLayout.get(defaultLayoutId)

    if (!collection) {
      return
    }

    collection.push(mapNodeToRoute(route))
  })

  const records: RouteRecordRaw[] = layouts.map(layout => ({
    path: layout.path,
    name: layout.name,
    component: layout.component,
    meta: { ...(layout.meta || {}) },
    children: byLayout.get(layout.id) || [],
  }))

  if (options.appendCatchAll && options.catchAllRedirectName) {
    records.push({
      path: '/:pathMatch(.*)*',
      redirect: { name: options.catchAllRedirectName },
      meta: {
        scaffold: {
          kind: 'catch-all',
        },
      },
    })
  }

  return records
}

/**
 * Builds default shell routes for common app structures.
 */
export function createDefaultTemplateLayoutShells(
  mainLayoutComponent: TemplateScaffoldRouteComponent,
  authLayoutComponent: TemplateScaffoldRouteComponent,
  blankLayoutComponent?: TemplateScaffoldRouteComponent
): TemplateScaffoldLayoutShell[] {
  const shells: TemplateScaffoldLayoutShell[] = [
    {
      id: 'main',
      path: '/',
      name: 'template-main-layout',
      component: mainLayoutComponent,
    },
    {
      id: 'auth',
      path: '/auth',
      name: 'template-auth-layout',
      component: authLayoutComponent,
    },
  ]

  if (blankLayoutComponent) {
    shells.push({
      id: 'blank',
      path: '/_',
      name: 'template-blank-layout',
      component: blankLayoutComponent,
    })
  }

  return shells
}

function mapNodeToRoute(node: TemplateScaffoldRouteNode): RouteRecordRaw {
  const route = {
    path: node.path,
    name: node.name,
    component: node.component,
    meta: {
      ...(node.meta || {}),
      scaffold: {
        routeId: node.id,
        menu: node.menu ?? undefined,
      },
    },
  }

  if (node.props !== undefined) {
    Object.assign(route, { props: node.props })
  }

  if (node.redirect !== undefined) {
    Object.assign(route, { redirect: node.redirect })
  }

  if (node.alias !== undefined) {
    Object.assign(route, { alias: node.alias })
  }

  if ((node.children?.length ?? 0) > 0) {
    Object.assign(route, {
      children: node.children?.map(child => mapNodeToRoute(child)),
    })
  }

  return route as RouteRecordRaw
}