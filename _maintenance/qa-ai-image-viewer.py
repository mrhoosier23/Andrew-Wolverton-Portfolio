import asyncio, functools, http.server, threading
from playwright.async_api import async_playwright

server=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(http.server.SimpleHTTPRequestHandler,directory='.'))
threading.Thread(target=server.serve_forever,daemon=True).start()

async def main():
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(headless=True)
        page=await browser.new_page(viewport={'width':390,'height':844})
        await page.goto('http://127.0.0.1:8766/ai-schools.html',wait_until='domcontentloaded')
        await page.wait_for_timeout(600)
        headshot=page.locator('#aboutAndrew figure img').first
        await headshot.scroll_into_view_if_needed()
        assert await headshot.evaluate('i=>i.complete && i.naturalWidth>0')
        assert 'Headshot%20Option%202.jpg' in (await headshot.get_attribute('src')).replace(' ','%20')
        zoomables=page.locator('.ai-zoomable-image')
        assert await zoomables.count() >= 3
        first=zoomables.first
        await first.scroll_into_view_if_needed()
        await first.click()
        dialog=page.locator('.ai-image-lightbox')
        assert await dialog.evaluate('d=>d.open')
        src=await dialog.locator('[data-image-expanded]').get_attribute('src')
        assert src and '05-before-after' in src
        await dialog.locator('[data-image-zoom-in]').click()
        assert (await dialog.locator('[data-image-zoom-reset]').inner_text()) == '150%'
        await dialog.locator('[data-image-close]').click()
        assert not await dialog.evaluate('d=>d.open')
        assert await page.locator('.ai-image-zoom-hint').count() >= 3
        await browser.close()

asyncio.run(main())
server.shutdown()
