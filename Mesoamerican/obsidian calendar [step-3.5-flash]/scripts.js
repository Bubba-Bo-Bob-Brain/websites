/* ==========================================
   SACRED CALENDAR JAVASCRIPT
   Aztec-Mayan Ceremonial Interface
   ========================================== */

// ==========================================
// DATA: Aztec/Mayan Calendar Systems
// ==========================================

const tonalpohualli = [
    { name: "Cipactli", glyph: "🜂", meaning: "Crocodile", pronunciation: "See-pahkt-lee" },
    { name: "Ehecatl", glyph: "🜃", meaning: "Wind", pronunciation: "Eh-heh-kahl" },
    { name: "Calli", glyph: "🜄", meaning: "House", pronunciation: "Kah-yee" },
    { name: "Cuetzpalin", glyph: "🜅", meaning: "Lizard", pronunciation: "Kweets-pah-leen" },
    { name: "Coatl", glyph: "🜆", meaning: "Serpent", pronunciation: "Koh-ah-tl" },
    { name: "Miquiztli", glyph: "🜇", meaning: "Death", pronunciation: "Mee-keez-tlee" },
    { name: "Mazatl", glyph: "🜈", meaning: "Deer", pronunciation: "Mah-sahl" },
    { name: "Tochtli", glyph: "🜉", meaning: "Rabbit", pronunciation: "Tohch-tlee" },
    { name: "Atl", glyph: "🜊", meaning: "Water", pronunciation: "Ahtl" },
    { name: "Itzcuintli", glyph: "🜋", meaning: "Dog", pronunciation: "Eets-koo-een-tlee" },
    { name: "Ozomahtli", glyph: "🜌", meaning: "Monkey", pronunciation: "Oh-soh-mah-tlee" },
    { name: "Malinalli", glyph: "🜍", meaning: "Grass", pronunciation: "Mah-lee-nah-yee" },
    { name: "Acatl", glyph: "🜎", meaning: "Reed", pronunciation: "Ah-kahl" },
    { name: "Ocelotl", glyph: "🜏", meaning: "Jaguar", pronunciation: "Oh-seh-lohtl" },
    { name: "Cuauhtli", glyph: "🜐", meaning: "Eagle", pronunciation: "Kwah-ooh-tlee" },
    { name: "Cozcacuauhtli", glyph: "🜑", meaning: "Vulture", pronunciation: "Kohs-kah-kwah-ooh-tlee" },
    { name: "Ollin", glyph: "🜒", meaning: "Movement", pronunciation: "Oh-yeen" },
    { name: "Tecpatl", glyph: "🜓", meaning: "Flint", pronunciation: "Teh-pahl" },
    { name: "Quiahuitl", glyph: "🜔", meaning: "Rain", pronunciation: "Kee-ah-weetl" },
    { name: "Xochitl", glyph: "🜕", meaning: "Flower", pronunciation: "Sho-cheetl" }
];

const mayaDayNames = [
    "Imix", "Ik", "Akbal", "Kan", "Chikchan", "Kimi", "Manik", "Lamat", "Muluc", "Oc",
    "Chuen", "Eb", "Ben", "Ix", "Men", "Cib", "Caban", "Etznab", "Cauac", "Ahau"
];

