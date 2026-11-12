# Phase 1 - Round 1 Combined Detailed Bugs

Prepared **25 October 2026**. This combines the previous **24 October** release-retest tickets with the Help Center continuation confirmed on **25 October**.

| Scope | Application-failing cases | Unique confirmed tickets |
| --- | ---: | ---: |
| Existing release retest (24 October) | 7 | 4: RET-001 to RET-004 |
| Help Center / Round 1 omission, reconfirmed 25 October | 5 | 1: HELP-001 |
| Combined recorded findings | 12 | 5 |

The earlier four tickets below are copied from the existing detailed Markdown and **were not rerun on 25 October**. Their dates and evidence are retained; this is not a claim that all five bugs were freshly reproduced together. The Help run also has **three blocked cases**, which are not confirmed bugs and are described separately in its section.

The Help Center issue is explicitly labelled **Help Center, Legal & Compliance - Round 1 bug omitted from the 24 October consolidated report**. It was previously identified on 21 October, so this label describes a reporting omission, not a newly invented or newly discovered defect. Corrected automation/tracking errors and pending legal/release prerequisites are not additional application tickets.

## Existing release-retest tickets - 24 October 2026

Test date: **24 October 2026**. These are the existing post-deployment results; no new test run was performed for this document revision.

**Seven failed automated test cases map to four confirmed application bugs.** Duplicate failures are grouped into one ticket per capability, as required by this project. Corrected automation errors, unconfirmed policy observations and deferred features are not counted as bugs here.

## All seven failed cases

| Failed case | Scenario | Bug ticket |
| --- | --- | --- |
| T022 | release basic-variant customization Add to Order remains reachable on desktop | RET-003 |
| T034 | exports a valid PDF matching the saved invoice identity and amounts | RET-002 |
| T035 | includes configured banking instructions and payment notes in the exported PDF | RET-002 |
| T058 | creates a Net 30 tax invoice, issues, part-pays, settles and exports/prints | RET-002 |
| T073 | finds and links an existing customer to checkout | RET-001 |
| T085 | searches, builds an order, links a customer, discounts, checks out and reviews receipt | RET-001 |
| T180 | release purchase-order vendor picker excludes inactive supplier with an active positive control | RET-004 |

Attachments below are verified local evidence files. Upload the relevant screenshots/error contexts to Trello when sharing a card; local file links are not shared Trello attachments.

## RET-001

### Title

Active QA customer cannot be found in the POS customer picker

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.

### Priority

**High** - Prevents linking an existing customer to checkout.

### Step-by-step

1. Sign in to https://nexstock.stylotech.mu/app with the approved QA account and select **Nexstock QA Company**.
2. Open **Customers**. Search for **QA POS Automation Customer** (`qa.pos.customer@example.invalid`) and confirm the matching record is **Active**.
3. Open **Point of Sale** and start a fresh order.
4. Click the **Walk-in Customer / Tap to change** selector to open **Select Customer**.
5. Enter the exact customer name **QA POS Automation Customer** in the search field.
6. Attempt to choose the existing record and associate it with the order. For the integrated-flow reproduction, add the QA product to the cart before this customer-selection step.

### Expected Result

The active existing customer is returned and can be linked to the order.

### Actual Result

POS reports no matching customer, although the Customers module shows the active record. The independent linking test and integrated POS flow fail at this same step.

Affected failed tests:

- **T073** - finds and links an existing customer to checkout (`pos-2`).
- **T085** - searches, builds an order, links a customer, discounts, checks out and reviews receipt (`pos-2`).

### Attachment

- [T073 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-customer-linkin-7b07c-omer-to-checkout-phase1-pos-chromium-pos/test-failed-1.png)
- [T073 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-customer-linkin-7b07c-omer-to-checkout-phase1-pos-chromium-pos/error-context.md)
- [T085 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-pos-full-flow.u-31eb7-eceipt-phase1-pos-full-flow-chromium-pos/test-failed-1.png)
- [T085 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/pos-2/phase1-pos-pos-full-flow.u-31eb7-eceipt-phase1-pos-full-flow-chromium-pos/error-context.md)

### Comment

Confirmed application finding, reproduced in both an independent customer-linking test and the integrated POS flow. The full flow stops at customer selection: its later discount, checkout and receipt steps were not reached in that failing run. Those downstream steps are not additional bugs. Search/pagination/filtering is an investigation direction, not a verified backend root cause. Do not create a duplicate customer to hide the failure.

