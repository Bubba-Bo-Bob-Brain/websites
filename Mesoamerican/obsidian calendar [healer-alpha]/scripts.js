// ============================================
// SACRED OBSIDIAN CODEX — Ceremonial Calendar
// Tonalpohualli & Mesoamerican Timekeeping
// ============================================

// === SACRED DATA ===

// The 20 Day Signs (Tonalpohualli)
const DAY_SIGNS = [
    { name: 'Cipactli', glyph: '🐊', translation: 'Crocodile', meaning: 'Primordial earth, creation, fertility, beginnings' },
    { name: 'Ehecatl', glyph: '💨', translation: 'Wind', meaning: 'Breath of life, change, movement, the divine wind' },
    { name: 'Calli', glyph: '🏠', translation: 'House', meaning: 'Home, family, stability, foundation' },
    { name: 'Cuetzpalin', glyph: '🦎', translation: 'Lizard', meaning: 'Dexterity, dreams, the material world' },
    { name: 'Coatl', glyph: '🐍', translation: 'Serpent', meaning: 'Wisdom, rebirth, transformation, knowledge' },
    { name: 'Miquiztli', glyph: '💀', translation: 'Death', meaning: 'Transformation, endings, ancestral realm' },
    { name: 'Mazatl', glyph: '🦌', translation: 'Deer', meaning: 'Speed, gentleness, the hunt, alertness' },
    { name: 'Tochtli', glyph: '🐰', translation: 'Rabbit', meaning: 'Abundance, fertility, luck, multiplication' },
    { name: 'Atl', glyph: '💧', translation: 'Water', meaning: 'Life force, purification, flowing change' },
    { name: 'Itzcuintli', glyph: '🐕', translation: 'Dog', meaning: 'Loyalty, guidance, the journey to Mictlan' },
    { name: 'Ozomahtli', glyph: '🐒', translation: 'Monkey', meaning: 'Joy, art, celebration, playfulness' },
    { name: 'Malinalli', glyph: '🌿', translation: 'Grass', meaning: 'Growth, flexibility, resilience, healing' },
    { name: 'Acatl', glyph: '🎋', translation: 'Reed', meaning: 'Authority, direction, the axis mundi' },
    { name: 'Ocelotl', glyph: '🐆', translation: 'Jaguar', meaning: 'Power, night, the underworld, courage' },
    { name: 'Cuauhtli', glyph: '🦅', translation: 'Eagle', meaning: 'Vision, freedom, the sun, higher perspective' },
    { name: 'Cozcacuauhtli', glyph: '🦃', translation: 'Vulture', meaning: 'Purification, rebirth, far sight' },
    { name: 'Ollin', glyph: '☀️', translation: 'Movement', meaning: 'Change, evolution, the Fifth Sun, cosmic motion' },
    { name: 'Tecpatl', glyph: '🔪', translation: 'Flint', meaning: 'Sacrifice, truth, illumination, cutting clarity' },
    { name: 'Quiahuitl', glyph: '🌧️', translation: 'Rain', meaning: 'Divine gift, fertility, cleansing, Tlaloc' },
    { name: 'Xochitl', glyph: '🌸', translation: 'Flower', meaning: 'Beauty, art, the heart, completion' }
];

