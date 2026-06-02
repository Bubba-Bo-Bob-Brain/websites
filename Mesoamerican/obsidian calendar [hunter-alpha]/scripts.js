/* ============================================
   TZOLK'IN - Sacred Ceremonial Calendar
   Interactive JavaScript
   ============================================ */

// ==================== DATA ====================

const GLYPHS = [
    { name: 'Imix', meaning: 'Crocodile / Water Lily', symbol: 'IM', direction: 'East', element: 'Water', deity: 'Itzamna', desc: 'The primal waters of creation. A day of new beginnings and nurturing energy.' },
    { name: 'Ik', meaning: 'Wind / Breath', symbol: 'IK', direction: 'North', element: 'Air', deity: 'Kukulkan', desc: 'The breath of life, divine communication. A day for prayer and spiritual messages.' },
    { name: 'Akbal', meaning: 'Night / Darkness', symbol: 'AK', direction: 'West', element: 'Earth', deity: 'Kinich Ahau', desc: 'The darkness before dawn. A time for inner vision and confronting fears.' },
    { name: 'Kan', meaning: 'Lizard / Seed', symbol: 'KN', direction: 'South', element: 'Fire', deity: 'Kukulkan', desc: 'The seed of potential. A day of sexual energy and generative power.' },
    { name: 'Chicchan', meaning: 'Serpent', symbol: 'CH', direction: 'East', element: 'Water', deity: 'Kukulkan', desc: 'The sacred serpent energy. A day of vitality and life force.' },
    { name: 'Cimi', meaning: 'Death / Transformation', symbol: 'CM', direction: 'North', element: 'Air', deity: 'Ah Puch', desc: 'Death and rebirth. A day for releasing the old and embracing change.' },
    { name: 'Manik', meaning: 'Deer', symbol: 'MN', direction: 'West', element: 'Earth', deity: 'Ix Chel', desc: 'The deer spirit of gentleness. A day for healing and hunting.' },
    { name: 'Lamat', meaning: 'Rabbit / Star', symbol: 'LM', direction: 'South', element: 'Fire', deity: 'Ix Chel', desc: 'The star of abundance. A day of fertility and celebration.' },
    { name: 'Muluk', meaning: 'Water', symbol: 'ML', direction: 'East', element: 'Water', deity: 'Chaak', desc: 'Sacred water and jade. A day of offerings and devotion.' },
    { name: 'Oc', meaning: 'Dog', symbol: 'OC', direction: 'North', element: 'Air', deity: 'Xibalba Lords', desc: 'The faithful guide. A day for loyalty and finding one\'s path.' },
    { name: 'Chuen', meaning: 'Monkey / Artisan', symbol: 'CU', direction: 'West', element: 'Earth', deity: 'Itzamna', desc: 'The divine artist and weaver. A day of creativity and play.' },
    { name: 'Eb', meaning: 'Grass / Road', symbol: 'EB', direction: 'South', element: 'Fire', deity: 'Kukulkan', desc: 'The road of life. A day for journeys and blessings.' },
    { name: 'Ben', meaning: 'Reed / Corn', symbol: 'BN', direction: 'East', element: 'Water', deity: 'Itzamna', desc: 'The staff of authority. A day for leadership and new projects.' },
    { name: 'Ix', meaning: 'Jaguar / Earth', symbol: 'IX', direction: 'North', element: 'Air', deity: 'Ix Chel', desc: 'The earth mother and jaguar magic. A day of feminine power.' },
    { name: 'Men', meaning: 'Eagle', symbol: 'ME', direction: 'West', element: 'Earth', deity: 'Kinich Ahau', desc: 'The eagle of vision. A day for freedom and seeing the bigger picture.' },
    { name: 'Cib', meaning: 'Owl / Wisdom', symbol: 'CI', direction: 'South', element: 'Fire', deity: 'Ah Puch', desc: 'The owl of wisdom and ancestors. A day for forgiveness and inner peace.' },
    { name: 'Caban', meaning: 'Earth / Movement', symbol: 'CA', direction: 'East', element: 'Water', deity: 'Itzamna', desc: 'The moving earth. A day of natural forces and mental evolution.' },
    { name: 'Etznab', meaning: 'Flint / Mirror', symbol: 'EZ', direction: 'North', element: 'Air', deity: 'Kukulkan', desc: 'The obsidian mirror of truth. A day for facing reality and making choices.' },
    { name: 'Cauac', meaning: 'Storm / Rain', symbol: 'CW', direction: 'West', element: 'Earth', deity: 'Chaak', desc: 'The cleansing storm. A day of purification and transformation.' },
    { name: 'Ahau', meaning: 'Sun / Lord', symbol: 'AH', direction: 'South', element: 'Fire', deity: 'Kinich Ahau', desc: 'The sun lord and enlightenment. The most sacred day of wisdom.' }
];

