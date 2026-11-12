# Audit Logs & System Activity - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **6 passed, 5 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **3 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Real QA bill creation, a cash bookkeeping payment/update and deletion of only a newly created unpaid/unused bill are exercised. Fresh audit entries verify actor, module, timestamp and operation; update correlation uses an isolated writer window because the exposed DTO has no entity ID.
- The Products filter sends the expected module query, excludes other modules and resets to the existing stream. Its response is empty in this company, so positive Products-event coverage is not claimed. The module choices omit actual Purchasing entries shown in the stream.
- A real product CSV downloads successfully but produces no export audit event during fresh reads. Phase 3 audit CSV/JSON export and before/after diff requirements are excluded.
- Owned QA bills/payments used for create/update remain as bookkeeping evidence. No real supplier funds are moved; no existing financial record is deleted.

## Confirmed application bugs

## P2-AUD-003

### Title

Product CSV exports are absent from the audit activity stream

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F25-a.

### Priority

Medium

### Step-by-step

1. Open Audit Logs and note the latest entry identifiers.
2. Open Products and download the actual standard CSV export.
3. Return to Audit Logs and inspect fresh activity repeatedly for at least 20 seconds.
4. Look for a new export event for the operation.

### Expected Result

The completed product export creates an audit event with its actor, timestamp and export operation.

### Actual Result

The real CSV file downloads, but no new export activity entry appears in fresh audit reads during the observation window.

Affected cases:

- F25-a log a real standard product CSV export operation
- QA creation modification deletion export and fresh audit full flow

### Attachment

- [P2-AUD-003 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-activity-stream-de3a7-roduct-CSV-export-operation-phase2-audit-logs/attachments/P2-AUD-003-f5d11efbb38666fce58dda0cbfb8e4ec5b022aab.png)
- [P2-AUD-003 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/attachments/P2-AUD-003-ea8532e3cf0f2eaec1ad315f51b3672e8b8443a9.png)
- [F25-a log a real standard product CSV export operation - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-activity-stream-de3a7-roduct-CSV-export-operation-phase2-audit-logs/error-context.md)
- [QA creation modification deletion export and fresh audit full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-assessment.json)

### Comment

Record the export operation in the audit stream, including actor, time and useful scope/reference. This ticket concerns logging product exports, not the Phase 3 audit-export capability.

---

## P2-AUD-004

### Title

Searching an actor shown in Audit Logs returns no matching entries

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F25-b.

### Priority

Medium

### Step-by-step

1. Open Audit Logs in Nexstock QA Company.
2. Find an entry whose User is Fuad Peerbocus.
3. Enter Fuad Peerbocus into Search by user, action, or details.
4. Clear/reload the unfiltered page, confirm that actor still has entries, and repeat the exact search.

### Expected Result

Searching the displayed actor name returns that actor's matching activity entries.

### Actual Result

The exact displayed actor returns zero entries on two fresh attempts, while fresh unfiltered activity still contains that actor.

Affected cases:

- QA creation modification deletion export and fresh audit full flow
- F25-b user text search returns matching persisted audit entries

### Attachment

- [P2-AUD-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/attachments/P2-AUD-004-f834065d9fd7b5c21b12575fa51d7fa226bb90b3.png)
- [P2-AUD-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-a20a6-ing-persisted-audit-entries-phase2-audit-logs/attachments/P2-AUD-004-e9ab3583c05a682ba92d87f3d8bdcce05e32876c.png)
- [QA creation modification deletion export and fresh audit full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/error-context.md)
- [F25-b user text search returns matching persisted audit entries - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-a20a6-ing-persisted-audit-entries-phase2-audit-logs/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-assessment.json)

### Comment

Include the displayed actor identity in backend search matching, with correct user joins/name handling. Keep tenant scoping and pagination intact. This is separate from the absent dedicated actor filter.

---

## P2-AUD-001

### Title

Audit user, action and date filtering controls are incomplete

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F25-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Audit Logs.
2. Confirm the activity stream includes named actors and Purchasing records.
3. Inspect the User and Module selectors, then click Filters.
4. Select Custom Range in Date Range and look for start/end date inputs.

### Expected Result

Users can filter the audit stream by an existing actor, recorded module, action type and a chosen date range.

### Actual Result

User offers All Users only. There is no Action Type selector; Filters opens no additional controls. Custom Range displays no from/to inputs or date-range query. Module choices omit the Purchasing records visible in the stream.

Affected cases:

- QA creation modification deletion export and fresh audit full flow
- F25-b user module and action-type filter controls
- F25-b explicit custom date range filtering

### Attachment

- [P2-AUD-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/attachments/P2-AUD-001-f33e2dcc0bd42f30b7563e7f3b72a013e5695afc.png)
- [P2-AUD-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/attachments/P2-AUD-001-f33e2dcc0bd42f30b7563e7f3b72a013e5695afc.png)
- [P2-AUD-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-07776-action-type-filter-controls-phase2-audit-logs/attachments/P2-AUD-001-69ed6f590b25e473071f899cef4dc2c3c19e3cb1.png)
- [QA creation modification deletion export and fresh audit full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/error-context.md)
- [F25-b user module and action-type filter controls - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-07776-action-type-filter-controls-phase2-audit-logs/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-assessment.json)

### Comment

Populate actual actors/modules and add action and date controls wired to the query. The existing Products query/reset is exercised separately; an empty Products result is not itself a defect.

---

## Corrected automation / maintenance - not application tickets

- Corrected update navigation: after capturing the baseline audit stream, return to Bills before paying the owned QA bill.
- Corrected the raw paginator contract (total is a direct field) and stopped requiring a fresh request when resetting a React Query filter to cached unfiltered data.
- Investigated repeated Chromium asset-loading timeouts. Fingerprinted same-origin JS/CSS are fetched over HTTP and cached as unchanged bytes per worker; source hashes/byte counts are recorded. Live documents and all API reads/writes are preserved. A read-only diagnostic reached the QA page in 4.4 seconds, and affected cases were rerun.
- Actor search is repeated after a fresh unfiltered read proving the displayed actor exists; zero search results are not inferred from a single stale request.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | audit-logs-3 |
| F25-a audit record creation with actor module timestamp and QA reference | PASS | audit-logs-3 |
| F25-a audit record modification in an isolated QA writer window | PASS | audit-logs-3 |
| F25-a audit deletion of a newly owned unused unpaid QA bill | PASS | audit-logs-3 |
| F25-a log a real standard product CSV export operation | FAIL - P2-AUD-003 | audit-logs-3 |
| QA creation modification deletion export and fresh audit full flow | FAIL - P2-AUD-003, P2-AUD-004, P2-AUD-001 | audit-logs-3 |
| F25-b Products module filter returns matching persisted entries | PASS | audit-logs-3 |
| F25-b user text search returns matching persisted audit entries | FAIL - P2-AUD-004 | audit-logs-3 |
| F25-b user module and action-type filter controls | FAIL - P2-AUD-001 | audit-logs-3 |
| F25-b explicit custom date range filtering | FAIL - P2-AUD-001 | audit-logs-3 |
| audit Phase 2 write scope and log out QA session | PASS | audit-logs-3 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs audit-logs
node scripts/assess-phase2.mjs audit-logs
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
