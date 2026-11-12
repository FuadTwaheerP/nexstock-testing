# Standard Reports & Analytics - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **5 passed, 7 application-failing cases, 1 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **6 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Current catalogue cost valuation reconciles across all 71 products. A real +1 initialized QA stock adjustment increases cost value by Rs 40 and is restored. Later-page initial-balance valuation remains blocked by P2-COUNT-005; this is not a confirmed valuation defect.
- Low Stock completeness fails: 53 required depleted/critical SKUs are omitted while the report loads only its first 15 products. CSV download and history pass for that loaded subset; this does not certify full catalogue export completeness.
- Preset periods and branch controls exist. Missing custom date/cashier/payment-method controls are verified; existing filter wiring and unavailable tax/performance calculations are not certified.
- All temporary stock changes are restored across the five QA branches. Synthetic counts/adjustments remain as evidence.

## Confirmed application bugs

## P2-REP-006

### Title

Standard report PDF export is missing

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F20-f.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports
3. Open Download Format and inspect all options.

### Expected Result

Standard reports can be exported to PDF.

### Actual Result

Only CSV and Excel choices are available; PDF is absent.

Affected cases:

- F20-f standard report PDF export availability
- Standard reporting and actual export full flow

### Attachment

- [P2-REP-006 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--a41a0-ort-PDF-export-availability-phase2-reports/attachments/P2-REP-006-55f867ad29bd217feca222e99e1fadd3d6fbdc3e.png)
- [P2-REP-006 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-006-543c1a02de76c0b17cef8fc2070a4153d8daacaf.png)
- [F20-f standard report PDF export availability - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--a41a0-ort-PDF-export-availability-phase2-reports/error-context.md)
- [Standard reporting and actual export full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Implement PDF export and validate actual downloaded content, layout and complete data.

---

## P2-REP-005

### Title

Reports use dollar prefix for MUR financial values

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F20-a.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports in Nexstock QA Company
3. Read the Stock Cost Value and other monetary KPI cards.

### Expected Result

MUR amounts use the confirmed Rs prefix.

### Actual Result

Financial KPI cards display dollar-prefixed amounts, for example $500.00.

Affected cases:

- Reports honor the confirmed Rs currency prefix
- Standard reporting and actual export full flow

### Attachment

- [P2-REP-005 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--61841-onfirmed-Rs-currency-prefix-phase2-reports/attachments/P2-REP-005-78ea124b89933f44f5808ed5927768dad7bb96d3.png)
- [P2-REP-005 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-005-757d16c6a550a8a3ec71acca8a0d5b3731deb9c6.png)
- [Reports honor the confirmed Rs currency prefix - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--61841-onfirmed-Rs-currency-prefix-phase2-reports/error-context.md)
- [Standard reporting and actual export full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Use company currency formatting consistently, preserving the configured decimal preference.

---

## P2-REP-003

### Title

Low Stock report omits products beyond the first catalogue page

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F20-d.

### Priority

High

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Paginate the Products catalogue to collect all 71 active products
3. Identify inventory items at or below reorder point
4. Open Reports > Low Stock and compare their SKUs.

### Expected Result

Every eligible low-stock/out-of-stock catalogue item appears in the report.

### Actual Result

53 eligible depleted/critical SKUs are absent. Reporting loads 15 of 71 products. Current cost valuation still reconciles because omitted items have no positive verified stock.

Affected cases:

- F20-d complete depleted and critical stock report
- Standard reporting and actual export full flow

### Attachment

- [P2-REP-003 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-low-stock.ui-F20-d-ef3cd-d-and-critical-stock-report-phase2-reports/attachments/P2-REP-003-1c48ad5f7edaa1cffdf6a117987c8c8c96b99c58.png)
- [P2-REP-003 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-003-e72ad139b8574bc0dd1d925730994c02b8faf511.png)
- [F20-d complete depleted and critical stock report - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-low-stock.ui-F20-d-ef3cd-d-and-critical-stock-report-phase2-reports/error-context.md)
- [Standard reporting and actual export full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Load the complete applicable dataset or aggregate server-side. Do not infer an incorrect asset total from zero-stock omissions; later-page positive initialization is separately blocked by P2-COUNT-005.

---

## P2-REP-002

### Title

Product sales performance report is unavailable

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F20-b.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports
3. Inspect Report Focus choices and Business & Sales content.

### Expected Result

A product performance report ranks products by quantity sold and revenue contribution.

### Actual Result

There is no product performance/top-seller report; a revenue trend and stock movement do not provide ranked product revenue.

Affected cases:

- F20-b top sellers quantities and revenue contribution report
- Standard reporting and actual export full flow

### Attachment

- [P2-REP-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-product-performanc-14233-revenue-contribution-report-phase2-reports/attachments/P2-REP-002-32aaa7fba16574cc08f8683f2e520abe99603bd3.png)
- [P2-REP-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-002-ea5a16aa500f01a37269703c95b273d5b560c423.png)
- [F20-b top sellers quantities and revenue contribution report - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-product-performanc-14233-revenue-contribution-report-phase2-reports/error-context.md)
- [Standard reporting and actual export full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Implement the required report and reconcile quantities and revenue with known sales.

---

## P2-REP-001

### Title

Sales reporting lacks custom date, cashier and payment-method filters

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F20-a.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports > Business & Sales
3. Inspect Reporting Horizon, branch controls and available filters.

### Expected Result

Sales reporting supports custom start/end dates, cashier and payment-method filtering.

### Actual Result

Only preset reporting horizons and branch controls are available. Custom date inputs, cashier and payment-method controls are absent.

Affected cases:

- Standard reporting and actual export full flow
- F20-a sales date range payment method cashier and branch dimensions

### Attachment

- [P2-REP-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-001-3f221485084e2344c7a1fb19969688fc23abb352.png)
- [P2-REP-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-sales-summary.ui-F-6eaf0-shier-and-branch-dimensions-phase2-reports/attachments/P2-REP-001-927f75abccbb110ea7d07498b23b69559cff4f8d.png)
- [Standard reporting and actual export full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/error-context.md)
- [F20-a sales date range payment method cashier and branch dimensions - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-sales-summary.ui-F-6eaf0-shier-and-branch-dimensions-phase2-reports/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Add the missing dimensions and verify them against non-zero QA sales. Existing branch/preset wiring is not declared broken.

---

## P2-REP-004

### Title

VAT and fiscal reporting is unavailable

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F20-e.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports
3. Inspect Report Focus choices and Business & Sales tax content.

### Expected Result

Fiscal reporting distinguishes standard VAT, zero-rated sales and net tax liability.

### Actual Result

Only aggregate tax-collected text exists; no VAT/fiscal report is available.

Affected cases:

- Standard reporting and actual export full flow
- F20-e standard zero-rated and net VAT fiscal report

### Attachment

- [P2-REP-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-004-d7517403d1f5c481aaf2d7f673e544762c5348d0.png)
- [P2-REP-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-tax-vat.ui-F20-e-s-bd00f-d-and-net-VAT-fiscal-report-phase2-reports/attachments/P2-REP-004-fa6987483f8cab4783108a06a9df67d2a8fcfc95.png)
- [Standard reporting and actual export full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/error-context.md)
- [F20-e standard zero-rated and net VAT fiscal report - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-tax-vat.ui-F20-e-s-bd00f-d-and-net-VAT-fiscal-report-phase2-reports/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Provide the required tax breakdown and reconcile it against eligible transactions. No guessed tax calculation is reported as a bug.

---

## Corrected automation / maintenance - not application tickets

- Replaced premature count hydration assumptions with saved/reopened values and independent physical snapshot verification. This exposed P2-COUNT-005, reported in Stock Counts.
- Separated current valuation, a positive initialized balance control and blocked later-page initialization. The full flow uses the independent initialized fixture to avoid a slow unrelated prerequisite.
- Reviewed final composite reruns: no unresolved automation errors.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | reports-6 |
| F20-f actual CSV download arithmetic and browser export history | PASS | reports-1 |
| F20-f standard report PDF export availability | FAIL - P2-REP-006 | reports-1 |
| Reports honor the confirmed Rs currency prefix | FAIL - P2-REP-005 | reports-1 |
| F20-c complete inventory valuation at cost across catalogue | PASS | reports-5 |
| F20-d complete depleted and critical stock report | FAIL - P2-REP-003 | reports-1 |
| F20-b top sellers quantities and revenue contribution report | FAIL - P2-REP-002 | reports-1 |
| Standard reporting and actual export full flow | FAIL - P2-REP-001, P2-REP-002, P2-REP-003, P2-REP-004, P2-REP-006, P2-REP-005 | reports-6 |
| F20-a sales date range payment method cashier and branch dimensions | FAIL - P2-REP-001 | reports-1 |
| F20-e standard zero-rated and net VAT fiscal report | FAIL - P2-REP-004 | reports-1 |
| audit Phase 2 write scope and log out QA session | PASS | reports-6 |
| F20-c valuation includes newly counted later-page QA inventory | BLOCKED | reports-5 |
| F20-c positive cost-value change from an owned QA branch adjustment | PASS | reports-6 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs reports
node scripts/assess-phase2.mjs reports
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
