<script setup lang="ts">
import type { PaginatedProperties } from '~/types/property'

useSeoMeta({ title: 'Special Offers — PropertyHub', description: 'Browse discounted properties and exclusive deals.' })

const route = useRoute()
const router = useRouter()

const { data, pending } = await useAsyncData<PaginatedProperties>(
  'offers',
  () => $fetch('/api/listings', { query: { ...route.query, offer: 'true' } }),
  { watch: [() => route.query] },
)

const currentPage = computed(() => Number(route.query.page ?? 1))
function goPage(p: number) {
  router.push({ query: { ...route.query, page: p } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <!-- Hero banner -->
    <div class="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-4 left-8 text-8xl font-black">%</div>
        <div class="absolute bottom-4 right-12 text-8xl font-black">$</div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          Limited offers
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">Special Deals &amp; Offers</h1>
        <p class="text-emerald-100 text-lg">Properties with exclusive discounts — act fast before they're gone</p>
        <div v-if="!pending && data?.total" class="mt-4 text-emerald-200 text-sm">
          {{ data.total }} deal{{ data.total !== 1 ? 's' : '' }} available
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Skeleton -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <PropertyCardSkeleton v-for="n in 6" :key="n" />
      </div>

      <!-- Empty -->
      <div v-else-if="!data?.items?.length" class="flex flex-col items-center justify-center py-24 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-12 text-zinc-300 dark:text-zinc-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/></svg>
        <p class="text-zinc-500 dark:text-zinc-400 font-medium">No offers right now</p>
        <p class="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Check back soon for new deals</p>
      </div>

      <!-- Results -->
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
</template>
