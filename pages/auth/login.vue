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

        <!-- Mobile-only brand mark -->
        <div class="lg:hidden flex items-center gap-2 mb-8">
          <div class="size-8 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <path fill="white" fill-opacity=".4" d="M9 21V12h6v9"/>
            </svg>
          </div>
          <span class="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px] tracking-tight">
            Property<span class="text-brand-500">Hub</span>
          </span>
        </div>

        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Welcome back
          </h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your PropertyHub account
          </p>
        </div>

        <!-- Demo accounts -->
        <div class="mb-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4">
          <div class="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p class="text-xs font-medium text-zinc-600 dark:text-zinc-400">Try a demo account — one click to fill</p>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-left hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group"
              @click="fillDemo('buyer')"
            >
              <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Buyer / Renter</p>
              <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">demo@propertyhub.com</p>
            </button>
            <button
              type="button"
              class="rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-left hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group"
              @click="fillDemo('agent')"
            >
              <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Property Agent</p>
              <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">agent@propertyhub.com</p>
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

          <div class="space-y-1">
            <AppInput
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="••••••••"
              :error="errors['password']"
              required
              autocomplete="current-password"
            />
            <div class="flex justify-end">
              <NuxtLink
                to="/auth/forgot-password"
                class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Forgot password?
              </NuxtLink>
            </div>
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
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
      <NuxtImg
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80"
        alt="Luxury property"
        class="size-full object-cover"
        loading="eager"
        width="900"
        height="1200"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/10 to-zinc-950/50" />

      <!-- Top badge -->
      <div class="absolute top-8 left-8">
        <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
          <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span class="text-white text-xs font-medium">12+ active listings</span>
        </div>
      </div>

      <!-- Bottom quote -->
      <div class="absolute bottom-12 left-10 right-10">
        <blockquote class="text-white">
          <p class="text-lg font-medium leading-relaxed mb-3">
            "Found our dream home in just two days. The search experience is unlike anything else."
          </p>
          <footer class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-brand-500 flex items-center justify-center text-zinc-900 font-bold text-sm">S</div>
            <div>
              <p class="text-sm font-medium text-white">Sarah K.</p>
              <p class="text-xs text-white/60">Manhattan, NY</p>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  </div>
</template>
