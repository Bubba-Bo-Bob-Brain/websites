// ===== LOADING RITUAL =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loading-ritual').classList.add('hidden');
    }, 2500);
});

// ===== STARFIELD CANVAS =====
const starCanvas = document.getElementById('starfield-canvas');
const starCtx = starCanvas.getContext('2d');

function resizeStarCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeStarCanvas();
window.addEventListener('resize', resizeStarCanvas);

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * starCanvas.width;
        this.y = Math.random() * starCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.baseOpacity = Math.random() * 0.7 + 0.3;
        this.opacity = this.baseOpacity;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.hue = Math.random() > 0.7 ? 40 : Math.random() > 0.5 ? 220 : 0;
    }

    update(time) {
        this.opacity = this.baseOpacity + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.3;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        ctx.fillStyle = this.hue === 40
            ? `hsl(${this.hue}, 60%, 85%)`
            : this.hue === 220
                ? `hsl(${this.hue}, 40%, 80%)`
                : `hsl(0, 0%, 92%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.size > 1.5) {
            ctx.globalAlpha = this.opacity * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

const stars = Array.from({ length: 300 }, () => new Star());
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const glow = document.getElementById('cursor-glow');
    if (glow) {
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';
    }
});

function drawStarfield(time) {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // Background gradient
    const bgGrad = starCtx.createRadialGradient(
        starCanvas.width / 2, starCanvas.height / 2, 0,
        starCanvas.width / 2, starCanvas.height / 2, starCanvas.width * 0.7
    );
    bgGrad.addColorStop(0, 'rgba(15, 25, 50, 0.3)');
    bgGrad.addColorStop(1, 'rgba(5, 10, 20, 0.1)');
    starCtx.fillStyle = bgGrad;
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);

    // Parallax offset based on cursor
    const parallaxX = (mouseX - starCanvas.width / 2) * 0.02;
    const parallaxY = (mouseY - starCanvas.height / 2) * 0.02;

    stars.forEach(star => {
        star.update(time);
        const drawX = star.x + parallaxX;
        const drawY = star.y + parallaxY;

        if (drawX < -10 || drawX > starCanvas.width + 10 ||
            drawY < -10 || drawY > starCanvas.height + 10) {
            star.reset();
            star.x = drawX;
            star.y = drawY;
        }

        star.draw(starCtx);
    });

    // Cursor-connected constellation lines
    const connectionStars = stars.filter(s => s.size > 1.8);
    for (let i = 0; i < connectionStars.length; i++) {
        for (let j = i + 1; j < connectionStars.length; j++) {
            const dx = connectionStars[i].x - connectionStars[j].x;
            const dy = connectionStars[i].y - connectionStars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                starCtx.save();
                starCtx.globalAlpha = 0.08 * (1 - dist / 150);
                starCtx.strokeStyle = 'rgba(200, 180, 120, 0.3)';
                starCtx.lineWidth = 0.5;
                starCtx.beginPath();
                starCtx.moveTo(connectionStars[i].x + parallaxX, connectionStars[i].y + parallaxY);
                starCtx.lineTo(connectionStars[j].x + parallaxX, connectionStars[j].y + parallaxY);
                starCtx.stroke();
                starCtx.restore();
            }
        }
    }

    requestAnimationFrame(drawStarfield);
}
requestAnimationFrame(drawStarfield);

// ===== WAVE CANVAS =====
const waveCanvas = document.getElementById('wave-canvas');
const waveCtx = waveCanvas.getContext('2d');

function resizeWaveCanvas() {
    waveCanvas.width = window.innerWidth;
    waveCanvas.height = waveCanvas.parentElement.offsetHeight || 200;
}
resizeWaveCanvas();
window.addEventListener('resize', resizeWaveCanvas);

function drawWaves(time) {
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

    const layers = [
        { amplitude: 20, frequency: 0.008, speed: 0.0008, color: 'rgba(60, 140, 200, 0.15)', yOffset: 0.3 },
        { amplitude: 15, frequency: 0.012, speed: 0.001, color: 'rgba(80, 160, 220, 0.12)', yOffset: 0.5 },
        { amplitude: 10, frequency: 0.015, speed: 0.0006, color: 'rgba(100, 180, 200, 0.08)', yOffset: 0.7 },
    ];

    layers.forEach(layer => {
        waveCtx.beginPath();
        waveCtx.moveTo(0, waveCanvas.height);

        for (let x = 0; x <= waveCanvas.width; x += 2) {
            const y = waveCanvas.height * layer.yOffset +
                Math.sin(x * layer.frequency + time * layer.speed) * layer.amplitude +
                Math.sin(x * layer.frequency * 1.5 + time * layer.speed * 0.7) * (layer.amplitude * 0.5);
            waveCtx.lineTo(x, y);
        }

        waveCtx.lineTo(waveCanvas.width, waveCanvas.height);
        waveCtx.closePath();
        waveCtx.fillStyle = layer.color;
        waveCtx.fill();
    });

    requestAnimationFrame(drawWaves);
}
requestAnimationFrame(drawWaves);

// ===== BIOLUMINESCENT TRAIL CANVAS =====
const trailsCanvas = document.getElementById('trails-canvas');
const trailsCtx = trailsCanvas.getContext('2d');

function resizeTrailsCanvas() {
    trailsCanvas.width = window.innerWidth;
    trailsCanvas.height = window.innerHeight;
}
resizeTrailsCanvas();
window.addEventListener('resize', resizeTrailsCanvas);

class TrailPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.life -= 0.008;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life * 0.6;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        grad.addColorStop(0, 'rgba(0, 229, 160, 0.8)');
        grad.addColorStop(0.5, 'rgba(0, 197, 128, 0.3)');
        grad.addColorStop(1, 'rgba(0, 229, 160, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const trailPoints = [];
let lastTrailX = 0;
let lastTrailY = 0;

document.addEventListener('mousemove', (e) => {
    if (Math.abs(e.clientX - lastTrailX) > 5 || Math.abs(e.clientY - lastTrailY) > 5) {
        for (let i = 0; i < 3; i++) {
            trailPoints.push(new TrailPoint(
                e.clientX + (Math.random() - 0.5) * 20,
                e.clientY + (Math.random() - 0.5) * 20
            ));
        }
        lastTrailX = e.clientX;
        lastTrailY = e.clientY;
    }
});

function drawTrails() {
    trailsCtx.clearRect(0, 0, trailsCanvas.width, trailsCanvas.height);

    for (let i = trailPoints.length - 1; i >= 0; i--) {
        trailPoints[i].update();
        trailPoints[i].draw(trailsCtx);
        if (trailPoints[i].life <= 0) {
            trailPoints.splice(i, 1);
        }
    }

    requestAnimationFrame(drawTrails);
}
requestAnimationFrame(drawTrails);

// ===== CONSTELLATION CANVAS =====
const constCanvas = document.getElementById('constellation-canvas');
const constCtx = constCanvas.getContext('2d');

function resizeConstCanvas() {
    constCanvas.width = window.innerWidth;
    constCanvas.height = window.innerHeight;
}
resizeConstCanvas();
window.addEventListener('resize', resizeConstCanvas);

// Define constellation star positions (relative to canvas)
const constellations = {
    orion: {
        stars: [
            { x: 0.15, y: 0.3, name: 'Betelgeuse' },
            { x: 0.35, y: 0.45, name: 'Alnilam' },
            { x: 0.55, y: 0.3, name: 'Mintaka' },
            { x: 0.2, y: 0.7, name: 'Rigel' },
            { x: 0.5, y: 0.6, name: 'Saiph' },
        ],
        connections: [
            [0, 1], [1, 2], [0, 3], [2, 4], [3, 4], [1, 4]
        ],
        activated: false
    },
    scorpius: {
        stars: [
            { x: 0.5, y: 0.15, name: 'Antares' },
            { x: 0.45, y: 0.3, name: 'Shaula' },
            { x: 0.4, y: 0.45, name: 'Sargas' },
        ],
        connections: [
            [0, 1], [1, 2]
        ],
        activated: false
    }
};

function drawConstellation(time) {
    constCtx.clearRect(0, 0, constCanvas.width, constCanvas.height);

    Object.keys(constellations).forEach(key => {
        const c = constellations[key];
        const centerX = constCanvas.width * 0.3;
        const centerY = constCanvas.height * 0.4;
        const scale = Math.min(constCanvas.width, constCanvas.height) * 0.25;

        const screenStars = c.stars.map(s => ({
            x: centerX + s.x * scale,
            y: centerY + s.y * scale,
            name: s.name
        }));

        // Draw connections
        c.connections.forEach(([a, b]) => {
            constCtx.save();
            constCtx.globalAlpha = c.activated ? 0.4 : 0.15;
            constCtx.strokeStyle = c.activated
                ? 'rgba(212, 168, 67, 0.5)'
                : 'rgba(200, 180, 120, 0.2)';
            constCtx.lineWidth = c.activated ? 1.5 : 0.8;
            constCtx.setLineDash(c.activated ? [] : [4, 6]);
            constCtx.beginPath();
            constCtx.moveTo(screenStars[a].x, screenStars[a].y);
            constCtx.lineTo(screenStars[b].x, screenStars[b].y);
            constCtx.stroke();
            constCtx.restore();
        });

        // Draw stars
        screenStars.forEach((star, i) => {
            const twinkle = Math.sin(time * 0.002 + i) * 0.3 + 0.7;
            constCtx.save();
            constCtx.globalAlpha = twinkle;
            constCtx.fillStyle = '#f5e6c8';
            constCtx.beginPath();
            constCtx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            constCtx.fill();
            constCtx.globalAlpha = twinkle * 0.2;
            constCtx.beginPath();
            constCtx.arc(star.x, star.y, 6, 0, Math.PI * 2);
            constCtx.fill();
            constCtx.restore();
        });
    });

    requestAnimationFrame(drawConstellation);
}
requestAnimationFrame(drawConstellation);

// ===== CONSTELLATION SECTION INTERACTION =====
document.querySelectorAll('.constellation-interactive').forEach(section => {
    section.addEventListener('mouseenter', () => {
        const id = section.id.replace('constellation-', '');
        if (constellations[id]) {
            constellations[id].activated = true;
        }
    });

    section.addEventListener('mouseleave', () => {
        const id = section.id.replace('constellation-', '');
        if (constellations[id]) {
            constellations[id].activated = false;
        }
    });
});

// ===== STAR POINT INTERACTIONS =====
document.querySelectorAll('.star-point').forEach(point => {
    point.addEventListener('mouseenter', function () {
        const name = this.getAttribute('data-name');
        const altitude = this.getAttribute('data-altitude');
        const declination = this.getAttribute('data-declination');

        // Create tooltip
        let tooltip = document.querySelector('.star-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'star-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <strong>${name}</strong><br>
            Altitude: ${altitude}<br>
            Declination: ${declination}
        `;
        tooltip.style.opacity = '1';

        this.addEventListener('mousemove', function (e) {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 10) + 'px';
        });

        this.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
});

