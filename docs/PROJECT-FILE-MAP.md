# NexStock project file map

Generated for the 12 November 2026 reconstruction. Read [PROJECT-HANDOVER.md](PROJECT-HANDOVER.md) first for status, chronology, requirements and continuation.

This index covers all 388 source/document/configuration files in the initial content scan. It excludes dependency internals, credential values, private browser state, generated HTML assets and duplicate binary evidence. The dependency lock, SVG fixture, private/runtime directories and archive layout are described separately below. Literal test declarations are listed for navigation; generated loop cases and actual execution are established by Playwright discovery and reviewed registers, not this text extractor.

## Runtime, private data and generated artifacts

- `package-lock.json`: registry lock for the pinned Playwright package and dependencies.
- `tests/fixtures/product-image.svg`: original image fixture; release retesting uses a supported PNG input rather than treating unsupported SVG as an app defect.
- `.env`: local target, allowlist, explicit disposable-production opt-ins and credentials. Values are excluded from this index.
- `.env.example`: configuration reference covering module prerequisites and manual-evidence options.
- `.gitignore`: excludes dependencies, .env, browser auth, default reports, test results, blob archive and logs.
- `playwright/.auth/`: private baseline/fixture state; retain approved BRN adoption backup and payment-method fixture history.
- `test-results/`: authentication, recovery ledgers, collection records, diagnostics and downloaded public client.
- `blob-report/archive/`: preserved campaigns; see handover chronology. Each attempt can contain execution.json, results.json, junit.xml, console.log, safe journals, report assets, screenshots and document/CSV downloads.
- `playwright-report/`: most recently generated default report only.
- `output/pdf/`: the three historical one-page QA summaries.
- `tmp/`: historical PDF renders and reconstruction intermediates; not additional live test executions.
- `debug.log`: historical diagnostic output; use dated completed execution records for verdicts.
- `node_modules/`: installed third-party runtime; package internals are not NexStock application source.
- `.git/`: QA-repository history, not the tested application source history.

## Source files

### .github/workflows

| File | Lines | Responsibility |
| --- | ---: | --- |
| [.github/workflows/qa.yml](../.github/workflows/qa.yml) | 30 | Manual GitHub Actions Chromium smoke workflow; current empty smoke project needs attention before relying on CI. |

### Repository root

| File | Lines | Responsibility |
| --- | ---: | --- |
| [AGENTS.md](../AGENTS.md) | 17 | Required bug-report sections, reproduction numbering, separators, deduplication and classification. |
| [customers-failure-tickets.md](../customers-failure-tickets.md) | 278 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [hardware-failure-tickets.md](../hardware-failure-tickets.md) | 111 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [help-failure-tickets.md](../help-failure-tickets.md) | 135 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [invoicing-failure-tickets.md](../invoicing-failure-tickets.md) | 192 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [package.json](../package.json) | 94 | Pinned runtime dependency and npm commands; default smoke does not collect tests in the current tree. |
| [phase1-round1-combined-failure-tickets.md](../phase1-round1-combined-failure-tickets.md) | 389 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [phase2-failure-tickets.md](../phase2-failure-tickets.md) | 1626 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [playwright.config.ts](../playwright.config.ts) | 177 | Loads .env; defines the main projects, lifecycle dependencies, reporters and execution defaults. |
| [playwright.phase2.config.ts](../playwright.phase2.config.ts) | 22 | Selects one Phase 2 module and isolated stage/report directories. |
| [playwright.release.config.ts](../playwright.release.config.ts) | 18 | Adds isolated release evidence and desktop viewport to main projects. |
| [pos-failure-tickets.md](../pos-failure-tickets.md) | 392 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [product-catalog-failure-tickets.json](../product-catalog-failure-tickets.json) | 202 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [product-catalog-failure-tickets.md](../product-catalog-failure-tickets.md) | 394 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [README.md](../README.md) | 112 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [release-retest-failure-tickets.md](../release-retest-failure-tickets.md) | 238 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [security-failure-tickets.md](../security-failure-tickets.md) | 220 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [settings-failure-tickets.md](../settings-failure-tickets.md) | 463 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [stock-adjustments-failure-tickets.md](../stock-adjustments-failure-tickets.md) | 99 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [store-failure-tickets.md](../store-failure-tickets.md) | 158 | Historical detailed findings; preserve original date and apply later retest verdicts. |
| [suppliers-failure-tickets.md](../suppliers-failure-tickets.md) | 145 | Historical detailed findings; preserve original date and apply later retest verdicts. |

### checks

| File | Lines | Responsibility |
| --- | ---: | --- |
| [checks/help-safety.test.mjs](../checks/help-safety.test.mjs) | 49 | Offline regression checks for help safety. |
| [checks/phase2-assessment.test.mjs](../checks/phase2-assessment.test.mjs) | 35 | Offline regression checks for phase2 assessment. |
| [checks/release-finding-classification.test.mjs](../checks/release-finding-classification.test.mjs) | 10 | Offline regression checks for release finding classification. |
| [checks/safety.test.mjs](../checks/safety.test.mjs) | 17 | Offline regression checks for safety. |
| [checks/security-safety.test.mjs](../checks/security-safety.test.mjs) | 26 | Offline regression checks for security safety. |
| [checks/settings-baseline.test.mjs](../checks/settings-baseline.test.mjs) | 22 | Offline regression checks for settings baseline. |
| [checks/settings-safety.test.mjs](../checks/settings-safety.test.mjs) | 55 | Offline regression checks for settings safety. |

Declarations and reusable entry points:

- `checks/help-safety.test.mjs`
  - Case: legal suite permits read ${path}
  - Case: public legal clicks cannot authenticate or select a business
  - Case: explicit session operations only permit their own endpoints
  - Case: company policy edits, acceptance, credentials and transactions are forbidden
  - Case: build parsing requires labelled metadata, not arbitrary hex or release-note prose
  - Case: Help outcomes separate incomplete prerequisites from confirmed defects
  - Case: Help traceability uses feature and case identities, never array positions
- `checks/phase2-assessment.test.mjs`
  - Case: mocked UI success cannot count as live account or authorization coverage
  - Case: mock observations remain unconfirmed, and promoting a mocked finding to a live bug requires review
  - Case: real blockers, reviewed application failures and unclassified errors stay distinct
  - Case: successful full-flow steps are not errors; plain adapter failures remain reviewable beside known bugs
  - Case: a finally/transport failure cannot be hidden by a previous bug or blocker annotation
  - Case: known full-flow aggregation is reviewable without misclassifying successful steps or hiding later timeouts
- `checks/release-finding-classification.test.mjs`
  - Case: reviewed debit-document finding does not conceal a separate cleanup or transport error
- `checks/safety.test.mjs`
  - Case: production cannot be relabelled as local to enable writes
  - Case: unknown origins refused
  - Case: writes require opt-in
  - Case: writes require matching disposable business
  - Case: explicit local disposable target admitted
  - Case: onboarding refuses an account not marked disposable
  - Case: onboarding admits an opted-in disposable account
  - Case: onboarding refuses production without a dedicated override
  - Case: onboarding admits production only with the dedicated override
  - Case: product UI tests refuse production without a dedicated override
  - Case: product UI tests admit production only with the dedicated override
  - Case: app mount is retained
- `checks/security-safety.test.mjs`
  - Case: security guard permits routine session action ${path}
  - Case: unattended security guard blocks ${path}
  - Case: reset-code GET cannot send security email in unattended mode
  - Case: unattended reset GET and incidental language writes are blocked too
  - Case: public forgot-password document remains readable
  - Case: manual handoff permits credential endpoint only in its separate context
  - Case: third-party POST is blocked
  - Case: security suite retains the disposable production opt-in guard
  - Case: production credentials cannot use HTTP even with mutation opt-in
- `checks/settings-baseline.test.mjs`
  - Case: accepts only approved BRN and preserves original object and unrelated API fields
  - Case: refuses absent or different approval
  - Case: refuses unrelated ${key} change
  - Case: refuses additional tax or unexpected server BRN changes
- `checks/settings-safety.test.mjs`
  - Case: settings saves require explicit operation and a server baseline
  - Case: profile updates permit QA identity without unrelated changes
  - Case: tax settings permit VAT15 and BRN
  - Case: localization permits currency and language
  - Case: every operation rejects unrelated ${field} changes
  - Case: does not permit cross-scope settings changes
  - Case: only empty optional null/string normalization is accepted
  - Case: same nested values do not depend on object key order
  - Case: permits only en/fr language synchronization payload
  - Case: theme synchronization requires its scope and exact light/dark/system payload
  - Case: settings permits only the observed unchanged payment-method UI projection
  - Case: rejects out-of-scope deletion ${endpoint}
  - Case: rejects external settings writes

### data

| File | Lines | Responsibility |
| --- | ---: | --- |
| [data/feature-matrix.json](../data/feature-matrix.json) | 1468 | Requirements, case design, agreed contract or release scope data. |
| [data/help-delivery-status.json](../data/help-delivery-status.json) | 10 | Requirements, case design, agreed contract or release scope data. |
| [data/phase1-cases.json](../data/phase1-cases.json) | 633 | Requirements, case design, agreed contract or release scope data. |
| [data/phase1-routes.json](../data/phase1-routes.json) | 139 | Requirements, case design, agreed contract or release scope data. |
| [data/phase2-csv-stock-contract.json](../data/phase2-csv-stock-contract.json) | 7 | Requirements, case design, agreed contract or release scope data. |
| [data/phase2-grn-contract.json](../data/phase2-grn-contract.json) | 9 | Requirements, case design, agreed contract or release scope data. |
| [data/phase2-notification-contract.json](../data/phase2-notification-contract.json) | 8 | Requirements, case design, agreed contract or release scope data. |
| [data/phase2-plan.json](../data/phase2-plan.json) | 632 | Requirements, case design, agreed contract or release scope data. |
| [data/phase2-staff-mock-contract.json](../data/phase2-staff-mock-contract.json) | 9 | Requirements, case design, agreed contract or release scope data. |
| [data/release-final-checks-2026-11-04.json](../data/release-final-checks-2026-11-04.json) | 30 | Requirements, case design, agreed contract or release scope data. |
| [data/release-targeted-checks-2026-11-05.json](../data/release-targeted-checks-2026-11-05.json) | 2 | Requirements, case design, agreed contract or release scope data. |
| [data/release-verification-2026-10-30.json](../data/release-verification-2026-10-30.json) | 37 | Requirements, case design, agreed contract or release scope data. |
| [data/release-verification-2026-11-04.json](../data/release-verification-2026-11-04.json) | 133 | Requirements, case design, agreed contract or release scope data. |

### data/phase2-findings

| File | Lines | Responsibility |
| --- | ---: | --- |
| [data/phase2-findings/audit-logs.json](../data/phase2-findings/audit-logs.json) | 70 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/bills-payable.json](../data/phase2-findings/bills-payable.json) | 36 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/cash-register.json](../data/phase2-findings/cash-register.json) | 20 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/credit-notes.json](../data/phase2-findings/credit-notes.json) | 69 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/dashboard.json](../data/phase2-findings/dashboard.json) | 58 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/document-templates.json](../data/phase2-findings/document-templates.json) | 54 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/goods-receipts.json](../data/phase2-findings/goods-receipts.json) | 62 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/notifications.json](../data/phase2-findings/notifications.json) | 39 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/pos-extensions.json](../data/phase2-findings/pos-extensions.json) | 31 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/products-bulk.json](../data/phase2-findings/products-bulk.json) | 39 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/purchase-orders.json](../data/phase2-findings/purchase-orders.json) | 39 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/quotations.json](../data/phase2-findings/quotations.json) | 74 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/reports.json](../data/phase2-findings/reports.json) | 115 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/stock-counts.json](../data/phase2-findings/stock-counts.json) | 78 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/stock-transfers.json](../data/phase2-findings/stock-transfers.json) | 23 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/stores-lifecycle.json](../data/phase2-findings/stores-lifecycle.json) | 22 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/supplier-history.json](../data/phase2-findings/supplier-history.json) | 35 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |
| [data/phase2-findings/users-rbac.json](../data/phase2-findings/users-rbac.json) | 19 | Historical structured module tickets, corrections and acceptance limits; later release records can supersede status. |

### docs

| File | Lines | Responsibility |
| --- | ---: | --- |
| [docs/AUTOMATION-MAP.md](../docs/AUTOMATION-MAP.md) | 76 | Project specification, test design, traceability or historical validation. |
| [docs/COVERAGE.md](../docs/COVERAGE.md) | 182 | Project specification, test design, traceability or historical validation. |
| [docs/FEATURES.md](../docs/FEATURES.md) | 518 | Project specification, test design, traceability or historical validation. |
| [docs/GAPS.md](../docs/GAPS.md) | 20 | Project specification, test design, traceability or historical validation. |
| [docs/PHASE1-CASES.md](../docs/PHASE1-CASES.md) | 667 | Project specification, test design, traceability or historical validation. |
| [docs/TEST-COLLECTION.txt](../docs/TEST-COLLECTION.txt) | 105 | Project specification, test design, traceability or historical validation. |
| [docs/TEST-PLAN.md](../docs/TEST-PLAN.md) | 43 | Project specification, test design, traceability or historical validation. |
| [docs/VALIDATION.md](../docs/VALIDATION.md) | 15 | Project specification, test design, traceability or historical validation. |

### docs/phase2

