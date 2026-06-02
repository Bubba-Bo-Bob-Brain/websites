/**
 * Codex Tenebris - The Dark Prophecies
 * Immersive Medieval Dark Fantasy Website
 * JavaScript: Animations, Interactions, and Atmospheric Effects
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initYear();
    initCustomCursor();
    initParticles();
    initWaxSeal();
    initProphecyReveal();
    initNavigation();
    initScrollAnimations();
    initMapInteractions();
    initBestiaryCards();
    initTorchlightEffects();
    initAudio();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait = 20) {
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

/**
 * Random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Linear interpolation
 */
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ============================================
// CUSTOM CURSOR
// ============================================

function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const speed = 0.15;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX = lerp(cursorX, mouseX, speed);
        cursorY = lerp(cursorY, mouseY, speed);
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .wax-seal, .creature-card, .region, .map-features circle');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

// ============================================
// FLOATING PARTICLES (Ethereal Dust)
// ============================================

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random positioning and timing
    const left = randomInt(5, 95);
    const delay = randomInt(0, 15);
    const duration = randomInt(12, 20);
    const size = randomInt(1, 4);
    const opacity = randomInt(3, 7) / 10;
    
    particle.style.left = `${left}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.opacity = opacity;
    
    // Alternate colors
    const colors = ['#c9a227', '#8b0000', '#2a4a2a', '#4a2a4a'];
    particle.style.backgroundColor = colors[randomInt(0, colors.length - 1)];
    
    container.appendChild(particle);
}

// ============================================
// WAX SEAL INTERACTION
// ============================================

function initWaxSeal() {
    const waxSeal = document.getElementById('wax-seal');
    if (!waxSeal) return;

    let isBroken = false;
    const sealSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='); // Placeholder

    waxSeal.addEventListener('click', () => {
        if (isBroken) return;
        
        isBroken = true;
        
        // Break animation
        waxSeal.style.transition = 'all 0.3s ease';
        waxSeal.style.transform = 'scale(0.8) rotate(15deg)';
        waxSeal.style.opacity = '0.7';
        
        // Create cracking effect
        createCrackEffect(waxSeal);
        
        // Reveal additional prophecy text
        const prophecyText = document.getElementById('prophecy-text');
        const additionalText = document.createElement('p');
        additionalText.innerHTML = `<br><em>[The seal is broken. Hidden text revealed:]</em><br><br>
            And when the seventh seal is broken, the Four Riders shall descend upon the mortal realm. 
            The pale horse brings death, the red horse brings war, the black horse brings famine, 
            and the white horse brings conquest. The chosen one must gather the three relics: 
            the Sword of Dawn, the Shield of Twilight, and the Crown of Shadows. Only then can 
            the Dark One be bound once more...`;
        additionalText.style.opacity = '0';
        additionalText.style.transform = 'translateY(20px)';
        additionalText.style.animation = 'text-reveal 1.5s ease forwards';
        additionalText.style.animationDelay = '0.5s';
        prophecyText.appendChild(additionalText);
        
        // Play sound (if available)
        if (sealSound) {
            sealSound.play().catch(() => {});
        }
        
        // Add visual feedback
        setTimeout(() => {
            waxSeal.style.transform = 'scale(1) rotate(0deg)';
            waxSeal.querySelector('i').textContent = 'fa-times';
        }, 500);
    });
}

function createCrackEffect(element) {
    const rect = element.getBoundingClientRect();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '100';
    
    const lines = [
        { x1: 20, y1: 20, x2: 40, y2: 40 },
        { x1: 40, y1: 20, x2: 20, y2: 40 },
        { x1: 40, y1: 40, x2: 60, y2: 20 },
    ];
    
    lines.forEach(line => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`);
        path.setAttribute('stroke', '#4a0000');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.style.opacity = '0';
        path.style.animation = 'fade-in 0.2s ease forwards';
        svg.appendChild(path);
    });
    
    element.appendChild(svg);
    
    setTimeout(() => svg.remove(), 1000);
}

