# Review Queue, Source History, and Shareable Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the next maintenance round by refreshing official evidence, making source reachability auditable over time, exposing a true review queue, preserving filters in shareable URLs, and reconciling stale maintenance plans.

**Architecture:** Keep the static React/Vite register and explicit official-source data model. Add only confirmed official follow-up evidence to case data; keep unresolved mixed-basis amounts outside the total. Extend the existing source monitor with a bounded history file, expose the latest reachability result beside each manual evidence status, and derive the review queue and URL state from the same `CaseFilters` contract.

**Tech Stack:** React 19, TypeScript, Vite, Node test runner, GitHub Actions, official regulator websites and decision PDFs.

**Spec:** `docs/superpowers/specs/2026-11-20-post-release-optimization-design.md` and `docs/data-maintenance.md`.

## Global Constraints

- Only official authority pages, decision texts, registers, or annual reports may support case records.
- Never split a multi-basis fine without an official allocation; SOLOCAL €900,000 and CALOGA €80,000 stay unresolved.
- An annual-report record stays in the review queue until a direct official decision is safely attached; Massimo Dutti remains review if the AEPD PDF cannot be verified.
- HTTP 403 is an automated reachability review state, not evidence invalidation.
- App SDK remains an ePrivacy topic only when the official enforcement text explicitly identifies SDK behavior and an ePrivacy legal basis.
- Use tests first for every behavior change and run the full quality gate before release.
- The user explicitly authorized continuing work in the current published checkout; keep the current `main` branch and record this ruling in the ledger.

## Review Focus

- A source-history file must reject malformed snapshots and keep a bounded, newest-first history without duplicate timestamps; test parser and merge behavior.
- A URL round-trip must preserve stable filter values, omit defaults, and ignore invalid enum values; test parse/serialize symmetry.
- The review queue must include both evidence-review records and mixed-allocation records; test it independently from the evidence-status filter.
- The source registry must show automated reachability separately from manual evidence verification; test a verified-but-403 source.
- Adding a follow-up source must update the timeline without changing the original fine or the ePrivacy total; test SOLOCAL closure data.

### Task 1: Refresh official evidence without changing unsafe allocations

**Files:**
- Modify: `src/data/cases.ts`
- Test: `tests/cases.test.ts`, `tests/data_quality.test.ts`
- Modify: `docs/source-audit-2026-11-20.md`, `docs/maintenance-log.md`

**Interfaces:**
- Add the official SOLOCAL 2026 injunction-closure follow-up source and event.
- Keep Massimo Dutti in annual-report review because the direct AEPD decision is not verified in an official accessible source.
- Keep SOLOCAL / CALOGA mixed amounts unresolved and out of the ePrivacy total.

- [x] **Step 1: Write failing assertions** for the SOLOCAL closure source/event and unchanged total/allocation invariants.
- [x] **Step 2: Run the focused case/data tests and confirm the new assertions fail.**
- [x] **Step 3: Add the official Légifrance/CNIL follow-up source and event; do not change `fineEur`, `amountAllocation`, or inclusion treatment.**
- [x] **Step 4: Run `npm run data:check` and the focused tests; confirm the only data change is the follow-up evidence.**
- [x] **Step 5: Record the AEPD search result and mixed-basis conclusion in the audit/maintenance docs.**

### Task 2: Persist source reachability history

**Files:**
- Modify: `src/lib/sourceStatus.ts`, `src/data/sourceStatus.ts`, `src/lib/sourceMonitoring.ts`
- Modify: `scripts/check-sources.ts`, `package.json`
- Create: `public/source-status-history.json`
- Modify: `.github/workflows/source-monitor.yml`
- Test: `tests/source_status.test.ts`, `tests/source_monitor.test.ts`

**Interfaces:**
- `SourceStatusHistory` stores a bounded list of `SourceStatusSnapshot` values.
- `readSourceStatusHistory(value: unknown): SourceStatusSnapshot[]` returns an empty list for malformed input.
- `appendSourceStatusHistory(history, snapshot, limit = 12): SourceStatusSnapshot[]` deduplicates by `checkedAt`, puts newest first, and keeps at most `limit` snapshots.
- `scripts/check-sources.ts --history-output <path>` writes the latest report and updates the history file.