| File | Lines | Responsibility |
| --- | ---: | --- |
| [docs/phase2/bugs/audit-logs.md](../docs/phase2/bugs/audit-logs.md) | 199 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/bills-payable.md](../docs/phase2/bugs/bills-payable.md) | 95 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/cash-register.md](../docs/phase2/bugs/cash-register.md) | 156 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/credit-notes.md](../docs/phase2/bugs/credit-notes.md) | 187 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/dashboard.md](../docs/phase2/bugs/dashboard.md) | 253 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/document-templates.md](../docs/phase2/bugs/document-templates.md) | 148 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/goods-receipts.md](../docs/phase2/bugs/goods-receipts.md) | 156 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/notifications.md](../docs/phase2/bugs/notifications.md) | 102 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/pos-extensions.md](../docs/phase2/bugs/pos-extensions.md) | 147 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/products-bulk.md](../docs/phase2/bugs/products-bulk.md) | 150 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/purchase-orders.md](../docs/phase2/bugs/purchase-orders.md) | 103 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/quotations.md](../docs/phase2/bugs/quotations.md) | 189 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/reports.md](../docs/phase2/bugs/reports.md) | 337 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/stock-counts.md](../docs/phase2/bugs/stock-counts.md) | 204 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/stock-transfers.md](../docs/phase2/bugs/stock-transfers.md) | 53 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/stores-lifecycle.md](../docs/phase2/bugs/stores-lifecycle.md) | 55 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/supplier-history.md](../docs/phase2/bugs/supplier-history.md) | 98 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/bugs/users-rbac.md](../docs/phase2/bugs/users-rbac.md) | 55 | Reviewed original Phase 2 findings, evidence, corrections and limits. |
| [docs/phase2/SUMMARY.md](../docs/phase2/SUMMARY.md) | 52 | Project specification, test design, traceability or historical validation. |
| [docs/phase2/WORK-LOG.md](../docs/phase2/WORK-LOG.md) | 65 | Project specification, test design, traceability or historical validation. |

### docs/release-verification-2026-10-24.json

| File | Lines | Responsibility |
| --- | ---: | --- |
| [docs/release-verification-2026-10-24.json](../docs/release-verification-2026-10-24.json) | 137 | Dated release verdict, detailed findings or policy clarification. |

### docs/release-verification-2026-11-04

| File | Lines | Responsibility |
| --- | ---: | --- |
| [docs/release-verification-2026-11-04/bugs/additional-debit-document.md](../docs/release-verification-2026-11-04/bugs/additional-debit-document.md) | 45 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-04/bugs/phase1-invoice-pdf.md](../docs/release-verification-2026-11-04/bugs/phase1-invoice-pdf.md) | 46 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-04/bugs/phase1-variant-dialog.md](../docs/release-verification-2026-11-04/bugs/phase1-variant-dialog.md) | 46 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-04/bugs/phase2-document-templates.md](../docs/release-verification-2026-11-04/bugs/phase2-document-templates.md) | 45 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-04/bugs/phase2-quotations.md](../docs/release-verification-2026-11-04/bugs/phase2-quotations.md) | 46 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-04/observations.md](../docs/release-verification-2026-11-04/observations.md) | 8 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-04/README.md](../docs/release-verification-2026-11-04/README.md) | 95 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-04/remaining-bugs.md](../docs/release-verification-2026-11-04/remaining-bugs.md) | 228 | Dated release verdict, detailed findings or policy clarification. |

### docs/release-verification-2026-11-05

| File | Lines | Responsibility |
| --- | ---: | --- |
| [docs/release-verification-2026-11-05/README.md](../docs/release-verification-2026-11-05/README.md) | 30 | Dated release verdict, detailed findings or policy clarification. |
| [docs/release-verification-2026-11-05/remaining-bugs.md](../docs/release-verification-2026-11-05/remaining-bugs.md) | 234 | Dated release verdict, detailed findings or policy clarification. |

### helpers

| File | Lines | Responsibility |
| --- | ---: | --- |
| [helpers/api.ts](../helpers/api.ts) | 33 | Original authenticated API client, envelope/status checks and write scope validation. |
| [helpers/help-safety.mjs](../helpers/help-safety.mjs) | 30 | Help request allowance, labelled build metadata parsing and result classification. |
| [helpers/phase2-assessment.mjs](../helpers/phase2-assessment.mjs) | 29 | Separates mocks, bugs, blockers and unreviewed flow/transport/cleanup errors. |
| [helpers/safety.mjs](../helpers/safety.mjs) | 35 | Origin/protocol, disposable-business, write-opt-in, production UI exceptions and /app path validation. |
| [helpers/security-safety.mjs](../helpers/security-safety.mjs) | 26 | HTTPS QA target validation and credential/session request boundary. |
| [helpers/settings-baseline.mjs](../helpers/settings-baseline.mjs) | 15 | Allows only the specifically approved QA BRN baseline adoption. |
| [helpers/settings-safety.mjs](../helpers/settings-safety.mjs) | 43 | Scoped Settings bulk-payload checks; preserves unrelated captured fields. |
| [helpers/ui.ts](../helpers/ui.ts) | 17 | Original anonymous read-only browser fixture; blocks mutations and unknown origins. |

Declarations and reusable entry points:

- `helpers/api.ts`
  - Exports: `required`, `api`, `rows`.
- `helpers/help-safety.mjs`
  - Exports: `helpRequestAllowed`, `readBuildMetadata`, `helpResultCategory`.
- `helpers/phase2-assessment.mjs`
  - Exports: `classifyPhase2Result`, `isUnreviewedFlowError`, `needsFailureReview`.
- `helpers/safety.mjs`
  - Exports: `validateTarget`, `validateOnboardingTarget`, `validateProductTestTarget`, `appPath`.
- `helpers/security-safety.mjs`
  - Exports: `validateSecurityTarget`, `securityRequestAllowed`.
- `helpers/settings-baseline.mjs`
  - Exports: `acceptApprovedQaBrn`.
- `helpers/settings-safety.mjs`
  - Exports: `settingsRequestAllowed`.
- `helpers/ui.ts`
  - Exports: `test`.

### scripts

| File | Lines | Responsibility |
| --- | ---: | --- |
| [scripts/assess-help-run.mjs](../scripts/assess-help-run.mjs) | 33 | Classifies one Help run into application failures, prerequisites and review-required cases. |
| [scripts/assess-phase1-round2.mjs](../scripts/assess-phase1-round2.mjs) | 65 | Composes the latest executed Phase 1 Round 2 cases and original four-ticket verdicts. |
| [scripts/assess-phase2.mjs](../scripts/assess-phase2.mjs) | 36 | Combines completed module attempts using the latest project/file/title result and reviewed classifications. |
| [scripts/assess-release-fixes.mjs](../scripts/assess-release-fixes.mjs) | 74 | Builds the broad 4 November release register from scoped Phase 1/2 cases and recovery state. |
| [scripts/build-phase1-round2-summary.py](../scripts/build-phase1-round2-summary.py) | 56 | Produces the concise Phase 1 Round 2 PDF. |
| [scripts/build-release-fix-summary.py](../scripts/build-release-fix-summary.py) | 44 | Produces the concise 4 November release PDF. |
| [scripts/build-release-verification.py](../scripts/build-release-verification.py) | 191 | Produces the 24 October release report from its verification register. |
| [scripts/diagnose-invoice-pdf.mjs](../scripts/diagnose-invoice-pdf.mjs) | 36 | Scoped invoice export/settings diagnostic; not a generic read-only utility. |
| [scripts/diagnose-settings-save.mjs](../scripts/diagnose-settings-save.mjs) | 27 | Settings-save diagnostic using the guarded QA fixture. |
| [scripts/discover-phase2.mjs](../scripts/discover-phase2.mjs) | 61 | Inspects Phase 2 routes/UI/contracts and saves discovery evidence. |
| [scripts/discover-release-surface.mjs](../scripts/discover-release-surface.mjs) | 38 | Inspects deployed release controls and saves discovery evidence. |
| [scripts/inspect-phase2-pdf.py](../scripts/inspect-phase2-pdf.py) | 11 | Extracts PDF text/page sizes for test assertions. |
| [scripts/inspect-qa-invoice.mjs](../scripts/inspect-qa-invoice.mjs) | 18 | Inspects an existing QA invoice. |
| [scripts/inspect-release-ar.mjs](../scripts/inspect-release-ar.mjs) | 27 | Inspects release customer AR surfaces. |
| [scripts/inspect-release-settings.mjs](../scripts/inspect-release-settings.mjs) | 19 | Inspects the deployed release settings surface. |
| [scripts/inspect-round2-deployment.mjs](../scripts/inspect-round2-deployment.mjs) | 25 | Records public production frontend fingerprint for Round 2. |
| [scripts/inspect-round2-invoice.mjs](../scripts/inspect-round2-invoice.mjs) | 29 | Inspects the saved Round 2 invoice/PDF evidence. |
| [scripts/phase2-combined-bugs.mjs](../scripts/phase2-combined-bugs.mjs) | 55 | Builds consolidated Phase 2 Markdown from reviewed module findings. |
| [scripts/phase2-report-markdown.mjs](../scripts/phase2-report-markdown.mjs) | 29 | Builds one detailed Phase 2 module report from finding metadata and assessment. |
| [scripts/phase2-summary.mjs](../scripts/phase2-summary.mjs) | 34 | Builds the original Phase 2 summary/coverage representation. |
| [scripts/read-release-client.mjs](../scripts/read-release-client.mjs) | 8 | Reads the downloaded deployed client to inspect observed release contracts. |
| [scripts/run-phase2.mjs](../scripts/run-phase2.mjs) | 24 | Allocates a new module attempt directory, invokes Playwright and archives execution/log/journal. |
| [scripts/run-release-followups.mjs](../scripts/run-release-followups.mjs) | 46 | Runs the selected release jobs serially, optionally rerunning automation-review cases. |
| [scripts/run-release-retest.mjs](../scripts/run-release-retest.mjs) | 53 | Runs a scoped Phase 1 release module with isolated JSON/JUnit/HTML artifacts. |
| [scripts/run-round2-retest.mjs](../scripts/run-round2-retest.mjs) | 36 | Serial Phase 2 campaign runner with manifest/resume/stop and cleanup checks; default dated archive is historical. |
| [scripts/verify-release-pdf.py](../scripts/verify-release-pdf.py) | 39 | Inspects generated release-PDF content/layout properties. |

### tests/phase1/auth

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/auth/onboarding-process.ui.spec.ts](../tests/phase1/auth/onboarding-process.ui.spec.ts) | 110 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase1/auth/onboarding-process.ui.spec.ts`
  - Case: Onboarding process @phase1 @auth @write

### tests/phase1/customers

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/customers/add-customer.ui.spec.ts](../tests/phase1/customers/add-customer.ui.spec.ts) | 53 | Independent UI requirements/regression scenarios. |
| [tests/phase1/customers/customers-auth.setup.ts](../tests/phase1/customers/customers-auth.setup.ts) | 23 | Module authentication and fixture/baseline setup. |
| [tests/phase1/customers/customers-cleanup.teardown.ts](../tests/phase1/customers/customers-cleanup.teardown.ts) | 23 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/customers/customers-full-flow.ui.spec.ts](../tests/phase1/customers/customers-full-flow.ui.spec.ts) | 43 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/customers/edit-archive-customer.ui.spec.ts](../tests/phase1/customers/edit-archive-customer.ui.spec.ts) | 55 | Independent UI requirements/regression scenarios. |
| [tests/phase1/customers/outstanding-balances-statements.ui.spec.ts](../tests/phase1/customers/outstanding-balances-statements.ui.spec.ts) | 58 | Independent UI requirements/regression scenarios. |
| [tests/phase1/customers/purchase-history.ui.spec.ts](../tests/phase1/customers/purchase-history.ui.spec.ts) | 48 | Independent UI requirements/regression scenarios. |
| [tests/phase1/customers/README.md](../tests/phase1/customers/README.md) | 69 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/customers/support/customers.ts](../tests/phase1/customers/support/customers.ts) | 253 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase1/customers/add-customer.ui.spec.ts`
  - Case: @phase1 F19-a create ${type} and reopen identity/contact/address
  - Case: @phase1 F19-a corporate BRN and VAT identifiers are separate persisted fields
  - Case: @phase1 F19-a missing name and malformed email are rejected
  - Case: @phase1 F19-a cancelling customer creation creates no record
- `tests/phase1/customers/customers-auth.setup.ts`
  - Case: authenticate Customers suite and select disposable company
- `tests/phase1/customers/customers-cleanup.teardown.ts`
  - Case: retain synthetic customers inactive without deleting history
- `tests/phase1/customers/customers-full-flow.ui.spec.ts`
  - Case: @phase1 @full-flow Customers and AR create edit history balances archive lifecycle
- `tests/phase1/customers/edit-archive-customer.ui.spec.ts`
  - Case: @phase1 F19-b update customer identity contact address and type
  - Case: @phase1 F19-b clear optional company phone and address
  - Case: @phase1 F19-b retain inactive customer filter and reactivate
  - Case: @phase1 F19-b inactive customer is not offered for a new invoice
  - Case: @phase1 F19-b later-sorting active customer remains selectable for billing
  - Case: @phase1 F19-b inactive customer retains its historical draft invoice
