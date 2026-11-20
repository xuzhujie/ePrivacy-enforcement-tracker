# ePrivacy Tracker — visual fidelity and browser QA ledger

Date: 2026-11-20

## Reference and render evidence

- Accepted reference: `/Users/xuzhujie/.codex/generated_images/01a1f44f-5925-7543-a4db-bd243e420f10/exec-a368d1d0-a694-4589-87c0-d719bfde6c04.png`.
- The accepted concept was inspected with `view_image` before comparison.
- The implementation was opened at `http://127.0.0.1:3002/`.
- Browser/IAB was used for the current interaction verification at a 1280×720 desktop viewport. The prior responsive pass also checked the 390×844 layout; temporary screen captures were inspected outside the app workspace.

## Concrete comparison points

| Point | Concept evidence | Implementation evidence | Decision |
| --- | --- | --- | --- |
| Rail and navigation | Narrow deep-navy rail with four research views | 188px navy rail, active blue state with amber edge, Overview / Case register / Timeline / Sources | Matched; Chinese default and rail language switch are intentional product choices. |
| Heading and legal callout | Large tracker title beside an amber “Actual legal basis” card | Same two-column hierarchy; callout states that GDPR is excluded from the ePrivacy total and shows the actual-basis rule | Matched and made data-specific. |
| Ledger density | Table-first case register with legal basis visible beside amount and last-verified fields | Dense register adds required authority, entity, topics and outcome columns; legal-basis text remains a first-class column and drawer section | Matched the information hierarchy; additional columns are required by the brief. |
| Amber / teal semantics | Amber legal-basis marker and teal verified-source mark | Amber basis borders and `GDPR excluded` markers; teal verified marks and source icons, paired with text/icons for monochrome meaning | Matched. |
| Evidence drawer | Right-side case evidence panel with source and “not GDPR” explanation | Sticky drawer retains legal basis IDs, combined-fine scope, official CNIL links, evidence note, latest action and GDPR exclusion reason | Matched; drawer now reflects the two official seeded cases. |
| Timeline and sources | Recent-action timeline and source registry below the ledger | Compact timeline/source panels appear below the case ledger and expand into dedicated views; registry dedupes 30 official source URLs while the quality gate tracks 32 case-source records | Matched with continuity preserved across views. |
| Responsive behavior | Reference is desktop-oriented | At 390×844: mobile rail is off-canvas, trigger opens the rail, ledger rows use `display: grid`, topic tabs scroll intentionally, `documentElement.scrollWidth === innerWidth`, and legal-basis cells remain present | Intentional responsive extension; no accidental page overflow. |

## Above-the-fold copy diff

- Reference copy: “ePrivacy Enforcement Tracker” / “Independent enforcement register” / “Actual legal basis”.
- Default implementation copy: `ePrivacy｜独立执法 Tracker` / `独立 ePrivacy 执法登记库` / `实际法律依据`.
- The Chinese default and English toggle are intentional requirements. The implementation replaces generic concept text with the actual scope sentence, official data-as-of date, and the explicit GDPR exclusion rule.

## Workflow evidence

- Selected Google and SHEIN; drawer content, combined-fine scope, and amounts updated correctly. The €1.5m American Express record also remains precise in compact display.
- Filtered `Evidence needs review` to the AEPD annual-report record and `Mobile app` to the verified FNAC Darty identifier case; both drawers exposed the expected evidence level and review/verification state.
- The ePrivacy-counted App SDK topic remains zero-count; the FNAC Darty record is tagged as device identifiers because the official notice names an app/API/user identifier but does not call the component a specific SDK.
- The Italian Garante / Meta record is included under device identifiers and Article 122; the official decision does not identify an SDK.
- The Garante Foodinho / Glovo decision is an explicit GDPR-only App SDK reference: the official text describes SDK access to device information, location and identifiers, but the record is excluded from ePrivacy totals and amounts.
- Searched `Article 82`, cleared filters, and returned Overview → Case register → Timeline → Sources without losing query/filter state unless cleared.
- Clicked JSON and CSV export controls. Export helpers are covered by automated tests for legal bases, GDPR treatment/exclusion reason, events and official source URLs.
- Official CNIL source links were present in the drawer, timeline, and registry, including the aggregate action-plan announcement and Google injunction-closure follow-up.

## Review fixes verified

- Overview now derives metrics from the current filtered case set; selecting the empty App SDK topic shows `€0`, `0 cases`, `0 actions`, and `0 sources`.
- Timeline events now carry the source that matches the event type; the 2026-09-23 Google follow-up opens the CNIL injunction-closure source, while the 2025 fine event opens the enforcement announcement.
- Evidence status is now consistent in the table, evidence drawer, timeline, and source registry; annual-report evidence is visibly marked as needing review.
- Data quality is executable with `npm run data:check`; the current dataset reports 21 cases, 32 source records, 17 included cases, €1,684,350,500 included, 3 review cases, and zero errors/warnings.
- At 390×844, the closed mobile rail has `aria-hidden="true"` and its six navigation/language controls use `tabIndex=-1`; the scrim and close button enter the Tab order only while the rail is open.
- CSV remains visible beside JSON at the 390px breakpoint; page and ledger overflow remain false, and legal-basis cells remain present in the stacked rows.
- The updated shell exposes active filter context, separates whole-register URL reachability from manual evidence verification, and supports `⌘ / Ctrl K` search focus plus Escape drawer close/focus return.

## Intentional deviations and remaining risk

- The concept places the language selector in the top-right; the implementation keeps it in the rail to align with the neighboring tracker family and the narrow-rail navigation model.
- The concept uses illustrative historical IDs/dates; the implementation uses the requested official CNIL records, `€325m` Google combined amount, `€150m` SHEIN amount, 2026 official mobile-app coverage, the €805m Meta record, and the 2026-09-23 Google follow-up event.
- The implementation has no backend crawler or CMS; all official-source records are explicit, reviewable seed data. The maintenance contract and release checks are documented in `docs/data-maintenance.md`.
- The repository is published on GitHub with a committed package lock; CI uses `npm ci`, while the static app keeps a safe fallback when the source-status snapshot is unavailable.
