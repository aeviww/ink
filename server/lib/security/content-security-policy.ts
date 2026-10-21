import { createHash } from 'node:crypto'

const INLINE_SCRIPT = /<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi
const INLINE_STYLE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi
const DATA_SCRIPT_TYPE = /\btype=["']?application\/(?:json|ld\+json)/i

function sha256(content: string): string {
  return `'sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}'`
}

function collectHashes(html: string, pattern: RegExp, pick: (match: RegExpMatchArray) => string | null): string[] {
  const hashes = new Set<string>()
  for (const match of html.matchAll(pattern)) {
    const content = pick(match)
    if (content) hashes.add(sha256(content))
  }
  return [...hashes]
}

export function buildDocumentPolicy(html: string): string {
  const scriptHashes = collectHashes(html, INLINE_SCRIPT, (match) => {
    const attributes = match[1] ?? ''
    return DATA_SCRIPT_TYPE.test(attributes) ? null : (match[2] ?? null)
  })
  const styleHashes = collectHashes(html, INLINE_STYLE, match => match[1] ?? null)
  const emptyStyleHash = sha256('')

  return [
    `default-src 'self'`,
    `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
    `style-src 'self' ${styleHashes.join(' ')}`.trim(),
    `style-src-attr 'unsafe-hashes' ${emptyStyleHash}`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
    `worker-src 'none'`,
    `manifest-src 'self'`,
  ].join('; ')
}

export const API_POLICY = `default-src 'none'; frame-ancestors 'none'; base-uri 'none'`
