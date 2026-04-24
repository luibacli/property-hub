<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'
import { useAuth } from '~/composables/useAuth'

const authStore = useAuthStore()
const uiStore = useUiStore()
const { logout } = useAuth()
const isDark = useDark()
const route = useRoute()

const navLinks = [
  { label: 'Explore', to: '/' },
  { label: 'Rent', to: '/listings/rent' },
  { label: 'Buy', to: '/listings/sale' },
  { label: 'Offers', to: '/offers' },
]

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)

const scrolled = ref(false)
const avatarOpen = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 12
  })
})
</script>

<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-40 transition-all duration-300',
      scrolled
        ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm'
        : 'bg-transparent',
    ]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0 group">
          <div class="size-8 rounded-xl bg-brand-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4 text-zinc-900"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <path fill="white" fill-opacity=".4" d="M9 21V12h6v9" />
            </svg>
          </div>
          <span class="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px] tracking-tight">
            Property<span class="text-brand-500">Hub</span>
          </span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isActive(link.to)
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Dark mode toggle -->
          <button
            class="size-9 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="isDark = !isDark"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>

          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/profile/create-listing"
              class="hidden sm:inline-flex"
            >
              <AppButton size="sm" variant="secondary">List Property</AppButton>
            </NuxtLink>
            <!-- Avatar dropdown -->
            <div class="relative" @mouseenter="avatarOpen = true" @mouseleave="avatarOpen = false">
              <button
                class="size-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-400 font-semibold text-sm hover:bg-brand-200 dark:hover:bg-brand-900/50 transition-colors"
                :aria-label="`${authStore.userName} — profile menu`"
              >
                {{ authStore.userName.charAt(0).toUpperCase() }}
              </button>
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="avatarOpen"
                  class="absolute right-0 top-full pt-1 w-52 z-50"
                >
                  <div class="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl py-1 overflow-hidden">
                    <div class="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                      <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{{ authStore.userName }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ authStore.user?.email }}</p>
                    </div>
                    <NuxtLink
                      v-for="item in [
                        { to: '/profile', label: 'My Profile', icon: 'user' },
                        { to: '/profile/create-listing', label: 'Add Listing', icon: 'plus' },
                        { to: '/profile/settings', label: 'Settings', icon: 'settings' },
                      ]"
                      :key="item.to"
                      :to="item.to"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      @click="avatarOpen = false"
                    >
                      <svg v-if="item.icon === 'user'" xmlns="http://www.w3.org/2000/svg" class="size-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <svg v-else-if="item.icon === 'plus'" xmlns="http://www.w3.org/2000/svg" class="size-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/></svg>
                      {{ item.label }}
                    </NuxtLink>
                    <div class="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                      <button
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        @click="logout(); avatarOpen = false"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <template v-else>
            <NuxtLink to="/auth/login">
              <AppButton size="sm" variant="ghost" class="hidden sm:inline-flex">Sign in</AppButton>
            </NuxtLink>
            <NuxtLink to="/auth/register">
              <AppButton size="sm">Get started</AppButton>
            </NuxtLink>
          </template>

          <!-- Mobile menu toggle -->
          <button
            class="md:hidden size-9 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
            @click="uiStore.toggleMobileNav()"
          >
            <svg v-if="!uiStore.mobileNavOpen" xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile nav drawer -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="uiStore.mobileNavOpen"
        class="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pb-4 pt-3"
      >
        <nav class="flex flex-col gap-1 mb-4">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium',
              isActive(link.to)
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400',
            ]"
            @click="uiStore.closeMobileNav()"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex flex-col gap-2">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/profile" @click="uiStore.closeMobileNav()">
              <AppButton full variant="secondary">My Profile</AppButton>
            </NuxtLink>
            <NuxtLink to="/profile/create-listing" @click="uiStore.closeMobileNav()">
              <AppButton full>List a Property</AppButton>
            </NuxtLink>
            <NuxtLink to="/profile/settings" @click="uiStore.closeMobileNav()">
              <AppButton full variant="ghost">Settings</AppButton>
            </NuxtLink>
            <AppButton full variant="ghost" @click="logout(); uiStore.closeMobileNav()">Sign out</AppButton>
          </template>
          <template v-else>
            <NuxtLink to="/auth/register" @click="uiStore.closeMobileNav()">
              <AppButton full>Get started</AppButton>
            </NuxtLink>
            <NuxtLink to="/auth/login" @click="uiStore.closeMobileNav()">
              <AppButton full variant="secondary">Sign in</AppButton>
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
