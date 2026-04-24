import { defineStore } from 'pinia'
import type { AuthUser } from '~/types/user'

interface AuthState {
  user: (AuthUser & { favourites?: string[] }) | null
  loading: boolean
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
    userId: (state) => state.user?.id ?? null,
    userName: (state) => state.user?.name ?? '',
    isFavourite: (state) => (id: string) =>
      state.user?.favourites?.includes(id) ?? false,
  },

  actions: {
    setUser(user: AuthState['user']) {
      this.user = user
    },

    setFavourites(ids: string[]) {
      if (this.user) this.user.favourites = ids
    },

    clear() {
      this.user = null
    },

    async fetchUser() {
      this.loading = true
      try {
        const data = await $fetch<AuthUser & { favourites: string[] }>('/api/auth/me')
        this.user = data
      } catch {
        this.user = null
      } finally {
        this.loading = false
        this.initialized = true
      }
    },
  },
})
