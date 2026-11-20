import assert from 'node:assert/strict'
import test from 'node:test'
import { cases, legalBases } from '../src/data/cases.ts'
import { getDashboardMetrics, getSourceRegistry, flattenTimeline } from '../src/data/dashboardMetrics.ts'

test('aggregates only explicitly excluded ePrivacy cases', () => {
  const mixed = {
    ...cases[0],
    id: 'MIXED-001',
    fineEur: 999_000_000,
    gdprTreatment: 'mixed_needs_review' as const,
    legalBases: [{ ...legalBases[0], id: 'gdpr-article-6', family: 'gdpr' as const }],
  }
  const metrics = getDashboardMetrics([...cases, mixed])

  assert.equal(metrics.eprivacyFineTotal, 1_684_350_500)
  assert.equal(metrics.eprivacyCaseCount, 17)
  assert.equal(metrics.reviewCaseCount, 4)
  assert.equal(metrics.topicCounts.cookies, 9)
  assert.equal(metrics.topicCounts.e_marketing, 8)
  assert.equal(metrics.topicCounts.app_sdk, 0)
  assert.equal(metrics.topicCounts.device_identifiers, 3)
  assert.equal(metrics.allTopicCounts.app_sdk, 1)
  assert.ok(metrics.sourceCount >= 28)
  assert.deepEqual(metrics.sourceEvidenceStatusCounts, { verified: 31, needs_review: 1 })
})

test('deduplicates official source URLs while retaining case coverage', () => {
  const registry = getSourceRegistry(cases)
  const aggregate = registry.find((source) => source.url.includes('cookie-regulation-cnil-continuing'))

  assert.ok(aggregate)
  assert.equal(registry.filter((source) => source.url === aggregate.url).length, 1)
  assert.deepEqual(aggregate.caseIds.sort(), ['EP-2025-001', 'EP-2025-002'])
  assert.equal(aggregate.verificationStatus, 'verified')
})

test('flattens events newest-first without mutating case data', () => {
  const timeline = flattenTimeline(cases)

  assert.equal(timeline[0].date, '2026-11-14')
  assert.equal(timeline[0].caseId, 'EP-2026-003')
  const googleFollowUp = timeline.find((event) => event.caseId === 'EP-2025-001' && event.date === '2026-09-23')
  assert.ok(googleFollowUp?.source?.url.includes('closure-injunction-google'))
  const googleDecision = timeline.find((event) => event.caseId === 'EP-2025-001' && event.date === '2025-09-01')
  assert.ok(googleDecision?.source?.url.includes('cookies-and-advertisements-inserted-between-emails-google'))
  assert.deepEqual(cases[0].events.map((event) => event.date), ['2025-09-01', '2026-09-23'])
})
