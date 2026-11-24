# NexStock - Confirmed bugs remaining after production fix retest

Retest: **24 November 2026**, Indian/Mauritius. Production: https://nexstock.stylotech.mu/app. QA company: **Nexstock QA Company**. Source scope: the 32 unique tickets in the previous detailed remaining-bug list, from the 19-20 November retest.

**28 unique confirmed open tickets** (28 carried forward and 0 newly confirmed). Fully passed tickets are excluded and recorded in [the ticket status register](RETEST-STATUS.md). PARTIAL means a component was corrected but a confirmed failure remains.

Each entry records what was actually exercised and failed. Missing workflows are reported as availability failures; blocked downstream checks and corrected automation are not additional application bugs. Evidence is from this retest, not copied as a new reproduction from the earlier campaign.

## P3-DASH-001 - 1 - Dashboard & Executive Analytics

### Title

Dashboard provides no period-over-period comparison configuration or results

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F01-b-P3.

### Priority

Medium

### Step-by-step

**Test performed:** F01-b-P3 current/prior period comparisons and calculation controls

1. Sign in to the QA company and open Dashboard; await the live statistics.
2. Open Customize > Add Widget > Stat Card and inspect every available metric/date/comparison setting.
3. Cancel and inspect Line Chart configuration as well; inspect the normal dashboard for current/prior-period controls.

### Expected Result

Choose current and comparison periods and display auditable absolute/percentage changes for matching dates and branch scope, including zero-prior handling.

### Actual Result

**Retest: FAIL.** Normal Dashboard and the inspected Stat Card/Line Chart configurations expose no current-versus-prior comparison control or comparative result. The Phase 3 comparison workflow cannot be selected.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/dashboard-1/artifacts/dashboard-features.ui-F01--5eb65-ns-and-calculation-controls-phase3-dashboard/P3-DASH-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/dashboard-1/results.json)

### Comment

Availability failure is confirmed across the live dashboard and relevant widget configurations. No claim is made about incorrect comparison arithmetic, because that workflow cannot be configured. Local builder edits are isolated to this browser context; no business layout was reset.

**Reviewed result:** Normal Dashboard and the inspected Stat Card/Line Chart configurations expose no current-versus-prior comparison control or comparative result. The Phase 3 comparison workflow cannot be selected.

---

## P3-PROD-001 - 2 - Products & Catalog

### Title

Product creation offers no serialized-unit tracking or serial-number assignment

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F02-a-P3.

### Priority

Medium

### Step-by-step

**Test performed:** F02-a-P3 serialized unit assignment and unit identity controls

1. Open Products > New Product and inspect Basic Info, Variants and Custom Fields.
2. Inspect Product type options and stock settings for serialized inventory or per-unit serial-number assignment.

### Expected Result

Enable serialized inventory, capture unique unit serials, reject duplicates and trace individual units through receiving/sale.

### Actual Result

**Retest: FAIL.** The live product form/type options contain no serialized inventory mode or per-unit serial-number controls. Basic variants and per-product custom text fields are not unit-identity tracking.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/products-1/artifacts/products-features.ui-F02-a-ea427--and-unit-identity-controls-phase3-products/P3-PROD-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/products-1/results.json)

### Comment

Assembly bundles are tested separately under F02-k. No claim of broken duplicate-serial validation is made because serialized-unit assignment is unavailable.

**Reviewed result:** The live product form/type options contain no serialized inventory mode or per-unit serial-number controls. Basic variants and per-product custom text fields are not unit-identity tracking.

---

## P3-PROD-005 - 2 - Products & Catalog

### Title

Categories have no dynamic field definitions or schema assignment

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F02-l.

### Priority

Medium

### Step-by-step

**Test performed:** F02-l category-defined dynamic field schema management

1. Open Settings > Products and inspect Product Categories and its management controls.
2. Open New Product > Custom Fields and compare its per-product field editor with category management.

### Expected Result

Define dynamic fields at category level, assign the category and inherit/apply its field schema consistently to products in that category.

### Actual Result