const deities = [
    {
        name: "Quetzalcoatl",
        glyph: "𓂺",
        domain: "Feathered Serpent, Wind, Learning",
        description: "The feathered serpent deity associated with wind, learning, and the morning star. Bringer of maize and civilization to humanity.",
        daySigns: ["Ehecatl", "Quiahuitl"],
        color: "#2db89c"
    },
    {
        name: "Tezcatlipoca",
        glyph: "⭐",
        domain: "Night Sky, Sorcery, Conflict",
        description: "The smoking mirror, god of the night sky, hurricanes, and obsidian. The eternal adversary and provider of temptation.",
        daySigns: ["Ocelotl", "Miquiztli"],
        color: "#8b0000"
    },
    {
        name: "Huitzilopochtli",
        glyph: "☼",
        domain: "Sun, War, Human Sacrifice",
        description: "The hummingbird god of the sun and war. Leads the Mexica people and demands human hearts to sustain the sun's journey.",
        daySigns: ["Coatl", "Cozcacuauhtli"],
        color: "#d4af37"
    },
    {
        name: "Tlaloc",
        glyph: "☔",
        domain: "Rain, Lightning, Fertility",
        description: "The jade-faced god of rain, fertility, and earthly nourishment. Both benevolent bringer of rains and destructive storm god.",
        daySigns: ["Atl", "Quiahuitl"],
        color: "#1a8f6e"
    },
    {
        name: "Xipe Totec",
        glyph: "👁",
        domain: "Agricultural Renewal, Spring",
        description: "Our Lord the Flayed One, god of agricultural rebirth. His flayed skin represents the new growth that emerges from old seeds.",
        daySigns: ["Ollin", "Acatl"],
        color: "#c19a6b"
    },
    {
        name: "Chalchiuhtlicue",
        glyph: "🌊",
        domain: "Water, Rivers, Lakes",
        description: "She of the Jade Skirt, goddess of rivers, lakes, and all flowing water. Wife of Tlaloc and nurturer of life.",
        daySigns: ["Atl", "Calli"],
        color: "#4169e1"
    }
];

const rituals = [
    {
        name: "New Fire Ceremony",
        date: "Every 52 years",
        daySign: "Binding of all 13 numbers with all 20 signs",
        description: "The most important ceremony marking the end and beginning of a calendar round. All fires are extinguished and a new fire is lit from the chest of a sacrificial victim.",
        glyphs: ["fire", "sun", "calendar"],
        importance: "critical"
    },
    {
        name: "Panquetzaliztli",
        date: "15th day of the 15th month (December)",
        daySign: "15th day sign",
        description: "The raising of banners for Huitzilopochtli. A 20-day festival with dances, processions, and human sacrifices to honor the sun god.",
        glyphs: ["banner", "sun", "war"],
        importance: "high"
    },
    {
        name: "Tlaxochimaco",
        date: "13th day of the 8th month",
        daySign: "13th day sign",
        description: "The offering of flowers. A day dedicated to the worship of Xochipilli and Xochiquetzal, gods of flowers, games, and beauty.",
        glyphs: ["flower", "art", "dance"],
        importance: "medium"
    },
    {
        name: "Xocotl Huetzi",
        date: "10th day of the 11th month",
        daySign: "10th day sign",
        description: "The falling of fruit. A harvest festival celebrating the abundance of the earth with offerings of the first fruits.",
        glyphs: ["fruit", "harvest", "earth"],
        importance: "medium"
    },
    {
        name: "Atl Caualo",
        date: "1st day of the 2nd month",
        daySign: "1st day sign",
        description: "The beginning of the water ceremony. Children are baptized and fishermen make offerings to Tlaloc for abundant waters.",
        glyphs: ["water", "child", "baptism"],
        importance: "medium"
    },
    {
        name: "Izcalli",
        date: "4th day of the 1st month",
        daySign: "4th day sign",
        description: "The renewal of fire. Old fires are extinguished and new ones kindled in honor of Xiuhtecuhtli, the fire god.",
        glyphs: ["fire", "renewal", "home"],
        importance: "high"
    }
];

const astronomicalEvents = [
    {
        name: "Venus Rising as Morning Star",
        icon: "🌅",
        date: "Every 584 days",
        description: "Venus (Tlahuizcalpantecuhtli) appears as the morning star, heralding the rebirth of the sun and the warrior's return. A time for military campaigns.",
        period: "5 days"
    },
    {
        name: "Zenith Passage of the Sun",
        icon: "⬆️",
        date: "May 15 & July 29 (at Templo Mayor)",
        description: "The sun passes directly overhead, casting no shadow. This marks the rainy season and validates the temple's alignment with celestial events.",
        period: "Single day"
    },
    {
        name: "Eclipse Season",
        icon: "🌑",
        date: "Every 173 days",
        description: "When the moon's path crosses the ecliptic, creating potential eclipses. Considered times of great danger requiring special rituals.",
        period: "2 eclipse seasons per year"
    },
    {
        name: "Pleiades Midnight Transit",
        icon: "⋆",
        date: "Just before sunrise, late November",
        description: "The Pleiades cluster reaches its highest point at midnight, marking the beginning of the agricultural cycle and New Year preparations.",
        period: "1 night"
    },
    {
        name: "Blood Moon Eclipse",
        icon: "🔴",
        date: "Predicted: Next in 3 months",
        description: "A total lunar eclipse where the moon turns blood red. Considered a direct attack on the moon gods, requiring urgent ceremonies.",
        period: "Several hours"
    }
];

