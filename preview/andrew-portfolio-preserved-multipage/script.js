"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const smoothBehavior = () => prefersReducedMotion.matches ? "auto" : "smooth";

const AUDIO_TRACKS = [
  {
    title: "Full Dance Mix",
    file: "assets/Full Dance Mix.mp3",
    meta: "Dance and performance editing",
    note: "Long-form pacing, musical transitions, energy shifts, and a clean competitive structure."
  },
  {
    title: "Quince Example Clips",
    file: "assets/Quince Example Clips.mp3",
    meta: "Event audio editing",
    note: "Cue timing, entrances, exits, emotional progression, and smooth transitions between moments."
  },
  {
    title: "Bourbon Bar Podcast",
    file: "assets/Bourbon Bar Podast.mp3",
    meta: "Podcast editing and mixing",
    note: "Dialogue cleanup, pacing, music balance, and a more polished listening experience."
  },
  {
    title: "Example Hip Hop Dance Mixes",
    file: "assets/Example Hip Hop Dance Mixes.mp3",
    meta: "Dance cutdowns and mashups",
    note: "Beat-matched transitions, impact moments, musical hits, and compact storytelling."
  }
];

const MUSIC_TRACKS = [
  {
    title: "Sad Singin",
    sources: ["assets/Sad Singin.mp3", "assets/Sad Singin.MP3", "audio/Sad Singin.mp3", "Sad Singin.mp3"],
    meta: "Artist recording and vocal performance"
  },
  {
    title: "El Tango de Britney",
    sources: ["assets/El Tango de Britney 8.28 w vocals.wav", "assets/El Tango de Britney 8.28 w vocals.WAV", "audio/El Tango de Britney 8.28 w vocals.wav", "El Tango de Britney 8.28 w vocals.wav"],
    meta: "Arrangement, vocals, and performance"
  },
  {
    title: "Wolverton Mountain",
    sources: ["assets/Wolverton Mountain.wav", "assets/Wolverton Mountain.WAV", "audio/Wolverton Mountain.wav", "audio/Wolverton Mountain.WAV", "Wolverton Mountain.wav", "Wolverton Mountain.WAV"],
    meta: "Bluegrass vocal performance"
  }
];


const SOCIAL_PROFILES = {
  // Add the full profile URL when ready, for example: "https://www.instagram.com/yourhandle/"
  instagram: ""
};

/* Add filenames from assets/about me gallery/ here. */
const ABOUT_GALLERY = [
  // { file: "singing-hoosiers.jpg", alt: "Andrew performing with the Singing Hoosiers", caption: "Performing with the Singing Hoosiers at Indiana University." },
];

const STUDIO_PASS_ROUTES = {
  web: {
    label: "Web and UX",
    message: "You were sent here for web and UX work.",
    target: "#projects",
    projectTab: "porchStompPanel"
  },

  content: {
    label: "Campaigns and Content",
    message: "Start with campaign strategy, content systems, and published social work.",
    target: "#socialProjects",
    campaign: "program"
  },

  audio: {
    label: "Audio Production",
    message: "Start with audio production and performance editing.",
    target: "#media",
    mediaTab: "audioStudio"
  },

  video: {
    label: "Video and Storytelling",
    message: "Start with video editing, storytelling, and social-first production.",
    target: "#media",
    mediaTab: "videoStudio"
  },

  ai: {
    label: "AI and Workflow Systems",
    message: "Explore practical AI workflows with human review built in.",
    target: "#ai",
    aiScenario: "booking"
  },

  live: {
    label: "Live Music and Performance",
    message: "Start with live performance, booking options, and musical work.",
    target: "#media",
    mediaTab: "performanceStudio"
  }
};
const AUDIENCE_PATHS = {
  student: {
    label: "Student pathway",
    title: "Build a strong foundation and make progress visible.",
    steps: [
      "Enter through workshops or Foundations of Musicianship.",
      "Develop rhythm, ear training, theory, voice, instruments, or production.",
      "Move toward recordings, performances, confidence, and community."
    ]
  },
  artist: {
    label: "Emerging artist pathway",
    title: "Turn developing work into something tangible and shareable.",
    steps: [
      "Enter through affordable recording, musicianship, or production support.",
      "Develop songs, demos, creative direction, and performance readiness.",
      "Leave with proof of growth that can support future opportunities."
    ]
  },
  adult: {
    label: "Returning adult pathway",
    title: "Come back to music without pretending you never stepped away.",
    steps: [
      "Enter through beginner-friendly learning and supportive group experiences.",
      "Rebuild musicianship, confidence, and creative habits at a realistic pace.",
      "Join recordings, performances, or community music when ready."
    ]
  },
  partner: {
    label: "School or partner pathway",
    title: "Bring a flexible music pathway into an existing community.",
    steps: [
      "Begin with the needs of the school, community space, or organization.",
      "Shape workshops, residencies, recording, or showcase activity around the group.",
      "Create visible outcomes that participants and partners can share."
    ]
  },
  donor: {
    label: "Donor or sponsor pathway",
    title: "Connect support directly to access and public outcomes.",
    steps: [
      "Understand the barriers participants face and the pathway DSG provides.",
      "Choose a level of support tied to workshops, materials, recording, or programs.",
      "See how the contribution helps turn potential into proof."
    ]
  }
};

const BUYER_ANSWERS = {
  product: ["Product hierarchy", "Lead with a clear ingredient overview, then provide the details a commercial buyer needs to evaluate fit."],
  formats: ["Format clarity", "Show available product forms, specifications, and the practical differences between them."],
  applications: ["Application-first content", "Connect each ingredient to real food and beverage uses so buyers can imagine the opportunity."],
  scale: ["Commercial credibility", "Explain sourcing, processing, traceability, and scale without burying the proof in broad brand language."],
  inquiry: ["Conversion path", "Ask for the information needed to qualify the opportunity and move the right buyers toward a useful conversation."]
};

