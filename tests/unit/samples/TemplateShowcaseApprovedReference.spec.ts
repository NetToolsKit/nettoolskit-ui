import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TemplateShowcaseLayoutDashboardExample from '../../../samples/template-showcase/examples/layout-dashboard/TemplateShowcaseLayoutDashboardExample.vue'

describe('TemplateShowcase approved reference example', () => {
  it('keeps the approved sample brand locked to Atlas Flow', () => {
    const wrapper = mount(TemplateShowcaseLayoutDashboardExample, {
      global: {
        renderStubDefaultSlot: true,
        stubs: {
          MainLayoutTemplate: {
            props: ['appName'],
            template: `
              <div class="main-layout-stub">
                <div class="main-layout-stub__app-name">{{ appName }}</div>
                <slot name="brand" />
                <slot
                  name="header-actions"
                  :layout-controls="{
                    horizontalMode: false,
                    setHorizontalMode: () => {},
                    showLabelsInMini: false,
                    setShowLabelsInMini: () => {},
                    sideMenuVariant: 'reference',
                    setSideMenuVariant: () => {},
                  }"
                />
                <slot />
              </div>
            `,
          },
          UserMenuTemplate: {
            props: ['appName'],
            template: '<div class="user-menu-stub">{{ appName }}</div>',
          },
          DashboardTemplate: {
            template: '<div class="dashboard-stub"><slot name="charts" /></div>',
          },
          TemplateShowcaseReferenceCharts: {
            template: '<div class="charts-stub" />',
          },
          SampleActionStatus: {
            template: '<div class="status-stub" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Atlas Flow')
    expect(wrapper.find('.main-layout-stub__app-name').text()).toBe('Atlas Flow')
    expect(wrapper.find('img').attributes('alt')).toBe('Atlas Flow')
  })
})
