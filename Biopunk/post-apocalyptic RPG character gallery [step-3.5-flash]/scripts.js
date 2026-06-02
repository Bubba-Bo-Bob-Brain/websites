/* ============================================
   BIOPUNK ARCHIVES - INTERACTIVE SCRIPTS
   Retro pixel-art biopunk immersive experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCardSystem();
    initFilterSystem();
    initGlitchEffects();
    initCRTEffects();
    initDNAAnimations();
    initStatAnimations();
    initDecodingText();
});

/* ============================================
   CARD SYSTEM & ANIMATIONS
   ============================================ */
function initCardSystem() {
    const cards = document.querySelectorAll('.character-card');
    
    // Set card indices for staggered animation
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        
        // Add intersection observer for scroll-triggered reveals
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    card.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
        
        // Hover effects for card frame
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '100';
            intensifyDNAStrand(card);
            playActivationSound();
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '';
            resetDNAStrand(card);
        });
        
        // Click to expand card (optional detail view)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('.filter-btn')) {
                toggleCardExpansion(card);
            }
        });
    });
}

function toggleCardExpansion(card) {
    const content = card.querySelector('.card-content');
    const isExpanded = card.classList.toggle('expanded');
    
    if (isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        card.querySelector('.card-frame').style.borderColor = 'var(--neon-magenta)';
    } else {
        content.style.maxHeight = '';
        card.querySelector('.card-frame').style.borderColor = '';
    }
}

/* ============================================
   FILTER SYSTEM
   ============================================ */
function initFilterSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.character-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter cards with animation
            cards.forEach((card, index) => {
                const faction = card.dataset.faction;
                const shouldShow = filter === 'all' || faction === filter;
                
                if (shouldShow) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = `cardReveal 0.6s ease-out forwards ${index * 0.1}s`;
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Play filter sound
            playFilterSound();
        });
    });
}

/* ============================================
   GLITCH EFFECTS
   ============================================ */
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.banner-glitch, .character-name');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            triggerIntenseGlitch(element);
        });
        
        element.addEventListener('mouseleave', () => {
            resetGlitch(element);
        });
        
        // Random micro-glitch
        setInterval(() => {
            if (Math.random() > 0.95) {
                triggerMicroGlitch(element);
            }
        }, 3000);
    });
}

