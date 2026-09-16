from pathlib import Path
from bs4 import BeautifulSoup
from html import escape

path=Path('services.html')
s=BeautifulSoup(path.read_text(), 'html.parser')
assert s.select_one('.services-v3') and len(s.select('.sp-service-card'))==6
old_ids={e['id'] for e in s.select('[id]')}
old_form=str(s.select_one('#contactForm'))
old_tools=[e['data-tool'] for e in s.select('[data-tool]')]
for node in s.select('.sp-jumpnav, .sp-card-type'):
    node.decompose()
for a in s.select('a[href="work/"]'):
    a['href']='projects.html'
for link in s.select('link[rel="stylesheet"]'):
    if 'services-page.css' in link.get('href','') or 'portfolio-ui.css' in link.get('href',''):
        link['href']=link['href'].split('?')[0]+'?v=20260916-services-v4'
s.body['data-services-version']='20260916-v4'
s.select_one('.sp-hero-copy > p').string='Websites, content, audio, video, live performance, and practical systems. Based in Brooklyn, working with organizations and creative teams.'
s.select_one('#services .sp-section-head > p').decompose()
prices={
 'serviceWeb': [('Website build or redesign','Custom quote')],
 'serviceCampaigns': [('Static post','$40–$75'),('Short social video','$95–$175+')],
 'serviceAudio': [('Individual song edit','$15–$30+'),('Custom dance mix','Custom quote')],
 'serviceVideo': [('Short video, up to 60 sec.','$95–$175+')],
 'livePerformance': [('Andrew solo','From $650'),('Rooftop Ramblers','From $1,800')],
 'nycFieldUnit': [('Focused research project','$750–$1,250')],
 'serviceAi': [('Workflow discovery','From $1,500'),('Custom system','From $4,000')]}
notes={
 'serviceWeb':'Quoted for your pages, content, and features.',
 'serviceCampaigns':'Single items include one revision. Content batches below.',
 'serviceAudio':'Most simple cuts are $15–$20. Medleys and narration are quoted to scope.',
 'serviceVideo':'Supplied footage, one format, and one revision.',
 'livePerformance':'Repertoire and production requirements agreed for your event.',
 'nycFieldUnit':'Travel and third-party costs quoted separately.',
 'serviceAi':'Discovery and custom builds are separate scopes.'}
choices={'serviceWeb':'Websites','serviceCampaigns':'Social content','serviceAudio':'Audio editing and dance mixes','serviceVideo':'Video editing','livePerformance':'Live music and performance','nycFieldUnit':'NYC research and scouting','serviceAi':'AI and workflow systems'}
for ident,rows in prices.items():
    card=s.select_one('#'+ident)
    pricing='<div class="sp-visible-pricing"><dl aria-label="'+escape(choices[ident],quote=True)+' pricing">'+''.join('<div><dt>'+escape(label)+'</dt><dd>'+escape(price)+'</dd></div>' for label,price in rows)+'</dl><p>'+escape(notes[ident])+'</p></div>'
    actions=card.select_one('.sp-card-actions' if ident!='serviceAi' else '.sp-actions')
    actions.insert_before(BeautifulSoup(pricing,'html.parser'))
    for a in actions.select('a'):
        if a.get_text(strip=True)=='View pricing':
            a['href']='#contact'
            a['data-service-choice']=choices[ident]
            a.string='Discuss this service'
    if ident=='nycFieldUnit':
        links=actions.select('a')
        if len(links)>1: links[0].decompose()
process=[
 ('Listen','Understand the audience, the real problem, what already exists, the constraints, and the outcome that matters.'),
 ('Map','Organize priorities, content, pathways, dependencies, and the smartest version to build first.'),
 ('Make','Build the website, campaign, edit, performance plan, or working system in a usable environment.'),
 ('Test','Check clarity, accessibility, playback, responsive behavior, technical reliability, and edge cases.'),
 ('Hand off','Deliver usable work with documentation, context, decisions, and a clear next step.')]
process_html='<section class="sp-process-section sp-wrap" id="process" aria-labelledby="processTitle"><header class="sp-process-intro"><div><p class="sp-kicker">How I work</p><h2 id="processTitle">A clear route from the first question to the handoff.</h2></div><p>The process is structured enough to keep work moving and flexible enough to respond to what the project actually needs.</p></header><ol class="sp-process-steps" aria-label="Andrew’s five-stage working process">'
for i,(title,copy) in enumerate(process,1):
    process_html+=f'<li><span class="sp-step-number" aria-hidden="true">{i:02}</span><div class="sp-step-copy"><h3>{title}</h3><p>{copy}</p></div></li>'
process_html+='</ol></section>'
s.select_one('#process').replace_with(BeautifulSoup(process_html,'html.parser'))
assert s.select_one('.sp-portrait-clip') is not None
assert old_ids <= {e['id'] for e in s.select('[id]')}
assert str(s.select_one('#contactForm'))==old_form
assert [e['data-tool'] for e in s.select('[data-tool]')]==old_tools
assert len(s.select('#services .sp-visible-pricing'))==7
assert not s.select('.sp-jumpnav')
assert not any(a.get_text(strip=True)=='View pricing' for a in s.select('#services a'))
path.write_text(str(s))
css=Path('services-page.css')
css.write_text(css.read_text()+'\n'+Path('_maintenance/services-v4-layout.css').read_text())
print('Visible prices on all 7 service cards; pill navigation removed; original process copy restored. IDs, package prices, tools, and contact form preserved.')
