import assert from 'node:assert/strict'
import test from 'node:test'
import { APP_TITLE } from '../src/App.tsx'

test('the application exposes the tracker title for the shell', () => {
  assert.equal(APP_TITLE, 'ePrivacy｜独立执法 Tracker')
})
