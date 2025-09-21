// topbar.js
(async function injectTopbar() {
  try {
    const res = await fetch('partials/topbar.html', { cache: 'no-store' });
    if (!res.ok) throw new Error('Topbar fetch failed');
    const html = await res.text();
    document.body.insertAdjacentHTML('afterbegin', html);

    // označení aktivního odkazu
    const path = location.pathname.replace(/\/index\.html?$/, '/');
    document.querySelectorAll('.topbar__nav a[data-match]').forEach(a => {
      const want = a.getAttribute('data-match');
      if (want === '/' ? path === '/' : path.includes(want)) {
        a.classList.add('active');
      }
    });

    // posun na #Kontakt z top lišty (nepřepisuj URL na jinou stránku)
    document.querySelectorAll('.topbar__nav a[data-anchor="1"]').forEach(a => {
      a.addEventListener('click', e => {
        const el = document.querySelector('#site-footer') || document.querySelector('footer, .footer');
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  } catch (e) {
    // nouzová záloha – když partial nenajdeme, nic neděláme
    console.warn('Topbar not injected:', e);
  }
})();
