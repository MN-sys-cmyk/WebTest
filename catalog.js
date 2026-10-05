(() => {
  const escape = value => Utils.escape(String(value ?? ''));
  const authorFor = p => Utils.Data.getAuthorById(p.authorId);
  Utils.renderTextCards = function(target, items) {
    target.innerHTML = items.map(p => {
      const author = authorFor(p);
      const href = `post.html?id=${encodeURIComponent(p.id)}`;
      const excerpt = String(p.excerpt || '').trim();
      const short = excerpt.length > 160 ? excerpt.slice(0, 157).trimEnd() + '…' : excerpt;
      return `<article class="text-card">
        <div class="text-card__media"><span class="text-card__fallback">${escape(p.categories[0] || 'Literární text')}</span>${p.image ? `<img src="${escape(p.image)}" alt="" loading="lazy" width="640" height="400">` : ''}</div>
        <div class="text-card__body">
          <div class="text-card__meta"><span>${escape(p.categories.join(' · '))}</span>${p.date && !Number.isNaN(p.date.getTime()) ? `<time datetime="${p.date.toISOString().slice(0,10)}">${p.date.toLocaleDateString('cs-CZ')}</time>` : ''}</div>
          <h3><a href="${href}">${escape(p.title)}</a></h3>
          <p class="text-card__author">${author ? `<a href="author.html?id=${encodeURIComponent(author.id)}">${escape(author.name)}</a>` : 'Autor neuveden'}</p>
          <p class="text-card__excerpt">${escape(short)}</p>
          <div class="author-word-box">
            <button type="button" class="author-word-toggle" aria-haspopup="dialog">Slovo autora</button>
            <p class="authorWordText" hidden>${escape(excerpt)}</p>
          </div>
          <a class="text-card__read" href="${href}" aria-label="${escape('Číst text: ' + p.title)}">Číst text <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
    }).join('');
    target.querySelectorAll('img').forEach(img => {
      const hide = () => { img.hidden = true; };
      img.addEventListener('error', hide, { once: true });
      if (img.complete && !img.naturalWidth) hide();
    });
  };
})();

// Shared cards for the homepage selection and searchable catalogue.
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('all-posts-grid');
  const latest = document.getElementById('latest-texts-grid');
  if (!grid && !latest) return;
  const posts = Utils.Data.allPosts().sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  const authorFor = p => Utils.Data.getAuthorById(p.authorId);
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('cs');
  const render = Utils.renderTextCards;
  if (latest) initTextCarousel(posts);
  if (!grid) return;
  const search = document.getElementById('text-search');
  const genre = document.getElementById('text-genre');
  const count = document.getElementById('text-count');
  const empty = document.getElementById('text-empty');
  const reset = document.getElementById('text-reset');
  Utils.Data.listCategories().sort((a,b) => a.localeCompare(b, 'cs')).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    genre.appendChild(option);
  });
  function update() {
    const q = normalize(search.value.trim());
    const result = posts.filter(p => (!genre.value || p.categories.includes(genre.value)) && (!q || normalize([p.title, p.excerpt, p.content, authorFor(p)?.name, ...p.categories].join(' ')).includes(q)));
    render(grid, result);
    count.textContent = `Zobrazeno ${result.length} z ${posts.length} textů`;
    empty.hidden = result.length !== 0;
    reset.disabled = !search.value && !genre.value;
  }
  search.addEventListener('input', update);
  genre.addEventListener('change', update);
  reset.addEventListener('click', () => { search.value = ''; genre.value = ''; update(); search.focus(); });
  update();
});

// Manual pagination: no timers or automatic rotation.
function initTextCarousel(posts) {
  const carousel = document.querySelector('.texts-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('#latest-texts-grid');
  const indicators = carousel.querySelector('#texts-indicator');
  const previous = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const items = posts.slice(0, 6);
  const status = document.createElement('p');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  carousel.appendChild(status);
  let page = 0;
  let perPage = 0;
  let slides = [];
  let dots = [];
  function move(index) {
    if (!slides.length) return;
    page = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${page * 100}%)`;
    slides.forEach((slide, i) => {
      slide.inert = i !== page;
      slide.setAttribute('aria-hidden', String(i !== page));
      dots[i].classList.toggle('active', i === page);
      dots[i].setAttribute('aria-pressed', String(i === page));
    });
    status.textContent = `Texty: strana ${page + 1} z ${slides.length}`;
  }
  function render() {
    const size = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    if (size === perPage) return;
    const firstItem = page * perPage;
    const focused = carousel.contains(document.activeElement);
    perPage = size;
    track.replaceChildren();
    indicators.replaceChildren();
    slides = []; dots = [];
    if (!items.length) {
      track.textContent = 'Texty zatím nejsou k dispozici.';
      previous.hidden = next.hidden = true;
      return;
    }
    for (let i = 0; i < items.length; i += perPage) {
      const slide = document.createElement('div');
      slide.className = 'text-carousel-slide text-grid';
      Utils.renderTextCards(slide, items.slice(i, i + perPage));
      track.appendChild(slide); slides.push(slide);
      const dot = document.createElement('button');
      dot.type = 'button'; dot.className = 'indicator-dot';
      dot.setAttribute('aria-label', `Texty: strana ${slides.length}`);
      dot.setAttribute('aria-controls', 'latest-texts-grid');
      const index = slides.length - 1;
      dot.addEventListener('click', () => move(index));
      indicators.appendChild(dot); dots.push(dot);
    }
    previous.hidden = next.hidden = slides.length < 2;
    indicators.hidden = slides.length < 2;
    move(Math.min(Math.floor(firstItem / perPage), slides.length - 1));
    if (focused && !carousel.contains(document.activeElement)) dots[page].focus();
  }
  previous.addEventListener('click', () => move(page - 1));
  next.addEventListener('click', () => move(page + 1));
  carousel.addEventListener('keydown', e => {
    if (!slides.length || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const wasInSlide = track.contains(document.activeElement);
    move(e.key === 'Home' ? 0 : e.key === 'End' ? slides.length - 1 : page + (e.key === 'ArrowRight' ? 1 : -1));
    if (wasInSlide) slides[page].querySelector('a')?.focus();
  });
  render();
  window.addEventListener('resize', render);
}
