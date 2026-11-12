# NexStock testing: reconstructed project handover

Reviewed on **12 November 2026**, Indian/Mauritius. This reference reconstructs the project from its local code, requirements, findings, execution registers and evidence. At reconstruction time the latest saved live retest was 5 November. No live application run, transaction, invitation, credential change, commit or push was performed during that reconstruction review.

**Subsequent live update, 12 November 2026:** the user requested retesting all five developer-addressed Phase 1/Phase 2 findings. RET-002, RET-003, P2-QUOTE-002 and REL-DN-001 pass. P2-DOC-004 is partially fixed: branding now propagates, but the rendered dark text tint measures 2.991:1 against the actual surface, just below the new stated 3:1 minimum. Final composite: 19 functional passes, one application-failing case and ten support passes; all temporary QA baselines restored. Use [the latest retest](release-verification-2026-11-12/README.md) and [remaining bug](release-verification-2026-11-12/remaining-bugs.md) as the current status. The reconstruction details below preserve the earlier baseline/history.

## What this repository contains

This is the **QA automation and reporting repository**, not the NexStock application repository. The application is tested at `https://nexstock.stylotech.mu/app`, using the disposable **Nexstock QA Company**. Earlier source observations refer to a supplied staging archive at commit `6e90a52f7e4dbaf07bb96bfca5d069ddd6b7f31e`; that application source is not bundled here. No authoritative deployed application Git commit is established.

The scope register contains **175 subfeatures across 30 domains**: **51 Phase 1**, **65 Phase 2**, and **59 Phase 3**. There are **63 designed Phase 1 cases**. Current source contains **167 UI spec files**: 70 under Phase 1 and 97 under Phase 2. A spec file can declare several cases or generate cases from a loop; these counts are not feature acceptance counts.

The review indexed 388 project source/document/configuration files and parsed 189 Playwright `results.json` snapshots containing 1,350 attempt-level case entries, including collection records and repeated runs. These totals are an evidence inventory, not unique executed scenarios. Generated reports/screenshots and dependencies account for most of the directory size. See [the file map](PROJECT-FILE-MAP.md) for the component index.

| Location | Purpose |
| --- | --- |
| `docs/FEATURES.md` | User-supplied feature specification; detailed subfeature phases override the executive matrix. |
| `data/feature-matrix.json`, `docs/COVERAGE.md` | Requirement register and traceability. Some recorded statuses predate later release retests. |
| `data/phase1-cases.json`, `docs/PHASE1-CASES.md` | The original 63 case designs, with some later status updates. |
| `docs/TEST-PLAN.md`, `docs/GAPS.md`, `docs/VALIDATION.md` | Original strategy, source-derived questions and bootstrap validation. These are historical. |
| `tests/phase1/` | Onboarding and independent business-module UI suites, plus release regressions. |
| `tests/phase2/` | Eighteen module suites, shared fixtures, independent specs and integrated flows. |
| `helpers/`, `checks/` | Request guards, target validation, baseline rules and offline classification tests. |
| `scripts/` | Isolated runners, assessors, discovery/diagnostic utilities and PDF/Markdown report builders. |
| Root `*-failure-tickets.md` | Original module and consolidated findings. Their dates matter; later retests supersede older open-state descriptions. |
| `data/phase2-findings/`, `docs/phase2/bugs/` | Structured historical Phase 2 findings and separate detailed module reports. |
| `docs/release-verification-2026-11-04/` | Broad verification of the developer's addressed release claims. |
| `docs/release-verification-2026-11-05/` | Latest targeted retest of the five remaining release findings. |
| `blob-report/archive/` | Preserved attempts: execution metadata, JSON/JUnit/HTML, screenshots, downloads and safe journals. |
| `output/pdf/` | Three concise historical QA summaries, dated 24 October, 26 October and 4 November. |
| `test-results/`, `playwright/.auth/` | Shared authentication, fixtures, private baselines and compensation ledgers. Preserve them; do not share session state. |
| `playwright-report/`, `debug.log`, `tmp/` | Latest default report, diagnostic history and intermediate render/review assets. The default report is not the whole project history. |

