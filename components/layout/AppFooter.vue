<template>
  <footer class="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <div class="size-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              </svg>
            </div>
            <span class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
              Property<span class="text-brand-500">Hub</span>
            </span>
          </NuxtLink>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px] leading-relaxed">
            Discover premium properties across the US — rent, buy, or list your own.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">Browse</h3>
          <ul class="space-y-2">
            <li v-for="link in [['/', 'All Properties'], ['/listings/rent', 'For Rent'], ['/listings/sale', 'For Sale'], ['/offers', 'Offers']]" :key="link[0]">
              <NuxtLink :to="link[0]" class="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                {{ link[1] }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">Account</h3>
          <ul class="space-y-2">
            <li v-for="link in [['/auth/login', 'Sign in'], ['/auth/register', 'Register'], ['/profile', 'My Profile'], ['/profile/create-listing', 'List Property']]" :key="link[0]">
              <NuxtLink :to="link[0]" class="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                {{ link[1] }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">Demo Accounts</h3>
          <div class="space-y-3">
            <div>
              <p class="text-xs font-medium text-zinc-700 dark:text-zinc-300">Buyer / Renter</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">demo@propertyhub.com</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">demo1234</p>
            </div>
            <div>
              <p class="text-xs font-medium text-zinc-700 dark:text-zinc-300">Property Agent</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">agent@propertyhub.com</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">agent1234</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-xs text-zinc-400 dark:text-zinc-500">
          © {{ new Date().getFullYear() }} PropertyHub. Built with Nuxt 3 + Nitro.
        </p>
        <p class="text-xs text-zinc-400 dark:text-zinc-500">
          Images courtesy of <a href="https://unsplash.com" target="_blank" rel="noopener" class="underline hover:text-zinc-600 dark:hover:text-zinc-300">Unsplash</a>
        </p>
      </div>
    </div>
  </footer>
</template>
