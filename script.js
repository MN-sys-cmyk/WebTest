// Základní proměnné pro karusel
let currentSlide = 0;
let totalSlides = 0;

// Připravíme nekonečný karusel při načtení stránky
function setupInfiniteCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    
    if (slides.length < 2) return; // Není co dělat, pokud máme méně než 2 slidy
    
    // Vytvoříme klony prvního a posledního slidu
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[slides.length - 1].cloneNode(true);
    
    // Přidáme třídy pro identifikaci
    firstSlideClone.classList.add('clone');
    lastSlideClone.classList.add('clone');
    
    // Přidáme klony na začátek a konec
    track.appendChild(firstSlideClone);
    track.insertBefore(lastSlideClone, slides[0]);
    
    // Nastavíme pozici karuselu (přeskočíme klon poslední položky)
    track.style.transform = `translateX(-100%)`;
    
    // Aktualizujeme počet slidů (pro funkci moveCarousel)
    return slides.length;
}

// Funkce pro pohyb karuselu - plynulý přechod dokola
function moveCarousel(direction) {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const realSlidesCount = slides.length - 2; // Odečteme 2 klony
    
    // Přidáme přechod (pokud není vypnutý)
    track.style.transition = 'transform 0.5s ease';
    
    // Posuneme aktuální index
    currentSlide += direction;
    
    // Aktualizujeme pozici
    track.style.transform = `translateX(-${(currentSlide + 1) * 100}%)`;
    
    // Aktualizace indikátorů - zobrazujeme pouze skutečné slidy (ne klony)
    const realIndex = (currentSlide % realSlidesCount + realSlidesCount) % realSlidesCount;
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === realIndex);
    });
    
    // Posloucháme, až se dokončí animace
    track.addEventListener('transitionend', function resetIfNeeded() {
        track.removeEventListener('transitionend', resetIfNeeded);
        
        // Pokud jsme přešli za okraj, vrátíme se na opačnou stranu bez přechodu
        if (currentSlide < 0) {
            // Jsme za klonem posledního slidu
            track.style.transition = 'none';
            currentSlide = realSlidesCount - 1;
            track.style.transform = `translateX(-${(currentSlide + 1) * 100}%)`;
        } 
        else if (currentSlide >= realSlidesCount) {
            // Jsme za klonem prvního slidu
            track.style.transition = 'none';
            currentSlide = 0;
            track.style.transform = `translateX(-${(currentSlide + 1) * 100}%)`;
        }
    });
}

// Funkce pro přesun na konkrétní slide
function goToSlide(slideIndex) {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const realSlidesCount = slides.length - 2; // Odečteme 2 klony
    
    // Kontrola, že index je v rozsahu
    if (slideIndex < 0 || slideIndex >= realSlidesCount) return;
    
    // Nastavíme aktuální slide
    currentSlide = slideIndex;
    
    // Přidáme přechod
    track.style.transition = 'transform 0.5s ease';
    
    // Aktualizujeme pozici (musíme přičíst 1 kvůli počátečnímu klonu)
    track.style.transform = `translateX(-${(currentSlide + 1) * 100}%)`;
    
    // Aktualizace indikátorů
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Automatické přepínání slidů karuselu
function startAutoSlide() {
    setInterval(() => {
        moveCarousel(1);
    }, 5000); // Přepíná každých 5 sekund
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

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace mobilního menu
    initMobileMenu();
    
    // Nastaví nekonečný karusel a vrátí počet skutečných slidů
    const slidesCount = setupInfiniteCarousel();
    if (slidesCount) {
        totalSlides = slidesCount;
        
        // Inicializace indikátorů
        const indicatorContainer = document.getElementById('carousel-indicator');
        indicatorContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => {
                goToSlide(i);
            };
            indicatorContainer.appendChild(dot);
        }
    }
    
    // Volitelné: automatické přepínání slidů
    // Odkomentujte následující řádek, pokud chcete, aby se karusel automaticky posouval
    // startAutoSlide();
});
