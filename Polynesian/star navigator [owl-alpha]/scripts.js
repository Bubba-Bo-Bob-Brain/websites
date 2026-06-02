/* ============================================
   POLYNESIAN CELESTIAL WAYFINDING CHART
   Interactive Features & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initStarField();
    initCelestialDome();
    initConstellationCanvas();
    initOceanCurrents();
    initWavePatterns();
    initTrailCanvas();
    initCustomCursor();
    initNavMarkers();
    initParticles();
});

/* ============================================
   STAR FIELD BACKGROUND
   ============================================ */
function initStarField() {
    const starField = document.getElementById('star-field');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${getStarColor()};
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: starTwinkle ${Math.random() * 4 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        starField.appendChild(star);
    }
    
    // Add dynamic star twinkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes starTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
}

function getStarColor() {
    const colors = ['#fff8e7', '#a8d8ff', '#ffd700', '#ff6b6b', '#ffffff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/* ============================================
   CELESTIAL DOME - Cursor-responsive rotation
   ============================================ */
function initCelestialDome() {
    const dome = document.getElementById('celestial-dome');
    const svg = dome.querySelector('.star-paths');
    
    // Create star paths
    const starPaths = [
        { points: "400,100 350,200 450,250 400,350 300,300", name: "Manaiakalani" },
        { points: "200,150 250,200 200,280 150,230", name: "Ka Makau Nui" },
        { points: "550,120 600,180 580,280 520,250", name: "Na Hoku" },
        { points: "300,80 350,120 320,180 280,150", name: "Hoku'ula" },
        { points: "480,80 520,130 490,190 450,160", name: "Hokule'a" }
    ];
    
    starPaths.forEach((path, index) => {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', path.points);
        polygon.setAttribute('fill', 'none');
        polygon.setAttribute('stroke', index % 2 === 0 ? '#ffd700' : '#00d4aa');
        polygon.setAttribute('stroke-width', '1');
        polygon.setAttribute('opacity', '0.6');
        polygon.classList.add('star-path');
        polygon.dataset.name = path.name;
        svg.appendChild(polygon);
        
        // Add stars at vertices
        const points = path.points.split(' ');
        points.forEach(point => {
            const [x, y] = point.split(',');
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            star.setAttribute('cx', x);
            star.setAttribute('cy', y);
            star.setAttribute('r', '4');
            star.setAttribute('fill', '#fff8e7');
            star.classList.add('path-star');
            svg.appendChild(star);
        });
    });
    
    // Add central star compass
    const compassStars = [
        { x: 400, y: 50, name: "Hokupa'a", color: "#ffd700" },
        { x: 400, y: 750, name: "Hikianalia", color: "#a8d8ff" },
        { x: 50, y: 400, name: "Ke Kawa Ma'i", color: "#ff6b6b" },
        { x: 750, y: 400, name: "Humu", color: "#00d4aa" }
    ];
    
    compassStars.forEach(star => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', star.x);
        circle.setAttribute('cy', star.y);
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', star.color);
        circle.setAttribute('opacity', '0.9');
        svg.appendChild(circle);
        
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', star.x);
        glow.setAttribute('cy', star.y);
        glow.setAttribute('r', '12');
        glow.setAttribute('fill', star.color);
        glow.setAttribute('opacity', '0.3');
        svg.appendChild(glow);
    });
    
    // Cursor-responsive rotation
    let targetRotation = 0;
    let currentRotation = 0;
    
    document.addEventListener('mousemove', (e) => {
        const rect = dome.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        targetRotation = (angle * 180 / Math.PI) * 0.1;
    });
    
    function animateDome() {
        currentRotation += (targetRotation - currentRotation) * 0.05;
        dome.style.transform = `rotate(${currentRotation}deg)`;
        requestAnimationFrame(animateDome);
    }
    animateDome();
}

/* ============================================
   INTERACTIVE CONSTELLATION CANVAS
   ============================================ */
function initConstellationCanvas() {
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    const infoName = document.getElementById('constellation-name');
    const infoDesc = document.getElementById('constellation-desc');
    
    // Set actual canvas size
    canvas.width = 900;
    canvas.height = 500;
    
    const constellations = [
        {
            name: "Hōkūle'a",
            description: "The Star of Gladness - Arcturus, guiding star to Hawai'i",
            stars: [
                { x: 150, y: 120, size: 5 },
                { x: 200, y: 180, size: 4 },
                { x: 280, y: 160, size: 4 },
                { x: 320, y: 220, size: 5 },
                { x: 380, y: 200, size: 3 },
                { x: 420, y: 260, size: 4 }
            ],
            connections: [[0,1], [1,2], [2,3], [3,4], [4,5]]
        },
        {
            name: "Makali'i",
            description: "The Pleiades - marking the beginning of Makahiki season",
            stars: [
                { x: 550, y: 100, size: 3 },
                { x: 580, y: 120, size: 4 },
                { x: 620, y: 110, size: 3 },
                { x: 600, y: 150, size: 4 },
                { x: 560, y: 160, size: 3 },
                { x: 640, y: 160, size: 3 },
                { x: 590, y: 180, size: 4 }
            ],
            connections: [[0,1], [1,2], [1,3], [3,4], [3,5], [3,6]]
        },
        {
            name: "Manaiakalani",
            description: "The Fishhook of Maui - the magical hook that fished up islands",
            stars: [
                { x: 200, y: 350, size: 5 },
                { x: 280, y: 320, size: 4 },
                { x: 360, y: 340, size: 4 },
                { x: 440, y: 310, size: 3 },
                { x: 500, y: 350, size: 4 },
                { x: 480, y: 400, size: 3 },
                { x: 420, y: 380, size: 3 }
            ],
            connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,3]]
        },
        {
            name: "Ka Makau Nui",
            description: "The Big Fishhook - Scorpius in Polynesian navigation",
            stars: [
                { x: 650, y: 300, size: 4 },
                { x: 700, y: 340, size: 3 },
                { x: 750, y: 320, size: 4 },
                { x: 780, y: 380, size: 3 },
                { x: 720, y: 400, size: 4 },
                { x: 680, y: 360, size: 3 },
                { x: 740, y: 360, size: 3 }
            ],
            connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,2]]
        }
    ];
    
    let selectedStars = [];
    let currentConstellation = null;
    let hoveredStar = null;
    
    function drawStar(x, y, size, color, glow = false) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        if (glow) {
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    function drawConstellation(constellation, highlight = false) {
        const alpha = highlight ? 1 : 0.6;
        const starColor = highlight ? '#ffd700' : '#a8d8ff';
        const lineColor = highlight ? '#ffd700' : '#00d4aa';
        
        // Draw connections
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = highlight ? 2 : 1;
        ctx.globalAlpha = alpha * 0.5;
        constellation.connections.forEach(([from, to]) => {
            ctx.beginPath();
            ctx.moveTo(constellation.stars[from].x, constellation.stars[from].y);
            ctx.lineTo(constellation.stars[to].x, constellation.stars[to].y);
            ctx.stroke();
        });
        ctx.globalAlpha = 1;
        
        // Draw stars
        constellation.stars.forEach((star, index) => {
            const isSelected = selectedStars.includes(`${constellation.name}-${index}`);
            const isHovered = hoveredStar && hoveredStar.constellation === constellation.name && hoveredStar.index === index;
            
            drawStar(
                star.x, 
                star.y, 
                isSelected || isHovered ? star.size * 1.5 : star.size,
                isSelected ? '#ffd700' : starColor,
                isSelected || isHovered
            );
        });
    }
    
    function drawSelectedPath() {
        if (selectedStars.length < 2) return;
        
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        
        selectedStars.forEach((starKey, index) => {
            const [constName, starIndex] = starKey.split('-');
            const constellation = constellations.find(c => c.name === constName);
            const star = constellation.stars[parseInt(starIndex)];
            
            if (index === 0) {
                ctx.moveTo(star.x, star.y);
            } else {
                ctx.lineTo(star.x, star.y);
            }
        });
        
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    function render() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background stars
        for (let i = 0; i < 100; i++) {
            const x = (i * 73) % canvas.width;
            const y = (i * 47) % canvas.height;
            const size = (i % 3) + 1;
            drawStar(x, y, size, 'rgba(255, 255, 255, 0.3)');
        }
        
        // Draw constellations
        constellations.forEach(constellation => {
            drawConstellation(constellation, constellation === currentConstellation);
        });
        
        // Draw selected path
        drawSelectedPath();
        
        requestAnimationFrame(render);
    }
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        hoveredStar = null;
        
        for (const constellation of constellations) {
            for (let i = 0; i < constellation.stars.length; i++) {
                const star = constellation.stars[i];
                const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
                
                if (distance < 20) {
                    hoveredStar = { constellation: constellation.name, index: i };
                    canvas.style.cursor = 'pointer';
                    return;
                }
            }
        }
        canvas.style.cursor = 'crosshair';
    });
    
    canvas.addEventListener('click', (e) => {
        if (!hoveredStar) return;
        
        const starKey = `${hoveredStar.constellation}-${hoveredStar.index}`;
        
        if (selectedStars.includes(starKey)) {
            selectedStars = selectedStars.filter(s => s !== starKey);
        } else {
            selectedStars.push(starKey);
        }
        
        // Update current constellation
        currentConstellation = constellations.find(c => c.name === hoveredStar.constellation);
        
        // Update info panel
        if (currentConstellation) {
            infoName.textContent = currentConstellation.name;
            infoDesc.textContent = currentConstellation.description;
        }
    });
    
    canvas.addEventListener('dblclick', () => {
        selectedStars = [];
        currentConstellation = null;
        infoName.textContent = 'Select a Star';
        infoDesc.textContent = 'Begin your journey by clicking on any star';
    });
    
    render();
}

