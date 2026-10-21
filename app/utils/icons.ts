export const ICONS = {
  bold: 'lucide:bold',
  italic: 'lucide:italic',
  strike: 'lucide:strikethrough',
  heading: 'lucide:heading-2',
  quote: 'lucide:text-quote',
  bulletList: 'lucide:list',
  orderedList: 'lucide:list-ordered',
  code: 'lucide:code-xml',
  codeBlock: 'lucide:square-code',
  link: 'lucide:link',
  table: 'lucide:table-2',
  copy: 'lucide:copy',
  check: 'lucide:check',
  external: 'lucide:external-link',
  close: 'lucide:x',
  alert: 'lucide:triangle-alert',
  text: 'lucide:align-left',
  plus: 'lucide:plus',
} as const

export type IconName = keyof typeof ICONS
