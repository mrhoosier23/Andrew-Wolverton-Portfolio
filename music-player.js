(function () {
  "use strict";

  const MUSIC_TRACKS = [
    {
      title: "Sad Singin' & Slow Ridin'",
      sources: ["assets/Sad Singin' & Slow Ridin'.wav"],
      meta: "Artist recording and vocal performance"
    },
    {
      title: "El Tango de Britney",
      sources: [
        "assets/El Tango de Britney 8.28 w vocals.wav",
        "assets/El Tango de Britney 8.28 w vocals.WAV",
        "audio/El Tango de Britney 8.28 w vocals.wav",
        "El Tango de Britney 8.28 w vocals.wav"
      ],
      meta: "Arrangement, vocals, and performance"
    },
    {
      title: "Wolverton Mountain",
      sources: [
        "assets/Wolverton Mountain.wav",
        "assets/Wolverton Mountain.WAV",
        "audio/Wolverton Mountain.wav",
        "audio/Wolverton Mountain.WAV",
        "Wolverton Mountain.wav",
        "Wolverton Mountain.WAV"
      ],
      meta: "Bluegrass vocal performance"
    }
  ];

  const qs = (selector, scope = document) => scope?.querySelector(selector) ?? null;
  const qsa = (selector, scope = document) => scope ? [...scope.querySelectorAll(selector)] : [];

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remaining}`;
  }

  function setupMusicPlayer() {
    const player = qs("#musicPlayer");
    const audio = qs("#musicPlayerAudio");
    const close = qs("#closeMusicPlayer");
    const playlist = qs("#playerPlaylist");
    const playerTitle = qs("#playerTrackTitle");
    const playerMeta = qs("#playerTrackMeta");
    const playerProgress = qs("#playerProgressBar");
    const playerCurrent = qs("#playerCurrentTime");
    const playerDuration = qs("#playerDuration");
    const playerPlay = qs("#playerPlay");
    const playerCenter = qs("#playerCenter");
    const playerPrevious = qs("#playerPrevious");
    const playerNext = qs("#playerNext");
    const playerMenu = qs("#playerMenu");
    const menuView = qs("#ipodMenuView");
    const nowView = qs("#ipodNowView");
    const backToMenu = qs("#ipodBackToMenu");
    const workspaceNowPlaying = qs("#workspaceNowPlaying");
    const launchers = [...new Set([
      ...qsa("[data-open-player]"),
      qs("#openMusicFromDesk"),
      qs("#mobileOpenMusicPlayer")
    ].filter(Boolean))];

    if (!player || !audio || !playlist || !menuView || !nowView || !playerTitle || !playerMeta) return;
    if (player.dataset.playerReady === "true") return;
    player.dataset.playerReady = "true";

    let selectedIndex = 0;
    let sourceIndex = 0;
    let currentIndex = 0;
    let currentTrack = MUSIC_TRACKS[0];
    let attemptedPlay = false;
    let lastOpener = null;

    function setView(view) {
      const now = view === "now";
      menuView.hidden = now;
      nowView.hidden = !now;
    }

    function updateSelection() {
      qsa("[data-music-track-index]", playlist).forEach(button => {
        const index = Number(button.dataset.musicTrackIndex);
        const active = index === selectedIndex;
        button.classList.toggle("selected", active);
        button.classList.toggle("active", index === currentIndex);
        if (active && player.classList.contains("open")) button.scrollIntoView({ block: "nearest" });
      });
    }

    function updatePlayState() {
      const playing = !audio.paused;
      playerPlay?.classList.toggle("is-playing", playing);
      launchers.forEach(button => button.classList.toggle("is-playing", playing));
      playerPlay?.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    }

    function setSource(track, index = 0) {
      sourceIndex = index;
      const source = track.sources?.[sourceIndex];
      if (!source) {
        playerMeta.textContent = "Audio file not found. Confirm the song filename in the assets folder.";
        return false;
      }
      audio.src = source;
      audio.load();
      return true;
    }

    function loadTrack(index, shouldPlay = false) {
      currentIndex = (index + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
      selectedIndex = currentIndex;
      currentTrack = MUSIC_TRACKS[currentIndex];
      attemptedPlay = shouldPlay;
      playerTitle.textContent = currentTrack.title;
      playerMeta.textContent = currentTrack.meta;
      if (workspaceNowPlaying) workspaceNowPlaying.textContent = currentTrack.title;
      if (playerProgress) playerProgress.style.width = "0%";
      if (playerCurrent) playerCurrent.textContent = "0:00";
      if (playerDuration) playerDuration.textContent = "0:00";
      setSource(currentTrack, 0);
      updateSelection();
      setView("now");
      if (shouldPlay) audio.play().catch(() => {});
    }

    function moveSelection(direction) {
      if (!menuView.hidden) {
        selectedIndex = (selectedIndex + direction + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
        updateSelection();
      } else {
        loadTrack(currentIndex + direction, true);
      }
    }

    function toggleAudio() {
      if (!menuView.hidden) {
        loadTrack(selectedIndex, true);
        return;
      }
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    }

    function openPlayer(event) {
      lastOpener = event?.currentTarget || null;
      player.classList.add("open");
      player.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setView("menu");
      updateSelection();
      close?.focus();
    }

    function closePlayer() {
      const wasOpen = player.classList.contains("open");
      player.classList.remove("open");
      player.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (wasOpen && lastOpener?.isConnected) lastOpener.focus();
    }

    playlist.replaceChildren();
    MUSIC_TRACKS.forEach((track, index) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.musicTrackIndex = String(index);
      button.innerHTML = `<strong>${track.title}</strong><span class="icon-chevron-right" aria-hidden="true"></span>`;
      button.addEventListener("click", () => loadTrack(index, true));
      item.append(button);
      playlist.append(item);
    });

    audio.addEventListener("loadedmetadata", () => {
      if (playerDuration) playerDuration.textContent = formatTime(audio.duration);
      if (attemptedPlay && audio.paused) audio.play().catch(() => {});
    });
    audio.addEventListener("timeupdate", () => {
      const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      if (playerProgress) playerProgress.style.width = `${percent}%`;
      if (playerCurrent) playerCurrent.textContent = formatTime(audio.currentTime);
    });
    audio.addEventListener("play", () => {
      qs("#audioElement")?.pause();
      qs("#portfolioVideo")?.pause();
      attemptedPlay = false;
      updatePlayState();
    });
    audio.addEventListener("pause", updatePlayState);
    audio.addEventListener("ended", () => loadTrack(currentIndex + 1, true));
    audio.addEventListener("error", () => {
      if (sourceIndex + 1 < (currentTrack.sources?.length || 0)) {
        setSource(currentTrack, sourceIndex + 1);
        if (attemptedPlay) audio.play().catch(() => {});
        return;
      }
      playerMeta.textContent = "Audio file not found. Add the song to the assets folder using its exact filename.";
    });

    launchers.forEach(button => button.addEventListener("click", openPlayer));
    close?.addEventListener("click", closePlayer);
    backToMenu?.addEventListener("click", () => setView("menu"));
    playerMenu?.addEventListener("click", () => setView("menu"));
    playerPrevious?.addEventListener("click", () => moveSelection(-1));
    playerNext?.addEventListener("click", () => moveSelection(1));
    [playerPlay, playerCenter].forEach(button => button?.addEventListener("click", toggleAudio));
    player.addEventListener("click", event => {
      if (event.target === player) closePlayer();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && player.classList.contains("open")) closePlayer();
    });

    currentTrack = MUSIC_TRACKS[0];
    setSource(currentTrack, 0);
    updateSelection();
    updatePlayState();
    setView("menu");
  }

  window.AWMusicPlayer = { mount: setupMusicPlayer, tracks: MUSIC_TRACKS };
}());
