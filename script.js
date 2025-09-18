// script.js — homepage: generování karuselů z Utils.Data
let currentSlide = 0;
let slidesCount = 0;
let currentPostSlide = 0;
let postSlidesCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  slidesCount = generateAuthorsCarousel();
  postSlidesCount = generatePostsCarousel();
  initAuthorsCarousel();
  initPostsCarousel();
  addMarginToPostsCarousel();
});

// ===== Autorské karusely =====
function generateAuthorsCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsWrap = document.getElementById('carousel-indicator');
  if (!track || !dotsWrap) return 0;

  track.innerHTML = '';
  dotsWrap.innerHTML = '';

  const authors = Utils.Data.getAuthors();
  const perSlide = 4;
  const slidesNeeded = Math.ceil(authors.length / perSlide);

  for (let i = 0; i < slidesNeeded; i++) {
    const start = i * perSlide;
    const slice = authors.slice(start, start + perSlide);
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = slice.map(a => `
      <a href="author.html?id=${encodeURIComponent(a.id)}" class="author-card">
        <div class="author-image-container">
          <img src="${a.image}" alt="${Utils.escape(a.name)}" class="author-image" loading="lazy">
        </div>
        <h3 class="author-name">${Utils.escape(a.name)}</h3>
        ${a.genre ? `<p class="author-genre">${Utils.escape(a.genre)}</p>` : ""}
      </a>
    `).join('');
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => moveAuthorsTo(i);
    dotsWrap.appendChild(dot);
  }
  return slidesNeeded;
}

function initAuthorsCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  slidesCount = slides.length;
  if (slidesCount < 2) return;

  const prev = document.querySelector('.authors-carousel .carousel-arrow.prev');
  const next = document.querySelector('.authors-carousel .carousel-arrow.next');
  if (prev && next) {
    prev.addEventListener('click', () => moveAuthorsTo(currentSlide - 1));
    next.addEventListener('click', () => moveAuthorsTo(currentSlide + 1));
  }
}

function moveAuthorsTo(index) {
  if (index < 0) index = slidesCount - 1;
  else if (index >= slidesCount) index = 0;
  currentSlide = index;

  const track = document.getElementById('carousel-track');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

  const dots = document.querySelectorAll('.authors-carousel .indicator-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

// ===== Karusel příspěvků =====
function generatePostsCarousel() {
  const postsContainer = document.getElementById('posts-container');
  const indicator = document.getElementById('posts-indicator');
  const featured = document.getElementById('featured-post-container');
  if (!postsContainer || !featured) return 0;

  postsContainer.innerHTML = '';
  featured.innerHTML = '';
  if (indicator) indicator.innerHTML = '';

  const posts = Utils.Data.allPosts()
    .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

  if (!posts.length) return 0;

  const [featuredPost, ...rest] = posts;

  featured.innerHTML = `
    <div class="featured-post">
      <div class="featured-post-image" style="background-image: url('${featuredPost.image}');"></div>
      <div class="featured-post-content">
        <div class="post-meta">
          <span class="post-date">${featuredPost.date ? featuredPost.date.toLocaleDateString('cs-CZ') : ''}</span>
          <span class="post-category">${(featuredPost.categories && featuredPost.categories[0]) ? Utils.escape(featuredPost.categories[0]) : ''}</span>
        </div>
        <h3 class="post-title">${Utils.escape(featuredPost.title)}</h3>
        <p class="post-excerpt">${Utils.escape(featuredPost.excerpt)}</p>
        <a href="post.html?id=${encodeURIComponent(featuredPost.id)}" class="read-more">Přečíst celý text</a>
        <div class="author-word-box">
          <div class="author-word-toggle"><span>Slovo autora</span><span class="arrow">▼</span></div>
          <div style="display:none;"><p class="authorWordText">${Utils.escape(featuredPost.excerpt)}</p></div>
        </div>
      </div>
    </div>
  `;

  const track = document.createElement('div');
  track.className = 'posts-carousel-track';
  track.style.display = 'flex';
  track.style.transition = 'transform 0.5s ease';
  postsContainer.appendChild(track);

  const perSlide = 3;
  const slidesNeeded = Math.ceil(rest.length / perSlide);

  for (let i = 0; i < slidesNeeded; i++) {
    const start = i * perSlide;
    const slice = rest.slice(start, start + perSlide);

    const slide = document.createElement('div');
    slide.className = 'posts-slide';
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
            <span class="post-category">${(p.categories && p.categories[0]) ? Utils.escape(p.categories[0]) : ''}</span>
          </div>
          <h3 class="post-title">${Utils.escape(p.title)}</h3>
          <p class="post-excerpt">${Utils.escape(p.excerpt)}</p>
          <a href="post.html?id=${encodeURIComponent(p.id)}" class="read-more">Číst více</a>
          <div class="author-word-box">
            <div class="author-word-toggle"><span>Slovo autora</span><span class="arrow">▼</span></div>
            <div style="display:none;"><p class="authorWordText">${Utils.escape(p.excerpt)}</p></div>
          </div>
        </div>
      </div>
    `).join('');

    track.appendChild(slide);

    if (indicator) {
      const dot = document.createElement('div');
      dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
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
  const track = document.querySelector('.posts-carousel-track');
  if (!track) return;

  const slides = track.querySelectorAll('.posts-slide');
  postSlidesCount = slides.length;
  if (postSlidesCount <= 1) return;

  const prev = document.querySelector('.posts-carousel .carousel-arrow.prev');
  const next = document.querySelector('.posts-carousel .carousel-arrow.next');
  if (prev && next) {
    prev.addEventListener('click', () => movePostsTo(currentPostSlide - 1));
    next.addEventListener('click', () => movePostsTo(currentPostSlide + 1));
  }
}

function movePostsTo(index) {
  if (index < 0) index = postSlidesCount - 1;
  else if (index >= postSlidesCount) index = 0;
  currentPostSlide = index;

  const track = document.querySelector('.posts-carousel-track');
  if (track) track.style.transform = `translateX(-${currentPostSlide * 100}%)`;

  const dots = document.querySelectorAll('#posts-indicator .indicator-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentPostSlide));
}

function addMarginToPostsCarousel() {
  const featured = document.getElementById('featured-post-container');
  const carousel = document.querySelector('.posts-carousel');
  if (featured && carousel) featured.style.marginBottom = '50px';
}
