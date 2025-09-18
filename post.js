// post.js — detail příspěvku + související články
function findPostById(id) {
  return Utils.Data.allPosts().find(p => String(p.id) === String(id)) || null;
}

function formatContent(content) {
  if (!content) return '';
  return content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('');
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
          <div class="author-word-toggle"><span>Slovo autora</span><span class="arrow">▼</span></div>
          <div style="display:none;"><p class="authorWordText">${Utils.escape(p.excerpt)}</p></div>
        </div>
      </div>
    </div>
  `).join("");
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

  loadRelatedPosts(post.authorId, post.id);
});
