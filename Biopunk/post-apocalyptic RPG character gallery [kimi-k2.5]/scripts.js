/**
 * BIOSYNTH ARCHIVE - JavaScript Systems
 * Post-Apocalyptic Biopunk RPG Character Database
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initParticleSystem();
    initFilters();
    initCardInteractions();
    initScanSystem();
    initGlitchEffects();
    initTerminalEffects();
});

// ==========================================
// DNA PARTICLE SYSTEM
// Floating bio-particles in background
// ==========================================
function initParticleSystem() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 25;
    const particles = [];
    
    // Create DNA helix particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'bio-particle';
        
        // Random properties
        const size = Math.random() * 20 + 10;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // DNA helix styling
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size * 2}px;
            left: ${x}%;
            top: ${y}%;
            opacity: ${opacity};
            pointer-events: none;
            animation: float-particle ${duration}s ease-in-out ${delay}s infinite;
        `;
        
        // Create helix structure with two strands
        const strand1 = document.createElement('div');
        strand1.style.cssText = `
            position: absolute;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, rgba(57, 255, 20, 0.4), transparent);
            left: 30%;
            animation: helix-rotate ${duration * 0.5}s ease-in-out infinite;
            transform-origin: center;
        `;
        
        const strand2 = document.createElement('div');
        strand2.style.cssText = `
            position: absolute;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, rgba(191, 0, 255, 0.4), transparent);
            right: 30%;
            animation: helix-rotate ${duration * 0.5}s ease-in-out infinite reverse;
            transform-origin: center;
        `;
        
        // Cross bars (base pairs)
        for (let j = 0; j < 4; j++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                position: absolute;
                width: 60%;
                height: 1px;
                background: rgba(57, 255, 20, 0.2);
                top: ${20 + j * 20}%;
                left: 20%;
                animation: helix-bar ${duration * 0.5}s ease-in-out infinite;
                animation-delay: ${j * 0.2}s;
            `;
            particle.appendChild(bar);
        }
        
        particle.appendChild(strand1);
        particle.appendChild(strand2);
        container.appendChild(particle);
        particles.push(particle);
    }
    
    // Add keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes helix-rotate {
            0%, 100% { transform: scaleY(1); opacity: 0.8; }
            50% { transform: scaleY(0.6); opacity: 0.4; }
        }
        @keyframes helix-bar {
            0%, 100% { opacity: 0.3; transform: scaleX(1); }
            50% { opacity: 0.8; transform: scaleX(0.5); }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// FILTER SYSTEM
// Handle faction and mutation filtering
// ==========================================
function initFilters() {
    const factionFilter = document.getElementById('faction-filter');
    const mutationFilter = document.getElementById('mutation-filter');
    const scanBtn = document.getElementById('scan-btn');
    const cards = document.querySelectorAll('.bio-card');
    const subjectCount = document.getElementById('subject-count');
    
    if (!factionFilter || !mutationFilter) return;
    
    function filterCards() {
        const faction = factionFilter.value;
        const mutation = mutationFilter.value;
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardFaction = card.dataset.faction;
            const cardMutation = parseInt(card.dataset.mutation);
            
            let factionMatch = faction === 'all' || cardFaction === faction;
            let mutationMatch = true;
            
            if (mutation !== 'all') {
                const mutationLevel = getMutationLevel(cardMutation);
                mutationMatch = mutationLevel === mutation;
            }
            
            if (factionMatch && mutationMatch) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease forwards';
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Update counter with glitch effect
        if (subjectCount) {
            subjectCount.style.textShadow = '0 0 10px #ff003c';
            setTimeout(() => {
                subjectCount.textContent = String(visibleCount).padStart(2, '0');
                subjectCount.style.textShadow = 'none';
            }, 150);
        }
    }
    
    function getMutationLevel(value) {
        if (value <= 30) return 'low';
        if (value <= 60) return 'med';
        if (value <= 90) return 'high';
        return 'critical';
    }
    
    factionFilter.addEventListener('change', filterCards);
    mutationFilter.addEventListener('change', filterCards);
    
    // Scan button animation
    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            scanBtn.style.transform = 'scale(0.95)';
            setTimeout(() => scanBtn.style.transform = 'scale(1)', 150);
            filterCards();
            triggerScanEffect();
        });
    }
    
    // Add fade in animation
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(fadeStyle);
}

// ==========================================
// CARD INTERACTIONS
// 3D tilt effect and glitch intensity
// ==========================================
function initCardInteractions() {
    const cards = document.querySelectorAll('.bio-card');
    
    cards.forEach(card => {
        const frame = card.querySelector('.card-frame');
        const placeholder = card.querySelector('.placeholder-glitch');
        
        // 3D Tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // Intensify glitch on hover
            if (placeholder) {
                placeholder.style.animation = 'glitch-intense 0.3s infinite';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            frame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            if (placeholder) {
                placeholder.style.animation = '';
            }
        });
        
        // Mutation badge pulse on hover
        const badge = card.querySelector('.mutation-badge');
        if (badge) {
            card.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.1)';
                badge.style.boxShadow = '0 0 20px currentColor';
            });
            card.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
                badge.style.boxShadow = 'none';
            });
        }
    });
    
    // Add intense glitch keyframes
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        @keyframes glitch-intense {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(glitchStyle);
}

// ==========================================
// SCAN SYSTEM
// Global scan effect across all cards
// ==========================================
function initScanSystem() {
    // Add scan line effect
    const scanLine = document.createElement('div');
    scanLine.id = 'global-scan';
    scanLine.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: rgba(57, 255, 20, 0.8);
        box-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
        z-index: 9999;
        pointer-events: none;
        transform: translateY(-100vh);
        display: none;
    `;
    document.body.appendChild(scanLine);
}

function triggerScanEffect() {
    const scanLine = document.getElementById('global-scan');
    if (!scanLine) return;
    
    scanLine.style.display = 'block';
    scanLine.style.animation = 'scan-down 1.5s ease-in-out';
    
    // Play scan sound effect (visual feedback)
    document.body.style.filter = 'brightness(1.2)';
    setTimeout(() => {
        document.body.style.filter = 'brightness(1)';
    }, 200);
    
    setTimeout(() => {
        scanLine.style.display = 'none';
        scanLine.style.animation = '';
    }, 1500);
    
    // Add scan animation
    const scanStyle = document.createElement('style');
    scanStyle.textContent = `
        @keyframes scan-down {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
        }
    `;
    document.head.appendChild(scanStyle);
}

// ==========================================
// GLITCH EFFECTS
// Random glitching on text elements
// ==========================================
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.placeholder-glitch, .character-name');
    
    // Random interval glitch
    setInterval(() => {
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        if (randomElement) {
            randomElement.style.textShadow = '2px 0 #ff003c, -2px 0 #00d4ff';
            setTimeout(() => {
                randomElement.style.textShadow = '';
            }, 100);
        }
    }, 3000);
    
    // Terminal text scramble effect
    const terminalTexts = document.querySelectorAll('.terminal-cmd, .footer-value');
    terminalTexts.forEach(el => {
        el.addEventListener('mouseenter', () => {
            scrambleText(el);
        });
    });
}

function scrambleText(element) {
    const originalText = element.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_//';
    let iterations = 0;
    const maxIterations = 10;
    
    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        iterations += 1 / 3;
        
        if (iterations >= originalText.length) {
            clearInterval(interval);
            element.textContent = originalText;
        }
    }, 50);
}

// ==========================================
// TERMINAL EFFECTS
// Typing cursor and command history simulation
// ==========================================
function initTerminalEffects() {
    const terminals = document.querySelectorAll('.terminal-header');
    
    // Add typing effect to terminal headers on load
    terminals.forEach((terminal, index) => {
        const cmd = terminal.querySelector('.terminal-cmd');
        if (cmd) {
            const originalText = cmd.textContent;
            cmd.textContent = '';
            setTimeout(() => {
                typeText(cmd, originalText);
            }, index * 500 + 1000);
        }
    });
    
    // Random command updates
    const commands = [
        'INITIATE_QUERY_SEQUENCE',
        'SCANNING_BIO_SIGNATURES',
        'DECRYPTING_DNA_SEQUENCES',
        'ACCESSING_NECROTECH_DB',
        'SYNCING_WITH_HIVE_MIND',
        'PURIST_FIREWALL_DETECTED'
    ];
    
    setInterval(() => {
        const terminals = document.querySelectorAll('.terminal-cmd');
        terminals.forEach(cmd => {
            if (Math.random() > 0.7) {
                const newCmd = commands[Math.floor(Math.random() * commands.length)];
                cmd.style.opacity = '0.5';
                setTimeout(() => {
                    cmd.textContent = newCmd;
                    cmd.style.opacity = '1';
                }, 150);
            }
        });
    }, 8000);
}

function typeText(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// ==========================================
// PROGRESS BAR ANIMATIONS
// Animate bars on scroll into view
// ==========================================
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.progress-fill, .skill-fill');
            fills.forEach(fill => {
                const width = fill.style.getPropertyValue('--fill-amount') || 
                             fill.style.getPropertyValue('--skill-level');
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards after load
setTimeout(() => {
    document.querySelectorAll('.bio-card').forEach(card => {
        observer.observe(card);
    });
}, 100);

// ==========================================
// KEYBOARD SHORTCUTS
// Accessibility and power user features
// ==========================================
document.addEventListener('keydown', (e) => {
    // ESC to clear filters
    if (e.key === 'Escape') {
        const factionFilter = document.getElementById('faction-filter');
        const mutationFilter = document.getElementById('mutation-filter');
        if (factionFilter) factionFilter.value = 'all';
        if (mutationFilter) mutationFilter.value = 'all';
        factionFilter?.dispatchEvent(new Event('change'));
    }
    
    // S to trigger scan
    if (e.key === 's' || e.key === 'S') {
        triggerScanEffect();
    }
});

// Console easter egg
console.log('%cBIOSYNTH ARCHIVE v2.077.α', 'color: #39ff14; font-family: monospace; font-size: 20px;');
console.log('%cWARNING: Bio-contamination detected in console', 'color: #ff003c; font-family: monospace;');
console.log('%c> Type "help" for available commands (or not, this is just a demo)', 'color: #bf00ff; font-family: monospace;');