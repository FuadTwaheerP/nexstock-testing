# Release fix verification — 4 November 2026

Production: https://nexstock.stylotech.mu/app · Nexstock QA Company · Windows / Chromium. Fresh 4 November results follow the user’s deployment confirmation. Counts measure unique release-ticket closure.

Retesting is complete: **5 confirmed application issues** and **0 unresolved automation errors**. Final scoped cases: **58 passed, 8 application-failing cases, 0 blocked checks**; all **38 setup/cleanup checks** pass. Repeated failures are grouped by their underlying ticket.

## Phase 1 Round 2

| Ticket | Result | Verified scope |
|---|---|---|
| RET-001 | FIXED | Existing QA customer lookup (lowercase/uppercase), VAT checkout, receipt print and a fresh empty order. |
| RET-002 | PARTIAL | Native invoice/quotation downloads and identity/amounts work. Company Settings header and bank/payment notes remain absent from invoice PDFs. Credit/debit print views are checked separately. |
| RET-003 | OPEN | Variant scroll content covers the action footer at 1920 x 1080 and 1440 x 900. |
| RET-004 | FIXED | Active positive control remains selectable, inactive QA vendor is excluded, and API rejects an inactive supplier with HTTP 422. |

Separate Help Round 1 fix: **HELP-001 FIXED** — Terms/Privacy desktop and mobile navigation do not submit/validate login. Approved legal wording and an authoritative build version remain outside this check.

## Phase 2 release claims

**21 fixed · 3 partially fixed** out of 24 addressed tickets.

| Ticket | Result | Verified scope / limitation |
|---|---|---|
| P2-PO-001 | FIXED | Delivery branch and MUR default persist; approval, partial/final receiving and real PO PDF pass. |
| P2-POS-002 | FIXED | Persisted held cart resumes with two units/Rs 200; other holds remain; checkout and formal invoice pass. |
| P2-QUOTE-001 | FIXED | Saved quote route/status/PDF and one-time conversion pass; acceptance moves no stock. Notes, terms and line/document discount arithmetic persist. |
| P2-QUOTE-002 | PARTIAL | Notes/terms and discounts persist and the web view displays them, but customer-facing Notes are missing from the actual quotation PDF; terms and totals print correctly. |
| P2-COUNT-002 | FIXED | Frozen-cost variance arithmetic, exact count-linked adjustment history and first positive balance creation pass. Stock is restored. |
| P2-COUNT-004 | FIXED | Frozen-cost variance arithmetic, exact count-linked adjustment history and first positive balance creation pass. Stock is restored. |
| P2-COUNT-005 | FIXED | Frozen-cost variance arithmetic, exact count-linked adjustment history and first positive balance creation pass. Stock is restored. |
| P2-DASH-003 | FIXED | Configured revenue/orders/AOV, chart and product ranking bind live stats; branch selector reconciles displayed stock value. |
| P2-DASH-004 | FIXED | Configured revenue/orders/AOV, chart and product ranking bind live stats; branch selector reconciles displayed stock value. |
| P2-REP-002 | FIXED | Complete low-stock and inventory valuation; product sales quantity/revenue delta and draft/cancelled exclusion; CSV and Rs formatting. |
| P2-REP-003 | FIXED | Complete low-stock and inventory valuation; product sales quantity/revenue delta and draft/cancelled exclusion; CSV and Rs formatting. |
| P2-REP-005 | FIXED | Complete low-stock and inventory valuation; product sales quantity/revenue delta and draft/cancelled exclusion; CSV and Rs formatting. |
| P2-BULK-001 | FIXED | CSV/JSON include the complete catalogue; branch columns and totals reconcile against Store Inventory. |
| P2-BULK-004 | FIXED | CSV/JSON include the complete catalogue; branch columns and totals reconcile against Store Inventory. |
| P2-GRN-002 | FIXED | Restock estimate uses cost Rs 40 rather than selling price Rs 100. |
| P2-AUD-001 | FIXED | Fresh create/update/delete/export logs; module/user/action/date filters; actor search with a no-match control. |
| P2-AUD-003 | FIXED | Fresh create/update/delete/export logs; module/user/action/date filters; actor search with a no-match control. |
| P2-AUD-004 | FIXED | Fresh create/update/delete/export logs; module/user/action/date filters; actor search with a no-match control. |
| P2-DOC-004 | PARTIAL | Classic dark invoice/quotation/credit-note views override the chosen brand colour. The user confirmed that colour must be preserved. Modern, native Classic PDF colour and saved text pass. |
| P2-NOT-002 | FIXED | Unique past-due invoice alert arrived within the immediate delivery check; trigger invoice cancelled and preferences restored. |
| P2-AP-002 | FIXED | Bank/cheque reference and method persist with correct balances; payment dialog defaults to the selected bill amount due. |
| P2-SUPH-001 | FIXED | Supplier PO/receipt linkage and bill/payment ledger show the owned documents, amounts and references. |
| P2-CN-002 | FIXED | Reason code/details persist. Refunds 40 + 60 settle a 100 credit; over-refund is rejected. Allocation is explicitly not delivered. |
| P2-CN-004 | PARTIAL | Reason code/details persist. Refunds 40 + 60 settle a 100 credit; over-refund is rejected. Allocation is explicitly not delivered. |

