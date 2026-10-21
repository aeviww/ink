<script setup lang="ts">
import type { CreatePostResponse } from '#shared/types/api'

const props = defineProps<{ result: CreatePostResponse }>()
const emit = defineEmits<{ new: [] }>()

const requestUrl = useRequestURL()
const postUrl = computed(() => new URL(props.result.path, requestUrl.origin).href)
</script>

<template>
  <div class="mx-auto w-full max-w-xl px-5 py-12 sm:px-8 sm:py-20">
    <p class="mb-4 text-sm text-success">готово</p>
    <h1 class="text-[1.75rem] font-semibold tracking-tight">
      публикация готова
    </h1>
    <p class="mt-2 text-[0.9375rem] leading-relaxed text-muted">
      публикация доступна только тем, у кого есть ссылка. сохраните её, чтобы вернуться к публикации позже.
    </p>

    <div class="mt-10 flex flex-col gap-6">
      <UiCopyField label="ссылка" :value="postUrl" copied-message="ссылка скопирована" />
    </div>

    <div class="mt-10 flex flex-wrap gap-3">
      <NuxtLink
        :to="result.path"
        class="inline-flex h-10 items-center gap-2 rounded-md bg-fg px-4 text-sm font-medium text-canvas transition-colors hover:bg-white"
      >
        открыть публикацию
        <UiIcon name="external" class="size-4" />
      </NuxtLink>
      <UiButton icon="plus" @click="emit('new')">
        новая публикация
      </UiButton>
    </div>
  </div>
</template>
