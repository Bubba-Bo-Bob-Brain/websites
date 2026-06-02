// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initFlickeringTorches();
    initMapInteractions();
    initFloatingEffects();
    initProphecyReveal();
    initCreatureAppearances();
    initScrollAnimations();
    initTypingEffect();
    initBackgroundEffects();
    initMysticalCursor();
    initScrollTopButton();
    initFogEffect();
});

// Flickering Torch Animation Enhancement
function initFlickeringTorches() {
    const torches = document.querySelectorAll('.fire');
    
    torches.forEach((torch, index) => {
        // Add random intensity variation
        const intensity = 0.5 + Math.random() * 0.5;
        torch.style.opacity = intensity;
        
        // Random flicker pattern
        setInterval(() => {
            const randomFlicker = 0.3 + Math.random() * 0.7;
            torch.style.opacity = randomFlicker;
            
            // Occasionally create a bright flash
            if (Math.random() > 0.95) {
                torch.style.opacity = 1;
                torch.style.filter = 'blur(0px)';
                setTimeout(() => {
                    torch.style.filter = 'blur(2px)';
                }, 100);
            }
        }, 200 + index * 150);
    });
}

// Interactive Map Effects
function initMapInteractions() {
    const mapContainer = document.querySelector('.map-container');
    const mapSVG = document.querySelector('.ancient-map');
    const locations = document.querySelectorAll('.map-text');
    
    // Mouse movement parallax effect
    mapContainer.addEventListener('mousemove', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Parallax effect on map elements
        const offsetX = (x - rect.width / 2) * 0.02;
        const offsetY = (y - rect.height / 2) * 0.02;
        
        mapSVG.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    
    // Reset transform when mouse leaves
    mapContainer.addEventListener('mouseleave', () => {
        mapSVG.style.transform = 'translate(0, 0)';
    });
    
    // Location hover effects
    locations.forEach(location => {
        location.addEventListener('mouseenter', function() {
            this.style.fill = '#ffd700';
            this.style.fontWeight = 'bold';
            
            // Create floating text
            createFloatingText(this.textContent, this);
        });
        
        location.addEventListener('mouseleave', function() {
            this.style.fill = '#c9a961';
            this.style.fontWeight = 'normal';
        });
    });
}

// Create floating text for map locations
function createFloatingText(text, element) {
    const rect = element.getBoundingClientRect();
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-location';
    floatingText.textContent = `✦ ${text} ✦`;
    floatingText.style.cssText = `
        position: fixed;
        background: rgba(201, 169, 97, 0.9);
        color: #1a0a00;
        padding: 5px 10px;
        border-radius: 5px;
        font-family: 'Cinzel', serif;
        font-size: 0.8rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 2s forwards;
    `;
    
    // Position near the element
    floatingText.style.left = rect.left + 'px';
    floatingText.style.top = (rect.top - 30) + 'px';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.remove();
        }
    }, 2000);
}

// Floating particles effect
function initFloatingEffects() {
    // Create floating embers
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingParticle();
        }, i * 300);
    }
    
    // Continue spawning particles
    setInterval(createFloatingParticle, 2000);
}

function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--gold-ancient);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
    `;
    
    // Random horizontal position
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = '-10px';
    
    // Random animation duration
    particle.style.animationDuration = (2 + Math.random() * 3) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    // Add keyframes dynamically for particle animation
    const keyframes = `
        @keyframes floatParticle${Date.now()} {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0.6;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) translateX(20px);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#dynamic-particles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-particles';
        document.head.appendChild(style);
    }
    
    // Inject keyframes
    const dynamicStyle = document.querySelector('#dynamic-particles');
    const particleId = Math.random().toString(36).substr(2, 9);
    dynamicStyle.textContent += `
        @keyframes floatParticle${particleId} {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0.6;
            }
            100% {
                transform: translateY(100vh) translateX(20px);
                opacity: 0;
            }
        }
    `;
    particle.style.animation = `floatParticle${particleId} ${3 + Math.random() * 2}s linear forwards`;
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 5000);
}

// Prophecy Text Reveal Effect
function initProphecyReveal() {
    const prophecyLines = document.querySelectorAll('.prophecy-line');
    
    // Simple intersection observer for reveal effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.5 });
    
    prophecyLines.forEach(line => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(line);
    });
}

// Creature Animation on Scroll
function initCreatureAppearances() {
    const creatureCards = document.querySelectorAll('.creature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    creatureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Scroll-based animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.content-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.style.opacity = '1';
                entry.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        observer.observe(section);
    });
}

// Typing effect for title
function initTypingEffect() {
    const title = document.querySelector('.title');
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// Add dynamic background effects
function initBackgroundEffects() {
    // Create subtle background animations on hover
    const bgElements = document.querySelectorAll('.content-section, .hero');
    
    bgElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = 'inset 0 0 50px rgba(201, 169, 97, 0.1)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// Mystical cursor effect
function initMysticalCursor() {
    document.addEventListener('mousemove', (e) => {
        const cursor = document.createElement('div');
        cursor.className = 'mystical-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: var(--gold-bright);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            box-shadow: 0 0 10px var(--candle-orange);
            transform: translate(-50%, -50%);
        `;
        
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        document.body.appendChild(cursor);
        
        // Remove after a short time
        setTimeout(() => {
            if (cursor.parentNode) {
                cursor.remove();
            }
        }, 100);
    });
}

// Scroll to top functionality with mystical effect
function initScrollTopButton() {
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '↑';
    scrollTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: radial-gradient(circle, var(--candle-orange), var(--gold-ancient));
        border: 2px solid var(--gold-bright);
        border-radius: 50%;
        color: var(--parchment-light);
        font-size: 20px;
        cursor: pointer;
        z-index: 9999;
        display: none;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(232, 208, 125, 0.5);
        font-family: 'Cinzel', serif;
    `;
    
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(scrollTopButton);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopButton.style.display = 'block';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });
}

// Add mystical fog effect
function initFogEffect() {
    const fog = document.createElement('div');
    fog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at center, transparent 50%, rgba(10, 8, 5, 0.3) 100%);
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    `;
    document.body.appendChild(fog);
}

// Prevent default context menu for mystical feel
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add dynamic CSS for animations
const dynamicStyles = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-60px) scale(0.8);
            opacity: 0;
        }
    }
    
    .creature-card:hover .creature-icon {
        animation: creatureBounce 2s ease-in-out infinite;
    }
    
    @keyframes creatureBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .artifact-item:hover .artifact-glow {
        animation: pulseGlow 2s ease-in-out infinite;
    }
    
    @keyframes pulseGlow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
    }
    
    .map-container:hover .ancient-map {
        filter: brightness(1.1);
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);