# NexStock - Cumulative Phase 3 application bugs

Live campaign: 17 November 2026. Production QA tenant: Nexstock QA Company. Confirmed application findings only. Corrected automation, blocked dependencies and policy observations are recorded separately in REVIEW-NOTES.md.

Public frontend: index-Bw0A9VIv.js; backend revision is unverified. Missing user workflows are reported as availability gaps; unseen backend behavior is not inferred. Priorities are reviewed QA triage for this Phase 3 scope.

## P3-DASH-001 - Feature 1 - Dashboard & Executive Analytics

### Title

Dashboard provides no period-over-period comparison configuration or results

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F01-b-P3.

### Priority

Medium

### Step-by-step

1. Sign in to the QA company and open Dashboard; await the live statistics.
2. Open Customize > Add Widget > Stat Card and inspect every available metric/date/comparison setting.
3. Cancel and inspect Line Chart configuration as well; inspect the normal dashboard for current/prior-period controls.

### Expected Result

Choose current and comparison periods and display auditable absolute/percentage changes for matching dates and branch scope, including zero-prior handling.

### Actual Result

Normal Dashboard and the inspected Stat Card/Line Chart configurations expose no current-versus-prior comparison control or comparative result. The Phase 3 comparison workflow cannot be selected.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/dashboard-1/artifacts/dashboard-features.ui-F01--5eb65-ns-and-calculation-controls-phase3-dashboard/P3-DASH-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/dashboard-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Availability failure is confirmed across the live dashboard and relevant widget configurations. No claim is made about incorrect comparison arithmetic, because that workflow cannot be configured. Local builder edits are isolated to this browser context; no business layout was reset.

---

## P3-PROD-001 - Feature 2 - Products & Catalog

### Title

Product creation offers no serialized-unit tracking or serial-number assignment

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F02-a-P3.

### Priority

Medium

### Step-by-step

1. Open Products > New Product and inspect Basic Info, Variants and Custom Fields.
2. Inspect Product type options and stock settings for serialized inventory or per-unit serial-number assignment.

### Expected Result

Enable serialized inventory, capture unique unit serials, reject duplicates and trace individual units through receiving/sale.

### Actual Result

The live product form/type options contain no serialized inventory mode or per-unit serial-number controls. Basic variants and per-product custom text fields are not unit-identity tracking.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-6/artifacts/products-features.ui-F02-a-ea427--and-unit-identity-controls-phase3-products/P3-PROD-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-6 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Assembly bundles are tested separately under F02-k. No claim of broken duplicate-serial validation is made because serialized-unit assignment is unavailable.

---

## P3-PROD-003 - Feature 2 - Products & Catalog

### Title

Bundle recipe silently converts a zero component quantity to one

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F02-k.

### Priority

High

### Step-by-step

1. Save a valid owned bundle with positive component quantities.
2. Enter 0 for one component and click Save recipe.
3. Compare the entered value, submitted request and persisted recipe.

### Expected Result

Reject the zero quantity without silently changing the recipe; component requirements remain the last valid saved values.

### Actual Result

The user-entered 0 was submitted as 1 and the save succeeded, changing the component requirement without validation feedback.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-8/artifacts/products-features.ui-F02-k-fde8d-nd-component-sale-deduction-phase3-products/P3-PROD-003.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-8 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Observed numeric conversion changes the requested recipe. Re-test negative/zero inputs and the supported fractional-quantity policy, persistence and downstream availability after fixing. Valid recipe and stock fixture cleanup remain required.

---

## P3-PROD-005 - Feature 2 - Products & Catalog

### Title

Categories have no dynamic field definitions or schema assignment

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F02-l.

### Priority

Medium

### Step-by-step

1. Open Settings > Products and inspect Product Categories and its management controls.
2. Open New Product > Custom Fields and compare its per-product field editor with category management.

### Expected Result

Define dynamic fields at category level, assign the category and inherit/apply its field schema consistently to products in that category.

### Actual Result

Category management exposes no field/schema definition control. The separate Custom Fields tab configures only an individual product and does not define or inherit category attributes.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-6/artifacts/products-features.ui-F02-l-e179a-mic-field-schema-management-phase3-products/P3-PROD-005.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-6 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Per-product custom fields are not accepted as category-level schema management. No category data was changed. Schema persistence/type validation/inheritance cannot be exercised without a category schema workflow.

---

## P3-PROD-007 - Feature 2 - Products & Catalog

### Title

POS sells a bundle using another branch availability and makes component stock negative

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F02-k.

### Priority

High

### Step-by-step

1. Create an owned 2A+3B kit with allow-negative-stock disabled on its components.
2. Seed A=10/B=8 at another QA branch, leaving both at zero in QA Inspection Store.
3. Sell one kit normally through POS and verify the persisted invoice branch is QA Inspection Store (1).
4. Inspect the components in both branches.

