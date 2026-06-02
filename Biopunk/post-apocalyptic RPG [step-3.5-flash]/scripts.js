/* ========================================
   BIO-FALL: POST-APOCALYPTIC BIOPUNK RPG
   JavaScript - Interactive Features
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initBioParticles();
    initDNAHelix();
    initMutations();
    initContaminationMap();
    initTechTree();
    initJournalNavigation();
    initNavigationHighlight();
    initParallax();
    initSmoothScroll();
});

/* ========================================
   BIO PARTICLES
   ======================================== */

function initBioParticles() {
    const container = document.getElementById('bioParticles');
    if (!container) return;
    
    const particleCount = 30;
    const colors = ['#00ff88', '#aa00ff', '#00d4ff', '#ff0040'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'bio-particle';
        
        // Random properties
        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            top: ${top}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            box-shadow: 0 0 ${size}px ${color};
        `;
        
        container.appendChild(particle);
    }
}

/* ========================================
   DNA HELIX GENERATION
   ======================================== */

function initDNAHelix() {
    const helix = document.getElementById('dnaHelix');
    if (!helix) return;
    
    const strandCount = 20;
    const helixHeight = 600;
    
    for (let i = 0; i < strandCount; i++) {
        const strand = document.createElement('div');
        strand.className = 'dna-strand';
        
        const yPos = (i / strandCount) * helixHeight;
        const rotation = (i / strandCount) * 360;
        const delay = i * 0.15;
        
        strand.style.cssText = `
            top: ${yPos}px;
            transform: translateX(-50%) rotate(${rotation}deg);
            animation-delay: ${delay}s;
            background: ${i % 2 === 0 ? 'var(--toxic-green)' : 'var(--sickly-purple)'};
            box-shadow: 0 0 10px ${i % 2 === 0 ? 'var(--toxic-green)' : 'var(--sickly-purple)'};
        `;
        
        helix.appendChild(strand);
    }
}

/* ========================================
   MUTATION CATALOG
   ======================================== */

const mutationData = [
    {
        id: 1,
        name: "Photosynthetic Dermis",
        category: "metabolic",
        rarity: "COMMON",
        description: "Skin cells have been altered to contain chlorophyll, allowing the subject to generate energy from sunlight.",
        effects: ["Energy generation from sunlight", "Reduced need for food", "Greenish skin tint", "Vulnerability to UV overexposure"],
        stats: { contagion: "LOW", stability: "HIGH" }
    },
    {
        id: 2,
        name: "Enhanced Auditory Perception",
        category: "sensory",
        rarity: "UNCOMMON",
        description: "Auditory range expanded to include ultrasonic frequencies and the ability to isolate individual sounds in noisy environments.",
        effects: ["Hear up to 40kHz", "Sound source localization", "Noise filtering", "Sensitivity to loud sounds"],
        stats: { contagion: "NONE", stability: "HIGH" }
    },
    {
        id: 3,
        name: "Dermal Armor Plates",
        category: "physical",
        rarity: "RARE",
        description: "Bone-like plates grow beneath the skin, providing protection against physical attacks but reducing flexibility.",
        effects: ["+80% physical damage resistance", "Reduced mobility", "Heavy armor plating", "Slow regeneration"],
        stats: { contagion: "NONE", stability: "MEDIUM" }
    },
    {
        id: 4,
        name: "Toxic Secretion Glands",
        category: "parasitic",
        rarity: "UNCOMMON",
        description: "Body produces various toxins that can be secreted through pores or saliva, causing various debilitating effects.",
        effects: ["Poisonous touch", "Acidic saliva", "Chemical detection", "Self-immunity required"],
        stats: { contagion: "HIGH", stability: "LOW" }
    },
    {
        id: 5,
        name: "Neural Accelerant",
        category: "cognitive",
        rarity: "LEGENDARY",
        description: "Synaptic transmission enhanced, allowing for faster thought processes and reaction times approaching superhuman levels.",
        effects: ["5x processing speed", "Precognition flashes", "Mental fatigue", "Seizure risk"],
        stats: { contagion: "NONE", stability: "LOW" }
    },
    {
        id: 6,
        name: "Regenerative Gut Flora",
        category: "metabolic",
        rarity: "COMMON",
        description: "Symbiotic bacteria in digestive system can break down almost any organic matter and accelerate healing.",
        effects: ["Eat any organic material", "Rapid wound healing", "Digestive enzyme overproduction", "Frequent nausea"],
        stats: { contagion: "LOW", stability: "HIGH" }
    },
    {
        id: 7,
        name: "Chameleon Skin",
        category: "physical",
        rarity: "RARE",
        description: "Skin contains chromatophores that allow for rapid color change, providing camouflage in any environment.",
        effects: ["Active camouflage", "Emotion-based color shift", "Temperature regulation", "Energy intensive"],
        stats: { contagion: "NONE", stability: "MEDIUM" }
    },
    {
        id: 8,
        name: "Echolocation Organs",
        category: "sensory",
        rarity: "UNCOMMON",
        description: "Modified larynx and ear structures allow for bat-like echolocation, creating a mental map of surroundings.",
        effects: ["360° spatial awareness", "See through darkness", "Silent communication", "Constant high-frequency emission"],
        stats: { contagion: "NONE", stability: "HIGH" }
    },
    {
        id: 9,
        name: "Symbiotic Parasite",
        category: "parasitic",
        rarity: "LEGENDARY",
        description: "A sentient parasite has merged with the host's nervous system, granting access to hive knowledge and shared consciousness.",
        effects: ["Collective memory access", "Telepathic network", "Loss of individuality", "Dual consciousness"],
        stats: { contagion: "EXTREME", stability: "VOLATILE" }
    },
    {
        id: 10,
        name: "Thermal Regulation",
        category: "metabolic",
        rarity: "COMMON",
        description: "Body can maintain optimal temperature in extreme environments, from frozen wastes to radioactive hotspots.",
        effects: ["Surive -50°C to +80°C", "Energy conservation", "Slow adaptation period", "Visible heat distortion"],
        stats: { contagion: "NONE", stability: "HIGH" }
    },
    {
        id: 11,
        name: "Prehensile Tail",
        category: "physical",
        rarity: "UNCOMMON",
        description: "A muscular tail has grown from the base of the spine, capable of fine manipulation and additional balance.",
        effects: ["Additional limb", "Enhanced balance", "Tail articulation", "Social stigma"],
        stats: { contagion: "NONE", stability: "HIGH" }
    },
    {
        id: 12,
        name: "Empathic Projection",
        category: "cognitive",
        rarity: "RARE",
        description: "Can sense and project emotions to others, useful for communication but dangerous in large groups.",
        effects: ["Emotion detection", "Calm/agitate others", "Emotional feedback", "No mental privacy"],
        stats: { contagion: "NONE", stability: "LOW" }
    }
];

function initMutations() {
    const grid = document.getElementById('mutationsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('mutationModal');
    const modalClose = modal.querySelector('.modal-close');
    
    // Render mutations
    function renderMutations(filter = 'all') {
        grid.innerHTML = '';
        
        const filtered = filter === 'all' 
            ? mutationData 
            : mutationData.filter(m => m.category === filter);
        
        filtered.forEach((mutation, index) => {
            const card = document.createElement('div');
            card.className = `mutation-card ${mutation.category}`;
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="mutation-header">
                    <h3 class="mutation-name">${mutation.name}</h3>
                    <span class="mutation-rarity">${mutation.rarity}</span>
                </div>
                <p class="mutation-description">${mutation.description}</p>
                <div class="mutation-effects">
                    ${mutation.effects.slice(0, 3).map(effect => 
                        `<span class="effect-tag">${effect}</span>`
                    ).join('')}
                    ${mutation.effects.length > 3 ? 
                        `<span class="effect-tag">+${mutation.effects.length - 3} more</span>` : ''
                    }
                </div>
            `;
            
            card.addEventListener('click', () => openMutationModal(mutation));
            grid.appendChild(card);
        });
    }
    
    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMutations(btn.dataset.filter);
        });
    });
    
    // Modal functions
    function openMutationModal(mutation) {
        modal.querySelector('.modal-title').textContent = mutation.name;
        modal.querySelector('.modal-category').textContent = mutation.category.toUpperCase();
        modal.querySelector('.modal-description').textContent = mutation.description;
        modal.querySelector('.modal-rarity').textContent = mutation.rarity;
        modal.querySelector('.modal-contagion').textContent = mutation.stats.contagion;
        modal.querySelector('.modal-stability').textContent = mutation.stats.stability;
        
        const effectsList = modal.querySelector('.effects-list');
        effectsList.innerHTML = mutation.effects.map(effect => `<li>${effect}</li>`).join('');
        
        // Set visual based on category
        const visual = modal.querySelector('.modal-visual');
        visual.innerHTML = `
            <div class="mutation-icon" style="
                width: 120px;
                height: 120px;
                background: radial-gradient(circle, 
                    ${getCategoryColor(mutation.category)} 0%, 
                    transparent 70%);
                border-radius: 50%;
                animation: orbFloat 3s ease-in-out infinite;
            "></div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMutationModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeMutationModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMutationModal();
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeMutationModal();
        }
    });
    
    function getCategoryColor(category) {
        const colors = {
            physical: '#ff6b6b',
            sensory: '#4ecdc4',
            metabolic: '#ffe66d',
            cognitive: '#a8e6cf',
            parasitic: '#ff8b94'
        };
        return colors[category] || '#00ff88';
    }
    
    // Initial render
    renderMutations();
}

/* ========================================
   CONTAMINATION ZONE MAP
   ======================================== */

const zoneData = [
    {
        id: 'zone1',
        name: "THE GLOWING PLAINS",
        contamination: 92,
        density: "EXTREME",
        survival: 12,
        description: "Once fertile agricultural land, now a radioactive wasteland. The soil glows with perpetual Cherenkov radiation. Mutant crops and irradiated predators dominate this zone.",
        color: "critical",
        points: "150,50 250,80 300,150 280,250 200,280 100,200 80,120"
    },
    {
        id: 'zone2',
        name: "TOXIC MARSHLANDS",
        contamination: 78,
        density: "HIGH",
        survival: 28,
        description: "Swamps filled with bio-luminescent algae and toxic gases. The water itself is corrosive, and strange amphibious mutants lurk beneath the surface.",
        color: "high",
        points: "350,100 450,120 500,200 480,300 400,320 320,250 340,150"
    },
    {
        id: 'zone3',
        name: "RUINED METROPOLIS",
        contamination: 65,
        density: "HIGH",
        survival: 41,
        description: "The skeletal remains of a once-great city. Buildings are overgrown with predatory vegetation, and scavenger clans battle for control of pre-fall technology.",
        color: "high",
        points: "400,350 550,370 600,450 550,530 450,550 350,500 380,400"
    },
    {
        id: 'zone4',
        name: "THE SICKLE WOODS",
        contamination: 45,
        density: "MEDIUM",
        survival: 58,
        description: "Forest where trees have grown metallic bark and razor-sharp leaves. The wildlife has adapted with chameleon-like abilities and pack hunting strategies.",
        color: "medium",
        points: "200,300 300,320 350,400 280,480 180,450 150,380"
    },
    {
        id: 'zone5',
        name: "SAFE HAVEN VALLEY",
        contamination: 18,
        density: "LOW",
        survival: 87,
        description: "A rare area shielded by natural geography and old-world filtration systems. Small communities thrive here, trading and sharing resources in relative safety.",
        color: "safe",
        points: "600,100 700,120 720,200 650,250 580,200"
    },
    {
        id: 'zone6',
        name: "MUTANT COAST",
        contamination: 54,
        density: "MEDIUM",
        survival: 49,
        description: "Coastal areas where mutated marine life washes ashore. The tide brings both resources and dangers from the irradiated oceans.",
        color: "medium",
        points: "500,550 650,570 680,650 600,700 520,650"
    },
    {
        id: 'zone7',
        name: "NEO-ACADEMY RUINS",
        contamination: 38,
        density: "LOW",
        survival: 69,
        description: "Former research facility where the initial genetic experiments took place. Some automated systems still function, containing valuable data and dangerous experiments.",
        color: "low",
        points: "580,300 680,320 700,400 650,450 570,420"
    }
];

function initContaminationMap() {
    const map = document.getElementById('contaminationMap');
    const tooltip = document.getElementById('mapTooltip');
    const zoneInfoPanel = document.getElementById('zoneInfoPanel');
    
    // Create SVG defs for filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Glow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'zone-glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'blur');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'blur');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    map.appendChild(defs);
    
    // Draw zones
    zoneData.forEach(zone => {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', zone.points);
        polygon.classList.add('zone-polygon', zone.color);
        polygon.setAttribute('data-zone-id', zone.id);
        polygon.setAttribute('filter', 'url(#zone-glow)');
        
        // Hover events
        polygon.addEventListener('mouseenter', (e) => {
            tooltip.textContent = zone.name;
            tooltip.classList.add('active');
        });
        
        polygon.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 15 + 'px';
            tooltip.style.top = e.pageY + 15 + 'px';
        });
        
        polygon.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });
        
        // Click event
        polygon.addEventListener('click', () => {
            showZoneInfo(zone);
        });
        
        map.appendChild(polygon);
    });
    
    function showZoneInfo(zone) {
        zoneInfoPanel.querySelector('.zone-name').textContent = zone.name;
        document.getElementById('zoneContamination').textContent = zone.contamination + '%';
        document.getElementById('zoneDensity').textContent = zone.density;
        document.getElementById('zoneSurvival').textContent = zone.survival + '%';
        document.getElementById('zoneDescription').textContent = zone.description;
        
        // Update survival rating color
        const survivalEl = document.getElementById('zoneSurvival');
        if (zone.survival >= 70) {
            survivalEl.style.color = 'var(--toxic-green)';
        } else if (zone.survival >= 40) {
            survivalEl.style.color = 'var(--muted-amber)';
        } else {
            survivalEl.style.color = 'var(--pulsing-red)';
        }
        
        // Highlight selected polygon
        document.querySelectorAll('.zone-polygon').forEach(p => p.classList.remove('selected'));
        const selected = document.querySelector(`[data-zone-id="${zone.id}"]`);
        if (selected) selected.classList.add('selected');
    }
    
    // Add selected class styling dynamically
    const style = document.createElement('style');
    style.textContent = `
        .zone-polygon.selected {
            stroke-width: 4 !important;
            filter: url(#zone-glow) drop-shadow(0 0 15px rgba(0, 255, 136, 0.8)) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   BIO-ENHANCEMENT TECH TREE
   ======================================== */

const techTreeData = {
    nodes: [
        // Root nodes (starting points)
        { id: 'base-human', x: 200, y: 600, name: 'BASE HUMAN', type: 'root', requirements: [], benefits: ['All basic human capabilities'], available: true },
        
        // Physical branch
        { id: 'strength', x: 400, y: 500, name: 'ENHANCED STRENGTH', type: 'physical', requirements: ['base-human'], benefits: ['+150% lifting capacity', 'Bone reinforcement', 'Melee damage +80%'], available: true },
        { id: 'titanium-bones', x: 600, y: 400, name: 'TITANIUM BONES', type: 'physical', requirements: ['strength'], benefits: ['Near-indestructible skeleton', '+50% strength bonus', 'Bullet resistance'], available: false },
        { id: 'biomech-arms', x: 800, y: 300, name: 'BIOMECH ARMS', type: 'physical', requirements: ['titanium-bones'], benefits: ['Integrated weapon systems', 'Tactical weapon deployment', 'Arm cannon'], available: false },
        
        { id: 'speed', x: 400, y: 700, name: 'ENHANCED SPEED', type: 'physical', requirements: ['base-human'], benefits: ['+200% movement speed', 'Enhanced reflexes', 'Accelerated healing'], available: true },
        { id: 'adrenal-surge', x: 600, y: 800, name: 'ADRENAL SURGE', type: 'physical', requirements: ['speed'], benefits: ['Combat speed boost', 'Pain suppression', 'Temporary invulnerability'], available: false },
        
        // Sensory branch
        { id: 'eagle-vision', x: 400, y: 350, name: 'EAGLE VISION', type: 'sensory', requirements: ['base-human'], benefits: ['10x visual acuity', 'Spectral vision', 'Motion detection'], available: true },
        { id: 'thermal-sight', x: 600, y: 250, name: 'THERMAL SIGHT', type: 'sensory', requirements: ['eagle-vision'], benefits: ['See through walls', 'Heat signature tracking', 'Night vision'], available: false },
        { id: 'predator-vision', x: 800, y: 200, name: 'PREDATOR VISION', type: 'sensory', requirements: ['thermal-sight'], benefits: ['Multi-spectrum analysis', 'Target highlighting', 'Threat assessment'], available: false },
        
        { id: 'sonar-echo', x: 400, y: 550, name: 'SONAR ECHO', type: 'sensory', requirements: ['base-human'], benefits: ['Echolocation', '360° awareness', 'Material analysis'], available: true },
        { id: 'radar-sense', x: 600, y: 600, name: 'RADAR SENSE', type: 'sensory', requirements: ['sonar-echo'], benefits: ['Through-wall detection', 'Movement tracking', 'Electronic detection'], available: false },
        
        // Metabolic branch
        { id: 'photosynthesis', x: 400, y: 750, name: 'PHOTOSYNTHESIS', type: 'metabolic', requirements: ['base-human'], benefits: ['Generate energy from sunlight', 'Reduced food needs', 'Glowing skin'], available: true },
        { id: 'chlorophyll-skin', x: 600, y: 850, name: 'CHLOROPHYLL SKIN', type: 'metabolic', requirements: ['photosynthesis'], benefits: ['Outdoor energy generation', 'Plant communication', 'Oxygen production'], available: false },
        
        { id: 'toxin-immunity', x: 400, y: 900, name: 'TOXIN IMMUNITY', type: 'metabolic', requirements: ['base-human'], benefits: ['Immunity to poisons', 'Detoxification', 'Consume hazardous materials'], available: true },
        { id: 'radiation-absorption', x: 600, y: 1000, name: 'RADIATION ABSORPTION', type: 'metabolic', requirements: ['toxin-immunity'], benefits: ['Convert radiation to energy', 'Glow in dark', 'Radiation aura'], available: false },
        
        // Cognitive branch
        { id: 'neural-accelerant', x: 400, y: 450, name: 'NEURAL ACCELERANT', type: 'cognitive', requirements: ['base-human'], benefits: ['5x thought speed', 'Precognition flashes', 'Enhanced learning'], available: true },
        { id: 'telepathy', x: 600, y: 380, name: 'TELEPATHY', type: 'cognitive', requirements: ['neural-accelerant'], benefits: ['Read minds', 'Mental communication', 'Thought projection'], available: false },
        { id: 'psi-blade', x: 800, y: 320, name: 'PSI-BLADE', type: 'cognitive', requirements: ['telepathy'], benefits: ['Psychokinetic weapon', 'Mental shield', 'Force projection'], available: false },
        
        { id: 'memory-bank', x: 400, y: 650, name: 'MEMORY BANK', type: 'cognitive', requirements: ['base-human'], benefits: ['Perfect recall', 'Skill downloading', 'Dream analysis'], available: true },
        { id: 'collective-consciousness', x: 600, y: 720, name: 'COLLECTIVE CONSCIOUSNESS', type: 'cognitive', requirements: ['memory-bank'], benefits: ['Shared knowledge', 'Hive mind link', 'Group telepathy'], available: false },
        
        // Parasitic branch
        { id: 'symbiotic-parasite', x: 400, y: 1000, name: 'SYMBIOTIC PARASITE', type: 'parasitic', requirements: ['base-human'], benefits: ['Hive network access', 'Dual consciousness', 'Parasite abilities'], available: true },
        { id: 'parasite-swarm', x: 600, y: 1100, name: 'PARASITE SWARM', type: 'parasitic', requirements: ['symbiotic-parasite'], benefits: ['Spawn parasites', 'Control hosts', 'Rapid infection'], available: false },
        
        { id: 'vampiric-drain', x: 400, y: 1100, name: 'VAMPIRIC DRAIN', type: 'parasitic', requirements: ['base-human'], benefits: ['Heal by draining life', 'Blood sensing', 'Youth preservation'], available: true },
        { id: 'blood-lord', x: 600, y: 1200, name: 'BLOOD LORD', type: 'parasitic', requirements: ['vampiric-drain'], benefits: ['Blood control', 'Create thralls', 'Eternal life'], available: false }
    ],
    connections: [
        { from: 'base-human', to: 'strength' },
        { from: 'base-human', to: 'speed' },
        { from: 'base-human', to: 'eagle-vision' },
        { from: 'base-human', to: 'sonar-echo' },
        { from: 'base-human', to: 'photosynthesis' },
        { from: 'base-human', to: 'toxin-immunity' },
        { from: 'base-human', to: 'neural-accelerant' },
        { from: 'base-human', to: 'memory-bank' },
        { from: 'base-human', to: 'symbiotic-parasite' },
        { from: 'base-human', to: 'vampiric-drain' },
        
        { from: 'strength', to: 'titanium-bones' },
        { from: 'titanium-bones', to: 'biomech-arms' },
        { from: 'speed', to: 'adrenal-surge' },
        
        { from: 'eagle-vision', to: 'thermal-sight' },
        { from: 'thermal-sight', to: 'predator-vision' },
        { from: 'sonar-echo', to: 'radar-sense' },
        
        { from: 'photosynthesis', to: 'chlorophyll-skin' },
        { from: 'toxin-immunity', to: 'radiation-absorption' },
        
        { from: 'neural-accelerant', to: 'telepathy' },
        { from: 'telepathy', to: 'psi-blade' },
        { from: 'memory-bank', to: 'collective-consciousness' },
        
        { from: 'symbiotic-parasite', to: 'parasite-swarm' },
        { from: 'vampiric-drain', to: 'blood-lord' }
    ]
};

let treeScale = 1;
let treeTranslateX = 0;
let treeTranslateY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let treeStart = { x: 0, y: 0 };

function initTechTree() {
    const svg = document.getElementById('techTree');
    const treeWrapper = document.querySelector('.tree-wrapper');
    const zoomIn = document.getElementById('treeZoomIn');
    const zoomOut = document.getElementById('treeZoomOut');
    const reset = document.getElementById('treeReset');
    const zoomDisplay = document.getElementById('treeZoom');
    const enhancementDetail = document.getElementById('enhancementDetail');
    
    // Draw tree
    drawTechTree();
    
    // Zoom controls
    zoomIn.addEventListener('click', () => {
        treeScale = Math.min(treeScale * 1.2, 3);
        updateTreeTransform();
    });
    
    zoomOut.addEventListener('click', () => {
        treeScale = Math.max(treeScale / 1.2, 0.5);
        updateTreeTransform();
    });
    
    reset.addEventListener('click', () => {
        treeScale = 1;
        treeTranslateX = 0;
        treeTranslateY = 0;
        updateTreeTransform();
    });
    
    // Pan functionality
    svg.addEventListener('mousedown', (e) => {
        if (e.target === svg || e.target.classList.contains('tree-path')) {
            isDragging = true;
            dragStart.x = e.clientX;
            dragStart.y = e.clientY;
            treeStart.x = treeTranslateX;
            treeStart.y = treeTranslateY;
            svg.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            treeTranslateX = treeStart.x + (e.clientX - dragStart.x);
            treeTranslateY = treeStart.y + (e.clientY - dragStart.y);
            updateTreeTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        svg.style.cursor = 'grab';
    });
    
    // Mouse wheel zoom
    treeWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        treeScale = Math.max(0.5, Math.min(3, treeScale * delta));
        updateTreeTransform();
    });
    
    function updateTreeTransform() {
        svg.style.transform = `translate(${treeTranslateX}px, ${treeTranslateY}px) scale(${treeScale})`;
        zoomDisplay.textContent = Math.round(treeScale * 100) + '%';
    }
    
    function drawTechTree() {
        // Clear existing content (except defs)
        const defs = svg.querySelector('defs') || svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'defs'));
        svg.innerHTML = '';
        svg.appendChild(defs);
        
        // Add glow filter
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'node-glow');
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '2');
        feGaussianBlur.setAttribute('result', 'blur');
        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        feMerge.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')).setAttribute('in', 'blur');
        feMerge.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')).setAttribute('in', 'SourceGraphic');
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feMerge);
        defs.appendChild(filter);
        
        // Draw connections first (so they appear behind nodes)
        techTreeData.connections.forEach(conn => {
            const fromNode = techTreeData.nodes.find(n => n.id === conn.from);
            const toNode = techTreeData.nodes.find(n => n.id === conn.to);
            
            if (!fromNode || !toNode) return;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.classList.add('tree-path');
            
            // Curved path
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const d = `M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY - 30} ${toNode.x} ${toNode.y}`;
            
            path.setAttribute('d', d);
            if (toNode.available) {
                path.classList.add('active');
            }
            
            svg.appendChild(path);
        });
        
        // Draw nodes
        techTreeData.nodes.forEach(node => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('tree-node');
            if (!node.available) group.classList.add('unavailable');
            if (node.type === 'root') group.classList.add('root');
            group.setAttribute('data-node-id', node.id);
            group.style.cursor = node.available ? 'pointer' : 'not-allowed';
            
            // Node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', node.type === 'root' ? 20 : 15);
            circle.setAttribute('filter', 'url(#node-glow)');
            
            // Node text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 35);
            text.textContent = node.name;
            
            group.appendChild(circle);
            group.appendChild(text);
            
            // Click event
            if (node.available) {
                group.addEventListener('click', () => showEnhancementDetail(node));
            }
            
            svg.appendChild(group);
        });
        
        // Set SVG viewBox to fit all nodes
        const xs = techTreeData.nodes.map(n => n.x);
        const ys = techTreeData.nodes.map(n => n.y);
        const minX = Math.min(...xs) - 100;
        const minY = Math.min(...ys) - 100;
        const maxX = Math.max(...xs) + 100;
        const maxY = Math.max(...ys) + 100;
        
        svg.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
    }
    
    function showEnhancementDetail(node) {
        const reqsList = document.getElementById('enhancementReqs');
        const benefitsList = document.getElementById('enhancementBenefits');
        
        enhancementDetail.querySelector('.enhancement-name').textContent = node.name;
        enhancementDetail.querySelector('.enhancement-description').textContent = 
            `This ${node.type} enhancement is part of the Bio-Enhancement program. It requires prerequisite enhancements before activation.`;
        
        // Requirements
        reqsList.innerHTML = node.requirements.map(req => {
            const reqNode = techTreeData.nodes.find(n => n.id === req);
            return `<li>${req ? reqNode.name : req}</li>`;
        }).join('');
        
        // Benefits
        benefitsList.innerHTML = node.benefits.map(b => `<li>${b}</li>`).join('');
        
        enhancementDetail.classList.add('active');
    }
    
    // Close detail when clicking elsewhere
    svg.addEventListener('click', (e) => {
        if (e.target.classList.contains('tree-path') || e.target === svg) {
            enhancementDetail.classList.remove('active');
        }
    });
}

