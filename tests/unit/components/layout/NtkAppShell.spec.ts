/**
 * Tests/unit/components/layout/Ntk App Shell spec module.
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NtkAppShell from '../../../../src/components/layout/NtkAppShell.vue'

const navGroups = [
  { id: 'core', label: 'Core' },
  { id: 'content', label: 'Content' },
]

const items = [
  { id: 'dashboard', group: 'core', label: 'Dashboard', icon: 'dashboard' },
  { id: 'pages', group: 'content', label: 'Pages', icon: 'description' },
]

describe('NtkAppShell', () => {
  it('emits navigation events on click and keyboard interaction', async () => {
    const wrapper = mount(NtkAppShell, {
      props: {
        navGroups,
        items,
        activeItem: 'dashboard',
      },
    })

    const pagesItem = wrapper.findAll('.q-item').find(node => node.text().includes('Pages'))
    expect(pagesItem).toBeDefined()

    await pagesItem!.trigger('click')
    await pagesItem!.trigger('keyup.enter')

    const activeEvents = wrapper.emitted('update:active-item') ?? []
    expect(activeEvents.length).toBeGreaterThanOrEqual(2)
    expect(activeEvents[0]).toEqual(['pages'])
    expect(activeEvents[1]).toEqual(['pages'])

    const telemetryEvents = wrapper.emitted('telemetry') ?? []
    expect(telemetryEvents.length).toBeGreaterThan(0)
    expect((telemetryEvents[0]?.[0] as { type: string }).type).toBe('navigation-select')
  })

  it('applies accessibility labels to navigation and actions', () => {
    const wrapper = mount(NtkAppShell, {
      props: {
        navGroups,
        items,
        navigationAriaLabel: 'Main navigation',
        navigationItemsAriaLabel: 'Module entries',
        notificationsAriaLabel: 'Open notifications panel',
      },
    })

    const drawer = wrapper.find('[data-stub="QDrawer"]')
    expect(drawer.attributes('aria-label')).toBe('Main navigation')

    const list = wrapper.find('[data-stub="QList"]')
    expect(list.attributes('aria-label')).toBe('Module entries')

    const notificationsButton = wrapper.findAll('button').find(node => node.attributes('icon') === 'notifications')
    expect(notificationsButton?.attributes('aria-label')).toBe('Open notifications panel')
  })

  it('sanitizes unsafe toolbar links', () => {
    const wrapper = mount(NtkAppShell, {
      props: {
        navGroups,
        items,
        toolbarActions: [
          { id: 'unsafe', icon: 'warning', href: 'javascript:alert(1)', external: true, showLabel: true, label: 'Unsafe' },
          { id: 'safe', icon: 'open_in_new', href: 'https://example.com', external: true, showLabel: true, label: 'Safe' },
        ],
      },
    })

    const toolbarButtons = wrapper.findAll('button').filter(node => ['warning', 'open_in_new'].includes(node.attributes('icon') ?? ''))
    const unsafeButton = toolbarButtons.find(node => node.attributes('icon') === 'warning')
    const safeButton = toolbarButtons.find(node => node.attributes('icon') === 'open_in_new')

    expect(unsafeButton?.attributes('href')).toBeUndefined()
    expect(unsafeButton?.attributes('target')).toBeUndefined()
    expect(unsafeButton?.attributes('rel')).toBeUndefined()

    expect(safeButton?.attributes('href')).toBe('https://example.com')
    expect(safeButton?.attributes('target')).toBe('_blank')
    expect(safeButton?.attributes('rel')).toBe('noopener noreferrer')
  })

  it('resolves derived theme aliases from canonical tokens', () => {
    const wrapper = mount(NtkAppShell, {
      props: {
        navGroups,
        items,
        theme: {
          drawerTextColor: '#112233',
          itemActiveColor: '#334455',
        },
      },
    })

    const layout = wrapper.find('[data-stub="QLayout"]')
    const style = layout.attributes('style')

    expect(style).toContain('--ntk-shell-item-text')
    expect(style).toContain('#112233')
    expect(style).toContain('--ntk-shell-item-hover-color')
    expect(style).toContain('#334455')
  })

  it('keeps notification bell neutral while applying badge colors', () => {
    const wrapper = mount(NtkAppShell, {
      props: {
        navGroups,
        items,
        toolbarActions: [
          {
            id: 'notifications',
            icon: 'notifications',
            badge: 2,
            round: true,
            flat: true,
            dense: true,
          },
        ],
        theme: {
          notificationIconColor: '#6b7280',
          notificationBadgeColor: '#ef4444',
          notificationErrorTextColor: '#111111',
        },
      },
    })

    const notificationsButton = wrapper.findAll('button').find(node => node.attributes('icon') === 'notifications')
    expect(notificationsButton).toBeDefined()
    const buttonStyle = notificationsButton?.attributes('style') ?? ''
    expect(buttonStyle).toMatch(/color:\s*(#6b7280|rgb\(\s*107,\s*114,\s*128\))/i)

    const notificationBadge = wrapper.find('[data-stub="QBadge"]')
    expect(notificationBadge.exists()).toBe(true)
    const badgeStyle = notificationBadge.attributes('style')
    expect(badgeStyle).toMatch(/background-color:\s*(#ef4444|rgb\(\s*239,\s*68,\s*68\))/i)
    expect(badgeStyle).toMatch(/color:\s*(#111111|rgb\(\s*17,\s*17,\s*17\))/i)
  })

  it('injects custom action hover token into shell style variables', () => {
    const wrapper = mount(NtkAppShell, {
      props: {
        navGroups,
        items,
        theme: {
          actionHoverBackground: '#9f1414',
        },
      },
    })

    const layout = wrapper.find('[data-stub="QLayout"]')
    const style = layout.attributes('style')
    expect(style).toContain('--ntk-shell-action-hover')
    expect(style).toContain('#9f1414')
  })

  it('injects typography and dimension override tokens into shell style variables', () => {
    const wrapper = mount(NtkAppShell, {
      props: {
        navGroups,
        items,
        theme: {
          fontSizeGroupCaption: '0.74rem',
          searchWidth: '360px',
          searchControlHeight: '40px',
          brandLogoSize: '38px',
          itemIconSize: '24px',
          workspaceMaxWidth: '1400px',
        },
      },
    })

    const layout = wrapper.find('[data-stub="QLayout"]')
    const style = layout.attributes('style')
    expect(style).toContain('--ntk-shell-font-size-group-caption')
    expect(style).toContain('0.74rem')
    expect(style).toContain('--ntk-shell-search-width')
    expect(style).toContain('360px')
    expect(style).toContain('--ntk-shell-search-control-height')
    expect(style).toContain('40px')
    expect(style).toContain('--ntk-shell-brand-logo-size')
    expect(style).toContain('38px')
    expect(style).toContain('--ntk-shell-item-icon-size')
    expect(style).toContain('24px')
    expect(style).toContain('--ntk-shell-workspace-max-width')
    expect(style).toContain('1400px')
  })
})