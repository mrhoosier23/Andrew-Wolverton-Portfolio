from pathlib import Path
from bs4 import BeautifulSoup
import re, hashlib
ROOT=Path('.')
data=(ROOT/'services.html').read_bytes()
assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()=='cd8988f97345e0d56c88edc6ffc0264521a092d7', 'Services source changed; stop rather than overwrite'
old=BeautifulSoup(data.decode(),'html.parser')
old_ids={n['id'] for n in old.select('[id]')}
old_fields={n.get('name') for n in old.select('#contactForm [name]')}
head=old.head
for a in ['description','og:description','twitter:description']:
 node=head.find('meta',attrs={'name':a}) or head.find('meta',attrs={'property':a})
 if node:node['content']='Website design, social content, audio and video editing, live music, NYC research, and AI workflow services. View packages and pricing from Andrew Wolverton.'
for script in head.find_all('script'):
 if 'andrewTheme' in script.get_text():script.string="try{document.documentElement.dataset.theme=localStorage.getItem('andrewTheme')||'light';}catch(e){document.documentElement.dataset.theme='light';}"
shared=head.find('link',href=re.compile('portfolio-ui.css'))
assert shared
shared['href']='/portfolio-ui.css?v=20260916-services-v3'
head.append(old.new_tag('link',rel='stylesheet',href='services-page.css?v=20260916-services-v3'))
form=old.select_one('#contactForm')
form['class']=['sp-contact-form']
for label in form.select('label'):
 span=label.find('span')
 if span and span.get_text()=='What is not working yet?':span.string='Tell me about your project'
field=form.select_one('#contactProjectType');field['list']='serviceOptions';field['placeholder']='Choose a service or describe your project'
form.select_one('textarea')['placeholder']='What do you need, who is it for, and when do you need it?'
options=['Websites','Social content','Audio editing & dance mixes','Video editing','Live music','NYC research & scouting','AI & workflow systems','Project review & fixes','Custom project build','Ongoing creative support','Schools & education','Not sure yet']
datalist=old.new_tag('datalist',id='serviceOptions')
for t in options:datalist.append(old.new_tag('option',value=t))
field.insert_after(datalist)
for button_node in form.select('button[type=submit]'):button_node['class']=['sp-button','sp-button-primary']
form.select_one('#contactFormNote').clear();form.select_one('#contactFormNote').append('Your inquiry goes directly to Andrew.')
groups=old.select('.tool-group')
old_tools=[n.get('data-tool') for n in old.select('.tool-card')]
for group in groups:
 group['class']=['sp-tool-group'];group.attrs.pop('open',None)
 summary=group.summary;name=summary.select_one('span').get_text();count=len(group.select('.tool-card'))
 summary.clear()
 summary.append(BeautifulSoup(f'<span class="sp-tool-name">{name}</span><span class="sp-tool-count">{count} tools</span><span class="sp-disclosure-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>','html.parser'))
 for node in group.select('.tool-group-content'):node['class']=['sp-tool-content']
 for node in group.select('.tool-logo-grid'):node['class']=['sp-tool-grid']
 for node in group.select('.tool-card'):node['class']=['sp-tool-card']
 for node in group.select('.tool-lettermark'):node['class']=['sp-tool-lettermark']
def button(label,href,choice=None,primary=False):
 attr=f' data-service-choice="{choice}"' if choice else ''
 return '<a class="sp-button'+(' sp-button-primary' if primary else '')+f'" href="{href}"{attr}>{label}</a>'