/* ========================================
   JOURNAL NAVIGATION
   ======================================== */

function initJournalNavigation() {
    const pages = document.querySelectorAll('.journal-page');
    const prevBtn = document.querySelector('.journal-prev');
    const nextBtn = document.querySelector('.journal-next');
    const currentPageEl = document.querySelector('.current-page');
    const totalPagesEl = document.querySelector('.total-pages');
    
    let currentPage = 0;
    
    function showPage(index) {
        pages.forEach((page, i) => {
            page.classList.remove('active');
            if (i === index) {
                page.classList.add('active');
            }
        });
        
        currentPageEl.textContent = index + 1;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === pages.length - 1;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            showPage(currentPage - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            showPage(currentPage + 1);
        }
    });
    
    // Initialize
    totalPagesEl.textContent = pages.length;
    showPage(0);
}

/* ========================================
   NAVIGATION HIGHLIGHT
   ======================================== */

function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial check
}

/* ========================================
   PARALLAX EFFECT
   ======================================== */

function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        layers.forEach((layer, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(scrolled * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ======================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.mutation-card, .stat-card, .journal-page');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

/* ========================================
   DYNAMIC MUTATION COUNT
   ======================================== */

function updateMutationCount() {
    const countEl = document.getElementById('mutationCount');
    if (countEl) {
        let current = 0;
        const target = mutationData.length;
        const increment = Math.ceil(target / 30);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            countEl.textContent = current;
        }, 50);
    }
}

// Run mutation count animation when mutations section is visible
const mutationSection = document.getElementById('mutations');
if (mutationSection) {
    const mutationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateMutationCount();
                mutationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    mutationObserver.observe(mutationSection);
}

/* ========================================
   RANDOM BIO PARTICLE GENERATION
   ======================================== */

setInterval(() => {
    const container = document.getElementById('bioParticles');
    if (!container || Math.random() > 0.3) return;
    
    const particle = document.createElement('div');
    particle.className = 'bio-particle';
    
    const colors = ['#00ff88', '#aa00ff', '#00d4ff', '#ff0040'];
    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        top: 100%;
        animation: float ${duration}s linear forwards;
        box-shadow: 0 0 ${size * 2}px ${color};
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}, 2000);

/* ========================================
   CONSOLE EASTER EGG
   ======================================== */

console.log('%c BIO-FALL CHRONICLES ', 
    'background: linear-gradient(90deg, #00ff88, #aa00ff); color: black; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Welcome, survivor. The wasteland awaits your choices. ', 
    'color: #00ff88; font-size: 12px;');
console.log('%c ⚠️  WARNING: Prolonged exposure to this interface may cause mutation symptoms. ', 
    'color: #ff0040; font-size: 10px;');