### Expected Result

Reject or disable the sale because the actual sale branch has no component stock; preserve all branch balances.

### Actual Result

POS records a paid sale in branch 1 and leaves its components at A=-2, B=-3. Availability was supplied by another branch.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-8/artifacts/products-branch-boundary.u-43136-e-in-the-actual-sale-branch-phase3-products/P3-PROD-007.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/products-8 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Verified using only owned products, a normal cash recording and the persisted invoice branch. All component balances in every branch are compensated before archiving.

---

## P3-ADJ-001 - Feature 4 - Stock Adjustments

### Title

New Stock Adjustment has no multi-item voucher editor

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F04-e.

### Priority

Medium

### Step-by-step

1. Open Stock Adjustments for a QA branch.
2. Open New Adjustment and inspect the product/quantity controls and available row actions.
3. Attempt to configure two products under one voucher before submitting.

### Expected Result

One adjustment voucher can contain multiple products with their signed quantities and one auditable document identity.

### Actual Result

The live form exposes one native product selector and one quantity only, without Add item/row or another multi-item entry workflow.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/adjustments-1/artifacts/adjustments-features.ui-F0-44876-icity-and-audit-persistence-phase3-adjustments/P3-ADJ-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/adjustments-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Backend multi-item behaviour is tested separately through its live published request shape; API support does not supply the missing user workflow.

---

## P3-TRF-001 - Feature 5 - Stock Transfers

### Title

Transfers have no printable dispatch manifest or delivery slip

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F05-e.

### Priority

Medium

### Step-by-step

1. Create an owned QA inter-branch transfer and inspect its detail/actions.
2. Advance the owned transfer through its live approval/packing/shipping/receipt stages.
3. Inspect the action controls at every stage, including completed history, for a manifest/slip or export/print action.

### Expected Result

A dispatch manifest/delivery slip can be generated for the exact transfer with its reference, source/destination and item quantities.

### Actual Result

No manifest, delivery-slip, PDF/download or print action is exposed at any inspected reachable transfer stage.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/transfers-1/artifacts/transfers-features.ui-F05--cf8f4-low-at-every-transfer-stage-phase3-transfers/P3-TRF-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/transfers-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

The transfer stock lifecycle and captured baselines are verified/recovered independently. A physical printer is not needed to test software document generation and was not exercised.

---

## P3-TRF-002 - Feature 5 - Stock Transfers

### Title

In-transit receipt has no damage, shortage or discrepancy dispute entry

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F05-f.

### Priority

Medium

### Step-by-step

1. Create and dispatch an owned QA transfer.
2. Inspect the in-transit and receiving controls before completion.
3. Attempt to record actual received quantities, damage/shortage details and a dispute, then inspect completed history.

### Expected Result

Record and persist transit damage/shortage or a dispute against the transfer without treating every shipped unit as received in good condition.

### Actual Result

The reachable transfer states provide no damage/shortage/discrepancy input, received-quantity adjustment or dispute action; receipt is a whole-transfer completion action.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/transfers-1/artifacts/transfers-features.ui-F05--cf8f4-low-at-every-transfer-stage-phase3-transfers/P3-TRF-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/transfers-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

No discrepancy accounting result is claimed because there is no input workflow. Stock is restored, and the synthetic transfer is retained completed for audit.

---

## P3-COUNT-001 - Feature 6 - Stock Counts

### Title

Stock counts cannot be scheduled or scoped to a category

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F06-d.

### Priority

Medium

### Step-by-step

1. Open Stock Counts and inspect the list actions.
2. Open Start a count and inspect its scope and scheduling fields.

### Expected Result

Create a recurring/category cycle-count schedule and later open an audit limited to the chosen category.

### Actual Result

The list offers Start a count only. Its form has Branch and Notes; opening a count always freezes the full branch. No category or scheduling control is available.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/stock-counts-1/artifacts/stock-counts-features.ui-F-d14f5-tegory-cycle-audit-controls-phase3-stock-counts/P3-COUNT-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/stock-counts-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

No schedule was created and no inventory committed. Physical counting is skipped at user request; these missing software controls do not require devices.

---

## P3-COUNT-002 - Feature 6 - Stock Counts

### Title

Count sheet has no barcode-driven counting workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F06-e.

### Priority

Medium

### Step-by-step

1. Open an owned QA draft stock count.
2. Inspect the sheet for a scan target or scan mode.
3. With focus on the sheet heading, send an existing QA SKU followed by Enter as keyboard HID input.

### Expected Result

A software scan mode resolves a product and increments/focuses its count with clear feedback.

### Actual Result

Only per-row numeric inputs are present; there is no barcode target/mode, and the emulated SKU plus Enter leaves every counted value unchanged.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/stock-counts-1/artifacts/stock-counts-features.ui-F-a0fe8-nting-in-a-disposable-draft-phase3-stock-counts/P3-COUNT-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/stock-counts-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Software HID emulation only. No physical scanner tested. The draft is abandoned without saving counts or reconciling inventory.

