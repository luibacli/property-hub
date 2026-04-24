<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    error?: string
    hint?: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    prefix?: string
    suffix?: string
  }>(),
  {
    type: 'text',
    required: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="id"
      class="text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative flex items-center">
      <span
        v-if="prefix"
        class="absolute left-3 text-sm text-zinc-500 dark:text-zinc-400 pointer-events-none"
      >
        {{ prefix }}
      </span>

      <input
        :id="id"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'form-input w-full rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
          'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
          'transition-colors duration-150 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-400 dark:border-red-500'
            : 'border-zinc-200 dark:border-zinc-700',
          prefix ? 'pl-8' : 'pl-3',
          suffix ? 'pr-10' : 'pr-3',
          'py-2.5',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <span
        v-if="suffix"
        class="absolute right-3 text-sm text-zinc-500 dark:text-zinc-400 pointer-events-none"
      >
        {{ suffix }}
      </span>
    </div>

    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-zinc-500 dark:text-zinc-400">{{ hint }}</p>
  </div>
</template>
