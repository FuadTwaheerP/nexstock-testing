# Customers & Accounts Receivable — Phase 1

Four independent feature specs and one integrated flow. Every invocation includes login/business selection and cleanup; no dependency on running another module's suite first. Existing QA catalogue data is needed by draft invoice/quotation history checks. Those fixtures do not certify the wider Invoicing/Quotations modules.

| Submodule | Command | Coverage |
| --- | --- | --- |
| Add Customer (F19-a) | `npm run test:customers:add` | Individual/Business persistence, contact/address, separate BRN/VAT, required name/email format, cancellation |
| Edit / Archive (F19-b) | `npm run test:customers:edit` | Updates, optional-field clearing, inactive/reactivate, status filter, active invoice picker, historical draft retention |
| Balances & Statements (F19-c) | `npm run test:customers:balances` | Customer outstanding balance, statement entry point, aging availability, independent non-zero reconciliation |
| Purchase History (F19-d) | `npm run test:customers:history` | Fresh-account baseline, saved draft invoice/history isolation, saved quotation history, read-only seeded POS receipt |
| Integrated lifecycle | `npm run test:customers:flow` | Same customer created, edited, inspected for AR/history, invoice/quotation drafts attempted, retained inactive |

Run everything visually, in a maximized Chromium window:

```powershell
npm run test:customers -- --headed
npm run report
```

Headless: `npm run test:customers`. Interactive inspector for an individual submodule: `npm run test:customers:add -- --debug`.

## Safety and data

Use the existing ignored `.env`: BASE_URL, allowlisted origin, PRODUCT_TEST_EMAIL/PASSWORD, PRODUCT_TEST_ACCOUNT_DISPOSABLE, ALLOW_WRITES, and the explicit production opt-in must already be configured. CUSTOMER_TEST_COMPANY defaults to PRODUCT_TEST_COMPANY / Nexstock QA Company. Credentials/storage state must never be committed.

Fixtures use unique `QA CUST` names and `example.invalid` addresses. The suite checks the selected company, never clicks Delete, never dispatches email, issues an invoice, records a payment or completes a POS sale. Customers remain inactive, with any saved draft/history retained. Fixture journal: `test-results/customers-fixtures.json`. Teardown verifies inactivity and attaches a screenshot.

Do not run multiple Customer suite processes concurrently: authentication state and the journal are per-suite shared files, as with the previous module suites.

The integrated flow uses soft assertions for missing capabilities so later stages are still exercised. A failed invoice-history prerequisite is recorded as a failure; it does not silently pass retention. There are no skip/fixme/expected-failure annotations. A failed assertion is not automatically a confirmed application bug: inspect its evidence and classify it.

## Non-zero AR fixture (read-only)

Inspection on 19 October 2026 found two pre-existing QA customers with zero purchases, an empty invoice register and an empty quotation register. No pre-existing partially paid/overdue account or populated customer purchase history was available. The reconciliation and POS-history tests fail explicitly as TEST DATA BLOCKER unless independently verified QA records are supplied through CUSTOMER_AR_SEED_PATH. These failures are **not application bugs**. Do not invent transactions or expected amounts from the screen being tested. A dedicated POS/quotation tab is not mandatory: unified history is acceptable if actual expected records are present.

Example schema (reference values below are illustrative, not real fixture IDs):

```json
{
  "company": "Nexstock QA Company",
  "name": "QA AR Seed Customer",
  "email": "qa.ar.seed@example.invalid",
  "invoiceReference": "INV-actual-reference",
  "paymentReference": "actual-receipt-reference",
  "posReference": "actual-QA-POS-receipt-reference",
  "invoiceAmount": 200,
  "paymentAmount": 50,
  "expectedOutstanding": 150,
  "dueDate": "2026-10-01",
  "agingBucket": "1-30 days"
}
```

The seed must belong to the configured disposable business and have no other open balances. Keep dates/bucket current for the execution date. This checks one overdue bucket, not all aging boundary transitions. It is read-only and is never deactivated by cleanup. No actual payment is performed by this suite.

## Coverage limitations

Empty history checks do not certify populated POS/quotation history, issued/paid invoice reconciliation, multi-bucket aging boundaries, statement export contents or archive retention of completed sales. Draft history is not a paid-sale history test. Missing UI capabilities and any upstream document-save failures must be repaired before those downstream paths can be verified. Phase 3 groups/tiers and credit-limit blocking are excluded.

The flow is an integrated attempt across the currently exposed module, not a declaration that all financial requirements passed. See root `customers-failure-tickets.md` and the latest HTML report for evidence-backed results and blockers.

## Verification — 19 October 2026

- Complete suite: 22 total, 12 passed, 10 failed, zero skipped/runner errors; authentication and cleanup passed. This is not ten distinct application bugs.
- Twenty functional tests: ten passed and ten failed. The register deliberately remains partially verified.
- Final targeted integrated-flow recheck confirms the corrected customer loading; remaining failures are fiscal-identity gaps, provisional empty-account AR observations and document-save prerequisites. The original complete HTML report is preserved; separate recheck artifacts are under `test-results/customers-flow-recheck/`.
- Twelve safety guard unit tests pass. Customer specs are excluded from generic cross-browser smoke projects to avoid accidental repeated production mutations.
- Saved fixtures remain inactive. Final cleanup verifies their persisted status and saves proof with the Status field visible.
