/* Rendered regression review. NODE_PATH points to the available Playwright runtime. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const url=process.env.MUSIC_LAB_URL||'http://127.0.0.1:8767/music-lab/';
const out=process.env.MUSIC_LAB_QA||path.resolve(__dirname,'../../.qa-session-room');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'});
 const errors=[],rows=[];
 try {
  for(const width of [320,375,390,430,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<700,isMobile:width<700});
   const page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   await page.locator('.room-scene img').evaluate(img=>img.decode());
   assert.equal(await page.locator('.activity-card').count(),3);
   assert.match(await page.title(),/Session Room/);
   const room=await page.locator('.room-scene img').evaluate(img=>({src:img.currentSrc,loaded:img.naturalWidth>0}));
   assert(room.loaded);assert(room.src.includes(width<=700?'mobile':'desktop'));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Room overflow at '+width);
   if([320,390,1440].includes(width))await page.screenshot({path:path.join(out,`room-${width}.png`),fullPage:true});
   for(const activity of ['piano','beats','lick']){
    await page.locator(`[data-activity="${activity}"]`).click();
    await page.locator('#tutorialSkip').click();
    await page.locator('#workspace').waitFor({state:'visible'});
    await page.locator('.instrument').evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),activity+' overflow at '+width);
    if(activity!=='beats'){
     assert.equal(await page.locator('.piano-key').count(),13);
     assert.equal(await page.locator('.piano-key.home-anchor').count(),2);
     await page.keyboard.press('f');await page.keyboard.press('j');
     await page.locator('#volume').fill('0.8');await page.locator('#volume').dispatchEvent('input');
     await page.locator('#musicVolume').fill('0.1');await page.locator('#musicVolume').dispatchEvent('input');
     assert.equal(await page.locator('#volume').inputValue(),'0.8');
    }else{
     await page.locator('#preset').click();
     await page.locator('#record').click();
     await page.locator('[data-drum="Clap"]').first().click();
     assert.equal(await page.locator('#record').getAttribute('aria-pressed'),'true');
     await page.locator('#record').click();
     assert.equal(await page.locator('#record').getAttribute('aria-pressed'),'false');
     await page.locator('#stepEditor summary').click();
     await page.locator('#stepGrid button').nth(1).click();
     await page.locator('#stepEditor summary').click();
    }
    if([320,390,1440].includes(width))await page.screenshot({path:path.join(out,`${activity}-${width}.png`),fullPage:true});
    await page.locator('#stop').click();await page.locator('#back').click();
    assert(await page.locator('#chooser').isVisible());
   }
   await page.goto(new URL('full-studio.html',url).href);await page.locator('.controller').waitFor();
   if(await page.locator('#enableStudioSound').isVisible()){
    await page.locator('#enableStudioSound').click();
    await page.locator('#studioSoundGate').waitFor({state:'hidden'});
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Full studio overflow at '+width);
   if([390,1440].includes(width))await page.screenshot({path:path.join(out,`full-${width}.png`),fullPage:true});
   rows.push({width,roomImage:room.src.split('/').pop(),activities:3,overflow:false});
   await context.close();
  }
  const landscape=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
  await landscape.goto(url);
  assert(await landscape.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Landscape room overflow');
  await landscape.locator('[data-activity="piano"]').click();await landscape.locator('#tutorialSkip').click();
  assert(await landscape.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Landscape piano overflow');
  await landscape.close();
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(url);await page.locator('[data-activity="lick"]').click();await page.locator('#tutorialSkip').click();
  assert.equal(await page.locator('.instrument').evaluate(el=>getComputedStyle(el).animationName),'none');
  assert(await page.locator('body').evaluate(el=>el.classList.contains('reduced')));
  assert.deepEqual(errors,[]);console.log(JSON.stringify({rows,errors,reducedMotion:true},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
