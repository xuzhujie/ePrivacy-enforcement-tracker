import assert from 'node:assert/strict'
import test from 'node:test'
import { cases } from '../src/data/cases.ts'
import { filterCases, sortCases, type CaseFilters } from '../src/lib/filterCases.ts'

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

test('filters the register by topic and legal basis', () => {
  const eMarketingIds = filterCases(cases, { ...baseFilters, topic: 'e_marketing' }).map((item) => item.id)
  assert.ok(eMarketingIds.includes('EP-2025-001'))
  assert.ok(eMarketingIds.includes('EP-2023-002'))
  assert.deepEqual(
    filterCases(cases, { ...baseFilters, topic: 'app_sdk' }).map((item) => item.id),
    [],
  )
  const l34Ids = filterCases(cases, { ...baseFilters, legalBasisId: 'fr-cpce-l34-5' }).map((item) => item.id)
  assert.ok(l34Ids.includes('EP-2025-001'))
  assert.ok(l34Ids.includes('EP-2025-003'))
})

test('searches case IDs, entities, topics, and legal-basis labels', () => {
  assert.deepEqual(filterCases(cases, { ...baseFilters, query: 'EP-2025-002' }).map((item) => item.id), ['EP-2025-002'])
  const eMarketingQueryIds = filterCases(cases, { ...baseFilters, query: '电子营销' }).map((item) => item.id)
  assert.ok(eMarketingQueryIds.includes('EP-2025-001'))
  assert.ok(eMarketingQueryIds.includes('EP-2023-002'))
  const l34QueryIds = filterCases(cases, { ...baseFilters, query: 'article l.34-5' }).map((item) => item.id)
  assert.ok(l34QueryIds.includes('EP-2025-001'))
  assert.ok(l34QueryIds.includes('EP-2025-003'))
})

test('filters by authority, country, and outcome', () => {
  assert.ok(filterCases(cases, { ...baseFilters, authority: 'CNIL' }).length >= 10)
  assert.ok(filterCases(cases, { ...baseFilters, country: 'France' }).length >= 10)
  assert.ok(filterCases(cases, { ...baseFilters, outcome: 'fine' }).length >= 10)
  assert.deepEqual(filterCases(cases, { ...baseFilters, surface: 'mobile_app' }).map((item) => item.id), ['EP-2026-001', 'EP-2026-003'])
  assert.deepEqual(filterCases(cases, { ...baseFilters, year: '2025' }).map((item) => item.id), [
    'EP-2025-001',
    'EP-2025-002',
    'EP-2025-003',
    'EP-2025-004',
    'EP-2025-005',
    'EP-2025-006',
  ])
})

test('sorts cases by fine and keeps stable case-id tie breaking', () => {
  const sortedByFine = sortCases(cases, 'fine', 'desc')
  assert.equal(sortedByFine[0].id, 'EP-2026-003')
  assert.equal(sortedByFine[1].id, 'EP-2025-001')
  assert.equal(sortedByFine[2].id, 'EP-2021-001')
  assert.ok((sortedByFine[1].fineEur ?? 0) >= (sortedByFine[2].fineEur ?? 0))
  const sortedByAuthority = sortCases(cases, 'authority', 'asc')
  assert.equal(sortedByAuthority[0].id, 'EP-2023-001')
  assert.ok(sortedByAuthority.findIndex((item) => item.id === 'EP-2025-001') > sortedByAuthority.findIndex((item) => item.id === 'EP-2023-001'))
})
