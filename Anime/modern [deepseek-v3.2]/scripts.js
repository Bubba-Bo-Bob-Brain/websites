// scripts.js
// MANGA VERSE - Immersive Interactions & Dynamic Features

// ============================================
// GLOBAL STATE & CONFIGURATION
// ============================================
const CONFIG = {
    theme: 'dark',
    halftoneActive: false,
    cursorTrailActive: false,
    transitionType: 'wipe',
    currentCharacterIndex: 0,
    currentSeasonFilter: 'all'
};

// Character Data for Carousel
const CHARACTERS = [
    {
        id: 1,
        name: "MONKEY D. LUFFY",
        series: "ONE PIECE",
        description: "The rubber-bodied captain of the Straw Hat Pirates whose dream is to become the King of the Pirates. His unwavering spirit and loyalty inspire everyone around him.",
        imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        power: 95,
        popularity: 98,
        intelligence: 70,
        detail: "Luffy possesses the power of the Gum-Gum Fruit (Gomu Gomu no Mi), which turned his body into rubber. He's the founder and captain of the Straw Hat Pirates, and one of the Four Emperors that rule over the New World."
    },
    {
        id: 2,
        name: "NEZUKO KAMADO",
        series: "DEMON SLAYER",
        description: "A demon who retained her human emotions and protects humanity alongside her brother Tanjiro. Her unique condition makes her a key figure in the battle against demons.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        power: 85,
        popularity: 95,
        intelligence: 65,
        detail: "Despite being turned into a demon, Nezuko never lost her human heart. She developed the ability to shrink her body and possesses the rare Blood Demon Art that can burn other demons' powers."
    },
    {
        id: 3,
        name: "EREN YEAGER",
        series: "ATTACK ON TITAN",
        description: "The protagonist who transforms from a vengeful youth to a complex anti-hero willing to sacrifice everything for his vision of freedom.",
        imageUrl: "https://images.unsplash.com/photo-1639322537502-d80e6d82d6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        power: 99,
        popularity: 94,
        intelligence: 88,
        detail: "Eren possessed the Founding Titan, Attack Titan, and War Hammer Titan powers. His journey represents the tragic cost of freedom and the cycle of violence."
    },
    {
        id: 4,
        name: "GOJO SATORU",
        series: "JUJUTSU KAISEN",
        description: "The strongest Jujutsu Sorcerer who can manipulate space with his Limitless technique. His overwhelming power is matched only by his charismatic arrogance.",
        imageUrl: "https://images.unsplash.com/photo-1639322537198-3c65d5749ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        power: 100,
        popularity: 97,
        intelligence: 92,
        detail: "Gojo possesses the Six Eyes and Limitless technique, making him effectively invincible. He serves as a teacher at Tokyo Jujutsu High while working to reform the jujutsu world."
    },
    {
        id: 5,
        name: "VIVY",
        series: "VIVY: FLUORITE EYE'S SONG",
        description: "The first autonomous AI who sings to make people happy. Her century-long mission to prevent AI-human war shapes the future of both species.",
        imageUrl: "https://images.unsplash.com/photo-1639322537502-d80e6d82d6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        power: 75,
        popularity: 82,
        intelligence: 95,
        detail: "As the first autonomous humanoid AI, Vivy's mission to 'pour her heart into singing' evolves into a quest to save humanity from an AI uprising across 100 years of history."
    }
];

