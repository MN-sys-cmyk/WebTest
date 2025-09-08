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

// Přepracovaná direktní funkce pro nastavení "Slovo autora"
function setupAuthorWordToggle() {
    // Najít všechna tlačítka "Slovo autora"
    const toggles = document.querySelectorAll('.author-word-toggle');
    
    // Pro každé tlačítko nastavíme událost kliknutí
    toggles.forEach(toggle => {
        // Odstraníme existující posluchače událostí pomocí klonování a nahrazení prvku
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        // Přidáme nový posluchač události
        newToggle.addEventListener('click', function() {
            // Najdeme související obsah - prvek hned za tlačítkem
            const content = this.nextElementSibling;
            // Najdeme šipku uvnitř tlačítka
            const arrow = this.querySelector('.arrow');
            
            // Pokud jsou prvky nalezeny
            if (content && arrow) {
                // Přepínáme podle aktuálního stavu
                if (content.style.maxHeight) {
                    // Pokud je obsah zobrazen, skryjeme ho
                    content.style.maxHeight = null;
                    arrow.textContent = '▼';
                } else {
                    // Pokud je obsah skryt, zobrazíme ho
                    content.style.maxHeight = content.scrollHeight + "px";
                    arrow.textContent = '▲';
                }
            }
        });
    });
    
    console.log('Nastaveno ' + toggles.length + ' tlačítek "Slovo autora"');
}

// Initialize the page after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load post details
    loadPostDetails();
    
    // Přidáme přímé nastavení po načtení DOM
    setTimeout(function() {
        setupAuthorWordToggle();
    }, 500);
});

// Funkce pro inicializaci tlačítek pro sdílení
function initShareButtons() {
    // Získáme aktuální URL stránky
    const currentUrl = window.location.href;
    
    // Získáme titulek stránky
    const pageTitle = document.title;
    
    // Získáme tlačítka pro sdílení
    const facebookShare = document.querySelector('.share-link.facebook');
    const twitterShare = document.querySelector('.share-link.twitter');
    const emailShare = document.querySelector('.share-link.email');
    
    // Nastavíme odkazy pro sdílení
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
