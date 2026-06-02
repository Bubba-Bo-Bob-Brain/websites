/* ========================================
   SANKOFA Archive — Digital Museum
   JavaScript Controller
   ======================================== */

(function() {
    'use strict';

    // --- DOM References ---
    const DOM = {
        // Background & Effects
        cosmicBg: document.getElementById('cosmic-bg'),
        cursorGlow: document.getElementById('cursor-glow'),
        
        // Navigation
        nav: document.getElementById('main-nav'),
        navLinks: document.querySelectorAll('.nav-link'),
        menuToggle: document.getElementById('menu-toggle'),
        navLinksContainer: document.querySelector('.nav-links'),
        
        // Hero
        heroSection: document.getElementById('hero'),
        
        // Artifacts
        artifactModel: document.getElementById('artifact-model'),
        modelLabel: document.getElementById('model-label'),
        catalogItems: document.querySelectorAll('.catalog-item'),
        rotateLeft: document.getElementById('rotate-left'),
        rotateRight: document.getElementById('rotate-right'),
        autoRotate: document.getElementById('auto-rotate'),
        zoomIn: document.getElementById('zoom-in'),
        zoomOut: document.getElementById('zoom-out'),
        
        // Griot Chamber
        storyTabs: document.querySelectorAll('.story-tab'),
        storyItems: document.querySelectorAll('.story-item'),
        playBtn: document.getElementById('play-btn'),
        audioProgress: document.getElementById('audio-progress'),
        audioTime: document.getElementById('audio-time'),
        
        // Star Map
        starMapCanvas: document.getElementById('star-map'),
        starInfo: document.getElementById('star-info'),
        mapZoomIn: document.getElementById('map-zoom-in'),
        mapZoomOut: document.getElementById('map-zoom-out'),
        mapReset: document.getElementById('map-reset'),
        
        // Scroll Reveal
        revealElements: document.querySelectorAll('[data-reveal]')
    };

    // --- State Management ---
    const state = {
        rotation: 0,
        zoom: 1,
        autoRotating: true,
        autoRotateSpeed: 0.5,
        currentArtifact: 'benin',
        isPlaying: false,
        audioProgress: 0,
        starMapZoom: 1,
        starMapOffsetX: 0,
        starMapOffsetY: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        currentStory: 'origin',
        navScrolled: false
    };

    // ========================================
    // Cosmic Background System
    // ========================================
    class CosmicBackground {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.stars = [];
            this.nebulae = [];
            this.resize();
            this.init();
            this.animate();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            // Create stars
            for (let i = 0; i < 200; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2
                });
            }

            // Create nebula clouds
            for (let i = 0; i < 8; i++) {
                this.nebulae.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 300 + 150,
                    color: this.getRandomNebulaColor(),
                    opacity: Math.random() * 0.03 + 0.01
                });
            }
        }

        getRandomNebulaColor() {
            const colors = [
                '212, 168, 67',   // Gold
                '199, 91, 57',    // Terracotta
                '45, 27, 105',    // Indigo
                '46, 92, 74',     // Forest
                '139, 34, 82'     // Crimson
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw nebulae
            this.nebulae.forEach(nebula => {
                const gradient = this.ctx.createRadialGradient(
                    nebula.x, nebula.y, 0,
                    nebula.x, nebula.y, nebula.radius
                );
                gradient.addColorStop(0, `rgba(${nebula.color}, ${nebula.opacity})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Draw stars
            const time = Date.now() * 0.001;
            this.stars.forEach(star => {
                const twinkle = Math.sin(time * star.twinkleSpeed * 100 + star.twinklePhase);
                const opacity = star.opacity * (0.5 + twinkle * 0.5);
                
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(245, 240, 232, ${opacity})`;
                this.ctx.fill();

                // Add glow to brighter stars
                if (star.radius > 1.2) {
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(212, 168, 67, ${opacity * 0.15})`;
                    this.ctx.fill();
                }
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================
    // Star Map System
    // ========================================
    class StarMap {
        constructor(canvas, infoPanel) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.infoPanel = infoPanel;
            this.stars = [];
            this.connections = [];
            this.zoom = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.hoveredStar = null;
            this.selectedStar = null;
            
            this.resize();
            this.init();
            this.bindEvents();
            this.animate();
        }

        resize() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }

        init() {
            // Create star nodes representing African diaspora locations
            this.stars = [
                // Africa - Ancient Centers
                { id: 'ethiopia', x: 0.65, y: 0.35, label: 'Ethiopia', desc: 'Ancient Kingdom of Aksum, cradle of civilization', color: '#D4A843', era: 'ancient', size: 8 },
                { id: 'mali', x: 0.45, y: 0.38, label: 'Mali Empire', desc: 'Center of learning and wealth, Timbuktu', color: '#D4A843', era: 'ancient', size: 7 },
                { id: 'ghana', x: 0.42, y: 0.42, label: 'Ghana Kingdom', desc: 'Land of gold and rich cultural heritage', color: '#D4A843', era: 'ancient', size: 6 },
                { id: 'zimbabwe', x: 0.62, y: 0.65, label: 'Great Zimbabwe', desc: 'Stone city of architectural brilliance', color: '#D4A843', era: 'ancient', size: 6 },
                { id: 'egypt', x: 0.60, y: 0.22, label: 'Kemet (Egypt)', desc: 'Ancient Egyptian civilization, pyramids and wisdom', color: '#D4A843', era: 'ancient', size: 9 },
                { id: 'benin', x: 0.50, y: 0.48, label: 'Benin Kingdom', desc: 'Masterful bronze art and sophisticated governance', color: '#D4A843', era: 'ancient', size: 7 },
                
                // Diaspora Routes
                { id: 'brazil', x: 0.28, y: 0.72, label: 'Brazil', desc: 'Afro-Brazilian culture, capoeira, and Candomblé', color: '#C75B39', era: 'diaspora', size: 7 },
                { id: 'cuba', x: 0.25, y: 0.45, label: 'Cuba', desc: 'Santería, rumba, and African-Cuban fusion', color: '#C75B39', era: 'diaspora', size: 6 },
                { id: 'haiti', x: 0.27, y: 0.47, label: 'Haiti', desc: 'Vodou traditions and the first Black republic', color: '#C75B39', era: 'diaspora', size: 7 },
                { id: 'jamaica', x: 0.26, y: 0.49, label: 'Jamaica', desc: 'Rastafari, reggae, and Maroon resistance', color: '#C75B39', era: 'diaspora', size: 6 },
                { id: 'usa', x: 0.22, y: 0.38, label: 'United States', desc: 'Harlem Renaissance, Civil Rights, cultural innovation', color: '#C75B39', era: 'diaspora', size: 8 },
                
                // Modern Movements
                { id: 'uk', x: 0.48, y: 0.25, label: 'United Kingdom', desc: 'Windrush generation and cultural influence', color: '#4A308A', era: 'modern', size: 6 },
                { id: 'france', x: 0.49, y: 0.28, label: 'France', desc: 'Négritude movement and African-French arts', color: '#4A308A', era: 'modern', size: 6 },
                { id: 'lagos', x: 0.52, y: 0.42, label: 'Lagos', desc: 'Nollywood, Afrobeats, tech innovation hub', color: '#4A308A', era: 'modern', size: 8 },
                { id: 'nairobi', x: 0.68, y: 0.48, label: 'Nairobi', desc: 'Silicon Savannah and creative renaissance', color: '#4A308A', era: 'modern', size: 7 },
                { id: 'accra', x: 0.46, y: 0.44, label: 'Accra', desc: 'Year of Return, cultural pilgrimage destination', color: '#4A308A', era: 'modern', size: 7 },
                
                // Future Horizons
                { id: 'mars', x: 0.85, y: 0.15, label: 'Mars Colony', desc: 'Future African settlement beyond Earth', color: '#4A7C5C', era: 'future', size: 5 },
                { id: 'lunar', x: 0.78, y: 0.08, label: 'Lunar Base', desc: 'African space agency presence', color: '#4A7C5C', era: 'future', size: 5 },
                { id: 'orbital', x: 0.90, y: 0.30, label: 'Orbital Station', desc: 'Pan-African space cooperative', color: '#4A7C5C', era: 'future', size: 4 }
            ];

            // Create connections between stars
            this.connections = [
                { from: 'ethiopia', to: 'egypt' },
                { from: 'mali', to: 'ghana' },
                { from: 'benin', to: 'mali' },
                { from: 'zimbabwe', to: 'ethiopia' },
                { from: 'ethiopia', to: 'brazil' },
                { from: 'benin', to: 'brazil' },
                { from: 'ghana', to: 'usa' },
                { from: 'benin', to: 'cuba' },
                { from: 'benin', to: 'haiti' },
                { from: 'ghana', to: 'jamaica' },
                { from: 'usa', to: 'uk' },
                { from: 'usa', to: 'france' },
                { from: 'ghana', to: 'lagos' },
                { from: 'ethiopia', to: 'nairobi' },
                { from: 'lagos', to: 'accra' },
                { from: 'accra', to: 'usa' },
                { from: 'nairobi', to: 'mars' },
                { from: 'lagos', to: 'lunar' },
                { from: 'accra', to: 'orbital' }
            ];
        }

        bindEvents() {
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
            this.canvas.addEventListener('click', (e) => this.handleClick(e));
            this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        }

        getMousePos(e) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        screenToStarCoords(x, y) {
            return {
                x: (x - this.offsetX) / this.zoom / this.canvas.width,
                y: (y - this.offsetY) / this.zoom / this.canvas.height
            };
        }

        findStarAtPos(x, y) {
            const pos = this.screenToStarCoords(x, y);
            for (const star of this.stars) {
                const dx = pos.x - star.x;
                const dy = pos.y - star.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.02) return star;
            }
            return null;
        }

        handleMouseMove(e) {
            const pos = this.getMousePos(e);
            
            if (this.isDragging) {
                const dx = pos.x - this.dragStartX;
                const dy = pos.y - this.dragStartY;
                this.offsetX += dx;
                this.offsetY += dy;
                this.dragStartX = pos.x;
                this.dragStartY = pos.y;
            }

            this.hoveredStar = this.findStarAtPos(pos.x, pos.y);
            this.canvas.style.cursor = this.hoveredStar ? 'pointer' : 'grab';
        }

        handleMouseDown(e) {
            const pos = this.getMousePos(e);
            this.isDragging = true;
            this.dragStartX = pos.x;
            this.dragStartY = pos.y;
            this.canvas.style.cursor = 'grabbing';
        }

        handleMouseUp(e) {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        }

        handleMouseLeave(e) {
            this.isDragging = false;
            this.hoveredStar = null;
        }

        handleClick(e) {
            if (this.hoveredStar) {
                this.selectedStar = this.hoveredStar;
                this.updateInfoPanel(this.hoveredStar);
            }
        }

        handleWheel(e) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoom = Math.max(0.5, Math.min(3, this.zoom + delta));
        }

        updateInfoPanel(star) {
            this.infoPanel.innerHTML = `
                <h3 class="info-title">${star.label}</h3>
                <p class="info-description">${star.desc}</p>
            `;
        }

        drawStar(star, time) {
            const x = star.x * this.canvas.width * this.zoom + this.offsetX;
            const y = star.y * this.canvas.height * this.zoom + this.offsetY;
            const size = star.size * this.zoom;
            
            // Pulsing effect
            const pulse = Math.sin(time * 2 + star.x * 10) * 0.3 + 1;
            const finalSize = size * pulse;

            // Glow
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, finalSize * 3);
            gradient.addColorStop(0, star.color + '66');
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, finalSize * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Core
            this.ctx.fillStyle = star.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, finalSize, 0, Math.PI * 2);
            this.ctx.fill();

            // Hovered state
            if (star === this.hoveredStar) {
                this.ctx.strokeStyle = '#F5F0E8';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, finalSize + 4, 0, Math.PI * 2);
                this.ctx.stroke();

                // Label
                this.ctx.fillStyle = '#F5F0E8';
                this.ctx.font = `${12 * this.zoom}px Outfit`;
                this.ctx.fillText(star.label, x + finalSize + 8, y + 4);
            }
        }

        drawConnection(from, to) {
            const x1 = from.x * this.canvas.width * this.zoom + this.offsetX;
            const y1 = from.y * this.canvas.height * this.zoom + this.offsetY;
            const x2 = to.x * this.canvas.width * this.zoom + this.offsetX;
            const y2 = to.y * this.canvas.height * this.zoom + this.offsetY;

            this.ctx.strokeStyle = 'rgba(212, 168, 67, 0.15)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        animate() {
            const time = Date.now() * 0.001;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw connections
            this.connections.forEach(conn => {
                const from = this.stars.find(s => s.id === conn.from);
                const to = this.stars.find(s => s.id === conn.to);
                if (from && to) this.drawConnection(from, to);
            });

            // Draw stars
            this.stars.forEach(star => this.drawStar(star, time));

            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================
    // Holographic Artifact Viewer
    // ========================================
    class ArtifactViewer {
        constructor() {
            this.rotation = 0;
            this.zoom = 1;
            this.autoRotating = true;
            this.speed = 0.5;
            this.currentArtifact = 'benin';
            this.model = DOM.artifactModel;
            this.label = DOM.modelLabel;
            
            this.artifacts = {
                benin: { name: 'Benin Bronze', color: '#D4A843' },
                mask: { name: 'Dan Ceremonial Mask', color: '#8B6F47' },
                stool: { name: 'Golden Stool', color: '#F5D76E' },
                textile: { name: 'Kente Royal Cloth', color: '#E8A87C' },
                staff: { name: 'Osun Sacred Staff', color: '#7BA05B' },
                drum: { name: 'Djembe Royal Drum', color: '#A67B5B' }
            };

            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            DOM.rotateLeft.addEventListener('click', () => {
                this.rotation -= 30;
                this.updateModel();
            });

            DOM.rotateRight.addEventListener('click', () => {
                this.rotation += 30;
                this.updateModel();
            });

            DOM.autoRotate.addEventListener('click', () => {
                this.autoRotating = !this.autoRotating;
                DOM.autoRotate.classList.toggle('active');
            });

            DOM.zoomIn.addEventListener('click', () => {
                this.zoom = Math.min(1.5, this.zoom + 0.1);
                this.updateModel();
            });

            DOM.zoomOut.addEventListener('click', () => {
                this.zoom = Math.max(0.5, this.zoom - 0.1);
                this.updateModel();
            });

            DOM.catalogItems.forEach(item => {
                item.addEventListener('click', () => {
                    DOM.catalogItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    this.currentArtifact = item.dataset.artifact;
                    this.label.textContent = item.dataset.name;
                    this.updateModel();
                });
            });
        }

        updateModel() {
            this.model.style.transform = `scale(${this.zoom}) rotateY(${this.rotation}deg)`;
        }

        animate() {
            if (this.autoRotating) {
                this.rotation += this.speed;
                this.model.style.transform = `scale(${this.zoom}) rotateY(${this.rotation}deg)`;
            }
            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================
    // Griot Chamber Audio Simulator
    // ========================================
    class GriotChamber {
        constructor() {
            this.isPlaying = false;
            this.progress = 0;
            this.duration = 272; // 4:32 in seconds
            this.currentStory = 'origin';
            
            this.stories = {
                origin: { duration: 272, timeStr: '4:32' },
                diaspora: { duration: 375, timeStr: '6:15' },
                future: { duration: 348, timeStr: '5:48' }
            };

            this.bindEvents();
        }

        bindEvents() {
            DOM.storyTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.dataset.target;
                    this.switchStory(target);
                });
            });

            if (DOM.playBtn) {
                DOM.playBtn.addEventListener('click', () => this.togglePlay());
            }
        }

        switchStory(storyId) {
            this.currentStory = storyId;
            this.progress = 0;
            this.isPlaying = false;
            this.updatePlayButton();
            
            DOM.storyTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.target === storyId);
            });
            
            DOM.storyItems.forEach(item => {
                item.classList.toggle('active', item.dataset.story === storyId);
            });

            if (DOM.audioProgress) {
                DOM.audioProgress.style.width = '0%';
            }
            if (DOM.audioTime) {
                DOM.audioTime.textContent = `0:00 / ${this.stories[storyId].timeStr}`;
            }
        }

        togglePlay() {
            this.isPlaying = !this.isPlaying;
            this.updatePlayButton();
        }

        updatePlayButton() {
            if (!DOM.playBtn) return;
            const playIcon = DOM.playBtn.querySelector('.play-icon');
            const pauseIcon = DOM.playBtn.querySelector('.pause-icon');
            const label = DOM.playBtn.querySelector('.play-label');

            if (this.isPlaying) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                label.textContent = 'Pause Narration';
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                label.textContent = 'Play Narration';
            }
        }

        update() {
            if (!this.isPlaying) return;

            this.progress += 0.1;
            const story = this.stories[this.currentStory];
            
            if (this.progress >= story.duration) {
                this.progress = 0;
                this.isPlaying = false;
                this.updatePlayButton();
            }

            const percent = (this.progress / story.duration) * 100;
            if (DOM.audioProgress) {
                DOM.audioProgress.style.width = `${percent}%`;
            }
            if (DOM.audioTime) {
                const current = this.formatTime(this.progress);
                DOM.audioTime.textContent = `${current} / ${story.timeStr}`;
            }
        }

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // ========================================
    // Scroll Reveal System
    // ========================================
    class ScrollReveal {
        constructor() {
            this.elements = DOM.revealElements;
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // Navigation Controller
    // ========================================
    class NavigationController {
        constructor() {
            this.sections = document.querySelectorAll('section[id]');
            this.init();
        }

        init() {
            // Scroll behavior
            window.addEventListener('scroll', () => this.handleScroll());
            
            // Menu toggle
            if (DOM.menuToggle) {
                DOM.menuToggle.addEventListener('click', () => {
                    DOM.navLinksContainer.classList.toggle('open');
                });
            }

            // Close menu on link click (mobile)
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    DOM.navLinksContainer.classList.remove('open');
                });
            });

            // Smooth scroll
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }

        handleScroll() {
            const scrollY = window.scrollY;
            
            // Nav background
            if (scrollY > 100) {
                DOM.nav.classList.add('scrolled');
            } else {
                DOM.nav.classList.remove('scrolled');
            }

            // Active section detection
            let current = '';
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                if (scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === current) {
                    link.classList.add('active');
                }
            });
        }
    }

    // ========================================
    // Cursor Glow Effect
    // ========================================
    class CursorGlow {
        constructor() {
            this.element = DOM.cursorGlow;
            this.x = 0;
            this.y = 0;
            this.currentX = 0;
            this.currentY = 0;
            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.x = e.clientX;
                this.y = e.clientY;
            });
        }

        animate() {
            // Smooth follow
            this.currentX += (this.x - this.currentX) * 0.1;
            this.currentY += (this.y - this.currentY) * 0.1;

            this.element.style.left = `${this.currentX}px`;
            this.element.style.top = `${this.currentY}px`;

            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================
    // Initialize Everything
    // ========================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                startApp();
            });
        } else {
            startApp();
        }
    }

    function startApp() {
        // Initialize cosmic background
        if (DOM.cosmicBg) {
            new CosmicBackground(DOM.cosmicBg);
        }

        // Initialize cursor glow
        if (DOM.cursorGlow) {
            new CursorGlow();
        }

        // Initialize scroll reveal
        new ScrollReveal();

        // Initialize navigation
        new NavigationController();

        // Initialize artifact viewer
        const artifactViewer = new ArtifactViewer();

        // Initialize griot chamber
        const griotChamber = new GriotChamber();

        // Initialize star map
        if (DOM.starMapCanvas) {
            const starMap = new StarMap(DOM.starMapCanvas, DOM.starInfo);
            
            // Bind map controls
            if (DOM.mapZoomIn) {
                DOM.mapZoomIn.addEventListener('click', () => {
                    starMap.zoom = Math.min(3, starMap.zoom + 0.2);
                });
            }
            if (DOM.mapZoomOut) {
                DOM.mapZoomOut.addEventListener('click', () => {
                    starMap.zoom = Math.max(0.5, starMap.zoom - 0.2);
                });
            }
            if (DOM.mapReset) {
                DOM.mapReset.addEventListener('click', () => {
                    starMap.zoom = 1;
                    starMap.offsetX = 0;
                    starMap.offsetY = 0;
                });
            }
        }

        // Animation loop for griot audio simulation
        function gameLoop() {
            griotChamber.update();
            requestAnimationFrame(gameLoop);
        }
        gameLoop();

        console.log('SANKOFA Archive initialized successfully.');
    }

    // Start the application
    init();

})();