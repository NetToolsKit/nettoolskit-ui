import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'

import NtkAppShell from '../../../../src/components/layout/NtkAppShell.vue'

const navGroups = [{ id: 'core', label: 'Core' }]

const items = [
  { id: 'dashboard', group: 'core', label: 'Dashboard', icon: 'dashboard' },
]

function mountShell(props: Record<string, unknown>): VueWrapper {
  return mount(NtkAppShell, {
    props: {
      navGroups,
      items,
      ...props,
    },
  })
}

function findButtonByIcon(wrapper: VueWrapper, icon: string) {
  const button = wrapper.findAll('[data-stub="QBtn"]').find(node => node.attributes('icon') === icon)
  expect(button).toBeDefined()
  return button!
}

function findBadgeByText(wrapper: VueWrapper, text: string) {
  const badge = wrapper.findAll('[data-stub="QBadge"]').find(node => node.text().trim() === text)
  expect(badge).toBeDefined()
  return badge!
}

describe('NtkAppShell color tokenization', () => {
  it('resolves action aliases into CSS tokens without passing Quasar color props', () => {
    const wrapper = mountShell({
      toolbarActions: [
        { id: 'primary', icon: 'palette', color: 'primary', flat: true, dense: true },
        {
          id: 'neutral',
          icon: 'contrast',
          textColor: 'grey-8',
          badge: 3,
          badgeColor: 'warning',
          badgeTextColor: 'inverse',
          flat: true,
          dense: true,
        },
      ],
      theme: {
        notificationWarningColor: 'var(--badge-warning)',
      },
    })

    const primaryButton = findButtonByIcon(wrapper, 'palette')
    expect(primaryButton.attributes('color')).toBeUndefined()
    expect(primaryButton.attributes('textcolor')).toBeUndefined()
    expect(primaryButton.attributes('style')).toMatch(/color:\s*var\(--ntk-primary\)/i)

    const neutralButton = findButtonByIcon(wrapper, 'contrast')
    expect(neutralButton.attributes('color')).toBeUndefined()
    expect(neutralButton.attributes('textcolor')).toBeUndefined()
    expect(neutralButton.attributes('style')).toMatch(/color:\s*var\(--ntk-text-secondary\)/i)

    const badge = findBadgeByText(wrapper, '3')
    const badgeStyle = badge.attributes('style') ?? ''
    expect(badgeStyle).toMatch(/background-color:\s*var\(--badge-warning\)/i)
    expect(badgeStyle).toMatch(/color:\s*var\(--ntk-text-inverse\)/i)
  })

  it('preserves safe CSS expressions and drops untrusted color strings', () => {
    const wrapper = mountShell({
      toolbarActions: [
        {
          id: 'safe',
          icon: 'tune',
          textColor: 'var(--safe-action-color)',
          badge: 'A',
          badgeColor: 'color-mix(in srgb, var(--ntk-primary) 80%, transparent)',
          badgeTextColor: 'var(--safe-badge-text)',
          flat: true,
          dense: true,
        },
        {
          id: 'blocked',
          icon: 'bug_report',
          color: 'primary; background: red',
          textColor: 'white',
          badge: 'B',
          badgeColor: 'javascript:alert(1)',
          badgeTextColor: 'hotpink',
          flat: true,
          dense: true,
        },
      ],
    })

    const safeButton = findButtonByIcon(wrapper, 'tune')
    expect(safeButton.attributes('color')).toBeUndefined()
    expect(safeButton.attributes('textcolor')).toBeUndefined()
    expect(safeButton.attributes('style')).toMatch(/color:\s*var\(--safe-action-color\)/i)

    const safeBadgeStyle = findBadgeByText(wrapper, 'A').attributes('style') ?? ''
    expect(safeBadgeStyle).toContain('color-mix(in srgb, var(--ntk-primary) 80%, transparent)')
    expect(safeBadgeStyle).toMatch(/color:\s*var\(--safe-badge-text\)/i)

    const blockedButton = findButtonByIcon(wrapper, 'bug_report')
    const blockedButtonStyle = blockedButton.attributes('style') ?? ''
    expect(blockedButton.attributes('color')).toBeUndefined()
    expect(blockedButton.attributes('textcolor')).toBeUndefined()
    expect(blockedButtonStyle).not.toContain('primary;')
    expect(blockedButtonStyle).not.toContain('white')

    const blockedBadgeStyle = findBadgeByText(wrapper, 'B').attributes('style') ?? ''
    expect(blockedBadgeStyle).not.toContain('javascript')
    expect(blockedBadgeStyle).not.toContain('hotpink')
  })
})
