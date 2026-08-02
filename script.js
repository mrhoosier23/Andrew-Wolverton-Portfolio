const WORLD = { w: 1672, h: 941 };

const cameraFrames = {
  desk: { x: 836, y: 470, zoom: 1.0 },
  laptop: { x: 810, y: 339, zoom: 4.08 },
  deskMid: { x: 960, y: 470, zoom: 1.08 },
  monitor: { x: 1408, y: 324, zoom: 4.0 },
  skyline: { x: 836, y: 380, zoom: 1.0 }
};

const SEGMENTS = {
  laptop: { start: 0.02, end: 0.66 },
  monitor: { start: 0.70, end: 0.88 },
  ai: { start: 0.88, end: 0.96 },
  final: { start: 0.96, end: 1.0 }
};

const world = document.getElementById("world");
const laptopFocus = document.getElementById("laptopFocus");
const monitorFocus = document.getElementById("monitorFocus");
const finalFocus = document.getElementById("contactSection");
const laptopTrack = document.getElementById("laptopTrack");
const laptopShell = document.querySelector(".laptop-shell-final");
const laptopPages = [...document.querySelectorAll(".laptop-page-final")];
const socialFeedTrack = document.getElementById("socialFeedTrack");
const aiSystemPage = document.getElementById("aiSystemsPage");
const monitorTrack = document.getElementById("monitorTrack");
const sceneLabel = document.getElementById("sceneLabel");
const entryCue = document.getElementById("entryCue");
const desktopHandoffCue = document.getElementById("desktopHandoffCue");
const desktopQuickjump = document.getElementById("desktopQuickjump");
const musicNoteLayer = document.getElementById("musicNoteLayer");
const doonTopButton = document.getElementById("doonTopButton");

const audioPlayer = document.getElementById("audioPlayer");
const audioPlayButton = document.getElementById("audioPlayButton");
const audioRewindButton = document.getElementById("audioRewindButton");
const audioStopButton = document.getElementById("audioStopButton");
const audioTitle = document.getElementById("audioTitle");
const audioMeta = document.getElementById("audioMeta");
const audioTimecode = document.getElementById("audioTimecode");

const mainVideoPlayer = document.getElementById("mainVideoPlayer");
const videoTitle = document.getElementById("videoTitle");
const videoMeta = document.getElementById("videoMeta");
const videoFullscreen = document.getElementById("videoFullscreen");

const mobileMediaQuery = window.matchMedia("(max-width: 820px)");
const mobileIntro = document.getElementById("mobileIntro");
const mobileDeskWorld = document.getElementById("mobileDeskWorld");
const mobilePhoneHandoff = document.getElementById("mobilePhoneHandoff");
const mobileSectionNav = document.getElementById("mobileSectionNav");
const mobileAudioPlayer = document.getElementById("mobileAudioPlayer");
const mobileAudioTitle = document.getElementById("mobileAudioTitle");
const mobileAudioMeta = document.getElementById("mobileAudioMeta");
const mobileVideoPlayer = document.getElementById("mobileVideoPlayer");
const mobileVideoTitle = document.getElementById("mobileVideoTitle");
const mobileVideoMeta = document.getElementById("mobileVideoMeta");
const mobileAISection = document.getElementById("mobileAI");

