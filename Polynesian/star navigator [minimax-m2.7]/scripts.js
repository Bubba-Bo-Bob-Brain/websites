/* ============================================
   POLYNESIAN CELESTIAL WAYFINDING CHART
   Te Afualo - The Star Compass
   JavaScript Interactions & Animations
   ============================================ */

// ============================================
// GLOBAL STATE & CONFIGURATION
// ============================================

const AppState = {
    currentIslandIndex: 3,
    selectedConstellation: null,
    isInfoPanelOpen: false,
    isAudioPlaying: false,
    mousePosition: { x: 0, y: 0 },
    scrollPosition: 0,
    starFieldRotation: 0
};

// Island data with navigation information
const islandData = {
    hawaii: {
        name: "Hawai'i",
        native: "Hawai'i",
        description: "The starting point of the great migration. From here, ancient navigators set sail using the star Hoku (Evening Star) to guide them eastward.",
        stars: ["Hoku", "Makali'i"],
        currents: "North Pacific Current flows west to east",
        distance: "2,400 miles",
        navigation: "Navigate by the rising sun and Hoku star"
    },
    marquesas: {
        name: "Marquesas Islands",
        native: "Te Fenua Enata",
        description: "Discovered by Ui-te-Rangiora in 500 AD. These dramatic volcanic islands mark a crucial waypoint in the Polynesian triangle.",
        stars: ["Puanga", "Tautoru"],
        currents: "South Equatorial Current flows east to west",
        distance: "2,100 miles",
        navigation: "Follow Orion's Belt rising in the east"
    },
    tuamotu: {
        name: "Tuamotu Archipelago",
        native: "The Atolls",
        description: "A vast chain of coral atolls stretching across the central Pacific. The navigators called these 'the string of fishhooks.'",
        stars: ["Matariki", "Puanga"],
        currents: "South Equatorial Current",
        distance: "900 miles",
        navigation: "Navigate by the Southern Cross when south of equator"
    },
    society: {
        name: "Society Islands",
        native: "Moana Tahiti",
        description: "The heart of French Polynesia, including Tahiti. Captain James Cook visited here in 1769 to observe the Transit of Venus.",
        stars: ["Ta'utoru", "Puanga"],
        currents: "South Equatorial Current splits here",
        distance: "Current location",
        navigation: "Center of the Polynesian star compass"
    },
    cook: {
        name: "Cook Islands",
        native: "Māori Kuki Airani",
        description: "Named after Captain James Cook. These islands form a vital link between the western and eastern Polynesian cultures.",
        stars: ["Matariki", "Kaupeka"],
        currents: "South Equatorial Current",
        distance: "1,400 miles",
        navigation: "Follow the path of Matariki in winter skies"
    },
    samoa: {
        name: "Samoa",
        native: "Mālō Samoa",
        description: "The Navigator's Isles, where the legendary Moana lived. Known for exceptional wayfinding traditions preserved to this day.",
        stars: ["Puanga", "Sami", "Ta'utoro"],
        currents: "South Equatorial Current meets West Pacific Drift",
        distance: "1,600 miles",
        navigation: "Use the Navigator's Star lines"
    },
    tonga: {
        name: "Tonga",
        native: "Friendly Islands",
        description: "An island kingdom with a unique monarchy. Ancient Tongan navigators were renowned for their long-distance voyaging.",
        stars: ["Hanui", "Kaupeka"],
        currents: "West Pacific Drift",
        distance: "800 miles",
        navigation: "Navigate by the Southern Cross constellation"
    },
    aotearoa: {
        name: "Aotearoa (New Zealand)",
        native: "Land of Long White Cloud",
        description: "The final destination of the Great Fleet, around 1350 AD. Home to the Māori people and their exceptional navigation traditions.",
        stars: ["Puanga", "Matariki", "Takurua"],
        currents: "West Pacific Drift and Antarctic Circumpolar",
        distance: "2,300 miles",
        navigation: "Follow Puanga (Rigel) setting in the west"
    }
};

