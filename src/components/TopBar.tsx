import { Download, Search } from 'lucide-react'
import type { Language } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'

interface TopBarProps {
  query: string
  onQueryChange: (value: string) => void
  onExportJson: () => void
  onExportCsv: () => void
  language: Language
}

export function TopBar({ query, onQueryChange, onExportJson, onExportCsv, language }: TopBarProps) {
  return (
    <header className="top-bar">
      <label className="search-field">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">{copy(language, 'search')}</span>
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={copy(language, 'searchPlaceholder')} />
        <kbd>⌘ K</kbd>
      </label>
      <div className="export-actions">
        <span className="export-label">{copy(language, 'export')}</span>
        <button type="button" className="toolbar-button" onClick={onExportJson} title={copy(language, 'exportJson')}>
          <Download size={15} /> JSON
        </button>
        <button type="button" className="toolbar-button toolbar-button-subtle" onClick={onExportCsv} title={copy(language, 'exportCsv')}>
          CSV
        </button>
      </div>
    </header>
  )
}
