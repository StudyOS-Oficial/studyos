// Course analytics only run after the shared StudyOS consent choice.
import "../../../tracking.js";

const ENDPOINT="https://cursoia.studyos-oficial-spain.workers.dev/track";
const CONSENT_KEY="studyos_cookies";
const SESSION_KEY="ia_facil_analytics_session";
const pendingEvents=[];
try{localStorage.removeItem("ia_facil_visitor_id");}catch{}

function sessionId(){
  try{
    let id=sessionStorage.getItem(SESSION_KEY);
    if(!id){id=crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2);sessionStorage.setItem(SESSION_KEY,id);}
    return id;
  }catch{return "";}
}

function sendEvent(event,extra={}){
  let referrer="";
  try{referrer=document.referrer?new URL(document.referrer).origin:"";}catch{}
  const params=new URLSearchParams(location.search);
  const data={
    event,
    visitor_id:sessionId(),
    path:location.pathname,
    referrer,
    utm_source:params.get("utm_source")||"",
    utm_medium:params.get("utm_medium")||"",
    utm_campaign:params.get("utm_campaign")||"",
    ...extra
  };
  const payload=JSON.stringify(data);
  try{
    if(navigator.sendBeacon)navigator.sendBeacon(ENDPOINT,new Blob([payload],{type:"application/json"}));
    else fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:payload,keepalive:true,credentials:"omit",referrerPolicy:"no-referrer"}).catch(()=>{});
  }catch{}
  if(typeof window.studyosGA==="function")window.studyosGA("ia_facil_"+event,{course:"ia-facil",page_path:location.pathname,...extra});
}

export function trackIaFacil(event,extra={}){
  let consent;
  try{consent=localStorage.getItem(CONSENT_KEY);}catch{return false;}
  if(consent==="granted"){sendEvent(event,extra);return true;}
  if(consent!=="denied"&&pendingEvents.length<30){pendingEvents.push([event,extra]);}
  return false;
}

if(typeof window.studyosWhenConsented==="function"){
  window.studyosWhenConsented(()=>{
    pendingEvents.splice(0).forEach(([event,extra])=>sendEvent(event,extra));
  });
}
window.iaFacilTrack=trackIaFacil;
window.iaFacilHasAnalyticsConsent=()=>{try{return localStorage.getItem(CONSENT_KEY)==="granted";}catch{return false;}};
