# Bills & Accounts Payable — Phase 2

```powershell
node scripts/run-phase2.mjs bills-payable
node scripts/assess-phase2.mjs bills-payable
```

Append a spec filename for independent creation, payments or aging checks; use `--grep @full-flow` for purchasing-to-bill integration. Add `--headed` for a maximized visible browser.

Only the isolated QA supplier and newly created synthetic bills are used. Cash/Bank Transfer/Cheque are manual bookkeeping records, with no external payment execution. Independent direct bills verify persistence, installments, references and due dates. PO-linked checks attempt a real received PO and currently report BLOCKED by P2-PO-001. No intentional skips or duplicate AP bugs are used. Stock is captured/restored; fiscal records remain as evidence.
