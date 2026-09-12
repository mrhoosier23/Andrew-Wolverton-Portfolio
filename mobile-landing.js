(function () {
  var fullSiteLinks = document.querySelectorAll("[data-full-site]");
  var revealTargets = document.querySelectorAll(".service-tile, .proof-card, .music-card, .about-card, .closing-card");
  var burstLayer = document.querySelector(".note-burst-layer");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var heroGreeter = document.querySelector("#mobileHeroGreeter");
  var heroGreeterAvatar = document.querySelector("#mobileHeroGreeterAvatar");

  window.AWMusicPlayer?.mount();

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

  if (heroGreeter && heroGreeterAvatar) {
    var greetingTimer;
    function showGreeting() {
      window.clearTimeout(greetingTimer);
      heroGreeter.classList.add("is-visible");
    }
    function hideGreeting(delay) {
      window.clearTimeout(greetingTimer);
      greetingTimer = window.setTimeout(function () {
        if (!heroGreeter.matches(":focus-within")) heroGreeter.classList.remove("is-visible");
      }, delay || 0);
    }
    heroGreeterAvatar.addEventListener("click", function () {
      showGreeting();
      hideGreeting(3200);
    });
    heroGreeterAvatar.addEventListener("mouseenter", showGreeting);
    heroGreeterAvatar.addEventListener("mouseleave", function () { hideGreeting(900); });
    heroGreeterAvatar.addEventListener("focus", showGreeting);
    heroGreeterAvatar.addEventListener("blur", function () { hideGreeting(900); });
    try {
      if (!sessionStorage.getItem("aw-mobile-greeter-seen")) {
        sessionStorage.setItem("aw-mobile-greeter-seen", "1");
        window.setTimeout(function () {
          showGreeting();
          hideGreeting(3200);
        }, 700);
      }
    } catch (error) { /* Greeting remains available on interaction. */ }
  }

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
