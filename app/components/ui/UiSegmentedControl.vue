<script setup lang="ts" generic="T extends string">
defineProps<{
  options: { value: T, label: string, class?: string }[]
  label: string
}>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <div role="radiogroup" :aria-label="label" class="inline-flex items-center gap-1">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      class="border-b px-2 py-1.5 text-[0.8125rem] transition-colors"
      :class="[
        model === option.value ? 'border-fg text-fg' : 'border-transparent text-subtle hover:text-muted',
        option.class,
      ]"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>
