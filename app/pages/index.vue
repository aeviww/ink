<script setup lang="ts">
import type { CreatePostResponse } from "#shared/types/api";

useHead({ title: "новая публикация" });

const result = ref<CreatePostResponse | null>(null);

function onPublished(created: CreatePostResponse): void {
  result.value = created;
  window.scrollTo({ top: 0 });
}
</script>

<template>
  <PublishResult v-if="result" :result="result" @new="result = null" />
  <EditorForm v-else @published="onPublished" />
</template>
