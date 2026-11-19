import {
  BookOpen,
  CalendarDays,
  Globe2,
  LayoutDashboard,
  ListTree,
  Scale,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Language } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'
import { type ViewKey, VIEW_META } from '../lib/appState.ts'

interface SidebarProps {
  view: ViewKey
  onViewChange: (view: ViewKey) => void
  language: Language
  onLanguageChange: (language: Language) => void
  mobileNavOpen: boolean
}

const NAV_ITEMS: Array<{ view: ViewKey; icon: LucideIcon }> = [
  { view: 'overview', icon: LayoutDashboard },
  { view: 'cases', icon: ListTree },
  { view: 'timeline', icon: CalendarDays },
  { view: 'sources', icon: BookOpen },
]

export function Sidebar({ view, onViewChange, language, onLanguageChange, mobileNavOpen }: SidebarProps) {
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 720px)')
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches)
    updateViewport()
    mediaQuery.addEventListener('change', updateViewport)
    return () => mediaQuery.removeEventListener('change', updateViewport)
  }, [])

  const isHidden = isMobileViewport && !mobileNavOpen

  return (
    <aside className="sidebar" aria-hidden={isHidden}>
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true"><Scale size={23} strokeWidth={1.9} /></div>
        <div className="brand-title">ePrivacy<br />Enforcement<br />Tracker</div>
        <div className="brand-rule" />
        <div className="brand-subtitle">{copy(language, 'portal')}</div>
      </div>

      <nav className="sidebar-nav" aria-label={copy(language, 'portal')}>
        {NAV_ITEMS.map(({ view: itemView, icon: Icon }) => (
          <button
            className={`sidebar-link ${view === itemView ? 'is-active' : ''}`}
            key={itemView}
            type="button"
            onClick={() => onViewChange(itemView)}
            aria-current={view === itemView ? 'page' : undefined}
            tabIndex={isHidden ? -1 : undefined}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{VIEW_META[itemView].label[language]}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-language-label"><Globe2 size={14} /> {copy(language, 'language')}</div>
        <div className="language-switch" role="group" aria-label={copy(language, 'language')}>
          <button className={language === 'zh' ? 'is-active' : ''} type="button" onClick={() => onLanguageChange('zh')} tabIndex={isHidden ? -1 : undefined}>中文</button>
          <button className={language === 'en' ? 'is-active' : ''} type="button" onClick={() => onLanguageChange('en')} tabIndex={isHidden ? -1 : undefined}>EN</button>
        </div>
      </div>
    </aside>
  )
}
