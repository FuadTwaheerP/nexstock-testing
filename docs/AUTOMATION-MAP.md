# Automation traceability

| Script IDs | Requirements | What is actually automated |
|---|---|---|
| AUTH-001..004 | F24-a, F24-b | Anonymous field rendering, empty validation, forgot-password and signup navigation |
| LOC-001 | F28-e | In-page French selection, document language and stored preference |
| GUARD-001..017 | Phase 1 routes, F24-a | Anonymous deep-link redirect; not role-level access validation |
| READ-products/customers/suppliers/branches/sales/invoices | F02-a, F19-a, F18-a, F03-a, F12-a | Authenticated GET and list envelope only |
| PROD-001..002 | F02-a | Product persistence and duplicate SKU validation |
| CONTACT-customers / CONTACT-suppliers | F19-a/b, F18-a/b | Create and edit persistence |
| STOCK-001..002 | F04-a | Signed adjustments and insufficient-stock rejection |
| POS-001 | F08-g/h | Sequential retry idempotency, payment cap and stock decrement |
| BRANCH-001 | F03-a | Branch contact/timezone persistence |
| INV-001 | F12-b | Partial payment balance |

63 designed Phase 1 cases are intentionally broader than this initial automation. Unmapped cases remain manual/backlog. The 22 anonymous scenarios are repeated across four browser/device projects; repetitions are not unique feature coverage. Concurrent retry races, authenticated UI CRUD, tax engine, PDF content, role/tenant isolation and hardware are not covered by the starter scripts yet.
