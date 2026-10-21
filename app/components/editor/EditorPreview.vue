<script setup lang="ts">
const props = defineProps<{ title: string, source: string }>()

const RENDER_DELAY_MS = 120
const html = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

function render(): void {
  html.value = renderMarkdownPreview(props.source)
}

watch(() => props.source, () => {
  clearTimeout(timer)
  timer = setTimeout(render, RENDER_DELAY_MS)
})

onMounted(render)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div>
    <h1
      class="text-[2rem] font-semibold leading-[1.2] tracking-tight text-balance sm:text-[2.25rem]"
      :class="title.trim() ? 'text-fg' : 'text-line-strong'"
    >
      {{ title.trim() || 'без заголовка' }}
    </h1>
    <div v-if="source.trim()" class="markdown mt-8" v-html="html" />
    <p v-else class="mt-8 text-sm text-subtle">
      здесь появится предпросмотр текста.
    </p>
  </div>
</template>
