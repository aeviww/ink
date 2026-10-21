<script setup lang="ts">
const route = useRoute();
const isEditor = computed(() => route.path === "/");
</script>

<template>
  <header
    class="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-6 sm:px-8"
  >
    <NuxtLink
      to="/"
      class="flex shrink-0 items-center gap-2.5"
      aria-label="ink — главная"
    >
      <!-- <img src="/logo.jpg" alt="" class="h-6 w-6 rounded-sm object-cover" />  душа хочет-->
      <span class="text-[0.9375rem] font-semibold tracking-tight text-fg">
        ink
      </span>
    </NuxtLink>

    <nav class="flex items-center gap-1 text-sm">
      <NuxtLink
        to="/privacy"
        class="px-2 py-1.5 text-muted transition-colors hover:text-fg"
      >
        приватность
      </NuxtLink>
      <NuxtLink
        v-if="!isEditor"
        to="/"
        class="ml-2 text-fg transition-colors hover:border-fg"
      >
        начните писать
      </NuxtLink>
    </nav>
  </header>
</template>
