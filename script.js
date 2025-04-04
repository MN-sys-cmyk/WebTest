// Globální proměnné
let currentSlide = 0;
let slidesCount = 0;
let currentPostSlide = 0;
let postSlidesCount = 0;

// Funkce pro inicializaci
function init() {
    // Generování autorů
    slidesCount = generateAuthorsCarousel();
    
    // Generování příspěvků
    postSlidesCount = generatePostsCarousel();
    
    // Inicializace karuselu autorů
    initAuthorsCarousel();
    
    // Inicializace karuselu příspěvků
    initPostsCarousel();
    
    // Inicializace mobilního menu
    initMobileMenu();
    
    // Inicializace tlačítka slovo autora
    initAuthorWordToggle();
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', init);

// Generování karuselu autorů
function generateAuthorsCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const indicatorContainer = document.getElementById('carousel-indicator');
    
    // Pokud elementy neexistují, vrátíme 0
    if (!carouselTrack || !indicatorContainer) return 0;
    
    // Vyčistit obsah
    carouselTrack.innerHTML = '';
    indicatorContainer.innerHTML = '';
    
    // Rozdělíme autory na skupiny po 4
    const authorsPerSlide = 4;
    const slidesNeeded = Math.ceil(authorsData.length / authorsPerSlide);
    
    for (let i = 0; i < slidesNeeded; i++) {
        // Vytvoříme nový slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        // Přidáme autory do slidu
        const startIndex = i * authorsPerSlide;
        const endIndex = Math.min(startIndex + authorsPerSlide, authorsData.length);
        
        for (let j = startIndex; j < endIndex; j++) {
            const author = authorsData[j];
            slide.innerHTML += `
                <a href="author.html?id=${author.id}" class="author-card">
                    <div class="author-image-container">
                        <img src="${author.image}" alt="${author.name}" class="author-image">
                    </div>
                    <h3 class="author-name">${author.name}</h3>
                    <p class="author-genre">${author.genre}</p>
                </a>
            `;
        }
        
        // Přidáme slide do karuselu
        carouselTrack.appendChild(slide);
        
        // Přidáme indikátor
        const dot = document.createElement('div');
        dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => moveAuthorsTo(i);
        indicatorContainer.appendChild(dot);
    }
    
    return slidesNeeded;
}

