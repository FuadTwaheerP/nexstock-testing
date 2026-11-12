# Stock Counts (Physical Inventory Audits) - Phase 2 findings

Test date: **2026-10-25**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **3 passed, 6 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **3 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Core cases use the previously stocked simple QA product at the zero-stock QA Inspection Store: seed three units, save/reopen surplus/shortage, reconcile and restore both branch balances. An additional regression uses active physical QA-ARCHIVE-mv9s9v7r-b9c0c9, which has no displayed branch-stock row, and verifies commitment through an independently opened fresh count.
- Saved but uncommitted test counts are abandoned. Committed count/adjustment records remain as QA evidence; no fiscal or inventory history is deleted.
- This scope does not certify concurrent live sales during an open count, every product type or Phase 3 scheduled/barcode audits.
- The first-positive-balance regression reproduces a real reconciliation failure; the earlier successful QA-ADD fixture does not certify every item/initial balance. Non-zero later-page reporting preparation is blocked by this new P2-COUNT-005.

## Confirmed application bugs

## P2-COUNT-004

### Title

Committed physical counts change stock without a Stock Adjustments history entry

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F06-c.

### Priority

High

### Step-by-step

1. In Nexstock QA Company, establish three units of a simple QA product at QA Inspection Store 20261017. Record the original balance for later restoration.
2. Open Stock Adjustments for that branch and note the latest adjustment references.
3. Start a Stock Count for the same QA branch, enter counted quantity 5 for the QA product, and save it.
4. Commit the count and verify that branch stock changes from 3 to 5 while the comparison branch is unchanged.
5. Return to Stock Adjustments for the counted branch. Refresh/read its latest history repeatedly for at least 20 seconds and compare the references with the pre-commit list.
6. Repeat with a shortage count, then restore the original stock using a separately labelled QA adjustment.

### Expected Result

One-click reconciliation generates an attributable stock adjustment for the counted difference. The history exposes the affected product, signed quantity and originating count so that the movement can be traced.

### Actual Result

Count commitment updates the QA product's stock correctly, but the successful branch adjustment-history reads contain no new adjustment reference for the count. The list continues to show the earlier manual QA seed/restore records. The count movement cannot be located in Stock Adjustments.

Affected cases:

- F06-c committing a surplus count updates only its QA branch
- F06-c committing a shortage count updates only its QA branch
- Physical count entry variance and stock reconciliation full flow

### Attachment

- [P2-COUNT-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-count-reconci-e030b--updates-only-its-QA-branch-phase2-stock-counts/attachments/P2-COUNT-004-92ba83a1bb4bf091122db4f7572532a56ad223cf.png)
- [P2-COUNT-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-count-reconci-b0c07--updates-only-its-QA-branch-phase2-stock-counts/attachments/P2-COUNT-004-0a4e7d5e7ea98015554dcd93cf5374625fcd2ea7.png)
- [P2-COUNT-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-stock-counts--d7104-liation-full-flow-full-flow-phase2-stock-counts/attachments/P2-COUNT-004-45d494747f91a270e85dc2fdc6e7191e40385662.png)
- [F06-c committing a surplus count updates only its QA branch - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-count-reconci-e030b--updates-only-its-QA-branch-phase2-stock-counts/error-context.md)
- [F06-c committing a shortage count updates only its QA branch - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-count-reconci-b0c07--updates-only-its-QA-branch-phase2-stock-counts/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-assessment.json)

### Comment

The test compares the same branch's latest history before and after commitment, with no other test writes between those reads, and allows a 20-second refresh window. This is separate from the missing monetary variance display. It concerns the required generated adjustment record, not a claim that stock reconciliation itself failed. Generate/link a count adjustment and expose it in the stock adjustment trail; verify both surplus and shortage.

---

## P2-COUNT-002

### Title

Stock counts show quantity variance but omit its cost-based monetary value

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F06-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and note a simple QA product's cost and stock in a QA branch. The automated example uses cost Rs 40.00 at QA Inspection Store 20261017.
2. Use a labelled QA stock adjustment to establish three units at that branch, noting the original balance for restoration.
3. Open Stock Counts and start a count for that QA branch.
4. Locate the QA product: expected quantity is 3. Enter counted quantity 5, a surplus of 2.
5. Save counts, reopen the same reference and inspect the line variance and summary. Commit the count and reopen it again.
6. Repeat independently with expected 3 and counted 2 to check a shortage of 1. Inspect the calculated monetary variance in both the saved and committed views.
7. After the checks, restore the original QA stock balance with a labelled adjustment.

### Expected Result

The count shows quantity variance and its value at product cost. A surplus of 2 at Rs 40.00 is Rs 80.00; a shortage of 1 is Rs -40.00. Users can assess the financial effect before or after reconciliation.

### Actual Result

Saved and committed count sheets expose Product, Expected, Counted and Variance quantity columns plus a Net variance quantity summary. The quantity calculations and stock reconciliation work, but no cost-based variance amount is displayed for either surplus or shortage.

Affected cases:

- F06-b surplus quantity and cost variance
- F06-b shortage quantity and cost variance
- Physical count entry variance and stock reconciliation full flow

### Attachment

