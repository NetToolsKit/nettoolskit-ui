import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import ProfileTemplate from '../../../src/templates/pages/account/ProfileTemplate.vue'
import MainLayoutTemplate from '../../../src/templates/layouts/MainLayoutTemplate.vue'

const pageGlobal = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': { template: '<div><slot /></div>' },
    },
  },
}

const layoutGlobal = {
  global: {
    renderStubDefaultSlot: true,
  },
}

// ---------------------------------------------------------------------------
// ProfileTemplate
// ---------------------------------------------------------------------------

describe('ProfileTemplate', () => {
  it('renders name and email from profile prop', () => {
    const wrapper = shallowMount(ProfileTemplate, {
      ...pageGlobal,
      props: {
        profile: { name: 'Ana Lima', email: 'ana@example.com' },
      },
    })

    expect(wrapper.find('.ntk-template-profile__title').text()).toBe('Ana Lima')
    expect(wrapper.find('.ntk-template-profile__email').text()).toContain('ana@example.com')
  })

  it('renders avatar initials derived from name when no initials provided', () => {
    const wrapper = shallowMount(ProfileTemplate, {
      ...pageGlobal,
      props: {
        profile: { name: 'Carlos Nunes' },
      },
    })

    // initials computed from first + last word: CN
    expect(wrapper.find('.ntk-template-profile__avatar').text()).toContain('CN')
  })

  it('shows role badge with profile role', () => {
    const wrapper = shallowMount(ProfileTemplate, {
      ...pageGlobal,
      props: {
        profile: { name: 'Admin User', role: 'Admin' },
      },
    })

    const badge = wrapper.find('.ntk-template-profile__role-badge')
    expect(badge.exists()).toBe(true)
    // q-badge-stub renders the label as an attribute (shallowMount auto-stub)
    expect(badge.attributes('label')).toBe('Admin')
  })

  it('hides logout button by default', () => {
    const wrapper = shallowMount(ProfileTemplate, {
      ...pageGlobal,
      props: { profile: { name: 'User' } },
    })

    expect(wrapper.find('q-btn-stub[label="Sign out"]').exists()).toBe(false)
  })

  it('shows logout button when showLogoutAction is true', () => {
    const wrapper = shallowMount(ProfileTemplate, {
      ...pageGlobal,
      props: {
        profile: { name: 'User' },
        showLogoutAction: true,
        logoutLabel: 'Sign out',
      },
    })

    expect(wrapper.find('q-btn-stub[label="Sign out"]').exists()).toBe(true)
  })

  it('emits logout-click when logout button is clicked', async () => {
    const wrapper = shallowMount(ProfileTemplate, {
      ...pageGlobal,
      props: {
        profile: { name: 'User' },
        showLogoutAction: true,
        logoutLabel: 'Sign out',
      },
    })

    await wrapper.find('q-btn-stub[label="Sign out"]').trigger('click')

    expect(wrapper.emitted('logout-click')).toHaveLength(1)
  })

  it('renders profile groups with field labels and values', () => {
    const wrapper = shallowMount(ProfileTemplate, {
      ...pageGlobal,
      props: {
        profile: { name: 'User' },
        groups: [
          {
            id: 'personal',
            title: 'Personal info',
            fields: [
              { id: 'f1', label: 'Full name', value: 'Ana Lima' },
              { id: 'f2', label: 'Email', value: 'ana@example.com' },
            ],
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Personal info')
    expect(wrapper.text()).toContain('Full name')
    expect(wrapper.text()).toContain('ana@example.com')

    const rows = wrapper.findAll('.ntk-template-profile__row')
    expect(rows).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// MainLayoutTemplate
// ---------------------------------------------------------------------------

describe('MainLayoutTemplate', () => {
  const baseMenuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
    { id: 'reports', text: 'Reports', icon: 'bar_chart', to: '/reports' },
  ]

  it('renders appName in the brand area', () => {
    const wrapper = shallowMount(MainLayoutTemplate, {
      ...layoutGlobal,
      props: { menuItems: baseMenuItems, appName: 'MyApp' },
    })

    expect(wrapper.find('.ntk-template-main-layout__title').text()).toBe('MyApp')
  })

  it('shows the header section when showHeader is true (default)', () => {
    const wrapper = shallowMount(MainLayoutTemplate, {
      ...layoutGlobal,
      props: { menuItems: baseMenuItems },
    })

    expect(wrapper.find('.ntk-template-main-layout__header').exists()).toBe(true)
  })

  it('hides the header when showHeader is false', () => {
    const wrapper = shallowMount(MainLayoutTemplate, {
      ...layoutGlobal,
      props: { menuItems: baseMenuItems, showHeader: false },
    })

    expect(wrapper.find('.ntk-template-main-layout__header').exists()).toBe(false)
  })

  it('renders the side drawer when not in horizontal mode', () => {
    const wrapper = shallowMount(MainLayoutTemplate, {
      ...layoutGlobal,
      props: { menuItems: baseMenuItems, showDrawer: true },
    })

    // Drawer container is visible in side-nav mode
    expect(wrapper.find('.ntk-template-main-layout__drawer-container').exists()).toBe(true)
  })

  it('renders default slot content in the page container', () => {
    const wrapper = shallowMount(MainLayoutTemplate, {
      ...layoutGlobal,
      props: { menuItems: baseMenuItems },
      slots: { default: '<p class="page-content">Hello world</p>' },
    })

    expect(wrapper.find('.page-content').exists()).toBe(true)
    expect(wrapper.find('.page-content').text()).toBe('Hello world')
  })

  it('renders floating slot content (FABs, overlays)', () => {
    const wrapper = shallowMount(MainLayoutTemplate, {
      ...layoutGlobal,
      props: { menuItems: baseMenuItems },
      slots: { floating: '<button class="my-fab">Chat</button>' },
    })

    expect(wrapper.find('.my-fab').exists()).toBe(true)
    expect(wrapper.find('.my-fab').text()).toBe('Chat')
  })

  it('emits menu-item-click when a menu item is clicked', async () => {
    const wrapper = shallowMount(MainLayoutTemplate, {
      ...layoutGlobal,
      props: { menuItems: baseMenuItems },
    })

    // MenuLinkTemplate stubs emit item-click, which MainLayout forwards as menu-item-click
    const menuLinks = wrapper.findAllComponents({ name: 'MenuLinkTemplate' })
    await menuLinks[0]?.vm.$emit('item-click', baseMenuItems[0])

    expect(wrapper.emitted('menu-item-click')).toHaveLength(1)
    expect((wrapper.emitted('menu-item-click') as any[][])[0][0]).toMatchObject({ id: 'dashboard' })
  })
})