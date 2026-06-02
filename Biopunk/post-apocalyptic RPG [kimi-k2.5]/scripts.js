/**
 * FLORA.EXE - Biopunk RPG Interactive Systems
 * Organic Interface Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initializeCursor();
    initializeContaminationMap();
    initializeMutationCatalog();
    initializeEvolutionTree();
    initializeSurvivalGuide();
    initializeScrollEffects();
    initializeOrganicTwitches();
    initializeContaminationTracker();
    
    console.log('%c FLORA.EXE initialized ', 'background: #39ff14; color: #0a0f0a; font-size: 20px; font-family: monospace');
    console.log('%c Warning: Biological interface active. Do not resist the adaptation. ', 'color: #8b7355; font-style: italic;');
});

/**
 * Custom Parasite Cursor System
 * Tracks mouse with organic lag and trail effect
 */
function initializeCursor() {
    const cursor = document.querySelector('.parasite-cursor');
    const trail = document.querySelector('.cursor-trail');
    
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
        // Disable on touch devices
        if (cursor) cursor.style.display = 'none';
        if (trail) trail.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;
    let isMoving = false;
    let moveTimeout;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    });

    // Smooth cursor following with different easing for cursor and trail
    function animateCursor() {
        // Cursor follows quickly
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        // Trail follows slower
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        // Organic breathing when idle
        if (!isMoving) {
            const breathe = Math.sin(Date.now() / 500) * 2;
            cursor.style.transform = `translate(-50%, -50%) scale(${1 + breathe * 0.05})`;
        } else {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hover effects on interactive elements
    const interactives = document.querySelectorAll('a, button, .specimen-card, .map-tile, .evolution-node, .journal-tab');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            // Play subtle hover sound effect (if audio context available)
            pulseElement(el);
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

/**
 * Contamination Zone Map Generator
 * Creates procedural contamination grid with threat levels
 */
function initializeContaminationMap() {
    const mapGrid = document.getElementById('contamination-map');
    const infoPanel = document.getElementById('zone-info');
    
    if (!mapGrid) return;

    const gridSize = 100; // 10x10 grid
    const contaminationTypes = ['safe', 'low', 'med', 'high', 'extreme'];
    const zoneNames = [
        'The Bone Orchard', 'Spore Gardens', 'Calcified Wastes', 
        'The Breeding Pools', 'Glass Desert', 'Fungal Towers',
        'Rotting Metropolis', 'Quarantine Perimeter', 'The Bloom',
        'Acid Marshes', 'Crystalline Forest', 'Dead Zone Alpha'
    ];

    // Generate tiles
    for (let i = 0; i < gridSize; i++) {
        const tile = document.createElement('div');
        tile.className = 'map-tile';
        tile.dataset.index = i;
        
        // Procedural contamination distribution
        const rand = Math.random();
        let contamination = 'safe';
        if (rand > 0.7) contamination = 'low';
        if (rand > 0.85) contamination = 'med';
        if (rand > 0.95) contamination = 'high';
        if (rand > 0.99) contamination = 'extreme';
        
        // Add some structure markers
        const isStructure = Math.random() > 0.92;
        
        tile.classList.add(`contamination-${contamination}`);
        if (isStructure) tile.classList.add('structure');
        
        // Store zone data
        const zoneData = {
            name: zoneNames[Math.floor(Math.random() * zoneNames.length)],
            level: contamination.toUpperCase(),
            sporeCount: Math.floor(Math.random() * 10000),
            habitability: contamination === 'safe' ? 'Viable' : 
                         contamination === 'extreme' ? 'FATAL' : 'Hazardous'
        };
        
        tile.dataset.zone = JSON.stringify(zoneData);
        
        // Interaction events
        tile.addEventListener('mouseenter', (e) => {
            showZoneInfo(e.target.dataset.zone);
            highlightNeighbors(e.target);
        });
        
        tile.addEventListener('mouseleave', () => {
            removeHighlight();
        });
        
        tile.addEventListener('click', () => {
            tile.style.animation = 'none';
            tile.offsetHeight; // Trigger reflow
            tile.style.animation = 'pulse-glow 0.5s';
        });
        
        mapGrid.appendChild(tile);
    }

    function showZoneInfo(dataString) {
        if (!infoPanel) return;
        const data = JSON.parse(dataString);
        
        infoPanel.innerHTML = `
            <h3>${data.name}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; font-size: 0.9rem;">
                <div>
                    <span style="color: #8b7355; display: block; font-size: 0.7rem;">THREAT LEVEL</span>
                    <span style="color: ${getThreatColor(data.level)}; font-weight: bold;">${data.level}</span>
                </div>
                <div>
                    <span style="color: #8b7355; display: block; font-size: 0.7rem;">SPORE DENSITY</span>
                    <span>${data.sporeCount}/m³</span>
                </div>
                <div style="grid-column: span 2;">
                    <span style="color: #8b7355; display: block; font-size: 0.7rem;">HABITABILITY</span>
                    <span>${data.habitability}</span>
                </div>
            </div>
        `;
    }

    function getThreatColor(level) {
        const colors = {
            'SAFE': '#39ff14',
            'LOW': '#ccff00',
            'MED': '#ff6600',
            'HIGH': '#ff0040',
            'EXTREME': '#ff00ff'
        };
        return colors[level] || '#d4c5b0';
    }

    function highlightNeighbors(target) {
        const index = parseInt(target.dataset.index);
        const neighbors = [index - 1, index + 1, index - 10, index + 10];
        
        neighbors.forEach(n => {
            if (n >= 0 && n < 100) {
                const neighbor = mapGrid.children[n];
                if (neighbor) neighbor.style.opacity = '0.7';
            }
        });
    }

    function removeHighlight() {
        Array.from(mapGrid.children).forEach(tile => {
            tile.style.opacity = '1';
        });
    }
}

/**
 * Mutation Catalog Filter System
 * Handles filtering and specimen interactions
 */
function initializeMutationCatalog() {
    const filterButtons = document.querySelectorAll('.filter-valve');
    const cards = document.querySelectorAll('.specimen-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            cards.forEach((card, index) => {
                const type = card.dataset.type;
                const shouldShow = filter === 'all' || type === filter;
                
                // Staggered animation
                setTimeout(() => {
                    if (shouldShow) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 400);
                    }
                }, index * 50);
            });
            
            // Trigger contamination spike
            spikeContamination();
        });
    });
    
    // Sample extraction buttons
    const sampleButtons = document.querySelectorAll('.sample-btn');
    sampleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.specimen-card');
            extractSample(card);
        });
    });
    
    // Initialize card styles
    cards.forEach(card => {
        card.style.transition = 'opacity 0.4s, transform 0.4s';
    });
}

