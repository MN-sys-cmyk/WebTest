// author-category.js — výpis textů konkrétního autora (param ?author=<authorId>)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const authorId = params.get('author');

  if (!authorId) {
    location.replace('index.html');
    return;
  }

  const author = Utils.Data.getAuthorById(authorId);
  const titleEl = document.getElementById('author-title');
  const subEl = document.getElementById('author-subtitle');
  if (titleEl) titleEl.textContent = author ? `Texty autora: ${author.name}` : `Texty autora`;
  if (subEl) subEl.textContent = author ? `Všechny texty autora ${author.name}` : `Všechny texty autora`;

  const grid = document.getElementById('author-category-posts-grid');
  if (!grid) return;

  const posts = Utils.Data.getPosts({ authorId })
    .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

  if (!posts.length) {
    grid.innerHTML = '<p>Tento autor zatím nemá žádné příspěvky.</p>';
    return;
  }

  grid.innerHTML = posts.map(p => `
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
  `).join("");
});
