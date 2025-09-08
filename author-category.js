// JavaScript pro stránku s texty podle autora

// Funkce pro načtení příspěvků podle autora
function loadAuthorCategoryPosts() {
    // Získáme autora z URL parametru
    const urlParams = new URLSearchParams(window.location.search);
    const author = urlParams.get('author');
    
    // Pokud nemáme autora, přesměrujeme na hlavní stránku
    if (!author) {
        console.error('Nebyl zadán autor');
        window.location.href = 'index.html';
        return;
    }
    
    // Aktualizujeme nadpis stránky
    const authorTitle = document.getElementById('author-title');
    const authorSubtitle = document.getElementById('author-subtitle');
    
    if (authorTitle) {
        authorTitle.textContent = `Texty autora: ${author}`;
    }
    
    if (authorSubtitle) {
        authorSubtitle.textContent = `Všechny texty autora ${author}`;
    }
    
    // Zkontrolujeme, zda existuje globální proměnná postsData
    if (typeof postsData === 'undefined') {
        console.error('Data příspěvků nejsou k dispozici');
        return;
    }
    
    // Filtrujeme příspěvky podle autora
    const authorPosts = postsData.filter(post => post.author === author);
    
    // Seřadíme příspěvky podle data (nejnovější první)
    authorPosts.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Získáme kontejner pro příspěvky
    const postsGrid = document.getElementById('author-category-posts-grid');
    if (!postsGrid) {
        console.error('Kontejner pro příspěvky nebyl nalezen');
        return;
    }
    
    // Pokud nejsou žádné příspěvky od daného autora, zobrazíme zprávu
    if (authorPosts.length === 0) {
        postsGrid.innerHTML = '<p>Tento autor zatím nemá žádné příspěvky.</p>';
        return;
    }
    
    // Vygenerujeme HTML pro příspěvky
    let postsHTML = '';
    
    authorPosts.forEach(post => {
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
    
    // Inicializujeme tlačítka slovo autora
    initAuthorWordToggle();
}

// Inicializace stránky po načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    // Načteme příspěvky podle autora
    loadAuthorCategoryPosts();
});
