# Stores and Branches - Phase 2

Run the module with `node scripts/run-phase2.mjs stores-lifecycle`. Append `close-branch.ui.spec.ts` or `staff-assignment.ui.spec.ts` for an independent submodule, `--grep @full-flow` for the integrated flow, or `--headed` for maximized Chromium.

Closure uses the zero-stock QA Inspection Store and restores Active in finally/teardown. A branch quota prevents creating a new isolated branch. At the user's request, staff screens are inspected using mock data and a fake join URL. No invitation is sent and production members are checked unchanged. Effective branch restrictions remain unverified because mocked UI state does not authenticate a real staff user.

The findings file is `docs/phase2/bugs/stores-lifecycle.md`. Green closure assertions do not certify historical sales retention. Unconfirmed mock-based staff observations remain red and are reported separately from live passes and confirmed application defects.
