/* ============================================
   CHRONICLES OF THE DARK AGES
   Interactive JavaScript
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        particleCount: 40,
        scrollRevealThreshold: 0.1,
        scrollRevealRootMargin: '0px 0px -50px 0px',
        carouselAutoplayInterval: 8000,
        bellTollDuration: 1000,
        plagueDoctorMessages: [
            "Step carefully, traveler. The Dark Ages hold many secrets...",
            "The bell tolls not for the dead, but for those yet to come...",
            "Beware the winter months - the cold claims more than steel...",
            "In the monasteries, knowledge is preserved against the tide of time...",
            "Vikings sail from the north, seeking gold and glory...",
            "The feudal system binds all - lord, knight, and peasant alike...",
            "Plague walks these lands. Carry herbs. Trust no one.",
            "Charlemagne has united much of the West. For how long, only time will tell...",
            "The Church power grows with each passing decade...",
            "Castles rise across the land - fortresses of stone and will...",
            "The manuscript you hold was crafted by candlelight over many months...",
            "Remember, traveler - not all that is old is forgotten..."
        ],
        territoryData: {
            'england': {
                name: 'Kingdom of England',
                description: 'A land of Anglo-Saxon kingdoms gradually unified under Wessex. Alfred the Great repelled the Viking invasions and laid the foundations for a united English kingdom.',
                stats: ['Capital: Winchester', 'Ruler: Alfred the Great', 'Population: ~1-2 million', 'Religion: Christianity']
            },
            'francia': {
                name: 'Empire of Francia',
                description: 'The vast Carolingian Empire stretching from the Pyrenees to the Elbe. Charlemagne crowned Emperor in 800 AD, creating the largest western European realm since Rome.',
                stats: ['Capital: Aachen', 'Ruler: Charlemagne', 'Population: ~10-15 million', 'Religion: Christianity']
            },
            'norway': {
                name: 'Norway',
                description: 'The land of fjords and Vikings. Norwegian explorers reached Iceland, Greenland, and even North America centuries before Columbus. A harsh land breeding hardy seafarers.',
                stats: ['Capital: Nidaros', 'Ruler: Various Kings', 'Population: ~100,000', 'Religion: Norse Paganism']
            },
            'denmark': {
                name: 'Denmark',
                description: 'Gateway of the Viking Age. Danish Vikings raided England, France, and beyond. King Gorm the Old would later unite Denmark, and his son Harald Bluetooth would Christianize the realm.',
                stats: ['Capital: Jelling', 'Ruler: Gorm the Old', 'Population: ~200,000', 'Religion: Norse Paganism']
            },
            'scotland': {
                name: 'Scotland (Alba)',
                description: 'The Kingdom of Alba, formed from the union of Picts and Scots. A land of rugged highlands, fierce clans, and independent spirit that would resist English domination for centuries.',
                stats: ['Capital: Scone', 'Ruler: Kenneth MacAlpin', 'Population: ~200,000', 'Religion: Christianity']
            },
            'germany': {
                name: 'East Francia (Germany)',
                description: 'The eastern portion of Charlemagne empire, evolving into the Kingdom of Germany. The Ottonian dynasty would establish the Holy Roman Empire, claiming succession from Rome.',
                stats: ['Capital: Various', 'Ruler: Henry the Fowler', 'Population: ~3-4 million', 'Religion: Christianity']
            },
            'al-andalus': {
                name: 'Al-Andalus',
                description: 'Islamic Iberia -- a center of learning, science, and culture. Cordoba library held 400,000 volumes when most of Europe had forgotten how to read. A beacon of civilization.',
                stats: ['Capital: Cordoba', 'Ruler: Caliph of Cordoba', 'Population: ~5-7 million', 'Religion: Islam']
            },
            'asturias': {
                name: 'Kingdom of Asturias',
                description: 'The last bastion of Christian Spain after the Moorish conquest. From these northern mountains, the Reconquista would begin -- a centuries-long campaign to reclaim the peninsula.',
                stats: ['Capital: Oviedo', 'Ruler: Alfonso III', 'Population: ~500,000', 'Religion: Christianity']
            },
            'italy': {
                name: 'Italy & Papal States',
                description: 'The heart of the Catholic Church and the ruins of the Roman Empire. The Pope wielded spiritual authority over all Christendom, while various kingdoms and city-states vied for temporal power.',
                stats: ['Capital: Rome', 'Ruler: The Pope', 'Population: ~3-4 million', 'Religion: Christianity']
            },
            'byzantium': {
                name: 'Byzantine Empire',
                description: 'The Eastern Roman Empire -- continuation of Rome itself. Constantinople was the largest city in Europe, a marvel of wealth, learning, and military might that would endure for another millennium.',
                stats: ['Capital: Constantinople', 'Ruler: Basil I', 'Population: ~15-20 million', 'Religion: Orthodox Christianity']
            }
        }
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const DOM = {
        body: document.body,
        themeToggle: document.getElementById('themeToggle'),
        plagueDoctor: document.getElementById('plagueDoctor'),
        plagueDoctorBubble: document.getElementById('plagueDoctorBubble'),
        plagueDoctorText: document.querySelector('.plague-doctor__text'),
        bell: document.getElementById('bell'),
        bellSound: document.getElementById('bellSound'),
        heroParticles: document.getElementById('heroParticles'),
        mapInfoPanel: document.getElementById('mapInfoPanel'),
        mapInfoTitle: document.getElementById('mapInfoTitle'),
        mapInfoDesc: document.getElementById('mapInfoDesc'),
        mapInfoStats: document.getElementById('mapInfoStats'),
        territoryCells: document.querySelectorAll('[data-territory]'),
        wisdomCarousel: document.getElementById('wisdomCarousel'),
        wisdomQuotes: document.querySelectorAll('.wisdom__quote'),
        wisdomPrev: document.getElementById('wisdomPrev'),
        wisdomNext: document.getElementById('wisdomNext'),
        wisdomDots: document.querySelectorAll('.wisdom__dot'),
        canvasInitial: document.getElementById('canvasInitial'),
        carpetPattern: document.getElementById('carpetPattern'),
        revealElements: document.querySelectorAll('[data-reveal]')
    };

    // ============================================
    // SCROLL REVEAL ANIMATION
    // ============================================
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
                    const siblingIndex = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = (siblingIndex * 0.1) + 's';
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.scrollRevealThreshold,
            rootMargin: CONFIG.scrollRevealRootMargin
        });

        DOM.revealElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // DAY/NIGHT CYCLE
    // ============================================
    let currentTheme = 'dusk';
    const themes = ['dusk', 'night', 'dawn', 'day'];
    let themeIndex = 0;

    function initThemeToggle() {
        DOM.themeToggle.addEventListener('click', () => {
            themeIndex = (themeIndex + 1) % themes.length;
            currentTheme = themes[themeIndex];
            DOM.body.setAttribute('data-theme', currentTheme);
            
            updateParticleColors();
            showPlagueDoctorMessage('The ' + currentTheme + ' falls upon the land...');
            tollBell();
        });
    }

    function updateParticleColors() {
        const particles = DOM.heroParticles.querySelectorAll('.particle');
        particles.forEach(p => {
            switch(currentTheme) {
                case 'night':
                    p.style.background = '#8888cc';
                    p.style.boxShadow = '0 0 6px #8888cc';
                    break;
                case 'dawn':
                    p.style.background = '#ffaa44';
                    p.style.boxShadow = '0 0 6px #ffaa44';
                    break;
                case 'day':
                    p.style.background = '#ffcc00';
                    p.style.boxShadow = '0 0 6px #ffcc00';
                    break;
                default:
                    p.style.background = '#c9a84c';
                    p.style.boxShadow = '0 0 6px #c9a84c';
            }
        });
    }

    // ============================================
    // PLAGUE DOCTOR GUIDE
    // ============================================
    let plagueDoctorMessageIndex = 0;
    let plagueDoctorTimer = null;

    function initPlagueDoctor() {
        plagueDoctorTimer = setInterval(() => {
            const msg = CONFIG.plagueDoctorMessages[plagueDoctorMessageIndex];
            showPlagueDoctorMessage(msg);
            plagueDoctorMessageIndex = (plagueDoctorMessageIndex + 1) % CONFIG.plagueDoctorMessages.length;
        }, 15000);

        DOM.plagueDoctor.addEventListener('click', () => {
            showPlagueDoctorMessage(CONFIG.plagueDoctorMessages[plagueDoctorMessageIndex]);
            plagueDoctorMessageIndex = (plagueDoctorMessageIndex + 1) % CONFIG.plagueDoctorMessages.length;
        });
    }

    function showPlagueDoctorMessage(message) {
        DOM.plagueDoctorText.textContent = '"' + message + '"';
        DOM.plagueDoctorBubble.classList.add('plague-doctor__bubble--visible');
        
        setTimeout(() => {
            DOM.plagueDoctorBubble.classList.remove('plague-doctor__bubble--visible');
        }, 4000);
    }

    // ============================================
    // BELL TOLLING
    // ============================================
    function initBell() {
        setTimeout(() => {
            tollBell();
        }, 1500);

        const bellTower = document.getElementById('bellTower');
        if (bellTower) {
            bellTower.style.cursor = 'pointer';
            bellTower.addEventListener('click', tollBell);
        }
    }

    function tollBell() {
        if (!DOM.bell) return;
        
        DOM.bell.classList.remove('tolling');
        void DOM.bell.offsetWidth;
        DOM.bell.classList.add('tolling');

        if (DOM.bellSound) {
            DOM.bellSound.currentTime = 0;
            DOM.bellSound.play().catch(() => {});
        }

        setTimeout(() => {
            DOM.bell.classList.remove('tolling');
        }, CONFIG.bellTollDuration);
    }

    // ============================================
    // PARTICLE SYSTEM (STARS/EMBERS)
    // ============================================
    function initParticles() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 4 + 2;
        const delay = Math.random() * 4;
        const duration = Math.random() * 3 + 3;
        
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';
        
        switch(currentTheme) {
            case 'night':
                particle.style.background = '#8888cc';
                particle.style.boxShadow = '0 0 6px #8888cc';
                break;
            case 'dawn':
                particle.style.background = '#ffaa44';
                particle.style.boxShadow = '0 0 6px #ffaa44';
                break;
            case 'day':
                particle.style.background = '#ffcc00';
                particle.style.boxShadow = '0 0 6px #ffcc00';
                break;
            default:
                particle.style.background = '#c9a84c';
                particle.style.boxShadow = '0 0 6px #c9a84c';
        }
        
        DOM.heroParticles.appendChild(particle);
    }

    // ============================================
    // INTERACTIVE KINGDOM MAP
    // ============================================
    function initMap() {
        DOM.territoryCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const territoryId = cell.getAttribute('data-territory');
                const data = CONFIG.territoryData[territoryId];
                
                if (data) {
                    DOM.territoryCells.forEach(c => c.classList.remove('active'));
                    cell.classList.add('active');
                    
                    DOM.mapInfoTitle.textContent = data.name;
                    DOM.mapInfoDesc.textContent = data.description;
                    
                    DOM.mapInfoStats.innerHTML = '';
                    data.stats.forEach(stat => {
                        const statEl = document.createElement('span');
                        statEl.classList.add('map__info-stat');
                        statEl.textContent = stat;
                        DOM.mapInfoStats.appendChild(statEl);
                    });
                    
                    DOM.mapInfoPanel.style.transform = 'scale(0.95)';
                    DOM.mapInfoPanel.style.opacity = '0';
                    requestAnimationFrame(() => {
                        DOM.mapInfoPanel.style.transform = 'scale(1)';
                        DOM.mapInfoPanel.style.opacity = '1';
                    });
                    
                    showPlagueDoctorMessage('Ah, ' + data.name + '... a realm of great significance.');
                }
            });
        });
    }

    // ============================================
    // WISDOM CAROUSEL
    // ============================================
    let currentQuote = 0;
    let carouselTimer = null;

    function initWisdomCarousel() {
        showQuote(0);
        
        DOM.wisdomPrev.addEventListener('click', () => {
            currentQuote = (currentQuote - 1 + DOM.wisdomQuotes.length) % DOM.wisdomQuotes.length;
            showQuote(currentQuote);
            resetCarouselTimer();
        });
        
        DOM.wisdomNext.addEventListener('click', () => {
            currentQuote = (currentQuote + 1) % DOM.wisdomQuotes.length;
            showQuote(currentQuote);
            resetCarouselTimer();
        });
        
        DOM.wisdomDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentQuote = index;
                showQuote(currentQuote);
                resetCarouselTimer();
            });
        });
        
        startCarouselTimer();
    }

    function showQuote(index) {
        DOM.wisdomQuotes.forEach(q => q.classList.remove('wisdom__quote--active'));
        DOM.wisdomDots.forEach(d => d.classList.remove('wisdom__dot--active'));
        
        DOM.wisdomQuotes[index].classList.add('wisdom__quote--active');
        DOM.wisdomDots[index].classList.add('wisdom__dot--active');
    }

    function startCarouselTimer() {
        carouselTimer = setInterval(() => {
            currentQuote = (currentQuote + 1) % DOM.wisdomQuotes.length;
            showQuote(currentQuote);
        }, CONFIG.carouselAutoplayInterval);
    }

    function resetCarouselTimer() {
        clearInterval(carouselTimer);
        startCarouselTimer();
    }

    // ============================================
    // CANVAS ILLUMINATED INITIAL
    // ============================================
    function initCanvasArt() {
        if (!DOM.canvasInitial) return;
        
        const canvas = DOM.canvasInitial;
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        
        canvas.width = rect.width || 300;
        canvas.height = rect.height || 240;
        
        drawIlluminatedInitial(ctx, canvas.width, canvas.height);
    }

    function drawIlluminatedInitial(ctx, width, height) {
        const pixelSize = 4;
        const cols = Math.floor(width / pixelSize);
        const rows = Math.floor(height / pixelSize);
        
        ctx.fillStyle = '#f4e8d1';
        ctx.fillRect(0, 0, width, height);
        
        drawPixelBorder(ctx, width, height, pixelSize, '#8b6914');
        
        const dPattern = [
            "  XXXXXXXX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XX    XX  ",
            "  XXXXXXXX  "
        ];
        
        const offsetX = Math.floor((cols - dPattern[0].length) / 2);
        const offsetY = Math.floor((rows - dPattern.length) / 2);
        
        for (let y = 0; y < dPattern.length; y++) {
            for (let x = 0; x < dPattern[y].length; x++) {
                if (dPattern[y][x] === 'X') {
                    ctx.fillStyle = '#c9a84c';
                    ctx.fillRect(
                        (offsetX + x) * pixelSize,
                        (offsetY + y) * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
        
        drawPixelVines(ctx, width, height, pixelSize, '#2d4a2d');
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillStyle = '#e8d08c';
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }

    function drawPixelBorder(ctx, width, height, pixelSize, color) {
        const borderThickness = 2;
        
        for (let x = 0; x < width; x += pixelSize) {
            ctx.fillStyle = color;
            for (let i = 0; i < borderThickness; i++) {
                ctx.fillRect(x, i * pixelSize, pixelSize, pixelSize);
                ctx.fillRect(x, height - (i + 1) * pixelSize, pixelSize, pixelSize);
            }
        }
        
        for (let y = 0; y < height; y += pixelSize) {
            ctx.fillStyle = color;
            for (let i = 0; i < borderThickness; i++) {
                ctx.fillRect(i * pixelSize, y, pixelSize, pixelSize);
                ctx.fillRect(width - (i + 1) * pixelSize, y, pixelSize, pixelSize);
            }
        }
        
        const cornerSize = pixelSize * 4;
        ctx.fillStyle = '#6b1a1a';
        ctx.fillRect(0, 0, cornerSize, cornerSize);
        ctx.fillRect(width - cornerSize, 0, cornerSize, cornerSize);
        ctx.fillRect(0, height - cornerSize, cornerSize, cornerSize);
        ctx.fillRect(width - cornerSize, height - cornerSize, cornerSize, cornerSize);
    }

    function drawPixelVines(ctx, width, height, pixelSize, color) {
        const vinePattern = [
            {x: 0.1, y: 0.2}, {x: 0.15, y: 0.25}, {x: 0.2, y: 0.22},
            {x: 0.8, y: 0.3}, {x: 0.85, y: 0.35}, {x: 0.78, y: 0.38},
            {x: 0.12, y: 0.7}, {x: 0.18, y: 0.75}, {x: 0.15, y: 0.78},
            {x: 0.82, y: 0.68}, {x: 0.88, y: 0.72}, {x: 0.85, y: 0.76}
        ];
        
        ctx.fillStyle = color;
        vinePattern.forEach(vine => {
            const x = vine.x * width;
            const y = vine.y * height;
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(x + i * pixelSize * 2, y + i * pixelSize, pixelSize, pixelSize);
            }
            ctx.fillRect(x + 6 * pixelSize, y, pixelSize * 2, pixelSize * 2);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================
    // DYNAMIC TOOLTIP FOR MAP
    // ============================================
    function initTooltips() {
        const tooltipCells = document.querySelectorAll('[data-tooltip]');
        
        tooltipCells.forEach(cell => {
            cell.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'map-tooltip';
                tooltip.textContent = cell.getAttribute('data-tooltip');
                tooltip.style.cssText = `
                    position: fixed;
                    background: var(--color-parchment-dark);
                    border: 2px solid var(--color-gold-dark);
                    padding: 8px 12px;
                    font-family: var(--font-body);
                    font-size: 14px;
                    color: var(--color-ink);
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: var(--shadow-pixel);
                    transition: opacity 0.2s;
                `;
                document.body.appendChild(tooltip);
                
                const updatePosition = (evt) => {
                    tooltip.style.left = evt.clientX + 12 + 'px';
                    tooltip.style.top = evt.clientY - 40 + 'px';
                };
                
                updatePosition(e);
                cell.addEventListener('mousemove', updatePosition);
                cell._tooltip = tooltip;
                cell._updatePosition = updatePosition;
            });
            
            cell.addEventListener('mouseleave', () => {
                if (cell._tooltip) {
                    cell._tooltip.remove();
                    cell.removeEventListener('mousemove', cell._updatePosition);
                }
            });
        });
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                DOM.plagueDoctorBubble.classList.remove('plague-doctor__bubble--visible');
            }
            if (DOM.wisdomCarousel.matches(':hover')) {
                if (e.key === 'ArrowLeft') DOM.wisdomPrev.click();
                if (e.key === 'ArrowRight') DOM.wisdomNext.click();
            }
        });
    }

    // ============================================
    // RESIZE HANDLER FOR CANVAS
    // ============================================
    function initResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (DOM.canvasInitial) initCanvasArt();
            }, 250);
        });
    }

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    function initParallax() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const hero = document.getElementById('hero');
                    
                    if (hero && scrollY < window.innerHeight) {
                        const castle = hero.querySelector('.hero__castle');
                        const content = hero.querySelector('.hero__content');
                        
                        if (castle) castle.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
                        if (content) {
                            content.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
                            content.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ============================================
    // SEASONAL BACKGROUND SHIFTS
    // ============================================
    function initSeasonalEffects() {
        const seasonCards = document.querySelectorAll('[data-season]');
        seasonCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const season = card.getAttribute('data-season');
                DOM.body.style.transition = 'background-color 1s ease';
                switch(season) {
                    case 'spring': DOM.body.style.backgroundColor = '#1a2a1a'; break;
                    case 'summer': DOM.body.style.backgroundColor = '#2a2a1a'; break;
                    case 'autumn': DOM.body.style.backgroundColor = '#2a1a1a'; break;
                    case 'winter': DOM.body.style.backgroundColor = '#1a1a2a'; break;
                }
            });
            card.addEventListener('mouseleave', () => {
                DOM.body.style.backgroundColor = '';
            });
        });
    }

    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupAllFeatures);
        } else {
            setupAllFeatures();
        }
    }

    function setupAllFeatures() {
        initScrollReveal();
        initThemeToggle();
        initPlagueDoctor();
        initBell();
        initParticles();
        initMap();
        initWisdomCarousel();
        initSmoothScroll();
        initTooltips();
        initKeyboardNav();
        initResizeHandler();
        initParallax();
        initSeasonalEffects();
        setTimeout(initCanvasArt, 100);
    }

    init();
})();