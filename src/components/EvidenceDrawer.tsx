import { CheckCircle2, ExternalLink, FileText, X } from 'lucide-react'
import { EVIDENCE_LEVEL_META, EVIDENCE_STATUS_META, SURFACE_META, type EnforcementCase } from '../data/cases.ts'
import type { Language } from '../lib/i18n.ts'
import { formatDate, formatFine } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'

interface EvidenceDrawerProps {
  caseItem: EnforcementCase | null
  language: Language
  onClose: () => void
}

export function EvidenceDrawer({ caseItem, language, onClose }: EvidenceDrawerProps) {
  if (!caseItem) return null
  const latestEvent = caseItem.events[caseItem.events.length - 1]
  const isExcluded = caseItem.gdprTreatment === 'excluded'
  const isEprivacyAllocationIncluded = caseItem.trackerTreatment === 'included' && caseItem.evidenceStatus === 'verified' && caseItem.fineEur != null

  return (
    <aside className="evidence-drawer" aria-label={copy(language, 'evidence')}>
      <div className="drawer-header">
        <div><span className="drawer-kicker">{copy(language, 'selectedCase')}</span><h2>{caseItem.title[language]}</h2></div>
        <button type="button" className="icon-button" onClick={onClose} aria-label={copy(language, 'close')}><X size={18} /></button>
      </div>
      <div className="drawer-case-line"><code>{caseItem.id}</code><span className={`evidence-badge evidence-badge-${caseItem.evidenceStatus}`}>{caseItem.evidenceStatus === 'verified' && <CheckCircle2 size={12} />} {EVIDENCE_STATUS_META[caseItem.evidenceStatus][language]}</span></div>

      <dl className="evidence-facts">
        <div><dt>{copy(language, 'authority')}</dt><dd>{caseItem.authority[language]}</dd></div>
        <div><dt>{copy(language, 'entity')}</dt><dd>{caseItem.entity[language]}</dd></div>
        <div><dt>{copy(language, 'countedFine')}</dt><dd>{formatFine(caseItem.fineEur, language)}</dd></div>
        <div><dt>{copy(language, 'totalDecisionAmount')}</dt><dd>{formatFine(caseItem.totalDecisionAmountEur, language)}</dd></div>
        <div><dt>{copy(language, 'status')}</dt><dd>{caseItem.status[language]}</dd></div>
        <div><dt>{copy(language, 'surface')}</dt><dd>{SURFACE_META[caseItem.surface][language]}</dd></div>
      </dl>

      <section className="drawer-section drawer-evidence-status">
        <h3>{copy(language, 'evidenceStatus')}</h3>
        <div className="drawer-status-line"><span className={`evidence-badge evidence-badge-${caseItem.evidenceStatus}`}>{EVIDENCE_STATUS_META[caseItem.evidenceStatus][language]}</span><span>{EVIDENCE_LEVEL_META[caseItem.evidenceLevel][language]}</span></div>
        {caseItem.decisionReference && <div className="drawer-reference"><span>{copy(language, 'decisionReference')}</span><code>{caseItem.decisionReference}</code></div>}
        {caseItem.reviewReason && <p className="drawer-copy">{caseItem.reviewReason[language]}</p>}
      </section>

      <section className="drawer-section">
        <h3>{copy(language, 'legalBasis')}</h3>
        <div className="drawer-basis-list">{caseItem.legalBases.map((basis) => <div className="drawer-basis" key={basis.id}><span>{basis.label[language]}</span><code>{basis.id}</code></div>)}</div>
        <p className="fine-scope-note">{caseItem.fineScopeNote[language]}</p>
      </section>

      <section className="drawer-section">
        <h3>{copy(language, 'officialSource')}</h3>
        <div className="drawer-source-list">{caseItem.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><FileText size={14} /><span>{source.label[language]}<small>{formatDate(source.lastCheckedAt, language)}</small></span><ExternalLink size={13} /></a>)}</div>
      </section>

      <section className="drawer-section">
        <h3>{copy(language, 'evidence')}</h3>
        <p className="drawer-copy">{caseItem.evidenceNote[language]}</p>
      </section>

      {caseItem.monetaryOutcome && <section className="drawer-section"><h3>{copy(language, 'monetaryOutcome')}</h3><p className="drawer-copy">{caseItem.monetaryOutcome[language]}</p></section>}

      {latestEvent && <section className="drawer-section drawer-latest"><h3>{copy(language, 'latestAction')}</h3><div className="latest-event-date">{formatDate(latestEvent.date, language)}</div><strong>{latestEvent.label[language]}</strong><p className="drawer-copy">{latestEvent.description[language]}</p></section>}

      <section className={`gdpr-exclusion ${isEprivacyAllocationIncluded || isExcluded ? '' : 'is-review'}`}>
        <strong>{isEprivacyAllocationIncluded && !isExcluded ? copy(language, 'whyIncludedEprivacy') : isExcluded ? copy(language, 'whyNotGdpr') : copy(language, 'notInEprivacy')}</strong>
        <p>{caseItem.gdprExclusionReason?.[language] ?? (language === 'zh' ? '法律依据或金额归属仍需人工核验。' : 'The legal basis or fine allocation still needs manual verification.')}</p>
      </section>
    </aside>
  )
}