// Add tooltip styles dynamically
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .star-tooltip {
        position: fixed;
        background: rgba(10, 14, 26, 0.95);
        border: 1px solid rgba(212, 168, 67, 0.4);
        border-radius: 6px;
        padding: 10px 14px;
        color: var(--text-primary);
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.85rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        max-width: 200px;
    }
`;
document.head.appendChild(tooltipStyle);

// ===== TAPA SYMBOL INTERACTION =====
document.querySelectorAll('.tapa-symbol').forEach(symbol => {
    symbol.addEventListener('click', function () {
        const meaning = this.getAttribute('data-meaning');
        this.style.transform = 'scale(1.1) rotate(2deg)';

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            border: 1px solid rgba(196, 164, 74, 0.4);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple-expand 1s ease-out forwards;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(ripple);

        // Floating text
        const floatText = document.createElement('div');
        floatText.textContent = meaning;
        floatText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--gold-accent);
            font-family: 'MedievalSharp', cursive;
            font-size: 1.2rem;
            opacity: 0;
            animation: float-up 1.5s ease-out forwards;
            pointer-events: none;
            z-index: 999;
            text-shadow: 0 0 20px rgba(212, 168, 67, 0.3);
        `;
        document.body.appendChild(floatText);

        setTimeout(() => {
            ripple.remove();
            floatText.remove();
        }, 1500);

        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
        }, 200);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-expand {
        0% { width: 10px; height: 10px; opacity: 1; }
        100% { width: 300px; height: 300px; opacity: 0; }
    }
    @keyframes float-up {
        0% { opacity: 0; transform: translate(-50%, -50%) translateY(0); }
        30% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%, -50%) translateY(-40px); }
    }
