<script setup lang="ts">
defineProps<{
  modelValue?: string
  label?: string
  options: { label: string; value: string }[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ label }}</label>
    <div class="relative">
      <select
        :value="modelValue"
        class="w-full appearance-none h-10 pl-3 pr-8 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  </div>
</template>
