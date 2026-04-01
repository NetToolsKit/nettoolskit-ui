import { describe, expect, it } from 'vitest'

import {
  createTemplateRuntimeRoutes,
  templateRuntimeMenuItems,
} from '../../../src/templates/runtime/router'

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

    expect(dashboardItem?.routeName).toBe('TemplateRuntimeDashboard')
    expect(knowledgeItem?.routeName).toBe('TemplateRuntimeKnowledge')
    expect(knowledgeItem?.children?.some(child => child.routeName === 'TemplateRuntimeKnowledgeChat')).toBe(true)
  })
})