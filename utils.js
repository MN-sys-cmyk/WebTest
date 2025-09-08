// Function to initialize the mobile menu
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

// Function to initialize the modal for "Slovo autora" across all pages
function initAuthorWordToggle() {
    const toggleButtons = document.querySelectorAll('.author-word-toggle');
    const modalOverlay = document.getElementById('authorWordModalOverlay');
    const modalContent = document.getElementById('modalContent');
    const modalCloseButton = document.getElementById('modalCloseButton');
    
    if (!modalOverlay || !modalContent || !modalCloseButton) {
        console.error("Modal elements not found. 'Slovo autora' button will not work correctly.");
        return;
    }

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            let textToShow = "Zde autor sdílí své myšlenky a motivaci k napsání tohoto textu.";
            
            // Check if it's on a post list page
            const postCard = this.closest('.post-card');
            if (postCard) {
                const excerpt = postCard.querySelector('.post-excerpt');
                if (excerpt) {
                    textToShow = excerpt.textContent;
                }
            }
            // Check if it's on a single post page
            else {
                const authorWordElement = document.getElementById('authorWord');
                if (authorWordElement) {
                    textToShow = authorWordElement.textContent;
                }
            }

            modalContent.textContent = textToShow;
            modalOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
    });

    modalCloseButton.addEventListener('click', function() {
        modalOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('visible');
            document.body.style.overflow = '';
        }
    });
}