## Which records determine status

Use the latest **completed, reviewed execution for the same case and scope**. Preserve historical failure evidence without treating all earlier failures as still open. A later narrow retest does not certify features it did not exercise.

1. [12 November five-finding fix retest](release-verification-2026-11-12/README.md), [remaining bug](release-verification-2026-11-12/remaining-bugs.md), and `blob-report/archive/release-verification-2026-11-12/verification-register.json` supersede the five-ticket verdicts below. New contrast-adapted text is allowed; exact borders and at least 3:1 on the actual dark surface are required.
2. [5 November targeted retest](release-verification-2026-11-05/README.md), [detailed remaining tickets](release-verification-2026-11-05/remaining-bugs.md), and `blob-report/archive/release-verification-2026-11-05/targeted-case-register.json`.
3. [4 November broad release verification](release-verification-2026-11-04/README.md), `data/release-verification-2026-11-04.json`, and that campaign's `verification-register.json`.
4. `blob-report/archive/phase1-round2-2026-10-26/verification-register.json` for the original seven failed Phase 1 cases and supplementary Help check.
5. [Phase 2 summary](phase2/SUMMARY.md), [work log](phase2/WORK-LOG.md), per-module findings, and `blob-report/archive/phase2-2026-10-25/*-assessment.json` for the original Phase 2 cycle.
6. Root module reports and the 24 October register for original findings and earlier release changes.

`README.md`, `docs/VALIDATION.md`, `docs/TEST-COLLECTION.txt` and portions of `docs/AUTOMATION-MAP.md` retain starter-era statements. For example, the README says live tests have not run and `.env` is not loaded; extensive later live evidence exists and `playwright.config.ts` now loads `.env` through Node's `loadEnvFile`.

## Work history

| Date | Work and evidence-backed outcome |
| --- | --- |
| 12 October | Bootstrap: requirements, case designs, Playwright framework, original anonymous/API strategy and local guards. Git history records an initial commit. |
| 16 October | Git commit adds onboarding and product coverage. Product findings include wholesale/service/archive/scanner/category/tax/media capabilities. |
| 17-21 October | Broader Phase 1 modules implemented and executed. Examples: POS 29 functional cases (10 pass/19 fail); invoices 26 (4/22); Customers 20 (10/10); Security 30 including support (20/10); Hardware 17 including support (8/9); Settings final composite 20 including support (10/10). These raw failures include dependencies and repeats, not one bug each. |
| 24 October | Broad post-deployment Phase 1 verification: 158 feature checks pass, seven failing cases group into RET-001 through RET-004; two policy observations and 16 support passes are separate. Many original missing features now work, with explicitly limited acceptance. |
| 25 October | Help continuation records HELP-001 plus three legal/build prerequisites. Its five application-failing cases share one bug. Phase 2 execution begins across all 18 modules. |
| 25-26 October | Original Phase 2 cycle reviewed: 80 live/setup/cleanup passes, 63 application-failing cases, 10 blocked cases, four mock passes and four mock observations. Failures group into 34 new Phase 2 IDs plus reused RET-002. No unresolved automation errors in the final composite. |
| 26 October | Separate no-PO supplier GRN requirement confirmed and tested for availability. Correct Phase 1 Round 2 retest: RET-001/004 fixed, RET-002 partial, RET-003 open. HELP-001 navigation fix passes. |
| 26 October, separate archive | `round2-retest-2026-10-26` was started under a superseded Phase 2 scope assumption and paused by the user because fixes were not deployed. It is not the completed Phase 1 Round 2 verdict. |
| 30 October | Release verification begins but is interrupted. Do not combine these attempts into the fresh 4 November closure counts. |
| 4 November | Completed broad verification: 58 functional passes, eight application-failing cases and 38 support passes; five confirmed issues. Of 24 addressed Phase 2 tickets, 21 are fixed and three partially fixed. Ten other Phase 2 tickets were explicitly excluded. |
| 5 November | Changed frontend fingerprint verified; targeted retest of the five remaining issues: 15 functional cases (seven pass/eight fail), ten support passes, zero blocked/skipped/unresolved automation errors. **Zero of the five tickets close.** |
| 12 November | Repository/context reconstruction only: offline checks and collection; no fresh live verdict. |

