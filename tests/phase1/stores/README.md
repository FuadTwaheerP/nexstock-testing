# Stores & Branches — Phase 1 UI automation

Each sub-module spec runs independently. The suite logs into the disposable account, selects the configured company when required, and creates traceable QA branch data. It reuses existing QA fixtures on later runs because the current plan is capped at five branches.

## Coverage

| Phase 1 sub-module | Spec | Automated requirements |
|---|---|---|
| Add Branch / Store / Warehouse | `add-branch.ui.spec.ts` | Code, Retail Store/Warehouse/Workshop types, status, address, contacts and branch-level tax registration |
| Edit Branch Settings | `edit-branch-settings.ui.spec.ts` | Contact/address updates, receipt-header requirement and register assignment |
| Independent Branch Stock Levels | `independent-stock-levels.ui.spec.ts` | Separate matrix columns, branch-specific inventory views, and a +1/−1 stock-isolation proof with cleanup |
| Full Store Flow | `stores-full-flow.ui.spec.ts` | Create → edit → branch inventory path |

No Stores test is intentionally skipped or annotated as an expected failure. Missing controls and product defects are reported as ordinary failures.

## Confirmed product defects

- Branch-level tax registration is unavailable. A company may use one tax registration across every branch or different tax registrations per branch.
- Branch receipt-header settings are unavailable.

## Run commands

```powershell
npm run test:stores
npm run test:stores:add
npm run test:stores:edit
npm run test:stores:inventory
npm run test:stores:flow
```

Visual full-screen run:

```powershell
npm run test:stores -- --headed
```
