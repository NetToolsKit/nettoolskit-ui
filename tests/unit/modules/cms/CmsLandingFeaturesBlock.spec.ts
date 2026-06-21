/**
 * Tests/unit/modules/cms/Cms Landing Features Block spec module.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import CmsLandingFeaturesBlock from '../../../../src/modules/cms/blocks/landing/CmsLandingFeaturesBlock.vue'

const defaultItems = [
  {
    id: 'feature-1',
    title: 'Feature One',
    description: 'Description',
    icon: '🧩',
  },
]

function mockCardRect(element: Element): void {
  Object.defineProperty(element, 'getBoundingClientRect', {
    value: () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 120,
      right: 200,
      bottom: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  })
}

async function dispatchPointerEvent(element: Element, type: string, clientX: number, clientY: number): Promise<void> {
  element.dispatchEvent(new MouseEvent(type, {
    bubbles: true,
    clientX,
    clientY,
  }))
  await nextTick()
}

describe('CmsLandingFeaturesBlock', () => {
  it('renders cinematic class when cinematic cards are enabled', () => {
    const wrapper = mount(CmsLandingFeaturesBlock, {
      props: {
        title: 'Features',
        items: defaultItems,
        cinematicCardsEnabled: true,
      },
    })

    expect(wrapper.find('.cms-features-card').classes()).toContain('cms-features-card--cinematic')
  })

  it('updates tilt and glow CSS vars on pointer move', async () => {
    const wrapper = mount(CmsLandingFeaturesBlock, {
      props: {
        title: 'Features',
        items: defaultItems,
        cinematicCardsEnabled: true,
        cinematicCardsTilt: 8,
        cinematicCardsGlow: 0.4,
      },
    })

    const card = wrapper.find('.cms-features-card')
    mockCardRect(card.element)

    await dispatchPointerEvent(card.element, 'pointerenter', 100, 60)
    await dispatchPointerEvent(card.element, 'pointermove', 160, 30)

    const style = card.attributes('style') ?? ''
    expect(style).toContain('--cms-card-tilt-x')
    expect(style).toContain('--cms-card-tilt-y')
    expect(style).toContain('--cms-card-glow-x')
    expect(style).toContain('--cms-card-glow-y')
  })

  it('disables cinematic class when feature is turned off', () => {
    const wrapper = mount(CmsLandingFeaturesBlock, {
      props: {
        title: 'Features',
        items: defaultItems,
        cinematicCardsEnabled: false,
      },
    })

    expect(wrapper.find('.cms-features-card').classes()).not.toContain('cms-features-card--cinematic')
  })
})
