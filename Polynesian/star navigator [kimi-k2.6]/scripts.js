// ============================================
// NA HOLOHOLONA O KA LANI - INTERACTIVITY
// The Celestial Wayfinders of the Pacific
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initStarField();
    initCustomCursor();
    initStarDome();
    initConstellations();
    initOceanCanvas();
    initCurrentMap();
    initIslandVoyage();
    initTikiGallery();
    initWakeEffect();
    initScrollAnimations();
    generateWavePatterns();
});

// ============================================
// STAR FIELD DYNAMIC GENERATION
// ============================================
function initStarField() {
    const starField = document.getElementById('starField');
    if (!starField) return;
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.5 ? 'var(--star-bright)' : 'var(--star-gold)'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: twinkle ${Math.random() * 4 + 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        starField.appendChild(star);
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    const interactiveElements = document.querySelectorAll('button, a, .tiki-card, .constellation-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

// ============================================
// INTERACTIVE STAR DOME
// ============================================
function initStarDome() {
    const canvas = document.getElementById('starDomeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('domeContainer');
    
    let width, height;
    let stars = [];
    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;
    
    function resize() {
        const rect = container.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
        initStars();
    }
    
    function initStars() {
        stars = [];
        const starCount = 200;
        for (let i = 0; i < starCount; i++) {
            stars.push({
                theta: Math.random() * Math.PI * 2,
                phi: Math.random() * Math.PI * 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        targetMouseX = (e.clientX - rect.left) / rect.width;
        targetMouseY = (e.clientY - rect.top) / rect.height;
    });
    
    function project(theta, phi) {
        const adjustedPhi = Math.max(0, Math.min(Math.PI / 2, phi - (targetMouseY - 0.5) * 0.5));
        const adjustedTheta = theta + (targetMouseX - 0.5) * Math.PI;
        
        const r = Math.sin(adjustedPhi);
        const x = r * Math.cos(adjustedTheta);
        const y = Math.cos(adjustedPhi);
        const z = r * Math.sin(adjustedTheta);
        
        const scale = 400 / (z + 2);
        return {
            x: width / 2 + x * scale,
            y: height - y * scale,
            z: z,
            visible: z > -0.5
        };
    }
    
    let time = 0;
    
    function draw() {
        time += 0.016;
        
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        ctx.fillStyle = 'rgba(2, 5, 16, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        const horizonGradient = ctx.createLinearGradient(0, height * 0.8, 0, height);
        horizonGradient.addColorStop(0, 'rgba(0, 240, 208, 0)');
        horizonGradient.addColorStop(1, 'rgba(0, 240, 208, 0.1)');
        ctx.fillStyle = horizonGradient;
        ctx.fillRect(0, height * 0.8, width, height * 0.2);
        
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.3 + 0.7;
            const projected = project(star.theta, star.phi);
            
            if (!projected.visible) return;
            
            const size = (1 - star.phi / (Math.PI / 2)) * 3 + 1;
            const alpha = star.brightness * twinkle * Math.max(0, projected.z);
            
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, size * (1 + projected.z * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 248, 224, ${alpha})`;
            ctx.fill();
            
            if (star.brightness > 0.8) {
                ctx.beginPath();
                ctx.arc(projected.x, projected.y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(224, 200, 128, ${alpha * 0.2})`;
                ctx.fill();
            }
        });
        
        ctx.strokeStyle = 'rgba(0, 240, 208, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 6; i++) {
            const phi = (i / 6) * Math.PI * 0.5;
            ctx.beginPath();
            let first = true;
            for (let j = 0; j <= 64; j++) {
                const theta = (j / 64) * Math.PI * 2;
                const projected = project(theta, phi);
                if (projected.visible) {
                    if (first) {
                        ctx.moveTo(projected.x, projected.y);
                        first = false;
                    } else {
                        ctx.lineTo(projected.x, projected.y);
                    }
                }
            }
            ctx.stroke();
        }
        
        requestAnimationFrame(draw);
    }
    
    resize();
    window.addEventListener('resize', resize);
    draw();
}

// ============================================
// CONSTELLATION CONNECT-THE-DOTS
// ============================================
function initConstellations() {
    const canvas = document.getElementById('constellationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    let width, height;
    let currentConstellation = 'hanaiakamalama';
    let stars = [];
    let connections = [];
    let userPath = [];
    let isDrawing = false;
    let completed = false;
    
    const constellations = {
        hanaiakamalama: {
            name: 'Hanaiakamalama',
            description: 'The Southern Cross, suspended above the south celestial pole, guided navigators heading toward Aotearoa and the southern islands. When upright, it points directly south.',
            navigation: 'Used to determine latitude when crossing to Tahiti and the Marquesas.',
            stars: [
                {x: 0.5, y: 0.3}, {x: 0.45, y: 0.35}, {x: 0.55, y: 0.35},
                {x: 0.5, y: 0.5}, {x: 0.48, y: 0.65}, {x: 0.52, y: 0.65}
            ],
            connections: [[0,1], [0,2], [1,2], [3,4], [3,5], [4,5]]
        },
        kahe: {
            name: 'Kahe',
            description: 'The Flow, represented by the scorpions tail in Western astronomy, marked the path of water currents in the southern sky.',
            navigation: 'Rising indicated the season for voyaging to the southern islands.',
            stars: [
                {x: 0.2, y: 0.2}, {x: 0.3, y: 0.25}, {x: 0.4, y: 0.35},
                {x: 0.35, y: 0.5}, {x: 0.45, y: 0.6}, {x: 0.55, y: 0.55}
            ],
            connections: [[0,1], [1,2], [2,3], [3,4], [4,5]]
        },
        kaiwi: {
            name: 'Kaiwi',
            description: 'The Bone, corresponding to Orion, rose in the east during the winter months, signaling the time for planting and preparation.',
            navigation: 'Its belt stars align east-west at rising, providing a perfect celestial compass.',
            stars: [
                {x: 0.3, y: 0.25}, {x: 0.5, y: 0.2}, {x: 0.7, y: 0.25},
                {x: 0.35, y: 0.5}, {x: 0.5, y: 0.45}, {x: 0.65, y: 0.5},
                {x: 0.4, y: 0.75}, {x: 0.6, y: 0.75}
            ],
            connections: [[0,1], [1,2], [3,4], [4,5], [6,7], [0,3], [2,5], [3,6], [5,7]]
        },
        makali: {
            name: 'Makalii',
            description: 'The Little Eyes, the Pleiades cluster, appeared in the eastern sky before dawn in late autumn, marking the start of the new year.',
            navigation: 'Its heliacal rising signaled the Makahiki season and time of peace and harvest.',
            stars: [
                {x: 0.45, y: 0.3}, {x: 0.5, y: 0.25}, {x: 0.55, y: 0.3},
                {x: 0.42, y: 0.4}, {x: 0.5, y: 0.38}, {x: 0.58, y: 0.4},
                {x: 0.5, y: 0.5}
            ],
            connections: [[0,1], [1,2], [0,3], [1,4], [2,5], [3,4], [4,5], [4,6]]
        },
        manaiakalanihi: {
            name: 'Manaiakalanihi',
            description: 'The Fishhook, Scorpius in Western terms, dragged across the sky to pull islands from the ocean floor.',
            navigation: 'Its curved shape matched the arc of the Milky Way, used as a celestial river.',
            stars: [
                {x: 0.3, y: 0.7}, {x: 0.4, y: 0.55}, {x: 0.35, y: 0.4},
                {x: 0.45, y: 0.3}, {x: 0.55, y: 0.25}, {x: 0.6, y: 0.35}
            ],
            connections: [[0,1], [1,2], [2,3], [3,4], [4,5]]
        }
    };
    
    function resize() {
        const rect = container.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
        loadConstellation(currentConstellation);
    }
    
    function loadConstellation(name) {
        const data = constellations[name];
        if (!data) return;
        
        stars = data.stars.map(s => ({
            x: s.x * width,
            y: s.y * height,
            connected: false
        }));
        
        connections = [];
        userPath = [];
        completed = false;
        document.getElementById('completionMessage').classList.remove('visible');
        
        document.getElementById('infoTitle').textContent = data.name;
        document.getElementById('infoText').textContent = data.description;
        document.getElementById('navUsage').innerHTML = '<strong>Navigation:</strong> ' + data.navigation;
    }
    
    function getStarAt(x, y) {
        const threshold = 25;
        return stars.findIndex(s => {
            const dx = s.x - x;
            const dy = s.y - y;
            return dx * dx + dy * dy < threshold * threshold;
        });
    }
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const starIndex = getStarAt(x, y);
        
        if (starIndex >= 0) {
            isDrawing = true;
            userPath = [starIndex];
            stars[starIndex].connected = true;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const starIndex = getStarAt(x, y);
        
        if (starIndex >= 0 && starIndex !== userPath[userPath.length - 1]) {
            const data = constellations[currentConstellation];
            const lastStar = userPath[userPath.length - 1];
            const validConnection = data.connections.some(c => 
                (c[0] === lastStar && c[1] === starIndex) ||
                (c[1] === lastStar && c[0] === starIndex)
            );
            
            if (validConnection && !userPath.includes(starIndex)) {
                userPath.push(starIndex);
                stars[starIndex].connected = true;
                
                if (userPath.length >= data.stars.length) {
                    completed = true;
                    document.getElementById('completionMessage').classList.add('visible');
                }
            }
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    document.querySelectorAll('.constellation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.constellation-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentConstellation = btn.dataset.constellation;
            loadConstellation(currentConstellation);
        });
    });
    
    function draw() {
        ctx.fillStyle = 'rgba(2, 5, 16, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        const data = constellations[currentConstellation];
        if (data) {
            ctx.strokeStyle = 'rgba(0, 240, 208, 0.1)';
            ctx.lineWidth = 1;
            data.connections.forEach(c => {
                ctx.beginPath();
                ctx.moveTo(stars[c[0]].x, stars[c[0]].y);
                ctx.lineTo(stars[c[1]].x, stars[c[1]].y);
                ctx.stroke();
            });
        }
        
        if (userPath.length > 1) {
            ctx.strokeStyle = 'rgba(0, 240, 208, 0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            userPath.forEach((starIdx, i) => {
                if (i === 0) ctx.moveTo(stars[starIdx].x, stars[starIdx].y);
                else ctx.lineTo(stars[starIdx].x, stars[starIdx].y);
            });
            ctx.stroke();
        }
        
        stars.forEach((star, i) => {
            const isInPath = userPath.includes(i);
            
            if (isInPath) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, 20, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 240, 208, 0.2)';
                ctx.fill();
            }
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, isInPath ? 8 : 6, 0, Math.PI * 2);
            ctx.fillStyle = isInPath ? 'var(--bioluminescence)' : 'var(--star-gold)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'var(--star-bright)';
            ctx.fill();
        });
        
        requestAnimationFrame(draw);
    }
    
    resize();
    window.addEventListener('resize', resize);
    draw();
}

