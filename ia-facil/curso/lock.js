/* IA fácil · puerta de acceso. Descifra la página en el navegador con la contraseña del curso. */
(function () {
  "use strict";
  // Evita el destello del contenido cifrado antes de que termine la apertura.
  document.documentElement.style.visibility = "hidden";
  // Elimina restos de cookies de medición/consentimiento del antiguo recetario al entrar al curso.
  try {
    document.cookie.split(";").forEach(function (part) {
      var name = part.split("=")[0].trim();
      if (/^(studyos_cookies|studyos_purchase_|_fbp|_fbc|_gid|_ga|_gat)/.test(name)) {
        document.cookie = name + "=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
    });
  } catch (x) {}
  var S = document.currentScript, BASE = new URL(".", S.src).href, KS = "iafacil-lock-v1", sub = crypto.subtle;
  var pay = JSON.parse(document.getElementById("payload").textContent), meta;
  var d = function (s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  var e = function (a) { var s = ""; for (var i = 0; i < a.length; i += 8192) s += String.fromCharCode.apply(null, a.subarray(i, i + 8192)); return btoa(s); };
  async function open(W) {
    var kraw = await sub.decrypt({ name: "AES-GCM", iv: d(meta.iv) }, W, d(meta.wrapped));
    var K = await sub.importKey("raw", kraw, "AES-GCM", false, ["decrypt"]);
    return new TextDecoder().decode(await sub.decrypt({ name: "AES-GCM", iv: d(pay.iv) }, K, d(pay.ct)));
  }
  /* Contenido práctico V2: se añade después de descifrar la lección, sin tocar el payload cifrado. */
  function addPracticalLessons(html) {
    if (typeof html !== "string" || !html.includes("</main>")) return html;
    var extra = "";
    if (/Módulo 1/i.test(html)) extra = `
<section class="section" id="practica-interfaz" data-s><h2>11 · Muévete por ChatGPT</h2><p class="lead">Antes de aprender más, aprende dónde está cada cosa.</p><div class="steps"><div class="step"><b>💬 Conversación nueva.</b> Empieza una tarea desde cero cuando quieras cambiar de tema.</div><div class="step"><b>⌨️ Escribir.</b> Puedes pedir lo que necesitas con lenguaje normal; no hacen falta comandos especiales.</div><div class="step"><b>🎙️ Voz.</b> Si tu versión de ChatGPT muestra el botón de voz, puedes hablar en lugar de escribir.</div><div class="step"><b>📎 Adjuntar.</b> Si tu versión permite archivos o imágenes, puedes añadirlos a la conversación.</div></div><div class="tip"><b>Importante:</b> los botones pueden cambiar de posición o aspecto cuando la aplicación se actualiza. Busca siempre las funciones por su icono o nombre.</div></section>
<section class="section" id="practica-voz" data-s><h2>12 · Habla con ChatGPT</h2><p class="lead">La voz puede ser la forma más sencilla de empezar.</p><div class="example"><div class="chat"><b>Tú:</b> “Quiero preparar una cena para cuatro personas. Tengo pollo, arroz y verduras.”</div><div class="chat"><b>ChatGPT:</b> Te propone una receta y puedes seguir preguntando sin volver a empezar.</div></div><div class="exercise"><b>Prueba:</b> habla con ChatGPT durante un minuto y pídele que te ayude con una tarea real de hoy. Después dile: “Explícamelo paso a paso”.</div></section>
`;
    if (/Módulo 4/i.test(html)) extra = `
<section class="section" id="ia-imagenes" data-s><h2>11 · Enseñarle una imagen a la IA</h2><p class="lead">No todo tiene que escribirse.</p><div class="grid"><div class="card"><strong>📷 Una foto</strong>Pregunta qué aparece, pide una descripción o solicita una explicación.</div><div class="card"><strong>🧾 Una etiqueta</strong>Pide que te explique un texto o símbolo que no entiendes.</div><div class="card"><strong>🌿 Una planta</strong>Pide una identificación orientativa y qué información deberías comprobar.</div><div class="card"><strong>🖥️ Una pantalla</strong>Pide ayuda para entender un mensaje o una opción.</div></div><div class="tip"><b>Privacidad:</b> revisa la imagen antes de subirla. No compartas documentos, direcciones, matrículas u otros datos personales que no sean necesarios.</div></section>
<section class="section" id="ia-documentos" data-s><h2>12 · Trabajar con documentos</h2><p class="lead">Si tu versión permite adjuntar archivos, puedes pedir ayuda directamente sobre un documento.</p><div class="example"><div class="chat"><b>Tú:</b> “He subido un documento. Explícamelo con palabras sencillas y dime cuáles son las tres ideas más importantes.”</div><div class="chat"><b>Después:</b> “¿Qué partes debería revisar con más atención?”</div></div><div class="exercise"><b>Prueba:</b> utiliza un documento no sensible y pide primero un resumen, después una explicación sencilla y finalmente una lista de preguntas que te hayan quedado.</div></section>
<section class="section" id="ia-busqueda" data-s><h2>13 · Cuando necesitas información actual</h2><p class="lead">Para horarios, precios, eventos o información que cambia, busca datos actuales y comprueba la fuente.</p><div class="steps"><div class="step"><b>1.</b> Formula exactamente qué necesitas.</div><div class="step"><b>2.</b> Si tienes acceso a búsqueda web, pide información actualizada.</div><div class="step"><b>3.</b> Mira la fecha y la fuente.</div><div class="step"><b>4.</b> Para algo importante, entra también en la web oficial.</div></div><div class="exercise"><b>Prueba:</b> busca el horario actual de un lugar que visites habitualmente y comprueba el resultado en su web oficial.</div></section>
`;
    if (/Módulo 6/i.test(html)) extra = `
<section class="section" id="verificar-web" data-s><h2>11 · Verificar con búsqueda y fuentes</h2><p class="lead">Cuando el dato puede haber cambiado, la fecha importa.</p><div class="steps"><div class="step"><b>Pregunta.</b> “¿Qué datos de esta respuesta debería comprobar?”</div><div class="step"><b>Busca.</b> Utiliza una fuente actual y directamente relacionada con el dato.</div><div class="step"><b>Contrasta.</b> Comprueba que la fuente realmente dice lo que afirma la IA.</div><div class="step"><b>Decide.</b> Si es importante y hay dudas, no actúes hasta confirmarlo.</div></div><div class="tip"><b>Regla:</b> la IA puede ayudarte a encontrar qué comprobar; una fuente fiable independiente es la que debe confirmar el dato.</div></section>
`;
    if (/Módulo 7/i.test(html)) extra = `
<section class="section" id="deepfakes" data-s><h2>11 · Voces, fotos y vídeos falsos</h2><p class="lead">Hoy una imagen o una voz convincente tampoco demuestra que algo sea real.</p><div class="grid"><div class="card"><strong>🎙️ Voz clonada</strong>Alguien puede imitar la voz de un familiar. Una petición urgente de dinero debe verificarse por otro canal.</div><div class="card"><strong>📸 Foto manipulada</strong>Una imagen puede haber sido modificada o generada con IA.</div><div class="card"><strong>🎥 Vídeo falso</strong>Una persona puede parecer decir o hacer algo que nunca ocurrió.</div><div class="card"><strong>🚨 Urgencia</strong>“Hazlo ahora” es una señal para parar, no para correr.</div></div><div class="exercise"><b>Regla familiar:</b> si recibes una petición urgente de dinero o información, cuelga o cierra el mensaje y contacta con esa persona mediante un número o canal que ya conozcas.</div></section>
<section class="section" id="seguridad-practica" data-s><h2>12 · Tu protocolo de seguridad</h2><p class="lead">Cuatro pasos antes de hacer algo importante.</p><div class="steps"><div class="step"><b>PARA.</b> No pulses ni respondas por impulso.</div><div class="step"><b>PIENSA.</b> ¿Quién me lo pide y qué quiere?</div><div class="step"><b>COMPRUEBA.</b> Utiliza la aplicación, web o teléfono oficial.</div><div class="step"><b>CONSULTA.</b> Si sigues teniendo dudas, pide ayuda a alguien de confianza.</div></div></section>
`;
    if (/Módulo 9/i.test(html)) extra = `
<section class="section" id="organizacion-real" data-s><h2>11 · Organiza un día real</h2><p class="lead">La mejor práctica es utilizar la IA con algo que realmente tengas que hacer.</p><div class="example"><div class="chat"><b>Tú:</b> “Mañana tengo una cita a las 10:30, tengo que hacer la compra y quiero cocinar para dos días. Organízame la mañana dejando tiempo para desplazarme.”</div><div class="chat"><b>Después:</b> “Hazme una versión sencilla que pueda guardar como lista.”</div></div><div class="exercise"><b>Reto:</b> elige tres tareas reales de mañana y deja que ChatGPT te ayude a ordenarlas. Tú decides si el plan tiene sentido.</div></section>
`;
    if (/Módulo 10/i.test(html)) extra = `
<section class="section" id="comunicar-mejor" data-s><h2>11 · Comunícate a tu manera</h2><p class="lead">La IA puede ayudarte a encontrar las palabras sin hablar por ti.</p><div class="grid"><div class="card"><strong>❤️ Mensaje familiar</strong>“Hazlo cariñoso y natural, pero que siga sonando a mí.”</div><div class="card"><strong>✉️ Reclamación</strong>“Ordénalo y hazlo claro y educado. No inventes datos.”</div><div class="card"><strong>🎉 Felicitación</strong>“Dame tres versiones: breve, cercana y divertida.”</div><div class="card"><strong>🗣️ Explicación</strong>“Prepárame una explicación de dos minutos para alguien que no sabe del tema.”</div></div><div class="tip"><b>Tu voz sigue siendo la importante:</b> revisa el texto y cambia cualquier frase que no dirías tú.</div></section>
`;
    if (!extra) return html;
    return html.replace("</main>", extra + "</main>");
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
  function enhanceCourse() {
    var root = document.querySelector("main.main") || document.querySelector(".main");
    if (!root) return;
    var style = document.createElement("style");
    style.textContent = "" +
      ".quiz button{color:#111827!important;background:#fff!important;border:2px solid #d8dee8!important;border-radius:16px!important;padding:15px 17px!important;min-height:54px!important;font-size:16px!important;font-weight:650!important;line-height:1.35!important;transition:background .18s ease,border-color .18s ease,transform .12s ease!important}" +
      ".quiz button:active{transform:scale(.99)}" +
      ".quiz button.ia-answer-correct{background:#dff7e8!important;border-color:#32a852!important;color:#111827!important}" +
      ".quiz button.ia-answer-wrong{background:#fde2e2!important;border-color:#dc3545!important;color:#111827!important}" +
      ".ia-section-trigger{display:none}" +
      "@media(max-width:850px){.ia-section-trigger{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin:0 0 14px;padding:12px 15px;border:1px solid #d8e0ea;border-radius:14px;background:#fff;color:#172033;font:700 15px/1.2 system-ui,sans-serif;box-shadow:0 3px 12px rgba(20,32,51,.06);cursor:pointer}.ia-section-panel{display:none;margin:0 0 16px;padding:8px;border:1px solid #d8e0ea;border-radius:16px;background:#fff;box-shadow:0 10px 28px rgba(20,32,51,.12)}.ia-section-panel.open{display:block}.ia-section-panel a{display:block;padding:11px 12px;margin:2px 0;border-radius:10px;color:#27364a;text-decoration:none;font:600 14px/1.35 system-ui,sans-serif}.ia-section-panel a:active,.ia-section-panel a:hover{background:#eaf3ff;color:#1767dc}}";
    document.head.appendChild(style);

    /* Encabezado móvil: sustituye el selector gris antiguo por el nuevo menú de secciones. */
    var headerStyle = document.createElement("style");
    headerStyle.textContent =
      "@media(max-width:850px){" +
      "select{display:none!important}" +
      "header,.topbar,.nav,.header{min-height:86px!important}" +
      "header h1,.topbar h1,.nav h1,.header h1{font-size:30px!important;line-height:1.05!important;letter-spacing:-.8px!important}" +
      "header h1::first-line,.topbar h1::first-line,.nav h1::first-line,.header h1::first-line{font-weight:850!important}" +
      "}";
    document.head.appendChild(headerStyle);

    /* Oculta el selector antiguo "Índice" y su contenedor completo. */
    document.querySelectorAll("select").forEach(function(sel){
      var p = sel.parentElement;
      for (var i=0; p && i<3; i++, p=p.parentElement) {
        if (/^\\s*Índice\\b/i.test((p.textContent || "").trim())) {
          p.style.display = "none";
          break;
        }
      }
      sel.style.display = "none";
    });

    var mobile = document.querySelector(".mobile");
    if (mobile && !document.getElementById("ia-section-trigger")) {
      var sections = Array.from(root.querySelectorAll("section[id]"));
      if (sections.length) {
        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.id = "ia-section-trigger";
        trigger.className = "ia-section-trigger";
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML = "☰ <span>Secciones</span>";
        var panel = document.createElement("div");
        panel.className = "ia-section-panel";
        sections.forEach(function(sec){
          var a = document.createElement("a");
          a.href = "#" + sec.id;
          var h = sec.querySelector("h2");
          a.textContent = h ? h.textContent.replace(/^\s*\d+\s*[·.]?\s*/, "").trim() : sec.id;
          panel.appendChild(a);
        });
        mobile.parentNode.insertBefore(trigger, mobile.nextSibling);
        mobile.parentNode.insertBefore(panel, trigger.nextSibling);
        trigger.addEventListener("click", function(){
          var open = panel.classList.toggle("open");
          trigger.setAttribute("aria-expanded", String(open));
        });
        panel.addEventListener("click", function(e){
          if(e.target.closest("a")) { panel.classList.remove("open"); trigger.setAttribute("aria-expanded","false"); }
        });
      }
    }

    root.querySelectorAll(".quiz button").forEach(function(btn){
      btn.addEventListener("click", function(){
        if (btn.dataset.iaAnswered === "1") return;
        btn.dataset.iaAnswered = "1";
        var answer = (btn.getAttribute("onclick") || "").replace(/\s/g, "");
        if (/q\(this,true\)/.test(answer)) btn.classList.add("ia-answer-correct");
        else if (/q\(this,false\)/.test(answer)) btn.classList.add("ia-answer-wrong");
      }, true);
    });
  }

  function renderAndEnhance(html) {
    render(html);
    setTimeout(enhanceCourse, 0);
  }
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
        renderAndEnhance(html);
      } catch (x) { er.textContent = "Ha habido un problema. Inténtalo de nuevo."; ok.disabled = false; ok.textContent = "Entrar al curso"; }
    };
  }
  (async function () {
    try { var r = await fetch(BASE + "lock.json", { cache: "no-store" }); if (!r.ok) throw 0; meta = await r.json(); }
    catch (x) { document.documentElement.style.visibility = "visible"; document.body.textContent = "No se ha podido cargar el curso. Revisa tu conexión e inténtalo de nuevo."; return; }
    var s = null; try { s = localStorage.getItem(KS); } catch (x) {}
    if (s) {
      try { renderAndEnhance(await open(await sub.importKey("raw", d(s), "AES-GCM", false, ["decrypt"]))); return; }
      catch (x) { try { localStorage.removeItem(KS); } catch (y) {} }
    }
    gate();
  })();
})();