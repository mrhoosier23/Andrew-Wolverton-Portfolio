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
    title: "Sad Singin' & Slow Ridin'",
    sources: ["assets/Sad Singin' & Slow Ridin'.wav"],
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
  // Add the full profile URL when ready, for example: "https://www.instagram.com/mr.hoosiermusic/"
  instagram: ""
};

/* About gallery filenames are maintained in the single list below. */
const ABOUT_GALLERY = [
  {
    src: "assets/about me gallery/IU Football.jpg",
    title: "Indiana University beginnings",
    alt: "Andrew and friends at an Indiana University football game",
    caption: "Indiana University and the Singing Hoosiers were where performance, community, and long-term creative relationships first came together.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/SHAC.jpg",
    title: "Singing Hoosiers alumni leadership",
    alt: "Andrew with the Singing Hoosiers Alumni Council and university leaders",
    caption: "Alumni service grew from communications into fundraising, governance, relationship-building, and organizational leadership.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Speedway Jeff Band Photo.jpg",
    title: "Bands, festivals, and community stages",
    alt: "Andrew and a band onstage at a community festival",
    caption: "Bands and community performances kept the work social, practical, and connected to the people in the room.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Musical Performance 1.jpg",
    title: "Performance as a working language",
    alt: "Andrew performing in a musical theatre production",
    caption: "Performing taught me timing, presence, preparation, and how to adjust when the room gives you new information.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Leadership Lafayette.JPG",
    title: "Arts leadership in community",
    alt: "Andrew receiving recognition through Leadership Lafayette",
    caption: "In Lafayette, teaching and theatre work expanded into civic leadership, partnerships, and programs built with the community around them.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Musical Performance 2.jpg",
    title: "Ensemble work",
    alt: "Andrew performing in an ensemble musical theatre scene",
    caption: "Theatre-making is collaborative systems work. Every cue, role, handoff, and relationship affects what the audience experiences.",
    layout: "portrait"
  },
  {
    src: "assets/about me gallery/teacher.png",
    title: "Teaching theatre and building programs",
    alt: "Andrew teaching theatre and drama students",
    caption: "Teaching theatre and choir made communication, structure, empathy, and practical problem-solving part of the work every day.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Ken Davenport and Andrew.jpg",
    title: "Learning the producing business",
    alt: "Andrew with Broadway producer Ken Davenport",
    caption: "Commercial theatre sharpened my understanding of how creative ideas, audiences, marketing, and production decisions fit together.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Kathleen Turner.jpg",
    title: "Associate producing in New York",
    alt: "Program and Playbill for Kathleen Turner Finding My Voice",
    caption: "Serving as an Associate Producer for Kathleen Turner: Finding My Voice at Town Hall connected arts management training to professional New York producing.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/CMU Graduation.jpg",
    title: "Carnegie Mellon graduation",
    alt: "Andrew with his Carnegie Mellon Heinz College graduating class",
    caption: "Earning an MA in Arts Management brought fundraising, strategy, leadership, and organizational systems into the same creative practice.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Performance Blurry.jpg",
    title: "A practice that stays live",
    alt: "Andrew performing guitar and harmonica with other musicians",
    caption: "Live music continues to shape how I think about rhythm, clarity, responsiveness, and participation.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Musical Performance 3.jpg",
    title: "Building the room around the work",
    alt: "A theatrical ensemble posed together in costume",
    caption: "Directing and producing means creating enough structure for a full group of people to do ambitious work together.",
    layout: "wide"
  },
  {
    src: "assets/about me gallery/Performance Blurry 2.jpg",
    title: "Music in real rooms",
    alt: "Andrew playing harmonica during a crowded live performance",
    caption: "Playing in busy rooms keeps the work grounded in audience energy, spontaneity, and connection.",
    layout: "wide"
  }
];
const PORTFOLIO_ROUTES = {
  "EVID-WEB-ARTS": {
    label: "Web and UX for arts and community audiences",
    legacyFocus: "web",
    message: "Start with Porch Stomp to see clearer festival information, mobile visitor paths, and a public-facing system designed to grow.",
    projectTarget: "#projects",
    serviceTarget: "#creativeRescue",
    projectTab: "porchStompPanel"
  },
  "EVID-WEB-B2B": {
    label: "B2B buyer journeys and web clarity",
    legacyFocus: "web",
    message: "Start with Yolélé Ingredients to see how product information, sourcing, applications, and inquiry paths were organized for commercial buyers.",
    projectTarget: "#projects",
    serviceTarget: "#creativeRescue",
    projectTab: "yolelePanel"
  },
  "EVID-NONPROFIT": {
    label: "Nonprofit building and audience systems",
    legacyFocus: "web",
    message: "Start with Discovery Sound Garden to see organization building, programs, communications, audience pathways, and practical operating systems.",
    projectTarget: "#dsgDeepDive",
    serviceTarget: "#buildWithAndrew",
    projectTab: "dsgPanel"
  },
  "EVID-CONTENT": {
    label: "Campaigns and audience-focused content",
    legacyFocus: "content",
    message: "This section highlights campaign planning, platform-aware creative, social content, captions, hooks, and hands-on production.",
    projectTarget: "#socialProjects",
    serviceTarget: "#buildWithAndrew",
    campaign: "program"
  },
  "EVID-AUDIO": {
    label: "Audio editing and production",
    legacyFocus: "audio",
    message: "These examples focus on musical timing, dialogue clarity, pacing, transitions, and performance-ready delivery.",
    projectTarget: "#media",
    serviceTarget: "#serviceVideo",
    mediaTab: "audioStudio"
  },
  "EVID-VIDEO": {
    label: "Video editing and storytelling",
    legacyFocus: "video",
    message: "These examples highlight sequencing, pacing, captions, emotional structure, and delivery for social and audience-facing video.",
    projectTarget: "#media",
    serviceTarget: "#serviceVideo",
    mediaTab: "videoStudio"
  },
  "EVID-MULTIMEDIA": {
    label: "Multimedia production",
    legacyFocus: "video",
    message: "Video is presented first, with audio as supporting evidence of Andrew's ability to shape complete audience-ready media.",
    projectTarget: "#media",
    serviceTarget: "#serviceVideo",
    mediaTab: "videoStudio"
  },
  "EVID-AI": {
    label: "Practical AI and workflow systems",
    legacyFocus: "ai",
    message: "These examples show routing, approvals, human review, and practical systems that reduce repeated work without removing judgment.",
    projectTarget: "#ai",
    serviceTarget: "#serviceAi",
    aiScenario: "booking"
  },
  "EVID-LIVE": {
    label: "Live music and performance",
    legacyFocus: "live",
    message: "This route highlights live performance range, musicality, audience connection, recordings, and booking options.",
    projectTarget: "#media",
    serviceTarget: "#livePerformance",
    mediaTab: "performanceStudio"
  }
};