**Retest: FAIL.** Category management exposes no field/schema definition control. The separate Custom Fields tab configures only an individual product and does not define or inherit category attributes.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/products-1/artifacts/products-features.ui-F02-l-e179a-mic-field-schema-management-phase3-products/P3-PROD-005.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/products-1/results.json)

### Comment

Per-product custom fields are not accepted as category-level schema management. No category data was changed. Schema persistence/type validation/inheritance cannot be exercised without a category schema workflow.

**Reviewed result:** Category management exposes no field/schema definition control. The separate Custom Fields tab configures only an individual product and does not define or inherit category attributes.

---

## P3-TRF-001 - 5 - Stock Transfers

### Title

Transfers have no printable dispatch manifest or delivery slip

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F05-e.

### Priority

Medium

### Step-by-step

**Test performed:** F05-e F05-f manifests and discrepancy workflow at every transfer stage

1. Create an owned QA inter-branch transfer and inspect its detail/actions.
2. Advance the owned transfer through its live approval/packing/shipping/receipt stages.
3. Inspect the action controls at every stage, including completed history, for a manifest/slip or export/print action.

### Expected Result

A dispatch manifest/delivery slip can be generated for the exact transfer with its reference, source/destination and item quantities.

### Actual Result

**Retest: FAIL.** No manifest, delivery-slip, PDF/download or print action is exposed at any inspected reachable transfer stage.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/transfers-1/artifacts/transfers-features.ui-F05--cf8f4-low-at-every-transfer-stage-phase3-transfers/P3-TRF-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/transfers-1/results.json)

### Comment

The transfer stock lifecycle and captured baselines are verified/recovered independently. A physical printer is not needed to test software document generation and was not exercised.

**Reviewed result:** No manifest, delivery-slip, PDF/download or print action is exposed at any inspected reachable transfer stage.

---

## P3-TRF-002 - 5 - Stock Transfers

### Title

In-transit receipt has no damage, shortage or discrepancy dispute entry

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F05-f.

### Priority

Medium

### Step-by-step

**Test performed:** F05-e F05-f manifests and discrepancy workflow at every transfer stage

1. Create and dispatch an owned QA transfer.
2. Inspect the in-transit and receiving controls before completion.
3. Attempt to record actual received quantities, damage/shortage details and a dispute, then inspect completed history.

### Expected Result

Record and persist transit damage/shortage or a dispute against the transfer without treating every shipped unit as received in good condition.

### Actual Result

**Retest: FAIL.** The reachable transfer states provide no damage/shortage/discrepancy input, received-quantity adjustment or dispute action; receipt is a whole-transfer completion action.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/transfers-1/artifacts/transfers-features.ui-F05--cf8f4-low-at-every-transfer-stage-phase3-transfers/P3-TRF-002.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/transfers-1/results.json)

### Comment

No discrepancy accounting result is claimed because there is no input workflow. Stock is restored, and the synthetic transfer is retained completed for audit.

**Reviewed result:** The reachable transfer states provide no damage/shortage/discrepancy input, received-quantity adjustment or dispute action; receipt is a whole-transfer completion action.

---

## P3-COUNT-001 - 6 - Stock Counts

### Title

Stock counts cannot be scheduled or scoped to a category

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F06-d.

### Priority

Medium

### Step-by-step

**Test performed:** F06-d scheduled category cycle audit controls

1. Open Stock Counts and inspect the list actions.
2. Open Start a count and inspect its scope and scheduling fields.

### Expected Result

Create a recurring/category cycle-count schedule and later open an audit limited to the chosen category.

### Actual Result

**Retest: FAIL.** The list offers Start a count only. Its form has Branch and Notes; opening a count always freezes the full branch. No category or scheduling control is available.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/stock-counts-1/artifacts/stock-counts-features.ui-F-d14f5-tegory-cycle-audit-controls-phase3-stock-counts/P3-COUNT-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/stock-counts-1/results.json)

### Comment

No schedule was created and no inventory committed. Physical counting is skipped at user request; these missing software controls do not require devices.

**Reviewed result:** The list offers Start a count only. Its form has Branch and Notes; opening a count always freezes the full branch. No category or scheduling control is available.

