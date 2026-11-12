# NexStock - Detailed Release Retest Bugs

Test date: **24 October 2026**. These are the existing post-deployment results; no new test run was performed for this document revision.

**Seven failed automated test cases map to four confirmed application bugs.** Duplicate failures are grouped into one ticket per capability, as required by this project. Corrected automation errors, unconfirmed policy observations and deferred features are not counted as bugs here.

## All seven failed cases

| Failed case | Scenario | Bug ticket |
| --- | --- | --- |
| T022 | release basic-variant customization Add to Order remains reachable on desktop | RET-003 |
| T034 | exports a valid PDF matching the saved invoice identity and amounts | RET-002 |
| T035 | includes configured banking instructions and payment notes in the exported PDF | RET-002 |
| T058 | creates a Net 30 tax invoice, issues, part-pays, settles and exports/prints | RET-002 |
| T073 | finds and links an existing customer to checkout | RET-001 |
| T085 | searches, builds an order, links a customer, discounts, checks out and reviews receipt | RET-001 |
| T180 | release purchase-order vendor picker excludes inactive supplier with an active positive control | RET-004 |

Attachments below are verified local evidence files. Upload the relevant screenshots/error contexts to Trello when sharing a card; local file links are not shared Trello attachments.

## RET-001

### Title

Active QA customer cannot be found in the POS customer picker

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.

### Priority

**High** - Prevents linking an existing customer to checkout.

### Step-by-step

1. Sign in to https://nexstock.stylotech.mu/app with the approved QA account and select **Nexstock QA Company**.
2. Open **Customers**. Search for **QA POS Automation Customer** (`qa.pos.customer@example.invalid`) and confirm the matching record is **Active**.
3. Open **Point of Sale** and start a fresh order.
4. Click the **Walk-in Customer / Tap to change** selector to open **Select Customer**.
5. Enter the exact customer name **QA POS Automation Customer** in the search field.
6. Attempt to choose the existing record and associate it with the order. For the integrated-flow reproduction, add the QA product to the cart before this customer-selection step.

### Expected Result

The active existing customer is returned and can be linked to the order.

### Actual Result

POS reports no matching customer, although the Customers module shows the active record. The independent linking test and integrated POS flow fail at this same step.

Affected failed tests:

- **T073** - finds and links an existing customer to checkout (`pos-2`).
- **T085** - searches, builds an order, links a customer, discounts, checks out and reviews receipt (`pos-2`).

### Attachment

- [T073 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-customer-linkin-7b07c-omer-to-checkout-phase1-pos-chromium-pos/test-failed-1.png)
- [T073 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-customer-linkin-7b07c-omer-to-checkout-phase1-pos-chromium-pos/error-context.md)
- [T085 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-pos-full-flow.u-31eb7-eceipt-phase1-pos-full-flow-chromium-pos/test-failed-1.png)
- [T085 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-pos-full-flow.u-31eb7-eceipt-phase1-pos-full-flow-chromium-pos/error-context.md)

### Comment

Confirmed application finding, reproduced in both an independent customer-linking test and the integrated POS flow. The full flow stops at customer selection: its later discount, checkout and receipt steps were not reached in that failing run. Those downstream steps are not additional bugs. Search/pagination/filtering is an investigation direction, not a verified backend root cause. Do not create a duplicate customer to hide the failure.

Developer: search all eligible customers by identity across pages and add a beyond-first-page active-customer regression. QA: rerun linking and the complete checkout flow after correction.

---

## RET-002

### Title

Invoice Download opens a public 404 page instead of the invoice export

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.

### Priority

**High** - Prevents invoice export and blocks validation of exported document contents.

### Step-by-step

1. Sign in to https://nexstock.stylotech.mu/app and select **Nexstock QA Company**.
2. Open **Invoices**. Locate a retained QA billing invoice from this retest, such as reference **96**, **97** or **105**. Alternatively, save a new valid synthetic QA invoice.
3. In the invoice list, identify the correct row and click its **Download** icon.
4. Inspect the newly opened browser tab and its URL.
5. Check whether an invoice PDF or usable invoice print view is returned.
6. For the branding variation, use the QA invoice created with banking instructions/payment notes (reference **97** during the retest). For the integrated-flow variation, use the Net 30 invoice issued, part-paid and fully settled before export (reference **105** during the retest).

### Expected Result

A usable invoice PDF/print view opens for the requested document, retaining the /app application mount.

### Actual Result

The new tab navigates to /invoicing/<id> without /app and displays the marketing site's 404: That page is not here. No file download or print invocation occurs.

Affected failed tests:

- **T034** - exports a valid PDF matching the saved invoice identity and amounts (`invoicing-4`).
- **T035** - includes configured banking instructions and payment notes in the exported PDF (`invoicing-4`).
- **T058** - creates a Net 30 tax invoice, issues, part-pays, settles and exports/prints (`invoicing-5`).

### Attachment

- [T034 - invoice-export-popup](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-66ece-nd-amounts-phase1-invoicing-chromium-invoicing/attachments/invoice-export-popup-4726d5b3d8f59b3847d95f9629460cf3c5fa5831.png)
- [T034 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-66ece-nd-amounts-phase1-invoicing-chromium-invoicing/test-failed-1.png)
- [T034 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-66ece-nd-amounts-phase1-invoicing-chromium-invoicing/error-context.md)
- [T035 - invoice-export-popup](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-e129f-ported-PDF-phase1-invoicing-chromium-invoicing/attachments/invoice-export-popup-e47190a8dd9cd553c706c405396a5ad968ccd882.png)
- [T035 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-e129f-ported-PDF-phase1-invoicing-chromium-invoicing/test-failed-1.png)
- [T035 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-e129f-ported-PDF-phase1-invoicing-chromium-invoicing/error-context.md)
- [T058 - invoice-export-popup](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-5/artifacts/phase1-invoicing-invoicing-fedcf--phase1-invoicing-full-flow-chromium-invoicing/attachments/invoice-export-popup-e2971e2dbfe910d606649f372a990e04b17474f7.png)
- [T058 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-5/artifacts/phase1-invoicing-invoicing-fedcf--phase1-invoicing-full-flow-chromium-invoicing/test-failed-1.png)
- [T058 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-5/artifacts/phase1-invoicing-invoicing-fedcf--phase1-invoicing-full-flow-chromium-invoicing/error-context.md)

