import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkAppSidebar from '../../../../src/components/builders/NtkAppSidebar.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/dashboard' }),
}))

const global = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-avatar': { template: '<div class="avatar" v-bind="$attrs"><slot /></div>' },
      'q-separator': true,
      'q-list': { template: '<ul><slot /></ul>' },
      'q-item': { template: '<li class="q-item" v-bind="$attrs"><slot /></li>' },
      'q-item-section': { template: '<div><slot /></div>' },
      'q-item-label': { template: '<span><slot /></span>' },
      'q-icon': { template: '<span class="icon" />' },
      'q-badge': { template: '<span class="badge" v-bind="$attrs">{{ label }}</span>', props: ['label'] },
      'q-expansion-item': { template: '<div><slot /></div>' },
    },
  },
}

describe('NtkAppSidebar color input sanitization', () => {
  it('drops unsafe avatar and badge colors', () => {
    const wrapper = shallowMount(NtkAppSidebar, {
      ...global,
      props: {
        showUserProfile: true,
        userProfile: {
          name: 'Ana Lima',
          email: 'ana@example.com',
          avatarColor: '#ffffff',
        },
        menuItems: [
          { label: 'Dashboard', to: '/dashboard', badge: '2', badgeColor: 'hotpink' },
        ],
      },
    })

    const avatarStyle = wrapper.find('.avatar').attributes('style') ?? ''
    const badgeStyle = wrapper.find('.badge').attributes('style') ?? ''
    expect(avatarStyle).not.toContain('#ffffff')
    expect(avatarStyle).toContain('--ntk-sidebar-avatar-bg: var(--ntk-avatar-bg')
    expect(badgeStyle).not.toContain('hotpink')
    expect(badgeStyle).toContain('--ntk-sidebar-badge-bg: var(--ntk-primary)')
  })

  it('preserves safe aliases and CSS variable expressions', () => {
    const wrapper = shallowMount(NtkAppSidebar, {
      ...global,
      props: {
        showUserProfile: true,
        userProfile: {
          name: 'Ana Lima',
          email: 'ana@example.com',
          avatarColor: 'var(--safe-avatar-bg)',
        },
        menuItems: [
          { label: 'Dashboard', to: '/dashboard', badge: '2', badgeColor: 'warning' },
        ],
      },
    })

    const avatarStyle = wrapper.find('.avatar').attributes('style') ?? ''
    const badgeStyle = wrapper.find('.badge').attributes('style') ?? ''
    expect(avatarStyle).toContain('--ntk-sidebar-avatar-bg: var(--safe-avatar-bg)')
    expect(badgeStyle).toContain('--ntk-sidebar-badge-bg: var(--semantic-warning-primary')
  })
})