const CAMPAIGN_GOALS = {
  program: [
    ["Goal", "Help the right people understand why the program matters."],
    ["Audience", "People who are interested but need a clear invitation."],
    ["Hook", "Open with the problem or possibility they already recognize."],
    ["Formats", "Reel, feed cut, story sequence, caption, and call to action."]
  ],
  registration: [
    ["Goal", "Move people from interest to a specific registration action."],
    ["Audience", "People with enough interest to attend, but not enough urgency to act."],
    ["Hook", "Lead with what they will experience, learn, or gain right now."],
    ["Formats", "Deadline Reel, FAQ story, testimonial cut, reminder post, and direct CTA."]
  ],
  awareness: [
    ["Goal", "Make the organization recognizable before asking for a commitment."],
    ["Audience", "People who share the values but may not know the organization yet."],
    ["Hook", "Use one memorable truth that is easy to repeat and share."],
    ["Formats", "Short-form series, founder story, visual proof, partner content, and recaps."]
  ],
  story: [
    ["Goal", "Turn mission and personality into a story people can feel."],
    ["Audience", "People who need an emotional reason to pay attention."],
    ["Hook", "Start with a human moment, tension, or transformation instead of a slogan."],
    ["Formats", "Hero video, cutdowns, quote cards, behind-the-scenes material, and long caption."]
  ]
};

const INSTAGRAM_PROJECTS = {
  "atlantic-horizontal": {
    client: "Atlantic Theater Company",
    title: "Campaign video designed for a horizontal feed placement.",
    role: "Role: campaign editing, format adaptation, pacing, and audience-focused creative.",
    url: "https://www.instagram.com/reel/Cnke46IN1EY/"
  },
  "atlantic-vertical": {
    client: "Atlantic Theater Company",
    title: "Vertical campaign creative built for the way people move through a social feed.",
    role: "Role: video editing, mobile-first pacing, message clarity, and platform adaptation.",
    url: "https://www.instagram.com/reel/CoFyIzwssNR/"
  },
  "tks-vertical": {
    client: "Terry Knickerbocker Studio",
    title: "Vertical promotional video combining performance, personality, and a clear reason to engage.",
    role: "Role: campaign editing, story structure, pacing, and social presentation.",
    url: "https://www.instagram.com/reel/CwDbBv9PD-4/"
  }
};

const AI_SCENARIOS = {
  booking: {
    kicker: "Venue research and outreach",
    title: "Rooftop Ramblers booking system",
    inputCaption: "Useful details are scattered across venue pages, Instagram, email, and an old outreach list.",
    inputCards: [
      ["Venue page", "Live music · Brooklyn"],
      ["Instagram", "Recent shows and audience"],
      ["Booking email", "booking@venue.com"],
      ["Old spreadsheet", "Last contacted 7 months ago"]
    ],
    processCaption: "The system does the repetitive gathering. Andrew still decides whether a venue is right and whether outreach should go out.",
    processSteps: ["Find likely venues", "Check fit and booking details", "Put the facts in one place", "Andrew approves outreach"],
    outputTitle: "Booking board",
    outputCaption: "A simple pipeline shows where every venue stands and what should happen next.",
    outputItems: [["Ready to pitch", "3 venues"], ["Waiting for reply", "5 venues"], ["Follow up Friday", "2 venues"]],
    outcome: "A clear booking board with a next step for every venue."
  },
  fundraising: {
    kicker: "Grant research and institutional knowledge",
    title: "Discovery Sound Garden fundraising research hub",
    inputCaption: "Grant rules, program descriptions, budgets, and old applications begin in different documents.",
    inputCards: [
      ["Grant PDF", "18 pages of guidelines"],
      ["Program notes", "Who the work serves"],
      ["Budget draft", "Costs and matching funds"],
      ["Past proposal", "Useful language and evidence"]
    ],
    processCaption: "The material is compared against the funder's rules, missing evidence is flagged, and unsupported claims remain visible for review.",
    processSteps: ["Read the rules", "Match the right program", "Flag missing proof", "Andrew decides whether to apply"],
    outputTitle: "Opportunity brief",
    outputCaption: "The final brief gives the team a fit assessment, deadline, required materials, and cited evidence.",
    outputItems: [["Fit", "Strong"], ["Deadline", "Oct 18"], ["Still needed", "Budget + partner letter"], ["Evidence", "6 cited passages"]],
    outcome: "A decision-ready opportunity brief instead of another open grant tab."
  },
  website: {
    kicker: "Audit, build, and quality control",
    title: "AI-assisted website studio",
    inputCaption: "An existing site arrives with feedback, broken paths, scattered copy, and examples of what the client likes.",
    inputCards: [
      ["Old navigation", "Too many competing paths"],
      ["Client notes", "Edits from several people"],
      ["Broken links", "Forms, buttons, and PDFs"],
      ["Reference sites", "Visual and interaction goals"]
    ],
    processCaption: "AI speeds up inventory, comparison, drafting, and code support. Andrew makes the structure, design, and quality decisions.",
    processSteps: ["Audit every page", "Map what each audience needs", "Build and refine", "Andrew tests the full experience"],
    outputTitle: "Website handoff",
    outputCaption: "The client receives a clearer site, a tested responsive build, and documentation for what comes next.",
    outputItems: [["New page map", "Approved"], ["Responsive build", "Tested"], ["Before and after", "Documented"], ["Next-step list", "Ready"]],
    outcome: "Faster iteration without giving away design judgment or quality control."
  },
  grocery: {
    kicker: "Inventory-first planning assistant",
    title: "Weekly meal reset",
    inputCaption: "The real starting point is not a blank meal calendar. It is the food already at home, the week ahead, and the energy available.",
    inputCards: [
      ["Fridge and pantry", "What is already there"],
      ["Work schedule", "When food must travel"],
      ["Dietary needs", "Lactose-free and moderate FODMAP"],
      ["Budget", "$75 for the reset"]
    ],
    processCaption: "The assistant overlaps ingredients, keeps prep realistic, and offers choices instead of locking the week into one rigid plan.",
    processSteps: ["Start with inventory", "Reuse ingredients thoughtfully", "Keep prep realistic", "Andrew chooses what sounds good"],
    outputTitle: "Meal and grocery plan",
    outputCaption: "The result is a short list of meals, work lunches, snacks, and only the groceries actually needed.",
    outputItems: [["Easy dinners", "3"], ["Work lunches", "2"], ["Quick snacks", "6"], ["Groceries to buy", "9 items"]],
    outcome: "A practical weekly reset that responds to real life."
  },
  adhd: {
    kicker: "Personal workflow design",
    title: "ADHD-friendly computer setup",
    inputCaption: "Repeated tasks, scattered downloads, forgotten routines, and too many clicks create friction before the work even starts.",
    inputCards: [
      ["Downloads folder", "Files with unclear names"],
      ["Repeated tasks", "The same setup every day"],
      ["Reminders", "Important things buried in lists"],
      ["Slow paths", "Too many steps to begin"]
    ],
    processCaption: "The workflow removes maintenance, creates obvious entry points, and adds shortcuts that match the way the person already thinks.",
    processSteps: ["Find the friction", "Remove unnecessary steps", "Create simple triggers", "Test it in actual use"],
    outputTitle: "Personal command center",
    outputCaption: "The finished setup gives the user a few dependable ways to start, recover, and keep moving.",
    outputItems: [["Morning reset", "One click"], ["File routing", "Automatic"], ["Voice task capture", "Ready"], ["Recovery button", "Always visible"]],
    outcome: "The computer becomes easier to enter, maintain, and recover."
  }
};