function extractSample(card) {
    const btn = card.querySelector('.sample-btn');
    const originalText = btn.textContent;
    
    btn.textContent = 'EXTRACTING...';
    btn.disabled = true;
    
    // Visual feedback
    card.style.boxShadow = '0 0 30px #39ff14';
    
    setTimeout(() => {
        btn.textContent = 'SAMPLE ACQUIRED';
        btn.style.background = 'rgba(57, 255, 20, 0.3)';
        
        // Add to "inventory" (console for now)
        const mutationName = card.querySelector('.specimen-name').textContent;
        console.log(`%c Acquired: ${mutationName} `, 'background: #39ff14; color: #0a0f0a;');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
            card.style.boxShadow = '';
        }, 2000);
    }, 1500);
}

/**
 * Evolution Tree System
 * Handles unlocking paths and node interactions
 */
function initializeEvolutionTree() {
    const nodes = document.querySelectorAll('.evolution-node');
    const branches = document.querySelectorAll('.tree-branch');
    
    nodes.forEach(node => {
        node.addEventListener('click', () => {
            if (node.classList.contains('locked')) {
                // Attempt to unlock
                attemptUnlock(node);
            } else {
                // Activate node
                activateNode(node);
            }
        });
        
        // Hover descriptions
        node.addEventListener('mouseenter', () => {
            if (!node.classList.contains('locked')) {
                pulseElement(node.querySelector('.node-core'));
            }
        });
    });
    
    function attemptUnlock(node) {
        const parent = node.dataset.parent;
        const parentNode = document.querySelector(`[data-branch="${parent}"]`);
        
        if (parentNode && parentNode.classList.contains('active')) {
            // Unlock animation
            node.classList.remove('locked');
            node.classList.add('unlocking');
            
            setTimeout(() => {
                node.classList.remove('unlocking');
                node.classList.add('active');
                activateBranch(parentNode, node);
            }, 600);
            
            // Sound effect placeholder
            console.log('%c Evolution path unlocked ', 'color: #00ff9f;');
        } else {
            // Locked shake animation
            node.style.animation = 'none';
            node.offsetHeight;
            node.style.animation = 'shake 0.5s';
        }
    }
    
    function activateNode(node) {
        nodes.forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
        
        // Visual pulse
        const core = node.querySelector('.node-core');
        core.style.boxShadow = '0 0 40px #39ff14, 0 0 80px #00ff9f';
        setTimeout(() => {
            core.style.boxShadow = '';
        }, 1000);
    }
    
    function activateBranch(from, to) {
        // Find and animate connecting branch
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        
        // Simple SVG path highlighting based on data attributes
        const tier = to.dataset.tier;
        const branchIndex = Array.from(nodes).indexOf(to) - 1;
        if (branches[branchIndex]) {
            branches[branchIndex].classList.add('active');
        }
    }
}