---

## P3-EXP-003 - Feature 7 - Shelf Life

### Title

Expired batches expose delete metadata but no supervised stock disposal workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F07-e.

### Priority

Medium

### Step-by-step

1. Record an owned expired lot and open Shelf Life > Expired.
2. Inspect the row actions and page controls for formal write-off/disposal with supervisor authorization.

### Expected Result

Record a supervised expired-stock write-off with stock movement, reason and audit linkage.

### Actual Result

Expired rows expose Delete batch only; no disposal/write-off request, supervisor approval or linked disposal ledger is available.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/shelf-life-5/artifacts/shelf-life-features.ui-F07-16998-ation-and-disposal-workflow-phase3-shelf-life/P3-EXP-003.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/shelf-life-5 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Delete batch is not treated as formal stock disposal. Real supervisor identity validation cannot run without a disposal workflow and isolated staff account. Owned metadata is deleted only during cleanup.

---

## P3-EXP-004 - Feature 7 - Shelf Life

### Title

Batch entry silently turns zero quantity into one

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F07-b.

### Priority

High

### Step-by-step

1. Open Record a batch for an existing QA product and QA branch.
2. Enter a unique owned batch number, valid future expiry and On hand = 0.
3. Click Record a batch and compare the posted and saved quantity.

### Expected Result

Reject zero with a clear validation message and create no lot.

### Actual Result

The native handler submits initial_quantity=1 and saves the lot successfully, changing the entered quantity without consent.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/shelf-life-5/artifacts/shelf-life-features.ui-F07-e48a4-tly-creating-stock-metadata-phase3-shelf-life/P3-EXP-004.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/shelf-life-5 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

A separate reproduction from the bundle quantity defect. The owned batch is deleted and canonical product stock is checked/restored.

---

## P3-GRN-001 - Feature 16 - Goods Receiving / 7 - Shelf Life

### Title

Goods receiving cannot capture manufacturer lots or lot expiry dates

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F07-a, F16-e.

### Priority

Medium

### Step-by-step

1. Create an owned QA PO and advance it to Ordered.
2. Open Receive Goods and inspect the line entry controls.
3. Attempt to enter a manufacturer lot and expiry date alongside accepted quantities.

### Expected Result

Persist received quantities with manufacturer batch/lot number and expiry date, linked to the receipt and product stock.

### Actual Result

The receiving form exposes accepted/rejected quantities and rejection reason only; no manufacturer lot or expiry capture input is available.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/goods-receipts-1/artifacts/goods-receipts-features.ui-89f2b-ving-lot-and-expiry-capture-phase3-goods-receipts/P3-GRN-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/goods-receipts-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Grouped cross-feature finding: F07-a and F16-e describe the same intake capability. Separate Shelf Life metadata entry does not provide receipt-linked capture. No receipt is committed in this availability check.

---

## P3-LOOKUP-001 - Feature 7 - Shelf Life

### Title

Batch entry cannot select products beyond the initial 15 catalogue entries

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F07-a, F07-b.

### Priority

High

### Step-by-step

1. Create an owned QA product in a catalogue containing more than 15 active items.
2. Open Shelf Life > Record a batch.
3. Inspect Product choices and search/pagination controls for the new product.

### Expected Result

Any active product can be found and selected when recording a lot.

### Actual Result

The new active product is absent. The native Product selector contains only the first 15 entries and has no server search or pagination.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/shelf-life-5/artifacts/shelf-life-features.ui-F07-16998-ation-and-disposal-workflow-phase3-shelf-life/P3-LOOKUP-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/shelf-life-5 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Same lookup limitation as MVP-LOOKUP-001. API-created owned batches below are diagnostic fixtures and do not turn this UI failure into a pass.

---

## P3-POS-001 - Feature 8 - POS

### Title

Offline checkout fails without storing a durable queued sale

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F08-l.

### Priority

High

### Step-by-step

1. Prepare one owned QA item with stock and open normal POS cash payment.
2. Set the browser network offline before Complete Sale.
3. Complete the cash sale and inspect confirmation and IndexedDB durable storage.

### Expected Result

Record an offline sale durably, provide an offline receipt/queued status and synchronize once on reconnection.

### Actual Result

Checkout remains on the payment dialog while offline; no sale confirmation/receipt or IndexedDB database is created to retain a durable queued sale. Online mutation processing may remain paused until reconnection.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/pos-3/artifacts/pos-features.ui-F08-l-offl-d23e0--and-reconnect-prerequisite-phase3-pos/P3-POS-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/pos-3 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Network restored during cleanup after leaving the payment page. No online replacement sale is submitted. Reconnect deduplication is blocked because durable offline acceptance does not occur.

