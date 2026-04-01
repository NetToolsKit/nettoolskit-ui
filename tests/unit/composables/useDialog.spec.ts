import { describe, expect, it, vi } from 'vitest'
import { useDialog, useDialogConfirm } from '../../../src/composables/ui/useDialog'

// ─── useDialog ─────────────────────────────────────────────────────────────

describe('useDialog', () => {
  it('starts closed by default', () => {
    const { isOpen, isClosed } = useDialog()
    expect(isOpen.value).toBe(false)
    expect(isClosed.value).toBe(true)
  })

  it('starts open when initialState is true', () => {
    const { isOpen } = useDialog({ initialState: true })
    expect(isOpen.value).toBe(true)
  })

  it('opens via open()', () => {
    const { isOpen, open } = useDialog()
    open()
    expect(isOpen.value).toBe(true)
  })

  it('closes via close()', () => {
    const { isOpen, open, close } = useDialog()
    open()
    close()
    expect(isOpen.value).toBe(false)
  })

  it('toggles state via toggle()', () => {
    const { isOpen, toggle } = useDialog()
    toggle()
    expect(isOpen.value).toBe(true)
    toggle()
    expect(isOpen.value).toBe(false)
  })

  it('resets to initialState via reset()', () => {
    const { isOpen, open, reset } = useDialog({ initialState: false })
    open()
    reset()
    expect(isOpen.value).toBe(false)
  })

  it('calls onOpen callback when opened', () => {
    const onOpen = vi.fn()
    const { open } = useDialog({ onOpen })
    open()
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('calls onClose callback when closed', () => {
    const onClose = vi.fn()
    const { open, close } = useDialog({ onClose })
    open()
    close()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onToggle with new state on every open/close', () => {
    const onToggle = vi.fn()
    const { open, close } = useDialog({ onToggle })
    open()
    expect(onToggle).toHaveBeenLastCalledWith(true)
    close()
    expect(onToggle).toHaveBeenLastCalledWith(false)
  })

  it('does not fire onOpen if already open', () => {
    const onOpen = vi.fn()
    const { open } = useDialog({ initialState: true, onOpen })
    open()
    expect(onOpen).not.toHaveBeenCalled()
  })
})

// ─── useDialogConfirm ──────────────────────────────────────────────────────

describe('useDialogConfirm', () => {
  it('resolves true when confirm() is called', async () => {
    const { open, confirm } = useDialogConfirm()
    const resultPromise = open()
    confirm()
    const result = await resultPromise
    expect(result).toBe(true)
  })

  it('resolves false when cancel() is called', async () => {
    const { open, cancel } = useDialogConfirm()
    const resultPromise = open()
    cancel()
    const result = await resultPromise
    expect(result).toBe(false)
  })

  it('closes dialog after confirm', async () => {
    const { isOpen, open, confirm } = useDialogConfirm()
    open()
    expect(isOpen.value).toBe(true)
    confirm()
    await Promise.resolve()
    expect(isOpen.value).toBe(false)
  })
})