<script setup lang="ts">
import { z } from 'zod'
import type { Property } from '~/types/property'
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

// ── Fetch property ────────────────────────────────────────────────────────────
const { data: property, error } = await useAsyncData<Property>(
  `listing-${route.params.id}`,
  () => $fetch(`/api/listings/${route.params.id}`),
)

if (error.value || !property.value) {
  throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
}

useSeoMeta({
  title: () => `${property.value?.title ?? 'Listing'} — PropertyHub`,
  description: () => property.value?.description?.slice(0, 160) ?? '',
  ogTitle: () => property.value?.title ?? 'Listing',
  ogDescription: () => property.value?.description?.slice(0, 160) ?? '',
  ogImage: () => property.value?.images[0],
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// JSON-LD structured data for real estate listing
useHead(() => ({
  script: property.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: property.value.title,
          description: property.value.description,
          url: `https://propertyhub.vercel.app/listings/${property.value.id}`,
          image: property.value.images,
          offers: {
            '@type': 'Offer',
            price: property.value.offer && property.value.discountedPrice
              ? property.value.discountedPrice
              : property.value.regularPrice,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceSpecification: property.value.type === 'rent'
              ? { '@type': 'UnitPriceSpecification', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' } }
              : undefined,
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: property.value.address,
            addressLocality: property.value.city,
            addressRegion: property.value.state,
            addressCountry: 'US',
          },
          numberOfRooms: property.value.bedrooms,
          numberOfBathroomsTotal: property.value.bathrooms,
          amenityFeature: [
            ...(property.value.parking ? [{ '@type': 'LocationFeatureSpecification', name: 'Parking', value: true }] : []),
            ...(property.value.furnished ? [{ '@type': 'LocationFeatureSpecification', name: 'Furnished', value: true }] : []),
          ],
        }),
      }]
    : [],
}))

// ── Price helpers ─────────────────────────────────────────────────────────────
const { formatPriceLabel, savingsAmount } = useProperties()
const displayPrice = computed(() => formatPriceLabel(property.value!))
const savings = computed(() => savingsAmount(property.value!))

// ── Favourites ────────────────────────────────────────────────────────────────
const isFav = ref(authStore.isFavourite(property.value!.id))
const favLoading = ref(false)
watch(() => authStore.isFavourite(property.value!.id), v => { isFav.value = v })

async function toggleFav() {
  if (!authStore.isAuthenticated) {
    uiStore.info('Sign in to save', 'Create a free account to save properties')
    router.push('/auth/login')
    return
  }
  favLoading.value = true
  const prev = isFav.value
  isFav.value = !prev
  try {
    const res = await $fetch<{ favourited: boolean; favourites: string[] }>(
      `/api/favourites/${property.value!.id}`,
      { method: 'POST' },
    )
    isFav.value = res.favourited
    authStore.setFavourites(res.favourites)
  } catch {
    isFav.value = prev
    uiStore.error('Could not update favourites')
  } finally {
    favLoading.value = false
  }
}

// ── Contact form ──────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const form = reactive({
  name: authStore.user?.name ?? '',
  email: authStore.user?.email ?? '',
  phone: '',
  message: `Hi, I'm interested in this property and would like to arrange a viewing.`,
})
const formErrors = ref<Record<string, string[]>>({})
const formLoading = ref(false)
const formSuccess = ref(false)

async function submitContact() {
  formErrors.value = {}
  const parsed = ContactSchema.safeParse(form)
  if (!parsed.success) {
    formErrors.value = parsed.error.flatten().fieldErrors as Record<string, string[]>
    return
  }
  formLoading.value = true
  try {
    await $fetch(`/api/contact/${property.value!.id}`, { method: 'POST', body: parsed.data })
    formSuccess.value = true
    uiStore.success('Enquiry sent!', 'The property owner will get back to you.')
  } catch {
    uiStore.error('Could not send enquiry. Please try again.')
  } finally {
    formLoading.value = false
  }
}

// ── Share ─────────────────────────────────────────────────────────────────────
async function share() {
  const url = window.location.href
  if (navigator.share) {
    await navigator.share({ title: property.value!.title, url })
  } else {
    await navigator.clipboard.writeText(url)
    uiStore.success('Link copied to clipboard!')
  }
}

// ── Feature list ──────────────────────────────────────────────────────────────
const features = computed(() => {
  const p = property.value!
  const list: { icon: string; label: string }[] = []
  list.push({ icon: 'bed', label: p.bedrooms === 0 ? 'Studio' : `${p.bedrooms} Bedroom${p.bedrooms > 1 ? 's' : ''}` })
  list.push({ icon: 'bath', label: `${p.bathrooms} Bathroom${p.bathrooms > 1 ? 's' : ''}` })
  if (p.parking) list.push({ icon: 'parking', label: 'Parking included' })
  if (p.furnished) list.push({ icon: 'sofa', label: 'Furnished' })
  return list
})
</script>