## Confirmed application bugs — detailed tickets

- [RET-002 — Invoice PDF omits saved company header/payment instructions](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/release-verification-2026-11-04/bugs/phase1-invoice-pdf.md).
- [RET-003 — Variant dialog footer is covered](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/release-verification-2026-11-04/bugs/phase1-variant-dialog.md).
- [P2-QUOTE-002 — Customer-facing quotation notes missing from PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/release-verification-2026-11-04/bugs/phase2-quotations.md).
- [P2-DOC-004 — Classic dark layout loses the chosen brand colour](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/release-verification-2026-11-04/bugs/phase2-document-templates.md).
- [REL-DN-001 — Additional debit-document product identity defect](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/release-verification-2026-11-04/bugs/additional-debit-document.md). This finding is additional to the original release tickets.

## Confirmed branding policy

The user confirmed: **Preserve the brand colour** in Classic dark mode. A fresh targeted retest reproduced the mismatch after that confirmation. P2-DOC-004 is now a confirmed application bug and remains partially fixed; there are no unresolved policy checks. [Confirmation and evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/release-verification-2026-11-04/observations.md).

## Explicitly not included by the developer

`P2-DASH-001`, `P2-DASH-002`, `P2-REG-001`, `P2-REG-002`, `P2-CN-003`, `P2-GRN-003`, `P2-REP-001`, `P2-REP-004`, `P2-REP-006`, `P2-DOC-001`.

Credit allocation within P2-CN-004 is also explicitly undelivered. Its partial/final refund amounts and saved balance checks pass; refund date/method history is not certified. No excluded capability is counted as fixed.

## Additional small-change checks

- Invoice/quotation native PDF identity, amount and Rs formatting verified.
- Supplier-specific order Tax is an entered amount (7.35 and 27.40), with matching read-only form totals. This check does not submit a product-linked order from that supplier-specific page. Main purchasing submission/branch/currency/receiving are independently verified.
- Bill payment amount defaults to the selected bill’s due balance and refreshes for its next installment.
- Overdue invoice alert was observed in about 5.7 seconds; the matched notification was created about 2.3 seconds after the issue trigger.

## Corrected automation issues

- Recovered the captured QA stock baseline after an extra queue was interrupted; final cleanup is checked independently.
- Updated product/customer Actions menus and catalogue column lookup.
- Scoped the redesigned cart by main/list item and quantity control.
- Matched headings with status badges and widget labels with changed descriptions.
- Accepted the canonical POS invoice-number prefix; verified actual PDF identity.
- Filled newly required credit reasons and debit due date; used a valid linked QA fixture.
- Waited for fresh held-order reads and respected cached dashboard responses.
- Reconciled count value against frozen unit cost and parsed -Rs negative amounts.
- Used labelled audit controls and waited for modal dismissal before further actions.

All corrected cases were rerun. An initial invoice setup failure prevented three cases from running; later completed runs executed them. Final scoped cases have no intentional skips or expected-failure annotations. One extra queue was interrupted; its captured stock baseline was recovered before the final checks and cleanup passed.

## Evidence and scope

- [Brief PDF](../../output/pdf/NexStock-Release-Fix-Retest-Summary-2026-11-04.pdf)
- [Reviewed verification register](../../blob-report/archive/release-verification-2026-11-04/verification-register.json) — complete attempt/case history, results and evidence locations.
- [Live deployment fingerprint](../../blob-report/archive/release-verification-2026-11-04/public-deployment.json). Frontend is index-D4pNS7qJ.js; the hash matches the interrupted 30 October frontend. Backend behaviour was retested live on 4 November.

Captured QA stock, VAT, invoice header/footer, document template and notification preferences were restored. Pending owned holds and notification trigger invoices requiring cleanup are zero. Synthetic financial documents are retained as evidence. All 76 local guard/classification checks and the diff whitespace check pass. Web verification only: mobile update, legal approval, full acquisition-cost policy, cross-company isolation and an authoritative deployed commit are not certified.
