import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import OriginalReferenceApp from '../../../samples/original-reference/OriginalReferenceApp.vue'

describe('OriginalReferenceApp', () => {
  it('keeps the single public sample locked to Atlas Flow without showcase copy', () => {
    const wrapper = mount(OriginalReferenceApp, {
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
                <slot name="floating" />
              </div>
            `,
          },
          UserMenuTemplate: {
            props: ['appName', 'accountLabel', 'signOutLabel'],
            template: '<div class="user-menu-stub">{{ appName }} {{ accountLabel }} {{ signOutLabel }}</div>',
          },
          DashboardTemplate: {
            template: '<div class="dashboard-stub"><slot name="charts" /></div>',
          },
          OriginalReferenceCharts: {
            template: '<div class="charts-stub" />',
          },
          PlaceholderTemplate: {
            template: '<div class="placeholder-stub" />',
          },
          'q-btn': {
            props: ['label'],
            template: '<button>{{ label }}<slot /></button>',
          },
          'q-tooltip': {
            template: '<div><slot /></div>',
          },
          'q-dialog': {
            template: '<div><slot /></div>',
          },
          'q-card': {
            template: '<div><slot /></div>',
          },
          'q-card-section': {
            template: '<div><slot /></div>',
          },
          'q-card-actions': {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Atlas Flow')
    expect(wrapper.text()).toContain('Back to dashboard')
    expect(wrapper.text()).toContain('Open landing')
    expect(wrapper.text()).toContain('Open assistant')
    expect(wrapper.text()).not.toContain('Open packs')
    expect(wrapper.find('.main-layout-stub__app-name').text()).toBe('Atlas Flow')
    expect(wrapper.find('img').attributes('alt')).toBe('Atlas Flow')
  })
})