// ============================================
// PROPHECY TEXT REVEAL (Typewriter Effect)
// ============================================

function initProphecyReveal() {
    const prophecyText = document.getElementById('prophecy-text');
    if (!prophecyText) return;

    // Optional: Add typewriter effect on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                prophecyText.classList.add('revealed');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(prophecyText);
}

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', debounce(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }));
}

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.creature-card, .section-header, .map-frame');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Stagger animation for bestiary grid
    const cards = document.querySelectorAll('.creature-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ============================================
// MAP INTERACTIONS
// ============================================

function initMapInteractions() {
    const regions = document.querySelectorAll('.region');
    const tooltip = document.getElementById('map-tooltip');
    const mapContent = document.getElementById('map-content');

    const regionData = {
        'north': {
            name: 'Frostfang Mountains',
            description: 'A chain of icy peaks inhabited by frost giants and ancient dragons. The passes are treacherous and said to be haunted by the ghosts of failed adventurers.',
            climate: 'Alpine/Tundra',
            dangers: ['Frost Giants', 'Ice Wyrms', 'Avalanches']
        },
        'central': {
            name: 'The Blackwood',
            description: 'An ancient, enchanted forest where time flows differently. Home to elves, druids, and creatures older than civilization.',
            climate: 'Temperate Rainforest',
            dangers: ['Blighted Creatures', 'Fey Tricksters', 'Ancient Curses']
        },
        'south': {
            name: 'Marsh of Sighs',
            description: 'A vast, mist-shrouded swamp where the drowned rise from the depths. The air is thick with disease and despair.',
            climate: 'Swamp/Marsh',
            dangers: ['Will-o\'-Wisps', 'Lizardfolk', 'Bog Mummies']
        },
        'eastern': {
            name: 'The Shattered Wastes',
            description: 'A frozen desert of black ice and broken stone. Few survive the howling winds and the things that hunt in the blizzards.',
            climate: 'Polar Desert',
            dangers: ['Wendigos', 'Frost Wraiths', 'White Walkers']
        },
        'western': {
            name: 'Desert of Whispers',
            description: 'A burning sand sea where the dunes shift with the screams of the damned. Genies and worse things dwell in the buried cities.',
            climate: 'Hot Desert',
            dangers: ['Sand wyrms', 'Dune stalkers', 'Madness']
        }
    };

    regions.forEach(region => {
        region.addEventListener('mouseenter', (e) => {
            const regionId = region.getAttribute('data-region');
            const data = regionData[regionId];
            
            if (data) {
                tooltip.innerHTML = `
                    <h4 style="color: #c9a227; margin-bottom: 8px; font-family: 'Cinzel', serif;">${data.name}</h4>
                    <p style="margin-bottom: 8px; line-height: 1.4;">${data.description}</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px;">
                        <span style="color: #c9a227; font-size: 0.85rem;">${data.climate}</span>
                    </div>
                    <div style="margin-top: 8px; font-size: 0.85rem;">
                        <strong>Dangers:</strong> ${data.dangers.join(', ')}
                    </div>
                `;
                
                const rect = region.getBoundingClientRect();
                const containerRect = mapContent.getBoundingClientRect();
                
                tooltip.style.left = `${rect.left - containerRect.left + 20}px`;
                tooltip.style.top = `${rect.top - containerRect.top - 10}px`;
                tooltip.classList.add('visible');
            }
        });

        region.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

    // Map feature tooltips
    const features = document.querySelectorAll('.map-features circle');
    const featureData = {
        'city': {
            name: 'Ancient City',
            description: 'Once-great cities now fallen to ruin or overrun by darkness. Some still hold treasures and forgotten knowledge.'
        },
        'ruin': {
            name: 'Ruin',
            description: 'Crumbling remnants of a forgotten age. Explorers often find both danger and valuable artifacts in these places.'
        },
        'dungeon': {
            name: 'Dungeon',
            description: 'Dungeons are places of darkness where monsters dwell and prisoners are kept. Many adventurers seek them out for glory and treasure.'
        }
    };

    features.forEach(feature => {
        feature.addEventListener('mouseenter', (e) => {
            const type = feature.classList[1]; // city, ruin, or dungeon
            const data = featureData[type];
            
            if (data) {
                tooltip.innerHTML = `
                    <h4 style="color: #c9a227; margin-bottom: 8px; font-family: 'Cinzel', serif;">${data.name}</h4>
                    <p style="line-height: 1.4;">${data.description}</p>
                `;
                
                const rect = feature.getBoundingClientRect();
                const containerRect = mapContent.getBoundingClientRect();
                
                tooltip.style.left = `${rect.left - containerRect.left + 15}px`;
                tooltip.style.top = `${rect.top - containerRect.top - 40}px`;
                tooltip.classList.add('visible');
            }
        });

        feature.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

    // Click on region to zoom (simple implementation)
    let isZoomed = false;
    let currentZoom = 1;

    mapContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('region')) {
            if (!isZoomed) {
                // Zoom to region
                const region = e.target;
                const bbox = region.getBBox();
                const viewBox = `1000 600`;
                
                // Calculate zoom to fit region with padding
                const padding = 50;
                const scaleX = 1000 / (bbox.width + padding * 2);
                const scaleY = 600 / (bbox.height + padding * 2);
                const scale = Math.min(scaleX, scaleY, 2); // Max 2x zoom
                
                const newX = bbox.x + bbox.width / 2 - (1000 / scale) / 2;
                const newY = bbox.y + bbox.height / 2 - (600 / scale) / 2;
                
                mapContent.querySelector('.ancient-map').setAttribute('viewBox', `${newX} ${newY} ${1000/scale} ${600/scale}`);
                isZoomed = true;
                currentZoom = scale;
                
                // Add reset button
                addResetButton();
            }
        }
    });
}

function addResetButton() {
    if (document.getElementById('map-reset')) return;
    
    const mapFrame = document.querySelector('.map-frame');
    const resetBtn = document.createElement('button');
    resetBtn.id = 'map-reset';
    resetBtn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> Reset View';
    resetBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(10, 10, 10, 0.8);
        border: 1px solid #c9a227;
        color: #c9a227;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Cinzel', serif;
        z-index: 10;
        transition: all 0.3s ease;
    `;
    
    resetBtn.addEventListener('mouseenter', () => {
        resetBtn.style.background = 'rgba(201, 162, 39, 0.2)';
    });
    
    resetBtn.addEventListener('mouseleave', () => {
        resetBtn.style.background = 'rgba(10, 10, 10, 0.8)';
    });
    
    resetBtn.addEventListener('click', () => {
        const svg = mapFrame.querySelector('.ancient-map');
        svg.setAttribute('viewBox', '0 0 1000 600');
        isZoomed = false;
        resetBtn.remove();
    });
    
    mapFrame.appendChild(resetBtn);
}

// ============================================
// BESTIARY CARD ENHANCEMENTS
// ============================================

function initBestiaryCards() {
    const cards = document.querySelectorAll('.creature-card');
    
    cards.forEach(card => {
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });

        // Add glow effect on hover
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.creature-icon');
            icon.style.filter = 'drop-shadow(0 0 25px rgba(201, 162, 39, 0.9))';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.creature-icon');
            icon.style.filter = 'drop-shadow(0 0 10px rgba(201, 162, 39, 0.5))';
        });
    });
}

// ============================================
// TORCHLIGHT EFFECTS
// ============================================

function initTorchlightEffects() {
    const torchElements = document.querySelectorAll('.section, .header, .footer');
    
    torchElements.forEach(el => {
        el.classList.add('torchlit');
    });

    // Dynamic flickering based on scroll position
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollDelta = Math.abs(scrollY - lastScrollY);
        
        torchElements.forEach(el => {
            const intensity = 0.3 + (scrollDelta / 100);
            el.style.setProperty('--torch-intensity', Math.min(intensity, 0.8));
        });
        
        lastScrollY = scrollY;
    });

    // Mouse-following torchlight effect
    document.addEventListener('mousemove', debounce((e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        torchElements.forEach(el => {
            el.style.setProperty('--mouse-x', x);
            el.style.setProperty('--mouse-y', y);
        });
    }, 50));
}

// ============================================
// AMBIENT AUDIO
// ============================================

function initAudio() {
    const audioElement = document.getElementById('ambient-sound');
    if (!audioElement) return;

    // Check for saved preference
    const audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
    
    // Create audio context for better control
    let audioContext;
    let source;
    let gainNode;

    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            source = audioContext.createMediaElementSource(audioElement);
            gainNode = audioContext.createGain();
            
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            gainNode.gain.value = 0.3; // Low volume for ambient
        }
    }

    // Play on first user interaction (required by browsers)
    const playAudio = () => {
        if (!audioEnabled) return;
        
        initAudioContext();
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        audioElement.play().catch(() => {
            console.log('Audio autoplay prevented');
        });
        
        // Remove listeners
        document.removeEventListener('click', playAudio);
        document.removeEventListener('keydown', playAudio);
    };

    document.addEventListener('click', playAudio);
    document.addEventListener('keydown', playAudio);

    // Create audio toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(10, 10, 10, 0.8);
        border: 2px solid #c9a227;
        color: #c9a227;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    
    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.transform = 'scale(1.1)';
        toggleBtn.style.background = 'rgba(201, 162, 39, 0.2)';
    });
    
    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.transform = 'scale(1)';
        toggleBtn.style.background = 'rgba(10, 10, 10, 0.8)';
    });
    
    toggleBtn.addEventListener('click', () => {
        if (audioElement.paused) {
            initAudioContext();
            audioElement.play();
            toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            localStorage.setItem('audioEnabled', 'true');
        } else {
            audioElement.pause();
            toggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            localStorage.setItem('audioEnabled', 'false');
        }
    });
    
    document.body.appendChild(toggleBtn);

    // Set initial state
    if (audioEnabled) {
        toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// ============================================
// ADDITIONAL EFFECTS
// ============================================

// Dynamic year in footer
function initYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Symbol floating animation enhancement
document.querySelectorAll('.symbol').forEach((symbol, index) => {
    // Add subtle rotation
    setInterval(() => {
        const rotation = randomInt(-10, 10);
        symbol.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 5}px) rotate(${rotation}deg)`;
    }, 3000);
});

// Parallax effect for background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.background-effects');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Easter egg: Konami code unlocks special effect
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Flash the screen with mystical energy
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(139, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
        z-index: 9999;
        pointer-events: none;
        animation: flash-fade 2s ease forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flash-fade {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
        style.remove();
    }, 2000);
    
    // Add temporary golden glow to all elements
    document.querySelectorAll('*').forEach(el => {
        el.style.transition = 'filter 0.5s ease';
        el.style.filter = 'drop-shadow(0 0 10px rgba(201, 162, 39, 0.5))';
        
        setTimeout(() => {
            el.style.filter = '';
        }, 2000);
    });
}

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.creature-icon, .symbol, .particle');
    
    if (document.hidden) {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Console Easter egg
console.log('%c⚔️ Welcome, traveler. ⚔️', 'color: #c9a227; font-size: 20px; font-weight: bold;');
console.log('%cYou have found the hidden console message. The ancient ones are pleased.', 'color: #8b0000; font-style: italic;');
console.log('%cTry the Konami code for a surprise...', 'color: #2a4a2a;');