# NexStock - Production fix retest summary

**Retested 19-20 November 2026**, Indian/Mauritius. Production QA company only. **All reported bugs cannot be signed off as fixed.**

All **46 original unique tickets** have a disposition: **16 passed, 1 partially fixed, 29 failed, 0 blocked and 0 not tested**. 2 additional unique finding(s) were confirmed. The [remaining bug list](REMAINING-BUGS.md) contains 32 confirmed open tickets; the [status register](RETEST-STATUS.md) records every original ticket, its tested actions and evidence.

The supplied developer notes explicitly address **17 unique tickets**: 16 passed, 1 partial, 0 failed, 0 blocked and 0 not tested. Tickets absent from those notes were also revisited rather than assumed fixed. Counts refer to reported tickets, not percentage of development effort or whole-project acceptance.

## Fixes verified

| Ticket | Verified result |
| --- | --- |
| P3-PROD-003 | Native bundle recipe entry refused 0, -1 and 1.5 with inline validation. Fresh reads preserved the valid 2A+3B recipe after every invalid attempt. The valid two-kit cash control then consumed exactly 4A/6B in the verified invoice branch; fixture stock was recovered and products archived. |
| P3-PROD-007 | With sale-branch components at zero and another QA branch at A=10/B=8, the normal POS cash attempt returned HTTP 422 pos.insufficient_stock. All branch balances stayed unchanged. The same-branch stocked two-kit positive control passed separately; all owned balances were recovered before archiving. |
| P3-ADJ-001 | The native voucher saved two owned products (+5 and +7) under one persisted audit record. Zero was refused inline; an insufficient-stock multi-item request and nonexistent product/variant IDs returned 422 without changing either balance. Fixture balances were restored to zero and both products archived. Cross-tenant IDs were not probed. |
| P3-EXP-004 | Native batch entry refused 0 and -1 with inline errors and no POST. The same form then saved a positive quantity of 2; a fresh list contained exactly one matching batch with initial_quantity=2. The owned batch was deleted and canonical product stock restored. Separate FIFO/FEFO-compatible allocation, opposed receipt/expiry ordering and lot exhaustion controls also passed. |
| P3-LOOKUP-001 | Server-search pickers found newly created products by lower-case SKU in batch creation, Invoice and Quotation; both billing customer pickers found a later-created active contact beyond the old initial page. Inactive contacts were excluded and stale selected contacts were refused by both save endpoints. MVP-LOOKUP-001 is the same capability. This does not certify every search-ranking or pagination boundary. |
| P3-QUEUE-003 | The native Processing product was saved with processing enabled and its first normal POS cash sale created the owned queue entry, without API repair or a second sale. Live transitions to in_progress, ready and delivered persisted and were reflected by polling. Assignment and thermal-ticket generation remain separate failing tickets; drag-and-drop and cross-user timing are not certified. |
| P3-CN-002 | A standalone native Save as Draft retained status=draft and changed no stock. Issuing Billing correction changed stock by 0; issuing Product return added exactly 1. Repeated issue requests returned 422 and did not restock again. Fresh note/stock reads and stock restoration passed. No refund or external payment was sent. |
| P3-SUP-002 | An owned product-to-supplier mapping persisted supplier_sku, preferred status and lead time. The native supplier catalogue displayed the supplier SKU and found the product by that exact supplier SKU; the mapping was detached and the owned product archived. |
| P3-CUST-002 | Native create persisted creditEnabled=true, limit 25 and future expiry; native edit preserved them, rejected zero while credit was enabled, then persisted limit 50 and the changed expiry after a fresh read. The owned contact was retained inactive. Over-limit/expired-credit checkout enforcement is not certified by this configuration check. |
| P3-RPT-002 | An All-branches report with empty dates returned object filters, stayed visible after a fresh list read and ran successfully through Run now. A dated filtered template also persisted and ran; owned templates were deleted. Scheduled email delivery remains blocked without a controlled inbox. The separate visual query-builder gap remains P3-RPT-001. |
| P3-FONT-001 | Native Settings upload accepted Regular/Italic TTF files as multipart bodies, persisted both after reload and downloaded byte-identical files (SHA-256 matched fixtures). Invalid TXT was rejected, and the separate management-case font was deleted. MVP-FONT-001 is the same upload defect. Using these fonts in billing remains blocked by new RET-FONT-001; selected-font rendering is not passed. |
| P3-SEC-001 | A valid own-session refresh retained one session row. Targeted revocation returned success, removed that row and made both access and refresh return 401; anonymous access also returned 401. Own logout removed its row. Other sessions/authentication factors were preserved. This verifies live behavior rather than direct Redis configuration. |
| P3-BACKUP-001 | Native Export JSON returned 201 and created export job 1. The job completed; its own Download JSON action returned a valid 1,119,898-byte JSON file with generated_at/company_id/data and a QA marker. SHA-256 d8cb37ea699c8734f306395985a6a86d48b1de3f49fea98b6beaae66a17cfe55. This verifies job/file functionality, not exhaustive export completeness or restore. Fake toast-only buttons no longer establish a completed export; automated platform backup scheduling remains a separate failure. |
| MVP-FONT-002 | Two font-capable product Text definitions survived native create, fresh read, native edit/save and another fresh read; both Invoice and Quotation exposed usable corresponding text inputs. This closes product-definition storage only. Their entered billing values are lost separately under new RET-FONT-002. |
| MVP-CUST-001 | Active positive controls and persisted deactivation were exercised. Fresh Invoice and Quotation searches excluded the inactive owned contact. A separate native form selected the contact while active, deactivated it on another page, then received a customer-related HTTP 422 on Save as Draft for both document types. Owned contacts were retained inactive. |
| P2-DOC-004 | Classic Invoice, Quotation and Credit Note retained exact #17675e borders and rendered brand text #2e766e against actual #13191b at 3.3256:1, exceeding the ticket minimum 3:1 and developer target 3.1. The readable #15b8a6 control stayed unchanged at 7.1359:1. Template settings were restored after each check; this is not a general accessibility audit. |

