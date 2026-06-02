/* ============================================
   GENESIS PROTOCOL - INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initParticleSystem();
    initMutationCards();
    initZoneMap();
    initTechTree();
    initSurvivalGuide();
    initStatCounters();
    initScrollAnimations();
    initOrganicEffects();
});

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Smooth scroll on nav click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active nav on scroll
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px 0px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
}

/* ============================================
   PARTICLE SYSTEM
   ============================================ */

function initParticleSystem() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 255, 136, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 20 + 10}s linear infinite;
            animation-delay: ${Math.random() * 20}s;
        `;
        container.appendChild(particle);
    }
    
    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   MUTATION CARDS
   ============================================ */

function initMutationCards() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.mutation-card');
    const acquireBtns = document.querySelectorAll('.acquire-btn');
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'card-appear 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Acquire button interaction
    acquireBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.mutation-card');
            const mutationName = card.querySelector('.mutation-name').textContent;
            
            // Create mutation effect
            createMutationEffect(this);
            
            // Update button state
            this.textContent = 'ACQUIRED';
            this.style.background = 'var(--bio-green)';
            this.style.color = 'var(--bg-dark)';
            this.disabled = true;
            
            // Show notification
            showNotification(`Mutation acquired: ${mutationName}`);
        });
    });
    
    // Add card appear animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes card-appear {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

function createMutationEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = 20;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--bio-green);
            border-radius: 50%;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            z-index: 10000;
            animation: mutation-burst 0.8s ease-out forwards;
            --angle: ${(360 / particles) * i}deg;
        `;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 800);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mutation-burst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(cos(var(--angle)) * 100px, sin(var(--angle)) * 100px) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   ZONE MAP
   ============================================ */

function initZoneMap() {
    const zoneMarkers = document.querySelectorAll('.zone-marker');
    const zoneName = document.querySelector('.zone-name');
    const zoneDesc = document.querySelector('.zone-desc');
    const previewImage = document.querySelector('.preview-image');
    const hazardTags = document.querySelector('.zone-hazards');
    const rewardsList = document.querySelector('.zone-rewards ul');
    const enterBtn = document.querySelector('.zone-btn.enter');
    
    const zoneData = {
        1: {
            name: 'The Crimson Wastes',
            desc: 'Former industrial district now overrun with aggressive fungal growths and toxic spore clouds.',
            type: 'red',
            hazards: ['TOXIC AIR', 'FUNGAL INFESTATION', 'RADIATION'],
            rewards: ['Rare Mutagen Samples', 'Pre-War Technology', 'Bio-Organic Materials']
        },
        2: {
            name: 'Amber Plains',
            desc: 'Vast stretches of mutated grassland where the ecosystem has adapted in strange new ways.',
            type: 'amber',
            hazards: ['MUTATED FAUNA', 'UNSTABLE TERRAIN'],
            rewards: ['Herbal Mutagens', 'Creature Samples', 'Clean Water']
        },
        3: {
            name: 'The Verdant Haven',
            desc: 'A surprisingly lush area where plant life has reclaimed the ruins, creating a unique biosphere.',
            type: 'green',
            hazards: ['OVERGROWTH'],
            rewards: ['Medical Supplies', 'Food Sources', 'Shelter Materials']
        },
        4: {
            name: 'Rust Valley',
            desc: 'Collapsed infrastructure creates dangerous pathways, but valuable scrap awaits the brave.',
            type: 'amber',
            hazards: ['STRUCTURAL COLLAPSE', 'CONTAMINATED WATER'],
            rewards: ['Scrap Metal', 'Electronic Components', 'Fuel Cells']
        },
        5: {
            name: 'The Devouring Dark',
            desc: 'A zone where something ancient and terrible has taken root. Few who enter return unchanged.',
            type: 'red',
            hazards: ['UNKNOWN ENTITIES', 'REALITY DISTORTION', 'EXTREME RADIATION'],
            rewards: ['Alien Artifacts', 'Evolution Catalysts', 'Forbidden Knowledge']
        }
    };
    
    zoneMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const zoneId = marker.getAttribute('data-zone');
            const data = zoneData[zoneId];
            
            if (data) {
                zoneName.textContent = data.name;
                zoneDesc.textContent = data.desc;
                previewImage.className = `preview-image zone-${data.type}`;
                
                // Update hazards
                hazardTags.innerHTML = data.hazards.map(h => 
                    `<span class="hazard-tag">${h}</span>`
                ).join('');
                
                // Update rewards
                rewardsList.innerHTML = data.rewards.map(r => 
                    `<li>${r}</li>`
                ).join('');
                
                // Animate panel
                const panel = document.querySelector('.zone-info-panel');
                panel.style.animation = 'none';
                panel.offsetHeight; // Trigger reflow
                panel.style.animation = 'panel-pulse 0.5s ease';
            }
        });
    });
    
    // Enter zone button
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            const selectedZone = document.querySelector('.zone-name').textContent;
            showNotification(`Entering ${selectedZone}... Prepare for the worst.`);
        });
    }
    
    // Add panel pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes panel-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   TECH TREE
   ============================================ */

