# Phase 3 automation review summary

Production: https://nexstock.stylotech.mu/app. **Nexstock QA Company**. Windows / Chromium / Playwright 1.62.1, 1920 × 1080. Campaign: **17 November 2026**, Indian/Mauritius.

**Phase 3 cannot be treated as 100% complete.** All **28/28 feature domains** and **61/61 requirement entries** have a reviewed disposition; blocked and skipped entries are not functional passes. The scope includes the two nested Phase 3 requirements omitted from the old 59-row matrix.

Strict requirement acceptance: **5/61 (8.2%) fully passed**, 7 partial, 41 failed, 6 blocked, 2 skipped. This is an unweighted evidence count, not a percentage of implementation effort or code complete.

**43 unique confirmed tickets** are in [the single developer bug file](PHASE3-BUGS.md). Final composite execution contains **47 functional cases** (11 raw passes and 36 application-failing cases), plus **59 setup/cleanup/recovery checks**. Raw passes include partial/blocked cases and are not acceptance percentages. **0 unresolved automation errors.** Historical failed adapters and corrected findings remain in their original attempt folders and are superseded by the reviewed current cases.

| Feature | Reviewed result |
| --- | --- |
| 1. Dashboard & Executive Analytics | No period comparison workflow. |
| 2. Products & Catalog Management | Valid same-branch BOM flow checked; zero coercion, cross-branch negative stock, serialized units and category schema findings. |
| 3. Stores & Branches (Multi-Location) | Inventory comparison reconciles; full comparative sales acceptance remains partial. |
| 4. Stock Adjustments | Two-item API vouchers work; multi-item UI missing. |
| 5. Stock Transfers (Inter-Branch) | Stock lifecycle passes; no manifest or discrepancy workflow. |
| 6. Stock Counts (Physical Inventory Audits) | Draft/count recovery works; category schedules and software scan workflow missing. |
| 7. Shelf Life & Expiry Tracking (Batches & Lots) | Date states and native allocation priority work; zero quantity, selector, receipt capture and disposal gaps. |
| 8. Point of Sale (POS) & Checkout | Offline sale is not durably queued; loyalty redemption missing. |
| 10. Orders Queue (Workshop / Kitchen Processing) | Diagnostic queue transitions work; native processing flag, assignment and ticket output fail. |
| 12. Invoicing & Commercial Sales Billing | No recurring/per-invoice FX workflow; reminder delivery blocked by inbox dependency. |
| 13. Credit Notes | Standalone Save as Draft opens credit and increases stock. |
| 14. Debit Notes | Link/amount/identity/PDF pass; issued service/freight and dispatch coverage partial. |
| 15. Purchasing & Purchase Orders (PO) | Manual QA PO lifecycle works; automatic reorder/supplier email workflow unavailable. |
| 16. Goods Receipt Notes (GRN) | No receipt line lot/expiry capture. |
| 17. Bills & Accounts Payable (AP) | PO reference exists; three-way receipt reconciliation unavailable. |
| 18. Suppliers & Vendor Management | Preferred vendor/SKU API mapping and detach pass; catalogue hides the vendor SKU/search; account export is profile-only. |
| 19. Customers & Accounts Receivable (AR) | Group/tier and debt-ceiling controls unavailable; over-limit enforcement unverified. |
| 20. Reports & Business Intelligence | Gross arithmetic, movement delta and AR reconciliation checked; net margin/AP aging missing; cost/velocity limits remain. |
| 21. Custom Report Builder & Scheduled Delivery | Filtered templates run; unfiltered templates disappear; composer limited; cron delivery blocked. |
| 22. Document Builder & Visual Template Designer | Preset form only; TTF upload loses bytes; diagnostic font API management passes. |
| 23. Users, Roles & Access Control (RBAC) | No custom role/matrix editor; real staff enforcement unverified. |
| 24. Security, Sessions & Authentication | TOTP/recovery blocked by account dependency; revoked session retains authenticated access. |
| 25. Audit Logs & System Activity | Before/after values and complete filtered CSV pass; JSON format acceptance partial. |
| 26. Integrations, REST API & Webhooks | Key lifecycle/global scopes work; docs stale/incomplete; required webhook events absent; delivery/retries blocked. |
| 27. Hardware & Printer Configuration | Physical checks skipped; software label generation unavailable. |
| 28. System Settings & Localization | JSON export is a no-op toast; backup workflow unavailable. |
| 29. Notifications & Alerts Center | Channel controls inspected; external delivery blocked. |
| 30. Help Center, Legal & Compliance | FAQ search works; videos missing; changelog display works with provenance limits. |

