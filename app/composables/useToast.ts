export type ToastTone = 'default' | 'success' | 'error'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

let nextId = 0

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function dismiss(id: number): void {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  function show(message: string, tone: ToastTone = 'default', durationMs = 2800): void {
    const id = ++nextId
    toasts.value = [...toasts.value.slice(-2), { id, message, tone }]
    setTimeout(() => dismiss(id), durationMs)
  }

  return { toasts, show, dismiss }
}
