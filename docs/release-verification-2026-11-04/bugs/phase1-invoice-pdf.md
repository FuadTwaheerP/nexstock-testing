# RET-002

## Title

Downloaded invoice PDF still omits the saved Company Settings header and banking/payment instructions.

## Environment

Production: https://nexstock.stylotech.mu/app. Company: Nexstock QA Company. Windows / Chromium. Reproduced on 4 November 2026. Frontend: `index-D4pNS7qJ.js`. Document Builder header/footer notes were empty in the captured baseline.

## Priority

High — customer-facing invoices omit configured payment instructions.

## Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Company Settings and locate Invoice Header and Invoice Footer.
3. Set the header to `QA Commercial Tax Invoice`.
4. Set the footer to `QA Test Bank | Account: QA-NOT-A-REAL-ACCOUNT | Payment notes: QA only - do not pay`.
5. Save Settings, reload, and verify both fields retain their entered values.
6. Create a synthetic invoice for QA Billing Automation Customer containing two units of QA add mv9rtxw1-3b087e at Rs 100 each, with VAT disabled for this controlled check.
7. Save the invoice and use its download action to export the actual PDF.
8. Open the downloaded PDF and inspect the header and payment-instruction area.

## Expected Result

The exported invoice contains its correct identity, company/customer, Rs 200 total, saved invoice header, and saved banking/payment instructions.

## Actual Result

A valid PDF downloads with the correct invoice number, parties, product and Rs 200 amount. However, the saved header, bank name, account marker and payment note are all absent. It contains generic payment-due and thank-you text instead. This is a partial fix of RET-002: downloading and document identity work, while the retained Company Settings branding path still does not reach the PDF.

## Attachment

- [Actual downloaded PDF](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/RET-002-missing-company-branding.pdf)
- [Settings verified after reload, invoice identity and template baseline](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/RET-002-settings-and-invoice.json)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase1/invoicing-2/playwright-report/index.html)

## Comment

Connect the retained Invoice Header/Footer settings to invoice export and define their precedence relative to Document Builder notes. Explicit notes entered through Document Builder do reach the PDF in a separate positive-control test; that does not resolve this ignored settings path. Restore the saved-settings-to-PDF check and the commercial billing full flow after deployment. The test restored its original header/footer, VAT and stock values; all account/payment markers are synthetic.

---

