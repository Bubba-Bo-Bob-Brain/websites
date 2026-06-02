// scripts.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initLanternFollow();
    initSmokeParticles();
    initMagicLampReveal();
    initProductHoverEffects();
    initArchedNavigation();
    initScrollAnimations();
    initBottleGlowEffects();
});

// 1. Lantern Follow Effect - Makes lanterns follow cursor
function initLanternFollow() {
    const lanterns = document.querySelectorAll('.floating-lantern');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        lanterns.forEach((lantern, index) => {
            const intensity = (index + 1) * 0.1;
            const posX = x * 20 * intensity;
            const posY = y * 20 * intensity;
            
            lantern.style.transform = `translate(${posX}px, ${posY}px)`;
        });
    });
}

// 2. Smoke Particle Effects - Creates swirling incense smoke
function initSmokeParticles() {
    const container = document.getElementById('smoke-container');
    if (!container) return;
    
    const smokeColors = ['rgba(44, 44, 44, 0.4)', 'rgba(139, 0, 0, 0.3)', 'rgba(212, 175, 55, 0.2)'];
    
    function createSmokeParticle() {
        const particle = document.createElement('div');
        particle.classList.add('smoke-particle');
        
        // Random properties
        const size = Math.random() * 40 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 4;
        const delay = Math.random() * 2;
        const color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.background = color;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
    
    // Create particles at regular intervals
    setInterval(createSmokeParticle, 800);
    
    // Create initial particles
    for (let i = 0; i < 5; i++) {
        setTimeout(createSmokeParticle, i * 300);
    }
}

// 3. Magic Lamp Reveal Effect
function initMagicLampReveal() {
    const lamps = document.querySelectorAll('.lamp-card');
    
    lamps.forEach(lamp => {
        const rubZone = lamp.querySelector('.lamp-rub-zone');
        const lampBody = lamp.querySelector('.lamp-body');
        const lampGlow = lamp.querySelector('.lamp-glow');
        const instruction = lamp.querySelector('.rub-instruction');
        
        let isRubbed = false;
        
        rubZone.addEventListener('click', function() {
            if (!isRubbed) {
                isRubbed = true;
                
                // Add reveal animation
                lampBody.style.animation = 'none';
                lampGlow.style.animation = 'none';
                
                setTimeout(() => {
                    lampBody.style.animation = 'flameDance 0.3s ease-in-out infinite alternate';
                    lampGlow.style.animation = 'glowPulse 0.5s ease-in-out infinite';
                }, 10);
                
                // Change instruction text
                instruction.textContent = '✨ Genie Released!';
                instruction.style.color = 'var(--glow-red)';
                
                // Add magical particles
                createMagicalParticles(lamp);
                
                // Show hidden message after delay
                setTimeout(() => {
                    showRevealMessage(lamp);
                }, 2000);
            }
        });
    });
}

function createMagicalParticles(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        // Random colors
        const colors = ['var(--glow-red)', 'var(--glow-blue)', 'var(--glow-green)', '#FFD700', '#FF69B4'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random position within container
        const rect = container.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Animate particle
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => particle.remove();
        document.body.appendChild(particle);
    }
}

function showRevealMessage(lamp) {
    const message = document.createElement('div');
    message.textContent = '✨ Your Wish is Granted! ✨';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, var(--glow-red), var(--glow-blue), var(--glow-green));
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-family: var(--font-display);
        font-size: 1.2rem;
        z-index: 10000;
        box-shadow: 0 0 40px rgba(255, 0, 100, 0.5);
        animation: messageAppear 2s ease-out forwards;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// 4. Product Card Hover Effects
function initProductHoverEffects() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 5. Arched Navigation Enhancement
function initArchedNavigation() {
    const links = document.querySelectorAll('.arched-link');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(212, 175, 55, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            // Add CSS for ripple animation
            if (!document.getElementById('ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    @keyframes rippleEffect {
                        to { transform: scale(4); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            ripple.style.left = `${e.offsetX - 10}px`;
            ripple.style.top = `${e.offsetY - 10}px`;
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// 6. Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all product cards and sections
    document.querySelectorAll('.product-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// 7. Enhanced Bottle Glow Effects
function initBottleGlowEffects() {
    const bottles = document.querySelectorAll('.glow');
    
    bottles.forEach(bottle => {
        bottle.addEventListener('mouseenter', function() {
            this.style.animation = 'bottleGlow 0.3s ease-in-out infinite alternate';
        });
        
        bottle.addEventListener('mouseleave', function() {
            this.style.animation = 'bottleGlow 2s ease-in-out infinite';
        });
    });
}

// 8. Dynamic Background Enhancement
function initDynamicBackground() {
    const body = document.body;
    
    // Create subtle background animations
    setInterval(() => {
        const stars = ['✨', '🌟', '✦'];
        const star = document.createElement('div');
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        star.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            font-size: ${Math.random() * 20 + 10}px;
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            animation: starFall 3s ease-out forwards;
        `;
        
        // Add star fall animation
        if (!document.getElementById('star-fall-style')) {
            const style = document.createElement('style');
            style.id = 'star-fall-style';
            style.textContent = `
                @keyframes starFall {
                    0% { opacity: 0; transform: translateY(0) rotate(0deg); }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { opacity: 0; transform: translateY(100vh) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        body.appendChild(star);
        
        setTimeout(() => {
            if (star.parentNode) star.remove();
        }, 3000);
    }, 5000);
}

// Initialize dynamic background
initDynamicBackground();

// Add keyboard interaction for magic lamps
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') {
        const lamps = document.querySelectorAll('.lamp-card');
        lamps.forEach(lamp => {
            const rubZone = lamp.querySelector('.lamp-rub-zone');
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            rubZone.dispatchEvent(event);
        });
    }
});

// Parallax effect for background elements
window.addEventListener('scroll', function() {
    const scrollY = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-lantern, .zellige-pattern');
    
    parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.5;
        el.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
    });
});