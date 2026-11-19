import { ArrowRight, ExternalLink, FileText } from 'lucide-react'
import { EVIDENCE_STATUS_META, TOPIC_META } from '../data/cases.ts'
import type { TimelineEvent } from '../data/dashboardMetrics.ts'
import type { Language } from '../lib/i18n.ts'
import { formatDate, formatFine } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'

interface TimelineProps {
  events: TimelineEvent[]
  language: Language
  compact?: boolean
  onOpenAll?: () => void
}

export function Timeline({ events, language, compact = false, onOpenAll }: TimelineProps) {
  const visibleEvents = compact ? events.slice(0, 3) : events

  return (
    <section className={`tracker-panel timeline-panel ${compact ? 'tracker-panel-compact' : ''}`}>
      <div className="tracker-panel-heading">
        <div>
          <div className="tracker-panel-kicker"><span className="panel-kicker-dot" />{copy(language, 'timeline')}</div>
          <h2>{copy(language, 'recentActions')}</h2>
          <p>{copy(language, 'timelineSub')}</p>
        </div>
        <div className="tracker-panel-count">{events.length} {copy(language, 'eventsCount')}</div>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="inline-empty-state">
          <strong>{copy(language, 'noCases')}</strong>
          <span>{copy(language, 'noCasesHint')}</span>
        </div>
      ) : (
        <ol className="timeline-list">
          {visibleEvents.map((event) => {
            const source = event.source
            return (
              <li className="timeline-item" key={`${event.caseId}-${event.date}-${event.label.en}`}>
                <div className="timeline-rail" aria-hidden="true"><span /></div>
                <article className="timeline-card">
                  <div className="timeline-card-meta">
                    <time dateTime={event.date}>{formatDate(event.date, language)}</time>
                    <code>{event.caseId}</code>
                    {event.fineEur != null && <strong>{formatFine(event.fineEur, language)}</strong>}
                  </div>
                  <div className="timeline-card-heading">
                    <div>
                      <h3>{event.label[language]}</h3>
                      <p>{event.caseTitle[language]} · {event.entity[language]}</p>
                    </div>
                    <span className={`evidence-badge evidence-badge-${event.evidenceStatus}`}>{EVIDENCE_STATUS_META[event.evidenceStatus][language]}</span>
                  </div>
                  <div className="timeline-tag-row">
                    {event.topics.map((topic) => <span className={`topic-tag topic-tag-${topic}`} key={topic}>{TOPIC_META[topic].shortLabel[language]}</span>)}
                  </div>
                  <div className="timeline-basis-row">
                    <span className="timeline-basis-label">{copy(language, 'legalBasis')}</span>
                    <div className="timeline-basis-list">
                      {event.legalBases.map((basis) => <span key={basis.id}>{basis.label[language]}</span>)}
                    </div>
                  </div>
                  <p className="timeline-description">{event.description[language]}</p>
                  {source && (
                    <a className="timeline-source-link" href={source.url} target="_blank" rel="noreferrer">
                      <FileText size={14} />
                      <span>{source.label[language]}</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </article>
              </li>
            )
          })}
        </ol>
      )}

      {compact && events.length > visibleEvents.length && onOpenAll && (
        <button type="button" className="text-link tracker-panel-more" onClick={onOpenAll}>
          {copy(language, 'timeline')} <ArrowRight size={15} />
        </button>
      )}
    </section>
  )
}