// Constellation data with navigation secrets
const constellationData = {
    orion: {
        name: "Puanga",
        english: "Orion's Belt",
        description: "In Māori tradition, Puanga is the star that guided the great waka (canoe) Te Arawa to Aotearoa. Its rising marks the beginning of the Māori New Year when seen with Matariki.",
        navigation: "Use Puanga's rising position to determine east-west direction. When Puanga rises, your bow should point toward it.",
        starLines: ["North", "Northeast", "East"]
    },
    "southern-cross": {
        name: "Hanui",
        english: "Southern Cross",
        description: "The Southern Cross points to true south and is essential for navigation in the southern hemisphere. It never sets below the horizon in southern Polynesia.",
        navigation: "Draw a line through the long axis of the cross and extend it 4.5 times to find celestial south. This is your reference for all southern directions.",
        starLines: ["South", "Southwest", "Southeast"]
    },
    pleiades: {
        name: "Matariki",
        english: "The Seven Sisters (Pleiades)",
        description: "Matariki heralds the Māori New Year. Its appearance in the pre-dawn sky signals the start of navigation season. The cluster contains over 1,000 stars but only 7 are visible to the naked eye.",
        navigation: "When Matariki appears low on the horizon at dusk, it marks the beginning of the calm sailing season. Its height indicates your latitude.",
        starLines: ["Northwest", "West", "Southwest"]
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeStarField();
    initializeOcean();
    initializeCompass();
    initializeConstellations();
    initializeIslands();
    initializeInfoPanel();
    initializeNavigationMarkers();
    initializeWakeTrail();
    initializeAudioToggle();
    initializeIntersectionObserver();
    
    // Hide loading screen after initialization
    setTimeout(function() {
        var loading = document.querySelector('.loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }, 1500);
});

// ============================================
// STAR FIELD ANIMATION
// ============================================

function initializeStarField() {
    var canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var stars = [];
    var numStars = 400;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    
    // Initialize stars
    function initStars() {
        stars = [];
        for (var i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                color: getStarColor(Math.random())
            });
        }
    }
    
    // Get star color based on temperature
    function getStarColor(random) {
        if (random < 0.6) return '#ffffff';
        if (random < 0.8) return '#fff8dc';
        if (random < 0.95) return '#e6f0ff';
        return '#ffd700';
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var rotationOffset = AppState.starFieldRotation * 0.001;
        
        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];
            
            // Twinkle effect
            star.twinklePhase += star.twinkleSpeed;
            var twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
            var currentOpacity = star.opacity * twinkle;
            
            // Calculate parallax based on mouse position
            var parallaxX = (AppState.mousePosition.x - canvas.width / 2) * 0.02;
            var parallaxY = (AppState.mousePosition.y - canvas.height / 2) * 0.02;
            
            // Apply rotation and parallax
            var rotatedX = star.x * Math.cos(rotationOffset) - star.y * Math.sin(rotationOffset);
            var rotatedY = star.x * Math.sin(rotationOffset) + star.y * Math.cos(rotationOffset);
            var drawX = rotatedX + parallaxX;
            var drawY = rotatedY + parallaxY;
            
            // Wrap around screen
            var finalX = ((drawX % canvas.width) + canvas.width) % canvas.width;
            var finalY = ((drawY % canvas.height) + canvas.height) % canvas.height;
            
            // Draw star with glow effect
            if (star.radius > 1.2) {
                var gradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, star.radius * 3);
                gradient.addColorStop(0, star.color);
                gradient.addColorStop(0.3, star.color);
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(finalX, finalY, star.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.globalAlpha = currentOpacity * 0.3;
                ctx.fill();
            }
            
            // Draw star core
            ctx.beginPath();
            ctx.arc(finalX, finalY, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = currentOpacity;
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    // Create shooting stars periodically
    function createShootingStar() {
        if (Math.random() > 0.02) return;
        
        var starField = document.getElementById('starField');
        if (!starField) return;
        
        var shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.left = Math.random() * 50 + '%';
        shootingStar.style.top = Math.random() * 30 + '%';
        shootingStar.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starField.appendChild(shootingStar);
        
        setTimeout(function() {
            shootingStar.remove();
        }, 4000);
    }
    
    setInterval(createShootingStar, 100);
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

// ============================================
// OCEAN ANIMATION
// ============================================

function initializeOcean() {
    var canvas = document.getElementById('oceanCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var particles = [];
    var numParticles = 50;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.4;
        initParticles();
    }
    
    function initParticles() {
        particles = [];
        for (var i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                velocityX: Math.random() * 0.5 + 0.2,
                velocityY: Math.random() * 0.3 - 0.15,
                opacity: Math.random() * 0.5 + 0.2,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    function drawOcean() {
        // Clear and draw gradient background
        var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(10, 22, 40, 0.8)');
        gradient.addColorStop(0.5, 'rgba(15, 40, 71, 0.9)');
        gradient.addColorStop(1, 'rgba(26, 74, 110, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw wave lines
        drawWaves();
        
        // Draw bioluminescent particles
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            
            // Update position
            particle.x += particle.velocityX;
            particle.y += Math.sin(particle.phase) * 0.5;
            particle.phase += 0.02;
            
            // Wrap around
            if (particle.x > canvas.width) {
                particle.x = 0;
                particle.y = Math.random() * canvas.height;
            }
            
            // Draw glow effect
            var glowGradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 4
            );
            glowGradient.addColorStop(0, 'rgba(0, 255, 200, 0.8)');
            glowGradient.addColorStop(0.5, 'rgba(0, 255, 160, 0.3)');
            glowGradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Draw core
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffc8';
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawOcean);
    }
    
    function drawWaves() {
        var time = Date.now() * 0.001;
        ctx.lineWidth = 1;
        
        // Draw multiple wave layers
        for (var i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(58, 154, 184, ' + (0.1 + i * 0.05) + ')';
            
            var yOffset = i * (canvas.height / 6) + 20;
            var amplitude = 5 + i * 2;
            var frequency = 0.01 - i * 0.001;
            
            for (var x = 0; x < canvas.width; x += 2) {
                var y = yOffset + Math.sin(x * frequency + time * (0.5 + i * 0.1)) * amplitude;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawOcean();
}

// ============================================
// COMPASS INTERACTIONS
// ============================================

function initializeCompass() {
    var compassWrapper = document.getElementById('compassWrapper');
    var starHouses = document.querySelectorAll('.star-house');
    var degreeMarkers = document.querySelectorAll('.cardinal-marker, .intercardinal-marker');
    
    // Track mouse for compass rotation effect
    document.addEventListener('mousemove', function(e) {
        var rotation = ((e.clientX / window.innerWidth) - 0.5) * 10;
        if (compassWrapper) {
            compassWrapper.style.transform = 'rotate(' + rotation + 'deg)';
        }
        
        // Update star dome indicator
        var domeIndicator = document.getElementById('starDomeIndicator');
        if (domeIndicator) {
            domeIndicator.style.transform = 'translate(-50%, -50%) rotate(' + (rotation * 2) + 'deg)';
        }
    });
    
    // Star house hover effects
    for (var i = 0; i < starHouses.length; i++) {
        var house = starHouses[i];
        
        house.addEventListener('mouseenter', function(e) {
            var houseElement = e.currentTarget;
            var houseName = houseElement.dataset.house;
            showTooltip(e, houseName.toUpperCase(), getStarHouseDescription(houseName));
        });
        
        house.addEventListener('mouseleave', hideTooltip);
        
        house.addEventListener('click', function(e) {
            var houseElement = e.currentTarget;
            var houseName = houseElement.dataset.house;
            openInfoPanel('star', houseName);
        });
    }
    
    // Degree marker interactions
    for (var j = 0; j < degreeMarkers.length; j++) {
        var marker = degreeMarkers[j];
        
        marker.addEventListener('mouseenter', function(e) {
            var degree = e.currentTarget.dataset.degree;
            var direction = getDirectionName(degree);
            showTooltip(e, direction, 'Navigate ' + direction + ' using this bearing');
        });
        
        marker.addEventListener('mouseleave', hideTooltip);
    }
    
    // Canoe marker click
    var canoeMarker = document.querySelector('.canoe-marker');
    if (canoeMarker) {
        canoeMarker.addEventListener('click', function() {
            openInfoPanel('compass', 'canoe');
        });
    }
}

function getStarHouseDescription(house) {
    var descriptions = {
        'hoku': 'The Evening Star, rising in the east to guide your journey',
        'southern-cross': 'Points to true south, essential for southern hemisphere navigation',
        'orion': 'Puanga - The star that led our ancestors to Aotearoa',
        'pleiades': 'Matariki - The Seven Sisters, herald of the New Year',
        'north-star': 'Ka Mao - The guiding star that never moves'
    };
    return descriptions[house] || 'A key navigational star in the Polynesian sky';
}

function getDirectionName(degree) {
    var directions = {
        '0': 'North (Te Rāwhi)',
        '45': 'Northeast',
        '90': 'East (Te Tonga)',
        '135': 'Southeast',
        '180': 'South (Te Uru)',
        '225': 'Southwest',
        '270': 'West (Te Pu)',
        '315': 'Northwest'
    };
    return directions[degree] || 'Unknown';
}

// ============================================
// CONSTELLATION INTERACTIONS
// ============================================

function initializeConstellations() {
    var constellations = document.querySelectorAll('.constellation');
    
    for (var i = 0; i < constellations.length; i++) {
        var constellation = constellations[i];
        
        constellation.addEventListener('mouseenter', function(e) {
            var constellationElement = e.currentTarget;
            var name = constellationElement.dataset.constellation;
            var data = constellationData[name];
            showTooltip(e, data.name, data.description.substring(0, 80) + '...');
            
            // Highlight navigation guides
            var guides = document.querySelectorAll('.guide-line');
            for (var g = 0; g < guides.length; g++) {
                guides[g].style.opacity = '0.8';
            }
        });
        
        constellation.addEventListener('mouseleave', function(e) {
            hideTooltip();
            var guides = document.querySelectorAll('.guide-line');
            for (var g = 0; g < guides.length; g++) {
                guides[g].style.opacity = '0.5';
            }
        });
        
        constellation.addEventListener('click', function(e) {
            var constellationElement = e.currentTarget;
            var name = constellationElement.dataset.constellation;
            openInfoPanel('constellation', name);
        });
    }
    
    // Make constellation stars clickable
    var constellationStars = document.querySelectorAll('.constellation-star');
    for (var j = 0; j < constellationStars.length; j++) {
        var star = constellationStars[j];
        star.style.cursor = 'pointer';
        
        star.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Highlight connected stars
            var constellation = e.currentTarget.closest('.constellation');
            var stars = constellation.querySelectorAll('.constellation-star');
            for (var k = 0; k < stars.length; k++) {
                stars[k].style.filter = 'brightness(1.5)';
            }
            
            setTimeout(function() {
                for (var m = 0; m < stars.length; m++) {
                    stars[m].style.filter = '';
                }
            }, 1000);
            
            // Create connection effect
            createConnectionEffect(e.clientX, e.clientY);
        });
    }
}

function createConnectionEffect(x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    canvas.style.cssText = 'position: fixed; left: ' + (x - 20) + 'px; top: ' + (y - 20) + 'px; pointer-events: none; z-index: 100;';
    document.body.appendChild(canvas);
    
    var ctx = canvas.getContext('2d');
    var scale = 1;
    var opacity = 1;
    
    function animate() {
        ctx.clearRect(0, 0, 40, 40);
        ctx.beginPath();
        ctx.arc(20, 20, 15 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(122, 208, 192, ' + opacity + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        scale += 0.05;
        opacity -= 0.03;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    
    animate();
}

// ============================================
// ISLAND NAVIGATION
// ============================================

function initializeIslands() {
    var islandMarkers = document.querySelectorAll('.island-marker');
    var prevBtn = document.getElementById('prevIsland');
    var nextBtn = document.getElementById('nextIsland');
    var navIndicator = document.getElementById('navIndicator');
    var currentPosition = document.getElementById('currentPosition');
    
    // Island hover effects
    for (var i = 0; i < islandMarkers.length; i++) {
        var marker = islandMarkers[i];
        
        marker.addEventListener('mouseenter', function(e) {
            var island = e.currentTarget.dataset.island;
            var data = islandData[island];
            showTooltip(e, data.name, data.native + '<br>' + data.distance);
        });
        
        marker.addEventListener('mouseleave', hideTooltip);
        
        marker.addEventListener('click', function(e) {
            var island = e.currentTarget.dataset.island;
            openInfoPanel('island', island);
        });
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            navigateToIsland(AppState.currentIslandIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            navigateToIsland(AppState.currentIslandIndex + 1);
        });
    }
    
    // Update current position indicator
    function updatePositionIndicator() {
        var islands = ['hawaii', 'marquesas', 'tuamotu', 'society', 'cook', 'samoa', 'tonga', 'aotearoa'];
        var currentIsland = islands[AppState.currentIslandIndex];
        var marker = document.querySelector('[data-island="' + currentIsland + '"]');
        
        if (marker && currentPosition) {
            var svg = marker.closest('svg');
            var markerTransform = marker.getAttribute('transform');
            
            if (markerTransform) {
                var match = markerTransform.match(/translate\((\d+),\s*(\d+)\)/);
                if (match) {
                    var x = parseFloat(match[1]);
                    var y = parseFloat(match[2]);
                    var positionCircle = currentPosition.querySelector('circle');
                    
                    if (positionCircle) {
                        positionCircle.setAttribute('cx', x);
                        positionCircle.setAttribute('cy', y - 10);
                    }
                    
                    var positionLabel = currentPosition.querySelector('text');
                    if (positionLabel) {
                        positionLabel.setAttribute('x', x);
                        positionLabel.setAttribute('y', y - 25);
                    }
                }
            }
        }
        
        if (navIndicator) {
            navIndicator.textContent = 'Step ' + (AppState.currentIslandIndex + 1) + ' of 8';
        }
    }
    
    // Initialize position
    updatePositionIndicator();
    
    // Expose navigate function globally
    window.navigateToIsland = function(index) {
        if (index < 0) index = 7;
        if (index > 7) index = 0;
        
        AppState.currentIslandIndex = index;
        updatePositionIndicator();
        
        // Create wake effect
        createWakeEffect();
    };
}

function navigateToIsland(index) {
    if (index < 0) index = 7;
    if (index > 7) index = 0;
    
    AppState.currentIslandIndex = index;
    
    // Update nav indicator
    var navIndicator = document.getElementById('navIndicator');
    if (navIndicator) {
        navIndicator.textContent = 'Step ' + (AppState.currentIslandIndex + 1) + ' of 8';
    }
    
    // Create wake effect
    createWakeEffect();
}

// ============================================
// INFO PANEL
// ============================================

function initializeInfoPanel() {
    var infoPanel = document.getElementById('infoPanel');
    var infoClose = document.getElementById('infoClose');
    
    if (infoClose) {
        infoClose.addEventListener('click', closeInfoPanel);
    }
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (AppState.isInfoPanelOpen && infoPanel && !infoPanel.contains(e.target)) {
            closeInfoPanel();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && AppState.isInfoPanelOpen) {
            closeInfoPanel();
        }
    });
}

function openInfoPanel(type, id) {
    var infoPanel = document.getElementById('infoPanel');
    var infoContent = document.getElementById('infoContent');
    
    if (!infoPanel || !infoContent) return;
    
    var content = '';
    
    switch (type) {
        case 'island':
            var island = islandData[id];
            if (island) {
                content = '<h3>' + island.name + '</h3>' +
                    '<p class="native-name">' + island.native + '</p>' +
                    '<p>' + island.description + '</p>' +
                    '<div class="info-details">' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Distance:</span>' +
                    '<span class="detail-value">' + island.distance + '</span>' +
                    '</div>' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Key Stars:</span>' +
                    '<span class="detail-value">' + island.stars.join(', ') + '</span>' +
                    '</div>' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Ocean Current:</span>' +
                    '<span class="detail-value">' + island.currents + '</span>' +
                    '</div>' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Navigation:</span>' +
                    '<span class="detail-value">' + island.navigation + '</span>' +
                    '</div>' +
                    '</div>';
            }
            break;
            
        case 'constellation':
            var constellation = constellationData[id];
            if (constellation) {
                content = '<h3>' + constellation.name + '</h3>' +
                    '<p class="english-name">' + constellation.english + '</p>' +
                    '<p>' + constellation.description + '</p>' +
                    '<div class="info-details">' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Navigation Use:</span>' +
                    '<span class="detail-value">' + constellation.navigation + '</span>' +
                    '</div>' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Star Lines:</span>' +
                    '<span class="detail-value">' + constellation.starLines.join(' → ') + '</span>' +
                    '</div>' +
                    '</div>';
            }
            break;
            
        case 'star':
            var starInfo = getStarInfo(id);
            if (starInfo) {
                content = '<h3>' + starInfo.name + '</h3>' +
                    '<p>' + starInfo.description + '</p>' +
                    '<div class="info-details">' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Direction:</span>' +
                    '<span class="detail-value">' + starInfo.direction + '</span>' +
                    '</div>' +
                    '<div class="detail-item">' +
                    '<span class="detail-label">Best View:</span>' +
                    '<span class="detail-value">' + starInfo.bestView + '</span>' +
                    '</div>' +
                    '</div>';
            }
            break;
            
        case 'compass':
            content = '<h3>The Star Compass</h3>' +
                '<p>Te Afualo is the ancient Polynesian wayfinding system that uses the stars, ocean currents, and wave patterns to navigate thousands of miles across the Pacific Ocean.</p>' +
                '<div class="info-details">' +
                '<div class="detail-item">' +
                '<span class="detail-label">Your Position:</span>' +
                '<span class="detail-value">Center of the compass</span>' +
                '</div>' +
                '<div class="detail-item">' +
                '<span class="detail-label">Star Houses:</span>' +
                '<span class="detail-value">32 traditional houses</span>' +
                '</div>' +
                '<div class="detail-item">' +
                '<span class="detail-label">Key Concept:</span>' +
                '<span class="detail-value">Everything rises in the east</span>' +
                '</div>' +
                '</div>';
            break;
    }
    
    infoContent.innerHTML = content;
    infoPanel.classList.add('active');
    AppState.isInfoPanelOpen = true;
}

function getStarInfo(starId) {
    var stars = {
        'hoku': {
            name: 'Hoku (Evening Star)',
            description: 'The brightest star in the evening sky, used to determine east direction. Hoku rises in the east and sets in the west, marking the path of the sun.',
            direction: 'East',
            bestView: 'Evening hours, year-round'
        },
        'southern-cross': {
            name: 'Hanui (Southern Cross)',
            description: 'Points to true south and is essential for navigation in the southern hemisphere. It never sets below the horizon in southern Polynesia.',
            direction: 'South',
            bestView: 'Southern hemisphere, always visible'
        },
        'orion': {
            name: 'Puanga (Orion)',
            description: 'In Maori tradition, Puanga is the star that guided the great waka Te Arawa to Aotearoa. Its rising marks the beginning of the Maori New Year.',
            direction: 'East-Northeast',
            bestView: 'Winter months, southern hemisphere'
        },
        'pleiades': {
            name: 'Matariki (Seven Sisters)',
            description: 'Matariki heralds the Maori New Year. When it appears in the pre-dawn sky, it signals the start of the navigation season.',
            direction: 'Northeast',
            bestView: 'June (Matariki Festival)'
        },
        'north-star': {
            name: 'Ka Mao (North Star)',
            description: 'The fixed point in the northern sky that ancient navigators used to maintain their heading. In the southern hemisphere, it appears on the northern horizon.',
            direction: 'North',
            bestView: 'Northern hemisphere'
        }
    };
    return stars[starId];
}

function closeInfoPanel() {
    var infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        infoPanel.classList.remove('active');
        AppState.isInfoPanelOpen = false;
    }
}

// ============================================
// NAVIGATION MARKERS (TIKI)
// ============================================

function initializeNavigationMarkers() {
    var markers = document.querySelectorAll('.marker-tiki');
    var directions = {
        'north': 'Te Rāwhi - North',
        'east': 'Te Tonga - East',
        'south': 'Te Uru - South',
        'west': 'Te Pu - West'
    };
    
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        
        marker.addEventListener('mouseenter', function(e) {
            var direction = e.currentTarget.dataset.direction;
            showTooltip(e, directions[direction], 'Click to learn about this direction');
        });
        
        marker.addEventListener('mouseleave', hideTooltip);
        
        marker.addEventListener('click', function(e) {
            var direction = e.currentTarget.dataset.direction;
            openInfoPanel('direction', direction);
            createWakeEffect(e.clientX, e.clientY);
        });
    }
}

// ============================================
// BIOLUMINESCENT WAKE TRAIL
// ============================================

function initializeWakeTrail() {
    var wakeContainer = document.getElementById('wakeContainer');
    
    // Create initial particles
    for (var i = 0; i < 5; i++) {
        setTimeout(function() {
            createWakeEffect();
        }, i * 500);
    }
    
    // Create wake effect on various interactions
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.info-panel') && !e.target.closest('.navigation-markers')) {
            createWakeEffect(e.clientX, e.clientY);
        }
    });
}

