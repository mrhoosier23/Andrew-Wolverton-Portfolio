from pathlib import Path
from bs4 import BeautifulSoup
import re,json
ROOT=Path('.')
VERSION='20260916-sitewide-footer-v1'
PAGES=['index.html','mobile.html','services.html','projects.html','ai-schools.html','projects/discovery-sound-garden.html','projects/edit-suite.html','projects/porch-stomp.html','projects/rooftop-ramblers.html','projects/yolele-ingredients.html','work/campaigns-content/index.html','work/media/index.html','work/nonprofits-programs/index.html','work/websites/index.html','work/workflows/index.html']
contact_template=(ROOT/'_includes/site-contact.html').read_text().strip()
footer_template=(ROOT/'_includes/site-footer.html').read_text().strip()
report={'version':VERSION,'pages':[],'removed_github_links':0,'removed_school_menu_links':0}
for name in PAGES:
 p=ROOT/name;text=p.read_text()
 prefix='../'*len(Path(name).parent.parts) if str(Path(name).parent)!='.' else ''
 def remove_github(match):
  a=BeautifulSoup(match.group(0),'html.parser').a
  if a and re.search(r'^(?:https?:)?//(?:www\.)?github\.com/',a.get('href',''),re.I):
   report['removed_github_links']+=1;return ''
  return match.group(0)
 text=re.sub(r'<a\b[^>]*>.*?</a>',remove_github,text,flags=re.S|re.I)
 def clean_nav(match):
  def remove_school(a):
   if re.search(r'href=["\'][^"\']*ai-schools\.html(?:[?#][^"\']*)?["\']',a.group(0),re.I):
    report['removed_school_menu_links']+=1;return ''
   return a.group(0)
  return re.sub(r'<a\b[^>]*>.*?</a>',remove_school,match.group(0),flags=re.S|re.I)
 text=re.sub(r'<nav\b[^>]*>.*?</nav>',clean_nav,text,flags=re.S|re.I)
 # Player and tutorial footers are not site navigation.
 text=re.sub(r'<footer\b(?=[^>]*class=["\'][^"\']*(?:site-footer|workroom-footer|mobile-footer|timeback-footer))[^>]*>.*?</footer>','',text,flags=re.S|re.I)
 if name!='ai-schools.html':
  text,count=re.subn(r'<section\b(?=[^>]*\bid="contact")[^>]*>.*?</section>','',text,flags=re.S)
  assert count in (0,1),(name,count)
  contact=contact_template.replace('{{ROOT}}',prefix)
 else:contact=''
 if 'id="top"' not in text:text=text.replace('<body','<body id="top"',1)
 footer=footer_template.replace('{{ROOT}}',prefix).replace('{{CONTACT}}','#contact')
 if name=='ai-schools.html':text=text.replace('</body>',footer+'\n</body>',1)
 else:
  assert text.count('</main>')==1,name
  text=text.replace('</main>','</main>\n'+contact+'\n'+footer,1)
 if name=='mobile.html':text=re.sub(r'(<a\b[^>]*class="sticky-contact[^>]*href=")index\.html\?full=1#contact',r'\1#contact',text)
 text=re.sub(r'(<figure\b)([^>]*)(>\s*<img\b[^>]*src="[^"\']*andrew-ai-idea\.[^>]*>)',lambda m:m[1]+(' class="aw-avatar-matte"' if 'class=' not in m[2] else '')+m[2]+m[3],text)
 text=re.sub(r'((?:src=")[^"<>]*?)(script\.js)(?:\?[^"<>]*)?(\")',lambda m:m[1]+m[2]+'?v='+VERSION+m[3],text)
 text=re.sub(r'<link\b[^>]*href="[^"<>]*site-footer\.css(?:\?[^"<>]*)?"[^>]*>','',text)
 text=re.sub(r'<script\b[^>]*src="[^"<>]*site-footer\.js(?:\?[^"<>]*)?"[^>]*>\s*</script>','',text)
 if 'family=Barlow+Condensed' not in text:text=text.replace('</head>','<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&amp;family=IBM+Plex+Sans:wght@400;500;600;700&amp;display=swap">\n</head>',1)
 text=text.replace('</head>',f'<link rel="stylesheet" href="{prefix}site-footer.css?v={VERSION}">\n</head>',1)
 text=text.replace('</body>',f'<script src="{prefix}site-footer.js?v={VERSION}"></script>\n</body>',1)
 if 'workroom.js' in text:text=re.sub(r'(workroom\.js)(?:\?[^"<>]*)?',r'\1?v='+VERSION,text)
 if 'data-site-chrome=' not in text:text=re.sub(r'(<body\b[^>]*)(>)',r'\1 data-site-chrome="'+VERSION+r'"\2',text,count=1)
 s=BeautifulSoup(text,'html.parser')
 assert len(s.select('[data-site-footer]'))==1,name
 assert len(s.select('#contact'))==1 and len(s.select('#contactForm'))==1,name
 assert not [a for a in s.select('nav a[href]') if 'ai-schools.html' in a['href']],name
 assert not [a for a in s.select('a[href]') if re.search(r'//(?:www\.)?github\.com/',a['href'])],name
 ids=[e['id'] for e in s.select('[id]')];assert len(ids)==len(set(ids)),name
 p.write_text(text);report['pages'].append(name)
p=ROOT/'script.js';text=p.read_text()
if 'Shared footer owns these forms' not in text:
 marker='  const form = qs("#contactForm");\n  const note = qs("#contactFormNote");';assert text.count(marker)==1
 text=text.replace(marker,'  const form = qs("#contactForm");\n  // Shared footer owns these forms; keep school-specific forms on this handler.\n  if (form?.hasAttribute("data-site-contact-form")) return;\n  const note = qs("#contactFormNote");',1)
p.write_text(text)
p=ROOT/'work/workroom.js';text=p.read_text();marker='    if (image) { image.src=item.i; image.alt=item.a; }'
if 'is-avatar-preview' not in text:
 assert text.count(marker)==1
 text=text.replace(marker,'    if (image) { image.src=item.i; image.alt=item.a; image.parentElement.classList.toggle("is-avatar-preview", key === "workflows"); }',1)
p.write_text(text)
(ROOT/'_maintenance/site-chrome-build-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
