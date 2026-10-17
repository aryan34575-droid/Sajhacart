# SajhaCart free-tier cloud storage setup

## Recommended first step: Supabase Storage

Supabase keeps object storage in the same project as SajhaCart's PostgreSQL database and Auth. The current Free plan includes 1 GB file storage and 5 GB egress according to the published plan; quotas and terms can change. Free projects may pause after a period of inactivity, so this is suitable for development/pilot validation, not a durability or uptime guarantee.

Official references:
- https://supabase.com/pricing
- https://supabase.com/docs/guides/storage
- https://supabase.com/docs/guides/platform/billing-on-supabase

## Buckets created by migration

Apply migrations in this order in the Supabase SQL Editor:

1. `supabase/migrations/202610170001_initial_schema.sql`
2. `supabase/migrations/202610170002_finalization_and_checkout.sql`
3. `supabase/migrations/202610170003_storage_buckets.sql`

The storage migration configures:

- `product-images`: public-read images, JPEG/PNG/WebP, maximum 5 MiB per object. Upload, update and delete are restricted to platform admins.
- `supplier-documents`: private supplier documents, PDF/JPEG/PNG, maximum 10 MiB per object. Objects must be stored under `{supplier_uuid}/{filename}`. Supplier owners and platform admins can access only authorized folders.

The migration sets bucket limits and RLS policies. It does not create a Supabase account or apply itself; you must execute it in your own project.

## Setup steps

1. Open https://supabase.com/dashboard and create a project.
2. Open **SQL Editor** and apply the three migrations in order.
3. Open **Storage** and confirm both buckets exist.
4. In project API settings, copy the project URL and publishable/anon key to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Never put a service-role key in a `NEXT_PUBLIC_` variable, commit it to GitHub, or share it in chat.
6. Test with separate customer, supplier-owner and platform-admin accounts. Verify that customers cannot upload product images or read supplier documents, and that one supplier cannot read another supplier's folder.

## Important limitations

- This setup creates storage buckets and authorization policies only. It does not yet implement a polished admin upload screen, upload progress UI, image optimization, signed URL endpoint, malware scanning, retention/deletion workflows or backup strategy.
- Public product images should contain no personal or supplier-confidential information.
- Keep GST certificates, identity documents, invoices containing personal data and supplier agreements in the private bucket only. Restrict access further if the business or law requires it.
- Never upload card data, UPI PINs, passwords or authentication secrets.
- Before production, test RLS policies against a disposable Supabase project and establish backups, incident response and retention rules. The Free tier is not a substitute for backups or an uptime commitment.

## Optional later: Cloudflare R2

If public product-image traffic grows beyond Supabase's free allowance, Cloudflare R2 currently lists a free monthly allowance of 10 GB-month storage, 1 million Class A operations, 10 million Class B operations and no egress fee. R2 requires a Cloudflare account and billing/subscription setup; usage beyond the allowance can cost money. It is not configured in this MVP. See https://developers.cloudflare.com/r2/pricing/.
