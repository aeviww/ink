import createDOMPurify, { type WindowLike } from 'dompurify'
import { JSDOM } from 'jsdom'
import { createMarkdownRenderer, type MarkdownRenderer } from '#shared/markdown/renderer'

let renderer: MarkdownRenderer | undefined

export function renderMarkdown(source: string): string {
  if (!renderer) {
    const { window } = new JSDOM('')
    renderer = createMarkdownRenderer(createDOMPurify(window as unknown as WindowLike))
  }
  return renderer(source)
}
