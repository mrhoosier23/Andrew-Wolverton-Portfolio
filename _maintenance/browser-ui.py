"""Browser regression checks on the isolated review branch; no production writes."""
import asyncio,json,sys,threading,http.server,functools,subprocess
from pathlib import Path
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
ROOT=Path.cwd();OUT=ROOT/'_qa/reports';OUT.mkdir(parents=True,exist_ok=True);HOST='http://127.0.0.1:8765'
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8765),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
pages=[p for p in subprocess.check_output(['git','ls-files','*.html']).decode().splitlines() if not p.startswith('archive/')]
results={'pages':[],'anchors':[],'routes':[],'audio':[],'failures':[],'external_embed_requests':[]}
def check(ok,message):
 if not ok:results['failures'].append(message)
async def visit(page,path,delay=350):
 await page.goto(HOST+'/'+path,wait_until='domcontentloaded');await page.wait_for_timeout(delay)
async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(headless=True)
  for width in [1440,390,320]:
   context=await browser.new_context(viewport={'width':width,'height':1000 if width==1440 else 844},reduced_motion='reduce')
   context.on('request',lambda req:results['external_embed_requests'].append(req.url) if 'instagram.com/reel/' in req.url and '/embed' in req.url else None)
   page=await context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   for rel in pages:
    errors.clear()
    try:
     await visit(page,rel)
     info=await page.evaluate('''() => ({path:location.pathname+location.search+location.hash,overflow:document.documentElement.scrollWidth-innerWidth,favicon:document.querySelector('link[rel="icon"]')?.getAttribute('href'),h1:[...document.querySelectorAll('h1')].map(e=>({text:e.textContent,tracking:getComputedStyle(e).letterSpacing,size:getComputedStyle(e).fontSize})),ctas:[...document.querySelectorAll('.projection-copy>a,.cta-compact,.wire-player>a')].map(e=>({text:e.textContent.trim(),decoration:getComputedStyle(e).textDecorationLine,border:getComputedStyle(e).borderTopWidth,height:e.getBoundingClientRect().height})),anchorLinks:[...document.querySelectorAll('a[href]')].filter(a=>a.hash&&a.origin===location.origin).map(a=>({label:a.textContent.trim(),href:a.getAttribute('href'),url:a.pathname+a.search+a.hash}))})''')
     info.update(page=rel,width=width,errors=list(errors));results['pages'].append(info)
     check(info['overflow']<=1,f'{width}px {rel}: overflow {info["overflow"]}');check(bool(info['favicon']),rel+': missing favicon');check(not errors,f'{width}px {rel}: {errors}')
     if rel=='work/websites/index.html':
      for img in await page.locator('.website-project-shot img').all():await img.scroll_into_view_if_needed();await page.wait_for_timeout(220)
      images=await page.locator('.website-project-shot img').evaluate_all('es=>es.map(i=>({loaded:i.complete&&i.naturalWidth>0,fit:getComputedStyle(i).objectFit}))')
      check(len(images)==3 and all(x['loaded'] and x['fit']=='contain' for x in images),'All three website previews must load without cropping')
     if rel=='work/campaigns-content/index.html':
      embeds=await page.locator('.social-post-embed iframe').evaluate_all('es=>es.map(e=>({hidden:e.hidden,height:e.getBoundingClientRect().height,loading:e.loading}))')
      check(len(embeds)==3 and all(not x['hidden'] and x['height']>0 and x['loading']=='eager' for x in embeds),'Three Instagram embeds must be visible and eager')
      check(await page.locator('#loadSocial,[data-social]').count()==0,'Instagram load/hide controls must be absent')
     if rel in ('projects.html','work/websites/index.html','work/campaigns-content/index.html','work/media/index.html'):
      await page.evaluate('window.scrollTo(0,0)');await page.wait_for_timeout(100)
      await page.screenshot(path=str(OUT/(rel.replace('/','-')+f'-{width}.png')),full_page=rel=='work/websites/index.html')
    except Exception as e:check(False,f'{width}px {rel}: {e}')
   for path,ident,text in [('services.html#serviceAudio','serviceAudio','Audio editing & dance mixes'),('services.html#serviceVideo','serviceVideo','Video editing & social content'),('services.html#nycFieldUnit','nycFieldUnit','NYC Field Unit'),('services.html#serviceCampaigns','serviceCampaigns','Content-only production'),('index.html#about','about','Useful when the work crosses boundaries.'),('index.html#contact','contact','Tell me what is not working.')]:
    try:
     await visit(page,path,2900)
     info=await page.locator('[id="'+ident+'"]').evaluate('e=>({text:e.textContent,top:e.getBoundingClientRect().top})')
     check(text in info['text'],path+': incorrect content');check(-1<=info['top']<500,f'{width}px {path}: target not visible {info["top"]}')
     results['anchors'].append({'width':width,'url':path,'expected':text,'top':info['top'],'correct':text in info['text']})
     if ident=='serviceAudio':await page.screenshot(path=str(OUT/f'audio-service-{width}.png'))
    except Exception as e:check(False,f'{width}px {path}: {e}')
   for tab in ['audio','video','live']:
    await visit(page,'work/media/#'+tab)
    check(await page.locator('#panel-'+tab).is_visible(),'Media route #'+tab)
    check(await page.locator('[data-media-channel="'+tab+'"]').get_attribute('aria-selected')=='true','Media selection #'+tab)
   routes={'projects.html?project=porch-stomp#projects':'/projects/porch-stomp.html','projects.html?project=dsg#dsgDeepDive':'/projects/discovery-sound-garden.html','projects.html?project=yolele#projects':'/projects/yolele-ingredients.html','projects.html#dsgDeepDive':'/projects/discovery-sound-garden.html','projects.html#projects':'/projects.html','projects.html#ai':'/work/workflows/','projects.html?media=video#media':'/work/media/#video','projects.html?media=performance#media':'/work/media/#live','projects.html?focus=live':'/work/media/#live','projects.html#socialProjects':'/work/campaigns-content/'}
   for old,new in routes.items():
    try:
     await visit(page,old,550);u=urlsplit(page.url);final=u.path+('#'+u.fragment if u.fragment else '')
     check(final==new,f'Legacy {old}: {final} instead of {new}');results['routes'].append({'width':width,'from':old,'to':final,'correct':final==new})
    except Exception as e:check(False,str(e))
   if width==390:
    try:
     await visit(page,'mobile.html');await page.locator('.music-player-shortcut').click(timeout=5000)
     check(await page.locator('#musicPlayer').get_attribute('aria-hidden')=='false','Mobile music shortcut must open player')
    except Exception as e:check(False,'Mobile music shortcut: '+str(e))
   await context.close()
  context=await browser.new_context();page=await context.new_page();await visit(page,'work/media/#audio')
  check(await page.locator('[data-library-track]').count()==10,'Audio playlist must retain ten recordings')
  for slug in ['the-throwback-jump-off','the-function','global-motion','run-the-floor','pop-off-precision','old-school-groove-line']:
   try:
    await page.evaluate('document.querySelectorAll("#audioLibraryTracks details").forEach(e=>e.open=true)')
    await page.locator('[data-library-track="'+slug+'"]').click();await page.locator('#audioLibraryToggle').click();await page.wait_for_timeout(450)
    state=await page.locator('#audioLibraryPlayer').evaluate('e=>({src:e.currentSrc,duration:e.duration,time:e.currentTime,paused:e.paused,error:e.error?.code})')
    check(not state['paused'] and state['time']>0 and not state.get('error'),'Audio playback: '+slug);results['audio'].append({'id':slug,**state});await page.locator('#audioLibraryToggle').click()
   except Exception as e:check(False,'Audio '+slug+': '+str(e))
  await page.locator('#audioLibraryNext').click();check(await page.locator('#audioLibraryTitle').inner_text()=='Full Dance Mix','Next transport')
  await page.locator('#audioLibraryPrevious').click();check(await page.locator('#audioLibraryTitle').inner_text()=='Old-School Groove Line','Previous transport')
  await browser.close()
 results['external_embed_requests']=sorted(set(results['external_embed_requests']))
 (OUT/'browser-results.json').write_text(json.dumps(results,indent=2))
 print(json.dumps({'page_checks':len(results['pages']),'anchors':len(results['anchors']),'legacy_routes':len(results['routes']),'audio_played':len(results['audio']),'embed_requests':len(results['external_embed_requests']),'failures':results['failures']},indent=2));server.shutdown();sys.exit(bool(results['failures']))
asyncio.run(main())
