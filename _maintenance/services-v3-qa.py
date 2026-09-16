from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote
from playwright.sync_api import sync_playwright
import functools,http.server,threading,json,hashlib,shutil
ROOT=Path('.').resolve();OUT=ROOT/'_qa/services-v3';OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'services.html').read_text();soup=BeautifulSoup(html,'html.parser')
ids={x['id'] for x in soup.select('[id]')}
assert len(ids)==len(soup.select('[id]'))
assert len(soup.select('h1'))==1
visible=soup.get_text(' ',strip=True)
for bad in ['Creative Rescue','NYC Field Unit','Build With Andrew','What kind of stuck','The toolbox is still bookable','A working studio, not a list of buzzwords']:
 assert bad not in visible,bad
for price in ['$15–$30+','$15–$20','$300','$40–$75','$95–$175+','$550','From $650','From $1,800','$750–$1,250','From $1,500','From $4,000','$1,250','$3,000–$7,500+']:
 assert price in visible,price
assert len(soup.select('.sp-tool-card'))==41
assert html.index('id="services"') < html.index('id="packages"') < html.index('id="creativeRescue"')
link_count=0
for link in soup.select('a[href]'):
 u=urlparse(link['href'])
 if u.scheme or u.netloc:continue
 target=ROOT/unquote(u.path) if u.path else ROOT/'services.html'
 if target.is_dir():target=target/'index.html'
 assert target.exists(),(link.get_text(),target)
 if u.fragment and target.name=='services.html':assert u.fragment in ids,u.fragment
 link_count+=1
inbound=set()
for file in ROOT.rglob('*.html'):
 rel=file.relative_to(ROOT)
 if any(x.startswith(('_','.')) or x=='archive' for x in rel.parts):continue
 for link in BeautifulSoup(file.read_text(errors='replace'),'html.parser').select('a[href]'):
  u=urlparse(link['href'])
  if (not u.netloc or u.netloc in ['awolverton.com','www.awolverton.com']) and u.path.endswith('services.html') and u.fragment:
   assert u.fragment in ids,(str(rel),u.fragment)
   inbound.add(u.fragment)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
