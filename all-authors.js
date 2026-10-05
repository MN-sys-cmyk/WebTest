// all-authors.js — čte autory z Utils.Data a renderuje grid
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('authors-grid');
  if (!wrap) return;

  const authors = Utils.Data.getAuthors();
  if (!authors.length) {
    wrap.innerHTML = '<p>Žádní autoři zatím nejsou k dispozici.</p>';
    return;
  }

  wrap.innerHTML = authors.map(Utils.authorCard).join('');
  Utils.hideBrokenImages(wrap);
});
