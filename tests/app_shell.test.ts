import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_FILTERS, getStoredLanguage, VIEW_META } from '../src/lib/appState.ts'

test('starts in the case register with Chinese and unfiltered data', () => {
  assert.equal(VIEW_META.cases.label.zh, '案件登记')
  assert.equal(DEFAULT_FILTERS.topic, 'all')
  assert.equal(DEFAULT_FILTERS.query, '')
  assert.equal(getStoredLanguage({ getItem: () => null }), 'zh')
  assert.equal(getStoredLanguage({ getItem: () => 'en' }), 'en')
})

test('exposes the same four navigation views as the neighbouring trackers', () => {
  assert.deepEqual(Object.keys(VIEW_META), ['overview', 'cases', 'timeline', 'sources'])
})