const tributeSchedule = [
    {
        name: "Maize Tribute",
        frequency: "Every 20 days",
        items: ["Maize", "Beans", "Chili", "Amaranth"],
        description: "The basic food tribute from commoners to support the nobility and temple kitchens."
    },
    {
        name: "Cotton Tribute",
        frequency: "Every 80 days",
        items: ["Cotton", "Cacao Beans", "Feathers"],
        description: "Textile tribute collected for the production of royal garments and trade with other regions."
    },
    {
        name: "War Tribute",
        frequency: "After military campaigns",
        items: ["Captives", "Jade", "Obsidian", "Gold Dust"],
        description: "Tribute extracted from conquered city-states as acknowledgment of Mexica supremacy."
    },
    {
        name: "Feather Tribute",
        frequency: "Every 100 days",
        items: ["Quetzal Feathers", "Macaw Feathers", "Heron Feathers"],
        description: "Exotic feathers from distant lands for the creation of ceremonial headdresses and deity costumes."
    },
    {
        name: "Luxury Tribute",
        frequency: "Yearly",
        items: ["Cacao", "Jade Carvings", "Turquoise", "Shells"],
        description: "Prestige goods that demonstrate the wealth and reach of the Triple Alliance empire."
    }
];

// ==========================================
// STATE MANAGEMENT
// ==========================================

let state = {
    currentPanel: 'rituals',
    selectedDaySign: 0,
    wheelRotation: 0,
    isDragging: false,
    dragStartAngle: 0,
    currentRotation: 0,
    calendarRound: {
        tzolkin: { day: 1, sign: 0 },
        xihuitl: { month: 1, day: 1 }
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeWheel();
    initializePanels();
    initializeGlyphTooltips();
    initializeEclipseCountdown();
    initializeCalendarRound();
    initializeAnimations();
    console.log("🌞 Sacred Calendar Initialized - Fifth Sun Era");
});

// ==========================================
// CALENDAR WHEEL FUNCTIONS
// ==========================================

function initializeWheel() {
    const wheelRing = document.getElementById('wheel-ring');
    if (!wheelRing) return;

    // Create 20 day signs
    tonalpohualli.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'wheel-day-sign';
        dayElement.dataset.index = index;
        dayElement.innerHTML = day.glyph;
        dayElement.setAttribute('role', 'button');
        dayElement.setAttribute('tabindex', '0');
        dayElement.setAttribute('aria-label', `${day.name}: ${day.meaning} (${day.pronunciation})`);
        
        // Position around the circle
        const angle = (index * 18) - 90; // 360/20 = 18 degrees, start at top
        const radius = 130; // Distance from center
        const x = 160 + radius * Math.cos(angle * Math.PI / 180);
        const y = 160 + radius * Math.sin(angle * Math.PI / 180);
        
        dayElement.style.left = `${x - 20}px`;
        dayElement.style.top = `${y - 20}px`;
        
        // Event listeners
        dayElement.addEventListener('click', () => selectDaySign(index));
        dayElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectDaySign(index);
            }
        });
        
        wheelRing.appendChild(dayElement);
    });

    // Set up wheel dragging
    const calendarWheel = document.getElementById('calendar-wheel');
    calendarWheel.addEventListener('mousedown', startDrag);
    calendarWheel.addEventListener('touchstart', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // Select the current day sign based on date
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const currentDaySign = dayOfYear % 20;
    selectDaySign(currentDaySign);
}

function startDrag(e) {
    e.preventDefault();
    state.isDragging = true;
    const rect = this.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    state.dragStartAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    state.currentRotation = state.wheelRotation;
    this.style.cursor = 'grabbing';
}

