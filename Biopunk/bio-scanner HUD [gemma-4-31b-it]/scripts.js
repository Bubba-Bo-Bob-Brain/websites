/**
 * CHIMERA-OS // Neural-Link Interface Logic
 * Core Systems: Heartbeat Sync, Nanomachine Swarm, EKG Generator, Bio-Data Flux
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initEKG();
    initNanoSwarm();
    initNeuralLinks();
    initBioDataFlux();
});

// --- System Clock ---
function initClock() {
    const timeDisplay = document.getElementById('current-time');
    setInterval(() => {
        const now = new Date();
        timeDisplay.textContent = now.toTimeString().split(' ')[0];
    }, 1000);
}

// --- Real-time EKG Waveform ---
function initEKG() {
    const path = document.getElementById('ekg-path');
    const bpmDisplay = document.getElementById('bpm-value');
    let x = 0;
    let points = [];
    const width = 1000;
    
    // Generate a "heartbeat" pattern
    function createHeartbeat() {
        points = [];
        for (let i = 0; i < width; i += 5) {
            let y = 50;
            // Simulate the P-QRS-T wave
            if (i > 100 && i < 110) y = 45; // P wave
            if (i >= 110 && i < 120) y = 55; // Q
            if (i >= 120 && i < 130) y = 10; // R (Peak)
            if (i >= 130 && i < 140) y = 90; // S (Trough)
            if (i >= 140 && i < 150) y = 50; // Return
            if (i > 200 && i < 210) y = 48; // Small noise
            
            points.push(`${i},${y}`);
        }
    }

    createHeartbeat();

    let offset = 0;
    function animateEKG() {
        offset += 4;
        if (offset >= width) offset = 0;

        // Shift the path to create the scrolling effect
        const shiftedPoints = points.map(p => {
            let [px, py] = p.split(',').map(Number);
            return `${px - offset},${py}`;
        });

        // Wrap the points to keep the line continuous
        const wrappedPoints = shiftedPoints.map(p => {
            let [px, py] = p.split(',').map(Number);
            if (px < 0) px += width;
            return `${px},${py}`;
        }).sort((a, b) => parseFloat(a) - parseFloat(b));

        path.setAttribute('d', `M${wrappedPoints.join(' L')}`);
        
        // Randomly fluctuate BPM
        if (Math.random() > 0.98) {
            const bpm = Math.floor(Math.random() * (85 - 68) + 68);
            bpmDisplay.textContent = bpm;
        }

        requestAnimationFrame(animateEKG);
    }
    animateEKG();
}

// --- Nanomachine Swarm Visualizer ---
function initNanoSwarm() {
    const canvas = document.getElementById('nano-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = Math.random() * 1.5;
            this.alpha = Math.random();
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Occasional swarm clustering
            if (Math.random() > 0.99) {
                this.vx += (Math.random() - 0.5) * 5;
                this.vy += (Math.random() - 0.5) * 5;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(0, 255, 170, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 150; i++) particles.push(new Particle());

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// --- Neural Tendril Connections ---
function initNeuralLinks() {
    const svgLinks = document.getElementById('neural-links');
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(spot => {
        const cx = spot.getAttribute('cx');
        const cy = spot.getAttribute('cy');
        
        // Create a "vein" line that connects the hotspot to the edge of the screen
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const targetX = Math.random() > 0.5 ? 0 : 400;
        const targetY = cy;
        
        // Create a curved biological path
        const controlX = (parseFloat(cx) + targetX) / 2;
        const controlY = cy + (Math.random() - 0.5) * 100;
        
        line.setAttribute('d', `M${cx},${cy} C${controlX},${controlY} ${controlX},${controlY} ${targetX},${targetY}`);
        line.setAttribute('stroke', 'rgba(0, 255, 170, 0.15)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('fill', 'none');
        line.classList.add('neural-vein');
        
        svgLinks.appendChild(line);
    });
}

// --- Bio-Data Flux (Randomized Values) ---
function initBioDataFlux() {
    const compVal = document.getElementById('compatibility-val');
    const nanoDensity = document.getElementById('nano-density');
    const toxinFill = document.querySelector('.gauge-fill');

    setInterval(() => {
        // Compatibility flux
        const comp = (67 + Math.random() * 2).toFixed(1);
        compVal.textContent = `${comp}%`;

        // Nano density flux
        const dens = (1.1 + Math.random() * 0.2).toFixed(2);
        nanoDensity.textContent = `${dens}M/ml`;

        // Toxin gauge flux
        const toxin = 40 + Math.random() * 10;
        const offset = 283 - (283 * (toxin / 100));
        toxinFill.style.strokeDashoffset = offset;

    }, 2000);
}

// --- Interactive Organ Deep-Scan ---
document.querySelectorAll('.organ-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const organ = item.getAttribute('data-organ');
        const node = document.querySelector(`.${organ}-node`);
        if (node) {
            node.style.fill = 'var(--accent-yellow)';
            node.setAttribute('r', '15');
        }
    });

    item.addEventListener('mouseleave', () => {
        const organ = item.getAttribute('data-organ');
        const node = document.querySelector(`.${organ}-node`);
        if (node) {
            node.style.fill = '';
            node.setAttribute('r', '8');
        }
    });
});