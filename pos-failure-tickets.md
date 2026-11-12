# Point of Sale & Checkout — Failure Tickets

Run: 17 October 2026, production, desktop Chromium, disposable **Nexstock QA Company**. There were 29 functional tests: 10 passed, 19 failed, 0 skipped. Setup and stock teardown passed separately. Ten grouped findings follow; repeated failures at the same prerequisite are not separate defects.

Missing features below are discrepancies against F08 in `docs/FEATURES.md`, not invented requirements. Negative/excessive discount checks are financial-input validation findings. Priorities are QA proposals for developer triage, not confirmed severity assignments. Payment-dependent behavior beyond the missing tender was not verified.

Common precondition: log in with the disposable QA administrator, select Nexstock QA Company, open POS, and use a stocked QA product. The run used SKU `QA-ADD-mv9rtxw1-3b087e`, selling price Rs100, branch `QA Inspection Store 20261017`. For the discount examples, company VAT was off. Use only disposable data; do not submit a real payment.

---

## POS-001 — Unit-price override unavailable

### Title

POS — Administrator cannot override a cart item's unit price

### Environment

Production `/app/pos`, Nexstock QA Company, Chromium; F08-c Cart Operations.

### Priority

Medium — required cashier/admin price adjustment is unavailable.

### Step-by-step

1. Open POS using the common preconditions.
2. Add one unit of the Rs100 QA product.
3. Inspect and hover the cart line for an editable price or price-override action.
4. Attempt to change the unit price to Rs80.

### Expected Result

A permitted administrator can override the line's unit price; the total becomes Rs80 with VAT off.

### Actual Result

The line has quantity/removal controls but no discoverable unit-price override control. The price-change step cannot be performed.

### Attachment

`test-results/phase1-pos-cart-operations-a04d1-it-selling-price-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

Requirement discrepancy, not a proven permissions/backend defect. Permission enforcement for other roles was not tested.

## POS-002 — Clear cart has no confirmation

### Title

POS — Clear immediately discards the cart without confirmation

### Environment

Production `/app/pos`, Nexstock QA Company, Chromium; F08-c Cart Operations.

### Priority

Medium — accidental clicks discard the current order.

### Step-by-step

1. Add two units of a QA product to the cart.
2. Click **Clear**.
3. Observe whether a native browser or in-page confirmation appears.
4. Attempt to cancel and retain the cart.

### Expected Result

Clear asks for confirmation; Cancel preserves the order, and confirming clears it.

### Actual Result

The order immediately becomes empty. Neither native nor in-page confirmation was observed, so cancellation is impossible.

### Attachment

`test-results/pos-clear-verification/phase1-pos-cart-operations-f9214-s-cart-on-cancel-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

Confirmed in a separate targeted run after updating the test to handle both native and in-page confirmation.

## POS-003 — Customer quick-add missing

### Title

POS — Customer picker does not provide quick-add

### Environment

Production `/app/pos`, Nexstock QA Company, Chromium; F08-d Customer Linking.

### Priority

Medium — a new customer cannot be created directly during checkout.

### Step-by-step

1. Add a QA product to the cart.
2. Click the customer selector (**Tap to change**).
3. Search for a new, nonexistent QA customer name.
4. Look for an Add/New/Create Customer action within the picker.

### Expected Result

The cashier can quick-add a customer and link that customer to the current cart.

### Actual Result

The picker supports existing-customer search, but no quick-add action is exposed.

### Attachment

