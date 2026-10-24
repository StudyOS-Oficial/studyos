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
  function render(html) {
    // Responsive redesign of the course portal. The portal itself is encrypted,
    // so apply the visual layer after successful decryption without touching
    // the course content, progress logic or module links.
    var css = \`
      :root{--portal-bg:#f5f7fb;--portal-card:#fff;--portal-ink:#142033;--portal-muted:#64748b;--portal-blue:#1767dc;--portal-line:#dfe6ef}
      body{background:var(--portal-bg)!important;color:var(--portal-ink)!important}
      .wrap{max-width:980px!important;padding:18px 16px 52px!important}
      .hero{padding:42px 34px!important;border-radius:28px!important;margin-bottom:14px!important;box-shadow:0 10px 32px rgba(20,32,51,.06)!important}
      .hero h1{font-size:clamp(42px,8vw,72px)!important;line-height:.98!important;letter-spacing:-.045em!important;margin:10px 0 16px!important}
      .hero .muted{font-size:clamp(18px,2.2vw,22px)!important;line-height:1.45!important;max-width:760px}
      .grid{gap:10px!important}
      .card{padding:19px 20px!important;border-radius:20px!important;margin-bottom:0!important;box-shadow:0 5px 18px rgba(20,32,51,.045)!important}
      .card h2{font-size:clamp(21px,3vw,28px)!important;line-height:1.15!important;margin:7px 0 6px!important}
      .card .muted{font-size:15px!important;line-height:1.45!important;margin:0 0 12px!important}
      .num{font-size:.78rem!important;letter-spacing:.06em}
      .btn{padding:9px 13px!important;border-radius:11px!important}
      @media(max-width:700px){
        .wrap{padding:10px 12px 38px!important}
        .hero{padding:30px 22px!important;border-radius:24px!important;margin-bottom:10px!important}
        .hero h1{font-size:clamp(39px,11vw,58px)!important;margin:8px 0 12px!important}
        .hero .muted{font-size:17px!important;line-height:1.42!important}
        .grid{grid-template-columns:1fr!important;gap:8px!important}
        .card{padding:16px 17px!important;border-radius:18px!important}
        .card h2{font-size:21px!important;margin:6px 0 4px!important}
        .card .muted{font-size:14px!important;line-height:1.35!important;margin-bottom:10px!important}
        .btn{padding:8px 12px!important;font-size:15px!important}
      }
    \`;
    html = html.replace("</head>", "<style id=\"portal-responsive-redesign\">" + css + "</style></head>");
    document.open(); document.write(html); document.close();
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
        render(html);
      } catch (x) { er.textContent = "Ha habido un problema. Inténtalo de nuevo."; ok.disabled = false; ok.textContent = "Entrar al curso"; }
    };
  }
  (async function () {
    try { var r = await fetch(BASE + "lock.json", { cache: "no-store" }); if (!r.ok) throw 0; meta = await r.json(); }
    catch (x) { document.body.textContent = "No se ha podido cargar el curso. Revisa tu conexión e inténtalo de nuevo."; return; }
    var s = null; try { s = localStorage.getItem(KS); } catch (x) {}
    if (s) {
      try { render(await open(await sub.importKey("raw", d(s), "AES-GCM", false, ["decrypt"]))); return; }
      catch (x) { try { localStorage.removeItem(KS); } catch (y) {} }
    }
    gate();
  })();
})();