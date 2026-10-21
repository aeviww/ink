const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const BIDI_CONTROLS = /[\u202A-\u202E\u2066-\u2069]/g
const WHITESPACE_RUN = /\s+/g

export function normalizeContent(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARACTERS, '')
    .replace(/^\n+|\s+$/g, '')
}

export function normalizeTitle(value: string): string {
  return value
    .normalize('NFC')
    .replace(CONTROL_CHARACTERS, '')
    .replace(BIDI_CONTROLS, '')
    .replace(WHITESPACE_RUN, ' ')
    .trim()
}