const LEGACY_FOCUS_ROUTES = {
  web: "EVID-WEB-ARTS",
  content: "EVID-CONTENT",
  audio: "EVID-AUDIO",
  video: "EVID-VIDEO",
  ai: "EVID-AI",
  live: "EVID-LIVE"
};

const PORTFOLIO_CONTEXTS = {
  employer: "Thanks for taking a look. I highlighted the work most relevant to this kind of role.",
  client: "Thanks for checking out my work. I brought you directly to the service and proof most relevant to this project.",
  outreach: "Thanks for taking a look. I selected this example because it addresses a similar kind of challenge.",
  booker: "Welcome. This route highlights the performance work and booking information most relevant to a live engagement."
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
    url: "https://www.instagram.com/reel/Cnke46IN1EY/",
    image: "assets/social-feed-poster.jpg"
  },
  "atlantic-vertical": {
    client: "Atlantic Theater Company",
    title: "Vertical campaign creative built for the way people move through a social feed.",
    role: "Role: video editing, mobile-first pacing, message clarity, and platform adaptation.",
    url: "https://www.instagram.com/reel/CoFyIzwssNR/",
    image: "assets/ig-grid-2.jpg"
  },
  "tks-vertical": {
    client: "Terry Knickerbocker Studio",
    title: "Vertical promotional video combining performance, personality, and a clear reason to engage.",
    role: "Role: campaign editing, story structure, pacing, and social presentation.",
    url: "https://www.instagram.com/reel/CwDbBv9PD-4/",
    image: "assets/ig-grid-3.jpg"
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

const qs = (selector, scope = document) => scope?.querySelector(selector) ?? null;
const qsa = (selector, scope = document) => scope ? [...scope.querySelectorAll(selector)] : [];

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
  let lastScrollY = Math.max(0, window.scrollY);
  let downwardTravel = 0;

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

    const navHasFocus = header.contains(document.activeElement);
    const menuOpen = nav.classList.contains("open");

    if (delta < -1 || current < 80) {
      showHeader();
      downwardTravel = 0;
    } else if (delta > 0) {
      downwardTravel += delta;
      if (!navHasFocus && !menuOpen && current > 180 && downwardTravel > 36) {
        header.classList.add("nav-hidden");
        downwardTravel = 0;
      }
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

  let resetTimer = 0;
  let tipTimer = 0;
  let introTimer = 0;

  button.setAttribute("aria-label", "Back to top");
  button.setAttribute("title", "Back to top");

  let message = qs(".doon-message", button);
  if (!message) {
    message = document.createElement("span");
    message.className = "doon-message";
    message.textContent = "Tap Doon to return to the top.";
    button.insertBefore(message, image);
  }

  const show = source => {
    if (source) image.src = source;
  };
  const idle = () => show(image.dataset.idleSrc);
  const wave = () => show(image.dataset.waveSrc);

  const hideTip = () => {
    window.clearTimeout(tipTimer);
    button.classList.remove("doon-tip-visible");
  };

  const showTip = (duration = 0) => {
    window.clearTimeout(tipTimer);
    button.classList.add("doon-tip-visible");
    if (duration > 0) {
      tipTimer = window.setTimeout(hideTip, duration);
    }
  };

  button.addEventListener("mouseenter", () => {
    wave();
    showTip();
  });
  button.addEventListener("focus", () => {
    wave();
    showTip();
  });
  button.addEventListener("mouseleave", () => {
    idle();
    hideTip();
  });
  button.addEventListener("blur", () => {
    idle();
    hideTip();
  });

  button.addEventListener("click", event => {
    event.preventDefault();
    window.clearTimeout(resetTimer);
    window.clearTimeout(introTimer);
    hideTip();
    show(image.dataset.jumpSrc);
    window.scrollTo({ top: 0, left: 0, behavior: smoothBehavior() });
    resetTimer = window.setTimeout(idle, 760);
  });

  introTimer = window.setTimeout(() => showTip(4200), 650);
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
  if (!project) return;

  const client = qs("#instagramClient");
  const title = qs("#instagramTitle");
  const role = qs("#instagramRole");
  const fallback = qs("#instagramFallback");
  const embedWrap = qs("#instagramEmbedWrap");

  if (client) client.textContent = project.client;
  if (title) title.textContent = project.title;
  if (role) role.textContent = project.role;
  if (fallback) fallback.href = project.url;

  if (embedWrap) {
    embedWrap._instagramMutationObserver?.disconnect();
    embedWrap._instagramResizeObserver?.disconnect();
    embedWrap.innerHTML = "";
    embedWrap.style.minHeight = "620px";
    embedWrap.appendChild(createInstagramEmbed(project));

    const syncInstagramHeight = () => {
      const iframe = embedWrap.querySelector("iframe");
      if (!iframe) return;

      const declaredHeight = Number.parseFloat(iframe.getAttribute("height")) || 0;
      const renderedHeight = iframe.getBoundingClientRect().height || 0;
      const height = Math.max(declaredHeight, renderedHeight);

      if (height > 0) embedWrap.style.minHeight = `${Math.ceil(height)}px`;

      if ("ResizeObserver" in window && !embedWrap._instagramResizeObserver) {
        const resizeObserver = new ResizeObserver(syncInstagramHeight);
        resizeObserver.observe(iframe);
        embedWrap._instagramResizeObserver = resizeObserver;
      }
    };

    const mutationObserver = new MutationObserver(syncInstagramHeight);
    mutationObserver.observe(embedWrap, { childList: true, subtree: true, attributes: true });
    embedWrap._instagramMutationObserver = mutationObserver;

    const processInstagramEmbed = () => {
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
        window.setTimeout(syncInstagramHeight, 250);
        window.setTimeout(syncInstagramHeight, 900);
      }
    };

    if (window.instgrm?.Embeds?.process) {
      processInstagramEmbed();
    } else {
      const instagramScript = document.querySelector(
        'script[src*="instagram.com/embed.js"]'
      );

      instagramScript?.addEventListener(
        "load",
        processInstagramEmbed,
        { once: true }
      );
    }
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
    bar.style.setProperty("--bar-delay", `${(index % 12) * -0.07}s`);
    bar.style.setProperty("--bar-speed", `${0.62 + (index % 7) * 0.08}s`);
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
  const search = qs("#audioSearch");

  if (!audio || !list) return;

  const createTrackButton = (track, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.audioTrackIndex = String(index);
    button.innerHTML = `<span class="audio-file-icon" aria-hidden="true">♫</span><span class="audio-track-copy"><strong>${track.title}</strong><small>${track.meta}</small></span><span class="audio-track-length">Listen</span>`;
    button.addEventListener("click", () => loadTrack(index, true));
    return button;
  };

  AUDIO_TRACKS.forEach((track, index) => {
    list.append(createTrackButton(track, index));
  });
  search?.addEventListener("input", () => {
    const term = search.value.trim().toLowerCase();
    qsa("[data-audio-track-index]", list).forEach(button => {
      button.hidden = Boolean(term) && !button.textContent.toLowerCase().includes(term);
    });
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
  qs("#waveform")?.classList.toggle("is-playing", playing);
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
  deskButton?.classList.toggle("is-playing", playing);
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
  const embed = qs("#youtubeEmbed");
  const directLink = qs("#youtubeDirectLink");
  if (!buttons.length || !embed || !directLink) return;

  function loadVideo(button) {
    const videoId = button.dataset.youtube;
    if (!videoId) return;
    setPressedGroup(buttons, button);
    qs("#audioElement")?.pause();
    qs("#portfolioVideo")?.pause();
    const title = button.dataset.youtubeTitle || "Andrew Wolverton performance";
    embed.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
    embed.title = title;
    directLink.href = `https://www.youtube.com/watch?v=${videoId}`;
    directLink.setAttribute("aria-label", `Open ${title} on YouTube`);
  }

  buttons.forEach(button => button.addEventListener("click", () => loadVideo(button)));
  loadVideo(buttons.find(button => button.classList.contains("active")) || buttons[0]);
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
        button.setAttribute("aria-pressed", "false");
      });

      note.classList.add("is-success");
      note.textContent = "Thanks. Your message has been sent to Andrew.";
    } catch (error) {
      note.classList.add("is-error");
      note.innerHTML = 'The form did not send. Email <a href="mailto:hello@awolverton.com">hello@awolverton.com</a> directly.';
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
function ensurePortfolioWelcome() {
  const existing = qs("#studioPass");
  if (existing) {
    if (!qs("#studioPassReplay")) {
      const replay = document.createElement("button");
      replay.id = "studioPassReplay";
      replay.className = "studio-pass-replay";
      replay.type = "button";
      replay.hidden = true;
      replay.textContent = "Reopen Studio Pass";
      document.body.append(replay);
    }
    return existing;
  }

  const main = qs("#mainContent") || qs("main");
  if (!main) return null;

  const pass = document.createElement("aside");
  pass.id = "studioPass";
  pass.className = "studio-pass";
  pass.hidden = true;
  pass.setAttribute("role", "dialog");
  pass.setAttribute("aria-modal", "false");
  pass.setAttribute("aria-live", "polite");
  pass.setAttribute("aria-labelledby", "studioPassTitle");
  pass.setAttribute("aria-describedby", "studioPassMessage");
  pass.innerHTML = `
    <div aria-hidden="true" class="studio-pass-mark"><span>AW</span></div>
    <div class="studio-pass-copy">
      <small id="studioPassKicker">Studio Pass</small>
      <strong id="studioPassTitle">Selected work</strong>
      <p id="studioPassMessage"></p>
      <div class="studio-pass-actions">
        <a href="#mainContent" id="studioPassStart">Start with selected work</a>
        <button id="studioPassExploreAll" type="button">Explore everything</button>
      </div>
    </div>
    <button aria-label="Close Studio Pass" class="studio-pass-close" id="studioPassClose" type="button"><span aria-hidden="true"></span></button>`;
  main.insertAdjacentElement("afterbegin", pass);

  const replay = document.createElement("button");
  replay.id = "studioPassReplay";
  replay.className = "studio-pass-replay";
  replay.type = "button";
  replay.hidden = true;
  replay.textContent = "Reopen Studio Pass";
  document.body.append(replay);
  return pass;
}

function setupPortfolioWelcome() {
  const params = new URLSearchParams(window.location.search);
  const requestedRoute = params.get("route")?.trim().toUpperCase();
  const requestedFocus = params.get("focus")?.trim().toLowerCase();
  const routeId = PORTFOLIO_ROUTES[requestedRoute]
    ? requestedRoute
    : LEGACY_FOCUS_ROUTES[requestedFocus];
  const route = PORTFOLIO_ROUTES[routeId];

  if (!route) return;

  const requestedContext = params.get("context")?.trim().toLowerCase();
  const context = PORTFOLIO_CONTEXTS[requestedContext] ? requestedContext : "employer";
  const originalTitle = document.title;
  const isCaseStudy = document.body.classList.contains("page-case-study");
  const isServices = document.body.dataset.page === "services";
  const isProjects = document.body.dataset.page === "projects" && !isCaseStudy;
  const targetSelector = isCaseStudy
    ? "#mainContent"
    : isServices
      ? route.serviceTarget
      : route.projectTarget;
  const target = targetSelector ? qs(targetSelector) : null;
  const pass = ensurePortfolioWelcome();
  const title = qs("#studioPassTitle");
  const message = qs("#studioPassMessage");
  const kicker = qs("#studioPassKicker") || qs(".studio-pass-copy small", pass || document);
  const startLink = qs("#studioPassStart");
  const closeButton = qs("#studioPassClose");
  const exploreAllButton = qs("#studioPassExploreAll");
  const replayButton = qs("#studioPassReplay");

  if (!pass || !title || !message || !startLink || !target) return;

  document.body.dataset.portfolioRoute = routeId;
  document.body.dataset.portfolioContext = context;

  title.textContent = route.label;
  message.textContent = `${PORTFOLIO_CONTEXTS[context]} ${route.message}`;
  if (kicker) kicker.textContent = `${context} Studio Pass`;
  startLink.href = targetSelector;
  startLink.textContent = isCaseStudy
    ? "Start with this case study"
    : isServices
      ? "View the relevant service"
      : "Start with selected work";

  document.title = `${route.label} Studio Pass | Andrew Wolverton`;

  target.classList.add("studio-pass-target");
  target.dataset.studioPassLabel = route.label;

  /*
   * Activate the relevant project, campaign, media,
   * or AI view before scrolling to it.
   */

  if (isProjects && route.projectTab) {
    qs(`[data-project-tab="${route.projectTab}"]`)?.click();
  }

  if (isProjects && route.campaign) {
    qs(`[data-campaign="${route.campaign}"]`)?.click();
  }

  if (isProjects && route.mediaTab) {
    qs(`[data-monitor-tab="${route.mediaTab}"]`)?.click();
  }

  if (isProjects && route.aiScenario) {
    qs(`[data-ai-scenario="${route.aiScenario}"]`)?.click();
  }

  const scrollToTarget = () => {
    const headerHeight = qs("#siteHeader")?.getBoundingClientRect().height || 0;
    const scrollMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    const offset = Math.max(scrollMargin, headerHeight + 14, 108);
    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      offset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "auto"
    });
  };

  /* Re-apply after late images, fonts, and interactive panels settle. */
  [280, 1000, 2800].forEach(delay => window.setTimeout(scrollToTarget, delay));

  const sessionKey = `aw-portfolio-route-seen:${routeId}:${context}`;
  const markSeen = () => {
    try {
      window.sessionStorage.setItem(sessionKey, "1");
    } catch (error) {
      /* The routed experience still works when storage is unavailable. */
    }
  };
  const showPass = () => {
    pass.hidden = false;
    if (replayButton) replayButton.hidden = true;
  };
  const hidePass = () => {
    pass.hidden = true;
    if (replayButton) replayButton.hidden = false;
    markSeen();
  };

  let seen = false;
  try {
    seen = window.sessionStorage.getItem(sessionKey) === "1";
  } catch (error) {
    seen = false;
  }
  if (seen) {
    pass.hidden = true;
    if (replayButton) replayButton.hidden = false;
  } else {
    showPass();
  }

  startLink.addEventListener("click", event => {
    event.preventDefault();
    scrollToTarget();
    hidePass();
  });

  closeButton?.addEventListener("click", hidePass);
  replayButton?.addEventListener("click", showPass);

  exploreAllButton?.addEventListener("click", () => {
    const cleanUrl = new URL(window.location.href);

    ["route", "context", "audience", "for", "focus"].forEach(key => cleanUrl.searchParams.delete(key));
    cleanUrl.hash = "";

    window.history.replaceState({}, "", cleanUrl);

    delete document.body.dataset.portfolioRoute;
    delete document.body.dataset.portfolioContext;

    target.classList.remove("studio-pass-target");
    delete target.dataset.studioPassLabel;

    pass.hidden = true;
    if (replayButton) replayButton.hidden = true;

    const defaultTarget = qs("#projects") || qs("#home") || qs("main");
    defaultTarget?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });

    document.title = originalTitle;
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !pass.hidden && pass.contains(document.activeElement)) {
      hidePass();
    }
  });
}