const LORDS = [
    { number: 'I', name: 'Xiuhtecuhtli', role: 'God of Fire and Time' },
    { number: 'II', name: 'Itztli', role: 'God of Obsidian Knives' },
    { number: 'III', name: 'Piltzintecuhtli', role: 'God of Youth and Sun' },
    { number: 'IV', name: 'Centteotl', role: 'God of Maize' },
    { number: 'V', name: 'Mictlantecuhtli', role: 'Lord of the Dead' },
    { number: 'VI', name: 'Chalchiuhtlicue', role: 'Goddess of Water' },
    { number: 'VII', name: 'Tlazolteotl', role: 'Goddess of Purification' },
    { number: 'VIII', name: 'Tepeyollotl', role: 'God of Jaguars' },
    { number: 'IX', name: 'Tlaloc', role: 'God of Rain and Lightning' }
];

const RITUALS = [
    {
        name: 'New Fire Ceremony',
        date: 'Every 52 years',
        desc: 'All fires are extinguished. A new fire is drilled on the chest of a sacrificial victim atop the Pyramid of the Sun.',
        offerings: ['Jade', 'Copal incense', 'Quetzal feathers', 'Human sacrifice']
    },
    {
        name: 'Panquetzaliztli',
        date: 'Month of Huitzilopochtli',
        desc: 'The great festival honoring the sun god. Warriors dance with painted bodies and eagle costumes.',
        offerings: ['War captives', 'Amaranth dough', 'Pulque', 'Paper banners']
    },
    {
        name: 'Ochpaniztli',
        date: 'Month of Sweeping',
        desc: 'Harvest festival honoring Tlazolteotl. Temples are ritually cleaned and swept.',
        offerings: ['First fruits', 'Flowers', 'Copal', 'Sweeping implements']
    },
    {
        name: 'Toxcatl',
        date: 'Month of Dryness',
        desc: 'A young man who lived as the embodiment of Tezcatlipoca for one year is sacrificed.',
        offerings: ['Amber', 'Tobacco', 'Turquoise', 'Cacao']
    },
    {
        name: 'Huey Tecuilhuitl',
        date: 'Great Festival of Lords',
        desc: 'Feast honoring Xilonen, goddess of young maize. Grand feasts for the common people.',
        offerings: ['Young corn', 'Tamales', 'Ribbon decorations', 'Dancing']
    },
    {
        name: 'Etzalcualiztli',
        date: 'Eating Etzalli',
        desc: 'Rain ceremony where priests bathe in sacred pools and eat maize porridge.',
        offerings: ['Maize porridge', 'Squash', 'Water offerings', 'Featherwork']
    }
];

const CELESTIAL_EVENTS = [
    { date: 'Mar 20', name: 'Spring Equinox - Serpent of Light descends at Chichen Itza' },
    { date: 'Apr 30', name: 'Venus as Evening Star - War season begins' },
    { date: 'Jun 21', name: 'Summer Solstice - Kinich Ahau at peak power' },
    { date: 'Aug 13', name: 'Zenith Passage - Sacred center day' },
    { date: 'Sep 22', name: 'Autumn Equinox - Balance of light and dark' },
    { date: 'Nov 1', name: 'Venus as Morning Star - Propitious for sowing' },
    { date: 'Dec 21', name: 'Winter Solstice - Sun Lord reborn' }
];

