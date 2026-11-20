import assert from 'node:assert/strict'
import test from 'node:test'
import { legalBases, SURFACE_META, TOPIC_META } from '../src/data/cases.ts'
import { DEFAULT_FILTERS } from '../src/lib/appState.ts'
import { buildActiveFilterSummary, hasActiveFilters, type FilterSummaryOptions } from '../src/lib/filterSummary.ts'
import type { CaseFilters } from '../src/lib/filterCases.ts'

const options: FilterSummaryOptions = {
  authorities: [{ value: 'CNIL', label: { zh: 'CNIL', en: 'CNIL' } }],
  countries: [{ value: 'France', label: { zh: '法国', en: 'France' } }],
  years: ['2025'],
  surfaces: ['mobile_app'],
  legalBases,
}

test('builds localized active-filter labels while keeping stable filter values', () => {
  const filters: CaseFilters = {
    ...DEFAULT_FILTERS,
    query: 'Meta',
    topic: 'device_identifiers',
    authority: 'CNIL',
    country: 'France',
    year: '2025',
    surface: 'mobile_app',
    legalBasisId: 'fr-article-82',
    outcome: 'fine',
    evidenceStatus: 'needs_review',
  }

  const zh = buildActiveFilterSummary(filters, 'zh', options)
  const en = buildActiveFilterSummary(filters, 'en', options)

  assert.equal(hasActiveFilters(filters), true)
  assert.ok(zh.some((label) => label.includes(TOPIC_META.device_identifiers.label.zh)))
  assert.ok(zh.some((label) => label.includes(SURFACE_META.mobile_app.zh)))
  assert.ok(en.some((label) => label.includes(TOPIC_META.device_identifiers.label.en)))
  assert.ok(en.some((label) => label.includes(SURFACE_META.mobile_app.en)))
  assert.ok(zh.some((label) => label.includes('法国')))
  assert.ok(en.some((label) => label.includes('France')))
})

test('returns no active labels for the default filter state', () => {
  assert.equal(hasActiveFilters(DEFAULT_FILTERS), false)
  assert.deepEqual(buildActiveFilterSummary(DEFAULT_FILTERS, 'zh', options), [])
})
