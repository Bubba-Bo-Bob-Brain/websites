// Ubuntu Nexus - Digital Museum & Ancestral Archive
// JavaScript File: scripts.js

// ===== DOM Elements =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const languageToggle = document.querySelector('.language-toggle');
const timelineSlider = document.querySelector('.timeline-slider');
const timelineEras = document.querySelectorAll('.timeline-era');
const artifactCards = document.querySelectorAll('.artifact-card');
const artifactControls = document.querySelectorAll('.control-button');
const playPauseBtn = document.querySelector('.play-pause');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const storyDropdown = document.querySelector('.story-dropdown');
const archiveItems = document.querySelectorAll('.archive-item');
const mapFilters = document.querySelectorAll('.map-control');
const culturalNodes = document.querySelectorAll('.cultural-node');
const storyAudio = document.getElementById('story-audio');
const ctaButtons = document.querySelectorAll('.cta-button');
const griotAvatar = document.querySelector('.griot-avatar');
const hologramImage = document.querySelector('.hologram-image');
const hologramArtifact = document.querySelector('.hologram-artifact');
const visualizerBars = document.querySelectorAll('.bar');
const constellationCanvas = document.querySelector('.constellation-canvas');
const starmapCanvas = document.querySelector('.starmap-canvas');
const timelineControls = document.querySelectorAll('.timeline-nav');
const carouselNavs = document.querySelectorAll('.carousel-nav');

// ===== State Variables =====
let currentSection = 'home';
let isDarkTheme = true;
let isPlaying = false;
let currentArtifact = 'mask';
let currentStory = 'origins';
let currentCulture = 'yoruba';
let currentEra = 'ancient';
let timelineProgress = 25;
let audioProgressInterval;

// Artifact data
const artifacts = {
    mask: {
        name: 'Golden Mask of Mansa Musa',
        description: 'Ceremonial mask from the 14th century Mali Empire, crafted with gold leaf and symbolic Adinkra patterns representing wisdom and prosperity.',
        origin: 'Mali Empire',
        period: 'c. 1312–1337 CE',
        material: 'Gold, Wood, Pigments',
        rotation: 0,
        zoom: 1
    },
    staff: {
        name: 'Griot Staff of Oral Tradition',
        description: 'Carved staff used by West African griots (storytellers) to mark their authority and connection to ancestral wisdom.',
        origin: 'Mande Region',
        period: '16th-18th century',
        material: 'Ironwood, Bronze Inlays',
        rotation: 0,
        zoom: 1
    },
    vessel: {
        name: 'Libation Vessel for Ancestral Offerings',
        description: 'Ceramic vessel used in ritual ceremonies to pour libations honoring ancestors and deities.',
        origin: 'Yoruba Kingdom',
        period: '12th-15th century',
        material: 'Terracotta, Mineral Pigments',
        rotation: 0,
        zoom: 1
    },
    textile: {
        name: 'Royal Kente Cloth of Ashanti Kings',
        description: 'Handwoven textile featuring intricate geometric patterns, each with specific symbolic meanings related to proverbs and history.',
        origin: 'Ashanti Empire',
        period: '17th century',
        material: 'Silk, Cotton Threads',
        rotation: 0,
        zoom: 1
    },
    instrument: {
        name: 'Ceremonial Djembe Drum',
        description: 'Hand-carved drum used in spiritual ceremonies and community gatherings across West Africa.',
        origin: 'Mali/Guinea Region',
        period: '13th century',
        material: 'Lenke Wood, Goat Skin',
        rotation: 0,
        zoom: 1
    }
};

// Story data
const stories = {
    origins: {
        title: 'Creation Story: The First Baobab',
        duration: '4:22',
        text: [
            'In the time when the sky was close to the earth,',
            'the first people emerged from the baobab tree.',
            'They carried with them the knowledge of the stars,',
            'woven into stories that would guide generations.',
            'The creator breathed life into clay figures,',
            'giving them wisdom to build civilizations.'
        ]
    },
    migration: {
        title: 'Great Migration: Crossing the Sahara',
        duration: '5:15',
        text: [
            'When the desert sands began to shift,',
            'our ancestors followed the river of stars.',
            'They carried water in ostrich eggshells,',
            'and navigated by the southern cross.',
            'Each oasis was a memory of home,',
            'each dune a challenge to overcome.'
        ]
    },
    kingdom: {
        title: 'Kingdom of Wagadu: The Golden Age',
        duration: '6:48',
        text: [
            'In the land between two rivers,',
            'a city of gold rose to touch the clouds.',
            'Scholars gathered under the silk cotton tree,',
            'recording knowledge in illuminated manuscripts.',
            'Trade routes stretched across continents,',
            'connecting worlds through shared wisdom.'
        ]
    },
    resistance: {
        title: 'Resistance and Resilience',
        duration: '7:30',
        text: [
            'When chains tried to bind the spirit,',
            'the drums spoke in coded rhythms.',
            'Ancestral knowledge became hidden in plain sight,',
            'woven into baskets and carved into gourds.',
            'The flame of memory never extinguished,',
            'passed hand to hand through generations.'
        ]
    }
};

