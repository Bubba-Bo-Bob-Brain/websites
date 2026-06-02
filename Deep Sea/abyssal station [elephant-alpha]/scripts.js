class DeepSeaDashboard {
    constructor() {
        this.depth = 0;
        this.pressure = 0;
        this.speciesCount = 0;
        this.activityLevel = 0;
        this.hullIntegrity = 100;
        this.isSonarActive = false;
        this.particles = [];
        this.lastTimestamp = 0;
        
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.setupEventListeners();
        this.createParticles();
        this.updateTimestamp();
        this.startSimulation();
        this.startDataSimulation();
    }

    cacheDOMElements() {
        this.elements = {
            depthValue: document.getElementById('depthValue'),
            pressureValue: document.getElementById('pressureValue'),
            pressureNeedle: document.getElementById('pressureNeedle'),
            pressureStatus: document.getElementById('pressureStatus'),
            klaxonBar: document.getElementById('klaxonBar'),
            hullPressure: document.getElementById('hullPressure'),
            integrityValue: document.getElementById('integrityValue'),
            hullStatus: document.getElementById('hullStatus'),
            faunaCanvas: document.getElementById('faunaCanvas'),
            speciesCount: document.getElementById('speciesCount'),
            activityLevel: document.getElementById('activityLevel'),
            sonarCanvas: document.getElementById('sonarCanvas'),
            systemLog: document.getElementById('systemLog'),
            timestamp: document.getElementById('timestamp'),
            ambientLight: document.querySelector('.ambient-light'),
            currentFlow: document.querySelector('.current-flow')
        };
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Sonar controls
        const sonarButtons = document.querySelectorAll('.sonar-btn');
        sonarButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleSonar(e.target));
        });
        
        // Control buttons
        const controlButtons = document.querySelectorAll('.control-btn');
        controlButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.executeCommand(e.target));
        });
    }

    createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(i);
        }
    }

    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 2;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        const driftDistance = Math.random() * 100 + 50;
        const leftPos = Math.random() * 100;
        
        particle.style.cssText = `
            left: ${leftPos}%;
            bottom: -10px;
            width: ${size}px;
            height: ${size}px;
            --drift-duration: ${duration}s;
            --drift-distance: ${driftDistance}px;
            animation-delay: ${delay}s;
        `;
        
        this.elements.faunaCanvas.appendChild(particle);
        
        this.particles.push({
            element: particle,
            duration: duration,
            delay: delay
        });
    }

    handleResize() {
        // Responsive adjustments if needed
        console.log('Window resized');
    }

    handleKeyPress(e) {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                this.toggleSonar();
                break;
            case 'd':
            case 'D':
                this.diveDeeper();
                break;
            case 'a':
            case 'A':
                this.ascend();
                break;
            case 'r':
            case 'R':
                this.runDiagnostic();
                break;
        }
    }

    toggleSonar(btnElement = null) {
        this.isSonarActive = !this.isSonarActive;
        
        if (btnElement) {
            btnElement.classList.toggle('active');
        }
        
        if (this.isSonarActive) {
            this.startSonar();
        } else {
            this.stopSonar();
        }
    }

    startSonar() {
        this.elements.sonarCanvas.classList.add('active');
        this.addLogEntry('SONAR SYSTEM ACTIVATED');
    }

    stopSonar() {
        this.elements.sonarCanvas.classList.remove('active');
        this.addLogEntry('SONAR SYSTEM DEACTIVATED');
    }

    diveDeeper() {
        this.depth += 100;
        this.updateDepth();
        this.addLogEntry(`DESCENDING TO ${this.depth} METERS`);
    }

    ascend() {
        this.depth = Math.max(0, this.depth - 100);
        this.updateDepth();
        this.addLogEntry(`ASCENDING TO ${this.depth} METERS`);
    }

    updateDepth() {
        const depthPercent = Math.min(this.depth / 3000, 1);
        const angle = -120 + (depthPercent * 120);
        
        this.elements.depthValue.textContent = this.depth;
        this.elements.depthNeedle.style.transform = `translate(-50%, 100%) rotate(${angle}deg)`;
        
        // Update ambient lighting based on depth
        const ambientIntensity = 1 - depthPercent;
        this.elements.ambientLight.style.opacity = 0.3 + (ambientIntensity * 0.4);
        
        // Update color temperature based on depth
        const hue = 200 + (depthPercent * 40); // Blue to deep blue
        this.elements.ambientLight.style.background = `radial-gradient(ellipse at center, hsla(${hue}, 80%, 40%, 0.05) 0%, transparent 50%)`;
        
        // Update pressure
        this.pressure = depthPercent * 300;
        this.updatePressure();
        
        // Update hull integrity
        this.hullIntegrity = Math.max(95, 100 - (depthPercent * 2));
        this.updateHullIntegrity();
    }

    updatePressure() {
        const pressurePercent = Math.min(this.pressure / 300, 1);
        const needleAngle = -60 + (pressurePercent * 120);
        
        this.elements.pressureValue.textContent = this.pressure.toFixed(1);
        this.elements.pressureNeedle.style.transform = `translate(-50%, 100%) rotate(${needleAngle}deg)`;
        
        // Update status
        if (pressurePercent > 0.8) {
            this.elements.pressureStatus.textContent = 'CRITICAL';
            this.elements.pressureStatus.style.color = '#ff3366';
            this.elements.klaxonBar.style.opacity = '1';
            this.addLogEntry('⚠️ PRESSURE WARNING: CRITICAL DEPTH REACHED');
        } else if (pressurePercent > 0.6) {
            this.elements.pressureStatus.textContent = 'WARNING';
            this.elements.pressureStatus.style.color = '#ffdd00';
            this.elements.klaxonBar.style.opacity = '0.5';
        } else {
            this.elements.pressureStatus.textContent = 'STABLE';
            this.elements.pressureStatus.style.color = '#00ff88';
            this.elements.klaxonBar.style.opacity = '0';
        }
    }

    updateHullIntegrity() {
        this.elements.hullPressure.style.width = `${this.hullIntegrity}%`;
        this.elements.integrityValue.textContent = `${Math.floor(this.hullIntegrity)}%`;
        
        if (this.hullIntegrity < 97) {
            this.elements.hullStatus.textContent = 'COMPROMISED';
            this.elements.hullStatus.style.color = '#ff3366';
        } else if (this.hullIntegrity < 99) {
            this.elements.hullStatus.textContent = 'WARNING';
            this.elements.hullStatus.style.color = '#ffdd00';
        } else {
            this.elements.hullStatus.textContent = 'NOMINAL';
            this.elements.hullStatus.style.color = '#00ff88';
        }
    }

    executeCommand(btn) {
        const command = btn.textContent.trim().toLowerCase();
        
        switch(command) {
            case 'dive deeper':
                this.diveDeeper();
                break;
            case 'ascend':
                this.ascend();
                break;
            case 'abort mission':
                this.abortMission();
                break;
            case 'system diagnostic':
                this.runDiagnostic();
                break;
            case 'thruster control':
                this.toggleThrusters();
                break;
            case 'camera array':
                this.activateCameras();
                break;
        }
    }

    abortMission() {
        this.depth = 0;
        this.pressure = 0;
        this.hullIntegrity = 100;
        this.isSonarActive = false;
        
        this.elements.depthNeedle.style.transform = 'translate(-50%, 100%) rotate(-120deg)';
        this.elements.pressureNeedle.style.transform = 'translate(-50%, 100%) rotate(-60deg)';
        this.elements.klaxonBar.style.opacity = '0';
        this.elements.sonarCanvas.classList.remove('active');
        this.elements.hullPressure.style.width = '100%';
        
        this.updateDepth();
        this.addLogEntry('MISSION ABORTED - SURFACE DEPLOYMENT INITIATED');
    }

    runDiagnostic() {
        this.addLogEntry('DIAGNOSTIC START: Checking all systems...');
        setTimeout(() => {
            this.addLogEntry('✓ Pressure Systems: NOMINAL');
            this.addLogEntry('✓ Sonar Arrays: OPERATIONAL');
            this.addLogEntry('✓ Hull Integrity: SECURE');
            this.addLogEntry('✓ Life Support: NORMAL');
            this.addLogEntry('DIAGNOSTIC COMPLETE: ALL SYSTEMS GO');
        }, 1000);
    }

    toggleThrusters() {
        this.addLogEntry('THRUSTER CONTROL: ENGAGED');
    }

    activateCameras() {
        this.addLogEntry('CAMERA ARRAY: ACTIVE - UNDERWATER VISUAL FEED ENABLED');
    }

    startSimulation() {
        setInterval(() => {
            // Simulate natural depth variations
            if (Math.random() > 0.7) {
                this.depth += (Math.random() > 0.5 ? 10 : -10);
                this.depth = Math.max(0, Math.min(this.depth, 3000));
                this.updateDepth();
            }
        }, 5000);
    }

    startDataSimulation() {
        setInterval(() => {
            // Simulate pressure changes
            this.pressure += (Math.random() - 0.5) * 2;
            this.pressure = Math.max(0, Math.min(this.pressure, 300));
            this.updatePressure();
            
            // Simulate species detection
            if (Math.random() > 0.5) {
                this.speciesCount += Math.random() > 0.7 ? 2 : 1;
                this.elements.speciesCount.textContent = this.speciesCount;
            }
            
            // Simulate activity level changes
            this.activityLevel += (Math.random() - 0.5) * 10;
            this.activityLevel = Math.max(0, Math.min(100, this.activityLevel));
            this.elements.activityLevel.textContent = `${Math.floor(this.activityLevel)}%`;
            
            // Simulate hull integrity degradation
            if (this.depth > 2000) {
                this.hullIntegrity -= 0.01;
                this.hullIntegrity = Math.max(70, this.hullIntegrity);
                this.updateHullIntegrity();
            }
        }, 3000);
    }

    updateTimestamp() {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        this.elements.timestamp.textContent = timeString;
        setTimeout(() => this.updateTimestamp(), 1000);
    }

    addLogEntry(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toTimeString().split(' ')[0]}] ${message}`;
        
        this.elements.systemLog.insertBefore(entry, this.elements.systemLog.firstChild);
        
        // Limit log entries
        while (this.elements.systemLog.children.length > 20) {
            this.elements.systemLog.removeChild(this.elements.systemLog.lastChild);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DeepSeaDashboard();
});