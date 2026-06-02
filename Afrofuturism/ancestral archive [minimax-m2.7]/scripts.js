/* ============================================ AKOM - Digital Museum of African Heritage Scripts ============================================ */

// ==================== Global State Management ====================
const AKOM = {
    state: {
        currentGallery: 'grand-hall',
        isLoading: true,
        audioPlaying: false,
        autoRotate: false,
        artifactRotation: { x: 0, y: 0, z: 0 },
        storyTime: 0,
        timelineZoom: 1,
        scrollPosition: 0,
        particles: [],
        stars: [],
        migrationPaths: [],
        selectedArtifact: 'ife-head',
        currentStory: 'creation-myth',
        currentCosmicSection: 0
    },
    
    // DOM Element Cache
    elements: {},
    
    // Configuration
    config: {
        particleCount: 50,
        starCount: 100,
        autoRotateSpeed: 0.5,
        textRevealDuration: 35000, // 8:32 in ms
        timelineEras: [
            { era: 'origins', year: -10000, title: 'Origins', description: 'The first humans walked the African continent. From the savannas of East Africa to the rainforests of Central Africa, our ancestors developed language, tools, and the first spiritual beliefs. Cave paintings in Niger and South Africa date back 70,000 years, among the oldest art ever discovered.' },
            { era: 'civilizations', year: -3000, title: 'Ancient Civilizations', description: 'Ancient Egypt rose along the Nile, building pyramids that aligned with stars and creating one of history\'s most sophisticated civilizations. Nubia to the south developed its own powerful kingdoms. The Saharan region was a lush landscape of lakes and rivers, home to cattle-herding cultures.' },
            { era: 'trade', year: 700, title: 'Trans-Saharan Trade', description: 'The Ghana Empire, followed by Mali and Songhai, controlled the gold and salt trade across the Sahara. Timbuktu became a center of learning with universities holding hundreds of thousands of manuscripts. The wealthy Mali Emperor Musa distributed so much gold during his pilgrimage that he crashed gold prices across the Mediterranean.' },
            { era: 'diaspora', year: 1500, title: 'The Diaspora', description: 'Over 12 million Africans were forcibly transported across the Atlantic in one of history\'s greatest tragedies. Yet in the face of brutality, they preserved culture, adapted traditions, and built new communities. From the maroon societies of Jamaica to the Gullah Geechee of South Carolina, resistance was woven into every aspect of survival.' },
            { era: 'return', year: 1950, title: 'The Return', description: 'The Pan-African movement united people of African descent worldwide. Ghana became the first sub-Saharan African nation to gain independence in 1957. Leaders like Nkrumah, Kenyatta, and Mandela inspired a continent. The Harlem Renaissance and Negritude movement redefined how the world saw African identity.' },
            { era: 'present', year: 2024, title: 'Digital Renaissance', description: 'Technology now preserves endangered languages, resurrects ancient manuscripts through AI, and creates immersive experiences of heritage. African nations lead in mobile banking and innovation. The youngest continent is building the future while honoring the past.' },
            { era: 'unification', year: 2075, title: 'Continental Unity', description: 'The African Union evolves into a unified governing body, coordinating climate action, technology development, and cultural preservation across 55 nations. A single digital identity allows seamless movement and trade. Pan-African values guide policy decisions.' },
            { era: 'stellar', year: 2200, title: 'The Stellar Generation', description: 'The first humans born in space stations carry African names and traditions. A permanent settlement on Mars includes a district inspired by Great Zimbabwe architecture. Children learn that their ancestors watched the same stars from African skies.' },
            { era: 'ascension', year: 3000, title: 'Ascension', description: 'Humanity evolves beyond physical limitations, guided by the African philosophical principle of Ubuntu—"I am because we are." The consciousness of billions of ancestors flows through digital networks, creating a collective wisdom that transcends time. African cosmology, which always understood the universe as interconnected, becomes the foundation of humanity\'s next chapter.' }
        ],
        stories: {
            'creation-myth': {
                narrator: 'Grandfather Kofi Mensah',
                title: 'Keeper of Oral Traditions',
                line: 'Lineage Holder of the Ashanti Court',
                duration: '8:32',
                durationMs: 512000,
                lines: [
                    { time: 0, text: 'In the beginning, before time had meaning,' },
                    { time: 3, text: 'there existed only the great Nyame—' },
                    { time: 6, text: 'the Sky God who watched over all creation.' },
                    { time: 10, text: 'Below, stretched the endless waters of the primeval sea,' },
                    { time: 14, text: 'and Asase Ya, the Earth Mother, slept within the depths.' },
                    { time: 19, text: 'Nyame looked upon the waters and saw his loneliness reflected,' },
                    { time: 24, text: 'and from that loneliness, he wept tears of gold.' },
                    { time: 29, text: 'Where his tears fell upon the waters,' },
                    { time: 32, text: 'the earth began to rise.' },
                    { time: 36, text: 'The Earth Mother awakened from her long slumber' },
                    { time: 40, text: 'and rose to meet the Sky God.' },
                    { time: 44, text: 'Together, they brought forth all living things—' },
                    { time: 48, text: 'the plants that carpet the earth,' },
                    { time: 51, text: 'the animals that walk and crawl and fly,' },
                    { time: 55, text: 'and finally, humanity.' },
                    { time: 60, text: 'And so we are born from the union of Sky and Earth,' },
                    { time: 65, text: 'from the tears of a lonely god' },
                    { time: 69, text: 'and the dreams of a sleeping goddess.' },
                    { time: 74, text: 'This is our origin.' },
                    { time: 77, text: 'This is our inheritance.' },
                    { time: 82, text: 'Remember it, child.' },
                    { time: 86, text: 'Remember it, and carry it forward.' },
                    { time: 92, text: '— End of Transmission —' }
                ]
            },
            'anjan-waters': {
                narrator: 'Elder Amara Diallo',
                title: 'Guardian of River Stories',
                line: 'Voice of the Upper Niger Delta',
                duration: '12:15',
                durationMs: 735000,
                lines: [
                    { time: 0, text: 'In the time before the world took its present shape,' },
                    { time: 4, text: 'the Anjan people lived on the highest mountain.' },
                    { time: 8, text: 'Below them, the waters rose without end.' },
                    { time: 12, text: 'The great flood had come—' },
                    { time: 15, text: 'not from rain, but from the anger of the Water Spirits.' },
                    { time: 20, text: 'For the Anjan had forgotten the old ways.' },
                    { time: 24, text: 'They had stopped making offerings at the sacred pools.' },
                    { time: 28, text: 'They had stopped singing the morning hymns.' },
                    { time: 32, text: 'And so the waters rose.' },
                    { time: 36, text: 'The wisest among them, a woman named Faro,' },
                    { time: 40, text: 'heard a voice in the wind.' },
                    { time: 43, text: '"You must send a messenger," the voice said.' },
                    { time: 47, text: '"Send your fastest runner to the bottom of the waters.' },
                    { time: 51, text: '"There you will find the Water Spirits\' daughter.' },
                    { time: 55, text: '"She alone can negotiate peace."' },
                    { time: 60, text: 'The fastest runner was a young man named Tamba.' },
                    { time: 64, text: 'He could run faster than the wind itself.' },
                    { time: 68, text: 'He dived into the waters and swam deeper than any had gone.' },
                    { time: 73, text: 'At the bottom, he found a palace of coral and pearl.' },
                    { time: 78, text: 'And there, sitting alone, was the Water Spirits\' daughter.' },
                    { time: 83, text: 'Her name was Yemaja—Mother of Waters.' },
                    { time: 88, text: 'She had been waiting for someone brave enough to find her.' },
                    { time: 93, text: 'Tamba and Yemaja spoke through the night.' },
                    { time: 98, text: 'And when Tamba returned to the surface,' },
                    { time: 102, text: 'the waters began to recede.' },
                    { time: 106, text: 'From that day forward, the Anjan never forgot' },
                    { time: 110, text: 'to honor the spirits of the waters.' },
                    { time: 115, text: 'And those who were born of the union of Tamba and Yemaja' },
                    { time: 120, text: 'became the first healers, able to call upon both earth and water.' },
                    { time: 125, text: '— End of Transmission —' }
                ]
            },
            'hunter-star': {
                narrator: 'Griot Moussa Koné',
                title: 'Keeper of Dogon Mysteries',
                line: 'Witness of the Sirius Revelation',
                duration: '6:48',
                durationMs: 408000,
                lines: [
                    { time: 0, text: 'The Dogon people have known for thousands of years' },
                    { time: 4, text: 'what Western science only recently discovered.' },
                    { time: 8, text: 'They call the brightest star in our sky Po Tolo—Sirius B.' },
                    { time: 12, text: 'A star so dim it cannot be seen with the naked eye.' },
                    { time: 16, text: 'They knew it was there.' },
                    { time: 19, text: 'They knew it was heavy—heavier than all the earth.' },
                    { time: 23, text: 'They knew it orbited our sun every fifty years.' },
                    { time: 27, text: 'How did they know?' },
                    { time: 30, text: 'The elders tell of the Nommo—' },
                    { time: 34, text: 'beings who came from the Sirius system.' },
                    { time: 38, text: 'Amphibious, fish-like creatures who walked on two legs.' },
                    { time: 42, text: 'They descended from the sky in a spinning vessel,' },
                    { time: 46, text: 'landing near the cliffs of Bandiagara.' },
                    { time: 50, text: 'They brought knowledge of the stars,' },
                    { time: 54, text: 'of agriculture, of the mysteries of birth and death.' },
                    { time: 58, text: 'The Nommo eventually returned to the waters,' },
                    { time: 62, text: 'but their teachings remained.' },
                    { time: 66, text: 'Carried forward by the Dogon priests.' },
                    { time: 70, text: 'For thirty-two hundred years,' },
                    { time: 74, text: 'this knowledge has been passed from mouth to ear.' },
                    { time: 79, text: 'Awaiting the day when others would be ready to hear.' },
                    { time: 84, text: 'Perhaps that day is now.' },
                    { time: 88, text: '— End of Transmission —' }
                ]
            },
            'spider-roads': {
                narrator: 'Grandmother Efua Asante',
                title: 'Weaver of Tales',
                line: 'Voice of the Ashanti Oral Tradition',
                duration: '15:03',
                durationMs: 903000,
                lines: [
                    { time: 0, text: 'Anansi the spider was the cleverest of all creatures.' },
                    { time: 4, text: 'He could spin webs that caught the wind itself.' },
                    { time: 8, text: 'But there was one thing he did not have—' },
                    { time: 12, text: 'wisdom.' },
                    { time: 15, text: 'So Anansi set out to find the Road of All Wisdom.' },
                    { time: 19, text: 'He traveled to the edge of the world,' },
                    { time: 23, text: 'where the sky touches the earth.' },
                    { time: 27, text: 'There he met the Old Woman of the Road.' },
                    { time: 31, text: '"I seek the Road of All Wisdom," said Anansi.' },
                    { time: 35, text: '"I know where it is," she said.' },
                    { time: 38, text: '"But the price is steep."' },
                    { time: 42, text: '"I will pay any price," Anansi replied.' },
                    { time: 46, text: '"Then you must give me your three most precious things."' },
                    { time: 50, text: 'Anansi thought of his precious stones,' },
                    { time: 54, text: 'his golden treasures, his magical songs.' },
                    { time: 58, text: 'But the Old Woman shook her head.' },
                    { time: 62, text: '"Your three most precious things are these:' },
                    { time: 66, text: 'Your Pride. Your Fear. Your Anger."' },
                    { time: 70, text: 'Anansi gasped. These were indeed precious to him.' },
                    { time: 74, text: 'Without his pride, who would respect him?' },
                    { time: 78, text: 'Without his fear, how would he stay safe?' },
                    { time: 82, text: 'Without his anger, how would he fight?' },
                    { time: 86, text: 'But Anansi wanted wisdom more than anything.' },
                    { time: 90, text: 'So he gave them up.' },
                    { time: 94, text: 'And the Road of All Wisdom opened before him.' },
                    { time: 98, text: 'And he walked it, and he learned, and he grew.' },
                    { time: 103, text: 'Not because he was clever—' },
                    { time: 107, text: 'but because he was willing to let go of what held him back.' },
                    { time: 112, text: 'That is why Anansi stories teach us this:' },
                    { time: 116, text: 'True wisdom comes not from accumulating knowledge,' },
                    { time: 121, text: 'but from releasing the things that prevent us' },
                    { time: 125, text: 'from seeing clearly.' },
                    { time: 129, text: 'Remember this, little one.' },
                    { time: 133, text: 'The roads are always there.' },
                    { time: 137, text: 'We must only be willing to walk them.' },
                    { time: 142, text: '— End of Transmission —' }
                ]
            }
        }
    }
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    AKOM.cacheElements();
    AKOM.init();
});

