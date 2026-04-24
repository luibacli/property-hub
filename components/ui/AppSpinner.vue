<script setup lang="ts">
withDefaults(
  defineProps<{ size?: 'sm' | 'md' | 'lg'; label?: string }>(),
  { size: 'md', label: 'Loading…' },
)

const sizes = { sm: 'size-4', md: 'size-6', lg: 'size-10' }
</script>

<template>
  <span role="status" :aria-label="label" class="inline-flex items-center justify-center">
    <span
      :class="[
        sizes[size],
        'rounded-full border-2 border-zinc-200 dark:border-zinc-700 border-t-brand-500 animate-spin',
      ]"
    />
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
