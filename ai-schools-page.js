(() => {
  const page = document.querySelector(".page-ai-schools");
  if (!page) return;

  const menu = document.querySelector("#aiSchoolsMobileMenu");
  const story = document.querySelector("#aiTeacherAssistantStory");
  const openButton = document.querySelector(".ai-story-menu-button");
  const closeButton = document.querySelector(".ai-schools-mobile-close");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colors = ["#59ddd0", "#ff91c5", "#d6a838", "#ef7c5a"];
  const glyphs = ["♪", "♫", "♬", "♩"];

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

  openButton?.addEventListener("click", () => {
    burstNotes(openButton);
    setMenu(true);
  });
  closeButton?.addEventListener("click", () => setMenu(false));
  menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    burstNotes(link);
    setMenu(false, false);
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.classList.contains("is-open")) setMenu(false);
  });

  const storyScenes = story ? [...story.querySelectorAll("[data-story-scene]")] : [];
  const storyLinks = story ? [...story.querySelectorAll("[data-story-link]")] : [];
  let storyFrame = 0;

  function updateStoryStep() {
    storyFrame = 0;
    if (!story || !storyScenes.length) return;
    const targetLine = window.innerHeight * .38;
    const containingScene = storyScenes.find(scene => {
      const rect = scene.getBoundingClientRect();
      return rect.top <= targetLine && rect.bottom >= targetLine;
    });
    const nearest = containingScene || storyScenes.reduce((current, scene) => {
      const distance = Math.abs(scene.getBoundingClientRect().top - targetLine);
      return !current || distance < current.distance ? { scene, distance } : current;
    }, null).scene;
    const step = Number(nearest.dataset.storyScene) || 0;
    story.dataset.storyStep = String(step);
    storyLinks.forEach(link => {
      if (Number(link.dataset.storyLink) === step) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }

  function scheduleStoryStep() {
    if (!storyFrame) storyFrame = window.requestAnimationFrame(updateStoryStep);
  }

  storyLinks.forEach(link => link.addEventListener("click", () => burstNotes(link)));
  window.addEventListener("scroll", scheduleStoryStep, { passive: true });
  window.addEventListener("resize", scheduleStoryStep);
  updateStoryStep();

  const timeBackOptions = {
    reuse: {
      drain: "Rebuilding lesson materials",
      name: "Reuse Planner",
      risk: "Lower-risk starting point",
      promise: "Turn an approved lesson or unit into a reusable starting structure instead of facing another blank page.",
      railPromise: "Stop starting lesson structures from a blank page.",
      input: "An approved lesson, unit, or template",
      output: "An editable structure, variations, and checklist",
      boundary: "Student names, student work, grades, or records",
      owner: "instructional choices, accuracy, appropriateness, and final use.",
      success: "A useful first draft the teacher can adapt",
      role: "Reusable planning partner",
      review: "Draft a clearer version of these directions and list any assumptions you made."
    },
    family: {
      drain: "Rewriting family communication",
      name: "Family Message Drafter",
      risk: "Lower-risk with neutral inputs",
      promise: "Turn approved event details and teacher-written notes into clear, editable family updates and reminders.",
      railPromise: "Reuse a reliable message structure without flattening the teacher’s voice.",
      input: "Approved dates, logistics, and a neutral message brief",
      output: "An editable update, reminder, and short-form version",
      boundary: "Student names, behavior details, attendance, grades, or family records",
      owner: "tone, accuracy, context, translation review, and sending.",
      success: "A clear message the teacher can verify and personalize",
      role: "Family communication drafting partner",
      review: "Every family should complete this activity nightly."
    },
    meetings: {
      drain: "Turning meetings into more administrative work",
      name: "Meeting-to-Action Assistant",
      risk: "Lower-risk with de-identified notes",
      promise: "Convert a neutral agenda or de-identified notes into a concise action list, follow-up draft, and next agenda.",
      railPromise: "Make the work after the meeting visible before it becomes another hour.",
      input: "A neutral agenda or notes with identifying details removed",
      output: "Actions, owners, deadlines, and a follow-up draft",
      boundary: "Student cases, personnel matters, confidential decisions, or private records",
      owner: "context, assignments, accuracy, escalation, and distribution.",
      success: "A checked action list that does not recreate the meeting",
      role: "Meeting follow-through partner",
      review: "Summarize the decisions and assign each action to the correct role."
    },
    feedback: {
      drain: "Recreating feedback structures",
      name: "Feedback Framework Builder",
      risk: "More guardrails required",
      promise: "Build rubrics, comment banks, feedback stems, and fictional exemplars without asking AI to judge a student.",
      railPromise: "Prepare the feedback structure while the teacher keeps every student-level judgment.",
      input: "Approved criteria, standards, and fictional examples",
      output: "A rubric draft, comment bank, and feedback stems",
      boundary: "Identifiable student work, grades, disability information, or automated scoring",
      owner: "evaluation, evidence, fairness, feedback, and every final score.",
      success: "A consistent framework, not an automated grade",
      role: "Feedback framework partner",
      review: "Use this rubric structure to create five neutral feedback stems."
    },
    library: {
      drain: "Finding and reusing previous work",
      name: "Teaching Library Organizer",
      risk: "Lower-risk with teacher-owned files",
      promise: "Turn approved teacher-owned materials into a searchable map of reusable lessons, formats, and next-use ideas.",
      railPromise: "Find the useful thing you already made before building it again.",
      input: "Teacher-owned files with student information removed",
      output: "A file map, tags, summaries, and reuse suggestions",
      boundary: "Student submissions, rosters, grades, accommodations, or private school records",
      owner: "file selection, curriculum fit, organization, and what gets reused.",
      success: "The right prior resource becomes easy to find and adapt",
      role: "Teaching resource librarian",
      review: "Organize these approved resources by unit, format, and likely next use."
    }
  };

  const timeButtons = [...document.querySelectorAll("[data-time-drain]")];
  let selectedTimeDrain = "reuse";

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function selectTimeDrain(key, announce = false) {
    const option = timeBackOptions[key];
    if (!option) return;
    selectedTimeDrain = key;
    timeButtons.forEach(button => {
      const selected = button.dataset.timeDrain === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    setText("#recommendationRisk", option.risk);
    setText("#recommendationName", option.name);
    setText("#recommendationPromise", option.promise);
    setText("#recommendationInput", option.input);
    setText("#recommendationOutput", option.output);
    setText("#recommendationBoundary", option.boundary);
    setText("#recommendationOwner", option.owner);
    setText("[data-lab-drain]", option.drain);
    setText("[data-lab-assistant]", option.name);
    setText("[data-lab-success]", option.success);
    setText("[data-blueprint-role]", option.role);
    setText("[data-review-sample]", `“${option.review}”`);
    setText("[data-rail-assistant]", option.name);
    setText("[data-rail-promise]", option.railPromise);
    setText("#contactSelection", option.name);
    const contactType = document.querySelector("#contactProjectType");
    if (contactType) contactType.value = option.drain;
    if (announce) burstNotes(timeButtons.find(button => button.dataset.timeDrain === key));
  }

  timeButtons.forEach(button => button.addEventListener("click", () => selectTimeDrain(button.dataset.timeDrain, true)));
  document.querySelector("[data-use-recommendation]")?.addEventListener("click", event => {
    burstNotes(event.currentTarget);
    document.querySelector("#contact")?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
  });
  selectTimeDrain(selectedTimeDrain);

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
    if (labNext) labNext.textContent = labStep === labSlides.length - 1 ? "Start again" : `Continue to ${labNames[labStep + 1]}`;
    if (labStatus) labStatus.textContent = `${labNames[labStep]}, ${labStep + 1} of ${labSlides.length}`;
    if (focus) labTabs[labStep]?.focus();
  }

  labTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showLabStep(index));
    tab.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") { event.preventDefault(); showLabStep(labStep + 1, true); }
      if (event.key === "ArrowLeft") { event.preventDefault(); showLabStep(labStep - 1, true); }
    });
  });
  labPrev?.addEventListener("click", () => showLabStep(labStep - 1, true));
  labNext?.addEventListener("click", () => showLabStep(labStep === labSlides.length - 1 ? 0 : labStep + 1, true));
  labShowcase?.querySelector("[data-protect-toggle]")?.addEventListener("click", event => {
    const gate = event.currentTarget.closest(".ai-input-gate");
    const safe = gate?.dataset.safeView !== "true";
    if (gate) gate.dataset.safeView = String(safe);
    event.currentTarget.textContent = safe ? "Show original" : "Make this safe";
  });
  labShowcase?.querySelectorAll("[data-blueprint-part]").forEach(part => part.addEventListener("click", () => {
    part.classList.toggle("is-added");
    const icon = part.querySelector("i");
    if (icon) icon.textContent = part.classList.contains("is-added") ? "✓" : "+";
    const count = labShowcase.querySelectorAll("[data-blueprint-part].is-added").length;
    setText("[data-blueprint-status]", count === 5 ? "Blueprint complete" : `${count} of 5 configured`);
  }));
  labShowcase?.querySelectorAll("[data-review-check]").forEach(check => check.addEventListener("click", () => {
    check.classList.toggle("is-checked");
    const icon = check.querySelector("i");
    if (icon) icon.textContent = check.classList.contains("is-checked") ? "✓" : "+";
    const count = labShowcase.querySelectorAll("[data-review-check].is-checked").length;
    setText("[data-review-readiness]", count === 4 ? "Teacher reviewed" : `${count} of 4 checked`);
    setText("[data-review-decision]", count === 4 ? "Ready for the teacher’s final decision" : "Check all four before approving");
  }));
  showLabStep(0);

  const safetyRehearsal = document.querySelector("#aiSafetyRehearsal");
  const safetyScenes = safetyRehearsal ? [...safetyRehearsal.querySelectorAll("[data-safety-scene]")] : [];
  const safetyIndicators = safetyRehearsal ? [...safetyRehearsal.querySelectorAll(".ai-safety-progress i")] : [];
  const safetyNames = ["Check the account", "Remove identifying details", "Use fictional material", "Review before use"];
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
    if (safetyNumber) safetyNumber.textContent = String(safetyStep + 1);
    if (safetyName) safetyName.textContent = safetyNames[safetyStep];
    if (safetyPrev) safetyPrev.disabled = safetyStep === 0;
    if (safetyNext) {
      safetyNext.disabled = !safetyAnswers[safetyStep];
      safetyNext.textContent = safetyStep === safetyScenes.length - 1 ? "Finish" : "Continue";
    }
    if (safetyLive) safetyLive.textContent = safetyAnswers[safetyStep] ? "Safer move selected. The visual now shows the safe state." : "Choose an answer to see the explanation.";
    if (focus) safetyScenes[safetyStep].querySelector("h3")?.focus({ preventScroll: true });
  }

  safetyScenes.forEach((scene, sceneIndex) => {
    const heading = scene.querySelector("h3");
    if (heading) heading.tabIndex = -1;
    scene.querySelectorAll("[data-correct]").forEach(choice => choice.addEventListener("click", () => {
      scene.querySelectorAll("[data-correct]").forEach(button => button.classList.remove("is-correct", "is-incorrect"));
      const correct = choice.dataset.correct === "true";
      choice.classList.add(correct ? "is-correct" : "is-incorrect");
      scene.querySelector(".ai-safety-feedback")?.removeAttribute("hidden");
      if (correct) {
        scene.classList.add("is-resolved");
        safetyAnswers[sceneIndex] = true;
        updateSafetyMap();
        showSafetyStep(sceneIndex);
        if (safetyLive) safetyLive.textContent = "Correct. The example now shows the safer state.";
      } else if (safetyLive) {
        safetyLive.textContent = "Try again. The example stays unchanged until the safer move is selected.";
      }
    }));
  });
  safetyPrev?.addEventListener("click", () => showSafetyStep(safetyStep - 1, true));
  safetyNext?.addEventListener("click", () => {
    if (safetyStep === safetyScenes.length - 1) {
      document.querySelector("#contact")?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
      return;
    }
    showSafetyStep(safetyStep + 1, true);
  });
  showSafetyStep(0);

  document.querySelectorAll(".ai-schools-context-action").forEach(link => link.addEventListener("click", () => burstNotes(link)));
  if (reduceMotion.matches) document.querySelectorAll(".ai-schools-avatar-stage video").forEach(video => video.pause());
})();
