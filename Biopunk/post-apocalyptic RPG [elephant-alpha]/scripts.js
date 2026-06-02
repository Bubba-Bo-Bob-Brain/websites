// scripts.js

// Mutation Catalog Animation
function initializeMutationCatalog() {
    const mutationCards = document.querySelectorAll('.mutation-card');
    
    mutationCards.forEach((card, index) => {
        // Add staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Click interaction
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            animateMutationCard(this);
            updateMutationLog(type);
        });
        
        // Hover progress animation
        card.addEventListener('mouseenter', function() {
            const progress = this.querySelector('.progress-fill');
            progress.style.animation = 'none';
            setTimeout(() => {
                progress.style.animation = 'fillGrow 1.5s ease-out forwards';
            }, 10);
        });
    });
}

function animateMutationCard(card) {
    card.style.transform = 'scale(1.05)';
    card.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 300);
}

function updateMutationLog(mutationType) {
    const logEntry = document.createElement('div');
    logEntry.className = 'mutation-log-entry';
    logEntry.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid var(--accent-cyan);
        color: var(--accent-cyan);
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-family: var(--font-display);
        font-size: 0.8rem;
        z-index: 10000;
        animation: logSlideIn 0.5s ease-out forwards;
    `;
    
    const typeColors = {
        physical: 'var(--accent-cyan)',
        biological: 'var(--accent-red)',
        neural: 'var(--accent-purple)',
        energy: 'var(--accent-green)'
    };
    
    logEntry.textContent = `MUTATION ACTIVATED: ${mutationType.toUpperCase()}`;
    logEntry.style.borderColor = typeColors[mutationType] || 'var(--accent-cyan)';
    
    document.body.appendChild(logEntry);
    
    // Remove after animation
    setTimeout(() => {
        logEntry.remove();
    }, 3000);
}

// Tech Tree Interaction
function initializeTechTree() {
    const techNodes = document.querySelectorAll('.tech-node');
    
    techNodes.forEach(node => {
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const nodeCore = this.querySelector('.node-core');
            if (nodeCore) {
                activateTechNode(this);
            }
        });
        
        // Hover effect
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function activateTechNode(node) {
    const core = node.querySelector('.node-core');
    core.style.background = 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))';
    core.style.boxShadow = 'var(--glow-green)';
    core.style.color = 'white';
    
    // Add activation effect
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(57, 255, 20, 0.3), transparent);
        animation: techActivate 1s ease-out forwards;
        pointer-events: none;
    `;
    
    node.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

// Contamination Map Interaction
function initializeContaminationMap() {
    const zones = document.querySelectorAll('.zone');
    
    zones.forEach(zone => {
        zone.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            showContaminationAlert(level);
            animateZone(this);
        });
        
        zone.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            this.style.filter = 'brightness(1.2)';
        });
        
        zone.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
    
    // Update contamination level periodically
    setInterval(updateContaminationLevel, 5000);
}

function showContaminationAlert(level) {
    const alerts = {
        5: { text: 'CRITICAL CONTAMINATION! SEEK SHELTER IMMEDIATELY', color: 'var(--accent-red)' },
        3: { text: 'DANGER: HIGH MUTATION EXPOSURE RISK', color: 'var(--accent-orange)' },
        1: { text: 'CAUTION: LOW LEVEL MUTAGENS DETECTED', color: 'var(--accent-yellow)' }
    };
    
    const alert = alerts[level] || alerts[1];
    
    // Update level indicator
    const levelBar = document.getElementById('contamination-level');
    const levelText = document.getElementById('level-text');
    
    levelBar.style.width = `${level * 20}%`;
    levelText.textContent = alert.text.split(':')[0];
    levelText.style.color = alert.color;
    
    // Show alert notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: ${alert.color};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-family: var(--font-display);
        font-size: 1rem;
        z-index: 10000;
        animation: alertSlideIn 0.5s ease-out;
        box-shadow: 0 0 20px ${alert.color};
    `;
    notification.textContent = alert.text;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function animateZone(zone) {
    zone.style.animation = 'none';
    setTimeout(() => {
        zone.style.animation = 'zonePulse 0.5s ease-in-out 3';
    }, 10);
}

function updateContaminationLevel() {
    const levelBar = document.getElementById('contamination-level');
    const levelText = document.getElementById('level-text');
    
    // Simulate contamination fluctuation
    const currentWidth = parseInt(levelBar.style.width) || 35;
    const change = Math.random() * 10 - 5;
    const newWidth = Math.max(10, Math.min(80, currentWidth + change));
    
    levelBar.style.width = `${newWidth}%`;
    
    if (newWidth > 60) {
        levelText.textContent = 'DANGER';
        levelText.style.color = 'var(--accent-red)';
    } else if (newWidth > 30) {
        levelText.textContent = 'CAUTION';
        levelText.style.color = 'var(--accent-orange)';
    } else {
        levelText.textContent = 'SAFE';
        levelText.style.color = 'var(--accent-green)';
    }
}

// Character Stats Animation
function initializeCharacterStats() {
    const statBars = document.querySelectorAll('.bar-fill');
    
    statBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Navigation Smooth Scroll
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add active state
                navLinks.forEach(l => l.style.color = 'var(--text-secondary)');
                this.style.color = 'var(--accent-cyan)';
                this.style.textShadow = 'var(--glow-cyan)';
            }
        });
    });
}

// Animation Initialization
function initializeAnimations() {
    // Add entrance animations
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        section.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Trigger animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // CTA Button Animation
    const ctaButton = document.getElementById('start-game');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'ctaPulse 0.5s ease-in-out 3';
            }, 10);
            
            // Scroll to character section
            const characterSection = document.getElementById('character');
            if (characterSection) {
                characterSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Add CSS for CTA animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ctaPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes alertSlideIn {
            0% { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            100% { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @keyframes logSlideIn {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes techActivate {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Window Resize Handler
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate positions for responsive elements
        const radarBeams = document.querySelectorAll('.radar-beam');
        radarBeams.forEach(beam => {
            beam.style.animationDuration = '8s';
        });
    }, 250);
});