# IA fácil course access sandbox

This branch adds an isolated Preview route for validating Stripe Checkout Sessions in test mode.

## Preview environment variables

Set these only in the Vercel **Preview** environment for this project:

- `STRIPE_RESTRICTED_KEY`: Stripe restricted **test-mode** key (`rk_test_...`) with permission to read Checkout Sessions. The handler rejects every other key prefix.
- `STRIPE_PAYMENT_LINK_ID`: the course's test-mode Payment Link ID (`plink_...`), not the recipes Payment Link.
- `ACCESS_COOKIE_SECRET`: a random secret of at least 32 bytes. Generate/store it in Vercel; never commit it.
- `ENFORCE_ACCESS`: `false`. Course enforcement is intentionally not implemented or activated by this branch.

Do not add these values to GitHub or Production variables. Do not use a live Stripe key or live Payment Link ID.

## What the route does

`/ia-facil/curso/entrar?session_id=cs_test_...` is rewritten to a separate serverless handler. It retrieves that Checkout Session from Stripe, requires test mode, completed and paid status, and an exact match with `STRIPE_PAYMENT_LINK_ID`. On success it sets a 30-day, HttpOnly, Secure, SameSite=Lax HMAC-signed cookie named `__Host-ia_course_sandbox`, then redirects to the course.

The existing root middleware, Supabase `/api/session`, access page, thank-you page, course pages and recipes flow are unchanged. The cookie is for sandbox verification only; no middleware consumes it and course access remains public.

This route does not create a checkout or grant production access. A successful return-page check is not a complete production fulfillment design: before using access control in production, add signed Stripe webhook handling for completed and asynchronous payment outcomes, and verify the cookie before enforcing it.
