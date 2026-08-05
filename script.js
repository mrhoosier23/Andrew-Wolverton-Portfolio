"use strict";

/* =========================================================
   ABOUT GALLERY
   Add files to: assets/about me gallery/
   Then add one object per image below.

   Example:
   {
     file: "singing-hoosiers-reunion.jpg",
     alt: "Andrew with Singing Hoosiers alumni",
     caption: "Reconnecting with the Singing Hoosiers community."
   }
   ========================================================= */

const SOCIAL_PROFILES = {
  linkedin: "https://www.linkedin.com/in/andrew-wolverton-17a3431b5/",
  instagram: "https://www.instagram.com/mr.hoosier23/",
  youtube: "https://www.youtube.com/@Mr.Hoosier23",
  github: "https://github.com/mrhoosier23"
};

const ABOUT_GALLERY = [
  // Add gallery entries here.
];

const MUSIC_TRACKS = [
  {
    title: "Sad Singin",
    sources: [
      "assets/Sad Singin.mp3",
      "assets/Sad Singin.MP3",
      "audio/Sad Singin.mp3"
    ],
    meta: "Artist recording and vocal performance"
  },
  {
    title: "El Tango de Britney",
    sources: [
      "assets/El Tango de Britney 8.28 w vocals.wav",
      "assets/El Tango de Britney 8.28 w vocals.WAV",
      "audio/El Tango de Britney 8.28 w vocals.wav"
    ],
    meta: "Arrangement, vocals, and performance"
  },
  {
    title: "Wolverton Mountain",
    sources: [
      "assets/Wolverton Mountain.wav",
      "assets/Wolverton Mountain.WAV",
      "audio/Wolverton Mountain.wav",
      "audio/Wolverton Mountain.WAV"
    ],
    meta: "Bluegrass vocal performance"
  }
];

const STUDIO_PASS_ROUTES = {
  web: {
    title: "Web and UX",
    message: "You were sent here for web and UX work.",
    filter: "web"
  },
  content: {
    title: "Campaigns and Content",
    message: "Start with campaign strategy, content systems, and published social work.",
    filter: "content"
  },
  audio: {
    title: "Audio Production",
    message: "Start with audio production and performance editing.",
    filter: "media"
  },
  video: {
    title: "Video and Storytelling",
    message: "Start with video editing, storytelling, and social-first production.",
    filter: "media"
  },
  ai: {
    title: "AI and Workflow Systems",
    message: "Explore practical AI workflows with human review built in.",
    filter: "ai"
  },
  live: {
    title: "Live Music and Performance",
    message: "Start with live performance, booking options, and musical work.",
    filter: "live"
  }
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");


function setupSocialProfiles() {
  $$("[data-social-profile]").forEach(link => {
    const key = link.dataset.socialProfile;
    if (SOCIAL_PROFILES[key]) link.href = SOCIAL_PROFILES[key];
  });
}

function setupTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem("aw-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (systemDark ? "dark" : "light");

  root.dataset.theme = initial;
  const themeMeta = $('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = initial === "dark" ? "#071b17" : "#10251f";

  $$("[data-theme-toggle]").forEach(button => {
    button.setAttribute("aria-label", initial === "dark" ? "Use light theme" : "Use dark theme");

    button.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("aw-theme", next);
      if (themeMeta) themeMeta.content = next === "dark" ? "#071b17" : "#10251f";
      $$("[data-theme-toggle]").forEach(item => {
        item.setAttribute("aria-label", next === "dark" ? "Use light theme" : "Use dark theme");
      });
    });
  });
}