`;
document.head.appendChild(rippleStyle);

// ===== WOODEN MARKER INTERACTION =====
document.querySelectorAll('.wooden-marker').forEach(marker => {
    marker.addEventListener('click', function () {
        const markerType = this.getAttribute('data-marker');

        // Create carved detail popup
        const detail = document.createElement('div');
        detail.className = 'marker-detail';
        const details = {
            bearings: 'Navigators memorized bearing angles to prominent stars, using the rising and setting positions to maintain course.',
            speed: 'Paddlers and sailors estimated speed by counting paddle strokes or observing the water passing the hull.',
            depth: 'Depth was guessed by the color of the water — deep blue for deep water, green near reefs and shallows.',
            birds: 'Birds were powerful signs of land. Frigate birds flew out to feed and returned at dusk. Their absence meant open ocean.',
            stars: 'Star altitude above the horizon was measured using hand spans. A full hand span equals about 10 degrees.'
        };
        detail.innerHTML = details[markerType] || '';
        detail.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            max-width: 500px;
            background: rgba(10, 14, 26, 0.95);
            border: 1px solid rgba(107, 68, 35, 0.5);
            border-radius: 8px;
            padding: 20px;
            color: var(--text-primary);
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.95rem;
            line-height: 1.6;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        `;
        document.body.appendChild(detail);

        requestAnimationFrame(() => {
            detail.style.opacity = '1';
        });

        setTimeout(() => {
            detail.style.opacity = '0';
            setTimeout(() => detail.remove(), 500);
        }, 4000);
    });
});