const AI_SCENARIOS = {
  onboarding: {
    "input-1": "Form submission",
    "input-2": "Email thread",
    "input-3": "Calendar event",
    core: "Client Intake",
    "agent-1": "Intake Agent",
    "agent-1-meta": "structures the request",
    "agent-2": "Research Agent",
    "agent-2-meta": "builds useful context",
    "agent-3": "Welcome Agent",
    "agent-3-meta": "prepares next steps",
    "output-1": "Client brief",
    "output-1-meta": "organized and ready",
    "output-2": "System update",
    "output-2-meta": "records synchronized",
    "output-3": "Kickoff tasks",
    "output-3-meta": "owners and timing set",
    status: "Client onboarding system"
  },
  content: {
    "input-1": "Voice notes",
    "input-2": "Research links",
    "input-3": "Brand library",
    core: "Content Pipeline",
    "agent-1": "Research Agent",
    "agent-1-meta": "finds useful context",
    "agent-2": "Drafting Agent",
    "agent-2-meta": "shapes the first pass",
    "agent-3": "Review Agent",
    "agent-3-meta": "checks voice and clarity",
    "output-1": "Creative brief",
    "output-1-meta": "message and structure",
    "output-2": "Draft package",
    "output-2-meta": "copy and variations",
    "output-3": "Publishing queue",
    "output-3-meta": "approved work organized",
    status: "Content production system"
  },
  knowledge: {
    "input-1": "Documents",
    "input-2": "Team notes",
    "input-3": "Past answers",
    core: "Knowledge Hub",
    "agent-1": "Retrieval Agent",
    "agent-1-meta": "finds relevant sources",
    "agent-2": "Answer Agent",
    "agent-2-meta": "builds a grounded reply",
    "agent-3": "Update Agent",
    "agent-3-meta": "flags missing knowledge",
    "output-1": "Direct answer",
    "output-1-meta": "clear and useful",
    "output-2": "Source links",
    "output-2-meta": "evidence kept visible",
    "output-3": "Knowledge update",
    "output-3-meta": "gaps ready for review",
    status: "Knowledge assistant system"
  }
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const norm = (p, start, end) => clamp((p - start) / (end - start));

function mixFrame(a, b, t) {
  const eased = smooth(t);
  return {
    x: lerp(a.x, b.x, eased),
    y: lerp(a.y, b.y, eased),
    zoom: lerp(a.zoom, b.zoom, eased)
  };
}

function getCameraFrame(progress) {
  if (progress < 0.035) return mixFrame(cameraFrames.desk, cameraFrames.laptop, norm(progress, 0, 0.035));
  if (progress < 0.66) return cameraFrames.laptop;
  if (progress < 0.675) return mixFrame(cameraFrames.laptop, cameraFrames.deskMid, norm(progress, 0.66, 0.675));
  if (progress < 0.70) return mixFrame(cameraFrames.deskMid, cameraFrames.monitor, norm(progress, 0.675, 0.70));
  if (progress < 0.96) return cameraFrames.monitor;
  if (progress < 0.985) return mixFrame(cameraFrames.monitor, cameraFrames.skyline, norm(progress, 0.96, 0.985));
  return cameraFrames.skyline;
}

function applyCamera(frame) {
  const fit = Math.max(window.innerWidth / WORLD.w, window.innerHeight / WORLD.h);
  const scale = fit * frame.zoom;
  world.style.transform = `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) scale(${scale}) translate(${-frame.x}px, ${-frame.y}px)`;
}

function updateMobileIntro() {
  if (!mobileIntro || !mobileDeskWorld || !mobilePhoneHandoff) return;

  const introRange = Math.max(1, mobileIntro.offsetHeight - window.innerHeight);
  const introProgress = clamp((window.scrollY - mobileIntro.offsetTop) / introRange);
  const cameraProgress = smooth(norm(introProgress, 0, 0.60));
  const startFrame = { x: 836, y: 470, zoom: 1.0 };
  const phoneFrame = { x: 875, y: 381, zoom: 4.85 };
  const frame = mixFrame(startFrame, phoneFrame, cameraProgress);
  const fit = Math.max(window.innerWidth / WORLD.w, window.innerHeight / WORLD.h);
  const scale = fit * frame.zoom;

  mobileDeskWorld.style.transform = `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) scale(${scale}) translate(${-frame.x}px, ${-frame.y}px)`;

  const handoff = smooth(norm(introProgress, 0.52, 0.74));
  mobileDeskWorld.style.opacity = String(1 - handoff * 0.94);
  mobilePhoneHandoff.style.opacity = handoff.toFixed(3);
  mobilePhoneHandoff.style.transform = `scale(${lerp(0.94, 1, handoff).toFixed(4)})`;
  mobilePhoneHandoff.classList.toggle("is-ready", handoff > 0.92);
}

function getLaptopPageOffset(index) {
  const page = laptopPages[index];
  if (!page || !laptopShell) return 0;
  const maximum = Math.max(0, laptopTrack.scrollHeight - laptopShell.clientHeight);
  return Math.min(page.offsetTop, maximum);
}

function laptopOffset(local) {
  if (!laptopShell || laptopPages.length === 0) return 0;
  const socialPage = document.querySelector(".social-feed-page-final");
  const maximum = Math.max(0, laptopTrack.scrollHeight - laptopShell.clientHeight);
  const socialStart = Math.min(socialPage?.offsetTop || 0, maximum);

  if (local <= 0.075) return 0;
  if (local < 0.58) {
    const webProgress = norm(local, 0.075, 0.58);
    return lerp(0, socialStart, webProgress);
  }
  return socialStart;
}
function updateLaptop(progress) {
  // Hand off only after the photographed screen fills the viewport. Avoid a
  // translucent interval where two slightly different title cards overlap.
  const fadeIn = progress >= 0.043 ? 1 : 0;
  const fadeOut = 1 - norm(progress, 0.66, 0.675);
  const opacity = clamp(fadeIn * fadeOut);
  document.documentElement.style.setProperty("--overlayLaptop", opacity.toFixed(3));
  laptopFocus.classList.toggle("active", opacity > 0.2);

  const local = norm(progress, SEGMENTS.laptop.start, SEGMENTS.laptop.end);
  laptopTrack.style.transform = `translateY(${-laptopOffset(local)}px)`;

  // The social page is the final laptop page. Its side rails remain fixed
  // while each center-feed video moves into place and holds before the next.
  if (socialFeedTrack) {
    const viewport = socialFeedTrack.parentElement;
    const posts = [...socialFeedTrack.querySelectorAll(".social-post-final")];
    const maxMove = Math.max(0, socialFeedTrack.scrollHeight - viewport.clientHeight + 24);
    const targets = posts.map(post =>
      clamp(post.offsetTop - (viewport.clientHeight - post.offsetHeight) / 2, 0, maxMove)
    );

    let feedOffset = 0;
    if (local >= 0.58 && targets.length > 0) {
      const sequence = norm(local, 0.58, 0.975);
      const weights = posts.map(post =>
        post.classList.contains("horizontal-social-post") ? 1.35 : 1
      );
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      const weightedProgress = sequence * totalWeight;
      let index = 0;
      let stageStart = 0;

      while (
        index < weights.length - 1 &&
        weightedProgress >= stageStart + weights[index]
      ) {
        stageStart += weights[index];
        index += 1;
      }

      const withinStage = clamp(
        (weightedProgress - stageStart) / weights[index]
      );
      const previousTarget = index === 0 ? 0 : targets[index - 1];
      const currentTarget = targets[index];
      const moveEnd = posts[index].classList.contains("horizontal-social-post")
        ? 0.24
        : 0.34;
      const move = smooth(norm(withinStage, 0, moveEnd));
      feedOffset = lerp(previousTarget, currentTarget, move);
    }

    socialFeedTrack.style.transform = `translateY(${-feedOffset}px)`;
  }
}

function updateDesktopHandoffCue(progress) {
  if (!desktopHandoffCue) return;
  const enter = smooth(norm(progress, 0.625, 0.645));
  const leave = 1 - smooth(norm(progress, 0.685, 0.705));
  const opacity = clamp(enter * leave);
  desktopHandoffCue.style.opacity = opacity.toFixed(3);
  desktopHandoffCue.classList.toggle("is-visible", opacity > 0.06);
}

function monitorOffset(local) {
  if (local < 0.30) return 0;
  if (local < 0.40) return lerp(0, 33.333333, smooth(norm(local, 0.30, 0.40)));
  if (local < 0.66) return 33.333333;
  if (local < 0.76) return lerp(33.333333, 66.666666, smooth(norm(local, 0.66, 0.76)));
  return 66.666666;
}

function updateMonitor(progress) {
  // Switch from the photographed, angled display to the live square-on editor
  // only after the physical screen fills the viewport. A clean handoff avoids
  // doubled text and visible unaligned panel edges.
  const fadeIn = progress >= 0.72 ? 1 : 0;
  const fadeOut = 1 - norm(progress, 0.88, 0.895);
  const opacity = clamp(fadeIn * fadeOut);
  document.documentElement.style.setProperty("--overlayMonitor", opacity.toFixed(3));
  monitorFocus.classList.toggle("active", opacity > 0.2);

  const local = norm(progress, SEGMENTS.monitor.start, SEGMENTS.monitor.end);
  monitorTrack.style.transform = `translateX(${-monitorOffset(local)}%)`;
}
function updateAIScene(progress) {
  if (!aiSystemPage) return;
  const fadeIn = smooth(norm(progress, SEGMENTS.ai.start, 0.895));
  const fadeOut = 1 - smooth(norm(progress, 0.95, SEGMENTS.ai.end));
  const opacity = clamp(fadeIn * fadeOut);
  document.documentElement.style.setProperty("--overlayAI", opacity.toFixed(3));
  aiSystemPage.classList.toggle("active", opacity > 0.18);
  aiSystemPage.classList.toggle("is-live", opacity > 0.35);
}

function updateFinal(progress) {
  const opacity = norm(progress, SEGMENTS.final.start, 0.985);
  document.documentElement.style.setProperty("--overlayFinal", opacity.toFixed(3));
  finalFocus.classList.toggle("active", opacity > 0.18);
}

function updateLabel(progress) {
  let label = "Desk";
  if (progress < 0.015) {
    label = "Desk";
  } else if (progress < SEGMENTS.laptop.end) {
    const local = norm(progress, SEGMENTS.laptop.start, SEGMENTS.laptop.end);
    label = local < 0.58 ? "Web" : "Social";
  } else if (progress < SEGMENTS.monitor.end) {
    const local = norm(progress, SEGMENTS.monitor.start, SEGMENTS.monitor.end);
    label = local < 0.40 ? "Audio + Video" : local < 0.70 ? "Audio" : "Video";
  } else if (progress < SEGMENTS.final.start) {
    label = "AI Systems";
  } else {
    label = "Contact";
  }
  sceneLabel.textContent = label;
}

function formatMediaTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [hours, minutes, secs].map(value => String(value).padStart(2, "0")).join(":");
}

