// === THISTLEWICK'S HERBAL GRIMOIRE ===
// A Cottage Witch's Compendium — Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoader();
    initNavigation();
    initNightMode();
    initPressedFlowers();
    initSeasonWheel();
    initRemedyBooks();
    initScrollAnimations();
    initPotionCards();
});

// === CAULDRON LOADER ===
function initLoader() {
    const loader = document.getElementById('cauldronLoader');
    
    // Simulate brewing time with variable delay for organic feel
    const brewTime = 1800 + Math.random() * 800;
    
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Trigger entrance animations after loader fades
        setTimeout(() => {
            document.querySelector('.site-header').style.opacity = '1';
            document.querySelector('.site-header').style.transform = 'translateY(0)';
        }, 300);
    }, brewTime);
}

// === NAVIGATION ===
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('nav-item--active'));
            this.classList.add('nav-item--active');
            
            // Switch sections with fade transition
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.style.display = 'block';
                    // Small delay to allow display:block to apply before opacity transition
                    requestAnimationFrame(() => {
                        section.style.opacity = '1';
                        section.style.transform = 'translateY(0)';
                    });
                    section.classList.add('content-section--active');
                } else {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        section.style.display = 'none';
                        section.classList.remove('content-section--active');
                    }, 300);
                }
            });
            
            // Smooth scroll to top of content
            document.querySelector('.main-content').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
}

// === NIGHT MODE TOGGLE ===
function initNightMode() {
    const toggle = document.getElementById('nightToggle');
    const body = document.body;
    const overlay = document.getElementById('nightOverlay');
    let isNight = false;
    
    toggle.addEventListener('click', function() {
        isNight = !isNight;
        
        if (isNight) {
            body.classList.add('night-mode');
            overlay.classList.add('active');
            
            // Animate moth to candle transition
            animateToggleIcon('moth-to-candle');
        } else {
            body.classList.remove('night-mode');
            overlay.classList.remove('active');
            
            // Animate candle to moth transition
            animateToggleIcon('candle-to-moth');
        }
        
        // Save preference
        localStorage.setItem('thistlewick-night-mode', isNight);
    });
    
    // Check for saved preference
    const savedNight = localStorage.getItem('thistlewick-night-mode');
    if (savedNight === 'true') {
        toggle.click();
    }
}

function animateToggleIcon(direction) {
    const thumb = document.querySelector('.toggle-thumb');
    const moth = document.querySelector('.toggle-moth');
    const candle = document.querySelector('.toggle-candle');
    
    if (direction === 'moth-to-candle') {
        moth.style.transform = 'scale(0.8) rotate(15deg)';
        moth.style.opacity = '0';
        
        setTimeout(() => {
            candle.style.transform = 'scale(1) rotate(0deg)';
            candle.style.opacity = '1';
        }, 200);
    } else {
        candle.style.transform = 'scale(0.8) rotate(-15deg)';
        candle.style.opacity = '0';
        
        setTimeout(() => {
            moth.style.transform = 'scale(1) rotate(0deg)';
            moth.style.opacity = '1';
        }, 200);
    }
}

