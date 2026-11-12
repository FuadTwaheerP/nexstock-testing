# Customers & Accounts Receivable — Findings

Environment: production `https://nexstock.stylotech.mu/app`, disposable **Nexstock QA Company**, desktop Chromium. Date: **19 October 2026 (Mauritius, UTC+4)**. Only synthetic customers and draft documents are permitted in this suite; no real payment, email dispatch or permanent deletion is performed.

Latest complete run: **22 tests — 12 passed, 10 failed, 0 skipped, 0 runner errors**, approximately **6 minutes 29 seconds**. This includes passing authentication and final cleanup; the twenty functional tests are split ten passed / ten failed. Saved fixtures are retained inactive. These ten failures do **not** represent ten distinct confirmed application bugs.

Report review: **19 October 2026 (Mauritius)**. The newest complete HTML/JUnit report found is dated **19:28:56**; no newer full execution was found. This review did not start another production test run or modify the test scripts. The one stale-picker automation subfailure in that report is already corrected in the current helper: fresh form navigation and awaiting the customer-list response. The existing **19:30:18** flow recheck confirms that correction. No additional automation error was identified from the other nine failed cases and their available evidence.

| # | Failed test | Review classification |
| --- | --- | --- |
| 1 | Corporate BRN and VAT identifiers | CUST-001 — confirmed identity-form requirement gap |
| 2 | Integrated Customers / AR lifecycle | Duplicate fiscal/UI/document findings; also contains the already-corrected picker timeout in the older full report. Use the later recheck for current behavior. |
| 3 | Clear optional company, phone and address | CUST-003 — one confirmed application issue, three independently failing field assertions |
| 4 | Inactive customer retains historical draft | INV-001 — invoice creation fails first; archive/history retention is not proven broken |
| 5 | Customer-specific outstanding balance | OBS-AR-001 — unconfirmed empty-state UI observation |
| 6 | Customer aging buckets | OBS-AR-001 — same unconfirmed empty-state observation, not a second financial bug |
| 7 | Seeded invoice/payment/overdue reconciliation | Missing verified non-zero QA ledger — test-data blocker, not an application bug |
| 8 | Saved invoice history scoped to its customer | INV-001 again — duplicate invoice-save blocker; isolation assertion never reached |
| 9 | Existing QA POS receipt in customer history | Missing verified POS receipt/customer seed — test-data blocker, not an application bug |
| 10 | Saved quotation in customer history | QUO-001 — observed quotation-save failure; quotation-history assertion never reached |

There are **four reproducible findings to triage below**: two customer issues, the existing invoice-save issue, and the quotation-save issue. This is not proof of four independent backend causes. Keep the two document-save symptoms linked, but do not assume they share a cause solely because both display Server Error. Do not log the two data blockers or provisional AR observations as confirmed application bugs.

Passing checks include Individual/Business persistence, supported profile updates, name/email validation, cancelled creation, deactivation/reactivation/status filtering, active/inactive and later-sorting invoice-customer selection, empty history/zero spend and explicit empty-export feedback. None of these certify non-zero receivables, populated statement contents or retention of completed sales.

Final targeted full-flow recheck: **one failed test, approximately 1 minute 6 seconds**. It reached the archive/retained-account stage and no longer contains the stale-picker timeout. Its remaining assertions concern missing BRN/VAT, provisional empty-account AR labels and actual invoice/quotation Server Error notifications. Evidence: `test-results/customers-flow-recheck/phase1-customers-customers-7e2ee--balances-archive-lifecycle-chromium-customers/error-context.md`. The complete HTML/JUnit report above was preserved rather than overwritten by this targeted diagnostic run.

## Confirmed customer application findings

## CUST-001 — Customer BRN and VAT identity fields unavailable

### Title

Customers — Business registration and VAT numbers cannot be entered through the customer identity form

### Environment

Production → Customers → New Customer / Edit Profile; Nexstock QA Company; Chromium; 19 October 2026. Requirement **F19-a**: individual/corporate entity, BRN, VAT number, contacts and address.

### Priority

Medium — required customer fiscal identity cannot be maintained in the standard workflow.

### Step-by-step

