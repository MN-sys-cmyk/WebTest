// Kompletně přepracovaný a zjednodušený script.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace mobilního menu
    initMobileMenu();
    
    // Inicializace karuselu
    initCarousel();
});

// Inicializace mobilního menu
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (toggleBtn && closeBtn && mobileMenu) {
        toggleBtn.addEventListener('click', () => {
            mobileMenu.style.display = 'block';
            setTimeout(() => {
                mobileMenu.classList.add('active');
            }, 10);
        });
        
        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            setTimeout(() => {
                mobileMenu.style.display = 'none';
            }, 500);
        });
    }
}

// Proměnné pro karusel
let currentSlideIndex = 0;
let slideCount = 0;
let isTransitioning = false;

// Inicializace karuselu
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    slideCount = slides.length;
    
    if (slideCount < 2) return; // Není co dělat, pokud máme méně než 2 slidy
    
    // Nastavení aktivního indikátoru
    updateIndicators(0);
}

// Funkce pro pohyb karuselu
function moveCarousel(direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Vypočítáme nový index s ošetřením přechodu přes okraje
    let newIndex = currentSlideIndex + direction;
    
    // Zajistíme "nekonečnost" karuselu
    if (newIndex < 0) {
        newIndex = slideCount - 1;
    } else if (newIndex >= slideCount) {
        newIndex = 0;
    }
    
    // Provedeme animaci
    const track = document.getElementById('carousel-track');
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${newIndex * 100}%)`;
    
    // Aktualizujeme indikátory
    updateIndicators(newIndex);
    
    // Uložíme nový index
    currentSlideIndex = newIndex;
    
    // Po dokončení animace resetujeme příznak
    setTimeout(() => {
        isTransitioning = false;
    }, 500); // Délka animace
}

// Funkce pro přesun na konkrétní slide
function goToSlide(slideIndex) {
    if (isTransitioning || slideIndex === currentSlideIndex) return;
    isTransitioning = true;
    
    // Provedeme animaci
    const track = document.getElementById('carousel-track');
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Aktualizujeme indikátory
    updateIndicators(slideIndex);
    
    // Uložíme nový index
    currentSlideIndex = slideIndex;
    
    // Po dokončení animace resetujeme příznak
    setTimeout(() => {
        isTransitioning = false;
    }, 500); // Délka animace
}

// Aktualizace indikátorů
function updateIndicators(activeIndex) {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}
