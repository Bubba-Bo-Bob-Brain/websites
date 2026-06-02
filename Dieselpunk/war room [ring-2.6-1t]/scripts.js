// ============================================================
// STRATEGIC COMMAND WAR ROOM — INTERACTIVE SCRIPT
// Alternate-History 1940s Military Command Console
// ============================================================

(function () {
    'use strict';

    // ===========================
    // STATE
    // ===========================
    const state = {
        lampOn: true,
        nightVision: false,
        gridVisible: true,
        fogActive: false,
        radioActive: true,
        radioInterval: null,
        casualtyInterval: null,
        gaugeInterval: null,
        posterInterval: null,
        scoutRevealed: false,
        ordersIssued: 0,
        currentDateTime: new Date(2025, 2, 15, 14, 37, 0), // March 15 1947 (simulated)
        gauges: {
            steel: 78,
            oil: 64,
            manpower: 91,
            munitions: 55,
            food: 83,
            morale: 72
        },
        casualties: {
            friendly: 1247,
            enemy: 3891
        }
    };

    // ===========================
    // DOM REFERENCES
    // ===========================
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        dateTime: $('#dateTime'),
        lampLight: $('#lampLight'),
        lampToggle: $('#lampToggle'),
        nightVisionToggle: $('#nightVisionToggle'),
        mapToggle: $('#mapToggle'),
        radioStatic: $('#radioStatic'),
        radioFeed: $('#radioFeed'),
        radioToggle: $('#radioToggle'),
        freqDisplay: $('#freqDisplay'),
        mapGrid: $('#mapGrid'),
        gridCoords: $('#gridCoords'),
        fogOfWar: $('#fogOfWar'),
        mapContainer: $('#mapContainer'),
        compassRose: $('#compassRose'),
        steelNeedle: $('#steelNeedle'),
        oilNeedle: $('#oilNeedle'),
        manpowerNeedle: $('#manpowerNeedle'),
        munitionsNeedle: $('#munitionsNeedle'),
        foodNeedle: $('#foodNeedle'),
        moraleNeedle: $('#moraleNeedle'),
        steelValue: $('#steelValue'),
        oilValue: $('#oilValue'),
        manpowerValue: $('#manpowerValue'),
        munitionsValue: $('#munitionsValue'),
        foodValue: $('#foodValue'),
        moraleValue: $('#moraleValue'),
        steelActual: $('#steelActual'),
        oilActual: $('#oilActual'),
        manpowerActual: $('#manpowerActual'),
        munitionsActual: $('#munitionsActual'),
        foodActual: $('#foodActual'),
        casualtyCount: $('#casualtyCount'),
        enemyCasualtyCount: $('#enemyCasualtyCount'),
        issueOrderBtn: $('#issueOrderBtn'),
        scoutBtn: $('#scoutBtn'),
        orderSelect: $('#orderSelect'),
        telegraphLight: $('#telegraphLight'),
        telegraphStatus: $('#telegraphStatus'),
        lightBulb: $('.light-bulb'),
        toast: $('#toast'),
        unitMarkers: $('#unitMarkers'),
        rivetOverlay: $('#rivetOverlay'),
        propagandaWall: $('#propagandaWall'),
        poster1: $('#poster1'),
        poster2: $('#poster2'),
        poster3: $('#poster3'),
        poster4: $('#poster4'),
        poster5: $('#poster5')
    };

    // ===========================
    // UTILITY FUNCTIONS
    // ===========================
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function formatNumber(n) {
        return n.toLocaleString('en-US');
    }

    function showToast(message, type = '') {
        dom.toast.textContent = message;
        dom.toast.className = 'toast visible ' + type;
        setTimeout(() => {
            dom.toast.className = 'toast';
        }, 3500);
    }

    function setGauge(needle, valueEl, val, actualEl, actualVal) {
        const rotation = -112.5 + (val / 100) * 225;
        needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        valueEl.textContent = val + '%';
        if (actualEl) {
            actualEl.textContent = formatNumber(actualVal);
        }
    }

    // ===========================
    // CLOCK
    // ===========================
    function updateClock() {
        state.currentDateTime.setSeconds(state.currentDateTime.getSeconds() + 1);
        const d = state.currentDateTime;
        const dateStr = [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, '0'),
            String(d.getDate()).padStart(2, '0')
        ].join('-');
        const timeStr = [
            String(d.getHours()).padStart(2, '0'),
            String(d.getMinutes()).padStart(2, '0'),
            String(d.getSeconds()).padStart(2, '0')
        ].join(':');
        dom.dateTime.textContent = `${dateStr} // ${timeStr} GMT+2`;
    }

    // ===========================
    // OVERHEAD LAMP
    // ===========================
    function toggleLamp() {
        state.lampOn = !state.lampOn;
        if (state.lampOn) {
            dom.lampLight.classList.remove('dimmed');
            dom.lampToggle.classList.remove('active');
            dom.lampToggle.innerHTML = '💡 LAMP';
        } else {
            dom.lampLight.classList.add('dimmed');
            dom.lampToggle.classList.add('active');
            dom.lampToggle.innerHTML = '💡 LAMP OFF';
        }
    }

    // ===========================
    // NIGHT VISION
    // ===========================
    function toggleNightVision() {
        state.nightVision = !state.nightVision;
        if (state.nightVision) {
            document.body.classList.add('night-vision');
            dom.nightVisionToggle.classList.add('active');
            dom.nightVisionToggle.innerHTML = '🟢 NV ON';
            showToast('NIGHT VISION ENGAGED');
        } else {
            document.body.classList.remove('night-vision');
            dom.nightVisionToggle.classList.remove('active');
            dom.nightVisionToggle.innerHTML = '🌙 NV';
            showToast('NIGHT VISION DISENGAGED');
        }
    }

    // ===========================
    // GRID TOGGLE
    // ===========================
    function toggleGrid() {
        state.gridVisible = !state.gridVisible;
        if (state.gridVisible) {
            dom.mapGrid.style.opacity = '0.4';
            dom.gridCoords.style.opacity = '1';
            dom.mapToggle.classList.remove('active');
            showToast('GRID OVERLAY: ON');
        } else {
            dom.mapGrid.style.opacity = '0';
            dom.gridCoords.style.opacity = '0';
            dom.mapToggle.classList.add('active');
            showToast('GRID OVERLAY: OFF');
        }
    }

    // ===========================
    // RADIO INTERCEPTS
    // ===========================
    const transmissions = [
        { prefix: '[TX-ALPHA]', text: 'Column advancing through sector 7-G. Hold positions. Over.', enigma: false },
        { prefix: '[ENIGMA-4]', text: 'Enemy supply convoy spotted route delta. Estimated 40 vehicles. Request air support. Over.', enigma: true },
        { prefix: '[TX-BRAVO]', text: 'Artillery battery seven ready. Awaiting coordinates from command. Over.', enigma: false },
        { prefix: '[ENIGMA-12]', text: 'Enemy reserves moving north. Believe major offensive planned for dawn. Over.', enigma: true },
        { prefix: '[TX-CHARLIE]', text: 'Bridge at grid reference 44-88 is intact. Engineering team en route. Over.', enigma: false },
        { prefix: '[ENIGMA-7]', text: '...weather deteriorating... visibility dropping to 200 meters... advise all patrols... Over.', enigma: true },
        { prefix: '[TX-DOG]', text: 'Recon team reports enemy fortifications along the eastern ridge. Heavy emplacements. Over.', enigma: false },
        { prefix: '[HQ-DIRECTIVE]', text: 'All units maintain radio silence until 15:00. Execute Operation Iron Curtain as planned. Over.', enigma: false },
        { prefix: '[ENIGMA-3]', text: '...ammunition reserves critical... requesting resupply from depot seven... Over.', enigma: true },
        { prefix: '[TX-FOX]', text: 'Perimeter secure. Night watch rotations confirmed. No enemy contact. Over.', enigma: false },
        { prefix: '[TX-ECHO]', text: 'Medic station at waypoint Kilo reports 12 wounded. Need evacuation transport. Over.', enigma: false },
        { prefix: '[ENIGMA-19]', text: '...reinforcements diverted... secondary front opening in sector 12... Over.', enigma: true },
        { prefix: '[TX-HOTEL]', text: 'Observation post Bravo reports dust clouds from the south. Estimated 200 troops. Over.', enigma: false },
        { prefix: '[TX-INDIA]', text: 'Supply line confirmed clear through checkpoint November. Convoy proceeding. Over.', enigma: false },
        { prefix: '[ENIGMA-23]', text: '...code name Eisenhammer... scheduled for next full moon... all units standby... Over.', enigma: true },
        { prefix: '[TX-LIMA]', text: 'Anti-aircraft positions repositioned. Coverage now extends to grid square 9-Foxtrot. Over.', enigma: false },
        { prefix: '[HQ-URGENT]', text: 'All unit commanders report status to command post immediately. Priority Alpha. Over.', enigma: false },
        { prefix: '[ENIGMA-31]', text: '...double agent confirmed... intelligence suggests deception plan working... Over.', enigma: true },
        { prefix: '[TX-MIKE]', text: 'Patrol returning with two prisoners. Interrogation in progress at compound. Over.', enigma: false },
        { prefix: '[TX-OSCAR]', text: 'Naval support confirmed for coastal bombardment. Timing 0600 hours. Over.', enigma: false }
    ];

    let radioMessageIndex = 0;
    let radioTypingInterval = null;

    function addTransmission(transmission) {
        const div = document.createElement('div');
        div.className = 'radio-transmission' + (transmission.enigma ? ' enigma' : '');

        const prefixEl = document.createElement('span');
        prefixEl.className = 'tx-prefix';
        prefixEl.textContent = transmission.prefix;

        const textEl = document.createElement('span');
        textEl.className = 'tx-text';

        div.appendChild(prefixEl);
        div.appendChild(textEl);
        dom.radioFeed.prepend(div);

        // Typewriter effect
        let charIndex = 0;
        const speed = rand(20, 50);
        dom.radioStatic.classList.add('active');

        clearInterval(radioTypingInterval);
        radioTypingInterval = setInterval(() => {
            if (charIndex < transmission.text.length) {
                textEl.textContent += transmission.text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(radioTypingInterval);
                dom.radioStatic.classList.remove('active');
                // Keep feed limited
                while (dom.radioFeed.children.length > 20) {
                    dom.radioFeed.removeChild(dom.radioFeed.lastChild);
                }
            }
        }, speed);
    }

    function startRadioFeed() {
        state.radioActive = true;
        dom.radioToggle.classList.add('active');
        state.radioInterval = setInterval(() => {
            const tx = transmissions[rand(0, transmissions.length - 1)];
            addTransmission(tx);
        }, rand(4000, 8000));
        // Initial messages
        addTransmission(transmissions[0]);
        setTimeout(() => addTransmission(transmissions[1]), 1500);
        setTimeout(() => addTransmission(transmissions[2]), 3000);
        setTimeout(() => addTransmission(transmissions[3]), 4500);
    }

    function stopRadioFeed() {
        state.radioActive = false;
        dom.radioToggle.classList.remove('active');
        clearInterval(state.radioInterval);
        clearInterval(radioTypingInterval);
        dom.radioStatic.classList.remove('active');
    }

    function toggleRadio() {
        if (state.radioActive) {
            stopRadioFeed();
            dom.freqDisplay.textContent = '--- MHz';
            showToast('RADIO FEED OFFLINE');
        } else {
            startRadioFeed();
            dom.freqDisplay.textContent = '87.4 MHz';
            showToast('RADIO FEED ACTIVE');
        }
    }

    // ===========================
    // SIGNAL BARS ANIMATION
    // ===========================
    function animateSignalBars() {
        const bars = $$('.signal-bar');
        setInterval(() => {
            bars.forEach(bar => {
                const h = rand(5, 20);
                bar.style.height = h + 'px';
                bar.style.opacity = (h / 20) * 0.8 + 0.2;
            });
        }, 2000);
    }

    // ===========================
    // MAP GRID & COORDINATES
    // ===========================
    function generateGridCoordinates() {
        const cols = 24;
        const rows = 16;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWX';
        let html = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (r === 0) {
                    // Top row: column letters
                    html += `<span style="grid-column: ${c + 1}; grid-row: ${r + 1};">${letters[c]}</span>`;
                } else if (c === 0) {
                    // Left column: row numbers
                    html += `<span style="grid-column: ${c + 1}; grid-row: ${r + 1};">${String(rows - r).padStart(2, '0')}</span>`;
                } else {
                    html += `<span style="grid-column: ${c + 1}; grid-row: ${r + 1}; opacity:0;">·</span>`;
                }
            }
        }
        dom.gridCoords.innerHTML = html;
    }

    function generateRivetOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'rivet-overlay';
        let rivets = '';
        for (let y = 20; y < window.innerHeight; y += 40) {
            for (let x = 20; x < window.innerWidth; x += 40) {
                rivets += `<div style="position:absolute;left:${x}px;top:${y}px;width:10px;height:10px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#8a8f9d,#4a4f5d 50%,#2a2f3d 100%);border:1px solid #6a6f7d;box-shadow:inset 0 1px 2px rgba(255,255,255,0.1),0 2px 4px rgba(0,0,0,0.5);"></div>`;
            }
        }
        overlay.innerHTML = rivets;
        document.body.appendChild(overlay);
    }

    // ===========================
    // FOG OF WAR
    // ===========================
    function toggleFogOfWar() {
        state.fogActive = !state.fogActive;
        dom.fogOfWar.classList.toggle('active', state.fogActive);
        if (state.fogActive) {
            dom.mapToggle.title = 'Hide Grid';
            showToast('FOG OF WAR ENGAGED');
        } else {
            showToast('FOG OF WAR LIFTED');
        }
    }

    // ===========================
    // UNIT MARKERS — DRAGGABLE
    // ===========================
    function setupUnitDrag() {
        let activeMarker = null;
        let offsetX = 0, offsetY = 0;

        document.addEventListener('mousedown', (e) => {
            const marker = e.target.closest('.unit-marker');
            if (!marker || marker.classList.contains('enemy')) return;
            e.preventDefault();
            activeMarker = marker;
            marker.style.zIndex = '50';
            marker.style.cursor = 'grabbing';
            marker.style.transition = 'none';

            const rect = dom.mapContainer.getBoundingClientRect();
            const gw = rect.width / 24;
            const gh = rect.height / 16;
            const gc = parseInt(marker.style.gridColumn) - 1;
            const gr = parseInt(marker.style.gridRow) - 1;
            const cellX = rect.left + gc * gw;
            const cellY = rect.top + gr * gh;
            offsetX = e.clientX - cellX;
            offsetY = e.clientY - cellY;

            showToast(`Selected: ${marker.dataset.name}`);
        });

        document.addEventListener('mousemove', (e) => {
            if (!activeMarker) return;
            const rect = dom.mapContainer.getBoundingClientRect();
            const gw = rect.width / 24;
            const gh = rect.height / 16;

            let x = e.clientX - rect.left - offsetX;
            let y = e.clientY - rect.top - offsetY;

            let col = Math.floor(x / gw);
            let row = Math.floor(y / gh);
            col = Math.max(0, Math.min(23, col));
            row = Math.max(0, Math.min(15, row));

            activeMarker.style.gridColumn = col + 1;
            activeMarker.style.gridRow = row + 1;
        });

        document.addEventListener('mouseup', () => {
            if (!activeMarker) return;
            activeMarker.style.zIndex = '5';
            activeMarker.style.cursor = 'grab';
            activeMarker.style.transition = 'transform 0.2s ease, filter 0.3s ease';
            const col = parseInt(activeMarker.style.gridColumn);
            const row = parseInt(activeMarker.style.gridRow);
            showToast(`${activeMarker.dataset.name} repositioned to grid ${col}-${row}`);
            activeMarker = null;
        });

        // Touch support
        document.addEventListener('touchstart', (e) => {
            const marker = e.target.closest('.unit-marker');
            if (!marker || marker.classList.contains('enemy')) return;
            e.preventDefault();
            activeMarker = marker;
            marker.style.zIndex = '50';

            const touch = e.touches[0];
            const rect = dom.mapContainer.getBoundingClientRect();
            const gw = rect.width / 24;
            const gh = rect.height / 16;
            const gc = parseInt(marker.style.gridColumn) - 1;
            const gr = parseInt(marker.style.gridRow) - 1;
            const cellX = rect.left + gc * gw;
            const cellY = rect.top + gr * gh;
            offsetX = touch.clientX - cellX;
            offsetY = touch.clientY - cellY;
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!activeMarker) return;
            e.preventDefault();
            const touch = e.touches[0];
            const rect = dom.mapContainer.getBoundingClientRect();
            const gw = rect.width / 24;
            const gh = rect.height / 16;

            let x = touch.clientX - rect.left - offsetX;
            let y = touch.clientY - rect.top - offsetY;

            let col = Math.floor(x / gw);
            let row = Math.floor(y / gh);
            col = Math.max(0, Math.min(23, col));
            row = Math.max(0, Math.min(15, row));

            activeMarker.style.gridColumn = col + 1;
            activeMarker.style.gridRow = row + 1;
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (!activeMarker) return;
            activeMarker.style.zIndex = '5';
            const col = parseInt(activeMarker.style.gridColumn);
            const row = parseInt(activeMarker.style.gridRow);
            showToast(`${activeMarker.dataset.name} repositioned to grid ${col}-${row}`);
            activeMarker = null;
        });
    }

    // ===========================
    // UNIT MARKERS — TOOLTIPS
    // ===========================
    function setupUnitTooltips() {
        let tooltip = null;

        document.addEventListener('mouseover', (e) => {
            const marker = e.target.closest('.unit-marker');
            if (!marker) {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
                return;
            }
            if (tooltip) tooltip.remove();

            tooltip = document.createElement('div');
            tooltip.style.cssText = `
                position: fixed;
                z-index: 9999;
                background: rgba(15,18,24,0.95);
                border: 1px solid #5a4a30;
                border-radius: 3px;
                padding: 10px 14px;
                font-family: 'Courier New', monospace;
                font-size: 0.7rem;
                color: #f5e6c8;
                box-shadow: 0 4px 20px rgba(0,0,0,0.7);
                pointer-events: none;
                max-width: 220px;
                line-height: 1.6;
            `;

            const typeColors = {
                infantry: '#5b8c5a',
                armor: '#c4952a',
                artillery: '#b85c2a',
                recon: '#6a9ab5'
            };

            const type = marker.dataset.type || 'unknown';
            const color = typeColors[type] || '#888';
            tooltip.innerHTML = `
                <div style="color:${color};font-weight:bold;font-size:0.8rem;letter-spacing:1px;margin-bottom:4px;">
                    ${marker.dataset.name}
                </div>
                <div style="color:#aaa;">Type: ${type.toUpperCase()}</div>
                <div style="color:#aaa;">Strength: <span style="color:#d4a017;">${marker.dataset.strength}</span></div>
                <div style="color:#aaa;">Grid: ${marker.style.gridColumn || '?'}-${marker.style.gridRow || '?'}</div>
            `;
            document.body.appendChild(tooltip);
        });

        document.addEventListener('mousemove', (e) => {
            if (!tooltip) return;
            let x = e.clientX + 15;
            let y = e.clientY + 15;
            if (x + 230 > window.innerWidth) x = e.clientX - 230;
            if (y + 120 > window.innerHeight) y = e.clientY - 120;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        });

        document.addEventListener('mouseout', (e) => {
            const marker = e.target.closest('.unit-marker');
            if (marker && !e.relatedTarget?.closest('.unit-marker')) {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            }
        });
    }

    // ===========================
    // ANALOG GAUGES
    // ===========================
    function initGauges() {
        setGauge(dom.steelNeedle, dom.steelValue, state.gauges.steel, dom.steelActual, state.gauges.steel / 100 * 50000);
        setGauge(dom.oilNeedle, dom.oilValue, state.gauges.oil, dom.oilActual, state.gauges.oil / 100 * 120000);
        setGauge(dom.manpowerNeedle, dom.manpowerValue, state.gauges.manpower, dom.manpowerActual, state.gauges.manpower / 100 * 800000);
        setGauge(dom.munitionsNeedle, dom.munitionsValue, state.gauges.munitions, dom.munitionsActual, state.gauges.munitions / 100 * 2400000);
        setGauge(dom.foodNeedle, dom.foodValue, state.gauges.food, dom.foodActual, state.gauges.food / 100 * 90000);
        setGauge(dom.moraleNeedle, dom.moraleValue, state.gauges.morale);
    }

    function fluctuateGauges() {
        const keys = ['steel', 'oil', 'manpower', 'munitions', 'food', 'morale'];
        const actualEls = {
            steel: dom.steelActual,
            oil: dom.oilActual,
            manpower: dom.manpowerActual,
            munitions: dom.munitionsActual,
            food: dom.foodActual
        };
        const maxVals = {
            steel: 50000,
            oil: 120000,
            manpower: 800000,
            munitions: 2400000,
            food: 90000
        };

        state.gaugeInterval = setInterval(() => {
            keys.forEach(key => {
                const gauge = state.gauges[key];
                const delta = rand(-3, 3);
                state.gauges[key] = Math.max(10, Math.min(99, gauge + delta));

                const needle = document.getElementById(key + 'Needle');
                const valueEl = document.getElementById(key + 'Value');
                const rotation = -112.5 + (state.gauges[key] / 100) * 225;
                needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
                valueEl.textContent = state.gauges[key] + '%';

                if (actualEls[key]) {
                    const actual = Math.round(state.gauges[key] / 100 * maxVals[key]);
                    actualEls[key].textContent = formatNumber(actual);
                }
            });
        }, 4000);
    }

    // ===========================
    // CASUALTY COUNTER
    // ===========================
    function startCasualtyCounter() {
        state.casualtyInterval = setInterval(() => {
            state.casualties.friendly += rand(0, 3);
            state.casualties.enemy += rand(1, 5);
            dom.casualtyCount.textContent = formatNumber(state.casualties.friendly);
            dom.enemyCasualtyCount.textContent = formatNumber(state.casualties.enemy);
        }, 3000);
    }

    // ===========================
    // COMMAND BAR — ORDERS
    // ===========================
    function issueOrder() {
        const order = dom.orderSelect.value;
        const orderNames = {
            advance: 'ADVANCE ORDER TRANSMITTED',
            hold: 'HOLD POSITION — ACKNOWLEDGED',
            retreat: 'RETREAT ORDER — CONFIRMED',
            barrage: 'ARTILLERY BARRAGE COORDINATES LOCKED',
            airstrike: 'AIR STRIKE REQUESTED — ETA 20 MIN',
            reinforce: 'REINFORCEMENT REQUEST SENT TO HIGH COMMAND'
        };

        state.ordersIssued++;
        showToast(orderNames[order] || 'ORDER TRANSMITTED', 'success');

        // Flash telegraph
        dom.lightBulb.classList.add('off');
        dom.telegraphStatus.textContent = 'TRANSMITTING...';
        dom.telegraphStatus.className = 'telegraph-status off';

        setTimeout(() => {
            dom.lightBulb.classList.remove('off');
            dom.telegraphStatus.textContent = 'LINE CLEAR';
            dom.telegraphStatus.className = 'telegraph-status';
        }, 2000);

        // If radio is active, add a confirmation transmission
        if (state.radioActive) {
            setTimeout(() => {
                addTransmission({
                    prefix: '[TX-CONFIRM]',
                    text: `Order acknowledged: ${order.toUpperCase()}. All units executing. Over.`,
                    enigma: false
                });
            }, 2500);
        }
    }

    function sendScout() {
        state.scoutRevealed = !state.scoutRevealed;
        if (state.scoutRevealed) {
            // Reduce fog of war
            dom.fogOfWar.classList.remove('active');
            dom.fogOfWar.style.opacity = '0.2';
            dom.scoutBtn.innerHTML = '🔭 SCOUT DEPLOYED';
            dom.scoutBtn.classList.add('active');
            showToast('RECONNAISSANCE SCOUTS DEPLOYED — FOG LIFTED');
        } else {
            dom.fogOfWar.style.opacity = '';
            if (state.fogActive) dom.fogOfWar.classList.add('active');
            dom.scoutBtn.innerHTML = '🔭 SEND SCOUT';
            dom.scoutBtn.classList.remove('active');
            showToast('SCOUTS RECALLED');
        }
    }

    // ===========================
    // PROPAGANDA POSTER ROTATION
    // ===========================
    function startPosterRotation() {
        const posters = [dom.poster1, dom.poster2, dom.poster3];
        const posters2 = [dom.poster4, dom.poster5];
        let current = 0;
        let current2 = 0;

        state.posterInterval = setInterval(() => {
            // Left poster
            posters.forEach(p => p.style.display = 'none');
            posters[current].style.display = 'flex';
            posters[current].style.opacity = '0';
            setTimeout(() => {
                posters[current].style.transition = 'opacity 1s ease';
                posters[current].style.opacity = '1';
            }, 50);
            current = (current + 1) % posters.length;

            // Right poster
            posters2.forEach(p => p.style.display = 'none');
            posters2[current2].style.display = 'flex';
            posters2[current2].style.opacity = '0';
            setTimeout(() => {
                posters2[current2].style.transition = 'opacity 1.2s ease';
                posters2[current2].style.opacity = '1';
            }, 50);
            current2 = (current2 + 1) % posters2.length;
        }, 8000);
    }

    // ===========================
    // AMBIENT EFFECTS
    // ===========================

    // Subtle screen flicker
    function addAmbientFlicker() {
        setInterval(() => {
            if (!state.lampOn) return;
            const flicker = Math.random();
            if (flicker < 0.03) {
                dom.lampLight.style.opacity = '0.02';
                setTimeout(() => {
                    dom.lampLight.style.opacity = '';
                }, rand(50, 200));
            }
        }, 2000);
    }

    // Add random blinking cursor to radio feed
    function addRadioBlink() {
        const blinker = document.createElement('span');
        blinker.className = 'radio-blink';
        blinker.textContent = '▌';
        blinker.style.cssText = `
            font-family: 'Courier New', monospace;
            color: rgba(212,160,23,0.6);
            font-size: 0.7rem;
            padding: 10px 15px;
            display: block;
            animation: blink 1s step-end infinite;
        `;

        // Add blink keyframe if not exists
        if (!document.getElementById('blink-style')) {
            const style = document.createElement('style');
            style.id = 'blink-style';
            style.textContent = `
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        dom.radioFeed.appendChild(blinker);
    }

    // ===========================
    // MAP INTERACTION — CLICK TO ADD ENEMY CONTACT
    // ===========================
    function setupMapClick() {
        dom.mapContainer.addEventListener('click', (e) => {
            if (e.target.closest('.unit-marker')) return;

            const rect = dom.mapContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;

            // Small flash effect at click
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: absolute;
                left: ${pctX - 0.5}%;
                top: ${pctY - 0.5}%;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(212,160,23,0.6);
                box-shadow: 0 0 15px 5px rgba(212,160,23,0.4);
                transform: translate(-50%, -50%);
                z-index: 6;
                pointer-events: none;
                animation: mapFlash 1s ease-out forwards;
            `;
            dom.mapContainer.appendChild(flash);
            setTimeout(() => flash.remove(), 1000);
        });

        // Add keyframe
        if (!document.getElementById('mapflash-style')) {
            const s = document.createElement('style');
            s.id = 'mapflash-style';
            s.textContent = `
                @keyframes mapFlash {
                    0% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%,-50%) scale(3); opacity: 0; }
                }
            `;
            document.head.appendChild(s);
        }
    }

    // ===========================
    // KEYBOARD SHORTCUTS
    // ===========================
    function setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'l':
                    toggleLamp();
                    break;
                case 'n':
                    toggleNightVision();
                    break;
                case 'g':
                    toggleGrid();
                    break;
                case 'r':
                    toggleRadio();
                    break;
                case 'f':
                    toggleFogOfWar();
                    break;
                case ' ':
                    e.preventDefault();
                    issueOrder();
                    break;
                case 's':
                    sendScout();
                    break;
            }
        });
    }

    // ===========================
    // COMPASS ROTATION (subtle)
    // ===========================
    function animateCompass() {
        const rose = dom.compassRose;
        let angle = 0;
        setInterval(() => {
            angle += 0.1;
            rose.style.transform = `rotate(${Math.sin(angle * 0.02) * 3}deg)`;
        }, 100);
    }

    // ===========================
    // INITIALIZATION
    // ===========================
    function init() {
        // Generate overlays
        generateRivetOverlay();
        generateGridCoordinates();

        // Start systems
        initGauges();
        startRadioFeed();
        startCasualtyCounter();
        startPosterRotation();
        addAmbientFlicker();
        addRadioBlink();
        animateSignalBars();
        animateCompass();
        setupUnitDrag();
        setupUnitTooltips();
        setupMapClick();
        setupKeyboard();

        // Clock
        setInterval(updateClock, 1000);
        updateClock();

        // Button listeners
        dom.lampToggle.addEventListener('click', toggleLamp);
        dom.nightVisionToggle.addEventListener('click', toggleNightVision);
        dom.mapToggle.addEventListener('click', toggleGrid);
        dom.radioToggle.addEventListener('click', toggleRadio);
        dom.issueOrderBtn.addEventListener('click', issueOrder);
        dom.scoutBtn.addEventListener('click', sendScout);

        // Fog toggle on map click right button
        dom.mapContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            toggleFogOfWar();
        });

        console.log('%c⚡ STRATEGIC COMMAND WAR ROOM ACTIVE ⚡', 'color: #d4a017; font-size: 16px; font-weight: bold; background: #1a1d24; padding: 8px; font-family: monospace;');
        console.log('%cKeyboard shortcuts: L=Lamp | N=Night Vision | G=Grid | R=Radio | F=Fog | Space=Order | S=Scout', 'color: #8a8a8a; font-family: monospace; font-size: 11px;');
    }

    // Launch
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();