function drag(e) {
    if (!state.isDragging) return;
    e.preventDefault();
    
    const calendarWheel = document.getElementById('calendar-wheel');
    const rect = calendarWheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    let angleDiff = currentAngle - state.dragStartAngle;
    
    // Normalize angle
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    state.wheelRotation = state.currentRotation + angleDiff;
    updateWheelRotation();
}

function endDrag() {
    state.isDragging = false;
    const calendarWheel = document.getElementById('calendar-wheel');
    calendarWheel.style.cursor = 'grab';
    
    // Snap to nearest day sign
    const normalizedRotation = ((state.wheelRotation % 360) + 360) % 360;
    const snapAngle = 18; // Each day sign is 18 degrees
    const nearestSnap = Math.round(normalizedRotation / snapAngle) * snapAngle;
    state.wheelRotation = nearestSnap;
    updateWheelRotation();
    
    // Update selected day sign based on rotation
    const offset = (360 - state.wheelRotation) % 360;
    const selectedIndex = Math.round(offset / snapAngle) % 20;
    selectDaySign(selectedIndex);
}

function updateWheelRotation() {
    const calendarWheel = document.getElementById('calendar-wheel');
    calendarWheel.style.transform = `rotate(${state.wheelRotation}deg)`;
}

function selectDaySign(index) {
    // Remove active class from all day signs
    document.querySelectorAll('.wheel-day-sign').forEach(el => {
        el.classList.remove('active');
    });
    
    // Add active class to selected
    const selectedElement = document.querySelector(`.wheel-day-sign[data-index="${index}"]`);
    if (selectedElement) {
        selectedElement.classList.add('active');
    }
    
    state.selectedDaySign = index;
    
    // Update content panels with day-specific information
    updatePanelWithDaySign(index);
    
    // Announce for screen readers
    const day = tonalpohualli[index];
    announceToScreenReader(`Selected day sign: ${day.name}, ${day.meaning}. Pronunciation: ${day.pronunciation}`);
}

function updatePanelWithDaySign(index) {
    const day = tonalpohualli[index];
    
    // Update day count display
    document.getElementById('current-day-number').textContent = index + 1;
    
    // Could filter rituals/events based on day sign here
    // For now, just update the current day info
}

// ==========================================
// PANEL NAVIGATION
// ==========================================

function initializePanels() {
    const navButtons = document.querySelectorAll('.wheel-nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchPanel(view);
        });
    });
    
    // Populate all panels with data
    populateRituals();
    populateAstronomy();
    populateDeities();
    populateTribute();
}

function switchPanel(viewName) {
    // Update nav buttons
    document.querySelectorAll('.wheel-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-pressed', 'true');
    }
    
    // Update panels
    document.querySelectorAll('.content-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const activePanel = document.getElementById(`panel-${viewName}`);
    if (activePanel) {
        activePanel.classList.add('active');
        // Trigger entrance animation
        activePanel.style.animation = 'none';
        setTimeout(() => {
            activePanel.style.animation = '';
        }, 10);
    }
    
    state.currentPanel = viewName;
}

function populateRituals() {
    const ritualList = document.getElementById('ritual-list');
    if (!ritualList) return;
    
    ritualList.innerHTML = '';
    
    rituals.forEach((ritual, index) => {
        const ritualItem = document.createElement('article');
        ritualItem.className = 'ritual-item';
        ritualItem.style.animationDelay = `${index * 0.1}s`;
        
        const glyphsHtml = ritual.glyphs.map(glyphName => 
            `<span class="ritual-glyph" data-glyph="${glyphName}" tabindex="0">${getGlyphSymbol(glyphName)}</span>`
        ).join('');
        
        ritualItem.innerHTML = `
            <div class="ritual-header">
                <h3 class="ritual-name">${ritual.name}</h3>
                <span class="ritual-date">${ritual.date}</span>
            </div>
            <p class="ritual-description">${ritual.description}</p>
            <div class="ritual-glyphs">
                ${glyphsHtml}
                <span class="ritual-glyph importance-${ritual.importance}">${ritual.importance}</span>
            </div>
        `;
        
        ritualList.appendChild(ritualItem);
    });
    
    // Add event listeners to glyphs
    attachGlyphListeners(ritualList);
}

