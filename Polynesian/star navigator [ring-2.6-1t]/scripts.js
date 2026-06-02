// ============================================================
// TE LAPA — Polynesian Celestial Wayfinding Chart
// JavaScript: Interactive Rendering Engine
// ============================================================

(function () {
    'use strict';

    // ============================================================
    // DATA DEFINITIONS
    // ============================================================

    // Star families with Polynesian names
    const STAR_FAMILIES = {
        hokupa_a: {
            name: 'Hōkūpaʻa',
            desc: 'The Unmoving Star — Polaris, the North Star, anchor of the northern sky.',
            color: '#ffffff',
            stars: [
                { nx: 0.5, ny: 0.22, mag: 1.8, id: 'polaris' },
                { nx: 0.51, ny: 0.26, mag: 2.8, id: 'yildun' },
                { nx: 0.49, ny: 0.30, mag: 3.2, id: 'kochab' },
                { nx: 0.53, ny: 0.28, mag: 4.0, id: 'pherkad' },
                { nx: 0.47, ny: 0.25, mag: 4.5, id: 'gamma-umi-min' },
            ]
        },
        hokule_a: {
            name: 'Hōkūleʻa',
            desc: 'Star of Gladness — Arcturus. Zenith star above Hawaiʻi. The guiding star of return voyages.',
            color: '#ffd700',
            stars: [
                { nx: 0.35, ny: 0.32, mag: 1.5, id: 'arcturus' },
                { nx: 0.33, ny: 0.36, mag: 2.5, id: 'eta-boo' },
                { nx: 0.37, ny: 0.38, mag: 3.0, id: 'tau-boo' },
            ]
        },
        haina: {
            name: 'Hānaiakamālama',
            desc: 'The Southern Cross — Crux. The holiest constellation for southern navigation.',
            color: '#aaccff',
            stars: [
                { nx: 0.45, ny: 0.65, mag: 1.3, id: 'acrux' },
                { nx: 0.47, ny: 0.60, mag: 1.6, id: 'mimosa' },
                { nx: 0.50, ny: 0.68, mag: 1.9, id: 'gamma-cru' },
                { nx: 0.52, ny: 0.72, mag: 2.2, id: 'delta-cru' },
                { nx: 0.43, ny: 0.58, mag: 3.0, id: 'eta-cru' },
            ]
        },
        huinakolu: {
            name: 'Ka Huinakolu',
            desc: 'The Three — Orion\'s Belt. The celestial compass of the ancient navigators.',
            color: '#e0e8ff',
            stars: [
                { nx: 0.62, ny: 0.35, mag: 1.6, id: 'alnitak' },
                { nx: 0.65, ny: 0.33, mag: 1.7, id: 'alnilam' },
                { nx: 0.68, ny: 0.35, mag: 1.5, id: 'mintaka' },
                { nx: 0.60, ny: 0.30, mag: 2.0, id: 'phi1-ori' },
                { nx: 0.70, ny: 0.30, mag: 2.3, id: 'meissa' },
            ]
        },
        me_e: {
            name: 'Meʻe',
            desc: 'Brilliant Canopus — the steering star, second brightest in the sky.',
            color: '#ffaa44',
            stars: [
                { nx: 0.38, ny: 0.78, mag: 1.0, id: 'canopus' },
                { nx: 0.40, ny: 0.82, mag: 3.5, id: 'eta-car' },
            ]
        },
        hikina: {
            name: 'Hikina',
            desc: 'The Rising — Stars that emerge from the Eastern horizon.',
            color: '#ffd7aa',
            stars: [
                { nx: 0.72, ny: 0.25, mag: 1.5, id: 'vega' },
                { nx: 0.75, ny: 0.30, mag: 2.0, id: 'altair' },
                { nx: 0.70, ny: 0.35, mag: 2.5, id: 'deneb' },
                { nx: 0.78, ny: 0.22, mag: 3.0, id: 'sagitta' },
            ]
        },
        komohana: {
            name: 'Komohana',
            desc: 'The Descending — Stars that sink into the Western sea.',
            color: '#ffcc99',
            stars: [
                { nx: 0.25, ny: 0.28, mag: 1.5, id: 'capella' },
                { nx: 0.22, ny: 0.32, mag: 2.2, id: 'menkalinan' },
                { nx: 0.28, ny: 0.24, mag: 2.8, id: 'castor' },
            ]
        },
    };

    // Constellation patterns for connect-the-dots
    const CONSTELLATIONS = {
        southernCross: {
            name: 'Te Puka',
            stars: [
                { nx: 0.45, ny: 0.65 }, { nx: 0.47, ny: 0.60 },
                { nx: 0.50, ny: 0.68 }, { nx: 0.52, ny: 0.72 },
                { nx: 0.43, ny: 0.58 },
            ],
            lines: [[0, 1], [1, 2], [2, 3], [0, 4]],
            color: '#aaccff'
        },
        orion: {
            name: 'Ka Huinakolu',
            stars: [
                { nx: 0.62, ny: 0.35 }, { nx: 0.65, ny: 0.33 },
                { nx: 0.68, ny: 0.35 }, { nx: 0.60, ny: 0.30 },
                { nx: 0.70, ny: 0.30 },
            ],
            lines: [[0, 1], [1, 2], [1, 3], [1, 4]],
            color: '#e0e8ff'
        },
        scorpius: {
            name: 'Māui\'s Fishhook',
            stars: [
                { nx: 0.82, ny: 0.55 }, { nx: 0.80, ny: 0.50 },
                { nx: 0.78, ny: 0.48 }, { nx: 0.76, ny: 0.52 },
                { nx: 0.74, ny: 0.58 }, { nx: 0.75, ny: 0.64 },
                { nx: 0.77, ny: 0.70 }, { nx: 0.79, ny: 0.75 },
            ],
            lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
            color: '#ff8844'
        },
    };

    // Island chain data (normalized positions on the chart)
    const ISLAND_CHAINS = [
        {
            name: 'Hawaiʻi',
            polynesian: 'Hawaiki Nui',
            nx: 0.28, ny: 0.20,
            color: '#00ff88',
            desc: 'The northernmost waypoint. Sacred Hōkūleʻa overhead at the zenith.',
            radius: 12,
            population: 'Ancient Polynesian settlers arrived ~1000 CE'
        },
        {
            name: 'Marquesas',
            polynesian: 'Henua Enata',
            nx: 0.25, ny: 0.40,
            color: '#ffaa44',
            desc: 'Motu Haka — the gateway to the eastern Pacific.',
            radius: 10,
            population: 'Nukuhiva and Hiva Oa — cradle of Polynesian navigation'
        },
        {
            name: 'Tahiti',
            polynesian: 'Te Moana Nui',
            nx: 0.38, ny: 0.52,
            color: '#00e5cc',
            desc: 'Heart of Polynesia. Hōkūleʻa rises from here.',
            radius: 14,
            population: 'Center of Polynesian culture and navigation revival'
        },
        {
            name: 'Rapa Nui',
            polynesian: 'Te Pito o te Henua',
            nx: 0.18, ny: 0.68,
            color: '#ff6666',
            desc: 'The Navel of the World. The most remote inhabited island.',
            radius: 10,
            population: 'Easter Island — 2,300 miles from South America'
        },
        {
            name: 'Samoa',
            polynesian: 'Sāmoa',
            nx: 0.48, ny: 0.42,
            color: '#ffdd44',
            desc: 'The Polynesian heartland. Savaiʻi, the ancient wayfinder\'s island.',
            radius: 11,
            population: 'Birthplace of Polynesian migration across the Pacific'
        },
        {
            name: 'Tonga',
            polynesian: 'Tonga',
            nx: 0.55, ny: 0.50,
            color: '#88ffaa',
            desc: 'The Friendly Islands. First Tongan dynasty of navigators.',
            radius: 9,
            population: 'Ancient Tuʻi Tonga Empire of master navigators'
        },
        {
            name: 'Fiji',
            polynesian: 'Viti',
            nx: 0.60, ny: 0.55,
            color: '#88ddff',
            desc: 'Crossroads of the Pacific. Melanesian waypoint.',
            radius: 10,
            population: '3,000 years of seafaring history'
        },
        {
            name: 'Aotearoa',
            polynesian: 'Aotearoa',
            nx: 0.40, ny: 0.82,
            color: '#00ff88',
            desc: 'Land of the Long White Cloud. The greatest voyage of all.',
            radius: 15,
            population: 'New Zealand — reached ~1250-1300 CE by Polynesian voyagers'
        },
    ];

    // Ocean current paths
    const OCEAN_CURRENTS = [
        {
            name: 'South Equatorial Current',
            color: 'rgba(0, 170, 255, 0.25)',
            width: 3,
            speed: 0.0003,
            points: [
                [0.1, 0.3], [0.2, 0.35], [0.3, 0.38], [0.4, 0.40],
                [0.5, 0.42], [0.6, 0.44], [0.7, 0.42], [0.8, 0.38], [0.9, 0.35], [1.0, 0.32]
            ]
        },
        {
            name: 'Equatorial Counter Current',
            color: 'rgba(0, 229, 255, 0.2)',
            width: 2,
            speed: -0.0004,
            points: [
                [0.0, 0.48], [0.15, 0.46], [0.3, 0.45], [0.5, 0.44],
                [0.7, 0.45], [0.85, 0.47], [1.0, 0.48]
            ]
        },
        {
            name: 'East Australian Current',
            color: 'rgba(0, 200, 180, 0.2)',
            width: 2.5,
            speed: 0.00025,
            points: [
                [0.85, 0.2], [0.82, 0.3], [0.78, 0.4], [0.75, 0.5],
                [0.72, 0.6], [0.70, 0.7], [0.68, 0.8]
            ]
        },
        {
            name: 'South Equatorial (South)',
            color: 'rgba(100, 160, 220, 0.15)',
            width: 2,
            speed: 0.0002,
            points: [
                [0.05, 0.65], [0.15, 0.68], [0.3, 0.72], [0.45, 0.75],
                [0.6, 0.78], [0.75, 0.80], [0.9, 0.78], [1.0, 0.75]
            ]
        },
    ];

    // ============================================================
    // CANVAS SETUP
    // ============================================================

    const chartCanvas = document.getElementById('chartCanvas');
    const trailCanvas = document.getElementById('trailCanvas');
    const chartCtx = chartCanvas.getContext('2d');
    const trailCtx = trailCanvas.getContext('2d');

    let W, H, dpr;
    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;
    let time = 0;
    let zoomLevel = 1;
    let panX = 0, panY = 0;
    let targetPanX = 0, targetPanY = 0;
    let zoomTarget = 1;

    function resizeCanvases() {
        dpr = window.devicePixelRatio || 1;
        W = window.innerWidth;
        H = window.innerHeight;

        chartCanvas.width = W * dpr;
        chartCanvas.height = H * dpr;
        chartCanvas.style.width = W + 'px';
        chartCanvas.style.height = H + 'px';
        chartCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        trailCanvas.width = W * dpr;
        trailCanvas.height = H * dpr;
        trailCanvas.style.width = W + 'px';
        trailCanvas.style.height = H + 'px';
        trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    // ============================================================
    // UTILITY FUNILITIES
    // ============================================================

    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function dist(x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    function hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    }
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Convert normalized coords to canvas coords
    function toCanvas(nx, ny) {
        const cx = W / 2 - panX;
        const cy = H / 2 - panY;
        return {
            x: cx + (nx - 0.5) * W * zoomLevel,
            y: cy + (ny - 0.5) * H * zoomLevel
        };
    }

    // Convert canvas coords to normalized
    function toNormalized(cx, cy) {
        const rx = cx - (W / 2 - panX);
        const ry = cy - (H / 2 - panY);
        return {
            nx: 0.5 + rx / (W * zoomLevel),
            ny: 0.5 + ry / (H * zoomLevel)
        };
    }

    // ============================================================
    // STAR SYSTEM
    // ============================================================

    let allStars = [];
    let starFamilyColors = {};

    function buildStars() {
        allStars = [];
        for (const [famId, fam] of Object.entries(STAR_FAMILIES)) {
            starFamilyColors[famId] = fam.color;
            for (const s of fam.stars) {
                allStars.push({
                    ...s,
                    family: famId,
                    familyName: fam.name,
                    // Twinkle phase offset
                    twinkleOffset: Math.random() * Math.PI * 2,
                    twinkleSpeed: 0.5 + Math.random() * 2,
                    // For connection mode
                    isConstellation: false,
                    isConnected: false,
                    // Visual
                    hueShift: (Math.random() - 0.5) * 10,
                });
            }
        }
    }

    // Additional background stars for ambiance
    let backgroundStars = [];
    function buildBackgroundStars() {
        backgroundStars = [];
        for (let i = 0; i < 400; i++) {
            backgroundStars.push({
                nx: Math.random(),
                ny: Math.random(),
                mag: 0.3 + Math.random() * 2.5,
                twinkleOffset: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.3 + Math.random() * 3,
            });
        }
    }

    // Constellation dots for connect mode
    let constellationDots = [];
    let constellationLines = [];

    function buildConstellationDots() {
        constellationDots = [];
        constellationLines = [];
        let dotIndex = 0;
        for (const [cId, c] of Object.entries(CONSTELLATIONS)) {
            const startIdx = dotIndex;
            for (const s of c.stars) {
                constellationDots.push({
                    ...s,
                    id: dotIndex,
                    constellationId: cId,
                    constellationName: c.name,
                    radius: 6,
                    isHovered: false,
                    isConnected: false,
                    twinkleOffset: Math.random() * Math.PI * 2,
                });
                dotIndex++;
            }
            for (const [a, b] of c.lines) {
                constellationLines.push({
                    from: startIdx + a,
                    to: startIdx + b,
                    constellationId: cId,
                    color: c.color,
                    opacity: 0,
                });
            }
        }
    }

    // ============================================================
    // ISLAND SYSTEM
    // ============================================================

    let islands = [];

    function buildIslands() {
        islands = ISLAND_CHAINS.map((island, i) => ({
            ...island,
            pulsePhase: Math.random() * Math.PI * 2,
            discoverPhase: i * 0.3,
            discovered: false,
        }));
    }

    // ============================================================
    // OCEAN CURRENTS
    // ============================================================

    function drawOceanCurrents(ctx, t) {
        for (const current of OCEAN_CURRENTS) {
            const pts = current.points;
            if (pts.length < 2) continue;

            ctx.beginPath();
            ctx.strokeStyle = current.color;
            ctx.lineWidth = current.width;

            const offset = Math.sin(t * current.speed * 1000) * 5;

            for (let i = 0; i < pts.length; i++) {
                const { x, y } = toCanvas(pts[i][0], pts[i][1] + offset * 0.001 * i);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    // Use quadratic curves for smoothness
                    const prev = toCanvas(pts[i - 1][0], pts[i - 1][1] + offset * 0.001 * (i - 1));
                    const mx = (prev.x + x) / 2;
                    const my = (prev.y + y) / 2;
                    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
                }
            }

            const last = toCanvas(pts[pts.length - 1][0], pts[pts.length - 1][1] + offset * 0.001 * (pts.length - 1));
            ctx.quadraticCurveTo(
                toCanvas(pts[pts.length - 2][0], pts[pts.length - 2][1] + offset * 0.001 * (pts.length - 2)).x,
                toCanvas(pts[pts.length - 2][0], pts[pts.length - 2][1] + offset * 0.001 * (pts.length - 2)).y,
                last.x, last.y
            );

            ctx.stroke();

            // Draw flow arrows
            for (let i = 1; i < pts.length - 1; i += 2) {
                const { x, y } = toCanvas(pts[i][0], pts[i][1] + offset * 0.001 * i);
                const angle = Math.atan2(
                    toCanvas(pts[i + 1][0], pts[i + 1][1]).y - toCanvas(pts[i - 1][0], pts[i - 1][1]).y,
                    toCanvas(pts[i + 1][0], pts[i + 1][1]).x - toCanvas(pts[i - 1][0], pts[i - 1][1]).x
                );
                drawArrow(ctx, x, y, angle, 6, current.color.replace('0.', '0.5'));
            }
        }
    }

    function drawArrow(ctx, x, y, angle, size, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.6, -size * 0.4);
        ctx.lineTo(-size * 0.6, size * 0.4);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    // ============================================================
    // WAVE SYSTEM
    // ============================================================

    function drawWaves(ctx, t) {
        const baseY = H - 50;
        const layers = [
            { amp: 18, freq: 0.012, speed: 0.8, color: 'rgba(26, 77, 108, 0.35)', yOff: 0 },
            { amp: 14, freq: 0.018, speed: -0.6, color: 'rgba(13, 33, 55, 0.30)', yOff: 5 },
            { amp: 10, freq: 0.009, speed: 1.0, color: 'rgba(42, 90, 124, 0.20)', yOff: 10 },
            { amp: 22, freq: 0.007, speed: 0.4, color: 'rgba(19, 45, 74, 0.15)', yOff: -3 },
            { amp: 8, freq: 0.025, speed: -1.2, color: 'rgba(100, 160, 200, 0.12)', yOff: 15 },
        ];

        for (const wave of layers) {
            ctx.beginPath();
            ctx.moveTo(0, H);

            for (let x = 0; x <= W; x += 2) {
                const y = baseY + wave.yOff +
                    Math.sin(x * wave.freq + t * wave.speed) * wave.amp +
                    Math.sin(x * wave.freq * 1.8 + t * wave.speed * 0.7) * (wave.amp * 0.3);
                ctx.lineTo(x, y);
            }

            ctx.lineTo(W, H);
            ctx.closePath();

            // Fill with gradient
            const grad = ctx.createLinearGradient(0, baseY - wave.amp, 0, H);
            grad.addColorStop(0, wave.color);
            grad.addColorStop(1, 'rgba(6, 14, 26, 0.8)');
            ctx.fillStyle = grad;
            ctx.fill();

            // Stroke the wave crest
            ctx.beginPath();
            for (let x = 0; x <= W; x += 2) {
                const y = baseY + wave.yOff +
                    Math.sin(x * wave.freq + t * wave.speed) * wave.amp +
                    Math.sin(x * wave.freq * 1.8 + t * wave.speed * 0.7) * (wave.amp * 0.3);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = wave.color.replace('0.', '0.4').replace(')', ', 0.6)').replace('rgba(', 'rgba(');
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Foam spray at wave crests
        for (let i = 0; i < 3; i++) {
            const layer = layers[i];
            for (let x = 0; x < W; x += 40 + Math.sin(t * 0.001 + i) * 20) {
                const y = baseY + layer.yOff +
                    Math.sin(x * layer.freq + t * layer.speed) * layer.amp;
                const foamAlpha = Math.max(0, 0.15 + Math.sin(x * 0.05 + t * 0.003 + i) * 0.1);
                ctx.beginPath();
                ctx.arc(x + Math.sin(t * 0.002 + i * 10) * 3, y - 2, 1.5 + Math.random() * 1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 220, 240, ${foamAlpha})`;
                ctx.fill();
            }
        }
    }

    // ============================================================
    // DEEP OCEAN DEPTH EFFECT
    // ============================================================

    function drawOceanDepth(ctx) {
        // Vertical depth gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, 'rgba(10, 30, 60, 0.3)');
        grad.addColorStop(0.3, 'rgba(8, 20, 40, 0.2)');
        grad.addColorStop(0.6, 'rgba(6, 12, 28, 0.15)');
        grad.addColorStop(1, 'rgba(4, 8, 18, 0.1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Caustic light patterns on the "surface"
        if (time % 3 < 2.5) {
            ctx.save();
            ctx.globalAlpha = 0.03;
            for (let i = 0; i < 8; i++) {
                const cx = W * (0.1 + Math.sin(time * 0.0005 + i * 0.8) * 0.3);
                const cy = H * (0.15 + Math.cos(time * 0.0004 + i * 1.1) * 0.15);
                const r = 80 + Math.sin(time * 0.001 + i) * 30;
                const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                cGrad.addColorStop(0, 'rgba(100, 180, 255, 0.5)');
                cGrad.addColorStop(1, 'rgba(100, 180, 255, 0)');
                ctx.fillStyle = cGrad;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // ============================================================
    // STAR DOME / ATMOSPHERE
    // ============================================================

    function drawStarDome(ctx) {
        // Subtle atmospheric glow based on mouse position
        const gx = mouseX * W;
        const gy = mouseY * H;

        // Milky Way band
        ctx.save();
        ctx.globalAlpha = 0.04;
        ctx.beginPath();
        ctx.moveTo(0, H * 0.3);
        for (let x = 0; x <= W; x += 10) {
            const y = H * 0.3 +
                Math.sin(x * 0.003 + 1) * 80 +
                Math.sin(x * 0.007 + 2) * 40 +
                Math.cos(x * 0.001 + 3) * 20;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        const mwGrad = ctx.createLinearGradient(0, 0, 0, H);
        mwGrad.addColorStop(0, 'rgba(180, 200, 240, 0.3)');
        mwGrad.addColorStop(0.5, 'rgba(120, 140, 180, 0.1)');
        mwGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = mwGrad;
        ctx.fill();
        ctx.restore();

        // Atmospheric glow at zenith following cursor
        const zenithGlow = ctx.createRadialGradient(
            W * 0.5 + (mouseX - 0.5) * 100,
            H * 0.3 + (mouseY - 0.5) * 80,
            0,
            W * 0.5 + (mouseX - 0.5) * 100,
            H * 0.3 + (mouseY - 0.5) * 80,
            W * 0.6
        );
        zenithGlow.addColorStop(0, 'rgba(100, 150, 220, 0.06)');
        zenithGlow.addColorStop(0.5, 'rgba(60, 100, 160, 0.03)');
        zenithGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = zenithGlow;
        ctx.fillRect(0, 0, W, H);
    }

    // ============================================================
    // STAR RENDERING
    // ============================================================

    function drawStars(ctx, t) {
        // Draw background stars first
        for (const s of backgroundStars) {
            const pos = toCanvas(s.nx, s.ny);
            if (pos.x < -20 || pos.x > W + 20 || pos.y < -20 || pos.y > H + 20) continue;

            const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
            const size = s.mag * 0.5 * zoomLevel;
            const alpha = (1 - s.mag / 4) * twinkle * 0.6;

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, Math.max(0.3, size), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
            ctx.fill();
        }

        // Draw constellation dots if in connect mode
        if (activeLayers.includes('constellations')) {
            for (const dot of constellationDots) {
                const pos = toCanvas(dot.nx, dot.ny);
                const twinkle = 0.7 + 0.3 * Math.sin(t * 3 + dot.twinkleOffset);
                const r = (dot.isConnected ? 8 : dot.isHovered ? 7 : 5) * zoomLevel;

                // Glow
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, r * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${dot.isConnected ? '255, 215, 0' : '170, 200, 255'}, ${0.15 * twinkle})`;
                ctx.fill();

                // Dot
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
                ctx.fillStyle = dot.isConnected ? '#ffd700' : '#ffffff';
                ctx.globalAlpha = twinkle;
                ctx.fill();
                ctx.globalAlpha = 1;

                // Ring
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, r + 2, 0, Math.PI * 2);
                ctx.strokeStyle = dot.isConnected ? 'rgba(255, 215, 0, 0.5)' : 'rgba(170, 200, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw constellation lines
            for (const line of constellationLines) {
                const fromDot = constellationDots[line.from];
                const toDot = constellationDots[line.to];
                if (!fromDot || !toDot) continue;
                if (!fromDot.isConnected || !toDot.isConnected) continue;

                const from = toCanvas(fromDot.nx, fromDot.ny);
                const to = toCanvas(toDot.nx, toDot.ny);

                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.strokeStyle = line.color;
                ctx.lineWidth = 2 * zoomLevel;
                ctx.globalAlpha = 0.8;
                ctx.setLineDash([4, 4]);
                ctx.lineDashOffset = -t * 20;
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            }
        }

        // Draw named star families
        for (const [famId, fam] of Object.entries(STAR_FAMILIES)) {
            const isActive = activeLayers.includes('starPaths');
            for (const s of fam.stars) {
                const pos = toCanvas(s.nx, s.ny);
                if (pos.x < -50 || pos.x > W + 50 || pos.y < -50 || pos.y > H + 50) continue;

                const twinkle = 0.5 + 0.5 * Math.abs(Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
                const baseSize = (4 - s.mag) * 1.2 * zoomLevel;
                const size = Math.max(0.5, baseSize);

                if (isActive) {
                    // Outer glow
                    const glowR = size * 4;
                    const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowR);
                    glow.addColorStop(0, fam.color.replace(')', `, ${0.3 * twinkle})`).replace('rgb', 'rgba'));
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2);
                    ctx.fill();

                    // Star body
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = fam.color;
                    ctx.globalAlpha = twinkle;
                    ctx.fill();
                    ctx.globalAlpha = 1;

                    // Bright star spikes for bright stars
                    if (s.mag < 1.5) {
                        drawStarSpikes(ctx, pos.x, pos.y, size * 2, 4, twinkle);
                    }
                } else {
                    // Dim when layer inactive
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, Math.max(0.5, size * 0.5), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(200, 210, 230, ${0.15 * twinkle})`;
                    ctx.fill();
                }
            }

            // Draw star path lines within families
            if (isActive && fam.stars.length > 1) {
                ctx.beginPath();
                ctx.strokeStyle = fam.color;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.25;
                ctx.setLineDash([6, 8]);
                ctx.lineDashOffset = -t * 15;

                for (let i = 0; i < fam.stars.length - 1; i++) {
                    const from = toCanvas(fam.stars[i].nx, fam.stars[i].ny);
                    const to = toCanvas(fam.stars[i + 1].nx, fam.stars[i + 1].ny);
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                }
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            }
        }
    }

    function drawStarSpikes(ctx, x, y, r, spikes, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        const angleStep = Math.PI * 2 / spikes;
        const spikeLen = r * 2.5;
        for (let i = 0; i < spikes; i++) {
            const angle = i * angleStep + time * 0.0001;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * spikeLen, y + Math.sin(angle) * spikeLen);
            ctx.stroke();
        }
        ctx.restore();
    }

    // ============================================================
    // ISLAND RENDERING
    // ============================================================

    function drawIslands(ctx, t) {
        for (const island of islands) {
            const pos = toCanvas(island.nx, island.ny);
            if (pos.x < -60 || pos.x > W + 60 || pos.y < -60 || pos.y > H + 60) continue;

            const pulse = 1 + 0.1 * Math.sin(t * 0.002 + island.pulsePhase);
            const r = island.radius * zoomLevel * pulse;

            // Outer glow
            const outerGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 4);
            outerGlow.addColorStop(0, island.color.replace(')', ', 0.15)').replace('rgb', 'rgba'));
            outerGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r * 4, 0, Math.PI * 2);
            ctx.fill();

            // Inner glow
            const innerGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 1.5);
            innerGlow.addColorStop(0, island.color.replace(')', ', 0.4)').replace('rgb', 'rgba'));
            innerGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = innerGlow;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = island.color;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Carved tiki marker on the island
            drawTikiMarker(ctx, pos.x, pos.y, r * 0.8, island.color, t);

            // Island label
            ctx.font = `${10 * zoomLevel}px 'Cinzel', serif`;
            ctx.fillStyle = '#c9a84c';
            ctx.textAlign = 'center';
            ctx.globalAlpha = 0.9;
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText(island.name, pos.x, pos.y + r * 2 + 14 * zoomLevel);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.5;
            ctx.font = `${8 * zoomLevel}px 'Crimson Text', serif`;
            ctx.fillStyle = '#8a8070';
            ctx.fillText(island.polynesian, pos.x, pos.y + r * 2 + 24 * zoomLevel);
            ctx.globalAlpha = 1;

            // Navigation line from island to nearest other island
            if (activeLayers.includes('starPaths')) {
                for (const other of islands) {
                    if (other === island) continue;
                    const otherPos = toCanvas(other.nx, other.ny);
                    const d = dist(pos.x, pos.y, otherPos.x, otherPos.y);
                    if (d < W * 0.35) {
                        ctx.beginPath();
                        ctx.moveTo(pos.x, pos.y);
                        ctx.lineTo(otherPos.x, otherPos.y);
                        ctx.strokeStyle = 'rgba(201, 168, 76, 0.06)';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([8, 12]);
                        ctx.lineDashOffset = -t * 10;
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            }
        }
    }

    function drawTikiMarker(ctx, x, y, size, color, t) {
        const sway = Math.sin(t * 0.001) * 0.02;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 20, size / 20);

        // Body
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.quadraticCurveTo(-12, -8, -8, 5);
        ctx.quadraticCurveTo(-5, 15, 0, 20);
        ctx.quadraticCurveTo(5, 15, 8, 5);
        ctx.quadraticCurveTo(12, -8, 0, -18);
        ctx.fillStyle = 'rgba(26, 15, 6, 0.6)';
        ctx.fill();
        ctx.strokeStyle = color.replace(')', ', 0.5)').replace('rgb', 'rgba');
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Eyes
        ctx.beginPath();
        ctx.arc(-5, -6, 2.5, 0, Math.PI * 2);
        ctx.arc(5, -6, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 0.003);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Mouth
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0.2, Math.PI - 0.2);
        ctx.strokeStyle = color.replace(')', ', 0.6)').replace('rgb', 'rgba');
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Crown
        ctx.beginPath();
        ctx.moveTo(-8, -16);
        ctx.lineTo(-10, -22);
        ctx.lineTo(-5, -18);
        ctx.lineTo(0, -24);
        ctx.lineTo(5, -18);
        ctx.lineTo(10, -22);
        ctx.lineTo(8, -16);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
    }

    // ============================================================
    // COMPASS SYSTEM
    // ============================================================

    function updateCompass() {
        const angle = Math.atan2(targetMouseX - 0.5, targetMouseY - 0.5) * (180 / Math.PI);
        const heading = ((90 - angle + 360) % 360).toFixed(0);
        const headingStr = heading.toString().padStart(3, '0');

        const compassEl = document.getElementById('compassHeading');
        const needle = document.getElementById('compassNeedle');

        let dirName = 'N';
        if (heading >= 22.5 && heading < 67.5) dirName = 'NE';
        else if (heading >= 67.5 && heading < 112.5) dirName = 'E';
        else if (heading >= 112.5 && heading < 157.5) dirName = 'SE';
        else if (heading >= 157.5 && heading < 202.5) dirName = 'S';
        else if (heading >= 202.5 && heading < 247.5) dirName = 'SW';
        else if (heading >= 247.5 && heading < 292.5) dirName = 'W';
        else if (heading >= 292.5 && heading < 337.5) dirName = 'NW';

        if (compassEl) compassEl.textContent = `${headingStr}° ${dirName}`;

        // Rotate the compass rose SVG
        const rose = document.querySelector('.compass-rose');
        if (rose) {
            rose.style.setProperty('--compass-rotation', `${heading * 30}s`);
            rose.style.animationPlayState = 'running';
        }

        // Rotate needle in opposite direction
        if (needle) {
            needle.setAttribute('transform', `rotate(${heading}, 100, 100)`);
        }

        // Update coordinates display (fake but realistic-looking)
        const lat = (mouseY - 0.5) * 40;
        const lon = (mouseX - 0.5) * 360;
        const latDir = lat >= 0 ? 'N' : 'S';
        const lonDir = lon >= 0 ? 'E' : 'W';
        const latStr = `${Math.abs(lat).toFixed(1)}°${latDir}`;
        const lonStr = `${Math.abs(lon).toFixed(1)}°${lonDir}`;

        const coordsEl = document.getElementById('compassCoords');
        if (coordsEl) coordsEl.textContent = `${latStr}, ${lonStr}`;
    }

    // ============================================================
    // BIOLUMINESCENT WAKE TRAIL
    // ============================================================

    let wakeParticles = [];
    const MAX_WAKE_PARTICLES = 150;

    class WakeParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.life = 1;
            this.decay = 0.008 + Math.random() * 0.012;
            this.radius = 1 + Math.random() * 2.5;
            this.hue = 140 + Math.random() * 30; // greenish-teal
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.radius += 0.05;
        }

        draw(ctx) {
            if (this.life <= 0) return;
            const alpha = this.life * 0.6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${alpha})`;
            ctx.fill();

            // Glow
            const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
            glow.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${alpha * 0.3})`);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function updateWakeTrail() {
        // Spawn particles at cursor position
        if (isMouseActive && activeLayers.includes('bioluminescence')) {
            const cx = mouseX * W;
            const cy = mouseY * H;
            for (let i = 0; i < 2; i++) {
                if (wakeParticles.length < MAX_WAKE_PARTICLES) {
                    wakeParticles.push(new WakeParticle(
                        cx + (Math.random() - 0.5) * 10,
                        cy + (Math.random() - 0.5) * 10
                    ));
                }
            }
        }

        // Update particles
        for (let i = wakeParticles.length - 1; i >= 0; i--) {
            wakeParticles[i].update();
            if (wakeParticles[i].life <= 0) {
                wakeParticles.splice(i, 1);
            }
        }
    }

    function drawWakeTrail(ctx) {
        // Sort by life so older particles are drawn first
        wakeParticles.sort((a, b) => a.life - b.life);
        for (const p of wakeParticles) {
            p.draw(ctx);
        }

        // Draw connecting tendrils between nearby particles
        if (activeLayers.includes('bioluminescence') && wakeParticles.length > 2) {
            ctx.save();
            for (let i = 0; i < wakeParticles.length; i++) {
                for (let j = i + 1; j < wakeParticles.length; j++) {
                    const p1 = wakeParticles[i];
                    const p2 = wakeParticles[j];
                    const d = dist(p1.x, p1.y, p2.x, p2.y);
                    if (d < 40) {
                        const alpha = Math.min(p1.life, p2.life) * (1 - d / 40) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `hsla(150, 80%, 50%, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }
    }

    // ============================================================
    // TIKI EYE SVG FILTER INJECTION
    // ============================================================

    function injectTikiFilters() {
        const tikiSVGs = document.querySelectorAll('.tiki-guardian svg');
        tikiSVGs.forEach(svg => {
            // Remove existing defs if any
            const existingDefs = svg.querySelector('defs');
            if (existingDefs) existingDefs.remove();

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.innerHTML = `
                <filter id="tiki-glow-${Math.random().toString(36).substr(2, 5)}" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                    <feFlood flood-color="#c9a84c" flood-opacity="0.6" result="color"/>
                    <feComposite in="color" in2="blur" operator="in" result="glow"/>
                    <feMerge>
                        <feMergeNode in="glow"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            `;
            svg.insertBefore(defs, svg.firstChild);

            // Update filter references in the SVG
            const eyes = svg.querySelectorAll('.tiki-eye');
            eyes.forEach(eye => {
                eye.setAttribute('filter', `url(#${defs.querySelector('filter').id})`);
            });
        });
    }

    // ============================================================
    // LAYER MANAGEMENT
    // ============================================================

    let activeLayers = ['starPaths', 'currents', 'waves', 'islands'];
    const layerKeys = ['starPaths', 'currents', 'waves', 'islands', 'constellations', 'bioluminescence'];

    function toggleLayer(layer) {
        const idx = activeLayers.indexOf(layer);
        if (idx > -1) {
            activeLayers.splice(idx, 1);
        } else {
            activeLayers.push(layer);
        }
        updateNavButtons();
        updateVoyageLog(layer, idx > -1 ? 'disabled' : 'enabled');
    }

    function updateNavButtons() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const layer = btn.dataset.layer;
            if (activeLayers.includes(layer)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ============================================================
    // VOYAGE LOG
    // ============================================================

    function updateVoyageLog(target, action) {
        const logBody = document.getElementById('logBody');
        const entry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

        let typeClass = 'log-entry-star';
        let icon = '✦';
        let message = '';

        const messages = {
            starPaths: {
                enabled: 'Star paths illuminated. The celestial roads of our ancestors now glow before you.',
                disabled: 'Star paths fade into the deep. The stars return to their silent watch.'
            },
            currents: {
                enabled: 'Ocean currents revealed. Feel the pull of Te Moana Nui beneath your vessel.',
                disabled: 'Currents hidden once more. The ocean\'s rivers flow unseen.'
            },
            waves: {
                enabled: 'Wave patterns visible. Read the swell as the ancient ones did.',
                disabled: 'Swell patterns calm. The ocean settles into stillness.'
            },
            islands: {
                enabled: 'Island chains materialize. Home beckons across the vast blue.',
                disabled: 'Islands recede into mist. Trust the stars to guide you.'
            },
            constellations: {
                enabled: 'Constellation mode engaged. Click the stars to trace sacred paths across the sky.',
                disabled: 'Constellation tracing complete. The star paths await your next journey.'
            },
            bioluminescence: {
                enabled: 'Bioluminescent wake activated. Your passage leaves light upon the water.',
                disabled: 'The wake fades. Only the deep remains.'
            },
        };

        if (messages[target]) {
            message = messages[target][action] || '';
            if (action === 'discovered') {
                message = `🏝️ Island discovered: <strong>${target}</strong>. Another waypoint in the great voyage.`;
                typeClass = 'log-entry-island';
            }
        }

        entry.className = `log-entry ${typeClass}`;
        entry.innerHTML = `
            <span class="log-time">${timestamp}</span>
            <p>${message}</p>
        `;

        logBody.appendChild(entry);
        logBody.scrollTop = logBody.scrollHeight;
    }

    // ============================================================
    // LEGEND & ISLAND PANELS
    // ============================================================

    function populateLegend() {
        const legendList = document.getElementById('legendList');
        legendList.innerHTML = '';
        for (const [famId, fam] of Object.entries(STAR_FAMILIES)) {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-color" style="background: ${fam.color}; color: ${fam.color};"></div>
                <div class="legend-info">
                    <div class="legend-name">${fam.name}</div>
                    <div class="legend-desc">${fam.desc}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                document.querySelectorAll('.legend-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                addLogEntry('star', `<strong>${fam.name}</strong> — ${fam.desc}`);
            });
            legendList.appendChild(item);
        }
    }

    function addLogEntry(type, message) {
        const logBody = document.getElementById('logBody');
        const entry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        entry.className = `log-entry log-entry-${type}`;
        entry.innerHTML = `
            <span class="log-time">${timestamp}</span>
            <p>${message}</p>
        `;
        logBody.appendChild(entry);
        logBody.scrollTop = logBody.scrollHeight;
    }

    function populateIslands() {
        const islandList = document.getElementById('islandList');
        islandList.innerHTML = '';
        for (const island of islands) {
            const item = document.createElement('div');
            item.className = 'island-item';
            item.innerHTML = `
                <div class="island-marker" style="background: ${island.color}; color: ${island.color};"></div>
                <div class="island-info">
                    <div class="island-name">${island.name}</div>
                    <div class="island-detail">${island.desc.split('.')[0]}</div>
                </div>
                <div class="island-distance">${(dist(mouseX, mouseY, island.nx, island.ny) * 100).toFixed(0)}°</div>
            `;
            item.addEventListener('mouseenter', () => {
                item.classList.add('active');
                // Flash the island on the chart
                island._highlight = true;
                island._highlightTime = performance.now();
            });
            item.addEventListener('mouseleave', () => {
                item.classList.remove('active');
                island._highlight = false;
            });
            islandList.appendChild(item);
        }
    }

    // ============================================================
    // CONSTELLATION CONNECT-THE-DOTS INTERACTION
    // ============================================================

    let connectPath = [];
    let connectMode = false;

    function enterConnectMode() {
        connectMode = true;
        connectPath = [];
        constellationDots.forEach(d => { d.isConnected = false; d.isHovered = false; });
        constellationLines.forEach(l => { l.opacity = 0; });
        document.getElementById('connectBanner').classList.add('visible');
        addLogEntry('star', 'Constellation mode engaged. Click stars in sequence to trace Polynesian star paths across the sky.');
    }

    function exitConnectMode() {
        connectMode = false;
        connectPath = [];
        constellationDots.forEach(d => { d.isConnected = false; d.isHovered = false; });
        constellationLines.forEach(l => { l.opacity = 0; });
        document.getElementById('connectBanner').classList.remove('visible');
    }

    function handleConnectClick(nx, ny) {
        if (!connectMode) return;

        let closestDot = null;
        let closestDist = Infinity;

        for (const dot of constellationDots) {
            if (dot.isConnected) continue;
            const d = dist(nx, ny, dot.nx, dot.ny);
            if (d < closestDist && d < 0.05) {
                closestDist = d;
                closestDot = dot;
            }
        }

        if (closestDot) {
            closestDot.isConnected = true;
            connectPath.push(closestDot.id);

            // Update lines
            for (const line of constellationLines) {
                if (line.from === closestDot.id || line.to === closestDot.id) {
                    const fromDot = constellationDots[line.from];
                    const toDot = constellationDots[line.to];
                    if (fromDot && toDot && fromDot.isConnected && toDot.isConnected) {
                        line.opacity = 1;
                    }
                }
            }

            // Check for completion
            const allConnected = constellationDots.every(d => d.isConnected);
            if (allConnected) {
                addLogEntry('star', '<strong>Wayfinding path complete!</strong> The stars have spoken. You have traced the ancient celestial roads across the Pacific sky.');
                setTimeout(exitConnectMode, 3000);
            } else {
                const clickSound = new (window.AudioContext || window.webkitAudioContext)();
                const osc = clickSound.createOscillator();
                const gain = clickSound.createGain();
                osc.connect(gain);
                gain.connect(clickSound.destination);
                osc.frequency.value = 600 + Math.random() * 400;
                gain.gain.value = 0.05;
                osc.start();
                setTimeout(() => { osc.stop(); clickSound.close(); }, 100);
            }
        }
    }

    // ============================================================
    // MOUSE / TOUCH HANDLING
    // ============================================================

    let isMouseActive = false;
    let mouseActivityTimeout;

    function updateMousePosition(clientX, clientY) {
        targetMouseX = clientX / W;
        targetMouseY = clientY / H;
        isMouseActive = true;
        clearTimeout(mouseActivityTimeout);
        mouseActivityTimeout = setTimeout(() => { isMouseActive = false; }, 2000);
    }

    document.addEventListener('mousemove', (e) => {
        updateMousePosition(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // Canvas click for constellation connect
    chartCanvas.addEventListener('click', (e) => {
        if (!connectMode) {
            // Check if an island was clicked
            const nPos = toNormalized(e.clientX, e.clientY);
            for (const island of islands) {
                const d = dist(nPos.nx, nPos.ny, island.nx, island.ny);
                if (d < 0.03) {
                    if (!island.discovered) {
                        island.discovered = true;
                        updateVoyageLog(island.name, 'discovered');
                    }
                    // Pan to island
                    targetPanX = (island.nx - 0.5) * W * zoomTarget;
                    targetPanY = (island.ny - 0.5) * H * zoomTarget;
                    zoomTarget = Math.min(2.5, 1 + 0.5 / (d + 0.1));
                    break;
                }
            }
        } else {
            const nPos = toNormalized(e.clientX, e.clientY);
            handleConnectClick(nPos.nx, nPos.ny);
        }
    });

    // Canvas hover for constellation dots
    chartCanvas.addEventListener('mousemove', (e) => {
        if (connectMode) {
            const nPos = toNormalized(e.clientX, e.clientY);
            constellationDots.forEach(d => {
                d.isHovered = dist(nPos.nx, nPos.ny, d.nx, d.ny) < 0.03;
            });
        }
    });

    chartCanvas.addEventListener('mouseleave', () => {
        constellationDots.forEach(d => { d.isHovered = false; });
    });

    // ============================================================
    // NAVIGATION PANEL HANDLERS
    // ============================================================

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const layer = btn.dataset.layer;
            toggleLayer(layer);
        });
    });

    // Connect mode dismiss
    document.getElementById('connectDismiss').addEventListener('click', (e) => {
        e.stopPropagation();
        exitConnectMode();
    });

    // Ambience toggle
    const ambienceBtn = document.getElementById('ambienceToggle');
    let ambienceActive = false;
    ambienceBtn.addEventListener('click', () => {
        ambienceActive = !ambienceActive;
        ambienceBtn.classList.toggle('active', ambienceActive);
        // Ambient audio simulation (visual only)
        if (ambienceActive) {
            addLogEntry('star', '🌊 Ocean ambience activated. Listen to the ancient rhythms of Te Moana Nui.');
        }
    });

    // Fullscreen zoom controls
    document.getElementById('fsZoomIn').addEventListener('click', () => {
        zoomTarget = Math.min(3, zoomTarget + 0.3);
    });

    document.getElementById('fsZoomOut').addEventListener('click', () => {
        zoomTarget = Math.max(0.5, zoomTarget - 0.3);
    });

    document.getElementById('fsReset').addEventListener('click', () => {
        zoomTarget = 1;
        targetPanX = 0;
        targetPanY = 0;
    });

    // Voyage log toggle
    document.getElementById('logToggle').addEventListener('click', () => {
        const logBody = document.getElementById('logBody');
        const toggle = document.getElementById('logToggle');
        if (logBody.style.display === 'none') {
            logBody.style.display = 'block';
            toggle.textContent = '−';
        } else {
            logBody.style.display = 'none';
            toggle.textContent = '+';
        }
    });

    // ============================================================
    // TICK MARKS (Celestial coordinate ring)
    // ============================================================

    function drawCelestialRing(ctx, t) {
        const cx = W / 2 - panX;
        const cy = H / 2 - panY;
        const ringR = Math.min(W, H) * 0.45 * zoomLevel;

        ctx.save();
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.08)';
        ctx.lineWidth = 1;

        // Outer ring
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();

        // Tick marks every 30 degrees (12 houses)
        const houseNames = [
            'Manu', 'Hina', 'Māui', 'Tane', 'Rongo',
            'Tū', 'Tangaroa', 'Rongo-mā-Tāne',
            'Whiro', 'Taane', 'Aituā', 'Te Rā'
        ];

        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Tick line
            ctx.beginPath();
            ctx.moveTo(cx + cos * ringR, cy + sin * ringR);
            ctx.lineTo(cx + cos * (ringR + 12), cy + sin * (ringR + 12));
            ctx.strokeStyle = 'rgba(201, 168, 76, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // House label
            const labelR = ringR + 24;
            ctx.font = `${9 * zoomLevel}px 'Cinzel', serif`;
            ctx.fillStyle = 'rgba(201, 168, 76, 0.3)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(houseNames[i], cx + cos * labelR, cy + sin * labelR);
        }

        // Horizon line
        const horizonY = cy + ringR * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(W, horizonY);
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.05)';
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = -t * 5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Horizon label
        ctx.font = `${8 * zoomLevel}px 'Crimson Text', italic serif`;
        ctx.fillStyle = 'rgba(201, 168, 76, 0.2)';
        ctx.textAlign = 'left';
        ctx.fillText('TE MOANA — THE HORIZON', 20, horizonY - 8);

        ctx.restore();
    }

    // ============================================================
    // TAPA CLOTH CANVAS TEXTURE (enhanced)
    // ============================================================

    function drawTapaTexture(ctx) {
        // Subtle additional texture on the chart canvas
        ctx.save();
        ctx.globalAlpha = 0.02;

        // Cross-hatch pattern mimicking bark cloth
        for (let x = 0; x < W; x += 20) {
            for (let y = 0; y < H; y += 20) {
                ctx.fillRect(x, y, 1, 1);
            }
        }

        // Larger bark fiber lines
        ctx.globalAlpha = 0.04;
        ctx.strokeStyle = '#6b4c3b';
        ctx.lineWidth = 0.5;

        for (let i = 0; i < 30; i++) {
            const y = (i * 37 + time * 0.001 * (i % 3)) % H;
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < W; x += 30) {
                ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 2);
            }
            ctx.stroke();
        }

        ctx.restore();
    }

    // ============================================================
    // COMPASS NEEDLE DRAWING (on canvas for better control)
    // ============================================================

    function drawCanvasCompass(ctx, t) {
        const cx = W * 0.5;
        const cy = H * 0.5;
        const compassR = 120 * zoomLevel;

        // Only draw if zoomed in enough
        if (zoomLevel < 0.8) return;

        ctx.save();
        ctx.globalAlpha = Math.min(1, (zoomLevel - 0.8) * 3) * 0.4;

        // Cardinal ring
        ctx.beginPath();
        ctx.arc(cx, cy, compassR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Cardinal points
        const directions = [
            { label: 'N', angle: -90, color: '#c9a84c' },
            { label: 'E', angle: 0, color: '#8a8070' },
            { label: 'S', angle: 90, color: '#8a8070' },
            { label: 'W', angle: 180, color: '#8a8070' },
        ];

        for (const dir of directions) {
            const rad = (dir.angle - 90 + (mouseX - 0.5) * 60) * Math.PI / 180;
            const x = cx + Math.cos(rad) * compassR;
            const y = cy + Math.sin(rad) * compassR;
            ctx.font = `${12 * zoomLevel}px 'Cinzel', serif`;
            ctx.fillStyle = dir.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dir.label, x, y);
        }

        // Direction pointer
        const pointerAngle = (mouseX - 0.5) * Math.PI;
        const pointerLen = compassR * 0.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(pointerAngle) * pointerLen, cy + Math.sin(pointerAngle) * pointerLen);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
    }

    // ============================================================
    // SPARKLE / SHIMMER OVERLAY
    // ============================================================

    function drawSparkles(ctx, t) {
        // Random occasional sparkles in the star field
        ctx.save();
        for (let i = 0; i < 30; i++) {
            const seed = i * 137.5;
            const sparkleTime = (t * 0.001 + seed) % 5;
            if (sparkleTime > 4.5) {
                const x = (Math.sin(seed) * 0.5 + 0.5) * W;
                const y = (Math.cos(seed * 1.3) * 0.5 + 0.5) * H;
                const alpha = (sparkleTime - 4.5) * 2;
                const r = 1 + Math.random() * 2;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // ============================================================
    // VIGNETTE EFFECT
    // ============================================================

    function drawVignette(ctx) {
        const gradient = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.75);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
    }

    // ============================================================
    // MAIN ANIMATION LOOP
    // ============================================================

    function animate(timestamp) {
        time = timestamp || 0;
        const t = time * 0.001;

        // Smooth mouse following
        mouseX = lerp(mouseX, targetMouseX, 0.05);
        mouseY = lerp(mouseY, targetMouseY, 0.05);

        // Smooth zoom and pan
        zoomLevel = lerp(zoomLevel, zoomTarget, 0.05);
        panX = lerp(panX, targetPanX, 0.05);
        panY = lerp(panY, targetPanY, 0.05);

        // ===== CHART CANVAS =====
        chartCtx.clearRect(0, 0, W, H);

        // Deep ocean base
        chartCtx.fillStyle = '#060e1a';
        chartCtx.fillRect(0, 0, W, H);

        // Subtle radial sky glow at top
        const skyGlow = chartCtx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, H * 0.6);
        skyGlow.addColorStop(0, 'rgba(20, 50, 90, 0.3)');
        skyGlow.addColorStop(0.5, 'rgba(12, 28, 52, 0.15)');
        skyGlow.addColorStop(1, 'transparent');
        chartCtx.fillStyle = skyGlow;
        chartCtx.fillRect(0, 0, W, H);

        // Star dome atmosphere
        drawStarDome(chartCtx, t);

        // Ocean depth caustics
        drawOceanDepth(chartCtx, t);

        // Tapa texture overlay
        drawTapaTexture(chartCtx, t);

        // Celestial ring
        drawCelestialRing(chartCtx, t);

        // Ocean currents
        if (activeLayers.includes('currents')) {
            drawOceanCurrents(chartCtx, t);
        }

        // Star paths (named family constellations)
        drawStars(chartCtx, t);

        // Islands
        if (activeLayers.includes('islands')) {
            drawIslands(chartCtx, t);
        }

        // Waves at bottom
        if (activeLayers.includes('waves')) {
            drawWaves(chartCtx, t);
        }

        // Compass overlay on chart
        drawCanvasCompass(chartCtx, t);

        // Vignette
        drawVignette(chartCtx);

        // Sparkles
        drawSparkles(chartCtx, t);

        // ===== TRAIL CANVAS (Bioluminescence) =====
        trailCtx.clearRect(0, 0, W, H);
        updateWakeTrail();
        drawWakeTrail(trailCtx);

        // ===== UPDATE COMPASS =====
        updateCompass();

        // ===== UPDATE ISLAND DISTANCES =====
        updateIslandDistances();

        requestAnimationFrame(animate);
    }

    function updateIslandDistances() {
        const items = document.querySelectorAll('.island-item .island-distance');
        items.forEach((el, i) => {
            if (islands[i]) {
                const d = dist(mouseX, mouseY, islands[i].nx, islands[i].ny);
                el.textContent = `${(d * 100).toFixed(0)}°`;
            }
        });
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function init() {
        // Build data
        buildStars();
        buildBackgroundStars();
        buildConstellationDots();
        buildIslands();

        // Populate UI
        populateLegend();
        populateIslands();

        // Inject SVG filters for tiki eyes
        injectTikiFilters();

        // Set initial nav button states
        updateNavButtons();

        // Set compass rotation CSS variable
        document.documentElement.style.setProperty('--compass-rotation', '30s');

        // Loading screen fade out
        setTimeout(() => {
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => loadingScreen.remove(), 1000);
            }
        }, 1500);

        // Initial log entry
        updateVoyageLog('starPaths', 'enabled');
        updateVoyageLog('currents', 'enabled');
        updateVoyageLog('waves', 'enabled');
        updateVoyageLog('islands', 'enabled');

        // Add welcome delay
        setTimeout(() => {
            addLogEntry('star', 'The Polynesian star compass is your guide. Look to the heavens — the answers are written in light.');
            addLogEntry('star', 'Drag the chart by moving your cursor. Scroll to zoom toward the stars or islands.');
        }, 3000);

        // Start animation
        requestAnimationFrame(animate);
    }

    // Handle mouse wheel zoom
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        zoomTarget = Math.max(0.3, Math.min(3.5, zoomTarget + delta));
    }, { passive: false });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case '1': toggleLayer('starPaths'); break;
            case '2': toggleLayer('currents'); break;
            case '3': toggleLayer('waves'); break;
            case '4': toggleLayer('islands'); break;
            case '5': toggleLayer('constellations'); break;
            case '6': toggleLayer('bioluminescence'); break;
            case '0':
                zoomTarget = 1;
                targetPanX = 0;
                targetPanY = 0;
                break;
            case 'Escape':
                exitConnectMode();
                break;
        }
    });

    // Start everything
    init();

})();