---

## P3-POS-002 - Feature 8 - POS

### Title

POS has no customer loyalty balance or redemption workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F08-m.

### Priority

Medium

### Step-by-step

1. Open POS and inspect customer/cart/payment controls for loyalty rewards.
2. Inspect the customer/cart controls for points balance and redemption.

### Expected Result

A linked customer can view and redeem eligible loyalty points with validated limits and persisted balance changes.

### Actual Result

No loyalty/points balance or redemption control is exposed in the POS cart; no loyalty programme appears in the served POS implementation.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/pos-3/artifacts/pos-features.ui-F08-m-POS-loyalty-redemption-controls-phase3-pos/P3-POS-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/pos-3 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Customer linking and manual discounts are separate core functions. No point balance is invented or adjusted.

---

## P3-QUEUE-001 - Feature 10 - Order Queue

### Title

Processing ticket editor cannot assign a technician, service bay or table

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F10-b.

### Priority

Medium

### Step-by-step

1. Sell an owned processing item through POS.
2. Open Orders Queue and Edit / Add Note for the resulting owned ticket.
3. Inspect assignment inputs.

### Expected Result

Assign and persist a technician/service bay/table association on the ticket.

### Actual Result

The editor provides priority, estimated time, ready date and internal notes only. No assignment selector or table/bay input is present.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/order-queue-2/artifacts/order-queue-features.ui-F1-45441-ignment-and-ticket-printing-phase3-order-queue/P3-QUEUE-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/order-queue-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

API DTO may carry assigned_employee_id, but no usable business assignment workflow is exposed. Existing orders are not changed.

---

## P3-QUEUE-002 - Feature 10 - Order Queue

### Title

Order queue has no thermal work-order ticket generation action

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F10-c.

### Priority

Medium

### Step-by-step

1. Open an owned order in the live queue.
2. Inspect its card menu and editor for work-order printing.

### Expected Result

Generate a thermal work-order ticket for the selected job, including its reference and instructions.

### Actual Result

The card menu offers Edit / Add Note and Cancel Order only; there is no ticket/print action.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/order-queue-2/artifacts/order-queue-features.ui-F1-45441-ignment-and-ticket-printing-phase3-order-queue/P3-QUEUE-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/order-queue-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Software document generation checked. Physical thermal printing is skipped at user request.

---

## P3-QUEUE-003 - Feature 10 - Order Queue

### Title

Processing product creation leaves processing disabled and its POS sale never enters the queue

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F10-a.

### Priority

High

### Step-by-step

1. Create an owned product with type Processing (work after sale).
2. Reload its persisted flags and sell it normally through POS.
3. Open Orders Queue and locate the owned product.

### Expected Result

A Processing product produces a processing ticket after its sale.

### Actual Result

The product is saved as type processing but requires_processing=false; the successful sale has no matching queue record.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/order-queue-2/artifacts/order-queue-features.ui-F1-45441-ignment-and-ticket-printing-phase3-order-queue/P3-QUEUE-003.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/order-queue-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Further queue checks use an explicitly labelled API fixture that enables requires_processing on only this owned product. That workaround does not pass native product setup.

---

## P3-INV-001 - Feature 12 - Invoicing

### Title

Recurring contract billing cannot be configured

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F12-f.

### Priority

Medium

### Step-by-step

1. Open invoice list and New Invoice.
2. Inspect invoice controls and Company/Customization/Notifications settings for the specified advanced workflow.

### Expected Result

Create a recurring contract/retainer schedule, persist its cadence and generate invoices without manual duplication.

### Actual Result

Recurring contract billing cannot be configured. No corresponding workflow is available on the inspected live forms/settings.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/invoicing-2/artifacts/invoicing-features.ui-F12--7f189-automated-reminder-controls-phase3-invoicing/P3-INV-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/invoicing-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

No schedule or customer financial record was modified.

---

## P3-INV-002 - Feature 12 - Invoicing

### Title

Invoice editor has no per-invoice currency or recorded exchange rate

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F12-g.

### Priority

Medium

### Step-by-step

1. Open invoice list and New Invoice.
2. Inspect invoice controls and Company/Customization/Notifications settings for the specified advanced workflow.

### Expected Result

Issue MUR, USD and EUR invoices with a recorded exchange rate and currency-specific totals.

### Actual Result

Invoice editor has no per-invoice currency or recorded exchange rate. No corresponding workflow is available on the inspected live forms/settings.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/invoicing-2/artifacts/invoicing-features.ui-F12--7f189-automated-reminder-controls-phase3-invoicing/P3-INV-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/invoicing-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Global display currency does not establish per-document exchange-rate billing. Company currency was not changed.

---

## P3-CN-002 - Feature 13 - Credit Notes

### Title

Save as Draft opens a standalone credit and immediately increases stock

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F13-f.

