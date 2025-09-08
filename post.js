// Function to load post details
function loadPostDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        console.error('Post ID not specified');
        window.location.href = 'index.html';
        return;
    }
    
    const post = postsData.find(p => p.id.toString() === postId.toString());
    
    if (!post) {
        console.error('Post with ID ' + postId + ' not found');
        window.location.href = 'index.html';
        return;
    }
    
    document.title = post.title + ' - LiterárníKomunita';
    
    const postDateElement = document.getElementById('postDate');
    const postCategoryElement = document.getElementById('postCategory');
    const postTitleElement = document.getElementById('postTitle');
    const authorNameElement = document.getElementById('authorName');
    const authorImageElement = document.getElementById('authorImage');
    const authorLinkElement = document.getElementById('authorLink');
    const postImageElement = document.getElementById('postImage');
    const postContentElement = document.getElementById('postContent');
    const authorWordElement = document.getElementById('authorWord');
    
    if (postDateElement) postDateElement.textContent = post.displayDate || post.date;
    if (postCategoryElement) postCategoryElement.textContent = post.category;
    if (postTitleElement) postTitleElement.textContent = post.title;
    if (authorNameElement) authorNameElement.textContent = post.author;
    if (postImageElement && post.image) postImageElement.src = post.image;
    if (postContentElement && post.content) postContentElement.innerHTML = formatContent(post.content);

    // Důležitá oprava: Zajistíme, aby text z excerpt byl nastaven do skrytého odstavce
    if (authorWordElement) {
        authorWordElement.textContent = post.excerpt;
    }
    
    if (authorNameElement && authorImageElement && authorLinkElement) {
        const author = authorsData.find(a => a.name === post.author);
        
        if (author) {
            authorImageElement.src = author.image;
            authorLinkElement.href = `author.html?id=${author.id}`;
        }
    }
    
    const tagsContainer = document.querySelector('.post-tags');
    if (tagsContainer && post.category) {
        tagsContainer.innerHTML = `
            <a href="category.html?category=${encodeURIComponent(post.category)}" class="tag">${post.category}</a>
            <a href="author-category.html?author=${encodeURIComponent(post.author)}" class="tag">${post.author}</a>
        `;
    }
    
    loadRelatedPosts(post.author, post.id);
    
    setTimeout(function() {
        initAuthorWordToggle();
    }, 300);
    
    initShareButtons();
}

// Pomocná funkce pro formátování obsahu
function formatContent(content) {
    if (!content) return '';
    const paragraphs = content.split('\n');
    let formattedContent = '';
    paragraphs.forEach(paragraph => {
        if (paragraph.trim() !== '') {
            formattedContent += `<p>${paragraph}</p>`;
        }
    });
    return formattedContent;
}

// Funkce pro načtení souvisejících příspěvků
function loadRelatedPosts(authorName, currentPostId) {
    const postsGrid = document.querySelector('.related-posts .posts-grid');
    if (!postsGrid) return;
    
    const authorPosts = postsData.filter(post => 
        post.author === authorName && post.id.toString() !== currentPostId.toString()
    );
    
    authorPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const recentPosts = authorPosts.slice(0, 3);
    
    let postsHTML = '';
    
    if (recentPosts.length === 0) {
        postsGrid.innerHTML = '<p>Tento autor zatím nemá žádné další příspěvky.</p>';
        return;
    }
    
    recentPosts.forEach(post => {
        postsHTML += `
            <div class="post-card">
                <div class="post-card-image" style="background-image: url('${post.image}');"></div>
                <div class="post-card-content">
                    <div class="post-meta">
                        <span class="post-date">${post.displayDate || post.date}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="post.html?id=${post.id}" class="read-more">Číst více</a>
                    <div class="author-word-box">
                        <div class="author-word-toggle">
                            <span>Slovo autora</span>
                            <span class="arrow">▼</span>
                        </div>
                        <div style="display: none;"><p class="authorWordText">${post.excerpt}</p></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    postsGrid.innerHTML = postsHTML;
    
    setTimeout(function() {
        initAuthorWordToggle();
    }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    loadPostDetails();
    initMobileMenu();
    initCommentForm();
    initShareButtons();
});