// Anime Data for Seasonal Tracker
const ANIME_LIST = [
    { 
        id: 1, 
        title: "DEMON SLAYER: HASHIRA TRAINING ARC", 
        status: "airing", 
        rating: 8.9, 
        genres: ["Action", "Supernatural", "Adventure"], 
        episodes: 11,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
        id: 2, 
        title: "MY HERO ACADEMIA SEASON 7", 
        status: "airing", 
        rating: 8.7, 
        genres: ["Action", "Superhero", "School"], 
        episodes: 25,
        imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
        id: 3, 
        title: "SPY x FAMILY SEASON 2", 
        status: "airing", 
        rating: 9.1, 
        genres: ["Comedy", "Action", "Slice of Life"], 
        episodes: 12,
        imageUrl: "https://images.unsplash.com/photo-1639322537502-d80e6d82d6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
        id: 4, 
        title: "JUJUTSU KAISEN SEASON 2", 
        status: "completed", 
        rating: 9.3, 
        genres: ["Action", "Supernatural", "Horror"], 
        episodes: 23,
        imageUrl: "https://images.unsplash.com/photo-1639322537198-3c65d5749ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    { 
        id: 5, 
        title: "FRIEREN: BEYOND JOURNEY'S END", 
        status: "completed", 
        rating: 9.0, 
        genres: ["Fantasy", "Adventure", "Drama"], 
        episodes: 28,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
    },
    { 
        id: 6, 
        title: "THE APOTHECARY DIARIES", 
        status: "airing", 
        rating: 8.6, 
        genres: ["Mystery", "Historical", "Drama"], 
        episodes: 24,
        imageUrl: "https://images.unsplash.com/photo-1639322537502-d80e6d82d6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
    },
    { 
        id: 7, 
        title: "UNDEAD UNLUCK", 
        status: "airing", 
        rating: 8.2, 
        genres: ["Action", "Supernatural", "Comedy"], 
        episodes: 24,
        imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
    },
    { 
        id: 8, 
        title: "SOLO LEVELING", 
        status: "completed", 
        rating: 8.8, 
        genres: ["Action", "Fantasy", "Adventure"], 
        episodes: 12,
        imageUrl: "https://images.unsplash.com/photo-1639322537198-3c65d5749ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
    }
];

// ============================================
// DOM ELEMENT REFERENCES
// ============================================
const dom = {
    body: document.body,
    themeToggle: document.getElementById('themeToggle'),
    halftoneToggle: document.getElementById('halftoneToggle'),
    cursorTrail: document.querySelector('.cursor-trail'),
    heroSpotlight: document.getElementById('heroSpotlight'),
    panelGrid: document.getElementById('panelGrid'),
    characterTrack: document.getElementById('characterTrack'),
    characterDots: document.getElementById('characterDots'),
    characterDetail: document.getElementById('characterDetail'),
    charPrev: document.getElementById('charPrev'),
    charNext: document.getElementById('charNext'),
    animeGrid: document.getElementById('animeGrid'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    totalAnime: document.getElementById('totalAnime'),
    airingCount: document.getElementById('airingCount'),
    avgRating: document.getElementById('avgRating'),
    transitionOverlay: document.getElementById('transitionOverlay'),
    navLinks: document.querySelectorAll('.nav-link'),
    mangaPanels: document.querySelectorAll('.manga-panel')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('MANGA VERSE initialized');
    
    // Generate manga panel grid background
    generateMangaPanels();
    
    // Initialize character carousel
    renderCharacterCarousel();
    updateCharacterDetail(CHARACTERS[0]);
    
    // Initialize seasonal anime tracker
    renderAnimeGrid('all');
    updateTrackerStats();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup cursor spotlight effect
    setupCursorSpotlight();
    
    // Setup manga panel interactions
    setupPanelInteractions();
    
    // Setup smooth navigation with transitions
    setupSmoothNavigation();
    
    // Initialize with cursor trail active
    setTimeout(() => {
        dom.body.classList.add('cursor-trail-active');
        CONFIG.cursorTrailActive = true;
    }, 1000);
}

// ============================================
// VISUAL EFFECTS
// ============================================

// Generate dynamic manga panel grid for hero background
function generateMangaPanels() {
    const grid = dom.panelGrid;
    const panelCount = 48; // 8x6 grid
    
    for (let i = 0; i < panelCount; i++) {
        const panel = document.createElement('div');
        panel.className = 'panel-cell';
        
        // Randomize panel appearance
        const brightness = Math.random() * 30 + 10;
        panel.style.backgroundColor = `hsl(240, 30%, ${brightness}%)`;
        panel.style.borderRadius = Math.random() > 0.7 ? '4px' : '0';
        panel.style.opacity = Math.random() * 0.3 + 0.05;
        
        // Add occasional speed line effect
        if (Math.random() > 0.9) {
            panel.style.backgroundImage = 'linear-gradient(45deg, transparent 40%, rgba(0, 238, 255, 0.1) 50%, transparent 60%)';
        }
        
        grid.appendChild(panel);
    }
}

// Cursor-following spotlight effect
function setupCursorSpotlight() {
    document.addEventListener('mousemove', (e) => {
        if (!dom.heroSpotlight) return;
        
        const x = e.clientX;
        const y = e.clientY;
        
        dom.heroSpotlight.style.left = `${x - 150}px`;
        dom.heroSpotlight.style.top = `${y - 150}px`;
        
        // Create trailing effect particles occasionally
        if (Math.random() > 0.7 && CONFIG.cursorTrailActive) {
            createTrailParticle(x, y);
        }
    });
}

// Create trail particles for cursor effect
function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary').trim();
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    particle.style.opacity = '0.7';
    
    document.body.appendChild(particle);
    
    // Animate particle
    particle.animate([
        { transform: 'scale(1)', opacity: 0.7 },
        { transform: 'scale(0)', opacity: 0 }
    ], {
        duration: 500,
        easing: 'ease-out'
    }).onfinish = () => particle.remove();
}

