import { ArrowRight, CheckCircle2, CircleAlert, Database, ShieldCheck } from 'lucide-react'
import { DATA_AS_OF, EVIDENCE_STATUS_META, TOPIC_META, type EnforcementTopic } from '../data/cases.ts'
import type { DashboardMetrics } from '../data/dashboardMetrics.ts'
import type { Language } from '../lib/i18n.ts'
import { formatDate, formatFine } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'
import type { ViewKey } from '../lib/appState.ts'

interface OverviewProps {
  metrics: DashboardMetrics
  language: Language
  onViewChange: (view: ViewKey) => void
}

const TOPICS: EnforcementTopic[] = ['cookies', 'app_sdk', 'device_identifiers', 'e_marketing']

export function Overview({ metrics, language, onViewChange }: OverviewProps) {
  return (
    <section className="overview-view">
      <div className="metrics-grid">
        <article className="metric-card metric-card-primary">
          <div className="metric-card-head"><span>{copy(language, 'eprivacyFineTotal')}</span><ShieldCheck size={17} /></div>
          <strong>{formatFine(metrics.eprivacyFineTotal, language)}</strong>
          <small>{copy(language, 'legalBasisEmphasis')}</small>
        </article>
        <article className="metric-card">
          <div className="metric-card-head"><span>{copy(language, 'enforcementCases')}</span><Database size={17} /></div>
          <strong>{metrics.eprivacyCaseCount}</strong>
          <small>{copy(language, 'casesCount')}</small>
        </article>
        <article className="metric-card">
          <div className="metric-card-head"><span>{copy(language, 'reviewQueue')}</span><CircleAlert size={17} /></div>
          <strong>{metrics.reviewCaseCount}</strong>
          <small>{metrics.reviewCaseCount === 0 ? copy(language, 'noReview') : copy(language, 'attention')}</small>
        </article>
        <article className="metric-card">
          <div className="metric-card-head"><span>{copy(language, 'verifiedThrough')}</span><CheckCircle2 size={17} /></div>
          <strong className="metric-date">{formatDate(DATA_AS_OF, language)}</strong>
          <small>{copy(language, 'sourceFirstSub')}</small>
        </article>
      </div>

      <div className="overview-columns">
        <section className="overview-panel">
          <div className="panel-heading">
            <div><h2>{copy(language, 'topicCoverage')}</h2><p>{copy(language, 'overviewSub')}</p></div>
            <button className="text-link" type="button" onClick={() => onViewChange('cases')}>{copy(language, 'cases')} <ArrowRight size={15} /></button>
          </div>
          <div className="topic-coverage-list">
            {TOPICS.map((topic) => (
              <div className="coverage-row" key={topic}>
                <div className="coverage-label"><span className={`topic-dot topic-dot-${topic}`} />{TOPIC_META[topic].label[language]}</div>
                <div className="coverage-track"><span style={{ width: `${metrics.eprivacyCaseCount ? Math.max(5, (metrics.topicCounts[topic] / metrics.eprivacyCaseCount) * 100) : 0}%` }} /></div>
                <strong>{metrics.topicCounts[topic]}</strong>
                {metrics.topicCounts[topic] === 0 && <small>{copy(language, 'readyForBackfill')}</small>}
              </div>
            ))}
          </div>
        </section>

        <section className="overview-panel overview-panel-dark">
          <div className="panel-heading">
            <div><h2>{copy(language, 'sourceFirst')}</h2><p>{copy(language, 'sourceFirstSub')}</p></div>
            <CheckCircle2 size={18} />
          </div>
          <div className="source-first-stat"><strong>{metrics.timeline.length}</strong><span>{copy(language, 'eventsCount')}</span></div>
          <div className="source-first-stat"><strong>{metrics.eprivacyCaseCount}</strong><span>{copy(language, 'casesCount')}</span></div>
          <div className="source-first-stat"><strong>{metrics.sourceCount}</strong><span>{copy(language, 'sourcesCount')}</span></div>
          <button type="button" className="dark-panel-link" onClick={() => onViewChange('sources')}>{copy(language, 'sources')} <ArrowRight size={15} /></button>
        </section>
      </div>

      <div className="overview-bottom-grid">
        <section className="overview-panel overview-panel-attention">
          <div className="panel-heading">
            <div><h2>{copy(language, 'reviewQueue')}</h2><p>{copy(language, 'attentionSub')}</p></div>
            <CircleAlert size={18} />
          </div>
          <div className="attention-summary">
            <strong>{metrics.reviewCaseCount}</strong>
            <span>{metrics.reviewCaseCount === 0 ? copy(language, 'noReview') : copy(language, 'attention')}</span>
          </div>
          <div className="evidence-status-grid" aria-label={copy(language, 'dataQuality')}>
            <div><span className="evidence-badge evidence-badge-verified">{EVIDENCE_STATUS_META.verified[language]}</span><strong>{metrics.evidenceStatusCounts.verified}</strong></div>
            <div><span className="evidence-badge evidence-badge-needs_review">{EVIDENCE_STATUS_META.needs_review[language]}</span><strong>{metrics.evidenceStatusCounts.needs_review}</strong></div>
            <div><span className="evidence-badge evidence-badge-excluded">{EVIDENCE_STATUS_META.excluded[language]}</span><strong>{metrics.evidenceStatusCounts.excluded}</strong></div>
          </div>
          <p className="data-quality-note">{copy(language, 'dataQualityNote')}</p>
        </section>

        <section className="overview-panel overview-panel-freshness">
          <div className="panel-heading">
            <div><h2>{copy(language, 'sourceFreshness')}</h2><p>{copy(language, 'sourceFirstSub')}</p></div>
            <CheckCircle2 size={18} />
          </div>
          <div className="freshness-summary">
            <strong>{formatDate(DATA_AS_OF, language)}</strong>
            <span>{metrics.sourceCount} {copy(language, 'verifiedSources')}</span>
          </div>
        </section>
      </div>
    </section>
  )
}
