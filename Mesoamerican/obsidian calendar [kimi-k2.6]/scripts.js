// ============================================================
// TONALPOHUALLI — SCRIPTS OF THE SACRED COUNT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
});

// ---- Sacred Data: The 20 Day Signs ----
const DAY_SIGNS = [
    { name: 'Cipactli', meaning: 'Crocodile — Primordial Earth', glyph: '🐊', omens: 'Favorable for beginnings and foundations', element: 'water' },
    { name: 'Ehecatl', meaning: 'Wind — Divine Breath', glyph: '💨', omens: 'Good for travel and communication, bad for fixed plans', element: 'air' },
    { name: 'Calli', meaning: 'House — Shelter and Rest', glyph: '🏠', omens: 'Favorable for building and domestic matters', element: 'earth' },
    { name: 'Cuetzpallin', meaning: 'Lizard — Quickness and Adaptation', glyph: '🦎', omens: 'Good for swift action, risky for long commitments', element: 'earth' },
    { name: 'Coatl', meaning: 'Serpent — Transformation', glyph: '🐍', omens: 'Favorable for healing and hidden knowledge', element: 'water' },
    { name: 'Miquiztli', meaning: 'Death — Completion and Renewal', glyph: '💀', omens: 'Good for endings, dangerous for new ventures', element: 'earth' },
    { name: 'Mazatl', meaning: 'Deer — Gentleness and Vigilance', glyph: '🦌', omens: 'Favorable for art and graceful pursuits', element: 'earth' },
    { name: 'Tochtli', meaning: 'Rabbit — Fertility and Abundance', glyph: '🐇', omens: 'Good for planting and creative work', element: 'earth' },
    { name: 'Atl', meaning: 'Water — Purification and Flow', glyph: '💧', omens: 'Favorable for cleansing and emotional matters', element: 'water' },
    { name: 'Itzcuintli', meaning: 'Dog — Loyalty and Guidance', glyph: '🐕', omens: 'Good for trust and companionship, watch for deception', element: 'earth' },
    { name: 'Malinalli', meaning: 'Grass — Resilience and Flexibility', glyph: '🌿', omens: 'Favorable for endurance through hardship', element: 'earth' },
    { name: 'Acatl', meaning: 'Reed — Authority and Judgment', glyph: '🎋', omens: 'Good for leadership and legal matters', element: 'air' },
    { name: 'Ocelotl', meaning: 'Jaguar — Power and Mystery', glyph: '🐆', omens: 'Favorable for war and spiritual matters', element: 'earth' },
    { name: 'Cuauhtli', meaning: 'Eagle — Vision and Ascension', glyph: '🦅', omens: 'Good for ambition and far-reaching plans', element: 'air' },
    { name: 'Cozcaquautli', meaning: 'Vulture — Purification and Memory', glyph: '🦅', omens: 'Favorable for remembering ancestors', element: 'air' },
    { name: 'Ollin', meaning: 'Movement — Earthquake and Change', glyph: '🌋', omens: 'Unstable day, all ventures risky', element: 'earth' },
    { name: 'Tecpatl', meaning: 'Flint — Sacrifice and Sharpness', glyph: '⚔️', omens: 'Good for conflict, dangerous for peace', element: 'fire' },
    { name: 'Quiauitl', meaning: 'Rain — Nourishment and Storm', glyph: '🌧️', omens: 'Favorable for growth, watch for excess', element: 'water' },
    { name: 'Xochitl', meaning: 'Flower — Beauty and Transience', glyph: '🌸', omens: 'Good for love and artistic creation', element: 'earth' },
    { name: 'Cipactli', meaning: 'Crocodile — Return to Beginning', glyph: '🐊', omens: 'The cycle turns, all things begin again', element: 'water' }
];

