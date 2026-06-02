/**
 * CALENDARIO SAGRADO — Interactive Ceremonial Calendar
 * Aztec & Mayan Cosmology Interface
 */
(function() {
    'use strict';

    // ==========================================
    // DATA
    // ==========================================
    const DAY_SIGNS = [
        { name: 'Cipactli', glyph: '🐊', meaning: 'Crocodile', domain: 'Beginning, Creation' },
        { name: 'Ehecatl', glyph: '💨', meaning: 'Wind', domain: 'Spirit, Breath' },
        { name: 'Calli', glyph: '🏠', meaning: 'House', domain: 'Rest, Foundation' },
        { name: 'Cuetzpalin', glyph: '🦎', meaning: 'Lizard', domain: 'Abundance, Growth' },
        { name: 'Coatl', glyph: '🐍', meaning: 'Serpent', domain: 'Wisdom, Knowledge' },
        { name: 'Miquiztli', glyph: '💀', meaning: 'Death', domain: 'Transformation, Rebirth' },
        { name: 'Mazatl', glyph: '🦌', meaning: 'Deer', domain: 'Grace, Swiftness' },
        { name: 'Tochtli', glyph: '🐇', meaning: 'Rabbit', domain: 'Fertility, Moon' },
        { name: 'Atl', glyph: '💧', meaning: 'Water', domain: 'Purification, Flow' },
        { name: 'Itzcuintli', glyph: '🐕', meaning: 'Dog', domain: 'Loyalty, Guide' },
        { name: 'Ozomatli', glyph: '🐒', meaning: 'Monkey', domain: 'Joy, Artistry' },
        { name: 'Malinalli', glyph: '🌿', meaning: 'Grass', domain: 'Tenacity, Renewal' },
        { name: 'Acatl', glyph: '🎋', meaning: 'Reed', domain: 'Authority, Justice' },
        { name: 'Ocelotl', glyph: '🐆', meaning: 'Jaguar', domain: 'Power, Night' },
        { name: 'Cuauhtli', glyph: '🦅', meaning: 'Eagle', domain: 'Vision, Sun' },
        { name: 'Cozcacuauhtli', glyph: '🦉', meaning: 'Vulture', domain: 'Renewal, Cycle' },
        { name: 'Ollin', glyph: '◎', meaning: 'Movement', domain: 'Change, Earthquake' },
        { name: 'Tecpatl', glyph: '🗡', meaning: 'Flint', domain: 'Sacrifice, Truth' },
        { name: 'Quiahuitl', glyph: '⛈', meaning: 'Rain', domain: 'Storm, Fertility' },
        { name: 'Xochitl', glyph: '🌺', meaning: 'Flower', domain: 'Beauty, Poetry' }
    ];

    const MONTHS = [
        { name: 'Atlcahualo', dates: 'Feb 2 - Feb 21', desc: 'Cessation of Water — Fasting and prayer for rains' },
        { name: 'Tlacaxipehualiztli', dates: 'Feb 22 - Mar 13', desc: 'Flaying of Men — Renewal of spring, skin rituals' },
        { name: 'Tozoztontli', dates: 'Mar 14 - Apr 2', desc: 'Small Vigil — Blood offerings to earth deities' },
        { name: 'Huey Tozoztli', dates: 'Apr 3 - Apr 22', desc: 'Great Vigil — Purification of homes and fields' },
        { name: 'Toxcatl', dates: 'Apr 23 - May 12', desc: 'Dryness — Feast of Tezcatlipoca, mirror of fate' },
        { name: 'Etzalcualiztli', dates: 'May 13 - Jun 1', desc: 'Eating of Maize and Beans — Rain deity celebrations' },
        { name: 'Tecuilhuitontli', dates: 'Jun 2 - Jun 21', desc: 'Small Feast of Lords — Honoring ancestors' },
        { name: 'Huey Tecuilhuitl', dates: 'Jun 22 - Jul 11', desc: 'Great Feast of Lords — Salt and maize harvest' },
        { name: 'Tlaxochimaco', dates: 'Jul 12 - Jul 31', desc: 'Birth of Flowers — Garlanding of deities' },
        { name: 'Xocotl Huetzi', dates: 'Aug 1 - Aug 20', desc: 'Falling of Fruits — Harvest of wild fruits' },
        { name: 'Ochpaniztli', dates: 'Aug 21 - Sep 9', desc: 'Sweeping — Cleansing of temples and roads' },
        { name: 'Teotleco', dates: 'Sep 10 - Sep 29', desc: 'Return of the Gods — Welcoming divine visitors' },
        { name: 'Tepeilhuitl', dates: 'Sep 30 - Oct 19', desc: 'Feast of Mountains — Serpent sculptures honored' },
        { name: 'Quecholli', dates: 'Oct 20 - Nov 8', desc: 'Precious Feather — Hunting and warrior rites' },
        { name: 'Panquetzaliztli', dates: 'Nov 9 - Nov 28', desc: 'Raising of Banners — Triumph of Huitzilopochtli' },
        { name: 'Atemoztli', dates: 'Nov 29 - Dec 18', desc: 'Descent of Waters — Blessing of lakes and rivers' },
        { name: 'Tititl', dates: 'Dec 19 - Jan 7', desc: 'Stretching — Prayers for healthy crops' },
        { name: 'Izcalli', dates: 'Jan 8 - Jan 27', desc: 'Resurrection — Fire rituals and rebirth' }
    ];

    const ASTRO_EVENTS = [
        { date: 'March 20', name: 'Spring Equinox — Tonalcuauhco', desc: 'The sun rises exactly east. Kukulcan descends at Chichen Itza. Balance of light and dark.' },
        { date: 'April 30', name: 'Zenith Sun — South', desc: 'The sun stands directly overhead. Shadows vanish. Portent of the summer rains.' },
        { date: 'June 21', name: 'Summer Solstice — Tonatiuh', desc: 'Longest day. The sun warrior reaches his peak. Ceremonies to sustain his strength.' },
        { date: 'August 12', name: 'Mayan New Year', desc: 'Creation cycle begins anew. The cosmic hearth is lit. Three stones of creation.' },
        { date: 'September 22', name: 'Autumn Equinox — West', desc: 'Sun sets exactly west. Harvest balance. The descent into the underworld begins.' },
        { date: 'October 26', name: 'Zenith Sun — North Return', desc: 'The sun completes its southern journey and turns north. Agricultural renewal.' },
        { date: 'December 21', name: 'Winter Solstice — Darkness', desc: 'Longest night. The birth of the sun. Fires are lit to guide the solar deity.' },
        { date: 'February 24', name: 'Pleiades Zenith', desc: 'The Tzab stars align overhead. The New Fire ceremony may be kindled.' }
    ];

    const CONSTELLATIONS = [
        { name: 'Citlalcolotl', icon: '🦂', meaning: 'Scorpion Star — Scorpius' },
        { name: 'Citlamamalloztli', icon: '🔨', meaning: 'Fishtail — Southern Cross' },
        { name: 'Tianquiztli', icon: '✨', meaning: 'Marketplace — Pleiades' },
        { name: 'Colotlichane', icon: '🐜', meaning: 'Scorpion Dweller — Antares region' },
        { name: 'Xonecuilli', icon: '🌀', meaning: 'Curved One — Ursa Major' },
        { name: 'Mamaloaztli', icon: '🐟', meaning: 'Fishing Net — Corona Borealis' },
        { name: 'Teporcatl', icon: '🏔', meaning: 'The Drunkard — Orion' },
        { name: 'Pipiltzintli', icon: '👑', meaning: 'Little Prince — Sirius' }
    ];

    const DEITIES = [
        { name: 'Huitzilopochtli', glyph: '🦅', domain: 'War & Sun', desc: 'The Hummingbird of the South. Patron of Tenochtitlan. Guided the Mexica to their promised land.' },
        { name: 'Quetzalcoatl', glyph: '🐉', domain: 'Wind & Wisdom', desc: 'The Feathered Serpent. God of knowledge, priesthood, and morning star. Creator of humanity.' },
        { name: 'Tezcatlipoca', glyph: '🌑', domain: 'Night & Sorcery', desc: 'Smoking Mirror. The invisible one. God of destiny, night, and temptation.' },
        { name: 'Tlaloc', glyph: '🌧', domain: 'Rain & Thunder', desc: 'He Who Makes Things Sprout. Lord of water, fertility, and lightning. Dwells on mountain peaks.' },
        { name: 'Chalchiuhtlicue', glyph: '🌊', domain: 'Rivers & Oceans', desc: 'She of the Jade Skirt. Goddess of fresh waters, lakes, rivers, and baptism.' },
        { name: 'Xipe Totec', glyph: '🌽', domain: 'Agriculture & Renewal', desc: 'Our Lord the Flayed One. God of spring, vegetation, and the cycle of rebirth.' },
        { name: 'Coatlicue', glyph: '🐍', domain: 'Earth & Motherhood', desc: 'Serpent Skirt. Mother of gods and stars. The devouring and nurturing earth.' },
        { name: 'Mictlantecuhtli', glyph: '💀', domain: 'Death & Underworld', desc: 'Lord of Mictlan. Ruler of the nine levels of the underworld. Guardian of bones.' },
        { name: 'Tonatiuh', glyph: '☀', domain: 'Sun & Time', desc: 'He Who Goes Forth Shining. The fifth sun. Requires nourishment to continue his journey.' },
        { name: 'Coyolxauhqui', glyph: '🌕', domain: 'Moon & Stars', desc: 'Painted with Bells. The moon goddess, sister of Huitzilopochtli, dismembered at Coatepec.' }
    ];

    const DEITY_HOURS = [
        { time: '1 AM', lord: 'Cipactonal' },
        { time: '2 AM', lord: 'Tzontemoc' },
        { time: '3 AM', lord: 'Mictlantecuhtli' },
        { time: '4 AM', lord: 'Tlahuizcalpantecuhtli' },
        { time: '5 AM', lord: 'Xiuhtecuhtli' },
        { time: '6 AM', lord: 'Tonatiuh' },
        { time: '7 AM', lord: 'Tlahuizcalpantecuhtli' },
        { time: '8 AM', lord: 'Quetzalcoatl' },
        { time: '9 AM', lord: 'Cinteotl' },
        { time: '10 AM', lord: 'Mictlantecuhtli' },
        { time: '11 AM', lord: 'Tlaloc' },
        { time: '12 PM', lord: 'Xochipilli' },
        { time: '1 PM', lord: 'Chalchiuhtlicue' },
        { time: '2 PM', lord: 'Tlazolteotl' },
        { time: '3 PM', lord: 'Tezcatlipoca' },
        { time: '4 PM', lord: 'Xochiquetzal' },
        { time: '5 PM', lord: 'Piltzintecuhtli' },
        { time: '6 PM', lord: 'Tlazolteotl' },
        { time: '7 PM', lord: 'Xiuhtecuhtli' },
        { time: '8 PM', lord: 'Mictlantecuhtli' },
        { time: '9 PM', lord: 'Tlahuizcalpantecuhtli' },
        { time: '10 PM', lord: 'Citlalicue' },
        { time: '11 PM', lord: 'Coyolxauhqui' },
        { time: '12 AM', lord: 'Tezcatlipoca' }
    ];

    const TRIBUTE_SCHEDULE = [
        { icon: '🌽', name: 'Maize Tribute', detail: '200 cargas of maize from each province', date: 'Every 20 days' },
        { icon: '🟢', name: 'Jade & Turquoise', detail: 'Polished stones, beads, and mosaics', date: 'Quarterly' },
        { icon: '🪶', name: 'Quetzal Feathers', detail: 'Precious green tail feathers for headdresses', date: 'Bi-annually' },
        { icon: '🍫', name: 'Cacao Beans', detail: 'Used as currency and sacred drink', date: 'Monthly' },
        { icon: '🧶', name: 'Cotton Textiles', detail: 'Finely woven mantas and tunics', date: 'Quarterly' },
        { icon: '🐝', name: 'Honey & Wax', detail: 'From the coastal provinces', date: 'Bi-annually' },
        { icon: '🦜', name: 'Exotic Birds', detail: 'Parrots, macaws, and eagles for temples', date: 'Annually' },
        { icon: '⚱️', name: 'Copal Incense', detail: 'Resin for temple ceremonies', date: 'Monthly' }
    ];

    const OFFERINGS = [
        { icon: '🩸', name: 'Blood Letting', desc: 'Auto-sacrifice with maguey spines' },
        { icon: '🌸', name: 'Flowers', desc: 'Fresh blooms for the gods altars' },
        { icon: '🔥', name: 'Copal Smoke', desc: 'Sacred resin burned in censers' },
        { icon: '🦋', name: 'Butterflies', desc: 'Symbols of fallen warriors souls' },
        { icon: '🌽', name: 'Maize Dough', desc: 'Figurines shaped as deities' },
        { icon: '🎵', name: 'Music & Dance', desc: 'Drums, flutes, and ceremonial chants' },
        { icon: '💎', name: 'Jade Beads', desc: 'Precious stones placed in temple caches' },
        { icon: '🐆', name: 'Jaguar Skins', desc: 'Offered to earth and war deities' }
    ];

    // ==========================================
    // DOM REFERENCES
    // ==========================================
    const DOM = {
        loadingScreen: document.getElementById('loading-screen'),
        bgCanvas: document.getElementById('bg-canvas'),
        navButtons: document.querySelectorAll('.nav-glyph'),
        panels: document.querySelectorAll('.content-panel'),
        wheelContainer: document.getElementById('wheel-container'),
        wheelOuter: document.getElementById('wheel-outer'),
        wheelMiddle: document.getElementById('wheel-middle'),
        wheelSegments: document.querySelectorAll('.wheel-segment'),
        wheelCenter: document.getElementById('wheel-center'),
        btnRotate: document.getElementById('btn-rotate'),
        btnToday: document.getElementById('btn-today'),
        tzolNumber: document.getElementById('tzol-number'),
        tzolSign: document.getElementById('tzol-sign'),
        dateModern: document.getElementById('date-modern'),
        dateSacred: document.getElementById('date-sacred'),
        timerDays: document.getElementById('timer-days'),
        timerHours: document.getElementById('timer-hours'),
        timerMinutes: document.getElementById('timer-minutes'),
        timerSeconds: document.getElementById('timer-seconds'),
        tooltip: document.getElementById('glyph-tooltip'),
        tooltipGlyph: document.getElementById('tooltip-glyph'),
        tooltipText: document.getElementById('tooltip-text'),
        tooltipMeaning: document.getElementById('tooltip-meaning'),
        tonalGrid: document.getElementById('tonal-grid'),
        tonalLegend: document.getElementById('tonal-legend'),
        monthGrid: document.getElementById('month-grid'),
        astroTimeline: document.getElementById('astro-timeline'),
        constellationGrid: document.getElementById('constellation-grid'),
        deityCarousel: document.getElementById('deity-carousel'),
        hoursGrid: document.getElementById('hours-grid'),
        tributeSchedule: document.getElementById('tribute-schedule'),
        offeringGrid: document.getElementById('offering-grid'),
        serpentSegments: document.querySelectorAll('.serpent-segment')
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        populateTonalpohualli();
        populateXiuhpohualli();
        populateAstronomical();
        populateDeities();
        populateTribute();
        populateCanvasBackground();
        positionWheelSegments();
        calculateCurrentTonalpohualli();
        startEclipseTimer();
        initNavigation();
        initTooltips();
        initWheelControls();
        initSerpentBorder();
        
        // Hide loading screen
        setTimeout(() => {
            DOM.loadingScreen.classList.add('hidden');
        }, 1500);
    }

    // ==========================================
    // PANEL POPULATION
    // ==========================================
    function populateTonalpohualli() {
        DOM.tonalGrid.innerHTML = DAY_SIGNS.map((sign, i) => `
            <div class="tonal-card" data-tooltip="${sign.name}" data-tooltip-meaning="${sign.meaning} — ${sign.domain}">
                <span class="tonal-glyph">${sign.glyph}</span>
                <span class="tonal-name">${sign.name}</span>
                <span class="tonal-meaning">${sign.meaning}</span>
            </div>
        `).join('');
    }

    function populateXiuhpohualli() {
        DOM.monthGrid.innerHTML = MONTHS.map((month, i) => `
            <div class="month-card">
                <span class="month-number">${i + 1}</span>
                <h3 class="month-name">${month.name}</h3>
                <p class="month-dates">${month.dates}</p>
                <p class="month-desc">${month.desc}</p>
            </div>
        `).join('');
    }

    function populateAstronomical() {
        DOM.astroTimeline.innerHTML = ASTRO_EVENTS.map(evt => `
            <div class="timeline-event">
                <p class="event-date">${evt.date}</p>
                <h3 class="event-name">${evt.name}</h3>
                <p class="event-desc">${evt.desc}</p>
            </div>
        `).join('');

        DOM.constellationGrid.innerHTML = CONSTELLATIONS.map(c => `
            <div class="constellation-card">
                <span class="constellation-icon">${c.icon}</span>
                <h4 class="constellation-name">${c.name}</h4>
                <p class="constellation-meaning">${c.meaning}</p>
            </div>
        `).join('');
    }

    function populateDeities() {
        DOM.deityCarousel.innerHTML = DEITIES.map(d => `
            <div class="deity-card">
                <div class="deity-glyph">${d.glyph}</div>
                <h3 class="deity-name">${d.name}</h3>
                <p class="deity-domain">${d.domain}</p>
                <p class="deity-desc">${d.desc}</p>
            </div>
        `).join('');

        DOM.hoursGrid.innerHTML = DEITY_HOURS.map(h => `
            <div class="hour-card">
                <p class="hour-time">${h.time}</p>
                <p class="hour-lord">Lord: ${h.lord}</p>
            </div>
        `).join('');
    }

    function populateTribute() {
        DOM.tributeSchedule.innerHTML = TRIBUTE_SCHEDULE.map(t => `
            <div class="tribute-entry">
                <span class="tribute-icon">${t.icon}</span>
                <div class="tribute-info">
                    <h4 class="tribute-name">${t.name}</h4>
                    <p class="tribute-detail">${t.detail}</p>
                </div>
                <span class="tribute-date">${t.date}</span>
            </div>
        `).join('');

        DOM.offeringGrid.innerHTML = OFFERINGS.map(o => `
            <div class="offering-card">
                <span class="offering-icon">${o.icon}</span>
                <h4 class="offering-name">${o.name}</h4>
                <p class="offering-desc">${o.desc}</p>
            </div>
        `).join('');
    }

    // ==========================================
    // CALENDAR WHEEL LOGIC
    // ==========================================
    function positionWheelSegments() {
        const outerRadius = 170;
        const middleRadius = 110;
        
        // Position outer ring (20 signs)
        DOM.wheelSegments.forEach((seg, i) => {
            const angle = (i * 18) - 90; // 360/20 = 18 deg
            const rad = angle * (Math.PI / 180);
            const x = outerRadius * Math.cos(rad);
            const y = outerRadius * Math.sin(rad);
            seg.style.left = `calc(50% + ${x}px - 15px)`;
            seg.style.top = `calc(50% + ${y}px - 15px)`;
            seg.style.transform = `rotate(${angle + 90}deg)`;
        });

        // Position middle ring (13 numbers)
        const middleSegs = DOM.wheelMiddle.querySelectorAll('.trecena-segment');
        middleSegs.forEach((seg, i) => {
            const angle = (i * 27.69) - 90; // 360/13 ≈ 27.69
            const rad = angle * (Math.PI / 180);
            const x = middleRadius * Math.cos(rad);
            const y = middleRadius * Math.sin(rad);
            seg.style.left = `calc(50% + ${x}px - 12px)`;
            seg.style.top = `calc(50% + ${y}px - 12px)`;
        });
    }

    function calculateCurrentTonalpohualli() {
        const anchor = new Date(2000, 0, 1).getTime();
        const now = new Date().getTime();
        const daysSinceAnchor = Math.floor((now - anchor) / 86400000);
        
        const number = ((daysSinceAnchor + 6) % 13) + 1;
        const signIndex = daysSinceAnchor % 20;
        const sign = DAY_SIGNS[signIndex];
        
        DOM.tzolNumber.textContent = number;
        DOM.tzolSign.textContent = sign.name;
        DOM.dateModern.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        DOM.dateSacred.textContent = `${number} ${sign.name} — ${sign.meaning}`;
        
        // Highlight corresponding segment
        DOM.wheelSegments.forEach((seg, i) => {
            seg.style.borderColor = i === signIndex ? 'var(--jade-bright)' : 'transparent';
            seg.style.boxShadow = i === signIndex ? '0 0 8px var(--jade-glow)' : 'none';
        });
    }

    function initWheelControls() {
        DOM.btnRotate.addEventListener('click', () => {
            DOM.wheelContainer.classList.toggle('rotating');
            DOM.btnRotate.querySelector('.btn-icon').textContent = DOM.wheelContainer.classList.contains('rotating') ? '⏸' : '⟳';
        });

        DOM.btnToday.addEventListener('click', () => {
            calculateCurrentTonalpohualli();
            DOM.wheelContainer.classList.remove('rotating');
            DOM.btnRotate.querySelector('.btn-icon').textContent = '⟳';
        });

        DOM.wheelSegments.forEach((seg, i) => {
            seg.addEventListener('click', () => {
                DOM.tzolNumber.textContent = Math.floor(Math.random() * 13) + 1;
                DOM.tzolSign.textContent = DAY_SIGNS[i].name;
                DOM.dateSacred.textContent = `Chosen: ${DAY_SIGNS[i].name}`;
            });
        });
    }

    // ==========================================
    // NAVIGATION & PANELS
    // ==========================================
    function initNavigation() {
        DOM.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                
                DOM.navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                DOM.panels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.style.animation = 'none';
                    if (panel.id === `panel-${section}`) {
                        panel.classList.add('active');
                        // Trigger reflow for animation restart
                        void panel.offsetWidth;
                        panel.style.animation = 'fade-in-up 0.5s ease-out forwards';
                    }
                });
            });
        });
    }

    // ==========================================
    // TOOLTIP SYSTEM
    // ==========================================
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip], .tonal-card, .nav-glyph');
        
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => showTooltip(e, el));
            el.addEventListener('mousemove', (e) => moveTooltip(e));
            el.addEventListener('mouseleave', hideTooltip);
        });

        function showTooltip(e, el) {
            const text = el.dataset.tooltip || el.querySelector('.segment-name')?.textContent || '';
            const meaning = el.dataset.tooltipMeaning || el.dataset.meaning || '';
            const glyph = el.querySelector('.segment-glyph, .nav-glyph-icon, .tonal-glyph')?.textContent || '';
            
            DOM.tooltipGlyph.textContent = glyph || '☽';
            DOM.tooltipText.textContent = text;
            DOM.tooltipMeaning.textContent = meaning;
            DOM.tooltip.classList.add('visible');
            moveTooltip(e);
        }

        function moveTooltip(e) {
            const x = e.clientX + 15;
            const y = e.clientY + 15;
            
            // Boundary checks
            const maxX = window.innerWidth - 270;
            const maxY = window.innerHeight - 120;
            
            DOM.tooltip.style.left = `${Math.min(x, maxX)}px`;
            DOM.tooltip.style.top = `${Math.min(y, maxY)}px`;
        }

        function hideTooltip() {
            DOM.tooltip.classList.remove('visible');
        }
    }

    // ==========================================
    // ECLIPSE TIMER
    // ==========================================
    function startEclipseTimer() {
        // Next total solar eclipse visible from Mesoamerica (approximate future date)
        const eclipseDate = new Date('2026-08-12T18:00:00').getTime();
        
        function updateTimer() {
            const now = new Date().getTime();
            const distance = eclipseDate - now;
            
            if (distance < 0) {
                DOM.timerDays.textContent = '000';
                DOM.timerHours.textContent = '00';
                DOM.timerMinutes.textContent = '00';
                DOM.timerSeconds.textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / 86400000);
            const hours = Math.floor((distance % 86400000) / 3600000);
            const minutes = Math.floor((distance % 3600000) / 60000);
            const seconds = Math.floor((distance % 60000) / 1000);
            
            DOM.timerDays.textContent = String(days).padStart(3, '0');
            DOM.timerHours.textContent = String(hours).padStart(2, '0');
            DOM.timerMinutes.textContent = String(minutes).padStart(2, '0');
            DOM.timerSeconds.textContent = String(seconds).padStart(2, '0');
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ==========================================
    // SACRED GEOMETRY BACKGROUND
    // ==========================================
    function populateCanvasBackground() {
        const canvas = DOM.bgCanvas;
        const ctx = canvas.getContext('2d');
        let width, height;
        let angle = 0;
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        resize();
        window.addEventListener('resize', resize);
        
        function drawGeometry() {
            ctx.clearRect(0, 0, width, height);
            
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.min(width, height) * 0.4;
            
            // Draw concentric rotating circles
            ctx.strokeStyle = 'rgba(0, 128, 80, 0.08)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < 8; i++) {
                const radius = maxRadius * (0.15 + i * 0.1);
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw rotating cross lines
            ctx.strokeStyle = 'rgba(139, 101, 8, 0.06)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 12; i++) {
                const a = angle + (i * Math.PI / 6);
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + maxRadius * Math.cos(a), centerY + maxRadius * Math.sin(a));
                ctx.stroke();
            }
            
            // Draw diamond patterns
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
            for (let i = 0; i < 4; i++) {
                const a = angle * 0.5 + (i * Math.PI / 2);
                const r = maxRadius * 0.7;
                ctx.beginPath();
                ctx.moveTo(centerX + r * Math.cos(a), centerY + r * Math.sin(a));
                ctx.lineTo(centerX + r * Math.cos(a + Math.PI/4), centerY + r * Math.sin(a + Math.PI/4));
                ctx.lineTo(centerX + r * Math.cos(a + Math.PI/2), centerY + r * Math.sin(a + Math.PI/2));
                ctx.lineTo(centerX + r * Math.cos(a + 3*Math.PI/4), centerY + r * Math.sin(a + 3*Math.PI/4));
                ctx.closePath();
                ctx.stroke();
            }
            
            angle += 0.001;
            requestAnimationFrame(drawGeometry);
        }
        
        drawGeometry();
    }

    // ==========================================
    // SERPENT BORDER ANIMATION
    // ==========================================
    function initSerpentBorder() {
        DOM.serpentSegments.forEach((seg, i) => {
            seg.style.animationDelay = `${i * 0.15}s`;
        });
    }

    // ==========================================
    // START
    // ==========================================
    document.addEventListener('DOMContentLoaded', init);
})();