## Remaining failures

Use the [detailed developer bug file](REMAINING-BUGS.md) for exact reproduction steps, actual failures and attachments. Corrected portions of partially fixed tickets are stated explicitly in that file.

- **RET-FONT-001:** All four inspected selectors (two fields on Invoice and two on Quotation) offered only Default. Settings fonts 9 (QARETESTFontmwo8nflsRegular) and 10 (QARETESTFontmwo8nflsItalic) were absent despite successful native upload, fresh-list persistence and byte-identical downloads. Product 232 / QA-P3-FONTSERVIC-mwo8oo7b retained both font-capable definitions.
- **RET-FONT-002:** Both native POST requests included the two exact values in items[0].customFields. Both returned 201, but the response and fresh detail GET returned items[0].customFields=[]. Invoice 298 / INV-DJY67K and Quotation 40 / QUO-DP3RO0 both omitted the entered text from their customer-facing web view and native one-page PDFs. PDF extraction and visual review agreed. Product definitions remained persisted, so this is distinct from the corrected MVP-FONT-002 product-storage defect.

## Execution and evidence

Reviewed **28 feature domains**. Current composite: **55 functional cases**, 59 setup/cleanup/recovery checks; **0 unresolved automation errors**. Functional dispositions: APPLICATION FAIL: 28; PASS: 16; PARTIAL: 8; BLOCKED: 3. Raw test-case passes are not acceptance percentages; availability checks can confirm a missing feature while its downstream flow remains unexercised.

Frontend: /app/assets/index-DZBfaQkC.js, SHA-256 5f6ea803eb55f9c0fcaf36542b3ccf656245989a5a80529de510f7b2e819bbbd. Initial/final fingerprint matches. The deployed PHP/backend commit, migrations and Redis configuration are not directly accessible in this QA repository; functional request/response behavior is the verification evidence.

Evidence: [current execution index](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-19/execution-index.json), [final recovery audit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-19/help-3/results.json), [initial deployment fingerprint](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-19/deployment-initial.json) and [final deployment fingerprint](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-19/deployment-final.json).

## Not certified by this retest

