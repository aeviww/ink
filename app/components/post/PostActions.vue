<script setup lang="ts">
const { copy } = useCopy()

function copyLink(): void {
  copy(window.location.href, 'ссылка скопирована')
}
</script>

<template>
  <div class="border-t border-line pt-6">
    <UiButton size="sm" icon="copy" @click="copyLink">
      скопировать ссылку
    </UiButton>
  </div>
</template>
