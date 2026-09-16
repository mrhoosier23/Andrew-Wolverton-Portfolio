from pathlib import Path
import hashlib, re
ROOT = Path('.')
EXPECTED = {
 'ai-schools-page.js': '2b77c180910355ca77c80c54b1e9970b2fc3c32d',
 'ai-schools.css': '3b1b2661c3f6e89ee95936451c0a83f0cb87ba87',
 'ai-schools.html': '78a3877ccdea4ae06c6e6503a2c877540f24badb',
}
for name, expected in EXPECTED.items():
 data = (ROOT/name).read_bytes()
 actual = hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
 if actual != expected:
  raise SystemExit(f'{name} changed since review: {actual}; stop rather than overwrite')
js = (ROOT/'ai-schools-page.js').read_text()
marker = '/* AI_SCHOOLS_IMAGE_VIEWER_20260915 */'
assert js.count(marker) == 1
core = js.split(marker)[0].rstrip()
assert core.endswith('})();')
js = core[:-5] + (ROOT/'_maintenance/ai-gallery-v2.js').read_text() + '\n})();\n'
needle = "    viewer.addEventListener('keydown', event => {"
assert js.count(needle) == 1
js = js.replace(needle, needle + '''
      if (event.key === 'Tab') {
        const controls = [...viewer.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter(node => node.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus({ preventScroll: true }); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus({ preventScroll: true }); }
        return;
      }
''')
css = (ROOT/'ai-schools.css').read_text()
marker = '/* AI Schools image viewer 20260915 */'
assert css.count(marker) == 1
css = css.split(marker)[0].rstrip() + '\n\n' + (ROOT/'_maintenance/ai-gallery-v2.css').read_text()
css += '\n@media(max-width:360px){.ai-gallery-tools{gap:6px}.ai-gallery-tools>div{flex-shrink:0}.ai-gallery-tools [data-image-zoom-reset]{min-width:54px;padding:8px}.ai-gallery-tools a{font-size:12px;padding:8px}.ai-image-zoom-hint{font-size:11px}}\n'
html = (ROOT/'ai-schools.html').read_text()
for name in ['ai-schools.css', 'ai-schools-page.js', 'portfolio-ui.css']:
 html, count = re.subn(re.escape(name)+r'\?v=[^"\s]+', name+'?v=20260916-gallery-v2', html)
 assert count == 1, (name, count)
assert html.count('assets/Headshot Option 2.jpg') == 2
assert 'assets/Andrew_Wolverton_Casual.JPG' not in html
for name, data in [('ai-schools-page.js',js),('ai-schools.css',css),('ai-schools.html',html)]:
 (ROOT/name).write_text(data)
print('Prepared three AI Schools files; existing page content and repaired portraits preserved.')
