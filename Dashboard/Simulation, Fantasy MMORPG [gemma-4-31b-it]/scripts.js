/**
 * OMNISCIENCE CODEX - CORE ENGINE
 * Simulation Logic for World Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initEventFeed();
    initMapInteractions();
    initEconomyTicker();
    initChronosWheel();
});

/**
 * REAL-TIME WORLD CLOCK
 * Simulates a high-precision server clock
 */
function initClock() {
    const clockElement = document.getElementById('real-time-clock');
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
        clockElement.textContent = timeString;
        
        // Subtle flicker effect every few seconds to simulate data refresh
        if (Math.random() > 0.98) {
            clockElement.style.opacity = '0.5';
            setTimeout(() => clockElement.style.opacity = '1', 50);
        }
    }
    
    setInterval(updateClock, 1000);
    updateClock();
}

/**
 * DYNAMIC EVENT FEED
 * Generates "fake" game events to create the illusion of a massive world
 */
function initEventFeed() {
    const feed = document.getElementById('event-feed');
    const eventTemplates = [
        { msg: "Player [Xenon_99] discovered a Hidden Vault in Sector 4", type: "INFO" },
        { msg: "Territory War started: Solaris vs Lunar Hegemony", type: "WARN" },
        { msg: "World Boss [Void Hydra] has awakened in the Abyssal Rift", type: "CRIT" },
        { msg: "Market Shift: Mythril prices dropping rapidly", type: "INFO" },
        { msg: "Guild [DragonSlayers] has captured the Ivory Citadel", type: "INFO" },
        { msg: "System: Mana instability detected in the Southern Isles", type: "WARN" },
        { msg: "Player [Luna_Moon] reached Level 100 (First in Server)", type: "INFO" },
        { msg: "Raid Wipe: [VoidWalkers] failed at the 6th boss of Spire", type: "INFO" },
        { msg: "Illegal trade detected in the Shadow Market", type: "WARN" },
    ];

    function addEvent() {
        const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        eventDiv.innerHTML = `<span style="color: var(--text-dim)">[${timestamp}]</span> <span style="color: ${template.type === 'WARN' ? 'var(--blood-ruby)' : 'var(--mana-blue)'}">${template.type}</span> ${template.msg}`;
        
        feed.prepend(eventDiv);
        
        // Keep the feed dense but performant
        if (feed.children.length > 20) {
            feed.removeChild(feed.lastChild);
        }
    }

    // Initial population
    for(let i=0; i<10; i++) addEvent();
    
    // Random intervals for organic feel
    const scheduleNext = () => {
        setTimeout(() => {
            addEvent();
            scheduleNext();
        }, Math.random() * 3000 + 1000);
    };
    scheduleNext();
}

/**
 * INTERACTIVE MAP COORDINATES
 * Updates coordinates based on mouse position over the map
 */
function initMapInteractions() {
    const map = document.getElementById('world-map');
    const readout = document.querySelector('.coord-readout');

    map.addEventListener('mousemove', (e) => {
        const rect = map.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 1000).toFixed(3);
        const y = ((e.clientY - rect.top) / rect.height * 1000).toFixed(3);
        const z = (Math.sin(Date.now() / 1000) * 10).toFixed(2); // Simulated depth fluctuation
        
        readout.textContent = `X: ${x} // Y: ${y} // Z: ${z}`;
    });
}

/**
 * ECONOMY TICKER SIMULATION
 * Randomly fluctuates the trends in the bottom bar
 */
function initEconomyTicker() {
    const items = document.querySelectorAll('.market-item');
    
    function fluctuate() {
        items.forEach(item => {
            if (Math.random() > 0.7) {
                const trendSpan = item.querySelector('.trend');
                const rand = Math.random();
                
                if (rand > 0.6) {
                    trendSpan.className = 'trend up';
                    trendSpan.textContent = `📈 ${(Math.random() * 5).toFixed(1)}%`;
                } else if (rand > 0.3) {
                    trendSpan.className = 'trend down';
                    trendSpan.textContent = `📉 ${(Math.random() * 5).toFixed(1)}%`;
                } else {
                    trendSpan.className = 'trend stable';
                    trendSpan.textContent = `➖ 0.0%`;
                }
            }
        });
    }
    
    setInterval(fluctuate, 4000);
}

/**
 * CHRONOS WHEEL & WEATHER
 * Updates the weather based on the rotating wheel's position
 */
function initChronosWheel() {
    const weatherText = document.getElementById('current-weather-text');
    const weatherEffects = [
        { name: "Mana Storm", effect: "-10% Spell Cast Time" },
        { name: "Solar Flare", effect: "+15% Fire Damage" },
        { name: "Void Mist", effect: "Reduced Visibility / Stealth Up" },
        { name: "Celestial Rain", effect: "+20% Mana Regeneration" },
        { name: "Iron Wind", effect: "Increased Physical Defense" },
        { name: "Blood Moon", effect: "Aggressive NPC Behavior" }
    ];

    function updateWeather() {
        const weather = weatherEffects[Math.floor(Math.random() * weatherEffects.length)];
        weatherText.textContent = weather.name;
        document.querySelector('.weather-effect').textContent = `Effect: ${weather.effect}`;
    }

    // Change weather every 15 seconds
    setInterval(updateWeather, 15000);
    updateWeather();
}