1. Sign in using the disposable QA administrator and select Nexstock QA Company.
2. Open Customers → New Customer.
3. Select **Business** in Type.
4. Inspect the fields and attempt to enter a separate business registration number and VAT registration number.
5. Observe that the form provides Customer Name, Company Name, Email, Phone Number, Type, Status and Billing Address, but neither fiscal identifier.
6. Cancel the unsaved form.
7. Open an existing synthetic QA customer's action menu → Edit, or View Details → Edit Profile.
8. Inspect the available identity fields again.

### Expected Result

The required BRN and VAT identifiers can be entered independently for a corporate customer, saved, reopened and maintained without overwriting contact/address data. This ticket does not impose an unconfirmed mandatory/optional rule or assume specific tax-number validation.

### Actual Result

Neither native identifier is exposed in the inspected Add/Edit Customer forms. The dedicated check and integrated flow fail at missing-field assertions, before identifier persistence can be verified. General Individual/Business creation and supported contact/address persistence are tested separately.

### Attachment

- `test-results/phase1-customers-add-custo-ac526-e-separate-persisted-fields-chromium-customers/test-failed-1.png`.
- Same directory: `error-context.md`, showing all available form fields.
- HTML report: `playwright-report/index.html` → **F19-a corporate BRN and VAT identifiers are separate persisted fields**.
- Integrated lifecycle contains the same missing-field assertions, not additional bugs.

### Comment

Group BRN and VAT form omissions as one customer fiscal-identity ticket. BRN overlaps the existing **INV-002** finding in `invoicing-failure-tickets.md`; link the same developer issue instead of opening a duplicate BRN ticket. The generic Custom Fields section on a saved profile does not expose typed fiscal identity on the Add/Edit form; this ticket does not claim generic custom text can never store such strings.

---

## CUST-003 — Cleared optional customer fields are restored after saving

### Title

Customers — Removing saved Company Name, Phone Number and Billing Address does not persist

### Environment

Production → Customers → Edit; Nexstock QA Company; Chromium; 19 October 2026. Requirement **F19-b**: update customer information.

### Priority

Medium — users cannot remove stale optional company/contact/address information.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Create a uniquely named synthetic QA customer with valid reserved email, Company Name, Phone Number and Billing Address.
3. Save, navigate away and reopen the customer through Edit.
4. Clear Company Name, Phone Number and Billing Address; keep the required name and email valid.
5. Verify the three inputs are blank before submitting Save Changes.
6. Wait for the save request to complete.
7. Reload the customer list and reopen Edit.
8. Inspect each of the three fields and retain the QA customer as Inactive after reproduction.

### Expected Result

Clearing optional company, phone and billing address values is retained after a successful save and fresh navigation; old values must not silently reappear.

### Actual Result

The reopened fields contain their previous values instead of blanks: `QA Customer Business …`, `+23051234567`, and `QA Test Building, Ebene, Mauritius 72201`. Three independent soft assertions fail after fresh navigation. The actual UI-triggered edit request is `PUT /app/api/v1/customers/26`, returns HTTP 200, and omits `company`, `phone` and `address` entirely when those inputs are cleared. The create and later cleanup requests are separate attachments; they are not the blank-field edit request.

### Attachment

- `test-results/phase1-customers-edit-arch-1b55e-l-company-phone-and-address-chromium-customers/error-context.md`.
- Same directory: `test-failed-1.png`.
- HTML report → **F19-b clear optional company phone and address** → `customer-save-responses` attachment records the actual UI-triggered write, not an injected API request.

### Comment

Inputs are checked before save; the initial list load and save response are awaited, then fresh navigation/reopen verifies persistence. This is not the earlier supplier search race. The omitted edit fields were verified directly in the embedded HTML report's `customer-save-responses` attachment. Group the three cleared-field failures as one ticket. The request omission is observed evidence, not proof that the backend alone is responsible.

---

## Confirmed upstream application failures — linked to customer coverage

## INV-001 — Valid draft invoice cannot be saved (existing issue)

### Title

Invoicing — Saving a valid QA draft invoice returns Failed to create invoice / Server Error

### Environment

Production → Invoices → New Invoice (`/app/create-invoice`); Nexstock QA Company; Chromium; 19 October 2026. Prerequisite for **F19-b historical retention** and **F19-d populated invoice history**.

### Priority

