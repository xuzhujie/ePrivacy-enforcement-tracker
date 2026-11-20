import { Filter, RotateCcw } from 'lucide-react'
import { EVIDENCE_STATUS_META, OUTCOME_META, SURFACE_META, type CaseOutcome, type EnforcementSurface, type EvidenceStatus, type LegalBasis } from '../data/cases.ts'
import type { Language } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'
import type { CaseFilters } from '../lib/filterCases.ts'
import type { LocalizedFilterOption } from '../lib/filterOptions.ts'

interface FilterRowProps {
  filters: CaseFilters
  authorities: LocalizedFilterOption[]
  countries: LocalizedFilterOption[]
  years: string[]
  surfaces: EnforcementSurface[]
  legalBases: LegalBasis[]
  onChange: (patch: Partial<CaseFilters>) => void
  onClear: () => void
  language: Language
}

const OUTCOMES: CaseOutcome[] = ['fine', 'injunction', 'closed', 'proceeding', 'prosecution']
const EVIDENCE_STATUSES: EvidenceStatus[] = ['verified', 'needs_review', 'excluded']

export function FilterRow({ filters, authorities, countries, years, surfaces, legalBases, onChange, onClear, language }: FilterRowProps) {
  return (
    <div className="filter-row">
      <div className="filter-row-label"><Filter size={14} /> <span>{copy(language, 'search')}</span></div>
      <label className="filter-select-wrap">
        <span className="sr-only">{copy(language, 'authority')}</span>
        <select value={filters.authority} onChange={(event) => onChange({ authority: event.target.value })}>
          <option value="all">{copy(language, 'allAuthorities')}</option>
          {authorities.map((authority) => <option value={authority.value} key={authority.value}>{authority.label[language]}</option>)}
        </select>
      </label>
      <label className="filter-select-wrap">
        <span className="sr-only">{copy(language, 'country')}</span>
        <select value={filters.country} onChange={(event) => onChange({ country: event.target.value })}>
          <option value="all">{copy(language, 'allCountries')}</option>
          {countries.map((country) => <option value={country.value} key={country.value}>{country.label[language]}</option>)}
        </select>
      </label>
      <label className="filter-select-wrap">
        <span className="sr-only">{copy(language, 'year')}</span>
        <select value={filters.year} onChange={(event) => onChange({ year: event.target.value })}>
          <option value="all">{copy(language, 'allYears')}</option>
          {years.map((year) => <option value={year} key={year}>{year}</option>)}
        </select>
      </label>
      <label className="filter-select-wrap">
        <span className="sr-only">{copy(language, 'surface')}</span>
        <select value={filters.surface} onChange={(event) => onChange({ surface: event.target.value as EnforcementSurface | 'all' })}>
          <option value="all">{copy(language, 'allSurfaces')}</option>
          {surfaces.map((surface) => <option value={surface} key={surface}>{SURFACE_META[surface][language]}</option>)}
        </select>
      </label>
      <label className="filter-select-wrap filter-select-wide">
        <span className="sr-only">{copy(language, 'legalBasis')}</span>
        <select value={filters.legalBasisId} onChange={(event) => onChange({ legalBasisId: event.target.value })}>
          <option value="all">{copy(language, 'allLegalBases')}</option>
          {legalBases.map((basis) => <option value={basis.id} key={basis.id}>{basis.label[language]}</option>)}
        </select>
      </label>
      <label className="filter-select-wrap">
        <span className="sr-only">{copy(language, 'outcome')}</span>
        <select value={filters.outcome} onChange={(event) => onChange({ outcome: event.target.value as CaseOutcome | 'all' })}>
          <option value="all">{copy(language, 'allOutcomes')}</option>
          {OUTCOMES.map((outcome) => <option value={outcome} key={outcome}>{OUTCOME_META[outcome][language]}</option>)}
        </select>
      </label>
      <label className="filter-select-wrap">
        <span className="sr-only">{copy(language, 'evidenceStatus')}</span>
        <select value={filters.evidenceStatus} onChange={(event) => onChange({ evidenceStatus: event.target.value as EvidenceStatus | 'all' })}>
          <option value="all">{copy(language, 'allEvidenceStatuses')}</option>
          {EVIDENCE_STATUSES.map((status) => <option value={status} key={status}>{EVIDENCE_STATUS_META[status][language]}</option>)}
        </select>
      </label>
      <label className="filter-select-wrap">
        <span className="sr-only">{copy(language, 'reviewQueue')}</span>
        <select value={filters.reviewQueue} onChange={(event) => onChange({ reviewQueue: event.target.value as CaseFilters['reviewQueue'] })}>
          <option value="all">{copy(language, 'allReviewQueues')}</option>
          <option value="needs_review">{copy(language, 'reviewQueueNeedsReview')}</option>
        </select>
      </label>
      <button type="button" className="clear-filters" onClick={onClear}><RotateCcw size={13} /> {copy(language, 'clearFilters')}</button>
    </div>
  )
}
