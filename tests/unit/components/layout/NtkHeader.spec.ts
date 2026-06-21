/**
 * Tests/unit/components/layout/Ntk Header spec module.
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NtkHeader from '../../../../src/components/layout/NtkHeader.vue'

describe('NtkHeader', () => {
  it('uses english notifications tooltip and exposes aria labels', () => {
    const wrapper = mount(NtkHeader, {
      props: {
        showNotifications: true,
        notificationsTooltip: 'Notifications',
        notificationsAriaLabel: 'Open notifications',
      },
    })

    expect(wrapper.text()).toContain('Notifications')
    const notificationsButton = wrapper.findAll('button').find(node => node.attributes('icon') === 'notifications')
    expect(notificationsButton?.attributes('aria-label')).toBe('Open notifications')
  })

  it('applies token-driven action and badge styles', () => {
    const wrapper = mount(NtkHeader, {
      props: {
        actionColor: 'primary',
        notificationBadgeColor: 'warning',
        notificationBadgeTextColor: 'inverse',
        showNotifications: true,
        notificationCount: 3,
      },
    })

    const header = wrapper.find('header[data-stub="QHeader"]')
    const style = header.attributes('style')
    expect(style).toContain('--ntk-header-action-color: var(--ntk-primary)')
    expect(style).toContain('--ntk-header-notification-badge-bg: var(--ntk-warning')
    expect(style).toContain('--ntk-header-notification-badge-text: var(--ntk-text-inverse)')
  })

  it('does not force quasar bg/text classes when not configured', () => {
    const wrapper = mount(NtkHeader)
    const header = wrapper.find('header[data-stub="QHeader"]')
    const headerClasses = header.attributes('class')

    expect(headerClasses.includes('bg-')).toBe(false)
    expect(headerClasses.includes('text-')).toBe(false)
  })

  it('uses tokenized styles instead of quasar bg/text classes when configured', () => {
    const wrapper = mount(NtkHeader, {
      props: {
        bgColor: 'surface',
        textColor: 'grey-8',
      },
    })

    const header = wrapper.find('header[data-stub="QHeader"]')
    const headerClasses = header.attributes('class')
    const headerStyle = header.attributes('style')
    expect(headerClasses).not.toContain('bg-surface')
    expect(headerClasses).not.toContain('text-grey-8')
    expect(headerStyle).toContain('--ntk-header-bg-color: var(--ntk-bg-primary)')
    expect(headerStyle).toContain('--ntk-header-text-color: var(--ntk-text-secondary)')
  })
})
