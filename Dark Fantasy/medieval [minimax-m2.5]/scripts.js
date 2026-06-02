/** ========================================
THE BLACK CHRONICLE - Medieval Dark Fantasy
Interactive JavaScript
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeScrollEffects();
    initializeMapInteractions();
    initializeCreatureCards();
    initializeScrollTop();
    initializeTorchEffects();
    initializeFloatingRunes();
    initializeRandomProphecy();
    initializeParallax();
    initializeSectionReveal();
    initializeQuestBoard();
});

/** ========================================
SCROLL EFFECTS & SCROLL TO TOP
======================================== */
function initializeScrollEffects() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        // Show/hide scroll button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        // Throttle scroll effects
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateTorchIntensity();
            updateParallax();
        }, 10);
    });
}

function initializeScrollTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    scrollTopBtn.addEventListener('click', function() {
        smoothScrollTo(0, 800);
    });
}

function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const startTime = performance.now();
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        window.scrollTo(0, start + (target - start) * easeProgress);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** ========================================
TORCHLIGHT EFFECTS
======================================== */
function initializeTorchEffects() {
    updateTorchIntensity();
}

function updateTorchIntensity() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    const torches = document.querySelectorAll('.torch-light');
    
    torches.forEach((torch, index) => {
        const baseOpacity = 0.6 + (index * 0.1);
        const variation = Math.sin(Date.now() / 1000 + index) * 0.2;
        const scrollDim = 1 - (scrollProgress * 0.4);
        torch.style.opacity = (baseOpacity + variation) * scrollDim;
    });
}

/** ========================================
MAP INTERACTIONS
======================================== */
function initializeMapInteractions() {
    const mapLocations = document.querySelectorAll('.map-location');
    
    const locationInfo = {
        'shadow-reach': {
            name: 'Shadow Reach',
            description: 'A twisted forest where sunlight never reaches the ground. The Shadow Stalkers make their home here.',
            danger: 'Extreme',
            coords: '47.2°N, 12.8°W'
        },
        'bleak-moor': {
            name: 'Bleak Moor',
            description: 'Endless fog-covered marshlands. Locals say the spirits of the drowned still wander here.',
            danger: 'High',
            coords: '51.6°N, 8.3°W'
        },
        'bone-keep': {
            name: 'Bone Keep',
            description: 'An ancient fortress carved from the bones of a fallen titan. Now home to the Bone Colossi.',
            danger: 'Catastrophic',
            coords: '44.8°N, 15.2°W'
        },
        'weeping-ruins': {
            name: 'Weeping Ruins',
            description: 'Once a grand temple, now crumbling. The Crimson Wraiths guard its secrets jealously.',
            danger: 'Moderate',
            coords: '49.1°N, 10.7°W'
        },
        'void-gate': {
            name: 'The Void Gate',
            description: 'A tear in reality itself. The Void Wyrms emerge from here to feast on dying worlds.',
            danger: 'Catastrophic',
            coords: '53.4°N, 18.6°W'
        }
    };
    
    mapLocations.forEach(location => {
        location.addEventListener('click', function(e) {
            e.stopPropagation();
            const locationKey = this.dataset.location;
            const info = locationInfo[locationKey];
            if (info) {
                showLocationTooltip(this, info);
            }
        });
        
        location.addEventListener('mouseenter', function() {
            this.style.setProperty('--scale', '1.1');
        });
    });
    
    // Close tooltip when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.map-location')) {
            hideLocationTooltip();
        }
    });
}

function showLocationTooltip(locationElement, info) {
    hideLocationTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'location-tooltip';
    tooltip.innerHTML = `
        <h4 class="tooltip-title">${info.name}</h4>
        <p class="tooltip-coords">${info.coords}</p>
        <p class="tooltip-desc">${info.description}</p>
        <div class="tooltip-danger">
            <span>Danger Level:</span>
            <span class="danger-${info.danger.toLowerCase()}">${info.danger}</span>
        </div>
    `;
    
    const rect = locationElement.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 10) + 'px';
    tooltip.style.zIndex = '1000';
    
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.classList.add('visible'), 10);
}