## Latest release findings

These are an index to existing detailed tickets, not new tickets or a complete project backlog. All five remained reproducible on **5 November**.

| Ticket | Latest remaining behavior | Verified working boundary |
| --- | --- | --- |
| RET-002 | Invoice PDF omits the saved Company Settings invoice header and bank/payment instructions. | Download, exact invoice identity, parties, product and amount work. Document Builder notes propagate through a different path. |
| RET-003 | Variant customization scroll content intercepts the normal Add to order click at 1920 x 1080 and 1440 x 900. | Enabled button and available stock were checked; no forced click or stylesheet patch was used. |
| P2-QUOTE-002 | Customer-facing quotation Notes disappear from the downloaded PDF. | Saved web Notes/terms, discounts, correct totals, status and conversion work; terms reach the PDF. |
| P2-DOC-004 | Classic dark invoice, quotation and credit-note views replace the chosen primary brand color with neutral styling. | Saved color/text, Modern display and native Classic PDF color work. The user explicitly requires color preservation. |
| REL-DN-001 | Debit-note web/print document shows `Item 4` and no SKU instead of the chosen product name/SKU. | Authenticated debit print route, reference, customer and amount work. This was additional to the original release ticket list. |

The latest frontend was `index-Dbz-Ri4a.js`, SHA-256 `f66c48267e535f00bad029f23fb7b53160d2b6b76ce82ff483badbbbeb28d746`. This establishes changed public frontend bytes, not an authoritative deployed Git commit or backend revision. The latest ticket register's 16 primary attachment paths were checked and exist locally.

## Explicitly undelivered Phase 2 scope

The following ten historical tickets were **not included in the developer's 4 November release claims**. They are not counted among the five remaining addressed-release findings, and are not marked fixed or freshly reproduced by the 5 November narrow run.

| IDs | Undelivered capability |
| --- | --- |
| P2-DASH-001, P2-DASH-002 | Gross profit/net margin dashboard metrics; daily/weekly/monthly period selection. |
| P2-REG-001, P2-REG-002 | Cash in/out workflow; X/Z shift reports. |
| P2-CN-003 | Optional credit-note inventory restock/location workflow. |
| P2-GRN-003 | Standalone supplier GRN without a PO. |
| P2-REP-001, P2-REP-004, P2-REP-006 | Custom-date/cashier/payment-method report filters; VAT/fiscal report; standard report PDF export. |
| P2-DOC-001 | Secondary brand color. |

**P2-CN-004 is also only partially delivered:** record-only refunds of 40 + 60 settle a 100 credit, balance persistence passes and over-refund is rejected; credit allocation is explicitly undelivered. Refund date/method history is not certified. It is separate from the five current release defects.

## Phase 1 modules and what was tested

The module READMEs/root tickets describe the first runs. The 24 October release register often contains the newer outcome. Preserve the listed scope limits.

