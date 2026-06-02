/* ============================================
ABYSSAL STATION-7 | Deep Sea Research Dashboard
JavaScript - Interactive Functionality
============================================ */

(function() {
    'use strict';

    // Global State
    const state = {
        depth: 3847,
        targetDepth: 3847,
        missionStartTime: Date.now(),
        isRecording: false,
        floodlightOn: false,
        sonarActive: true,
        bioContacts: [],
        systemStatus: {
            power: 87,
            o2: 94,
            comms: 73
        }
    };

    // DOM Elements cache
    const elements = {};

    // ============================================
    // Initialization
    // ============================================
    function init() {
        cacheElements();
        createBioParticles();
        createViewportParticles();
        initCurrentFlow();
        initSonarCanvas();
        initBioContacts();
        setupEventListeners();
        startSimulation();
    }

    function cacheElements() {
        elements.depthValue = document.getElementById('depth-value');
        elements.depthBarFill = document.getElementById('depth-bar-fill');
        elements.depthDisplay = document.getElementById('depth-display');
        elements.depthBar = document.querySelector('.depth-bar');
        elements.missionTime = document.getElementById('mission-time');
        elements.hullPressure = document.getElementById('hull-pressure');
        elements.hullStress = document.getElementById('hull-stress');
        elements.hullTemp = document.getElementById('hull-temp');
        elements.integrityFill = document.getElementById('integrity-fill');
        elements.hullStatus = document.getElementById('hull-status');
        elements.pressureValue = document.getElementById('pressure-value');
        elements.pressureArc = document.getElementById('pressure-arc');
        elements.pressureNeedle = document.getElementById('pressure-needle');
        elements.warningBar = document.getElementById('warning-bar');
        elements.powerFill = document.getElementById('power-fill');
        elements.o2Fill = document.getElementById('o2-fill');
        elements.commsFill = document.getElementById('comms-fill');
        elements.alertPanel = document.getElementById('alert-panel');
        elements.alertMessage = document.getElementById('alert-message');
        elements.sonarPingBtn = document.getElementById('sonar-ping-btn');
        elements.floodlightBtn = document.getElementById('floodlight-btn');
        elements.recordBtn = document.getElementById('record-btn');
        elements.sonarRipples = document.getElementById('sonar-ripples');
        elements.viewportParticles = document.getElementById('viewport-particles');
        elements.bioParticles = document.getElementById('bio-particles');
        elements.currentFlowCanvas = document.getElementById('current-flow-canvas');
        elements.sonarCanvas = document.getElementById('sonar-canvas');
        elements.bioGrid = document.getElementById('bio-grid');
        elements.bioLog = document.getElementById('bio-log');
        elements.bioCount = document.getElementById('bio-count');
        elements.visibilityValue = document.getElementById('visibility-value');
        elements.waterTemp = document.getElementById('water-temp');
        elements.stationCoords = document.getElementById('station-coords');
        elements.sonarBlips = document.getElementById('sonar-blips');
        elements.sonarBearing = document.getElementById('sonar-bearing');
    }

    // ============================================
    // Bio Particles (Behind UI)
    // ============================================
    function createBioParticles() {
        const container = elements.bioParticles;
        if (!container) return;
        
        const particleCount = 25;
        const colors = ['#00ffcc', '#00aaff', '#aa00ff', '#ff00aa'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'bio-particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 15) + 's';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + particle.style.background;
            container.appendChild(particle);
        }
    }

    // ============================================
    // Viewport Particles
    // ============================================
    function createViewportParticles() {
        const container = elements.viewportParticles;
        if (!container) return;
        
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'viewport-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            const pSize = Math.random() * 3 + 1;
            particle.style.width = pSize + 'px';
            particle.style.height = pSize + 'px';
            particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
            particle.style.animationDelay = (Math.random() * 20) + 's';
            container.appendChild(particle);
        }
    }

    // ============================================
    // Current Flow Visualization
    // ============================================
    function initCurrentFlow() {
        const canvas = elements.currentFlowCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function FlowParticle() {
            this.reset = function() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = Math.random() * 0.3 + 0.1;
                this.size = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.3 + 0.1;
            };
            
            this.update = function() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
                    this.reset();
                    this.y = 0;
                }
            };
            
            this.draw = function() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 204, ' + this.opacity + ')';
                ctx.fill();
            };
            
            this.reset();
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new FlowParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ============================================
    // Sonar Canvas
    // ============================================
    function initSonarCanvas() {
        const canvas = elements.sonarCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let blips = [];

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        resize();
        window.addEventListener('resize', resize);

        function SonarBlip() {
            this.angle = Math.random() * Math.PI * 2;
            this.distance = Math.random() * 150 + 30;
            this.size = Math.random() * 3 + 2;
            this.opacity = 1;
            this.fadeSpeed = Math.random() * 0.01 + 0.005;
            this.color = Math.random() > 0.7 ? '#ffaa00' : '#00ffcc';
            
            this.update = function() {
                this.opacity -= this.fadeSpeed;
                return this.opacity > 0;
            };
            
            this.draw = function(centerX, centerY) {
                const x = centerX + Math.cos(this.angle) * this.distance;
                const y = centerY + Math.sin(this.angle) * this.distance;
                ctx.beginPath();
                ctx.arc(x, y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            };
        }

        function animate() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            blips = blips.filter(function(b) { return b.update(); });
            for (let i = 0; i < blips.length; i++) {
                blips[i].draw(centerX, centerY);
            }
            
            if (Math.random() < 0.03) {
                blips.push(new SonarBlip());
            }
            requestAnimationFrame(animate);
        }
        
        animate();
        
        for (let i = 0; i < 5; i++) {
            blips.push(new SonarBlip());
        }
    }

    // ============================================
    // Bio Contacts
    // ============================================
    function initBioContacts() {
        const grid = elements.bioGrid;
        if (!grid) return;
        
        const contactTypes = ['unknown', 'class-a', 'class-b'];
        grid.innerHTML = '';
        state.bioContacts = [];
        
        for (let i = 0; i < 9; i++) {
            const contact = document.createElement('div');
            contact.className = 'bio-contact';
            const type = contactTypes[Math.floor(Math.random() * contactTypes.length)];
            const isActive = Math.random() > 0.3;
            
            if (isActive) {
                contact.classList.add('active');
                const dot = document.createElement('div');
                dot.className = 'bio-contact-dot ' + type;
                contact.appendChild(dot);
                
                const label = document.createElement('span');
                label.className = 'bio-contact-label';
                label.textContent = 'BIO-' + (i + 1);
                contact.appendChild(label);
                
                state.bioContacts.push({ id: i + 1, type: type, active: true });
            }
            grid.appendChild(contact);
        }
        updateBioCount();
    }

    function updateBioCount() {
        if (!elements.bioCount) return;
        const count = state.bioContacts.filter(function(c) { return c.active; }).length;
        elements.bioCount.textContent = count;
    }

    function addBioLogEntry(event) {
        if (!elements.bioLog) return;
        
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = '<span class="log-time">' + time + '</span><span class="log-event">' + event + '</span>';
        elements.bioLog.insertBefore(entry, elements.bioLog.firstChild);
        
        if (elements.bioLog.children.length > 5) {
            elements.bioLog.removeChild(elements.bioLog.lastChild);
        }
    }

    // ============================================
    // Event Listeners
    // ============================================
    function setupEventListeners() {
        if (elements.sonarPingBtn) {
            elements.sonarPingBtn.addEventListener('click', triggerSonarPing);
        }
        
        if (elements.floodlightBtn) {
            elements.floodlightBtn.addEventListener('click', function() {
                state.floodlightOn = !state.floodlightOn;
                elements.floodlightBtn.classList.toggle('active', state.floodlightOn);
                updateFloodlight();
            });
        }
        
        if (elements.recordBtn) {
            elements.recordBtn.addEventListener('click', function() {
                state.isRecording = !state.isRecording;
                elements.recordBtn.classList.toggle('active', state.isRecording);
                elements.recordBtn.querySelector('.btn-icon').textContent = state.isRecording ? '■' : '●';
            });
        }
    }

    // ============================================
    // Sonar Ping
    // ============================================
    function triggerSonarPing() {
        if (!elements.sonarRipples) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'sonar-ripple';
        elements.sonarRipples.appendChild(ripple);
        
        setTimeout(function() {
            ripple.remove();
        }, 3000);
        
        playSonarPing();
    }

    function playSonarPing() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            // Audio not supported
        }
    }

    // ============================================
    // Floodlight
    // ============================================
    function updateFloodlight() {
        const viewportGlass = document.querySelector('.viewport-glass');
        if (!viewportGlass) return;
        
        if (state.floodlightOn) {
            viewportGlass.style.background = 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 220, 0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(255, 255, 200, 0.2) 0%, transparent 40%), linear-gradient(180deg, rgba(60, 50, 40, 0.6) 0%, rgba(40, 50, 60, 0.8) 50%, rgba(30, 40, 50, 0.9) 100%)';
        } else {
            viewportGlass.style.background = 'radial-gradient(ellipse at 50% 30%, rgba(0, 40, 60, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(0, 30, 50, 0.3) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 20, 30, 0.9) 0%, rgba(0, 30, 40, 0.95) 50%, rgba(0, 20, 30, 0.9) 100%)';
        }
    }

    // ============================================
    // Depth Simulation
    // ============================================
    function updateDepth() {
        state.depth += (state.targetDepth - state.depth) * 0.02;
        
        if (Math.random() < 0.02) {
            state.targetDepth += (Math.random() - 0.5) * 20;
            state.targetDepth = Math.max(3500, Math.min(4200, state.targetDepth));
        }
        
        if (elements.depthValue) {
            elements.depthValue.textContent = Math.round(state.depth).toLocaleString();
        }
        
        const depthPercent = (state.depth / 6000) * 100;
        if (elements.depthBarFill) {
            elements.depthBarFill.style.width = depthPercent + '%';
        }
        
        if (state.depth > 4000) {
            if (elements.depthDisplay) elements.depthDisplay.classList.add('danger');
            if (elements.depthBar) elements.depthBar.classList.add('danger');
        } else {
            if (elements.depthDisplay) elements.depthDisplay.classList.remove('danger');
            if (elements.depthBar) elements.depthBar.classList.remove('danger');
        }
        
        const pressure = (state.depth / 10).toFixed(1);
        if (elements.pressureValue) elements.pressureValue.textContent = pressure;
        if (elements.hullPressure) elements.hullPressure.textContent = pressure;
        
        const arcLength = 251;
        const pressurePercent = Math.min(state.depth / 5000, 1);
        if (elements.pressureArc) {
            elements.pressureArc.style.strokeDashoffset = arcLength * (1 - pressurePercent);
        }
        
        const needleRotation = -90 + (pressurePercent * 180);
        if (elements.pressureNeedle) {
            elements.pressureNeedle.style.transform = 'rotate(' + needleRotation + 'deg)';
        }
        
        updateWarningBar(state.depth);
        
        const temp = (3.5 - (state.depth / 6000) * 2).toFixed(1);
        if (elements.hullTemp) elements.hullTemp.textContent = temp;
        if (elements.waterTemp) elements.waterTemp.textContent = temp + '°C';
        
        const visibility = (15 - (state.depth / 6000) * 8).toFixed(1);
        if (elements.visibilityValue) elements.visibilityValue.textContent = visibility + 'm';
    }

    function updateWarningBar(depth) {
        if (!elements.warningBar) return;
        
        const segments = elements.warningBar.querySelectorAll('.warning-segment');
        const dangerLevel = Math.max(0, (depth - 3800) / 400);
        
        segments.forEach(function(seg, i) {
            const segThreshold = (i + 1) / segments.length;
            seg.classList.remove('active', 'warning');
            if (dangerLevel >= segThreshold) {
                seg.classList.add('active');
            } else if (dangerLevel >= segThreshold - 0.2) {
                seg.classList.add('warning');
            }
        });
        
        if (dangerLevel > 0.8) {
            elements.warningBar.classList.add('alert');
        } else {
            elements.warningBar.classList.remove('alert');
        }
    }

    // ============================================
    // Hull Integrity
    // ============================================
    function updateHullIntegrity() {
        if (!elements.hullStress) return;
        
        const stress = 10 + Math.sin(Date.now() / 5000) * 5 + Math.random() * 2;
        elements.hullStress.textContent = stress.toFixed(1);
        
        const integrity = Math.max(0, 100 - stress * 2);
        
        if (elements.integrityFill) {
            elements.integrityFill.style.width = integrity + '%';
            
            if (integrity < 30) {
                elements.integrityFill.classList.add('critical');
                if (elements.hullStatus) {
                    elements.hullStatus.textContent = 'CRITICAL';
                    elements.hullStatus.classList.remove('healthy');
                    elements.hullStatus.classList.add('critical');
                }
            } else if (integrity < 60) {
                elements.integrityFill.classList.remove('critical');
                if (elements.hullStatus) {
                    elements.hullStatus.textContent = 'WARNING';
                    elements.hullStatus.classList.remove('healthy');
                }
            } else {
                elements.integrityFill.classList.remove('critical');
                if (elements.hullStatus) {
                    elements.hullStatus.textContent = 'NOMINAL';
                    elements.hullStatus.classList.add('healthy');
                }
            }
        }
    }

    // ============================================
    // System Status
    // ============================================
    function updateSystemStatus() {
        state.systemStatus.power += (Math.random() - 0.48) * 0.5;
        state.systemStatus.power = Math.max(0, Math.min(100, state.systemStatus.power));
        
        if (elements.powerFill) {
            elements.powerFill.style.width = state.systemStatus.power + '%';
            if (elements.powerFill.nextElementSibling) {
                elements.powerFill.nextElementSibling.textContent = Math.round(state.systemStatus.power) + '%';
            }
            if (state.systemStatus.power < 20) {
                elements.powerFill.classList.add('critical');
            } else {
                elements.powerFill.classList.remove('critical');
            }
        }
        
        state.systemStatus.o2 -= Math.random() * 0.02;
        state.systemStatus.o2 = Math.max(0, Math.min(100, state.systemStatus.o2));
        
        if (elements.o2Fill) {
            elements.o2Fill.style.width = state.systemStatus.o2 + '%';
            if (elements.o2Fill.nextElementSibling) {
                elements.o2Fill.nextElementSibling.textContent = Math.round(state.systemStatus.o2) + '%';
            }
            if (state.systemStatus.o2 < 20) {
                elements.o2Fill.classList.add('critical');
            } else {
                elements.o2Fill.classList.remove('critical');
            }
        }
        
        state.systemStatus.comms += (Math.random() - 0.5) * 2;
        state.systemStatus.comms = Math.max(0, Math.min(100, state.systemStatus.comms));
        
        if (elements.commsFill) {
            elements.commsFill.style.width = state.systemStatus.comms + '%';
            if (elements.commsFill.nextElementSibling) {
                elements.commsFill.nextElementSibling.textContent = Math.round(state.systemStatus.comms) + '%';
            }
            if (state.systemStatus.comms < 30) {
                elements.commsFill.classList.add('critical');
            } else {
                elements.commsFill.classList.remove('critical');
            }
        }
    }

    // ============================================
    // Mission Time
    // ============================================
    function updateMissionTime() {
        if (!elements.missionTime) return;
        
        const elapsed = Date.now() - state.missionStartTime;
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        
        elements.missionTime.textContent = 
            String(days).padStart(3, '0') + ':' +
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }

    // ============================================
    // Alerts
    // ============================================
    function updateAlerts() {
        if (!elements.alertPanel || !elements.alertMessage) return;
        
        let alertLevel = 'normal';
        let message = 'All systems nominal. Depth within safe parameters.';
        
        if (state.depth > 4100) {
            alertLevel = 'critical';
            message = 'CRITICAL: Crush depth approaching. Hull stress critical.';
        } else if (state.depth > 4000) {
            alertLevel = 'warning';
            message = 'WARNING: Approaching crush depth. Monitor hull integrity.';
        } else if (state.systemStatus.o2 < 30) {
            alertLevel = 'warning';
            message = 'WARNING: Oxygen levels depleting. Consider surface return.';
        } else if (state.systemStatus.comms < 40) {
            alertLevel = 'warning';
            message = 'WARNING: Communications signal degrading.';
        } else if (Math.random() < 0.001) {
            alertLevel = 'info';
            var events = [
                'Bioluminescent bloom detected at 3800m',
                'Thermal vent activity detected nearby',
                'Unidentified acoustic signature registered',
                'Current velocity increasing',
                'Pressure differential detected'
            ];
            message = events[Math.floor(Math.random() * events.length)];
        }
        
        elements.alertPanel.className = 'alert-panel ' + alertLevel;
        elements.alertMessage.textContent = message;
    }

    // ============================================
    // Coordinates
    // ============================================
    function updateCoordinates() {
        if (!elements.stationCoords) return;
        
        const baseLat = 11.4761;
        const baseLon = 142.1989;
        const lat = baseLat + (Math.random() - 0.5) * 0.001;
        const lon = baseLon + (Math.random() - 0.5) * 0.001;
        
        const latDeg = Math.floor(lat);
        const latMin = Math.floor((lat - latDeg) * 60);
        const latSec = ((lat - latDeg) * 60 - latMin) * 60;
        const lonDeg = Math.floor(lon);
        const lonMin = Math.floor((lon - lonDeg) * 60);
        const lonSec = ((lon - lonDeg) * 60 - lonMin) * 60;
        
        const latDir = lat >= 0 ? 'N' : 'S';
        const lonDir = lon >= 0 ? 'E' : 'W';
        
        elements.stationCoords.textContent = 
            latDeg + '°' + latMin + "'" + latSec.toFixed(0) + '"' + latDir + ' ' +
            lonDeg + '°' + lonMin + "'" + lonSec.toFixed(0) + '"' + lonDir;
    }

    // ============================================
    // Sonar Bearing
    // ============================================
    function updateSonarBearing() {
        if (elements.sonarBearing) {
            const bearing = Math.floor(Math.random() * 360);
            elements.sonarBearing.textContent = String(bearing).padStart(3, '0') + '°';
        }
        updateSonarBlips();
    }

    function updateSonarBlips() {
        if (!elements.sonarBlips) return;
        
        if (Math.random() < 0.3) {
            const blip = document.createElement('div');
            blip.className = 'sonar-blip';
            const range = Math.floor(Math.random() * 500);
            const bearing = Math.floor(Math.random() * 360);
            blip.innerHTML = '<span>' + range + 'm @ ' + bearing + '°</span>';
            elements.sonarBlips.insertBefore(blip, elements.sonarBlips.firstChild);
            
            if (elements.sonarBlips.children.length > 4) {
                elements.sonarBlips.removeChild(elements.sonarBlips.lastChild);
            }
        }
    }

    // ============================================
    // Bio Activity
    // ============================================
    function updateBioActivity() {
        if (!elements.bioGrid) return;
        
        if (Math.random() < 0.02) {
            const contactIndex = Math.floor(Math.random() * 9);
            const contact = elements.bioGrid.children[contactIndex];
            
            if (contact.classList.contains('active')) {
                contact.classList.remove('active');
                contact.innerHTML = '';
                addBioLogEntry('Contact-' + (contactIndex + 1) + ' departed');
            } else {
                contact.classList.add('active');
                var types = ['unknown', 'class-a', 'class-b'];
                var type = types[Math.floor(Math.random() * types.length)];
                contact.innerHTML = '<div class="bio-contact-dot ' + type + '"></div><span class="bio-contact-label">BIO-' + (contactIndex + 1) + '</span>';
                addBioLogEntry('Contact-' + (contactIndex + 1) + ' detected');
            }
            updateBioCount();
        }
        
        if (Math.random() < 0.01) {
            addBioLogEntry('Biolum burst detected');
        }
    }

    // ============================================
    // Main Simulation Loop
    // ============================================
    function startSimulation() {
        setInterval(updateMissionTime, 1000);
        setInterval(updateDepth, 100);
        setInterval(updateHullIntegrity, 500);
        setInterval(updateSystemStatus, 1000);
        setInterval(updateAlerts, 2000);
        setInterval(updateCoordinates, 5000);
        setInterval(updateSonarBearing, 2000);
        setInterval(updateBioActivity, 3000);
        
        updateDepth();
        updateHullIntegrity();
        updateSystemStatus();
        updateAlerts();
    }

    // ============================================
    // Start the Dashboard
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();