function populateAstronomy() {
    const eventList = document.getElementById('event-list');
    if (!eventList) return;
    
    eventList.innerHTML = '';
    
    astronomicalEvents.forEach((event, index) => {
        const eventItem = document.createElement('article');
        eventItem.className = 'event-item';
        eventItem.style.animationDelay = `${index * 0.1}s`;
        
        eventItem.innerHTML = `
            <div class="event-header">
                <div class="event-icon">${event.icon}</div>
                <h3 class="event-name">${event.name}</h3>
                <span class="event-date">${event.date}</span>
            </div>
            <p class="event-description">${event.description} <br><small>Period: ${event.period}</small></p>
        `;
        
        eventList.appendChild(eventItem);
    });
}

function populateDeities() {
    const deityGrid = document.getElementById('deity-grid');
    if (!deityGrid) return;
    
    deityGrid.innerHTML = '';
    
    deities.forEach((deity, index) => {
        const deityCard = document.createElement('article');
        deityCard.className = 'deity-card';
        deityCard.style.animationDelay = `${index * 0.15}s`;
        
        const glyphsHtml = deity.daySigns.map(sign => 
            `<span class="deity-mini-glyph">${sign}</span>`
        ).join('');
        
        deityCard.innerHTML = `
            <span class="deity-glyph">${deity.glyph}</span>
            <h3 class="deity-name">${deity.name}</h3>
            <p class="deity-domain">${deity.domain}</p>
            <p class="deity-description">${deity.description}</p>
            <div class="deity-glyphs-list">
                ${glyphsHtml}
            </div>
        `;
        
        deityCard.addEventListener('click', () => {
            // Could expand to full deity details
            console.log(`Deity selected: ${deity.name}`);
        });
        
        deityGrid.appendChild(deityCard);
    });
}

function populateTribute() {
    const tributeList = document.getElementById('tribute-list');
    if (!tributeList) return;
    
    tributeList.innerHTML = '';
    
    tributeSchedule.forEach((tribute, index) => {
        const tributeItem = document.createElement('article');
        tributeItem.className = 'tribute-item';
        tributeItem.style.animationDelay = `${index * 0.1}s`;
        
        const itemsHtml = tribute.items.map(item => 
            `<span class="tribute-item-chip">${item}</span>`
        ).join('');
        
        tributeItem.innerHTML = `
            <div class="tribute-header">
                <h3 class="tribute-name">${tribute.name}</h3>
                <span class="tribute-frequency">${tribute.frequency}</span>
            </div>
            <p class="tribute-description">${tribute.description}</p>
            <div class="tribute-items">
                ${itemsHtml}
            </div>
        `;
        
        tributeList.appendChild(tributeItem);
    });
}

// ==========================================
// GLYPH TOOLTIP SYSTEM
// ==========================================

