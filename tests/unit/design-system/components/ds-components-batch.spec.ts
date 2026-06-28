/**
 * Batch coverage for the display/interaction primitive components
 * (DsBadge, DsTabs, DsTooltip, DsSkeleton, DsAvatar, DsBreadcrumbs).
 *
 * Each component asserts rendered structure, variant/state classes, and axe
 * cleanliness. DsTabs adds keyboard navigation; DsTooltip asserts the
 * `aria-describedby` wiring; DsBreadcrumbs asserts `aria-current="page"` on the
 * last item. The pure core helpers shipped alongside these recipes are also
 * exercised here to keep the deterministic core fully covered.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import {
  DsAvatar,
  DsBadge,
  DsBreadcrumbs,
  DsSkeleton,
  DsTabs,
  DsTooltip,
} from '@/design-system/vue'
import {
  getNtkAvatarInitials,
  getNtkTabsNextId,
  getNtkTooltipBubbleClasses,
  resolveNtkAvatarRecipe,
} from '@/design-system/core'

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

async function expectNoAxeViolations(element: Element): Promise<void> {
  const results = await axe.run(element, axeOptions)
  const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
  expect(results.violations, summary).toEqual([])
}

describe('DsBadge', () => {
  it('renders a labelled badge with default recipe classes', () => {
    const wrapper = mount(DsBadge, { props: { label: '7' } })

    const root = wrapper.get('.ntk-badge')
    expect(root.element.tagName).toBe('SPAN')
    expect(root.classes()).toEqual(expect.arrayContaining([
      'ntk-badge--variant-solid',
      'ntk-badge--size-md',
      'ntk-badge--intent-neutral',
    ]))
    expect(root.text()).toBe('7')
  })

  it('prefers the default slot over the label prop', () => {
    const wrapper = mount(DsBadge, { props: { label: 'fallback' }, slots: { default: 'New' } })
    expect(wrapper.get('.ntk-badge').text()).toBe('New')
  })

  it('applies variant, size, and intent classes', () => {
    const wrapper = mount(DsBadge, {
      props: { label: 'x', variant: 'soft', size: 'lg', intent: 'success' },
    })
    expect(wrapper.get('.ntk-badge').classes()).toEqual(expect.arrayContaining([
      'ntk-badge--variant-soft',
      'ntk-badge--size-lg',
      'ntk-badge--intent-success',
    ]))
  })

  it('renders a text-free status dot with an accessible label', () => {
    const wrapper = mount(DsBadge, { props: { dot: true, label: 'online', intent: 'success' } })
    const root = wrapper.get('.ntk-badge')
    expect(root.classes()).toContain('ntk-badge--is-dot')
    expect(root.attributes('role')).toBe('status')
    expect(root.attributes('aria-label')).toBe('online')
    expect(root.text()).toBe('')
  })

  it('renders a decorative leading dot before the label when leadingDot is set', () => {
    const wrapper = mount(DsBadge, { props: { label: 'Active', leadingDot: true, intent: 'success' } })
    const root = wrapper.get('.ntk-badge')
    expect(root.classes()).toContain('ntk-badge--has-leading-dot')
    const dot = wrapper.get('.ntk-badge__dot')
    expect(dot.attributes('aria-hidden')).toBe('true')
    expect(root.text()).toBe('Active')
  })

  it('omits the leading dot by default and for the text-free dot mode', () => {
    expect(mount(DsBadge, { props: { label: 'x' } }).find('.ntk-badge__dot').exists()).toBe(false)
    expect(mount(DsBadge, { props: { dot: true, leadingDot: true, label: 'y' } }).find('.ntk-badge__dot').exists())
      .toBe(false)
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsBadge, { props: { label: '3', intent: 'danger' }, attachTo: document.body })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsTabs', () => {
  const tabs = [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three', disabled: true },
    { id: 'four', label: 'Four' },
  ]

  it('renders a tablist with roving tabindex and a linked tabpanel', () => {
    const wrapper = mount(DsTabs, {
      props: { tabs, modelValue: 'one', ariaLabel: 'Sections' },
      slots: { default: 'Body for {{ activeId }}' },
    })

    const list = wrapper.get('[role="tablist"]')
    expect(list.attributes('aria-label')).toBe('Sections')

    const tabButtons = wrapper.findAll('[role="tab"]')
    expect(tabButtons).toHaveLength(4)

    const active = tabButtons[0]
    expect(active.attributes('aria-selected')).toBe('true')
    expect(active.attributes('tabindex')).toBe('0')
    expect(tabButtons[1].attributes('aria-selected')).toBe('false')
    expect(tabButtons[1].attributes('tabindex')).toBe('-1')
    expect(tabButtons[2].attributes('disabled')).toBeDefined()

    const panel = wrapper.get('[role="tabpanel"]')
    expect(panel.attributes('aria-labelledby')).toBe(active.attributes('id'))
    expect(panel.attributes('id')).toBe(active.attributes('aria-controls'))
  })

  it('falls back to the first enabled tab when modelValue is missing or invalid', () => {
    const disabledFirst = [{ id: 'a', label: 'A', disabled: true }, { id: 'b', label: 'B' }]
    const wrapper = mount(DsTabs, { props: { tabs: disabledFirst, modelValue: 'missing' } })
    const tabButtons = wrapper.findAll('[role="tab"]')
    expect(tabButtons[1].attributes('aria-selected')).toBe('true')
  })

  it('emits the active id when a tab is clicked but ignores disabled tabs', async () => {
    const wrapper = mount(DsTabs, { props: { tabs, modelValue: 'one' } })
    const tabButtons = wrapper.findAll('[role="tab"]')

    await tabButtons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two'])

    await tabButtons[2].trigger('click')
    // Disabled tab does not emit.
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('moves the active tab with arrow, Home, and End keys (skipping disabled)', async () => {
    const wrapper = mount(DsTabs, { props: { tabs, modelValue: 'one' }, attachTo: document.body })
    const firstTab = wrapper.findAll('[role="tab"]')[0]

    await firstTab.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['two'])

    await wrapper.setProps({ modelValue: 'two' })
    // ArrowRight from "two" skips disabled "three" and lands on "four".
    await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['four'])

    await wrapper.setProps({ modelValue: 'one' })
    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'ArrowLeft' })
    // ArrowLeft wraps to the last enabled tab.
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['four'])

    await wrapper.setProps({ modelValue: 'four' })
    await wrapper.findAll('[role="tab"]')[3].trigger('keydown', { key: 'Home' })
    // Home moves to the first enabled tab.
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['one'])

    await wrapper.setProps({ modelValue: 'one' })
    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'End' })
    // End moves to the last enabled tab.
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['four'])

    const emittedBefore = wrapper.emitted('update:modelValue')?.length ?? 0
    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'Enter' })
    // Non-navigation key is ignored.
    expect(wrapper.emitted('update:modelValue')?.length ?? 0).toBe(emittedBefore)

    wrapper.unmount()
  })

  it('renders a named panel slot for the active tab', () => {
    const wrapper = mount(DsTabs, {
      props: { tabs, modelValue: 'two' },
      slots: { 'panel-two': 'Second panel' },
    })
    expect(wrapper.get('[role="tabpanel"]').text()).toBe('Second panel')
  })

  it('renders no panel when there are no enabled tabs', () => {
    const wrapper = mount(DsTabs, { props: { tabs: [{ id: 'x', label: 'X', disabled: true }] } })
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(false)
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsTabs, {
      props: { tabs, modelValue: 'one', ariaLabel: 'Sections' },
      slots: { default: 'Panel body' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsTooltip', () => {
  it('shows the bubble and wires aria-describedby on hover', async () => {
    const wrapper = mount(DsTooltip, {
      props: { text: 'More info', id: 'tt' },
      slots: { default: '<button type="button">Help</button>' },
    })

    const root = wrapper.get('.ntk-tooltip')
    const bubble = wrapper.get('[role="tooltip"]')
    expect(bubble.attributes('id')).toBe('tt-tooltip')
    expect(root.attributes('aria-describedby')).toBeUndefined()
    expect(bubble.attributes('hidden')).toBeDefined()

    await root.trigger('mouseenter')
    expect(root.attributes('aria-describedby')).toBe('tt-tooltip')
    expect(wrapper.get('[role="tooltip"]').attributes('hidden')).toBeUndefined()

    await root.trigger('mouseleave')
    expect(root.attributes('aria-describedby')).toBeUndefined()
  })

  it('shows the bubble on focus of the trigger', async () => {
    const wrapper = mount(DsTooltip, {
      props: { text: 'Focus me' },
      slots: { default: '<button type="button">T</button>' },
    })
    const root = wrapper.get('.ntk-tooltip')
    await root.trigger('focusin')
    expect(root.attributes('aria-describedby')).toBe(wrapper.get('[role="tooltip"]').attributes('id'))
    await root.trigger('focusout')
    expect(root.attributes('aria-describedby')).toBeUndefined()
  })

  it('renders content from the #content slot and applies position/variant classes', () => {
    const wrapper = mount(DsTooltip, {
      props: { position: 'bottom', variant: 'soft' },
      slots: { default: '<button type="button">B</button>', content: 'Slot content' },
    })
    expect(wrapper.get('.ntk-tooltip').classes()).toContain('ntk-tooltip--variant-soft')
    const bubble = wrapper.get('[role="tooltip"]')
    expect(bubble.classes()).toContain('ntk-tooltip__bubble--position-bottom')
    expect(bubble.text()).toBe('Slot content')
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsTooltip, {
      props: { text: 'Tip' },
      slots: { default: '<button type="button">Action</button>' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsSkeleton', () => {
  it('renders decorative multi-line text placeholders', () => {
    const wrapper = mount(DsSkeleton, { props: { variant: 'text', lines: 3 } })
    const root = wrapper.get('.ntk-skeleton')
    expect(root.attributes('aria-hidden')).toBe('true')
    expect(root.classes()).toContain('ntk-skeleton--variant-text')
    expect(wrapper.findAll('.ntk-skeleton__line')).toHaveLength(3)
    expect(wrapper.findAll('.ntk-skeleton__line--last')).toHaveLength(1)
  })

  it('clamps the line count to at least one', () => {
    const wrapper = mount(DsSkeleton, { props: { variant: 'text', lines: 0 } })
    expect(wrapper.findAll('.ntk-skeleton__line')).toHaveLength(1)
  })

  it('renders block and circle variants without lines', () => {
    const block = mount(DsSkeleton, { props: { variant: 'block', size: 'lg' } })
    expect(block.get('.ntk-skeleton').classes()).toEqual(expect.arrayContaining([
      'ntk-skeleton--variant-block',
      'ntk-skeleton--size-lg',
    ]))
    expect(block.find('.ntk-skeleton__line').exists()).toBe(false)

    const circle = mount(DsSkeleton, { props: { variant: 'circle' } })
    expect(circle.get('.ntk-skeleton').classes()).toContain('ntk-skeleton--variant-circle')
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsSkeleton, { props: { variant: 'text', lines: 2 }, attachTo: document.body })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsAvatar', () => {
  it('derives initials from the name with an accessible label', () => {
    const wrapper = mount(DsAvatar, { props: { name: 'Ada Lovelace' } })
    const initials = wrapper.get('.ntk-avatar__initials')
    expect(initials.text()).toBe('AL')
    expect(initials.attributes('role')).toBe('img')
    expect(initials.attributes('aria-label')).toBe('Ada Lovelace')
    expect(wrapper.get('.ntk-avatar').classes()).toContain('ntk-avatar--shape-circle')
  })

  it('renders an image with alt text when src is provided', () => {
    const wrapper = mount(DsAvatar, { props: { name: 'Grace Hopper', src: 'avatar.png' } })
    const img = wrapper.get('.ntk-avatar__image')
    expect(img.attributes('src')).toBe('avatar.png')
    expect(img.attributes('alt')).toBe('Grace Hopper')
    expect(wrapper.find('.ntk-avatar__initials').exists()).toBe(false)
  })

  it('falls back to an icon when there is no image or name', () => {
    const wrapper = mount(DsAvatar, { props: { icon: '*' } })
    const icon = wrapper.get('.ntk-avatar__icon')
    expect(icon.text()).toBe('*')
    expect(icon.attributes('aria-label')).toBe('Avatar')
  })

  it('renders a status dot, shape, and size modifiers', () => {
    const wrapper = mount(DsAvatar, {
      props: { name: 'X', status: 'busy', shape: 'square', size: 'xl', variant: 'solid', intent: 'primary' },
    })
    expect(wrapper.get('.ntk-avatar').classes()).toEqual(expect.arrayContaining([
      'ntk-avatar--shape-square',
      'ntk-avatar--size-xl',
      'ntk-avatar--variant-solid',
      'ntk-avatar--intent-primary',
    ]))
    const status = wrapper.get('.ntk-avatar__status')
    expect(status.classes()).toContain('ntk-avatar__status--busy')
    expect(status.attributes('aria-label')).toBe('busy')
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsAvatar, { props: { name: 'Ada Lovelace', status: 'online' }, attachTo: document.body })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsBreadcrumbs', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'Item' },
  ]

  it('renders a nav landmark with an ordered trail', () => {
    const wrapper = mount(DsBreadcrumbs, { props: { items } })
    const nav = wrapper.get('nav.ntk-breadcrumbs')
    expect(nav.attributes('aria-label')).toBe('Breadcrumb')
    expect(wrapper.findAll('.ntk-breadcrumbs__item')).toHaveLength(3)
    expect(wrapper.findAll('.ntk-breadcrumbs__link')).toHaveLength(2)
  })

  it('marks the last item as the current page and not a link', () => {
    const wrapper = mount(DsBreadcrumbs, { props: { items } })
    const currents = wrapper.findAll('.ntk-breadcrumbs__current')
    const last = currents[currents.length - 1]
    expect(last.text()).toBe('Item')
    expect(last.attributes('aria-current')).toBe('page')
    expect(last.element.tagName).toBe('SPAN')
  })

  it('renders decorative separators between items only', () => {
    const wrapper = mount(DsBreadcrumbs, { props: { items, separator: '>' } })
    const separators = wrapper.findAll('.ntk-breadcrumbs__separator')
    expect(separators).toHaveLength(2)
    expect(separators[0].attributes('aria-hidden')).toBe('true')
    expect(separators[0].text()).toBe('>')
  })

  it('applies variant and size classes', () => {
    const wrapper = mount(DsBreadcrumbs, { props: { items, variant: 'subtle', size: 'lg' } })
    expect(wrapper.get('.ntk-breadcrumbs').classes()).toEqual(expect.arrayContaining([
      'ntk-breadcrumbs--variant-subtle',
      'ntk-breadcrumbs--size-lg',
    ]))
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsBreadcrumbs, { props: { items }, attachTo: document.body })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('core pure helpers', () => {
  it('getNtkAvatarInitials derives one or two initials and handles blanks', () => {
    expect(getNtkAvatarInitials('Ada Lovelace')).toBe('AL')
    expect(getNtkAvatarInitials('Ada')).toBe('A')
    expect(getNtkAvatarInitials('  Ada   Babbage  Lovelace ')).toBe('AL')
    expect(getNtkAvatarInitials('')).toBe('')
    expect(getNtkAvatarInitials(undefined)).toBe('')
    expect(getNtkAvatarInitials('   ')).toBe('')
  })

  it('resolveNtkAvatarRecipe defaults the shape and honours overrides', () => {
    expect(resolveNtkAvatarRecipe().classes).toContain('ntk-avatar--shape-circle')
    const squared = resolveNtkAvatarRecipe({ shape: 'square', class: 'extra' })
    expect(squared.classes).toEqual(expect.arrayContaining(['ntk-avatar--shape-square', 'extra']))
    expect(squared.shape).toBe('square')
  })

  it('getNtkTabsNextId navigates, wraps, and returns undefined for empty/no-op input', () => {
    const ids = ['a', 'b', 'c']
    expect(getNtkTabsNextId(ids, 'a', 'ArrowRight')).toBe('b')
    expect(getNtkTabsNextId(ids, 'c', 'ArrowRight')).toBe('a')
    expect(getNtkTabsNextId(ids, 'a', 'ArrowLeft')).toBe('c')
    expect(getNtkTabsNextId(ids, 'b', 'Home')).toBe('a')
    expect(getNtkTabsNextId(ids, 'b', 'End')).toBe('c')
    // An unknown/absent active id enters the list at the nearest end.
    expect(getNtkTabsNextId(ids, 'missing', 'ArrowRight')).toBe('a')
    expect(getNtkTabsNextId(ids, undefined, 'ArrowRight')).toBe('a')
    expect(getNtkTabsNextId(ids, undefined, 'ArrowLeft')).toBe('c')
    expect(getNtkTabsNextId([], undefined, 'ArrowRight')).toBeUndefined()
  })

  it('getNtkTooltipBubbleClasses defaults the position and merges extra classes', () => {
    expect(getNtkTooltipBubbleClasses()).toEqual([
      'ntk-tooltip__bubble',
      'ntk-tooltip__bubble--position-top',
    ])
    expect(getNtkTooltipBubbleClasses('right', { class: 'shadow' })).toEqual([
      'ntk-tooltip__bubble',
      'ntk-tooltip__bubble--position-right',
      'shadow',
    ])
  })
})