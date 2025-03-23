// Základní proměnné pro karusel
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carousel-slide').length;

// Funkce pro přesun na konkrétní slide
function goToSlide(slideIndex) {
    const track = document.getElementById('carousel-track');
    currentSlide = slideIndex;
    
    // Aktualizace pozice karuselu
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Aktualizace indikátorů
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Funkce pro pohyb karuselu
function moveCarousel(direction) {
    // Výpočet nového indexu
    let newIndex = currentSlide + direction;
    
    // Kontrola hranic
    if (newIndex < 0) {
        newIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
        newIndex = 0;
    }
    
    goToSlide(newIndex);
}

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

// Automatické přepínání slidů karuselu
function startAutoSlide() {
    setInterval(() => {
        moveCarousel(1);
    }, 5000); // Přepíná každých 5 sekund
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    // Odkomentujte následující řádek, pokud chcete, aby se karusel automaticky posouval
    // startAutoSlide();
});
