# Goods Receipt Notes — Phase 2

```powershell
node scripts/run-phase2.mjs goods-receipts
node scripts/assess-phase2.mjs goods-receipts
```

Append a spec filename to run acceptance, partial delivery, inventory increment or damage handling independently. Use `--grep @full-flow` for the integrated case and `--headed` for a maximized visible browser.

PO-linked cases create their own order through the UI and attempt the required receipt scenario. The independent `standalone-restock.ui.spec.ts` exercises the existing no-PO Restock action with a payload guard allowing only one QA item; all branch balances are reconciled and restored. `restock-cost.ui.spec.ts` checks the displayed estimate without submitting a stock change. No Phase 3 lot/expiry or reconciliation matching is tested.

P2-PO-001 blocks the four independent PO-dependent scenarios and the corresponding full-flow step. Standalone Restock quantity behavior passes. P2-GRN-002 confirms its estimated cost uses selling price. The full flow records these outcomes separately. Rerun the PO-dependent cases after the creation defect is fixed.

The user confirmed that ad-hoc receiving needs a separate GRN. Only supplier, product and quantity are mandatory user inputs; all other details are optional. See `data/phase2-grn-contract.json`. `standalone-grn.ui.spec.ts` checks the required workflow independently of PO creation. Existing stock-only Restock does not satisfy supplier-GRN acceptance. The missing standalone form is confirmed as P2-GRN-003. Minimum-input creation, required-field validation and optional-field acceptance remain unverified until the form is implemented; they are not separate bug tickets.