// Deity information for each trecena (13-day period)
const TRECENA_DEITIES = [
    { name: 'CIPACTLI', domain: 'Primordial Crocodile', symbol: '🐊', color: '#2a8b6a' },
    { name: 'EHECATL', domain: 'Lord of Wind', symbol: '💨', color: '#5a9e9e' },
    { name: 'MICTLANTECUHTLI', domain: 'Lord of the Underworld', symbol: '💀', color: '#8b1a1a' },
    { name: 'CHALCHIUHTLICUE', domain: 'Lady of Jade Skirt (Water)', symbol: '💧', color: '#1a5c8b' },
    { name: 'XOLOTL', domain: 'Twin of Venus, Guide of Souls', symbol: '🐕', color: '#8b6914' },
    { name: 'MIQUIZTLI', domain: 'Death Personified', symbol: '☠️', color: '#4a0d0d' },
    { name: 'MAZATL', domain: 'The Deer Spirit', symbol: '🦌', color: '#6b5a3a' },
    { name: 'TOCHTLI', domain: 'Rabbit of Abundance', symbol: '🐰', color: '#5a8b5a' },
    { name: 'CHALCHIUHTOTOLIN', domain: 'Jade Turkey, Sorcery', symbol: '🦃', color: '#4a6b4a' },
    { name: 'ITZTLI', domain: 'Obsidian Knife', symbol: '🔪', color: '#3a3a3a' },
    { name: 'OZOMAHTLI', domain: 'Monkey of the Arts', symbol: '🐒', color: '#8b5a2a' },
    { name: 'MALINALLI', domain: 'The Grass of Life', symbol: '🌿', color: '#2a6b2a' },
    { name: 'CHICHIWESTLI', domain: 'The Cradle, Venus as Evening Star', symbol: '⭐', color: '#8b8b1a' }
];

// Deities list for display
const DEITIES = [
    { name: 'TLALOC', domain: 'Lord of Rain & Fertility', symbol: '🌧️' },
    { name: 'QUIXALICUE', domain: 'She of the Jade Skirt', symbol: '💧' },
    { name: 'TEZCATLIPOCA', domain: 'Smoking Mirror, Fate', symbol: '🪞' },
    { name: 'QUETZALCOATL', domain: 'Feathered Serpent', symbol: '🐍' },
    { name: 'XIPETOTEC', domain: 'The Flayed One', symbol: '🎭' },
    { name: 'HUEHUETEOTL', domain: 'The Old God of Fire', symbol: '🔥' },
    { name: 'XIUHTECUHTLI', domain: 'Lord of Fire & Time', symbol: '☀️' },
    { name: 'COATLICUE', domain: 'She of the Serpent Skirt', symbol: '🐍' },
    { name: 'MICTLANTECUHTLI', domain: 'Lord of the Dead', symbol: '💀' },
    { name: 'CHALCHIUHTLICUE', domain: 'Lady of Water', symbol: '💧' },
    { name: 'TONATIUH', domain: 'The Sun', symbol: '☀️' },
    { name: 'XOLOTL', domain: 'Venus & Lightning', symbol: '⚡' },
    { name: 'CHICOMECOATL', domain: 'Lady of the Seven Serpents', symbol: '🌽' }
];

// Tribute items for calendar days
const TRIBUTE_ITEMS = [
    { name: 'Jade', icon: '💎', day: 1 },
    { name: 'Cacao', icon: '🍫', day: 5 },
    { name: 'Feathers', icon: '🪶', day: 8 },
    { name: 'Copal', icon: '🪔', day: 10 },
    { name: 'Blood', icon: '🩸', day: 13 },
    { name: 'Maize', icon: '🌽', day: 15 },
    { name: 'Obsidian', icon: '🖤', day: 18 },
    { name: 'Flowers', icon: '🌺', day: 20 }
];

// Sacred ceremonies
const CEREMONIES = [
    { name: 'Panquetzaliztli', desc: 'Festival of Quetzalcoatl', icon: '🐍', day: '1 Acatl' },
    { name: 'Toxcatl', desc: 'Dry Season Ritual', icon: '💧', day: '1 Tecpatl' },
    { name: 'Atlcahualo', desc: 'Water Consecration', icon: '🌧️', day: '1 Chalchiuhtlicue' },
    { name: 'Tlacaxipehualiztli', desc: 'Flaying of Men', icon: '🎭', day: '1 Xipe Totec' },
    { name: 'Huey Tecuilhuitl', desc: 'Great Feast of Lords', icon: '👑', day: '1 Xochitl' },
    { name: 'Ochpaniztli', desc: 'Sweeping Ritual', icon: '🧹', day: '1 Ollin' }
];

