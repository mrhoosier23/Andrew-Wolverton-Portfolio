from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright
from PIL import Image
import hashlib,json,subprocess,threading,traceback
ROOT=Path('.').resolve();OUT=ROOT/'_qa/services-v4';OUT.mkdir(parents=True,exist_ok=True)
soup=BeautifulSoup((ROOT/'services.html').read_text(),'html.parser')
original=BeautifulSoup(subprocess.check_output(['git','show','HEAD:services.html']).decode(),'html.parser')
ids=[n['id'] for n in soup.select('[id]')]
assert len(ids)==len(set(ids))
assert set(n['id'] for n in original.select('[id]'))<=set(ids)
assert soup.select_one('#contactForm')['action']==original.select_one('#contactForm')['action']
assert {n.get('name') for n in soup.select('#contactForm [name]')}=={n.get('name') for n in original.select('#contactForm [name]')}
assert len(soup.select('[data-tool]'))==41
assert not soup.select('.sp-jumpnav,.sp-card-type')
assert len(soup.select('#services .sp-visible-pricing'))==7
old_process=[n.get_text(' ',strip=True) for n in original.select('.process-roadmap li p')]
new_process=[n.get_text(' ',strip=True) for n in soup.select('.sp-step-copy p')]
assert len(old_process)==5 and old_process==new_process
for word in ['What kind of stuck','The toolbox is still bookable','Creative Rescue','NYC Field Unit','Build With Andrew']:
 assert word not in soup.get_text(' ',strip=True),word
links=[]
for a in soup.select('a[href]'):
 u=urlsplit(a['href'])
 if u.scheme or u.netloc: continue
 dest=ROOT/unquote(u.path) if u.path else ROOT/'services.html'
 if dest.is_dir():dest=dest/'index.html'
 assert dest.exists(),(a.get_text(),str(dest))
 if u.fragment and dest.name=='services.html':assert unquote(u.fragment) in ids,a['href']
 links.append(a['href'])
