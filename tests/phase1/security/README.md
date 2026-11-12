# Security, Sessions & Authentication — Phase 1

Three independent submodule specs and one integrated lifecycle. Each functional test gets a fresh browser context; authenticated cases sign in and choose the configured disposable QA company themselves. No dependency on the preceding module suites or saved login state.

| Scope | Command | What it covers |
| --- | --- | --- |
| F24-a Secure Authentication & Password Policies | `npm run test:security:auth` | Valid/invalid login, anonymous UI/API guards, refresh/deep links, masked/revealed synthetic login input, HTTPS/POST/response-field checks, logout/back/shared-tab access, published signup checklist boundaries, backend-audit prerequisite |
| F24-b Password Reset & Update | `npm run test:security:passwords` | Reset entry/return, empty/malformed email validation without sending mail, untouched masked update fields, correct account identity, separately gated human-only credential workflow |
| F24-c Session Inactivity Timeout | `npm run test:security:sessions` | Read policies, require removal of Auto-logout and user-configurable inactivity; user-provisioned PIN prerequisite, active calibration then idle PIN lock / reload contract |
| Integrated lifecycle | `npm run test:security:flow` | Sign in → business → protected navigation → account security → read policy → logout → gated isolated-account handoff → calibrated inactivity check |

Run all tests visually in maximized Chromium:

```powershell
npm run test:security -- --headed
npm run report
```

Headless: `npm run test:security`. Inspector: add `-- --debug` to an individual script. The handoff remains disabled unless explicitly configured, even in headed mode. There are no skip, fixme, expected-failure or focused-test annotations. Missing prerequisites fail normally with a blocker prefix and are not application bug tickets.

## Safety and configuration

Use the existing ignored `.env`, existing PRODUCT_TEST_EMAIL/PASSWORD and disposable production write/allowlist flags. SECURITY_TEST_COMPANY defaults to PRODUCT_TEST_COMPANY / Nexstock QA Company. Do not commit credentials, cookies, tokens, reset codes or browser state.

The unattended suite never creates an account, accepts registration terms, sends a valid reset request, enters/submits a new password, changes security policies, enables 2FA, revokes another device or creates/deletes business records. Exactly one real wrong-password attempt exists in the authentication spec; no retries, brute force, enumeration or lockout/rate-limit stress. Do not run multiple Security suite processes concurrently.

`helpers/security-safety.mjs` gates production/disposable scope and blocks state-changing requests except routine login/logout/business selection. External POST telemetry is fulfilled locally with 204 and is not transmitted. Automatic `/auth/language` preference writes are blocked, not mistaken for a credential attempt. Those two categories are recorded separately. Telemetry/language persistence are not under test. Never weaken the credential guard to make a failed reset test green.

The report attaches method/path/status and safe field names only: never request bodies, headers, JWTs or real passwords. Trace/video are off. Synthetic signup candidates test the visible checklist only and are cleared afterwards; the form is never submitted. Browser success cannot prove bcrypt storage, reset-token security or server-side policy enforcement.

Run guard unit tests: `npm run test:guard`. Safety journal: `test-results/security-run.json`. Cleanup checks for unexpected credential/application write attempts and saves an empty public-login screenshot; this is context isolation proof, not a claim that server-wide session revocation was tested.

## Password policy and hashing limitations

User-confirmed policy (19 October 2026): minimum eight characters, one lowercase, one uppercase and one number. Symbols are optional; a visible strength bar must reach its strongest level with a symbol. Tests cover seven/eight boundaries, missing mandatory classes, symbol-optional guidance and strength progression. The deployed signup currently omits lowercase guidance, shows an unmet Special character rule without explaining it is optional, and has no strength bar. These are client-feedback findings, not proof of server acceptance/rejection: no signup/reset is submitted. Accessible strength/PIN widget contract locators must be revalidated when those currently absent widgets are implemented.

No backend application source or database access is provided here. Bcrypt storage, absence of plaintext storage and correct hash verification require a backend test/audit. SECURITY_BCRYPT_AUDIT_PATH may reference an independently produced, deployment-matched sanitized record with these fields:

```json
{
  "targetOrigin": "https://nexstock.stylotech.mu",
  "algorithm": "bcrypt",
  "deploymentRevision": "actual-deployed-revision",
  "verifiedBy": "responsible-reviewer",
  "verifiedAt": "actual-ISO-date",
  "evidenceReference": "actual-backend-test-report-or-source-review",
  "passedAssertions": [
    "bcrypt_hash_storage",
    "no_plaintext_password_storage",
    "correct_password_verified",
    "wrong_password_rejected"
  ]
}
```

This is a **manual/backend evidence contract**, not proof generated by the browser. Do not fill it with illustrative values or claim its metadata validation executed backend tests. Do not include actual password hashes, credentials or reset secrets. Keep the real record in a private ignored location outside `test-results/`, which normal runs clear. Until that evidence exists, the bcrypt case is a BACKEND EVIDENCE BLOCKER, not a bug or a pass.

