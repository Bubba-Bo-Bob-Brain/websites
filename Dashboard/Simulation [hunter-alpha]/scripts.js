/* ═══════════════════════════════════════════════════════════════════
   PLANETSIM v4.7 — Global Overview Dashboard Scripts
   Real-time simulation data, animations, and interactivity
   ═══════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ── Configuration ──
    const CONFIG = {
        tickRate: 60,
        updateIntervals: {
            clock: 1000,
            vitals: 2000,
            seismic: 5000,
            ticker: 30000,
            sparklines: 100,
            charts: 800,
            memory: 3000,
            uptime: 1000
        },
        population: {
            base: 8045311447,
            ratePerSecond: 2.3,
            jitter: 0.5
        },
        simulation: {
            startTime: Date.now(),
            dayLength: 86400000,
            yearLength: 365.25
        }
    };

    // ── State ──
    const state = {
        simTime: 0,
        simDay: 0,
        simYear: 0,
        population: CONFIG.population.base,
        cpuLoad: 45,
        ramLoad: 2.4,
        uptime: 0,
        chartData: [],
        sparklineProgress: 0
    };

    // ── Utility Functions ──
    function formatNumber(num, decimals = 0) {
        if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
        return num.toFixed(decimals);
    }

    function formatPopulation(num) {
        return num.toLocaleString('en-US');
    }

    function padZero(num, digits = 2) {
        return String(num).padStart(digits, '0');
    }

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomInRange(min, max + 1));
    }

    function jitter(value, amount) {
        return value + (Math.random() - 0.5) * amount;
    }

    // ── UTC Clock ──
    function updateUTCClock() {
        const now = new Date();
        const hours = padZero(now.getUTCHours());
        const mins = padZero(now.getUTCMinutes());
        const secs = padZero(now.getUTCSeconds());
        document.getElementById('utc-clock').textContent = `UTC ${hours}:${mins}:${secs}`;
    }

    // ── Simulation Time ──
    function updateSimTime() {
        state.simTime += 1000;
        
        const totalSeconds = Math.floor(state.simTime / 1000);
        const ms = state.simTime % 1000;
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const mins = Math.floor(totalSeconds / 60) % 60;
        const secs = totalSeconds % 60;
        
        const timeStr = `${padZero(hours)}:${padZero(mins)}:${padZero(secs)}.${padZero(ms, 3)}`;
        document.getElementById('sim-time').textContent = timeStr;
        
        // Update day/year
        state.simDay = Math.floor(state.simTime / CONFIG.simulation.dayLength) + 1;
        state.simYear = Math.floor(state.simDay / CONFIG.simulation.yearLength);
        
        document.getElementById('sim-day').textContent = state.simDay;
        document.getElementById('sim-year').textContent = state.simYear;
    }

    // ── System Stats ──
    function updateSystemStats() {
        // CPU with realistic fluctuation
        state.cpuLoad = Math.max(20, Math.min(95, state.cpuLoad + randomInRange(-5, 5)));
        document.getElementById('cpu-load').textContent = state.cpuLoad.toFixed(1);
        
        // RAM with slow drift
        state.ramLoad = Math.max(1.5, Math.min(8.0, state.ramLoad + randomInRange(-0.1, 0.15)));
        document.getElementById('ram-load').textContent = state.ramLoad.toFixed(1);
        
        // Memory usage
        document.getElementById('mem-usage').textContent = state.ramLoad.toFixed(1);
        
        // Tick rate with minor variance
        const tickRate = CONFIG.tickRate + randomInt(-2, 2);
        document.getElementById('tick-rate').textContent = tickRate;
    }

    // ── Population Counter ──
    function updatePopulation() {
        const increment = CONFIG.population.ratePerSecond + 
            (Math.random() - 0.5) * CONFIG.population.jitter;
        state.population += increment;
        
        const popEl = document.getElementById('pop-counter');
        popEl.textContent = formatPopulation(Math.floor(state.population));
        
        // Flash effect on update
        popEl.classList.add('flash-update');
        setTimeout(() => popEl.classList.remove('flash-update'), 300);
    }

    // ── Temperature Fluctuation ──
    function updateTemperature() {
        const baseTemp = 14.97;
        const temp = jitter(baseTemp, 0.15);
        document.getElementById('avg-temp').textContent = temp.toFixed(2) + '°C';
        
        // Today's extremes
        const todayMax = jitter(52.1, 1.5);
        const todayMin = jitter(-58.3, 2.0);
        document.getElementById('today-max').textContent = todayMax.toFixed(1);
        document.getElementById('today-min').textContent = todayMin.toFixed(1);
    }

    // ── CO2 and Sea Level ──
    function updateClimateData() {
        // CO2 with slow increase
        const co2 = jitter(421.7, 0.3);
        document.getElementById('co2-level').textContent = co2.toFixed(1) + ' ppm';
        
        // Sea level
        const seaLevel = jitter(101.2, 0.5);
        document.getElementById('sea-level').textContent = '+' + seaLevel.toFixed(1) + 'mm';
        
        // Magnetic field
        const magField = jitter(29.4, 0.2);
        document.getElementById('mag-field').textContent = magField.toFixed(1) + ' μT';
    }

    // ── Uptime ──
    function updateUptime() {
        state.uptime += 1;
        const days = Math.floor(state.uptime / 86400);
        const hours = Math.floor((state.uptime % 86400) / 3600);
        const mins = Math.floor((state.uptime % 3600) / 60);
        document.getElementById('uptime').textContent = `${days}d ${hours}h ${mins}m`;
    }

    // ── Ticker Duplication for Seamless Loop ──
    function initTicker() {
        const ticker = document.getElementById('ticker-content');
        if (ticker) {
            // Clone content for seamless loop
            ticker.innerHTML += ticker.innerHTML;
        }
    }

    // ── Sparkline Animation ──
    function initSparklines() {
        const sparks = document.querySelectorAll('.spark');
        sparks.forEach(spark => {
            const val = spark.getAttribute('data-val');
            spark.style.setProperty('--val', val + '%');
        });
        
        // Animate sparklines with subtle pulsing
        let progress = 0;
        setInterval(() => {
            progress += 0.02;
            sparks.forEach((spark, index) => {
                const baseVal = parseFloat(spark.getAttribute('data-val'));
                const pulse = Math.sin(progress + index * 0.5) * 2;
                const newVal = Math.max(0, Math.min(100, baseVal + pulse));
                spark.style.setProperty('--val', newVal + '%');
            });
        }, CONFIG.updateIntervals.sparklines);
    }

    // ── Seismic Chart Animation ──
    function initSeismicChart() {
        const chartBars = document.querySelectorAll('#seismic-chart .chart-bar');
        if (!chartBars.length) return;
        
        // Initialize chart data
        chartBars.forEach(bar => {
            state.chartData.push(parseFloat(bar.style.height));
        });
        
        setInterval(() => {
            chartBars.forEach((bar, index) => {
                // Shift data and add new random value
                const currentHeight = parseFloat(bar.style.height);
                let newHeight;
                
                if (index === chartBars.length - 1) {
                    // Last bar gets new random data
                    newHeight = randomInRange(20, 95);
                    
                    // Occasionally spike (simulating earthquake)
                    if (Math.random() < 0.05) {
                        newHeight = randomInRange(85, 100);
                        bar.classList.add('alert');
                        setTimeout(() => bar.classList.remove('alert'), 2000);
                    }
                } else {
                    // Shift from next bar
                    newHeight = parseFloat(chartBars[index + 1].style.height);
                }
                
                bar.style.height = newHeight + '%';
            });
        }, CONFIG.updateIntervals.charts);
    }

    // ── Generate Random Seismic Event ──
    const seismicLocations = [
        { flag: '🇵🇭', name: 'Mindanao', depth: '34km' },
        { flag: '🇨🇱', name: 'Atacama', depth: '112km' },
        { flag: '🇹🇷', name: 'Anatolia', depth: '8km' },
        { flag: '🇯🇵', name: 'Hokkaido', depth: '67km' },
        { flag: '🇲🇽', name: 'Oaxaca', depth: '45km' },
        { flag: '🇮🇸', name: 'Reykjanes', depth: '3km' },
        { flag: '🇵🇬', name: 'New Britain', depth: '89km' },
        { flag: '🇮🇩', name: 'Sumatra', depth: '56km' },
        { flag: '🇺🇸', name: 'California', depth: '12km' },
        { flag: '🇳🇿', name: 'Kermadec', depth: '201km' },
        { flag: '🇵🇪', name: 'Lima', depth: '42km' },
        { flag: '🇹🇼', name: 'Taiwan', depth: '28km' },
        { flag: '🇦🇱', name: 'Albania', depth: '15km' },
        { flag: '🇨🇷', name: 'Costa Rica', depth: '33km' }
    ];

    function generateSeismicEvent() {
        const loc = seismicLocations[randomInt(0, seismicLocations.length - 1)];
        const mag = randomInRange(3.0, 6.5).toFixed(1);
        const magClass = mag >= 6 ? 'mag6' : mag >= 5 ? 'mag5' : mag >= 4 ? 'mag4' : 'mag3';
        const alertClass = mag >= 6 ? 'alert-row' : '';
        
        const now = new Date();
        const time = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
        
        return {
            time,
            mag,
            magClass,
            location: loc,
            alertClass
        };
    }

    // ── Volcano Status Updates ──
    const volcanoes = [
        { name: 'Erta Ale', flag: '🇪🇹' },
        { name: 'Kilauea', flag: '🇺🇸' },
        { name: 'Etna', flag: '🇮🇹' },
        { name: 'Stromboli', flag: '🇮🇹' },
        { name: 'Fuego', flag: '🇬🇹' },
        { name: 'Merapi', flag: '🇮🇩' },
        { name: 'Taal', flag: '🇵🇭' },
        { name: 'Piton de la Fournaise', flag: '🇷🇪' }
    ];

    // ── Ticker Updates ──
    const tickerMessages = [
        { type: 'alert', text: '🌋 ALERT: Volcanic eruption detected — Mount Tambora sector 7.2' },
        { type: 'info', text: '📡 Satellite array 14 nominal — all telemetry green' },
        { type: 'warn', text: '⚡ Lightning cluster detected — Amazon basin, 47,000 strikes/hr' },
        { type: 'info', text: '🌊 Ocean current Gulf Stream velocity +2.3% above seasonal avg' },
        { type: 'alert', text: '🌍 M6.2 earthquake — Pacific Ring of Fire, depth 34km' },
        { type: 'info', text: '🌱 Global chlorophyll index at 0.73 — growing season peak' },
        { type: 'warn', text: '🌡 Arctic ice extent -12.7% vs 100yr baseline' },
        { type: 'info', text: '🛰 GPS constellation 31/31 satellites operational' },
        { type: 'alert', text: '🏭 Beijing AQI: 287 — Hazardous' },
        { type: 'info', text: '🌊 Sea level +3.4mm this quarter' },
        { type: 'info', text: '💰 Global trade volume $24.7T YTD' },
        { type: 'warn', text: '☀️ Solar flare M-class detected — geomagnetic storm incoming' }
    ];

    function updateTickerMessages() {
        // Occasionally add dynamic messages
        const dynamicMessages = [
            { type: 'alert', text: `🌍 M${(randomInRange(4.0, 6.5)).toFixed(1)} earthquake — ${seismicLocations[randomInt(0, seismicLocations.length-1)].name}` },
            { type: 'warn', text: `⚡ ${randomInt(5000, 50000).toLocaleString()} lightning strikes/hr — ${['Amazon', 'Congo', 'Southeast Asia', 'Central Africa'][randomInt(0,3)]}` },
            { type: 'info', text: `🛰 ${randomInt(10700, 10800)} satellites tracked — all nominal` },
            { type: 'warn', text: `🔥 Wildfire alert — ${randomInt(1000, 50000)}ha — ${['Canada', 'Greece', 'Australia', 'California'][randomInt(0,3)]}` }
        ];
        
        // This would update ticker content in a real implementation
    }

    // ── Vitals Card Hover Effects ──
    function initVitalCards() {
        const cards = document.querySelectorAll('.vital-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.2s ease';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // ── Panel Hover Effects ──
    function initPanelEffects() {
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', function() {
                this.style.boxShadow = 'inset 0 0 30px rgba(63, 185, 80, 0.03)';
            });
            panel.addEventListener('mouseleave', function() {
                this.style.boxShadow = 'none';
            });
        });
    }

    // ── Bar Hover Effects ──
    function initBarEffects() {
        const bars = document.querySelectorAll('.mini-bar-fill');
        bars.forEach(bar => {
            bar.addEventListener('mouseenter', function() {
                this.style.filter = 'brightness(1.3)';
                this.style.transition = 'filter 0.2s';
            });
            bar.addEventListener('mouseleave', function() {
                this.style.filter = 'brightness(1)';
            });
        });
    }

    // ── Data Value Hover Tooltip ──
    function initDataTooltips() {
        const dataValues = document.querySelectorAll('.dv');
        dataValues.forEach(dv => {
            dv.style.cursor = 'default';
            dv.addEventListener('mouseenter', function() {
                this.style.textShadow = '0 0 8px currentColor';
            });
            dv.addEventListener('mouseleave', function() {
                this.style.textShadow = 'none';
            });
        });
    }

    // ── Event Row Click Effect ──
    function initEventRowEffects() {
        const eventRows = document.querySelectorAll('.event-row');
        eventRows.forEach(row => {
            row.style.cursor = 'pointer';
            row.addEventListener('click', function() {
                this.style.background = 'rgba(63, 185, 80, 0.15)';
                setTimeout(() => {
                    this.style.background = '';
                }, 300);
            });
        });
    }

    // ── Real-time Event Feed Simulation ──
    function simulateEventFeed() {
        const seismicFeed = document.getElementById('seismic-feed');
        if (!seismicFeed) return;
        
        setInterval(() => {
            // Generate new event
            const event = generateSeismicEvent();
            
            // Create new row
            const newRow = document.createElement('div');
            newRow.className = `event-row ${event.alertClass}`;
            newRow.innerHTML = `
                <span class="ev-time">${event.time}</span>
                <span class="ev-mag ${event.magClass}">M${event.mag}</span>
                <span>${event.location.flag} ${event.location.name}</span>
                <span class="ev-depth">${event.location.depth}</span>
            `;
            
            // Add with animation
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(-10px)';
            newRow.style.transition = 'all 0.3s ease';
            
            // Insert at top
            seismicFeed.insertBefore(newRow, seismicFeed.firstChild);
            
            // Animate in
            requestAnimationFrame(() => {
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            });
            
            // Remove last row if too many
            const rows = seismicFeed.querySelectorAll('.event-row');
            if (rows.length > 10) {
                const lastRow = rows[rows.length - 1];
                lastRow.style.opacity = '0';
                setTimeout(() => lastRow.remove(), 300);
            }
            
            // Flash parent panel header
            const panel = seismicFeed.closest('.panel');
            if (panel && event.magClass === 'mag6') {
                const header = panel.querySelector('.panel-header');
                header.style.background = 'rgba(248, 81, 73, 0.2)';
                setTimeout(() => {
                    header.style.background = '';
                }, 500);
            }
        }, CONFIG.updateIntervals.seismic);
    }

    // ── Vital Value Pulse Animation ──
    function animateVitalValues() {
        const vitalValues = document.querySelectorAll('.vital-value');
        vitalValues.forEach((val, index) => {
            setInterval(() => {
                val.style.color = '#fff';
                setTimeout(() => {
                    val.style.color = '';
                }, 200);
            }, 3000 + index * 500);
        });
    }

    // ── Keyboard Navigation ──
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Press 'R' to refresh simulation
            if (e.key === 'r' || e.key === 'R') {
                document.body.style.filter = 'brightness(1.2)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 100);
            }
            
            // Press 'F' for fullscreen
            if (e.key === 'f' || e.key === 'F') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            }
        });
    }

    // ── Window Resize Handler ──
    function initResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate layouts if needed
                console.log('[PLANETSIM] Window resized, recalculating layouts...');
            }, 250);
        });
    }

    // ── Performance Monitoring ──
    function initPerformanceMonitor() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Adjust update rates based on performance
                if (fps < 30) {
                    // Reduce update frequency if struggling
                    console.warn('[PLANETSIM] Low FPS detected, optimizing...');
                }
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        requestAnimationFrame(measureFPS);
    }

    // ── Console Art ──
    function printConsoleArt() {
        console.log(`
%c╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗ ██╗      █████╗ ███╗   ██╗███████╗████████╗        ║
║   ██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝╚══██╔══╝        ║
║   ██████╔╝██║     ███████║██╔██╗ ██║███████╗   ██║           ║
║   ██╔═══╝ ██║     ██╔══██║██║╚██╗██║╚════██║   ██║           ║
║   ██║     ███████╗██║  ██║██║ ╚████║███████║   ██║           ║
║   ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝           ║
║                                                               ║
║   ███████╗██╗███╗   ███╗    ██╗   ██╗██╗  ██╗               ║
║   ██╔════╝██║████╗ ████║    ██║   ██║╚██╗██╔╝               ║
║   ███████╗██║██╔████╔██║    ██║   ██║ ╚███╔╝                ║
║   ╚════██║██║██║╚██╔╝██║    ██║   ██║ ██╔██╗                ║
║   ███████║██║██║ ╚═╝ ██║    ╚██████╔╝██╔╝ ██╗               ║
║   ╚══════╝╚═╝╚═╝     ╚═╝     ╚═════╝ ╚═╝  ╚═╝               ║
║                                                               ║
║   v4.7.2 | Global Overview Dashboard | 4K Optimized          ║
║   Real-time planetary simulation monitoring system            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `, 'color: #3fb950; font-family: monospace;');
        
        console.log('%c[PLANETSIM] Dashboard initialized successfully', 'color: #58a6ff;');
        console.log('%c[PLANETSIM] Press F for fullscreen, R to refresh', 'color: #8b949e;');
    }

    // ── Initialize Everything ──
    function init() {
        printConsoleArt();
        
        // Initialize visual elements
        initTicker();
        initSparklines();
        initSeismicChart();
        
        // Initialize interactions
        initVitalCards();
        initPanelEffects();
        initBarEffects();
        initDataTooltips();
        initEventRowEffects();
        
        // Initialize keyboard and resize
        initKeyboardNav();
        initResizeHandler();
        
        // Initialize performance monitoring
        initPerformanceMonitor();
        
        // Start real-time event simulation
        simulateEventFeed();
        
        // Start vital value animations
        animateVitalValues();
        
        // Start update loops
        setInterval(updateUTCClock, CONFIG.updateIntervals.clock);
        setInterval(updateSimTime, 1000);
        setInterval(updateSystemStats, 1000);
        setInterval(updatePopulation, 1000);
        setInterval(updateTemperature, CONFIG.updateIntervals.vitals);
        setInterval(updateClimateData, CONFIG.updateIntervals.vitals);
        setInterval(updateUptime, CONFIG.updateIntervals.uptime);
        
        // Initial updates
        updateUTCClock();
        updateSimTime();
        updateSystemStats();
        updatePopulation();
        updateTemperature();
        updateClimateData();
        
        console.log('%c[PLANETSIM] All systems nominal', 'color: #3fb950;');
    }

    // ── Start on DOM Ready ──
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();