---

## P3-COUNT-002 - 6 - Stock Counts

### Title

Count sheet has no barcode-driven counting workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F06-e.

### Priority

Medium

### Step-by-step

**Test performed:** F06-e software barcode counting in a disposable draft

1. Open an owned QA draft stock count.
2. Inspect the sheet for a scan target or scan mode.
3. With focus on the sheet heading, send an existing QA SKU followed by Enter as keyboard HID input.

### Expected Result

A software scan mode resolves a product and increments/focuses its count with clear feedback.

### Actual Result

**Retest: FAIL.** Only per-row numeric inputs are present; there is no barcode target/mode, and the emulated SKU plus Enter leaves every counted value unchanged.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/stock-counts-1/artifacts/stock-counts-features.ui-F-a0fe8-nting-in-a-disposable-draft-phase3-stock-counts/P3-COUNT-002.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/stock-counts-1/results.json)

### Comment

Software HID emulation only. No physical scanner tested. The draft is abandoned without saving counts or reconciling inventory.

**Reviewed result:** Only per-row numeric inputs are present; there is no barcode target/mode, and the emulated SKU plus Enter leaves every counted value unchanged.

---

## P3-EXP-003 - 7 - Shelf Life

### Title

Expired batches expose delete metadata but no supervised stock disposal workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F07-e.

### Priority

Medium

### Step-by-step

**Test performed:** F07-a b c d e batch dates warnings allocation and disposal workflow

1. Record an owned expired lot and open Shelf Life > Expired.
2. Inspect the row actions and page controls for formal write-off/disposal with supervisor authorization.

### Expected Result

Record a supervised expired-stock write-off with stock movement, reason and audit linkage.

### Actual Result

**Retest: FAIL.** Expired rows expose Delete batch only; no disposal/write-off request, supervisor approval or linked disposal ledger is available.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/shelf-life-1/artifacts/shelf-life-features.ui-F07-16998-ation-and-disposal-workflow-phase3-shelf-life/P3-EXP-003.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/shelf-life-1/results.json)

### Comment

Delete batch is not treated as formal stock disposal. Real supervisor identity validation cannot run without a disposal workflow and isolated staff account. Owned metadata is deleted only during cleanup.

**Reviewed result:** Expired rows expose Delete batch only; no disposal/write-off request, supervisor approval or linked disposal ledger is available.

---

## P3-GRN-001 - 16 - Goods Receiving / 7 - Shelf Life

### Title

Goods receiving cannot capture manufacturer lots or lot expiry dates

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F07-a, F16-e.

### Priority

Medium

### Step-by-step

**Test performed:** F07-a F16-e receiving lot and expiry capture

1. Create an owned QA PO and advance it to Ordered.
2. Open Receive Goods and inspect the line entry controls.
3. Attempt to enter a manufacturer lot and expiry date alongside accepted quantities.

### Expected Result

Persist received quantities with manufacturer batch/lot number and expiry date, linked to the receipt and product stock.

### Actual Result

**Retest: FAIL.** The receiving form exposes accepted/rejected quantities and rejection reason only; no manufacturer lot or expiry capture input is available.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/goods-receipts-1/artifacts/goods-receipts-features.ui-89f2b-ving-lot-and-expiry-capture-phase3-goods-receipts/P3-GRN-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/goods-receipts-1/results.json)

### Comment

Grouped cross-feature finding: F07-a and F16-e describe the same intake capability. Separate Shelf Life metadata entry does not provide receipt-linked capture. No receipt is committed in this availability check.

**Reviewed result:** The receiving form exposes accepted/rejected quantities and rejection reason only; no manufacturer lot or expiry capture input is available.

---

## P3-POS-001 - 8 - POS

### Title

Offline checkout fails without storing a durable queued sale

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F08-l.

### Priority

High

### Step-by-step

**Test performed:** F08-l offline cash sale durability and reconnect prerequisite

1. Prepare one owned QA item with stock and open normal POS cash payment.
2. Set the browser network offline before Complete Sale.
3. Complete the cash sale and inspect confirmation and IndexedDB durable storage.

