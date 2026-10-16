# Test plan

## Scope and priorities

The user-supplied FEATURES.md is the scope authority. Detailed subfeature phases override the executive summary. Phase 1 covers products, branches, adjustments, POS, invoicing, suppliers, customers, authentication, hardware, settings/localization and legal/help basics. Phase 2 and 3 remain tracked in COVERAGE.md; they are not silently promoted into this delivery.

## Execution sequence

| Pass | Work | Exit evidence |
|---|---|---|
| 1 | Identify deployed commit; confirm local/staging configuration; create disposable business, two branches, role accounts | Environment record, fixture ownership and reset instructions |
| 2 | Anonymous smoke; valid login/logout and guarded navigation | No app-mount redirects or blank authentication screens |
| 3 | Products, branches, customers and suppliers; field validations and edits | Persisted data agrees with input, duplicate rules resolved |
| 4 | Adjust stock; POS cash, card/recorded Juice, split, change and retry | Stock delta, movement, invoice and tender reconcile |
| 5 | Invoice numbering, partial payments, lifecycle, PDF; customer balances | Independent arithmetic and document checks |
| 6 | Company/tax/language/theme, mobile layout, keyboard navigation, legal access | Visible UI and approved document version evidence |
| 7 | Physical 58mm/80mm printers and USB/BT scanners | Hardware model, driver, browser and signed acceptance record |

Use short focused passes rather than attempting all 175 subfeatures before obtaining feedback. Estimated duration requires a working environment and measured first-pass throughput; no fabricated deadline is provided.

## Test data

Business A and B must both be disposable. In A create owner/admin, manager and staff accounts, Branch A and B, stock 10/20 for the same SKU, taxable 15%/zero/exempt items, two independent variants, a service item, named customer and supplier, enabled cash/card/recorded Juice methods. Use example.invalid email addresses for records and a controlled test mailbox for authentication mail. Never enumerate real foreign-tenant IDs: use explicitly seeded B records for isolation cases.

## Key financial oracles

- Exclusive VAT example: 2 × 100 + 15% = 230; tax 30. Inclusive equivalent: 2 × 115 = 230; tax 30. These test the supplied 15% requirement, not legal advice or a certification of the rate.
- 200 sale paid with 250 cash: change 50, recorded payment 200.
- 200 sale paid card 150/cash 100: recorded card 150/cash 50, change 50.
- Stock 10, sale quantity 2, identical client_reference retried: stock 8 and one invoice/payment.
- Invoice 200 less partial payment 50: outstanding 150.
- Stock 0 +10 at cost 40 then -3: quantity 7/value 280 under the source cost policy.

Confirm discount ordering, per-line versus document rounding and treatment of exempt versus zero-rated lines with the product owner. Do not use the application's own displayed total as the sole test oracle.

## Release criteria

All agreed Phase 1 cases executed; every Phase 1 feature has evidence or an explicit approved gap. Zero unresolved blockers affecting data integrity, stock, payments, access or essential checkout. No critical failure hidden by retries or skipped prerequisites. Physical hardware acceptance completed. Legal texts approved by the responsible reviewer. Cross-browser critical flows pass for the supported browser list. Designed, automated and passed coverage are reported separately; none is currently 100%.

## Result record

For each case store case ID, commit, environment, role, data IDs, browser/device, timestamp, expected/actual, Pass/Fail/Blocked/Not run, defect ID and evidence location. Never include tokens or real customer details. Re-test fixes, then run neighboring stock/payment paths. Missing features remain gaps rather than tests marked Pass.