/* ============================================
   OCEAN CURRENTS ANIMATION
   ============================================ */
function initOceanCurrents() {
    const svg = document.querySelector('.current-lines');
    
    // Create animated current paths
    const currentPaths = [
        { d: "M-50,200 Q200,150 400,200 T800,200 T1050,200", stroke: "#ff6b6b", width: 3 },
        { d: "M-50,150 Q250,250 450,150 T850,150 T1050,150", stroke: "#4fc3f7", width: 2 },
        { d: "M-50,250 Q300,180 500,250 T900,250 T1050,250", stroke: "#00d4aa", width: 2 },
        { d: "M-50,100 Q150,180 350,100 T750,100 T1050,100", stroke: "#ffd700", width: 2 },
        { d: "M-50,300 Q200,220 400,300 T800,300 T1050,300", stroke: "#a8d8ff", width: 2 }
    ];
    
    currentPaths.forEach((path, index) => {
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', path.d);
        pathEl.setAttribute('fill', 'none');
        pathEl.setAttribute('stroke', path.stroke);
        pathEl.setAttribute('stroke-width', path.width);
        pathEl.setAttribute('stroke-linecap', 'round');
        pathEl.setAttribute('opacity', '0.6');
        
        // Add dash array for animation
        pathEl.setAttribute('stroke-dasharray', '20,10');
        pathEl.style.animation = `currentFlow ${8 + index * 2}s linear infinite`;
        
        svg.appendChild(pathEl);
    });
    
    // Add current flow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes currentFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -60; }
        }
    `;
    document.head.appendChild(style);
    
    // Create eddy patterns
    const eddies = [
        { cx: 200, cy: 200, r: 40 },
        { cx: 600, cy: 180, r: 50 },
        { cx: 800, cy: 220, r: 35 }
    ];
    
    eddies.forEach(eddy => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', eddy.cx);
        circle.setAttribute('cy', eddy.cy);
        circle.setAttribute('r', eddy.r);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#00d4aa');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('stroke-dasharray', '10,5');
        circle.setAttribute('opacity', '0.4');
        circle.style.animation = `eddySpin ${10 + Math.random() * 5}s linear infinite`;
        svg.appendChild(circle);
    });
    
    // Add eddy spin animation
    const eddyStyle = document.createElement('style');
    eddyStyle.textContent = `
        @keyframes eddySpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(eddyStyle);
    
    // Add islands
    const islandPositions = [
        { x: 150, y: 180, size: 25 },
        { x: 400, y: 220, size: 30 },
        { x: 650, y: 190, size: 20 },
        { x: 850, y: 210, size: 28 }
    ];
    
    islandPositions.forEach(island => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Island shape
        const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ellipse.setAttribute('cx', island.x);
        ellipse.setAttribute('cy', island.y);
        ellipse.setAttribute('rx', island.size);
        ellipse.setAttribute('ry', island.size * 0.4);
        ellipse.setAttribute('fill', '#8b6914');
        ellipse.setAttribute('stroke', '#6b4423');
        ellipse.setAttribute('stroke-width', '2');
        g.appendChild(ellipse);
        
        // Palm tree
        const tree = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tree.setAttribute('d', `M${island.x},${island.y - island.size * 0.4} 
                               Q${island.x - 8},${island.y - island.size * 0.8} 
                               ${island.x - 15},${island.y - island.size * 0.6}
                               M${island.x},${island.y - island.size * 0.4}
                               Q${island.x + 8},${island.y - island.size * 0.9}
                               ${island.x + 15},${island.y - island.size * 0.7}`);
        tree.setAttribute('fill', 'none');
        tree.setAttribute('stroke', '#228b22');
        tree.setAttribute('stroke-width', '3');
        tree.setAttribute('stroke-linecap', 'round');
        g.appendChild(tree);
        
        svg.appendChild(g);
    });
}

