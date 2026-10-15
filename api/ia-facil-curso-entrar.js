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
  const paymentLinkId = process.env.STRIPE_PAYMENT_LINK_ID || "";
  const cookieSecret = process.env.ACCESS_COOKIE_SECRET || "";

  // This isolated route must never be capable of checking live payments.
  if (!stripeKey.startsWith("rk_test_") || !/^plink_[A-Za-z0-9]+$/.test(paymentLinkId)) {
    return reject(res, 503, "Falta la configuración de Stripe Test para Preview");
  }
  if (Buffer.byteLength(cookieSecret, "utf8") < 32) {
    return reject(res, 503, "ACCESS_COOKIE_SECRET debe tener al menos 32 bytes");
  }

  try {
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${stripeKey}` },
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
      session?.payment_link !== paymentLinkId
    ) {
      return reject(res, 403, "La sesión no es un pago completado del Payment Link del curso");
    }

    res.setHeader("Set-Cookie", makeCookie(sessionId, cookieSecret));
    res.setHeader("Location", "/ia-facil/curso/");
    return res.status(303).end();
  } catch {
    return reject(res, 502, "No se pudo conectar con Stripe");
  }
}