`test-results/phase1-pos-customer-linkin-f3a80--customer-picker-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

Walk-in default and existing-customer lookup/linking passed. This finding concerns only quick-add.

## POS-004 — Line discounts unavailable

### Title

POS — Cart items do not expose percentage or amount discount controls

### Environment

Production `/app/pos`, Nexstock QA Company, Chromium; F08-e Discounts & Promotions.

### Priority

Medium — required per-item pricing promotions cannot be applied.

### Step-by-step

1. Add two units of the Rs100 QA product.
2. Inspect the cart line for a discount action or input.
3. Attempt to apply a 10% discount to that line.
4. Attempt to apply an amount discount to that line instead.

### Expected Result

Each line supports percentage and amount discounts, independently of the overall cart discount.

### Actual Result

Only the overall cart discount is available. No line-level discount control is exposed, blocking both modes.

### Attachment

`test-results/phase1-pos-discounts-promo-0bf3d--fixed-discounts-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

Overall percentage and fixed-amount discounts passed. The line test fails at the missing control; downstream line calculations remain unverified.

## POS-005 — Negative discount increases payable total

### Title

POS — Negative percentage discount is accepted as a surcharge

### Environment

Production `/app/pos`, Nexstock QA Company, Chromium; F08-e Discounts & Promotions; VAT off.

### Priority

High — invalid discount input changes the amount charged in the wrong direction.

### Step-by-step

1. Add one Rs100 product.
2. Select `%` for the overall discount.
3. Enter `-10` in **Discount**.
4. Inspect the total without completing a sale.

### Expected Result

A negative discount is rejected or prevented and cannot silently increase the payable amount.

### Actual Result

The total increases from Rs100 to Rs110.

### Attachment

`test-results/phase1-pos-discounts-promo-74104-into-a-surcharge-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

Observed calculation defect under invalid input. No sale was submitted; persistence of the surcharge was not tested.

## POS-006 — Excessive discount creates negative payable total

### Title

POS — A 150% discount creates a negative total with Charge enabled

### Environment

Production `/app/pos`, Nexstock QA Company, Chromium; F08-e Discounts & Promotions; VAT off.

### Priority

High — financial input can produce an invalid negative checkout amount.

### Step-by-step

1. Add one Rs100 product.
2. Select `%` for the overall discount.
3. Enter `150` in **Discount**.
4. Inspect validation, the total and the Charge button; do not submit a sale.

### Expected Result

An excessive discount is rejected, with a clear validation message. The payable total must not become negative.

### Actual Result

No validation is displayed. The total is Rs-50.00, and **Charge Rs-50.00** remains enabled.

### Attachment

`test-results/phase1-pos-discounts-promo-3fb7b-ve-payable-total-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

The automated assertion first fails on missing validation; the screenshot additionally confirms the negative total. No negative-value sale was submitted.

## POS-007 — Configured payment methods unavailable

### Title

POS — Adding payment methods reports success but they remain unavailable at checkout

### Environment

Production `/app/settings` and `/app/pos`, Nexstock QA Company, Chromium; F08-g Multi-Tender Payments.

### Priority

High — required Cash/Card/MCB Juice/Bank Transfer checkout paths are blocked.

### Step-by-step

1. Open company Settings and locate Payment Methods.
2. Add a missing QA payment method named `Cash`, `Card`, `MCB Juice`, or `Bank Transfer` using **Add Method**. Do not repeatedly add an existing method.
3. Observe the success notification and inspect the payment-method list after reload.
4. Open POS, add a stocked QA product, and click **Charge**.
5. Inspect the payment choices in **Complete Payment**.

### Expected Result

Successfully added payment methods remain visible in Settings and can be selected at checkout.

### Actual Result

Configuration reports success, but the added methods are not listed in Settings or checkout. Checkout shows only **Credit**; the four configured methods are unavailable.

### Attachment

`test-results/phase1-pos-multi-tender-pa-c0b45-pleted-Cash-sale-phase1-pos-chromium-pos/test-failed-1.png`

Additional Card, MCB Juice and Bank Transfer failures are in the HTML report.

### Comment

Observed UI behavior does not establish whether backend persistence or frontend loading is responsible. This blocks four method-specific sale tests, three cash/change tests, two receipt tests and the full flow. Do not log separate calculator/printing defects from those blocked tests. The setup remembers attempted additions in an ignored local ledger to prevent duplicate fixture creation. No real payment/provider settlement occurred.

