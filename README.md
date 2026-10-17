# SajhaCart

Mobile-first community group-buying MVP for Indian apartment societies. Built with Next.js, React, TypeScript, Tailwind CSS and Supabase/PostgreSQL.

## Current implementation status

This repository is a pre-production MVP, not yet a live commerce service. A production launch is blocked on credentials, external service configuration, SQL integration tests, payment/refund implementation, operational processes and legal review. See `docs/PRODUCTION_READINESS.md` for the release gate.

Included in this repository:
- Responsive bilingual (Hindi/English) storefront and PWA manifest.
- Clear preview/demo state: example campaigns are labelled as demo and do not claim verified prices or real supplier availability.
- Catalogue can read published `group_order_items` from Supabase when public environment variables are configured.
- Pure group-buy quantity validation, tier selection and savings helpers with Node.js tests.
- Database migration for users, cities, pincodes, societies, suppliers, product catalogue, quotes, group-buy campaigns, commitments, customer orders, payments, refunds, deliveries and audit events.
- RLS policies and a transaction-safe commitment RPC for the initial group-order flow.
- Final supplier-price finalization and checkout-intent RPCs in a second migration.
- Resident UI action to create an order intent after final price confirmation; it clearly states that payment is not connected.
- Environment template and setup steps.
- Security response headers, a non-secret health endpoint, and production-aware robots/sitemap metadata.
- GitHub Actions CI workflow and a security/release checklist.

Not yet production-ready: supplier/admin dashboards, payment provider integration, refund and stock-release execution, delivery integrations, live supplier catalogue, SQL integration/end-to-end tests, app-store packaging and legal review. No live payment or deployment has been performed from this repository.

## Requirements

- Node.js 20.9+ (Node 22 recommended)
- A Supabase project for persistent shared data and authentication
- npm

## Run locally

```bash
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm test
npm run dev
```

Open http://localhost:3000. Without Supabase credentials the storefront stays in clearly labelled preview mode. The demo cards are design fixtures, not live stock or real prices.

## Configure Supabase

1. Create a Supabase project.
2. In the SQL Editor, run `supabase/migrations/202610170001_initial_schema.sql`, then `supabase/migrations/202610170002_finalization_and_checkout.sql`, then `supabase/migrations/202610170003_storage_buckets.sql`.
3. Create a user via Supabase Auth; the profile trigger provisions the profile automatically.
4. Add city, serviceable pincode, society, supplier, product and supplier quote records through a trusted admin process.
5. Publish group order items only after a supplier quote and delivery window have been verified.
6. Set the public Supabase URL and anon key in `.env.local`.
7. Never put the service-role key in a `NEXT_PUBLIC_` variable or browser code.

## Cloud storage

See `docs/CLOUD_STORAGE_SETUP.md` for the free-tier storage plan and security setup. Apply `supabase/migrations/202610170003_storage_buckets.sql` after the initial schema and checkout migrations. It creates a public-read product image bucket with admin-only writes and a private supplier document bucket with owner/admin policies.

## Health endpoint and deployment hygiene

- `GET /api/health` returns service liveness and whether public Supabase configuration exists; it never returns credentials. It does not prove the database is reachable or that a purchase can complete.
- Baseline security response headers are configured in `next.config.ts`.
- `robots.ts` disallows indexing unless `NEXT_PUBLIC_APP_URL` is configured as an HTTPS URL. `sitemap.ts` emits the home URL only for a configured HTTPS origin.
- GitHub Actions runs tests, typecheck, lint and build on pushes and pull requests. It must pass in CI before deployment.

## Tests and checks

```bash
npm test       # pure business-logic tests; no network/dependencies required
npm run lint
npm run typecheck
npm run build
```

Lint/typecheck/build require dependencies to install successfully. In the current build environment, `npm install --no-audit --no-fund` timed out, so these checks remain unverified here. CI should be used to complete them.

## Security and operational notes

- All currency is stored in integer paise to avoid floating-point rounding errors.
- A group commitment must be made via the database RPC, not by writing totals from the browser.
- RLS is enabled for business tables. The initial schema uses conservative customer access; privileged supplier/admin writes must be added through authenticated, role-checked server actions or trusted operations.
- Price tiers are supplier quote snapshots; do not accept prices supplied by the client.
- Payment is not implemented. Use a gateway sandbox, server-side signature validation, idempotency, and a tested refund workflow before enabling live orders.
- COD should remain disabled until supplier reconciliation and failed-delivery procedures are operational.
- Before a commercial launch, review FSSAI applicability, Legal Metrology, GST, consumer protection, privacy, terms/refunds, and e-commerce obligations with qualified advisers.

## Product direction

Pilot one or two nearby societies and a narrow list of repeat essentials before opening multiple cities or every household category. Confirm delivered wholesale prices, delivery costs, damaged/short item handling, and real customer savings before claiming a discount.

## Phase 2: group finalization and checkout intent

A second migration is included at `supabase/migrations/202610170002_finalization_and_checkout.sql`.
Run it after the initial schema migration. It adds:

- A trusted-service-role-only `finalize_group_order_item` RPC. A scheduled server job must call this after both campaign deadlines. It snapshots the final committed quantity and supplier-approved price tier, or marks the item cancelled when quantity/quote/verification requirements fail.
- An authenticated `checkout_group_commitment` RPC. It requires the resident to submit the exact final unit price shown by the server, creates a persistent `pending_payment` order, stores a delivery-fee allocation in paise, and converts the commitment atomically. It does **not** capture money.
- An idempotency key on checkout orders.

The checkout flow is deliberately blocked until the supplier quote is approved and valid, the supplier is verified, the item has been finalized, and the user accepts the exact final price. Delivery fee allocation rounds down to paise so allocated resident fees do not exceed the supplier's quoted delivery fee; any fractional-paise remainder is absorbed by the platform. Tax is not calculated by this MVP and must be configured with qualified tax/accounting advice before commercial sales.

### Operational gaps before a pilot

- The finalization RPC needs a trusted scheduled job or server-side admin operation; it is not exposed to browser clients. Successful finalization reserves supplier stock atomically; implement and test a trusted stock-release flow before cancelling a finalized campaign.
- The checkout RPC creates an order intent only. Gateway checkout, verified webhooks, payment idempotency, cancellation/release, and actual refund execution remain unimplemented.
- Build a cancellation/refund orchestration path before processing paid campaigns, and test SQL functions against a real disposable Supabase project before production.
- No live supplier, quote, campaign, credentials, hosting or payment gateway is configured in this package.

See [`docs/PHASE2_IMPLEMENTATION.md`](docs/PHASE2_IMPLEMENTATION.md) for the exact checkout lifecycle, test results, and unverified production dependencies.


### Database migration safety

For a fresh Supabase project, apply migration files in timestamp order. The initial schema migration is wrapped in a transaction so a SQL error rolls back its database changes when the database supports transactional execution for the statements involved. Do not run the same migration repeatedly after a failure; inspect the error and check the database state first. Static inspection is not a substitute for testing on a disposable Supabase project.
