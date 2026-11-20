# ePrivacy Tracker Post-Release Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the published ePrivacy Tracker precise about source freshness, transparent about active filters, accessible by keyboard, localized in its filters, reproducible in CI, and current in its QA documentation without changing legal-basis counting.

**Architecture:** Keep the React/Vite static site and local TypeScript registry. Add a separate source-reachability snapshot consumed from `public/source-status.json`; retain manual evidence status in case data. Surface active filter context in the existing shell, strengthen focus semantics in the existing drawer/ledger, and update the existing workflows rather than introducing a backend.

**Tech Stack:** React 19, TypeScript, Vite, Node test runner, ESLint, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-20-post-release-optimization-design.md`

## Global Constraints

- Do not treat HTTP 403 as evidence invalidation or confirmed URL removal.
- Keep the existing ePrivacy/GDPR amount allocation rules unchanged.
- Do not add App SDK records without explicit official SDK wording.
- Preserve the ePrivacy counting rules and 3-case review queue; the dataset may include explicitly labeled GDPR-only reference records outside the ePrivacy total.
- Use tests first for behavior changes and run the full quality gate before completion.

## Review Focus

- A missing or malformed source-status snapshot must leave the app usable and clearly show the status as unavailable; test the fallback.
- A source can be manually verified while its latest HTTP check needs review; test that the two states remain separate.
- Filters can persist across views; test that the visible context prevents a filtered total from reading as a global total.
- Search and drawer interactions must work through keyboard-only input; test Meta/Ctrl+K, Escape, and focus return.
- Chinese and English filter labels must differ without changing their stable filter values; test both language paths.

## Execution Ruling

- **Ruling:** Work in the current `main` checkout because the user explicitly asked to start all optimizations in the already-published workspace; the cost if wrong is direct main-branch changes before the final push, mitigated by per-task tests and a final review.
- **Ruling:** Add the official Garante Foodinho/Glovo SDK decision as a verified GDPR-only reference record with `trackerTreatment = excluded`; it demonstrates the App SDK data shape without changing the ePrivacy total, and the cost if wrong is a broader register that readers must understand through its explicit exclusion state.

---

### Task 1: Source-status model and fallback

**Files:**
- Create: `src/lib/sourceStatus.ts`
- Create: `src/data/sourceStatus.ts`
- Create: `public/source-status.json`
- Modify: `src/lib/sourceMonitoring.ts`
- Test: `tests/source_status.test.ts`

**Interfaces:**
- `SourceStatusSnapshot` contains `checkedAt`, `totalCount`, `okCount`, `attentionCount`, `blockingCount`, and URL results.
- `readSourceStatusSnapshot(value: unknown): SourceStatusSnapshot | null` validates a snapshot and returns null for missing/malformed data.
- `summarizeSourceStatus(snapshot): { label: 'ok' | 'attention' | 'unavailable'; ... }` produces UI-safe counts.

- [x] **Step 1: Write failing tests** for valid snapshot parsing, malformed fallback, and separation from manual `CaseSource.verificationStatus`.
- [x] **Step 2: Run `node --import tsx/esm --test tests/source_status.test.ts` and confirm the new tests fail for missing exports/behavior.
- [x] **Step 3: Implement the snapshot types/validation and export the existing monitor report in the new compatible shape without changing URL classification.
- [x] **Step 4: Add the current 2026-11-20 source snapshot under `public/source-status.json` and a typed fallback under `src/data/sourceStatus.ts`.
- [x] **Step 5: Run the focused test and then `npm test`; expect all tests to pass.
- [x] **Step 6: Consolidated with the remaining feature commits after the final review.

### Task 2: Source status and filter context in the dashboard

**Files:**
- Modify: `src/data/dashboardMetrics.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/Overview.tsx`
- Modify: `src/components/TopicTabs.tsx`
- Modify: `src/components/SourceRegistry.tsx`
- Modify: `src/lib/copy.ts`
- Test: `tests/dashboard_metrics.test.ts`
- Test: `tests/app_shell.test.ts`

**Interfaces:**
- Dashboard metrics expose deduplicated source status counts separately from case evidence counts.
- App loads the source snapshot with a safe fallback and passes active filter summary to views.

- [x] **Step 1: Write failing tests** for deduplicated source status counts and the active-filter summary labels/clear action contract.
- [x] **Step 2: Run the focused tests and confirm they fail against the current all-sources/English-only behavior.
- [x] **Step 3: Implement separate source status metrics and a visible source freshness summary; never label `sourceCount` as verified.
- [x] **Step 4: Add active filter chips/summary and mark topic counts as scoped to the current filtered set.
- [x] **Step 5: Run focused tests plus `npm run data:check` and `npm test`.
- [x] **Step 6: Consolidated with the remaining feature commits after the final review.

### Task 3: Keyboard behavior, drawer semantics, and localized filters

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/TopBar.tsx`
- Modify: `src/components/EvidenceDrawer.tsx`
- Modify: `src/components/CaseLedger.tsx`
- Modify: `src/components/FilterRow.tsx`
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/lib/copy.ts`
- Test: `tests/app_shell.test.ts`
- Test: `tests/filter_cases.test.ts`

**Interfaces:**
- TopBar accepts a search ref/focus callback and displays platform-neutral shortcut copy.
- EvidenceDrawer receives the selected-case trigger ref and handles close/focus return through the existing App state.
- Authority/country options carry stable values plus localized labels.

- [x] **Step 1: Write failing tests** for platform-neutral shortcut copy, localized filter option mapping, and stable filter behavior.
- [x] **Step 2: Run focused tests and confirm failures.**
- [x] **Step 3: Implement Meta/Ctrl+K focus, input-safe key handling, Escape close, dialog semantics, focus restoration, and stronger row/table sort labels.
- [x] **Step 4: Implement localized authority/country option labels without changing filter values.
- [x] **Step 5: Run focused tests and the full suite.
- [x] **Step 6: Consolidated with the remaining feature commits after the final review.

### Task 4: Reproducible CI and scheduled source snapshot updates

**Files:**
- Create: `package-lock.json`
- Modify: `.github/workflows/quality-and-pages.yml`
- Modify: `.github/workflows/source-monitor.yml`
- Modify: `.gitignore`
- Test: workflow YAML inspection plus `npm ci`

- [x] **Step 1: Generate the lockfile with the existing package manifest and run `npm ci` locally.
- [x] **Step 2: Change both workflows from `npm install` to `npm ci` and add dependency caching through setup-node.
- [x] **Step 3: Make the Pages build include the source snapshot and make the scheduled source monitor copy its generated snapshot into `public/source-status.json` for the next Pages deployment, while retaining the artifact and failure behavior.
- [x] **Step 4: Run `npm ci`, `npm test`, `npm run lint`, and `npm run build`.
- [x] **Step 5: Consolidated with the remaining feature commits after the final review.

### Task 5: QA ledger and maintenance documentation

**Files:**
- Modify: `docs/verification/eprivacy-fidelity-ledger.md`
- Modify: `docs/maintenance-log.md`
- Modify: `docs/data-maintenance.md`
- Modify: `README.md`

- [x] **Step 1: Update current dataset counts, source-status semantics, CI lockfile instructions, and the known App SDK boundary.
- [x] **Step 2: Add the latest QA path and remaining limitations without presenting historical snapshots as current.
- [x] **Step 3: Run `npm run data:check` and verify all documented current numbers match its output.
- [x] **Step 4: Consolidated with the remaining feature commits after the final review.

### Task 6: Whole-branch verification and rendered QA

**Files:**
- No new product files; inspect all changed files and workflows.

- [x] **Step 1: Run `npm ci`, `npm run data:check`, `npm test`, `npm run lint`, and `npm run build`.
- [x] **Step 2: Start the Vite app with the repository dev script and exercise the target flow: app loads → search shortcut → active filter → Overview scope summary → source freshness status → drawer Escape/focus return.
- [ ] **Step 3: Check the published Pages URL at desktop and mobile-sized viewports; inspect console errors, blank/overlay states, and screenshots.
- [x] **Step 4: Run a final diff/status review and confirm no generated artifacts or secrets are tracked.
- [ ] **Step 5: Push the verified commits to `origin/main` and wait for the Pages workflow to complete successfully.
- [ ] **Step 6: Record final verification and remaining risks in this plan, then deliver the repository and Pages links.

## Progress ledger

- 2026-11-20: Added the official Garante Foodinho / Glovo GDPR-only SDK reference without changing the ePrivacy total.
- 2026-11-20: Final live source check: 30 URLs, 19 reachable, 11 HTTP 403 needs-review, 0 confirmed unreachable.
- 2026-11-20: Local UI verification passed for active-filter scope, App SDK reference exclusion, source freshness, Meta/Ctrl+K, English labels, Escape close and focus return.
- 2026-11-20: Clean `npm ci`, data check, 33 tests, lint and production build passed after regenerating a registry-based lockfile.
