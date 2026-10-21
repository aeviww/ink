<script setup lang="ts">
import { CONTENT_MAX_LENGTH } from '#shared/constants'
import type { CreatePostResponse } from '#shared/types/api'
import type { MarkdownAction } from '~/utils/markdown-actions'

type Mode = 'write' | 'preview' | 'split'

const emit = defineEmits<{ published: [result: CreatePostResponse] }>()

const MODES: { value: Mode, label: string, class?: string }[] = [
  { value: 'write', label: 'текст' },
  { value: 'preview', label: 'просмотр' },
  { value: 'split', label: 'рядом', class: 'max-lg:hidden' },
]

const PUBLISH_LABELS = {
  idle: 'опубликовать',
  verifying: 'проверка',
  publishing: 'публикация',
} as const

const title = ref('')
const content = ref('')
const mode = ref<Mode>('write')
const textarea = useTemplateRef('textarea')

const { enabled: draftEnabled, savedAt: draftSavedAt, clear: clearDraft } = useDraft(title, content)
const { status, error, isBusy, publish } = usePublishPost()
const { show } = useToast()

const canPublish = computed(() =>
  Boolean(title.value.trim() && content.value.trim())
  && content.value.length <= CONTENT_MAX_LENGTH
  && !isBusy.value,
)

const showEditor = computed(() => mode.value !== 'preview')
const showPreview = computed(() => mode.value !== 'write')

function onAction(action: MarkdownAction): void {
  if (mode.value === 'preview') mode.value = 'write'
  nextTick(() => textarea.value?.applyAction(action))
}

async function submit(): Promise<void> {
  if (!canPublish.value) return

  const result = await publish({ title: title.value, content: content.value })
  if (!result) {
    show(error.value ?? 'не удалось опубликовать', 'error')
    return
  }

  clearDraft()
  emit('published', result)
}

function warnBeforeLeave(event: BeforeUnloadEvent): void {
  if (draftEnabled.value || isBusy.value || !(title.value || content.value)) return
  event.preventDefault()
}

onMounted(() => window.addEventListener('beforeunload', warnBeforeLeave))
onBeforeUnmount(() => window.removeEventListener('beforeunload', warnBeforeLeave))
</script>

<template>
  <div class="mx-auto flex w-full flex-1 flex-col px-5 sm:px-8" :class="mode === 'split' ? 'max-w-6xl' : 'max-w-4xl'">
    <div class="sticky top-0 z-10 -mx-5 flex items-center justify-between gap-3 border-b border-line bg-canvas px-5 py-2 sm:-mx-8 sm:px-8">
      <EditorToolbar :disabled="mode === 'preview'" @action="onAction" />
      <UiSegmentedControl v-model="mode" :options="MODES" label="режим редактора" class="shrink-0" />
    </div>

    <div class="grid flex-1 gap-12 py-12" :class="{ 'lg:grid-cols-2': mode === 'split' }">
      <section v-if="showEditor" class="flex flex-col gap-6">
        <EditorTitle v-model="title" @next="textarea?.focus()" />
        <EditorTextarea ref="textarea" v-model="content" @submit="submit" />
      </section>

      <section
        v-if="showPreview"
        aria-label="предпросмотр"
        :class="{ 'lg:border-l lg:border-line lg:pl-12': mode === 'split' }"
      >
        <EditorPreview :title="title" :source="content" />
      </section>
    </div>

    <div class="sticky bottom-0 -mx-5 border-t border-line bg-canvas px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-8 sm:px-8">
      <p v-if="error" role="alert" class="mb-3 flex items-center gap-2 text-sm text-danger">
        <UiIcon name="alert" class="size-4 shrink-0" />
        {{ error }}
      </p>
      <EditorStatusBar
        v-model:draft-enabled="draftEnabled"
        :length="content.length"
        :saved-at="draftSavedAt"
        :busy="isBusy"
        :can-publish="canPublish"
        :publish-label="PUBLISH_LABELS[status]"
        @publish="submit"
      />
    </div>
  </div>
</template>