function hideLocationTooltip() {
    const existingTooltip = document.querySelector('.location-tooltip');
    if (existingTooltip) {
        existingTooltip.classList.remove('visible');
        setTimeout(() => existingTooltip.remove(), 300);
    }
}

/** ========================================
CREATURE CARDS
======================================== */
function initializeCreatureCards() {
    const creatureCards = document.querySelectorAll('.creature-card');
    
    const creatureDetails = {
        'shadow-stalker': {
            abilities: ['Shadow Walk', 'Nightmare Feed', 'Ethereal Form'],
            weakness: 'Bright Light, Holy Water'
        },
        'bone-colossus': {
            abilities: ['Earthquake Stomp', 'Bone Shield', 'Undead Resilience'],
            weakness: 'Holy Magic, Fire'
        },
        'void-wyrm': {
            abilities: ['Reality Tear', 'Essence Drain', 'Void Portal'],
            weakness: 'Blade of Eternity, Blood Ritual'
        },
        'crimson-wraith': {
            abilities: ['Spectral Strike', 'Oath Binding', 'Blood Fog'],
            weakness: 'Sunlight, Broken Chains'
        }
    };
    
    creatureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const creatureKey = this.dataset.creature;
            if (creatureDetails[creatureKey]) {
                showCreatureStats(this, creatureDetails[creatureKey]);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            hideCreatureStats();
        });
    });
}

function showCreatureStats(card, details) {
    hideCreatureStats();
    
    const panel = document.createElement('div');
    panel.className = 'creature-stats-panel';
    panel.innerHTML = `
        <div class="stats-section">
            <h5>Special Abilities</h5>
            <ul class="abilities-list">
                ${details.abilities.map(a => `<li>✦ ${a}</li>`).join('')}
            </ul>
        </div>
        <div class="stats-section">
            <h5>Weaknesses</h5>
            <p class="weakness-text">${details.weakness}</p>
        </div>
    `;
    
    card.appendChild(panel);
    setTimeout(() => panel.classList.add('visible'), 10);
}

function hideCreatureStats() {
    const existingPanel = document.querySelector('.creature-stats-panel');
    if (existingPanel) {
        existingPanel.classList.remove('visible');
        setTimeout(() => existingPanel.remove(), 300);
    }
}

/** ========================================
FLOATING RUNES INTERACTION
======================================== */
function initializeFloatingRunes() {
    const runes = document.querySelectorAll('.floating-rune');
    
    const runeMeanings = {
        'ᚠ': 'Fehu - Wealth, Abundance',
        'ᚢ': 'Uruz - Strength, Vitality',
        'ᚦ': 'Thurisaz - Protection, Giants',
        'ᚨ': 'Ansuz - Knowledge, Odin',
        'ᚱ': 'Raido - Journey, Adventure'
    };
    
    runes.forEach(rune => {
        rune.addEventListener('mouseenter', function() {
            const runeChar = this.dataset.rune;
            showRuneMeaning(this, runeMeanings[runeChar]);
        });
        
        rune.addEventListener('mouseleave', function() {
            hideRuneMeaning();
        });
        
        rune.addEventListener('click', function() {
            this.style.animationDuration = (Math.random() * 10 + 10) + 's';
        });
    });
}

function showRuneMeaning(runeElement, meaning) {
    const existing = document.querySelector('.rune-meaning-tooltip');
    if (existing) existing.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'rune-meaning-tooltip';
    tooltip.textContent = meaning;
    document.body.appendChild(tooltip);
    
    const rect = runeElement.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 5) + 'px';
    
    setTimeout(() => tooltip.classList.add('visible'), 10);
}

function hideRuneMeaning() {
    const tooltip = document.querySelector('.rune-meaning-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        setTimeout(() => tooltip.remove(), 300);
    }
}