function setMediaSource(mediaElement, relativePath) {
  mediaElement.pause();
  mediaElement.src = relativePath;
  mediaElement.load();
}

function setupAudioLibrary() {
  if (!audioPlayer || !audioPlayButton) return;
  const buttons = [...document.querySelectorAll(".audio-sample-button-v39")];

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      buttons.forEach(item => {
        const cue = item.querySelector(".sample-click-cue-v40");
        if (cue) cue.textContent = item === button ? "Playing" : "Play track";
      });
      setMediaSource(audioPlayer, button.dataset.src);
      audioTitle.textContent = button.dataset.title;
      audioMeta.textContent = button.dataset.meta;
      audioPlayButton.classList.remove("is-playing");
      audioPlayer.play().catch(() => {});
    });
  });

  audioPlayButton.addEventListener("click", async () => {
    try {
      if (audioPlayer.paused) await audioPlayer.play();
      else audioPlayer.pause();
    } catch (error) {
      audioMeta.textContent = "This browser blocked local audio playback. Use the player controls to start it.";
    }
  });

  audioRewindButton?.addEventListener("click", () => {
    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
  });

  audioStopButton?.addEventListener("click", () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  });

  audioPlayer.addEventListener("play", () => { audioPlayButton.classList.add("is-playing"); });
  audioPlayer.addEventListener("pause", () => { audioPlayButton.classList.remove("is-playing"); });
  audioPlayer.addEventListener("timeupdate", () => {
    audioTimecode.textContent = formatMediaTime(audioPlayer.currentTime);
  });
}

