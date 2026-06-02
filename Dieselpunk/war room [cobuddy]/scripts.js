// ============================================
// WAR ROOM — STRATEGIC COMMAND ALPHA
// 1940s Alternate-History Military Interface
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Clock Display ----
    const clockTime = document.getElementById('clockTime');
    const clockDate = document.getElementById('clockDate');

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockTime.textContent = `${hours}:${minutes}`;

        const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
                        'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        clockDate.textContent = `${day} ${month.toUpperCase()} ${year}`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ---- Mission Elapsed Time ----
    const missionClock = document.getElementById('missionClock');
    let missionSeconds = 51787; // starting elapsed seconds

    function updateMissionClock() {
        missionSeconds++;
        const hrs = String(Math.floor(missionSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((missionSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(missionSeconds % 60).padStart(2, '0');
        missionClock.textContent = `MISSION ELAPSED: ${hrs}:${mins}:${secs}`;
    }

    setInterval(updateMissionClock, 1000);

    // ---- Unit Drag & Drop on Map ----
    const mapArea = document.getElementById('mapArea');
    const unitMarkers = document.querySelectorAll('.unit-marker');

    unitMarkers.forEach(marker => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        marker.addEventListener('mousedown', (e) => {
            isDragging = true;
            marker.style.zIndex = 100;
            const rect = mapArea.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseFloat(marker.style.left);
            initialTop = parseFloat(marker.style.top);

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = mapArea.getBoundingClientRect();
            const deltaX = ((e.clientX - startX) / rect.width) * 100;
            const deltaY = ((e.clientY - startY) / rect.height) * 100;
            let newLeft = Math.max(0, Math.min(95, initialLeft + deltaX));
            let newTop = Math.max(0, Math.min(95, initialTop + deltaY));
            marker.style.left = newLeft + '%';
            marker.style.top = newTop + '%';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                marker.style.zIndex = 10;
            }
        });
    });

    // ---- Drag from Inventory to Map ----
    const inventoryItems = document.querySelectorAll('.inventory-item');
    let draggedType = null;

    inventoryItems.forEach(item => {
        item.addEventListener('mousedown', () => {
            draggedType = item.dataset.type;
        });
    });

    mapArea.addEventListener('mouseup', (e) => {
        if (!draggedType) return;
        const rect = mapArea.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (x >= 0 && x <= 95 && y >= 0 && y <= 95) {
            const newMarker = document.createElement('div');
            newMarker.className = 'unit-marker friendly ' + draggedType;
            newMarker.dataset.unit = 'NEW-' + Math.floor(Math.random() * 999);
            newMarker.style.left = x + '%';
            newMarker.style.top = y + '%';
            newMarker.draggable = true;

            const shape = document.createElement('div');
            shape.className = 'marker-shape';

            const label = document.createElement('span');
            label.className = 'marker-label';
            label.textContent = newMarker.dataset.unit;

            const symbols = {
                armored: '◆',
                infantry: '●',
                artillery: '▲',
                air: '✦'
            };
            shape.innerHTML = symbols[draggedType] || '●';
            newMarker.appendChild(shape);
            newMarker.appendChild(label);

            // Make new marker draggable
            let isDraggingNew = false;
            let startXNew, startYNew, initLeftNew, initTopNew;

            newMarker.addEventListener('mousedown', (ev) => {
                isDraggingNew = true;
                newMarker.style.zIndex = 100;
                const mapRect = mapArea.getBoundingClientRect();
                startXNew = ev.clientX;
                startYNew = ev.clientY;
                initLeftNew = parseFloat(newMarker.style.left);
                initTopNew = parseFloat(newMarker.style.top);
                ev.stopPropagation();
            });

            document.addEventListener('mousemove', (ev) => {
                if (!isDraggingNew) return;
                const mapRect = mapArea.getBoundingClientRect();
                const dX = ((ev.clientX - startXNew) / mapRect.width) * 100;
                const dY = ((ev.clientY - startYNew) / mapRect.height) * 100;
                newMarker.style.left = Math.max(0, Math.min(95, initLeftNew + dX)) + '%';
                newMarker.style.top = Math.max(0, Math.min(95, initTopNew + dY)) + '%';
            });

            document.addEventListener('mouseup', () => {
                if (isDraggingNew) {
                    isDraggingNew = false;
                    newMarker.style.zIndex = 10;
                }
            });

            mapArea.appendChild(newMarker);
            draggedType = null;
        }
    });

    // ---- Random Deploy Button ----
    document.getElementById('btnRandomDeploy').addEventListener('click', () => {
        const types = ['armored', 'infantry', 'artillery', 'air'];
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const marker = document.createElement('div');
            marker.className = 'unit-marker friendly ' + type;
            marker.dataset.unit = 'RD-' + String(Math.floor(Math.random() * 999)).padStart(3, '0');
            marker.style.left = (5 + Math.random() * 85) + '%';
            marker.style.top = (5 + Math.random() * 85) + '%';
            marker.draggable = true;

            const shape = document.createElement('div');
            shape.className = 'marker-shape';

            const label = document.createElement('span');
            label.className = 'marker-label';
            label.textContent = marker.dataset.unit;

            const symbols = { armored: '◆', infantry: '●', artillery: '▲', air: '✦' };
            shape.innerHTML = symbols[type] || '●';
            marker.appendChild(shape);
            marker.appendChild(label);

            mapArea.appendChild(marker);

            // Make draggable
            let dragging = false;
            let sX, sY, il, it;

            marker.addEventListener('mousedown', (ev) => {
                dragging = true;
                marker.style.zIndex = 100;
                const r = mapArea.getBoundingClientRect();
                sX = ev.clientX; sY = ev.clientY;
                il = parseFloat(marker.style.left);
                it = parseFloat(marker.style.top);
                ev.stopPropagation();
            });

            document.addEventListener('mousemove', (ev) => {
                if (!dragging) return;
                const r = mapArea.getBoundingClientRect();
                marker.style.left = Math.max(0, Math.min(95, il + ((ev.clientX - sX) / r.width) * 100)) + '%';
                marker.style.top = Math.max(0, Math.min(95, it + ((ev.clientY - sY) / r.height) * 100)) + '%';
            });

            document.addEventListener('mouseup', () => { if (dragging) { dragging = false; marker.style.zIndex = 10; } });
        }
    });

    // ---- Clear Markers Button ----
    document.getElementById('btnClearMap').addEventListener('click', () => {
        const markers = mapArea.querySelectorAll('.unit-marker');
        markers.forEach((m, i) => {
            m.style.opacity = '1';
            setTimeout(() => { m.style.transition = 'opacity 0.5s'; m.style.opacity = '0'; }, i * 50);
            setTimeout(() => m.remove(), 600 + i * 50);
        });
    });

    // ---- Radio Intercept Log — Auto-adding entries ----
    const interceptLog = document.getElementById('interceptLog');
    const radioFeed = document.getElementById('radioFeed');

    const messages = [
        { call: 'BLG-7:', msg: 'Perimeter watch reports activity east of checkpoint.' },
        { call: 'KRL-2:', msg: 'Enemy column halted at ridge line. Awaiting contact.' },
        { call: 'XJF-9:', msg: 'Air support sortie delayed due to weather conditions.' },
        { call: 'MRN-1:', msg: 'Patrol boat returns. No contacts in sector.' },
        { call: 'ART-4:', msg: 'Battery reserves adjusted. Requesting resupply.' },
        { call: 'SIG-3:', msg: 'New cipher key transmitted. Update equipment immediately.' },
        { call: 'BLG-7:', msg: 'Scout team confirms bridge intact at grid reference 47-22.' },
        { call: 'KRL-2:', msg: 'Ambush position set along supply route alpha.' },
        { call: 'XJF-9:', msg: 'Damage report: two aircraft down. Crews accounted for.' },
        { call: 'MRN-1:', msg: 'Submarine spotted. Depth charge deployed. No confirmation of hit.' },
        { call: 'ART-4:', msg: 'Counter-battery fire effective. Enemy position neutralized.' },
        { call: 'SIG-3:', msg: 'Decrypted traffic: enemy planning offensive in 48 hours.' },
        { call: 'BLG-7:', msg: 'Civilian evacuations proceeding on schedule.' },
        { call: 'KRL-2:', msg: 'Recon confirms enemy armor concentration at northern bridge.' },
        { call: 'XJF-9:', msg: 'Intercept: enemy requesting air cover for advance.' },
        { call: 'MRN-1:', msg: 'Coastal defense status: all stations manned and ready.' },
        { call: 'ART-4:', msg: 'Ammunition expenditure within acceptable parameters.' },
        { call: 'SIG-3:', msg: 'Traffic analysis suggests enemy supply shortage.' },
    ];

    let messageIndex = 0;
    let lastLogTime = '03:42';

    function addLogEntry() {
        const entry = messages[messageIndex % messages.length];
        messageIndex++;

        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${h}:${m}`;

        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.dataset.time = timeStr;
        logEntry.innerHTML = `
            <span class="log-time">${timeStr}</span>
            <span class="log-call">${entry.call}</span>
            <span class="log-msg">${entry.msg}</span>
        `;

        interceptLog.insertBefore(logEntry, interceptLog.firstChild);

        // Keep only last 10 entries
        while (interceptLog.children.length > 10) {
            interceptLog.removeChild(interceptLog.lastChild);
        }

        lastLogTime = timeStr;

        // Flash the log briefly
        logEntry.style.background = 'rgba(255,191,0,0.05)';
        setTimeout(() => { logEntry.style.transition = 'background 1s'; logEntry.style.background = ''; }, 100);
    }

    // Add new entry every 8 seconds
    setInterval(addLogEntry, 8000);

    // ---- Radio Frequency Animation ----
    const radioFreq = document.getElementById('radioFreq');
    const freqBase = 14.780;
    setInterval(() => {
        const variation = (Math.random() - 0.5) * 0.004;
        radioFreq.textContent = (freqBase + variation).toFixed(3) + ' MHz';
    }, 2000);

    // ---- Crackle Indicator ----
    const crackleIndicator = document.getElementById('crackleIndicator');
    setInterval(() => {
        if (Math.random() > 0.5) {
            crackleIndicator.style.opacity = '0.8';
            setTimeout(() => { crackleIndicator.style.opacity = '0.3'; }, 150);
        }
    }, 500);

    // ---- Propaganda Carousel ----
    const posters = document.querySelectorAll('.propaganda-poster');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevPoster');
    const nextBtn = document.getElementById('nextPoster');
    let currentPoster = 0;

    function showPoster(index) {
        posters.forEach((p, i) => {
            p.classList.toggle('active', i === index);
        });
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
        currentPoster = index;
    }

    nextBtn.addEventListener('click', () => {
        showPoster((currentPoster + 1) % posters.length);
    });

    prevBtn.addEventListener('click', () => {
        showPoster((currentPoster - 1 + posters.length) % posters.length);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showPoster(parseInt(dot.dataset.poster));
        });
    });

    // Auto-rotate every 12 seconds
    setInterval(() => {
        showPoster((currentPoster + 1) % posters.length);
    }, 12000);

    // ---- Analog Gauge Animation ----
    const gauges = [
        { id: 'gaugeAmmo', value: 67 },
        { id: 'gaugeFuel', value: 52 },
        { id: 'gaugeManpower', value: 81 },
        { id: 'gaugeMorale', value: 73 }
    ];

    function animateGauge(gauge) {
        const needle = document.querySelector(`#${gauge.id} .gauge-needle`);
        const valueDisplay = document.querySelector(`#${gauge.id} .gauge-value`);
        const face = document.querySelector(`#${gauge.id} .gauge-face`);

        // Random fluctuation
        const change = (Math.random() - 0.5) * 8;
        gauge.value = Math.max(10, Math.min(95, gauge.value + change));

        // Needle angle: 0% = 180deg (left), 100% = 0deg (right)
        const angle = 180 - (gauge.value / 100) * 180;
        needle.style.setProperty('--angle', angle + 'deg');
        valueDisplay.textContent = Math.round(gauge.value) + '%';

        // Subtle pulse on the gauge face
        face.style.boxShadow = `inset 0 2px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5), 0 0 1px rgba(184,134,11,0.3)`;
    }

    // Animate gauges every 3 seconds with staggered timing
    setInterval(() => animateGauge(gauges[0]), 3000);
    setInterval(() => animateGauge(gauges[1]), 3500);
    setInterval(() => animateGauge(gauges[2]), 4000);
    setInterval(() => animateGauge(gauges[3]), 4500);

    // ---- Signal Strength Bars Animation ----
    const signalBars = document.querySelectorAll('.signal-bars .bar');
    setInterval(() => {
        signalBars.forEach(bar => {
            const randomHeight = 30 + Math.random() * 70;
            bar.style.height = randomHeight + '%';
        });
    }, 1500);

    // ---- Casualty Count Animation ----
    const casualtyCount = document.getElementById('casualtyCount');
    let casualties = 2847;
    setInterval(() => {
        if (Math.random() > 0.7) {
            casualties += Math.floor(Math.random() * 3);
            casualtyCount.textContent = casualties.toLocaleString();
            casualtyCount.style.color = '#cc2200';
            setTimeout(() => { casualtyCount.style.transition = 'color 1s'; casualtyCount.style.color = ''; }, 200);
        }
    }, 5000);

    // ---- Lamp Flicker Enhancement ----
    const lampBulb = document.querySelector('.lamp-bulb');
    setInterval(() => {
        if (Math.random() > 0.85) {
            lampBulb.style.opacity = '0.6';
            setTimeout(() => { lampBulb.style.transition = 'opacity 0.3s'; lampBulb.style.opacity = '1'; }, 100);
        }
    }, 3000);

    // ---- Map Grid Cell Hover Effects ----
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            cell.style.background = 'rgba(184,134,11,0.04)';
        });
        cell.addEventListener('mouseleave', () => {
            cell.style.background = 'transparent';
        });
    });

    // ---- Deploy Inventory Drag Preview ----
    inventoryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.borderColor = 'var(--brass-light)';
            item.style.boxShadow = '0 0 8px rgba(184,134,11,0.3)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.borderColor = '';
            item.style.boxShadow = '';
        });
    });

    // ---- Lamp Reflection Pulse ----
    const lampReflection = document.querySelector('.lamp-reflection');
    setInterval(() => {
        lampReflection.style.opacity = '0.6';
        setTimeout(() => { lampReflection.style.transition = 'opacity 2s'; lampReflection.style.opacity = '1'; }, 200);
    }, 7000);

    // ---- Ambient Sound Toggle Placeholder ----
    // A visual indicator for radio static
    const crackleBar = document.querySelector('.crackle-bar');
    crackleBar.addEventListener('click', () => {
        crackleBar.style.background = '#222';
        setTimeout(() => { crackleBar.style.transition = 'background 0.5s'; crackleBar.style.background = '#111'; }, 100);
    });

    // ---- Console Button Press Effects ----
    const btnActions = document.querySelectorAll('.btn-action');
    btnActions.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.96)';
            setTimeout(() => { btn.style.transition = 'transform 0.2s'; btn.style.transform = ''; }, 150);
        });
    });

    // ---- Brief Flash on New Intel ----
    const intelBrief = document.querySelector('.intel-brief');
    function flashIntel() {
        intelBrief.style.transition = 'background 0.3s';
        intelBrief.style.background = 'rgba(255,191,0,0.03)';
        setTimeout(() => { intelBrief.style.background = ''; }, 500);
    }
    setInterval(flashIntel, 20000);

    // ---- Unit Marker Hover Tooltip ----
    const allMarkers = document.querySelectorAll('.unit-marker');
    allMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            marker.style.filter = 'brightness(1.3)';
        });
        marker.addEventListener('mouseleave', () => {
            marker.style.filter = '';
        });
    });

    // ---- Weather Condition Random Update ----
    const conditionValues = document.querySelectorAll('.condition-value');
    const weatherOptions = {
        overcast: ['OVERCAST', 'HEAVY CLOUDS', 'PARTLY CLOUDY', 'CLOUDY'],
        wind: ['15 KNOTS NW', '20 KNOTS NE', '10 KNOTS SW', 'CALM'],
        precipitation: ['LIKELY 1400H', 'SCATTERED SHOWERS', 'DRIZZLE EXPECTED', 'CLEAR'],
        temp: ['4°C', '2°C', '6°C', '1°C']
    };

    setInterval(() => {
        const items = document.querySelectorAll('.condition-item');
        const randomItem = items[Math.floor(Math.random() * items.length)];
        const label = randomItem.querySelector('.condition-label').textContent.toLowerCase();
        const values = weatherOptions[label] || [];
        if (values.length) {
            randomItem.querySelector('.condition-value').textContent = values[Math.floor(Math.random() * values.length)];
        }
    }, 15000);

    // ---- Production Quota Slow Change ----
    const prodBars = document.querySelectorAll('.prod-bar');
    setInterval(() => {
        prodBars.forEach(bar => {
            const currentWidth = parseFloat(bar.style.width);
            const change = (Math.random() - 0.4) * 2;
            const newWidth = Math.max(10, Math.min(100, currentWidth + change));
            bar.style.width = newWidth + '%';
            const valueSpan = bar.closest('.production-item').querySelector('.prod-value');
            const label = bar.closest('.production-item').querySelector('.prod-label').textContent;
            valueSpan.textContent = `${Math.round(newWidth)} / 100`;
        });
    }, 10000);

    // ---- Console Log Initial Boot Message ----
    console.log('%c⚙ STRATEGIC COMMAND — WAR ROOM ALPHA', 'color: #b8860b; font-size: 16px; font-weight: bold;');
    console.log('%cAll systems operational. Theater of operations: Sector 7.', 'color: #ffbf00; font-size: 11px;');
    console.log('%cClassification: TOP SECRET', 'color: #8b0000; font-size: 11px;');

});