// ============================================
// CHARACTER CAROUSEL
// ============================================

// Render character carousel with data
function renderCharacterCarousel() {
    dom.characterTrack.innerHTML = '';
    dom.characterDots.innerHTML = '';
    
    CHARACTERS.forEach((character, index) => {
        // Create character card
        const card = document.createElement('div');
        card.className = `character-card ${index === 0 ? 'active' : ''}`;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="character-image" style="background-image: url('${character.imageUrl}')"></div>
            <div class="character-info">
                <h3 class="character-name">${character.name}</h3>
                <p class="character-series">${character.series}</p>
                <p class="character-desc">${character.description}</p>
                <div class="character-stats">
                    <div class="stat">
                        <div class="stat-value">${character.power}</div>
                        <div class="stat-label">POWER</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${character.popularity}</div>
                        <div class="stat-label">POPULARITY</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${character.intelligence}</div>
                        <div class="stat-label">INTELLIGENCE</div>
                    </div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            setActiveCharacter(index);
        });
        
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
        
        dom.characterTrack.appendChild(card);
        
        // Create dot indicator
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.setAttribute('aria-label', `View character ${index + 1}`);
        
        dot.addEventListener('click', () => {
            setActiveCharacter(index);
        });
        
        dom.characterDots.appendChild(dot);
    });
    
    updateCarouselPosition();
}

// Set active character with animation
function setActiveCharacter(index) {
    CONFIG.currentCharacterIndex = index;
    
    // Update active states
    document.querySelectorAll('.character-card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Update carousel position
    updateCarouselPosition();
    
    // Update detail panel
    updateCharacterDetail(CHARACTERS[index]);
    
    // Animate transition
    animateTransition('slide');
}

// Update carousel track position
function updateCarouselPosition() {
    const track = dom.characterTrack;
    const cardWidth = 280; // Fixed width from CSS
    const gap = 16; // --space-lg value
    
    const translateX = -(CONFIG.currentCharacterIndex * (cardWidth + gap));
    track.style.transform = `translateX(${translateX}px)`;
}

// Update character detail panel
function updateCharacterDetail(character) {
    dom.characterDetail.innerHTML = `
        <h3>${character.name} - DETAILED PROFILE</h3>
        <p>${character.detail}</p>
        <div class="detail-stats">
            <p><strong>Series:</strong> ${character.series}</p>
            <p><strong>Power Level:</strong> ${character.power}/100</p>
            <p><strong>Popularity:</strong> ${character.popularity}/100</p>
            <p><strong>First Appearance:</strong> ${character.series.split(' ')[0]} Chapter 1</p>
        </div>
    `;
    
    dom.characterDetail.classList.add('active');
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        dom.characterDetail.classList.remove('active');
    }, 10000);
}

// ============================================
// SEASONAL ANIME TRACKER
// ============================================

