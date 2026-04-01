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
        actionColor: '#112233',
        notificationBadgeColor: '#ff0000',
        notificationBadgeTextColor: '#ffffff',
        showNotifications: true,
        notificationCount: 3,
      },
    })

    const header = wrapper.find('header[data-stub="QHeader"]')
    const style = header.attributes('style')
    expect(style).toContain('--ntk-header-action-color: #112233')
    expect(style).toContain('--ntk-header-notification-badge-bg: #ff0000')
    expect(style).toContain('--ntk-header-notification-badge-text: #ffffff')
  })

  it('does not force quasar bg/text classes when not configured', () => {
    const wrapper = mount(NtkHeader)
    const header = wrapper.find('header[data-stub="QHeader"]')
    const headerClasses = header.attributes('class')

    expect(headerClasses.includes('bg-')).toBe(false)
    expect(headerClasses.includes('text-')).toBe(false)
  })

  it('adds quasar bg/text classes only when explicitly configured', () => {
    const wrapper = mount(NtkHeader, {
      props: {
        bgColor: 'white',
        textColor: 'grey-8',
      },
    })

    const header = wrapper.find('header[data-stub="QHeader"]')
    const headerClasses = header.attributes('class')
    expect(headerClasses).toContain('bg-white')
    expect(headerClasses).toContain('text-grey-8')
  })
})