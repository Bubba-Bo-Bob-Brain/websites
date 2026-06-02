// Polynesian Celestial Wayfinding Chart - JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Polynesian Celestial Wayfinding Chart initialized');
    
    // ========== GLOBAL VARIABLES & STATE ==========
    const state = {
        selectedStars: [],
        connectedConstellations: [],
        isConnectingStars: false,
        isDragging: false,
        wakeTrailPoints: [],
        currentRotation: 0,
        nightMode: false,
        islandData: [
            { name: "Hawaiʻi", x: 30, y: 40, color: "#2d5a27" },
            { name: "Tahiti", x: 60, y: 60, color: "#3a7c3a" },
            { name: "Rapa Nui", x: 80, y: 30, color: "#2d5a27" },
            { name: "Aotearoa", x: 40, y: 70, color: "#3a7c3a" },
            { name: "Fiji", x: 70, y: 50, color: "#2d5a27" },
            { name: "Samoa", x: 65, y: 65, color: "#3a7c3a" },
            { name: "Tonga", x: 68, y: 58, color: "#2d5a27" },
            { name: "Marquesas", x: 55, y: 45, color: "#3a7c3a" }
        ],
        constellationData: [
            { 
                name: "Hōkūʻula (The Red Star)", 
                stars: [1, 5, 9],
                description: "This constellation marks the path to the southern islands when it rises at dawn.",
                navigation: "Follow this star's rising point to maintain course eastward.",
                color: "#ff3333"
            },
            { 
                name: "Hōkūpaʻa (North Star)", 
                stars: [0, 3, 7],
                description: "The fixed point around which all other stars revolve.",
                navigation: "Keep this star at a constant angle to maintain latitude.",
                color: "#ffcc00"
            },
            { 
                name: "Kaʻiwakīloumoku (The Navigator)", 
                stars: [2, 4, 6, 8],
                description: "A constellation shaped like a canoe with a navigator at the helm.",
                navigation: "When this constellation is upright, it's time to change course.",
                color: "#00e5d8"
            },
            { 
                name: "Manaiakalani (The Fish Hook)", 
                stars: [10, 11, 12, 13],
                description: "Maui's fish hook, used to pull islands from the sea.",
                navigation: "Points toward rich fishing grounds and safe harbors.",
                color: "#8a2be2"
            }
        ]
    };

    // ========== DOM ELEMENTS ==========
    const domeGrid = document.getElementById('domeGrid');
    const constellationLines = document.getElementById('constellationLines');
    const northStar = document.getElementById('northStar');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const connectStarsBtn = document.getElementById('connectStars');
    const currentFlow = document.getElementById('currentFlow');
    const wavePatterns = document.getElementById('wavePatterns');
    const islandChain = document.getElementById('islandChain');
    const wakeTrail = document.getElementById('wakeTrail');
    const starBrightnessSlider = document.getElementById('starBrightness');
    const currentSpeedSlider = document.getElementById('currentSpeed');
    const waveIntensitySlider = document.getElementById('waveIntensity');
    const resetViewBtn = document.getElementById('resetView');
    const nightModeBtn = document.getElementById('nightMode');
    const constellationModal = document.getElementById('constellationModal');
    const modalClose = document.getElementById('modalClose');
    const constellationName = document.getElementById('constellationName');
    const constellationDescription = document.getElementById('constellationDescription');
    const navigationInstructions = document.getElementById('navigationInstructions');
    const constellationPreview = document.getElementById('constellationPreview');

    // ========== STARFIELD GENERATION ==========
    function createStarfield() {
        const starTypes = ['navigational', 'seasonal', 'rising'];
        const colors = {
            'navigational': '#ffcc00',
            'seasonal': '#8a2be2', 
            'rising': '#00e5d8'
        };
        
        // Clear existing stars
        domeGrid.innerHTML = '';
        
        // Create 15 stars in a circular pattern
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * 2 * Math.PI;
            const radius = 40 + Math.random() * 30;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            
            const starType = starTypes[Math.floor(Math.random() * starTypes.length)];
            const star = document.createElement('div');
            star.className = `star ${starType}`;
            star.dataset.id = i;
            star.dataset.type = starType;
            
            // Position the star
            star.style.position = 'absolute';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = '12px';
            star.style.height = '12px';
            star.style.backgroundColor = colors[starType];
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 10px ${colors[starType]}, 0 0 20px ${colors[starType]}`;
            star.style.cursor = 'pointer';
            star.style.zIndex = '5';
            star.style.transform = 'translate(-50%, -50%)';
            
            // Add pulsing animation
            star.style.animation = `pulse ${2 + Math.random() * 3}s infinite alternate`;
            
            // Add click event for star selection
            star.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleStarSelection(this);
            });
            
            // Add hover effect
            star.addEventListener('mouseenter', function() {
                this.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.style.boxShadow = `0 0 20px ${colors[starType]}, 0 0 40px ${colors[starType]}`;
            });
            
            star.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(-50%, -50%) scale(1)';
                this.style.boxShadow = `0 0 10px ${colors[starType]}, 0 0 20px ${colors[starType]}`;
            });
            
            domeGrid.appendChild(star);
        }
        
        // Add the central north star
        northStar.addEventListener('click', function() {
            toggleStarSelection(this);
        });
    }

    // ========== STAR SELECTION & CONSTELLATIONS ==========
    function toggleStarSelection(starElement) {
        const starId = starElement.dataset.id || 'center';
        
        if (state.selectedStars.includes(starId)) {
            // Deselect
            state.selectedStars = state.selectedStars.filter(id => id !== starId);
            starElement.classList.remove('selected');
            starElement.style.boxShadow = starElement.style.boxShadow.replace('0 0 30px #ff69b4', '');
        } else {
            // Select
            if (state.selectedStars.length < 5) {
                state.selectedStars.push(starId);
                starElement.classList.add('selected');
                
                // Add selection glow
                const currentBoxShadow = starElement.style.boxShadow;
                starElement.style.boxShadow = currentBoxShadow + ', 0 0 30px #ff69b4';
                
                // If we have at least 2 stars selected, check for constellation match
                if (state.selectedStars.length >= 2) {
                    checkForConstellation();
                }
            } else {
                alert('Maximum 5 stars can be selected at once');
            }
        }
        
        // Update connection lines if in connection mode
        if (state.isConnectingStars) {
            drawConnectionLines();
        }
    }

    function checkForConstellation() {
        // Sort selected stars for comparison
        const sortedSelected = [...state.selectedStars].sort((a, b) => a - b);
        const selectedString = sortedSelected.join(',');
        
        // Check each constellation
        for (const constellation of state.constellationData) {
            const sortedConstellationStars = [...constellation.stars].sort((a, b) => a - b);
            const constellationString = sortedConstellationStars.join(',');
            
            // If selected stars match a constellation exactly
            if (selectedString === constellationString) {
                // Mark constellation as connected
                if (!state.connectedConstellations.includes(constellation.name)) {
                    state.connectedConstellations.push(constellation.name);
                    
                    // Show constellation modal
                    showConstellationModal(constellation);
                    
                    // Draw permanent constellation lines
                    drawConstellation(constellation);
                    
                    // Clear selection
                    state.selectedStars = [];
                    document.querySelectorAll('.star.selected').forEach(star => {
                        star.classList.remove('selected');
                    });
                    
                    // Add celebration effect
                    celebrateConstellation(constellation.color);
                }
                break;
            }
        }
    }

    function drawConnectionLines() {
        // Clear existing temporary lines
        document.querySelectorAll('.temp-line').forEach(line => line.remove());
        
        // Draw lines between selected stars
        for (let i = 0; i < state.selectedStars.length - 1; i++) {
            const star1Id = state.selectedStars[i];
            const star2Id = state.selectedStars[i + 1];
            
            const star1 = star1Id === 'center' ? northStar : document.querySelector(`.star[data-id="${star1Id}"]`);
            const star2 = star2Id === 'center' ? northStar : document.querySelector(`.star[data-id="${star2Id}"]`);
            
            if (star1 && star2) {
                drawLineBetweenStars(star1, star2, 'temp-line', '#ff69b4');
            }
        }
    }

    function drawConstellation(constellation) {
        // Draw permanent constellation lines
        const stars = constellation.stars;
        const color = constellation.color;
        
        for (let i = 0; i < stars.length - 1; i++) {
            const star1 = document.querySelector(`.star[data-id="${stars[i]}"]`);
            const star2 = document.querySelector(`.star[data-id="${stars[i+1]}"]`);
            
            if (star1 && star2) {
                drawLineBetweenStars(star1, star2, 'constellation-line', color);
            }
        }
        
        // Also connect first and last star if there are at least 3 stars
        if (stars.length >= 3) {
            const firstStar = document.querySelector(`.star[data-id="${stars[0]}"]`);
            const lastStar = document.querySelector(`.star[data-id="${stars[stars.length-1]}"]`);
            
            if (firstStar && lastStar) {
                drawLineBetweenStars(firstStar, lastStar, 'constellation-line', color);
            }
        }
    }

    function drawLineBetweenStars(star1, star2, lineClass, color) {
        const line = document.createElement('div');
        line.className = lineClass;
        
        // Get positions
        const rect1 = star1.getBoundingClientRect();
        const rect2 = star2.getBoundingClientRect();
        
        const domeRect = document.querySelector('.dome-container').getBoundingClientRect();
        
        // Calculate positions relative to dome
        const x1 = rect1.left + rect1.width/2 - domeRect.left;
        const y1 = rect1.top + rect1.height/2 - domeRect.top;
        const x2 = rect2.left + rect2.width/2 - domeRect.left;
        const y2 = rect2.top + rect2.height/2 - domeRect.top;
        
        // Calculate distance and angle
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Style the line
        line.style.position = 'absolute';
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.width = `${distance}px`;
        line.style.height = '3px';
        line.style.backgroundColor = color;
        line.style.transformOrigin = '0 0';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.zIndex = '4';
        line.style.boxShadow = `0 0 10px ${color}`;
        
        // Add animation for new lines
        if (lineClass === 'constellation-line') {
            line.style.animation = 'line-draw 1s forwards';
            line.style.clipPath = 'polygon(0 0, 0 100%, 0 100%, 0 0)';
            
            // After animation, remove clip path
            setTimeout(() => {
                line.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            }, 1000);
        }
        
        constellationLines.appendChild(line);
    }

    function celebrateConstellation(color) {
        // Create particle explosion
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.zIndex = '10';
            
            // Random direction and distance
            const angle = Math.random() * 2 * Math.PI;
            const distance = 50 + Math.random() * 100;
            const duration = 1 + Math.random();
            
            particle.style.animation = `
                particle-explode ${duration}s forwards,
                particle-fade ${duration}s forwards
            `;
            
            // Set CSS custom properties for animation
            particle.style.setProperty('--particle-angle', `${angle}rad`);
            particle.style.setProperty('--particle-distance', `${distance}px`);
            
            document.querySelector('.celestial-dome').appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration * 1000);
        }
        
        // Add CSS for particle animation
        if (!document.getElementById('particle-animation-style')) {
            const style = document.createElement('style');
            style.id = 'particle-animation-style';
            style.textContent = `
                @keyframes particle-explode {
                    0% {
                        transform: translate(-50%, -50%) translate(0, 0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) translate(
                            calc(cos(var(--particle-angle)) * var(--particle-distance)),
                            calc(sin(var(--particle-angle)) * var(--particle-distance))
                        );
                        opacity: 0;
                    }
                }
                
                @keyframes particle-fade {
                    0% { opacity: 1; }
                    70% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========== MODAL FUNCTIONS ==========
    function showConstellationModal(constellation) {
        constellationName.textContent = constellation.name;
        constellationDescription.textContent = constellation.description;
        navigationInstructions.textContent = constellation.navigation;
        
        // Clear and recreate preview
        constellationPreview.innerHTML = '';
        
        // Create a simple visual representation
        const previewContainer = document.createElement('div');
        previewContainer.style.display = 'flex';
        previewContainer.style.justifyContent = 'center';
        previewContainer.style.alignItems = 'center';
        previewContainer.style.height = '100%';
        previewContainer.style.gap = '10px';
        
        constellation.stars.forEach((starId, index) => {
            const starDot = document.createElement('div');
            starDot.style.width = '20px';
            starDot.style.height = '20px';
            starDot.style.backgroundColor = constellation.color;
            starDot.style.borderRadius = '50%';
            starDot.style.boxShadow = `0 0 10px ${constellation.color}`;
            starDot.style.animation = `pulse 2s infinite ${index * 0.2}s`;
            
            previewContainer.appendChild(starDot);
        });
        
        constellationPreview.appendChild(previewContainer);
        
        // Show modal
        constellationModal.style.display = 'flex';
    }

    // ========== OCEAN & ISLAND FUNCTIONS ==========
    function createIslands() {
        islandChain.innerHTML = '';
        
        state.islandData.forEach(island => {
            const islandElement = document.createElement('div');
            islandElement.className = 'island';
            islandElement.dataset.name = island.name;
            
            islandElement.style.position = 'absolute';
            islandElement.style.left = `${island.x}%`;
            islandElement.style.top = `${island.y}%`;
            islandElement.style.width = '20px';
            islandElement.style.height = '20px';
            islandElement.style.backgroundColor = island.color;
            islandElement.style.borderRadius = '50%';
            islandElement.style.boxShadow = `
                0 0 15px ${island.color},
                inset 0 0 10px #d4b483,
                0 0 0 2px #8c7853
            `;
            islandElement.style.transform = 'translate(-50%, -50%)';
            islandElement.style.cursor = 'pointer';
            islandElement.style.zIndex = '6';
            
            // Add pulsing animation
            islandElement.style.animation = `pulse ${3 + Math.random() * 4}s infinite alternate`;
            
            // Create tooltip for island name
            const tooltip = document.createElement('div');
            tooltip.className = 'island-tooltip';
            tooltip.textContent = island.name;
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.backgroundColor = 'rgba(10, 26, 42, 0.9)';
            tooltip.style.color = '#ffcc00';
            tooltip.style.padding = '4px 8px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.8rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.border = '1px solid #ffcc00';
            
            islandElement.appendChild(tooltip);
            
            // Add hover events
            islandElement.addEventListener('mouseenter', function() {
                tooltip.style.opacity = '1';
                this.style.transform = 'translate(-50%, -50%) scale(1.3)';
                this.style.zIndex = '7';
            });
            
            islandElement.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                this.style.transform = 'translate(-50%, -50%) scale(1)';
                this.style.zIndex = '6';
            });
            
            islandChain.appendChild(islandElement);
        });
    }

    function animateOceanCurrents() {
        // Get flow paths
        const flowPaths = document.querySelectorAll('.flow-path');
        
        // Update animation duration based on slider
        const speed = parseInt(currentSpeedSlider.value);
        const duration = 8 - (speed / 100) * 6; // Between 2-8 seconds
        
        flowPaths.forEach((path, index) => {
            path.style.animationDuration = `${duration}s`;
            path.style.animationDelay = `${index * 2}s`;
        });
        
        // Animate waves
        const waveRows = document.querySelectorAll('.wave-row');
        const intensity = parseInt(waveIntensitySlider.value) / 100;
        
        waveRows.forEach((wave, index) => {
            wave.style.opacity = 0.3 + (intensity * 0.4);
            wave.style.animationDuration = `${4 - (intensity * 2)}s`;
            wave.style.animationDelay = `${index * 0.5}s`;
        });
    }

    // ========== BIOLUMINESCENT WAKE TRAIL ==========
    function createWakeTrail() {
        let isDrawing = false;
        
        wakeTrail.addEventListener('mousedown', function(e) {
            isDrawing = true;
            state.wakeTrailPoints = [];
            addWakePoint(e);
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDrawing) return;
            addWakePoint(e);
        });
        
        document.addEventListener('mouseup', function() {
            isDrawing = false;
            
            // Fade out wake trail after a delay
            setTimeout(() => {
                const wakePath = document.querySelector('.wake-path');
                if (wakePath) {
                    wakePath.style.opacity = '0';
                    wakePath.style.transition = 'opacity 2s';
                    
                    setTimeout(() => {
                        if (wakePath.parentNode) {
                            wakePath.parentNode.removeChild(wakePath);
                        }
                    }, 2000);
                }
            }, 3000);
        });
        
        // Touch events for mobile
        wakeTrail.addEventListener('touchstart', function(e) {
            e.preventDefault();
            isDrawing = true;
            state.wakeTrailPoints = [];
            const touch = e.touches[0];
            addWakePoint(touch);
        });
        
        document.addEventListener('touchmove', function(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const touch = e.touches[0];
            addWakePoint(touch);
        });
        
        document.addEventListener('touchend', function() {
            isDrawing = false;
            
            setTimeout(() => {
                const wakePath = document.querySelector('.wake-path');
                if (wakePath) {
                    wakePath.style.opacity = '0';
                    wakePath.style.transition = 'opacity 2s';
                    
                    setTimeout(() => {
                        if (wakePath.parentNode) {
                            wakePath.parentNode.removeChild(wakePath);
                        }
                    }, 2000);
                }
            }, 3000);
        });
    }
    
    function addWakePoint(e) {
        const rect = wakeTrail.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        state.wakeTrailPoints.push({ x, y });
        
        // Draw the wake trail
        drawWakeTrail();
    }
    
    function drawWakeTrail() {
        // Remove existing wake path
        const existingPath = document.querySelector('.wake-path');
        if (existingPath) {
            existingPath.remove();
        }
        
        if (state.wakeTrailPoints.length < 2) return;
        
        // Create SVG path
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("class", "wake-path");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.zIndex = "5";
        svg.style.pointerEvents = "none";
        
        const path = document.createElementNS(svgNS, "path");
        
        // Create path data
        let pathData = `M ${state.wakeTrailPoints[0].x} ${state.wakeTrailPoints[0].y}`;
        
        for (let i = 1; i < state.wakeTrailPoints.length; i++) {
            const point = state.wakeTrailPoints[i];
            const prevPoint = state.wakeTrailPoints[i-1];
            
            // Smooth curve using quadratic bezier
            const controlX = (prevPoint.x + point.x) / 2;
            const controlY = (prevPoint.y + point.y) / 2;
            
            pathData += ` Q ${prevPoint.x} ${prevPoint.y}, ${controlX} ${controlY}`;
        }
        
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#00e5d8");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.style.filter = "drop-shadow(0 0 10px #00e5d8)";
        path.style.animation = "wake-glow 1.5s infinite alternate";
        
        svg.appendChild(path);
        wakeTrail.appendChild(svg);
        
        // Add CSS animation for wake glow if not already added
        if (!document.getElementById('wake-animation-style')) {
            const style = document.createElement('style');
            style.id = 'wake-animation-style';
            style.textContent = `
                @keyframes wake-glow {
                    0% { stroke: #00e5d8; filter: drop-shadow(0 0 5px #00e5d8); }
                    100% { stroke: #ffffff; filter: drop-shadow(0 0 15px #00e5d8); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========== ROTATION CONTROLS ==========
    function setupRotationControls() {
        rotateLeftBtn.addEventListener('click', function() {
            rotateDome(-15);
        });
        
        rotateRightBtn.addEventListener('click', function() {
            rotateDome(15);
        });
        
        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                rotateDome(-15);
            } else if (e.key === 'ArrowRight') {
                rotateDome(15);
            }
        });
        
        // Mouse drag rotation for dome
        const domeContainer = document.querySelector('.dome-container');
        let isDraggingDome = false;
        let startX = 0;
        
        domeContainer.addEventListener('mousedown', function(e) {
            isDraggingDome = true;
            startX = e.clientX;
            domeContainer.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDraggingDome) return;
            
            const deltaX = e.clientX - startX;
            rotateDome(deltaX * 0.5);
            startX = e.clientX;
        });
        
        document.addEventListener('mouseup', function() {
            isDraggingDome = false;
            domeContainer.style.cursor = 'grab';
        });
    }
    
    function rotateDome(degrees) {
        state.currentRotation += degrees;
        
        // Apply rotation to stars
        const stars = document.querySelectorAll('.star');
        const centerX = 50; // Percentage
        const centerY = 50; // Percentage
        
        stars.forEach(star => {
            // Parse current position
            const left = parseFloat(star.style.left);
            const top = parseFloat(star.style.top);
            
            // Convert to radians
            const rad = degrees * Math.PI / 180;
            
            // Calculate current angle and radius
            const dx = left - centerX;
            const dy = top - centerY;
            const radius = Math.sqrt(dx * dx + dy * dy);
            const currentAngle = Math.atan2(dy, dx);
            
            // Calculate new angle
            const newAngle = currentAngle + rad;
            
            // Calculate new position
            const newLeft = centerX + radius * Math.cos(newAngle);
            const newTop = centerY + radius * Math.sin(newAngle);
            
            // Update position with transition
            star.style.transition = 'left 0.5s, top 0.5s';
            star.style.left = `${newLeft}%`;
            star.style.top = `${newTop}%`;
            
            // Remove transition after animation completes
            setTimeout(() => {
                star.style.transition = '';
            }, 500);
        });
        
        // Rotate north star glow
        northStar.style.transform = `rotate(${state.currentRotation}deg)`;
    }

    // ========== CONTROL PANEL FUNCTIONS ==========
    function setupControlPanel() {
        // Star brightness control
        starBrightnessSlider.addEventListener('input', function() {
            const brightness = parseInt(this.value) / 100;
            const stars = document.querySelectorAll('.star, .north-star');
            
            stars.forEach(star => {
                const baseColor = getComputedStyle(star).backgroundColor;
                star.style.opacity = brightness;
                
                // Adjust glow based on brightness
                const currentBoxShadow = getComputedStyle(star).boxShadow;
                const newBoxShadow = currentBoxShadow.replace(
                    /rgba\(\d+, \d+, \d+, [^)]*\)/g, 
                    `rgba(255, 255, 255, ${brightness})`
                );
                star.style.boxShadow = newBoxShadow;
            });
        });
        
        // Current speed control
        currentSpeedSlider.addEventListener('input', animateOceanCurrents);
        
        // Wave intensity control
        waveIntensitySlider.addEventListener('input', animateOceanCurrents);
        
        // Reset view button
        resetViewBtn.addEventListener('click', function() {
            // Reset rotation
            state.currentRotation = 0;
            northStar.style.transform = 'rotate(0deg)';
            
            // Reset star positions
            createStarfield();
            
            // Clear constellation lines
            constellationLines.innerHTML = '';
            state.connectedConstellations = [];
            state.selectedStars = [];
            
            // Reset sliders
            starBrightnessSlider.value = 70;
            currentSpeedSlider.value = 50;
            waveIntensitySlider.value = 60;
            
            // Trigger slider events to update visuals
            starBrightnessSlider.dispatchEvent(new Event('input'));
            animateOceanCurrents();
            
            // Clear wake trail
            const wakePath = document.querySelector('.wake-path');
            if (wakePath && wakePath.parentNode) {
                wakePath.parentNode.removeChild(wakePath);
            }
            
            // Show reset confirmation
            showTemporaryMessage('Chart reset to default view');
        });
        
        // Night mode toggle
        nightModeBtn.addEventListener('click', function() {
            state.nightMode = !state.nightMode;
            
            if (state.nightMode) {
                document.body.classList.add('night-mode');
                this.innerHTML = '<i class="fas fa-sun"></i> Toggle Day Mode';
                
                // Enhance star brightness
                starBrightnessSlider.value = 90;
                starBrightnessSlider.dispatchEvent(new Event('input'));
                
                // Darken ocean
                document.querySelector('.ocean-currents').style.backgroundColor = 'rgba(5, 15, 25, 0.9)';
            } else {
                document.body.classList.remove('night-mode');
                this.innerHTML = '<i class="fas fa-moon"></i> Toggle Night Mode';
                
                // Reset star brightness
                starBrightnessSlider.value = 70;
                starBrightnessSlider.dispatchEvent(new Event('input'));
                
                // Reset ocean
                document.querySelector('.ocean-currents').style.backgroundColor = '';
            }
        });
        
        // Connect stars button
        connectStarsBtn.addEventListener('click', function() {
            state.isConnectingStars = !state.isConnectingStars;
            
            if (state.isConnectingStars) {
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-unlink"></i> Stop Connecting';
                showTemporaryMessage('Click stars to connect them. Match constellations!');
            } else {
                this.classList.remove('active');
                this.innerHTML = '<i class="fas fa-link"></i> Connect Constellations';
                
                // Clear temporary lines
                document.querySelectorAll('.temp-line').forEach(line => line.remove());
            }
        });
    }

    // ========== UTILITY FUNCTIONS ==========
    function showTemporaryMessage(message) {
        // Remove existing message
        const existingMessage = document.querySelector('.temp-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = 'temp-message';
        messageElement.textContent = message;
        
        // Style the message
        messageElement.style.position = 'fixed';
        messageElement.style.top = '20px';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translateX(-50%)';
        messageElement.style.backgroundColor = 'rgba(10, 26, 42, 0.9)';
        messageElement.style.color = '#ffcc00';
        messageElement.style.padding = '12px 24px';
        messageElement.style.borderRadius = '8px';
        messageElement.style.border = '2px solid #ffcc00';
        messageElement.style.zIndex = '1000';
        messageElement.style.boxShadow = '0 0 20px rgba(255, 204, 0, 0.5)';
        messageElement.style.fontFamily = 'var(--font-heading)';
        messageElement.style.fontSize = '1rem';
        messageElement.style.textAlign = 'center';
        messageElement.style.whiteSpace = 'nowrap';
        
        document.body.appendChild(messageElement);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    // ========== INITIALIZATION ==========
    function init() {
        console.log('Initializing Polynesian Wayfinding Chart...');
        
        // Create starfield
        createStarfield();
        
        // Create islands
        createIslands();
        
        // Set up ocean animations
        animateOceanCurrents();
        
        // Set up wake trail
        createWakeTrail();
        
        // Set up rotation controls
        setupRotationControls();
        
        // Set up control panel
        setupControlPanel();
        
        // Set up modal close
        modalClose.addEventListener('click', function() {
            constellationModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        constellationModal.addEventListener('click', function(e) {
            if (e.target === constellationModal) {
                constellationModal.style.display = 'none';
            }
        });
        
        // Add CSS for additional animations
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = `
            .star.selected {
                animation: selected-pulse 0.8s infinite alternate !important;
            }
            
            @keyframes selected-pulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                100% { transform: translate(-50%, -50%) scale(1.5); }
            }
            
            @keyframes line-draw {
                0% { clip-path: polygon(0 0, 0 100%, 0 100%, 0 0); }
                100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
            }
            
            .night-mode {
                --deep-ocean: #050f19;
                --ocean-midnight: #081828;
                --navy-blue: #0d2542;
            }
            
            .dome-btn.active {
                background: linear-gradient(to bottom, #ffcc00, #ff9900) !important;
                color: #0a1a2a !important;
                box-shadow: 0 0 20px #ffcc00 !important;
            }
            
            .dome-container {
                cursor: grab;
            }
        `;
        document.head.appendChild(additionalStyles);
        
        // Show welcome message
        setTimeout(() => {
            showTemporaryMessage('Welcome, Navigator! Explore the celestial dome and ocean currents.');
        }, 1000);
        
        console.log('Initialization complete!');
    }

    // Start everything
    init();
});