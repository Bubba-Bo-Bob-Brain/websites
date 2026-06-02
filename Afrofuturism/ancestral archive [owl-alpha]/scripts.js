/* ============================================
   ORÍ Digital Museum & Ancestral Archive
   JavaScript - Interactive Features & Animations
   ============================================ */

// ============================================
// Global State Management
// ============================================
const state = {
    currentSection: 'origin',
    currentArtifact: 0,
    currentVoice: null,
    isPlaying: false,
    soundEnabled: true,
    theme: 'dark',
    scrollPosition: 0,
    timelinePosition: 0.5,
    starMapView: 'stars',
    selectedEra: 'ancient'
};

// ============================================
// Artifact Data
// ============================================
const artifacts = [
    {
        title: 'Benin Bronze Leopard',
        era: '16th Century',
        description: 'A masterful bronze sculpture representing royal power and authority in the Kingdom of Benin. This leopard embodies the strength and cunning of the Oba (king), serving as a symbol of the monarch\'s dominion over the natural world.',
        origin: 'Edo State, Nigeria',
        material: 'Bronze, Copper',
        significance: 'Royal Symbol'
    },
    {
        title: 'Ife Crown',
        era: '12th-15th Century',
        description: 'An exquisite bronze head representing the divine kingship of Ife. The naturalistic style demonstrates the extraordinary artistic achievement of Yoruba metalworkers, with intricate beaded regalia symbolizing royal authority.',
        origin: 'Ife, Osun State, Nigeria',
        material: 'Bronze, Naturalistic Style',
        significance: 'Divine Kingship'
    },
    {
        title: 'Talking Drum (Dundun)',
        era: 'Ancient - Present',
        description: 'The dundun is an hourglass-shaped pressure drum that can mimic the tonal patterns of human speech. Used by griots for centuries, it serves as a musical instrument, communication device, and keeper of oral history.',
        origin: 'Yorubaland, West Africa',
        material: 'Wood, Animal Skin, Ropes',
        significance: 'Communication & Music'
    },
    {
        title: 'Gelede Mask',
        era: '19th-20th Century',
        description: 'A vibrant ceremonial mask used in the Gelede festival, honoring the spiritual power of elderly women. The elaborate superstructure depicts scenes from daily life, proverbs, and cosmic imagery.',
        origin: 'Yoruba & Fon Peoples',
        material: 'Wood, Pigments, Cloth',
        significance: 'Spiritual Honor'
    },
    {
        title: 'Timbuktu Manuscript',
        era: '13th-17th Century',
        description: 'One of thousands of scholarly manuscripts preserved in Timbuktu, covering astronomy, mathematics, law, and theology. These texts demonstrate the advanced intellectual traditions of West African Islamic scholarship.',
        origin: 'Timbuktu, Mali',
        material: 'Vellum, Ink, Leather',
        significance: 'Scholarly Knowledge'
    },
    {
        title: 'Ethiopian Processional Cross',
        era: '12th-18th Century',
        description: 'An ornate liturgical cross featuring the distinctive Ethiopian design with intricate lattice patterns. These crosses were used in religious ceremonies and represent the ancient Christian heritage of Ethiopia.',
        origin: 'Lalibela, Ethiopia',
        material: 'Brass, Silver, Gold',
        significance: 'Religious Ceremony'
    }
];