// Culture data
const cultures = {
    yoruba: {
        name: 'Yoruba Culture',
        people: '50M+',
        countries: '8',
        orishas: '1000+',
        description: 'Yoruba culture spans Nigeria, Benin, Togo, and the diaspora in Brazil, Cuba, Trinidad, and the United States. Known for its rich mythology, art, and religious traditions including Ifá divination.',
        connections: ['akan', 'fon', 'bantu']
    },
    akan: {
        name: 'Akan Culture',
        people: '20M+',
        countries: '5',
        orishas: 'N/A',
        description: 'The Akan people of Ghana and Ivory Coast are known for their goldsmithing, Adinkra symbols, and matrilineal social structure. Their artistic traditions influenced the entire West African region.',
        connections: ['yoruba', 'ewe', 'ga']
    },
    zulu: {
        name: 'Zulu Culture',
        people: '12M+',
        countries: '3',
        orishas: 'N/A',
        description: 'Zulu culture from Southern Africa is renowned for its beadwork, military organization under Shaka Zulu, and rich oral traditions. The language and customs have spread across the region.',
        connections: ['xhosa', 'sotho', 'swazi']
    }
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeMuseum();
    setupEventListeners();
    createDynamicElements();
    startAmbientAnimations();
});

// ===== Core Functions =====
function initializeMuseum() {
    // Set initial active section
    activateSection('home');
    
    // Initialize audio
    storyAudio.volume = 0.7;
    durationEl.textContent = stories.origins.duration;
    
    // Initialize artifact
    updateArtifactDisplay(currentArtifact);
    
    // Initialize timeline
    updateTimelineEra(currentEra);
    
    // Set initial theme
    updateTheme();
    
    // Initialize visualizer bars
    animateVisualizerBars();
    
    // Create stars and constellations
    createStars(50, constellationCanvas);
    createCulturalConnections();
}

function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            activateSection(sectionId);
            updateNavigation(link);
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Language toggle
    languageToggle.addEventListener('click', toggleLanguage);
    
    // Timeline controls
    timelineSlider.addEventListener('input', updateTimelineFromSlider);
    timelineControls.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.classList.contains('prev-era') ? -1 : 1;
            navigateTimeline(direction);
        });
    });
    
    // Artifact carousel
    artifactCards.forEach(card => {
        card.addEventListener('click', () => {
            const artifact = card.dataset.artifact;
            selectArtifact(artifact);
        });
    });
    
    // Artifact controls
    artifactControls.forEach(control => {
        control.addEventListener('click', () => {
            const action = control.classList[1];
            handleArtifactControl(action);
        });
    });
    
    // Audio player
    playPauseBtn.addEventListener('click', togglePlayback);
    
    // Story selection
    storyDropdown.addEventListener('change', (e) => {
        selectStory(e.target.value);
    });
    
    archiveItems.forEach(item => {
        item.addEventListener('click', () => {
            const storyKey = item.dataset.story || 'origins';
            selectStory(storyKey);
            updateArchiveSelection(item);
        });
    });
    
    // Star map filters
    mapFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.dataset.filter;
            filterCulturalNodes(filterType);
            updateFilterSelection(filter);
        });
    });
    
    // Cultural nodes
    culturalNodes.forEach(node => {
        node.addEventListener('click', () => {
            const culture = node.dataset.culture;
            selectCulture(culture);
        });
    });
    
    // CTA buttons
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.querySelector('.button-text').textContent.toLowerCase();
            handleCTAAction(action);
        });
    });
    
    // Carousel navigation
    carouselNavs.forEach(nav => {
        nav.addEventListener('click', () => {
            const direction = nav.classList.contains('prev') ? -1 : 1;
            navigateCarousel(direction);
        });
    });
    
    // Window events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Audio events
    storyAudio.addEventListener('timeupdate', updateProgressBar);
    storyAudio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(storyAudio.duration);
    });
    storyAudio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayButton();
        clearInterval(audioProgressInterval);
    });
}