function initTechTree() {
    const techNodes = document.querySelectorAll('.tech-node');
    const detailTitle = document.querySelector('.detail-title');
    const detailDesc = document.querySelector('.detail-desc');
    const requirementsList = document.querySelector('.detail-requirements ul');
    const effectsContainer = document.querySelector('.detail-effects');
    const unlockBtn = document.querySelector('.unlock-btn');
    
    const techData = {
        neural: {
            name: 'Neural Link',
            desc: 'Basic neural interface allowing direct connection to bio-networks.',
            requirements: [
                { text: 'Starting Technology', met: true }
            ],
            effects: [
                { text: '+20% Network Range', positive: true }
            ],
            unlocked: true
        },
        synaptic: {
            name: 'Synaptic Boost',
            desc: 'Enhanced neural pathways for faster information processing.',
            requirements: [
                { text: 'Neural Link (Tier 1)', met: true },
                { text: '300 Bio-Credits', met: true }
            ],
            effects: [
                { text: '+30% Processing Speed', positive: true },
                { text: '-10% Energy Efficiency', positive: false }
            ],
            unlocked: true
        },
        cerebral: {
            name: 'Cerebral Cortex Enhancement',
            desc: 'Advanced neural restructuring that unlocks dormant brain regions.',
            requirements: [
                { text: 'Synaptic Boost (Tier 2)', met: true },
                { text: 'Neural Link (Tier 1)', met: true },
                { text: '500 Bio-Credits', met: false },
                { text: 'Mutation Stability > 80%', met: false }
            ],
            effects: [
                { text: '+40% Cognitive Processing', positive: true },
                { text: 'Unlock Psychic Abilities', positive: true },
                { text: '-15% Emotional Response', positive: false }
            ],
            unlocked: false
        },
        exoskeleton: {
            name: 'Exo-Skeleton',
            desc: 'External bio-mechanical support structure for enhanced physical capabilities.',
            requirements: [
                { text: 'Dermal Shield (Tier 1)', met: true },
                { text: 'Dense Muscle Tissue', met: false }
            ],
            effects: [
                { text: '+50% Carry Capacity', positive: true },
                { text: '+25% Physical Defense', positive: true },
                { text: '-20% Movement Speed', positive: false }
            ],
            unlocked: false
        }
    };
    
    techNodes.forEach(node => {
        node.addEventListener('click', () => {
            const techId = node.getAttribute('data-tech');
            const data = techData[techId];
            
            if (data) {
                detailTitle.textContent = data.name.toUpperCase();
                detailDesc.textContent = data.desc;
                
                // Update requirements
                requirementsList.innerHTML = data.requirements.map(req => 
                    `<li class="${req.met ? 'met' : ''}">${req.met ? '✓' : '○'} ${req.text}</li>`
                ).join('');
                
                // Update effects
                effectsContainer.innerHTML = '<h4>EFFECTS:</h4>' + 
                    data.effects.map(effect => 
                        `<div class="effect-item ${effect.positive ? 'positive' : 'negative'}">
                            <span class="effect-icon">${effect.positive ? '↑' : '↓'}</span>
                            <span class="effect-text">${effect.text}</span>
                        </div>`
                    ).join('');
                
                // Update unlock button
                unlockBtn.disabled = !node.classList.contains('available') && !node.classList.contains('unlocked');
                
                if (node.classList.contains('unlocked')) {
                    unlockBtn.textContent = 'INSTALLED';
                    unlockBtn.disabled = true;
                } else if (node.classList.contains('available')) {
                    unlockBtn.textContent = 'INSTALL ENHANCEMENT';
                } else {
                    unlockBtn.textContent = 'LOCKED';
                }
            }
        });
    });
    
    // Unlock button interaction
    if (unlockBtn) {
        unlockBtn.addEventListener('click', function() {
            if (!this.disabled) {
                this.textContent = 'INSTALLING...';
                this.style.background = 'var(--bio-yellow)';
                
                setTimeout(() => {
                    this.textContent = 'INSTALLED';
                    this.style.background = 'var(--bio-green)';
                    this.disabled = true;
                    showNotification('Enhancement installed successfully!');
                }, 1500);
            }
        });
    }
}

