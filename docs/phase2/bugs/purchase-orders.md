# Purchasing & Purchase Orders - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **2 passed, 6 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **1 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Every independent case attempted creation through the actual UI. All six functional cases stop at the same delivery-branch validation failure; approval, ordering, receiving, fulfillment and PDF output remain unverified.
- No purchase order was created by these attempts. No supplier email was sent and no stock was received. QA stock recovery verifies the five-branch baseline.
- The isolated active QA supplier created for purchasing is retained for subsequent AP/history checks. Existing suppliers were not edited or reactivated.
- GRN and PO-linked vendor-bill coverage depends on this creation defect. Those modules report prerequisite blockers rather than fabricated receipt/billing bugs.

## Confirmed application bugs

## P2-PO-001

### Title

Purchase Order creation requires a delivery branch that the form does not let the user select

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F15-a, F15-b, F15-c, F15-d.

### Priority

Critical

### Step-by-step

1. Sign in to Nexstock QA Company and open Purchase Orders > New Purchase Order.
2. Select an active isolated QA supplier (QA P2 Vendor mvo2d41l) and QA add mv9rtxw1-3b087e.
3. Enter quantity 4, unit cost Rs 25, tax Rs 10, discount Rs 5 and shipping Rs 2; total Rs 107.
4. Set currency MUR, a future expected delivery date and a QA note.
5. Inspect the form for a delivery branch or warehouse selector, then click Create Purchase Order.

### Expected Result

The user can select the destination branch and save a valid draft PO for subsequent approval, receipt and PDF export.

### Actual Result

No delivery branch/warehouse input is present and the form submits no branchId. The server rejects creation with HTTP 422 validation_failed: data.branchId = Choose the branch the goods are delivered to. All six independent/full-flow cases reproduce the same prerequisite failure.

Affected cases:

- F15-a supplier items costs delivery date currency and totals persist
- F15-a select delivery warehouse or branch
- F15-d partial then full receipt closes fulfillment
- F15-c actual purchase order PDF export
- Purchase order supplier approval partial and final receipt full flow
- F15-b draft approve and mark ordered without sending supplier email

### Attachment

- [P2-PO-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-create-pur-3c5a3-currency-and-totals-persist-phase2-purchase-orders/attachments/P2-PO-001-07346517a95c79203b956f9e78e12410d77499ab.png)
- [P2-PO-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-create-pur-d4815-elivery-warehouse-or-branch-phase2-purchase-orders/attachments/P2-PO-001-624afeead6ec612e713a5f5b11d071d29e476409.png)
- [P2-PO-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-fulfilment-35cbe--receipt-closes-fulfillment-phase2-purchase-orders/attachments/P2-PO-001-4f82f376e05c9a28241c78040bd7f76bfddedd98.png)
- [F15-a supplier items costs delivery date currency and totals persist - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-create-pur-3c5a3-currency-and-totals-persist-phase2-purchase-orders/error-context.md)
- [F15-a select delivery warehouse or branch - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-create-pur-d4815-elivery-warehouse-or-branch-phase2-purchase-orders/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-assessment.json)

### Comment

Add a destination branch selector backed by active company branches, send its branchId and retain/display the delivery location. Then rerun PO lifecycle/export/fulfillment, GRN and PO-linked billing. Do not log duplicate downstream receipt, status or PDF defects before they become reachable.

---

## Corrected automation / maintenance - not application tickets

- Product search uses the deployed translated Search... placeholder, not the English fallback string found in source.
- The supplier name cell includes initials/code; supplier readiness now targets its unique Actions for <exact QA name> row instead of an exact whole-cell label.
- Inspected the saved failure response: HTTP 422 validation_failed, data.branchId, message Choose the branch the goods are delivered to. The adapter identifies this precise failure only when no branch/warehouse UI is present. Unrelated errors remain automation review.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | purchase-orders-4 |
| F15-a supplier items costs delivery date currency and totals persist | FAIL - P2-PO-001 | purchase-orders-4 |
| audit Phase 2 write scope and log out QA session | PASS | purchase-orders-4 |
| F15-a select delivery warehouse or branch | FAIL - P2-PO-001 | purchase-orders-4 |
| F15-d partial then full receipt closes fulfillment | FAIL - P2-PO-001 | purchase-orders-4 |
| F15-c actual purchase order PDF export | FAIL - P2-PO-001 | purchase-orders-4 |
| Purchase order supplier approval partial and final receipt full flow | FAIL - P2-PO-001 | purchase-orders-4 |
| F15-b draft approve and mark ordered without sending supplier email | FAIL - P2-PO-001 | purchase-orders-4 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs purchase-orders
node scripts/assess-phase2.mjs purchase-orders
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
