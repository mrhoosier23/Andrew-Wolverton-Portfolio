(function () {
  var fullSiteLinks = document.querySelectorAll("[data-full-site]");
  var revealTargets = document.querySelectorAll(".choice-card, .proof-card, .schools-card, .music-card, .about-card, .closing-card");
  var burstLayer = document.querySelector(".note-burst-layer");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateStickyContact() {
    document.documentElement.classList.toggle("show-sticky-contact", window.scrollY > window.innerHeight * .72);
  }

  window.addEventListener("scroll", updateStickyContact, { passive: true });
  updateStickyContact();

  fullSiteLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      try { sessionStorage.setItem("aw-full-site", "1"); } catch (error) { /* Continue through the explicit URL. */ }
    });
  });

  revealTargets.forEach(function (target) { target.setAttribute("data-reveal", ""); });

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    document.documentElement.classList.add("reveal-ready");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -9%", threshold: .12 });
    revealTargets.forEach(function (target) { observer.observe(target); });
  }

  function burst(event) {
    if (!burstLayer || reducedMotion.matches) return;
    var rect = event.currentTarget.getBoundingClientRect();
    var x = event.clientX || rect.left + rect.width / 2;
    var y = event.clientY || rect.top + rect.height / 2;
    var symbols = ["♪", "♫", "♬", "♩", "★"];
    var colors = ["#5ddbd1", "#f5ae18", "#ff799e", "#ffffff", "#4c8cff"];

    for (var i = 0; i < 8; i += 1) {
      var note = document.createElement("span");
      note.className = "burst-note";
      note.textContent = symbols[i % symbols.length];
      note.style.setProperty("--x", x + "px");
      note.style.setProperty("--y", y + "px");
      note.style.setProperty("--dx", ((i - 3.5) * 17 + (i % 2 ? 8 : -8)) + "px");
      note.style.setProperty("--dy", (-48 - (i % 4) * 25) + "px");
      note.style.setProperty("--spin", ((i % 2 ? 1 : -1) * (18 + i * 7)) + "deg");
      note.style.setProperty("--size", (18 + (i % 3) * 7) + "px");
      note.style.setProperty("--color", colors[i % colors.length]);
      burstLayer.appendChild(note);
      window.setTimeout(function (node) { node.remove(); }, 800, note);
    }
  }

  document.querySelectorAll(".note-trigger").forEach(function (trigger) {
    trigger.addEventListener("pointerdown", burst);
  });
}());
