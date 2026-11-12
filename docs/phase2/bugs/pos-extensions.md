# Point of Sale - Hold Orders and Formal Invoice Output - Phase 2 findings

Test date: **2026-10-25**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **3 passed, 3 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **2 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- QA service items are used so no stock is consumed. Cash entries are fictional QA bookkeeping with no payment gateway, printer hardware connection or external payment. Resulting paid POS records are retained as evidence.
- Cash checkout, linked QA Billing Automation Customer, receipt identity/amounts and print invocation pass. A corresponding formal paid invoice can be opened from Invoices and its Print action works. PDF content/page-size validation is blocked by the known export 404, so no A4 PDF is certified.
- Held cart persistence is confirmed by an own-order POST response and a same-session fresh GET containing the owned ID. The dialog remains empty after a 12-second UI rendering wait, preventing resume/restore/discard. The combined hold-to-checkout flow stops there; independent checkout cases cover the reachable fiscal path.
- Owned held orders remain as QA evidence because the defective empty dialog offers no row-level resume/discard controls. No invented deletion endpoint is called. The helper blocks re-certification if rows become visible until the newly reachable controls are inspected and restoration assertions completed.
- The still-populated post-Hold cart is retained as an unconfirmed UX observation, not a separate assumed bug. Branch/context or response mapping is a possible investigation path for the empty list, not a verified root cause.

## Confirmed application bugs

## P2-POS-002

### Title

Held Orders says no orders are on hold although the saved QA cart is returned by the API

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F08-j.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and open Point of Sale.
2. Add two units of the QA service product QA-SERVICE-mvmgbd15-fba79b; the cart total is Rs 200.00.
3. Click Hold and confirm the successful save response contains a held-order ID and the two-unit cart.
4. Reload POS in the same signed-in session and wait for the held-orders GET to finish.
5. Confirm that response contains the just-created ID, then open Held.
6. Wait at least 12 seconds and attempt to find and resume the saved order.

### Expected Result

The held cart appears in Held Orders and can be resumed with its products, quantity and prices restored. A successful save must result in a usable saved-cart entry for its branch/context.

### Actual Result

The POST saves the cart and its ID is present in the successful fresh GET, but Held Orders displays No orders on hold and provides no Resume/Discard row. The combined hold-resume-checkout flow cannot continue.

Affected cases:

- F08-j hold a QA service cart and display it after reload
- POS hold resume checkout and formal invoice full flow

### Attachment

- [P2-POS-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-5/artifacts/pos-extensions-hold-orders-6a99d-and-display-it-after-reload-phase2-pos-extensions/attachments/P2-POS-002-ffc90b1d1e65edb19fab77c7c33b0f25eb80fc51.png)
- [P2-POS-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-5/artifacts/pos-extensions-pos-extensi-d216b-invoice-full-flow-full-flow-phase2-pos-extensions/attachments/P2-POS-002-1195b94dde0d2d34c56a5f7ed9c17a4dcea7cd40.png)
- [F08-j hold a QA service cart and display it after reload - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-5/artifacts/pos-extensions-hold-orders-6a99d-and-display-it-after-reload-phase2-pos-extensions/error-context.md)
- [POS hold resume checkout and formal invoice full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-5/artifacts/pos-extensions-pos-extensi-d216b-invoice-full-flow-full-flow-phase2-pos-extensions/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-assessment.json)

### Comment

Verified with live production QA data and a rendering wait, not inferred from a save timeout or an assumed cart-clear policy. Investigate the frontend's response/branch filtering and ensure save, list and resume use consistent context. Keep the saved QA records for investigation or remove only their recorded owned IDs after the UI is repaired.

---

## RET-002

### Title

Known Round 1 issue: invoice PDF export opens a public 404 page for POS-generated invoices

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F08-k.

### Priority

High

### Step-by-step

1. In Nexstock QA Company, open POS and select QA Billing Automation Customer.
2. Sell one QA service item for Rs 100.00 using Cash, recording exactly Rs 100.00 received.
3. Verify the receipt and paid transaction, then open Invoices and find the newly saved invoice ID.
4. Open its detail view and verify the customer, service item, Rs 100.00 total and zero amount due. Its Print action invokes browser printing.
5. Return to the invoice list and click the saved record's download/PDF action.
6. Inspect the export popup and attempt to obtain the formal invoice PDF.

### Expected Result

Export opens a usable invoice print view or downloads the correct formal PDF. The generated document can be checked for invoice identity, customer, amounts and A4 output.

### Actual Result

The invoice is saved, paid and viewable, but export opens the public 404 page instead of an invoice document. No valid PDF is produced for content/page-size verification.

Affected cases:

- F08-k formal A4 invoice generation for a QA POS sale

### Attachment

- [RET-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-6/artifacts/pos-extensions-formal-invo-eced5-eneration-for-a-QA-POS-sale-phase2-pos-extensions/attachments/invoice-export-popup-f1c3697643878b72d77a4ac4addd8b5af77bc059.png)
- [RET-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-6/artifacts/pos-extensions-formal-invo-eced5-eneration-for-a-QA-POS-sale-phase2-pos-extensions/attachments/RET-002-85d3ac81a27ab0f90fa88179d783134c8718321e.png)
- [F08-k formal A4 invoice generation for a QA POS sale - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-6/artifacts/pos-extensions-formal-invo-eced5-eneration-for-a-QA-POS-sale-phase2-pos-extensions/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-assessment.json)

### Comment

This is the existing RET-002 from the Round 1 release retest, reproduced through the new Phase 2 POS scenario. Update/reopen the original ticket rather than log a duplicate. Fix application-prefix/export routing and retest authenticated invoice export. The test does not rewrite the broken URL or substitute a manufactured PDF for application output.

---

## Corrected automation / maintenance - not application tickets

- Removed an assumed immediate-cart-clear assertion from the initial probe. The confirmed failure now compares actual saved/read-back IDs with the dialog after a bounded rendering wait.
- The formal invoice exists and is reachable through Invoices. Missing A4 buttons in the thermal receipt alone is not reported as a defect.
- Context-wide print observation catches calls in popups/frames without submitting any physical print job. No gateway, hardware connection, email or refund action is triggered.
- The initial completion-screen probe is superseded by meaningful receipt-print and formal-document cases. A preliminary reachable-view blocker was resolved by inspecting and testing the actual Print/PDF controls.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | pos-extensions-6 |
| F08-j hold a QA service cart and display it after reload | FAIL - P2-POS-002 | pos-extensions-5 |
| audit Phase 2 write scope and log out QA session | PASS | pos-extensions-6 |
| F08-k formal A4 invoice generation for a QA POS sale | FAIL - RET-002 | pos-extensions-6 |
| POS hold resume checkout and formal invoice full flow | FAIL - P2-POS-002 | pos-extensions-5 |
| F08-k cash receipt matches the recorded QA sale and invokes printing | PASS | pos-extensions-5 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs pos-extensions
node scripts/assess-phase2.mjs pos-extensions
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