function redirectLegacyStudioPass() {
  const params = new URLSearchParams(window.location.search);
  const focus = params.get("focus")?.trim().toLowerCase();
  if (params.has("route") || !focus || document.body.dataset.page === "projects") return false;
  if (!LEGACY_FOCUS_ROUTES[focus]) return false;
  const relativeProjects = document.body.classList.contains("page-case-study") ? "../projects.html" : "projects.html";
  const destination = new URL(relativeProjects, window.location.href);
  destination.searchParams.set("focus", focus);
  if (params.has("context")) destination.searchParams.set("context", params.get("context"));
  window.location.replace(destination);
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

    const currentHref = link.getAttribute("href")?.trim() || "";
    let hasValidUrl = false;
    try {
      const parsed = new URL(currentHref, window.location.href);
      hasValidUrl = ["http:", "https:"].includes(parsed.protocol) && Boolean(parsed.hostname);
    } catch {
      hasValidUrl = false;
    }

    /* A real URL in the HTML is authoritative and must never be intercepted. */
    if (hasValidUrl) return;

    /* Only explicitly marked placeholders get setup guidance. */
    if (!link.hasAttribute("data-social-placeholder")) return;

    link.addEventListener("click", event => {
      event.preventDefault();
      window.alert(`Add the ${key || "social"} profile URL in the SOCIAL_PROFILES block near the top of script.js.`);
    });
  });
}



