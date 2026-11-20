import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_FILTERS, getStoredLanguage, parseFiltersFromSearch, serializeFiltersToSearch, VIEW_META } from '../src/lib/appState.ts'
import { isSearchShortcut } from '../src/lib/keyboard.ts'
import { COPY } from '../src/lib/copy.ts'

test('starts in the case register with Chinese and unfiltered data', () => {
  assert.equal(VIEW_META.cases.label.zh, '案件登记')
  assert.equal(DEFAULT_FILTERS.topic, 'all')
  assert.equal(DEFAULT_FILTERS.query, '')
  assert.equal(DEFAULT_FILTERS.reviewQueue, 'all')
  assert.equal(getStoredLanguage({ getItem: () => null }), 'zh')
  assert.equal(getStoredLanguage({ getItem: () => 'en' }), 'en')
})

test('round-trips supported filters through compact URL parameters', () => {
  const search = serializeFiltersToSearch({
    ...DEFAULT_FILTERS,
    query: 'Massimo Dutti',
    topic: 'cookies',
    authority: 'CNIL',
    country: 'France',
    year: '2025',
    surface: 'web',
    legalBasisId: 'fr-article-82',
    outcome: 'fine',
    evidenceStatus: 'needs_review',
    reviewQueue: 'needs_review',
  })

  assert.equal(search, '?q=Massimo+Dutti&topic=cookies&authority=CNIL&country=France&year=2025&surface=web&basis=fr-article-82&outcome=fine&evidence=needs_review&review=needs_review')
  assert.deepEqual(parseFiltersFromSearch(search), {
    ...DEFAULT_FILTERS,
    query: 'Massimo Dutti',
    topic: 'cookies',
    authority: 'CNIL',
    country: 'France',
    year: '2025',
    surface: 'web',
    legalBasisId: 'fr-article-82',
    outcome: 'fine',
    evidenceStatus: 'needs_review',
    reviewQueue: 'needs_review',
  })
})

test('falls back to defaults for invalid enum URL parameters', () => {
  assert.deepEqual(parseFiltersFromSearch('?topic=bogus&surface=unknown&outcome=wrong&evidence=bad&review=maybe'), DEFAULT_FILTERS)
  assert.deepEqual(parseFiltersFromSearch('?authority=Unknown&country=Unknown&year=2099&basis=unknown'), DEFAULT_FILTERS)
})

test('exposes the same four navigation views as the neighbouring trackers', () => {
  assert.deepEqual(Object.keys(VIEW_META), ['overview', 'cases', 'timeline', 'sources'])
})

test('recognizes Meta and Ctrl search shortcuts without treating plain K as a shortcut', () => {
  assert.equal(isSearchShortcut({ key: 'k', metaKey: true, ctrlKey: false }), true)
  assert.equal(isSearchShortcut({ key: 'K', metaKey: false, ctrlKey: true }), true)
  assert.equal(isSearchShortcut({ key: 'k', metaKey: false, ctrlKey: false }), false)
  assert.equal(COPY.zh.searchShortcut, '⌘ / Ctrl K')
})