// Add marker detail styles
const markerDetailStyle = document.createElement('style');
markerDetailStyle.textContent = `
    .marker-detail {
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(markerDetailStyle);

// ===== ISLAND HOVER EFFECT =====
document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('mouseenter', function () {
        const name = this.getAttribute('data-name');
        const type = this.getAttribute('data-type');

        // Create island info tooltip
        let islandInfo = document.querySelector('.island-info');
        if (!islandInfo) {
            islandInfo = document.createElement('div');
            islandInfo.className = 'island-info';
            document.body.appendChild(islandInfo);
        }

        const typeDescriptions = {
            archipelago: 'Chain of volcanic islands',
            high: 'High volcanic island with deep harbors',
            volcanic: 'Single volcanic peak rising from the sea',
            continental: 'Large island with diverse geography',
            atoll: 'Ring-shaped coral reef with lagoon'
        };

        islandInfo.innerHTML = `
            <strong style="color: var(--gold-bright); font-family: 'MedievalSharp', cursive;">
                ${name}
            </strong><br>
            <span style="color: var(--text-secondary); font-size: 0.85rem;">
                ${typeDescriptions[type] || type}
            </span>
        `;
        islandInfo.style.opacity = '1';

        this.addEventListener('mousemove', function (e) {
            islandInfo.style.left = (e.clientX + 15) + 'px';
            islandInfo.style.top = (e.clientY - 10) + 'px';
        });

        this.addEventListener('mouseleave', () => {
            islandInfo.style.opacity = '0';
        });
    });
});

// Add island info styles
const islandInfoStyle = document.createElement('style');
islandInfoStyle.textContent = `
    .island-info {
        position: fixed;
        background: rgba(10, 14, 26, 0.95);
        border: 1px solid rgba(212, 168, 67, 0.3);
        border-radius: 6px;
        padding: 10px 14px;
        color: var(--text-primary);
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.85rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        max-width: 200px;
    }
