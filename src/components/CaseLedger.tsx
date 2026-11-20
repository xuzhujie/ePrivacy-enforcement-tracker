import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, ExternalLink } from 'lucide-react'
import { EVIDENCE_STATUS_META, TOPIC_META, type EnforcementCase, type EnforcementSurface } from '../data/cases.ts'
import type { Language } from '../lib/i18n.ts'
import { formatDate, formatFine } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'
import { sortCases, type CaseFilters, type SortDirection, type SortKey } from '../lib/filterCases.ts'
import { FilterRow } from './FilterRow.tsx'
import type { LegalBasis } from '../data/cases.ts'
import type { LocalizedFilterOption } from '../lib/filterOptions.ts'

interface CaseLedgerProps {
  items: EnforcementCase[]
  selectedId: string | null
  sortKey: SortKey
  sortDirection: SortDirection
  filters: CaseFilters
  authorities: LocalizedFilterOption[]
  countries: LocalizedFilterOption[]
  years: string[]
  surfaces: EnforcementSurface[]
  legalBases: LegalBasis[]
  onSelect: (id: string, trigger: HTMLElement) => void
  onSort: (key: SortKey) => void
  onFiltersChange: (patch: Partial<CaseFilters>) => void
  onClearFilters: () => void
  language: Language
}

function SortButton({ label, sortKey, activeKey, direction, onSort }: { label: string; sortKey: SortKey; activeKey: SortKey; direction: SortDirection; onSort: (key: SortKey) => void }) {
  const active = sortKey === activeKey
  return (
    <button className={`table-sort ${active ? 'is-active' : ''}`} type="button" onClick={() => onSort(sortKey)}>
      <span>{label}</span>{active ? direction === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} /> : <ArrowUpDown size={13} />}
    </button>
  )
}

export function CaseLedger({ items, selectedId, sortKey, sortDirection, filters, authorities, countries, years, surfaces, legalBases, onSelect, onSort, onFiltersChange, onClearFilters, language }: CaseLedgerProps) {
  const sortedItems = sortCases(items, sortKey, sortDirection)

  return (
    <section className="ledger-section">
      <FilterRow filters={filters} authorities={authorities} countries={countries} years={years} surfaces={surfaces} legalBases={legalBases} onChange={onFiltersChange} onClear={onClearFilters} language={language} />
      <div className="ledger-meta"><span>{sortedItems.length} {copy(language, 'casesCount')}</span><span className="ledger-meta-note">{copy(language, 'legalBasisEmphasis')}</span></div>
      {sortedItems.length === 0 ? (
        <div className="empty-state">
          <strong>{copy(language, 'noCases')}</strong>
          <span>{copy(language, 'noCasesHint')}</span>
          <button type="button" className="text-link" onClick={onClearFilters}>{copy(language, 'clearFilters')}</button>
        </div>
      ) : (
        <div className="ledger-table-wrap">
          <table className="ledger-table">
            <caption className="sr-only">{copy(language, 'cases')}</caption>
            <thead>
              <tr>
                <th>{copy(language, 'caseId')}</th>
                <th>{copy(language, 'authority')}</th>
                <th>{copy(language, 'entity')}</th>
                <th>{copy(language, 'topics')}</th>
                <th><SortButton label={copy(language, 'legalBasis')} sortKey="legalBasis" activeKey={sortKey} direction={sortDirection} onSort={onSort} /></th>
                <th>{copy(language, 'status')}</th>
                <th><SortButton label={copy(language, 'fine')} sortKey="fine" activeKey={sortKey} direction={sortDirection} onSort={onSort} /></th>
                <th><SortButton label={copy(language, 'lastVerified')} sortKey="lastVerified" activeKey={sortKey} direction={sortDirection} onSort={onSort} /></th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr
                  className={selectedId === item.id ? 'is-selected' : ''}
                  key={item.id}
                  onClick={(event) => onSelect(item.id, event.currentTarget)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(item.id, event.currentTarget)
                    }
                  }}
                  tabIndex={0}
                  aria-selected={selectedId === item.id}
                  aria-label={`${item.id} ${item.title[language]}`}
                >
                  <td className="case-id-cell" data-label={copy(language, 'caseId')}><ChevronRight size={15} className={selectedId === item.id ? 'chevron-open' : ''} /><code>{item.id}</code></td>
                  <td data-label={copy(language, 'authority')}><strong>{item.authority[language]}</strong><small>{item.country[language]}</small></td>
                  <td className="entity-cell" data-label={copy(language, 'entity')}>{item.entity[language]}</td>
                  <td data-label={copy(language, 'topics')}><div className="topic-tags">{item.topics.map((topic) => <span className={`topic-tag topic-tag-${topic}`} key={topic}>{TOPIC_META[topic].shortLabel[language]}</span>)}</div></td>
                  <td data-label={copy(language, 'legalBasis')}><div className="basis-list">{item.legalBases.map((basis) => <span key={basis.id}>{basis.label[language]}</span>)}</div></td>
                  <td data-label={copy(language, 'status')}><div className="case-status-stack"><span className="status-text">{item.status[language]}</span><span className={`evidence-badge evidence-badge-${item.evidenceStatus}`}>{EVIDENCE_STATUS_META[item.evidenceStatus][language]}</span></div></td>
                  <td className="fine-cell" data-label={copy(language, 'fine')}>{formatFine(item.fineEur, language)}</td>
                  <td className="date-cell" data-label={copy(language, 'lastVerified')}>{formatDate(item.lastVerifiedAt, language)}<ExternalLink size={12} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