// ===== Section Navigation =====
function activateSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Update URL hash without scrolling
        history.replaceState(null, null, `#${sectionId}`);
        
        // Trigger section-specific animations
        animateSectionEntry(targetSection);
    }
}

function updateNavigation(activeLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function handleScroll() {
    // Parallax effects for different sections
    const scrollY = window.scrollY;
    const speed = 0.5;
    
    // Apply parallax to background patterns
    sections.forEach(section => {
        const pattern = section.querySelector('.section-overlay');
        if (pattern) {
            pattern.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
        }
    });
    
    // Floating symbols animation
    const symbols = document.querySelectorAll('.symbol');
    symbols.forEach((symbol, index) => {
        const offset = scrollY * 0.05 * (index % 2 === 0 ? 1 : -1);
        symbol.style.transform = `translateY(${offset}px)`;
    });
}

// ===== Theme System =====
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    updateTheme();
    animateThemeTransition();
}

function updateTheme() {
    const root = document.documentElement;
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    
    if (isDarkTheme) {
        // Dark theme (default)
        root.style.setProperty('--color-background', '#0a0a14');
        root.style.setProperty('--color-surface', '#151522');
        root.style.setProperty('--color-text', '#e6e6e6');
        sunIcon.style.transform = 'translateY(0)';
        sunIcon.style.opacity = '1';
        moonIcon.style.transform = 'translateY(100%)';
        moonIcon.style.opacity = '0';
    } else {
        // Light theme
        root.style.setProperty('--color-background', '#f5f5f7');
        root.style.setProperty('--color-surface', '#ffffff');
        root.style.setProperty('--color-text', '#1a1a1a');
        sunIcon.style.transform = 'translateY(-100%)';
        sunIcon.style.opacity = '0';
        moonIcon.style.transform = 'translateY(0)';
        moonIcon.style.opacity = '1';
    }
}

function animateThemeTransition() {
    document.body.style.transition = 'background-color 0.5s ease';
    document.body.style.backgroundColor = isDarkTheme ? '#0a0a14' : '#f5f5f7';
    
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
}

// ===== Language System =====
function toggleLanguage() {
    const langText = languageToggle.querySelector('.language-text');
    const currentLang = langText.textContent;
    const newLang = currentLang === 'EN' ? 'SW' : 'EN';
    
    langText.textContent = newLang;
    
    // Animate language switch
    languageToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        languageToggle.style.transform = 'scale(1)';
    }, 150);
    
    // In a real implementation, this would trigger translation
    console.log(`Language switched to: ${newLang}`);
}

// ===== Artifact System =====
function selectArtifact(artifactKey) {
    // Update active card
    artifactCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.artifact === artifactKey) {
            card.classList.add('active');
        }
    });
    
    // Update artifact display
    currentArtifact = artifactKey;
    updateArtifactDisplay(artifactKey);
    
    // Animate transition
    hologramArtifact.style.animation = 'none';
    setTimeout(() => {
        hologramArtifact.style.animation = 'artifactRotate 20s linear infinite';
    }, 10);
}

function updateArtifactDisplay(artifactKey) {
    const artifact = artifacts[artifactKey];
    if (!artifact) return;
    
    // Update artifact info
    document.querySelector('.artifact-name').textContent = artifact.name;
    document.querySelector('.artifact-description').textContent = artifact.description;
    document.querySelectorAll('.meta-value')[0].textContent = artifact.origin;
    document.querySelectorAll('.meta-value')[1].textContent = artifact.period;
    document.querySelectorAll('.meta-value')[2].textContent = artifact.material;
    
    // Update artifact visual
    hologramArtifact.style.transform = `rotateY(${artifact.rotation}deg) scale(${artifact.zoom})`;
    
    // Update hologram preview in hero section
    if (hologramImage) {
        hologramImage.dataset.artifact = artifactKey;
        hologramImage.style.background = getArtifactGradient(artifactKey);
    }
}

