(() => {
  const page = document.querySelector(".timeback-page");
  if (!page) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const story = document.querySelector("#timebackStory");
  const storyMain = document.querySelector(".story-main");

  const noteColors = ["#67ddd2", "#e4a11b", "#ffffff", "#9be8df"];
  const noteGlyphs = ["♪", "♫", "♬", "♩"];
  function burstNotes(control) {
    if (!control || reduceMotion.matches) return;
    const box = control.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + Math.min(box.height / 2, 30);
    for (let index = 0; index < 7; index += 1) {
      const note = document.createElement("span");
      note.className = "music-note";
      note.textContent = noteGlyphs[index % noteGlyphs.length];
      note.style.left = `${x}px`;
      note.style.top = `${y}px`;
      note.style.color = noteColors[index % noteColors.length];
      note.style.setProperty("--note-x", `${(index - 3) * 18}px`);
      note.style.setProperty("--note-y", `${-45 - (index % 3) * 20}px`);
      note.style.setProperty("--note-r", `${-25 + index * 9}deg`);
      document.body.appendChild(note);
      note.addEventListener("animationend", () => note.remove(), { once: true });
    }
  }
  document.querySelectorAll(".story-progress a, .primary-button, .quiet-button, .rail-cta, .mobile-menu a").forEach(control => control.addEventListener("click", () => burstNotes(control)));

  const mobileButton = document.querySelector(".mobile-bar");
  const mobileMenu = document.querySelector("#mobileMenu");
  const mobileClose = mobileMenu?.querySelector("[data-close-menu]");
  function setMobileMenu(open, restoreFocus = true) {
    if (!mobileButton || !mobileMenu) return;
    mobileMenu.hidden = !open;
    mobileButton.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) mobileClose?.focus();
    else if (restoreFocus) mobileButton.focus();
  }
  mobileButton?.addEventListener("click", () => { burstNotes(mobileButton); setMobileMenu(true); });
  mobileClose?.addEventListener("click", () => setMobileMenu(false));
  mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMobileMenu(false, false)));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && mobileMenu && !mobileMenu.hidden) setMobileMenu(false); });

  const sceneSections = [...document.querySelectorAll("[data-scene-section]")];
  const sceneLinks = [...document.querySelectorAll("[data-scene-link]")];
  let sceneFrame = 0;
  function updateScene() {
    sceneFrame = 0;
    if (!story || !sceneSections.length) return;
    const target = window.innerHeight * .42;
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
      if (nextDistance < distance) { current = section; distance = nextDistance; }
    });
    const scene = Number(current.dataset.sceneSection) || 0;
    story.dataset.scene = String(scene);
    sceneLinks.forEach(link => {
      if (Number(link.dataset.sceneLink) === scene) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }
  function scheduleScene() { if (!sceneFrame) sceneFrame = window.requestAnimationFrame(updateScene); }
  storyMain?.addEventListener("scroll", scheduleScene, { passive: true });
  window.addEventListener("scroll", scheduleScene, { passive: true });
  window.addEventListener("resize", scheduleScene);
  updateScene();

  const artifactData = [
    {
      title: "Start with rough notes",
      image: "teacher-time-back/flagship-demo/assets/01-rough-notes.webp",
      alt: "Rough weekly lesson notes and practice source material",
      caption: "The teacher starts with the kind of incomplete notes they already have. This example contains no real people or records.",
      contextTitle: "Rough notes",
      contextCopy: "Start with the work a teacher already has.",
      next: "Next: see the five saved instructions"
    },
    {
      title: "Save five plain-language instructions",
      image: "teacher-time-back/flagship-demo/assets/02-saved-instructions.webp",
      alt: "Five-part saved setup for the Weekly Lesson Setup Assistant",
      caption: "Five answers define the job, the material it may use, the format it should return, when it must stop, and what the teacher will review.",
      contextTitle: "Saved setup",
      contextCopy: "The assistant's job and limits stay visible.",
      next: "Show the first result"
    },
    {
      title: "Review the first result",
      image: "teacher-time-back/flagship-demo/assets/03-first-result.webp",
      alt: "First weekly plan result with a factual mistake and missing decisions visibly marked",
      caption: "The result is organized, but it is not treated as finished. One factual mistake is planted, while missing decisions are correctly marked for the teacher.",
      contextTitle: "First result",
      contextCopy: "Useful structure is not the same as a trusted answer.",
      next: "Show the teacher review"
    },
    {
      title: "The teacher corrects and decides",
      image: "teacher-time-back/flagship-demo/assets/04-teacher-revision.webp",
      alt: "Teacher revision showing a corrected fact and completed timing decisions",
      caption: "The teacher corrects the bus-stop claim, completes the missing timing, adds an accessibility move, and decides the final wording.",
      contextTitle: "Teacher review",
      contextCopy: "The teacher makes the result accurate and usable.",
      next: "Start the walkthrough again"
    }
  ];
  const artifactMarkers = [...document.querySelectorAll("[data-artifact-marker]")];
  const artifactPrev = document.querySelector("[data-artifact-prev]");
  const artifactNext = document.querySelector("[data-artifact-next]");
  let artifactStep = 0;
  function showArtifact(index, focus = false) {
    artifactStep = Math.max(0, Math.min(index, artifactData.length - 1));
    const item = artifactData[artifactStep];
    const image = document.querySelector("[data-artifact-image]");
    if (image) { image.src = item.image; image.alt = item.alt; }
    const set = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
    set("[data-artifact-step]", `${artifactStep + 1} of ${artifactData.length}`);
    set("[data-artifact-title]", item.title);
    set("[data-artifact-caption]", item.caption);
    set("[data-artifact-status]", `Step ${artifactStep + 1} of ${artifactData.length}`);
    set("[data-context-artifact-title]", item.contextTitle);
    set("[data-context-artifact-copy]", item.contextCopy);
    set("[data-context-artifact-step]", `${artifactStep + 1} of ${artifactData.length}`);
    const contextImage = document.querySelector("[data-context-artifact-image]");
    if (contextImage) contextImage.src = item.image;
    artifactMarkers.forEach((marker, markerIndex) => marker.classList.toggle("is-active", markerIndex === artifactStep));
    if (artifactPrev) artifactPrev.disabled = artifactStep === 0;
    if (artifactNext) artifactNext.textContent = item.next;
    if (focus) artifactMarkers[artifactStep]?.querySelector("button")?.focus({ preventScroll: true });
  }
  artifactMarkers.forEach((marker, index) => marker.querySelector("button")?.addEventListener("click", () => showArtifact(index)));
  artifactPrev?.addEventListener("click", () => showArtifact(artifactStep - 1));
  artifactNext?.addEventListener("click", () => showArtifact(artifactStep === artifactData.length - 1 ? 0 : artifactStep + 1));
  showArtifact(0);

  const labData = [
    { time: "Before the build", title: "See the finished product first.", copy: "Andrew shows the same Weekly Lesson Setup Assistant teachers will build. The outcome is concrete before anyone opens an AI tool.", action: "Names one part of the example that would reduce repeated work.", image: "teacher-time-back/flagship-demo/assets/05-before-after.webp", alt: "Before and after view of the Weekly Lesson Setup Assistant example", next: "Next: choose one task", context: "The result becomes clear before the technology is introduced." },
    { time: "0 to 15 minutes", title: "Choose one task worth getting back.", copy: "Teachers name a small job they repeat and can review quickly. The first build is intentionally narrow.", action: "Finishes this sentence: I keep rebuilding…", image: "teacher-time-back/flagship-demo/assets/01-rough-notes.webp", alt: "Rough weekly lesson notes representing a repeated teacher task", next: "Next: check the tool", context: "One bounded task keeps the first build understandable." },
    { time: "15 to 25 minutes", title: "Check the exact tool and staff account.", copy: "The school has already named where the lab will happen. Teachers do not create personal workaround accounts.", action: "Confirms the school-named tool and staff account before entering material.", image: "teacher-time-back/flagship-demo/assets/02-saved-instructions.webp", alt: "Saved assistant setup inside the guided example", next: "Next: build the setup", context: "The school names where the work may happen." },
    { time: "25 to 55 minutes", title: "Answer five questions in plain language.", copy: "Teachers define the job, allowed material, returned format, stop point, and human review. Andrew helps translate each answer into saved instructions.", action: "Builds and saves one reusable five-part setup.", image: "teacher-time-back/flagship-demo/assets/02-saved-instructions.webp", alt: "The five-part Weekly Lesson Setup Assistant instructions", next: "Next: practice and review", context: "Five visible answers replace prompt jargon." },
    { time: "55 to 80 minutes", title: "Practice, catch a mistake, and revise.", copy: "Everyone uses Andrew's ready-made example. Teachers find one factual mistake and see how missing information remains a teacher decision.", action: "Corrects the result and strengthens the saved instruction.", image: "teacher-time-back/flagship-demo/assets/03-first-result.webp", alt: "First AI result with a visible factual mistake for teachers to catch", next: "Next: save and measure", context: "Teachers experience why review is part of the build." },
    { time: "80 to 90 minutes", title: "Save it and define the two-week test.", copy: "Teachers leave knowing what to replace next time, what never to enter, what to review, and how to judge whether the assistant is actually useful.", action: "Chooses a keep, revise, or stop measure based on time plus correction work.", image: "teacher-time-back/flagship-demo/assets/04-teacher-revision.webp", alt: "Teacher-reviewed weekly plan ready for a two-week usefulness test", next: "Start the six steps again", context: "The assistant earns continued use through measured usefulness." }
  ];
  const labPrev = document.querySelector("[data-lab-prev]");
  const labNext = document.querySelector("[data-lab-next]");
  const labDots = [...document.querySelectorAll("[data-lab-dot]")];
  let labStep = 0;
  function showLab(index) {
    labStep = Math.max(0, Math.min(index, labData.length - 1));
    const item = labData[labStep];
    const set = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
    set("[data-lab-time]", item.time);
    set("[data-lab-count]", `Step ${labStep + 1} of ${labData.length}`);
    set("[data-lab-title]", item.title);
    set("[data-lab-copy]", item.copy);
    set("[data-lab-action]", item.action);
    set("[data-context-lab-number]", String(labStep + 1).padStart(2, "0"));
    set("[data-context-lab-title]", item.title);
    set("[data-context-lab-copy]", item.context);
    const image = document.querySelector("[data-lab-image]");
    if (image) { image.src = item.image; image.alt = item.alt; }
    const progress = document.querySelector("[data-lab-progress]");
    if (progress) progress.style.setProperty("--progress", `${((labStep + 1) / labData.length) * 100}%`);
    labDots.forEach((dot, dotIndex) => dot.classList.toggle("is-current", dotIndex === labStep));
    if (labPrev) labPrev.disabled = labStep === 0;
    if (labNext) labNext.textContent = item.next;
  }
  labPrev?.addEventListener("click", () => showLab(labStep - 1));
  labNext?.addEventListener("click", () => showLab(labStep === labData.length - 1 ? 0 : labStep + 1));
  showLab(0);

  const quizTopics = ["Which account?", "Are code names enough?", "What if information is missing?", "Who makes the final decision?"];
  const quizQuestions = [...document.querySelectorAll("[data-quiz-question]")];
  const quizPrev = document.querySelector("[data-quiz-prev]");
  const quizNext = document.querySelector("[data-quiz-next]");
  const quizComplete = quizQuestions.map(() => false);
  let quizStep = 0;
  function showQuiz(index, focus = false) {
    quizStep = Math.max(0, Math.min(index, quizQuestions.length - 1));
    quizQuestions.forEach((question, questionIndex) => { question.hidden = questionIndex !== quizStep; });
    const set = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
    set("[data-quiz-number]", String(quizStep + 1));
    set("[data-quiz-topic]", quizTopics[quizStep]);
    set("[data-context-quiz-number]", String(quizStep + 1));
    set("[data-context-quiz-topic]", quizTopics[quizStep]);
    if (quizPrev) quizPrev.disabled = quizStep === 0;
    if (quizNext) {
      quizNext.disabled = !quizComplete[quizStep];
      quizNext.textContent = quizStep === quizQuestions.length - 1 ? "See what the school prepares" : "Next question";
    }
    set("[data-quiz-live]", quizComplete[quizStep] ? "Safer answer selected. The visual explanation is now visible." : "Choose an answer to reveal the explanation.");
    if (focus) quizQuestions[quizStep].querySelector("h3")?.focus({ preventScroll: true });
  }
  quizQuestions.forEach((question, questionIndex) => {
    question.querySelectorAll("[data-answer]").forEach(answer => {
      answer.addEventListener("click", () => {
        question.querySelectorAll("[data-answer]").forEach(button => button.classList.remove("is-correct", "is-retry"));
        const correct = answer.dataset.answer === "correct";
        answer.classList.add(correct ? "is-correct" : "is-retry");
        const feedback = question.querySelector(".answer-feedback");
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = correct ? "That is the safer move. The example now shows what the decision looks like in practice." : "Consider another choice. This option skips a decision the school or teacher must make.";
        }
        if (!correct) {
          const live = document.querySelector("[data-quiz-live]");
          if (live) live.textContent = "Consider another choice. The visual explanation appears after the safer answer.";
          return;
        }
        question.classList.add("is-resolved");
        quizComplete[questionIndex] = true;
        document.querySelector(`[data-quiz-map="${questionIndex}"]`)?.classList.add("is-complete");
        showQuiz(questionIndex);
      });
    });
  });
  quizPrev?.addEventListener("click", () => showQuiz(quizStep - 1, true));
  quizNext?.addEventListener("click", () => {
    if (quizStep === quizQuestions.length - 1) {
      document.querySelector("#preparation")?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
      return;
    }
    showQuiz(quizStep + 1, true);
  });
  showQuiz(0);

  document.querySelector('.timeback-footer a[href="#top"]')?.addEventListener("click", event => {
    event.preventDefault();
    if (window.innerWidth > 820 && storyMain) storyMain.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    else window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
  });
})();