// Upcoming astronomical events
const ASTRONOMICAL_EVENTS = [
    { name: 'Solar Eclipse', type: 'celestial', daysUntil: 47 },
    { name: 'Venus Superior Conjunction', type: 'celestial', daysUntil: 89 },
    { name: 'Panquetzaliztli Festival', type: 'ceremony', daysUntil: 13 },
    { name: 'Lunar Eclipse', type: 'celestial', daysUntil: 124 },
    { name: 'Winter Solstice', type: 'celestial', daysUntil: 34 },
    { name: 'New Fire Ceremony', type: 'ceremony', daysUntil: 260 }
];

// === STATE ===
let currentDayInTonalpohualli = 1; // 1-260
let selectedDaySign = 0;
let selectedNumber = 1;
let isAudioPlaying = false;
let calendarRotation = 0;
let venusDay = 247; // Day in 584-day Venus cycle
let animationFrameId = null;

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initializeStarfield();
    initializeCalendarWheel();
    initializeDeityList();
    initializeTributeGrid();
    initializeRitualList();
    initializeEvents();
    initializeAudioToggle();
    initializeNavigation();
    initializeCalendarControls();
    
    // Set current date
    setCurrentDate();
    
    // Start countdown timer
    startCountdownTimer();
    
    // Start Venus animation
    animateVenus();
    
    // Hide loading screen after initialization
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2000);
});

// === STARFIELD ===
function initializeStarfield() {
    const starfield = document.getElementById('starfield');
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--twinkle-duration', `${3 + Math.random() * 4}s`);
        star.style.setProperty('--twinkle-delay', `${Math.random() * 5}s`);
        star.style.setProperty('--star-opacity', `${0.3 + Math.random() * 0.7}`);
        star.style.width = `${1 + Math.random() * 2}px`;
        star.style.height = star.style.width;
        starfield.appendChild(star);
    }
}

// === CALENDAR WHEEL ===
function initializeCalendarWheel() {
    const numbersRing = document.getElementById('numbersRing');
    const daySignsRing = document.getElementById('daySignsRing');
    
    // Create 13 numbers
    for (let i = 1; i <= 13; i++) {
        const numberItem = document.createElement('div');
        numberItem.className = 'number-item';
        numberItem.style.setProperty('--i', i - 1);
        numberItem.innerHTML = `<span class="number-glyph">${i}</span>`;
        numberItem.addEventListener('click', () => selectNumber(i));
        numberItem.addEventListener('mouseenter', (e) => showTooltip(e, `${i}`, 'Sacred Number', `The ${getOrdinal(i)} of 13 sacred numbers`, `${i}`));
        numberItem.addEventListener('mouseleave', hideTooltip);
        numbersRing.appendChild(numberItem);
    }
    
    // Create 20 day signs
    DAY_SIGNS.forEach((sign, index) => {
        const signItem = document.createElement('div');
        signItem.className = 'day-sign-item';
        signItem.style.setProperty('--i', index);
        signItem.innerHTML = `<span class="day-sign-glyph">${sign.glyph}</span>`;
        signItem.addEventListener('click', () => selectDaySign(index));
        signItem.addEventListener('mouseenter', (e) => showTooltip(e, sign.glyph, sign.name, sign.translation, `${(currentDayInTonalpohualli % 13) || 13} ${sign.name}`));
        signItem.addEventListener('mouseleave', hideTooltip);
        daySignsRing.appendChild(signItem);
    });
    
    updateCalendarDisplay();
}

function selectNumber(num) {
    selectedNumber = num;
    updateCalendarDisplay();
}

function selectDaySign(index) {
    selectedDaySign = index;
    updateCalendarDisplay();
}

