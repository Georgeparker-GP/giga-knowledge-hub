/* V6.1 mutation tracking: stamps changed entities, queues deletes, triggers debounced cloud sync. */
(()=>{
const TYPES={objects:'object',notes:'note',tasks:'task',events:'event',sources:'source',edges:'edge'};
let shadow={};
const clean=x=>{let y={...x};delete y.updatedAt;return JSON.stringify(y)};
function snapshot(){for(const k of Object.keys(TYPES))shadow[k]=new Map((DB?.[k]||[]).map(x=>[String(x.id||`${x.from}:${x.to}:${x.type||'related_to'}`),clean(x)]))}
function queueDelete(type,id){let q=JSON.parse(localStorage.getItem('gkh-delete-queue')||'[]');let key=type+':'+id;if(!q.some(x=>x.key===key))q.push({key,type,id:String(id),deletedAt:new Date().toISOString()});localStorage.setItem('gkh-delete-queue',JSON.stringify(q))}
async function flushDeletes(){let q=JSON.parse(localStorage.getItem('gkh-delete-queue')||'[]');if(!q.length||!window.GKHCloud?.user)return;let done=[];for(const x of q){try{await window.GKHCloud.recordDeletion(x.type,x.id,x.deletedAt);done.push(x.key)}catch(e){console.warn('delete sync pending',e)}}if(done.length)localStorage.setItem('gkh-delete-queue',JSON.stringify(q.filter(x=>!done.includes(x.key))))}
const oldSave=save;
save=function(){let now=new Date().toISOString();for(const [k,type] of Object.entries(TYPES)){let arr=DB?.[k]||[],prev=shadow[k]||new Map(),seen=new Set();for(const x of arr){if(!x.id&&k==='edges')x.id='e-'+crypto.randomUUID();let id=String(x.id||`${x.from}:${x.to}:${x.type||'related_to'}`);seen.add(id);if(prev.get(id)!==clean(x))x.updatedAt=now}for(const id of prev.keys())if(!seen.has(id))queueDelete(type,id)}oldSave();snapshot();window.GKHCloud?.scheduleSync?.()};
window.GKHFlushDeletes=flushDeletes;
window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{snapshot();flushDeletes()},250));
})();