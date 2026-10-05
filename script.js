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
      slide.innerHTML = authors.slice(i, i + perPage).map(Utils.authorCard).join('');
      Utils.hideBrokenImages(slide);
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
  window.addEventListener('resize', render);
});