// ---- Sacred Numbers: The 13 Trecena ----
const SACRED_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// ---- The Nine Lords of Night ----
const LORDS_OF_NIGHT = [
    { name: 'Xiuhtecuhtli', title: 'Lord of Fire — The Old God', glyph: '🔥', reign: 9 },
    { name: 'Tezcatlipoca', title: 'Smoking Mirror — Lord of the North', glyph: '💨', reign: 8 },
    { name: 'Piltzintecuhtli', title: 'The Young Prince — Lord of the Rising Sun', glyph: '🌅', reign: 7 },
    { name: 'Centzon Huitznahua', title: 'The Four Hundred Southerners — Star Lords', glyph: '⭐', reign: 6 },
    { name: 'Mictlantecuhtli', title: 'Lord of Mictlan — Death and the Underworld', glyph: '💀', reign: 5 },
    { name: 'Chalchiuhtlicue', title: 'Jade Skirt — Lady of Waters', glyph: '💧', reign: 4 },
    { name: 'Tlaloc', title: 'He Who Makes Things Sprout — Lord of Storms', glyph: '⛈️', reign: 3 },
    { name: 'Tonatiuh', title: 'The Sun — Fifth Age Lord', glyph: '☀️', reign: 2 },
    { name: 'Tlahuizcalpantecuhtli', title: 'Lord of the Dawn — Venus as Morning Star', glyph: '🌟', reign: 1 }
];

// ---- State of the Sacred Calendar ----
let calendarState = {
    currentDayIndex: 0,
    currentNumberIndex: 0,
    currentLordIndex: 1, // Tezcatlipoca starts
    wheelRotation: 0,
    isDragging: false,
    lastMouseAngle: 0,
    eclipseDate: null
};

// ============================================================
// INITIALIZATION
// ============================================================

function initializeCalendar() {
    calculateEclipseDate();
    buildSacredWheel();
    buildNumberRing();
    initializeWheelInteraction();
    initializeGlyphTooltips();
    initializeCursorGlow();
    startEclipseCountdown();
    startDeityCycle();
    updateDayDisplay();
    updateGregorianDate();
    
    // Recalculate eclipse on midnight
    setInterval(updateGregorianDate, 60000);
}

// ============================================================
// THE SACRED WHEEL: Tonalpohualli Construction
// ============================================================

function buildSacredWheel() {
    const wheelDays = document.getElementById('wheel-days');
    const radius = 42; // percentage from center
    
    DAY_SIGNS.forEach((day, index) => {
        const angle = (index / DAY_SIGNS.length) * 360 - 90;
        const radian = (angle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(radian);
        const y = 50 + radius * Math.sin(radian);
        
        const marker = document.createElement('div');
        marker.className = 'wheel-day-marker';
        marker.dataset.index = index;
        marker.dataset.glyph = day.name.toLowerCase();
        marker.dataset.translation = `${day.name} — ${day.meaning}`;
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.innerHTML = day.glyph;
        marker.title = day.name;
        
        marker.addEventListener('click', () => selectDay(index));
        
        wheelDays.appendChild(marker);
    });
}

function buildNumberRing() {
    const wheelNumbers = document.getElementById('wheel-numbers');
    const radius = 28; // inner ring
    
    SACRED_NUMBERS.forEach((num, index) => {
        const angle = (index / SACRED_NUMBERS.length) * 360 - 90;
        const radian = (angle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(radian);
        const y = 50 + radius * Math.sin(radian);
        
        const marker = document.createElement('div');
        marker.className = 'wheel-number-marker';
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.textContent = num;
        
        wheelNumbers.appendChild(marker);
    });
}

// ============================================================
// WHEEL INTERACTION: Turning the Sacred Count
// ============================================================

function initializeWheelInteraction() {
    const container = document.getElementById('wheel-container');
    const handle = document.getElementById('wheel-handle');
    
    let startAngle = 0;
    let currentRotation = 0;
    
    function getAngle(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    }
    
    function startDrag(event) {
        event.preventDefault();
        calendarState.isDragging = true;
        startAngle = getAngle(event, container) - currentRotation;
        container.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
    }
    
    function doDrag(event) {
        if (!calendarState.isDragging) return;
        event.preventDefault();
        
        const angle = getAngle(event, container);
        currentRotation = angle - startAngle;
        calendarState.wheelRotation = currentRotation;
        
        container.style.transform = `rotate(${currentRotation}deg)`;
        
        // Determine which day is at top (selected)
        const normalizedRotation = ((currentRotation % 360) + 360) % 360;
        const dayIndex = Math.round((normalizedRotation / 360) * DAY_SIGNS.length) % DAY_SIGNS.length;
        
        if (dayIndex !== calendarState.currentDayIndex) {
            calendarState.currentDayIndex = dayIndex;
            updateDayDisplay();
            highlightWheelDay(dayIndex);
        }
    }
    
    function endDrag() {
        calendarState.isDragging = false;
        container.style.cursor = 'grab';
        document.body.style.cursor = '';
        
        // Snap to nearest day
        const dayStep = 360 / DAY_SIGNS.length;
        const nearestDay = Math.round(currentRotation / dayStep);
        currentRotation = nearestDay * dayStep;
        calendarState.wheelRotation = currentRotation;
        
        container.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        container.style.transform = `rotate(${currentRotation}deg)`;
        
        setTimeout(() => {
            container.style.transition = '';
        }, 600);
    }
    
    container.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);
    
    container.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', endDrag);
    
    // Handle click for rotation hint
    handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        startDrag(e);
    });
}

