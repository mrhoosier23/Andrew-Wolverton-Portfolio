from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright
import json,hashlib,threading,subprocess,traceback
ROOT=Path('.').resolve();OUT=ROOT/'_qa/site-chrome';OUT.mkdir(parents=True,exist_ok=True)
pages=json.loads((ROOT/'_maintenance/site-chrome-build-report.json').read_text())['pages']
report={'status':'running','pages':pages,'checks':[]}
def digest(p):
 d=p.read_bytes();return hashlib.sha1(b'blob '+str(len(d)).encode()+b'\0'+d).hexdigest()
def original(n):return subprocess.check_output(['git','show','HEAD:'+n]).decode()
for n in pages:
 s=BeautifulSoup((ROOT/n).read_text(),'html.parser')
 assert len(s.select('[data-site-footer]'))==1 and len(s.select('#contactForm'))==1,n
 ids=[e['id'] for e in s.select('[id]')];assert len(ids)==len(set(ids)),n
 assert not [a for a in s.select('nav a[href]') if 'ai-schools.html' in a['href']],n
 assert not s.select('a[href*="github.com"]'),n
 for a in s.select('a[href]'):
  u=urlsplit(a['href'])
  if u.scheme or u.netloc:continue
  target=(ROOT/n).parent/unquote(u.path) if u.path else ROOT/n
  if u.path.startswith('/'):target=ROOT/unquote(u.path).lstrip('/')
  if target.is_dir():target=target/'index.html'
  assert target.exists(),(n,a['href'])
  if u.fragment and target.resolve()==(ROOT/n).resolve():assert unquote(u.fragment) in ids,(n,a['href'])
 if n in ['index.html','services.html','ai-schools.html']:
  o=BeautifulSoup(original(n),'html.parser');f=s.select_one('#contactForm');old=o.select_one('#contactForm')
  assert f['action']==old['action'] and {e.get('name') for e in f.select('[name]')}=={e.get('name') for e in old.select('[name]')},n
a=BeautifulSoup((ROOT/'services.html').read_text(),'html.parser');b=BeautifulSoup(original('services.html'),'html.parser')
for ident in ['services','packages','process','toolkit','faq']:assert str(a.select_one('#'+ident))==str(b.select_one('#'+ident)),ident
for n in ['ai-schools-page.js','ai-schools.css','work/media/audio-library.json','music-lab/simple.js','music-lab/studio.js']:
 if (ROOT/n).exists():assert (ROOT/n).read_text()==original(n),n
assert a.select_one('a[href="ai-schools.html"]'),'Keep school service link'
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
def ready(page,url):
 page.goto(url,wait_until='domcontentloaded')
 page.wait_for_function('getComputedStyle(document.querySelector(".aw-site-footer")).display==="block"')
 page.evaluate('Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,8000))])')
def save_sections(page,n,engine,w):
 if n not in ['index.html','mobile.html','services.html','projects.html','ai-schools.html'] or w not in [390,1440]:return
 selector='[data-site-contact]' if n!='ai-schools.html' else '[data-site-footer]'
 page.locator(selector).screenshot(path=str(OUT/f'{engine}-{w}-{n.split(".")[0]}-contact.png'))
 page.locator('[data-site-footer]').screenshot(path=str(OUT/f'{engine}-{w}-{n.split(".")[0]}-footer.png'))
