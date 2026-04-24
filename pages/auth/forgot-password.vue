<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useSeoMeta({ title: 'Reset Password', robots: 'noindex' })

const email = ref('')
const submitted = ref(false)
const loading = ref(false)
const error = ref('')
const uiStore = useUiStore()

async function handleSubmit() {
  error.value = ''
  if (!email.value) {
    error.value = 'Email is required'
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/forgot-password', { method: 'POST', body: { email: email.value } })
    submitted.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-sm animate-fade-up">
      <!-- Success state -->
      <div v-if="submitted" class="text-center">
        <div class="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-7 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Check your email</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          We sent a password reset link to <strong class="text-zinc-700 dark:text-zinc-300">{{ email }}</strong>
        </p>
        <NuxtLink to="/auth/login">
          <AppButton variant="secondary" full>Back to sign in</AppButton>
        </NuxtLink>
      </div>

      <!-- Form state -->
      <template v-else>
        <NuxtLink to="/auth/login" class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to sign in
        </NuxtLink>

        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Reset your password</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <AppInput
            v-model="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            :error="error"
            required
            autocomplete="email"
          />

          <AppButton type="submit" :loading="loading" full size="lg">
            Send reset link
          </AppButton>
        </form>
      </template>
    </div>
  </div>
</template>
