# NexStock - Production fix retest summary

**Retested 24 November 2026**, Indian/Mauritius. Production QA company only. **The complete bug list cannot be signed off as fixed.**

All **32 original unique tickets** have a disposition: **3 passed, 0 partially fixed, 28 failed, 1 blocked and 0 not tested**. 0 additional unique finding(s) were confirmed. The [remaining bug list](REMAINING-BUGS.md) contains 28 confirmed open tickets; the [status register](RETEST-STATUS.md) records every original ticket, its tested actions and evidence.

The supplied developer notes explicitly address **3 unique tickets**: 3 passed, 0 partial, 0 failed, 0 blocked and 0 not tested. Tickets absent from those notes were also revisited rather than assumed fixed. Counts refer to reported tickets, not percentage of development effort or whole-project acceptance.

## Fixes verified

| Ticket | Verified result |
| --- | --- |
| P3-API-002 | Expanded all 39 endpoint accordions in all five Products/Inventory/Invoices/Orders/Customers reference sections. Methods/paths, role/key-scope labels, query/body fields and parseable response examples are present; stale notices are absent. Documented X-Api-Key works without a session or business header, with anonymous/invalid/rotated/revoked controls, read-only deny and write-enabled allow. The validation-error example matches a live 422 control; representative resource reads and both Products/Customers documented pagination envelopes matched live responses. Backend ApiReferenceRoutesTest, OpenAPI diff, every write route and non-owner role gates are not independently certified. |
| RET-FONT-001 | Fresh tenant TTF uploads were offered and independently selected for both custom fields on Invoice, Quotation, Credit Note editor and POS (two note-boundary runs). No legacy localStorage font list was seeded. Both Invoice/Quotation editors contained one loaded FontFace per uploaded family, and actual Chromium glyphs used the intended Regular/Italic font. Anonymous and invalid-token reads of the owned uploaded font file both returned 401. Credit Note coverage is selector-only; cross-tenant access and physical receipt typography are not certified. |
| RET-FONT-002 | Exact customer text, literal `<b>`/`<tag>` characters, accented É and independent font families survived native Invoice/Quotation create and fresh reads; actual browser glyph fonts and both Modern/Classic native PDF designs passed. Native quotation conversion and both POS sales retained the two definition-backed fields/fonts. Removing a separate owned Italic font retained its text and produced the default PDF fallback. Internal POS note readback is a separate limited control. |

## Remaining failures

Use the [detailed developer bug file](REMAINING-BUGS.md) for exact reproduction steps, actual failures and attachments. Corrected portions of partially fixed tickets are stated explicitly in that file.


## Additional amended changes

- **Processing-queue assignee membership validation — PARTIAL:** Active current QA owner assignment succeeded and persisted; clear-to-unassigned succeeded. Invalid/nonexistent user control returned 422 without changing the valid assignee. No inactive own-member control was available; inactive-member rejection is not independently certified. Cross-tenant enforcement remains unverified without a second controlled tenant. UI assignment is still absent under P3-QUEUE-001. [Evidence 1](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/order-queue-1/results.json)
- **POS item-description length regression — PASS:** Native Special Instructions inputs of 256 and 500 characters produced 363/500-character combined wire notes, both above the old varchar(255) boundary and within the 500-character API limit. Both cash sales returned 201 and their exact Invoices reloaded. Definition-backed customer text/fonts persisted; internal item_description is not exposed for exact readback. No direct database-schema inspection was performed. [Evidence 1](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/document-design-2/results.json)

## Execution and evidence

Reviewed **28 feature domains**. Current composite: **57 functional cases**, 59 setup/cleanup/recovery checks; **0 unresolved automation errors**. Functional dispositions: APPLICATION FAIL: 25; PASS: 19; PARTIAL: 9; BLOCKED: 4. Raw test-case passes are not acceptance percentages; availability checks can confirm a missing feature while its downstream flow remains unexercised.

Frontend: /app/assets/index-B9jWytye.js, SHA-256 2e11154cc577c102f452e204468806049bd11ac0700f8e3379701615318bd4cf. Initial/final fingerprint matches. The backend source/deployed commit, migrations, OpenAPI diff and CI contract-test run are not directly accessible in this QA repository; live request/response behavior and production UI are the verification evidence.

Evidence: [current execution index](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/execution-index.json), [final recovery audit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/help-2/results.json), [initial deployment fingerprint](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/deployment-initial.json) and [final deployment fingerprint](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/deployment-final.json).

## Unconfirmed observations

- **P3-BACKUP-002:** FEATURES.md F28-f requires Automated Database Backup & JSON Dump Export; it does not mandate a tenant-facing scheduling, retention or history screen. The earlier UI absence does not establish that platform-managed backup jobs are missing. See [the separate observation register](OBSERVATIONS.md).

## Not certified by this retest