function createWakeEffect(x, y) {
    if (!x || !y) {
        x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        y = window.innerHeight * 0.7 + (Math.random() - 0.5) * 100;
    }
    
    var wakeContainer = document.getElementById('wakeContainer');
    if (!wakeContainer) return;
    
    // Create multiple particles
    for (var i = 0; i < 8; i++) {
        (function(index) {
            setTimeout(function() {
                var particle = document.createElement('div');
                particle.className = 'wake-particle';
                particle.style.left = (x + (Math.random() - 0.5) * 40) + 'px';
                particle.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
                particle.style.animationDelay = (index * 0.1) + 's';
                particle.style.width = (Math.random() * 4 + 4) + 'px';
                particle.style.height = particle.style.width;
                wakeContainer.appendChild(particle);
                
                setTimeout(function() {
                    particle.remove();
                }, 2500);
            }, index * 50);
        })(i);
    }
}

// ============================================
// TOOLTIP SYSTEM
// ============================================

function showTooltip(e, title, content) {
    var tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    var tooltipContent = tooltip.querySelector('.tooltip-content');
    tooltipContent.innerHTML = '<h4>' + title + '</h4><p>' + content + '</p>';
    
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
    tooltip.classList.add('active');
    
    // Keep tooltip in viewport
    function adjustPosition() {
        var rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.style.left = (e.clientX - rect.width - 15) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            tooltip.style.top = (e.clientY - rect.height - 15) + 'px';
        }
    }
    
    adjustPosition();
}

