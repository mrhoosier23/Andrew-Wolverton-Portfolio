from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
import subprocess, json

ROOT='http://127.0.0.1:4173/'
OUT=Path('_qa/checkpoint3')
OUT.mkdir(parents=True, exist_ok=True)
results=[]

def passed(name,detail=''):
    results.append({'check':name,'status':'pass','detail':detail})

def contains(path,*items):
    text=Path(path).read_text()
    for item in items:
        assert item in text, f'{path} missing {item}'
    passed('static:'+path,str(len(items)))

contains('index.html','I can take your<br/>vision and fantasies<br/>and make them a reality.','I design and build clearer websites','I edit campaign videos and social content','Check out my photo album.','assets/andrew-home-wave-transparent.png')
contains('mobile.html','I can take your<br>vision and fantasies<br>and make them<br>a reality.','assets/andrew-home-wave-transparent.png','assets/andrew-avatar-performance.webp','index.html?full=1#homeAboutTitle')
contains('work/media/index.html','You bring me the songs, references, choreography, and moments you want to hit.','Audio services &amp; pricing')
contains('work/workroom.js','I redesigned Porch Stomp','I edited campaign videos','assets/andrew-ai-idea.webp')
contains('site-footer.css','#ded6d4','clip-path:inset(0 2.3% round 11%)')
contains('services.html','$500–$5,500+')

with Image.open('assets/andrew-home-wave-transparent.png') as im:
    rgba=im.convert('RGBA')
    lo,hi=rgba.getchannel('A').getextrema()
    assert lo==0 and hi>0, f'wave transparency missing: {(lo,hi)} mode={im.mode}'
    passed('transparent-wave',f'{im.size} source={im.mode}, rendered alpha {lo}-{hi}')
for asset in ['assets/andrew-ai-idea.webp','assets/andrew-avatar-performance.webp','assets/andrew-performance-harp.webp','assets/andrew-performance-singing.webp']:
    with Image.open(asset) as im:
        im.verify()
    passed('asset:'+asset)

doon={'assets/andrew-doon.webp':'3f32b01c0ec2e46290ac6cba7aa06abdd81d1dc2','assets/Andrew-doon.PNG':'421defed0be3f7fb4b97520e2b22a4123e233446'}
for path,sha in doon.items():
    actual=subprocess.check_output(['git','hash-object',path],text=True).strip()
    assert actual==sha, f'{path} changed: {actual}'
    passed('unchanged:'+path,actual)

def overflow(page,label):
    m=page.evaluate('()=>({w:innerWidth,sw:document.documentElement.scrollWidth})')
    assert m['sw']<=m['w']+2,f'{label} overflow {m}'
    passed(label+':overflow',str(m))

def loaded(loc):
    assert loc.count()>0
    el=loc.first
    el.scroll_into_view_if_needed()
    el.evaluate("(i)=>{i.loading='eager'}")
    assert el.evaluate("(i)=>i.decode().then(()=>i.naturalWidth>0).catch(()=>i.complete&&i.naturalWidth>0)")

