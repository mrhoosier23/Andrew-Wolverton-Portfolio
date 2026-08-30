(() => {
  const page = document.querySelector(".timeback-page");
  if (!page) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const story = document.querySelector("#timebackStory");
  const mobileButton = document.querySelector(".mobile-bar");
  const mobileMenu = document.querySelector("#mobileMenu");
  const mobileClose = mobileMenu?.querySelector("[data-close-menu]");
  const noteColors = ["#59ddd0", "#ff91c5", "#d6a838", "#ef7c5a"];
  const noteGlyphs = ["♪", "♫", "♬", "♩"];

  function burstNotes(control) {
    if (!control || reduceMotion.matches) return;
    const box = control.getBoundingClientRect();
    const originX = box.left + box.width / 2;
    const originY = box.top + Math.min(box.height / 2, 32);
    for (let index = 0; index < 8; index += 1) {
      const note = document.createElement("span");
      note.className = "music-note";
      note.textContent = noteGlyphs[index % noteGlyphs.length];
      note.style.left = `${originX}px`;
      note.style.top = `${originY}px`;
      note.style.color = noteColors[index % noteColors.length];
      note.style.setProperty("--note-x", `${(index - 3.5) * 17}px`);
      note.style.setProperty("--note-y", `${-42 - (index % 3) * 21}px`);
      note.style.setProperty("--note-r", `${-28 + index * 9}deg`);
      document.body.appendChild(note);
      note.addEventListener("animationend", () => note.remove(), { once: true });
    }
  }

  document.querySelectorAll(".story-progress a, .mobile-menu a, .primary-button, .text-button").forEach(control => {
    control.addEventListener("click", () => burstNotes(control));
  });

  function setMobileMenu(open, restoreFocus = true) {
    if (!mobileMenu || !mobileButton) return;
    mobileMenu.hidden = !open;
    mobileButton.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) mobileClose?.focus();
    else if (restoreFocus) mobileButton.focus();
  }

  mobileButton?.addEventListener("click", () => {
    burstNotes(mobileButton);
    setMobileMenu(true);
  });
  mobileClose?.addEventListener("click", () => setMobileMenu(false));
  mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMobileMenu(false, false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobileMenu && !mobileMenu.hidden) setMobileMenu(false);
  });

  const sceneSections = [...document.querySelectorAll("[data-scene-section]")];
  const sceneLinks = [...document.querySelectorAll("[data-scene-link]")];
  let sceneFrame = 0;

  function updateScene() {
    sceneFrame = 0;
    if (!story || !sceneSections.length) return;
    const target = window.innerHeight * .38;
    let current = sceneSections[0];
    let distance = Number.POSITIVE_INFINITY;
    sceneSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= target && rect.bottom >= target) {
        current = section;
        distance = 0;
        return;
      }
      const nextDistance = Math.min(Math.abs(rect.top - target), Math.abs(rect.bottom - target));
      if (nextDistance < distance) {
        current = section;
        distance = nextDistance;
      }
    });
    const scene = Number(current.dataset.sceneSection) || 0;
    story.dataset.scene = String(scene);
    sceneLinks.forEach(link => {
      if (Number(link.dataset.sceneLink) === scene) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }

  function scheduleScene() {
    if (!sceneFrame) sceneFrame = window.requestAnimationFrame(updateScene);
  }
  window.addEventListener("scroll", scheduleScene, { passive: true });
  window.addEventListener("resize", scheduleScene);
  updateScene();

  function wireTabs(buttons, activate) {
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(index, false));
      button.addEventListener("keydown", event => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        activate(next, true);
      });
    });
  }

  const productButtons = [...document.querySelectorAll("[data-product-tab]")];
  const productPanels = [...document.querySelectorAll("[data-product-panel]")];
  function showProduct(index, focus) {
    productButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    productPanels.forEach((panel, panelIndex) => { panel.hidden = panelIndex !== index; });
    if (focus) productButtons[index]?.focus();
  }
  wireTabs(productButtons, showProduct);
  showProduct(0, false);

  const blueprintData = {
    job: {
      number: "01", label: "ONE JOB", title: "Reuse Planner",
      copy: "Turn an approved lesson or unit outline into an editable weekly structure. Nothing else.",
      artifact: ["STARTS WITH", "Approved unit outline", "RETURNS", "Editable weekly structure"],
      why: "A narrow job is easier to review, easier to improve, and less likely to drift into student-level decisions."
    },
    sources: {
      number: "02", label: "SAFE SOURCES", title: "Use only what is named",
      copy: "Blank templates, teacher-written objectives, approved unit outlines, public facts, and fictional practice material.",
      artifact: ["MAY USE", "Student-neutral sources", "NEVER USE", "Student or confidential records"],
      why: "The data boundary is designed before the assistant is used, not after sensitive information has already been entered."
    },
    output: {
      number: "03", label: "EXACT OUTPUT", title: "Make review predictable",
      copy: "Return a weekly table, daily objectives, materials, directions, and a list of teacher decisions still needed.",
      artifact: ["DRAFTS", "A consistent structure", "LABELS", "Missing information"],
      why: "A fixed output makes omissions and invented details easier for a busy teacher to spot."
    },
    refusal: {
      number: "04", label: "REFUSAL RULE", title: "Teach it when to stop",
      copy: "If an input appears to contain student or confidential information, stop without repeating it and ask for a safer replacement.",
      artifact: ["IF IT SEES", "Sensitive information", "IT DOES", "Stop and request replacement"],
      why: "A refusal is part of the finished product, not a warning the teacher is expected to remember later."
    },
    human: {
      number: "05", label: "HUMAN DECISION", title: "The teacher remains responsible",
      copy: "The assistant may draft and organize. The teacher owns accuracy, instructional fit, communication, evaluation, and final use.",
      artifact: ["ASSISTANT", "Drafts and organizes", "TEACHER", "Reviews and decides"],
      why: "The product is persuasive because it promises useful support without pretending professional judgment can be automated away."
    },
    measure: {
      number: "06", label: "TWO-WEEK TEST", title: "Keep, revise, or stop",
      copy: "Compare time before, time with the assistant, correction time, usefulness, and safety slips over two weeks.",
      artifact: ["MEASURE", "Time plus corrections", "DECIDE", "Keep, revise, or stop"],
      why: "The lab does not promise a fixed time saving. Each teacher keeps the workflow only if the evidence supports it."
    }
  };
  const blueprintButtons = [...document.querySelectorAll("[data-blueprint-key]")];
  const blueprintStage = document.querySelector("#blueprintStage");
  function showBlueprint(index, focus) {
    const button = blueprintButtons[index];
    const item = blueprintData[button?.dataset.blueprintKey];
    if (!item) return;
    blueprintButtons.forEach((entry, entryIndex) => {
      const active = entryIndex === index;
      entry.setAttribute("aria-selected", String(active));
      entry.tabIndex = active ? 0 : -1;
    });
    if (blueprintStage && button?.id) blueprintStage.setAttribute("aria-labelledby", button.id);
    const set = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
    set("[data-blueprint-number]", item.number);
    set("[data-blueprint-label]", item.label);
    set("[data-blueprint-title]", item.title);
    set("[data-blueprint-copy]", item.copy);
    set("[data-blueprint-why]", item.why);
    const artifact = document.querySelector("[data-blueprint-artifact]");
    if (artifact) {
      const nodes = artifact.querySelectorAll("span, strong");
      nodes[0].textContent = item.artifact[0];
      nodes[1].textContent = item.artifact[1];
      nodes[2].textContent = item.artifact[2];
      nodes[3].textContent = item.artifact[3];
    }
    if (focus) button.focus();
  }
  wireTabs(blueprintButtons, showBlueprint);
  showBlueprint(0, false);

  const workshopNames = ["Choose", "Protect", "Build", "Practice", "Measure"];
  const workshopButtons = [...document.querySelectorAll("[data-workshop-step]")];
  const workshopSlides = [...document.querySelectorAll("[data-workshop-slide]")];
  const workshopPrev = document.querySelector("[data-workshop-prev]");
  const workshopNext = document.querySelector("[data-workshop-next]");
  const workshopStatus = document.querySelector("#workshopStatus");
  let workshopStep = 0;
  function showWorkshop(index, focus) {
    workshopStep = Math.max(0, Math.min(index, workshopSlides.length - 1));
    workshopButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === workshopStep;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    workshopSlides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== workshopStep; });
    if (workshopPrev) workshopPrev.disabled = workshopStep === 0;
    if (workshopNext) workshopNext.textContent = workshopStep === workshopSlides.length - 1 ? "Start again" : `Continue to ${workshopNames[workshopStep + 1]}`;
    if (workshopStatus) workshopStatus.textContent = `${workshopNames[workshopStep]}, step ${workshopStep + 1} of ${workshopSlides.length}`;
    if (focus) workshopButtons[workshopStep]?.focus();
  }
  wireTabs(workshopButtons, showWorkshop);
  workshopPrev?.addEventListener("click", () => showWorkshop(workshopStep - 1, true));
  workshopNext?.addEventListener("click", () => showWorkshop(workshopStep === workshopSlides.length - 1 ? 0 : workshopStep + 1, true));
  showWorkshop(0, false);

  const safetyNames = ["Check the account", "Remove identifying details", "Choose a student-neutral task", "Review before use"];
  const safetyQuestions = [...document.querySelectorAll("[data-safety-question]")];
  const safetyIndicators = [...document.querySelectorAll(".safety-progress i")];
  const safetyPrev = document.querySelector("[data-safety-prev]");
  const safetyNext = document.querySelector("[data-safety-next]");
  const safetyNumber = document.querySelector("#safetyNumber");
  const safetyLabel = document.querySelector("#safetyLabel");
  const safetyLive = document.querySelector("#safetyLive");
  const safetyComplete = safetyQuestions.map(() => false);
  let safetyStep = 0;

  function showSafety(index, focus) {
    safetyStep = Math.max(0, Math.min(index, safetyQuestions.length - 1));
    safetyQuestions.forEach((question, questionIndex) => {
      const active = questionIndex === safetyStep;
      question.hidden = !active;
      question.classList.toggle("is-active", active);
    });
    safetyIndicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle("is-current", indicatorIndex === safetyStep);
      indicator.classList.toggle("is-complete", safetyComplete[indicatorIndex]);
    });
    if (safetyNumber) safetyNumber.textContent = String(safetyStep + 1);
    if (safetyLabel) safetyLabel.textContent = safetyNames[safetyStep];
    if (safetyPrev) safetyPrev.disabled = safetyStep === 0;
    if (safetyNext) {
      safetyNext.disabled = !safetyComplete[safetyStep];
      safetyNext.textContent = safetyStep === safetyQuestions.length - 1 ? "See the school pilot" : "Continue";
    }
    if (safetyLive) safetyLive.textContent = safetyComplete[safetyStep] ? "Safer move selected. The visual now shows the safe state." : "Choose an answer to reveal the safer state.";
    if (focus) safetyQuestions[safetyStep].querySelector("h3")?.focus({ preventScroll: true });
  }

  safetyQuestions.forEach((question, questionIndex) => {
    question.querySelectorAll("[data-answer]").forEach(answer => {
      answer.addEventListener("click", () => {
        question.querySelectorAll("[data-answer]").forEach(button => button.classList.remove("is-answer-correct", "is-answer-retry"));
        const feedback = question.querySelector(".answer-feedback");
        const correct = answer.dataset.answer === "correct";
        answer.classList.add(correct ? "is-answer-correct" : "is-answer-retry");
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = correct
            ? "Safer move. The visual now shows what this choice looks like in practice."
            : "Try again. This option adds risk or skips a decision the school or teacher must own.";
        }
        if (!correct) {
          if (safetyLive) safetyLive.textContent = "Try again. The visual stays unchanged until the safer move is selected.";
          return;
        }
        question.classList.add("is-resolved");
        safetyComplete[questionIndex] = true;
        document.querySelector(`[data-safety-map="${questionIndex}"]`)?.classList.add("is-complete");
        showSafety(questionIndex, false);
      });
    });
  });
  safetyPrev?.addEventListener("click", () => showSafety(safetyStep - 1, true));
  safetyNext?.addEventListener("click", () => {
    if (safetyStep === safetyQuestions.length - 1) {
      document.querySelector("#pilot")?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
      return;
    }
    showSafety(safetyStep + 1, true);
  });
  showSafety(0, false);

  if (reduceMotion.matches) document.querySelectorAll("video[autoplay]").forEach(video => video.pause());
})();
