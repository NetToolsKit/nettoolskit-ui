/**
 * App shell family (DsAppShell / DsHeader / DsSidebar / DsFooter / DsDrawer) —
 * domain-neutral layout scaffolding that replaces the legacy Ntk shell. Asserts
 * the correct landmarks/roles, slot composition, the drawer open/close lifecycle
 * (native `<dialog>` modal pattern), and axe cleanliness of a composed shell.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import {
  DsAppShell,
  DsDrawer,
  DsFooter,
  DsHeader,
  DsSidebar,
} from '@/design-system/vue'

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

describe('DsHeader', () => {
  it('renders a banner landmark with brand/title/actions slots', () => {
    const wrapper = mount(DsHeader, {
      props: { title: 'NetToolsKit' },
      slots: {
        brand: '<span class="brand">Brand</span>',
        actions: '<button type="button">Sign out</button>',
      },
    })

    const root = wrapper.get('.ntk-header')
    expect(root.element.tagName).toBe('HEADER')
    expect(root.classes()).toEqual(expect.arrayContaining([
      'ntk-header--variant-default',
      'ntk-header--size-md',
      'ntk-header--intent-neutral',
    ]))
    expect(wrapper.get('.ntk-header__title').text()).toBe('NetToolsKit')
    expect(wrapper.find('.ntk-header__brand .brand').exists()).toBe(true)
    expect(wrapper.find('.ntk-header__actions button').exists()).toBe(true)
  })

  it('does not render the hamburger by default and prefers the default slot over title', () => {
    const wrapper = mount(DsHeader, {
      props: { title: 'Ignored' },
      slots: { default: '<span class="center">Centered</span>' },
    })

    expect(wrapper.find('.ntk-header__menu').exists()).toBe(false)
    expect(wrapper.find('.ntk-header__title').exists()).toBe(false)
    expect(wrapper.get('.ntk-header__center .center').text()).toBe('Centered')
  })

  it('emits toggle-menu when the labelled hamburger is clicked', async () => {
    const wrapper = mount(DsHeader, { props: { showMenu: true, menuLabel: 'Open navigation' } })

    const button = wrapper.get('.ntk-header__menu')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-label')).toBe('Open navigation')

    await button.trigger('click')
    expect(wrapper.emitted('toggle-menu')).toHaveLength(1)
  })
})

describe('DsSidebar', () => {
  it('renders a complementary landmark wrapping a labelled nav', () => {
    const wrapper = mount(DsSidebar, {
      props: { ariaLabel: 'Primary' },
      slots: { default: '<a href="/home">Home</a>' },
    })

    const root = wrapper.get('.ntk-sidebar')
    expect(root.element.tagName).toBe('ASIDE')
    const nav = wrapper.get('.ntk-sidebar__nav')
    expect(nav.element.tagName).toBe('NAV')
    expect(nav.attributes('aria-label')).toBe('Primary')
    expect(nav.find('a').text()).toBe('Home')
  })

  it('defaults the nav label to Sidebar and renders header/footer slots', () => {
    const wrapper = mount(DsSidebar, {
      slots: {
        header: '<div class="sb-header">Logo</div>',
        footer: '<div class="sb-footer">v1</div>',
      },
    })

    expect(wrapper.get('.ntk-sidebar__nav').attributes('aria-label')).toBe('Sidebar')
    expect(wrapper.find('.ntk-sidebar__header .sb-header').exists()).toBe(true)
    expect(wrapper.find('.ntk-sidebar__footer .sb-footer').exists()).toBe(true)
  })

  it('applies the collapsed state class only when collapsed', () => {
    const expanded = mount(DsSidebar)
    expect(expanded.get('.ntk-sidebar').classes()).not.toContain('ntk-sidebar--is-collapsed')

    const collapsed = mount(DsSidebar, { props: { collapsed: true } })
    expect(collapsed.get('.ntk-sidebar').classes()).toContain('ntk-sidebar--is-collapsed')
  })
})

describe('DsFooter', () => {
  it('renders a contentinfo landmark with start/default/end slots', () => {
    const wrapper = mount(DsFooter, {
      slots: {
        start: '<span class="f-start">left</span>',
        default: '<span class="f-mid">center</span>',
        end: '<span class="f-end">right</span>',
      },
    })

    const root = wrapper.get('.ntk-footer')
    expect(root.element.tagName).toBe('FOOTER')
    expect(wrapper.find('.ntk-footer__start .f-start').exists()).toBe(true)
    expect(wrapper.get('.ntk-footer__content .f-mid').text()).toBe('center')
    expect(wrapper.find('.ntk-footer__end .f-end').exists()).toBe(true)
  })
})

describe('DsDrawer', () => {
  it('opens via modelValue and exposes a labelled nav and close button', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, title: 'Menu', navLabel: 'Mobile' },
      slots: { default: '<a href="/home">Home</a>' },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = wrapper.get('.ntk-drawer')
    expect(dialog.element.tagName).toBe('DIALOG')
    expect(dialog.element.hasAttribute('open')).toBe(true)
    const nav = wrapper.get('.ntk-drawer__nav')
    expect(nav.element.tagName).toBe('NAV')
    expect(nav.attributes('aria-label')).toBe('Mobile')
    expect(wrapper.get('.ntk-drawer__close').attributes('aria-label')).toBe('Close')

    wrapper.unmount()
  })

  it('applies the side class and defaults to left', () => {
    const left = mount(DsDrawer, { props: { modelValue: false } })
    expect(left.get('.ntk-drawer').classes()).toContain('ntk-drawer--side-left')

    const right = mount(DsDrawer, { props: { modelValue: false, side: 'right' } })
    expect(right.get('.ntk-drawer').classes()).toContain('ntk-drawer--side-right')
  })

  it('emits update:modelValue=false on close button, escape, and backdrop', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true },
      slots: { default: '<a href="/home">Home</a>' },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.get('.ntk-drawer__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    const dialog = wrapper.get('.ntk-drawer')
    await dialog.trigger('cancel')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])

    await dialog.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([false])

    wrapper.unmount()
  })

  it('does not close on escape or backdrop when persistent', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, persistent: true },
      slots: { default: '<a href="/home">Home</a>' },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = wrapper.get('.ntk-drawer')
    await dialog.trigger('cancel')
    await dialog.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  it('closes when modelValue flips to false', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true },
      slots: { default: '<a href="/home">Home</a>' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.get('.ntk-drawer').element.hasAttribute('open')).toBe(true)

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.get('.ntk-drawer').element.hasAttribute('open')).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })
})

describe('DsAppShell', () => {
  it('renders exactly one main landmark and composes the layout slots', () => {
    const wrapper = mount(DsAppShell, {
      slots: {
        header: () => h(DsHeader, { title: 'App' }),
        sidebar: () => h(DsSidebar, null, { default: () => h('a', { href: '/home' }, 'Home') }),
        footer: () => h(DsFooter, null, { default: () => 'Footer' }),
        default: () => h('p', 'Body content'),
      },
    })

    const root = wrapper.get('.ntk-app-shell')
    expect(root.element.tagName).toBe('DIV')
    expect(wrapper.findAll('main')).toHaveLength(1)
    expect(wrapper.get('.ntk-app-shell__main').element.tagName).toBe('MAIN')
    expect(wrapper.get('.ntk-app-shell__main p').text()).toBe('Body content')
    expect(wrapper.find('header.ntk-header').exists()).toBe(true)
    expect(wrapper.find('aside.ntk-sidebar').exists()).toBe(true)
    expect(wrapper.find('footer.ntk-footer').exists()).toBe(true)
  })

  it('renders with only the default slot', () => {
    const wrapper = mount(DsAppShell, { slots: { default: '<p class="only">Just content</p>' } })

    expect(wrapper.findAll('main')).toHaveLength(1)
    expect(wrapper.get('.ntk-app-shell__main .only').text()).toBe('Just content')
  })

  it('toggles the drawerOpen v-model through the header slot toggle helper', async () => {
    const wrapper = mount(DsAppShell, {
      props: { drawerOpen: false },
      slots: {
        header: (slotProps: { toggleDrawer: () => void }) =>
          h('button', { type: 'button', class: 'shell-toggle', onClick: slotProps.toggleDrawer }, 'Toggle'),
        default: () => h('p', 'Body'),
      },
    })

    await wrapper.get('.shell-toggle').trigger('click')
    expect(wrapper.emitted('update:drawerOpen')?.[0]).toEqual([true])
  })

  it('has no accessibility violations for a composed shell', async () => {
    const wrapper = mount(DsAppShell, {
      attachTo: document.body,
      slots: {
        header: () => h(DsHeader, { title: 'NetToolsKit', showMenu: true, menuLabel: 'Open menu' }),
        sidebar: () => h(DsSidebar, { ariaLabel: 'Primary' }, {
          default: () => h('a', { href: '/home' }, 'Home'),
        }),
        footer: () => h(DsFooter, null, { default: () => 'All rights reserved' }),
        default: () => h('h1', 'Dashboard'),
      },
    })
    await nextTick()

    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])
    wrapper.unmount()
  })

  it('has no accessibility violations for an open drawer', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, title: 'Navigation', closeLabel: 'Close menu' },
      slots: { default: () => h('a', { href: '/home' }, 'Home') },
      attachTo: document.body,
    })
    await nextTick()

    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])
    wrapper.unmount()
  })
})