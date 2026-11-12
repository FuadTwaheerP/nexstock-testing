# NexStock - Five-finding fix retest, 12 November 2026

**Four of the five tickets can close. P2-DOC-004 is partially fixed: the original neutral-colour override is corrected, but one minor rendered-text contrast boundary remains.**

Fresh production verification of the user-supplied developer fix notes for RET-002, RET-003, P2-QUOTE-002, P2-DOC-004 and REL-DN-001. These span both Phase 1 and Phase 2. Previous 5 November failures are historical references, not fresh results. Existing developer exclusions remain outside this run.

| Phase | Ticket | Result | Fresh verification |
| --- | --- | --- | --- |
| 1 | RET-002 | FIXED | Settings header/bank text reaches the PDF. Builder notes take precedence; blank/whitespace notes fall back without changing the saved template. |
| 1 | RET-003 | FIXED | Normal Add to order clicks pass at 1920 x 1080 and 1440 x 900, and the item appears in the cart. |
| 2 | P2-QUOTE-002 | FIXED | Customer Notes, terms, discounted totals and identity reach the quotation PDF. Status and one-time conversion pass. |
| 2 | P2-DOC-004 | PARTIAL | Brand borders and native PDF colour are fixed. Dark text tint is 2.991:1 on the actual #13191b surface, narrowly below the stated 3:1. |
| 2 | REL-DN-001 | FIXED | New and legacy debit documents/PDFs retain product name and SKU. Legacy resource IDs are strings and the print route works. |

## Execution

Final composite: 19 functional passes, 1 application-failing case, and 10 setup/cleanup passes. No skipped/blocked cases or unresolved automation errors. All 79 offline guard/contrast/classification checks pass. A focused contrast rerun repeats the same application finding; latest case results replace earlier executions. Setup/cleanup counts are separate from business acceptance.

PDF Settings fallback, builder precedence, whitespace fallback and saved-template isolation pass. Internal till invoice notes stay off the customer PDF. A readable brand-colour control is unchanged. New and previously broken legacy debit output pass.

## Remaining issue

Keep P2-DOC-004 open at Low priority. The selected #17675e keeps exact borders; text becomes #236f66. On the actual #13191b surface its contrast is 2.991:1. Calculate the tint against the rendered surface and verify the result stays at or above 3:1. Invoice, quotation and credit-note occurrences are one ticket. Original brand-colour propagation now passes. The JavaScript result was cross-checked independently in Python. The old exact-text-colour expectation is not used to reject an allowed contrast tint.

## Cleanup and boundaries

QA stock, VAT, invoice text and document template were restored and verified. Synthetic QA financial records remain as evidence. No real payment, external invitation/email or physical print job was sent.

Production serves index-Bw0A9VIv.js, changed from 5 November. This verifies the frontend fingerprint; no authoritative deployed Git commit was supplied. Browser checks do not certify PHP unit tests, tenant-isolation enforcement without foreign fixtures, all reasonCode length boundaries, mobile or physical hardware. The PHP prepare() hook, request tenant rules and full reasonCode boundary matrix cannot be certified from the browser scenarios alone; no approved second-tenant records were used. Legacy debit resource string identifiers were checked directly from its observed live GET. No source/backend fix was applied by this QA work.

## Evidence and deliverables

- [Detailed remaining bug](remaining-bugs.md)
- [PDF summary](../../output/pdf/NexStock-Five-Finding-Fix-Retest-2026-11-12.pdf)
- [Reviewed case register](../../blob-report/archive/release-verification-2026-11-12/verification-register.json)
- [Deployment fingerprint](../../blob-report/archive/release-verification-2026-11-12/public-deployment.json)
- [Primary evidence directory](../../blob-report/archive/release-verification-2026-11-12/evidence)

Fresh root: `blob-report/archive/release-verification-2026-11-12`. All completed attempts are preserved separately. The tests use the existing disposable QA credentials and guards; private authentication and recovery files are not deliverables.
