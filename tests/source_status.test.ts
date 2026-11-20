import assert from 'node:assert/strict'
import test from 'node:test'
import { readSourceStatusSnapshot, summarizeSourceStatus } from '../src/lib/sourceStatus.ts'

const validSnapshot = {
  checkedAt: '2026-11-20T02:30:00.000Z',
  totalCount: 2,
  okCount: 1,
  attentionCount: 1,
  blockingCount: 0,
  results: [
    { url: 'https://example.com/ok', statusCode: 200, finalUrl: 'https://example.com/ok', status: 'ok' },
    { url: 'https://example.com/blocked', statusCode: 403, finalUrl: 'https://example.com/blocked', status: 'needs_review' },
  ],
}

test('accepts a complete source status snapshot and summarizes its counts', () => {
  const snapshot = readSourceStatusSnapshot(validSnapshot)

  assert.ok(snapshot)
  assert.equal(snapshot.checkedAt, '2026-11-20T02:30:00.000Z')
  assert.deepEqual(summarizeSourceStatus(snapshot), {
    label: 'attention',
    totalCount: 2,
    okCount: 1,
    attentionCount: 1,
    blockingCount: 0,
    checkedAt: '2026-11-20T02:30:00.000Z',
  })
})

test('returns unavailable when a snapshot is missing or malformed', () => {
  assert.equal(readSourceStatusSnapshot(null), null)
  assert.equal(readSourceStatusSnapshot({ ...validSnapshot, okCount: 99 }), null)
  assert.deepEqual(summarizeSourceStatus(null), {
    label: 'unavailable',
    totalCount: 0,
    okCount: 0,
    attentionCount: 0,
    blockingCount: 0,
    checkedAt: null,
  })
})

test('keeps automated reachability separate from manual evidence status', () => {
  const snapshot = readSourceStatusSnapshot(validSnapshot)
  assert.ok(snapshot)

  const manuallyVerified = { verificationStatus: 'verified' as const }
  const blockedResult = snapshot.results.find((result) => result.status === 'needs_review')
  assert.equal(manuallyVerified.verificationStatus, 'verified')
  assert.equal(blockedResult?.status, 'needs_review')
})
