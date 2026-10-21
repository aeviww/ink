<script setup lang="ts">
import { isValidPostId } from '#shared/constants'
import type { PostView } from '#shared/types/api'

definePageMeta({
  validate: route => isValidPostId(route.params.id),
})

const route = useRoute()
const id = String(route.params.id)

const { data: post, error } = await useFetch<PostView>(`/api/posts/${id}`, { key: `post:${id}` })

if (error.value || !post.value) {
  const statusCode = error.value?.statusCode ?? 404
  throw createError({
    statusCode,
    statusMessage: statusCode === 404 ? 'Not Found' : 'Error',
    message: statusCode === 404 ? 'публикация не найдена' : 'не удалось загрузить публикацию',
  })
}

useHead({ title: () => (post.value ? `${post.value.title} — ink` : 'ink') })
</script>

<template>
  <div class="mx-auto w-full max-w-[42rem] px-5 pt-6 pb-16 sm:px-8 sm:pt-10">
    <template v-if="post">
      <PostDocument :post="post" />
      <div class="mt-16">
        <PostActions />
      </div>
    </template>
  </div>
</template>
