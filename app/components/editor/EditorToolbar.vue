<script setup lang="ts">
import type { IconName } from '~/utils/icons'
import type { MarkdownAction } from '~/utils/markdown-actions'

interface ToolbarItem {
  action: MarkdownAction
  icon: IconName
  label: string
}

defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ action: [action: MarkdownAction] }>()

const GROUPS: ToolbarItem[][] = [
  [
    { action: 'bold', icon: 'bold', label: 'жирный (ctrl+b)' },
    { action: 'italic', icon: 'italic', label: 'курсив (ctrl+i)' },
    { action: 'strike', icon: 'strike', label: 'зачёркнутый' },
  ],
  [
    { action: 'heading', icon: 'heading', label: 'заголовок' },
    { action: 'quote', icon: 'quote', label: 'цитата' },
    { action: 'bulletList', icon: 'bulletList', label: 'список' },
    { action: 'orderedList', icon: 'orderedList', label: 'нумерованный список' },
  ],
  [
    { action: 'code', icon: 'code', label: 'код (ctrl+e)' },
    { action: 'codeBlock', icon: 'codeBlock', label: 'блок кода' },
    { action: 'link', icon: 'link', label: 'ссылка (ctrl+k)' },
    { action: 'table', icon: 'table', label: 'таблица' },
  ],
]
</script>

<template>
  <div role="toolbar" aria-label="форматирование" class="flex items-center gap-1 overflow-x-auto">
    <template v-for="(group, index) in GROUPS" :key="index">
      <span v-if="index > 0" class="mx-1 h-4 w-px shrink-0 bg-line" aria-hidden="true" />
      <button
        v-for="item in group"
        :key="item.action"
        type="button"
        :title="item.label"
        :aria-label="item.label"
        :disabled="disabled"
        class="grid size-8 shrink-0 place-items-center rounded-sm text-subtle transition-colors hover:text-fg disabled:pointer-events-none disabled:opacity-40"
        @mousedown.prevent
        @click="emit('action', item.action)"
      >
        <UiIcon :name="item.icon" class="size-4" />
      </button>
    </template>
  </div>
</template>
