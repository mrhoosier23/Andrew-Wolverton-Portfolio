"""Exercise gallery navigation, image loading, zoom, focus and touch behavior."""
import functools, http.server, json, threading, os
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('_qa/ai-gallery-v2'); OUT.mkdir(parents=True, exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(Quiet,directory='.'))
threading.Thread(target=server.serve_forever,daemon=True).start()
results=[]
def loaded(page):
 page.wait_for_function('''() => { const i=document.querySelector('[data-image-expanded]'); return i && i.complete && i.naturalWidth>0; }''')
 page.wait_for_timeout(80)
def touch_swipe(page, direction='left', kind='normal'):
 # Native Chromium touch input; WebKit gets explicit pointer-event simulation.
 el=page.locator('.ai-image-lightbox-scroll'); box=el.bounding_box()
 x=box['x']+box['width']*.7; y=box['y']+box['height']*.45
 dx=(-1 if direction=='left' else 1)*100
 if kind=='vertical': dx=5
 dy=100 if kind=='vertical' else 3
 if page.context.browser.browser_type.name=='chromium' and kind=='normal':
  cdp=page.context.new_cdp_session(page)
  try:
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
   for step in range(1,7):
    cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*step/6,'y':y+dy*step/6}]})
    page.wait_for_timeout(20)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
  finally: cdp.detach()
 else:
  page.evaluate('''({x,y,dx,dy,kind})=>{const v=document.querySelector('.ai-image-lightbox-scroll');const fire=(t,a={})=>v.dispatchEvent(new PointerEvent(t,{bubbles:true,pointerId:1,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,...a}));fire('pointerdown');if(kind==='multi')fire('pointerdown',{pointerId:2,isPrimary:false});if(kind==='cancel')fire('pointercancel');fire('pointermove',{clientX:x+dx,clientY:y+dy});fire('pointerup',{clientX:x+dx,clientY:y+dy});}''',{'x':x,'y':y,'dx':dx,'dy':dy,'kind':kind})
 page.wait_for_timeout(120)
try:
 with sync_playwright() as pw:
  for engine in ['chromium','webkit']:
   browser=getattr(pw,engine).launch(headless=True)
   for width,height in [(390,844),(320,568),(844,390),(1440,900)]:
    ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=width<900,has_touch=width<900)
    page=ctx.new_page(); errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto('http://127.0.0.1:8766/ai-schools.html',wait_until='load')
    page.wait_for_function("document.querySelectorAll('.ai-zoomable-image').length === 3")
    page.locator('#aboutAndrew figure img').scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('#aboutAndrew figure img').complete && document.querySelector('#aboutAndrew figure img').naturalWidth>0")
    for selector,total in [('.artifact-stage img',4),('.lab-stage-visual img',6),('.hero-outcome img',5)]:
     source=page.locator(selector)
     source.click()
     dialog=page.locator('.ai-image-lightbox')
     assert dialog.evaluate('d=>d.open')
     for index in range(total):
      loaded(page)
      assert page.locator('[data-image-counter]').inner_text()==f'{index+1} of {total}'
      assert page.locator('[data-image-original]').evaluate('a=>a.href')==page.locator('[data-image-expanded]').evaluate('i=>i.src')
      assert page.locator('[data-image-title]').inner_text()
      assert page.locator('[data-image-caption]').inner_text()
      if selector=='.artifact-stage img': assert page.locator('[data-artifact-step]').inner_text()==f'{index+1} of 4'
      if selector=='.lab-stage-visual img': assert page.locator('[data-lab-count]').inner_text()==f'Step {index+1} of 6'
      for item in page.locator('.ai-gallery-toolbar button, .ai-gallery-toolbar a').all():
       r=item.bounding_box(); assert r and r['height']>=43.9 and r['x']>=-1 and r['x']+r['width']<=width+1 and r['y']>=-1 and r['y']+r['height']<height, (engine,width,r)
      assert page.locator('.ai-image-lightbox-scroll').bounding_box()['height']>=65
      if index<total-1: page.locator('[data-image-next]').click()
     assert page.locator('[data-image-next]').is_disabled()
     for index in range(total-1): page.locator('[data-image-prev]').click()
     assert page.locator('[data-image-prev]').is_disabled()
     for _ in range(4): page.locator('[data-image-zoom-in]').click()
     assert page.locator('[data-image-zoom-reset]').inner_text()=='300%'
     assert page.locator('[data-image-zoom-in]').is_disabled()
     page.locator('[data-image-next]').click(); loaded(page)
     assert page.locator('[data-image-zoom-reset]').inner_text()=='100%'
     assert page.locator('[data-image-counter]').inner_text()==f'2 of {total}'
     if width<900: page.locator('[data-image-close]').click()
     else: page.keyboard.press('Escape')
     assert not dialog.evaluate('d=>d.open')
     assert source.evaluate('i=>document.activeElement===i')
     source.press('Enter'); loaded(page)
     expected=0 if selector=='.hero-outcome img' else 1
     assert page.locator('[data-image-counter]').inner_text()==f'{expected+1} of {total}'
     page.locator('[data-image-close]').click()
    page.locator('[data-lab-next]').click();page.locator('[data-lab-next]').click()
    page.locator('.lab-stage-visual img').click();loaded(page)
    assert page.locator('[data-image-counter]').inner_text()=='4 of 6'
    page.locator('[data-image-close]').click()
    page.locator('.artifact-stage img').click();loaded(page)
    assert page.locator('[data-image-counter]').inner_text()=='2 of 4'
    if width<900:
     touch_swipe(page); assert page.locator('[data-image-counter]').inner_text()=='3 of 4'
     touch_swipe(page,'right'); assert page.locator('[data-image-counter]').inner_text()=='2 of 4'
     for kind in ['vertical','multi','cancel']:
      touch_swipe(page,kind=kind); assert page.locator('[data-image-counter]').inner_text()=='2 of 4'
     page.locator('[data-image-zoom-in]').click()
     touch_swipe(page); assert page.locator('[data-image-counter]').inner_text()=='2 of 4'
     page.locator('[data-image-zoom-reset]').click()
    else:
     page.keyboard.press('ArrowRight'); assert page.locator('[data-image-counter]').inner_text()=='3 of 4'
     page.keyboard.press('ArrowLeft'); assert page.locator('[data-image-counter]').inner_text()=='2 of 4'
    for _ in range(12):
     page.keyboard.press('Tab'); assert page.evaluate("document.querySelector('.ai-image-lightbox').contains(document.activeElement)")
    page.screenshot(path=str(OUT/f'{engine}-{width}-gallery.png'))
    page.locator('[data-image-close]').click()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
    page.locator('[data-quiz-question="0"] [data-answer="correct"]').click()
    assert page.locator('[data-quiz-next]').is_enabled()
    assert not errors, errors
    results.append({'engine':engine,'viewport':[width,height],'gallery_steps':15,'passed':True,'javascript_errors':errors})
    ctx.close()
   browser.close()
  (OUT/'results.json').write_text(json.dumps(results,indent=2))
  print(json.dumps(results,indent=2))
finally:
 server.shutdown()
