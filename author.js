// author.js — detail autora + jeho poslední příspěvky
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) return location.replace('index.html');

  const author = Utils.Data.getAuthorById(id);
  if (!author) return location.replace('index.html');

  document.title = `${author.name} - LiterárníKomunita`;

  const nameEl = document.getElementById('authorName');
  const genreEl = document.getElementById('authorGenre');
  const imgEl = document.getElementById('authorImage');
  const bioEl = document.getElementById('authorBio');

  if (nameEl) nameEl.textContent = author.name;
  if (genreEl) genreEl.textContent = author.genre || '';
  if (imgEl) {
    imgEl.src = author.image;
    imgEl.alt = author.name;
    imgEl.loading = 'lazy';
  }
  if (bioEl) bioEl.textContent = author.bio || '';

  const postsWrap = document.querySelector('.posts-grid');
  if (!postsWrap) return;

  const posts = Utils.Data.getPosts({ authorId: id })
    .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
    .slice(0, 6);

  if (!posts.length) {
    postsWrap.innerHTML = '<p>Tento autor zatím nemá žádné příspěvky.</p>';
    return;
  }

  postsWrap.innerHTML = posts.map(p => `
    <div class="post-card author-page-card">
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

  // jednoduché rozložení, pokud někde rely na inline stylech:
  postsWrap.style.display = 'flex';
  postsWrap.style.flexWrap = 'wrap';
  postsWrap.style.gap = '30px';
  postsWrap.style.justifyContent = 'flex-start';
});
