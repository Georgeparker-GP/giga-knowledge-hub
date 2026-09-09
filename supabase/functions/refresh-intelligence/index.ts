import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// V6.2 V13 production architecture.
// Cron sends one private x-gkh-cron-token header. The token itself lives only in Supabase Vault.
// public.verify_gkh_cron_token() validates it server-side; no secret is stored in this repository.
const PROJECT_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const SOURCES = [
  { name: 'FC Barcelona', url: 'https://www.fcbarcelona.com/en/football/first-team/news', tier: 'Official', scope: 'football' },
  { name: 'APM Terminals', url: 'https://akamai.apmterminals.com/en/news/news-releases', tier: 'Official', scope: 'logistics' }
];
const cleanText=(s='')=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const absolute=(base:string,href:string)=>{try{return new URL(href,base).href}catch{return''}};
async function sha16(s:string){const b=await crypto.subtle.digest('SHA-1',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,16)}
function meta(html:string,prop:string){const p=prop.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const a=new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]+content=["']([^"']+)["'][^>]*>`,'i');const b=new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${p}["'][^>]*>`,'i');return cleanText(html.match(a)?.[1]||html.match(b)?.[1]||'')}
function jsonLdDate(html:string){for(const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{const j=JSON.parse(m[1]);for(const x of(Array.isArray(j)?j:[j])){if(x?.datePublished)return x.datePublished;if(x?.['@graph'])for(const y of x['@graph'])if(y?.datePublished)return y.datePublished}}catch{}}return''}
function fallbackDate(url:string,html:string,source:string){if(source==='FC Barcelona'){const m=cleanText(html).match(/Published date\s+(\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4})/i);if(m){const d=new Date(m[1]);if(!isNaN(+d))return d.toISOString()}}if(source==='APM Terminals'){const m=url.match(/\/20\d\d\/(\d{2})(\d{2})(\d{2})-/);if(m)return new Date(Date.UTC(2000+Number(m[1]),Number(m[2])-1,Number(m[3]))).toISOString()}return null}
async function articleMeta(url:string,source:string){try{const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 GKH/6.2'}});if(!r.ok)return{};const h=await r.text();let title=meta(h,'og:title')||cleanText(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');if(source==='FC Barcelona')title=title.replace(/\s*(?:\||-)\s*FC Barcelona.*$/i,'').replace(/\s+First Team.*$/i,'').replace(/\s+clock Published date.*$/i,'').trim();const summary=meta(h,'description')||meta(h,'og:description');const raw=jsonLdDate(h)||meta(h,'article:published_time');let published:string|null=null;if(raw){const d=new Date(raw);if(!isNaN(+d))published=d.toISOString()}if(!published)published=fallbackDate(url,h,source);return{title,summary,published}}catch{return{}}}
function discover(html:string,source:any){const out:any[]=[];for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){const u=absolute(source.url,m[1]),txt=cleanText(m[2]);if(!u||!txt||txt.length<12)continue;if(source.name==='FC Barcelona'&&!/\/en\/football\/first-team\/news\/\d+\//.test(u))continue;if(source.name==='APM Terminals'&&!/\/en\/news\/news-releases\/20\d\d\//.test(u))continue;out.push({url:u,title:txt})}return[...new Map(out.map(x=>[x.url,x])).values()].slice(0,30)}
async function authorized(req:Request){const supplied=req.headers.get('x-gkh-cron-token')||'';if(!supplied||!SERVICE_KEY||!PROJECT_URL)return false;try{const r=await fetch(`${PROJECT_URL}/rest/v1/rpc/verify_gkh_cron_token`,{method:'POST',headers:{apikey:SERVICE_KEY,Authorization:`Bearer ${SERVICE_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({p_token:supplied})});return r.ok&&(await r.json())===true}catch{return false}}
Deno.serve(async(req:Request)=>{
  if(req.method!=='POST')return Response.json({error:'method_not_allowed'},{status:405});
  if(!(await authorized(req)))return Response.json({error:'unauthorized'},{status:401});
  const report:any[]=[];
  for(const source of SOURCES){try{const r=await fetch(source.url,{headers:{'user-agent':'Mozilla/5.0 GKH/6.2'}});if(!r.ok){report.push({source:source.name,status:r.status,items:0});continue}const links=discover(await r.text(),source);let n=0;for(const link of links){const a:any=await articleMeta(link.url,source),title=a.title||link.title;if(!title)continue;const row={external_id:await sha16(link.url),source_name:source.name,source_url:link.url,title,summary:a.summary||null,published_at:a.published||null,source_tier:source.tier,data:{scope:source.scope,adapter:'article-metadata-v6'}};const up=await fetch(`${PROJECT_URL}/rest/v1/news_items?on_conflict=external_id`,{method:'POST',headers:{apikey:SERVICE_KEY,Authorization:`Bearer ${SERVICE_KEY}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(row)});if(up.ok)n++}report.push({source:source.name,status:200,items:n})}catch(e){report.push({source:source.name,status:0,items:0,error:String(e).slice(0,120)})}}
  return Response.json({ok:true,version:13,sources:report});
});
