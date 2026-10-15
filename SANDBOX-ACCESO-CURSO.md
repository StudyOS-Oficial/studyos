# IA fácil course access sandbox

This branch validates Stripe Checkout Sessions in test mode and enforces the resulting signed cookie only on this branch's Vercel Preview deployment.

## Preview environment variables

Set these only in Vercel Preview for the sandbox/ia-facil-stripe-access branch:

- STRIPE_RESTRICTED_KEY: preferably a Stripe restricted test-mode key (rk_test_...) with read permission for Checkout Sessions and Payment Links. A standard sk_test_... key is accepted for this sandbox only; rotate any key shared in chat.
- STRIPE_PAYMENT_LINK_URL: the exact course test Payment Link URL. The server retrieves the associated Payment Link and compares its URL; it does not alter the link.
- ACCESS_COOKIE_SECRET: a random secret of at least 32 bytes. Generate/store it in Vercel; never commit it.
- ENFORCE_ACCESS: true only for this Preview branch. The middleware also requires Vercel's Preview environment and this exact branch name. Production and all other branches pass through unchanged.

Do not add these values to Production variables. Do not use a live Stripe key or live Payment Link.

## What the route and middleware do

/ia-facil/curso/entrar?session_id=cs_test_... is rewritten to a separate serverless handler. It retrieves the Checkout Session from Stripe, requires test mode, completed and paid status, then retrieves the associated Payment Link and checks that its test URL exactly matches STRIPE_PAYMENT_LINK_URL. On success it sets a 30-day, HttpOnly, Secure, SameSite=Lax HMAC-signed cookie named __Host-ia_course_sandbox, then redirects to the course.

On this sandbox Preview branch only, middleware verifies the cookie's HMAC, expiry and test-session format for every course page. Without a valid cookie, visitors go to the static access page. The Stripe entry route and access page are exempt so the flow does not loop. The access page has no automatic redirects.

Production, the existing Supabase /api/session, the thank-you page, recipes flow, Payment Links and prices are not changed by this branch.

This is a sandbox, not a production fulfillment design. Before production enforcement, add signed Stripe webhook handling for completed and asynchronous payment outcomes and define a safe access migration for existing buyers.

## Preview test checklist

1. Complete a test purchase using the course's Stripe test Payment Link and Stripe's standard test payment details.
2. Open the Preview URL at /ia-facil/curso/entrar?session_id=.... A valid purchase should set the cookie and redirect to the course.
3. In a fresh browser without the cookie, open any course page. It should redirect to the access page.
4. A fabricated, unpaid, live-mode or other-product session should not set a cookie.
5. After testing, revoke any standard sk_test_... key shared in chat and replace it with a restricted test key scoped to this branch's Preview environment.
