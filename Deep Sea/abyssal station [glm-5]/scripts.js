const DeepSeaDashboard = {
    depth: 8247,
    maxDepth: 10000,
    pressure: 834.2,
    temperature: 1.4,
    integrity: 94.7,
    missionSeconds: 127 * 3600 + 42 * 60 + 18,
    particles: [],
    currents: [],
    faunaContacts: [],
    sonarContacts: [
        { id: 'contact-1', angle: 30, distance: 47, name: 'Anglerfish' },
        { id: 'contact-2', angle: 210, distance: 123, name: 'Lanternfish' },
        { id: 'contact-3', angle: 55, distance: 89, name: 'Vampire Squid' }
    ],
    pingInterval: null,
    warningActive: false,

    init: function() {
        this.initParticles();
        this.initCurrents();
        this.initCanvas();
        this.startMissionClock();
        this.startDataSimulation();
        this.initSonarPing();
        this.initSonarControls();
        this.initDepthEffects();
        this.startFaunaTracking();
        this.simulateHullStress();
        this.animate();
    },

    initParticles: function() {
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.2 - 0.1,
                opacity: Math.random() * 0.5 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2,
                color: this.getRandomBioColor()
            });
        }
    },

    getRandomBioColor: function() {
        const colors = [
            { r: 0, g: 255, b: 170 },
            { r: 0, g: 170, b: 255 },
            { r: 0, g: 255, b: 204 },
            { r: 100, g: 200, b: 255 },
            { r: 150, g: 255, b: 200 }
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    initCurrents: function() {
        for (let i = 0; i < 15; i++) {
            this.currents.push({
                startX: Math.random() * window.innerWidth,
                startY: Math.random() * window.innerHeight,
                length: Math.random() * 200 + 100,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    },

    initCanvas: function() {
        this.particlesCanvas = document.getElementById('particles-canvas');
        this.currentsCanvas = document.getElementById('currents-canvas');
        this.pCtx = this.particlesCanvas.getContext('2d');
        this.cCtx = this.currentsCanvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    resizeCanvas: function() {
        this.particlesCanvas.width = window.innerWidth;
        this.particlesCanvas.height = window.innerHeight;
        this.currentsCanvas.width = window.innerWidth;
        this.currentsCanvas.height = window.innerHeight;
    },

    drawParticles: function(time) {
        this.pCtx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);

        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0) p.x = this.particlesCanvas.width;
            if (p.x > this.particlesCanvas.width) p.x = 0;
            if (p.y < 0) p.y = this.particlesCanvas.height;
            if (p.y > this.particlesCanvas.height) p.y = 0;

            const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase);
            const currentOpacity = p.opacity * (0.7 + pulse * 0.3);
            const currentRadius = p.radius * (1 + pulse * 0.2);

            const gradient = this.pCtx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, currentRadius * 4
            );
            gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentOpacity})`);
            gradient.addColorStop(0.5, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentOpacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

            this.pCtx.beginPath();
            this.pCtx.arc(p.x, p.y, currentRadius * 4, 0, Math.PI * 2);
            this.pCtx.fillStyle = gradient;
            this.pCtx.fill();

            this.pCtx.beginPath();
            this.pCtx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
            this.pCtx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentOpacity * 1.5})`;
            this.pCtx.fill();
        });
    },

    drawCurrents: function(time) {
        this.cCtx.clearRect(0, 0, this.currentsCanvas.width, this.currentsCanvas.height);

        this.currents.forEach(c => {
            const waveOffset = Math.sin(time * 0.001 + c.startX * 0.01) * 20;
            const startX = c.startX + (time * c.speed * 0.05) % this.currentsCanvas.width;
            
            this.cCtx.beginPath();
            this.cCtx.moveTo(startX, c.startY);
            
            for (let i = 0; i < c.length; i += 10) {
                const wave = Math.sin((startX + i) * 0.02 + time * 0.002) * 15;
                this.cCtx.lineTo(startX + i, c.startY + wave + waveOffset);
            }
            
            this.cCtx.strokeStyle = `rgba(0, 255, 170, ${c.opacity})`;
            this.cCtx.lineWidth = 1;
            this.cCtx.stroke();
        });
    },

    startMissionClock: function() {
        setInterval(() => {
            this.missionSeconds++;
            const hours = Math.floor(this.missionSeconds / 3600);
            const minutes = Math.floor((this.missionSeconds % 3600) / 60);
            const seconds = this.missionSeconds % 60;
            
            const clockEl = document.getElementById('mission-clock');
            if (clockEl) {
                clockEl.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);
    },

    startDataSimulation: function() {
        setInterval(() => {
            this.depth += (Math.random() - 0.5) * 5;
            this.depth = Math.max(0, Math.min(this.maxDepth, this.depth));
            
            this.pressure = (this.depth / 10).toFixed(1);
            this.temperature = (Math.random() * 0.4 + 1.2).toFixed(1);
            
            this.updateDepthDisplay();
            this.updateEnvironmentDisplay();
        }, 2000);

        setInterval(() => {
            const fluctuation = (Math.random() - 0.5) * 0.3;
            this.integrity = Math.max(85, Math.min(100, this.integrity + fluctuation));
            this.updateIntegrityDisplay();
        }, 3000);
    },

    updateDepthDisplay: function() {
        const depthValue = document.getElementById('depth-value');
        const depthFill = document.getElementById('depth-fill');
        const pressureValue = document.getElementById('pressure-value');
        const tempValue = document.getElementById('temp-value');
        const depthZone = document.getElementById('depth-zone');

        if (depthValue) {
            depthValue.textContent = Math.round(this.depth).toLocaleString();
        }
        
        if (depthFill) {
            const percentage = (this.depth / this.maxDepth) * 100;
            depthFill.style.height = `${percentage}%`;
        }
        
        if (pressureValue) {
            pressureValue.textContent = this.pressure;
        }
        
        if (tempValue) {
            tempValue.textContent = this.temperature;
        }

        if (depthZone) {
            const zoneName = depthZone.querySelector('.zone-name');
            if (zoneName) {
                if (this.depth < 200) {
                    zoneName.textContent = 'EPIPELAGIC';
                } else if (this.depth < 1000) {
                    zoneName.textContent = 'MESOPELAGIC';
                } else if (this.depth < 4000) {
                    zoneName.textContent = 'BATHYPELAGIC';
                } else if (this.depth < 6000) {
                    zoneName.textContent = 'ABYSSOPELAGIC';
                } else {
                    zoneName.textContent = 'HADOPELAGIC';
                }
            }
        }
    },

    updateEnvironmentDisplay: function() {
        const currentValue = document.getElementById('current-value');
        const currentDir = document.getElementById('current-dir');
        const salinityValue = document.getElementById('salinity-value');
        const visibilityValue = document.getElementById('visibility-value');
        const o2Value = document.getElementById('o2-value');

        if (currentValue) {
            const speed = (Math.random() * 0.3 + 0.2).toFixed(1);
            currentValue.textContent = `${speed} m/s`;
        }
        
        if (currentDir) {
            const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
            currentDir.textContent = directions[Math.floor(Math.random() * directions.length)];
        }

        if (salinityValue) {
            salinityValue.textContent = `${(34.5 + Math.random() * 0.5).toFixed(1)} PSU`;
        }

        if (visibilityValue) {
            visibilityValue.textContent = `${Math.round(10 + Math.random() * 5)}m`;
        }

        if (o2Value) {
            o2Value.textContent = `${(17.5 + Math.random() * 1.5).toFixed(1)}%`;
        }
    },

    updateIntegrityDisplay: function() {
        const integrityValue = document.getElementById('integrity-value');
        const integrityArc = document.getElementById('integrity-arc');
        const hullStatus = document.getElementById('hull-status');

        if (integrityValue) {
            integrityValue.textContent = this.integrity.toFixed(1);
        }

        if (integrityArc) {
            const circumference = 2 * Math.PI * 54;
            const offset = circumference * (1 - this.integrity / 100);
            integrityArc.style.strokeDashoffset = offset;

            if (this.integrity < 90) {
                integrityArc.style.stroke = '#ff8800';
            } else if (this.integrity < 95) {
                integrityArc.style.stroke = '#ffcc00';
            } else {
                integrityArc.style.stroke = 'url(#integrity-gradient)';
            }
        }

        if (hullStatus) {
            if (this.integrity < 90) {
                hullStatus.textContent = 'WARNING';
                hullStatus.className = 'panel-status status-warning';
                hullStatus.style.background = 'rgba(255, 136, 0, 0.15)';
                hullStatus.style.color = '#ff8800';
                hullStatus.style.borderColor = 'rgba(255, 136, 0, 0.3)';
            } else {
                hullStatus.textContent = 'NOMINAL';
                hullStatus.className = 'panel-status status-ok';
            }
        }

        this.updateSectorReadings();
    },

    updateSectorReadings: function() {
        const sectors = document.querySelectorAll('.sector-reading');
        sectors.forEach((sector, index) => {
            const fill = sector.querySelector('.sector-fill');
            const val = sector.querySelector('.sector-val');
            
            if (fill && val) {
                const baseValue = this.integrity + (Math.random() - 0.5) * 4;
                const sectorValue = Math.max(85, Math.min(100, baseValue));
                fill.style.width = `${sectorValue}%`;
                val.textContent = `${Math.round(sectorValue)}%`;

                if (sectorValue < 90) {
                    fill.style.background = '#ff8800';
                } else if (sectorValue < 95) {
                    fill.style.background = '#ffcc00';
                } else {
                    fill.style.background = '#00ffaa';
                }
            }
        });
    },

    initSonarPing: function() {
        setInterval(() => {
            this.triggerPing();
        }, 4000);
    },

    triggerPing: function() {
        const rings = document.querySelectorAll('.ping-ring');
        rings.forEach((ring, index) => {
            ring.style.animation = 'none';
            ring.offsetHeight;
            ring.style.animation = `pingExpand 4s ease-out ${index}s infinite`;
        });

        this.updateContactPositions();
    },

    updateContactPositions: function() {
        this.sonarContacts.forEach(contact => {
            const el = document.getElementById(contact.id);
            if (el) {
                const angleRad = (contact.angle - 90) * Math.PI / 180;
                const radius = (contact.distance / 250) * 150;
                const centerX = 180;
                const centerY = 180;
                
                const x = centerX + Math.cos(angleRad) * radius;
                const y = centerY + Math.sin(angleRad) * radius;

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;

                contact.angle += (Math.random() - 0.5) * 10;
                contact.distance += (Math.random() - 0.5) * 10;
                contact.distance = Math.max(20, Math.min(250, contact.distance));
            }
        });

        const contactCount = document.getElementById('contact-count');
        const closestContact = document.getElementById('closest-contact');
        
        if (contactCount) {
            contactCount.textContent = this.sonarContacts.length;
        }
        
        if (closestContact) {
            const closest = Math.min(...this.sonarContacts.map(c => c.distance));
            closestContact.textContent = `${Math.round(closest)}m`;
        }
    },

    initSonarControls: function() {
        const pingBtn = document.getElementById('btn-ping');
        if (pingBtn) {
            pingBtn.addEventListener('click', () => {
                this.triggerManualPing();
            });
        }

        const freqRange = document.getElementById('freq-range');
        const freqValue = document.getElementById('freq-value');
        
        if (freqRange && freqValue) {
            freqRange.addEventListener('input', (e) => {
                const freq = e.target.value;
                const kHz = 8 + freq * 0.8;
                freqValue.textContent = `${kHz.toFixed(0)} kHz`;
            });
        }
    },

    triggerManualPing: function() {
        const pingBtn = document.getElementById('btn-ping');
        if (pingBtn) {
            pingBtn.style.background = '#00ffaa';
            pingBtn.style.color = '#020810';
            pingBtn.style.boxShadow = '0 0 20px rgba(0, 255, 170, 0.5)';
            
            setTimeout(() => {
                pingBtn.style.background = 'transparent';
                pingBtn.style.color = '#00ffaa';
                pingBtn.style.boxShadow = 'none';
            }, 500);
        }

        this.triggerPing();
    },

    initDepthEffects: function() {
        this.updateDepthColor();
    },

    updateDepthColor: function() {
        setInterval(() => {
            const oceanVoid = document.querySelector('.ocean-void');
            if (oceanVoid) {
                const depthRatio = this.depth / this.maxDepth;
                
                const blueIntensity = Math.round(40 + depthRatio * 30);
                const greenIntensity = Math.round(30 + depthRatio * 20);
                
                oceanVoid.style.background = `
                    radial-gradient(ellipse at 50% 30%, rgba(0, ${blueIntensity}, ${Math.round(blueIntensity * 1.5)}, ${0.15 - depthRatio * 0.1}) 0%, transparent 50%),
                    radial-gradient(ellipse at 30% 70%, rgba(0, ${greenIntensity + 20}, ${blueIntensity + 40}, ${0.1 - depthRatio * 0.05}) 0%, transparent 40%),
                    radial-gradient(ellipse at 70% 60%, rgba(0, ${blueIntensity - 20}, ${blueIntensity + 20}, ${0.12 - depthRatio * 0.08}) 0%, transparent 45%),
                    linear-gradient(180deg, 
                        rgb(${Math.round(2 + depthRatio * 5)}, ${Math.round(8 + depthRatio * 10)}, ${Math.round(16 + depthRatio * 15)}) 0%, 
                        rgb(${Math.round(10 - depthRatio * 5)}, ${Math.round(22 - depthRatio * 10)}, ${Math.round(40 - depthRatio * 15)}) 50%, 
                        rgb(${Math.round(13 - depthRatio * 8)}, ${Math.round(31 - depthRatio * 15)}, ${Math.round(60 - depthRatio * 25)}) 100%
                    )
                `;
            }
        }, 500);
    },

    startFaunaTracking: function() {
        const faunaList = document.getElementById('fauna-list');
        const faunaCount = document.getElementById('fauna-count');

        setInterval(() => {
            const items = faunaList.querySelectorAll('.fauna-item');
            items.forEach(item => {
                const distanceEl = item.querySelector('.fauna-distance');
                if (distanceEl) {
                    const currentDist = parseInt(distanceEl.textContent);
                    const newDist = currentDist + Math.round((Math.random() - 0.5) * 20);
                    distanceEl.textContent = `${Math.max(10, Math.min(500, newDist))}m`;
                }
            });

            if (faunaCount) {
                faunaCount.textContent = items.length + Math.floor(Math.random() * 3);
            }
        }, 3000);
    },

    simulateHullStress: function() {
        const stressPoints = document.querySelectorAll('.stress-point');
        
        setInterval(() => {
            stressPoints.forEach(point => {
                point.classList.remove('warning');
            });

            if (Math.random() < 0.3) {
                const randomIndex = Math.floor(Math.random() * stressPoints.length);
                const stressedPoint = stressPoints[randomIndex];
                stressedPoint.classList.add('warning');
                
                const sector = stressedPoint.dataset.sector;
                this.showWarning(`HULL STRESS DETECTED - SECTOR ${sector}`);
            } else if (this.warningActive) {
                this.hideWarning();
            }
        }, 8000);
    },

    showWarning: function(message) {
        const warningBar = document.getElementById('warning-bar');
        const warningMessage = document.getElementById('warning-message');
        
        if (warningBar && warningMessage) {
            warningMessage.textContent = message;
            warningBar.classList.add('active');
            this.warningActive = true;
            
            this.integrity = Math.max(85, this.integrity - 2);
            this.updateIntegrityDisplay();
        }
    },

    hideWarning: function() {
        const warningBar = document.getElementById('warning-bar');
        if (warningBar) {
            warningBar.classList.remove('active');
            this.warningActive = false;
        }
    },

    animate: function() {
        const time = performance.now();
        
        this.drawParticles(time);
        this.drawCurrents(time);
        
        requestAnimationFrame(() => this.animate());
    }
};

document.addEventListener('DOMContentLoaded', () => {
    DeepSeaDashboard.init();
});