### Expected Result

Record an offline sale durably, provide an offline receipt/queued status and synchronize once on reconnection.

### Actual Result

**Retest: FAIL.** Checkout remains on the payment dialog while offline; no sale confirmation/receipt or IndexedDB database is created to retain a durable queued sale. Online mutation processing may remain paused until reconnection.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/pos-1/artifacts/pos-features.ui-F08-l-offl-d23e0--and-reconnect-prerequisite-phase3-pos/P3-POS-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/pos-1/results.json)

### Comment

Network restored during cleanup after leaving the payment page. No online replacement sale is submitted. Reconnect deduplication is blocked because durable offline acceptance does not occur.

**Reviewed result:** Checkout remains on the payment dialog while offline; no sale confirmation/receipt or IndexedDB database is created to retain a durable queued sale. Online mutation processing may remain paused until reconnection.

---

## P3-POS-002 - 8 - POS

### Title

POS has no customer loyalty balance or redemption workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F08-m.

### Priority

Medium

### Step-by-step

**Test performed:** F08-m POS loyalty redemption controls

1. Open POS and inspect customer/cart/payment controls for loyalty rewards.
2. Inspect the customer/cart controls for points balance and redemption.

### Expected Result

A linked customer can view and redeem eligible loyalty points with validated limits and persisted balance changes.

### Actual Result

**Retest: FAIL.** No loyalty/points balance or redemption control is exposed in the POS cart; no loyalty programme appears in the served POS implementation.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/pos-1/artifacts/pos-features.ui-F08-m-POS-loyalty-redemption-controls-phase3-pos/P3-POS-002.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/pos-1/results.json)

### Comment

Customer linking and manual discounts are separate core functions. No point balance is invented or adjusted.

**Reviewed result:** No loyalty/points balance or redemption control is exposed in the POS cart; no loyalty programme appears in the served POS implementation.

---

## P3-QUEUE-001 - 10 - Order Queue

### Title

Processing ticket editor cannot assign a technician, service bay or table

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F10-b.

### Priority

Medium

### Step-by-step

**Test performed:** F10-a b c owned processing order live states assignment and ticket printing

1. Sell an owned processing item through POS.
2. Open Orders Queue and Edit / Add Note for the resulting owned ticket.
3. Inspect assignment inputs.

### Expected Result

Assign and persist a technician/service bay/table association on the ticket.

### Actual Result

**Retest: FAIL.** The editor provides priority, estimated time, ready date and internal notes only. No assignment selector or table/bay input is present.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/order-queue-1/artifacts/order-queue-features.ui-F1-45441-ignment-and-ticket-printing-phase3-order-queue/P3-QUEUE-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/order-queue-1/results.json)

### Comment

The native assignment editor remains absent. Separate explicit API controls accepted and persisted the active current owner, cleared the assignee, and rejected the invalid-ID control without changing the valid assignment. Inactive/cross-business coverage is limited as stated in the summary; no staff account was changed.

**Reviewed result:** The editor provides priority, estimated time, ready date and internal notes only. No assignment selector or table/bay input is present.

---

## P3-QUEUE-002 - 10 - Order Queue

### Title

Order queue has no thermal work-order ticket generation action

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F10-c.

### Priority

Medium

### Step-by-step

**Test performed:** F10-a b c owned processing order live states assignment and ticket printing

1. Open an owned order in the live queue.
2. Inspect its card menu and editor for work-order printing.

### Expected Result

Generate a thermal work-order ticket for the selected job, including its reference and instructions.

### Actual Result

**Retest: FAIL.** The card menu offers Edit / Add Note and Cancel Order only; there is no ticket/print action.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/order-queue-1/artifacts/order-queue-features.ui-F1-45441-ignment-and-ticket-printing-phase3-order-queue/P3-QUEUE-002.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/order-queue-1/results.json)

### Comment

Software document generation checked. Physical thermal printing is skipped at user request.

**Reviewed result:** The card menu offers Edit / Add Note and Cancel Order only; there is no ticket/print action.

---

## P3-INV-001 - 12 - Invoicing

### Title