report={'status':'running','source_checks':{'visible_service_prices':7,'original_process_paragraphs_preserved':5,'tool_inventory':41,'local_links':len(links),'original_anchor_ids_preserved':True,'contact_fields_and_endpoint_preserved':True,'noninteractive_pills_removed':True},'browser_checks':[]}
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
try:
 with sync_playwright() as p:
  for engine in ['chromium','webkit']:
   browser=getattr(p,engine).launch()
   for w,h in [(320,568),(390,844),(768,1024),(844,390),(1440,1000)]:
    page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1,has_touch=w<1000,reduced_motion='reduce')
    page.set_default_timeout(15000)
    errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
    # Test external submissions without ever sending a message.
    submitted=[]
    def no_send(route):
     submitted.append(route.request.post_data or '')
     route.fulfill(status=200,content_type='application/json',body='{"success":"true"}',headers={'Access-Control-Allow-Origin':'*'})
    page.route('https://formsubmit.co/**',no_send)
    page.goto(base+'services.html',wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
    assert page.locator('#services .sp-visible-pricing').count()==7
    for c in page.locator('.sp-service-card').all():
     assert c.locator('.sp-visible-pricing').is_visible()
     assert c.evaluate('e=>parseFloat(getComputedStyle(e).paddingLeft)>=20 && parseFloat(getComputedStyle(e).paddingTop)>=20')
     assert c.locator('.sp-number').evaluate('e=>e.getBoundingClientRect().left-e.closest("article").getBoundingClientRect().left>=20')
     for price in c.locator('dd').all():
      assert price.evaluate('e=>{const a=e.closest("article").getBoundingClientRect(),r=e.getBoundingClientRect();return r.right<=a.right-12 && r.left>=a.left+12}')
    for text in page.locator('.sp-step-copy p').all():
     assert text.is_visible() and text.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)>=16 && e.scrollHeight<=e.clientHeight+1')
    for summary in page.locator('.sp-tool-group>summary,.sp-faq-item>summary').all():
     assert summary.locator('.sp-disclosure-icon').count()==1
     assert summary.locator('.sp-disclosure-icon').evaluate('e=>e.getBoundingClientRect().width>=40 && e.getBoundingClientRect().height>=40')
     assert summary.evaluate('e=>["::before","::after"].every(p=>["none","normal","\"\""].includes(getComputedStyle(e,p).content))')
    for detail in page.locator('.sp-tool-group').all():
     summary=detail.locator('summary');summary.evaluate('e=>e.scrollIntoView({block:"center"})');summary.click()
     assert detail.evaluate('e=>e.open') and detail.locator('.sp-tool-content').is_visible()
     summary.click();assert not detail.evaluate('e=>e.open')
    for detail in page.locator('.sp-faq-item').all():
     summary=detail.locator('summary');summary.evaluate('e=>e.scrollIntoView({block:"center"})')
     if not detail.evaluate('e=>e.open'):summary.click()
     assert detail.locator('.sp-faq-answer p').is_visible()
     assert detail.locator('.sp-faq-answer p').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)>=17')
     assert detail.locator('.sp-faq-question>span').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)>=20')
     summary.click();assert not detail.evaluate('e=>e.open')
    first=page.locator('.sp-faq-item').first
    first.locator('summary').focus();page.keyboard.press('Space');assert first.evaluate('e=>e.open')
    choices=page.locator('[data-service-choice]')
    for a in choices.all():
     expected=a.get_attribute('data-service-choice');a.evaluate('e=>e.scrollIntoView({block:"center"})');a.click()
     assert page.locator('#contactProjectType').input_value()==expected
    portrait=page.locator('.sp-portrait img');portrait.scroll_into_view_if_needed();portrait.evaluate('e=>e.decode()')
    assert portrait.evaluate('e=>e.naturalWidth===977 && e.naturalHeight===1610 && getComputedStyle(e).objectFit==="contain"')
    assert portrait.evaluate('e=>parseFloat(getComputedStyle(e).borderTopLeftRadius)>=16')
    assert page.locator('.sp-portrait-clip').evaluate('e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.overflow==="hidden" && s.clipPath!=="none" && r.height>100}')
    assert page.locator('.honeypot').evaluate('e=>e.getBoundingClientRect().right<0 && getComputedStyle(e).opacity==="0" && getComputedStyle(e).pointerEvents==="none" && e.tabIndex===-1')
    page.locator('input[name=name]').fill('Interface validation, not sent')
    page.locator('input[name=email]').fill('test@example.invalid')
    page.locator('textarea[name=message]').fill('Intercepted UI test only. No email sent.')
    page.locator('#contactForm button[type=submit]').click()
    page.wait_for_function('document.querySelector("#contactFormNote").classList.contains("is-success")')
    assert len(submitted)==1
    page.evaluate('''()=>{const n=document.querySelector('#contactFormNote');n.classList.remove('is-success');n.textContent='Your inquiry goes directly to Andrew.';document.querySelectorAll('.sp-faq-item').forEach((d,i)=>d.open=i===0);window.scrollTo(0,0)}''')
    assert not errors,errors
    bounds=page.evaluate('''()=>Object.fromEntries(['services','packages','process','toolkit','faq','contact'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return[id,{top:r.top+scrollY,bottom:r.bottom+scrollY}]}))''')
    full=OUT/f'{engine}-{w}-full.png';page.screenshot(path=str(full),full_page=True)
    # Crop the full-page capture, rather than covering a section with the sticky header.
    with Image.open(full) as image:
     for ident,r in bounds.items():image.crop((0,max(0,int(r['top'])),w,min(image.height,int(r['bottom'])+1))).save(OUT/f'{engine}-{w}-{ident}.png')
    page.locator('.sp-tool-group summary').first.evaluate('e=>e.scrollIntoView({block:"center"})')
    page.locator('.sp-tool-group summary').first.click()
    page.screenshot(path=str(OUT/f'{engine}-{w}-tools-open.png'),full_page=True)
    # The portrait fallback must also load; no new image or cropped source is used.
    if w==390:
     page.route('**/assets/andrew-doon.webp',lambda r:r.abort())
     page.reload(wait_until='networkidle');portrait=page.locator('.sp-portrait img');portrait.scroll_into_view_if_needed()
     page.wait_for_function('document.querySelector(".sp-portrait img").naturalWidth>0')
     assert 'Andrew-doon.PNG' in portrait.get_attribute('src')
    report['browser_checks'].append({'engine':engine,'width':w,'height':h,'passed':True,'service_prefill_buttons':choices.count(),'visible_prices':7,'process_steps_readable':5,'tools_and_faqs':'click and keyboard checks passed','portrait':'decoded and clipped','contact_submission':'intercepted locally; no email sent'})
    page.close()
   browser.close()
 report['status']='passed'
except Exception as e:
 report['status']='failed';report['error']=repr(e);report['traceback']=traceback.format_exc();raise
finally:
 server.shutdown()
 for f in ['services.html','services-page.css']:(OUT/f).write_bytes((ROOT/f).read_bytes())
 report['blobs']={f:hashlib.sha1(b'blob '+str(len((ROOT/f).read_bytes())).encode()+b'\0'+(ROOT/f).read_bytes()).hexdigest() for f in ['services.html','services-page.css']}
 (OUT/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2),flush=True)
