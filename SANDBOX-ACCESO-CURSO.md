# IA fácil course access sandbox

This branch adds an isolated Preview route for validating Stripe Checkout Sessions in test mode.

## Preview environment variables

Set these only in the Vercel **Preview** environment for this project and branch:

- `STRIPE_RESTRICTED_KEY`: preferably a Stripe restricted **test-mode** key (`rk_test_...`) with read permission for Checkout Sessions and Payment Links. A standard `sk_test_...` key is accepted for this sandbox only; do not use a live key and rotate any key shared in chat.
- `STRIPE_PAYMENT_LINK_URL`: the exact course test Payment Link URL (for example, `https://buy.stripe.com/test_...`). The server retrieves the associated Payment Link and compares its URL; it does not alter the link.
- `ACCESS_COOKIE_SECRET`: a random secret of at least 32 bytes. Generate/store it in Vercel; never commit it.
- `ENFORCE_ACCESS`: `false`. Course enforcement is intentionally not implemented or activated by this branch.

Do not add these values to GitHub or Production variables. Do not use a live Stripe key or live Payment Link.

## What the route does

`/ia-facil/curso/entrar?session_id=cs_test_...` is rewritten to a separate serverless handler. It retrieves the Checkout Session from Stripe, requires test mode, completed and paid status, then retrieves the associated Payment Link and checks that its test URL exactly matches `STRIPE_PAYMENT_LINK_URL`. On success it sets a 30-day, HttpOnly, Secure, SameSite=Lax HMAC-signed cookie named `__Host-ia_course_sandbox`, then redirects to the course.

The existing root middleware, Supabase `/api/session`, access page, thank-you page, course pages and recipes flow are unchanged. The cookie is for sandbox verification only; no middleware consumes it and course access remains public.

This route does not create a checkout or grant production access. A successful return-page check is not a complete production fulfillment design: before using access control in production, add signed Stripe webhook handling for completed and asynchronous payment outcomes, and verify the cookie before enforcing it.
