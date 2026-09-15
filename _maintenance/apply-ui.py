"""Apply exact, guarded portfolio refinements on the isolated review branch."""
from pathlib import Path
from html import escape
import json,os,re,subprocess
assert os.environ.get('GITHUB_REF_NAME')=='portfolio-ui-review-20260915'
BASE='17e489e9b98d484aad39671ee348a0ac84569717'
pages=[Path(p) for p in subprocess.check_output(['git','ls-files','*.html']).decode().splitlines() if not p.startswith('archive/')]
assert len(pages)==18
outputs=[str(p) for p in pages]+['work/workroom.js','portfolio-ui.css','scripts/audit_site_links.py']
for path in [str(p) for p in pages]+['work/workroom.js']:
 subprocess.run(['git','diff','--exit-code',BASE,'HEAD','--',path],check=True)
def edit(path,old,new,count=1):
 p=Path(path);s=p.read_text();assert s.count(old)==count,(path,old[:80],s.count(old));p.write_text(s.replace(old,new))
# Do not discard an explicitly requested homepage section on mobile.
edit('index.html','  var fullSite = false;','  var fullSite = false;\n  var sectionLink = window.location.hash && !["#home", "#top"].includes(window.location.hash);')
edit('index.html','&& !forceFull && (!fullSite || forceMobile)','&& !forceFull && !sectionLink && (!fullSite || forceMobile)')
for old,new in {'projects.html?project=porch-stomp#projects':'projects/porch-stomp.html','projects.html?project=dsg#dsgDeepDive':'projects/discovery-sound-garden.html','projects.html?project=yolele#projects':'projects/yolele-ingredients.html','projects.html?focus=ai':'work/workflows/','projects.html#dsgDeepDive':'projects/discovery-sound-garden.html'}.items():edit('index.html',old,new)
matches=list(re.finditer(r'<a\b[^>]*class="[^"]*proof-card[^"]*"[^>]*>.*?</a>',Path('mobile.html').read_text(),re.S));assert len(matches)==3
for match,target in zip(matches,['projects/porch-stomp.html','projects/discovery-sound-garden.html','projects/yolele-ingredients.html']):
 original=match.group(0);edit('mobile.html',original,re.sub(r'href="[^"]*"','href="'+target+'"',original,count=1))
