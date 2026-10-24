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
  var LESSON_EXPANSION = {
    11:[
      ["Pensar en etapas evita pedir a la IA que resuelva todo de golpe. La primera etapa debe aclarar el resultado; después se prepara la información, se construye el plan, se ejecuta y se revisa. Cada paso debe producir algo que permita comprobar si podemos continuar.","Prueba esto: antes de pedir una respuesta final, solicita un plan de 4-5 pasos y revisa si falta información o si algún paso está fuera del objetivo."],
      ["Definir el resultado significa describir qué quieres tener al terminar, no simplemente qué quieres que haga la IA. Un resultado concreto permite detectar respuestas incompletas o desviadas.","Una buena fórmula es: “Al terminar quiero obtener [resultado], destinado a [persona], con [formato] y cumpliendo [criterios]”."],
      ["La IA puede asumir distintos papeles: analista, redactor, organizador, tutor o crítico. El papel modifica el tipo de trabajo que realiza, pero no transfiere la responsabilidad de la decisión.","Si una respuesta no te sirve, prueba a cambiar el rol: primero analista para ordenar información, después crítico para encontrar problemas y finalmente redactor para presentar el resultado."],
      ["Antes de ejecutar una tarea compleja, comprueba si existen dependencias. Si un paso necesita información que todavía no tienes, ejecutarlo ahora solo genera trabajo que probablemente tendrás que repetir.","Pide a la IA que marque cada paso como preparado, pendiente de información o dependiente de otro paso. Así sabrás dónde conviene detenerse."],
      ["Los puntos de control son pequeñas revisiones entre etapas. Son especialmente útiles cuando un error temprano puede propagarse a todo lo que viene después.","Ejemplos: validar datos antes de analizarlos, revisar un esquema antes de redactar y comprobar una conclusión antes de convertirla en una decisión."],
      ["Cuando una primera estrategia falla, no hace falta empezar desde cero. Puedes pedir alternativas y compararlas con los mismos criterios: tiempo, coste, dificultad, precisión o riesgo.","La clave es comparar alternativas con criterios definidos de antemano. Si cambias los criterios después de ver las opciones, puedes acabar favoreciendo sin querer la primera idea que te gustó."],
      ["Una revisión final no debería limitarse a buscar faltas. Tiene que intentar encontrar errores de razonamiento, información ausente, contradicciones y afirmaciones que no estén suficientemente justificadas.","Pide dos revisiones distintas: una para comprobar si has cumplido el objetivo y otra para intentar demostrar que el resultado podría estar equivocado."],
      ["Cuando un proceso funciona varias veces, merece convertirse en una plantilla. Conserva las instrucciones que realmente afectan al resultado y deja como campos variables los datos que cambian de una ocasión a otra.","Una plantilla útil no es un texto enorme: es una estructura breve que te recuerda qué contexto aportar, qué pedir y qué revisar."],
      ["Un proceso reutilizable puede resumirse como: objetivo, información disponible, pasos, rol de la IA, criterios de calidad, punto de verificación, alternativa y revisión final.","Guarda esta estructura y úsala como lista de comprobación cada vez que tengas una tarea compleja. Con el tiempo podrás simplificarla según tu experiencia."],
      ["El reto final consiste en convertir una tarea real en un pequeño sistema. No busques hacerlo perfecto a la primera: crea una versión, úsala, detecta dónde falla y mejora el proceso.","Haz una prueba completa y anota qué parte te hizo perder tiempo o generó errores. Esa observación es más valiosa que añadir instrucciones innecesarias."]
    ],
    12:[
      ["Una tarea describe algo que quieres hacer; un proceso describe cómo hacerlo de forma repetible. La diferencia permite pasar de una conversación aislada con IA a un sistema que puedes reutilizar.","Empieza escribiendo la entrada y la salida: qué información tienes al principio y qué resultado concreto necesitas al final."],
      ["Las preguntas previas sirven para evitar que la IA invente lo que no sabe. Antes de producir el resultado, puede detectar qué datos faltan y preguntar solo lo imprescindible.","Pídele: “Antes de empezar, identifica las 3 preguntas cuya respuesta cambiaría más tu propuesta”. Así reduces preguntas innecesarias."],
      ["Planificar antes de generar separa la estrategia de la ejecución. Primero decides qué hay que conseguir y en qué orden; después produces textos, listas, tablas o documentos.","Si cambias el plan antes de generar, corriges una idea. Si cambias el plan después de generar todo, probablemente tienes que rehacer trabajo."],
      ["Los criterios de calidad convierten “hazlo bien” en algo comprobable. Pueden ser claridad, precisión, extensión, coste, tiempo, público objetivo o cumplimiento de determinadas reglas.","Elige entre 3 y 5 criterios realmente importantes y pídele a la IA que evalúe el resultado contra ellos, no contra una idea vaga de calidad."],
      ["Las tablas ayudan a comparar opciones sin mezclar argumentos. Puedes usar columnas para ventajas, inconvenientes, coste, tiempo, riesgos y condiciones de descarte.","La IA puede organizar la información, pero debes decidir qué columnas importan. Una tabla muy bonita con criterios equivocados sigue llevando a una mala decisión."],
      ["Un checklist transforma una conversación en una rutina. Debe contener aquello que sería fácil olvidar y que puede tener consecuencias si se omite.","Después de utilizarlo varias veces, elimina pasos que nunca aporten valor y añade los errores que hayas cometido realmente."],
      ["Los puntos de decisión hacen que el proceso sea previsible. Puedes establecer reglas sencillas: si falta información, preguntar; si el riesgo es alto, verificar; si no se cumple un límite, descartar.","Estas reglas deben reflejar tus prioridades reales. La IA puede ayudarte a redactarlas, pero no debería inventar por ti qué límites son aceptables."],
      ["Una verificación colocada al final puede llegar demasiado tarde. En procesos importantes conviene introducir comprobaciones justo antes de los pasos donde un error tendría más impacto.","Marca en tu proceso dónde debe intervenir una persona y qué debe comprobar. No todos los pasos necesitan supervisión con la misma intensidad."],
      ["Una plantilla reutilizable convierte el proceso en algo práctico. Usa campos entre corchetes para aquello que cambia: [objetivo], [público], [datos], [límite] o [formato].","Una buena plantilla debe poder copiarse y rellenarse en menos de un minuto. Si necesita una explicación enorme cada vez que la utilizas, todavía puede simplificarse."],
      ["El reto final consiste en transformar una tarea repetitiva en un procedimiento completo: entrada, objetivo, preguntas, pasos, criterios, decisiones, verificaciones y salida.","Después de usarlo una vez, haz una revisión: qué paso sobró, qué información faltó y dónde tuviste que intervenir. Esa revisión convierte el proceso en una versión mejor."]
    ],
    13:[
      ["La IA puede ampliar tu razonamiento, pero no debe convertirse en la autoridad final. Su utilidad está en generar perspectivas, preguntas y objeciones que te permitan analizar mejor una situación.","Antes de aceptar una conclusión, pregunta qué parte es análisis y qué parte depende de datos que todavía habría que comprobar."],
      ["Los supuestos son ideas que damos por ciertas para poder avanzar. Algunos son evidentes y otros están ocultos. Hacerlos explícitos permite descubrir dónde puede romperse un razonamiento.","Pide a la IA: “Enumera los supuestos de mi conclusión y clasifícalos como comprobados, razonables o no demostrados”."],
      ["Separar hechos, interpretaciones y opiniones evita que una valoración parezca un dato objetivo. Los hechos deben poder contrastarse; las interpretaciones explican su significado; las opiniones expresan una valoración.","Cuando leas una respuesta, intenta etiquetar cada afirmación importante con una de esas tres categorías."],
      ["Un buen contraargumento no consiste en llevar la contraria por sistema. Consiste en construir la objeción más fuerte posible y comprobar qué evidencia podría sostenerla.","Esto ayuda especialmente cuando ya tienes una opinión formada y quieres evitar que la IA simplemente confirme lo que esperabas escuchar."],
      ["La información que falta puede ser más importante que la información que ya tienes. Una conclusión puede parecer lógica y seguir siendo insuficiente si depende de un dato desconocido.","Pregunta siempre: “¿Qué dato, si apareciera mañana, podría cambiar esta conclusión?” Esa pregunta revela las incertidumbres relevantes."],
      ["Los contraejemplos sirven para comprobar si una regla es demasiado general. Si una afirmación utiliza palabras como “siempre”, “nunca” o “todos”, intenta encontrar un caso donde no se cumpla.","Si encuentras un contraejemplo, no significa necesariamente que la idea sea inútil; puede significar que debes especificar mejor en qué condiciones funciona."],
      ["El sesgo de confirmación aparece cuando prestamos más atención a la evidencia que respalda nuestra primera idea. La IA puede ayudarte a combatirlo si le pides deliberadamente una búsqueda equilibrada.","Haz tres rondas: argumentos a favor, argumentos en contra y comparación neutral de qué evidencias son más sólidas. No decidas después de escuchar solo una de las partes."],
      ["Los escenarios permiten analizar decisiones cuando el futuro no es seguro. Construye al menos un escenario favorable, uno intermedio y uno adverso y define qué señales indicarían que la situación está cambiando.","Después asigna una acción posible a cada escenario. Así no dependes de una única predicción sobre lo que ocurrirá."],
      ["Antes de decidir, resume el problema en una estructura fija: objetivo, hechos conocidos, incertidumbres, opciones, riesgos y criterio elegido. Esta estructura obliga a separar conocimiento de suposiciones.","Si no puedes completar alguno de los apartados, probablemente todavía necesitas información o debes reconocer explícitamente la incertidumbre."],
      ["En decisiones personales, económicas, legales, médicas o de seguridad, la IA puede ayudar a organizar preguntas y analizar posibilidades, pero no sustituye la verificación ni el criterio profesional cuando corresponda.","El objetivo del módulo no es decidir con IA, sino aprender a pensar mejor con ella y saber cuándo detenerse, comprobar y asumir personalmente la decisión."]
    ]
  };
  function expandExistingLessons(html,n){
    var data=LESSON_EXPANSION[n]; if(!data) return html;
    var parser=new DOMParser(),doc=parser.parseFromString(html,"text/html");
    var lessons=Array.from(doc.querySelectorAll("section.card")).filter(function(sec){
      var tag=sec.querySelector(".tag");
      return tag && /^LECCIÓN\\s+\\d+/i.test((tag.textContent||"").trim());
    });
    lessons.slice(0,data.length).forEach(function(sec,i){
      if(sec.querySelector('[data-expanded-lesson="'+n+"-"+i+'"]')) return;
      var box=doc.createElement("div");
      box.setAttribute("data-expanded-lesson",n+"-"+i);
      box.className="lesson-expansion";
      box.innerHTML='<strong>Amplía esta idea</strong><p>'+data[i][0]+'</p><p>'+data[i][1]+'</p>';
      sec.appendChild(box);
    });
    var st=doc.createElement("style");
    st.textContent=".lesson-expansion{margin-top:22px;padding:16px 18px;background:#f8fbff;border:1px solid #d9e7f7;border-left:4px solid #2563d8;border-radius:14px}.lesson-expansion strong{display:block;color:#1767dc;margin-bottom:6px}.lesson-expansion p{margin:7px 0 0}.lesson-expansion p+p{margin-top:10px}";
    doc.head.appendChild(st);
    return "<!doctype html>\\n"+doc.documentElement.outerHTML;
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
  function enhance(html){var n=moduleNumber();if(!n)return enhancePortal(html);html=improveQuizzes(html,n);html=expandExistingLessons(html,n);if(n>=10&&n<=13&&!html.includes('data-course-nav="1"')){var nav=courseNavHTML(n);var css='<style>.course-nav{margin:30px 0 8px;padding:18px;border:1px solid #dbe7f5;border-radius:18px;background:linear-gradient(180deg,#f8fbff,#fff);box-shadow:0 4px 16px rgba(20,80,140,.06)}.course-nav-line{display:flex;justify-content:space-between;gap:12px;align-items:center;color:#64748b;font-size:14px;margin-bottom:12px}.course-nav-line b{color:#2563d8}.course-nav-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.course-nav-btn{display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 14px;border-radius:12px;text-decoration:none;font-weight:800;border:1px solid #cbd9ea;box-sizing:border-box}.course-nav-btn.primary{background:#2563d8;color:#fff;border-color:#2563d8}.course-nav-btn.secondary{background:#fff;color:#24507f}@media(max-width:520px){.course-nav-actions{grid-template-columns:1fr}.course-nav-line{flex-direction:column;align-items:flex-start}}</style>';var navIdx=html.indexOf("</main>");if(navIdx>=0)html=html.slice(0,navIdx)+nav+html.slice(navIdx);else{var bodyIdx=html.indexOf("</body>");html=html.slice(0,bodyIdx)+nav+html.slice(bodyIdx);}html=html.replace("</main>",'<span data-course-nav="1"></span></main>');html=html.replace("</head>",css+"</head>");}return html;}  var css = "body{margin:0;font:20px/1.5 system-ui,sans-serif;background:#faf7f2;color:#222;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}" +
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