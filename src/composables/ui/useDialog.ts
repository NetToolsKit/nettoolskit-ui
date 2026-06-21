/**
 * useDialog - Composable for managing dialogs/modals.
 * 
 * Simplifies open/close control with reactive state and optional callbacks.
 * 
 * @example
 * const dialog = useDialog()
 * const confirmDialog = useDialog({ onClose: () => console.log('Closed') })
 * 
 * dialog.open()
 * dialog.close()
 * dialog.toggle()
 */

import { ref, computed } from 'vue'

export interface UseDialogOptions {
  initialState?: boolean
  onOpen?: () => void
  onClose?: () => void
  onToggle?: (isOpen: boolean) => void
}

/**
 * Composable useDialog
 * 
 * @param options - Dialog configuration options
 * @returns Object with dialog state and methods
 */
export function useDialog(options: UseDialogOptions = {}) {
  const {
    initialState = false,
    onOpen,
    onClose,
    onToggle
  } = options

  // Dialog state
  const isOpen = ref(initialState)

  /**
   * Computed: Check if closed
   */
  const isClosed = computed(() => !isOpen.value)

  /**
   * Opens the dialog
   */
  const open = () => {
    if (!isOpen.value) {
      isOpen.value = true
      onOpen?.()
      onToggle?.(true)
    }
  }

  /**
   * Closes the dialog
   */
  const close = () => {
    if (isOpen.value) {
      isOpen.value = false
      onClose?.()
      onToggle?.(false)
    }
  }

  /**
   * Toggles dialog state
   */
  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  /**
   * Resets to the initial state.
   */
  const reset = () => {
    isOpen.value = initialState
  }

  return {
    isOpen,
    isClosed,
    open,
    close,
    toggle,
    reset
  }
}

/**
 * useDialogConfirm - Composable for confirmation dialogs
 * 
 * Specialization of useDialog for confirmations with Promise
 * 
 * @example
 * const { open, confirm, cancel } = useDialogConfirm()
 * 
 * const result = await open()
 * if (result) {
 *   // User confirmed
 * }
 */
export function useDialogConfirm(options: UseDialogOptions = {}) {
  const dialog = useDialog(options)
  let resolvePromise: ((value: boolean) => void) | null = null

  /**
   * Opens the dialog and returns a Promise that resolves to true/false.
   */
  const openWithPromise = (): Promise<boolean> => {
    dialog.open()
    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  /**
   * Confirms and closes the dialog, resolving with true.
   */
  const confirm = () => {
    dialog.close()
    resolvePromise?.(true)
    resolvePromise = null
  }

  /**
   * Cancels and closes the dialog, resolving with false.
   */
  const cancel = () => {
    dialog.close()
    resolvePromise?.(false)
    resolvePromise = null
  }

  return {
    ...dialog,
    open: openWithPromise,
    confirm,
    cancel
  }
}
