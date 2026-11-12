# Supplier Transaction History - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **2 passed, 3 application-failing cases, 2 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **1 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- New QA vendor bills and a Rs 20 manual cash payment were verified in AP before inspecting the same supplier's history. Those non-zero transactions are absent from the supplier page.
- PO and GRN history cases execute but are blocked by Purchasing P2-PO-001, so their populated history/receipt linkage is unverified.
- Supplier history exposes a Catalog Products tab and a Purchase Orders tab only. The missing complete ledger is one grouped capability ticket, not separate speculative PO/GRN defects.
- No existing supplier details were edited. Synthetic bill/payment records remain as evidence; no real payment was executed.

## Confirmed application bugs

## P2-SUPH-001

### Title

Supplier transaction history omits real bills and outgoing payments

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F18-d.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and select the active isolated supplier QA P2 Vendor mvo2d41l.
2. Create a direct QA vendor bill in Bills (AP): subtotal Rs 97, tax Rs 10, total Rs 107, future due date and a unique QA reference.
3. For the payment scenario, record a manual cash installment of Rs 20 and verify paid Rs 20 / due Rs 87 in AP.
4. Open that supplier's details and inspect all history tabs.
5. Open Purchase Orders history and search visually for the newly recorded bill/payment.

### Expected Result

The supplier has a complete transaction ledger with its POs, received shipments, vendor bills and outgoing payments, including amounts and document linkage.

### Actual Result

The page exposes Catalog Products and Purchase Orders only. The exact newly saved QA bill references, balances and Rs 20 payment are absent, with no Bills/Payments ledger view. Independent unpaid and partially paid fixtures reproduce the omission.

Affected cases:

- F18-d supplier complete ledger includes an owned partial outgoing cash payment
- Supplier bill payment and transaction ledger full flow
- F18-d supplier complete ledger includes an owned unpaid bill

### Attachment

- [P2-SUPH-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-outgoing--10172-rtial-outgoing-cash-payment-phase2-supplier-history/attachments/P2-SUPH-001-33ab952d01d4667271b9e8dd860799d21ddfcedf.png)
- [P2-SUPH-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-supplier--5d989--ledger-full-flow-full-flow-phase2-supplier-history/attachments/P2-SUPH-001-cbe070e042b567fa2ed15b6abe671d097507a34c.png)
- [P2-SUPH-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-vendor-bi-906f0-cludes-an-owned-unpaid-bill-phase2-supplier-history/attachments/P2-SUPH-001-b82de207ac04819108e8adb76569089d36ea02eb.png)
- [F18-d supplier complete ledger includes an owned partial outgoing cash payment - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-outgoing--10172-rtial-outgoing-cash-payment-phase2-supplier-history/error-context.md)
- [Supplier bill payment and transaction ledger full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-supplier--5d989--ledger-full-flow-full-flow-phase2-supplier-history/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-assessment.json)

### Comment

Add the supplier's bill/payment ledger and integrate receipt/purchase-order linkage. Use the saved QA references and payment events when retesting. Populated PO/GRN history cannot yet be certified because P2-PO-001 prevents provisioning; no separate defect is assumed for those blocked paths.

---

## Corrected automation / maintenance - not application tickets

- The supplier page repeats its name in an h1 and a card h4. The first run hit strict-mode ambiguity; the locator now requires heading level 1. All three affected bill/payment/full-flow cases were rerun.
- Dependent PO/GRN cases remain clearly BLOCKED. No fabricated purchasing records or skipped tests are used.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | supplier-history-2 |
| F18-d supplier history retains received shipment linkage | BLOCKED | supplier-history-1 |
| F18-d supplier complete ledger includes an owned partial outgoing cash payment | FAIL - P2-SUPH-001 | supplier-history-2 |
| F18-d supplier history retains its own purchase order | BLOCKED | supplier-history-1 |
| Supplier bill payment and transaction ledger full flow | FAIL - P2-SUPH-001 | supplier-history-2 |
| F18-d supplier complete ledger includes an owned unpaid bill | FAIL - P2-SUPH-001 | supplier-history-2 |
| audit Phase 2 write scope and log out QA session | PASS | supplier-history-2 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs supplier-history
node scripts/assess-phase2.mjs supplier-history
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
