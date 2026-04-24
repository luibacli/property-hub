<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    full?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
    full: false,
  },
)

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-zinc-900 focus-visible:ring-brand-500 shadow-sm',
  secondary:
    'bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 focus-visible:ring-zinc-400',
  ghost:
    'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus-visible:ring-zinc-400',
  danger:
    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white focus-visible:ring-red-500 shadow-sm',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const classes = computed(() =>
  [base, variants[props.variant], sizes[props.size], props.full ? 'w-full' : ''].join(' '),
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    v-bind="$attrs"
  >
    <span
      v-if="loading"
      class="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
    />
    <slot />
  </button>
</template>
