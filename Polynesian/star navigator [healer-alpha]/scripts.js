// ============================================
// POLYNESIAN CELESTIAL WAYFINDING CHART
// JavaScript - Interactive Navigation System
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    initLoadingScreen();
    initStarField();
    initOceanCanvas();
    initBioluminescence();
    initConstellationCanvas();
    initIslandMap();
    initStarDome();
    initNavigation();
    initInfoPanel();
    initCursorTrail();
    initWavePatterns();
    initCompassInteraction();
});

// ============================================
// GLOBAL STATE
// ============================================
var state = {
    mouseX: 0,
    mouseY: 0,
    currentView: 'chart',
    selectedConstellation: null,
    isLoaded: false,
    stars: [],
    islands: [],
    constellations: [],
    oceanCurrents: [],
    animationFrame: null,
    constellationLines: []
};

// ============================================
// POLYNESIAN CELESTIAL DATA
// ============================================
var polynesianStars = [
    { name: "Hōkūleʻa", english: "Arcturus", ra: 14, dec: 19, magnitude: 1, importance: "primary", description: "The star of gladness - primary navigation star for Hawaii" },
    { name: "Aʻa", english: "Sirius", ra: 7, dec: -17, magnitude: 0, importance: "primary", description: "Brightest star in the sky, used for southern navigation" },
    { name: "Hōkūpaʻa", english: "Polaris", ra: 3, dec: 89, magnitude: 2, importance: "primary", description: "The fixed star - points true north" },
    { name: "Makaliʻi", english: "Pleiades", ra: 4, dec: 24, magnitude: 2, importance: "secondary", description: "The eyes of royalty - rising marks new year" },
    { name: "Kaulua", english: "Regulus", ra: 10, dec: 12, magnitude: 1, importance: "primary", description: "The royal star of the Hawaiian archipelago" },
    { name: "Hōkūao", english: "Canopus", ra: 6, dec: -53, magnitude: 0, importance: "primary", description: "Second brightest star, crucial for southern voyaging" },
    { name: "Nā Hōkū Loa", english: "Castor & Pollux", ra: 7, dec: 32, magnitude: 1, importance: "secondary", description: "The long stars - used for latitude determination" },
    { name: "Puana", english: "Spica", ra: 13, dec: -11, magnitude: 1, importance: "secondary", description: "The flower - important zenith star" },
    { name: "Hōkūleʻa2", english: "Vega", ra: 19, dec: 39, magnitude: 0, importance: "primary", description: "The diving eagle - northern hemisphere guide" },
    { name: "Ka Mōʻī", english: "Altair", ra: 20, dec: 9, magnitude: 1, importance: "secondary", description: "The royal - part of the navigator's triangle" },
    { name: "Hokuloa", english: "Antares", ra: 17, dec: -26, magnitude: 1, importance: "primary", description: "Heart of the scorpion - equatorial marker" },
    { name: "Nā Kau A ʻEha", english: "Southern Cross", ra: 13, dec: -60, magnitude: 1, importance: "primary", description: "The four-legged constellation - southern pole indicator" }
];

var polynesianIslands = [
    { name: "Hawaiʻi", x: 15, y: 25, type: "volcanic", description: "The Big Island - largest in the Hawaiian chain, home to active volcanoes" },
    { name: "Oʻahu", x: 18, y: 28, type: "volcanic", description: "The Gathering Place - central island of Hawaiian archipelago" },
    { name: "Maui", x: 16, y: 27, type: "volcanic", description: "The Valley Isle - known for Haleakalā volcano" },
    { name: "Kauaʻi", x: 20, y: 24, type: "volcanic", description: "The Garden Isle - oldest main Hawaiian island" },
    { name: "Tahiti", x: 55, y: 65, type: "volcanic", description: "The Queen Island - center of Polynesian culture" },
    { name: "Mo'orea", x: 53, y: 63, type: "volcanic", description: "The Magical Island - visible from Tahiti" },
    { name: "Rarotonga", x: 65, y: 70, type: "volcanic", description: "The Cook Islands - heart of Cook Islands group" },
    { name: "Aotearoa", x: 85, y: 85, type: "volcanic", description: "New Zealand - the great southern homeland" },
    { name: "Rapa Nui", x: 30, y: 80, type: "volcanic", description: "Easter Island - most remote inhabited island" },
    { name: "Fiji", x: 75, y: 60, type: "volcanic", description: "Crossroads of the Pacific - meeting place of voyagers" },
    { name: "Samoa", x: 70, y: 55, type: "volcanic", description: "The Navigator Islands - cradle of Polynesian voyaging" },
    { name: "Tonga", x: 78, y: 68, type: "atoll", description: "The Friendly Islands - kingdom of the Pacific" },
    { name: "Marquesas", x: 40, y: 50, type: "volcanic", description: "The Dangerous Islands - remote volcanic paradise" },
    { name: "Tuamotu", x: 50, y: 60, type: "atoll", description: "The Chain of Pearls - largest atoll group" },
    { name: "Nihoa", x: 14, y: 22, type: "atoll", description: "Bird Island - northwestern Hawaiian island" },
    { name: "Necker", x: 12, y: 20, type: "atoll", description: "Mokumanamana - sacred island of ceremony" }
];

