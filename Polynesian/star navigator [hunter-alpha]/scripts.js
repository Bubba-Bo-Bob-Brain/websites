// ============================================
// TE PAPA NUI - Polynesian Celestial Wayfinding Chart
// JavaScript - Interactive Navigation & Animations
// ============================================

(function() {
    'use strict';

    // ============================================
    // GLOBAL STATE
    // ============================================
    const state = {
        mouseX: window.innerWidth / 2,
        mouseY: window.innerHeight / 2,
        stars: [],
        constellations: [],
        islands: [],
        routes: [],
        oceanWaves: [],
        wakeTrail: [],
        isLoaded: false,
        domeRotation: { x: 0, y: 0 }
    };

    // ============================================
    // CONSTELLATION DATA
    // ============================================
    const constellationData = [
        {
            name: 'Ka Makau',
            meaning: 'The Fish Hook - Maui\'s great hook that pulled islands from the sea',
            stars: [
                { x: 0.15, y: 0.15, size: 4, name: 'Hoku' },
                { x: 0.18, y: 0.18, size: 3.5, name: 'Mahoe' },
                { x: 0.21, y: 0.17, size: 3, name: 'Hina' },
                { x: 0.24, y: 0.20, size: 4.5, name: 'Kaulia' },
                { x: 0.26, y: 0.24, size: 3, name: 'Nama' },
                { x: 0.23, y: 0.27, size: 3.5, name: 'Pili' }
            ],
            lines: [[0,1], [1,2], [2,3], [3,4], [4,5]]
        },
        {
            name: 'Te Manu',
            meaning: 'The Bird - guides voyagers to land across vast oceans',
            stars: [
                { x: 0.50, y: 0.10, size: 5, name: 'Manu-iki' },
                { x: 0.47, y: 0.14, size: 3, name: 'Paku' },
                { x: 0.53, y: 0.13, size: 3.5, name: 'Rere' },
                { x: 0.44, y: 0.19, size: 3, name: 'Kaka' },
                { x: 0.56, y: 0.18, size: 3, name: 'Ti' },
                { x: 0.42, y: 0.23, size: 2.5, name: 'Wing' },
                { x: 0.58, y: 0.22, size: 2.5, name: 'Tail' }
            ],
            lines: [[0,1], [0,2], [1,3], [2,4], [3,5], [4,6]]
        },
        {
            name: 'Te Vaa',
            meaning: 'The Canoe - the vessel that carries our people across Te Moana',
            stars: [
                { x: 0.75, y: 0.20, size: 4.5, name: 'Taurua' },
                { x: 0.70, y: 0.25, size: 3.5, name: 'Kau' },
                { x: 0.80, y: 0.24, size: 3.5, name: 'Vaka' },
                { x: 0.67, y: 0.31, size: 3, name: 'Hoe' },
                { x: 0.83, y: 0.30, size: 3, name: 'Malo' },
                { x: 0.72, y: 0.32, size: 2.5, name: 'Rua' },
                { x: 0.78, y: 0.315, size: 2.5, name: 'Toki' }
            ],
            lines: [[1,2], [0,1], [0,2], [1,3], [2,4], [3,5], [4,6], [5,6]]
        },
        {
            name: 'Matariki',
            meaning: 'Matariki - the Pleiades, heralding the Maori New Year',
            stars: [
                { x: 0.375, y: 0.35, size: 3.5, name: 'Matariki' },
                { x: 0.362, y: 0.335, size: 2.5, name: 'Tupuanuku' },
                { x: 0.388, y: 0.338, size: 2.5, name: 'Tupuarangi' },
                { x: 0.367, y: 0.365, size: 2, name: 'Waipuna' },
                { x: 0.383, y: 0.362, size: 2, name: 'Waiti' },
                { x: 0.375, y: 0.375, size: 2.5, name: 'Waita' },
                { x: 0.371, y: 0.325, size: 2, name: 'Ururangi' }
            ],
            lines: [[0,1], [0,2], [0,3], [0,4], [0,5], [0,6]]
        }
    ];

    // ============================================
    // CANVAS SETUP
    // ============================================
    const canvases = {
        starField: null,
        starDome: null,
        ocean: null,
        wakeTrail: null
    };

    const contexts = {};

    function initCanvases() {
        canvases.starField = document.getElementById('starField');
        canvases.starDome = document.getElementById('starDome');
        canvases.ocean = document.getElementById('oceanCanvas');
        canvases.wakeTrail = document.getElementById('wakeTrail');

        Object.keys(canvases).forEach(key => {
            const canvas = canvases[key];
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                contexts[key] = canvas.getContext('2d');
            }
        });
    }

    // ============================================
    // STAR FIELD GENERATION
    // ============================================
    function generateStarField() {
        const ctx = contexts.starField;
        if (!ctx) return;

        const w = canvases.starField.width;
        const h = canvases.starField.height;

        // Clear
        ctx.fillStyle = '#020810';
        ctx.fillRect(0, 0, w, h);

        // Nebula gradient
        const nebulaGradient = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.5);
        nebulaGradient.addColorStop(0, 'rgba(10, 42, 66, 0.3)');
        nebulaGradient.addColorStop(0.5, 'rgba(19, 74, 110, 0.1)');
        nebulaGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, w, h);

        const nebulaGradient2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 0, w * 0.7, h * 0.6, w * 0.4);
        nebulaGradient2.addColorStop(0, 'rgba(29, 109, 148, 0.2)');
        nebulaGradient2.addColorStop(0.5, 'rgba(10, 42, 66, 0.1)');
        nebulaGradient2.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGradient2;
        ctx.fillRect(0, 0, w, h);

        // Generate background stars
        state.stars = [];
        const starCount = Math.floor((w * h) / 800);

        for (let i = 0; i < starCount; i++) {
            const star = {
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 1.5 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            };
            state.stars.push(star);
        }

        // Draw static star field
        drawStarField();
    }

    function drawStarField() {
        const ctx = contexts.starField;
        if (!ctx) return;

        const w = canvases.starField.width;
        const h = canvases.starField.height;

        // Redraw background
        ctx.fillStyle = '#020810';
        ctx.fillRect(0, 0, w, h);

        // Nebula
        const nebulaGradient = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.5);
        nebulaGradient.addColorStop(0, 'rgba(10, 42, 66, 0.3)');
        nebulaGradient.addColorStop(0.5, 'rgba(19, 74, 110, 0.1)');
        nebulaGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, w, h);

        // Stars
        state.stars.forEach(star => {
            const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
            const alpha = star.brightness * twinkle;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 253, 232, ${alpha})`;
            ctx.fill();

            // Glow for brighter stars
            if (star.size > 1.2) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
                glow.addColorStop(0, `rgba(255, 229, 181, ${alpha * 0.3})`);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.fill();
            }
        });
    }

    // ============================================
    // STAR DOME (Cursor-responsive)
    // ============================================
    function initStarDome() {
        const ctx = contexts.starDome;
        if (!ctx) return;

        const w = canvases.starDome.width;
        const h = canvases.starDome.height;

        ctx.clearRect(0, 0, w, h);

        // Create dome effect
        const centerX = w / 2 + state.domeRotation.x * 50;
        const centerY = h / 2 + state.domeRotation.y * 50;
        const radius = Math.min(w, h) * 0.4;

        // Dome gradient
        const domeGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        domeGradient.addColorStop(0, 'rgba(255, 253, 232, 0.1)');
        domeGradient.addColorStop(0.5, 'rgba(135, 206, 235, 0.05)');
        domeGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = domeGradient;
        ctx.fill();

        // Draw grid lines (star paths)
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
        ctx.lineWidth = 0.5;

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        }

        // Concentric circles
        for (let r = 0.2; r <= 1; r += 0.2) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * r, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // ============================================
    // OCEAN CANVAS
    // ============================================
    function initOceanCanvas() {
        const ctx = contexts.ocean;
        if (!ctx) return;

        const w = canvases.ocean.width;
        const h = canvases.ocean.height;

        // Initialize wave parameters
        state.oceanWaves = [];
        for (let i = 0; i < 5; i++) {
            state.oceanWaves.push({
                amplitude: 15 + Math.random() * 20,
                frequency: 0.01 + Math.random() * 0.01,
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.02,
                y: h * 0.3 + i * 30,
                alpha: 0.3 - i * 0.05
            });
        }
    }

    function drawOcean(time) {
        const ctx = contexts.ocean;
        if (!ctx) return;

        const w = canvases.ocean.width;
        const h = canvases.ocean.height;

        ctx.clearRect(0, 0, w, h);

        // Draw ocean gradient background
        const oceanGradient = ctx.createLinearGradient(0, 0, 0, h);
        oceanGradient.addColorStop(0, 'rgba(4, 24, 41, 0)');
        oceanGradient.addColorStop(0.3, 'rgba(10, 42, 66, 0.5)');
        oceanGradient.addColorStop(1, 'rgba(19, 74, 110, 0.7)');
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, 0, w, h);

        // Draw animated waves
        state.oceanWaves.forEach((wave, index) => {
            ctx.beginPath();
            ctx.moveTo(0, h);

            for (let x = 0; x <= w; x += 5) {
                const y = wave.y + 
                    Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
                    Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.5;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(w, h);
            ctx.closePath();

            const waveGradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, h);
            waveGradient.addColorStop(0, `rgba(29, 109, 148, ${wave.alpha})`);
            waveGradient.addColorStop(1, `rgba(10, 42, 66, ${wave.alpha * 0.5})`);
            ctx.fillStyle = waveGradient;
            ctx.fill();
        });

        // Draw ocean current lines
        ctx.strokeStyle = 'rgba(64, 224, 208, 0.15)';
        ctx.lineWidth = 1;

        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            const startY = h * 0.4 + i * 50;
            
            for (let x = 0; x <= w; x += 10) {
                const y = startY + Math.sin(x * 0.005 + time * 0.001 + i) * 30;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }

    // ============================================
    // CONSTELLATION LAYER
    // ============================================
    function createConstellations() {
        const layer = document.getElementById('constellationLayer');
        if (!layer) return;

        layer.innerHTML = '';
        state.constellations = [];

        constellationData.forEach((constData, constIndex) => {
            const constEl = document.createElement('div');
            constEl.className = 'constellation';
            constEl.dataset.name = constData.name;
            constEl.dataset.meaning = constData.meaning;

            const w = window.innerWidth;
            const h = window.innerHeight;

            // Create stars
            constData.stars.forEach((starData, starIndex) => {
                const starEl = document.createElement('div');
                starEl.className = 'constellation-star' + (starData.size >= 4 ? ' bright' : '');
                const size = starData.size * 3;
                starEl.style.width = size + 'px';
                starEl.style.height = size + 'px';
                starEl.style.left = (starData.x * w - size / 2) + 'px';
                starEl.style.top = (starData.y * h - size / 2) + 'px';
                starEl.style.animationDelay = (Math.random() * 3) + 's';
                starEl.dataset.name = starData.name;
                starEl.dataset.constellation = constData.name;
                constEl.appendChild(starEl);

                // Store star position for lines
                starData.screenX = starData.x * w;
                starData.screenY = starData.y * h;
            });

            // Create connecting lines
            constData.lines.forEach(([startIdx, endIdx]) => {
                const start = constData.stars[startIdx];
                const end = constData.stars[endIdx];

                const lineEl = document.createElement('div');
                lineEl.className = 'constellation-line';

                const dx = end.screenX - start.screenX;
                const dy = end.screenY - start.screenY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                lineEl.style.width = length + 'px';
                lineEl.style.left = start.screenX + 'px';
                lineEl.style.top = start.screenY + 'px';
                lineEl.style.transform = `rotate(${angle}deg)`;

                constEl.appendChild(lineEl);
            });

            // Create label
            const labelEl = document.createElement('div');
            labelEl.className = 'constellation-label';
            labelEl.textContent = constData.name;
            const avgX = constData.stars.reduce((sum, s) => sum + s.screenX, 0) / constData.stars.length;
            const avgY = constData.stars.reduce((sum, s) => sum + s.screenY, 0) / constData.stars.length;
            labelEl.style.left = avgX + 'px';
            labelEl.style.top = (avgY - 25) + 'px';
            constEl.appendChild(labelEl);

            // Add click handler
            constEl.addEventListener('click', () => showConstellationInfo(constData));

            layer.appendChild(constEl);
            state.constellations.push({ element: constEl, data: constData });
        });
    }

    // ============================================
    // ISLAND INTERACTIONS
    // ============================================
    function initIslands() {
        const islandGroups = document.querySelectorAll('.island-group');
        
        islandGroups.forEach(island => {
            const name = island.dataset.name;
            const info = island.dataset.info;

            island.addEventListener('click', () => {
                showIslandInfo(name, info);
                createWakeTrailFromIsland(island);
            });

            island.addEventListener('mouseenter', (e) => {
                showTooltip(e, name, info);
            });

            island.addEventListener('mouseleave', hideTooltip);

            state.islands.push({
                element: island,
                name: name,
                info: info
            });
        });
    }

    // ============================================
    // VOYAGE ROUTES
    // ============================================
    function createVoyageRoutes() {
        const routes = [
            { from: 'Samoa', to: 'Tahiti', path: 'M70%,30% Q55%,35% 45%,45%' },
            { from: 'Tahiti', to: 'Hawaii', path: 'M45%,45% Q35%,30% 15%,20%' },
            { from: 'Tahiti', to: 'Aotearoa', path: 'M45%,45% Q55%,60% 62%,72%' },
            { from: 'Tahiti', to: 'Rapa Nui', path: 'M45%,45% Q30%,50% 12%,55%' },
            { from: 'Tahiti', to: 'Marquesas', path: 'M45%,45% Q38%,48% 30%,50%' },
            { from: 'Samoa', to: 'Aotearoa', path: 'M70%,30% Q65%,50% 62%,72%' }
        ];

        routes.forEach(route => {
            const fromIsland = state.islands.find(i => i.name === route.from);
            const toIsland = state.islands.find(i => i.name === route.to);

            if (fromIsland && toIsland) {
                createRouteBetweenIslands(fromIsland.element, toIsland.element, route);
            }
        });
    }

    function createRouteBetweenIslands(fromEl, toEl, routeData) {
        const route = document.createElement('div');
        route.className = 'voyage-route';
        route.dataset.from = routeData.from;
        route.dataset.to = routeData.to;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const fromX = fromRect.left + fromRect.width / 2;
        const fromY = fromRect.top + fromRect.height / 2;
        const toX = toRect.left + toRect.width / 2;
        const toY = toRect.top + toRect.height / 2;

        const dx = toX - fromX;
        const dy = toY - fromY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const line = document.createElement('div');
        line.className = 'voyage-route-line';
        line.style.width = length + 'px';
        line.style.left = fromX + 'px';
        line.style.top = fromY + 'px';
        line.style.transform = `rotate(${angle}deg)`;

        route.appendChild(line);
        document.body.appendChild(route);

        route.addEventListener('click', () => {
            showRouteInfo(routeData.from, routeData.to);
        });

        route.addEventListener('mouseenter', (e) => {
            showTooltip(e, `${routeData.from} to ${routeData.to}`, 'Ancient voyaging route across Te Moana');
        });

        route.addEventListener('mouseleave', hideTooltip);

        state.routes.push({ element: route, data: routeData });
    }

    // ============================================
    // BIOLUMINESCENT WAKE TRAIL
    // ============================================
    function initWakeTrail() {
        const ctx = contexts.wakeTrail;
        if (!ctx) return;

        state.wakeTrail = [];
    }

    function createWakeTrailFromIsland(islandEl) {
        const rect = islandEl.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        // Create particles
        for (let i = 0; i < 20; i++) {
            state.wakeTrail.push({
                x: startX,
                y: startY,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                size: 2 + Math.random() * 3
            });
        }
    }

    function updateWakeTrail() {
        const ctx = contexts.wakeTrail;
        if (!ctx) return;

        const w = canvases.wakeTrail.width;
        const h = canvases.wakeTrail.height;

        ctx.clearRect(0, 0, w, h);

        state.wakeTrail = state.wakeTrail.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life -= particle.decay;

            if (particle.life <= 0) return false;

            // Draw bioluminescent particle
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, `rgba(0, 255, 136, ${particle.life})`);
            gradient.addColorStop(0.5, `rgba(64, 224, 208, ${particle.life * 0.5})`);
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
            ctx.fill();

            return true;
        });
    }

    // ============================================
    // TOOLTIP
    // ============================================
    function showTooltip(e, name, info) {
        const tooltip = document.getElementById('starTooltip');
        if (!tooltip) return;

        tooltip.querySelector('.tooltip-name').textContent = name;
        tooltip.querySelector('.tooltip-info').textContent = info;

        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
        tooltip.classList.add('visible');
    }

    function hideTooltip() {
        const tooltip = document.getElementById('starTooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    // ============================================
    // INFO PANEL
    // ============================================
    function showConstellationInfo(constData) {
        const panel = document.getElementById('infoPanel');
        const title = document.getElementById('panelTitle');
        const description = document.getElementById('panelDescription');
        const details = document.getElementById('panelDetails');

        if (!panel || !title || !description) return;

        title.textContent = constData.name;
        description.textContent = constData.meaning;

        if (details) {
            details.innerHTML = '<strong>Stars:</strong><br>' + 
                constData.stars.map(s => `• ${s.name}`).join('<br>');
        }

        panel.classList.remove('hidden');
    }

    function showIslandInfo(name, info) {
        const panel = document.getElementById('infoPanel');
        const title = document.getElementById('panelTitle');
        const description = document.getElementById('panelDescription');
        const details = document.getElementById('panelDetails');

        if (!panel || !title || !description) return;

        title.textContent = name;
        description.textContent = info;

        if (details) {
            details.innerHTML = '';
        }

        panel.classList.remove('hidden');
    }

    function showRouteInfo(from, to) {
        const panel = document.getElementById('infoPanel');
        const title = document.getElementById('panelTitle');
        const description = document.getElementById('panelDescription');
        const details = document.getElementById('panelDetails');

        if (!panel || !title || !description) return;

        title.textContent = 'Ara Moana - Voyaging Route';
        description.textContent = `Ancient navigators sailed from ${from} to ${to} using star paths, ocean swells, and the flight patterns of birds.`;

        if (details) {
            details.innerHTML = `
                <strong>Navigation Methods:</strong><br>
                • Star rising/setting points<br>
                • Ocean swell patterns<br>
                • Bird migration routes<br>
                • Cloud formations over islands
            `;
        }

        panel.classList.remove('hidden');
    }

    function initInfoPanel() {
        const closeBtn = document.getElementById('panelClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('infoPanel').classList.add('hidden');
            });
        }
    }

    // ============================================
    // MOUSE TRACKING
    // ============================================
    function initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;

            // Update dome rotation based on mouse position
            state.domeRotation.x = (e.clientX / window.innerWidth - 0.5) * 2;
            state.domeRotation.y = (e.clientY / window.innerHeight - 0.5) * 2;

            // Track for wake trail
            if (Math.random() < 0.1) {
                state.wakeTrail.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 0.5,
                    decay: 0.02,
                    size: 1 + Math.random() * 2
                });
            }
        });
    }

    // ============================================
    // LOADING SCREEN
    // ============================================
    function initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingProgress = document.getElementById('loadingProgress');

        if (!loadingScreen || !loadingProgress) {
            state.isLoaded = true;
            return;
        }

        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);

                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    state.isLoaded = true;
                }, 500);
            }
            loadingProgress.style.width = progress + '%';
        }, 200);
    }

    // ============================================
    // ANIMATION LOOP
    // ============================================
    function animate(time) {
        if (state.isLoaded) {
            // Update star field with twinkling
            if (time % 3 === 0) {
                drawStarField();
            }

            // Update star dome
            initStarDome();

            // Update ocean
            drawOcean(time);

            // Update wake trail
            updateWakeTrail();
        }

        requestAnimationFrame(animate);
    }

    // ============================================
    // WINDOW RESIZE
    // ============================================
    function handleResize() {
        Object.keys(canvases).forEach(key => {
            const canvas = canvases[key];
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });

        generateStarField();
        createConstellations();
        initOceanCanvas();

        // Recreate routes
        document.querySelectorAll('.voyage-route').forEach(el => el.remove());
        state.routes = [];
        createVoyageRoutes();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        initCanvases();
        generateStarField();
        initStarDome();
        initOceanCanvas();
        initWakeTrail();
        createConstellations();
        initIslands();
        createVoyageRoutes();
        initMouseTracking();
        initInfoPanel();
        initLoadingScreen();

        // Start animation
        requestAnimationFrame(animate);

        // Handle resize
        window.addEventListener('resize', debounce(handleResize, 250));
    }

    // Utility: Debounce
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

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();