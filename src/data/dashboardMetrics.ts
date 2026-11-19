import { type EnforcementCase, type EnforcementTopic, type CaseOutcome, type LocalizedText, type EvidenceStatus, type TrackerTreatment, type EvidenceLevel } from './cases.ts'

export interface FineByYear {
  year: string
  fine: number
  cumulative: number
}

export interface TimelineEvent {
  caseId: string
  caseTitle: LocalizedText
  entity: LocalizedText
  topics: EnforcementTopic[]
  legalBases: EnforcementCase['legalBases']
  fineEur: number | null
  date: string
  label: LocalizedText
  description: LocalizedText
  evidenceStatus: EvidenceStatus
  source: EnforcementCase['sources'][number] | null
  sources: EnforcementCase['sources']
}

export interface SourceRegistryEntry {
  url: string
  label: LocalizedText
  sourceTypes: EnforcementCase['sources'][number]['sourceType'][]
  caseIds: string[]
  entities: LocalizedText[]
  lastCheckedAt: string
  verificationStatus: 'verified' | 'needs_review'
  evidenceLevels: EvidenceLevel[]
}

export interface DashboardMetrics {
  totalCaseCount: number
  eprivacyFineTotal: number
  eprivacyCaseCount: number
  reviewCaseCount: number
  sourceCount: number
  topicCounts: Record<EnforcementTopic, number>
  allTopicCounts: Record<EnforcementTopic, number>
  legalBasisCounts: Record<string, number>
  outcomeCounts: Record<CaseOutcome, number>
  evidenceStatusCounts: Record<EvidenceStatus, number>
  trackerTreatmentCounts: Record<TrackerTreatment, number>
  finesByYear: FineByYear[]
  attention: EnforcementCase[]
  timeline: TimelineEvent[]
}

const TOPICS: EnforcementTopic[] = ['cookies', 'app_sdk', 'device_identifiers', 'e_marketing']
const OUTCOMES: CaseOutcome[] = ['fine', 'injunction', 'closed', 'proceeding', 'prosecution']
const EVIDENCE_STATUSES: EvidenceStatus[] = ['verified', 'needs_review', 'excluded']
const TRACKER_TREATMENTS: TrackerTreatment[] = ['included', 'needs_review', 'excluded']

function isCountedCase(item: EnforcementCase): boolean {
  return item.trackerTreatment === 'included'
    && item.evidenceStatus === 'verified'
    && (item.gdprTreatment === 'excluded'
      || (item.gdprTreatment === 'mixed_needs_review' && item.amountAllocation === 'exact' && item.fineEur != null))
    && item.legalBases.some((basis) => basis.family === 'eprivacy')
}

function isReviewCase(item: EnforcementCase): boolean {
  return item.trackerTreatment !== 'excluded' && !isCountedCase(item)
}

export function flattenTimeline(items: EnforcementCase[]): TimelineEvent[] {
  return items
    .flatMap((item) => item.events.map((event) => {
      const source = event.sourceUrl
        ? item.sources.find((candidate) => candidate.url === event.sourceUrl)
        : event.date === item.decisionDate
        ? item.sources.find((candidate) => candidate.sourceType === 'decision')
        : item.sources.find((candidate) => candidate.sourceType === 'follow_up')

      return {
      caseId: item.id,
      caseTitle: item.title,
      entity: item.entity,
      topics: item.topics,
      legalBases: item.legalBases,
      fineEur: event.date === item.decisionDate ? item.fineEur : null,
      date: event.date,
      label: event.label,
      description: event.description,
        evidenceStatus: item.evidenceStatus,
        source: source ?? item.sources[0] ?? null,
        sources: item.sources,
      }
    }))
    .sort((left, right) => right.date.localeCompare(left.date) || left.caseId.localeCompare(right.caseId))
}