### Priority

High

### Step-by-step

1. Create a standalone QA credit, Invoice ID None, reason Billing correction, one physical QA item quantity 1 price 100.
2. Choose Save Credit Note > Save as Draft.
3. Reload the credit and compare QA product stock before and after.

### Expected Result

Save as Draft retains a non-issued draft and leaves stock unchanged; a billing correction must not silently receive a physical return.

### Actual Result

Despite Save as Draft, the native mapper posts status=open. The credit reloads Open, and branch stock increases by one without a restock choice or receiving step.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/credit-notes-3/artifacts/credit-notes-features.ui-F-f9441-s-without-invoice-reference-phase3-credit-notes/P3-CN-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/credit-notes-3 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Confirmed with owned standalone credits. Stock changes are compensated; synthetic financial records remain auditable. Same area as earlier P2-CN-003 restock-option limitation.

---

## P3-PO-001 - Feature 15 - Purchase Orders

### Title

Low-stock items have no automatic purchase-order reordering workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F15-e.

### Priority

Medium

### Step-by-step

1. Inspect purchase-order list and creation controls.
2. Open Reports > Low Stock and inspect replenishment actions.
3. Inspect product reorder thresholds against the available purchasing controls.

### Expected Result

Configure and audit automatic PO generation for items below safety thresholds.

### Actual Result

Only manual PO creation and low-stock reporting are available; no automatic reorder policy/schedule or generation workflow is exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/purchase-orders-1/artifacts/purchase-orders-features.ui-F15-e-automated-reorder-controls-phase3-purchase-orders/P3-PO-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/purchase-orders-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Threshold alerts alone are not automatic PO generation. No scheduler execution or supplier delivery is inferred from low-stock counts.

---

## P3-PO-002 - Feature 15 - Purchase Orders

### Title

Purchase-order detail has no direct supplier email transmission action

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F15-f.

### Priority

Medium

### Step-by-step

1. Create an owned QA purchase order for the controlled example.invalid supplier.
2. Inspect draft actions, then approve and mark the same PO ordered.
3. Inspect ordered actions for supplier email transmission and delivery status.

### Expected Result

Send the PO directly to its supplier and retain transmission/delivery evidence.

### Actual Result

The inspected PO states expose status changes, print and receive controls but no direct supplier email action or transmission status.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/purchase-orders-1/artifacts/purchase-orders-features.u-bca79-ail-action-across-PO-states-phase3-purchase-orders/P3-PO-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/purchase-orders-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

No message is sent. Mark as Ordered is not treated as email transmission. End-to-end email delivery also requires a controlled QA inbox.

---

## P3-AP-001 - Feature 17 - Bills & AP

### Title

Bill entry provides PO linking but no three-way receipt reconciliation

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F17-d.

### Priority

Medium

### Step-by-step

1. Open Bills > New Bill.
2. Inspect Linked Purchase Order, bill amount fields and any goods-receipt selection.
3. Inspect the bill list for match status/variance or a reconciliation action.

### Expected Result

Compare bill lines, PO ordered cost/quantity and GRN accepted quantities; expose match results and discrepancies.

### Actual Result

The form has an optional PO reference plus aggregate subtotal/tax. It has no goods-receipt/line matching controls; the list has no match status or reconciliation action.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/bills-payable-1/artifacts/bills-payable-features.ui--e2445--way-bill-matching-workflow-phase3-bills-payable/P3-AP-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/bills-payable-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

This is a missing user workflow finding. It does not assert an untested server-side invoice rejection rule or a specific accounting tolerance. No bill was created.

---

## P3-SUP-001 - Feature 18 - Suppliers

### Title

Supplier export downloads profile fields rather than an account statement

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F18-f.

### Priority

Medium

### Step-by-step

1. Open the QA purchasing supplier detail with existing transactions.
2. Click Export and read the CSV.
3. Inspect the page for a separate account statement export action.

### Expected Result

Export a supplier statement showing dated PO/GRN/bill/payment entries, opening/closing balances and period totals.

### Actual Result

Export downloads supplier profile/contact/credit-term fields. No dated ledger/balance statement or separate statement export action is exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/suppliers-1/artifacts/suppliers-features.ui-F18--27752-t-statement-export-contents-phase3-suppliers/P3-SUP-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/suppliers-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

The actual downloaded file is attached. Existing supplier records are read only. Supplier catalogue coverage is tracked separately.

---

## P3-SUP-002 - Feature 18 - Suppliers

### Title

Supplier catalogue hides and cannot search its persisted vendor-specific SKU

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F18-e.

### Priority

Medium

### Step-by-step

1. Create an owned zero-stock QA product with a distinct global SKU.
2. Attach only that product to the QA purchasing vendor with a distinct supplier_sku and reload the catalogue.
3. Confirm the server returns the supplier-specific SKU, inspect its display, and search that exact SKU.

