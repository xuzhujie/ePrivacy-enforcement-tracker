import { TOPIC_META, type EnforcementCase } from '../data/cases.ts'
import type { CaseFilters } from './filterCases.ts'
import type { Language } from './i18n.ts'

export function exportCaseJson(items: EnforcementCase[], filters: CaseFilters): string {
  return JSON.stringify({
    exported_at: new Date().toISOString(),
    filters,
    cases: items,
  }, null, 2)
}

function csvCell(value: string | number | null | undefined): string {
  const raw = value == null ? '' : String(value)
  return `"${raw.replaceAll('"', '""')}"`
}

export function exportCaseCsv(items: EnforcementCase[], _language: Language): string {
  const columns = [
    'case_id',
    'title_zh',
    'title_en',
    'authority_zh',
    'authority_en',
    'country_zh',
    'country_en',
    'entity_zh',
    'entity_en',
    'topics',
    'topic_labels_zh',
    'topic_labels_en',
    'legal_basis_ids',
    'legal_basis_zh',
    'legal_basis_en',
    'surface',
    'enforcement_route',
    'outcome',
    'status_zh',
    'status_en',
    'fine_eur',
    'total_decision_amount_eur',
    'amount_allocation',
    'fine_scope_note_zh',
    'fine_scope_note_en',
    'monetary_outcome_zh',
    'monetary_outcome_en',
    'decision_reference',
    'decision_date',
    'latest_date',
    'last_verified_at',
    'evidence_status',
    'evidence_level',
    'tracker_treatment',
    'review_reason_zh',
    'review_reason_en',
    'gdpr_treatment',
    'gdpr_exclusion_reason_zh',
    'gdpr_exclusion_reason_en',
    'event_dates',
    'event_labels_zh',
    'event_labels_en',
    'source_urls',
    'source_types',
    'last_checked_at',
  ]

  const rows = items.map((item) => [
    item.id,
    item.title.zh,
    item.title.en,
    item.authority.zh,
    item.authority.en,
    item.country.zh,
    item.country.en,
    item.entity.zh,
    item.entity.en,
    item.topics.join('|'),
    item.topics.map((topic) => TOPIC_META[topic].label.zh).join('|'),
    item.topics.map((topic) => TOPIC_META[topic].label.en).join('|'),
    item.legalBases.map((basis) => basis.id).join('|'),
    item.legalBases.map((basis) => basis.label.zh).join('|'),
    item.legalBases.map((basis) => basis.label.en).join('|'),
    item.surface,
    item.enforcementRoute,
    item.outcome,
    item.status.zh,
    item.status.en,
    item.fineEur,
    item.totalDecisionAmountEur,
    item.amountAllocation,
    item.fineScopeNote.zh,
    item.fineScopeNote.en,
    item.monetaryOutcome?.zh,
    item.monetaryOutcome?.en,
    item.decisionReference,
    item.decisionDate,
    item.latestDate,
    item.lastVerifiedAt,
    item.evidenceStatus,
    item.evidenceLevel,
    item.trackerTreatment,
    item.reviewReason?.zh,
    item.reviewReason?.en,
    item.gdprTreatment,
    item.gdprExclusionReason?.zh,
    item.gdprExclusionReason?.en,
    item.events.map((event) => event.date).join('|'),
    item.events.map((event) => event.label.zh).join('|'),
    item.events.map((event) => event.label.en).join('|'),
    item.sources.map((source) => source.url).join('|'),
    item.sources.map((source) => source.sourceType).join('|'),
    item.sources.map((source) => source.lastCheckedAt).join('|'),
  ].map(csvCell).join(','))

  return [columns.join(','), ...rows].join('\n') + '\n'
}
