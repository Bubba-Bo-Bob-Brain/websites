document.addEventListener('DOMContentLoaded', function() {
    initStarField();
    initStarDome();
    initOceanCanvas();
    initConstellationGame();
    initBioluminescentEffect();
    initScrollAnimations();
});

function initStarField() {
    const starField = document.getElementById('starField');
    if (!starField) return;
    
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.7 ? '#f4d03f' : '#f0f4ff'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.5};
            box-shadow: 0 0 ${Math.random() * 4 + 2}px ${Math.random() > 0.5 ? 'rgba(244, 208, 63, 0.5)' : 'rgba(240, 244, 255, 0.5)'};
            animation: twinkleStar ${Math.random() * 4 + 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        starField.appendChild(star);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkleStar {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
}

function initStarDome() {
    const starDome = document.getElementById('starDome');
    if (!starDome) return;
    
    const constellationCanvas = document.getElementById('constellationCanvas');
    const ctx = constellationCanvas.getContext('2d');
    
    function resizeCanvas() {
        const rect = starDome.getBoundingClientRect();
        constellationCanvas.width = rect.width;
        constellationCanvas.height = rect.height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const constellations = {
        orion: {
            name: 'Ka Heihei o na Keiki',
            meaning: 'The Children\'s String Game (Orion)',
            stars: [
                { x: 0.35, y: 0.15, size: 4 },
                { x: 0.45, y: 0.25, size: 3 },
                { x: 0.55, y: 0.25, size: 3 },
                { x: 0.65, y: 0.15, size: 4 },
                { x: 0.45, y: 0.45, size: 2 },
                { x: 0.50, y: 0.50, size: 2 },
                { x: 0.55, y: 0.45, size: 2 },
                { x: 0.40, y: 0.75, size: 4 },
                { x: 0.60, y: 0.75, size: 4 }
            ],
            lines: [
                [0, 1], [1, 2], [2, 3],
                [1, 4], [4, 5], [5, 6], [6, 2],
                [4, 7], [6, 8]
            ]
        },
        scorpius: {
            name: 'Maui\'s Fishhook',
            meaning: 'The Hook that Raised the Islands',
            stars: [
                { x: 0.20, y: 0.35, size: 4 },
                { x: 0.25, y: 0.45, size: 3 },
                { x: 0.30, y: 0.55, size: 3 },
                { x: 0.38, y: 0.60, size: 4 },
                { x: 0.48, y: 0.62, size: 3 },
                { x: 0.58, y: 0.58, size: 3 },
                { x: 0.68, y: 0.52, size: 2 },
                { x: 0.75, y: 0.58, size: 3 },
                { x: 0.82, y: 0.65, size: 4 }
            ],
            lines: [
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]
            ]
        },
        southernCross: {
            name: 'Hano Kai',
            meaning: 'The Sea Arch (Southern Cross)',
            stars: [
                { x: 0.42, y: 0.55, size: 4 },
                { x: 0.45, y: 0.65, size: 3 },
                { x: 0.48, y: 0.75, size: 4 },
                { x: 0.38, y: 0.65, size: 3 },
                { x: 0.52, y: 0.65, size: 3 }
            ],
            lines: [
                [0, 1], [1, 2], [3, 1], [1, 4]
            ]
        }
    };
    
    let rotation = 0;
    let targetRotation = 0;
    let currentConstellation = 'orion';
    
    starDome.addEventListener('mousemove', function(e) {
        const rect = starDome.getBoundingClientRect();
        const centerX = rect.width / 2;
        const mouseX = e.clientX - rect.left;
        targetRotation = (mouseX - centerX) / centerX * 15;
    });
    
    starDome.addEventListener('mouseleave', function() {
        targetRotation = 0;
    });
    
    const compassPoints = document.querySelectorAll('.compass-point');
    compassPoints.forEach(point => {
        point.addEventListener('click', function() {
            const house = this.dataset.house;
            if (house.includes('Akau')) {
                currentConstellation = 'orion';
            } else if (house.includes('Hema')) {
                currentConstellation = 'scorpius';
            } else {
                currentConstellation = 'southernCross';
            }
        });
    });
    
    function drawConstellations() {
        ctx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);
        
        const constellation = constellations[currentConstellation];
        const centerX = constellationCanvas.width / 2;
        const centerY = constellationCanvas.height / 2;
        
        const transform = {
            rotate: rotation * Math.PI / 180,
            centerX: centerX,
            centerY: centerY
        };
        
        function transformPoint(x, y) {
            const rx = x - 0.5;
            const ry = y - 0.5;
            const cos = Math.cos(transform.rotate);
            const sin = Math.sin(transform.rotate);
            return {
                x: (rx * cos - ry * sin + 0.5) * constellationCanvas.width,
                y: (rx * sin + ry * cos + 0.5) * constellationCanvas.height
            };
        }
        
        ctx.save();
        
        const time = Date.now() / 1000;
        
        constellation.lines.forEach(line => {
            const start = transformPoint(constellation.stars[line[0]].x, constellation.stars[line[0]].y);
            const end = transformPoint(constellation.stars[line[1]].x, constellation.stars[line[1]].y);
            
            const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            gradient.addColorStop(0, 'rgba(212, 165, 116, 0.3)');
            gradient.addColorStop(0.5, 'rgba(212, 165, 116, 0.6)');
            gradient.addColorStop(1, 'rgba(212, 165, 116, 0.3)');
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        
        constellation.stars.forEach((star, index) => {
            const pos = transformPoint(star.x, star.y);
            const pulse = Math.sin(time * 2 + index) * 0.3 + 1;
            const size = star.size * pulse;
            
            const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 4);
            glow.addColorStop(0, 'rgba(244, 208, 63, 0.8)');
            glow.addColorStop(0.3, 'rgba(212, 165, 116, 0.4)');
            glow.addColorStop(1, 'rgba(212, 165, 116, 0)');
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size * 4, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
            ctx.fillStyle = '#f4d03f';
            ctx.fill();
        });
        
        ctx.restore();
        
        rotation += (targetRotation - rotation) * 0.05;
        
        requestAnimationFrame(drawConstellations);
    }
    
    drawConstellations();
}

function initOceanCanvas() {
    const canvas = document.getElementById('oceanCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const waves = [];
    const waveCount = 8;
    
    for (let i = 0; i < waveCount; i++) {
        waves.push({
            amplitude: Math.random() * 20 + 10,
            frequency: Math.random() * 0.02 + 0.01,
            speed: Math.random() * 0.5 + 0.3,
            phase: Math.random() * Math.PI * 2,
            yOffset: (canvas.height / waveCount) * i + 50,
            color: `rgba(0, ${150 + i * 10}, ${170 + i * 10}, ${0.3 - i * 0.03})`
        });
    }
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.3 - 0.15,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    let time = 0;
    
    function drawOcean() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0d1f3c');
        gradient.addColorStop(0.5, '#0a1628');
        gradient.addColorStop(1, '#061018');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        waves.forEach((wave, index) => {
            ctx.beginPath();
            ctx.moveTo(0, wave.yOffset);
            
            for (let x = 0; x <= canvas.width; x += 5) {
                const y = wave.yOffset + 
                    Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
                    Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7) * wave.amplitude * 0.5;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fillStyle = wave.color;
            ctx.fill();
        });
        
        ctx.globalCompositeOperation = 'screen';
        particles.forEach(particle => {
            const glow = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 8
            );
            glow.addColorStop(0, `rgba(0, 255, 204, ${particle.opacity})`);
            glow.addColorStop(0.5, `rgba(0, 212, 170, ${particle.opacity * 0.5})`);
            glow.addColorStop(1, 'rgba(0, 212, 170, 0)');
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 8, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
            
            particle.x += particle.speedX + Math.sin(time * 0.5 + particle.y * 0.01) * 0.3;
            particle.y += particle.speedY + Math.cos(time * 0.3 + particle.x * 0.01) * 0.2;
            
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
        });
        ctx.globalCompositeOperation = 'source-over';
        
        time += 0.02;
        requestAnimationFrame(drawOcean);
    }
    
    drawOcean();
    
    const swellIndicators = document.querySelectorAll('.swell-indicator');
    swellIndicators.forEach((indicator, index) => {
        const arrow = indicator.querySelector('.swell-arrow');
        if (arrow) {
            setInterval(() => {
                const rotation = Math.sin(Date.now() / 1000 + index) * 15;
                arrow.style.transform = `rotate(${rotation}deg)`;
            }, 50);
        }
    });
}

function initConstellationGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resetBtn = document.getElementById('resetGame');
    const revealBtn = document.getElementById('revealConstellation');
    const revealDiv = document.getElementById('constellationReveal');
    
    function resize() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = Math.min(rect.height, 500);
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const constellations = [
        {
            name: 'Hokupa\'a',
            meaning: 'The North Star - The star that never moves, guiding voyagers north',
            stars: generatePolaris()
        },
        {
            name: 'Hokule\'a',
            meaning: 'Star of Gladness - Arcturus, which passes directly over Hawaii',
            stars: generateArcturus()
        },
        {
            name: 'Ka Makau',
            meaning: 'The Fishhook - Maui\'s magical hook that raised the islands',
            stars: generateFishhook()
        }
    ];
    
    function generatePolaris() {
        const stars = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        stars.push({ x: centerX, y: centerY * 0.3, size: 8, name: 'Polaris' });
        
        for (let i = 0; i < 7; i++) {
            const angle = (i / 7) * Math.PI * 2;
            const radius = 80;
            stars.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                size: 4,
                name: `Star ${i + 1}`
            });
        }
        return stars;
    }
    
    function generateArcturus() {
        const stars = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        stars.push({ x: centerX - 60, y: centerY - 100, size: 5, name: 'Arcturus' });
        stars.push({ x: centerX - 30, y: centerY - 60, size: 4, name: 'Star 2' });
        stars.push({ x: centerX, y: centerY - 20, size: 6, name: 'Star 3' });
        stars.push({ x: centerX + 30, y: centerY + 20, size: 4, name: 'Star 4' });
        stars.push({ x: centerX + 60, y: centerY + 60, size: 5, name: 'Star 5' });
        stars.push({ x: centerX + 90, y: centerY + 100, size: 3, name: 'Star 6' });
        
        return stars;
    }
    
    function generateFishhook() {
        const stars = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        stars.push({ x: centerX - 80, y: centerY - 80, size: 6, name: 'Hook Top' });
        stars.push({ x: centerX - 60, y: centerY - 40, size: 4, name: 'Star 2' });
        stars.push({ x: centerX - 40, y: centerY, size: 5, name: 'Star 3' });
        stars.push({ x: centerX - 20, y: centerY + 40, size: 4, name: 'Star 4' });
        stars.push({ x: centerX + 20, y: centerY + 60, size: 5, name: 'Star 5' });
        stars.push({ x: centerX + 60, y: centerY + 50, size: 4, name: 'Star 6' });
        stars.push({ x: centerX + 80, y: centerY + 80, size: 6, name: 'Hook Point' });
        
        return stars;
    }
    
    let currentConstellation = constellations[Math.floor(Math.random() * constellations.length)];
    let stars = currentConstellation.stars;
    let selectedStars = [];
    let hoveredStar = null;
    let revealed = false;
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        hoveredStar = null;
        stars.forEach((star, index) => {
            const dist = Math.hypot(star.x - mouseX, star.y - mouseY);
            if (dist < star.size * 3) {
                hoveredStar = index;
            }
        });
        
        canvas.style.cursor = hoveredStar !== null ? 'pointer' : 'crosshair';
    });
    
    canvas.addEventListener('click', function(e) {
        if (revealed) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        stars.forEach((star, index) => {
            const dist = Math.hypot(star.x - mouseX, star.y - mouseY);
            if (dist < star.size * 3 && !selectedStars.includes(index)) {
                selectedStars.push(index);
            }
        });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            selectedStars = [];
            revealed = false;
            if (revealDiv) {
                revealDiv.classList.remove('visible');
            }
            currentConstellation = constellations[Math.floor(Math.random() * constellations.length)];
            stars = currentConstellation.stars;
        });
    }
    
    if (revealBtn) {
        revealBtn.addEventListener('click', function() {
            revealed = true;
            selectedStars = stars.map((_, i) => i);
            if (revealDiv) {
                const nameEl = revealDiv.querySelector('.reveal-name');
                const meaningEl = revealDiv.querySelector('.reveal-meaning');
                if (nameEl) nameEl.textContent = currentConstellation.name;
                if (meaningEl) meaningEl.textContent = currentConstellation.meaning;
                revealDiv.classList.add('visible');
            }
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const bgGradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        bgGradient.addColorStop(0, '#1a3a5c');
        bgGradient.addColorStop(1, '#061018');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 1.5,
                0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(240, 244, 255, ${Math.random() * 0.5})`;
            ctx.fill();
        }
        
        if (selectedStars.length > 1) {
            ctx.beginPath();
            ctx.moveTo(stars[selectedStars[0]].x, stars[selectedStars[0]].y);
            
            for (let i = 1; i < selectedStars.length; i++) {
                const star = stars[selectedStars[i]];
                ctx.lineTo(star.x, star.y);
            }
            
            ctx.strokeStyle = 'rgba(0, 255, 204, 0.8)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        stars.forEach((star, index) => {
            const isSelected = selectedStars.includes(index);
            const isHovered = hoveredStar === index;
            const size = isHovered ? star.size * 1.5 : star.size;
            
            const glow = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, size * 4
            );
            
            if (isSelected) {
                glow.addColorStop(0, 'rgba(0, 255, 204, 0.9)');
                glow.addColorStop(0.3, 'rgba(0, 212, 170, 0.5)');
                glow.addColorStop(1, 'rgba(0, 212, 170, 0)');
            } else {
                glow.addColorStop(0, 'rgba(244, 208, 63, 0.8)');
                glow.addColorStop(0.3, 'rgba(212, 165, 116, 0.4)');
                glow.addColorStop(1, 'rgba(212, 165, 116, 0)');
            }
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, size * 4, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
            ctx.fillStyle = isSelected ? '#00ffcc' : '#f4d03f';
            ctx.fill();
            
            if (isHovered && !isSelected) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, size * 2.5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(244, 208, 63, 0.6)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

function initBioluminescentEffect() {
    const layer = document.getElementById('bioluminescent');
    if (!layer) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
    layer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const trails = [];
    const maxTrails = 30;
    
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const speed = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
        
        if (speed > 5) {
            const trail = {
                x: mouseX,
                y: mouseY,
                size: Math.min(speed * 0.3, 15),
                life: 1,
                decay: 0.02
            };
            
            trails.push(trail);
            
            if (trails.length > maxTrails) {
                trails.shift();
            }
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        
        layer.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', function() {
        layer.style.opacity = '0';
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = trails.length - 1; i >= 0; i--) {
            const trail = trails[i];
            
            const gradient = ctx.createRadialGradient(
                trail.x, trail.y, 0,
                trail.x, trail.y, trail.size * 3
            );
            gradient.addColorStop(0, `rgba(0, 255, 204, ${trail.life * 0.8})`);
            gradient.addColorStop(0.4, `rgba(0, 212, 170, ${trail.life * 0.4})`);
            gradient.addColorStop(1, 'rgba(0, 212, 170, 0)');
            
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, trail.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 255, 240, ${trail.life})`;
            ctx.fill();
            
            trail.life -= trail.decay;
            trail.size *= 0.98;
            
            if (trail.life <= 0) {
                trails.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const style = document.createElement('style');
    style.textContent = `
        .star-path-card,
        .knowledge-card,
        .island-group,
        .chant-line {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .star-path-card.animate-in,
        .knowledge-card.animate-in,
        .island-group.animate-in,
        .chant-line.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .star-path-card:nth-child(1) { transition-delay: 0s; }
        .star-path-card:nth-child(2) { transition-delay: 0.15s; }
        .star-path-card:nth-child(3) { transition-delay: 0.3s; }
        .star-path-card:nth-child(4) { transition-delay: 0.45s; }
        
        .chant-line:nth-child(1) { transition-delay: 0s; }
        .chant-line:nth-child(2) { transition-delay: 0.2s; }
        .chant-line:nth-child(3) { transition-delay: 0.4s; }
        .chant-line:nth-child(4) { transition-delay: 0.6s; }
    `;
    document.head.appendChild(style);
    
    document.querySelectorAll('.star-path-card, .knowledge-card, .island-group, .chant-line').forEach(el => {
        observer.observe(el);
    });
    
    const islandNodes = document.querySelectorAll('.island-node');
    islandNodes.forEach(node => {
        node.addEventListener('click', function() {
            const island = this.dataset.island;
            const name = this.querySelector('.island-name').textContent;
            
            const popup = document.createElement('div');
            popup.className = 'island-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <h4>${name}</h4>
                    <p>A sacred waypoint on the ancient voyaging routes</p>
                    <button class="popup-close">Close</button>
                </div>
            `;
            
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(145deg, rgba(13, 31, 60, 0.98) 0%, rgba(6, 16, 24, 0.98) 100%);
                border: 2px solid rgba(212, 165, 116, 0.5);
                border-radius: 16px;
                padding: 2rem;
                z-index: 10000;
                box-shadow: 0 0 60px rgba(0, 212, 170, 0.3);
                animation: popIn 0.3s ease;
            `;
            
            const popupStyle = document.createElement('style');
            popupStyle.textContent = `
                @keyframes popIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                .popup-content h4 {
                    font-family: 'Cinzel Decorative', serif;
                    font-size: 1.5rem;
                    color: #d4a574;
                    margin-bottom: 1rem;
                }
                .popup-content p {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1rem;
                    color: #e8d5b7;
                    margin-bottom: 1.5rem;
                }
                .popup-close {
                    font-family: 'Quicksand', sans-serif;
                    background: transparent;
                    border: 1px solid #00d4aa;
                    color: #00d4aa;
                    padding: 0.5rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .popup-close:hover {
                    background: #00d4aa;
                    color: #061018;
                }
            `;
            document.head.appendChild(popupStyle);
            
            document.body.appendChild(popup);
            
            popup.querySelector('.popup-close').addEventListener('click', () => {
                popup.remove();
            });
            
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.remove();
                }
            });
        });
    });
    
    const tikiMarkers = document.querySelectorAll('.tiki-marker');
    tikiMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const direction = this.dataset.direction;
            const label = this.parentElement.querySelector('.marker-label').textContent;
            
            const eyes = this.querySelectorAll('.tiki-eye');
            eyes.forEach(eye => {
                eye.style.animation = 'none';
                eye.offsetHeight;
                eye.style.animation = 'eyeFlash 0.5s ease 3';
            });
        });
    });
    
    const eyeFlashStyle = document.createElement('style');
    eyeFlashStyle.textContent = `
        @keyframes eyeFlash {
            0%, 100% { fill: #00d4aa; }
            50% { fill: #00ffcc; filter: drop-shadow(0 0 20px #00ffcc); }
        }
    `;
    document.head.appendChild(eyeFlashStyle);
}