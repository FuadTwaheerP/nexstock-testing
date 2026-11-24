# NexStock - Confirmed final MVP findings, 13 November 2026

Five confirmed tickets remain: four newly reported and the existing partial P2-DOC-004. Repeated picker failures are consolidated. Automation corrections and unconfirmed source observations are separate in the summary; they are not extra bugs here.

Production frontend remained `index-Bw0A9VIv.js`, SHA-256 `bd0987b86cf20ca4531f81b3f859bb2d32d3d7d41da42386d09a9c377992584c`. The font-specific output requirement is **blocked before font selection**, not passed and not established as a PDF-rendering defect.

## MVP-FONT-001

### Title

Settings font upload sends an empty JSON file object instead of the selected font bytes.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium / Playwright 1.62.1, 1920 x 1080. Settings > Advanced > Custom Fonts. Repeated 13 November 2026 on the frontend identified above.

### Priority

High - blocks the explicitly requested custom-font upload workflow.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Settings > Advanced > Custom Fonts.
3. Use Upload Fonts to select a valid TTF. Reproduction fixtures are [Vera.ttf](C:/Users/amiirah/Documents/Projects/nexstock-testing/tests/fixtures/fonts/Vera.ttf), 65,932 bytes, and [VeraIt.ttf](C:/Users/amiirah/Documents/Projects/nexstock-testing/tests/fixtures/fonts/VeraIt.ttf), 63,684 bytes. Their original license is beside them.
4. Observe the actual browser POST to `/app/api/v1/settings/fonts` and its response.
5. Repeat with the other valid font. Both the original disk file and an equivalent browser File input were exercised.
6. Reload Settings and verify whether that UI attempt added a font record. The two retained QA fonts described below were created by a separate diagnostic request, not by this UI action.

### Expected Result

The application uploads the actual file as multipart data, persists the font for the selected company and displays it after reload. The request carries file bytes and a valid multipart boundary.

### Actual Result

Both valid files repeatedly receive HTTP **422**, `The file field is required.` The browser sends `Content-Type: application/json`, with bodies such as `{"file":{},"name":"Vera"}`. There is no multipart boundary and no TTF data. Unsupported TXT extensions are correctly rejected locally; that negative check does not explain rejection of these valid TTFs.

For isolation, standard multipart upload to the exact observed endpoint with the same verified QA session returned **201 for both original files**. The persisted fonts are `1 / QAMVPmwec9cu0Regular` and `2 / QAMVPmwec9cu0Italic`. Settings displays them after reload and downloaded file hashes match the fixture bytes. This proves that diagnostic fixture setup worked; it does not close the Settings upload bug.

### Attachment

- [Captured UI requests, responses and current font state](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/font-prerequisites-observations.json)
- [Regular upload failure](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/font-prerequisites-01-font-upload-Regular-failed.png)
- [Italic upload failure](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/font-prerequisites-03-font-upload-Italic-failed.png)
- [Separately labelled multipart setup responses](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/diagnostic-font-setup.json)
- [Fonts visible after diagnostic setup and reload](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/font-prerequisites-04-uploaded-fonts-after-reload.png)

### Comment

The served `DocumentFontService.upload()` constructs FormData, but the shared Axios client defaults to JSON. The captured request confirms that the File became `{}`. Remove the JSON override for FormData and let the browser generate the multipart boundary. Verify actual bytes, a successful UI response, fresh-list persistence and downloadable file integrity using both fixtures. Do not treat a seeded font record or mocked response as an upload pass. Retain the separate product/picker tickets below when retesting the complete requirement.

---

## MVP-FONT-002

### Title

Font-capable product custom text definitions disappear after a successful save and reload.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium / Playwright 1.62.1, 1920 x 1080. Products > New Product / Edit Product > Custom Fields. Tested 13 November 2026. Retained owned stockless product **163**, SKU `QA-MVP-FONT-mwec9cu0`.

### Priority

High - loses the configuration needed to enter customer custom text and select its font.

### Step-by-step

1. Create a uniquely named QA service product with no inventory tracking. The retained reproduction item is `QA 000 MVP Fonts mwec9cu0`.
2. Open Custom Fields. Add a Text field named `QA Engraving` and check Supports custom fonts before Add Field.
3. Add another Text field named `QA Signature`, also with Supports custom fonts checked.
4. Save with Add Product. Inspect the real POST: `customFields` contains both definitions, each with `type: "text"`, `required: false` and `supportsFonts: true`.
5. Confirm the successful creation response, then navigate away and reload Products.
6. Search the exact SKU, click Filter, open Actions > Edit > Custom Fields and inspect the fresh filtered product GET.

