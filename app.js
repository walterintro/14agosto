/**
 * TU KASA BOUTIQUE LIBERTAD - FUNCIONALIDAD JAVASCRIPT
 * Optimizado para rendimiento y mantenibilidad
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initNavbar();
    initRoomCarousel();
    initScrollAnimations();
    initWhatsAppModal();
});

/**
 * Control del Navbar - Cambia de estilo al hacer scroll
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('bg-transparent', 'text-white', 'py-6');
            navbar.classList.add('py-4');
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.add('bg-transparent', 'text-white', 'py-6');
            navbar.classList.remove('py-4');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Carrusel de Habitaciones - Scroll horizontal con drag
 */
function initRoomCarousel() {
    const scrollContainer = document.getElementById('roomContainer');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    if (!scrollContainer) return;

    // Variables para drag
    let isDown = false;
    let startX;
    let scrollLeftPos;

    // Event listeners para botones
    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -400, behavior: 'smooth' });
        });
    }

    if (scrollRightBtn) {
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }

    // Event listeners para drag
    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.classList.add('cursor-grabbing');
        scrollContainer.classList.remove('cursor-grab');
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeftPos = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.classList.remove('cursor-grabbing');
        scrollContainer.classList.add('cursor-grab');
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.classList.remove('cursor-grabbing');
        scrollContainer.classList.add('cursor-grab');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeftPos - walk;
    });

    // Soporte para touch en móviles
    let touchStartX = 0;
    let touchScrollLeft = 0;

    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX - scrollContainer.offsetLeft;
        touchScrollLeft = scrollContainer.scrollLeft;
    }, { passive: true });

    scrollContainer.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - scrollContainer.offsetLeft;
        const walk = (x - touchStartX) * 2;
        scrollContainer.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });
}

/**
 * Animaciones al hacer scroll - Intersection Observer
 */
function initScrollAnimations() {
    // Observador para animaciones de fade-in
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar una vez animado
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos con clase scroll-animate
    document.querySelectorAll('.scroll-animate').forEach(el => {
        animationObserver.observe(el);
    });

    // Animación inicial para el hero
    const heroElement = document.querySelector('.fade-in');
    if (heroElement) {
        setTimeout(() => {
            heroElement.style.opacity = '1';
        }, 100);
    }
}

/**
 * Modal de WhatsApp
 */
function initWhatsAppModal() {
    // Las funciones se exponen globalmente para los handlers onclick
    window.openWaModal = function(topic) {
        const modal = document.getElementById('wa-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        if (topic) {
            const select = document.getElementById('wa-topic');
            if (select) {
                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === topic) {
                        select.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    };

    window.closeWaModal = function() {
        const modal = document.getElementById('wa-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    };

    window.sendToWhatsapp = function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('wa-name');
        const phoneInput = document.getElementById('wa-phone');
        const topicSelect = document.getElementById('wa-topic');
        
        if (!nameInput || !phoneInput || !topicSelect) return;
        
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const topic = topicSelect.value;

        // Validación básica
        if (!name || !phone) {
            alert('Por favor completa tu nombre y número de teléfono');
            return;
        }

        const hotelNumber = "51999888777";
        const message = `Hola TuKasa, mi nombre es ${name}. Mi número es ${phone}. Motivo: ${topic}.`;
        const url = `https://wa.me/${hotelNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank', 'noopener,noreferrer');
        closeWaModal();
    };

    // Cerrar modal al hacer clic fuera
    const modalOverlay = document.getElementById('wa-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeWaModal();
            }
        });
    }

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeWaModal();
        }
    });
}

/**
 * Lazy Loading optimizado para imágenes
 * (Se puede mejorar aún más con loading="lazy" nativo)
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta loading="lazy" nativo
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback para navegadores antiguos
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        script.async = true;
        document.body.appendChild(script);
    }
}

// Inicializar lazy loading si es necesario
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}
