# ePrivacy Enforcement Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained React + Vite ePrivacy enforcement tracker that feels related to the DMA/DSA dashboards while keeping actual ePrivacy legal bases and GDPR exclusion rules explicit.

**Architecture:** A local TypeScript data registry feeds pure metric/filter/export helpers. React components compose a four-view research console: overview, case register, timeline, and sources. The case register is table-first with a selected-case evidence drawer; all filtering, selection, language, and export behavior stays local and deterministic in the first release.

**Tech Stack:** React 19, TypeScript, Vite, lucide-react, native HTML controls, CSS custom properties, Node test runner via `tsx --test`.

**Spec:** `docs/superpowers/specs/2026-11-19-eprivacy-enforcement-tracker-design.md`

> Historical status: all nine implementation tasks below were completed and superseded by the current data-review and release ledgers. The remaining open work is operational: official-source reachability review and future evidence backfill.

## Global Constraints

- Default UI language is Chinese; English is switchable and persisted in `localStorage` under `eprivacy-tracker-language`.
- The first seeded dataset contains only official CNIL records for Google (€325m) and SHEIN (€150m); no App SDK or device-identifier enforcement claim may be invented.
- `actualLegalBasis` / `legalBases` and `gdprTreatment` are first-class data fields and must be present in the ledger, drawer, metrics, JSON, and CSV.
- The ePrivacy total includes only `gdprTreatment === 'excluded'` records with at least one ePrivacy legal basis; `mixed_needs_review` and `unknown` are visible but not aggregated.
- Google’s €325m remains one combined amount; do not invent a split between Article 82 and Article L.34-5 CPCE.
- The UI uses a true white main surface, deep-navy navigation rail, amber legal-basis accents, teal verified-source accents, and a table-first container model.
- The experience should share the DMA/DSA family rhythm—overview, case register, timeline, sources, freshness/export affordances—without copying DMA/DSA-specific fields.
- All external official links open in a new tab with `rel="noreferrer"`; all controls are keyboard reachable and have visible focus styles.
- There is no backend, auth, crawler, or CMS in this release.

## Review Focus

- Legal-basis classification: a case with a data protection authority must not enter the ePrivacy total unless its stored legal basis explicitly belongs to the ePrivacy family. Test in Task 3.
- Combined Google fine: the €325m amount must remain unsplit even though the case has two topics/legal bases. Test in Task 2 and Task 3.
- Empty topic views: App SDK and device-identifier tabs must render an intentional empty state without fake metrics. Test filter behavior in Task 3 and verify the UI in Task 6.
- Source deduplication: the same official URL referenced by multiple cases must appear once in the source registry while preserving case coverage. Test in Task 3.
- Bilingual export stability: changing the UI language must not change canonical IDs/enums or remove bilingual labels from JSON/CSV. Test in Task 4.

---

### Task 1: Scaffold the React + Vite application and shared tokens

