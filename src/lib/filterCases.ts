import { EVIDENCE_STATUS_META, SURFACE_META, TOPIC_META, type CaseOutcome, type EnforcementCase, type EnforcementSurface, type EnforcementTopic, type EvidenceStatus, type Language } from '../data/cases.ts'

export type FilterValue = string | 'all'

export interface CaseFilters {
  query: string
  topic: EnforcementTopic | 'all'
  authority: FilterValue
  country: FilterValue
  year: FilterValue
  surface: EnforcementSurface | 'all'
  legalBasisId: FilterValue
  outcome: CaseOutcome | 'all'
  evidenceStatus: EvidenceStatus | 'all'
}

export type SortKey = 'lastVerified' | 'fine' | 'authority' | 'legalBasis'
export type SortDirection = 'asc' | 'desc'

const localizedValues = (value: { zh: string; en: string }): string[] => [value.zh, value.en]

function searchableValues(item: EnforcementCase): string[] {
  return [
    item.id,
    ...localizedValues(item.title),
    ...localizedValues(item.authority),
    ...localizedValues(item.country),
    ...localizedValues(item.entity),
    ...localizedValues(item.status),
    ...localizedValues(item.summary),
    ...localizedValues(item.evidenceNote),
    ...localizedValues(item.fineScopeNote),
    ...(item.reviewReason ? localizedValues(item.reviewReason) : []),
    item.decisionReference ?? '',
    EVIDENCE_STATUS_META[item.evidenceStatus].zh,
    EVIDENCE_STATUS_META[item.evidenceStatus].en,
    SURFACE_META[item.surface].zh,
    SURFACE_META[item.surface].en,
    ...item.topics.flatMap((topic) => localizedValues(TOPIC_META[topic].label)),
    ...item.legalBases.flatMap((basis) => [...localizedValues(basis.label), ...localizedValues(basis.jurisdiction), basis.id]),
  ]
}

const matchesLanguageValue = (value: { zh: string; en: string }, filter: FilterValue): boolean => {
  if (filter === 'all') return true
  return localizedValues(value).includes(filter)
}

export function filterCases(items: EnforcementCase[], filters: CaseFilters, language: Language = 'zh'): EnforcementCase[] {
  const query = filters.query.trim().toLocaleLowerCase(language === 'zh' ? 'zh-CN' : 'en-US')

  return items.filter((item) => {
    const matchesQuery = query.length === 0 || searchableValues(item).some((value) => value.toLocaleLowerCase().includes(query))
    const matchesTopic = filters.topic === 'all' || item.topics.includes(filters.topic)
    const matchesAuthority = matchesLanguageValue(item.authority, filters.authority)
    const matchesCountry = matchesLanguageValue(item.country, filters.country)
    const matchesYear = filters.year === 'all' || item.decisionDate.startsWith(filters.year)
    const matchesSurface = filters.surface === 'all' || item.surface === filters.surface
    const matchesLegalBasis = filters.legalBasisId === 'all' || item.legalBases.some((basis) => basis.id === filters.legalBasisId)
    const matchesOutcome = filters.outcome === 'all' || item.outcome === filters.outcome
    const matchesEvidenceStatus = filters.evidenceStatus === 'all' || item.evidenceStatus === filters.evidenceStatus

    return matchesQuery && matchesTopic && matchesAuthority && matchesCountry && matchesYear && matchesSurface && matchesLegalBasis && matchesOutcome && matchesEvidenceStatus
  })
}

export function sortCases(items: EnforcementCase[], sortKey: SortKey, direction: SortDirection): EnforcementCase[] {
  const factor = direction === 'asc' ? 1 : -1
  return [...items].sort((left, right) => {
    let comparison = 0
    if (sortKey === 'fine') {
      comparison = (left.fineEur ?? -1) - (right.fineEur ?? -1)
    } else if (sortKey === 'lastVerified') {
      comparison = left.lastVerifiedAt.localeCompare(right.lastVerifiedAt)
    } else if (sortKey === 'authority') {
      comparison = left.authority.en.localeCompare(right.authority.en)
    } else {
      comparison = left.legalBases[0]?.id.localeCompare(right.legalBases[0]?.id ?? '') ?? 0
    }
    return comparison === 0 ? left.id.localeCompare(right.id) : comparison * factor
  })
}