### Expected Result

Display and resolve the supplier-specific SKU in the vendor catalogue while retaining the global product identity.

### Actual Result

The server retains supplier_sku=QA-P3-VENDOR-1794924865043, but the catalogue displays the global SKU only and searching the vendor SKU yields no matching product.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/suppliers-2/artifacts/suppliers-preferred-skus.u-255ee-catalogue-search-and-detach-phase3-suppliers/P3-SUP-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/suppliers-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

API setup is diagnostic and uses the published attach contract at the observed vendor endpoint. The owned relation is detached and the product archived; existing vendor products are untouched.

---

## P3-CUST-001 - Feature 19 - Customers

### Title

Customer groups and automatic pricing tiers cannot be configured

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F19-e.

### Priority

Medium

### Step-by-step

1. Inspect New Customer and Settings > Customers.
2. Look for Retail/Wholesale/VIP group membership and tier discount rules.

### Expected Result

Manage customer groups/tiers and apply their configured automatic discounts during checkout.

### Actual Result

The account form has Individual/Business type and status, but no group/tier selector. Settings > Customers provides custom fields only, with no pricing-tier rules.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/customers-1/artifacts/customers-features.ui-F19--e801c-redit-ceiling-configuration-phase3-customers/P3-CUST-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/customers-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Customer type and ad hoc discounts are not automatic tier pricing. No membership or pricing data changed.

---

## P3-CUST-002 - Feature 19 - Customers

### Title

Customer account UI has no credit enablement or debt ceiling configuration

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F19-f.

### Priority

Medium

### Step-by-step

1. Open New Customer and inspect all account fields.
2. Inspect Settings > Customers for credit limits/enforcement rules.
3. Attempt to configure an isolated customer debt ceiling using the exposed controls.

### Expected Result

Configure credit eligibility/ceiling so checkout can enforce and explain a breach.

### Actual Result

No credit-enable, credit-limit or ceiling input is exposed in the inspected customer account/settings UI.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/customers-1/artifacts/customers-features.ui-F19--e801c-redit-ceiling-configuration-phase3-customers/P3-CUST-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/customers-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

This confirms a configuration workflow gap. Actual over-limit checkout blocking is unverified without a configured account; the report does not claim an untested ceiling bypass.

---

## P3-REP-001 - Feature 20 - Reports

### Title

Profit report exposes gross product profit but no net-margin deep dive

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F20-g.

### Priority

Medium

### Step-by-step

1. Open Reports > Product Performance.
2. Verify revenue minus recorded cost and inspect available profitability analyses.
3. Look for expense-adjusted net profit/margin and its cost breakdown.

### Expected Result

Provide gross profit and expense-adjusted net-margin analysis with a stated cost basis.

### Actual Result

The report exposes product revenue, cost, profit and gross margin only; there is no net-margin/operating-expense breakdown.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/reports-4/artifacts/reports-features.ui-F20-g--f288b-and-net-margin-availability-phase3-reports/P3-REP-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/reports-4 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Revenue and revenue-minus-recorded-cost arithmetic are checked; recorded cost provenance remains unverified (owned catalogue cost 3, reported COGS 0). Expense policy and backend net-profit values are not invented.

---

## P3-REP-002 - Feature 20 - Reports

### Title

Aging reports provide receivables but no supplier/creditor aging analysis

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F20-i.

### Priority

Medium

### Step-by-step

1. Inspect Reports > Accounts receivable aging.
2. Inspect the server-backed report catalogue for supplier/payables/creditor aging.
3. Inspect Bills analysis controls for payable age buckets.

### Expected Result

Provide customer debtor and supplier creditor aging by due-date buckets and reconcile balances.

### Actual Result

Customer receivables aging exists, but no supplier/payables aging report appears in the catalogue or Bills controls.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/reports-4/artifacts/reports-features.ui-F20-i--40eb7-creditor-aging-availability-phase3-reports/P3-REP-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/reports-4 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Due-date listing and total due are not bucketed creditor aging. AR buckets are reconstructed from live invoice due dates/remaining balances and totals reconcile; credit-application/refund accounting policy remains outside this case.

---

## P3-RPT-001 - Feature 21 - Custom Reports

### Title

Report builder only saves predefined report choices rather than custom dimensions and metrics

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F21-a.

### Priority

Medium

### Step-by-step

1. Open Saved Reports > Build a report.
2. Inspect Reports on and available query controls.
3. Attempt to choose dimensions, metrics and custom filters.

### Expected Result

Compose a visual query with selected dimensions, metrics, dates and custom filters.

### Actual Result

The form offers a predefined report type, branch and dates only; no dimension/metric or custom query filter editor is present.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/custom-reports-2/artifacts/custom-reports-features.ui-e4cf0-ensions-metrics-and-filters-phase3-custom-reports/P3-RPT-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/custom-reports-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Saving predefined selections is tested separately and does not satisfy the custom query composer.