**Files:**
- Create: `package.json`
- Create: `package-lock.json` via npm install
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/App.css`
- Create: `eslint.config.js`

**Interfaces:**
- Produces the `npm run dev`, `npm run build`, `npm run test`, and `npm run lint` commands used by later tasks.
- Produces CSS variables for `--navy`, `--ink`, `--muted`, `--line`, `--surface`, `--blue`, `--amber`, `--teal`, spacing, radii, and drawer shadow.

- [x] **Step 1: Implement the scaffold**

Create a minimal Vite React entry point, install `react`, `react-dom`, `lucide-react`, and the TypeScript/Vite test dependencies, and define the shared CSS tokens and typography reset. Keep `App` as a placeholder composition root until later tasks replace it.

- [x] **Step 2: Verify the scaffold**

Run: `npm run build && npm run lint && npm test`

Expected: all three commands pass.

---

### Task 2: Create the legal-basis registry and official seeded cases

**Files:**
- Create: `src/data/cases.ts`
- Create: `tests/cases.test.ts`

**Interfaces:**
- Produces `type EnforcementTopic`, `type CaseOutcome`, `type GdprTreatment`, `interface LegalBasis`, `interface EnforcementCase`, `legalBases`, `cases`, `TOPIC_META`, and `OUTCOME_META` for later tasks.
- `cases` contains exactly two initial records: `EP-2025-001` Google and `EP-2025-002` SHEIN.

- [x] **Step 1: Write failing data-shape tests**

Add tests asserting:

```ts
assert.equal(cases.length, 2)
assert.equal(google.fineEur, 325_000_000)
assert.deepEqual(google.topics, ['cookies', 'e_marketing'])
assert.equal(google.gdprTreatment, 'excluded')
assert.equal(google.legalBases.length, 2)
assert.equal(shein.fineEur, 150_000_000)
assert.deepEqual(shein.topics, ['cookies'])
assert.equal(shein.legalBases[0].id, 'fr-article-82')
```

Also assert that Google has one combined fine scope note and no per-basis fine allocation.

- [x] **Step 2: Run the focused test to verify it fails**

Run: `npx tsx --test tests/cases.test.ts`

Expected: FAIL because `src/data/cases.ts` and the seeded records do not exist yet.

- [x] **Step 3: Implement `src/data/cases.ts`**

Add the canonical legal-basis registry for Article 82 of the French Data Protection Act and Article L.34-5 of the French Postal and Electronic Communications Code. Add official CNIL source URLs, the 1 September 2025 Google and SHEIN decision events, Google’s 23 September 2026 injunction-closure event, bilingual summaries/evidence notes, `lastCheckedAt` values, and explicit GDPR-exclusion explanations. Preserve the combined Google amount.

- [x] **Step 4: Run the focused test to verify it passes**

Run: `npx tsx --test tests/cases.test.ts`

Expected: PASS with two official records and the exact legal-basis/topic assertions above.

---

### Task 3: Implement pure metrics, filtering, timeline flattening, and source registry

**Files:**
- Create: `src/data/dashboardMetrics.ts`
- Create: `src/lib/filterCases.ts`
- Create: `tests/dashboard_metrics.test.ts`
- Create: `tests/filter_cases.test.ts`

**Interfaces:**
- `getDashboardMetrics(items: EnforcementCase[]): DashboardMetrics`
- `filterCases(items: EnforcementCase[], filters: CaseFilters): EnforcementCase[]`
- `flattenTimeline(items: EnforcementCase[]): TimelineEvent[]`
- `getSourceRegistry(items: EnforcementCase[]): SourceRegistryEntry[]`
- `DashboardMetrics` includes `eprivacyFineTotal`, `eprivacyCaseCount`, `reviewCaseCount`, `topicCounts`, `legalBasisCounts`, `outcomeCounts`, `finesByYear`, `attention`, and `timeline`.

- [x] **Step 1: Write failing metric and filter tests**

Assert:

```ts
const metrics = getDashboardMetrics(cases)
assert.equal(metrics.eprivacyFineTotal, 475_000_000)
assert.equal(metrics.eprivacyCaseCount, 2)
assert.equal(metrics.topicCounts.cookies, 2)
assert.equal(metrics.topicCounts.e_marketing, 1)
assert.equal(metrics.topicCounts.app_sdk, 0)
assert.equal(metrics.topicCounts.device_identifiers, 0)
```

Add a synthetic mixed record and assert its fine is not included. Assert filtering by topic, legal-basis ID, authority, and a case-insensitive search over case ID, entity, topic, and legal-basis labels. Assert source registry dedupes by URL and retains both case IDs in coverage. Assert timeline sorts Google’s 2026 closure before its 2025 fine and the SHEIN decision.

- [x] **Step 2: Run focused tests to verify they fail**

Run: `npx tsx --test tests/dashboard_metrics.test.ts tests/filter_cases.test.ts`

Expected: FAIL because the metric/filter modules do not exist.

- [x] **Step 3: Implement the pure helpers**

Use stable enums and legal-basis families for all aggregation decisions. Keep `gdprTreatment === 'excluded'` as the inclusion gate; use sets for topic counts; flatten events without mutating source arrays; dedupe source URLs while merging case coverage and source types. Define empty-topic results as zero counts and preserve a stable topic order for the UI.

- [x] **Step 4: Run focused tests to verify they pass**

Run: `npx tsx --test tests/dashboard_metrics.test.ts tests/filter_cases.test.ts`

Expected: PASS, including the mixed/unknown exclusion and combined-Google-fine tests.

---

### Task 4: Add bilingual copy, stable formatting, and exports

**Files:**
- Create: `src/lib/i18n.ts`
- Create: `src/lib/export.ts`
- Create: `tests/export.test.ts`

**Interfaces:**
- `type Language = 'zh' | 'en'`
- `text(value: LocalizedText, language: Language): string`
- `formatFine(value: number | null, language: Language): string`
- `formatDate(value: string, language: Language): string`
- `exportCaseJson(items: EnforcementCase[], filters: CaseFilters): string`
- `exportCaseCsv(items: EnforcementCase[], language: Language): string`

- [x] **Step 1: Write failing formatting/export tests**

Assert that formatting produces `€475m`/`€475 million`-style readable output, dates remain stable ISO values in exports, JSON contains `legalBases`, `gdprTreatment`, `gdprExclusionReason`, `events`, and `sources`, and CSV includes canonical `case_id`, `legal_basis_ids`, `gdpr_treatment`, `fine_eur`, `source_urls`, plus both language labels. Assert exports are structurally identical when called with `zh` versus `en` except for the explicit localized label columns.

- [x] **Step 2: Run the focused test to verify it fails**

Run: `npx tsx --test tests/export.test.ts`

Expected: FAIL because the formatting/export helpers do not exist.

- [x] **Step 3: Implement the helpers**

Keep export keys canonical and language-agnostic. JSON should include the active filter state and the complete case/source/event objects. CSV should flatten repeated topics, legal-basis IDs, event dates/labels, and source URLs with pipe-separated values and escape quotes/newlines safely.

- [x] **Step 4: Run the focused test to verify it passes**

Run: `npx tsx --test tests/export.test.ts`

Expected: PASS with both languages.

---

### Task 5: Build the app shell, overview, and shared navigation

**Files:**
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/TopBar.tsx`
- Create: `src/components/LegalBasisCallout.tsx`
- Create: `src/components/TopicTabs.tsx`
- Create: `src/components/Overview.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- `Sidebar` receives `{ view, onViewChange, language, onLanguageChange }`.
- `TopBar` receives `{ query, onQueryChange, onExportJson, onExportCsv, language }`.
- `TopicTabs` receives `{ topic, counts, onTopicChange, language }`.
- `Overview` receives `{ metrics, language, onViewChange }`.

- [x] **Step 1: Implement the shell composition**

Replace the placeholder app with local state for view, language, search query, topic, filters, selected case, drawer visibility, and sort. Persist language only. Start on `cases` with Google selected, matching the design and the family resemblance to the DMA/DSA dashboards.

- [x] **Step 2: Implement the shared layout**

Create the dark rail, quiet top bar, title band, legal-basis callout, four topic tabs, and overview metrics. Use code-native Chinese copy, with English alternatives in the same copy map. Use Lucide icons for navigation, search, language, export, and the legal-basis marker.

- [x] **Step 3: Verify the shell before the case register**

Run: `npm run build`

Expected: PASS, with the shell rendering at `/` and the view buttons updating local state even before the register components are added.

---

### Task 6: Implement the case ledger, filters, sorting, and evidence drawer

**Files:**
- Create: `src/components/CaseLedger.tsx`
- Create: `src/components/EvidenceDrawer.tsx`
- Create: `src/components/FilterRow.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- `CaseLedger` receives filtered cases, sort state, selected ID, language, and callbacks for selection/sort/filter clearing.
- `EvidenceDrawer` receives `caseItem: EnforcementCase | null`, language, and `onClose`.
- `FilterRow` receives `CaseFilters`, option lists, language, and callbacks.

