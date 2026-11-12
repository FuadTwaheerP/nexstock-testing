# P2-DOC-004

## Title

Classic document layout overrides the chosen brand colour in dark mode.

## Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium, 1920 × 1080. Dark mode. Retested on 4 November 2026. Frontend: `index-D4pNS7qJ.js`. User-confirmed requirement: **preserve the chosen brand colour in Classic dark mode**.

## Priority

Low — branding inconsistency in the dark on-screen document view; text and native PDF output work.

## Step-by-step

1. Sign in and select Nexstock QA Company.
2. Enable dark mode through the application’s theme setting.
3. Open Document Builder, select Classic, and set Primary Color to `#17675e`.
4. Enter distinct header/footer notes, save, and reload to confirm the selected template and colour persist.
5. Open an actual QA invoice and compare its branding with the configured colour.
6. Open a saved QA quotation and credit note under the same template.
7. As positive controls, download the native Classic invoice PDF, then switch the template to Modern and reopen the invoice.

## Expected Result

Classic preserves the chosen primary brand colour in dark-mode document views, as explicitly confirmed by the user. The saved colour applies consistently to invoice, quotation and credit-note branding.

## Actual Result

The configured colour is saved and the document receives `--doc-primary: #17675e`. However, Classic dark-mode text and border styles replace it with neutral colours on the actual invoice, quotation and credit-note pages. The Modern invoice displays the chosen colour, and the native Classic invoice PDF contains that colour. Saved header/footer text propagates correctly.

## Attachment

- [Classic dark invoice](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/P2-DOC-004-classic-invoice.png)
- [Modern positive control](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/P2-DOC-004-modern-control.png)
- [Verified CSS, layout comparison and policy confirmation](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/P2-DOC-004-comparison.json)

## Comment

The user’s answer resolves the earlier policy uncertainty: neutral dark-mode colours are not the intended behaviour. Keep P2-DOC-004 partially fixed and remove or adjust the Classic dark-mode overrides that replace the configured brand colour. Preserve the working Modern layout, native PDF colour and saved text. Invoice, quotation and credit-note occurrences are grouped into this one ticket. The retest restores the captured document-template baseline.

---

