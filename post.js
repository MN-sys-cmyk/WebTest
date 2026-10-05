function findPostById(id) {
  return Utils.Data.allPosts().find(p => String(p.id) === String(id)) || null;
}
function formatContent(content) {
  if (!content) return '';
  return content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('');
}

/* ===== Related posts render ===== */
function loadRelatedPosts(current) {
  const section = document.querySelector('.related-posts');
  const grid = section?.querySelector('.text-grid');
  if (!grid) return;
  const score = p => String(p.authorId) === String(current.authorId) ? 2 :
    p.categories.some(category => current.categories.includes(category)) ? 1 : 0;
  const posts = Utils.Data.allPosts()
    .filter(p => String(p.id) !== String(current.id))
    .sort((a, b) => score(b) - score(a) || (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
    .slice(0, 3);
  section.hidden = !posts.length;
  Utils.renderTextCards(grid, posts);
}

/* ===== Init detailu ===== */
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return location.replace('index.html');
  const post = findPostById(id);
  if (!post) return location.replace('index.html');

  document.title = `${post.title} - Tvůrčí psaní`;

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

  loadRelatedPosts(post);
});

