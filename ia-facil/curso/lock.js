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
  var EXTRA_BONUS = {
    11:{title:"Ampliación · pensar en varias etapas",text:[
      "Pensar por etapas significa dejar de tratar una petición compleja como una sola orden. En lugar de pedir “hazme todo”, primero defines el resultado, después separas el trabajo en pasos y finalmente revisas cada paso antes de continuar. Esta forma de trabajar reduce errores porque cada etapa tiene un objetivo concreto.",
      "Una buena cadena de trabajo suele tener cinco momentos: definir el resultado, preparar la información, construir un primer plan, ejecutar y revisar. No todas las tareas necesitan las cinco etapas con la misma profundidad, pero identificar dónde está cada una ayuda a no saltarse controles importantes.",
      "El reparto de roles también importa. La IA puede actuar como analista, redactor, organizador, crítico o tutor según la instrucción. Tú sigues siendo quien fija el objetivo, aporta el contexto y decide si el resultado es válido. Cambiar el rol de la IA puede cambiar mucho el tipo de respuesta que obtienes.",
      "Una técnica especialmente útil es pedir primero un plan y no el resultado final. Si el plan contiene pasos innecesarios, falta información o una conclusión equivocada, corregirlo antes de ejecutar todo ahorra tiempo y evita construir sobre una base defectuosa.",
      "Cuando una etapa depende de otra, conviene crear puntos de control. Por ejemplo: comprobar los datos antes de analizarlos, revisar el esquema antes de redactar y comprobar las conclusiones antes de publicarlas. Estos controles convierten una conversación con IA en un proceso reproducible.",
      "También puedes crear alternativas. Si una primera estrategia no funciona, pide dos o tres caminos diferentes y compáralos según criterios concretos: tiempo, dificultad, coste, precisión o riesgo. Así la IA no se limita a reforzar la primera idea que apareció.",
      "La segunda revisión tiene un objetivo diferente de la primera. La primera comprueba si el resultado cumple la tarea; la segunda intenta encontrar aquello que podría estar mal, incompleto o asumido sin pruebas. Pedir explícitamente una revisión crítica suele descubrir problemas que una simple corrección no detecta.",
      "Cuando un proceso funciona, conviértelo en una plantilla. Guarda la estructura de instrucciones, los criterios de calidad y los puntos de revisión. La próxima vez no empiezas desde cero: solo adaptas el contexto.",
      "RECURSO · Plantilla de proceso: Objetivo → Información disponible → Pasos → Rol de la IA → Criterios de calidad → Punto de verificación → Alternativa → Revisión final.",
      "RECURSO · Ejercicio: elige una tarea real que normalmente haces de una sola vez y divídela en al menos 5 etapas. Para cada etapa escribe qué debe producir, qué información necesita y cómo comprobarás que está bien.",
      "RECURSO · Prompt reutilizable: “Antes de resolver esta tarea, divídela en etapas. Para cada etapa indica objetivo, información necesaria, resultado esperado y cómo verificarlo. No ejecutes todavía la tarea; primero quiero revisar el plan.”"
    ]},
    12:{title:"Ampliación · convertir tareas en procesos prácticos",text:[
      "Una tarea es algo que quieres hacer; un proceso es una forma organizada de repetirlo con un resultado consistente. La diferencia parece pequeña, pero es fundamental para aprovechar la IA. En vez de pedir una respuesta aislada, defines un procedimiento que puedes reutilizar mañana con otros datos.",
      "Empieza por describir qué entra y qué debe salir. Si no puedes explicar la entrada y la salida, probablemente todavía no has definido bien el proceso. Por ejemplo, “quiero organizar una semana” es ambiguo; “tengo estas obligaciones, este tiempo disponible y estas prioridades, y necesito un plan semanal revisable” es mucho más operativo.",
      "Las preguntas previas evitan que la IA rellene huecos con suposiciones. Puedes pedirle que detecte qué información falta y que formule únicamente las preguntas necesarias antes de empezar. Esto es especialmente útil cuando una decisión depende de restricciones que todavía no has explicado.",
      "Planificar antes de generar separa estrategia y ejecución. Primero decides qué se hará, en qué orden y con qué criterios. Después utilizas la IA para producir documentos, listas, textos, tablas o propuestas. Esta separación facilita corregir el enfoque sin rehacer todo el trabajo.",
      "Los criterios convierten una opinión en una comprobación. En lugar de decir “hazlo bien”, define qué significa bien: completo, claro, breve, dentro del presupuesto, adecuado al público o coherente con unas reglas concretas. Cuantos más criterios relevantes estén definidos, menos espacio queda para interpretaciones arbitrarias.",
      "Las tablas son útiles cuando hay que comparar opciones. Una tabla puede incluir alternativa, ventajas, inconvenientes, coste, tiempo, riesgos y una condición de descarte. La IA puede ayudarte a rellenarla, pero los criterios deben venir de la situación real y la decisión final sigue siendo humana.",
      "Los checklists son una de las formas más sencillas de convertir una conversación en sistema. Un buen checklist no intenta recordar todo; recoge los puntos que sería costoso olvidar. Puedes pedir a la IA que lo revise y lo simplifique después de usarlo varias veces.",
      "Los puntos de decisión deben estar explícitos. Por ejemplo: si falta información, preguntar; si el riesgo es alto, verificar una fuente oficial; si una opción supera un límite, descartarla; si dos opciones son equivalentes, elegir la más sencilla. Estas reglas hacen que el proceso sea más estable.",
      "Las plantillas permiten reutilizar el trabajo sin copiar respuestas enteras. Guarda campos variables entre corchetes y conserva las instrucciones que realmente cambian el resultado. Una plantilla buena es corta, clara y fácil de adaptar.",
      "RECURSO · Constructor de procesos: Entrada → Objetivo → Preguntas necesarias → Pasos → Criterios → Decisiones → Verificaciones → Salida → Plantilla para repetirlo.",
      "RECURSO · Ejercicio: convierte una tarea repetitiva de tu vida en un procedimiento de 7 pasos. Añade al menos 3 criterios de calidad y 2 puntos donde una persona deba revisar antes de continuar.",
      "RECURSO · Prompt reutilizable: “Convierte esta tarea en un proceso reutilizable. Primero identifica entradas y resultado final; después crea pasos, criterios de calidad, decisiones y puntos de verificación. Termina con una plantilla que pueda volver a utilizar.”"
    ]},
    13:{title:"Ampliación · pensar mejor con IA",text:[
      "Usar IA para pensar mejor no significa dejar que la herramienta decida por ti. Su valor está en ampliar el espacio de análisis: puede proponer perspectivas, detectar contradicciones, formular preguntas y construir escenarios que quizá no habías considerado.",
      "Antes de aceptar una conclusión, identifica qué supuestos necesita para ser cierta. Un supuesto puede ser explícito, como un dato proporcionado, o implícito, como asumir que una persona reaccionará de una determinada manera. Pedir a la IA que enumere los supuestos hace visible la parte más frágil del razonamiento.",
      "Distingue hechos, interpretaciones y opiniones. Un hecho debería poder contrastarse; una interpretación explica qué significado damos a esos hechos; una opinión expresa una valoración. Mezclarlos en una misma frase puede hacer que una conclusión parezca más segura de lo que realmente es.",
      "Los contraargumentos son una herramienta potente. Después de construir una posición, pide la mejor objeción posible y pregunta qué evidencia podría darle la razón. No se trata de buscar una discusión artificial, sino de intentar falsar una conclusión antes de actuar sobre ella.",
      "También conviene buscar información ausente. Pregunta: “¿Qué dato importante no tenemos?”. Una respuesta puede ser correcta con la información disponible y, aun así, ser insuficiente para tomar una decisión real. Detectar el vacío de información es parte del razonamiento.",
      "Los contraejemplos ayudan a comprobar si una regla es demasiado general. Si dices “esta estrategia siempre funciona”, intenta encontrar un caso donde no funcione. Si existe, reformula la afirmación con las condiciones en las que realmente es válida.",
      "El sesgo de confirmación aparece cuando buscamos principalmente pruebas que apoyen nuestra primera idea. Puedes usar la IA para invertir el proceso: pide primero argumentos a favor, después argumentos en contra y finalmente una comparación neutral de qué evidencias son más sólidas.",
      "Los escenarios permiten pensar en condiciones cambiantes. Construye, por ejemplo, un escenario favorable, uno intermedio y uno adverso. Después identifica qué señales indicarían que estás pasando de un escenario a otro y qué acción tendría sentido en cada caso.",
      "Antes de decidir, pide un resumen de la decisión en una estructura fija: objetivo, hechos conocidos, incertidumbres, opciones, riesgos y criterio elegido. Esta estructura obliga a separar lo que sabes de lo que estás suponiendo.",
      "La última palabra debe seguir siendo tuya cuando la decisión tenga consecuencias personales, económicas, legales, médicas o de seguridad. La IA puede ayudar a analizar, pero no sustituye la responsabilidad de contrastar información ni el criterio de una persona cualificada cuando sea necesario.",
      "RECURSO · Matriz de decisión: Objetivo → Hechos → Supuestos → Opciones → Argumentos a favor → Contraargumentos → Riesgos → Información que falta → Criterio → Decisión.",
      "RECURSO · Ejercicio: toma una decisión real no urgente y escribe primero tu conclusión. Después pide a la IA que intente demostrar que estás equivocado, que encuentre tres datos que faltan y que proponga dos escenarios alternativos.",
      "RECURSO · Prompt reutilizable: “Actúa como un crítico constructivo. No intentes darme la razón. Identifica mis supuestos, separa hechos de opiniones, formula el mejor contraargumento, señala qué información falta y presenta escenarios alternativos. Termina indicando qué tendría que comprobar antes de decidir.”"
    ]}
  };
  function bonusHTML(n) {
    var x=EXTRA_BONUS[n]; if(!x) return "";
    var body=x.text.map(function(t){var resource=t.indexOf("RECURSO ·")===0;var v=resource?t.replace("RECURSO · ",""):t;return '<div class="theory-point'+(resource?' resource':'')+'"><strong>'+(resource?'Recurso práctico':'Desarrollo teórico')+'</strong><p>'+v+'</p></div>';}).join("");
    return '<section class="card theory-extra bonus-theory"><span class="tag">AMPLIACIÓN DE TEORÍA</span><h2>'+x.title+'</h2>'+body+'</section>';
  }
  function courseNavHTML(n) {
    if(n<10 || n>13) return "";
    var prev=n===10?null:n-1, next=n<13?n+1:null;
    var prevHTML=prev?'<a class="course-nav-btn secondary" href="../modulo-'+prev+'/">← Módulo anterior</a>':'';
    var nextHTML=next?'<a class="course-nav-btn primary" href="../modulo-'+next+'/">Módulo '+next+' →</a>':'<a class="course-nav-btn primary" href="../">Finalizar curso →</a>';
    return '<nav class="course-nav" aria-label="Navegación del curso"><div class="course-nav-line"><span>Continuación del curso</span><b>Módulo '+n+' de 13</b></div><div class="course-nav-actions">'+prevHTML+nextHTML+'</div></nav>';
  }
  function improveQuizzes(html,n) {
    if(n<1||n>10) return html;
    var order=[["B","A","C"],["C","B","A"],["A","C","B"],["B","C","A"],["C","A","B"],["A","B","C"],["C","B","A"],["B","A","C"],["A","C","B"],["B","C","A"]];
    var pattern=order[(n-1)%order.length], parser=new DOMParser(), doc=parser.parseFromString(html,"text/html");
    doc.querySelectorAll(".q").forEach(function(q){var a=q.querySelector(".answer");if(!a)return;var labels=Array.from(a.querySelectorAll("label"));if(labels.length!==3)return;var by={};labels.forEach(function(l){var i=l.querySelector("input");if(i)by[i.value]=l;});pattern.forEach(function(v){if(by[v])a.appendChild(by[v]);});});
    var st=doc.createElement("style");st.textContent=".theory-extra{background:#f8fbff!important;border-color:#dce9f8!important}.theory-point{padding:14px 0;border-top:1px solid #dce9f8}.theory-point:first-of-type{border-top:0}.theory-point strong{color:#1767dc}.theory-point p{margin:5px 0 0}.theory-point.resource{background:#eef7ff;border:1px solid #d4e5f7;border-radius:12px;padding:14px 16px;margin-top:12px}.theory-point.resource strong{color:#145bb8}";
    doc.head.appendChild(st); return "<!doctype html>\n"+doc.documentElement.outerHTML;
  }
  function portalHTML(){return '<section class="card theory-extra portal-extra" data-extra-modules="11-13"><span class="tag">NUEVOS MÓDULOS</span><h2>Continúa aprendiendo con IA</h2><p>Ahora puedes avanzar con tres módulos nuevos para pasar de usar la IA a trabajar con ella de forma más estructurada.</p><div class="extra-module-grid"><a class="extra-module" href="./modulo-11/"><span class="extra-num">11</span><span><b>Pensar en varias etapas</b><small>Convierte una petición en un proceso paso a paso.</small></span><span class="extra-arrow">→</span></a><a class="extra-module" href="./modulo-12/"><span class="extra-num">12</span><span><b>Convertir tareas en procesos prácticos</b><small>Organiza tareas, criterios y revisiones.</small></span><span class="extra-arrow">→</span></a><a class="extra-module" href="./modulo-13/"><span class="extra-num">13</span><span><b>Pensar mejor con IA</b><small>Usa la IA para analizar, cuestionar y decidir mejor.</small></span><span class="extra-arrow">→</span></a></div></section>';}
  function enhancePortal(html){
    var parser=new DOMParser(),doc=parser.parseFromString(html,"text/html");
    if(doc.querySelector('[data-extra-modules="11-13"]')) return html;
    var st=doc.createElement("style");
    st.textContent=".portal-extra{margin-top:28px!important;background:linear-gradient(180deg,#f8fbff,#fff)!important;border-color:#d7e7fb!important}.portal-extra>p{color:#64748b;margin:8px 0 18px}.extra-module-grid{display:grid;gap:12px;margin-top:16px}.extra-module{display:grid;grid-template-columns:48px 1fr 24px;align-items:center;gap:12px;text-decoration:none;color:inherit;background:#fff;border:1px solid #dbe7f5;border-radius:16px;padding:13px 14px;box-shadow:0 3px 12px rgba(20,80,140,.06);transition:transform .15s ease,border-color .15s ease}.extra-module:hover{transform:translateY(-1px);border-color:#9fc4f2}.extra-num{width:42px;height:42px;border-radius:12px;background:#eaf2ff;color:#2563d8;display:grid;place-items:center;font-size:19px;font-weight:800}.extra-module b{display:block;font-size:16px;line-height:1.25}.extra-module small{display:block;color:#718096;font-size:13px;line-height:1.35;margin-top:3px}.extra-arrow{color:#2563d8;font-size:22px;font-weight:700;text-align:right}";
    doc.head.appendChild(st);
    var holder=doc.createElement("div"); holder.innerHTML=portalHTML();
    var block=holder.firstElementChild;
    var target=Array.from(doc.querySelectorAll("h1,h2,h3")).find(function(h){return /herramientas para seguir aprendiendo/i.test(h.textContent||"");});
    if(target){
      var parent=target.closest("section,article,.card");
      if(parent&&parent.parentNode) parent.parentNode.insertBefore(block,parent);
      else if(target.parentNode) target.parentNode.insertBefore(block,target);
      else (doc.querySelector("main")||doc.body).appendChild(block);
    }else{
      (doc.querySelector("main")||doc.body).appendChild(block);
    }
    return "<!doctype html>\n"+doc.documentElement.outerHTML;
  }
  function enhance(html){var n=moduleNumber();if(!n)return enhancePortal(html);html=improveQuizzes(html,n);var extra=extraHTML(n);if(extra){var idx=html.indexOf('<section class="card quiz"');if(idx<0)idx=html.indexOf("</main>");if(idx>=0)html=html.slice(0,idx)+extra+html.slice(idx);}return html;}
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