let currentAudioTrackIndex = 0;
let currentMusicTrackIndex = 0;
let aiApprovalTimers = [];

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function setPressedGroup(buttons, activeButton) {
  buttons.forEach(button => {
    const isActive = button === activeButton;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function setupNavigation() {
  const header = qs("#siteHeader");
  const menuToggle = qs("#menuToggle");
  const nav = qs("#siteNav");
  if (!header || !nav) return;

  const navLinks = qsa("a", nav);
  let lastScrollY = window.scrollY;
  let accumulatedDelta = 0;

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    header.classList.remove("nav-hidden");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const showHeader = () => header.classList.remove("nav-hidden");

  const updateHeader = () => {
    const current = Math.max(0, window.scrollY);
    const delta = current - lastScrollY;
    header.classList.toggle("scrolled", current > 24);
    document.body.classList.toggle("show-doon", current > window.innerHeight * 0.6);

    if (Math.sign(delta) !== Math.sign(accumulatedDelta)) accumulatedDelta = delta;
    else accumulatedDelta += delta;

    const navHasFocus = header.contains(document.activeElement);
    const menuOpen = nav.classList.contains("open");

    if (!navHasFocus && !menuOpen && current > 180 && accumulatedDelta > 42) {
      header.classList.add("nav-hidden");
      accumulatedDelta = 0;
    } else if (delta < 0 && accumulatedDelta < -14) {
      showHeader();
      accumulatedDelta = 0;
    } else if (current < 80) {
      showHeader();
    }

    lastScrollY = current;
  };

  header.addEventListener("focusin", showHeader);
  document.addEventListener("pointermove", event => {
    if (event.clientY < 26) showHeader();
  }, { passive: true });

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const sections = qsa("main section[id]");
  const hashLinks = navLinks.filter(link => link.getAttribute("href")?.startsWith("#"));
  if (hashLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      hashLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.2, 0.5] });
    sections.forEach(section => observer.observe(section));
  }
}

function setupDoon() {
  const button = qs("#doonGuide");
  if (!button) return;
  const image = qs("img", button);
  if (!image) return;

  let resetTimer;
  const show = source => { if (source) image.src = source; };
  const idle = () => show(image.dataset.idleSrc);
  const wave = () => show(image.dataset.waveSrc);

  button.addEventListener("mouseenter", wave);
  button.addEventListener("focus", wave);
  button.addEventListener("mouseleave", idle);
  button.addEventListener("blur", idle);
  button.addEventListener("click", () => {
    window.clearTimeout(resetTimer);
    show(image.dataset.jumpSrc);
    if (document.body.dataset.page === "home") {
      window.scrollTo({ top: 0, behavior: smoothBehavior() });
      resetTimer = window.setTimeout(idle, 760);
    } else {
      window.setTimeout(() => { window.location.href = "index.html#home"; }, 280);
    }
  });
}

function installAssetFallbacks() {
  qsa("img[data-fallback-label]").forEach(image => {
    const replaceImage = () => {
      const placeholder = document.createElement("div");
      placeholder.className = "asset-placeholder";
      placeholder.textContent = image.dataset.fallbackLabel || "ADD ASSET";
      image.replaceWith(placeholder);
    };
    if (image.complete && image.naturalWidth === 0) replaceImage();
    else image.addEventListener("error", replaceImage, { once: true });
  });
}

function setupProjectTabs() {
  const buttons = qsa("[data-project-tab]");
  const panels = qsa(".browser-panel");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setPressedGroup(buttons, button);
      panels.forEach(panel => {
        const active = panel.id === button.dataset.projectTab;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
});
  });
}

function setupTransformationPlayers() {
  qsa("[data-transform-player]").forEach(player => {
    const controls = qsa("[data-transform]", player);
    const stages = qsa(".transform-stage", player);
    const url = qs("#porchBrowserUrl", player);
    const labels = {
      "porch-before-home": "porchstomp.com, before",
      "porch-current-home": "porchstomp.com, current homepage",
      "porch-before-stages": "porchstomp.com/stages, before",
      "porch-current-lineup": "porchstomp.com/line-up, current"
    };

    controls.forEach(control => {
      control.addEventListener("click", () => {
        setPressedGroup(controls, control);
        stages.forEach(stage => stage.classList.toggle("active", stage.id === control.dataset.transform));
        if (url) url.textContent = labels[control.dataset.transform] || "porchstomp.com";
      });
    });
  });
}

