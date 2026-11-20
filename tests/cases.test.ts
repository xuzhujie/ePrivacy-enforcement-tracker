import assert from 'node:assert/strict'
import test from 'node:test'
import { cases } from '../src/data/cases.ts'

const google = cases.find((item) => item.id === 'EP-2025-001')
const shein = cases.find((item) => item.id === 'EP-2025-002')
const meta = cases.find((item) => item.id === 'EP-2026-003')
const foodinho = cases.find((item) => item.id === 'EP-2024-006')
const solocal = cases.find((item) => item.id === 'EP-2025-003')
const massimoDutti = cases.find((item) => item.id === 'EP-2023-001')

test('seeds the two official CNIL enforcement records', () => {
  assert.ok(cases.length >= 15)
  assert.ok(google)
  assert.ok(shein)

  assert.equal(google.fineEur, 325_000_000)
  assert.deepEqual(google.topics, ['cookies', 'e_marketing'])
  assert.equal(google.gdprTreatment, 'excluded')
  assert.equal(google.legalBases.length, 2)

  assert.equal(shein.fineEur, 150_000_000)
  assert.deepEqual(shein.topics, ['cookies'])
  assert.equal(shein.legalBases[0].id, 'fr-article-82')
})

test('adds the official Italian terminal-access enforcement record', () => {
  assert.ok(meta)
  assert.equal(meta.authority.en, 'Garante Privacy')
  assert.equal(meta.fineEur, 805_000_000)
  assert.equal(meta.totalDecisionAmountEur, 805_000_000)
  assert.equal(meta.amountAllocation, 'exact')
  assert.deepEqual(meta.topics, ['device_identifiers'])
  assert.equal(meta.legalBases[0].id, 'it-article-122')
  assert.equal(meta.decisionReference, 'Provvedimento 10321455')
  assert.ok(meta.sources.some((source) => source.url.includes('/10321455')))
  assert.equal(meta.topics.includes('app_sdk'), false)
})

test('tracks the official SDK record as GDPR-only and excludes it from the ePrivacy total', () => {
  assert.ok(foodinho)
  assert.deepEqual(foodinho.topics, ['app_sdk', 'device_identifiers'])
  assert.equal(foodinho.surface, 'mobile_app')
  assert.equal(foodinho.gdprTreatment, 'included')
  assert.equal(foodinho.trackerTreatment, 'excluded')
  assert.equal(foodinho.fineEur, null)
  assert.equal(foodinho.totalDecisionAmountEur, 5_000_000)
  assert.equal(foodinho.amountAllocation, 'not_applicable')
  assert.ok(foodinho.sources.some((source) => source.url.includes('10074601')))
})

test('keeps the Google amount combined across its two legal bases', () => {
  assert.ok(google)
  assert.match(google.fineScopeNote.en, /combined/i)
  assert.equal('fineAllocation' in google, false)
  assert.equal(google.events.some((event) => event.date === '2026-09-23'), true)
})

test('stores official source links and explicit non-GDPR treatment', () => {
  for (const item of cases.filter((caseItem) => caseItem.trackerTreatment === 'included')) {
    assert.ok(item.gdprTreatment === 'excluded' || (item.gdprTreatment === 'mixed_needs_review' && item.amountAllocation === 'exact'))
    assert.ok(item.gdprExclusionReason?.en)
    assert.ok(item.sources.every((source) => source.verificationStatus === 'verified'))
    assert.ok(item.lastVerifiedAt)
  }
})

test('pins explicit mixed-basis ePrivacy allocations to the primary decisions', () => {
  const cosmospace = cases.find((item) => item.id === 'EP-2024-004')
  const telemaque = cases.find((item) => item.id === 'EP-2024-005')

  assert.ok(cosmospace)
  assert.ok(telemaque)
  assert.equal(cosmospace.fineEur, 50_000)
  assert.equal(cosmospace.totalDecisionAmountEur, 250_000)
  assert.equal(cosmospace.amountAllocation, 'exact')
  assert.equal(cosmospace.decisionReference, 'SAN-2024-014')
  assert.ok(cosmospace.sources.some((source) => source.url === 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000050324625'))
  assert.equal(telemaque.fineEur, 50_000)
  assert.equal(telemaque.totalDecisionAmountEur, 150_000)
  assert.equal(telemaque.amountAllocation, 'exact')
  assert.equal(telemaque.decisionReference, 'SAN-2024-015')
  assert.ok(telemaque.sources.some((source) => source.url === 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000050324681'))
})

test('tracks the official SOLOCAL injunction closure without reallocating its mixed fine', () => {
  assert.ok(solocal)
  assert.equal(solocal.latestDate, '2026-09-17')
  assert.equal(solocal.fineEur, null)
  assert.equal(solocal.totalDecisionAmountEur, 900_000)
  assert.equal(solocal.amountAllocation, 'unresolved')
  assert.equal(solocal.trackerTreatment, 'needs_review')
  assert.ok(solocal.sources.some((source) => source.url === 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000054886539' && source.sourceType === 'follow_up'))
  assert.ok(solocal.events.some((event) => event.date === '2026-09-17' && event.sourceUrl?.includes('CNILTEXT000054886539')))
})

test('keeps Massimo Dutti in review when only the annual-report evidence is verified', () => {
  assert.ok(massimoDutti)
  assert.equal(massimoDutti.evidenceLevel, 'annual_report')
  assert.equal(massimoDutti.evidenceStatus, 'needs_review')
  assert.equal(massimoDutti.trackerTreatment, 'needs_review')
})
