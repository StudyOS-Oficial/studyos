const COOKIE_NAME = "__Host-studyos-iafacil";
const ACCESS_PAGE = "/ia-facil/curso-nuevo-acceso/";

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function base64UrlToText(value) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function hasValidAccess(request) {
  const secret = process.env.ACCESS_COOKIE_SECRET;
  if (!secret || secret.length < 32) return false;

  const cookies = request.headers.get("cookie") || "";
  const item = cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(COOKIE_NAME + "="));
  if (!item) return false;

  let token;
  try {
    token = decodeURIComponent(item.slice(COOKIE_NAME.length + 1));
  } catch {
    return false;
  }

  const pieces = token.split(".");
  if (pieces.length !== 2) return false;
  const [payload, signature] = pieces;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      new TextEncoder().encode(payload)
    );
    if (!valid) return false;

    const data = JSON.parse(base64UrlToText(payload));
    const expectedPrefix = process.env.VERCEL_ENV === "production" ? "cs_live_" : "cs_test_";
    return data?.v === 1 &&
      Number.isSafeInteger(data.exp) &&
      data.exp > Math.floor(Date.now() / 1000) &&
      typeof data.sid === "string" &&
      data.sid.startsWith(expectedPrefix);
  } catch {
    return false;
  }
}

function redirectToAccessPage() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: ACCESS_PAGE,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer"
    }
  });
}

export default async function middleware(request) {
  const pathname = new URL(request.url).pathname;

  // Stripe returns here with the Checkout Session ID; the API validates it and issues the cookie.
  if (pathname === "/ia-facil/curso-nuevo/entrar") return;

  // Keep the existing course route unchanged. The new route fails closed unless explicitly enabled.
  if (process.env.ENFORCE_NEW_COURSE_ACCESS !== "true") return redirectToAccessPage();

  if (!(await hasValidAccess(request))) return redirectToAccessPage();
  return;
}

export const config = {
  matcher: ["/ia-facil/curso-nuevo/:path*"]
};
