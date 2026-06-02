/* ============================================
   THE ORDER OF THE OBSIDIAN FLAME
   Victorian Occult Society Directory
   Interactive Scripts
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeCircleNavigation();
    initializeSealedEnvelope();
    initializeCardAnimations();
    initializeGaslightEffects();
    initializeAudio();
});

/* === Grandfather Clock Functionality === */
function initializeClock() {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    const clockTick = document.getElementById('clockTick');
    
    if (!hourHand || !minuteHand || !secondHand) return;
    
    // Set initial time
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        
        // Calculate smooth rotations
        const secondDeg = (seconds + milliseconds / 1000) * 6;
        const minuteDeg = (minutes + seconds / 60) * 6;
        const hourDeg = (hours + minutes / 60) * 30;
        
        // Apply rotations
        secondHand.style.transform = `rotate(${secondDeg}deg)`;
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        hourHand.style.transform = `rotate(${hourDeg}deg)`;
        
        // Create tick sound effect (visual only, no actual audio)
        if (seconds % 2 === 0 && clockTick) {
            clockTick.classList.add('tick');
            setTimeout(() => clockTick.classList.remove('tick'), 100);
        }
    }
    
    // Update immediately and then every 50ms for smooth animation
    updateClock();
    setInterval(updateClock, 50);
    
    // Add clock chime on hover
    const clockFrame = document.querySelector('.clock-frame');
    if (clockFrame) {
        clockFrame.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 25px rgba(212, 160, 74, 0.4)';
            // Simulate a chime with a subtle scale animation
            this.style.transform = 'scale(1.02)';
        });
        
        clockFrame.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = '';
        });
    }
}

/* === Inner Circles Navigation === */
function initializeCircleNavigation() {
    const circleButtons = document.querySelectorAll('.circle-btn');
    const memberCards = document.querySelectorAll('.member-card');
    
    if (!circleButtons.length || !memberCards.length) return;
    
    circleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const circle = this.getAttribute('data-circle');
            
            // Update active button
            circleButtons.forEach(btn => btn.setAttribute('data-active', 'false'));
            this.setAttribute('data-active', 'true');
            
            // Filter member cards with animation
            memberCards.forEach(card => {
                const cardCircle = card.getAttribute('data-circle');
                
                if (circle === 'all' || cardCircle === circle) {
                    // Show card with animation
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Hide card with animation
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
            
            // Scroll to directory with smooth animation
            setTimeout(() => {
                const directory = document.getElementById('memberDirectory');
                if (directory) {
                    directory.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 400);
        });
    });
    
    // Initialize "All Members" view by default
    const allButton = document.querySelector('[data-circle="all"]');
    if (allButton) {
        allButton.click();
    }
}

/* === Sealed Envelope Mechanic === */
function initializeSealedEnvelope() {
    const sealedEnvelope = document.getElementById('sealedEnvelope');
    const waxSeal = document.getElementById('waxSeal');
    const envelopeOuter = document.querySelector('.envelope-outer');
    const invitationLetter = document.getElementById('invitationLetter');
    
    if (!sealedEnvelope || !waxSeal || !envelopeOuter || !invitationLetter) return;
    
    let isRevealed = false;
    
    // Break the seal animation
    waxSeal.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (isRevealed) return;
        
        // Break animation
        this.style.transform = 'translateX(-50%) scale(1.2) rotate(15deg)';
        this.style.opacity = '0.5';
        
        setTimeout(() => {
            this.style.display = 'none';
            
            // Open envelope flap
            envelopeOuter.classList.add('opened');
            
            // Reveal letter after envelope opens
            setTimeout(() => {
                invitationLetter.classList.add('revealed');
                isRevealed = true;
                
                // Add mystical effect
                createMysticalParticles(sealedEnvelope);
            }, 600);
        }, 300);
    });
    
    // Click envelope to open if already broken
    envelopeOuter.addEventListener('click', function() {
        if (isRevealed && !invitationLetter.classList.contains('revealed')) {
            invitationLetter.classList.add('revealed');
            createMysticalParticles(sealedEnvelope);
        }
    });
    
    // Hover effect on envelope
    sealedEnvelope.addEventListener('mouseenter', function() {
        if (!isRevealed) {
            this.style.transform = 'translateY(-5px)';
        }
    });
    
    sealedEnvelope.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
}