function setupAudienceSelector() {
  const buttons = qsa("[data-audience]");
  const output = qs("#audienceOutput");
  if (!output) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const data = AUDIENCE_PATHS[button.dataset.audience];
      if (!data) return;
      setPressedGroup(buttons, button);
      output.innerHTML = `
        <small>${data.label}</small>
        <h4>${data.title}</h4>
        <ol>${data.steps.map(step => `<li>${step}</li>`).join("")}</ol>`;
    });
  });
}

function setupBuyerSelector() {
  const buttons = qsa("[data-buyer]");
  const answer = qs("#buyerAnswer");
  if (!answer) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const data = BUYER_ANSWERS[button.dataset.buyer];
      if (!data) return;
      setPressedGroup(buttons, button);
      answer.innerHTML = `<strong>${data[0]}</strong><span>${data[1]}</span>`;
    });
  });
}

function setupCampaignPlanner() {
  const buttons = qsa("[data-campaign]");
  const flow = qs("#campaignFlow");
  if (!flow) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const data = CAMPAIGN_GOALS[button.dataset.campaign];
      if (!data) return;
      setPressedGroup(buttons, button);
      flow.innerHTML = data.map(item => `<article><small>${item[0]}</small><strong>${item[1]}</strong></article>`).join("");
    });
  });
}

function createInstagramEmbed(project) {
  const blockquote = document.createElement("blockquote");
  blockquote.className = "instagram-media";
  blockquote.setAttribute("data-instgrm-captioned", "");
  blockquote.setAttribute("data-instgrm-permalink", `${project.url}?utm_source=ig_embed&utm_campaign=loading`);
  blockquote.setAttribute("data-instgrm-version", "14");
  blockquote.style.background = "#fff";
  blockquote.style.border = "0";
  blockquote.style.borderRadius = "12px";
  blockquote.style.margin = "0";
  blockquote.style.minWidth = "326px";
  blockquote.style.width = "100%";
  blockquote.innerHTML = `<div class="instagram-fallback-card"><small>Published campaign work</small><strong>${project.client}</strong><span>${project.title}</span><em>Open the original post with the link beside this preview.</em></div>`;
  return blockquote;
}

function loadInstagramProject(key) {
  const project = INSTAGRAM_PROJECTS[key];
  const wrap = qs("#instagramEmbedWrap");
  if (!project || !wrap) return;

  qs("#instagramClient").textContent = project.client;
  qs("#instagramTitle").textContent = project.title;
  qs("#instagramRole").textContent = project.role;
  qs("#instagramFallback").href = project.url;

  wrap.replaceChildren(createInstagramEmbed(project));
  if (window.instgrm?.Embeds?.process) {
    window.instgrm.Embeds.process();
  } else {
    window.setTimeout(() => window.instgrm?.Embeds?.process?.(), 1000);
  }
}

function setupInstagramSelector() {
  const buttons = qsa("[data-instagram]");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setPressedGroup(buttons, button);
      loadInstagramProject(button.dataset.instagram);
    });
  });
  loadInstagramProject("atlantic-horizontal");
}

function setupMonitorTabs() {
  const buttons = qsa("[data-monitor-tab]");
  const panels = qsa(".monitor-panel");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setPressedGroup(buttons, button);
      panels.forEach(panel => {
        const active = panel.id === button.dataset.monitorTab;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
      if (button.dataset.monitorTab !== "videoStudio") qs("#portfolioVideo")?.pause();
    });
  });
}

function setupToolLogoFallbacks() {
  qsa(".tool-logo-grid img").forEach(image => {
    image.addEventListener("error", () => {
      const label = image.closest("article")?.querySelector("span:last-child")?.textContent?.trim() || "Tool";
      const fallback = document.createElement("span");
      fallback.className = "tool-lettermark generated-lettermark";
      fallback.textContent = label.split(/\s+/).map(word => word[0]).join("").slice(0, 4).toUpperCase();
      image.replaceWith(fallback);
    }, { once: true });
  });
}

function setupSceneTargets() {
  qsa("[data-open-media-tab]").forEach(link => {
    link.addEventListener("click", () => {
      const tabId = link.dataset.openMediaTab;
      window.setTimeout(() => {
        qs(`[data-monitor-tab="${tabId}"]`)?.click();
      }, prefersReducedMotion.matches ? 0 : 450);
    });
  });
}

function createWaveform() {
  const waveform = qs("#waveform");
  if (!waveform) return;
  const barCount = window.matchMedia("(max-width: 760px)").matches
    ? 44
    : window.matchMedia("(max-width: 1100px)").matches
      ? 62
      : 84;
  const fragment = document.createDocumentFragment();
  waveform.replaceChildren();
  for (let index = 0; index < barCount; index += 1) {
    const bar = document.createElement("i");
    const height = 18 + ((index * 37) % 72) + (Math.sin(index * 0.75) + 1) * 12;
    bar.style.height = `${Math.min(100, height)}%`;
    fragment.append(bar);
  }
  waveform.append(fragment);
}

