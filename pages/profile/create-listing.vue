<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Create Listing — PropertyHub' })

const router = useRouter()
const uiStore = useUiStore()

const form = reactive({
  title: '',
  type: 'rent' as 'rent' | 'sale',
  description: '',
  bedrooms: 1,
  bathrooms: 1,
  parking: false,
  furnished: false,
  address: '',
  city: '',
  state: '',
  lat: 40.7128,
  lng: -74.006,
  regularPrice: 0,
  discountedPrice: undefined as number | undefined,
  offer: false,
  images: [''],
  amenities: [] as string[],
})

const errors = ref<Record<string, string[]>>({})
const loading = ref(false)

function addImage() {
  if (form.images.length < 10) form.images.push('')
}
function removeImage(i: number) {
  form.images.splice(i, 1)
}

async function handleSubmit() {
  errors.value = {}
  loading.value = true
  try {
    const payload = {
      ...form,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      regularPrice: Number(form.regularPrice),
      discountedPrice: form.offer && form.discountedPrice ? Number(form.discountedPrice) : undefined,
      images: form.images.filter(Boolean),
      lat: Number(form.lat),
      lng: Number(form.lng),
    }
    await $fetch('/api/listings', { method: 'POST', body: payload })
    uiStore.success('Listing created!', 'Your property is now live.')
    router.push('/profile')
  } catch (err: unknown) {
    const e = err as { data?: { data?: Record<string, string[]> } }
    if (e?.data?.data) {
      errors.value = e.data.data
    } else {
      uiStore.error('Could not create listing. Please check your inputs.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10">
    <div class="max-w-2xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <button class="size-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Create listing</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Fill in the details about your property</p>
        </div>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Basic details -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Basic details</h2>

          <AppInput v-model="form.title" label="Title" placeholder="e.g. Bright 2-bed apartment in Manhattan" :error="errors.title?.[0]" />

          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Listing type</label>
            <div class="flex gap-3">
              <button
                v-for="opt in [{ label: 'For Rent', value: 'rent' }, { label: 'For Sale', value: 'sale' }]"
                :key="opt.value"
                type="button"
                :class="[
                  'flex-1 py-2 rounded-xl border text-sm font-medium transition',
                  form.type === opt.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400',
                ]"
                @click="form.type = opt.value as 'rent' | 'sale'"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Describe the property, neighbourhood, nearby amenities…"
              class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <p v-if="errors.description?.[0]" class="text-xs text-red-500 mt-1">{{ errors.description[0] }}</p>
          </div>
        </div>

        <!-- Property specs -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Property specs</h2>

          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model.number="form.bedrooms" label="Bedrooms" type="number" :min="0" :max="20" :error="errors.bedrooms?.[0]" />
            <AppInput v-model.number="form.bathrooms" label="Bathrooms" type="number" :min="1" :max="20" :error="errors.bathrooms?.[0]" />
          </div>

          <div class="flex gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.parking" type="checkbox" class="rounded border-zinc-300 text-brand-500 focus:ring-brand-500" />
              <span class="text-sm text-zinc-700 dark:text-zinc-300">Parking</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.furnished" type="checkbox" class="rounded border-zinc-300 text-brand-500 focus:ring-brand-500" />
              <span class="text-sm text-zinc-700 dark:text-zinc-300">Furnished</span>
            </label>
          </div>
        </div>

        <!-- Location -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Location</h2>
          <AppInput v-model="form.address" label="Street address" placeholder="123 Main St" :error="errors.address?.[0]" />
          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.city" label="City" placeholder="New York" :error="errors.city?.[0]" />
            <AppInput v-model="form.state" label="State" placeholder="NY" :error="errors.state?.[0]" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model.number="form.lat" label="Latitude" type="number" step="any" :error="errors.lat?.[0]" />
            <AppInput v-model.number="form.lng" label="Longitude" type="number" step="any" :error="errors.lng?.[0]" />
          </div>
          <p class="text-xs text-zinc-400 dark:text-zinc-500">Find coordinates at <a href="https://www.latlong.net" target="_blank" rel="noopener" class="underline">latlong.net</a></p>
        </div>

        <!-- Price -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Pricing</h2>
          <AppInput
            v-model.number="form.regularPrice"
            :label="form.type === 'rent' ? 'Monthly rent ($)' : 'Asking price ($)'"
            type="number"
            prefix="$"
            :min="0"
            :error="errors.regularPrice?.[0]"
          />
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.offer" type="checkbox" class="rounded border-zinc-300 text-brand-500 focus:ring-brand-500" />
            <span class="text-sm text-zinc-700 dark:text-zinc-300">Has a discount / special offer</span>
          </label>
          <AppInput
            v-if="form.offer"
            v-model.number="form.discountedPrice"
            label="Discounted price ($)"
            type="number"
            prefix="$"
            :min="0"
            :error="errors.discountedPrice?.[0]"
          />
        </div>

        <!-- Images -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Images</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Add Unsplash or direct image URLs (1–10 images)</p>
          <div v-for="(_, i) in form.images" :key="i" class="flex gap-2">
            <div class="flex-1">
              <AppInput
                v-model="form.images[i]"
                :placeholder="`Image URL ${i + 1}`"
              />
            </div>
            <button
              v-if="form.images.length > 1"
              type="button"
              class="size-10 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-300 transition"
              @click="removeImage(i)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p v-if="errors.images?.[0]" class="text-xs text-red-500">{{ errors.images[0] }}</p>
          <button
            v-if="form.images.length < 10"
            type="button"
            class="flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition font-medium"
            @click="addImage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add image
          </button>
        </div>

        <!-- Submit -->
        <div class="flex gap-3">
          <AppButton type="button" variant="secondary" full @click="router.back()">Cancel</AppButton>
          <AppButton type="submit" full :loading="loading">Publish listing</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
