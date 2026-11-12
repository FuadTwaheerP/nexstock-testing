# Bills & Accounts Payable - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **5 passed, 1 application-failing cases, 2 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **1 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Direct QA vendor bill persistence passes: supplier, external reference, issue/due dates, subtotal Rs 97, entered tax Rs 10, total and balance Rs 107.
- Manual bookkeeping-only Cash Rs 20, Bank Transfer Rs 30 and Cheque Rs 57 installments pass, including partial/paid statuses and decreasing balances to zero. No bank, gateway, real cheque or external funds transfer was initiated.
- A bill due ten days earlier is explicitly marked Overdue; future due dates and pending liabilities are exercised independently. No assumed aging-bucket policy is imposed.
- PO/received-shipment linkage and the integrated purchasing-to-bill flow are blocked by confirmed Purchasing P2-PO-001; direct bill coverage does not certify that linkage.
- Synthetic bills and payment entries remain as QA evidence. No existing supplier or bill was modified/deleted; stock baselines remain restored.

## Confirmed application bugs

## P2-AP-002

### Title

Vendor bill payment cannot record a transaction or cheque reference

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F17-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Bills (AP).
2. Create an isolated bill for QA P2 Vendor mvo2d41l with subtotal Rs 97, tax Rs 10 and a future due date.
3. Click Pay on that exact QA bill.
4. Select Bank Transfer or Cheque and inspect all payment inputs.

### Expected Result

The manual payment can retain its amount, payment date, method and transaction/cheque reference for reconciliation.

### Actual Result

Record Payment exposes Amount, Payment Date and Payment Method only. There is no reference or transaction field. The actual tested payment payloads include amount, paymentDate and paymentMethod, with no reference.

Affected cases:

- F17-b record transaction reference with bank or cheque payment

### Attachment

- [P2-AP-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/bills-payable-1/artifacts/bills-payable-bill-payment-9fcce-with-bank-or-cheque-payment-phase2-bills-payable/attachments/P2-AP-002-a433f56a03c2cf2834c9930ce14a92e633fc718a.png)
- [F17-b record transaction reference with bank or cheque payment - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/bills-payable-1/artifacts/bills-payable-bill-payment-9fcce-with-bank-or-cheque-payment-phase2-bills-payable/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/bills-payable-assessment.json)

### Comment

Add reference entry/persistence and expose it in the bill payment/supplier ledger. The amount arithmetic and Cash/Bank Transfer/Cheque bookkeeping paths pass; this ticket concerns the missing required reference capability.

---

## Corrected automation / maintenance - not application tickets

- Direct AP fixtures are independent of Purchasing so the real PO defect does not prevent payment and due-date coverage.
- Two PO-linked cases execute the failing prerequisite and record BLOCKED instead of skips, passing coverage or duplicate AP defects.
- The overdue oracle uses the actual explicit Overdue marker and outstanding amount. No missing date-bucket feature was inferred from labels.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | bills-payable-1 |
| F17-b record manual Cash Bank Transfer and Cheque installments to zero balance | PASS | bills-payable-1 |
| F17-b record transaction reference with bank or cheque payment | FAIL - P2-AP-002 | bills-payable-1 |
| Supplier receipt bill and installments full flow | BLOCKED | bills-payable-1 |
| F17-a vendor bill linked to received PO with dates reference and balance | BLOCKED | bills-payable-1 |
| F17-a direct QA supplier bill core persistence without a PO prerequisite | PASS | bills-payable-1 |
| F17-c upcoming liability and overdue payable visibility | PASS | bills-payable-1 |
| audit Phase 2 write scope and log out QA session | PASS | bills-payable-1 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs bills-payable
node scripts/assess-phase2.mjs bills-payable
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
