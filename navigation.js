(function () {
  "use strict";

  var header = document.querySelector("[data-site-navigation], #siteHeader");
  if (!header) return;

  var nav = header.querySelector("#siteNav, .unified-site-drawer");
  if (!nav) return;

  var current = header.getAttribute("data-current-page") || document.body.getAttribute("data-page") || "Portfolio";
  current = ({ home: "Home", projects: "Work", services: "Services" })[current] || current;

  header.classList.add("unified-navigation");
  nav.classList.add("unified-site-drawer");

  var homeLink = nav.querySelector(".centered-home-link");
  var homeHref = homeLink ? homeLink.getAttribute("href") : (header.getAttribute("data-home-href") || "index.html");
  var logoSrc = header.getAttribute("data-logo-src") || (homeLink && homeLink.querySelector("img") ? homeLink.querySelector("img").getAttribute("src") : "assets/Home Logo.png");

  if (!header.querySelector(".unified-mobile-bar")) {
    var bar = document.createElement("div");
    bar.className = "unified-mobile-bar";
    bar.innerHTML = '<a class="unified-mobile-home" href="' + homeHref + '" aria-label="Andrew Wolverton home"><img src="' + logoSrc + '" alt=""></a>' +
      '<strong class="unified-current-page">' + current + '</strong>' +
      '<button class="unified-menu-toggle" type="button" aria-controls="siteNav" aria-expanded="false">Menu</button>';
    var inner = header.querySelector(".centered-nav-inner") || header;
    inner.insertBefore(bar, inner.firstChild);
  }

  if (!nav.querySelector(".unified-drawer-head")) {
    var drawerHead = document.createElement("div");
    drawerHead.className = "unified-drawer-head";
    drawerHead.innerHTML = '<strong>Andrew Wolverton</strong><button class="unified-menu-close" type="button">Close</button>';
    nav.insertBefore(drawerHead, nav.firstChild);

    var drawerHome = document.createElement("a");
    drawerHome.className = "unified-drawer-home";
    drawerHome.href = homeHref;
    drawerHome.textContent = "Home";
    if (current === "Home") drawerHome.setAttribute("aria-current", "page");
    drawerHead.insertAdjacentElement("afterend", drawerHome);
  }

  var backdrop = header.querySelector(".unified-menu-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("button");
    backdrop.className = "unified-menu-backdrop";
    backdrop.type = "button";
    backdrop.setAttribute("aria-label", "Close portfolio menu");
    header.appendChild(backdrop);
  }

  var toggle = header.querySelector(".unified-menu-toggle");
  var close = nav.querySelector(".unified-menu-close");
  var lastFocus = null;

  function setOpen(open, restoreFocus) {
    document.body.classList.toggle("site-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    nav.setAttribute("aria-hidden", String(!open && window.matchMedia("(max-width: 760px)").matches));
    if (open) {
      lastFocus = document.activeElement;
      close.focus();
    } else if (restoreFocus !== false && lastFocus) {
      lastFocus.focus();
    }
  }

  toggle.addEventListener("click", function () { setOpen(true); });
  close.addEventListener("click", function () { setOpen(false); });
  backdrop.addEventListener("click", function () { setOpen(false); });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setOpen(false, false); });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.classList.contains("site-menu-open")) setOpen(false);
    if (event.key !== "Tab" || !document.body.classList.contains("site-menu-open")) return;
    var focusable = Array.prototype.slice.call(nav.querySelectorAll("a[href], button:not([disabled])"));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  var mobileQuery = window.matchMedia("(max-width: 760px)");
  function syncMode() {
    if (!mobileQuery.matches && !header.classList.contains("unified-standalone-header")) {
      document.body.classList.remove("site-menu-open");
      toggle.setAttribute("aria-expanded", "false");
      nav.removeAttribute("aria-hidden");
    } else if (!document.body.classList.contains("site-menu-open")) {
      nav.setAttribute("aria-hidden", "true");
    }
  }
  mobileQuery.addEventListener ? mobileQuery.addEventListener("change", syncMode) : mobileQuery.addListener(syncMode);
  syncMode();
}());
