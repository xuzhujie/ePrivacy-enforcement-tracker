import assert from 'node:assert/strict'
import test from 'node:test'
import { cases } from '../src/data/cases.ts'
import { formatDate, formatFine } from '../src/lib/i18n.ts'
import { exportCaseCsv, exportCaseJson } from '../src/lib/export.ts'
import type { CaseFilters } from '../src/lib/filterCases.ts'

const filters: CaseFilters = {
  query: '',
  topic: 'all',
  authority: 'all',
  country: 'all',
  year: 'all',
  surface: 'all',
  legalBasisId: 'all',
  outcome: 'all',
  evidenceStatus: 'all',
  reviewQueue: 'all',
}

test('formats fines and dates for both supported languages', () => {
  assert.equal(formatFine(475_000_000, 'zh'), '€475m')
  assert.equal(formatFine(475_000_000, 'en'), '€475m')
  assert.equal(formatFine(1_500_000, 'en'), '€1.5m')
  assert.equal(formatFine(879_250_500, 'en'), '€879.25m')
  assert.equal(formatFine(1_684_350_500, 'en'), '€1.68bn')
  assert.equal(formatFine(null, 'zh'), '—')
  assert.match(formatDate('2025-09-01', 'zh'), /2025/)
  assert.match(formatDate('2025-09-01', 'en'), /2025/)
})

test('exports canonical JSON with full legal-basis and source evidence', () => {
  const zh = JSON.parse(exportCaseJson(cases, filters)) as { filters: CaseFilters; cases: typeof cases }
  const en = JSON.parse(exportCaseJson(cases, filters)) as { filters: CaseFilters; cases: typeof cases }

  assert.deepEqual(zh.filters, filters)
  assert.equal(zh.cases[0].legalBases.length, 2)
  assert.equal(zh.cases[0].gdprTreatment, 'excluded')
  assert.ok(zh.cases[0].gdprExclusionReason?.en)
  assert.ok(zh.cases[0].events.length > 0)
  assert.ok(zh.cases[0].sources.length > 0)
  assert.deepEqual(zh.cases, en.cases)
})

test('exports flat CSV rows with stable IDs and both language labels', () => {
  const csv = exportCaseCsv(cases, 'zh')

  assert.match(csv, /^case_id,title_zh,title_en/)
  assert.match(csv, /EP-2025-001/)
  assert.match(csv, /fr-article-82\|fr-cpce-l34-5/)
  assert.match(csv, /gdpr_treatment/)
  assert.match(csv, /amount_allocation/)
  assert.match(csv, /gdpr_exclusion_reason_zh/)
  assert.match(csv, /gdpr_exclusion_reason_en/)
  assert.match(csv, /https:\/\/www\.cnil\.fr\/en\//)
  assert.match(csv, /2026-09-23/)
})
