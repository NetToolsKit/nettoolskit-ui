import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import LoginTemplate from '../../../src/templates/features/auth/LoginTemplate.vue'
import UserMenuTemplate from '../../../src/templates/navigation/UserMenuTemplate.vue'
import MenuLinkTemplate from '../../../src/templates/navigation/MenuLinkTemplate.vue'
import HorizontalMenuLinkTemplate from '../../../src/templates/navigation/HorizontalMenuLinkTemplate.vue'
import AppBreadcrumbTemplate from '../../../src/templates/navigation/AppBreadcrumbTemplate.vue'

const pageGlobal = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': { template: '<div><slot /></div>' },
    },
  },
}

const navGlobal = {
  global: {
    renderStubDefaultSlot: true,
  },
}

// ---------------------------------------------------------------------------
// LoginTemplate
// ---------------------------------------------------------------------------

describe('LoginTemplate', () => {
  it('renders brand panel and form with default titles', () => {
    const wrapper = shallowMount(LoginTemplate, {
      ...pageGlobal,
      props: { email: '', password: '' },
    })

    expect(wrapper.find('.ntk-template-login__brand').exists()).toBe(true)
    expect(wrapper.find('.ntk-template-login__form-title').text()).toBe('Sign in')
    expect(wrapper.find('.ntk-template-login__brand-title').text()).toBe('Welcome to your workspace')
  })

  it('hides brand panel when showBrandPanel is false', () => {
    const wrapper = shallowMount(LoginTemplate, {
      ...pageGlobal,
      props: { showBrandPanel: false },
    })

    expect(wrapper.find('.ntk-template-login__brand').exists()).toBe(false)
    expect(wrapper.find('.ntk-template-login__form-area').exists()).toBe(true)
  })

  it('renders custom features list', () => {
    const wrapper = shallowMount(LoginTemplate, {
      ...pageGlobal,
      props: {
        features: [
          { id: 'f1', text: 'Enterprise SSO', icon: 'shield' },
          { id: 'f2', text: 'Multi-tenant aware', icon: 'business' },
        ],
      },
    })

    const features = wrapper.findAll('.ntk-template-login__feature')
    expect(features).toHaveLength(2)
    expect(features[0]?.text()).toContain('Enterprise SSO')
    expect(features[1]?.text()).toContain('Multi-tenant aware')
  })

  it('shows version label when showVersion is true', () => {
    const wrapper = shallowMount(LoginTemplate, {
      ...pageGlobal,
      props: { showVersion: true, versionLabel: 'v2026.03' },
    })

    expect(wrapper.text()).toContain('v2026.03')
  })

  it('emits submit event when form is submitted', async () => {
    const wrapper = shallowMount(LoginTemplate, {
      ...pageGlobal,
      props: { email: 'user@example.com', password: 'secret123' },
    })

    await wrapper.find('q-form-stub').trigger('submit')

    const emitted = wrapper.emitted('submit') as [{ email: string; password: string }][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0]?.[0]).toMatchObject({ email: 'user@example.com', password: 'secret123' })
  })
})

// ---------------------------------------------------------------------------
// UserMenuTemplate
// ---------------------------------------------------------------------------

describe('UserMenuTemplate', () => {
  it('renders profile initials and name', () => {
    const wrapper = shallowMount(UserMenuTemplate, {
      ...navGlobal,
      props: {
        modelValue: false,
        showLabelsInMini: false,
        sideMenuVariant: 'vercel',
        profileName: 'Ana Costa',
        profileInitials: 'AC',
      },
    })

    expect(wrapper.text()).toContain('AC')
    expect(wrapper.text()).toContain('Ana Costa')
  })

  it('emits logout-click when sign out item is clicked', async () => {
    const wrapper = shallowMount(UserMenuTemplate, {
      ...navGlobal,
      props: {
        modelValue: false,
        showLabelsInMini: false,
        sideMenuVariant: 'vercel',
        profileName: 'Test User',
        profileInitials: 'TU',
        signOutLabel: 'Sign out',
      },
    })

    // shallowMount auto-stubs render as q-btn-stub with the label prop as attribute
    const logoutBtn = wrapper.find('q-btn-stub[label="Sign out"]')
    await logoutBtn.trigger('click')

    expect(wrapper.emitted('logout-click')).toHaveLength(1)
  })

  it('emits account-click when view account item is clicked', async () => {
    const wrapper = shallowMount(UserMenuTemplate, {
      ...navGlobal,
      props: {
        modelValue: false,
        showLabelsInMini: false,
        sideMenuVariant: 'vercel',
        accountLabel: 'View account',
      },
    })

    const accountBtn = wrapper.find('q-btn-stub[label="View account"]')
    await accountBtn.trigger('click')

    expect(wrapper.emitted('account-click')).toHaveLength(1)
  })
})

