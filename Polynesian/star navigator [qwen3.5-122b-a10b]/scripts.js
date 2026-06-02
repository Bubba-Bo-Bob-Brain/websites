/**
 * Wayfinder: Celestial Navigation System
 * Handles Canvas rendering, Star logic, Swell animations, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wayfinder-canvas');
    const ctx = canvas.getContext('2d');
    
    // UI Elements
    const infoPanel = document.getElementById('info-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelDesc = document.getElementById('panel-desc');
    const panelAzimuth = document.getElementById('panel-azimuth');
    const panelDec = document.getElementById('panel-dec');
    const navBtns = document.querySelectorAll('.nav-btn');

    // State
    let width, height;
    let stars = [];
    let swells = [];
    let islands = [];
    let mouse = { x: -1000, y: -1000 };
    let activeMode = 'stars'; // 'stars', 'swells', 'islands'
    let selectedObject = null;
    let animationId;
    let time = 0;

    // Configuration
    const STAR_COUNT = 150;
    const SWELL_COUNT = 5;
    const ISLAND_COUNT = 6;
    const CONNECTION_DISTANCE = 150; // Distance to draw lines between stars

    // --- Initialization ---

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initElements();
    }

    function initElements() {
        stars = [];
        swells = [];
        islands = [];

        // Create Stars
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                baseX: Math.random() * width,
                baseY: Math.random() * height,
                isNorthStar: i === 0 // First star is special
            });
        }

        // Create Swells (Ocean Currents)
        for (let i = 0; i < SWELL_COUNT; i++) {
            swells.push({
                y: (height / SWELL_COUNT) * i + Math.random() * 50,
                amplitude: 50 + Math.random() * 100,
                wavelength: 200 + Math.random() * 300,
                speed: 0.002 + Math.random() * 0.005,
                phase: Math.random() * Math.PI * 2,
                color: i % 2 === 0 ? 'rgba(0, 242, 255, 0.1)' : 'rgba(0, 242, 255, 0.05)'
            });
        }

        // Create Islands (Navigation Points)
        const islandNames = ['Hawaii', 'Tahiti', 'Rapa Nui', 'Aotearoa', 'Samoa', 'Fiji'];
        for (let i = 0; i < ISLAND_COUNT; i++) {
            islands.push({
                x: Math.random() * width,
                y: Math.random() * height,
                name: islandNames[i],
                radius: 15 + Math.random() * 10,
                pulse: 0
            });
        }
    }

    // --- Event Listeners ---

    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Check for hover over islands
        let hovered = null;
        for (let island of islands) {
            const dx = mouse.x - island.x;
            const dy = mouse.y - island.y;
            if (Math.sqrt(dx*dx + dy*dy) < island.radius + 10) {
                hovered = island;
                break;
            }
        }
        
        if (hovered) {
            document.body.style.cursor = 'pointer';
            if (selectedObject !== hovered) {
                selectObject(hovered);
            }
        } else {
            document.body.style.cursor = 'crosshair';
            if (selectedObject && selectedObject.type === 'island') {
                deselectObject();
            }
        }
    });

    // --- Logic & Drawing ---

    function selectObject(obj) {
        selectedObject = obj;
        infoPanel.classList.add('open');
        
        if (obj.type === 'island') {
            panelTitle.innerText = obj.name;
            panelDesc.innerText = `Ancient waypoint. The swell patterns converge here. Navigate by the rising of the Southern Cross.`;
            panelAzimuth.innerText = `${Math.floor(Math.random() * 360)}°`;
            panelDec.innerText = `${Math.floor(Math.random() * 90)}°S`;
        }
    }

    function deselectObject() {
        selectedObject = null;
        infoPanel.classList.remove('open');
    }

    function drawStars() {
        // Parallax effect based on mouse position
        const parallaxX = (mouse.x - width / 2) * 0.02;
        const parallaxY = (mouse.y - height / 2) * 0.02;

        stars.forEach((star, index) => {
            // Calculate position with parallax
            let x = star.baseX - parallaxX * (star.isNorthStar ? 0 : (index % 10 + 1));
            let y = star.baseY - parallaxY * (star.isNorthStar ? 0 : (index % 10 + 1));

            // Wrap around screen
            if (x < 0) x += width;
            if (x > width) x -= width;
            if (y < 0) y += height;
            if (y > height) y -= height;

            // Twinkle
            star.brightness += star.twinkleSpeed;
            if (star.brightness > 1 || star.brightness < 0.2) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }

            // Draw Star
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240, 244, 248, ${star.brightness})`;
            ctx.fill();

            // Draw Glow for North Star
            if (star.isNorthStar) {
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
                gradient.addColorStop(0, 'rgba(0, 242, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 242, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Connections (Constellations)
            if (activeMode === 'stars') {
                stars.forEach((otherStar, otherIndex) => {
                    if (index === otherIndex) return;
                    
                    const dx = x - otherStar.baseX; // Use base positions for stable lines
                    const dy = y - otherStar.baseY;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(otherStar.baseX - parallaxX * (otherIndex % 10 + 1), otherStar.baseY - parallaxY * (otherIndex % 10 + 1));
                        ctx.strokeStyle = `rgba(0, 242, 255, ${0.15 * (1 - dist/CONNECTION_DISTANCE)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            }
        });
    }

    function drawSwells() {
        if (activeMode !== 'swells') return;

        ctx.lineWidth = 2;
        
        swells.forEach(swell => {
            ctx.beginPath();
            ctx.strokeStyle = swell.color;
            
            for (let x = 0; x <= width; x += 10) {
                // Sine wave formula: y = amplitude * sin(frequency * x + phase + time)
                const y = swell.y + 
                          Math.sin((x / swell.wavelength) * Math.PI * 2 + swell.phase + time * swell.speed * 100) * 
                          swell.amplitude;
                
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });
    }

    function drawIslands() {
        islands.forEach(island => {
            // Pulse effect
            island.pulse += 0.05;
            const pulseRadius = island.radius + Math.sin(island.pulse) * 5;

            // Draw Island Base
            ctx.beginPath();
            ctx.arc(island.x, island.y, island.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#3e2723'; // Wood color
            ctx.fill();
            
            // Draw Border
            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Glow Ring
            ctx.beginPath();
            ctx.arc(island.x, island.y, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.5 + Math.sin(island.pulse) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw Label
            ctx.fillStyle = '#f0f4f8';
            ctx.font = '14px "Cinzel Decorative"';
            ctx.textAlign = 'center';
            ctx.fillText(island.name, island.x, island.y + island.radius + 20);
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        time++;

        // Draw Layers
        drawSwells(); // Bottom layer
        drawStars();  // Middle layer
        drawIslands(); // Top layer

        animationId = requestAnimationFrame(animate);
    }

    // --- UI Logic ---

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            
            // Update mode
            activeMode = btn.dataset.target;
            
            // Reset selection if switching modes
            if (selectedObject) {
                deselectObject();
            }
        });
    });

    // Start
    resize();
    animate();
});