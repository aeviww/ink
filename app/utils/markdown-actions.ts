export type MarkdownAction =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'code'
  | 'heading'
  | 'quote'
  | 'bulletList'
  | 'orderedList'
  | 'codeBlock'
  | 'link'
  | 'table'

export interface TextEdit {
  from: number
  to: number
  text: string
  selectionStart: number
  selectionEnd: number
}

interface Selection {
  value: string
  start: number
  end: number
}

const WRAPPERS = {
  bold: { marker: '**', placeholder: 'жирный текст' },
  italic: { marker: '_', placeholder: 'курсив' },
  strike: { marker: '~~', placeholder: 'зачёркнутый текст' },
  code: { marker: '`', placeholder: 'код' },
} as const

const TABLE_TEMPLATE = '| столбец | столбец |\n| --- | --- |\n| ячейка | ячейка |'

function wrap({ value, start, end }: Selection, marker: string, placeholder: string): TextEdit {
  const size = marker.length
  const isWrapped = value.slice(start - size, start) === marker && value.slice(end, end + size) === marker

  if (isWrapped && start !== end) {
    const selected = value.slice(start, end)
    return { from: start - size, to: end + size, text: selected, selectionStart: start - size, selectionEnd: end - size }
  }

  const selected = value.slice(start, end) || placeholder
  return {
    from: start,
    to: end,
    text: `${marker}${selected}${marker}`,
    selectionStart: start + size,
    selectionEnd: start + size + selected.length,
  }
}

function toggleLinePrefix({ value, start, end }: Selection, prefixFor: (index: number) => string): TextEdit {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const nextBreak = value.indexOf('\n', end)
  const lineEnd = nextBreak === -1 ? value.length : nextBreak

  const lines = value.slice(lineStart, lineEnd).split('\n')
  const hasPrefix = lines.every((line, index) => line.startsWith(prefixFor(index)))
  const text = lines
    .map((line, index) => (hasPrefix ? line.slice(prefixFor(index).length) : `${prefixFor(index)}${line}`))
    .join('\n')

  const collapsed = start === end
  return {
    from: lineStart,
    to: lineEnd,
    text,
    selectionStart: collapsed ? lineStart + text.length : lineStart,
    selectionEnd: lineStart + text.length,
  }
}

function insertBlock({ value, start, end }: Selection, block: string, selectFrom: number, selectTo: number): TextEdit {
  const before = value.slice(0, start)
  const after = value.slice(end)
  const lead = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n'
  const trail = after === '' || after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n'
  const offset = start + lead.length

  return {
    from: start,
    to: end,
    text: `${lead}${block}${trail}`,
    selectionStart: offset + selectFrom,
    selectionEnd: offset + selectTo,
  }
}

function link(selection: Selection): TextEdit {
  const label = selection.value.slice(selection.start, selection.end) || 'текст ссылки'
  const url = 'https://'
  const text = `[${label}](${url})`
  const urlStart = selection.start + label.length + 3

  return { from: selection.start, to: selection.end, text, selectionStart: urlStart, selectionEnd: urlStart + url.length }
}

function codeBlock(selection: Selection): TextEdit {
  const code = selection.value.slice(selection.start, selection.end)
  const block = `\`\`\`\n${code}\n\`\`\``
  return insertBlock(selection, block, 4, 4 + code.length)
}

export function applyMarkdownAction(value: string, start: number, end: number, action: MarkdownAction): TextEdit {
  const selection = { value, start, end }

  switch (action) {
    case 'bold':
    case 'italic':
    case 'strike':
    case 'code':
      return wrap(selection, WRAPPERS[action].marker, WRAPPERS[action].placeholder)
    case 'heading':
      return toggleLinePrefix(selection, () => '## ')
    case 'quote':
      return toggleLinePrefix(selection, () => '> ')
    case 'bulletList':
      return toggleLinePrefix(selection, () => '- ')
    case 'orderedList':
      return toggleLinePrefix(selection, index => `${index + 1}. `)
    case 'codeBlock':
      return codeBlock(selection)
    case 'link':
      return link(selection)
    case 'table':
      return insertBlock(selection, TABLE_TEMPLATE, 2, 9)
  }
}