// ============================================
// Story Data
// ============================================
const stories = {
    creation: {
        title: 'The First Breath',
        narrator: 'Elder Amara',
        text: [
            'Before time had a name, there was only the cosmic egg, spinning in infinite darkness.',
            'From this primordial vessel emerged the first breath—the breath that would become the wind, the rivers, the voices of our ancestors.',
            'The cosmic egg contained all possibilities: the mountains that would rise, the oceans that would flow, the stars that would guide our way.',
            'And when the egg cracked open, light poured forth, and with it came the knowledge that would be passed down through countless generations.',
            'This is the beginning of all things—the moment when potential became reality, when the universe remembered itself.'
        ]
    },
    diaspora: {
        title: 'The Star Walkers',
        narrator: 'Elder Kwame',
        text: [
            'Our ancestors read the stars like maps, navigating oceans of both water and space.',
            'They knew the patterns of Sirius, the dance of the Pleiades, the river of light we call the Milky Way.',
            'When the great migrations began, the stars were their compass, their calendar, their connection to home.',
            'Across vast distances, they carried not just their bodies but their knowledge—encoded in songs, in stories, in the patterns of their cloth.',
            'The diaspora was not an ending but a scattering of seeds, each carrying the wisdom of the whole.'
        ]
    },
    wisdom: {
        title: 'The Wisdom Keepers',
        narrator: 'Elder Fatima',
        text: [
            'Knowledge was not written but woven into song, dance, and the patterns of cloth.',
            'The griots were living libraries, their memories stretching back hundreds of years through careful training and sacred duty.',
            'Every textile told a story: the kente cloth with its geometric prayers, the mudcloth with its coded messages, the bogolan with its earth-toned wisdom.',
            'To wear these patterns was to carry the ancestors with you, to be wrapped in the protection of accumulated knowledge.',
            'The wisdom keepers taught that true knowledge lives not in books but in the living memory of the people.'
        ]
    }
};

// ============================================
// Timeline Data
// ============================================
const timelineEvents = [
    { year: -3000, title: 'Rise of Ancient Egypt', type: 'past' },
    { year: -800, title: 'Kingdom of Kush', type: 'past' },
    { year: 300, title: 'Aksumite Empire', type: 'past' },
    { year: 1200, title: 'Mali Empire & Timbuktu', type: 'past' },
    { year: 1500, title: 'Benin Bronzes', type: 'past' },
    { year: 2024, title: 'Digital Renaissance', type: 'present' },
    { year: 2050, title: 'African Space Program', type: 'future' },
    { year: 2100, title: 'Heritage Archives', type: 'future' },
    { year: 2500, title: 'Interstellar Voyages', type: 'future' },
    { year: 5000, title: 'New Civilizations', type: 'future' }
];

// ============================================
// Star Map Data
// ============================================
const navigationStars = [
    { name: 'Sirius', x: 25, y: 30, brightness: 1 },
    { name: 'Polaris', x: 50, y: 10, brightness: 0.9 },
    { name: 'Betelgeuse', x: 70, y: 45, brightness: 0.85 },
    { name: 'Rigel', x: 75, y: 60, brightness: 0.85 },
    { name: 'Aldebaran', x: 35, y: 55, brightness: 0.8 },
    { name: 'Antares', x: 60, y: 70, brightness: 0.8 },
    { name: 'Canopus', x: 20, y: 75, brightness: 0.9 },
    { name: 'Vega', x: 45, y: 20, brightness: 0.85 }
];

const migrationRoutes = [
    { from: { x: 50, y: 50 }, to: { x: 25, y: 30 }, era: 'ancient' },
    { from: { x: 50, y: 50 }, to: { x: 70, y: 45 }, era: 'classical' },
    { from: { x: 50, y: 50 }, to: { x: 20, y: 75 }, era: 'medieval' },
    { from: { x: 50, y: 50 }, to: { x: 60, y: 70 }, era: 'colonial' },
    { from: { x: 50, y: 50 }, to: { x: 45, y: 20 }, era: 'modern' }
];

const tradePaths = [
    { from: { x: 30, y: 40 }, to: { x: 60, y: 35 }, era: 'ancient' },
    { from: { x: 40, y: 60 }, to: { x: 55, y: 25 }, era: 'classical' },
    { from: { x: 35, y: 30 }, to: { x: 65, y: 55 }, era: 'medieval' }
];