function protectMediaControls() {
  document.querySelectorAll("audio, video, button, .final-links a").forEach(element => {
    ["pointerdown", "click"].forEach(eventName => {
      element.addEventListener(eventName, event => event.stopPropagation());
    });
  });
}

function setupVideoLibrary() {
  if (!mainVideoPlayer) return;
  const buttons = [...document.querySelectorAll(".video-sample-button-v39")];

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      buttons.forEach(item => {
        const cue = item.querySelector(".sample-click-cue-v40");
        if (cue) cue.textContent = item === button ? "Playing" : "Play video";
      });
      mainVideoPlayer.poster = button.dataset.poster;
      setMediaSource(mainVideoPlayer, button.dataset.src);
      videoTitle.textContent = button.dataset.title;
      videoMeta.textContent = button.dataset.meta;
      mainVideoPlayer.play().catch(() => {});
    });
  });

  videoFullscreen?.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await mainVideoPlayer.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      videoMeta.textContent = "Full-screen playback is unavailable in this browser.";
    }
  });
}

function setupMobileAudioLibrary() {
  if (!mobileAudioPlayer) return;
  const buttons = [...document.querySelectorAll(".mobile-audio-button")];

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      setMediaSource(mobileAudioPlayer, button.dataset.src);
      mobileAudioTitle.textContent = button.dataset.title;
      mobileAudioMeta.textContent = button.dataset.meta;
      mobileAudioPlayer.play().catch(() => {});
      window.setTimeout(() => mobileAudioPlayer.scrollIntoView({ behavior: preferredScrollBehavior(), block: "center" }), 90);
    });
  });
}