- [P2-COUNT-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-4/artifacts/stock-counts-count-varianc-6f83d--quantity-and-cost-variance-phase2-stock-counts/attachments/P2-COUNT-002-b4cfb2c069dbcd00ad613b62ff50938ebdbd6b80.png)
- [P2-COUNT-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-4/artifacts/stock-counts-count-varianc-7d498--quantity-and-cost-variance-phase2-stock-counts/attachments/P2-COUNT-002-e7ac2e931f8f00b0c783b220e548e137d3d77911.png)
- [P2-COUNT-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-stock-counts--d7104-liation-full-flow-full-flow-phase2-stock-counts/attachments/P2-COUNT-002-f82a5042ae0b6f66c14fe0d87fd95d6124c5edbf.png)
- [F06-b surplus quantity and cost variance - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-4/artifacts/stock-counts-count-varianc-6f83d--quantity-and-cost-variance-phase2-stock-counts/error-context.md)
- [F06-b shortage quantity and cost variance - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-4/artifacts/stock-counts-count-varianc-7d498--quantity-and-cost-variance-phase2-stock-counts/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-assessment.json)

### Comment

This is a missing monetary variance result in the count UI, not a claim that the underlying stock quantities are wrong or that backend accounting calculations were inspected. Add line and summary valuation based on cost, format the amounts as company currency, and verify positive/negative values and totals. The integrated flow can reach and verify reconciliation despite this display gap.

---

## P2-COUNT-005

### Title

A committed first positive count leaves an active QA item's branch stock at zero

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F06-c.

### Priority

High

### Step-by-step

1. In Nexstock QA Company, open active physical product QA archive mv9s9v7r-b9c0c9 (SKU QA-ARCHIVE-mv9s9v7r-b9c0c9). Confirm it has zero stock and no displayed branch-stock entry.
2. Start a count for QA Inspection Store 20261017; the product's frozen expected quantity is 0.
3. Enter counted quantity 1 for that exact product and save counts.
4. Reopen the saved count and confirm counted quantity 1 persists.
5. Click Commit and accept Apply 1 variance(s) to stock? The completion request returns HTTP 200.
6. Start a separate fresh count for the same branch and inspect the same SKU; also search the product in a fresh catalogue view.
7. Abandon the fresh verification snapshot. Restore/verify the original zero balance using an owned count.

### Expected Result

Committing counted quantity 1 reconciles this branch to 1, creating its balance row if necessary. A fresh count and catalogue read show the updated stock.

### Actual Result

The save payload contains product_id 19 / counted_quantity 1, reopening retains 1, and completion succeeds with a positive-variance confirmation. A separate newly opened count still freezes expected quantity 0; the fresh catalogue also reports stock 0. Repeated independent execution reproduces it.

Affected cases:

- F06-c commit first positive count for an active QA item without a branch balance

### Attachment

- [P2-COUNT-005 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-7/artifacts/stock-counts-initial-balan-2da0c-em-without-a-branch-balance-phase2-stock-counts/attachments/P2-COUNT-005-648d86d9e76470831c01ba3b22982ec987f4dc9d.png)
- [F06-c commit first positive count for an active QA item without a branch balance - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-7/artifacts/stock-counts-initial-balan-2da0c-em-without-a-branch-balance-phase2-stock-counts/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-assessment.json)

### Comment

Investigate commitment for a product/branch pair without an existing stock row; missing balance initialization is a hypothesis, not a verified backend cause. The previously stocked QA-ADD product reconciles successfully, so this is a distinct data-state regression. Fix and retest first surplus/shortage and existing-balance paths. Reporting's later-page positive-stock test remains blocked until this prerequisite works.

---

## Corrected automation / maintenance - not application tickets

- The initial adjustment write guard used a collection endpoint while the deployed form posts to /inventory/branches/1/adjustments. Those seed requests were blocked, so they changed no stock. The scope was corrected to the exact observed QA branch endpoint and the tests rerun.
- The count detail is local selected-record state. Persistence reopens the exact count reference through the count list instead of assuming a reload retains the selected detail view.
- The preliminary count-open probe was superseded by the saved-count test. Setup and cleanup are not counted as feature coverage.
- The new regression waits for detail hydration, saves and reopens counted quantity 1 before commitment, records the actual PUT payload/native positive-variance confirmation, and verifies a separate fresh count plus fresh catalogue search. Empty product branch-stock DTOs alone are not used as proof. Cleanup commits/restores the original zero and verifies it with a fresh count; snapshot probes are abandoned.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | stock-counts-7 |
| audit Phase 2 write scope and log out QA session | PASS | stock-counts-7 |
| F06-a counted quantity and frozen expectation survive reload | PASS | stock-counts-4 |
| F06-c committing a surplus count updates only its QA branch | FAIL - P2-COUNT-004 | stock-counts-6 |
| F06-c committing a shortage count updates only its QA branch | FAIL - P2-COUNT-004 | stock-counts-6 |
| F06-b surplus quantity and cost variance | FAIL - P2-COUNT-002 | stock-counts-4 |
| F06-b shortage quantity and cost variance | FAIL - P2-COUNT-002 | stock-counts-4 |
| Physical count entry variance and stock reconciliation full flow | FAIL - P2-COUNT-004, P2-COUNT-002 | stock-counts-6 |
| F06-c commit first positive count for an active QA item without a branch balance | FAIL - P2-COUNT-005 | stock-counts-7 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs stock-counts
node scripts/assess-phase2.mjs stock-counts
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