| Module / UI specs | Automation and latest established boundary |
| --- | --- |
| Onboarding / 1 | Dedicated fresh account: plan/trial, company, contact, Mauritius/MUR/language/BRN-proof/VAT and Finish setup. Needs a separate onboarding account. Existing completed QA onboarding is not a reusable fresh-state fixture; PIN onboarding is unverified. |
| Products / 11 | Create/edit/archive/restore, category/unit fixtures, SKU/barcode, variants, prices/tax, service items, PNG upload and integrated flow. Later release checks add clearing description/barcode and inclusive VAT persistence. Hierarchy depth/cycles, tag grouping persistence, historical sold relations, full mixed-tax arithmetic and all image variants remain broader than proven coverage. |
| Stores / 4 | Types/contact/code, edits, branch tax/receipt settings, matrix and +1/-1 branch-stock isolation. Original branch tax/receipt gaps later improved. Assigned registers were deferred; first/storeless-company bootstrap and inherited-tax propagation matrix remain unverified. Five-branch quota affects fixture creation. |
| Stock adjustments / 5 | Positive/negative/zero/overdraw, branch isolation, five reasons, cost-based valuation, actor/time/status, notes and detailed signed SKU movements. SA-001/002 original retrieval gaps pass in the release retest. Compensating adjustments retain history. |
| POS / 13 | Search/leading-zero keyboard barcode, categories, cart/override/clear, existing and quick-add customer, discounts/VAT/exemption, recorded Cash/Card/Juice/Bank Transfer, split/change, receipt and full sale. Extra regressions cover beyond-page-one products, service sales and till-specific receipt content. RET-001 later fixed; RET-003 remains. Physical devices/provider settlement and non-admin permissions are unverified. |
| Invoicing / 8 | Required fields/arithmetic, draft/paid saves, commercial terms/date boundaries, partial payments/status/cancel/reference retention, PDFs/print; extra quotation-save and non-zero AR cases. Original creation blocker fixed. Controlled AR proves invoice 200 less payment 50 gives 150 due and excludes a cancelled/draft 777 record. RET-002 still affects configured PDF text. |
| Suppliers / 5 | Unique create/edit/clear/status/reactivation, optional separate BRN/Tax ID, credit periods/limits and read-only order eligibility. RET-004 now fixed, including inactive-vendor API rejection with a valid positive control. Configured credit period versus negative overdue days remains a semantics observation; over-limit enforcement was not required. |
| Customers / 5 | Individual/corporate identity/contact/address, validation/cancel, clearing/archive/reactivation and invoice eligibility, history/AR/statement surfaces. CUST-001/003 improve in release retest. Non-zero AR is exercised by invoice regressions; original empty-profile observations alone do not prove missing financial behavior. Duplicate-name binding and all aging boundaries remain open coverage. |
| Security / 4 | Login/anonymous guards, logout/back/shared-tab access, one wrong-password attempt, safe credential transport fields, synthetic signup guidance/strength, reset-entry validation, untouched profile/password controls and inactivity prerequisite. Demo identity and password feedback improve; removed unenforced company controls pass. No actual unattended password rotation/reset mail, bcrypt audit or real-time PIN-lock certification. |
| Hardware / 3 | Unsaved 58/80mm preview/discard, exact print invocation, leading-zero HID input at 0/5/25ms, repeated/unknown scans and focus/manual calibration. Original duplicate-quantity HW-001 passes later on simple/service fixtures. Real USB/Bluetooth, native dialogs and physical paper require human evidence; emulation does not certify them. |
| Settings / 7 | Profile/email/website/BRN/Tax ID/VAT, MUR/Rs and decimals, VAT/inclusive preferences, Light/Dark/System, English/French/reload/document language and integrated flow. Later release checks pass many original SET-001..010 behaviors. Captured private baseline and specifically approved QA BRN are retained; broader document formatting/RBAC/accessibility is not inferred. |
| Help / 4 | Anonymous Terms/Privacy pointer and mobile keyboard behavior, authenticated Help navigation, copyright/build metadata and integrated flow. HELP-001 is fixed in later checks. Approved platform legal wording/version and authoritative build comparison remain unverified; historical HELP-002/003 observations are not current confirmed bugs. |

## Phase 2 modules and fix history

The original 18-module cycle covered all 65 Phase 2 register rows with scoped outcomes; it did not pass all requirements. The table relates those findings to later release evidence.

