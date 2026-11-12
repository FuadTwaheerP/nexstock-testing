# Help Center, Legal & Compliance - Round 1 continuation

Test date: **25 October 2026**. Target: **Production**, https://nexstock.stylotech.mu/app, approved **Nexstock QA Company**. Chromium/Windows; public desktop 1440 x 1000 and mobile 390 x 844.

## Result summary

All **12 implemented checks were run; 0 skipped**. Playwright reports **4 passed and 8 failed**. Reviewed disposition:

| Disposition | Cases | Meaning |
| --- | ---: | --- |
| Passed | 4 | Help navigation, public copyright/year, QA login/company selection, and read-only audit/logout |
| Confirmed application defect | 5 | Four independent public legal-button cases plus the full flow repeat **one** bug: HELP-001 |
| Prerequisite blocked | 3 | Authenticated Terms, authenticated Privacy, and build identity; not counted as bugs or passes |
| Unresolved automation failures | 0 | No remaining selector/setup failures |

The integrated flow also records the three blockers; those are not counted again. Blocked cases remain red with **PREREQUISITE BLOCKED** annotations rather than being skipped or marked passed. The complete legal flow has **not** passed.

## Developer readiness response and scope

- **Terms:** the developer says Terms of Service will be generated after project completion. Approved wording/version and document delivery cannot be signed off now.
- **Privacy:** an approved document/version and separate delivery confirmation were not supplied. This is blocked/unconfirmed, not an assumed new missing-document bug.
- **Production release/build:** the developer says it is not yet released for production. No authoritative release/version/commit reference was supplied for this module. No expected value is invented, and this does not claim earlier application fixes were rolled back.
- Pending legal text does **not** justify an existing Terms/Privacy control submitting the login form. That interaction is independently testable and fails.
- Prior HELP-002 (in-app legal entry) and HELP-003 (build labels) are retained as **readiness observations**, not current confirmed defect tickets under this clarification. They are not marked fixed or passed.
- Legal approval/compliance, deployed-commit matching and Phase 3 searchable knowledge base/release feeds are not certified.

## Confirmed Help Center bug - Round 1 omission

## HELP-001 - Help Center / Round 1 (omitted from the consolidated report)

### Title

[Help Center / Round 1 omission] Terms of Service and Privacy Policy controls submit the login form instead of performing legal navigation

### Environment

- URL: https://nexstock.stylotech.mu/app/login.
- Environment: **Production**; fresh anonymous session, no stored credentials.
- Browser: Chromium, Playwright 1.62.1, Windows.
- Viewports: desktop **1440 x 1000**; mobile **390 x 844**.
- Reconfirmed: **25 October 2026**, Indian/Mauritius.

### Priority

**P2 / Medium** - existing legal controls cause unrelated authentication validation instead of legal navigation. No unauthorized sign-in or credential transmission is claimed.

### Step-by-step

1. Open https://nexstock.stylotech.mu/app/login in a fresh private browser session.
2. Leave **Email Address** and **Password** empty. Do not press **Sign In**.
3. Click **Terms of Service** below the form.
4. Observe the login form, validation messages, and whether a Terms document or an explicit pending-document message opens.
5. Reload the login page so the form is fresh and both fields are still empty.
6. Click **Privacy Policy**, and observe the same behavior.
7. Repeat at a **390 x 844** viewport. Use normal **Tab** navigation to each legal control, then press **Enter** instead of clicking.

### Expected Result

Activating a legal control must not submit or validate the authentication form and must not require credentials. When the document is ready, it should open the corresponding legal destination. While it is pending, the application should expose an appropriate unavailable/pending state without displaying unrelated login-field errors. Document wording/approval is a separate prerequisite.

### Actual Result

Both controls trigger one login-form submit event and display two **This field is required** messages for the empty Email Address and Password fields. No legal document opens. The observed control is a **BUTTON inside FORM**, with no explicit type and effective type **submit**. Desktop pointer and mobile Tab/Enter activation reproduce the same behavior.

Six recorded activations across the independent checks and integrated-flow repetitions each show this mechanism. Five failed test cases share this one defect:

- Help Center Legal and Compliance integrated flow.
- F30-b public Privacy opens without submitting login.
- F30-b Privacy supports mobile keyboard access and document focus return.
- F30-a public Terms opens without submitting login.
- F30-a Terms supports mobile keyboard access and document focus return.

Document reading, document layout and focus-return assertions were not reached after the failing activation; they are not passed.

### Attachment

