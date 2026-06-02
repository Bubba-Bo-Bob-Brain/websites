// Deep Sea Research Station Dashboard
// Interactive systems and visualizations

class DeepSeaDashboard {
    constructor() {
        this.depth = 3842;
        this.pressure = 386;
        this.temperature = 2.1;
        this.oxygenLevel = 98.2;
        this.currentVelocity = 2.4;
        this.currentDirection = 'NE';
        this.hullIntegrity = {
            bow: 95,
            mid: 75,
            stern: 55,
            keel: 35
        };
        this.sonarBlips = [];
        this.particles = [];
        this.isEmergency = false;
        this.klaxonActive = false;
        
        this.init();
    }

    init() {
        this.createParticles();
        this.initSonar();
        this.initFaunaCanvas();
        this.setupControls();
        this.startSimulation();
        this.checkHullWarning();
    }

    createParticles() {
        const container = document.getElementById('particleContainer');
        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 2.5 + 1;
            const x = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 15;
            const opacity = Math.random() * 0.4 + 0.1;
            
            particle.style.cssText = `
                left: ${x}%;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${opacity};
                background: ${this.getParticleColor()};
            `;
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    getParticleColor() {
        const colors = [
            'rgba(0, 229, 255, 0.6)',
            'rgba(0, 255, 136, 0.4)',
            'rgba(255, 107, 107, 0.3)',
            'rgba(108, 92, 231, 0.4)',
            'rgba(255, 217, 61, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    initSonar() {
        const canvas = document.getElementById('sonarCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Sonar sweep animation
        let angle = 0;
        
        const animateSonar = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;
            
            // Draw sweep
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            
            // Sweep cone
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
            gradient.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
            gradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, maxRadius, -0.3, 0.3);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Sweep line
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(maxRadius * 0.95, 0);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            ctx.restore();
            
            // Draw blips
            this.sonarBlips.forEach((blip, index) => {
                const dx = blip.x - centerX;
                const dy = blip.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const blipAngle = Math.atan2(dy, dx);
                const angleDiff = Math.abs(blipAngle - angle);
                
                if (angleDiff < 0.4 || Math.abs(angleDiff - Math.PI * 2) < 0.4) {
                    const pulse = Math.sin(Date.now() * 0.003 + blip.phase) * 0.5 + 0.5;
                    ctx.beginPath();
                    ctx.arc(blip.x, blip.y, 3 + pulse * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 229, 255, ${0.3 + pulse * 0.5})`;
                    ctx.fill();
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
                }
            });
            
            angle += 0.02;
            if (angle > Math.PI * 2) angle = 0;
            
            requestAnimationFrame(animateSonar);
        };
        
        animateSonar();
        
        // Generate random sonar blips
        setInterval(() => {
            if (this.sonarBlips.length < 8) {
                this.sonarBlips.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }, 2000);
        
        // Remove old blips
        setInterval(() => {
            if (this.sonarBlips.length > 3) {
                this.sonarBlips.shift();
            }
        }, 5000);
    }

    initFaunaCanvas() {
        const canvas = document.getElementById('faunaCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Bioluminescent dots
        const dots = [];
        const dotCount = 15;
        
        for (let i = 0; i < dotCount; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1.5,
                phase: Math.random() * Math.PI * 2,
                color: this.getFaunaColor()
            });
        }
        
        const animateFauna = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            dots.forEach(dot => {
                dot.x += dot.vx;
                dot.y += dot.vy;
                
                if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
                if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
                
                const pulse = Math.sin(Date.now() * 0.002 + dot.phase) * 0.5 + 0.5;
                const radius = dot.radius * (0.5 + pulse * 0.5);
                
                // Glow effect
                const gradient = ctx.createRadialGradient(
                    dot.x, dot.y, 0,
                    dot.x, dot.y, radius * 4
                );
                gradient.addColorStop(0, dot.color.replace('0.8', '0.3'));
                gradient.addColorStop(1, 'transparent');
                
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Core
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = dot.color;
                ctx.fill();
                
                // Bright center
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.fill();
            });
            
            requestAnimationFrame(animateFauna);
        };
        
        animateFauna();
    }

    getFaunaColor() {
        const colors = [
            'rgba(0, 255, 136, 0.8)',
            'rgba(255, 107, 107, 0.8)',
            'rgba(255, 217, 61, 0.8)',
            'rgba(108, 92, 231, 0.8)',
            'rgba(0, 229, 255, 0.8)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupControls() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleAction(action);
                
                // Button feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    handleAction(action) {
        switch(action) {
            case 'scan':
                this.triggerDeepScan();
                break;
            case 'lights':
                this.toggleFloodLights();
                break;
            case 'sampling':
                this.triggerSampling();
                break;
            case 'emergency':
                this.toggleEmergency();
                break;
        }
    }

    triggerDeepScan() {
        const sonarDisplay = document.querySelector('.sonar-display');
        sonarDisplay.style.boxShadow = '0 0 40px rgba(0, 229, 255, 0.3)';
        
        // Create scan burst effect
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: rgba(0, 229, 255, 0.5);
            border-radius: 50%;
            animation: sonar-pulse 1s ease-out forwards;
            z-index: 3;
        `;
        sonarDisplay.appendChild(burst);
        
        setTimeout(() => {
            sonarDisplay.style.boxShadow = 'none';
            burst.remove();
        }, 1000);
    }

    toggleFloodLights() {
        const glass = document.querySelector('.viewport-glass');
        const currentOpacity = parseFloat(glass.style.opacity || '1');
        
        if (currentOpacity > 0.5) {
            glass.style.opacity = '0.3';
            glass.style.background = 'linear-gradient(160deg, rgba(255, 255, 200, 0.08) 0%, transparent 50%, rgba(0, 229, 255, 0.02) 100%)';
        } else {
            glass.style.opacity = '1';
            glass.style.background = 'linear-gradient(160deg, rgba(0, 229, 255, 0.015) 0%, transparent 35%, transparent 65%, rgba(0, 229, 255, 0.008) 100%)';
        }
    }

    triggerSampling() {
        const panel = document.querySelector('.panel-fauna');
        const originalBorder = panel.style.borderColor;
        
        panel.style.borderColor = 'rgba(0, 229, 255, 0.6)';
        panel.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.15)';
        
        setTimeout(() => {
            panel.style.borderColor = originalBorder;
            panel.style.boxShadow = 'none';
        }, 1500);
    }

    toggleEmergency() {
        this.isEmergency = !this.isEmergency;
        const btn = document.querySelector('.control-btn.emergency');
        const klaxon = document.getElementById('klaxonBar');
        
        if (this.isEmergency) {
            btn.style.background = 'rgba(255, 50, 50, 0.2)';
            klaxon.classList.add('active');
            this.klaxonActive = true;
            
            // Flash dashboard
            document.querySelectorAll('.panel').forEach(panel => {
                panel.style.borderColor = 'rgba(255, 0, 60, 0.3)';
            });
            
            // Simulate hull integrity dropping
            this.hullIntegrity.keel = Math.max(15, this.hullIntegrity.keel - 20);
            this.updateHullDisplay();
        } else {
            btn.style.background = '';
            klaxon.classList.remove('active');
            this.klaxonActive = false;
            
            document.querySelectorAll('.panel').forEach(panel => {
                panel.style.borderColor = '';
            });
        }
    }

    startSimulation() {
        // Update readings periodically
        setInterval(() => {
            this.depth += (Math.random() - 0.5) * 2;
            this.pressure = Math.round(this.depth * 0.1 + Math.random() * 5);
            this.oxygenLevel = Math.max(95, Math.min(100, this.oxygenLevel + (Math.random() - 0.5) * 0.3));
            
            this.updateReadouts();
        }, 3000);

        // Random hull degradation
        setInterval(() => {
            if (!this.isEmergency) {
                const sections = Object.keys(this.hullIntegrity);
                const randomSection = sections[Math.floor(Math.random() * sections.length)];
                this.hullIntegrity[randomSection] = Math.max(20, 
                    this.hullIntegrity[randomSection] - Math.random() * 2);
                this.updateHullDisplay();
            }
        }, 8000);

        // Current variation
        setInterval(() => {
            this.currentVelocity = Math.max(0.5, this.currentVelocity + (Math.random() - 0.5) * 0.8);
            const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
            this.currentDirection = directions[Math.floor(Math.random() * directions.length)];
            this.updateCurrentDisplay();
        }, 10000);
    }

    updateReadouts() {
        const depthReadout = document.querySelector('.depth-readout');
        const pressureReadout = document.querySelector('.pressure-readout');
        const o2Readout = document.querySelector('.o2-readout');
        
        if (depthReadout) {
            depthReadout.innerHTML = `${Math.round(this.depth).toLocaleString()}<span class="unit">m</span>`;
        }
        if (pressureReadout) {
            pressureReadout.innerHTML = `${Math.round(this.pressure)}<span class="unit">atm</span>`;
        }
        if (o2Readout) {
            o2Readout.innerHTML = `${this.oxygenLevel.toFixed(1)}<span class="unit">%</span>`;
        }
        
        // Update gauge
        const gaugeText = document.querySelector('.gauge-text');
        if (gaugeText) {
            gaugeText.textContent = Math.round(this.pressure);
        }
    }

    updateHullDisplay() {
        const sections = {
            bow: document.querySelector('.hull-section[data-section="1"] .hull-bar-fill'),
            mid: document.querySelector('.hull-section[data-section="2"] .hull-bar-fill'),
            stern: document.querySelector('.hull-section[data-section="3"] .hull-bar-fill'),
            keel: document.querySelector('.hull-section[data-section="4"] .hull-bar-fill')
        };
        
        Object.entries(this.hullIntegrity).forEach(([section, value]) => {
            const element = sections[section];
            if (!element) return;
            
            element.style.width = `${value}%`;
            
            if (value > 80) {
                element.className = 'hull-bar-fill integrity-high';
            } else if (value > 50) {
                element.className = 'hull-bar-fill integrity-mid';
            } else {
                element.className = 'hull-bar-fill integrity-critical';
            }
        });
    }

    updateCurrentDisplay() {
        const velocityEl = document.querySelector('.current-item:nth-child(1) .current-value');
        const directionEl = document.querySelector('.current-item:nth-child(2) .current-value');
        
        if (velocityEl) {
            velocityEl.textContent = `${this.currentVelocity.toFixed(1)} kn`;
        }
        if (directionEl) {
            directionEl.textContent = this.currentDirection;
        }
    }

    checkHullWarning() {
        setInterval(() => {
            const criticalSection = Object.entries(this.hullIntegrity)
                .find(([_, value]) => value < 40);
            
            const klaxon = document.getElementById('klaxonBar');
            if (criticalSection && !this.isEmergency) {
                klaxon.classList.add('active');
                this.klaxonActive = true;
                const text = klaxon.querySelector('.klaxon-text');
                if (text) {
                    text.textContent = `⚠ WARNING: ${criticalSection[0].toUpperCase()} SECTION STRESS AT ${Math.round(criticalSection[1])}%`;
                }
            } else if (!this.isEmergency) {
                klaxon.classList.remove('active');
                this.klaxonActive = false;
            }
        }, 1000);
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DeepSeaDashboard();
});