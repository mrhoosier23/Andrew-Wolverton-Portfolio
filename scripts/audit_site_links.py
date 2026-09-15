#!/usr/bin/env python3
"""Validate active internal fragment links and duplicate IDs.
Run: python3 scripts/audit_site_links.py
Media tab routes are checked against panel IDs. Archives and external links are excluded.
This structural check complements, but does not replace, semantic/browser review.
"""
import json,sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit,unquote
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=True);self.ids=[];self.links=[];self.active=None;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a' and 'href' in a:self.active={'href':a['href'],'label':''}
 def handle_data(self,text):
  if self.active:self.active['label']+=text
 def handle_endtag(self,tag):
  if tag=='a' and self.active:
   self.active['label']=' '.join(self.active['label'].split());self.links.append(self.active);self.active=None

def scan(root=ROOT):
 pages={p.relative_to(root).as_posix():Page(p.read_text()) for p in root.rglob('*.html') if not any(x in p.relative_to(root).parts for x in ('archive','.git','_maintenance','_qa'))}
 rows=[];errors=[]
 for path,page in sorted(pages.items()):
  errors += [f'{path}: duplicate id {i}' for i,n in Counter(page.ids).items() if n>1]
  for link in page.links:
   parsed=urlsplit(urljoin('https://www.awolverton.com/'+path,link['href']))
   if parsed.netloc not in ('www.awolverton.com','awolverton.com') or not parsed.fragment:continue
   dest=unquote(parsed.path).lstrip('/') or 'index.html'
   if dest.endswith('/'):dest+='index.html'
   fragment=unquote(parsed.fragment);kind='id';ok=dest in pages and fragment in pages[dest].ids
   if dest=='work/media/index.html' and fragment in ('audio','video','live'):
    ok=('panel-'+fragment) in pages[dest].ids;kind='media tab'
   rows.append({'source':path,'label':link['label'],'href':link['href'],'destination':parsed.path+('?' + parsed.query if parsed.query else '')+'#'+parsed.fragment,'kind':kind,'valid':ok})
   if not ok:errors.append(path+': unresolved fragment '+link['href'])
 return {'pages':len(pages),'anchor_uses':len(rows),'unique_destinations':len(set(x['destination'] for x in rows)),'errors':errors,'links':rows}
if __name__=='__main__':
 result=scan();print(json.dumps(result,indent=2));sys.exit(bool(result['errors']))
