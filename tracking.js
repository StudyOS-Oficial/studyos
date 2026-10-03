/*
  StudyOS | Meta Pixel y Google Analytics con consentimiento de cookies

  - El Pixel de Meta (ID 1420061570074591) y Google (Tag Manager GTM-NJCNBN9C y Analytics G-JL08TE3FSM)
    SOLO se cargan si la persona pulsa "Aceptar".
    Si pulsa "Rechazar" (o no elige), no se carga nada de Meta ni de Google.
  - Atribución de anuncios: ?dolor= y utm_* se conservan (solo con consentimiento) en localStorage ("studyos_attribution", 30 días).
  - Analítica del embudo: studyosFunnel("view_item" | "begin_checkout" | "generate_lead" | "purchase" | ...) envía a GA4 (y a Meta cuando existe
    un evento estándar equivalente). Nunca se envían las respuestas del test ni datos personales.
  - Desde las páginas puedes usar:
      studyosTrack("Lead", { ... })            lanza un evento si hay consentimiento
      studyosWhenConsented(function () { ... }) ejecuta código cuando hay consentimiento
  - La elección se guarda en el navegador (localStorage) con la clave "studyos_cookies".
*/
(function () {
  "use strict";

  var PIXEL_ID = "1420061570074591";
  var GTM_ID = "GTM-NJCNBN9C";
  var GA_ID = "G-JL08TE3FSM";
  var KEY = "studyos_cookies"; // "granted" (acepta) o "denied" (rechaza)

  // Producto de pago (se usa en los eventos de GA4 y de Meta)
  var PRODUCT = { id: "hoy-como-bien-completo", name: "Hoy Como Bien · Completo", price: 5, currency: "EUR" };
  var ATTR_KEY = "studyos_attribution";
  var ATTR_TTL = 30 * 24 * 3600 * 1000; // 30 días
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var QUIZ_KEY = "studyos_quiz";
  var META_QUIZ_EVENTS = false; // pon true para enviar QuizStart / QuizComplete a Meta (sin respuestas). Ver nota en la entrega.

  var waiting = [];
  var pixelLoaded = false;
  var googleLoaded = false;

  function readConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveConsent(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  /* ---------- Pixel de Meta (código base oficial) ---------- */
  function loadPixel() {
    if (pixelLoaded) return;
    pixelLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  /* ---------- Google Tag Manager y Google Analytics (mismo código que tenías, pero con consentimiento) ---------- */
  function loadGoogle() {
    if (googleLoaded) return;
    googleLoaded = true;
    window["ga-disable-" + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", GTM_ID);
    window.gtag = function () { window.dataLayer.push(arguments); };
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(g);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, gaConfigParams());
  }

  function deleteCookie(name) {
    var host = location.hostname;
    document.cookie = name + "=; Max-Age=0; path=/";
    document.cookie = name + "=; Max-Age=0; path=/; domain=" + host;
    document.cookie = name + "=; Max-Age=0; path=/; domain=." + host;
  }


  /* ---------- Atribución del anuncio (?dolor= y utm_*) ---------- */
  function cleanVal(v) { return typeof v === "string" && /^[A-Za-z0-9_\-\.]{1,64}$/.test(v) ? v : ""; }
  function attributionFromUrl() {
    var a = {};
    try {
      var p = new URLSearchParams(location.search);
      var key = window.studyosPainKey ? window.studyosPainKey() : "";
      if (key) a.pain_point = key;
      var ad = cleanVal(String(p.get("ad") || "").toLowerCase());
      if (["original","soso","hoycomobien","whatsappstory"].indexOf(ad) > -1) a.ad = ad;
      UTM_KEYS.forEach(function (k) { var v = cleanVal(p.get(k)); if (v) a[k] = v; });
    } catch (e) {}
    return a;
  }
  var attr = attributionFromUrl(); // en memoria durante la página

  function storedAttribution() {
    try {
      var raw = localStorage.getItem(ATTR_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || !o.ts || Date.now() - o.ts > ATTR_TTL) { localStorage.removeItem(ATTR_KEY); return null; }
      var clean = {};
      Object.keys(o).forEach(function (k) { if (k === "pain_point" || k === "ad" || UTM_KEYS.indexOf(k) > -1) clean[k] = cleanVal(o[k]); });
      return clean;
    } catch (e) { return null; }
  }
  // Con consentimiento: si llegan parámetros nuevos se guardan; si no, se recupera lo guardado (así llega hasta la compra)
  function hydrateAttribution() {
    /* If the visitor arrived through an ad before granting analytics consent,
       recover only the categorical ad label stored for this tab. */
    if (!attr.ad) {
      try {
        var sessionAd = String(sessionStorage.getItem("studyos_anon_ad") || "").toLowerCase();
        if (["original","soso","hoycomobien","whatsappstory"].indexOf(sessionAd) > -1) attr.ad = sessionAd;
      } catch (e) {}
    }
    if (Object.keys(attr).length) {
      try { var o = {}; Object.keys(attr).forEach(function (k) { o[k] = attr[k]; }); o.ts = Date.now(); localStorage.setItem(ATTR_KEY, JSON.stringify(o)); } catch (e) {}
    } else {
      var s = storedAttribution();
      if (s) attr = s;
    }
  }
  function gaParams() {
    var out = {
      landing_variant: attr.pain_point ? "dolor_" + attr.pain_point : "default",
      ad_angle: attr.ad || attr.utm_content || attr.pain_point || "none"
    };
    if (attr.pain_point) out.pain_point = attr.pain_point;
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "ad"].forEach(function (k) { if (attr[k]) out[k] = attr[k]; });
    return out;
  }
  function gaConfigParams() {
    var g = gaParams();
    var c = { landing_variant: g.landing_variant, ad_angle: g.ad_angle };
    if (g.pain_point) c.pain_point = g.pain_point;
    return c;
  }
  window.studyosAttribution = function () { return gaParams(); };
  // Referencia sin datos personales para el pago de Stripe (aparece en el pago como client_reference_id)
  window.studyosCheckoutRef = function () {
    if (readConsent() !== "granted") return "";
    var g = gaParams();
    return g.ad_angle && g.ad_angle !== "none" ? ("ad-" + g.ad_angle).slice(0, 60) : "";
  };

  /* ---------- Almacén con consentimiento (avisos como "ya hiciste el test") ---------- */
  var memStore = {};
  window.studyosStore = {
    get: function (k) {
      if (readConsent() === "granted") { try { var v = localStorage.getItem(k); if (v !== null) return v; } catch (e) {} }
      return memStore[k] || null;
    },
    set: function (k, v) {
      memStore[k] = v;
      if (readConsent() === "granted") { try { localStorage.setItem(k, v); } catch (e) {} }
    }
  };

  /* ---------- Eventos de GA4 y del embudo ---------- */
  function items() { return [{ item_id: PRODUCT.id, item_name: PRODUCT.name, item_category: "digital_app", price: PRODUCT.price, quantity: 1 }]; }
  window.studyosGA = function (name, params) {
    if (readConsent() !== "granted" || !window.gtag) return;
    var p = gaParams();
    if (params) Object.keys(params).forEach(function (k) { p[k] = params[k]; });
    window.gtag("event", name, p);
  };
  window.studyosFunnel = function (name, extra) {
    extra = extra || {};
    var eco = { currency: PRODUCT.currency, value: PRODUCT.price, items: items() };
    switch (name) {
      case "view_item": // producto de pago a la vista
        window.studyosGA("view_item", eco);
        window.studyosTrack("ViewContent", { content_name: PRODUCT.name, content_type: "product", value: PRODUCT.price, currency: PRODUCT.currency });
        break;
      case "begin_checkout":
        window.studyosGA("begin_checkout", Object.assign({}, eco, extra));
        window.studyosTrack("InitiateCheckout", { content_name: PRODUCT.name, content_type: "product", value: PRODUCT.price, currency: PRODUCT.currency, num_items: 1 });
        break;
      case "generate_lead": // llega a la página de las 10 recetas gratis
        window.studyosGA("generate_lead", extra);
        window.studyosTrack("Lead", { content_name: "10 Recetas Antiinflamatorias (gratis)", content_category: "recetario gratuito" });
        break;
      case "purchase": {
        var id = extra.transaction_id;
        window.studyosGA("purchase", Object.assign({}, eco, { transaction_id: id }));
        window.studyosTrack("Purchase", { value: PRODUCT.price, currency: PRODUCT.currency, content_name: PRODUCT.name, content_type: "product", content_ids: [PRODUCT.id] }, { eventID: id });
        break;
      }
      case "quiz_start":
      case "quiz_complete":
        window.studyosGA(name, extra);
        if (META_QUIZ_EVENTS) window.studyosTrackCustom(name === "quiz_start" ? "QuizStart" : "QuizComplete", {});
        break;
      default: // quiz_question_N, recipe_result_view, free_download_click...
        window.studyosGA(name, extra);
    }
  };
  window.studyosProduct = PRODUCT;


  /* ---------- StudyOS anonymous aggregate funnel ---------- */
  var ANON_ENDPOINT = "https://studyos-analytics.studyos-oficial-spain.workers.dev/";

  var ANON_AD_KEY = "studyos_anon_ad";
  var VALID_ADS = ["original","soso","hoycomobien","whatsappstory"];
  function anonymousAdVariant() {
    var candidate = "";
    try {
      var p = new URLSearchParams(location.search);
      var direct = String(p.get("ad") || "").toLowerCase();
      var content = String(p.get("utm_content") || "").toLowerCase();
      if (VALID_ADS.indexOf(direct) > -1) candidate = direct;
      else if (VALID_ADS.indexOf(content) > -1) candidate = content;
      if (candidate) {
        try { sessionStorage.setItem(ANON_AD_KEY, candidate); } catch (e) {}
        return candidate;
      }
      try {
        var stored = String(sessionStorage.getItem(ANON_AD_KEY) || "").toLowerCase();
        if (VALID_ADS.indexOf(stored) > -1) return stored;
      } catch (e) {}
    } catch (e) {}
    return "unknown";
  }

  window.studyosAnon = function (eventName) {
    var map = {
      "StudyOSView": "visit",
      "FreeEngaged": "quiz_start",
      "RecommendationComplete": "recommendation_complete",
      "RecipeOpen": "recipe_open",
      "PlusView": "plus_view",
      "InitiateCheckout": "checkout_click"
    };
    var event = map[eventName] || eventName;
    if (["visit","free_start","visible_5s","scroll_25","first_action","quiz_start","quiz_q1","quiz_q2","quiz_q3","quiz_q4","quiz_q5","authority_entry_continue","validation_science_continue","recommendation_complete","recommendation_no_match","explore_click","random_click","recipe_open","plus_view","checkout_click"].indexOf(event) === -1) return;

    fetch(ANON_ENDPOINT, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({event:event, ad:anonymousAdVariant()}),
      keepalive: true,
      credentials: "omit",
      referrerPolicy: "no-referrer"
    }).catch(function(){});
  };

  /* ---------- StudyOS measurement v1: canonical events ---------- */
  window.studyosMeasure = function (eventName, params) {
    params = params || {};
    if (readConsent() !== "granted") return false;

    var gaName = {
      "StudyOSView": "studyos_view",
      "FreeEngaged": "free_engaged",
      "RecommendationComplete": "recommendation_complete",
      "RecipeOpen": "recipe_open",
      "PlusView": "plus_view"
    }[eventName];

    if (gaName) window.studyosGA(gaName, params);

    /* Meta custom events use the exact canonical names shown above. */
    if (["StudyOSView","FreeEngaged","RecommendationComplete","RecipeOpen","PlusView"].indexOf(eventName) > -1) {
      window.studyosTrackCustom(eventName, params);
    }
    return true;
  };


  function grant() {
    saveConsent("granted");
    hydrateAttribution();
    loadPixel();
    loadGoogle();
    if (window.fbq) window.fbq("consent", "grant");
    var callbacks = waiting.splice(0);
    callbacks.forEach(function (cb) { try { cb(); } catch (e) {} });
  }

  function deny() {
    saveConsent("denied");
    try { localStorage.removeItem(ATTR_KEY); localStorage.removeItem(QUIZ_KEY); } catch (e) {}
    waiting = [];
    window["ga-disable-" + GA_ID] = true;
    if (window.fbq) window.fbq("consent", "revoke");
    // Borra las cookies de medición si ya existían
    ["_fbp", "_fbc", "_gid"].forEach(deleteCookie);
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name.indexOf("_ga") === 0 || name.indexOf("_gat") === 0) deleteCookie(name);
    });
  }

  /* ---------- API pública para las páginas ---------- */
  window.studyosTrack = function (name, params, options) {
    if (readConsent() === "granted" && window.fbq) {
      window.fbq("track", name, params || {}, options || {});
    }
  };

  window.studyosTrackCustom = function (name, params) {
    if (readConsent() === "granted" && window.fbq) {
      window.fbq("trackCustom", name, params || {});
    }
  };

  window.studyosWhenConsented = function (callback) {
    var c = readConsent();
    if (c === "granted") callback();
    else if (c !== "denied") waiting.push(callback);
  };

  /* ---------- Aviso de cookies ---------- */
  function injectStyles() {
    if (document.getElementById("studyos-cookies-css")) return;
    var css =
      "#studyos-cookies{position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:520px;" +
      "background:#2B3520;color:#F2F4E6;border-radius:16px;padding:18px 20px;" +
      "box-shadow:0 18px 44px rgba(31,39,21,.4);font:400 .95rem/1.5 Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;" +
      "padding-bottom:calc(18px + env(safe-area-inset-bottom,0px))}" +
      "#studyos-cookies p{margin:0 0 14px}" +
      "#studyos-cookies a{color:#B7C48B}" +
      "#studyos-cookies .sc-btns{display:flex;gap:10px}" +
      "#studyos-cookies button{flex:1;min-height:44px;border-radius:999px;border:2px solid #F2F4E6;" +
      "background:#F2F4E6;color:#2B3520;font:600 .95rem/1 Inter,system-ui,sans-serif;cursor:pointer}" +
      "#studyos-cookies button:hover{background:#fff;border-color:#fff}" +
      "#studyos-cookies button:focus-visible{outline:3px solid #F2C230;outline-offset:2px}" +
      "@media(min-width:640px){#studyos-cookies{left:24px;right:auto;bottom:24px}}";
    var style = document.createElement("style");
    style.id = "studyos-cookies-css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.getElementById("studyos-cookies")) return;
    injectStyles();
    var box = document.createElement("div");
    box.id = "studyos-cookies";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Aviso de cookies");
    box.innerHTML =
      "<p>Usamos cookies de medición de Meta (Facebook e Instagram) y de Google Analytics para saber qué anuncios funcionan y cómo se usa la web. " +
      "Solo se activan si las aceptas. <a href=\"privacidad.html#cookies\">Más información</a></p>" +
      '<div class="sc-btns">' +
      '<button type="button" data-a="deny">Rechazar</button>' +
      '<button type="button" data-a="grant">Aceptar</button>' +
      "</div>";
    box.addEventListener("click", function (e) {
      var action = e.target && e.target.getAttribute && e.target.getAttribute("data-a");
      if (!action) return;
      if (action === "grant") grant(); else deny();
      box.remove();
    });
    document.body.appendChild(box);
  }

  function init() {
    var c = readConsent();
    if (c === "granted") grant();
    else if (c !== "denied") showBanner();
    var settings = document.getElementById("cookie-settings");
    if (settings) settings.addEventListener("click", showBanner);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();


/* ---------- LP6 diagnostic signals (landing only; aggregate, no answers / no user IDs) ---------- */
(function(){
  "use strict";
  if(!document.getElementById("inlineRecommender")) return;
  var PREFIX="studyos_lp6d_d8_diag_";

  function once(key,eventName){
    try{
      if(sessionStorage.getItem(PREFIX+key)) return false;
      sessionStorage.setItem(PREFIX+key,"1");
    }catch(e){}
    try{
      if(typeof window.studyosAnon==="function") window.studyosAnon(eventName);
    }catch(e){}
    return true;
  }

  /* Count only if the page stays continuously visible for 5 seconds. */
  var visibleTimer=null;
  function armVisibleTimer(){
    if(document.visibilityState!=="visible" || visibleTimer) return;
    visibleTimer=setTimeout(function(){
      visibleTimer=null;
      if(document.visibilityState==="visible") once("visible_5s","visible_5s");
    },5000);
  }
  function disarmVisibleTimer(){
    if(visibleTimer){ clearTimeout(visibleTimer); visibleTimer=null; }
  }
  document.addEventListener("visibilitychange",function(){
    if(document.visibilityState==="visible") armVisibleTimer();
    else disarmVisibleTimer();
  });
  armVisibleTimer();

  /* 25% of the actually scrollable page. */
  function checkScroll25(){
    var doc=document.documentElement;
    var max=Math.max(0,doc.scrollHeight-window.innerHeight);
    if(max>0 && window.scrollY/max>=0.25){
      once("scroll_25","scroll_25");
      window.removeEventListener("scroll",checkScroll25);
    }
  }
  window.addEventListener("scroll",checkScroll25,{passive:true});

  /* Exact actions. Only real product interaction counts as first_action.
     Cookie consent, legal links and synthetic clicks do not count. */
  document.addEventListener("click",function(e){
    var target=e.target.closest && e.target.closest("button,a,.recipe,input,select");
    if(!target) return;

    var meaningful=target.closest && target.closest(
      '#lp6AuthorityContinue,[data-quick-moment],.lp6-choice,#lp6ScienceContinue,.lp4-choice,[data-go="explore"],[data-go="plan"],[data-go="plus"],#randomBtn,.recipe,.freeMenuRecipeLink,a[href*="buy.stripe.com"]'
    );
    if(e.isTrusted && meaningful) once("first_action","first_action");

    var explore=target.closest && target.closest('[data-go="explore"]');
    if(explore && e.isTrusted) once("explore_click","explore_click");

    if(e.isTrusted && (target.id==="randomBtn" || (target.closest && target.closest("#randomBtn")))){
      once("random_click","random_click");
    }
  },true);
})();
