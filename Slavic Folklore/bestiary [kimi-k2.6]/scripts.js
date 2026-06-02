// ============================================
// THE VELES CODEX — SCRIPTS
// Slavic Folklore Bestiary
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeBestiary();
    initializeEmbers();
    initializeHearthGlow();
});

// ============================================
// CARD FLIP & INTERACTION
// ============================================

function initializeBestiary() {
    const cards = document.querySelectorAll('.creature-card');
    
    cards.forEach(card => {
        let isFlipped = false;
        
        card.addEventListener('click', (e) => {
            if (window.getSelection().toString().length > 0) return;
            
            isFlipped = !isFlipped;
            card.classList.toggle('flipped', isFlipped);
            
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
        
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Flip card to reveal lore');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// ============================================
// REALM FILTERING
// ============================================

function initializeRealmFilter() {
    const filterButtons = document.querySelectorAll('.realm-btn');
    const cards = document.querySelectorAll('.creature-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const realm = button.dataset.realm;
            
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            cards.forEach((card, index) => {
                const cardRealm = card.dataset.realm;
                const shouldShow = realm === 'all' || cardRealm === realm;
                
                if (shouldShow) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

initializeRealmFilter();

// ============================================
// FLOATING EMBER PARTICLES
// ============================================

function initializeEmbers() {
    const container = document.getElementById('embers-container');
    if (!container) return;
    
    const emberCount = 25;
    const emberColors = [
        'rgba(196, 163, 90, 0.6)',
        'rgba(139, 69, 19, 0.5)',
        'rgba(184, 46, 46, 0.4)',
        'rgba(212, 197, 165, 0.5)'
    ];
    
    for (let i = 0; i < emberCount; i++) {
        createEmber(container, emberColors);
    }
}

function createEmber(container, colors) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    ember.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${startX}%;
        bottom: -10px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(ember);
}

// ============================================
// HEARTH GLOW ANIMATION
// ============================================

function initializeHearthGlow() {
    const overlay = document.getElementById('ambient-overlay');
    if (!overlay) return;
    
    setInterval(() => {
        const intensity = 0.3 + Math.random() * 0.3;
        const hue = Math.random() > 0.5 ? '19, 69, 19' : '0, 50, 30';
        
        overlay.style.background = `
            radial-gradient(ellipse at 30% 20%, rgba(139, 69, 19, ${intensity * 0.15}) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(${hue}, ${intensity * 0.2}) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(10, 5, 2, 0.3) 0%, transparent 30%, transparent 70%, rgba(10, 5, 2, 0.5) 100%)
        `;
    }, 2000);
}

// ============================================
// SCROLL-BASED PARALLAX FOR HEADER
// ============================================

let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    const scrollY = window.scrollY;
    const header = document.querySelector('.codex-header');
    
    if (header && scrollY < 400) {
        const parallaxY = scrollY * 0.3;
        const opacity = 1 - (scrollY / 300);
        header.style.transform = `translateY(${parallaxY}px)`;
        header.style.opacity = Math.max(opacity, 0.3);
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// CARD ENTRANCE ANIMATION
// ============================================

function animateCardEntrance() {
    const cards = document.querySelectorAll('.creature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.style.opacity = '0';
                card.style.transform = 'translateY(40px) rotateX(10deg)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) rotateX(0)';
                }, 100);
                
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => observer.observe(card));
}

setTimeout(animateCardEntrance, 100);

// ============================================
// DANGER SIGIL PULSE ON HOVER
// ============================================

function initializeSigilHover() {
    const sigils = document.querySelectorAll('.danger-sigils');
    
    sigils.forEach(container => {
        const activeSigils = container.querySelectorAll('.sigil.active');
        
        container.addEventListener('mouseenter', () => {
            activeSigils.forEach((sigil, index) => {
                setTimeout(() => {
                    sigil.style.transition = 'text-shadow 0.3s ease';
                    sigil.style.textShadow = '0 0 12px rgba(184, 46, 46, 0.8)';
                }, index * 100);
            });
        });
        
        container.addEventListener('mouseleave', () => {
            activeSigils.forEach(sigil => {
                sigil.style.textShadow = '';
            });
        });
    });
}

initializeSigilHover();

// ============================================
// MOUSE-FOLLOWING SUBTLE GLOW ON CARDS
// ============================================

function initializeCardGlow() {
    const cards = document.querySelectorAll('.creature-card');
    
    cards.forEach(card => {
        const front = card.querySelector('.card-front');
        if (!front) return;
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            front.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(196, 163, 90, 0.08) 0%, transparent 50%),
                linear-gradient(180deg, var(--color-parchment) 0%, var(--color-parchment-dark) 100%)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            front.style.background = '';
        });
    });
}

initializeCardGlow();

// ============================================
// SOUND-LESS ATMOSPHERE HINTS (Visual Only)
// ============================================

function createAtmosphericHints() {
    setInterval(() => {
        const cards = document.querySelectorAll('.creature-card:not(.flipped)');
        if (cards.length === 0) return;
        
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        const illustration = randomCard.querySelector('.creature-illustration');
        
        if (illustration) {
            illustration.style.filter = 'contrast(1.2) brightness(1.1)';
            setTimeout(() => {
                illustration.style.transition = 'filter 2s ease';
                illustration.style.filter = '';
            }, 300);
        }
    }, 8000);
}

createAtmosphericHints();

// ============================================
// PREFERS REDUCED MOTION
// ============================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const embersContainer = document.getElementById('embers-container');
    if (embersContainer) {
        embersContainer.style.display = 'none';
    }
    
    document.querySelectorAll('.creature-card').forEach(card => {
        card.style.transition = 'none';
    });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%cThe Veles Codex', 'font-family: Cinzel Decorative; font-size: 24px; color: #c4a35a;');
console.log('%c"Do not summon what you cannot dismiss."', 'font-style: italic; color: #8b6914;');