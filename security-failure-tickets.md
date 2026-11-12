# Security, Sessions & Authentication — findings

Production: https://nexstock.stylotech.mu/app · Company: Nexstock QA Company · Chromium · 19 October 2026.

Artifact preservation: this Security run's HTML report and referenced screenshots are now under `blob-report/archive/security-before-hardware-2026-10-19-231946/`, with the same relative report/test-results paths. The workspace root report has since been replaced by Hardware's run. This archive contains no saved authentication state.

Requirements below use the user's latest clarification: 30 minutes inactive means PIN lock, not logout; user-configurable duration; remove Auto-logout; onboarding user-set PIN. Passwords need eight characters, lowercase, uppercase and number; symbol optional; strength bar strongest with symbol. The earlier 15-minute answer and automatic-logout plan are superseded.

## Latest report review

Reviewed the latest saved JUnit/HTML report, all ten failure messages, their test/helper code, error contexts and available screenshots. This is the same 19 October 2026 report summarized below: **20 passed, 10 failed, 0 skipped**. No new test execution was triggered during this review, and no test assertions were weakened or prerequisites falsely supplied to make the report green.

No new automation execution error explains these ten failures. Missing controls were checked against the captured UI, rather than treating every missing-element assertion as a locator bug. The three prerequisite failures are **blocked coverage**, not confirmed product defects. The integrated case is not an extra bug.

| Failed check | Classification | Ticket / required action |
| --- | --- | --- |
| Self-service profile belongs to the signed-in account | Confirmed UI defect | SEC-001 |
| Reset completion and update require isolated-account human handoff | Blocked prerequisite | Separate disposable account/mailbox and human credential workflow; not a reset-functionality bug |
| Signup requires lowercase feedback | Confirmed UI feedback gap | SEC-002; server-side lowercase enforcement remains unverified |
| Signup communicates symbols as optional | Confirmed UI feedback gap | SEC-002; server-side acceptance without symbols remains unverified |
| Signup strength bar reaches strongest with symbol | Confirmed missing UI feature | SEC-003; failure occurs because the bar is absent, not because its scoring was measured incorrectly |
| Backend bcrypt needs deployment-matched audit evidence | Blocked evidence | Actual backend test/review evidence; browser login cannot establish stored hashing |
| Full security lifecycle | Duplicate / aggregate | Repeats SEC-001 through SEC-004 and handoff/PIN prerequisites; no separate ticket |
| Obsolete Auto-logout control is removed | Confirmed UI requirement mismatch | SEC-004; does not prove runtime automatic logout occurs |
| User security exposes configurable inactivity PIN lock | Confirmed missing UI configuration | SEC-004; saving/persisting a duration is not verified |
| User-provisioned PIN lock after 30 minutes | Blocked prerequisite | User-provisioned/confirmed PIN and subsequent timed lock/unlock evidence; no runtime timeout bug established |

The detailed four tickets below retain the agreed eight-section format and separators. Only these four confirmed UI tickets should be logged as application bugs from this report. Keep the blocked checks in the test-coverage follow-up list.

## Confirmed application UI bugs

### SEC-001 — Self-service profile shows a demo identity

#### Title

Signed-in QA user's profile displays John Doe instead of the authenticated account.

#### Environment

Production /app/profile; Nexstock QA Company; Chromium; signed in as the configured QA account.

#### Priority

P2 — Incorrect account identity in self-service security.

#### Step-by-step

1. Sign in using the configured QA account.
2. Choose **Nexstock QA Company** when the business selector appears.
3. Open **My Profile** from the account menu.
4. Select **Personal Information** and inspect the name and email.
5. Reload the page and inspect the identity again.

#### Expected Result

The profile represents the authenticated user and shows that account's email, consistent with the signed-in account menu.

#### Actual Result

The profile shows **John Doe** and **john.doe@nexstock.com**. The account menu identifies the actual signed-in user. A fresh navigation/reload does not correct the profile identity.

#### Attachment

Latest Playwright HTML report: `playwright-report/index.html`; case **F24-b self-service security profile belongs to the signed-in account**. Screenshot: `test-results/phase1-security-password-r-044ba-gs-to-the-signed-in-account-chromium-security/test-failed-1.png`. Error context is attached to that case.

#### Comment

Reproduced independently and in the integrated lifecycle. One ticket covers both failures. This proves incorrect displayed identity, not that another real user's data was disclosed or that password updates affect that demo account; neither was tested by changing credentials.

