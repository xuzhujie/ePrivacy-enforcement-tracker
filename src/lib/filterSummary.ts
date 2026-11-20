import { EVIDENCE_STATUS_META, OUTCOME_META, SURFACE_META, TOPIC_META, type EnforcementSurface, type LegalBasis } from '../data/cases.ts'
import { DEFAULT_FILTERS } from './appState.ts'
import { copy } from './copy.ts'
import type { CaseFilters } from './filterCases.ts'
import type { LocalizedFilterOption } from './filterOptions.ts'
import type { Language } from './i18n.ts'

export interface FilterSummaryOptions {
  authorities: LocalizedFilterOption[]
  countries: LocalizedFilterOption[]
  years: string[]
  surfaces: EnforcementSurface[]
  legalBases: LegalBasis[]
}

function optionLabel(options: LocalizedFilterOption[], value: string, language: Language): string {
  return options.find((option) => option.value === value)?.label[language] ?? value
}

export function hasActiveFilters(filters: CaseFilters): boolean {
  return Object.keys(DEFAULT_FILTERS).some((key) => filters[key as keyof CaseFilters] !== DEFAULT_FILTERS[key as keyof CaseFilters])
}

export function buildActiveFilterSummary(filters: CaseFilters, language: Language, options: FilterSummaryOptions): string[] {
  const labels: string[] = []
  if (filters.query) labels.push(`${copy(language, 'search')}: ${filters.query}`)
  if (filters.topic !== 'all') labels.push(`${copy(language, 'topics')}: ${TOPIC_META[filters.topic].label[language]}`)
  if (filters.authority !== 'all') labels.push(`${copy(language, 'authority')}: ${optionLabel(options.authorities, filters.authority, language)}`)
  if (filters.country !== 'all') labels.push(`${copy(language, 'country')}: ${optionLabel(options.countries, filters.country, language)}`)
  if (filters.year !== 'all') labels.push(`${copy(language, 'year')}: ${filters.year}`)
  if (filters.surface !== 'all') labels.push(`${copy(language, 'surface')}: ${SURFACE_META[filters.surface][language]}`)
  if (filters.legalBasisId !== 'all') {
    const basis = options.legalBases.find((item) => item.id === filters.legalBasisId)
    labels.push(`${copy(language, 'legalBasis')}: ${basis?.label[language] ?? filters.legalBasisId}`)
  }
  if (filters.outcome !== 'all') labels.push(`${copy(language, 'outcome')}: ${OUTCOME_META[filters.outcome][language]}`)
  if (filters.evidenceStatus !== 'all') labels.push(`${copy(language, 'evidenceStatus')}: ${EVIDENCE_STATUS_META[filters.evidenceStatus][language]}`)
  if (filters.reviewQueue !== 'all') labels.push(`${copy(language, 'reviewQueue')}: ${copy(language, 'reviewQueueNeedsReview')}`)
  return labels
}
