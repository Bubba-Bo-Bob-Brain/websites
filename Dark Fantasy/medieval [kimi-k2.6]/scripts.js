// ===== THE CODEX OF ASHBORNE =====
// Medieval Dark Fantasy JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initEmberSystem();
    initScrollSpy();
    initCreatureReveal();
    initChronicleEntries();
    initNavSmoothScroll();
    initParallaxEffects();
    initTorchIntensity();
    initBloodDrip();
});

// ===== EMBER PARTICLE SYSTEM =====
function initEmberSystem() {
    const container = document.querySelector('.ember-container');
    if (!container) return;
    
    const emberCount = 25;
    const embers = [];
    
    for (let i = 0; i < emberCount; i++) {
        createEmber(container, embers);
    }
    
    animateEmbers(embers);
}

function createEmber(container, embersArray) {
    const ember = document.createElement('div');
    const size = Math.random() * 4 + 2;
    
    ember.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #ffdd00 0%, #e85d04 50%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        filter: blur(1px);
        box-shadow: 0 0 ${size * 2}px rgba(232, 93, 4, 0.6);
    `;
    
    container.appendChild(ember);
    
    const emberData = {
        element: ember,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 100,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * -0.8 - 0.3,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAmount: Math.random() * 30 + 10,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: 0,
        fadeIn: true,
        life: Math.random() * 0.5 + 0.5
    };
    
    embersArray.push(emberData);
}

function animateEmbers(embersArray) {
    function update() {
        embersArray.forEach(ember => {
            ember.y += ember.speedY;
            ember.x += ember.speedX + Math.sin(ember.y * ember.wobbleSpeed + ember.wobbleOffset) * 0.3;
            
            if (ember.fadeIn) {
                ember.opacity += 0.01;
                if (ember.opacity >= ember.life) {
                    ember.fadeIn = false;
                }
            } else {
                ember.opacity -= 0.005;
            }
            
            if (ember.opacity < 0 || ember.y < -50) {
                ember.x = Math.random() * window.innerWidth;
                ember.y = window.innerHeight + 20;
                ember.opacity = 0;
                ember.fadeIn = true;
                ember.speedX = (Math.random() - 0.5) * 0.5;
                ember.speedY = Math.random() * -0.8 - 0.3;
            }
            
            ember.element.style.transform = `translate(${ember.x}px, ${ember.y}px)`;
            ember.element.style.opacity = Math.max(0, ember.opacity);
        });
        
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}

// ===== SCROLL SPY FOR NAVIGATION =====
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;
        
        sections.forEach((section, index) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                const targetLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// ===== CREATURE CARD REVEAL ANIMATIONS =====
function initCreatureReveal() {
    const creatures = document.querySelectorAll('.creature-entry');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    animateStatBars(entry.target);
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    creatures.forEach(creature => {
        creature.style.opacity = '0';
        observer.observe(creature);
    });
}

function animateStatBars(creatureCard) {
    const fills = creatureCard.querySelectorAll('.stat-fill');
    fills.forEach((fill, index) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            fill.style.width = targetWidth;
        }, index * 200 + 300);
    });
}

// ===== CHRONICLE ENTRIES ANIMATION =====
function initChronicleEntries() {
    const entries = document.querySelectorAll('.entry');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    entries.forEach(entry => {
        entry.style.opacity = '0';
        observer.observe(entry);
    });
}

// ===== SMOOTH SCROLL FOR NAVIGATION =====
function initNavSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const prophecySection = document.querySelector('.prophecy-section');
    const lordsSection = document.querySelector('.lords-section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (prophecySection) {
            const bloodStains = prophecySection.querySelectorAll('.blood-stain');
            bloodStains.forEach((stain, index) => {
                const speed = 0.05 * (index + 1);
                stain.style.transform = `translateY(${scrollY * speed}px) rotate(${30 - index * 50}deg)`;
            });
        }
        
        if (lordsSection) {
            const portraits = lordsSection.querySelectorAll('.lord-portrait');
            portraits.forEach((portrait, index) => {
                const speed = 0.02 * (index % 2 === 0 ? 1 : -1);
                const offset = Math.sin(scrollY * 0.001 + index) * 5;
                portrait.style.transform = `translateY(${offset}px)`;
            });
        }
    });
}

// ===== TORCH INTENSITY VARIATION =====
function initTorchIntensity() {
    const torches = document.querySelectorAll('.torch');
    
    torches.forEach((torch, index) => {
        const flame = torch.querySelector('.torch-flame');
        const glow = torch.querySelector('.torch-glow');
        
        if (!flame || !glow) return;
        
        function varyIntensity() {
            const baseDelay = 100 + Math.random() * 200;
            const intensity = 0.7 + Math.random() * 0.3;
            const scale = 0.9 + Math.random() * 0.2;
            
            setTimeout(() => {
                flame.style.opacity = intensity;
                flame.style.transform = `translateX(-50%) scaleY(${scale}) scaleX(${2 - scale})`;
                glow.style.opacity = intensity * 0.8;
                
                varyIntensity();
            }, baseDelay);
        }
        
        setTimeout(() => varyIntensity(), index * 500);
    });
}

// ===== BLOOD DRIP EFFECT =====
function initBloodDrip() {
    const prophecySection = document.querySelector('.prophecy-section');
    if (!prophecySection) return;
    
    function createDrip() {
        const drip = document.createElement('div');
        const startX = Math.random() * 80 + 10;
        
        drip.style.cssText = `
            position: absolute;
            top: -5px;
            left: ${startX}%;
            width: 3px;
            height: 0;
            background: linear-gradient(180deg, rgba(139, 26, 26, 0.6) 0%, rgba(139, 26, 26, 0.2) 100%);
            border-radius: 0 0 50% 50%;
            pointer-events: none;
            z-index: 10;
        `;
        
        prophecySection.appendChild(drip);
        
        let height = 0;
        const maxHeight = 30 + Math.random() * 50;
        const speed = 0.5 + Math.random() * 0.5;
        
        function grow() {
            height += speed;
            drip.style.height = height + 'px';
            
            if (height < maxHeight) {
                requestAnimationFrame(grow);
            } else {
                setTimeout(() => {
                    drip.style.transition = 'opacity 1s ease';
                    drip.style.opacity = '0';
                    setTimeout(() => drip.remove(), 1000);
                }, 500);
            }
        }
        
        requestAnimationFrame(grow);
    }
    
    setInterval(createDrip, 8000 + Math.random() * 7000);
}

// ===== REALM CARD INTERACTIONS =====
document.querySelectorAll('.realm-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const crest = this.querySelector('.crest-symbol');
        if (crest) {
            crest.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
            crest.style.transform = 'scale(1.1) rotate(5deg)';
            crest.style.boxShadow = '0 0 20px rgba(184, 134, 11, 0.3)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const crest = this.querySelector('.crest-symbol');
        if (crest) {
            crest.style.transform = 'scale(1) rotate(0deg)';
            crest.style.boxShadow = 'none';
        }
    });
});

// ===== LORD PORTRAIT HOVER EFFECTS =====
document.querySelectorAll('.lord-portrait').forEach(portrait => {
    const frame = portrait.querySelector('.portrait-frame');
    const placeholder = portrait.querySelector('.portrait-placeholder');
    
    portrait.addEventListener('mouseenter', function() {
        if (placeholder) {
            placeholder.style.transition = 'all 0.5s ease';
            placeholder.style.borderColor = 'var(--color-blood)';
            placeholder.style.boxShadow = 'inset 0 0 30px rgba(139, 26, 26, 0.2)';
        }
    });
    
    portrait.addEventListener('mouseleave', function() {
        if (placeholder) {
            placeholder.style.borderColor = 'var(--color-gold-dim)';
            placeholder.style.boxShadow = 'none';
        }
    });
});

// ===== PROPHECY LETTER ANIMATION =====
const illuminatedLetter = document.querySelector('.illuminated-letter');
if (illuminatedLetter) {
    illuminatedLetter.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s ease, text-shadow 0.3s ease';
        this.style.transform = 'scale(1.1)';
        this.style.textShadow = '0 0 40px rgba(139, 26, 26, 0.6), 2px 2px 4px rgba(0,0,0,0.8)';
    });
    
    illuminatedLetter.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.textShadow = '0 0 20px rgba(139, 26, 26, 0.4), 2px 2px 4px rgba(0,0,0,0.8)';
    });
}

// ===== SECTION REVEAL ON SCROLL =====
function initSectionReveal() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 1s ease, transform 1s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        observer.observe(section);
    });
}

// Initialize section reveal after a short delay to ensure CSS is loaded
setTimeout(initSectionReveal, 100);

// ===== CURSOR TRAIL EFFECT =====
function initCursorTrail() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;
    
    const trailCount = 6;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: ${4 - i * 0.5}px;
            height: ${4 - i * 0.5}px;
            background: radial-gradient(circle, rgba(232, 93, 4, ${0.3 - i * 0.04}) 0%, transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s linear;
        `;
        document.body.appendChild(trail);
        trails.push({ element: trail, x: 0, y: 0 });
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    function updateTrails() {
        trails.forEach((trail, index) => {
            const delay = (index + 1) * 3;
            trail.x += (mouseX - trail.x) / delay;
            trail.y += (mouseY - trail.y) / delay;
            trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
        });
        requestAnimationFrame(updateTrails);
    }
    
    requestAnimationFrame(updateTrails);
}

// Initialize cursor trail
initCursorTrail();

// ===== RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const emberContainer = document.querySelector('.ember-container');
        if (emberContainer) {
            emberContainer.innerHTML = '';
            initEmberSystem();
        }
    }, 250);
});