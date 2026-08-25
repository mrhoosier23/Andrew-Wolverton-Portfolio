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

  const checkNames = ["approved-environment", "pii-recognition", "safe-inputs", "human-review"];
  const assistantForm = document.querySelector("#aiTeacherAssistantForm");
  const assistantResult = document.querySelector("#aiTeacherAssistantResult");
  const assistantResultTitle = document.querySelector("#aiTeacherAssistantResultTitle");
  const assistantResultCopy = document.querySelector("#aiTeacherAssistantResultCopy");
  const updateClarityMap = () => {
    checkNames.forEach(name => {
      const hasAnswer = Boolean(document.querySelector(`input[name="${name}"]:checked`));
      document.querySelector(`[data-check-name="${name}"]`)?.classList.toggle("has-answer", hasAnswer);
    });
  };

  assistantForm?.addEventListener("change", updateClarityMap);
  updateClarityMap();

  assistantForm?.addEventListener("submit", event => {
    event.preventDefault();
    if (!assistantForm.reportValidity() || !assistantResult || !assistantResultTitle || !assistantResultCopy) return;

    const selected = [...assistantForm.querySelectorAll('input[type="radio"]:checked')];
    const score = selected.reduce((total, input) => total + Number(input.value), 0);

    if (score >= 7) {
      assistantResultTitle.textContent = "You have the guardrails. Now build the assistant.";
      assistantResultCopy.textContent = "Your answers suggest teachers have a solid safety base. The workshop can focus on choosing high-value tasks, configuring reusable workflows, and making the review routine easy enough to use every day.";
    } else if (score >= 4) {
      assistantResultTitle.textContent = "The use case is useful. The safety routine needs tightening.";
      assistantResultCopy.textContent = "Teachers may be ready to save time, but one or more guardrails are inconsistent. Clarify the approved environment, practice identifying student information, and establish safe-input and human-review defaults before scaling the assistant.";
    } else {
      assistantResultTitle.textContent = "Start with the privacy boundary, not the prompt.";
      assistantResultCopy.textContent = "Before teachers build assistants, make the approved environment and student-information rules unmistakable. The first workshop should establish those boundaries, then use fictional or student-neutral material to practice safely.";
    }

    assistantResult.hidden = false;
    assistantResult.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest" });
    assistantResultTitle.focus({ preventScroll: true });
  });

  document.querySelectorAll(".ai-schools-context-action").forEach(link => {
    link.addEventListener("click", () => burstNotes(link));
  });

  if (reduceMotion.matches) {
    document.querySelectorAll(".ai-schools-avatar-stage video").forEach(video => video.pause());
  }
})();
