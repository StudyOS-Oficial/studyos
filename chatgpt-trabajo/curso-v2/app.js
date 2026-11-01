const weeks=[
{name:"Semana 1 · Detectar oportunidades",lessons:["01","02","03","04","05","06"]},
{name:"Semana 2 · Dominar ChatGPT",lessons:["07","08","09","10","11","12"]},
{name:"Semana 3 · Comunicación y documentación",lessons:["13","14","15","16","17","18","19"]},
{name:"Semana 4 · Archivos, datos y análisis",lessons:["20","21","22","23","24","25","26","27"]},
{name:"Semana 5 · Productividad y workflows",lessons:["28","29","30","31","32","33","34","35"]},
{name:"Semana 6 · Construir herramientas de IA",lessons:["36","37","38","39","40","41","42","43"]},
{name:"Semana 7 · IA por profesión",lessons:["44","45","46","47","48","49","50","51","52","53","54","55"]},
{name:"Semana 8 · Proyecto final",lessons:["56","57","58","59","60"]}
];
let current=0,completed=new Set();
const lessonEl=document.getElementById("lesson"),weeksEl=document.getElementById("weeks");
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function allIds(){return weeks.flatMap(w=>w.lessons);}
function idAt(i){return allIds()[i];}
const available=new Set(["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43"]);
function renderWeeks(){
 let n=0,html="";
 weeks.forEach((w,wi)=>{html+=`<div class="week"><div class="week-title">${escapeHTML(w.name)}</div>`;
 w.lessons.forEach(id=>{const active=Number(id)===current+1;const done=completed.has(id);if(available.has(id)){html+=`<button class="lesson-btn ${active?"active":""}" onclick="openLesson('${id}')"><small>LECCIÓN ${id}${done?" · ✓":""}</small>${escapeHTML(lessonNames[id]||"Próxima lección")}</button>`;}else{html+=`<div class="lesson-btn" style="opacity:.42;cursor:default"><small>LECCIÓN ${id}</small>Próximamente</div>`;}n++;});
 html+="</div>";});
 weeksEl.innerHTML=html;
}
const lessonNames={"01":"La IA está cambiando la forma de trabajar","02":"Qué es realmente ChatGPT","03":"Iterar para mejorar resultados","04":"Qué puede hacer la IA y qué no deberías delegar","05":"Encontrar oportunidades de IA en tu trabajo","06":"Diseñar tu primer caso de uso de IA","07":"Cómo dar contexto a ChatGPT","08":"Anatomía de una instrucción profesional","09":"Iterar correctamente","10":"Técnicas avanzadas de prompting","11":"Haz que ChatGPT pregunte antes de responder","12":"Crear tu sistema personal de instrucciones","13":"Emails profesionales con IA","14":"Responder mensajes sin perder tiempo","15":"Trabajar con documentos","16":"Crear informes con IA","17":"Resumir información sin perder lo importante","18":"Adaptar el mismo contenido a públicos diferentes","19":"Construir un workflow profesional de comunicación","20":"Trabajar con archivos: de documento a información útil","21":"Extraer información de forma estructurada","22":"Comparar documentos y detectar diferencias","23":"Analizar tablas y hojas de cálculo","24":"Detectar patrones, anomalías y preguntas","25":"Buscar errores e inconsistencias","26":"Convertir datos en conclusiones útiles","27":"De datos a decisión","28":"Diseñar workflows con IA","29":"Antes, durante y después: dónde aporta más la IA","30":"Reuniones: de conversación a sistema de trabajo","31":"Planificación con IA: de objetivos a próximos pasos","32":"Gestión de tareas: convertir trabajo difuso en acciones","33":"Investigación con IA: buscar, sintetizar y verificar","34":"Preparar decisiones con IA","35":"Construye 3 workflows profesionales con IA","36":"De prompt a herramienta","37":"Diseñar una interfaz que facilite el trabajo","38":"Inputs y outputs: diseñar los límites del sistema","39":"Crear asistentes especializados","40":"Construir una base de instrucciones","41":"Formularios + IA: convertir entradas en procesos","42":"Diseñar herramientas internas de IA","43":"Prototipa tu primera herramienta de IA"};
async function getLesson(id){
 const res=await fetch(`./lessons/${id}.html`,{cache:"no-store"});
 if(!res.ok) throw new Error("No se pudo cargar la lección "+id);
 return res.text();
}
async function openLesson(id){
 const ids=allIds(); current=ids.indexOf(id); if(current<0) return;
 renderWeeks(); updateProgress();
 lessonEl.innerHTML='<div class="loading">Cargando lección…</div>';
 try{lessonEl.innerHTML=await getLesson(id);bindLesson(id);}
 catch(e){lessonEl.innerHTML=`<div class="risk"><b>No se ha podido cargar esta lección.</b><br>La estructura del curso sigue funcionando. Comprueba el archivo de la lección ${escapeHTML(id)}.</div>`;}
 window.scrollTo({top:0,behavior:"smooth"});
}
function bindLesson(id){
 const copy=lessonEl.querySelector("[data-copy]");
 if(copy){copy.addEventListener("click",async()=>{const text=lessonEl.querySelector("pre").textContent;try{await navigator.clipboard.writeText(text);copy.textContent="✓ Copiado";setTimeout(()=>copy.textContent="Copiar",1200)}catch(e){}});}
 lessonEl.querySelectorAll("[data-answer]").forEach(btn=>btn.addEventListener("click",()=>checkAnswer(btn,id)));
 lessonEl.querySelectorAll("[data-next]").forEach(btn=>btn.addEventListener("click",()=>nextLesson()));
 lessonEl.querySelectorAll("[data-prev]").forEach(btn=>btn.addEventListener("click",()=>prevLesson()));
}
function checkAnswer(btn,id){
 const options=[...lessonEl.querySelectorAll("[data-answer]")],correct=btn.dataset.answer==="correct",feedback=lessonEl.querySelector("[data-feedback]");
 options.forEach(x=>x.classList.remove("correct","wrong"));
 btn.classList.add(correct?"correct":"wrong");
 if(correct){completed.add(id);feedback.textContent="✓ Correcto. Lección completada.";feedback.style.color="var(--green)";renderWeeks();updateProgress();}
 else{feedback.textContent="No exactamente. Revisa la lección y vuelve a intentarlo.";feedback.style.color="var(--orange)";}
}
function nextLesson(){const ids=allIds();if(current<ids.length-1)openLesson(ids[current+1]);}
function prevLesson(){const ids=allIds();if(current>0)openLesson(ids[current-1]);}
function updateProgress(){const total=allIds().length;document.getElementById("progress-bar").style.width=((current+1)/total*100)+"%";const weekIndex=weeks.findIndex(w=>w.lessons.includes(idAt(current)));document.getElementById("progress-label").textContent="Semana "+(weekIndex+1)+" · Lección "+(current+1);document.getElementById("completed-label").textContent=completed.size+" completadas";}
renderWeeks();openLesson("01");
