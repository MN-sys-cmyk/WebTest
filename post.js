// Function to load post details
function loadPostDetails() {
    // Get post ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    // If no post ID, redirect to home page
    if (!postId) {
        console.error('Post ID not specified');
        window.location.href = 'index.html';
        return;
    }
    
    // Find post in data
    const post = postsData.find(p => p.id.toString() === postId.toString());
    
    // If post not found, redirect to home page
    if (!post) {
        console.error('Post with ID ' + postId + ' not found');
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = post.title + ' - LiterárníKomunita';
    
    // Update post elements
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

    // This is the key change: set the content of the modal
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.textContent = post.excerpt;
    }
    
    // Set up author link and image
    if (authorNameElement && authorImageElement && authorLinkElement) {
        // Find author data
        const author = authorsData.find(a => a.name === post.author);
        
        if (author) {
            authorImageElement.src = author.image;
            authorLinkElement.href = `author.html?id=${author.id}`;
        }
    }
    
    // Přidáme tagy
    const tagsContainer = document.querySelector('.post-tags');
    if (tagsContainer && post.category) {
        tagsContainer.innerHTML = `
            <a href="category.html?category=${encodeURIComponent(post.category)}" class="tag">${post.category}</a>
            <a href="author-category.html?author=${encodeURIComponent(post.author)}" class="tag">${post.author}</a>
        `;
    }
    
    // Load related posts (other posts by the same author)
    loadRelatedPosts(post.author, post.id);
    
    // Inicializace tlačítka slovo autora na stránce příspěvku - použijeme setTimeout pro lepší načasování
    setTimeout(function() {
        initAuthorWordToggle();
    }, 300);
    
    // Inicializace sdílecích tlačítek
    initShareButtons();
}

// Pomocná funkce pro formátování obsahu
function formatContent(content) {
    if (!content) return '';
    
    // Rozdělení obsahu na odstavce
    const paragraphs = content.split('\n');
    let formattedContent = '';
    
    // Vytvoření HTML pro každý odstavec
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
    
    // Get all posts by this author excluding the current one
    const authorPosts = postsData.filter(post => 
        post.author === authorName && post.id.toString() !== currentPostId.toString()
    );
    
    // Sort posts by date (newest first)
    authorPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take only the three most recent posts
    const recentPosts = authorPosts.slice(0, 3);
    
    // Generate HTML for the related posts
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
                    <div class="author-word-toggle">
                        <span>Slovo autora</span>
                        <span class="arrow">▼</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Vložíme HTML do kontejneru
    postsGrid.innerHTML = postsHTML;
    
    // Po vložení HTML do souvisejících příspěvků inicializujeme i jejich tlačítka
    setTimeout(function() {
        initAuthorWordToggle();
    }, 300);
}

// Initialize the page after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load post details
    loadPostDetails();
    
    // Inicializace mobilního menu
    initMobileMenu();
    
    // Inicializace formuláře komentářů
    initCommentForm();
    
    // Inicializace tlačítek pro sdílení
    initShareButtons();
});
