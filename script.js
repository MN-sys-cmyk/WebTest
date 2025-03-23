// Globální proměnné
let currentSlide = 0;
let slidesCount = 0;

// Funkce pro inicializaci
function init() {
    // Generování autorů
    generateAuthorsCarousel();
    
    // Generování příspěvků
    generatePosts();
    
    // Inicializace karuselu
    initCarousel();
    
    // Inicializace mobilního menu
    initMobileMenu();
}

// Generování karuselu autorů
function generateAuthorsCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const indicatorContainer = document.getElementById('carousel-indicator');
    
    // Vyčistit obsah
    carouselTrack.innerHTML = '';
    indicatorContainer.innerHTML = '';
    
    // Rozdělíme autory na skupiny po 3
    const authorsPerSlide = 3;
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
                <a href="#" class="author-card">
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
        dot.onclick = () => moveTo(i);
        indicatorContainer.appendChild(dot);
    }
    
    return slidesNeeded;
}

// Generování příspěvků
function generatePosts() {
    const postsContainer = document.querySelector('.posts-container');
    
    // Vyčistit obsah
    postsContainer.innerHTML = '';
    
    // Najdeme featured příspěvek
    const featuredPost = postsData.find(post => post.featured) || postsData[0];
    
    // Vytvoříme featured příspěvek
    const featuredPostHTML = `
        <div class="featured-post">
            <div class="featured-post-image" style="background-image: url('${featuredPost.image}');"></div>
            <div class="featured-post-content">
                <div class="post-meta">
                    <span class="post-date">${featuredPost.date}</span>
                    <span class="post-category">${featuredPost.category}</span>
                </div>
                <h3 class="post-title">${featuredPost.title}</h3>
                <p class="post-excerpt">${featuredPost.excerpt}</p>
                <a href="#" class="read-more">Přečíst celý text</a>
            </div>
        </div>
    `;
    
    // Ostatní příspěvky
    const otherPosts = postsData.filter(post => post.id !== featuredPost.id).slice(0, 3);
    
    let otherPostsHTML = '<div class="posts-grid">';
    
    otherPosts.forEach(post => {
        otherPostsHTML += `
            <div class="post-card">
                <div class="post-card-image" style="background-image: url('${post.image}');"></div>
                <div class="post-card-content">
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="#" class="read-more">Číst více</a>
                </div>
            </div>
        `;
    });
    
    otherPostsHTML += '</div>';
    
    // Přidáme vše do kontejneru
    postsContainer.innerHTML = featuredPostHTML + otherPostsHTML;
}

// Inicializace karuselu
function initCarousel() {
    // Zjistíme počet slidů
    const slides = document.querySelectorAll('.carousel-slide');
    slidesCount = slides.length;
    
    if (slidesCount < 2) return; // Není potřeba karusel pro jeden slide
    
    // Nastavíme posluchače událostí na tlačítka
    document.querySelector('.carousel-arrow.prev').addEventListener('click', () => moveTo(currentSlide - 1));
    document.querySelector('.carousel-arrow.next').addEventListener('click', () => moveTo(currentSlide + 1));
}

// Funkce pro pohyb na konkrétní slide
function moveTo(index) {
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
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Aktualizace indikátorů
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
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

// Pro kompatibilitu se stávajícím HTML
function moveCarousel(direction) {
    moveTo(currentSlide + direction);
}

function goToSlide(index) {
    moveTo(index);
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', init);
