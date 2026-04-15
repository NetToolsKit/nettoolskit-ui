import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  createTemplateRuntimeRoutes,
  templateRuntimeMenuItems,
} from '../../../src/templates/runtime/router'

function readRouterSource(): string {
  return readFileSync(resolve(process.cwd(), 'src/templates/runtime/router.ts'), 'utf8')
}

describe('template runtime router', () => {
  it('builds scaffolded layout routes with a catch-all redirect', () => {
    const routes = createTemplateRuntimeRoutes()

    expect(routes.some(route => route.name === 'template-main-layout')).toBe(true)
    expect(routes.some(route => route.name === 'template-auth-layout')).toBe(true)
    expect(routes.some(route => route.name === 'template-blank-layout')).toBe(true)
    expect(routes.some(route => route.path === '/:pathMatch(.*)*')).toBe(true)
  })

  it('derives menu constants from typed scaffold route nodes', () => {
    const dashboardItem = templateRuntimeMenuItems.find(item => item.id === 'dashboard')
    const knowledgeItem = templateRuntimeMenuItems.find(item => item.id === 'knowledge')
    const settingsItem = templateRuntimeMenuItems.find(item => item.id === 'settings')
    const profileItem = templateRuntimeMenuItems.find(item => item.id === 'profile')

    expect(dashboardItem?.routeName).toBe('TemplateRuntimeDashboard')
    expect(knowledgeItem?.routeName).toBe('TemplateRuntimeKnowledge')
    expect(knowledgeItem?.children?.some(child => child.routeName === 'TemplateRuntimeKnowledgeChat')).toBe(true)
    expect(settingsItem?.stickyBottom).toBe(true)
    expect(profileItem).toBeUndefined()
  })

  it('registers all approved runtime route names inside the scaffold', () => {
    const routes = createTemplateRuntimeRoutes()
    const routeNames = new Set<string>()
    const visit = (records: any[]) => {
      for (const record of records) {
        if (typeof record.name === 'string') {
          routeNames.add(record.name)
        }
        if (Array.isArray(record.children)) {
          visit(record.children)
        }
      }
    }

    visit(routes as any[])

    expect(routeNames.has('TemplateRuntimeDashboard')).toBe(true)
    expect(routeNames.has('TemplateRuntimeClients')).toBe(true)
    expect(routeNames.has('TemplateRuntimeOrders')).toBe(true)
    expect(routeNames.has('TemplateRuntimeKnowledge')).toBe(true)
    expect(routeNames.has('TemplateRuntimeKnowledgeChat')).toBe(true)
    expect(routeNames.has('TemplateRuntimeSettings')).toBe(true)
    expect(routeNames.has('TemplateRuntimeProfile')).toBe(true)
    expect(routeNames.has('TemplateRuntimeLogin')).toBe(true)
    expect(routeNames.has('TemplateRuntimeNotFound')).toBe(true)
  })

  it('keeps the approved runtime free from placeholder routes and hash navigation', () => {
    const source = readRouterSource()

    expect(source).not.toContain('PlaceholderTemplate')
    expect(source).not.toContain('fakeDashboard')
    expect(source).not.toContain('window.location.hash')
    expect(source).not.toContain("statusLabel: 'Em breve'")
  })
})
