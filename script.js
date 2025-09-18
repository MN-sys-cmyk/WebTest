// script.js — karusely + kliknutelné karty + "Slovo autora" jako modal
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, attrs = {}) => { const n = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => (k in n ? (n[k] = v) : n.setAttribute(k, v))); return n; };

  // ---------- MODAL ----------
  let lastFocused = null;
  function openModal(html, { title = 'Slovo autora' } = {}) {
    closeModal(); // pro jistotu
    lastFocused = document.activeElement;

    const overlay = el('div', { className: 'modal-overlay', role: 'presentation' });
    const dialog = el('div', { className: 'modal', role: 'dialog', ariaModal: 'true', ariaLabelledby: 'modal-title', tabIndex: '-1' });

    dialog.innerHTML = `
      <button class="modal-close" aria-label="Zavřít">&times;</button>
      <h3 id="modal-title" class="modal-title">${title}</h3>
      <div class="modal-body">${html}</div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeBtn = dialog.querySelector('.modal-close');

    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') trapFocus(e, dialog);
    };
    const onOverlayClick = (e) => {
      if (e.target === overlay) closeModal();
    };
    const onClose = (e) => {
      e.preventDefault();
      closeModal();
    };

    overlay.addEventListener('click', onOverlayClick);
    closeBtn.addEventListener('click', onClose);
    document.addEventListener('keydown', onKey);

    // ulož handlery pro pozdější odstranění
    overlay._cleanup = () => {
      overlay.removeEventListener('click', onOverlayClick);
      closeBtn.removeEventListener('click', onClose);
      document.removeEventListener('keydown', onKey);
    };

    // fokus do modalu
    dialog.focus();
  }

  function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;
    overlay._cleanup?.();
    overlay.remove();
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function trapFocus(e, root) {
    const focusables = root.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // ---------- DATA BEZPEČNĚ ----------
  function getAuthorsSafe() {
    try {
      if (window.Utils?.Data?.getAuthors) return window.Utils.Data.getAuthors();
      if (Array.isArray(window.DATA?.authors)) return window.DATA.authors;
    } catch (_) {}
    return [];
  }
  function getPostsSafe() {
    try {
      if (window.Utils?.Data?.allPosts) return window.Utils.Data.allPosts();
      if (Array.isArray(window.DATA?.posts)) return window.DATA.posts.map(p => ({ ...p, date: p.date ? new Date(p.date) : null }));
    } catch (_) {}
    return [];
  }

  // ---------- BIND "SLOVO AUTORA" (otevře modal, neodchází z odkazu) ----------
  function bindAuthorWordToggles(root = document) {
    $$('.author-word-toggle', root).forEach(tg => {
      if (tg.dataset.bound === '1') return;
      tg.dataset.bound = '1';
      tg.setAttribute('role', 'button');
      tg.setAttribute('tabindex', '0');
      tg.setAttribute('aria-expanded', 'false');

      const activate = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        // zkusit najít text v sourozenci .authorWordText nebo aria-controls
        let text = '';
        const controlsId = tg.getAttribute('aria-controls');
        if (controlsId) {
          const box = document.getElementById(controlsId);
          const p = box?.querySelector('.authorWordText');
          text = p ? p.innerHTML : (box ? box.innerHTML : '');
        } else {
          const p = tg.parentElement?.querySelector('.authorWordText');
          text = p ? p.innerHTML : '';
        }
        if (!text) text = '<p>(Autor zatím nic nedodal.)</p>';

        openModal(text, { title: 'Slovo autora' });
      };

      tg.addEventListener('click', activate);
      tg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') activate(e);
      });
    });
  }

  // ---------- DOM ENSURE ----------
  function ensureAuthorsCarouselDOM() {
    let wrap = $('.authors-carousel');
    if (!wrap) {
      wrap = el('div', { className: 'authors-carousel' });
      const cont = $('.authors-section .container') || $('.container') || document.body;
      cont.appendChild(wrap);
    }
    if (!$('.authors-carousel .carousel-arrow.prev')) wrap.insertAdjacentHTML('beforeend', `<div class="carousel-arrow prev">❮</div>`);
    if (!$('.authors-carousel .carousel-container')) wrap.insertAdjacentHTML('beforeend', `<div class="carousel-container"><div class="carousel-track" id="carousel-track"></div></div>`);
    else if (!$('#carousel-track')) $('.authors-carousel .carousel-container').innerHTML = `<div class="carousel-track" id="carousel-track"></div>`;
    if (!$('.authors-carousel .carousel-arrow.next')) wrap.insertAdjacentHTML('beforeend', `<div class="carousel-arrow next">❯</div>`);
    if (!$('#carousel-indicator')) wrap.insertAdjacentHTML('beforeend', `<div class="carousel-indicator" id="carousel-indicator"></div>`);
  }
  function ensurePostsCarouselDOM() {
    const latest = $('.latest-posts .container') || $('.latest-posts') || $('.container') || document.body;
    if (!$('#featured-post-container')) latest.insertAdjacentHTML('afterbegin', `<div id="featured-post-container"></div>`);
    let pc = $('.posts-carousel');
    if (!pc) { pc = el('div', { className: 'posts-carousel' }); latest.appendChild(pc); }
    if (!$('.posts-carousel .carousel-arrow.prev')) pc.insertAdjacentHTML('beforeend', `<div class="carousel-arrow prev">❮</div>`);
    if (!$('.posts-carousel .carousel-container')) pc.insertAdjacentHTML('beforeend', `<div class="carousel-container"><div class="posts-container" id="posts-container"></div></div>`);
    else if (!$('#posts-container')) $('.posts-carousel .carousel-container').innerHTML = `<div class="posts-container" id="posts-container"></div>`;
    if (!$('.posts-carousel .carousel-arrow.next')) pc.insertAdjacentHTML('beforeend', `<div class="carousel-arrow next">❯</div>`);
    if (!$('#posts-indicator')) pc.insertAdjacentHTML('beforeend', `<div class="carousel-indicator" id="posts-indicator"></div>`);
  }

  // ===== Autoři =====
  let currentSlide = 0, slidesCount = 0;

  function generateAuthorsCarousel() {
    ensureAuthorsCarouselDOM();
    const track = $('#carousel-track'); const dotsWrap = $('#carousel-indicator');
    if (!track || !dotsWrap) return 0;

    const authors = getAuthorsSafe();
    if (!authors.length) {
      console.warn('[WebTest] Chybí DATA.authors');
      track.innerHTML = `<div class="carousel-slide"><p>Autoři zatím nejsou k dispozici.</p></div>`;
      return 1;
    }

    track.innerHTML = ''; dotsWrap.innerHTML = '';
    const perSlide = 4; const slidesNeeded = Math.ceil(authors.length / perSlide);

    for (let i = 0; i < slidesNeeded; i++) {
      const start = i * perSlide; const slice = authors.slice(start, start + perSlide);
      const slide = el('div', { className: 'carousel-slide' });
      slide.innerHTML = slice.map(a => `
        <a href="author.html?id=${encodeURIComponent(a.id)}" class="author-card" aria-label="${(a.name || '').replace(/</g,'&lt;')}">
          <div class="author-image-container">
            <img src="${a.image}" alt="${(a.name || '').replace(/</g,'&lt;')}" class="author-image" loading="lazy">
          </div>
          <h3 class="author-name">${(a.name || '').replace(/</g,'&lt;')}</h3>
          ${a.genre ? `<p class="author-genre">${String(a.genre).replace(/</g,'&lt;')}</p>` : ""}
        </a>
      `).join('');
      track.appendChild(slide);
    }

    for (let i = 0; i < slidesNeeded; i++) {
      const dot = el('div', { className: 'indicator-dot' + (i === 0 ? ' active' : '') });
      dot.onclick = () => moveAuthorsTo(i);
      dotsWrap.appendChild(dot);
    }
    return slidesNeeded;
  }
  function initAuthorsCarousel() {
    const slides = document.querySelectorAll('.authors-carousel .carousel-slide');
    slidesCount = slides.length; if (slidesCount < 2) return;
    $('.authors-carousel .carousel-arrow.prev')?.addEventListener('click', () => moveAuthorsTo(currentSlide - 1));
    $('.authors-carousel .carousel-arrow.next')?.addEventListener('click', () => moveAuthorsTo(currentSlide + 1));
  }
  function moveAuthorsTo(index) {
    if (index < 0) index = slidesCount - 1; else if (index >= slidesCount) index = 0; currentSlide = index;
    const track = $('#carousel-track'); if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.authors-carousel .indicator-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  // ===== Příspěvky =====
  let currentPostSlide = 0, postSlidesCount = 0;

  function generatePostsCarousel() {
    ensurePostsCarouselDOM();

    const postsContainer = $('#posts-container');
    const indicator = $('#posts-indicator');
    const featured = $('#featured-post-container');
    if (!postsContainer || !featured) return 0;

    postsContainer.innerHTML = ''; indicator && (indicator.innerHTML = ''); featured.innerHTML = '';

    const posts = getPostsSafe().sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0));
    if (!posts.length) {
      console.warn('[WebTest] Chybí DATA.posts');
      featured.innerHTML = `<p>Žádné příspěvky zatím nejsou k dispozici.</p>`;
      return 0;
    }

    const [featuredPost, ...rest] = posts;

    // FEATURED je celý odkaz + toggle
    const awId = `aw-featured`;
    featured.innerHTML = `
      <a class="featured-post" href="post.html?id=${encodeURIComponent(featuredPost.id)}" aria-label="${String(featuredPost.title || '').replace(/</g,'&lt;')}">
        <div class="featured-post-image" style="background-image: url('${featuredPost.image}');"></div>
        <div class="featured-post-content">
          <div class="post-meta">
            <span class="post-date">${featuredPost.date ? featuredPost.date.toLocaleDateString('cs-CZ') : ''}</span>
            <span class="post-category">${(featuredPost.categories && featuredPost.categories[0]) ? String(featuredPost.categories[0]).replace(/</g,'&lt;') : ''}</span>
          </div>
          <h3 class="post-title">${String(featuredPost.title || '').replace(/</g,'&lt;')}</h3>
          <p class="post-excerpt">${String(featuredPost.excerpt || '').replace(/</g,'&lt;')}</p>
          <div class="author-word-box">
            <div class="author-word-toggle" aria-controls="${awId}">
              <span>Slovo autora</span><span class="arrow">▼</span>
            </div>
            <div id="${awId}" style="display:none;"><p class="authorWordText">${String(featuredPost.excerpt || '').replace(/</g,'&lt;')}</p></div>
          </div>
        </div>
      </a>
    `;

    const track = el('div', { className: 'posts-carousel-track' });
    track.style.display = 'flex';
    track.style.transition = 'transform 0.5s ease';
    postsContainer.appendChild(track);

    const perSlide = 3;
    const slidesNeeded = Math.ceil(rest.length / perSlide);

    for (let i = 0; i < slidesNeeded; i++) {
      const start = i * perSlide;
      const slice = rest.slice(start, start + perSlide);

      const slide = el('div', { className: 'posts-slide' });
      slide.style.minWidth = '100%';
      slide.style.display = 'flex';
      slide.style.flexWrap = 'wrap';
      slide.style.justifyContent = 'space-between';
      slide.style.gap = '20px';

      slide.innerHTML = slice.map(p => {
        const id = `aw-${p.id}`;
        return `
        <a class="post-card" href="post.html?id=${encodeURIComponent(p.id)}" role="article" aria-label="${String(p.title || '').replace(/</g,'&lt;')}" style="display:block;">
          <div class="post-card-image" style="background-image: url('${p.image}');"></div>
          <div class="post-card-content">
            <div class="post-meta">
              <span class="post-date">${p.date ? p.date.toLocaleDateString('cs-CZ') : ''}</span>
              <span class="post-category">${(p.categories && p.categories[0]) ? String(p.categories[0]).replace(/</g,'&lt;') : ''}</span>
            </div>
            <h3 class="post-title">${String(p.title || '').replace(/</g,'&lt;')}</h3>
            <p class="post-excerpt">${String(p.excerpt || '').replace(/</g,'&lt;')}</p>
            <div class="author-word-box">
              <div class="author-word-toggle" aria-controls="${id}">
                <span>Slovo autora</span><span class="arrow">▼</span>
              </div>
              <div id="${id}" style="display:none;"><p class="authorWordText">${String(p.excerpt || '').replace(/</g,'&lt;')}</p></div>
            </div>
          </div>
        </a>`;
      }).join('');

      track.appendChild(slide);
    }

    if (indicator) {
      for (let i = 0; i < slidesNeeded; i++) {
        const dot = el('div', { className: 'indicator-dot' + (i === 0 ? ' active' : '') });
        dot.onclick = () => movePostsTo(i);
        indicator.appendChild(dot);
      }
    }

    // navěsit modaly
    bindAuthorWordToggles(featured);
    bindAuthorWordToggles(postsContainer);

    adjustPostsCarouselResponsive(track);
    return slidesNeeded;
  }

  function adjustPostsCarouselResponsive(track) {
    if (!track) return;
    const cards = track.querySelectorAll('.post-card');
    const apply = () => {
      const w = window.innerWidth;
      if (w <= 576)       cards.forEach(c => { c.style.flex = '0 0 100%';                 c.style.maxWidth = '100%'; });
      else if (w <= 992)  cards.forEach(c => { c.style.flex = '0 0 calc(50% - 10px)';    c.style.maxWidth = 'calc(50% - 10px)'; });
      else                cards.forEach(c => { c.style.flex = '0 0 calc(33.333% - 14px)'; c.style.maxWidth = 'calc(33.333% - 14px)'; });
    };
    apply();
    window.addEventListener('resize', apply);
  }

  function initPostsCarousel() {
    const track = $('.posts-carousel-track'); if (!track) return;
    const slides = track.querySelectorAll('.posts-slide');
    postSlidesCount = slides.length; if (postSlidesCount <= 1) return;
    $('.posts-carousel .carousel-arrow.prev')?.addEventListener('click', () => movePostsTo(currentPostSlide - 1));
    $('.posts-carousel .carousel-arrow.next')?.addEventListener('click', () => movePostsTo(currentPostSlide + 1));
  }
  function movePostsTo(index) {
    if (index < 0) index = postSlidesCount - 1; else if (index >= postSlidesCount) index = 0;
    currentPostSlide = index;
    const track = $('.posts-carousel-track'); if (track) track.style.transform = `translateX(-${currentPostSlide * 100}%)`;
    document.querySelectorAll('#posts-indicator .indicator-dot').forEach((d, i) => d.classList.toggle('active', i === currentPostSlide));
  }

  document.addEventListener('DOMContentLoaded', () => {
    try { generateAuthorsCarousel(); initAuthorsCarousel(); } catch (e) { console.error('Autoři:', e); }
    try {
      generatePostsCarousel(); initPostsCarousel();
      const featured = $('#featured-post-container'); if (featured) featured.style.marginBottom = '50px';
    } catch (e) { console.error('Příspěvky:', e); }
  });
})();
