// ==========================================
// FLESHCODE — Biopunk RPG Interface Scripts
// ==========================================

// ---- PARTICLE CANVAS ----
const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');

function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.7 ? '#00ffaa' : (Math.random() > 0.5 ? '#9933ff' : '#4a9e2a');
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;

        if (this.y < -10 || this.x < -10 || this.x > particleCanvas.width + 10 || this.y > particleCanvas.height + 10) {
            this.reset();
        }
    }

    draw() {
        const currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = this.color;
        pCtx.globalAlpha = currentOpacity;
        pCtx.fill();
        pCtx.globalAlpha = 1;
    }
}

const particles = [];
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ---- STAT COUNTER ANIMATION ----
function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    statValues.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ---- MUTATION CATALOG DATA & RENDERING ----
const mutations = [
    {
        id: 'MUT-001',
        name: 'Thornwall',
        tier: 'tier1',
        desc: 'Subcutaneous keratin plates erupt along the forearms. Grants natural armor against piercing attacks but restricts fine motor movement.',
        tags: ['Hazard', 'Armor'],
        icon: '🌿'
    },
    {
        id: 'MUT-014',
        name: 'Mycelium Link',
        tier: 'tier2',
        desc: 'Fungal network integrates with the nervous system. Enables spore communication with nearby organisms. Risk of identity bleed.',
        tags: ['Rare', 'Communication'],
        icon: '🍄'
    },
    {
        id: 'MUT-042',
        name: 'Hemoglyph',
        tier: 'tier3',
        desc: 'Blood vessels migrate to the surface of the skin, forming luminous patterns. Extreme pain during manifestation. Visible in darkness.',
        tags: ['Hazard', 'Rare'],
        icon: '🩸'
    },
    {
        id: 'MUT-007',
        name: 'Chitin Shell',
        tier: 'tier1',
        desc: 'Exoskeletal plating forms over the ribcage and spine. Significant weight gain. Immune to small arms fire.',
        tags: ['Benefit', 'Armor'],
        icon: '🪲'
    },
    {
        id: 'MUT-023',
        name: 'Spore Lung',
        tier: 'tier2',
        desc: 'Respiratory system adapts to process toxic atmospheres. Can breathe in contaminated zones. Coughs out clouds of hallucinogenic spores.',
        tags: ['Benefit', 'Hazard'],
        icon: '🫁'
    },
    {
        id: 'MUT-089',
        name: 'Bile Duct',
        tier: 'tier3',
        desc: 'Acid-producing gland replaces left kidney. Vomiting is corrosive. Uncontrollable at high stress. Neighbors report structural damage.',
        tags: ['Hazard'],
        icon: '☠️'
    },
    {
        id: 'MUT-015',
        name: 'Rootwalker',
        tier: 'tier1',
        desc: 'Toe bones elongate and split. Feet become root-like appendages. Perfect balance on any terrain. Standing still too long is inadvisable.',
        tags: ['Benefit', 'Movement'],
        icon: '🌱'
    },
    {
        id: 'MUT-051',
        name: 'Synapse Storm',
        tier: 'tier3',
        desc: 'Neural pathways fire chaotically. Enhanced reflexes and predictive cognition. Side effects include nosebleeds, seizures, and prophetic nightmares.',
        tags: ['Rare', 'Benefit'],
        icon: '⚡'
    },
    {
        id: 'MUT-030',
        name: 'Photoskin',
        tier: 'tier2',
        desc: 'Melanin production reverses. Skin becomes translucent, revealing bioluminescent organs beneath. Vulnerable to UV. Beautiful in darkness.',
        tags: ['Rare', 'Movement'],
        icon: '✨'
    }
];

const mutationGrid = document.getElementById('mutationGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderMutations(filter = 'all') {
    mutationGrid.innerHTML = '';
    const filtered = filter === 'all' ? mutations : mutations.filter(m => m.tier === filter);

    filtered.forEach((mut, index) => {
        const card = document.createElement('div');
        card.className = `mutation-card ${mut.tier}`;
        card.style.animationDelay = `${index * 0.1}s`;

        const tagHTML = mut.tags.map(tag => {
            let cls = '';
            if (tag === 'Hazard') cls = 'hazard';
            if (tag === 'Benefit') cls = 'benefit';
            if (tag === 'Rare') cls = 'rare';
            return `<span class="mutation-tag ${cls}">${tag}</span>`;
        }).join('');

        card.innerHTML = `
            <div class="mutation-icon">${mut.icon}</div>
            <div class="mutation-id">${mut.id}</div>
            <div class="mutation-name"><span>${mut.name.split('')[0]}</span>${mut.name.slice(1)}</div>
            <div class="mutation-desc">${mut.desc}</div>
            <div class="mutation-tags">${tagHTML}</div>
        `;

        mutationGrid.appendChild(card);
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMutations(btn.getAttribute('data-filter'));
    });
});

