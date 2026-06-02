/** ========================================
   HADAL RESEARCH STATION "ABYSSAL GUARDIAN"
   Operations Dashboard - Interactive Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    initializeParticleSystem();
    initializeCurrentFlow();
    initializeSonar();
    initializePressureGraph();
    initializeBioMap();
    initializeDataTicker();
    initializeDepthEffects();
    initializeKlaxonSystem();
    initializeWarningModal();
    initializeInteractiveElements();
    startSystemUpdates();
});

/** ========================================
   BIOLUMINESCENT PARTICLE SYSTEM
   ======================================== */
function initializeParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.hue = Math.random() * 60 + 160;
            this.saturation = 100;
            this.lightness = Math.random() * 30 + 50;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.glowIntensity = Math.random() * 10 + 5;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulsePhase += this.pulseSpeed;
            this.x += Math.sin(this.pulsePhase * 0.5) * 0.2;
            
            if (this.y > canvas.height + 10) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
        }
        
        draw() {
            const pulseAlpha = this.alpha * (0.7 + Math.sin(this.pulsePhase) * 0.3);
            const pulseSize = this.size * (1 + Math.sin(this.pulsePhase) * 0.3);
            
            ctx.shadowBlur = this.glowIntensity;
            ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${pulseAlpha})`;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${pulseAlpha})`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 50%, 90%, ${pulseAlpha})`;
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

/** ========================================
   UNDERWATER CURRENT FLOW VISUALIZATION
   ======================================== */
function initializeCurrentFlow() {
    const canvas = document.getElementById('currentFlowCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let flowLines = [];
    const lineCount = 30;
    
    class FlowLine {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.length = Math.random() * 100 + 50;
            this.speed = Math.random() * 1 + 0.5;
            this.thickness = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.15 + 0.05;
            this.curve = Math.random() * 2 - 1;
        }
        
        update() {
            this.x += this.speed;
            this.y += Math.sin(this.x * 0.01) * this.curve;
            if (this.x > canvas.width + this.length) {
                this.x = -this.length;
                this.y = Math.random() * canvas.height;
            }
        }
        
        draw() {
            const gradient = ctx.createLinearGradient(
                this.x, this.y, this.x + this.length, this.y + Math.sin(this.x * 0.01) * 10
            );
            gradient.addColorStop(0, `rgba(0, 212, 170, 0)`);
            gradient.addColorStop(0.5, `rgba(0, 212, 170, ${this.alpha})`);
            gradient.addColorStop(1, `rgba(0, 245, 255, 0)`);
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.quadraticCurveTo(
                this.x + this.length * 0.5, this.y + Math.sin(this.x * 0.01) * 15,
                this.x + this.length, this.y + Math.sin((this.x + this.length) * 0.01) * 10
            );
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }
    
    for (let i = 0; i < lineCount; i++) {
        flowLines.push(new FlowLine());
    }
    
    function animateFlow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        flowLines.forEach(line => {
            line.update();
            line.draw();
        });
        requestAnimationFrame(animateFlow);
    }
    
    animateFlow();
    
    // Current panel visualization
    const currentCanvas = document.getElementById('currentCanvas');
    if (currentCanvas) {
        const currentCtx = currentCanvas.getContext('2d');
        const rect = currentCanvas.getBoundingClientRect();
        currentCanvas.width = rect.width || 200;
        currentCanvas.height = rect.height || 150;
        
        let particles = [];
        const particleCount = 40;
        
        class CurrentParticle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * currentCanvas.width;
                this.y = Math.random() * currentCanvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 + 1;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > currentCanvas.width) {
                    this.x = 0;
                    this.y = Math.random() * currentCanvas.height;
                }
            }
            
            draw() {
                currentCtx.beginPath();
                currentCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                currentCtx.fillStyle = `rgba(0, 212, 170, ${this.alpha})`;
                currentCtx.fill();
                
                currentCtx.beginPath();
                currentCtx.moveTo(this.x, this.y);
                currentCtx.lineTo(this.x - 15, this.y - this.speedY * 5);
                currentCtx.strokeStyle = `rgba(0, 212, 170, ${this.alpha * 0.3})`;
                currentCtx.lineWidth = this.size * 0.5;
                currentCtx.stroke();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new CurrentParticle());
        }
        
        function animateCurrentParticles() {
            currentCtx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
            
            currentCtx.strokeStyle = 'rgba(0, 212, 170, 0.1)';
            currentCtx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = (currentCanvas.height / 5) * i + 20;
                currentCtx.beginPath();
                currentCtx.moveTo(0, y);
                for (let x = 0; x < currentCanvas.width; x += 10) {
                    currentCtx.lineTo(x, y + Math.sin((x + Date.now() * 0.05) * 0.05) * 10);
                }
                currentCtx.stroke();
            }
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animateCurrentParticles);
        }
        
        animateCurrentParticles();
    }
}

/** ========================================
   SONAR SYSTEM
   ======================================== */
function initializeSonar() {
    const canvas = document.getElementById('sonarCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height) || 200;
    canvas.width = size;
    canvas.height = size;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 10;
    
    let sweepAngle = 0;
    const sweepSpeed = 0.02;
    
    const contacts = [];
    for (let i = 0; i < 7; i++) {
        contacts.push({
            angle: Math.random() * Math.PI * 2,
            distance: Math.random() * 0.8 + 0.1,
            intensity: Math.random() * 0.5 + 0.5,
            type: Math.random() > 0.3 ? 'bio' : 'unknown'
        });
    }
    
    let pingTime = 0;
    const pingInterval = 3000;
    
    function drawSonar() {
        ctx.clearRect(0, 0, size, size);
        
        const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        bgGradient.addColorStop(0, 'rgba(0, 20, 30, 0.3)');
        bgGradient.addColorStop(1, 'rgba(0, 10, 20, 0.1)');
        ctx.fillStyle = bgGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let r = 0.25; r <= 1; r += 0.25) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxRadius * r, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - maxRadius);
        ctx.lineTo(centerX, centerY + maxRadius);
        ctx.moveTo(centerX - maxRadius, centerY);
        ctx.lineTo(centerX + maxRadius, centerY);
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sweepAngle);
        
        const sweepGradient = ctx.createLinearGradient(0, 0, maxRadius, 0);
        sweepGradient.addColorStop(0, 'rgba(0, 245, 255, 0.8)');
        sweepGradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
        ctx.strokeStyle = sweepGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxRadius, 0);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(0, 245, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, sweepAngle - 0.5, sweepAngle, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        contacts.forEach(contact => {
            const contactAngle = contact.angle;
            const contactRadius = contact.distance * maxRadius;
            const contactX = centerX + Math.cos(contactAngle) * contactRadius;
            const contactY = centerY + Math.sin(contactAngle) * contactRadius;
            
            let angleDiff = sweepAngle - contactAngle;
            while (angleDiff < 0) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;
            
            if (angleDiff < 0.5 || (Date.now() - pingTime) < 500) {
                const fadeIn = Math.max(0, 1 - angleDiff * 2);
                const alpha = contact.intensity * fadeIn * 0.8;
                
                if (alpha > 0.01) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = contact.type === 'bio' 
                        ? `rgba(0, 245, 255, ${alpha})` 
                        : `rgba(255, 170, 0, ${alpha})`;
                    
                    ctx.beginPath();
                    ctx.arc(contactX, contactY, 4, 0, Math.PI * 2);
                    ctx.fillStyle = contact.type === 'bio' 
                        ? `rgba(0, 245, 255, ${alpha})` 
                        : `rgba(255, 170, 0, ${alpha})`;
                    ctx.fill();
                    
                    if (angleDiff < 0.3) {
                        ctx.beginPath();
                        ctx.arc(contactX, contactY, 8, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(0, 245, 255, ${alpha * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                    ctx.shadowBlur = 0;
                }
            }
            
            if (angleDiff > 0.5) {
                const fadeAlpha = Math.max(0, 0.3 - (angleDiff - 0.5) * 0.1);
                ctx.beginPath();
                ctx.arc(contactX, contactY, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 150, 150, ${fadeAlpha})`;
                ctx.fill();
            }
        });
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#1a2a3a';
        ctx.fill();
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        sweepAngle += sweepSpeed;
        if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;
        
        if (Date.now() - pingTime > pingInterval) {
            pingTime = Date.now();
            triggerSonarPing();
        }
        
        requestAnimationFrame(drawSonar);
    }
    
    function triggerSonarPing() {
        const pingElement = document.getElementById('sonarPing');
        if (pingElement) {
            pingElement.style.animation = 'none';
            pingElement.offsetHeight;
            pingElement.style.animation = 'sonarPing 3s ease-out infinite';
        }
        
        const contactCountEl = document.getElementById('contactCount');
        if (contactCountEl) {
            contactCountEl.textContent = contacts.length + Math.floor(Math.random() * 3) - 1;
        }
    }
    
    drawSonar();
}