try:
 with sync_playwright() as p:
  for engine in ['chromium','webkit']:
   browser=getattr(p,engine).launch()
   configs=[(n,w,844 if w<1000 else 1000) for n in pages for w in [390,1440]]+[(n,w,h) for n in ['index.html','mobile.html','services.html','projects.html'] for w,h in [(320,568),(768,1024),(844,390)]]
   for n,w,h in configs:
    page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<1000,reduced_motion='reduce');page.set_default_timeout(15000)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)));submitted=[]
    def no_send(route):
     submitted.append(route.request.post_data or '')
     route.fulfill(status=200,content_type='application/json',body='{"success":"true"}',headers={'Access-Control-Allow-Origin':'*'})
    page.route('https://formsubmit.co/**',no_send)
    try:
     ready(page,base+n+('?full=1' if n=='index.html' else ''))
     assert page.locator('[data-site-footer]').count()==1
     assert not page.locator('nav a[href*=ai-schools]').count() and not page.locator('a[href*="github.com"]').count()
     assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(n,w,'overflow')
     if n!='ai-schools.html':
      image=page.locator('.sf-portrait img');image.scroll_into_view_if_needed();page.wait_for_function('document.querySelector(".sf-portrait img") && document.querySelector(".sf-portrait img").complete && document.querySelector(".sf-portrait img").naturalWidth>0')
      assert image.evaluate('i=>i.naturalWidth===977 && i.naturalHeight===1610 && getComputedStyle(i).objectFit==="contain"')
      assert page.locator('.sf-portrait-clip').evaluate('e=>getComputedStyle(e).overflow==="hidden" && getComputedStyle(e).clipPath!=="none"')
      assert page.locator('.sf-contact-form').evaluate('e=>e.getBoundingClientRect().left>=0 && e.getBoundingClientRect().right<=innerWidth')
      save_sections(page,n,engine,w)
      page.locator('[name=name]').fill('Local interface test, not sent');page.locator('[name=email]').fill('test@example.invalid');page.locator('[name=message]').fill('Intercepted test. No email sent.')
      page.locator('#contactForm button[type=submit]').click();page.wait_for_function('document.getElementById("contactFormNote").classList.contains("is-success")');assert len(submitted)==1,(n,'duplicate submission')
      if n=='services.html':
       page.locator('#serviceWeb [data-service-choice]').click();assert page.locator('#contactProjectType').input_value()=='Websites'
      page.locator('#contactForm').evaluate('e=>{e.reset();const n=e.querySelector(".form-note");n.classList.remove("is-success");n.textContent="Your inquiry goes directly to Andrew."}')
     else:save_sections(page,n,engine,w)
     if n=='projects.html':
      page.locator('[data-work-preview=workflows]').click();page.locator('#projectionImage').evaluate('i=>i.decode()')
      assert page.locator('.projection-image-wrap').evaluate('e=>getComputedStyle(e).backgroundColor==="rgb(254, 254, 254)" && getComputedStyle(e.firstElementChild).backgroundColor==="rgb(254, 254, 254)" && getComputedStyle(e.firstElementChild).boxShadow==="none"')
      if w in [390,1440]:page.locator('.switchboard').screenshot(path=str(OUT/f'{engine}-{w}-workflow-preview.png'))
      page.locator('[data-work-preview=websites]').click();assert not page.locator('.is-avatar-preview').count()
     if w<761:
      page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
      page.wait_for_function('document.querySelector(".unified-menu-toggle").getBoundingClientRect().top>=0')
      page.locator('.unified-menu-toggle').click();assert page.locator('.unified-menu-close').is_visible()
      assert not page.locator('#siteNav a[href*=ai-schools]').count();page.keyboard.press('Escape')
     assert not errors,(n,w,errors)
     report['checks'].append({'page':n,'engine':engine,'width':w,'height':h,'passed':True,'form_requests':len(submitted)});print(n,engine,w,'passed',flush=True)
    except Exception:
     page.screenshot(path=str(OUT/f'failure-{engine}-{w}-{n.replace("/","-")}.png'),full_page=True)
     raise
    finally:page.close()
   page=browser.new_page(viewport={'width':390,'height':844})
   page.route('https://formsubmit.co/**',lambda r:r.fulfill(status=503,body='{}',headers={'Access-Control-Allow-Origin':'*'}))
   ready(page,base+'services.html');page.locator('[name=name]').fill('Do not send');page.locator('[name=email]').fill('test@example.invalid');page.locator('[name=message]').fill('Keep this draft')
   page.locator('#contactForm button[type=submit]').click();page.wait_for_function('document.getElementById("contactFormNote").classList.contains("is-error")')
   assert page.locator('[name=message]').input_value()=='Keep this draft' and page.locator('#contactForm button').is_enabled()
   page.route('**/assets/andrew-doon.webp',lambda r:r.abort());ready(page,base+'services.html');page.locator('.sf-portrait img').scroll_into_view_if_needed();page.wait_for_function('document.querySelector(".sf-portrait img").naturalWidth>0')
   assert 'Andrew-doon.PNG' in page.locator('.sf-portrait img').get_attribute('src');page.close();browser.close()
 report['status']='passed'
except Exception as e:
 report['status']='failed';report['error']=repr(e);report['traceback']=traceback.format_exc();raise
finally:
 server.shutdown();changed=pages+['script.js','work/workroom.js','site-footer.css','site-footer.js','_includes/site-contact.html','_includes/site-footer.html','_maintenance/sync-site-chrome.py']
 report['release_blobs']={n:digest(ROOT/n) for n in changed};(OUT/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
