# Notifications & Alerts Center — Phase 2

Run `node scripts/run-phase2.mjs notifications`. Append a spec filename for an independent submodule, `--grep @full-flow` for the integrated flow, or `--headed` for a maximized browser.

The user confirmed immediate low-stock and overdue-invoice alerts. Fresh unique QA adjustment/invoice references distinguish causal alerts from older notifications; delivery is polled for a bounded 30 seconds. Duplicate-alert policy is unspecified and is not guessed.

Tests temporarily isolate this user's QA-company preferences to in-app delivery, disable outgoing email/push/SMS, and preserve unknown preference fields. Owned invoice drafts are issued without email and cancelled on cleanup; stock across all five QA branches and original preferences are restored. Only an alert caused by the current test is marked read. Global mark-all/delete operations and Phase 3 delivery channels are excluded.

See `docs/phase2/bugs/notifications.md` for reviewed results and limits. Private auth, invoice recovery and preference baseline files must not be shared.