---

### SEC-002 — Signup password guidance does not match confirmed mandatory classes

#### Title

Signup omits lowercase guidance and presents an optional special character as an unmet rule.

#### Environment

Production /app/signup; Chromium; public signup form; synthetic candidates only, without submitting registration.

#### Priority

P2 — Misleading password requirements.

#### Step-by-step

1. Open the login page and select **Create Account**.
2. Enter `AA1!BCDE` in Password without submitting the form.
3. Inspect the password checklist.
4. Replace it with `Aa1abcde`, which contains eight characters, uppercase, lowercase and a number, but no symbol.
5. Inspect the checklist again. Do not accept terms or create an account.

#### Expected Result

Guidance includes lowercase, uppercase, number and minimum eight characters. The first candidate is missing a required lowercase character. The second candidate satisfies every mandatory rule; any symbol advice clearly indicates that symbols are optional.

#### Actual Result

The checklist contains only minimum length, uppercase, number and special character. The uppercase-only candidate makes every displayed indicator green. The compliant no-symbol candidate leaves **Special character** unmet, with no indication that the rule is optional. There is no lowercase indicator.

#### Attachment

Latest HTML report: **signup feedback requires lowercase and rejects uppercase-only candidate** and **signup communicates symbols as optional rather than mandatory**. Screenshots: `test-results/phase1-security-secure-aut-ca990-ts-uppercase-only-candidate-chromium-security/test-failed-1.png` and `test-results/phase1-security-secure-aut-05f04-ional-rather-than-mandatory-chromium-security/test-failed-1.png`. Integrated flow repeats the same gap.

#### Comment

Grouped as one signup-guidance ticket. The user explicitly confirmed these requirements. This finding concerns visible feedback only: actual server acceptance/rejection, password reset/update enforcement and stored hashing were not verified by submitting new credentials. Do not describe this evidence as a confirmed server-side complexity bypass.

---

### SEC-003 — Required password-strength bar is absent

#### Title

Signup has no password-strength bar or strongest-with-symbol feedback.

#### Environment

Production /app/signup; Chromium; synthetic password candidates, no registration submission.

#### Priority

P2 — Missing confirmed password feedback feature.

#### Step-by-step

1. Open **Create Account** from login.
2. Enter `Aa1abcde` in Password.
3. Look for a password-strength bar and current strength.
4. Replace the candidate with `Aa1abcd!` to add a symbol at the same length.
5. Inspect whether the bar reaches its strongest level. Do not submit the form.

#### Expected Result

A visible strength bar is provided. A mandatory-policy-compliant password can omit a symbol; adding a symbol raises its strength to the strongest level.

#### Actual Result

Only the checklist is displayed; no strength bar or strength level is shown. Consequently the required strongest-with-symbol feedback cannot be observed.

#### Attachment

Latest HTML report: **signup strength bar increases to strongest when symbol is added**. Screenshot: `test-results/phase1-security-secure-aut-f66f8-ongest-when-symbol-is-added-chromium-security/test-failed-1.png`. The missing visual bar was also checked in the live browser, not inferred solely from an absent ARIA role.

#### Comment

Separate missing widget from SEC-002's mandatory-rule guidance. The scripted accessible meter locator is a contract for the missing feature and must be revalidated against the actual widget once implemented; it is not a claim that the current page has a hidden meter.

---

### SEC-004 — Inactivity settings still expose Auto-logout instead of user-level PIN-lock configuration

#### Title

Required user-configurable inactivity PIN-lock setting is unavailable, and obsolete Auto-logout remains visible.

#### Environment

Production /app/profile > Security and /app/settings > Security; Nexstock QA Company; Chromium; read-only inspection.

#### Priority

P2 — Missing confirmed security configuration UI; runtime protection requires separate verification.

#### Step-by-step

1. Sign in with the QA account and choose **Nexstock QA Company**.
2. Open **My Profile > Security**.
3. Look for the user's inactivity duration / PIN-lock configuration.
4. Open **Settings > Security**.
5. Inspect **Company Security Policies** and **Session Management** without saving any changes.

#### Expected Result

The user can configure inactivity timing in user settings; the agreed default is 30 minutes and the action is a PIN lock, not logout. The obsolete Auto-logout setting is removed.

#### Actual Result

