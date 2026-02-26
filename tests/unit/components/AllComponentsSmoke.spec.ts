import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createLandingPageConfig } from '../../../src/config/landing/landing-page.config'

type VueComponentModule = {
  default: unknown
}

interface ComponentSmokeCase {
  fileName: string
  sourcePath: string
  component: unknown
  props: Record<string, unknown>
}

// Loads every Vue SFC from src/components so this suite protects coverage drift.
const componentModules = import.meta.glob<VueComponentModule>(
  '../../../src/components/**/*.vue',
  { eager: true }
)

const selectOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
]

const fieldLabel = { label: 'Field label' }

// Only components with required props need entries here.
const requiredPropsByFileName: Record<string, Record<string, unknown>> = {
  'BaseDatePicker.vue': fieldLabel,
  'BaseInput.vue': fieldLabel,
  'BaseMultiSelect.vue': { ...fieldLabel, options: selectOptions },
  'BaseSelect.vue': { ...fieldLabel, options: selectOptions },
  'BaseTextarea.vue': fieldLabel,
  'BaseTimePicker.vue': fieldLabel,
  'NtkSelect.vue': { ...fieldLabel, options: selectOptions },
  'NtkMultiSelect.vue': { ...fieldLabel, options: selectOptions },
  'NtkDatePicker.vue': fieldLabel,
  'NtkInput.vue': fieldLabel,
  'NtkTextarea.vue': fieldLabel,
  'NtkTimePicker.vue': fieldLabel,
  'NtkLandingComposer.vue': { config: createLandingPageConfig() },
  'NtkAppSidebar.vue': { menuItems: [{ label: 'Home', to: '/' }] },
  'NtkContactSection.vue': { title: 'Contact us' },
  'BaseFeatureCard.vue': { title: 'Feature title' },
  'NtkFeatureCard.vue': { title: 'Feature title' },
  'NtkInfoCard.vue': { title: 'Info title' },
  'MetricCard.vue': { label: 'Metric', value: '100', icon: 'insights' },
  'NtkMetricCard.vue': { label: 'Metric', value: '100', icon: 'insights' },
  'NtkMobileDrawer.vue': { modelValue: false },
  'BasePricingCard.vue': { title: 'Starter', price: '$9' },
  'NtkPricingCard.vue': { title: 'Starter', price: '$9' },
  'NtkSectionHeader.vue': { title: 'Section title' },
  'NtkServiceGrid.vue': { title: 'Services', services: [] },
  'NtkStatCard.vue': { value: 1200, label: 'Users' },
  'BaseSteps.vue': { steps: [{ title: 'Step 1' }] },
  'NtkStatsSection.vue': { title: 'Stats', items: [] },
  'NtkSteps.vue': { steps: [{ title: 'Step 1' }] },
  'NtkTechStack.vue': { title: 'Tech stack', categories: [] },
  'NtkTestimonialCard.vue': { quote: 'Great platform', author: 'Jane Doe' },
  'BaseCreditCard.vue': { icon: 'star', name: 'Starter credits', credits: 100 },
  'NtkCreditCard.vue': { icon: 'star', name: 'Starter credits', credits: 100 },
  'NtkCTASection.vue': {
    title: 'Start now',
    primaryCTA: { text: 'Try now', link: '#start' },
  },
}

const smokeCases: ComponentSmokeCase[] = Object
  .entries(componentModules)
  .map(([modulePath, moduleValue]) => {
    const normalizedPath = modulePath.replace(/\\/g, '/')
    const fileName = normalizedPath.split('/').pop() ?? normalizedPath
    return {
      fileName,
      sourcePath: normalizedPath,
      component: moduleValue.default,
      props: requiredPropsByFileName[fileName] ?? {},
    }
  })
  .sort((left, right) => left.fileName.localeCompare(right.fileName))

describe('All components smoke coverage', () => {
  it('discovers component files from src/components', () => {
    expect(smokeCases.length).toBeGreaterThan(0)
  })

  it('mounts every component at least once', () => {
    const failures: string[] = []

    for (const smokeCase of smokeCases) {
      try {
        const wrapper = shallowMount(smokeCase.component as never, {
          props: smokeCase.props,
        })
        expect(wrapper.exists()).toBe(true)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        failures.push(`${smokeCase.fileName} (${smokeCase.sourcePath}): ${message}`)
      }
    }

    expect(failures).toEqual([])
  })
})