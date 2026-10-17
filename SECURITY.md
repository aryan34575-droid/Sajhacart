# Security policy

## Current release status
SajhaCart is a pre-production MVP. Do not process real payments or store real customer addresses until the release gates in `docs/PRODUCTION_READINESS.md` are complete.

## Reporting
Do not publish secrets, personal data, access tokens, or exploitable details in public issues. Rotate any exposed key immediately and report the issue privately to the repository owner.

## Required controls before production
- Keep Supabase service-role and payment secrets server-side only.
- Enforce and test row-level security on every customer-facing table.
- Require verified supplier quotes and server-side price calculation.
- Verify payment webhooks cryptographically and implement idempotency.
- Rate-limit OTP, invite-code, checkout and admin endpoints.
- Use least-privilege roles, audit privileged changes, and test backups/restore.
- Configure production HTTPS, trusted canonical URL, monitoring and incident response.
