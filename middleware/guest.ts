import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.fetchUser()
  }

  if (authStore.isAuthenticated) {
    return navigateTo('/profile')
  }
})
