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

// Funkce pro pohyb karuselu plynule dokola
function moveCarousel(direction) {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    
    // Výpočet nového indexu
    let newIndex = currentSlide + direction;
    
    // Plynulé přecházení dokola
    if (newIndex < 0) {
        // Pokud jdeme doleva od první položky
        newIndex = totalSlides - 1;
        
        // Připravíme poslední slide jako předchozí (bez přechodu)
        track.style.transition = 'none';
        track.style.transform = `translateX(-${(totalSlides) * 100}%)`;
        
        // Vynutíme překreslení
        setTimeout(() => {
            // Vrátíme přechod a posuneme na poslední slide
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${newIndex * 100}%)`;
        }, 10);
        
    } else if (newIndex >= totalSlides) {
        // Pokud jdeme doprava za poslední položku
        newIndex = 0;
        
        // Nejprve dokončíme animaci za poslední slide
        track.style.transform = `translateX(-${totalSlides * 100}%)`;
        
        // Potom plynule přejdeme na první slide
        setTimeout(() => {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            
            // Vynutíme překreslení
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
                track.style.transform = 'translateX(0)';
            }, 10);
        }, 500); // Počkáme na dokončení předchozí animace
    } else {
        // Běžný posun
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${newIndex * 100}%)`;
    }
    
    // Aktualizace indikátorů
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === newIndex);
    });
    
    currentSlide = newIndex;
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
