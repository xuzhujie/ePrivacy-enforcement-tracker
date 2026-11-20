import type { SourceCheckResult, SourceCheckStatus } from './sourceMonitoring.ts'

export interface SourceStatusSnapshot {
  checkedAt: string
  totalCount: number
  okCount: number
  attentionCount: number
  blockingCount: number
  results: SourceCheckResult[]
}

export interface SourceStatusHistory {
  snapshots: SourceStatusSnapshot[]
}

export interface SourceStatusSummary {
  label: 'ok' | 'attention' | 'unavailable'
  totalCount: number
  okCount: number
  attentionCount: number
  blockingCount: number
  checkedAt: string | null
}

export interface SourceStatusHistorySummary {
  depth: number
  latestCheckedAt: string | null
}

export const SOURCE_STATUS_HISTORY_LIMIT = 12

const STATUSES: SourceCheckStatus[] = ['ok', 'needs_review', 'unreachable']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isValidResult(value: unknown): value is SourceCheckResult {
  if (!isRecord(value)) return false
  const statusCode = value.statusCode
  return typeof value.url === 'string'
    && value.url.length > 0
    && (statusCode === null || typeof statusCode === 'number')
    && typeof value.status === 'string'
    && STATUSES.includes(value.status as SourceCheckStatus)
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

export function readSourceStatusSnapshot(value: unknown): SourceStatusSnapshot | null {
  if (!isRecord(value) || typeof value.checkedAt !== 'string' || Number.isNaN(Date.parse(value.checkedAt))) return null
  if (!isNonNegativeInteger(value.totalCount) || !isNonNegativeInteger(value.okCount) || !isNonNegativeInteger(value.attentionCount) || !isNonNegativeInteger(value.blockingCount)) return null
  if (!Array.isArray(value.results) || !value.results.every(isValidResult)) return null
  if (value.totalCount !== value.results.length || value.okCount + value.attentionCount !== value.totalCount) return null
  if (value.blockingCount > value.attentionCount) return null
  const okCount = value.results.filter((result) => result.status === 'ok').length
  const attentionCount = value.results.filter((result) => result.status !== 'ok').length
  const blockingCount = value.results.filter((result) => result.status === 'unreachable').length
  if (value.okCount !== okCount || value.attentionCount !== attentionCount || value.blockingCount !== blockingCount) return null

  return {
    checkedAt: value.checkedAt,
    totalCount: value.totalCount,
    okCount: value.okCount,
    attentionCount: value.attentionCount,
    blockingCount: value.blockingCount,
    results: value.results,
  }
}

export function readSourceStatusHistory(value: unknown): SourceStatusSnapshot[] {
  if (!isRecord(value) || !Array.isArray(value.snapshots)) return []

  const unique = new Map<string, SourceStatusSnapshot>()
  for (const valueSnapshot of value.snapshots) {
    const snapshot = readSourceStatusSnapshot(valueSnapshot)
    if (snapshot) unique.set(snapshot.checkedAt, snapshot)
  }

  return [...unique.values()]
    .sort((left, right) => right.checkedAt.localeCompare(left.checkedAt))
    .slice(0, SOURCE_STATUS_HISTORY_LIMIT)
}

export function appendSourceStatusHistory(history: SourceStatusSnapshot[], snapshot: SourceStatusSnapshot, limit = SOURCE_STATUS_HISTORY_LIMIT): SourceStatusSnapshot[] {
  const next = new Map<string, SourceStatusSnapshot>([[snapshot.checkedAt, snapshot]])
  for (const existing of history) {
    if (!next.has(existing.checkedAt)) next.set(existing.checkedAt, existing)
  }

  return [...next.values()]
    .sort((left, right) => right.checkedAt.localeCompare(left.checkedAt))
    .slice(0, Math.max(1, Math.floor(limit)))
}

export function summarizeSourceStatus(snapshot: SourceStatusSnapshot | null): SourceStatusSummary {
  if (!snapshot) {
    return {
      label: 'unavailable',
      totalCount: 0,
      okCount: 0,
      attentionCount: 0,
      blockingCount: 0,
      checkedAt: null,
    }
  }

  return {
    label: snapshot.attentionCount === 0 ? 'ok' : 'attention',
    totalCount: snapshot.totalCount,
    okCount: snapshot.okCount,
    attentionCount: snapshot.attentionCount,
    blockingCount: snapshot.blockingCount,
    checkedAt: snapshot.checkedAt,
  }
}

export function getSourceReachability(snapshot: SourceStatusSnapshot | null, url: string): SourceCheckStatus | 'unavailable' {
  return snapshot?.results.find((result) => result.url === url)?.status ?? 'unavailable'
}

export function summarizeSourceStatusHistory(history: SourceStatusSnapshot[]): SourceStatusHistorySummary {
  const latestCheckedAt = history.reduce<string | null>((latest, snapshot) => {
    if (!latest || snapshot.checkedAt > latest) return snapshot.checkedAt
    return latest
  }, null)

  return {
    depth: history.length,
    latestCheckedAt,
  }
}