// Render anime grid with filtering
function renderAnimeGrid(filter = 'all') {
    CONFIG.currentSeasonFilter = filter;
    dom.animeGrid.innerHTML = '';
    
    const filteredAnime = filter === 'all' 
        ? ANIME_LIST 
        : ANIME_LIST.filter(anime => anime.status === filter);
    
    filteredAnime.forEach(anime => {
        const card = document.createElement('div');
        card.className = `anime-card ${anime.status}`;
        
        // Generate star rating
        const stars = '★'.repeat(Math.floor(anime.rating / 2)) + '☆'.repeat(5 - Math.floor(anime.rating / 2));
        
        card.innerHTML = `
            <div class="anime-poster" style="background-image: url('${anime.imageUrl}')"></div>
            <div class="anime-content">
                <h3 class="anime-title">${anime.title}</h3>
                <div class="anime-meta">
                    <span class="anime-status">${anime.status.toUpperCase()}</span>
                    <span class="anime-episodes">${anime.episodes} EP</span>
                </div>
                <div class="anime-genres">
                    ${anime.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
                <div class="anime-rating">
                    <div class="rating-stars">${stars}</div>
                    <div class="rating-value">${anime.rating.toFixed(1)}</div>
                </div>
                <button class="add-to-list" data-id="${anime.id}">
                    <i class="fas fa-plus"></i> ADD TO MY LIST
                </button>
            </div>
        `;
        
        dom.animeGrid.appendChild(card);
    });
    
    // Update stats
    updateTrackerStats();
    
    // Add event listeners to "Add to List" buttons
    document.querySelectorAll('.add-to-list').forEach(button => {
        button.addEventListener('click', (e) => {
            const animeId = e.currentTarget.dataset.id;
            addAnimeToList(animeId);
        });
    });
}

// Update tracker statistics
function updateTrackerStats() {
    const total = ANIME_LIST.length;
    const airing = ANIME_LIST.filter(a => a.status === 'airing').length;
    const avgRating = (ANIME_LIST.reduce((sum, anime) => sum + anime.rating, 0) / total).toFixed(1);
    
    dom.totalAnime.textContent = total;
    dom.airingCount.textContent = airing;
    dom.avgRating.textContent = avgRating;
    
    // Animate counter updates
    animateCounter(dom.totalAnime, total);
    animateCounter(dom.airingCount, airing);
}

// Animate counter values
function animateCounter(element, targetValue) {
    const current = parseInt(element.textContent);
    if (current === targetValue) return;
    
    const increment = targetValue > current ? 1 : -1;
    let currentValue = current;
    
    const timer = setInterval(() => {
        currentValue += increment;
        element.textContent = currentValue;
        
        if (currentValue === targetValue) {
            clearInterval(timer);
        }
    }, 30);
}

// Add anime to user's list
function addAnimeToList(animeId) {
    const anime = ANIME_LIST.find(a => a.id == animeId);
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Added "${anime.title}" to your list!
    `;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = 'var(--space-md) var(--space-lg)';
    notification.style.backgroundColor = 'var(--color-success)';
    notification.style.color = 'var(--color-bg)';
    notification.style.borderRadius = 'var(--border-radius-md)';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.zIndex = '1001';
    notification.style.transform = 'translateX(120%)';
    notification.style.transition = 'transform 0.3s var(--transition-bounce)';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    console.log(`Added anime ID ${animeId} to list`);
}

// ============================================
// MANGA PANEL INTERACTIONS
// ============================================

// Setup panel hover and click effects
function setupPanelInteractions() {
    dom.mangaPanels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.transform = 'translateY(-10px) scale(1.02)';
            panel.style.zIndex = '10';
            
            // Add speed line effect on some panels
            if (panel.dataset.panel === '1' || panel.dataset.panel === '4') {
                const speedLines = panel.querySelectorAll('.speed-line');
                speedLines.forEach(line => {
                    line.style.animationPlayState = 'running';
                });
            }
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'translateY(0) scale(1)';
            panel.style.zIndex = '';
        });
        
        panel.addEventListener('click', () => {
            // Create panel expansion effect
            const rect = panel.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = `${rect.top}px`;
            overlay.style.left = `${rect.left}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;
            overlay.style.backgroundColor = 'var(--color-surface-alt)';
            overlay.style.border = '2px solid var(--color-primary)';
            overlay.style.borderRadius = '12px';
            overlay.style.zIndex = '1000';
            overlay.style.transition = 'all 0.5s var(--transition-bounce)';
            
            document.body.appendChild(overlay);
            
            // Expand to full screen
            setTimeout(() => {
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.borderRadius = '0';
            }, 10);
            
            // Remove after 2 seconds
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }, 2000);
        });
    });
}

