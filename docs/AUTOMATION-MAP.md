# Automation traceability

## Phase 2 reviewed automation

All 18 module cycles were executed/reviewed on 25 October 2026. See [the summary](phase2/SUMMARY.md) for actual results and acceptance limits. Staff mocks remain separate from live authorization. Run modules serially with `node scripts/run-phase2.mjs <slug>`; append a spec filename, `--grep @full-flow` or `--headed` as needed.

| Script folder | Phase 2 requirements | Separate findings |
| --- | --- | --- |
| [dashboard](../tests/phase2/dashboard/README.md) | F01-a, F01-b, F01-c, F01-d, F01-e, F01-f | [Dashboard & Executive Analytics](phase2/bugs/dashboard.md) |
| [products-bulk](../tests/phase2/products-bulk/README.md) | F02-j | [Products & Catalog Management](phase2/bugs/products-bulk.md) |
| [stores-lifecycle](../tests/phase2/stores-lifecycle/README.md) | F03-e, F03-f | [Stores & Branches (Multi-Location)](phase2/bugs/stores-lifecycle.md) |
| [stock-transfers](../tests/phase2/stock-transfers/README.md) | F05-a, F05-b, F05-c, F05-d | [Stock Transfers (Inter-Branch)](phase2/bugs/stock-transfers.md) |
| [stock-counts](../tests/phase2/stock-counts/README.md) | F06-a, F06-b, F06-c | [Stock Counts (Physical Inventory Audits)](phase2/bugs/stock-counts.md) |
| [pos-extensions](../tests/phase2/pos-extensions/README.md) | F08-j, F08-k | [Point of Sale (POS) & Checkout](phase2/bugs/pos-extensions.md) |
| [cash-register](../tests/phase2/cash-register/README.md) | F09-a, F09-b, F09-c, F09-d, F09-e | [Cash Register & Shift Management](phase2/bugs/cash-register.md) |
| [quotations](../tests/phase2/quotations/README.md) | F11-a, F11-b, F11-c, F11-d, F11-e | [Quotations & Cost Estimates](phase2/bugs/quotations.md) |
| [credit-notes](../tests/phase2/credit-notes/README.md) | F13-a, F13-b, F13-c, F13-d, F13-e | [Credit Notes](phase2/bugs/credit-notes.md) |
| [purchase-orders](../tests/phase2/purchase-orders/README.md) | F15-a, F15-b, F15-c, F15-d | [Purchasing & Purchase Orders (PO)](phase2/bugs/purchase-orders.md) |
| [goods-receipts](../tests/phase2/goods-receipts/README.md) | F16-a, F16-b, F16-c, F16-d | [Goods Receipt Notes (GRN)](phase2/bugs/goods-receipts.md) |
| [bills-payable](../tests/phase2/bills-payable/README.md) | F17-a, F17-b, F17-c | [Bills & Accounts Payable (AP)](phase2/bugs/bills-payable.md) |
| [supplier-history](../tests/phase2/supplier-history/README.md) | F18-d | [Suppliers & Vendor Management](phase2/bugs/supplier-history.md) |
| [reports](../tests/phase2/reports/README.md) | F20-a, F20-b, F20-c, F20-d, F20-e, F20-f | [Reports & Business Intelligence](phase2/bugs/reports.md) |
| [document-templates](../tests/phase2/document-templates/README.md) | F22-a, F22-b, F22-c, F22-d | [Document Builder & Visual Template Designer](phase2/bugs/document-templates.md) |
| [users-rbac](../tests/phase2/users-rbac/README.md) | F23-a, F23-b, F23-c, F23-d, F23-e | [Users, Roles & Access Control (RBAC)](phase2/bugs/users-rbac.md) |
| [audit-logs](../tests/phase2/audit-logs/README.md) | F25-a, F25-b | [Audit Logs & System Activity](phase2/bugs/audit-logs.md) |
| [notifications](../tests/phase2/notifications/README.md) | F29-a, F29-b, F29-c | [Notifications & Alerts Center](phase2/bugs/notifications.md) |

## Earlier Phase 1 mapping

The starter inventory below is retained as history. Current module READMEs and findings describe later work.


Phase 2 module cycles were executed and reviewed on 25 October 2026. See [the summary](phase2/SUMMARY.md) for actual outcomes, separate bug lists and coverage limits. Live passes, prerequisite blockers and authorized staff mocks are distinct; no unresolved automation issues or intentional skips remain.

