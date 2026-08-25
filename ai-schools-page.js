(() => {
  const page = document.querySelector(".page-ai-schools");
  if (!page) return;

  const menu = document.querySelector("#aiSchoolsMobileMenu");
  const story = document.querySelector("#aiTeacherAssistantStory");
  const openButton = document.querySelector(".ai-story-menu-button");
  const closeButton = document.querySelector(".ai-schools-mobile-close");
  const colors = ["#63ddd1", "#ffc8f7", "#d5a84c", "#ef7c5a"];
  const glyphs = ["♪", "♫", "♬", "♩"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const storyScenes = story ? [...story.querySelectorAll("[data-story-scene]")] : [];
  const storyLinks = story ? [...story.querySelectorAll("[data-story-link]")] : [];
  let storyFrame = 0;

  function burstNotes(control) {
    if (!control || reduceMotion.matches) return;
    const box = control.getBoundingClientRect();
    const startX = box.left + box.width / 2;
    const startY = box.top + box.height / 2;

    for (let index = 0; index < 9; index += 1) {
      const note = document.createElement("span");
      note.className = "ai-school-note";
      note.textContent = glyphs[index % glyphs.length];
      note.style.left = `${startX}px`;
      note.style.top = `${startY}px`;
      note.style.color = colors[index % colors.length];
      note.style.setProperty("--note-x", `${(index - 4) * 16}px`);
      note.style.setProperty("--note-y", `${-44 - (index % 3) * 24}px`);
      note.style.setProperty("--note-r", `${-30 + index * 8}deg`);
      document.body.appendChild(note);
      note.addEventListener("animationend", () => note.remove(), { once: true });
    }
  }

  function setMenu(open, restoreFocus = true) {
    if (!menu || !openButton) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    openButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("ai-schools-menu-open", open);
    if (open) closeButton?.focus();
    else if (restoreFocus) openButton.focus();
  }

  function updateStoryStep() {
    storyFrame = 0;
    if (!story || !storyScenes.length) return;
    const targetLine = window.innerHeight * .36;
    const nearest = storyScenes.reduce((current, scene) => {
      const distance = Math.abs(scene.getBoundingClientRect().top - targetLine);
      return !current || distance < current.distance ? { scene, distance } : current;
    }, null);
    const step = Number(nearest.scene.dataset.storyScene) || 0;
    story.dataset.storyStep = String(step);
    storyLinks.forEach(link => {
      if (Number(link.dataset.storyLink) === step) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }

  function scheduleStoryStep() {
    if (!storyFrame) storyFrame = window.requestAnimationFrame(updateStoryStep);
  }

  openButton?.addEventListener("click", () => {
    burstNotes(openButton);
    setMenu(true);
  });

  closeButton?.addEventListener("click", () => setMenu(false));

  menu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      burstNotes(link);
      setMenu(false, false);
    });
  });

  storyLinks.forEach(link => link.addEventListener("click", () => burstNotes(link)));
  window.addEventListener("scroll", scheduleStoryStep, { passive: true });
  window.addEventListener("resize", scheduleStoryStep);
  updateStoryStep();

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.classList.contains("is-open")) setMenu(false);
  });

  const safetyRehearsal = document.querySelector("#aiSafetyRehearsal");
  const safetyScenes = safetyRehearsal ? [...safetyRehearsal.querySelectorAll("[data-safety-scene]")] : [];
  const safetyIndicators = safetyRehearsal ? [...safetyRehearsal.querySelectorAll(".ai-safety-progress i")] : [];
  const safetyNames = ["Approved environment", "PII recognition", "Safe inputs", "Human review"];
  const safetyAnswers = safetyScenes.map(() => false);
  const safetyPrev = safetyRehearsal?.querySelector("[data-safety-prev]");
  const safetyNext = safetyRehearsal?.querySelector("[data-safety-next]");
  const safetyNumber = document.querySelector("#aiSafetyStepNumber");
  const safetyName = document.querySelector("#aiSafetyStepName");
  const safetyLive = document.querySelector("#aiSafetyLive");
  let safetyStep = 0;

  function updateSafetyMap() {
    safetyScenes.forEach((scene, index) => {
      const name = scene.dataset.checkName;
      document.querySelector(`.ai-schools-check-map [data-check-name="${name}"]`)?.classList.toggle("has-answer", safetyAnswers[index]);
    });
  }

  function showSafetyStep(index, focus = false) {
    if (!safetyScenes.length) return;
    safetyStep = Math.max(0, Math.min(index, safetyScenes.length - 1));
    safetyRehearsal.dataset.safetyStep = String(safetyStep);
    safetyScenes.forEach((scene, sceneIndex) => {
      const active = sceneIndex === safetyStep;
      scene.classList.toggle("is-active", active);
      scene.setAttribute("aria-hidden", String(!active));
    });
    safetyIndicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle("is-current", indicatorIndex === safetyStep);
      indicator.classList.toggle("is-complete", safetyAnswers[indicatorIndex]);
    });
    if (safetyNumber) safetyNumber.textContent = String(safetyStep + 1).padStart(2, "0");
    if (safetyName) safetyName.textContent = safetyNames[safetyStep];
    if (safetyPrev) safetyPrev.disabled = safetyStep === 0;
    if (safetyNext) {
      safetyNext.disabled = !safetyAnswers[safetyStep];
      safetyNext.textContent = safetyStep === safetyScenes.length - 1 ? "See the lab ↓" : "Next guardrail →";
    }
    if (safetyLive) safetyLive.textContent = safetyAnswers[safetyStep] ? "Guardrail reviewed. Continue when ready." : "Choose the safer move to continue.";
    if (focus) safetyScenes[safetyStep].querySelector("h3")?.setAttribute("tabindex", "-1");
    if (focus) safetyScenes[safetyStep].querySelector("h3")?.focus({ preventScroll: true });
  }

  safetyScenes.forEach((scene, sceneIndex) => {
    scene.querySelectorAll("[data-correct]").forEach(choice => {
      choice.addEventListener("click", () => {
        scene.querySelectorAll("[data-correct]").forEach(button => button.classList.remove("is-correct", "is-incorrect"));
        const correct = choice.dataset.correct === "true";
        choice.classList.add(correct ? "is-correct" : "is-incorrect");
        const correctChoice = scene.querySelector('[data-correct="true"]');
        if (!correct && correctChoice) correctChoice.classList.add("is-correct");
        scene.querySelector(".ai-safety-feedback")?.removeAttribute("hidden");
        safetyAnswers[sceneIndex] = true;
        updateSafetyMap();
        showSafetyStep(sceneIndex);
        if (safetyLive) safetyLive.textContent = correct ? "That keeps the guardrail visible." : "The safer move is now highlighted.";
      });
    });
  });

  safetyPrev?.addEventListener("click", () => showSafetyStep(safetyStep - 1, true));
  safetyNext?.addEventListener("click", () => {
    if (safetyStep === safetyScenes.length - 1) {
      document.querySelector("#claritySprint")?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
      return;
    }
    showSafetyStep(safetyStep + 1, true);
  });
  showSafetyStep(0);

  const labShowcase = document.querySelector("#aiLabShowcase");
  const labTabs = labShowcase ? [...labShowcase.querySelectorAll("[data-lab-tab]")] : [];
  const labSlides = labShowcase ? [...labShowcase.querySelectorAll("[data-lab-slide]")] : [];
  const labPrev = labShowcase?.querySelector("[data-lab-prev]");
  const labNext = labShowcase?.querySelector("[data-lab-next]");
  const labStatus = document.querySelector("#aiLabStatus");
  const labNames = ["Choose", "Protect", "Build", "Practice"];
  let labStep = 0;

  function showLabStep(index, focus = false) {
    if (!labSlides.length) return;
    labStep = (index + labSlides.length) % labSlides.length;
    labShowcase.dataset.labStep = String(labStep);
    labTabs.forEach((tab, tabIndex) => {
      const active = tabIndex === labStep;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    labSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === labStep;
      slide.classList.toggle("is-active", active);
      slide.hidden = !active;
    });
    if (labPrev) labPrev.disabled = labStep === 0;
    if (labNext) labNext.textContent = labStep === labSlides.length - 1 ? "Restart: Choose ↺" : `Next: ${labNames[labStep + 1]} →`;
    if (labStatus) labStatus.textContent = `${labNames[labStep]} · ${labStep + 1} of ${labSlides.length}`;
    if (focus) labTabs[labStep]?.focus();
  }

  labTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showLabStep(index));
    tab.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showLabStep(labStep + 1, true);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showLabStep(labStep - 1, true);
      }
    });
  });
  labPrev?.addEventListener("click", () => showLabStep(labStep - 1, true));
  labNext?.addEventListener("click", () => showLabStep(labStep === labSlides.length - 1 ? 0 : labStep + 1, true));
  showLabStep(0);

  labShowcase?.querySelectorAll("[data-lab-task]").forEach(task => {
    task.addEventListener("click", () => {
      labShowcase.querySelectorAll("[data-lab-task]").forEach(button => {
        button.classList.toggle("is-selected", button === task);
        const icon = button.querySelector("i");
        if (icon) icon.textContent = button === task ? "✓" : "";
      });
      const result = labShowcase.querySelector("[data-task-result]");
      if (result) result.textContent = `${task.querySelector("span")?.textContent || "Task"} selected`;
    });
  });

  labShowcase?.querySelector("[data-protect-toggle]")?.addEventListener("click", event => {
    const workbench = event.currentTarget.closest(".ai-redaction-workbench");
    const safe = workbench?.dataset.safeView !== "true";
    if (workbench) workbench.dataset.safeView = String(safe);
    event.currentTarget.textContent = safe ? "Show original" : "Show safe version";
  });

  labShowcase?.querySelectorAll("[data-blueprint-part]").forEach(part => {
    part.addEventListener("click", () => {
      part.classList.toggle("is-added");
      const icon = part.querySelector("i");
      if (icon) icon.textContent = part.classList.contains("is-added") ? "✓" : "+";
      const count = labShowcase.querySelectorAll("[data-blueprint-part].is-added").length;
      const status = labShowcase.querySelector("[data-blueprint-status]");
      if (status) status.textContent = count === 5 ? "Blueprint complete" : `${count} of 5 parts configured`;
    });
  });

  labShowcase?.querySelectorAll("[data-review-check]").forEach(check => {
    check.addEventListener("click", () => {
      check.classList.toggle("is-checked");
      const icon = check.querySelector("i");
      if (icon) icon.textContent = check.classList.contains("is-checked") ? "✓" : "+";
      const count = labShowcase.querySelectorAll("[data-review-check].is-checked").length;
      const readiness = labShowcase.querySelector("[data-review-readiness]");
      const decision = labShowcase.querySelector("[data-review-decision]");
      if (readiness) readiness.textContent = count === 4 ? "Teacher reviewed" : `${count} of 4 checked`;
      if (decision) decision.textContent = count === 4 ? "Ready for the teacher’s final decision" : "Check all four before approving";
    });
  });

  document.querySelectorAll(".ai-schools-context-action").forEach(link => {
    link.addEventListener("click", () => burstNotes(link));
  });

  if (reduceMotion.matches) {
    document.querySelectorAll(".ai-schools-avatar-stage video").forEach(video => video.pause());
  }
})();