function triggerIntenseGlitch(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    
    // Create glitch overlay
    const glitchOverlay = document.createElement('div');
    glitchOverlay.className = 'glitch-overlay';
    glitchOverlay.innerHTML = element.textContent;
    glitchOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: var(--neon-red);
        z-index: 1000;
        pointer-events: none;
        animation: glitchOverlay 0.5s ease-out;
    `;
    
    element.style.position = 'relative';
    element.appendChild(glitchOverlay);
    
    setTimeout(() => glitchOverlay.remove(), 500);
}

function triggerMicroGlitch(element) {
    const originalTransform = element.style.transform;
    const originalColor = element.style.color;
    
    element.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
    element.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    
    setTimeout(() => {
        element.style.transform = originalTransform;
        element.style.color = originalColor;
    }, 50);
}

function resetGlitch(element) {
    element.style.animation = '';
}

// Add glitch overlay animation dynamically
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitchOverlay {
        0% { 
            opacity: 0;
            transform: translate(-5px, 2px) skewX(-5deg);
        }
        20% { 
            opacity: 1;
            transform: translate(5px, -2px) skewX(5deg);
        }
        40% { 
            transform: translate(-3px, 1px) skewX(-3deg);
        }
        60% { 
            transform: translate(3px, -1px) skewX(3deg);
        }
        80% { 
            transform: translate(-1px, 0) skewX(-1deg);
        }
        100% { 
            opacity: 0;
            transform: translate(0);
        }
    }
`;
document.head.appendChild(glitchStyle);

/* ============================================
   CRT EFFECTS & MOUSE TRACKING
   ============================================ */
function initCRTEffects() {
    const crtOverlay = document.querySelector('.crt-overlay');
    const scanlines = document.querySelector('.scanlines');
    
    if (!crtOverlay || !scanlines) return;
    
    // Subtle mouse tracking for CRT effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        crtOverlay.style.background = `
            radial-gradient(
                ellipse at ${x}% ${y}%,
                transparent 0%,
                rgba(0, 0, 0, 0.3) 60%,
                rgba(0, 0, 0, 0.6) 100%
            )
        `;
    });
    
    // Random scanline flicker
    setInterval(() => {
        if (Math.random() > 0.9) {
            scanlines.style.opacity = '0.95';
            setTimeout(() => {
                scanlines.style.opacity = '0.8';
            }, 50);
        }
    }, 100);
}

/* ============================================
   DNA STRAND ANIMATIONS
   ============================================ */
function initDNAAnimations() {
    const dnaStrands = document.querySelectorAll('.dna-strand');
    
    dnaStrands.forEach(strand => {
        // Store original animation
        const originalAnimation = strand.style.animation;
        
        // Speed up on card hover
        strand.closest('.character-card')?.addEventListener('mouseenter', () => {
            strand.style.animationDuration = '2s';
            strand.style.opacity = '0.8';
        });
        
        strand.closest('.character-card')?.addEventListener('mouseleave', () => {
            strand.style.animationDuration = originalAnimation || '10s';
            strand.style.opacity = '0.5';
        });
        
        // Random color shift
        setInterval(() => {
            if (Math.random() > 0.8) {
                const colors = ['var(--neon-green)', 'var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-amber)'];
                strand.style.background = `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 15px,
                    ${colors[Math.floor(Math.random() * colors.length)]} 15px,
                    ${colors[Math.floor(Math.random() * colors.length)]} 17px,
                    transparent 17px,
                    transparent 30px,
                    ${colors[Math.floor(Math.random() * colors.length)]} 30px,
                    ${colors[Math.floor(Math.random() * colors.length)]} 32px
                )`;
            }
        }, 2000);
    });
}

function intensifyDNAStrand(card) {
    const strand = card.querySelector('.dna-strand');
    if (strand) {
        strand.style.animationDuration = '2s';
        strand.style.opacity = '0.8';
    }
}

function resetDNAStrand(card) {
    const strand = card.querySelector('.dna-strand');
    if (strand) {
        strand.style.animationDuration = '10s';
        strand.style.opacity = '0.5';
    }
}

/* ============================================
   STAT ANIMATIONS
   ============================================ */
function initStatAnimations() {
    const statRows = document.querySelectorAll('.stat-row');
    
    statRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            animateStatFill(row);
        });
        
        row.addEventListener('mouseleave', () => {
            resetStatFill(row);
        });
    });
}

function animateStatFill(row) {
    const fill = row.querySelector('.pixel-fill, .bio-fill');
    if (fill) {
        const targetWidth = fill.style.getPropertyValue('--fill-percent') || fill.style.getPropertyValue('--bio-percent');
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 50);
    }
}

function resetStatFill(row) {
    const fill = row.querySelector('.pixel-fill, .bio-fill');
    if (fill) {
        fill.style.width = fill.style.getPropertyValue('--fill-percent') || fill.style.getPropertyValue('--bio-percent');
    }
}

/* ============================================
   DECODING TEXT EFFECT
   ============================================ */
function initDecodingText() {
    const placeholderTexts = document.querySelectorAll('.placeholder-text');
    
    placeholderTexts.forEach(text => {
        const originalText = text.textContent;
        text.dataset.original = originalText;
        
        // Start decoding animation on page load
        setTimeout(() => {
            decodeText(text, originalText);
        }, Math.random() * 2000);
        
        // Decode on hover
        text.closest('.image-placeholder')?.addEventListener('mouseenter', () => {
            decodeText(text, originalText);
        });
    });
    
    // Also decode character names on scroll into view
    const characterNames = document.querySelectorAll('.character-name');
    const nameObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nameElement = entry.target;
                const nameText = nameElement.textContent.replace(/^>/, '').trim();
                decodeCharacterName(nameElement, nameText);
                nameObserver.unobserve(nameElement);
            }
        });
    }, { threshold: 0.5 });
    
    characterNames.forEach(name => nameObserver.observe(name));
}

function decodeText(element, finalText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iterations = 0;
    const maxIterations = finalText.length * 3;
    
    const interval = setInterval(() => {
        element.textContent = finalText
            .split('')
            .map((char, index) => {
                if (index < iterations / 3) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iterations >= maxIterations) {
            clearInterval(interval);
            element.textContent = finalText;
        }
        
        iterations++;
    }, 30);
}

function decodeCharacterName(element, finalText) {
    if (element.classList.contains('decoded')) return;
    
    const prefix = element.querySelector('.name-prefix');
    const prefixText = prefix ? prefix.textContent : '';
    const nameOnly = finalText.replace(/^>/, '').trim();
    
    let iterations = 0;
    const maxIterations = nameOnly.length * 4;
    
    const interval = setInterval(() => {
        element.innerHTML = `<span class="name-prefix">${prefixText}</span>` + 
            nameOnly
                .split('')
                .map((char, index) => {
                    if (index < iterations / 4) {
                        return nameOnly[index];
                    }
                    return String.fromCharCode(0x30A0 + Math.random() * 96); // Katakana for glitch effect
                })
                .join('');
        
        if (iterations >= maxIterations) {
            clearInterval(interval);
            element.innerHTML = `<span class="name-prefix">${prefixText}</span>${nameOnly}`;
            element.classList.add('decoded');
        }
        
        iterations++;
    }, 20);
}

/* ============================================
   SOUND EFFECTS (OPTIONAL - COMMENT OUT IF UNWANTED)
   ============================================ */
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playActivationSound() {
    // Simple beep sound for card activation
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playFilterSound() {
    // Filter click sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}

/* ============================================
   PARTICLE EFFECTS FOR BIO-METERS
   ============================================ */
function createBioParticles() {
    const bioMeters = document.querySelectorAll('.bio-meter');
    
    bioMeters.forEach(meter => {
        setInterval(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--neon-red);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                pointer-events: none;
                animation: particleFade 1s ease-out forwards;
                box-shadow: 0 0 4px var(--neon-red);
            `;
            meter.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, 300);
    });
}

