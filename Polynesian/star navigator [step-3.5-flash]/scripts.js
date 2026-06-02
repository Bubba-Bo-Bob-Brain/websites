/**
 * POLYNESIAN CELESTIAL WAYFINDING CHART
 * Interactive JavaScript for star navigation, ocean patterns, and bioluminescent trails
 */

document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // CONFIGURATION & STATE
    // =====================================================
    const CONFIG = {
        starCount: 300,
        starDomeRadius: 0, // Will be calculated
        constellationStars: [
            { id: 'southern-cross', name: 'Southern Cross', stars: [
                { x: 0.3, y: 0.35, name: 'Acrux', mag: 1 },
                { x: 0.35, y: 0.4, name: 'Mimosa', mag: 2 },
                { x: 0.4, y: 0.32, name: 'Gacrux', mag: 3 },
                { x: 0.38, y: 0.45, name: 'Delta Crucis', mag: 3 },
                { x: 0.32, y: 0.38, name: 'Epsilon Crucis', mag: 4 }
            ]},
            { id: 'orion', name: 'Orion', stars: [
                { x: 0.25, y: 0.25, name: 'Betelgeuse', mag: 1 },
                { x: 0.3, y: 0.2, name: 'Bellatrix', mag: 2 },
                { x: 0.35, y: 0.35, name: 'Alnilam', mag: 2 },
                { x: 0.4, y: 0.3, name: 'Alnitak', mag: 2 },
                { x: 0.45, y: 0.25, name: 'Rigel', mag: 1 }
            ]},
            { id: 'scorpius', name: 'Scorpius', stars: [
                { x: 0.6, y: 0.3, name: 'Antares', mag: 1 },
                { x: 0.65, y: 0.35, name: 'Graffias', mag: 2 },
                { x: 0.7, y: 0.4, name: 'Sargas', mag: 2 },
                { x: 0.75, y: 0.45, name: 'Pi Scorpii', mag: 3 }
            ]}
        ],
        islandData: {
            'Hawaii': { lat: 19.8968, lng: -155.5828, starPath: 'Kaulua' },
            'Easter Island': { lat: -27.1127, lng: -109.3497, starPath: 'Hiva' },
            'New Zealand': { lat: -40.9006, lng: 174.886, starPath: 'Aotearoa' },
            'Tahiti': { lat: -17.6502, lng: -149.456, starPath: 'Hiti' },
            'Samoa': { lat: -13.759, lng: -172.1046, starPath: 'Savaii' }
        },
        wave: {
            amplitude: 15,
            frequency: 0.02,
            speed: 0.05,
            layers: 5
        }
    };

    const state = {
        starDomeRotating: true,
        constellationsVisible: false,
        wavesVisible: true,
        wakeActive: false,
        mouseX: 0,
        mouseY: 0,
        selectedStar: null,
        connectedStars: new Set(),
        wakeTrail: [],
        lastMouseTime: 0
    };

    // =====================================================
    // DOM ELEMENTS
    // =====================================================
    const elements = {
        starfield: document.getElementById('starfield'),
        starDome: document.getElementById('star-dome'),
        constellationSvg: document.getElementById('constellation-svg'),
        constellationOverlay: document.getElementById('constellation-overlay'),
        waveCanvas: document.getElementById('wave-canvas'),
        wakeCanvas: document.getElementById('wake-canvas'),
        starInfo: document.getElementById('star-info'),
        starTooltip: document.getElementById('star-tooltip'),
        toggleRotation: document.getElementById('toggle-rotation'),
        toggleConstellations: document.getElementById('toggle-constellations'),
        toggleWaves: document.getElementById('toggle-waves'),
        toggleWake: document.getElementById('toggle-wake'),
        islandMarkers: document.querySelectorAll('.island-marker'),
        navMarkers: document.querySelectorAll('.marker-stone')
    };

    // Canvas contexts
    const starfieldCtx = elements.starfield.getContext('2d');
    const waveCtx = elements.waveCanvas.getContext('2d');
    const wakeCtx = elements.wakeCanvas.getContext('2d');

    // =====================================================
    // STAR FIELD BACKGROUND
    // =====================================================
    class StarField {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.stars = [];
            this.resize();
            this.generateStars();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        generateStars() {
            this.stars = [];
            for (let i = 0; i < CONFIG.starCount; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 0.5,
                    brightness: Math.random(),
                    twinkleSpeed: Math.random() * 0.05 + 0.01,
                    twinkleOffset: Math.random() * Math.PI * 2
                });
            }
        }

        draw(time) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw subtle nebula effect
            const gradient = this.ctx.createRadialGradient(
                this.canvas.width * 0.3, this.canvas.height * 0.3, 0,
                this.canvas.width * 0.3, this.canvas.height * 0.3, this.canvas.width * 0.5
            );
            gradient.addColorStop(0, 'rgba(26, 77, 124, 0.03)');
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw stars
            this.stars.forEach(star => {
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
                const alpha = star.brightness * twinkle * 0.8 + 0.2;
                
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
                this.ctx.fill();
                
                // Add subtle glow for brighter stars
                if (star.size > 1.5) {
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                    const glow = this.ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, star.size * 3
                    );
                    glow.addColorStop(0, `rgba(255, 215, 0, ${alpha * 0.3})`);
                    glow.addColorStop(1, 'transparent');
                    this.ctx.fillStyle = glow;
                    this.ctx.fill();
                }
            });
        }
    }

    // =====================================================
    // STAR DOME (3D ROTATION)
    // =====================================================
    class StarDome {
        constructor(container, svg) {
            this.container = container;
            this.svg = svg;
            this.rotation = { x: 0, y: 0 };
            this.targetRotation = { x: 0, y: 0 };
            this.stars = [];
            this.constellations = [];
            this.radius = 0;
            this.init();
        }

        init() {
            this.calculateRadius();
            this.generateStars();
            this.generateConstellations();
            this.setupEventListeners();
            this.animate();
        }

        calculateRadius() {
            const rect = this.container.getBoundingClientRect();
            this.radius = Math.min(rect.width, rect.height) * 0.4;
            CONFIG.starDomeRadius = this.radius;
        }

        generateStars() {
            // Clear existing stars
            const existingStars = this.container.querySelectorAll('.star');
            existingStars.forEach(s => s.remove());

            // Generate new stars in 3D dome
            for (let i = 0; i < 150; i++) {
                // Random position on sphere
                const theta = Math.acos(2 * Math.random() - 1);
                const phi = Math.random() * Math.PI * 2;
                
                const x = this.radius * Math.sin(theta) * Math.cos(phi);
                const y = this.radius * Math.sin(theta) * Math.sin(phi);
                const z = this.radius * Math.cos(theta);
                
                // Convert to 2D screen coordinates (perspective projection)
                const perspective = 800;
                const scale = perspective / (perspective + z);
                const screenX = this.container.offsetWidth / 2 + x * scale;
                const screenY = this.container.offsetHeight / 2 + y * scale;
                
                // Only show stars in front hemisphere
                if (z > -this.radius * 0.3) {
                    const star = document.createElement('div');
                    star.className = `star ${this.getStarMagnitudeClass()}`;
                    star.style.left = `${screenX}px`;
                    star.style.top = `${screenY}px`;
                    star.style.zIndex = Math.floor(scale * 100);
                    star.dataset.x = x;
                    star.dataset.y = y;
                    star.dataset.z = z;
                    star.dataset.originalX = x;
                    star.dataset.originalY = y;
                    star.dataset.originalZ = z;
                    
                    // Add star data
                    const starData = {
                        element: star,
                        x, y, z,
                        screenX, screenY,
                        scale,
                        name: this.generateStarName(),
                        constellation: this.assignConstellation()
                    };
                    
                    this.stars.push(starData);
                    this.container.appendChild(star);
                    
                    // Add click handler
                    star.addEventListener('click', () => this.onStarClick(starData));
                    star.addEventListener('mouseenter', (e) => this.onStarHover(starData, e));
                    star.addEventListener('mouseleave', () => this.hideStarInfo());
                }
            }
        }

        getStarMagnitudeClass() {
            const rand = Math.random();
            if (rand > 0.9) return 'bright';
            if (rand > 0.7) return 'medium';
            return 'dim';
        }

        generateStarName() {
            const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
            const constellations = ['Crucis', 'Orionis', 'Scorpii', 'Centauri', 'Canis Majoris', 'Carinae'];
            return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${constellations[Math.floor(Math.random() * constellations.length)]}`;
        }

        assignConstellation() {
            const constellation = CONFIG.constellationStars[Math.floor(Math.random() * CONFIG.constellationStars.length)];
            return constellation.name;
        }

        generateConstellations() {
            // Clear existing constellation lines
            this.svg.innerHTML = '';
            
            CONFIG.constellationStars.forEach(constellation => {
                let pathData = '';
                constellation.stars.forEach((star, index) => {
                    const x = star.x * 1000;
                    const y = star.y * 1000;
                    if (index === 0) {
                        pathData += `M${x},${y}`;
                    } else {
                        pathData += ` L${x},${y}`;
                    }
                });
                
                // Close the constellation if it's a closed shape
                if (constellation.name === 'Southern Cross') {
                    pathData += ' Z';
                }
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathData);
                path.setAttribute('class', 'constellation-line');
                path.dataset.constellation = constellation.name;
                this.svg.appendChild(path);
            });
        }

        setupEventListeners() {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const mouseX = e.clientX - rect.left - centerX;
                const mouseY = e.clientY - rect.top - centerY;
                
                // Calculate rotation based on mouse position
                this.targetRotation.y = (mouseX / centerX) * 0.5;
                this.targetRotation.x = (mouseY / centerY) * 0.3;
            });

            this.container.addEventListener('mouseleave', () => {
                this.targetRotation = { x: 0, y: 0 };
            });
        }

        animate() {
            // Smooth rotation interpolation
            this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.05;
            this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.05;
            
            // Auto rotation if enabled
            if (state.starDomeRotating) {
                this.rotation.y += 0.002;
            }
            
            // Apply rotation to stars
            this.stars.forEach(star => {
                const { x, y, z } = this.rotatePoint(
                    star.originalX, 
                    star.originalY, 
                    star.originalZ, 
                    this.rotation.x, 
                    this.rotation.y
                );
                
                const perspective = 800;
                const scale = perspective / (perspective + z);
                const screenX = this.container.offsetWidth / 2 + x * scale;
                const screenY = this.container.offsetHeight / 2 + y * scale;
                
                star.element.style.left = `${screenX}px`;
                star.element.style.top = `${screenY}px`;
                star.element.style.zIndex = Math.floor(scale * 100);
                star.element.style.opacity = scale > 0.3 ? 1 : 0;
                
                star.x = x;
                star.y = y;
                star.z = z;
                star.screenX = screenX;
                star.screenY = screenY;
                star.scale = scale;
            });
            
            requestAnimationFrame(() => this.animate());
        }

        rotatePoint(x, y, z, angleX, angleY) {
            // Rotate around Y axis
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);
            const x1 = x * cosY - z * sinY;
            const z1 = z * cosY + x * sinY;
            
            // Rotate around X axis
            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const y1 = y * cosX - z1 * sinX;
            const z2 = z1 * cosX + y * sinX;
            
            return { x: x1, y: y1, z: z2 };
        }

        onStarClick(starData) {
            state.selectedStar = starData;
            this.showStarInfo(starData);
            this.highlightConstellation(starData.constellation);
        }

        onStarHover(starData, event) {
            this.showTooltip(starData, event);
        }

        showStarInfo(starData) {
            elements.starInfo.querySelector('.info-title').textContent = starData.name;
            elements.starInfo.querySelector('.info-description').textContent = 
                `Part of the ${starData.constellation} constellation. Used for ${this.getNavigationHint(starData.constellation)}.`;
            
            const details = elements.starInfo.querySelector('.info-details');
            details.innerHTML = `
                <span class="detail-item">Magnitude: ${starData.mag || '1.2'}</span>
                <span class="detail-item">Declination: ${(Math.asin(starData.z / this.radius) * 180 / Math.PI).toFixed(1)}°</span>
            `;
            
            elements.starInfo.classList.add('active');
            
            setTimeout(() => {
                elements.starInfo.classList.remove('active');
            }, 5000);
        }

        showTooltip(starData, event) {
            elements.starTooltip.querySelector('.tooltip-name').textContent = starData.name;
            elements.starTooltip.querySelector('.tooltip-constellation').textContent = starData.constellation;
            
            elements.starTooltip.style.left = `${event.clientX}px`;
            elements.starTooltip.style.top = `${event.clientY}px`;
            elements.starTooltip.classList.add('active');
            
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(() => {
                elements.starTooltip.classList.remove('active');
            }, 2000);
        }

        hideStarInfo() {
            elements.starTooltip.classList.remove('active');
        }

        highlightConstellation(constellationName) {
            const paths = this.svg.querySelectorAll('.constellation-line');
            paths.forEach(path => {
                if (path.dataset.constellation === constellationName) {
                    path.classList.add('visible');
                } else {
                    path.classList.remove('visible');
                }
            });
            
            // Reset after 5 seconds
            setTimeout(() => {
                paths.forEach(path => path.classList.remove('visible'));
            }, 5000);
        }

        getNavigationHint(constellation) {
            const hints = {
                'Southern Cross': 'finding south',
                'Orion': 'determining east-west direction',
                'Scorpius': 'marking the summer solstice'
            };
            return hints[constellation] || 'orientation';
        }

        toggleRotation() {
            state.starDomeRotating = !state.starDomeRotating;
            return state.starDomeRotating;
        }

        toggleConstellations() {
            state.constellationsVisible = !state.constellationsVisible;
            const paths = this.svg.querySelectorAll('.constellation-line');
            paths.forEach(path => {
                if (state.constellationsVisible) {
                    path.classList.add('visible');
                } else {
                    path.classList.remove('visible');
                }
            });
            return state.constellationsVisible;
        }
    }

    // =====================================================
    // OCEAN WAVE ANIMATION
    // =====================================================
    class OceanWaves {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.time = 0;
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }

        drawWave(ctx, amplitude, frequency, speed, yOffset, color, alpha) {
            ctx.beginPath();
            ctx.moveTo(0, this.canvas.height);
            
            for (let x = 0; x <= this.canvas.width; x += 5) {
                const y = yOffset + 
                         Math.sin(x * frequency + this.time * speed) * amplitude +
                         Math.sin(x * frequency * 2 + this.time * speed * 1.5) * amplitude * 0.3;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(this.canvas.width, this.canvas.height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, this.canvas.height);
            gradient.addColorStop(0, color.replace('1)', `${alpha})`));
            gradient.addColorStop(1, color.replace('1)', '0.1)'));
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        animate() {
            if (!state.wavesVisible) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                requestAnimationFrame(() => this.animate());
                return;
            }
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.time += CONFIG.wave.speed;
            
            // Draw multiple wave layers
            const colors = [
                'rgba(0, 212, 255, 1)',  // Bio glow
                'rgba(26, 77, 124, 1)', // Ocean blue
                'rgba(10, 22, 40, 1)'   // Deep ocean
            ];
            
            for (let i = 0; i < CONFIG.wave.layers; i++) {
                const amplitude = CONFIG.wave.amplitude * (1 - i * 0.2);
                const frequency = CONFIG.wave.frequency * (1 + i * 0.3);
                const speed = CONFIG.wave.speed * (1 - i * 0.1);
                const yOffset = this.canvas.height * 0.5 + i * 30;
                const alpha = 0.6 - i * 0.1;
                
                this.drawWave(
                    this.ctx, 
                    amplitude, 
                    frequency, 
                    speed, 
                    yOffset, 
                    colors[i % colors.length], 
                    alpha
                );
            }
            
            requestAnimationFrame(() => this.animate());
        }

        toggle() {
            state.wavesVisible = !state.wavesVisible;
            return state.wavesVisible;
        }
    }

    // =====================================================
    // BIOLUMINESCENT WAKE TRAIL
    // =====================================================
    class WakeTrail {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.trail = [];
            this.maxTrailLength = 50;
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        addPoint(x, y) {
            this.trail.push({ x, y, age: 0 });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (this.trail.length < 2) return;
            
            for (let i = 1; i < this.trail.length; i++) {
                const point = this.trail[i];
                const prevPoint = this.trail[i - 1];
                point.age += 0.02;
                
                if (point.age > 1) continue;
                
                const alpha = 1 - point.age;
                const lineWidth = (i / this.trail.length) * 3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(prevPoint.x, prevPoint.y);
                this.ctx.lineTo(point.x, point.y);
                this.ctx.strokeStyle = `rgba(0, 255, 204, ${alpha * 0.6})`;
                this.ctx.lineWidth = lineWidth;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
                
                // Add glow
                this.ctx.beginPath();
                this.ctx.moveTo(prevPoint.x, prevPoint.y);
                this.ctx.lineTo(point.x, point.y);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
                this.ctx.lineWidth = lineWidth * 0.5;
                this.ctx.stroke();
            }
            
            // Age and remove old points
            this.trail = this.trail.filter(point => point.age < 1);
        }

        animate() {
            this.draw();
            requestAnimationFrame(() => this.animate());
        }

        toggle() {
            state.wakeActive = !state.wakeActive;
            this.canvas.classList.toggle('active', state.wakeActive);
            return state.wakeActive;
        }
    }

    // =====================================================
    // CONSTELLATION CONNECT-THE-DOTS
    // =====================================================
    class ConstellationConnect {
        constructor(container) {
            this.container = container;
            this.stars = [];
            this.selectedStar = null;
            this.init();
        }

        init() {
            // Create interactive constellation stars
            CONFIG.constellationStars.forEach(constellation => {
                constellation.stars.forEach(star => {
                    const starEl = document.createElement('div');
                    starEl.className = 'connectable-star';
                    starEl.style.left = `${star.x * 100}%`;
                    starEl.style.top = `${star.y * 100}%`;
                    starEl.dataset.constellation = constellation.name;
                    starEl.dataset.starName = star.name;
                    
                    starEl.addEventListener('click', () => this.onStarClick(starEl, constellation.name));
                    
                    this.container.appendChild(starEl);
                    this.stars.push({
                        element: starEl,
                        x: star.x,
                        y: star.y,
                        name: star.name,
                        constellation: constellation.name
                    });
                });
            });
        }

        onStarClick(starEl, constellation) {
            const starName = starEl.dataset.starName;
            
            if (this.selectedStar === starEl) {
                // Deselect
                starEl.classList.remove('selected');
                this.selectedStar = null;
                this.clearConnections();
            } else if (this.selectedStar) {
                // Connect to previously selected star if same constellation
                const prevConstellation = this.selectedStar.dataset.constellation;
                if (prevConstellation === constellation) {
                    this.createConnection(this.selectedStar, starEl);
                    starEl.classList.add('connected');
                    this.selectedStar.classList.add('connected');
                    this.selectedStar = null;
                } else {
                    // Switch selection
                    this.selectedStar.classList.remove('selected');
                    starEl.classList.add('selected');
                    this.selectedStar = starEl;
                }
            } else {
                // Select new star
                starEl.classList.add('selected');
                this.selectedStar = starEl;
            }
        }

        createConnection(star1, star2) {
            const rect1 = star1.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            
            const x1 = (parseFloat(star1.style.left) / 100) * containerRect.width;
            const y1 = (parseFloat(star1.style.top) / 100) * containerRect.height;
            const x2 = (parseFloat(star2.style.left) / 100) * containerRect.width;
            const y2 = (parseFloat(star2.style.top) / 100) * containerRect.height;
            
            const line = document.createElement('div');
            line.className = 'connection-line';
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            
            line.style.width = `${length}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;
            
            this.container.appendChild(line);
            
            // Fade out after a while
            setTimeout(() => {
                line.style.opacity = '0';
                setTimeout(() => line.remove(), 2000);
            }, 3000);
        }

        clearConnections() {
            const lines = this.container.querySelectorAll('.connection-line');
            lines.forEach(line => line.remove());
            
            this.stars.forEach(star => {
                star.element.classList.remove('connected');
            });
        }

        toggle() {
            const stars = this.container.querySelectorAll('.connectable-star');
            stars.forEach(star => {
                star.style.display = star.style.display === 'none' ? 'block' : 'none';
            });
            return stars[0].style.display !== 'none';
        }
    }

    // =====================================================
    // ISLAND MARKERS
    // =====================================================
    function initIslandMarkers() {
        elements.islandMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                const islandName = marker.dataset.island;
                const islandInfo = CONFIG.islandData[islandName];
                
                // Create a temporary info popup
                const popup = document.createElement('div');
                popup.className = 'island-popup';
                popup.innerHTML = `
                    <h4>${islandName}</h4>
                    <p>Star Path: <strong>${islandInfo.starPath}</strong></p>
                    <p>Latitude: ${islandInfo.lat.toFixed(2)}°</p>
                    <p>Longitude: ${islandInfo.lng.toFixed(2)}°</p>
                    <p class="hint">Wayfinders used ${islandInfo.starPath} to navigate to this island.</p>
                `;
                
                // Style the popup
                popup.style.cssText = `
                    position: absolute;
                    top: -120px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(10, 22, 40, 0.95);
                    border: 1px solid var(--tapa-pattern);
                    border-radius: 8px;
                    padding: 12px;
                    color: var(--starlight);
                    font-family: var(--font-display);
                    font-size: 0.9rem;
                    z-index: 1000;
                    min-width: 200px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    animation: popup-appear 0.3s ease;
                `;
                
                marker.appendChild(popup);
                
                // Remove popup after 5 seconds
                setTimeout(() => {
                    popup.style.opacity = '0';
                    popup.style.transition = 'opacity 0.5s';
                    setTimeout(() => popup.remove(), 500);
                }, 5000);
                
                // Close on click outside
                const closePopup = (e) => {
                    if (!marker.contains(e.target)) {
                        popup.remove();
                        document.removeEventListener('click', closePopup);
                    }
                };
                setTimeout(() => document.addEventListener('click', closePopup), 100);
            });
        });
    }

    // =====================================================
    // NAVIGATION MARKERS (CARVED STONES)
    // =====================================================
    function initNavMarkers() {
        elements.navMarkers.forEach((marker, index) => {
            marker.addEventListener('click', () => {
                // Reset all markers
                elements.navMarkers.forEach(m => m.style.transform = 'perspective(500px) rotateY(-15deg)');
                
                // Activate clicked marker
                marker.style.transform = 'perspective(500px) rotateY(0deg) scale(1.1)';
                
                // Show corresponding constellation
                const constellations = CONFIG.constellationStars;
                const constellation = constellations[index % constellations.length];
                starDome.highlightConstellation(constellation.name);
                
                // Pulse animation
                marker.style.animation = 'none';
                setTimeout(() => {
                    marker.style.animation = 'marker-pulse 1s ease 2';
                }, 10);
            });
        });
    }

    // =====================================================
    // EVENT LISTENERS & CONTROLS
    // =====================================================
    function setupControls() {
        elements.toggleRotation.addEventListener('click', () => {
            const isActive = starDome.toggleRotation();
            elements.toggleRotation.classList.toggle('active', isActive);
            elements.toggleRotation.querySelector('span').textContent = 
                isActive ? 'Pause' : 'Rotate';
        });

        elements.toggleConstellations.addEventListener('click', () => {
            const isActive = starDome.toggleConstellations();
            elements.toggleConstellations.classList.toggle('active', isActive);
            elements.toggleConstellations.querySelector('span').textContent = 
                isActive ? 'Hide Lines' : 'Constellations';
        });

        elements.toggleWaves.addEventListener('click', () => {
            const isActive = waves.toggle();
            elements.toggleWaves.classList.toggle('active', isActive);
            elements.toggleWaves.querySelector('span').textContent = 
                isActive ? 'Hide Waves' : 'Waves';
        });

        elements.toggleWake.addEventListener('click', () => {
            const isActive = wakeTrail.toggle();
            elements.toggleWake.classList.toggle('active', isActive);
            elements.toggleWake.querySelector('span').textContent = 
                isActive ? 'Hide Wake' : 'Wake';
        });
    }

    // =====================================================
    // WAKE TRAIL MOUSE TRACKING
    // =====================================================
    function setupWakeTracking() {
        let lastWakeTime = 0;
        const wakeThrottle = 16; // ~60fps
        
        document.addEventListener('mousemove', (e) => {
            if (!state.wakeActive) return;
            
            const now = Date.now();
            if (now - lastWakeTime < wakeThrottle) return;
            lastWakeTime = now;
            
            wakeTrail.addPoint(e.clientX, e.clientY);
        });

        // Touch support for mobile
        document.addEventListener('touchmove', (e) => {
            if (!state.wakeActive || e.touches.length === 0) return;
            
            const touch = e.touches[0];
            wakeTrail.addPoint(touch.clientX, touch.clientY);
        });
    }

    // =====================================================
    // GLOBAL ANIMATION LOOP
    // =====================================================
    let starfield, starDome, waves, wakeTrail, constellationConnect;

    function initAll() {
        starfield = new StarField(elements.starfield, starfieldCtx);
        starDome = new StarDome(elements.starDome, elements.constellationSvg);
        waves = new OceanWaves(elements.waveCanvas, waveCtx);
        wakeTrail = new WakeTrail(elements.wakeCanvas, wakeCtx);
        constellationConnect = new ConstellationConnect(elements.constellationOverlay);
        
        initIslandMarkers();
        initNavMarkers();
        setupControls();
        setupWakeTracking();
        
        // Start the main animation loop for starfield
        function animateStarfield(time) {
            starfield.draw(time);
            requestAnimationFrame(animateStarfield);
        }
        requestAnimationFrame(animateStarfield);
        
        // Set initial active states
        elements.toggleRotation.classList.add('active');
        elements.toggleWaves.classList.add('active');
        
        console.log('Polynesian Wayfinding Chart initialized successfully');
    }

    // =====================================================
    // ADDITIONAL CSS FOR POPUPS & ANIMATIONS
    // =====================================================
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        @keyframes popup-appear {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes marker-pulse {
            0%, 100% { transform: perspective(500px) rotateY(0deg) scale(1.1); }
            50% { transform: perspective(500px) rotateY(0deg) scale(1.15); }
        }
        
        .island-popup h4 {
            color: var(--star-gold);
            margin-bottom: 8px;
            font-size: 1.1rem;
        }
        
        .island-popup p {
            margin: 4px 0;
            font-size: 0.85rem;
        }
        
        .island-popup .hint {
            color: var(--bio-glow);
            font-style: italic;
            margin-top: 8px;
            font-size: 0.8rem;
        }
    `;
    document.head.appendChild(additionalStyles);

    // Initialize everything
    initAll();
});