## Verified positive paths

- Valid BOM save, availability and automatic component deductions through POS.
- Positive multi-item API adjustments and atomic negative-stock rejection; transfer stock lifecycle and compensation.
- Lot dates/visual expiry filters and automatic native lot priority through depletion, reconciled to physical balances.
- Debit invoice linkage, amount, product identity and visually reviewed A4 PDF.
- Controlled stock movement entry and invoice-based AR aging reconciliation.
- Filtered saved report persistence/run/delete; before/after audit values and complete filtered CSV export.
- Active API key read and write scopes, negative credentials, rotation, revocation and deletion.
- FAQ positive/negative search and answer expansion.
- Supplier-specific SKU/preferred mapping persists through the API and the owned relation is removed; native vendor SKU display/search has a confirmed gap.

## Blocked checks and physical skips

- Physical ESC/POS network/serial printing, cash drawer pulse, scanner devices and label paper output were skipped at the user's request. Software availability was still inspected.
- No controlled QA email inbox, SMS receiver/gateway or webhook receiver: overdue email, cron report email, notification transports and webhook delivery/signatures/logs/retries remain unverified.
- No isolated activated account: TOTP enrollment/login/replay and recovery-code generation/one-use/recovery remain blocked. Shared owner authentication factors and unrelated sessions were preserved.
- Per-resource API scopes, full branch sales/velocity analysis, issued service/freight debit accounting and current changelog provenance are partial.
- Gross COGS provenance and whether CSV/JSON requires both formats are observations awaiting policy/requirement confirmation, not additional confirmed bugs.

## Automation corrections and observations

Corrections are separated from application tickets in [the review notes](REVIEW-NOTES.md). The per-requirement status and acceptance limits are in [the requirement register](REQUIREMENT-STATUS.md).

## Fixtures, evidence and repeat execution

Owned fixture stock was restored across every branch and checked in the archived catalogue, owned products archived with fresh server verification, owned lots/keys/report templates/diagnostic fonts deleted and the owned supplier relation detached, and the owned scan count abandoned. Existing MVP fonts 1/2 remain. An early archive cleanup race was corrected and its single zero-stock owned product repaired. Synthetic QA sales, credits, debit drafts, POs, vendor and audit/adjustment history are retained. No active email schedule or external webhook endpoint was created; no payment gateway, real email/SMS send or physical device command was requested. Each module ends only its own QA login session.

Initial frontend fingerprint: index-Bw0A9VIv.js, SHA-256 bd0987b86cf20ca4531f81b3f859bb2d32d3d7d41da42386d09a9c377992584c. A frontend fingerprint does not identify the deployed backend commit or migrations.

Evidence root: `blob-report/archive/phase3-2026-11-17/`. Each attempt contains results, HTML report, screenshots/downloads and a scoped journal when setup ran. `assessment.json` selects the latest executed version of each currently collected case, including focused reruns.

```powershell
node scripts/run-phase3.mjs shelf-life
node scripts/run-phase3-campaign.mjs dashboard products stores
node scripts/check-phase3-collection.mjs
node scripts/assess-phase3.mjs
```

Run live modules serially. A nonzero test exit may indicate an application bug; inspect results before classifying it. Do not share `.env`, auth state, JWTs, passwords, recovery state or minted keys.