function hideTooltip() {
    var tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('active');
    }
}

// ============================================
// AUDIO TOGGLE (VISUAL)
// ============================================

function initializeAudioToggle() {
    var audioIndicator = document.getElementById('audioIndicator');
    if (!audioIndicator) return;
    
    audioIndicator.addEventListener('click', function() {
        AppState.isAudioPlaying = !AppState.isAudioPlaying;
        audioIndicator.classList.toggle('active', AppState.isAudioPlaying);
        
        if (AppState.isAudioPlaying) {
            audioIndicator.style.transform = 'scale(1.1)';
            setTimeout(function() {
                audioIndicator.style.transform = '';
            }, 200);
        }
    });
}

// ============================================
// SCROLL & INTERSECTION OBSERVER
// ============================================

function initializeIntersectionObserver() {
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    var observer = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                var rect = entry.target.getBoundingClientRect();
                var scrolled = window.innerHeight - rect.top;
                var translateY = Math.min(scrolled * 0.05, 20);
                entry.target.style.transform = 'translateY(' + translateY + 'px)';
            }
        }
    }, observerOptions);
    
    var panels = document.querySelectorAll('.currents-panel, .islands-panel, .constellations-panel');
    for (var j = 0; j < panels.length; j++) {
        observer.observe(panels[j]);
    }
    
    // Track scroll for parallax effects
    window.addEventListener('scroll', function() {
        AppState.scrollPosition = window.pageYOffset;
        AppState.starFieldRotation = AppState.scrollPosition * 0.5;
    });
}