// === PRESSED FLOWERS CAROUSEL ===
function initPressedFlowers() {
    const specimens = [
        {
            name: 'Digitalis purpurea',
            common: 'Foxglove — Lady\'s Glove',
            date: 'Pressed: Midsummer\'s Eve, Year of the Drowned Star',
            detailTitle: 'Foxglove',
            verse: 'The folk\'s glove, the fairies\' cap,<br>Purple bells that overlap,<br>Deadly beauty, healing art,<br>Two edges on a single heart.',
            properties: 'Grows where the fairy folk have danced, or so the old ones say. The flowers nod downward, as if listening to secrets in the earth. Every part contains digitalin, a heart medicine so potent that the difference between cure and poison is measured in careful drops.\n\nIn the village where I was born, they planted foxglove near the door to keep wicked spirits from entering. I plant it for the bumblebees, who crawl so far into each bell that only their fuzzy bottoms show.',
            uses: ['Tincture of leaf for failing heart (physician\'s measure only)', 'Compress of flower for deep bruises and swelling', 'Dried leaves in sachet for protection during sleep', 'Flower essence for those who fear they have no right to take up space']
        },
        {
            name: 'Filipendula ulmaria',
            common: 'Meadowsweet — Queen of the Meadow',
            date: 'Pressed: Lammas Tide, Year of the Bramble Moon',
            detailTitle: 'Meadowsweet',
            verse: 'She wears her cream-white flowers high,<br>Above the meadow, touching sky,<br>The meadow\'s queen, the river\'s friend,<br>Whose sweet scent marks the summer\'s end.',
            properties: 'Where water meets grass, there grows the meadowsweet. I find her by her perfume before I see her flowers, that honey-almond scent that hangs in damp air like a promise. She is older than aspirin, which was synthesized from her salicylic acid; she is gentler too, healing the stomach even as she eases pain.\n\nThe old name "bridewort" tells of her garlands for wedding feasts. I have dried her for tea, fermented her for wine, and scattered her on the graves of those I loved, that their resting might be sweet.',
            uses: ['Flowering tops for tea, eases pain without harm to stomach', 'Fresh plant in wine, for celebration and digestion both', 'Dried flowers in pot-pourri, for remembering summer', 'Root extract for tightening, when the body needs holding in']
        },
        {
            name: 'Crataegus monogyna',
            common: 'Hawthorn — May Tree',
            date: 'Pressed: Beltane Dawn, Year of the Silver Frost',
            detailTitle: 'Hawthorn',
            verse: 'The may-tree blooms but brief and white,<br>A week of glory, pure and bright,<br>Then berries red for winter\'s store,<br>The hawthorn gives and gives the more.',
            properties: 'Never bring hawthorn blossom into the house, my grandmother warned. The fair folk live in such trees, and they do not take kindly to theft. Yet I have sat beneath her flowering boughs on May mornings, and felt nothing but welcome, nothing but the ancient peace of a tree that has watched centuries pass.\n\nHer wood is hard as hope, her thorns sharp as unspoken words. The berries, called haws, feed the birds through hungry months. The heart-shaped leaves, when I look closely, seem to pulse with the same rhythm they regulate in those who drink their medicine.',
            uses: ['Berry and flower tincture for heart rhythm and blood pressure', 'Young leaf buds for spring tonic, bitter and awakening', 'Thorn pricks to bleed, in old practice for fever', 'Blossom essence for those with guarded hearts, fearing to love']
        }
    ];
    
    let currentIndex = 0;
    const leftPage = document.querySelector('.press-page--left');
    const rightPage = document.querySelector('.press-page--right');
    const dots = document.querySelectorAll('.press-dot');
    const prevBtn = document.querySelector('.press-nav-btn--prev');
    const nextBtn = document.querySelector('.press-nav-btn--next');
    
    function updateDisplay() {
        const specimen = specimens[currentIndex];
        
        // Animate page turn
        leftPage.style.transform = 'rotateY(-15deg)';
        rightPage.style.transform = 'rotateY(15deg)';
        leftPage.style.opacity = '0.7';
        rightPage.style.opacity = '0.7';
        
        setTimeout(() => {
            // Update content
            updateSpecimenDisplay(specimen);
            
            // Animate back
            leftPage.style.transform = 'rotateY(0deg)';
            rightPage.style.transform = 'rotateY(0deg)';
            leftPage.style.opacity = '1';
            rightPage.style.opacity = '1';
        }, 300);
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('press-dot--active', i === currentIndex);
        });
        
        // Update detail panel
        updateDetailPanel(specimen);
    }
    
    function updateSpecimenDisplay(specimen) {
        // In a full implementation, this would swap SVG content
        // For now, we update the labels
        const labels = document.querySelectorAll('.specimen-label');
        labels.forEach(label => {
            const h4 = label.querySelector('h4');
            const common = label.querySelector('.common-name');
            const date = label.querySelector('.press-date');
            
            if (h4) h4.textContent = specimen.name;
            if (common) common.textContent = specimen.common;
            if (date) date.textContent = specimen.date;
        });
    }
    
    function updateDetailPanel(specimen) {
        const panel = document.getElementById('flowerDetail');
        const title = panel.querySelector('.detail-title');
        const verse = panel.querySelector('.detail-verse p');
        const properties = panel.querySelector('.detail-properties');
        const uses = panel.querySelector('.detail-uses ul');
        
        title.style.opacity = '0';
        
        setTimeout(() => {
            title.textContent = specimen.detailTitle;
            verse.innerHTML = specimen.verse;
            
            const propsParagraphs = properties.querySelectorAll('p');
            const propTexts = specimen.properties.split('\n\n');
            propsParagraphs.forEach((p, i) => {
                p.textContent = propTexts[i] || '';
            });
            
            uses.innerHTML = specimen.uses.map(use => 
                `<li>${use}</li>`
            ).join('');
            
            title.style.opacity = '1';
        }, 200);
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + specimens.length) % specimens.length;
        updateDisplay();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % specimens.length;
        updateDisplay();
    });
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateDisplay();
        });
    });
    
    // Click on specimens to cycle
    document.querySelectorAll('.flower-specimen').forEach(spec => {
        spec.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % specimens.length;
            updateDisplay();
        });
    });
}