function setupAboutGallery() {
  const gallery = qs("#aboutGallery");
  if (!gallery) return;

  /* The homepage now includes static cards so the gallery remains visible even
     when JavaScript is delayed, cached, or another component fails. Build the
     cards only as a fallback for older copies of index.html. */
  if (!gallery.querySelector(".about-story-card") && Array.isArray(ABOUT_GALLERY)) {
    ABOUT_GALLERY.forEach((item, index) => {
      if (!item?.src) return;
      const figure = document.createElement("figure");
      figure.className = `about-story-card about-story-card-${item.layout || "standard"}`;
      figure.dataset.galleryIndex = String(index);

      const image = document.createElement("img");
      image.loading = index < 2 ? "eager" : "lazy";
      image.src = item.src;
      image.alt = item.alt || item.caption || "Andrew Wolverton portfolio moment";

      const caption = document.createElement("figcaption");
      const count = document.createElement("span");
      count.textContent = String(index + 1).padStart(2, "0");
      const story = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.title || item.alt || `Story moment ${index + 1}`;
      const copy = document.createElement("p");
      copy.textContent = item.caption || item.alt || "";
      story.append(title, copy);
      caption.append(count, story);
      figure.append(image, caption);
      gallery.append(figure);
    });
  }

  const cards = qsa(".about-story-card", gallery);
  if (!cards.length || gallery.dataset.galleryWired === "true") return;
  gallery.dataset.galleryWired = "true";

  const previous = qs("#aboutGalleryPrev");
  const next = qs("#aboutGalleryNext");
  const cardStep = () => {
    const first = gallery.querySelector(".about-story-card");
    if (!first) return gallery.clientWidth * 0.8;
    const styles = window.getComputedStyle(gallery);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 16;
    return first.getBoundingClientRect().width + gap;
  };
  const move = direction => gallery.scrollBy({ left: cardStep() * direction, behavior: smoothBehavior() });
  previous?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));

  if (prefersReducedMotion.matches || cards.length < 2) return;
  let timer = 0;
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    timer = window.setInterval(() => {
      const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 8;
      gallery.scrollTo({ left: atEnd ? 0 : gallery.scrollLeft + cardStep(), behavior: "smooth" });
    }, 5200);
  };
  gallery.addEventListener("pointerenter", stop);
  gallery.addEventListener("pointerleave", start);
  gallery.addEventListener("focusin", stop);
  gallery.addEventListener("focusout", start);
  gallery.addEventListener("touchstart", stop, { passive: true });
  gallery.addEventListener("touchend", start, { passive: true });
  start();
}

