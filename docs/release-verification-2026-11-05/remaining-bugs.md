# NexStock — Phase 1 and Phase 2 Remaining Bugs

Retested on **5 November 2026** after deployment confirmation. **All five previously reported bugs remain reproducible**: two Phase 1 bugs and three Phase 2 bugs (including the previously additional debit-note finding). Eight failing cases are grouped into these five existing tickets. No new ticket is needed.

Production serves `index-Dbz-Ri4a.js`, SHA-256 `f66c48267e535f00bad029f23fb7b53160d2b6b76ce82ff483badbbbeb28d746`, different from the previous retest. This verifies the public frontend changed; it does not establish a deployed Git commit.

## RET-002

### Title

Downloaded invoice PDF still omits the saved Company Settings header and banking/payment instructions.

### Environment

Production: https://nexstock.stylotech.mu/app. Company: Nexstock QA Company. Windows / Chromium. Reproduced on 5 November 2026. Frontend: `index-Dbz-Ri4a.js`. Document Builder header/footer notes were empty in the captured baseline.

### Priority

High — customer-facing invoices omit configured payment instructions.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Company Settings and locate Invoice Header and Invoice Footer.
3. Set the header to `QA Commercial Tax Invoice`.
4. Set the footer to `QA Test Bank | Account: QA-NOT-A-REAL-ACCOUNT | Payment notes: QA only - do not pay`.
5. Save Settings, reload, and verify both fields retain their entered values.
6. Create a synthetic invoice for QA Billing Automation Customer containing two units of QA add mv9rtxw1-3b087e at Rs 100 each, with VAT disabled for this controlled check.
7. Save the invoice and use its download action to export the actual PDF.
8. Open the downloaded PDF and inspect the header and payment-instruction area.

### Expected Result

The exported invoice contains its correct identity, company/customer, Rs 200 total, saved invoice header, and saved banking/payment instructions.

### Actual Result

Fresh invoice `INV-M1EIXQ` (internal ID 225) downloads with the correct invoice number, parties, product and Rs 200 amount. However, the saved header, bank name, account marker and payment note are all absent. It contains generic payment-due and thank-you text instead. This is a partial fix of RET-002: downloading and document identity work, while the retained Company Settings branding path still does not reach the PDF.

### Attachment

- [Downloaded invoice PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/RET-002-invoice.pdf)
- [Saved settings and exact invoice identity](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/RET-002.json)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/phase1/invoicing-1/playwright-report/index.html)

### Comment

**5 November retest: still failing; keep the existing ticket open.** Connect the retained Invoice Header/Footer settings to invoice export and define their precedence relative to Document Builder notes. Explicit notes entered through Document Builder do reach the PDF in a separate positive-control test; that does not resolve this ignored settings path. Restore the saved-settings-to-PDF check and the commercial billing full flow after deployment. The test restored its original header/footer, VAT and stock values; all account/payment markers are synthetic.

---

## RET-003

### Title

POS product-customisation content overlaps the footer and blocks Add to order after the release fix.

### Environment

Production: https://nexstock.stylotech.mu/app. Company: Nexstock QA Company. Windows / Chromium. Reproduced on 5 November 2026 at 1920 × 1080 and 1440 × 900. Frontend: `index-Dbz-Ri4a.js`.

### Priority

High — the affected product cannot be added through the normal checkout interaction.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Point of Sale in a 1920 × 1080 browser viewport.
3. Open the in-stock basic-variant product `QA-FLOW-mv89ihb7-8dc11e` (QA flow mv89ihb7-8dc11e Final).
4. Leave Standard (No Variant) selected and quantity at one. The product shows 10 units in stock.
5. Try to click the enabled Add to order button normally.
6. Scroll the dialog and try again.
7. Repeat at 1440 × 900.

### Expected Result

The body scrolls within its own area. The price summary and action footer remain readable and clickable. One normal Add to order click closes the dialog and adds one cart item.

### Actual Result

The scrolling content extends over the price summary and footer. Another element from the scroll area receives the pointer at the Add to order button's centre. Normal clicks fail at both viewport sizes, although the button is enabled and the selected standard product has stock. No sale was submitted.

### Attachment

- [1920 x 1080 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/RET-003-1920.png)
- [1440 x 900 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/RET-003-1440.png)
- [Pointer interception evidence](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/RET-003.json)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/phase1/hardware-1/playwright-report/index.html)

### Comment

**5 November retest: still failing; keep the existing ticket open.** The release's RET-003 fix has not resolved the original reproduction. Constrain and clip the actual scroll viewport, keep the summary/actions outside it, and verify normal pointer access at both sizes. The tests do not force clicks or modify application styles. Configuration and catalogue stock remained unchanged after the retest. The two failing cases are one underlying ticket.

---

## P2-QUOTE-002

### Title

Customer-facing quotation Notes persist in the web view but are omitted from the exported PDF.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium. Reproduced on 5 November 2026, including the commercial quotation full flow. Frontend: `index-Dbz-Ri4a.js`.

### Priority

Medium — instructions intended for the customer disappear from the document supplied to them.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Quotations and choose New Quotation.
3. Select QA Billing Automation Customer and add QA add mv9rtxw1-3b087e, quantity two, unit price Rs 100.
4. Apply a 10% line discount and a 10% document discount. Confirm the total is Rs 162.
5. Enter a unique delivery instruction in Notes and distinct text in Terms & conditions. The Notes placeholder says “Anything the customer should know about this quotation”.
6. Save as Draft, reopen the saved quotation, and confirm both texts remain visible.
7. Download the PDF for that exact quotation and inspect it.