// ============================================
// OCEAN CANVAS BACKGROUND
// ============================================
function initOceanCanvas() {
    const canvas = document.getElementById('oceanCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let time = 0;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    function drawWave(yOffset, amplitude, frequency, speed, color, opacity) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 5) {
            const y = yOffset + Math.sin(x * frequency + time * speed) * amplitude
                          + Math.sin(x * frequency * 0.5 + time * speed * 1.3) * amplitude * 0.5;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        ctx.fillStyle = color.replace('OPACITY', opacity);
        ctx.fill();
    }
    
    function draw() {
        time += 0.02;
        ctx.clearRect(0, 0, width, height);
        
        drawWave(height * 0.4, 30, 0.003, 1, 'rgba(5, 24, 56, OPACITY)', 0.3);
        drawWave(height * 0.5, 25, 0.004, 1.2, 'rgba(10, 42, 74, OPACITY)', 0.4);
        drawWave(height * 0.6, 20, 0.005, 0.8, 'rgba(26, 74, 106, OPACITY)', 0.3);
        drawWave(height * 0.7, 15, 0.006, 1.5, 'rgba(42, 106, 138, OPACITY)', 0.2);
        
        const gradient = ctx.createLinearGradient(0, height * 0.8, 0, height);
        gradient.addColorStop(0, 'rgba(0, 240, 208, 0)');
        gradient.addColorStop(1, 'rgba(0, 240, 208, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height * 0.8, width, height * 0.2);
        
        requestAnimationFrame(draw);
    }
    
    resize();
    window.addEventListener('resize', resize);
    draw();
}

// ============================================
// CURRENT MAP
// ============================================
function initCurrentMap() {
    const canvas = document.getElementById('currentMapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    let width, height;
    let time = 0;
    
    const currents = [
        { name: 'kuroshio', color: '#ff6b6b', path: [[0.1, 0.3], [0.3, 0.25], [0.5, 0.35], [0.7, 0.45]], speed: 0.5 },
        { name: 'north-equatorial', color: '#4ecdc4', path: [[0.05, 0.5], [0.25, 0.48], [0.45, 0.52], [0.65, 0.5], [0.85, 0.48]], speed: 0.3 },
        { name: 'south-equatorial', color: '#45b7d1', path: [[0.05, 0.65], [0.3, 0.62], [0.55, 0.68], [0.8, 0.65]], speed: 0.4 },
        { name: 'east-australian', color: '#96ceb4', path: [[0.75, 0.7], [0.85, 0.6], [0.9, 0.45]], speed: 0.6 },
        { name: 'peru', color: '#dfe6e9', path: [[0.2, 0.85], [0.4, 0.88], [0.6, 0.85]], speed: 0.35 }
    ];
    
    function resize() {
        const rect = container.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = 300;
    }
    
    function drawCurrent(current) {
        const points = current.path.map(p => ({
            x: p[0] * width,
            y: p[1] * height
        }));
        
        ctx.beginPath();
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = current.color + '60';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const t = ((time * current.speed + i / particleCount) % 1);
            const idx = Math.floor(t * (points.length - 1));
            const nextIdx = Math.min(idx + 1, points.length - 1);
            const localT = (t * (points.length - 1)) % 1;
            
            if (points[idx] && points[nextIdx]) {
                const x = points[idx].x + (points[nextIdx].x - points[idx].x) * localT;
                const y = points[idx].y + (points[nextIdx].y - points[idx].y) * localT;
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = current.color;
                ctx.fill();
            }
        }
    }
    
    function draw() {
        time += 0.016;
        ctx.clearRect(0, 0, width, height);
        
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, 'rgba(5, 24, 56, 0.8)');
        gradient.addColorStop(1, 'rgba(2, 5, 16, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        currents.forEach(drawCurrent);
        
        requestAnimationFrame(draw);
    }
    
    resize();
    window.addEventListener('resize', resize);
    draw();
}

// ============================================
// ISLAND VOYAGE
// ============================================
function initIslandVoyage() {
    const voyagePath = document.getElementById('voyagePath');
    const canoe = document.getElementById('voyageCanoe');
    if (!voyagePath || !canoe) return;
    
    const islands = [
        { name: 'Hawaii', x: 0.15, y: 0.2, description: 'The northern apex, birthplace of the great voyages' },
        { name: 'Tahiti', x: 0.4, y: 0.6, description: 'The heart of Polynesia, center of navigation knowledge' },
        { name: 'Rapa Nui', x: 0.7, y: 0.85, description: 'Eastern sentinel, where ocean meets sky' },
        { name: 'Aotearoa', x: 0.85, y: 0.3, description: 'The land of the long white cloud, southern frontier' },
        { name: 'Marquesas', x: 0.55, y: 0.35, description: 'Cradle of dispersal, where ancestors set forth' }
    ];
    
    let pathD = '';
    islands.forEach((island, i) => {
        const x = island.x * 1000;
        const y = island.y * 400;
        if (i === 0) pathD += 'M ' + x + ' ' + y;
        else pathD += ' L ' + x + ' ' + y;
        
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        marker.setAttribute('cx', x);
        marker.setAttribute('cy', y);
        marker.setAttribute('r', 8);
        marker.setAttribute('fill', 'var(--star-gold)');
        marker.setAttribute('stroke', 'var(--bioluminescence)');
        marker.setAttribute('stroke-width', 2);
        voyagePath.appendChild(marker);
    });
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(0, 240, 208, 0.3)');
    path.setAttribute('stroke-width', 2);
    path.setAttribute('stroke-dasharray', '5,5');
    voyagePath.appendChild(path);
    
    let progress = 0;
    function animateCanoe() {
        progress += 0.001;
        if (progress > 1) progress = 0;
        
        const totalLength = path.getTotalLength();
        const point = path.getPointAtLength(progress * totalLength);
        
        canoe.style.left = (point.x - 30) + 'px';
        canoe.style.top = (point.y - 18) + 'px';
        
        requestAnimationFrame(animateCanoe);
    }
    animateCanoe();
    
    const cardsContainer = document.getElementById('islandCards');
    if (cardsContainer) {
        islands.forEach(island => {
            const card = document.createElement('div');
            card.className = 'island-card';
            card.innerHTML = '<h4>' + island.name + '</h4><p>' + island.description + '</p>';
            cardsContainer.appendChild(card);
        });
    }
}

// ============================================
// TIKI GALLERY
// ============================================
function initTikiGallery() {
    const gallery = document.getElementById('tikiGallery');
    if (!gallery) return;
    
    const tikis = [
        { name: 'Ku', meaning: 'The Creator', role: 'God of war, fishing, and the deep forest. His fierce gaze guards the eastern horizon.' },
        { name: 'Lono', meaning: 'The Provider', role: 'God of agriculture, rain, and peace. His presence brings the life-giving storms across the Pacific.' },
        { name: 'Kane', meaning: 'The Light', role: 'God of the sun, fresh water, and life itself. His light first touched these islands.' },
        { name: 'Kanaloa', meaning: 'The Voyager', role: 'God of the ocean, underworld, and healing. He knows all the currents between the worlds.' }
    ];
    
    tikis.forEach(tiki => {
        const card = document.createElement('div');
        card.className = 'tiki-card';
        card.innerHTML = 
            '<div class="tiki-face">' +
            '<svg viewBox="0 0 120 160" style="width:100%;height:100%">' +
            '<rect x="20" y="10" width="80" height="140" rx="10" fill="var(--wood-mid)" stroke="var(--wood-dark)" stroke-width="3"/>' +
            '<ellipse cx="60" cy="50" rx="25" ry="20" fill="var(--tapa-base)"/>' +
            '<circle cx="50" cy="45" r="5" fill="var(--wood-dark)"/>' +
            '<circle cx="70" cy="45" r="5" fill="var(--wood-dark)"/>' +
            '<path d="M45,60 Q60,75 75,60" fill="none" stroke="var(--wood-dark)" stroke-width="3"/>' +
            '<rect x="35" y="80" width="50" height="40" rx="5" fill="var(--tapa-dark)"/>' +
            '<path d="M30,90 L30,130 M90,90 L90,130" stroke="var(--wood-dark)" stroke-width="4"/>' +
            '</svg></div>' +
            '<h4>' + tiki.name + '</h4>' +
            '<p><em>' + tiki.meaning + '</em></p>' +
            '<p>' + tiki.role + '</p>';
        gallery.appendChild(card);
    });
}

// ============================================
// BIOLUMINESCENT WAKE EFFECT
// ============================================
function initWakeEffect() {
    const container = document.getElementById('wakeContainer');
    if (!container) return;
    
    let particles = [];
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (Math.random() > 0.7) {
            particles.push({
                x: mouseX,
                y: mouseY,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2 - 1,
                life: 1,
                size: Math.random() * 4 + 2
            });
        }
    });
    
    function updateWake() {
        particles = particles.filter(p => p.life > 0);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            p.size *= 0.98;
        });
        
        container.innerHTML = '';
        particles.forEach(p => {
            const el = document.createElement('div');
            el.style.cssText = 
                'position:absolute;' +
                'left:' + p.x + 'px;' +
                'top:' + p.y + 'px;' +
                'width:' + p.size + 'px;' +
                'height:' + p.size + 'px;' +
                'background:rgba(0,240,208,' + (p.life * 0.6) + ');' +
                'border-radius:50%;' +
                'box-shadow:0 0 ' + (p.size * 2) + 'px rgba(0,240,208,' + (p.life * 0.3) + ');' +
                'pointer-events:none;' +
                'transform:translate(-50%,-50%);';
            container.appendChild(el);
        });
        
        requestAnimationFrame(updateWake);
    }
    updateWake();
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    const style = document.createElement('style');
    style.textContent = 'section.visible{opacity:1!important;transform:translateY(0)!important;}';
    document.head.appendChild(style);
}

// ============================================
// WAVE PATTERN GENERATION
// ============================================
function generateWavePatterns() {
    const container = document.getElementById('wavePatterns');
    if (!container) return;
    
    const patterns = [
        { name: 'Kai Koo', description: 'Storm surge, when wind and current oppose', type: 'chaotic' },
        { name: 'Kai Maku', description: 'Ground swell from distant storms', type: 'regular' },
        { name: 'Kai Hee', description: 'Swell bending around an island', type: 'bending' },
        { name: 'Kai Olu', description: 'Calm sea with gentle rolling swells', type: 'gentle' }
    ];
    
    patterns.forEach(pattern => {
        const card = document.createElement('div');
        card.className = 'wave-card';
        card.innerHTML = 
            '<div class="wave-visual ' + pattern.type + '"></div>' +
            '<h4>' + pattern.name + '</h4>' +
            '<p>' + pattern.description + '</p>';
        container.appendChild(card);
    });
}