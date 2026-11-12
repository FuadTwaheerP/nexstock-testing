# Purchasing & Purchase Orders — Phase 2

```powershell
node scripts/run-phase2.mjs purchase-orders
node scripts/assess-phase2.mjs purchase-orders
```

Append an independent spec filename or `--grep @full-flow`; add `--headed` for a maximized visible browser.

Independent scripts cover creation/location, status, actual PDF and partial/full fulfillment. Each uses its own QA PO and one owned active QA supplier; no external email or payment is sent. Stock is captured/restored before receipt scenarios. Synthetic fiscal/purchasing evidence is retained.

Current production blocks every PO at creation: required branchId has no UI control. Tests fail on P2-PO-001 and do not invent downstream status, receipt or PDF bugs. If a new selector is introduced, inspect and update its adapter before certifying it. GRN and PO-linked billing share this prerequisite, while direct AP checks remain independent.
