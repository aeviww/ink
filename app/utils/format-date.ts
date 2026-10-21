const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatPostDate(day: string): string {
  return formatter.format(new Date(`${day}T00:00:00Z`)).replace(/\s?г\.$/, '')
}
