<script setup lang="ts">
import type { IconName } from '~/utils/icons'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  icon?: IconName
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'secondary',
  size: 'md',
  type: 'button',
})

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-fg text-canvas hover:bg-white disabled:bg-fg/40',
  secondary: 'border border-line-strong text-fg hover:border-muted',
  ghost: 'text-muted hover:text-fg',
  danger: 'bg-danger/90 text-canvas hover:bg-danger disabled:bg-danger/40',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 gap-1.5 rounded-sm px-3 text-[0.8125rem]',
  md: 'h-10 gap-2 rounded-md px-4 text-sm',
}

const classes = computed(() => [VARIANTS[props.variant], SIZES[props.size]])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    class="inline-flex shrink-0 select-none items-center justify-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    :class="classes"
  >
    <UiSpinner v-if="loading" class="size-4" />
    <UiIcon v-else-if="icon" :name="icon" class="size-4" />
    <slot />
  </button>
</template>
