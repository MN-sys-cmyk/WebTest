// Homepage author carousel; hidden slides are excluded from keyboard navigation.
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.authors-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('#carousel-track');
  const indicators = carousel.querySelector('#carousel-indicator');
  const previous = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const authors = Utils.Data.getAuthors();
  const status = document.createElement('p');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  carousel.appendChild(status);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let hovering = false;
  let timer;
  const rotation = document.createElement('button');
  rotation.type = 'button';
  rotation.className = 'carousel-rotation';
  carousel.prepend(rotation);
  function schedule() {
    clearTimeout(timer);
    rotation.textContent = paused ? 'Spustit přehrávání' : 'Pozastavit přehrávání';
    status.setAttribute('aria-live', paused || hovering || carousel.contains(document.activeElement) ? 'polite' : 'off');
    if (paused || hovering || document.hidden || carousel.contains(document.activeElement) || slides.length < 2) return;
    timer = setTimeout(() => { move(page + 1); schedule(); }, 5000);
  }
  rotation.addEventListener('click', () => { paused = !paused; schedule(); });
  carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { paused = motion.matches; schedule(); });
  let page = 0;
  let perPage = 0;
  let slides = [];
  let dots = [];
  function move(index) {
    page = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${page * 100}%)`;
    slides.forEach((slide, i) => {
      slide.inert = i !== page;
      slide.setAttribute('aria-hidden', String(i !== page));
      dots[i].classList.toggle('active', i === page);
      dots[i].setAttribute('aria-pressed', String(i === page));
    });
    status.textContent = `Autoři: strana ${page + 1} z ${slides.length}`;
  }
  function render() {
    const size = window.innerWidth <= 576 ? 1 : window.innerWidth <= 992 ? 2 : 4;
    if (size === perPage) return;
    const firstAuthor = page * perPage;
    const focused = carousel.contains(document.activeElement);
    perPage = size;
    track.replaceChildren();
    indicators.replaceChildren();
    slides = []; dots = [];
    if (!authors.length) {
      track.textContent = 'Autoři zatím nejsou k dispozici.';
      previous.hidden = next.hidden = true;
      return;
    }
    for (let i = 0; i < authors.length; i += perPage) {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML = authors.slice(i, i + perPage).map(a => `<a href="author.html?id=${encodeURIComponent(a.id)}" class="author-card"><div class="author-image-container"><img src="${Utils.escape(a.image)}" alt="${Utils.escape(a.name)}" class="author-image" loading="lazy" decoding="async" width="640" height="640"></div><h3 class="author-name">${Utils.escape(a.name)}</h3><p class="author-genre">${Utils.escape(a.genre || '')}</p></a>`).join('');
      track.appendChild(slide); slides.push(slide);
      const dot = document.createElement('button');
      dot.type = 'button'; dot.className = 'indicator-dot';
      dot.setAttribute('aria-label', `Autoři: strana ${slides.length}`);
      dot.setAttribute('aria-controls', 'carousel-track');
      const index = slides.length - 1;
      dot.addEventListener('click', () => move(index));
      indicators.appendChild(dot); dots.push(dot);
    }
    previous.hidden = next.hidden = slides.length < 2;
    indicators.hidden = slides.length < 2;
    move(Math.min(Math.floor(firstAuthor / perPage), slides.length - 1));
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
  schedule();
  window.addEventListener('resize', () => { render(); schedule(); });
});