### Comment

One export defect causes three failed tests. Observed export URLs included `/invoicing/96`, `/invoicing/97` and `/invoicing/105`, missing the application mount `/app`. A separate read-only diagnostic reproduced the public 404. This confirms export/navigation failure, not missing banking text or incorrect totals inside a generated PDF: no usable PDF was produced to inspect. Invoice saving and payment settlement passed before the integrated flow reached this export failure. Existing retained records can reproduce it without changing current company VAT/branding settings.

Developer: generate mount-aware application URLs for print/export actions and verify both list and detail entry points. QA: rerun PDF identity, branding, VAT and full flow; inspect the produced PDF, not just a button or HTTP success.

---

## RET-003

### Title

Basic-variant customization footer is outside the desktop viewport

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.
- Viewport: **1920 x 1080**.

### Priority

**High** - Prevents completing normal customization for the affected basic-variant product.

### Step-by-step

1. Use desktop Chromium with a **1920 x 1080** viewport and normal browser zoom.
2. Sign in to https://nexstock.stylotech.mu/app, select **Nexstock QA Company**, and open **Point of Sale**.
3. Find the enabled, in-stock basic-variant QA product with SKU **QA-FLOW-mv89ihb7-8dc11e** (display name **QA flow mv89ihb7-8dc11e Final** during the retest). It has Size, Color and Material options.
4. Click the product to open **Customize Product**.
5. Leave **Standard (No Variant)** selected initially and inspect/scroll through the available variant choices.
6. Attempt to reach and click **Add to Order** using normal scrolling and clicking, without changing zoom, forcing a click or modifying the page.

### Expected Result

The customization body scrolls within a bounded dialog and the action footer remains reachable.

### Actual Result

The dialog content/variant list extends below the viewport; normal scrollIntoView and click cannot reach Add to Order even at 1920 x 1080. A larger viewport did not resolve it.

Affected failed tests:

- **T022** - release basic-variant customization Add to Order remains reachable on desktop (`hardware-3`).

### Attachment

- [T022 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/hardware-3/artifacts/phase1-hardware-barcode-sc-a5907-emains-reachable-on-desktop-chromium-hardware/test-failed-1.png)
- [T022 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/hardware-3/artifacts/phase1-hardware-barcode-sc-a5907-emains-reachable-on-desktop-chromium-hardware/error-context.md)

### Comment

Confirmed UI reachability finding for Phase 1 basic variants, not Phase 3 assemblies/serialized units. The failure remained at 1920 x 1080 rather than only a small headless viewport. Normal scroll/click could not reach the footer; the test did not force a hidden action to pass. Keyboard-HID counting on a separate simple/service fixture passed and is not a second scanner bug. No sale was submitted by this reachability check.

Developer: constrain dialog height, add a working internal scroll area and keep footer controls inside the visible dialog. QA: retest mouse, keyboard, scanner customization and normal desktop sizes.

---

## RET-004

### Title

Deactivated supplier remains selectable for a new purchase order

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.

### Priority

**High** - Allows an ineligible, deactivated vendor to be offered for new purchasing.

### Step-by-step

1. Sign in to https://nexstock.stylotech.mu/app and select **Nexstock QA Company**.
2. Open **Suppliers**. Create two disposable QA vendors with unique early-sorting names, for example **QA SUP 000 release active control <unique>** and **QA SUP 000 release inactive <unique>**. Leave the first vendor Active.
3. Deactivate the second vendor through Suppliers and reload/search it to confirm **Inactive** persisted.
4. Open **Purchase Orders** and start a new purchase order (`/app/purchasing/orders/new`).
5. Open the supplier picker. Confirm the Active control vendor appears, proving the picker loaded the relevant range.
6. Inspect the picker for the exact deactivated vendor name. Do not submit the purchase order.

### Expected Result

The valid active control remains selectable; the deactivated vendor is excluded from new purchasing selection while historical records are preserved.

### Actual Result

Both vendors are offered. The active positive control passes, but the explicitly deactivated vendor is still present in the picker.

Affected failed tests:

- **T180** - release purchase-order vendor picker excludes inactive supplier with an active positive control (`suppliers-4`).

### Attachment

- [T180 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/suppliers-4/artifacts/phase1-suppliers-release-v-705d4--an-active-positive-control-chromium-suppliers/test-failed-1.png)
- [T180 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/suppliers-4/artifacts/phase1-suppliers-release-v-705d4--an-active-positive-control-chromium-suppliers/error-context.md)

### Comment

Confirmed picker-eligibility finding with an Active positive control; the result is not based on an empty or unpopulated picker. Both QA vendors were retained Inactive by suite cleanup, so use fresh QA vendors or reactivate only the disposable control when manually reproducing. No purchase order or payment was submitted. Earlier absence of later-sorting Active vendors is a separate unconfirmed pagination observation, not an additional confirmed bug in this list.

Developer: align picker eligibility with the status representation written by Deactivate and exclude inactive/suspended/archived records consistently. QA: rerun with an active positive control and a vendor beyond the first loaded page.

---

