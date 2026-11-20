import { RotateCcw } from 'lucide-react'
import type { Language } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'

interface ActiveFilterSummaryProps {
  labels: string[]
  language: Language
  onClear: () => void
}

export function ActiveFilterSummary({ labels, language, onClear }: ActiveFilterSummaryProps) {
  if (labels.length === 0) return null

  return (
    <div className="active-filter-summary" role="status" aria-live="polite">
      <div className="active-filter-summary-copy">
        <strong>{copy(language, 'activeFilters')}</strong>
        <span>{labels.join(language === 'zh' ? ' · ' : ' · ')}</span>
      </div>
      <button type="button" className="clear-filters active-filter-clear" onClick={onClear}>
        <RotateCcw size={13} /> {copy(language, 'clearFilters')}
      </button>
    </div>
  )
}