Recurring contract billing cannot be configured

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F12-f.

### Priority

Medium

### Step-by-step

**Test performed:** F12-f g h recurring invoice currency and automated reminder controls

1. Open invoice list and New Invoice.
2. Inspect invoice controls and Company/Customization/Notifications settings for the specified advanced workflow.

### Expected Result

Create a recurring contract/retainer schedule, persist its cadence and generate invoices without manual duplication.

### Actual Result

**Retest: FAIL.** Recurring contract billing cannot be configured. No corresponding workflow is available on the inspected live forms/settings.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/invoicing-1/artifacts/invoicing-features.ui-F12--7f189-automated-reminder-controls-phase3-invoicing/P3-INV-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/invoicing-1/results.json)

### Comment

No schedule or customer financial record was modified.

**Reviewed result:** Recurring contract billing cannot be configured. No corresponding workflow is available on the inspected live forms/settings.

---

## P3-INV-002 - 12 - Invoicing

### Title

Invoice editor has no per-invoice currency or recorded exchange rate

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F12-g.

### Priority

Medium

### Step-by-step

**Test performed:** F12-f g h recurring invoice currency and automated reminder controls

1. Open invoice list and New Invoice.
2. Inspect invoice controls and Company/Customization/Notifications settings for the specified advanced workflow.

### Expected Result

Issue MUR, USD and EUR invoices with a recorded exchange rate and currency-specific totals.

### Actual Result

**Retest: FAIL.** Invoice editor has no per-invoice currency or recorded exchange rate. No corresponding workflow is available on the inspected live forms/settings.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/invoicing-1/artifacts/invoicing-features.ui-F12--7f189-automated-reminder-controls-phase3-invoicing/P3-INV-002.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/invoicing-1/results.json)

### Comment

Global display currency does not establish per-document exchange-rate billing. Company currency was not changed.

**Reviewed result:** Invoice editor has no per-invoice currency or recorded exchange rate. No corresponding workflow is available on the inspected live forms/settings.

---

## P3-PO-001 - 15 - Purchase Orders

### Title

Low-stock items have no automatic purchase-order reordering workflow

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F15-e.

### Priority

Medium

### Step-by-step

**Test performed:** F15-e automated reorder controls

1. Inspect purchase-order list and creation controls.
2. Open Reports > Low Stock and inspect replenishment actions.
3. Inspect product reorder thresholds against the available purchasing controls.

### Expected Result

Configure and audit automatic PO generation for items below safety thresholds.

### Actual Result

**Retest: FAIL.** Only manual PO creation and low-stock reporting are available; no automatic reorder policy/schedule or generation workflow is exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/purchase-orders-1/artifacts/purchase-orders-features.ui-F15-e-automated-reorder-controls-phase3-purchase-orders/P3-PO-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/purchase-orders-1/results.json)

### Comment

Threshold alerts alone are not automatic PO generation. No scheduler execution or supplier delivery is inferred from low-stock counts.

**Reviewed result:** Only manual PO creation and low-stock reporting are available; no automatic reorder policy/schedule or generation workflow is exposed.

---

## P3-PO-002 - 15 - Purchase Orders

### Title

Purchase-order detail has no direct supplier email transmission action

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F15-f.

### Priority

Medium

### Step-by-step

**Test performed:** F15-f direct supplier email action across PO states

1. Create an owned QA purchase order for the controlled example.invalid supplier.
2. Inspect draft actions, then approve and mark the same PO ordered.
3. Inspect ordered actions for supplier email transmission and delivery status.

### Expected Result

Send the PO directly to its supplier and retain transmission/delivery evidence.

### Actual Result

**Retest: FAIL.** The inspected PO states expose status changes, print and receive controls but no direct supplier email action or transmission status.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/purchase-orders-1/artifacts/purchase-orders-features.u-bca79-ail-action-across-PO-states-phase3-purchase-orders/P3-PO-002.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/purchase-orders-1/results.json)

### Comment

No message is sent. Mark as Ordered is not treated as email transmission. End-to-end email delivery also requires a controlled QA inbox.