function selectDay(index) {
    const dayStep = 360 / DAY_SIGNS.length;
    calendarState.currentDayIndex = index;
    calendarState.wheelRotation = -index * dayStep;
    
    const container = document.getElementById('wheel-container');
    container.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    container.style.transform = `rotate(${calendarState.wheelRotation}deg)`;
    
    setTimeout(() => {
        container.style.transition = '';
    }, 800);
    
    updateDayDisplay();
    highlightWheelDay(index);
}

function highlightWheelDay(index) {
    document.querySelectorAll('.wheel-day-marker').forEach((marker, i) => {
        marker.classList.toggle('active', i === index);
    });
}

// ============================================================
// DAY DISPLAY: Revealing the Selected Day
// ============================================================

function updateDayDisplay() {
    const day = DAY_SIGNS[calendarState.currentDayIndex];
    const number = SACRED_NUMBERS[calendarState.currentNumberIndex];
    
    const glyphLarge = document.getElementById('day-glyph-large');
    const nameEl = document.getElementById('day-name');
    const meaningEl = document.getElementById('day-meaning');
    const numberEl = document.getElementById('day-number');
    const omenEl = document.getElementById('day-omen');
    
    // Animate transition
    if (glyphLarge) {
        glyphLarge.style.animation = 'none';
        glyphLarge.offsetHeight; // trigger reflow
        glyphLarge.style.animation = '';
        
        glyphLarge.textContent = day.glyph;
        glyphLarge.dataset.glyph = day.name.toLowerCase();
        glyphLarge.dataset.translation = `${day.name} — ${day.meaning}`;
    }
    
    if (nameEl) nameEl.textContent = day.name;
    if (meaningEl) meaningEl.textContent = day.meaning;
    if (numberEl) {
        numberEl.textContent = number;
        numberEl.style.color = getElementColor(day.element);
    }
    if (omenEl) omenEl.textContent = day.omens;
    
    // Update calendar round footer
    updateCalendarRound(day, number);
}

function getElementColor(element) {
    const colors = {
        water: '#4ade80',
        air: '#d4a574',
        earth: '#8b1a1a',
        fire: '#dc2626'
    };
    return colors[element] || '#d4a574';
}

function updateCalendarRound(day, number) {
    const roundEl = document.getElementById('calendar-round');
    if (roundEl) {
        const haabMonth = getHaabMonth();
        roundEl.textContent = `${number} ${day.name}, 9 ${haabMonth}`;
    }
}

function getHaabMonth() {
    const months = ['Pop', 'Wo', 'Sip', 'Sotz', 'Tzek', 'Xul', 'Yaxkin', 'Mol', 'Chen', 'Yax', 'Zac', 'Ceh', 'Mac', 'Kankin', 'Muan', 'Pax', 'Kayab', 'Kumku', 'Wayeb'];
    const now = new Date();
    return months[now.getMonth() % 19];
}

