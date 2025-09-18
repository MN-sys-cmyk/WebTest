// script.js — robustní verze karuselů (autoři + příspěvky)

(function () {
  // --- Pomůcky
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}) => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => (k in n ? (n[k] = v) : n.setAttribute(k, v)));
    return n;
  };

  // Bezpečné čtení dat i při starším data.js
  function getAuthorsSafe() {
    try {
      if (window.Utils?.Data?.getAuthors) return window.Utils.Data.getAuthors();
      if (Array.isArray(window.DATA?.authors)) return window.DATA.authors;
      if (Array.isArray(window.authorsData)) return window.authorsData; // fallback na starší název
    } catch (_) {}
    return [];
  }
  function getPostsSafe() {
    try {
      if (window.Utils?.Data?.allPosts) return window.Utils.Data.allPosts();
      if (Array.isArray(window.DATA?.posts)) {
        // normalizuj datum
        return window.DATA.posts.map(p => ({ ...p, date: p.date ? new Date(p.date) : null }));
      }
      if (Array.isArray(window.postsData)) return window.postsData; // fallback na starší název
    } catch (_) {}
    return [];
  }

  // Vytvoř chybějící markup, pokud by v HTML absentoval
  function ensureAuthorsCarouselDOM() {
    let wrap = $('.authors-carousel');
    if (!wrap) {
      // vytvoř celou sekci, pokud chybí
      wrap = el('div', { className: 'authors-carousel' });
      const cont = $('.authors-section .container') || $('.container') || document.body;
      cont.appendChild(wrap);
    }
    if (!$('.authors-carousel .carousel-arrow.prev')) {
      wrap.insertAdjacentHTML('beforeend', `<div class="carousel-arrow prev">❮</div>`);
    }
    if (!$('.authors-carousel .carousel-container')) {
      wrap.insertAdjacentHTML('beforeend', `<div class="carousel-container"><div class="carousel-track" id="carousel-track"></div></div>`);
    } else if (!$('#carousel-track')) {
      $('.authors-carousel .carousel-container').innerHTML = `<div class="carousel-track" id="carousel-track"></div>`;
    }
    if (!$('.authors-carousel .carousel-arrow.next')) {
      wrap.insertAdjacentHTML('beforeend', `<div class="carousel-arrow next">❯</div>`);
    }
    if (!$('#carousel-indicator')) {
      wrap.insertAdjacentHTML('beforeend', `<div class="carousel-indicator" id="carousel-indicator"></div>`);
    }
  }

  function ensurePostsCarouselDOM() {
    const latest = $('.latest-posts .container') || $('.latest-posts') || $('.container') || document.body;
    if (!$('#featured-post-container')) {
      latest.insertAdjacentHTML('afterbegin', `<div id="featured-post-container"></div>`);
    }
    let pc = $('.posts-carousel');
    if (!pc) {
      pc = el('div', { className: 'posts-carousel' });
      latest.appendChild(pc);
    }
    if (!$('.posts-carousel .carousel-arrow.prev')) {
      pc.insertAdjacentHTML('beforeend', `<div class="carousel-arrow prev">❮</div>`);
    }
    if (!$('.posts-carousel .carousel-container')) {
      pc.insertAdjacentHTML('beforeend', `<div class="carousel-container"><div class="posts-container" id="posts-container"></div></div>`);
    } else if (!$('#posts-container')) {
      $('.posts-carousel .carousel-container').innerHTML = `<div class="posts-container" id="posts-container"></div>`;
    }
    if (!$('.posts-carousel .carousel-arrow.next')) {
      pc.insertAdjacentHTML('beforeend', `<div class="carousel-arrow next">❯</div>`);
    }
    if (!$('#posts-indicator')) {
      pc.insertAdjacentHTML('beforeend', `<div class="carousel-indicator" id="posts-indicator"></div>`);
    }
  }

  // ===== Autorské karusely =====
  let currentSlide = 0;
  let slidesCount = 0;

  function generateAuthorsCarousel() {
    ensureAuthorsCarouselDOM();

    const track = $('#carousel-track');
    const dotsWrap = $('#carousel-indicator');
    if (!track || !dotsWrap) return 0;

    const authors = getAuthorsSafe();
    if (!authors.length) {
      console.warn('[WebTest] Nenačteni autoři. Zkontroluj: data.js (window.DATA.authors) a pořadí skriptů.');
      track.innerHTML = `<div class="carousel-slide"><p>Autoři zatím nejsou k dispozici.</p></div>`;
      return 1;
    }

    track.innerHTML = '';
    dotsWrap.innerHTML = '';

    const perSlide = 4;
    const slidesNeeded = Math.ceil(authors.length / perSlide);

    for (let i = 0; i < slidesNeeded; i++) {
      const start = i * perSlide;
      const slice = authors.slice(start, start + perSlide);
      const slide = el('div', { className: 'carousel-slide' });
      slide.innerHTML = slice.map(a => `
        <a href="author.html?id=${encodeURIComponent(a.id)}" class="author-card">
          <div class="author-image-container">
            <img src="${a.image}" alt="${(a.name || '').replace(/</g,'&lt;')}" class="author-image" loading="lazy">
          </div>
          <h3 class="author-name">${(a.name || '').replace(/</g,'&lt;')}</h3>
          ${a.genre ? `<p class="author-genre">${String(a.genre).replace(/</g,'&lt;')}</p>` : ""}
        </a>
      `).join('');
      track.appendChild(slide);

      const dot = el('div', { className: 'indicator-dot' + (i === 0 ? ' active' : '') });
      dot.onclick = () => moveAuthorsTo(i);
      dotsWrap.appendChild(dot);
    }
    return slidesNeeded;
  }

  function initAuthorsCarousel() {
    const slides = document.querySelectorAll('.authors-carousel .carousel-slide');
    slidesCount = slides.length;
    if (slidesCount < 2) return;

    const prev = $('.authors-carousel .carousel-arrow.prev');
    const next = $('.authors-carousel .carousel-arrow.next');
    prev?.addEventListener('click', () => moveAuthorsTo(currentSlide - 1));
    next?.addEventListener('click', () => moveAuthorsTo(currentSlide + 1));
  }

  function moveAuthorsTo(index) {
    if (index < 0) index = slidesCount - 1;
    else if (index >= slidesCount) index = 0;
    currentSlide = index;

    const track = $('#carousel-track');
    if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

    document.querySelectorAll('.authors-carousel .indicator-dot')
      .forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  // ===== Karusel příspěvků =====
  let currentPostSlide = 0;
  let postSlidesCount = 0;

  function generatePostsCarousel() {
    ensurePostsCarouselDOM();

    const postsContainer = $('#posts-container');
    const indicator = $('#posts-indicator');
    const featured = $('#featured-post-container');
    if (!postsContainer || !featured) return 0;

    postsContainer.innerHTML = '';
    if (indicator) indicator.innerHTML = '';
    featured.innerHTML = '';

    const posts = getPostsSafe().sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0));
    if (!posts.length) {
      console.warn('[WebTest] Nenačtené příspěvky. Zkontroluj: data.js (window.DATA.posts) a pořadí skriptů.');
      featured.innerHTML = `<p>Žádné příspěvky zatím nejsou k dispozici.</p>`;
      return 0;
    }

    const [featuredPost, ...rest] = posts;

    featured.innerHTML = `
      <div class="featured-post">
        <div class="featured-post-image" style="background-image: url('${featuredPost.image}');"></div>
        <div class="featured-post-content">
          <div class="post-meta">
            <span class="post-date">${featuredPost.date ? featuredPost.date.toLocaleDateString('cs-CZ') : ''}</span>
            <span class="post-category">${(featuredPost.categories && featuredPost.categories[0]) ? String(featuredPost.categories[0]).replace(/</g,'&lt;') : ''}</span>
          </div>
          <h3 class="post-title">${String(featuredPost.title || '').replace(/</g,'&lt;')}</h3>
          <p class="post-excerpt">${String(featuredPost.excerpt || '').replace(/</g,'&lt;')}</p>
          <a href="post.html?id=${encodeURIComponent(featuredPost.id)}" class="read-more">Přečíst celý text</a>
          <div class="author-word-box">
            <div class="author-word-toggle"><span>Slovo autora</span><span class="arrow">▼</span></div>
            <div style="display:none;"><p class="authorWordText">${String(featuredPost.excerpt || '').replace(/</g,'&lt;')}</p></div>
          </div>
        </div>
      </div>
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

      slide.innerHTML = slice.map(p => `
        <div class="post-card">
          <div class="post-card-image" style="background-image: url('${p.image}');"></div>
          <div class="post-card-content">
            <div class="post-meta">
              <span class="post-date">${p.date ? p.date.toLocaleDateString('cs-CZ') : ''}</span>
              <span class="post-category">${(p.categories && p.categories[0]) ? String(p.categories[0]).replace(/</g,'&lt;') : ''}</span>
            </div>
            <h3 class="post-title">${String(p.title || '').replace(/</g,'&lt;')}</h3>
            <p class="post-excerpt">${String(p.excerpt || '').replace(/</g,'&lt;')}</p>
            <a href="post.html?id=${encodeURIComponent(p.id)}" class="read-more">Číst více</a>
            <div class="author-word-box">
              <div class="author-word-toggle"><span>Slovo autora</span><span class="arrow">▼</span></div>
              <div style="display:none;"><p class="authorWordText">${String(p.excerpt || '').replace(/</g,'&lt;')}</p></div>
            </div>
          </div>
        </div>
      `).join('');

      track.appendChild(slide);

      if (indicator) {
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
      if (w <= 576) {
        cards.forEach(c => { c.style.flex = '0 0 100%'; c.style.maxWidth = '100%'; });
      } else if (w <= 992) {
        cards.forEach(c => { c.style.flex = '0 0 calc(50% - 10px)'; c.style.maxWidth = 'calc(50% - 10px)'; });
      } else {
        cards.forEach(c => { c.style.flex = '0 0 calc(33.333% - 14px)'; c.style.maxWidth = 'calc(33.333% - 14px)'; });
      }
    };
    apply();
    window.addEventListener('resize', apply);
  }

  function initPostsCarousel() {
    const track = $('.posts-carousel-track');
    if (!track) return;

    const slides = track.querySelectorAll('.posts-slide');
    postSlidesCount = slides.length;
    if (postSlidesCount <= 1) return;

    const prev = $('.posts-carousel .carousel-arrow.prev');
    const next = $('.posts-carousel .carousel-arrow.next');
    prev?.addEventListener('click', () => movePostsTo(currentPostSlide - 1));
    next?.addEventListener('click', () => movePostsTo(currentPostSlide + 1));
  }

  function movePostsTo(index) {
    if (index < 0) index = postSlidesCount - 1;
    else if (index >= postSlidesCount) index = 0;
    currentPostSlide = index;

    const track = $('.posts-carousel-track');
    if (track) track.style.transform = `translateX(-${currentPostSlide * 100}%)`;

    document.querySelectorAll('#posts-indicator .indicator-dot')
      .forEach((d, i) => d.classList.toggle('active', i === currentPostSlide));
  }

  // === Bootstrap po načtení DOMu (až budou k dispozici Utils i DATA) ===
  document.addEventListener('DOMContentLoaded', () => {
    // kontrola pořadí skriptů / dat
    const hasUtils = !!window.Utils;
    const hasData = !!(window.DATA?.posts?.length || window.Utils?.Data?.allPosts?.());
    if (!hasUtils) console.warn('[WebTest] window.Utils není k dispozici. Zkontroluj, že utils.js je vložen před script.js.');
    if (!hasData) console.warn('[WebTest] DATA nejsou k dispozici. Zkontroluj, že data.js je vložen před utils.js a script.js.');

    try {
      slidesCount = generateAuthorsCarousel();
      initAuthorsCarousel();
    } catch (e) {
      console.error('[WebTest] Chyba při generování karuselu autorů:', e);
    }

    try {
      postSlidesCount = generatePostsCarousel();
      initPostsCarousel();
      // drobné odsazení pro vzhled
      const featured = $('#featured-post-container');
      if (featured) featured.style.marginBottom = '50px';
    } catch (e) {
      console.error('[WebTest] Chyba při generování karuselu příspěvků:', e);
    }
  });
})();