// ============================================
// MOUSE TRACKING
// ============================================

document.addEventListener('mousemove', function(e) {
    AppState.mousePosition.x = e.clientX;
    AppState.mousePosition.y = e.clientY;
});

// ============================================
// TOUCH SUPPORT
// ============================================

document.addEventListener('touchstart', function(e) {
    var touch = e.touches[0];
    AppState.mousePosition.x = touch.clientX;
    AppState.mousePosition.y = touch.clientY;
    createWakeEffect(touch.clientX, touch.clientY);
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        navigateToIsland(AppState.currentIslandIndex - 1);
    }
    if (e.key === 'ArrowRight') {
        navigateToIsland(AppState.currentIslandIndex + 1);
    }
    
    var num = parseInt(e.key);
    if (num >= 1 && num <= 8) {
        navigateToIsland(num - 1);
    }
});

// ============================================
// CURSOR TRAIL EFFECT
// ============================================

(function() {
    var lastTime = 0;
    var throttleMs = 50;
    
    document.addEventListener('mousemove', function(e) {
        var now = Date.now();
        if (now - lastTime < throttleMs) return;
        lastTime = now;
        
        if (Math.random() > 0.95) {
            var trail = document.createElement('div');
            trail.style.cssText = 'position: fixed; left: ' + e.clientX + 'px; top: ' + e.clientY + 'px; width: 3px; height: 3px; background: rgba(122, 208, 192, 0.5); border-radius: 50%; pointer-events: none; z-index: 1000; transition: all 1s ease-out;';
            document.body.appendChild(trail);
            
            requestAnimationFrame(function() {
                trail.style.transform = 'scale(0)';
                trail.style.opacity = '0';
            });
            
            setTimeout(function() {
                trail.remove();
            }, 1000);
        }
    });
})();