## POS-008 — Split-tender controls missing

### Title

POS — Checkout cannot allocate one sale across multiple payment methods

### Environment

Production `/app/pos`, Nexstock QA Company, Chromium; F08-g Multi-Tender Payments.

### Priority

Medium — required split payments are unavailable.

### Step-by-step

1. Add two Rs100 QA items.
2. Click **Charge**.
3. Look for Split/Add Payment/Add Tender, or multiple payment allocations.
4. Attempt to allocate Rs150 to Card and the remaining amount to Cash.

### Expected Result

The checkout supports multiple tender allocations and calculates any change on the cash portion.

### Actual Result

No split/add-tender action or multiple-allocation interface is exposed.

### Attachment

`test-results/phase1-pos-multi-tender-pa-751de--for-cash-change-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

This is a missing required interface. Split allocation, completion and ledger arithmetic cannot yet be verified. POS-007 also affects tender availability.

## POS-009 — Tax-exempt toggle missing

### Title

POS — Taxable order has no tax-exemption control

### Environment

Production `/app/settings` and `/app/pos`, Nexstock QA Company, Chromium; F08-f Tax Engine.

### Priority

Medium — a required exempt sale cannot be configured during checkout.

### Step-by-step

1. In the disposable company's Settings, note the existing Tax Registered and Tax Percentage values.
2. Enable tax registration, set the rate to 15%, and save.
3. Open POS and add one Rs100 QA product.
4. Confirm the total is Rs115.
5. Look for and attempt to enable a tax-exempt toggle.
6. Restore the original company tax settings after reproduction.

### Expected Result

Automatic VAT is applied, and enabling tax exemption removes it, returning the total to Rs100.

### Actual Result

The configured 15% VAT calculation works, but there is no tax-exempt toggle in the cart/checkout interface.

### Attachment

`test-results/phase1-pos-tax-engine.ui-P-0600e-he-taxable-order-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

The automation restored the prior tax settings in `finally`. This is not a defect in the passing 15% calculation.

## POS-010 — Catalog category ignored in POS

### Title

POS — Categorized catalog product appears as Uncategorized with no category navigation

### Environment

Production `/app/products` and `/app/pos`, Nexstock QA Company, Chromium; F08-b Visual Product Grid.

### Priority

Medium — category-based product navigation does not reflect the catalog.

### Step-by-step

1. Open Products and locate SKU `QA-ADD-mv9rtxw1-3b087e`.
2. Verify its saved category is **QA Automation**.
3. Open POS and search for the same SKU.
4. Inspect the product tile's category.
5. Look for a **QA Automation** category-navigation option.

### Expected Result

The tile reflects its saved catalog category, and category navigation can filter to that category.

### Actual Result

The tile displays **Uncategorized** despite the saved category. The **QA Automation** category-navigation option is absent.

### Attachment

`test-results/phase1-pos-visual-product--32803-egory-navigation-phase1-pos-chromium-pos/test-failed-1.png`

### Comment

The full-flow soft assertion reproduces the same mismatch. Stocked selectable/out-of-stock disabled tile checks passed. Broader visual color semantics were not validated by this check.

## Evidence and blocked coverage

Open the complete run with `npm run report`. Its JUnit source is `test-results/junit.xml`: 31 including setup/cleanup, 12 passed, 19 failed, 0 skipped. Each failing directory includes screenshot and error context. Normal report artifacts are replaced on rerun; preserve them before attaching tickets.

Full flow verified search, cart quantity, existing-customer linking, cart discount and 15% VAT arithmetic, but did not complete checkout. Missing Cash prevented automatic-change assertions, sale receipt contents, 58/80mm previews, print invocation and new-sale reset from executing. Those paths require a rerun after POS-007 is fixed; they are not marked passed or fully tested.