/* ============================================
   SURVIVAL GUIDE
   ============================================ */

function initSurvivalGuide() {
    const catBtns = document.querySelectorAll('.guide-cat-btn');
    const entries = document.querySelectorAll('.guide-entry');
    
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-cat');
            
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            entries.forEach(entry => {
                entry.classList.remove('active');
                if (entry.getAttribute('data-entry') === category) {
                    entry.classList.add('active');
                    entry.style.animation = 'entry-appear 0.5s ease';
                }
            });
        });
    });
    
    // Add entry appear animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes entry-appear {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   STAT COUNTERS
   ============================================ */

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                animateCounter(target, countTo);
                counterObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.mutation-card, .tech-node, .guide-entry');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
}

/* ============================================
   ORGANIC EFFECTS
   ============================================ */

function initOrganicEffects() {
    // Breathing effect for organic shapes
    const organisms = document.querySelectorAll('.organism');
    organisms.forEach((org, index) => {
        org.style.animation = `breathe ${8 + index * 2}s ease-in-out infinite`;
    });
    
    // Add breathe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
        }
        
        @keyframes vein-pulse {
            0%, 100% { stroke-dasharray: 0, 100; }
            50% { stroke-dasharray: 50, 50; }
        }
    `;
    document.head.appendChild(style);
    
    // Random glitch effect
    setInterval(() => {
        if (Math.random() > 0.95) {
            const overlay = document.querySelector('.organic-overlay');
            overlay.style.background = `
                radial-gradient(ellipse at ${Math.random() * 100}% ${Math.random() * 100}%, 
                rgba(0, 255, 136, 0.1) 0%, transparent 50%)
            `;
            setTimeout(() => {
                overlay.style.background = '';
            }, 100);
        }
    }, 2000);
    
    // DNA helix rotation sync
    const helixes = document.querySelectorAll('.dna-helix');
    helixes.forEach(helix => {
        const strands = helix.querySelectorAll('.helix-strand');
        let rotation = 0;
        
        setInterval(() => {
            rotation += 1;
            strands[0].style.transform = `rotateY(${rotation}deg)`;
            strands[1].style.transform = `rotateY(${rotation + 180}deg)`;
        }, 50);
    });
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */

function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--bg-card);
        border: 1px solid var(--bio-green);
        border-radius: var(--radius-medium);
        padding: 20px 30px;
        color: var(--text-primary);
        font-family: var(--font-mono);
        font-size: 0.9rem;
        z-index: 10000;
        animation: notification-slide 0.5s ease forwards;
        box-shadow: var(--shadow-glow);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="color: var(--bio-green); font-size: 1.5rem;">◈</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'notification-slide-out 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notification-slide {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes notification-slide-out {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   CURSOR EFFECTS
   ============================================ */

// Custom cursor for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .tech-node, .zone-marker, .mutation-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
    });
    
    el.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
});

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

document.addEventListener('keydown', (e) => {
    // Press 'M' to open mutation catalog
    if (e.key === 'm' || e.key === 'M') {
        document.getElementById('mutations').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'Z' to open zones
    if (e.key === 'z' || e.key === 'Z') {
        document.getElementById('zones').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'T' to open tech tree
    if (e.key === 't' || e.key === 'T') {
        document.getElementById('techtree').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'S' to open survival guide
    if (e.key === 's' || e.key === 'S') {
        document.getElementById('survival').scrollIntoView({ behavior: 'smooth' });
    }
});

/* ============================================
   EASTER EGG - KONAMI CODE
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
    showNotification('🧬 SECRET UNLOCKED: Evolution Accelerated! 🧬');
    
    // Add special effect
    document.body.style.animation = 'evolution-flash 0.5s ease';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes evolution-flash {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(180deg) brightness(1.5); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

// Debounce function for scroll events
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

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Add any scroll-based calculations here
}, 16);

window.addEventListener('scroll', optimizedScroll);

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */

console.log(`
%c🧬 GENESIS PROTOCOL 🧬
%cYear 2187 - Adapt or Perish

%cWelcome, survivor. The wasteland awaits.
Press M - Mutations
Press Z - Zones  
Press T - Tech Tree
Press S - Survival Guide

Or try the Konami Code for a secret...
`, 
'color: #00ff88; font-size: 24px; font-weight: bold;',
'color: #ffc832; font-size: 16px;',
'color: #888; font-size: 12px;'
);