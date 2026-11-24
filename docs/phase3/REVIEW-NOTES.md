# Phase 3 methods, corrections and acceptance limits

Live campaign: 17 November 2026, Nexstock QA Company. Application findings are exclusively in `PHASE3-BUGS.md`. These notes keep automation corrections, dependencies and unconfirmed policy observations separate.

## How coverage was established

- Read `FEATURES.md` in specification order. The scope is 61 entries across 28 feature domains: 59 matrix entries plus nested dashboard period comparison and complex assembly/serialized-unit requirements. Features 9 and 11 have no Phase 3 requirement.
- Exercise actual live pages and observed API contracts. Compare important quantities with independent product stock, controlled deltas, invoice due dates, downloaded bytes or the actual printable document.
- Authenticate only the QA account/tenant; scope writes to owned fixtures. Unmodified fingerprinted public JS/CSS may be cached in the browser guard; business data and mutations remain live. External telemetry is suppressed and is not functional coverage.
- Diagnostic API setup is explicitly labelled. A multipart font fixture, API batch voucher, stock setup or processing-flag workaround never converts a failed native UI path into a pass.
- Use separate empty-session controls for API keys: anonymous/invalid/old/revoked credentials, a valid read, a denied read-only write and a persisted write-enabled update. Never attach plaintext secrets or authentication state.
- Browser `window.print` is observed rather than opening an uncontrolled native dialog. The actual debit print view is exported as A4 PDF, parsed and visually inspected. This is browser document output, not physical printer acceptance.

## Corrected automation and withdrawn provisional findings

1. Catalogue pagination now uses the live endpoint's documented page parameter. Server-provided link URLs were not certified by that data oracle.
2. Bundle availability waits for the branch-scoped response, rather than the preliminary unscoped result.
3. Lot balances use `current_quantity`. An early provisional allocation failure caused by reading a nonexistent field was removed; later allocation controls passed. Depleted lots are omitted by the live list, so the priority test reconciles omitted zero balances with independent physical stock and confirms expected exhaustion.
4. Offline React Query mutations can pause before producing a failed request. The offline test now checks missing durable acceptance/receipt and IndexedDB storage rather than requiring a particular network-failure event.
5. The debit PDF parser's copied script path was corrected. The printable output passed parsing and visual review.
6. Gross margin is calculated in the UI and is not supplied as an API `margin_percent` field. The test checks the displayed percentage against revenue and recorded cost.
7. Stock matrix checks wait for branch headers to render after the successful GET. A loaded HTTP response alone is not sufficient UI readiness.
8. Saved-report cases separate valid default/unfiltered settings from a filtered positive run. The empty-array filter contract is a confirmed application bug, not an automation selector error.
9. Notification delivery controls are under **Notifications > Settings**. An earlier wrong-surface missing-overdue-reminder finding was withdrawn. Invoice Due Reminders and email controls are present; delivery remains blocked without a QA inbox.
10. Initial loading-disabled controls are not treated as missing features. In particular, TOTP Enable becomes available after account loading, and webhook registration becomes available after the event catalogue loads.
11. API key support was verified against actual JSON resources with explicitly empty cookies/storage and negative controls. The page's claim that keys cannot authenticate is stale. The final report does not claim that key consumption is missing.
12. Webhook event choices are read only after both requests finish. The confirmed finding is the absence of the three specified subscription names; the report does not infer backend delivery failure from the page's notice or from a lack of receiver.
13. JSON export tracking excludes unrelated external telemetry. Its advertised success toast creates neither an export job nor a download.
14. Compilation/quoting mistakes were corrected. The campaign runner now stops for global collection errors and zero collected tests, as well as unreviewed case errors. Journals are copied only when they belong to the current execution stage.
15. A transient browser `ERR_NO_BUFFER_SPACE` was rerun in a fresh process and is not an application ticket. Read-only discovery body collection is bounded; discovery is supplementary evidence, not an acceptance pass.
16. Archive cleanup now waits for the successful write response and a fresh filtered server read. Final inspection identified and repaired one earlier zero-stock owned fixture whose archive had not persisted. This is a corrected cleanup race; no additional product-archive bug was inferred.
17. The initial bundle deduction oracle used a different branch from POS. The corrected case verifies the persisted invoice branch and confirms same-branch deductions. A separate boundary case proves the cross-branch negative-stock application defect. Recovery now checks every branch, including archived products, rather than only the setup branch.
18. Heavy navigation encountered HTTP 429 rate limiting. API traffic is paced with cancellation-aware dispatch; fresh observed API reads are reused without browser reloads when an independent data oracle is sufficient. Response waits allow for this pacing. No financial write is automatically retried. A recovery-only run completed before the affected bundle cases were rerun.

Original attempts retain their errors and attachments. The assessment uses the latest executed version of every currently collected case, including focused reruns; superseded failures do not count as outstanding automation issues.

## Unconfirmed observations

- Owned expiry products have catalogue cost 3 while product performance reports recorded COGS 0. Revenue-minus-recorded-cost arithmetic is checked, but acquisition/weighted-average versus catalogue cost provenance is not independently established. This is **not** an additional confirmed accounting bug.
- The feature title says CSV/JSON compliance export. CSV contents and complete filtered row count are verified; JSON is not exposed. Whether both formats are mandatory needs requirement confirmation.
- The changelog displays a static 2025 history. Display/order checks do not establish its relationship to the current backend deployment; no authoritative release revision was supplied.
- Identical public frontend hashes do not prove identical backend revisions. Working API key authentication despite stale client text demonstrates why backend behavior must be tested independently.
- A revoked session's access to `/auth/me` remains 200 while the anonymous control is 401. That observed retention is reported. Refresh-token behavior, token lifetime and any intended revocation grace policy are not extrapolated.

## Blocked and skipped acceptance

The user currently has no controlled email/SMS inbox, webhook receiver or connected printers/cash drawer. Physical device checks are explicitly skipped at the user's request. Email/SMS transport, cron delivery, webhook signatures/delivery logs/retries and actual dispatch are unverified. No active schedule or external endpoint was created.

TOTP and backup-code testing require an isolated activated account. The only available login is the shared primary QA owner; its authentication factors were preserved. Only a newly created automation session was targeted in the remote-revocation test; unrelated sessions were not revoked.

Partial coverage remains for complete comparative sales/velocity analysis, issued freight/service debit accounting, per-resource API key scopes and current release provenance. These are not counted as full passes. Supplier mapping was additionally exercised: the API retains the supplier-specific SKU/preferred flag and detach succeeds; the native catalogue's missing vendor SKU display/search is a confirmed finding.

## Recovery and evidence handling

Stock is restored; owned products are archived with server verification; owned batches, keys, saved templates and diagnostic fonts are deleted. Original MVP fonts are preserved. The owned scan count is cancelled. Synthetic financial/audit history and its QA purchasing vendor are retained for reproducibility. Each module logs out only its own primary QA session.

Share curated screenshots, downloaded documents and the reports. Do not share `.env`, auth storage, JWTs, credentials, minted API keys, private recovery ledgers or any future TOTP secrets/recovery codes.
