#!/usr/bin/env python3
import json,re,time,urllib.request,xml.etree.ElementTree as ET,hashlib
from pathlib import Path
from email.utils import parsedate_to_datetime
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'data'/'live.json'
FEEDS=[
 {'name':'FC Barcelona','scope':'football','tier':'Official','url':'https://www.fcbarcelona.com/en/rss/news'},
 {'name':'Port Technology','scope':'logistics','tier':'Trusted Specialist','url':'https://www.porttechnology.org/feed/'},
]
HIGH=['barcelona','fc barcelona','georgia','georgian','legionnaire','middle corridor','black sea']
RELEVANT=['port','terminal','container','shipping','supply chain','logistics','corridor','maritime','champions league','la liga']
def clean(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s or '')).strip()
def txt(node,*names):
 for n in names:
  v=node.findtext(n)
  if v:return clean(v)
 return ''
def priority(title,scope):
 s=title.lower()
 if any(k in s for k in HIGH): return 'High Priority'
 if any(k in s for k in RELEVANT): return 'Relevant'
 return 'More News'
def parse_date(v):
 try:return parsedate_to_datetime(v).isoformat() if v else None
 except:return v or None
def fetch(src):
 try:
  req=urllib.request.Request(src['url'],headers={'User-Agent':'Mozilla/5.0 GigaKnowledgeHub/1.0'})
  with urllib.request.urlopen(req,timeout=20) as r: raw=r.read()
  root=ET.fromstring(raw); nodes=root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry'); out=[]
  for n in nodes[:30]:
   title=txt(n,'title','{http://www.w3.org/2005/Atom}title'); desc=txt(n,'description','summary','{http://www.w3.org/2005/Atom}summary'); pub=txt(n,'pubDate','published','updated','{http://www.w3.org/2005/Atom}published','{http://www.w3.org/2005/Atom}updated')
   link=txt(n,'link')
   if not link:
    el=n.find('{http://www.w3.org/2005/Atom}link'); link=el.get('href','') if el is not None else ''
   if not title or not link:continue
   key=hashlib.sha1((src['name']+link).encode()).hexdigest()[:16]
   out.append({'id':key,'scope':src['scope'],'source':src['name'],'source_tier':src['tier'],'title':title,'url':link,'summary':desc[:360],'published_at':parse_date(pub),'priority':priority(title,src['scope']),'verification':'Official / Confirmed' if src['tier']=='Official' else 'Single Source','tags':[k.title() for k in HIGH+RELEVANT if k in title.lower()][:5]})
  return out,None
 except Exception as e:return [],str(e)
def cluster(items):
 groups={}
 for x in items:
  words=set(re.findall(r'[a-zA-Z]{4,}',x['title'].lower()))
  match=None
  for k,g in groups.items():
   base=g[0]['_words']; score=len(words&base)/max(1,len(words|base))
   if score>.48:match=k;break
  if match is None:match=x['id'];groups[match]=[]
  x['_words']=words;groups[match].append(x)
 for gid,g in groups.items():
  if len(g)>1:
   for x in g:x['cluster_id']=gid;x['verification']='Multiple Sources' if len({z['source'] for z in g})>1 else x['verification']
  for x in g:x.pop('_words',None)
 return items
def main():
 items=[]; health=[]
 for src in FEEDS:
  got,err=fetch(src);items+=got;health.append({'source':src['name'],'ok':not bool(err),'items':len(got),'error':err})
 seen=set();unique=[]
 for x in items:
  k=x['url'].split('?')[0].lower()
  if k in seen:continue
  seen.add(k);unique.append(x)
 unique=cluster(unique); rank={'High Priority':0,'Relevant':1,'More News':2};unique.sort(key=lambda x:(rank.get(x['priority'],9),x.get('published_at') or ''),reverse=False)
 payload={'schema_version':2,'updated_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'status':'ok' if unique else 'no_items','source_health':health,'counts':{'total':len(unique),'high_priority':sum(x['priority']=='High Priority' for x in unique),'logistics':sum(x['scope']=='logistics' for x in unique),'football':sum(x['scope']=='football' for x in unique)},'items':unique[:80]}
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8');print('Wrote',len(unique[:80]),'items')
if __name__=='__main__':main()
