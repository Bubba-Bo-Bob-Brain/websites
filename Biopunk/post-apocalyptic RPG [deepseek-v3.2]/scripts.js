// scripts.js
// NEXUS: Aftermath - Post-Apocalyptic Biopunk RPG
// Interactive Features & Immersive Behaviors

// ==========================================================================
// DOM Content Loaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧬 NEXUS: Aftermath Interface Initializing...');
    
    // Initialize all modules
    initializeNavigation();
    initializeHeroAnimations();
    initializeMutationCatalog();
    initializeTechTree();
    initializeContaminationMap();
    initializeSurvivalGuide();
    initializeFooter();
    
    // Set up global event listeners
    setupGlobalListeners();
    
    // Start ambient animations
    startAmbientAnimations();
    
    console.log('✅ NEXUS Interface Active - Bio-Integrity: 87%');
});

// ==========================================================================
// Navigation Module - Organic Pulsing Interface
// ==========================================================================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const statusFill = document.querySelector('.status-fill');
    
    // Navigation hover effects with contamination data
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const contamination = e.target.dataset.contamination;
            pulseContaminationEffect(contamination);
            
            // Animate the hover line
            const hoverLine = e.target.querySelector('.link-hover');
            if (hoverLine) {
                hoverLine.style.transition = 'none';
                hoverLine.style.transform = 'scaleX(0)';
                setTimeout(() => {
                    hoverLine.style.transition = 'transform 0.3s ease';
                    hoverLine.style.transform = 'scaleX(1)';
                }, 10);
            }
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll with organic easing
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active navigation state
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const navLinksContainer = document.querySelector('.nav-links');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinksContainer.style.display = isExpanded ? 'none' : 'flex';
            
            // Animate menu lines
            const menuLines = menuToggle.querySelectorAll('.menu-line');
            if (!isExpanded) {
                menuLines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                menuLines[1].style.opacity = '0';
                menuLines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                menuLines[0].style.transform = 'none';
                menuLines[1].style.opacity = '1';
                menuLines[2].style.transform = 'none';
            }
        });
    }
    
    // Bio-integrity status animation
    if (statusFill) {
        setInterval(() => {
            const currentWidth = parseFloat(statusFill.style.width);
            const fluctuation = (Math.random() * 4) - 2; // Random +/- 2%
            const newWidth = Math.min(100, Math.max(85, currentWidth + fluctuation));
            
            statusFill.style.width = `${newWidth}%`;
            
            // Change pulse speed based on integrity
            const pulse = document.querySelector('.status-pulse');
            if (pulse) {
                const duration = 3 + (100 - newWidth) * 0.1; // Faster pulse as integrity drops
                pulse.style.animationDuration = `${duration}s`;
            }
        }, 3000);
    }
}

function pulseContaminationEffect(level) {
    const colors = {
        low: 'rgba(58, 138, 58, 0.3)',
        medium: 'rgba(212, 160, 23, 0.3)',
        high: 'rgba(224, 108, 26, 0.3)',
        extreme: 'rgba(196, 60, 60, 0.3)'
    };
    
    const effect = document.createElement('div');
    effect.className = 'contamination-pulse';
    effect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, ${colors[level]}, transparent 70%);
        pointer-events: none;
        z-index: 999;
        animation: contaminationPulse 1s forwards;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ==========================================================================
