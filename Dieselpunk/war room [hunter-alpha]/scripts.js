/* ═══════════════════════════════════════════════════════════════
   SUPREME COMMAND — WAR ROOM SCRIPTS
   Alternate-History 1940s Military Command Center
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── CONFIGURATION ───
    const CONFIG = {
        clockUpdateInterval: 1000,
        radioMessageInterval: 6000,
        gaugeUpdateInterval: 8000,
        posterRotateInterval: 12000,
        productionAnimDelay: 1500,
        maxRadioMessages: 20
    };

    // ─── STATE ───
    const state = {
        currentAlertLevel: 2,
        currentPoster: 0,
        deployMode: false,
        draggingToken: null,
        dragOffset: { x: 0, y: 0 }
    };

    // ─── DOM REFERENCES ───
    const DOM = {
        mainClock: document.getElementById('mainClock'),
        mainDate: document.getElementById('mainDate'),
        radioFeed: document.getElementById('radioFeed'),
        posterContent: document.getElementById('posterContent'),
        posterNum: document.getElementById('posterNum'),
        posterTotal: document.getElementById('posterTotal'),
        fuelNeedle: document.getElementById('fuelNeedle'),
        fuelValue: document.getElementById('fuelValue'),
        ammoNeedle: document.getElementById('ammoNeedle'),
        ammoValue: document.getElementById('ammoValue'),
        steelNeedle: document.getElementById('steelNeedle'),
        steelValue: document.getElementById('steelValue'),
        alertLevel: document.getElementById('alertLevel'),
        alertText: document.getElementById('alertText'),
        btnAlert: document.getElementById('btnAlert'),
        btnComms: document.getElementById('btnComms'),
        btnDeploy: document.getElementById('btnDeploy'),
        tickerContent: document.getElementById('tickerContent'),
        mapContainer: document.getElementById('mapContainer')
    };

    // ═══════════════════════════════════════════════════════════
    // CLOCK
    // ═══════════════════════════════════════════════════════════
    function updateClock() {
        const now = new Date();
        // Show as 1944 date
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        DOM.mainClock.textContent = `${hours}:${minutes}:${seconds}`;

        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        // Alternate history: Keep it in 1944
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        DOM.mainDate.textContent = `${day}-${month}-1944`;
    }

    // ═══════════════════════════════════════════════════════════
    // RADIO INTERCEPT FEED
    // ═══════════════════════════════════════════════════════════
    const radioMessages = [
        {
            freq: '7.842 MHz',
            source: 'ABWEHR',
            content: '...Kondor reporting sector 7 secure... reinforcement convoy ETA 0600...'
        },
        {
            freq: '14.328 MHz',
            source: 'LUFTWAFFE HQ',
            content: '...Jagdgeschwader 26 relocate to forward airfield... fuel reserves critical...'
        },
        {
            freq: '5.612 MHz',
            source: 'KRIEGSMARINE',
            content: '...Wolfpack Dönitz reports Allied convoy SC-142 spotted bearing 285...'
        },
        {
            freq: '9.103 MHz',
            source: 'OKW BERLIN',
            content: '...Directive 51-F: All reserve divisions to report readiness by 1800 hours...'
        },
        {
            freq: '11.477 MHz',
            source: 'FIELD CMD',
            content: '...Request immediate resupply... ammunition stocks depleted to 15%...'
        },
        {
            freq: '6.234 MHz',
            source: 'PANZERGRUPPE',
            content: '...Tiger tanks operational: 23 of 40... mechanical failures increasing...'
        },
        {
            freq: '8.891 MHz',
            source: 'U-BOAT CMD',
            content: '...U-473 depth charge damage... requesting permission to surface...'
        },
        {
            freq: '12.056 MHz',
            source: 'SIGNALS INTEL',
            content: '...Unknown transmission on frequency 4.420... possible Allied deception...'
        },
        {
            freq: '4.789 MHz',
            source: 'NIGHT FIGHTER',
            content: '...Bomber stream detected over sector delta... scrambling night fighters...'
        },
        {
            freq: '10.234 MHz',
            source: 'SUPPLY DEPOT',
            content: '...Rail network severed at grid ref KG-447... rerouting via secondary...'
        },
        {
            freq: '7.128 MHz',
            source: 'RECONNAISSANCE',
            content: '...Enemy buildup observed at coordinates... estimated division strength...'
        },
        {
            freq: '13.567 MHz',
            source: 'ANTI-AIRCRAFT',
            content: '...Flak batteries reporting low ammunition... priority resupply required...'
        },
        {
            freq: '3.445 MHz',
            source: 'ENIGMA TRAFFIC',
            content: '...Decrypted: Operation Overlord preparations detected in southern England...'
        },
        {
            freq: '15.890 MHz',
            source: 'WEATHER SVC',
            content: '...Storm front approaching Channel region... visibility reducing to 2km...'
        },
        {
            freq: '2.678 MHz',
            source: 'RADIO BERLIN',
            content: '...Ministry reports: Production targets exceeded in Ruhr industrial zone...'
        },
        {
            freq: '9.445 MHz',
            source: 'PARTISAN ACT',
            content: '...Resistance activity increased in sector 12... supply lines threatened...'
        },
        {
            freq: '6.789 MHz',
            source: 'MEDICAL CMD',
            content: '...Field hospitals at capacity... requesting evacuation of 500 wounded...'
        },
        {
            freq: '11.234 MHz',
            source: 'ALLIED SIGNAL',
            content: '...Intercepted: "Phantom Dawn confirmed for 0600"... verification needed...'
        }
    ];

    function generateRadioTime() {
        const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}Z`;
    }

    function addRadioMessage(message) {
        const msgEl = document.createElement('div');
        msgEl.className = 'radio-message';

        // Typewriter effect container
        const time = message ? null : generateRadioTime();
        const msg = message || radioMessages[Math.floor(Math.random() * radioMessages.length)];

        const timeStr = time || generateRadioTime();

        msgEl.innerHTML = `
            <span class="radio-time">[${timeStr}]</span>
            <span class="radio-freq">${msg.freq}</span>
            <span class="radio-source">${msg.source}:</span>
            <span class="radio-content"></span>
        `;

        DOM.radioFeed.insertBefore(msgEl, DOM.radioFeed.firstChild);

        // Typewriter effect
        const contentEl = msgEl.querySelector('.radio-content');
        typewriterEffect(contentEl, msg.content, 20);

        // Limit messages
        while (DOM.radioFeed.children.length > CONFIG.maxRadioMessages) {
            DOM.radioFeed.removeChild(DOM.radioFeed.lastChild);
        }

        // Static crackle effect
        playStaticCrackle();
    }

    function typewriterEffect(element, text, speed) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;

                // Random slight delay variation for realism
                const variation = speed + Math.random() * 30 - 15;
                setTimeout(type, Math.max(10, variation));
            }
        }

        type();
    }

    function playStaticCrackle() {
        // Visual static effect on radio panel
        const panel = document.querySelector('.radio-panel');
        if (panel) {
            panel.style.boxShadow = 'inset 0 0 20px rgba(74, 124, 63, 0.15)';
            setTimeout(() => {
                panel.style.boxShadow = '';
            }, 200);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ANALOG GAUGES
    // ═══════════════════════════════════════════════════════════
    function updateGauges() {
        // Randomly fluctuate gauge values
        const fuel = Math.floor(Math.random() * 30) + 60; // 60-90%
        const ammo = Math.floor(Math.random() * 40) + 30; // 30-70%
        const steel = Math.floor(Math.random() * 25) + 70; // 70-95%

        setGauge('fuel', fuel);
        setGauge('ammo', ammo);
        setGauge('steel', steel);
    }

    function setGauge(type, value) {
        const needle = document.getElementById(`${type}Needle`);
        const valueEl = document.getElementById(`${type}Value`);

        if (!needle || !valueEl) return;

        // Map 0-100% to 135-405 degrees (270 degree sweep)
        const angle = 135 + (value / 100) * 270;
        needle.style.setProperty('--needle-angle', `${angle}deg`);
        valueEl.textContent = `${value}%`;
    }

    // ═══════════════════════════════════════════════════════════
    // PRODUCTION QUOTAS
    // ═══════════════════════════════════════════════════════════
    function animateProductionBars() {
        const fills = document.querySelectorAll('.prod-fill');
        const counters = document.querySelectorAll('.prod-current');

        fills.forEach((fill, index) => {
            const width = parseInt(fill.dataset.width);
            setTimeout(() => {
                fill.style.width = `${width}%`;
            }, index * 200);
        });

        counters.forEach((counter, index) => {
            const target = parseInt(counter.dataset.target);
            setTimeout(() => {
                animateCounter(counter, target, 2000);
            }, index * 200);
        });
    }

    function animateCounter(element, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ═══════════════════════════════════════════════════════════
    // PROPAGANDA POSTERS
    // ═══════════════════════════════════════════════════════════
    const posters = [
        {
            topText: 'THE NATION',
            mainText: 'DEMANDS',
            highlight: 'YOUR<br>TOTAL<br>EFFORT',
            bottomText: 'ENLIST TODAY'
        },
        {
            topText: 'VICTORY',
            mainText: 'REQUIRES',
            highlight: 'STEEL<br>&<br>GRIT',
            bottomText: 'BUY WAR BONDS'
        },
        {
            topText: 'FREEDOM',
            mainText: 'IS NOT',
            highlight: 'FREE<br>—<br>FIGHT',
            bottomText: 'SUPPORT OUR TROOPS'
        },
        {
            topText: 'ENEMY',
            mainText: 'WATCHING',
            highlight: 'LOOSE<br>LIPS<br>SINK SHIPS',
            bottomText: 'KEEP SILENT'
        },
        {
            topText: 'AMERICA',
            mainText: 'WANTS',
            highlight: 'YOU<br>FOR<br>VICTORY',
            bottomText: 'REPORT FOR DUTY'
        }
    ];

    function rotatePoster() {
        state.currentPoster = (state.currentPoster + 1) % posters.length;
        const poster = posters[state.currentPoster];

        DOM.posterContent.style.opacity = '0';

        setTimeout(() => {
            DOM.posterContent.innerHTML = `
                <div class="poster-inner">
                    <div class="poster-top-text">${poster.topText}</div>
                    <div class="poster-main-text">${poster.mainText}</div>
                    <div class="poster-highlight">${poster.highlight}</div>
                    <div class="poster-bottom-text">${poster.bottomText}</div>
                    <div class="poster-star">★</div>
                </div>
            `;
            DOM.posterContent.style.opacity = '1';
            DOM.posterNum.textContent = String(state.currentPoster + 1).padStart(2, '0');
            DOM.posterTotal.textContent = String(posters.length).padStart(2, '0');
        }, 500);
    }

    // ═══════════════════════════════════════════════════════════
    // DRAGGABLE UNIT TOKENS
    // ═══════════════════════════════════════════════════════════
    function initDraggableTokens() {
        const tokens = document.querySelectorAll('.unit-token');

        tokens.forEach(token => {
            // Mouse events
            token.addEventListener('mousedown', startDrag);
            token.addEventListener('dblclick', showUnitInfo);

            // Touch events
            token.addEventListener('touchstart', startDragTouch, { passive: false });
        });

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', dragTouch, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function startDrag(e) {
        e.preventDefault();
        state.draggingToken = e.currentTarget;

        const rect = state.draggingToken.getBoundingClientRect();
        const mapRect = DOM.mapContainer.getBoundingClientRect();

        state.dragOffset.x = e.clientX - rect.left - rect.width / 2;
        state.dragOffset.y = e.clientY - rect.top - rect.height / 2;

        state.draggingToken.classList.add('dragging');

        // Haptic feedback style
        state.draggingToken.style.transition = 'transform 0.05s';
    }

    function startDragTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        state.draggingToken = e.currentTarget;

        const rect = state.draggingToken.getBoundingClientRect();

        state.dragOffset.x = touch.clientX - rect.left - rect.width / 2;
        state.dragOffset.y = touch.clientY - rect.top - rect.height / 2;

        state.draggingToken.classList.add('dragging');
    }

    function drag(e) {
        if (!state.draggingToken) return;
        e.preventDefault();

        const mapRect = DOM.mapContainer.getBoundingClientRect();
        const x = ((e.clientX - mapRect.left - state.dragOffset.x) / mapRect.width) * 100;
        const y = ((e.clientY - mapRect.top - state.dragOffset.y) / mapRect.height) * 100;

        // Constrain to map bounds
        const clampedX = Math.max(2, Math.min(98, x));
        const clampedY = Math.max(2, Math.min(98, y));

        state.draggingToken.style.left = `${clampedX}%`;
        state.draggingToken.style.top = `${clampedY}%`;
    }

    function dragTouch(e) {
        if (!state.draggingToken) return;
        e.preventDefault();

        const touch = e.touches[0];
        const mapRect = DOM.mapContainer.getBoundingClientRect();
        const x = ((touch.clientX - mapRect.left - state.dragOffset.x) / mapRect.width) * 100;
        const y = ((touch.clientY - mapRect.top - state.dragOffset.y) / mapRect.height) * 100;

        const clampedX = Math.max(2, Math.min(98, x));
        const clampedY = Math.max(2, Math.min(98, y));

        state.draggingToken.style.left = `${clampedX}%`;
        state.draggingToken.style.top = `${clampedY}%`;
    }

    function endDrag() {
        if (state.draggingToken) {
            state.draggingToken.classList.remove('dragging');
            state.draggingToken.style.transition = '';
            state.draggingToken = null;
        }
    }

    function showUnitInfo(e) {
        const token = e.currentTarget;
        const unitName = token.dataset.unit;

        // Create tooltip
        const existingTooltip = document.querySelector('.unit-tooltip');
        if (existingTooltip) existingTooltip.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'unit-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${unitName}</div>
            <div class="tooltip-status">STATUS: OPERATIONAL</div>
            <div class="tooltip-strength">STRENGTH: ${Math.floor(Math.random() * 30 + 70)}%</div>
            <div class="tooltip-morale">MORALE: ${['HIGH', 'MODERATE', 'NOMINAL'][Math.floor(Math.random() * 3)]}</div>
            <div class="tooltip-close">Click to dismiss</div>
        `;

        tooltip.style.cssText = `
            position: fixed;
            left: ${e.clientX + 15}px;
            top: ${e.clientY - 10}px;
            background: linear-gradient(180deg, #2a2d24 0%, #1a1d16 100%);
            border: 2px solid #3a3d34;
            padding: 12px;
            font-family: var(--font-tech);
            font-size: 0.7rem;
            color: var(--text-primary);
            z-index: 1000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.7);
            min-width: 180px;
        `;

        // Style inner elements
        const header = tooltip.querySelector('.tooltip-header');
        header.style.cssText = `
            font-family: var(--font-heading);
            font-size: 0.85rem;
            color: var(--brass);
            letter-spacing: 0.1em;
            border-bottom: 1px solid #3a3a3a;
            padding-bottom: 6px;
            margin-bottom: 6px;
        `;

        const close = tooltip.querySelector('.tooltip-close');
        close.style.cssText = `
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #2a2a2a;
            color: var(--text-dim);
            font-size: 0.55rem;
            text-align: center;
        `;

        document.body.appendChild(tooltip);

        tooltip.addEventListener('click', () => tooltip.remove());
        setTimeout(() => tooltip.remove(), 5000);
    }

    // ═══════════════════════════════════════════════════════════
    // ALERT SYSTEM
    // ═══════════════════════════════════════════════════════════
    const alertLevels = [
        { level: 1, text: 'CONDITION RED', desc: 'Immediate Action Required', lights: [1] },
        { level: 2, text: 'CONDITION YELLOW', desc: 'Heightened Readiness', lights: [1, 2] },
        { level: 3, text: 'CONDITION GREEN', desc: 'Normal Operations', lights: [1, 2, 3] }
    ];

    function cycleAlertLevel() {
        state.currentAlertLevel = (state.currentAlertLevel % 3) + 1;
        updateAlertDisplay();
    }

    function updateAlertDisplay() {
        const config = alertLevels[state.currentAlertLevel - 1];

        // Update lights
        const lights = DOM.alertLevel.querySelectorAll('.alert-light');
        lights.forEach(light => {
            const level = parseInt(light.dataset.level);
            light.classList.toggle('active', config.lights.includes(level));
        });

        // Update text
        DOM.alertText.textContent = config.text;

        // Update desc
        const desc = DOM.alertText.nextElementSibling;
        if (desc) desc.textContent = config.desc;

        // Visual feedback
        DOM.btnAlert.classList.toggle('active', state.currentAlertLevel === 1);
    }

    // ═══════════════════════════════════════════════════════════
    // BUTTON CONTROLS
    // ═══════════════════════════════════════════════════════════
    function initControls() {
        DOM.btnAlert.addEventListener('click', () => {
            cycleAlertLevel();
            playButtonFeedback(DOM.btnAlert);
        });

        DOM.btnComms.addEventListener('click', () => {
            DOM.btnComms.classList.toggle('active');
            playButtonFeedback(DOM.btnComms);

            // Add burst of radio messages when activated
            if (DOM.btnComms.classList.contains('active')) {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => addRadioMessage(), i * 1000);
                }
            }
        });

        DOM.btnDeploy.addEventListener('click', () => {
            state.deployMode = !state.deployMode;
            DOM.btnDeploy.classList.toggle('active', state.deployMode);
            DOM.mapContainer.style.cursor = state.deployMode ? 'copy' : 'crosshair';
            playButtonFeedback(DOM.btnDeploy);
        });
    }

    function playButtonFeedback(btn) {
        btn.style.transform = 'translateY(1px)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);

        // Flash effect
        btn.style.boxShadow = '0 0 15px rgba(201, 162, 39, 0.5)';
        setTimeout(() => {
            btn.style.boxShadow = '';
        }, 300);
    }

    // ═══════════════════════════════════════════════════════════
    // TICKER ENHANCEMENTS
    // ═══════════════════════════════════════════════════════════
    function duplicateTickerContent() {
        const ticker = DOM.tickerContent;
        ticker.innerHTML += ticker.innerHTML;
    }

    // ═══════════════════════════════════════════════════════════
    // MAP INTERACTIONS
    // ═══════════════════════════════════════════════════════════
    function initMapInteractions() {
        // City marker hover sounds (visual feedback)
        const cityMarkers = document.querySelectorAll('.city-marker');
        cityMarkers.forEach(marker => {
            marker.addEventListener('mouseenter', () => {
                const dot = marker.querySelector('.city-dot');
                if (dot) {
                    dot.style.transform = 'scale(1.8)';
                    dot.style.transition = 'transform 0.2s ease-out';
                }
            });

            marker.addEventListener('mouseleave', () => {
                const dot = marker.querySelector('.city-dot');
                if (dot) {
                    dot.style.transform = 'scale(1)';
                }
            });
        });

        // Map click to place marker in deploy mode
        DOM.mapContainer.addEventListener('click', (e) => {
            if (!state.deployMode) return;

            const rect = DOM.mapContainer.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            createTempMarker(x, y);
        });
    }

    function createTempMarker(x, y) {
        const marker = document.createElement('div');
        marker.className = 'temp-marker';
        marker.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 12px;
            height: 12px;
            border: 2px solid var(--brass);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 15;
            pointer-events: none;
            animation: tempMarkerPulse 1s ease-out forwards;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tempMarkerPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        DOM.mapContainer.appendChild(marker);

        setTimeout(() => {
            marker.remove();
        }, 1000);
    }

    // ═══════════════════════════════════════════════════════════
    // AMBIENT EFFECTS
    // ═══════════════════════════════════════════════════════════
    function initAmbientEffects() {
        // Random gauge fluctuations
        setInterval(() => {
            const fuel = parseInt(DOM.fuelValue.textContent);
            const ammo = parseInt(DOM.ammoValue.textContent);
            const steel = parseInt(DOM.steelValue.textContent);

            // Small random fluctuations
            const fuelNew = Math.max(10, Math.min(95, fuel + Math.floor(Math.random() * 7) - 3));
            const ammoNew = Math.max(10, Math.min(95, ammo + Math.floor(Math.random() * 7) - 3));
            const steelNew = Math.max(10, Math.min(95, steel + Math.floor(Math.random() * 5) - 2));

            setGauge('fuel', fuelNew);
            setGauge('ammo', ammoNew);
            setGauge('steel', steelNew);
        }, CONFIG.gaugeUpdateInterval);

        // Radio indicator random flicker
        setInterval(() => {
            const indicator = document.querySelector('.radio-indicator');
            if (indicator && DOM.btnComms.classList.contains('active')) {
                indicator.style.background = 'var(--warning-amber)';
                setTimeout(() => {
                    indicator.style.background = '';
                }, 100);
            }
        }, 2000);

        // Front line pulse enhancement
        const frontLines = document.querySelectorAll('.front-line.active-front');
        frontLines.forEach(line => {
            setInterval(() => {
                line.style.strokeWidth = '0.6';
                line.style.filter = 'drop-shadow(0 0 5px rgba(196, 52, 45, 0.8))';
                setTimeout(() => {
                    line.style.strokeWidth = '';
                    line.style.filter = '';
                }, 200);
            }, 5000);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // LAMP FLICKER ENHANCEMENT
    // ═══════════════════════════════════════════════════════════
    function initLampFlicker() {
        const lamp = document.querySelector('.lamp-light');
        if (!lamp) return;

        // Random intense flickers
        setInterval(() => {
            if (Math.random() > 0.7) {
                lamp.style.opacity = '0.4';
                lamp.style.background = 'radial-gradient(ellipse at center top, rgba(255, 200, 100, 0.08) 0%, transparent 70%)';

                setTimeout(() => {
                    lamp.style.opacity = '0.9';
                }, 50);

                setTimeout(() => {
                    lamp.style.opacity = '0.6';
                }, 100);

                setTimeout(() => {
                    lamp.style.opacity = '';
                    lamp.style.background = '';
                }, 200);
            }
        }, 4000);
    }

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD SHORTCUTS
    // ═══════════════════════════════════════════════════════════
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'a':
                    cycleAlertLevel();
                    playButtonFeedback(DOM.btnAlert);
                    break;
                case 'c':
                    DOM.btnComms.classList.toggle('active');
                    playButtonFeedback(DOM.btnComms);
                    if (DOM.btnComms.classList.contains('active')) {
                        addRadioMessage();
                    }
                    break;
                case 'd':
                    state.deployMode = !state.deployMode;
                    DOM.btnDeploy.classList.toggle('active', state.deployMode);
                    playButtonFeedback(DOM.btnDeploy);
                    break;
                case 'p':
                    rotatePoster();
                    break;
                case 'r':
                    addRadioMessage();
                    break;
                case 'escape':
                    // Close any tooltips
                    const tooltips = document.querySelectorAll('.unit-tooltip');
                    tooltips.forEach(t => t.remove());
                    break;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════
    function init() {
        // Clock
        updateClock();
        setInterval(updateClock, CONFIG.clockUpdateInterval);

        // Radio feed - initial messages
        for (let i = 0; i < 5; i++) {
            setTimeout(() => addRadioMessage(), i * 800);
        }

        // Continuous radio messages
        setInterval(() => {
            addRadioMessage();
        }, CONFIG.radioMessageInterval);

        // Gauges
        updateGauges();

        // Production bars
        setTimeout(animateProductionBars, CONFIG.productionAnimDelay);

        // Poster rotation
        setInterval(rotatePoster, CONFIG.posterRotateInterval);

        // Draggable tokens
        initDraggableTokens();

        // Controls
        initControls();

        // Map interactions
        initMapInteractions();

        // Ticker duplication for seamless loop
        duplicateTickerContent();

        // Ambient effects
        initAmbientEffects();

        // Lamp flicker
        initLampFlicker();

        // Keyboard shortcuts
        initKeyboardShortcuts();

        // Comms active by default
        DOM.btnComms.classList.add('active');

        console.log('%c⚔ SUPREME COMMAND INITIALIZED ⚔', 'color: #c9a227; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(201, 162, 39, 0.5);');
        console.log('%cKeyboard shortcuts: A=Alert, C=Comms, D=Deploy, P=Poster, R=Radio', 'color: #8a8270; font-size: 11px;');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();