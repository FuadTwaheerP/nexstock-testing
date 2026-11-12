# Invoicing & Commercial Sales Billing — Findings

Environment: production `https://nexstock.stylotech.mu/app`, disposable **Nexstock QA Company**, desktop Chromium. Inspection and automation: 17–18 October 2026 (Mauritius). Findings below are grouped by observed cause; downstream blocked tests are not separate proven bugs. No real payment or email dispatch was performed.

Latest reviewed run: **18 October 2026, 03:16 Mauritius time**, approximately 5.3 minutes. **26 functional tests: 4 passed, 22 failed, 0 skipped**. Setup and final cleanup passed separately (28 including lifecycle projects: 6 passed, 22 failed). Fifteen functional tests report the creation blocker, four fail at missing term controls, one at customer BRN, one at clearing saved branding, and one at missing date-chronology validation. The full-flow case also records missing Net 30 as a secondary soft failure. The chronology check requires retest after valid creation works and is not a fifth proven persistence defect.

Review outcome: no automation-caused failure was identified in this run. No scripts were changed and no new production test run was initiated for this review. The report, failure contexts, available screenshots and selectors were checked; attachment paths below exist in the latest report artifacts. Missing BRN/terms are requirement discrepancies, while save failure and branding-clear persistence are observed behavioral failures. Proposed priorities remain subject to developer triage.

## INV-001 — Valid invoices cannot be saved

### Title

Invoicing — Saving a valid QA invoice returns Failed to create invoice / Server Error

### Environment

- Production: `/app/create-invoice`, reached from Invoices → New Invoice.
- Workspace: Nexstock QA Company.
- Customer: QA Billing Automation Customer (`qa.billing.customer@example.invalid`).
- Product: QA add mv9rtxw1-3b087e, SKU `QA-ADD-mv9rtxw1-3b087e`.
- QA branch stock was seeded to 100 units; the failure is not limited to the earlier out-of-stock inspection attempt.

### Priority

High — invoice persistence blocks billing and dependent payment/document workflows.

### Step-by-step

1. Log in with the disposable QA administrator and select Nexstock QA Company.
2. Ensure the named QA product has at least two units in the default QA branch.
3. Open **Invoices → New Invoice**.
4. Select QA Billing Automation Customer.
5. Set Invoice Date to today and Due Date to 15 days later.
6. Add a row and select the QA product.
7. Set Quantity to `2` and Unit Price to `100`.
8. With company VAT disabled, confirm Grand Total Due is Rs200.00.
9. Open **Save Invoice → Save as Draft**.
10. Observe the notifications; return to the list and reload to check persistence.
11. Repeat with **Mark Paid & Save** only in the disposable QA company; this records test data and must not initiate any real payment.

### Expected Result

A valid invoice is persisted once with a unique reference, correct customer/dates/lines/total and selected document/payment state. The record remains available after reload.

### Actual Result

The application displays **Failed to create invoice** and **Server Error** and remains on the creation form. No saved reference is returned and the suite's created-reference journal remains empty. Draft and paid-save paths both fail. The configured-15%-VAT attempt reaches Rs230.00 in the editor but also fails to save.

### Attachment

- `test-results/phase1-invoicing-create-ta-c4f2e-ter-reload-phase1-invoicing-chromium-invoicing/test-failed-1.png`
- Same directory: `error-context.md`.
- Paid-save evidence: `test-results/phase1-invoicing-create-ta-10e50-d-and-Save-phase1-invoicing-chromium-invoicing/test-failed-1.png`.
- HTML report: `playwright-report/index.html`.

### Comment

The backend cause has not been established; the observed error text is not proof of a particular database or API defect. Do not create separate payment, lifecycle, numbering, PDF or printing tickets from checks stopped at this save failure. Their later assertions did not execute. Tests remain ordinary failures, not intentional skips. Stock and temporary company settings are restored by teardown.

## INV-002 — Customer BRN unavailable

### Title

Invoicing — No customer business-registration number can be supplied or reviewed

### Environment

Production `/app/create-invoice`, Nexstock QA Company, Chromium; requirement **F12-a**: customer BRN and VAT specifications.

### Priority

Medium — required business-customer fiscal identity is unavailable in the inspected workflow.

### Step-by-step

1. Open **Customers → New Customer** in the disposable company and inspect available identity fields; cancel without creating an extra record.
2. Open **Invoices → New Invoice**.
3. Select QA Billing Automation Customer and inspect its invoice identity section.
4. Add a QA product and inspect the rest of the invoice form for Customer BRN / Business Registration Number.
5. Attempt to supply or review the customer's BRN for this invoice.

### Expected Result

The customer's BRN can be maintained/selected and included as fiscal invoice identity. A particular textbox location is not mandatory if the identity is supplied through the customer record.

### Actual Result

The inspected customer form exposes name, company, email, phone, type, status and billing address but no BRN. The invoice form exposes the customer account and dates but no BRN entry or identity display. No way to supply/review the required customer BRN was found.

### Attachment

`test-results/phase1-invoicing-create-ta-ec216-e-identity-phase1-invoicing-chromium-invoicing/test-failed-1.png`

### Comment

