import { Scale } from 'lucide-react'
import type { Language } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'

export function LegalBasisCallout({ language }: { language: Language }) {
  return (
    <aside className="legal-callout">
      <Scale size={30} strokeWidth={1.7} aria-hidden="true" />
      <div>
        <strong>{copy(language, 'legalBasisTitle')}</strong>
        <p>{copy(language, 'legalBasisBody')}</p>
        <b>{copy(language, 'legalBasisEmphasis')}</b>
      </div>
    </aside>
  )
}
