// JavaScript pro stránku se všemi texty

// Funkce pro načtení všech příspěvků
function loadAllPosts() {
    if (typeof postsData === 'undefined') {
        console.error('Data příspěvků nejsou k dispozici');
        return;
    }
    
    const postsGrid = document.getElementById('all-posts-grid');
    if (!postsGrid) {
        console.error('Kontejner pro příspěvky nebyl nalezen');
        return;
    }
    
    const sortedPosts = [...postsData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    let postsHTML = '';
    
    sortedPosts.forEach(post => {
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
                        <div style="display: none;"><p id="authorWord">${post.excerpt}</p></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    postsGrid.innerHTML = postsHTML;

    // Inicializace tlačítka slovo autora
    initAuthorWordToggle();
}

document.addEventListener('DOMContentLoaded', function() {
    loadAllPosts();
    initMobileMenu();
});