High — document persistence prevents dependent history and receivables verification.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Create an active synthetic QA customer using a reserved `example.invalid` email.
3. Open Invoices → New Invoice and select that customer.
4. Add the existing QA-prefixed product that has ten units available; do not select a real product.
5. Set quantity to 1, unit price to Rs200, invoice date to today and due date thirty days later.
6. Choose Save Invoice → Save as Draft. Do not dispatch email, issue the document or take payment.
7. Observe the notification and whether the form returns to the register with a saved reference.
8. Check whether a new invoice reference exists in the register and under the customer.
9. Retain the customer inactive after reproduction; do not delete any fiscal records.

### Expected Result

A valid draft persists with a unique reference and becomes available under its linked customer. Only then can history isolation or archival retention be evaluated.

### Actual Result

The UI reports **Failed to create invoice / Server Error** and remains on the creation form. The valid QA input shown in the report is quantity 1 at Rs200, zero discount/tax, total Rs200, invoice date 19 October and due date 18 November 2026; the selected QA item shows ten units in stock. No saved reference is available. Invoice-history isolation and historical archival retention are blocked before their substantive assertions.

### Attachment

- `test-results/phase1-customers-purchase--8e993-y-is-scoped-to-its-customer-chromium-customers/test-failed-1.png` shows the failed invoice form and error notification.
- Same directory: `error-context.md` records the input values and Server Error text.
- `test-results/phase1-customers-edit-arch-8f218-ts-historical-draft-invoice-chromium-customers/error-context.md` is the duplicate historical-retention prerequisite failure.
- `test-results/customers-flow-recheck/phase1-customers-customers-7e2ee--balances-archive-lifecycle-chromium-customers/error-context.md` reconfirms invoice save failure after the picker correction. The older full-flow picker timeout is not the invoice application evidence.
- HTML report: `playwright-report/index.html`.

### Comment

This reconfirms existing **INV-001** in `invoicing-failure-tickets.md`; update/link that ticket rather than opening duplicate invoice-history or archive-retention tickets. **No missing customer transaction, wrong history total or broken archive retention is proven by a failed document save.** The related quotation symptom is documented separately below because its shared root cause has not been established.

---

## QUO-001 — Valid draft quotation cannot be saved

### Title

Quotations — Saving a valid QA draft returns Failed to create quotation / Server Error

### Environment

Production → Quotations → New Quotation (`/app/create-quotation`); Nexstock QA Company; Chromium; 19 October 2026. Prerequisite for **F19-d customer quotation history**. This does not claim that the complete Phase 2 Quotations module has been tested.

### Priority

High — quotation persistence is blocked and customer quotation-history verification cannot proceed.

### Step-by-step

1. Sign in using the disposable QA administrator and select Nexstock QA Company.
2. Create an active synthetic QA customer with a unique name and reserved `example.invalid` email.
3. Open Quotations → New Quotation and select that customer.
4. Add the existing QA-prefixed product showing ten units available.
5. Set quantity to 1 and unit price to Rs200; leave discount at zero. In the reported company configuration, tax is zero and total is Rs200.
6. Set Issue Date to today and Due Date to thirty days later. The reported run used 19 October and 18 November 2026.
7. Choose Save Quotation → Save as Draft. Do not choose Save & Dispatch Email or Mark Accepted & Save.
8. Observe the notifications, then check whether a saved reference is available in the quotation register.
9. Retain the synthetic customer inactive after reproduction; do not delete historical records.

### Expected Result

The valid draft quotation saves once with a unique reference and the entered customer, dates, item and total. Its saved reference can then be checked in customer history.

### Actual Result

The UI reports **Failed to create quotation / Server Error** and remains on New Quotation instead of returning to the register with a saved reference. The failure context shows the selected QA customer, valid date order, quantity 1, price Rs200 and total Rs200. Customer quotation-history visibility cannot be evaluated because creation failed first.

### Attachment

- `test-results/phase1-customers-purchase--4ccc2-appears-in-customer-history-chromium-customers/test-failed-1.png`.
- Same directory: `error-context.md`, containing the selected customer, item, dates, amounts and application error.
- `test-results/customers-flow-recheck/phase1-customers-customers-7e2ee--balances-archive-lifecycle-chromium-customers/error-context.md` reconfirms the quotation-save failure.
- HTML report: `playwright-report/index.html` → **F19-d saved QA quotation appears in customer history**.

