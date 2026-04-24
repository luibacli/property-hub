<script setup lang="ts">
import type { Property } from '~/types/property'
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'My Profile — PropertyHub' })

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()
const { logout } = useAuth()

// ── My listings ───────────────────────────────────────────────────────────────
const { data: listings, pending, refresh } = await useAsyncData<Property[]>(
  'my-listings',
  () => $fetch(`/api/users/${authStore.user!.id}/listings`),
)

// ── Favourites ────────────────────────────────────────────────────────────────
const { data: favListings, pending: favPending } = await useAsyncData<Property[]>(
  'my-favs',
  async () => {
    if (!authStore.user?.favourites?.length) return []
    const results = await Promise.all(
      authStore.user.favourites.map(id =>
        $fetch<Property>(`/api/listings/${id}`).catch(() => null),
      ),
    )
    return results.filter(Boolean) as Property[]
  },
  { watch: [() => authStore.user?.favourites] },
)

// ── Delete listing ────────────────────────────────────────────────────────────
const deletingId = ref<string | null>(null)
const confirmDeleteId = ref<string | null>(null)

function requestDelete(id: string) {
  confirmDeleteId.value = id
}

async function confirmDelete() {
  if (!confirmDeleteId.value) return
  deletingId.value = confirmDeleteId.value
  confirmDeleteId.value = null
  try {
    await $fetch(`/api/listings/${deletingId.value}`, { method: 'DELETE' })
    uiStore.success('Listing deleted')
    await refresh()
  } catch {
    uiStore.error('Could not delete listing')
  } finally {
    deletingId.value = null
  }
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const tabs = [
  { id: 'listings', label: 'My Listings' },
  { id: 'favourites', label: 'Saved' },
] as const
const activeTab = ref<'listings' | 'favourites'>('listings')

// ── Logout ────────────────────────────────────────────────────────────────────
async function handleLogout() {
  await logout()
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Profile header -->
      <div class="card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
        <div class="size-16 rounded-2xl bg-brand-500 flex items-center justify-center text-2xl font-bold text-zinc-900 shrink-0">
          {{ authStore.user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">{{ authStore.user?.name }}</h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">{{ authStore.user?.email }}</p>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Member since {{ new Date(authStore.user?.createdAt ?? '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</p>
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <AppButton size="sm" variant="secondary" @click="router.push('/profile/create-listing')">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add listing
          </AppButton>
          <button
            class="size-8 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Account settings"
            @click="router.push('/profile/settings')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/></svg>
          </button>
          <AppButton size="sm" variant="ghost" @click="handleLogout">Sign out</AppButton>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ listings?.length ?? 0 }}</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Listings</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ authStore.user?.favourites?.length ?? 0 }}</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Saved</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">0</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Enquiries</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- My Listings -->
      <div v-if="activeTab === 'listings'">
        <div v-if="pending" class="grid sm:grid-cols-2 gap-5">
          <PropertyCardSkeleton v-for="n in 4" :key="n" />
        </div>
        <div v-else-if="!listings?.length" class="flex flex-col items-center justify-center py-20 text-center card">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-12 text-zinc-300 dark:text-zinc-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <p class="text-zinc-500 dark:text-zinc-400 font-medium">No listings yet</p>
          <p class="text-sm text-zinc-400 dark:text-zinc-500 mt-1 mb-5">Create your first listing to start getting enquiries</p>
          <AppButton size="sm" @click="router.push('/profile/create-listing')">Create a listing</AppButton>
        </div>
        <div v-else class="grid sm:grid-cols-2 gap-5">
          <div v-for="p in listings" :key="p.id" class="relative group">
            <PropertyCard :property="p" />
            <!-- Manage overlay -->
            <div class="absolute inset-x-0 bottom-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-zinc-900/60 to-transparent rounded-b-2xl">
              <button
                class="flex-1 h-8 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-medium text-zinc-800 hover:bg-white transition"
                @click="router.push(`/profile/edit-listing/${p.id}`)"
              >
                Edit
              </button>
              <button
                :disabled="deletingId === p.id"
                class="flex-1 h-8 rounded-lg bg-red-500/90 backdrop-blur-sm text-xs font-medium text-white hover:bg-red-500 transition disabled:opacity-60"
                @click="requestDelete(p.id)"
              >
                {{ deletingId === p.id ? 'Deleting…' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="confirmDeleteId" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" @click="confirmDeleteId = null" />
            <div class="relative w-full max-w-sm card p-6 animate-fade-up">
              <div class="size-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </div>
              <h3 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 text-center mb-1">Delete listing?</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-6">This action cannot be undone. The listing will be removed from all searches.</p>
              <div class="flex gap-3">
                <AppButton variant="secondary" full @click="confirmDeleteId = null">Cancel</AppButton>
                <AppButton variant="danger" full @click="confirmDelete">Delete</AppButton>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Saved / Favourites -->
      <div v-if="activeTab === 'favourites'">
        <div v-if="favPending" class="grid sm:grid-cols-2 gap-5">
          <PropertyCardSkeleton v-for="n in 4" :key="n" />
        </div>
        <div v-else-if="!favListings?.length" class="flex flex-col items-center justify-center py-20 text-center card">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-12 text-zinc-300 dark:text-zinc-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <p class="text-zinc-500 dark:text-zinc-400 font-medium">No saved properties</p>
          <p class="text-sm text-zinc-400 dark:text-zinc-500 mt-1 mb-5">Heart a property to save it here</p>
          <AppButton size="sm" variant="secondary" @click="router.push('/listings')">Browse listings</AppButton>
        </div>
        <div v-else class="grid sm:grid-cols-2 gap-5">
          <PropertyCard v-for="p in favListings" :key="p.id" :property="p" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { @apply transition-opacity duration-200; }
.fade-enter-from, .fade-leave-to { @apply opacity-0; }
</style>