function setupPageDeepLinks() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = qs(hash);
  if (!target) return;

  const placeTargetBelowNavigation = () => {
    const headerHeight = qs("#siteHeader")?.getBoundingClientRect().height || 0;
    const scrollMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    const offset = Math.max(scrollMargin, headerHeight + 14, 108);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  };

  /* Correct the native hash position after scripts and late layout settle. */
  [120, 900, 2600].forEach(delay => window.setTimeout(placeTargetBelowNavigation, delay));
}


function setupHeroGreeter() {
  const greeter = qs("#heroGreeter");
  if (!greeter) return;

  const trigger = qs("#heroGreeterAvatar", greeter);
  const image = qs("#heroGreeterImage", greeter);
  if (!trigger || !image) return;

  const sessionKey = "aw-home-greeter-seen";
  const waveSrc = image.dataset.waveSrc || image.getAttribute("src") || "";
  let hideTimer = 0;
  let introTimer = 0;

  if (waveSrc) image.src = waveSrc;

  const clearTimers = () => {
    window.clearTimeout(hideTimer);
    window.clearTimeout(introTimer);
  };

  const showBubble = (duration = 0) => {
    clearTimers();
    greeter.classList.add("is-visible");
    if (duration > 0) {
      hideTimer = window.setTimeout(() => greeter.classList.remove("is-visible"), duration);
    }
  };

  const hideBubble = () => {
    window.clearTimeout(hideTimer);
    greeter.classList.remove("is-visible");
  };

  trigger.addEventListener("mouseenter", () => showBubble());
  trigger.addEventListener("focus", () => showBubble());
  trigger.addEventListener("mouseleave", hideBubble);
  trigger.addEventListener("blur", hideBubble);
  trigger.addEventListener("click", event => {
    event.preventDefault();
    showBubble(3200);
  });

  try {
    if (!window.sessionStorage.getItem(sessionKey)) {
      window.sessionStorage.setItem(sessionKey, "1");
      introTimer = window.setTimeout(() => showBubble(3200), 700);
    }
  } catch (error) {
    introTimer = window.setTimeout(() => showBubble(3200), 700);
  }
}



