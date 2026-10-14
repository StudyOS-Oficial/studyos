const PIXEL_ID = "1420061570074591";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://studyos-oficial.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) return res.status(503).json({ error: "CAPI no configurada" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const eventName = body.event_name;
    const eventId = body.event_id;
    const sourceUrl = body.event_source_url || "https://studyos-oficial.github.io/studyos/ia-facil/";
    const testEventCode = body.test_event_code || new URL(req.url, "https://example.com").searchParams.get("test_event_code");
    if (!["PageView", "ViewContent", "InitiateCheckout"].includes(eventName) || !eventId) {
      return res.status(400).json({ error: "Evento no válido" });
    }
    const userData = {
      client_user_agent: req.headers["user-agent"],
      ...(req.headers["x-forwarded-for"] ? { client_ip_address: req.headers["x-forwarded-for"].split(",")[0].trim() } : {}),
      ...(body.fbp ? { fbp: body.fbp } : {}),
      ...(body.fbc ? { fbc: body.fbc } : {})
    };
    const customData = eventName === "InitiateCheckout"
      ? { content_name: "IA fácil — Curso completo", value: 9.90, currency: "EUR" }
      : { content_name: "IA fácil — Curso completo", content_category: "curso" };
    const response = await fetch("https://graph.facebook.com/v23.0/" + PIXEL_ID + "/events?access_token=" + encodeURIComponent(token), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [{ event_name: eventName, event_time: Math.floor(Date.now() / 1000), event_id: eventId, action_source: "website", event_source_url: sourceUrl, user_data: userData, custom_data: customData }], ...(testEventCode ? { test_event_code: testEventCode } : {}) })
    });
    const result = await response.json();
    if (!response.ok) { console.error("Meta CAPI rejected event", result); return res.status(502).json({ error: "Meta CAPI error" }); }
    return res.status(200).json({ ok: true, events_received: result.events_received ?? 1 });
  } catch (error) {
    console.error("Meta CAPI error", error);
    return res.status(500).json({ error: "Error enviando evento" });
  }
}
