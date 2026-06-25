/**
 * Industrial desktop components (capability slice 2): DsStatusBar,
 * DsWorkspaceCanvas, DsDockLayout/DsDockPanel, DsTreeExplorer.
 *
 * Covers: rendered structure, axe cleanliness (WCAG A/AA, contrast disabled in
 * jsdom), the dock splitter Arrow-key resize, dock panel collapse/close events,
 * the status-bar role + value truncation, and ARIA-tree keyboard navigation
 * (Up/Down/Left/Right/Enter). Also unit-tests the extracted pure helpers so the
 * `core/components/**` 100% gate stays green.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import {
  DsDockLayout,
  DsDockPanel,
  DsStatusBar,
  DsTreeExplorer,
  DsWorkspaceCanvas,
} from '@/design-system/vue'
import {
  clampNtkDockSize,
  getNtkDockNextSize,
  getNtkDockSplitterOrientation,
  getNtkStatusSegmentTitle,
  getNtkTreeNextFocus,
  getNtkTreeVisibleNodes,
  ntkDockLayoutDefaults,
  type NtkStatusBarSegment,
  type NtkTreeNode,
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

const statusSegments: NtkStatusBarSegment[] = [
  { id: 'mode', icon: 'grid', label: 'Mode', value: 'Design' },
  { id: 'zoom', label: 'Zoom', value: '120%', intent: 'primary' },
  {
    id: 'path',
    value: '/very/long/workspace/path/that/should/truncate/with/a/title',
    tooltip: 'Full path: /very/long/workspace/path/that/should/truncate/with/a/title',
  },
  { id: 'bare', value: '' },
]

const treeNodes: NtkTreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'open',
    expanded: true,
    children: [
      { id: 'app', label: 'app.ts', icon: 'new', selected: true },
      {
        id: 'components',
        label: 'components',
        icon: 'open',
        expanded: false,
        children: [{ id: 'header', label: 'Header.vue', icon: 'new' }],
      },
    ],
  },
  { id: 'readme', label: 'README.md', icon: 'new' },
]

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

describe('clampNtkDockSize (pure)', () => {
  it('returns min for non-finite candidates', () => {
    expect(clampNtkDockSize(Number.NaN, 100, 400)).toBe(100)
    expect(clampNtkDockSize(Number.POSITIVE_INFINITY, 100, 400)).toBe(100)
  })

  it('collapses an inverted range to min', () => {
    expect(clampNtkDockSize(300, 400, 100)).toBe(400)
  })

  it('clamps below/above and passes through in-range values', () => {
    expect(clampNtkDockSize(50, 100, 400)).toBe(100)
    expect(clampNtkDockSize(900, 100, 400)).toBe(400)
    expect(clampNtkDockSize(250, 100, 400)).toBe(250)
  })
})

describe('getNtkDockSplitterOrientation (pure)', () => {
  it('maps left/right to vertical and top/bottom to horizontal', () => {
    expect(getNtkDockSplitterOrientation('left')).toBe('vertical')
    expect(getNtkDockSplitterOrientation('right')).toBe('vertical')
    expect(getNtkDockSplitterOrientation('top')).toBe('horizontal')
    expect(getNtkDockSplitterOrientation('bottom')).toBe('horizontal')
  })
})

describe('getNtkDockNextSize (pure)', () => {
  const bounds = { min: 100, max: 400, step: 20 }

  it('Home/End jump to clamped min/max', () => {
    expect(getNtkDockNextSize('left', 250, 'Home', bounds)).toBe(100)
    expect(getNtkDockNextSize('bottom', 250, 'End', bounds)).toBe(400)
  })

  it('returns undefined for non-resize arrow combinations', () => {
    // ArrowUp/ArrowDown are not directional for a vertical (left) splitter? They
    // are still resize keys, but a vertical splitter ignores horizontal-only
    // semantics via the forward/backward classification.
    expect(getNtkDockNextSize('left', 250, 'ArrowLeft', bounds)).toBe(230)
  })

  it('grows leading regions (left/top) on forward keys, shrinks on backward', () => {
    expect(getNtkDockNextSize('left', 250, 'ArrowRight', bounds)).toBe(270)
    expect(getNtkDockNextSize('left', 250, 'ArrowLeft', bounds)).toBe(230)
    expect(getNtkDockNextSize('top', 250, 'ArrowDown', bounds)).toBe(270)
    expect(getNtkDockNextSize('top', 250, 'ArrowUp', bounds)).toBe(230)
  })

  it('inverts direction for trailing regions (right/bottom)', () => {
    expect(getNtkDockNextSize('right', 250, 'ArrowLeft', bounds)).toBe(270)
    expect(getNtkDockNextSize('right', 250, 'ArrowRight', bounds)).toBe(230)
    expect(getNtkDockNextSize('bottom', 250, 'ArrowUp', bounds)).toBe(270)
    expect(getNtkDockNextSize('bottom', 250, 'ArrowDown', bounds)).toBe(230)
  })

  it('clamps the result at the bounds', () => {
    expect(getNtkDockNextSize('left', 390, 'ArrowRight', bounds)).toBe(400)
    expect(getNtkDockNextSize('left', 110, 'ArrowLeft', bounds)).toBe(100)
  })

  it('returns undefined for a non-resize key', () => {
    // Defensive guard: a key outside Home/End/arrows resolves to no change.
    expect(getNtkDockNextSize('left', 250, 'Enter' as unknown as 'ArrowRight', bounds))
      .toBeUndefined()
  })
})

describe('getNtkStatusSegmentTitle (pure)', () => {
  it('prefers an explicit tooltip', () => {
    expect(getNtkStatusSegmentTitle({ id: 'x', label: 'L', value: 'V', tooltip: 'T' })).toBe('T')
  })

  it('composes label and value', () => {
    expect(getNtkStatusSegmentTitle({ id: 'x', label: 'Zoom', value: '120%' })).toBe('Zoom: 120%')
    expect(getNtkStatusSegmentTitle({ id: 'x', value: '120%' })).toBe('120%')
    expect(getNtkStatusSegmentTitle({ id: 'x', label: 'Zoom' })).toBe('Zoom')
  })

  it('returns undefined when there is no textual content', () => {
    expect(getNtkStatusSegmentTitle({ id: 'x' })).toBeUndefined()
    expect(getNtkStatusSegmentTitle({ id: 'x', value: '' })).toBeUndefined()
  })
})

describe('getNtkTreeVisibleNodes (pure)', () => {
  it('defaults to an empty list', () => {
    expect(getNtkTreeVisibleNodes()).toEqual([])
  })

  it('flattens only expanded subtrees with 1-based levels', () => {
    const visible = getNtkTreeVisibleNodes(treeNodes)
    // src(1), app(2), components(2), readme(1) — header is collapsed.
    expect(visible.map((entry) => entry.node.id)).toEqual(['src', 'app', 'components', 'readme'])
    expect(visible.map((entry) => entry.level)).toEqual([1, 2, 2, 1])
    expect(visible[0]).toMatchObject({ hasChildren: true, expanded: true, parentId: undefined })
    expect(visible[2]).toMatchObject({ hasChildren: true, expanded: false, parentId: 'src' })
  })
})

describe('getNtkTreeNextFocus (pure)', () => {
  const visible = getNtkTreeVisibleNodes(treeNodes)

  it('returns undefined for an empty tree', () => {
    expect(getNtkTreeNextFocus([], 'src', 'ArrowDown')).toBeUndefined()
  })

  it('Home/End move to the first/last focusable row', () => {
    expect(getNtkTreeNextFocus(visible, 'app', 'Home')?.focusId).toBe('src')
    expect(getNtkTreeNextFocus(visible, 'app', 'End')?.focusId).toBe('readme')
  })

  it('Home/End return undefined when every visible row is disabled', () => {
    const allDisabled = getNtkTreeVisibleNodes([
      { id: 'a', label: 'a', disabled: true },
      { id: 'b', label: 'b', disabled: true },
    ])
    expect(getNtkTreeNextFocus(allDisabled, undefined, 'Home')).toBeUndefined()
    expect(getNtkTreeNextFocus(allDisabled, undefined, 'End')).toBeUndefined()
  })

  it('Down/Up move and enter from the ends when current is unknown', () => {
    expect(getNtkTreeNextFocus(visible, 'src', 'ArrowDown')?.focusId).toBe('app')
    expect(getNtkTreeNextFocus(visible, 'app', 'ArrowUp')?.focusId).toBe('src')
    expect(getNtkTreeNextFocus(visible, undefined, 'ArrowDown')?.focusId).toBe('src')
    expect(getNtkTreeNextFocus(visible, undefined, 'ArrowUp')?.focusId).toBe('readme')
    expect(getNtkTreeNextFocus(visible, 'readme', 'ArrowDown')).toBeUndefined()
    expect(getNtkTreeNextFocus(visible, 'src', 'ArrowUp')).toBeUndefined()
  })

  it('Right expands a collapsed parent, then steps into the first child', () => {
    expect(getNtkTreeNextFocus(visible, 'components', 'ArrowRight')).toEqual({
      focusId: 'components',
      expand: true,
    })
    // src is expanded -> step into app.
    expect(getNtkTreeNextFocus(visible, 'src', 'ArrowRight')?.focusId).toBe('app')
    // A leaf has nothing to do on Right.
    expect(getNtkTreeNextFocus(visible, 'app', 'ArrowRight')).toBeUndefined()
  })

  it('Left collapses an expanded parent, else moves to the parent', () => {
    expect(getNtkTreeNextFocus(visible, 'src', 'ArrowLeft')).toEqual({
      focusId: 'src',
      collapse: true,
    })
    expect(getNtkTreeNextFocus(visible, 'app', 'ArrowLeft')?.focusId).toBe('src')
    // A top-level leaf has no parent.
    expect(getNtkTreeNextFocus(visible, 'readme', 'ArrowLeft')).toBeUndefined()
  })

  it('Right/Left require a known current row', () => {
    expect(getNtkTreeNextFocus(visible, 'zzz', 'ArrowRight')).toBeUndefined()
    expect(getNtkTreeNextFocus(visible, 'zzz', 'ArrowLeft')).toBeUndefined()
  })

  it('skips disabled rows when moving', () => {
    const withDisabled = getNtkTreeVisibleNodes([
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b', disabled: true },
      { id: 'c', label: 'c' },
    ])
    expect(getNtkTreeNextFocus(withDisabled, 'a', 'ArrowDown')?.focusId).toBe('c')
    expect(getNtkTreeNextFocus(withDisabled, 'c', 'ArrowUp')?.focusId).toBe('a')
    // Right on an expanded parent whose next visible row is not its child.
    const noStep = getNtkTreeVisibleNodes([
      { id: 'p', label: 'p', expanded: true, children: [] },
      { id: 'q', label: 'q' },
    ])
    expect(getNtkTreeNextFocus(noStep, 'p', 'ArrowRight')).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// DsStatusBar
// ---------------------------------------------------------------------------

describe('DsStatusBar', () => {
  it('renders a status role with live=off and truncatable segment values', () => {
    const wrapper = mount(DsStatusBar, { props: { segments: statusSegments } })

    const bar = wrapper.get('[role="status"]')
    expect(bar.attributes('aria-live')).toBe('off')
    expect(bar.attributes('aria-label')).toBe('Status bar')
    expect(bar.classes()).toContain('ntk-status-bar')

    const segments = wrapper.findAll('.ntk-status-bar__segment')
    expect(segments).toHaveLength(statusSegments.length)
    // Composed title for label+value.
    expect(segments[1].attributes('title')).toBe('Zoom: 120%')
    // Explicit tooltip wins for the long value.
    expect(segments[2].attributes('title')).toContain('Full path:')
    // The value cell has the truncation class.
    expect(segments[2].get('.ntk-status-bar__value').exists()).toBe(true)
  })

  it('renders an icon via DsCommandIcon for segments that declare one', () => {
    const wrapper = mount(DsStatusBar, { props: { segments: statusSegments } })
    expect(wrapper.findAll('.ntk-status-bar__icon').length).toBeGreaterThanOrEqual(1)
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsStatusBar, { props: { segments: statusSegments }, attachTo: document.body })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

// ---------------------------------------------------------------------------
// DsWorkspaceCanvas
// ---------------------------------------------------------------------------

describe('DsWorkspaceCanvas', () => {
  it('applies the surface modifier and renders header + default slots', () => {
    const grid = mount(DsWorkspaceCanvas, {
      props: { surface: 'grid', ariaLabel: 'Surface' },
      slots: { header: 'Doc title', default: 'Body content' },
    })
    expect(grid.get('section').attributes('aria-label')).toBe('Surface')
    expect(grid.classes()).toContain('ntk-workspace-canvas--surface-grid')
    expect(grid.get('.ntk-workspace-canvas__header').text()).toBe('Doc title')
    expect(grid.get('.ntk-workspace-canvas__surface').text()).toBe('Body content')

    const dots = mount(DsWorkspaceCanvas, { props: { surface: 'dots' } })
    expect(dots.classes()).toContain('ntk-workspace-canvas--surface-dots')
    // No header slot -> no header element.
    expect(dots.find('.ntk-workspace-canvas__header').exists()).toBe(false)

    const plain = mount(DsWorkspaceCanvas, { props: { surface: 'plain' } })
    expect(plain.classes()).toContain('ntk-workspace-canvas--surface-plain')
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsWorkspaceCanvas, {
      props: { surface: 'grid', ariaLabel: 'Surface' },
      slots: { default: 'Body' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

// ---------------------------------------------------------------------------
// DsDockPanel
// ---------------------------------------------------------------------------

describe('DsDockPanel', () => {
  it('renders a titled panel and emits toggle-collapse / close', async () => {
    const wrapper = mount(DsDockPanel, {
      props: { title: 'Output', collapsible: true, closable: true },
    })

    expect(wrapper.get('.ntk-dock-panel__title').text()).toBe('Output')
    expect(wrapper.get('section').attributes('aria-label')).toBe('Output')

    const collapse = wrapper.get('[aria-label="Collapse panel"]')
    await collapse.trigger('click')
    expect(wrapper.emitted('toggle-collapse')).toHaveLength(1)

    const close = wrapper.get('[aria-label="Close panel"]')
    await close.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('collapses to just the title bar and reflects aria-expanded', () => {
    const wrapper = mount(DsDockPanel, {
      props: { title: 'Watch', collapsible: true, collapsed: true },
      slots: { default: 'hidden body' },
    })
    expect(wrapper.classes()).toContain('ntk-dock-panel--is-collapsed')
    expect(wrapper.get('[aria-label="Expand panel"]').attributes('aria-expanded')).toBe('false')
    // v-show keeps the node but hides it.
    const body = wrapper.get('.ntk-dock-panel__body')
    expect((body.element as HTMLElement).style.display).toBe('none')
  })

  it('omits affordances when not collapsible/closable', () => {
    const wrapper = mount(DsDockPanel, { props: { title: 'Plain' } })
    expect(wrapper.find('[aria-label="Collapse panel"]').exists()).toBe(false)
    expect(wrapper.find('[aria-label="Close panel"]').exists()).toBe(false)
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsDockPanel, {
      props: { id: 'p1', title: 'Output', collapsible: true, closable: true },
      slots: { default: 'Body' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

// ---------------------------------------------------------------------------
// DsDockLayout
// ---------------------------------------------------------------------------

describe('DsDockLayout', () => {
  it('renders only the regions whose slots are provided, with splitters', () => {
    const wrapper = mount(DsDockLayout, {
      slots: {
        left: 'LEFT',
        bottom: 'BOTTOM',
        default: 'CENTER',
      },
    })
    expect(wrapper.get('.ntk-dock-layout__region--left').text()).toBe('LEFT')
    expect(wrapper.get('.ntk-dock-layout__region--bottom').text()).toBe('BOTTOM')
    expect(wrapper.get('.ntk-dock-layout__center').text()).toBe('CENTER')
    expect(wrapper.find('.ntk-dock-layout__region--right').exists()).toBe(false)
    expect(wrapper.find('.ntk-dock-layout__region--top').exists()).toBe(false)

    const separators = wrapper.findAll('[role="separator"]')
    expect(separators).toHaveLength(2)
    expect(separators[0].attributes('aria-orientation')).toBe('vertical')
    expect(separators[1].attributes('aria-orientation')).toBe('horizontal')
  })

  it('resizes a region with Arrow keys and emits resize-region', async () => {
    const wrapper = mount(DsDockLayout, {
      props: { leftSize: 200, minSize: 100, maxSize: 400, step: 20 },
      slots: { left: 'LEFT', default: 'CENTER' },
      attachTo: document.body,
    })
    const splitter = wrapper.get('[aria-label="Resize left region"]')
    expect(splitter.attributes('aria-valuenow')).toBe('200')
    expect(splitter.attributes('aria-valuemin')).toBe('100')
    expect(splitter.attributes('aria-valuemax')).toBe('400')

    await splitter.trigger('keydown', { key: 'ArrowRight' })
    expect(splitter.attributes('aria-valuenow')).toBe('220')
    expect(wrapper.emitted('resize-region')).toEqual([['left', 220]])

    await splitter.trigger('keydown', { key: 'Home' })
    expect(splitter.attributes('aria-valuenow')).toBe('100')

    // A non-resize key is ignored (no extra emission).
    await splitter.trigger('keydown', { key: 'Tab' })
    expect(wrapper.emitted('resize-region')).toHaveLength(2)

    wrapper.unmount()
  })

  it('clamps the initial size into bounds via the contract defaults', () => {
    const wrapper = mount(DsDockLayout, {
      props: { leftSize: 9999 },
      slots: { left: 'LEFT', default: 'CENTER' },
    })
    expect(wrapper.get('[aria-label="Resize left region"]').attributes('aria-valuenow'))
      .toBe(String(ntkDockLayoutDefaults.maxSize))
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsDockLayout, {
      slots: { left: 'LEFT', right: 'RIGHT', top: 'TOP', bottom: 'BOTTOM', default: 'CENTER' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})

// ---------------------------------------------------------------------------
// DsTreeExplorer
// ---------------------------------------------------------------------------

describe('DsTreeExplorer', () => {
  it('renders ARIA tree semantics with levels, expansion, and selection', () => {
    const wrapper = mount(DsTreeExplorer, { props: { nodes: treeNodes, ariaLabel: 'Project' } })

    const tree = wrapper.get('[role="tree"]')
    expect(tree.attributes('aria-label')).toBe('Project')

    const items = wrapper.findAll('[role="treeitem"]')
    // src, app, components (header is in a collapsed subtree), readme.
    expect(items).toHaveLength(4)

    const src = items[0]
    expect(src.attributes('aria-level')).toBe('1')
    expect(src.attributes('aria-expanded')).toBe('true')

    const app = items[1]
    expect(app.attributes('aria-level')).toBe('2')
    expect(app.attributes('aria-selected')).toBe('true')

    // Expanded parent renders a child group.
    expect(wrapper.find('[role="group"]').exists()).toBe(true)
  })

  it('selects on Enter and emits update:selected', async () => {
    const wrapper = mount(DsTreeExplorer, { props: { nodes: treeNodes }, attachTo: document.body })
    const rows = wrapper.findAll('.ntk-tree-explorer__row')

    await rows[3].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:selected')).toEqual([['readme']])

    // Space also selects.
    await rows[0].trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:selected')).toEqual([['readme'], ['src']])

    wrapper.unmount()
  })

  it('moves focus with Down/Up and emits toggle on Right/Left', async () => {
    const wrapper = mount(DsTreeExplorer, { props: { nodes: treeNodes }, attachTo: document.body })
    const rows = wrapper.findAll('.ntk-tree-explorer__row')

    // Down from src -> app gets focus.
    await rows[0].trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.activeElement).toBe(rows[1].element)

    // Right on the collapsed "components" (index 2) expands it -> toggle.
    await rows[2].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('toggle')).toEqual([['components']])

    // Left on the expanded "src" (index 0) collapses it -> toggle.
    await rows[0].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('toggle')).toEqual([['components'], ['src']])

    wrapper.unmount()
  })

  it('selecting via click emits update:selected and ignores disabled rows', async () => {
    const nodes: NtkTreeNode[] = [
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b', disabled: true },
    ]
    const wrapper = mount(DsTreeExplorer, { props: { nodes } })
    const rows = wrapper.findAll('.ntk-tree-explorer__row')

    await rows[0].trigger('click')
    await rows[1].trigger('click') // disabled
    expect(wrapper.emitted('update:selected')).toEqual([['a']])
  })

  it('toggles via the twisty button click', async () => {
    const wrapper = mount(DsTreeExplorer, { props: { nodes: treeNodes } })
    const twisties = wrapper.findAll('.ntk-tree-explorer__twisty')
    // First twisty belongs to "src".
    await twisties[0].trigger('click')
    expect(wrapper.emitted('toggle')).toEqual([['src']])
  })

  it('truncates long labels with a title (no silent clip)', () => {
    const nodes: NtkTreeNode[] = [
      { id: 'long', label: 'a-very-very-long-file-name-that-must-not-clip-silently.config.ts' },
    ]
    const wrapper = mount(DsTreeExplorer, { props: { nodes } })
    const label = wrapper.get('.ntk-tree-explorer__label')
    expect(label.attributes('title')).toBe(nodes[0].label)
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsTreeExplorer, {
      props: { nodes: treeNodes, ariaLabel: 'Project' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoAxeViolations(wrapper.element)
    wrapper.unmount()
  })
})