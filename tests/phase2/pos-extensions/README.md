# POS Extensions - Phase 2

Run `node scripts/run-phase2.mjs pos-extensions`. Append `hold-orders.ui.spec.ts`, `receipt-print.ui.spec.ts` or `formal-invoice.ui.spec.ts` for independent cases; use `--grep @full-flow` for hold-to-checkout, or add `--headed` for maximized Chromium.

Service SKU QA-SERVICE-mvmgbd15-fba79b and QA Billing Automation Customer avoid stock changes and real customer communication. Cash sales are QA ledger entries without a real payment. The receipt test verifies the paid transaction/customer/item/amount and observes printing without hardware output. The formal-document case opens the corresponding invoice, verifies its paid identity and printing, then exercises its actual export.

The combined flow cannot resume the saved cart while Held Orders is empty. It does not claim to run the later checkout on that held cart. A successful backend save alone is not a passed hold/resume scenario. The currently unreachable Resume/Discard adapter must be completed when rows become available. Owned held carts and paid POS records are retained as QA evidence; no undocumented cleanup API, refund, gateway or hardware action is used.

See `docs/phase2/bugs/pos-extensions.md`. RET-002 is a known Round 1 export issue, not a new duplicate ticket. PDF geometry/content remains unverified while export returns 404.
