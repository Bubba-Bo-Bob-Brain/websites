/* ═══════════════════════════════════════════════════════════════
   ĀKÓM — Digital Museum & Ancestral Archive
   Master JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── STATE ───
    const state = {
        currentSection: 'origin',
        isLoaded: false,
        artifactAutoRotate: true,
        currentArtifact: 0,
        currentGriot: 0,
        isPlaying: false,
        soundEnabled: false,
        timelineScrollPos: 0
    };

    // ─── ARTIFACT DATA ───
    const artifacts = [
        {
            name: "The Scepter of Taharqa",
            era: "~300 BCE",
            origin: "Kingdom of Kush",
            description: "A ceremonial scepter adorned with gold leaf and lapis lazuli, symbolizing divine authority over the Upper and Lower kingdoms. Found in the burial chambers of Jebel Barkal, this artifact connects the earthly realm to the cosmic order of Ma'at.",
            material: "Gold, Lapis Lazuli, Ebony",
            dimensions: "142cm × 8cm",
            resonance: "432 Hz",
            legend: "When the scepter sings, the ancestors listen. When it rests, the rivers remember.",
            glyphs: ["𓃀", "𓂋", "𓏏", "𓂧", "𓊽", "𓋴"]
        },
        {
            name: "Eye of Horus Amulet",
            era: "~2500 BCE",
            origin: "Old Kingdom, Kemet",
            description: "A protective amulet carved from turquoise and gold, believed to offer divine protection and restore wholeness. The Wedjat eye represents the moon's healing power and the cosmic balance between order and chaos.",
            material: "Turquoise, Gold, Faience",
            dimensions: "8cm × 6cm",
            resonance: "528 Hz",
            legend: "The eye that sees beyond sight, the light that heals beyond time.",
            glyphs: ["𓂀", "𓅃", "𓃒", "𓇯", "𓊹", "𓋹"]
        },
        {
            name: "Anubis Guardian Figure",
            era: "~1350 BCE",
            origin: "New Kingdom, Thebes",
            description: "A jackal-headed guardian statue that once stood watch over the sacred burial chambers. Crafted from black granite with gold inlays, it embodies the divine guide who leads souls through the underworld to eternal life.",
            material: "Black Granite, Gold Leaf",
            dimensions: "89cm × 32cm",
            resonance: "396 Hz",
            legend: "In the shadow between worlds, the guardian waits — patient as stone, faithful as starlight.",
            glyphs: ["𓃭", "𓇋", "𓈖", "𓊪", "𓏏", "𓂧"]
        },
        {
            name: "Ankh of Eternal Flow",
            era: "~1800 BCE",
            origin: "Middle Kingdom, Abydos",
            description: "An ankh pendant of extraordinary craftsmanship, cast in electrum and set with carnelian. This symbol of life was used in temple ceremonies to channel the eternal breath of the gods into the mortal realm.",
            material: "Electrum, Carnelian",
            dimensions: "15cm × 9cm",
            resonance: "639 Hz",
            legend: "The key that opens no door, yet unlocks all eternity.",
            glyphs: ["𓋹", "𓁹", "𓂝", "𓈖", "𓆎", "𓏏"]
        },
        {
            name: "Solar Disk of Ra",
            era: "~1500 BCE",
            origin: "Temple of Karnak",
            description: "A ceremonial solar disk representing Ra's journey across the sky. The intricate engravings depict the twelve hours of day, each guarded by a different deity, mapping the sun's eternal voyage through creation.",
            material: "Pure Gold, Red Jasper",
            dimensions: "45cm diameter",
            resonance: "741 Hz",
            legend: "As the sun rises, so too does the memory of all who came before.",
            glyphs: ["𓇳", "𓂀", "𓃀", "𓅃", "𓊹", "𓋴"]
        },
        {
            name: "Scarab of Becoming",
            era: "~1200 BCE",
            origin: "Valley of Kings",
            description: "A heart scarab amulet inscribed with Chapter 30B of the Book of the Dead. Placed upon the mummy's heart, it ensured the deceased would speak favorably during the weighing of the heart ceremony in the afterlife.",
            material: "Nephrite Jade, Gold Wire",
            dimensions: "12cm × 8cm",
            resonance: "852 Hz",
            legend: "From death, transformation. From silence, song. From dust, the stars remember.",
            glyphs: ["𓆣", "𓁹", "𓂝", "𓇯", "𓏏", "𓋹"]
        }
    ];

    // ─── GRIOT DATA ───
    const griots = [
        {
            quote: "In the beginning, there was the word —",
            continue: "and the word was a drumbeat, and the drumbeat was the heartbeat of the first mother.",
            name: "Kwame the Elder",
            tradition: "Mandé Griot Tradition"
        },
        {
            quote: "The Dogon looked to the stars and saw what others could not —",
            continue: "two companions dancing around Sirius, a truth the telescopes would not confirm for seven hundred years.",
            name: "Amadou of Bandiagara",
            tradition: "Dogon Star Keepers"
        },
        {
            quote: "She crossed the great waters with fire in her heart —",
            continue: "Queen Nzinga, who turned the ocean into a road and the road into a throne.",
            name: "Yemoja's Voice",
            tradition: "Yoruba Oral Lineage"
        },
        {
            quote: "Iron bends to the will of fire, but the mountain bends to no one —",
            continue: "Great Zimbabwe stands as proof that stone can hold a civilization's memory forever.",
            name: "Chaminuka's Echo",
            tradition: "Shona Spirit Mediums"
        },
        {
            quote: "The river remembers every raindrop, every tear, every song —",
            continue: "and carries them all to the sea, where the ancestors gather to listen.",
            name: "Nomkhululeko",
            tradition: "Zulu Sangoma Tradition"
        }
    ];

    // ─── CONSTELLATION DATA ───
    const constellations = [
        { name: "Kingdom of Kush", desc: "The Nubian powerhouse that rivaled and eventually ruled Kemet. Their star alignments mirror the pyramids of Meroë.", x: 0.2, y: 0.3, type: "civilization" },
        { name: "Great Zimbabwe", desc: "The stone city whose walls echo with the whispers of a trading empire that spanned the Indian Ocean.", x: 0.5, y: 0.7, type: "civilization" },
        { name: "Mali Empire", desc: "From Sundiata to Mansa Musa — the golden realm that lit the intellectual torch for all of West Africa.", x: 0.15, y: 0.5, type: "civilization" },
        { name: "Kingdom of Aksum", desc: "The Horn of Africa's ancient power, keepers of the Ark and architects of towering stelae.", x: 0.4, y: 0.35, type: "civilization" },
        { name: "Trans-Saharan Route", desc: "The golden thread connecting West Africa to the Mediterranean — salt flowing south, gold flowing north.", x: 0.25, y: 0.4, type: "trade" },
        { name: "Indian Ocean Network", desc: "Monsoon winds carried African merchants to India, China, and beyond — a maritime web of exchange.", x: 0.6, y: 0.55, type: "trade" },
        { name: "Bantu Expansion", desc: "The great migration that spread languages, iron-working, and agriculture across the entire continent.", x: 0.35, y: 0.6, type: "migration" },
        { name: "Atlantic Crossing", desc: "The forced diaspora — yet even in bondage, African culture transformed the Americas.", x: 0.1, y: 0.65, type: "migration" },
        { name: "Sirius Alignment", desc: "The Dogon star knowledge — ancient wisdom encoded in ceremony and oral tradition.", x: 0.7, y: 0.25, type: "cosmic" },
        { name: "Orion's Belt", desc: "Three pyramids, three stars — the earthly mirror of celestial architecture.", x: 0.8, y: 0.4, type: "cosmic" }
    ];

    // ─── DOM REFERENCES ───
    const dom = {
        loadingPortal: document.getElementById('loading-portal'),
        cosmicCanvas: document.getElementById('cosmic-canvas'),
        nav: document.getElementById('adinkra-nav'),
        navBtns: document.querySelectorAll('.nav-btn'),
        mobileToggle: document.getElementById('mobile-nav-toggle'),
        mainContent: document.getElementById('main-content'),
        sections: document.querySelectorAll('.section'),
        
        // Artifact
        artifactObject: document.getElementById('artifact-object'),
        rotateLeft: document.getElementById('rotate-left'),
        rotateRight: document.getElementById('rotate-right'),
        rotateToggle: document.getElementById('rotate-toggle'),
        artifactName: document.getElementById('artifact-name'),
        artifactDescription: document.getElementById('artifact-description'),
        carouselItems: document.querySelectorAll('.carousel-item'),
        
        // Star Map
        starmapCanvas: document.getElementById('starmap-canvas'),
        constellationName: document.getElementById('constellation-name'),
        constellationDesc: document.getElementById('constellation-desc'),
        mapBtns: document.querySelectorAll('.map-btn'),
        
        // Griot
        griotText: document.getElementById('griot-text'),
        griotName: document.getElementById('griot-name'),
        griotTradition: document.getElementById('griot-tradition'),
        griotPlay: document.getElementById('griot-play'),
        griotPrev: document.getElementById('griot-prev'),
        griotNext: document.getElementById('griot-next'),
        audioVisualizer: document.getElementById('audio-visualizer'),
        playlistItems: document.querySelectorAll('.playlist-item'),
        
        // Timeline
        timelineScroll: document.getElementById('timeline-scroll'),
        timelineProgress: document.getElementById('timeline-progress'),
        timelinePrev: document.getElementById('timeline-prev'),
        timelineNext: document.getElementById('timeline-next'),
        eraLabels: document.querySelectorAll('.era-label'),
        
        // Sound
        soundToggle: document.querySelector('.sound-toggle')
    };

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        initCosmicCanvas();
        initLoadingPortal();
        initNavigation();
        initMobileNav();
        initArtifactViewer();
        initStarMap();
        initGriotTheater();
        initTimeline();
        initRevealAnimations();
        initSoundToggle();
    }

    // ═══════════════════════════════════════════════════════════════
    // COSMIC PARTICLE CANVAS
    // ═══════════════════════════════════════════════════════════════
    
    function initCosmicCanvas() {
        const canvas = dom.cosmicCanvas;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function createParticles() {
            particles = [];
            const count = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
            
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.5 + 0.2,
                    hue: Math.random() > 0.7 ? 45 : (Math.random() > 0.5 ? 190 : 280)
                });
            }
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
                ctx.fill();
                
                // Add glow effect for larger particles
                if (p.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity * 0.1})`;
                    ctx.fill();
                }
            });
            
            // Draw connections between nearby particles
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(212, 168, 85, ${0.1 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(drawParticles);
        }
        
        resize();
        createParticles();
        drawParticles();
        
        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // LOADING PORTAL
    // ═══════════════════════════════════════════════════════════════
    
    function initLoadingPortal() {
        setTimeout(() => {
            dom.loadingPortal.classList.add('hidden');
            state.isLoaded = true;
            revealOriginSection();
        }, 2800);
    }
    
    function revealOriginSection() {
        // Reveal title lines with stagger
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('revealed');
            }, 300 + (i * 200));
        });
        
        // Reveal subtitle
        const subtitle = document.querySelector('.origin-subtitle');
        if (subtitle) {
            setTimeout(() => {
                subtitle.classList.add('revealed');
            }, 1000);
        }
        
        // Reveal stats with counter animation
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('revealed');
                const counter = card.querySelector('[data-count]');
                if (counter) {
                    animateCounter(counter);
                }
            }, 1200 + (i * 150));
        });
        
        // Reveal CTA
        const cta = document.querySelector('.origin-cta');
        if (cta) {
            setTimeout(() => {
                cta.classList.add('revealed');
            }, 1800);
        }
    }
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(update);
    }

    // ═══════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════
    
    function initNavigation() {
        dom.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                navigateToSection(section);
            });
        });
        
        // CTA navigation
        const ctaBtn = document.querySelector('.cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                const target = ctaBtn.dataset.navigate;
                navigateToSection(target);
            });
        }
    }
    
    function navigateToSection(sectionId) {
        if (sectionId === state.currentSection) return;
        
        // Update nav buttons
        dom.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });
        
        // Hide current section
        const currentSection = document.getElementById(state.currentSection);
        if (currentSection) {
            currentSection.classList.remove('active');
        }
        
        // Show new section
        const newSection = document.getElementById(sectionId);
        if (newSection) {
            newSection.classList.add('active');
            
            // Trigger section-specific animations
            setTimeout(() => {
                triggerSectionReveals(sectionId);
            }, 100);
        }
        
        state.currentSection = sectionId;
        
        // Close mobile nav
        dom.nav.classList.remove('open');
        dom.mobileToggle.classList.remove('active');
    }
    
    function triggerSectionReveals(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const reveals = section.querySelectorAll('[data-reveal]');
        reveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, i * 100);
        });
        
        // Initialize section-specific features
        if (sectionId === 'star-map') {
            initStarMapCanvas();
        }
    }
    
    function initMobileNav() {
        dom.mobileToggle.addEventListener('click', () => {
            dom.nav.classList.toggle('open');
            dom.mobileToggle.classList.toggle('active');
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // ARTIFACT VIEWER
    // ═══════════════════════════════════════════════════════════════
    
    function initArtifactViewer() {
        let rotationY = 0;
        let rotationX = -15;
        let isDragging = false;
        let lastX, lastY;
        
        // Rotation controls
        dom.rotateLeft.addEventListener('click', () => {
            rotationY -= 45;
            updateArtifactRotation();
        });
        
        dom.rotateRight.addEventListener('click', () => {
            rotationY += 45;
            updateArtifactRotation();
        });
        
        dom.rotateToggle.addEventListener('click', () => {
            state.artifactAutoRotate = !state.artifactAutoRotate;
            dom.artifactObject.classList.toggle('paused', !state.artifactAutoRotate);
            dom.rotateToggle.style.borderColor = state.artifactAutoRotate ? 'var(--cyan)' : 'var(--gold-muted)';
        });
        
        // Drag to rotate
        const hologram = document.getElementById('artifact-hologram');
        
        hologram.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            dom.artifactObject.classList.add('paused');
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            
            rotationY += deltaX * 0.5;
            rotationX += deltaY * 0.5;
            rotationX = Math.max(-60, Math.min(60, rotationX));
            
            updateArtifactRotation();
            
            lastX = e.clientX;
            lastY = e.clientY;
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (state.artifactAutoRotate) {
                    dom.artifactObject.classList.remove('paused');
                }
            }
        });
        
        function updateArtifactRotation() {
            dom.artifactObject.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        }
        
        // Carousel navigation
        dom.carouselItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                selectArtifact(index);
            });
        });
        
        // Carousel buttons
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = (state.currentArtifact - 1 + artifacts.length) % artifacts.length;
                selectArtifact(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = (state.currentArtifact + 1) % artifacts.length;
                selectArtifact(newIndex);
            });
        }
    }
    
    function selectArtifact(index) {
        state.currentArtifact = index;
        const artifact = artifacts[index];
        
        // Update carousel active state
        dom.carouselItems.forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.index) === index);
        });
        
        // Update info panel
        dom.artifactName.textContent = artifact.name;
        dom.artifactDescription.textContent = artifact.description;
        
        // Update metadata
        const metaValues = document.querySelectorAll('.meta-value');
        if (metaValues.length >= 3) {
            metaValues[0].textContent = artifact.material;
            metaValues[1].textContent = artifact.dimensions;
            metaValues[2].textContent = artifact.resonance;
        }
        
        // Update era and origin
        const infoEra = document.querySelector('.info-era');
        const infoOrigin = document.querySelector('.info-origin');
        if (infoEra) infoEra.textContent = artifact.era;
        if (infoOrigin) infoOrigin.textContent = artifact.origin;
        
        // Update legend
        const legendText = document.querySelector('.legend-text');
        if (legendText) legendText.textContent = `"${artifact.legend}"`;
        
        // Update artifact glyphs
        const faces = document.querySelectorAll('.artifact-glyph');
        faces.forEach((face, i) => {
            if (artifact.glyphs[i]) {
                face.textContent = artifact.glyphs[i];
            }
        });
        
        // Scroll carousel to show selected item
        const carouselTrack = document.getElementById('artifact-carousel');
        if (carouselTrack) {
            const selectedItem = carouselTrack.children[index];
            if (selectedItem) {
                selectedItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // STAR MAP
    // ═══════════════════════════════════════════════════════════════
    
    let starmapInitialized = false;
    let starmapCtx;
    let starmapWidth, starmapHeight;
    let currentView = 'civilizations';
    let hoveredConstellation = null;
    
    function initStarMap() {
        dom.mapBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dom.mapBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentView = btn.dataset.view;
                if (starmapInitialized) drawStarMap();
            });
        });
    }
    
    function initStarMapCanvas() {
        if (starmapInitialized) return;
        
        const canvas = dom.starmapCanvas;
        if (!canvas) return;
        
        starmapCtx = canvas.getContext('2d');
        
        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            starmapWidth = canvas.width;
            starmapHeight = canvas.height;
            drawStarMap();
        }
        
        resize();
        window.addEventListener('resize', resize);
        
        // Mouse interaction
        canvas.addEventListener('mousemove', handleStarMapHover);
        canvas.addEventListener('mouseleave', () => {
            hoveredConstellation = null;
            drawStarMap();
        });
        
        starmapInitialized = true;
    }
    
    function drawStarMap() {
        if (!starmapCtx) return;
        
        const ctx = starmapCtx;
        ctx.clearRect(0, 0, starmapWidth, starmapHeight);
        
        // Draw background stars
        drawBackgroundStars(ctx);
        
        // Draw connections based on view
        drawConnections(ctx);
        
        // Draw constellation points
        drawConstellationPoints(ctx);
    }
    
    function drawBackgroundStars(ctx) {
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * starmapWidth;
            const y = Math.random() * starmapHeight;
            const size = Math.random() * 1.5 + 0.5;
            const opacity = Math.random() * 0.5 + 0.2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        }
    }
    
    function drawConnections(ctx) {
        const connections = {
            civilizations: [
                [0, 3], [1, 2], [2, 3]
            ],
            trade: [
                [4, 5]
            ],
            migration: [
                [6, 7]
            ],
            cosmic: [
                [8, 9]
            ]
        };
        
        const visibleTypes = currentView === 'civilizations' 
            ? ['civilization'] 
            : [currentView.slice(0, -1)];
        
        const relevantConstellations = constellations.filter(c => 
            visibleTypes.includes(c.type) || currentView === 'civilizations'
        );
        
        // Draw connections
        if (connections[currentView]) {
            connections[currentView].forEach(([i, j]) => {
                const c1 = constellations[i];
                const c2 = constellations[j];
                
                ctx.beginPath();
                ctx.moveTo(c1.x * starmapWidth, c1.y * starmapHeight);
                ctx.lineTo(c2.x * starmapWidth, c2.y * starmapHeight);
                
                const gradient = ctx.createLinearGradient(
                    c1.x * starmapWidth, c1.y * starmapHeight,
                    c2.x * starmapWidth, c2.y * starmapHeight
                );
                
                const color = getTypeColor(c1.type);
                gradient.addColorStop(0, color.replace('1)', '0.6)'));
                gradient.addColorStop(1, color.replace('1)', '0.6)'));
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            });
        }
    }
    
    function drawConstellationPoints(ctx) {
        const visibleTypes = currentView === 'civilizations' 
            ? ['civilization'] 
            : [currentView.slice(0, -1)];
        
        constellations.forEach((c, index) => {
            const isVisible = visibleTypes.includes(c.type) || 
                             (currentView === 'civilizations' && c.type === 'civilization');
            
            if (!isVisible) return;
            
            const x = c.x * starmapWidth;
            const y = c.y * starmapHeight;
            const isHovered = hoveredConstellation === index;
            const baseSize = isHovered ? 12 : 8;
            
            // Outer glow
            ctx.beginPath();
            ctx.arc(x, y, baseSize * 3, 0, Math.PI * 2);
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, baseSize * 3);
            glowGradient.addColorStop(0, getTypeColor(c.type).replace('1)', '0.3)'));
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.fill();
            
            // Core
            ctx.beginPath();
            ctx.arc(x, y, baseSize, 0, Math.PI * 2);
            ctx.fillStyle = getTypeColor(c.type);
            ctx.fill();
            
            // Inner highlight
            ctx.beginPath();
            ctx.arc(x, y, baseSize * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            
            // Label
            if (isHovered) {
                ctx.font = '12px "Space Mono", monospace';
                ctx.fillStyle = getTypeColor(c.type);
                ctx.textAlign = 'center';
                ctx.fillText(c.name, x, y - baseSize - 10);
            }
        });
    }
    
    function getTypeColor(type) {
        switch(type) {
            case 'civilization': return 'rgba(212, 168, 85, 1)';
            case 'trade': return 'rgba(45, 138, 78, 1)';
            case 'migration': return 'rgba(217, 119, 6, 1)';
            case 'cosmic': return 'rgba(168, 85, 247, 1)';
            default: return 'rgba(212, 168, 85, 1)';
        }
    }
    
    function handleStarMapHover(e) {
        const rect = dom.starmapCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const visibleTypes = currentView === 'civilizations' 
            ? ['civilization'] 
            : [currentView.slice(0, -1)];
        
        let found = null;
        constellations.forEach((c, index) => {
            if (!visibleTypes.includes(c.type) && 
                !(currentView === 'civilizations' && c.type === 'civilization')) {
                return;
            }
            
            const cx = c.x * starmapWidth;
            const cy = c.y * starmapHeight;
            const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            
            if (dist < 20) {
                found = index;
            }
        });
        
        if (found !== hoveredConstellation) {
            hoveredConstellation = found;
            drawStarMap();
            
            if (found !== null) {
                dom.constellationName.textContent = constellations[found].name;
                dom.constellationDesc.textContent = constellations[found].desc;
            } else {
                dom.constellationName.textContent = "Select a Star Cluster";
                dom.constellationDesc.textContent = "Hover over the celestial nodes to discover the stories woven into the night sky.";
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // GRIOT THEATER
    // ═══════════════════════════════════════════════════════════════
    
    function initGriotTheater() {
        // Play button
        dom.griotPlay.addEventListener('click', toggleGriotPlayback);
        
        // Navigation
        dom.griotPrev.addEventListener('click', () => {
            const newIndex = (state.currentGriot - 1 + griots.length) % griots.length;
            selectGriot(newIndex);
        });
        
        dom.griotNext.addEventListener('click', () => {
            const newIndex = (state.currentGriot + 1) % griots.length;
            selectGriot(newIndex);
        });
        
        // Playlist items
        dom.playlistItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.griotIndex);
                selectGriot(index);
            });
        });
    }
    
    function selectGriot(index) {
        state.currentGriot = index;
        const griot = griots[index];
        
        // Update playlist
        dom.playlistItems.forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.griotIndex) === index);
        });
        
        // Update text display with animation
        const griotLines = document.querySelectorAll('.griot-line');
        griotLines.forEach(line => line.classList.remove('active'));
        
        setTimeout(() => {
            dom.griotText.innerHTML = `
                <p class="griot-line active">
                    <span class="griot-quote">"${griot.quote}</span>
                    <span class="griot-continue">${griot.continue}"</span>
                </p>
            `;
        }, 300);
        
        // Update attribution
        dom.griotName.textContent = griot.name;
        dom.griotTradition.textContent = griot.tradition;
    }
    
    function toggleGriotPlayback() {
        state.isPlaying = !state.isPlaying;
        
        const playIcon = dom.griotPlay.querySelector('.play-icon');
        playIcon.textContent = state.isPlaying ? '⏸' : '▶';
        
        // Animate visualizer
        const vizBars = dom.audioVisualizer.querySelectorAll('.viz-bar');
        vizBars.forEach(bar => {
            bar.classList.toggle('playing', state.isPlaying);
        });
        
        // If playing, auto-advance through griots
        if (state.isPlaying) {
            startGriotPlayback();
        }
    }
    
    let griotPlaybackInterval;
    
    function startGriotPlayback() {
        if (griotPlaybackInterval) clearInterval(griotPlaybackInterval);
        
        griotPlaybackInterval = setInterval(() => {
            if (!state.isPlaying) {
                clearInterval(griotPlaybackInterval);
                return;
            }
            
            const nextIndex = (state.currentGriot + 1) % griots.length;
            selectGriot(nextIndex);
        }, 8000);
    }

    // ═══════════════════════════════════════════════════════════════
    // TIMELINE
    // ═══════════════════════════════════════════════════════════════
    
    function initTimeline() {
        // Scroll navigation
        dom.timelinePrev.addEventListener('click', () => {
            dom.timelineScroll.scrollBy({ left: -300, behavior: 'smooth' });
        });
        
        dom.timelineNext.addEventListener('click', () => {
            dom.timelineScroll.scrollBy({ left: 300, behavior: 'smooth' });
        });
        
        // Era labels
        dom.eraLabels.forEach(label => {
            label.addEventListener('click', () => {
                const era = label.dataset.era;
                scrollToEra(era);
                
                dom.eraLabels.forEach(l => l.classList.remove('active'));
                label.classList.add('active');
            });
        });
        
        // Update progress on scroll
        dom.timelineScroll.addEventListener('scroll', updateTimelineProgress);
        
        // Initial progress
        updateTimelineProgress();
    }
    
    function scrollToEra(era) {
        const eraPositions = {
            ancient: 0,
            classical: 0.25,
            medieval: 0.5,
            modern: 0.75,
            future: 1
        };
        
        const position = eraPositions[era] || 0;
        const maxScroll = dom.timelineScroll.scrollWidth - dom.timelineScroll.clientWidth;
        dom.timelineScroll.scrollTo({
            left: maxScroll * position,
            behavior: 'smooth'
        });
    }
    
    function updateTimelineProgress() {
        const scrollLeft = dom.timelineScroll.scrollLeft;
        const maxScroll = dom.timelineScroll.scrollWidth - dom.timelineScroll.clientWidth;
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        
        dom.timelineProgress.style.width = `${progress}%`;
    }

    // ═══════════════════════════════════════════════════════════════
    // REVEAL ANIMATIONS
    // ═══════════════════════════════════════════════════════════════
    
    function initRevealAnimations() {
        // Use Intersection Observer for scroll-triggered reveals
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('[data-reveal]').forEach(el => {
            observer.observe(el);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SOUND TOGGLE
    // ═══════════════════════════════════════════════════════════════
    
    function initSoundToggle() {
        dom.soundToggle.addEventListener('click', () => {
            state.soundEnabled = !state.soundEnabled;
            dom.soundToggle.style.color = state.soundEnabled ? 'var(--gold)' : 'var(--text-secondary)';
            dom.soundToggle.style.borderColor = state.soundEnabled ? 'var(--gold)' : 'var(--gold-muted)';
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
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
    
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // KEYBOARD NAVIGATION
    // ═══════════════════════════════════════════════════════════════
    
    document.addEventListener('keydown', (e) => {
        // Section navigation with arrow keys
        if (e.altKey) {
            const sections = ['origin', 'artifacts', 'star-map', 'griot', 'timeline', 'future'];
            const currentIndex = sections.indexOf(state.currentSection);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % sections.length;
                navigateToSection(sections[nextIndex]);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
                navigateToSection(sections[prevIndex]);
            }
        }
        
        // Escape to close mobile nav
        if (e.key === 'Escape') {
            dom.nav.classList.remove('open');
            dom.mobileToggle.classList.remove('active');
        }
    });

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZE ON DOM READY
    // ═══════════════════════════════════════════════════════════════
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();