**Reviewed result:** The inspected PO states expose status changes, print and receive controls but no direct supplier email action or transmission status.

---

## P3-AP-001 - 17 - Bills & AP

### Title

Bill entry provides PO linking but no three-way receipt reconciliation

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F17-d.

### Priority

Medium

### Step-by-step

**Test performed:** F17-d three-way bill matching workflow

1. Open Bills > New Bill.
2. Inspect Linked Purchase Order, bill amount fields and any goods-receipt selection.
3. Inspect the bill list for match status/variance or a reconciliation action.

### Expected Result

Compare bill lines, PO ordered cost/quantity and GRN accepted quantities; expose match results and discrepancies.

### Actual Result

**Retest: FAIL.** The form has an optional PO reference plus aggregate subtotal/tax. It has no goods-receipt/line matching controls; the list has no match status or reconciliation action.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/bills-payable-1/artifacts/bills-payable-features.ui--e2445--way-bill-matching-workflow-phase3-bills-payable/P3-AP-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/bills-payable-1/results.json)

### Comment

This is a missing user workflow finding. It does not assert an untested server-side invoice rejection rule or a specific accounting tolerance. No bill was created.

**Reviewed result:** The form has an optional PO reference plus aggregate subtotal/tax. It has no goods-receipt/line matching controls; the list has no match status or reconciliation action.

---

## P3-SUP-001 - 18 - Suppliers

### Title

Supplier export downloads profile fields rather than an account statement

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F18-f.

### Priority

Medium

### Step-by-step

**Test performed:** F18-f supplier account statement export contents

1. Open the QA purchasing supplier detail with existing transactions.
2. Click Export and read the CSV.
3. Inspect the page for a separate account statement export action.

### Expected Result

Export a supplier statement showing dated PO/GRN/bill/payment entries, opening/closing balances and period totals.

### Actual Result

**Retest: FAIL.** Export downloads supplier profile/contact/credit-term fields. No dated ledger/balance statement or separate statement export action is exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/suppliers-1/artifacts/suppliers-features.ui-F18--27752-t-statement-export-contents-phase3-suppliers/P3-SUP-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/suppliers-1/results.json)

### Comment

The actual downloaded file is attached. Existing supplier records are read only. Supplier catalogue coverage is tracked separately.

**Reviewed result:** Export downloads supplier profile/contact/credit-term fields. No dated ledger/balance statement or separate statement export action is exposed.

---

## P3-CUST-001 - 19 - Customers

### Title

Customer groups and automatic pricing tiers cannot be configured

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F19-e.

### Priority

Medium

### Step-by-step

**Test performed:** F19-e groups tiers and F19-f credit ceiling configuration

1. Inspect New Customer and Settings > Customers.
2. Look for Retail/Wholesale/VIP group membership and tier discount rules.

### Expected Result

Manage customer groups/tiers and apply their configured automatic discounts during checkout.

### Actual Result

**Retest: FAIL.** The account form has Individual/Business type and status, but no group/tier selector. Settings > Customers provides custom fields only, with no pricing-tier rules.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/customers-1/artifacts/customers-features.ui-F19--e801c-redit-ceiling-configuration-phase3-customers/P3-CUST-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/customers-1/results.json)

### Comment

Customer type and ad hoc discounts are not automatic tier pricing. No membership or pricing data changed.

**Reviewed result:** The account form has Individual/Business type and status, but no group/tier selector. Settings > Customers provides custom fields only, with no pricing-tier rules.

---

## P3-REP-001 - 20 - Reports

### Title

Profit report exposes gross product profit but no net-margin deep dive

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F20-g.

### Priority

Medium

### Step-by-step

**Test performed:** F20-g profit arithmetic and net margin availability

1. Open Reports > Product Performance.
2. Verify revenue minus recorded cost and inspect available profitability analyses.
3. Look for expense-adjusted net profit/margin and its cost breakdown.

### Expected Result

Provide gross profit and expense-adjusted net-margin analysis with a stated cost basis.

### Actual Result

