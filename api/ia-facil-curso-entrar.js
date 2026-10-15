import { createHmac } from "node:crypto";

const COOKIE_NAME = "__Host-ia_course_sandbox";
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;

function reject(res, status, error) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json({ error });
}

function makeCookie(sessionId, secret, now = Date.now()) {
  const issuedAt = Math.floor(now / 1000);
  const payload = Buffer.from(JSON.stringify({
    session_id: sessionId,
    iat: issuedAt,
    exp: issuedAt + COOKIE_TTL_SECONDS
  })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");

  return `${COOKIE_NAME}=${payload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_TTL_SECONDS}; Priority=High`;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return reject(res, 405, "Method not allowed");
  }

  const sessionId = typeof req.query?.session_id === "string" ? req.query.session_id : "";
  if (!/^cs_test_[A-Za-z0-9]+$/.test(sessionId)) {
    return reject(res, 400, "Se requiere una Checkout Session de prueba válida");
  }

  const stripeKey = process.env.STRIPE_RESTRICTED_KEY || "";
  const paymentLinkUrl = process.env.STRIPE_PAYMENT_LINK_URL || "";
  const cookieSecret = process.env.ACCESS_COOKIE_SECRET || "";

  // This route only accepts Stripe test keys and can never check live payments.
  // Prefer an rk_test_ restricted key with read access to Checkout Sessions and Payment Links.
  if (
    !stripeKey.startsWith("rk_test_") &&
    !stripeKey.startsWith("sk_test_")
  ) {
    return reject(res, 503, "Falta una clave de Stripe Test para Preview");
  }
  if (!/^https:\/\/buy\.stripe\.com\/test_[A-Za-z0-9]+$/.test(paymentLinkUrl)) {
    return reject(res, 503, "Falta la URL del Payment Link de prueba del curso");
  }
  if (Buffer.byteLength(cookieSecret, "utf8") < 32) {
    return reject(res, 503, "ACCESS_COOKIE_SECRET debe tener al menos 32 bytes");
  }

  try {
    const stripeHeaders = { Authorization: `Bearer ${stripeKey}` };
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        method: "GET",
        headers: stripeHeaders,
        cache: "no-store",
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!stripeResponse.ok) {
      return reject(res, stripeResponse.status === 404 ? 404 : 502, "Stripe no pudo validar la sesión de prueba");
    }

    const session = await stripeResponse.json();
    if (
      session?.id !== sessionId ||
      session?.livemode !== false ||
      session?.status !== "complete" ||
      session?.payment_status !== "paid" ||
      typeof session?.payment_link !== "string"
    ) {
      return reject(res, 403, "La sesión no es un pago completado de Stripe Test");
    }

    const linkResponse = await fetch(
      `https://api.stripe.com/v1/payment_links/${encodeURIComponent(session.payment_link)}`,
      {
        method: "GET",
        headers: stripeHeaders,
        cache: "no-store",
        signal: AbortSignal.timeout(8000)
      }
    );
    if (!linkResponse.ok) {
      return reject(res, 502, "Stripe no pudo validar el Payment Link");
    }

    const paymentLink = await linkResponse.json();
    if (
      paymentLink?.id !== session.payment_link ||
      paymentLink?.livemode !== false ||
      paymentLink?.url !== paymentLinkUrl
    ) {
      return reject(res, 403, "La sesión no pertenece al Payment Link de prueba del curso");
    }

    res.setHeader("Set-Cookie", makeCookie(sessionId, cookieSecret));
    res.setHeader("Location", "/ia-facil/curso/");
    return res.status(303).end();
  } catch {
    return reject(res, 502, "No se pudo conectar con Stripe");
  }
}
