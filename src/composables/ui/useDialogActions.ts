/**
 * Src/composables/ui/use Dialog Actions module.
 */

import { useQuasar } from 'quasar'
import { useNotification } from '../services/useNotification'

const destructiveActionStyle = {
  background: 'var(--ntk-dialog-action-danger-bg, var(--semantic-error-primary, var(--ntk-error)))',
  color: 'var(--ntk-dialog-action-danger-text, var(--ntk-text-on-primary, var(--ntk-text-inverse)))'
} as const

/**
 * useDialog - Composable for confirmation dialogs.
 * 
 * Standardized wrapper for Quasar Dialog with common confirmations.
 * Reusable across the application.
 * 
 * @example
 * const { confirmDialog, deleteDialog } = useDialogActions()
 * await confirmDialog('Do you want to continue?')
 * await deleteDialog('Delete user?')
 */
export function useDialogActions() {
  const $q = useQuasar()
  const { success, info } = useNotification()

  /**
   * Generic confirmation dialog.
   */
  const confirmDialog = (message: string, title = 'Confirmation'): Promise<boolean> => {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        cancel: true,
        persistent: true
      }).onOk(() => {
        success('Action confirmed.')
        resolve(true)
      }).onCancel(() => {
        info('Action canceled.')
        resolve(false)
      })
    })
  }

  /**
   * Delete confirmation dialog.
   */
  const deleteDialog = (message: string, title = 'Confirm deletion'): Promise<boolean> => {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        persistent: true,
        ok: {
          label: 'Delete',
          class: 'ntk-dialog-action ntk-dialog-action--danger',
          style: destructiveActionStyle,
          unelevated: true
        },
        cancel: {
          label: 'Cancel',
          flat: true
        }
      }).onOk(() => {
        success('Item deleted successfully.')
        resolve(true)
      }).onCancel(() => {
        resolve(false)
      })
    })
  }

  /**
   * Custom dialog.
   */
  const customDialog = (options: {
    title: string
    message: string
    onConfirm?: () => void
    onCancel?: () => void
  }): void => {
    $q.dialog({
      title: options.title,
      message: options.message,
      cancel: true,
      persistent: true
    }).onOk(() => {
      if (options.onConfirm) {
        options.onConfirm()
      }
    }).onCancel(() => {
      if (options.onCancel) {
        options.onCancel()
      }
    })
  }

  return {
    confirmDialog,
    deleteDialog,
    customDialog
  }
}
