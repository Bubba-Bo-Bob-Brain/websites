// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initNavigation();
    initMutationCards();
    initTechTree();
    initMapInteractions();
    initHeroScan();
    initBioIndicators();
    
    // Add subtle background interactions
    initBioEffects();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mutation card interactions
function initMutationCards() {
    const cards = document.querySelectorAll('.mutation-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 25px rgba(10, 245, 157, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Tech tree interactions
function initTechTree() {
    const nodes = document.querySelectorAll('.tech-node');
    
    nodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 20px rgba(10, 245, 157, 0.5)';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Map zone interactions
function initMapInteractions() {
    const zones = document.querySelectorAll('.zone');
    
    zones.forEach(zone => {
        zone.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.zIndex = '10';
        });
        
        zone.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });
}

// Hero section scanning effect
function initHeroScan() {
    const heroImage = document.querySelector('.hero-image');
    let scanActive = true;
    
    heroImage.addEventListener('click', function() {
        if (scanActive) {
            // Pause scanning
            document.querySelector('.scan-line').style.animation = 'none';
            scanActive = false;
        } else {
            // Resume scanning
            document.querySelector('.scan-line').style.animation = 'scan-move 3s infinite linear';
            scanActive = true;
        }
    });
}

// Dynamic bio indicators
function initBioIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    
    // Simulate fluctuating values
    setInterval(() => {
        indicators.forEach(indicator => {
            const currentValue = parseInt(indicator.textContent.match(/\d+/)[0]);
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            let newValue = currentValue + change;
            
            // Keep within bounds
            if (indicator.classList.contains('health')) {
                newValue = Math.min(100, Math.max(70, newValue));
            } else if (indicator.classList.contains('radiation')) {
                newValue = Math.min(50, Math.max(5, newValue));
            } else if (indicator.classList.contains('contamination')) {
                newValue = Math.min(30, Math.max(0, newValue));
            }
            
            // Update display
            indicator.textContent = indicator.textContent.replace(/\d+/, newValue);
        });
    }, 3000);
}

// Background bio effects
function initBioEffects() {
    // Create floating particles
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 30; i++) {
        createParticle(particleContainer);
    }
    
    // Animate player marker on map
    animatePlayerMarker();
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'bio-particle';
    
    // Random properties
    const size = Math.random() * 5 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const color = ['var(--bio-green)', 'var(--bio-purple)', 'var(--bio-red)'][Math.floor(Math.random() * 3)];
    const duration = Math.random() * 20 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.backgroundColor = color;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
    
    // Remove particle after animation completes and create a new one
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, duration * 1000);
}

function animatePlayerMarker() {
    const marker = document.querySelector('.player-marker');
    if (!marker) return;
    
    let posX = 50;
    let posY = 50;
    let angle = 0;
    
    function moveMarker() {
        // Move in a circular pattern around the center
        angle += 0.02;
        posX = 50 + 20 * Math.cos(angle);
        posY = 50 + 15 * Math.sin(angle);
        
        marker.style.left = `${posX}%`;
        marker.style.top = `${posY}%`;
        
        requestAnimationFrame(moveMarker);
    }
    
    moveMarker();
}

// Enhanced CTA button interaction
document.querySelector('.cta-button').addEventListener('click', function() {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    this.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Temporarily change button text
    const originalText = this.textContent;
    this.textContent = 'ACCESS GRANTED';
    
    setTimeout(() => {
        this.textContent = originalText;
    }, 2000);
});

// Add ripple effect styling dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .bio-particle {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        animation: float linear infinite;
    }
    
    @keyframes float {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 0.5;
        }
        100% {
            transform: translate(calc((Math.random() - 0.5) * 100vw), calc((Math.random() - 0.5) * 100vh)) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mutation icon animations
function animateMutationIcons() {
    const icons = document.querySelectorAll('.mutation-icon');
    
    icons.forEach(icon => {
        // Add subtle continuous animation based on icon type
        if (icon.classList.contains('bio-glow')) {
            setInterval(() => {
                const intensity = 20 + Math.random() * 10;
                icon.style.boxShadow = `inset 0 0 ${intensity}px var(--bio-green), 0 0 ${intensity}px var(--bio-green)`;
            }, 1000);
        }
    });
}

// Initialize mutation icon animations
setTimeout(animateMutationIcons, 1000);

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Adjust particle count based on screen size
    const particles = document.querySelectorAll('.bio-particle');
    const particleContainer = document.querySelector('.particle-container');
    
    if (window.innerWidth < 768) {
        // Reduce particles on mobile
        if (particles.length > 15) {
            for (let i = 0; i < particles.length - 15; i++) {
                if (particles[i]) particles[i].remove();
            }
        }
    } else {
        // Ensure enough particles on desktop
        const needed = 30 - particles.length;
        for (let i = 0; i < needed; i++) {
            createParticle(particleContainer);
        }
    }
});