with sync_playwright() as p:
    for engine_name,engine in [('chromium',p.chromium),('webkit',p.webkit)]:
        browser=engine.launch()
        for mode,vp in [('desktop',{'width':1440,'height':900}),('mobile',{'width':390,'height':844})]:
            context=browser.new_context(viewport=vp)
            page=context.new_page()
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            if mode=='desktop':
                page.goto(ROOT+'index.html?full=1',wait_until='networkidle')
                loaded(page.locator('#heroGreeterImage'))
                assert page.locator('#homeAboutTitle').count()==1
                if engine_name=='chromium':
                    page.screenshot(path=str(OUT/'homepage-desktop.png'),full_page=True)
                    if page.locator('.aw-avatar-matte').count():
                        card=page.locator('.aw-avatar-matte').first
                        card.scroll_into_view_if_needed()
                        assert card.locator('img').evaluate("(i)=>getComputedStyle(i).clipPath!='none'")
                        card.screenshot(path=str(OUT/'homepage-workflow-card.png'))
            else:
                page.goto(ROOT+'mobile.html?preview=1',wait_until='networkidle')
                loaded(page.locator('.mobile-hero-greeter-avatar img'))
                assert '#homeAboutTitle' in page.locator('a.about-link').get_attribute('href')
                tiles=page.locator('.service-tile')
                assert tiles.count()==6
                tiles.first.scroll_into_view_if_needed()
                assert tiles.first.is_visible() and 'Websites' in tiles.first.inner_text()
                avatar=page.locator('.music-card>.music-card-avatar')
                loaded(avatar)
                assert avatar.get_attribute('src').endswith('andrew-avatar-performance.webp')
                assert page.locator('.music-card>video').count()==0
                assert avatar.evaluate("(i)=>getComputedStyle(i).clipPath!='none'")
                assert page.locator('.music-card').evaluate('(e)=>getComputedStyle(e).backgroundColor') in ('rgb(222, 214, 212)','rgba(222, 214, 212, 1)')
                if engine_name=='chromium':
                    page.locator('.choice-section').screenshot(path=str(OUT/'mobile-services.png'))
                    page.screenshot(path=str(OUT/'homepage-mobile.png'),full_page=True)
                    avatar.scroll_into_view_if_needed(); page.wait_for_timeout(200)
                    page.locator('.music-card').screenshot(path=str(OUT/'mobile-music-card.png'))
            overflow(page,f'{engine_name}-{mode}-home')
            assert not errors,errors

            page.goto(ROOT+'projects.html',wait_until='networkidle')
            page.locator('[data-work-preview="workflows"]').click()
            page.wait_for_timeout(200)
            proj=page.locator('#projectionImage')
            loaded(proj)
            assert proj.get_attribute('src').endswith('andrew-ai-idea.webp')
            wrap=proj.locator('..')
            assert 'is-avatar-preview' in (wrap.get_attribute('class') or '')
            assert wrap.evaluate('(e)=>getComputedStyle(e).backgroundColor') in ('rgb(222, 214, 212)','rgba(222, 214, 212, 1)')
            assert proj.evaluate("(i)=>getComputedStyle(i).clipPath!='none'")
            overflow(page,f'{engine_name}-{mode}-projects')
            if engine_name=='chromium' and mode=='desktop':
                page.locator('.projection').screenshot(path=str(OUT/'projects-workflow-preview.png'))

            page.goto(ROOT+'work/workflows/',wait_until='networkidle')
            overflow(page,f'{engine_name}-{mode}-workflows')

            page.goto(ROOT+'work/media/#audio',wait_until='networkidle')
            for tab in ('video','live','audio'):
                b=page.locator(f'[data-media-channel="{tab}"]')
                b.click(); page.wait_for_timeout(100)
                assert b.get_attribute('aria-selected')=='true'
                assert not page.locator(f'[data-media-panel="{tab}"]').is_hidden()
            overflow(page,f'{engine_name}-{mode}-media')

            page.goto(ROOT+'projects/rooftop-ramblers.html',wait_until='networkidle')
            loaded(page.locator('img[src*="andrew-performance-singing"]'))
            loaded(page.locator('img[src*="andrew-performance-harp"]'))
            overflow(page,f'{engine_name}-{mode}-rooftop')
            if engine_name=='chromium' and mode=='desktop':
                page.screenshot(path=str(OUT/'rooftop-avatars.png'),full_page=True)

            page.goto(ROOT+'services.html',wait_until='networkidle')
            assert '$500–$5,500+' in page.locator('body').inner_text()
            assert page.locator('#serviceWeb').count()==1 and page.locator('#serviceAudio').count()==1
            overflow(page,f'{engine_name}-{mode}-services')

            for rel,needle in [('work/websites/','Website services & pricing'),('work/campaigns-content/','Social content services & pricing'),('work/nonprofits-programs/','Custom project services & pricing'),('projects/porch-stomp.html','Website services & pricing'),('projects/discovery-sound-garden.html','Custom project services & pricing'),('projects/yolele-ingredients.html','Website services & pricing'),('projects/edit-suite.html','Audio & video services & pricing')]:
                page.goto(ROOT+rel,wait_until='domcontentloaded')
                assert needle.lower() in page.locator('body').inner_text().lower(),f'{rel} missing CTA'
                overflow(page,f'{engine_name}-{mode}-{rel}')
            context.close()
        browser.close()

report={'checkpoint':3,'status':'complete','branch':'copy-clarity-20260916','tested_head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'engines':['chromium','webkit'],'viewports':{'mobile':'390x844','desktop':'1440x900'},'checks':results,'andrew_doon_unchanged':doon,'screenshots':[x.name for x in OUT.glob('*.png')]}
(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
Path('_maintenance/checkpoint3-complete.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':'complete','checks':len(results),'screenshots':report['screenshots']},indent=2))