This is a discrepancy against the supplied requirement, not a legal-compliance certification or proof about backend BRN storage. Saved-document/PDF identity cannot be verified until INV-001 is fixed.

## INV-003 — Commercial payment terms unavailable

### Title

Invoicing — Due on receipt and Net 15/30/60 terms cannot be selected

### Environment

Production `/app/create-invoice`, Nexstock QA Company, Chromium; requirement **F12-c**.

### Priority

Medium — commercial payment terms require manual due-date calculation.

### Step-by-step

1. Open **Invoices → New Invoice** and select the disposable QA customer.
2. Set Invoice Date to `2026-01-31`.
3. Add a QA invoice item.
4. Look for Payment Terms / Commercial Terms or preset Due on receipt, Net 15, Net 30 and Net 60 controls.
5. Attempt to select each term and check the derived Due Date.

### Expected Result

The requested term is selectable and derives the correct calendar-day due date: 2026-01-31, 2026-02-15, 2026-03-02 and 2026-04-01 respectively.

### Actual Result

The form provides only manual Invoice Date and Due Date inputs. The required term controls/presets are absent, so all four term checks stop before calculated-date assertions.

### Attachment

- Due on receipt: `test-results/phase1-invoicing-due-dates-e7a59-h-boundary-phase1-invoicing-chromium-invoicing/test-failed-1.png`.
- Net 15: `test-results/phase1-invoicing-due-dates-a170a-h-boundary-phase1-invoicing-chromium-invoicing/test-failed-1.png`.
- Net 30: `test-results/phase1-invoicing-due-dates-85482-h-boundary-phase1-invoicing-chromium-invoicing/test-failed-1.png`.
- Net 60: `test-results/phase1-invoicing-due-dates-f4225-h-boundary-phase1-invoicing-chromium-invoicing/test-failed-1.png`.

Each directory also contains `error-context.md`.

### Comment

Manual dates can be entered, but persistence is blocked by INV-001. The suite also checks due-before-issue validation; if that produces the same generic server error, it is recorded as a validation gap needing retest, not proof that an invalid invoice was saved. No separate chronology/persistence bug is inferred from that blocked result.

## INV-004 — Invoice branding cannot be cleared

### Title

Settings / Invoicing — Clearing saved invoice header/footer reports success but restores the old text after reload

### Environment

Production `/app/settings` → Company → Tax & Invoicing → Invoice Customisation, Nexstock QA Company, Chromium; discovered during F12-e fixture cleanup.

### Priority

Medium — obsolete invoice text/payment instructions cannot be removed through the inspected UI.

### Step-by-step

1. In the disposable QA company only, save a recognizable invoice header and footer.
2. Reload Settings and verify the text persisted.
3. Clear both **Invoice Header** and **Invoice Footer** to empty strings.
4. Click **Save Settings** and observe the success notification.
5. Reload Settings.
6. Optionally inspect **Reset to Default**; in the observed run it did not clear the old text either.
7. Restore the original nonempty text after reproduction. If the original was empty, note that exact restoration is affected by this issue.

### Expected Result

Removing optional invoice text should persist empty values. A successful save must not bring back obsolete banking instructions or branding.

### Actual Result

The UI reports **Tax settings saved successfully!**. After reload, the previous nonempty header and footer return. Empty and whitespace-only saves both failed to clear them. Nonempty replacement values do persist.

### Attachment

The test **can clear previously saved invoice header and payment instructions** includes a `saved-branding-after-clear` screenshot captured after reload, before fixture restoration. See its entry in `playwright-report/index.html` and `test-results/phase1-invoicing-branded-p-e3ecd-structions-phase1-invoicing-chromium-invoicing/error-context.md`.

### Comment

The first run's exact-empty branding cleanup failed on this behavior; it was not silently marked successful. To remove all fake bank text, the disposable company now uses neutral **No invoice header configured** / **No payment instructions configured** values. The updated suite restores those baseline values exactly and retains a dedicated failing clear-persistence regression. Stock and VAT restoration are separate checks. This finding does not establish whether the empty values are discarded by the frontend or backend.

## Rerun and evidence retention

### Date-chronology validation observation — retest / triage

The test **rejects a due date earlier than the issue date** uses Invoice Date `2026-10-18` and Due Date `2026-10-17`, with the QA customer and two units at Rs100. Saving produces the same generic **Failed to create invoice / Server Error** rather than a due-date-specific validation message. No invalid invoice was observed to persist. This does not prove an independent acceptance/persistence defect; retest after INV-001 is fixed before creating a separate ticket.

Evidence: `test-results/phase1-invoicing-due-dates-d488e-issue-date-phase1-invoicing-chromium-invoicing/error-context.md`. Its call log records the generic error even though the toast had disappeared by the final screenshot.

Run all submodules: `npm run test:invoicing`. Visible maximized run: `npm run test:invoicing -- --headed`. View report: `npm run report`. Standard report/screenshots are replaced on a new run, so copy attachments before filing tickets.

After INV-001 is fixed, rerun and validate saved-record/detail/payment/export selectors against the newly accessible UI. Invoice creation, sequencing, installments, balances, lifecycle, overdue state, cancellation retention, PDF content/layout and print must not be signed off from this blocked run.