/* === Create Mystical Particles Effect === */
function createMysticalParticles(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'mystical-particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const endX = (Math.random() - 0.5) * 200;
        const endY = (Math.random() - 0.5) * 200;
        
        // Style particle
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(212, 160, 74, 0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            left: ${startX}%;
            top: ${startY}%;
            opacity: 0;
            z-index: 1000;
            animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
            transform: translate(0, 0);
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }
    
    // Add keyframes if not already added
    if (!document.getElementById('particleKeyframes')) {
        const style = document.createElement('style');
        style.id = 'particleKeyframes';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    opacity: 0;
                    transform: translate(0, 0) scale(0.5);
                }
                20% {
                    opacity: 1;
                }
                80% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: translate(${endX}px, ${endY}px) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* === Member Card Animations === */
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.member-card');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach((card, index) => {
        // Initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Observe for scroll animation
        observer.observe(card);
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            // Add glow effect to portrait
            const portrait = this.querySelector('.member-portrait');
            if (portrait) {
                portrait.style.boxShadow = '0 0 20px rgba(212, 160, 74, 0.3)';
            }
            
            // Subtle card tilt on hover
            this.addEventListener('mousemove', tiltCard);
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove glow effect
            const portrait = this.querySelector('.member-portrait');
            if (portrait) {
                portrait.style.boxShadow = '';
            }
            
            // Reset card transform
            this.style.transform = 'translateY(0)';
            this.removeEventListener('mousemove', tiltCard);
        });
    });
    
    // Card tilt effect on mouse move
    function tiltCard(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
    }
}

/* === Gaslight Ambient Effects === */
function initializeGaslightEffects() {
    const gaslights = document.querySelectorAll('.gaslight-ambient');
    
    // Randomize flicker patterns
    gaslights.forEach((gaslight, index) => {
        // Randomize animation duration and delay
        const duration = 3 + Math.random() * 3;
        const delay = Math.random() * 2;
        
        gaslight.style.animationDuration = `${duration}s`;
        gaslight.style.animationDelay = `${delay}s`;
        
        // Add random opacity variations
        setInterval(() => {
            const randomOpacity = 0.7 + Math.random() * 0.3;
            gaslight.style.opacity = randomOpacity;
        }, 2000 + Math.random() * 1000);
    });
    
    // Add random light rays
    createLightRays();
}

