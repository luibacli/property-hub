<script setup lang="ts">
import type { PropertyType } from '~/types/property'

const props = defineProps<{
  type?: PropertyType
  offer?: boolean
  size?: 'sm' | 'md'
}>()

const base = 'inline-flex items-center font-semibold rounded-full'
const sizes = { sm: 'text-[11px] px-2 py-0.5', md: 'text-xs px-2.5 py-1' }
const s = computed(() => sizes[props.size ?? 'md'])
</script>

<template>
  <span v-if="type" :class="[base, s, type === 'rent' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white']">
    {{ type === 'rent' ? 'For Rent' : 'For Sale' }}
  </span>
  <span v-if="offer" :class="[base, s, 'bg-brand-500 text-zinc-900 ml-1.5']">
    Offer
  </span>
</template>
