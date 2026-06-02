// ========================================
// TEATRO REALE DELL'OPERA
// Stagione 1724 — Interactive Scripts
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initCurtainReveal();
    initChandelierSway();
    initParticles();
    initSpotlightTracking();
    initSeatTooltips();
    initScrollReveal();
    initParallaxEffects();
    initFlameRandomizer();
});

// ---- Curtain Reveal System ----
function initCurtainReveal() {
    const curtainContainer = document.getElementById('curtainContainer');
    const theatreInterior = document.getElementById('theatreInterior');
    
    if (!curtainContainer) return;
    
    // Trigger reveal after brief delay for DOM readiness
    setTimeout(() => {
        curtainContainer.classList.add('revealed');
        
        // Remove from DOM after animation completes to free resources
        setTimeout(() => {
            curtainContainer.style.display = 'none';
            if (theatreInterior) {
                theatreInterior.style.opacity = '1';
            }
        }, 3500);
    }, 800);
}

// ---- Chandelier Sway Physics ----
function initChandelierSway() {
    const chandelier = document.getElementById('chandelier');
    if (!chandelier) return;
    
    let time = 0;
    const swayAmplitude = 3;
    const swaySpeed = 0.0015;
    let mouseInfluenceX = 0;
    let targetMouseInfluence = 0;
    
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const normalizedX = (e.clientX - centerX) / centerX;
        targetMouseInfluence = normalizedX * 2;
    });
    
    function animateSway() {
        time += swaySpeed;
        mouseInfluenceX += (targetMouseInfluence - mouseInfluenceX) * 0.02;
        
        const baseSway = Math.sin(time) * swayAmplitude;
        const combinedRotation = baseSway + mouseInfluenceX;
        
        chandelier.style.transform = `translateX(-50%) rotate(${combinedRotation}deg)`;
        
        requestAnimationFrame(animateSway);
    }
    
    animateSway();
}

// ---- Atmospheric Particles (Dust Motes in Light) ----
function initParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
    const particleCount = 25;
    const particles = [];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Randomize particle properties
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 20;
        const opacity = Math.random() * 0.3 + 0.1;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = opacity;
        
        // Only spawn particles in upper portion where light is
        const startY = Math.random() * 60;
        particle.style.top = `${startY}%`;
        
        return particle;
    }
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        container.appendChild(particle);
        particles.push(particle);
    }
    
    // Recycle particles that float out of view
    setInterval(() => {
        particles.forEach(p => {
            const rect = p.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                p.style.left = `${Math.random() * 100}%`;
                p.style.animationDuration = `${Math.random() * 15 + 10}s`;
            }
        });
    }, 5000);
}

// ---- Spotlight Tracking for Performers ----
function initSpotlightTracking() {
    const spotlights = document.querySelectorAll('.performer-spotlight');
    
    spotlights.forEach(spotlight => {
        const beam = spotlight.querySelector('.spotlight-beam');
        if (!beam) return;
        
        spotlight.addEventListener('mousemove', (e) => {
            const rect = spotlight.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const mouseX = e.clientX;
            const offsetX = mouseX - centerX;
            
            // Move beam slightly toward mouse
            beam.style.transform = `translateX(calc(-50% + ${offsetX * 0.3}px))`;
        });
        
        spotlight.addEventListener('mouseleave', () => {
            beam.style.transform = 'translateX(-50%)';
        });
    });
}