// ==================== Tzolkin Calendar Logic ====================

const TZOLKIN_START = new Date(2012, 11, 21); // Dec 21, 2012 - End of Long Count

function getTzolkinDay(date) {
    const diff = Math.floor((date - TZOLKIN_START) / (1000 * 60 * 60 * 24));
    const dayNumber = ((diff % 13) + 13) % 13 + 1;
    const glyphIndex = ((diff % 20) + 20) % 20;
    const totalDays = ((diff % 260) + 260) % 260;
    return { dayNumber, glyphIndex, glyph: GLYPHS[glyphIndex], totalDays };
}

function getLordOfNight(dayIndex) {
    return LORDS[((dayIndex % 9) + 9) % 9];
}

function getTrecenaInfo(dayIndex) {
    const trecenaDay = ((dayIndex % 13) + 13) % 13 + 1;
    const trecenaStart = Math.floor(dayIndex / 13);
    return { day: trecenaDay, progress: (trecenaDay / 13) * 100 };
}

// ==================== State ====================

let currentDate = new Date();
let viewDate = new Date();
let tooltipElement = null;

// ==================== Initialization ====================

document.addEventListener('DOMContentLoaded', () => {
    initSmokeParticles();
    buildCalendarWheel();
    updateDisplay();
    initTooltip();
    initSearch();
    buildRitualGrid();
    buildGlyphGrid();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    document.getElementById('prevDay').addEventListener('click', () => navigateDay(-1));
    document.getElementById('nextDay').addEventListener('click', () => navigateDay(1));
    document.getElementById('todayBtn').addEventListener('click', returnToToday);
});

// ==================== Smoke Particles ====================

function initSmokeParticles() {
    const container = document.getElementById('smokeContainer');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'smoke-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        container.appendChild(particle);
    }
}

// ==================== Calendar Wheel ====================

function buildCalendarWheel() {
    const wheel = document.getElementById('calendarWheel');
    wheel.innerHTML = '';
    
    const centerX = 50;
    const centerY = 50;
    const radius = 38;
    
    for (let i = 0; i < 20; i++) {
        const angle = (i * 18 - 90) * (Math.PI / 180);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const slot = document.createElement('div');
        slot.className = 'glyph-slot';
        slot.style.left = `calc(${x}% - 25px)`;
        slot.style.top = `calc(${y}% - 25px)`;
        slot.dataset.index = i;
        
        slot.innerHTML = `
            <div class="glyph-symbol">${GLYPHS[i].symbol}</div>
            <div class="glyph-number">${i + 1}</div>
        `;
        
        slot.addEventListener('click', () => selectGlyph(i));
        slot.addEventListener('mouseenter', (e) => showTooltip(e, GLYPHS[i]));
        slot.addEventListener('mouseleave', hideTooltip);
        
        wheel.appendChild(slot);
    }
}

function selectGlyph(index) {
    const tzolkin = getTzolkinDay(viewDate);
    const diff = index - tzolkin.glyphIndex;
    viewDate = new Date(viewDate.getTime() + diff * 24 * 60 * 60 * 1000);
    updateDisplay();
}

function updateWheelDisplay(tzolkin) {
    const slots = document.querySelectorAll('.glyph-slot');
    slots.forEach((slot, i) => {
        slot.classList.toggle('active', i === tzolkin.glyphIndex);
    });
    
    document.getElementById('centerGlyphName').textContent = tzolkin.glyph.name.toUpperCase();
    document.getElementById('centerGlyphMeaning').textContent = tzolkin.glyph.meaning;
    document.getElementById('centerDayNum').textContent = tzolkin.dayNumber;
}

