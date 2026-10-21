export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'em', 'del', 's',
  'blockquote',
  'ul', 'ol', 'li', 'input',
  'code', 'pre',
  'a',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]

export const ALLOWED_ATTR = ['href', 'title', 'align', 'start', 'type', 'checked', 'disabled']

export const URI_SAFE_ATTR = ['align', 'start', 'type', 'checked', 'disabled']

export const ALLOWED_URI_REGEXP = /^(?:https?:\/\/|mailto:)/i

export const LINK_REL = 'noopener noreferrer nofollow ugc'
