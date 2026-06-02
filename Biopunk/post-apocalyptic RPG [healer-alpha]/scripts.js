/* ============================================
   BIOMORPH - Post-Apocalyptic Biopunk RPG Archive
   JavaScript v2.7.3
   ============================================ */

// ===== SPORE PARTICLE SYSTEM =====
class SporeParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.7 ? 160 : 120; // Bioluminescent green or cyan
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Add slight drift
        this.speedX += (Math.random() - 0.5) * 0.01;
        this.speedY += (Math.random() - 0.5) * 0.01;
        
        // Boundary check
        if (this.x < 0 || this.x > this.canvas.width || 
            this.y < 0 || this.y > this.canvas.height) {
            this.reset();
        }
        
        // Pulse effect
        this.pulsePhase += this.pulseSpeed;
        this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulsePhase));
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity})`;
        this.ctx.fill();
        
        // Glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, ${this.currentOpacity * 0.5})`;
    }
}

class SporeSystem {
    constructor() {
        this.canvas = document.getElementById('spore-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new SporeParticle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== NAVIGATION SYSTEM =====
class NavigationSystem {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
        
        // Set initial active state
        this.handleScroll();
    }

    handleScroll() {
        const scrollPos = window.scrollY;
        
        // Navbar scroll effect
        if (scrollPos > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ===== TERMINAL TYPING EFFECT =====
class TerminalEffect {
    constructor() {
        this.terminalLines = document.querySelectorAll('.terminal-line');
        this.init();
    }

    init() {
        this.terminalLines.forEach((line, index) => {
            const delay = parseInt(line.getAttribute('data-delay')) || 0;
            line.style.animationDelay = `${delay}ms`;
        });
    }
}

// ===== MUTATION CATALOG SYSTEM =====
class MutationCatalog {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.mutationCards = document.querySelectorAll('.mutation-card');
        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterMutations(e));
        });
        
        // Add mouse tracking for glow effect
        this.mutationCards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleCardHover(e, card));
            card.addEventListener('mouseleave', (e) => this.handleCardLeave(e, card));
        });
    }

    filterMutations(e) {
        const filter = e.target.getAttribute('data-filter');
        
        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter cards
        this.mutationCards.forEach(card => {
            const type = card.getAttribute('data-type');
            if (filter === 'all' || type === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    handleCardHover(e, card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    }

    handleCardLeave(e, card) {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    }
}

// ===== TECH TREE SYSTEM =====
class TechTreeSystem {
    constructor() {
        this.nodes = document.querySelectorAll('.tech-node');
        this.infoPanel = document.getElementById('tech-info');
        this.bioPointsElement = document.getElementById('bio-points');
        this.bioPoints = 12;
        this.unlockedNodes = new Set(['base']);
        this.init();
    }

    init() {
        this.nodes.forEach(node => {
            node.addEventListener('click', () => this.handleNodeClick(node));
        });
        
        // Initialize with base node info
        this.updateNodeStates();
        this.showNodeInfo('base');
    }

    handleNodeClick(node) {
        const nodeId = node.getAttribute('data-id');
        const requires = node.getAttribute('data-requires');
        
        if (node.classList.contains('locked')) {
            // Check if requirements are met
            const requiredNodes = requires ? requires.split(',') : [];
            const canUnlock = requiredNodes.every(req => this.unlockedNodes.has(req));
            
            if (canUnlock && this.bioPoints >= this.getCostForNode(node)) {
                this.unlockNode(node);
            } else {
                this.shakeNode(node);
            }
        } else {
            this.showNodeInfo(nodeId);
        }
    }

    unlockNode(node) {
        const nodeId = node.getAttribute('data-id');
        const cost = this.getCostForNode(node);
        
        this.bioPoints -= cost;
        this.bioPointsElement.textContent = this.bioPoints;
        this.unlockedNodes.add(nodeId);
        
        node.classList.remove('locked');
        node.querySelector('.node-lock')?.remove();
        
        // Update connected nodes
        this.updateNodeStates();
        this.showNodeInfo(nodeId);
        
        // Celebration effect
        this.celebrateUnlock(node);
    }

    getCostForNode(node) {
        const costText = node.querySelector('.node-cost')?.textContent;
        if (costText) {
            const match = costText.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
        }
        return 0;
    }

    updateNodeStates() {
        this.nodes.forEach(node => {
            const nodeId = node.getAttribute('data-id');
            const requires = node.getAttribute('data-requires');
            
            if (node.classList.contains('locked') && requires) {
                const requiredNodes = requires.split(',');
                const canUnlock = requiredNodes.every(req => this.unlockedNodes.has(req));
                
                if (canUnlock) {
                    node.style.borderColor = 'var(--bio-green)';
                    node.querySelector('.node-lock').style.color = 'var(--bio-green)';
                    node.querySelector('.node-lock').style.borderColor = 'var(--bio-green)';
                } else {
                    node.style.borderColor = 'var(--text-dim)';
                    node.querySelector('.node-lock').style.color = 'var(--warning-amber)';
                    node.querySelector('.node-lock').style.borderColor = 'var(--warning-amber)';
                }
            }
        });
    }

    showNodeInfo(nodeId) {
        const nodeData = this.getNodeData(nodeId);
        if (!nodeData) return;
        
        this.infoPanel.innerHTML = `
            <h4 style="color: var(--bio-green); margin-bottom: 10px; font-family: var(--font-display);">
                ${nodeData.name}
            </h4>
            <p style="font-family: var(--font-handwritten); color: var(--text-secondary); margin-bottom: 15px; font-size: 0.9rem;">
                ${nodeData.description}
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${nodeData.bonuses.map(bonus => `
                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem;">
                        <span style="color: var(--text-dim);">${bonus.stat}</span>
                        <span style="color: var(--bio-green);">${bonus.value}</span>
                    </div>
                `).join('')}
            </div>
            ${nodeData.requires ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--bg-surface);">
                    <p style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);">
                        REQUIRES: ${nodeData.requires.join(', ')}
                    </p>
                </div>
            ` : ''}
        `;
    }

    getNodeData(nodeId) {
        const nodeData = {
            base: {
                name: 'HUMAN BASE',
                description: 'The starting point of all evolution. Unmodified human baseline.',
                bonuses: [
                    { stat: 'STR', value: '10' },
                    { stat: 'AGI', value: '10' },
                    { stat: 'CON', value: '10' },
                    { stat: 'PER', value: '10' }
                ],
                requires: null
            },
            strength: {
                name: 'PRIMAL STRENGTH',
                description: 'Enhanced muscle fibers and bone density. Raw physical power.',
                bonuses: [
                    { stat: 'STR Bonus', value: '+15' },
                    { stat: 'Carry Capacity', value: '+50%' },
                    { stat: 'Melee Damage', value: '+20%' }
                ],
                requires: ['Base Human']
            },
            agility: {
                name: 'SINew FLEX',
                description: 'Flexible tendons and enhanced reflexes. Move like water.',
                bonuses: [
                    { stat: 'AGI Bonus', value: '+15' },
                    { stat: 'Dodge Chance', value: '+25%' },
                    { stat: 'Movement Speed', value: '+15%' }
                ],
                requires: ['Base Human']
            },
            senses: {
                name: 'NEURAL SPIKE',
                description: 'Enhanced neural pathways. Sharper mind, sharper senses.',
                bonuses: [
                    { stat: 'PER Bonus', value: '+20' },
                    { stat: 'Crit Chance', value: '+10%' },
                    { stat: 'Detection Range', value: '+30%' }
                ],
                requires: ['Base Human']
            },
            defense: {
                name: 'DERMAL ARMOR',
                description: 'Thickened skin with natural armor plating.',
                bonuses: [
                    { stat: 'CON Bonus', value: '+15' },
                    { stat: 'Damage Reduction', value: '+10' },
                    { stat: 'Resistance', value: '+20% vs physical' }
                ],
                requires: ['Base Human']
            },
            berserker: {
                name: 'BERSERKER FURY',
                description: 'Channel primal rage. Trade defense for devastating power.',
                bonuses: [
                    { stat: 'STR Bonus', value: '+25' },
                    { stat: 'Attack Speed', value: '+30%' },
                    { stat: 'Damage Taken', value: '+15%' }
                ],
                requires: ['Primal Strength', 'Sinew Flex']
            },
            stealth: {
                name: 'CHROMATOPHORE',
                description: 'Adaptive camouflage. Blend into your surroundings.',
                bonuses: [
                    { stat: 'Stealth Bonus', value: '+40%' },
                    { stat: 'First Strike', value: '+50% damage' },
                    { stat: 'Detection', value: '-30% to enemies' }
                ],
                requires: ['Sinew Flex', 'Neural Spike']
            },
            regen: {
                name: 'SALUS MATRIX',
                description: 'Accelerated healing factor. Recover from wounds rapidly.',
                bonuses: [
                    { stat: 'HP Regen', value: '+5% per second' },
                    { stat: 'Healing Items', value: '+50% effectiveness' },
                    { stat: 'Bleed Reduction', value: '-75%' }
                ],
                requires: ['Dermal Armor', 'Neural Spike']
            },
            sonic: {
                name: 'SONIC LARYNX',
                description: 'Weaponized vocal cords. Shatter with sound.',
                bonuses: [
                    { stat: 'Sonic Damage', value: '15-25' },
                    { stat: 'Stun Chance', value: '+20%' },
                    { stat: 'Area Effect', value: '5m radius' }
                ],
                requires: ['Primal Strength', 'Neural Spike']
            },
            apex: {
                name: 'APEX PREDATOR',
                description: 'The ultimate evolution. A perfect killing machine.',
                bonuses: [
                    { stat: 'All Stats', value: '+30' },
                    { stat: 'Damage', value: '+50%' },
                    { stat: 'Damage Reduction', value: '+25%' },
                    { stat: 'Fear Aura', value: 'Enemies -20% combat' }
                ],
                requires: ['Berserker Fury', 'Salus Matrix']
            },
            phantom: {
                name: 'PHANTOM FORM',
                description: 'Phase between dimensions. Strike from the unseen.',
                bonuses: [
                    { stat: 'Ethereal', value: '50% physical immunity' },
                    { stat: 'Teleport', value: '10m range, 30s cooldown' },
                    { stat: 'Assassination', value: '+100% stealth damage' }
                ],
                requires: ['Chromatophone', 'Sonic Larynx']
            }
        };
        
        return nodeData[nodeId] || null;
    }

    shakeNode(node) {
        node.style.animation = 'none';
        node.offsetHeight; // Trigger reflow
        node.style.animation = 'shake 0.5s ease';
        
        // Add shake animation if not exists
        if (!document.getElementById('shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-5px); }
                    40% { transform: translateX(5px); }
                    60% { transform: translateX(-5px); }
                    80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    celebrateUnlock(node) {
        // Create particle burst
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'var(--bio-green)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            particle.style.transition = 'all 1s ease-out';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / 20;
                const distance = 50 + Math.random() * 50;
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }
}

// ===== CONTAMINATION ZONE MAP =====
class ZoneMapSystem {
    constructor() {
        this.canvas = document.getElementById('zone-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.zoneMarkers = document.querySelectorAll('.zone-marker');
        this.zoneInfo = {
            alpha: {
                name: 'ALPHA ZONE',
                status: 'LETHAL',
                contamination: 95,
                threat: 90,
                resource: 30,
                description: 'Formerly downtown metro area. High concentration of bio-hazardous material. Mutant activity extreme. Entry without Level 5 bio-suit is suicide.',
                warnings: ['EXTREME CONTAMINATION', 'HOSTILE MUTANTS', 'STRUCTURAL COLLAPSE RISK']
            },
            beta: {
                name: 'BETA ZONE',
                status: 'DANGEROUS',
                contamination: 75,
                threat: 70,
                resource: 50,
                description: 'Industrial sector. Chemical spills have created toxic mutants. Resources plentiful but heavily guarded.',
                warnings: ['TOXIC MUTANTS', 'UNSTABLE STRUCTURES']
            },
            gamma: {
                name: 'GAMMA ZONE',
                status: 'CAUTION',
                contamination: 45,
                threat: 40,
                resource: 70,
                description: 'Residential suburbs. Lower contamination but unpredictable mutant behavior. Good scavenging grounds.',
                warnings: ['UNPREDICTABLE MUTANTS']
            },
            delta: {
                name: 'DELTA ZONE',
                status: 'MODERATE',
                contamination: 25,
                threat: 20,
                resource: 60,
                description: 'Outskirts. Relatively safe. Frequent scavenger camps. Trade route hub.',
                warnings: ['BANDIT ACTIVITY']
            },
            epsilon: {
                name: 'EPSILON CAMP',
                status: 'SAFE ZONE',
                contamination: 5,
                threat: 5,
                resource: 40,
                description: 'Survivor settlement. Trade, rest, and information. Strict decontamination protocols.',
                warnings: []
            }
        };
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.drawContaminationField();
        this.setupEventListeners();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.drawContaminationField();
    }

    drawContaminationField() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw contamination gradients
        const zones = [
            { x: 0.2, y: 0.3, radius: 0.25, color: 'rgba(255, 0, 64, 0.1)' },
            { x: 0.45, y: 0.45, radius: 0.2, color: 'rgba(255, 170, 0, 0.1)' },
            { x: 0.7, y: 0.35, radius: 0.18, color: 'rgba(255, 255, 0, 0.08)' },
            { x: 0.55, y: 0.7, radius: 0.15, color: 'rgba(0, 255, 136, 0.05)' }
        ];
        
        zones.forEach(zone => {
            const gradient = this.ctx.createRadialGradient(
                this.canvas.width * zone.x,
                this.canvas.height * zone.y,
                0,
                this.canvas.width * zone.x,
                this.canvas.height * zone.y,
                this.canvas.width * zone.radius
            );
            
            gradient.addColorStop(0, zone.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
        
        // Draw contour lines
        this.drawContourLines();
    }

    drawContourLines() {
        this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Draw grid
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i < this.canvas.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
    }

    setupEventListeners() {
        this.zoneMarkers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                const zoneId = marker.getAttribute('data-zone');
                this.showZoneInfo(zoneId);
                
                // Add active class to clicked marker
                this.zoneMarkers.forEach(m => m.classList.remove('active'));
                marker.classList.add('active');
            });
            
            marker.addEventListener('mouseenter', () => {
                marker.style.transform = 'scale(1.2)';
            });
            
            marker.addEventListener('mouseleave', () => {
                marker.style.transform = 'scale(1)';
            });
        });
    }

    showZoneInfo(zoneId) {
        const zone = this.zoneInfo[zoneId];
        if (!zone) return;
        
        // Update zone info panel
        document.querySelector('.zone-name').textContent = zone.name;
        document.querySelector('.zone-status').textContent = zone.status;
        document.querySelector('.zone-status').style.color = this.getStatusColor(zone.status);
        
        document.getElementById('zone-contamination').style.width = `${zone.contamination}%`;
        document.getElementById('zone-contam-val').textContent = `${zone.contamination}%`;
        
        document.getElementById('zone-threat').style.width = `${zone.threat}%`;
        document.getElementById('zone-threat-val').textContent = `${zone.threat}%`;
        
        document.getElementById('zone-resource').style.width = `${zone.resource}%`;
        document.getElementById('zone-resource-val').textContent = `${zone.resource}%`;
        
        document.getElementById('zone-desc').textContent = zone.description;
        
        // Update warnings
        const warningsContainer = document.getElementById('zone-warnings');
        warningsContainer.innerHTML = zone.warnings.map(warning => 
            `<div class="zone-warning-item">⚠ ${warning}</div>`
        ).join('');
        
        // Update stat bar colors
        this.updateStatBarColor('zone-contamination', zone.contamination);
        this.updateStatBarColor('zone-threat', zone.threat);
        this.updateStatBarColor('zone-resource', zone.resource);
    }

    getStatusColor(status) {
        const colors = {
            'LETHAL': 'var(--danger-red)',
            'DANGEROUS': 'var(--warning-orange)',
            'CAUTION': 'var(--warning-amber)',
            'MODERATE': 'var(--safe-green)',
            'SAFE ZONE': 'var(--bio-cyan)'
        };
        return colors[status] || 'var(--text-dim)';
    }

    updateStatBarColor(statId, value) {
        const bar = document.getElementById(statId);
        if (!bar) return;
        
        if (value > 70) {
            bar.style.background = 'linear-gradient(90deg, var(--danger-red), var(--warning-orange))';
        } else if (value > 40) {
            bar.style.background = 'linear-gradient(90deg, var(--warning-amber), var(--warning-orange))';
        } else {
            bar.style.background = 'linear-gradient(90deg, var(--bio-green-dark), var(--bio-green))';
        }
    }
}

// ===== SURVIVAL GUIDE ANIMATIONS =====
class SurvivalGuide {
    constructor() {
        this.tipCards = document.querySelectorAll('.tip-card');
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupTipCardAnimations();
    }

    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    setupTipCardAnimations() {
        this.tipCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover sound effect (visual feedback)
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateX(10px)';
                card.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateX(0)';
                card.style.boxShadow = 'none';
            });
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Parallax effect on hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
        
        // Reveal elements on scroll
        const revealElements = document.querySelectorAll('.section-header, .mutation-card, .tech-node, .zone-marker, .tip-card');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            revealObserver.observe(el);
        });
    }
}

// ===== CONTAMINATION SIMULATION =====
class ContaminationSimulator {
    constructor() {
        this.contaminationLevel = 87.3;
        this.statusElement = document.querySelector('.status-value');
        this.init();
    }

    init() {
        this.simulateContamination();
        setInterval(() => this.simulateContamination(), 5000);
    }

    simulateContamination() {
        // Random fluctuation
        const fluctuation = (Math.random() - 0.5) * 2;
        this.contaminationLevel = Math.max(0, Math.min(100, this.contaminationLevel + fluctuation));
        
        // Update display
        this.statusElement.textContent = `${this.contaminationLevel.toFixed(1)}%`;
        
        // Update color based on level
        if (this.contaminationLevel > 80) {
            this.statusElement.style.color = 'var(--danger-red)';
        } else if (this.contaminationLevel > 60) {
            this.statusElement.style.color = 'var(--warning-orange)';
        } else if (this.contaminationLevel > 40) {
            this.statusElement.style.color = 'var(--warning-amber)';
        } else {
            this.statusElement.style.color = 'var(--safe-green)';
        }
    }
}

// ===== INITIALIZE ALL SYSTEMS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    new SporeSystem();
    new NavigationSystem();
    new TerminalEffect();
    new MutationCatalog();
    new TechTreeSystem();
    new ZoneMapSystem();
    new SurvivalGuide();
    new ScrollAnimations();
    new ContaminationSimulator();
    
    // Add loading complete effect
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Initialize scroll animations after load
        const revealElements = document.querySelectorAll('.section-header, .mutation-card, .tech-node, .zone-marker, .tip-card');
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 1000);
});

// ===== CUSTOM CURSOR =====
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.init();
    }

    init() {
        this.createCursor();
        this.setupEventListeners();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-ring"></div>
        `;
        document.body.appendChild(this.cursor);
        
        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: difference;
            }
            
            .cursor-dot {
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--bio-green);
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            
            .cursor-ring {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 1px solid var(--bio-green);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            }
            
            body:hover .cursor-ring {
                opacity: 1;
            }
            
            a:hover ~ .custom-cursor .cursor-ring,
            button:hover ~ .custom-cursor .cursor-ring {
                transform: translate(-50%, -50%) scale(1.5);
                border-color: var(--corrupt-magenta);
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            this.cursor.querySelector('.cursor-ring').style.transform = 
                'translate(-50%, -50%) scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.querySelector('.cursor-ring').style.transform = 
                'translate(-50%, -50%) scale(1)';
        });
    }
}