// ==================== Display Updates ====================

function updateDisplay() {
    const tzolkin = getTzolkinDay(viewDate);
    const lord = getLordOfNight(tzolkin.totalDays);
    const trecena = getTrecenaInfo(tzolkin.totalDays);
    
    updateWheelDisplay(tzolkin);
    updateLordDisplay(lord, tzolkin.totalDays);
    updateTrecenaDisplay(trecena);
    updateDateDisplay(tzolkin);
    updateEventsList();
    updateVenusPhase();
    updateLongCount();
}

function updateLordDisplay(lord, dayIndex) {
    document.getElementById('lordNumber').textContent = lord.number;
    document.getElementById('lordName').textContent = lord.name;
    document.getElementById('lordRole').textContent = lord.role;
    
    const dots = document.querySelectorAll('.lord-dot');
    const activeLord = ((dayIndex % 9) + 9) % 9;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeLord);
    });
}

function updateTrecenaDisplay(trecena) {
    const tzolkin = getTzolkinDay(viewDate);
    document.getElementById('trecenaDay').textContent = `Day ${trecena.day}`;
    document.getElementById('trecenaProgress').style.width = `${trecena.progress}%`;
    
    const trecenaStart = Math.floor(tzolkin.totalDays / 13) * 13;
    const startGlyph = GLYPHS[((trecenaStart % 20) + 20) % 20];
    document.getElementById('trecenaLord').textContent = startGlyph.name;
}

function updateDateDisplay(tzolkin) {
    const nextGlyph = GLYPHS[((tzolkin.glyphIndex + 1) % 20)];
    const prevGlyph = GLYPHS[((tzolkin.glyphIndex - 1 + 20) % 20)];
    
    document.getElementById('currentTzolkinDate').textContent = 
        `${tzolkin.dayNumber} ${tzolkin.glyph.name} / ${((tzolkin.dayNumber % 13) + 1)} ${nextGlyph.name} / ${((tzolkin.dayNumber % 13) + 7)} ${GLYPHS[(tzolkin.glyphIndex + 7) % 20].name}`;
}

function updateEventsList() {
    const container = document.getElementById('eventsList');
    container.innerHTML = '';
    
    CELESTIAL_EVENTS.slice(0, 5).forEach(event => {
        const item = document.createElement('div');
        item.className = 'event-item';
        item.innerHTML = `
            <span class="event-date">${event.date}</span>
            <span class="event-name">${event.name}</span>
        `;
        container.appendChild(item);
    });
}