- [Privacy - desktop pointer screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-privacy-policy-f99aa-ubmitting-login-phase1-help-chromium-help/attachments/privacy-failure-ec40f61cbf17205b9a2ec138a041827eb6454810.png)
- [Privacy failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-privacy-policy-f99aa-ubmitting-login-phase1-help-chromium-help/error-context.md)
- [Privacy - mobile keyboard screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-privacy-policy-6b27d-nt-focus-return-phase1-help-chromium-help/attachments/privacy-failure-7da09926d4c53fce0e25e0945e665a2f56ec00ac.png)
- [Terms - desktop pointer screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-terms-of-servi-a45ff-ubmitting-login-phase1-help-chromium-help/attachments/terms-failure-4625a8e6ac1f3a2f7ffff6de411150b40f07fc5d.png)
- [Terms failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-terms-of-servi-a45ff-ubmitting-login-phase1-help-chromium-help/error-context.md)
- [Terms - mobile keyboard screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/artifacts/phase1-help-terms-of-servi-d9e05-nt-focus-return-phase1-help-chromium-help/attachments/terms-failure-d4172ea56de07f2cc49aa2838e17d9ce2a2385d0.png)
- [Final HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/playwright-report/index.html)
- [Safe request journal](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/help-run.json)
- [Reviewed case assessment](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/help-round1-2026-10-25/help-2/help-assessment.json)

These are local evidence links. Upload the relevant screenshots/contexts to Trello for sharing; never attach `.env`, `help-auth.json` or private recovery baselines.

### Comment

**Module: Help Center, Legal & Compliance. Round: Phase 1 / Round 1. Reporting label: Round 1 bug omitted from the 24 October consolidated release report.** This issue was originally recorded on 21 October and reconfirmed on 25 October; it is not represented as a newly discovered Round 2 regression.

Group Terms, Privacy, pointer, keyboard and integrated-flow repetitions into one ticket because the same observed submit-button mechanism causes them. The pending Terms document is not itself the bug. No assertion is made that an unadvertised legal URL cannot exist or that the application is legally non-compliant.

Developer action: use a proper navigation link, or an explicit `type="button"` with the correct handler; if legal documents are pending, provide a clear pending state. Do not trigger authentication validation or POST credentials from a legal action. After correction, rerun all four public interaction cases and the full flow; complete readable-document/focus checks once approved documents are delivered.

---

## Automation and tracking corrections - not application bugs

- Added developer-readiness metadata and explicit blocked annotations. Known missing deliverables are not misreported as confirmed product defects; incomplete cases are not turned green.
- Public form-submission detection now fails immediately with HELP-001 after recording button semantics. The full flow continues independent steps and records both the defect and blockers without hiding either.
- Corrected a coverage-data mapping error: Help results had been assigned to dashboard/product IDs by position. Those misplaced fields were restored from their original records, and Help updates now target F30-a/b/c and P1-061/062/063 by ID. A regression unit test protects those mappings. This is not a product or dashboard application defect.
- Read-only request protections remain enabled. Final cleanup passes, **zero unexpected application writes** are recorded, and the QA session is logged out. No policy was edited, agreement accepted, support email sent, or transaction created.
- Local safety/traceability verification: **69 checks passed, 0 failed, 0 skipped**, including regression checks for result classification and Help case-ID mappings.

## Executed cases

| # | Check | Reviewed result |
| --- | --- | --- |
| H01 | authenticate Help suite and select disposable QA company | PASS |
| H02 | Help Center is reachable from app navigation without altering the QA company | PASS |
| H03 | Help Center Legal and Compliance integrated flow | FAIL - HELP-001 |
| H04 | F30-b public Privacy opens without submitting login | FAIL - HELP-001 |
| H05 | F30-b Privacy supports mobile keyboard access and document focus return | FAIL - HELP-001 |
| H06 | F30-b platform Privacy is accessible from authenticated Help Center | BLOCKED |
| H07 | F30-c public login displays NexStock copyright and year | PASS |
| H08 | F30-c active platform version and commit are visible | BLOCKED |
| H09 | F30-a public Terms opens without submitting login | FAIL - HELP-001 |
| H10 | F30-a Terms supports mobile keyboard access and document focus return | FAIL - HELP-001 |
| H11 | F30-a platform Terms is accessible from authenticated Help Center | BLOCKED |
| H12 | verify read-only Help journal and end QA session | PASS |

Final evidence: `blob-report/archive/help-round1-2026-10-25/help-2`. The first continuation run (`help-1`) is preserved; the final run applies the corrected readiness classification. Neither result is a legal/release sign-off.

## Run independently or as the full module

```powershell
node scripts/run-release-retest.mjs help
node scripts/assess-help-run.mjs blob-report/archive/help-round1-2026-10-25/help-2
npm.cmd run test:help -- --headed
```

The isolated runner creates the next `help-N` folder. Pass that actual folder to the assessment command. Independent scripts remain available through `test:help:terms`, `test:help:privacy`, `test:help:version` and `test:help:flow`; setup and cleanup are required. Phase 1 Help automation is exercised, but final acceptance remains blocked until the interaction bug is fixed and the legal/release prerequisites are delivered.
