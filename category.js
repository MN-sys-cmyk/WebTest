// JavaScript pro stránku s texty podle kategorie

// Funkce pro načtení příspěvků podle kategorie
function loadCategoryPosts() {
    // Získáme kategorii z URL parametru
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // Pokud nemáme kategorii, přesměrujeme na hlavní stránku
    if (!category) {
        console.error('Nebyla zadána kategorie');
        window.location.href = 'index.html';
        return;
    }
    
    // Aktualizujeme nadpis stránky
    const categoryTitle = document.getElementById('category-title');
    const categorySubtitle = document.getElementById('category-subtitle');
    
    if (categoryTitle) {
        categoryTitle.textContent = `Texty v kategorii: ${category}`;
    }
    
    if (categorySubtitle) {
        categorySubtitle.textContent = `Všechny texty v kategorii ${category}`;
    }
    
    // Zkontrolujeme, zda existuje globální proměnná postsData
    if (typeof postsData === 'undefined') {
        console.error('Data příspěvků nejsou k dispozici');
        return;
    }
    
    // Filtrujeme příspěvky podle kategorie
    const categoryPosts = postsData.filter(post => post.category === category);
    
    // Seřadíme příspěvky podle data (nejnovější první)
    categoryPosts.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Získáme kontejner pro příspěvky
    const postsGrid = document.getElementById('category-posts-grid');
    if (!postsGrid) {
        console.error('Kontejner pro příspěvky nebyl nalezen');
        return;
    }
    
    // Pokud nejsou žádné příspěvky v dané kategorii, zobrazíme zprávu
    if (categoryPosts.length === 0) {
        postsGrid.innerHTML = '<p>V této kategorii nejsou zatím žádné příspěvky.</p>';
        return;
    }
    
    // Vygenerujeme HTML pro příspěvky
    let postsHTML = '';
    
    categoryPosts.forEach(post => {
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
    
    // Inicializace tlačítka slovo autora
    initAuthorWordToggle();
}

// Inicializace stránky po načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    // Načteme příspěvky podle kategorie
    loadCategoryPosts();
    
    // Inicializace mobilního menu
    initMobileMenu();
});
