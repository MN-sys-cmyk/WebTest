// Upravená funkce generateAuthorsCarousel pro fungující odkazy na autory
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

// Upravená funkce generatePostsCarousel pro fungující odkazy na příspěvky
function generatePostsCarousel() {
    const postsContainer = document.getElementById('posts-container');
    const indicatorContainer = document.getElementById('posts-indicator');
    
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
