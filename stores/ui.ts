import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface UiState {
  toasts: Toast[]
  mobileNavOpen: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    toasts: [],
    mobileNavOpen: false,
  }),

  actions: {
    addToast(toast: Omit<Toast, 'id'>) {
      const id = Math.random().toString(36).slice(2)
      this.toasts.push({ ...toast, id })

      const duration = toast.duration ?? 4000
      if (duration > 0) {
        setTimeout(() => this.removeToast(id), duration)
      }
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    success(title: string, message?: string) {
      this.addToast({ type: 'success', title, message })
    },

    error(title: string, message?: string) {
      this.addToast({ type: 'error', title, message, duration: 6000 })
    },

    warning(title: string, message?: string) {
      this.addToast({ type: 'warning', title, message })
    },

    info(title: string, message?: string) {
      this.addToast({ type: 'info', title, message })
    },

    toggleMobileNav() {
      this.mobileNavOpen = !this.mobileNavOpen
    },

    closeMobileNav() {
      this.mobileNavOpen = false
    },
  },
})