AKOM.cacheElements = function() {
    // Navigation
    this.elements.nav = document.getElementById('mainNav');
    this.elements.mobileToggle = document.getElementById('mobileToggle');
    this.elements.navItems = document.querySelectorAll('.nav-item');
    this.elements.adinkraBtns = document.querySelectorAll('.adinkra-btn');
    
    // Galleries
    this.elements.galleries = document.querySelectorAll('.gallery');
    
    // Loading
    this.elements.loadingScreen = document.getElementById('loadingScreen');
    
    // Star Map
    this.elements.starCanvas = document.getElementById('starCanvas');
    this.elements.starInfoPanel = document.getElementById('starInfoPanel');
    this.elements.pathToggles = document.querySelectorAll('.path-toggle');
    
    // Artifact Viewer
    this.elements.artifactModel = document.getElementById('artifactModel');
    this.elements.currentArtifact = document.getElementById('currentArtifact');
    this.elements.rotateBtns = document.querySelectorAll('.rotate-btn');
    this.elements.autoRotateBtn = document.getElementById('autoRotate');
    this.elements.artifactThumbs = document.querySelectorAll('.artifact-thumb');
    this.elements.artifactDetails = document.getElementById('artifactDetails');
    this.elements.scanBar = document.querySelector('.scan-bar');
    
    // Griot Player
    this.elements.audioVisualizer = document.getElementById('audioVisualizer');
    this.elements.playBtn = document.getElementById('playStory');
    this.elements.prevStoryBtn = document.getElementById('prevStory');
    this.elements.nextStoryBtn = document.getElementById('nextStory');
    this.elements.storyItems = document.querySelectorAll('.story-item');
    this.elements.storyProgress = document.getElementById('storyProgress');
    this.elements.currentTime = document.getElementById('currentTime');
    this.elements.totalTime = document.getElementById('totalTime');
    this.elements.textReveal = document.getElementById('storyTextReveal');
    this.elements.transcriptToggle = document.getElementById('transcriptToggle');
    this.elements.transcriptContent = document.getElementById('transcriptContent');
    this.elements.narratorName = document.getElementById('narratorName');
    
    // Cosmic Library
    this.elements.cosmicScroll = document.getElementById('cosmicScroll');
    this.elements.scrollWrapper = document.querySelector('.scroll-wrapper');
    this.elements.scrollPrev = document.getElementById('scrollPrev');
    this.elements.scrollNext = document.getElementById('scrollNext');
    this.elements.scrollDots = document.querySelectorAll('.scroll-dot');
    
    // Timeline
    this.elements.timelineProgress = document.getElementById('timelineProgress');
    this.elements.eraMarkers = document.querySelectorAll('.era-marker');
    this.elements.timelineZoomIn = document.getElementById('timelineZoomIn');
    this.elements.timelineZoomOut = document.getElementById('timelineZoomOut');
    this.elements.timelineReset = document.getElementById('timelineReset');
    this.elements.eraDetailPanel = document.getElementById('eraDetailPanel');
    this.elements.closeEraDetail = document.getElementById('closeEraDetail');
    this.elements.eraDetailTitle = document.getElementById('eraDetailTitle');
    this.elements.eraDetailBody = document.getElementById('eraDetailBody');
    
    // UI Elements
    this.elements.galleryTransition = document.getElementById('galleryTransition');
    this.elements.scrollProgressFill = document.getElementById('scrollProgressFill');
    this.elements.particleContainer = document.getElementById('particles');
    this.elements.contextMenu = document.getElementById('contextMenu');
    this.elements.tooltipSystem = document.getElementById('tooltipSystem');
};