function setupAudio() {
  const audio = qs("#audioElement");
  const list = qs("#audioTrackList");
  const studioTitle = qs("#audioTrackTitle");
  const studioMeta = qs("#audioTrackMeta");
  const studioNote = qs("#audioEditorNote strong");
  const studioPlay = qs("#audioPlay");
  const studioPrevious = qs("#audioPrevious");
  const studioNext = qs("#audioNext");
  const studioProgress = qs("#audioProgress");
  const studioCurrent = qs("#audioCurrent");
  const studioDuration = qs("#audioDuration");

  if (!audio || !list) return;

  const createTrackButton = (track, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.audioTrackIndex = String(index);
    button.innerHTML = `${String(index + 1).padStart(2, "0")} / ${track.title}`;
    button.addEventListener("click", () => loadTrack(index, true));
    return button;
  };

  AUDIO_TRACKS.forEach((track, index) => {
    list.append(createTrackButton(track, index));
  });

  function updateActiveButtons() {
    qsa("[data-audio-track-index]").forEach(button => {
      button.classList.toggle("active", Number(button.dataset.audioTrackIndex) === currentAudioTrackIndex);
    });
  }

  function loadTrack(index, shouldPlay = false) {
    currentAudioTrackIndex = (index + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    const track = AUDIO_TRACKS[currentAudioTrackIndex];
    audio.src = track.file;
    studioTitle.textContent = track.title;
    studioMeta.textContent = track.meta;
    studioNote.textContent = track.note;
    studioProgress.value = "0";
    studioCurrent.textContent = "0:00";
    updateActiveButtons();
    if (shouldPlay) audio.play().catch(() => {});
  }

  function toggleAudio() {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

 function updatePlayState() {
  const playing = !audio.paused;

  studioPlay.classList.toggle("is-playing", playing);
  studioPlay.setAttribute(
    "aria-label",
    playing ? "Pause audio" : "Play audio"
  );
}

  audio.addEventListener("loadedmetadata", () => {
    studioDuration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    studioProgress.value = String(percent);
    studioCurrent.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("play", () => {
    qs("#portfolioVideo")?.pause();
    qs("#musicPlayerAudio")?.pause();
    updatePlayState();
  });
  audio.addEventListener("pause", updatePlayState);
  audio.addEventListener("ended", () => loadTrack(currentAudioTrackIndex + 1, true));
  audio.addEventListener("error", () => {
    studioNote.textContent = "Audio file not found. Confirm the filename in assets or update AUDIO_TRACKS in script.js.";
  });

  studioProgress.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (Number(studioProgress.value) / 100) * audio.duration;
  });

  [studioPlay].forEach(button => button?.addEventListener("click", toggleAudio));
  [studioPrevious].forEach(button => button?.addEventListener("click", () => loadTrack(currentAudioTrackIndex - 1, true)));
  [studioNext].forEach(button => button?.addEventListener("click", () => loadTrack(currentAudioTrackIndex + 1, true)));

  loadTrack(0, false);
}

function setupMusicPlayer() {
  const player = qs("#musicPlayer");
  const audio = qs("#musicPlayerAudio");
  const close = qs("#closeMusicPlayer");
  const openButtons = qsa("[data-open-player]");
  const deskButton = qs("#openMusicFromDesk");
  const playlist = qs("#playerPlaylist");
  const playerTitle = qs("#playerTrackTitle");
  const playerMeta = qs("#playerTrackMeta");
  const playerProgress = qs("#playerProgressBar");
  const playerCurrent = qs("#playerCurrentTime");
  const playerDuration = qs("#playerDuration");
  const playerPlay = qs("#playerPlay");
  const playerCenter = qs("#playerCenter");
  const playerPrevious = qs("#playerPrevious");
  const playerNext = qs("#playerNext");
  const playerMenu = qs("#playerMenu");
  const menuView = qs("#ipodMenuView");
  const nowView = qs("#ipodNowView");
  const backToMenu = qs("#ipodBackToMenu");
  const workspaceNowPlaying = qs("#workspaceNowPlaying");
  if (!player || !audio || !playlist || !menuView || !nowView) return;

  let selectedIndex = 0;
  let sourceIndex = 0;
  let currentTrack = MUSIC_TRACKS[0];
  let attemptedPlay = false;

  function setView(view) {
    const now = view === "now";
    menuView.hidden = now;
    nowView.hidden = !now;
  }

  function createTrackButton(track, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.musicTrackIndex = String(index);
    button.innerHTML = `
  <strong>${track.title}</strong>
  <span class="icon-chevron-right" aria-hidden="true"></span>
`;
    button.addEventListener("click", () => {
      selectedIndex = index;
      loadTrack(index, true);
    });
    return button;
  }

  MUSIC_TRACKS.forEach((track, index) => {
    const item = document.createElement("li");
    item.append(createTrackButton(track, index));
    playlist.append(item);
  });

  function updateSelection() {
    qsa("[data-music-track-index]").forEach(button => {
      const active = Number(button.dataset.musicTrackIndex) === selectedIndex;
      button.classList.toggle("selected", active);
      button.classList.toggle("active", Number(button.dataset.musicTrackIndex) === currentMusicTrackIndex);
      if (active && player.classList.contains("open")) button.scrollIntoView({ block: "nearest" });
    });
  }

  function setSource(track, index = 0) {
    sourceIndex = index;
    const source = track.sources?.[sourceIndex];
    if (!source) {
      playerMeta.textContent = "Audio file not found. Confirm the song filename in the assets folder.";
      return false;
    }
    audio.src = source;
    audio.load();
    return true;
  }

  function loadTrack(index, shouldPlay = false) {
    currentMusicTrackIndex = (index + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    selectedIndex = currentMusicTrackIndex;
    currentTrack = MUSIC_TRACKS[currentMusicTrackIndex];
    attemptedPlay = shouldPlay;
    playerTitle.textContent = currentTrack.title;
    playerMeta.textContent = currentTrack.meta;
    if (workspaceNowPlaying) workspaceNowPlaying.textContent = currentTrack.title;
    playerProgress.style.width = "0%";
    playerCurrent.textContent = "0:00";
    playerDuration.textContent = "0:00";
    setSource(currentTrack, 0);
    updateSelection();
    setView("now");
    if (shouldPlay) audio.play().catch(() => {});
  }

  function moveSelection(direction) {
    if (!menuView.hidden) {
      selectedIndex = (selectedIndex + direction + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
      updateSelection();
    } else {
      loadTrack(currentMusicTrackIndex + direction, true);
    }
  }

  function toggleAudio() {
    if (menuView.hidden === false) {
      loadTrack(selectedIndex, true);
      return;
    }
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  function updatePlayState() {
  const playing = !audio.paused;

  playerPlay.classList.toggle("is-playing", playing);
  playerPlay.setAttribute(
    "aria-label",
    playing ? "Pause music" : "Play music"
  );
}

  const openPlayer = () => {
    player.classList.add("open");
    player.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setView("menu");
    updateSelection();
    close?.focus();
  };

  const closePlayer = () => {
    player.classList.remove("open");
    player.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  audio.addEventListener("loadedmetadata", () => {
    playerDuration.textContent = formatTime(audio.duration);
    if (attemptedPlay && audio.paused) audio.play().catch(() => {});
  });

  audio.addEventListener("timeupdate", () => {
    const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    playerProgress.style.width = `${percent}%`;
    playerCurrent.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("play", () => {
    qs("#audioElement")?.pause();
    qs("#portfolioVideo")?.pause();
    attemptedPlay = false;
    updatePlayState();
  });
  audio.addEventListener("pause", updatePlayState);
  audio.addEventListener("ended", () => loadTrack(currentMusicTrackIndex + 1, true));
  audio.addEventListener("error", () => {
    if (sourceIndex + 1 < (currentTrack.sources?.length || 0)) {
      setSource(currentTrack, sourceIndex + 1);
      if (attemptedPlay) audio.play().catch(() => {});
      return;
    }
    playerMeta.textContent = "Audio file not found. Add the song to assets using the exact filename listed in README-FIRST.txt.";
  });

  openButtons.forEach(button => button.addEventListener("click", openPlayer));
  deskButton?.addEventListener("click", openPlayer);
  close?.addEventListener("click", closePlayer);
  backToMenu?.addEventListener("click", () => setView("menu"));
  playerMenu?.addEventListener("click", () => setView("menu"));
  playerPrevious?.addEventListener("click", () => moveSelection(-1));
  playerNext?.addEventListener("click", () => moveSelection(1));
  [playerPlay, playerCenter].forEach(button => button?.addEventListener("click", toggleAudio));

  player.addEventListener("click", event => {
    if (event.target === player) closePlayer();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && player.classList.contains("open")) closePlayer();
  });

  currentTrack = MUSIC_TRACKS[0];
  setSource(currentTrack, 0);
  updateSelection();
  setView("menu");
}

function setupVideoProjects() {
  const video = qs("#portfolioVideo");
  const source = qs("source", video);
  const title = qs("#videoProjectTitle");
  const note = qs("#videoProjectNote");
  const buttons = qsa("[data-video-src]");
  if (!video || !source) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setPressedGroup(buttons, button);
      video.pause();
      source.src = button.dataset.videoSrc;
      video.poster = button.dataset.videoPoster || "";
      title.textContent = button.dataset.videoTitle || "Selected video";
      note.textContent = button.dataset.videoNote || "";
      video.load();
    });
  });

  video.addEventListener("play", () => qs("#audioElement")?.pause());
  video.addEventListener("error", () => {
    note.textContent = "Video file not found. Confirm the filename in assets or update data-video-src in index.html.";
  });
}

function setupYouTubeSelector() {
  const buttons = qsa("[data-youtube]");
  const player = qs("#youtubePlayer");
  const directLink = qs("#youtubeDirectLink");
  if (!player) return;

  function buildEmbedUrl(videoId) {
    const params = new URLSearchParams({
      playsinline: "1",
      rel: "0"
    });

    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      params.set("origin", window.location.origin);
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  function loadVideo(button) {
    const videoId = button.dataset.youtube;
    if (!videoId) return;

    setPressedGroup(buttons, button);
    qs("#audioElement")?.pause();
    player.src = buildEmbedUrl(videoId);
    player.title = button.dataset.youtubeTitle || "Andrew Wolverton performance";

    if (directLink) {
      directLink.href = `https://www.youtube.com/watch?v=${videoId}`;
      directLink.setAttribute("aria-label", `Watch ${player.title} on YouTube`);
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => loadVideo(button));
  });

  if (buttons[0]) loadVideo(buttons[0]);
}

function clearAiTimers() {
  aiApprovalTimers.forEach(timer => window.clearTimeout(timer));
  aiApprovalTimers = [];
}

function renderAiScenario(key) {
  const data = AI_SCENARIOS[key];
  const demo = qs("#aiDemonstration");
  if (!data || !demo) return;

  clearAiTimers();
  qs("#aiDemoKicker").textContent = data.kicker;
  qs("#aiDemoTitle").textContent = data.title;
  qs("#aiInputCaption").textContent = data.inputCaption;
  qs("#aiProcessCaption").textContent = data.processCaption;
  qs("#aiOutputCaption").textContent = data.outputCaption;
  qs("#aiOutcome").textContent = data.outcome;

  qs("#aiInputVisual").innerHTML = `
    <div class="ai-messy-stack">
      ${data.inputCards.map((card, index) => `
        <article style="--stack-index:${index}">
          <small>${card[0]}</small>
          <strong>${card[1]}</strong>
        </article>`).join("")}
    </div>`;

  qs("#aiProcessVisual").innerHTML = `
    <div class="ai-process-lane">
      ${data.processSteps.map((step, index) => `
        <article class="${index === data.processSteps.length - 1 ? "human-step" : ""}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${step}</strong>
        </article>`).join("")}
    </div>`;

  qs("#aiOutputVisual").innerHTML = `
    <div class="ai-output-preview">
      <header><i></i><i></i><i></i><strong>${data.outputTitle}</strong></header>
      <div>
        ${data.outputItems.map(item => `<article><span>${item[0]}</span><strong>${item[1]}</strong></article>`).join("")}
      </div>
    </div>`;

  const progress = qs("#aiProgressBar");
  if (progress) progress.style.width = "0%";

  qsa(".ai-process-lane article", demo).forEach((step, index, steps) => {
    const timer = window.setTimeout(() => {
      step.classList.add("completed");
      if (progress) progress.style.width = `${Math.round(((index + 1) / steps.length) * 100)}%`;
    }, prefersReducedMotion.matches ? 0 : 230 * (index + 1));
    aiApprovalTimers.push(timer);
  });
}

function setupAiScenarios() {
  const buttons = qsa("[data-ai-scenario]");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setPressedGroup(buttons, button);
      renderAiScenario(button.dataset.aiScenario);
});
  });
  renderAiScenario("booking");
}

