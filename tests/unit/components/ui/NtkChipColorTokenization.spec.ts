import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkChip from '../../../../src/components/ui/NtkChip.vue'

describe('NtkChip color tokenization', () => {
  it('keeps primary styling in classes instead of passing Quasar palette props', () => {
    const wrapper = shallowMount(NtkChip, {
      props: { variant: 'primary' },
      slots: { default: 'Primary chip' },
    })

    const chip = wrapper.find('q-chip-stub')
    expect(chip.attributes('color')).toBeUndefined()
    expect(chip.classes()).toContain('ntk-chip--primary')
  })
})
