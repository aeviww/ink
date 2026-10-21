<script setup lang="ts">
const { toasts, dismiss } = useToast()

const TONES = {
  default: 'text-fg',
  success: 'text-success',
  error: 'text-danger',
} as const
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    role="status"
    aria-live="polite"
  >
    <TransitionGroup
      enter-from-class="translate-y-2 opacity-0"
      leave-to-class="translate-y-2 opacity-0"
      enter-active-class="transition duration-200 ease-out"
      leave-active-class="transition duration-150 ease-in"
    >
      <button
        v-for="toast in toasts"
        :key="toast.id"
        type="button"
        class="pointer-events-auto flex items-center gap-2.5 rounded-md border border-line-strong bg-elevated px-4 py-2.5 text-sm"
        @click="dismiss(toast.id)"
      >
        <UiIcon
          :name="toast.tone === 'error' ? 'alert' : 'check'"
          class="size-4"
          :class="TONES[toast.tone]"
        />
        <span class="text-fg">{{ toast.message }}</span>
      </button>
    </TransitionGroup>
  </div>
</template>
