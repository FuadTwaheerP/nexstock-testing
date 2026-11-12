# Notifications & Alerts Center - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **7 passed, 2 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **1 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- User confirmed immediate low-stock and overdue-invoice delivery. Fresh unique QA adjustment/invoice references and new notification IDs provide causal checks; the duplicate-alert policy is unspecified and not guessed.
- Header bell count/panel, actual new low/out-of-stock alerts, owned alert read persistence, live header count refresh before reload, linked product navigation and type/priority queries are exercised. Read-back uses the main paginated All feed, not the separate high-priority counter query.
- Overdue testing creates a new invoice already due yesterday, then changes it from Draft to Pending with Rs100 unpaid. Natural calendar crossing on an existing invoice and scheduler internals are not certified.
- Preferences are temporarily isolated to in-app delivery with email/push/SMS and quiet hours disabled, then exactly restored. Any legacy email boolean settings are also disabled during the test and restored. No browser push permission is enabled.
- Only current-test alerts are marked read; existing alerts are not deleted or globally marked. Owned invoices are cancelled before original preferences are restored; all five QA stock balances are restored. Synthetic cancelled invoices and adjustment history remain.

## Confirmed application bugs

## P2-NOT-002

### Title

Issuing an already overdue unpaid invoice produces no immediate in-app alert

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F29-c.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Notifications > Settings.
2. Enable In-App and Invoice Due Reminders; disable quiet hours for the check. Use in-app delivery only.
3. Ensure the disposable QA inventory product has sufficient stock. Create an invoice for QA Billing Automation Customer with one QA item priced Rs100, issue date 10 October 2026 and due date 24 October 2026 (test date 25 October).
4. Save as Draft, then use Change Status to set Pending. Confirm the invoice remains unpaid with Rs100 outstanding and the past due date.
5. Immediately open Notifications and inspect fresh All/overdue alerts for the new invoice, allowing 30 seconds for delivery.

### Expected Result

Once the invoice is eligible and unpaid past its due date, an immediate in-app overdue alert identifies that invoice, consistent with the user's confirmed timing contract.

### Actual Result

The independent and integrated scenarios create valid past-due unpaid invoices, but no new matching overdue/invoice-due alert appears during the bounded observation window. Fresh main-feed reads contain no ambiguous new invoice alert either. One reproduced full-flow reference is INV-0Z2K2J.

Affected cases:

- QA stock alerts read action overdue invoice and filter full flow
- F29-c immediate overdue alert for a newly issued unpaid past-due QA invoice

### Attachment

- [P2-NOT-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-3/artifacts/notifications-notification-57bf3--filter-full-flow-full-flow-phase2-notifications/attachments/P2-NOT-002-d8802d00f4fb5322827d957c2b8ca74a08ff6734.png)
- [P2-NOT-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-3/artifacts/notifications-overdue-invo-3912a--unpaid-past-due-QA-invoice-phase2-notifications/attachments/P2-NOT-002-e4876617ae087562a5b81d299f08e1d36a7d6d28.png)
- [QA stock alerts read action overdue invoice and filter full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-3/artifacts/notifications-notification-57bf3--filter-full-flow-full-flow-phase2-notifications/error-context.md)
- [F29-c immediate overdue alert for a newly issued unpaid past-due QA invoice - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-3/artifacts/notifications-overdue-invo-3912a--unpaid-past-due-QA-invoice-phase2-notifications/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-assessment.json)

### Comment

Evaluate overdue alert eligibility when the invoice becomes an unpaid past-due record, and deliver it immediately while respecting company scope, preferences and deduplication. The UI evidence does not establish whether an event, worker or scheduler is the root cause. Test invoices are cancelled during cleanup; create a new QA invoice for manual reproduction. Natural due-date crossing should also be tested after the fix.

---

## Corrected automation / maintenance - not application tickets

- Initial focused notification-center run passed before broader invoice/stock scenarios.
- Corrected a response-selection race: the header/main page makes several GETs to the same notification endpoint. Feed reads now require the actual main All query (20 per page, page1, no type/severity/unread-only filter). Read persistence can paginate to the owned alert.
- Added a fresh unread-count response and matching header badge assertion after marking the owned alert read, before any navigation/reload. This passes in the corrected run.
- Invoice correlation accepts the actual invoice reference or invoice action URL. An uncorrelated new overdue alert is a blocker, not a falsely confirmed missing-alert bug. No exact notification wording/duplicate policy is assumed.
- Public fingerprinted assets use the shared unchanged-byte cache; all notification/business APIs stay live. Earlier automation errors are superseded by focused/full reruns.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | notifications-3 |
| F29-a header bell unread badge panel and full-center navigation | PASS | notifications-3 |
| F29-a own new alert display read persistence and linked product navigation | PASS | notifications-3 |
| F29-a notification type and priority filtering | PASS | notifications-3 |
| audit Phase 2 write scope and log out QA session | PASS | notifications-3 |
| QA stock alerts read action overdue invoice and filter full flow | FAIL - P2-NOT-002 | notifications-3 |
| F29-c immediate overdue alert for a newly issued unpaid past-due QA invoice | FAIL - P2-NOT-002 | notifications-3 |
| F29-b immediate low-stock alert from a unique threshold-crossing adjustment | PASS | notifications-3 |
| F29-b immediate out-of-stock alert from a unique zero-stock adjustment | PASS | notifications-3 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs notifications
node scripts/assess-phase2.mjs notifications
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