const settlements = [
    { name: 'Egypt', x: 50, y: 50, era: 'ancient' },
    { name: 'Kush', x: 55, y: 60, era: 'ancient' },
    { name: 'Axum', x: 60, y: 65, era: 'classical' },
    { name: 'Mali', x: 40, y: 45, era: 'medieval' },
    { name: 'Benin', x: 48, y: 55, era: 'medieval' },
    { name: 'Great Zimbabwe', x: 55, y: 75, era: 'medieval' }
];

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeLoader();
    initializeParticles();
    initializeNavigation();
    initializeHologramViewer();
    initializeArtifactCarousel();
    initializeVoiceCards();
    initializeFeaturedRecording();
    initializeStarMap();
    initializeTimeline();
    initializeGriotPanel();
    initializeScrollEffects();
    initializeThemeToggle();
    initializeSoundToggle();
});

// ============================================
// Loading Screen
// ============================================
function initializeLoader() {
    const loader = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 2500);
}

// ============================================
// Particle System
// ============================================
function initializeParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            hue: Math.random() * 30 + 30
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ============================================
// Navigation
// ============================================
function initializeNavigation() {
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        if (scrollPos > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.nav.classList.remove('scrolled');
        }
        
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                const sectionId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80;
        const top = section.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

// ============================================
// Hologram Viewer
// ============================================
function initializeHologramViewer() {
    const rotationControl = document.getElementById('rotation-control');
    const zoomControl = document.getElementById('zoom-control');
    const glowControl = document.getElementById('glow-control');
    const resetBtn = document.querySelector('.reset-btn');
    const artifactModel = document.getElementById('artifact-model');
    
    let rotation = 0;
    let zoom = 100;
    let glow = 50;
    
    function updateHologram() {
        artifactModel.style.transform = `rotateY(${rotation}deg) scale(${zoom / 100})`;
        artifactModel.style.filter = `drop-shadow(0 0 ${glow}px rgba(212, 175, 55, ${glow / 100}))`;
    }
    
    rotationControl.addEventListener('input', (e) => {
        rotation = e.target.value;
        updateHologram();
    });
    
    zoomControl.addEventListener('input', (e) => {
        zoom = e.target.value;
        updateHologram();
    });
    
    glowControl.addEventListener('input', (e) => {
        glow = e.target.value;
        updateHologram();
    });
    
    resetBtn.addEventListener('click', () => {
        rotation = 0;
        zoom = 100;
        glow = 50;
        rotationControl.value = 0;
        zoomControl.value = 100;
        glowControl.value = 50;
        updateHologram();
    });
    
    let isDragging = false;
    let startX = 0;
    
    artifactModel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        artifactModel.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            rotation = (parseFloat(rotation) + deltaX * 0.5) % 360;
            rotationControl.value = rotation;
            updateHologram();
            startX = e.clientX;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        artifactModel.style.cursor = 'grab';
    });
    
    artifactModel.style.cursor = 'grab';
}

// ============================================
// Artifact Carousel
// ============================================
function initializeArtifactCarousel() {
    const track = document.getElementById('artifact-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    
    function selectArtifact(index) {
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
        state.currentArtifact = index;
        updateArtifactInfo(index);
    }
    
    function updateArtifactInfo(index) {
        const artifact = artifacts[index];
        document.getElementById('artifact-title').textContent = artifact.title;
        document.getElementById('artifact-description').textContent = artifact.description;
        document.getElementById('artifact-origin').textContent = artifact.origin;
        document.getElementById('artifact-material').textContent = artifact.material;
        document.getElementById('artifact-significance').textContent = artifact.significance;
        document.querySelector('.artifact-era').textContent = artifact.era;
    }
    
    items.forEach((item, index) => {
        item.addEventListener('click', () => selectArtifact(index));
    });
    
    prevBtn.addEventListener('click', () => {
        const newIndex = state.currentArtifact > 0 ? state.currentArtifact - 1 : artifacts.length - 1;
        selectArtifact(newIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        const newIndex = state.currentArtifact < artifacts.length - 1 ? state.currentArtifact + 1 : 0;
        selectArtifact(newIndex);
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}

// ============================================
// Voice Cards
// ============================================
function initializeVoiceCards() {
    const voiceCards = document.querySelectorAll('.voice-card');
    const playBtns = document.querySelectorAll('.play-voice-btn');
    
    playBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.voice-card');
            
            voiceCards.forEach(c => c.classList.remove('playing'));
            
            if (state.currentVoice === index) {
                state.currentVoice = null;
                state.isPlaying = false;
                btn.textContent = '▶';
            } else {
                card.classList.add('playing');
                state.currentVoice = index;
                state.isPlaying = true;
                btn.textContent = '⏸';
                
                playBtns.forEach(b => {
                    if (b !== btn) b.textContent = '▶';
                });
                
                setTimeout(() => {
                    card.classList.remove('playing');
                    state.currentVoice = null;
                    state.isPlaying = false;
                    btn.textContent = '▶';
                }, 5000);
            }
        });
    });
}

