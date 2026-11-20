import { cases, legalBases, type LocalizedText, type Language, type CaseOutcome, type EnforcementSurface, type EnforcementTopic, type EvidenceStatus } from '../data/cases.ts'
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
  reviewQueue: 'all',
}

export function getStoredLanguage(storage?: Pick<Storage, 'getItem'> | null): Language {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : null)
  return target?.getItem('eprivacy-tracker-language') === 'en' ? 'en' : 'zh'
}

export function isTopic(value: string): value is EnforcementTopic {
  return value === 'cookies' || value === 'app_sdk' || value === 'device_identifiers' || value === 'e_marketing'
}

const SURFACES: EnforcementSurface[] = ['web', 'mobile_app', 'email', 'sms', 'mixed']
const OUTCOMES: CaseOutcome[] = ['fine', 'injunction', 'closed', 'proceeding', 'prosecution']
const EVIDENCE_STATUSES: EvidenceStatus[] = ['verified', 'needs_review', 'excluded']
const AUTHORITY_VALUES = new Set(cases.flatMap((item) => [item.authority.zh, item.authority.en]))
const COUNTRY_VALUES = new Set(cases.flatMap((item) => [item.country.zh, item.country.en]))
const YEAR_VALUES = new Set(cases.map((item) => item.decisionDate.slice(0, 4)))
const LEGAL_BASIS_VALUES = new Set(legalBases.map((basis) => basis.id))

function readKnownFilter(value: string | null, validValues: ReadonlySet<string>, fallback = 'all'): string {
  const trimmed = value?.trim() ?? ''
  return validValues.has(trimmed) ? trimmed : fallback
}

function readEnum<T extends string>(value: string | null, values: readonly T[], fallback: T | 'all' = 'all'): T | 'all' {
  return value && values.includes(value as T) ? value as T : fallback
}

export function parseFiltersFromSearch(search: string): CaseFilters {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const year = params.get('year')

  return {
    query: params.get('q') ?? '',
    topic: readEnum(params.get('topic'), ['cookies', 'app_sdk', 'device_identifiers', 'e_marketing'] as const),
    authority: readKnownFilter(params.get('authority'), AUTHORITY_VALUES),
    country: readKnownFilter(params.get('country'), COUNTRY_VALUES),
    year: readKnownFilter(year, YEAR_VALUES),
    surface: readEnum(params.get('surface'), SURFACES),
    legalBasisId: readKnownFilter(params.get('basis'), LEGAL_BASIS_VALUES),
    outcome: readEnum(params.get('outcome'), OUTCOMES),
    evidenceStatus: readEnum(params.get('evidence'), EVIDENCE_STATUSES),
    reviewQueue: params.get('review') === 'needs_review' ? 'needs_review' : 'all',
  }
}

export function serializeFiltersToSearch(filters: CaseFilters): string {
  const params = new URLSearchParams()
  const setIfActive = (key: string, value: string, defaultValue = 'all') => {
    if (value && value !== defaultValue) params.set(key, value)
  }

  if (filters.query.trim()) params.set('q', filters.query.trim())
  setIfActive('topic', filters.topic)
  setIfActive('authority', filters.authority)
  setIfActive('country', filters.country)
  setIfActive('year', filters.year)
  setIfActive('surface', filters.surface)
  setIfActive('basis', filters.legalBasisId)
  setIfActive('outcome', filters.outcome)
  setIfActive('evidence', filters.evidenceStatus)
  setIfActive('review', filters.reviewQueue)

  const value = params.toString()
  return value ? `?${value}` : ''
}