function handleArtifactControl(action) {
    const artifact = artifacts[currentArtifact];
    
    switch(action) {
        case 'rotate-left':
            artifact.rotation -= 45;
            break;
        case 'rotate-right':
            artifact.rotation += 45;
            break;
        case 'zoom-in':
            artifact.zoom = Math.min(artifact.zoom + 0.2, 3);
            break;
        case 'zoom-out':
            artifact.zoom = Math.max(artifact.zoom - 0.2, 0.5);
            break;
        case 'info-toggle':
            const infoPanel = document.querySelector('.artifact-info');
            infoPanel.classList.toggle('expanded');
            break;
    }
    
    // Update display
    updateArtifactDisplay(currentArtifact);
    
    // Animate control feedback
    const controlBtn = document.querySelector(`.control-button.${action}`);
    controlBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        controlBtn.style.transform = 'scale(1)';
    }, 150);
}

function getArtifactGradient(artifactKey) {
    const gradients = {
        mask: 'linear-gradient(45deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1), rgba(30, 58, 138, 0.3))',
        staff: 'linear-gradient(45deg, rgba(139, 69, 19, 0.3), rgba(212, 175, 55, 0.1), rgba(30, 58, 138, 0.3))',
        vessel: 'linear-gradient(45deg, rgba(196, 30, 58, 0.3), rgba(212, 175, 55, 0.1), rgba(34, 139, 34, 0.3))',
        textile: 'linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(212, 175, 55, 0.1), rgba(196, 30, 58, 0.3))',
        instrument: 'linear-gradient(45deg, rgba(30, 58, 138, 0.3), rgba(212, 175, 55, 0.1), rgba(139, 69, 19, 0.3))'
    };
    
    return gradients[artifactKey] || gradients.mask;
}

function navigateCarousel(direction) {
    const activeIndex = Array.from(artifactCards).findIndex(card => card.classList.contains('active'));
    let newIndex = activeIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = artifactCards.length - 1;
    if (newIndex >= artifactCards.length) newIndex = 0;
    
    // Select new artifact
    const newArtifact = artifactCards[newIndex].dataset.artifact;
    selectArtifact(newArtifact);
    
    // Scroll carousel
    const carouselTrack = document.querySelector('.carousel-track');
    const cardWidth = artifactCards[0].offsetWidth + 32; // width + gap
    carouselTrack.scrollLeft = newIndex * cardWidth;
}

// ===== Audio Player System =====
function togglePlayback() {
    if (isPlaying) {
        pauseStory();
    } else {
        playStory();
    }
}

function playStory() {
    storyAudio.play();
    isPlaying = true;
    updatePlayButton();
    
    // Start progress animation
    audioProgressInterval = setInterval(() => {
        updateProgressBar();
    }, 100);
    
    // Animate visualizer bars more actively
    animateVisualizerBars(true);
    
    // Animate text reveal
    animateTextReveal();
}

function pauseStory() {
    storyAudio.pause();
    isPlaying = false;
    updatePlayButton();
    clearInterval(audioProgressInterval);
    
    // Return to ambient animation
    animateVisualizerBars(false);
}

function updatePlayButton() {
    const playIcon = playPauseBtn.querySelector('.fa-play');
    const pauseIcon = playPauseBtn.querySelector('.fa-pause');
    
    if (isPlaying) {
        playIcon.style.opacity = '0';
        pauseIcon.style.opacity = '1';
    } else {
        playIcon.style.opacity = '1';
        pauseIcon.style.opacity = '0';
    }
}