---

## P3-RPT-002 - Feature 21 - Custom Reports

### Title

Saving a report with default filters returns an array and the UI drops the saved template

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F21-b.

### Priority

High

### Step-by-step

1. Build a report with a valid name/type, leaving All branches and dates blank.
2. Click Save and reload Saved Reports.
3. Compare the saved record returned by the API with the displayed list.

### Expected Result

A valid unfiltered report saves and remains visible/runnable.

### Actual Result

The API persists filters as an empty array while the client schema requires an object; the persisted report is not displayed in the template list.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/custom-reports-2/artifacts/custom-reports-features.ui-b419c-aved-report-remains-visible-phase3-custom-reports/P3-RPT-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/custom-reports-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

A second case uses nonempty date filters to exercise the runnable path. Owned records are deleted after each case.

---

## P3-DOC-001 - Feature 22 - Document Design

### Title

Document Builder has presets and form controls but no drag-and-drop design canvas

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F22-e.

### Priority

Medium

### Step-by-step

1. Open Document Builder.
2. Inspect editing surfaces and element/layout controls.
3. Attempt to add and reposition a document text/image element on a visual canvas.

### Expected Result

Design and persist a document using a drag-and-drop visual canvas with editable elements.

### Actual Result

The available workflow is preset/form configuration and preview; no editable canvas, element palette or draggable layout elements are exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/document-design-1/artifacts/document-design-features.u-4348c-ag-and-drop-canvas-designer-phase3-document-design/P3-DOC-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/document-design-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

No document template was saved or reset. Existing brand/template settings are preserved.

---

## P3-FONT-001 - Feature 22 - Document Design

### Title

Settings font upload serializes File as JSON and loses the font bytes

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F22-f.

### Priority

High

### Step-by-step

1. Open Settings > Advanced > Custom Fonts.
2. Upload the licensed valid Vera.ttf fixture with a unique QA font name.
3. Inspect the native upload content type and response.

### Expected Result

Transmit real TTF/OTF bytes, save the font and make it available for management and document text.

### Actual Result

The native upload uses application/json (42 request bytes for a 65932-byte font), returning HTTP 422: {"success":false,"code":422,"error_key":"validation_failed","message":"The file field is required.","data":null,"errors":{"file":["The file field is required."]}}

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/document-design-1/artifacts/document-design-features.u-104e4-ence-management-and-cleanup-phase3-document-design/P3-FONT-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/document-design-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Fresh reproduction of MVP-FONT-001. Separate multipart diagnostic setup below verifies persistence/file bytes/deletion; it does not pass UI upload.

---

## P3-RBAC-001 - Feature 23 - Roles

### Title

Users & Roles has no custom role or granular permission matrix editor

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F23-f.

### Priority

Medium

### Step-by-step

1. Open Users & Roles and wait for the real roles response.
2. Inspect Roles tab for custom role creation/editing.
3. Inspect Permissions tab for per-entity grant checkboxes and saving.

### Expected Result

Create a named custom role, toggle granular entity permissions and persist/apply its matrix.

### Actual Result

No create/add custom role action is present; the Permissions view exposes no editable per-entity matrix.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/roles-2/artifacts/roles-features.ui-F23-f-granular-custom-role-matrix-builder-phase3-roles/P3-RBAC-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/roles-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

This is a missing administration workflow. Effective allow/deny enforcement also needs an isolated activated staff identity; owner-only page visibility is not treated as an RBAC pass.

---

## P3-SEC-001 - Feature 24 - Security

### Title

Revoked automation session retains authenticated account access

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F24-f.

### Priority

High

### Step-by-step

1. Sign in a second owned automation session and identify its current session ID.
2. From the primary session, revoke only that new secondary session.
3. Request /auth/me again with the secondary session credentials.

### Expected Result

Revoked credentials immediately fail authentication; the primary session remains active.

### Actual Result

The target disappears from session management but /auth/me returns HTTP 200.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/security-2/artifacts/security-features.ui-F24-f-370ce--created-automation-session-phase3-security/P3-SEC-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/security-2 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

No other user/session was revoked. Tokens remain private and are not attached.

---

## P3-API-002 - Feature 26 - Integrations

### Title

API documentation lacks a resource reference and falsely says API keys cannot authenticate

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F26-c.

### Priority

Medium

### Step-by-step

1. Open Integrations > Documentation.
2. Inspect documentation and links for Products, Inventory, Invoices, Orders and Customers.

### Expected Result

A full endpoint reference describes methods, paths, request/response schemas, authentication and permissions for the named resources.

### Actual Result

