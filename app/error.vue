<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)
const heading = computed(() => (isNotFound.value ? 'публикация не найдена' : 'что-то пошло не так'))
const description = computed(() => (isNotFound.value
  ? 'возможно, ссылка набрана с ошибкой или публикация недоступна.'
  : 'сервер не смог обработать запрос. попробуйте обновить страницу чуть позже.'))

useHead({ title: () => `${heading.value} — ink` })
</script>

<template>
  <NuxtLayout>
    <div class="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-20 sm:px-8">
      <p class="font-mono text-sm text-subtle">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-3 text-[1.75rem] font-semibold tracking-tight">
        {{ heading }}
      </h1>
      <p class="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        {{ description }}
      </p>
      <div class="mt-8">
        <a
          href="/"
          class="inline-flex h-10 items-center rounded-md border border-line-strong px-4 text-sm font-medium transition-colors hover:border-muted"
          @click.prevent="clearError({ redirect: '/' })"
        >
          на главную
        </a>
      </div>
    </div>
  </NuxtLayout>
</template>