function createLightRays() {
    const rayCount = 5;
    
    for (let i = 0; i < rayCount; i++) {
        const ray = document.createElement('div');
        ray.className = 'light-ray';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const width = Math.random() * 100 + 50;
        const height = Math.random() * 2 + 1;
        const angle = Math.random() * 360;
        
        ray.style.cssText = `
            position: fixed;
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(212, 160, 74, 0.1), 
                transparent);
            top: ${startY}%;
            left: ${startX}%;
            transform: rotate(${angle}deg);
            pointer-events: none;
            z-index: 997;
            opacity: 0;
            animation: lightRay ${10 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        document.body.appendChild(ray);
    }
    
    // Add keyframes for light rays
    if (!document.getElementById('lightRayKeyframes')) {
        const style = document.createElement('style');
        style.id = 'lightRayKeyframes';
        style.textContent = `
            @keyframes lightRay {
                0% { opacity: 0; transform: translateX(-100%) rotate(var(--angle, 0deg)); }
                10% { opacity: 0.3; }
                90% { opacity: 0.3; }
                100% { opacity: 0; transform: translateX(100vw) rotate(var(--angle, 0deg)); }
            }
        `;
        document.head.appendChild(style);
    }
}

/* === Audio Simulation (Visual Ticks) === */
function initializeAudio() {
    // Create visual tick indicators
    const tickIndicators = [];
    
    // Add tick sound effect to clock
    const clock = document.querySelector('.grandfather-clock');
    if (clock) {
        const tick = document.createElement('div');
        tick.className = 'clock-tick-visual';
        tick.style.cssText = `
            position: absolute;
            top: 50%;
            right: -20px;
            width: 10px;
            height: 10px;
            background: rgba(212, 160, 74, 0.3);
            border-radius: 50%;
            opacity: 0;
            transform: translate(0, -50%);
            transition: opacity 0.1s ease;
        `;
        clock.appendChild(tick);
        
        // Simulate tick every second
        setInterval(() => {
            tick.style.opacity = '1';
            setTimeout(() => {
                tick.style.opacity = '0';
            }, 100);
        }, 1000);
    }
    
    // Add ambient "whisper" effect to seance cards
    const seanceCards = document.querySelectorAll('.seance-card');
    seanceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Create whisper particles
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const whisper = document.createElement('div');
                    whisper.style.cssText = `
                        position: absolute;
                        width: 2px;
                        height: 2px;
                        background: rgba(147, 112, 219, 0.5);
                        border-radius: 50%;
                        top: ${30 + Math.random() * 40}%;
                        left: ${Math.random() * 100}%;
                        opacity: 0;
                        animation: whisperFloat 3s ease-in-out forwards;
                        pointer-events: none;
                        z-index: 10;
                    `;
                    
                    this.appendChild(whisper);
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (whisper.parentNode) {
                            whisper.parentNode.removeChild(whisper);
                        }
                    }, 3000);
                }, i * 200);
            }
        });
    });
    
    // Add whisper animation keyframes
    if (!document.getElementById('whisperKeyframes')) {
        const style = document.createElement('style');
        style.id = 'whisperKeyframes';
        style.textContent = `
            @keyframes whisperFloat {
                0% {
                    opacity: 0;
                    transform: translateY(0) scale(0.5);
                }
                50% {
                    opacity: 0.8;
                }
                100% {
                    opacity: 0;
                    transform: translateY(-50px) scale(2);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* === Utility Functions === */
// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add smooth scroll to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect to header on scroll
window.addEventListener('scroll', throttle(function() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.society-header');
    
    if (header && scrolled < 500) {
        const rate = scrolled * 0.3;
        header.style.transform = `translateY(${rate}px)`;
        header.style.opacity = 1 - (scrolled / 1000);
    }
}, 16));

// Initialize page with a mystical fade-in
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add a subtle entrance animation to the header
    const header = document.querySelector('.society-header');
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            header.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 300);
    }
});

/* === Easter Egg: Konami Code for Special Effect === */
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    
    // Keep only last 10 keys
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    
    // Check if sequence matches
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateMysticalMode();
        konamiCode = [];
    }
});

function activateMysticalMode() {
    // Create special effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, 
            rgba(147, 112, 219, 0.1), 
            rgba(212, 160, 74, 0.1), 
            transparent);
        pointer-events: none;
        z-index: 9999;
        animation: mysticalPulse 3s ease-in-out;
    `;
    
    document.body.appendChild(overlay);
    
    // Add keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mysticalPulse {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after animation
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 3000);
    
    // Show message
    const message = document.createElement('div');
    message.textContent = 'The spirits acknowledge your presence...';
    message.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        font-family: 'Pirata One', cursive;
        font-size: 1.5rem;
        color: #9370db;
        text-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
        z-index: 10000;
        animation: fadeOut 3s ease-in-out forwards;
    `;
    
    document.body.appendChild(message);
    
    // Add fadeOut animation
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fadeOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(0); }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(fadeStyle);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}