function setupProcessShowcase() {
  const buttons = qsa("[data-process-stage]");
  const panels = qsa("[data-process-panel]");
  if (!buttons.length || !panels.length) return;
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const stage = button.dataset.processStage;
      setPressedGroup(buttons, button);
      panels.forEach(panel => {
        const active = panel.dataset.processPanel === stage;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    });
  });
}

function setupServiceChoices() {
  const projectType = qs("#contactProjectType");
  qsa("[data-service-choice]").forEach(link => {
    link.addEventListener("click", () => {
      if (projectType) projectType.value = link.dataset.serviceChoice || "";
    });
  });
}

function setupContact() {
  const typeButtons = qsa("[data-contact-type]");
  const typeInput = qs("#contactProjectType");
  const form = qs("#contactForm");
  const note = qs("#contactFormNote");
  const submitButton = qs('button[type="submit"]', form);

  typeButtons.forEach(button => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      typeButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      typeInput.value = button.dataset.contactType;
      typeInput.focus();
    });
  });

  form?.addEventListener("submit", async event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const originalLabel = submitButton?.textContent || "Send inquiry";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    note.classList.remove("is-success", "is-error");
    note.textContent = "Sending your message...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === "false") {
        throw new Error(result.message || "The form could not be submitted.");
      }

      form.reset();
      typeButtons.forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-selected", "false");
      });

      note.classList.add("is-success");
      note.textContent = "Thanks. Your message has been sent to Andrew.";
    } catch (error) {
      note.classList.add("is-error");
      note.innerHTML = 'The form did not send. Email <a href="mailto:anwolver@gmail.com">anwolver@gmail.com</a> directly.';
      console.error(error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });
}

