<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const store = useUiStore()

const icons = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
}

const colorMap = {
  success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  error: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  info: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
}
</script>

<template>
  <Teleport to="body">
    <div
      aria-live="polite"
      class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="toast in store.toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 shadow-lg"
          role="alert"
        >
          <span :class="['shrink-0 rounded-lg p-1', colorMap[toast.type]]" v-html="icons[toast.type]" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {{ toast.message }}
            </p>
          </div>
          <button
            class="shrink-0 rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Dismiss"
            @click="store.removeToast(toast.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
