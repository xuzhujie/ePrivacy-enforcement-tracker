import assert from 'node:assert/strict'
import test from 'node:test'
import { appendSourceStatusHistory, getSourceReachability, readSourceStatusHistory, readSourceStatusSnapshot, summarizeSourceStatus, summarizeSourceStatusHistory } from '../src/lib/sourceStatus.ts'

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
  assert.equal(readSourceStatusSnapshot({
    ...validSnapshot,
    okCount: 1,
    attentionCount: 1,
    blockingCount: 0,
    results: [
      { ...validSnapshot.results[0], statusCode: 404, status: 'unreachable' as const },
      { ...validSnapshot.results[1], statusCode: 404, status: 'unreachable' as const },
    ],
  }), null)
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
  assert.equal(getSourceReachability(snapshot, 'https://example.com/blocked'), 'needs_review')
  assert.equal(getSourceReachability(snapshot, 'https://example.com/missing'), 'unavailable')
})

test('reads and bounds source-status history newest first', () => {
  const older = { ...validSnapshot, checkedAt: '2026-11-18T02:30:00.000Z' }
  const newest = { ...validSnapshot, checkedAt: '2026-11-20T02:30:00.000Z' }
  const history = readSourceStatusHistory({ snapshots: [older, newest, older] })

  assert.deepEqual(history.map((snapshot) => snapshot.checkedAt), [newest.checkedAt, older.checkedAt])
  assert.deepEqual(appendSourceStatusHistory(history, { ...newest, okCount: 2, attentionCount: 0 }, 2).map((snapshot) => snapshot.checkedAt), [newest.checkedAt, older.checkedAt])
  assert.equal(readSourceStatusHistory({ snapshots: [{ ...validSnapshot, okCount: 9 }] }).length, 0)
  assert.equal(readSourceStatusHistory(null).length, 0)
  const longHistory = Array.from({ length: 13 }, (_, index) => ({ ...validSnapshot, checkedAt: `2026-11-${String(20 - index).padStart(2, '0')}T02:30:00.000Z` }))
  assert.equal(readSourceStatusHistory({ snapshots: longHistory }).length, 12)
})

test('summarizes history depth and latest check independently from source evidence', () => {
  const older = { ...validSnapshot, checkedAt: '2026-11-18T02:30:00.000Z' }
  assert.deepEqual(summarizeSourceStatusHistory([older, validSnapshot]), {
    depth: 2,
    latestCheckedAt: validSnapshot.checkedAt,
  })
  assert.deepEqual(summarizeSourceStatusHistory([]), { depth: 0, latestCheckedAt: null })
})
