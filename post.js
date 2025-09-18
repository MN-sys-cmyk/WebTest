// post.js — detail + související; karty = article[data-post-href]; modal "Slovo autora"
function findPostById(id) {
  return Utils.Data.allPosts().find(p => String(p.id) === String(id)) || null;
}
function formatContent(content) {
  if (!content) return '';
  return content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('');
}

/* ===== Modal ===== */
let lastFocusedPost = null;
function openModalPost(html, { title = 'Slovo autora' } = {}) {
  closeModalPost();
  lastFocusedPost = document.activeElement;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const dialog = document.createElement('div');
  dialog.className = 'modal';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'modal-title');
  dialog.setAttribute('tabindex', '-1');
  dialog.innerHTML = `
    <button class="modal-close" aria-label="Zavřít">&times;</button>
    <h3 id="modal-title" class="modal-title">${title}</h3>
    <div class="modal-body">${html}</div>
  `;
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const onKey = (e) => {
    if (e.key === 'Escape') closeModalPost();
    if (e.key === 'Tab') {
      const f = dialog.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  const onOverlay = (e) => { if (e.target === overlay) closeModalPost(); };
  overlay.addEventListener('click', onOverlay);
  overlay._cleanup = () => { overlay.removeEventListener('click', onOverlay); document.removeEventListener('keydown', onKey); };
  document.addEventListener('keydown', onKey);
  dialog.querySelector('.modal-close').addEventListener('click', (e) => { e.preventDefault(); closeModalPost(); });
  dialog.focus();
}
function closeModalPost() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) { overlay._cleanup?.(); overlay.remove(); }
  document.body.style.overflow = '';
  if (lastFocusedPost && typeof lastFocusedPost.focus === 'function') lastFocusedPost.focus();
}

/* ===== Delegace: toggle modal + ruční navigace souvisejících karet ===== */
function getAuthorWordHtmlFromToggle(tg) {
  const id = tg.getAttribute('aria-controls');
  if (id) {
    const box = document.getElementById(id);
    if (box) {
      const p = box.querySelector('.authorWordText');
      if (p && p.innerHTML) return p.innerHTML;
      if (box.innerHTML) return box.innerHTML;
    }
  }
  const parent = tg.closest('.author-word-box') || tg.parentElement;
  const p = parent?.querySelector('.authorWordText');
  return (p && p.innerHTML) || '<p>(Autor zatím nic nedodal.)</p>';
}

document.addEventListener('click', (e) => {
  const tg = e.target.closest?.('.author-word-toggle');
  if (tg) {
    e.preventDefault(); e.stopPropagation();
    return openModalPost(getAuthorWordHtmlFromToggle(tg));
  }
  const card = e.target.closest?.('.post-card,[data-post-href],.featured-post');
  if (card) {
    const href = card.getAttribute('data-post-href') || card.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    window.location.assign(href);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const tg = e.target.closest?.('.author-word-toggle');
  if (tg) { e.preventDefault(); e.stopPropagation(); return openModalPost(getAuthorWordHtmlFromToggle(tg)); }
  const card = e.target.closest?.('.post-card,[data-post-href],.featured-post');
  if (card) {
    e.preventDefault();
    const href = card.getAttribute('data-post-href') || card.getAttribute('href');
    if (href) window.location.assign(href);
  }
});

/* ===== Related posts render ===== */
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
    <article class="post-card" role="link" tabindex="0" data-post-href="post.html?id=${encodeURIComponent(p.id)}">
      <div class="post-card-image" style="background-image: url('${p.image}');"></div>
      <div class="post-card-content">
        <div class="post-meta">
          <span class="post-date">${p.date ? p.date.toLocaleDateString('cs-CZ') : ''}</span>
          <span class="post-category">${(p.categories && p.categories[0]) ? Utils.escape(p.categories[0]) : ''}</span>
        </div>
        <h3 class="post-title">${Utils.escape(p.title)}</h3>
        <p class="post-excerpt">${Utils.escape(p.excerpt)}</p>
        <div class="author-word-box">
          <div class="author-word-toggle" aria-controls="aw-rel-${p.id}">
            <span>Slovo autora</span><span class="arrow">▼</span>
          </div>
          <div id="aw-rel-${p.id}" style="display:none;"><p class="authorWordText">${Utils.escape(p.excerpt)}</p></div>
        </div>
      </div>
    </article>
  `).join("");
}

/* ===== Init detailu ===== */
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
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

  const author = Utils.Data.getAuthorById(post.authorId);
  if (author) {
    if (authorImageElement) { authorImageElement.src = author.image; authorImageElement.alt = author.name; authorImageElement.loading = 'lazy'; }
    if (authorLinkElement) authorLinkElement.href = `author.html?id=${encodeURIComponent(author.id)}`;
  }

  const tagsContainer = document.querySelector('.post-tags');
  if (tagsContainer && post.categories?.length) {
    const [cat] = post.categories;
    tagsContainer.innerHTML = `
      <a href="category.html?category=${encodeURIComponent(cat)}" class="tag">${Utils.escape(cat)}</a>
      <a href="author-category.html?author=${encodeURIComponent(post.authorId)}" class="tag">${Utils.escape(author?.name || '')}</a>
    `;
  }

  // připrav aria-controls v detailu, aby se našel text pro modal
  const awToggle = document.querySelector('.author-word-box .author-word-toggle');
  const awBox = document.querySelector('.author-word-box > div');
  if (awToggle && awBox) {
    const idBox = 'aw-detail';
    awBox.id = idBox;
    awToggle.setAttribute('aria-controls', idBox);
  }

  loadRelatedPosts(post.authorId, post.id);
});
