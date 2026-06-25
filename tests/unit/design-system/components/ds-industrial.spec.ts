/**
 * Industrial desktop components (capability slice 1): DsCommandIcon,
 * DsQuickAccessToolbar, DsRibbon(+Group/+Command).
 *
 * Covers: rendered structure, axe cleanliness (WCAG A/AA, contrast disabled in
 * jsdom), roving-tabindex keyboard navigation for the toolbar, ribbon tab
 * keyboard navigation with aria-selected, the controlled unknown-icon fallback
 * (and that it never degrades to text initials), and `command` emission.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import {
  DsCommandIcon,
  DsQuickAccessToolbar,
  DsRibbon,
  DsRibbonCommand,
  DsRibbonGroup,
} from '@/design-system/vue'
import {
  getNtkQuickAccessNextId,
  getNtkRibbonNextTabId,
  ntkCommandIconNames,
  resetNtkCommandIconWarnings,
  type NtkQuickAccessItem,
  type NtkRibbonTab,
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

const quickItems: NtkQuickAccessItem[] = [
  { id: 'new', label: 'New', icon: 'new' },
  { id: 'save', label: 'Save', icon: 'save', selected: true },
  { id: 'open', label: 'Open', icon: 'open', disabled: true },
  { id: 'run', label: 'Run', icon: 'run', intent: 'success' },
]

const ribbonTabs: NtkRibbonTab[] = [
  {
    id: 'home',
    label: 'Home',
    groups: [
      {
        id: 'clipboard',
        label: 'Clipboard',
        commands: [
          { id: 'cut', label: 'Cut', icon: 'cut' },
          { id: 'copy', label: 'Copy', icon: 'copy' },
        ],
      },
    ],
  },
  {
    id: 'view',
    label: 'View',
    groups: [
      {
        id: 'zoom',
        label: 'Zoom',
        commands: [{ id: 'zoom-in', label: 'Zoom in', icon: 'zoom-in' }],
      },
    ],
  },
]

beforeEach(() => {
  resetNtkCommandIconWarnings()
})

describe('getNtkQuickAccessNextId (pure roving resolver)', () => {
  const ids = ['a', 'b', 'c']

  it('returns undefined for an empty id list', () => {
    expect(getNtkQuickAccessNextId([], 'a', 'ArrowRight')).toBeUndefined()
    expect(getNtkQuickAccessNextId([], undefined, 'Home')).toBeUndefined()
  })

  it('maps Home/End to the first/last id', () => {
    expect(getNtkQuickAccessNextId(ids, 'b', 'Home')).toBe('a')
    expect(getNtkQuickAccessNextId(ids, 'b', 'End')).toBe('c')
  })

  it('enters at an end when there is no (or unknown) current id', () => {
    expect(getNtkQuickAccessNextId(ids, undefined, 'ArrowRight')).toBe('a')
    expect(getNtkQuickAccessNextId(ids, undefined, 'ArrowLeft')).toBe('c')
    expect(getNtkQuickAccessNextId(ids, 'zzz', 'ArrowDown')).toBe('a')
    expect(getNtkQuickAccessNextId(ids, 'zzz', 'ArrowUp')).toBe('c')
  })

  it('moves and wraps with horizontal and vertical arrows', () => {
    expect(getNtkQuickAccessNextId(ids, 'a', 'ArrowRight')).toBe('b')
    expect(getNtkQuickAccessNextId(ids, 'c', 'ArrowRight')).toBe('a')
    expect(getNtkQuickAccessNextId(ids, 'a', 'ArrowLeft')).toBe('c')
    expect(getNtkQuickAccessNextId(ids, 'b', 'ArrowDown')).toBe('c')
    expect(getNtkQuickAccessNextId(ids, 'a', 'ArrowUp')).toBe('c')
  })
})

describe('getNtkRibbonNextTabId (pure roving resolver)', () => {
  const ids = ['home', 'view', 'run']

  it('returns undefined for an empty id list', () => {
    expect(getNtkRibbonNextTabId([], 'home', 'ArrowRight')).toBeUndefined()
  })

  it('maps Home/End to the first/last id', () => {
    expect(getNtkRibbonNextTabId(ids, 'view', 'Home')).toBe('home')
    expect(getNtkRibbonNextTabId(ids, 'view', 'End')).toBe('run')
  })

  it('enters at an end when there is no (or unknown) active id', () => {
    expect(getNtkRibbonNextTabId(ids, undefined, 'ArrowRight')).toBe('home')
    expect(getNtkRibbonNextTabId(ids, 'zzz', 'ArrowLeft')).toBe('run')
  })

  it('moves and wraps with Left/Right', () => {
    expect(getNtkRibbonNextTabId(ids, 'home', 'ArrowRight')).toBe('view')
    expect(getNtkRibbonNextTabId(ids, 'run', 'ArrowRight')).toBe('home')
    expect(getNtkRibbonNextTabId(ids, 'home', 'ArrowLeft')).toBe('run')
  })
})

describe('DsCommandIcon', () => {
  it('renders an inline SVG glyph for a known name, decorative by default', () => {
    const wrapper = mount(DsCommandIcon, { props: { name: 'save' } })
    const svg = wrapper.get('svg')

    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    expect(svg.attributes('fill')).toBe('none')
    expect(svg.attributes('stroke')).toBe('currentColor')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('role')).toBeUndefined()
    // Known glyph renders real SVG path geometry.
    expect(svg.element.innerHTML).toContain('path')
    expect(svg.classes()).toContain('ntk-command-icon')
  })

  it('exposes role="img" + aria-label when a label is given', () => {
    const wrapper = mount(DsCommandIcon, { props: { name: 'run', label: 'Run' } })
    const svg = wrapper.get('svg')

    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('Run')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
  })

  it('renders a controlled fallback glyph for an unknown name (never text initials)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(DsCommandIcon, {
      // Deliberately invalid name; cast through unknown to bypass the closed union.
      props: { name: 'definitely-not-an-icon' as unknown as never },
    })
    const svg = wrapper.get('svg')

    // Fallback is SVG geometry, NOT a text node / letter.
    expect(svg.element.innerHTML).toContain('rect')
    expect(svg.text().trim()).toBe('')
    // No single-letter "initials" leaked into the rendered output.
    expect(svg.element.textContent ?? '').not.toMatch(/[A-Za-z]/)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('warns at most once per unknown name in dev', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(DsCommandIcon, { props: { name: 'mystery' as unknown as never } })
    mount(DsCommandIcon, { props: { name: 'mystery' as unknown as never } })
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('ships every documented command name in the registry', () => {
    const expected = [
      'new', 'open', 'save', 'run', 'stop', 'pause', 'undo', 'redo', 'cut',
      'copy', 'paste', 'delete', 'search', 'settings', 'help', 'zoom-in',
      'zoom-out', 'grid', 'close', 'menu', 'chevron-down',
    ]
    for (const name of expected) {
      expect(ntkCommandIconNames).toContain(name)
    }
  })

  it('has no accessibility violations as a labelled icon', async () => {
    const wrapper = mount(DsCommandIcon, {
      props: { name: 'settings', label: 'Settings' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsQuickAccessToolbar', () => {
  it('renders a labelled toolbar of icon-only buttons with accessible names', () => {
    const wrapper = mount(DsQuickAccessToolbar, { props: { items: quickItems } })

    const toolbar = wrapper.get('[role="toolbar"]')
    expect(toolbar.attributes('aria-label')).toBe('Quick access toolbar')

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(quickItems.length)
    expect(buttons[0].attributes('aria-label')).toBe('New')
    // Selected item reflects aria-pressed.
    expect(buttons[1].attributes('aria-pressed')).toBe('true')
    expect(buttons[0].attributes('aria-pressed')).toBeUndefined()
    // Disabled item is disabled.
    expect(buttons[2].attributes('disabled')).toBeDefined()
  })

  it('uses a single tab stop (roving tabindex)', () => {
    const wrapper = mount(DsQuickAccessToolbar, { props: { items: quickItems } })
    const buttons = wrapper.findAll('button')
    const tabbable = buttons.filter((b) => b.attributes('tabindex') === '0')
    expect(tabbable).toHaveLength(1)
    // The selected enabled item owns the tab stop.
    expect(tabbable[0].attributes('aria-label')).toBe('Save')
  })

  it('moves roving focus with ArrowRight/Home/End, skipping disabled items', async () => {
    const wrapper = mount(DsQuickAccessToolbar, {
      props: { items: quickItems },
      attachTo: document.body,
    })
    const buttons = wrapper.findAll('button')

    // Start at "Save" (index 1), ArrowRight skips disabled "Open" -> "Run".
    await buttons[1].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(buttons[3].attributes('tabindex')).toBe('0')
    expect(document.activeElement).toBe(buttons[3].element)

    // End -> last enabled ("Run"), Home -> first enabled ("New").
    await buttons[3].trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(buttons[0].attributes('tabindex')).toBe('0')
    expect(document.activeElement).toBe(buttons[0].element)

    wrapper.unmount()
  })

  it('emits command(id) on click and ignores disabled items', async () => {
    const wrapper = mount(DsQuickAccessToolbar, { props: { items: quickItems } })
    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await buttons[2].trigger('click') // disabled "Open"

    expect(wrapper.emitted('command')).toEqual([['new']])
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsQuickAccessToolbar, {
      props: { items: quickItems },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsRibbon', () => {
  it('renders a tablist with roving tabindex and the active tab groups', () => {
    const wrapper = mount(DsRibbon, { props: { tabs: ribbonTabs, activeTab: 'home' } })

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs).toHaveLength(2)
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(tabs[0].attributes('tabindex')).toBe('0')
    expect(tabs[1].attributes('tabindex')).toBe('-1')

    // Active tab's group + commands render in a tabpanel.
    expect(wrapper.get('[role="tabpanel"]').exists()).toBe(true)
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('Clipboard')
    expect(wrapper.findAll('.ntk-ribbon-command')).toHaveLength(2)
  })

  it('changes the active tab via ArrowRight and emits update:activeTab', async () => {
    const wrapper = mount(DsRibbon, {
      props: { tabs: ribbonTabs, activeTab: 'home' },
      attachTo: document.body,
    })
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:activeTab')).toEqual([['view']])

    // Re-render with the new active tab to assert aria-selected moved.
    await wrapper.setProps({ activeTab: 'view' })
    const updatedTabs = wrapper.findAll('[role="tab"]')
    expect(updatedTabs[1].attributes('aria-selected')).toBe('true')
    expect(updatedTabs[0].attributes('aria-selected')).toBe('false')

    wrapper.unmount()
  })

  it('emits command(id) when a ribbon command is activated', async () => {
    const wrapper = mount(DsRibbon, { props: { tabs: ribbonTabs, activeTab: 'home' } })
    const commands = wrapper.findAll('.ntk-ribbon-command')

    await commands[1].trigger('click') // "Copy"
    expect(wrapper.emitted('command')).toEqual([['copy']])
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsRibbon, {
      props: { tabs: ribbonTabs, activeTab: 'home' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

describe('DsRibbonGroup + DsRibbonCommand', () => {
  it('renders a labelled group of commands and emits command(id)', async () => {
    const wrapper = mount(DsRibbonGroup, {
      props: {
        label: 'Clipboard',
        commands: [
          { id: 'cut', label: 'Cut', icon: 'cut' },
          { id: 'paste', label: 'Paste', icon: 'paste', disabled: true },
        ],
      },
    })

    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('Clipboard')
    const buttons = wrapper.findAll('.ntk-ribbon-command')
    expect(buttons).toHaveLength(2)

    await buttons[0].trigger('click')
    await buttons[1].trigger('click') // disabled
    expect(wrapper.emitted('command')).toEqual([['cut']])
  })

  it('DsRibbonCommand reflects selected via aria-pressed and emits click', async () => {
    const selected = mount(DsRibbonCommand, {
      props: { label: 'Grid', icon: 'grid', selected: true },
    })
    expect(selected.get('button').attributes('aria-pressed')).toBe('true')

    const plain = mount(DsRibbonCommand, { props: { label: 'Find', icon: 'search' } })
    expect(plain.get('button').attributes('aria-pressed')).toBeUndefined()
    await plain.get('button').trigger('click')
    expect(plain.emitted('click')).toHaveLength(1)
  })
})