export function getSourceRegistry(items: EnforcementCase[]): SourceRegistryEntry[] {
  const registry = new Map<string, SourceRegistryEntry>()

  for (const item of items) {
    for (const source of item.sources) {
      const existing = registry.get(source.url)
      if (existing) {
        existing.sourceTypes = [...new Set([...existing.sourceTypes, source.sourceType])]
        existing.evidenceLevels = [...new Set([...existing.evidenceLevels, source.evidenceLevel])]
        existing.caseIds = [...new Set([...existing.caseIds, item.id])].sort()
        if (!existing.entities.some((entity) => entity.zh === item.entity.zh && entity.en === item.entity.en)) {
          existing.entities.push(item.entity)
        }
        if (source.lastCheckedAt > existing.lastCheckedAt) existing.lastCheckedAt = source.lastCheckedAt
        if (source.verificationStatus === 'needs_review') existing.verificationStatus = 'needs_review'
      } else {
        registry.set(source.url, {
          url: source.url,
          label: source.label,
          sourceTypes: [source.sourceType],
          caseIds: [item.id],
          entities: [item.entity],
          lastCheckedAt: source.lastCheckedAt,
          verificationStatus: source.verificationStatus,
          evidenceLevels: [source.evidenceLevel],
        })
      }
    }
  }

  return [...registry.values()].sort((left, right) => right.lastCheckedAt.localeCompare(left.lastCheckedAt) || left.url.localeCompare(right.url))
}

export function getDashboardMetrics(items: EnforcementCase[]): DashboardMetrics {
  const topicCounts = Object.fromEntries(TOPICS.map((topic) => [topic, 0])) as Record<EnforcementTopic, number>
  const allTopicCounts = Object.fromEntries(TOPICS.map((topic) => [topic, 0])) as Record<EnforcementTopic, number>
  const legalBasisCounts: Record<string, number> = {}
  const outcomeCounts = Object.fromEntries(OUTCOMES.map((outcome) => [outcome, 0])) as Record<CaseOutcome, number>
  const evidenceStatusCounts = Object.fromEntries(EVIDENCE_STATUSES.map((status) => [status, 0])) as Record<EvidenceStatus, number>
  const trackerTreatmentCounts = Object.fromEntries(TRACKER_TREATMENTS.map((treatment) => [treatment, 0])) as Record<TrackerTreatment, number>
  const finesByYearMap = new Map<string, number>()
  let eprivacyFineTotal = 0
  let eprivacyCaseCount = 0
  let reviewCaseCount = 0

  for (const item of items) {
    for (const topic of item.topics) allTopicCounts[topic] += 1
    evidenceStatusCounts[item.evidenceStatus] += 1
    trackerTreatmentCounts[item.trackerTreatment] += 1
    outcomeCounts[item.outcome] += 1

    if (isReviewCase(item)) {
      reviewCaseCount += 1
    }

    if (isCountedCase(item)) {
      eprivacyCaseCount += 1
      eprivacyFineTotal += item.fineEur ?? 0
      for (const topic of item.topics) topicCounts[topic] += 1
      for (const basis of item.legalBases.filter((basis) => basis.family === 'eprivacy')) {
        legalBasisCounts[basis.id] = (legalBasisCounts[basis.id] ?? 0) + 1
      }
      if (item.fineEur != null) {
        const year = item.decisionDate.slice(0, 4)
        finesByYearMap.set(year, (finesByYearMap.get(year) ?? 0) + item.fineEur)
      }
    }
  }

  let cumulative = 0
  const finesByYear = [...finesByYearMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([year, fine]) => {
      cumulative += fine
      return { year, fine, cumulative }
    })

  return {
    totalCaseCount: items.length,
    eprivacyFineTotal,
    eprivacyCaseCount,
    reviewCaseCount,
    sourceCount: getSourceRegistry(items).length,
    topicCounts,
    allTopicCounts,
    legalBasisCounts,
    outcomeCounts,
    evidenceStatusCounts,
    trackerTreatmentCounts,
    finesByYear,
    attention: items.filter(isReviewCase),
    timeline: flattenTimeline(items),
  }
}