/** ========================================
RANDOM PROPHECY SYSTEM
======================================== */
function initializeRandomProphecy() {
    const prophecies = [
        "The stars align in forbidden patterns. The old ones stir in their sleep.",
        "A child shall be born under the bleeding moon, marked by destiny's cruel hand.",
        "The last dragon sleeps upon a mountain of bones, dreaming of flame.",
        "In the depths of the Forgotten City, something ancient awakens.",
        "The veil grows thin at the borders of sleep. Dreamwalkers, beware.",
        "The Crimson King sends his visions to those who dare to see.",
        "Blood will flow like rivers, and the harvest will be sorrow.",
        "The chosen one carries a shard of darkness within their heart.",
        "What was lost shall be found, but at a terrible price.",
        "The moon eats the sun, and shadows shall reign eternal."
    ];
    
    let currentIndex = -1;
    
    const seal = document.querySelector('.prophecy-seal');
    if (seal) {
        seal.addEventListener('click', function() {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * prophecies.length);
            } while (newIndex === currentIndex && prophecies.length > 1);
            
            currentIndex = newIndex;
            showPropheticVision(prophecies[currentIndex]);
        });
    }
    
    setTimeout(() => {
        const randomWelcome = "Welcome, seeker of forbidden knowledge. The darkness awaits...";
        console.log('%c⛧ ' + randomWelcome + ' ⛧', 'color: #8b1a1a; font-size: 14px; font-family: MedievalSharp;');
    }, 1500);
}