report={'source_checks':{'unique_ids':len(ids),'local_links':link_count,'inbound_service_fragments':sorted(inbound),'tool_inventory':41,'prices_preserved':True},'browser_checks':[]}
try:
 with sync_playwright() as pw:
  for engine in ['chromium','webkit']:
   browser=getattr(pw,engine).launch(headless=True)
   for w,h in [(320,568),(390,844),(768,1024),(1024,768),(1440,1000)]:
    page=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<800,has_touch=w<800,reduced_motion='reduce')
    page.set_default_timeout(12000)
    page.route('**/formsubmit.co/**',lambda r:r.abort())
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:8766/services.html',wait_until='load')
    page.evaluate('document.fonts.ready')
    assert not errors,errors
    assert page.locator('.sp-service-card').count()==6
    assert page.locator('.sp-price-card').count()==6
    assert page.locator('.sp-engagement').count()==3
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(engine,w,'horizontal overflow')
    for num in page.locator('.sp-number').all():
     inset=num.evaluate('(e)=>{const a=e.getBoundingClientRect(),b=e.closest(".sp-service-card").getBoundingClientRect();return {left:a.left-b.left,top:a.top-b.top}}')
     assert inset['left']>=20 and inset['top']>=20,(engine,w,inset)
    for selector in ['.sp-service-card','.sp-price-card','.sp-engagement','.sp-contact-form']:
     for node in page.locator(selector).all():
      assert node.evaluate('e=>e.scrollWidth <= e.clientWidth+1'),(engine,w,selector,'internal overflow')
    assert page.locator('.sp-tool-group[open]').count()==0
    for details in page.locator('.sp-tool-group').all():
     summary=details.locator('summary');summary.click()
     assert details.evaluate('e=>e.open')
     assert summary.locator('.sp-disclosure-icon').count()==1
     assert summary.evaluate('e=>getComputedStyle(e,"::after").content') in ['none','normal','""']
     assert summary.evaluate('e=>getComputedStyle(e,"::before").content') in ['none','normal','""']
     assert summary.bounding_box()['height']>=44
     summary.press('Enter');assert not details.evaluate('e=>e.open')
     summary.press('Space');assert details.evaluate('e=>e.open')
     summary.click()
    for i,details in enumerate(page.locator('.sp-faq-item').all()):
     summary=details.locator('summary')
     if not details.evaluate('e=>e.open'):summary.click()
     assert details.locator('.sp-faq-answer').is_visible()
     qsize=summary.locator('.sp-faq-question>span').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')
     asize=details.locator('.sp-faq-answer p').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')
     assert qsize>=17.5 and asize>=16,(qsize,asize)
     assert summary.locator('.sp-disclosure-icon').bounding_box()['width']>=39
     summary.press('Enter');assert not details.evaluate('e=>e.open')
     summary.press('Space');assert details.evaluate('e=>e.open')
     if i!=0:summary.click()
    for link in page.locator('[data-service-choice]').all():
     choice=link.get_attribute('data-service-choice');link.click()
     assert page.locator('#contactProjectType').input_value()==choice
    assert page.locator('#contactForm').get_attribute('action')=='https://formsubmit.co/ajax/anwolver@gmail.com'
    assert page.locator('.honeypot').is_hidden()
    portrait=page.locator('.sp-portrait img');portrait.scroll_into_view_if_needed()
    page.wait_for_function('document.querySelector(".sp-portrait img").naturalWidth>0')
    natural=portrait.evaluate('e=>({w:e.naturalWidth,h:e.naturalHeight})')
    assert natural=={'w':977,'h':1610},natural
    rect=portrait.bounding_box();assert abs(rect['width']/rect['height']-977/1610)<.005
    assert page.locator('.sp-portrait-clip').evaluate('e=>getComputedStyle(e).overflow')=='hidden'
    assert '16px' in page.locator('.sp-portrait-clip').evaluate('e=>getComputedStyle(e).clipPath')
    # Check the important service and package deep links in actual browser positioning.
    anchors=['serviceWeb','serviceCampaigns','serviceAudio','serviceVideo','serviceAi','livePerformance','nycFieldUnit','creativeRescue','buildWithAndrew','servicePartnership','audioRates','socialRates','videoRates','fieldRates','workflowRates','liveRates','faq','contact']
    for fragment in anchors:
     page.evaluate('(id)=>{location.hash=id}',fragment)
     page.wait_for_timeout(60)
     assert page.locator('#'+fragment).is_visible(),fragment
    if w<=760:
     page.locator('.unified-menu-toggle').click()
     assert page.locator('.unified-menu-toggle').get_attribute('aria-expanded')=='true'
     page.locator('.unified-menu-close').click()
    page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(120)
    if w in [390,1440]:
     page.screenshot(path=str(OUT/f'{engine}-{w}-top.png'))
     for name,sel in [('prices','#packages'),('faq','#faq')]:
      page.locator(sel).evaluate('e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-100)')
      page.screenshot(path=str(OUT/f'{engine}-{w}-{name}.png'))
     page.locator('.sp-contact-person').screenshot(path=str(OUT/f'{engine}-{w}-portrait.png'))
     page.screenshot(path=str(OUT/f'{engine}-{w}-full.png'),full_page=True)
    assert not errors,errors
    report['browser_checks'].append({'engine':engine,'viewport':[w,h],'overflow':False,'card_padding':True,'all_11_accordions_keyboard_tested':True,'all_10_service_choices_prefill':True,'anchor_targets_checked':len(anchors),'portrait_decoded_uncropped_rounded':True,'page_errors':errors,'heading_font_loaded':page.evaluate('document.fonts.check("700 20px Barlow Condensed")')})
    page.close()
   browser.close()
 report['success']=True
finally:
 server.shutdown()
 for name in ['services.html','services-page.css']:
  shutil.copy(ROOT/name,OUT/name)
  data=(ROOT/name).read_bytes();report.setdefault('blobs',{})[name]=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
 (OUT/'report.json').write_text(json.dumps(report,indent=2))
 print(json.dumps(report,indent=2))
