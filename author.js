// JavaScript pro stránku s detailem autora

function loadAuthorDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');
    
    if (!authorId) {
        console.error('Nebylo zadáno ID autora');
        window.location.href = 'index.html';
        return;
    }
    
    const author = authorsData.find(a => a.id === authorId);
    
    if (!author) {
        console.error('Autor s ID ' + authorId + ' nebyl nalezen');
        window.location.href = 'index.html';
        return;
    }
    
    document.title = author.name + ' - LiterárníKomunita';
    
    const authorNameElement = document.getElementById('authorName');
    const authorGenreElement = document.getElementById('authorGenre');
    const authorImageElement = document.getElementById('authorImage');
    const authorBioElement = document.getElementById('authorBio');
    
    if (authorNameElement) authorNameElement.textContent = author.name;
    if (authorGenreElement) authorGenreElement.textContent = author.genre;
    if (authorImageElement) authorImageElement.src = author.image;
    if (authorBioElement) authorBioElement.textContent = author.bio;
    
    loadAuthorPosts(author.name);
}

function loadAuthorPosts(authorName) {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) {
        console.error('Kontejner pro příspěvky nebyl nalezen');
        return;
    }
    
    const authorPosts = postsData.filter(post => post.author === authorName);
    
    if (authorPosts.length === 0) {
        postsGrid.innerHTML = '<p>Tento autor zatím nemá žádné příspěvky.</p>';
        return;
    }
    
    authorPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const recentPosts = authorPosts.slice(0, 6);
    
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
                    <div class="author-word-box">
                        <div class="author-word-toggle">
                            <span>Slovo autora</span>
                            <span class="arrow">▼</span>
                        </div>
                        <div style="display: none;"><p id="authorWord">${post.excerpt}</p></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    postsGrid.innerHTML = postsHTML;
    
    postsGrid.style.display = 'flex';
    postsGrid.style.flexWrap = 'wrap';
    postsGrid.style.gap = '30px';
    postsGrid.style.justifyContent = 'flex-start';

    initAuthorWordToggle();
}

document.addEventListener('DOMContentLoaded', function() {
    loadAuthorDetails();
    initMobileMenu();
});
