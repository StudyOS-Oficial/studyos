// Worker "cursoia" · analítica agregada y Meta CAPI con consentimiento.
const ORIGINS = new Set(["https://studyos-oficial.github.io"]);
const SITES = new Set(["landing", "course", "landing_v2", "course_v2"]);
const KINDS = new Set(["pv", "scroll", "click", "section", "done", "quiz", "cta", "cta_slot", "checkout_open", "checkout_session", "checkout_error", "faq", "demo", "purchase", "thankyou"]);
const KEY = /^[a-z0-9_:.#\/-]{1,60}$/, PATH = /^\/[a-z0-9_\/-]{0,60}$/, HOST = /^[a-z0-9.-]{0,60}$/;
const TAG = /^[a-z0-9_:.\/-]{1,60}$/;
const MAX_PER_DAY = 600;
const CUTOVER_DATE = "2026-10-21";
const META_GRAPH_VERSION = "v26.0";
const META_PIXEL_ID = "1420061570074591";
const cors = o => ({ "Access-Control-Allow-Origin": o, "Vary": "Origin", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Max-Age": "86400" });
const reply = (o, status, body) => new Response(body ? JSON.stringify(body) : null, { status, headers: { ...cors(o), "Content-Type": "application/json", "Cache-Control": "no-store" } });
const madridDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
async function hash(s) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(d).slice(0,8)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
const device = ua => /tablet|ipad/i.test(ua) ? "tablet" : /mobile|android|iphone|ipod/i.test(ua) ? "movil" : "escritorio";
function safeTag(v) { return String(v || "").toLowerCase().trim().replace(/\s+/g,"-").replace(/[^a-z0-9_:.\/-]/g,"").slice(0,60); }
function bump(db,day,s,h,kind,key) { return [
  db.prepare("INSERT OR IGNORE INTO dedupe(day,s,h,kind,key) VALUES(?,?,?,?,?)").bind(day,s,h,kind,key),
  db.prepare("INSERT INTO counters(day,s,kind,key,total,uniq) VALUES(?,?,?,?,1,changes()) ON CONFLICT(day,s,kind,key) DO UPDATE SET total=total+1, uniq=uniq+changes()").bind(day,s,kind,key)
]; }
async function track(req,env,ctx,origin) {
  let b; try { b=JSON.parse(await req.text()); } catch { return reply(origin,400); }
  const {s,t,k="",p="/",r="",u="",um="",uc="",uo="",lang=""}=b||{};
  if(!SITES.has(s)||!KINDS.has(t)||!PATH.test(p)) return reply(origin,400);
  if(t!=="pv"&&!KEY.test(k)) return reply(origin,400);
  const day=madridDay(), ua=req.headers.get("User-Agent")||"";
  const h=await hash((env.HASH_SECRET||"")+day+(req.headers.get("CF-Connecting-IP")||"")+ua);
  const rate=await env.DB.prepare("INSERT INTO rate(day,h,n) VALUES(?,?,1) ON CONFLICT(day,h) DO UPDATE SET n=n+1 RETURNING n").bind(day,h).first();
  if(rate&&rate.n>MAX_PER_DAY) return reply(origin,429);
  let st=bump(env.DB,day,s,h,t,t==="pv"?p:p+"|"+k);
  if(t==="pv") {
    const clean=v=>safeTag(v).replace(/^www\./,"");
    const src=clean(u)||((HOST.test(r)&&r&&r!=="studyos-oficial.github.io")?clean(r):"directo");
    st=st.concat(bump(env.DB,day,s,h,"source",src),bump(env.DB,day,s,h,"device",device(ua)),bump(env.DB,day,s,h,"country",(req.headers.get("CF-IPCountry")||"??").slice(0,2).toLowerCase()));
    if(s==="landing_v2") {
      const dimensions=[["medium",um],["campaign",uc],["content",uo],["language",lang]];
      for(const [kind,value] of dimensions) { const cleanValue=clean(value); if(cleanValue&&TAG.test(cleanValue)) st=st.concat(bump(env.DB,day,s,h,kind,cleanValue)); }
    }
  }
  await env.DB.batch(st);
  if(Math.random()<0.02) ctx.waitUntil(env.DB.batch([env.DB.prepare("DELETE FROM dedupe WHERE day<?").bind(day),env.DB.prepare("DELETE FROM rate WHERE day<?").bind(day)]));
  return reply(origin,204);
}
function allowedCustomData(input) {
  if(!input||typeof input!=="object") return undefined;
  const out={};
  if(typeof input.content_name==="string"&&/^[A-Za-z0-9 _-]{1,80}$/.test(input.content_name)) out.content_name=input.content_name;
  if(typeof input.content_category==="string"&&/^[A-Za-z0-9 _-]{1,80}$/.test(input.content_category)) out.content_category=input.content_category;
  if(typeof input.content_type==="string"&&/^[A-Za-z0-9_-]{1,40}$/.test(input.content_type)) out.content_type=input.content_type;
  if(input.currency==="EUR") out.currency="EUR";
  if(Number.isFinite(Number(input.value))&&Number(input.value)>=0&&Number(input.value)<=10000) out.value=Number(input.value);
  return Object.keys(out).length?out:undefined;
}
async function metaCapi(req,env,origin) {
  if(!env.META_ACCESS_TOKEN) return reply(origin,503,{error:"Meta CAPI no está configurado"});
  let b; try { b=await req.json(); } catch { return reply(origin,400,{error:"JSON inválido"}); }
  const eventName=String(b?.event_name||""), eventId=String(b?.event_id||"");
  let sourceUrl; try { sourceUrl=new URL(String(b?.event_source_url||"")); } catch { return reply(origin,400,{error:"URL de evento inválida"}); }
  if(!["PageView","ViewContent","InitiateCheckout"].includes(eventName)||!/^[A-Za-z0-9_-]{1,100}$/.test(eventId)||sourceUrl.origin!=="https://studyos-oficial.github.io"||!sourceUrl.pathname.startsWith("/studyos/ia-facil/")) return reply(origin,400,{error:"evento inválido"});
  const cookies=b?.user_data||{}, userData={client_user_agent:req.headers.get("User-Agent")||"",client_ip_address:req.headers.get("CF-Connecting-IP")||""};
  if(typeof cookies.fbp==="string"&&/^fb\.[0-9]{1,2}\.[0-9]{8,16}\.[A-Za-z0-9_-]{1,128}$/.test(cookies.fbp)) userData.fbp=cookies.fbp;
  if(typeof cookies.fbc==="string"&&/^fb\.[0-9]{1,2}\.[0-9]{8,16}\.[A-Za-z0-9_-]{1,128}$/.test(cookies.fbc)) userData.fbc=cookies.fbc;
  const event={event_name:eventName,event_time:Math.floor(Date.now()/1000),event_id:eventId,event_source_url:sourceUrl.origin+sourceUrl.pathname,action_source:"website",user_data:userData};
  const customData=allowedCustomData(b?.custom_data); if(customData) event.custom_data=customData;
  const response=await fetch("https://graph.facebook.com/"+META_GRAPH_VERSION+"/"+META_PIXEL_ID+"/events",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({data:[event],access_token:env.META_ACCESS_TOKEN})
  });
  if(!response.ok) return reply(origin,502,{error:"Meta CAPI rechazó el evento"});
  return reply(origin,200,{ok:true});
}
async function stats(req,env,origin) {
  const auth=req.headers.get("Authorization")||"", want="Bearer "+(env.STATS_TOKEN||"");
  if(!env.STATS_TOKEN||auth.length!==want.length||[...auth].reduce((a,c,i)=>a|(c.charCodeAt(0)^want.charCodeAt(i)),0)) return reply(origin,401,{error:"no autorizado"});
  const params=new URL(req.url).searchParams, validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||"");
  const requestedFrom=params.get("from"), requestedTo=params.get("to");
  const from=validDate(requestedFrom)&&requestedFrom>CUTOVER_DATE?requestedFrom:CUTOVER_DATE;
  const to=validDate(requestedTo)?requestedTo:madridDay();
  if(from>to) return reply(origin,400,{error:"rango de fechas inválido"});
  const {results}=await env.DB.prepare("SELECT day,s,kind,key,total,uniq FROM counters WHERE s='landing_v2' AND day>=? AND day<=? ORDER BY day").bind(from,to).all();
  return reply(origin,200,{rows:results,cutover_date:CUTOVER_DATE,from,to});
}
export default { async fetch(req,env,ctx) {
  const origin=ORIGINS.has(req.headers.get("Origin"))?req.headers.get("Origin"):"", pathname=new URL(req.url).pathname;
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:origin?cors(origin):{}});
  if(pathname==="/t"&&req.method==="POST") return origin?track(req,env,ctx,origin):new Response(null,{status:403});
  if(pathname==="/meta"&&req.method==="POST") return origin?metaCapi(req,env,origin):new Response(null,{status:403});
  if(pathname==="/stats"&&req.method==="GET") return stats(req,env,origin||"null");
  return new Response("IA fácil analytics",{status:200});
} };