edit('mobile.html','<a class="note-trigger" data-full-site href="index.html?full=1#studio"><small>iPod / music player</small><strong>Play the recordings</strong></a>','<button class="note-trigger music-player-shortcut" data-open-player type="button" aria-haspopup="dialog" aria-controls="musicPlayer"><small>iPod / music player</small><strong>Play the recordings</strong></button>')
edit('services.html','id="nycFieldUnit"><span class="legacy-anchor" id="serviceAudio"></span>','id="nycFieldUnit">')
edit('services.html','id="buildWithAndrew"><span class="legacy-anchor" id="serviceCampaigns"></span>','id="buildWithAndrew">')
edit('services.html','<div aria-label="Content-only social media pricing" class="service-production-rates">','<div aria-label="Content-only social media pricing" class="service-production-rates" id="serviceCampaigns">')
edit('services.html','campaign, content piece, event, or odd prototype','campaign, content piece, program, event, or odd prototype')
audio='''<article class="service-offering service-audio-editing service-toolbox-offering" id="serviceAudio" aria-labelledby="audioServiceTitle">
<div class="service-number">A</div>
<div class="service-offering-copy"><p class="eyebrow">Music, voice, and performance</p><h3 id="audioServiceTitle">Audio editing &amp; dance mixes</h3><p>Custom cuts, medleys, mashups, and performance edits shaped around choreography. Competition and recital mixes for youth and high-school dancers, plus event, narration, and podcast audio.</p><ul><li>Custom cuts, count extensions, and tempo adjustments</li><li>Transitions, sound effects, and lyric cleanups</li><li>Narration, audio leveling, and performance endings</li><li>Collaborative revisions and playback-ready exports</li></ul></div>
<aside class="service-offering-meta"><small>Audio editing</small><strong>$15–$30+</strong><span>Most straightforward song cuts are $15–$20. A package of up to 10 standard cuts is $300.</span><div class="service-proof"><small class="service-proof-label">Related work</small><a class="service-proof-link" href="work/media/#audio">Hear dance mixes and audio examples <span aria-hidden="true">→</span></a></div><a data-service-choice="Audio editing and dance mixes" href="#contact">Discuss your audio <b>↗︎</b></a></aside>
</article>
'''
edit('services.html','<article class="service-offering service-video service-toolbox-offering" id="serviceVideo">',audio+'<article class="service-offering service-video service-toolbox-offering" id="serviceVideo">')
edit('services.html','id="serviceVideo">\n<div class="service-number">A</div>','id="serviceVideo">\n<div class="service-number">B</div>')
edit('services.html','<p class="eyebrow">Audio, video, and social production</p><h3>Make the piece do its job.</h3>','<p class="eyebrow">Video and social production</p><h3>Video editing &amp; social content</h3>')
edit('services.html','<li>Dance, event, podcast, and performance audio</li>','<li>Story, pacing, captions, and sound</li>')
edit('services.html','<div class="service-package-price"><small>Audio editing</small><strong>$15–$30+</strong><span>Most straightforward song cuts are $15–$20. A package of up to 10 standard cuts is $300.</span></div>\n','')
edit('services.html','id="serviceAi">\n<div class="service-number">B</div>','id="serviceAi">\n<div class="service-number">C</div>')
edit('services.html','<div class="service-number">C</div>\n<div class="service-offering-copy"><p class="eyebrow">Live music and performance</p>','<div class="service-number">D</div>\n<div class="service-offering-copy"><p class="eyebrow">Live music and performance</p>')
for old,new in {'projects.html#projects':'projects.html','projects.html?focus=live':'work/media/#live','projects.html?media=video#media':'work/media/#video','projects.html#ai':'work/workflows/','projects.html?media=performance#media':'work/media/#live'}.items():edit('services.html',old,new)
edit('work/nonprofits-programs/index.html','../../services.html#servicePartnership','../../services.html#buildWithAndrew')
s=Path('work/workroom.js').read_text();start=s.index('const socialPosts=');end=s.index('channels.forEach((b,i)',start)
edit('work/workroom.js',s[start:end],'// Published Instagram posts are embedded directly in the campaign page.\n')
s=Path('work/workroom.js').read_text();start=s.index('  if(document.body.classList.contains("workroom-index"))');end=s.rindex('}());')
router='''  if (document.body.classList.contains("workroom-index")) {
    const query = new URLSearchParams(location.search);
    const project = query.get("project"), media = query.get("media"), focus = query.get("focus");
    const hash = location.hash.toLowerCase();
    const projectRoutes = {"porch-stomp":"projects/porch-stomp.html", "yolele":"projects/yolele-ingredients.html", "dsg":"projects/discovery-sound-garden.html"};
    let target = projectRoutes[project] || "";
    if (!target && ["audio","video","performance","live"].includes(media)) target = "work/media/#" + (media === "performance" ? "live" : media);
    if (!target && focus === "live") target = "work/media/#live";
    if (!target && (focus === "ai" || hash === "#ai")) target = "work/workflows/";
    if (!target && hash === "#dsgdeepdive") target = "projects/discovery-sound-garden.html";
    if (!target && ["#socialprojects","#social","#campaigns"].includes(hash)) target = "work/campaigns-content/";
    if (!target && ["#websites","#websitework"].includes(hash)) target = "work/websites/";
    if (!target && ["#media","#audio","#video","#performance","#live"].includes(hash)) target = "work/media/#" + (hash === "#performance" ? "live" : hash === "#media" ? "audio" : hash.slice(1));
    if (!target && hash === "#projects") target = "projects.html";
    if (target) location.replace(target);
  }
'''
edit('work/workroom.js',s[start:end],router)
def shell(path,title,body,extra_class):
 s=Path(path).read_text();before=s[:s.index('<main id="mainContent">')];after=s[s.index('</main>')+len('</main>'):]
 before=before.replace('class="workroom-page"','class="workroom-page '+extra_class+'"');before=re.sub(r'<title>.*?</title>','<title>'+title+' | Andrew Wolverton</title>',before)
 return before+'<main id="mainContent">\n'+body+'\n</main>'+after
