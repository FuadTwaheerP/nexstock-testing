# Users, Roles & Access Control — Phase 2

Run `node scripts/run-phase2.mjs users-rbac`. Append one spec filename for independent execution, `--grep @full-flow` for the integrated mock lifecycle, or `--headed` for a maximized visible browser.

The user authorized mock data and a fake join URL. The suite intercepts staff API mutations in memory, drives the deployed Members UI and verifies the real member/invitation state remains unchanged afterward. No real invitations are sent. The fake `/app/users-roles?qa_mock_join=...` URL is a harness handoff; it does not test the production acceptance handler or a staff login.

Live invitation role choices are checked without sending an invitation. Mocked invite, resend/revoke, role editing, suspension/reactivation/removal and full lifecycle results are separately labelled. Profile-edit and branch-assignment observations are unconfirmed; production role enforcement, revoked-session access and branch isolation require a real activated QA identity. See `docs/phase2/bugs/users-rbac.md` for the reviewed results.
