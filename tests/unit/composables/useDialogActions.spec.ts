import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  dialog: vi.fn(),
  success: vi.fn(),
  info: vi.fn()
}))

vi.mock('quasar', () => ({
  useQuasar: () => ({
    dialog: mocks.dialog
  })
}))

vi.mock('../../../src/composables/services/useNotification', () => ({
  useNotification: () => ({
    success: mocks.success,
    info: mocks.info
  })
}))

describe('useDialogActions', () => {
  beforeEach(() => {
    mocks.dialog.mockReset()
    mocks.success.mockReset()
    mocks.info.mockReset()

    mocks.dialog.mockReturnValue({
      onOk: vi.fn().mockReturnThis(),
      onCancel: vi.fn().mockReturnThis()
    })
  })

  it('keeps delete confirmation action on tokenized colors instead of Quasar palette names', async () => {
    const { useDialogActions } = await import('../../../src/composables/ui/useDialogActions')
    const { deleteDialog } = useDialogActions()

    void deleteDialog('Delete this record?')

    const dialogOptions = mocks.dialog.mock.calls[0]?.[0]

    expect(dialogOptions.ok).toMatchObject({
      label: 'Excluir',
      class: 'ntk-dialog-action ntk-dialog-action--danger',
      unelevated: true
    })
    expect(dialogOptions.ok).not.toHaveProperty('color')
    expect(dialogOptions.ok.style).toEqual({
      background: 'var(--ntk-dialog-action-danger-bg, var(--semantic-error-primary, var(--ntk-error)))',
      color: 'var(--ntk-dialog-action-danger-text, var(--ntk-text-on-primary, var(--ntk-text-inverse)))'
    })
  })
})