- `tests/phase1/customers/outstanding-balances-statements.ui.spec.ts`
  - Case: @phase1 F19-c customer-specific outstanding balance
  - Case: @phase1 F19-c empty profile export or named statement has an explicit empty state
  - Case: @phase1 F19-c aging buckets are available for the customer
  - Case: @phase1 F19-c reconcile independently seeded invoice payment and overdue balances
- `tests/phase1/customers/purchase-history.ui.spec.ts`
  - Case: @phase1 F19-d fresh customer has no purchase history or spend
  - Case: @phase1 F19-d saved invoice history is scoped to its customer
  - Case: @phase1 F19-d existing QA POS receipt appears in customer history
  - Case: @phase1 F19-d saved QA quotation appears in customer history
- `tests/phase1/customers/support/customers.ts`
  - Exports: `required`, `companyName`, `journalPath`, `journal`, `track`, `uniqueCustomer`, `main`, `route`, `openCustomers`, `customerRow`, `searchCustomer`, `choose`, `newCustomer`, `fields`, `fillCustomer`, `expectFields`, `submit`, `createCustomer`, `menu`, `editCustomer`, `saveCustomer`, `openProfile`, `setStatus`, `cleanupCustomer`, `invoicePicker`, `draftInvoice`, `draftQuotation`, `brn`, `vat`, `statementControl`, `agingLabel`, `expectAR`, `expectHistorySources`, `test`.

### tests/phase1/hardware

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/hardware/barcode-scanner-compatibility.ui.spec.ts](../tests/phase1/hardware/barcode-scanner-compatibility.ui.spec.ts) | 86 | Independent UI requirements/regression scenarios. |
| [tests/phase1/hardware/browser-thermal-printing.ui.spec.ts](../tests/phase1/hardware/browser-thermal-printing.ui.spec.ts) | 23 | Independent UI requirements/regression scenarios. |
| [tests/phase1/hardware/hardware-auth.setup.ts](../tests/phase1/hardware/hardware-auth.setup.ts) | 19 | Module authentication and fixture/baseline setup. |
| [tests/phase1/hardware/hardware-cleanup.teardown.ts](../tests/phase1/hardware/hardware-cleanup.teardown.ts) | 31 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/hardware/hardware-full-flow.ui.spec.ts](../tests/phase1/hardware/hardware-full-flow.ui.spec.ts) | 35 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/hardware/README.md](../tests/phase1/hardware/README.md) | 112 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/hardware/support/hardware.ts](../tests/phase1/hardware/support/hardware.ts) | 226 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase1/hardware/barcode-scanner-compatibility.ui.spec.ts`
  - Case: @phase1 @hardware F27-b keyboard HID emulation ${delay}ms key cadence retains leading zeros and adds one unit
  - Case: @phase1 @hardware F27-b repeated confirmed scan bursts merge to exactly three units
  - Case: @phase1 @hardware F27-b unknown barcode leaves the order empty
  - Case: @phase1 @hardware F27-b Scan action focuses the scanner input
  - Case: @phase1 @hardware F27-b manual keyboard search remains usable after a scanner input
  - Case: @phase1 @hardware F27-b manual product click calibration opens customization with one unit
  - Case: @phase1 @hardware F27-b real USB and Bluetooth devices need physical acceptance evidence
- `tests/phase1/hardware/browser-thermal-printing.ui.spec.ts`
  - Case: @phase1 @hardware F27-a select ${width} paper and render sample receipt preview without saving
  - Case: @phase1 @hardware F27-a unsaved width edits do not change persisted receipt configuration
  - Case: @phase1 @hardware F27-a existing QA receipt requests browser printing exactly once
  - Case: @phase1 @hardware F27-a actual 58mm 80mm native-dialog and paper acceptance needs hardware evidence
- `tests/phase1/hardware/hardware-auth.setup.ts`
  - Case: authenticate Hardware suite and discover existing read-only QA fixtures
- `tests/phase1/hardware/hardware-cleanup.teardown.ts`
  - Case: verify unchanged configuration and stock no application writes then log out
- `tests/phase1/hardware/hardware-full-flow.ui.spec.ts`
  - Case: @phase1 @hardware @full-flow Hardware paper widths HID scans existing receipt print and baseline verification
- `tests/phase1/hardware/support/hardware.ts`
  - Exports: `journalPath`, `fixturePath`, `authPath`, `required`, `companyName`, `main`, `companyButton`, `route`, `record`, `guard`, `signIn`, `logout`, `fixtureData`, `scannerFixture`, `receiptSettings`, `receiptState`, `paperPreview`, `search`, `cart`, `tile`, `line`, `openPOS`, `confirmCustomization`, `scan`, `discoverScanner`, `openHistory`, `printExistingReceipt`, `physicalEvidence`, `test`.

### tests/phase1/help

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/help/help-auth.setup.ts](../tests/phase1/help/help-auth.setup.ts) | 10 | Module authentication and fixture/baseline setup. |
| [tests/phase1/help/help-cleanup.teardown.ts](../tests/phase1/help/help-cleanup.teardown.ts) | 20 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/help/help-full-flow.ui.spec.ts](../tests/phase1/help/help-full-flow.ui.spec.ts) | 26 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/help/privacy-policy.ui.spec.ts](../tests/phase1/help/privacy-policy.ui.spec.ts) | 11 | Independent UI requirements/regression scenarios. |
| [tests/phase1/help/README.md](../tests/phase1/help/README.md) | 57 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/help/support/help.ts](../tests/phase1/help/support/help.ts) | 195 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase1/help/system-version-build.ui.spec.ts](../tests/phase1/help/system-version-build.ui.spec.ts) | 11 | Independent UI requirements/regression scenarios. |
| [tests/phase1/help/terms-of-service.ui.spec.ts](../tests/phase1/help/terms-of-service.ui.spec.ts) | 11 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase1/help/help-auth.setup.ts`
  - Case: authenticate Help suite and select disposable QA company
- `tests/phase1/help/help-cleanup.teardown.ts`
  - Case: verify read-only Help journal and end QA session
- `tests/phase1/help/help-full-flow.ui.spec.ts`
  - Case: Help Center is reachable from app navigation without altering the QA company @phase1 @help
  - Case: Help Center Legal and Compliance integrated flow @phase1 @help @full-flow
- `tests/phase1/help/privacy-policy.ui.spec.ts`
  - Case: F30-b public Privacy opens without submitting login @phase1 @help
  - Case: F30-b Privacy supports mobile keyboard access and document focus return @phase1 @help
  - Case: F30-b platform Privacy is accessible from authenticated Help Center @phase1 @help
- `tests/phase1/help/support/help.ts`
  - Exports: `authPath`, `journalPath`, `delivery`, `required`, `company`, `main`, `legalTitle`, `entry`, `record`, `prerequisite`, `guard`, `qaHeader`, `verifyCompany`, `signIn`, `openHelp`, `openAdvanced`, `screenshot`, `anonymous`, `openDocument`, `publicLegal`, `inAppLegal`, `buildMetadata`, `logout`, `test`.
- `tests/phase1/help/system-version-build.ui.spec.ts`
  - Case: F30-c public login displays NexStock copyright and year @phase1 @help
  - Case: F30-c active platform version and commit are visible @phase1 @help
- `tests/phase1/help/terms-of-service.ui.spec.ts`
  - Case: F30-a public Terms opens without submitting login @phase1 @help
  - Case: F30-a Terms supports mobile keyboard access and document focus return @phase1 @help
  - Case: F30-a platform Terms is accessible from authenticated Help Center @phase1 @help

### tests/phase1/invoicing

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/invoicing/branded-pdf-print.ui.spec.ts](../tests/phase1/invoicing/branded-pdf-print.ui.spec.ts) | 51 | Independent UI requirements/regression scenarios. |
| [tests/phase1/invoicing/create-tax-invoice.ui.spec.ts](../tests/phase1/invoicing/create-tax-invoice.ui.spec.ts) | 68 | Independent UI requirements/regression scenarios. |
| [tests/phase1/invoicing/due-dates-payment-terms.ui.spec.ts](../tests/phase1/invoicing/due-dates-payment-terms.ui.spec.ts) | 31 | Independent UI requirements/regression scenarios. |
| [tests/phase1/invoicing/installment-partial-payments.ui.spec.ts](../tests/phase1/invoicing/installment-partial-payments.ui.spec.ts) | 35 | Independent UI requirements/regression scenarios. |
| [tests/phase1/invoicing/invoice-lifecycle.ui.spec.ts](../tests/phase1/invoicing/invoice-lifecycle.ui.spec.ts) | 40 | Independent UI requirements/regression scenarios. |
| [tests/phase1/invoicing/invoicing-auth.setup.ts](../tests/phase1/invoicing/invoicing-auth.setup.ts) | 85 | Module authentication and fixture/baseline setup. |
| [tests/phase1/invoicing/invoicing-cleanup.teardown.ts](../tests/phase1/invoicing/invoicing-cleanup.teardown.ts) | 39 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/invoicing/invoicing-full-flow.ui.spec.ts](../tests/phase1/invoicing/invoicing-full-flow.ui.spec.ts) | 39 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/invoicing/README.md](../tests/phase1/invoicing/README.md) | 78 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/invoicing/release-accounts-receivable.ui.spec.ts](../tests/phase1/invoicing/release-accounts-receivable.ui.spec.ts) | 78 | Independent UI requirements/regression scenarios. |
| [tests/phase1/invoicing/release-quotations.ui.spec.ts](../tests/phase1/invoicing/release-quotations.ui.spec.ts) | 29 | Independent UI requirements/regression scenarios. |
| [tests/phase1/invoicing/support/inspect_invoice_pdf.py](../tests/phase1/invoicing/support/inspect_invoice_pdf.py) | 18 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase1/invoicing/support/invoicing.ts](../tests/phase1/invoicing/support/invoicing.ts) | 186 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase1/invoicing/support/pdf.ts](../tests/phase1/invoicing/support/pdf.ts) | 81 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase1/invoicing/branded-pdf-print.ui.spec.ts`
  - Case: can clear previously saved invoice header and payment instructions @phase1 @invoicing
  - Case: exports a valid PDF matching the saved invoice identity and amounts @phase1 @invoicing
  - Case: includes configured banking instructions and payment notes in the exported PDF @phase1 @invoicing
  - Case: invokes browser printing for a saved invoice without a physical print job @phase1 @invoicing
- `tests/phase1/invoicing/create-tax-invoice.ui.spec.ts`
  - Case: builds two units at 100 and recalculates quantity, price and cart discount @phase1 @invoicing
  - Case: requires a customer before saving @phase1 @invoicing
  - Case: requires invoice items before saving @phase1 @invoicing
  - Case: requires a due date before saving @phase1 @invoicing
  - Case: persists a draft with its fiscal reference, customer and total after reload @phase1 @invoicing
  - Case: supports customer BRN for fiscal invoice identity @phase1 @invoicing
  - Case: persists a paid invoice using record-only Mark Paid and Save @phase1 @invoicing
  - Case: calculates 15 percent VAT and persists the taxable total @phase1 @invoicing
- `tests/phase1/invoicing/due-dates-payment-terms.ui.spec.ts`
  - Case: calculates ${term} across a month boundary @phase1 @invoicing
  - Case: persists a manually selected due date @phase1 @invoicing
  - Case: rejects a due date earlier than the issue date @phase1 @invoicing
- `tests/phase1/invoicing/installment-partial-payments.ui.spec.ts`
  - Case: retains a 50 deposit and settles the remaining 150 after reload @phase1 @invoicing
  - Case: rejects invalid installment ${amount} on a 200 invoice @phase1 @invoicing
- `tests/phase1/invoicing/invoice-lifecycle.ui.spec.ts`
  - Case: progresses draft to unpaid, partially paid and paid @phase1 @invoicing
  - Case: cancels a draft while preserving its invoice reference @phase1 @invoicing
  - Case: marks an issued unpaid invoice overdue using persisted past dates @phase1 @invoicing
  - Case: allocates increasing references and never reuses a cancelled number @phase1 @invoicing
- `tests/phase1/invoicing/invoicing-auth.setup.ts`
  - Case: authenticate and prepare disposable invoice fixtures
- `tests/phase1/invoicing/invoicing-cleanup.teardown.ts`
  - Case: restore invoice QA stock and company VAT settings
- `tests/phase1/invoicing/invoicing-full-flow.ui.spec.ts`
  - Case: creates a Net 30 tax invoice, issues, part-pays, settles and exports/prints @phase1 @invoicing @full-flow
- `tests/phase1/invoicing/release-accounts-receivable.ui.spec.ts`
  - Case: release non-zero AR reconciles issued invoice payment aging statement CSV and print
- `tests/phase1/invoicing/release-quotations.ui.spec.ts`
  - Case: release quotation saves after reload and uses Valid Until rather than invoice Due Date
- `tests/phase1/invoicing/support/invoicing.ts`
  - Exports: `required`, `setting`, `fixturePath`, `fixtureData`, `money`, `main`, `route`, `datePlus`, `openInvoices`, `newInvoice`, `dates`, `fillDates`, `selectCustomer`, `addLine`, `prepareInvoice`, `expectGrandTotal`, `saveAction`, `references`, `persistInvoice`, `createInvoice`, `findInvoice`, `openInvoice`, `requireControl`, `issueInvoice`, `recordPayment`, `submitPayment`, `cancelInvoice`, `test`.
- `tests/phase1/invoicing/support/pdf.ts`
  - Exports: `exportPDF`, `withInvoiceBranding`.

### tests/phase1/pos

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/pos/barcode-search.ui.spec.ts](../tests/phase1/pos/barcode-search.ui.spec.ts) | 33 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/cart-operations.ui.spec.ts](../tests/phase1/pos/cart-operations.ui.spec.ts) | 60 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/change-calculator.ui.spec.ts](../tests/phase1/pos/change-calculator.ui.spec.ts) | 25 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/customer-linking.ui.spec.ts](../tests/phase1/pos/customer-linking.ui.spec.ts) | 30 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/discounts-promotions.ui.spec.ts](../tests/phase1/pos/discounts-promotions.ui.spec.ts) | 35 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/multi-tender-payments.ui.spec.ts](../tests/phase1/pos/multi-tender-payments.ui.spec.ts) | 37 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/pos-auth.setup.ts](../tests/phase1/pos/pos-auth.setup.ts) | 97 | Module authentication and fixture/baseline setup. |
| [tests/phase1/pos/pos-cleanup.teardown.ts](../tests/phase1/pos/pos-cleanup.teardown.ts) | 14 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/pos/pos-full-flow.ui.spec.ts](../tests/phase1/pos/pos-full-flow.ui.spec.ts) | 39 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/pos/README.md](../tests/phase1/pos/README.md) | 71 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/pos/release-catalogue-availability.ui.spec.ts](../tests/phase1/pos/release-catalogue-availability.ui.spec.ts) | 17 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/release-receipt-content.ui.spec.ts](../tests/phase1/pos/release-receipt-content.ui.spec.ts) | 68 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/release-service-sale.ui.spec.ts](../tests/phase1/pos/release-service-sale.ui.spec.ts) | 27 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/support/pos.ts](../tests/phase1/pos/support/pos.ts) | 154 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase1/pos/tax-engine.ui.spec.ts](../tests/phase1/pos/tax-engine.ui.spec.ts) | 23 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/thermal-receipt.ui.spec.ts](../tests/phase1/pos/thermal-receipt.ui.spec.ts) | 20 | Independent UI requirements/regression scenarios. |
| [tests/phase1/pos/visual-product-grid.ui.spec.ts](../tests/phase1/pos/visual-product-grid.ui.spec.ts) | 22 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase1/pos/barcode-search.ui.spec.ts`
  - Case: finds the correct product by SKU and product name @phase1 @pos
  - Case: one keyboard-wedge barcode scan adds exactly one unit @phase1 @pos
  - Case: unknown barcode does not add an unrelated product @phase1 @pos