/** ========================================
   PRESSURE GRAPH
   ======================================== */
function initializePressureGraph() {
    const canvas = document.getElementById('pressureGraph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = rect.height || 60;
    
    const data = [];
    const dataPoints = 50;
    
    for (let i = 0; i < dataPoints; i++) {
        data.push(1080 + Math.random() * 20 - 10);
    }
    
    function drawGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const y = (canvas.height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 245, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 245, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 245, 255, 0.1)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const stepX = canvas.width / (dataPoints - 1);
        data.forEach((value, index) => {
            const x = index * stepX;
            const normalizedValue = (value - 1060) / 40;
            const y = canvas.height - (normalizedValue * canvas.height);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 245, 255, 0.1)';
        ctx.fill();
        
        const currentValue = data[data.length - 1];
        const normalizedValue = (currentValue - 1060) / 40;
        const currentY = canvas.height - (normalizedValue * canvas.height);
        
        ctx.beginPath();
        ctx.arc(canvas.width - 5, currentY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00f5ff';
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f5ff';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        requestAnimationFrame(drawGraph);
    }
    
    setInterval(() => {
        const lastValue = data[data.length - 1];
        const change = (Math.random() - 0.5) * 5;
        const newValue = Math.max(1070, Math.min(1095, lastValue + change));
        data.push(newValue);
        if (data.length > dataPoints) {
            data.shift();
        }
    }, 500);
    
    drawGraph();
}

/** ========================================
   BIOLUMINESCENT MAP
   ======================================== */
function initializeBioMap() {
    const canvas = document.getElementById('bioMapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = rect.height || 180;
    
    const bioParticles = [];
    const particleCount = 50;
    
    class BioParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.hue = Math.random() * 80 + 160;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.05 + 0.02;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulsePhase += this.pulseSpeed;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            const pulseAlpha = this.alpha * (0.5 + Math.sin(this.pulsePhase) * 0.5);
            const pulseSize = this.size * (0.8 + Math.sin(this.pulsePhase) * 0.4);
            
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${pulseAlpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${pulseAlpha})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        bioParticles.push(new BioParticle());
    }
    
    function drawBioMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        for (let r = 0.33; r <= 1; r += 0.33) {
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * r * 0.4, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2, 10);
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2, canvas.height - 10);
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(10, canvas.height / 2);
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width - 10, canvas.height / 2);
        ctx.stroke();
        
        bioParticles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(drawBioMap);
    }
    
    drawBioMap();
}

