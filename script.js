/* ===== [FIX] Slovo autora — robustní modal + delegace ===== */
(function () {
  // Pokud už modal existuje někde níž, nenačítej znovu
  if (window.__AW_MODAL_BOUND__) return;
  window.__AW_MODAL_BOUND__ = true;

  function openAuthorWordModal(html) {
    closeAuthorWordModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    const dialog = document.createElement('div');
    dialog.className = 'modal';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('tabindex', '-1');
    dialog.innerHTML = `
      <button class="modal-close" aria-label="Zavřít">&times;</button>
      <h3 class="modal-title">Slovo autora</h3>
      <div class="modal-body">${html || '<p>(Autor zatím nic nedodal.)</p>'}</div>
    `;
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') closeAuthorWordModal(); };
    const onOverlay = (e) => { if (e.target === overlay) closeAuthorWordModal(); };
    overlay.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onKey);
    overlay._cleanup = () => { overlay.removeEventListener('click', onOverlay); document.removeEventListener('keydown', onKey); };
    dialog.querySelector('.modal-close').addEventListener('click', (e) => { e.preventDefault(); closeAuthorWordModal(); });
    dialog.focus();
  }
  function closeAuthorWordModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) { overlay._cleanup?.(); overlay.remove(); document.body.style.overflow = ''; }
  }
  function extractAuthorWordHtml(tg) {
    // 1) aria-controls -> #id -> .authorWordText
    const id = tg.getAttribute('aria-controls');
    if (id) {
      const box = document.getElementById(id);
      if (box) {
        const p = box.querySelector('.authorWordText');
        return (p && p.innerHTML) || box.innerHTML;
      }
    }
    // 2) nejbližší .author-word-box -> .authorWordText
    const parent = tg.closest('.author-word-box') || tg.parentElement;
    const p = parent?.querySelector('.authorWordText');
    return (p && p.innerHTML) || '';
  }

  // Delegované KLIKNUTÍ — v capture, aby předběhlo <a> navigaci
  document.addEventListener('click', (e) => {
    const tg = e.target.closest?.('.author-word-toggle');
    if (!tg) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    openAuthorWordModal(extractAuthorWordHtml(tg));
  }, true);

  // Delegované klávesy (Enter/Space)
  document.addEventListener('keydown', (e) => {
    const tg = e.target.closest?.('.author-word-toggle');
    if (!tg) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    openAuthorWordModal(extractAuthorWordHtml(tg));
  }, true);

  // Přístupnost: zajisti role + tabindex na všechny toggly, i kdyby markup byl jiný
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.author-word-toggle').forEach(t => {
      if (!t.hasAttribute('role')) t.setAttribute('role', 'button');
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0');
      t.setAttribute('aria-expanded', 'false');
    });
  });
})();
// script.js — karusely + kliknutelné karty (manuální navigace) + modal "Slovo autora"
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, attrs = {}) => { const n = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => (k in n ? (n[k] = v) : n.setAttribute(k, v))); return n; };

  /* ===== Modal ===== */
  let lastFocused = null;
  function openModal(html, { title = 'Slovo autora' } = {}) {
    closeModal();
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

    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const f = dialog.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const onOverlay = (e) => { if (e.target === overlay) closeModal(); };
    overlay.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onKey);
    overlay._cleanup = () => { overlay.removeEventListener('click', onOverlay); document.removeEventListener('keydown', onKey); };
    dialog.querySelector('.modal-close').addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
    dialog.focus();
  }
  function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;
    overlay._cleanup?.();
    overlay.remove();
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  /* ===== Data ===== */
  function getAuthorsSafe() {
    try { if (window.Utils?.Data?.getAuthors) return window.Utils.Data.getAuthors(); if (Array.isArray(window.DATA?.authors)) return window.DATA.authors; } catch {}
    return [];
  }
  function getPostsSafe() {
    try { if (window.Utils?.Data?.allPosts) return window.Utils.Data.allPosts(); if (Array.isArray(window.DATA?.posts)) return window.DATA.posts.map(p => ({ ...p, date: p.date ? new Date(p.date) : null })); } catch {}
    return [];
  }

  /* ===== Delegace: "Slovo autora" → modal, a zároveň ruční navigace karet ===== */

  // 1) Otevření modalu na toggle
  function extractAuthorWordHtml(toggleEl) {
    const id = toggleEl.getAttribute('aria-controls');
    if (id) {
      const box = document.getElementById(id);
      if (box) {
        const p = box.querySelector('.authorWordText');
        return (p && p.innerHTML) || box.innerHTML || '<p>(Autor zatím nic nedodal.)</p>';
      }
    }
    const parent = toggleEl.closest('.author-word-box') || toggleEl.parentElement;
    const p = parent?.querySelector('.authorWordText');
    return (p && p.innerHTML) || '<p>(Autor zatím nic nedodal.)</p>';
  }

  document.addEventListener('click', (e) => {
    const tg = e.target.closest?.('.author-word-toggle');
    if (!tg) return;
    e.preventDefault();
    e.stopPropagation();
    openModal(extractAuthorWordHtml(tg));
  });

  document.addEventListener('keydown', (e) => {
    const tg = e.target.closest?.('.author-word-toggle');
    if (!tg) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    openModal(extractAuthorWordHtml(tg));
  });

  // 2) Manuální navigace karet (post-card & featured-post), ale NE pokud klik je na .author-word-toggle
  function navigateTo(href) { if (href) window.location.assign(href); }
  document.addEventListener('click', (e) => {
    const onToggle = e.target.closest?.('.author-word-toggle');
    if (onToggle) return; // modal už řešíme výše, nenavigujeme
    const card = e.target.closest?.('.post-card,[data-post-href],.featured-post');
    if (!card) return;
    const href = card.getAttribute('data-post-href') || card.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    navigateTo(href);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest?.('.post-card,[data-post-href],.featured-post');
    if (!card) return;
    const onToggle = e.target.closest?.('.author-word-toggle');
    if (onToggle) return;
    e.preventDefault();
    navigateTo(card.getAttribute('data-post-href') || card.getAttribute('href'));
  });

  /* ===== DOM helpers pro karusely ===== */
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

  /* ===== Autoři ===== */
  let currentSlide = 0;
  function generateAuthorsCarousel() {
    ensureAuthorsCarouselDOM();
    const track = $('#carousel-track'); const dotsWrap = $('#carousel-indicator');
    if (!track || !dotsWrap) return 0;

    const authors = getAuthorsSafe();
    if (!authors.length) {
      track.innerHTML = `<div class="carousel-slide"><p>Autoři zatím nejsou k dispozici.</p></div>`;
      return 1;
    }

    track.innerHTML = ''; dotsWrap.innerHTML = '';
    const perSlide = 4; const slidesNeeded = Math.ceil(authors.length / perSlide);
    for (let i = 0; i < slidesNeeded; i++) {
      const slice = authors.slice(i * perSlide, i * perSlide + perSlide);
      const slide = el('div', { className: 'carousel-slide' });
      slide.innerHTML = slice.map(a => `
        <a href="author.html?id=${encodeURIComponent(a.id)}" class="author-card" aria-label="${(a.name || '').replace(/</g,'&lt;')}">
          <div class="author-image-container"><img src="${a.image}" alt="${(a.name || '').replace(/</g,'&lt;')}" class="author-image" loading="lazy"></div>
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
  function moveAuthorsTo(index) {
    const slides = $$('.authors-carousel .carousel-slide');
    const n = slides.length; if (!n) return;
    if (index < 0) index = n - 1; else if (index >= n) index = 0;
    currentSlide = index;
    const track = $('#carousel-track'); if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
    $$('.authors-carousel .indicator-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }
  function initAuthorsCarousel() {
    if ($$('.authors-carousel .carousel-slide').length < 2) return;
    $('.authors-carousel .carousel-arrow.prev')?.addEventListener('click', () => moveAuthorsTo(currentSlide - 1));
    $('.authors-carousel .carousel-arrow.next')?.addEventListener('click', () => moveAuthorsTo(currentSlide + 1));
  }

  /* ===== Příspěvky ===== */
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
      featured.innerHTML = `<p>Žádné příspěvky zatím nejsou k dispozici.</p>`;
      return 0;
    }

    // FEATURED — použijeme <article ... data-post-href="..."> (ne <a>)
    const fp = posts[0];
    featured.innerHTML = `
      <article class="featured-post" role="link" tabindex="0" data-post-href="post.html?id=${encodeURIComponent(fp.id)}" aria-label="${String(fp.title || '').replace(/</g,'&lt;')}">
        <div class="featured-post-image" style="background-image: url('${fp.image}');"></div>
        <div class="featured-post-content">
          <div class="post-meta">
            <span class="post-date">${fp.date ? fp.date.toLocaleDateString('cs-CZ') : ''}</span>
            <span class="post-category">${(fp.categories && fp.categories[0]) ? String(fp.categories[0]).replace(/</g,'&lt;') : ''}</span>
          </div>
          <h3 class="post-title">${String(fp.title || '').replace(/</g,'&lt;')}</h3>
          <p class="post-excerpt">${String(fp.excerpt || '').replace(/</g,'&lt;')}</p>
          <div class="author-word-box">
            <div class="author-word-toggle" aria-controls="aw-featured">
              <span>Slovo autora</span><span class="arrow">▼</span>
            </div>
            <div id="aw-featured" style="display:none;"><p class="authorWordText">${String(fp.excerpt || '').replace(/</g,'&lt;')}</p></div>
          </div>
        </div>
      </article>
    `;

    const rest = posts.slice(1);
    const track = el('div', { className: 'posts-carousel-track' });
    track.style.display = 'flex';
    track.style.transition = 'transform 0.5s ease';
    postsContainer.appendChild(track);

    const perSlide = 3;
    const slidesNeeded = Math.ceil(rest.length / perSlide);

    for (let i = 0; i < slidesNeeded; i++) {
      const slice = rest.slice(i * perSlide, i * perSlide + perSlide);
      const slide = el('div', { className: 'posts-slide' });
      slide.style.minWidth = '100%';
      slide.style.display = 'flex';
      slide.style.flexWrap = 'wrap';
      slide.style.justifyContent = 'space-between';
      slide.style.gap = '20px';

      // KAŽDÁ KARTA: <article class="post-card" data-post-href="...">
      slide.innerHTML = slice.map(p => `
        <article class="post-card" role="link" tabindex="0" data-post-href="post.html?id=${encodeURIComponent(p.id)}" aria-label="${String(p.title || '').replace(/</g,'&lt;')}" style="display:block;">
          <div class="post-card-image" style="background-image: url('${p.image}');"></div>
          <div class="post-card-content">
            <div class="post-meta">
              <span class="post-date">${p.date ? p.date.toLocaleDateString('cs-CZ') : ''}</span>
              <span class="post-category">${(p.categories && p.categories[0]) ? String(p.categories[0]).replace(/</g,'&lt;') : ''}</span>
            </div>
            <h3 class="post-title">${String(p.title || '').replace(/</g,'&lt;')}</h3>
            <p class="post-excerpt">${String(p.excerpt || '').replace(/</g,'&lt;')}</p>
            <div class="author-word-box">
              <div class="author-word-toggle" aria-controls="aw-${p.id}">
                <span>Slovo autora</span><span class="arrow">▼</span>
              </div>
              <div id="aw-${p.id}" style="display:none;"><p class="authorWordText">${String(p.excerpt || '').replace(/</g,'&lt;')}</p></div>
            </div>
          </div>
        </article>
      `).join('');
      track.appendChild(slide);
    }

    if (indicator) {
      for (let i = 0; i < slidesNeeded; i++) {
        const dot = el('div', { className: 'indicator-dot' + (i === 0 ? ' active' : '') });
        dot.onclick = () => movePostsTo(i);
        indicator.appendChild(dot);
      }
    }

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
    postSlidesCount = track.querySelectorAll('.posts-slide').length;
    if (postSlidesCount <= 1) return;
    $('.posts-carousel .carousel-arrow.prev')?.addEventListener('click', () => movePostsTo(currentPostSlide - 1));
    $('.posts-carousel .carousel-arrow.next')?.addEventListener('click', () => movePostsTo(currentPostSlide + 1));
  }
  function movePostsTo(index) {
    const slides = $$('.posts-carousel-track .posts-slide');
    const n = slides.length; if (!n) return;
    if (index < 0) index = n - 1; else if (index >= n) index = 0;
    currentPostSlide = index;
    const track = $('.posts-carousel-track'); if (track) track.style.transform = `translateX(-${currentPostSlide * 100}%)`;
    $$('#posts-indicator .indicator-dot').forEach((d, i) => d.classList.toggle('active', i === currentPostSlide));
  }

  /* ===== Boot ===== */
  document.addEventListener('DOMContentLoaded', () => {
    try { generateAuthorsCarousel(); initAuthorsCarousel(); } catch (e) { console.error('Autoři:', e); }
    try { generatePostsCarousel(); initPostsCarousel(); } catch (e) { console.error('Příspěvky:', e); }
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('autor');
  const modalRoot = document.getElementById('autor-modal');
  if (!trigger || !modalRoot) return;

  const closeSelectors = '[data-close]';
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modalRoot.classList.add('active');
    modalRoot.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');

    // Zaostři dovnitř modalu (přístupnost)
    const focusable = modalRoot.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable || modalRoot).focus();
  }

  function closeModal() {
    modalRoot.classList.remove('active');
    modalRoot.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-lock');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // Otevření
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  // Zavření (křížek, overlay)
  modalRoot.addEventListener('click', (e) => {
    if (e.target.matches(closeSelectors)) closeModal();
  });

  // Zavření klávesou Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalRoot.classList.contains('active')) {
      closeModal();
    }
  });

  // Export pro případný fallback z popup varianty:
  window.__openAutorModal = openModal;
});

// === Modal: O autorovi (varianta A) ===
(function () {
  // Pokud už kód běží (případ vícenásobného importu), nic dalšího nedělej
  if (window.__autorModalInit) return;
  window.__autorModalInit = true;

  function onReady(cb) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cb, { once: true });
    } else {
      cb();
    }
  }

  onReady(() => {
    const trigger = document.getElementById('autor');
    const modalRoot = document.getElementById('autor-modal');
    if (!trigger || !modalRoot) return;

    const closeAttrSelector = '[data-close]';
    let lastFocused = null;

    function openModal() {
      lastFocused = document.activeElement;
      modalRoot.classList.add('active');
      modalRoot.setAttribute('aria-hidden', 'false');
      document.body.classList.add('scroll-lock');

      // zaostření na první fokusovatelný prvek v modalu
      const focusable = modalRoot.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable || modalRoot).focus();
    }

    function closeModal() {
      modalRoot.classList.remove('active');
      modalRoot.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('scroll-lock');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    // otevření
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    // zavření přes X a overlay
    modalRoot.addEventListener('click', (e) => {
      if (e.target.matches(closeAttrSelector)) {
        closeModal();
      }
    });

    // zavření klávesou Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalRoot.classList.contains('active')) {
        closeModal();
      }
    });

    // zpřístupnění pro jiné skripty (třeba fallback z popupu)
    window.__openAutorModal = openModal;
    window.__closeAutorModal = closeModal;
  });
})();
