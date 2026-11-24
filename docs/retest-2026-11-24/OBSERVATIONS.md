# Unconfirmed observations - not confirmed application bugs

Retest: **24 November 2026**. These entries are excluded from REMAINING-BUGS.md and from confirmed-open-ticket counts.

## P3-BACKUP-002 - Automated platform backup capability cannot be verified from the tenant UI

**Observed:** Reclassified from the earlier UI-only finding. The fresh Settings inspection exposes no tenant backup schedule/history, but FEATURES.md F28-f does not mandate tenant-facing controls. No platform schedule/job/artifact evidence is available, so absence or failure of automated backups is unconfirmed. This is not a passed backup capability and is excluded from confirmed bugs; native JSON export is tested separately.

**Why unconfirmed:** FEATURES.md F28-f requires Automated Database Backup & JSON Dump Export; it does not mandate a tenant-facing scheduling, retention or history screen. The earlier UI absence does not establish that platform-managed backup jobs are missing.

**Verification needed:** Platform backup schedule/job configuration, dated successful backup artifacts and a safe restore verification in a disposable environment. No production restore will be attempted.

**Evidence:** [Evidence 1](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/settings-1/results.json), [Evidence 2](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/retest-2026-11-24/automated-backup-observation.json)
