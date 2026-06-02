// === Grimoire of Shadows - Interactive Scripts ===

document.addEventListener('DOMContentLoaded', () => {
    initializeTorchFlicker();
    initializeCreatureCards();
    initializeScrollEffects();
    initializeParallaxBackground();
    initializeTextReveal();
    initializeAmbientSounds();
    initializeBloodMoonCounter();
});

// === Torch Flickering Enhancement ===
function initializeTorchFlicker() {
    const flames = document.querySelectorAll('.flame');
    const glows = document.querySelectorAll('.flame-glow');
    
    flames.forEach((flame, index) => {
        setInterval(() => {
            const randomScale = 0.9 + Math.random() * 0.3;
            const randomSkew = -5 + Math.random() * 10;
            flame.style.transform = `translateX(-50%) scale(${randomScale}) skewX(${randomSkew}deg)`;
        }, 100 + Math.random() * 200);
    });
    
    glows.forEach((glow, index) => {
        setInterval(() => {
            const randomOpacity = 0.3 + Math.random() * 0.5;
            const randomScale = 0.8 + Math.random() * 0.4;
            glow.style.opacity = randomOpacity;
            glow.style.transform = `translateX(-50%) scale(${randomScale})`;
        }, 150 + Math.random() * 300);
    });
}

// === Creature Card Interactions ===
function initializeCreatureCards() {
    const revealButtons = document.querySelectorAll('.reveal-more');
    
    revealButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hiddenLore = this.nextElementSibling;
            const isRevealed = hiddenLore.classList.contains('revealed');
            
            if (isRevealed) {
                hiddenLore.classList.remove('revealed');
                this.textContent = 'Reveal Darker Truth';
                this.style.background = 'transparent';
                this.style.color = 'var(--color-blood)';
            } else {
                hiddenLore.classList.add('revealed');
                this.textContent = 'Hide Dark Truth';
                this.style.background = 'var(--color-blood)';
                this.style.color = 'var(--color-parchment)';
                
                createBloodDripEffect(this);
            }
        });
    });
    
    const creatureCards = document.querySelectorAll('.creature-card');
    creatureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--color-blood)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--color-gold)';
        });
    });
}

// === Blood Drip Effect ===
function createBloodDripEffect(element) {
    const rect = element.getBoundingClientRect();
    const dripCount = 5;
    
    for (let i = 0; i < dripCount; i++) {
        setTimeout(() => {
            const drip = document.createElement('div');
            drip.className = 'blood-drip';
            drip.style.left = `${rect.left + Math.random() * rect.width}px`;
            drip.style.top = `${rect.bottom}px`;
            document.body.appendChild(drip);
            
            setTimeout(() => drip.remove(), 2000);
        }, i * 200);
    }
}

// === Scroll-Based Effects ===
function initializeScrollEffects() {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.scroll-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
                
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;
        
        const vignette = document.getElementById('vignette');
        if (vignette) {
            const intensity = 0.6 + scrollPercent * 0.3;
            vignette.style.background = `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${intensity}) 100%)`;
        }
    });
}

// === Parallax Background Effect ===
function initializeParallaxBackground() {
    const grainOverlay = document.getElementById('grain-overlay');
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    });
    
    function animateParallax() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        if (grainOverlay) {
            grainOverlay.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
        
        requestAnimationFrame(animateParallax);
    }
    
    animateParallax();
}

