<script setup lang="ts">
import type { Property } from '~/types/property'
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

const props = defineProps<{ property: Property }>()

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

// ── Favourites ────────────────────────────────────────────────────────────────
const isFav = ref(authStore.isFavourite(props.property.id))
const favLoading = ref(false)

watch(() => authStore.isFavourite(props.property.id), (v) => { isFav.value = v })

async function toggleFav(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!authStore.isAuthenticated) {
    uiStore.info('Sign in to save', 'Create a free account to save properties')
    router.push('/auth/login')
    return
  }

  favLoading.value = true
  const prev = isFav.value
  isFav.value = !prev // optimistic

  try {
    const res = await $fetch<{ favourited: boolean; favourites: string[] }>(
      `/api/favourites/${props.property.id}`,
      { method: 'POST' },
    )
    isFav.value = res.favourited
    authStore.setFavourites(res.favourites)
  } catch {
    isFav.value = prev // revert
    uiStore.error('Could not update favourites')
  } finally {
    favLoading.value = false
  }
}

// ── Price formatting ──────────────────────────────────────────────────────────
const { formatPriceLabel, savingsAmount } = useProperties()
const savings = computed(() => savingsAmount(props.property))
const displayPrice = computed(() => formatPriceLabel(props.property))
</script>

<template>
  <NuxtLink
    :to="`/listings/${property.id}`"
    class="group card overflow-hidden flex flex-col animate-fade-up"
  >
    <!-- Image container -->
    <div class="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
      <NuxtImg
        :src="property.images[0]"
        :alt="property.title"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
        width="480"
        height="360"
        :placeholder="[16, 12, 75, 5]"
      />

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex items-center gap-1.5">
        <PropertyBadge :type="property.type" size="sm" />
        <PropertyBadge v-if="property.offer" offer size="sm" />
      </div>

      <!-- Favourite button -->
      <button
        :aria-label="isFav ? 'Remove from favourites' : 'Save to favourites'"
        :disabled="favLoading"
        class="absolute top-3 right-3 size-8 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
        @click="toggleFav"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-4 transition-colors"
          :class="isFav ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-zinc-500 group-hover:stroke-zinc-800 dark:group-hover:stroke-zinc-300'"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <!-- Image count pill -->
      <div
        v-if="property.images.length > 1"
        class="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-zinc-900/60 backdrop-blur-sm px-2 py-0.5 text-[11px] text-white/90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        {{ property.images.length }}
      </div>
    </div>

    <!-- Card body -->
    <div class="flex flex-col flex-1 p-4">
      <!-- Location -->
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        {{ property.city }}, {{ property.state }}
      </p>

      <!-- Title -->
      <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug line-clamp-2 mb-3 flex-1">
        {{ property.title }}
      </h3>

      <!-- Stats row -->
      <div class="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/><path d="M2 22h20"/><path d="M9 22V12h6v10"/></svg>
          {{ property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed` }}
        </span>
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          {{ property.bathrooms }} bath
        </span>
        <span v-if="property.parking" class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          Parking
        </span>
        <span v-if="property.furnished" class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/></svg>
          Furnished
        </span>
      </div>

      <!-- Price row -->
      <div class="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div class="flex items-baseline gap-2">
          <span class="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
            {{ displayPrice }}
          </span>
          <span
            v-if="property.offer && property.discountedPrice"
            class="text-xs text-zinc-400 line-through"
          >
            {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.regularPrice) }}
            {{ property.type === 'rent' ? '/mo' : '' }}
          </span>
        </div>
        <span
          v-if="savings"
          class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full"
        >
          −{{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(savings) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
