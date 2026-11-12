# Goods Receipt Notes - Phase 2 findings

Test date: **25–26 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **3 passed, 3 application-failing cases, 4 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **2 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Four independent PO-linked receipt checks remain blocked by P2-PO-001: no approved/ordered QA PO can be created because the form omits required delivery branch. Acceptance, multiple deliveries, PO-linked stock increment and rejection persistence remain unverified.
- The existing standalone Store Inventory > Restock workflow was exercised independently of PO creation. Exactly one QA item is allowed by a payload guard; one intended branch increases by one, all other QA branches remain unchanged, and stock is restored.
- The user confirmed a separate no-PO supplier GRN, with only supplier, product and quantity mandatory; all other user-entered receipt details are optional. Existing stock-only Restock is not GRN acceptance. No standalone GRN entry is exposed in the inspected UI, so minimum-input save, mandatory omissions and optional-blank acceptance remain unverified.
- The cost estimate is inspected separately without confirming a stock change. The real product has cost40 and selling100; the dialog shows line/total100 for quantity1.
- The integrated flow includes required standalone GRN availability, existing Restock, cost inspection and the PO-dependent path. Its confirmed failures and upstream blocker are recorded separately. Phase3 lot/expiry/three-way matching is excluded.

## Confirmed application bugs

## P2-GRN-003

### Title

No standalone supplier GRN can be created without a Purchase Order

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25–26 October 2026. Requirements: F16-a.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company.
2. Open Purchasing > Purchase Orders and look for a way to receive a shipment without creating or selecting a Purchase Order.
3. Open Suppliers and inspect the available receiving actions.
4. Open Store Inventory and select Restock.
5. Try to record a separate Goods Receipt Note by selecting a supplier, product and received quantity, leaving all other details blank.

### Expected Result

A separate GRN can be created without a Purchase Order. Supplier, product and quantity are the only mandatory user inputs; delivery-note/reference number, dates, notes and all other details are optional. Saving retains the supplier receipt and posts the received inventory.

### Actual Result

The inspected Purchasing, Suppliers and Inventory screens expose no standalone GRN entry. The available Restock dialog selects products and quantities but has no supplier input or supplier-receipt form. The required minimum-input GRN cannot be created through this UI.

Affected cases:

- Purchase order acceptance damage and stock receipt full flow
- F16-a separate no-PO GRN needs only supplier product and quantity

### Attachment

- [P2-GRN-003 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-goods-recei-9c9e4-receipt-full-flow-full-flow-phase2-goods-receipts/attachments/P2-GRN-003-1a8e55e37c3779a4b4d513e169bb09d5a5e33fd6.png)
- [P2-GRN-003 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-standalone--16e72-pplier-product-and-quantity-phase2-goods-receipts/attachments/P2-GRN-003-6cfc6637158197f45489af061d57ede52d0d92e6.png)
- [Purchase order acceptance damage and stock receipt full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-goods-recei-9c9e4-receipt-full-flow-full-flow-phase2-goods-receipts/error-context.md)
- [F16-a separate no-PO GRN needs only supplier product and quantity - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-standalone--16e72-pplier-product-and-quantity-phase2-goods-receipts/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-assessment.json)

### Comment

Add a separate GRN flow with supplier selection and product/quantity lines, persistence and stock posting. Allow all other user-entered details to remain blank/defaulted; do not require a Purchase Order. This is one missing-workflow ticket. Required-field, optional-field, saved-receipt and stock-posting assertions are unverified until the form becomes available. No claim is made that an unpublished backend endpoint is absent.

---

## P2-GRN-002

### Title

Standalone Restock estimates purchase cost using the product selling price

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25–26 October 2026. Requirements: F16-a.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company.
2. Open Products and inspect QA-ADD-mv9rtxw1-3b087e: cost price Rs40 and selling price Rs100.
3. Open Store Inventory for QA Inspection Store 20261017, then click Restock.
4. Deselect all items and search the exact QA SKU.
5. Select only that item and set quantity to 1.
6. Read its Cost amount and Estimated restock cost; cancel without confirming.