// === Text Reveal Animation ===
function initializeTextReveal() {
    const prophecyText = document.querySelector('.parchment-text');
    if (prophecyText) {
        const text = prophecyText.innerHTML;
        prophecyText.innerHTML = '';
        
        const words = text.split(/(\s+)/);
        words.forEach((word, index) => {
            if (word.trim()) {
                const span = document.createElement('span');
                span.textContent = word;
                span.style.opacity = '0';
                span.style.display = 'inline-block';
                span.style.transform = 'translateY(10px)';
                span.style.transition = `opacity 0.3s ease ${index * 0.02}s, transform 0.3s ease ${index * 0.02}s`;
                prophecyText.appendChild(span);
            } else {
                prophecyText.appendChild(document.createTextNode(word));
            }
        });
        
        setTimeout(() => {
            const spans = prophecyText.querySelectorAll('span');
            spans.forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 500);
    }
}

// === Ambient Sound Simulation (Visual) ===
function initializeAmbientSounds() {
    const ambientIndicator = document.createElement('div');
    ambientIndicator.className = 'ambient-indicator';
    ambientIndicator.innerHTML = '🔇 Click to enable ambient atmosphere';
    ambientIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(44, 24, 16, 0.9);
        color: var(--color-gold);
        padding: 10px 15px;
        border: 1px solid var(--color-gold);
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        font-family: var(--font-heading);
        font-size: 0.9rem;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(ambientIndicator);
    
    let isAmbientActive = false;
    
    ambientIndicator.addEventListener('click', function() {
        isAmbientActive = !isAmbientActive;
        
        if (isAmbientActive) {
            this.innerHTML = '🔊 Ambient atmosphere active';
            this.style.background = 'rgba(139, 0, 0, 0.9)';
            startAmbientEffects();
        } else {
            this.innerHTML = '🔇 Click to enable ambient atmosphere';
            this.style.background = 'rgba(44, 24, 16, 0.9)';
            stopAmbientEffects();
        }
    });
}

let ambientInterval;

function startAmbientEffects() {
    ambientInterval = setInterval(() => {
        if (Math.random() > 0.7) {
            createFlickerEffect();
        }
        
        if (Math.random() > 0.9) {
            createShadowMovement();
        }
    }, 2000);
}

function stopAmbientEffects() {
    clearInterval(ambientInterval);
}

function createFlickerEffect() {
    const vignette = document.getElementById('vignette');
    if (vignette) {
        vignette.style.transition = 'none';
        vignette.style.opacity = '0.7';
        
        setTimeout(() => {
            vignette.style.transition = 'opacity 0.1s ease';
            vignette.style.opacity = '1';
        }, 50);
    }
}

function createShadowMovement() {
    const shadow = document.createElement('div');
    shadow.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 998;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        animation: shadow-drift 3s ease-out forwards;
    `;
    
    document.body.appendChild(shadow);
    
    setTimeout(() => shadow.remove(), 3000);
}

// === Blood Moon Counter ===
function initializeBloodMoonCounter() {
    const header = document.querySelector('.manuscript-header');
    if (header) {
        const counter = document.createElement('div');
        counter.className = 'blood-moon-counter';
        counter.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: rgba(139, 0, 0, 0.2);
            border: 1px solid var(--color-blood);
            border-radius: 5px;
            text-align: center;
        `;
        
        header.querySelector('.header-content').appendChild(counter);
        
        updateBloodMoonCounter(counter);
        setInterval(() => updateBloodMoonCounter(counter), 60000);
    }
}

function updateBloodMoonCounter(counter) {
    const now = new Date();
    const nextFullMoon = getNextFullMoon(now);
    const daysUntil = Math.ceil((nextFullMoon - now) / (1000 * 60 * 60 * 24));
    
    counter.innerHTML = `
        <div style="font-family: var(--font-heading); color: var(--color-blood); font-size: 1.1rem;">
            ☽ Days Until the Blood Moon: <strong>${daysUntil}</strong> ☾
        </div>
        <div style="font-size: 0.85rem; color: var(--color-ink-faded); margin-top: 5px;">
            ${nextFullMoon.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}
        </div>
    `;
}

function getNextFullMoon(date) {
    const knownFullMoon = new Date(2024, 0, 25);
    const lunarCycle = 29.53059;
    const daysSinceKnown = (date - knownFullMoon) / (1000 * 60 * 60 * 24);
    const cyclesPassed = Math.floor(daysSinceKnown / lunarCycle);
    const nextCycle = cyclesPassed + 1;
    const nextFullMoon = new Date(knownFullMoon.getTime() + nextCycle * lunarCycle * 24 * 60 * 60 * 1000);
    
    if (nextFullMoon < date) {
        return new Date(knownFullMoon.getTime() + (nextCycle + 1) * lunarCycle * 24 * 60 * 60 * 1000);
    }
    
    return nextFullMoon;
}