// ============================================
// NAVIGATION & TRANSITIONS
// ============================================

// Setup smooth navigation with transitions
function setupSmoothNavigation() {
    dom.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const transitionType = link.dataset.transition || 'wipe';
            
            // Apply transition
            animateTransition(transitionType, () => {
                // Scroll to target after transition
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
                
                // Update active nav link
                dom.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    });
}

// Animate transition between sections
function animateTransition(type = 'wipe', callback = null) {
    const overlay = dom.transitionOverlay;
    CONFIG.transitionType = type;
    
    // Set overlay style based on transition type
    switch(type) {
        case 'wipe':
            overlay.style.background = `linear-gradient(to right, 
                transparent, 
                var(--color-primary), 
                transparent)`;
            overlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            break;
        case 'slide':
            overlay.style.background = 'var(--color-secondary)';
            overlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            break;
        case 'flip':
            overlay.style.background = 'var(--color-primary)';
            overlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            break;
        case 'panel':
            overlay.style.background = 'var(--color-surface)';
            overlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
            break;
        case 'circle':
            overlay.style.background = 'var(--color-accent)';
            overlay.style.clipPath = 'circle(0% at 50% 50%)';
            break;
    }
    
    // Show overlay with animation
    overlay.style.opacity = '1';
    
    // Animate based on type
    const animations = {
        wipe: [
            { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
            { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }
        ],
        slide: [
            { transform: 'translateX(-100%)' },
            { transform: 'translateX(0)' },
            { transform: 'translateX(100%)' }
        ],
        flip: [
            { transform: 'rotateY(90deg) scale(0.5)', opacity: 0 },
            { transform: 'rotateY(0deg) scale(1)', opacity: 1 },
            { transform: 'rotateY(-90deg) scale(0.5)', opacity: 0 }
        ],
        panel: [
            { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
            { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }
        ],
        circle: [
            { clipPath: 'circle(0% at 50% 50%)' },
            { clipPath: 'circle(100% at 50% 50%)' },
            { clipPath: 'circle(0% at 50% 50%)' }
        ]
    };
    
    // Run animation
    const animation = overlay.animate(animations[type] || animations.wipe, {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Hide overlay after animation and call callback
    animation.onfinish = () => {
        overlay.style.opacity = '0';
        if (callback) callback();
    };
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

function setupEventListeners() {
    // Theme toggle
    dom.themeToggle.addEventListener('click', toggleTheme);
    
    // Halftone effect toggle
    dom.halftoneToggle.addEventListener('click', toggleHalftone);
    
    // Character carousel navigation
    dom.charPrev.addEventListener('click', () => {
        const newIndex = CONFIG.currentCharacterIndex === 0 
            ? CHARACTERS.length - 1 
            : CONFIG.currentCharacterIndex - 1;
        setActiveCharacter(newIndex);
    });
    
    dom.charNext.addEventListener('click', () => {
        const newIndex = CONFIG.currentCharacterIndex === CHARACTERS.length - 1 
            ? 0 
            : CONFIG.currentCharacterIndex + 1;
        setActiveCharacter(newIndex);
    });
    
    // Seasonal filter buttons
    dom.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            dom.filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter anime grid
            const filter = button.dataset.filter;
            renderAnimeGrid(filter);
            
            // Animate transition
            animateTransition('flip');
        });
    });
    
    // Keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const newIndex = CONFIG.currentCharacterIndex === 0 
                ? CHARACTERS.length - 1 
                : CONFIG.currentCharacterIndex - 1;
            setActiveCharacter(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = CONFIG.currentCharacterIndex === CHARACTERS.length - 1 
                ? 0 
                : CONFIG.currentCharacterIndex + 1;
            setActiveCharacter(newIndex);
        }
    });
    
    // Scroll animations
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Poll interaction
    const pollOptions = document.querySelectorAll('.poll-option');
    pollOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Update vote count animation
            const bar = option.querySelector('.option-bar');
            const currentVotes = parseInt(bar.dataset.votes);
            const newVotes = currentVotes + 5; // Simulate vote
            
            // Animate bar width
            bar.style.width = `${newVotes}%`;
            bar.dataset.votes = newVotes;
            
            // Update online count randomly
            const onlineCount = document.getElementById('onlineCount');
            const current = parseInt(onlineCount.textContent.replace(',', ''));
            const change = Math.floor(Math.random() * 10) - 3; // Random change -3 to +6
            onlineCount.textContent = (current + change).toLocaleString();
        });
    });
}

