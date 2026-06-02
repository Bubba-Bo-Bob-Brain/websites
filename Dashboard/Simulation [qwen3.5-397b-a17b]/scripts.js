/* scripts.js */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & STATE ---
    const state = {
        population: 8123441092,
        startTime: Date.now(),
        co2Level: 0.041,
        temp: 14.8,
        seismicActivity: 2.1,
        resources: {
            oil: 98,
            energy: 40,
            food: 92,
            water: 20
        }
    };

    // --- DOM ELEMENTS ---
    const els = {
        clock: document.getElementById('universal-clock'),
        uptime: document.getElementById('uptime'),
        popCounter: document.getElementById('pop-counter'),
        tectonicFeed: document.getElementById('tectonic-feed'),
        eventTicker: document.getElementById('event-ticker'),
        co2Val: document.querySelector('.atmosphere .bar-list li:nth-child(4) .bar-fill'),
        co2Text: document.querySelector('.atmosphere .bar-list li:nth-child(4) span:last-child'),
        seismicVal: document.querySelector('.tectonics .value.danger'),
        oilBar: document.querySelector('.res-row:nth-child(1) .res-bar'),
        waterBar: document.querySelector('.res-row:nth-child(4) .res-bar'),
        waterText: document.querySelector('.res-row:nth-child(4) span:last-child')
    };

    // --- UTILITIES ---
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);
    const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // --- CORE FUNCTIONS ---

    // 1. Time & Uptime
    function updateClock() {
        const now = new Date();
        els.clock.textContent = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
        
        const diff = Date.now() - state.startTime;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        const ms = Math.floor(diff % 1000);
        
        els.uptime.textContent = `${days}d ${hours}h ${mins}m ${secs}s:${ms}`;
    }

    // 2. Population Growth Simulation
    function updatePopulation() {
        // Approximate global birth rate simulation (roughly 4.3 births per second globally)
        // We add a random chunk to make it look busy
        state.population += randomInt(3, 6); 
        els.popCounter.textContent = formatNumber(state.population);
    }

    // 3. Tectonic & Atmospheric Simulation
    function simulateGeophysics() {
        // Seismic Jitter
        const seismic = randomFloat(1.5, 7.5);
        els.seismicVal.textContent = seismic > 6.0 ? `⚠️ ${seismic}` : seismic;
        els.seismicVal.style.color = seismic > 6.0 ? 'var(--color-danger)' : 'var(--color-text)';

        // CO2 Jitter
        state.co2Level += randomFloat(-0.001, 0.002);
        if(state.co2Level < 0.040) state.co2Level = 0.040;
        els.co2Text.textContent = state.co2Level.toFixed(3) + '%';
        
        // Visual warning for high CO2
        if(state.co2Level > 0.045) {
            els.co2Val.classList.add('danger');
            els.co2Text.classList.add('danger');
        }
    }

    // 4. Resource Simulation
    function simulateResources() {
        // Oil fluctuates
        state.resources.oil += randomFloat(-0.5, 0.5);
        els.oilBar.style.width = `${state.resources.oil}%`;

        // Water critical level logic
        state.resources.water += randomFloat(-0.1, 0.05);
        if(state.resources.water < 15) state.resources.water = 15; // Floor
        els.waterBar.style.width = `${state.resources.water}%`;
        
        if(state.resources.water < 25) {
            els.waterText.textContent = "CRITICAL";
            els.waterText.classList.add('danger');
        }
    }

    // 5. Log Generator (Tectonic Feed)
    const tectonicEvents = [
        "Minor shift detected in Pacific Plate",
        "Magma pressure rising: Zone 4B",
        "Subduction zone activity normalizing",
        "Micro-tremor recorded: Chilean Coast",
        "Mantle plume stability: 98%",
        "Crustal deformation detected: Himalayas",
        "Volcanic gas emission spike: Mt. Etna",
        "Seismic gap filling: Alaska Region"
    ];

    function addTectonicLog() {
        const event = tectonicEvents[randomInt(0, tectonicEvents.length - 1)];
        const time = new Date().toISOString().split('T')[1].split('.')[0];
        
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<span class="time">${time}</span> <span class="msg">${event}</span>`;
        
        els.tectonicFeed.prepend(div);
        
        // Keep list short
        if(els.tectonicFeed.children.length > 6) {
            els.tectonicFeed.lastElementChild.remove();
        }
    }

    // 6. Global Event Ticker Generator
    const globalEvents = [
        "🚀 LAUNCH: Satellite cluster deployed over Pacific",
        "🌋 ALERT: Minor eruption detected in Iceland",
        "📈 MARKET: Rare earth metals surge 4%",
        "🌪️ WEATHER: Cyclone forming near Philippines",
        "🔬 DISCOVERY: New deep-sea species identified",
        "⚡ GRID: Solar output peak recorded in Sahara",
        "🚢 TRADE: Container ship delay in Suez Canal",
        "🌾 AGRI: Wheat harvest yields up 2% in Ukraine",
        "🏙️ URBAN: Megacity project 'Neo-Tokyo' phase 2 complete",
        "🦠 BIO: New vaccine strain distributed to Sector 7",
        "🌊 OCEAN: Plastic cleanup drone swarm activated",
        "❄️ ARCTIC: Ice shelf calving event monitored"
    ];

    function refreshTicker() {
        // Duplicate the content to ensure seamless loop illusion if needed, 
        // but here we just randomly swap items occasionally to keep it fresh
        const items = els.eventTicker.querySelectorAll('.ticker-item');
        if(Math.random() > 0.7) { // 30% chance to swap an item
            const target = items[randomInt(0, items.length - 1)];
            const newEvent = globalEvents[randomInt(0, globalEvents.length - 1)];
            target.textContent = newEvent;
        }
    }

    // --- INITIALIZATION ---
    
    // Run clocks immediately
    updateClock();
    
    // Set Intervals
    setInterval(updateClock, 1000);
    setInterval(updatePopulation, 1000); // Every second
    setInterval(simulateGeophysics, 2000); // Every 2 seconds
    setInterval(simulateResources, 3000); // Every 3 seconds
    setInterval(addTectonicLog, 4500); // Every 4.5 seconds
    setInterval(refreshTicker, 5000); // Every 5 seconds

    // Initial population set
    els.popCounter.textContent = formatNumber(state.population);
    
    // Add initial logs
    for(let i=0; i<4; i++) addTectonicLog();
});