#!/usr/bin/env python3
import json, re, time, urllib.request, xml.etree.ElementTree as ET
from pathlib import Path
from email.utils import parsedate_to_datetime

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'/'live.json'
# Public feeds only. Add/replace feeds as source availability changes.
FEEDS=[
 {'name':'FC Barcelona','scope':'football','priority':'High','url':'https://www.fcbarcelona.com/en/rss/news'},
 {'name':'Port Technology','scope':'logistics','priority':'Relevant','url':'https://www.porttechnology.org/feed/'},
]

def clean(s): return re.sub(r'<[^>]+>',' ',s or '').replace('\n',' ').strip()
def fetch(src):
 try:
  req=urllib.request.Request(src['url'],headers={'User-Agent':'GigaKnowledgeHub/1.0'})
  with urllib.request.urlopen(req,timeout=20) as r: raw=r.read()
  root=ET.fromstring(raw); out=[]
  for node in root.findall('.//item')[:20]:
   title=clean(node.findtext('title')); link=clean(node.findtext('link')); desc=clean(node.findtext('description')); pub=clean(node.findtext('pubDate'))
   if not title or not link: continue
   try: published=parsedate_to_datetime(pub).isoformat() if pub else None
   except Exception: published=pub or None
   out.append({'id':str(abs(hash(src['name']+link))),'scope':src['scope'],'source':src['name'],'title':title,'url':link,'summary':desc[:320],'published_at':published,'priority':src['priority'],'verification':'Primary/Official' if 'Barcelona' in src['name'] else 'Single Source'})
  return out
 except Exception as e:
  print(f"WARN {src['name']}: {e}"); return []

def main():
 items=[]
 for src in FEEDS: items.extend(fetch(src))
 # Deduplicate by URL/title and preserve only latest reasonable set.
 seen=set(); unique=[]
 for x in items:
  k=x['url'] or x['title'].lower()
  if k in seen: continue
  seen.add(k); unique.append(x)
 payload={'updated_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'status':'ok' if unique else 'no_items','items':unique[:50]}
 OUT.parent.mkdir(parents=True,exist_ok=True); OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
 print(f"Wrote {len(unique[:50])} items")
if __name__=='__main__': main()
