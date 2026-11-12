# Invoicing & Commercial Sales Billing — Phase 1

Five independently runnable submodule specs and a separate full-flow spec. Every command authenticates, selects the configured disposable company, prepares its own fixtures, and runs cleanup. No intentional skips or expected-failure annotations.

| Requirement | Spec | Scripted checks |
|---|---|---|
| F12-a Create Tax Invoice | `create-tax-invoice.ui.spec.ts` | Line arithmetic/discount, required customer/items/due date, saved draft/reference, customer BRN, record-only paid save, configured 15% VAT |
| F12-b Installment & Partial Payments | `installment-partial-payments.ui.spec.ts` | Deposit 50 on invoice 200, remaining 150, reload, zero/negative payment rejection |
| F12-c Due Dates & Commercial Terms | `due-dates-payment-terms.ui.spec.ts` | Due on receipt, Net 15/30/60 across month boundary, manual due date persistence, invalid chronology |
| F12-d Invoice Lifecycle | `invoice-lifecycle.ui.spec.ts` | Draft → unpaid → partial → paid; past-due detection; cancellation retention; increasing references without cancelled-number reuse |
| F12-e Branded PDF Export & Print | `branded-pdf-print.ui.spec.ts` | Branding clear/save persistence, PDF integrity and extracted content, company/customer/product/reference/amount, configured banking instructions/notes, browser print invocation |
| Full flow | `invoicing-full-flow.ui.spec.ts` | Net 30 tax invoice → issue → 50 deposit → settle 180 → branded PDF → print |

## Run

```powershell
npm run test:invoicing
npm run test:invoicing -- --headed
npm run report
```

Independent submodules:

```powershell
npm run test:invoicing:create
npm run test:invoicing:payments
npm run test:invoicing:terms
npm run test:invoicing:lifecycle
npm run test:invoicing:export
npm run test:invoicing:flow
```

Headed Chromium starts maximized with `viewport: null` and no incompatible device-scale setting. One worker/no retries prevent concurrent financial fixture mutations. There are 26 functional tests plus setup and cleanup.

## Fixtures and safety

- Reuses the existing disposable-account credentials and explicit production mutation opt-ins from `.env`; no credentials are embedded in specs.
- Uses **QA Billing Automation Customer**, `qa.billing.customer@example.invalid`, a fake billing address, and a QA-prefixed simple catalog product. Optional `INVOICE_TEST_COMPANY`, `INVOICE_TEST_SKU`, `INVOICE_TEST_BRANCH` select fixtures.
- Seeds the selected QA branch up to 100 units, records both branch baselines before mutation, and compensates back in teardown. The baseline also captures VAT and invoice header/footer, which teardown restores and verifies.
- Taxes are temporarily disabled for deterministic Rs200 invoices. The tax/full-flow tests separately enable 15% VAT and restore it in `finally`. Branded-export checks use an obviously fake QA bank/account in invoice header/footer and restore the prior values.
- Customer and created invoice/payment records remain as test evidence. Stock compensation is not a refund, cancellation, or accounting reversal. Only records created by this suite are eligible for its cancellation tests; no invoice deletion is attempted.
- Payments are internal test-record entries, not real transfers or processor charges. **Save & Dispatch Email is explicitly refused by the helper.** No real customer emails, bank details or payment-provider credentials are used.
- HTTP diagnostics attach only invoice mutation method/path/status, never auth headers or response bodies.
- Browser printing is instrumented to avoid sending paper. Physical printer output, PDF pagination/layout, and actual print-dialog interaction require separate visual/hardware verification.

PDF content checking uses Python `pypdf`. The helper uses the verified Codex bundled Python if present; otherwise `PDF_PYTHON` or `python`. On another machine, set `PDF_PYTHON` to a Python interpreter with `pypdf` installed. Header/EOF checks are followed by actual PDF parsing, not just a `.pdf` filename assertion. No PDF layout is certified from extracted text.

## Blockers and coverage limits

A saved invoice is required before installments, lifecycle changes, numbering persistence, PDF download and print can be tested. If creation fails, each dependent test remains an ordinary failure with the original application error; it is not skipped or reported as a separate proven downstream defect.

The creation form and validation selectors were inspected against the live UI. Invoice-detail, payment, cancellation, PDF and print actions are provisional requirement-oriented adapters until a saved record is available; their locators and downstream assertions must be validated after the creation blocker is fixed. This is scripted coverage, not a claim that those paths have executed successfully.

The full-flow terms assertion is soft so other available checks can continue. Missing terms still fail the test; no manual-date fallback is counted as a passing Net 30 requirement.

Out of scope: Phase 3 recurrence, multiple currencies and automated reminders; real fiscal/legal certification, settlement, other-role permissions, backend idempotency, and customer credit/overpayment policies not specified by the current requirements.

### Branding cleanup limitation discovered during first run

Saving an empty/whitespace invoice header/footer reports success but reload brings back the old text; Reset to Default also did not clear it. The initial empty values therefore could not be restored exactly through this UI. All fake bank text was removed by saving **No invoice header configured** / **No payment instructions configured** in the disposable company. The regression test explicitly checks empty-value persistence and fails while the application issue remains. Subsequent runs restore these neutral baseline values exactly; they do not silently treat them as equivalent to empty strings.

## Verified execution — 18 October 2026

**26 functional tests: 4 passed, 22 failed, 0 skipped.** Authentication/fixture setup and final stock/VAT/branding cleanup also passed (28 tests including lifecycle projects: 6 passed, 22 failed). Runtime was approximately 9.3 minutes. The separate safety-guard suite passed all 12 tests.

| Spec | Passed | Failed | Interpretation |
|---|---:|---:|---|
| Create Tax Invoice | 4 | 4 | Editor quantity/price/discount arithmetic and three required-field validations pass. BRN is unavailable; draft, paid and 15%-VAT persistence fail. |
| Installments & Partial Payments | 0 | 3 | All stop at invoice creation; no payment or balance assertion reached. |
| Due Dates & Terms | 0 | 6 | Four term controls absent; manual date persistence blocked; invalid chronology shows generic server error rather than date validation. |
| Invoice Lifecycle | 0 | 4 | All stop at creation; no transition, overdue, cancellation or sequencing assertion reached. |
| Branded PDF & Print | 0 | 4 | Clear-branding persistence fails; three PDF/print paths stop at creation. |
| Full flow | 0 | 1 | Missing Net 30 control and failed invoice save; 15% VAT editor arithmetic reached before blocking. |

The 22 failures are not 22 distinct defects. See [four grouped findings](../../../invoicing-failure-tickets.md). A due-before-issue validation gap is recorded for retest rather than claiming that an invalid invoice was persisted. No invoice reference was created by the suite and no PDF was generated or visually verified.

Final cleanup verified both stock baselines, original VAT values, and the neutral branding baseline after reload. Screenshots and JUnit/HTML reports are in the normal `test-results` and `playwright-report` directories and are replaced on rerun. The initial setup header-loading race was fixed before this verification run.
