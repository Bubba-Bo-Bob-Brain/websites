/* =========================================
   KĀPEKA - WAYFINDING CHART ENGINE
   ========================================= */

const canvas = document.getElementById('wayfinding-canvas');
const ctx = canvas.getContext('2d');
const cursorTrail = document.getElementById('cursor-trail');
const loadingScreen = document.getElementById('loading-screen');

// UI Elements
const uiElements = {
    declination: document.getElementById('declination-val'),
    house: document.getElementById('house-val'),
    swell: document.getElementById('swell-val'),
    buttons: document.querySelectorAll('.control-btn'),
    reset: document.getElementById('reset-view')
};

// State
let width, height, cx, cy;
let frame = 0;
let mouseX = 0;
let mouseY = 0;
let targetRotation = 0;
let currentRotation = 0;
const layers = {
    stars: true,
    waves: true,
    currents: true
};

// Configuration
const STAR_COUNT = 400;
const WAVE_COUNT = 8;
const PARTICLE_COUNT = 50; // Bioluminescent trail

// Data Arrays
const stars = [];
const constellations = [];
const waves = [];
const particles = [];
const islands = [];

// =========================================
// SETUP & INITIALIZATION
// =========================================

function init() {
    resize();
    createStars();
    createConstellations();
    createWaves();
    createIslands();
    
    // Remove loading screen after a brief delay
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);

    animate();
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    cx = width / 2;
    cy = height / 2;
}

window.addEventListener('resize', resize);

// =========================================
// CLASSES
// =========================================

class Star {
    constructor(isNavStar = false) {
        this.reset();
        this.isNavStar = isNavStar;
        this.size = isNavStar ? Math.random() * 2 + 2 : Math.random() * 1.5;
        this.color = isNavStar ? '#d4af37' : '#ffffff';
        this.glow = isNavStar ? 15 : 0;
        
        // Position in polar coordinates for easier rotation
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * (Math.max(width, height) * 0.8); // Distance from center
        this.yOffset = (Math.random() - 0.5) * height * 1.5; // Spread vertically
    }

    reset() {
        this.alpha = Math.random();
        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
    }

    update(rotation) {
        this.alpha += Math.sin(frame * this.twinkleSpeed) * 0.01;
        this.alpha = Math.max(0.2, Math.min(1, this.alpha));
    }

    draw(ctx, rotation) {
        // Apply rotation around the celestial pole (center of screen)
        const effectiveAngle = this.angle + rotation;
        
        // Convert polar to cartesian
        const x = cx + Math.cos(effectiveAngle) * this.radius;
        const y = cy + Math.sin(effectiveAngle) * 0.4 + this.yOffset; // Flattened perspective

        // Check bounds
        if (x < 0 || x > width || y < 0 || y > height) return;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        
        if (this.glow > 0) {
            ctx.shadowBlur = this.glow;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

class Wave {
    constructor(index) {
        this.index = index;
        this.y = (height / WAVE_COUNT) * index;
        this.amplitude = Math.random() * 20 + 10;
        this.frequency = Math.random() * 0.01 + 0.005;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.02 + 0.01;
        this.color = `rgba(0, 242, 255, ${0.05 + (index / WAVE_COUNT) * 0.1})`;
    }

    update() {
        this.phase += this.speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        for (let x = 0; x <= width; x += 10) {
            // Add wave influence based on mouse proximity (interactive swell)
            const distToMouse = Math.abs(x - mouseX);
            const mouseEffect = Math.max(0, (300 - distToMouse) / 300) * 20 * Math.sin(frame * 0.1);
            
            const y = this.y + Math.sin(x * this.frequency + this.phase) * this.amplitude + mouseEffect;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.95;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(0, 242, 255, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Island {
    constructor(name, angle) {
        this.name = name;
        this.angle = angle; // Angle on the compass (radians)
        this.distance = height * 0.4;
        this.discovered = false;
        this.alpha = 0;
    }

    draw(ctx, rotation) {
        // Calculate position based on rotation
        const effectiveAngle = this.angle + rotation;
        const x = cx + Math.cos(effectiveAngle) * this.distance;
        const y = cy + Math.sin(effectiveAngle) * 0.4;

        // Check if island is roughly in front (visible on screen)
        if (x < -50 || x > width + 50 || y < -50 || y > height + 50) {
            this.alpha = Math.max(0, this.alpha - 0.05);
            return;
        }

        // Fade in if visible
        if (this.alpha < 1) this.alpha += 0.02;

        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = this.alpha;
        
        // Draw Island Shape (Stylized Diamond)
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(-10, 0);
        ctx.closePath();
        ctx.fill();

        // Draw Label
        ctx.fillStyle = '#f3e5ab';
        ctx.font = '12px Cinzel Decorative';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, 0, 25);

        ctx.restore();
    }
}

// =========================================
// GENERATION
// =========================================

function createStars() {
    // Background stars
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star(false));
    }
    // Navigation stars (Hokupa'a, etc.)
    for (let i = 0; i < 15; i++) {
        const s = new Star(true);
        // Make nav stars brighter
        s.color = '#ffecb3';
        stars.push(s);
    }
}

function createConstellations() {
    // Simple hardcoded constellation data relative to center
    // Example: Southern Cross (Crux)
    const crossPoints = [
        { x: 100, y: -200 },
        { x: 120, y: -180 },
        { x: 130, y: -150 },
        { x: 110, y: -160 }
    ];
    
    // Convert to Star-like objects for easier rotation
    const constellationStars = crossPoints.map(p => {
        const s = new Star(true);
        s.radius = Math.sqrt(p.x*p.x + p.y*p.y);
        s.angle = Math.atan2(p.y, p.x);
        s.color = '#ffffff';
        return s;
    });
    
    constellations.push({
        stars: constellationStars,
        connections: [[0,1], [1,2], [1,3]]
    });
}

function createWaves() {
    for (let i = 0; i < WAVE_COUNT; i++) {
        waves.push(new Wave(i));
    }
}

function createIslands() {
    islands.push(new Island("Hawai'i", -Math.PI / 4));
    islands.push(new Island("Tahiti", Math.PI / 4));
    islands.push(new Island("Aotearoa", Math.PI / 2));
}

// =========================================
// INTERACTION
// =========================================

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Custom cursor logic
    cursorTrail.style.left = mouseX + 'px';
    cursorTrail.style.top = mouseY + 'px';

    // Bioluminescent Wake Effect
    if (layers.currents) {
        particles.push(new Particle(mouseX, mouseY));
    }

    // Calculate Rotation Target based on mouse X position relative to center
    // Moving mouse left rotates sky right, etc.
    const rotationSensitivity = 0.002;
    targetRotation = (mouseX - cx) * rotationSensitivity;
});

// Toggle Buttons
uiElements.buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.id === 'reset-view') {
            targetRotation = 0;
            return;
        }