- [x] **Step 1: Implement the table-first ledger**

Render columns 案件 ID, 监管机构, 主体, 执法主题, 实际法律依据, 结果/状态, 罚款, 最后核验. Render legal bases as text with amber rules, not color-only badges. Preserve the combined Google fine. Add row hover, selected highlight, keyboard focus, disclosure affordance, and an intentional empty state for App SDK/device-identifier filters.

- [x] **Step 2: Implement filters and sorting**

Wire search, topic tab, authority, country, legal-basis, outcome, and clear filters through `filterCases`. Sort by last verified, fine, authority, and legal basis; keep stable tie-breaking by case ID. Keep selected case valid when filters change, falling back to the first visible case or `null`.

- [x] **Step 3: Implement the evidence drawer**

Show title, case ID, verification mark, authority/entity/fine, every actual legal basis, source links, evidence note, latest action, and the highlighted “为什么不计入 GDPR” / English equivalent. For review cases, show “暂不计入 ePrivacy 总额” instead of asserting exclusion.

- [x] **Step 4: Verify the core path locally**

Run: `npm run build && npm test`

Expected: PASS. Manual check: select SHEIN, filter `电子营销` to get Google only, filter `App SDK` to get the empty state, clear filters, open Google’s source, and close/reopen the drawer with keyboard focus.

---

### Task 7: Add overview, timeline, sources, and export wiring

