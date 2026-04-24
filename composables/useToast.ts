import { useUiStore } from '~/stores/ui'

export function useToast() {
  const store = useUiStore()

  return {
    success: (title: string, message?: string) => store.success(title, message),
    error: (title: string, message?: string) => store.error(title, message),
    warning: (title: string, message?: string) => store.warning(title, message),
    info: (title: string, message?: string) => store.info(title, message),
  }
}