function setupPageSectionNavigation() {
  const index = qs("[data-page-index]");
  if (!index) return;

  const links = qsa("[data-page-index-link]", index);
  const currentLabels = qsa("[data-page-index-current]", index);
  const disclosure = qs(".page-index-disclosure", index);
  const entries = [];
  const entryByHash = new Map();

  links.forEach(link => {
    const hash = link.getAttribute("href");
    const section = hash ? qs(hash) : null;
    if (!hash || !section || entryByHash.has(hash)) return;
    const entry = {
      hash,
      section,
      title: link.dataset.shortTitle || qs("strong", link)?.textContent?.trim() || "Section"
    };
    entries.push(entry);
    entryByHash.set(hash, entry);
  });

  if (!entries.length) return;

  if (disclosure) {
    const syncDisclosureState = () => {
      document.body.classList.toggle("page-index-open", disclosure.open);
    };
    disclosure.addEventListener("toggle", syncDisclosureState);
    syncDisclosureState();
  }

  let currentHash = "";

  const setActive = hash => {
    const entry = entryByHash.get(hash);
    if (!entry || currentHash === hash) return;
    currentHash = hash;

    links.forEach(link => {
      const active = link.getAttribute("href") === hash;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    currentLabels.forEach(label => {
      label.textContent = entry.title;
    });
  };

  links.forEach(link => {
    link.addEventListener("click", () => {
      setActive(link.getAttribute("href"));
      if (disclosure?.open) disclosure.open = false;
    });
  });

  entries.forEach((entry, entryIndex) => {
    if (qs(":scope > .section-sequence-nav", entry.section)) return;
    const sequence = document.createElement("nav");
    sequence.className = "section-sequence-nav";
    sequence.setAttribute("aria-label", `${entry.title} chapter navigation`);

    const addSequenceLink = (target, direction) => {
      if (!target) return;
      const link = document.createElement("a");
      link.href = target.hash;
      link.className = `section-sequence-${direction}`;
      link.innerHTML = direction === "previous"
        ? `<small>Previous chapter</small><strong>← ${target.title}</strong>`
        : `<small>Next chapter</small><strong>${target.title} →</strong>`;
      sequence.append(link);
    };

    addSequenceLink(entries[entryIndex - 1], "previous");
    addSequenceLink(entries[entryIndex + 1], "next");
    if (sequence.childElementCount) entry.section.append(sequence);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(records => {
      const visible = records
        .filter(record => record.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const current = entries.find(entry => entry.section === visible[0].target);
      if (current) setActive(current.hash);
    }, {
      rootMargin: "-26% 0px -58% 0px",
      threshold: [0.01, 0.15, 0.35]
    });

    entries.forEach(({ section }) => observer.observe(section));
  }

  const initial = entryByHash.get(window.location.hash) || entries[0];
  setActive(initial.hash);
}



/* =========================================================
   PORTFOLIO JOURNEY: PROOF <-> SERVICES
   Keeps Home, Projects, and Services connected without
   duplicating the existing tab, contact, or routing logic.
   ========================================================= */
function createJourneyLink(href, label, className = "") {
  const link = document.createElement("a");
  link.href = href;
  link.className = className;
  link.append(document.createTextNode(`${label} `));
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  link.append(arrow);
  return link;
}

function setupHomeCapabilityJourney() {
  if (document.body.dataset.page !== "home") return;

  const section = qs(".home-capabilities");
  const list = qs(".home-capability-list", section || document);
  if (!section || !list) return;

  const title = qs("#homeCapabilitiesTitle", section);
  const intro = qs(".section-intro > p", section);
  if (title) title.textContent = "Choose the problem, then see the work or the service.";
  if (intro) intro.textContent = "Open a capability for a quick explanation. See examples first, or go straight to scope and pricing.";

  const routes = [
    {
      match: /web and ux/i,
      example: ["projects.html#projects", "See web case studies"],
      service: ["services.html#serviceWeb", "Services & pricing"]
    },
    {
      match: /campaigns and content/i,
      example: ["projects.html#socialProjects", "See campaign examples"],
      service: ["services.html#serviceCampaigns", "Services & pricing"]
    },
    {
      match: /audio production and editing/i,
      example: ["projects.html?media=audio#media", "Hear audio examples"],
      service: ["services.html#serviceAudio", "Services & pricing"]
    },
    {
      match: /video editing and storytelling/i,
      example: ["projects.html?media=video#media", "See video examples"],
      service: ["services.html#serviceVideo", "Services & pricing"]
    },
    {
      match: /ai and workflow systems/i,
      example: ["projects.html#ai", "Explore workflow examples"],
      service: ["services.html#serviceAi", "Services & pricing"]
    },
    {
      match: /live music and performance/i,
      example: ["projects.html?media=performance#media", "Watch performance examples"],
      service: ["services.html#livePerformance", "Services & pricing"]
    }
  ];

  /* Backward-compatible fallback for an older homepage that still combines audio and video. */
  const combined = qsa("details", list).find(detail => /audio and video/i.test(qs("summary span", detail)?.textContent || ""));
  if (combined) {
    const audio = combined.cloneNode(true);
    const video = combined.cloneNode(true);

    const audioName = qs("summary span", audio);
    const audioTag = qs("summary small", audio);
    const audioCopy = qs("div > p", audio);
    if (audioName) audioName.textContent = "Audio production and editing";
    if (audioTag) audioTag.textContent = "Make every cut, transition, and beat count.";
    if (audioCopy) audioCopy.textContent = "Dance mixes, podcasts, event audio, performance edits, musical transitions, cleanup, and playback preparation.";

    const videoName = qs("summary span", video);
    const videoTag = qs("summary small", video);
    const videoCopy = qs("div > p", video);
    if (videoName) videoName.textContent = "Video editing and storytelling";
    if (videoTag) videoTag.textContent = "Shape footage into a story people feel.";
    if (videoCopy) videoCopy.textContent = "Performance edits, promotional video, campaign cutdowns, social-first formats, YouTube presentation, and platform-ready versions.";

    combined.replaceWith(audio, video);
  }

  qsa("details", list).forEach(detail => {
    const name = qs("summary span", detail)?.textContent || "";
    const route = routes.find(item => item.match.test(name));
    const body = qs(":scope > div", detail);
    if (!route || !body) return;

    const oldDirectLinks = qsa(":scope > a", body);
    oldDirectLinks.forEach(link => link.remove());

    let actions = qs(":scope > .capability-actions", body);
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "capability-actions";
      body.append(actions);
    }
    actions.replaceChildren(
      createJourneyLink(route.example[0], route.example[1], "capability-example-link"),
      createJourneyLink(route.service[0], route.service[1], "capability-service-link")
    );
  });
}

function setupServiceProofJourney() {
  if (document.body.dataset.page !== "services") return;

  const routes = {
    serviceWeb: ["projects.html#projects", "See Web & UX case studies"],
    serviceCampaigns: ["projects.html#socialProjects", "See campaign examples"],
    serviceAudio: ["projects.html?media=audio#media", "Hear audio production examples"],
    serviceVideo: ["projects.html?media=video#media", "See video editing examples"],
    serviceAi: ["projects.html#ai", "Explore workflow examples"],
    livePerformance: ["projects.html?media=performance#media", "Watch performance examples"],
    servicePartnership: ["projects.html", "Browse the full project portfolio"]
  };

  Object.entries(routes).forEach(([id, route]) => {
    const card = qs(`#${id}`);
    const meta = qs(".service-offering-meta", card || document);
    if (!card || !meta || qs(".service-proof", meta)) return;

    const contactCta = qs('a[data-service-choice]', meta);
    const proof = document.createElement("div");
    proof.className = "service-proof";

    const label = document.createElement("small");
    label.className = "service-proof-label";
    label.textContent = "Related work";

    const link = createJourneyLink(route[0], route[1], "service-proof-link");
    proof.append(label, link);

    if (contactCta) meta.insertBefore(proof, contactCta);
    else meta.append(proof);
  });
}

function createProjectServiceBridge({ eyebrow, title, copy, href, linkLabel, dark = false, compact = false }) {
  const bridge = document.createElement("aside");
  bridge.className = `project-service-bridge${dark ? " project-service-bridge-dark" : ""}${compact ? " project-service-bridge-compact" : ""}`;

  const text = document.createElement("div");
  const kicker = document.createElement("p");
  kicker.className = "eyebrow";
  kicker.textContent = eyebrow;
  const heading = document.createElement(compact ? "h4" : "h3");
  heading.textContent = title;
  const description = document.createElement("p");
  description.textContent = copy;
  text.append(kicker, heading, description);

  const link = createJourneyLink(href, linkLabel, "project-service-bridge-link");
  bridge.append(text, link);
  return bridge;
}

function setupProjectServiceJourney() {
  if (document.body.dataset.page !== "projects") return;

  const sectionBridges = [
    {
      section: "#projects",
      after: ".browser-workspace",
      eyebrow: "Need this kind of work?",
      title: "Web & UX services",
      copy: "See scope, process, and starting prices for website strategy, redesign, UX, and front-end implementation.",
      href: "services.html#serviceWeb",
      linkLabel: "View Web & UX services"
    },
    {
      section: "#socialProjects",
      after: ".campaign-console",
      eyebrow: "Need this kind of work?",
      title: "Campaign and content services",
      copy: "See scope and starting prices for campaign strategy, content systems, social production, and coordinated audience outreach.",
      href: "services.html#serviceCampaigns",
      linkLabel: "View campaign services"
    },
    {
      section: "#ai",
      after: ".ai-case-lab",
      eyebrow: "Need this kind of work?",
      title: "AI and workflow services",
      copy: "See how discovery, workflow design, human review, documentation, and custom builds are scoped.",
      href: "services.html#serviceAi",
      linkLabel: "View AI & workflow services"
    }
  ];

  sectionBridges.forEach(config => {
    const section = qs(config.section);
    const anchor = qs(config.after, section || document);
    if (!section || !anchor || qs(":scope > .project-service-bridge", section)) return;
    anchor.insertAdjacentElement("afterend", createProjectServiceBridge(config));
  });

  const mediaConfigs = [
    {
      id: "audioStudio",
      eyebrow: "Need an audio edit?",
      title: "Audio editing services",
      copy: "Dance mixes, podcasts, event cues, performance audio, cleanup, pacing, and custom edits.",
      href: "services.html#serviceAudio",
      linkLabel: "See audio services & pricing",
      dark: false
    },
    {
      id: "videoStudio",
      eyebrow: "Need video support?",
      title: "Video editing and social services",
      copy: "Performance edits, promotional video, campaign cutdowns, social-first formats, and platform-ready versions.",
      href: "services.html#serviceVideo",
      linkLabel: "See video services & pricing"
    },
    {
      id: "performanceStudio",
      eyebrow: "Booking live music?",
      title: "Live performance options",
      copy: "Solo performance, Rooftop Ramblers, custom repertoire, and event-focused programming.",
      href: "services.html#livePerformance",
      linkLabel: "See performance options & pricing"
    }
  ];

  mediaConfigs.forEach(config => {
    const panel = qs(`#${config.id}`);
    if (!panel || qs(":scope > .project-service-bridge", panel)) return;
    panel.append(createProjectServiceBridge({ ...config, dark: config.dark !== false, compact: true }));
  });
}

function setupMediaDeepLinks() {
  if (document.body.dataset.page !== "projects") return;

  const params = new URLSearchParams(window.location.search);
  if (params.has("focus") || params.has("for")) return;

  const requested = params.get("media")?.trim().toLowerCase();
  if (!requested) return;

  const map = {
    audio: "audioStudio",
    video: "videoStudio",
    performance: "performanceStudio",
    live: "performanceStudio"
  };
  const panelId = map[requested];
  if (!panelId) return;

  const tab = qs(`[data-monitor-tab="${panelId}"]`);
  if (!tab) return;
  tab.click();

  if (window.location.hash !== "#media") {
    const clean = new URL(window.location.href);
    clean.hash = "media";
    window.history.replaceState({}, "", clean);
  }
}

function setupProjectDeepLinks() {
  if (document.body.dataset.page !== "projects") return;

  const params = new URLSearchParams(window.location.search);
  if (params.has("focus") || params.has("for")) return;

  const requested = params.get("project")?.trim().toLowerCase();
  if (!requested) return;

  const map = {
    porch: "porchStompPanel",
    "porch-stomp": "porchStompPanel",
    porchstomp: "porchStompPanel",
    dsg: "dsgPanel",
    discovery: "dsgPanel",
    "discovery-sound-garden": "dsgPanel",
    yolele: "yolelePanel",
    "yolele-ingredients": "yolelePanel"
  };

  const panelId = map[requested];
  if (!panelId) return;

  qs(`[data-project-tab="${panelId}"]`)?.click();

  if (!window.location.hash) {
    const clean = new URL(window.location.href);
    clean.hash = "projects";
    window.history.replaceState({}, "", clean);
  }
}

function init() {
  if (redirectLegacyStudioPass()) return;
  setupAboutGallery();
  setupSocialProfiles();
  setupNavigation();
  setupDoon();
  setupHeroGreeter();
  setupWorkspaceTransition();
  installAssetFallbacks();
  setupProjectTabs();
  setupProjectDeepLinks();
  setupTransformationPlayers();
  setupAudienceSelector();
  setupBuyerSelector();
  setupCampaignPlanner();
  setupInstagramSelector();
  setupMonitorTabs();
  setupMediaDeepLinks();
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
  setupHomeCapabilityJourney();
  setupServiceProofJourney();
  setupProjectServiceJourney();
  setupPortfolioWelcome();
  setupPageSectionNavigation();
  setupPageDeepLinks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
