# Stock Adjustments — Phase 1

Independent submodule specs plus a combined flow. Authentication runs once per command, selects the QA company, and supplies fresh authenticated contexts to every test. Headed runs use maximized Chromium.

| Requirement | Spec | Coverage |
|---|---|---|
| F04-a Create Stock Adjustment | `create-adjustment.ui.spec.ts` | Positive/negative quantities, exact branch balances, other-branch isolation, overdraw rejection and zero validation |
| F04-b Reason Code Tracking | `reason-code-tracking.ui.spec.ts` | Damage, shrinkage, theft, expiry, opening correction and readable saved justification notes |
| F04-c Inventory Valuation Impact | `inventory-valuation.ui.spec.ts` | Immediate value change after +10 and −3 using unit cost, independently of selling price |
| F04-d History & Audit Trail | `history-audit-trail.ui.spec.ts` | One completed record, actor, timestamp, SKU, signed quantity and before/after balances |
| Combined flow | `stock-adjustments-full-flow.ui.spec.ts` | Opening stock → loss → branch isolation → valuation → reasons and history |

```powershell
npm run test:adjustments
npm run test:adjustments:create
npm run test:adjustments:reasons
npm run test:adjustments:valuation
npm run test:adjustments:history
npm run test:adjustments:flow
```

Watch the complete run:

```powershell
npm run test:adjustments -- --headed
```

Open its report:

```powershell
npm run report
```

## Fixtures and cleanup

The suite uses existing QA-prefixed products/branches in the disposable company; it never creates real sales or deletes records. Each test records the initial stock, unit cost, selling price and inventory value in a report attachment. Cleanup reads the persisted balance even after a failure, then creates a compensating adjustment to restore it. History records intentionally remain as test evidence.

Optional `.env` settings: `ADJUSTMENT_TEST_COMPANY`, `ADJUSTMENT_TEST_BRANCH`, `ADJUSTMENT_TEST_SKU`, and `ADJUSTMENT_TEST_ACTOR`. The selected SKU must be visible in the Stores matrix (currently top ten products), and two branches must exist. The existing explicit QA mutation guards (`ALLOW_WRITES`, disposable-account and production test opt-in) apply.

The UI currently accepts free-text reasons; the tests exercise each required reason without assuming a dropdown is mandatory. Missing notes/detail controls and incorrect valuation produce ordinary failures. No intentional skips or expected-failure annotations. Phase 3 batch vouchers are excluded.

Overdraw tests assert user-visible rejection and unchanged stock; they do not assume an undocumented HTTP error code. Valuation follows the cost-based expectation in `docs/PHASE1-CASES.md` (P1-026).

## Latest verified result

13 functional tests: 10 passed, 3 failed, 0 skipped. Authentication setup passed separately (Playwright reports 11 passed and 3 failed in total).

- Creation, positive/negative balances, zero rejection, overdraw rejection and branch isolation passed.
- All five reason categories passed.
- Unit-cost valuation after positive and negative adjustments passed.
- User attribution, timestamp, completed status and one history row per submitted adjustment passed.
- History does not expose the affected SKU or a movement-detail view.
- Saved justification notes cannot be reviewed from history. This is a UI retrieval failure; the tests do not establish whether the database retained the notes.
- The combined flow fails at the same history-detail and notes checks; stock and valuation steps pass.
- Cleanup restored both branch balances after every functional test, including failed tests.

Detailed reproduction tickets: `stock-adjustments-failure-tickets.md` in the repository root.