Developer: search all eligible customers by identity across pages and add a beyond-first-page active-customer regression. QA: rerun linking and the complete checkout flow after correction.

---

## RET-002

### Title

Invoice Download opens a public 404 page instead of the invoice export

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.

### Priority

**High** - Prevents invoice export and blocks validation of exported document contents.

### Step-by-step

1. Sign in to https://nexstock.stylotech.mu/app and select **Nexstock QA Company**.
2. Open **Invoices**. Locate a retained QA billing invoice from this retest, such as reference **96**, **97** or **105**. Alternatively, save a new valid synthetic QA invoice.
3. In the invoice list, identify the correct row and click its **Download** icon.
4. Inspect the newly opened browser tab and its URL.
5. Check whether an invoice PDF or usable invoice print view is returned.
6. For the branding variation, use the QA invoice created with banking instructions/payment notes (reference **97** during the retest). For the integrated-flow variation, use the Net 30 invoice issued, part-paid and fully settled before export (reference **105** during the retest).

### Expected Result

A usable invoice PDF/print view opens for the requested document, retaining the /app application mount.

### Actual Result

The new tab navigates to /invoicing/<id> without /app and displays the marketing site's 404: That page is not here. No file download or print invocation occurs.

Affected failed tests:

- **T034** - exports a valid PDF matching the saved invoice identity and amounts (`invoicing-4`).
- **T035** - includes configured banking instructions and payment notes in the exported PDF (`invoicing-4`).
- **T058** - creates a Net 30 tax invoice, issues, part-pays, settles and exports/prints (`invoicing-5`).

### Attachment

- [T034 - invoice-export-popup](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-66ece-nd-amounts-phase1-invoicing-chromium-invoicing/attachments/invoice-export-popup-4726d5b3d8f59b3847d95f9629460cf3c5fa5831.png)
- [T034 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-66ece-nd-amounts-phase1-invoicing-chromium-invoicing/test-failed-1.png)
- [T034 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-66ece-nd-amounts-phase1-invoicing-chromium-invoicing/error-context.md)
- [T035 - invoice-export-popup](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-e129f-ported-PDF-phase1-invoicing-chromium-invoicing/attachments/invoice-export-popup-e47190a8dd9cd553c706c405396a5ad968ccd882.png)
- [T035 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-e129f-ported-PDF-phase1-invoicing-chromium-invoicing/test-failed-1.png)
- [T035 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-4/artifacts/phase1-invoicing-branded-p-e129f-ported-PDF-phase1-invoicing-chromium-invoicing/error-context.md)
- [T058 - invoice-export-popup](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-5/artifacts/phase1-invoicing-invoicing-fedcf--phase1-invoicing-full-flow-chromium-invoicing/attachments/invoice-export-popup-e2971e2dbfe910d606649f372a990e04b17474f7.png)
- [T058 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-5/artifacts/phase1-invoicing-invoicing-fedcf--phase1-invoicing-full-flow-chromium-invoicing/test-failed-1.png)
- [T058 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/invoicing-5/artifacts/phase1-invoicing-invoicing-fedcf--phase1-invoicing-full-flow-chromium-invoicing/error-context.md)

### Comment

One export defect causes three failed tests. Observed export URLs included `/invoicing/96`, `/invoicing/97` and `/invoicing/105`, missing the application mount `/app`. A separate read-only diagnostic reproduced the public 404. This confirms export/navigation failure, not missing banking text or incorrect totals inside a generated PDF: no usable PDF was produced to inspect. Invoice saving and payment settlement passed before the integrated flow reached this export failure. Existing retained records can reproduce it without changing current company VAT/branding settings.

Developer: generate mount-aware application URLs for print/export actions and verify both list and detail entry points. QA: rerun PDF identity, branding, VAT and full flow; inspect the produced PDF, not just a button or HTTP success.

---

## RET-003

### Title

Basic-variant customization footer is outside the desktop viewport

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.
- Viewport: **1920 x 1080**.

### Priority

**High** - Prevents completing normal customization for the affected basic-variant product.

### Step-by-step

1. Use desktop Chromium with a **1920 x 1080** viewport and normal browser zoom.
2. Sign in to https://nexstock.stylotech.mu/app, select **Nexstock QA Company**, and open **Point of Sale**.
3. Find the enabled, in-stock basic-variant QA product with SKU **QA-FLOW-mv89ihb7-8dc11e** (display name **QA flow mv89ihb7-8dc11e Final** during the retest). It has Size, Color and Material options.
4. Click the product to open **Customize Product**.
5. Leave **Standard (No Variant)** selected initially and inspect/scroll through the available variant choices.
6. Attempt to reach and click **Add to Order** using normal scrolling and clicking, without changing zoom, forcing a click or modifying the page.