| Module / UI specs | Original findings and latest later evidence |
| --- | --- |
| Dashboard / 7 | Live data binding and branch filter fixed (P2-DASH-003/004); profit/margin and period views excluded (001/002). Live branch stock value/widgets were reconciled; underlying all-boundary financial policy is broader. |
| Bulk products / 4 | CSV/JSON completeness and per-branch/total stock export fixed (P2-BULK-001/004). Two-row import, validation, CRLF/quoted CSV and leading-zero barcode persistence exercised; owned imports archived. Advanced schemas/duplicate-conflict policy not certified. |
| Stores lifecycle / 3 | Live zero-stock branch closure/reopen and identity/count pass. Staff/branch behavior only observed with authorized mocks; no confirmed application ticket. Quota failure was not a bug. |
| Stock transfers / 5 | Real Draft -> Pending -> In Transit -> Completed, two-unit receipt, both branch balances and actor/date history pass. P2-TRANSFER-001 was withdrawn as a premature readiness finding. Partial shipments/concurrency/Phase 3 dispute flows not certified. |
| Stock counts / 5 | Monetary variance, exact generated adjustment linkage and first positive branch balance fixed (P2-COUNT-002/004/005). Surplus/shortage and independent fresh-count readback used. Frozen cost is an arithmetic oracle; full acquisition-cost policy is not certified. |
| POS extensions / 4 | Held-cart persistence/resume/checkout fixed (P2-POS-002). Receipt/formal invoice and print checked. Existing export issue reused RET-002 rather than duplicating it. |
| Cash register / 6 | Opening float/notes, balanced/over/short closure, cashier/history and service cash-sale increment pass. Cash movements and X/Z reports excluded. Owned shifts closed; unrelated active drawer blocks mutation. |
| Quotations / 6 | Correct saved route, status and one-time conversion fixed (P2-QUOTE-001). Notes/terms/line and document discounts persist; customer PDF Notes omission remains P2-QUOTE-002. Acceptance alone leaves stock unchanged; conversion stock delta checked. |
| Credit notes / 8 | Invoice-linked credits and A4 print checked; reasons fixed (P2-CN-002); partial/final refund and over-refund controls pass. Restock excluded; allocation under P2-CN-004 undelivered. Includes a scoped debit-print regression, not full Phase 3 debit-note acceptance. |
| Purchase orders / 7 | Missing required delivery branch originally blocked all creation (P2-PO-001), then fixed. MUR/default branch/totals, approval/order, partial/final receipts and actual PDF pass. Additional supplier-specific entered tax amount and inactive-vendor rejection checked. |
| GRN / 8 | Originally four PO-dependent checks blocked by P2-PO-001. Later real PO receipts are verified in Purchasing; restock cost fixed (P2-GRN-002). Standalone supplier GRN excluded (003); minimal/optional-field acceptance cannot pass until reachable. Stock-only Restock is a separate exercised action. |
| Bills/AP / 4 | Direct bill identity/totals/dates, manual installments and overdue/future liabilities exercised. Payment reference/default due amount fixed (P2-AP-002). Original PO-linked prerequisites belong to the old blocked cycle; don't treat every original AP integrated case as rerun. |
| Supplier history / 5 | Non-zero bill/payment ledger originally missing (P2-SUPH-001), later fixed; fresh supplier PO/receipt linkage and bill/payment references verified. |
| Reports / 7 | Product performance, complete low stock and Rs formatting fixed (P2-REP-002/003/005). Positive initialized stock valuation control and complete catalog oracle used. Custom dimensions, VAT/fiscal and PDF export excluded (001/004/006). Zero-stock omissions were never used alone to assert wrong asset value. |
| Document templates / 5 | Modern/Classic/font/watermark/primary-color/note persistence and preview exercised, with baseline restoration. Actual Classic dark color remains P2-DOC-004; secondary color excluded. Logo selection/display/discard is local-only, not saved-logo/output certification. |
| Users/RBAC / 6 | Live role choices inspected; invitation/join/role/suspend/reactivate/remove driven through in-memory mocks. Four mock passes and two observations here, plus two branch observations in Stores. No real production role enforcement/revocation/branch-isolation proof. |
| Audit logs / 3 | Live owned bill create/update/delete and real product export; filters/search with a no-match control. P2-AUD-001/003/004 fixed. Only the newly created unpaid/unused bill was deleted. Phase 3 audit diffs/export excluded. |
| Notifications / 4 | Unique low/out alerts, own-alert read persistence, live unread badge, product navigation and filters pass. Immediate overdue alert fixed (P2-NOT-002); fresh issue trigger correlated to notification. Original preferences restored and owned trigger invoices cancelled. Duplicate-alert rule unspecified. |

