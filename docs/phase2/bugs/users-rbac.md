# Users, Roles & Access Control (RBAC) - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **3 passed, 0 application-failing cases, 0 blocked, 0 unresolved automation issues**. Separately: **4 mocked UI passes and 2 unconfirmed mock-based observations**; these are not live authorization/account-enforcement results. Duplicate failures are grouped into **0 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- The user authorized mock data and a fake join URL. Member/invitation writes are intercepted in memory; no real invitation is sent and no existing member is edited. Each case removes the interception and verifies production members/invitations are unchanged.
- The fake /app/users-roles?qa_mock_join=... URL is a labelled harness handoff using the owner session, not a production invitation acceptance handler. Production staff login, permission enforcement, branch isolation and session revocation remain unverified.
- Live Admin/Manager/Staff invitation choices are checked without submitting. Role labels alone do not establish backend permissions or a missing Cashier role defect.

## Confirmed application bugs

No confirmed application bugs were found in the executed scope. This is not a pass for blocked/unverified requirements.

## Unconfirmed observations / mocked scope — not confirmed bug tickets

- P2-STAFF-OBS-001: simulated active non-owner staff exposes role editing but no name/phone editor or password reset. This is a mock-based UI observation, not a confirmed account or credential defect.
- P2-STAFF-OBS-002: invite/member screens and the QA branch editor expose no branch assignment selector with simulated Manager staff. Real branch restriction enforcement remains unverified.

## Corrected automation / maintenance - not application tickets

- Mocked results have separate MOCK PASS and MOCK OBSERVATION classifications. They cannot be promoted to live passes or confirmed application bugs.
- Only explicitly recognized fake member/invitation mutations are fulfilled; unknown writes are prevented. Original production member/invitation identities, roles, status and email are checked after each case.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | users-rbac-1 |
| F23-c MOCK member suspend reactivate and remove UI | MOCK PASS | users-rbac-1 |
| F23-e MOCK Manager branch-assignment UI inventory | MOCK OBSERVATION | users-rbac-1 |
| F23-a MOCK invitation payload pending list and fake join URL handoff | MOCK PASS | users-rbac-1 |
| F23-a MOCK invitation resend and revoke UI | MOCK PASS | users-rbac-1 |
| F23-d live owner invitation role choices without sending invitation | PASS | users-rbac-1 |
| F23-b MOCK member role edit and profile/password action inventory | MOCK OBSERVATION | users-rbac-1 |
| MOCK invitation fake join role suspend reactivate remove full flow | MOCK PASS | users-rbac-1 |
| audit Phase 2 write scope and log out QA session | PASS | users-rbac-1 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs users-rbac
node scripts/assess-phase2.mjs users-rbac
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
