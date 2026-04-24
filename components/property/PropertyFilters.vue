<script setup lang="ts">
const props = defineProps<{
  lockedType?: 'rent' | 'sale'
}>()

const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const router = useRouter()

// ── Read current state from URL ───────────────────────────────────────────────
const local = reactive({
  type: (route.query['type'] as string) ?? props.lockedType ?? '',
  minPrice: (route.query['minPrice'] as string) ?? '',
  maxPrice: (route.query['maxPrice'] as string) ?? '',
  bedrooms: (route.query['bedrooms'] as string) ?? '',
  furnished: route.query['furnished'] === 'true',
  parking: route.query['parking'] === 'true',
  offer: route.query['offer'] === 'true',
})

// Sync if another component changes the URL
watch(() => route.query, (q) => {
  if (!props.lockedType) local.type = (q['type'] as string) ?? ''
  local.minPrice = (q['minPrice'] as string) ?? ''
  local.maxPrice = (q['maxPrice'] as string) ?? ''
  local.bedrooms = (q['bedrooms'] as string) ?? ''
  local.furnished = q['furnished'] === 'true'
  local.parking = q['parking'] === 'true'
  local.offer = q['offer'] === 'true'
})

// ── Active count ──────────────────────────────────────────────────────────────
const activeCount = computed(() => {
  let n = 0
  if (local.type && !props.lockedType) n++
  if (local.minPrice || local.maxPrice) n++
  if (local.bedrooms) n++
  if (local.furnished) n++
  if (local.parking) n++
  if (local.offer) n++
  return n
})

defineExpose({ activeCount })

// ── Apply / clear ─────────────────────────────────────────────────────────────
function apply() {
  const query: Record<string, string> = {}
  const base = props.lockedType ? { type: props.lockedType } : {}
  if (!props.lockedType && local.type) query['type'] = local.type
  else if (props.lockedType) query['type'] = props.lockedType
  if (local.minPrice) query['minPrice'] = local.minPrice
  if (local.maxPrice) query['maxPrice'] = local.maxPrice
  if (local.bedrooms) query['bedrooms'] = local.bedrooms
  if (local.furnished) query['furnished'] = 'true'
  if (local.parking) query['parking'] = 'true'
  if (local.offer) query['offer'] = 'true'
  router.push({ query })
  emit('close')
}

function clearAll() {
  local.type = props.lockedType ?? ''
  local.minPrice = ''
  local.maxPrice = ''
  local.bedrooms = ''
  local.furnished = false
  local.parking = false
  local.offer = false
  const query = props.lockedType ? { type: props.lockedType } : {}
  router.push({ query })
  emit('close')
}

const bedroomOptions = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-zinc-900 dark:text-zinc-100">Filters</h3>
        <span
          v-if="activeCount > 0"
          class="size-5 rounded-full bg-brand-500 text-zinc-900 text-[11px] font-semibold flex items-center justify-center"
        >
          {{ activeCount }}
        </span>
      </div>
      <button
        v-if="activeCount > 0"
        class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        @click="clearAll"
      >
        Clear all
      </button>
    </div>

    <!-- Type (hidden when locked) -->
    <div v-if="!lockedType">
      <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
        Listing type
      </p>
      <div class="flex gap-2">
        <button
          v-for="opt in [{ label: 'All', value: '' }, { label: 'Rent', value: 'rent' }, { label: 'Buy', value: 'sale' }]"
          :key="opt.value"
          :class="[
            'flex-1 rounded-xl border py-1.5 text-sm font-medium transition-colors',
            local.type === opt.value
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600',
          ]"
          @click="local.type = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Price range -->
    <div>
      <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
        {{ local.type === 'rent' || lockedType === 'rent' ? 'Monthly rent' : 'Price' }}
      </p>
      <div class="flex items-center gap-2">
        <AppInput
          v-model="local.minPrice"
          placeholder="Min"
          type="number"
          prefix="$"
          :disabled="false"
        />
        <span class="text-zinc-400 shrink-0">—</span>
        <AppInput
          v-model="local.maxPrice"
          placeholder="Max"
          type="number"
          prefix="$"
        />
      </div>
    </div>

    <!-- Bedrooms -->
    <div>
      <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
        Bedrooms
      </p>
      <div class="flex gap-1.5">
        <button
          v-for="opt in bedroomOptions"
          :key="opt.value"
          :class="[
            'flex-1 rounded-xl border py-1.5 text-sm font-medium transition-colors',
            local.bedrooms === opt.value
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300',
          ]"
          @click="local.bedrooms = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Toggles -->
    <div>
      <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
        Features
      </p>
      <div class="space-y-2.5">
        <label
          v-for="tog in [
            { key: 'furnished', label: 'Furnished' },
            { key: 'parking', label: 'Parking included' },
            { key: 'offer', label: 'Discounted / offers only' },
          ]"
          :key="tog.key"
          class="flex items-center justify-between cursor-pointer"
        >
          <span class="text-sm text-zinc-700 dark:text-zinc-300">{{ tog.label }}</span>
          <button
            role="switch"
            :aria-checked="(local as Record<string, unknown>)[tog.key] as boolean"
            :class="[
              'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              (local as Record<string, unknown>)[tog.key] ? 'bg-brand-500' : 'bg-zinc-200 dark:bg-zinc-700',
            ]"
            @click="(local as Record<string, unknown>)[tog.key] = !(local as Record<string, unknown>)[tog.key]"
          >
            <span
              :class="[
                'pointer-events-none inline-block size-4 rounded-full bg-white shadow transition-transform duration-150',
                (local as Record<string, unknown>)[tog.key] ? 'translate-x-4' : 'translate-x-0',
              ]"
            />
          </button>
        </label>
      </div>
    </div>

    <!-- Apply button (shown on mobile drawer) -->
    <AppButton full @click="apply">Apply filters</AppButton>
  </div>
</template>