### Expected Result

The customization body scrolls within a bounded dialog and the action footer remains reachable.

### Actual Result

The dialog content/variant list extends below the viewport; normal scrollIntoView and click cannot reach Add to Order even at 1920 x 1080. A larger viewport did not resolve it.

Affected failed tests:

- **T022** - release basic-variant customization Add to Order remains reachable on desktop (`hardware-3`).

### Attachment

- [T022 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/hardware-3/artifacts/phase1-hardware-barcode-sc-a5907-emains-reachable-on-desktop-chromium-hardware/test-failed-1.png)
- [T022 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/hardware-3/artifacts/phase1-hardware-barcode-sc-a5907-emains-reachable-on-desktop-chromium-hardware/error-context.md)

### Comment

Confirmed UI reachability finding for Phase 1 basic variants, not Phase 3 assemblies/serialized units. The failure remained at 1920 x 1080 rather than only a small headless viewport. Normal scroll/click could not reach the footer; the test did not force a hidden action to pass. Keyboard-HID counting on a separate simple/service fixture passed and is not a second scanner bug. No sale was submitted by this reachability check.

Developer: constrain dialog height, add a working internal scroll area and keep footer controls inside the visible dialog. QA: retest mouse, keyboard, scanner customization and normal desktop sizes.

---

## RET-004

### Title

Deactivated supplier remains selectable for a new purchase order

### Environment

- Target: https://nexstock.stylotech.mu/app (**Production**).
- Company: **Nexstock QA Company**.
- Platform: Windows, Chromium, Playwright 1.62.1.
- Tested: **24 October 2026**, Indian/Mauritius.

### Priority

**High** - Allows an ineligible, deactivated vendor to be offered for new purchasing.

### Step-by-step

1. Sign in to https://nexstock.stylotech.mu/app and select **Nexstock QA Company**.
2. Open **Suppliers**. Create two disposable QA vendors with unique early-sorting names, for example **QA SUP 000 release active control <unique>** and **QA SUP 000 release inactive <unique>**. Leave the first vendor Active.
3. Deactivate the second vendor through Suppliers and reload/search it to confirm **Inactive** persisted.
4. Open **Purchase Orders** and start a new purchase order (`/app/purchasing/orders/new`).
5. Open the supplier picker. Confirm the Active control vendor appears, proving the picker loaded the relevant range.
6. Inspect the picker for the exact deactivated vendor name. Do not submit the purchase order.

### Expected Result

The valid active control remains selectable; the deactivated vendor is excluded from new purchasing selection while historical records are preserved.

### Actual Result

Both vendors are offered. The active positive control passes, but the explicitly deactivated vendor is still present in the picker.

Affected failed tests:

- **T180** - release purchase-order vendor picker excludes inactive supplier with an active positive control (`suppliers-4`).

### Attachment

- [T180 - screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/suppliers-4/artifacts/phase1-suppliers-release-v-705d4--an-active-positive-control-chromium-suppliers/test-failed-1.png)
- [T180 - error-context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-retest-2026-10-24/suppliers-4/artifacts/phase1-suppliers-release-v-705d4--an-active-positive-control-chromium-suppliers/error-context.md)

### Comment

Confirmed picker-eligibility finding with an Active positive control; the result is not based on an empty or unpopulated picker. Both QA vendors were retained Inactive by suite cleanup, so use fresh QA vendors or reactivate only the disposable control when manually reproducing. No purchase order or payment was submitted. Earlier absence of later-sorting Active vendors is a separate unconfirmed pagination observation, not an additional confirmed bug in this list.

Developer: align picker eligibility with the status representation written by Deactivate and exclude inactive/suspended/archived records consistently. QA: rerun with an active positive control and a vendor beyond the first loaded page.

---



## Help Center, Legal & Compliance - Round 1 omissions

Test date: **25 October 2026**. Target: **Production**, https://nexstock.stylotech.mu/app, approved **Nexstock QA Company**. Chromium/Windows; public desktop 1440 x 1000 and mobile 390 x 844.

## Result summary

All **12 implemented checks were run; 0 skipped**. Playwright reports **4 passed and 8 failed**. Reviewed disposition:

| Disposition | Cases | Meaning |
| --- | ---: | --- |
| Passed | 4 | Help navigation, public copyright/year, QA login/company selection, and read-only audit/logout |
| Confirmed application defect | 5 | Four independent public legal-button cases plus the full flow repeat **one** bug: HELP-001 |
| Prerequisite blocked | 3 | Authenticated Terms, authenticated Privacy, and build identity; not counted as bugs or passes |
| Unresolved automation failures | 0 | No remaining selector/setup failures |

The integrated flow also records the three blockers; those are not counted again. Blocked cases remain red with **PREREQUISITE BLOCKED** annotations rather than being skipped or marked passed. The complete legal flow has **not** passed.

## Developer readiness response and scope

- **Terms:** the developer says Terms of Service will be generated after project completion. Approved wording/version and document delivery cannot be signed off now.
- **Privacy:** an approved document/version and separate delivery confirmation were not supplied. This is blocked/unconfirmed, not an assumed new missing-document bug.
- **Production release/build:** the developer says it is not yet released for production. No authoritative release/version/commit reference was supplied for this module. No expected value is invented, and this does not claim earlier application fixes were rolled back.
- Pending legal text does **not** justify an existing Terms/Privacy control submitting the login form. That interaction is independently testable and fails.
- Prior HELP-002 (in-app legal entry) and HELP-003 (build labels) are retained as **readiness observations**, not current confirmed defect tickets under this clarification. They are not marked fixed or passed.
- Legal approval/compliance, deployed-commit matching and Phase 3 searchable knowledge base/release feeds are not certified.

## Confirmed Help Center bug - Round 1 omission

## HELP-001 - Help Center / Round 1 (omitted from the consolidated report)

### Title

[Help Center / Round 1 omission] Terms of Service and Privacy Policy controls submit the login form instead of performing legal navigation

### Environment

- URL: https://nexstock.stylotech.mu/app/login.
- Environment: **Production**; fresh anonymous session, no stored credentials.
- Browser: Chromium, Playwright 1.62.1, Windows.
- Viewports: desktop **1440 x 1000**; mobile **390 x 844**.
- Reconfirmed: **25 October 2026**, Indian/Mauritius.

### Priority

**P2 / Medium** - existing legal controls cause unrelated authentication validation instead of legal navigation. No unauthorized sign-in or credential transmission is claimed.

### Step-by-step

1. Open https://nexstock.stylotech.mu/app/login in a fresh private browser session.
2. Leave **Email Address** and **Password** empty. Do not press **Sign In**.
3. Click **Terms of Service** below the form.
4. Observe the login form, validation messages, and whether a Terms document or an explicit pending-document message opens.
5. Reload the login page so the form is fresh and both fields are still empty.
6. Click **Privacy Policy**, and observe the same behavior.
7. Repeat at a **390 x 844** viewport. Use normal **Tab** navigation to each legal control, then press **Enter** instead of clicking.

### Expected Result

Activating a legal control must not submit or validate the authentication form and must not require credentials. When the document is ready, it should open the corresponding legal destination. While it is pending, the application should expose an appropriate unavailable/pending state without displaying unrelated login-field errors. Document wording/approval is a separate prerequisite.

### Actual Result

Both controls trigger one login-form submit event and display two **This field is required** messages for the empty Email Address and Password fields. No legal document opens. The observed control is a **BUTTON inside FORM**, with no explicit type and effective type **submit**. Desktop pointer and mobile Tab/Enter activation reproduce the same behavior.

Six recorded activations across the independent checks and integrated-flow repetitions each show this mechanism. Five failed test cases share this one defect:

- Help Center Legal and Compliance integrated flow.
- F30-b public Privacy opens without submitting login.
- F30-b Privacy supports mobile keyboard access and document focus return.
- F30-a public Terms opens without submitting login.
- F30-a Terms supports mobile keyboard access and document focus return.

Document reading, document layout and focus-return assertions were not reached after the failing activation; they are not passed.

### Attachment

