/* V6.1 mutation tracking: stamps changed entities, queues deletes, triggers debounced cloud sync. */
(()=>{
const TYPES={objects:'object',notes:'note',tasks:'task',events:'event',sources:'source',edges:'edge'};
let shadow={},ready=false;
const edgeKey=e=>`e:${e.from}:${e.to}:${e.type||'related_to'}`;
const entityId=(k,x)=>String(k==='edges'?edgeKey(x):(x.id||''));
const clean=x=>{let y={...x};delete y.updatedAt;if(y.id&&String(y.id).startsWith('e-')&&y.from&&y.to)y.id=edgeKey(y);return JSON.stringify(y)};
function normalizeEdges(){for(const e of DB?.edges||[])e.id=edgeKey(e)}
function snapshot(){normalizeEdges();for(const k of Object.keys(TYPES))shadow[k]=new Map((DB?.[k]||[]).map(x=>[entityId(k,x),clean(x)]));ready=true}
function queueDelete(type,id,deletedAt=new Date().toISOString()){let q=JSON.parse(localStorage.getItem('gkh-delete-queue')||'[]');let key=type+':'+id;if(!q.some(x=>x.key===key))q.push({key,type,id:String(id),deletedAt});localStorage.setItem('gkh-delete-queue',JSON.stringify(q))}
async function flushDeletes(){let q=JSON.parse(localStorage.getItem('gkh-delete-queue')||'[]');if(!q.length||!window.GKHCloud?.user)return;let done=[];for(const x of q){try{await window.GKHCloud.recordDeletion(x.type,x.id,x.deletedAt);done.push(x.key)}catch(e){console.warn('delete sync pending',e)}}if(done.length)localStorage.setItem('gkh-delete-queue',JSON.stringify(q.filter(x=>!done.includes(x.key))))}
const oldSave=save;
save=function(){normalizeEdges();if(!ready)snapshot();let now=new Date().toISOString(),dirty=false;for(const [k,type] of Object.entries(TYPES)){let arr=DB?.[k]||[],prev=shadow[k]||new Map(),seen=new Set();for(const x of arr){let id=entityId(k,x);seen.add(id);if(prev.get(id)!==clean(x)){x.updatedAt=now;dirty=true}}for(const id of prev.keys())if(!seen.has(id)){queueDelete(type,id,now);dirty=true}}oldSave();snapshot();if(dirty)window.GKHCloud?.scheduleSync?.()};
window.GKHFlushDeletes=flushDeletes;
function initTracker(){if(typeof DB==='undefined'||!DB)return setTimeout(initTracker,100);snapshot();flushDeletes()}
window.addEventListener('DOMContentLoaded',()=>setTimeout(initTracker,120));
})();