/**
 * Src/composables/ui/use Dialog Actions module.
 */

import { useQuasar } from 'quasar'
import { useNotification } from '../services/useNotification'

/**
 * useDialog - Composable para diálogos de confirmação
 * 
 * Wrapper padronizado para Quasar Dialog com confirmações comuns.
 * Reutilizável em toda a aplicação.
 * 
 * @example
 * const { confirmDialog, deleteDialog } = useDialogActions()
 * await confirmDialog('Deseja continuar?')
 * await deleteDialog('Excluir usuário?')
 */
export function useDialogActions() {
  const $q = useQuasar()
  const { success, info } = useNotification()

  /**
   * Dialog de confirmação genérico
   */
  const confirmDialog = (message: string, title = 'Confirmação'): Promise<boolean> => {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        cancel: true,
        persistent: true
      }).onOk(() => {
        success('Ação confirmada!')
        resolve(true)
      }).onCancel(() => {
        info('Ação cancelada.')
        resolve(false)
      })
    })
  }

  /**
   * Dialog de exclusão com confirmação
   */
  const deleteDialog = (message: string, title = 'Confirmar Exclusão'): Promise<boolean> => {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        persistent: true,
        ok: {
          label: 'Excluir',
          color: 'negative',
          unelevated: true
        },
        cancel: {
          label: 'Cancelar',
          flat: true
        }
      }).onOk(() => {
        success('Item excluído com sucesso!')
        resolve(true)
      }).onCancel(() => {
        resolve(false)
      })
    })
  }

  /**
   * Dialog customizado
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