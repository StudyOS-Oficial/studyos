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
    headers: {
      ...cors(),
      "Content-Type": "application/json; charset=utf-8"
    }
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

  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }

  const event = clean(body.event, 40);

  if (![
    "page_view",
    "cta_click",
    "purchase_click",
    "scroll_depth",
    "course_view","module_click","module_view","quiz_started","quiz_completed","module_completed","course_completed","consent_granted"
  ].includes(event)) {
    return json({ ok: false }, 400);
  }

  const scrollPercent =
    Number(body.scroll_percent);

  if (
    event === "scroll_depth" &&
    ![25, 50, 75, 90, 100].includes(scrollPercent)
  ) {
    return json({ ok: false }, 400);
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const ua = request.headers.get("User-Agent") || "";

  const data = {
    event,
    ts: now,

    visitor_id: clean(
      body.visitor_id,
      80
    ),

    path: clean(
      body.path,
      200
    ),

    referrer: clean(
      body.referrer,
      300
    ),

    utm_source: clean(
      body.utm_source,
      80
    ),

    utm_medium: clean(
      body.utm_medium,
      80
    ),

    utm_campaign: clean(
      body.utm_campaign,
      120
    ),

    device: deviceFromUA(ua),

    country: clean(
      request.headers.get("CF-IPCountry") || "",
      10
    )
  };

  if (event === "scroll_depth") {
    data.scroll_percent = scrollPercent;
  }

  await env.CURSOIA.put(
    "event:" + Date.now() + ":" + id,
    JSON.stringify(data),
    {
      expirationTtl: 60 * 60 * 24 * 180
    }
  );

  return json({ ok: true }, 201);
}

async function stats(request, env) {
  const events = [];
  let cursor = undefined;

  do {
    const page = await env.CURSOIA.list({
      prefix: "event:",
      limit: 1000,
      cursor
    });

    for (const key of page.keys) {
      const raw = await env.CURSOIA.get(key.name);

      if (raw) {
        try {
          events.push(JSON.parse(raw));
        } catch {}
      }
    }

    cursor = page.list_complete
      ? undefined
      : page.cursor;

  } while (cursor);

  events.sort(
    (a, b) =>
      new Date(b.ts) - new Date(a.ts)
  );

  const pageViews =
    events.filter(e => e.event === "page_view");

  const uniqueVisitors =
    new Set(
      pageViews
        .map(e => e.visitor_id)
        .filter(Boolean)
    );

  const totals = {
    visits: pageViews.length,
    uniqueVisitors: uniqueVisitors.size,
    cta: events.filter(
      e => e.event === "cta_click"
    ).length,
    stripe: events.filter(
      e => e.event === "purchase_click"
    ).length
  };

  const byDay = {};
  const bySource = {};
  const byMedium = {};
  const byCampaign = {};
  const byDevice = {};
  const byCountry = {};

  for (const e of pageViews) {
    const day = e.ts.slice(0, 10);
    byDay[day] =
      (byDay[day] || 0) + 1;

    const source =
      e.utm_source || "direct";
    bySource[source] =
      (bySource[source] || 0) + 1;

    if (e.utm_medium) {
      byMedium[e.utm_medium] =
        (byMedium[e.utm_medium] || 0) + 1;
    }

    if (e.utm_campaign) {
      byCampaign[e.utm_campaign] =
        (byCampaign[e.utm_campaign] || 0) + 1;
    }

    const device =
      e.device || "unknown";
    byDevice[device] =
      (byDevice[device] || 0) + 1;

    const country =
      e.country || "unknown";
    byCountry[country] =
      (byCountry[country] || 0) + 1;
  }

  const visitorsByDepth = {
    25: new Set(),
    50: new Set(),
    75: new Set(),
    90: new Set(),
    100: new Set()
  };

  for (const e of events) {
    if (
      e.event !== "scroll_depth" ||
      !e.visitor_id ||
      !visitorsByDepth[e.scroll_percent]
    ) {
      continue;
    }

    visitorsByDepth[e.scroll_percent].add(
      e.visitor_id
    );
  }

  const scrollDepth = {};

  for (const threshold of [25, 50, 75, 90, 100]) {
    const reached =
      visitorsByDepth[threshold].size;

    scrollDepth[threshold] = {
      visitors: reached,
      percentage: uniqueVisitors.size
        ? Number(
            ((reached / uniqueVisitors.size) * 100)
              .toFixed(1)
          )
        : 0
    };
  }

  const allScrollEvents =
    events.filter(
      e =>
        e.event === "scroll_depth" &&
        Number.isFinite(e.scroll_percent)
    );

  const averageScroll =
    allScrollEvents.length
      ? Number(
          (
            allScrollEvents.reduce(
              (sum, e) =>
                sum + e.scroll_percent,
              0
            ) / allScrollEvents.length
          ).toFixed(1)
        )
      : 0;

  const courseEvents=events.filter(e=>["course_view","module_click","module_view","quiz_started","quiz_completed","module_completed","course_completed"].includes(e.event));
  const courseViews=courseEvents.filter(e=>e.event==="course_view");
  const courseVisitors=new Set(courseEvents.map(e=>e.visitor_id).filter(Boolean));
  const courseByDay={}; const modules={}; const completedModules={}; const quizzes={started:0,completed:0};
  for(const e of courseEvents){const day=e.ts.slice(0,10);courseByDay[day]=(courseByDay[day]||0)+1;if(Number.isFinite(e.module)){if(e.event==="module_click"||e.event==="module_view")modules[e.module]=(modules[e.module]||0)+1;if(e.event==="module_completed")completedModules[e.module]=(completedModules[e.module]||0)+1;}if(e.event==="quiz_started")quizzes.started++;if(e.event==="quiz_completed")quizzes.completed++;}
  const safeRecent=events.slice(0,100).map(({visitor_id,referrer,...e})=>e);

  return json({
    totals,
    course:{views:courseViews.length,uniqueVisitors:courseVisitors.size,moduleClicks:courseEvents.filter(e=>e.event==="module_click").length,moduleViews:courseEvents.filter(e=>e.event==="module_view").length,moduleCompleted:courseEvents.filter(e=>e.event==="module_completed").length,courseCompleted:courseEvents.filter(e=>e.event==="course_completed").length,quizzes,byDay:courseByDay,modules,completedModules},
    conversion: {
      cta: totals.visits
        ? Number(
            ((totals.cta / totals.visits) * 100)
              .toFixed(1)
          )
        : 0,
      stripe: totals.visits
        ? Number(
            ((totals.stripe / totals.visits) * 100)
              .toFixed(1)
          )
        : 0
    },
    scrollDepth,
    averageScroll,
    byDay,
    bySource,
    byMedium,
    byCampaign,
    byDevice,
    byCountry,
    recent: safeRecent
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors()
      });
    }

    const url = new URL(request.url);

    if (
      url.pathname === "/track" &&
      request.method === "POST"
    ) {
      return track(request, env);
    }

    if (
      url.pathname === "/stats" &&
      request.method === "GET"
    ) {
      return stats(request, env);
    }

    return json({
      service: "IA fácil analytics",
      endpoints: [
        "POST /track",
        "GET /stats"
      ]
    });
  }
};