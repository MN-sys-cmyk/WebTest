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
    
    // Inicializace tlačítek slovo autora
    // Tuto funkci nyní voláme v každém JS souboru, kde jsou generovány příspěvky
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    init();
    initMobileMenu();
    initAuthorWordToggle(); // Inicializace na hlavní stránce
});

// Generování karuselu autorů
function generateAuthorsCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const indicatorContainer = document.getElementById('carousel-indicator');
    
    if (!carouselTrack || !indicatorContainer) return 0;
    
    carouselTrack.innerHTML = '';
    indicatorContainer.innerHTML = '';
    
    const authorsPerSlide = 4;
    const slidesNeeded = Math.ceil(authorsData.length / authorsPerSlide);
    
    for (let i = 0; i < slidesNeeded; i++) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const startIndex = i * authorsPerSlide;
        const endIndex = Math.min(startIndex + authorsPerSlide, authorsData.length);
        
        let slideHTML = '';
        for (let j = startIndex; j < endIndex; j++) {
            const author = authorsData[j];
            slideHTML += `
                <a href="author.html?id=${author.id}" class="author-card">
                    <div class="author-image-container">
                        <img src="${author.image}" alt="${author.name}" class="author-image">
                    </div>
                    <h3 class="author-name">${author.name}</h3>
                    <p class="author-genre">${author.genre}</p>
                </a>
            `;
        }
        slide.innerHTML = slideHTML;
        carouselTrack.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => moveAuthorsTo(i);
        indicatorContainer.appendChild(dot);
    }
    
    return slidesNeeded;
}

// Generování karuselu příspěvků pro plynulé přecházení
function generatePostsCarousel() {
    const postsContainer = document.getElementById('posts-container');
    const indicatorContainer = document.getElementById('posts-indicator');
    const featuredPostContainer = document.getElementById('featured-post-container');
    
    if (!postsContainer || !featuredPostContainer) return 0;
    
    postsContainer.innerHTML = '';
    featuredPostContainer.innerHTML = '';
    if (indicatorContainer) indicatorContainer.innerHTML = '';
    
    const sortedPosts = [...postsData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    const featuredPost = sortedPosts[0];
    
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
                <div class="author-word-box">
                    <div class="author-word-toggle">
                        <span>Slovo autora</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div style="display: none;"><p id="authorWord">${featuredPost.excerpt}</p></div>
                </div>
            </div>
        </div>
    `;
    
    const postsTrack = document.createElement('div');
    postsTrack.className = 'posts-carousel-track';
    postsTrack.style.display = 'flex';
    postsTrack.style.transition = 'transform 0.5s ease';
    postsContainer.appendChild(postsTrack);
    
    const remainingPosts = sortedPosts.slice(1);
    const postsPerSlide = 3;
    const slidesNeeded = Math.ceil(remainingPosts.length / postsPerSlide);
    
    for (let i = 0; i < slidesNeeded; i++) {
        const startIndex = i * postsPerSlide;
        const postsForThisSlide = remainingPosts.slice(startIndex, startIndex + postsPerSlide);
        
        const slide = document.createElement('div');
        slide.className = 'posts-slide';
        slide.style.minWidth = '100%';
        slide.style.display = 'flex';
        slide.style.flexWrap = 'wrap';
        slide.style.justifyContent = 'space-between';
        slide.style.gap = '20px';
        
        let slideHTML = '';
        postsForThisSlide.forEach(post => {
            slideHTML += `
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
                            <div style="display: none;"><p class="authorWordText">${post.excerpt}</p></div>
                        </div>
                    </div>
                </div>
            `;
        });
        slide.innerHTML = slideHTML;
        postsTrack.appendChild(slide);
        
        if (indicatorContainer) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => movePostsTo(i);
            indicatorContainer.appendChild(dot);
        }
    }
    
    adjustPostsCarouselResponsive(postsTrack);
    
    return slidesNeeded;
}

// Funkce pro přizpůsobení responsivního designu karuselu příspěvků
function adjustPostsCarouselResponsive(postsTrack) {
    if (!postsTrack) return;
    
    const postCards = postsTrack.querySelectorAll('.post-card');
    
    const adjustLayout = () => {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth <= 992 && viewportWidth > 576) {
            postCards.forEach(card => {
                card.style.flex = '0 0 calc(50% - 10px)';
                card.style.maxWidth = 'calc(50% - 10px)';
            });
        } else if (viewportWidth <= 576) {
            postCards.forEach(card => {
                card.style.flex = '0 0 100%';
                card.style.maxWidth = '100%';
            });
        } else {
            postCards.forEach(card => {
                card.style.flex = '0 0 calc(33.333% - 14px)';
                card.style.maxWidth = 'calc(33.333% - 14px)';
            });
        }
    };
    
    adjustLayout();
    window.addEventListener('resize', adjustLayout);
}

// Inicializace karuselu autorů
function initAuthorsCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    slidesCount = slides.length;
    
    if (slidesCount < 2) return;
    
    const prevButton = document.querySelector('.authors-carousel .carousel-arrow.prev');
    const nextButton = document.querySelector('.authors-carousel .carousel-arrow.next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => moveAuthorsTo(currentSlide - 1));
        nextButton.addEventListener('click', () => moveAuthorsTo(currentSlide + 1));
    }
}

// Přidáme okraj mezi hlavním příspěvkem a karuselem
function addMarginToPostsCarousel() {
    const featuredPostContainer = document.getElementById('featured-post-container');
    const postsCarousel = document.querySelector('.posts-carousel');
    
    if (featuredPostContainer && postsCarousel) {
        featuredPostContainer.style.marginBottom = '50px';
    }
}

// Funkce pro pohyb karuselu autorů na konkrétní slide
function moveAuthorsTo(index) {
    if (index < 0) {
        index = slidesCount - 1;
    } else if (index >= slidesCount) {
        index = 0;
    }
    
    currentSlide = index;
    
    const track = document.getElementById('carousel-track');
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    const dots = document.querySelectorAll('.authors-carousel .indicator-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Funkce pro pohyb karuselu příspěvků na konkrétní slide (plynulý pohyb)
function movePostsTo(index) {
    if (index < 0) {
        index = postSlidesCount - 1;
    } else if (index >= postSlidesCount) {
        index = 0;
    }
    
    currentPostSlide = index;
    
    const track = document.querySelector('.posts-carousel-track');
    if (track) {
        track.style.transform = `translateX(-${currentPostSlide * 100}%)`;
    }
    
    const dots = document.querySelectorAll('#posts-indicator .indicator-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPostSlide);
    });
}
