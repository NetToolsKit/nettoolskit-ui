import { beforeEach, describe, expect, it } from 'vitest'

import {
  getTemplateRuntimeDashboardSnapshot,
  resetTemplateRuntimeData,
  templateRuntimeData,
} from '../../../src/templates/runtime/runtime-data.template'

describe('template runtime data store', () => {
  beforeEach(() => {
    localStorage.clear()
    resetTemplateRuntimeData()
  })

  it('hydrates with seeded clients, orders and workspace settings', () => {
    expect(templateRuntimeData.state.clients.length).toBeGreaterThan(0)
    expect(templateRuntimeData.state.orders.length).toBeGreaterThan(0)
    expect(templateRuntimeData.state.settings.workspaceName).toBe('Atlas Flow')
    expect(templateRuntimeData.clientRecords.value.length).toBe(templateRuntimeData.state.clients.length)
    expect(templateRuntimeData.orderRecords.value.length).toBe(templateRuntimeData.state.orders.length)
  })

  it('creates clients and orders while keeping dashboard derivations in sync', () => {
    const baselineClients = templateRuntimeData.state.clients.length
    const baselineOrders = templateRuntimeData.state.orders.length

    templateRuntimeData.createClient()
    templateRuntimeData.createOrder()

    const snapshot = getTemplateRuntimeDashboardSnapshot()

    expect(templateRuntimeData.state.clients.length).toBe(baselineClients + 1)
    expect(templateRuntimeData.state.orders.length).toBe(baselineOrders + 1)
    expect(snapshot.metrics[0]?.value).toBe(templateRuntimeData.state.orders.length)
    expect(snapshot.chips[0]?.text).toContain(String(templateRuntimeData.state.clients.length))
  })

  it('persists settings and bulk order status changes', () => {
    const selectedIds = templateRuntimeData.state.orders.slice(0, 2).map(order => order.id)

    templateRuntimeData.updateSettings({
      workspaceName: 'Tenant Delta',
      compactTables: true,
    })
    templateRuntimeData.bulkUpdateOrderStatus(selectedIds, 'completed')

    expect(templateRuntimeData.workspaceName.value).toBe('Tenant Delta')
    expect(templateRuntimeData.state.settings.compactTables).toBe(true)
    expect(
      templateRuntimeData.state.orders
        .filter(order => selectedIds.includes(order.id))
        .every(order => order.status === 'completed')
    ).toBe(true)

    const raw = localStorage.getItem('ntk_template_runtime_data_v1') ?? ''
    expect(raw).toContain('Tenant Delta')
  })
})