- `tests/phase1/pos/cart-operations.ui.spec.ts`
  - Case: merges repeated items, changes quantity, removes the line and recalculates @phase1 @pos
  - Case: allows an administrator to override the unit selling price @phase1 @pos
  - Case: asks for confirmation before clearing and preserves cart on cancel @phase1 @pos
- `tests/phase1/pos/change-calculator.ui.spec.ts`
  - Case: calculates cash change of ${overpayment} @phase1 @pos
  - Case: prevents completing an underpaid cash sale @phase1 @pos
- `tests/phase1/pos/customer-linking.ui.spec.ts`
  - Case: starts a fresh order with the walk-in customer @phase1 @pos
  - Case: finds and links an existing customer to checkout @phase1 @pos
  - Case: offers customer quick-add from the POS customer picker @phase1 @pos
- `tests/phase1/pos/discounts-promotions.ui.spec.ts`
  - Case: recalculates an overall ${mode} discount @phase1 @pos
  - Case: supports independent line percentage and fixed discounts @phase1 @pos
  - Case: does not turn a negative discount into a surcharge @phase1 @pos
  - Case: rejects an excessive discount instead of creating a negative payable total @phase1 @pos
- `tests/phase1/pos/multi-tender-payments.ui.spec.ts`
  - Case: records a completed ${method} sale @phase1 @pos
  - Case: splits payment between card and cash and accounts for cash change @phase1 @pos
- `tests/phase1/pos/pos-auth.setup.ts`
  - Case: authenticate and prepare disposable POS fixtures
- `tests/phase1/pos/pos-cleanup.teardown.ts`
  - Case: restore QA stock after POS tests
- `tests/phase1/pos/pos-full-flow.ui.spec.ts`
  - Case: searches, builds an order, links a customer, discounts, checks out and reviews receipt @phase1 @pos @full-flow
- `tests/phase1/pos/release-catalogue-availability.ui.spec.ts`
  - Case: release POS finds a QA catalogue item beyond the first product page
- `tests/phase1/pos/release-receipt-content.ui.spec.ts`
  - Case: release till receipt prints branch header footer and inherited company VAT number
- `tests/phase1/pos/release-service-sale.ui.spec.ts`
  - Case: release service can be sold without inventory and retains No stock kept
- `tests/phase1/pos/support/pos.ts`
  - Exports: `setting`, `required`, `marker`, `fixtureData`, `money`, `observedPrintCalls`, `route`, `openPOS`, `cart`, `tile`, `line`, `quantityControl`, `addItem`, `total`, `expectTotal`, `discount`, `charge`, `tender`, `completeSale`, `selectCustomer`, `companyTax`, `setCompanyTax`, `withVAT`, `test`.
- `tests/phase1/pos/tax-engine.ui.spec.ts`
  - Case: calculates the configured 15 percent VAT and restores company settings @phase1 @pos
  - Case: offers tax exemption and recalculates the taxable order @phase1 @pos
- `tests/phase1/pos/thermal-receipt.ui.spec.ts`
  - Case: previews ${width} receipt content and invokes printing @phase1 @pos
- `tests/phase1/pos/visual-product-grid.ui.spec.ts`
  - Case: uses the catalog category for product tiles and category navigation @phase1 @pos
  - Case: marks out-of-stock tiles unavailable and keeps stocked items selectable @phase1 @pos

### tests/phase1/products

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/products/add-product.ui.spec.ts](../tests/phase1/products/add-product.ui.spec.ts) | 52 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/archive-product.ui.spec.ts](../tests/phase1/products/archive-product.ui.spec.ts) | 42 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/barcode-management.ui.spec.ts](../tests/phase1/products/barcode-management.ui.spec.ts) | 42 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/categories-organization.ui.spec.ts](../tests/phase1/products/categories-organization.ui.spec.ts) | 33 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/edit-product.ui.spec.ts](../tests/phase1/products/edit-product.ui.spec.ts) | 52 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/media-photography.ui.spec.ts](../tests/phase1/products/media-photography.ui.spec.ts) | 23 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/pricing-taxes.ui.spec.ts](../tests/phase1/products/pricing-taxes.ui.spec.ts) | 40 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/product-full-flow.ui.spec.ts](../tests/phase1/products/product-full-flow.ui.spec.ts) | 41 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/products/README.md](../tests/phase1/products/README.md) | 61 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/products/release-persistence.ui.spec.ts](../tests/phase1/products/release-persistence.ui.spec.ts) | 31 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/support/products.ts](../tests/phase1/products/support/products.ts) | 323 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase1/products/units-of-measure.ui.spec.ts](../tests/phase1/products/units-of-measure.ui.spec.ts) | 27 | Independent UI requirements/regression scenarios. |
| [tests/phase1/products/variants-attributes.ui.spec.ts](../tests/phase1/products/variants-attributes.ui.spec.ts) | 27 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase1/products/add-product.ui.spec.ts`
  - Case: creates a standard inventory product with catalog, pricing and barcode data @phase1 @products
  - Case: supports a separate wholesale price @phase1 @products
  - Case: creates a service or labour item without inventory tracking @phase1 @products
- `tests/phase1/products/archive-product.ui.spec.ts`
  - Case: archives a product and removes it from the active product list @phase1 @products
  - Case: preserves an archived product as a recoverable historical record @phase1 @products
- `tests/phase1/products/barcode-management.ui.spec.ts`
  - Case: accepts manual barcode entry and finds the product by exact barcode @phase1 @products
  - Case: scanner mode accepts keyboard-wedge barcode input @phase1 @products
- `tests/phase1/products/categories-organization.ui.spec.ts`
  - Case: creates a category and exposes it in the product form @phase1 @products
  - Case: supports multi-level parent and child category hierarchy @phase1 @products
  - Case: supports product tag grouping @phase1 @products
- `tests/phase1/products/edit-product.ui.spec.ts`
  - Case: updates product information, selling price and barcode @phase1 @products
  - Case: updates per-product VAT classification @phase1 @products
- `tests/phase1/products/media-photography.ui.spec.ts`
  - Case: uploads a product image and displays it in the product list @phase1 @products
- `tests/phase1/products/pricing-taxes.ui.spec.ts`
  - Case: persists product cost and standard selling price @phase1 @products
  - Case: supports company-rate Standard VAT, Zero-Rated and Exempt classifications per product @phase1 @products
  - Case: supports tax-inclusive and tax-exclusive product pricing @phase1 @products
- `tests/phase1/products/product-full-flow.ui.spec.ts`
  - Case: creates, enriches, finds, edits and archives a catalog product @phase1 @products @full-flow
- `tests/phase1/products/release-persistence.ui.spec.ts`
  - Case: release product description and barcode can be cleared after reload
  - Case: release product inclusive VAT override survives save and full navigation
- `tests/phase1/products/support/products.ts`
  - Exports: `required`, `setting`, `uniqueProduct`, `test`, `openProducts`, `openProductSettings`, `ensureCategory`, `ensureUnit`, `ensureCatalogFixtures`, `openNewProduct`, `fillBasicProduct`, `addVariantOption`, `enableVariants`, `populateGeneratedVariants`, `uploadProductImage`, `productRow`, `submitNewProduct`, `openEditProduct`, `saveEditedProduct`, `archiveProduct`.
- `tests/phase1/products/units-of-measure.ui.spec.ts`
  - Case: adds pieces, boxes, kg, meters and liters and exposes them to products @phase1 @products
- `tests/phase1/products/variants-attributes.ui.spec.ts`
  - Case: creates Size, Color and Material combinations with independent SKUs and prices @phase1 @products

### tests/phase1/security

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/security/password-reset-update.ui.spec.ts](../tests/phase1/security/password-reset-update.ui.spec.ts) | 59 | Independent UI requirements/regression scenarios. |
| [tests/phase1/security/README.md](../tests/phase1/security/README.md) | 91 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/security/secure-authentication-password-policies.ui.spec.ts](../tests/phase1/security/secure-authentication-password-policies.ui.spec.ts) | 196 | Independent UI requirements/regression scenarios. |
| [tests/phase1/security/security-auth.setup.ts](../tests/phase1/security/security-auth.setup.ts) | 11 | Module authentication and fixture/baseline setup. |
| [tests/phase1/security/security-cleanup.teardown.ts](../tests/phase1/security/security-cleanup.teardown.ts) | 17 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/security/security-full-flow.ui.spec.ts](../tests/phase1/security/security-full-flow.ui.spec.ts) | 37 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/security/session-inactivity-timeout.ui.spec.ts](../tests/phase1/security/session-inactivity-timeout.ui.spec.ts) | 31 | Independent UI requirements/regression scenarios. |
| [tests/phase1/security/support/security.ts](../tests/phase1/security/support/security.ts) | 244 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase1/security/password-reset-update.ui.spec.ts`
  - Case: @phase1 release SEC-004 removes unenforced company security controls
  - Case: @phase1 F24-b self-service reset form and return to login are accessible
  - Case: @phase1 F24-b empty and malformed reset emails are rejected without dispatch
  - Case: @phase1 F24-b password update controls are masked and remain untouched
  - Case: @phase1 F24-b self-service security profile belongs to the signed-in account
  - Case: @phase1 F24-b reset completion and update require isolated-account human handoff
- `tests/phase1/security/secure-authentication-password-policies.ui.spec.ts`
  - Case: @phase1 F24-a valid sign-in selects QA company survives refresh and protected deep link
  - Case: @phase1 F24-a anonymous protected UI and API are denied
  - Case: @phase1 F24-a empty login is rejected without authentication POST
  - Case: @phase1 F24-a malformed email is rejected locally
  - Case: @phase1 F24-a one wrong password is rejected by server without imposing new-password length on login
  - Case: @phase1 F24-a login password is masked and optional reveal can be reversed
  - Case: @phase1 F24-a login uses POST without credentials in URL or response password fields
  - Case: @phase1 F24-a logout blocks back reload and direct protected navigation
  - Case: @phase1 F24-a logout removes access from another tab in the same browser context
  - Case: @phase1 F24-a signup feedback ${example.label}
  - Case: @phase1 F24-a signup feedback requires lowercase and rejects uppercase-only candidate
  - Case: @phase1 F24-a signup communicates symbols as optional rather than mandatory
  - Case: @phase1 F24-a signup strength bar increases to strongest when symbol is added
  - Case: @phase1 F24-a backend bcrypt verification needs deployment-matched audit evidence
- `tests/phase1/security/security-auth.setup.ts`
  - Case: validate disposable security scope without rotating credentials
- `tests/phase1/security/security-cleanup.teardown.ts`
  - Case: verify unattended run did not attempt credential or policy changes
- `tests/phase1/security/security-full-flow.ui.spec.ts`
  - Case: @phase1 @full-flow Security authentication account recovery inactivity and logout lifecycle
- `tests/phase1/security/session-inactivity-timeout.ui.spec.ts`
  - Case: @phase1 F24-c read inactivity policy without changing security settings
  - Case: @phase1 F24-c obsolete Auto-logout control is removed
  - Case: @phase1 F24-c user security settings expose configurable inactivity PIN lock
  - Case: @phase1 F24-c user-provisioned PIN lock after 30 minutes with activity calibration and reload