// Add particle animation style
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFade {
        0% { 
            opacity: 1;
            transform: scale(1) translate(0, 0);
        }
        100% { 
            opacity: 0;
            transform: scale(0.5) translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px);
        }
    }
`;
document.head.appendChild(particleStyle);

// Start particle effects after DOM load
setTimeout(createBioParticles, 1000);

/* ============================================
   RESPONSIVE MOBILE MENU (if needed)
   ============================================ */
function checkMobileMenu() {
    const filterContainer = document.querySelector('.faction-filter');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && !filterContainer.classList.contains('mobile-mode')) {
        filterContainer.classList.add('mobile-mode');
        // Could add hamburger menu logic here if needed
    } else if (!isMobile && filterContainer.classList.contains('mobile-mode')) {
        filterContainer.classList.remove('mobile-mode');
    }
}

window.addEventListener('resize', checkMobileMenu);
checkMobileMenu();

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */
// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Any scroll-based animations can go here
            ticking = false;
        });
        ticking = true;
    }
});

/* ============================================
   EASTER EGG: KONAMI CODE
   ============================================ */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Add rainbow glitch effect to entire page
    document.body.style.animation = 'rainbowGlitch 0.5s infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbowGlitch {
            0% { filter: hue-rotate(0deg) contrast(1.2); }
            25% { filter: hue-rotate(90deg) contrast(1.3); }
            50% { filter: hue-rotate(180deg) contrast(1.2); }
            75% { filter: hue-rotate(270deg) contrast(1.3); }
            100% { filter: hue-rotate(360deg) contrast(1.2); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    // Remove after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        rainbowStyle.remove();
    }, 5000);
    
    // Flash message
    const flash = document.createElement('div');
    flash.textContent = 'MUTATION SEQUENCE UNLOCKED // ALL Factions ACCESS GRANTED';
    flash.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: var(--neon-cyan);
        padding: 2rem;
        border: 2px solid var(--neon-cyan);
        font-family: var(--font-display);
        font-size: 1.5rem;
        z-index: 10000;
        animation: flashPulse 0.1s infinite;
        text-align: center;
        box-shadow: 0 0 50px var(--neon-cyan);
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 3000);
}

console.log('%c BIOPUNK ARCHIVES LOADED ', 'background: #000; color: #00ff41; font-size: 20px; font-weight: bold;');
console.log('%c System ready. Mutation database online. ', 'color: #00f3ff;');