const glyphDictionary = {
    "sun": { symbol: "☼", name: "Tonatiuh", meaning: "Sun", pronunciation: "To-nah-tee-uh", description: "The Fifth Sun, current era of the world. Requires constant blood sacrifice to maintain its journey across the sky." },
    "moon": { symbol: "☾", name: "Metztli", meaning: "Moon", pronunciation: "Met-ztlee", description: "The moon goddess, associated with water, fertility, and the menstrual cycle." },
    "star": { symbol: "✦", name: "Citlalstar", meaning: "Star", pronunciation: "Seet-lahl-star", description: "Stars are the souls of warriors who died in battle or as sacrifices." },
    "calendar": { symbol: "◈", name: "Tonalpohualli", meaning: "Sacred Calendar", pronunciation: "To-nahl-poh-wah-lee", description: "The 260-day ritual calendar used for divination and determining ceremonial dates." },
    "eclipse": { symbol: "◑", name: "Tecuitlatl", meaning: "Eclipse", pronunciation: "Teh-koo-eet-lahl", description: "A celestial event where the sun or moon is consumed. Considered a time of great danger." },
    "ritual": { symbol: "◈", name: "Teocalli", meaning: "Temple/Service", pronunciation: "Teh-oh-kahl-yee", description: "Religious ceremonies performed at temples to honor the gods." },
    "astronomy": { symbol: "◉", name: "Ilhuicatl", meaning: "Heavens", pronunciation: "Eel-weet-sah-tl", description: "The 13 heavens of the Aztec cosmos, home of the gods." },
    "deity": { symbol: "◊", name: "Teotl", meaning: "God/Divine", pronunciation: "Teh-oh-tl", description: "The sacred power that animates the universe and manifests in various deities." },
    "tribute": { symbol: "◑", name: "Tequetza", meaning: "Tribute/Due", pronunciation: "Teh-ke-tza", description: "The obligatory payment from subject peoples to the imperial center." },
    "ceremony": { symbol: "◈", name: "Necuamitl", meaning: "Ceremony", pronunciation: "Neh-koo-ah-mitl", description: "Formal religious rites with specific timing, participants, and offerings." },
    "heavens": { symbol: "◉", name: "Ilhuicatl", meaning: "Sky/Heaven", pronunciation: "Eel-weet-sah-tl", description: "The upper world, divided into 13 levels, home of the celestial deities." },
    "gods": { symbol: "◊", name: "Teotl", meaning: "Divine Essence", pronunciation: "Teh-oh-tl", description: "The sacred force that permeates all things, manifesting as individual deities." },
    "offering": { symbol: "◑", name: "Tlamahui", meaning: "Offering", pronunciation: "Tlah-mah-wee", description: "Gifts given to the gods to maintain cosmic order and receive blessings." },
    "earth": { symbol: "◉", name: "Tlalocan", meaning: "Earthly Paradise", pronunciation: "Tlah-loh-kahn", description: "The earthly paradise, home of Tlaloc and place of abundance." },
    "water": { symbol: "◎", name: "Atl", meaning: "Water", pronunciation: "Ahtl", description: "Essential element of life, associated with Tlaloc and purification rituals." },
    "fire": { symbol: "◈", name: "Tletl", meaning: "Fire", pronunciation: "Tle-tl", description: "Sacred fire that connects the human world with the divine." },
    "wind": { symbol: "◊", name: "Ehecatl", meaning: "Wind", pronunciation: "Eh-heh-kahl", description: "The wind god, associated with breath, life, and transformation." }
};

function getGlyphSymbol(key) {
    const glyph = glyphDictionary[key];
    return glyph ? glyph.symbol : '?';
}

function initializeGlyphTooltips() {
    const tooltip = document.getElementById('glyph-tooltip');
    if (!tooltip) return;
    
    // Add listeners to all elements with data-glyph attribute
    document.querySelectorAll('[data-glyph]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('blur', hideTooltip);
    });
    
    // Close tooltip on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideTooltip();
        }
    });
}

function showTooltip(e) {
    const element = e.currentTarget;
    const glyphKey = element.dataset.glyph;
    const glyphData = glyphDictionary[glyphKey];
    
    if (!glyphData) return;
    
    const tooltip = document.getElementById('glyph-tooltip');
    const tooltipGlyph = tooltip.querySelector('.tooltip-glyph');
    const tooltipName = tooltip.querySelector('.tooltip-name');
    const tooltipMeaning = tooltip.querySelector('.tooltip-meaning');
    const tooltipDescription = tooltip.querySelector('.tooltip-description');
    const tooltipPronunciation = tooltip.querySelector('.tooltip-pronunciation');
    
    tooltipGlyph.textContent = glyphData.symbol;
    tooltipName.textContent = glyphData.name;
    tooltipMeaning.textContent = glyphData.meaning;
    tooltipDescription.textContent = glyphData.description;
    tooltipPronunciation.textContent = `Pronunciation: ${glyphData.pronunciation}`;
    
    // Position tooltip near mouse/focus
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.bottom + 10;
    
    // Ensure tooltip stays within viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = rect.top - tooltipRect.height - 10;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('visible');
}

