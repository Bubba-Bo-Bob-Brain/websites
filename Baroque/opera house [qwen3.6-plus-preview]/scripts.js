/* ============================================
   THÉÂTRE ROYAL DE L'OPÉRA — INTERACTIONS
   Bringing the Baroque Theatre to Life
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCurtainReveal();
    initParticles();
    initSpotlightEffect();
    initScrollReveal();
    initSmoothScroll();
    initFormHandling();
    initChandelierSway();
});

/* ============================================
   CURTAIN REVEAL
   ============================================ */
function initCurtainReveal() {
    const curtainOverlay = document.getElementById('curtainOverlay');
    const mainContent = document.getElementById('mainContent');
    
    // Wait a moment for the page to render, then part the curtains
    setTimeout(() => {
        curtainOverlay.classList.add('revealed');
        
        // Allow main content to become visible after curtain starts opening
        setTimeout(() => {
            mainContent.classList.add('visible');
            document.body.style.overflow = 'auto';
        }, 800);
        
        // Remove curtain from DOM after animation completes
        setTimeout(() => {
            curtainOverlay.style.display = 'none';
        }, 2500);
    }, 1500);
}

/* ============================================
   FLOATING PARTICLES (Dust in Candlelight)
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomize properties
    const startX = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 20;
    const opacity = Math.random() * 0.5 + 0.2;
    
    particle.style.cssText = `
        left: ${startX}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
        box-shadow: 0 0 ${size * 2}px rgba(201, 168, 76, ${opacity * 0.5});
    `;
    
    container.appendChild(particle);
}

/* ============================================
   SPOTLIGHT EFFECT ON PERFORMER CARDS
   ============================================ */
function initSpotlightEffect() {
    const cards = document.querySelectorAll('[data-spotlight]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    // Add reveal classes to elements that should animate on scroll
    const elementsToReveal = [
        ...document.querySelectorAll('.performance-card'),
        ...document.querySelectorAll('.performer-card'),
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.section-subtitle'),
        ...document.querySelectorAll('.theatre-description'),
        ...document.querySelectorAll('.theatre-diagram'),
        ...document.querySelectorAll('.reservation-text'),
        ...document.querySelectorAll('.reservation-form-container'),
        ...document.querySelectorAll('.hero-section'),
        ...document.querySelectorAll('.grand-footer')
    ];
    
    // Add base reveal classes
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal');
        // Stagger cards within their containers
        if (el.classList.contains('performance-card') || el.classList.contains('performer-card')) {
            const parent = el.parentElement;
            const siblings = Array.from(parent.children).filter(child => 
                child.classList.contains('performance-card') || child.classList.contains('performer-card')
            );
            const siblingIndex = siblings.indexOf(el);
            el.classList.add(`reveal-delay-${(siblingIndex % 6) + 1}`);
        }
    });
    
    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   SMOOTH SCROLL NAVIGATION
   ============================================ */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .hero-section .ornate-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initFormHandling() {
    const form = document.getElementById('reservationForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('.form-button .button-text');
            const originalText = submitButton.textContent;
            
            // Simulate submission
            submitButton.textContent = 'Processing...';
            
            setTimeout(() => {
                submitButton.textContent = '✓ Reservation Confirmed';
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    submitButton.textContent = originalText;
                }, 3000);
            }, 1500);
        });
    }
}

/* ============================================
   CHANDELIER SWAY
   ============================================ */
function initChandelierSway() {
    const chandelier = document.getElementById('chandelier');
    
    if (chandelier) {
        // Gentle continuous sway
        let time = 0;
        const sway = () => {
            time += 0.008;
            const rotation = Math.sin(time) * 1.5;
            const translateX = Math.sin(time * 0.7) * 3;
            
            chandelier.style.transform = `translateX(calc(-50% + ${translateX}px)) rotate(${rotation}deg)`;
            
            requestAnimationFrame(sway);
        };
        
        sway();
    }
}

/* ============================================
   ADDITIONAL AMBIENT EFFECTS
   ============================================ */

// Subtle parallax on hero section during scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    
    if (hero) {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
        }
    }
}, { passive: true });

// Ambient sound suggestion (optional enhancement placeholder)
// Could integrate with Web Audio API for theatrical ambiance
// For now, this is a placeholder for potential future enhancement

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    // Skip to main content on 'Tab' for accessibility
    if (e.key === 'Tab') {
        const mainContent = document.getElementById('mainContent');
        if (document.activeElement === document.body) {
            const firstFocusable = mainContent.querySelector('a, button, input, select');
            if (firstFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
});