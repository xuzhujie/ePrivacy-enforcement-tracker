import type { Language, LocalizedText } from '../data/cases.ts'

export type { Language } from '../data/cases.ts'

export function text(value: LocalizedText, language: Language): string {
  return value[language] || value.en || value.zh
}

export function formatFine(value: number | null, language: Language): string {
  if (value == null) return '—'

  const suffixes = language === 'zh'
    ? { billion: 'bn', million: 'm', thousand: 'k' }
    : { billion: 'bn', million: 'm', thousand: 'k' }
  const compact = (amount: number, suffix: string) => `€${amount.toFixed(2).replace(/\.?0+$/, '')}${suffix}`

  if (value >= 1_000_000_000) return compact(value / 1_000_000_000, suffixes.billion)
  if (value >= 1_000_000) return compact(value / 1_000_000, suffixes.million)
  if (value >= 1_000) return compact(value / 1_000, suffixes.thousand)
  return `€${value}`
}

export function formatDate(value: string, language: Language): string {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: language === 'zh' ? 'numeric' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
