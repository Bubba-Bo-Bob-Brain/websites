/**
 * TEOTL | The Obsidian Chronos
 * Ceremonial Calendar Interface Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initNavigation();
    initCeremonialTimer();
    initCalendarWheel();
    initTooltips();
    initDeityInteractions();
});

/* =========================================
   1. CUSTOM CURSOR SYSTEM
   Enhances the tactile feel of the interface.
   ========================================= */
function initCustomCursor() {
    const cursor = document.getElementById('cursor-follower');
    const interactiveElements = document.querySelectorAll('button, a, .deity-card, .control-btn, input[type="checkbox"]');

    // Move cursor
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effects
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

/* =========================================
   2. NAVIGATION MANAGER
   Handles view switching with ceremonial transitions.
   ========================================= */
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and views
            navBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding view
            const targetView = document.getElementById(`view-${btn.dataset.view}`);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });

    // Set default active state
    const defaultBtn = document.querySelector('.nav-btn[data-view="calendar"]');
    if (defaultBtn) defaultBtn.click();
}

/* =========================================
   3. CEREMONIAL TIMER (ECLIPSE COUNTDOWN)
   Calculates time to next simulated astronomical event.
   ========================================= */
function initCeremonialTimer() {
    const daysEl = document.getElementById('days-left');
    const hoursEl = document.getElementById('hours-left');
    const minsEl = document.getElementById('mins-left');
    const prophecyEl = document.getElementById('prophecy-text');
    const moonPhaseEl = document.getElementById('moon-phase-text');

    const prophecies = [
        "The wind carries whispers of change.",
        "Shadows lengthen before the dawn.",
        "The jaguar stalks silently in the night.",
        "Offerings of maize please the earth.",
        "The stars align for a great journey."
    ];

    const moonPhases = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];

    // Set a random future date for the "Next Eclipse" (3 to 30 days from now)
    const now = new Date();
    const nextEvent = new Date(now.getTime() + Math.random() * (2592000000 - 259200000) + 259200000); 

    // Set random prophecy
    prophecyEl.textContent = prophecies[Math.floor(Math.random() * prophecies.length)];
    
    // Set random moon phase
    moonPhaseEl.textContent = moonPhases[Math.floor(Math.random() * moonPhases.length)];

    function updateTimer() {
        const currentTime = new Date().getTime();
        const distance = nextEvent.getTime() - currentTime;

        if (distance < 0) {
            // Reset if passed (for demo purposes)
            nextEvent.setTime(nextEvent.getTime() + 86400000); 
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minsEl.textContent = minutes.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}

/* =========================================
   4. CALENDAR WHEEL LOGIC (TONALPOHUALLI)
   Simulates the 260-day sacred cycle.
   ========================================= */
function initCalendarWheel() {
    const dayNames = [
        "Cipactli (Crocodile)", "Ehecatl (Wind)", "Calli (House)", "Cuetzpalin (Lizard)", 
        "Coatl (Serpent)", "Miquiztli (Death)", "Mazatl (Deer)", "Tochtli (Rabbit)", 
        "Atl (Water)", "Itzcuintli (Dog)", "Ozomatli (Monkey)", "Malinalli (Grass)", 
        "Acatl (Reed)", "Ocelotl (Jaguar)", "Cuauhtli (Eagle)", "Cozcacuauhtli (Vulture)", 
        "Ollin (Movement)", "Tecpatl (Flint)", "Quiahuitl (Rain)", "Xochitl (Flower)"
    ];

    const godNames = [
        "Ometecuhtli", "Quetzalcoatl", "Tezcatlipoca", "Huitzilopochtli", 
        "Tlaloc", "Mictlantecuhtli", "Xipe Totec", "Mayahuel", 
        "Chalchiuhtlicue", "Xolotl", "Tlazolteotl", "Patecatl", 
        "Tezcatlipoca", "Tlazolteotl", "Xipe Totec", "Itzpapalotl", 
        "Xolotl", "Tlazolteotl", "Chicomecoatl", "Xochiquetzal"
    ];

    let currentDayIndex = 0;
    const totalDays = 260;

    const dayDisplay = document.getElementById('current-day-name');
    const godDisplay = document.getElementById('current-god-name');
    const ritualType = document.getElementById('ritual-type');
    const statusIndicator = document.querySelector('.status-indicator');
    const prevBtn = document.getElementById('prev-day');
    const nextBtn = document.getElementById('next-day');
    const wheelOuter = document.querySelector('.wheel-outer-ring');
    const wheelInner = document.querySelector('.wheel-inner-ring');

    function updateDisplay() {
        // Calculate names based on 20-day and 13-number cycles (simplified for demo)
        const dayName = dayNames[currentDayIndex % dayNames.length];
        const godName = godNames[currentDayIndex % godNames.length];
        
        dayDisplay.textContent = dayName.split(' ')[0]; // Show just the Nahuatl name
        godDisplay.textContent = godName;

        // Determine Ritual Status (Randomized for effect)
        const statuses = [
            { text: "Auspicious", color: "#00a86b" }, // Jade
            { text: "Neutral", color: "#d4af37" },    // Gold
            { text: "Inauspicious", color: "#8a0303" } // Blood
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        ritualType.textContent = status.text;
        ritualType.style.color = status.color;
        statusIndicator.style.backgroundColor = status.color;
        statusIndicator.style.boxShadow = `0 0 10px ${status.color}`;

        // Rotate wheels visually
        const rotationStep = 360 / 20; // 20 markers
        wheelOuter.style.transform = `rotate(${currentDayIndex * rotationStep}deg)`;
        wheelInner.style.transform = `rotate(-${currentDayIndex * (rotationStep + 10)}deg)`;
    }

    prevBtn.addEventListener('click', () => {
        currentDayIndex = (currentDayIndex - 1 + totalDays) % totalDays;
        updateDisplay();
    });

    nextBtn.addEventListener('click', () => {
        currentDayIndex = (currentDayIndex + 1) % totalDays;
        updateDisplay();
    });

    // Initial setup
    updateDisplay();
    
    // Generate static markers for the rings
    function generateMarkers() {
        const outerContainer = document.getElementById('day-markers');
        const innerContainer = document.getElementById('god-markers');
        const count = 20;
        
        for(let i=0; i<count; i++) {
            // Outer markers
            const marker = document.createElement('div');
            marker.className = `marker ${i % 5 === 0 ? 'major' : ''}`;
            marker.style.transform = `translate(-50%, -100%) rotate(${i * (360/count)}deg) translateY(-50%)`; // Position on circle
            // Note: CSS positioning is tricky for dynamic rings, using simplified CSS rotation in updateDisplay instead
            // But we add the visual dots here
            const dot = document.createElement('div');
            dot.className = `marker ${i % 5 === 0 ? 'major' : ''}`;
            dot.style.position = 'absolute';
            dot.style.top = '0';
            dot.style.left = '50%';
            dot.style.transformOrigin = '50% 300px'; // Radius of outer ring
            dot.style.transform = `rotate(${i * (360/count)}deg)`;
            outerContainer.appendChild(dot);

            // Inner markers
            const dotInner = document.createElement('div');
            dotInner.className = `marker ${i % 4 === 0 ? 'major' : ''}`;
            dotInner.style.position = 'absolute';
            dotInner.style.top = '0';
            dotInner.style.left = '50%';
            dotInner.style.transformOrigin = '50% 200px'; // Radius of inner ring
            dotInner.style.transform = `rotate(${i * (360/count)}deg)`;
            innerContainer.appendChild(dotInner);
        }
    }
    generateMarkers();
}

/* =========================================
   5. TOOLTIP SYSTEM
   Translates glyphs on hover.
   ========================================= */
function initTooltips() {
    const tooltip = document.getElementById('glyph-tooltip');
    const titleEl = document.getElementById('tooltip-title');
    const descEl = document.getElementById('tooltip-desc');
    
    // Elements that trigger tooltips
    const targets = document.querySelectorAll('.deity-icon, .central-glyph, .glyph');

    targets.forEach(target => {
        target.addEventListener('mouseenter', (e) => {
            const text = target.getAttribute('data-tooltip') || "Ancient Symbol";
            const desc = target.getAttribute('data-desc') || "A symbol of power from the old world.";
            
            titleEl.textContent = text;
            descEl.textContent = desc;
            
            tooltip.classList.remove('hidden');
            // Position handled by CSS mostly, but we can update content dynamically
        });

        target.addEventListener('mouseleave', () => {
            tooltip.classList.add('hidden');
        });
        
        target.addEventListener('mousemove', (e) => {
             tooltip.style.left = e.clientX + 'px';
             tooltip.style.top = e.clientY + 'px';
        });
    });
}

/* =========================================
   6. DEITY INTERACTIONS
   Simple interaction for the deity cards.
   ========================================= */
function initDeityInteractions() {
    const invokeBtns = document.querySelectorAll('.invoke-btn');
    
    invokeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.deity-card');
            const deityName = card.querySelector('h3').textContent;
            
            // Visual feedback
            this.textContent = "Invoking...";
            this.style.borderColor = "#00a86b";
            
            setTimeout(() => {
                alert(`The spirits of ${deityName} acknowledge your presence. The path is clear.`);
                this.textContent = "Consult Oracle";
                this.style.borderColor = "";
            }, 1000);
        });
    });
}