// JavaScript pro stránku se všemi autory

// Funkce pro načtení všech autorů
function loadAllAuthors() {
    // Zkontrolujeme, zda existuje globální proměnná authorsData
    if (typeof authorsData === 'undefined') {
        console.error('Data autorů nejsou k dispozici');
        return;
    }
    
    // Získáme kontejner pro autory
    const authorsGrid = document.getElementById('authors-grid');
    if (!authorsGrid) {
        console.error('Kontejner pro autory nebyl nalezen');
        return;
    }
    
    // Vygenerujeme HTML pro všechny autory
    let authorsHTML = '';
    
    authorsData.forEach(author => {
        authorsHTML += `
            <a href="author.html?id=${author.id}" class="author-card">
                <div class="author-image-container">
                    <img src="${author.image}" alt="${author.name}" class="author-image">
                </div>
                <h3 class="author-name">${author.name}</h3>
                <p class="author-genre">${author.genre}</p>
            </a>
        `;
    });
    
    // Vložíme HTML do kontejneru
    authorsGrid.innerHTML = authorsHTML;
}

// Inicializace stránky po načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    // Načteme všechny autory
    loadAllAuthors();
    
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
