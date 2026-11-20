import { AlertCircle, ArrowRight, CheckCircle2, CircleHelp, ExternalLink, FileText } from 'lucide-react'
import type { SourceRegistryEntry } from '../data/dashboardMetrics.ts'
import { EVIDENCE_LEVEL_META, type SourceType } from '../data/cases.ts'
import type { Language } from '../lib/i18n.ts'
import { formatDate } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'
import { getSourceReachability, type SourceStatusSnapshot } from '../lib/sourceStatus.ts'

interface SourceRegistryProps {
  entries: SourceRegistryEntry[]
  language: Language
  sourceStatus: SourceStatusSnapshot | null
  compact?: boolean
  onOpenAll?: () => void
}

const SOURCE_TYPE_META: Record<SourceType, { zh: string; en: string; className: string }> = {
  authority: { zh: '机构公告', en: 'Authority notice', className: 'source-type-authority' },
  decision: { zh: '处罚决定', en: 'Decision', className: 'source-type-decision' },
  follow_up: { zh: '后续动作', en: 'Follow-up', className: 'source-type-follow-up' },
}

export function SourceRegistry({ entries, language, sourceStatus, compact = false, onOpenAll }: SourceRegistryProps) {
  const visibleEntries = compact ? entries.slice(0, 3) : entries

  return (
    <section className={`tracker-panel source-panel ${compact ? 'tracker-panel-compact' : ''}`}>
      <div className="tracker-panel-heading">
        <div>
          <div className="tracker-panel-kicker"><span className="panel-kicker-dot panel-kicker-dot-teal" />{copy(language, 'sources')}</div>
          <h2>{copy(language, 'sourceRegistry')}</h2>
          <p>{copy(language, 'sourcesSub')}</p>
        </div>
        <div className="tracker-panel-count">{entries.length} {copy(language, 'sourcesCount')}</div>
      </div>

      {visibleEntries.length === 0 ? (
        <div className="inline-empty-state">
          <strong>{copy(language, 'noCases')}</strong>
          <span>{copy(language, 'noCasesHint')}</span>
        </div>
      ) : (
        <div className="source-registry-list">
          {visibleEntries.map((entry) => (
            <article className="source-registry-row" key={entry.url}>
              <div className="source-registry-icon" aria-hidden="true"><FileText size={16} /></div>
              <div className="source-registry-main">
                <div className="source-registry-title-row">
                  <h3>{entry.label[language]}</h3>
                  <span className={`verified-mark ${entry.verificationStatus === 'needs_review' ? 'is-review' : ''}`}>{entry.verificationStatus === 'verified' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />} {copy(language, entry.verificationStatus === 'verified' ? 'sourceEvidenceVerified' : 'sourceEvidenceReview')}</span>
                  {(() => {
                    const reachability = getSourceReachability(sourceStatus, entry.url)
                    const icon = reachability === 'ok' ? <CheckCircle2 size={12} /> : reachability === 'needs_review' ? <AlertCircle size={12} /> : <CircleHelp size={12} />
                    const label = reachability === 'ok' ? 'sourceReachabilityOk' : reachability === 'needs_review' ? 'sourceReachabilityNeedsReview' : 'sourceReachabilityUnavailable'
                    return <span className={`source-reachability source-reachability-${reachability}`}>{icon} {copy(language, label)}</span>
                  })()}
                </div>
                <div className="source-type-row">
                  {entry.sourceTypes.map((sourceType) => {
                    const meta = SOURCE_TYPE_META[sourceType]
                    return <span className={`source-type ${meta.className}`} key={sourceType}>{meta[language]}</span>
                  })}
                  {entry.evidenceLevels.map((evidenceLevel) => <span className="source-type source-type-evidence" key={evidenceLevel}>{EVIDENCE_LEVEL_META[evidenceLevel][language]}</span>)}
                </div>
                <div className="source-coverage">
                  <span className="source-coverage-label">{copy(language, 'coverage')}</span>
                  <div className="source-case-list">{entry.caseIds.map((caseId) => <code key={caseId}>{caseId}</code>)}</div>
                  <span className="source-entity-list">{entry.entities.map((entity) => entity[language]).join(language === 'zh' ? '、' : ' · ')}</span>
                </div>
              </div>
              <div className="source-registry-meta">
                <span>{copy(language, 'lastChecked')}</span>
                <time dateTime={entry.lastCheckedAt}>{formatDate(entry.lastCheckedAt, language)}</time>
                <a href={entry.url} target="_blank" rel="noreferrer" aria-label={`${copy(language, 'openSource')}: ${entry.label[language]}`}><ExternalLink size={14} /></a>
              </div>
            </article>
          ))}
        </div>
      )}

      {compact && entries.length > visibleEntries.length && onOpenAll && (
        <button type="button" className="text-link tracker-panel-more" onClick={onOpenAll}>
          {copy(language, 'sources')} <ArrowRight size={15} />
        </button>
      )}
    </section>
  )
}