### Expected Result

Both definitions and their font-support flags persist in the saved product, return in fresh product reads, and reappear in Edit Product. Invoice and Quotation can use those definitions to collect the customer's text and font.

### Actual Result

The application returns **201 Product created successfully**, but the product resource omits the custom definitions. A fresh filtered GET of product 163 still has neither definition; the reopened Custom Fields tab is empty. The request/editor evidence establishes that both fields were actually configured and submitted. The saved product remains active and its ordinary service/pricing fields persist.

### Attachment

- [Original editor configuration and POST request/response](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/owned-product-create.json)
- [Fresh product read and reopened editor snapshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/font-prerequisites-observations.json)
- [Empty Custom Fields tab after reload](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/font-prerequisites-06-reloaded-font-product-custom-fields.png)

### Comment

This establishes a failed application round-trip; browser evidence cannot determine whether storage, validation/DTO mapping or resource serialization drops the fields. Align POST/PUT/GET and the product mapper for `id`, `name`, `type`, `required`, `options` and `supportsFonts`, preserving the values in create/edit flows. Verify a fresh session and a second edit/save without losing either definition or its font flag. Then verify customised item text and independently selected fonts on Invoice and Quotation, including native PDFs. The retained item is stockless and available for reproduction. Selected-font output has not been certified while this and the lookup blocker remain.

---

## MVP-LOOKUP-001

### Title

Billing document pickers expose only the first page of customers/products, making valid saved records unavailable.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium / Playwright 1.62.1, 1920 x 1080. New Invoice customer/product selectors and New Quotation product selector. Repeated 13 November 2026. The customer occurrence was initially annotated MVP-CUST-002; it is consolidated here with the equivalent product paging failures.

### Priority

High - prevents billing valid contacts/items outside the initial page and blocks the requested custom-font document test.

### Step-by-step

1. Use a QA company with more than 15 customer and product records.
2. Create an active uniquely identified later-sorting QA customer, such as `QA CUST ZZZ <token>`, and verify it in Customers. The focused attempt used token `mwecyonq-90c732`; the retained customer was made inactive by cleanup, so reactivate only that owned QA fixture or create a new one for the active-selection retest.
3. Open a fresh New Invoice and wait for the actual customer GET to finish. Open Customer Account and navigate to the end of the options.
4. Inspect the returned page metadata and search/typeahead/end-of-list availability for that saved active customer.
5. Confirm owned product **163 / `QA-MVP-FONT-mwec9cu0`** exists and is active using the Products search/Filter and fresh response.
6. Open New Invoice, choose QA Billing Automation Customer, Add Row and open Choose product. Navigate to the end and attempt to find product 163.
7. Repeat product selection in New Quotation. Do not patch the response, inject an option or force-select an absent item.

### Expected Result

Every eligible saved customer/product can be found and selected through working pagination, loading or server-side search. The selector must not silently limit the user to the first API page.

### Actual Result

The invoice customer GET returns **page 1, 15 of 68 customers, five pages**, and the later-sorting active fixture is unavailable. Both Invoice and Quotation product GETs return **page 1, 15 of 116 products, eight pages**. Each product selector contains 15 options and omits the verified active product 163, including after end-of-list navigation. No way to load the remaining records is exposed by these controls. This stops the new customised item before text/font selection or PDF creation.

### Attachment

- [Customer page metadata, fixture and complete option snapshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/customer-pagination-observations.json)
- [Customer picker screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/customer-pagination-04-screenshot.png)
- [Invoice product GET and options](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/invoice-picker-observations.json)
- [Invoice product picker screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/invoice-picker-01-MVP-LOOKUP-001.png)
- [Quotation product GET and options](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/quotation-picker-observations.json)
- [Quotation product picker screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/quotation-picker-01-MVP-LOOKUP-001.png)

### Comment

Group these occurrences as one missing complete-lookup capability. The served document editors map only the initial query result into their options. Add supported paging/search/loading that preserves tenant and eligibility rules; a larger fixed first-page limit alone will fail again when the catalogue grows. Retest records on the first, middle and last pages, including a newly added service and a later-sorting active customer. Invoice customer and Invoice/Quotation product failures are live-confirmed here; quotation customer pagination is a related next-retest check, not an additional observed occurrence. Keep inactive eligibility separate under MVP-CUST-001. No font-rendering defect is inferred from a product that could not be selected.

