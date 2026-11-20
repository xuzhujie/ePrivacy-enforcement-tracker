import type { LocalizedText } from '../data/cases.ts'
import type { EnforcementCase } from '../data/cases.ts'

export interface LocalizedFilterOption {
  value: string
  label: LocalizedText
}

export type LocalizedCaseField = 'authority' | 'country'

export function buildLocalizedFilterOptions(items: EnforcementCase[], field: LocalizedCaseField): LocalizedFilterOption[] {
  const options = new Map(items.map((item) => {
    const label = item[field]
    return [label.en, { value: label.en, label }] as const
  }))
  return [...options.values()].sort((left, right) => left.label.en.localeCompare(right.label.en))
}