// Initialize custom cursor
new CustomCursor();

// ===== AUDIO FEEDBACK (Visual only) =====
class AudioFeedback {
    constructor() {
        this.feedbackElement = null;
        this.init();
    }

    init() {
        this.createFeedbackElement();
        this.setupEventListeners();
    }

    createFeedbackElement() {
        this.feedbackElement = document.createElement('div');
        this.feedbackElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: rgba(57, 255, 20, 0.1);
            border: 1px solid var(--bio-green);
            color: var(--bio-green);
            font-family: var(--font-mono);
            font-size: 0.8rem;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.feedbackElement);
    }

    setupEventListeners() {
        // Button clicks
        document.querySelectorAll('.cta-button, .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showFeedback('CLICK REGISTERED');
            });
        });
        
        // Node unlocks
        document.querySelectorAll('.tech-node').forEach(node => {
            node.addEventListener('click', () => {
                if (!node.classList.contains('locked')) {
                    this.showFeedback('NODE ACTIVATED');
                }
            });
        });
        
        // Zone selection
        document.querySelectorAll('.zone-marker').forEach(marker => {
            marker.addEventListener('click', () => {
                this.showFeedback('SCANNING ZONE...');
            });
        });
    }

    showFeedback(message) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.style.opacity = '1';
        
        setTimeout(() => {
            this.feedbackElement.style.opacity = '0';
        }, 2000);
    }
}

// Initialize audio feedback
new AudioFeedback();

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                // Scroll-dependent operations here
            });
        });
        
        // Lazy load images (if any were added)
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
}

// Initialize performance optimizer
new PerformanceOptimizer();