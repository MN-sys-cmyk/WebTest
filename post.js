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
    if (authorWordElement) authorWordElement.textContent = "Zde autor sdílí své myšlenky a motivaci k napsání tohoto textu.";
    
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
        initAuthorWordModal();
        setupAuthorWordToggle();
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
                    <div class="author-word-content">
                        <p>Zde autor sdílí své myšlenky a motivaci k napsání tohoto textu.</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Vložíme HTML do kontejneru
    postsGrid.innerHTML = postsHTML;
    
    // Po vložení HTML do souvisejících příspěvků inicializujeme i jejich tlačítka
    setTimeout(function() {
        setupAuthorWordToggle();
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


// Funkce pro inicializaci tlačítek slovo autora (zobrazí modal) na stránce s jedním příspěvkem
function initAuthorWordModal() {
    const toggleButton = document.querySelector('.post-page .author-word-toggle');
    const modalOverlay = document.getElementById('authorWordModalOverlay');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalContent = document.getElementById('modalContent');
    const authorWordElement = document.getElementById('authorWord');

    if (toggleButton && modalOverlay && modalCloseButton && modalContent && authorWordElement) {
        toggleButton.addEventListener('click', function() {
            modalContent.textContent = authorWordElement.textContent;
            modalOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });

        modalCloseButton.addEventListener('click', function() {
            modalOverlay.classList.remove('visible');
            document.body.style.overflow = '';
        });

        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('visible');
                document.body.style.overflow = '';
            }
        });
    }
}

// Funkce pro inicializaci tlačítek "Slovo autora" pro ostatní stránky (např. hlavní stránka, stránka s autorem, atd.)
function setupAuthorWordToggle() {
    const toggleButtons = document.querySelectorAll('.author-word-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
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
    });
}

// Pomocná funkce pro inicializaci mobilního menu
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


// Funkce pro inicializaci sdílecích tlačítek
function initShareButtons() {
    const currentUrl = window.location.href;
    const pageTitle = document.title;
    const facebookShare = document.querySelector('.share-link.facebook');
    const twitterShare = document.querySelector('.share-link.twitter');
    const emailShare = document.querySelector('.share-link.email');

    if (facebookShare) {
        facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        facebookShare.target = '_blank';
    }
    
    if (twitterShare) {
        twitterShare.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(pageTitle)}`;
        twitterShare.target = '_blank';
    }
    
    if (emailShare) {
        emailShare.href = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent('Podívej se na tento zajímavý článek: ' + currentUrl)}`;
    }
}

// Funkce pro inicializaci formuláře komentářů
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const comment = document.getElementById('comment').value;
            
            console.log('Nový komentář:', { name, email, comment });
            
            addComment(name, comment);
            
            commentForm.reset();
            
            alert('Děkujeme za váš komentář!');
        });
    }
}

// Funkce pro přidání komentáře do stránky
function addComment(name, text) {
    const commentsList = document.querySelector('.comments-list');
    if (commentsList) {
        const today = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('cs-CZ', options);
        
        const commentHTML = `
            <div class="comment">
                <div class="comment-avatar">
                    <img src="avatar-default.png" alt="${name}">
                </div>
                
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="comment-author">${name}</span>
                        <span class="comment-date">${formattedDate}</span>
                    </div>
        
                    <p class="comment-text">${text}</p>
                </div>
            </div>
        `;
        
        commentsList.insertAdjacentHTML('afterbegin', commentHTML);
    }
}
