# Supplier Transaction History — Phase 2

```powershell
node scripts/run-phase2.mjs supplier-history
node scripts/assess-phase2.mjs supplier-history
```

Append an independent PO, GRN, vendor-bill or outgoing-payment spec; use `--grep @full-flow` for the integrated supplier bill/payment/history flow. Add `--headed` to visualize.

New QA bills and manual cash installments prove non-zero ledger prerequisites. No existing supplier is modified and no real payment occurs. PO/GRN provisioning remains BLOCKED by P2-PO-001. The three actual bill/payment ledger failures are grouped as P2-SUPH-001. No intentional skips or invented receipt-history bugs are used.