// Hero Section Module - Immersive Animations
// ==========================================================================
function initializeHeroAnimations() {
    // Animate statistic counters
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        animateCounter(stat, target, 2000);
    });
    
    // DNA strand animation
    const dnaBases = document.querySelectorAll('.dna-base');
    dnaBases.forEach((base, index) => {
        // Random slight variations in animation
        const delay = index * 0.2;
        const duration = 3 + Math.random() * 1;
        const yOffset = 5 + Math.random() * 10;
        
        base.style.animation = `
            dnaFloat ${duration}s infinite ease-in-out ${delay}s,
            dnaGlow 2s infinite alternate ${delay}s
        `;
        
        // Add glow effect
        base.style.boxShadow = `0 0 ${10 + index * 2}px var(--color-accent)`;
    });
    
    // Particle field animation
    const particleField = document.querySelector('.particle-field');
    if (particleField) {
        setInterval(() => {
            // Add new particles occasionally
            if (Math.random() > 0.7) {
                addParticle(particleField);
            }
        }, 1000);
    }
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
            
            // Add celebration effect for reaching target
            if (element.parentElement.classList.contains('stat')) {
                element.parentElement.style.boxShadow = '0 0 20px var(--color-accent)';
                setTimeout(() => {
                    element.parentElement.style.boxShadow = '';
                }, 1000);
            }
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

