const ALLOWED_ORIGIN = "https://studyos-oficial.github.io";

function cors(extra = {}) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
    ...extra
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors(), "Content-Type": "application/json; charset=utf-8" }
  });
}

function deviceFromUA(ua = "") {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

function clean(value, max = 120) {
  return String(value ?? "").slice(0, max).replace(/[<>]/g, "");
}

async function track(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ ok:false }, 400); }

  const event = clean(body.event, 40);
  if (!["page_view","cta_click","purchase_click"].includes(event)) return json({ ok:false }, 400);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const ua = request.headers.get("User-Agent") || "";
  const data = {
    event,
    ts: now,
    path: clean(body.path, 200),
    referrer: clean(body.referrer, 300),
    utm_source: clean(body.utm_source, 80),
    utm_medium: clean(body.utm_medium, 80),
    utm_campaign: clean(body.utm_campaign, 120),
    device: deviceFromUA(ua),
    country: clean(request.headers.get("CF-IPCountry") || "", 10)
  };

  await env.CURSOIA.put("event:" + Date.now() + ":" + id, JSON.stringify(data), {
    expirationTtl: 60 * 60 * 24 * 180
  });

  return json({ ok:true }, 201);
}

async function stats(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const expected = env.DASHBOARD_TOKEN;
  if (!expected || auth !== "Bearer " + expected) return json({ error:"unauthorized" }, 401);

  const events = [];
  let cursor = undefined;
  do {
    const page = await env.CURSOIA.list({ prefix:"event:", limit:1000, cursor });
    for (const key of page.keys) {
      const raw = await env.CURSOIA.get(key.name);
      if (raw) {
        try { events.push(JSON.parse(raw)); } catch {}
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  events.sort((a,b)=>new Date(b.ts)-new Date(a.ts));

  const totals = { visits:0, cta:0, stripe:0 };
  const byDay = {}, bySource = {}, byDevice = {};
  for (const e of events) {
    if (e.event === "page_view") totals.visits++;
    if (e.event === "cta_click") totals.cta++;
    if (e.event === "purchase_click") totals.stripe++;
    if (e.event === "page_view") {
      const day = e.ts.slice(0,10);
      byDay[day] = (byDay[day] || 0) + 1;
      const source = e.utm_source || "direct";
      bySource[source] = (bySource[source] || 0) + 1;
      const device = e.device || "unknown";
      byDevice[device] = (byDevice[device] || 0) + 1;
    }
  }

  return json({ totals, byDay, bySource, byDevice, recent:events.slice(0,100) });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers:cors() });
    const url = new URL(request.url);
    if (url.pathname === "/track" && request.method === "POST") return track(request, env);
    if (url.pathname === "/stats" && request.method === "GET") return stats(request, env);
    return json({ service:"IA fácil analytics", endpoints:["POST /track","GET /stats"] });
  }
};