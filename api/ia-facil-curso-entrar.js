const COOKIE_NAME = "__Host-studyos-iafacil";
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;

function base64Url(value) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function errorRedirect(res) {
  res.statusCode = 303;
  res.setHeader("Location", "/ia-facil/curso-nuevo-acceso/?error=verification");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  return res.end();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sessionId = new URL(req.url, "https://studyos.invalid").searchParams.get("session_id") || "";
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return errorRedirect(res);

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const paymentLinkId = process.env.STRIPE_COURSE_PAYMENT_LINK_ID;
  const cookieSecret = process.env.ACCESS_COOKIE_SECRET;
  const isProduction = process.env.VERCEL_ENV === "production";
  const expectedMode = isProduction ? "live" : "test";
  const keyPrefixes = isProduction ? ["sk_live_", "rk_live_"] : ["sk_test_", "rk_test_"];

  if (!secretKey || !keyPrefixes.some((prefix) => secretKey.startsWith(prefix)) ||
      !/^plink_[A-Za-z0-9]+$/.test(paymentLinkId || "") ||
      !cookieSecret ||
      cookieSecret.length < 32 ||
      !sessionId.startsWith("cs_" + expectedMode + "_")) {
    return res.status(503).json({ error: "El acceso todavía no está configurado." });
  }

  try {
    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId),
      {
        headers: { Authorization: "Bearer " + secretKey },
        cache: "no-store"
      }
    );

    if (!stripeResponse.ok) return errorRedirect(res);

    const session = await stripeResponse.json();
    if (session?.object !== "checkout.session" ||
        session?.id !== sessionId ||
        session?.mode !== "payment" ||
        session?.payment_status !== "paid" ||
        session?.livemode !== isProduction ||
        session?.payment_link !== paymentLinkId) {
      return errorRedirect(res);
    }

    const payload = base64Url(JSON.stringify({
      v: 1,
      exp: Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS,
      sid: sessionId
    }));
    const { createHmac } = await import("node:crypto");
    const signature = createHmac("sha256", cookieSecret).update(payload).digest("base64url");
    const cookie = COOKIE_NAME + "=" + payload + "." + signature +
      "; Path=/; Max-Age=" + COOKIE_TTL_SECONDS + "; HttpOnly; Secure; SameSite=Lax";

    res.setHeader("Set-Cookie", cookie);
    res.setHeader("Location", "/ia-facil/curso-nuevo/bienvenida/");
    res.setHeader("Referrer-Policy", "no-referrer");
    return res.status(303).end();
  } catch {
    return res.status(503).json({ error: "No se pudo verificar el pago ahora. Inténtalo de nuevo." });
  }
}
