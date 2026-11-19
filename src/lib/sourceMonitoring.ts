import type { EnforcementCase } from '../data/cases.ts'

export type SourceCheckStatus = 'ok' | 'needs_review' | 'unreachable'

export interface SourceCheckResult {
  url: string
  statusCode: number | null
  finalUrl?: string
  error?: string
  status: SourceCheckStatus
}

export interface SourceMonitorReport {
  checkedAt: string
  totalCount: number
  okCount: number
  attentionCount: number
  blockingCount: number
  results: SourceCheckResult[]
}

export function classifySourceStatus(statusCode: number | null): SourceCheckStatus {
  if (statusCode != null && statusCode >= 200 && statusCode < 400) return 'ok'
  if (statusCode != null && statusCode >= 400 && statusCode < 404) return 'needs_review'
  return 'unreachable'
}

export function getSourceUrls(items: EnforcementCase[]): string[] {
  return [...new Set(items.flatMap((item) => item.sources.map((source) => source.url)))].sort()
}

export function buildSourceMonitorReport(results: SourceCheckResult[], checkedAt: string = new Date().toISOString()): SourceMonitorReport {
  return {
    checkedAt,
    totalCount: results.length,
    okCount: results.filter((result) => result.status === 'ok').length,
    attentionCount: results.filter((result) => result.status !== 'ok').length,
    blockingCount: results.filter((result) => result.status === 'unreachable').length,
    results,
  }
}
