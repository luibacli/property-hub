<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Account Settings — PropertyHub' })

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

const showDeleteModal = ref(false)

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
        <div class="card p-6 border border-red-200 dark:border-red-900/50">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Danger zone</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Permanently delete your account and all associated data.</p>
          <AppButton variant="danger" size="sm" @click="showDeleteModal = true">Delete account</AppButton>
        </div>
      </div>
    </div>

    <!-- Delete account confirmation modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" @click="showDeleteModal = false" />
          <div class="relative w-full max-w-sm card p-6 animate-fade-up">
            <div class="size-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 text-center mb-1">Delete account?</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-2">This would permanently remove your account, listings, and saved properties.</p>
            <p class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 text-center mb-6">
              This is a demo app — account deletion is disabled.
            </p>
            <div class="flex gap-3">
              <AppButton variant="secondary" full @click="showDeleteModal = false">Cancel</AppButton>
              <AppButton variant="danger" full disabled>Delete account</AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { @apply transition-opacity duration-200; }
.fade-enter-from, .fade-leave-to { @apply opacity-0; }
</style>
