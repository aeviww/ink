<script setup lang="ts">
import { TITLE_MAX_LENGTH } from '#shared/constants'

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ next: [] }>()
const field = useTemplateRef<HTMLTextAreaElement>('field')

function resize(): void {
  const element = field.value
  if (!element) return
  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
}

function onInput(event: Event): void {
  model.value = (event.target as HTMLTextAreaElement).value.replace(/\n/g, ' ')
}

watch(model, () => nextTick(resize))
onMounted(resize)
</script>

<template>
  <textarea
    ref="field"
    :value="model"
    rows="1"
    :maxlength="TITLE_MAX_LENGTH"
    placeholder="заголовок"
    aria-label="заголовок"
    spellcheck="true"
    class="block w-full resize-none overflow-hidden bg-transparent text-[2rem] font-semibold leading-[1.2] tracking-tight text-fg outline-none placeholder:text-line-strong sm:text-[2.25rem]"
    @input="onInput"
    @keydown.enter.prevent="emit('next')"
  />
</template>
