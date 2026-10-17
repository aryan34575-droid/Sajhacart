# SajhaCart production release gates

This checklist is intentionally strict. A repository that builds is not, by itself, a production-ready commerce platform.

## Build and deployment
- [ ] Commit a reviewed lockfile and use reproducible installs (`npm ci`).
- [ ] CI passes business tests, typecheck, lint, production build and end-to-end tests.
- [ ] Deploy to a staging URL over HTTPS; confirm health endpoint and security headers.
- [ ] Configure a verified production domain and canonical URL before indexing.
- [ ] Configure error monitoring, uptime alerts, log retention and backup/restore drills.

## Supabase
- [ ] Run migrations against a disposable project first and review every SQL result.
- [ ] Test RLS as anonymous, resident A, resident B, society admin, supplier and platform admin.
- [ ] Confirm no client role can edit prices, supplier verification, order totals, payment state or audit logs.
- [ ] Test concurrency, idempotency, expired quotes, campaign deadlines, stock reservation and stock release.
- [ ] Configure Auth email delivery, redirect allow-list, rate limits and account recovery.
- [ ] Add and test a trusted scheduled finalization job; keep service-role credentials in server secrets.
- [ ] Test backup restoration and define a retention/deletion policy.

## Commerce and operations
- [ ] Supplier contracts, verified catalogue, quote expiry and stock commitments are documented.
- [ ] Product quantity/pack size, taxes, invoice ownership, delivery fee and refund terms are disclosed.
- [ ] Real address capture, delivery-slot selection, order tracking, shortage/damage process and support workflow are implemented.
- [ ] Cancellation, stock release, refund initiation and refund reconciliation are implemented and tested.
- [ ] Confirm unit economics using actual delivered supplier quotations; do not advertise unverified savings.
- [ ] Decide marketplace vs reseller model with qualified legal/accounting advice.

## Payments
- [ ] Create a merchant account and use the gateway sandbox first.
- [ ] Create payment sessions server-side; never trust client-supplied totals.
- [ ] Verify webhook signatures and idempotency; handle delayed, duplicate and out-of-order events.
- [ ] Reconcile gateway settlement against orders and refunds.
- [ ] Keep COD disabled until supplier reconciliation and failed-delivery policies are operational.

## Legal, privacy and customer trust
- [ ] Obtain appropriate advice on GST, FSSAI applicability, Legal Metrology, consumer protection and e-commerce obligations for the chosen business model.
- [ ] Publish reviewed Terms, Privacy Notice, cancellation/refund policy and grievance/support contact.
- [ ] Minimize personal data, restrict access, set retention periods and test deletion/export requests.
- [ ] Complete accessibility and Hindi/English review on real Android devices.

## Pilot gate
Begin with a small, invite-only society pilot and a narrow product range. Do not enable city-wide acquisition until real order completion, customer savings, supplier reliability, refund handling and contribution margin have been measured.

## Verified in the current workspace
- `npm test`: run locally and record the actual result in the release notes.
- Build/lint/typecheck and SQL integration tests must be executed in an environment with dependencies and a disposable Supabase project before any production claim.
