<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Account Settings — PropertyHub' })

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

// ── Profile form ──────────────────────────────────────────────────────────────
const profileForm = reactive({ name: authStore.user?.name ?? '' })
const profileErrors = ref<Record<string, string>>({})
const profileLoading = ref(false)

async function saveProfile() {
  profileErrors.value = {}
  if (!profileForm.name || profileForm.name.length < 2) {
    profileErrors.value.name = 'Name must be at least 2 characters'
    return
  }
  profileLoading.value = true
  try {
    const updated = await $fetch<{ id: string; name: string; email: string; favourites: string[]; createdAt: string }>(
      '/api/auth/me',
      { method: 'PUT', body: { name: profileForm.name } },
    )
    authStore.setUser({ ...authStore.user!, ...updated })
    uiStore.success('Profile updated!')
  } catch {
    uiStore.error('Could not update profile.')
  } finally {
    profileLoading.value = false
  }
}

// ── Password form ─────────────────────────────────────────────────────────────
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const passwordErrors = ref<Record<string, string>>({})
const passwordLoading = ref(false)

async function changePassword() {
  passwordErrors.value = {}
  if (!passwordForm.currentPassword) passwordErrors.value.currentPassword = 'Required'
  if (passwordForm.newPassword.length < 8) passwordErrors.value.newPassword = 'Minimum 8 characters'
  if (passwordForm.newPassword !== passwordForm.confirmPassword) passwordErrors.value.confirmPassword = 'Passwords do not match'
  if (Object.keys(passwordErrors.value).length) return

  passwordLoading.value = true
  try {
    await $fetch('/api/auth/password', {
      method: 'PUT',
      body: { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
    })
    uiStore.success('Password changed!')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    passwordErrors.value.currentPassword = e?.data?.message ?? 'Could not change password'
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10">
    <div class="max-w-xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <button
          class="size-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          @click="router.push('/profile')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Account settings</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Manage your profile and security</p>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Avatar / identity -->
        <div class="card p-6 flex items-center gap-5">
          <div class="size-16 rounded-2xl bg-brand-500 flex items-center justify-center text-2xl font-bold text-zinc-900 shrink-0 select-none">
            {{ authStore.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="font-semibold text-zinc-900 dark:text-zinc-100">{{ authStore.user?.name }}</p>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <!-- Profile details -->
        <div class="card p-6">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Profile</h2>
          <form class="space-y-4" @submit.prevent="saveProfile">
            <AppInput
              v-model="profileForm.name"
              label="Display name"
              placeholder="Your full name"
              :error="profileErrors.name"
              autocomplete="name"
            />
            <!-- Email — read only -->
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email address</label>
              <div class="h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 flex items-center text-sm text-zinc-400 dark:text-zinc-500">
                {{ authStore.user?.email }}
              </div>
              <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Email cannot be changed</p>
            </div>
            <div class="flex justify-end">
              <AppButton type="submit" :loading="profileLoading">Save changes</AppButton>
            </div>
          </form>
        </div>

        <!-- Change password -->
        <div class="card p-6">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Change password</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Choose a strong password with at least 8 characters.</p>
          <form class="space-y-4" @submit.prevent="changePassword">
            <AppInput
              v-model="passwordForm.currentPassword"
              label="Current password"
              type="password"
              placeholder="Enter your current password"
              :error="passwordErrors.currentPassword"
              autocomplete="current-password"
            />
            <AppInput
              v-model="passwordForm.newPassword"
              label="New password"
              type="password"
              placeholder="At least 8 characters"
              :error="passwordErrors.newPassword"
              autocomplete="new-password"
            />
            <AppInput
              v-model="passwordForm.confirmPassword"
              label="Confirm new password"
              type="password"
              placeholder="Repeat your new password"
              :error="passwordErrors.confirmPassword"
              autocomplete="new-password"
            />
            <div class="flex justify-end">
              <AppButton type="submit" :loading="passwordLoading">Update password</AppButton>
            </div>
          </form>
        </div>

        <!-- Danger zone -->
        <div class="card p-6 border-red-200 dark:border-red-900">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Danger zone</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">These actions are irreversible on this demo account.</p>
          <AppButton variant="danger" size="sm" @click="router.push('/profile')">Delete account</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