// ---- Seat Tooltip System ----
function initSeatTooltips() {
    const tooltip = document.getElementById('seatTooltip');
    const seats = document.querySelectorAll('.seat, .box');
    if (!tooltip) return;
    
    const priceMap = {
        '1': 'Scudo 1 — Galleria',
        '3': 'Scudi 3 — Parterre',
        '5': 'Scudi 5 — Palco',
        '10': 'Scudi 10 — Palco Reale'
    };
    
    seats.forEach(seat => {
        seat.addEventListener('mouseenter', (e) => {
            let price, location;
            
            if (seat.classList.contains('box')) {
                if (seat.classList.contains('box-royal')) {
                    price = 'Scudi 10';
                    location = 'Palco Reale';
                } else {
                    price = 'Scudi 5';
                    location = `Palco ${seat.querySelector('.box-number')?.textContent || ''}`;
                }
            } else {
                const priceKey = seat.dataset.price;
                price = priceKey === '1' ? 'Scudo 1' : `Scudi ${priceKey}`;
                location = priceKey === '1' ? 'Galleria' : 'Parterre';
            }
            
            tooltip.querySelector('.tooltip-price').textContent = price;
            tooltip.querySelector('.tooltip-location').textContent = location;
            tooltip.classList.add('visible');
        });
        
        seat.addEventListener('mousemove', (e) => {
            const x = e.clientX + 15;
            const y = e.clientY - 40;
            
            // Keep tooltip within viewport
            const tooltipRect = tooltip.getBoundingClientRect();
            const finalX = x + tooltipRect.width > window.innerWidth ? e.clientX - tooltipRect.width - 15 : x;
            const finalY = y < 0 ? e.clientY + 15 : y;
            
            tooltip.style.left = `${finalX}px`;
            tooltip.style.top = `${finalY}px`;
        });
        
        seat.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// ---- Scroll Reveal Animations ----
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.production-card, .performer-spotlight, .seating-chart, .schedule-table-wrapper, .section-header');
    
    // Add scroll-reveal class
    revealElements.forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

// ---- Parallax Effects ----
function initParallaxEffects() {
    const prosceniumArch = document.querySelector('.proscenium-arch');
    const chandelier = document.getElementById('chandelier');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Proscenium arch parallax (moves slower)
                if (prosceniumArch && scrollY < windowHeight) {
                    const parallaxOffset = scrollY * 0.3;
                    prosceniumArch.style.transform = `translateX(-50%) translateY(${parallaxOffset}px)`;
                }
                
                // Chandelier rises slightly as we scroll down
                if (chandelier && scrollY < windowHeight * 2) {
                    const liftOffset = -scrollY * 0.15;
                    chandelier.style.marginTop = `${liftOffset}px`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ---- Flame Randomizer for Realistic Candlelight ----
function initFlameRandomizer() {
    const flames = document.querySelectorAll('.flame');
    
    flames.forEach((flame, index) => {
        // Stagger animation starts for organic feel
        flame.style.animationDelay = `${Math.random() * 0.5}s`;
        
        // Randomize animation duration slightly
        const duration = 0.12 + Math.random() * 0.08;
        flame.style.animationDuration = `${duration}s`;
    });
    
    // Occasional "gust" effect that affects all flames
    setInterval(() => {
        const gustStrength = Math.random();
        if (gustStrength > 0.85) {
            flames.forEach(flame => {
                const direction = Math.random() > 0.5 ? 1 : -1;
                const skew = (Math.random() * 10 + 5) * direction;
                flame.style.transform = `translateX(-50%) skewX(${skew}deg) scaleY(1.3)`;
                
                setTimeout(() => {
                    flame.style.transform = '';
                }, 300);
            });
        }
    }, 2000);
}

// ---- Production Card Interactions ----
document.querySelectorAll('.production-card').forEach(card => {
    card.addEventListener('click', function() {
        const production = this.dataset.production;
        
        // Subtle "selected" feedback
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// ---- Box Curtain Interaction ----
document.querySelectorAll('.box').forEach(box => {
    const curtain = box.querySelector('.box-curtain');
    if (!curtain) return;
    
    box.addEventListener('mouseenter', () => {
        curtain.style.transition = 'height 0.4s ease';
        curtain.style.height = '15%';
    });
    
    box.addEventListener('mouseleave', () => {
        curtain.style.height = '40%';
    });
});

// ---- Keyboard Accessibility ----
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open tooltips
        const tooltip = document.getElementById('seatTooltip');
        if (tooltip) tooltip.classList.remove('visible');
    }
});

// ---- Performance: Reduce motion preference ----
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable complex animations for accessibility
    document.querySelectorAll('.flame').forEach(f => {
        f.style.animation = 'none';
    });
    
    const chandelier = document.getElementById('chandelier');
    if (chandelier) {
        chandelier.style.animation = 'none';
        chandelier.style.opacity = '1';
    }
    
    const particles = document.getElementById('particlesContainer');
    if (particles) {
        particles.style.display = 'none';
    }
}