function setupHeader() {
  const header = $("#globalHeader");
  const menu = $("#mobileMenu");
  const toggle = $(".mobile-menu-toggle");
  let lastY = window.scrollY;
  let accumulated = 0;

  toggle?.addEventListener("click", () => {
    const open = menu?.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(Boolean(open)));
    menu?.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", Boolean(open));
    header?.classList.remove("nav-hidden");
  });

  $$("a", menu).forEach(link => {
    link.addEventListener("click", () => {
      menu?.classList.remove("open");
      menu?.setAttribute("aria-hidden", "true");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  const update = () => {
    const current = Math.max(0, window.scrollY);
    const delta = current - lastY;
    header?.classList.toggle("scrolled", current > 24);

    if (Math.sign(delta) !== Math.sign(accumulated)) accumulated = delta;
    else accumulated += delta;

    const menuOpen = menu?.classList.contains("open");
    const headerFocused = header?.contains(document.activeElement);

    if (!menuOpen && !headerFocused && current > 180 && accumulated > 54) {
      header?.classList.add("nav-hidden");
      accumulated = 0;
    } else if (delta < 0 && accumulated < -18) {
      header?.classList.remove("nav-hidden");
      accumulated = 0;
    } else if (current < 80) {
      header?.classList.remove("nav-hidden");
    }

    lastY = current;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupAccordions() {
  const mobile = window.matchMedia("(max-width: 760px)");

  const bindGroup = selector => {
    $$(selector).forEach(details => {
      details.addEventListener("toggle", () => {
        if (!mobile.matches || !details.open) return;

        $$(selector).forEach(other => {
          if (other !== details) other.open = false;
        });
      });
    });
  };

  bindGroup(".accordion-grid details");
  bindGroup(".toolkit-accordions details");
  bindGroup(".experience-list details");
}

function setupProjectFilters() {
  const grid = $("[data-project-grid]");
  const buttons = $$("[data-project-filter]");
  if (!grid || !buttons.length) return;

  const applyFilter = filter => {
    buttons.forEach(button => {
      const active = button.dataset.projectFilter === filter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    $$("[data-category]", grid).forEach(card => {
      const categories = (card.dataset.category || "").split(/\s+/);
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  };

  buttons.forEach(button => {
    button.addEventListener("click", () => applyFilter(button.dataset.projectFilter));
  });

  window.applyProjectFilter = applyFilter;
}

function setupStudioPass() {
  const params = new URLSearchParams(window.location.search);
  const focus = params.get("focus")?.toLowerCase();
  if (!focus || !STUDIO_PASS_ROUTES[focus]) return;

  if (document.body.classList.contains("page-home")) {
    window.location.replace(`projects.html?focus=${encodeURIComponent(focus)}`);
    return;
  }

  if (!document.body.classList.contains("page-projects")) return;

  const route = STUDIO_PASS_ROUTES[focus];
  const banner = $("[data-studio-pass]");
  const title = $("[data-studio-pass-title]");
  const message = $("[data-studio-pass-message]");

  if (banner) {
    banner.hidden = false;
    if (title) title.textContent = route.title;
    if (message) message.textContent = route.message;
  }

  window.applyProjectFilter?.(route.filter);

  const firstVisible = $$("[data-category]").find(card => !card.hidden);
  window.setTimeout(() => {
    firstVisible?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "center"
    });
    firstVisible?.classList.add("studio-pass-highlight");
  }, 260);

  $("[data-clear-focus]")?.addEventListener("click", () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("focus");
    window.history.replaceState({}, "", url);
    banner.hidden = true;
    window.applyProjectFilter?.("all");
    firstVisible?.classList.remove("studio-pass-highlight");
  });
}

function setupContactForms() {
  $$("[data-service-choice]").forEach(link => {
    link.addEventListener("click", () => {
      const form = $("[data-contact-form]");
      const select = $('select[name="project_type"]', form);
      if (select) select.value = link.dataset.serviceChoice || "";
    });
  });

  $$("[data-contact-form]").forEach(form => {
    const note = $("[data-form-note]", form);
    const submit = $('button[type="submit"]', form);

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const original = submit?.textContent || "Send inquiry";
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending...";
      }

      if (note) {
        note.classList.remove("success", "error");
        note.textContent = "Sending your message...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Submission failed");

        form.reset();
        if (note) {
          note.classList.add("success");
          note.textContent = "Thanks. Your message has been sent to Andrew.";
        }
      } catch (error) {
        if (note) {
          note.classList.add("error");
          note.textContent = "The form could not send. Please email anwolver@gmail.com.";
        }
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = original;
        }
      }
    });
  });
}

function setupMusicPlayer() {
  const modal = $("#musicModal");
  const audio = $("[data-music-audio]", modal);
  const list = $("[data-music-list]", modal);
  const title = $("[data-music-title]", modal);
  const meta = $("[data-music-meta]", modal);
  const play = $("[data-music-play]", modal);
  const previous = $("[data-music-prev]", modal);
  const next = $("[data-music-next]", modal);

  if (!modal || !audio || !list || !play) return;

  let index = 0;
  let sourceIndex = 0;

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const open = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $("[data-close-music]", modal)?.focus();
  };

  const updatePlay = () => {
    const playing = !audio.paused;
    play.classList.toggle("is-playing", playing);
    play.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  };

  const setSource = () => {
    sourceIndex = 0;
    audio.src = MUSIC_TRACKS[index].sources[sourceIndex];
  };

  const setTrack = (nextIndex, autoplay = false) => {
    index = (nextIndex + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    setSource();

    if (title) title.textContent = MUSIC_TRACKS[index].title;
    if (meta) meta.textContent = MUSIC_TRACKS[index].meta;

    $$("button", list).forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === index);
      button.setAttribute("aria-pressed", String(buttonIndex === index));
    });

    if (autoplay) audio.play().catch(() => {});
  };

  MUSIC_TRACKS.forEach((track, trackIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span>${track.title}</span><b aria-hidden="true">›</b>`;
    button.addEventListener("click", () => setTrack(trackIndex, true));
    list.append(button);
  });

  audio.addEventListener("error", () => {
    sourceIndex += 1;
    const sources = MUSIC_TRACKS[index].sources;
    if (sourceIndex < sources.length) {
      audio.src = sources[sourceIndex];
      audio.play().catch(() => {});
    } else if (meta) {
      meta.textContent = "The audio file could not be loaded from the expected asset paths.";
    }
  });

  audio.addEventListener("play", updatePlay);
  audio.addEventListener("pause", updatePlay);
  audio.addEventListener("ended", () => setTrack(index + 1, true));

  play.addEventListener("click", () => {
    if (!audio.src) setTrack(index, false);
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });

  previous?.addEventListener("click", () => setTrack(index - 1, true));
  next?.addEventListener("click", () => setTrack(index + 1, true));

  $$("[data-open-music]").forEach(button => button.addEventListener("click", open));
  $$("[data-close-music]", modal).forEach(button => button.addEventListener("click", close));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) close();
  });

  setTrack(0, false);
}

function renderAboutGallery() {
  const gallery = $("[data-about-gallery]");
  if (!gallery || !ABOUT_GALLERY.length) return;

  gallery.innerHTML = "";

  ABOUT_GALLERY.forEach(item => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");

    image.src = `assets/about me gallery/${item.file}`;
    image.alt = item.alt || item.caption || "Andrew Wolverton gallery image";
    image.loading = "lazy";
    caption.textContent = item.caption || "";

    figure.append(image, caption);
    gallery.append(figure);
  });
}

function setupExperienceLinks() {
  $$('a[href*="contact.html"]').forEach(link => {
    link.href = link.href.replace(/contact\.html(?:#contact)?$/, "index.html#contact");
  });
}

function setupYears() {
  $$("[data-current-year]").forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });
}

function setupReveal() {
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) return;

  const targets = $$(
    ".project-preview, .project-card, .service-detail, .story-chapters article, .values-grid article, .experience-list details, .sampler-card"
  );

  targets.forEach(target => target.classList.add("reveal-ready"));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach(target => observer.observe(target));
}


function setupAnalyticsHooks() {
  const track = (eventName, parameters = {}) => {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, parameters);
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...parameters });
  };

  document.addEventListener("click", event => {
    const link = event.target.closest("a, button");
    if (!link) return;

    const label = (link.getAttribute("aria-label") || link.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
    const href = link instanceof HTMLAnchorElement ? link.href : "";

    if (link.matches(".project-card a, .project-preview a")) {
      track("project_open", { label, href });
    }

    if (link.matches("[data-service-choice]")) {
      track("service_interest", { label, service: link.dataset.serviceChoice || "" });
    }

    if (link.matches("[data-open-music]")) {
      track("music_player_open", { label });
    }

    if (link instanceof HTMLAnchorElement && link.origin !== window.location.origin) {
      track("outbound_click", { label, href });
    }
  });
}

function init() {
  setupSocialProfiles();
  setupTheme();
  setupHeader();
  setupAccordions();
  setupProjectFilters();
  setupStudioPass();
  setupContactForms();
  setupMusicPlayer();
  renderAboutGallery();
  setupExperienceLinks();
  setupYears();
  setupReveal();
  setupAnalyticsHooks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