function updateGregorianDate() {
    const gregorianEl = document.getElementById('gregorian-date');
    if (gregorianEl) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        gregorianEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

// ============================================================
// ECLIPSE COUNTDOWN: The Darkening Timer
// ============================================================

function calculateEclipseDate() {
    // Next solar eclipse: April 8, 2024 (historical reference) or calculate forward
    // For immersion, we'll set a future eclipse ~47 days from load
    const now = new Date();
    calendarState.eclipseDate = new Date(now.getTime() + (47 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000) + (33 * 60 * 1000) + (18 * 1000));
}

function startEclipseCountdown() {
    updateEclipseDisplay();
    setInterval(updateEclipseDisplay, 1000);
}

function updateEclipseDisplay() {
    const now = new Date();
    const diff = calendarState.eclipseDate - now;
    
    if (diff <= 0) {
        // Eclipse is happening!
        document.querySelector('.eclipse-title').textContent = 'The Sun is Eaten';
        document.querySelector('.eclipse-warning').textContent = 'The world holds its breath. Do not look upon the sky.';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const daysEl = document.getElementById('eclipse-days');
    const hoursEl = document.getElementById('eclipse-hours');
    const minutesEl = document.getElementById('eclipse-minutes');
    const secondsEl = document.getElementById('eclipse-seconds');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) {
        // Animate the drip effect on seconds change
        const oldValue = secondsEl.textContent;
        secondsEl.textContent = seconds.toString().padStart(2, '0');
        if (oldValue !== secondsEl.textContent) {
            secondsEl.style.animation = 'none';
            secondsEl.offsetHeight;
            secondsEl.style.animation = '';
            secondsEl.style.textShadow = '0 0 30px #f87171, 0 4px 8px rgba(220, 38, 38, 0.5)';
            setTimeout(() => {
                secondsEl.style.textShadow = '';
            }, 300);
        }
    }
}

// ============================================================
// DEITY CYCLE: The Nine Lords of Night
// ============================================================

function startDeityCycle() {
    updateDeityDisplay();
    // Change lord every simulated "night" (every 3 minutes for demo)
    setInterval(advanceDeityCycle, 180000);
}

function advanceDeityCycle() {
    calendarState.currentLordIndex = (calendarState.currentLordIndex + 1) % LORDS_OF_NIGHT.length;
    updateDeityDisplay();
}

function updateDeityDisplay() {
    const lord = LORDS_OF_NIGHT[calendarState.currentLordIndex];
    
    const portrait = document.getElementById('deity-portrait');
    const name = document.getElementById('deity-name');
    const title = document.querySelector('.deity-title');
    const progressBar = document.getElementById('deity-progress');
    const reignText = document.querySelector('.deity-reign');
    
    if (portrait) {
        portrait.style.animation = 'none';
        portrait.offsetHeight;
        portrait.style.animation = '';
        portrait.textContent = lord.glyph;
    }
    if (name) name.textContent = lord.name;
    if (title) title.textContent = lord.title;
    if (progressBar) {
        const progress = ((9 - lord.reign) / 9) * 100;
        progressBar.style.width = `${progress}%`;
    }
    if (reignText) reignText.textContent = `Reigns for ${lord.reign} more nights`;
    
    // Update upcoming queue
    updateDeityQueue();
}

function updateDeityQueue() {
    const queue = document.getElementById('deity-queue');
    if (!queue) return;
    
    queue.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        const lordIndex = (calendarState.currentLordIndex + i) % LORDS_OF_NIGHT.length;
        const div = document.createElement('div');
        div.className = 'deity-upcoming';
        div.dataset.deity = lordIndex;
        div.textContent = LORDS_OF_NIGHT[lordIndex].glyph;
        div.title = LORDS_OF_NIGHT[lordIndex].name;
        queue.appendChild(div);
    }
}

// ============================================================
// GLYPH TOOLTIPS: The Jade Translation System
// ============================================================