- [x] **Step 1: Write failing history parser/merge and CLI argument tests.**
- [x] **Step 2: Run the focused tests and confirm failure for the missing history API.**
- [x] **Step 3: Implement the pure history helpers and CLI history output.**
- [x] **Step 4: Seed the current snapshot and update the scheduled workflow to commit bounded history with the latest snapshot.**
- [x] **Step 5: Run source-monitor tests and a local history update in a temporary path.**

### Task 3: Add a real review queue and shareable filter URLs

**Files:**
- Modify: `src/lib/filterCases.ts`, `src/lib/appState.ts`, `src/lib/filterSummary.ts`, `src/lib/copy.ts`
- Modify: `src/App.tsx`, `src/components/FilterRow.tsx`, `src/components/Overview.tsx`
- Test: `tests/filter_cases.test.ts`, `tests/filter_summary.test.ts`, `tests/app_shell.test.ts`

**Interfaces:**
- `CaseFilters.reviewQueue: 'all' | 'needs_review'` is independent of `evidenceStatus`.
- `filterCases` includes a record in the review queue when `trackerTreatment === 'needs_review'` or `evidenceStatus === 'needs_review'`.
- `parseFiltersFromSearch(search: string): CaseFilters` and `serializeFiltersToSearch(filters: CaseFilters): string` use compact, validated URL parameters and omit defaults.
- The Overview review panel opens the Case Register with the review queue filter; App synchronizes filters to `window.history.replaceState`.

- [x] **Step 1: Write failing tests for review-queue filtering and URL parse/serialize round trips.**
- [x] **Step 2: Run the focused tests and confirm the new behavior is absent.**
- [x] **Step 3: Implement the filter field, validated URL state, localized summary label, and review-queue control/action.**
- [x] **Step 4: Run focused tests and verify the exported filters include the new field.**

### Task 4: Show automated source reachability beside manual evidence

**Files:**
- Modify: `src/data/dashboardMetrics.ts`, `src/App.tsx`
- Modify: `src/components/SourceRegistry.tsx`, `src/components/Overview.tsx`
- Modify: `src/lib/sourceStatus.ts`, `src/lib/copy.ts`, `src/App.css`
- Test: `tests/dashboard_metrics.test.ts`, `tests/source_status.test.ts`

**Interfaces:**
- Source registry rows receive the latest `SourceStatusSnapshot | null` and show `ok`, `needs_review`, or unavailable without changing `verificationStatus`.
- Overview shows history depth/latest check date when history is available.
- Manual evidence and automated reachability remain separate labels and counts.

- [x] **Step 1: Write failing assertions for a verified source with a 403 reachability result and a history-depth summary.**
- [x] **Step 2: Run focused tests and confirm failure.**
- [x] **Step 3: Wire the snapshot/history into the app and source registry, with bilingual copy and responsive styles.**
- [x] **Step 4: Run tests, lint, build, and rendered browser checks for the review queue, URL state, and source badges.**

### Task 5: Reconcile maintenance plans and release

**Files:**
- Modify: `docs/superpowers/plans/2026-11-19-eprivacy-enforcement-tracker.md`
- Modify: `docs/superpowers/plans/2026-11-20-review-and-release-readiness.md`, `docs/superpowers/plans/2026-11-20-post-release-optimization.md`
- Modify: `docs/verification/eprivacy-fidelity-ledger.md`, `README.md`, `docs/data-maintenance.md`, `docs/maintenance-log.md`

- [x] **Step 1: Mark completed historical implementation steps as complete and preserve genuinely open data/reachability risks.**
- [x] **Step 2: Add this plan's completion ledger and current numbers without rewriting historical claims.**
- [x] **Step 3: Run `npm ci`, `npm run data:check`, `npm test`, `npm run lint`, and `npm run build`.**
- [x] **Step 4: Verify the working tree, push `main`, wait for GitHub Actions/Pages, and inspect the published review queue/source-history behavior.**
