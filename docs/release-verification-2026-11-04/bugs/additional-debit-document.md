# REL-DN-001

## Title

Saved debit-note document replaces the selected product name with an item-ID placeholder and loses its SKU.

## Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium. Reproduced on 4 November 2026 through the corrected debit-note print route. Frontend: `index-D4pNS7qJ.js`. This is an additional finding, outside the original release ticket list.

## Priority

High — an official billing adjustment does not identify its selected product correctly.

## Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Debit Notes and choose Create Debit Note.
3. Select QA Billing Automation Customer and link an existing synthetic paid invoice belonging to that customer.
4. Set the issue date to today and a payment due date 15 days later.
5. Add QA add mv9rtxw1-3b087e, SKU `QA-ADD-mv9rtxw1-3b087e`, quantity one, price Rs 100. This product has ID 4 in the QA company.
6. Save as Draft and confirm the saved debit-note reference and Rs 100 amount in the list.
7. Use that row's Download PDF action. Inspect the document opened at `/app/debit-notes/<id>?print=true` and its print-to-PDF output.

## Expected Result

The saved debit-note document and printable output show the chosen product name, its SKU, quantity one and Rs 100 amount, alongside the correct customer/reference.

## Actual Result

The corrected authenticated print route opens and requests printing. The reference, customer and Rs 100 amount are present. However, its line is labelled “Item 4” and the SKU is a dash, rather than the name and SKU selected in the form. Both the web document and PDF lose the product identity.

## Attachment

- [Actual debit print-view PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/REL-DN-001.pdf)
- [Saved record, expected product and document/PDF text](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/REL-DN-001.json)
- [Actual printable document screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/REL-DN-001.png)

## Comment

Track this separately from the original RET-002 invoice-settings omission. The debit base-path/print navigation fix works; item identity is a newly reached defect. Check mapping between the selected product payload, saved debit lines and the detail/print view. Preserve product name and SKU instead of using a product-ID placeholder. PDF extraction spacing was normalised for the customer name; that parser issue is not reported as an application bug. The captured QA stock baseline was restored.

---