// ============================================
// THEME & VISUAL EFFECT TOGGLES
// ============================================

// Toggle between dark and light themes
function toggleTheme() {
    const isDark = CONFIG.theme === 'dark';
    CONFIG.theme = isDark ? 'light' : 'dark';
    
    // Update data attribute on body
    dom.body.dataset.theme = CONFIG.theme;
    
    // Update toggle button icon
    const icon = dom.themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    
    // Animate transition
    animateTransition('flip');
    
    console.log(`Theme changed to ${CONFIG.theme}`);
}

// Toggle halftone effect
function toggleHalftone() {
    CONFIG.halftoneActive = !CONFIG.halftoneActive;
    
    if (CONFIG.halftoneActive) {
        dom.body.classList.add('halftone-active');
        dom.halftoneToggle.classList.add('active');
    } else {
        dom.body.classList.remove('halftone-active');
        dom.halftoneToggle.classList.remove('active');
    }
    
    // Animate button
    dom.halftoneToggle.style.transform = 'scale(1.2)';
    setTimeout(() => {
        dom.halftoneToggle.style.transform = 'scale(1)';
    }, 300);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function handleScrollAnimations() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Parallax effect for manga panels
    const panels = document.querySelectorAll('.manga-panel');
    panels.forEach(panel => {
        const rect = panel.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
            const speed = panel.dataset.panel === '4' ? 0.1 : 0.05;
            const translateY = (rect.top - windowHeight / 2) * speed;
            panel.style.transform = `translateY(${translateY}px)`;
        }
    });
    
    // Animate tracker stats when visible
    const trackerStats = document.querySelector('.tracker-stats');
    if (trackerStats) {
        const rect = trackerStats.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible && !trackerStats.classList.contains('animated')) {
            trackerStats.classList.add('animated');
            
            // Animate stat cards sequentially
            const statCards = trackerStats.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }, index * 200);
            });
        }
    }
}

// ============================================
// INITIALIZE ON LOAD
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', init);

// Add loading animation
window.addEventListener('load', () => {
    // Remove any loading state
    document.body.classList.add('loaded');
    
    // Initial animations
    setTimeout(() => {
        animateTransition('circle');
    }, 500);
    
    // Auto-rotate carousel every 8 seconds
    setInterval(() => {
        const newIndex = CONFIG.currentCharacterIndex === CHARACTERS.length - 1 
            ? 0 
            : CONFIG.currentCharacterIndex + 1;
        setActiveCharacter(newIndex);
    }, 8000);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('MANGA VERSE error:', e.error);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for scroll events
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

// Throttle function for resize events
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

// Optimized scroll handler
const optimizedScroll = debounce(handleScrollAnimations, 16);
window.addEventListener('scroll', optimizedScroll);

// Handle window resize
window.addEventListener('resize', throttle(() => {
    updateCarouselPosition();
}, 250));

// ============================================
// EXPORT FOR MODULARITY (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        toggleTheme,
        toggleHalftone,
        setActiveCharacter,
        renderAnimeGrid
    };
}