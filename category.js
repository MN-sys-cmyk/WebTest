// category.js — výpis textů podle kategorie (param ?category=<název>)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  if (!category) return location.replace('index.html');

  const titleEl = document.getElementById('category-title');
  const subEl = document.getElementById('category-subtitle');
  if (titleEl) titleEl.textContent = `Texty v kategorii: ${category}`;
  if (subEl) subEl.textContent = `Všechny texty v kategorii ${category}`;

  const grid = document.getElementById('category-posts-grid');
  if (!grid) return;

  const posts = Utils.Data.getPosts({ category })
    .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

  if (!posts.length) {
    grid.innerHTML = '<p>V této kategorii nejsou zatím žádné příspěvky.</p>';
    return;
  }

  grid.innerHTML = posts.map(p => `
    <div class="post-card">
      <div class="post-card-image" style="background-image: url('${p.image}');"></div>
      <div class="post-card-content">
        <div class="post-meta">
          <span class="post-date">${p.date ? p.date.toLocaleDateString('cs-CZ') : ''}</span>
          <span class="post-category">${(p.categories && p.categories[0]) ? Utils.escape(p.categories[0]) : ''}${Utils.readingTimeMarkup(p.content)}</span>
        </div>
        <h3 class="post-title">${Utils.escape(p.title)}</h3>
        <p class="text-card__author"><a href="author.html?id=${encodeURIComponent(p.authorId)}">${Utils.escape(Utils.Data.getAuthorById(p.authorId)?.name || 'Autor neuveden')}</a></p>
        ${Utils.authorWordMarkup(p.authorWord)}
        ${p.tags.length ? `<div class="card-tags">${Utils.tagMarkup(p.tags)}</div>` : ''}
        <p class="post-excerpt">${Utils.escape(p.excerpt)}</p>
        <a href="post.html?id=${encodeURIComponent(p.id)}" class="read-more">Číst více</a>
      </div>
    </div>
  `).join("");
});
