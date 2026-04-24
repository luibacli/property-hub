<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useSeoMeta({ title: 'Sign In', robots: 'noindex' })

const { login } = useAuth()

const form = reactive({ email: '', password: '' })
const errors = reactive<Record<string, string>>({})
const loading = ref(false)

async function handleSubmit() {
  Object.keys(errors).forEach((k) => delete errors[k])

  if (!form.email) errors['email'] = 'Email is required'
  if (!form.password) errors['password'] = 'Password is required'
  if (Object.keys(errors).length) return

  loading.value = true
  try {
    await login(form)
  } catch {
    errors['form'] = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}

// Demo fill
function fillDemo(type: 'buyer' | 'agent') {
  form.email = type === 'buyer' ? 'demo@propertyhub.com' : 'agent@propertyhub.com'
  form.password = type === 'buyer' ? 'demo1234' : 'agent1234'
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex">
    <!-- Left panel — form -->
    <div class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-sm animate-fade-up">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Welcome back
          </h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your Property Hub account
          </p>
        </div>

        <!-- Demo accounts -->
        <div class="mb-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 p-3">
          <p class="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">Demo accounts</p>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              @click="fillDemo('buyer')"
            >
              Buyer / Renter
            </button>
            <button
              type="button"
              class="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              @click="fillDemo('agent')"
            >
              Property Agent
            </button>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
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
            placeholder="••••••••"
            :error="errors['password']"
            required
            autocomplete="current-password"
          />

          <div class="flex items-center justify-between">
            <span />
            <NuxtLink
              to="/auth/forgot-password"
              class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <p v-if="errors['form']" class="text-sm text-red-500 text-center">
            {{ errors['form'] }}
          </p>

          <AppButton type="submit" :loading="loading" full size="lg">
            Sign in
          </AppButton>
        </form>

        <p class="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don't have an account?
          <NuxtLink to="/auth/register" class="font-medium text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Create one
          </NuxtLink>
        </p>
      </div>
    </div>

    <!-- Right panel — image (hidden on mobile) -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden">
      <NuxtImg
        src="https://images.unsplash.com/photo-1545324418-5e0b26d52a45?auto=format&fit=crop&w=900&q=80"
        alt="Luxury property"
        class="size-full object-cover"
        loading="eager"
        width="900"
        height="1200"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/10 dark:from-zinc-950/20 to-transparent" />
      <div class="absolute bottom-12 left-10 right-10">
        <blockquote class="text-white">
          <p class="text-lg font-medium leading-relaxed mb-3">
            "Found our dream home in just two days. The search experience is unlike anything else."
          </p>
          <footer class="text-sm text-white/70">— Sarah K., Manhattan</footer>
        </blockquote>
      </div>
    </div>
  </div>
</template>
