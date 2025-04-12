// JavaScript pro stránku s detailem autora

// Funkce pro načtení detailu autora a jeho příspěvků
function loadAuthorDetails() {
    // Získáme ID autora z URL parametru
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');
    
    // Pokud nemáme ID autora, přesměrujeme na hlavní stránku
    if (!authorId) {
        console.error('Nebylo zadáno ID autora');
        window.location.href = 'index.html';
        return;
    }
    
    // Najdeme autora podle ID
    const author = authorsData.find(a => a.id === authorId);
    
    // Pokud autor neexistuje, přesměrujeme na hlavní stránku
    if (!author) {
        console.error('Autor s ID ' + authorId + ' nebyl nalezen');
        window.location.href = 'index.html';
        return;
    }
    
    // Aktualizujeme obsah stránky podle dat autora
    document.title = author.name + ' - LiterárníKomunita';
    
    const authorNameElement = document.getElementById('authorName');
    const authorGenreElement = document.getElementById('authorGenre');
    const authorImageElement = document.getElementById('authorImage');
    const authorBioElement = document.getElementById('authorBio');
    
    if (authorNameElement) authorNameElement.textContent = author.name;
    if (authorGenreElement) authorGenreElement.textContent = author.genre;
    if (authorImageElement) authorImageElement.src = author.image;
    if (authorBioElement) authorBioElement.textContent = author.bio;
    
    // Načteme příspěvky autora
    loadAuthorPosts(author.name);
}

// Funkce pro načtení příspěvků autora
function loadAuthorPosts(authorName) {
    // Získáme kontejner pro příspěvky
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) {
        console.error('Kontejner pro příspěvky nebyl nalezen');
        return;
    }
    
    // Filtrujeme příspěvky autora
    const authorPosts = postsData.filter(post => post.author === authorName);
    
    // Pokud nejsou žádné příspěvky, zobrazíme zprávu
    if (authorPosts.length === 0) {
        postsGrid.innerHTML = '<p>Tento autor zatím nemá žádné příspěvky.</p>';
        return;
    }
    
    // Seřadíme příspěvky podle data (nejnovější první)
    authorPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Omezíme počet příspěvků na prvních 6 nejnovějších
    const recentPosts = authorPosts.slice(0, 6);
    
    // Generujeme HTML pro každý příspěvek
    let postsHTML = '';
    
    recentPosts.forEach(post => {
        postsHTML += `
            <div class="post-card author-page-card">
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
    
    // Upravíme styl mřížky pro správné zobrazení
    postsGrid.style.display = 'flex';
    postsGrid.style.flexWrap = 'wrap';
    postsGrid.style.gap = '30px';
    postsGrid.style.justifyContent = 'flex-start';
    
    // Inicializujeme tlačítka pro "slovo autora"
    initAuthorWordToggle();
}

// Inicializace tlačítka slovo autora
function initAuthorWordToggle() {
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

// Inicializace stránky po načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    // Načteme detail autora
    loadAuthorDetails();
    
    // Inicializace mobilního menu
    initMobileMenu();
});

// Funkce pro inicializaci mobilního menu
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
