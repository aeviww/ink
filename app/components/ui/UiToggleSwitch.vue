<script setup lang="ts">
defineProps<{ label: string }>()

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    class="group inline-flex items-center gap-2.5 text-[0.8125rem] text-muted transition-colors hover:text-fg"
    @click="model = !model"
  >
    <span
      class="relative h-[18px] w-[30px] rounded-full border transition-colors"
      :class="model ? 'border-muted bg-line-strong' : 'border-line-strong bg-transparent'"
    >
      <span
        class="absolute top-[2px] size-3 rounded-full transition-all"
        :class="model ? 'left-[14px] bg-fg' : 'left-[2px] bg-subtle'"
      />
    </span>
    {{ label }}
  </button>
</template>