// === Dynamic Style Injection ===
const style = document.createElement('style');
style.textContent = `
    @keyframes shadow-drift {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    .scroll-link.active {
        color: var(--color-blood) !important;
        border-color: var(--color-gold) !important;
        background: rgba(201,162,39,0.2) !important;
    }
    
    .blood-drip {
        position: fixed;
        width: 4px;
        height: 20px;
        background: linear-gradient(to bottom, var(--color-blood), #4a0000);
        border-radius: 0 0 50% 50%;
        pointer-events: none;
        z-index: 1001;
        animation: drip-fall 2s ease-in forwards;
    }
    
    @keyframes drip-fall {
        0% { transform: translateY(0) scaleY(1); opacity: 1; }
        100% { transform: translateY(100px) scaleY(2); opacity: 0; }
    }
    
    .creature-card {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .creature-card:hover {
        box-shadow: 0 15px 40px rgba(139, 0, 0, 0.3);
    }
    
    .section-title {
        position: relative;
    }
    
    .section-title::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 2px;
        background: linear-gradient(to right, transparent, var(--color-blood), transparent);
    }
    
    .timeline-entry {
        transition: all 0.3s ease;
    }
    
    .timeline-entry:hover {
        transform: translateX(10px);
        border-color: var(--color-blood);
    }
    
    .ritual-card {
        transition: all 0.3s ease;
    }
    
    .ritual-card:hover {
        background: linear-gradient(135deg, rgba(0,0,0,0.2), rgba(139,0,0,0.1));
    }
    
    .warning-seal {
        position: relative;
        overflow: hidden;
    }
    
    .warning-seal::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(139,0,0,0.3), transparent);
        animation: warning-scan 3s linear infinite;
    }
    
    @keyframes warning-scan {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    .demon-seal {
        filter: drop-shadow(0 0 15px rgba(139,0,0,0.5));
        transition: filter 0.3s ease;
    }
    
    .demon-seal:hover {
        filter: drop-shadow(0 0 25px rgba(139,0,0,0.8));
    }
    
    .parchment-scroll {
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(5px);
    }
    
    .creature-image {
        position: relative;
        overflow: hidden;
    }
    
    .creature-image::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
        transform: translateX(-100%);
        transition: transform 0.6s ease;
    }
    
    .creature-card:hover .creature-image::before {
        transform: translateX(100%);
    }
    
    .lore-timeline::before {
        animation: timeline-pulse 2s ease-in-out infinite;
    }
    
    @keyframes timeline-pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
    
    .footer-ornament {
        animation: footer-glow 3s ease-in-out infinite;
    }
    
    @keyframes footer-glow {
        0%, 100% { text-shadow: 0 0 10px var(--color-gold); }
        50% { text-shadow: 0 0 20px var(--color-gold), 0 0 30px var(--color-blood); }
    }
`;

document.head.appendChild(style);

// === Console Easter Egg ===
console.log('%c☽ The Grimoire of Shadows ☾', 'color: #8b0000; font-size: 24px; font-family: serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c"You have opened the forbidden tome. There is no turning back."', 'color: #c9a227; font-style: italic; font-size: 14px;');
console.log('%cKnowledge is a burden. Wisdom is knowing when to put it down.', 'color: #5a4a3a; font-size: 12px;');

// === Keyboard Shortcuts ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'g' || e.key === 'G') {
        const header = document.querySelector('.demon-seal');
        if (header) {
            header.style.animation = 'none';
            header.offsetHeight;
            header.style.animation = 'seal-float 0.5s ease-in-out 3';
        }
    }
    
    if (e.key === 'Escape') {
        const revealedLore = document.querySelectorAll('.hidden-lore.revealed');
        revealedLore.forEach(lore => {
            lore.classList.remove('revealed');
            const button = lore.previousElementSibling;
            if (button && button.classList.contains('reveal-more')) {
                button.textContent = 'Reveal Darker Truth';
                button.style.background = 'transparent';
                button.style.color = 'var(--color-blood)';
            }
        });
    }
});

// === Random Ambient Events ===
setInterval(() => {
    if (Math.random() > 0.95) {
        const elements = document.querySelectorAll('.section-ornament, .footer-ornament');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        if (randomElement) {
            randomElement.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => {
                randomElement.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
    }
}, 5000);

// === Page Load Animation ===
window.addEventListener('load', () => {
    const container = document.querySelector('.manuscript-container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            container.style.transition = 'opacity 1s ease, transform 1s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
    
    const torches = document.querySelectorAll('.torch');
    torches.forEach((torch, index) => {
        torch.style.opacity = '0';
        setTimeout(() => {
            torch.style.transition = 'opacity 0.5s ease';
            torch.style.opacity = '1';
        }, 500 + index * 200);
    });
});

// === Mouse Trail Effect (Subtle) ===
let mouseTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (mouseTrail.length > maxTrailLength) {
        mouseTrail.shift();
    }
    
    if (Math.random() > 0.9) {
        createTrailParticle(e.clientX, e.clientY);
    }
});

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: rgba(201, 162, 39, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        left: ${x}px;
        top: ${y}px;
        animation: particle-fade 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particle-fade {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(0); opacity: 0; }
    }
`;
document.head.appendChild(particleStyle);