- `tests/phase1/security/support/security.ts`
  - Exports: `required`, `companyName`, `journalPath`, `main`, `companyButton`, `notice`, `isApplicationPost`, `route`, `record`, `guardContext`, `openLogin`, `chooseCompany`, `signIn`, `openAccountMenu`, `logout`, `expectProtected`, `expectAnonymous`, `openSignup`, `publishedPolicy`, `checklist`, `openForgot`, `openProfile`, `readSecurityPolicy`, `agreedIdleMinutes`, `verifyIdle`, `pinPrompt`, `manualPasswordHandoff`, `test`.

### tests/phase1/settings

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/settings/company-profile-legal-identity.ui.spec.ts](../tests/phase1/settings/company-profile-legal-identity.ui.spec.ts) | 33 | Independent UI requirements/regression scenarios. |
| [tests/phase1/settings/currency-financial-formatting.ui.spec.ts](../tests/phase1/settings/currency-financial-formatting.ui.spec.ts) | 25 | Independent UI requirements/regression scenarios. |
| [tests/phase1/settings/fiscal-tax-settings.ui.spec.ts](../tests/phase1/settings/fiscal-tax-settings.ui.spec.ts) | 17 | Independent UI requirements/regression scenarios. |
| [tests/phase1/settings/multi-language-support.ui.spec.ts](../tests/phase1/settings/multi-language-support.ui.spec.ts) | 38 | Independent UI requirements/regression scenarios. |
| [tests/phase1/settings/README.md](../tests/phase1/settings/README.md) | 62 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/settings/release-persistence.ui.spec.ts](../tests/phase1/settings/release-persistence.ui.spec.ts) | 52 | Independent UI requirements/regression scenarios. |
| [tests/phase1/settings/settings-auth.setup.ts](../tests/phase1/settings/settings-auth.setup.ts) | 35 | Module authentication and fixture/baseline setup. |
| [tests/phase1/settings/settings-cleanup.teardown.ts](../tests/phase1/settings/settings-cleanup.teardown.ts) | 37 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/settings/settings-full-flow.ui.spec.ts](../tests/phase1/settings/settings-full-flow.ui.spec.ts) | 20 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/settings/support/flows.ts](../tests/phase1/settings/support/flows.ts) | 17 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase1/settings/support/settings.ts](../tests/phase1/settings/support/settings.ts) | 346 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase1/settings/theme-settings.ui.spec.ts](../tests/phase1/settings/theme-settings.ui.spec.ts) | 25 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase1/settings/company-profile-legal-identity.ui.spec.ts`
  - Case: F28-a saves company name contact and registered address then restores @phase1 @settings
  - Case: F28-a saves company email after reload @phase1 @settings
  - Case: F28-a saves independent BRN and Tax ID fields without changing tax registration @phase1 @settings
  - Case: F28-a exposes separate Tax ID and VAT number for a registered company @phase1 @settings
- `tests/phase1/settings/currency-financial-formatting.ui.spec.ts`
  - Case: F28-b MUR currency agrees between company and localization and persists @phase1 @settings
  - Case: F28-b QA two-decimal POS display places Rs before the amount @phase1 @settings
  - Case: F28-b Company settings exposes decimal display enable disable control @phase1 @settings
- `tests/phase1/settings/fiscal-tax-settings.ui.spec.ts`
  - Case: F28-c enables and persists default VAT 15 percent and POS reflects the rate @phase1 @settings
  - Case: F28-c disabling tax registration persists without deleting legal identity @phase1 @settings
  - Case: F28-c system settings expose tax inclusive exclusive pricing mode @phase1 @settings
- `tests/phase1/settings/multi-language-support.ui.spec.ts`
  - Case: F28-e switches English French and translates main navigation and settings @phase1 @settings
  - Case: F28-e French persists on save reload and route navigation @phase1 @settings
  - Case: F28-e French interface updates document language for assistive technology @phase1 @settings
  - Case: F28-e French company form labels contain translated text not raw keys @phase1 @settings
- `tests/phase1/settings/release-persistence.ui.spec.ts`
  - Case: release company website saves and optional Tax ID can be cleared
  - Case: release decimal display off and on persists and changes POS amount formatting
  - Case: release company inclusive VAT preference persists independently of registration
- `tests/phase1/settings/settings-auth.setup.ts`
  - Case: authenticate Settings suite select QA company and capture recoverable baseline
- `tests/phase1/settings/settings-cleanup.teardown.ts`
  - Case: restore original QA settings verify journal and log out
- `tests/phase1/settings/settings-full-flow.ui.spec.ts`
  - Case: System Settings and Localization integrated flow @phase1 @settings @full-flow
- `tests/phase1/settings/support/flows.ts`
  - Exports: `vat15`, `separateTaxAndVatFields`.
- `tests/phase1/settings/support/settings.ts`
  - Exports: `journalPath`, `authPath`, `baselinePath`, `required`, `company`, `main`, `apiSnapshot`, `record`, `baseline`, `saveBaseline`, `pending`, `migrateNewCompanyFields`, `guard`, `qaHeader`, `verifyCompany`, `route`, `signIn`, `reloadSettings`, `openTab`, `profileFields`, `decimalToggle`, `profileState`, `taxState`, `localizationState`, `screenshot`, `save`, `setProfile`, `setTax`, `choose`, `language`, `appearance`, `theme`, `restore`, `auditBaseline`, `adoptApprovedBrn`, `isolated`, `test`.
- `tests/phase1/settings/theme-settings.ui.spec.ts`
  - Case: F28-d ${dark ? 'dark' : 'light'} theme persists through reload and leaves forms usable @phase1 @settings
  - Case: F28-d exposes System Default appearance alongside light and dark @phase1 @settings

### tests/phase1/stock-adjustments

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/stock-adjustments/adjustments-auth.setup.ts](../tests/phase1/stock-adjustments/adjustments-auth.setup.ts) | 23 | Module authentication and fixture/baseline setup. |
| [tests/phase1/stock-adjustments/create-adjustment.ui.spec.ts](../tests/phase1/stock-adjustments/create-adjustment.ui.spec.ts) | 40 | Independent UI requirements/regression scenarios. |
| [tests/phase1/stock-adjustments/history-audit-trail.ui.spec.ts](../tests/phase1/stock-adjustments/history-audit-trail.ui.spec.ts) | 30 | Independent UI requirements/regression scenarios. |
| [tests/phase1/stock-adjustments/inventory-valuation.ui.spec.ts](../tests/phase1/stock-adjustments/inventory-valuation.ui.spec.ts) | 15 | Independent UI requirements/regression scenarios. |
| [tests/phase1/stock-adjustments/README.md](../tests/phase1/stock-adjustments/README.md) | 58 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/stock-adjustments/reason-code-tracking.ui.spec.ts](../tests/phase1/stock-adjustments/reason-code-tracking.ui.spec.ts) | 23 | Independent UI requirements/regression scenarios. |
| [tests/phase1/stock-adjustments/stock-adjustments-full-flow.ui.spec.ts](../tests/phase1/stock-adjustments/stock-adjustments-full-flow.ui.spec.ts) | 27 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/stock-adjustments/support/adjustments.ts](../tests/phase1/stock-adjustments/support/adjustments.ts) | 147 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase1/stock-adjustments/adjustments-auth.setup.ts`
  - Case: authenticate Stock Adjustments suite once
- `tests/phase1/stock-adjustments/create-adjustment.ui.spec.ts`
  - Case: applies positive and negative quantities and persists exact balances @phase1 @stock-adjustments
  - Case: rejects removal greater than available branch stock @phase1 @stock-adjustments
  - Case: rejects a zero quantity without creating history @phase1 @stock-adjustments
- `tests/phase1/stock-adjustments/history-audit-trail.ui.spec.ts`
  - Case: persists one completed history record with the correct user and timestamp @phase1 @stock-adjustments
  - Case: exposes product, signed quantity and before/after balances for an adjustment @phase1 @stock-adjustments
- `tests/phase1/stock-adjustments/inventory-valuation.ui.spec.ts`
  - Case: updates stock-on-hand value at cost after positive and negative adjustments @phase1 @stock-adjustments
- `tests/phase1/stock-adjustments/reason-code-tracking.ui.spec.ts`
  - Case: retains ${reason.toLowerCase()} as the adjustment reason @phase1 @stock-adjustments
  - Case: retains justification notes for later inspection @phase1 @stock-adjustments
- `tests/phase1/stock-adjustments/stock-adjustments-full-flow.ui.spec.ts`
  - Case: adds opening stock, records a loss, checks valuation and verifies audit evidence @phase1 @stock-adjustments @full-flow
- `tests/phase1/stock-adjustments/support/adjustments.ts`
  - Exports: `setting`, `required`, `uniqueReason`, `numeric`, `openRoute`, `openAdjustments`, `stock`, `productSnapshot`, `newAdjustment`, `historyRow`, `submitAdjustment`, `adjust`, `expectBalance`, `reloadHistory`, `inspectHistory`, `test`.

### tests/phase1/stores

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/stores/add-branch.ui.spec.ts](../tests/phase1/stores/add-branch.ui.spec.ts) | 63 | Independent UI requirements/regression scenarios. |
| [tests/phase1/stores/edit-branch-settings.ui.spec.ts](../tests/phase1/stores/edit-branch-settings.ui.spec.ts) | 52 | Independent UI requirements/regression scenarios. |
| [tests/phase1/stores/independent-stock-levels.ui.spec.ts](../tests/phase1/stores/independent-stock-levels.ui.spec.ts) | 84 | Independent UI requirements/regression scenarios. |
| [tests/phase1/stores/README.md](../tests/phase1/stores/README.md) | 36 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/stores/stores-auth.setup.ts](../tests/phase1/stores/stores-auth.setup.ts) | 36 | Module authentication and fixture/baseline setup. |
| [tests/phase1/stores/stores-full-flow.ui.spec.ts](../tests/phase1/stores/stores-full-flow.ui.spec.ts) | 23 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/stores/support/stores.ts](../tests/phase1/stores/support/stores.ts) | 226 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase1/stores/add-branch.ui.spec.ts`
  - Case: creates a branch with code, type, address and contact details @phase1 @stores
  - Case: captures branch tax registration details @phase1 @stores
  - Case: offers retail store, warehouse and workshop branch types @phase1 @stores
- `tests/phase1/stores/edit-branch-settings.ui.spec.ts`
  - Case: updates branch contact information and address @phase1 @stores
  - Case: updates branch receipt header details @phase1 @stores
  - Case: assigns registers to a branch @phase1 @stores
- `tests/phase1/stores/independent-stock-levels.ui.spec.ts`
  - Case: shows separate stock columns and branch-specific inventory views @phase1 @stores
  - Case: adjusting stock in one branch leaves the other branch unchanged @phase1 @stores
- `tests/phase1/stores/stores-auth.setup.ts`
  - Case: authenticate Stores suite once
- `tests/phase1/stores/stores-full-flow.ui.spec.ts`
  - Case: creates, edits and inspects branch inventory @phase1 @stores @full-flow
- `tests/phase1/stores/support/stores.ts`
  - Exports: `required`, `setting`, `uniqueStore`, `test`, `openStores`, `openStockAdjustments`, `createStockAdjustment`, `openNewStore`, `fillStore`, `storeCard`, `existingStore`, `findOrCreateStore`, `submitNewStore`, `createStore`, `openEditStore`, `saveEditedStore`, `viewStoreInventory`.

### tests/phase1/suppliers

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase1/suppliers/add-supplier.ui.spec.ts](../tests/phase1/suppliers/add-supplier.ui.spec.ts) | 63 | Independent UI requirements/regression scenarios. |
| [tests/phase1/suppliers/credit-terms-payment-conditions.ui.spec.ts](../tests/phase1/suppliers/credit-terms-payment-conditions.ui.spec.ts) | 60 | Independent UI requirements/regression scenarios. |
| [tests/phase1/suppliers/edit-deactivate-supplier.ui.spec.ts](../tests/phase1/suppliers/edit-deactivate-supplier.ui.spec.ts) | 65 | Independent UI requirements/regression scenarios. |
| [tests/phase1/suppliers/README.md](../tests/phase1/suppliers/README.md) | 71 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase1/suppliers/release-vendor-availability.ui.spec.ts](../tests/phase1/suppliers/release-vendor-availability.ui.spec.ts) | 15 | Independent UI requirements/regression scenarios. |
| [tests/phase1/suppliers/suppliers-auth.setup.ts](../tests/phase1/suppliers/suppliers-auth.setup.ts) | 23 | Module authentication and fixture/baseline setup. |
| [tests/phase1/suppliers/suppliers-cleanup.teardown.ts](../tests/phase1/suppliers/suppliers-cleanup.teardown.ts) | 18 | Module restoration/recovery, scope verification and session cleanup. |
| [tests/phase1/suppliers/suppliers-full-flow.ui.spec.ts](../tests/phase1/suppliers/suppliers-full-flow.ui.spec.ts) | 45 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase1/suppliers/support/suppliers.ts](../tests/phase1/suppliers/support/suppliers.ts) | 261 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase1/suppliers/add-supplier.ui.spec.ts`
  - Case: stores optional BRN separately from Tax ID on creation @phase1 @suppliers
  - Case: persists company, contact, identifier, address and commercial details @phase1 @suppliers
  - Case: supports name-only creation as advertised by the form @phase1 @suppliers
  - Case: rejects a missing supplier name @phase1 @suppliers
  - Case: rejects a malformed email before creating a supplier @phase1 @suppliers
  - Case: cancel leaves no new supplier record @phase1 @suppliers