services=[
 ('serviceWeb','Websites','New sites, redesigns, and clearer navigation for organizations, festivals, and small businesses.','Design · Content · Development','work/websites/','buildWithAndrew'),
 ('serviceCampaigns','Social content','Branded graphics, short videos, and coordinated content for your next campaign or promotion.','Posts · Reels · Campaigns','work/campaigns-content/','socialRates'),
 ('serviceAudio','Audio editing & dance mixes','Custom cuts, transitions, narration, and mixes for competitions, recitals, events, and podcasts.','Music · Voice · Performance','work/media/#audio','audioRates'),
 ('serviceVideo','Video editing','Turn your footage into showreels, performance videos, promos, and social-ready edits.','Editing · Captions · Sound','work/media/#video','videoRates'),
 ('livePerformance','Live music','Book Andrew solo or Rooftop Ramblers for your venue, event, or performance program.','Solo · Band · Custom repertoire','work/media/#live','liveRates'),
 ('nycFieldUnit','NYC research & scouting','Location and vendor research, site visits, and photo or video documentation in New York City.','Research · Visits · Verified options',None,'fieldRates')]
cards=[]
for n,(ident,title,copy,skills,examples,rates_id) in enumerate(services,1):
 actions=(button('See examples',examples) if examples else button('Ask about NYC support','#contact','NYC research & scouting'))+button('View pricing','#'+rates_id)
 heading_id=' id="audioServiceTitle"' if ident=='serviceAudio' else ''
 cards.append(f'<article class="sp-service-card" id="{ident}"><div class="sp-card-top"><span class="sp-number" aria-hidden="true">{n:02}</span><span class="sp-card-type">{skills}</span></div><h3{heading_id}>{title}</h3><p>{copy}</p><div class="sp-card-actions">{actions}</div></article>')
rate_cards=[]
def rates(ident,kicker,title,rows,copy,choice,action):
 lines=''.join(f'<div class="sp-rate"><dt>{label}</dt><dd>{price}</dd></div>' for label,price in rows)
 rate_cards.append(f'<article class="sp-price-card" id="{ident}"><p class="sp-kicker">{kicker}</p><h3>{title}</h3><dl class="sp-rate-list">{lines}</dl><p class="sp-price-note">{copy}</p>{button(action,"#contact",choice)}</article>')
rates('audioRates','Audio','Cuts & dance mixes',[('Individual edit','$15–$30+'),('Most straightforward cuts','$15–$20'),('Up to 10 standard cuts','$300')], 'Custom medleys, mashups, narration, and more involved edits are scoped to the work.','Audio editing and dance mixes','Discuss your audio')
rates('socialRates','Social content','Posts & content batches',[('Static post','$40–$75'),('Short social video / Reel','$95–$175+'),('4 posts + 1 short video','$300'),('6 posts + 3 short videos','$550')], 'Static posts include copy, one branded graphic, one size, and one revision. Social videos: up to 60 seconds, supplied footage, basic titles or captions, one format, and one revision. Batches share a message and visual direction.','Social content','Plan your content')
rates('videoRates','Video','Short-video edits',[('One short video','$95–$175+'),('Up to 4 short videos','$550')], 'Single edits: up to 60 seconds, supplied footage, standard cuts, audio leveling, simple titles or captions, one format, and one revision. The four-video package uses one footage batch, a shared visual treatment, and two consolidated revision rounds.','Video editing','Discuss your video')
rates('liveRates','Live music','Solo & band bookings',[('Andrew solo','From $650'),('Rooftop Ramblers','From $1,800')], 'Voice, harmonica, guitar, and piano. Repertoire and performance requirements are agreed for your venue or event.','Live music and performance','Ask about a date')
rates('fieldRates','New York City','Research & site visits',[('Focused research project','$750–$1,250')], 'A defined local question, documented findings, risks, options, and a recommendation. Travel and third-party costs are scoped separately.','NYC research and scouting','Describe the research')
rates('workflowRates','AI & workflows','Discovery & custom systems',[('Workflow discovery','From $1,500'),('Custom build','From $4,000')], 'Map repeated work, build the right tool, and test it with clear review and approval steps. Includes documentation and handoff.','AI and workflow systems','Discuss your workflow')
faq=[
 ('Getting started','What should I send you?','A rough outline is enough. Tell me what you need, who it is for, what already exists, and any deadline or budget you know.'),
 ('Scope & budget','Can we start with a smaller phase?','Yes. A review, prototype, or first-phase build can be scoped separately before a larger commitment. This is useful when content, approvals, or funding are still developing.'),
 ('Production','What do the media rates include?','The scope and revision allowance are listed with each rate. Extra formats, heavier cleanup, motion graphics, rush delivery, and additional revisions are quoted separately.'),
 ('Who I work with','Is my organization a fit?','I work with arts and cultural organizations, nonprofits, festivals, music and education programs, independent creative teams, and mission-driven small businesses.'),
 ('AI & review','How do you use AI?','For research, organization, drafting, testing, and production support. Strategy, source checking, design direction, quality control, and final approval stay human-led.'),
 ('Combined bookings','Can live music be part of a larger project?','Yes. Performance and digital services are usually booked separately, but an event, campaign, or performance-media package can be scoped together.')]