<template>
  <div v-if="property" class="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16">
    <!-- Back nav -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <button
        class="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        @click="router.back()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to listings
      </button>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Gallery -->
      <PropertyGallery :images="property.images" :title="property.title" />

      <!-- Main layout: content + sticky sidebar -->
      <div class="mt-8 lg:grid lg:grid-cols-3 lg:gap-10">

        <!-- Left: details -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Title block -->
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <PropertyBadge :type="property.type" />
                <PropertyBadge v-if="property.offer" offer />
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {{ property.title }}
              </h1>
              <p class="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ property.address }}, {{ property.city }}, {{ property.state }}
              </p>
            </div>
            <div class="flex gap-2 shrink-0">
              <button
                class="size-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                aria-label="Share"
                @click="share"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <button
                :disabled="favLoading"
                :aria-label="isFav ? 'Remove from favourites' : 'Save to favourites'"
                class="size-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-60"
                @click="toggleFav"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 transition-colors" :class="isFav ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-zinc-500'" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Features grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="f in features" :key="f.label" class="card p-4 flex flex-col items-center gap-2 text-center">
              <!-- Bed icon -->
              <svg v-if="f.icon === 'bed'" xmlns="http://www.w3.org/2000/svg" class="size-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/><path d="M2 22h20"/><path d="M9 22V12h6v10"/></svg>
              <!-- Bath icon -->
              <svg v-else-if="f.icon === 'bath'" xmlns="http://www.w3.org/2000/svg" class="size-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
              <!-- Parking icon -->
              <svg v-else-if="f.icon === 'parking'" xmlns="http://www.w3.org/2000/svg" class="size-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <!-- Sofa icon -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/></svg>
              <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">{{ f.label }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="card p-6">
            <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">About this property</h2>
            <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">{{ property.description }}</p>
          </div>

          <!-- Map -->
          <div class="card p-6">
            <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Location</h2>
            <ClientOnly>
              <PropertyMap :lat="property.lat" :lng="property.lng" :title="property.title" />
              <template #fallback>
                <div class="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              </template>
            </ClientOnly>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-3 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ property.address }}, {{ property.city }}, {{ property.state }}
            </p>
          </div>

          <!-- Contact form (mobile — shown here before sidebar) -->
          <div class="lg:hidden card p-6">
            <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Contact landlord</h2>
            <div v-if="!formSuccess" class="space-y-3">
              <AppInput v-model="form.name" label="Your name" placeholder="Jane Smith" :error="formErrors.name?.[0]" />
              <AppInput v-model="form.email" label="Email address" type="email" placeholder="jane@example.com" :error="formErrors.email?.[0]" />
              <AppInput v-model="form.phone" label="Phone (optional)" type="tel" placeholder="+1 555 000 0000" :error="formErrors.phone?.[0]" />
              <div>
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Message</label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
                <p v-if="formErrors.message?.[0]" class="text-xs text-red-500 mt-1">{{ formErrors.message[0] }}</p>
              </div>
              <AppButton full :loading="formLoading" @click="submitContact">Send enquiry</AppButton>
            </div>
            <div v-else class="flex flex-col items-center gap-3 py-6 text-center">
              <div class="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p class="font-semibold text-zinc-900 dark:text-zinc-100">Enquiry sent!</p>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">The property owner will contact you shortly.</p>
            </div>
          </div>
        </div>

        <!-- Right: sticky price card + contact form -->
        <div class="hidden lg:block">
          <div class="sticky top-28 space-y-4">
            <!-- Price card -->
            <div class="card p-6">
              <div class="flex items-baseline gap-2 mb-1">
                <span class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{{ displayPrice }}</span>
              </div>
              <div v-if="property.offer && property.discountedPrice" class="flex items-center gap-2 mb-4">
                <span class="text-sm text-zinc-400 line-through">
                  {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.regularPrice) }}
                  {{ property.type === 'rent' ? '/mo' : '' }}
                </span>
                <span v-if="savings" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  Save {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(savings) }}
                </span>
              </div>

              <div class="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <div class="flex justify-between">
                  <span>Type</span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100 capitalize">{{ property.type === 'rent' ? 'For Rent' : 'For Sale' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Bedrooms</span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ property.bedrooms === 0 ? 'Studio' : property.bedrooms }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Bathrooms</span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ property.bathrooms }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Parking</span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ property.parking ? 'Yes' : 'No' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Furnished</span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ property.furnished ? 'Yes' : 'No' }}</span>
                </div>
              </div>

              <button
                :disabled="favLoading"
                :class="[
                  'w-full mt-5 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition border',
                  isFav
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700',
                ]"
                @click="toggleFav"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 transition-colors" :class="isFav ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-current'" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {{ isFav ? 'Saved to favourites' : 'Save to favourites' }}
              </button>
            </div>

            <!-- Contact form -->
            <div class="card p-6">
              <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Contact landlord</h2>
              <div v-if="!formSuccess" class="space-y-3">
                <AppInput v-model="form.name" label="Your name" placeholder="Jane Smith" :error="formErrors.name?.[0]" />
                <AppInput v-model="form.email" label="Email address" type="email" placeholder="jane@example.com" :error="formErrors.email?.[0]" />
                <AppInput v-model="form.phone" label="Phone (optional)" type="tel" placeholder="+1 555 000 0000" :error="formErrors.phone?.[0]" />
                <div>
                  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Message</label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                  <p v-if="formErrors.message?.[0]" class="text-xs text-red-500 mt-1">{{ formErrors.message[0] }}</p>
                </div>
                <AppButton full :loading="formLoading" @click="submitContact">Send enquiry</AppButton>
              </div>
              <div v-else class="flex flex-col items-center gap-3 py-6 text-center">
                <div class="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p class="font-semibold text-zinc-900 dark:text-zinc-100">Enquiry sent!</p>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">The property owner will contact you shortly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
