# Quotations & Cost Estimates — Phase 2

Run all independent cases and the integrated flow:

```powershell
node scripts/run-phase2.mjs quotations
node scripts/assess-phase2.mjs quotations
```

Append a spec filename to run it independently, or `--grep @full-flow` for the integrated flow. Add `--headed` for a maximized visible browser. Setup selects the QA workspace; cleanup audits writes and logs out.

Cases cover creation/persistence, commercial fields, export, status and accepted-quote conversion. Each saved-document case creates its own quotation. The full flow currently fails at the real broken document route, so downstream transitions and conversion are unverified. No email dispatch, invented status API, skips or expected failures are used.

See `docs/phase2/bugs/quotations.md` for reviewed outcomes and detailed grouped tickets.
