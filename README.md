# Nexstock testing — Phase 1 first

Playwright + TypeScript starter grounded in the supplied `nexstock-staging` source snapshot and your three-phase feature specification. This is a separate QA repository; the application itself is not bundled.

## Current status

- GitHub clone was attempted, but the remote required authentication unavailable in this workspace. These are newly created project files, **not a checkout of the remote's existing contents**. Nothing was pushed.
- 175 subfeature entries are tracked in `docs/COVERAGE.md`, including 51 Phase 1 subfeatures. `docs/PHASE1-CASES.md` contains 63 detailed Phase 1 cases.
- 22 unique anonymous UI checks run across four browser/device projects; 5 API read checks and 9 API write scenarios are implemented. These are a starting subset, not automation of all 175 features.
- Test collection and six local safety checks were validated. Application tests have **not** been run against a configured Nexstock environment. No business transactions were created by this work.
- Source baseline: staging archive commit `6e90a52f7e4dbaf07bb96bfca5d069ddd6b7f31e`. The deployed commit remains unknown. Update selectors/contracts against your current app before interpreting failures as defects.

## 1. Put this project on Windows

Use PowerShell with Git and Node.js 22 or newer available. `MyDocuments` handles a Documents folder redirected to OneDrive.

```powershell
$projects = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'projects'
New-Item -ItemType Directory -Force $projects | Out-Null
Set-Location $projects
git clone https://github.com/FuadTwaheerP/nexstock-testing.git
Set-Location nexstock-testing
git switch -c qa/phase1-bootstrap
```

If the repository is already cloned, use that folder instead and check `git status` before copying. Extract the delivered ZIP elsewhere, then copy its project files into this checkout. Review any same-named existing files before replacing them. The ZIP intentionally excludes `.git`, dependencies, reports and credentials. Complete GitHub authentication through Git Credential Manager if prompted.

```powershell
npm ci
npx playwright install chromium
npm run test:guard
npm run test:list
```

The dependency is pinned to the Playwright version used for local validation. A portable npm lockfile is included. Do not copy machine-specific dependency symlinks.

## 2. First run: anonymous production smoke

This visits login and protected routes in fresh anonymous browser contexts. It does not log in, reset passwords, create accounts or send mutations. Non-GET/HEAD/OPTIONS browser requests and non-allowlisted hosts are blocked. An app depending on external assets may require explicitly adding its known asset origins.

```powershell
$env:BASE_URL = 'https://nexstock.stylotech.mu/app'
$env:TARGET_ENV = 'production'
$env:ALLOWED_ORIGINS = 'https://nexstock.stylotech.mu'
npm test
npm run report
```

`BASE_URL` includes `/app` on the deployed site; local Vite usually has no `/app`. The helper retains this prefix. The default `npm test` runs Chromium UI only; it never silently selects API writes.

## 3. API read checks

Use a dedicated QA account and a short-lived token supplied through your local environment or CI secret manager. Do not put passwords, tokens or browser storage-state files in Git. The project does not harvest tokens or log in automatically.

Set these values to your actual environment; no staging hostname is assumed:

```powershell
$env:API_URL = 'http://localhost:8080/api/v1/'
$env:BASE_URL = 'http://localhost:3000'
$env:ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:8080'
$env:TARGET_ENV = 'local'
$env:BUSINESS_ID = '<dedicated QA business id>'
$env:BRANCH_ID = '<QA branch id>'
# Set API_TOKEN securely in this process; do not paste it into shared commands/logs.
npm run test:api
```

The `.env.example` is a reference only: this project does not implicitly load `.env`. Use PowerShell environment variables, your IDE launch configuration or CI secrets. An expired token should fail visibly with 401 rather than be treated as a passing empty list.

## 4. Phase 1 write tests — isolated local/staging only

Prerequisites: matching deployed code; disposable QA business; owner/admin test token; active sales-enabled branch; an enabled cash payment method; spare branch quota; email/SMS/webhook delivery disabled or routed to sandbox sinks. Use a fresh database snapshot or dedicated tenant for each run. No real payment gateway is invoked by these tests, but application listeners may fire.

```powershell
$env:ALLOW_WRITES = 'true'
$env:DISPOSABLE_BUSINESS_ID = $env:BUSINESS_ID
$env:CASH_METHOD_ID = '<enabled QA cash payment method id>'
npm run test:writes
```

Writes are rejected on `nexstock.stylotech.mu`, on unknown origins, outside `local`/`staging`, without explicit opt-in or when the disposable business ID differs. Do not relabel a production copy as staging. API redirects are not followed. The suite runs one worker, with no automatic retry, to avoid multiplying transactions after partial failures.

Tests create uniquely named `QA-*` records and intentionally do not delete stock/payment history. Record created objects from the test environment if investigating failures. Reset the disposable database/tenant using your normal controlled reset process before the next run. This suite does not call a wipe/reset endpoint.

## 5. Browser coverage

```powershell
npx playwright install firefox webkit
npm run test:cross-browser
```

Mobile is viewport/browser emulation, not a physical iPhone and not the Flutter app. Hardware receipt/scanner checks are manual. HTML and JUnit reports are generated; failure screenshots may contain environment data. Traces/video are off by default to avoid recording tokens and business data. Review report artifacts before sharing.

## 6. Extend one feature at a time

1. Pick a Phase 1 case ID in `docs/PHASE1-CASES.md` and agree any unresolved rule in `docs/GAPS.md`.
2. Seed only the minimum data in the disposable business.
3. Inspect the real UI and use `getByRole`, `getByLabel` or agreed `data-testid` attributes. Avoid guessed XPath and fixed sleeps.
4. Add a UI workflow test with a business assertion (stock, persisted customer, invoice balance), not merely a visible heading.
5. Link the test ID to its requirement ID in `docs/AUTOMATION-MAP.md`; record execution result separately.
6. Run the small changed suite first, then Phase 1 smoke. Promote stable scenarios into CI.

Read-only API checks validate availability/envelope, not full CRUD or tenant isolation. Anonymous route redirects validate route guards, not role authorization. Add multi-role/multi-tenant tests before sign-off even though full user administration is Phase 2.

## CI and Git

`.github/workflows/qa.yml` is manual-dispatch only and runs anonymous Chromium smoke. Configure `QA_BASE_URL` and `QA_ALLOWED_ORIGINS` repository variables. No write suite is enabled in CI. After reviewing locally, commit the files on your QA branch and open a PR. No push or PR was performed here.

## Fastest practical order

Auth → business/branch context → products and contacts → stock adjustments → POS cash/split/retry → invoicing/partial payments/PDF → settings/language/legal access → physical printer/scanner acceptance. See `docs/TEST-PLAN.md` for completion criteria.
