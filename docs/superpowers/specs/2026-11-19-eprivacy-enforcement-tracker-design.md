# ePrivacy Enforcement Tracker Design

## Intent

Build an independent, source-first enforcement tracker for ePrivacy-related actions. The tracker must cover more than cookies: it must be ready for App SDK access to device information, terminal identifiers, and electronic marketing. It can borrow the data-first shape of the neighbouring DSA and DMA trackers, but it must make the actual legal basis a primary field so that a data protection authority action is not automatically counted as GDPR.

The first usable dataset will contain official CNIL records for Google (€325m) and SHEIN (€150m), with the source links and the legal basis shown in each record. The product is a research console for legal, policy, and compliance users who need to compare cases, inspect evidence, and export a filtered register.

## Goals

- Make “actual legal basis” visible in the overview, table, detail drawer, exports, and aggregate metrics.
- Track four explicit enforcement topics: Cookies & consent, App SDK, Device identifiers, and E-marketing.
- Seed two official CNIL enforcement records: Google (€325m) and SHEIN (€150m).
- Explain why an action is excluded from GDPR totals, with an official source link close to the explanation.
- Support case search, topic tabs, legal-basis/authority/outcome filters, selected-case evidence, timeline, source registry, and JSON/CSV export.
- Use a bilingual UI with Chinese as the default and English as a switchable view, matching the neighbouring tracker family where useful.
- Keep the UI responsive enough for a small laptop and mobile widths without hiding the legal-basis field.

## Non-goals

- Do not build a backend, authentication layer, scheduled crawler, or CMS in this first pass.
- Do not merge the ePrivacy register into the GDPR tracker or duplicate the GDPR tracker’s records.
- Do not make claims about App SDK or terminal-identifier enforcement without an official case record; those topic views may be empty while the schema is ready for backfill.
- Do not allocate the €325m Google fine between cookies and e-marketing when the official public source only states the two breaches and the combined total.
- Do not present the tracker as legal advice.

## Anti-goals

- A generic dashboard where “CNIL action” is treated as synonymous with “GDPR.”
- A marketing landing page that hides the case register behind decorative cards.
- A chart or metric that aggregates mixed/unknown legal bases as ePrivacy without an explicit inclusion rule.
- A static screenshot with inert controls.

## Constraints

- The current `ePrivacy-enforcement-Tracker` directory is empty; scaffold a self-contained React + Vite application.
- Neighbouring DSA and DMA trackers use React + Vite, local TypeScript data modules, Lucide icons, and computed dashboard metrics. Reuse those conventions conceptually, not by copying their domain-specific fields.
- Initial official source URLs:
  - Google: `https://www.cnil.fr/en/cookies-and-advertisements-inserted-between-emails-google-fined-325-million-euros-cnil`
  - SHEIN: `https://www.cnil.fr/en/cookies-placed-without-consent-shein-fined-150-million-euros-cnil`
  - CNIL aggregate action-plan announcement: `https://www.cnil.fr/en/cookie-regulation-cnil-continuing-action-plan-initiated-2019-and-has-imposed-two-fines-shein-and`
  - Google injunction closure follow-up: `https://www.cnil.fr/en/closure-injunction-google`
- The UI must distinguish French law / ePrivacy rules from GDPR using explicit status text, not only color.
- No generated bitmap asset is required in production. The generated visual concept is a design reference only; all real UI text, tables, controls, and icons remain code-native.

## Approaches considered

### 1. Same visual shell as DSA/DMA

Reuse the neighbouring trackers’ dashboard, case-card, timeline, and charts with ePrivacy-specific fields. This is fastest and familiar, but the legal-basis distinction would compete with the existing card hierarchy.

### 2. Independent research console — chosen

Use a quiet dark navigation rail, a source-first case ledger, a compact legal-basis callout, topic tabs, and a selected-case evidence drawer. Keep the existing trackers’ useful separation between data, derived metrics, timeline, and exports, but make `actualLegalBasis` and `gdprTreatment` first-class fields. This best matches the requirement for an independent tracker and keeps the future App SDK / device-identifier categories visible even when their datasets start empty.

### 3. Evidence timeline first

Make official announcements and enforcement events the primary navigation, with topic and legal-basis filters. This is strong for chronology but weaker for comparing amounts, entities, and legal bases across cases, so it is not the first release shape.

## Accepted design direction

The accepted direction is a serious editorial legal-research console, not a marketing site and not a decorative SaaS dashboard. A visual concept was generated at:

`/Users/xuzhujie/.codex/generated_images/01a1f44f-5925-7543-a4db-bd243e420f10/exec-a368d1d0-a694-4589-87c0-d719bfde6c04.png`

The concept is an English visual reference; the shipped UI will default to Chinese and expose an English toggle. This translation is intentional and is the only visible-copy deviation from the concept.

