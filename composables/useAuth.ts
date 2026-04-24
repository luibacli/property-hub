import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

interface ApiError {
  data?: { message?: string }
  message?: string
}

function extractMessage(err: unknown, fallback: string): string {
  const e = err as ApiError
  return e?.data?.message ?? fallback
}

export function useAuth() {
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const router = useRouter()

  async function login(credentials: { email: string; password: string }) {
    try {
      const data = await $fetch<{ user: { id: string; name: string; email: string; createdAt?: string } }>(
        '/api/auth/login',
        { method: 'POST', body: credentials },
      )
      authStore.setUser(data.user)
      uiStore.success('Welcome back!', `Signed in as ${data.user.name}`)
      await router.push('/profile')
    } catch (err: unknown) {
      uiStore.error('Sign in failed', extractMessage(err, 'Invalid email or password'))
      throw err
    }
  }

  async function register(payload: { name: string; email: string; password: string }) {
    try {
      const data = await $fetch<{ user: { id: string; name: string; email: string; createdAt?: string } }>(
        '/api/auth/register',
        { method: 'POST', body: payload },
      )
      authStore.setUser(data.user)
      uiStore.success('Account created!', `Welcome to Property Hub, ${data.user.name}`)
      await router.push('/profile')
    } catch (err: unknown) {
      uiStore.error('Registration failed', extractMessage(err, 'Could not create account'))
      throw err
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      authStore.clear()
      uiStore.info('Signed out', 'See you next time!')
      await router.push('/')
    } catch {
      authStore.clear()
      await router.push('/')
    }
  }

  return { login, register, logout }
}
