<script setup lang="ts">
import type { PaginatedProperties } from '~/types/property'

useSeoMeta({
  title: 'Properties for Rent — PropertyHub',
  description: 'Browse all available rental properties across the US.',
  ogTitle: 'Rentals — PropertyHub',
  ogDescription: 'Find your next home to rent. Browse apartments, houses and studios across major US cities.',
  ogImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
  twitterCard: 'summary_large_image',
})

const route = useRoute()
const router = useRouter()
const mobileFiltersOpen = ref(false)
const filtersRef = ref<{ activeCount: number } | null>(null)

const { data, pending } = await useAsyncData<PaginatedProperties>(
  'rent-listings',
  () => $fetch('/api/listings', { query: { ...route.query, type: 'rent' } }),
  { watch: [() => route.query] },
)

const currentPage = computed(() => Number(route.query.page ?? 1))
const currentSort = computed(() => (route.query.sort as string) ?? 'newest')

function goPage(p: number) {
  router.push({ query: { ...route.query, page: p } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function setSort(val: string) {
  router.push({ query: { ...route.query, sort: val, page: undefined } })
}

const activeFilterCount = computed(() => filtersRef.value?.activeCount ?? 0)
const searchInput = ref((route.query.search as string) ?? '')
watch(() => route.query.search, (v) => { searchInput.value = (v as string) ?? '' })
function submitSearch() {
  router.push({ query: { ...route.query, search: searchInput.value || undefined, page: undefined } })
}

const sortOptions = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
]
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <div class="bg-gradient-to-br from-brand-500 to-amber-600 text-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold mb-1">Properties for Rent</h1>
        <p class="text-amber-100">Monthly rentals across the US — apartments, houses &amp; studios</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
        <form class="flex-1 min-w-[180px]" @submit.prevent="submitSearch">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="searchInput" type="search" placeholder="Search rentals…" class="w-full pl-9 pr-4 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </form>

        <AppSelect :model-value="currentSort" :options="sortOptions" class="w-44 shrink-0" @update:model-value="setSort" />

        <button class="lg:hidden flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition hover:bg-zinc-50 shrink-0" @click="mobileFiltersOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filters
          <span v-if="activeFilterCount > 0" class="size-5 rounded-full bg-brand-500 text-zinc-900 text-[11px] font-semibold flex items-center justify-center">{{ activeFilterCount }}</span>
        </button>

        <p class="text-sm text-zinc-500 dark:text-zinc-400 shrink-0 ml-auto">
          <template v-if="!pending">{{ data?.total ?? 0 }} rentals</template>
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <aside class="hidden lg:block w-72 shrink-0">
          <div class="card p-5 sticky top-36">
            <PropertyFilters ref="filtersRef" locked-type="rent" />
          </div>
        </aside>
        <div class="flex-1 min-w-0">
          <ActiveFilters class="mb-5" locked-type="rent" />

          <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <PropertyCardSkeleton v-for="n in 9" :key="n" />
          </div>
          <div v-else-if="!data?.items?.length" class="flex flex-col items-center justify-center py-24 text-center card">
            <p class="text-zinc-500 dark:text-zinc-400 font-medium">No rentals found</p>
            <p class="text-sm text-zinc-400 dark:text-zinc-500 mt-1 mb-5">Try adjusting your filters</p>
            <NuxtLink to="/listings/rent"><AppButton size="sm" variant="secondary">Clear filters</AppButton></NuxtLink>
          </div>
          <template v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <PropertyCard v-for="p in data.items" :key="p.id" :property="p" />
            </div>
            <div v-if="data.totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
              <button :disabled="currentPage <= 1" class="size-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" @click="goPage(currentPage - 1)">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button v-for="p in data.totalPages" :key="p" :class="['size-9 rounded-xl border text-sm font-medium transition', p === currentPage ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800']" @click="goPage(p)">{{ p }}</button>
              <button :disabled="currentPage >= data.totalPages" class="size-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" @click="goPage(currentPage + 1)">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="mobileFiltersOpen" class="fixed inset-0 z-50 flex">
          <div class="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" @click="mobileFiltersOpen = false" />
          <div class="relative ml-auto w-80 max-w-full h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col">
            <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span class="font-semibold text-zinc-900 dark:text-zinc-100">Filters</span>
              <button class="size-8 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" @click="mobileFiltersOpen = false">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto px-5 py-5">
              <PropertyFilters ref="filtersRef" locked-type="rent" @close="mobileFiltersOpen = false" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { @apply transition-opacity duration-300; }
.drawer-enter-active > div:last-child, .drawer-leave-active > div:last-child { @apply transition-transform duration-300; }
.drawer-enter-from, .drawer-leave-to { @apply opacity-0; }
.drawer-enter-from > div:last-child, .drawer-leave-to > div:last-child { @apply translate-x-full; }
</style>
