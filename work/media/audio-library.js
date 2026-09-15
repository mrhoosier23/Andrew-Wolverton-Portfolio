(function () {
  "use strict";
  const player = document.getElementById("audioLibraryPlayer");
  const library = document.getElementById("audioLibraryTracks");
  if (!player || !library) return;
  const dataUrl = new URL("audio-library.json", document.currentScript.src);
  const title = document.getElementById("audioLibraryTitle");
  const context = document.getElementById("audioLibraryContext");
  const count = document.getElementById("audioLibraryCount");
  const status = document.getElementById("audioLibraryStatus");
  const previous = document.getElementById("audioLibraryPrevious");
  const next = document.getElementById("audioLibraryNext");
  const toggle = document.getElementById("audioLibraryToggle");
  let interacted = false;
  let currentId = "full-dance-mix";
  let tracks = Array.from(library.querySelectorAll("[data-library-track]")).map(function (button) {
    return {id: button.dataset.libraryTrack, title: button.querySelector("strong").textContent,
      src: button.dataset.librarySrc, context: button.querySelector("small").textContent, group: "other"};
  });
  function setStatus(message) { status.textContent = message; }
  function updateSelection() {
    library.querySelectorAll("[data-library-track]").forEach(function (button) {
      const active = button.dataset.libraryTrack === currentId;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-selected", active);
      if (active && button.closest("details")) button.closest("details").open = true;
    });
  }
  function selectTrack(id, scroll) {
    const track = tracks.find(function (item) { return item.id === id; });
    if (!track) return;
    player.pause();
    currentId = track.id;
    player.src = track.src;
    player.load();
    title.textContent = track.title;
    context.textContent = track.context;
    setStatus("");
    toggle.textContent = "Play";
    updateSelection();
    if (scroll && window.matchMedia("(max-width:760px)").matches) {
      player.closest(".wire-player").scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth", block: "start"
      });
    }
  }
  function makeButton(track) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "library-track";
    button.dataset.libraryTrack = track.id;
    button.dataset.librarySrc = track.src;
    const icon = document.createElement("span");
    icon.className = "file-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "♫";
    const name = document.createElement("strong");
    name.textContent = track.title;
    const detail = document.createElement("small");
    const duration = Number.isFinite(track.duration) && track.duration > 0
      ? " · " + Math.floor(track.duration / 60) + ":" + String(track.duration % 60).padStart(2, "0") : "";
    detail.textContent = track.context + duration;
    button.append(icon, name, detail);
    return button;
  }
  function render(available) {
    if (!available.length) return;
    tracks = available;
    const hadSelection = tracks.some(function (track) { return track.id === currentId; });
    const hasDance = tracks.some(function (track) { return track.group !== "other"; });
    const groups = [["featured", "Featured dance mixes"], ["more", "More dance mixes"], ["other", "Other audio projects"]];
    library.replaceChildren();
    groups.forEach(function (group) {
      const items = tracks.filter(function (track) { return track.group === group[0]; });
      if (!items.length) return;
      const collapsible = group[0] === "more" || (group[0] === "other" && hasDance);
      const section = document.createElement(collapsible ? "details" : "section");
      section.className = "audio-library-group";
      const heading = document.createElement(collapsible ? "summary" : "h3");
      heading.textContent = (hasDance ? group[1] : "Audio examples") + " (" + items.length + ")";
      section.append(heading);
      items.forEach(function (track) { section.append(makeButton(track)); });
      library.append(section);
    });
    count.textContent = "Audio library · " + tracks.length + " recording" + (tracks.length === 1 ? "" : "s");
    // Do not interrupt a visitor who has already started listening while availability checks run.
    if (!hadSelection || (!interacted && hasDance && currentId === "full-dance-mix")) selectTrack(tracks[0].id, false);
    else updateSelection();
  }
  library.addEventListener("click", function (event) {
    const button = event.target.closest("[data-library-track]");
    if (!button || !library.contains(button)) return;
    interacted = true;
    selectTrack(button.dataset.libraryTrack, true);
  });
  function step(direction) {
    if (!tracks.length) return;
    interacted = true;
    const index = tracks.findIndex(function (track) { return track.id === currentId; });
    selectTrack(tracks[(index + direction + tracks.length) % tracks.length].id, false);
  }
  previous.addEventListener("click", function () { step(-1); });
  next.addEventListener("click", function () { step(1); });
  toggle.addEventListener("click", function () {
    interacted = true;
    if (player.paused) player.play().catch(function () { setStatus("Playback could not start. Try the audio player's controls."); });
    else player.pause();
  });
  player.addEventListener("play", function () {
    interacted = true;
    setStatus("");
    document.querySelectorAll("audio,video").forEach(function (media) { if (media !== player) media.pause(); });
  });
  ["play", "pause", "ended", "emptied"].forEach(function (name) {
    player.addEventListener(name, function () { toggle.textContent = player.paused ? "Play" : "Pause"; });
  });
  player.addEventListener("error", function () { setStatus("This recording could not load. Please choose another example or refresh the page."); });
  function validTrack(track) {
    if (!track || typeof track.id !== "string" || typeof track.title !== "string" || typeof track.context !== "string") return false;
    if (!["featured", "more", "other"].includes(track.group) || typeof track.src !== "string") return false;
    const url = new URL(track.src, window.location.href);
    return url.origin === window.location.origin && url.pathname.startsWith("/assets/") && url.pathname.endsWith(".mp3");
  }
  async function audioExists(track) {
    if (!track.verify) return true;
    const controller = new AbortController();
    const timeout = setTimeout(function () { controller.abort(); }, 5000);
    try {
      // HEAD avoids downloading all six mixes just to build the playlist.
      const response = await fetch(track.src, {method: "HEAD", cache: "no-store", signal: controller.signal});
      const type = response.headers.get("content-type") || "";
      const size = response.headers.get("content-length");
      return response.ok && /^(audio\/(mpeg|mp3)|application\/octet-stream)(;|$)/i.test(type)
        && (size === null || Number(size) > 1024);
    } catch (error) { return false; }
    finally { clearTimeout(timeout); }
  }
  render(tracks);
  fetch(dataUrl, {cache: "no-cache"}).then(function (response) {
    if (!response.ok) throw new Error("Playlist unavailable");
    return response.json();
  }).then(async function (data) {
    if (data.version !== 1 || !Array.isArray(data.tracks)) return;
    const seen = new Set();
    const candidates = data.tracks.filter(function (track) {
      if (!validTrack(track) || seen.has(track.id)) return false;
      seen.add(track.id); return true;
    });
    const availability = await Promise.all(candidates.map(audioExists));
    render(candidates.filter(function (track, index) { return availability[index]; }));
  }).catch(function () {
    // The existing recordings and native audio controls remain usable if the manifest cannot load.
  });
}());