/** ========================================
   DATA TICKER
   ======================================== */
function initializeDataTicker() {
    const ticker = document.getElementById('tickerContent');
    if (!ticker) return;
    
    const originalContent = ticker.innerHTML;
    ticker.innerHTML = originalContent + originalContent;
}

/** ========================================
   DEPTH-BASED AMBIENT EFFECTS
   ======================================== */
function initializeDepthEffects() {
    const overlay = document.getElementById('ambientOverlay');
    const depthNumber = document.getElementById('depthNumber');
    
    if (!overlay || !depthNumber) return;
    
    let currentDepth = 10892;
    let targetDepth = currentDepth;
    
    function updateDepth() {
        targetDepth += (Math.random() - 0.5) * 20;
        targetDepth = Math.max(10800, Math.min(11000, targetDepth));
        currentDepth += (targetDepth - currentDepth) * 0.05;
        
        depthNumber.textContent = Math.round(currentDepth).toLocaleString();
        
        const depthFactor = (currentDepth - 10000) / 2000;
        const blueIntensity = Math.min(1, 0.3 + depthFactor * 0.4);
        const redIntensity = Math.max(0, 0.2 - depthFactor * 0.15);
        
        overlay.style.background = `radial-gradient(ellipse at center, transparent 0%, rgba(${Math.round(redIntensity * 30)}, ${Math.round(depthFactor * 40)}, ${Math.round(blueIntensity * 80)}, ${0.3 + depthFactor * 0.2}) 100%)`;
        
        requestAnimationFrame(updateDepth);
    }
    
    updateDepth();
    
    const depthZone = document.querySelector('.depth-zone');
    if (depthZone) {
        if (currentDepth > 10000) {
            depthZone.textContent = 'HADAL ZONE - MARIANA TRENCH';
            depthZone.style.color = '#ff6600';
        } else if (currentDepth > 6000) {
            depthZone.textContent = 'ABYSSAL ZONE';
            depthZone.style.color = '#ffaa00';
        } else {
            depthZone.textContent = 'BATHYPELAGIC ZONE';
            depthZone.style.color = '#00ff88';
        }
    }
}