- [Privacy - desktop pointer screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-privacy-policy-f99aa-ubmitting-login-phase1-help-chromium-help/attachments/privacy-failure-ec40f61cbf17205b9a2ec138a041827eb6454810.png)
- [Privacy failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-privacy-policy-f99aa-ubmitting-login-phase1-help-chromium-help/error-context.md)
- [Privacy - mobile keyboard screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-privacy-policy-6b27d-nt-focus-return-phase1-help-chromium-help/attachments/privacy-failure-7da09926d4c53fce0e25e0945e665a2f56ec00ac.png)
- [Terms - desktop pointer screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-terms-of-servi-a45ff-ubmitting-login-phase1-help-chromium-help/attachments/terms-failure-4625a8e6ac1f3a2f7ffff6de411150b40f07fc5d.png)
- [Terms failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-terms-of-servi-a45ff-ubmitting-login-phase1-help-chromium-help/error-context.md)
- [Terms - mobile keyboard screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-terms-of-servi-d9e05-nt-focus-return-phase1-help-chromium-help/attachments/terms-failure-d4172ea56de07f2cc49aa2838e17d9ce2a2385d0.png)
- [Final HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/playwright-report/index.html)
- [Safe request journal](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/help-run.json)
- [Reviewed case assessment](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/help-assessment.json)

These are local evidence links. Upload the relevant screenshots/contexts to Trello for sharing; never attach `.env`, `help-auth.json` or private recovery baselines.

### Comment

**Module: Help Center, Legal & Compliance. Round: Phase 1 / Round 1. Reporting label: Round 1 bug omitted from the 24 October consolidated release report.** This issue was originally recorded on 21 October and reconfirmed on 25 October; it is not represented as a newly discovered Round 2 regression.

Group Terms, Privacy, pointer, keyboard and integrated-flow repetitions into one ticket because the same observed submit-button mechanism causes them. The pending Terms document is not itself the bug. No assertion is made that an unadvertised legal URL cannot exist or that the application is legally non-compliant.

Developer action: use a proper navigation link, or an explicit `type="button"` with the correct handler; if legal documents are pending, provide a clear pending state. Do not trigger authentication validation or POST credentials from a legal action. After correction, rerun all four public interaction cases and the full flow; complete readable-document/focus checks once approved documents are delivered.

---

## Automation and tracking corrections - not application bugs

- Added developer-readiness metadata and explicit blocked annotations. Known missing deliverables are not misreported as confirmed product defects; incomplete cases are not turned green.
- Public form-submission detection now fails immediately with HELP-001 after recording button semantics. The full flow continues independent steps and records both the defect and blockers without hiding either.
- Corrected a coverage-data mapping error: Help results had been assigned to dashboard/product IDs by position. Those misplaced fields were restored from their original records, and Help updates now target F30-a/b/c and P1-061/062/063 by ID. A regression unit test protects those mappings. This is not a product or dashboard application defect.
- Read-only request protections remain enabled. Final cleanup passes, **zero unexpected application writes** are recorded, and the QA session is logged out. No policy was edited, agreement accepted, support email sent, or transaction created.
- Local safety/traceability verification: **69 checks passed, 0 failed, 0 skipped**, including regression checks for result classification and Help case-ID mappings.

## Executed cases

| # | Check | Reviewed result |
| --- | --- | --- |
| H01 | authenticate Help suite and select disposable QA company | PASS |
| H02 | Help Center is reachable from app navigation without altering the QA company | PASS |
| H03 | Help Center Legal and Compliance integrated flow | FAIL - HELP-001 |
| H04 | F30-b public Privacy opens without submitting login | FAIL - HELP-001 |
| H05 | F30-b Privacy supports mobile keyboard access and document focus return | FAIL - HELP-001 |
| H06 | F30-b platform Privacy is accessible from authenticated Help Center | BLOCKED |
| H07 | F30-c public login displays NexStock copyright and year | PASS |
| H08 | F30-c active platform version and commit are visible | BLOCKED |
| H09 | F30-a public Terms opens without submitting login | FAIL - HELP-001 |
| H10 | F30-a Terms supports mobile keyboard access and document focus return | FAIL - HELP-001 |
| H11 | F30-a platform Terms is accessible from authenticated Help Center | BLOCKED |
| H12 | verify read-only Help journal and end QA session | PASS |

Final evidence: `blob-report/archive/help-round1-2026-10-25/help-2`. The first continuation run (`help-1`) is preserved; the final run applies the corrected readiness classification. Neither result is a legal/release sign-off.

## Run independently or as the full module

```powershell
node scripts/run-release-retest.mjs help
node scripts/assess-help-run.mjs blob-report/archive/help-round1-2026-10-25/help-2
npm.cmd run test:help -- --headed
```

The isolated runner creates the next `help-N` folder. Pass that actual folder to the assessment command. Independent scripts remain available through `test:help:terms`, `test:help:privacy`, `test:help:version` and `test:help:flow`; setup and cleanup are required. Phase 1 Help automation is exercised, but final acceptance remains blocked until the interaction bug is fixed and the legal/release prerequisites are delivered.

