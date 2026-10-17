# SajhaCart Phase 2 — Finalization and checkout intent

## Added in this iteration

- `supabase/migrations/202610170002_finalization_and_checkout.sql`
- Resident UI action for creating an order intent after the final supplier price is locked; it clearly warns that payment is not connected
- RLS policy allowing active society members to read finalized campaign prices
- Pure checkout amount and accepted-price validation helpers in `lib/group-buying.mjs`
- Four additional Node tests, bringing the test suite to nine passing tests
- Setup and operational caveats in `README.md`

## Intended lifecycle

1. A resident commits quantity while a campaign is open using the existing `commit_to_group_order` RPC.
2. After both campaign and item deadlines, a trusted server job calls `finalize_group_order_item`.
3. Finalization locks the item and supplier inventory, checks the approved/unexpired quote and verified supplier, selects a price tier from the approved quote, reserves inventory, and snapshots final quantity and price. If eligibility fails, the item is cancelled and active commitments are cancelled.
4. A resident reviews the final price and calls `checkout_group_commitment` with that exact price and an idempotency key.
5. The function creates a persistent `pending_payment` order and order item, allocates the quoted delivery fee proportionally in integer paise, and converts the commitment. It does not capture payment.

## Important limits

- SQL migration has not been run against a live PostgreSQL/Supabase instance in this environment. Test it on a disposable Supabase project before production.
- The finalization function requires a trusted service-role scheduled job. No job runner has been configured.
- Stock is reserved at finalization. A trusted stock-release workflow must be implemented and tested before cancelling a finalized campaign.
- Payment provider creation, signature-verified webhooks, refunds, tax calculation, notifications, and delivery reconciliation are not implemented.
- Checkout uses a blank address snapshot. A verified delivery address and explicit delivery terms must be added before a live customer order is accepted.
- The npm registry was unreachable/time-limited in this environment, so dependencies could not be installed. Consequently Next.js build, lint, and TypeScript checks are not verified.

## Checks run

`node --test tests/*.test.mjs`: 9 passed, 0 failed.

A global TypeScript invocation was attempted but could not complete because project dependencies and type declarations were unavailable; errors are not treated as a valid project type-check result.
