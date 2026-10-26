/* IA fácil · banner de cookies + Meta Pixel (solo tras aceptar). */
(function () {
  "use strict";
  var PIXEL_ID = "1420061570074591";
  var EN = (document.documentElement.lang || "").slice(0, 2) === "en";
  var COOKIE = "ia_consent", PRICE = 14.9, CUR = EN ? "USD" : "EUR";
  var T = EN
    ? { t: "Cookies", p: "We use optional cookies (Meta) to measure our ads. You can accept or reject them; the course works the same either way.", a: "Accept", r: "Reject" }
    : { t: "Cookies", p: "Usamos cookies opcionales (Meta) para medir nuestros anuncios. Puedes aceptarlas o rechazarlas; el curso funciona igual en ambos casos.", a: "Aceptar", r: "Rechazar" };

  function getC() { var m = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]*)")); return m ? m[1] : ""; }
  function setC(v) { document.cookie = COOKIE + "=" + v + "; max-age=15552000; path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : ""); }

  var loaded = false;
  function loadPixel() {
    if (loaded || !/^\d{8,20}$/.test(PIXEL_ID)) return;
    loaded = true;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
    fbq("track", "ViewContent", { content_name: EN ? "AI Made Easy" : "IA fácil", value: PRICE, currency: CUR });
  }
  function ev() { if (loaded && window.fbq) fbq.apply(null, arguments); }

  // Purchase is called only after the server verifies the Stripe payment.
  window.iaMetaPurchase = function (id) {
    ev("track", "Purchase", { value: PRICE, currency: CUR, content_name: EN ? "AI Made Easy" : "IA fácil" }, id ? { eventID: String(id).slice(-40) } : undefined);
  };

  var lastIC = 0;
  addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("[data-checkout-trigger]");
    if (!el || !loaded || Date.now() - lastIC < 30000) return;
    lastIC = Date.now();
    ev("track", "InitiateCheckout", { value: PRICE, currency: CUR, content_name: EN ? "AI Made Easy" : "IA fácil" });
  }, true);

  var box;
  function css(el, s) { el.style.cssText = s; return el; }
  function hide() { if (box) { box.remove(); box = null; } }
  function choose(v) { setC(v); hide(); if (v === "granted") loadPixel(); else if (loaded) location.reload(); }
  function show() {
    if (box) return;
    box = css(document.createElement("div"), "position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:640px;margin:0 auto;background:#fff;color:#14213d;border:1px solid #d6dce8;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.25);padding:18px;font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif");
    box.setAttribute("role", "dialog"); box.setAttribute("aria-label", T.t);
    var p = css(document.createElement("p"), "margin:0 0 14px"); p.textContent = T.p;
    var row = css(document.createElement("div"), "display:flex;gap:10px;flex-wrap:wrap");
    var st = "flex:1 1 140px;min-height:48px;border-radius:12px;font:700 17px system-ui,sans-serif;cursor:pointer;border:2px solid #0a6cff;";
    var bR = css(document.createElement("button"), st + "background:#fff;color:#0a6cff"); bR.type = "button"; bR.textContent = T.r; bR.onclick = function () { choose("denied") };
    var bA = css(document.createElement("button"), st + "background:#0a6cff;color:#fff"); bA.type = "button"; bA.textContent = T.a; bA.onclick = function () { choose("granted") };
    row.appendChild(bR); row.appendChild(bA); box.appendChild(p); box.appendChild(row); document.body.appendChild(box);
  }
  function init() {
    document.querySelectorAll("[data-cookie-settings]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); show(); }); });
    var c = getC();
    if (c === "granted") loadPixel(); else if (c !== "denied") show();
  }
  if (getC() === "granted") loadPixel();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
