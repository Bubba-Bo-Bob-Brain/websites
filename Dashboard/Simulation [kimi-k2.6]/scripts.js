// ═══════════════════════════════════════════════════════════════════════
// TERRA-NOVA :: PLANETARY OPERATIONS COMMAND — SYSTEMS ONLINE
// Real-time data simulation and interface dynamics
// ═══════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ─── CONFIGURATION ─────────────────────────────────────────────────
    const CONFIG = {
        updateInterval: 100,        // Base tick rate (ms)
        populationGrowthRate: 2.5,  // People per second
        clockStart: Date.now(),
        simulationSpeed: 1,
    };

    // ─── STATE ─────────────────────────────────────────────────────────
    const state = {
        population: 8247892341,
        frameCount: 1847293,
        cpuUsage: 12.4,
        memoryUsage: 4.7,
        networkDown: 847,
        networkUp: 234,
        dbLatency: 0.4,
        renderTime: 16.67,
        fps: 60,
        activeAlerts: 6,
        alertIndex: 0,
    };

    // ─── DOM REFERENCES ──────────────────────────────────────────────
    const DOM = {};

    function cacheDOM() {
        DOM.universalClock = document.getElementById('universal-clock');
        DOM.populationCounter = document.getElementById('population-counter');
        DOM.cpuUsage = document.getElementById('cpu-usage');
        DOM.memUsage = document.getElementById('mem-usage');
        DOM.netUsage = document.getElementById('net-usage');
        DOM.dbLatency = document.getElementById('db-latency');
        DOM.renderTime = document.getElementById('render-time');
        DOM.fpsCounter = document.getElementById('fps-counter');
        DOM.frameCounter = document.getElementById('frame-counter');
        DOM.systemStatus = document.getElementById('system-status');
        DOM.tickerContent = document.getElementById('ticker-content');
        DOM.seismicMap = document.getElementById('seismic-map');
        DOM.planetGlobe = document.getElementById('planet-globe');
        DOM.magField = document.getElementById('mag-field');
        DOM.thermohaline = document.getElementById('thermohaline');
        DOM.cycloneList = document.getElementById('cyclone-list');
        DOM.severeList = document.getElementById('severe-list');
        DOM.orbitalTracks = document.getElementById('orbital-tracks');
        DOM.tradeRoutes = document.getElementById('trade-routes');
        DOM.siFeed = document.getElementById('si-feed');
    }

    // ─── UTILITY FUNCTIONS ────────────────────────────────────────────
    function pad(n, width = 2) {
        return String(n).padStart(width, '0');
    }

    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomInRange(min, max + 1));
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // ─── CLOCK & TIMING ──────────────────────────────────────────────
    function updateClock() {
        const now = new Date();
        const elapsed = Date.now() - CONFIG.clockStart;
        const days = Math.floor(elapsed / 86400000);
        const hours = Math.floor((elapsed % 86400000) / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timeStr = `T+ ${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        
        if (DOM.universalClock) {
            DOM.universalClock.textContent = timeStr;
        }
    }

    // ─── POPULATION SIMULATION ────────────────────────────────────────
    function updatePopulation() {
        state.population += CONFIG.populationGrowthRate * (CONFIG.updateInterval / 1000);
        
        if (DOM.populationCounter) {
            DOM.populationCounter.textContent = formatNumber(Math.floor(state.population));
        }
    }

    // ─── SYSTEM METRICS SIMULATION ───────────────────────────────────
    function updateSystemMetrics() {
        // Simulate realistic fluctuation
        state.cpuUsage = clamp(state.cpuUsage + randomInRange(-0.8, 0.8), 5, 45);
        state.memoryUsage = clamp(state.memoryUsage + randomInRange(-0.05, 0.05), 3, 16);
        state.networkDown = clamp(state.networkDown + randomInt(-15, 15), 400, 1200);
        state.networkUp = clamp(state.networkUp + randomInt(-5, 5), 100, 400);
        state.dbLatency = clamp(state.dbLatency + randomInRange(-0.05, 0.05), 0.1, 2.0);
        state.renderTime = clamp(state.renderTime + randomInRange(-0.5, 0.5), 12, 22);
        state.fps = Math.round(1000 / state.renderTime);
        state.frameCount++;

        if (DOM.cpuUsage) {
            DOM.cpuUsage.textContent = `${state.cpuUsage.toFixed(1)}%`;
            // Color code based on load
            DOM.cpuUsage.style.color = state.cpuUsage > 35 ? 'var(--red)' : 
                                       state.cpuUsage > 20 ? 'var(--amber)' : 'var(--green)';
        }
        
        if (DOM.memUsage) {
            DOM.memUsage.textContent = `${state.memoryUsage.toFixed(1)}/32 GB`;
        }
        
        if (DOM.netUsage) {
            DOM.netUsage.textContent = `↓${state.networkDown} MB/s ↑${state.networkUp} MB/s`;
        }
        
        if (DOM.dbLatency) {
            DOM.dbLatency.textContent = `${state.dbLatency.toFixed(1)}ms`;
        }
        
        if (DOM.renderTime) {
            DOM.renderTime.textContent = `${state.renderTime.toFixed(2)}ms`;
        }
        
        if (DOM.fpsCounter) {
            DOM.fpsCounter.textContent = state.fps;
        }
        
        if (DOM.frameCounter) {
            DOM.frameCounter.textContent = formatNumber(state.frameCount);
        }
    }

    // ─── TICKER ANIMATION ────────────────────────────────────────────
    let tickerOffset = 0;
    
    function updateTicker() {
        if (!DOM.tickerContent) return;
        
        tickerOffset -= 0.5;
        const items = DOM.tickerContent.querySelectorAll('.ticker-item');
        const totalWidth = Array.from(items).reduce((sum, item) => sum + item.offsetWidth + 32, 0);
        
        if (Math.abs(tickerOffset) > totalWidth / 2) {
            tickerOffset = 0;
        }
        
        DOM.tickerContent.style.transform = `translateX(${tickerOffset}px)`;
    }

    // ─── SEISMIC ACTIVITY SIMULATION ─────────────────────────────────
    function updateSeismicActivity() {
        const stations = document.querySelectorAll('.seismic-station');
        
        stations.forEach(station => {
            // Randomly trigger station pulses
            if (Math.random() < 0.02) {
                station.style.animationDuration = `${randomInRange(0.3, 2)}s`;
            }
        });

        // Update reading bars with slight variations
        const bars = document.querySelectorAll('.r-fill');
        bars.forEach(bar => {
            if (Math.random() < 0.1) {
                const currentWidth = parseFloat(bar.style.getPropertyValue('--level') || '50');
                const newWidth = clamp(currentWidth + randomInRange(-5, 5), 0, 100);
                bar.style.setProperty('--level', `${newWidth}%`);
            }
        });
    }

    // ─── VOLCANIC ACTIVITY ───────────────────────────────────────────
    function updateVolcanicActivity() {
        const gauges = document.querySelectorAll('.v-gauge-fill');
        gauges.forEach(gauge => {
            if (Math.random() < 0.05) {
                const currentLevel = parseFloat(gauge.style.getPropertyValue('--level') || '50');
                const newLevel = clamp(currentLevel + randomInRange(-3, 3), 0, 100);
                gauge.style.setProperty('--level', `${newLevel}%`);
            }
        });
    }

    // ─── OCEAN DATA SIMULATION ─────────────────────────────────────
    function updateOceanData() {
        const temps = document.querySelectorAll('.os-temp');
        temps.forEach(temp => {
            if (Math.random() < 0.05) {
                const match = temp.textContent.match(/(-?\d+\.\d+)/);
                if (match) {
                    const current = parseFloat(match[1]);
                    const newTemp = (current + randomInRange(-0.1, 0.1)).toFixed(1);
                    temp.textContent = temp.textContent.replace(/-?\d+\.\d+/, newTemp);
                }
            }
        });
    }

    // ─── BIOME HEALTH UPDATES ────────────────────────────────────────
    function updateBiomeHealth() {
        const metrics = document.querySelectorAll('.bm-value');
        metrics.forEach(metric => {
            if (Math.random() < 0.03) {
                const currentText = metric.textContent;
                const match = currentText.match(/[\d,.]+/);
                if (match) {
                    const current = parseFloat(match[0].replace(/,/g, ''));
                    const change = randomInRange(-0.5, 0.5);
                    const newValue = (current + change).toFixed(currentText.includes('.') ? 1 : 0);
                    metric.textContent = currentText.replace(/[\d,.]+/, formatNumber(parseFloat(newValue)));
                }
            }
        });
    }

    // ─── ORBITAL SATELLITE ANIMATION ─────────────────────────────────
    function updateOrbitalTracks() {
        const dots = document.querySelectorAll('.sat-dot');
        dots.forEach(dot => {
            const currentPhase = parseFloat(dot.style.getPropertyValue('--phase') || '0');
            const newPhase = (currentPhase + 0.001) % 1;
            dot.style.setProperty('--phase', newPhase);
        });
    }

    // ─── PLANET GLOBE ROTATION ──────────────────────────────────────
    let globeRotation = 0;

    function updatePlanetGlobe() {
        globeRotation += 0.02;
        if (DOM.planetGlobe) {
            DOM.planetGlobe.style.backgroundPosition = `${globeRotation}% 0%`;
        }
    }

    // ─── MAGNETOSPHERE ANIMATION ─────────────────────────────────────
    let magPhase = 0;

    function updateMagnetosphere() {
        magPhase += 0.05;
        if (DOM.magField) {
            const scale = 1 + Math.sin(magPhase) * 0.05;
            DOM.magField.style.transform = `scale(${scale})`;
            DOM.magField.style.opacity = 0.7 + Math.sin(magPhase * 2) * 0.2;
        }
    }

    // ─── CLIMATE DATA UPDATES ────────────────────────────────────────
    function updateClimateData() {
        const fills = document.querySelectorAll('.cz-fill');
        fills.forEach(fill => {
            if (Math.random() < 0.02) {
                const currentWidth = parseFloat(fill.style.getPropertyValue('--width') || '50');
                const newWidth = clamp(currentWidth + randomInRange(-1, 1), 5, 95);
                fill.style.setProperty('--width', `${newWidth}%`);
            }
        });
    }

    // ─── CYCLONE TRACKING UPDATES ────────────────────────────────────
    function updateCycloneData() {
        const windSpeeds = document.querySelectorAll('.cy-wind');
        windSpeeds.forEach(wind => {
            if (Math.random() < 0.05) {
                const match = wind.textContent.match(/(\d+)/);
                if (match) {
                    const current = parseInt(match[1]);
                    const newSpeed = clamp(current + randomInt(-5, 5), 50, 300);
                    wind.textContent = `${newSpeed} km/h`;
                }
            }
        });

        const pressures = document.querySelectorAll('.cy-pressure');
        pressures.forEach(pressure => {
            if (Math.random() < 0.05) {
                const match = pressure.textContent.match(/(\d+)/);
                if (match) {
                    const current = parseInt(match[1]);
                    const newPressure = clamp(current + randomInt(-3, 3), 900, 1013);
                    pressure.textContent = `${newPressure} hPa`;
                }
            }
        });
    }

    // ─── SEVERE WEATHER UPDATES ──────────────────────────────────────
    function updateSevereWeather() {
        // Occasionally add new severe weather items
        if (Math.random() < 0.001 && DOM.severeList) {
            const types = ['TORNADO', 'HAILSTORM', 'FLASH FLOOD', 'DUST STORM', 'BLIZZARD', 'WILDFIRE'];
            const locations = ['OKLAHOMA, USA', 'MUNICH, DE', 'MUMBAI, IN', 'SAHARA, MR', 'SIBERIA, RU', 'CALIFORNIA, USA', 'AMAZON, BR'];
            const scales = ['EF3', '6.2cm', 'RED', '1.2km VIS', 'SEVERE', 'EXTREME'];

            const item = document.createElement('div');
            item.className = 'severe-item';
            item.innerHTML = `
                <span class="sv-type">${types[randomInt(0, types.length - 1)]}</span>
                <span class="sv-location">${locations[randomInt(0, locations.length - 1)]}</span>
                <span class="sv-scale">${scales[randomInt(0, scales.length - 1)]}</span>
                <span class="sv-time">T-00:${pad(randomInt(0, 59))}:${pad(randomInt(0, 59))}</span>
            `;
            
            DOM.severeList.insertBefore(item, DOM.severeList.firstChild);
            
            // Keep list manageable
            while (DOM.severeList.children.length > 8) {
                DOM.severeList.removeChild(DOM.severeList.lastChild);
            }
        }
    }

    // ─── TRADE ROUTE PULSE ───────────────────────────────────────────
    function updateTradeRoutes() {
        const pulses = document.querySelectorAll('.route-pulse');
        pulses.forEach(pulse => {
            if (Math.random() < 0.1) {
                pulse.style.animationDuration = `${randomInRange(0.5, 3)}s`;
            }
        });
    }

    // ─── SIGNAL INTELLIGENCE FEED ──────────────────────────────────
    const siPrefixes = ['...COORDINATES CONFIRMED FOR', '...WEATHER PATTERN ANOMALY DETECTED AT', '...ACOUSTIC SIGNATURE MATCH:', '...ANOMALOUS RADIO BURST:', '...TRANSFER AUTHORIZED. PROCEED TO', '...TRAJECTORY DEVIATION NOTED FOR'];
    const siSuffixes = ['RENDEZVOUS...', 'GRID...', 'TANGO-CLASS VESSEL...', 'FRB 2024-07A REPEAT...', 'WAYPOINT...', 'ORBITAL INSERTION...'];

    function updateSignalIntel() {
        if (!DOM.siFeed || Math.random() > 0.02) return;

        const classes = ['CLASS-1', 'CLASS-2', 'CLASS-3', 'CLASS-4'];
        const sources = ['SAT-COM ' + randomInt(7000, 9999), 'HF-ARRAY ' + randomInt(1, 20), 'SUB-ACOUSTIC ' + randomInt(1, 5), 'DEEP-SPACE ARRAY'];
        
        const item = document.createElement('div');
        item.className = 'si-item';
        item.innerHTML = `
            <span class="si-time">T-00:${pad(randomInt(0, 59))}:${pad(randomInt(0, 59))}</span>
            <span class="si-class">${classes[randomInt(0, classes.length - 1)]}</span>
            <span class="si-source">${sources[randomInt(0, sources.length - 1)]}</span>
            <span class="si-text">${siPrefixes[randomInt(0, siPrefixes.length - 1)]} ${siSuffixes[randomInt(0, siSuffixes.length - 1)]}</span>
        `;

        DOM.siFeed.insertBefore(item, DOM.siFeed.firstChild);

        while (DOM.siFeed.children.length > 8) {
            DOM.siFeed.removeChild(DOM.siFeed.lastChild);
        }
    }

    // ─── ENERGY GRID UPDATES ─────────────────────────────────────────
    function updateEnergyGrid() {
        const fills = document.querySelectorAll('.ems-fill');
        fills.forEach(fill => {
            if (Math.random() < 0.03) {
                const currentLevel = parseFloat(fill.style.getPropertyValue('--level') || '50');
                const newLevel = clamp(currentLevel + randomInRange(-0.5, 0.5), 0, 100);
                fill.style.setProperty('--level', `${newLevel}`);
            }
        });
    }

    // ─── RICHTER SCALE ANIMATION ────────────────────────────────────
    function updateRichterScale() {
        const segments = document.querySelectorAll('.scale-segment');
        segments.forEach((seg, i) => {
            if (Math.random() < 0.01) {
                seg.classList.toggle('active');
            }
        });
    }

    // ─── MAGMA CHAMBER ANIMATION ────────────────────────────────────
    function updateMagmaChamber() {
        const core = document.querySelector('.chamber-core');
        if (core && Math.random() < 0.05) {
            const hue = randomInt(0, 30);
            core.style.filter = `hue-rotate(${hue}deg)`;
        }
    }

    // ─── INTERACTIVE FEATURES ───────────────────────────────────────
    function initInteractions() {
        // Sector hover effects
        document.querySelectorAll('.sector').forEach(sector => {
            sector.addEventListener('mouseenter', () => {
                sector.style.transform = 'scale(1.2)';
                sector.style.zIndex = '10';
            });
            sector.addEventListener('mouseleave', () => {
                sector.style.transform = '';
                sector.style.zIndex = '';
            });
            sector.addEventListener('click', () => {
                document.querySelectorAll('.sector').forEach(s => s.classList.remove('active'));
                sector.classList.add('active');
            });
        });

        // Seismic station tooltips
        document.querySelectorAll('.seismic-station').forEach(station => {
            station.addEventListener('click', () => {
                const name = station.dataset.name;
                console.log(`Station ${name} selected`);
            });
        });

        // Module expand/collapse
        document.querySelectorAll('.module-expand').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const module = e.target.closest('.module');
                module.classList.toggle('collapsed');
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' && e.ctrlKey) {
                e.preventDefault();
                document.documentElement.requestFullscreen();
            }
        });
    }

    // ─── VISUAL EFFECTS ──────────────────────────────────────────────
    function initVisualEffects() {
        // Subtle noise overlay via canvas (if needed for performance)
        // Using CSS noise for now as specified

        // Glitch effect on title
        const title = document.querySelector('.sys-title');
        if (title) {
            setInterval(() => {
                if (Math.random() < 0.05) {
                    title.style.textShadow = `${randomInt(-2, 2)}px 0 var(--red)`;
                    setTimeout(() => {
                        title.style.textShadow = '';
                    }, 50);
                }
            }, 2000);
        }
    }

    // ─── MAIN UPDATE LOOP ────────────────────────────────────────────
    let lastTime = performance.now();
    let accumulator = 0;

    function update(deltaTime) {
        updateClock();
        updatePopulation();
        updateSystemMetrics();
        updateTicker();
        updateSeismicActivity();
        updateVolcanicActivity();
        updateOceanData();
        updateBiomeHealth();
        updateOrbitalTracks();
        updatePlanetGlobe();
        updateMagnetosphere();
        updateClimateData();
        updateCycloneData();
        updateSevereWeather();
        updateTradeRoutes();
        updateSignalIntel();
        updateEnergyGrid();
        updateRichterScale();
        updateMagmaChamber();
    }

    function loop(currentTime) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        accumulator += deltaTime;

        while (accumulator >= CONFIG.updateInterval) {
            update(CONFIG.updateInterval);
            accumulator -= CONFIG.updateInterval;
        }

        requestAnimationFrame(loop);
    }

    // ─── INITIALIZATION ──────────────────────────────────────────────
    function init() {
        cacheDOM();
        initInteractions();
        initVisualEffects();

        // Initialize dynamic elements
        if (DOM.tickerContent) {
            // Duplicate ticker items for seamless loop
            const items = DOM.tickerContent.innerHTML;
            DOM.tickerContent.innerHTML = items + items;
        }

        // Start the main loop
        requestAnimationFrame(loop);

        // System ready notification
        console.log('%c TERRA-NOVA COMMAND ', 'background: #c9a84c; color: #0a0a0f; font-weight: bold;');
        console.log('%c Planetary Operations Interface Online ', 'color: #4a9a6a;');
        console.log('%c All systems nominal. Awaiting command. ', 'color: #8a7a5a;');

        // Blink system status
        setInterval(() => {
            if (DOM.systemStatus) {
                const current = DOM.systemStatus.textContent;
                DOM.systemStatus.style.opacity = DOM.systemStatus.style.opacity === '0.5' ? '1' : '0.5';
            }
        }, 1000);
    }

    // ─── BOOT SEQUENCE ─────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();