/**
 * Survival Guide Tab System
 * Hand-drawn journal interface
 */
function initializeSurvivalGuide() {
    const tabs = document.querySelectorAll('.journal-tab');
    const entries = document.querySelectorAll('.journal-entry');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetEntry = tab.dataset.entry;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Animate entry switch
            entries.forEach(entry => {
                if (entry.dataset.entry === targetEntry) {
                    entry.style.display = 'block';
                    entry.style.animation = 'none';
                    entry.offsetHeight;
                    entry.style.animation = 'fade-in 0.5s';
                    entry.classList.add('active');
                    
                    // Scramble text effect for immersive feel
                    scrambleText(entry.querySelector('h3'));
                } else {
                    entry.classList.remove('active');
                    setTimeout(() => {
                        if (!entry.classList.contains('active')) {
                            entry.style.display = 'none';
                        }
                    }, 100);
                }
            });
        });
    });
}

function scrambleText(element) {
    if (!element) return;
    const originalText = element.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;
    
    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((letter, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iteration >= originalText.length) {
            clearInterval(interval);
        }
        
        iteration += 1 / 3;
    }, 30);
}

/**
 * Scroll Effects Observer
 * Triggers animations when elements enter viewport
 */
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Specific animations based on element type
                if (entry.target.classList.contains('specimen-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                if (entry.target.classList.contains('evolution-node')) {
                    pulseElement(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.specimen-card, .evolution-node, .journal-entry, .hero-content').forEach(el => {
        el.style.opacity = el.classList.contains('hero-content') ? '1' : '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(el);
    });
    
    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.organic-orb');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px) rotate(${scrolled * 0.1}deg)`;
        }
    });
}

/**
 * Organic Twitch System
 * Random subtle movements to make UI feel alive
 */
function initializeOrganicTwitches() {
    // Random stat pod twitch
    setInterval(() => {
        const pods = document.querySelectorAll('.stat-pod');
        const randomPod = pods[Math.floor(Math.random() * pods.length)];
        if (randomPod) {
            randomPod.style.transform = 'translateX(2px)';
            setTimeout(() => {
                randomPod.style.transform = '';
            }, 100);
        }
    }, 5000);
    
    // Random navigation node pulse
    setInterval(() => {
        const nodes = document.querySelectorAll('.nav-node');
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (randomNode) {
            randomNode.style.textShadow = '0 0 10px #39ff14';
            setTimeout(() => {
                randomNode.style.textShadow = '';
            }, 300);
        }
    }, 8000);
    
    // Glitch text occasionally
    setInterval(() => {
        const glitchTexts = document.querySelectorAll('.glitch-text');
        const randomText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
        if (randomText) {
            randomText.style.animation = 'none';
            randomText.offsetHeight;
            randomText.style.animation = '';
        }
    }, 10000);
}

/**
 * Contamination Level Tracker
 * Increases as user scrolls deeper into page
 */
function initializeContaminationTracker() {
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let currentContamination = 0;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const progress = scrolled / maxScroll;
        const level = Math.floor(progress * 100);
        
        if (level > currentContamination) {
            currentContamination = level;
            document.body.dataset.contaminationLevel = 
                level < 30 ? 'low' : 
                level < 60 ? 'medium' : 
                level < 90 ? 'high' : 'extreme';
            
            // Visual feedback at milestones
            if (level === 50 || level === 90) {
                console.log(`%c Contamination Level Critical: ${level}% `, 
                    'background: #ff0040; color: white; font-weight: bold;');
            }
        }
    });
    
    // Resize handler
    window.addEventListener('resize', () => {
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    });
}

/**
 * Utility: Pulse element effect
 */
function pulseElement(element) {
    if (!element) return;
    element.style.transition = 'transform 0.2s';
    element.style.transform = 'scale(1.05)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Utility: Contamination spike
 */
function spikeContamination() {
    document.body.style.filter = 'hue-rotate(90deg) saturate(2)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 300);
}

// Add shake animation to stylesheet dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Easter egg: Konami code for "Purification"
let konamiCode = [];
const correctCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === correctCode.join(',')) {
        document.body.style.filter = 'sepia(0) saturate(1) hue-rotate(0deg)';
        document.querySelectorAll('.spore-layer').forEach(layer => {
            layer.style.opacity = '0';
        });
        console.log('%c PURIFICATION SEQUENCE INITIATED ', 'background: #00ffff; color: #000; font-size: 16px;');
        
        // Reset after 5 seconds
        setTimeout(() => {
            document.body.style.filter = '';
            document.querySelectorAll('.spore-layer').forEach(layer => {
                layer.style.opacity = '';
            });
        }, 5000);
    }
});