/** ========================================
   KLAXON SYSTEM
   ======================================== */
function initializeKlaxonSystem() {
    const klaxonBar = document.getElementById('klaxonBar');
    const acknowledgeBtn = document.querySelector('.acknowledge-btn');
    const pressureWarning = document.getElementById('pressureWarning');
    
    if (!klaxonBar) return;
    
    let isAcknowledged = false;
    
    function updateKlaxon() {
        if (isAcknowledged) {
            klaxonBar.style.background = 'linear-gradient(90deg, rgba(255, 170, 0, 0.1) 0%, rgba(255, 170, 0, 0.05) 50%, rgba(255, 170, 0, 0.1) 100%)';
            klaxonBar.style.borderBottomColor = '#ffaa00';
            
            const klaxonText = klaxonBar.querySelector('.klaxon-text');
            if (klaxonText) {
                klaxonText.textContent = 'PRESSURE WARNING ACKNOWLEDGED - MONITORING';
                klaxonText.style.color = '#ffaa00';
            }
        }
        requestAnimationFrame(updateKlaxon);
    }
    
    if (acknowledgeBtn) {
        acknowledgeBtn.addEventListener('click', function() {
            isAcknowledged = true;
            setTimeout(() => {
                klaxonBar.style.display = 'none';
            }, 2000);
        });
    }
    
    if (pressureWarning) {
        setInterval(() => {
            if (!isAcknowledged) {
                pressureWarning.classList.toggle('critical');
            }
        }, 500);
    }
    
    updateKlaxon();
}

/** ========================================
   WARNING MODAL
   ======================================== */
function initializeWarningModal() {
    const modal = document.getElementById('warningModal');
    const acknowledgeBtn = document.querySelector('.btn-acknowledge');
    const dismissBtn = document.querySelector('.btn-dismiss');
    
    if (!modal) return;
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 5000);
    
    if (acknowledgeBtn) {
        acknowledgeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            const klaxonAck = document.querySelector('.acknowledge-btn');
            if (klaxonAck) klaxonAck.click();
        });
    }
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

window.acknowledgeWarning = function() {
    const modal = document.getElementById('warningModal');
    if (modal) modal.classList.remove('active');
    const klaxonAck = document.querySelector('.acknowledge-btn');
    if (klaxonAck) klaxonAck.click();
};

/** ========================================
   INTERACTIVE ELEMENTS
   ======================================== */
