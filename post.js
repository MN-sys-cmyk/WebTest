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
    
    if (postDateElement) postDateElement.textContent = post.displayDate || post.date;
    if (postCategoryElement) postCategoryElement.textContent = post.category;
    if (postTitleElement) postTitleElement.textContent = post.title;
    if (authorNameElement) authorNameElement.textContent = post.author;
    if (postImageElement) postImageElement.src = post.image;
    if (postContentElement) postContentElement.innerHTML = post.content;
    
    // Set up author link and image
    if (authorNameElement && authorImageElement && authorLinkElement) {
        // Find author data
        const author = authorsData.find(a => a.name === post.author);
        
        if (author) {
            authorImageElement.src = author.image;
            // FIX #5: Update author link to redirect to author page
            authorLinkElement.href = `author.html?id=${author.id}`;
        }
    }
    
    // Load related posts (other posts by the same author)
    loadRelatedPosts(post.author, post.id);
}

// FIX #4: Show only three older posts by the same author
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
                </div>
            </div>
        `;
    });
    
    postsGrid.innerHTML = postsHTML;
}

// Initialize the page after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load post details
    loadPostDetails();
    
    // Initialize toggle for author's word section
    initAuthorWordToggle();
    
    // Initialize mobile menu
    initMobileMenu();
});

// Initialize author word toggle functionality
function initAuthorWordToggle() {
    const toggleButton = document.querySelector('.author-word-toggle');
    
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');
            
            if(content.style.maxHeight) {
                content.style.maxHeight = null;
                arrow.textContent = '▼';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                arrow.textContent = '▲';
            }
        });
    }
}

// Initialize mobile menu
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (toggleBtn && closeBtn && mobileMenu) {
        toggleBtn.addEventListener('click', () => {
            mobileMenu.style.display = 'block';
            setTimeout(() => mobileMenu.classList.add('active'), 10);
        });
        
        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            setTimeout(() => mobileMenu.style.display = 'none', 500);
        });
    }
}