The page documents generic headers, envelope, errors and pagination only. No resource endpoint/method/schema reference or linked OpenAPI specification is exposed. The API key page and documentation also claim key authentication is unavailable, contradicted by the session-free JSON read/invalid/rotated/revoked controls.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/integrations-6/artifacts/integrations-features.ui-F-8ed86-int-reference-documentation-phase3-integrations/P3-API-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/integrations-6 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

F26-a/b controls prove the backend accepts active keys (JSON 200), refuses anonymous/invalid/old/revoked credentials (401), and rejects read-only writes (403). Update the stale notices and provide the actual current endpoint/scope reference. Secrets are not attached.

---

## P3-WEB-001 - Feature 26 - Integrations

### Title

Webhook subscriptions omit the three events required by the specification

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F26-d.

### Priority

Medium

### Step-by-step

1. Open Integrations > Webhooks and wait for the endpoint and event-catalogue reads.
2. Open New endpoint and inspect the subscription choices.
3. Compare them with order.created, stock.low and invoice.paid in FEATURES.md.

### Expected Result

Configure subscriptions for order.created, stock.low and invoice.paid.

### Actual Result

The live catalogue offers invoice.created, credit_note.created, quotation.created, payment.received. Missing required event names: order.created, stock.low, invoice.paid.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/integrations-7/artifacts/integrations-features.ui-F-b6310--and-delivery-prerequisites-phase3-integrations/P3-WEB-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/integrations-7 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

Registration is available after loading; an earlier disabled-button probe was not valid acceptance evidence. payment.received is not assumed equivalent to invoice.paid. Backend delivery, logs/signatures and manual retries are blocked without a controlled receiver, not confirmed broken.

---

## P3-HW-001 - Feature 27 - Hardware

### Title

Adhesive barcode label generation is explicitly unavailable

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F27-e.

### Priority

Medium

### Step-by-step

1. Open Integrations > Printers.
2. Inspect label-printer configuration and label-generation actions.
3. Read the label printing availability notice.

### Expected Result

Generate adhesive barcode labels in a supported printer format before physical device testing.

### Actual Result

The live page explicitly states label printing (Zebra ZPL) is not implemented and no label-generation action is exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/hardware-1/artifacts/hardware-features.ui-F27-c-4e468-nd-requested-physical-skips-phase3-hardware/P3-HW-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/hardware-1 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

This is a software availability finding. Physical label-printer execution is separately skipped at user request; no device result is inferred.

---

## P3-BACKUP-001 - Feature 28 - Settings

### Title

Advanced Export JSON reports success without downloading data or creating an export job

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F28-f.

### Priority

High

### Step-by-step

1. Open Settings > Security and capture existing export jobs.
2. Open Advanced > Export JSON.
3. Observe the success toast, downloads, write requests and export jobs after a fresh read.

### Expected Result

Produce a company JSON dump or create a traceable export job with eventual downloadable output.

### Actual Result

The button displays Data export (JSON) requested! but makes no export request/download and creates no export job.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/settings-3/artifacts/settings-features.ui-F28-f-39414-d-automated-backup-controls-phase3-settings/P3-BACKUP-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/settings-3 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

The unchanged served handler only emits the toast. Separate Security export controls are not counted as making this advertised Advanced JSON action work.

---

## P3-BACKUP-002 - Feature 28 - Settings

### Title

Settings has no automated database backup schedule or execution history

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F28-f.

### Priority

Medium

### Step-by-step

1. Inspect Settings > Advanced and Security data-management controls.
2. Look for backup cadence, retention/storage settings and completed/failed backup history.

### Expected Result

Configure and inspect automated database backups, including scheduled execution and recovery artifacts.

### Actual Result

No backup schedule, retention/storage management or execution history is exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/settings-3/artifacts/settings-features.ui-F28-f-39414-d-automated-backup-controls-phase3-settings/P3-BACKUP-002.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/settings-3 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

This confirms a missing administration workflow. Backend cron/database backup execution and restore safety cannot be verified without platform access; no failure of an unseen backup job is alleged.

---

## P3-HELP-001 - Feature 30 - Help

### Title

Help provides searchable FAQs but no video guides

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 17 November 2026. Requirements: F30-d.

### Priority

Medium

### Step-by-step

1. Open Help Center and search for product help.
2. Expand a matching answer and run a nonexistent-query control.
3. Inspect the complete help catalogue for video guides/player links.

### Expected Result

Provide interactive searchable knowledge content plus accessible video guides.

### Actual Result

Search/FAQ expansion works, but the catalogue contains no video guide, video player or linked video tutorial.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/help-4/artifacts/help-features.ui-F30-d-sea-73ff4-e-controls-and-video-guides-phase3-help/P3-HELP-001.png)
- Execution: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase3-2026-11-17/help-4 (JSON/HTML report contains the live page snapshot and named diagnostic attachments).

### Comment

FAQ search is a positive result. The missing video portion prevents full completion of the combined requirement.

---

