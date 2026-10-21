import type { Ref } from 'vue'

const DRAFT_KEY = 'ink:draft'
const ENABLED_KEY = 'ink:draft-enabled'
const SAVE_DELAY_MS = 600

interface Draft {
  title: string
  content: string
}

function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<Draft>
    return { title: String(value.title ?? ''), content: String(value.content ?? '') }
  }
  catch {
    return null
  }
}

export function useDraft(title: Ref<string>, content: Ref<string>) {
  const enabled = ref(false)
  const savedAt = ref<Date | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  function save(): void {
    if (!enabled.value) return
    if (!title.value && !content.value) {
      removeStorage(DRAFT_KEY)
      savedAt.value = null
      return
    }
    if (writeStorage(DRAFT_KEY, JSON.stringify({ title: title.value, content: content.value }))) {
      savedAt.value = new Date()
    }
  }

  function clear(): void {
    clearTimeout(timer)
    removeStorage(DRAFT_KEY)
    savedAt.value = null
  }

  onMounted(() => {
    enabled.value = readStorage(ENABLED_KEY) === '1'
    if (!enabled.value) return

    const draft = parseDraft(readStorage(DRAFT_KEY))
    if (draft && !title.value && !content.value) {
      title.value = draft.title
      content.value = draft.content
    }
  })

  watch(enabled, (isEnabled) => {
    if (isEnabled) {
      writeStorage(ENABLED_KEY, '1')
      save()
      return
    }
    removeStorage(ENABLED_KEY)
    clear()
  })

  watch([title, content], () => {
    clearTimeout(timer)
    timer = setTimeout(save, SAVE_DELAY_MS)
  })

  onBeforeUnmount(() => clearTimeout(timer))

  return { enabled, savedAt, clear }
}
