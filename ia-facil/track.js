/* IA fácil · analítica anónima sin cookies ni identificadores de visitante. */
(function(){
"use strict";
if(window.__iaFacilAnalyticsLoaded)return;
window.__iaFacilAnalyticsLoaded=true;
if(navigator.doNotTrack==="1")return;
var E="https://cursoia.studyos-oficial-spain.workers.dev/t";
var path=location.pathname.replace(/^(\/studyos)?\/ia-facil/,"").replace(/index\.html$/,"").toLowerCase().replace(/[^a-z0-9_\/-]/g,"").slice(0,60)||"/";
if(path.charAt(0)!=="/")path="/"+path;
var site=/^\/curso(\/|$)/.test(path)?"course":"landing";
var mod=(path.match(/\/modulo-(\d+)/)||[])[1],seen={};
function send(t,k,extra){
 var o={s:site,t:t,p:path};if(k)o.k=String(k).toLowerCase().replace(/[^a-z0-9_:.#\/-]/g,"").slice(0,60);
 extra=extra||{};for(var x in extra)o[x]=extra[x];var body=JSON.stringify(o);
 try{if(navigator.sendBeacon&&navigator.sendBeacon(E,new Blob([body],{type:"text/plain"})))return}catch(e){}
 try{fetch(E,{method:"POST",body:body,keepalive:true,mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",headers:{"Content-Type":"text/plain"}}).catch(function(){})}catch(e){}
}
function once(t,k){var id=t+"|"+k;if(seen[id])return;seen[id]=1;send(t,k)}
var ref="";try{ref=document.referrer?new URL(document.referrer).hostname:""}catch(e){}
var q=new URLSearchParams(location.search);var src=q.get("utm_source")||(q.has("fbclid")?"meta":q.has("gclid")?"google":"");send("pv","",{r:ref,u:src});
var marks=[25,50,75,90,100],ticking=false;
function scroll(){ticking=false;var max=document.documentElement.scrollHeight-innerHeight;if(max<=0)return;var pct=scrollY/max*100;marks.forEach(function(n){if(pct>=n-.5)once("scroll",n)})}
addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(scroll)}},{passive:true});scroll();
if("IntersectionObserver"in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){once("section",e.target.id);io.unobserve(e.target)}})},{threshold:0,rootMargin:"0px 0px -40% 0px"});document.querySelectorAll("section[id]").forEach(function(el){io.observe(el)})}
var last="",lastT=0;
addEventListener("click",function(e){
 var a=e.target.closest&&e.target.closest("a,button");if(!a)return;var l="";
 if(a.tagName==="A"){var h=a.getAttribute("href")||"";
  if(a.hasAttribute("data-checkout-trigger")||/buy\.stripe\.com/.test(a.href))l="buy_stripe";
  else if(h.charAt(0)==="#")l="anchor:"+h.slice(1);
  else if(/modulo-(\d+)/.test(h))l="module_"+h.match(/modulo-(\d+)/)[1];
  else if(a.protocol==="mailto:")l="mail";
  else if(a.hostname===location.hostname)l="link:"+a.pathname.replace(/^(\/studyos)?\/ia-facil/,"");
  else l="ext:"+a.hostname.replace(/^www\./,"");
 }else l="btn:"+(a.id||(a.textContent||"").trim().slice(0,25).replace(/\s+/g,"_"));
 var now=Date.now();if(l===last&&now-lastT<1000)return;last=l;lastT=now;send("click",l)
},true);
if(mod){
 var done=document.getElementById("done");if(done)done.addEventListener("change",function(){if(done.checked)once("done","m"+mod)});
 var res=document.getElementById("result");if(res&&window.MutationObserver)new MutationObserver(function(){if((res.textContent||"").trim())once("quiz","m"+mod)}).observe(res,{childList:true,characterData:true,subtree:true})
}
window.iaFacilTrack=function(event,extra){
 extra=extra||{};var m=Number(extra.module||mod||0);
 if(event==="module_completed")once("done","m"+m);
 else if(event==="quiz_completed")once("quiz","m"+m);
 else if(event==="quiz_started")once("click","quiz_start_m"+m);
 return true;
};
})();