**Retest: FAIL.** The report exposes product revenue, cost, profit and gross margin only; there is no net-margin/operating-expense breakdown.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/reports-1/artifacts/reports-features.ui-F20-g--f288b-and-net-margin-availability-phase3-reports/P3-REP-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/reports-1/results.json)

### Comment

Revenue and revenue-minus-recorded-cost arithmetic are checked; recorded cost provenance remains unverified (owned catalogue cost 3, reported COGS 0). Expense policy and backend net-profit values are not invented.

**Reviewed result:** The report exposes product revenue, cost, profit and gross margin only; there is no net-margin/operating-expense breakdown.

---

## P3-REP-002 - 20 - Reports

### Title

Aging reports provide receivables but no supplier/creditor aging analysis

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F20-i.

### Priority

Medium

### Step-by-step

**Test performed:** F20-i debtor bucket arithmetic and creditor aging availability

1. Inspect Reports > Accounts receivable aging.
2. Inspect the server-backed report catalogue for supplier/payables/creditor aging.
3. Inspect Bills analysis controls for payable age buckets.

### Expected Result

Provide customer debtor and supplier creditor aging by due-date buckets and reconcile balances.

### Actual Result

**Retest: FAIL.** Customer receivables aging exists, but no supplier/payables aging report appears in the catalogue or Bills controls.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/reports-1/artifacts/reports-features.ui-F20-i--40eb7-creditor-aging-availability-phase3-reports/P3-REP-002.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/reports-1/results.json)

### Comment

Due-date listing and total due are not bucketed creditor aging. AR buckets are reconstructed from live invoice due dates/remaining balances and totals reconcile; credit-application/refund accounting policy remains outside this case.

**Reviewed result:** Customer receivables aging exists, but no supplier/payables aging report appears in the catalogue or Bills controls.

---

## P3-RPT-001 - 21 - Custom Reports

### Title

Report builder only saves predefined report choices rather than custom dimensions and metrics

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F21-a.

### Priority

Medium

### Step-by-step

**Test performed:** F21-a custom dimensions metrics and filters

1. Open Saved Reports > Build a report.
2. Inspect Reports on and available query controls.
3. Attempt to choose dimensions, metrics and custom filters.

### Expected Result

Compose a visual query with selected dimensions, metrics, dates and custom filters.

### Actual Result

**Retest: FAIL.** The form offers a predefined report type, branch and dates only; no dimension/metric or custom query filter editor is present.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/custom-reports-1/artifacts/custom-reports-features.ui-e4cf0-ensions-metrics-and-filters-phase3-custom-reports/P3-RPT-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/custom-reports-1/results.json)

### Comment

Saving predefined selections is tested separately and does not satisfy the custom query composer.

**Reviewed result:** The form offers a predefined report type, branch and dates only; no dimension/metric or custom query filter editor is present.

---

## P3-DOC-001 - 22 - Document Design

### Title

Document Builder has presets and form controls but no drag-and-drop design canvas

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F22-e.

### Priority

Medium

### Step-by-step

**Test performed:** F22-e visual drag and drop canvas designer

1. Open Document Builder.
2. Inspect editing surfaces and element/layout controls.
3. Attempt to add and reposition a document text/image element on a visual canvas.

### Expected Result

Design and persist a document using a drag-and-drop visual canvas with editable elements.

### Actual Result

**Retest: FAIL.** The available workflow is preset/form configuration and preview; no editable canvas, element palette or draggable layout elements are exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/document-design-1/artifacts/document-design-features.u-4348c-ag-and-drop-canvas-designer-phase3-document-design/P3-DOC-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/document-design-1/results.json)

### Comment

No document template was saved or reset. Existing brand/template settings are preserved.

**Reviewed result:** The available workflow is preset/form configuration and preview; no editable canvas, element palette or draggable layout elements are exposed.

---

## P3-RBAC-001 - 23 - Roles

### Title

Users & Roles has no custom role or granular permission matrix editor

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F23-f.

### Priority

Medium

### Step-by-step

**Test performed:** F23-f granular custom role matrix builder

1. Open Users & Roles and wait for the real roles response.
2. Inspect Roles tab for custom role creation/editing.
3. Inspect Permissions tab for per-entity grant checkboxes and saving.