function showPropheticVision(text) {
    const overlay = document.createElement('div');
    overlay.className = 'prophetic-vision-overlay';
    overlay.innerHTML = `
        <div class="vision-content">
            <div class="vision-symbol">⛧</div>
            <p class="vision-text">${text}</p>
            <div class="vision-symbol">⛧</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('visible'), 10);
    
    setTimeout(() => {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 1000);
    }, 4000);
}

/** ========================================
PARALLAX EFFECTS
======================================== */
function initializeParallax() {
    updateParallax();
}

function updateParallax() {
    const scrollY = window.scrollY;
    const overlay = document.querySelector('.parchment-overlay');
    
    if (overlay) {
        const opacity = 0.3 + (scrollY / 2000);
        overlay.style.opacity = Math.min(opacity, 0.6);
    }
    
    const torches = document.querySelectorAll('.torch-light');
    torches.forEach((torch, index) => {
        const moveX = (scrollY * 0.02 * (index + 1)) % 50;
        const moveY = (scrollY * 0.01 * (index + 1)) % 30;
        torch.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

/** ========================================
SECTION REVEAL ANIMATIONS
======================================== */
function initializeSectionReveal() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
                
                const children = entry.target.querySelectorAll('.creature-card, .quest-notice, .map-location');
                children.forEach((child, index) => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(30px)';
                    child.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                    
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, 50);
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
}

/** ========================================
QUEST BOARD INTERACTIONS
======================================== */
function initializeQuestBoard() {
    const questNotices = document.querySelectorAll('.quest-notice');
    
    questNotices.forEach(notice => {
        notice.addEventListener('click', function() {
            this.classList.add('quest-opened');
        });
    });
}

/** ========================================
KEYBOARD SHORTCUTS
======================================== */
document.addEventListener('keydown', function(e) {
    // 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        smoothScrollTo(0, 500);
    }
    
    // 'B' to scroll to bottom
    if (e.key === 'b' || e.key === 'B') {
        smoothScrollTo(document.body.scrollHeight, 500);
    }
    
    // Escape to close any modals
    if (e.key === 'Escape') {
        hideLocationTooltip();
        hideCreatureStats();
        hideRuneMeaning();
    }
});

/** ========================================
ADDITIONAL AMBIENT EFFECTS
======================================== */

// Add custom styles for dynamically created elements
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    /* Location Tooltip */
    .location-tooltip {
        background: linear-gradient(135deg, rgba(26, 23, 20, 0.98) 0%, rgba(42, 36, 30, 0.98) 100%);
        border: 2px solid var(--gold-primary);
        padding: 1.25rem;
        max-width: 280px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(156, 124, 46, 0.2);
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        pointer-events: none;
    }
    
    .location-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .tooltip-title {
        font-family: 'Cinzel Decorative', serif;
        color: var(--gold-bright);
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
    }
    
    .tooltip-coords {
        font-size: 0.75rem;
        color: var(--text-faded);
        font-family: monospace;
        margin-bottom: 0.75rem;
    }
    
    .tooltip-desc {
        font-size: 0.9rem;
        color: var(--text-primary);
        line-height: 1.5;
        margin-bottom: 0.75rem;
    }
    
    .tooltip-danger {
        display: flex;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: var(--text-faded);
        border-top: 1px solid rgba(156, 124, 46, 0.3);
        padding-top: 0.5rem;
    }
    
    .tooltip-danger .danger-extreme { color: #e53935; }
    .tooltip-danger .danger-high { color: #ff7043; }
    .tooltip-danger .danger-catastrophic { color: #b71c1c; text-shadow: 0 0 5px rgba(183, 28, 28, 0.5); }
    .tooltip-danger .danger-moderate { color: #ffa726; }
    
    /* Creature Stats Panel */
    .creature-stats-panel {
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(180deg, rgba(26, 23, 20, 0.97) 0%, rgba(42, 36, 30, 0.97) 100%);
        border: 1px solid var(--crimson-primary);
        padding: 1rem;
        margin-bottom: 0.5rem;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        z-index: 100;
    }
    
    .creature-stats-panel.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .stats-section h5 {
        font-family: 'Cinzel Decorative', serif;
        color: var(--gold-bright);
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }
    
    .abilities-list {
        list-style: none;
        font-size: 0.85rem;
        color: var(--text-primary);
        margin-bottom: 0.75rem;
    }
    
    .abilities-list li {
        padding: 0.2rem 0;
        color: #7cb342;
    }
    
    .weakness-text {
        font-size: 0.85rem;
        color: #e57373;
        font-style: italic;
    }
    
    /* Rune Meaning Tooltip */
    .rune-meaning-tooltip {
        position: fixed;
        background: rgba(26, 23, 20, 0.95);
        border: 1px solid var(--gold-dark);
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        color: var(--text-primary);
        white-space: nowrap;
        opacity: 0;
        transform: translateY(-5px);
        transition: all 0.3s ease;
        z-index: 1000;
        pointer-events: none;
    }
    
    .rune-meaning-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Prophetic Vision Overlay */
    .prophetic-vision-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 9, 8, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
    }
    
    .prophetic-vision-overlay.visible {
        opacity: 1;
    }
    
    .vision-content {
        text-align: center;
        padding: 3rem;
        max-width: 600px;
    }
    
    .vision-symbol {
        font-size: 3rem;
        color: var(--crimson-bright);
        margin: 1rem 0;
        animation: visionPulse 1.5s ease-in-out infinite;
    }
    
    .vision-text {
        font-family: 'Crimson Text', serif;
        font-size: 1.4rem;
        color: var(--text-glow);
        line-height: 1.8;
        text-align: center;
        text-shadow: 0 0 20px rgba(196, 30, 58, 0.5);
        animation: visionFade 2s ease-in-out;
    }
    
    @keyframes visionPulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
    }
    
    @keyframes visionFade {
        0% { opacity: 0; transform: translateY(20px); }
        50% { opacity: 1; transform: translateY(0); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    /* Section Reveal Animation */
    .section-hidden {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Quest Opened State */
    .quest-notice.quest-opened {
        transform: scale(0.98);
        filter: brightness(0.9);
    }
    
    /* Responsive adjustments for tooltips */
    @media (max-width: 768px) {
        .location-tooltip {
            max-width: calc(100vw - 40px);
            left: 10px !important;
            right: 10px;
        }
    }
`;

document.head.appendChild(additionalStyles);

// Console Easter Egg
console.log(
    '%c⛧ THE BLACK CHRONICLE ⛧ %c\n\n%c "Knowledge is power. Power corrupts. Choose wisely." %c\n\n%cType "t" to scroll to top, "b" for bottom, "ESC" to close popups ',
    'color: #8b1a1a; font-size: 18px; font-weight: bold; font-family: Cinzel Decorative;',
    '',
    'color: #9c7c2e; font-size: 14px; font-family: Crimson Text; font-style: italic;',
    '',
    'color: #c4b8a8; font-size: 12px;'
);