<script setup lang="ts">
import { applyMarkdownAction, type MarkdownAction } from '~/utils/markdown-actions'

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ submit: [] }>()
const field = useTemplateRef<HTMLTextAreaElement>('field')

const SHORTCUTS: Record<string, MarkdownAction> = {
  KeyB: 'bold',
  KeyI: 'italic',
  KeyK: 'link',
  KeyE: 'code',
}

function resize(): void {
  const element = field.value
  if (!element) return
  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
}

function replaceRange(element: HTMLTextAreaElement, from: number, to: number, text: string): void {
  element.setSelectionRange(from, to)
  const inserted = text
    ? document.execCommand('insertText', false, text)
    : document.execCommand('delete', false)
  if (inserted) return

  element.setRangeText(text, from, to, 'end')
  element.dispatchEvent(new Event('input', { bubbles: true }))
}

function applyAction(action: MarkdownAction): void {
  const element = field.value
  if (!element) return

  const edit = applyMarkdownAction(element.value, element.selectionStart, element.selectionEnd, action)
  element.focus()
  replaceRange(element, edit.from, edit.to, edit.text)
  element.setSelectionRange(edit.selectionStart, edit.selectionEnd)
}

function onKeydown(event: KeyboardEvent): void {
  if (!(event.metaKey || event.ctrlKey) || event.altKey) return

  if (event.key === 'Enter') {
    event.preventDefault()
    emit('submit')
    return
  }

  const action = SHORTCUTS[event.code]
  if (action && !event.shiftKey) {
    event.preventDefault()
    applyAction(action)
  }
}

function focus(): void {
  field.value?.focus()
}

watch(model, () => nextTick(resize))
onMounted(resize)

defineExpose({ applyAction, focus })
</script>

<template>
  <textarea
    ref="field"
    v-model="model"
    placeholder="начните писать. поддерживается markdown."
    aria-label="текст публикации"
    spellcheck="true"
    class="block min-h-[45vh] w-full resize-none overflow-hidden bg-transparent text-base leading-[1.8] text-fg/90 outline-none placeholder:text-subtle"
    @keydown="onKeydown"
  />
</template>
