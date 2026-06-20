import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {
  DsPage,
  DsSection,
} from '@/design-system/vue'

describe('DsPage', () => {
  it('renders a main landmark with heading, slots, and recipe classes', () => {
    const wrapper = mount(DsPage, {
      props: {
        id: 'settings-page',
        testId: 'settings',
        title: 'Settings',
        subtitle: 'Configure tenant behavior',
        variant: 'dashboard',
        size: 'lg',
        intent: 'primary',
        class: ['custom-page'],
      },
      slots: {
        actions: '<button type="button">Create</button>',
        default: '<p>Body content</p>',
        footer: '<button type="button">Save</button>',
      },
    })

    const page = wrapper.get('main')

    expect(page.attributes('id')).toBe('settings-page')
    expect(page.attributes('data-testid')).toBe('settings')
    expect(page.attributes('aria-labelledby')).toBe('settings-page__title')
    expect(page.attributes('aria-label')).toBeUndefined()
    expect(page.get('h1').attributes('id')).toBe('settings-page__title')
    expect(page.text()).toContain('Settings')
    expect(page.text()).toContain('Configure tenant behavior')
    expect(page.find('.ntk-page__actions').text()).toContain('Create')
    expect(page.text()).toContain('Body content')
    expect(page.text()).toContain('Save')
    expect(page.classes()).toEqual(expect.arrayContaining([
      'ntk-page',
      'ntk-page--variant-dashboard',
      'ntk-page--size-lg',
      'ntk-page--intent-primary',
      'custom-page',
    ]))
  })

  it('uses a fallback accessible name when no title is rendered', () => {
    const wrapper = mount(DsPage, {
      props: {
        ariaLabel: 'Tenant shell',
      },
    })

    expect(wrapper.get('main').attributes('aria-label')).toBe('Tenant shell')
  })

  it('does not point aria-labelledby to replaced header content', () => {
    const wrapper = mount(DsPage, {
      props: {
        id: 'custom-page',
        title: 'Internal title',
        ariaLabel: 'Custom page heading',
      },
      slots: {
        header: '<h1>Custom heading</h1>',
      },
    })

    const page = wrapper.get('main')

    expect(page.attributes('aria-labelledby')).toBeUndefined()
    expect(page.attributes('aria-label')).toBe('Custom page heading')
    expect(page.text()).toContain('Custom heading')
  })
})

describe('DsSection', () => {
  it('renders a section landmark with heading content and recipe classes', () => {
    const wrapper = mount(DsSection, {
      props: {
        id: 'release-summary',
        testId: 'summary',
        eyebrow: 'Release',
        title: 'Summary',
        subtitle: 'Ready for review',
        headingLevel: 3,
        variant: 'accent',
        size: 'sm',
        intent: 'info',
        class: ['custom-section'],
      },
      slots: {
        actions: '<button type="button">Publish</button>',
        default: '<p>Section body</p>',
        footer: '<button type="button">Review</button>',
      },
    })

    const section = wrapper.get('section')

    expect(section.attributes('id')).toBe('release-summary')
    expect(section.attributes('data-testid')).toBe('summary')
    expect(section.attributes('aria-labelledby')).toBe('release-summary__title')
    expect(section.get('h3').attributes('id')).toBe('release-summary__title')
    expect(section.text()).toContain('Release')
    expect(section.text()).toContain('Summary')
    expect(section.text()).toContain('Ready for review')
    expect(section.find('.ntk-section__actions').text()).toContain('Publish')
    expect(section.text()).toContain('Section body')
    expect(section.text()).toContain('Review')
    expect(section.classes()).toEqual(expect.arrayContaining([
      'ntk-section',
      'ntk-section--variant-accent',
      'ntk-section--size-sm',
      'ntk-section--intent-info',
      'custom-section',
    ]))
  })

  it('uses a fallback accessible name when no title is rendered', () => {
    const wrapper = mount(DsSection, {
      props: {
        ariaLabel: 'Review filters',
      },
    })

    expect(wrapper.get('section').attributes('aria-label')).toBe('Review filters')
  })

  it('does not point aria-labelledby to replaced header content', () => {
    const wrapper = mount(DsSection, {
      props: {
        id: 'custom-section',
        title: 'Internal title',
        ariaLabel: 'Custom section heading',
      },
      slots: {
        header: '<h2>Custom heading</h2>',
      },
    })

    const section = wrapper.get('section')

    expect(section.attributes('aria-labelledby')).toBeUndefined()
    expect(section.attributes('aria-label')).toBe('Custom section heading')
    expect(section.text()).toContain('Custom heading')
  })
})