The product should feel related to the neighbouring DMA and DSA dashboards: keep their clear navigation split between overview, case register, timeline, and sources; keep source freshness and export affordances visible; and use the same familiar “filter → inspect → verify” rhythm. The ePrivacy tracker remains an independent legal domain with its own fields, metrics, and legal-basis rules.

### Layout and interaction

- Left rail: product mark/title, “独立执法登记库”, and four destinations: 总览, 案件登记, 时间线, 来源。
- Top bar: full-width case/authority/entity/legal-basis search and a language switch.
- Opening band: title “ePrivacy｜独立执法 Tracker” and a legal-basis callout: “仅统计实际基于 ePrivacy 规则的执法；GDPR 另行统计，不并入本总额。”
- Topic tabs: 全部案件, Cookie 与同意, App SDK, 设备信息与终端标识符, 电子营销. Each tab shows its computed case count.
- Filter row: authority, country, actual legal basis, outcome, clear filters, and export current view.
- Main ledger: open table with columns 案件 ID, 监管机构, 主体, 执法主题, 实际法律依据, 结果/状态, 罚款, 最后核验. Do not turn this into a card grid.
- Selected row opens a right evidence drawer. The drawer shows the case title, official source, legal basis, evidence note, latest action, and a highlighted “为什么不计入 GDPR” explanation.
- Below the ledger: a compact recent enforcement timeline and an official source registry.
- Overview view: same data in a summary-first arrangement with totals split into ePrivacy-included, mixed/needs review, and excluded from GDPR. No empty chart filler.
- Timeline view: case events sorted newest first, retaining topic, legal basis, amount, and official link.
- Sources view: source registry with source type, coverage, last checked, and verification status.

### Visual system

- Background: true white (`#ffffff`) for the main surface; no warm cream substitution.
- Navigation rail: deep navy (`#0e1b31`).
- Ink: dark slate/navy (`#14213a`); muted text `#66738b`; borders `#d7e0ec`.
- Legal-basis accent: warm amber (`#e9a526`) used for vertical rules and callout emphasis.
- Verified-source accent: muted teal (`#139b7b`) used for status marks and source verification.
- Selection/action blue: `#1f55c7` with a restrained pale-blue row highlight.
- Radii: 10px for panels and controls; 6px for compact tags; subtle drawer shadow only.
- Typography: system humanist sans for content and controls; compact monospace for case IDs and dates. Explicit sizes for buttons, tabs, filters, and table cells.
- Icons: small Lucide-style outline icons with consistent stroke weight; use icons only for navigation, filtering, source verification, export, and disclosure.
- Motion: short, reduced-motion-aware transitions for row selection, drawer open/close, and filter changes.

## Data model

Create `src/data/cases.ts` with explicit types:

```ts
type EnforcementTopic = 'cookies' | 'app_sdk' | 'device_identifiers' | 'e_marketing'
type CaseOutcome = 'fine' | 'injunction' | 'closed' | 'proceeding'
type GdprTreatment = 'excluded' | 'mixed_needs_review' | 'unknown'

interface LegalBasis {
  id: string
  label: { zh: string; en: string }
  family: 'eprivacy' | 'gdpr' | 'other'
  jurisdiction: { zh: string; en: string }
  sourceUrl: string
}

interface EnforcementCase {
  id: string
  title: { zh: string; en: string }
  authority: { zh: string; en: string }
  country: { zh: string; en: string }
  entity: { zh: string; en: string }
  topics: EnforcementTopic[]
  legalBases: LegalBasis[]
  outcome: CaseOutcome
  status: { zh: string; en: string }
  fineEur: number | null
  fineScopeNote: { zh: string; en: string }
  decisionDate: string
  latestDate: string
  summary: { zh: string; en: string }
  evidenceNote: { zh: string; en: string }
  gdprTreatment: GdprTreatment
  gdprExclusionReason?: { zh: string; en: string }
  sources: Array<{ label: { zh: string; en: string }; url: string; sourceType: 'authority' | 'decision' | 'follow_up'; lastCheckedAt: string }>
  events: Array<{ date: string; label: { zh: string; en: string }; description: { zh: string; en: string } }>
  lastVerifiedAt: string
}
```

Initial records:

- `EP-2025-001`: Google, CNIL, topics `cookies` and `e_marketing`, €325,000,000, legal bases Article 82 of the French Data Protection Act and Article L.34-5 of the French Postal and Electronic Communications Code, `gdprTreatment: 'excluded'`. Preserve the official combined amount; do not invent a split between the two breaches. Include the 2025 decision and the 2026 injunction-closure follow-up as events.
- `EP-2025-002`: INFINITE STYLES SERVICES CO. LIMITED / SHEIN, CNIL, topic `cookies`, €150,000,000, legal basis Article 82 of the French Data Protection Act, `gdprTreatment: 'excluded'`.

The dashboard total is computed only from records with `gdprTreatment === 'excluded'` and at least one `legalBases.family === 'eprivacy'`; mixed or unknown records are visible but not included in the ePrivacy total. This rule must be covered by tests.

Overview buckets are mutually exclusive:

- `ePrivacy counted`: `gdprTreatment === 'excluded'`, at least one ePrivacy legal basis, and a fine amount when present. Show case count and included fine total.
- `Review queue`: `gdprTreatment === 'mixed_needs_review'` or `unknown`. Show case count; do not include its fine amount in any total until the legal basis or allocation is verified.
- “GDPR excluded” is not a third financial bucket. It is an explicit explanatory status on `ePrivacy counted` records and in the evidence drawer.

Google keeps `outcome: 'fine'` because the primary enforcement action is the 1 September 2025 fine. Its 23 September 2026 injunction closure is represented as the latest event and a status string such as “已罚款 · 后续禁令已关闭”, not as a second primary outcome.

Date policy: `decisionDate` is the official legal decision date; `latestDate` is the newest enforcement event date; publication dates are kept only in source metadata if needed. `lastVerifiedAt` and each source’s `lastCheckedAt` are manual verification dates, stored as ISO dates.

The source registry is deduplicated by canonical URL, with one row per unique official URL. Its coverage and source type are explicit metadata; the aggregate CNIL announcement and Google follow-up are standalone sources and may link to multiple cases. Verification status is `verified` for the seeded official pages reviewed during data entry.

Export policy: JSON preserves stable IDs/enums, bilingual labels, legal-basis objects, events, source metadata, GDPR treatment, exclusion reason, and the active filter state. CSV is a flat case-level export with stable enums/IDs plus both language labels; repeated legal bases, topics, events, and source URLs use pipe-separated values. The export is never dependent on the selected UI language.

For `mixed_needs_review` and `unknown` records, `gdprExclusionReason` is optional. The drawer instead shows “暂不计入 ePrivacy 总额” / “Not included in the ePrivacy total yet” and explains that the legal basis or fine allocation needs verification.

## Component architecture

- `src/App.tsx`: app shell, local UI state, view routing, language persistence, and composition only.
- `src/data/cases.ts`: types, legal-basis registry, and seeded records.
- `src/lib/i18n.ts`: bilingual copy lookup and date/fine formatting helpers.
- `src/data/dashboardMetrics.ts`: pure derived metrics, topic counts, legal-basis counts, totals, timeline flattening, and attention items.
- `src/components/Sidebar.tsx`: navigation rail and language switch.
- `src/components/TopBar.tsx`: search and export controls.
- `src/components/LegalBasisCallout.tsx`: ePrivacy scope statement.
- `src/components/TopicTabs.tsx`: four topic filters plus all-cases state.
- `src/components/CaseLedger.tsx`: filters, table, selection, sorting, empty state.
- `src/components/EvidenceDrawer.tsx`: selected case evidence and GDPR exclusion explanation.
- `src/components/Timeline.tsx`: case-event timeline.
- `src/components/SourceRegistry.tsx`: official source table.
- `src/components/Overview.tsx`: computed totals and concise overview rows.
- `src/App.css` / `src/index.css`: tokens, layout, responsive breakpoints, and component variants.
- `tests/dashboard_metrics.test.ts`: pure metric and classification tests.

## Core interaction contract

- The initial view is 案件登记 with the Google row selected and evidence drawer open on desktop; mobile collapses the drawer below the selected row.
- Search matches title, authority, entity, legal-basis labels, topic labels, and case ID.
- Topic tabs and dropdown filters update the ledger, selected case, timeline, source registry, and summary counts together.
- Clearing filters restores all records and preserves the language setting.
- Sorting is available on last verified date, fine, authority, and legal basis.
- Export produces JSON and CSV for the current filtered records and includes the legal basis, GDPR treatment, exclusion reason, and source URLs.
- Clicking any official source opens it in a new tab with `rel="noreferrer"`.
- All controls are keyboard reachable with visible focus styles.

## Acceptance criteria

- The first viewport visibly communicates that this is independent ePrivacy enforcement and that GDPR is excluded from the total.
- Google €325m and SHEIN €150m appear as official seeded records with correct source links and non-GDPR legal bases.
- Google appears under both Cookie 与同意 and 电子营销; SHEIN appears under Cookie 与同意; App SDK and 设备信息与终端标识符 are present as empty-but-ready categories.
- The detail drawer explains the legal basis and why the case is not counted as GDPR.
- Filter, search, selection, timeline, source registry, language toggle, and export controls work with local state.
- Unit tests prove total calculation, topic counts, exclusion behavior, and Google’s combined fine is not split.
- Desktop and mobile layouts have no horizontal overflow and retain legal-basis visibility.
- The final implementation is checked in Browser/IAB, with screenshots inspected against the generated concept and a written fidelity ledger.

## Builder decisions left open

- Exact copy translations beyond the locked scope statement may be settled by the implementer while preserving the meaning.
- Empty-state wording and compact chart/metric presentation may be chosen to avoid filler when a topic has no seeded cases.
- The implementer may choose native HTML controls or lightweight reusable controls; no additional component library is required.
