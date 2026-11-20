# Review Queue and Release Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close only the evidence-review items supported by direct official texts, strengthen release readiness, and leave uncertain ePrivacy/GDPR allocations explicitly separated.

**Architecture:** Treat official source discovery as a read-only evidence pass, then update the local TypeScript case registry and its quality tests. Keep the existing GitHub Pages workflow unchanged unless a concrete repository constraint is found; a missing remote is a release blocker, not a reason to invent deployment state.

> Historical status: the repository now has a configured `origin` and a live GitHub Pages deployment. This plan remains the evidence-review record; subsequent source-history, review-queue, and shareable-filter work is tracked in `2026-11-20-review-ops-and-shareable-filters.md`.

**Tech Stack:** React + Vite, TypeScript, Node test runner, GitHub Actions, official regulator websites and decision PDFs.

**Spec:** `docs/superpowers/specs/2026-11-19-eprivacy-enforcement-tracker-design.md`

## Global Constraints

- Only official authority pages, decision texts, registers, or annual reports may support a case record.
- A case enters the ePrivacy total only when its legal basis, evidence status, GDPR treatment, and amount scope satisfy the existing inclusion rule.
- Never split a multi-basis fine without an official allocation.
- Preserve the distinction between `fineEur` and `totalDecisionAmountEur`.
- Do not label a mobile-app record as App SDK unless the official text explicitly identifies an SDK.
- Do not push, publish, or change repository permissions without a configured remote and an explicit user-owned destination; the current repository uses `origin` and the user has authorized continuation in this checkout.

## Review Focus

- Direct decision text versus announcement-only evidence: a source link must be sufficient for the claimed amount and legal basis.
- Mixed GDPR/ePrivacy allocation: unresolved amount stays outside the total and retains a review reason.
- Annual-report summaries: they remain review items until a direct decision is found.
- Source freshness and official-host validation: every changed record must pass `npm run data:check`.
- Release readiness: verify the configured `origin`, local Pages workflow syntax, build path, and the published Pages target; preserve the historical no-remote result as an archived baseline only.

### Task 1: Establish release and review baseline

**Files:**
- Modify: `docs/superpowers/plans/2026-11-20-review-and-release-readiness.md`
- Inspect: `.github/workflows/quality-and-pages.yml`, `package.json`, `src/data/cases.ts`

- [x] **Step 1: Check repository state**

Confirm whether Git metadata, a remote, and a deploy target exist. The historical baseline recorded the pre-publication check; the current repository has `origin` and a configured Pages target.

- [x] **Step 2: Record the review queue**

Use `getDashboardMetrics(cases).attention` to enumerate the five current review records and their source URLs.

- [x] **Step 3: Verify the baseline**

Run `npm run data:check && npm test && npm run lint && npm run build` before changing records.

### Task 2: Resolve review items from official evidence

**Files:**
- Modify: `src/data/cases.ts`
- Test: `tests/data_quality.test.ts`, `tests/dashboard_metrics.test.ts`

- [x] **Step 1: Search official decision text**

For each review ID, search only the named regulator's official site and inspect direct decisions or official registers. Record the URL, decision reference, legal-basis wording, amount scope, and date.

- [x] **Step 2: Write failing assertions for any resolvable item**

Assert the exact evidence level, decision reference, legal-basis family, and inclusion/review outcome for each item supported by a direct official text. Do not add assertions for unresolved items.

- [x] **Step 3: Update the smallest data fields**

Change only source metadata, evidence status, review reason, amount scope, and tracker treatment needed to reflect the official text. Keep mixed allocations as review unless the direct text provides an explicit split.

- [x] **Step 4: Run focused quality tests**

Run `npm run data:check && npm test` and confirm the total changes only when a record is legitimately included.

### Task 3: Add evidence-source regression coverage

**Files:**
- Modify: `tests/cases.test.ts`, `tests/data_quality.test.ts`

- [x] **Step 1: Pin official hosts and decision references**

Assert every included case has verified official sources and every review case has a non-empty review reason.

- [x] **Step 2: Pin mixed-allocation guardrails**

Assert unresolved mixed cases keep `fineEur = null` and retain their full disclosure in `totalDecisionAmountEur`.

- [x] **Step 3: Run the full test suite**

Run `npm test`, `npm run lint`, and `npm run build`.

### Task 4: Validate release readiness

**Files:**
- Modify: `docs/data-maintenance.md`
- Inspect: `.github/workflows/quality-and-pages.yml`

- [x] **Step 1: Confirm local Pages build**

Run `npm run build` and verify `dist/index.html` and hashed assets exist.

- [x] **Step 2: Confirm the CI chain**

Verify the workflow order is `data:check → test → lint → build`, with Pages deploy gated on a successful `main` push.

- [x] **Step 3: Confirm the external release state**

The historical baseline had no remote. The current checkout uses `origin` and its GitHub Pages deployment is live; do not simulate a deployment when the remote or Pages state is unavailable.
