# NexStock - Final MVP and custom-font test, 13 November 2026

**MVP sign-off is not recommended yet.** The final regression completed, but the requested custom-font workflow cannot be accepted. Four new tickets and the existing minor contrast issue remain.

Phase 3 is paused. Only the explicitly requested font upload/customised-item document workflow was added to the Phase 1/Phase 2 regression.

## Reviewed execution

| Scope | Passed | Application-failing cases | Interpretation |
| --- | ---: | ---: | --- |
| Core Phase 1 and delivered Phase 2 regression | 106 | 3 | Customer eligibility, incomplete customer lookup and the existing Classic contrast boundary fail. |
| Requested font workflow | 0 | 3 | Upload/custom-field prerequisites fail; Invoice and Quotation product lookup also blocks the workflow. Selected-font output was not reached. |
| Setup, recovery and cleanup | 30 | 0 | Counted separately from functional acceptance. |
| Offline guard, contrast and classification checks | 79 | 0 | No skipped/cancelled cases. |

There are **112 unique functional cases: 106 passed and six application-failing cases**, plus 30 support cases. Six failing cases group into **five confirmed tickets**: pagination affects three cases, while one prerequisite case exposes both upload and custom-field persistence failures. Twenty-eight completed attempts are preserved. The latest completed execution of each exact case replaces earlier attempts; failed automation attempts are not added to the final bug count. No unresolved automation error remains after review.

## What passed

| Area | Fresh verified behaviour |
| --- | --- |
| Products and branches | Standard/service creation, wholesale pricing, edits, barcode/description clearing, VAT classification and inclusive pricing; branch contacts and isolated branch balances. |
| Stock adjustments | Positive/negative adjustments, rejected zero and overdraw attempts, reason/justification history, valuation and reconciliation. |
| POS | Search/barcodes, cart edits and price override, customer linkage, discounts, tax/exemption, cash/card/Juice/bank-transfer and split-tender recording, underpayment rejection, change and receipt printing invocation. |
| Billing | Invoice identity/totals/PDF, settings bank instructions, clearing header/footer, Net 30 dates, issuance, partial/final payment, invalid payments and browser printing. |
| Contacts and settings | Supplier lifecycle/eligibility, customer identity/BRN/VAT edits and optional-field clearing, status changes, retained draft history; company/VAT/decimal preferences, English/French and theme persistence. Two invoice customer-selection exceptions remain below. |
| Access and navigation | Valid sign-in, anonymous protected routes/API, logout/back/deep-link and second-tab protection; public Terms/Privacy navigation and keyboard/focus checks. Legal approval is outside these navigation checks. |
| Scanner/dialog checks | Keyboard HID emulation at 0/5/25 ms, leading zeros, one confirmed cart unit, scanner focus; normal variant Add to order at 1920 x 1080 and 1440 x 900. Physical devices were not exercised. |
| Delivered Phase 2 flows | Quotation notes/terms/discounts/PDF/status/conversion; POS hold/resume/formal invoices; PO approval and partial/final receipt; stock-count variance/reconciliation; credit reasons/refunds/print, and new/legacy debit product identity. |

## Previously reported fixes

| Ticket | Current result |
| --- | --- |
| RET-002 | Pass: settings header/bank text reaches PDF, builder notes take precedence, blank/whitespace notes fall back, rendering does not overwrite the stored template, and internal till notes remain excluded. |
| RET-003 | Pass: normal Add to order works at both tested desktop sizes. |
| P2-QUOTE-002 | Pass: customer quotation notes and terms reach the native PDF; status and one-time conversion pass. |
| REL-DN-001 | Pass: new and legacy debit web/print output retains product name/SKU; legacy DTO identifiers are strings. |
| P2-DOC-004 | Partial, Low: exact borders/branding and readable-colour control pass; the dark tint remains 2.991035:1 on the actual surface against the stated 3:1 minimum. |

## Custom-font result

1. Two valid, licensed TTFs were tested: Bitstream Vera Sans Regular (65,932 bytes) and Oblique (63,684 bytes). An unsupported TXT extension was rejected by the UI.
2. Valid Settings uploads repeatedly returned **422, `The file field is required.`** The captured browser request is `application/json` with `"file": {}`, without a multipart boundary or font bytes. This also happens when selecting the original file directly from disk.
3. To isolate downstream checks, the same verified QA session and observed endpoint were used for **separately labelled standard-multipart fixture setup**. Both uploads returned 201. Settings shows the two fonts after reload, and actual file downloads match the original SHA-256 hashes. This is a diagnostic setup pass, not a Settings UI upload pass.
4. An owned stockless product, **163 / `QA-MVP-FONT-mwec9cu0`**, was created through the UI with `QA Engraving` and `QA Signature`, both supporting custom fonts. Its actual POST contains both definitions. The successful response/fresh product GET omit them, and the reopened Custom Fields editor is empty.
5. Both Invoice and Quotation offer only the first **15 of 116 products**. The persisted active product 163 is absent, including after navigating to the end of the list. The separate invoice customer test likewise loads only **15 of 68 customers**.

