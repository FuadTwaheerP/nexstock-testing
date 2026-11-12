# Credit Notes — Phase 2

```powershell
node scripts/run-phase2.mjs credit-notes
node scripts/assess-phase2.mjs credit-notes
```

Append an independent spec filename, or `--grep @full-flow` for the integrated linked-invoice flow. Add `--headed` for a maximized visible browser. No intentional skips or expected failures are used.

The suite creates only QA customer invoices and linked credits, never standalone credits or external refunds. Inventory is captured and restored across QA branches, with a private recovery ledger. Synthetic fiscal records remain as evidence. Print calls are intercepted; the real app document is captured and inspected as A4 PDF, without opening a hardware printer dialog.

The full flow currently stops at the missing settlement action. Independent reason and restock checks identify unavailable controls. See the separate reviewed module Markdown under `docs/phase2/bugs/`.