function initializeGlyphTooltips() {
    const tooltip = document.getElementById('glyph-tooltip');
    const tooltipGlyph = document.getElementById('tooltip-glyph');
    const tooltipTranslation = document.getElementById('tooltip-translation');
    
    if (!tooltip) return;
    
    // Find all elements with glyph data
    const glyphElements = document.querySelectorAll('[data-glyph][data-translation]');
    
    glyphElements.forEach(el => {
        el.addEventListener('mouseenter', (event) => {
            const glyph = el.dataset.glyph || '◆';
            const translation = el.dataset.translation || 'Unknown meaning';
            
            if (tooltipGlyph) tooltipGlyph.textContent = getGlyphSymbol(glyph);
            if (tooltipTranslation) tooltipTranslation.textContent = translation;
            
            tooltip.classList.add('visible');
        });
        
        el.addEventListener('mousemove', (event) => {
            const x = event.clientX;
            const y = event.clientY - 20;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });
        
        el.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
    
    // Also handle dynamically created wheel markers
    document.addEventListener('mouseover', (event) => {
        const target = event.target.closest('[data-glyph][data-translation]');
        if (!target) return;
        
        const glyph = target.dataset.glyph || '◆';
        const translation = target.dataset.translation || 'Unknown meaning';
        
        if (tooltipGlyph) tooltipGlyph.textContent = getGlyphSymbol(glyph);
        if (tooltipTranslation) tooltipTranslation.textContent = translation;
        
        tooltip.classList.add('visible');
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!tooltip.classList.contains('visible')) return;
        const x = event.clientX;
        const y = event.clientY - 20;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    });
    
    document.addEventListener('mouseout', (event) => {
        const target = event.target.closest('[data-glyph][data-translation]');
        if (!target) {
            tooltip.classList.remove('visible');
        }
    });
}

function getGlyphSymbol(glyphName) {
    const symbols = {
        baktun: '◈',
        cipactli: '🐊',
        ehecatl: '💨',
        calli: '🏠',
        coatl: '🐍',
        miquiztli: '💀',
        mazatl: '🦌',
        tochtli: '🐇',
        atl: '💧',
        itzcuintli: '🐕',
        malinalli: '🌿',
        acatl: '🎋',
        ocelotl: '🐆',
        cuauhtli: '🦅',
        ollin: '🌋',
        tecpatl: '⚔️',
        quiauitl: '🌧️',
        xochitl: '🌸'
    };
    return symbols[glyphName] || '◆';
}

// ============================================================
// CURSOR GLOW: Following the Jade Light
// ============================================================

function initializeCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    
    // Skip on touch devices
    if ('ontouchstart' in window) {
        glow.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    function animateGlow() {
        // Smooth follow with easing
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
}

// ============================================================
// FEATHERED SERPENT: Border Animation Enhancement
// ============================================================

// The CSS handles the base animation, but we can add
// mouse-reactive intensity to the serpent
document.addEventListener('mousemove', (event) => {
    const serpentPaths = document.querySelectorAll('.serpent-svg path');
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    
    serpentPaths.forEach((path, index) => {
        const offset = (index * 2) + (x * 2);
        const speed = 8 - (y * 4);
        path.style.animationDuration = `${speed}s`;
    });
});

// ============================================================
// ASTRONOMICAL EVENTS: Celestial Updates
// ============================================================

// Periodically update astronomical event timing
setInterval(() => {
    const venusEvent = document.querySelector('[data-event="venus"] .event-date');
    if (venusEvent) {
        const days = 12 - Math.floor(Math.random() * 0.5);
        venusEvent.textContent = `Rising in ${days} days`;
    }
}, 300000); // Every 5 minutes

// ============================================================
// TRIBUTE INTERACTIONS
// ============================================================

document.querySelectorAll('.tribute-item').forEach(item => {
    item.addEventListener('click', () => {
        const status = item.querySelector('.tribute-status');
        if (status && status.classList.contains('pending')) {
            status.className = 'tribute-status complete';
            status.textContent = 'Complete';
        }
    });
});