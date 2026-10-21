import { Marked, type Tokens } from 'marked'
import type { DOMPurify } from 'dompurify'
import { ALLOWED_ATTR, ALLOWED_TAGS, ALLOWED_URI_REGEXP, LINK_REL, URI_SAFE_ATTR } from './sanitize-config'

export type MarkdownRenderer = (source: string) => string

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function createMarked(): Marked {
  return new Marked({
    gfm: true,
    breaks: true,
    async: false,
    renderer: {
      html({ text, block }: Tokens.HTML | Tokens.Tag) {
        const escaped = escapeHtml(text)
        return block ? `<p>${escaped}</p>` : escaped
      },
      image({ href, text }: Tokens.Image) {
        const label = escapeHtml(text || href)
        return `<a href="${escapeHtml(href)}">${label}</a>`
      },
    },
  })
}

function configurePurifier(purifier: DOMPurify): void {
  purifier.addHook('afterSanitizeAttributes', (node) => {
    if (node.nodeName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('rel', LINK_REL)
      node.setAttribute('target', '_blank')
    }
    if (node.nodeName === 'INPUT') {
      if (node.getAttribute('type') !== 'checkbox') {
        node.remove()
        return
      }
      node.setAttribute('disabled', '')
    }
  })
}

export function createMarkdownRenderer(purifier: DOMPurify): MarkdownRenderer {
  const marked = createMarked()
  configurePurifier(purifier)

  return (source) => {
    const html = marked.parse(source, { async: false })
    return purifier.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOWED_URI_REGEXP,
      ADD_URI_SAFE_ATTR: URI_SAFE_ATTR,
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: false,
      RETURN_TRUSTED_TYPE: false,
    })
  }
}