- Physical printers, label output, scanners and cash drawer checks remain skipped at the user's request; software controls and document generation are distinguished from device operation.
- No controlled QA email/SMS inbox or webhook receiver is available. External delivery, signatures/retries and scheduled report delivery are not certified; no external destination or live email schedule is created.
- TOTP enrollment, backup-code replay and recovery login remain blocked without an isolated activated account. The shared primary owner's authentication factors are preserved.
- Valid own-tenant IDs and nonexistent-ID controls can be tested. Cross-tenant enforcement is not certified without a second authorized disposable tenant.
- A missing user workflow is a confirmed availability failure. Its downstream calculations, validation, delivery or persistence cannot be certified merely by inspecting the unavailable controls.
- Credit configuration persistence is distinguished from over-limit or expired-credit checkout enforcement. The latter is not certified by the configuration ticket alone.
- JSON export job/file behavior is distinguished from full data completeness, database restoration and automated platform backup execution; no production restore is attempted.
- This campaign uses Windows/Chromium/Playwright at 1920 x 1080. It is not a fresh full cross-browser, mobile or complete Phase 1/2/3 acceptance campaign.
- Font-upload verification covers the bundled Regular/Italic TTF fixtures and invalid TXT rejection. Other font formats and independent selected-font browser/PDF rendering are not certified: uploaded fonts are absent from both billing selectors. Default-font text controls also fail independently.

## Automation corrections

- Corrected the local Playwright browser-cache path and ran the authorized QA browser outside the restricted network sandbox. Browser startup/DNS failures were infrastructure attempts, not application defects.
- Updated the stock-adjustment adapter for its deployed search combobox, multiple rows and signed text quantity fields; superseded failures from native-select/spinbutton assumptions are not application tickets.
- Updated entity selection to use the deployed server-search controls and actual server responses, including lower-case SKU searches. No missing option is injected.
- Updated quantity checks to observe inline rejection without waiting for the old erroneous request. Removed a redundant no-op recipe Save after fresh reads had already proved the valid recipe unchanged.
- Added bounded retries for a transient ERR_NETWORK_CHANGED during read-only page navigation. No business mutation is automatically replayed; the interrupted scenario is rerun after stock recovery.
- Expanded confirmation checks for credit issue/duplicate issue, session refresh/revocation/logout, credit-setting round-trips, unfiltered report runs, actual native JSON export output and per-text font rendering.
- Corrected two cleanup/assertion adapters: inventory search inputs are checked by their value, and offline recovery reopens the verified QA workspace after leaving the offline page. Both affected cases were rerun; their superseded adapter failures are excluded.
- Scoped asynchronous picker searchboxes using the trigger's aria-controls relationship; closing customer and opening product popovers can temporarily expose two searchboxes. The stale-customer Invoice/Quotation check passed on rerun.
- Corrected the font inspection callback to receive the DOM element and test values separately. The prior callback error is superseded by the November 20 confirmation run.
- Waited for the actual saved template response and Classic letterhead before measuring dark-mode styles; the prior Modern fallback measurement was superseded by both passing contrast controls.

## QA data and restoration

- Final November 20 live audit passed: all 70 ledger-owned catalogue fixtures are archived, none remain active, every owned archived branch balance is zero, and the canonical product matches its captured all-branch baseline.
- Owned expiry lots, temporary API keys, saved-report templates and QAP3Font management fixtures are absent. The current retest stock-count draft is cancelled; stock/transfer recovery ledgers and template restoration are verified.
- Original MVP font IDs 1 and 2 are preserved. Four QARETESTFont diagnostic fonts (IDs 8, 7, 10, 9) are deliberately retained: 7/8 belong to the superseded callback attempt, 9/10 to the completed confirmation. Native Invoice 298 / INV-DJY67K and Quotation 40 / QUO-DP3RO0 preserve the current text-loss reproduction; earlier draft 297 is retained as attempt history. Their owned stockless catalogue products are archived.
- Owned customer contacts created for credit/search/stale-selection controls are retained inactive. Synthetic QA cash sales, credits/debits, purchase orders and adjustment audit records are retained for traceability. These are test records, not deleted financial history.
- Native JSON export job 1 and its QA-only output were retained locally for validation; the raw export dump is excluded from the portable developer evidence package. No production restore, external payment, customer email/SMS or webhook dispatch was requested.
- Only automation-owned sessions were revoked/logged out; existing owner sessions and authentication factors were preserved.

This is confirmation/regression testing of the supplied bug list, with supporting module checks. It does not certify every Phase 1/2/3 requirement or production integration as complete. Physical skips and blocked delivery/account checks are not passes.