## Automation architecture

**Runtime:** Node 22+, TypeScript through Playwright, pinned `playwright` 1.62.1, ESM package. No application build, database implementation or full TypeScript typecheck configuration is provided. Python `pypdf` parses PDFs; Poppler supports rendering/inspection. `PDF_PYTHON` can explicitly select an interpreter; helpers also try an older bundled-runtime path and then `python`.

**Execution:** one worker, no retries and no parallel module runs. Main config defines per-module Chromium projects and setup/teardown dependencies. Products reuse a worker login to reduce valid-login rate limiting. Phase 2 uses `PHASE2_MODULE`/`PHASE2_STAGE`, 1920 x 1080 headless and maximized headed mode. Some older Phase 1 modules have different fixtures/guards; do not assume every suite inherits the shared Phase 2 interceptor.

**Test structure:** independent requirement specs plus integrated `*-full-flow.ui.spec.ts` files. Shared module helpers contain UI adapters and business oracles. Integrated flows often continue independent steps with soft assertions/attached outcomes; a failed earlier dependency does not prove an unreached later behavior.

**Targets and requests:** `appPath` preserves `/app`. `.env` supplies credentials and explicit origin/disposable-production opt-ins. Generic API writes forbid production; later UI suites allow the specifically opted-in QA target. Phase 2 `writeScope` verifies the selected QA company and opens only scoped mutation paths, while request journals classify unexpected writes separately. Staff mock handlers fulfill recognized fake mutations locally.

**Read oracles:** actual observed browser GET URLs/contracts may be reread with in-memory session headers. UI saves are checked against persisted records, exact IDs/references, fresh reloads and independent arithmetic. Auth headers are not report artifacts. Public fingerprinted JS/CSS may be replayed from byte-identical worker cache to avoid Chromium loading stalls; HTML and business API traffic remain live.

**Restoration:** capture stock/settings/template/preferences before changes; use `finally` plus cleanup projects and private ledgers. Restore branch balances with compensating adjustments, close owned shifts, cancel owned notification invoices, restore branch status and archive/deactivate owned imports/contacts. Compensation is **not** a refund or accounting reversal. Synthetic sales, invoices, credits, bills and history intentionally remain.

**Documents and printing:** require actual download or actual authenticated print view, PDF signature/EOF and parser checks, exact saved identity, amount/text and where relevant media box/color checks. `window.print` interception covers contexts/popups and avoids physical jobs. Browser-created PDFs of legitimate print views are distinguished from native downloads. A broken export URL is never rewritten to fabricate a passing document.

**Classification:** `helpers/phase2-assessment.mjs` separates PASS, FAIL, BLOCKED, MOCK PASS, MOCK OBSERVATION and AUTOMATION REVIEW. The assessor takes the latest executed result for each project/file/title across completed attempts. Skipped/interrupted attempts do not supply a new passing verdict. Known bug annotations cannot conceal unrelated cleanup/transport errors. Raw CLI failure counts therefore differ from reviewed bug counts.

## Errors corrected in automation

These are historical harness fixes, not application bug tickets:

- Wait for actual settings/dashboard/branch hydration and debounced server search; stale placeholders and disabled-loading selectors caused premature conclusions.
- Withdraw P2-TRANSFER-001 after waiting for enabled branch controls, then execute the reachable transfer lifecycle. Match transfer IDs by the ID column, not any numeric cell.
- Update Actions menus, exact headings, translated placeholders, cart/list scoping, dialog labels and dynamic status badges after redesigns.
- Use the correct QA adjustment endpoint; parse cells such as `0 Out` numerically and reject nonfinite deltas. Invalid guarded attempts did not become successful stock writes.
- Replace unsupported SVG upload input with a supported PNG; an invalid fixture was not an application image-persistence defect.
- Reuse product login and rerun rate-limited probes sequentially; do not automatically replay uncertain financial mutations.
- Observe child-window print calls, match canonical saved invoice numbers rather than internal IDs, and accept deployed POS number prefixes.
- Correct Settings language/theme synchronization and restore readiness; preserve the approved BRN baseline instead of adopting arbitrary current settings.
- Select the actual notification main-feed response, paginate owned alert readback and await a fresh unread-count response.
- Add newly required credit reasons/debit due date, use valid linked QA invoices, normalize PDF extraction spacing and require both debit product name and SKU.
- Correct Help feature/case mapping by stable IDs, not array positions. Pending legal delivery remains separate from legal-link form submission.
- Strengthen classification so mocked success cannot imply production authorization and unrelated exceptions cannot hide behind a known bug.

## Confirmed requirements and decisions to retain

| Topic | Established instruction |
| --- | --- |
| Bug reports | Follow root `AGENTS.md`: separate heading/ID, then Title, Environment, Priority, Step-by-step, Expected Result, Actual Result, Attachment, Comment in that order. Number reproduction steps. Put a standalone horizontal rule after every bug, including the last. Group duplicate causes; separate application defects, corrected automation and unconfirmed observations. |
| Supplier identity | BRN and Tax ID are separate and optional. Negative overdue days can be legitimate; that does not resolve editable configured-credit-period semantics. |
| Company fiscal identity | BRN, Tax ID and VAT registration number are independent. Test conditional VAT fields with registration enabled. |
| Money display | MUR uses an `Rs` prefix. Decimal display has an on/off control, enabled by default with two decimals; no arbitrary precision/separator selector is required. Existing-company checks do not establish a new-company default. |
| Settings baseline | User explicitly approved retaining `QA-BRN-2026`. Original blank baseline is privately backed up. That acceptance did not waive the clearing regression. Do not delete or recapture the baseline casually. |
| Password policy | Minimum eight characters, lowercase, uppercase and number. Symbol optional; strength bar reaches strongest with a symbol. UI feedback does not prove backend policy/hashing. |
| Inactivity | Latest requirement is 30 minutes idle -> PIN lock, user-configurable; remove Auto-logout; user sets PIN in onboarding. The feature was later explicitly deferred. Never substitute the older 15-minute proposal or report a simulated clock as real elapsed-time certification. |
| Staff | User authorized mock data/fake join URL. `/app/users-roles?qa_mock_join=...` is the harness handoff, not a discovered real acceptance route. Do not re-request the obsolete mailbox prerequisite for those mock cases. Real staff enforcement still needs an activated identity. |
| Export stock | Include every branch as a column and a total across all branches; reconcile actual branch names/balances rather than hard-coded matrix assumptions. |
| GRN | Separate supplier GRN without a PO is required. Only supplier/product/quantity mandatory; other user inputs optional. Stock-only Restock does not satisfy it. |
| Notifications | Low-stock and overdue-invoice alerts expected immediately, with bounded delivery polling and unique records. No deduplication policy was specified. |
| Branding | Classic dark mode must preserve chosen brand color. This policy is resolved; use `CLASSIC_DARK_BRANDING_POLICY=preserve` for the regression. |
| Help | Approved Terms/Privacy and authoritative release references were not supplied. Public legal controls must still avoid submitting/validating login. Editable company policy text is not approved platform legal content. |

## Evidence handling and remaining certification gaps

An isolated attempt normally contains `execution.json`, `console.log`, `results.json`, `junit.xml`, `playwright-report/index.html`, artifacts/downloads and a safe journal. Module assessments and campaign registers select the reviewed composite; opening the newest single HTML report can omit cases established by earlier focused runs. Local links must be uploaded as actual attachments when sharing tickets externally.

