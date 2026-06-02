document.addEventListener('DOMContentLoaded', () => {
    initializeCustomCursor();
    initializeGildedGlow();
    initializeGalleryFilters();
    initializeStainedGlassHarmonizer();
    initializeLightbox();
    initializeScrollAnimations();
});

function initializeCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const ring = document.getElementById('customCursorRing');
    
    if (!cursor || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function tick() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .gallery-item, .preset-btn, .gilded-slider');
    
    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'var(--dusty-rose)';
            ring.style.width = '50px';
            ring.style.height = '50px';
            ring.style.borderColor = 'var(--gold-bright)';
        });
        
        elem.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'var(--gold-bright)';
            ring.style.width = '32px';
            ring.style.height = '32px';
            ring.style.borderColor = 'var(--gold-metallic)';
        });
    });
}

function initializeGildedGlow() {
    const glowToggle = document.getElementById('glowToggle');
    if (!glowToggle) return;

    glowToggle.addEventListener('click', () => {
        document.body.classList.toggle('gilded-glow-active');
    });
}

function initializeGalleryFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(btn => btn.classList.remove('active'));
            filter.classList.add('active');

            const selectedCategory = filter.getAttribute('data-filter');

            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = '';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9) translateY(10px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    });
}

function initializeStainedGlassHarmonizer() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    const lightAngleSlider = document.getElementById('lightAngle');
    const lightBeam = document.getElementById('glassLightBeam');
    const glassWindow = document.getElementById('stainedGlassWindow');

    if (!glassWindow) return;

    const skySegments = glassWindow.querySelectorAll('.segment-sky');
    const sunSegments = glassWindow.querySelectorAll('.segment-sun');
    const leafSegments = glassWindow.querySelectorAll('.segment-leaf-1');
    const rose1Segments = glassWindow.querySelectorAll('.segment-rose-1');
    const rose2Segments = glassWindow.querySelectorAll('.segment-rose-2');
    const waterSegments = glassWindow.querySelectorAll('.segment-water');

    const seasonalSchemes = {
        solstice: {
            sky: '#2a52be',
            sun: '#ffa500',
            leaf: '#228b22',
            rose1: '#b03060',
            rose2: '#d02090',
            water: '#008080',
            beamColor: '#ffdf7a'
        },
        autumn: {
            sky: '#1b3f3b',
            sun: '#d45b12',
            leaf: '#8a7316',
            rose1: '#800000',
            rose2: '#a0522d',
            water: '#4682b4',
            beamColor: '#e08e3d'
        },
        aurora: {
            sky: '#4b0082',
            sun: '#ee82ee',
            leaf: '#00fa9a',
            rose1: '#8a2be2',
            rose2: '#ff1493',
            water: '#1e90ff',
            beamColor: '#b0e0e6'
        }
    };

    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            presetButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const preset = button.getAttribute('data-light');
            applyGlassScheme(seasonalSchemes[preset]);
        });
    });

    if (lightAngleSlider && lightBeam) {
        lightAngleSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            lightBeam.setAttribute('cx', val);
        });
    }

    function applyGlassScheme(scheme) {
        skySegments.forEach(seg => seg.style.fill = scheme.sky);
        sunSegments.forEach(seg => seg.style.fill = scheme.sun);
        leafSegments.forEach(seg => seg.style.fill = scheme.leaf);
        rose1Segments.forEach(seg => seg.style.fill = scheme.rose1);
        rose2Segments.forEach(seg => seg.style.fill = scheme.rose2);
        waterSegments.forEach(seg => seg.style.fill = scheme.water);

        const gradientStop = document.querySelector('#sunGlow stop:nth-child(2)');
        if (gradientStop) {
            gradientStop.setAttribute('stop-color', scheme.beamColor);
        }
    }
}