function setupMobileVideoLibrary() {
  if (!mobileVideoPlayer) return;
  const buttons = [...document.querySelectorAll(".mobile-video-button")];

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      mobileVideoPlayer.poster = button.dataset.poster;
      setMediaSource(mobileVideoPlayer, button.dataset.src);
      mobileVideoTitle.textContent = button.dataset.title;
      mobileVideoMeta.textContent = button.dataset.meta;
      mobileVideoPlayer.play().catch(() => {});
      window.setTimeout(() => mobileVideoPlayer.scrollIntoView({ behavior: preferredScrollBehavior(), block: "center" }), 90);
    });
  });
}

function setupAISystemDemo() {
  const buttons = [...document.querySelectorAll("[data-ai-scenario]")];
  if (buttons.length === 0) return;

  const applyScenario = name => {
    const scenario = AI_SCENARIOS[name];
    if (!scenario) return;

    buttons.forEach(button => {
      const active = button.dataset.aiScenario === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    Object.entries(scenario).forEach(([key, value]) => {
      document.querySelectorAll(`[data-ai-label="${key}"]`).forEach(element => {
        element.textContent = value;
      });
    });

    [aiSystemPage, mobileAISection].forEach(section => {
      if (!section) return;
      section.classList.remove("is-switching");
      void section.offsetWidth;
      section.classList.add("is-switching");
      window.setTimeout(() => section.classList.remove("is-switching"), 340);
    });
  };

  buttons.forEach(button => {
    button.addEventListener("click", () => applyScenario(button.dataset.aiScenario));
  });
}

const DESKTOP_JUMP_PROGRESS = {
  web: 0.10,
  social: 0.41,
  audio: 0.775,
  video: 0.845,
  ai: 0.915
};

const MOBILE_JUMP_TARGETS = {
  web: "mobileWeb",
  social: "mobileSocial",
  audio: "mobileAudio",
  video: "mobileVideo",
  ai: "mobileAI"
};

function preferredScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function burstMusicNotes(origin) {
  if (!musicNoteLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = origin?.getBoundingClientRect?.();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  const notes = ["♪", "♫", "♩", "♬", "♪", "♫"];

  notes.forEach((note, index) => {
    const particle = document.createElement("span");
    particle.textContent = note;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--note-x", `${(index - 2.5) * 22 + (index % 2 ? 8 : -8)}px`);
    particle.style.setProperty("--note-y", `${-48 - (index % 3) * 24}px`);
    particle.style.setProperty("--note-delay", `${index * 35}ms`);
    particle.style.setProperty("--note-color", ["#55d9ce", "#f0c35b", "#d894ef", "#f48f72"][index % 4]);
    musicNoteLayer.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1100);
  });
}

function jumpToPortfolioSection(name, origin) {
  dismissEntryCue();
  burstMusicNotes(origin);

  if (mobileMediaQuery.matches) {
    const target = document.getElementById(MOBILE_JUMP_TARGETS[name]);
    target?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
    return;
  }

  const progress = DESKTOP_JUMP_PROGRESS[name];
  if (!Number.isFinite(progress)) return;
  const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: maximum * progress, behavior: preferredScrollBehavior() });
}

