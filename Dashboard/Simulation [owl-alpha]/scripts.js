/* ============================================================
   PLANETARYOS v4.7.2 — GLOBAL MONITORING DASHBOARD SCRIPTS
   Real-time data simulation, animations, and interactivity
   ============================================================ */

(function () {
    'use strict';

    /* --------------------------------------------------
       UTILITY FUNCTIONS
       -------------------------------------------------- */
    function pad(n, width) {
        const s = String(n);
        return s.length >= width ? s : new Array(width - s.length + 1).join('0') + s;
    }

    function formatNumber(n) {
        return n.toLocaleString('en-US');
    }

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomBetween(min, max + 1));
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /* --------------------------------------------------
       CLOCK SYSTEM
       -------------------------------------------------- */
    function updateClocks() {
        const now = new Date();
        const utc = now.toISOString().substr(11, 12);
        const local = pad(now.getHours(), 2) + ':' + pad(now.getMinutes(), 2) + ':' + pad(now.getSeconds(), 2);

        const utcEl = document.getElementById('utc-time');
        const localEl = document.getElementById('local-time');
        const jdEl = document.getElementById('julian-date');

        if (utcEl) utcEl.textContent = utc;
        if (localEl) localEl.textContent = local;

        if (jdEl) {
            const jd = 2440587.5 + now.getTime() / 86400000;
            jdEl.textContent = jd.toFixed(4);
        }
    }

    setInterval(updateClocks, 50);
    updateClocks();

    /* --------------------------------------------------
       POPULATION COUNTER — LIVE TICKING
       -------------------------------------------------- */
    let currentPop = 8152847293;
    const birthRate = 2.33; // per second
    let popAccumulator = 0;

    function updatePopulation() {
        popAccumulator += birthRate / 20; // called every 50ms
        if (popAccumulator >= 1) {
            currentPop += Math.floor(popAccumulator);
            popAccumulator -= Math.floor(popAccumulator);
        }
        const popEl = document.getElementById('pop-counter');
        if (popEl) {
            popEl.textContent = formatNumber(currentPop);
        }
    }

    setInterval(updatePopulation, 50);

    /* --------------------------------------------------
       SEISMIC WAVEFORM — ANIMATED SVG
       -------------------------------------------------- */
    const waveformPoints = [];
    const WAVEFORM_LENGTH = 200;
    let waveformPhase = 0;

    function initWaveform() {
        for (let i = 0; i < WAVEFORM_LENGTH; i++) {
            waveformPoints.push(20);
        }
    }

    function updateWaveform() {
        const line = document.getElementById('waveform-line');
        if (!line) return;

        waveformPhase += 0.15;

        let val = 20;
        val += Math.sin(waveformPhase) * 3;
        val += Math.sin(waveformPhase * 2.3) * 2;
        val += Math.sin(waveformPhase * 5.7) * 1.5;
        val += (Math.random() - 0.5) * 6;

        if (Math.random() < 0.02) {
            val += (Math.random() - 0.5) * 15;
        }

        val = Math.max(2, Math.min(38, val));
        waveformPoints.push(val);
        waveformPoints.shift();

        const points = waveformPoints.map((v, i) => {
            const x = (i / (WAVEFORM_LENGTH - 1)) * 400;
            return x + ',' + v;
        }).join(' ');

        line.setAttribute('points', points);
    }

    initWaveform();
    setInterval(updateWaveform, 50);

    /* --------------------------------------------------
       SPARKLINE GENERATOR
       -------------------------------------------------- */
    function generateSparkline(containerId, color, trend) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 20');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.display = 'block';

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', color);
        polyline.setAttribute('stroke-width', '1');
        polyline.setAttribute('stroke-linecap', 'round');
        polyline.setAttribute('stroke-linejoin', 'round');

        const points = [];
        let v = 10;
        for (let i = 0; i <= 24; i++) {
            v += (Math.random() - 0.48) * 3 + trend * 0.3;
            v = Math.max(2, Math.min(18, v));
            points.push((i / 24) * 100 + ',' + v);
        }

        polyline.setAttribute('points', points.join(' '));
        svg.appendChild(polyline);
        container.appendChild(svg);
    }

    const sparklineConfigs = [
        { id: 'co2-sparkline', color: '#ff3344', trend: 0.5 },
        { id: 'ch4-sparkline', color: '#ff6600', trend: 0.8 },
        { id: 'o2-sparkline', color: '#33ff66', trend: 0 },
        { id: 'n2o-sparkline', color: '#ffaa00', trend: 0.3 },
        { id: 'ozone-sparkline', color: '#3388ff', trend: -0.2 },
        { id: 'aerosol-sparkline', color: '#aa44ff', trend: 0.4 }
    ];

    sparklineConfigs.forEach(cfg => {
        generateSparkline(cfg.id, cfg.color, cfg.trend);
    });

    /* --------------------------------------------------
       MARKET SPARKLINES
       -------------------------------------------------- */
    function generateMarketSparkline(container, color) {
        if (!container) return;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 60 14');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.display = 'block';

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', color);
        polyline.setAttribute('stroke-width', '1');
        polyline.setAttribute('stroke-linecap', 'round');

        const points = [];
        let v = 7;
        for (let i = 0; i <= 20; i++) {
            v += (Math.random() - 0.48) * 2;
            v = Math.max(1, Math.min(13, v));
            points.push((i / 20) * 60 + ',' + v);
        }

        polyline.setAttribute('points', points.join(' '));
        svg.appendChild(polyline);
        container.appendChild(svg);
    }

    document.querySelectorAll('.mkt-spark').forEach(el => {
        const parent = el.closest('.market-item');
        const chg = parent ? parent.querySelector('.mkt-chg') : null;
        const color = chg && chg.classList.contains('green') ? '#33ff66' : '#ff3344';
        generateMarketSparkline(el, color);
    });

    /* --------------------------------------------------
       WORLD MAP RENDERING — SIMPLIFIED CONTINENTS
       -------------------------------------------------- */
    function renderWorldMap() {
        const landmassesGroup = document.getElementById('map-landmasses');
        const gridGroup = document.getElementById('map-grid');
        const eventsGroup = document.getElementById('map-events');
        const terminatorGroup = document.getElementById('map-terminator');
        const cyclonesGroup = document.getElementById('map-cyclones');
        const tradeRoutesGroup = document.getElementById('map-trade-routes');

        if (!landmassesGroup) return;

        const continentPaths = [
            // North America
            "M 80,60 L 95,55 L 115,50 L 130,55 L 145,60 L 155,70 L 160,85 L 155,100 L 145,110 L 135,120 L 130,135 L 125,150 L 115,160 L 105,165 L 95,160 L 85,150 L 75,140 L 70,125 L 65,110 L 60,95 L 65,80 L 70,70 Z",
            // South America
            "M 130,175 L 140,170 L 150,175 L 155,190 L 160,210 L 158,230 L 155,250 L 150,270 L 145,290 L 140,310 L 135,330 L 128,345 L 120,350 L 115,340 L 112,320 L 110,300 L 112,280 L 115,260 L 118,240 L 120,220 L 122,200 L 125,185 Z",
            // Europe
            "M 440,55 L 455,50 L 470,52 L 485,55 L 495,60 L 500,70 L 495,80 L 485,85 L 475,90 L 465,95 L 455,100 L 445,105 L 435,100 L 430,90 L 432,75 L 435,65 Z",
            // Africa
            "M 440,120 L 455,115 L 470,118 L 485,120 L 495,130 L 500,145 L 505,165 L 508,185 L 505,205 L 500,225 L 495,245 L 488,260 L 480,270 L 470,275 L 460,270 L 450,260 L 442,245 L 438,225 L 435,205 L 433,185 L 435,165 L 437,145 L 438,130 Z",
            // Asia (simplified)
            "M 500,45 L 520,40 L 550,38 L 580,40 L 610,42 L 640,45 L 670,50 L 690,55 L 700,65 L 695,80 L 685,90 L 670,95 L 650,100 L 630,105 L 610,110 L 590,115 L 570,118 L 550,120 L 530,118 L 515,115 L 505,105 L 500,90 L 498,75 L 497,60 Z",
            // India subcontinent
            "M 590,120 L 600,125 L 605,140 L 600,160 L 595,175 L 588,185 L 580,180 L 575,165 L 578,150 L 582,135 L 585,125 Z",
            // Southeast Asia
            "M 650,110 L 665,115 L 675,125 L 680,140 L 675,155 L 665,160 L 655,155 L 648,145 L 645,130 L 646,118 Z",
            // Australia
            "M 700,230 L 720,225 L 745,228 L 765,235 L 775,250 L 770,270 L 760,285 L 745,290 L 725,288 L 710,280 L 702,265 L 698,250 L 697,240 Z",
            // Japan
            "M 710,70 L 715,65 L 720,70 L 718,80 L 714,88 L 710,85 L 708,78 Z",
            // UK/Ireland
            "M 425,58 L 430,55 L 435,58 L 433,65 L 428,68 L 424,64 Z",
            // Indonesia archipelago
            "M 660,170 L 675,168 L 690,172 L 705,175 L 715,180 L 710,185 L 695,188 L 680,185 L 668,180 L 660,175 Z",
            // New Zealand
            "M 790,290 L 795,285 L 800,290 L 798,300 L 793,305 L 788,298 Z",
            // Greenland
            "M 280,25 L 300,20 L 320,22 L 335,30 L 340,45 L 330,55 L 315,58 L 300,55 L 288,48 L 282,38 Z",
            // Antarctica hint
            "M 100,420 L 200,415 L 350,418 L 500,415 L 650,418 L 800,415 L 900,420 L 900,460 L 100,460 Z",
            // Central America
            "M 115,140 L 120,138 L 125,142 L 128,150 L 125,158 L 120,160 L 116,155 L 114,148 Z",
            // Middle East
            "M 500,100 L 515,98 L 530,102 L 540,110 L 535,120 L 525,125 L 512,122 L 502,115 L 498,108 Z",
            // Scandinavia
            "M 460,35 L 470,30 L 480,32 L 485,42 L 480,52 L 472,55 L 465,50 L 460,42 Z",
            // Madagascar
            "M 520,240 L 525,235 L 530,240 L 528,255 L 524,260 L 520,255 L 518,245 Z",
            // Philippines
            "M 695,130 L 700,128 L 705,132 L 703,142 L 698,145 L 694,140 L 693,134 Z",
            // Papua New Guinea
            "M 735,195 L 750,192 L 760,196 L 758,205 L 748,208 L 738,204 L 733,198 Z"
        ];

        continentPaths.forEach(d => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('fill', '#0c1a14');
            path.setAttribute('stroke', '#1a3a2a');
            path.setAttribute('stroke-width', '0.5');
            landmassesGroup.appendChild(path);
        });

        // Grid lines
        if (gridGroup) {
            for (let lon = -180; lon <= 180; lon += 30) {
                const x = (lon + 180) / 360 * 1000;
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x);
                line.setAttribute('y1', 0);
                line.setAttribute('x2', x);
                line.setAttribute('y2', 500);
                line.setAttribute('stroke', '#0d1f18');
                line.setAttribute('stroke-width', '0.3');
                gridGroup.appendChild(line);
            }
            for (let lat = -90; lat <= 90; lat += 30) {
                const y = (90 - lat) / 180 * 500;
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 0);
                line.setAttribute('y1', y);
                line.setAttribute('x2', 1000);
                line.setAttribute('y2', y);
                line.setAttribute('stroke', '#0d1f18');
                line.setAttribute('stroke-width', '0.3');
                gridGroup.appendChild(line);
            }
        }

        // Equator
        if (gridGroup) {
            const equator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            equator.setAttribute('x1', 0);
            equator.setAttribute('y1', 250);
            equator.setAttribute('x2', 1000);
            equator.setAttribute('y2', 250);
            equator.setAttribute('stroke', '#1a3020');
            equator.setAttribute('stroke-width', '0.5');
            equator.setAttribute('stroke-dasharray', '4,4');
            gridGroup.appendChild(equator);
        }

        // Event markers
        const eventMarkers = [
            { x: 138, y: 195, color: '#ff3344', size: 4, label: 'Sabancaya', pulse: true },
            { x: 448, y: 52, color: '#ff3344', size: 3.5, label: 'Krafla', pulse: true },
            { x: 472, y: 88, color: '#ff6600', size: 3, label: 'Etna', pulse: true },
            { x: 685, y: 62, color: '#ffdd00', size: 2.5, label: 'Shiveluch' },
            { x: 755, y: 255, color: '#33ff66', size: 2, label: 'Mauna Loa' },
            { x: 702, y: 82, color: '#33ff66', size: 2, label: 'Sakurajima' },
            { x: 105, y: 100, color: '#ff6600', size: 3, label: 'Popocatepetl' },
            { x: 102, y: 118, color: '#ff6600', size: 2.5, label: 'M6.2 Quake' },
            { x: 708, y: 78, color: '#ff6600', size: 2.5, label: 'M5.8 Japan' },
            { x: 610, y: 155, color: '#ffdd00', size: 2, label: 'M5.1 Sumatra' },
            { x: 510, y: 108, color: '#ffdd00', size: 1.5, label: 'M4.7 Iran' },
            { x: 460, y: 72, color: '#ffdd00', size: 1.5, label: 'M4.3 Mid-Atl' },
            { x: 132, y: 200, color: '#ffdd00', size: 1.5, label: 'M4.1 Chile' },
            { x: 660, y: 75, color: '#33ff66', size: 1.5, label: 'M3.8 Aleutian' },
            { x: 600, y: 100, color: '#33ff66', size: 1.5, label: 'M3.4 Himalaya' }
        ];

        eventMarkers.forEach(em => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            if (em.pulse) {
                const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                pulse.setAttribute('cx', em.x);
                pulse.setAttribute('cy', em.y);
                pulse.setAttribute('r', em.size * 2);
                pulse.setAttribute('fill', em.color);
                pulse.setAttribute('opacity', '0.15');
                pulse.style.animation = 'pulse 2s ease-in-out infinite';
                g.appendChild(pulse);
            }

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', em.x);
            circle.setAttribute('cy', em.y);
            circle.setAttribute('r', em.size);
            circle.setAttribute('fill', em.color);
            circle.setAttribute('stroke', '#000');
            circle.setAttribute('stroke-width', '0.3');
            g.appendChild(circle);

            eventsGroup.appendChild(g);
        });

        // Cyclone markers
        const cycloneMarkers = [
            { x: 720, y: 130, cat: 5, label: 'ILANA' },
            { x: 560, y: 200, cat: 3, label: 'MARCUS' },
            { x: 145, y: 145, cat: 1, label: 'NOVA' },
            { x: 595, y: 155, cat: 0, label: 'ANTHEA' },
            { x: 410, y: 80, cat: 0, label: 'JULIAN' }
        ];

        cycloneMarkers.forEach(c => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            const outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            outer.setAttribute('cx', c.x);
            outer.setAttribute('cy', c.y);
            outer.setAttribute('r', c.cat >= 3 ? 6 : 4);
            outer.setAttribute('fill', 'none');
            outer.setAttribute('stroke', '#00ffc8');
            outer.setAttribute('stroke-width', '0.5');
            outer.setAttribute('opacity', '0.4');
            g.appendChild(outer);

            const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            inner.setAttribute('cx', c.x);
            inner.setAttribute('cy', c.y);
            inner.setAttribute('r', c.cat >= 3 ? 3 : 2);
            inner.setAttribute('fill', '#00ffc8');
            inner.setAttribute('opacity', '0.6');
            g.appendChild(inner);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', c.x + 7);
            label.setAttribute('y', c.y + 2);
            label.setAttribute('fill', '#00ffc8');
            label.setAttribute('font-size', '5');
            label.setAttribute('font-family', 'Share Tech Mono, monospace');
            label.textContent = c.label;
            g.appendChild(label);

            cyclonesGroup.appendChild(g);
        });

        // Trade routes (curved paths)
        const tradeRoutes = [
            { d: "M 700,100 Q 400,50 130,100", opacity: 0.4 },
            { d: "M 700,100 Q 580,70 460,70", opacity: 0.35 },
            { d: "M 130,100 Q 280,60 460,70", opacity: 0.2 },
            { d: "M 700,100 Q 720,180 740,250", opacity: 0.15 },
            { d: "M 500,110 Q 490,130 480,150", opacity: 0.1 }
        ];

        tradeRoutes.forEach(route => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', route.d);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#ffaa00');
            path.setAttribute('stroke-width', '0.8');
            path.setAttribute('stroke-dasharray', '3,2');
            path.setAttribute('opacity', route.opacity);
            tradeRoutesGroup.appendChild(path);
        });

        // Day/night terminator
        if (terminatorGroup) {
            const now = new Date();
            const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
            const subsolarLon = 15 * (12 - hours);
            const terminatorX = ((subsolarLon + 180) % 360) / 360 * 1000;

            const dayRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            dayRect.setAttribute('x', terminatorX - 200 < 0 ? 0 : terminatorX - 200);
            dayRect.setAttribute('y', 0);
            dayRect.setAttribute('width', terminatorX - 200 < 0 ? terminatorX : 200);
            dayRect.setAttribute('height', 500);
            dayRect.setAttribute('fill', 'url(#daylight-gradient)');
            terminatorGroup.appendChild(dayRect);

            if (terminatorX - 200 < 0) {
                const wrapRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                wrapRect.setAttribute('x', 1000 + (terminatorX - 200));
                wrapRect.setAttribute('y', 0);
                wrapRect.setAttribute('width', 200 - terminatorX);
                wrapRect.setAttribute('height', 500);
                wrapRect.setAttribute('fill', 'url(#daylight-gradient)');
                terminatorGroup.appendChild(wrapRect);
            }

            const nightRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            nightRect.setAttribute('x', terminatorX);
            nightRect.setAttribute('y', 0);
            nightRect.setAttribute('width', 1000 - terminatorX);
            nightRect.setAttribute('height', 500);
            nightRect.setAttribute('fill', 'rgba(0,0,20,0.35)');
            terminatorGroup.appendChild(nightRect);

            const termLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            termLine.setAttribute('x1', terminatorX);
            termLine.setAttribute('y1', 0);
            termLine.setAttribute('x2', terminatorX);
            termLine.setAttribute('y2', 500);
            termLine.setAttribute('stroke', '#ffd700');
            termLine.setAttribute('stroke-width', '0.5');
            termLine.setAttribute('opacity', '0.3');
            terminatorGroup.appendChild(termLine);
        }
    }

    renderWorldMap();

    /* --------------------------------------------------
       MAP COORDINATE TRACKING
       -------------------------------------------------- */
    const mapContainer = document.querySelector('.map-container');
    const coordsDisplay = document.getElementById('map-coords');

    if (mapContainer && coordsDisplay) {
        mapContainer.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const lon = (x * 360 - 180).toFixed(4);
            const lat = (90 - y * 180).toFixed(4);
            const latHemi = lat >= 0 ? 'N' : 'S';
            const lonHemi = lon >= 0 ? 'E' : 'W';
            coordsDisplay.textContent = 'LAT: ' + Math.abs(lat).toFixed(4) + '°' + latHemi + '  LON: ' + Math.abs(lon).toFixed(4) + '°' + lonHemi;
        });
    }

    /* --------------------------------------------------
       MAP LAYER TOGGLE
       -------------------------------------------------- */
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const layer = this.getAttribute('data-layer');
            const svg = document.getElementById('world-map');
            if (!svg) return;

            const landmasses = svg.querySelectorAll('#map-landmasses path');
            landmasses.forEach(path => {
                switch (layer) {
                    case 'surface':
                        path.setAttribute('fill', '#0c1a14');
                        path.setAttribute('stroke', '#1a3a2a');
                        break;
                    case 'thermal':
                        path.setAttribute('fill', '#1a0c0c');
                        path.setAttribute('stroke', '#3a1a1a');
                        break;
                    case 'precip':
                        path.setAttribute('fill', '#0c0c1a');
                        path.setAttribute('stroke', '#1a1a3a');
                        break;
                    case 'population':
                        path.setAttribute('fill', '#0c1a0c');
                        path.setAttribute('stroke', '#1a3a1a');
                        break;
                    case 'seismic':
                        path.setAttribute('fill', '#1a1a0c');
                        path.setAttribute('stroke', '#3a3a1a');
                        break;
                    case 'wind':
                        path.setAttribute('fill', '#0c1a1a');
                        path.setAttribute('stroke', '#1a3a3a');
                        break;
                }
            });
        });
    });

    /* --------------------------------------------------
       EVENT LOG AUTO-SCROLL
       -------------------------------------------------- */
    const eventLogScroll = document.getElementById('event-log-scroll');
    let eventScrollPos = 0;
    let eventScrollDirection = 1;

    function autoScrollEventLog() {
        if (!eventLogScroll) return;
        const maxScroll = eventLogScroll.scrollWidth - eventLogScroll.clientWidth;
        eventScrollPos += eventScrollDirection * 0.5;
        if (eventScrollPos >= maxScroll) {
            eventScrollDirection = -1;
        }
        if (eventScrollPos <= 0) {
            eventScrollDirection = 1;
        }
        eventLogScroll.scrollLeft = eventScrollPos;
    }

    setInterval(autoScrollEventLog, 50);

    /* --------------------------------------------------
       LIVE DATA UPDATES — SIMULATED REAL-TIME CHANGES
       -------------------------------------------------- */

    // Seismic total counter
    let seismicTotal = 2164;
    setInterval(function () {
        const change = randomInt(-2, 5);
        seismicTotal += change;
        const el = document.getElementById('seismic-total');
        if (el) el.textContent = formatNumber(seismicTotal);
    }, 3000);

    // Active volcanoes counter
    setInterval(function () {
        const el = document.getElementById('active-volcanoes');
        if (el) {
            const current = parseInt(el.textContent.replace(/,/g, ''));
            const change = randomInt(-1, 2);
            el.textContent = formatNumber(Math.max(1500, current + change));
        }
    }, 5000);

    // ISS position simulation
    let issLat = 47.23;
    let issLon = -122.41;

    setInterval(function () {
        issLon += 0.15;
        if (issLon > 180) issLon -= 360;
        issLat += (Math.random() - 0.5) * 0.3;
        issLat = Math.max(-51.6, Math.min(51.6, issLat));

        const latEl = document.getElementById('iss-lat');
        const lonEl = document.getElementById('iss-lon');
        if (latEl) latEl.textContent = Math.abs(issLat).toFixed(2) + '°' + (issLat >= 0 ? 'N' : 'S');
        if (lonEl) lonEl.textContent = Math.abs(issLon).toFixed(2) + '°' + (issLon >= 0 ? 'E' : 'W');
    }, 1000);

    // Market price fluctuations
    setInterval(function () {
        document.querySelectorAll('.mkt-val').forEach(el => {
            const currentText = el.textContent.replace(/[$,]/g, '');
            const current = parseFloat(currentText);
            if (isNaN(current)) return;
            const change = current * (Math.random() - 0.5) * 0.002;
            const newVal = current + change;
            if (el.id === 'sp500') {
                el.textContent = newVal.toFixed(2);
            } else if (el.textContent.includes('$')) {
                el.textContent = '$' + Math.round(newVal).toLocaleString();
            } else {
                el.textContent = newVal.toFixed(2);
            }
        });
    }, 2000);

    // Currency fluctuations
    setInterval(function () {
        document.querySelectorAll('.curr-val').forEach(el => {
            const current = parseFloat(el.textContent.replace(/[$,]/g, ''));
            if (isNaN(current)) return;
            const change = current * (Math.random() - 0.5) * 0.001;
            el.textContent = (current + change).toFixed(4);
        });
    }, 2500);

    /* --------------------------------------------------
       TECTONIC FEED — DYNAMIC NEW ENTRIES
       -------------------------------------------------- */
    const tectonicFeed = document.getElementById('tectonic-feed');

    const volcanoNames = [
        'KILAUEA', 'MERAPI', 'COTOPAXI', 'FUEGAL', 'NYIRAGONGO',
        'EYJAFJALLAJOKULL', 'STROMBOLI', 'VESUVIUS', 'YELLOWSTONE', 'CALBUCO',
        'TUNGURAHUA', 'REVENTADOR', 'GALERAS', 'NEVADO DEL RUIZ', 'KLYUCHEVSKOY'
    ];

    const volcanoEvents = [
        'Minor ash emission to 3.2km. Seismicity elevated.',
        'Lava dome growth observed. Thermal anomaly +8°C.',
        'Increased tremor. Gas emissions rising.',
        'Explosive event. Ash to 4.5km. Aviation YELLOW.',
        'Lava flow advancing 200m. Fumarole activity high.',
        'Phreatic explosion. Steam plume to 1.8km.',
        'Inflation detected. GPS displacement 2.1mm.',
        'Degassing increased. SO₂ flux 3,200 t/d.',
        'Seismic swarm. 47 events in 6 hours.',
        'Crater lake temperature +4°C. Alert raised.'
    ];

    const severityClasses = ['severity-low', 'severity-low', 'severity-low', 'severity-med', 'severity-high'];

    function addTectonicEvent() {
        if (!tectonicFeed) return;

        const now = new Date();
        const timeStr = pad(now.getHours(), 2) + ':' + pad(now.getMinutes(), 2) + ':' + pad(now.getSeconds(), 2);
        const name = pickRandom(volcanoNames);
        const event = pickRandom(volcanoEvents);
        const severity = pickRandom(severityClasses);

        const icons = {
            'severity-high': '🔴',
            'severity-med': '🟠',
            'severity-low': '🟢'
        };

        const div = document.createElement('div');
        div.className = 'feed-item ' + severity;
        div.innerHTML = '<span class="feed-time">' + timeStr + '</span><span class="feed-icon">' + icons[severity] + '</span><span class="feed-text"><strong>' + name + '</strong> — ' + event + '</span>';
        div.style.animation = 'slide-in 0.3s ease-out';

        tectonicFeed.insertBefore(div, tectonicFeed.firstChild);

        while (tectonicFeed.children.length > 12) {
            tectonicFeed.removeChild(tectonicFeed.lastChild);
        }
    }

    setInterval(addTectonicEvent, 8000);

    /* --------------------------------------------------
       BOTTOM STATS — LIVE UPDATES
       -------------------------------------------------- */
    setInterval(function () {
        document.querySelectorAll('.bottom-stat').forEach(stat => {
            const spans = stat.querySelectorAll('span');
            spans.forEach(span => {
                if (span.classList.contains('red') && span.textContent.includes('active')) {
                    const current = parseInt(span.textContent.replace(/[^0-9]/g, ''));
                    if (!isNaN(current)) {
                        span.textContent = formatNumber(current + randomInt(-3, 5)) + ' active';
                    }
                }
            });
        });
    }, 5000);

    /* --------------------------------------------------
       PANEL TOGGLE BUTTONS
       -------------------------------------------------- */
    document.querySelectorAll('.panel-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const parent = this.closest('.panel-controls');
            if (parent) {
                parent.querySelectorAll('.panel-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    /* --------------------------------------------------
       SUBSOLAR POINT UPDATE
       -------------------------------------------------- */
    function updateSubsolarPoint() {
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
        const declination = -23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * Math.PI / 180);
        const hours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
        const lon = 15 * (12 - hours);

        const latHemi = declination >= 0 ? 'N' : 'S';
        const lonHemi = lon >= 0 ? 'E' : 'W';

        const el = document.getElementById('subsolar-point');
        if (el) {
            el.textContent = Math.abs(declination).toFixed(1) + '°' + latHemi + ', ' + Math.abs(lon).toFixed(1) + '°' + lonHemi;
        }
    }

    setInterval(updateSubsolarPoint, 1000);
    updateSubsolarPoint();

    /* --------------------------------------------------
       ANIMATED PULSE FOR MAP MARKERS
       -------------------------------------------------- */
    const style = document.createElement('style');
    style.textContent = '@keyframes pulse { 0%, 100% { r: 4; opacity: 0.15; } 50% { r: 10; opacity: 0.05; } }';
    document.head.appendChild(style);

    /* --------------------------------------------------
       INITIALIZATION COMPLETE
       -------------------------------------------------- */
    console.log('%c🌍 PLANETARYOS v4.7.2 — Dashboard Initialized', 'color: #00ffc8; font-family: monospace; font-size: 14px;');
    console.log('%cAll systems nominal. Monitoring active.', 'color: #4a5a6a; font-family: monospace; font-size: 10px;');

})();