| Phase 2 script folder | Requirements | Reviewed findings |
| --- | --- | --- |
| [dashboard](../tests/phase2/dashboard/README.md) | F01-a, F01-b, F01-c, F01-d, F01-e, F01-f | [Dashboard & Executive Analytics](phase2/bugs/dashboard.md) |
| [products-bulk](../tests/phase2/products-bulk/README.md) | F02-j | [Products & Catalog Management](phase2/bugs/products-bulk.md) |
| [stores-lifecycle](../tests/phase2/stores-lifecycle/README.md) | F03-e, F03-f | [Stores & Branches (Multi-Location)](phase2/bugs/stores-lifecycle.md) |
| [stock-transfers](../tests/phase2/stock-transfers/README.md) | F05-a, F05-b, F05-c, F05-d | [Stock Transfers (Inter-Branch)](phase2/bugs/stock-transfers.md) |
| [stock-counts](../tests/phase2/stock-counts/README.md) | F06-a, F06-b, F06-c | [Stock Counts (Physical Inventory Audits)](phase2/bugs/stock-counts.md) |
| [pos-extensions](../tests/phase2/pos-extensions/README.md) | F08-j, F08-k | [Point of Sale (POS) & Checkout](phase2/bugs/pos-extensions.md) |
| [cash-register](../tests/phase2/cash-register/README.md) | F09-a, F09-b, F09-c, F09-d, F09-e | [Cash Register & Shift Management](phase2/bugs/cash-register.md) |
| [quotations](../tests/phase2/quotations/README.md) | F11-a, F11-b, F11-c, F11-d, F11-e | [Quotations & Cost Estimates](phase2/bugs/quotations.md) |
| [credit-notes](../tests/phase2/credit-notes/README.md) | F13-a, F13-b, F13-c, F13-d, F13-e | [Credit Notes](phase2/bugs/credit-notes.md) |
| [purchase-orders](../tests/phase2/purchase-orders/README.md) | F15-a, F15-b, F15-c, F15-d | [Purchasing & Purchase Orders (PO)](phase2/bugs/purchase-orders.md) |
| [goods-receipts](../tests/phase2/goods-receipts/README.md) | F16-a, F16-b, F16-c, F16-d | [Goods Receipt Notes (GRN)](phase2/bugs/goods-receipts.md) |
| [bills-payable](../tests/phase2/bills-payable/README.md) | F17-a, F17-b, F17-c | [Bills & Accounts Payable (AP)](phase2/bugs/bills-payable.md) |
| [supplier-history](../tests/phase2/supplier-history/README.md) | F18-d | [Suppliers & Vendor Management](phase2/bugs/supplier-history.md) |
| [reports](../tests/phase2/reports/README.md) | F20-a, F20-b, F20-c, F20-d, F20-e, F20-f | [Reports & Business Intelligence](phase2/bugs/reports.md) |
| [document-templates](../tests/phase2/document-templates/README.md) | F22-a, F22-b, F22-c, F22-d | [Document Builder & Visual Template Designer](phase2/bugs/document-templates.md) |
| [users-rbac](../tests/phase2/users-rbac/README.md) | F23-a, F23-b, F23-c, F23-d, F23-e | [Users, Roles & Access Control (RBAC)](phase2/bugs/users-rbac.md) |
| [audit-logs](../tests/phase2/audit-logs/README.md) | F25-a, F25-b | [Audit Logs & System Activity](phase2/bugs/audit-logs.md) |
| [notifications](../tests/phase2/notifications/README.md) | F29-a, F29-b, F29-c | [Notifications & Alerts Center](phase2/bugs/notifications.md) |

Run `node scripts/run-phase2.mjs <slug>` serially. Append a spec filename, `--grep @full-flow`, or `--headed` as needed. The earlier Phase 1 starter mapping below is retained as history; current module READMEs/findings describe later work.


| Script IDs | Requirements | What is actually automated |
|---|---|---|
| tests/phase1/help/*.ui.spec.ts | F30-a/b/c; P1-061/062/063 | 25 Oct continuation: all 12 checks run, 4 pass, 5 failing cases share HELP-001, 3 prerequisite-blocked; zero skipped/unexpected writes. Read-only public pointer/mobile keyboard, Help navigation, copyright and legal/build observations. Pending legal/production release references are not confirmed missing-feature bugs or passes. See module README and help-failure-tickets.md. |
| tests/phase1/settings/*.ui.spec.ts | F28-a/b/c/d/e | Five independent scripts + integrated flow; approved QA BRN baseline, scoped writes and restoration. All functional cases executed; genuine missing-capability/persistence defects remain. Preference adapter corrected and focused rerun recorded in settings-failure-tickets.md. UI subset only, not full financial/RBAC/accessibility certification. |
| tests/phase1/security/*.ui.spec.ts | F24-a/b/c | Three independent submodules + integrated flow: authenticated/anonymous guards, login/logout, confirmed password feedback, reset/update entry, read-only policies, 30-minute PIN-lock contract. Full reset/update needs human handoff; bcrypt needs backend evidence; PIN timing needs user-provisioned fixture. See module README and security-failure-tickets.md; not full certification. |
| LOC-001 | F28-e | In-page French selection, document language and stored preference |
| tests/phase1/hardware/*.ui.spec.ts | F27-a/b | Independent thermal-printing and HID-emulation specs + integrated attempt; read-only QA fixtures, no sale/stock/settings writes, print interception. Sample previews are not physical output; saved receipt/native-dialog and actual USB/Bluetooth acceptance remain prerequisites. |
| GUARD-001..017 | Phase 1 routes, F24-a | Anonymous deep-link redirect; not role-level access validation |
| READ-products/customers/suppliers/branches/sales/invoices | F02-a, F19-a, F18-a, F03-a, F12-a | Authenticated GET and list envelope only |
| PROD-001..002 | F02-a | Product persistence and duplicate SKU validation |
| CONTACT-customers / CONTACT-suppliers | F19-a/b, F18-a/b | Create and edit persistence |
| STOCK-001..002 | F04-a | Signed adjustments and insufficient-stock rejection |
| POS-001 | F08-g/h | Sequential retry idempotency, payment cap and stock decrement |
| BRANCH-001 | F03-a | Branch contact/timezone persistence |
| INV-001 | F12-b | Partial payment balance |

63 designed Phase 1 cases are intentionally broader than this initial automation. Unmapped cases remain manual/backlog. The 22 anonymous scenarios are repeated across four browser/device projects; repetitions are not unique feature coverage. Concurrent retry races, authenticated UI CRUD, tax engine, PDF content, role/tenant isolation and hardware are not covered by the starter scripts yet.
