// ==================== DOCUMENT READY ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initCustomCursor();
    initScrollAnimations();
    initMutationCards();
    initZoneMap();
    initTechTree();
    initParticleEffects();
    initNavHighlighting();
});

// ==================== CUSTOM CURSOR (Organic Vein Trail) ====================
let cursor = null;
let cursorTrail = [];
const trailLength = 10;

function initCustomCursor() {
    // Create cursor element
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
        const trailDot = document.createElement('div');
        trailDot.className = 'cursor-trail-dot';
        document.body.appendChild(trailDot);
        cursorTrail.push(trailDot);
    }

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Update cursor position
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        // Update trail dots with delay
        cursorTrail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                dot.style.opacity = 1 - (index * 0.1);
                dot.style.transform = `scale(${1 - (index * 0.1)})`;
            }, index * 30);
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorTrail.forEach(dot => dot.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorTrail.forEach(dot => dot.style.opacity = '1');
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .mutation-card, .zone-hotspot, .tech-node');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// ==================== SCROLL ANIMATIONS (Fade-In on Scroll) ====================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .mutation-card, .tech-node, .survival-entry, .zone-info-panel');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.classList.add('animate-hidden');
        observer.observe(el);
    });
}

// ==================== MUTATION CATALOG (Expand on Click) ====================
function initMutationCards() {
    const mutationCards = document.querySelectorAll('.mutation-card');

    mutationCards.forEach(card => {
        card.addEventListener('click', () => {
            const isExpanded = card.classList.contains('expanded');

            // Close all other cards
            mutationCards.forEach(c => c.classList.remove('expanded'));

            // Toggle current card
            if (!isExpanded) {
                card.classList.add('expanded');

                // Add detailed lore (example)
                if (!card.querySelector('.mutation-lore')) {
                    const lore = document.createElement('div');
                    lore.className = 'mutation-lore';

                    const mutationType = card.dataset.mutation;
                    let loreText = '';

                    switch (mutationType) {
                        case 'chitinous-plating':
                            loreText = 'Origin: First observed in the Bone Yards. Subjects exposed to high levels of calcium-rich dust developed this mutation. Warning: Prolonged use may lead to complete skeletal restructuring.';
                            break;
                        case 'neuro-toxins':
                            loreText = 'Origin: A byproduct of the Green Rot. The venom is highly adaptive, evolving to counter prey resistances. Warning: Overuse may cause neural degradation.';
                            break;
                        case 'photosynthetic-skin':
                            loreText = 'Origin: Mutations from the Neon Spire. Allows survival in sunlit areas but causes severe weakness in darkness. Warning: Prolonged darkness may lead to organ failure.';
                            break;
                        case 'cybernetic-parasite':
                            loreText = 'Origin: Unknown. The parasite appears to be of artificial origin. Warning: The parasite may eventually consume the host entirely.';
                            break;
                        default:
                            loreText = 'A mysterious mutation with unknown origins. Study with caution.';
                    }

                    lore.innerHTML = `<p>${loreText}</p>`;
                    card.appendChild(lore);
                }
            }
        });
    });
}

// ==================== CONTAMINATION ZONE MAP (Hotspot Interactions) ====================
function initZoneMap() {
    const hotspots = document.querySelectorAll('.zone-hotspot');
    const infoPanel = document.querySelector('.zone-info-panel');
    const zoneName = infoPanel.querySelector('.zone-name');
    const zoneDesc = infoPanel.querySelector('.zone-desc');

    const zoneData = {
        'the-green-rot': {
            name: 'THE GREEN ROT',
            desc: 'A once-fertile region now consumed by a sentient fungal network. The air is thick with spores, and the ground pulses with bioluminescent veins. Survivors report hearing whispers from the mycelium.'
        },
        'the-bone-yards': {
            name: 'THE BONE YARDS',
            desc: 'A graveyard of failed experiments. The skeletal remains of both man and machine litter the landscape. Strange, half-mechanical creatures stalk the ruins, scavenging for fresh bone.'
        },
        'neon-spire': {
            name: 'NEON SPIRE',
            desc: 'A towering structure of unknown origin, covered in glowing organic circuits. Some believe it to be a beacon for an ancient intelligence. Others say it’s a prison.'
        },
        'the-black-lung': {
            name: 'THE BLACK LUNG',
            desc: 'A cavern system filled with toxic gases. The walls breathe, and the air itself seems alive. Few who enter return unchanged.'
        }
    };

    hotspots.forEach(hotspot => {
        const zoneId = hotspot.dataset.zone;

        hotspot.addEventListener('mouseenter', () => {
            const data = zoneData[zoneId];
            zoneName.textContent = data.name;
            zoneDesc.textContent = data.desc;
            infoPanel.style.opacity = '1';
        });

        hotspot.addEventListener('mouseleave', () => {
            infoPanel.style.opacity = '0.7';
        });

        hotspot.addEventListener('click', () => {
            const data = zoneData[zoneId];
            zoneName.textContent = data.name;
            zoneDesc.textContent = data.desc;
            infoPanel.style.opacity = '1';
        });
    });
}