function initializeLightbox() {
    const lightbox = document.getElementById('glassLightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const overlay = document.getElementById('lightboxOverlay');
    const inspectButtons = document.querySelectorAll('.btn-inspect');

    const artworkDatabase = {
        'L\'Éveil du Printemps': {
            category: 'Golden Canvas',
            desc: 'A mesmerizing arrangement of winding vines and soft floral contours surrounding an ethereal figure of youth. Painted using layers of natural tempera and finished with intricate, hand-pressed 24k gold leaf details that reflect ambient gallery lighting dynamically.',
            dimensions: '140 x 180 cm',
            year: '1901',
            gradient: 'linear-gradient(45deg, #11282c, #3b4b20, #aa7c11)'
        },
        'Symphonie Vitrail': {
            category: 'Stained Glass',
            desc: 'A magnificent arched architectural window pane. Lead structures weave seamlessly with colored favrile glass elements, designed to project geometric, floral, and rich warm light patterns onto nearby stone surfaces during mid-afternoon hours.',
            dimensions: '90 x 210 cm',
            year: '1903',
            gradient: 'linear-gradient(135deg, #441634, #163a44, #7a4d4d)'
        },
        'Le Paon Sacré': {
            category: 'Tapestries',
            desc: 'An exquisite silk panel featuring two stylized peacocks drinking from a fountain of gold. Hand-woven over eighteen months, utilizing fine metallic threads to capture the natural iridescent sheen of exotic bird plumes and organic waters.',
            dimensions: '200 x 200 cm',
            year: '1899',
            gradient: 'linear-gradient(210deg, #1a2a11, #4a2d4b, #dfb15b)'
        },
        'Rêverie de l\'Automne': {
            category: 'Golden Canvas',
            desc: 'A poetic rendering of falling amber leaves styled as decorative medallions. The piece utilizes organic sweeping lines to direct the viewers focus through a dreamlike cycle of seasonal decay and natural transformation.',
            dimensions: '120 x 150 cm',
            year: '1902',
            gradient: 'linear-gradient(15deg, #2b3d41, #7a4d4d, #b5924a)'
        },
        'Nectar d\'Iris': {
            category: 'Stained Glass',
            desc: 'A smaller scale decorative desk screen. Acid-etched detailing yields subtle, velvety textures upon the purple and cobalt glass elements, creating an organic flowing play of depth and opacity under soft firelight.',
            dimensions: '60 x 80 cm',
            year: '1904',
            gradient: 'linear-gradient(90deg, #111d2c, #2e3b31, #b07c7c)'
        },
        'La Chasse Mystique': {
            category: 'Tapestries',
            desc: 'A classic medieval-revival scene reimagined under an Art Nouveau lens. Fluid hounds chase golden stags through a dense forest of stylized trees, framed by an intricate border of wild lilies and interlocking whiplash stems.',
            dimensions: '250 x 180 cm',
            year: '1905',
            gradient: 'linear-gradient(315deg, #3d1b1b, #11282c, #d4af37)'
        }
    };

    inspectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemInner = e.target.closest('.item-inner');
            const title = itemInner.querySelector('.artwork-title').textContent;
            const data = artworkDatabase[title];

            if (data) {
                openLightbox(title, data);
            }
        });
    });

    function openLightbox(title, data) {
        document.getElementById('lightboxTitle').textContent = title;
        document.getElementById('lightboxCategory').textContent = data.category;
        document.getElementById('lightboxDesc').textContent = data.desc;
        document.getElementById('lightboxDimensions').textContent = data.dimensions;
        document.getElementById('lightboxYear').textContent = data.year;

        const targetVisual = document.querySelector('.lightbox-art-target');
        targetVisual.style.backgroundImage = data.gradient;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (overlay) overlay.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function initializeScrollAnimations() {
    const elementsToReveal = document.querySelectorAll('.gallery-item, .philosophy-container, .inquiry-frame, .stained-glass-interactive');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(elem => {
        elem.style.opacity = '0';
        elem.style.transform = 'translateY(40px) scale(0.98)';
        elem.style.transition = 'opacity 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1s cubic-bezier(0.25, 1, 0.5, 1)';
        revealObserver.observe(elem);
    });
}