function updateCalendarDisplay() {
    // Calculate current day sign and number from tonalpohualli day
    const dayNumber = ((currentDayInTonalpohualli - 1) % 13) + 1;
    const daySignIndex = (currentDayInTonalpohualli - 1) % 20;
    
    selectedNumber = dayNumber;
    selectedDaySign = daySignIndex;
    
    // Update number ring
    document.querySelectorAll('.number-item').forEach((item, index) => {
        item.classList.toggle('active', index + 1 === dayNumber);
    });
    
    // Update day sign ring
    document.querySelectorAll('.day-sign-item').forEach((item, index) => {
        item.classList.toggle('active', index === daySignIndex);
    });
    
    // Update center display
    document.getElementById('currentDayNum').textContent = dayNumber;
    document.getElementById('currentDaySign').textContent = DAY_SIGNS[daySignIndex].name;
    
    // Update sacred date display
    updateSacredDateDisplay();
    
    // Update deity
    updateCurrentDeity();
    
    // Rotate calendar wheel
    rotateCalendarWheel();
}

function rotateCalendarWheel() {
    const daySignsRing = document.getElementById('daySignsRing');
    const numbersRing = document.getElementById('numbersRing');
    
    const daySignIndex = (currentDayInTonalpohualli - 1) % 20;
    const rotation = -(daySignIndex * (360 / 20));
    
    daySignsRing.style.transition = 'transform 1s ease-out';
    daySignsRing.style.transform = `rotate(${rotation}deg)`;
    
    // Counter-rotate glyphs
    document.querySelectorAll('.day-sign-glyph').forEach(glyph => {
        glyph.style.transform = `rotate(${-rotation}deg)`;
    });
}

function updateSacredDateDisplay() {
    const dayNumber = ((currentDayInTonalpohualli - 1) % 13) + 1;
    const daySignIndex = (currentDayInTonalpohualli - 1) % 20;
    const daySign = DAY_SIGNS[daySignIndex].name;
    
    // Calculate approximate Long Count (simplified)
    const daysSinceStart = currentDayInTonalpohualli;
    const baktun = 9;
    const katun = 12;
    const tun = Math.floor(daysSinceStart / 360) + 15;
    const unial = Math.floor((daysSinceStart % 360) / 20);
    const kin = daysSinceStart % 20;
    
    document.getElementById('longCountDate').textContent = `${baktun}.${katun}.${tun}.${unial}.${kin}`;
    
    // Find trecena
    const trecenaIndex = Math.floor((currentDayInTonalpohualli - 1) / 13);
    const trecenaDeity = TRECENA_DEITIES[trecenaIndex % 13];
    document.getElementById('trecenaInfo').textContent = `${dayNumber}th day of ${trecenaDeity.name} Trecena`;
}

function updateCurrentDeity() {
    const trecenaIndex = Math.floor((currentDayInTonalpohualli - 1) / 13);
    const deity = TRECENA_DEITIES[trecenaIndex % 13];
    
    document.getElementById('deityName').textContent = deity.name;
    document.querySelector('.deity-domain').textContent = deity.domain;
    document.querySelector('.deity-symbol').textContent = deity.symbol;
    
    // Update cycle dots
    const dayInTrecena = ((currentDayInTonalpohualli - 1) % 13) + 1;
    document.querySelectorAll('.cycle-dots .dot').forEach((dot, index) => {
        dot.classList.toggle('active', index < dayInTrecena);
    });
}

// === NAVIGATION ===
function initializeNavigation() {
    // Add hover effects to all interactive elements
    document.querySelectorAll('.deity-item, .tribute-item, .ritual-item, .sun-era').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
}

function initializeCalendarControls() {
    document.getElementById('prevDay').addEventListener('click', () => {
        currentDayInTonalpohualli = currentDayInTonalpohualli <= 1 ? 260 : currentDayInTonalpohualli - 1;
        updateCalendarDisplay();
        playClickSound();
    });
    
    document.getElementById('nextDay').addEventListener('click', () => {
        currentDayInTonalpohualli = currentDayInTonalpohualli >= 260 ? 1 : currentDayInTonalpohualli + 1;
        updateCalendarDisplay();
        playClickSound();
    });
    
    document.getElementById('todayBtn').addEventListener('click', () => {
        setCurrentDate();
        playClickSound();
    });
}