function updateVenusPhase() {
    const phases = [
        { name: 'Morning Star', detail: 'Rising before dawn - Propitious for warfare' },
        { name: 'Superior Conjunction', detail: 'Hidden behind the sun - Time of uncertainty' },
        { name: 'Evening Star', desc: 'Setting after dusk - Time for diplomacy' },
        { name: 'Inferior Conjunction', detail: 'Between Earth and Sun - Dangerous period' }
    ];
    
    const dayOfYear = Math.floor((viewDate - new Date(viewDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const phaseIndex = Math.floor((dayOfYear / 365) * 4) % 4;
    
    document.getElementById('venusPhase').textContent = phases[phaseIndex].name;
    document.getElementById('venusDetail').textContent = phases[phaseIndex].detail;
}

function updateLongCount() {
    const baseDate = new Date(2012, 11, 21);
    const diff = Math.floor((viewDate - baseDate) / (1000 * 60 * 60 * 24));
    
    const baktun = 13;
    const katun = Math.floor(diff / 7200) % 20;
    const tun = Math.floor(diff / 360) % 20;
    const winal = Math.floor(diff / 20) % 18;
    const kin = diff % 20;
    
    document.getElementById('longCount').textContent = `${baktun}.${katun}.${tun}.${winal}.${kin}`;
}

// ==================== Navigation ====================

function navigateDay(direction) {
    viewDate = new Date(viewDate.getTime() + direction * 24 * 60 * 60 * 1000);
    updateDisplay();
    
    // Animate wheel rotation
    const wheel = document.getElementById('calendarWheel');
    const currentRotation = parseFloat(wheel.dataset.rotation || 0);
    const newRotation = currentRotation + (direction * 18);
    wheel.dataset.rotation = newRotation;
    wheel.style.transform = `rotate(${newRotation}deg)`;
}

function returnToToday() {
    viewDate = new Date();
    updateDisplay();
    
    const wheel = document.getElementById('calendarWheel');
    wheel.style.transform = 'rotate(0deg)';
    wheel.dataset.rotation = 0;
}

// ==================== Tooltip ====================

function initTooltip() {
    tooltipElement = document.getElementById('glyphTooltip');
    
    // Add tooltips to lord dots
    document.querySelectorAll('.lord-dot').forEach(dot => {
        dot.addEventListener('mouseenter', (e) => {
            const lordIndex = parseInt(dot.dataset.lord) - 1;
            showLordTooltip(e, LORDS[lordIndex]);
        });
        dot.addEventListener('mouseleave', hideTooltip);
    });
    
    // Add tooltips to cardinal markers
    document.querySelectorAll('.cardinal-marker').forEach(marker => {
        marker.addEventListener('mouseenter', (e) => {
            const direction = marker.dataset.tooltip;
            showSimpleTooltip(e, direction);
        });
        marker.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e, glyph) {
    tooltipElement.querySelector('#tooltipGlyphIcon').textContent = glyph.symbol;
    tooltipElement.querySelector('#tooltipName').textContent = glyph.name;
    tooltipElement.querySelector('#tooltipMeaning').textContent = glyph.meaning;
    tooltipElement.querySelector('#tooltipDirection').textContent = glyph.direction;
    tooltipElement.querySelector('#tooltipElement').textContent = glyph.element;
    tooltipElement.querySelector('#tooltipDeity').textContent = glyph.deity;
    tooltipElement.querySelector('#tooltipDesc').textContent = glyph.desc;
    
    positionTooltip(e);
    tooltipElement.classList.add('visible');
}

function showLordTooltip(e, lord) {
    tooltipElement.querySelector('#tooltipGlyphIcon').textContent = lord.number;
    tooltipElement.querySelector('#tooltipName').textContent = lord.name;
    tooltipElement.querySelector('#tooltipMeaning').textContent = lord.role;
    tooltipElement.querySelector('#tooltipDirection').textContent = '-';
    tooltipElement.querySelector('#tooltipElement').textContent = 'Night / Underworld';
    tooltipElement.querySelector('#tooltipDeity').textContent = 'Bolontiku';
    tooltipElement.querySelector('#tooltipDesc').textContent = `The ${lord.number} of the Nine Lords of the Night, ruling the hours of darkness.`;
    
    positionTooltip(e);
    tooltipElement.classList.add('visible');
}

function showSimpleTooltip(e, text) {
    tooltipElement.querySelector('#tooltipGlyphIcon').textContent = '◆';
    tooltipElement.querySelector('#tooltipName').textContent = text;
    tooltipElement.querySelector('#tooltipMeaning').textContent = 'Cardinal Direction';
    tooltipElement.querySelector('#tooltipDirection').textContent = text.split(' - ')[1] || text;
    tooltipElement.querySelector('#tooltipElement').textContent = '-';
    tooltipElement.querySelector('#tooltipDeity').textContent = '-';
    tooltipElement.querySelector('#tooltipDesc').textContent = 'One of the four sacred cardinal directions of the Maya cosmos.';
    
    positionTooltip(e);
    tooltipElement.classList.add('visible');
}

function positionTooltip(e) {
    const x = e.clientX + 15;
    const y = e.clientY + 15;
    
    tooltipElement.style.left = x + 'px';
    tooltipElement.style.top = y + 'px';
    
    // Adjust if off screen
    const rect = tooltipElement.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        tooltipElement.style.left = (e.clientX - rect.width - 15) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
        tooltipElement.style.top = (e.clientY - rect.height - 15) + 'px';
    }
}

function hideTooltip() {
    tooltipElement.classList.remove('visible');
}

// ==================== Search ====================

function initSearch() {
    const searchInput = document.getElementById('glyphSearch');
    searchInput.addEventListener('input', (e) => {
        filterGlyphs(e.target.value);
    });
}

function filterGlyphs(query) {
    const cards = document.querySelectorAll('.glyph-card');
    const lowerQuery = query.toLowerCase();
    
    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const meaning = card.dataset.meaning.toLowerCase();
        const visible = name.includes(lowerQuery) || meaning.includes(lowerQuery);
        card.style.display = visible ? '' : 'none';
    });
}

// ==================== Grid Builders ====================

function buildRitualGrid() {
    const grid = document.getElementById('ritualGrid');
    grid.innerHTML = '';
    
    RITUALS.forEach(ritual => {
        const card = document.createElement('div');
        card.className = 'ritual-card';
        card.innerHTML = `
            <div class="ritual-header">
                <div class="ritual-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M12,2 L14,8 L20,8 L15,12 L17,19 L12,15 L7,19 L9,12 L4,8 L10,8 Z" fill="#c9a227"/>
                    </svg>
                </div>
                <div>
                    <div class="ritual-name">${ritual.name}</div>
                    <div class="ritual-date">${ritual.date}</div>
                </div>
            </div>
            <p class="ritual-desc">${ritual.desc}</p>
            <div class="ritual-offerings">
                ${ritual.offerings.map(o => `<span class="offering-tag">${o}</span>`).join('')}
            </div>
        `;
        grid.appendChild(card);
    });
}

function buildGlyphGrid() {
    const grid = document.getElementById('glyphGrid');
    grid.innerHTML = '';
    
    GLYPHS.forEach((glyph, i) => {
        const card = document.createElement('div');
        card.className = 'glyph-card';
        card.dataset.name = glyph.name;
        card.dataset.meaning = glyph.meaning;
        card.innerHTML = `
            <div class="glyph-card-number">${i + 1}</div>
            <div class="glyph-card-symbol">${glyph.symbol}</div>
            <div class="glyph-card-name">${glyph.name}</div>
            <div class="glyph-card-meaning">${glyph.meaning}</div>
        `;
        
        card.addEventListener('mouseenter', (e) => showTooltip(e, glyph));
        card.addEventListener('mouseleave', hideTooltip);
        card.addEventListener('click', () => {
            const tzolkin = getTzolkinDay(viewDate);
            const diff = i - tzolkin.glyphIndex;
            viewDate = new Date(viewDate.getTime() + diff * 24 * 60 * 60 * 1000);
            updateDisplay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        grid.appendChild(card);
    });
}

// ==================== Eclipse Countdown ====================

function updateCountdown() {
    const eclipseDate = new Date('2025-03-29T18:00:00Z');
    const now = new Date();
    const diff = eclipseDate - now;
    
    if (diff <= 0) {
        document.getElementById('countDays').textContent = '000';
        document.getElementById('countHours').textContent = '00';
        document.getElementById('countMinutes').textContent = '00';
        document.getElementById('countSeconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countDays').textContent = String(days).padStart(3, '0');
    document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
    
    // Update progress bar (assuming 365 day countdown)
    const totalDuration = 365 * 24 * 60 * 60 * 1000;
    const elapsed = totalDuration - diff;
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    document.getElementById('eclipseProgress').style.width = `${progress}%`;
}

// ==================== Keyboard Navigation ====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        navigateDay(-1);
    } else if (e.key === 'ArrowRight') {
        navigateDay(1);
    } else if (e.key === 'Home') {
        returnToToday();
    }
});

// ==================== Window Resize Handler ====================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any layout-dependent elements
        const tzolkin = getTzolkinDay(viewDate);
        updateWheelDisplay(tzolkin);
    }, 250);
});