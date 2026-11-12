# Audit Logs & System Activity — Phase 2

Run `node scripts/run-phase2.mjs audit-logs`. Each spec is independent; `--grep @full-flow` runs the integrated stream flow. Add `--headed` for a maximized browser.

Checks cause real QA bill create/update/delete events and a real product CSV download, then compare new audit IDs. Deletion is restricted to the unpaid, unused QA bill created in that case. Other financial records are retained. Read-only scenarios inspect actor search and user/action/date filtering. Phase 3 audit export/diff requirements are excluded.

Reviewed application bugs, corrected automation and coverage limits are separated in `docs/phase2/bugs/audit-logs.md`.