// ============================================
// Featured Recording
// ============================================
function initializeFeaturedRecording() {
    const playBtn = document.querySelector('.play-featured-btn');
    const featuredRecording = document.querySelector('.featured-recording');
    
    playBtn.addEventListener('click', () => {
        featuredRecording.classList.toggle('playing');
        
        if (featuredRecording.classList.contains('playing')) {
            playBtn.innerHTML = '<span class="play-icon">⏸</span><span class="play-text">Pause</span>';
        } else {
            playBtn.innerHTML = '<span class="play-icon">▶</span><span class="play-text">Listen Now</span>';
        }
    });
}

// ============================================
// Star Map
// ============================================
function initializeStarMap() {
    const starField = document.getElementById('star-field');
    const diasporaRoutes = document.getElementById('diaspora-routes');
    const eraSelect = document.getElementById('era-select');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    function createStars() {
        starField.innerHTML = '';
        
        navigationStars.forEach(star => {
            const starEl = document.createElement('div');
            starEl.className = `star ${star.brightness > 0.85 ? 'bright' : ''}`;
            starEl.style.left = `${star.x}%`;
            starEl.style.top = `${star.y}%`;
            starEl.style.animationDelay = `${Math.random() * 2}s`;
            starEl.title = star.name;
            starField.appendChild(starEl);
        });
        
        for (let i = 0; i < 100; i++) {
            const starEl = document.createElement('div');
            starEl.className = 'star';
            starEl.style.left = `${Math.random() * 100}%`;
            starEl.style.top = `${Math.random() * 100}%`;
            starEl.style.width = `${Math.random() * 2 + 1}px`;
            starEl.style.height = starEl.style.width;
            starEl.style.animationDelay = `${Math.random() * 3}s`;
            starField.appendChild(starEl);
        }
    }
    
    function createRoutes() {
        diasporaRoutes.innerHTML = '';
        
        migrationRoutes.forEach((route, index) => {
            if (route.era === state.selectedEra || state.selectedEra === 'all') {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                line.setAttribute('class', 'route-line');
                line.style.position = 'absolute';
                line.style.width = '100%';
                line.style.height = '100%';
                line.style.left = '0';
                line.style.top = '0';
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const d = `M ${route.from.x}% ${route.from.y}% Q 50% 50% ${route.to.x}% ${route.to.y}%`;
                path.setAttribute('d', d);
                path.setAttribute('stroke', '#D4AF37');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-dasharray', '1000');
                path.setAttribute('stroke-dashoffset', '1000');
                path.style.animation = `drawRoute ${2 + index * 0.5}s ease-out forwards`;
                
                line.appendChild(path);
                diasporaRoutes.appendChild(line);
            }
        });
        
        if (state.starMapView === 'trade' || state.starMapView === 'all') {
            tradePaths.forEach((path, index) => {
                if (path.era === state.selectedEra || state.selectedEra === 'all') {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    line.setAttribute('class', 'route-line');
                    line.style.position = 'absolute';
                    line.style.width = '100%';
                    line.style.height = '100%';
                    line.style.left = '0';
                    line.style.top = '0';
                    
                    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const d = `M ${path.from.x}% ${path.from.y}% L ${path.to.x}% ${path.to.y}%`;
                    pathEl.setAttribute('d', d);
                    pathEl.setAttribute('stroke', '#00D4FF');
                    pathEl.setAttribute('stroke-width', '2');
                    pathEl.setAttribute('fill', 'none');
                    pathEl.setAttribute('stroke-dasharray', '1000');
                    pathEl.setAttribute('stroke-dashoffset', '1000');
                    pathEl.style.animation = `drawRoute ${2 + index * 0.5}s ease-out forwards`;
                    
                    line.appendChild(pathEl);
                    diasporaRoutes.appendChild(line);
                }
            });
        }
        
        if (state.starMapView === 'settlements' || state.starMapView === 'all') {
            settlements.forEach(settlement => {
                if (settlement.era === state.selectedEra || state.selectedEra === 'all') {
                    const marker = document.createElement('div');
                    marker.className = 'settlement-marker';
                    marker.style.position = 'absolute';
                    marker.style.left = `${settlement.x}%`;
                    marker.style.top = `${settlement.y}%`;
                    marker.style.width = '12px';
                    marker.style.height = '12px';
                    marker.style.background = '#FF6B9D';
                    marker.style.borderRadius = '50%';
                    marker.style.border = '2px solid #D4AF37';
                    marker.style.boxShadow = '0 0 10px #FF6B9D';
                    marker.title = settlement.name;
                    diasporaRoutes.appendChild(marker);
                }
            });
        }
    }
    
    eraSelect.addEventListener('change', (e) => {
        state.selectedEra = e.target.value;
        createRoutes();
    });
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.starMapView = btn.getAttribute('data-view');
            createRoutes();
        });
    });
    
    createStars();
    createRoutes();
}

