# NexStock — Deployed fix retest, 5 November 2026

**Retest complete: 0 of 5 bugs can be closed. All five remain reproducible in production.**

Scope: the five tickets in the latest combined Phase 1/Phase 2 Markdown, plus related invoice and quotation regression flows. This is a targeted deployment retest, not a complete Phase 1/Phase 2 regression.

| Phase | Ticket | Result | Fresh result |
|---|---|---|---|
| 1 | RET-002 | Still failing | Saved Company Settings header and banking/payment instructions are absent from invoice PDFs. Correct identity and totals export; clearing saved fields and browser print pass. |
| 1 | RET-003 | Still failing | Variant scroll content intercepts Add to order at 1920 x 1080 and 1440 x 900. |
| 2 | P2-QUOTE-002 | Still failing | Customer-facing Notes are absent from the quotation PDF; saved web notes, terms, discounts and conversion work. |
| 2 | P2-DOC-004 | Still failing | Classic dark invoice/quotation/credit-note views lose the saved brand colour. Modern and native Classic PDF colour work. |
| 2 | REL-DN-001 | Still failing | Debit note DN-TMF7QHSF shows Item 4 and a blank SKU instead of the chosen QA product in the web document and PDF. |

**Execution:** 15 functional cases: 7 passed and 8 application failures representing the five existing tickets. All 10 setup/cleanup cases passed. No skipped/blocked cases or unresolved automation errors. No additional application bug was found in this scope.

Passing checks include invoice PDF identity/amounts, clearing saved invoice text, browser printing, quotation creation, PDF generation without custom Notes, the status pipeline and one-time conversion. The full invoice case successfully issued, partially paid and settled its synthetic invoice before reporting the missing PDF bank text. The full quotation case completed conversion while recording the Notes omission.

**Deployment:** production served index-Dbz-Ri4a.js with SHA-256 f66c48267e535f00bad029f23fb7b53160d2b6b76ce82ff483badbbbeb28d746, changed from 4 November. No authoritative Git commit was supplied. Backend changes are assessed through fresh observed behaviour.

**Automation:** strengthened debit-note checks to require both product name and SKU in both web/PDF output, and explicitly required actual dark mode for the Classic branding test. Existing failures were reviewed against saved records, downloaded files, screenshots and pointer/CSS evidence; none were reclassified from an automation problem into a bug. The 19 relevant offline safety/classification checks pass.

**Cleanup:** captured QA stock, VAT, company invoice text and document template restored and verified. No physical print job, real payment or external invitation/email was sent. Synthetic financial records remain as test evidence.

Keep the five existing tickets open and send the fresh evidence to the developer for correction. Recheck the Company Settings-to-PDF mapping, variant-dialog scroll containment, quotation Notes export, Classic dark colour overrides, and debit-line product mapping.

- [Detailed bugs](remaining-bugs.md)
- [Case-by-case evidence register](../../blob-report/archive/release-verification-2026-11-05/targeted-case-register.json)
- [Public deployment fingerprint](../../blob-report/archive/release-verification-2026-11-05/public-deployment.json)
