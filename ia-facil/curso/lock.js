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
  function polishQuiz(html) {
    var css = '<style id="quiz-polish">' +
      /* Cuestionarios: opciones blancas, letra negra y estados muy claros. */
      '.quiz button,.quiz .option,.quiz .answer,.quiz-option,.quiz-answer,button[onclick],a[onclick], [role="button"]{color:#172033!important;background:#fff!important;border:1px solid #d8e0ea!important;border-radius:14px!important;padding:14px 18px!important;text-align:left!important;font:inherit!important;cursor:pointer!important;transition:background .15s,border-color .15s,transform .05s!important}' +
      '.quiz button:hover,.quiz .option:hover,.quiz .answer:hover,.quiz-option:hover,.quiz-answer:hover,button[onclick]:hover,a[onclick]:hover,[role="button"]:hover{background:#f5f8fc!important}' +
      '.quiz-answer-correct,.quiz button.correct,.quiz .option.correct,.quiz .answer.correct,.quiz-option.correct,.quiz-answer.correct,[data-correct="true"].selected{background:#dff5e4!important;border-color:#35a853!important;color:#176b2c!important}' +
      '.quiz-answer-incorrect,.quiz button.incorrect,.quiz .option.incorrect,.quiz .answer.incorrect,.quiz-option.incorrect,.quiz-answer.incorrect,[data-correct="false"].selected{background:#fde2e2!important;border-color:#dc4c4c!important;color:#9b1c1c!important}' +
      '.quiz .answers,.quiz .options,.quiz-options{display:grid!important;gap:10px!important}' +
      '.quiz .answers>*+*,.quiz .options>*+*,.quiz-options>*+*{margin-top:0!important}' +
      '.course-nav-actions{display:flex!important;gap:14px!important;flex-wrap:wrap!important}.course-nav-actions>*{flex:1 1 220px!important}' +
      '</style>';
    if(html.indexOf('</head>')>=0) html=html.replace('</head>',css+'</head>');
    if (html.indexOf('</body>')>=0) html=html.replace('</body>','<script>(function(){' +
      'function isOpt(el){if(!el)return false;var t=(el.textContent||"").trim();return /^[A-D]\\.\\s/.test(t)}' +
      'function mark(el){' +
        'if(!isOpt(el))return;' +
        'el.classList.add("iaf-quiz-option");' +
        'el.style.setProperty("color","#172033","important");' +
        'var s=el.getAttribute("onclick")||"";' +
        'var dc=el.getAttribute("data-correct");' +
        'if(dc==="true") el.classList.add("quiz-answer-correct");' +
        'else if(dc==="false") el.classList.add("quiz-answer-incorrect");' +
        'el.addEventListener("click",function(){' +
          'var x=el.getAttribute("onclick")||"";' +
          'var d=el.getAttribute("data-correct");' +
          'el.classList.remove("quiz-answer-correct","quiz-answer-incorrect");' +
          'if(d==="true" || /(?:,|\\()\\s*true\\s*(?:\\)|,|$)/i.test(x)) el.classList.add("quiz-answer-correct");' +
          'else if(d==="false" || /(?:,|\\()\\s*false\\s*(?:\\)|,|$)/i.test(x)) el.classList.add("quiz-answer-incorrect");' +
        '},true);' +
      '}' +
      'document.querySelectorAll("button,a,[role=button]").forEach(mark);' +
      'document.addEventListener("click",function(ev){var el=ev.target.closest&&ev.target.closest("button,a,[role=button]");if(el&&isOpt(el))mark(el)},true);' +
    '})();<\\/script></body>');
    return html;
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
        render(polishQuiz(html));
      } catch (x) { er.textContent = "Ha habido un problema. Inténtalo de nuevo."; ok.disabled = false; ok.textContent = "Entrar al curso"; }
    };
  }
  (async function () {
    try { var r = await fetch(BASE + "lock.json", { cache: "no-store" }); if (!r.ok) throw 0; meta = await r.json(); }
    catch (x) { document.body.textContent = "No se ha podido cargar el curso. Revisa tu conexión e inténtalo de nuevo."; return; }
    var s = null; try { s = localStorage.getItem(KS); } catch (x) {}
    if (s) {
      try { render(polishQuiz(await open(await sub.importKey("raw", d(s), "AES-GCM", false, ["decrypt"])))); return; }
      catch (x) { try { localStorage.removeItem(KS); } catch (y) {} }
    }
    gate();
  })();
})();