### Expected Result

For quantity1, line cost and estimated restocking cost use the product's purchase/cost price, Rs40, rather than its selling price.

### Actual Result

The line Cost and estimated total both show100 for one item, matching its selling price100 instead of its stored cost40. The same result reproduces in the independent check and integrated flow.

Affected cases:

- Purchase order acceptance damage and stock receipt full flow
- F16-a standalone Restock line and estimated total use the QA purchase cost

### Attachment

- [P2-GRN-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-goods-recei-9c9e4-receipt-full-flow-full-flow-phase2-goods-receipts/attachments/P2-GRN-002-518ba6f3e4db7704cf936a986ffe8ec84b791456.png)
- [P2-GRN-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-3/artifacts/goods-receipts-restock-cos-a8c88-al-use-the-QA-purchase-cost-phase2-goods-receipts/attachments/P2-GRN-002-4be8fb7e94442473eb953ea4e1b738f84371ca90.png)
- [Purchase order acceptance damage and stock receipt full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-goods-recei-9c9e4-receipt-full-flow-full-flow-phase2-goods-receipts/error-context.md)
- [F16-a standalone Restock line and estimated total use the QA purchase cost - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-3/artifacts/goods-receipts-restock-cos-a8c88-al-use-the-QA-purchase-cost-phase2-goods-receipts/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-assessment.json)

### Comment

Calculate estimates from the applicable unit purchase/cost value and format them with the company currency. Preserve the independently passing stock-quantity behavior. This ticket concerns the visible estimate; no incorrect ledger or stock valuation is claimed. The read-only reproduction never confirms a restock.

---

## Corrected automation / maintenance - not application tickets

- Shared PO selectors were corrected and reviewed in Purchasing before the GRN run.
- Confirmed upstream branchId validation is annotated BLOCKED in dependent modules; it is not converted into a new GRN ticket or a pass.
- Independent scenarios plus a main full-flow script are present. No test.skip, expected failures, manufactured PO IDs or direct API provisioning are used.
- Added an independent no-PO Restock scenario instead of letting the PO fixture prevent all investigation of ad-hoc intake. Deselect all default items, select the exact QA SKU, validate the outgoing payload before forwarding, then reconcile every branch and compensate the owned quantity.
- Compared the displayed estimate against independently read product cost and selling values. Captured the actual dialog before cancelling; this is not a source-only hypothesis.
- Recorded the user's explicit standalone GRN contract in data/phase2-grn-contract.json and added an independent check plus full-flow step. Supplier, product and quantity are the only required user inputs; no extra mandatory fields are inferred.
- Removed an optional deployed-script download from the availability check after it caused an unrelated timeout. Reruns use actual navigation and purchasing/supplier/inventory UI evidence. No unseen backend capability or individual field-validation behavior is asserted.
- Nested submodule checks preserve the full flow's larger timeout instead of reducing its remaining budget.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | goods-receipts-5 |
| F16-d rejected damaged quantity reason persistence and stock exclusion | BLOCKED | goods-receipts-1 |
| Purchase order acceptance damage and stock receipt full flow | FAIL - P2-GRN-003, P2-GRN-002 | goods-receipts-5 |
| F16-c receipt increments warehouse stock and preserves other branch balances | BLOCKED | goods-receipts-1 |
| F16-b multiple deliveries retain received quantities and close outstanding balance | BLOCKED | goods-receipts-1 |
| F16-a receive accepted items against an isolated approved QA purchase order | BLOCKED | goods-receipts-1 |
| audit Phase 2 write scope and log out QA session | PASS | goods-receipts-5 |
| F16-a standalone no-PO Restock adds only one QA item and preserves other branches | PASS | goods-receipts-2 |
| F16-a standalone Restock line and estimated total use the QA purchase cost | FAIL - P2-GRN-002 | goods-receipts-3 |
| F16-a separate no-PO GRN needs only supplier product and quantity | FAIL - P2-GRN-003 | goods-receipts-5 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs goods-receipts
node scripts/assess-phase2.mjs goods-receipts
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
