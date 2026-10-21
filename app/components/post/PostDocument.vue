<script setup lang="ts">
import type { PostView } from '#shared/types/api'

defineProps<{ post: PostView }>()
</script>

<template>
  <article>
    <header class="border-b border-line pb-8">
      <h1 class="text-[2rem] font-semibold leading-[1.15] tracking-tight text-balance sm:text-[2.25rem]">
        {{ post.title }}
      </h1>
      <p class="mt-4 text-sm text-subtle">
        <time :datetime="post.createdOn">{{ formatPostDate(post.createdOn) }}</time>
      </p>
    </header>
    <div class="markdown mt-10" v-html="post.html" />
  </article>
</template>
