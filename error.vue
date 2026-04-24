<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string; message?: string } }>()

const is404 = computed(() => props.error.statusCode === 404)

useHead({ title: is404.value ? '404 — Page not found' : `${props.error.statusCode} — Something went wrong` })

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
    <!-- Minimal header -->
    <header class="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="size-7 rounded-lg bg-brand-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
          </svg>
        </div>
        <span class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
          Property<span class="text-brand-500">Hub</span>
        </span>
      </NuxtLink>
    </header>

    <!-- Error body -->
    <div class="flex-1 flex items-center justify-center px-4 py-20">
      <div class="text-center max-w-md animate-fade-up">
        <!-- Illustration -->
        <div class="relative mx-auto mb-10 size-40">
          <div class="absolute inset-0 rounded-full bg-brand-50 dark:bg-brand-900/20" />
          <div class="relative flex items-center justify-center size-full">
            <!-- 404 house icon -->
            <template v-if="is404">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-20 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
                <line x1="9" y1="9" x2="15" y2="9" stroke-dasharray="2 2"/>
              </svg>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-20 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </template>
          </div>
          <!-- Error code badge -->
          <div class="absolute -top-2 -right-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-2.5 py-0.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-sm">
            {{ error.statusCode }}
          </div>
        </div>

        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          {{ is404 ? "We couldn't find that page" : "Something went wrong" }}
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
          {{ is404
            ? "The property or page you're looking for may have been removed or the URL is incorrect."
            : error.statusMessage ?? "An unexpected error occurred. Please try again." }}
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-900 font-medium text-sm transition"
            @click="router.push('/')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to home
          </button>
          <button
            class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
            @click="router.back()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Go back
          </button>
        </div>

        <!-- Quick links -->
        <div class="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p class="text-xs text-zinc-400 dark:text-zinc-500 mb-3">Quick links</p>
          <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <NuxtLink
              v-for="link in [['/', 'Home'], ['/listings', 'All listings'], ['/listings/rent', 'For Rent'], ['/listings/sale', 'For Sale'], ['/offers', 'Offers']]"
              :key="link[0]"
              :to="link[0]"
              class="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {{ link[1] }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