---

## MVP-CUST-001

### Title

A customer confirmed inactive remains offered for a new invoice.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium / Playwright 1.62.1, 1920 x 1080. Customers and `/app/create-invoice`. Repeated 13 November 2026. Focused fixture: customer **86**, email `qa.customer.mwecy1ek-61cf6b@example.invalid`. Requirement: P1-050 / F19-b.

### Priority

High - violates the critical MVP eligibility rule for new billing.

### Step-by-step

1. Create an early-sorting, active QA customer so it is within the currently loaded selector page.
2. Open a fresh New Invoice and verify that this active customer appears. This is the positive control.
3. Return to Customers, change that same customer to Inactive, save and reload.
4. Confirm the inactive status in the reloaded customer management view.
5. Open New Invoice again, await its actual fresh customer GET and open Customer Account.
6. Inspect whether the same customer's email is still offered. The focused response identifies customer 86 with `status: "inactive"`.

### Expected Result

The inactive customer is excluded from selection for new invoices, while active eligible contacts remain available. Previously saved document history remains accessible.

### Actual Result

The active positive control passes and deactivation persists. The fresh invoice customer response explicitly contains the record as inactive, but the picker still renders it as an available option. The same failure was observed in two focused runs. Separate corrected history testing confirms that a saved QA draft remains in the customer's profile after deactivation.

### Attachment

- [Before/after status responses, writes and fixture identity](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/inactive-customer-observations.json)
- [Inactive customer still present in the invoice picker](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/inactive-customer-05-screenshot.png)

### Comment

Filter new-document options using the persisted active/inactive status representation, retaining an active positive control in the regression. This is independent of the missing-page issue: the fixture is deliberately within page one. No invoice was submitted with the inactive selection, so this ticket does not claim that the backend accepts an inactive-customer transaction. QA contacts were retained inactive; no contact or fiscal history was deleted.

---

## P2-DOC-004

### Title

Classic dark brand text remains narrowly below the stated 3:1 contrast minimum on its actual surface.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium / Playwright 1.62.1, 1920 x 1080. Dark mode, Classic document layout. Invoice, quotation and credit-note views. Retested 13 November 2026 on `index-Bw0A9VIv.js`.

### Priority

Low - a minor remaining threshold boundary; the original neutral-colour override is fixed and the documents remain usable.

### Step-by-step

1. Sign in, select the QA company and enable dark mode.
2. Open Document Builder, select Classic and save primary colour `#17675e`.
3. Open a saved QA invoice and inspect the computed brand text and its effective background, including ancestor layers.
4. Repeat for a quotation and credit note.
5. Calculate sRGB luminance contrast for the actual text/background pair and compare the unrounded value with 3:1.
6. Use `#15b8a6` as a readable-colour control, then restore the captured template.

### Expected Result

Borders preserve the exact selected brand colour. A necessary text tint reaches at least **3:1 against the actual rendered surface**, as stated in the developer's fix notes. Already-readable colours remain unchanged.

### Actual Result

Borders correctly retain `#17675e`. Text becomes `#236f66`; its actual opaque background is `#13191b`, giving **2.991035:1**. The same boundary occurs on all three document types. The tint passes 3:1 against the calculation's assumed `#0f172a` surface, which is not the actual rendered background. The `#15b8a6` control passes unchanged. Branding propagation/native PDF colour and the other previously closed document fixes pass.

### Attachment

- [Fresh computed colours/background layers and contrast](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/classic-contrast-observations.json)
- [Invoice](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/classic-contrast-01-classic-contrast-17675e-invoicing.png)
- [Quotation](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/classic-contrast-02-classic-contrast-17675e-quotations.png)
- [Credit note](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/classic-contrast-03-classic-contrast-17675e-credit-notes.png)

### Comment

Keep the existing ticket partially fixed; do not reopen the corrected neutral-branding behaviour as a separate bug. Calculate and verify the tint against the effective rendered surface. The stated 3:1 fix contract is the acceptance threshold here, not a claim of complete accessibility certification. All three occurrences share the same boundary and remain one ticket. Template restoration and the readable-colour control pass.

---