// === DEITY LIST ===
function initializeDeityList() {
    const deityList = document.getElementById('deityList');
    
    DEITIES.forEach((deity, index) => {
        const item = document.createElement('div');
        item.className = 'deity-item';
        if (index === 0) item.classList.add('active');
        item.innerHTML = `
            <span class="deity-item-icon">${deity.symbol}</span>
            <span class="deity-item-name">${deity.name}</span>
        `;
        item.addEventListener('click', () => {
            document.querySelectorAll('.deity-item').forEach(d => d.classList.remove('active'));
            item.classList.add('active');
            document.getElementById('deityName').textContent = deity.name;
            document.querySelector('.deity-domain').textContent = deity.domain;
            document.querySelector('.deity-symbol').textContent = deity.symbol;
        });
        deityList.appendChild(item);
    });
}

// === TRIBUTE GRID ===
function initializeTributeGrid() {
    const tributeGrid = document.getElementById('tributeGrid');
    
    TRIBUTE_ITEMS.forEach(item => {
        const div = document.createElement('div');
        div.className = 'tribute-item';
        div.innerHTML = `
            <span class="tribute-icon">${item.icon}</span>
            <span class="tribute-name">${item.name}</span>
            <span class="tribute-day">Day ${item.day}</span>
        `;
        div.addEventListener('mouseenter', (e) => {
            showTooltip(e, item.icon, item.name, `Sacred tribute offered on day ${item.day}`, `Day ${item.day}`);
        });
        div.addEventListener('mouseleave', hideTooltip);
        tributeGrid.appendChild(div);
    });
}

// === RITUAL LIST ===
function initializeRitualList() {
    const ritualList = document.getElementById('ritualList');
    
    CEREMONIES.forEach((ceremony, index) => {
        const item = document.createElement('div');
        item.className = 'ritual-item';
        if (index === 0) item.classList.add('active');
        item.innerHTML = `
            <span class="ritual-icon">${ceremony.icon}</span>
            <div class="ritual-info">
                <span class="ritual-name">${ceremony.name}</span>
                <span class="ritual-desc">${ceremony.desc}</span>
            </div>
            <span class="ritual-date">${ceremony.day}</span>
        `;
        ritualList.appendChild(item);
    });
}

// === ASTRONOMICAL EVENTS ===
function initializeEvents() {
    const eventsContainer = document.getElementById('upcomingEvents');
    const header = eventsContainer.querySelector('.events-header');
    
    // Sort events by days until
    const sortedEvents = [...ASTRONOMICAL_EVENTS].sort((a, b) => a.daysUntil - b.daysUntil);
    
    sortedEvents.slice(0, 5).forEach(event => {
        const div = document.createElement('div');
        div.className = 'event-item';
        div.innerHTML = `
            <span class="event-icon ${event.type}">${event.type === 'celestial' ? '★' : '◆'}</span>
            <div class="event-details">
                <span class="event-name">${event.name}</span>
                <span class="event-date">${event.daysUntil} days remaining</span>
            </div>
        `;
        eventsContainer.appendChild(div);
    });
}

// === VENUS CYCLE ===
function animateVenus() {
    const venusBody = document.getElementById('venusBody');
    
    function updateVenusPosition() {
        const angle = (venusDay / 584) * 360;
        const radians = (angle - 90) * (Math.PI / 180);
        const radius = 24;
        const x = 30 + radius * Math.cos(radians) - 6;
        const y = 30 + radius * Math.sin(radians) - 6;
        
        venusBody.style.left = `${x}px`;
        venusBody.style.top = `${y}px`;
        
        // Update phase info
        let phaseName = '';
        if (venusDay < 50) phaseName = 'New Venus';
        else if (venusDay < 230) phaseName = 'Morning Star';
        else if (venusDay < 260) phaseName = 'Inferior Conjunction';
        else if (venusDay < 450) phaseName = 'Evening Star';
        else phaseName = 'Superior Conjunction';
        
        document.getElementById('venusPhaseName').textContent = phaseName;
        document.getElementById('venusDay').textContent = `Day ${venusDay} of 584`;
    }
    
    updateVenusPosition();
    
    // Slowly advance Venus day
    setInterval(() => {
        venusDay = (venusDay % 584) + 1;
        updateVenusPosition();
    }, 5000);
}