// ==================== TECH TREE (Expand/Collapse Nodes) ====================
function initTechTree() {
    const nodes = document.querySelectorAll('.tech-node');
    const connections = document.querySelector('.tech-connections');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const tier = node.dataset.tier;
            const parentId = node.dataset.parent;

            if (tier === '1') return; // Root node cannot be collapsed

            const isExpanded = node.classList.contains('expanded');

            if (isExpanded) {
                node.classList.remove('expanded');
                // Hide child nodes
                const childNodes = document.querySelectorAll(`.tech-node[data-parent="${node.querySelector('h4').textContent}"]`);
                childNodes.forEach(child => {
                    child.style.display = 'none';
                });
            } else {
                node.classList.add('expanded');
                // Show child nodes
                const childNodes = document.querySelectorAll(`.tech-node[data-parent="${node.querySelector('h4').textContent}"]`);
                childNodes.forEach(child => {
                    child.style.display = 'flex';
                });
            }
        });
    });

    // Initially hide tier 3 nodes
    document.querySelectorAll('.tech-node[data-tier="3"]').forEach(node => {
        node.style.display = 'none';
    });
}

// ==================== PARTICLE EFFECTS (Dynamic Background) ====================
function initParticleEffects() {
    const particleContainer = document.querySelector('.particle-floaters');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';

    // Random size and position
    const size = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;
    const color = Math.random() > 0.5 ? 'var(--color-neon-green)' : 'var(--color-neon-cyan)';

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 5}px ${color}`;
    particle.style.animation = `float ${duration}s infinite linear ${delay}s`;
    particle.style.opacity = Math.random() * 0.5 + 0.2;

    container.appendChild(particle);

    // Make particles react to mouse movement
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const dx = (mouseX - 0.5) * 20;
        const dy = (mouseY - 0.5) * 20;

        particle.style.transform = `translate(${dx}px, ${dy}px)`;
    });
}

// ==================== NAV HIGHLIGHTING (Active Section) ====================
function initNavHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== ADDITIONAL ANIMATIONS ====================
// Add breathing effect to mutation cards
const mutationCards = document.querySelectorAll('.mutation-card');
mutationCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add pulsing effect to tech nodes
const techNodes = document.querySelectorAll('.tech-node');
techNodes.forEach((node, index) => {
    node.style.animation = `nodePulse 3s infinite alternate ${index * 0.2}s`;
});

// Add flicker effect to zone map
const zoneMap = document.querySelector('.zone-map');
zoneMap.style.animation = 'mapFlicker 5s infinite';

// ==================== KEYFRAME ANIMATIONS (Added via JS) ====================
const style = document.createElement('style');
style.textContent = `
    /* Custom Cursor */
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--color-neon-green);
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
        box-shadow: 0 0 10px var(--color-neon-green);
    }

    .cursor-hover {
        transform: scale(1.5);
        background: var(--color-neon-cyan);
        box-shadow: 0 0 20px var(--color-neon-cyan);
    }

    .cursor-trail-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-neon-green);
        pointer-events: none;
        z-index: 9998;
        mix-blend-mode: difference;
        opacity: 0;
        transition: opacity 0.1s ease, transform 0.1s ease;
    }

    /* Scroll Animations */
    .animate-hidden {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Mutation Card Expanded State */
    .mutation-card.expanded {
        grid-column: 1 / -1;
        background: rgba(0, 0, 0, 0.9);
        border-color: var(--color-neon-cyan);
    }

    .mutation-lore {
        margin-top: var(--spacing-sm);
        padding-top: var(--spacing-sm);
        border-top: 1px solid rgba(0, 255, 157, 0.3);
        color: var(--color-gray);
        font-size: 0.9rem;
        line-height: 1.5;
    }

    /* Tech Node Pulse */
    @keyframes nodePulse {
        0% {
            box-shadow: 0 0 5px var(--color-neon-cyan);
        }
        100% {
            box-shadow: 0 0 20px var(--color-neon-cyan);
        }
    }

    /* Map Flicker */
    @keyframes mapFlicker {
        0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 10px rgba(178, 0, 255, 0.5));
        }
        50% {
            opacity: 0.9;
            filter: drop-shadow(0 0 5px rgba(178, 0, 255, 0.3));
        }
    }

    /* Floating Particles */
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
        }
    }

    /* Active Nav Link */
    .nav-link.active {
        color: var(--color-neon-green);
        text-shadow: var(--glow-intensity) var(--color-neon-green);
    }

    .nav-link.active::after {
        width: 100%;
        background: var(--color-neon-green);
    }
`;
document.head.appendChild(style);