**Files:**
- Modify: `src/components/Overview.tsx`
- Create: `src/components/Timeline.tsx`
- Create: `src/components/SourceRegistry.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- `Timeline` receives `TimelineEvent[]` and language.
- `SourceRegistry` receives `SourceRegistryEntry[]` and language.
- App export callbacks call `exportCaseJson` / `exportCaseCsv` for the current filtered cases and trigger browser downloads.

- [x] **Step 1: Implement the overview view**

Show ePrivacy-included total (€475m), included case count, review queue count, topic mix, and a small attention/source-freshness area. Do not show an empty or invented chart for App SDK/device identifiers; use zero-count labels and a short ready-for-backfill empty state.

- [x] **Step 2: Implement the timeline view**

Render flattened events newest-first with date, case, amount when relevant, topics, legal basis, description, and official source link. Use the same visual rhythm as the neighbouring trackers’ timeline sections while keeping ePrivacy legal-basis text visible.

- [x] **Step 3: Implement the source registry view**

Render deduped official URLs with source type, coverage case IDs/entities, last checked, verification status, and external links. Include the CNIL aggregate announcement and Google follow-up as standalone sources.

- [x] **Step 4: Wire JSON/CSV exports**

Add visible export controls to the top bar and verify the downloaded payload includes legal basis, GDPR treatment, exclusion/review reason, events, and source URLs.

- [x] **Step 5: Verify all views**

Run: `npm run build && npm test`

Expected: PASS. Manual check: switch Overview → Case register → Timeline → Sources and back, with search/filter state preserved unless explicitly cleared.

---

### Task 8: Finish responsive styling, accessibility, and motion

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`
- Modify: component files only where semantic markup or focus behavior needs correction

**Interfaces:**
- Desktop target: 1440×1024, with a narrow navy rail, ledger, and right evidence drawer.
- Mobile target: 390×844, with collapsible rail, horizontally scrollable topic tabs, stacked ledger rows that keep legal-basis content visible, and drawer content below/over the selected row.

- [x] **Step 1: Implement responsive breakpoints**

Use CSS grid/flex layout with a desktop drawer column and a mobile stacked drawer. Prevent horizontal page overflow; allow only intentional table/topic scrolling with accessible labels.

- [x] **Step 2: Implement interaction states**

Add visible `:focus-visible`, hover, selected, disabled, empty, and reduced-motion states. Keep the legal-basis amber marker and verified-source teal mark meaningful in monochrome by pairing color with text/icons.

- [x] **Step 3: Run static verification**

Run: `npm run lint && npm run build && npm test`

Expected: all commands pass with no unused imports, type errors, or lint violations.

---

### Task 9: Browser/IAB verification and fidelity ledger

**Files:**
- Create: `docs/verification/eprivacy-fidelity-ledger.md`
- Create: a temporary browser screenshot outside the source tree or in the permitted visualization workspace; remove temporary QA artifacts from the app workspace after review.

**Interfaces:**
- Uses the generated concept at `/Users/xuzhujie/.codex/generated_images/01a1f44f-5925-7543-a4db-bd243e420f10/exec-a368d1d0-a694-4589-87c0-d719bfde6c04.png` as the accepted visual reference.
- Produces a latest implementation screenshot at 1440×1024 when practical and a mobile-sized screenshot.

- [x] **Step 1: Start the app and verify with Browser/IAB first**

Run: `npm run dev -- --host 127.0.0.1` and open the local URL in the Browser/IAB. Use Playwright Chromium only if Browser/IAB is unavailable or unreliable, recording that fallback reason.

- [x] **Step 2: Exercise the core workflow**

Open the case register, select Google and SHEIN, switch topic tabs, filter App SDK/device identifiers, search `Article 82`, clear filters, switch language, export JSON/CSV, open official sources, and navigate all four views.

- [x] **Step 3: Check desktop and mobile screenshots**

Inspect the first viewport, ledger, evidence drawer, timeline, source registry, and responsive collapse. Confirm the legal-basis field remains readable and there is no clipped primary content or accidental horizontal overflow.

- [x] **Step 4: Use `view_image` on the concept and latest implementation screenshot**

Compare at least five concrete points: rail/navigation, title/legal-basis callout, table density and columns, amber/teal semantic accents, drawer geometry, typography/control sizing, timeline/source continuity, and mobile behavior.

- [x] **Step 5: Write the fidelity ledger and final verification**

Record each mismatch, concept evidence, render evidence, and fix/intentional deviation. Run the above-the-fold copy diff against the accepted copy list. Remove temporary screenshots/reports from the app workspace and leave only the durable fidelity ledger.

No Git commit step is included because the current workspace is not a Git repository.

