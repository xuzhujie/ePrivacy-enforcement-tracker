import type { LocalizedText, Language, EnforcementTopic } from '../data/cases.ts'
import type { CaseFilters } from './filterCases.ts'

export type ViewKey = 'overview' | 'cases' | 'timeline' | 'sources'

export const VIEW_META: Record<ViewKey, { label: LocalizedText }> = {
  overview: { label: { zh: '总览', en: 'Overview' } },
  cases: { label: { zh: '案件登记', en: 'Case register' } },
  timeline: { label: { zh: '时间线', en: 'Timeline' } },
  sources: { label: { zh: '来源', en: 'Sources' } },
}

export const DEFAULT_FILTERS: CaseFilters = {
  query: '',
  topic: 'all',
  authority: 'all',
  country: 'all',
  year: 'all',
  surface: 'all',
  legalBasisId: 'all',
  outcome: 'all',
  evidenceStatus: 'all',
}

export function getStoredLanguage(storage?: Pick<Storage, 'getItem'> | null): Language {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : null)
  return target?.getItem('eprivacy-tracker-language') === 'en' ? 'en' : 'zh'
}

export function isTopic(value: string): value is EnforcementTopic {
  return value === 'cookies' || value === 'app_sdk' || value === 'device_identifiers' || value === 'e_marketing'
}
