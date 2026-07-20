const WORLD = { w: 1672, h: 941 };

const cameraFrames = {
  desk: { x: 836, y: 470, zoom: 1.0 },
  laptop: { x: 810, y: 339, zoom: 4.08 },
  deskMid: { x: 960, y: 470, zoom: 1.08 },
  monitor: { x: 1408, y: 324, zoom: 4.0 },
  skyline: { x: 836, y: 380, zoom: 1.0 }
};

const SEGMENTS = {
  laptop: { start: 0.02, end: 0.72 },
  monitor: { start: 0.78, end: 0.95 },
  final: { start: 0.95, end: 1.0 }
};

const world = document.getElementById("world");
const laptopFocus = document.getElementById("laptopFocus");
const monitorFocus = document.getElementById("monitorFocus");
const finalFocus = document.getElementById("contactSection");
const laptopTrack = document.getElementById("laptopTrack");
const laptopShell = document.querySelector(".laptop-shell-final");
const laptopPages = [...document.querySelectorAll(".laptop-page-final")];
const socialFeedTrack = document.getElementById("socialFeedTrack");
const monitorTrack = document.getElementById("monitorTrack");
const sceneLabel = document.getElementById("sceneLabel");
const entryCue = document.getElementById("entryCue");

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
  if (progress < 0.72) return cameraFrames.laptop;
  if (progress < 0.745) return mixFrame(cameraFrames.laptop, cameraFrames.deskMid, norm(progress, 0.72, 0.745));
  if (progress < 0.78) return mixFrame(cameraFrames.deskMid, cameraFrames.monitor, norm(progress, 0.745, 0.78));
  if (progress < 0.95) return cameraFrames.monitor;
  if (progress < 0.985) return mixFrame(cameraFrames.monitor, cameraFrames.skyline, norm(progress, 0.95, 0.985));
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
  const cameraProgress = smooth(norm(introProgress, 0, 0.72));
  const startFrame = { x: 836, y: 470, zoom: 1.0 };
  const phoneFrame = { x: 875, y: 381, zoom: 4.85 };
  const frame = mixFrame(startFrame, phoneFrame, cameraProgress);
  const fit = Math.max(window.innerWidth / WORLD.w, window.innerHeight / WORLD.h);
  const scale = fit * frame.zoom;

  mobileDeskWorld.style.transform = `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) scale(${scale}) translate(${-frame.x}px, ${-frame.y}px)`;

  const handoff = smooth(norm(introProgress, 0.68, 0.88));
  mobileDeskWorld.style.opacity = String(1 - handoff * 0.94);
  mobilePhoneHandoff.style.opacity = handoff.toFixed(3);
  mobilePhoneHandoff.style.transform = `scale(${lerp(0.94, 1, handoff).toFixed(4)})`;
}

function getLaptopPageOffset(index) {
  const page = laptopPages[index];
  if (!page || !laptopShell) return 0;
  const maximum = Math.max(0, laptopTrack.scrollHeight - laptopShell.clientHeight);
  return Math.min(page.offsetTop, maximum);
}

function laptopOffset(local) {
  // The web section is one continuous vertical document. This lets each
  // extended project page keep moving instead of freezing at its top edge.
  if (!laptopShell || laptopPages.length === 0) return 0;
  const socialPage = laptopPages[laptopPages.length - 1];
  const maximum = Math.max(0, laptopTrack.scrollHeight - laptopShell.clientHeight);
  const socialStart = Math.min(socialPage.offsetTop, maximum);

  if (local <= 0.075) return 0;
  if (local >= 0.805) return socialStart;

  const webProgress = norm(local, 0.075, 0.805);
  return lerp(0, socialStart, webProgress);
}

function updateLaptop(progress) {
  // Hand off only after the photographed screen fills the viewport. Avoid a
  // translucent interval where two slightly different title cards overlap.
  const fadeIn = progress >= 0.043 ? 1 : 0;
  const fadeOut = 1 - norm(progress, 0.72, 0.745);
  const opacity = clamp(fadeIn * fadeOut);
  document.documentElement.style.setProperty("--overlayLaptop", opacity.toFixed(3));
  laptopFocus.classList.toggle("active", opacity > 0.2);

  const local = norm(progress, SEGMENTS.laptop.start, SEGMENTS.laptop.end);
  laptopTrack.style.transform = `translateY(${-laptopOffset(local)}px)`;

  // The social page is the final laptop page. Its side rails remain fixed
  // while the center feed settles on each video long enough to watch or play.
  if (socialFeedTrack) {
    const viewport = socialFeedTrack.parentElement;
    const horizontalPost = socialFeedTrack.querySelector(".horizontal-social-post");
    const maxMove = Math.max(0, socialFeedTrack.scrollHeight - viewport.clientHeight + 24);
    const horizontalCenter = horizontalPost
      ? clamp(horizontalPost.offsetTop - (viewport.clientHeight - horizontalPost.offsetHeight) / 2, 0, maxMove)
      : maxMove * 0.55;

    let feedOffset = 0;
    if (local < 0.80) {
      feedOffset = 0;
    } else if (local < 0.91) {
      feedOffset = lerp(0, horizontalCenter, smooth(norm(local, 0.80, 0.91)));
    } else if (local < 0.975) {
      feedOffset = horizontalCenter;
    } else {
      feedOffset = lerp(horizontalCenter, maxMove, smooth(norm(local, 0.975, 1.0)));
    }

    socialFeedTrack.style.transform = `translateY(${-feedOffset}px)`;
  }
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
  const fadeIn = progress >= 0.798 ? 1 : 0;
  const fadeOut = 1 - norm(progress, 0.95, 0.98);
  const opacity = clamp(fadeIn * fadeOut);
  document.documentElement.style.setProperty("--overlayMonitor", opacity.toFixed(3));
  monitorFocus.classList.toggle("active", opacity > 0.2);

  const local = norm(progress, SEGMENTS.monitor.start, SEGMENTS.monitor.end);
  monitorTrack.style.transform = `translateX(${-monitorOffset(local)}%)`;
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
  } else if (progress < 0.72) {
    const local = norm(progress, SEGMENTS.laptop.start, SEGMENTS.laptop.end);
    label = local < 0.805 ? "Web" : "Social";
  } else if (progress < 0.95) {
    const local = norm(progress, SEGMENTS.monitor.start, SEGMENTS.monitor.end);
    label = local < 0.40 ? "Audio + Video" : local < 0.70 ? "Audio" : "Video";
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
    });
  });
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
    sceneLabel.textContent = name.startsWith("social") ? "Social" : "Web";
    setInteractiveScene("laptop");
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
  if (mobileMediaQuery.matches) {
    updateMobileIntro();
    updateMobileSectionNavigationState();
    return;
  }
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 0;
  applyCamera(getCameraFrame(progress));
  updateLaptop(progress);
  updateMonitor(progress);
  updateFinal(progress);
  updateLabel(progress);

  // Only one overlay may receive pointer input. This prevents invisible
  // contact links from sitting above audio, video, or social controls.
  if (progress < 0.012) setInteractiveScene("none");
  else if (progress < 0.695) setInteractiveScene("laptop");
  else if (progress < 0.735) setInteractiveScene("none");
  else if (progress < 0.958) setInteractiveScene("monitor");
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