- Physical printers, label output, scanners and cash drawer checks remain skipped at the user's request; software controls and document generation are distinguished from device operation.
- No controlled QA email/SMS inbox or webhook receiver is available. External delivery, signatures/retries and scheduled report delivery are not certified; no external destination or live email schedule is created.
- TOTP enrollment, backup-code replay and recovery login remain blocked without an isolated activated account. The shared primary owner's authentication factors are preserved.
- Valid own-tenant IDs and nonexistent-ID controls can be tested. Cross-tenant enforcement is not certified without a second authorized disposable tenant.
- A missing workflow explicitly required by the feature specification or supplied fix contract is an availability failure. Platform capabilities and unspecified workflow designs cannot be declared broken from UI absence alone; blocked downstream checks remain unverified.
- Credit configuration persistence is distinguished from over-limit or expired-credit checkout enforcement. The latter is not certified by the configuration ticket alone.
- JSON export job/file behavior is distinguished from full data completeness, database restoration and automated platform backup execution; no production restore is attempted.
- This campaign uses Windows/Chromium/Playwright at 1920 x 1080. It is not a fresh full cross-browser, mobile or complete Phase 1/2/3 acceptance campaign.
- Backend application source, migrations, OpenAPI changes and ApiReferenceRoutesTest are not bundled in this QA repository. Live functional behavior and expanded production UI documentation are verified; the developer build test is not independently run.
- Queue membership controls use the current active QA owner, a nonexistent user and an inactive member only if one is already available. Cross-business rejection is not certified without a second controlled tenant. No member account, role or activation state is altered.
- Font tests use licensed Regular/Italic TTF fixtures, invalid TXT and an owned-font removal control. OTF, other font formats and unrelated international writing systems are not certified.
- Credit Note coverage verifies font-selector availability/selection only. Saving/printing Credit Note custom text, physical POS receipt typography, queue drag-and-drop and cross-user timing are not certified by these controls.
- POS item-note boundaries are checked through native wire values above 255/up to 500 and successful persisted sales. The public Invoice resource does not expose internal item_description, so exact internal-note storage cannot be independently read back. Special Instructions are not assumed to be customer-facing custom fields.

## Automation corrections

- Calibrated the per-marker PDF oracle with known Regular/Italic embedded TTF fixtures, Unicode text and literal HTML-like characters. JSON output now escapes Unicode to avoid Windows console-code-page corruption; this calibration is not counted as an application pass.
- Expanded the prior automation to all four Invoice/Quotation PDF designs, POS and credit-note selectors, POS 256/500-character notes, quotation conversion and removal of an owned temporary font. Native UI selections are not injected or seeded through localStorage.
- Corrected PDF table reading order: positional extraction interleaved adjacent Qty/Price cells into wrapped custom text although the literal values were visible. Content-stream extraction was verified against both exact native PDFs; affected native checks passed on rerun.
- Removed an incorrect assertion that POS Special Instructions must be returned as a customer custom field. The deployed contract sends internal note separately from definition-backed custom_fields. Long-note checks validate native wire lengths and sale acceptance; exact internal database-note readback is not exposed by the public Invoice resource.
- Adjusted the review gate to count the actual loaded FontFace per family. Chromium uses the native FontFace API; requiring a fallback CSS style node was an incorrect analysis assumption, not an application failure.
- Corrected case-sensitive API-reference section-label detection: CSS renders QUERY PARAMETERS and REQUEST BODY in uppercase. All five captured sections contain the expected field tables; the native documentation case passed on rerun with case-insensitive matching.

Evidence: [Evidence 1](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/pdf-reading-order-correction.json), [Evidence 2](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/discovery/font-oracle-calibration.json), [Evidence 3](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/document-design-1/artifacts/document-design-custom-fon-b557c-e-Quotation-and-native-PDFs-phase3-document-design/invoice-custom-fonts.pdf), [Evidence 4](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/document-design-1/artifacts/document-design-custom-fon-b557c-e-Quotation-and-native-PDFs-phase3-document-design/quotation-custom-fonts.pdf), [Evidence 5](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/retired-automation-findings.json), [Evidence 6](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/retired-api-automation-finding.json), [Evidence 7](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/pdf-visual-review/manifest.json).

## QA data and restoration

- Final live audit completed on 24 November at 21:15 Indian/Mauritius: all 89 cumulative ledger-owned catalogue fixtures are archived, none remain active, all owned archived branch balances are zero, and the canonical product matches its captured all-branch baseline. No extra archive repairs were needed.
- Owned expiry lots, temporary API keys, saved-report templates and QAP3Font management fixtures are absent. The current campaign stock-count draft is cancelled; stock/transfer recovery ledgers and template restoration checks passed.
- Original MVP font IDs 1 and 2 are preserved. Eight diagnostic fonts are deliberately retained: historical 7/8/9/10, superseded current-attempt 11/12 and completed-confirmation 15/16. The separate owned removal-control font 13 and management font 14 were deleted. This preserves reproducibility of retained documents without changing historical fonts.
- Current native customer-text evidence: Invoice 312 / INV-QZKMJB, Quotation 42 / QUO-V9FAGW, converted Invoice 313 / INV-EQXG42, POS Invoices 314 / POS-SV8YPUUI and 315 / POS-SNZDSHLF. Earlier attempt documents and removal-control Invoice 311 / INV-TLT4NB remain as traceable QA history. Their owned catalogue products are archived.
- Owned inactive customer contacts and synthetic cash sales, credits/debits, purchase orders and adjustment audit history are retained. No external payment or customer email/SMS was requested; no external webhook destination was registered. Raw QA JSON export output is excluded from the portable handoff; no production restore was attempted.
- Only automation-owned sessions were revoked/logged out. Existing owner sessions, roles, activation state and authentication factors were preserved.

This is confirmation/regression testing of the supplied bug list, with supporting module checks. It does not certify every Phase 1/2/3 requirement or production integration as complete. Physical skips and blocked delivery/account checks are not passes.
