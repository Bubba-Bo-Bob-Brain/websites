/* ============================================
   NSS PROMETHEUS — BRIDGE CONSOLE SCRIPTS
   Synthwave / Retrowave Aesthetic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration & State ---
    const state = {
        missionTime: 0,
        stardate: 47634.2,
        shieldIntegrity: 87,
        shieldTarget: 87,
        navHeading: 47.2,
        navVelocity: 0.82,
        targetLocked: false,
        targetLockProgress: 0,
        engaged: false,
        scanActive: false,
        scanProgress: 0,
        lastFrame: 0
    };

    const colors = {
        cyan: '#00ffff',
        pink: '#ff00ff',
        magenta: '#ff1493',
        orange: '#ff8c00',
        yellow: '#ffe600',
        darkBg: '#05010a'
    };

    // --- Canvas Context Initialization ---
    const canvases = {};

    function initCanvas(id, scaleFactor = 1) {
        const el = document.getElementById(id);
        if (!el) return null;
        const ctx = el.getContext('2d');
        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = el.getBoundingClientRect();
        
        // Set actual size in memory (scaled to account for extra pixel density)
        el.width = rect.width * dpr;
        el.height = rect.height * dpr;
        
        // Normalize coordinate system to use css pixels
        ctx.scale(dpr, dpr);
        
        return { el, ctx, w: rect.width, h: rect.height, dpr };
    }

    // Initialize all canvases
    const starCanvas = initCanvas('starfield');
    const gridCanvas = initCanvas('grid-floor');
    const compassCanvas = initCanvas('nav-compass-canvas');
    const shieldCanvas = initCanvas('shield-canvas');
    const targetCanvas = initCanvas('targeting-canvas');
    const freqCanvas = initCanvas('frequency-canvas');

    // --- Starfield Logic ---
    const stars = [];
    const STAR_COUNT = 400;
    const STAR_SPEED = 0.5;

    function initStars() {
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * starCanvas.w * 2 - starCanvas.w,
                y: Math.random() * starCanvas.h * 2 - starCanvas.h,
                z: Math.random() * 1000
            });
        }
    }
    initStars();

    function drawStarfield() {
        const { ctx, w, h } = starCanvas;
        ctx.fillStyle = colors.darkBg;
        ctx.fillRect(0, 0, w, h);

        // Vanishing point (slightly above center for horizon effect)
        const cx = w / 2;
        const cy = h * 0.65;

        for (let star of stars) {
            star.z -= STAR_SPEED * (state.navVelocity * 10);
            if (star.z <= 0) {
                star.z = 1000;
                star.x = Math.random() * w * 2 - w;
                star.y = Math.random() * h * 2 - h;
            }

            const sx = (star.x - cx) / star.z * 1000 + cx;
            const sy = (star.y - cy) / star.z * 1000 + cy;

            // Size based on depth
            const size = (1 - star.z / 1000) * 3;

            // Color shift based on position (Doppler-ish effect)
            let color = '#ffffff';
            if (sx < cx) color = colors.cyan;
            else if (sx > cx) color = colors.pink;
            else color = colors.yellow;

            ctx.fillStyle = color;
            ctx.globalAlpha = (1 - star.z / 1000) * 0.8;
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    // --- Synthwave Grid Logic ---
    let gridOffset = 0;

    function drawGrid() {
        const { ctx, w, h } = gridCanvas;
        ctx.clearRect(0, 0, w, h);

        const horizonY = h * 0.6;
        const bottomY = h;
        
        // Grid properties
        const vanishX = w / 2;
        const vanishY = horizonY;
        
        ctx.strokeStyle = colors.cyan;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.shadowBlur = 4;
        ctx.shadowColor = colors.pink;

        // Horizontal lines (perspective spacing)
        // y = horizon + (i^power * spacing)
        const lineCount = 30;
        const spacing = 15;
        
        for (let i = 0; i < lineCount; i++) {
            // Calculate base Y position
            let y = vanishY + Math.pow(i, 1.8) * spacing * 0.1 + (gridOffset * 0.5);
            
            // Wrap around logic for scrolling
            const maxH = bottomY;
            if (y > maxH) {
                y = vanishY + (y - maxH) % (Math.pow(lineCount, 1.8) * spacing * 0.1);
                if (y < vanishY) y += vanishY; 
            }
            
            if (y < vanishY || y > maxH) continue;

            // Perspective scaling for opacity and width
            const progress = (y - vanishY) / (bottomY - vanishY);
            ctx.globalAlpha = progress * 0.4;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Vertical lines (radiating)
        ctx.shadowColor = colors.cyan;
        ctx.globalAlpha = 0.4;
        const vLines = 20;
        const spread = w * 1.5;

        for (let i = -vLines; i <= vLines; i++) {
            ctx.beginPath();
            ctx.moveTo(vanishX, vanishY);
            ctx.lineTo(vanishX + i * spread, bottomY);
            ctx.stroke();
        }

        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
    }

    // --- Shield Radar Logic ---
    let shieldAngle = 0;
    let shieldPulse = 0;

    function drawShields() {
        const { ctx, w, h } = shieldCanvas;
        const cx = w / 2;
        const cy = h / 2;
        const r = w / 2 - 10;

        ctx.clearRect(0, 0, w, h);

        // Outer ring
        ctx.strokeStyle = colors.cyan;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating arcs
        ctx.shadowBlur = 8;
        ctx.shadowColor = colors.cyan;
        
        // Shield segments
        const sectors = 4;
        const sectorAngle = (Math.PI * 2) / sectors;
        const integrity = state.shieldIntegrity / 100;

        for (let i = 0; i < sectors; i++) {
            const startAngle = i * sectorAngle + shieldAngle;
            const endAngle = startAngle + (sectorAngle * integrity * 0.8);
            
            ctx.strokeStyle = i % 2 === 0 ? colors.pink : colors.cyan;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(cx, cy, r - 8, startAngle, endAngle);
            ctx.stroke();
        }

        // Inner dashed ring
        ctx.shadowBlur = 4;
        ctx.shadowColor = colors.pink;
        ctx.strokeStyle = colors.pink;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, r - 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Crosshairs
        ctx.strokeStyle = colors.cyan;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r + 5);
        ctx.lineTo(cx, cy + r - 5);
        ctx.moveTo(cx - r + 5, cy);
        ctx.lineTo(cx + r - 5, cy);
        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    // --- Targeting Reticle Logic ---
    let targetAngle = 0;
    let lockPulse = 0;

    function drawTargeting() {
        const { ctx, w, h } = targetCanvas;
        const cx = w / 2;
        const cy = h / 2;
        const r = w / 2 - 15;

        ctx.clearRect(0, 0, w, h);

        // Grid background
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
        ctx.lineWidth = 1;
        const gridSize = 20;
        
        for (let x = 0; x <= w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y <= h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Reticle Rings
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.pink;
        ctx.strokeStyle = colors.pink;
        ctx.lineWidth = 2;
        
        // Outer ring (rotating)
        ctx.beginPath();
        ctx.arc(cx, cy, r, targetAngle, targetAngle + Math.PI * 1.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, r, targetAngle + Math.PI, targetAngle + Math.PI + Math.PI * 0.5);
        ctx.stroke();

        // Inner ring
        ctx.strokeStyle = colors.cyan;
        ctx.shadowColor = colors.cyan;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.6, -targetAngle, -targetAngle + Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.strokeStyle = colors.cyan;
        ctx.lineWidth = 1;
        const chLen = 15;
        const gap = 5;
        
        // Top
        ctx.beginPath(); ctx.moveTo(cx, cy - r + 5); ctx.lineTo(cx, cy - gap); ctx.stroke();
        // Bottom
        ctx.beginPath(); ctx.moveTo(cx, cy + gap); ctx.lineTo(cx, cy + r - 5); ctx.stroke();
        // Left
        ctx.beginPath(); ctx.moveTo(cx - r + 5, cy); ctx.lineTo(cx - gap, cy); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(cx + gap, cy); ctx.lineTo(cx + r - 5, cy); ctx.stroke();

        // Lock Brackets
        if (state.targetLocked) {
            const pulseSize = Math.sin(lockPulse) * 5;
            ctx.strokeStyle = colors.orange;
            ctx.shadowColor = colors.orange;
            ctx.lineWidth = 3;
            const bSize = r * 0.4 + pulseSize;
            
            // Draw brackets
            const drawBracket = (x, y, dirX, dirY) => {
                ctx.beginPath();
                ctx.moveTo(x, y + dirY * bSize);
                ctx.lineTo(x, y);
                ctx.lineTo(x + dirX * bSize, y);
                ctx.stroke();
            };

            drawBracket(cx, cy, 1, 1);
            drawBracket(cx, cy, -1, 1);
            drawBracket(cx, cy, 1, -1);
            drawBracket(cx, cy, -1, -1);
            
            // Text
            ctx.fillStyle = colors.orange;
            ctx.font = '10px "Share Tech Mono"';
            ctx.textAlign = 'center';
            ctx.fillText('LOCKED', cx, cy + r + 12);
        } else {
            // Searching text
            ctx.fillStyle = colors.pink;
            ctx.font = '10px "Share Tech Mono"';
            ctx.textAlign = 'center';
            ctx.fillText('SCANNING...', cx, cy + r + 12);
        }

        ctx.shadowBlur = 0;
    }

    // --- Frequency Visualizer Logic ---
    const bars = 32;
    const barHeights = new Array(bars).fill(0);
    const barTargets = new Array(bars).fill(0);

    function drawFrequency() {
        const { ctx, w, h } = freqCanvas;
        ctx.clearRect(0, 0, w, h);

        const barWidth = w / bars;
        const gap = 2;

        // Update targets randomly
        if (Math.random() > 0.85) {
            for (let i = 0; i < bars; i++) {
                barTargets[i] = Math.random() * h * 0.8 + h * 0.1;
            }
        }

        for (let i = 0; i < bars; i++) {
            // Smooth interpolation
            barHeights[i] += (barTargets[i] - barHeights[i]) * 0.2;
            
            const barH = barHeights[i];
            const x = i * barWidth;
            const y = h - barH;

            // Gradient for bars
            const grad = ctx.createLinearGradient(0, h, 0, y);
            grad.addColorStop(0, colors.pink);
            grad.addColorStop(1, colors.cyan);

            ctx.fillStyle = grad;
            ctx.fillRect(x + gap / 2, y, barWidth - gap, barH);

            // Glow cap
            ctx.shadowBlur = 6;
            ctx.shadowColor = colors.cyan;
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + gap / 2, y, barWidth - gap, 2);
        }
        ctx.shadowBlur = 0;
    }

    // --- Compass Logic ---
    let compassAngle = 0;

    function drawCompass() {
        const { ctx, w, h } = compassCanvas;
        const cx = w / 2;
        const cy = h / 2;
        const r = w / 2 - 5;

        ctx.clearRect(0, 0, w, h);

        // Outer ring
        ctx.strokeStyle = colors.cyan;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Degree markers
        ctx.fillStyle = colors.cyan;
        ctx.font = '8px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < 360; i += 15) {
            const rad = (i * Math.PI) / 180;
            const isMajor = i % 90 === 0;
            const len = isMajor ? 10 : 4;
            
            ctx.strokeStyle = isMajor ? colors.cyan : 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(rad) * (r - len), cy + Math.sin(rad) * (r - len));
            ctx.lineTo(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r);
            ctx.stroke();

            if (isMajor) {
                const text = i === 0 ? 'N' : i === 90 ? 'E' : i === 180 ? 'S' : 'W';
                ctx.fillText(text, cx + Math.cos(rad) * (r - 16), cy + Math.sin(rad) * (r - 16));
            }
        }

        // Rotating inner ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(compassAngle);
        
        ctx.strokeStyle = colors.pink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.5, 0, Math.PI * 1.2);
        ctx.stroke();

        // Needle
        ctx.rotate(state.navHeading * Math.PI / 180 - compassAngle);
        ctx.fillStyle = colors.orange;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.7);
        ctx.lineTo(-3, 0);
        ctx.lineTo(3, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Center dot
        ctx.fillStyle = colors.cyan;
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- Data Simulation ---
    function updateData() {
        // Mission Clock
        state.missionTime++;
        const hrs = String(Math.floor(state.missionTime / 3600) % 24).padStart(2, '0');
        const mins = String(Math.floor(state.missionTime / 60) % 60).padStart(2, '0');
        const secs = String(state.missionTime % 60).padStart(2, '0');
        document.getElementById('mission-clock').textContent = `${hrs}:${mins}:${secs}`;

        // Stardate
        state.stardate += 0.001;
        document.getElementById('stardate').textContent = state.stardate.toFixed(1);

        // Nav Coordinates (Jitter)
        const jitter = () => (Math.random() - 0.5) * 0.01;
        document.getElementById('nav-x').textContent = `+1247.${Math.floor(800 + Math.random()*30)}`;
        document.getElementById('nav-y').textContent = `−0042.${Math.floor(100 + Math.random()*20)}`;
        document.getElementById('nav-z').textContent = `+8934.${Math.floor(500 + Math.random()*60)}`;

        // Heading
        state.navHeading += jitter() * 0.5;
        document.getElementById('nav-heading').textContent = `${state.navHeading.toFixed(1)}°`;
        document.getElementById('nav-velocity').textContent = `${state.navVelocity.toFixed(2)}c`;

        // Shields
        if (Math.abs(state.shieldIntegrity - state.shieldTarget) > 0.5) {
            state.shieldIntegrity += (state.shieldTarget - state.shieldIntegrity) * 0.05;
        } else {
            state.shieldTarget = 85 + Math.random() * 10; // Random fluctuation
        }
        document.getElementById('shield-percent').textContent = `${Math.floor(state.shieldIntegrity)}%`;

        // Target Logic
        if (state.engaged && !state.targetLocked) {
            state.targetLockProgress += 0.02;
            if (state.targetLockProgress >= 1) {
                state.targetLocked = true;
                document.getElementById('target-status').textContent = 'TARGET LOCKED';
                document.getElementById('target-status').style.color = colors.orange;
                document.getElementById('target-coords').textContent = `RA: 14:32:10 | DEC: -45°`;
            }
        }
    }

    // --- Interaction Handlers ---
    const engageBtn = document.getElementById('engage-weapons');
    if (engageBtn) {
        engageBtn.addEventListener('click', () => {
            state.engaged = !state.engaged;
            state.targetLocked = false;
            state.targetLockProgress = 0;
            
            if (state.engaged) {
                engageBtn.textContent = '[ DISENGAGE ]';
                engageBtn.style.borderColor = colors.cyan;
                engageBtn.style.color = colors.cyan;
                document.getElementById('target-status').textContent = 'ACQUIRING...';
                document.getElementById('target-status').style.color = colors.pink;
                document.getElementById('target-coords').textContent = 'RA: --:--:-- | DEC: --°';
            } else {
                engageBtn.textContent = '[ ENGAGE ]';
                engageBtn.style.borderColor = colors.pink;
                engageBtn.style.color = colors.pink;
                document.getElementById('target-status').textContent = 'NO TARGET';
                document.getElementById('target-status').style.color = colors.pink;
            }
        });
    }

    const scanBtn = document.getElementById('comms-scan');
    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            state.scanActive = true;
            state.scanProgress = 0;
            scanBtn.textContent = 'SCANNING...';
            setTimeout(() => {
                state.scanActive = false;
                scanBtn.textContent = '◈ SCAN FREQ';
            }, 3000);
        });
    }

    const transmitBtn = document.getElementById('comms-transmit');
    if (transmitBtn) {
        transmitBtn.addEventListener('click', () => {
            const log = document.getElementById('comms-log');
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[PROMETHEUS] TRANSMISSION SENT — ${new Date().toLocaleTimeString()}`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        });
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorRing = document.querySelector('.custom-cursor-ring');
    
    if (cursor && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.addEventListener('mousedown', () => {
            cursorRing.style.width = '18px';
            cursorRing.style.height = '18px';
        });

        document.addEventListener('mouseup', () => {
            cursorRing.style.width = '24px';
            cursorRing.style.height = '24px';
        });
    }

    // --- Main Animation Loop ---
    function animate(timestamp) {
        const dt = timestamp - state.lastFrame;
        state.lastFrame = timestamp;

        // Grid Scroll
        gridOffset += state.navVelocity * 2;

        // Rotations
        shieldAngle += 0.01;
        shieldPulse += 0.05;
        targetAngle += state.targetLocked ? 0.005 : 0.02;
        lockPulse += 0.1;
        compassAngle += 0.002;

        // Draw Canvases
        drawStarfield();
        drawGrid();
        drawShields();
        drawTargeting();
        drawFrequency();
        drawCompass();

        // Update DOM Data
        updateData();

        requestAnimationFrame(animate);
    }

    // Start
    requestAnimationFrame(animate);

    // Handle Resize
    window.addEventListener('resize', () => {
        // In a production app, we would re-init canvases here.
        // For this demo, we rely on CSS scaling, but re-init ensures crispness.
        // To keep code clean and within limits, we skip complex re-init logic 
        // and rely on the DPR scaling set at init.
    });
});