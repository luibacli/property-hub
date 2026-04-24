<script setup lang="ts">
import type { Property } from '~/types/property'
import { useProperties } from '~/composables/useProperties'

useSeoMeta({
  title: 'Explore Properties',
  description: 'Discover premium homes for rent and sale across the US. Find your next home on Property Hub.',
  ogTitle: 'Property Hub — Find Your Perfect Home',
  ogDescription: 'Browse premium properties for rent and sale across major US cities.',
  ogImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const router = useRouter()
const heroSearch = ref('')
function submitHeroSearch() {
  if (heroSearch.value.trim()) {
    router.push(`/listings?search=${encodeURIComponent(heroSearch.value.trim())}`)
  } else {
    router.push('/listings')
  }
}

const { fetchFeatured, formatPriceLabel, savingsAmount } = useProperties()

const { data: featured, pending } = await useAsyncData('featured', fetchFeatured)

const stats = [
  { value: '12+', label: 'Active Listings' },
  { value: '8', label: 'Cities' },
  { value: '2', label: 'Agents' },
  { value: '100%', label: 'Verified' },
]

const categories = [
  {
    label: 'For Rent',
    to: '/listings/rent',
    description: 'Monthly rentals in top cities',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    badge: 'From $2,600/mo',
  },
  {
    label: 'For Sale',
    to: '/listings/sale',
    description: 'Properties to own outright',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
    badge: 'From $720K',
  },
]
</script>

<template>
  <div>
    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="relative h-[90vh] min-h-[560px] flex items-center overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0">
        <NuxtImg
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt=""
          class="size-full object-cover"
          loading="eager"
          width="1600"
          height="900"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950/80" />
      </div>

      <div class="relative page-container w-full">
        <div class="max-w-2xl animate-fade-up">
          <span class="inline-flex items-center gap-1.5 text-brand-400 text-sm font-medium mb-4">
            <span class="size-1.5 rounded-full bg-brand-400 animate-pulse" />
            Premium Real Estate
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-4">
            Find your next<br />
            <span class="text-brand-400">perfect home.</span>
          </h1>
          <p class="text-zinc-300 text-lg mb-8 max-w-xl leading-relaxed">
            Curated properties across the US's most desirable neighborhoods — from Manhattan penthouses to Californian bungalows.
          </p>

          <!-- Search bar -->
          <form class="flex flex-col sm:flex-row gap-2 max-w-lg" @submit.prevent="submitHeroSearch">
            <input
              v-model="heroSearch"
              type="text"
              placeholder="Search by city, neighborhood, or ZIP…"
              class="flex-1 h-12 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <AppButton type="submit" size="lg" class="w-full sm:w-auto whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search
            </AppButton>
          </form>

          <!-- Quick filters -->
          <div class="flex flex-wrap gap-2 mt-4">
            <NuxtLink
              v-for="tag in ['New York', 'Miami', 'Chicago', 'Austin', 'San Francisco']"
              :key="tag"
              :to="`/listings?city=${tag}`"
              class="inline-flex h-7 items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 text-xs text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              {{ tag }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Scroll cue -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </section>

    <!-- ── Stats ──────────────────────────────────────────────────────────── -->
    <section class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div class="page-container py-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex flex-col items-center sm:items-start gap-0.5"
          >
            <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{{ stat.value }}</span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Browse categories ─────────────────────────────────────────────── -->
    <section class="page-container py-16">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="text-sm font-medium text-brand-600 dark:text-brand-400 mb-1">Browse by type</p>
          <h2 class="section-title">Rent or Buy?</h2>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.to"
          :to="cat.to"
          class="group relative aspect-[16/9] overflow-hidden rounded-2xl"
        >
          <NuxtImg
            :src="cat.image"
            :alt="cat.label"
            class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width="600"
            height="338"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
          <div class="absolute bottom-0 left-0 p-6">
            <span class="inline-block text-xs font-medium bg-brand-500 text-zinc-900 rounded-full px-2.5 py-1 mb-2">
              {{ cat.badge }}
            </span>
            <h3 class="text-xl font-semibold text-white">{{ cat.label }}</h3>
            <p class="text-zinc-300 text-sm mt-1">{{ cat.description }}</p>
          </div>
          <div class="absolute top-4 right-4 size-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ── Featured listings ─────────────────────────────────────────────── -->
    <section class="page-container pb-16">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="text-sm font-medium text-brand-600 dark:text-brand-400 mb-1">Hand-picked</p>
          <h2 class="section-title">Featured Properties</h2>
        </div>
        <NuxtLink to="/listings" class="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors hidden sm:block">
          View all →
        </NuxtLink>
      </div>

      <!-- Skeleton -->
      <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <div class="aspect-[4/3] shimmer" />
          <div class="p-4 space-y-3">
            <div class="h-4 w-2/3 shimmer rounded-lg" />
            <div class="h-3 w-1/2 shimmer rounded-lg" />
            <div class="h-5 w-1/3 shimmer rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-else-if="featured?.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="prop in featured"
          :key="prop.id"
          :to="`/listings/${prop.id}`"
          class="group card overflow-hidden animate-fade-up"
        >
          <!-- Image -->
          <div class="aspect-[4/3] overflow-hidden relative">
            <NuxtImg
              :src="prop.images[0]"
              :alt="prop.title"
              class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              width="480"
              height="360"
            />
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex gap-2">
              <span
                :class="[
                  'text-xs font-semibold px-2.5 py-1 rounded-full',
                  prop.type === 'rent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-emerald-500 text-white',
                ]"
              >
                {{ prop.type === 'rent' ? 'For Rent' : 'For Sale' }}
              </span>
              <span v-if="prop.offer" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500 text-zinc-900">
                Offer
              </span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{{ prop.city }}, {{ prop.state }}</p>
            <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug line-clamp-1 mb-3">
              {{ prop.title }}
            </h3>

            <!-- Meta row -->
            <div class="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/><path d="M2 22h20"/><path d="M9 22V12h6v10"/></svg>
                {{ prop.bedrooms === 0 ? 'Studio' : `${prop.bedrooms} bed` }}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                {{ prop.bathrooms }} bath
              </span>
              <span v-if="prop.parking" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Parking
              </span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between">
              <div>
                <span class="font-semibold text-zinc-900 dark:text-zinc-100">
                  {{ formatPriceLabel(prop) }}
                </span>
                <span
                  v-if="prop.offer && prop.discountedPrice"
                  class="ml-2 text-xs text-zinc-400 line-through"
                >
                  {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(prop.regularPrice) }}
                </span>
              </div>
              <span
                v-if="savingsAmount(prop)"
                class="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full"
              >
                Save {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(savingsAmount(prop)!) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-8 text-center sm:hidden">
        <NuxtLink to="/listings">
          <AppButton variant="secondary">View all listings</AppButton>
        </NuxtLink>
      </div>
    </section>

    <!-- ── CTA banner ────────────────────────────────────────────────────── -->
    <section class="page-container pb-16">
      <div class="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-800 px-6 py-12 sm:px-12">
        <div class="absolute inset-0 opacity-20">
          <NuxtImg
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=60"
            alt=""
            class="size-full object-cover"
            loading="lazy"
            width="1200"
            height="400"
          />
        </div>
        <div class="relative max-w-xl">
          <h2 class="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Have a property to list?
          </h2>
          <p class="text-zinc-400 mb-6">
            Create a free account and publish your property in minutes. Reach thousands of qualified buyers and renters.
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink to="/auth/register">
              <AppButton size="lg">Start listing for free</AppButton>
            </NuxtLink>
            <NuxtLink to="/listings">
              <AppButton size="lg" variant="ghost" class="text-zinc-300 hover:text-white hover:bg-white/10">
                Browse properties
              </AppButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
