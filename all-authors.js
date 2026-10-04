// all-authors.js — čte autory z Utils.Data a renderuje grid
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('authors-grid');
  if (!wrap) return;

  const authors = Utils.Data.getAuthors();
  if (!authors.length) {
    wrap.innerHTML = '<p>Žádní autoři zatím nejsou k dispozici.</p>';
    return;
  }

  wrap.innerHTML = authors.map(a => `
    <a href="author.html?id=${encodeURIComponent(a.id)}" class="author-card">
      <div class="author-image-container"><span class="author-initials" aria-hidden="true">${Utils.escape(a.name.split(/\s+/).slice(0, 2).map(part => part[0]).join(""))}</span>
        <img src="${a.image}" alt="${Utils.escape(a.name)}" class="author-image" loading="lazy">
      </div>
      <h3 class="author-name">${Utils.escape(a.name)}</h3>
      ${a.genre ? `<p class="author-genre">${Utils.escape(a.genre)}</p>` : ""}
    </a>
  `).join("");

  wrap.querySelectorAll('img').forEach(img => {
    const hide = () => { img.hidden = true; };
    img.addEventListener('error', hide, { once: true });
    if (img.complete && !img.naturalWidth) hide();
  });
});
