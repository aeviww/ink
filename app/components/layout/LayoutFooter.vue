<template>
  <footer
    class="mx-auto flex w-full max-w-4xl flex-wrap gap-x-3 gap-y-1 px-5 py-8 text-xs text-subtle sm:px-8"
  >
    <span>
      сайт создан
      <a
        href="https://aevi.lol"
        target="_blank"
        rel="noopener noreferrer"
        class="underline decoration-line-strong underline-offset-4 hover:text-muted"
        >aeviww</a
      >
    </span>
    <span aria-hidden="true">/\</span>
    <span>
      <a
        href="https://github.com/aeviww/ink"
        target="_blank"
        rel="noopener noreferrer"
        class="underline decoration-line-strong underline-offset-4 hover:text-muted"
        >исходный код</a
      >
    </span>
    <span aria-hidden="true">\/</span>
    <NuxtLink
      to="/privacy"
      class="underline decoration-line-strong underline-offset-4 hover:text-muted"
    >
      о приватности
    </NuxtLink>
  </footer>
</template>
