const ENDPOINT = "https://cursoia.studyos-oficial-spain.workers.dev/track";
const CONSENT_KEY = "iafacil-analytics-consent";
const VISITOR_KEY = "ia_facil_visitor_id";

function hasConsent() {
  try { return localStorage.getItem(CONSENT_KEY) === "accepted"; } catch { return false; }
}

function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch { return ""; }
}

function track(event, extra = {}) {
  if (!hasConsent()) return;
  const params = new URLSearchParams(location.search);
  const payload = JSON.stringify({
    event,
    visitor_id: visitorId(),
    path: location.pathname,
    referrer: document.referrer || "",
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    ...extra
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], {type:"application/json"}));
    } else {
      fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:payload,keepalive:true}).catch(()=>{});
    }
  } catch {}
}

function showConsent() {
  if (hasConsent() || document.getElementById("iafacil-consent")) return;
  const box=document.createElement("div");
  box.id="iafacil-consent";
  box.setAttribute("role","dialog");
  box.setAttribute("aria-label","Preferencias de privacidad");
  box.innerHTML='<div><strong>Privacidad y analítica</strong><br><span>Podemos usar analítica anónima para saber qué partes del curso funcionan mejor. No es necesaria para utilizar el curso.</span></div><div><button type="button" id="iafacil-consent-no">No, gracias</button><button type="button" id="iafacil-consent-yes">Aceptar analítica</button></div>';
  document.body.appendChild(box);
  const finish = accepted => {
    try { localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined"); } catch {}
    box.remove();
    if (accepted) track("consent_granted",{course:"ia-facil"});
  };
  box.querySelector("#iafacil-consent-yes").onclick=()=>finish(true);
  box.querySelector("#iafacil-consent-no").onclick=()=>finish(false);
}

window.iaFacilTrack=track;
window.iaFacilHasAnalyticsConsent=hasConsent;

document.addEventListener("DOMContentLoaded",()=>{
  showConsent();
  if (hasConsent() && /\/curso\/?$/.test(location.pathname)) track("course_view",{course:"ia-facil"});
});
