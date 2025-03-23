// Globální proměnné
let currentSlide = 0;
let slidesCount = 0;

// Funkce pro inicializaci
function init() {
    // Zjistíme počet slidů
    const slides = document.querySelectorAll('.carousel-slide');
    slidesCount = slides.length;
    
    if (slidesCount < 2) return; // Není potřeba karusel pro jeden slide
    
    // Nastavíme posluchače událostí na tlačítka
    document.querySelector('.carousel-arrow.prev').addEventListener('click', () => moveTo(currentSlide - 1));
    document.querySelector('.carousel-arrow.next').addEventListener('click', () => moveTo(currentSlide + 1));
    
    // Nastavíme posluchače událostí na indikátory
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => moveTo(index));
    });
    
    // Inicializace mobilního menu
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

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', init);

// Pro kompatibilitu se stávajícím HTML
function moveCarousel(direction) {
    moveTo(currentSlide + direction);
}

function goToSlide(index) {
    moveTo(index);
}
