# Point of Sale & Checkout — Phase 1

Nine independent submodule specs and one full-flow spec. Each npm command runs its own authentication/fixture setup and stock cleanup. No test is intentionally skipped or marked as an expected failure.

| Requirement | Spec | Checks |
|---|---|---|
| F08-a Barcode Scanning & Search | `barcode-search.ui.spec.ts` | SKU/name search, no-match search, real persisted barcode + Enter, unknown barcode |
| F08-b Visual Product Grid | `visual-product-grid.ui.spec.ts` | Catalog category consistency, category navigation, stock availability |
| F08-c Cart Operations | `cart-operations.ui.spec.ts` | Merging, quantity changes, line removal, arithmetic, admin price override, clear confirmation/cancel |
| F08-d Customer Linking | `customer-linking.ui.spec.ts` | Walk-in default, named-customer lookup, quick-add |
| F08-e Discounts & Promotions | `discounts-promotions.ui.spec.ts` | Cart percentage/amount discounts, line discount control, invalid discounts |
| F08-f Tax Engine | `tax-engine.ui.spec.ts` | Configured 15% VAT and tax exemption |
| F08-g Multi-Tender Payments | `multi-tender-payments.ui.spec.ts` | Cash/Card/MCB Juice/Bank Transfer sale recording and split-tender controls |
| F08-h Change Calculator | `change-calculator.ui.spec.ts` | Exact cash, overpayment/change, underpayment rejection |
| F08-i Thermal Receipt Printing | `thermal-receipt.ui.spec.ts` | Completed-sale receipt, 58/80mm preview controls, print invocation |
| Complete flow | `pos-full-flow.ui.spec.ts` | Search/grid → quantity changes → customer → discount/VAT → cash/change → receipt/print → new sale |

## Run

```powershell
npm run test:pos
npm run test:pos -- --headed
npm run report
```

Independent commands:

```powershell
npm run test:pos:search
npm run test:pos:grid
npm run test:pos:cart
npm run test:pos:customers
npm run test:pos:discounts
npm run test:pos:tax
npm run test:pos:payments
npm run test:pos:change
npm run test:pos:receipts
npm run test:pos:flow
```

Headed tests use maximized Chromium without the incompatible device-scale/viewport combination. Headless runs do not need an unlocked desktop. A completed report contains 29 functional tests plus setup and cleanup.

## QA fixtures and boundaries

- Uses the existing disposable account credentials and production mutation opt-ins already configured for the earlier suites.
- Creates or reuses **QA POS Automation Customer** and record-only tender names. These fixtures remain in the disposable company.
- Selects a QA-prefixed simple product with a persisted barcode. `POS_TEST_SKU`, `POS_TEST_COMPANY`, and `POS_TEST_BRANCH` optionally select different QA fixtures.
- Records branch stock in `test-results/pos-fixture.json`, seeds up to 20 units for the run, and compensates back to the baseline in the teardown project. Completed QA sales/receipts remain as evidence; stock compensation is not a refund or accounting reversal.
- VAT tests temporarily set the company's VAT to 15%, reload to verify it saved, and restore the previous settings in `finally`.
- Payment method configuration attempts are recorded in ignored `playwright/.auth/pos-tender-fixtures.json` to avoid duplicates when the application reports success but does not display the added method.
- Only internal sale recording is exercised. No payment-provider credentials, real card charges, Juice transfers, or bank settlements are used.
- Keyboard-wedge scanner input is automated; physical USB/Bluetooth device compatibility requires hardware verification.
- `window.print` is instrumented to verify print invocation without sending paper to a physical printer. Physical 58/80mm output requires hardware verification.
- Phase 2 held orders, sale-to-invoice conversion, and Phase 3 offline/loyalty are excluded.

Missing payment methods can block the later change, completed-sale, and receipt assertions. Such tests remain ordinary failures with the missing prerequisite named in the report. A failure at the tender selector does not establish a change-calculation or printing defect.

The suite does not prove provider settlement, cashier-role permission enforcement, or backend idempotency for repeated API client references. These require their own approved fixtures/contracts. Line fixed-amount discount and split-payment ledger checks require the corresponding UI controls to be available before they can be verified end to end.

## Execution results — 17 October 2026

Production QA-company run: **29 functional tests: 10 passed, 19 failed, 0 skipped**. Authentication/fixture setup and stock teardown also passed (31 tests including lifecycle projects: 12 passed, 19 failed). The 12 safety-guard tests passed separately.

- Passed: product search, keyboard-wedge barcode lookup, unknown-barcode handling, stock availability policy, basic cart operations, walk-in/existing-customer linking, overall percentage/fixed discounts, configured 15% VAT.
- Failed requirements: category mapping/navigation, admin price override, clear-cart confirmation, quick-add customer, line discounts, negative/excessive discount validation, tax exemption, configured tender availability, split tender.
- Cash/Card/MCB Juice/Bank Transfer were unavailable despite successful configuration notifications. Cash-change, completed-sale, receipt and print assertions could not be reached. These are blocked checks, not independently confirmed change-calculation or printing defects.
- Full flow reached customer linking, discount and VAT calculation, then failed on category consistency and missing Cash. It did not complete a sale.
- Stock cleanup passed and VAT settings were restored. No real payment was made.

See [failure tickets](../../../pos-failure-tickets.md) for ten grouped findings with reproduction steps. Evidence is in `playwright-report/index.html` and `test-results`; rerunning tests replaces normal report artifacts. A separate clear-cart verification also failed after checking both native browser and in-page confirmation.