- `tests/phase1/suppliers/credit-terms-payment-conditions.ui.spec.ts`
  - Case: persists Net ${days} and its allowed credit period @phase1 @suppliers
  - Case: persists a credit limit when adding a supplier @phase1 @suppliers
  - Case: persists an edited supplier credit limit @phase1 @suppliers
  - Case: observes negative credit days without assuming configured terms equal overdue days @phase1 @suppliers
- `tests/phase1/suppliers/edit-deactivate-supplier.ui.spec.ts`
  - Case: edits and clears optional BRN independently of Tax ID @phase1 @suppliers
  - Case: updates name, contact, fiscal identifier and address after reload @phase1 @suppliers
  - Case: clears optional contact and address fields without restoring stale values @phase1 @suppliers
  - Case: deactivates without deleting identity and respects status filters @phase1 @suppliers
  - Case: reactivates the same supplier identity rather than creating a duplicate @phase1 @suppliers
- `tests/phase1/suppliers/release-vendor-availability.ui.spec.ts`
  - Case: release purchase-order vendor picker excludes inactive supplier with an active positive control
- `tests/phase1/suppliers/suppliers-auth.setup.ts`
  - Case: authenticate Suppliers suite and select disposable company
- `tests/phase1/suppliers/suppliers-cleanup.teardown.ts`
  - Case: verify newly created QA suppliers are retained inactive
- `tests/phase1/suppliers/suppliers-full-flow.ui.spec.ts`
  - Case: creates, edits, configures commercial terms, selects and deactivates a vendor @phase1 @suppliers @full-flow
- `tests/phase1/suppliers/support/suppliers.ts`
  - Exports: `required`, `setting`, `companyName`, `journalPath`, `journal`, `track`, `uniqueSupplier`, `main`, `openSuppliers`, `supplierRow`, `searchSupplier`, `newSupplier`, `textFields`, `fillSupplier`, `createSupplier`, `actionMenu`, `editSupplier`, `saveSupplier`, `expectSupplierFields`, `setStatus`, `filterStatus`, `openSupplierPicker`, `creditLimit`, `brnField`, `submitAndObserveValidation`, `cleanupSupplier`, `test`.

### tests/phase2/audit-logs

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/audit-logs/activity-stream.ui.spec.ts](../tests/phase2/audit-logs/activity-stream.ui.spec.ts) | 6 | Independent UI requirements/regression scenarios. |
| [tests/phase2/audit-logs/audit-logs-full-flow.ui.spec.ts](../tests/phase2/audit-logs/audit-logs-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/audit-logs/filter-search.ui.spec.ts](../tests/phase2/audit-logs/filter-search.ui.spec.ts) | 6 | Independent UI requirements/regression scenarios. |
| [tests/phase2/audit-logs/README.md](../tests/phase2/audit-logs/README.md) | 8 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/audit-logs/support/audit.ts](../tests/phase2/audit-logs/support/audit.ts) | 61 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/audit-logs/activity-stream.ui.spec.ts`
  - Case: F25-a audit record creation with actor module timestamp and QA reference
  - Case: F25-a audit record modification in an isolated QA writer window
  - Case: F25-a audit deletion of a newly owned unused unpaid QA bill
  - Case: F25-a log a real standard product CSV export operation
- `tests/phase2/audit-logs/audit-logs-full-flow.ui.spec.ts`
  - Case: QA creation modification deletion export and fresh audit full flow @full-flow
- `tests/phase2/audit-logs/filter-search.ui.spec.ts`
  - Case: F25-b Products module filter returns matching persisted entries
  - Case: F25-b user text search returns matching persisted audit entries
  - Case: F25-b user module and action-type filter controls
  - Case: F25-b explicit custom date range filtering
- `tests/phase2/audit-logs/support/audit.ts`
  - Exports: `auditScenario`.

### tests/phase2/bills-payable

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/bills-payable/bill-payments.ui.spec.ts](../tests/phase2/bills-payable/bill-payments.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/bills-payable/bills-payable-full-flow.ui.spec.ts](../tests/phase2/bills-payable/bills-payable-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/bills-payable/create-vendor-bill.ui.spec.ts](../tests/phase2/bills-payable/create-vendor-bill.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/bills-payable/payables-aging.ui.spec.ts](../tests/phase2/bills-payable/payables-aging.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/bills-payable/README.md](../tests/phase2/bills-payable/README.md) | 11 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/bills-payable/support/bills.ts](../tests/phase2/bills-payable/support/bills.ts) | 41 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/bills-payable/bill-payments.ui.spec.ts`
  - Case: F17-b record manual Cash Bank Transfer and Cheque installments to zero balance
  - Case: F17-b record transaction reference with bank or cheque payment
- `tests/phase2/bills-payable/bills-payable-full-flow.ui.spec.ts`
  - Case: Supplier receipt bill and installments full flow @full-flow
- `tests/phase2/bills-payable/create-vendor-bill.ui.spec.ts`
  - Case: F17-a vendor bill linked to received PO with dates reference and balance
  - Case: F17-a direct QA supplier bill core persistence without a PO prerequisite
- `tests/phase2/bills-payable/payables-aging.ui.spec.ts`
  - Case: F17-c upcoming liability and overdue payable visibility
- `tests/phase2/bills-payable/support/bills.ts`
  - Exports: `endpoint`, `bills`, `billRow`, `createBill`, `paymentDialog`, `pay`, `billScenario`.

### tests/phase2/cash-register

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/cash-register/cash-movements.ui.spec.ts](../tests/phase2/cash-register/cash-movements.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/cash-register/cash-register-full-flow.ui.spec.ts](../tests/phase2/cash-register/cash-register-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/cash-register/close-register.ui.spec.ts](../tests/phase2/cash-register/close-register.ui.spec.ts) | 5 | Independent UI requirements/regression scenarios. |
| [tests/phase2/cash-register/open-register.ui.spec.ts](../tests/phase2/cash-register/open-register.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/cash-register/README.md](../tests/phase2/cash-register/README.md) | 10 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/cash-register/reconciliation-history.ui.spec.ts](../tests/phase2/cash-register/reconciliation-history.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/cash-register/shift-reports.ui.spec.ts](../tests/phase2/cash-register/shift-reports.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/cash-register/support/register.ts](../tests/phase2/cash-register/support/register.ts) | 70 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/cash-register/cash-movements.ui.spec.ts`
  - Case: F09-b cash in with amount and reason
  - Case: F09-b cash out with amount and reason
- `tests/phase2/cash-register/cash-register-full-flow.ui.spec.ts`
  - Case: Register opening cash movements checkout reporting and closure full flow @full-flow
- `tests/phase2/cash-register/close-register.ui.spec.ts`
  - Case: F09-c balanced drawer closure
  - Case: F09-c overage calculation and confirmation
  - Case: F09-c shortage calculation and confirmation
- `tests/phase2/cash-register/open-register.ui.spec.ts`
  - Case: F09-a opening cash float and QA shift notes persist
- `tests/phase2/cash-register/reconciliation-history.ui.spec.ts`
  - Case: F09-e own closed-shift reconciliation remains in history
- `tests/phase2/cash-register/shift-reports.ui.spec.ts`
  - Case: F09-d mid-shift X-report content and printing
  - Case: F09-d closed-shift Z-report content and printing
- `tests/phase2/cash-register/support/register.ts`
  - Exports: `recoverShift`, `registerScenario`.

### tests/phase2/credit-notes

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/credit-notes/cash-refund.ui.spec.ts](../tests/phase2/credit-notes/cash-refund.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/credit-notes/credit-allocation.ui.spec.ts](../tests/phase2/credit-notes/credit-allocation.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/credit-notes/credit-notes-full-flow.ui.spec.ts](../tests/phase2/credit-notes/credit-notes-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/credit-notes/inventory-restock.ui.spec.ts](../tests/phase2/credit-notes/inventory-restock.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/credit-notes/issue-credit-note.ui.spec.ts](../tests/phase2/credit-notes/issue-credit-note.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/credit-notes/pdf-print.ui.spec.ts](../tests/phase2/credit-notes/pdf-print.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/credit-notes/README.md](../tests/phase2/credit-notes/README.md) | 13 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/credit-notes/release-debit-print.ui.spec.ts](../tests/phase2/credit-notes/release-debit-print.ui.spec.ts) | 20 | Independent UI requirements/regression scenarios. |
| [tests/phase2/credit-notes/return-reasons.ui.spec.ts](../tests/phase2/credit-notes/return-reasons.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/credit-notes/support/credit.ts](../tests/phase2/credit-notes/support/credit.ts) | 62 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/credit-notes/cash-refund.ui.spec.ts`
  - Case: F13-d record partial and final QA cash refunds with independent saved-balance checks
- `tests/phase2/credit-notes/credit-allocation.ui.spec.ts`
  - Case: F13-d credit allocation and cash refund entry points
- `tests/phase2/credit-notes/credit-notes-full-flow.ui.spec.ts`
  - Case: Linked invoice credit creation allocation full flow @full-flow
- `tests/phase2/credit-notes/inventory-restock.ui.spec.ts`
  - Case: F13-c optional return to warehouse stock
- `tests/phase2/credit-notes/issue-credit-note.ui.spec.ts`
  - Case: F13-a save and reopen credit note linked to isolated QA invoice
- `tests/phase2/credit-notes/pdf-print.ui.spec.ts`
  - Case: F13-e official linked credit voucher print and PDF
- `tests/phase2/credit-notes/release-debit-print.ui.spec.ts`
  - Case: RET-002 debit-note list opens its authenticated printable document
- `tests/phase2/credit-notes/return-reasons.ui.spec.ts`
  - Case: F13-b product return billing correction and concession reason logging
- `tests/phase2/credit-notes/support/credit.ts`
  - Exports: `creditScenario`.