// ============================================
// Timeline
// ============================================
function initializeTimeline() {
    const track = document.getElementById('timeline-track');
    const prevBtn = document.querySelector('.timeline-nav-btn[data-direction="past"]');
    const nextBtn = document.querySelector('.timeline-nav-btn[data-direction="future"]');
    const progressIndicator = document.querySelector('.progress-indicator');
    
    function updateTimelineProgress() {
        const percentage = state.timelinePosition * 100;
        progressIndicator.style.width = `${percentage}%`;
    }
    
    prevBtn.addEventListener('click', () => {
        state.timelinePosition = Math.max(0, state.timelinePosition - 0.1);
        const scrollAmount = state.timelinePosition * track.scrollWidth;
        track.scrollTo({ left: scrollAmount - track.offsetWidth / 2, behavior: 'smooth' });
        updateTimelineProgress();
    });
    
    nextBtn.addEventListener('click', () => {
        state.timelinePosition = Math.min(1, state.timelinePosition + 0.1);
        const scrollAmount = state.timelinePosition * track.scrollWidth;
        track.scrollTo({ left: scrollAmount - track.offsetWidth / 2, behavior: 'smooth' });
        updateTimelineProgress();
    });
    
    track.addEventListener('scroll', () => {
        const maxScroll = track.scrollWidth - track.offsetWidth;
        state.timelinePosition = track.scrollLeft / maxScroll;
        updateTimelineProgress();
    });
    
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - track.offsetLeft;
        startScrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing';
    });
    
    track.addEventListener('mouseleave', () => {
        isDragging = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mouseup', () => {
        isDragging = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.scrollLeft = startScrollLeft - walk;
    });
    
    track.style.cursor = 'grab';
    updateTimelineProgress();
}