        const layer = btn.dataset.layer;
        if (layers.hasOwnProperty(layer)) {
            layers[layer] = !layers[layer];
            btn.classList.toggle('active');
        }
    });
});

// =========================================
// ANIMATION LOOP
// =========================================

function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Smooth rotation interpolation
    currentRotation += (targetRotation - currentRotation) * 0.05;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Stars (Rotating Dome)
    if (layers.stars) {
        // Background stars
        stars.forEach(star => {
            star.update();
            star.draw(ctx, currentRotation);
        });

        // Constellations
        constellations.forEach(constellation => {
            // Draw lines first
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            constellation.connections.forEach(pair => {
                const s1 = constellation.stars[pair[0]];
                const s2 = constellation.stars[pair[1]];
                
                const x1 = cx + Math.cos(s1.angle + currentRotation) * s1.radius;
                const y1 = cy + Math.sin(s1.angle + currentRotation) * 0.4 + s1.yOffset;
                const x2 = cx + Math.cos(s2.angle + currentRotation) * s2.radius;
                const y2 = cy + Math.sin(s2.angle + currentRotation) * 0.4 + s2.yOffset;

                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            });
            ctx.stroke();

            // Draw constellation stars on top
            constellation.stars.forEach(s => {
                s.draw(ctx, currentRotation);
            });
        });
    }

    // 2. Draw Waves (Ocean Swells)
    if (layers.waves) {
        waves.forEach(wave => {
            wave.update();
            wave.draw(ctx);
        });
    }

    // 3. Draw Islands
    islands.forEach(island => {
        island.draw(ctx, currentRotation);
    });

    // 4. Draw Bioluminescent Wake (Particles)
    if (layers.currents) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    // 5. Update UI Data
    updateUI();
}

function updateUI() {
    // Update Declination (mapped from rotation)
    const deg = Math.round((-currentRotation * 180 / Math.PI) % 360);
    uiElements.declination.innerText = `${deg < 0 ? deg + 360 : deg}°`;

    // Determine House (Direction)
    const angle = Math.atan2(mouseY - cy, mouseX - cx);
    let house = "";
    // Normalize angle to 0 - 2PI
    let normAngle = angle;
    if (normAngle < 0) normAngle += Math.PI * 2;

    // Simple Quadrant mapping
    if (normAngle >= Math.PI * 1.75 || normAngle < Math.PI * 0.25) house = "Hoʻolua (NW)";
    else if (normAngle >= Math.PI * 0.25 && normAngle < Math.PI * 0.75) house = "Koʻolau (NE)";
    else if (normAngle >= Math.PI * 0.75 && normAngle < Math.PI * 1.25) house = "Hikina (E)";
    else if (normAngle >= Math.PI * 1.25 && normAngle < Math.PI * 1.75) house = "Malani (SE)";

    uiElements.house.innerText = house;

    // Update Swell data (random fluctuation for effect)
    if (frame % 60 === 0) {
        const swellHeight = (Math.sin(frame * 0.01) * 2 + 6).toFixed(1);
        uiElements.swell.innerText = `${swellHeight} ft`;
    }
}

// Start
init();