function updateProgressBar() {
    const progress = (storyAudio.currentTime / storyAudio.duration) * 100 || 0;
    progressFill.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(storyAudio.currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function selectStory(storyKey) {
    const story = stories[storyKey];
    if (!story) return;
    
    currentStory = storyKey;
    
    // Update story text
    const textReveal = document.querySelector('.text-reveal');
    textReveal.innerHTML = '';
    
    story.text.forEach(line => {
        const p = document.createElement('p');
        p.className = 'reveal-line';
        p.textContent = line;
        textReveal.appendChild(p);
    });
    
    // Update duration
    durationEl.textContent = story.duration;
    
    // Update dropdown
    storyDropdown.value = storyKey;
    
    // Reset and pause audio
    storyAudio.pause();
    isPlaying = false;
    updatePlayButton();
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    
    // Update audio source (in a real implementation)
    console.log(`Selected story: ${story.title}`);
}

function updateArchiveSelection(selectedItem) {
    archiveItems.forEach(item => {
        item.classList.remove('active');
    });
    selectedItem.classList.add('active');
}

// ===== Timeline System =====
function updateTimelineFromSlider() {
    timelineProgress = parseInt(timelineSlider.value);
    updateTimelineEraFromProgress();
}

function navigateTimeline(direction) {
    const eraOrder = ['ancient', 'medieval', 'modern', 'future'];
    const currentIndex = eraOrder.indexOf(currentEra);
    let newIndex = currentIndex + direction;
    
    // Clamp to bounds
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= eraOrder.length) newIndex = eraOrder.length - 1;
    
    currentEra = eraOrder[newIndex];
    updateTimelineEra(currentEra);
    
    // Update slider position
    timelineSlider.value = (newIndex + 1) * 25;
    timelineProgress = timelineSlider.value;
}

function updateTimelineEra(eraKey) {
    currentEra = eraKey;
    
    // Update era markers
    timelineEras.forEach(era => {
        era.classList.remove('active');
        if (era.dataset.era === eraKey) {
            era.classList.add('active');
        }
    });
    
    // Update progress line
    const progressLine = document.querySelector('.timeline-progress');
    const eraIndex = ['ancient', 'medieval', 'modern', 'future'].indexOf(eraKey);
    const progressWidth = (eraIndex + 1) * 25;
    progressLine.style.width = `${progressWidth}%`;
    
    // Animate era content
    const activeEra = document.querySelector(`.timeline-era[data-era="${eraKey}"]`);
    if (activeEra) {
        activeEra.style.transform = 'translateY(-50%) scale(1.1)';
        setTimeout(() => {
            activeEra.style.transform = 'translateY(-50%) scale(1)';
        }, 300);
    }
}

function updateTimelineEraFromProgress() {
    let eraKey;
    
    if (timelineProgress <= 25) eraKey = 'ancient';
    else if (timelineProgress <= 50) eraKey = 'medieval';
    else if (timelineProgress <= 75) eraKey = 'modern';
    else eraKey = 'future';
    
    if (eraKey !== currentEra) {
        updateTimelineEra(eraKey);
    }
}

// ===== Star Map System =====
function filterCulturalNodes(filterType) {
    culturalNodes.forEach(node => {
        const culture = node.dataset.culture;
        const cultureData = cultures[culture];
        
        let shouldShow = false;
        
        switch(filterType) {
            case 'all':
                shouldShow = true;
                break;
            case 'west':
                shouldShow = ['yoruba', 'akan'].includes(culture);
                break;
            case 'central':
                shouldShow = culture === 'zulu';
                break;
            case 'diaspora':
                // In a real implementation, this would check diaspora connections
                shouldShow = cultureData.connections && cultureData.connections.length > 0;
                break;
        }
        
        node.style.opacity = shouldShow ? '1' : '0.3';
        node.style.pointerEvents = shouldShow ? 'auto' : 'none';
    });
    
    // Update connections visibility
    updateConnectionVisibility(filterType);
}

function updateFilterSelection(selectedFilter) {
    mapFilters.forEach(filter => {
        filter.classList.remove('active');
    });
    selectedFilter.classList.add('active');
}

function selectCulture(cultureKey) {
    const culture = cultures[cultureKey];
    if (!culture) return;
    
    currentCulture = cultureKey;
    
    // Update culture info
    document.querySelector('.culture-name').textContent = culture.name;
    document.querySelectorAll('.stat-value')[0].textContent = culture.people;
    document.querySelectorAll('.stat-value')[1].textContent = culture.countries;
    document.querySelectorAll('.stat-value')[2].textContent = culture.orishas;
    document.querySelector('.culture-description').textContent = culture.description;
    
    // Animate node selection
    culturalNodes.forEach(node => {
        if (node.dataset.culture === cultureKey) {
            node.style.transform = 'translate(-50%, -50%) scale(1.5)';
        } else {
            node.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
    
    // Highlight connections
    highlightCulturalConnections(cultureKey);
}

function createCulturalConnections() {
    // This function would create connection lines between related cultures
    // In a full implementation, this would use SVG or canvas drawing
    console.log('Creating cultural connections...');
}

function highlightCulturalConnections(cultureKey) {
    const culture = cultures[cultureKey];
    if (!culture || !culture.connections) return;
    
    // Highlight connected nodes
    culturalNodes.forEach(node => {
        if (culture.connections.includes(node.dataset.culture)) {
            node.style.filter = 'brightness(1.5) drop-shadow(0 0 10px var(--color-accent))';
        } else {
            node.style.filter = 'brightness(1)';
        }
    });
}

function updateConnectionVisibility(filterType) {
    // Update connection lines based on filter
    const connections = document.querySelectorAll('.connection');
    connections.forEach(conn => {
        // In a real implementation, this would check if both ends are visible
        conn.style.opacity = '0.3';
    });
}

// ===== Visual Effects =====
function createStars(count, container) {
    // Create random stars for constellation viewer
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 1.5 + 0.5;
        
        star.style.setProperty('--x', `${x}%`);
        star.style.setProperty('--y', `${y}%`);
        star.style.setProperty('--size', size);
        
        // Random twinkle delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        container.appendChild(star);
    }
}

function animateVisualizerBars(active = false) {
    visualizerBars.forEach((bar, index) => {
        bar.style.setProperty('--i', index);
        
        if (active) {
            // Active animation when audio is playing
            bar.style.animation = `barPulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite`;
            bar.style.animationDelay = `${index * 0.1}s`;
        } else {
            // Subtle ambient animation when idle
            bar.style.animation = `barPulse ${2 + Math.random() * 2}s ease-in-out infinite`;
            bar.style.animationDelay = `${index * 0.3}s`;
        }
    });
}

function animateTextReveal() {
    const lines = document.querySelectorAll('.reveal-line');
    lines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 1000);
    });
}