projects=[
 {'id':'porch-stomp','type':'Festival website','name':'Porch Stomp','image':'Porch Stomp Screenshot.png','case':'porch-stomp.html','live':'https://www.porchstomp.com/','copy':'A clearer path to the festival, artists, stages, and ways to participate. Built for visitors finding their way from a phone.','role':'Website redesign · Navigation · Lineup discovery'},
 {'id':'discovery-sound-garden','type':'Nonprofit website','name':'Discovery Sound Garden','image':'DSG Social Share.jpg','case':'discovery-sound-garden.html','live':'https://discoverysoundgarden.com/','copy':'A public home that connects music learning, recording, and performance with clear pathways into the organization.','role':'Brand & website · Program pathways · Communications'},
 {'id':'yolele-ingredients','type':'B2B website','name':'Yolélé Ingredients','image':'Yolele Ingredients.png','case':'yolele-ingredients.html','live':'https://www.yoleleingredients.com/','copy':'An ingredient website organized around what commercial buyers need to know: products, applications, sourcing, and the next step.','role':'Website strategy · Buyer journey · Inquiry design'}
]
cards=[]
for i,p in enumerate(projects,1):
 img='../../assets/'+p['image'];name=escape(p['name']);case='../../projects/'+p['case']
 cards.append(f'''<article class="website-project-card" id="{p['id']}" aria-labelledby="{p['id']}-title">
<div class="website-project-heading"><p class="eyebrow">0{i} / {p['type']}</p><h2 id="{p['id']}-title">{name}</h2></div>
<figure class="website-project-shot"><a href="{img}" target="_blank" rel="noopener" aria-label="Open full-size {name} image"><img src="{img}" alt="{name} website preview" loading="lazy" decoding="async"></a><figcaption><a class="cta-compact" href="{img}" target="_blank" rel="noopener">Full-size image <span aria-hidden="true">↗</span></a></figcaption></figure>
<div class="website-project-copy"><p>{p['copy']}</p><p class="website-project-role">{p['role']}</p><div class="website-project-actions"><a class="cta-compact cta-primary" href="{case}">Case study &amp; screenshots <span aria-hidden="true">→</span></a><a class="cta-compact" href="{p['live']}" target="_blank" rel="noopener noreferrer">Visit website <span aria-hidden="true">↗</span></a></div></div>
</article>''')
body='''<section class="focus-hero website-collection-hero"><p class="breadcrumb"><a href="../../projects.html">Work</a> / Websites</p><p class="eyebrow">3 website projects</p><h1>Different audiences.<br>Clearer websites.</h1><p class="lede">Festival, nonprofit, and business websites. Explore each project, see the screenshots, and find out what changed.</p></section>
<section class="website-project-grid" aria-label="All three website projects">
'''+ '\n'.join(cards)+'''
</section>
<section class="website-collection-footer"><div><h2>Have a website in mind?</h2><p>Start with the audience, what they need to do, and what is getting in their way.</p></div><a class="cta-compact cta-primary" href="../../services.html#buildWithAndrew">Discuss a website <span aria-hidden="true">→</span></a></section>
<nav class="website-related-actions" aria-label="Related work"><a class="cta-compact" href="../campaigns-content/">Social media projects</a><a class="cta-compact" href="../workflows/">Website &amp; workflow systems</a><a class="cta-compact" href="../../projects.html">Browse all work</a></nav>'''
s=shell('work/websites/index.html','Website Projects',body,'website-collection-page')
s=re.sub(r'<dialog id="websiteProjects">.*?</dialog>','',s,flags=re.S);s=re.sub(r'<dialog id="websiteScreens">.*?</dialog>','',s,flags=re.S)
s=s.replace('This is where the visitor path gets untangled.','Three projects, each with its own case study and screenshots.')
Path('work/websites/index.html').write_text(s)
posts=[('Cnke46IN1EY','Atlantic Theater Company','Horizontal campaign video','Editing and adaptation for a horizontal social post.'),('CoFyIzwssNR','Atlantic Theater Company','Vertical campaign video','Editing and adaptation for a vertical social post.'),('CwDbBv9PD-4','Terry Knickerbocker Studio','Promotional social video','Promotional video editing for the acting studio.')]
blocks=[]
for i,(code,client,title,desc) in enumerate(posts,1):
 url='https://www.instagram.com/reel/'+code+'/'
 blocks.append(f'''<article class="social-post-card" aria-labelledby="post-title-{i}"><header><p class="eyebrow">{client}</p><h2 id="post-title-{i}">{title}</h2><p>{desc}</p></header><div class="social-post-embed"><iframe title="{client}: {title}" src="{url}embed/" loading="eager" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div><div class="social-post-actions"><a class="cta-compact" href="{url}" target="_blank" rel="noopener noreferrer">Open on Instagram <span aria-hidden="true">↗</span></a></div></article>''')
body='''<section class="focus-hero"><p class="breadcrumb"><a href="../../projects.html">Work</a> / Social Media &amp; Campaigns</p><h1>Social videos.<br>In their published context.</h1><p class="lede">Campaign edits for Atlantic Theater Company and Terry Knickerbocker Studio, in horizontal and vertical formats.</p></section>
<section class="social-project-grid" aria-label="Published Instagram projects">
'''+ '\n'.join(blocks)+'''
</section>
<div class="social-collection-footer"><p class="embed-help">If Instagram is unavailable in your browser, each post has a direct link.</p><div class="focus-actions"><a class="cta-compact cta-primary" href="../../services.html#serviceCampaigns">Discuss social content</a><a class="cta-compact" href="../media/#video">Other video projects</a><a class="cta-compact" href="../../projects.html">Browse all work</a></div></div>'''
Path('work/campaigns-content/index.html').write_text(shell('work/campaigns-content/index.html','Social Media &amp; Campaigns',body,'social-collection-page'))
for p in pages:
 edit(p,'</head>','<link rel="stylesheet" href="/portfolio-ui.css?v=20260915-link-ui-audit"></head>')
 if 'workroom.js?v=20260915-restored-collections-r2' in p.read_text():edit(p,'workroom.js?v=20260915-restored-collections-r2','workroom.js?v=20260915-link-ui-audit')
for path in ['work/media/audio-library.json','work/media/audio-library.js','work/media/audio-library.css']:
 assert Path(path).read_bytes()==subprocess.check_output(['git','show',BASE+':'+path])
old=subprocess.check_output(['git','show',BASE+':work/media/index.html']).decode();new=Path('work/media/index.html').read_text()
assert re.search(r'<aside class="wire-collaboration".*?</aside>',old,re.S).group()==re.search(r'<aside class="wire-collaboration".*?</aside>',new,re.S).group()
Path('_maintenance/publication-paths.json').write_text(json.dumps(outputs))
print('Prepared',len(outputs),'publication paths. Audio files, playlist, and collaboration credit unchanged.')
