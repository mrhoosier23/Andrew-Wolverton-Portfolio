(() => {
  const page = document.querySelector(".page-ai-schools");
  if (!page) return;

  const menu = document.querySelector("#aiSchoolsMobileMenu");
  const openButton = document.querySelector(".ai-story-menu-button");
  const closeButton = document.querySelector(".ai-schools-mobile-close");
  const colors = ["#63ddd1", "#ffc8f7", "#d5a84c", "#ef7c5a"];
  const glyphs = ["♪", "♫", "♬", "♩"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  menu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      burstNotes(link);
      setMenu(false, false);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.classList.contains("is-open")) setMenu(false);
  });

  const checkNames = ["tool-approval", "student-work", "data-boundaries", "decision-owner"];
  const updateClarityMap = () => {
    checkNames.forEach(name => {
      const hasAnswer = Boolean(document.querySelector(`input[name="${name}"]:checked`));
      document.querySelector(`[data-check-name="${name}"]`)?.classList.toggle("has-answer", hasAnswer);
    });
  };

  document.querySelector("#aiClarityForm")?.addEventListener("change", updateClarityMap);
  updateClarityMap();

  document.querySelectorAll(".ai-schools-context-action").forEach(link => {
    link.addEventListener("click", () => burstNotes(link));
  });

  if (reduceMotion.matches) {
    document.querySelectorAll(".ai-schools-avatar-stage video").forEach(video => video.pause());
  }
})();
