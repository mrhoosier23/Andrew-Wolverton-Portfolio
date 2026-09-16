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