**Custom text entry, selected-font choice and selected-font Invoice/Quotation PDFs are therefore blocked. No matching-font PDF pass or PDF font-rendering defect is claimed.** There was no browser-storage injection, forced selection, patched CSS/JavaScript or substituted success response. The PDF/glyph inspection code is ready for the post-fix retest.

## Confirmed tickets

| Ticket | Priority | Remaining behaviour |
| --- | --- | --- |
| MVP-FONT-001 | High | Settings serialises the font upload as JSON and loses the file bytes. |
| MVP-FONT-002 | High | Submitted font-capable product custom fields do not survive save/reload. |
| MVP-LOOKUP-001 | High | Invoice customer and Invoice/Quotation product pickers expose only the initial page. These occurrences are grouped as one incomplete lookup capability. |
| MVP-CUST-001 | High | A customer confirmed inactive by a fresh GET is still offered for a new invoice. |
| P2-DOC-004 | Low | Existing rendered dark-text contrast boundary remains just below 3:1. |

Full reproduction steps, actual requests, expected results, developer guidance and attachments are in [remaining-bugs.md](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/final-mvp-2026-11-13/remaining-bugs.md).

## Automation corrections and cleanup

Corrected the account menu selector, duplicate customer matches in the revenue-ranking table, customer Actions button, duplicated invoice total panels, shifted product selector after Payment Terms was added, expanded customer profile heading, commercial number versus internal ID in customer history, and scanner customization detection/cart markup. Font fixture selection was adapted to repeated pre-existing QA category names. Relevant checks were rerun; these are QA adapter corrections, not application tickets. The initially interrupted customer cleanup was recovered before continuing: all nine saved records from that attempt were retained inactive.

All final support checks pass. QA stock, VAT, company preferences/language/theme, invoice header/footer and document template were restored and verified by their suites. Recovery ledgers show inventory/text/template restored, no pending settings recovery and no held-order recovery records. Synthetic financial/history records and inactive QA contacts remain. The two owned diagnostic fonts and stockless product 163 remain available for developer reproduction; they do not represent a successful customer font workflow. No font-specific invoice/quotation was saved because selection was blocked. No external payment, email or physical print job was sent.

## Limits and next retest

This is a scoped final browser regression, not full acceptance of all 51 Phase 1, 65 Phase 2 or 59 Phase 3 subfeatures. Fresh onboarding, credential/reset/PIN changes, real gateway settlement, multi-tenant/RBAC certification, physical equipment and explicitly undelivered Phase 2 features are outside this run. Credit allocation in P2-CN-004 remains previously undelivered; its record-only refund portion passed again here. No new credit-allocation failure is claimed.

The public frontend remained `index-Bw0A9VIv.js`, SHA-256 `bd0987b86cf20ca4531f81b3f859bb2d32d3d7d41da42386d09a9c377992584c`, at the start and end. This identifies served frontend bytes, not an authoritative deployed backend commit.

After fixing upload, custom-field persistence and complete picker loading, rerun from a fresh session: upload two fonts through Settings, create/reopen a product, enter two distinct custom strings, select different fonts on each, save Invoice and Quotation, reopen, and inspect both actual browser glyph fonts and the native PDF fonts used by those exact strings. The served client also contains legacy `localStorage.customFonts` reads in document editors; that is a source observation for the next retest, not an additional live-confirmed selector bug in this run.

## Deliverables and evidence

- [PDF summary](C:/Users/amiirah/Documents/Projects/nexstock-testing/output/pdf/NexStock-Final-MVP-and-Custom-Fonts-2026-11-13.pdf)
- [Detailed confirmed bugs](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/final-mvp-2026-11-13/remaining-bugs.md)
- [Reviewed case register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/verification-register.json)
- [Explicit review decisions](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/manual-review.json)
- [Evidence index](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/evidence/index.json)
- [Offline check output](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/final-mvp-2026-11-13/offline-checks.tap)

Raw attempts are preserved under `blob-report/archive/final-mvp-2026-11-13`. The generic historical Phase 2 assessor flags the new MVP IDs/soft assertions for review; the explicit decisions above resolve those flags in the final register. Original reports are preserved unchanged. Authentication and private recovery files are not deliverables.
