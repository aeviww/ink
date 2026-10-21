import createDOMPurify from 'dompurify'
import { createMarkdownRenderer, type MarkdownRenderer } from '#shared/markdown/renderer'

let renderer: MarkdownRenderer | undefined

export function renderMarkdownPreview(source: string): string {
  renderer ??= createMarkdownRenderer(createDOMPurify(window))
  return renderer(source)
}