User Profile > Security offers password fields, 2FA and demo Active Sessions, but no inactivity timing control. Company Security displays **Session Timeout (Minutes) = 120** and a separate **Auto-logout = 30 minutes** with the description **Log out automatically after inactivity**. The explicitly removed Auto-logout setting is still present.

#### Attachment

Latest HTML report: **obsolete Auto-logout control is removed** and **user security settings expose configurable inactivity PIN lock**. Screenshots: `test-results/phase1-security-session-in-b66b2-o-logout-control-is-removed-chromium-security/test-failed-1.png` and `test-results/phase1-security-session-in-3a532-gurable-inactivity-PIN-lock-chromium-security/test-failed-1.png`. Read-only security-policy JSON is attached; integrated lifecycle repeats these observations.

#### Comment

Grouped as one inactivity-settings alignment ticket. No settings were saved. This verifies missing/misaligned UI, not that the application actually logs out at 30 minutes, fails to lock at runtime, or lacks onboarding PIN setup. The 120/30 difference alone is not claimed as a separate defect. PIN onboarding, lock/unlock and actual elapsed-time behavior require the prerequisites below.

---

## Blocked or unverified coverage — not confirmed bugs

- **Backend bcrypt / plaintext-storage audit:** no deployment-matched application source, database test or independent sanitized audit was supplied. Browser login success cannot prove hashing. The backend-evidence test fails explicitly until real evidence is supplied.
- **Full password reset and signed-in update:** requires a reachable mailbox and a separate existing disposable account. A human must enter, confirm and submit any new credential. No reset mail was sent and the shared QA password was not changed. Expired/reused/invalid codes, previous-password rejection, reset delivery and administrator-initiated update remain unverified.
- **Onboarding PIN / timed lock / unlock:** the current account has already completed onboarding; its PIN is not provisioned/confirmed for this workflow. No new PIN was set. The deadline case fails as PIN PREREQUISITE BLOCKER, not a skipped test or a runtime bug. No 30-minute wall-clock or successful/invalid unlock result is claimed. Locked API/write enforcement also needs backend integration coverage.
- **Phase 3:** TOTP/2FA, recovery codes and remote session revocation are excluded, not Phase 1 passes.

## Corrected automation issues — not application tickets

- Empty-login POST observer counted third-party telemetry; it now counts only application-origin requests. The corrected empty-login case passed in the requirement-aligned run.
- Out-of-scope telemetry and automatic language-preference sync were initially counted as unexpected credential writes. They are now blocked/recorded separately; no credential guard was relaxed.
- Initial navigation waited for the full window load event and timed out on a public login navigation. Navigation now waits for DOM content plus explicit app-readiness assertions. The complete final rerun passed that case; this is not evidence of a product defect.

## Execution summary

Final complete run on 19 October 2026: `npm run test:security` — **30 cases: 20 passed, 10 failed, 0 skipped**, approximately 5.3 minutes. Includes two passing setup/cleanup checks; the functional subset is 28 cases, 18 passed and 10 failed. Guard unit suite: **29 passed, 0 failed, 0 skipped**.

| Scope | Passed | Failed | Meaning of failures |
| --- | ---: | ---: | --- |
| F24-a authentication / password policies | 14 | 4 | Three UI checks (SEC-002/003), one missing backend-audit prerequisite |
| F24-b password reset / update | 3 | 2 | SEC-001 identity, human credential-handoff prerequisite |
| F24-c inactivity / PIN lock | 1 | 3 | Two settings checks (SEC-004), user-provisioned PIN prerequisite |
| Integrated lifecycle | 0 | 1 | Same UI defects and handoff/PIN blockers; not an additional ticket |
| Setup / safety cleanup | 2 | 0 | Scope and no unexpected credential/application writes verified |

The ten failing cases comprise **six UI checks grouped into four tickets**, **three prerequisite/evidence blockers**, and **one integrated duplicate**. They are not ten distinct application bugs. No navigation/selector automation errors remain in the final run. Password policy server enforcement, backend hashing, full reset/update/admin workflow, onboarding PIN setup, actual 30-minute timing, PIN unlock and locked API/write protection are not fully certified. **Do not mark the whole Security module fully tested.**

Use `npm run test:security -- --headed` to visualize the suite in maximized Chromium, then `npm run report` to inspect its newest report. Independent commands and safe human-handoff instructions are in `tests/phase1/security/README.md`. No tests use skip, fixme or expected-failure annotations. Blockers remain ordinary failures and are not application bug counts.