### Expected Result

Create a named custom role, toggle granular entity permissions and persist/apply its matrix.

### Actual Result

**Retest: FAIL.** No create/add custom role action is present; the Permissions view exposes no editable per-entity matrix.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/roles-1/artifacts/roles-features.ui-F23-f-granular-custom-role-matrix-builder-phase3-roles/P3-RBAC-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/roles-1/results.json)

### Comment

This is a missing administration workflow. Effective allow/deny enforcement also needs an isolated activated staff identity; owner-only page visibility is not treated as an RBAC pass.

**Reviewed result:** No create/add custom role action is present; the Permissions view exposes no editable per-entity matrix.

---

## P3-WEB-001 - 26 - Integrations

### Title

Webhook subscriptions omit the three events required by the specification

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F26-d.

### Priority

Medium

### Step-by-step

**Test performed:** F26-d e webhook registration controls and delivery prerequisites

1. Open Integrations > Webhooks and wait for the endpoint and event-catalogue reads.
2. Open New endpoint and inspect the subscription choices.
3. Compare them with order.created, stock.low and invoice.paid in FEATURES.md.

### Expected Result

Configure subscriptions for order.created, stock.low and invoice.paid.

### Actual Result

**Retest: FAIL.** The live catalogue offers invoice.created, credit_note.created, quotation.created, payment.received. Missing required event names: order.created, stock.low, invoice.paid.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/integrations-1/artifacts/integrations-features.ui-F-b6310--and-delivery-prerequisites-phase3-integrations/P3-WEB-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/integrations-1/results.json)

### Comment

Registration is available after loading; an earlier disabled-button probe was not valid acceptance evidence. payment.received is not assumed equivalent to invoice.paid. Backend delivery, logs/signatures and manual retries are blocked without a controlled receiver, not confirmed broken.

**Reviewed result:** The live catalogue offers invoice.created, credit_note.created, quotation.created, payment.received. Missing required event names: order.created, stock.low, invoice.paid.

---

## P3-HW-001 - 27 - Hardware

### Title

Adhesive barcode label generation is explicitly unavailable

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F27-e.

### Priority

Medium

### Step-by-step

**Test performed:** F27-c d e software printer availability and requested physical skips

1. Open Integrations > Printers.
2. Inspect label-printer configuration and label-generation actions.
3. Read the label printing availability notice.

### Expected Result

Generate adhesive barcode labels in a supported printer format before physical device testing.

### Actual Result

**Retest: FAIL.** The live page explicitly states label printing (Zebra ZPL) is not implemented and no label-generation action is exposed.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/hardware-1/artifacts/hardware-features.ui-F27-c-4e468-nd-requested-physical-skips-phase3-hardware/P3-HW-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/hardware-1/results.json)

### Comment

This is a software availability finding. Physical label-printer execution is separately skipped at user request; no device result is inferred.

**Reviewed result:** The live page explicitly states label printing (Zebra ZPL) is not implemented and no label-generation action is exposed.

---

## P3-HELP-001 - 30 - Help

### Title

Help provides searchable FAQs but no video guides

### Environment

Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; 24 November 2026. Requirements: F30-d.

### Priority

Medium

### Step-by-step

**Test performed:** F30-d searchable help positive negative controls and video guides

1. Open Help Center and search for product help.
2. Expand a matching answer and run a nonexistent-query control.
3. Inspect the complete help catalogue for video guides/player links.

### Expected Result

Provide interactive searchable knowledge content plus accessible video guides.

### Actual Result

**Retest: FAIL.** Search/FAQ expansion works, but the catalogue contains no video guide, video player or linked video tutorial.

### Attachment

- [Live screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/help-1/artifacts/help-features.ui-F30-d-sea-73ff4-e-controls-and-video-guides-phase3-help/P3-HELP-001.png)
- [Recorded retest evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/help-1/results.json)

### Comment

FAQ search is a positive result. The missing video portion prevents full completion of the combined requirement.

**Reviewed result:** Search/FAQ expansion works, but the catalogue contains no video guide, video player or linked video tutorial.

---

