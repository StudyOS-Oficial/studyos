/* IA fácil · puerta de acceso. Descifra la página en el navegador con la contraseña del curso. */
(function () {
  "use strict";
  var S = document.currentScript, BASE = new URL(".", S.src).href, KS = "iafacil-lock-v1", sub = crypto.subtle;
  var pay = JSON.parse(document.getElementById("payload").textContent), meta;
  var d = function (s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  var e = function (a) { var s = ""; for (var i = 0; i < a.length; i += 8192) s += String.fromCharCode.apply(null, a.subarray(i, i + 8192)); return btoa(s); };
  async function open(W) {
    var kraw = await sub.decrypt({ name: "AES-GCM", iv: d(meta.iv) }, W, d(meta.wrapped));
    var K = await sub.importKey("raw", kraw, "AES-GCM", false, ["decrypt"]);
    return new TextDecoder().decode(await sub.decrypt({ name: "AES-GCM", iv: d(pay.iv) }, K, d(pay.ct)));
  }
  function render(html) { document.open(); document.write(html); document.close(); }
  async function addTheory(html) {
    try {
      var n = (location.pathname.match(/modulo-(\\d+)/) || [])[1];
      if (!n || !window.fetch) return html;
      var r = await fetch(BASE + "teoria-extra.js", { cache: "no-store" });
      if (!r.ok) return html;
      var src = await r.text(), fn = new Function(src + "; return window.IA_FACIL_THEORY;");
      var all = fn(), blocks = all && all[n];
      if (!blocks || !blocks.length) return html;
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (x) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[x]; }); };
      var css = '<style id="iafacil-extra-css">.ia-extra{margin:28px 0;padding:22px;border-radius:18px;background:linear-gradient(135deg,#fff8f1,#fff);border:1px solid rgba(224,118,59,.22);box-shadow:0 8px 30px rgba(0,0,0,.06)}.ia-extra h2{margin:0 0 8px;font-size:25px}.ia-extra-intro{margin:0 0 18px;opacity:.78}.ia-extra-grid{display:grid;gap:14px}.ia-extra-card{padding:17px 18px;border-radius:14px;background:#fff;border:1px solid rgba(0,0,0,.08)}.ia-extra-card h3{margin:0 0 7px;font-size:18px}.ia-extra-card p{margin:0;line-height:1.6}@media(prefers-color-scheme:dark){.ia-extra{background:#202020;border-color:#444}.ia-extra-card{background:#292929;border-color:#444}}</style>';
      var body = '<section class="ia-extra"><h2>📚 En profundidad</h2><p class="ia-extra-intro">Una ampliación para entender mejor las ideas clave de este módulo.</p><div class="ia-extra-grid">' +
        blocks.map(function (b) { return '<article class="ia-extra-card"><h3>' + esc(b[0]) + '</h3><p>' + esc(b[1]) + '</p></article>'; }).join("") +
        '</div></section>';
      var pos = html.toLowerCase().lastIndexOf("</main>");
      if (pos >= 0) return html.slice(0,pos) + body + html.slice(pos);
      pos = html.toLowerCase().lastIndexOf("</body>");
      if (pos >= 0) return html.slice(0,pos) + css + body + html.slice(pos);
      return html + css + body;
    } catch (x) { return html; }
  }
  async function fromPw(pw) {
    var b = await sub.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
    return sub.deriveKey({ name: "PBKDF2", salt: d(meta.salt), iterations: meta.iter, hash: "SHA-256" }, b, { name: "AES-GCM", length: 256 }, true, ["decrypt"]);
  }
  var css = "body{margin:0;font:20px/1.5 system-ui,sans-serif;background:#faf7f2;color:#222;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}" +
    "@media(prefers-color-scheme:dark){body{background:#161616;color:#eee}.g{background:#222!important}}" +
    ".g{box-sizing:border-box;max-width:440px;width:100%;background:#fff;border-radius:18px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.1)}h1{margin:0 0 8px;font-size:30px}" +
    "input[type=password],input[type=text]{width:100%;box-sizing:border-box;font:inherit;padding:14px;border:2px solid #bbb;border-radius:12px;margin:10px 0}" +
    "button{width:100%;font:inherit;font-weight:700;padding:16px;border:0;border-radius:12px;background:#e0763b;color:#fff;cursor:pointer;margin-top:6px}" +
    "label{display:block;margin:4px 0}#er{color:#c0392b;font-weight:700;min-height:1.5em}.s{font-size:16px;opacity:.8}";
  function gate() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    document.body.innerHTML = '<form class="g" id="f"><h1>🔐 Tu acceso personal a IA Fácil</h1><p>Te hemos generado esta <b>contraseña unipersonal</b> para acceder al curso.</p><p><b>Guarda esta contraseña en un lugar seguro. La necesitarás para acceder al curso.</b></p><input id="pw" type="password" autocomplete="current-password" aria-label="Contraseña" autofocus><label><input type="checkbox" id="sh"> Ver la contraseña</label><button id="ok" type="submit">Entrar al curso</button><p id="er" role="alert"></p><p class="s">Una vez introducida en tu dispositivo, <b>no tendrás que volver a escribirla</b>.</p><p class="s" id="ct"></p></form>';
    var em = meta && meta.contact; if (em && /^[^\s<>"']+@[^\s<>"']+$/.test(em)) {
      var a = document.createElement("a"); a.href = "mailto:" + em; a.textContent = em;
      document.getElementById("ct").append("¿Problemas para entrar? Escríbenos a ", a);
    }
    var pw = document.getElementById("pw"), er = document.getElementById("er"), ok = document.getElementById("ok");
    document.getElementById("sh").onchange = function () { pw.type = this.checked ? "text" : "password"; };
    document.getElementById("f").onsubmit = async function (ev) {
      ev.preventDefault(); er.textContent = ""; var v = pw.value.trim(); if (!v) { er.textContent = "Escribe la contraseña."; return; }
      ok.disabled = true; ok.textContent = "Comprobando…";
      try {
        var W = await fromPw(v), html;
        try { html = await open(W); } catch (x) { er.textContent = "Contraseña incorrecta. Revisa las mayúsculas y que no haya espacios."; ok.disabled = false; ok.textContent = "Entrar al curso"; return; }
        try { localStorage.setItem(KS, e(new Uint8Array(await sub.exportKey("raw", W)))); } catch (x) {}
        html = await addTheory(html); render(html);
      } catch (x) { er.textContent = "Ha habido un problema. Inténtalo de nuevo."; ok.disabled = false; ok.textContent = "Entrar al curso"; }
    };
  }
  (async function () {
    try { var r = await fetch(BASE + "lock.json", { cache: "no-store" }); if (!r.ok) throw 0; meta = await r.json(); }
    catch (x) { document.body.textContent = "No se ha podido cargar el curso. Revisa tu conexión e inténtalo de nuevo."; return; }
    var s = null; try { s = localStorage.getItem(KS); } catch (x) {}
    if (s) {
      try { render(await addTheory(await open(await sub.importKey("raw", d(s), "AES-GCM", false, ["decrypt"])))); return; }
      catch (x) { try { localStorage.removeItem(KS); } catch (y) {} }
    }
    gate();
  })();
})();