`;
document.head.appendChild(islandInfoStyle);

// ===== SMOOTH SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.path-group, .ocean-currents, .wave-patterns, .island-chains, .navigation-markers, .tapa-texture-panel').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ===== COMPASS RING INTERACTION =====
const compassRing = document.querySelector('.compass-ring');
if (compassRing) {
    compassRing.addEventListener('mouseenter', () => {
        compassRing.style.animationPlayState = 'paused';
    });
    compassRing.addEventListener('mouseleave', () => {
        compassRing.style.animationPlayState = 'running';
    });
}

// ===== CURRENT FLOW ANIMATION ENHANCEMENT =====
document.querySelectorAll('.current-flow').forEach(flow => {
    flow.addEventListener('mouseenter', function () {
        const paths = this.querySelectorAll('.current-path path');
        paths.forEach(path => {
            path.style.animation = 'none';
            path.offsetHeight; // trigger reflow
            path.style.animation = 'flow-draw 2s ease-in-out forwards';
        });
    });
});

// ===== SAILING WIND PARTICLES =====
const windCanvas = document.createElement('canvas');
windCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none; opacity: 0.3;';
document.body.appendChild(windCanvas);
const windCtx = windCanvas.getContext('2d');

function resizeWindCanvas() {
    windCanvas.width = window.innerWidth;
    windCanvas.height = window.innerHeight;
}
resizeWindCanvas();
window.addEventListener('resize', resizeWindCanvas);

class WindParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = -10;
        this.y = Math.random() * windCanvas.height;
        this.length = Math.random() * 30 + 10;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.angle = Math.random() * 0.3 + 0.1;
    }

    update() {
        this.x += this.speed;
        this.y += Math.sin(this.x * 0.005) * 0.3;

        if (this.x > windCanvas.width + 20) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = 'rgba(200, 220, 240, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.angle) * this.length,
            this.y + Math.sin(this.angle) * this.length
        );
        ctx.stroke();
        ctx.restore();
    }
}

const windParticles = Array.from({ length: 40 }, () => new WindParticle());

function drawWind(time) {
    windCtx.clearRect(0, 0, windCanvas.width, windCanvas.height);

    windParticles.forEach(p => {
        p.update();
        p.draw(windCtx);
    });

    requestAnimationFrame(drawWind);
}
requestAnimationFrame(drawWind);

// ===== LOADING COMPLETION SOUND/FEEL =====
document.querySelector('.loading-ritual')?.addEventListener('animationend', () => {
    document.querySelector('.loading-ritual').classList.add('hidden');
});

// ===== ADDITIONAL TAPA TEXTURE ANIMATION =====
function createTapaOverlay() {
    const tapaTexture = document.createElement('div');
    tapaTexture.className = 'tapa-texture-live';
    tapaTexture.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        pointer-events: none;
        opacity: 0.025;
        background-image:
            repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(139, 105, 20, 0.25) 3px,
                rgba(139, 105, 20, 0.25) 4px
            ),
            repeating-linear-gradient(
                90deg,
                transparent,
                transparent 4px,
                rgba(139, 105, 20, 0.15) 4px,
                rgba(139, 105, 20, 0.15) 5px
            );
    `;
    document.body.appendChild(tapaTexture);
}

createTapaOverlay();

// ===== ENVIRONMENTAL AMBIENT LIGHT =====
function updateAmbientLight() {
    const hour = new Date().getHours();
    let ambientIntensity = 0.03;

    if (hour >= 5 && hour < 8) ambientIntensity = 0.06;
    else if (hour >= 17 && hour < 20) ambientIntensity = 0.05;

    document.documentElement.style.setProperty('--ambient-opacity', ambientIntensity);
}

updateAmbientLight();
setInterval(updateAmbientLight, 60000);

// ===== CONSTELLATION CONNECT-DOTS INTERACTION ON CANVAS =====
constCanvas.addEventListener('click', (e) => {
    const rect = constCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    Object.keys(constellations).forEach(key => {
        const c = constellations[key];
        const centerX = constCanvas.width * 0.3;
        const centerY = constCanvas.height * 0.4;
        const scale = Math.min(constCanvas.width, constCanvas.height) * 0.25;

        c.stars.forEach(star => {
            const sx = centerX + star.x * scale;
            const sy = centerY + star.y * scale;
            const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);

            if (dist < 15) {
                c.activated = true;

                // Flash effect
                constCtx.save();
                constCtx.globalAlpha = 0.6;
                constCtx.fillStyle = 'rgba(212, 168, 67, 0.5)';
                constCtx.beginPath();
                constCtx.arc(sx, sy, 20, 0, Math.PI * 2);
                constCtx.fill();
                constCtx.restore();
            }
        });
    });
});

// ===== VOYAGE PATH FOLLOW EFFECT =====
const voyagePaths = document.querySelectorAll('.voyage-svg path');
voyagePaths.forEach(path => {
    path.addEventListener('mouseenter', function () {
        this.style.filter = 'url(#glow) drop-shadow(0 0 10px rgba(212, 168, 67, 0.5))';
        this.style.strokeWidth = '3';
    });
    path.addEventListener('mouseleave', function () {
        this.style.filter = 'url(#glow)';
        this.style.strokeWidth = '2';
    });
});

console.log('✦ Polynesian Celestial Wayfinding Chart loaded ✦');