renderMutations();

// ---- TECH TREE DATA & RENDERING ----
const techNodes = [
    {
        icon: '🧬',
        name: 'Genetic Recombination',
        type: 'FOUNDATION',
        desc: 'Basic splicing suite. Unlocks first-generation bio-modifications. Pain: moderate.',
        cost: 'COST: 3 GENOME POINTS',
        color: '#00ffaa',
        glowColor: 'rgba(0, 255, 170, 0.05)'
    },
    {
        icon: '💉',
        name: 'Adrenal Cascade',
        type: 'COMBAT',
        desc: 'Overclocks the adrenal system. 3x reaction speed for 60 seconds. Then you crash hard.',
        cost: 'COST: 5 GENOME POINTS',
        color: '#ffaa00',
        glowColor: 'rgba(255, 170, 0, 0.05)'
    },
    {
        icon: '🦠',
        name: 'Mycelium Integration',
        type: 'STEALTH',
        desc: 'Fungal colonies colonize your skin. Camouflage in fungal environments. You smell terrible.',
        cost: 'COST: 7 GENOME POINTS',
        color: '#9933ff',
        glowColor: 'rgba(153, 51, 255, 0.05)'
    },
    {
        icon: '🫀',
        name: 'Dual Hearts',
        type: 'SURVIVAL',
        desc: 'Second heart grows from the original. If one fails, the other takes over. You can feel it beating behind your ear.',
        cost: 'COST: 9 GENOME POINTS',
        color: '#cc3300',
        glowColor: 'rgba(204, 51, 0, 0.05)'
    },
    {
        icon: '👁️',
        name: 'Compound Optics',
        type: 'AWARENESS',
        desc: 'Eyes split into multi-lens configurations. 270° vision. Colors you cannot name. Sunlight makes you weep.',
        cost: 'COST: 6 GENOME POINTS',
        color: '#ff44aa',
        glowColor: 'rgba(255, 68, 170, 0.05)'
    },
    {
        icon: '🦴',
        name: 'Endoskeletal Armor',
        type: 'DEFENSE',
        desc: 'Bone density increases 10x. Ribs fuse into a natural cuirass. Breathing becomes a conscious act.',
        cost: 'COST: 8 GENOME POINTS',
        color: '#00ffaa',
        glowColor: 'rgba(0, 255, 170, 0.05)'
    },
    {
        icon: '🧠',
        name: 'Hive Synapse',
        type: 'PSYCHOLOGY',
        desc: 'Brain develops secondary neural cluster. Can link with other Hive Synapse users. Individuality is... negotiable.',
        cost: 'COST: 12 GENOME POINTS',
        color: '#9933ff',
        glowColor: 'rgba(153, 51, 255, 0.05)'
    }
];

const techTree = document.getElementById('techTree');

function renderTechTree() {
    techNodes.forEach((node, index) => {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'tech-node';
        nodeEl.style.setProperty('--node-color', node.color);
        nodeEl.style.setProperty('--node-glow-color', node.glowColor);
        nodeEl.style.animationDelay = `${index * 0.15}s`;

        nodeEl.innerHTML = `
            <div class="tech-node-icon">${node.icon}</div>
            <div class="tech-node-info">
                <div class="tech-node-name">${node.name}</div>
                <div class="tech-node-type" style="color: ${node.color}">${node.type}</div>
                <div class="tech-node-desc">${node.desc}</div>
            </div>
            <div class="tech-node-cost">${node.cost}</div>
        `;

        techTree.appendChild(nodeEl);

        if (index < techNodes.length - 1) {
            const connector = document.createElement('div');
            connector.className = 'tech-connector';
            connector.style.background = `linear-gradient(180deg, ${node.color}33, transparent)`;
            techTree.appendChild(connector);
        }
    });
}

renderTechTree();

// ---- ZONE MAP INTERACTIVITY ----
const zoneMap = document.getElementById('zoneMap');
const zonePoints = zoneMap.querySelectorAll('.zone-point');

zonePoints.forEach(point => {
    point.style.cursor = 'pointer';
    point.addEventListener('mouseenter', () => {
        point.style.filter = 'url(#glow) brightness(1.5)';
    });
    point.addEventListener('mouseleave', () => {
        point.style.filter = 'url(#glow)';
    });
});

