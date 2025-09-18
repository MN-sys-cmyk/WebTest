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
      <div class="author-image-container">
        <img src="${a.image}" alt="${Utils.escape(a.name)}" class="author-image" loading="lazy">
      </div>
      <h3 class="author-name">${Utils.escape(a.name)}</h3>
      ${a.genre ? `<p class="author-genre">${Utils.escape(a.genre)}</p>` : ""}
    </a>
  `).join("");

  // volitelné: necháme Utils.hardenImages() udělat zbytek
});