### Comment

Link to INV-001 for investigation of the related invoice-save symptom, but do not assert that identical notification text proves an identical backend cause. The dedicated and integrated quotation failures are duplicates of this same observed capability failure, not separate history bugs. If the developer establishes a common cause with INV-001, consolidate these linked tickets then. No quotation-history defect is confirmed by this failed prerequisite.

---

## Unconfirmed requirements/UI observations — not confirmed financial bugs

## OBS-AR-001 — Empty customer profile exposes no balance or aging view

### Title

Customers / AR — Verify balance, statement and aging behavior using a populated QA account

### Environment

Production → Customers → View Details; Nexstock QA Company; Chromium; 19 October 2026. Requirement **F19-c**: customer statement of account and aging balance tracking. This is basic customer AR, not the separate Phase 3 analytical reporting feature.

### Priority

Pending verification — do not log as a confirmed calculation defect from an empty account.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Create a uniquely named synthetic QA customer with a reserved `example.invalid` email, or open an existing QA customer.
3. Choose the customer action menu → View Details.
4. Inspect the summary: Total Spent, Invoices Count, Average Invoice Value and Last Purchase.
5. Attempt to view that customer's outstanding balance or balance due.
6. Attempt to open a statement of account and inspect current/overdue aging information.
7. On a customer with no invoices, click the generic Export button and observe **No invoices available to export.**
8. Retain any newly created QA customer as Inactive after reproduction; do not click Delete.

### Expected Result

F19-c requires a customer balance/statement and basic aging. The current UI checks look for these on an empty account, but the requirement does not explicitly define their zero-account presentation or require a particular control name. A populated independent QA ledger is needed for functional sign-off.

### Actual Result

The inspected empty customer profile exposes spend/invoice metrics and an invoice transaction panel, but no visible outstanding-balance display, specifically named statement entry point or aging view. Generic Export reports that no invoices are available. This is an observed empty-state UI gap; without a populated ledger it does not establish that non-zero AR or statement export is absent or incorrect.

### Attachment

- HTML report: `playwright-report/index.html` → the customer-specific outstanding balance and aging bucket tests in `outstanding-balances-statements.ui.spec.ts`.
- Their failure screenshots and `error-context.md` show the empty customer account controls. The separate empty export check passes and does not certify statement content.

### Comment

Keep this observation separate from confirmed bugs. **No incorrect balance calculation or absent populated-account statement has been proven.** The separate invoice-200/payment-50/outstanding-150 check requires a verified non-zero QA ledger and remains a test-data blocker. Confirm whether these controls are conditional on transactions before filing a functional AR defect. The absence of specifically named tabs/buttons alone is not proof that the requirement is unsupported.

---

## Corrected automation issues — do not file application tickets

- Customer search filters client-side; waiting for a nonexistent server search response was removed after a read-only transport probe.
- Required-name validation uses application feedback, not an HTML `required` attribute.
- Invoice line items are card containers, not table rows.
- Status and metric locators now follow actual text nodes/casing. Aging matching is anchored so a QA customer's name containing the word “aging” cannot create a false pass.
- A separately named statement button, POS tab or quotation tab is not prescribed by the requirement. Generic Export's empty feedback and actual saved/seeded references are checked instead; unified history is acceptable.
- Invoice/quotation fixture setup now loads the observed form route fresh and awaits the customer-list response before selection. The active-selection positive control and late-sorting test pass after this correction. Earlier incomplete/stale picker snapshots are not proof of an application pagination or inactive-selection bug.

## Test-data and coverage blockers — not bug tickets

The initial QA company had two existing customers with zero purchases, zero invoices and zero quotations. There was no verified partially paid/overdue ledger or customer-linked POS receipt to reuse. CUSTOMER_AR_SEED_PATH is a documented read-only fixture contract, not invented financial data. Its two unconfigured checks fail normally and are never marked skipped or expected failures.

Draft invoice/quotation saves fail before saved references exist, so the suite cannot establish populated history isolation, quotation history visibility or archive retention of historical sales. No real payment, email dispatch or permanent deletion is used to work around those blockers. Phase 3 customer tiers and strict credit-limit blocking remain excluded.
