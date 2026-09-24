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
      next: "Next: see the saved process"
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
    { time: "0 to 10 minutes", title: "See the finished product and the boundaries.", copy: "Andrew shows the Weekly Lesson Setup Assistant, confirms the school-named tool and staff account, and makes teacher review visible before anyone builds.", action: "Names one part of the workflow that could reduce repeated preparation.", image: "teacher-time-back/flagship-demo/assets/05-before-after.webp", alt: "Before and after view of the Weekly Lesson Setup Assistant example", next: "Next: choose one task", context: "Time back is the goal. The assistant is the mechanism." },
    { time: "10 to 20 minutes", title: "Choose one recurring task.", copy: "Teachers choose a real job they repeat and can review quickly. The flagship build starts with weekly lesson setup so the method stays concrete.", action: "Names the repeated task, the usual starting material, and how long it normally takes.", image: "teacher-time-back/flagship-demo/assets/01-rough-notes.webp", alt: "Rough weekly lesson notes representing a repeated teacher task", next: "Next: capture the process", context: "The first workflow is intentionally narrow and measurable." },
    { time: "20 to 35 minutes", title: "Turn the teacher's process into clear instructions.", copy: "Andrew helps the teacher describe the job, allowed material, useful output, stop point, and review criteria in plain language.", action: "Completes the five-part setup from the way they already work.", image: "teacher-time-back/flagship-demo/assets/02-saved-instructions.webp", alt: "The five-part Weekly Lesson Setup Assistant instructions", next: "Next: build the assistant", context: "The teacher's process becomes the reusable structure." },
    { time: "35 to 55 minutes", title: "Build the Weekly Lesson Setup Assistant.", copy: "Teachers save the setup in the school-named tool and test it with practice material that contains no real student information or confidential records.", action: "Produces one first result and keeps missing information visible.", image: "teacher-time-back/flagship-demo/assets/03-first-result.webp", alt: "First AI result with a visible factual mistake for teachers to catch", next: "Next: strengthen the lesson", context: "The output is a draft for teacher review, not the final decision." },
    { time: "55 to 70 minutes", title: "Add learner variability and useful materials.", copy: "Teachers ask the assistant to surface UDL or accessibility options and downstream material ideas, such as a teaching-deck outline, checks for understanding, or an exit ticket.", action: "Chooses only the options that fit the instructional goal and students in front of them.", image: "teacher-time-back/flagship-demo/assets/04-teacher-revision.webp", alt: "Teacher-reviewed weekly plan with an accessibility move added", next: "Next: test it again", context: "Accessibility is considered earlier, not retrofitted after the lesson is finished." },
    { time: "70 to 80 minutes", title: "Test it on a second lesson and correct what fails.", copy: "Teachers swap in a new practice lesson, review the result, and make at least one correction to the assistant or output.", action: "Proves the setup can be reused instead of succeeding only once.", image: "teacher-time-back/flagship-demo/assets/04-teacher-revision.webp", alt: "Teacher revision showing a corrected result", next: "Next: see the transfer", context: "A reusable workflow has to survive a second use." },
    { time: "80 to 87 minutes", title: "See how the same method transfers.", copy: "Andrew briefly demonstrates a family-communication workflow: clarify, protect exact details, draft, verify, review, and then use the school's approved language-access process.", action: "Identifies another recurring task where the same method could apply without turning it into a second workshop.", image: "teacher-time-back/flagship-demo/assets/02-saved-instructions.webp", alt: "Saved assistant setup representing a transferable teacher workflow", next: "Next: save and measure", context: "The lesson assistant teaches a method that can transfer to other repetitive work." },
    { time: "87 to 90 minutes", title: "Save it, record the baseline, and choose the next use.", copy: "Teachers name the workflow, record how long the task normally takes, and decide when they will use the assistant again. Follow-up measures reuse and total time including correction and review.", action: "Leaves with one saved workflow and a clear time-back test.", image: "teacher-time-back/flagship-demo/assets/05-before-after.webp", alt: "Before and after view of a reusable weekly lesson setup workflow", next: "Start the eight steps again", context: "The workflow earns continued use through measured usefulness." }
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
  /* AI_SCHOOLS_GALLERY_V2: use the page's existing datasets and selected steps. */
  const galleryImages = [...document.querySelectorAll('.hero-outcome img, .artifact-stage img, .lab-stage-visual img')];
  if (galleryImages.length) {
    const overviewImage = document.querySelector('.hero-outcome img');
    const overview = { title: 'From rough notes to a reviewed plan', image: overviewImage?.getAttribute('src'), alt: overviewImage?.alt, caption: 'Bring rough notes. Leave with a reusable setup and a reviewed result.' };
    const galleries = {
      walkthrough: { label: 'Finished product walkthrough', items: artifactData, selected: () => artifactStep, sync: showArtifact },
      workshop: { label: '90-minute workshop', items: labData, selected: () => labStep, sync: showLab },
      overview: { label: 'Lesson setup example', items: [overview, ...artifactData], selected: () => 0 }
    };
    const viewer = document.createElement('dialog');
    viewer.id = 'aiImageViewer';
    viewer.className = 'ai-image-lightbox ai-gallery-viewer';
    viewer.setAttribute('aria-labelledby', 'aiGalleryGroup');
    viewer.innerHTML = `<div class="ai-image-lightbox-shell">
      <div class="ai-gallery-toolbar">
        <div class="ai-gallery-heading"><div><small id="aiGalleryGroup"></small><strong data-image-title></strong></div><button type="button" data-image-close aria-label="Close image viewer">Close</button></div>
        <div class="ai-gallery-navigation" aria-label="Image navigation"><button type="button" data-image-prev aria-label="Previous image">← Previous</button><span data-image-counter role="status" aria-live="polite" aria-atomic="true"></span><button type="button" data-image-next aria-label="Next image">Next →</button></div>
        <div class="ai-gallery-tools"><div role="group" aria-label="Image zoom"><button type="button" data-image-zoom-out aria-label="Zoom out">−</button><button type="button" data-image-zoom-reset aria-label="Fit image to screen">100%</button><button type="button" data-image-zoom-in aria-label="Zoom in">+</button></div><a data-image-original target="_blank" rel="noopener">Open original ↗</a></div>
      </div>
      <div class="ai-image-lightbox-scroll" tabindex="0" role="region" aria-label="Image: zoom to read, then scroll to pan"><div class="ai-gallery-canvas"><img data-image-expanded alt="" draggable="false" /></div><p data-image-error role="status" hidden>Image could not load. Use Open original to try the file directly.</p></div>
      <div class="ai-gallery-footer"><p data-image-caption></p><small data-image-instructions>Swipe left or right, or use Previous and Next.</small></div>
    </div>`;
    document.body.append(viewer);
    const get = selector => viewer.querySelector(selector);
    const viewport = get('.ai-image-lightbox-scroll');
    const canvas = get('.ai-gallery-canvas');
    const prev = get('[data-image-prev]');
    const next = get('[data-image-next]');
    const zoomOut = get('[data-image-zoom-out]');
    const zoomIn = get('[data-image-zoom-in]');
    const reset = get('[data-image-zoom-reset]');
    const close = get('[data-image-close]');
    let expanded = get('[data-image-expanded]');
    let group = null;
    let position = 0;
    let zoom = 1;
    let trigger = null;
    let gesture = null;
    const preloads = new Map();
    const browserZoomed = () => (window.visualViewport?.scale || 1) > 1.02;
    const canSwipe = () => viewer.open && zoom === 1 && !browserZoomed();
    function gestureMode() {
      viewport.style.touchAction = canSwipe() ? 'pan-y pinch-zoom' : 'pan-x pan-y pinch-zoom';
      get('[data-image-instructions]').textContent = canSwipe()
        ? 'Swipe left or right, or use Previous and Next.'
        : 'Scroll to pan. Use Previous / Next, or return to 100% to swipe.';
    }
    function fitImage() {
      if (!viewer.open || !expanded.naturalWidth) return;
      const fit = Math.min((viewport.clientWidth - 24) / expanded.naturalWidth, (viewport.clientHeight - 24) / expanded.naturalHeight, 1);
      expanded.style.width = `${Math.max(1, expanded.naturalWidth * fit * zoom)}px`;
    }
    function setZoom(value) {
      const oldWidth = expanded.getBoundingClientRect().width || 1;
      const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / oldWidth;
      const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / oldWidth;
      zoom = Math.max(1, Math.min(3, value));
      reset.textContent = `${Math.round(zoom * 100)}%`;
      zoomOut.disabled = zoom === 1;
      zoomIn.disabled = zoom === 3;
      gesture = null;
      fitImage();
      const newWidth = expanded.getBoundingClientRect().width;
      viewport.scrollLeft = zoom === 1 ? 0 : centerX * newWidth - viewport.clientWidth / 2;
      viewport.scrollTop = zoom === 1 ? 0 : centerY * newWidth - viewport.clientHeight / 2;
      gestureMode();
    }
    function preloadNeighbors() {
      [position - 1, position + 1].forEach(index => {
        const src = group.items[index]?.image;
        if (!src || preloads.has(src)) return;
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        preloads.set(src, image);
      });
    }
    function showImage(index, sync = true) {
      if (!group || index < 0 || index >= group.items.length) return;
      position = index;
      const item = group.items[position];
      get('#aiGalleryGroup').textContent = group.label;
      get('[data-image-title]').textContent = item.title;
      const counter = get('[data-image-counter]');
      counter.textContent = `${position + 1} of ${group.items.length}`;
      counter.setAttribute('aria-label', `${position + 1} of ${group.items.length}: ${item.title}`);
      get('[data-image-caption]').textContent = item.caption || `${item.time}. ${item.copy}`;
      get('[data-image-original]').href = item.image;
      prev.disabled = position === 0;
      next.disabled = position === group.items.length - 1;
      get('[data-image-error]').hidden = true;
      viewport.setAttribute('aria-busy', 'true');
      const image = new Image();
      image.setAttribute('data-image-expanded', '');
      image.draggable = false;
      image.alt = item.alt || item.title;
      image.decoding = 'async';
      image.addEventListener('load', () => {
        if (expanded !== image) return;
        viewport.setAttribute('aria-busy', 'false');
        fitImage();
      });
      image.addEventListener('error', () => {
        if (expanded !== image) return;
        viewport.setAttribute('aria-busy', 'false');
        get('[data-image-error]').hidden = false;
      });
      expanded = image;
      canvas.replaceChildren(image);
      image.src = item.image;
      setZoom(1);
      viewport.scrollTo(0, 0);
      if (sync && group.sync) group.sync(position);
      if (document.activeElement === next && next.disabled) prev.focus({ preventScroll: true });
      if (document.activeElement === prev && prev.disabled) next.focus({ preventScroll: true });
      preloadNeighbors();
    }
    function openGallery(image, key) {
      group = galleries[key];
      const index = group.selected();
      if (typeof viewer.showModal !== 'function') {
        window.open(group.items[index].image, '_blank', 'noopener');
        return;
      }
      trigger = image;
      if (!viewer.open) viewer.showModal();
      showImage(index, false);
      close.focus({ preventScroll: true });
    }
    galleryImages.forEach(image => {
      const key = image.matches('[data-artifact-image], [data-context-artifact-image]') ? 'walkthrough' : image.matches('[data-lab-image]') ? 'workshop' : 'overview';
      image.classList.add('ai-zoomable-image');
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-haspopup', 'dialog');
      image.setAttribute('aria-controls', viewer.id);
      const updateLabel = () => image.setAttribute('aria-label', `Enlarge ${image.alt || 'example'} and browse ${galleries[key].label.toLowerCase()}`);
      updateLabel();
      new MutationObserver(updateLabel).observe(image, { attributes: true, attributeFilter: ['alt'] });
      const wrap = image.parentElement;
      wrap.classList.add('ai-zoomable-wrap');
      const hint = document.createElement('span');
      hint.className = 'ai-image-zoom-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.textContent = 'Tap to enlarge · Swipe to browse';
      wrap.append(hint);
      image.addEventListener('click', () => openGallery(image, key));
      image.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openGallery(image, key);
      });
    });
    close.addEventListener('click', () => viewer.close());
    prev.addEventListener('click', () => showImage(position - 1));
    next.addEventListener('click', () => showImage(position + 1));
    zoomIn.addEventListener('click', () => setZoom(zoom + .5));
    zoomOut.addEventListener('click', () => setZoom(zoom - .5));
    reset.addEventListener('click', () => setZoom(1));
    viewer.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        const controls = [...viewer.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter(node => node.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus({ preventScroll: true }); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus({ preventScroll: true }); }
        return;
      }

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !canSwipe()) return;
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      showImage(position + (event.key === 'ArrowRight' ? 1 : -1));
    });
    viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener('close', () => { gesture = null; trigger?.focus({ preventScroll: true }); });
    // Reserve one-finger horizontal swipes only at fit. Let the browser pan and pinch.
    viewport.addEventListener('pointerdown', event => {
      if (!event.isPrimary || !canSwipe() || !['touch', 'pen'].includes(event.pointerType)) { gesture = null; return; }
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
    });
    viewport.addEventListener('pointermove', event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = Math.abs(event.clientX - gesture.x), dy = Math.abs(event.clientY - gesture.y);
      if (dy > 14 && dy > dx) gesture = null;
    });
    viewport.addEventListener('pointercancel', () => { gesture = null; });
    viewport.addEventListener('pointerup', event => {
      const start = gesture;
      gesture = null;
      if (!start || start.id !== event.pointerId || !canSwipe()) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.6 || performance.now() - start.time > 900) return;
      showImage(position + (dx < 0 ? 1 : -1));
    });
    window.visualViewport?.addEventListener('resize', () => { gesture = null; gestureMode(); });
    new ResizeObserver(() => fitImage()).observe(viewport);
  }

})();
