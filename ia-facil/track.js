/* IA Fácil · medición de embudo sin datos de formularios ni identificadores persistentes. */
(function(){
"use strict";
if(window.__iaFacilAnalyticsLoaded)return;
window.__iaFacilAnalyticsLoaded=true;
var E="https://cursoia.studyos-oficial-spain.workers.dev/t", M="https://cursoia.studyos-oficial-spain.workers.dev/meta";
var rawPath=location.pathname.replace(/^(\/studyos)?\/ia-facil/,"").replace(/index\.html$/,"").toLowerCase().replace(/[^a-z0-9_\/-]/g,"").slice(0,60)||"/";
if(rawPath.charAt(0)!=="/")rawPath="/"+rawPath;
var course=/^\/curso(\/|$)/.test(rawPath);
var path=course?rawPath:(rawPath==="/" ? "/v2" : "/v2"+rawPath), site=course?"course":"landing";
var seen={}, listenersStarted=false, analyticsPageViewSent=false, metaStarted=false, metaPageViewSent=false, metaViewContentSent=false, sectionObserver=null;
function getConsent(){return window.iaFacilGetConsent?window.iaFacilGetConsent():{analytics:false,marketing:false};}
function permitted(name){var c=getConsent();return name==="meta"?c.marketing===true:c.analytics===true;}
function keySafe(value){return String(value||"").toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_:.#\/-]/g,"").slice(0,60);}
function send(type,key,extra){
 if(!permitted("analytics")||navigator.doNotTrack==="1"||navigator.globalPrivacyControl===true)return;
 var legacy=(type==="pv"||type==="scroll"||type==="section"||type==="done"||type==="quiz")?type:"click";
 var normalized=legacy==="click"?"v2:"+type+":"+(key||""):key;
 var payload={s:site,t:legacy,p:path};
 if(legacy!=="pv")payload.k=keySafe(normalized);
 extra=extra||{};
 for(var x in extra)payload[x]=extra[x];
 var body=JSON.stringify(payload);
 try{if(navigator.sendBeacon&&navigator.sendBeacon(E,new Blob([body],{type:"text/plain"})))return;}catch(e){}
 try{fetch(E,{method:"POST",body:body,keepalive:true,mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",headers:{"Content-Type":"text/plain"}}).catch(function(){});}catch(e){}
}
function once(type,key){if(!permitted("analytics")||navigator.doNotTrack==="1"||navigator.globalPrivacyControl===true)return;var id=type+"|"+key;if(seen[id])return;seen[id]=1;send(type,key);}
function randomId(){
 var a=new Uint8Array(16);crypto.getRandomValues(a);return Array.from(a).map(function(x){return x.toString(16).padStart(2,"0");}).join("");
}
function readCookie(name){var prefix=name+"=";var item=document.cookie.split("; ").find(function(x){return x.indexOf(prefix)===0;});return item?item.slice(prefix.length):"";}
function metaCapi(name,id,data){
 if(!permitted("meta")||navigator.doNotTrack==="1"||navigator.globalPrivacyControl===true)return;
 var ud={},fbp=readCookie("_fbp"),fbc=readCookie("_fbc");
 if(fbp)ud.fbp=fbp;if(fbc)ud.fbc=fbc;
 try{fetch(M,{method:"POST",mode:"cors",credentials:"omit",keepalive:true,headers:{"Content-Type":"application/json"},body:JSON.stringify({event_name:name,event_id:id,event_source_url:location.origin+location.pathname,user_data:ud,custom_data:data||undefined})}).catch(function(){});}catch(e){}
}
function loadPixel(){
 if(!permitted("meta")||navigator.doNotTrack==="1"||navigator.globalPrivacyControl===true)return false;
 if(!window.fbq){
   var n=window.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);};
   if(!window._fbq)window._fbq=n;n.push=n;n.loaded=true;n.version="2.0";n.queue=[];
   var t=document.createElement("script");t.async=true;t.src="https://connect.facebook.net/en_US/fbevents.js";
   var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s);
 }
 if(!metaStarted){window.fbq("init","1420061570074591");metaStarted=true;}
 window.fbq("consent","grant");
 return true;
}
function metaEvent(name,data,id,sendServer){
 if(!loadPixel())return;
 var eventId=id||randomId();
 window.fbq("track",name,data||{},{eventID:eventId});
 if(sendServer)metaCapi(name,eventId,data);
}
function startMetaPageView(){
 if(metaPageViewSent||!permitted("meta"))return;
 metaPageViewSent=true;metaEvent("PageView",{},randomId(),true);
}
function cleanDimension(value){
 var v=String(value||"").trim().toLowerCase();
 if(!v||v.length>40||/@|https?:/.test(v)||(v.match(/\d/g)||[]).length>=7)return "";
 v=v.replace(/[^a-z0-9_-]/g,"_").replace(/_+/g,"_").replace(/^_|_$/g,"").slice(0,32);
 return v;
}
function sendDimension(name,value){var v=cleanDimension(value);if(v)once("dim",name+":"+v);}
function startAnalytics(){
 if(analyticsPageViewSent||!permitted("analytics")||navigator.doNotTrack==="1"||navigator.globalPrivacyControl===true)return;
 analyticsPageViewSent=true;
 var ref="";try{ref=document.referrer?new URL(document.referrer).hostname.toLowerCase().replace(/^www\./,""):"";}catch(e){}
 var q=new URLSearchParams(location.search);
 var source=q.get("utm_source")||(q.has("fbclid")?"meta":q.has("gclid")?"google":(ref&&ref!==location.hostname?ref:"directo"));
 send("pv","",{r:ref,u:cleanDimension(source)});
 [["source",source],["medium",q.get("utm_medium")],["campaign",q.get("utm_campaign")],["content",q.get("utm_content")],["language",(navigator.language||"").slice(0,16)]].forEach(function(x){sendDimension(x[0],x[1]);});
 var ua=navigator.userAgent||"",device=/ipad|tablet/i.test(ua)?"tablet":/mobi|android/i.test(ua)?"mobile":"desktop";
 var browser=/edg\//i.test(ua)?"edge":/firefox\//i.test(ua)?"firefox":/chrome\//i.test(ua)?"chrome":/safari\//i.test(ua)?"safari":"other";
 sendDimension("device",device);sendDimension("browser",browser);
}
function recordSection(el){
 if(permitted("analytics"))once("section",el.id);
 if(el.id==="oferta"&&permitted("meta")&&!metaViewContentSent&&navigator.doNotTrack!=="1"&&navigator.globalPrivacyControl!==true){
  metaViewContentSent=true;metaEvent("ViewContent",{content_name:"Oferta IA Fácil",content_category:"Curso online",content_type:"product",value:9.90,currency:"EUR"},randomId(),true);
 }
}
function startListeners(){
 if(listenersStarted)return;
 listenersStarted=true;
 var marks=[25,50,75,90,100],ticking=false;
 function scroll(){ticking=false;var max=document.documentElement.scrollHeight-innerHeight;if(max<=0)return;var pct=scrollY/max*100;marks.forEach(function(n){if(pct>=n-.5)once("scroll",n);});}
 addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(scroll);}},{passive:true});scroll();
 if("IntersectionObserver"in window){
   sectionObserver=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){recordSection(e.target);var c=getConsent();if(c.analytics&&(e.target.id!=="oferta"||c.marketing||metaViewContentSent))sectionObserver.unobserve(e.target);}});},{threshold:0,rootMargin:"0px 0px -40% 0px"});
   document.querySelectorAll("section[id]").forEach(function(el){sectionObserver.observe(el);});
 }
 var last="",lastAt=0;
 document.addEventListener("click",function(e){
   var a=e.target.closest&&e.target.closest("a,button");if(!a)return;
   var label="";
   if(a.matches("[data-checkout-trigger]")){
     label="checkout";var slot=a.closest(".float")?"sticky":a.closest("header.nav")?"nav":a.closest(".hero")?"hero":a.closest(".final")?"final":a.closest("#oferta")?"offer":a.closest(".demo-cta")?"demo":"other";
     send("cta","checkout");send("cta_slot",slot);
     metaEvent("InitiateCheckout",{content_name:"IA Fácil",content_category:"Curso online",content_type:"product",value:9.90,currency:"EUR"},randomId(),true);
   }else if(a.tagName==="A"){
     var h=a.getAttribute("href")||"";
     if(h.charAt(0)==="#")label="anchor:"+h.slice(1);
     else if(/modulo-(\d+)/.test(h))label="module_"+h.match(/modulo-(\d+)/)[1];
     else if(a.protocol==="mailto:")label="mail";
     else if(a.hostname===location.hostname)label="link:"+a.pathname.replace(/^(\/studyos)?\/ia-facil/,"");
     else label="ext:"+a.hostname.replace(/^www\./,"");
   }else label="btn:"+(a.id||(a.textContent||"").trim().slice(0,25).replace(/\s+/g,"_"));
   var now=Date.now();if(label===last&&now-lastAt<1000)return;last=label;lastAt=now;send("click",label);
   if(a.id==="improveBtn")send("demo","improve");
   if(a.id==="exampleBtn")send("demo","example");
 },true);
 document.querySelectorAll(".faq details").forEach(function(el){el.addEventListener("toggle",function(){if(el.open)send("faq",keySafe((el.querySelector("summary")||{}).textContent||"open"));});});
 var mod=(path.match(/\/modulo-(\d+)/)||[])[1];
 if(mod){var done=document.getElementById("done");if(done)done.addEventListener("change",function(){if(done.checked)once("done","m"+mod);});var result=document.getElementById("result");if(result&&window.MutationObserver)new MutationObserver(function(){if((result.textContent||"").trim())once("quiz","m"+mod);}).observe(result,{childList:true,characterData:true,subtree:true});}
}
async function purchaseEvent(sessionId){
 if(!permitted("meta")||!sessionId)return;
 try{var digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(sessionId));var id="purchase_"+Array.from(new Uint8Array(digest).slice(0,16)).map(function(x){return x.toString(16).padStart(2,"0");}).join("");metaEvent("Purchase",{content_name:"IA Fácil",content_category:"Curso online",content_type:"product",value:9.90,currency:"EUR"},id,false);}catch(e){}
}
window.iaFacilTrack=function(event,extra){
 extra=extra||{};
 var mapping={checkout_open:["checkout_open","dialog"],checkout_session_created:["checkout_session","created"],checkout_error:["checkout_error","start"],purchase_verified:["purchase","verified"],thankyou_verified:["thankyou","verified"],demo_improve:["demo","improve"],demo_example:["demo","example"]};
 if(event==="module_completed"){once("done","m"+Number(extra.module||0));return true;}
 if(event==="quiz_completed"){once("quiz","m"+Number(extra.module||0));return true;}
 if(event==="quiz_started"){send("click","quiz_start_m"+Number(extra.module||0));return true;}
 var item=mapping[event];if(item){if(event==="purchase_verified"||event==="thankyou_verified")once(item[0],item[1]);else send(item[0],item[1]);}
 if(event==="purchase_verified")purchaseEvent(String(extra.sessionId||""));
 return true;
};
window.addEventListener("iafacil:consent",function(e){
 var c=e.detail||{};
 if(c.analytics){startAnalytics();window.dispatchEvent(new Event("scroll"));}
 if(c.marketing)startMetaPageView();
 else if(window.fbq&&metaStarted){window.fbq("consent","revoke");document.cookie="_fbp=; Max-Age=0; path=/; SameSite=Lax; Secure";document.cookie="_fbc=; Max-Age=0; path=/; SameSite=Lax; Secure";}
 if(sectionObserver&&(c.analytics||c.marketing))document.querySelectorAll("section[id]").forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){sectionObserver.unobserve(el);sectionObserver.observe(el);}});
});
startListeners();startAnalytics();startMetaPageView();
})();
