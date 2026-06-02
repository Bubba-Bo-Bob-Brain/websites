// scripts.js
// OPERATION: IRON RESOLVE - War Room Interactivity

// ========== GLOBAL STATE & INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('SUPREME COMMAND HQ // SYSTEM INITIALIZED');

    // State
    const state = {
        deployedUnits: [],
        radioMessages: [],
        currentPosterIndex: 0,
        isRadioCrackleOn: true,
        isRadioFeedPaused: false,
        gaugeValues: {
            industry: 85,
            manpower: 72,
            fuel: 58
        },
        resources: {
            tankQuota: 874,
            tankTarget: 1000
        },
        clockInterval: null,
        radioInterval: null,
        posterInterval: null
    };

    // DOM Elements
    const elements = {
        // Clock & Date
        liveClock: document.getElementById('live-clock'),
        // Map & Lighting
        strategyMap: document.getElementById('strategy-map'),
        mapGrid: document.getElementById('map-grid'),
        overheadLamp: document.getElementById('overhead-lamp'),
        deployedUnitsContainer: document.getElementById('deployed-units-container'),
        // Unit Deployment
        unitTokensContainer: document.getElementById('unit-tokens-container'),
        unitTokens: document.querySelectorAll('.unit-token'),
        // Radio Feed
        radioFeed: document.getElementById('radio-feed'),
        radioCrackleToggle: document.getElementById('radio-crackle-toggle'),
        radioFeedPause: document.getElementById('radio-feed-pause'),
        // Gauges
        gaugeIndustryFill: document.getElementById('gauge-industry-fill'),
        gaugeIndustryNeedle: document.getElementById('gauge-industry-needle'),
        gaugeManpowerFill: document.getElementById('gauge-manpower-fill'),
        gaugeManpowerNeedle: document.getElementById('gauge-manpower-needle'),
        gaugeFuelFill: document.getElementById('gauge-fuel-fill'),
        gaugeFuelNeedle: document.getElementById('gauge-fuel-needle'),
        gaugeIndustryValue: document.querySelector('#gauge-industry .gauge-value'),
        gaugeManpowerValue: document.querySelector('#gauge-manpower .gauge-value'),
        gaugeFuelValue: document.querySelector('#gauge-fuel .gauge-value'),
        quotaBar: document.querySelector('.quota-bar'),
        quotaNumbers: document.querySelector('.quota-numbers'),
        // Propaganda
        posters: document.querySelectorAll('.poster'),
        posterDots: document.querySelectorAll('.dot'),
        prevPosterBtn: document.querySelector('.prev-poster'),
        nextPosterBtn: document.querySelector('.next-poster'),
        // Audio
        audioCrackle: document.getElementById('audio-crackle'),
        audioHum: document.getElementById('audio-hum'),
        audioClick: document.getElementById('audio-click')
    };

    // ========== INITIALIZATION ==========
    function init() {
        setupCanvasMap();
        setupRealTimeClock();
        setupDraggableUnits();
        setupRadioFeed();
        setupGauges();
        setupPosterRotation();
        setupAudio();
        updateProductionTotals();
        startAmbientUpdates();
        
        // Initial UI updates
        updateGauges();
        updateQuotaDisplay();
        
        console.log('ALL SYSTEMS OPERATIONAL');
    }

    // ========== CANVAS MAP WITH LIGHTING EFFECT ==========
    function setupCanvasMap() {
        const canvas = elements.strategyMap;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Draw a stylized European theatre map
        function drawMap() {
            // Clear with parchment color
            ctx.fillStyle = '#e8dfca';
            ctx.fillRect(0, 0, width, height);

            // Draw landmasses with a rough, hand-drawn look
            ctx.strokeStyle = '#2c1810';
            ctx.lineWidth = 3;
            ctx.fillStyle = '#d4c9b1';

            // Simplified Europe outline
            ctx.beginPath();
            ctx.moveTo(200, 150); // Iberia
            ctx.bezierCurveTo(250, 100, 300, 120, 350, 130); // France
            ctx.bezierCurveTo(450, 140, 500, 180, 550, 200); // Germany
            ctx.bezierCurveTo(600, 250, 650, 300, 700, 350); // Eastern Europe
            ctx.bezierCurveTo(650, 400, 600, 450, 500, 500); // Balkans
            ctx.bezierCurveTo(400, 550, 300, 600, 200, 650); // Italy/Greece
            ctx.bezierCurveTo(150, 550, 100, 450, 100, 350); // Back to start
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Add some topographic lines
            ctx.strokeStyle = '#2c181055';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const offset = 20 + i * 15;
                ctx.beginPath();
                ctx.ellipse(400, 350, 250 - offset, 200 - offset, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Label key locations
            ctx.fillStyle = '#2c1810';
            ctx.font = 'bold 16px "Special Elite", cursive';
            ctx.fillText('RUHR VALLEY', 420, 280);
            ctx.fillText('NORMANDY', 280, 200);
            ctx.fillText('ARDENNES', 380, 220);
            ctx.fillText('BAVARIA', 480, 320);

            // Draw a subtle compass rose
            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(100, 100);
            ctx.lineTo(100, 80);
            ctx.moveTo(100, 100);
            ctx.lineTo(120, 100);
            ctx.moveTo(100, 100);
            ctx.lineTo(95, 105);
            ctx.moveTo(100, 100);
            ctx.lineTo(105, 95);
            ctx.stroke();
            ctx.fillText('N', 98, 70);
        }

        // Create lighting effect overlay (circle gradient)
        function createLightOverlay() {
            const gradient = ctx.createRadialGradient(
                width/2, height/3, 50,
                width/2, height/3, 300
            );
            gradient.addColorStop(0, 'rgba(255, 204, 119, 0.15)');
            gradient.addColorStop(0.5, 'rgba(255, 204, 119, 0.05)');
            gradient.addColorStop(1, 'rgba(255, 204, 119, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        drawMap();
        createLightOverlay();

        // Make the lighting effect dynamic (flicker with lamp)
        function updateLighting() {
            // Clear and redraw
            ctx.clearRect(0, 0, width, height);
            drawMap();
            
            // Vary the intensity based on lamp flicker
            const flickerIntensity = 0.1 + Math.random() * 0.1;
            const gradient = ctx.createRadialGradient(
                width/2, height/3, 30 + Math.random() * 20,
                width/2, height/3, 250 + Math.random() * 50
            );
            gradient.addColorStop(0, `rgba(255, 204, 119, ${0.1 + flickerIntensity})`);
            gradient.addColorStop(0.5, `rgba(255, 204, 119, ${0.03 + flickerIntensity/2})`);
            gradient.addColorStop(1, 'rgba(255, 204, 119, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        // Animate lamp flicker effect on canvas
        setInterval(updateLighting, 100);
    }

    // ========== REAL-TIME CLOCK ==========
    function setupRealTimeClock() {
        function updateClock() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            elements.liveClock.textContent = timeString;
            
            // Add a subtle blink effect to the colon
            if (now.getSeconds() % 2 === 0) {
                elements.liveClock.style.textShadow = '0 0 8px var(--color-radio-green)';
            } else {
                elements.liveClock.style.textShadow = 'var(--glow-radio)';
            }
        }
        
        updateClock();
        state.clockInterval = setInterval(updateClock, 1000);
    }

    // ========== DRAGGABLE UNIT DEPLOYMENT ==========
    function setupDraggableUnits() {
        const container = elements.deployedUnitsContainer;
        
        // Add drag event listeners to all unit tokens
        elements.unitTokens.forEach(token => {
            token.addEventListener('dragstart', handleDragStart);
            token.addEventListener('dragend', handleDragEnd);
        });
        
        // Allow drops on the map container
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
        
        function handleDragStart(e) {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                type: this.dataset.unitType,
                label: this.querySelector('.token-label').textContent,
                strength: this.dataset.strength,
                id: Date.now() + Math.random()
            }));
            
            this.classList.add('dragging');
            playSound('click');
            
            // Create a ghost image
            const ghost = this.cloneNode(true);
            ghost.style.opacity = '0.7';
            ghost.style.position = 'absolute';
            ghost.style.zIndex = '1000';
            ghost.style.pointerEvents = 'none';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 20, 20);
            
            setTimeout(() => document.body.removeChild(ghost), 0);
        }
        
        function handleDragEnd(e) {
            this.classList.remove('dragging');
        }
        
        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Visual feedback for valid drop zone
            container.style.border = '2px dashed var(--color-incandescent)';
        }
        
        function handleDrop(e) {
            e.preventDefault();
            container.style.border = 'none';
            
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const rect = container.getBoundingClientRect();
            
            // Calculate position relative to map container
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Ensure unit stays within bounds
            const boundedX = Math.max(20, Math.min(x, rect.width - 60));
            const boundedY = Math.max(20, Math.min(y, rect.height - 60));
            
            deployUnit(data, boundedX, boundedY);
            playSound('click');
        }
        
        function deployUnit(unitData, x, y) {
            const unitId = unitData.id;
            
            // Create deployed unit element
            const deployedUnit = document.createElement('div');
            deployedUnit.className = 'deployed-unit';
            deployedUnit.dataset.unitId = unitId;
            deployedUnit.style.position = 'absolute';
            deployedUnit.style.left = `${x}px`;
            deployedUnit.style.top = `${y}px`;
            deployedUnit.style.zIndex = '10';
            deployedUnit.style.pointerEvents = 'auto';
            deployedUnit.style.cursor = 'move';
            
            // Determine icon based on type
            let icon = '♜';
            if (unitData.type === 'armor') icon = '♞';
            if (unitData.type === 'air') icon = '♝';
            if (unitData.type === 'logistics') icon = '♟';
            
            deployedUnit.innerHTML = `
                <div class="deployed-token" style="
                    background: linear-gradient(145deg, var(--color-steel-medium), var(--color-steel-dark));
                    border: 2px solid var(--color-rivet);
                    border-radius: 4px;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    position: relative;
                ">
                    <div style="font-size: 1.5rem;">${icon}</div>
                    <div style="font-size: 0.6rem; color: var(--color-text-accent); margin-top: 2px;">${unitData.label.split(' ')[0]}</div>
                    <div style="position: absolute; bottom: 2px; right: 2px; font-size: 0.5rem; color: var(--color-text-dim);">${unitData.strength}%</div>
                </div>
            `;
            
            // Add to deployed units
            elements.deployedUnitsContainer.appendChild(deployedUnit);
            state.deployedUnits.push({
                ...unitData,
                x, y,
                element: deployedUnit
            });
            
            // Make deployed units draggable as well
            deployedUnit.addEventListener('mousedown', startDragDeployedUnit);
            
            // Add to radio feed
            addRadioMessage({
                time: new Date().toLocaleTimeString('en-GB', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                content: `UNIT DEPLOYED: ${unitData.label} to GRID ${getGridReference(x, y)}`,
                source: 'COMMAND'
            });
            
            updateProductionTotals();
        }
        
        function startDragDeployedUnit(e) {
            const unitElement = e.currentTarget;
            const unitId = unitElement.dataset.unitId;
            const unit = state.deployedUnits.find(u => u.id == unitId);
            
            if (!unit) return;
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = parseInt(unitElement.style.left);
            const startTop = parseInt(unitElement.style.top);
            
            function handleMouseMove(e) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                unitElement.style.left = `${startLeft + dx}px`;
                unitElement.style.top = `${startTop + dy}px`;
                
                unit.x = startLeft + dx;
                unit.y = startTop + dy;
            }
            
            function handleMouseUp() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                
                // Update radio feed with movement
                addRadioMessage({
                    time: new Date().toLocaleTimeString('en-GB', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                    content: `UNIT RELOCATED: ${unit.label} to GRID ${getGridReference(unit.x, unit.y)}`,
                    source: 'COMMAND'
                });
            }
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        
        function getGridReference(x, y) {
            const gridSize = 50; // matches CSS grid size
            const col = String.fromCharCode(65 + Math.floor(x / gridSize)); // A, B, C...
            const row = Math.floor(y / gridSize) + 1;
            return `${col}-${row}`;
        }
    }
    
    function updateProductionTotals() {
        const totalDeployed = state.deployedUnits.length;
        const totalReady = 4; // Hardcoded for now, could be dynamic
        
        document.querySelector('.total-value').textContent = totalReady - totalDeployed;
    }

    // ========== DYNAMIC RADIO FEED ==========
    function setupRadioFeed() {
        // Predefined intercept messages for variety
        const interceptTemplates = [
            { content: "ENEMY PATROL SIGHTED IN SECTOR {GRID}. ESTIMATE PLATOON STRENGTH.", source: "FORWARD OBSERVER" },
            { content: "WEATHER UPDATE: FOG EXPECTED TO CLEAR BY {HOUR}:00.", source: "MET OFFICE" },
            { content: "SUPPLY CONVOY {NUMBER} ARRIVED AT DEPOT {GRID}.", source: "LOGISTICS" },
            { content: "PARTISAN CONTACT ESTABLISHED. AWAITING INTELLIGENCE PACKAGE.", source: "RESISTANCE" },
            { content: "AERIAL RECON SHOWS MOVEMENT AT {GRID}. POSSIBLE ARMOR.", source: "EAGLE SQUADRON" },
            { content: "COMMS CHECK: ALL VHF CHANNELS OPERATIONAL.", source: "SIGNALS" },
            { content: "DECRYPTION UPDATE: NEW ENIGMA PATTERN DETECTED.", source: "BLETCHLEY" },
            { content: "CIVILIAN REPORTS OF STRANGE LIGHTS NEAR {GRID}. INVESTIGATING.", source: "LOCAL MILITIA" }
        ];
        
        // Add initial messages from HTML
        const initialMessages = Array.from(elements.radioFeed.querySelectorAll('.intercept-message')).map(msg => ({
            time: msg.querySelector('.message-time').textContent,
            content: msg.querySelector('.message-content').textContent,
            source: msg.querySelector('.message-source').textContent.replace('SOURCE: ', '')
        }));
        
        state.radioMessages = [...initialMessages];
        
        // Set up control buttons
        elements.radioCrackleToggle.addEventListener('click', toggleCrackle);
        elements.radioFeedPause.addEventListener('click', togglePause);
        
        // Generate new intercepts periodically
        state.radioInterval = setInterval(() => {
            if (!state.isRadioFeedPaused) {
                generateNewIntercept();
            }
        }, 10000); // Every 10 seconds
        
        function generateNewIntercept() {
            const template = interceptTemplates[Math.floor(Math.random() * interceptTemplates.length)];
            
            // Replace placeholders
            let content = template.content;
            content = content.replace('{GRID}', getRandomGrid());
            content = content.replace('{HOUR}', Math.floor(Math.random() * 6) + 6);
            content = content.replace('{NUMBER}', Math.floor(Math.random() * 100) + 1);
            
            const newMessage = {
                time: new Date().toLocaleTimeString('en-GB', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                content: content,
                source: template.source
            };
            
            addRadioMessage(newMessage);
        }
        
        function getRandomGrid() {
            const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            return `${cols[Math.floor(Math.random() * cols.length)]}-${rows[Math.floor(Math.random() * rows.length)]}`;
        }
    }
    
    function addRadioMessage(message) {
        state.radioMessages.unshift(message);
        
        // Keep only last 10 messages
        if (state.radioMessages.length > 10) {
            state.radioMessages.pop();
        }
        
        updateRadioDisplay();
    }
    
    function updateRadioDisplay() {
        const feed = elements.radioFeed;
        feed.innerHTML = '';
        
        state.radioMessages.forEach((msg, index) => {
            const messageEl = document.createElement('div');
            messageEl.className = 'intercept-message';
            if (index === 0) messageEl.classList.add('new');
            
            messageEl.innerHTML = `
                <div class="message-time">${msg.time}</div>
                <div class="message-content">${msg.content}</div>
                <div class="message-source">SOURCE: ${msg.source}</div>
            `;
            
            feed.appendChild(messageEl);
        });
        
        // Auto-scroll to top for new messages
        feed.scrollTop = 0;
    }
    
    function toggleCrackle() {
        state.isRadioCrackleOn = !state.isRadioCrackleOn;
        
        if (state.isRadioCrackleOn) {
            elements.audioCrackle.play();
            elements.radioCrackleToggle.textContent = 'CRACKLE: ON';
            elements.radioCrackleToggle.setAttribute('aria-pressed', 'true');
        } else {
            elements.audioCrackle.pause();
            elements.radioCrackleToggle.textContent = 'CRACKLE: OFF';
            elements.radioCrackleToggle.setAttribute('aria-pressed', 'false');
        }
        
        playSound('click');
    }
    
    function togglePause() {
        state.isRadioFeedPaused = !state.isRadioFeedPaused;
        elements.radioFeedPause.textContent = state.isRadioFeedPaused ? 'RESUME FEED' : 'PAUSE FEED';
        playSound('click');
    }

    // ========== DYNAMIC GAUGES ==========
    function setupGauges() {
        // Simulate fluctuating resource levels
        setInterval(() => {
            // Random small fluctuations
            state.gaugeValues.industry += (Math.random() - 0.5) * 2;
            state.gaugeValues.manpower += (Math.random() - 0.5) * 1.5;
            state.gaugeValues.fuel += (Math.random() - 0.5) * 3;
            
            // Clamp values between 20 and 100
            state.gaugeValues.industry = Math.max(20, Math.min(100, state.gaugeValues.industry));
            state.gaugeValues.manpower = Math.max(20, Math.min(100, state.gaugeValues.manpower));
            state.gaugeValues.fuel = Math.max(20, Math.min(100, state.gaugeValues.fuel));
            
            // Update tank quota (slow progress)
            if (Math.random() > 0.7 && state.resources.tankQuota < state.resources.tankTarget) {
                state.resources.tankQuota += Math.floor(Math.random() * 5);
            }
            
            updateGauges();
            updateQuotaDisplay();
        }, 5000); // Update every 5 seconds
    }
    
    function updateGauges() {
        // Industry Gauge
        const industryValue = state.gaugeValues.industry;
        const industryArcLength = (industryValue / 100) * 94; // 94 is approx path length
        elements.gaugeIndustryFill.style.strokeDasharray = `${industryArcLength} 1000`;
        elements.gaugeIndustryNeedle.style.transform = `rotate(${45 + (industryValue / 100) * 180}deg)`;
        elements.gaugeIndustryValue.textContent = `${Math.round(industryValue)}%`;
        
        // Manpower Gauge
        const manpowerValue = state.gaugeValues.manpower;
        const manpowerArcLength = (manpowerValue / 100) * 94;
        elements.gaugeManpowerFill.style.strokeDasharray = `${manpowerArcLength} 1000`;
        elements.gaugeManpowerNeedle.style.transform = `rotate(${45 + (manpowerValue / 100) * 180}deg)`;
        elements.gaugeManpowerValue.textContent = `${Math.round(manpowerValue)}%`;
        
        // Fuel Gauge
        const fuelValue = state.gaugeValues.fuel;
        const fuelArcLength = (fuelValue / 100) * 94;
        elements.gaugeFuelFill.style.strokeDasharray = `${fuelArcLength} 1000`;
        elements.gaugeFuelNeedle.style.transform = `rotate(${45 + (fuelValue / 100) * 180}deg)`;
        elements.gaugeFuelValue.textContent = `${Math.round(fuelValue)}%`;
        
        // Change color based on value
        const setGaugeColor = (gaugeFill, value) => {
            if (value < 40) {
                gaugeFill.style.stroke = 'var(--color-gauge-red)';
            } else if (value < 70) {
                gaugeFill.style.stroke = 'var(--color-gauge-yellow)';
            } else {
                gaugeFill.style.stroke = 'var(--color-gauge-green)';
            }
        };
        
        setGaugeColor(elements.gaugeIndustryFill, industryValue);
        setGaugeColor(elements.gaugeManpowerFill, manpowerValue);
        setGaugeColor(elements.gaugeFuelFill, fuelValue);
    }
    
    function updateQuotaDisplay() {
        const percentage = (state.resources.tankQuota / state.resources.tankTarget) * 100;
        elements.quotaBar.style.width = `${percentage}%`;
        elements.quotaNumbers.textContent = `${state.resources.tankQuota} / ${state.resources.tankTarget}`;
        
        // Add celebratory effect if quota reached
        if (state.resources.tankQuota >= state.resources.tankTarget) {
            elements.quotaBar.style.background = 'linear-gradient(to right, var(--color-gauge-green), var(--color-incandescent))';
            elements.quotaNumbers.style.color = 'var(--color-incandescent)';
            
            if (!document.querySelector('.quota-celebration')) {
                const celebration = document.createElement('div');
                celebration.className = 'quota-celebration';
                celebration.style.position = 'absolute';
                celebration.style.top = '0';
                celebration.style.left = '0';
                celebration.style.right = '0';
                celebration.style.bottom = '0';
                celebration.style.background = 'radial-gradient(circle, var(--color-incandescent-dim) 0%, transparent 70%)';
                celebration.style.zIndex = '1';
                celebration.style.animation = 'pulse 2s infinite';
                document.querySelector('.quota-progress').appendChild(celebration);
                
                // Add to radio feed
                addRadioMessage({
                    time: new Date().toLocaleTimeString('en-GB', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                    content: 'PRODUCTION MILESTONE ACHIEVED: WEEKLY TANK QUOTA MET!',
                    source: 'INDUSTRY COMMISSAR'
                });
            }
        }
    }

    // ========== PROPAGANDA POSTER ROTATION ==========
    function setupPosterRotation() {
        function showPoster(index) {
            // Validate index
            if (index < 0) index = elements.posters.length - 1;
            if (index >= elements.posters.length) index = 0;
            
            // Update state
            state.currentPosterIndex = index;
            
            // Update posters
            elements.posters.forEach((poster, i) => {
                poster.classList.toggle('active', i === index);
            });
            
            // Update dots
            elements.posterDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            playSound('click');
        }
        
        // Event listeners for manual control
        elements.prevPosterBtn.addEventListener('click', () => {
            showPoster(state.currentPosterIndex - 1);
        });
        
        elements.nextPosterBtn.addEventListener('click', () => {
            showPoster(state.currentPosterIndex + 1);
        });
        
        // Auto-rotate every 15 seconds
        state.posterInterval = setInterval(() => {
            showPoster((state.currentPosterIndex + 1) % elements.posters.length);
        }, 15000);
    }

    // ========== AUDIO SYSTEM ==========
    function setupAudio() {
        // Start ambient hum
        elements.audioHum.volume = 0.2;
        elements.audioHum.play().catch(e => console.log('Audio play prevented:', e));
        
        // Start with crackle off (user can toggle on)
        elements.audioCrackle.volume = 0.1;
        
        // Set click sound volume
        elements.audioClick.volume = 0.3;
    }
    
    function playSound(soundName) {
        try {
            if (soundName === 'click') {
                elements.audioClick.currentTime = 0;
                elements.audioClick.play();
            }
        } catch (e) {
            // Silent fail for audio
        }
    }

    // ========== AMBIENT UPDATES & EFFECTS ==========
    function startAmbientUpdates() {
        // Random status light flicker
        setInterval(() => {
            const lights = document.querySelectorAll('.status-light');
            lights.forEach(light => {
                if (Math.random() > 0.8 && light.classList.contains('active')) {
                    light.style.opacity = '0.5';
                    setTimeout(() => {
                        light.style.opacity = '1';
                    }, 100);
                }
            });
        }, 3000);
        
        // Occasionally add system status messages
        setInterval(() => {
            if (Math.random() > 0.7) {
                const messages = [
                    "SYSTEM CHECK: ALL COMMS NOMINAL.",
                    "POWER GRID STABLE. AUXILIARY GENERATORS ON STANDBY.",
                    "CIPHER MACHINE RE-KEYED AS SCHEDULED.",
                    "MAP DATABASE UPDATED WITH LATEST RECON.",
                    "ENCRYPTION LEVEL: MAXIMUM. ALL CHANNELS SECURE."
                ];
                
                addRadioMessage({
                    time: new Date().toLocaleTimeString('en-GB', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                    content: messages[Math.floor(Math.random() * messages.length)],
                    source: 'SYSTEM'
                });
            }
        }, 30000); // Every 30 seconds
    }

    // ========== START EVERYTHING ==========
    init();

    // ========== EXPOSE FOR DEBUGGING (optional) ==========
    window.warRoomState = state;
    window.warRoomElements = elements;
});