### Expected Result

The customer PDF includes the saved notes, terms, quotation identity, discounted line and Rs 162 total.

### Actual Result

Fresh quotation `QUO-OUJJH7` (ID 22) and the saved web document contain both texts. The PDF includes the terms, correct identity and Rs 162 total, but omits the customer-facing Notes. The omission also reproduces in the accepted-quotation full flow; conversion itself still completes correctly.

### Attachment

- [Downloaded quotation PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-QUOTE-002.pdf)
- [Saved quotation web view](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-QUOTE-002.png)
- [Saved notes, terms and parsed PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-QUOTE-002.json)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/phase2/quotations-1/playwright-report/index.html)

### Comment

**5 November retest: still failing; keep the existing ticket open.** Keep P2-QUOTE-002 partially fixed. The editor, persistence, line discount and terms work; include the saved Notes in the PDF template and verify the downloaded file. This is customer-facing text according to the form, rather than a guessed internal-note policy. Both failing cases represent this one omission. Synthetic quotation/conversion records are retained; affected QA stock is restored.

---

## P2-DOC-004

### Title

Classic document layout overrides the chosen brand colour in dark mode.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium, 1920 × 1080. Dark mode. Retested on 5 November 2026. Frontend: `index-Dbz-Ri4a.js`. User-confirmed requirement: **preserve the chosen brand colour in Classic dark mode**.

### Priority

Low — branding inconsistency in the dark on-screen document view; text and native PDF output work.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Enable dark mode through the application’s theme setting.
3. Open Document Builder, select Classic, and set Primary Color to `#17675e`.
4. Enter distinct header/footer notes, save, and reload to confirm the selected template and colour persist.
5. Open an actual QA invoice and compare its branding with the configured colour.
6. Open a saved QA quotation and credit note under the same template.
7. As positive controls, download the native Classic invoice PDF, then switch the template to Modern and reopen the invoice.

### Expected Result

Classic preserves the chosen primary brand colour in dark-mode document views, as explicitly confirmed by the user. The saved colour applies consistently to invoice, quotation and credit-note branding.

### Actual Result

The configured colour is saved and the document receives `--doc-primary: #17675e`. However, Classic dark-mode text and border styles replace it with neutral colours on the actual invoice, quotation and credit-note pages. The Modern invoice displays the chosen colour, and the native Classic invoice PDF contains that colour. Saved header/footer text propagates correctly.

### Attachment

- [Classic dark invoice](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-DOC-004-classic.png)
- [Classic dark quotation](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-DOC-004-quotation.png)
- [Classic dark credit note](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-DOC-004-credit-note.png)
- [Classic native PDF positive control](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-DOC-004-classic.pdf)
- [Persisted template and CSS comparison](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/P2-DOC-004.json)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/phase2/document-templates-1/playwright-report/index.html)

### Comment

**5 November retest: still failing; keep the existing ticket open.** The user’s answer resolves the earlier policy uncertainty: neutral dark-mode colours are not the intended behaviour. Keep P2-DOC-004 partially fixed and remove or adjust the Classic dark-mode overrides that replace the configured brand colour. Preserve the working Modern layout, native PDF colour and saved text. Invoice, quotation and credit-note occurrences are grouped into this one ticket. The retest restores the captured document-template baseline.

---

## REL-DN-001

### Title

Saved debit-note document replaces the selected product name with an item-ID placeholder and loses its SKU.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium. Reproduced on 5 November 2026 through the corrected debit-note print route. Frontend: `index-Dbz-Ri4a.js`. This Phase 2 billing finding was additional to the original release ticket list and is included in the latest five-ticket retest scope.

### Priority

High — an official billing adjustment does not identify its selected product correctly.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Debit Notes and choose Create Debit Note.
3. Select QA Billing Automation Customer and link an existing synthetic paid invoice belonging to that customer.
4. Set the issue date to today and a payment due date 15 days later.
5. Add QA add mv9rtxw1-3b087e, SKU `QA-ADD-mv9rtxw1-3b087e`, quantity one, price Rs 100. This product has ID 4 in the QA company.
6. Save as Draft and confirm the saved debit-note reference and Rs 100 amount in the list.
7. Use that row's Download PDF action. Inspect the document opened at `/app/debit-notes/<id>?print=true` and its print-to-PDF output.

### Expected Result

The saved debit-note document and printable output show the chosen product name, its SKU, quantity one and Rs 100 amount, alongside the correct customer/reference.

### Actual Result

Fresh debit note `DN-TMF7QHSF` (ID 4) opens the authenticated print route and requests printing. The reference, customer and Rs 100 amount are present. However, its line is labelled “Item 4” and the SKU is a dash, rather than the name and SKU selected in the form. Both the web document and PDF lose the product identity.

### Attachment

- [Debit-note PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/REL-DN-001.pdf)
- [Debit-note document screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/REL-DN-001.png)
- [Saved record and missing product identity](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/evidence/REL-DN-001.json)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-05/phase2/credit-notes-1/playwright-report/index.html)

### Comment

**5 November retest: still failing; keep the existing ticket open.** Track this separately from the original RET-002 invoice-settings omission. The debit base-path/print navigation fix works; item identity is a newly reached defect. Check mapping between the selected product payload, saved debit lines and the detail/print view. Preserve product name and SKU instead of using a product-ID placeholder. PDF extraction spacing was normalised for the customer name; that parser issue is not reported as an application bug. The captured QA stock baseline was restored.

---

