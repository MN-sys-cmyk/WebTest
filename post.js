// JavaScript pro stránku příspěvku

// Funkce pro načtení dat příspěvku podle ID z URL
function loadPostData() {
    // Získáme ID příspěvku z URL parametru
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    // Pokud nemáme ID příspěvku, přesměrujeme na hlavní stránku
    if (!postId) {
        console.error('Nebylo zadáno ID příspěvku');
        return;
    }
    
    // Najdeme příspěvek podle ID v datech
    const post = findPostById(postId);
    
    // Pokud příspěvek neexistuje, přesměrujeme na hlavní stránku
    if (!post) {
        console.error('Příspěvek s ID ' + postId + ' nebyl nalezen');
        return;
    }
    
    // Naplníme stránku daty příspěvku
    populatePostPage(post);
    
    // Najdeme autora příspěvku
    const author = findAuthorByName(post.author);
    
    // Naplníme informace o autorovi
    if (author) {
        populateAuthorInfo(author);
    }
    
    // Načteme související příspěvky
    loadRelatedPosts(post);
    
    // Inicializujeme tlačítka slovo autora
    initAuthorWordToggle();
}

// Funkce pro vyhledání příspěvku podle ID
function findPostById(postId) {
    // Zkontrolujeme, zda existuje globální proměnná postsData
    if (typeof postsData === 'undefined') {
        console.error('Data příspěvků nejsou k dispozici');
        return null;
    }
    
    // Najdeme příspěvek podle ID
    return postsData.find(post => post.id == postId);
}

// Funkce pro vyhledání autora podle jména
function findAuthorByName(authorName) {
    // Zkontrolujeme, zda existuje globální proměnná authorsData
    if (typeof authorsData === 'undefined') {
        console.error('Data autorů nejsou k dispozici');
        return null;
    }
    
    // Najdeme autora podle jména
    return authorsData.find(author => author.name === authorName);
}

// Funkce pro naplnění stránky daty příspěvku
function populatePostPage(post) {
    // Nastavíme titulek stránky
    document.title = post.title + ' - LiterárníKomunita';
    
    // Nastavíme datum příspěvku
    const postDateElement = document.getElementById('postDate');
    if (postDateElement) {
        postDateElement.textContent = post.displayDate || post.date;
    }
    
    // Nastavíme kategorii příspěvku
    const postCategoryElement = document.getElementById('postCategory');
    if (postCategoryElement) {
        postCategoryElement.textContent = post.category;
    }
    
    // Nastavíme název příspěvku
    const postTitleElement = document.getElementById('postTitle');
    if (postTitleElement) {
        postTitleElement.textContent = post.title;
    }
    
    // Nastavíme jméno autora
    const authorNameElement = document.getElementById('authorName');
    if (authorNameElement) {
        authorNameElement.textContent = post.author;
    }
    
    // Nastavíme obrázek příspěvku
    const postImageElement = document.getElementById('postImage');
    if (postImageElement && post.image) {
        postImageElement.src = post.image;
        postImageElement.alt = post.title;
    }
    
    // Nastavíme obsah příspěvku
    const postContentElement = document.getElementById('postContent');
    if (postContentElement && post.content) {
        // Rozdělíme obsah na odstavce podle odřádkování
        const paragraphs = post.content.split('\n');
        let contentHTML = '';
        
        // Vytvoříme HTML pro každý odstavec
        paragraphs.forEach(paragraph => {
            if (paragraph.trim() !== '') {
                contentHTML += `<p>${paragraph}</p>`;
            }
        });
        
        postContentElement.innerHTML = contentHTML;
    }
    
    // Nastavíme slovo autora
    const authorWordElement = document.getElementById('authorWord');
    if (authorWordElement) {
        authorWordElement.textContent = "Zde autor sdílí své myšlenky a motivaci k napsání tohoto textu.";
    }
}

// Funkce pro naplnění informací o autorovi
function populateAuthorInfo(author) {
    // Nastavíme obrázek autora
    const authorImageElement = document.getElementById('authorImage');
    if (authorImageElement && author.image) {
        authorImageElement.src = author.image;
        authorImageElement.alt = author.name;
    }
    
    // Nastavíme odkaz na autora
    const authorLinkElement = document.getElementById('authorLink');
    if (authorLinkElement && author.id) {
        authorLinkElement.href = `author.html?id=${author.id}`;
    }
}

