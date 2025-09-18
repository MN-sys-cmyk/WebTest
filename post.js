// post.js — detail příspěvku + související články + Slovo autora toggle
function findPostById(id) {
  return Utils.Data.allPosts().find(p => String(p.id) === String(id)) || null;
}

function formatContent(content) {
  if (!content) return '';
  return content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('');
}

function bindAuthorWordToggles(root = document) {
  const toggles = root.querySelectorAll('.author-word-toggle');
  toggles.forEach(tg => {
    if (tg.dataset.bound === '1') return;
    tg.dataset.bound = '1';

    const activate = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const controlsId = tg.getAttribute('aria-controls');
      const box = controlsId ? document.getElementById(controlsId) : tg.parentElement?.querySelector('.author-word-content, div');
      if (!box) return;

      const isOpen = tg.getAttribute('aria-expanded') === 'true';
      const nextOpen = !isOpen;
      tg.setAttribute('aria-expanded', String(nextOpen));

      if (box.classList.contains('author-word-content')) {
        if (nextOpen) {
          box.style.display = 'block';
          const h = box.scrollHeight;
          box.style.maxHeight = h + 'px';
        } else {
          box.style.maxHeight = '0';
          box.addEventListener('transitionend', () => { if (tg.getAttribute('aria-expanded') === 'false') box.style.display = 'none'; }, { once: true });
        }
      } else {
        box.style.display = nextOpen ? 'block' : 'none';
      }
    };

    tg.addEventListener('click', activate);
    tg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') activate(e);
    });
  });
}

function loadRelatedPosts(authorId, currentPostId) {
  const grid = document.querySelector('.related-posts .posts-grid');
  if (!grid) return;

  const posts = Utils.Data.getPosts({ authorId })
    .filter(p => String(p.id) !== String(currentPostId))
    .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
    .slice(0, 3);

  if (!posts.length) {
    grid.innerHTML = '<p>Tento autor zatím nemá žádné další příspěvky.</p>';
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
          <div class="author-word-toggle" role="button" tabindex="0" aria-expanded="false" aria-controls="aw-rel-${p.id}">
            <span>Slovo autora</span><span class="arrow">▼</span>
          </div>
          <div id="aw-rel-${p.id}" class="author-word-content" style="display:none; max-height:0;"><p class="authorWordText">${Utils.escape(p.excerpt)}</p></div>
        </div>
      </div>
    </div>
  `).join("");

  bindAuthorWordToggles(grid);
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) return location.replace('index.html');

  const post = findPostById(id);
  if (!post) return location.replace('index.html');

  document.title = `${post.title} - LiterárníKomunita`;

  const postDateElement = document.getElementById('postDate');
  const postCategoryElement = document.getElementById('postCategory');
  const postTitleElement = document.getElementById('postTitle');
  const authorNameElement = document.getElementById('authorName');
  const authorImageElement = document.getElementById('authorImage');
  const authorLinkElement = document.getElementById('authorLink');
  const postContentElement = document.getElementById('postContent');
  const authorWordElement = document.getElementById('authorWord');

  if (postDateElement) postDateElement.textContent = post.date ? post.date.toLocaleDateString('cs-CZ') : '';
  if (postCategoryElement) postCategoryElement.textContent = (post.categories && post.categories[0]) || '';
  if (postTitleElement) postTitleElement.textContent = post.title;
  if (authorNameElement) authorNameElement.textContent = Utils.Data.getAuthorById(post.authorId)?.name || '';

  if (postContentElement) postContentElement.innerHTML = formatContent(post.content || '');
  if (authorWordElement) authorWordElement.textContent = post.excerpt || '';

  // autor info
  const author = Utils.Data.getAuthorById(post.authorId);
  if (author) {
    if (authorImageElement) {
      authorImageElement.src = author.image;
      authorImageElement.alt = author.name;
      authorImageElement.loading = 'lazy';
    }
    if (authorLinkElement) authorLinkElement.href = `author.html?id=${encodeURIComponent(author.id)}`;
  }

  // tagy
  const tagsContainer = document.querySelector('.post-tags');
  if (tagsContainer && post.categories?.length) {
    const [cat] = post.categories;
    tagsContainer.innerHTML = `
      <a href="category.html?category=${encodeURIComponent(cat)}" class="tag">${Utils.escape(cat)}</a>
      <a href="author-category.html?author=${encodeURIComponent(post.authorId)}" class="tag">${Utils.escape(author?.name || '')}</a>
    `;
  }

  // připrav "Slovo autora" v detailu (existuje-li)
  const awToggle = document.querySelector('.author-word-box .author-word-toggle');
  const awBox = document.querySelector('.author-word-box > div');
  if (awToggle && awBox) {
    // doplníme ARIA pro lepší ovládání
    const idBox = 'aw-detail';
    awBox.id = idBox;
    awBox.classList.add('author-word-content');
    awBox.style.display = 'none';
    awBox.style.maxHeight = '0';
    awToggle.setAttribute('role', 'button');
    awToggle.setAttribute('tabindex', '0');
    awToggle.setAttribute('aria-expanded', 'false');
    awToggle.setAttribute('aria-controls', idBox);
  }
  bindAuthorWordToggles(document);

  loadRelatedPosts(post.authorId, post.id);
});
