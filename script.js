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
    
    // Přidání okraje mezi featured post a karuselem
    addMarginToPostsCarousel();
    
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

function adjustAuthorsCarouselArrows() {
    // Get the carousel track and slides
    const carouselTrack = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevArrow = document.querySelector('.authors-carousel .carousel-arrow.prev');
    const nextArrow = document.querySelector('.authors-carousel .carousel-arrow.next');
    
    if (!carouselTrack || !slides.length || !prevArrow || !nextArrow) return;
    
    // Check if we have fewer authors than the maximum display (4)
    const currentSlide = slides[0]; // Only need to check the first slide
    const authorCards = currentSlide.querySelectorAll('.author-card');
    
    if (authorCards.length < 4) {
        // Calculate the available space and center the content
        const availableWidth = carouselTrack.offsetWidth;
        const usedWidth = authorCards.length * 200; // Approximate width per author card with margins
        const emptySpace = availableWidth - usedWidth;
        
        if (emptySpace > 0) {
            // Move arrows closer based on the empty space
            const arrowAdjustment = Math.min(emptySpace / 2, 100); // Max 100px adjustment
            
            // Apply new positions to arrows
            prevArrow.style.left = `${arrowAdjustment}px`;
            nextArrow.style.right = `${arrowAdjustment}px`;
        }
    }
}
function generatePostsCarousel() {
    const postsContainer = document.getElementById('posts-container');
    const indicatorContainer = document.getElementById('posts-indicator');
    const featuredPostContainer = document.getElementById('featured-post-container');
    
    // Pokud elementy neexistují, vrátíme 0
    if (!postsContainer || !featuredPostContainer) return 0;
    
    // Vyčistit obsah
    postsContainer.innerHTML = '';
    featuredPostContainer.innerHTML = '';
    if (indicatorContainer) indicatorContainer.innerHTML = '';
    
    // Seřadíme příspěvky podle data (nejnovější první)
    const sortedPosts = [...postsData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Nejnovější příspěvek bude featured
    const featuredPost = sortedPosts[0];
    
    // Vytvoříme featured příspěvek
    featuredPostContainer.innerHTML = `
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
    
    // Zbývající příspěvky rozdělíme do slidů po 3
    const remainingPosts = sortedPosts.slice(1);
    const postsPerSlide = 3;
    const slidesNeeded = Math.ceil(remainingPosts.length / postsPerSlide);
    
    for (let i = 0; i < slidesNeeded; i++) {
        // Získáme příspěvky pro tento slide
        const startIndex = i * postsPerSlide;
        const postsForThisSlide = remainingPosts.slice(startIndex, startIndex + postsPerSlide);
        
        // Vytvoříme nový slide
        const slide = document.createElement('div');
        slide.className = 'posts-grid posts-grid-home';
        if (i !== 0) {
            slide.style.display = 'none'; // Skryjeme všechny slidey kromě prvního
        }
        
        // Přidáme příspěvky do slidu
        postsForThisSlide.forEach(post => {
            slide.innerHTML += `
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
    // Zjistíme počet slidů s příspěvky (počet .posts-grid-home elementů)
    const postSlides = document.querySelectorAll('.posts-grid-home');
    postSlidesCount = postSlides.length;
    
    // Pokud nemáme dostatek slidů, není třeba karusel
    if (postSlidesCount <= 1) return;
    
    // Nastavíme posluchače událostí na tlačítka
    const prevButton = document.querySelector('.posts-carousel .carousel-arrow.prev');
    const nextButton = document.querySelector('.posts-carousel .carousel-arrow.next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => movePostsTo(currentPostSlide - 1));
        nextButton.addEventListener('click', () => movePostsTo(currentPostSlide + 1));
    }
}

// Přidáme okraj mezi hlavním příspěvkem a karuselem
function addMarginToPostsCarousel() {
    const featuredPostContainer = document.getElementById('featured-post-container');
    const postsCarousel = document.querySelector('.posts-carousel');
    
    if (featuredPostContainer && postsCarousel) {
        // Přidáme spodní okraj k featuredPostContainer
        featuredPostContainer.style.marginBottom = '50px';
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
    
    // Získáme všechny posty v karuselu (ne featured post, který zůstává stabilní)
    const postGroups = document.querySelectorAll('.posts-grid-home');
    if (!postGroups.length) return;
    
    // Skryjeme všechny skupiny postů
    postGroups.forEach((group, i) => {
        if (i === currentPostSlide) {
            group.style.display = 'flex';
        } else {
            group.style.display = 'none';
        }
    });
    
    // Aktualizace indikátorů
    const dots = document.querySelectorAll('#posts-indicator .indicator-dot');
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