// ---------------------------------------------------------------------------
// MenuLinkTemplate
// ---------------------------------------------------------------------------

describe('MenuLinkTemplate', () => {
  // TemplateMenuItem uses `text` field (not `label`)
  const baseItem = {
    id: 'pipeline',
    text: 'Pipeline',
    icon: 'insights',
    to: '/pipeline',
  }

  it('renders menu item label and icon', () => {
    const wrapper = shallowMount(MenuLinkTemplate, {
      ...navGlobal,
      props: { item: baseItem },
    })

    expect(wrapper.text()).toContain('Pipeline')
  })

  it('applies active class when activeItemId matches item id', () => {
    const wrapper = shallowMount(MenuLinkTemplate, {
      ...navGlobal,
      props: { item: baseItem, activeItemId: 'pipeline' },
    })

    // The active item gets ntk-template-menu-link--active on the QItem stub
    const activeEl = wrapper.find('.ntk-template-menu-link--active')
    expect(activeEl.exists()).toBe(true)
  })

  it('emits item-click when menu item is clicked', async () => {
    const wrapper = shallowMount(MenuLinkTemplate, {
      ...navGlobal,
      props: { item: baseItem },
    })

    // QItem stub renders as <div class="q-item ntk-template-menu-link ...">
    const link = wrapper.find('.ntk-template-menu-link')
    await link.trigger('click')

    expect(wrapper.emitted('item-click')).toHaveLength(1)
  })

  it('renders child items when item has children', () => {
    const itemWithChildren = {
      ...baseItem,
      children: [
        { id: 'wiki', text: 'Wiki', to: '/wiki' },
        { id: 'wiki-chat', text: 'Chat', to: '/wiki/chat' },
      ],
    }

    const wrapper = shallowMount(MenuLinkTemplate, {
      ...navGlobal,
      props: { item: itemWithChildren },
    })

    expect(wrapper.text()).toContain('Wiki')
    expect(wrapper.text()).toContain('Chat')
  })
})

// ---------------------------------------------------------------------------
// HorizontalMenuLinkTemplate
// ---------------------------------------------------------------------------

describe('HorizontalMenuLinkTemplate', () => {
  // TemplateMenuItem uses `text` field (not `label`)
  const baseItem = {
    id: 'pipeline',
    text: 'Pipeline',
    icon: 'insights',
    to: '/pipeline',
  }

  it('renders item label', () => {
    const wrapper = shallowMount(HorizontalMenuLinkTemplate, {
      ...navGlobal,
      props: { item: baseItem },
    })

    expect(wrapper.text()).toContain('Pipeline')
  })

  it('renders a dropdown when item has children', () => {
    const itemWithChildren = {
      ...baseItem,
      children: [
        { id: 'wiki', text: 'Wiki', to: '/wiki' },
        { id: 'chat', text: 'Chat', to: '/wiki/chat' },
      ],
    }

    const wrapper = shallowMount(HorizontalMenuLinkTemplate, {
      ...navGlobal,
      props: { item: itemWithChildren },
    })

    // With children it uses QBtnDropdown (shallowMount auto-stub: q-btn-dropdown-stub)
    expect(wrapper.find('q-btn-dropdown-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('Wiki')
    expect(wrapper.text()).toContain('Chat')
  })
})

// ---------------------------------------------------------------------------
// AppBreadcrumbTemplate
// ---------------------------------------------------------------------------

describe('AppBreadcrumbTemplate', () => {
  it('renders breadcrumb items from items prop', () => {
    const wrapper = shallowMount(AppBreadcrumbTemplate, {
      ...navGlobal,
      props: {
        // TemplateBreadcrumbItem uses `name` field (not `label/id`)
        items: [
          { name: 'Home', path: '/' },
          { name: 'Wiki', path: '/wiki' },
          { name: 'Document' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Wiki')
    expect(wrapper.text()).toContain('Document')
  })

  it('renders nothing when items is empty', () => {
    const wrapper = shallowMount(AppBreadcrumbTemplate, {
      ...navGlobal,
      props: { items: [] },
    })

    // The entire nav has v-if="resolvedItems.length > 0" so it's absent when empty
    expect(wrapper.find('.ntk-template-breadcrumb').exists()).toBe(false)
  })
})