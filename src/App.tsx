import { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cases, DATA_AS_OF, legalBases, type EnforcementSurface, type EnforcementTopic } from './data/cases.ts'
import { flattenTimeline, getDashboardMetrics, getSourceRegistry } from './data/dashboardMetrics.ts'
import { Sidebar } from './components/Sidebar.tsx'
import { TopBar } from './components/TopBar.tsx'
import { LegalBasisCallout } from './components/LegalBasisCallout.tsx'
import { TopicTabs } from './components/TopicTabs.tsx'
import { Overview } from './components/Overview.tsx'
import { CaseLedger } from './components/CaseLedger.tsx'
import { EvidenceDrawer } from './components/EvidenceDrawer.tsx'
import { Timeline } from './components/Timeline.tsx'
import { SourceRegistry } from './components/SourceRegistry.tsx'
import { DEFAULT_FILTERS, getStoredLanguage, type ViewKey } from './lib/appState.ts'
import { copy } from './lib/copy.ts'
import { exportCaseCsv, exportCaseJson } from './lib/export.ts'
import { filterCases, type CaseFilters, type SortDirection, type SortKey } from './lib/filterCases.ts'
import { buildActiveFilterSummary, hasActiveFilters } from './lib/filterSummary.ts'
import { buildLocalizedFilterOptions } from './lib/filterOptions.ts'
import type { Language } from './lib/i18n.ts'
import { EMPTY_SOURCE_STATUS, SOURCE_STATUS_FILENAME } from './data/sourceStatus.ts'
import { readSourceStatusSnapshot, summarizeSourceStatus, type SourceStatusSnapshot } from './lib/sourceStatus.ts'
import { ActiveFilterSummary } from './components/ActiveFilterSummary.tsx'
import { isSearchShortcut } from './lib/keyboard.ts'