AKOM.init = function() {
    this.initLoadingScreen();
    this.initParticles();
    this.initNavigation();
    this.initMobileNav();
    this.initStarMap();
    this.initHologramViewer();
    this.initGriotPlayer();
    this.initCosmicScroll();
    this.initTimeline();
    this.initScrollEffects();
    this.initContextMenu();
    this.initTooltip();
    this.initKeyboardNav();
};

// ==================== Loading Screen ====================
AKOM.initLoadingScreen = function() {
    const loadingScreen = this.elements.loadingScreen;
    
    // Simulate loading completion
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        this.state.isLoading = false;
        this.startIntroAnimation();
    }, 2500);
};

AKOM.startIntroAnimation = function() {
    // Animate galleries appearing
    setTimeout(() => {
        this.showGallery('grand-hall');
    }, 500);
};

// ==================== Particle System ====================
AKOM.initParticles = function() {
    const container = this.elements.particleContainer;
    const count = this.config.particleCount;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        
        // Vary particle colors
        const colors = ['#FFD700', '#DAA520', '#F5DEB3', '#FFA500'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 ${5 + Math.random() * 10}px ${particle.style.background}`;
        
        container.appendChild(particle);
        this.state.particles.push(particle);
    }
};

// ==================== Navigation ====================
AKOM.initNavigation = function() {
    this.elements.navItems.forEach(item => {
        const btn = item.querySelector('.adinkra-btn');
        const galleryId = item.dataset.gallery;
        
        btn.addEventListener('click', () => {
            this.switchGallery(galleryId);
        });
        
        // Add hover effect with tooltip
        btn.addEventListener('mouseenter', (e) => {
            const symbol = btn.dataset.symbol;
            const title = btn.getAttribute('title');
            this.showTooltip(e, `${title}<br><span style="color: var(--gold-dark);">Symbol: ${symbol}</span>`);
        });
        
        btn.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    });
};

AKOM.switchGallery = function(galleryId) {
    if (this.state.currentGallery === galleryId) return;
    
    // Show transition overlay
    const overlay = this.elements.galleryTransition;
    const transitionText = overlay.querySelector('.transition-text');
    const galleryName = galleryId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    transitionText.textContent = `Entering ${galleryName}...`;
    overlay.classList.add('active');
    
    // Update navigation active state
    this.elements.adinkraBtns.forEach(btn => {
        const parent = btn.closest('.nav-item');
        if (parent.dataset.gallery === galleryId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Hide all galleries
    this.elements.galleries.forEach(gallery => {
        gallery.classList.remove('active');
    });
    
    // After transition, show new gallery
    setTimeout(() => {
        const targetGallery = document.getElementById(galleryId);
        if (targetGallery) {
            targetGallery.classList.add('active');
            this.state.currentGallery = galleryId;
            
            // Initialize gallery-specific elements
            if (galleryId === 'artifact-vault') {
                this.initArtifactViewer();
            } else if (galleryId === 'oral-chamber') {
                this.initAudioVisualizer();
            } else if (galleryId === 'cosmic-library') {
                this.initCosmicBackgrounds();
            } else if (galleryId === 'timeline-sanctum') {
                this.initTimelineMarkers();
            }
        }
        
        overlay.classList.remove('active');
    }, 800);
};

AKOM.showGallery = function(galleryId) {
    const gallery = document.getElementById(galleryId);
    if (gallery) {
        gallery.classList.add('active');
        this.state.currentGallery = galleryId;
        
        // Update nav
        this.elements.navItems.forEach(item => {
            const btn = item.querySelector('.adinkra-btn');
            if (item.dataset.gallery === galleryId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
};

AKOM.initMobileNav = function() {
    const toggle = this.elements.mobileToggle;
    const nav = this.elements.nav;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('mobile-open');
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            nav.classList.remove('mobile-open');
        }
    });
};

// ==================== Star Map ====================
AKOM.initStarMap = function() {
    const canvas = this.elements.starCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.renderStarMap();
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Initialize stars
    this.initStarMapStars();
    
    // Path toggle handlers
    this.elements.pathToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            this.elements.pathToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            this.renderStarMap();
        });
    });
    
    // Animate stars
    this.animateStarMap();
};

AKOM.initStarMapStars = function() {
    const locations = [
        // Africa (Origin)
        { x: 0.3, y: 0.5, type: 'africa', name: 'Timbuktu', desc: 'Center of learning, 400,000+ manuscripts' },
        { x: 0.32, y: 0.55, type: 'africa', name: 'Great Zimbabwe', desc: 'Monumental stone ruins of an empire' },
        { x: 0.35, y: 0.45, type: 'africa', name: 'Kumasi', desc: 'Heart of the Ashanti Kingdom' },
        { x: 0.28, y: 0.6, type: 'africa', name: 'Gorée Island', desc: 'Door of No Return memorial' },
        { x: 0.38, y: 0.48, type: 'africa', name: 'Ife', desc: 'Birthplace of Yoruba bronze sculpture' },
        
        // Caribbean
        { x: 0.15, y: 0.55, type: 'caribbean', name: 'Haiti', desc: 'First free Black republic' },
        { x: 0.12, y: 0.52, type: 'caribbean', name: 'Cuba', desc: ' cradle of Afro-Cuban religion' },
        { x: 0.14, y: 0.58, type: 'caribbean', name: 'Jamaica', desc: 'Maroon resistance heritage' },
        { x: 0.16, y: 0.62, type: 'caribbean', name: 'Trinidad', desc: 'Carnival and Indian indentureship' },
        
        // Americas
        { x: 0.12, y: 0.45, type: 'americas', name: 'New Orleans', desc: 'Congo Square, birth of jazz' },
        { x: 0.08, y: 0.5, type: 'americas', name: 'Charleston', desc: 'Gullah Geechee cultural preserve' },
        { x: 0.1, y: 0.55, type: 'americas', name: 'Rio de Janeiro', desc: 'African roots in samba and candomblé' },
        { x: 0.18, y: 0.6, type: 'americas', name: 'Salvador', desc: ' Yoruba shrine of Brazil' },
        { x: 0.2, y: 0.48, type: 'americas', name: 'New York', desc: 'Harlem Renaissance capital' },
        
        // Europe
        { x: 0.45, y: 0.25, type: 'europe', name: 'Lisbon', desc: 'Port of the slave trade' },
        { x: 0.48, y: 0.28, type: 'europe', name: 'London', desc: 'West African student migration' },
        { x: 0.5, y: 0.3, type: 'europe', name: 'Paris', desc: 'Négritude movement birthplace' },
        
        // Diaspora nodes (connecting lines)
        { x: 0.22, y: 0.5, type: 'diaspora', name: 'Middle Passage', desc: '12 million forcibly transported' },
        { x: 0.25, y: 0.45, type: 'diaspora', name: 'Triangle Trade', desc: 'Goods-Slaves-Molasses network' }
    ];
    
    this.state.stars = locations;
    this.state.migrationPaths = [
        { from: 'africa', to: 'americas', active: true },
        { from: 'africa', to: 'caribbean', active: false },
        { from: 'africa', to: 'europe', active: false }
    ];
};

AKOM.renderStarMap = function() {
    const canvas = this.elements.starCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background stars
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random() * 0.8 + 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
    
    // Draw migration paths
    const activePath = document.querySelector('.path-toggle.active');
    const pathType = activePath ? activePath.dataset.path : 'transatlantic';
    
    this.drawMigrationPath(ctx, width, height, pathType);
    
    // Draw location stars
    this.state.stars.forEach(star => {
        const x = star.x * width;
        const y = star.y * height;
        
        const colors = {
            'africa': '#FFD700',
            'caribbean': '#00ced1',
            'americas': '#ff6b9d',
            'europe': '#9370db',
            'diaspora': '#228b22'
        };
        
        const color = colors[star.type] || '#ffffff';
        
        // Draw glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 20, y - 20, 40, 40);
        
        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, star.type === 'africa' ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Draw name for major locations
        if (star.type === 'africa' || star.type === 'diaspora') {
            ctx.fillStyle = '#F5DEB3';
            ctx.font = '10px "Noto Sans"';
            ctx.textAlign = 'center';
            ctx.fillText(star.name, x, y + 20);
        }
    });
    
    // Add connecting lines between Africa and diaspora
    ctx.strokeStyle = 'rgba(218, 165, 32, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    const africaStars = this.state.stars.filter(s => s.type === 'africa');
    const diasporaStars = this.state.stars.filter(s => s.type !== 'africa');
    
    africaStars.forEach(africa => {
        diasporaStars.forEach(diaspora => {
            ctx.beginPath();
            ctx.moveTo(africa.x * width, africa.y * height);
            ctx.lineTo(diaspora.x * width, diaspora.y * height);
            ctx.stroke();
        });
    });
    
    ctx.setLineDash([]);
};

AKOM.drawMigrationPath = function(ctx, width, height, pathType) {
    ctx.strokeStyle = 'rgba(218, 165, 32, 0.5)';
    ctx.lineWidth = 2;
    
    const africaX = 0.32 * width;
    const africaY = 0.5 * height;
    
    let endX, endY, controlX1, controlY1, controlX2, controlY2;
    
    switch(pathType) {
        case 'transatlantic':
            endX = 0.12 * width;
            endY = 0.5 * height;
            controlX1 = 0.3 * width;
            controlY1 = 0.2 * height;
            controlX2 = 0.15 * width;
            controlY2 = 0.3 * height;
            break;
        case 'indian':
            endX = 0.7 * width;
            endY = 0.7 * height;
            controlX1 = 0.4 * width;
            controlY1 = 0.5 * height;
            controlX2 = 0.6 * width;
            controlY2 = 0.6 * height;
            break;
        case 'silk':
            endX = 0.6 * width;
            endY = 0.35 * height;
            controlX1 = 0.4 * width;
            controlY1 = 0.45 * height;
            controlX2 = 0.5 * width;
            controlY2 = 0.4 * height;
            break;
    }
    
    // Draw curved path
    ctx.beginPath();
    ctx.moveTo(africaX, africaY);
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    ctx.stroke();
    
    // Draw animated dots along path
    const time = Date.now() / 1000;
    for (let i = 0; i < 5; i++) {
        const t = ((time + i * 0.5) % 3) / 3;
        const dotX = this.bezierPoint(africaX, controlX1, controlX2, endX, t);
        const dotY = this.bezierPoint(africaY, controlY1, controlY2, endY, t);
        
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }
};

AKOM.bezierPoint = function(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return mt*mt*mt*p0 + 3*mt*mt*t*p1 + 3*mt*t*t*p2 + t*t*t*p3;
};

AKOM.animateStarMap = function() {
    const canvas = this.elements.starCanvas;
    if (!canvas || this.state.currentGallery !== 'grand-hall') {
        requestAnimationFrame(() => this.animateStarMap());
        return;
    }
    
    this.renderStarMap();
    requestAnimationFrame(() => this.animateStarMap());
};

// ==================== Hologram Viewer ====================
AKOM.initHologramViewer = function() {
    if (this.elements.artifactModel) {
        this.updateArtifactSVG(this.state.selectedArtifact);
    }
    
    // Rotation controls
    this.elements.rotateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const axis = btn.dataset.axis;
            const dir = parseInt(btn.dataset.dir);
            this.rotateArtifact(axis, dir);
        });
    });
    
    // Auto-rotate toggle
    this.elements.autoRotateBtn.addEventListener('click', () => {
        this.state.autoRotate = !this.state.autoRotate;
        this.elements.autoRotateBtn.classList.toggle('active', this.state.autoRotate);
        
        if (this.state.autoRotate) {
            this.startAutoRotate();
        }
    });
    
    // Artifact selection
    this.elements.artifactThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const artifact = thumb.dataset.artifact;
            this.selectArtifact(artifact);
            
            this.elements.artifactThumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
};

AKOM.rotateArtifact = function(axis, degrees) {
    this.state.artifactRotation[axis] += degrees;
    
    const artifact = this.elements.currentArtifact;
    if (artifact) {
        artifact.style.transform = `rotateX(${this.state.artifactRotation.x}deg) rotateY(${this.state.artifactRotation.y}deg) rotateZ(${this.state.artifactRotation.z}deg)`;
    }
};

AKOM.startAutoRotate = function() {
    if (!this.state.autoRotate) return;
    
    const speed = this.config.autoRotateSpeed;
    this.rotateArtifact('y', speed);
    
    setTimeout(() => {
        if (this.state.autoRotate && this.state.currentGallery === 'artifact-vault') {
            this.startAutoRotate();
        }
    }, 16);
};

AKOM.selectArtifact = function(artifactId) {
    this.state.selectedArtifact = artifactId;
    this.updateArtifactSVG(artifactId);
    this.updateArtifactDetails(artifactId);
    this.resetArtifactRotation();
    this.animateScanBar();
};

AKOM.updateArtifactSVG = function(artifactId) {
    const artifact = this.elements.currentArtifact;
    if (!artifact) return;
    
    const svgClass = artifact.querySelector('.artifact-svg');
    if (!svgClass) return;
    
    const svgContent = this.getArtifactSVGContent(artifactId);
    svgClass.outerHTML = svgContent;
};

AKOM.getArtifactSVGContent = function(artifactId) {
    const svgs = {
        'ife-head': `<svg viewBox="0 0 200 200" class="artifact-svg">
            <defs>
                <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#CD7F32"/>
                    <stop offset="50%" style="stop-color:#FFD700"/>
                    <stop offset="100%" style="stop-color:#8B4513"/>
                </linearGradient>
            </defs>
            <ellipse cx="100" cy="70" rx="50" ry="60" fill="url(#bronzeGrad)"/>
            <ellipse cx="100" cy="55" rx="40" ry="15" fill="#8B4513"/>
            <circle cx="80" cy="60" r="8" fill="#4a3728"/>
            <circle cx="120" cy="60" r="8" fill="#4a3728"/>
            <ellipse cx="100" cy="75" rx="5" ry="3" fill="#4a3728"/>
            <path d="M85 90 Q100 100 115 90" stroke="#4a3728" stroke-width="2" fill="none"/>
            <path d="M70 45 Q60 30 80 35" stroke="url(#bronzeGrad)" stroke-width="8" fill="none"/>
            <path d="M130 45 Q140 30 120 35" stroke="url(#bronzeGrad)" stroke-width="8" fill="none"/>
            <ellipse cx="100" cy="140" rx="35" ry="15" fill="url(#bronzeGrad)"/>
        </svg>`,
        'kente-cloth': `<svg viewBox="0 0 200 200" class="artifact-svg">
            <defs>
                <pattern id="kentePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="#c41e3a"/>
                    <rect x="10" y="0" width="10" height="10" fill="#ffcc00"/>
                    <rect x="0" y="10" width="10" height="10" fill="#ffcc00"/>
                    <rect x="10" y="10" width="10" height="10" fill="#228b22"/>
                </pattern>
            </defs>
            <rect x="30" y="30" width="140" height="140" fill="url(#kentePattern)" stroke="#8B4513" stroke-width="4"/>
            <rect x="30" y="30" width="140" height="30" fill="#1e3a5f"/>
            <rect x="30" y="140" width="140" height="30" fill="#1e3a5f"/>
            <path d="M50 50 L150 50 M50 150 L150 150" stroke="#FFD700" stroke-width="2"/>
        </svg>`,
        'nok-sculpture': `<svg viewBox="0 0 200 200" class="artifact-svg">
            <defs>
                <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#CD853F"/>
                    <stop offset="50%" style="stop-color:#B8860B"/>
                    <stop offset="100%" style="stop-color:#8B4513"/>
                </linearGradient>
            </defs>
            <ellipse cx="100" cy="60" rx="40" ry="50" fill="url(#terracottaGrad)"/>
            <rect x="85" y="110" width="30" height="60" fill="url(#terracottaGrad)"/>
            <circle cx="85" cy="50" r="10" fill="#5c4033"/>
            <circle cx="115" cy="50" r="10" fill="#5c4033"/>
            <ellipse cx="100" cy="65" rx="6" ry="4" fill="#4a3728"/>
            <path d="M90 80 Q100 88 110 80" stroke="#4a3728" stroke-width="2" fill="none"/>
            <line x1="85" y1="110" x2="60" y2="130" stroke="url(#terracottaGrad)" stroke-width="12"/>
            <line x1="115" y1="110" x2="140" y2="130" stroke="url(#terracottaGrad)" stroke-width="12"/>
        </svg>`,
        'golden-stool': `<svg viewBox="0 0 200 200" class="artifact-svg">
            <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFD700"/>
                    <stop offset="50%" style="stop-color:#DAA520"/>
                    <stop offset="100%" style="stop-color:#B8860B"/>
                </linearGradient>
            </defs>
            <ellipse cx="100" cy="130" rx="60" ry="25" fill="url(#goldGrad)"/>
            <path d="M40 130 Q100 60 160 130" fill="#DAA520" stroke="#B8860B" stroke-width="2"/>
            <ellipse cx="100" cy="70" rx="20" ry="15" fill="url(#goldGrad)"/>
            <ellipse cx="100" cy="50" rx="8" ry="5" fill="#FFD700"/>
            <circle cx="70" cy="120" r="5" fill="#FFD700"/>
            <circle cx="130" cy="120" r="5" fill="#FFD700"/>
            <path d="M60 110 Q100 90 140 110" stroke="#FFD700" stroke-width="2" fill="none"/>
        </svg>`,
        'makonde-mask': `<svg viewBox="0 0 200 200" class="artifact-svg">
            <defs>
                <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#5c4033"/>
                    <stop offset="50%" style="stop-color:#4a3728"/>
                    <stop offset="100%" style="stop-color:#3d2817"/>
                </linearGradient>
            </defs>
            <ellipse cx="100" cy="90" rx="55" ry="75" fill="url(#woodGrad)"/>
            <ellipse cx="75" cy="75" rx="18" ry="25" fill="#1a0f0a"/>
            <ellipse cx="125" cy="75" rx="18" ry="25" fill="#1a0f0a"/>
            <ellipse cx="75" cy="75" rx="10" ry="15" fill="#2F1810"/>
            <ellipse cx="125" cy="75" rx="10" ry="15" fill="#2F1810"/>
            <path d="M70 120 Q100 140 130 120" stroke="#1a0f0a" stroke-width="4" fill="none"/>
            <line x1="80" y1="120" x2="80" y2="135" stroke="#1a0f0a" stroke-width="2"/>
            <line x1="100" y1="125" x2="100" y2="140" stroke="#1a0f0a" stroke-width="2"/>
            <line x1="120" y1="120" x2="120" y2="135" stroke="#1a0f0a" stroke-width="2"/>
            <path d="M45 50 Q30 30 60 40" stroke="url(#woodGrad)" stroke-width="10" fill="none"/>
            <path d="M155 50 Q170 30 140 40" stroke="url(#woodGrad)" stroke-width="10" fill="none"/>
        </svg>`,
        'benin-plaque': `<svg viewBox="0 0 200 200" class="artifact-svg">
            <defs>
                <linearGradient id="bronzePlaqueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#CD7F32"/>
                    <stop offset="50%" style="stop-color:#DAA520"/>
                    <stop offset="100%" style="stop-color:#8B4513"/>
                </linearGradient>
            </defs>
            <rect x="30" y="20" width="140" height="160" rx="5" fill="url(#bronzePlaqueGrad)" stroke="#8B4513" stroke-width="3"/>
            <circle cx="100" cy="60" r="35" fill="#8B4513" stroke="#CD7F32" stroke-width="2"/>
            <ellipse cx="100" cy="55" rx="25" ry="30" fill="#CD7F32"/>
            <circle cx="90" cy="50" r="6" fill="#4a3728"/>
            <circle cx="110" cy="50" r="6" fill="#4a3728"/>
            <rect x="85" y="90" width="30" height="70" fill="#8B4513"/>
            <line x1="85" y1="100" x2="115" y2="100" stroke="#CD7F32" stroke-width="2"/>
            <line x1="85" y1="115" x2="115" y2="115" stroke="#CD7F32" stroke-width="2"/>
            <line x1="85" y1="130" x2="115" y2="130" stroke="#CD7F32" stroke-width="2"/>
            <line x1="85" y1="145" x2="115" y2="145" stroke="#CD7F32" stroke-width="2"/>
            <circle cx="45" cy="50" r="10" fill="#DAA520"/>
            <circle cx="155" cy="50" r="10" fill="#DAA520"/>
        </svg>`
    };
    
    return svgs[artifactId] || svgs['ife-head'];
};

AKOM.updateArtifactDetails = function(artifactId) {
    const details = {
        'ife-head': { name: 'Ife Bronze Head', period: '12th-15th Century', origin: 'Ife, Nigeria', desc: 'The bronze head from Ife represents one of the world\'s most sophisticated bronze casting traditions. Created using the lost-wax casting technique, these sculptures demonstrate the advanced metallurgical knowledge of Yoruba craftsmen. The naturalistic style shows a deep understanding of human anatomy.' },
        'kente-cloth': { name: 'Kente Cloth Fragment', period: '17th Century', origin: 'Bonwire, Ghana', desc: 'Kente cloth is a UNESCO-recognized textile art form from Ghana. Each pattern has a specific name and meaning—from "Oteng Mensah" (the king\'s horse) to "Wy和教育" (unity). The weaving process is incredibly labor-intensive, with each strip requiring hours of precise work.' },
        'nok-sculpture': { name: 'Nok Terracotta', period: '500 BCE - 500 CE', origin: 'Nok, Nigeria', desc: 'The Nok culture of Nigeria created the earliest known figurative sculptures in Sub-Saharan Africa. These terracotta figures, some over a meter tall, show sophisticated artistic skill and likely served religious or status purposes. The hollow-built technique was revolutionary for its time.' },
        'golden-stool': { name: 'Golden Stool (Sika \'dwa Kofi)', period: '17th Century', origin: 'Ashanti, Ghana', desc: 'The Golden Stool is the most sacred object of the Ashanti people. According to legend, it contains the soul of the nation and cannot be touched by human hands. When British forces attempted to take it in 1900, it sparked the War of the Golden Stool.' },
        'makonde-mask': { name: 'Makonde Mask', period: '19th Century', origin: 'Mozambique', desc: 'The Makonde people of East Africa are renowned for their carved masks used in initiation ceremonies and spirit worship. The "lipiko" tradition involves months of carving and spiritual preparation. Modern Makonde artists have gained international recognition for their woodcarving.' },
        'benin-plaque': { name: 'Benin Bronze Plaque', period: '16th Century', origin: 'Benin City, Nigeria', desc: 'The Benin Bronzes are a group of more than a thousand commemorative sculptures that decorated the royal palace of the Kingdom of Benin. In 1897, British forces looted most of them during a punitive expedition. Nigeria has been campaigning for their return.' }
    };
    
    const info = details[artifactId];
    if (info) {
        document.getElementById('artifactName').textContent = info.name;
        document.getElementById('artifactPeriod').textContent = info.period;
        document.getElementById('artifactOrigin').textContent = info.origin;
        this.elements.artifactDetails.querySelector('.detail-description p').textContent = info.desc;
    }
};

AKOM.resetArtifactRotation = function() {
    this.state.artifactRotation = { x: 0, y: 0, z: 0 };
    const artifact = this.elements.currentArtifact;
    if (artifact) {
        artifact.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    }
};

AKOM.animateScanBar = function() {
    const scanBar = this.elements.scanBar;
    if (!scanBar) return;
    
    scanBar.style.width = '0%';
    setTimeout(() => {
        scanBar.style.width = '100%';
    }, 100);
};

AKOM.initArtifactViewer = function() {
    this.updateArtifactSVG(this.state.selectedArtifact);
    this.updateArtifactDetails(this.state.selectedArtifact);
};

// ==================== Griot Player ====================
AKOM.initGriotPlayer = function() {
    // Play/Pause button
    this.elements.playBtn.addEventListener('click', () => {
        this.toggleStoryPlayback();
    });
    
    // Previous/Next buttons
    this.elements.prevStoryBtn.addEventListener('click', () => this.prevStory());
    this.elements.nextStoryBtn.addEventListener('click', () => this.nextStory());
    
    // Story selection
    this.elements.storyItems.forEach(item => {
        item.addEventListener('click', () => {
            const storyId = item.dataset.story;
            this.selectStory(storyId);
            
            this.elements.storyItems.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Transcript accordion
    this.elements.transcriptToggle.addEventListener('click', () => {
        this.elements.transcriptToggle.classList.toggle('active');
        this.elements.transcriptContent.classList.toggle('open');
    });
    
    // Progress bar click to seek
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.seekStory(percent);
        });
    }
    
    // Initialize with first story
    this.initStoryText();
};

AKOM.toggleStoryPlayback = function() {
    this.state.audioPlaying = !this.state.audioPlaying;
    this.elements.playBtn.classList.toggle('playing', this.state.audioPlaying);
    
    if (this.state.audioPlaying) {
        this.startStoryTimer();
        this.initAudioVisualizer();
    } else {
        this.stopStoryTimer();
    }
};

AKOM.startStoryTimer = function() {
    const story = this.config.stories[this.state.currentStory];
    if (!story) return;
    
    const startTime = Date.now();
    const duration = story.durationMs;
    
    const updateProgress = () => {
        if (!this.state.audioPlaying) return;
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Update progress bar
        this.elements.storyProgress.style.width = (progress * 100) + '%';
        
        // Update time display
        const currentSeconds = Math.floor(elapsed / 1000);
        const totalSeconds = Math.floor(duration / 1000);
        this.elements.currentTime.textContent = this.formatTime(currentSeconds);
        
        // Update text reveal
        this.updateTextReveal(elapsed / 1000);
        
        if (progress >= 1) {
            this.state.audioPlaying = false;
            this.elements.playBtn.classList.remove('playing');
            this.elements.storyProgress.style.width = '0%';
            this.elements.currentTime.textContent = '0:00';
        } else {
            requestAnimationFrame(updateProgress);
        }
    };
    
    requestAnimationFrame(updateProgress);
};

AKOM.stopStoryTimer = function() {
    // Timer stops when audioPlaying is false
};

AKOM.updateTextReveal = function(currentSeconds) {
    const story = this.config.stories[this.state.currentStory];
    if (!story) return;
    
    const lines = story.lines;
    const textReveal = this.elements.textReveal;
    
    textReveal.querySelectorAll('.reveal-line').forEach(line => {
        const lineTime = parseInt(line.dataset.time);
        if (currentSeconds >= lineTime) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
    
    // Auto-scroll to keep active line visible
    const activeLine = textReveal.querySelector('.reveal-line.active:last-child');
    if (activeLine) {
        const container = textReveal.closest('.text-reveal-container');
        const lineRect = activeLine.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (lineRect.bottom > containerRect.bottom - 50) {
            textReveal.style.transform = `translateY(-${lineRect.top - containerRect.top - 50}px)`;
        }
    }
};

AKOM.formatTime = function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

AKOM.seekStory = function(percent) {
    const story = this.config.stories[this.state.currentStory];
    if (!story) return;
    
    const targetTime = percent * story.durationMs / 1000;
    this.updateTextReveal(targetTime);
    
    if (this.state.audioPlaying) {
        this.stopStoryTimer();
        this.startStoryTimer();
    }
};

AKOM.selectStory = function(storyId) {
    this.state.currentStory = storyId;
    const story = this.config.stories[storyId];
    
    if (story) {
        // Update narrator info
        this.elements.narratorName.textContent = story.narrator;
        
        // Update total time
        this.elements.totalTime.textContent = story.duration;
        
        // Reset progress
        this.elements.storyProgress.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
        
        // Reset text reveal
        this.initStoryText();
        
        // Stop playback if playing
        this.state.audioPlaying = false;
        this.elements.playBtn.classList.remove('playing');
    }
};

AKOM.initStoryText = function() {
    const story = this.config.stories[this.state.currentStory];
    if (!story) return;
    
    const textReveal = this.elements.textReveal;
    textReveal.innerHTML = '';
    
    story.lines.forEach(line => {
        const p = document.createElement('p');
        p.className = 'reveal-line';
        p.dataset.time = line.time;
        p.textContent = line.text;
        textReveal.appendChild(p);
    });
    
    textReveal.style.transform = 'translateY(0)';
};

AKOM.prevStory = function() {
    const stories = Array.from(this.elements.storyItems);
    const currentIndex = stories.findIndex(item => item.dataset.story === this.state.currentStory);
    const prevIndex = (currentIndex - 1 + stories.length) % stories.length;
    
    const prevStoryId = stories[prevIndex].dataset.story;
    this.selectStory(prevStoryId);
    
    stories.forEach(s => s.classList.remove('active'));
    stories[prevIndex].classList.add('active');
};

AKOM.nextStory = function() {
    const stories = Array.from(this.elements.storyItems);
    const currentIndex = stories.findIndex(item => item.dataset.story === this.state.currentStory);
    const nextIndex = (currentIndex + 1) % stories.length;
    
    const nextStoryId = stories[nextIndex].dataset.story;
    this.selectStory(nextStoryId);
    
    stories.forEach(s => s.classList.remove('active'));
    stories[nextIndex].classList.add('active');
};

AKOM.initAudioVisualizer = function() {
    const canvas = this.elements.audioVisualizer;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const draw = () => {
        if (this.state.currentGallery !== 'oral-chamber') return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        const barCount = 32;
        const barWidth = canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            let height;
            
            if (this.state.audioPlaying) {
                // Generate random heights when playing
                height = Math.random() * canvas.height * 0.7 + canvas.height * 0.1;
            } else {
                // Static low bars when paused
                height = canvas.height * 0.1 + Math.sin(i * 0.3) * canvas.height * 0.05;
            }
            
            const gradient = ctx.createLinearGradient(0, canvas.height - height, 0, canvas.height);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(1, '#8B4513');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
        }
        
        requestAnimationFrame(draw);
    };
    
    draw();
};

// ==================== Cosmic Library ====================
AKOM.initCosmicScroll = function() {
    this.elements.scrollPrev.addEventListener('click', () => this.prevCosmicSection());
    this.elements.scrollNext.addEventListener('click', () => this.nextCosmicSection());
    
    this.elements.scrollDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = parseInt(dot.dataset.section);
            this.goToCosmicSection(section);
        });
    });
};

AKOM.prevCosmicSection = function() {
    const totalSections = document.querySelectorAll('.scroll-section').length;
    this.state.currentCosmicSection = (this.state.currentCosmicSection - 1 + totalSections) % totalSections;
    this.updateCosmicScroll();
};

AKOM.nextCosmicSection = function() {
    const totalSections = document.querySelectorAll('.scroll-section').length;
    this.state.currentCosmicSection = (this.state.currentCosmicSection + 1) % totalSections;
    this.updateCosmicScroll();
};

AKOM.goToCosmicSection = function(index) {
    this.state.currentCosmicSection = index;
    this.updateCosmicScroll();
};

AKOM.updateCosmicScroll = function() {
    const wrapper = this.elements.scrollWrapper;
    if (!wrapper) return;
    
    const offset = this.state.currentCosmicSection * -100;
    wrapper.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    this.elements.scrollDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.state.currentCosmicSection);
    });
};

AKOM.initCosmicBackgrounds = function() {
    // Add floating animation to cosmic illustrations
    document.querySelectorAll('.scroll-section').forEach(section => {
        const bg = section.querySelector('.section-cosmic-bg');
        if (bg) {
            bg.style.opacity = '1';
        }
    });
};

// ==================== Timeline ====================
AKOM.initTimeline = function() {
    // Zoom controls
    this.elements.timelineZoomIn.addEventListener('click', () => this.zoomTimeline(1.2));
    this.elements.timelineZoomOut.addEventListener('click', () => this.zoomTimeline(0.8));
    this.elements.timelineReset.addEventListener('click', () => this.resetTimeline());
    
    // Era marker clicks
    this.elements.eraMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const eraId = marker.dataset.era;
            this.showEraDetail(eraId);
        });
        
        // Hover effects
        marker.addEventListener('mouseenter', () => {
            marker.classList.add('hover');
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.classList.remove('hover');
        });
    });
    
    // Close detail panel
    this.elements.closeEraDetail.addEventListener('click', () => {
        this.elements.eraDetailPanel.classList.remove('open');
    });
    
    // Animate present marker
    this.animatePresentMarker();
    
    // Initial timeline position
    this.updateTimelineProgress();
};

AKOM.zoomTimeline = function(factor) {
    this.state.timelineZoom *= factor;
    this.state.timelineZoom = Math.max(0.5, Math.min(2, this.state.timelineZoom));
    
    const track = document.querySelector('.timeline-track');
    if (track) {
        track.style.transform = `scale(${this.state.timelineZoom})`;
    }
};

AKOM.resetTimeline = function() {
    this.state.timelineZoom = 1;
    const track = document.querySelector('.timeline-track');
    if (track) {
        track.style.transform = 'scale(1)';
    }
};

AKOM.showEraDetail = function(eraId) {
    const era = this.config.timelineEras.find(e => e.era === eraId);
    if (!era) return;
    
    this.elements.eraDetailTitle.textContent = era.title;
    this.elements.eraDetailBody.innerHTML = `
        <p><strong>Year:</strong> ${era.year < 0 ? Math.abs(era.year).toLocaleString() + ' BCE' : era.year + ' CE'}</p>
        <p style="margin-top: 1rem;">${era.description}</p>
    `;
    
    this.elements.eraDetailPanel.classList.add('open');
    
    // Highlight current marker
    this.elements.eraMarkers.forEach(marker => {
        marker.classList.toggle('active', marker.dataset.era === eraId);
    });
};

AKOM.initTimelineMarkers = function() {
    // Reattach event listeners after gallery switch
    this.elements.eraMarkers = document.querySelectorAll('.era-marker');
    this.elements.eraMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            this.showEraDetail(marker.dataset.era);
        });
    });
};

AKOM.updateTimelineProgress = function() {
    // Animate progress line based on scroll position
    const timelineLine = document.querySelector('.timeline-line');
    if (!timelineLine) return;
    
    const progress = Math.min(100, Math.max(0, (Date.now() % 60000) / 600)); // Loop every minute
    this.elements.timelineProgress.style.width = progress + '%';
    
    requestAnimationFrame(() => this.updateTimelineProgress());
};

AKOM.animatePresentMarker = function() {
    const presentMarker = document.querySelector('.era-marker[data-era="present"] .node-inner');
    if (presentMarker) {
        setInterval(() => {
            presentMarker.style.boxShadow = '0 0 20px var(--gold-light)';
            setTimeout(() => {
                presentMarker.style.boxShadow = '0 0 40px var(--gold-light)';
            }, 500);
        }, 1000);
    }
};

// ==================== Scroll Effects ====================
AKOM.initScrollEffects = function() {
    window.addEventListener('scroll', () => {
        this.updateScrollProgress();
    });
    
    // Gallery scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.knowledge-card, .artifact-thumb').forEach(el => {
        observer.observe(el);
    });
};

AKOM.updateScrollProgress = function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    this.elements.scrollProgressFill.style.width = progress + '%';
};

// ==================== Context Menu ====================
AKOM.initContextMenu = function() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        const menu = this.elements.contextMenu;
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        menu.classList.add('visible');
    });
    
    document.addEventListener('click', () => {
        this.elements.contextMenu.classList.remove('visible');
    });
    
    // Context menu actions
    document.querySelectorAll('.context-menu button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            this.handleContextAction(action);
        });
    });
};

AKOM.handleContextAction = function(action) {
    switch(action) {
        case 'share':
            if (navigator.share) {
                navigator.share({
                    title: 'AKOM - Digital Museum of African Heritage',
                    text: 'Explore the digital sanctuary of African ancestral memory.',
                    url: window.location.href
                });
            }
            break;
        case 'bookmark':
            this.showTooltip({ clientX: window.innerWidth / 2, clientY: 100 }, 'Bookmark added to your collection');
            setTimeout(() => this.hideTooltip(), 2000);
            break;
        case 'info':
            this.switchGallery('grand-hall');
            break;
        case 'sound':
            // Toggle ambient sound (placeholder)
            this.showTooltip({ clientX: window.innerWidth / 2, clientY: 100 }, 'Ambient soundscape toggled');
            setTimeout(() => this.hideTooltip(), 2000);
            break;
    }
};

// ==================== Tooltip System ====================
AKOM.initTooltip = function() {
    // Tooltips are handled via event listeners on individual elements
};

AKOM.showTooltip = function(event, content) {
    const tooltip = this.elements.tooltipSystem;
    const tooltipContent = tooltip.querySelector('.tooltip-content');
    
    tooltipContent.innerHTML = content;
    tooltip.style.left = event.clientX + 'px';
    tooltip.style.top = (event.clientY - 40) + 'px';
    tooltip.classList.add('visible');
};

AKOM.hideTooltip = function() {
    this.elements.tooltipSystem.classList.remove('visible');
};

// ==================== Keyboard Navigation ====================
AKOM.initKeyboardNav = function() {
    document.addEventListener('keydown', (e) => {
        // Prevent shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case '1':
                this.switchGallery('grand-hall');
                break;
            case '2':
                this.switchGallery('artifact-vault');
                break;
            case '3':
                this.switchGallery('oral-chamber');
                break;
            case '4':
                this.switchGallery('cosmic-library');
                break;
            case '5':
                this.switchGallery('timeline-sanctum');
                break;
            case ' ':
                if (this.state.currentGallery === 'oral-chamber') {
                    e.preventDefault();
                    this.toggleStoryPlayback();
                }
                break;
            case 'ArrowLeft':
                if (this.state.currentGallery === 'cosmic-library') {
                    this.prevCosmicSection();
                } else if (this.state.currentGallery === 'oral-chamber') {
                    this.prevStory();
                }
                break;
            case 'ArrowRight':
                if (this.state.currentGallery === 'cosmic-library') {
                    this.nextCosmicSection();
                } else if (this.state.currentGallery === 'oral-chamber') {
                    this.nextStory();
                }
                break;
            case 'Escape':
                this.elements.eraDetailPanel.classList.remove('open');
                this.elements.contextMenu.classList.remove('visible');
                break;
        }
    });
};

// ==================== Utility Functions ====================
AKOM.debounce = function(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

AKOM.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==================== Export for debugging ====================
window.AKOM = AKOM;
console.log('%c AKOM Digital Museum ', 'background: #DAA520; color: #0d0d12; font-weight: bold; padding: 5px 10px; border-radius: 3px;');
console.log('African Heritage Archive initialized. Welcome to the Sanctuary of Ancestral Memory.');