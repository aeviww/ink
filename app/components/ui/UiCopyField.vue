<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string
  copiedMessage?: string
}>()

const { copy } = useCopy()
const inputId = useId()
</script>

<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs text-subtle">
      {{ label }}
    </label>
    <div class="flex items-center gap-1.5 rounded-md border border-line bg-surface p-1.5 pl-3.5">
      <input
        :id="inputId"
        :value="value"
        readonly
        spellcheck="false"
        autocomplete="off"
        class="min-w-0 flex-1 bg-transparent font-mono text-[0.8125rem] text-fg outline-none"
        @focus="($event.target as HTMLInputElement).select()"
      >
      <UiButton size="sm" icon="copy" @click="copy(value, copiedMessage)">
        копировать
      </UiButton>
    </div>
  </div>
</template>
