<template>
  <div class="flex min-h-dvh flex-col">
    <LayoutHeader />
    <main class="flex flex-1 flex-col">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
