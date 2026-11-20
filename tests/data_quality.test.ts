import assert from 'node:assert/strict'
import test from 'node:test'
import { cases } from '../src/data/cases.ts'
import { getDashboardMetrics } from '../src/data/dashboardMetrics.ts'
import { validateCaseDataset } from '../src/data/dataQuality.ts'
import { filterCases, type CaseFilters } from '../src/lib/filterCases.ts'
import { exportCaseCsv } from '../src/lib/export.ts'

const baseFilters: CaseFilters = {
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

test('includes official coverage beyond the two seed cases', () => {
  assert.ok(cases.length >= 15)

  const fnac = cases.find((item) => item.id === 'EP-2026-001')
  assert.ok(fnac)
  assert.equal(fnac.evidenceStatus, 'verified')
  assert.equal(fnac.trackerTreatment, 'included')
  assert.equal(fnac.surface, 'mobile_app')
  assert.ok(fnac.topics.includes('device_identifiers'))

  const vodafone = cases.find((item) => item.id === 'EP-2023-002')
  assert.ok(vodafone)
  assert.equal(vodafone.legalBases[0].id, 'ie-si-336-reg-13')
  assert.equal(vodafone.outcome, 'fine')
})

test('keeps GDPR-only SDK reference coverage outside the ePrivacy count', () => {
  const foodinho = cases.find((item) => item.id === 'EP-2024-006')
  assert.ok(foodinho)
  assert.equal(foodinho.gdprTreatment, 'included')
  assert.equal(foodinho.trackerTreatment, 'excluded')
  assert.equal(getDashboardMetrics(cases).eprivacyCaseCount, 17)
})

test('keeps mixed legal-basis decisions in the evidence review queue', () => {
  const solocal = cases.find((item) => item.id === 'EP-2025-003')
  assert.ok(solocal)
  assert.equal(solocal.trackerTreatment, 'needs_review')
  assert.equal(solocal.gdprTreatment, 'mixed_needs_review')
  assert.equal(solocal.fineEur, null)
  assert.equal(solocal.totalDecisionAmountEur, 900_000)
  assert.equal(solocal.amountAllocation, 'unresolved')

  const cosmospace = cases.find((item) => item.id === 'EP-2024-004')
  assert.ok(cosmospace)
  assert.equal(cosmospace.amountAllocation, 'exact')
  assert.equal(cosmospace.fineEur, 50_000)
  assert.equal(cosmospace.trackerTreatment, 'included')

  const caloga = cases.find((item) => item.id === 'EP-2025-004')
  assert.ok(caloga)
  assert.equal(caloga.amountAllocation, 'unresolved')
  assert.equal(caloga.fineEur, null)
  assert.equal(caloga.totalDecisionAmountEur, 80_000)

  const metrics = getDashboardMetrics(cases)
  assert.ok(metrics.reviewCaseCount >= 3)
  assert.equal(metrics.eprivacyFineTotal, cases
    .filter((item) => item.trackerTreatment === 'included')
    .reduce((total, item) => total + (item.fineEur ?? 0), 0))
  assert.ok(cases.filter((item) => item.trackerTreatment === 'needs_review').every((item) => item.reviewReason?.en))
})

test('exposes evidence status as a filter and export field', () => {
  const reviewCases = filterCases(cases, { ...baseFilters, evidenceStatus: 'needs_review' })
  assert.ok(reviewCases.length >= 1)
  assert.ok(reviewCases.every((item) => item.evidenceStatus === 'needs_review'))

  const csv = exportCaseCsv(reviewCases, 'zh')
  assert.match(csv, /evidence_status/)
  assert.match(csv, /tracker_treatment/)
  assert.match(csv, /total_decision_amount_eur/)
  assert.match(csv, /amount_allocation/)
})

test('passes the dataset quality gate with unique IDs and source evidence', () => {
  const report = validateCaseDataset(cases)
  assert.equal(report.errorCount, 0)
  assert.equal(report.caseCount, cases.length)
  assert.equal(report.duplicateCaseIdCount, 0)
  assert.ok(report.verifiedSourceCount >= cases.length - 1)
})
