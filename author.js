// Upravená funkce pro načtení dat autora podle ID z URL
function loadAuthorData() {
    // Získáme ID autora z URL parametru
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');
    
    // Pokud nemáme ID autora, přesměrujeme na hlavní stránku
    if (!authorId) {
        console.error('Nebylo zadáno ID autora');
        return;
    }
    
    // Najdeme autora podle ID v datech
    const author = authorsData.find(author => author.id === authorId);
    
    // Pokud autor neexistuje, přesměrujeme na hlavní stránku
    if (!author) {
        console.error('Autor s ID ' + authorId + ' nebyl nalezen');
        return;
    }
    
    // Naplníme stránku daty autora
    populateAuthorPage(author);
    
    // Načteme příspěvky autora
    loadAuthorPosts(author.name);
    
    // Inicializujeme tlačítka slovo autora
    initAuthorWordToggle();
}

// Funkce pro naplnění stránky daty autora
function populateAuthorPage(author) {
    // Nastavíme titulek stránky
    document.title = author.name + ' - LiterárníKomunita';
    
    // Nastavíme jméno autora
    const authorNameElement = document.getElementById('authorName');
    if (authorNameElement) {
        authorNameElement.textContent = author.name;
    }
    
    // Nastavíme žánr autora
    const authorGenreElement = document.getElementById('authorGenre');
    if (authorGenreElement) {
        authorGenreElement.textContent = author.genre;
    }
    
    // Nastavíme biografii autora
    const authorBioElement = document.getElementById('authorBio');
    if (authorBioElement && author.bio) {
        authorBioElement.textContent = author.bio;
    }
    
    // Nastavíme obrázek autora
    const authorImageElement = document.getElementById('authorImage');
    if (authorImageElement && author.image) {
        authorImageElement.src = author.image;
        authorImageElement.alt = author.name;
    }
}

// Funkce pro načtení příspěvků autora
function loadAuthorPosts(authorName) {
    // Zkontrolujeme, zda existuje globální proměnná postsData
    if (typeof postsData === 'undefined') {
        console.error('Data příspěvků nejsou k dispozici');
        return;
    }
    
    // Filtrujeme příspěvky podle jména autora
    const authorPosts = postsData.filter(post => post.author === authorName);
    
    // Seřadíme příspěvky podle data (nejnovější první)
    authorPosts.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Získáme kontejner pro příspěvky
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) {
        console.error('Kontejner pro příspěvky nebyl nalezen');
        return;
    }
    
    // Pokud nemá autor žádné příspěvky, zobrazíme zprávu
    if (authorPosts.length === 0) {
        postsGrid.innerHTML = '<p>Autor zatím nemá žádné příspěvky.</p>';
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
    // Načteme data autora
    loadAuthorData();
    
    // Inicializace mobilního menu
    initMobileMenu();
});

// Funkce pro inicializaci mobilního menu (zkopírováno z hlavní stránky)
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