### tests/phase2/dashboard

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/dashboard/branch-scope.ui.spec.ts](../tests/phase2/dashboard/branch-scope.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/dashboard/dashboard-full-flow.ui.spec.ts](../tests/phase2/dashboard/dashboard-full-flow.ui.spec.ts) | 9 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/dashboard/kpi-metrics.ui.spec.ts](../tests/phase2/dashboard/kpi-metrics.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/dashboard/low-stock.ui.spec.ts](../tests/phase2/dashboard/low-stock.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/dashboard/README.md](../tests/phase2/dashboard/README.md) | 10 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/dashboard/recent-activity.ui.spec.ts](../tests/phase2/dashboard/recent-activity.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/dashboard/revenue-trends.ui.spec.ts](../tests/phase2/dashboard/revenue-trends.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/dashboard/support/dashboard.ts](../tests/phase2/dashboard/support/dashboard.ts) | 121 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/dashboard/top-products.ui.spec.ts](../tests/phase2/dashboard/top-products.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase2/dashboard/branch-scope.ui.spec.ts`
  - Case: F01-f dashboard can isolate a branch instead of only comparing branches
- `tests/phase2/dashboard/dashboard-full-flow.ui.spec.ts`
  - Case: Dashboard complete analytics flow @full-flow
- `tests/phase2/dashboard/kpi-metrics.ui.spec.ts`
  - Case: F01-a revenue orders and AOV widgets bind hydrated values and reconcile the ratio
  - Case: F01-a gross profit and net margin KPI metrics are available
- `tests/phase2/dashboard/low-stock.ui.spec.ts`
  - Case: F01-d low stock rows independently breach their displayed thresholds
- `tests/phase2/dashboard/recent-activity.ui.spec.ts`
  - Case: F01-e recent feed includes sales and stock activity
- `tests/phase2/dashboard/revenue-trends.ui.spec.ts`
  - Case: F01-b saved revenue trend renders the selected sales data source
  - Case: F01-b daily weekly and monthly sales periods can be selected
- `tests/phase2/dashboard/support/dashboard.ts`
  - Exports: `openDashboard`, `configure`, `addPreview`, `salesMetrics`, `profitability`, `revenueChart`, `periods`, `ranking`, `lowStock`, `activity`, `branchScope`.
- `tests/phase2/dashboard/top-products.ui.spec.ts`
  - Case: F01-c top products exposes quantity and revenue performance

### tests/phase2/document-templates

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/document-templates/brand-theme.ui.spec.ts](../tests/phase2/document-templates/brand-theme.ui.spec.ts) | 5 | Independent UI requirements/regression scenarios. |
| [tests/phase2/document-templates/document-templates-full-flow.ui.spec.ts](../tests/phase2/document-templates/document-templates-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/document-templates/header-footer.ui.spec.ts](../tests/phase2/document-templates/header-footer.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/document-templates/live-preview.ui.spec.ts](../tests/phase2/document-templates/live-preview.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/document-templates/README.md](../tests/phase2/document-templates/README.md) | 13 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/document-templates/support/templates.ts](../tests/phase2/document-templates/support/templates.ts) | 55 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/document-templates/template-presets.ui.spec.ts](../tests/phase2/document-templates/template-presets.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase2/document-templates/brand-theme.ui.spec.ts`
  - Case: F22-a primary and secondary brand theme controls
  - Case: F22-a choose and display an unsaved company logo while preserving saved settings
  - Case: F22-a saved primary theme applies to a newly generated actual QA invoice
- `tests/phase2/document-templates/document-templates-full-flow.ui.spec.ts`
  - Case: Document theme content presets preview and actual invoice full flow @full-flow
- `tests/phase2/document-templates/header-footer.ui.spec.ts`
  - Case: F22-b bank terms legal reference header and footer persist
- `tests/phase2/document-templates/live-preview.ui.spec.ts`
  - Case: F22-d live notes font and watermark preview before save
- `tests/phase2/document-templates/support/templates.ts`
  - Exports: `restoreTemplate`, `templateScenario`.
- `tests/phase2/document-templates/template-presets.ui.spec.ts`
  - Case: F22-c Modern and Classic style persistence
  - Case: F22-c invoice quotation and 80mm thermal document presets

### tests/phase2/goods-receipts

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/goods-receipts/damage-shortages.ui.spec.ts](../tests/phase2/goods-receipts/damage-shortages.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/goods-receipts/goods-receipts-full-flow.ui.spec.ts](../tests/phase2/goods-receipts/goods-receipts-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/goods-receipts/inventory-increment.ui.spec.ts](../tests/phase2/goods-receipts/inventory-increment.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/goods-receipts/partial-shipments.ui.spec.ts](../tests/phase2/goods-receipts/partial-shipments.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/goods-receipts/README.md](../tests/phase2/goods-receipts/README.md) | 15 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/goods-receipts/receive-goods.ui.spec.ts](../tests/phase2/goods-receipts/receive-goods.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/goods-receipts/restock-cost.ui.spec.ts](../tests/phase2/goods-receipts/restock-cost.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/goods-receipts/standalone-grn.ui.spec.ts](../tests/phase2/goods-receipts/standalone-grn.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/goods-receipts/standalone-restock.ui.spec.ts](../tests/phase2/goods-receipts/standalone-restock.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/goods-receipts/support/receipts.ts](../tests/phase2/goods-receipts/support/receipts.ts) | 57 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/goods-receipts/damage-shortages.ui.spec.ts`
  - Case: F16-d rejected damaged quantity reason persistence and stock exclusion
- `tests/phase2/goods-receipts/goods-receipts-full-flow.ui.spec.ts`
  - Case: Purchase order acceptance damage and stock receipt full flow @full-flow
- `tests/phase2/goods-receipts/inventory-increment.ui.spec.ts`
  - Case: F16-c receipt increments warehouse stock and preserves other branch balances
- `tests/phase2/goods-receipts/partial-shipments.ui.spec.ts`
  - Case: F16-b multiple deliveries retain received quantities and close outstanding balance
- `tests/phase2/goods-receipts/receive-goods.ui.spec.ts`
  - Case: F16-a receive accepted items against an isolated approved QA purchase order
- `tests/phase2/goods-receipts/restock-cost.ui.spec.ts`
  - Case: F16-a standalone Restock line and estimated total use the QA purchase cost
- `tests/phase2/goods-receipts/standalone-grn.ui.spec.ts`
  - Case: F16-a separate no-PO GRN needs only supplier product and quantity
- `tests/phase2/goods-receipts/standalone-restock.ui.spec.ts`
  - Case: F16-a standalone no-PO Restock adds only one QA item and preserves other branches
- `tests/phase2/goods-receipts/support/receipts.ts`
  - Exports: `receiptScenario`.

### tests/phase2/notifications

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/notifications/notification-center.ui.spec.ts](../tests/phase2/notifications/notification-center.ui.spec.ts) | 5 | Independent UI requirements/regression scenarios. |
| [tests/phase2/notifications/notifications-full-flow.ui.spec.ts](../tests/phase2/notifications/notifications-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/notifications/overdue-invoices.ui.spec.ts](../tests/phase2/notifications/overdue-invoices.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/notifications/README.md](../tests/phase2/notifications/README.md) | 10 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/notifications/stock-alerts.ui.spec.ts](../tests/phase2/notifications/stock-alerts.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/notifications/support/notifications.ts](../tests/phase2/notifications/support/notifications.ts) | 81 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/notifications/notification-center.ui.spec.ts`
  - Case: F29-a header bell unread badge panel and full-center navigation
  - Case: F29-a own new alert display read persistence and linked product navigation
  - Case: F29-a notification type and priority filtering
- `tests/phase2/notifications/notifications-full-flow.ui.spec.ts`
  - Case: QA stock alerts read action overdue invoice and filter full flow @full-flow
- `tests/phase2/notifications/overdue-invoices.ui.spec.ts`
  - Case: F29-c immediate overdue alert for a newly issued unpaid past-due QA invoice
- `tests/phase2/notifications/stock-alerts.ui.spec.ts`
  - Case: F29-b immediate low-stock alert from a unique threshold-crossing adjustment
  - Case: F29-b immediate out-of-stock alert from a unique zero-stock adjustment
- `tests/phase2/notifications/support/notifications.ts`
  - Exports: `feed`, `restoreNotificationScope`, `notificationScenario`.

### tests/phase2/pos-extensions

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/pos-extensions/formal-invoice.ui.spec.ts](../tests/phase2/pos-extensions/formal-invoice.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/pos-extensions/hold-orders.ui.spec.ts](../tests/phase2/pos-extensions/hold-orders.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/pos-extensions/pos-extensions-full-flow.ui.spec.ts](../tests/phase2/pos-extensions/pos-extensions-full-flow.ui.spec.ts) | 7 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/pos-extensions/README.md](../tests/phase2/pos-extensions/README.md) | 10 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/pos-extensions/receipt-print.ui.spec.ts](../tests/phase2/pos-extensions/receipt-print.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/pos-extensions/support/fiscal.ts](../tests/phase2/pos-extensions/support/fiscal.ts) | 40 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/pos-extensions/support/hold.ts](../tests/phase2/pos-extensions/support/hold.ts) | 42 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/pos-extensions/formal-invoice.ui.spec.ts`
  - Case: F08-k formal A4 invoice generation for a QA POS sale
- `tests/phase2/pos-extensions/hold-orders.ui.spec.ts`
  - Case: F08-j hold a QA service cart and display it after reload
- `tests/phase2/pos-extensions/pos-extensions-full-flow.ui.spec.ts`
  - Case: POS hold resume checkout and formal invoice full flow @full-flow
- `tests/phase2/pos-extensions/receipt-print.ui.spec.ts`
  - Case: F08-k cash receipt matches the recorded QA sale and invokes printing
- `tests/phase2/pos-extensions/support/fiscal.ts`
  - Exports: `sellQA`, `receiptScenario`, `formalScenario`.
- `tests/phase2/pos-extensions/support/hold.ts`
  - Exports: `recoverHeld`, `holdScenario`.

### tests/phase2/products-bulk

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/products-bulk/export-branch-stock.ui.spec.ts](../tests/phase2/products-bulk/export-branch-stock.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/products-bulk/export-catalog.ui.spec.ts](../tests/phase2/products-bulk/export-catalog.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/products-bulk/import-catalog.ui.spec.ts](../tests/phase2/products-bulk/import-catalog.ui.spec.ts) | 5 | Independent UI requirements/regression scenarios. |
| [tests/phase2/products-bulk/products-bulk-full-flow.ui.spec.ts](../tests/phase2/products-bulk/products-bulk-full-flow.ui.spec.ts) | 9 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/products-bulk/README.md](../tests/phase2/products-bulk/README.md) | 10 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/products-bulk/support/catalog.ts](../tests/phase2/products-bulk/support/catalog.ts) | 143 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/products-bulk/export-branch-stock.ui.spec.ts`
  - Case: F02-j CSV export displays every branch stock column and a reconciled company total
- `tests/phase2/products-bulk/export-catalog.ui.spec.ts`
  - Case: F02-j CSV export contains the complete catalogue, not only the visible page
  - Case: F02-j JSON export contains the complete catalogue
- `tests/phase2/products-bulk/import-catalog.ui.spec.ts`
  - Case: F02-j valid two-row CSV imports and survives catalogue reload with correct prices
  - Case: F02-j invalid empty-name CSV rows are rejected or skipped without creating products
  - Case: F02-j standard CRLF CSV preserves quoted commas quotes and leading-zero barcodes
- `tests/phase2/products-bulk/products-bulk-full-flow.ui.spec.ts`
  - Case: Bulk catalogue export import validate and archive QA rows @full-flow
- `tests/phase2/products-bulk/support/catalog.ts`
  - Exports: `parseCSV`, `csvText`, `openCatalog`, `exchange`, `exportCatalog`, `verifyExport`, `verifyBranchStockExport`, `importFixtures`, `searchOwned`, `archiveOwned`, `importCSV`.

### tests/phase2/purchase-orders

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/purchase-orders/create-purchase-order.ui.spec.ts](../tests/phase2/purchase-orders/create-purchase-order.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/purchase-orders/fulfilment.ui.spec.ts](../tests/phase2/purchase-orders/fulfilment.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/purchase-orders/inactive-supplier-api.ui.spec.ts](../tests/phase2/purchase-orders/inactive-supplier-api.ui.spec.ts) | 11 | Independent UI requirements/regression scenarios. |
| [tests/phase2/purchase-orders/pdf-export.ui.spec.ts](../tests/phase2/purchase-orders/pdf-export.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/purchase-orders/purchase-orders-full-flow.ui.spec.ts](../tests/phase2/purchase-orders/purchase-orders-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/purchase-orders/README.md](../tests/phase2/purchase-orders/README.md) | 13 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/purchase-orders/status-lifecycle.ui.spec.ts](../tests/phase2/purchase-orders/status-lifecycle.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/purchase-orders/supplier-order-tax.ui.spec.ts](../tests/phase2/purchase-orders/supplier-order-tax.ui.spec.ts) | 9 | Independent UI requirements/regression scenarios. |
| [tests/phase2/purchase-orders/support/purchasing.ts](../tests/phase2/purchase-orders/support/purchasing.ts) | 56 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/purchase-orders/create-purchase-order.ui.spec.ts`
  - Case: F15-a supplier items costs delivery date currency and totals persist
  - Case: F15-a select delivery warehouse or branch
- `tests/phase2/purchase-orders/fulfilment.ui.spec.ts`
  - Case: F15-d partial then full receipt closes fulfillment
- `tests/phase2/purchase-orders/inactive-supplier-api.ui.spec.ts`
  - Case: RET-004 API rejects an inactive QA supplier using a valid owned PO positive control
- `tests/phase2/purchase-orders/pdf-export.ui.spec.ts`
  - Case: F15-c actual purchase order PDF export
- `tests/phase2/purchase-orders/purchase-orders-full-flow.ui.spec.ts`
  - Case: Purchase order supplier approval partial and final receipt full flow @full-flow
- `tests/phase2/purchase-orders/status-lifecycle.ui.spec.ts`
  - Case: F15-b draft approve and mark ordered without sending supplier email
- `tests/phase2/purchase-orders/supplier-order-tax.ui.spec.ts`
  - Case: Release supplier-specific order uses an entered tax amount instead of flat ten percent
- `tests/phase2/purchase-orders/support/purchasing.ts`
  - Exports: `orders`, `vendor`, `createPO`, `openPO`, `advancePO`, `receive`, `poScenario`.

### tests/phase2/quotations

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/quotations/commercial-terms.ui.spec.ts](../tests/phase2/quotations/commercial-terms.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/quotations/create-quotation.ui.spec.ts](../tests/phase2/quotations/create-quotation.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/quotations/invoice-conversion.ui.spec.ts](../tests/phase2/quotations/invoice-conversion.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/quotations/pdf-print.ui.spec.ts](../tests/phase2/quotations/pdf-print.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/quotations/quotations-full-flow.ui.spec.ts](../tests/phase2/quotations/quotations-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/quotations/README.md](../tests/phase2/quotations/README.md) | 15 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/quotations/status-pipeline.ui.spec.ts](../tests/phase2/quotations/status-pipeline.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/quotations/support/quotations.ts](../tests/phase2/quotations/support/quotations.ts) | 56 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/quotations/commercial-terms.ui.spec.ts`
  - Case: F11-b custom payment terms notes and individual line discounts
- `tests/phase2/quotations/create-quotation.ui.spec.ts`
  - Case: F11-a customer items negotiated price discount and expiry persist independently
- `tests/phase2/quotations/invoice-conversion.ui.spec.ts`
  - Case: F11-e accepted quotation exposes tax invoice conversion
- `tests/phase2/quotations/pdf-print.ui.spec.ts`
  - Case: F11-c saved quotation branded PDF and print entry point
- `tests/phase2/quotations/quotations-full-flow.ui.spec.ts`
  - Case: Quotation creation review status conversion full flow @full-flow
- `tests/phase2/quotations/status-pipeline.ui.spec.ts`
  - Case: F11-d saved draft exposes status pipeline
- `tests/phase2/quotations/support/quotations.ts`
  - Exports: `quotes`, `prepare`, `create`, `detail`, `quoteScenario`.

### tests/phase2/README.md

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/README.md](../tests/phase2/README.md) | 21 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |

