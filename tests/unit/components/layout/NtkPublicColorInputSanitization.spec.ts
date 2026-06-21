import { describe, expect, it } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'

import NtkCTASection from '../../../../src/components/layout/NtkCTASection.vue'
import NtkHeader from '../../../../src/components/layout/NtkHeader.vue'
import NtkHero from '../../../../src/components/layout/NtkHero.vue'
import NtkSection from '../../../../src/components/layout/NtkSection.vue'
import NtkSidebar from '../../../../src/components/layout/NtkSidebar.vue'

const styleOf = (wrapper: ReturnType<typeof mount> | ReturnType<typeof shallowMount>, selector: string): string => (
  wrapper.find(selector).attributes('style') ?? ''
)

const sidebarGlobal = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-drawer': { template: '<aside class="q-drawer" v-bind="$attrs"><slot /></aside>' },
      'q-scroll-area': { template: '<div><slot /></div>' },
      'q-list': { template: '<ul><slot /></ul>' },
      'q-item': { template: '<li class="q-item" v-bind="$attrs"><slot /></li>' },
      'q-item-section': { template: '<div><slot /></div>' },
      'q-item-label': { template: '<span><slot /></span>' },
      'q-icon': { template: '<span class="icon" />' },
      'q-separator': true,
      'q-tooltip': true,
    },
  },
}

describe('public layout color input sanitization', () => {
  it('uses tokenized NtkHeader styles instead of Quasar utility classes', () => {
    const wrapper = mount(NtkHeader, {
      props: {
        bgColor: 'surface',
        textColor: 'grey-8',
        actionColor: 'primary',
        searchIconColor: 'var(--safe-search-icon)',
        notificationBadgeColor: 'warning',
        notificationBadgeTextColor: 'inverse',
      },
    })

    const header = wrapper.find('header[data-stub="QHeader"]')
    const classes = header.attributes('class') ?? ''
    const style = header.attributes('style') ?? ''
    expect(classes).not.toContain('bg-surface')
    expect(classes).not.toContain('text-grey-8')
    expect(style).toContain('--ntk-header-bg-color: var(--ntk-bg-primary)')
    expect(style).toContain('--ntk-header-text-color: var(--ntk-text-secondary)')
    expect(style).toContain('--ntk-header-action-color: var(--ntk-primary)')
    expect(style).toContain('--ntk-header-search-icon-color: var(--safe-search-icon)')
    expect(style).toContain('--ntk-header-notification-badge-bg: var(--ntk-warning')
    expect(style).toContain('--ntk-header-notification-badge-text: var(--ntk-text-inverse)')
  })

  it('drops unsafe NtkHeader color inputs and falls back to tokens', () => {
    const wrapper = mount(NtkHeader, {
      props: {
        bgColor: 'white',
        textColor: 'hotpink',
        actionColor: '#112233',
        searchIconColor: 'rgb(1, 2, 3)',
        notificationBadgeColor: 'hsl(0, 100%, 50%)',
        notificationBadgeTextColor: 'black',
      },
    })

    const header = wrapper.find('header[data-stub="QHeader"]')
    const classes = header.attributes('class') ?? ''
    const style = header.attributes('style') ?? ''
    expect(classes).not.toContain('bg-white')
    expect(classes).not.toContain('text-hotpink')
    expect(style).not.toContain('#112233')
    expect(style).not.toContain('rgb(1, 2, 3)')
    expect(style).not.toContain('hsl(0')
    expect(style).not.toContain('black')
    expect(style).toContain('--ntk-header-action-color: var(--ntk-text-secondary)')
    expect(style).toContain('--ntk-header-search-icon-color: var(--ntk-text-muted)')
    expect(style).toContain('--ntk-header-notification-badge-bg: var(--semantic-error')
    expect(style).toContain('--ntk-header-notification-badge-text: var(--ntk-text-inverse)')
  })

  it('sanitizes section, hero and CTA background overrides', () => {
    const section = shallowMount(NtkSection, {
      props: { title: 'Section', bgColor: 'surface-muted' },
    })
    expect(styleOf(section, '.ntk-section')).toContain('background-color: var(--ntk-bg-secondary)')

    const unsafeHero = shallowMount(NtkHero, {
      props: { title: 'Hero', bgColor: '#ffffff' },
    })
    expect(styleOf(unsafeHero, '.ntk-hero')).not.toContain('#ffffff')

    const cta = shallowMount(NtkCTASection, {
      props: {
        title: 'CTA',
        primaryCTA: { text: 'Start', link: '/' },
        bgColor: 'linear-gradient(135deg, var(--ntk-primary) 0%, var(--ntk-accent) 100%)',
      },
    })
    expect(styleOf(cta, '.ntk-cta-section')).toContain('linear-gradient(135deg, var(--ntk-primary)')

    const unsafeCta = shallowMount(NtkCTASection, {
      props: {
        title: 'CTA',
        primaryCTA: { text: 'Start', link: '/' },
        bgColor: 'white',
        variant: 'default',
      },
    })
    expect(styleOf(unsafeCta, '.ntk-cta-section')).not.toContain('white')
  })

  it('keeps NtkSidebar unknown colors on token fallbacks', () => {
    const wrapper = shallowMount(NtkSidebar, {
      ...sidebarGlobal,
      props: {
        modelValue: true,
        bgColor: '#ffffff',
        textColor: 'hotpink',
        activeColor: 'rgb(1, 2, 3)',
        items: [{ id: 'billing', label: 'Billing', badge: '3', badgeColor: 'white' }],
      },
    })

    const drawerStyle = styleOf(wrapper, '.q-drawer')
    const badgeStyle = styleOf(wrapper, '.ntk-sidebar__badge')
    expect(drawerStyle).not.toContain('#ffffff')
    expect(drawerStyle).not.toContain('hotpink')
    expect(drawerStyle).not.toContain('rgb(1, 2, 3)')
    expect(drawerStyle).toContain('--ntk-sidebar-bg-resolved: var(--ntk-sidebar-bg')
    expect(drawerStyle).toContain('--ntk-sidebar-text-resolved: var(--ntk-sidebar-text')
    expect(badgeStyle).not.toContain('white')
    expect(badgeStyle).toContain('--ntk-sidebar-badge-bg: var(--ntk-sidebar-item-active-text-resolved')
  })
})
