/* Progressive enhancement: the native playlist remains usable without this script. */
(() => {
  'use strict';
  window.AWMusicPlayer?.mount();
  const audio = document.getElementById('musicPlayerAudio');
  const modal = document.getElementById('musicPlayer');
  modal?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !modal.classList.contains('open')) return;
    const controls = [...modal.querySelectorAll('button:not([disabled]), a[href], input')].filter(node => node.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const frame = document.getElementById('livePlaylistPlayer');
  const list = document.getElementById('playlistVideos');
  const status = document.getElementById('playlistStatus');
  const count = document.getElementById('playlistCount');
  const now = document.getElementById('playlistNow');
  if (!frame || !list || !status || !count || !now) return;
  const playlistId = 'PLTQDNFQDrA_clcMyYyz1Sg-CqkfMfAYMJ';
  const previous = document.querySelector('[data-playlist-previous]');
  const next = document.querySelector('[data-playlist-next]');
  const titles = new Map();
  let player, ready = false, ids = [], positions = [], attempts = 0, timer;
  const nativeUrl = new URL(frame.src);
  if (nativeUrl.searchParams.get('origin') !== location.origin) {
    nativeUrl.searchParams.set('origin', location.origin);
    frame.src = nativeUrl.href;
  }

  function fallback() {
    if (ids.length) return;
    status.hidden = false;
    status.textContent = 'YouTube has not returned the video list here. Try the player, or use the full-playlist link below to browse on YouTube.';
  }
  function activeIndex() {
    try { return ready ? player.getPlaylistIndex() : -1; } catch (_) { return -1; }
  }
  function updateActive() {
    const index = activeIndex();
    [...list.children].forEach((row, i) => {
      const link = row.firstElementChild;
      if (positions[i] === index) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    const visibleIndex = positions.indexOf(index);
    if (visibleIndex >= 0) {
      const label = `${visibleIndex + 1} / ${ids.length} · ${titles.get(ids[visibleIndex]) || `Performance ${visibleIndex + 1}`}`;
      if (now.textContent !== label) now.textContent = label;
    }
    previous.disabled = !ready || !ids.length || index <= positions[0];
    next.disabled = !ready || !ids.length || index >= positions[positions.length - 1];
  }
  function putTitle(id, title) {
    if (!title || typeof title !== 'string') return;
    titles.set(id, title);
    list.querySelectorAll(`[data-video-id="${id}"]`).forEach(link => {
      link.querySelector('.playlist-video-title').textContent = title;
      link.setAttribute('aria-label', `Play ${title}`);
    });
    updateActive();
  }
  async function hydrateTitles(videoIds) {
    // Bounded, optional oEmbed requests. A failed title never breaks playback.
    const queue = videoIds.filter(id => !titles.has(id));
    async function worker() {
      while (queue.length) {
        const id = queue.shift();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
          const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
          const response = await fetch(url, { signal: controller.signal, credentials: 'omit' });
          if (response.ok) putTitle(id, (await response.json()).title);
        } catch (_) { /* Keep the numbered thumbnail and a working link. */ }
        finally { clearTimeout(timeout); }
      }
    }
    await Promise.all(Array.from({ length: Math.min(4, queue.length) }, worker));
  }
  function render(entries) {
    ids = entries.map(entry => entry.id);
    positions = entries.map(entry => entry.index);
    const fragment = document.createDocumentFragment();
    ids.forEach((id, index) => {
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'playlist-video';
      link.href = `https://www.youtube.com/watch?v=${id}&list=${playlistId}&index=${positions[index] + 1}`;
      link.target = '_blank'; link.rel = 'noopener noreferrer'; link.dataset.videoId = id;
      const number = document.createElement('span'); number.className = 'video-number'; number.textContent = String(index + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
      const image = document.createElement('img'); image.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; image.width = 160; image.height = 90; image.loading = 'lazy'; image.alt = '';
      const title = document.createElement('span'); title.className = 'playlist-video-title'; title.textContent = titles.get(id) || `Performance ${index + 1}`;
      link.setAttribute('aria-label', `Play ${title.textContent}`);
      link.append(number, image, title);
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !ready) return;
        event.preventDefault();
        audio?.pause();
        try {
          player.playVideoAt(positions[index]);
          if (window.matchMedia('(max-width: 820px)').matches) {
            frame.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          }
        }
        catch (_) { window.open(link.href, '_blank', 'noopener,noreferrer'); }
      });
      row.append(link); fragment.append(row);
    });
    list.replaceChildren(fragment);
    count.textContent = `${ids.length} video${ids.length === 1 ? '' : 's'}`;
    status.hidden = true;
    updateActive();
    hydrateTitles(ids);
  }
  function readPlaylist() {
    clearTimeout(timer);
    let incoming;
    try { incoming = player.getPlaylist(); } catch (_) { incoming = []; }
    if (Array.isArray(incoming) && incoming.length) {
      const valid = incoming.map((id, index) => ({ id, index })).filter(entry => /^[\w-]{11}$/.test(entry.id));
      if (valid.length && (valid.map(entry => entry.id).join(',') !== ids.join(',') || valid.map(entry => entry.index).join(',') !== positions.join(','))) render(valid);
      if (valid.length) { updateActive(); return; }
    }
    if (++attempts < 20) timer = setTimeout(readPlaylist, 500);
    else fallback();
  }
  function attachPlayer() {
    if (player || !window.YT?.Player) return;
    player = new YT.Player(frame.id, {
      events: {
        onReady: event => {
          player = event.target; ready = true;
          // Cue, never autoplay. This also populates getPlaylist before a visitor presses play.
          let cued;
          try { cued = player.getPlaylist(); } catch (_) { cued = []; }
          if (!cued?.length) player.cuePlaylist({ listType: 'playlist', list: playlistId, index: 0 });
          readPlaylist();
        },
        onStateChange: event => {
          if (event.data === 1) audio?.pause();
          readPlaylist();
        },
        onError: () => {
          now.textContent = 'This performance may not be available in the embedded player. Try another video or open the playlist on YouTube.';
          if (!ids.length) fallback();
        },
        onAutoplayBlocked: () => { now.textContent = 'Press play in the video to start this performance.'; }
      }
    });
  }
  previous?.addEventListener('click', () => { if (ready) player.previousVideo(); });
  next?.addEventListener('click', () => { if (ready) player.nextVideo(); });
  audio?.addEventListener('play', () => { if (ready) player.pauseVideo(); });
  const existingReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    try { existingReady?.(); } finally { attachPlayer(); }
  };
  function loadApi() {
    if (window.YT?.Player) { attachPlayer(); return; }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api'; script.async = true;
      script.addEventListener('error', fallback); document.head.append(script);
    }
    setTimeout(() => { if (!ready) fallback(); }, 15000);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { loadApi(); observer.disconnect(); }
    }, { rootMargin: '350px' });
    observer.observe(frame);
  } else loadApi();
})();
