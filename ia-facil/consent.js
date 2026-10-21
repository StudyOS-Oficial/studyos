/* IA Fácil · preferencias de analítica y marketing. No carga terceros antes de elegir. */
(function(){
"use strict";
if(window.__iaFacilConsentReady)return;
window.__iaFacilConsentReady=true;
var COOKIE="iafacil_consent_v1";
function read(){
  var entry=document.cookie.split("; ").find(function(x){return x.indexOf(COOKIE+"=")===0;});
  if(!entry)return null;
  try{var value=JSON.parse(decodeURIComponent(entry.slice(COOKIE.length+1)));return{analytics:value.analytics===true,marketing:value.marketing===true};}catch(e){return null}
}
function announce(value){window.dispatchEvent(new CustomEvent("iafacil:consent",{detail:value||{analytics:false,marketing:false}}))}
function save(value){
  var clean={analytics:value.analytics===true,marketing:value.marketing===true};
  document.cookie=COOKIE+"="+encodeURIComponent(JSON.stringify(clean))+"; Max-Age=15552000; Path=/studyos/ia-facil/; SameSite=Lax; Secure";
  banner.hidden=true;settings.close();announce(clean);
}
var style=document.createElement("style");
style.textContent="#iafacil-cookie-banner{position:fixed;z-index:10000;left:12px;right:12px;bottom:12px;max-width:880px;margin:auto;background:#fff;color:#14213d;border:1px solid #cfdcf0;border-radius:18px;padding:18px;box-shadow:0 12px 40px #071b4440;font:15px/1.5 system-ui,sans-serif}#iafacil-cookie-banner[hidden]{display:none}#iafacil-cookie-banner strong{font-size:18px;color:#0b1f4d}#iafacil-cookie-banner p{margin:6px 0 14px}#iafacil-cookie-banner a,#iafacil-cookie-settings{color:#0857d6}#iafacil-cookie-banner .actions{display:flex;flex-wrap:wrap;gap:8px}#iafacil-cookie-banner button,#iafacil-cookie-settings-dialog button{font:700 15px system-ui,sans-serif;border:0;border-radius:999px;padding:10px 16px;cursor:pointer}#iafacil-cookie-banner button[data-choice=all],#iafacil-cookie-settings-dialog button[data-choice=save]{background:#0a6cff;color:#fff}#iafacil-cookie-banner button[data-choice=reject],#iafacil-cookie-banner button[data-choice=settings],#iafacil-cookie-settings-dialog button[data-choice=close]{background:#eef4ff;color:#0b1f4d}#iafacil-cookie-settings-dialog{width:min(560px,calc(100% - 28px));border:0;border-radius:20px;padding:24px;color:#14213d;box-shadow:0 20px 70px #071b4470;font:16px/1.5 system-ui,sans-serif}#iafacil-cookie-settings-dialog::backdrop{background:#071b4480}#iafacil-cookie-settings-dialog h2{margin:0 0 8px;color:#0b1f4d}#iafacil-cookie-settings-dialog p{margin:8px 0 16px}#iafacil-cookie-settings-dialog label{display:flex;gap:10px;align-items:flex-start;margin:12px 0;padding:12px;background:#f3f7ff;border-radius:12px}#iafacil-cookie-settings-dialog input{margin-top:4px;accent-color:#0a6cff}#iafacil-cookie-settings-dialog .actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:18px}@media(max-width:540px){#iafacil-cookie-banner{bottom:8px;left:8px;right:8px;padding:14px}#iafacil-cookie-banner .actions{display:grid;grid-template-columns:1fr 1fr}#iafacil-cookie-banner button[data-choice=all]{grid-column:1/-1}}";
document.head.appendChild(style);
var banner=document.createElement("section");
banner.id="iafacil-cookie-banner";banner.setAttribute("role","region");banner.setAttribute("aria-label","Preferencias de privacidad");
banner.innerHTML='<strong>Tu privacidad, a tu elección</strong><p>La analítica propia nos ayuda a mejorar la landing. Meta mide campañas y conversiones solo si lo aceptas. Puedes elegir cada opción y cambiarla cuando quieras. <a id="iafacil-privacy-link" href="#">Ver privacidad</a></p><div class="actions"><button type="button" data-choice="all">Aceptar todas</button><button type="button" data-choice="reject">Solo necesarias</button><button type="button" data-choice="settings">Configurar</button></div>';
var settings=document.createElement("dialog");
settings.id="iafacil-cookie-settings-dialog";settings.setAttribute("aria-labelledby","iafacil-cookie-title");
settings.innerHTML='<h2 id="iafacil-cookie-title">Preferencias de cookies</h2><p>Las cookies necesarias recuerdan tu elección. La analítica propia y Meta son opcionales y permanecen desactivadas hasta que las autorices.</p><label><input type="checkbox" checked disabled> <span><strong>Necesarias</strong><br>Guardar la elección de privacidad.</span></label><label><input type="checkbox" id="iafacil-analytics-choice"> <span><strong>Analítica propia</strong><br>Medición agregada de visitas, secciones, scroll, CTA, checkout y uso de la demo.</span></label><label><input type="checkbox" id="iafacil-marketing-choice"> <span><strong>Meta Pixel</strong><br>Medir visitas, oferta, inicio de checkout y compras confirmadas.</span></label><div class="actions"><button type="button" data-choice="close">Cerrar</button><button type="button" data-choice="save">Guardar preferencias</button></div>';
document.body.append(banner,settings);
var basePath=location.pathname.replace(/gracias\/?$/,"");if(basePath.charAt(basePath.length-1)!=="/")basePath+="/";document.getElementById("iafacil-privacy-link").href=basePath+"privacidad.html";
window.iaFacilGetConsent=function(){return read()||{analytics:false,marketing:false};};
window.iaFacilOpenConsent=function(){var current=read()||{analytics:false,marketing:false};document.getElementById("iafacil-analytics-choice").checked=current.analytics;document.getElementById("iafacil-marketing-choice").checked=current.marketing;settings.showModal();};
banner.querySelector('[data-choice="all"]').addEventListener("click",function(){save({analytics:true,marketing:true});});
banner.querySelector('[data-choice="reject"]').addEventListener("click",function(){save({analytics:false,marketing:false});});
banner.querySelector('[data-choice="settings"]').addEventListener("click",window.iaFacilOpenConsent);
settings.querySelector('[data-choice="save"]').addEventListener("click",function(){save({analytics:document.getElementById("iafacil-analytics-choice").checked,marketing:document.getElementById("iafacil-marketing-choice").checked});});
settings.querySelector('[data-choice="close"]').addEventListener("click",function(){settings.close();});
document.querySelectorAll("#iafacil-cookie-settings,[data-cookie-settings]").forEach(function(link){link.addEventListener("click",function(event){event.preventDefault();window.iaFacilOpenConsent();});});
var current=read();banner.hidden=!!current;announce(current);
})();