var oceanCurrents = [
    { name: "North Pacific Current", startX: 10, startY: 30, endX: 50, endY: 35, speed: 0.5 },
    { name: "Equatorial Current", startX: 10, startY: 50, endX: 70, endY: 55, speed: 0.8 },
    { name: "South Pacific Current", startX: 40, startY: 70, endX: 90, endY: 75, speed: 0.6 },
    { name: "Hawaiian Lee Current", startX: 15, startY: 35, endX: 25, endY: 45, speed: 0.4 }
];

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(function() {
        state.isLoaded = true;
        loadingScreen.classList.add('hidden');
        
        setTimeout(function() {
            startMainAnimations();
        }, 500);
    }, 3000);
}

function startMainAnimations() {
    updateView(state.currentView);
    
    var islands = document.querySelectorAll('.island');
    islands.forEach(function(island, index) {
        setTimeout(function() {
            island.classList.add('fade-in');
        }, index * 100);
    });
}

// ============================================
// STAR FIELD CANVAS
// ============================================
function initStarField() {
    var canvas = document.getElementById('starfield');
    var ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    var stars = [];
    var i;
    for (i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            color: getStarColor()
        });
    }
    
    function getStarColor() {
        var colors = [
            'rgba(255, 248, 231, 1)',
            'rgba(255, 228, 181, 1)',
            'rgba(184, 212, 232, 1)',
            'rgba(255, 255, 255, 1)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width
        );
        gradient.addColorStop(0, '#0a1628');
        gradient.addColorStop(0.5, '#060d1a');
        gradient.addColorStop(1, '#030810');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawNebula(ctx, canvas);
        
        stars.forEach(function(star) {
            star.twinkle += star.twinkleSpeed;
            var opacity = 0.5 + Math.sin(star.twinkle) * 0.5;
            
            var parallaxX = (state.mouseX - canvas.width / 2) * 0.01 * star.speed;
            var parallaxY = (state.mouseY - canvas.height / 2) * 0.01 * star.speed;
            
            ctx.beginPath();
            ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color.replace('1)', opacity + ')');
            ctx.fill();
            
            if (star.size > 1.5) {
                ctx.beginPath();
                ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size * 3, 0, Math.PI * 2);
                var glowGradient = ctx.createRadialGradient(
                    star.x + parallaxX, star.y + parallaxY, 0,
                    star.x + parallaxX, star.y + parallaxY, star.size * 3
                );
                glowGradient.addColorStop(0, 'rgba(255, 248, 231, ' + (opacity * 0.3) + ')');
                glowGradient.addColorStop(1, 'rgba(255, 248, 231, 0)');
                ctx.fillStyle = glowGradient;
                ctx.fill();
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function drawNebula(ctx, canvas) {
    var nebulae = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, size: 200, color: 'rgba(30, 60, 100, 0.1)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, size: 250, color: 'rgba(50, 30, 80, 0.08)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, size: 180, color: 'rgba(0, 50, 60, 0.1)' }
    ];
    
    nebulae.forEach(function(nebula) {
        var gradient = ctx.createRadialGradient(
            nebula.x, nebula.y, 0,
            nebula.x, nebula.y, nebula.size
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
}

// ============================================
// OCEAN CANVAS
// ============================================
function initOceanCanvas() {
    var canvas = document.getElementById('ocean-canvas');
    var ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    var time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var i;
        for (i = 0; i < 5; i++) {
            drawWave(ctx, canvas, time + i * 0.5, i);
        }
        
        drawCurrents(ctx, canvas, time);
        
        time += 0.02;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function drawWave(ctx, canvas, time, index) {
    var amplitude = 20 + index * 5;
    var frequency = 0.005 - index * 0.0005;
    var yOffset = canvas.height * (0.3 + index * 0.15);
    var opacity = 0.1 - index * 0.015;
    var x, y;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    
    for (x = 0; x <= canvas.width; x += 5) {
        y = yOffset + Math.sin(x * frequency + time) * amplitude + Math.sin(x * frequency * 2 + time * 1.5) * amplitude * 0.5;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    
    var gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(30, 70, 120, ' + opacity + ')');
    gradient.addColorStop(1, 'rgba(10, 30, 60, ' + (opacity * 0.5) + ')');
    
    ctx.fillStyle = gradient;
    ctx.fill();
}

function drawCurrents(ctx, canvas, time) {
    var currents = [
        { startX: 0.1, startY: 0.3, angle: 0.1 },
        { startX: 0.0, startY: 0.5, angle: 0.05 },
        { startX: 0.3, startY: 0.7, angle: 0.15 }
    ];
    
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
    ctx.lineWidth = 2;
    
    currents.forEach(function(current) {
        var startX = current.startX * canvas.width;
        var startY = current.startY * canvas.height;
        var i, x, y;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        for (i = 0; i < 50; i++) {
            x = startX + i * 10 + Math.sin(time + i * 0.2) * 5;
            y = startY + Math.sin(current.angle * i + time) * 20;
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
    });
}

// ============================================
// BIOLUMINESCENCE EFFECT
// ============================================
function initBioluminescence() {
    var canvas = document.getElementById('bioluminescence');
    var ctx = canvas.getContext('2d');
    var particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    document.addEventListener('mousemove', function(e) {
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        
        var i;
        for (i = 0; i < 2; i++) {
            particles.push({
                x: e.clientX + (Math.random() - 0.5) * 20,
                y: e.clientY + (Math.random() - 0.5) * 20,
                size: Math.random() * 4 + 2,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var i, p, gradient;
        for (i = particles.length - 1; i >= 0; i--) {
            p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            p.vx *= 0.98;
            p.vy *= 0.98;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, 'rgba(0, 229, 255, ' + (p.life * 0.8) + ')');
            gradient.addColorStop(0.5, 'rgba(0, 255, 204, ' + (p.life * 0.4) + ')');
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        if (particles.length > 100) {
            particles.splice(0, particles.length - 100);
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// CONSTELLATION CANVAS
// ============================================
function initConstellationCanvas() {
    var canvas = document.getElementById('constellation-canvas');
    var ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    state.constellationLines = [];
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        state.constellationLines.forEach(function(line) {
            drawConstellationLine(ctx, line);
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function drawConstellationLine(ctx, line) {
    var gradient = ctx.createLinearGradient(line.startX, line.startY, line.endX, line.endY);
    gradient.addColorStop(0, 'rgba(184, 212, 232, 0.6)');
    gradient.addColorStop(0.5, 'rgba(184, 212, 232, 0.3)');
    gradient.addColorStop(1, 'rgba(184, 212, 232, 0.6)');
    
    ctx.beginPath();
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    drawConstellationStar(ctx, line.startX, line.startY);
    drawConstellationStar(ctx, line.endX, line.endY);
}

function drawConstellationStar(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 248, 231, 0.9)';
    ctx.fill();
    
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
    gradient.addColorStop(0, 'rgba(255, 248, 231, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 248, 231, 0)');
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}

// ============================================
// ISLAND MAP
// ============================================
function initIslandMap() {
    var islandGroups = document.getElementById('island-groups');
    var oceanCurrentsEl = document.getElementById('ocean-currents');
    
    polynesianIslands.forEach(function(island) {
        var islandEl = document.createElement('div');
        islandEl.className = 'island island-' + island.type;
        islandEl.style.left = island.x + '%';
        islandEl.style.top = island.y + '%';
        islandEl.dataset.name = island.name;
        islandEl.dataset.description = island.description;
        islandEl.dataset.type = island.type;
        
        var label = document.createElement('span');
        label.className = 'island-label';
        label.textContent = island.name;
        islandEl.appendChild(label);
        
        islandEl.addEventListener('mouseenter', function() {
            var typeName = island.type === 'volcanic' ? 'Volcanic High Island' : 'Coral Atoll';
            showInfoPanel(island.name, island.description, 'Type: ' + typeName);
            islandEl.style.transform = 'scale(1.2)';
            islandEl.style.zIndex = '100';
        });
        
        islandEl.addEventListener('mouseleave', function() {
            hideInfoPanel();
            islandEl.style.transform = '';
            islandEl.style.zIndex = '';
        });
        
        islandGroups.appendChild(islandEl);
        state.islands.push({ name: island.name, x: island.x, y: island.y, type: island.type, description: island.description, element: islandEl });
    });
    
    oceanCurrents.forEach(function(current, index) {
        var currentEl = document.createElement('div');
        currentEl.className = 'ocean-current';
        currentEl.style.left = current.startX + '%';
        currentEl.style.top = current.startY + '%';
        
        var angle = Math.atan2(
            (current.endY - current.startY) * 6,
            (current.endX - current.startX) * 12
        ) * (180 / Math.PI);
        
        var length = Math.sqrt(
            Math.pow((current.endX - current.startX) * 12, 2) +
            Math.pow((current.endY - current.startY) * 6, 2)
        );
        
        currentEl.style.transform = 'rotate(' + angle + 'deg)';
        
        var arrow = document.createElement('div');
        arrow.className = 'current-arrow';
        arrow.style.width = length + 'px';
        arrow.style.animationDelay = (index * 0.5) + 's';
        
        currentEl.appendChild(arrow);
        oceanCurrentsEl.appendChild(currentEl);
    });
}

// ============================================
// STAR DOME (PARALLAX)
// ============================================
function initStarDome() {
    var starDome = document.getElementById('star-dome');
    
    polynesianStars.forEach(function(star, index) {
        var starEl = document.createElement('div');
        starEl.className = 'star-point';
        if (star.importance === 'primary') {
            starEl.classList.add('bright');
        }
        
        var x = (star.ra / 24) * 100;
        var y = ((90 - star.dec) / 180) * 100;
        
        starEl.style.left = x + '%';
        starEl.style.top = y + '%';
        starEl.style.animationDelay = (index * 0.2) + 's';
        
        if (star.magnitude === 0) {
            starEl.classList.add('warm');
        } else if (star.magnitude === 2) {
            starEl.classList.add('cool');
        }
        
        starEl.dataset.name = star.name;
        starEl.dataset.english = star.english;
        starEl.dataset.description = star.description;
        
        starEl.addEventListener('mouseenter', function() {
            var importType = star.importance === 'primary' ? 'Primary Navigation Star' : 'Secondary Reference';
            showInfoPanel(star.name + ' (' + star.english + ')', star.description, 'Magnitude: ' + star.magnitude + ' | Type: ' + importType);
            starEl.style.transform = 'scale(2)';
        });
        
        starEl.addEventListener('mouseleave', function() {
            hideInfoPanel();
            starEl.style.transform = '';
        });
        
        starDome.appendChild(starEl);
        state.stars.push({ name: star.name, english: star.english, ra: star.ra, dec: star.dec, element: starEl });
    });
    
    document.addEventListener('mousemove', function(e) {
        var centerX = window.innerWidth / 2;
        var centerY = window.innerHeight / 2;
        var moveX = (e.clientX - centerX) / centerX;
        var moveY = (e.clientY - centerY) / centerY;
        
        starDome.style.transform = 'perspective(1000px) rotateY(' + (moveX * 5) + 'deg) rotateX(' + (-moveY * 5) + 'deg)';
        
        state.stars.forEach(function(star, index) {
            var depth = (index % 3 + 1) * 0.5;
            var offsetX = moveX * 20 * depth;
            var offsetY = moveY * 20 * depth;
            
            if (star.element) {
                star.element.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';
            }
        });
    });
}

// ============================================
// NAVIGATION SYSTEM
// ============================================
function initNavigation() {
    var navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var view = btn.dataset.view;
            
            navButtons.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            updateView(view);
        });
    });
}

function updateView(view) {
    state.currentView = view;
    document.body.dataset.view = view;
    
    state.constellationLines = [];
    
    var starDome = document.getElementById('star-dome');
    var islandMap = document.getElementById('island-map');
    var constellationLayer = document.getElementById('constellation-layer');
    
    if (view === 'chart') {
        starDome.style.opacity = '1';
        islandMap.style.opacity = '1';
        constellationLayer.style.pointerEvents = 'none';
    } else if (view === 'constellations') {
        starDome.style.opacity = '0.8';
        islandMap.style.opacity = '0.5';
        constellationLayer.style.pointerEvents = 'auto';
        initConstellationInteraction();
    } else if (view === 'islands') {
        starDome.style.opacity = '0.3';
        islandMap.style.opacity = '1';
        highlightIslandRoutes();
    } else if (view === 'ocean') {
        starDome.style.opacity = '0.2';
        islandMap.style.opacity = '0.7';
        highlightOceanCurrents();
    }
}

// ============================================
// CONSTELLATION INTERACTION
// ============================================
function initConstellationInteraction() {
    var layer = document.getElementById('constellation-layer');
    layer.innerHTML = '';
    
    polynesianStars.slice(0, 8).forEach(function(star, index) {
        var starEl = document.createElement('div');
        starEl.className = 'constellation-star';
        
        var x = (star.ra / 24) * 80 + 10;
        var y = ((90 - star.dec) / 180) * 80 + 10;
        
        starEl.style.left = x + '%';
        starEl.style.top = y + '%';
        starEl.dataset.index = index;
        starEl.dataset.star = star.name;
        
        starEl.addEventListener('click', function() {
            toggleConstellationStar(starEl, index);
        });
        
        starEl.addEventListener('mouseenter', function() {
            showInfoPanel(star.name, star.description, 'Click to connect constellation stars');
        });
        
        starEl.addEventListener('mouseleave', function() {
            hideInfoPanel();
        });
        
        layer.appendChild(starEl);
    });
}

function toggleConstellationStar(element, index) {
    element.classList.toggle('active');
    
    var activeStars = document.querySelectorAll('.constellation-star.active');
    
    if (activeStars.length >= 2) {
        state.constellationLines = [];
        
        activeStars.forEach(function(star1, i) {
            activeStars.forEach(function(star2, j) {
                if (i < j) {
                    var rect1 = star1.getBoundingClientRect();
                    var rect2 = star2.getBoundingClientRect();
                    
                    state.constellationLines.push({
                        startX: rect1.left + rect1.width / 2,
                        startY: rect1.top + rect1.height / 2,
                        endX: rect2.left + rect2.width / 2,
                        endY: rect2.top + rect2.height / 2
                    });
                }
            });
        });
    } else {
        state.constellationLines = [];
    }
}

// ============================================
// ISLAND ROUTES HIGHLIGHTING
// ============================================
function highlightIslandRoutes() {
    state.islands.forEach(function(island) {
        if (island.element) {
            island.element.style.animation = 'pulse 2s ease-in-out infinite';
            setTimeout(function() {
                island.element.style.animation = '';
            }, 2000);
        }
    });
}

// ============================================
// OCEAN CURRENTS HIGHLIGHTING
// ============================================
function highlightOceanCurrents() {
    var currents = document.querySelectorAll('.ocean-current');
    currents.forEach(function(current, index) {
        current.style.opacity = '1';
        var arrow = current.querySelector('.current-arrow');
        if (arrow) {
            arrow.style.animation = 'currentFlow 1.5s ease-in-out infinite ' + (index * 0.3) + 's';
        }
    });
}

// ============================================
// INFO PANEL
// ============================================
function initInfoPanel() {
    hideInfoPanel();
}

function showInfoPanel(title, description, details) {
    var panel = document.getElementById('info-panel');
    var titleEl = document.getElementById('info-title');
    var descEl = document.getElementById('info-description');
    var detailsEl = document.getElementById('info-details');
    
    titleEl.textContent = title;
    descEl.textContent = description;
    detailsEl.textContent = details;
    
    panel.classList.add('visible');
}

function hideInfoPanel() {
    var panel = document.getElementById('info-panel');
    panel.classList.remove('visible');
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
function initCursorTrail() {
    var trailContainer = document.getElementById('cursor-trail');
    var lastX = 0;
    var lastY = 0;
    
    document.addEventListener('mousemove', function(e) {
        var distance = Math.sqrt(
            Math.pow(e.clientX - lastX, 2) + 
            Math.pow(e.clientY - lastY, 2)
        );
        
        if (distance > 30) {
            createTrailParticle(trailContainer, e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
}

function createTrailParticle(container, x, y) {
    var particle = document.createElement('div');
    particle.className = 'trail-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    container.appendChild(particle);
    
    setTimeout(function() {
        particle.remove();
    }, 1000);
}

// ============================================
// WAVE PATTERNS
// ============================================
function initWavePatterns() {
    var waveContainer = document.getElementById('wave-patterns');
    var i;
    
    for (i = 0; i < 8; i++) {
        var wave = document.createElement('div');
        wave.className = 'wave-line';
        wave.style.top = (10 + i * 12) + '%';
        wave.style.width = (60 + Math.random() * 30) + '%';
        wave.style.left = (Math.random() * 20) + '%';
        wave.style.animationDuration = (6 + Math.random() * 4) + 's';
        wave.style.animationDelay = (i * 0.5) + 's';
        waveContainer.appendChild(wave);
    }
}

// ============================================
// COMPASS INTERACTION
// ============================================
function initCompassInteraction() {
    var compass = document.getElementById('compass-rose');
    
    if (compass) {
        compass.addEventListener('click', function() {
            compass.style.transform = 'rotate(360deg)';
            compass.style.transition = 'transform 2s ease-out';
            
            setTimeout(function() {
                compass.style.transition = '';
                compass.style.transform = '';
            }, 2000);
        });
        
        compass.addEventListener('mouseenter', function() {
            showInfoPanel('Compass Rose', 'Traditional navigation compass indicating cardinal directions.', 'Click to spin the compass');
        });
        
        compass.addEventListener('mouseleave', function() {
            hideInfoPanel();
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function throttle(func, limit) {
    var inThrottle = false;
    return function() {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

window.addEventListener('resize', debounce(function() {
    initStarField();
    initOceanCanvas();
}, 250));

// ============================================
// KEYBOARD NAVIGATION
// ============================================
var scrollTimeout;
window.addEventListener('scroll', function() {
    document.body.classList.add('scrolling');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        document.body.classList.remove('scrolling');
    }, 150);
});

document.addEventListener('keydown', function(e) {
    var views = ['chart', 'constellations', 'islands', 'ocean'];
    var currentIndex = views.indexOf(state.currentView);
    var nextIndex, prevIndex, btn;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % views.length;
        btn = document.querySelector('[data-view="' + views[nextIndex] + '"]');
        if (btn) btn.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevIndex = (currentIndex - 1 + views.length) % views.length;
        btn = document.querySelector('[data-view="' + views[prevIndex] + '"]');
        if (btn) btn.click();
    }
});

// ============================================
// TOUCH SUPPORT
// ============================================
var touchStartX = 0;
var touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    var touchEndX = e.changedTouches[0].clientX;
    var touchEndY = e.changedTouches[0].clientY;
    
    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        var views = ['chart', 'constellations', 'islands', 'ocean'];
        var currentIndex = views.indexOf(state.currentView);
        var btn;
        
        if (deltaX > 0) {
            var prevIndex = (currentIndex - 1 + views.length) % views.length;
            btn = document.querySelector('[data-view="' + views[prevIndex] + '"]');
        } else {
            var nextIndex = (currentIndex + 1) % views.length;
            btn = document.querySelector('[data-view="' + views[nextIndex] + '"]');
        }
        if (btn) btn.click();
    }
});

console.log('Polynesian Celestial Wayfinding Chart initialized');
console.log('Navigate using arrow keys or swipe on mobile');