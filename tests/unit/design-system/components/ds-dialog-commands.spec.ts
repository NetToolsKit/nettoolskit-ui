/**
 * DsDialog — native Invoker Commands sync (`commandfor`/`command`).
 *
 * jsdom does not implement the invoker plumbing, so these tests dispatch the
 * events a supporting browser would fire (a `command` event followed by the
 * built-in show-modal, and a `close` event on native close) and assert the
 * v-model mirror stays consistent.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsDialog } from '@/design-system/vue'

const dispatchCommand = (el: HTMLElement, command: string, source: Element | null = null): void => {
  const event = new Event('command')
  Object.defineProperty(event, 'command', { value: command })
  Object.defineProperty(event, 'source', { value: source })
  el.dispatchEvent(event)
  if (command === 'show-modal') {
    // Mimic the browser's built-in behavior that follows the command event.
    el.setAttribute('open', '')
  }
}

describe('DsDialog invoker commands', () => {
  it('mirrors a show-modal command into v-model and emits open', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'cmd-dialog', modelValue: false },
      attachTo: document.body,
    })
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    dispatchCommand(dialog, 'show-modal')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('open')).toHaveLength(1)
    wrapper.unmount()
  })

  it('does not re-run the open path when v-model catches up after a command open', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'cmd-dialog-sync', modelValue: false },
      attachTo: document.body,
    })
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    dispatchCommand(dialog, 'show-modal')
    await nextTick()
    await wrapper.setProps({ modelValue: true })
    await nextTick()

    expect(wrapper.emitted('open')).toHaveLength(1)
    wrapper.unmount()
  })

  it('ignores custom (`--`) and unknown commands', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'cmd-dialog-custom', modelValue: false },
      attachTo: document.body,
    })
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    dispatchCommand(dialog, '--pin')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('open')).toBeUndefined()
    wrapper.unmount()
  })

  it('mirrors a native close (command/form method=dialog) back into v-model', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'cmd-dialog-close', modelValue: true },
      attachTo: document.body,
    })
    await nextTick()
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    dialog.removeAttribute('open')
    dialog.dispatchEvent(new Event('close'))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('does not double-emit when the close originated from v-model itself', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'cmd-dialog-own-close', modelValue: true },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    // closeDialog() dispatches the native close; modelValue is already false,
    // so onNativeClose must not emit another update.
    wrapper.get('dialog').element.dispatchEvent(new Event('close'))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })
})