// ---- SCROLL REVEAL ANIMATIONS ----
const revealElements = document.querySelectorAll('.mutation-card, .tech-node, .guide-entry');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ---- SMOOTH SCROLL FOR NAVIGATION ----
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- BIOSCANNER ANIMATION ----
function animateBioscanner() {
    const scanners = document.querySelectorAll('.bioscanner, .bioscanner-small');
    scanners.forEach(scanner => {
        const bar = scanner.querySelector('::after') ? scanner : scanner;
        // The CSS handles the sweep animation via ::after
    });
}

// ---- HERO GLITCH TEXT ----
const glitchElements = document.querySelectorAll('.glitch');

glitchElements.forEach(el => {
    setInterval(() => {
        if (Math.random() > 0.92) {
            el.style.textShadow = `2px 0 #00ffaa, -2px 0 #cc3300`;
            setTimeout(() => {
                el.style.textShadow = 'none';
            }, 100);
        }
    }, 200);
});

// ---- GUIDE ENTRY SKETCH ANIMATIONS ----
const guideSketches = document.querySelectorAll('.guide-entry-sketch svg');

guideSketches.forEach(svg => {
    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.animation = `drawPath 2s ease forwards ${Math.random() * 0.5}s`;
    });
});

// Add keyframe for drawing paths
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes drawPath {
        to {
            stroke-dashoffset: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// ---- AMBIENT SOUND VISUALIZATION (optional visual) ----
function createFloatingOrbs() {
    const heroParticles = document.getElementById('heroParticles');
    if (!heroParticles) return;

    for (let i = 0; i < 6; i++) {
        const orb = document.createElement('div');
        orb.style.cssText = `
            position: absolute;
            width: ${Math.random() * 100 + 50}px;
            height: ${Math.random() * 100 + 50}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,255,170,0.06) 0%, transparent 70%);
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: orbFloat ${Math.random() * 10 + 10}s ease-in-out infinite alternate;
            pointer-events: none;
        `;
        heroParticles.appendChild(orb);
    }
}

createFloatingOrbs();

// ---- NAVIGATION BACKGROUND ON SCROLL ----
const navContainer = document.querySelector('.nav-container');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navContainer.style.background = 'rgba(6, 10, 6, 0.98)';
    } else {
        navContainer.style.background = 'linear-gradient(180deg, rgba(6, 10, 6, 0.95) 0%, rgba(6, 10, 6, 0.7) 80%, transparent 100%)';
    }
});

// ---- CARD HOVER BIO-EFFECT ----
document.querySelectorAll('.mutation-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const accent = getComputedStyle(this).getPropertyValue('--card-accent').trim();
        if (accent) {
            this.style.boxShadow = `0 0 30px ${accent}22, 0 8px 32px rgba(0,0,0,0.4)`;
        }
    });
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
    });
});

// ---- ZONE MAP TOOLTIP ON HOVER ----
const zoneData = [
    { x: 180, y: 140, name: 'ZONE A-1', hazard: 'RADIATION', detail: 'Cracked reactor core. Exposure limit: 4 hours.' },
    { x: 450, y: 200, name: 'ZONE B-7', hazard: 'BIOHAZARD', detail: 'Overgrown corp lab. Uncontained pathogen.' },
    { x: 620, y: 350, name: 'ZONE C-3', hazard: 'PSYCHOTOXIN', detail: 'Mycelium spore field. Hallucinations within minutes.' },
    { x: 320, y: 380, name: 'ZONE D-2', hazard: 'ACID SWAMP', detail: 'Toxic bog. pH 0.3. Don\'t touch anything.' },
    { x: 560, y: 100, name: 'ZONE E-5', hazard: 'MUTAGEN', detail: 'Unstable genome zone. Changes within hours.' }
];

zoneMap.addEventListener('mousemove', (e) => {
    const rect = zoneMap.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    zoneData.forEach(zone => {
        const dist = Math.sqrt((mouseX - zone.x) ** 2 + (mouseY - zone.y) ** 2);
        if (dist < 40) {
            zoneMap.style.cursor = 'pointer';
        }
    });
});

// ---- LOADING SEQUENCE SIMULATION ----
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('%c⬡ FLESHCODE INTERFACE LOADED', 'color: #00ffaa; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,170,0.5);');
console.log('%cSYSTEM INTEGRITY: 73.2%', 'color: #4a9e2a; font-size: 12px;');
console.log('%cWARNING: Unauthorized biopunk interface detected.', 'color: #cc3300; font-size: 11px;');