## Confirmed inactivity / PIN requirement

The user's latest clarification supersedes the earlier 15-minute proposal: **30 minutes inactive must show a PIN lock, not log out**. The duration is configurable in user settings; remove the Auto-logout control. The PIN must be user-set during onboarding. The current deployment still displays company Session Timeout 120 and Auto-logout 30, while Profile > Security has no inactivity configuration. The suite does not save either control. SECURITY_IDLE_TIMEOUT_MINUTES defaults to 30; override only for a user-confirmed saved configuration.

The elapsed-time check requires SECURITY_PIN_PROVISIONED=true, set by the user only after personally setting the QA account PIN. No PIN is provided or stored by the suite. Without this fixture it fails as PIN PREREQUISITE BLOCKER, not a proven 30-minute runtime defect. The original four-section onboarding account is already completed; this suite does not create/re-onboard an account or certify onboarding PIN setup. Human setup evidence and PIN unlock/invalid-PIN verification remain outstanding. The agent never enters a new PIN/password.

SECURITY_IDLE_CLOCK defaults to `client`: Playwright's clock advances bounded timers, not server time or token values. An actively used session is checked first; a separate session is then left idle. If the active control expires, the test reports CALIBRATION BLOCKER instead of mislabeling an absolute-token-expiry/clock artifact as an inactivity defect. Client-clock results are provisional until a real elapsed-time run confirms them. Timers are advanced in bounded jumps to avoid firing a large volume of production polling requests.

For a real elapsed-time run, choose `SECURITY_IDLE_CLOCK=wall` after the PIN prerequisite is satisfied. This takes approximately twice the configured idle period plus setup/grace. It checks that activity prevents locking, inactivity shows a PIN prompt rather than Login, private content is hidden and reload cannot bypass the lock. It does not enter an unlock PIN, move money, modify stock or change policy. API/write protection while locked needs backend integration coverage; browser state alone does not certify it. Client simulation is provisional, never real elapsed-time certification.

## Human-only reset/update workflow

Actual reset delivery, invalid/expired/reused-code checks, new credential entry, password update and old/new password verification require a user handoff and a **separate existing disposable account with a reachable QA mailbox**. Do not rotate the shared PRODUCT_TEST_EMAIL account: doing so would break the other module suites. No mailbox connector or actual reset token is available in this task.

To run the assisted workflow yourself:

1. Set SECURITY_INTERACTIVE_HANDOFF=true and SECURITY_HANDOFF_EMAIL to that separate account in your ignored configuration. Keep the shared account unchanged.
2. Run `npm run test:security:handoff`.
3. In the separate browser paused by the inspector, manually request the reset, receive the code, test invalid/expired/reused codes as appropriate, and enter/confirm/submit every new credential yourself. Complete the signed-in update and old/new credential checks manually too.
4. Sign in with the final credential, select the configured QA company, and resume the inspector. The script verifies the isolated login identity and protected access without reading/storing new passwords.
5. Save manual evidence for the reset/update assertions. Reaching the dashboard alone does not prove token expiry, one-time use or rejection of the previous password. Update only the separate account's own configuration yourself if necessary.

The assisted mode is not executed by the agent. With the default flag false it is a HANDOFF BLOCKER, never an intentional skip. The secondary account must already be entitled to the QA company; creating/inviting users or expanding access is outside this suite. Guard adjustments for any as-yet-unobserved reset API routes must be reviewed, not bypassed.

## Evidence and coverage

Latest complete run (19 October 2026): **20 passed, 10 failed, 0 skipped** across 30 cases (28 functional + setup/cleanup). Six failing UI checks map to four bug tickets; three failures are prerequisites (human credential handoff, backend audit, user-provisioned PIN); the remaining failed full-flow case repeats those findings. Guard unit tests: **29 passed**. No navigation/selector automation errors remain in this final run. Detailed evidence is in root `security-failure-tickets.md`. The module remains **partially tested**, not fully certified.

Phase 3 2FA, recovery codes and remote active-session revocation remain excluded. Signup creation, stored password hashing, full reset/update/admin workflow, onboarding PIN setup, real elapsed-time PIN lock/unlock, locked API/write protection and administrator/RBAC operations are not certified by client UI checks.

The preceding Customers report and screenshots were preserved before this module's first complete run at `blob-report/archive/customers-2026-10-19-192856/` (ignored; saved authentication state was not copied). The default `npm run report` shows the newest complete module run.

After Hardware automation began, this Security report, screenshots and safe journal were preserved at `blob-report/archive/security-before-hardware-2026-10-19-231946/`. The root HTML report now belongs to the latest module run, not necessarily Security. No saved auth state was copied into this archive.