Do not infer full acceptance from test collection, mocked UI results, field availability, an empty account, a successful toast, setup/cleanup passes or a completed test cycle. Still outside established certification: physical scanner/printer/native-dialog acceptance, mobile builds, real payment-provider settlement, backend bcrypt/reset-token audit, actual credential reset/update, real-time PIN locking/unlock/API protection, real staff permissions/revocation, cross-company isolation, approved legal wording, and a deployment-matched commit. Phase 3 remains a requirements backlog, apart from incidental scoped regressions such as debit printing.

Private auth/cookie/token content was not copied into this handover. Local recovery metadata reviewed on 12 November shows restored inventory/report stock/template/transfers, a closed register, empty branch/import/held queues, all nine retained notification-trigger invoices marked cancelled, and the Settings baseline not pending. These are local ledger states backed by prior runs, not new live stock verification today.

## Local verification performed during reconstruction

- `node --test checks/*.test.mjs`: **76 passed, zero failed/skipped**. This includes the Phase 2 assessor and release-classification checks that `npm run test:guard` does not include.
- Main Playwright config collection: **238 cases in 88 files**. This is discovery/transpilation, not live execution or full static typechecking.
- Separate Phase 2 collection: all **18 modules collect successfully**, totaling 165 module-expanded cases with repeated shared setup/cleanup cases. Do not add this to historical acceptance percentages.
- Smoke/API collection: `chromium-smoke`, `api-read` and `api-write` currently return **No tests found**. The original standalone anonymous/read/write specs are absent from this checkout; module exclusions leave the default smoke project empty. `npm test`, `test:phase1`, generic cross-browser commands and CI's `npm test` therefore do not provide the starter coverage described in the README.
- All 189 discovered Playwright `results.json` files parse successfully. Latest saved live attempts end on 5 November. Earlier HTML/JUnit-only archives also exist and are not counted as those JSON snapshots.
- All 116 local PDFs in output/archives/test-results parse successfully (116 total pages). The three summary pages and latest invoice/quotation/debit evidence were rendered and visually inspected; the variant screenshot and saved pointer/CSS evidence were also reviewed. This is document inspection, not a fresh live verdict.
- All 16 primary latest-ticket attachment paths exist. No unresolved relative source imports were found in the scanned TypeScript/JavaScript import declarations.

## Repository state and continuation

Current local branch is `main`; remote is `https://github.com/FuadTwaheerP/nexstock-testing.git`. Local history has only two commits, 12 and 16 October, and only 37 tracked files. Much of the later automation, findings and reports is untracked; several original tracked files have local changes. **Do not reset, clean or assume the remote contains this work.** No Git modification was made during reconstruction. Ignored `blob-report/`, auth, reports and recovery files are not protected by a normal source-only commit.

For the next live task, confirm its intended scope and deployment evidence from the new request, then run only the relevant modules serially. Preserve a fresh campaign root instead of adding evidence to an old dated campaign. The existing runner defaults still point to October campaign folders.

```powershell
# Read-only local framework checks
node --test checks/*.test.mjs
node node_modules/playwright/cli.js test --list --reporter=line

# Examples for a subsequently requested live retest, using a fresh campaign
$env:RELEASE_RUN_ROOT = 'blob-report/archive/<new-campaign>/phase1'
$env:PHASE2_ARCHIVE_ROOT = 'blob-report/archive/<new-campaign>/phase2'
$env:CLASSIC_DARK_BRANDING_POLICY = 'preserve'
node scripts/run-release-retest.mjs invoicing branded-pdf-print.ui.spec.ts
node scripts/run-phase2.mjs quotations commercial-terms.ui.spec.ts
node scripts/assess-phase2.mjs quotations
```

The existing ignored environment must pass the appropriate target/disposable-account guards. Do not use `--no-deps`, concurrent modules, a real tenant, arbitrary baseline adoption or forced interactions to get a green result. Inspect the assessment and cleanup before proceeding after a nonzero exit.

This handover records what can be established from the available project. It cannot recover unrecorded decisions from the lost chat, missing original application source, or evidence that was never saved. Generated binaries/screenshots were inventoried and primary evidence sampled; dependency internals and every duplicate image were not manually audited.