// Generování karuselu příspěvků
function generatePostsCarousel() {
    const postsContainer = document.getElementById('posts-container');
    const indicatorContainer = document.getElementById('posts-indicator');
    
    // Pokud elementy neexistují, vrátíme 0
    if (!postsContainer) return 0;
    
    // Vyčistit obsah
    postsContainer.innerHTML = '';
    if (indicatorContainer) indicatorContainer.innerHTML = '';
    
    // Seřadíme příspěvky podle data (nejnovější první)
    const sortedPosts = [...postsData].sort((a, b) => {
        // Porovnáváme data ve formátu YYYY-MM-DD
        return new Date(b.date) - new Date(a.date);
    });
    
    // ZMĚNA: Vytvoříme slidey s příspěvky (1 slide = 1 featured + 3 běžné příspěvky)
    // Kolik příspěvků zobrazíme na jeden slide
    const postsPerSlide = 4;
    const slidesNeeded = Math.ceil(sortedPosts.length / postsPerSlide);
    
    for (let i = 0; i < slidesNeeded; i++) {
        // Vytvoříme nový slide
        const slide = document.createElement('div');
        slide.className = 'posts-slide';
        
        // Získáme příspěvky pro tento slide
        const startIndex = i * postsPerSlide;
        const postsForThisSlide = sortedPosts.slice(startIndex, startIndex + postsPerSlide);
        
        // První příspěvek bude featured
        const featuredPost = postsForThisSlide[0];
        
        // Vytvoříme featured příspěvek
        const featuredPostHTML = `
            <div class="featured-post">
                <div class="featured-post-image" style="background-image: url('${featuredPost.image}');"></div>
                <div class="featured-post-content">
                    <div class="post-meta">
                        <span class="post-date">${featuredPost.displayDate || featuredPost.date}</span>
                        <span class="post-category">${featuredPost.category}</span>
                    </div>
                    <h3 class="post-title">${featuredPost.title}</h3>
                    <p class="post-excerpt">${featuredPost.excerpt}</p>
                    <a href="post.html?id=${featuredPost.id}" class="read-more">Přečíst celý text</a>
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
        
        // Ostatní příspěvky v tomto slidu
        const otherPosts = postsForThisSlide.slice(1);
        
        let otherPostsHTML = '<div class="posts-grid">';
        
        otherPosts.forEach(post => {
            otherPostsHTML += `
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
            `;
        });
        
        otherPostsHTML += '</div>';
        
        // Přidáme vše do slidu
        slide.innerHTML = featuredPostHTML + otherPostsHTML;
        
        // Přidáme slide do karuselu
        postsContainer.appendChild(slide);
        
        // Přidáme indikátor, pokud kontejner existuje
        if (indicatorContainer) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => movePostsTo(i);
            indicatorContainer.appendChild(dot);
        }
    }
    
    return slidesNeeded;
}

// Inicializace karuselu autorů
function initAuthorsCarousel() {
    // Zjistíme počet slidů
    const slides = document.querySelectorAll('.carousel-slide');
    slidesCount = slides.length;
    
    if (slidesCount < 2) return; // Není potřeba karusel pro jeden slide
    
    // Nastavíme posluchače událostí na tlačítka
    const prevButton = document.querySelector('.authors-carousel .carousel-arrow.prev');
    const nextButton = document.querySelector('.authors-carousel .carousel-arrow.next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => moveAuthorsTo(currentSlide - 1));
        nextButton.addEventListener('click', () => moveAuthorsTo(currentSlide + 1));
    }
}

// Inicializace karuselu příspěvků
function initPostsCarousel() {
    // Zjistíme počet slidů
    const slides = document.querySelectorAll('.posts-slide');
    postSlidesCount = slides.length;
    
    if (postSlidesCount < 2) return; // Není potřeba karusel pro jeden slide
    
    // Nastavíme posluchače událostí na tlačítka
    const prevButton = document.querySelector('.posts-carousel .carousel-arrow.prev');
    const nextButton = document.querySelector('.posts-carousel .carousel-arrow.next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => movePostsTo(currentPostSlide - 1));
        nextButton.addEventListener('click', () => movePostsTo(currentPostSlide + 1));
    }
}

// Funkce pro pohyb karuselu autorů na konkrétní slide
function moveAuthorsTo(index) {
    // Zajištění nekonečné cykličnosti
    if (index < 0) {
        index = slidesCount - 1;
    } else if (index >= slidesCount) {
        index = 0;
    }
    
    // Aktualizace aktuálního indexu
    currentSlide = index;
    
    // Pohyb karuselu
    const track = document.getElementById('carousel-track');
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Aktualizace indikátorů
    const dots = document.querySelectorAll('.authors-carousel .indicator-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Funkce pro pohyb karuselu příspěvků na konkrétní slide
function movePostsTo(index) {
    // Zajištění nekonečné cykličnosti
    if (index < 0) {
        index = postSlidesCount - 1;
    } else if (index >= postSlidesCount) {
        index = 0;
    }
    
    // Aktualizace aktuálního indexu
    currentPostSlide = index;
    
    // Pohyb karuselu
    const container = document.getElementById('posts-container');
    if (container) {
        container.style.transform = `translateX(-${currentPostSlide * 100}%)`;
    }
    
    // Aktualizace indikátorů
    const dots = document.querySelectorAll('.posts-carousel .indicator-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPostSlide);
    });
}

// Inicializace mobilního menu
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

// Pro kompatibilitu se stávajícím HTML
function moveCarousel(direction) {
    moveAuthorsTo(currentSlide + direction);
}

function goToSlide(index) {
    moveAuthorsTo(index);
}
