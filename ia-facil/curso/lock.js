/* IA fácil · puerta de acceso. Descifra la página en el navegador con la contraseña del curso. */
(function () {
  "use strict";
  // Evita el destello del contenido cifrado antes de que termine la apertura.
  document.documentElement.style.visibility = "hidden";
  var S = document.currentScript, BASE = new URL(".", S.src).href, KS = "iafacil-lock-v1", sub = crypto.subtle;
  var pay = JSON.parse(document.getElementById("payload").textContent), meta;
  var d = function (s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  var e = function (a) { var s = ""; for (var i = 0; i < a.length; i += 8192) s += String.fromCharCode.apply(null, a.subarray(i, i + 8192)); return btoa(s); };
  async function open(W) {
    var kraw = await sub.decrypt({ name: "AES-GCM", iv: d(meta.iv) }, W, d(meta.wrapped));
    var K = await sub.importKey("raw", kraw, "AES-GCM", false, ["decrypt"]);
    return new TextDecoder().decode(await sub.decrypt({ name: "AES-GCM", iv: d(pay.iv) }, K, d(pay.ct)));
  }
  function enhance(html) {
    if (typeof html !== "string" || !html.includes('<nav class="nav">')) return html;

    var uiCss = '<style id="iafacil-course-ui">' +
      '.quiz button{color:#142033!important;background:#fff!important;border:2px solid #dbe3ed!important;border-radius:16px!important;padding:15px 17px!important;min-height:54px!important;font-size:16px!important;line-height:1.35!important;font-weight:650!important;box-shadow:0 2px 7px rgba(20,32,51,.05);transition:background .16s,border-color .16s,color .16s,transform .08s,box-shadow .16s}' +
      '.quiz button:active{transform:scale(.99)}' +
      '.quiz button.iaf-correct{background:#dcf7e8!important;border-color:#27a967!important;color:#145c39!important;box-shadow:0 0 0 2px #b9ebcf!important}' +
      '.quiz button.iaf-wrong{background:#ffe3e3!important;border-color:#df5a5a!important;color:#7f1d1d!important;box-shadow:0 0 0 2px #f7c0c0!important}' +
      '.iaf-section-picker{display:none}' +
      '@media(max-width:850px){.iaf-section-picker{display:block;position:sticky;top:61px;z-index:4;margin:10px 14px 0;border:1px solid #dce4ee;border-radius:16px;background:rgba(255,255,255,.97);box-shadow:0 6px 20px rgba(20,32,51,.09);overflow:hidden}.iaf-section-picker summary{list-style:none;display:flex;align-items:center;gap:10px;padding:14px 16px;cursor:pointer;font-weight:800;color:#142033}.iaf-section-picker summary::-webkit-details-marker{display:none}.iaf-section-picker summary:after{content:"⌄";margin-left:auto;color:#65758b;font-size:18px}.iaf-section-picker[open] summary:after{content:"⌃"}.iaf-section-title{flex:1}.iaf-section-list{max-height:48vh;overflow:auto;border-top:1px solid #e7edf5;padding:7px}.iaf-section-list a{display:block;text-decoration:none;color:#142033!important;background:#fff;border-radius:11px;padding:11px 12px;margin:2px 0;font-size:14px;line-height:1.35}.iaf-section-list a:active,.iaf-section-list a:hover{background:#eaf3ff!important;color:#1767dc!important}.quiz button{font-size:16px!important;min-height:58px!important;margin:9px 0!important;padding:15px 16px!important}}' +
      '</style>';

    var uiJs = '<script>(function(){' +
      'function init(){' +
        'var nav=document.querySelector(".nav");' +
        'if(!nav||document.querySelector(".iaf-section-picker"))return;' +
        'var links=nav.querySelectorAll("a");' +
        'var picker=document.createElement("details");picker.className="iaf-section-picker";' +
        'var summary=document.createElement("summary");' +
        'summary.innerHTML="<span aria-hidden=\"true\">☰</span><span class=\"iaf-section-title\">Seleccionar sección</span>";' +
        'var list=document.createElement("div");list.className="iaf-section-list";' +
        'Array.prototype.forEach.call(links,function(a){' +
          'var b=document.createElement("a");b.href=a.getAttribute("href")||"#";b.textContent=a.textContent.trim();' +
          'b.addEventListener("click",function(){summary.querySelector(".iaf-section-title").textContent=b.textContent;picker.open=false;});' +
          'list.appendChild(b);' +
        '});' +
        'picker.appendChild(summary);picker.appendChild(list);' +
        'var main=document.querySelector(".main");' +
        'if(main&&main.parentNode)main.parentNode.insertBefore(picker,main);' +
        'document.addEventListener("click",function(ev){' +
          'var b=ev.target&&ev.target.closest?ev.target.closest(".quiz button"):null;' +
          'if(!b||b.dataset.iafStyled==="1")return;' +
          'b.dataset.iafStyled="1";' +
          'var oc=b.getAttribute("onclick")||"";' +
          'if(/q\\(this,\\s*true\\)/.test(oc))b.classList.add("iaf-correct");' +
          'else if(/q\\(this,\\s*false\\)/.test(oc))b.classList.add("iaf-wrong");' +
        '},true);' +
      '}' +
      'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();' +
    '})();<\/script>';

    if (html.includes("</head>")) html = html.replace("</head>", uiCss + "</head>");
    if (html.includes("</body>")) html = html.replace("</body>", uiJs + "</body>");
    return html;
  }

  function render(html) { document.open(); document.write(enhance(html)); document.close(); }
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
    document.documentElement.style.visibility = "visible";
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
    catch (x) { document.documentElement.style.visibility = "visible"; document.body.textContent = "No se ha podido cargar el curso. Revisa tu conexión e inténtalo de nuevo."; return; }
    var s = null; try { s = localStorage.getItem(KS); } catch (x) {}
    if (s) {
      try { render(await open(await sub.importKey("raw", d(s), "AES-GCM", false, ["decrypt"]))); return; }
      catch (x) { try { localStorage.removeItem(KS); } catch (y) {} }
    }
    gate();
  })();
})();