export const APP_TITLE = 'ePrivacy｜独立执法 Tracker'

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function App() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage())
  const [view, setView] = useState<ViewKey>('cases')
  const [filters, setFilters] = useState<CaseFilters>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(cases[0]?.id ?? null)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('lastVerified')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sourceStatusSnapshot, setSourceStatusSnapshot] = useState<SourceStatusSnapshot | null>(EMPTY_SOURCE_STATUS)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const selectedTriggerRef = useRef<HTMLElement | null>(null)
  const filteredCases = useMemo(() => filterCases(cases, filters, language), [filters, language])
  const metrics = useMemo(() => getDashboardMetrics(filteredCases), [filteredCases])
  const timeline = useMemo(() => flattenTimeline(filteredCases), [filteredCases])
  const sourceRegistry = useMemo(() => getSourceRegistry(filteredCases), [filteredCases])
  const availableYears = useMemo(() => [...new Set(cases.map((item) => item.decisionDate.slice(0, 4)))].sort((left, right) => right.localeCompare(left)), [])
  const availableSurfaces = useMemo(() => [...new Set(cases.map((item) => item.surface))] as EnforcementSurface[], [])
  const authorityOptions = useMemo(() => buildLocalizedFilterOptions(cases, 'authority'), [])
  const countryOptions = useMemo(() => buildLocalizedFilterOptions(cases, 'country'), [])
  const filterSummaryOptions = useMemo(() => ({ authorities: authorityOptions, countries: countryOptions, years: availableYears, surfaces: availableSurfaces, legalBases }), [authorityOptions, countryOptions, availableYears, availableSurfaces])
  const activeFilterLabels = useMemo(() => buildActiveFilterSummary(filters, language, filterSummaryOptions), [filters, language, filterSummaryOptions])
  const sourceStatus = useMemo(() => summarizeSourceStatus(sourceStatusSnapshot), [sourceStatusSnapshot])
  const selectedCase = filteredCases.find((item) => item.id === selectedId) ?? null
  const currentCopy = (key: Parameters<typeof copy>[1]) => copy(language, key)

  useEffect(() => {
    window.localStorage.setItem('eprivacy-tracker-language', language)
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language])

  useEffect(() => {
    let active = true
    fetch(`${import.meta.env.BASE_URL}${SOURCE_STATUS_FILENAME}`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload: unknown) => {
        if (active) setSourceStatusSnapshot(readSourceStatusSnapshot(payload))
      })
      .catch(() => {
        if (active) setSourceStatusSnapshot(null)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!isSearchShortcut(event)) return
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.isContentEditable)) return
      event.preventDefault()
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (filteredCases.length === 0) {
      setSelectedId(null)
      setDrawerOpen(false)
      return
    }
    if (!selectedId || !filteredCases.some((item) => item.id === selectedId)) {
      setSelectedId(filteredCases[0].id)
      setDrawerOpen(true)
    }
  }, [filteredCases, selectedId])

  function updateTopic(topic: EnforcementTopic | 'all') {
    setFilters((current) => ({ ...current, topic }))
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  function handleSelect(id: string, trigger: HTMLElement) {
    setSelectedId(id)
    selectedTriggerRef.current = trigger
    setDrawerOpen(true)
  }

  function handleCloseDrawer() {
    setDrawerOpen(false)
    window.requestAnimationFrame(() => selectedTriggerRef.current?.focus())
  }

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => current === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(nextKey)
      setSortDirection(nextKey === 'fine' ? 'desc' : 'asc')
    }
  }

  function handleExportJson() {
    triggerDownload('eprivacy-enforcement-export.json', exportCaseJson(filteredCases, filters), 'application/json')
  }

  function handleExportCsv() {
    triggerDownload('eprivacy-enforcement-export.csv', exportCaseCsv(filteredCases, language), 'text/csv;charset=utf-8')
  }

  function handleViewChange(nextView: ViewKey) {
    setView(nextView)
    setMobileNavOpen(false)
  }

  return (
    <div className="app-shell">
      <button className={`mobile-nav-scrim ${mobileNavOpen ? 'is-visible' : ''}`} type="button" onClick={() => setMobileNavOpen(false)} aria-label={currentCopy('close')} aria-hidden={!mobileNavOpen} tabIndex={mobileNavOpen ? 0 : -1} />
      <div id="mobile-nav" className={`sidebar-wrap ${mobileNavOpen ? 'is-open' : ''}`}>
        <Sidebar view={view} onViewChange={handleViewChange} language={language} onLanguageChange={setLanguage} mobileNavOpen={mobileNavOpen} />
        <button className="mobile-nav-close" type="button" onClick={() => setMobileNavOpen(false)} aria-label={currentCopy('close')} aria-hidden={!mobileNavOpen} tabIndex={mobileNavOpen ? 0 : -1}><X size={18} /></button>
      </div>
      <div className="main-shell">
        <TopBar searchInputRef={searchInputRef} query={filters.query} onQueryChange={(query) => setFilters((current) => ({ ...current, query }))} onExportJson={handleExportJson} onExportCsv={handleExportCsv} language={language} />
        <button className="mobile-nav-trigger" type="button" onClick={() => setMobileNavOpen(true)} aria-label={currentCopy('portal')} aria-expanded={mobileNavOpen} aria-controls="mobile-nav"><Menu size={20} /></button>
        <main className="main-content">
          <section className="page-heading">
            <div>
              <div className="page-eyebrow">{currentCopy('portal')} · {DATA_AS_OF}</div>
              <h1>{currentCopy('title')}</h1>
              <p>{currentCopy(view === 'overview' ? 'overviewSub' : view === 'cases' ? 'registerSub' : view === 'timeline' ? 'timelineSub' : 'sourcesSub')}</p>
              <ActiveFilterSummary labels={activeFilterLabels} language={language} onClear={clearFilters} />
            </div>
            <LegalBasisCallout language={language} />
          </section>

          {view === 'overview' && <Overview metrics={metrics} language={language} onViewChange={handleViewChange} sourceStatus={sourceStatus} hasActiveFilters={hasActiveFilters(filters)} />}

          {view === 'cases' && (
            <section className="register-view">
              <TopicTabs topic={filters.topic} counts={metrics.allTopicCounts} allCount={metrics.totalCaseCount} onTopicChange={updateTopic} language={language} />
              <div className="ledger-layout">
                <CaseLedger
                  items={filteredCases}
                  selectedId={selectedId}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  filters={filters}
                  authorities={authorityOptions}
                  countries={countryOptions}
                  years={availableYears}
                  surfaces={availableSurfaces}
                  legalBases={legalBases}
                  onSelect={handleSelect}
                  onSort={handleSort}
                  onFiltersChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
                  onClearFilters={clearFilters}
                  language={language}
                />
                <EvidenceDrawer caseItem={drawerOpen ? selectedCase : null} language={language} onClose={handleCloseDrawer} />
              </div>
              <div className="register-secondary-grid">
                <Timeline events={timeline} language={language} compact onOpenAll={() => handleViewChange('timeline')} />
                <SourceRegistry entries={sourceRegistry} language={language} compact onOpenAll={() => handleViewChange('sources')} />
              </div>
            </section>
          )}

          {view === 'timeline' && <Timeline events={timeline} language={language} />}

          {view === 'sources' && <SourceRegistry entries={sourceRegistry} language={language} />}
        </main>
        <footer className="app-footer">{currentCopy('notLegalAdvice')}</footer>
      </div>
    </div>
  )
}

export default App