function initializeInteractiveElements() {
    const graphBtns = document.querySelectorAll('.graph-btn');
    graphBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            graphBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const stressPoints = document.querySelectorAll('.stress-point');
    stressPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
        });
        point.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    const bioDots = document.querySelectorAll('.bio-detected-dot');
    bioDots.forEach(dot => {
        dot.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.5)';
            const tag = this.querySelector('.species-tag');
            if (tag) tag.style.opacity = '1';
        });
        dot.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
            const tag = this.querySelector('.species-tag');
            if (tag) tag.style.opacity = '0';
        });
    });
    
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 245, 255, 0.1)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('warningModal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        }
        if (e.key === 'a' && e.ctrlKey) {
            const klaxonAck = document.querySelector('.acknowledge-btn');
            if (klaxonAck) klaxonAck.click();
        }
    });
}

/** ========================================
   SYSTEM UPDATES
   ======================================== */
function startSystemUpdates() {
    setInterval(() => {
        const klaxonTime = document.querySelector('.klaxon-time');
        if (klaxonTime) {
            const elapsed = Math.floor((Date.now() - 1680000000000) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            klaxonTime.textContent = `LAST ALERT: 00:${mins}:${secs}`;
        }
    }, 1000);
    
    setInterval(() => {
        const currentSpeedEl = document.getElementById('currentSpeed');
        if (currentSpeedEl) {
            const baseSpeed = 0.42;
            const fluctuation = (Math.random() - 0.5) * 0.1;
            currentSpeedEl.textContent = (baseSpeed + fluctuation).toFixed(2);
        }
        
        const currentNeedle = document.getElementById('currentNeedle');
        if (currentNeedle) {
            const baseAngle = 132;
            const fluctuation = (Math.random() - 0.5) * 20;
            currentNeedle.style.transform = `translate(-50%, -50%) rotate(${baseAngle + fluctuation}deg)`;
        }
        
        const bearingEl = document.getElementById('bearingValue');
        if (bearingEl) {
            const bearing = Math.floor(Math.random() * 360);
            bearingEl.textContent = bearing;
        }
        
        const bioCount = document.getElementById('bioDetectionCount');
        if (bioCount && Math.random() > 0.7) {
            const current = parseInt(bioCount.textContent);
            const change = Math.floor(Math.random() * 3) - 1;
            const newCount = Math.max(15, Math.min(35, current + change));
            bioCount.textContent = newCount;
        }
    }, 2000);
    
    setInterval(() => {
        const stressPoints = document.querySelectorAll('.stress-point');
        stressPoints.forEach(point => {
            const currentValue = parseInt(point.getAttribute('data-value')) || 50;
            const fluctuation = (Math.random() - 0.5) * 5;
            const newValue = Math.max(20, Math.min(98, currentValue + fluctuation));
            point.setAttribute('data-value', Math.round(newValue));
            
            if (newValue > 80) {
                point.classList.remove('high', 'moderate', 'low');
                point.classList.add('critical');
            } else if (newValue > 60) {
                point.classList.remove('critical', 'moderate', 'low');
                point.classList.add('high');
            } else if (newValue > 40) {
                point.classList.remove('critical', 'high', 'low');
                point.classList.add('moderate');
            } else {
                point.classList.remove('critical', 'high', 'moderate');
                point.classList.add('low');
            }
        });
    }, 3000);
    
    setInterval(() => {
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(ind => {
            if (Math.random() > 0.95) {
                if (ind.classList.contains('operational')) {
                    ind.classList.remove('operational');
                    ind.classList.add('warning');
                } else if (ind.classList.contains('warning')) {
                    ind.classList.remove('warning');
                    ind.classList.add(Math.random() > 0.5 ? 'operational' : 'critical');
                } else if (ind.classList.contains('critical')) {
                    ind.classList.remove('critical');
                    ind.classList.add('warning');
                }
            }
        });
    }, 10000);
}

/** ========================================
   UTILITY FUNCTIONS
   ======================================== */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Console Easter Egg
console.log('%c HADAL RESEARCH STATION "ABYSSAL GUARDIAN"', 'color: #00f5ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00f5ff;');
console.log('%c Operations Dashboard v2.4.7', 'color: #00ff88; font-size: 12px;');
console.log('%c Depth: 10,892m | Status: OPERATIONAL | Hull Integrity: 87%', 'color: #8899aa; font-size: 10px;');