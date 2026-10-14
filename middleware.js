const SUPABASE_URL = "https://wquosenmzaezycdrpujz.supabase.co";
const SUPABASE_KEY = "sb_publishable_hCZNRQgU9Rco89U7FUr12w_pp91r7uM";

function getCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function isStaticAsset(path) {
  return /\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|map)$/i.test(path);
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const coursePrefix = "/ia-facil/curso";

  if (!path.startsWith(coursePrefix + "/") && path !== coursePrefix) return;
  if (path === coursePrefix + "/acceso" || path.startsWith(coursePrefix + "/acceso/")) return;
  if (isStaticAsset(path)) return;

  const token = getCookie(request, "ia_course_token");
  if (!token) {
    return Response.redirect(new URL(coursePrefix + "/acceso/", request.url), 302);
  }

  try {
    const response = await fetch(SUPABASE_URL + "/functions/v1/ia-facil-access", {
      headers: {
        Authorization: "Bearer " + token,
        apikey: SUPABASE_KEY
      },
      cache: "no-store"
    });

    const data = await response.json();
    if (!response.ok || data?.has_access !== true) {
      return Response.redirect(new URL(coursePrefix + "/acceso/?denied=1", request.url), 302);
    }
  } catch {
    return Response.redirect(new URL(coursePrefix + "/acceso/?denied=1", request.url), 302);
  }

  return;
}

export const config = {
  matcher: ["/ia-facil/curso/:path*"]
};
