import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSourceMonitorReport, classifySourceStatus } from '../src/lib/sourceMonitoring.ts'

test('classifies source response statuses without treating access blocks as confirmed removal', () => {
  assert.equal(classifySourceStatus(200), 'ok')
  assert.equal(classifySourceStatus(302), 'ok')
  assert.equal(classifySourceStatus(403), 'needs_review')
  assert.equal(classifySourceStatus(404), 'unreachable')
  assert.equal(classifySourceStatus(null), 'unreachable')
})

test('summarizes source-monitor results for scheduled maintenance', () => {
  const report = buildSourceMonitorReport([
    { url: 'https://example.com/ok', statusCode: 200, finalUrl: 'https://example.com/ok', status: 'ok' },
    { url: 'https://example.com/blocked', statusCode: 403, finalUrl: 'https://example.com/blocked', status: 'needs_review' },
    { url: 'https://example.com/missing', statusCode: 404, finalUrl: 'https://example.com/missing', status: 'unreachable' },
  ], '2026-11-20T00:00:00.000Z')

  assert.equal(report.totalCount, 3)
  assert.equal(report.okCount, 1)
  assert.equal(report.attentionCount, 2)
  assert.equal(report.blockingCount, 1)
})