function setupQuickJumpNavigation() {
  document.querySelectorAll("[data-jump-section]").forEach(control => {
    control.addEventListener("click", event => {
      event.preventDefault();
      jumpToPortfolioSection(control.dataset.jumpSection, control);
    });
  });
}

function setupDoonControl() {
  if (!doonTopButton) return;
  const image = doonTopButton.querySelector("img");
  if (!image) return;

  const showWave = () => { image.src = image.dataset.waveSrc; };
  const showIdle = () => { image.src = image.dataset.idleSrc; };
  doonTopButton.addEventListener("mouseenter", showWave);
  doonTopButton.addEventListener("focus", showWave);
  doonTopButton.addEventListener("mouseleave", showIdle);
  doonTopButton.addEventListener("blur", showIdle);
  doonTopButton.addEventListener("click", () => {
    burstMusicNotes(doonTopButton);
    image.src = image.dataset.jumpSrc;
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
    window.setTimeout(showIdle, 760);
  });
}

function updateJourneyAffordances() {
  const threshold = mobileMediaQuery.matches ? Math.min(420, window.innerHeight * 0.55) : 18;
  const awayFromTop = window.scrollY > threshold;
  document.body.classList.toggle("journey-started", window.scrollY > 18);
  document.body.classList.toggle("show-doon", awayFromTop);
}
function setupMobileSectionNavigation() {
  if (!mobileSectionNav) return;
  const links = [...mobileSectionNav.querySelectorAll("a")];
  links.forEach(link => {
    link.addEventListener("click", () => {
      const activeId = link.getAttribute("href").slice(1);
      links.forEach(item => {
        const active = item.getAttribute("href") === `#${activeId}`;
        item.classList.toggle("active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
    });
  });
}

function updateMobileSectionNavigationState() {
  if (!mobileSectionNav) return;
  const links = [...mobileSectionNav.querySelectorAll("a")];
  const sections = [...document.querySelectorAll(".mobile-work-section")];
  const marker = Math.min(window.innerHeight * 0.36, 280);
  const current = sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= marker && rect.bottom > marker;
  });
  const activeId = current?.id || "";

  links.forEach(link => {
    const active = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function setPreviewState(name) {
  document.documentElement.dataset.preview = name;
  const laptopPageIndexes = {
    "laptop-title": 0,
    "web-porch": 1,
    "web-lineup": 2,
    "web-yolele": 3,
    "web-inquiry": 4,
    "social-feed": 5
  };
  const monitorPages = {
    "monitor-title": 0,
    "monitor-audio": 33.333333,
    "monitor-video": 66.666666
  };

  if (Object.prototype.hasOwnProperty.call(laptopPageIndexes, name)) {
    applyCamera(cameraFrames.laptop);
    document.documentElement.style.setProperty("--overlayLaptop", "1");
    laptopFocus.classList.add("active");
    laptopTrack.style.transform = `translateY(${-getLaptopPageOffset(laptopPageIndexes[name])}px)`;
    monitorFocus.classList.remove("active");
    finalFocus.classList.remove("active");
    sceneLabel.textContent = name.startsWith("social")
      ? "Social"
      : name.startsWith("ai")
        ? "AI Systems"
        : "Web";
    setInteractiveScene("laptop");
    return true;
  }

  if (name === "ai-systems") {
    applyCamera(cameraFrames.monitor);
    document.documentElement.style.setProperty("--overlayAI", "1");
    aiSystemPage?.classList.add("active", "is-live");
    laptopFocus.classList.remove("active");
    monitorFocus.classList.remove("active");
    finalFocus.classList.remove("active");
    sceneLabel.textContent = "AI Systems";
    setInteractiveScene("ai");
    return true;
  }
  if (Object.prototype.hasOwnProperty.call(monitorPages, name)) {
    applyCamera(cameraFrames.monitor);
    document.documentElement.style.setProperty("--overlayMonitor", "1");
    monitorFocus.classList.add("active");
    monitorTrack.style.transform = `translateX(${-monitorPages[name]}%)`;
    laptopFocus.classList.remove("active");
    finalFocus.classList.remove("active");
    sceneLabel.textContent = name.replace("monitor-", "");
    setInteractiveScene("monitor");
    return true;
  }

  if (name === "desk") {
    applyCamera(cameraFrames.desk);
    sceneLabel.textContent = "Desk";
    setInteractiveScene("none");
    return true;
  }

  if (name === "contact") {
    applyCamera(cameraFrames.skyline);
    document.documentElement.style.setProperty("--overlayFinal", "1");
    finalFocus.classList.add("active");
    sceneLabel.textContent = "Contact";
    setInteractiveScene("final");
    return true;
  }
  return false;
}

function setInteractiveScene(scene) {
  const scenes = {
    laptop: laptopFocus,
    monitor: monitorFocus,
    ai: aiSystemPage,
    final: finalFocus
  };
  Object.entries(scenes).forEach(([name, element]) => {
    if (!element) return;
    element.classList.toggle("is-interactive", name === scene);
  });
}

let previewMode = false;
let ticking = false;

function dismissEntryCue() {
  document.body.classList.add("cue-dismissed");
}

function advanceFromEntryCue() {
  dismissEntryCue();
  const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const target = mobileMediaQuery.matches
    ? Math.min(maximum, Math.max(220, window.innerHeight * 0.55))
    : Math.min(maximum, Math.max(180, maximum * 0.025));
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  window.scrollTo({ top: target, behavior });
}

function update() {
  ticking = false;
  if (previewMode) return;
  updateJourneyAffordances();
  if (mobileMediaQuery.matches) {
    updateMobileIntro();
    updateMobileSectionNavigationState();
    return;
  }
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 0;
  applyCamera(getCameraFrame(progress));
  updateLaptop(progress);
  updateDesktopHandoffCue(progress);
  updateMonitor(progress);
  updateAIScene(progress);
  updateFinal(progress);
  updateLabel(progress);

  // Only one overlay may receive pointer input. This prevents invisible
  // contact links from sitting above audio, video, or social controls.
  if (progress < 0.012) setInteractiveScene("none");
  else if (progress < 0.66) setInteractiveScene("laptop");
  else if (progress < 0.71) setInteractiveScene("none");
  else if (progress < 0.88) setInteractiveScene("monitor");
  else if (progress < 0.96) setInteractiveScene("ai");
  else if (progress < 0.982) setInteractiveScene("none");
  else setInteractiveScene("final");

  document.documentElement.style.setProperty("--progress", progress.toFixed(4));
}

function requestUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("scroll", () => {
  if (window.scrollY > 8) dismissEntryCue();
}, { passive: true });
window.addEventListener("wheel", dismissEntryCue, { passive: true, once: true });
window.addEventListener("touchmove", dismissEntryCue, { passive: true, once: true });
window.addEventListener("keydown", event => {
  if (["ArrowDown", "PageDown", " ", "End"].includes(event.key)) dismissEntryCue();
});
entryCue?.addEventListener("click", advanceFromEntryCue);
window.addEventListener("resize", requestUpdate);
window.addEventListener("load", () => {
  setupAudioLibrary();
  setupVideoLibrary();
  setupMobileAudioLibrary();
  setupMobileVideoLibrary();
  setupAISystemDemo();
  setupQuickJumpNavigation();
  setupDoonControl();
  setupMobileSectionNavigation();
  protectMediaControls();
  const preview = new URLSearchParams(window.location.search).get("preview");
  previewMode = Boolean(preview && setPreviewState(preview));
  if (!previewMode && window.scrollY <= 8) {
    setTimeout(() => document.body.classList.add("cue-ready"), 480);
  } else {
    dismissEntryCue();
  }
  if (!previewMode) requestUpdate();
  setTimeout(() => previewMode ? setPreviewState(preview) : requestUpdate(), 180);
});
