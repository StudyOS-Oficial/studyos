/*
  StudyOS | Meta Pixel con consentimiento de cookies

  - El Pixel (ID 1420061570074591) SOLO se carga si la persona pulsa "Aceptar".
    Si pulsa "Rechazar" (o no elige), no se carga nada de Meta.
  - Desde las páginas puedes usar:
      studyosTrack("Lead", { ... })            lanza un evento si hay consentimiento
      studyosWhenConsented(function () { ... }) ejecuta código cuando hay consentimiento
  - La elección se guarda en el navegador (localStorage) con la clave "studyos_cookies".
*/
(function () {
  "use strict";

  var PIXEL_ID = "1420061570074591";
  var KEY = "studyos_cookies"; // "granted" (acepta) o "denied" (rechaza)

  var waiting = [];
  var pixelLoaded = false;

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

  function grant() {
    saveConsent("granted");
    loadPixel();
    if (window.fbq) window.fbq("consent", "grant");
    var callbacks = waiting.splice(0);
    callbacks.forEach(function (cb) { try { cb(); } catch (e) {} });
  }

  function deny() {
    saveConsent("denied");
    waiting = [];
    if (window.fbq) window.fbq("consent", "revoke");
    // Borra las cookies del Pixel si ya existían
    var host = location.hostname;
    ["_fbp", "_fbc"].forEach(function (name) {
      document.cookie = name + "=; Max-Age=0; path=/";
      document.cookie = name + "=; Max-Age=0; path=/; domain=" + host;
      document.cookie = name + "=; Max-Age=0; path=/; domain=." + host;
    });
  }

  /* ---------- API pública para las páginas ---------- */
  window.studyosTrack = function (name, params, options) {
    if (readConsent() === "granted" && window.fbq) {
      window.fbq("track", name, params || {}, options || {});
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
      "<p>Usamos cookies de medición de Meta (Facebook e Instagram) para saber qué anuncios funcionan. " +
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