### tests/phase2/reports

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/reports/export-formats.ui.spec.ts](../tests/phase2/reports/export-formats.ui.spec.ts) | 5 | Independent UI requirements/regression scenarios. |
| [tests/phase2/reports/inventory-valuation.ui.spec.ts](../tests/phase2/reports/inventory-valuation.ui.spec.ts) | 5 | Independent UI requirements/regression scenarios. |
| [tests/phase2/reports/low-stock.ui.spec.ts](../tests/phase2/reports/low-stock.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/reports/product-performance.ui.spec.ts](../tests/phase2/reports/product-performance.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/reports/README.md](../tests/phase2/reports/README.md) | 8 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/reports/reports-full-flow.ui.spec.ts](../tests/phase2/reports/reports-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/reports/sales-summary.ui.spec.ts](../tests/phase2/reports/sales-summary.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/reports/support/reports.ts](../tests/phase2/reports/support/reports.ts) | 81 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/reports/support/valuation-stock.ts](../tests/phase2/reports/support/valuation-stock.ts) | 30 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/reports/tax-vat.ui.spec.ts](../tests/phase2/reports/tax-vat.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase2/reports/export-formats.ui.spec.ts`
  - Case: F20-f actual CSV download arithmetic and browser export history
  - Case: F20-f standard report PDF export availability
  - Case: Reports honor the confirmed Rs currency prefix
- `tests/phase2/reports/inventory-valuation.ui.spec.ts`
  - Case: F20-c complete inventory valuation at cost across catalogue
  - Case: F20-c valuation includes newly counted later-page QA inventory
  - Case: F20-c positive cost-value change from an owned QA branch adjustment
- `tests/phase2/reports/low-stock.ui.spec.ts`
  - Case: F20-d complete depleted and critical stock report
- `tests/phase2/reports/product-performance.ui.spec.ts`
  - Case: F20-b top sellers quantities and revenue contribution report
- `tests/phase2/reports/reports-full-flow.ui.spec.ts`
  - Case: Standard reporting and actual export full flow @full-flow
- `tests/phase2/reports/sales-summary.ui.spec.ts`
  - Case: F20-a sales date range payment method cashier and branch dimensions
- `tests/phase2/reports/support/reports.ts`
  - Exports: `reportScenario`.
- `tests/phase2/reports/support/valuation-stock.ts`
  - Exports: `productState`, `countQuantity`, `seedValuationStock`, `restoreValuationStock`.
- `tests/phase2/reports/tax-vat.ui.spec.ts`
  - Case: F20-e standard zero-rated and net VAT fiscal report

### tests/phase2/stock-counts

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/stock-counts/count-entry.ui.spec.ts](../tests/phase2/stock-counts/count-entry.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stock-counts/count-reconciliation.ui.spec.ts](../tests/phase2/stock-counts/count-reconciliation.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stock-counts/count-variance.ui.spec.ts](../tests/phase2/stock-counts/count-variance.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stock-counts/initial-balance-reconciliation.ui.spec.ts](../tests/phase2/stock-counts/initial-balance-reconciliation.ui.spec.ts) | 11 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stock-counts/README.md](../tests/phase2/stock-counts/README.md) | 12 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/stock-counts/stock-counts-full-flow.ui.spec.ts](../tests/phase2/stock-counts/stock-counts-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/stock-counts/support/counts.ts](../tests/phase2/stock-counts/support/counts.ts) | 70 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/stock-counts/count-entry.ui.spec.ts`
  - Case: F06-a counted quantity and frozen expectation survive reload
- `tests/phase2/stock-counts/count-reconciliation.ui.spec.ts`
  - Case: F06-c committing a surplus count updates only its QA branch
  - Case: F06-c committing a shortage count updates only its QA branch
- `tests/phase2/stock-counts/count-variance.ui.spec.ts`
  - Case: F06-b surplus quantity and cost variance
  - Case: F06-b shortage quantity and cost variance
- `tests/phase2/stock-counts/initial-balance-reconciliation.ui.spec.ts`
  - Case: F06-c commit first positive count for an active QA item without a branch balance
- `tests/phase2/stock-counts/stock-counts-full-flow.ui.spec.ts`
  - Case: Physical count entry variance and stock reconciliation full flow @full-flow
- `tests/phase2/stock-counts/support/counts.ts`
  - Exports: `compensate`, `abandon`, `countScenario`.

### tests/phase2/stock-transfers

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/stock-transfers/create-transfer.ui.spec.ts](../tests/phase2/stock-transfers/create-transfer.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stock-transfers/README.md](../tests/phase2/stock-transfers/README.md) | 12 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/stock-transfers/receive-transfer.ui.spec.ts](../tests/phase2/stock-transfers/receive-transfer.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stock-transfers/stock-transfers-full-flow.ui.spec.ts](../tests/phase2/stock-transfers/stock-transfers-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/stock-transfers/support/transfers.ts](../tests/phase2/stock-transfers/support/transfers.ts) | 91 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/stock-transfers/transfer-ledger.ui.spec.ts](../tests/phase2/stock-transfers/transfer-ledger.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stock-transfers/transit-workflow.ui.spec.ts](../tests/phase2/stock-transfers/transit-workflow.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase2/stock-transfers/create-transfer.ui.spec.ts`
  - Case: F05-a create source-to-destination transfer request
- `tests/phase2/stock-transfers/receive-transfer.ui.spec.ts`
  - Case: F05-c receiving reconciles both QA branch stock balances
- `tests/phase2/stock-transfers/stock-transfers-full-flow.ui.spec.ts`
  - Case: Stock transfer request dispatch receipt and ledger full flow @full-flow
- `tests/phase2/stock-transfers/support/transfers.ts`
  - Exports: `restoreTransferStock`, `recoverTransferStock`, `startTransfer`, `transferCheck`.
- `tests/phase2/stock-transfers/transfer-ledger.ui.spec.ts`
  - Case: F05-d own pending and completed transfer ledger history
- `tests/phase2/stock-transfers/transit-workflow.ui.spec.ts`
  - Case: F05-b draft to in-transit progression

### tests/phase2/stores-lifecycle

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/stores-lifecycle/close-branch.ui.spec.ts](../tests/phase2/stores-lifecycle/close-branch.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stores-lifecycle/README.md](../tests/phase2/stores-lifecycle/README.md) | 8 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/stores-lifecycle/staff-assignment.ui.spec.ts](../tests/phase2/stores-lifecycle/staff-assignment.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/stores-lifecycle/stores-lifecycle-full-flow.ui.spec.ts](../tests/phase2/stores-lifecycle/stores-lifecycle-full-flow.ui.spec.ts) | 7 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/stores-lifecycle/support/branches.ts](../tests/phase2/stores-lifecycle/support/branches.ts) | 84 | Module UI adapters, business oracles and scoped fixture/recovery logic. |

Declarations and reusable entry points:

- `tests/phase2/stores-lifecycle/close-branch.ui.spec.ts`
  - Case: F03-f closing an owned QA branch preserves its identifier and details
  - Case: F03-f active-location count reconciles after adding and closing only a QA branch
- `tests/phase2/stores-lifecycle/staff-assignment.ui.spec.ts`
  - Case: F03-e cashier and manager branch restrictions require an activated QA staff fixture
- `tests/phase2/stores-lifecycle/stores-lifecycle-full-flow.ui.spec.ts`
  - Case: Branch closure and staff-scoping full flow @full-flow
- `tests/phase2/stores-lifecycle/support/branches.ts`
  - Exports: `branches`, `card`, `activeCount`, `createBranch`, `status`, `recoverBranches`, `closure`, `staffScope`.

### tests/phase2/supplier-history

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/supplier-history/goods-receipts.ui.spec.ts](../tests/phase2/supplier-history/goods-receipts.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/supplier-history/outgoing-payments.ui.spec.ts](../tests/phase2/supplier-history/outgoing-payments.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/supplier-history/purchase-orders.ui.spec.ts](../tests/phase2/supplier-history/purchase-orders.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/supplier-history/README.md](../tests/phase2/supplier-history/README.md) | 11 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/supplier-history/supplier-history-full-flow.ui.spec.ts](../tests/phase2/supplier-history/supplier-history-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |
| [tests/phase2/supplier-history/support/history.ts](../tests/phase2/supplier-history/support/history.ts) | 24 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/supplier-history/vendor-bills.ui.spec.ts](../tests/phase2/supplier-history/vendor-bills.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |

Declarations and reusable entry points:

- `tests/phase2/supplier-history/goods-receipts.ui.spec.ts`
  - Case: F18-d supplier history retains received shipment linkage
- `tests/phase2/supplier-history/outgoing-payments.ui.spec.ts`
  - Case: F18-d supplier complete ledger includes an owned partial outgoing cash payment
- `tests/phase2/supplier-history/purchase-orders.ui.spec.ts`
  - Case: F18-d supplier history retains its own purchase order
- `tests/phase2/supplier-history/supplier-history-full-flow.ui.spec.ts`
  - Case: Supplier bill payment and transaction ledger full flow @full-flow
- `tests/phase2/supplier-history/support/history.ts`
  - Exports: `supplierHistory`.
- `tests/phase2/supplier-history/vendor-bills.ui.spec.ts`
  - Case: F18-d supplier complete ledger includes an owned unpaid bill

### tests/phase2/support

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/support/auth.setup.ts](../tests/phase2/support/auth.setup.ts) | 10 | Clears stale auth/journal, signs in and stores the selected QA-company session. |
| [tests/phase2/support/cleanup.teardown.ts](../tests/phase2/support/cleanup.teardown.ts) | 43 | Module-specific recovery, unexpected-write audit and logout, with failed-setup handling. |
| [tests/phase2/support/inventory.ts](../tests/phase2/support/inventory.ts) | 26 | Captures/reconciles/restores owned QA SKU inventory using finite guarded adjustments. |
| [tests/phase2/support/observed.ts](../tests/phase2/support/observed.ts) | 10 | Observes actual GET URLs and rereads identical requests with headers kept in memory. |
| [tests/phase2/support/pdf.ts](../tests/phase2/support/pdf.ts) | 11 | Checks PDF signature/EOF and parsed required content using Python. |
| [tests/phase2/support/phase2.ts](../tests/phase2/support/phase2.ts) | 101 | Shared guarded QA fixture, session/company verification, scoped mutations, proof/classification and numeric parsing. |

Declarations and reusable entry points:

- `tests/phase2/support/auth.setup.ts`
  - Case: authenticate Phase 2 QA workspace
- `tests/phase2/support/cleanup.teardown.ts`
  - Case: audit Phase 2 write scope and log out QA session
- `tests/phase2/support/inventory.ts`
  - Exports: `qaProduct`, `matrix`, `captureInventory`, `changeInventory`, `restoreInventory`.
- `tests/phase2/support/observed.ts`
  - Exports: `readRoute`, `reread`.
- `tests/phase2/support/pdf.ts`
  - Exports: `verifyPDF`.
- `tests/phase2/support/phase2.ts`
  - Exports: `required`, `company`, `main`, `authPath`, `journalPath`, `observedPrintCalls`, `record`, `verifyCompany`, `guard`, `writeScope`, `signIn`, `route`, `blocked`, `bug`, `proof`, `number`, `test`, `logout`.

### tests/phase2/users-rbac

| File | Lines | Responsibility |
| --- | ---: | --- |
| [tests/phase2/users-rbac/access-revocation.ui.spec.ts](../tests/phase2/users-rbac/access-revocation.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/users-rbac/branch-scoping.ui.spec.ts](../tests/phase2/users-rbac/branch-scoping.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/users-rbac/invite-join.ui.spec.ts](../tests/phase2/users-rbac/invite-join.ui.spec.ts) | 4 | Independent UI requirements/regression scenarios. |
| [tests/phase2/users-rbac/predefined-roles.ui.spec.ts](../tests/phase2/users-rbac/predefined-roles.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/users-rbac/profile-edit.ui.spec.ts](../tests/phase2/users-rbac/profile-edit.ui.spec.ts) | 3 | Independent UI requirements/regression scenarios. |
| [tests/phase2/users-rbac/README.md](../tests/phase2/users-rbac/README.md) | 8 | Usage, fixtures, historical execution results and scope limits; check date against later retests. |
| [tests/phase2/users-rbac/support/staff.ts](../tests/phase2/users-rbac/support/staff.ts) | 57 | Module UI adapters, business oracles and scoped fixture/recovery logic. |
| [tests/phase2/users-rbac/users-rbac-full-flow.ui.spec.ts](../tests/phase2/users-rbac/users-rbac-full-flow.ui.spec.ts) | 3 | Integrated module journey, retaining step outcomes and independent failures. |

Declarations and reusable entry points:

- `tests/phase2/users-rbac/access-revocation.ui.spec.ts`
  - Case: F23-c MOCK member suspend reactivate and remove UI
- `tests/phase2/users-rbac/branch-scoping.ui.spec.ts`
  - Case: F23-e MOCK Manager branch-assignment UI inventory
- `tests/phase2/users-rbac/invite-join.ui.spec.ts`
  - Case: F23-a MOCK invitation payload pending list and fake join URL handoff
  - Case: F23-a MOCK invitation resend and revoke UI
- `tests/phase2/users-rbac/predefined-roles.ui.spec.ts`
  - Case: F23-d live owner invitation role choices without sending invitation
- `tests/phase2/users-rbac/profile-edit.ui.spec.ts`
  - Case: F23-b MOCK member role edit and profile/password action inventory
- `tests/phase2/users-rbac/support/staff.ts`
  - Exports: `predefinedRoles`, `staffScenario`.
- `tests/phase2/users-rbac/users-rbac-full-flow.ui.spec.ts`
  - Case: MOCK invitation fake join role suspend reactivate remove full flow @full-flow
