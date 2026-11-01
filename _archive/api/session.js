const SUPABASE_URL = "https://wquosenmzaezycdrpujz.supabase.co";
const SUPABASE_KEY = "sb_publishable_hCZNRQgU9Rco89U7FUr12w_pp91r7uM";

function setSessionCookie(value) {
  return "ia_course_token=" + encodeURIComponent(value) + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600";
}

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", "ia_course_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
    return res.status(204).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No autenticado" });

  const token = auth.slice(7);

  try {
    const userResponse = await fetch(SUPABASE_URL + "/auth/v1/user", {
      headers: {
        Authorization: "Bearer " + token,
        apikey: SUPABASE_KEY
      },
      cache: "no-store"
    });

    if (!userResponse.ok) return res.status(401).json({ error: "Sesión no válida" });

    const accessResponse = await fetch(SUPABASE_URL + "/functions/v1/ia-facil-access", {
      headers: {
        Authorization: "Bearer " + token,
        apikey: SUPABASE_KEY
      },
      cache: "no-store"
    });

    const access = await accessResponse.json();
    if (!accessResponse.ok || access?.has_access !== true) {
      return res.status(403).json({ error: "Sin acceso al curso" });
    }

    res.setHeader("Set-Cookie", setSessionCookie(token));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "No se pudo sincronizar la sesión" });
  }
}
