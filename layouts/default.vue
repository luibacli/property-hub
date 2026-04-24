<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Hydrate auth state on every layout mount
onMounted(async () => {
  if (!authStore.initialized) {
    await authStore.fetchUser()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
    <NuxtLoadingIndicator color="#f59e0b" :height="2" />
    <AppHeader />
    <main class="flex-1 pt-16">
      <slot />
    </main>
    <AppFooter />
    <AppToast />
  </div>
</template>