/* ============================================
   WAVE PATTERN CANVASES
   ============================================ */
function initWavePatterns() {
    const wavePatterns = document.querySelectorAll('.wave-pattern');
    
    wavePatterns.forEach(pattern => {
        const canvas = pattern.querySelector('.wave-canvas');
        const ctx = canvas.getContext('2d');
        const patternType = pattern.id;
        
        canvas.width = 300;
        canvas.height = 150;
        
        let time = 0;
        
        function drawWavePattern() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw based on pattern type
            switch(patternType) {
                case 'pattern-refraction':
                    drawRefraction(ctx, time);
                    break;
                case 'pattern-reflection':
                    drawReflection(ctx, time);
                    break;
                case 'pattern-interference':
                    drawInterference(ctx, time);
                    break;
                case 'pattern-difraction':
                    drawDiffraction(ctx, time);
                    break;
            }
            
            time += 0.02;
            requestAnimationFrame(drawWavePattern);
        }
        
        drawWavePattern();
    });
}

function drawRefraction(ctx, time) {
    // Island obstacle
    const islandX = 150;
    const islandY = 75;
    
    ctx.fillStyle = '#6b4423';
    ctx.beginPath();
    ctx.ellipse(islandX, islandY, 25, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Waves bending around island
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 170, ${0.3 + i * 0.08})`;
        ctx.lineWidth = 2;
        
        for (let x = 0; x < 300; x += 5) {
            const baseY = 75 + Math.sin(x * 0.05 + time + i * 0.5) * 20;
            const distortion = Math.exp(-Math.abs(x - islandX) / 50) * 15;
            const y = x < islandX ? baseY - distortion : baseY + distortion;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function drawReflection(ctx, time) {
    // Incoming wave
    ctx.beginPath();
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 2;
    
    for (let x = 0; x < 300; x += 5) {
        const y = 75 + Math.sin(x * 0.08 + time) * 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Obstacle
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(200, 40, 10, 70);
    
    // Reflected wave
    ctx.beginPath();
    ctx.strokeStyle = '#00d4aa';
    ctx.lineWidth = 2;
    
    for (let x = 210; x < 300; x += 5) {
        const y = 75 + Math.sin((x - 210) * 0.08 - time) * 20;
        if (x === 210) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawInterference(ctx, time) {
    // Two wave sources
    const source1 = { x: 75, y: 75 };
    const source2 = { x: 225, y: 75 };
    
    // Draw interference pattern using pixel manipulation
    const imageData = ctx.createImageData(300, 150);
    const data = imageData.data;
    
    for (let x = 0; x < 300; x++) {
        for (let y = 0; y < 150; y++) {
            const dist1 = Math.sqrt((x - source1.x) ** 2 + (y - source1.y) ** 2);
            const dist2 = Math.sqrt((x - source2.x) ** 2 + (y - source2.y) ** 2);
            
            const wave1 = Math.sin(dist1 * 0.1 - time * 2);
            const wave2 = Math.sin(dist2 * 0.1 - time * 2);
            const interference = (wave1 + wave2) / 2;
            
            const index = (y * 300 + x) * 4;
            const intensity = Math.floor((interference + 1) * 127.5);
            
            data[index] = 0;
            data[index + 1] = Math.floor(intensity * 0.8);
            data[index + 2] = Math.floor(intensity);
            data[index + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function drawDiffraction(ctx, time) {
    // Channel opening
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(140, 0, 20, 150);
    
    // Waves entering channel
    ctx.beginPath();
    ctx.strokeStyle = '#a8d8ff';
    ctx.lineWidth = 2;
    
    for (let x = 0; x < 140; x += 5) {
        const y = 75 + Math.sin(x * 0.06 + time) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Diffracted waves spreading
    for (let angle = -2; angle <= 2; angle += 0.5) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 170, ${0.4 + Math.abs(angle) * 0.1})`;
        ctx.lineWidth = 1.5;
        
        const rad = angle * 0.3;
        for (let r = 0; r < 100; r += 3) {
            const x = 160 + Math.cos(rad) * r;
            const y = 75 + Math.sin(rad) * r + Math.sin(r * 0.1 - time * 2) * 5;
            
            if (r === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

/* ============================================
   BIOLUMINESCENT TRAIL CANVAS
   ============================================ */
function initTrailCanvas() {
    const container = document.getElementById('trail-canvas-container');
    const canvas = document.getElementById('trail-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1200;
    canvas.height = 300;
    
    const trail = [];
    const maxTrailLength = 50;
    let lastX = null;
    let lastY = null;
    
    function drawTrail() {
        // Fade effect
        ctx.fillStyle = 'rgba(10, 22, 40, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw background waves
        drawBackgroundWaves(ctx);
        
        // Draw trail
        trail.forEach((point, index) => {
            const alpha = index / trail.length;
            const size = 3 + alpha * 8;
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 170, ${alpha * 0.5})`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 2);
            gradient.addColorStop(0, `rgba(0, 255, 242, ${alpha * 0.3})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
        });
        
        // Draw connecting lines
        if (trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            
            for (let i = 1; i < trail.length; i++) {
                ctx.lineTo(trail[i].x, trail[i].y);
            }
            
            ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        requestAnimationFrame(drawTrail);
    }
    
    function drawBackgroundWaves(ctx) {
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(26, 111, 179, ${0.1 - i * 0.015})`;
            ctx.lineWidth = 1;
            
            for (let x = 0; x < canvas.width; x += 10) {
                const y = 150 + Math.sin(x * 0.02 + time + i) * (30 + i * 10);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }
    
    container.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        if (lastX !== null) {
            const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
            
            if (distance > 5) {
                trail.push({ x, y, time: Date.now() });
                
                if (trail.length > maxTrailLength) {
                    trail.shift();
                }
                
                lastX = x;
                lastY = y;
            }
        } else {
            lastX = x;
            lastY = y;
        }
    });
    
    container.addEventListener('mouseleave', () => {
        lastX = null;
        lastY = null;
    });
    
    // Auto-generate some initial trail points for visual interest
    function generateInitialTrail() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 50 + Math.random() * 30;
            trail.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                time: Date.now() - (20 - i) * 100
            });
        }
    }
    
    generateInitialTrail();
    drawTrail();
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Add glow effect on hover over interactive elements
    const interactiveElements = document.querySelectorAll('.nav-marker, .wave-pattern');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

/* ============================================
   NAVIGATION MARKERS INTERACTION
   ============================================ */
function initNavMarkers() {
    const markers = document.querySelectorAll('.nav-marker');
    
    markers.forEach(marker => {
        marker.addEventListener('click', () => {
            const markerType = marker.dataset.marker;
            showMarkerInfo(markerType);
        });
        
        marker.addEventListener('mouseenter', () => {
            createMarkerParticles(marker);
        });
    });
}

function showMarkerInfo(markerType) {
    const info = {
        'hokulea': {
            title: "Hōkūle'a - The Star of Gladness",
            description: "Arcturus, the brightest star in the constellation Boötes. When Hōkūle'a rises exactly east and sets exactly west, the navigator knows they are at the same latitude as the Hawaiian Islands."
        },
        'kaweil': {
            title: "Ka'ulua - The Navigator's Guide",
            description: "This star path helped navigators maintain course during long voyages. Its position relative to the horizon indicated both direction and latitude."
        },
        'makali': {
            title: "Makali'i - The Pleiades",
            description: "This star cluster marked the beginning of Makahiki, the harvest season. Its rising signaled the start of the navigation season across Polynesia."
        },
        'na-hiku': {
            title: "Na-Hiku - The Big Dipper",
            description: "The seven stars of the dipper pointed toward Hokupa'a (Polaris), helping navigators find north and maintain their heading through the night."
        }
    };
    
    if (info[markerType]) {
        const infoBox = document.querySelector('.constellation-info');
        document.getElementById('constellation-name').textContent = info[markerType].title;
        document.getElementById('constellation-desc').textContent = info[markerType].description;
        
        // Highlight animation
        infoBox.style.animation = 'none';
        infoBox.offsetHeight; // Trigger reflow
        infoBox.style.animation = 'markerGlow 0.5s ease-out';
    }
}

function createMarkerParticles(marker) {
    const rect = marker.getBoundingClientRect();
    const container = document.getElementById('particles-container');
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 60) + 'px';
        particle.style.top = (rect.top + rect.height / 2 + (Math.random() - 0.5) * 60) + 'px';
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

/* ============================================
   FLOATING PARTICLES
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles-container');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.animationDuration = (1.5 + Math.random()) + 's';
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 500);
    
    // Create particles on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(createParticle, i * 100);
            }
        }, 100);
    });
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ============================================
   PARALLAX EFFECT ON STAR FIELD
   ============================================ */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const starField = document.getElementById('star-field');
    
    if (starField) {
        starField.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */
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

// Observe sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

/* ============================================
   KEYBOARD NAVIGATION SUPPORT
   ============================================ */
document.addEventListener('keydown', (e) => {
    // Add subtle interaction on key press
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});