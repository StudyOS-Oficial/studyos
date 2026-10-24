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
  function moduleNumber() {
    var m = location.pathname.match(/modulo-(\d+)/);
    return m ? Number(m[1]) : 0;
  }
  var EXTRA = {
    1:{title:"Profundiza: qué es realmente una IA generativa",text:["Una IA generativa no funciona como una enciclopedia que simplemente busca una frase guardada. Genera una respuesta a partir de patrones aprendidos y del contexto de la conversación. Puede explicar, transformar o crear contenido, pero también puede equivocarse.","Conviene separar capacidad de fiabilidad. Que un modelo produzca una explicación convincente no significa que todas sus afirmaciones sean ciertas. La revisión forma parte del uso correcto de la herramienta.","La conversación es iterativa: una primera respuesta puede servir como borrador. Puedes pedir aclaraciones, corregir el contexto, cambiar el formato o señalar un error y continuar desde ahí."]},
    2:{title:"Profundiza: por qué un buen prompt cambia el resultado",text:["Un prompt aporta instrucciones y contexto. Cuanto más claro sea el resultado esperado, menos tiene que adivinar la IA sobre tus intenciones.","No necesitas escribir prompts enormes. La información útil es la que reduce ambigüedad: objetivo, público, contexto, restricciones y formato.","Cuando una respuesta no encaja, comprueba qué información faltaba o qué parte de la petición podía interpretarse de varias maneras."]},
    3:{title:"Profundiza: la anatomía de una petición útil",text:["Una petición robusta puede pensarse como un pequeño contrato: objetivo, contexto, tarea, límites y formato. No siempre necesitas todos los elementos, pero juntos reducen la ambigüedad.","Los ejemplos son especialmente útiles cuando quieres controlar un estilo o una estructura concreta. Un buen ejemplo muestra el tipo de resultado; un contraejemplo muestra qué quieres evitar.","La mejora de prompts es un proceso de prueba. Conserva las instrucciones que realmente cambian la calidad y elimina las que solo añaden ruido."]},
    4:{title:"Profundiza: usar IA en tareas cotidianas",text:["La utilidad práctica aparece cuando la IA se integra en tareas concretas: planificar, resumir, comparar, redactar, estudiar o generar ideas.","En tareas sencillas puedes pedir directamente un resultado. En tareas complejas suele ser mejor empezar por un esquema, revisar el enfoque y después desarrollar la versión final.","La IA funciona mejor como herramienta bajo tu dirección: tú aportas el objetivo y el contexto, y tú decides si el resultado es adecuado para la situación real."]},
    5:{title:"Profundiza: de un prompt correcto a un prompt controlado",text:["La especificidad no consiste en escribir mucho, sino en eliminar decisiones que la IA tendría que inventar. Define qué significa que el resultado sea útil.","Divide las tareas grandes en etapas cuando haya dependencias. Puedes revisar el plan antes de generar todo el contenido.","Una plantilla reutilizable convierte una interacción que funcionó una vez en un procedimiento que puedes repetir y mejorar.","RECURSO · Plantilla rápida: Objetivo → Contexto → Restricciones → Formato → Criterios de calidad → Revisión final."]},
    6:{title:"Profundiza: verificar sin desconfiar de todo",text:["Verificar no significa comprobar absolutamente cada frase. Significa identificar qué afirmaciones importan y qué consecuencias tendría equivocarse.","Para información cambiante, presta atención a la fecha y a la fuente. Para cuestiones importantes, busca la fuente responsable u oficial y comprueba que realmente respalda la afirmación.","Una buena rutina separa generación y verificación: primero usa la IA para entender u organizar; después comprueba los puntos críticos de forma independiente.","RECURSO · Semáforo de verificación: bajo riesgo → revisión rápida; decisión importante → fuente fiable; alto impacto → fuente oficial o profesional adecuado."]},
    7:{title:"Profundiza: privacidad como hábito",text:["Antes de pegar información en una IA, pregunta si realmente necesita conocer ese dato. La minimización de información reduce exposición innecesaria.","Nunca compartas contraseñas, códigos de acceso, claves privadas o datos que permitan entrar en una cuenta. Para muchas tareas tampoco necesitas revelar la identidad completa de una persona.","Los documentos e imágenes pueden contener metadatos o información que no aparece a simple vista. Revisa qué estás enviando y con qué finalidad.","RECURSO · Checklist antes de pegar: ¿lo necesita? ¿contiene datos personales? ¿hay una alternativa con menos información? ¿entiendo cómo se tratará?"]},
    8:{title:"Profundiza: aprender con IA sin dejar de pensar",text:["La mejor ayuda educativa no es recibir la respuesta final, sino conseguir una explicación adaptada que te permita comprenderla y después comprobar que realmente la has aprendido.","Puedes pedir analogías, ejemplos, preguntas de práctica, ejercicios graduados y corrección de errores. Cambiar el formato puede revelar qué parte todavía no dominas.","Una estrategia útil es alternar explicación y recuperación activa: estudia una idea, cierra la respuesta y trata de explicarla con tus palabras.","RECURSO · Prompt de tutor: “Explícame [tema] a nivel [nivel]. Después hazme 3 preguntas sin darme las respuestas. Corrige mis errores y dime qué debo repasar.”"]},
    9:{title:"Profundiza: convertir organización en un sistema",text:["La IA puede ayudarte a transformar objetivos difusos en acciones concretas. El valor aumenta cuando defines prioridades, restricciones y una secuencia realista.","Pedir una lista de tareas es solo el principio. Puedes añadir duración estimada, dependencias, prioridades y puntos de revisión.","No delegues automáticamente las decisiones personales. Usa la IA para comparar escenarios y detectar olvidos, pero conserva tus criterios y límites.","RECURSO · Plantilla semanal: objetivo principal → 3 resultados concretos → tareas → tiempo disponible → obstáculos → revisión al final de la semana."]},
    10:{title:"Profundiza: escribir mejor con IA sin perder tu voz",text:["La IA puede transformar estructura, tono y claridad, pero una buena revisión humana sigue siendo necesaria cuando el texto representa tu identidad o responsabilidad.","Es útil separar tres fases: ideas, borrador y edición. Así puedes pedir ayuda sin permitir que la herramienta cambie accidentalmente el mensaje que querías transmitir.","Para resumir, especifica qué debe conservarse. Para reescribir, indica qué debe cambiar y qué debe permanecer intacto.","RECURSO · Prompt de revisión: “Revisa este texto en claridad, estructura y tono. Señala primero los problemas y no cambies mi voz. Después propón una versión mejorada.”"]}
  };
  function extraHTML(n) {
    var x=EXTRA[n]; if(!x) return "";
    var body=x.text.map(function(t){var resource=t.indexOf("RECURSO ·")===0;var v=resource?t.replace("RECURSO · ",""):t;return '<div class="theory-point'+(resource?' resource':'')+'"><strong>'+(resource?'Recurso práctico':'Idea clave')+'</strong><p>'+v+'</p></div>';}).join("");
    return '<section class="card theory-extra"><span class="tag">PARA PROFUNDIZAR</span><h2>'+x.title+'</h2>'+body+'</section>';
  }
  function improveQuizzes(html,n) {
    if(n<1||n>10) return html;
    var order=[["B","A","C"],["C","B","A"],["A","C","B"],["B","C","A"],["C","A","B"],["A","B","C"],["C","B","A"],["B","A","C"],["A","C","B"],["B","C","A"]];
    var pattern=order[(n-1)%order.length], parser=new DOMParser(), doc=parser.parseFromString(html,"text/html");
    doc.querySelectorAll(".q").forEach(function(q){var a=q.querySelector(".answer");if(!a)return;var labels=Array.from(a.querySelectorAll("label"));if(labels.length!==3)return;var by={};labels.forEach(function(l){var i=l.querySelector("input");if(i)by[i.value]=l;});pattern.forEach(function(v){if(by[v])a.appendChild(by[v]);});});
    var st=doc.createElement("style");st.textContent=".theory-extra{background:#f8fbff!important;border-color:#dce9f8!important}.theory-point{padding:14px 0;border-top:1px solid #dce9f8}.theory-point:first-of-type{border-top:0}.theory-point strong{color:#1767dc}.theory-point p{margin:5px 0 0}.theory-point.resource{background:#eef7ff;border:1px solid #d4e5f7;border-radius:12px;padding:14px 16px;margin-top:12px}.theory-point.resource strong{color:#145bb8}";
    doc.head.appendChild(st); return "<!doctype html>\n"+doc.documentElement.outerHTML;
  }
  function enhance(html){var n=moduleNumber();if(!n)return html;html=improveQuizzes(html,n);var extra=extraHTML(n);if(extra){var idx=html.indexOf('<section class="card quiz"');if(idx<0)idx=html.indexOf("</main>");if(idx>=0)html=html.slice(0,idx)+extra+html.slice(idx);}return html;}
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