function hideTooltip() {
    const tooltip = document.getElementById('glyph-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

function attachGlyphListeners(container) {
    container.querySelectorAll('[data-glyph]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

// ==========================================
// ECLIPSE COUNTDOWN
// ==========================================

function initializeEclipseCountdown() {
    // Set a future date for the blood eclipse (3 months from now)
    const now = new Date();
    const eclipseDate = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
    eclipseDate.setHours(23, 59, 59, 999);
    
    // Display the date
    const dateDisplay = document.getElementById('eclipse-date');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = eclipseDate.toLocaleDateString('en-US', options);
    }
    
    // Start countdown
    updateEclipseCountdown(eclipseDate);
    setInterval(() => updateEclipseCountdown(eclipseDate), 1000);
}

function updateEclipseCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        // Eclipse has arrived!
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ==========================================
// CALENDAR ROUND CALCULATION
// ==========================================

function initializeCalendarRound() {
    // Calculate current position in the 52-year calendar round
    const now = new Date();
    const dayOfYear = getDayOfYear(now);
    const tzolkinDay = dayOfYear % 13;
    const tzolkinSign = dayOfYear % 20;
    
    state.calendarRound.tzolkin.day = tzolkinDay + 1;
    state.calendarRound.tzolkin.sign = tzolkinSign;
    
    // Update display
    const tzolkinName = tonalpohualli[tzolkinSign].name;
    document.getElementById('calendar-round').textContent = 
        `${tzolkinDay + 1} ${tzolkinName}`;
    
    // Calculate next tribute date
    calculateNextTribute();
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function calculateNextTribute() {
    // For demo, set next tribute to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const options = { month: 'short', day: 'numeric' };
    const nextDate = tomorrow.toLocaleDateString('en-US', options);
    
    const nextTributeElement = document.getElementById('next-tribute-date');
    if (nextTributeElement) {
        nextTributeElement.textContent = nextDate;
    }
}

// ==========================================
// ANIMATIONS & EFFECTS
// ==========================================

function initializeAnimations() {
    // Stagger entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all animate-on-scroll elements
    document.querySelectorAll('.ritual-item, .event-item, .deity-card, .tribute-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Parallax effect on hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        }
    });
}

// ==========================================
// ACCESSIBILITY HELPERS
// ==========================================

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap;
        border: 0;
    `;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

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

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

document.addEventListener('keydown', (e) => {
    const wheel = document.getElementById('calendar-wheel');
    if (!wheel) return;
    
    // Wheel rotation with arrow keys when focused
    if (document.activeElement === wheel) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            state.wheelRotation = (state.wheelRotation + 18) % 360;
            updateWheelRotation();
            const newIndex = (20 - Math.round(state.wheelRotation / 18)) % 20;
            selectDaySign(newIndex);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            state.wheelRotation = (state.wheelRotation - 18 + 360) % 360;
            updateWheelRotation();
            const newIndex = (20 - Math.round(state.wheelRotation / 18)) % 20;
            selectDaySign(newIndex);
        }
    }
    
    // Panel navigation with number keys
    if (e.key >= '1' && e.key <= '4') {
        const panelIndex = parseInt(e.key) - 1;
        const panels = ['rituals', 'astronomy', 'deities', 'tribute'];
        if (panels[panelIndex]) {
            switchPanel(panels[panelIndex]);
        }
    }
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Lazy load heavy animations
const lazyAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (el.classList.contains('deity-card')) {
                el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.deity-card').forEach(card => {
    lazyAnimationObserver.observe(card);
});

// ==========================================
// CONSOLE EASTER EGG
// ==========================================

console.log(`
%c☼═══════════════════════════════════════════════════════☼
%c  SACRED CALENDAR OF THE FIFTH SUN
%c  Aztec-Mayan Cosmological Interface
%c  Designed with Obsidian & Jade
%c☼═══════════════════════════════════════════════════════☼
%c
%c  The current day in the Tonalpohualli is:
%c  ${tonalpohualli[state.selectedDaySign].name} - ${tonalpohualli[state.selectedDaySign].meaning}
%c
%c  Pronunciation: ${tonalpohualli[state.selectedDaySign].pronunciation}
%c
%c  Remember: The gods demand remembrance,
%c  and time flows like jade through stone fingers.
%c
%c☼═══════════════════════════════════════════════════════☼
`,
'color: #d4af37; font-weight: bold;',
'color: #1a8f6e;',
'color: #f5deb3;',
'color: #d4af37;',
'color: #1a8f6e;',
'color: #f5deb3;',
'color: #f5deb3; font-size: 1.2em;',
'color: #d4af37; font-weight: bold;',
'color: #f5deb3; font-style: italic;',
'color: #f5deb3;',
'color: #1a8f6e; font-weight: bold;'
);