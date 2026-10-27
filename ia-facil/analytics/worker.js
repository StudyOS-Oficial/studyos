// Worker "cursoia" · analítica anónima. Guarda SOLO contadores (sin IP, sin IDs).
const ORIGINS = new Set(["https://studyos-oficial.github.io", "https://studyos-omega-five.vercel.app"]);
const KINDS = new Set(["pv", "scroll", "click", "section", "done", "quiz"]);
const KEY = /^[a-z0-9_:.#\/-]{1,60}$/, PATH = /^\/[a-z0-9_\/-]{0,60}$/, HOST = /^[a-z0-9.-]{0,60}$/;
const MAX_PER_DAY = 600;
const META_GRAPH_VERSION = "v24.0";

const cors = (o) => ({ "Access-Control-Allow-Origin": o, "Vary": "Origin", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Max-Age": "86400" });
const reply = (o, status, body) => new Response(body ? JSON.stringify(body) : null, { status, headers: { ...cors(o), "Content-Type": "application/json", "Cache-Control": "no-store" } });
const madridDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
async function hash(s) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(d).slice(0,8)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
const device = ua => /tablet|ipad/i.test(ua) ? "tablet" : /mobile|android|iphone|ipod/i.test(ua) ? "movil" : "escritorio";
function bump(db,day,s,h,kind,key){return [
 db.prepare("INSERT OR IGNORE INTO dedupe(day,s,h,kind,key) VALUES(?,?,?,?,?)").bind(day,s,h,kind,key),
 db.prepare("INSERT INTO counters(day,s,kind,key,total,uniq) VALUES(?,?,?,?,1,changes()) ON CONFLICT(day,s,kind,key) DO UPDATE SET total=total+1, uniq=uniq+changes()").bind(day,s,kind,key)
];}
async function track(req,env,ctx,origin){
 let b;try{b=JSON.parse(await req.text())}catch{return reply(origin,400)}
 const {s,t,k="",p="/",r="",u=""}=b||{};
 if(!["landing","course"].includes(s)||!KINDS.has(t)||!PATH.test(p))return reply(origin,400);
 if(t!=="pv"&&!KEY.test(k))return reply(origin,400);
 const day=madridDay(),ua=req.headers.get("User-Agent")||"",ip=req.headers.get("CF-Connecting-IP")||"";
 const excluded=(env.EXCLUDED_IPS||"").split(",").map(x=>x.trim()).filter(Boolean);
 if(s==="landing"&&ip&&excluded.includes(ip))return reply(origin,204);
 const hour=s==="landing"?new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",hour:"2-digit",hourCycle:"h23"}).format(new Date()):"";
 const h=await hash((env.HASH_SECRET||"")+day+ip+ua);
 const rate=await env.DB.prepare("INSERT INTO rate(day,h,n) VALUES(?,?,1) ON CONFLICT(day,h) DO UPDATE SET n=n+1 RETURNING n").bind(day,h).first();
 if(rate&&rate.n>MAX_PER_DAY)return reply(origin,429);
 const hourly=(kind,key)=>bump(env.DB,day,s,h,"hr",hour+"|"+kind+"|"+key);
 let st=bump(env.DB,day,s,h,t,t==="pv"?p:p+"|"+k);
 if(s==="landing")st=st.concat(hourly(t,t==="pv"?p:p+"|"+k));
 if(t==="pv"){
  const clean=v=>String(v).toLowerCase().replace(/^www\./,"");
  const src=KEY.test(clean(u))?clean(u):HOST.test(r)&&r&&r!=="studyos-oficial.github.io"?clean(r):"directo";
  const extras=[["src",src],["dev",device(ua)],["cty",(req.headers.get("CF-IPCountry")||"??").slice(0,2)]];
  extras.forEach(([kind,key])=>{
   st=st.concat(bump(env.DB,day,s,h,kind,key));
   if(s==="landing")st=st.concat(hourly(kind,key));
  });
 }
 await env.DB.batch(st);
 if(Math.random()<0.02)ctx.waitUntil(env.DB.batch([env.DB.prepare("DELETE FROM dedupe WHERE day<?").bind(day),env.DB.prepare("DELETE FROM rate WHERE day<?").bind(day)]));
 return reply(origin,204);
}
async function metaCapi(req,env,origin){
  if(!env.META_ACCESS_TOKEN)return reply(origin,500,{error:"META_ACCESS_TOKEN no configurado"});
  let b;
  try{b=await req.json()}catch{return reply(origin,400,{error:"JSON inválido"})}
  const eventName=String(b?.event_name||"");
  const eventId=String(b?.event_id||"");
  const sourceUrl=String(b?.event_source_url||"");
  if(!/^(PageView|ViewContent|InitiateCheckout)$/.test(eventName)||!eventId||!/^https:\/\//.test(sourceUrl)){
    return reply(origin,400,{error:"evento inválido"});
  }

  const cookies=b?.user_data||{};
  const userData={
    client_user_agent:req.headers.get("User-Agent")||"",
    client_ip_address:req.headers.get("CF-Connecting-IP")||""
  };
  if(cookies.fbp)userData.fbp=String(cookies.fbp);
  if(cookies.fbc)userData.fbc=String(cookies.fbc);

  const event={
    event_name:eventName,
    event_time:Math.floor(Date.now()/1000),
    event_id:eventId,
    event_source_url:sourceUrl,
    action_source:"website",
    user_data:userData
  };
  if(b?.custom_data&&typeof b.custom_data==="object")event.custom_data=b.custom_data;

  const qs=b?.test_event_code?("?test_event_code="+encodeURIComponent(String(b.test_event_code))):"";
  const url="https://graph.facebook.com/"+META_GRAPH_VERSION+"/1420061570074591/events"+qs;
  const r=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({data:[event],access_token:env.META_ACCESS_TOKEN})
  });
  const out=await r.text();
  if(!r.ok)return reply(origin,502,{error:"Meta CAPI rechazó el evento",details:out});
  return reply(origin,200,{ok:true});
}

async function stats(req,env,origin){
 const auth=req.headers.get("Authorization")||"",want="Bearer "+(env.STATS_TOKEN||"");
 if(!env.STATS_TOKEN||auth.length!==want.length||[...auth].reduce((a,c,i)=>a|(c.charCodeAt(0)^want.charCodeAt(i)),0))return reply(origin,401,{error:"no autorizado"});
 const days=Math.min(365,Math.max(1,parseInt(new URL(req.url).searchParams.get("days"))||30));
 const from=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Madrid"}).format(new Date(Date.now()-days*864e5));
 const {results}=await env.DB.prepare("SELECT day,s,kind,key,total,uniq FROM counters WHERE day>=? ORDER BY day").bind(from).all();
 return reply(origin,200,{rows:results});
}
export default{async fetch(req,env,ctx){
 const origin=ORIGINS.has(req.headers.get("Origin"))?req.headers.get("Origin"):"",pathname=new URL(req.url).pathname;
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:origin?cors(origin):{}});
 if(pathname==="/t"&&req.method==="POST")return origin?track(req,env,ctx,origin):new Response(null,{status:403});
 if(pathname==="/meta"&&req.method==="POST")return origin?metaCapi(req,env,origin):new Response(null,{status:403});
 if(pathname==="/stats"&&req.method==="GET")return stats(req,env,origin||"null");
 return new Response("IA fácil analytics",{status:200});
}};