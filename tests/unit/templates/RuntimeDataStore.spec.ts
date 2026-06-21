import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getTemplateRuntimeDashboardSnapshot,
  resetTemplateRuntimeData,
  templateRuntimeData,
} from '../../../src/templates/runtime/runtime-data.template'
import {
  cloneRuntimeSnapshot,
  createDefaultTemplateRuntimeData,
  nextTemplateRuntimeOrderNumber,
} from '../../../src/templates/runtime/runtime-factories.template'
import {
  loadTemplateRuntimeData,
  persistTemplateRuntimeData,
  TEMPLATE_RUNTIME_STORAGE_KEY,
} from '../../../src/templates/runtime/runtime-storage.template'

const FIXED_NOW = new Date('2026-04-16T12:00:00.000Z')

function readPersistedSnapshot() {
  return JSON.parse(localStorage.getItem(TEMPLATE_RUNTIME_STORAGE_KEY) ?? 'null')
}

describe('template runtime data store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)
    localStorage.clear()
    resetTemplateRuntimeData()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('supports client creation, duplication and status cycles across derived surfaces', () => {
    const baselineClients = templateRuntimeData.state.clients.length
    const baselineActive = templateRuntimeData.state.clients.filter(client => client.status === 'active').length
    const baselineOnboarding = templateRuntimeData.state.clients.filter(client => client.status === 'onboarding').length

    const created = templateRuntimeData.createClient()
    const duplicate = templateRuntimeData.duplicateClient('client-1')

    expect(created.owner).toBe(templateRuntimeData.state.settings.operatorName)
    expect(created.status).toBe('onboarding')
    expect(created.lastOrderAt).toBe(FIXED_NOW.toISOString())

    expect(duplicate).not.toBeNull()
    expect(duplicate).toMatchObject({
      name: 'Alfa Distribution Copy',
      status: 'onboarding',
    })
    expect(duplicate?.tags).toContain('copy')
    expect(templateRuntimeData.state.clients[0]?.id).toBe(duplicate?.id)
    expect(templateRuntimeData.clientRecords.value[0]?.id).toBe(duplicate?.id)

    expect(templateRuntimeData.cycleClientStatus(duplicate!.id)).toBe('active')
    expect(templateRuntimeData.cycleClientStatus(duplicate!.id)).toBe('inactive')
    expect(templateRuntimeData.cycleClientStatus(duplicate!.id)).toBe('active')

    const activeFilter = templateRuntimeData.clientFilters.value.find(filter => filter.id === 'active')
    const onboardingFilter = templateRuntimeData.clientFilters.value.find(filter => filter.id === 'onboarding')
    const totalMetric = templateRuntimeData.clientMetrics.value.find(metric => metric.id === 'clients-total')
    const activeMetric = templateRuntimeData.clientMetrics.value.find(metric => metric.id === 'clients-active')

    expect(templateRuntimeData.state.clients.length).toBe(baselineClients + 2)
    expect(activeFilter?.count).toBe(baselineActive + 1)
    expect(onboardingFilter?.count).toBe(baselineOnboarding + 1)
    expect(totalMetric?.value).toBe(baselineClients + 2)
    expect(activeMetric?.value).toBe(baselineActive + 1)

    const persisted = readPersistedSnapshot()
    expect(persisted.clients[0]).toMatchObject({
      id: duplicate?.id,
      status: 'active',
    })
    expect(persisted.clients[1]).toMatchObject({
      id: created.id,
      status: 'onboarding',
    })
  })

  it('keeps order filters, metrics and dashboard segments aligned after status mutations', () => {
    const created = templateRuntimeData.createOrder()
    const recycledCancelledOrder = templateRuntimeData.state.orders.find(order => order.status === 'cancelled')

    expect(created.number).toBe('ORD-1051')
    expect(created.clientId).toBe(templateRuntimeData.state.clients.find(client => client.status !== 'inactive')?.id)
    expect(templateRuntimeData.orderRecords.value[0]?.id).toBe(created.id)

    expect(templateRuntimeData.advanceOrderStatus(created.id)).toBe('in_progress')
    expect(templateRuntimeData.advanceOrderStatus(created.id)).toBe('completed')
    expect(templateRuntimeData.cancelOrder('order-2')).toBe('cancelled')
    expect(templateRuntimeData.advanceOrderStatus(recycledCancelledOrder!.id)).toBe('pending')
    templateRuntimeData.bulkUpdateOrderStatus([created.id, 'order-9'], 'completed')

    const pendingCount = templateRuntimeData.state.orders.filter(order => order.status === 'pending').length
    const inProgressCount = templateRuntimeData.state.orders.filter(order => order.status === 'in_progress').length
    const completedCount = templateRuntimeData.state.orders.filter(order => order.status === 'completed').length
    const cancelledCount = templateRuntimeData.state.orders.filter(order => order.status === 'cancelled').length

    const orderFilter = (id: string) => templateRuntimeData.orderFilters.value.find(filter => filter.id === id)?.count
    const orderMetric = (id: string) => templateRuntimeData.orderMetrics.value.find(metric => metric.id === id)?.value
    const dashboardMetric = (id: string) => templateRuntimeData.dashboardSnapshot.value.metrics.find(metric => metric.id === id)?.value
    const dashboardSegment = (id: string) =>
      templateRuntimeData.dashboardSnapshot.value.statusSegments.find(segment => segment.id === id)?.value

    expect(orderFilter('all')).toBe(templateRuntimeData.state.orders.length)
    expect(orderFilter('pending')).toBe(pendingCount)
    expect(orderFilter('in_progress')).toBe(inProgressCount)
    expect(orderFilter('completed')).toBe(completedCount)
    expect(orderFilter('cancelled')).toBe(cancelledCount)

    expect(orderMetric('orders-total')).toBe(templateRuntimeData.state.orders.length)
    expect(orderMetric('orders-open')).toBe(pendingCount + inProgressCount)

    expect(dashboardMetric('orders-total')).toBe(templateRuntimeData.state.orders.length)
    expect(dashboardMetric('orders-pending')).toBe(pendingCount)
    expect(dashboardMetric('orders-progress')).toBe(inProgressCount)
    expect(dashboardMetric('orders-completed')).toBe(completedCount)
    expect(dashboardMetric('orders-cancelled')).toBe(cancelledCount)

    expect(dashboardSegment('status-pending')).toBe(pendingCount)
    expect(dashboardSegment('status-progress')).toBe(inProgressCount)
    expect(dashboardSegment('status-completed')).toBe(completedCount)
    expect(dashboardSegment('status-cancelled')).toBe(cancelledCount)

    const persisted = readPersistedSnapshot()
    expect(persisted.orders.find((order: { id: string }) => order.id === created.id)?.status).toBe('completed')
    expect(persisted.orders.find((order: { id: string }) => order.id === 'order-2')?.status).toBe('cancelled')
    expect(persisted.orders.find((order: { id: string }) => order.id === recycledCancelledOrder!.id)?.status).toBe('pending')
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

  it('returns null for unknown ids without mutating runtime state', () => {
    const before = JSON.stringify(readPersistedSnapshot())

    expect(templateRuntimeData.duplicateClient('missing-client')).toBeNull()
    expect(templateRuntimeData.cycleClientStatus('missing-client')).toBeNull()
    expect(templateRuntimeData.advanceOrderStatus('missing-order')).toBeNull()
    expect(templateRuntimeData.cancelOrder('missing-order')).toBeNull()

    expect(JSON.stringify(readPersistedSnapshot())).toBe(before)
  })

  it('hydrates persisted settings and falls back to defaults for partial or invalid storage', () => {
    localStorage.setItem(
      TEMPLATE_RUNTIME_STORAGE_KEY,
      JSON.stringify({
        settings: {
          workspaceName: 'Hydrated Workspace',
          compactTables: true,
          locale: 'en-US',
        },
        clients: [],
        orders: [],
        wiki: {
          categories: [],
          documents: [],
          suggestions: [],
        },
      })
    )

    templateRuntimeData.hydrate()

    expect(templateRuntimeData.workspaceName.value).toBe('Hydrated Workspace')
    expect(templateRuntimeData.state.settings.compactTables).toBe(true)
    expect(templateRuntimeData.state.settings.locale).toBe('en-US')
    expect(templateRuntimeData.state.settings.notificationsEnabled).toBe(true)
    expect(templateRuntimeData.state.clients.length).toBeGreaterThan(0)
    expect(templateRuntimeData.state.orders.length).toBeGreaterThan(0)
    expect(templateRuntimeData.wikiDocuments.value.length).toBeGreaterThan(0)

    localStorage.setItem(TEMPLATE_RUNTIME_STORAGE_KEY, '{invalid json')
    templateRuntimeData.hydrate()

    expect(templateRuntimeData.workspaceName.value).toBe('Atlas Flow')
    expect(templateRuntimeData.state.settings.compactTables).toBe(false)
    expect(templateRuntimeData.state.clients).toHaveLength(6)
    expect(templateRuntimeData.state.orders).toHaveLength(10)
  })

  it('keeps storage and seed helpers reusable without mutating shared snapshots', () => {
    const seeded = createDefaultTemplateRuntimeData()
    const cloned = cloneRuntimeSnapshot(seeded)

    cloned.clients[0]!.name = 'Changed Client'
    cloned.clients[0]!.tags.push('changed')

    expect(seeded.clients[0]?.name).toBe('Alfa Distribution')
    expect(seeded.clients[0]?.tags).not.toContain('changed')
    expect(nextTemplateRuntimeOrderNumber(seeded)).toBe('ORD-1051')

    persistTemplateRuntimeData(cloned)
    expect(loadTemplateRuntimeData().clients[0]?.name).toBe('Changed Client')
  })
})