// Funkce pro načtení souvisejících příspěvků
function loadRelatedPosts(currentPost) {
    // Zkontrolujeme, zda existuje globální proměnná postsData
    if (typeof postsData === 'undefined') {
        console.error('Data příspěvků nejsou k dispozici');
        return;
    }
    
    // Seřadíme příspěvky podle data (nejnovější první)
    const sortedPosts = [...postsData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Najdeme příspěvky od stejného autora nebo ve stejné kategorii, kromě aktuálního příspěvku
    const relatedPosts = sortedPosts.filter(post => 
        post.id !== currentPost.id && 
        (post.author === currentPost.author || post.category === currentPost.category)
    );
    
    // Omezíme na 3 nejrelevantnější příspěvky
    const selectedPosts = relatedPosts.slice(0, 3);
    
    // Získáme kontejner pro související příspěvky
    const postsGrid = document.querySelector('.related-posts .posts-grid');
    if (!postsGrid) {
        console.error('Kontejner pro související příspěvky nebyl nalezen');
        return;
    }
    
    // Pokud nejsou žádné související příspěvky, skryjeme sekci
    if (selectedPosts.length === 0) {
        const relatedPostsSection = document.querySelector('.related-posts');
        if (relatedPostsSection) {
            relatedPostsSection.style.display = 'none';
        }
        return;
    }
    
    // Vygenerujeme HTML pro příspěvky
    let postsHTML = '';
    
    selectedPosts.forEach(post => {
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

// Inicializace stránky po načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    // Načteme data příspěvku
    loadPostData();
    
    // Inicializace mobilního menu
    initMobileMenu();
    
    // Inicializace formuláře komentářů
    initCommentForm();
    
    // Inicializace tlačítek pro sdílení
    initShareButtons();
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

// Funkce pro inicializaci formuláře komentářů
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(event) {
            // Zabráníme odeslání formuláře
            event.preventDefault();
            
            // Zde by byla logika pro zpracování komentáře (AJAX, uložení do DB atd.)
            // Pro ukázku pouze vypíšeme do konzole
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const comment = document.getElementById('comment').value;
            
            console.log('Nový komentář:', { name, email, comment });
            
            // Přidáme komentář do stránky
            addComment(name, comment);
            
            // Vyresetujeme formulář
            commentForm.reset();
            
            // Zobrazíme zprávu o úspěšném odeslání
            alert('Děkujeme za váš komentář!');
        });
    }
}

// Funkce pro přidání komentáře do stránky
function addComment(name, text) {
    const commentsList = document.querySelector('.comments-list');
    
    if (commentsList) {
        // Vytvoříme dnešní datum ve formátu "DD. MMMM YYYY"
        const today = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('cs-CZ', options);
        
        // Vytvoříme HTML pro nový komentář
        const commentHTML = `
            <div class="comment">
                <div class="comment-avatar">
                    <img src="avatar-default.png" alt="${name}">
                </div>
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="comment-author">${name}</span>
                        <span class="comment-date">${formattedDate}</span>
                    </div>
                    <p class="comment-text">${text}</p>
                </div>
            </div>
        `;
        
        // Vložíme nový komentář na začátek seznamu
        commentsList.insertAdjacentHTML('afterbegin', commentHTML);
    }
}

// Funkce pro inicializaci tlačítek pro sdílení
function initShareButtons() {
    // Získáme aktuální URL stránky
    const currentUrl = window.location.href;
    
    // Získáme titulek stránky
    const pageTitle = document.title;
    
    // Získáme tlačítka pro sdílení
    const facebookShare = document.querySelector('.share-link.facebook');
    const twitterShare = document.querySelector('.share-link.twitter');
    const emailShare = document.querySelector('.share-link.email');
    
    // Nastavíme odkazy pro sdílení
    if (facebookShare) {
        facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        facebookShare.target = '_blank';
    }
    
    if (twitterShare) {
        twitterShare.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(pageTitle)}`;
        twitterShare.target = '_blank';
    }
    
    if (emailShare) {
        emailShare.href = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent('Podívej se na tento zajímavý článek: ' + currentUrl)}`;
    }
}
