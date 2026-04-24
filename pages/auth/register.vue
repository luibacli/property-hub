<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useSeoMeta({ title: 'Create Account', robots: 'noindex' })

const { register } = useAuth()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errors = reactive<Record<string, string>>({})
const loading = ref(false)

async function handleSubmit() {
  Object.keys(errors).forEach((k) => delete errors[k])

  if (!form.name || form.name.length < 2) errors['name'] = 'Name must be at least 2 characters'
  if (!form.email) errors['email'] = 'Email is required'
  if (!form.password || form.password.length < 8) errors['password'] = 'Password must be at least 8 characters'
  if (form.password !== form.confirmPassword) errors['confirmPassword'] = 'Passwords do not match'
  if (Object.keys(errors).length) return

  loading.value = true
  try {
    await register({ name: form.name, email: form.email, password: form.password })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed'
    errors['form'] = msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex">
    <!-- Left panel — image -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden">
      <NuxtImg
        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80"
        alt="Beautiful property"
        class="size-full object-cover"
        loading="eager"
        width="900"
        height="1200"
      />
      <div class="absolute inset-0 bg-gradient-to-l from-white/10 dark:from-zinc-950/20 to-zinc-950/40" />
      <div class="absolute bottom-12 left-10 right-10 text-white">
        <p class="text-lg font-medium leading-relaxed mb-3">
          "Listed my property on a Friday and had three serious inquiries by Monday morning."
        </p>
        <p class="text-sm text-white/70">— Michael R., Austin</p>
      </div>
    </div>

    <!-- Right panel — form -->
    <div class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-sm animate-fade-up">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Create an account
          </h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Join Property Hub — free, no credit card required
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <AppInput
            v-model="form.name"
            label="Full name"
            type="text"
            placeholder="Alex Morgan"
            :error="errors['name']"
            required
            autocomplete="name"
          />

          <AppInput
            v-model="form.email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            :error="errors['email']"
            required
            autocomplete="email"
          />

          <AppInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            :error="errors['password']"
            hint="Minimum 8 characters"
            required
            autocomplete="new-password"
          />

          <AppInput
            v-model="form.confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            :error="errors['confirmPassword']"
            required
            autocomplete="new-password"
          />

          <p v-if="errors['form']" class="text-sm text-red-500 text-center">{{ errors['form'] }}</p>

          <AppButton type="submit" :loading="loading" full size="lg">
            Create account
          </AppButton>
        </form>

        <p class="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-medium text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
