/* V6.1 mutation tracking: stamps changed entities, persists deletes, retries tombstones, triggers cloud sync. */
(()=>{
const TYPES={objects:'object',notes:'note',tasks:'task',events:'event',sources:'source',edges:'edge'};
let shadow={},ready=false,deleteRetryTimer=null;
const edgeKey=e=>`e:${e.from}:${e.to}:${e.type||'related_to'}`;
const entityId=(k,x)=>String(k==='edges'?edgeKey(x):(x.id||''));
const clean=x=>{let y={...x};delete y.updatedAt;if(y.id&&String(y.id).startsWith('e-')&&y.from&&y.to)y.id=edgeKey(y);return JSON.stringify(y)};
function normalizeEdges(){for(const e of DB?.edges||[])e.id=edgeKey(e)}
function snapshot(){normalizeEdges();for(const k of Object.keys(TYPES))shadow[k]=new Map((DB?.[k]||[]).map(x=>[entityId(k,x),clean(x)]));ready=true}
function readQueue(){try{return JSON.parse(localStorage.getItem('gkh-delete-queue')||'[]')}catch(_){return[]}}
function writeQueue(q){localStorage.setItem('gkh-delete-queue',JSON.stringify(q))}
function queueDelete(type,id,deletedAt=new Date().toISOString()){
  let q=readQueue(),key=type+':'+id,found=q.find(x=>x.key===key);
  if(found){if(new Date(deletedAt)>new Date(found.deletedAt))found.deletedAt=deletedAt}
  else q.push({key,type,id:String(id),deletedAt});
  writeQueue(q);
  scheduleDeleteFlush(50);
}
function scheduleDeleteFlush(delay=700){clearTimeout(deleteRetryTimer);deleteRetryTimer=setTimeout(()=>flushDeletes(),delay)}
async function flushDeletes(){
  let q=readQueue();
  if(!q.length)return true;
  if(!window.GKHCloud?.user){scheduleDeleteFlush(1500);return false}
  let done=[];
  for(const x of q){
    try{await window.GKHCloud.recordDeletion(x.type,x.id,x.deletedAt);done.push(x.key)}
    catch(e){console.warn('delete sync pending',e)}
  }
  if(done.length){
    q=readQueue().filter(x=>!done.includes(x.key));writeQueue(q);
    window.GKHCloud?.scheduleSync?.();
  }
  if(q.length)scheduleDeleteFlush(2000);
  return q.length===0;
}
const oldSave=save;
save=function(){
  normalizeEdges();
  if(!ready){oldSave();snapshot();return}
  let now=new Date().toISOString(),dirty=false,deleted=false;
  for(const [k,type] of Object.entries(TYPES)){
    let arr=DB?.[k]||[],prev=shadow[k]||new Map(),seen=new Set();
    for(const x of arr){let id=entityId(k,x);seen.add(id);if(prev.get(id)!==clean(x)){x.updatedAt=now;dirty=true}}
    for(const id of prev.keys())if(!seen.has(id)){queueDelete(type,id,now);dirty=true;deleted=true}
  }
  oldSave();snapshot();
  if(deleted)flushDeletes();
  else if(dirty)window.GKHCloud?.scheduleSync?.();
};
window.GKHFlushDeletes=flushDeletes;
function initTracker(){if(typeof DB==='undefined'||!DB)return setTimeout(initTracker,100);snapshot();flushDeletes()}
if(typeof DB!=='undefined'&&DB)queueMicrotask(initTracker);else window.addEventListener('DOMContentLoaded',()=>setTimeout(initTracker,60));
})();