// === COUNTDOWN TIMER ===
function startCountdownTimer() {
    // Set next eclipse date (approximate)
    const nextEclipse = new Date();
    nextEclipse.setDate(nextEclipse.getDate() + 47);
    nextEclipse.setHours(13, 23, 45, 0);
    
    function updateCountdown() {
        const now = new Date();
        const diff = nextEclipse - now;
        
        if (diff <= 0) {
            // Reset to next eclipse
            nextEclipse.setDate(nextEclipse.getDate() + 177);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('daysLeft').textContent = String(days).padStart(2, '0');
        document.getElementById('hoursLeft').textContent = String(hours).padStart(2, '0');
        document.getElementById('minsLeft').textContent = String(minutes).padStart(2, '0');
        document.getElementById('secsLeft').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// === GLYPH TOOLTIP ===
function showTooltip(event, glyph, name, meaning, number) {
    const tooltip = document.getElementById('glyphTooltip');
    
    document.getElementById('tooltipGlyph').textContent = glyph;
    document.getElementById('tooltipName').textContent = name;
    document.getElementById('tooltipTranslation').textContent = name;
    document.getElementById('tooltipMeaning').textContent = meaning;
    document.getElementById('tooltipNumber').textContent = number;
    
    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    let x = rect.right + 10;
    let y = rect.top;
    
    // Adjust if off screen
    if (x + 220 > window.innerWidth) {
        x = rect.left - 220;
    }
    if (y + 150 > window.innerHeight) {
        y = window.innerHeight - 160;
    }
    
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.classList.add('visible');
}

function hideTooltip() {
    document.getElementById('glyphTooltip').classList.remove('visible');
}

// === AUDIO TOGGLE ===
function initializeAudioToggle() {
    const audioToggle = document.getElementById('audioToggle');
    
    audioToggle.addEventListener('click', () => {
        isAudioPlaying = !isAudioPlaying;
        audioToggle.classList.toggle('active', isAudioPlaying);
        
        if (isAudioPlaying) {
            playAmbientSound();
        } else {
            stopAmbientSound();
        }
    });
}

let audioContext = null;
let ambientOscillators = [];

function playAmbientSound() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create ambient drone
        const frequencies = [55, 82.5, 110, 165];
        
        frequencies.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            gain.gain.setValueAtTime(0.03, audioContext.currentTime);
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.start();
            ambientOscillators.push({ osc, gain });
        });
        
    } catch (e) {
        console.log('Audio not supported');
    }
}

function stopAmbientSound() {
    ambientOscillators.forEach(({ osc, gain }) => {
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        setTimeout(() => osc.stop(), 500);
    });
    ambientOscillators = [];
}

function playClickSound() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return;
        }
    }
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.1);
}

// === UTILITY FUNCTIONS ===
function setCurrentDate() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    
    // Calculate day in Tonalpohualli (260-day cycle)
    currentDayInTonalpohualli = (dayOfYear % 260) + 1;
    
    updateCalendarDisplay();
    
    // Update sun times (simplified)
    const sunriseHour = 6;
    const sunriseMin = 20 + Math.floor(Math.sin(dayOfYear / 365 * Math.PI * 2) * 25);
    const sunsetHour = 18;
    const sunsetMin = 30 + Math.floor(Math.sin(dayOfYear / 365 * Math.PI * 2 + Math.PI) * 30);
    
    document.getElementById('sunrise').textContent = `Dawn: ${sunriseHour}:${String(sunriseMin).padStart(2, '0')}`;
    document.getElementById('sunset').textContent = `Dusk: ${sunsetHour}:${String(sunsetMin).padStart(2, '0')}`;
}

