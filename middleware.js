const COOKIE_NAME = "__Host-ia_course_sandbox";
const ACCESS_PATH = "/ia-facil/curso/acceso/";
const SANDBOX_BRANCH = "sandbox/ia-facil-stripe-access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function base64UrlToBytes(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  try {
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function readCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  const prefix = name + "=";
  for (const part of cookieHeader.split(";")) {
    const item = part.trim();
    if (item.startsWith(prefix)) return item.slice(prefix.length);
  }
  return "";
}

async function hasValidCourseCookie(request, secret) {
  const value = readCookie(request, COOKIE_NAME);
  const parts = value.split(".");
  if (parts.length !== 2) return false;

  const payloadBytes = base64UrlToBytes(parts[0]);
  const signatureBytes = base64UrlToBytes(parts[1]);
  if (!payloadBytes || !signatureBytes) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    const now = Math.floor(Date.now() / 1000);
    if (
      typeof payload.session_id !== "string" ||
      !/^cs_test_[A-Za-z0-9]+$/.test(payload.session_id) ||
      !Number.isInteger(payload.iat) ||
      !Number.isInteger(payload.exp) ||
      payload.iat > now + 60 ||
      payload.exp <= now ||
      payload.exp <= payload.iat ||
      payload.exp - payload.iat > COOKIE_MAX_AGE
    ) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(parts[0])
    );
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  // This gate can only run on the sandbox Preview for its dedicated Git branch.
  // Production and every other Preview always pass through unchanged.
  if (
    process.env.ENFORCE_ACCESS !== "true" ||
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !== SANDBOX_BRANCH
  ) return;

  const pathname = new URL(request.url).pathname;
  if (
    pathname === "/ia-facil/curso/entrar" ||
    pathname === "/ia-facil/curso/entrar/" ||
    pathname === ACCESS_PATH ||
    pathname === "/ia-facil/curso/acceso" ||
    pathname.startsWith("/ia-facil/curso/acceso/")
  ) return;

  const secret = process.env.ACCESS_COOKIE_SECRET || "";
  if (new TextEncoder().encode(secret).byteLength < 32) {
    return new Response("La protección del curso no está configurada correctamente.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  if (await hasValidCourseCookie(request, secret)) return;

  const response = Response.redirect(new URL(ACCESS_PATH, request.url), 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Priority=High`
  );
  return response;
}

export const config = {
  matcher: ["/ia-facil/curso/:path*"]
};