function addParticle(container) {
    const particle = document.createElement('div');
    const size = 1 + Math.random() * 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 10 + Math.random() * 20;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: var(--color-accent);
        border-radius: 50%;
        top: ${y}%;
        left: ${x}%;
        opacity: ${0.3 + Math.random() * 0.7};
        animation: particleFloat ${duration}s linear infinite;
    `;
    
    container.appendChild(particle);
    
    // Remove after animation completes
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// ==========================================================================
// Mutation Catalog Module - Interactive Database
// ==========================================================================
function initializeMutationCatalog() {
    const mutationGrid = document.querySelector('.mutation-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const mutationDetailOverlay = document.getElementById('mutation-detail');
    const detailClose = document.querySelector('.detail-close');
    
    // Load mutation data
    const mutations = generateMutationData();
    renderMutationGrid(mutations);
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Apply filters
            const filterType = button.dataset.filter;
            const filterRisk = button.dataset.risk;
            
            let filteredMutations = [...mutations];
            
            if (filterType && filterType !== 'all') {
                filteredMutations = filteredMutations.filter(m => m.type === filterType);
            }
            
            if (filterRisk) {
                filteredMutations = filteredMutations.filter(m => m.risk === filterRisk);
            }
            
            renderMutationGrid(filteredMutations);
        });
    });
    
    // Mutation detail overlay
    if (mutationDetailOverlay && detailClose) {
        detailClose.addEventListener('click', () => {
            mutationDetailOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close overlay on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mutationDetailOverlay.style.display === 'flex') {
                mutationDetailOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close overlay on background click
        mutationDetailOverlay.addEventListener('click', (e) => {
            if (e.target === mutationDetailOverlay) {
                mutationDetailOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

function generateMutationData() {
    return [
        {
            id: 1,
            name: "Chitinous Carapace",
            type: "defensive",
            risk: "medium",
            description: "Dense, overlapping plates of bio-ceramic material form over the epidermis. Provides exceptional ballistic and energy resistance but reduces mobility and thermal regulation.",
            survival: 85,
            instability: 40,
            energy: 65,
            abilities: ["Ballistic Resistance +85%", "Energy Absorption", "Reduced Mobility -30%", "Thermal Vulnerability"]
        },
        {
            id: 2,
            name: "Photosynthetic Dermis",
            type: "adaptive",
            risk: "low",
            description: "Chloroplast integration allows for limited photosynthesis. Can sustain basic metabolic functions during daylight hours, reducing food dependency by 40%.",
            survival: 70,
            instability: 20,
            energy: 30,
            abilities: ["Photosynthesis", "Reduced Food Dependency", "Sunlight Requirement", "Vulnerability to UV Overexposure"]
        },
        {
            id: 3,
            name: "Neurotoxic Glands",
            type: "aggressive",
            risk: "high",
            description: "Modified salivary glands produce potent neurotoxin. Can paralyze targets for up to 3 hours. Risk of self-contamination during gland development.",
            survival: 60,
            instability: 75,
            energy: 80,
            abilities: ["Neurotoxin Production", "Paralysis Effect", "Ranged Delivery", "Self-Contamination Risk"]
        },
        {
            id: 4,
            name: "Multispectral Ocular Adaptation",
            type: "sensory",
            risk: "medium",
            description: "Retinal cells mutate to perceive infrared, ultraviolet, and microwave spectra. Essential for navigation in contaminated zones but causes chronic photophobia.",
            survival: 55,
            instability: 50,
            energy: 45,
            abilities: ["Infrared Vision", "UV Spectrum Detection", "Microwave Sensing", "Chronic Photophobia"]
        },
        {
            id: 5,
            name: "Regenerative Mycelium Network",
            type: "adaptive",
            risk: "extreme",
            description: "Fungal symbiosis creates distributed nervous system. Can regenerate lost limbs over 72 hours but creates dependency on specific fungal metabolites.",
            survival: 90,
            instability: 85,
            energy: 70,
            abilities: ["Limb Regeneration", "Distributed Consciousness", "Fungal Dependency", "Metabolite Addiction"]
        },
        {
            id: 6,
            name: "Electrostatic Discharge Organs",
            type: "defensive",
            risk: "high",
            description: "Modified muscle tissue can store and discharge electrical energy. Effective against mechanical threats but risks cardiac arrest if overloaded.",
            survival: 65,
            instability: 60,
            energy: 75,
            abilities: ["EMP Generation", "Mechanical Disable", "Energy Storage", "Cardiac Risk"]
        }
    ];
}

function renderMutationGrid(mutations) {
    const grid = document.querySelector('.mutation-grid');
    if (!grid) return;
    
    // Clear existing content except placeholder
    const placeholder = grid.querySelector('.mutation-grid-placeholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    grid.innerHTML = '';
    
    // Create mutation cards
    mutations.forEach(mutation => {
        const card = createMutationCard(mutation);
        grid.appendChild(card);
    });
    
    // If no mutations match filters, show message
    if (mutations.length === 0) {
        const message = document.createElement('div');
        message.className = 'mutation-grid-placeholder';
        message.innerHTML = `
            <div class="placeholder-pulse" style="background-color: var(--color-danger);"></div>
            <p class="placeholder-text">NO MUTATIONS MATCH SELECTED FILTERS</p>
        `;
        grid.appendChild(message);
    }
}

function createMutationCard(mutation) {
    const card = document.createElement('div');
    card.className = 'mutation-card';
    card.dataset.id = mutation.id;
    card.dataset.type = mutation.type;
    card.dataset.risk = mutation.risk;
    
    const riskColors = {
        low: 'var(--color-contamination-low)',
        medium: 'var(--color-contamination-medium)',
        high: 'var(--color-contamination-high)',
        extreme: 'var(--color-contamination-extreme)'
    };
    
    const typeColors = {
        adaptive: 'var(--color-accent)',
        defensive: 'var(--color-info)',
        sensory: 'var(--color-warning)',
        aggressive: 'var(--color-danger)'
    };
    
    card.innerHTML = `
        <div class="card-header" style="border-bottom: 2px solid ${typeColors[mutation.type]}">
            <h4 class="card-title">${mutation.name}</h4>
            <div class="card-meta">
                <span class="card-type" style="color: ${typeColors[mutation.type]}">${mutation.type.toUpperCase()}</span>
                <span class="card-risk" style="color: ${riskColors[mutation.risk]}">${mutation.risk.toUpperCase()} RISK</span>
            </div>
        </div>
        <div class="card-body">
            <p class="card-desc">${mutation.description}</p>
            <div class="card-stats">
                <div class="card-stat">
                    <span>SURVIVAL</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${mutation.survival}%; background: linear-gradient(90deg, var(--color-accent-dark), var(--color-accent));"></div>
                    </div>
                </div>
                <div class="card-stat">
                    <span>INSTABILITY</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${mutation.instability}%; background: linear-gradient(90deg, var(--color-danger-dark), var(--color-danger));"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <button class="card-btn view-detail" data-id="${mutation.id}">VIEW DETAILS</button>
        </div>
    `;
    
    // Add hover animation
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = 'var(--shadow-medium)';
        card.style.borderColor = typeColors[mutation.type];
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-subtle)';
        card.style.borderColor = 'var(--color-surface-border)';
    });
    
    // Add click event for details
    const detailBtn = card.querySelector('.view-detail');
    detailBtn.addEventListener('click', () => {
        showMutationDetail(mutation);
    });
    
    // Add CSS for the card
    card.style.cssText = `
        background-color: var(--color-surface);
        border: 1px solid var(--color-surface-border);
        border-radius: var(--border-radius-md);
        overflow: hidden;
        transition: all var(--transition-medium);
        cursor: pointer;
        position: relative;
        height: 100%;
    `;
    
    // Add pulsing border based on risk level
    if (mutation.risk === 'high' || mutation.risk === 'extreme') {
        card.style.animation = `pulseBorder 2s infinite`;
    }
    
    return card;
}

function showMutationDetail(mutation) {
    const overlay = document.getElementById('mutation-detail');
    if (!overlay) return;
    
    // Populate detail content
    document.getElementById('detail-title').textContent = mutation.name;
    document.getElementById('detail-type').textContent = mutation.type.toUpperCase();
    document.getElementById('detail-risk').textContent = `${mutation.risk.toUpperCase()} RISK`;
    document.getElementById('detail-desc').textContent = mutation.description;
    
    // Update stats with animation
    const survivalBar = document.getElementById('stat-survival');
    const instabilityBar = document.getElementById('stat-instability');
    const energyBar = document.getElementById('stat-energy');
    
    setTimeout(() => {
        survivalBar.style.width = `${mutation.survival}%`;
        instabilityBar.style.width = `${mutation.instability}%`;
        energyBar.style.width = `${mutation.energy}%`;
    }, 100);
    
    // Update abilities
    const abilitiesContainer = document.getElementById('detail-abilities');
    abilitiesContainer.innerHTML = '';
    
    mutation.abilities.forEach(ability => {
        const abilityEl = document.createElement('span');
        abilityEl.className = 'ability-tag';
        abilityEl.textContent = ability;
        abilityEl.style.cssText = `
            display: inline-block;
            padding: 4px 8px;
            background-color: rgba(124, 252, 0, 0.1);
            border: 1px solid var(--color-accent);
            border-radius: 4px;
            font-size: 0.8rem;
            margin: 2px;
        `;
        abilitiesContainer.appendChild(abilityEl);
    });
    
    // Animate DNA visualization
    const dnaVisual = document.querySelector('.detail-dna');
    if (dnaVisual) {
        dnaVisual.style.animation = 'none';
        setTimeout(() => {
            dnaVisual.style.animation = `dnaBreath ${mutation.risk === 'extreme' ? '1s' : '3s'} infinite alternate`;
        }, 10);
    }
    
    // Show overlay
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ==========================================================================
// Tech Tree Module - Interactive Evolution Map
// ==========================================================================
function initializeTechTree() {
    const canvas = document.getElementById('tree-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tree-tooltip');
    
    // Tech tree data
    const nodes = [
        { id: 1, x: 100, y: 400, title: "Basic Adaptation", desc: "Fundamental survival mutations", status: "unlocked", requirements: [] },
        { id: 2, x: 300, y: 300, title: "Enhanced Metabolism", desc: "Improved resource processing", status: "available", requirements: [1] },
        { id: 3, x: 300, y: 500, title: "Dermal Reinforcement", desc: "Basic protective mutations", status: "available", requirements: [1] },
        { id: 4, x: 500, y: 200, title: "Photosynthetic Integration", desc: "Energy from sunlight", status: "locked", requirements: [2] },
        { id: 5, x: 500, y: 400, title: "Toxin Resistance", desc: "Immunity to common contaminants", status: "locked", requirements: [2, 3] },
        { id: 6, x: 500, y: 600, title: "Enhanced Musculature", desc: "Increased strength and speed", status: "locked", requirements: [3] },
        { id: 7, x: 700, y: 100, title: "Bio-Luminescence", desc: "Natural light production", status: "locked", requirements: [4] },
        { id: 8, x: 700, y: 300, title: "Neural Enhancement", desc: "Cognitive improvements", status: "locked", requirements: [4, 5] },
        { id: 9, x: 700, y: 500, title: "Regenerative Systems", desc: "Advanced healing capabilities", status: "locked", requirements: [5, 6] },
        { id: 10, x: 700, y: 700, title: "Defensive Adaptations", desc: "Active protective systems", status: "locked", requirements: [6] }
    ];
    
    // Connections between nodes
    const connections = [
        { from: 1, to: 2 }, { from: 1, to: 3 },
        { from: 2, to: 4 }, { from: 2, to: 5 }, { from: 3, to: 5 }, { from: 3, to: 6 },
        { from: 4, to: 7 }, { from: 4, to: 8 }, { from: 5, to: 8 }, { from: 5, to: 9 }, { from: 6, to: 9 }, { from: 6, to: 10 }
    ];
    
    // Zoom and pan variables
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    
    // Draw tech tree
    function drawTechTree() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections first (behind nodes)
        connections.forEach(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            if (fromNode && toNode) {
                // Calculate positions with transform
                const x1 = fromNode.x * scale + offsetX;
                const y1 = fromNode.y * scale + offsetY;
                const x2 = toNode.x * scale + offsetX;
                const y2 = toNode.y * scale + offsetY;
                
                // Draw line
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = getNodeColor(fromNode.status);
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Draw glow effect
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = getNodeColor(fromNode.status) + '40';
                ctx.lineWidth = 6;
                ctx.stroke();
            }
        });
        
        // Draw nodes
        nodes.forEach(node => {
            const x = node.x * scale + offsetX;
            const y = node.y * scale + offsetY;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
            ctx.fillStyle = getNodeColor(node.status);
            ctx.fill();
            
            // Draw node border
            ctx.beginPath();
            ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
            
            // Draw node glow
            ctx.beginPath();
            ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
            ctx.strokeStyle = getNodeColor(node.status) + '40';
            ctx.lineWidth = 4 * scale;
            ctx.stroke();
            
            // Draw node title
            ctx.fillStyle = '#ffffff';
            ctx.font = `${12 * scale}px var(--font-display)`;
            ctx.textAlign = 'center';
            ctx.fillText(node.title, x, y - 30 * scale);
            
            // Draw status indicator
            ctx.beginPath();
            ctx.arc(x, y, 8 * scale, 0, Math.PI * 2);
            ctx.fillStyle = getStatusIndicatorColor(node.status);
            ctx.fill();
        });
    }
    
    function getNodeColor(status) {
        switch(status) {
            case 'unlocked': return 'var(--color-accent)';
            case 'available': return 'var(--color-warning)';
            case 'locked': return 'var(--color-text-muted)';
            default: return 'var(--color-text)';
        }
    }
    
    function getStatusIndicatorColor(status) {
        switch(status) {
            case 'unlocked': return '#ffffff';
            case 'available': return 'var(--color-bg-dark)';
            case 'locked': return 'var(--color-bg-light)';
            default: return '#ffffff';
        }
    }
    
    // Initial draw
    drawTechTree();
    
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
        scale *= 1.2;
        drawTechTree();
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        scale *= 0.8;
        drawTechTree();
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        drawTechTree();
    });
    
    // Mouse interactions
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        isDragging = true;
        
        // Check if clicking on a node
        const x = (lastX - offsetX) / scale;
        const y = (lastY - offsetY) / scale;
        
        const clickedNode = nodes.find(node => {
            const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
            return distance < 20;
        });
        
        if (clickedNode) {
            showNodeTooltip(clickedNode, lastX, lastY);
            return;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            offsetX += currentX - lastX;
            offsetY += currentY - lastY;
            
            lastX = currentX;
            lastY = currentY;
            
            drawTechTree();
        }
        
        // Update tooltip position
        if (tooltip.style.display === 'block') {
            const rect = canvas.getBoundingClientRect();
            tooltip.style.left = `${e.clientX - rect.left + 10}px`;
            tooltip.style.top = `${e.clientY - rect.top + 10}px`;
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        tooltip.style.display = 'none';
    });
    
    function showNodeTooltip(node, x, y) {
        tooltip.innerHTML = `
            <h4 class="tooltip-title">${node.title}</h4>
            <p class="tooltip-desc">${node.desc}</p>
            <div class="tooltip-requirements">
                <strong>Status:</strong> ${node.status.toUpperCase()}<br>
                ${node.requirements.length > 0 ? 
                    `<strong>Requires:</strong> ${node.requirements.map(r => `Node ${r}`).join(', ')}` : 
                    '<strong>Starting Node</strong>'}
            </div>
        `;
        
        tooltip.style.display = 'block';
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
        
        // Auto-hide tooltip after 5 seconds
        setTimeout(() => {
            if (tooltip.style.display === 'block') {
                tooltip.style.display = 'none';
            }
        }, 5000);
    }
}

// ==========================================================================
// Contamination Map Module - Interactive Zone Visualization
// ==========================================================================
function initializeContaminationMap() {
    const zoneMarkers = document.querySelectorAll('.zone-marker');
    const updateTime = document.getElementById('update-time');
    
    // Update time display
    function updateTimeDisplay() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        if (updateTime) {
            updateTime.textContent = timeString;
        }
    }
    
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000); // Update every minute
    
    // Zone marker interactions
    zoneMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', (e) => {
            const zone = e.target.closest('.map-zone');
            const zoneName = zone.dataset.name;
            const zoneType = zone.dataset.zone;
            
            // Highlight zone
            zone.style.zIndex = '10';
            zone.style.transform = 'scale(1.2)';
            
            // Update radiation reading highlight
            updateRadiationHighlight(zoneName);
        });
        
        marker.addEventListener('mouseleave', (e) => {
            const zone = e.target.closest('.map-zone');
            zone.style.zIndex = '';
            zone.style.transform = '';
            
            // Clear radiation reading highlight
            clearRadiationHighlight();
        });
        
        marker.addEventListener('click', (e) => {
            const zone = e.target.closest('.map-zone');
            const zoneName = zone.dataset.name;
            const zoneType = zone.dataset.zone;
            
            showZoneDetails(zoneName, zoneType);
        });
    });
    
    // Animate contamination pulses
    setInterval(() => {
        zoneMarkers.forEach(marker => {
            const animation = marker.style.animation;
            marker.style.animation = 'none';
            setTimeout(() => {
                marker.style.animation = animation;
            }, 10);
        });
    }, 5000);
}

function updateRadiationHighlight(zoneName) {
    const readings = document.querySelectorAll('.reading');
    readings.forEach(reading => {
        const zoneElement = reading.querySelector('.reading-zone');
        if (zoneElement && zoneElement.textContent === zoneName) {
            reading.style.backgroundColor = 'var(--color-surface)';
            reading.style.boxShadow = 'var(--shadow-subtle)';
        }
    });
}

function clearRadiationHighlight() {
    const readings = document.querySelectorAll('.reading');
    readings.forEach(reading => {
        reading.style.backgroundColor = '';
        reading.style.boxShadow = '';
    });
}

function showZoneDetails(zoneName, zoneType) {
    const zoneData = {
        'The Blight': {
            description: 'Ground zero of the Bio-Collapse. Extreme mutagenic activity. No known survivors from initial expeditions.',
            hazards: ['Extreme Radiation', 'Mutagenic Fog', 'Aggressive Flora/Fauna'],
            resources: ['Bio-Ceramic Deposits', 'Ancient Tech Caches', 'Rare Genetic Samples']
        },
        'Fungal Forests': {
            description: 'Massive fungal growths dominate landscape. Spores cause temporary genetic instability.',
            hazards: ['Psychoactive Spores', 'Unstable Terrain', 'Predatory Fungi'],
            resources: ['Medicinal Fungi', 'Bio-Fuel Sources', 'Natural Antibiotics']
        },
        'Acid Lakes': {
            description: 'Chemical waste reservoirs transformed by bio-activity. Highly corrosive but rich in rare compounds.',
            hazards: ['Corrosive Atmosphere', 'Unstable Chemistry', 'Toxic Emissions'],
            resources: ['Rare Chemical Compounds', 'Purified Minerals', 'Energy Crystals']
        },
        'The Sanctuary': {
            description: 'Last known stable settlement. Heavily fortified against contamination. Primary trading hub.',
            hazards: ['Raider Activity', 'Supply Shortages', 'Internal Strife'],
            resources: ['Trading Posts', 'Medical Facilities', 'Secure Housing']
        }
    };
    
    const data = zoneData[zoneName];
    if (!data) return;
    
    // Create detail modal
    const modal = document.createElement('div');
    modal.className = 'zone-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header" style="border-bottom: 2px solid var(--color-contamination-${zoneType})">
                <h3>${zoneName} - Zone Analysis</h3>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <p>${data.description}</p>
                
                <div class="modal-section">
                    <h4>Primary Hazards</h4>
                    <div class="hazard-list">
                        ${data.hazards.map(hazard => `<span class="hazard-tag">${hazard}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4>Available Resources</h4>
                    <div class="resource-list">
                        ${data.resources.map(resource => `<span class="resource-tag">${resource}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4>Survival Recommendations</h4>
                    <ul class="recommendations">
                        <li>Use appropriate protective gear (Level ${zoneType === 'red' ? 'IV' : zoneType === 'orange' ? 'III' : 'II'} Bio-Suit)</li>
                        <li>Carry at least ${zoneType === 'red' ? '3' : '2'} radiation counters</li>
                        <li>${zoneType === 'green' ? 'Trade goods recommended' : 'Emergency extraction beacon required'}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(10, 15, 10, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--z-modal);
    `;
    
    modal.querySelector('.modal-content').style.cssText = `
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--color-surface-border);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// ==========================================================================
// Survival Guide Module - Interactive Field Notes
// ==========================================================================
function initializeSurvivalGuide() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Add page flip animation
                targetContent.style.animation = 'none';
                setTimeout(() => {
                    targetContent.style.animation = 'pageFlip 0.5s ease';
                }, 10);
            }
        });
    });
    
    // Page navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isNext = button.classList.contains('next');
            const currentTab = document.querySelector('.tab-btn.active');
            const tabs = Array.from(document.querySelectorAll('.tab-btn'));
            const currentIndex = tabs.indexOf(currentTab);
            
            let nextIndex;
            if (isNext) {
                nextIndex = (currentIndex + 1) % tabs.length;
            } else {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }
            
            // Simulate page navigation
            tabs[nextIndex].click();
            
            // Animate navigation button
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
    
    // Add page flip animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pageFlip {
            0% { opacity: 0; transform: rotateY(-10deg); }
            100% { opacity: 1; transform: rotateY(0); }
        }
        
        .tab-content {
            animation: pageFlip 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================================================
// Footer Module
// ==========================================================================
function initializeFooter() {
    const footerLinks = document.querySelectorAll('.footer-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            link.style.textShadow = '0 0 10px var(--color-accent)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.textShadow = '';
        });
    });
    
    // Update warning message periodically
    const warning = document.querySelector('.credits-warning');
    if (warning) {
        const warnings = [
            'WARNING: This interface may cause cellular resonance in modified individuals.',
            'CAUTION: Genetic data may trigger latent mutation sequences.',
            'ALERT: Bio-hazard protocols must be maintained during interface use.',
            'NOTICE: Unauthorized genetic sequencing is prohibited.',
            'ADVISORY: Regular integrity checks recommended for modified users.'
        ];
        
        setInterval(() => {
            const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
            warning.textContent = randomWarning;
            
            // Flash effect
            warning.style.color = 'var(--color-danger)';
            setTimeout(() => {
                warning.style.color = '';
            }, 500);
        }, 10000);
    }
}

// ==========================================================================
// Global Event Listeners
// ==========================================================================
function setupGlobalListeners() {
    // Scroll-based animations
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroSection = document.querySelector('.hero-section');
        
        // Parallax effect for hero background
        if (heroSection) {
            const heroBackground = heroSection.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
        }
        
        // Update navigation opacity
        const nav = document.querySelector('.bio-nav');
        if (nav) {
            if (scrollY > 100) {
                nav.style.backgroundColor = 'rgba(10, 15, 10, 0.95)';
                nav.style.backdropFilter = 'blur(10px)';
            } else {
                nav.style.backgroundColor = 'rgba(10, 15, 10, 0.9)';
                nav.style.backdropFilter = 'blur(10px)';
            }
        }
        
        // Reveal elements on scroll
        revealOnScroll();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + M for mutation catalog
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            document.querySelector('a[href="#mutations"]').click();
        }
        
        // Alt + T for tech tree
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            document.querySelector('a[href="#tech-tree"]').click();
        }
        
        // Alt + S for survival guide
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            document.querySelector('a[href="#survival"]').click();
        }
        
        // Escape to close any open modal
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.zone-modal, .mutation-detail-overlay[style*="display: flex"]');
            if (openModal) {
                openModal.remove();
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // Prevent default for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
            }
        });
    });
}

function revealOnScroll() {
    const elements = document.querySelectorAll('.section-header, .mutation-card, .data-card, .guide-page');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// ==========================================================================
// Ambient Animations
// ==========================================================================
function startAmbientAnimations() {
    // Initialize elements with transition-ready styles
    const elementsToReveal = document.querySelectorAll('.section-header, .mutation-card, .data-card, .guide-page');
    elementsToReveal.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial reveal
    setTimeout(() => {
        revealOnScroll();
    }, 500);
    
    // Ambient sound simulation (visual only)
    const ambientIndicator = document.createElement('div');
    ambientIndicator.className = 'ambient-indicator';
    ambientIndicator.innerHTML = '🔊 AMBIENT SYSTEMS ACTIVE';
    ambientIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--color-surface);
        border: 1px solid var(--color-accent);
        padding: 8px 12px;
        border-radius: var(--border-radius-sm);
        font-family: var(--font-display);
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        color: var(--color-accent);
        opacity: 0.7;
        z-index: 1000;
        animation: pulse 2s infinite;
    `;
    
    document.body.appendChild(ambientIndicator);
    
    // Remove indicator after 5 seconds
    setTimeout(() => {
        ambientIndicator.style.opacity = '0';
        ambientIndicator.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            ambientIndicator.remove();
        }, 1000);
    }, 5000);
    
    // Add CSS for pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        @keyframes pulseBorder {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 69, 0, 0.4); }
            50% { box-shadow: 0 0 0 4px rgba(255, 69, 0, 0.2); }
        }
        
        @keyframes dnaGlow {
            0%, 100% { box-shadow: 0 0 10px var(--color-accent); }
            50% { box-shadow: 0 0 25px var(--color-accent); }
        }
    `;
    document.head.appendChild(pulseStyle);
}

// ==========================================================================
// Utility Functions
// ==========================================================================
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

// Make revealOnScroll debounced for performance
window.addEventListener('scroll', debounce(revealOnScroll, 10));

// Export functions for debugging (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeMutationCatalog,
        initializeTechTree,
        initializeContaminationMap
    };
}