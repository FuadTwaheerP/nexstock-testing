# P2-QUOTE-002

## Title

Customer-facing quotation Notes persist in the web view but are omitted from the exported PDF.

## Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium. Reproduced on 4 November 2026, including the commercial quotation full flow. Frontend: `index-D4pNS7qJ.js`.

## Priority

Medium — instructions intended for the customer disappear from the document supplied to them.

## Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Quotations and choose New Quotation.
3. Select QA Billing Automation Customer and add QA add mv9rtxw1-3b087e, quantity two, unit price Rs 100.
4. Apply a 10% line discount and a 10% document discount. Confirm the total is Rs 162.
5. Enter a unique delivery instruction in Notes and distinct text in Terms & conditions. The Notes placeholder says “Anything the customer should know about this quotation”.
6. Save as Draft, reopen the saved quotation, and confirm both texts remain visible.
7. Download the PDF for that exact quotation and inspect it.

## Expected Result

The customer PDF includes the saved notes, terms, quotation identity, discounted line and Rs 162 total.

## Actual Result

The web document and fresh saved record contain both texts. The PDF includes the terms, correct identity and Rs 162 total, but omits the customer-facing Notes. The omission also reproduces in the accepted-quotation full flow; conversion itself still completes correctly.

## Attachment

- [Actual quotation PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/P2-QUOTE-002.pdf)
- [Saved fields and extracted PDF content](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/P2-QUOTE-002.json)
- [Reopened web document](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/P2-QUOTE-002.png)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase2/quotations-2/playwright-report/index.html)

## Comment

Keep P2-QUOTE-002 partially fixed. The editor, persistence, line discount and terms work; include the saved Notes in the PDF template and verify the downloaded file. This is customer-facing text according to the form, rather than a guessed internal-note policy. Both failing cases represent this one omission. Synthetic quotation/conversion records are retained; affected QA stock is restored.

---

