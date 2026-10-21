export function useCopy() {
  const { show } = useToast()

  async function copy(text: string, successMessage = 'скопировано'): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      show(successMessage, 'success')
      return true
    }
    catch {
      show('не удалось скопировать. выделите текст вручную.', 'error')
      return false
    }
  }

  return { copy }
}