function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// === KEYBOARD NAVIGATION ===
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            currentDayInTonalpohualli = currentDayInTonalpohualli <= 1 ? 260 : currentDayInTonalpohualli - 1;
            updateCalendarDisplay();
            playClickSound();
            break;
        case 'ArrowRight':
            currentDayInTonalpohualli = currentDayInTonalpohualli >= 260 ? 1 : currentDayInTonalpohualli + 1;
            updateCalendarDisplay();
            playClickSound();
            break;
        case 'Home':
            setCurrentDate();
            playClickSound();
            break;
    }
});

// === ECLIPSE TIMER VISUAL EFFECTS ===
function createEclipseEffect() {
    const timer = document.getElementById('eclipseTimer');
    
    setInterval(() => {
        const intensity = 0.3 + Math.random() * 0.4;
        timer.style.boxShadow = `0 0 ${20 + Math.random() * 40}px rgba(139, 26, 26, ${intensity}), inset 0 0 ${30 + Math.random() * 30}px rgba(139, 26, 26, 0.2)`;
    }, 2000);
}

createEclipseEffect();

// === AMBIENT PARTICLE SYSTEM ===
function createSacredParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, ${Math.random() > 0.5 ? 'var(--jade-glow)' : 'var(--gold-glow)'}, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 50;
        opacity: 0;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation: particleRise ${5 + Math.random() * 10}s linear forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 15000);
}

// Add particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleRise {
        0% { opacity: 0; transform: translateY(0) translateX(0); }
        10% { opacity: 0.8; }
        90% { opacity: 0.8; }
        100% { opacity: 0; transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px); }
    }
`;
document.head.appendChild(particleStyle);

// Spawn particles periodically
setInterval(createSacredParticle, 800);

// === CORNER STONE INTERACTIONS ===
document.querySelectorAll('.corner-stone').forEach(stone => {
    stone.style.pointerEvents = 'auto';
    stone.addEventListener('click', () => {
        stone.style.transform = 'scale(1.2)';
        setTimeout(() => {
            stone.style.transform = 'scale(1)';
        }, 200);
        
        // Create burst effect
        for (let i = 0; i < 8; i++) {
            const burst = document.createElement('div');
            burst.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--jade-glow);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${stone.getBoundingClientRect().left + 24}px;
                top: ${stone.getBoundingClientRect().top + 24}px;
                animation: burstOut 0.5s ease-out forwards;
                --angle: ${i * 45}deg;
            `;
            document.body.appendChild(burst);
            setTimeout(() => burst.remove(), 500);
        }
    });
});

// Add burst animation
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes burstOut {
        0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(50px); opacity: 0; }
    }
`;
document.head.appendChild(burstStyle);

// === SERPENT BORDER ANIMATION ENHANCEMENT ===
function enhanceSerpentBorder() {
    const serpents = document.querySelectorAll('.serpent-body');
    
    serpents.forEach(serpent => {
        serpent.addEventListener('mouseenter', () => {
            serpent.style.filter = 'brightness(1.3)';
        });
        serpent.addEventListener('mouseleave', () => {
            serpent.style.filter = 'brightness(1)';
        });
    });
}

enhanceSerpentBorder();

// === CONSOLE INITIALIZATION MESSAGE ===
console.log(`
%c╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🐍 TONALPOHUALLI — Sacred Count of Days 🐍            ║
║                                                          ║
║   "In the beginning, there was only darkness..."         ║
║                                                          ║
║   The Fifth Sun endures. The calendar turns.             ║
║   260 sacred days cycle through eternity.                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`, 'color: #c9a227; background: #121215; font-family: serif;');

console.log('%cUse ← → arrow keys to navigate days', 'color: #3dd9a0;');
console.log('%cPress Home to return to today', 'color: #3dd9a0;');