faq_html=[]
for i,(cat,q,a) in enumerate(faq):
 faq_html.append('<details class="sp-faq-item"'+(' open' if i==0 else '')+f'><summary><span class="sp-faq-question"><small>{cat}</small><span>{q}</span></span><span class="sp-disclosure-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span></summary><div class="sp-faq-answer"><p>{a}</p></div></details>')
hero='<section class="sp-hero sp-wrap" aria-labelledby="pageTitle"><div><p class="sp-kicker">Andrew Wolverton · Services</p><h1 id="pageTitle">Websites, media<br>&amp; live music.</h1></div><div class="sp-hero-copy"><p>Design, production, AI workflows, and local support in New York City. Find the service you need, then see the work and pricing.</p><div class="sp-actions">'+button('Discuss a project','#contact',primary=True)+button('Packages & pricing','#packages')+'</div></div></section><nav class="sp-jumpnav sp-wrap" aria-label="Services page sections"><a href="#services">Services</a><a href="#packages">Pricing</a><a href="#toolkit">Tools</a><a href="#faq">FAQs</a><a href="#contact">Contact</a></nav>'
main=f'''<main id="mainContent">
{hero}
<section class="sp-section sp-wrap" id="services" aria-labelledby="servicesTitle"><div class="sp-section-head"><h2 id="servicesTitle">What I offer</h2><p>Choose a service. See real examples.</p></div><div class="sp-service-grid">{''.join(cards)}</div>
<article class="sp-workflow-card" id="serviceAi"><div><p class="sp-kicker">AI & workflow systems</p><h3>Spend less time on repeated work.</h3><p>Research assistants, outreach systems, and internal tools, with testing, documentation, and human review built in.</p></div><div class="sp-actions">{button('See workflow examples','work/workflows/')}{button('View pricing','#workflowRates')}</div><p class="sp-school-link">For schools: {button('Teacher Time Back Lab','ai-schools.html')}</p></article></section>
<section class="sp-pricing-section" id="packages" aria-labelledby="packagesTitle"><div class="sp-wrap"><div class="sp-section-head"><div><p class="sp-kicker">Packages & pricing</p><h2 id="packagesTitle">Know what you’re booking.</h2></div><p>Focused edits, larger projects, and ongoing support.</p></div><div class="sp-price-grid">{''.join(rate_cards)}</div>
<div class="sp-engagement-head"><h3>Website builds, project fixes & ongoing support</h3></div><div class="sp-engagement-grid">
<article class="sp-engagement" id="buildWithAndrew"><p class="sp-kicker">New projects</p><h3>Custom project build</h3><strong class="sp-engagement-price">Project-based quote</strong><p>A website, campaign, program, event, or prototype. We agree the scope, build and test it, then hand it over.</p>{button('Describe your project','#contact','Custom project build')}</article>
<article class="sp-engagement" id="creativeRescue"><p class="sp-kicker">Existing projects</p><h3>Project review & fixes</h3><strong class="sp-engagement-price">$1,250</strong><p>Diagnosis, a proposed fix, and one meaningful implementation for a website, campaign, workflow, or creative project.</p><p class="sp-engagement-detail">Fuller projects typically $3,000–$7,500+.</p>{button('Discuss a fix','#contact','Project review and fixes')}</article>
<article class="sp-engagement" id="servicePartnership"><p class="sp-kicker">Monthly support</p><h3>Ongoing creative support</h3><strong class="sp-engagement-price">Custom retainer</strong><p>Regular help with web, content, media, or workflows. Deliverables and response expectations are agreed in advance.</p>{button('Discuss ongoing support','#contact','Ongoing creative support')}</article></div>
<p class="sp-scope-note"><strong>Scope matters.</strong> Media rates assume organized, client-supplied material and an established direction. Additional formats, complex cleanup, motion graphics, rush delivery, and extra revisions are quoted separately. Larger quotes account for pages, integrations, content readiness, project length, travel, and production needs.</p></div></section>
<section class="sp-process sp-wrap" id="process" aria-labelledby="processTitle"><h2 id="processTitle">How I work</h2><ol><li><strong>Listen</strong><span>Understand the need.</span></li><li><strong>Map</strong><span>Agree the scope.</span></li><li><strong>Make</strong><span>Build the work.</span></li><li><strong>Test</strong><span>Check it works.</span></li><li><strong>Hand off</strong><span>Deliver with context.</span></li></ol></section>
<section class="sp-tools-section sp-wrap" id="toolkit" aria-labelledby="toolkitPageTitle"><div class="sp-section-head"><h2 id="toolkitPageTitle">Tools I use</h2><p>Browse by type of work.</p></div><div class="sp-tools" id="toolkitContent">{''.join(str(x) for x in groups)}</div></section>
<section class="sp-faq-section" id="faq" aria-labelledby="faqTitle"><div class="sp-wrap sp-faq-layout"><header><p class="sp-kicker">Before you book</p><h2 id="faqTitle">A few<br>practical answers.</h2><p>Start here, or ask about your project directly.</p>{button('Ask a question','#contact')}</header><div class="sp-faq-list">{''.join(faq_html)}</div></div></section>
<section class="sp-contact-section" id="contact" aria-labelledby="contactTitle"><div class="sp-wrap sp-contact-layout"><div class="sp-contact-copy"><p class="sp-kicker">Get in touch</p><h2 id="contactTitle">Tell me about<br>your project.</h2><p>Send the service, deadline, and budget you have in mind. A rough outline is enough.</p><div class="sp-contact-person"><figure class="sp-portrait"><div class="sp-portrait-clip"><img src="assets/andrew-doon.webp" alt="Stylized portrait of Andrew standing beside Doon" loading="lazy" width="977" height="1610" onerror="this.onerror=null;this.src='assets/Andrew-doon.PNG';"></div></figure><div><strong>Andrew Wolverton</strong><span>Brooklyn, New York</span>{button('Email Andrew','mailto:hello@awolverton.com')}</div></div></div>{str(form)}</div></section></main>'''
header=str(old.select_one('#siteHeader'));doon=str(old.select_one('#doonGuide'));footer=str(old.select_one('.site-footer'))
text='<!DOCTYPE html>\n<html lang="en" data-theme="light">\n'+str(head)+'\n<body class="page-services services-v3" data-page="services" id="top">\n<a class="skip-link" href="#mainContent">Skip to content</a>\n'+header+doon+main+footer+'\n<script src="script.js?v=20260820-ai-schools"></script>\n<script src="navigation.js?v=20260913-unified-nav"></script>\n</body>\n</html>\n'
text=text.replace('href="projects.html"','href="work/"')
new=BeautifulSoup(text,'html.parser');new_ids={n['id'] for n in new.select('[id]')}
assert old_ids <= new_ids, ('Lost anchor IDs',old_ids-new_ids)
assert len(new_ids)==len(new.select('[id]')), 'Duplicate IDs'
assert new.select_one('#contactForm')['action']=='https://formsubmit.co/ajax/anwolver@gmail.com'
assert old_fields == {n.get('name') for n in new.select('#contactForm [name]')}
assert old_tools == [n.get('data-tool') for n in new.select('.sp-tool-card')]
(ROOT/'services.html').write_text(text)
print('Services rebuilt; all old anchor IDs, form fields, delivery endpoint and tool inventory preserved.')
