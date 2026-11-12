# Quotations & Cost Estimates - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **3 passed, 5 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **3 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Creation validates the QA customer, two items at Rs 93.25, document discount 10%, total Rs 167.85, explicit 17-day validity and saved draft/accepted status. It does not certify the missing custom terms/notes capability.
- Status transitions and accepted-quote conversion stop at the confirmed broken saved-document route. These downstream steps have not passed.
- No emails were dispatched. Native PDF content, branding and physical printing are not certified because the actual export opens 404.
- Saved synthetic quotations remain as evidence; no historical records were deleted.

## Confirmed application bugs

## P2-QUOTE-002

### Title

Quotation editor has no custom payment terms, notes or per-line discount fields

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F11-a, F11-b.

### Priority

Medium

### Step-by-step

1. Open Quotations > New Quotation.
2. Select the QA billing customer and add a product row.
3. Inspect row pricing, customer details and Billing totals for commercial fields.
4. Try to set separate line discounts, custom payment terms and a negotiated note.

### Expected Result

Each line supports its own discount, and the quotation allows custom payment terms and notes that persist after saving.

### Actual Result

The editor exposes editable unit prices and a single document-level discount. No custom payment terms, notes or line discount controls are present. Deployed client payload sets notes to an empty string and generates fixed validity terms.

Affected cases:

- F11-b custom payment terms notes and individual line discounts

### Attachment

- [P2-QUOTE-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-commercial-term-1a79b-d-individual-line-discounts-phase2-quotations/attachments/P2-QUOTE-002-484f5de4a3ef230f0894ab44480a77d9f796c48f.png)
- [F11-b custom payment terms notes and individual line discounts - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-commercial-term-1a79b-d-individual-line-discounts-phase2-quotations/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-assessment.json)

### Comment

Add the required editable commercial fields to creation/editing, persist them, and include them in the quotation output. The verified editable unit price/document discount is not a substitute for these explicit requirements.

---

## P2-QUOTE-001

### Title

Saved quotation View opens an invoice route and displays Invoice Not Found

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F11-a, F11-d, F11-e.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and open Quotations.
2. Create a quotation for QA Billing Automation Customer, select QA add mv9rtxw1-3b087e, set quantity 2, price Rs 93.25, 10% discount and a future expiry.
3. Save as Draft; confirm the record and Rs 167.85 total appear in the list.
4. Click the saved row's eye/View button.
5. Repeat with a newly created quotation using Mark Accepted & Save.

### Expected Result

View displays the saved quotation and its commercial details, status workflow, and invoice conversion action for accepted quotations.

### Actual Result

The eye action navigates to /app/invoicing/<quotation-id>. The page displays Invoice Not Found instead of the quotation; both draft and accepted records reproduce it.

Affected cases:

- F11-e accepted quotation exposes tax invoice conversion
- Quotation creation review status conversion full flow
- F11-d saved draft exposes status pipeline

### Attachment

- [P2-QUOTE-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-invoice-convers-32d7e-oses-tax-invoice-conversion-phase2-quotations/attachments/P2-QUOTE-001-0d055c9b86973ad23e9142685bb10a5f2a9a1337.png)
- [P2-QUOTE-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-quotations-full-f5cda-version-full-flow-full-flow-phase2-quotations/attachments/P2-QUOTE-001-f672593f7552be12b4beeeaddad92db60fca9b3d.png)
- [P2-QUOTE-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-status-pipeline-907b6-aft-exposes-status-pipeline-phase2-quotations/attachments/P2-QUOTE-001-587f01eadbfb9eaf0526061db588786b39761702.png)
- [F11-e accepted quotation exposes tax invoice conversion - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-invoice-convers-32d7e-oses-tax-invoice-conversion-phase2-quotations/error-context.md)
- [Quotation creation review status conversion full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-quotations-full-f5cda-version-full-flow-full-flow-phase2-quotations/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-assessment.json)

### Comment

Fix the quotation row route/document resolver and provide its status and conversion actions. Retest all lifecycle branches and verify a converted invoice preserves items, prices, customer and totals. Multiple dependent failures are grouped here; no separate status/conversion defect is assumed.

---

## RET-002

### Title

Quotation PDF export reproduces the existing document export 404

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F11-c.

### Priority

High

### Step-by-step

1. Create and save an isolated QA quotation.
2. In Quotations, click Download PDF on its row.
3. Inspect the actual popup URL and content.

### Expected Result

The action opens or downloads the selected quotation's branded, printable document.

### Actual Result

It opens public /invoicing/<quotation-id>?print=true outside /app and displays 404 / That page is not here.

Affected cases:

- F11-c saved quotation branded PDF and print entry point

### Attachment

- [RET-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-pdf-print.ui-F1-510f1-d-PDF-and-print-entry-point-phase2-quotations/attachments/quotation-export-popup-4f4508c7bfd93518a63eb2951e66f7fa07790813.png)
- [RET-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-pdf-print.ui-F1-510f1-d-PDF-and-print-entry-point-phase2-quotations/attachments/RET-002-23b8876d30c6f055da77514cbb018afa0c5b0ea1.png)
- [F11-c saved quotation branded PDF and print entry point - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-pdf-print.ui-F1-510f1-d-PDF-and-print-entry-point-phase2-quotations/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-assessment.json)

### Comment

Update the existing RET-002 ticket rather than creating another export ticket. Correct both the application base path and quotation document routing; then validate actual output branding, content and printing.

---

## Corrected automation / maintenance - not application tickets

- The first detail diagnostic looked only for a loading image. The eventual server-backed state is Invoice Not Found. The adapter now waits for that explicit state or document controls; all three affected cases were rerun.
- The quotation save button is a menu; tests use Save as Draft or Mark Accepted & Save, never Save & Dispatch Email.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | quotations-2 |
| F11-b custom payment terms notes and individual line discounts | FAIL - P2-QUOTE-002 | quotations-1 |
| F11-a customer items negotiated price discount and expiry persist independently | PASS | quotations-1 |
| F11-e accepted quotation exposes tax invoice conversion | FAIL - P2-QUOTE-001 | quotations-2 |
| F11-c saved quotation branded PDF and print entry point | FAIL - RET-002 | quotations-1 |
| Quotation creation review status conversion full flow | FAIL - P2-QUOTE-001 | quotations-2 |
| F11-d saved draft exposes status pipeline | FAIL - P2-QUOTE-001 | quotations-2 |
| audit Phase 2 write scope and log out QA session | PASS | quotations-2 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs quotations
node scripts/assess-phase2.mjs quotations
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