function animateSectionEntry(section) {
    // Fade in content
    const contentElements = section.querySelectorAll('.section-header, .hero-content, .artifacts-container, .stories-container, .cosmos-container, .timeline-container, .starmap-container');
    
    contentElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function startAmbientAnimations() {
    // Floating symbols
    setInterval(() => {
        const symbols = document.querySelectorAll('.symbol');
        symbols.forEach(symbol => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            symbol.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
    }, 3000);
    
    // Hologram glow pulse
    setInterval(() => {
        const hologramGlow = document.querySelector('.hologram-glow');
        if (hologramGlow) {
            hologramGlow.style.opacity = Math.random() * 0.3 + 0.5;
        }
    }, 2000);
    
    // Constellation lines pulse
    setInterval(() => {
        const lines = document.querySelectorAll('.constellation-line');
        lines.forEach(line => {
            line.style.opacity = Math.random() * 0.4 + 0.1;
        });
    }, 1500);
}

function createDynamicElements() {
    // Create additional stars for cosmic section
    createStars(30, constellationCanvas);
    
    // Create additional cultural nodes for star map
    createAdditionalCulturalNodes();
}

function createAdditionalCulturalNodes() {
    const cultures = ['fon', 'ewe', 'xhosa', 'swazi'];
    const starmap = document.querySelector('.starmap-canvas');
    
    cultures.forEach(culture => {
        const node = document.createElement('div');
        node.className = 'cultural-node';
        node.dataset.culture = culture;
        
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 80 + 10;
        
        node.style.setProperty('--x', `${x}%`);
        node.style.setProperty('--y', `${y}%`);
        
        const dot = document.createElement('div');
        dot.className = 'node-dot';
        
        const label = document.createElement('div');
        label.className = 'node-label';
        label.textContent = culture.charAt(0).toUpperCase() + culture.slice(1);
        
        node.appendChild(dot);
        node.appendChild(label);
        
        // Add click event
        node.addEventListener('click', () => {
            // Simplified - in real implementation would show culture info
            console.log(`Selected culture: ${culture}`);
        });
        
        starmap.appendChild(node);
    });
}

// ===== Utility Functions =====
function handleCTAAction(action) {
    switch(action) {
        case 'begin journey':
            // Scroll to artifacts section
            activateSection('artifacts');
            break;
        case 'griot narration':
            // Play the current story
            if (!isPlaying) {
                playStory();
            }
            break;
        default:
            console.log(`CTA action: ${action}`);
    }
}

function handleResize() {
    // Update any layout-dependent elements
    const sectionIndicators = document.querySelectorAll('.section-indicator');
    sectionIndicators.forEach(indicator => {
        const section = indicator.closest('.section');
        if (section && section.classList.contains('active')) {
            indicator.style.bottom = '2rem';
        }
    });
}

// ===== Public API (for console testing) =====
window.museumAPI = {
    switchSection: activateSection,
    toggleTheme: toggleTheme,
    playStory: playStory,
    pauseStory: pauseStory,
    selectArtifact: selectArtifact,
    navigateTimeline: navigateTimeline,
    selectCulture: selectCulture,
    getCurrentState: () => ({
        section: currentSection,
        theme: isDarkTheme ? 'dark' : 'light',
        playing: isPlaying,
        artifact: currentArtifact,
        story: currentStory,
        culture: currentCulture,
        era: currentEra
    })
};

console.log('Ubuntu Nexus Museum initialized');
console.log('Use museumAPI in console to control the museum');