(function () {
  "use strict";
  var previews = {
    websites:{n:"01 / 05",s:"WEBSITES · PROJECT PREVIEW",t:"WEBSITES",h:"Porch Stomp Festival website.",d:"A festival website reorganized so visitors can find the schedule, stages, and lineup from a phone.",i:"assets/Porch Stomp Screenshot.png",a:"Porch Stomp Festival website screenshot",u:"work/websites/"},
    nonprofits:{n:"02 / 05",s:"NONPROFITS & PROGRAMS · PROJECT PREVIEW",t:"NONPROFITS & PROGRAMS",h:"Discovery Sound Garden.",d:"A nonprofit built around music education, recording access, fundraising, partnerships, and a public website.",i:"assets/DSG Social Share.jpg",a:"Discovery Sound Garden project image",u:"work/nonprofits-programs/"},
    campaigns:{n:"03 / 05",s:"CAMPAIGNS & CONTENT · PROJECT PREVIEW",t:"CAMPAIGNS & CONTENT",h:"Atlantic Theater Company social edits.",d:"Campaign videos edited in horizontal and vertical versions for the social feeds where the theater's audience would see them.",i:"assets/social-feed-poster.jpg",a:"Atlantic Theater Company campaign video poster",u:"work/campaigns-content/"},
    media:{n:"04 / 05",s:"AUDIO, VIDEO & MUSIC · PROJECT PREVIEW",t:"AUDIO, VIDEO & MUSIC",h:"Dance mixes, video edits, and live sets.",d:"Hear finished audio, browse edited videos, or see live music options for events and performances.",i:"assets/video-poster-3.jpg",a:"Rooftop Ramblers performance poster",u:"work/media/"},
    workflows:{n:"05 / 05",s:"WORKFLOWS · PROJECT PREVIEW",t:"WORKFLOWS",h:"Tools for repeat tasks.",d:"Examples for research, outreach, planning, and documentation that still require the person's final approval.",i:"assets/andrew-ai-idea.png",a:"Andrew with a light bulb",u:"work/workflows/"}
  };
  function setText(id, value) { var el = document.getElementById(id); if (el) el.textContent = value; }
  function showPreview(key) {
    var item = previews[key]; if (!item) return;
    setText("previewStatus",item.s); setText("projectionNumber",item.n); setText("projectionType",item.t); setText("projectionTitle",item.h); setText("projectionDescription",item.d);
    var image = document.getElementById("projectionImage"), link = document.getElementById("projectionLink");
    if (image) { image.src=item.i; image.alt=item.a; }
    if (link) link.href=item.u;
    document.querySelectorAll("[data-work-preview]").forEach(function(button){button.classList.toggle("is-current",button.dataset.workPreview===key);});
  }
  document.querySelectorAll("[data-work-preview]").forEach(function(button){["mouseenter","focus","click"].forEach(function(eventName){button.addEventListener(eventName,function(){showPreview(button.dataset.workPreview);});});});
  document.querySelectorAll("[data-dialog-open]").forEach(function(trigger){trigger.addEventListener("click",function(){var dialog=document.getElementById(trigger.dataset.dialogOpen);if(dialog&&dialog.showModal)dialog.showModal();});});
  document.querySelectorAll("dialog").forEach(function(dialog){dialog.querySelectorAll("[data-dialog-close]").forEach(function(button){button.addEventListener("click",function(){dialog.close();});});dialog.addEventListener("click",function(event){if(event.target===dialog)dialog.close();});});
  var channels=document.querySelectorAll("[data-media-channel]");
  function chooseChannel(name, updateHash) {
    channels.forEach(function(button){var active=button.dataset.mediaChannel===name;button.classList.toggle("is-active",active);button.setAttribute("aria-selected",String(active));});
    document.querySelectorAll("[data-media-panel]").forEach(function(panel){panel.hidden=panel.dataset.mediaPanel!==name;});
    setText("activeChannelLabel","NOW SHOWING: "+(name==="live"?"LIVE MUSIC":name.toUpperCase()));
    if(updateHash)history.replaceState(null,"","#"+name);
  }
  if(channels.length){
    channels.forEach(function(button){button.addEventListener("click",function(){chooseChannel(button.dataset.mediaChannel,true);});});
    var initial=location.hash.slice(1);chooseChannel(["audio","video","live"].indexOf(initial)>-1?initial:"audio",false);
    window.addEventListener("hashchange",function(){var name=location.hash.slice(1);if(["audio","video","live"].indexOf(name)>-1)chooseChannel(name,false);});
  }
  document.querySelectorAll("[data-audio-proof]").forEach(function(audio){audio.addEventListener("play",function(){audio.closest(".soundcheck-panel").classList.add("is-playing");});["pause","ended"].forEach(function(eventName){audio.addEventListener(eventName,function(){audio.closest(".soundcheck-panel").classList.remove("is-playing");});});});
  document.querySelectorAll("[data-audio-src]").forEach(function(button){button.addEventListener("click",function(){var audio=document.getElementById("audioProof");if(!audio)return;audio.src=button.dataset.audioSrc;audio.load();setText("audioName",button.dataset.audioName);document.querySelectorAll("[data-audio-src]").forEach(function(item){item.classList.toggle("is-selected",item===button);});});});
  document.querySelectorAll("[data-video-src]").forEach(function(button){button.addEventListener("click",function(){var video=document.getElementById("videoProof");if(!video)return;video.src=button.dataset.videoSrc;video.poster=button.dataset.videoPoster;video.load();setText("videoName",button.dataset.videoName);setText("videoDescription",button.dataset.videoDescription);document.querySelectorAll("[data-video-src]").forEach(function(item){item.classList.toggle("is-selected",item===button);});});});
  var doon=document.getElementById("doonGuide"); if(doon)doon.addEventListener("click",function(){doon.setAttribute("aria-expanded",String(doon.getAttribute("aria-expanded")!=="true"));});
  if(document.body.classList.contains("workroom-index")){
    var query=new URLSearchParams(location.search), project=query.get("project"), media=query.get("media"), focus=query.get("focus"), hash=location.hash.toLowerCase(), target="";
    if(project==="porch-stomp"||project==="yolele")target="work/websites/"; else if(project==="dsg")target="work/nonprofits-programs/"; else if(media==="audio"||media==="video"||media==="performance")target="work/media/#"+(media==="performance"?"live":media); else if(focus==="ai"||hash==="#ai")target="work/workflows/"; else if(["#projects","#websites","#websitework"].indexOf(hash)>-1)target="work/websites/"; else if(["#media","#audio","#video","#performance"].indexOf(hash)>-1)target="work/media/#"+(hash==="#performance"?"live":hash==="#media"?"audio":hash.slice(1));
    if(target)location.replace(target);
  }
}());
