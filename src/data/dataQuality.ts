import type { EnforcementCase } from './cases.ts'

export interface DataQualityIssue {
  severity: 'error' | 'warning'
  caseId: string
  field: string
  message: string
}

export interface DataQualityReport {
  caseCount: number
  duplicateCaseIdCount: number
  sourceCount: number
  verifiedSourceCount: number
  reviewCaseCount: number
  errorCount: number
  warningCount: number
  issues: DataQualityIssue[]
}

const OFFICIAL_HOSTS = ['cnil.fr', 'conseil-etat.fr', 'dataprotection.ie', 'aepd.es', 'eur-lex.europa.eu', 'legifrance.gouv.fr', 'garanteprivacy.it']

function isOfficialUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return OFFICIAL_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

export function validateCaseDataset(items: EnforcementCase[]): DataQualityReport {
  const issues: DataQualityIssue[] = []
  const seenIds = new Set<string>()
  let duplicateCaseIdCount = 0
  let sourceCount = 0
  let verifiedSourceCount = 0
  let reviewCaseCount = 0

  for (const item of items) {
    if (seenIds.has(item.id)) {
      duplicateCaseIdCount += 1
      issues.push({ severity: 'error', caseId: item.id, field: 'id', message: 'Case ID is duplicated.' })
    }
    seenIds.add(item.id)

    if (!item.title.zh || !item.title.en) issues.push({ severity: 'error', caseId: item.id, field: 'title', message: 'Bilingual case title is required.' })
    if (item.topics.length === 0) issues.push({ severity: 'error', caseId: item.id, field: 'topics', message: 'At least one enforcement topic is required.' })
    if (item.legalBases.length === 0) issues.push({ severity: 'error', caseId: item.id, field: 'legalBases', message: 'At least one legal basis is required.' })
    if (item.sources.length === 0) issues.push({ severity: 'error', caseId: item.id, field: 'sources', message: 'At least one official source is required.' })
    if (item.events.length === 0) issues.push({ severity: 'error', caseId: item.id, field: 'events', message: 'At least one dated event is required.' })
    if (!item.amountAllocation) issues.push({ severity: 'error', caseId: item.id, field: 'amountAllocation', message: 'Amount allocation treatment is required.' })

    if (item.trackerTreatment === 'included') {
      if (item.evidenceStatus !== 'verified') issues.push({ severity: 'error', caseId: item.id, field: 'evidenceStatus', message: 'Included cases must have verified evidence.' })
      if (item.gdprTreatment !== 'excluded' && !(item.gdprTreatment === 'mixed_needs_review' && item.amountAllocation === 'exact' && item.fineEur != null)) {
        issues.push({ severity: 'error', caseId: item.id, field: 'gdprTreatment', message: 'Included cases must be explicitly excluded from the GDPR count or have an exact official ePrivacy allocation.' })
      }
      if (!item.legalBases.some((legalBasis) => legalBasis.family === 'eprivacy')) issues.push({ severity: 'error', caseId: item.id, field: 'legalBases', message: 'Included cases need an ePrivacy legal basis.' })
    }

    if (item.gdprTreatment === 'mixed_needs_review' && item.amountAllocation === 'exact' && item.fineEur == null) {
      issues.push({ severity: 'error', caseId: item.id, field: 'fineEur', message: 'An exact mixed-basis allocation must provide the ePrivacy amount.' })
    }
    if (item.gdprTreatment === 'mixed_needs_review' && item.amountAllocation === 'unresolved' && item.fineEur != null) {
      issues.push({ severity: 'error', caseId: item.id, field: 'amountAllocation', message: 'Unresolved mixed-basis allocations cannot provide a counted fine.' })
    }

    if (item.trackerTreatment === 'needs_review' || item.evidenceStatus === 'needs_review') reviewCaseCount += 1
    if (item.fineEur != null && item.totalDecisionAmountEur != null && item.fineEur > item.totalDecisionAmountEur) {
      issues.push({ severity: 'error', caseId: item.id, field: 'fineEur', message: 'Counted fine cannot exceed the full decision amount.' })
    }
    if (item.trackerTreatment === 'needs_review' && !item.reviewReason) {
      issues.push({ severity: 'warning', caseId: item.id, field: 'reviewReason', message: 'Review cases should explain what remains unresolved.' })
    }

    for (const source of item.sources) {
      sourceCount += 1
      if (source.verificationStatus === 'verified') verifiedSourceCount += 1
      if (!isOfficialUrl(source.url)) issues.push({ severity: 'error', caseId: item.id, field: 'sources', message: `Source is not on an allowed official host: ${source.url}` })
    }
  }

  return {
    caseCount: items.length,
    duplicateCaseIdCount,
    sourceCount,
    verifiedSourceCount,
    reviewCaseCount,
    errorCount: issues.filter((issue) => issue.severity === 'error').length,
    warningCount: issues.filter((issue) => issue.severity === 'warning').length,
    issues,
  }
}
