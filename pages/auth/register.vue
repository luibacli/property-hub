<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useSeoMeta({ title: 'Create Account', robots: 'noindex' })

const { register } = useAuth()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errors = reactive<Record<string, string>>({})
const loading = ref(false)

// ── Password strength ─────────────────────────────────────────────────────────
const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return Math.min(score, 4)
})

const strengthMeta = computed(() => [
  { label: '', color: 'bg-zinc-200 dark:bg-zinc-700' },
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-amber-500' },
  { label: 'Good', color: 'bg-brand-500' },
  { label: 'Strong', color: 'bg-emerald-500' },
][passwordStrength.value])

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

const perks = [
  { icon: 'search', text: 'Browse 12+ premium listings' },
  { icon: 'heart', text: 'Save favourite properties' },
  { icon: 'home', text: 'List your property in minutes' },
]
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex">

    <!-- Left panel — image (hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
      <NuxtImg
        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80"
        alt="Beautiful property"
        class="size-full object-cover absolute inset-0"
        loading="eager"
        width="900"
        height="1200"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/20 to-zinc-950/70" />

      <!-- Top badge -->
      <div class="relative pt-10 px-10">
        <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-white text-xs font-medium">Free forever · No credit card required</span>
        </div>
      </div>

      <!-- Feature highlights card -->
      <div class="relative flex-1 flex items-center px-10">
        <div class="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6">
          <p class="text-white/70 text-xs font-semibold uppercase tracking-wider mb-4">What you get</p>
          <ul class="space-y-3.5">
            <li v-for="perk in perks" :key="perk.text" class="flex items-center gap-3">
              <div class="size-8 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center shrink-0">
                <svg v-if="perk.icon === 'search'" xmlns="http://www.w3.org/2000/svg" class="size-4 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <svg v-else-if="perk.icon === 'heart'" xmlns="http://www.w3.org/2000/svg" class="size-4 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-4 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span class="text-white text-sm font-medium">{{ perk.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom quote -->
      <div class="relative pb-10 px-10">
        <blockquote class="text-white">
          <p class="text-base font-medium leading-relaxed mb-3">
            "Listed my property on a Friday and had three serious enquiries by Monday morning."
          </p>
          <footer class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-brand-500 flex items-center justify-center text-zinc-900 font-bold text-sm shrink-0">M</div>
            <div>
              <p class="text-sm font-medium text-white">Michael R.</p>
              <p class="text-xs text-white/60">Austin, TX</p>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>

    <!-- Right panel — form -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
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

        <!-- Heading -->
        <div class="mb-7">
          <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Create your account
          </h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Free forever — no credit card required
          </p>
        </div>

        <!-- Mobile perks strip -->
        <div class="lg:hidden flex gap-2 mb-7">
          <div
            v-for="perk in perks"
            :key="perk.text"
            class="flex-1 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2.5 flex flex-col items-center gap-1.5"
          >
            <svg v-if="perk.icon === 'search'" xmlns="http://www.w3.org/2000/svg" class="size-4 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <svg v-else-if="perk.icon === 'heart'" xmlns="http://www.w3.org/2000/svg" class="size-4 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-4 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <p class="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 text-center leading-tight">{{ perk.text }}</p>
          </div>
        </div>

        <!-- Form -->
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

          <!-- Password with strength meter -->
          <div class="space-y-2">
            <AppInput
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              :error="errors['password']"
              required
              autocomplete="new-password"
            />
            <div v-if="form.password" class="space-y-1.5">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  :class="[
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    i <= passwordStrength ? strengthMeta.color : 'bg-zinc-200 dark:bg-zinc-700',
                  ]"
                />
              </div>
              <p :class="['text-xs font-medium transition-colors', {
                'text-red-500': passwordStrength === 1,
                'text-amber-500': passwordStrength === 2,
                'text-brand-600 dark:text-brand-400': passwordStrength === 3,
                'text-emerald-600 dark:text-emerald-400': passwordStrength === 4,
              }]">
                {{ strengthMeta.label }}
              </p>
            </div>
          </div>

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

        <p class="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
          By creating an account you agree to our
          <span class="underline cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Terms of Service</span>
          and
          <span class="underline cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Privacy Policy</span>.
        </p>

        <p class="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-medium text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