// === SEASON WHEEL ===
function initSeasonWheel() {
    const wedges = document.querySelectorAll('.season-wedge');
    const panels = document.querySelectorAll('.season-panel');
    const pointer = document.querySelector('.wheel-pointer');
    
    wedges.forEach(wedge => {
        wedge.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            
            // Update active wedge
            wedges.forEach(w => w.classList.remove('season-wedge--active'));
            this.classList.add('season-wedge--active');
            
            // Rotate pointer to indicate selection
            const rotation = getSeasonRotation(season);
            pointer.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            pointer.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
            
            // Switch panel
            panels.forEach(panel => {
                if (panel.getAttribute('data-season') === season) {
                    panel.style.display = 'block';
                    requestAnimationFrame(() => {
                        panel.classList.add('season-panel--active');
                    });
                } else {
                    panel.classList.remove('season-panel--active');
                    setTimeout(() => {
                        if (!panel.classList.contains('season-panel--active')) {
                            panel.style.display = 'none';
                        }
                    }, 500);
                }
            });
        });
    });
}

function getSeasonRotation(season) {
    const rotations = {
        spring: 0,
        summer: 90,
        autumn: 180,
        winter: 270
    };
    return rotations[season] || 0;
}

// === REMEDY BOOKS ACCORDION ===
function initRemedyBooks() {
    const books = document.querySelectorAll('.remedy-book');
    
    books.forEach(book => {
        book.addEventListener('click', function() {
            const isOpen = this.classList.contains('is-open');
            
            // Close all other books
            books.forEach(b => {
                if (b !== this) {
                    b.classList.remove('is-open');
                }
            });
            
            // Toggle this book
            this.classList.toggle('is-open', !isOpen);
            
            // Add subtle page rustle effect
            if (!isOpen) {
                const pages = this.querySelector('.handwritten-page');
                pages.style.transform = 'rotate(-0.3deg)';
                setTimeout(() => {
                    pages.style.transform = 'rotate(0deg)';
                }, 400);
            }
        });
    });
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards, items, and panels
    const animateElements = document.querySelectorAll(
        '.potion-card, .forage-item, .flower-detail-panel, .remedy-book'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// === POTION CARD INTERACTIONS ===
function initPotionCards() {
    const cards = document.querySelectorAll('.potion-card');
    
    cards.forEach(card => {
        const liquid = card.querySelector('.liquid');
        let liquidHeight = 38;
        
        card.addEventListener('mouseenter', () => {
            // Gentle liquid swirl on hover
            if (liquid) {
                liquid.style.height = '42px';
                liquid.style.transition = 'height 0.4s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (liquid) {
                liquid.style.height = '38px';
            }
        });
        
        // Click to "sample" the potion
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on links or buttons
            if (e.target.closest('a, button')) return;
            
            const bottle = this.querySelector('.potion-bottle');
            bottle.style.transform = 'rotate(-5deg)';
            bottle.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                bottle.style.transform = 'rotate(0deg)';
            }, 300);
            
            // Create a tiny bubble effect
            createMiniBubbles(this);
        });
    });
}

function createMiniBubbles(card) {
    const bottle = card.querySelector('.bottle-body');
    if (!bottle) return;
    
    for (let i = 0; i < 3; i++) {
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            bottom: 10px;
            left: ${30 + Math.random() * 40}%;
            pointer-events: none;
            animation: mini-bubble-rise 0.8s ease-out forwards;
            animation-delay: ${i * 0.15}s;
        `;
        bottle.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 1000);
    }
}

// Add keyframes for mini bubbles dynamically
const bubbleStyle = document.createElement('style');
bubbleStyle.textContent = `
    @keyframes mini-bubble-rise {
        0% { bottom: 10px; opacity: 0.8; transform: scale(0.5); }
        100% { bottom: 35px; opacity: 0; transform: scale(1.2); }
    }
`;
document.head.appendChild(bubbleStyle);

// === UTILITY: Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === UTILITY: Parallax for flower borders on scroll ===
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const borders = document.querySelectorAll('.flower-border');
            
            borders.forEach((border, index) => {
                const speed = 0.02 + (index * 0.01);
                const yPos = -(scrolled * speed);
                border.style.transform = `translateY(${yPos}px) ${getInitialTransform(border)}`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

function getInitialTransform(element) {
    const classes = element.classList;
    if (classes.contains('flower-border--tr')) return 'scaleX(-1)';
    if (classes.contains('flower-border--bl')) return 'scaleY(-1)';
    if (classes.contains('flower-border--br')) return 'scale(-1)';
    return '';
}