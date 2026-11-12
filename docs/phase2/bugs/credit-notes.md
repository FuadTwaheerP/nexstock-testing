# Credit Notes - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **4 passed, 4 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **3 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Each saved-credit scenario creates its own paid Rs 100 QA invoice and invoice-linked credit, verifies the saved customer/invoice/amount/remaining credit, and retains synthetic fiscal records as evidence.
- Missing return reasons, restock selection and allocation/refund controls prevent their end-to-end business effects from being certified.
- Both document Print and PDF buttons invoke the browser print workflow. The actual application print view was captured as a one-page A4 PDF and visually inspected; no native file download or physical printer is certified.
- QA product stock is captured across five branches and restored. The first diagnostic's invalid baseline parser was corrected; no NaN adjustment reached the server.

## Confirmed application bugs

## P2-CN-004

### Title

Saved invoice-linked credit has no allocation or cash-refund action

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F13-d.

### Priority

High

### Step-by-step

1. Create an isolated paid Rs 100 QA invoice for QA Billing Automation Customer.
2. Create a Rs 100 Credit Note linked to that exact invoice using the available Save as Draft action.
3. Confirm the saved record exists with status open and remaining balance Rs 100.
4. Open its eye/View action and inspect available controls.

### Expected Result

The available credit can be applied through an invoice allocation workflow or settled as an explicitly recorded cash refund.

### Actual Result

The saved detail exposes Print and PDF only. There is no apply-credit, allocation, activation/issue transition or cash-refund action, leaving the recorded Rs 100 credit inaccessible for settlement.

Affected cases:

- F13-d credit allocation and cash refund entry points
- Linked invoice credit creation allocation full flow

### Attachment

- [P2-CN-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-credit-alloca-377e6-nd-cash-refund-entry-points-phase2-credit-notes/attachments/P2-CN-004-75ba7a5fc58bff4e2ea280d1703f0138f0f28eb5.png)
- [P2-CN-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-credit-notes--0635a-ocation-full-flow-full-flow-phase2-credit-notes/attachments/P2-CN-004-03e9bfaa70a39b5e2fd61ddd76c6eea885dc0403.png)
- [F13-d credit allocation and cash refund entry points - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-credit-alloca-377e6-nd-cash-refund-entry-points-phase2-credit-notes/error-context.md)
- [Linked invoice credit creation allocation full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-credit-notes--0635a-ocation-full-flow-full-flow-phase2-credit-notes/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-assessment.json)

### Comment

Add the credit lifecycle and allocation/refund controls with balance updates and audit linkage. Saved open credit was observed; do not assume money moved or log a separate cash-refund processing defect without an accessible action.

---

## P2-CN-003

### Title

Credit Note has no optional return-to-stock or warehouse selection

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F13-c.

### Priority

High

### Step-by-step

1. Open Credit Notes > Create Credit Note in the QA company.
2. Select a QA customer and an inventory product line.
3. Inspect all creation controls for return-to-stock and receiving warehouse options.
4. Inspect the saved credit's available actions.

### Expected Result

A product return can optionally restock the selected warehouse; leaving the option off should preserve stock.

### Actual Result

Creation has customer, linked invoice, dates, product/quantity/price and discount controls, but no restock toggle or warehouse selector. Saved detail offers printing only.

Affected cases:

- F13-c optional return to warehouse stock

### Attachment

- [P2-CN-003 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-inventory-res-e762d-l-return-to-warehouse-stock-phase2-credit-notes/attachments/P2-CN-003-335d43757a25fbe89690550717da6e79841f410b.png)
- [F13-c optional return to warehouse stock - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-inventory-res-e762d-l-return-to-warehouse-stock-phase2-credit-notes/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-assessment.json)

### Comment

Implement the optional restock workflow and preserve location/quantity linkage. Retest both enabled/disabled cases and branch isolation; no stock effect is claimed passed from this missing-UI check.

---

## P2-CN-002

### Title

Credit Note editor does not support return or adjustment reason logging

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F13-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Credit Notes > Create Credit Note.
2. Select QA Billing Automation Customer and add a product line.
3. Look for a return reason or adjustment type such as Product return, Billing correction or Price concession.
4. Save an invoice-linked QA credit and reopen its detail.

### Expected Result

A user can record the return/adjustment reason and see it retained with the credit note.

### Actual Result

There is no reason input or reason selection in the editor. The save payload sends reason and reasonCode as empty strings; the saved QA credit retains an empty reason.

Affected cases:

- F13-b product return billing correction and concession reason logging

### Attachment

- [P2-CN-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-return-reason-5fb08-d-concession-reason-logging-phase2-credit-notes/attachments/P2-CN-002-2e1fa27b3e750ec8e035c100648bdfbedfddc60d.png)
- [F13-b product return billing correction and concession reason logging - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-return-reason-5fb08-d-concession-reason-logging-phase2-credit-notes/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-assessment.json)

### Comment

Add a reason field/type, preserve it in the saved record and show it on the official voucher/history. This ticket covers the missing capability rather than inventing mandatory validation or reason-code policy.

---

## Corrected automation / maintenance - not application tickets

- Changed stock-cell parsing from Number('0 Out') to the established numeric parser, added finite-value guards before baseline capture/restoration/writes, and reran the full module. The earlier owned +3 seed was restored using its exact write journal, last verified branch baseline and current matrix; other branches were unchanged.
- Restoration reads the matrix once before compensation and once after; each changed QA branch is verified against the captured baseline.
- Added actual PDF text/media-box validation and a focused print rerun. The generated app print-view PDF was rendered with Poppler and visually checked.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | credit-notes-3 |
| F13-a save and reopen credit note linked to isolated QA invoice | PASS | credit-notes-2 |
| audit Phase 2 write scope and log out QA session | PASS | credit-notes-3 |
| F13-d credit allocation and cash refund entry points | FAIL - P2-CN-004 | credit-notes-2 |
| Linked invoice credit creation allocation full flow | FAIL - P2-CN-004 | credit-notes-2 |
| F13-c optional return to warehouse stock | FAIL - P2-CN-003 | credit-notes-2 |
| F13-e official linked credit voucher print and PDF | PASS | credit-notes-3 |
| F13-b product return billing correction and concession reason logging | FAIL - P2-CN-002 | credit-notes-2 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs credit-notes
node scripts/assess-phase2.mjs credit-notes
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