// ============================================
// Griot Panel
// ============================================
function initializeGriotPanel() {
    const panel = document.getElementById('griot-panel');
    const closeBtn = document.querySelector('.close-griot');
    const revealBtns = document.querySelectorAll('.reveal-story-btn');
    const narrationText = document.querySelector('.narration-text');
    const progressBar = document.querySelector('.progress-bar');
    const prevBtn = document.querySelector('.griot-btn.prev');
    const nextBtn = document.querySelector('.griot-btn.next');
    const pauseBtn = document.querySelector('.griot-btn.pause');
    
    let currentStory = null;
    let currentLine = 0;
    let isPaused = false;
    let narrationInterval = null;
    
    revealBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const storyKey = btn.getAttribute('data-fullstory');
            currentStory = stories[storyKey];
            currentLine = 0;
            isPaused = false;
            
            document.querySelector('.griot-name').textContent = currentStory.narrator;
            panel.classList.remove('hidden');
            startNarration();
        });
    });
    
    closeBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
        stopNarration();
    });
    
    function startNarration() {
        if (!currentStory) return;
        
        stopNarration();
        updateNarrationText();
        
        narrationInterval = setInterval(() => {
            if (!isPaused) {
                currentLine++;
                if (currentLine >= currentStory.text.length) {
                    currentLine = 0;
                }
                updateNarrationText();
            }
        }, 5000);
    }
    
    function stopNarration() {
        if (narrationInterval) {
            clearInterval(narrationInterval);
            narrationInterval = null;
        }
    }
    
    function updateNarrationText() {
        if (!currentStory) return;
        
        narrationText.style.opacity = '0';
        
        setTimeout(() => {
            narrationText.textContent = `"${currentStory.text[currentLine]}"`;
            narrationText.style.opacity = '1';
        }, 300);
        
        const progress = ((currentLine + 1) / currentStory.text.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentStory) {
            currentLine = currentLine > 0 ? currentLine - 1 : currentStory.text.length - 1;
            updateNarrationText();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentStory) {
            currentLine = currentLine < currentStory.text.length - 1 ? currentLine + 1 : 0;
            updateNarrationText();
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
    });
}

// ============================================
// Scroll Effects
// ============================================
function initializeScrollEffects() {
    const sections = document.querySelectorAll('.section');
    const cards = document.querySelectorAll('.origin-card, .voice-card, .timeline-event');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    cards.forEach(card => observer.observe(card));
    
    const parallaxElements = document.querySelectorAll('.hero-background, .section-background');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============================================
// Theme Toggle
// ============================================
function initializeThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = toggle.querySelector('.theme-icon');
    
    toggle.addEventListener('click', () => {
        if (state.theme === 'dark') {
            state.theme = 'light';
            document.documentElement.setAttribute('data-theme', 'light');
            icon.textContent = '☀️';
        } else {
            state.theme = 'dark';
            document.documentElement.removeAttribute('data-theme');
            icon.textContent = '🌙';
        }
    });
}

// ============================================
// Sound Toggle
// ============================================
function initializeSoundToggle() {
    const toggle = document.getElementById('sound-toggle');
    const icon = toggle.querySelector('.sound-icon');
    
    toggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        icon.textContent = state.soundEnabled ? '🔊' : '🔇';
    });
}

// ============================================
// Keyboard Navigation
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const panel = document.getElementById('griot-panel');
        if (!panel.classList.contains('hidden')) {
            panel.classList.add('hidden');
        }
    }
});

// ============================================
// Touch Support for Mobile
// ============================================
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        const track = document.getElementById('artifact-track');
        if (e.target.closest('.artifact-carousel')) {
            if (diffX > 0) {
                document.querySelector('.carousel-nav.next').click();
            } else {
                document.querySelector('.carousel-nav.prev').click();
            }
        }
    }
}, { passive: true });

// ============================================
// Window Resize Handler
// ============================================
window.addEventListener('resize', () => {
    const starField = document.getElementById('star-field');
    if (starField) {
        initializeStarMap();
    }
});

// ============================================
// Performance Optimization
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initializeStarMap();
    }, 250);
});

// ============================================
// Console Welcome Message
// ============================================
console.log('%c☥ ORÍ Digital Museum & Ancestral Archive', 'color: #D4AF37; font-size: 20px; font-weight: bold;');
console.log('%cWhere Ancient Wisdom Meets Infinite Future', 'color: #A89070; font-size: 14px; font-style: italic;');
console.log('%cPreserving Heritage • Inspiring Future', 'color: #D4AF37; font-size: 12px;');