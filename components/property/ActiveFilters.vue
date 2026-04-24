<script setup lang="ts">
const props = defineProps<{ lockedType?: 'rent' | 'sale' }>()

const route = useRoute()
const router = useRouter()

const PRICE_LABELS: Record<string, string> = {
  rent: 'Monthly rent',
  sale: 'Price',
}

const chips = computed(() => {
  const q = route.query
  const result: { key: string; label: string; removeKeys: string[] }[] = []

  if (q['type'] && !props.lockedType) {
    result.push({ key: 'type', label: q['type'] === 'rent' ? 'For Rent' : 'For Sale', removeKeys: ['type'] })
  }
  if (q['search']) {
    result.push({ key: 'search', label: `"${q['search']}"`, removeKeys: ['search'] })
  }
  if (q['city']) {
    result.push({ key: 'city', label: String(q['city']), removeKeys: ['city'] })
  }
  if (q['bedrooms']) {
    result.push({ key: 'bedrooms', label: `${q['bedrooms']}+ beds`, removeKeys: ['bedrooms'] })
  }
  if (q['minPrice'] || q['maxPrice']) {
    const type = (q['type'] as string) ?? props.lockedType ?? ''
    const prefix = PRICE_LABELS[type] ?? 'Price'
    const min = q['minPrice'] ? `$${Number(q['minPrice']).toLocaleString()}` : ''
    const max = q['maxPrice'] ? `$${Number(q['maxPrice']).toLocaleString()}` : ''
    const label = min && max ? `${prefix} ${min}–${max}` : min ? `${prefix} ≥ ${min}` : `${prefix} ≤ ${max}`
    result.push({ key: 'price', label, removeKeys: ['minPrice', 'maxPrice'] })
  }
  if (q['furnished'] === 'true') {
    result.push({ key: 'furnished', label: 'Furnished', removeKeys: ['furnished'] })
  }
  if (q['parking'] === 'true') {
    result.push({ key: 'parking', label: 'Parking', removeKeys: ['parking'] })
  }
  if (q['offer'] === 'true') {
    result.push({ key: 'offer', label: 'Offers only', removeKeys: ['offer'] })
  }
  return result
})

function removeChip(keys: string[]) {
  const query = { ...route.query }
  for (const k of keys) delete query[k]
  delete query['page']
  router.push({ query })
}

function clearAll() {
  const base = props.lockedType ? { type: props.lockedType } : {}
  router.push({ query: base })
}
</script>

<template>
  <TransitionGroup
    v-if="chips.length"
    tag="div"
    name="chip"
    class="flex flex-wrap items-center gap-2"
  >
    <span
      v-for="chip in chips"
      :key="chip.key"
      class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-xs font-medium text-brand-700 dark:text-brand-400"
    >
      {{ chip.label }}
      <button
        class="size-4 rounded-full flex items-center justify-center hover:bg-brand-200 dark:hover:bg-brand-800 transition-colors"
        :aria-label="`Remove ${chip.label} filter`"
        @click="removeChip(chip.removeKeys)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </span>

    <button
      v-if="chips.length > 1"
      key="clear-all"
      class="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
      @click="clearAll"
    >
      Clear all
    </button>
  </TransitionGroup>
</template>

<style scoped>
.chip-enter-active, .chip-leave-active { transition: all 0.15s ease; }
.chip-enter-from, .chip-leave-to { opacity: 0; transform: scale(0.85); }
</style>