function setupWorkspaceTransition() {
  const triggers = qsa("[data-enter-workspace]");
  const workspace = qs("#workspace");
  const laptopHotspot = qs(".scene-target-laptop-trackpad");
  if (!triggers.length || !workspace) return;

  triggers.forEach(trigger => {
    trigger.addEventListener("click", event => {
      if (prefersReducedMotion.matches || !document.body.animate) return;

      event.preventDefault();
      const source = trigger.classList.contains("scene-target-laptop-trackpad") ? trigger : laptopHotspot || trigger;
      const rect = source.getBoundingClientRect();
      const transition = document.createElement("div");
      transition.className = "workspace-screen-transition";
      transition.innerHTML = '<span>AW</span>';
      Object.assign(transition.style, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${Math.max(rect.width, 80)}px`,
        height: `${Math.max(rect.height, 56)}px`
      });
      document.body.append(transition);

      const animation = transition.animate([
        { left: `${rect.left}px`, top: `${rect.top}px`, width: `${Math.max(rect.width, 80)}px`, height: `${Math.max(rect.height, 56)}px`, borderRadius: "28px", opacity: 0.15 },
        { left: "0px", top: "0px", width: "100vw", height: "100vh", borderRadius: "0px", opacity: 1 }
      ], {
        duration: 620,
        easing: "cubic-bezier(.2,.78,.2,1)",
        fill: "forwards"
      });

      animation.finished.then(() => {
        workspace.scrollIntoView({ behavior: "auto", block: "start" });
        return transition.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 190,
          easing: "ease-out",
          fill: "forwards"
        }).finished;
      }).finally(() => transition.remove());
    });
  });
}

function setupMiscellaneous() {
  const year = qs("#currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
  qs("#playerMenu")?.addEventListener("click", () => qs("#playerPlaylist")?.scrollIntoView({ behavior: smoothBehavior(), block: "nearest" }));
}


function setupExpandableToolkit() {
  const groups = qsa("#toolkit details.tool-group");
  if (!groups.length) return;

  const mobileQuery = window.matchMedia("(max-width: 760px)");
  let syncing = false;

  const syncForViewport = () => {
    syncing = true;
    groups.forEach((group, index) => {
      group.open = mobileQuery.matches ? index === 0 : true;
    });
    syncing = false;
  };

  groups.forEach(group => {
    group.addEventListener("toggle", () => {
      if (syncing || !mobileQuery.matches || !group.open) return;
      groups.forEach(other => {
        if (other !== group) other.open = false;
      });
    });
  });

  syncForViewport();
  mobileQuery.addEventListener?.("change", syncForViewport);
}

function setupMobilePortfolioFixes() {
  const isMobile = window.matchMedia("(max-width: 760px)");
  const header = qs("#siteHeader");
  const menu = qs("#siteNav");
  const menuToggle = qs("#menuToggle");
  const player = qs("#musicPlayer");
  const doon = qs("#doonGuide");

  const syncOverlayState = () => {
    const menuOpen = Boolean(menu?.classList.contains("open"));
    const playerOpen = Boolean(player?.classList.contains("open") || player?.getAttribute("aria-hidden") === "false");
    document.body.classList.toggle("mobile-overlay-open", isMobile.matches && (menuOpen || playerOpen));
    if (doon) doon.setAttribute("aria-hidden", String(isMobile.matches && (menuOpen || playerOpen)));
  };

  menuToggle?.addEventListener("click", () => window.requestAnimationFrame(syncOverlayState));
  menu?.addEventListener("click", event => {
    if (event.target.closest("a")) window.requestAnimationFrame(syncOverlayState);
  });

  if (player) {
    new MutationObserver(syncOverlayState).observe(player, { attributes: true, attributeFilter: ["class", "aria-hidden"] });
  }

  const normalizeViewport = () => {
    document.documentElement.style.setProperty("--mobile-vh", `${window.innerHeight * 0.01}px`);
    syncOverlayState();
  };
  normalizeViewport();
  window.addEventListener("resize", normalizeViewport, { passive: true });
  window.addEventListener("orientationchange", () => window.setTimeout(normalizeViewport, 180), { passive: true });

  document.querySelectorAll(".text-link span, .scene-projection i, .audio-main-control, .youtube-direct-link span").forEach(node => {
    node.textContent = node.textContent.replace(/↗/g, "↗︎").replace(/▶/g, "▶︎");
  });
}
function setupStudioPass() {
  const params = new URLSearchParams(window.location.search);
  const requestedFocus = params.get("focus")?.trim().toLowerCase();
  const route = STUDIO_PASS_ROUTES[requestedFocus];

  if (!route) return;

  const pass = qs("#studioPass");
  const title = qs("#studioPassTitle");
  const message = qs("#studioPassMessage");
  const startLink = qs("#studioPassStart");
  const closeButton = qs("#studioPassClose");
  const exploreAllButton = qs("#studioPassExploreAll");
  const target = qs(route.target);

  if (!pass || !title || !message || !startLink || !target) return;

  document.body.dataset.studioPass = requestedFocus;

  title.textContent = route.label;
  message.textContent = route.message;
  startLink.href = route.target;

  document.title = `${route.label} Studio Pass | Andrew Wolverton`;

  pass.hidden = false;

  target.classList.add("studio-pass-target");
  target.dataset.studioPassLabel = route.label;

  /*
   * Activate the relevant project, campaign, media,
   * or AI view before scrolling to it.
   */

  if (route.projectTab) {
    qs(`[data-project-tab="${route.projectTab}"]`)?.click();
  }

  if (route.campaign) {
    qs(`[data-campaign="${route.campaign}"]`)?.click();
  }

  if (route.mediaTab) {
    qs(`[data-monitor-tab="${route.mediaTab}"]`)?.click();
  }

  if (route.aiScenario) {
    qs(`[data-ai-scenario="${route.aiScenario}"]`)?.click();
  }

  const scrollToTarget = () => {
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const offset = mobile ? 178 : 164;
    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      offset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  };

  window.setTimeout(scrollToTarget, 280);

  startLink.addEventListener("click", event => {
    event.preventDefault();
    scrollToTarget();
  });

  closeButton?.addEventListener("click", () => {
    pass.hidden = true;
  });

  exploreAllButton?.addEventListener("click", () => {
    const cleanUrl = new URL(window.location.href);

    cleanUrl.searchParams.delete("focus");
    cleanUrl.hash = "";

    window.history.replaceState({}, "", cleanUrl);

    delete document.body.dataset.studioPass;

    target.classList.remove("studio-pass-target");
    delete target.dataset.studioPassLabel;

    pass.hidden = true;

    const defaultTarget = qs("#projects") || qs("#home") || qs("main");
    defaultTarget?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });

    document.title = document.body.dataset.page === "projects"
      ? "Projects | Andrew Wolverton"
      : "Andrew Wolverton | Creative Studio";
  });
}



function redirectLegacyStudioPass() {
  const focus = new URLSearchParams(window.location.search).get("focus");
  if (!focus || document.body.dataset.page === "projects") return false;
  const allowed = new Set(Object.keys(STUDIO_PASS_ROUTES));
  if (!allowed.has(focus.toLowerCase())) return false;
  window.location.replace(`projects.html?focus=${encodeURIComponent(focus.toLowerCase())}`);
  return true;
}

function setupSocialProfiles() {
  qsa("[data-social-profile]").forEach(link => {
    const key = link.dataset.socialProfile;
    const url = SOCIAL_PROFILES[key];
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.classList.remove("instagram-placeholder");
      link.title = "";
      return;
    }
    link.addEventListener("click", event => {
      event.preventDefault();
      window.alert("Add your Instagram profile URL once in the SOCIAL_PROFILES block near the top of script.js.");
    });
  });
}

function setupTheme() {
  const button = qs("#themeToggle");
  if (!button) return;
  const root = document.documentElement;
  const apply = theme => {
    root.dataset.theme = theme;
    localStorage.setItem("andrewTheme", theme);
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  };
  apply(root.dataset.theme === "dark" ? "dark" : "light");
  button.addEventListener("click", () => apply(root.dataset.theme === "dark" ? "light" : "dark"));
}

function setupAboutGallery() {
  const gallery = qs("#aboutGallery");
  if (!gallery || !Array.isArray(ABOUT_GALLERY) || !ABOUT_GALLERY.length) return;
  gallery.innerHTML = "";
  ABOUT_GALLERY.forEach(item => {
    if (!item?.file) return;
    const figure = document.createElement("figure");
    figure.className = "about-gallery-card";
    const image = document.createElement("img");
    image.loading = "lazy";
    image.src = `assets/about me gallery/${item.file}`;
    image.alt = item.alt || item.caption || "Andrew Wolverton portfolio moment";
    const caption = document.createElement("figcaption");
    caption.textContent = item.caption || item.alt || item.file;
    figure.append(image, caption);
    gallery.append(figure);
  });
}

function setupPageDeepLinks() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = qs(hash);
  if (!target) return;
  window.setTimeout(() => target.scrollIntoView({ behavior: smoothBehavior(), block: "start" }), 120);
}

function init() {
  if (redirectLegacyStudioPass()) return;
  setupTheme();
  setupSocialProfiles();
  setupNavigation();
  setupDoon();
  setupWorkspaceTransition();
  installAssetFallbacks();
  setupProjectTabs();
  setupTransformationPlayers();
  setupAudienceSelector();
  setupBuyerSelector();
  setupCampaignPlanner();
  setupInstagramSelector();
  setupMonitorTabs();
  setupSceneTargets();
  setupToolLogoFallbacks();
  setupExpandableToolkit();
  createWaveform();
  setupAudio();
  setupMusicPlayer();
  setupVideoProjects();
  setupYouTubeSelector();
  setupAiScenarios();
  setupProcessShowcase();
  setupServiceChoices();
  setupContact();
  setupMiscellaneous();
  setupMobilePortfolioFixes();
  setupStudioPass();
  setupAboutGallery();
  setupPageDeepLinks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
